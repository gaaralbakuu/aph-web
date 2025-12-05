<template>
	<div class="app-container" v-loading="pageLoading">
		<div class="filter-container">
			<el-date-picker
				v-model="query.queryString.daterange"
				type="daterange"
				format="yyyy-MM-dd"
				value-format="yyyy-MM-dd"
				:range-separator="$l.to"
				:start-placeholder="$l.Startdate"
				:end-placeholder="$l.Enddate"
			></el-date-picker>
			<el-input style="width: 250px" :placeholder="$l.search" clearable prefix-icon="el-icon-search" class="filter-item" v-model="query.queryString.content"></el-input>
			<el-button class="filter-item" type="success" plain @click="search">{{ $c.queryButton }}</el-button>
		</div>

		<el-table stripe :data="tableData" v-loading="pageLoading" border style="width: 100%">
			<el-table-column prop="create_time" :label="$l.date" width="150"></el-table-column>
			<el-table-column prop="create_user" :label="$l.user" width="100"></el-table-column>

			<el-table-column prop="content" :label="$l.proposal"></el-table-column>
			<el-table-column :label="$l.screenshot" width="200">
				<template slot-scope="scope">
					<a class="text-blue" @click.prevent="showImgs(scope.row)" v-if="scope.row.imgs">{{ scope.row.imgSrcs.length }} {{ $l.Picture }}</a>
				</template>
			</el-table-column>

			<el-table-column prop="reassignment_no" :label="$l.reassignment_no" width="100"></el-table-column>
			<el-table-column prop="reply_qty" :label="$l.reply_qty" width="50"></el-table-column>

			<el-table-column prop="last_reply" :label="$l.last_reply" width="100"></el-table-column>
			<el-table-column prop="reply_time" :label="$l.reply_time" width="150"></el-table-column>

			<el-table-column prop="modify_user" :label="$l.modify_user" width="100"></el-table-column>
			<el-table-column prop="modify_time" :label="$l.modify_time" width="150"></el-table-column>
			<el-table-column fixed="right" :label="$c.operation" width="220">
				<template slot-scope="scope">
					<el-button @click="replylist(scope.$index)" type="primary" size="mini">{{ $c.queryButton }}</el-button>
					<el-button type="success" size="mini" @click="reply(scope.$index)">{{ $c.replymessage }}</el-button>
					<el-button type="danger" @click="transfershow(scope.$index)" size="mini">{{ $c.dispatch }}</el-button>
				</template>
			</el-table-column>
		</el-table>
		<viewer :images="imgSrcs">
			<div class="img-box" ref="viewer" v-for="(src, index) in imgSrcs" :key="index"><img :src="src" :key="src" /></div>
		</viewer>

		<el-pagination
			@size-change="handleSizeChange"
			@current-change="handleCurrentChange"
			:current-page="query.page"
			:page-sizes="[10, 20, 50, 100]"
			:page-size="query.size"
			layout="total, sizes, prev, pager, next, jumper"
			:total="total"
		></el-pagination>

		<el-dialog v-if="tableData.length != 0" title="信息回复" :visible.sync="dialogVisible" width="40%" :before-close="handleClose">
			<h3>{{ $l.proposal }}</h3>
			<span>{{ tableData[index].content }}</span>
			<br />
			<h3></h3>
			<div class="radio">
				回复时是否需要自动带上建议内容：
				<el-switch v-model="suggestionpz" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
			</div>
			<el-input type="textarea" :autosize="{ minRows: 4 }" placeholder="请输入回复内容" v-model="textarea1"></el-input>

			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取消</el-button>
				<el-button type="primary" @click="feedback">回复</el-button>
			</span>
		</el-dialog>

		<el-dialog title="回复信息查询" :visible.sync="replylistVisible" width="60%" :before-close="handleClose">
			<div class="block">
				<div class="radio">
					排序：
					<el-radio-group v-model="replylistreverse">
						<el-radio :label="true">倒序</el-radio>
						<el-radio :label="false">正序</el-radio>
					</el-radio-group>
				</div>

				<el-timeline :reverse="replylistreverse">
					<el-timeline-item v-for="(activity, index) in replylistdata" :key="index" :icon="timelineicon" color="#0bbd87" type="primary" :timestamp="activity.create_time">
						回复用户：{{ activity.create_user }} 回复内容：{{ activity.body }}
					</el-timeline-item>
				</el-timeline>
			</div>

			<span slot="footer" class="dialog-footer"><el-button @click="replylistVisible = false">返回</el-button></span>
		</el-dialog>

		<el-dialog title="回复转派" :visible.sync="transferVisible" width="30%" :before-close="handleClose">
			<div class="block">
				员工编号
				<el-input placeholder="请输入转派后新回复者的员工编号" v-model="transferempno" clearable></el-input>
			</div>

			<span slot="footer" class="dialog-footer">
				<el-button @click="transferVisible = false">取消</el-button>
				<el-button @click="transferaction">转派</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script>
//import api from '@/api'
import 'viewerjs/dist/viewer.css';

import Viewer from 'v-viewer';
import Vue from 'vue';
import { createLogger } from 'vuex';

import { _, api, defaultConfig,initFuncs, zFormDialog, zPagination, zTable } from '@/views/_common';

Vue.use(Viewer, {
	defaultOptions: {
		zIndex: 999999
	}
});

export default {
	name: 'userfeedback',
	data: function() {
		return {
			index: 0,
			suggestionpz: false,
			tableData: [],
			textarea1: '',
			pageLoading: true,
			query: {
				queryString: { content: '', system: '', daterange: [] },
				size: 10,
				page: 1
			},
			total: null,
			name: this.$l.title,
			imgSrcs: [],
			dialogVisible: false,
			feedbackdata: {
				subject: '23213',
				body: '123123',
				payload: '',
				empnopz: 'N',
				orgidpz: 'N',
				deptnopz: 'N',
				otherspz: 'N',
				messagesourcessystem: 'app.userfeedback',
				messagesourcesid: '',
				userList: [],
				sendAll: 0
			},
			replylistVisible: false,
			replylistreverse: true, //排序方式
			timelineicon: '#0bbd87',
			timelinecolor: 'el-icon-more',
			replylistdata: [],
			transferVisible: false, //转派
			transferempno: '' //转派后的员工编号
		};
	},
	created() {
		this.getList();
	},
	methods: {
		handleClose() {
			if ((this.dialogVisible = true)) {
				this.dialogVisible = false;
			}
			if ((this.replylistVisible = true)) {
				this.replylistVisible = false;
			}
		},

		transfershow(e) {
			this.transferVisible = true;
			this.index = e;
		},
		transferaction() {
			if (this.transferempno == '') {
				this.$alert('新转派的员工编号不能为空', '提示信息', {
					confirmButtonText: '确定',
					callback: action => {},
					type: 'warning'
				});
				return;
			}
			this.$confirm(' 确认将此回复工作，转派给：' + this.transferempno + ' ?', '请确定', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					this.transferVisible = false;

					let url = api.suggest + 'gettransfer'; ///Platform/suggest/gettransfer
					//  console.log({{tableData[index].create_user}});
					this.$request(url, { suggestid: this.tableData[this.index].id, enpno: this.transferempno })
						.then(r => {
							// console.log(r)
							this.transferempno = '';
							// location.reload();  强制刷新介面内容
							this.getList();
						})
						.catch(e => {
							console.log(e);
						});
				})
				.catch(() => {
					return;
				});
		},
		reply(e) {
			this.suggestionpz = false;
			let vstr = this.tableData[e].content;
			vstr = vstr.substring(0, 20);
			console.log(vstr);
			// this.textarea1='';
			// this.feedbackdata.subject=this.tableData[e].create_user+" "+this.tableData[e].create_time+ " 提出" //+vstr.content.substring(0,20) //this.tableData[e].content;
			this.feedbackdata.subject = ' 您于' + this.tableData[e].create_time + ' 提出《' + vstr + '》'; //this.tableData[e].content;
			console.log(this.feedbackdata.subject);
			this.feedbackdata.body = '您提出建议： \r\n' + this.tableData[e].content + ' ';
			this.feedbackdata.userList = [];
			this.feedbackdata.messagesourcesid = this.tableData[e].id;
			this.feedbackdata.userList.push(this.tableData[e].create_user);
			this.dialogVisible = true;
			this.index = e;
		},

		replylist(e) {
			let url = api.Message + 'getMessagelist';
			let umesgid = this.tableData[e].id;

			this.$request(url, { vmessagesourcessystem: 'app.userfeedback', vmessagesourcesid: this.tableData[e].id, vempno: '' })
				.then(r => {
					this.pageLoading = false;
					console.log(r);
					this.replylistdata = r.data;
					// this.list = r.data.list
				})
				.catch(() => {
					this.pageLoading = false;
				});

			this.replylistVisible = true;
			this.index = e;
		},
		feedback() {
			if (this.textarea1 == '') {
				this.$alert('回复内容不能为空', '提示信息', {
					confirmButtonText: '确定',
					callback: action => {},
					type: 'warning'
				});
				return;
			}
			this.$confirm(this.textarea1 + ' ，确认将此内容回复给用户?', '请确定', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					this.dialogVisible = false;
					let url = api.Message + 'createAppMessgae';
					//  console.log({{tableData[index].create_user}});
					//  this.feedbackdata.userList=['42222'];
					console.log(this.feedbackdata.userList);

					if (this.suggestionpz) {
						this.feedbackdata.body = this.feedbackdata.body + '\r\n 回复如下：\r\n' + this.textarea1;
					} else {
						this.feedbackdata.body = this.textarea1;
					}
					// this.feedbackdata.body + '\r\n 回复如下：\r\n' + this.textarea1
					//this.textarea1
					//   this.feedbackdata.subject=tableData[index].create_user+" "+tableData[index].create_time+ " 回复" +tableData[e].content.substring(0,20) //this.tableData[e].content;
					this.feedbackdata.userList.push('42222');
					this.suggestionpz = false;
					this.$request(url, this.feedbackdata, 'post')
						.then(r => {
							console.log(r);
							this.textarea1 = '';
							this.feedbackdata.userList = [];
							// location.reload();  强制刷新介面内容
							this.getList();
						})
						.catch(e => {
							console.log(e);
						});
				})
				.catch(() => {
					return;
				});
		},
		handleSizeChange(val) {
			this.query.size = val;
			this.getList();
		},
		handleCurrentChange(val) {
			this.query.page = val;
			this.getList();
		},

		getList() {
			this.pageLoading = true;
			let url = api.userfeedback + 'getlist';
			if (this.query.queryString.daterange && this.query.queryString.daterange.length > 0) {
				this.query.queryString.begintime = this.query.queryString.daterange[0];
				this.query.queryString.endtime = this.query.queryString.daterange[1];
			}
			this.$request(url, this.query)
				.then(r => {
					console.log(r);
					r.data.list.forEach(i => {
						if (i.imgs) i.imgSrcs = i.imgs.split(',');
					});
					console.log(r.data.list);
					this.tableData = r.data.list;
					// this.list = this.formatList(r.data.list)
					this.total = r.data.total;
					// this.total = this.tableData.length
					this.pageLoading = false;
				})
				.catch(() => {
					this.pageLoading = false;
				});
		},
		search() {
			this.getList();
		},
		showImgs(row) {
			this.imgSrcs = row.imgSrcs;
			this.$nextTick(() => {
				setTimeout(() => {
					this.$refs.viewer[0].children[0].click();
				}, 500);
			});
		}
	}
};
</script>
<style scoped>
.img-box {
	width: 0px;
	height: 0px;
	overflow: hidden;
}
</style>

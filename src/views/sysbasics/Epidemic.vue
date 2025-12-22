<template>
	<div ref="hello" class="app-container" v-loading="pageLoading">
		<el-button type="primary" class="fr" @click="createItem">{{ $c.create }}</el-button>
		<div class="filter-container">
			<el-input
				style="width: 300px;"
				:placeholder="$c.queryPlaceholder"
				clearable
				prefix-icon="el-icon-search"
				class="filter-item"
				@keyup.enter.native="research"
				@clear="research"
				v-model="query.queryString"
			></el-input>
			<el-button class="filter-item" type="success" plain @click="research">{{ $c.queryButton }}</el-button>
			<el-button class="filter-item" type="info" plain @click="exportData" :loading="exportLoading">{{ $c.export }}</el-button>
		</div>
		<z-table :list="list" :tableProps="tableProps" :columns="columns" @editItem="editItem" @deleteItem="deleteItem">
			<template v-slot:content="{ row, key }">
				<div v-if="key == 'epidemicdate'">
					<span>{{ row[key] | datetime }}</span>
				</div>
				<span v-else>{{ row[key] }}</span>
			</template>
			<template v-slot:operation="v">
				<a href="#" class="text-blue" @click.prevent="editItem(v.row, v.$index)">{{ $c.edit }}</a>
				<span>&nbsp;</span>
				<a href="#" class="text-green" @click.prevent="copyItem(v.row, v.$index)">{{ $c.copy }}</a>
				<span>&nbsp;</span>
				<a href="#" class="text-red" @click.prevent="deleteItem(v.row, v.$index)">{{ $c.delete }}</a>
				<span>&nbsp;</span>
				<a href="#" class="text-blue" @click.prevent="pushItem(v.row, v.$index)">{{ $c.push }}</a>
			</template>
		</z-table>
		<z-pagination :pagination="pagination" :total="total" :page.sync="query.page" :limit.sync="query.size" @change="getList"></z-pagination>
		<z-form-dialog
			:name="name"
			:data="data"
			:formProps="formProps"
			:fields="fields"
			@submmit="submmit"
			:submmitLoading="submmitLoading"
			:visible.sync="editFormVisible"
		></z-form-dialog>
		<z-form-dialog :name="name" :data="data" :formProps="formProps" :fields="userFields" @submmit="push" :submmitLoading="submmitLoading" :visible.sync="pushFormVisible">
			<template v-slot:operation1="v">
				<div style="text-align: center;padding-left: 75px;">
					<div style="min-height: 36px;">
						<div class="flex flex-center" style="font-size: 12px; margin-bottom:10px;">
							<span style="font-size: 20px;font-weight: bold;">{{ $l.pushList }}</span>
							<div class="flex1"></div>
							<el-input style="display:inline-block;width: 200px;" suffix-icon="el-icon-search" size="mini" clearable v-model="userQueryId"></el-input>
							<el-button class="ml-5" size="mini" type="primary" icon="el-icon-plus" circle plain @click="addUserItem"></el-button>
						</div>
					</div>
					<div>
						<z-table :list="userTable" :tableProps="userTableProps" :columns="userColumns">
							<template v-slot:operation="v">
								<a href="#" class="text-red" @click.prevent="deleteUserItem(v.row, v.$index)">{{ $c.delete }}</a>
							</template>
						</z-table>
					</div>
				</div>
			</template>
		</z-form-dialog>
	</div>
</template>

<script>
import { _, api, defaultConfig,initFuncs, zFormDialog, zPagination, zTable } from '@/views/_common';

const config = Object.assign({}, _.cloneDeep(defaultConfig), {
	api: api.epidemic,
	apiBpmUser:api.BpmUser,
	apimessage:api.message,
	apiCreate: api.epidemic + 'update'
});
export default {
	components: {
		zTable,
		zFormDialog,
		zPagination
	},
	name: 'epidemic',
	data: function() {
		return {
			...config,
			pushFormVisible: false,
			dialogVisible: false,
			name: this.$l.title,
			columns: [
				{
					title: this.$l.epidemicbegdate,
					key: 'epidemicbegdate',
					width: 160
				},
				{
					title: this.$l.epidemicenddate,
					key: 'epidemicenddate',
					width: 200
				},
				{
					title: this.$l.epidemicdate,
					key: 'epidemicdate',
					width: 200
				},
				{
					title: this.$l.username,
					key: 'username'
				},
				{
					title: this.$l.epidemic_note,
					key: 'epidemic_note',
					width: 100
				},
				{
					title: this.$c.modify_user,
					key: 'modify_user'
				},
				{
					title: this.$c.modify_time,
					key: 'modify_time'
				}
			],
			fields: [
				{
					title: this.$l.epidemicbegdate,
					key: 'epidemicbegdate',
					span: 12,
					name: 'date',
					props: {
						type: 'datetime',
						valueFormat: 'yyyy-MM-dd HH:mm:ss'
					}
				},
				{
					title: this.$l.epidemicenddate,
					key: 'epidemicenddate',
					span: 12,
					name: 'date',
					props: {
						type: 'datetime',
						valueFormat: 'yyyy-MM-dd HH:mm:ss'
					}
				},
				{
					title: this.$l.epidemicdate,
					key: 'epidemicdate',
					span: 12,
					name: 'date',
					props: {
						type: 'date',
						valueFormat: 'yyyy-MM-dd'
					}
				},

				{
					title: this.$l.username,
					key: 'username',
					required: true
				},
				{
					title: this.$l.epidemic_note,
					key: 'epidemic_note',
					required: true
				}
			],
			tableProps: {
				border: true,
				opsColWith: 160
			},
			typeOptions: [],
			userFields: [
				{
					title: this.$l.subTitle,
					key: 'subject',
					required: true
				},
				{
					title: this.$l.msgBody,
					name: 'textarea',
					key: 'body',
					required: true
				},
				{
					title: this.$l.sendAll,
					key: 'sendAll',
					name: 'select',
					events: {},
					options: [
						{
							value: 0,
							label: 'N'
						},
						{
							value: 1,
							label: 'Y'
						}
					],
					props: {
						placeholder: this.$l.sendAllPd
					},
					required: true,
					span: 6
				},
				{
					title: this.$l.userid,
					key: 'empnopz',
					name: 'select',
					events: {},
					options: [
						{
							value: 'N',
							label: 'N'
						},
						{
							value: 'Y',
							label: 'Y'
						}
					],
					props: {
						placeholder: '是否拼接工号'
					},
					required: true,
					span: 6
				},
				{
					title: this.$l.department,
					key: 'deptnopz',
					name: 'select',
					events: {},
					options: [
						{
							value: 'N',
							label: 'N'
						},
						{
							value: 'Y',
							label: 'Y'
						}
					],
					props: {
						placeholder: '是否拼接部门id'
					},
					required: true,
					span: 6
				},
				{
					title: this.$l.organization,
					key: 'orgidpz',
					name: 'select',
					events: {},
					options: [
						{
							value: 'N',
							label: 'N'
						},
						{
							value: 'Y',
							label: 'Y'
						}
					],
					props: {
						placeholder: '是否拼接组织id'
					},
					required: true,
					span: 6
				},
				{
					title: this.$l.otherpz,
					key: 'otherspz',
					required: true
				}
			],
			userColumns: [{ title: this.$l.userid, key: 'uid' }, { title: this.$l.userName, key: 'uName' }, { title: this.$l.department, key: 'orgName' }],
			userTableProps: {
				border: true,
				opsColWith: 60,
				highlightCurrentRow: true
			},
			userQueryId: '',
			userTable: [],
			userList: []
		};
	},
	methods: {
		...initFuncs,
		copyItem(v) {
			this.data = _.cloneDeep(this.initData);
			this.pageLoading = true;
			this.$request(this.api + 'getbyid', {
				id: v.id
			})
				.then(r => {
					this.pageLoading = false;
					this.data = this.formatAfterGet(r.data);
					this.data.id = null;
					this.editFormVisible = true;
				})
				.catch(() => {
					this.pageLoading = false;
				});
		},

		pushItem(v) {
			// console.log(v);
			this.data.subject = '';
			this.data.body = '';
			this.$forceUpdate();
			this.pushFormVisible = true;
			this.pageLoading = true;
			this.data.empnopz = 'N';
			this.data.orgidpz = 'N';
			this.data.deptnopz = 'N';
			this.data.otherspz = 'N';
			this.data.sendAll = 0;
			this.data.payload = '/pages/hr/contactees?id=' + v.id;
			this.data.subject = '现进行密接调查：' + v.username;
			this.data.body = '调查对象：' + v.username + '，' + '\r\n调查开始时间：' + v.epidemicbegdate + '，' + '\r\n调查结束时间：' + v.epidemicenddate + '，';
			this.pageLoading = false;
		},
		
		test(){
			console.log('操作执行了');
		},

		pushAction() {
			this.data.userList = this.userList;
			console.log(this.data);
			this.$request(apimessage+'createAppMessgae', this.data, 'post').then(r => {
				this.data.userList = [];
				this.userList = [];
				this.userTable = [];
				location.reload();
			});
		},

		push() {
			if (this.data.sendAll == 1) {
				this.$confirm('此操作将推送全部用户，是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				})
					.then(() => {
						this.pushAction();
						// this.test()
					})
					.catch(() => {
						return;
					});
			} else {
				this.pushAction();
				// this.test()
			}
		},

		deleteUserItem(row, index) {
			this.userTable.splice(index, 1);
			this.userList.splice(index, 1);
			console.log(this.userList);
			console.log(this.userTable);
		},

		addUserItem() {
			if (this.userList.indexOf(this.userQueryId) != -1) {
				console.log('已存在');
				return;
			}
			this.$request(apiBpmUser+'getcurrentuserbyid', { id: this.userQueryId }).then(res => {
				console.log();
				if (res.data != null && this.userList.indexOf(res.data.uid) == -1) {
					this.userTable.unshift(res.data);
					this.userList.unshift(res.data.uid);
					this.userQueryId = '';
				}
			});
		}
	},
	created: function() {
		this.getList();
	}
};
</script>
<style scoped></style>

<template>
	<div class="app-container" v-loading="pageLoading">
		<el-button type="primary" class="fr" @click="createItem">创建</el-button>
		<!-- <el-button type="primary" class="fr" @click="createItem">{{ $l.createItem }}</el-button> -->
		<div class="filter-container">
			<el-input
				style="width: 300px;"
				:placeholder="$l.search"
				clearable
				prefix-icon="el-icon-search"
				class="filter-item"
				@keyup.enter.native="research"
				@clear="research"
				v-model="query.id"
			></el-input>
		</div>
		<el-row :gutter="20">
			<el-col :span="10">
				<z-table :list="list" :tableProps="tableProps" :columns="columns" @row-click="rowClick" @editItem="editItem" @deleteItem="deleteItem"></z-table>
				<z-pagination :pagination="pagination" :total="total" :page.sync="query.curPage" :limit.sync="query.pageSize" @change="getList"></z-pagination>
			</el-col>
			<el-col :span="14">
				<z-table :list="detailList" :tableProps="detailTableProps" :columns="detailColumns" @editItem="editDetailItem" @deleteItem="deleteDetailItem"></z-table>
				<z-pagination :pagination="pagination" :total="detailTotal" :page.sync="detailQuery.curPage" :limit.sync="detailQuery.pageSize" @change="rowClick"></z-pagination>
			</el-col>
		</el-row>
		<z-form-dialog
			:name="name"
			:data="data"
			:formProps="formProps"
			:fields="fields"
			@submmit="submmit"
			:submmitLoading="submmitLoading"
			:visible.sync="editFormVisible"
		></z-form-dialog>
		<z-form-dialog
			:name="name"
			:data="data"
			:formProps="formProps"
			:fields="detailFields"
			@submmit="detailSubmmit"
			:submmitLoading="submmitLoading"
			:visible.sync="editDetailVisible"
		></z-form-dialog>
	</div>
</template>

<script>
import { arrayToObject, dateTools } from '@/utils';
import { _, api, zFormDialog,zPagination, zTable } from '@/views/_common';

const emptyData = {};
export default {
	name: 'demo',
	components: { zTable, zFormDialog, zPagination },
	data: function() {
		return {
			api: api.publiccode,
			name: this.$l.title,
			columns: [
				{ title: this.$l.role_id, key: 'rule_no' },
				{ title: this.$l.role_id, key: 'name_zh' },
				{ title: this.$l.role_name, key: 'lengths' },
				{ title: this.$l.role_desc, key: 'rule_type' },
				{ title: this.$l.role_desc, key: 'code_pz' }
			],
			fields: [
				{ title: 'rule_no', key: 'rule_no', required: true },
				{ title: 'role_name', key: 'role_name', required: true },
				{ title: 'role_desc', key: 'role_desc', required: true }
			],
			detailFields: [
				{ title: 'name_zh', key: 'name_zh', required: true },
				{ title: 'name_tw', key: 'name_tw', required: true },
				{ title: 'name_en', key: 'name_en', required: true }
			],
			tableProps: {
				border: true,
				opsColWith: 100,
				highlightCurrentRow: true
			},
			formProps: {
				dialogWidth: '70%',
				labelWidth: '140px'
			},
			query: {
				queryString: {},
				pageSize: 10,
				curPage: 1,
				id: ''
			},
			pagination: {
				// 分页组件配置 如不需分页，可以把pagination设置为null
				layout: 'prev, pager, next, jumper, ->, total, sizes'
			},
			pageLoading: false,
			submmitLoading: false,
			saveMenuLoading: false,
			saveEmpLoading: false,
			editDetailVisible: false,
			list: [],
			total: 0,
			data: { ...emptyData },
			editFormVisible: false,
			currentDataId: 0,
			menuData: [],
			detailColumns: [
				{ title: this.$l.userid, key: 'name_zh' },
				{ title: this.$l.username, key: 'name_tw' },
				{ title: this.$l.username, key: 'name_en' },
				{ title: this.$l.username, key: 'create_time' },
				{ title: this.$l.username, key: 'modify_time' }
			],
			detailTableProps: {
				border: true,
				opsColWith: 60,
				highlightCurrentRow: true
			},
			detailList: [],
			detailTotal: 0,
			detailQuery: {
				queryString: {},
				ruleno: '',
				orgid: 200,
				pageSize: 10,
				curPage: 1
			},
			detailPagination: {
				layout: 'prev, pager, next'
			},
			addUsers: '',
			submitAddUserLoading: false
		};
	},
	methods: {
		getList() {
			this.pageLoading = true;
			this.$request(this.api + 'getlist', this.query)
				.then(r => {
					this.pageLoading = false;
					this.list = r.data.list;
					this.total = r.data.total;
				})
				.catch(() => {
					this.pageLoading = false;
				});
		},

		research() {
			this.query.curPage = 1;
			this.total = 0;
			this.list = [];
			if (this.query.id) {
			}
			this.getList();
		},
		createItem() {
			this.data = { ...emptyData };
			this.editFormVisible = true;
		},

		editItem(v) {
			this.pageLoading = true;
			this.$request(this.api + 'getbyid', { id: v.id })
				.then(r => {
					this.pageLoading = false;
					this.data = r.data;
					this.editFormVisible = true;
				})
				.catch(() => {
					this.pageLoading = false;
				});
		},
		editDetailItem(v) {
			this.pageLoading = true;
			this.$request(this.api + 'getbyiddetailed', { id: v.id })
				.then(r => {
					this.pageLoading = false;
					this.data = r.data;
					this.editDetailVisible = true;
				})
				.catch(() => {
					this.pageLoading = false;
				});
		},

		deleteItem(v) {
			this.$confirm(this.$c.cfmDelete, this.$c.oprConfirm).then(() => {
				this.pageLoading = true;
				this.$request(this.api + 'delete/' + v.id, {}, 'post')
					.then(r => {
						this.pageLoading = false;
						this.$message({
							message: this.$c.success,
							type: 'success'
						});
						this.currentDataId = 0;
						this.getList();
					})
					.catch(() => {
						this.pageLoading = false;
					});
			});
		},

		deleteDetailItem(v) {
			this.$confirm(this.$c.cfmDelete, this.$c.oprConfirm).then(() => {
				this.pageLoading = true;
				this.$request(this.api + 'delete/' + v.id, {}, 'post')
					.then(r => {
						this.pageLoading = false;
						this.$message({
							message: this.$c.success,
							type: 'success'
						});
						this.currentDataId = 0;
						this.getList();
					})
					.catch(() => {
						this.pageLoading = false;
					});
			});
		},

		submmit: function() {
			return
			this.submmitLoading = true;
			let url = this.api + 'add';
			if (!this.data.role_id) this.data.role_id = dateTools.now_time().replace(/[- :]/g, '') + '001';
			this.$request(url, this.data, 'post')
				.then(r => {
					this.submmitLoading = false;
					this.$message({
						message: this.$c.success,
						type: 'success'
					});
					this.editFormVisible = false;
					this.getList();
				})
				.catch(() => {
					this.submmitLoading = false;
				});
		},

		detailSubmmit() {
			return
			if (!this.addUsers) return this.$message.error(this.$l.addUserIsEmpty);
			let user_ids = this.addUsers.replace('，', ',').split(',');
			this.submitAddUserLoading = true;
			this.$request(
				this.api + 'batchadduser/',
				{
					role_id: this.currentDataId,
					user_ids
				},
				'post'
			)
				.then(r => {
					this.$message.success(this.$c.success);
					this.editDetailVisible = false;
					this.submitAddUserLoading = false;
					this.addUsers = '';
				})
				.catch(() => {
					this.submitAddUserLoading = false;
				});
		},

		rowClick(row) {
			console.log(row);
			if (row.rule_no) {
				this.detailQuery.ruleno = row.rule_no;
			}

			this.$request(this.api + 'getListdetailed', this.detailQuery)
				.then(r => {
					this.pageLoading = false;
					this.detailList = r.data.list;
					this.detailTotal = r.data.total;
				})
				.catch(() => {
					this.pageLoading = false;
				});
		}
	},
	created: function() {
		this.getList();
	},
	watch: {
		data: function(val) {}
	}
};
</script>

<style scoped>
.custom-tree-node {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: space-between;
	font-size: 12px;
	padding-right: 8px;
}
</style>

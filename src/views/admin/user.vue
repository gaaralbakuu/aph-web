<template>
	<div class="app-container" v-loading="pageLoading">
		<el-button type="primary" class="fr" @click="addUser">{{ $c.create }}</el-button>
		<!-- <el-button key="import" class="fr" type="success" style="margin-right: 5px;" @click="dialogExcelVisible = true">导入</el-button> -->
		<div class="filter-container">
			<el-input
				style="width: 300px"
				:placeholder="$c.queryPlaceholder"
				clearable
				prefix-icon="el-icon-search"
				class="filter-item"
				@keyup.enter.native="research"
				@clear="research"
				v-model="query.queryString"
			></el-input>
			<el-select style="width: 140px" class="filter-item" v-model="query.status">
				<el-option value="" :label="$c.all"></el-option>
				<el-option value="0" :label="$c.enabled"></el-option>
				<el-option value="1" :label="$c.disabled"></el-option>
			</el-select>
			<el-button class="filter-item" type="success" plain @click="research">{{ $c.queryButton }}</el-button>
			<el-button class="filter-item" type="info" plain @click="exportData" :loading="exportLoading">{{ $c.export }}</el-button>
		</div>
		<z-table :list="list" :tableProps="tableProps" :columns="userObj.columns" @editItem="editItem" @deleteItem="deleteItem">
			<template v-slot:content="{ row, key }">
				<div v-if="key == 'in_date' || key == 'out_date'">
					<span>{{ row[key] | datetime }}</span>
				</div>
				<div v-else-if="key == 'enable'">
					<span class="label" :class="row[key] == '0' ? 'bg-green' : 'bg-gray'">{{ row[key] == '0' ? 'Y' : 'N' }}</span>
				</div>
				<div v-else-if="key == 'register'">
					<span class="label" :class="row.password ? 'bg-green' : 'bg-gray'">{{ row.password ? 'Y' : 'N' }}</span>
				</div>
				<span v-else>{{ row[key] }}</span>
			</template>
			<template v-slot:operation="v">
				<a href="#" class="text-blue" @click.prevent="editItem(v.row, v.$index)">{{ $l.editItem }}</a>
				&nbsp;
				<a href="#" class="text-red" @click.prevent="deleteItem(v.row, v.$index)">{{ $c.delete }}</a>
				&nbsp;
				<a href="#" class="text-yellow" @click.prevent="forceChangePass(v.row, v.$index)">{{ $l.changePwd }}</a>
				&nbsp;
			</template>
		</z-table>
		<z-pagination :pagination="pagination" :total="total" :page.sync="query.page" :limit.sync="query.size" @change="getList"></z-pagination>
		<z-form-dialog
			:name="name"
			:data="data"
			:formProps="formProps"
			:fields="userObj.fields"
			@submmit="submmit"
			:submmitLoading="submmitLoading"
			:visible.sync="editFormVisible"
		></z-form-dialog>
		<el-dialog :title="$l.dropDept" :visible.sync="dropDeptVisible">
			<el-input
				style="width: 300px"
				:placeholder="$c.queryPlaceholder"
				clearable
				prefix-icon="el-icon-search"
				class="filter-item"
				@keyup.enter.native="researchDept"
				@clear="researchDept"
				v-model="deptObj.query"
			></el-input>
			<z-table :list="deptObj.list" :tableProps="tableProps" :columns="deptObj.columns">
				<template v-slot:operation="v">
					<a href="#" class="text-blue" @click.prevent="sendDeptItem(v.row, v.$index)">{{$c.confirm}}</a>
					&nbsp;
				</template>
			</z-table>
			<z-pagination :pagination="pagination" :total="deptObj.total" :page.sync="deptObj.curPage" :limit.sync="deptObj.pageSize" @change="researchDept"></z-pagination>
		</el-dialog>

		<!-- <el-dialog title="Excel导入" :visible.sync="dialogExcelVisible">
      <div style="margin-bottom: 10px;"><a href="#" @click.prevent="getTemp">下载批量导入用户模板</a></div>
      <upload-excel-component ref="uploadExcel" :on-success="handleSuccess" :before-upload="beforeUpload" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogExcelVisible = false">取消</el-button>
        <el-button type="primary" :loading="excelLoading" @click="excelSubmit()">
          确认
        </el-button>
      </div>
    </el-dialog> -->
	</div>
</template>

<script>
import { _, api, zTable, zPagination, zFormDialog, initFuncs, defaultConfig } from '@/views/_common';
import UploadExcelComponent from '@/components/UploadExcel';
import dayjs from 'dayjs';

const config = Object.assign({}, _.cloneDeep(defaultConfig), {
	api: api.user,
	apipubliccode:api.publiccode,
	apiSydept:api.Sydept,
	apiList: api.user + 'getlist',
	apiSingle: api.user + 'getWithRoles',

	tableProps: {
		border: true,
		opsColWith: 150
	},
	query: {
		status: '0',
		size: 10,
		page: 1
	},
	initData: {
		data: {
			department_t: null,
			dept_no: null,
			org_id: null,
			password: '7C4A8D09CA3762AF61E59520943DC26494F8941B', //初始密码为123456
			enable: '0', //默认启用
			roles: ['10001'] //默认添加为一般员工，获取用户菜单
		}
	}
});
export default {
	components: { zTable, zFormDialog, zPagination, UploadExcelComponent },
	name: 'adminUser',
	data: function() {
		return {
			...config,
			name: this.$l.title,
			data: {
				department_t: null,
				dept_no: null,
				org_id: null,
				password: '7C4A8D09CA3762AF61E59520943DC26494F8941B', //初始密码为123456
				enable: '0', //默认启用
				roles: ['10001'] //默认添加为一般员工，获取用户菜单
			},
			deptObj: {
				query: '',
				list: [],
				pageSize: 10,
				total: 0,
				curPage: 1,
				columns: [
					{ title: this.$l.org_id, key: 'org_id', width: 100 },
					{ title: this.$l.dept_no, key: 'dept_no', width: 100 },
					{ title: this.$l.dept_name, key: 'dept_name_zh', width: 100 },
					{ title: this.$l.up_dept_no, key: 'up_dept_no', width: 100 },
					{ title: this.$l.up_deptname, key: 'up_deptname' }
				]
			},
			userObj: {
				columns: [
					{ title: this.$l.userid, key: 'userid', width: 100 },
					{ title: this.$l.username, key: 'username', width: 100 },
					{ title: this.$l.department, key: 'department_t' },
					{ title: this.$l.work_name, key: 'work_name' },
					{ title: this.$l.instel, key: 'instel', width: 120 },
					{ title: this.$l.register, key: 'register', width: 100 },
					{ title: this.$l.in_date, key: 'in_date', width: 100 },
					{ title: this.$l.out_date, key: 'out_date', width: 100 },
					{ title: this.$l.last_date, key: 'last_date', width: 150 },
					{ title: this.$l.enable, key: 'enable', width: 100 }
				],
				fields: [
					{ title: this.$l.userid, key: 'userid', span: 8 },
					{
						title: this.$l.username,
						key: 'username',
						span: 8
					},
					{ title: this.$l.instel, key: 'instel', span: 8 },
					{ title: this.$l.name_t, key: 'name_t', span: 8 },
					{ title: this.$l.name_s, key: 'name_s', span: 8 },
					{ title: this.$l.name_e, key: 'name_e', span: 8 },
					{
						title: this.$l.in_date,
						key: 'in_date',
						name: 'date',
						span: 8,
						props: {
							type: 'date',
							valueFormat: 'yyyy-MM-dd'
						}
					},
					{
						title: this.$l.out_date,
						key: 'out_date',
						name: 'date',
						span: 8,
						props: {
							type: 'date',
							valueFormat: 'yyyy-MM-dd'
						}
					},
					{
						title: this.$l.birthday,
						key: 'birthday',
						name: 'date',
						span: 8,
						props: {
							type: 'date',
							valueFormat: 'yyyy-MM-dd'
						}
					},
					{ title: this.$l.icno, key: 'ic_no', span: 8 },
					{
						options: [],
						title: this.$l.work_name,
						key: 'work_name',
						span: 8,
						name: 'selectObj',
						events: {
							change: this.getWork_no
						}
					},
					{
						title: this.$l.sex,
						key: 'sex',
						span: 8,
						name: 'select',
						options: [
							{
								value: 'F',
								label: '女'
							},
							{
								value: 'M',
								label: '男'
							}
						]
					},
					{ title: this.$l.org_id, key: 'org_id', span: 8, props: { disabled: true } },
					{
						title: this.$l.dept_no,
						key: 'dept_no',
						span: 8,
						props: { disabled: true }
					},
					{
						title: this.$l.dept_name,
						key: 'department_t',
						span: 8,
						props: { disabled: true }
					},
					{
						title: '',
						name: 'button',
						span: 8,
						value: this.$l.dropDept,
						props: { type: 'primary' },
						events: {
							click: this.openDept
						}
					},
					{
						title: this.$l.enable,
						key: 'enable',
						name: 'switch',
						span: 8,
						props: {
							activeValue: '0',
							inactiveValue: '1'
						}
					},
					{
						title: this.$l.roles,
						key: 'roles',
						name: 'select',
						props: {
							options: [],
							filterable: true,
							multiple: true,
							clearable: true
						}
					}
				]
			},
			dropDeptVisible: false,
			dialogExcelVisible: false,
			excelLoading: false,
			excelData: []
		};
	},

	methods: {
		...initFuncs,
		formatBeforeSave(data) {
			//处理data中的roles是数组不能上传给服务器的问题，删除会导致上传失败
			const tmp = _.cloneDeep(data);
			tmp.roles = tmp.roles.join(',');
			return tmp;
		},

		formatAfterGet(data) {
			//不可删除，作用不知
			return data;
		},

		forceChangePass(v) {
			//强制修改用户密码
			this.$prompt(this.$l.inputPwd, this.$c.oprConfirm, {
				confirmButtonText: this.$c.confirm,
				cancelButtonText: this.$c.cancel
			})
				.then(({ value }) => {
					this.pageLoading = true;
					this.$request(this.api + 'forceChangePassword', { user: v.id, password: value }, 'post')
						.then(r => {
							this.pageLoading = false;
							this.$message({
								message: this.$c.success,
								type: 'success'
							});
						})
						.catch(() => {
							this.pageLoading = false;
						});
				})
				.catch(() => {});
		},

		addUser() {
			//先初始data里的值，然后打开用户修改表单
			this.data = this.initData.data;
			this.editFormVisible = true;
		},

		getWork_no(list) {
			//给data赋值职位和职务等级
			this.data.work_name = list.value;
			this.data.work_no = list.workNo;
		},

		openDept() {
			//打开选择部门弹窗
			this.dropDeptVisible = true;
			this.researchDept();
		},

		sendDeptItem(row, index) {
			//向data中传送部门等信息
			this.data.department_t = row.dept_name_zh;
			this.data.dept_no = row.dept_no;
			this.data.org_id = row.org_id;
			this.dropDeptVisible = false;
		},

		getPost() {
			//生成职务信息
			this.$request(  apipubliccode+'getListdetailed', {
				queryString: {},
				ruleno: '8101',
				pageSize: 100
			}).then(r => {
				let list = [];
				r.data.list.forEach(j => {
					list.push({ value: j.name_zh, label: j.name_zh, workNo: j.code_no });
				});
				this.getFieldConfig(this.userObj.fields, 'work_name').options = list;
			});
		},

		getRoles() {
			//生成用户角色选项
			this.$request(this.$api.role + 'getlist', { size: 999 }).then(r => {
				this.setFieldOptions(this.userObj.fields, 'roles', r.data.list, 'role_id', 'role_name');
			});
		},

		researchDept() {
			//搜索部门信息
			this.$request(apiSydept+'getList', {
				queryString: { dept_name: this.deptObj.query },
				pageSize: this.deptObj.pageSize,
				curPage: this.deptObj.curPage
			}).then(r => {
				this.deptObj.list = r.data.list;
				this.deptObj.total = r.data.total;
			});
		}

		/* 		resetPass(v) {
			this.$confirm('将要把 ' + v.userid + ' 的密码重置为与其账号一致，是否确认？', '操作确认').then(() => {
				this.pageLoading = true;
				this.$request(this.api + 'resetPassword', { user: v.id }, 'post')
					.then(r => {
						this.pageLoading = false;
						this.$message({
							message: '操作成功',
							type: 'success'
						});
					})
					.catch(() => {
						this.pageLoading = false;
					});
			});
		}, */

		/*    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 20
      if (!isLt1M) {
        this.$message({
          message: '文件大小必须小于20M',
          type: 'warning',
        })
        return false
      }
      return true
    },
    handleSuccess({ results, header }) {
      this.excelData = []
      results.forEach((v) => {
        const tmp = []
        header.forEach((i) => {
          tmp.push(v[i])
        })
        this.excelData.push(tmp)
      })
    },
    excelSubmit() {
      if (this.excelData.length <= 0) {
        this.$message({
          message: '请先选择Excel文件',
          type: 'error',
        })
        return false
      }
      var url = this.api + 'import'
      this.excelLoading = true
      this.$request(url, this.excelData, 'post')
        .then((r) => {
          let cnt = r.data.raw.affectedRows
          this.excelLoading = false
          this.getList()
          this.$message({
            message: `导入成功，共${cnt}条数据`,
            type: 'success',
          })
          this.excelData = []
          this.$refs.uploadExcel.clear()
          this.dialogExcelVisible = false
        })
        .catch((e) => {
          this.excelLoading = false
        })
    },
    getTemp() {
      import('@/vendor/Export2Excel')
        .then((excel) => {
          excel.export_json_to_excel({
            header: [
              '用户账户',
              '姓名',
              '邮箱',
              '手机',
              '角色名称(多个使用逗号,分隔)',
            ],
            data: [
              ['lisi', '李四', 'lisi@163.com', '18700008888', '质量,生产'],
            ],
            filename: this.name + '导入_' + dayjs().format('YYYYMMDD'),
          })
        })
        .catch(() => {})
    }, */
	},
	created: function() {
		this.getRoles();
		this.getList();
		this.getPost();
	},
	onload() {}
};
</script>
<style scoped></style>

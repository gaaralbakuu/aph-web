<template>
    <div class="app-container" v-loading="pageLoading">
        <el-button type="primary" class="fr" @click="createItem" style="margin-left: 5px">{{$c.create}}</el-button>
        <el-button :loading="sortLoading" v-if="indexFlag" class="fr" @click="updateDetailSort" type="success" plain>{{$c.saveIndex}}</el-button>
        <div class="filter-container">
            <el-input style="width: 200px" :placeholder="$l.search" clearable prefix-icon="el-icon-search" class="filter-item" @keyup.enter.native="research" @clear="research"
                v-model="query.queryString.str"></el-input>
            <el-select v-model="query.queryString.status" class="filter-item" clearable :placeholder="$l.statusPd">
                <el-option :label="$c.all" value="0"></el-option>
                <el-option :label="$c.enabled" value="1"></el-option>
                <el-option :label="$c.disabled" value="2"></el-option>
            </el-select>
            <el-button class="filter-item" type="success" plain @click="research">{{$c.queryButton}}</el-button>
            <!-- <el-button
        class="filter-item"
        type="info"
        plain
        @click="exportData"
        :loading="exportLoading"
        >导出
      </el-button> -->
        </div>
        <z-table ref="dragTable" :list="list" :tableProps="tableProps" :columns="columns" @editItem="editItem" @deleteItem="deleteItem">
            <template v-slot:content="v">
                <span v-if="v.key === 'status'" class="label" :class="statusClass[v.row['status']]">
                    {{ status[v.row['status']] }}
                </span>
                <span v-else>{{ v.row[v.key] }}</span>
            </template>
        </z-table>
        <z-pagination :pagination="pagination" :total="total" :page.sync="query.page" :limit.sync="query.size" @change="getList"></z-pagination>
        <z-form-dialog :name="name" :data="data" :formProps="formProps" :fields="fields" @submmit="submmit" :submmitLoading="submmitLoading" :visible.sync="editFormVisible"></z-form-dialog>
    </div>
</template>

<script>
import Sortable from 'sortablejs'

import {
    _,
    api,
    defaultConfig,
    initFuncs,
    zFormDialog,
    zPagination,
    zTable,
} from '@/views/_common'
const config = Object.assign({}, _.cloneDeep(defaultConfig), {
    api: api.banner,
    initData: { file: [], status: '1' },
})
export default {
    name: 'adminBanner',
    components: { zTable, zFormDialog, zPagination },
    data: function () {
        return {
            ...config,
            status: { 1: this.$c.enabled, 2: this.$c.disabled },
            statusClass: { 2: 'bg-red', 1: 'bg-green' },
            indexFlag: false,
            sortLoading: false,
            name: this.$l.title,
            query: {
                queryString: {},
                size: 10,
                page: 1,
            },
            columns: [
                { title: this.$l.name, key: 'name', width: 200 },
                { title: this.$l.description, key: 'description' },
                { title: this.$l.link, key: 'link' },
                { title: this.$l.file_name, key: 'file_name' },
                { title: this.$l.file_url, key: 'file_url' },
                { title: this.$l.empnopz, key: 'empnopz' },
                { title: this.$l.orgidpz, key: 'orgidpz' },
                { title: this.$l.deptnopz, key: 'deptnopz' },
                { title: this.$l.otherspz, key: 'otherspz' },
                { title: this.$l.status, key: 'status', width: 70 },
                { title: this.$c.modify_user, key: 'modify_user', width: 100 },
                { title: this.$c.modify_time, key: 'modify_time', width: 140 },
            ],
            fields: [
                { title: this.$l.name, key: 'name', required: true },
                { title: this.$l.description, key: 'description' },
                { title: this.$l.link, key: 'link' },
                {
                    title: this.$l.isEnable,
                    key: 'status',
                    span: 8,
                    name: 'switch',
                    props: { inactiveValue: '2', activeValue: '1' },
                },
                {
                    title: this.$l.upload,
                    key: 'file',
                    name: 'imgUploader',
                    props: {
                        showCount: false,
                        maxCount: 1,
                    },
                    events: {
                        addImg: this.addImg,
                        deleteImg: this.deleteImg,
                    },
                },
        {
          title: this.$l.empnopz,
          key: 'empnopz',
          name: 'select',
          events: {},
          options: [
            { value: 'N', label: 'N' },
            { value: 'Y', label: 'Y' },
          ],
          props: { placeholder: this.$l.orgidpzPd },
          required: true,
          span: 12,
          },
          {
                title: this.$l.orgidpz,
          key: 'orgidpz',
          name: 'select',
          events: {},
          options: [
            { value: 'N', label: 'N' },
            { value: 'Y', label: 'Y' },
          ],
          props: { placeholder: this.$l.orgidpzPd },
          required: true,
          span: 12,
          },
          {
                title: this.$l.deptnopz,
          key: 'deptnopz',
          name: 'select',
          events: {},
          options: [
            { value: 'N', label: 'N' },
            { value: 'Y', label: 'Y' },
          ],
          props: { placeholder: this.$l.deptnopzPd },
          required: true,
          span: 12,
          },
          {
          title: this.$l.otherspz,
          key: 'otherspz',
          name: 'select',
          events: {},
          options: [
            { value: 'N', label: 'N' },
            { value: 'Y', label: 'Y' },
          ],
          props: { placeholder: this.$l.otherspzPd },
          required: true,
          span: 12,
          },
       ],
    }
  },
    methods: {
        ...initFuncs,
        setSort() {
            let el = this.$refs.dragTable.$el.querySelectorAll(
                '.el-table__body-wrapper > table > tbody'
            )[0]
            this.sortable = Sortable.create(el, {
                ghostClass: 'sortable-ghost',
                setData: function (dataTransfer) {
                    dataTransfer.setData('Text', '')
                },
                onEnd: (evt) => {
                    var tmp = this.list[evt.oldIndex]
                    this.list[evt.oldIndex] = this.list[evt.newIndex]
                    this.list[evt.newIndex] = tmp
                    this.indexFlag = true
                },
            })
        },
        createItem() {
            this.data = _.cloneDeep(this.initData)
            this.editFormVisible = true
        },

        addImg(v, list) {
            console.log(this.data)
            this.data.file.push(v[0])
        },

        deleteImg(i, list) {
            this.data.file_id = ''
            this.data.file = []
        },
    
        submmit() {
            this.submmitLoading = true

            let formData = new FormData()
            if (this.data.file && this.data.file[0]) {
                formData.append('file[]', this.data.file[0])
            }

            formData.append('model', JSON.stringify(this.data))

            this.$request(this.api + 'createormodify', formData, 'post')
                .then((r) => {
                    this.submmitLoading = false
                    this.$message({
                        message: this.$c.success,
                        type: 'success',
                    })
                    this.editFormVisible = false
                    this.getList()
                })
                .catch(() => {
                    this.submmitLoading = false
                })
        },

        updateDetailSort() {
            this.sortLoading = true
            let listSortIds = this.list.map((v) => {
                return v.id
            })
            this.$request(this.api + 'updateSeq', listSortIds, 'post')
                .then((r) => {
                    this.sortLoading = false
                    this.getList()
                })
                .catch((e) => {
                    this.sortLoading = false
                })
        },

        formatAfterGet(data) {
            data.status = data.status.toString()
            return data
        },

        formatList(data) {
            //this.setSort()
            return data
        },
    },
    created: function () {
        this.getList()
    },
}
</script>
<style scoped>
</style>

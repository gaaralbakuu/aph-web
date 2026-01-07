<template>
  <div class="app-container" v-loading="pageLoading">
    <el-button type="primary" class="fr" @click="createItem">{{ c.create }}</el-button>
    <div class="filter-container">
      <el-input style="width: 300px" :placeholder="c.queryPlaceholder" clearable prefix-icon="el-icon-search"
        class="filter-item" @keyup.enter="research" @clear="research" v-model="query.queryString"></el-input>
      <el-button class="filter-item" type="success" plain @click="research">{{ c.queryButton
      }}</el-button>
      <el-button class="filter-item" type="info" plain @click="exportData" :loading="exportLoading">{{ c.export }}
      </el-button>
    </div>
    <el-row :gutter="20">
      <el-col :span="12">
        <z-table :list="list" :tableProps="tableProps" @current-change="getChildrenTree" :columns="columns"
          @editItem="editItem" @deleteItem="deleteItem"></z-table>
        <z-pagination :pagination="pagination" :total="total" v-model:page="query.page" v-model:limit="query.size"
          @change="getList"></z-pagination>
      </el-col>
      <el-col :span="12">
        <div style="padding: 10px 0; min-height: 52px">
          <el-button type="primary" class="fr" v-if="currentDataId" @click="createNode(null)" plain>{{ l.addItem }}
          </el-button>
          <span v-if="currentDataId && treeData.length > 0" class="text-gray"
            style="font-size: 10px; line-height: 32px">
            {{ l.indexDescription }}</span>
          <el-button type="success" v-show="currentDataId && indexChangeFlag" @click="saveIndex">{{ l.saveIndex }}
          </el-button>
        </div>
        <div v-if="currentDataId" style="border: #f4f4f4 solid 1px; padding: 10px 0">
          <el-tree :data="treeData" node-key="id" default-expand-all :expand-on-click-node="false" draggable
            :allow-drop="nodeIndexCheck" @node-drop="afterDrop">
            <template #{ node, data }><span class="custom-tree-node" v->
              <span>{{ node.label }} -- {{ data.value }}</span></template>
              <span>
                <a href="#" class="text-blue" @click.prevent="() => editNode(data)" :title="c.edit"><i
                    class="fa fa-edit"></i></a>
                <a href="#" class="text-green pl-5" @click.prevent="createNode(data)" :title="l.createNode"><i
                    class="fa fa-hand-o-right"></i></a>
                <a href="#" class="text-yellow pl-5" @click.prevent="createChildNode(data)"
                  :title="l.createChildNode"><i class="fa fa-hand-o-down"></i></a>
                <a href="#" class="text-red pl-5" @click.prevent="removeNode(data)" :title="c.delete"><i
                    class="fa fa-trash"></i></a>
              </span>
            </span>
          </el-tree>
        </div>
      </el-col>
    </el-row>
    <z-form-dialog :name="name" :data="data" :formProps="formProps" :fields="fields" @submmit="submmit"
      :submmitLoading="submmitLoading" v-model:visible="editFormVisible"></z-form-dialog>
    <!-- <z-form-dialog name="选项" :data="nodeData" :formProps="formProps" :fields="nodeFields" @submmit="submmitNode"
      :submmitLoading="submmitLoading" v-model:visible="editNodeFormVisible"></z-form-dialog> -->
    <el-dialog title="提示" v-model:visible="editNodeFormVisible" width="40%">
      <el-form label-width="100px">
        <el-form-item :label="l.itemValue">
          <el-row>
            <el-col :span="22">
              <el-input :placeholder="l.itemValuePlaceholder" v-model="nodeData.value" style="width: 98%"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item :label="l.itemLabel">
          <div v-for="(v, i) in labelData" :key="i" style="margin-bottom: 5px">
            <el-row>
              <el-col :span="8">
                <el-select v-model="v.key" :placeholder="c.selectLang">
                  <el-option v-for="(item, index) in langOptions" :key="index" :label="item.param_condition1"
                    :value="item.param_value">
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="10" style="margin-left: 5px">
                <el-input :placeholder="l.itemLabelPlaceholder" v-model="v.label" style="width: 100%"></el-input>
              </el-col>
              <el-col :span="4" style="margin-left: 5px">
                <el-button type="danger" size="mini" icon="el-icon-minus" @click="removeItem(i)" circle></el-button>
                <el-button style="margin-left: 3px" type="primary" @click="addItem()" size="mini" icon="el-icon-plus"
                  v-show="i == labelData.length - 1" circle></el-button>
              </el-col>
            </el-row>
          </div>
        </el-form-item>
      </el-form>
      <template #footer><span class="dialog-footer">
        <el-button @click="editNodeFormVisible = false">{{ c.cancel
        }}</el-button>
        <el-button type="primary" @click="submmitNode">{{ c.confirm
        }}</el-button>
      </span></template>
    </el-dialog>
  </div>
</template>

<script>
import { expendsTree,generateTree } from '@/utils'
import { getCookie } from '@/utils/auth'
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
  api: api.dictionary,
  tableProps: {
    highlightCurrentRow: true,
    border: true,
  },
})
export default {
  name: 'adminDictionary',
  components: { zTable, zFormDialog, zPagination },
  data: function () {
    return {
      ...config,
      lang: getCookie('lang'),
      name: '',
      columns: [
        { title: this.l.type, key: 'type', width: 140 },
        { title: this.l.label, key: 'label', width: 120 },
        { title: this.l.description, key: 'description' },
      ],
      fields: [
        { title: this.l.type, key: 'type' },
        { title: this.l.label, key: 'label' },
        { title: this.l.description, key: 'description' },
        { title: this.l.remarks, key: 'remarks' },
      ],
      langOptions: [],
      labelData: [{ key: '', label: '' }],
      currentDataId: 0,
      currentRow: {},
      treeData: [],
      nodeData: {},
      editNodeFormVisible: false,
      indexChangeFlag: false,
    }
  },
  methods: {
    ...initFuncs,
    getChildrenTree: function (row) {
      this.currentDataId = row ? row.id : 0
      this.currentRow = row
      this.indexChangeFlag = false
      this.refreshTree()
    },
    editNode: function (data) {
      this.labelData = [...data.labelArray]
      delete data.label
      this.nodeData = Object.assign({}, data)
      this.editNodeFormVisible = true
    },
    createNode: function (data) {
      this.labelData = [{ key: '', label: '' }]
      if (data) {
        this.nodeData = {
          parent_id: data.parent_id,
          value: '',
          type: data.type,
        }
      } else {
        this.nodeData = {
          parent_id: this.currentDataId,
          value: '',
          type: this.currentRow.type,
        }
      }
      this.editNodeFormVisible = true
    },
    createChildNode: function (data) {
      this.nodeData = { parent_id: data.id, value: '', type: data.type }
      this.editNodeFormVisible = true
    },
    submmitNode: function () {
      const url = this.api + 'update'
      const data = Object.assign({}, this.nodeData)
      delete data.children
      this.submmitLoading = true
      this.$request(
        url,
        { label: JSON.stringify(this.labelData), ...data },
        'post'
      )
        .then((r) => {
          this.submmitLoading = false
          this.$message({
            message: this.c.success,
            type: 'success',
          })
          this.editNodeFormVisible = false
          this.refreshTree()
        })
        .catch(() => {
          this.submmitLoading = false
        })
    },
    removeNode: function (data) {
      this.$confirm(this.c.cfmDelete, this.c.oprConfirm).then(() => {
        this.pageLoading = true
        this.$request(this.api + 'delete/' + data.id, {}, 'post')
          .then((r) => {
            this.pageLoading = false
            this.$message({
              message: this.c.success,
              type: 'success',
            })
            this.refreshTree()
          })
          .catch(() => {
            this.pageLoading = false
          })
      })
    },
    saveIndex: function () {
      var tmp = expendsTree(this.treeData)
      var data = tmp.map((i, index) => ({
        id: i.id,
        parent_id: i.parent_id,
        sorting: index,
      }))
      this.pageLoading = true
      const url = this.api + 'sort'
      this.$request(url, data, 'post')
        .then((r) => {
          this.pageLoading = false
          this.$message({
            message: this.c.success,
            type: 'success',
          })
          this.indexChangeFlag = false
          this.refreshTree()
        })
        .catch(() => {
          this.pageLoading = false
        })
    },
    nodeIndexCheck: function (draggingNode, dropNode, type) {
      if (dropNode.data.parent_id == draggingNode.data.parent_id) {
        return type === 'prev' || type === 'next'
      }
    },
    afterDrop: function () {
      this.indexChangeFlag = true
    },
    refreshTree: function () {
      if (this.currentDataId) {
        this.pageLoading = true
        this.$request(this.api + 'getchildren', {
          parentId: this.currentDataId,
        })
          .then((r) => {
            this.pageLoading = false
            let data = r.data
            data.forEach((v) => {
              if (v.labelArray && v.labelArray.indexOf('[{"key":') >= 0) {
                let labelArray = JSON.parse(v.labelArray)
                v.labelArray = labelArray ? labelArray : []
              }
            })
            this.treeData = generateTree(
              data,
              'id',
              'parent_id',
              this.currentDataId
            )
            console.log(treeData)
          })
          .catch((e) => {
            console.log(e)
            this.pageLoading = false
          })
      } else {
        this.treeData = []
      }
    },
    addItem() {
      this.labelData.push({ key: '', label: '' })
    },
    removeItem(i) {
      this.labelData.splice(i, 1)
      if (this.labelData.length == 0) this.addItem()
    },
    getLanguageList() {
      let url = this.$api.param + 'getbyType'
      this.$request(url, { type: 'AppSettings', name: 'Language' }).then(
        (r) => {
          this.langOptions = r.data
        }
      )
    },
  },
  created: function () {
    this.getLanguageList()
    this.getList()
  },
}
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

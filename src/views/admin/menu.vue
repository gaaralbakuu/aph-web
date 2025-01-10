<template>
  <div class="app-container" v-loading="pageLoading">
    <div style="padding: 10px 0; min-height: 40px">
      <el-button v-if="treeData.length == 0" @click="createNode(null)">{{$c.addItem}}</el-button>
      <span v-if="treeData.length > 0" class="text-gray" style="font-size: 12px">
        {{$c.indexDescription}}</span>
      <el-button type="success" v-if="indexChangeFlag" @click="saveIndex" :loading="sortLoading"
        style="float: right; margin-top: -6px">{{$c.saveIndex}}
      </el-button>
    </div>
    <div style="border: #f4f4f4 solid 1px; padding: 10px 0">
      <el-tree :data="treeData" node-key="id" :default-expand-all="false" :expand-on-click-node="false" draggable
        :allow-drop="nodeIndexCheck" @node-drop="afterDrop">
        <div class="custom-tree-node" slot-scope="{ data }">
          <div style="flex:1;overflow:hidden;">
            <span class="label" :class="{
                'bg-blue': data.resource_type == 'APP',
                'bg-green': data.resource_type == 'WEB',
                'bg-yellow': data.resource_type == 'MENU',
              }">{{ data.resource_type }}</span>
            <span style="margin-left: 10px" class="text-bold">{{
              data.menu_name_label
            }}</span>
            <span style="margin-left: 10px; font-weight: normal; color: #999999">{{ data.resource_path }}</span>
          </div>
          <div style="margin-left:10px;">
            <a href="#" v-if="data.enabled == 1" class="text-blue" :title="$c.enabled" style="font-size: 14px"
              @click.prevent="disableOrEnable(data)">
              <i class="el-icon-open"></i>
            </a>
            <a href="#" v-else class="text-gray" :title="$c.disabled" style="font-size: 16px"
              @click.prevent="disableOrEnable(data)">
              <i class="el-icon-turn-off"></i>
            </a>
            <a href="#" class="text-blue pl-5" @click.prevent="editNode(data)" :title="$c.edit">{{$c.edit}}</a>&nbsp;
            <a href="#" class="text-green pl-5" @click.prevent="createNode(data)"
              :title="$c.createNode">{{$c.createNode}}</a>&nbsp;
            <a href="#" class="text-yellow pl-5" @click.prevent="createChildNode(data)"
              :title="$c.createChildNode">{{ data.resource_type == 'MENU' ? $c.createChildNode : '　　　　' }}</a>&nbsp;
            <a href="#" class="text-red pl-5" @click.prevent="removeNode(data)" :title="$c.delete">{{$c.delete}}</a>
          </div>
        </div>
      </el-tree>
    </div>
    <!-- <z-form-dialog name="菜单" :data="nodeData" :formProps="formProps" :fields="nodeFields" @submmit="submmitNode"
      :submmitLoading="submmitLoading" :visible.sync="editNodeFormVisible"></z-form-dialog> -->
    <el-dialog :title="$l.title" :visible.sync="editNodeFormVisible" width="40%">
      <el-form label-width="100px">
        <el-form-item :label="$l.resourcetType">
          <el-row>
            <el-col :span="22">
              <el-select style="width: 100%" v-model="nodeData.resource_type"
                :placeholder="$c.resourcetTypePlaceholder">
                <el-option v-for="(item, index) in options" :key="index" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item :label="$l.resourcePath">
          <el-row>
            <el-col :span="22">
              <el-input v-model="nodeData.resource_path"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item :label="$l.imageUrl">
          <el-row>
            <el-col :span="22">
              <el-input v-model="nodeData.image_url"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item :label="$l.isshow">
          <el-row>
            <el-select v-model="nodeData.is_show" class="filter-item" :placeholder="$l.isshow">
             <el-option label="Y" value="Y"></el-option>
             <el-option label="N" value="N"></el-option>
            </el-select>

          </el-row>
        </el-form-item>
        <el-form-item :label="$l.menuName">
          <div v-for="(v, i) in labelData" :key="i" style="margin-bottom: 5px">
            <el-row>
              <el-col :span="8">
                <el-select v-model="v.key" :placeholder="$c.selectLang">
                  <el-option v-for="(item, index) in langOptions" :key="index" :label="item.param_condition1"
                    :value="item.param_value">
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="10" style="margin-left: 5px">
                <el-input :placeholder="$l.menuNamePlaceholder" v-model="v.label" style="width: 100%"></el-input>
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
      <span slot="footer" class="dialog-footer">
        <el-button @click="editNodeFormVisible = false">{{
          $c.cancel
        }}</el-button>
        <el-button type="primary" @click="submmitNode">{{
          $c.confirm
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { generateTree, expendsTree, dateTools } from '@/utils'
import { _, api, zFormDialog } from '@/views/_common'

const emptyData = {}
export default {
  components: { zFormDialog },
  name: 'adminMenu',
  data: function () {
    return {
      labelData: [{ key: '', label: '' }],
      langOptions: [],
      api: this.$api.menu,
      pageLoading: false,
      submmitLoading: false,
      sortLoading: false,
      currentDataId: 0,
      treeData: [],
      nodeData: {},
      options: [
        { label: this.$l.directory, value: 'MENU' },
        { label: this.$l.web, value: 'WEB' },
        { label: this.$l.app, value: 'APP' },
      ],
      optionsYN: [
            { value: 'N', label: 'N' },
            { value: 'Y', label: 'Y' },
          ],
      formProps: {
        dialogWidth: '70%',
        labelWidth: '140px',
      },
      editNodeFormVisible: false,
      indexChangeFlag: false,
    }
  },
  methods: {
    editNode: function (data) {
      this.nodeData = Object.assign({}, data)
      this.labelData = JSON.parse(this.nodeData.menu_name)
      this.editNodeFormVisible = true
    },
    createNode: function (data) {
      if (data) {
        this.nodeData = { parent_id: data.parent_id }
      } else {
        this.nodeData = { parent_id: 0 }
      }
      this.editNodeFormVisible = true
    },
    createChildNode: function (data) {
      if (data.resource_type != 'MENU') {
        return
      }
      this.nodeData = { parent_id: data.menu_id }
      this.editNodeFormVisible = true
    },
    submmitNode: function () {
      const data = Object.assign({}, this.nodeData)
      console.log(data)
      if (
        data.children &&
        data.children.length > 0 &&
        data.resource_type != 'MENU'
      ) {
        this.$message({
          message: this.$l.isExistChildren,
          type: 'error',
        })
        return
      }
      delete data.children
      if (!data.menu_id)
        data.menu_id = dateTools.now_time().replace(/[- :]/g, '') + '001'
      this.submmitLoading = true
      delete data.menu_name
      this.$request(
        this.api + 'save',
        { menu_name: JSON.stringify(this.labelData), ...data },
        'post'
      )
        .then((r) => {
          this.submmitLoading = false
          this.$message({
            message: this.$c.success,
            type: 'success',
          })
          this.editNodeFormVisible = false
          this.refreshTree()
        })
        .catch(() => {
          this.submmitLoading = false
        })
    },
    disableOrEnable: function (data) {
      const post = { ...data }
      delete post.children
      if (post.enabled == 1) {
        post.enabled = 0
      } else {
        post.enabled = 1
      }
      this.pageLoading = true
      this.$request(this.api + 'save', post, 'post')
        .then((r) => {
          this.pageLoading = false
          this.$message({
            message: this.$c.success,
            type: 'success',
          })
          data.enabled = post.enabled
        })
        .catch(() => {
          this.pageLoading = false
        })
    },
    removeNode: function (data) {
      let that = this
      this.$confirm(that.$c.cfmDelete, that.$c.oprConfirm).then(() => {
        this.pageLoading = true
        this.$request(this.api + 'delete/' + data.menu_id, {}, 'post')
          .then((r) => {
            this.pageLoading = false
            this.$message({
              message: this.$c.success,
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
        menu_seq: index,
        parent_id: i.parent_id,
      }))
      this.sortLoading = true
      const url = this.api + 'sort'
      this.$request(url, data, 'post')
        .then((r) => {
          this.sortLoading = false
          this.$message({
            message: this.$c.success,
            type: 'success',
          })
          this.indexChangeFlag = false
          this.refreshTree()
        })
        .catch(() => {
          this.sortLoading = false
        })
    },
    nodeIndexCheck: function (draggingNode, dropNode, type) {
      // 目标节点不是目录的禁止拖动进去
      if (dropNode.data.type != 'MENU') {
        return type != 'inner'
      }
      return true
    },
    afterDrop: function (i, j, type) {
      if (type == 'inner') {
        i.data.parent_id = j.data.menu_id
      } else {
        i.data.parent_id = j.data.parent_id
      }
      this.indexChangeFlag = true
    },
    refreshTree: function () {
      this.pageLoading = true
      this.$request(this.api + 'getlist', { size: -1 })
        .then((r) => {
          this.treeData = generateTree(r.data, 'menu_id', 'parent_id', '0')
          this.pageLoading = false
        })
        .catch((e) => {
          this.pageLoading = false
        })
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
    this.refreshTree()
  },
  watch: {
    data: function (val) {},
  },
}
</script>

<style scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 8px;
  overflow: hidden;
}
</style>

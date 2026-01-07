<template>
  <div class="menuManage-container">
    <div class="pageBody">
      <el-drawer class="drawer-container" v-model:visible="showObj.menu" :wrapperClosable="false" size="50%">
        <template #title><div class="title">{{ l.addEditMenu }}</div></template>
        <div class="form-container">
          <el-form label-width="80px" size="medium">
            <el-form-item :label="l.menuType" required>
              <el-select v-model="menuObj.form.resource_type" style="width: 100%">
                <el-option :label="l.navigator" value="navigator"></el-option>
                <el-option :label="l.catalogue" value="catalogue"></el-option>
                <el-option :label="l.menu" value="menu"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="l.accessPath" v-show="menuObj.form.resource_type == 'menu'">
              <el-input v-model="menuObj.form.resource_path"></el-input>
            </el-form-item>
            <el-form-item :label="l.navigatorCategory" v-show="menuObj.form.resource_type == 'navigator'">
              <el-input v-model="menuObj.form.resource_path"></el-input>
            </el-form-item>
            <el-form-item :label="l.parentMenu">
              <el-cascader
                clearable
                style="width: 100%"
                v-model="menuObj.form.parent_id"
                :options="menuObj.list"
                :props="{
                  label: 'name_zh',
                  value: 'menu_id',
                  checkStrictly: true,
                }"
                :placeholder="l.rootDirectory"
                @change="change_parent"></el-cascader>
            </el-form-item>
            <el-row>
              <el-col :span="8">
                <el-form-item :label="l.displayName" required>
                  <el-select v-model="menuObj.form.is_show" style="width: 100%">
                    <el-option :label="l.yes" value="Y"></el-option>
                    <el-option :label="l.no" value="N"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="l.permissionLimit" required>
                  <el-select v-model="menuObj.form.is_manager" style="width: 100%">
                    <el-option :label="l.yes" value="Y"></el-option>
                    <el-option :label="l.no" value="N"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="l.isValid" required>
                  <el-select v-model="menuObj.form.is_valid" style="width: 100%">
                    <el-option :label="l.yes" value="Y"></el-option>
                    <el-option :label="l.no" value="N"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item :label="l.simplifiedChineseName" required>
              <el-input v-model="menuObj.form.name_zh"></el-input>
            </el-form-item>
            <el-form-item :label="l.traditionalChineseName">
              <el-input v-model="menuObj.form.name_tw"></el-input>
            </el-form-item>
            <el-form-item :label="l.englishName">
              <el-input v-model="menuObj.form.name_en"></el-input>
            </el-form-item>
            <el-form-item :label="l.vietnameseName">
              <el-input v-model="menuObj.form.name_vi"></el-input>
            </el-form-item>
            <el-form-item :label="l.menuDescription">
              <el-input v-model="menuObj.form.menu_desc"></el-input>
            </el-form-item>
            <el-form-item :label="l.menuIcon">
              <el-input v-model="menuObj.form.image_url" :placeholder="l.appOnly"></el-input>
            </el-form-item>
            <el-form-item :label="l.isEnabled" required>
              <el-switch v-model="menuObj.form.enabled" active-color="#13ce66" :active-value="1" :inactive-value="0"></el-switch>
            </el-form-item>
          </el-form>
        </div>
        <div class="buttonBar">
          <el-button type="primary" @click="submitMenu">{{ l.submit }}</el-button>
          <el-button type="danger" @click="showObj.menu = false">{{ l.discard }}</el-button>
        </div>
      </el-drawer>
      <div class="filter-wrapper">
        <div style="color: #aaa">
          {{ l.dragSortTips }}
        </div>
        <div>
          <el-button type="success" :disabled="!showObj.saveIndex" @click="saveIndex">{{ l.saveSort }}</el-button>
          <el-button type="primary" @click="addMenu">{{ l.createNew }}</el-button>
        </div>
      </div>

      <el-tree ref="tree" class="filter-tree" :data="menuObj.list" :props="defaultProps" node-key="menu_id" draggable :allow-drop="nodeIndexCheck" @node-drop="afterDrop">
        <template #{ node, data }><div class="custom-menu-node" v- style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin: 2px 0px">
          <div>
            <span>
              <el-tag style="text-align: center" effect="dark" size="mini" :type="data.resource_type == 'navigator' ? 'warning' : data.resource_type == 'catalogue' ? 'primary' : 'success'">
                {{ data.resource_type == 'navigator' ? l.navigator.substr(0, 4) : data.resource_type == 'catalogue' ? l.catalogue.substr(0, 4) : l.menu.substr(0, 4) }}
              </el-tag>
            </span>
            <span style="font-weight: 600">{{ data[`name_${locale.split('-')[0]}`] }}</span>
            <span v-show="data.resource_type == 'menu'" style="color: #aaa">{{ data.resource_path }}</span>
          </div></template>
          <div>
            <el-tooltip :content="data.enabled == 1 ? l.clickToDisable : l.clickToEnable" placement="top">
              <el-switch @click.stop @change="switchEnabled(data)" v-model="data.enabled" active-color="#13ce66" :active-value="1" :inactive-value="0"></el-switch>
            </el-tooltip>
            <el-button type="text" size="mini" @click.stop="editMenu(data)">
              {{ l.edit }}
            </el-button>
            <el-button type="text" size="mini" class="text-red" @click.stop="deleteMenu(data)">
              {{ l.delete }}
            </el-button>
            <span style="width: 5em">
              <el-button class="text-green" type="text" size="mini" @click.stop="addSameLevelMenu(data)">
                {{ l.createSameLevel }}
              </el-button>
            </span>
            <div style="width: 4em; display: inline-block; margin-right: 1em">
              <el-button class="text-yellow" type="text" size="mini" @click.stop="addNextLevelMenu(data)" v-if="data.resource_type != 'menu'">
                {{ l.createSubLevel }}
              </el-button>
            </div>
          </div>
        </div>
      </el-tree>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, onMounted, getCurrentInstance } from 'vue'
import { expendsTree } from '@/utils'
import { useLocalI18n } from '@/composables/useLocalI18n'

const { l, c } = useLocalI18n('videoAdminMenu')
const { proxy } = getCurrentInstance()

const filterText = '后面设置过滤'
const defaultProps = reactive({
  children: 'children',
  label: 'label',
})
const publicCodeObj = reactive({
  org_id: [],
  collegeList: [],
})
const showObj = reactive({
  menu: false,
  saveIndex: false,
})
const menuObj = reactive({
  query: {
    college_id: '',
    page: 1,
    pageSize: 9999,
  },
  form: {
    id: '',
    college_id: '', //学院ID
    org_id: '', //组织ID
    menu_id: '', //菜单ID
    name_zh: '',
    name_tw: '',
    name_en: '',
    name_vi: '',
    menu_desc: '', //菜单描述
    parent_id: '', //父级ID
    resource_path: '', //资源路径,web为路由
    image_url: '', //图片
    resource_type: '', //资源类型,
    menu_seq: '', //排序
    is_show: '', //是否展示
    is_manager: '',
    is_valid: '', //是否有效
    rec_status: '',
    enabled: '', //是否启用
    m_print: '',
    m_audit: '',
    m_upload: '',
    m_export: '',
    m_import: '',
    m_update: '',
    m_del: '',
    m_add: '',
    m_search: '',
  },
  list: [],
})

const locale = computed(() => proxy.$i18n.locale)
const isAdmin = computed(() => proxy.$store.getters.isAdmin)

const nodeIndexCheck = (draggingNode, dropNode, type) => {
  // 目标节点不是目录的禁止拖动进去
  if (dropNode.data.resource_type == 'menu') {
    return type != 'inner'
  }
  return true
}

const afterDrop = (i, j, type) => {
  if (type == 'inner') {
    i.data.parent_id = j.data.menu_id
  } else {
    i.data.parent_id = j.data.parent_id
  }
  showObj.saveIndex = true
}

const change_parent = (v) => {
  let menu_id = v[v.length - 1]
  menuObj.form.parent_id = menu_id
}

const switchEnabled = (data) => {
  menuObj.form = Object.assign(menuObj.form, data)
  submitMenu()
}

const editMenu = (data) => {
  menuObj.form = Object.assign(menuObj.form, data)
  showObj.menu = true
}

const deleteMenu = (data) => {
  menuObj.form = Object.assign(menuObj.form, data)
  menuObj.form.is_valid = menuObj.form.is_valid == 'Y' ? 'N' : 'Y'
  proxy
    .$confirm(l.value.confirmDeleteMenu.replace('{name}', data.name_zh), l.value.deleteMenuTitle, {
      confirmButtonText: l.value.confirm,
      cancelButtonText: l.value.cancel,
      type: 'warning',
    })
    .then(() => {
      submitMenu()
    })
    .catch(() => {
      proxy.$message({
        type: 'info',
        message: l.value.cancelDelete,
      })
    })
}

const getFormattedDateTime = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hour = String(now.getHours()).padStart(2, '0')
  const minute = String(now.getMinutes()).padStart(2, '0')
  const second = String(now.getSeconds()).padStart(2, '0')
  const millisecond = String(now.getMilliseconds()).padStart(3, '0')
  return `m${year}${month}${day}${hour}${minute}${second}${millisecond}`
}

const addMenu = () => {
  menuObj.form = {
    id: '',
    college_id: '', //学院ID
    org_id: 200, //组织ID
    menu_id: getFormattedDateTime(), //菜单ID
    name_zh: '',
    name_tw: '',
    name_en: '',
    name_vi: '',
    menu_desc: '', //菜单ID
    parent_id: '', //父级ID
    resource_path: '', //资源路径,web为路由
    image_url: '', //图片
    resource_type: '', //资源类型,
    menu_seq: '', //排序
    is_show: 'Y', //是否展示
    is_manager: 'Y',
    is_valid: 'Y', //是否有效
    rec_status: 1,
    enabled: 1, //是否启用
    m_print: '',
    m_audit: '',
    m_upload: '',
    m_export: '',
    m_import: '',
    m_update: '',
    m_del: '',
    m_add: '',
    m_search: '',
  }
  showObj.menu = true
}

const addSameLevelMenu = (data) => {
  menuObj.form = {
    id: '',
    college_id: data.college_id, //学院ID
    org_id: 200, //组织ID
    menu_id: getFormattedDateTime(), //菜单ID
    name_zh: '',
    name_tw: '',
    name_en: '',
    name_vi: '',
    menu_desc: '', //菜单ID
    parent_id: data.parent_id, //父级ID
    resource_path: '', //资源路径,web为路由
    image_url: '', //图片
    resource_type: '', //资源类型,
    menu_seq: '', //排序
    is_show: 'Y', //是否展示
    is_manager: 'Y',
    is_valid: 'Y', //是否有效
    rec_status: 1,
    enabled: 1, //是否启用
    m_print: '',
    m_audit: '',
    m_upload: '',
    m_export: '',
    m_import: '',
    m_update: '',
    m_del: '',
    m_add: '',
    m_search: '',
  }
  showObj.menu = true
}

const addNextLevelMenu = (data) => {
  menuObj.form = {
    id: '',
    college_id: data.college_id, //学院ID
    org_id: 200, //组织ID
    menu_id: getFormattedDateTime(), //菜单ID
    name_zh: '',
    name_tw: '',
    name_en: '',
    name_vi: '',
    menu_desc: '', //菜单ID
    parent_id: data.menu_id, //父级ID
    resource_path: '', //资源路径,web为路由
    image_url: '', //图片
    resource_type: '', //资源类型,
    menu_seq: '', //排序
    is_show: 'Y', //是否展示
    is_manager: 'Y',
    is_valid: 'Y', //是否有效
    rec_status: 1,
    enabled: 1, //是否启用
    m_print: '',
    m_audit: '',
    m_upload: '',
    m_export: '',
    m_import: '',
    m_update: '',
    m_del: '',
    m_add: '',
    m_search: '',
  }
  showObj.menu = true
}

const getMenuList = () => {
  proxy.$request(proxy.$api.videoServer + '/Video/VideoMenu/getlist', menuObj.query).then((r) => {
    menuObj.list = r.data.list
  })
}

const submitMenu = () => {
  if (menuObj.form.parent_id === '') {
    menuObj.form.parent_id = 0
  }
  if (menuObj.form.resource_type === '') {
    return proxy.$message.error(l.value.pleaseSelectMenuType)
  } else if (menuObj.form.resource_type === 'menu' && menuObj.form.resource_path === '') {
    return proxy.$message.error(l.value.pleaseConfigureMenuPath)
  }
  if (menuObj.form.name_zh === '') {
    return proxy.$message.error(l.value.pleaseInputSimplifiedChineseName)
  }
  proxy.$request(proxy.$api.videoServer + '/Video/VideoMenu/addOrModifyMenu', menuObj.form, 'post').then((r) => {
    if (r.status) {
      proxy.$message({
        type: 'success',
        message: l.value.success,
      })
      showObj.menu = false
      getMenuList()
    }
  })
}

const saveIndex = () => {
  var tmp = expendsTree(menuObj.list)
  var data = tmp.map((i, index) => ({
    id: i.id,
    menu_seq: index,
    parent_id: i.parent_id,
  }))

  proxy
    .$request(proxy.$api.videoServer + '/Video/VideoMenu/ModifyMenuSeq', data, 'post')
    .then((r) => {
      proxy.$message({
        message: c.value.success,
        type: 'success',
      })
      showObj.saveIndex = false
      getMenuList()
    })
    .catch(() => {})
}

onMounted(() => {
  getMenuList()
})
</script>
<style>
.menuManage-container {
  width: 100%;
  height: 100%;
}
.menuManage-container .pageBody {
  width: 100%;
  margin: 0 auto;
}
.menuManage-container .pageBody .drawer-container {
  width: 100%;
}
.menuManage-container .pageBody .drawer-container .title {
  padding: 20px 0px;
  font-size: 18px;
  font-weight: 600;
  border-bottom: 1px solid #ccc;
}
.menuManage-container .pageBody .drawer-container .form-container {
  width: 100%;
  height: 95%;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
}
.menuManage-container .pageBody .drawer-container .buttonBar {
  width: 100%;
  height: 60px;
  margin: 0 auto;
  padding: 0 15px;
  position: absolute;
  bottom: 0px;
  border-top: 1px solid #ccc;
  float: right;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.menuManage-container .pageBody .filter-wrapper {
  height: 60px;
  background-color: white;
  padding: 15px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e1e1e1;
}
</style>

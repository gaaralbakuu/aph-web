<template>
  <div>
    <el-drawer class="drawer-container" :visible.sync="showObj.add_show" :wrapperClosable="false" size="40%"
      :before-close="getTrainPlaceList">
      <div slot="title" class="title">{{$l.addTrainingPlace}}</div>
      <div class="form-container">
        <div class="form">
          <el-form label-width="100px" size="medium">
            <el-form-item :label="$l.chineseName" required>
              <el-input v-model="addTrainPlaceList.list.name_zh"></el-input>
            </el-form-item>
            <el-form-item :label="$l.traditionalChineseName">
              <el-input v-model="addTrainPlaceList.list.name_tw"></el-input>
            </el-form-item>
            <el-form-item :label="$l.englishName">
              <el-input v-model="addTrainPlaceList.list.name_en"></el-input>
            </el-form-item>
            <el-form-item :label="$l.vietnameseName">
              <el-input v-model="addTrainPlaceList.list.name_vi"></el-input>
            </el-form-item>
            <el-form-item :label="$l.location" required>
              <el-input v-model="addTrainPlaceList.list.place"></el-input>
            </el-form-item>
            <el-form-item :label="$l.capacity">
              <el-input v-model="addTrainPlaceList.list.people_number"></el-input>
            </el-form-item>
            <el-form-item :label="$l.equipmentDetails">
              <el-checkbox :indeterminate="addTrainPlaceList.isIndeterminate" v-model="addTrainPlaceList.checkAll"
                @change="addHandleCheckAllChange">{{$l.selectAll}}</el-checkbox>
              <div style="margin: 15px 0;"></div>
              <el-checkbox-group v-model="addTrainPlaceList.checkedEquipment" @change="addHandleCheckedCitiesChange">
                <el-checkbox v-for="(item,index) in equipmentOptions" :label="item" :key="index">{{item}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
        </div>
        <div class="buttonBar">
          <el-button type="primary" @click="submmitAddLecturer">{{$l.submit}}</el-button>
          <el-button type="danger" @click="showObj.add_show = false">{{$l.close}}</el-button>
        </div>
      </div>
    </el-drawer>

    <el-drawer class="drawer-container" :visible.sync="showObj.edit_show" :wrapperClosable="false" size="40%"
      :before-close="getTrainPlaceList">
      <div slot="title" class="title">{{$l.editTrainingPlace}}</div>
      <div class="form-container">
        <div class="form">
          <el-form label-width="100px" size="medium">
            <el-form-item :label="$l.chineseName" required>
              <el-input v-model="editTrainPlaceList.list.name_zh"></el-input>
            </el-form-item>
            <el-form-item :label="$l.traditionalChineseName">
              <el-input v-model="editTrainPlaceList.list.name_tw"></el-input>
            </el-form-item>
            <el-form-item :label="$l.englishName">
              <el-input v-model="editTrainPlaceList.list.name_en"></el-input>
            </el-form-item>
            <el-form-item :label="$l.vietnameseName">
              <el-input v-model="editTrainPlaceList.list.name_vi"></el-input>
            </el-form-item>
            <el-form-item :label="$l.location" required>
              <el-input v-model="editTrainPlaceList.list.place"></el-input>
            </el-form-item>
            <el-form-item :label="$l.capacity">
              <el-input v-model="editTrainPlaceList.list.people_number"></el-input>
            </el-form-item>
            <el-form-item :label="$l.equipmentDetails">
              <el-checkbox :indeterminate="editTrainPlaceList.isIndeterminate" v-model="editTrainPlaceList.checkAll"
                @change="editHandleCheckAllChange">{{$l.selectAll}}</el-checkbox>
              <div style="margin: 15px 0;"></div>
              <el-checkbox-group v-model="editTrainPlaceList.checkedEquipment" @change="editHandleCheckedCitiesChange">
                <el-checkbox v-for="(item,index) in equipmentOptions" :label="item" :key="index">{{item}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
          <div class="buttonBar">
            <el-button type="primary" @click="submmitEditLecturer">{{$l.submit}}</el-button>
            <el-button type="danger" @click="showObj.edit_show = false">{{$l.close}}</el-button>
          </div>
        </div>
      </div>
    </el-drawer>

    <div style="width: 100%;height: 60px;padding: 15px;background-color: white;border-bottom: 1px #eee solid;">
      <el-form :model="from" inline>
        <el-form-item :label="$l.name">
          <el-input :placeholder="$l.inputKeywordFilter" v-model="trainPlaceList.form.name" clearable>
          </el-input>
        </el-form-item>
        <el-form-item :label="$l.location">
          <el-input :placeholder="$l.inputKeywordFilter" v-model="trainPlaceList.form.place" clearable>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="trainPlaceList.form.is_valid" :placeholder="$l.pleaseSelect" clearable style="width: 120px">
            <el-option v-for="item in trainPlaceList.options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="getTrainPlaceList">{{$l.search}}</el-button>
        </el-form-item>
        <el-button type="primary" class="fr" @click="addLecturer">{{$l.create}}</el-button>
      </el-form>
    </div>
    <div style="height: calc(100% - 60px);">
      <el-table :data="trainPlaceList.data" style="width: 100%" max-height="720px" ref="userTable">
        <el-table-column type="index" :label="$l.serialNumber"></el-table-column>
        <el-table-column v-for="(item, index) in trainPlaceList.columns" :key="index" :prop="item.key" :label="item.title"
          :width="item.width">
        </el-table-column>
        <el-table-column fixed="right" :label="$l.operation" width="100">
          <template slot-scope="scope">
            <el-button @click="editLecturer(scope.row)" type="text" size="small">{{$l.edit}}</el-button>
            <el-button v-if="scope.row.is_valid == 'Y'" @click="deleteLecturer(scope.row)" type="text" size="small" style="color: red">
              {{$l.disable}}</el-button>
            <el-button v-else @click="deleteLecturer(scope.row)" type="text" size="small" style="color: rgb(58, 188, 19)">
              {{$l.enable}}</el-button>
          </template>
        </el-table-column>
      </el-table>

      <z-pagination :pagination="pagination" :total="trainPlaceList.total" :page.sync="trainPlaceList.form.page"
        :limit.sync="trainPlaceList.form.pageSize" @change="getTrainPlaceList">
      </z-pagination>
    </div>
  </div>
</template>

<script>
  import {
    zPagination
  } from '@/views/_common'
  export default {
    name: 'videoAdminPlace',
    components: {
      zPagination,
    },
    data() {
      return {
        equipmentOptions: [this.$l.computer, this.$l.projector, this.$l.microphone, this.$l.soundSystem, this.$l.whiteboard],
        pagination: {
          layout: 'prev, pager, next, jumper, ->, total,sizes',
          pagerCount: 7,
          pageSizes: [10, 15, 20, 30, 40, 50, 100],
        },
        from: {},
        showObj: {
          add_show: false,
          edit_show: false,
        },
        trainPlaceList: {
          total: 0,
          data: [],
          form: {
            is_valid: 'Y',
            page: 1,
            pageSize: 15,
          },
          options: [{
              value: 'Y',
              label: this.$l.enabled,
            },
            {
              value: 'N',
              label: this.$l.disabled,
            },
          ],
          columns: [
            {
              title: this.$l.name,
              key: 'name_zh',
            },
            {
              title: this.$l.location,
              key: 'place',
            },
            {
              title: this.$l.equipmentDetails,
              key: 'equipment',
            },
            {
              title: this.$l.capacity,
              key: 'people_number',
              width: 100,
            },
            {
              title: this.$l.status,
              key: 'is_valid',
              width: 100,
            },
            {
              title: this.$l.modifiedBy,
              key: 'modify_user',
              width: 100,
            },
            {
              title: this.$l.modifiedDepartment,
              key: 'modify_dept',
              width: 120,
            },
            {
              title: this.$l.modifiedTime,
              key: 'modify_time',
              width: 150,
            },
          ],
        },
        addTrainPlaceList: {
          list: {},
          checkAll: false,
          isIndeterminate: true,
          checkedEquipment: [],
        },
        editTrainPlaceList: {
          list: {},
          checkAll: false,
          isIndeterminate: true,
          checkedEquipment: [],
        },
      }
    },
    watch: {},

    methods: {
      getTrainPlaceList() {
        this.$request(
            this.$api.videoServer + '/Video/VideoTrain/getTrainPlace',
            this.trainPlaceList.form
          )
          .then((r) => {
            this.trainPlaceList.data = r.data.list
            this.trainPlaceList.total = r.data.total
            this.showObj.add_show = false
          })
          .catch((e) => {
            this.$message.error(e.message)
          })
      },
      addHandleCheckAllChange(val) {
        this.addTrainPlaceList.checkedEquipment = val ? this.equipmentOptions : [];
        this.addTrainPlaceList.isIndeterminate = false;
      },
      addHandleCheckedCitiesChange(value) {
        let checkedCount = value.length;
        this.addTrainPlaceList.checkAll = checkedCount === this.equipmentOptions.length;
        this.addTrainPlaceList.isIndeterminate = checkedCount > 0 && checkedCount < this.equipmentOptions.length;
      },
      addLecturer() {
        this.showObj.add_show = true
      },
      submmitAddLecturer() {
        this.$set(this.addTrainPlaceList.list, "equipment", this.addTrainPlaceList.checkedEquipment)
        if (!this.addTrainPlaceList.list.name_zh)
          return this.$message.error(this.$l.nameCannotBeEmpty)
        if (!this.addTrainPlaceList.list.place)
          return this.$message.error(this.$l.locationCannotBeEmpty)

        this.$request(
            this.$api.videoServer + '/Video/VideoTrain/addTrainPlace',
            this.addTrainPlaceList.list,
            'post'
          )
          .then((r) => {
            this.$message.success(this.$l.operationSuccess)
            this.addTrainPlaceList.list = {}
            this.addTrainPlaceList.checkedEquipment = []
            this.getTrainPlaceList()
            this.showObj.add_show = false
          })
          .catch(() => {})
      },
      editHandleCheckAllChange(val) {
        this.editTrainPlaceList.checkedEquipment = val ? this.equipmentOptions : [];
        this.editTrainPlaceList.isIndeterminate = false;
      },
      editHandleCheckedCitiesChange(value) {
        let checkedCount = value.length;
        this.editTrainPlaceList.checkAll = checkedCount === this.equipmentOptions.length;
        this.editTrainPlaceList.isIndeterminate = checkedCount > 0 && checkedCount < this.equipmentOptions.length;
      },
      editLecturer(row) {
        this.editTrainPlaceList.list = _.cloneDeep(row)
        this.editTrainPlaceList.checkedEquipment = this.editTrainPlaceList.list.equipment?.split(";") || []
        this.showObj.edit_show = true
      },
      submmitEditLecturer() {
        this.$set(this.editTrainPlaceList.list, "equipment", this.editTrainPlaceList.checkedEquipment)
        this.$confirm(this.$l.confirmModify, this.$l.trainingPlaceManagement, {
            confirmButtonText: this.$l.confirm,
            cancelButtonText: this.$l.cancel,
            type: 'warning',
          })
          .then(() => {
            this.$request(
                this.$api.videoServer + '/Video/VideoTrain/addTrainPlace',
                this.editTrainPlaceList.list,
                'post'
              )
              .then((r) => {
                this.$message.success(this.$l.operationSuccess)
                this.getTrainPlaceList()
                this.showObj.edit_show = false
              })
              .catch(() => {})
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: this.$l.operationCanceled,
            })
          })
      },
      deleteLecturer(row) {
        let item = _.cloneDeep(row)
        item.equipment = item.equipment.split(";")
        item.is_valid = item.is_valid == "Y" ? "N" : "Y"
        this.$confirm(this.$l.confirmStatusChange, this.$l.trainingPlaceManagement, {
            confirmButtonText: this.$l.confirm,
            cancelButtonText: this.$l.cancel,
            type: 'warning',
          })
          .then(() => {
            this.$request(
                this.$api.videoServer + '/Video/VideoTrain/addTrainPlace',
                item,
                'post'
              )
              .then((r) => {
                this.$message.success(this.$l.operationSuccess)
                this.getTrainPlaceList()
              })
              .catch(() => {
                this.$message({
                  type: 'error',
                  message: this.$l.operationFailed,
                })
              })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: this.$l.operationCanceled,
            })
          })
      },
    },
    mounted() {
      this.getTrainPlaceList()
    },
  }
</script>

<style lang="scss">
  .drawer-container {

    //视频上传抽屉样式
    .title {
      padding: 0px 20px 10px 20px;
      font-size: 18px;
      font-weight: 600;
      border-bottom: 1px solid #ccc;
      display: flex;
      justify-content: space-between;
    }

    .form-container {
      width: 100%;
      height: 95%;
      margin: 0 auto;
      background-color: #fff;

      .form {
        width: 90%;
        margin: 0 auto;
      }

      .buttonBar {
        width: 100%;
        height: 60px;
        margin: 0 auto;
        padding: 0 30px;
        position: absolute;
        bottom: 0px;
        border-top: 1px solid #ccc;
        float: right;
        display: flex;
        justify-content: end;
        align-items: center;
      }
    }
  }
</style>

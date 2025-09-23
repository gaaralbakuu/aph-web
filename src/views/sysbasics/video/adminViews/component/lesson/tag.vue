<template>
  <div class="videoTag-container">
    <el-drawer class="drawer-container" :visible.sync="showObj.tagShow" :wrapperClosable='false' size="40%">
      <div slot='title' class="title">{{$l.addTag}}</div>
      <div class="form-container">
        <div class="form">
          <el-form label-width="80px" size="medium">
            <el-form-item :label="$l.name_zh">
              <el-input v-model="tagObj.form.name_zh" requird></el-input>
            </el-form-item>
            <el-form-item :label="$l.name_tw">
              <el-input v-model="tagObj.form.name_tw"></el-input>
            </el-form-item>
            <el-form-item :label="$l.name_en">
              <el-input v-model="tagObj.form.name_en"></el-input>
            </el-form-item>
          </el-form>

        </div>
      </div>
      <div class="buttonBar">
        <el-button type="primary" @click="handleSubmit">{{$l.submit}}</el-button>
        <el-button type="danger" @click="showObj.tagShow = false">{{$l.giveup}}</el-button>
      </div>
    </el-drawer>

    <div class="pageBody">
      <div class="pageBody-filter">
        <el-form inline>
          <el-form-item :label="$l.title">
            <el-input v-model="tagObj.query.name" clearable @clear='getTagList'
              @keyup.native.enter="getTagList"></el-input>
          </el-form-item>
          <el-form-item :label="$l.status">
            <el-select v-model="tagObj.query.is_valid" @change="getTagList" style="width: 100px;">
              <el-option :label="$c.all" value=""></el-option>
              <el-option :label="$l.enable" value="Y"></el-option>
              <el-option :label="$l.disable" value="N"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item> <el-button type="success" @click="getTagList">{{$l.search}}</el-button></el-form-item>
        </el-form>
        <div>
          <el-button type="primary" @click="addTag">{{$l.addTag}}</el-button>
        </div>
      </div>

      <div class="tableContainer" ref="tableContainer">
        <el-Table :data='tagObj.list' tooltip-effect="dark" style="width: 100%" highlight-current-row
          highlight-selection-row stripe :header-cell-style="cssObj.headerRowStyle" :max-height="cssObj.tableMaxHeight"
          :row-style="{height:'60px',fontSize:'14px'}">
          <el-table-column type="index" width="50" label='No'>
          </el-table-column>
          <el-table-column :label="$l.name_zh" prop="name_zh"></el-table-column>
          <el-table-column :label="$l.name_tw" prop="name_tw"></el-table-column>
          <el-table-column :label="$l.name_en" prop="name_en"></el-table-column>
          <el-table-column :label="$l.create_time" prop="create_time"></el-table-column>
          <el-table-column :label="$l.status" prop="is_valid"></el-table-column>
          <el-table-column :label="$l.oprate" fixed="right">
            <template slot-scope="scope">
              <el-button type='text' @click="modifyTag(scope.row)">{{$c.edit}}</el-button>
              <el-button v-if="scope.row.is_valid=='N'" type='text' style="color: seagreen;"
                @click="modifyStatus(scope.row)">{{$c.enable}}</el-button>
              <el-button v-else type='text' style="color: red;" @click="modifyStatus(scope.row)">{{$c.disable}}</el-button>
            </template>
          </el-table-column>
        </el-Table>
      </div>

      <div class="tagList-pagenation">
        <el-pagination @size-change="handleSizeChange" @current-change="handlePageChange"
          :current-page="tagObj.query.page" :page-sizes="[5,10, 15, 30, 50,100]" :page-size="tagObj.query.pageSize"
          layout="total, sizes, prev, pager, next, jumper" :total="tagObj.total" style="float: right;">
        </el-pagination>
      </div>
    </div>
  </div>
</template>


<script>
  export default {
    name: 'videoAdminTag',
    data() {
      return {
        cssObj: {
          tableMaxHeight: '500px',
          headerRowStyle: {
            background: '#f2f4f9',
            color: '#505050',
            fontSize: '14px',
            height: '50px'
          }
        },
        tagObj: {
          query: {
            page: 1,
            pageSize: 10,
            name: "",
            is_valid: ''
          },
          form: {
            id: '',
            name_zh: '',
            name_en: '',
            name_tw: '',
            is_valid: '',
            rec_status: ''
          },
          list: []
        },
        showObj: {
          tagShow: false
        },
      };
    },

    methods: {
      updateTableMaxHeight() {
        //返回表格最大高度
        const container = this.$refs.tableContainer;
        if (container) {
          this.cssObj.tableMaxHeight = container.clientHeight + 'px';
        }
      },

      handleSizeChange(i) {
        this.tagObj.query.pageSize = i
        this.getTagList()
      },

      handlePageChange(i) {
        this.tagObj.query.page = i
        this.getTagList()
      },

      addTag() {
        this.tagObj.form = {
            id: '',
            name_zh: '',
            name_en: '',
            name_tw: '',
            is_valid: '',
            rec_status: ''
          },
          this.showObj.tagShow = true
      },

      modifyTag(data) {
        this.tagObj.form = Object.assign(this.tagObj.form, data)
        this.showObj.tagShow = true
      },

      modifyStatus(i) {
        let currentStatus = i.is_valid
        let value
        let oprate
        if (currentStatus == 'N') {
          value = 'Y'
          oprate = this.$c.enable
        } else {
          value = 'N'
          oprate = this.$c.disable
        }

        this.$prompt(`${oprate}《${i.name_label}》？`+this.$l.confirmTips, {
            type: 'warning',
            inputPattern: /^[Y]{1}$/i,
            inputErrorMessage: this.$l.inputErrorMessage,
            confirmButtonText: this.$l.confirmtext,
            cancelButtonText: this.$l.cancelText
          }).then(() => {
            this.$request(this.$api.videoServer + '/Video/VideoTag/EnableOrDisabledTag', {
              key: i.id,
              value: value
            }, 'post').then(r => {
              this.$message({
                type: 'success',
                message:this.$l.oprateSuccess
              })
              this.getTagList()
            })
          })
          .catch(() => {
            console.log('取消操作');
          })
      },

      handleSubmit() {
        if (this.tagObj.form.id == '') {
          this.tagObj.form.rec_status = 1
        }
        this.$request(this.$api.videoServer + '/Video/VideoTag/addOrModifyTag', this.tagObj.form, 'post')
          .then(r => {
            if (r.httpCode == 200) {
              this.$message({
                type: 'success',
                message: this.$l.oprateSuccess
              })
              this.showObj.tagShow = false
              this.getTagList()
            }
          })
          .catch(e => {
            console.log(e);
          })
      },

      getTagList() {
        this.$request(this.$api.videoServer + '/Video/VideoTag/getList', this.tagObj.query)
          .then(r => {
            if (r.httpCode == 200) {
              this.tagObj.list = r.data.list
              this.tagObj.total = r.data.total
              // if (r.data.total == 0) {
              //   this.$message({
              //     type: 'info',
              //     message: '暂无数据'
              //   })
              // }
            }
          })
          .catch(e => {
            console.log(e);
          })
      },
    },

    mounted() {
      this.getTagList()
      window.addEventListener('resize', this.updateTableMaxHeight);
      this.$nextTick(() => {
        this.updateTableMaxHeight();
      })
    },

    beforeDestroy() {
      window.removeEventListener('resize', this.updateTableMaxHeight);
    },
  }
</script>


<style lang="scss">
  .videoTag-container {
    width: 100%;
    height: 100%;

    .drawer-container {

      //抽屉样式
      .title {
        padding: 20px 0px;
        font-size: 18px;
        font-weight: 600;
        border-bottom: 1px solid #ccc;
      }

      .form-container {
        width: 95%;
        height: 90%;
        margin: 0 auto;
        background-color: #fff;


      }

      .buttonBar {
        width: 100%;
        height: 60px;
        margin: 0 auto;
        padding: 0 25px;
        position: absolute;
        bottom: 0px;
        border-top: 1px solid #ccc;
        float: right;
        display: flex;
        justify-content: end;
        align-items: center;
      }
    }

    .pageBody {
      width: 100%;
      min-width: 1000px;
      height: 100%;
      margin: 0 auto;
      // padding: 20px;
      background-color: #fff;

      .pageBody-filter {
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #ddd;
        padding: 14px;
        height: 60px;
      }

      .tableContainer {
        width: 100%;
        height: calc(100% - 110px);
      }

      .tagList-pagenation {
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
      }
    }
  }
</style>

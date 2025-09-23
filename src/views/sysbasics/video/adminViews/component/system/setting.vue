<template>
  <div class="setting-container">
    <div class="pageBody">
      <el-collapse v-model="activeNames">
        <el-collapse-item name="platformName">
          <template slot="title">
            <div style="font-size: 20px;font-weight: bold;">
              {{$l.platformName}}
            </div>
          </template>
          <div style="text-align: right;">
            <el-button style="margin: 10px 0px;" type="primary" plain @click="updatePlatformName">
              {{$l.save}}
            </el-button>
          </div>
          <el-form label-width="80px" label-position="left">
            <el-form-item :label="$l.simplifiedChineseName">
              <el-input v-model="platformName['zh-CN']"></el-input>
            </el-form-item>
            <el-form-item :label="$l.traditionalChineseName">
              <el-input v-model="platformName['zh-TW']"></el-input>
            </el-form-item>
            <el-form-item :label="$l.englishName">
              <el-input v-model="platformName['en-US']"></el-input>
            </el-form-item>
            <el-form-item :label="$l.vietnameseName">
              <el-input v-model="platformName['vi-VN']"></el-input>
            </el-form-item>
          </el-form>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
  import {
    mapGetters
  } from "vuex"

  export default {
    name: "videoAdminStting",
    computed: {
      ...mapGetters(["isAdmin"]),
    },
    data() {
      return {
        activeNames: "platformName",
        platformName: {
          "en-US": "E + learning",
          "zh-CN": "万邦线上学习平台",
          "zh-TW": "萬邦線上學習平臺"
        },
        platformNameForm: {
          "id": "",
          "param_name": "",
          "param_type": "",
          "param_value": "",
          "param_priority": "0",
          "param_condition1": "",
          "param_condition2": "",
          "param_condition3": "",
          "remarks": "",
          "is_valid": "",
          "rec_status": "",
          "org_id": "",
          "group_id": ""
        }
      }
    },
    methods: {
      getPlatformName() {
        this.$request(this.$api.baseUrl + "/Platform/param/getparametervalue", {
          type: "VideoSystem",
          name: "platformName"
        }).then(r => {
          if (r.data.length > 0) {
            this.platformName = JSON.parse(r.data[0].param_value)
            this.platformNameForm = Object.assign(this.platformNameForm, r.data[0])
          }
        })
      },

      updatePlatformName() {
        if (this.platformName["zh-CN"] == "") {
          return this.$message.error(this.$l.pleaseInputSimplifiedChineseName)
        }
        if (this.platformName["zh-TW"] == "") {
          return this.$message.error(this.$l.pleaseInputTraditionalChineseName)
        }
        if (this.platformName["en-US"] == "") {
          return this.$message.error(this.$l.pleaseInputEnglishName)
        }

        this.platformNameForm.param_value = JSON.stringify(this.platformName)
        this.$request(this.$api.baseUrl + '/platform/param/update', this.platformNameForm, 'POST')
          .then(r => {
            if (r.message == 'Success') {
              this.$message({
                type: 'success',
                message: this.$l.updateSuccess
              })
            }
          })
      }
    },
    mounted() {
      this.getPlatformName()
    }
  }
</script>
<style scoped lang="less">
  .setting-container {
    width: 100%;
    height: 100%;
    background-color: white;

    .pageBody {
      width: 100%;
      height: 100%;
      padding: 20px;
    }
  }
</style>

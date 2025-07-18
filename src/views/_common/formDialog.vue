<template>
  <el-dialog :title="name+(data.id? $c.edit : $c.create)" :width="formProps.dialogWidth" :close-on-click-modal="false"
    :visible.sync="dialogShow">
    <div style="padding-right: 100px;">
      <z-form :data="data" :formProps="formProps" :fields="fields"></z-form>
      <slot class="operation1" name="operation1"></slot>
      <div class="align-r">
        <el-button @click="dialogShow = false">{{$c.cancel}}</el-button>
        <el-button v-if="!formProps.disabled" type="primary" @click.native="submmit" :loading="submmitLoading">{{$c.confirm}}
        </el-button>
        <slot name="operation"></slot>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import zForm from './form'

export default {
  name: 'z-form-dialog',
  components: { zForm },
  props: {
    name: { type: String, default: '' },
    fields: { type: Array, default: [] },
    data: { type: Object, default: function(){
      return {}
    } },
    formProps: { type: Object, default: {} },
    visible: { type: Boolean, default: false },
    submmitLoading: { type: Boolean, default: false }
  },
  computed: {
    dialogShow: {
      get () {
        return this.visible
      },
      set (val) {
        this.$emit('update:visible', val)
      }
    }
  },
  methods: {
    submmit () {
      this.$emit('submmit')
    }
  }
}
</script>


<style scoped>

</style>

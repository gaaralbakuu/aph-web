<template>
  <div>
    <slot name="research"></slot>
    <el-table :data="list" row-key="id" v-bind="tableProps" @current-change="currentChange" @row-click="rowClick">
      <el-table-column v-for="(item, index) in columns" :key="index" show-overflow-tooltip
        :label="item.title || item.key" :prop="item.key" v-bind="item">
        <template slot-scope="scope">
          <slot name="content" v-bind="{row:scope.row,key:item.key,index:scope.$index}">
            <span>{{scope.row[item.key]}}</span>
          </slot>
        </template>
      </el-table-column>
      <el-table-column v-if="!tableProps.hideOperations" :label="$c.operation" :width="tableProps.opsColWith||86" fixed="right">
        <template slot-scope="scope">
          <slot name="operation" v-bind="{row:scope.row,$index:scope.$index}">
            <a href="#" class="text-blue" @click.prevent="editItem(scope.row,scope.$index)">{{ $c.edit }}</a>&nbsp;
            <a href="#" class="text-red" @click.prevent="deleteItem(scope.row,scope.$index)">{{ $c.delete }}</a>
          </slot>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'z-table',
  props: {
    list: { type: Array, default: null },
    tableProps: {
      type: Object,
      default: function () {
        return {
          border: true,
          opsColWith: 86,
        }
      },
    },
    columns: { type: Array, default: null },
  },
  methods: {
    currentChange(row) {
      this.$emit('current-change', row)
    },
    rowClick(row) {
      this.$emit('row-click', row)
    },
    editItem(r, i) {
      this.$emit('editItem', r, i)
    },
    deleteItem(r, i) {
      this.$emit('deleteItem', r, i)
    },
  },
}
</script>

<style scoped>
</style>

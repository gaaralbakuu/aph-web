<template>
  <div>
    <slot name="research"></slot>
    <table class="min-w-full divide-y divide-gray-200 border border-gray-300">
      <thead class="bg-gray-50">
        <tr>
          <th v-for="(item, index) in columns" :key="index" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ item.title || item.key }}</th>
          <th v-if="!tableProps.hideOperations" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ $c.operation }}</th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="(row, rowIndex) in list" :key="row.id || rowIndex" @click="rowClick(row)" class="hover:bg-gray-50 cursor-pointer">
          <td v-for="(item, colIndex) in columns" :key="colIndex" class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            <slot name="content" v-bind="{row:row,key:item.key,index:rowIndex}">
              <span>{{ row[item.key] }}</span>
            </slot>
          </td>
          <td v-if="!tableProps.hideOperations" class="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <slot name="operation" v-bind="{row:row,$index:rowIndex}">
              <a href="#" class="text-blue-600 hover:text-blue-900" @click.prevent="editItem(row, rowIndex)">{{ $c.edit }}</a>&nbsp;
              <a href="#" class="text-red-600 hover:text-red-900" @click.prevent="deleteItem(row, rowIndex)">{{ $c.delete }}</a>
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
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

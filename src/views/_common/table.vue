<template>
  <div>
    <slot name="research"></slot>
    <div class="overflow-x-auto border border-gray-200 rounded-lg">
      <table class="w-full border-collapse">
        <thead class="bg-gray-50">
          <tr class="border-b border-gray-200">
            <th v-for="(item, index) in columns" :key="index" 
                class="px-4 py-3 text-left text-sm font-semibold text-gray-900 truncate"
                :title="item.title || item.key">
              {{ item.title || item.key }}
            </th>
            <th v-if="!tableProps.hideOperations" 
                class="px-4 py-3 text-left text-sm font-semibold text-gray-900 w-24">
              {{ $c.operation }}
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-if="!list || list.length === 0" class="hover:bg-gray-50">
            <td :colspan="(columns ? columns.length : 0) + (tableProps.hideOperations ? 0 : 1)" 
                class="px-4 py-8 text-center text-gray-500">
              {{ $c.no_data || 'No data available' }}
            </td>
          </tr>
          <tr v-for="(row, rowIndex) in list" :key="row.id || rowIndex" 
              class="hover:bg-gray-50 transition-colors cursor-pointer"
              @click="rowClick(row)">
            <td v-for="(item, colIndex) in columns" :key="colIndex" 
                class="px-4 py-3 text-sm text-gray-700 border-b border-gray-100 truncate"
                :title="row[item.key]">
              <slot name="content" v-bind="{row:row,key:item.key,index:rowIndex}">
                <span>{{ row[item.key] }}</span>
              </slot>
            </td>
            <td v-if="!tableProps.hideOperations" 
                class="px-4 py-3 text-sm text-gray-700 border-b border-gray-100 whitespace-nowrap">
              <slot name="operation" v-bind="{row:row,$index:rowIndex}">
                <a href="#" class="text-blue-600 hover:text-blue-800 mr-3" @click.prevent="editItem(row,rowIndex)">
                  {{ $c.edit }}
                </a>
                <a href="#" class="text-red-600 hover:text-red-800" @click.prevent="deleteItem(row,rowIndex)">
                  {{ $c.delete }}
                </a>
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
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

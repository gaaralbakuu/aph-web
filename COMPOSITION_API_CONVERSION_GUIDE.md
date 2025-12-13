# Composition API Conversion Guide (Vue 2.7 + TanStack Query)

This guide outlines the standard pattern for converting Vue components from Options API to Composition API (`<script setup>`) in this project.

## 1. Basic Structure

```vue
<template>
  <!-- Template content -->
</template>

<script setup>
import { reactive, ref, computed, watch, onMounted, getCurrentInstance } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import api from '@/api'
import { useLocalI18n } from '@/composables/useLocalI18n'
import store from '@/store'

// 1. Instance & Global Properties
const instance = getCurrentInstance()
const { $request, $message, $prompt } = instance.proxy
const route = instance.proxy.$route
const router = instance.proxy.$router

// 2. I18n
// Replace 'moduleName' with the specific module key (e.g., 'videoAdminCatalogue')
const { l, c } = useLocalI18n('moduleName')

// 3. Query Client
const queryClient = useQueryClient()

// 4. Reactive State
const state = reactive({
  list: [],
  query: {
    page: 1,
    pageSize: 10
  },
  form: {}
})

// 5. Data Fetching (TanStack Query)
const { data: listData, refetch: refetchList } = useQuery({
  queryKey: ['listData', state.query], // Add dependencies to queryKey
  queryFn: () => $request(api.someEndpoint, state.query)
})

// Sync query data to local state (Common pattern in this project for UI libs)
watch(() => listData.value, (newVal) => {
  if (newVal) {
    state.list = newVal.data
  }
})

// 6. Mutations
const updateMutation = useMutation({
  mutationFn: (data) => $request(api.updateEndpoint, data, 'post'),
  onSuccess: (res) => {
    if (res.httpCode == 200) {
      $message.success(l.oprateSuccess)
      refetchList()
    }
  }
})

// 7. Functions
const handleSearch = () => {
  state.query.page = 1
  refetchList()
}

const handleSubmit = () => {
  updateMutation.mutate(state.form)
}

// 8. Lifecycle Hooks
onMounted(() => {
  // Initial actions if not handled by useQuery
})
</script>

<style>
/* Styles */
</style>
```

## Key Rules

1.  **Global Access**: Access `$request`, `$message`, `$api` via `getCurrentInstance().proxy`.
2.  **Reactivity**: Use `reactive` for complex objects (forms, table data) and `ref` for primitives.
3.  **TanStack Query**:
    *   Use `useQuery` for GET requests.
    *   Use `useMutation` for POST/PUT/DELETE requests.
    *   Use `watch` to sync `useQuery` data to local reactive variables if the UI component requires mutable data (like some Element UI tables).
4.  **I18n**: Use the `useLocalI18n` composable.
5.  **Refs in Template**: Do not use `.value` in the template.
6.  **This**: Remove all references to `this`.

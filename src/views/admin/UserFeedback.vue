<template>
  <div class="flex flex-col flex-1 overflow-hidden bg-[#F9F9F9] font-roboto text-[#0D0D0D]">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-[#E5E5E5] flex justify-between items-center bg-white h-[70px]">
      <h1 class="text-xl font-medium mb-0!">{{ l.title || 'User Feedback' }}</h1>
    </div>

    <!-- Filter Bar -->
    <div class="px-6 py-4 border-b border-[#E5E5E5] bg-white sticky top-0 z-20 flex flex-wrap items-center gap-4">
      <!-- Date Range -->
      <div>
         <el-date-picker
            v-model="query.queryString.daterange"
            type="daterange"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :range-separator="l.to || '-'"
            :start-placeholder="l.Startdate || 'Start Date'"
            :end-placeholder="l.Enddate || 'End Date'"
            size="small"
            class="!w-[240px]"
         ></el-date-picker>
      </div>

      <!-- Search -->
      <div class="flex items-center gap-2 px-3 py-2 bg-white border border-[#CCCCCC] rounded hover:border-[#606060] transition-colors focus-within:border-[#065FD4] w-[250px]">
        <i class="el-icon-search text-[#606060] text-lg"></i>
        <input
          v-model="query.queryString.content"
          type="text"
          :placeholder="l.search"
          class="bg-transparent border-none outline-none text-sm w-full placeholder-[#999999]"
          @keyup.enter="search"
        />
        <i v-if="query.queryString.content" class="el-icon-close text-[#606060] cursor-pointer hover:text-[#0D0D0D]" @click="query.queryString.content = ''; search()"></i>
      </div>

      <Button variant="secondary" @click="search">{{ c.queryButton }}</Button>
    </div>

    <!-- Content Grid -->
    <div class="flex-1 overflow-hidden bg-white flex flex-col relative">
      <!-- Grid Header -->
      <div class="grid grid-cols-[150px_100px_1fr_200px_100px_80px_100px_150px_100px_150px_220px] gap-4 px-6 py-3 border-b border-[#E5E5E5] text-xs font-medium text-[#606060] bg-[#F9F9F9] sticky top-0 z-10 min-w-[1600px]">
        <div>{{ l.date }}</div>
        <div>{{ l.user }}</div>
        <div>{{ l.proposal }}</div>
        <div>{{ l.screenshot }}</div>
        <div>{{ l.reassignment_no }}</div>
        <div>{{ l.reply_qty }}</div>
        <div>{{ l.last_reply }}</div>
        <div>{{ l.reply_time }}</div>
        <div>{{ l.modify_user }}</div>
        <div>{{ l.modify_time }}</div>
        <div class="text-right">{{ c.operation }}</div>
      </div>

      <!-- List -->
      <div class="flex-1 overflow-auto custom-scrollbar">
        <div class="min-w-[1600px]">
          <div v-if="tableData.length === 0" class="flex flex-col items-center justify-center py-20 text-[#606060]">
            <i class="el-icon-document text-4xl mb-2 text-[#CCCCCC]"></i>
            <p>{{ c.noData }}</p>
          </div>

          <div v-for="(item, index) in tableData" :key="index" class="grid grid-cols-[150px_100px_1fr_200px_100px_80px_100px_150px_100px_150px_220px] gap-4 px-6 py-3 border-b border-[#E5E5E5] hover:bg-[#F9F9F9] items-center text-sm text-[#0D0D0D]">
            <div class="truncate">{{ item.create_time }}</div>
            <div class="truncate">{{ item.create_user }}</div>
            <div class="truncate" :title="item.content">{{ item.content }}</div>
            <div class="truncate">
               <a v-if="item.imgs" class="text-[#065FD4] hover:underline cursor-pointer" @click.prevent="showImgs(item)">
                  {{ item.imgSrcs ? item.imgSrcs.length : 0 }} {{ l.Picture }}
               </a>
            </div>
            <div class="truncate">{{ item.reassignment_no }}</div>
            <div class="truncate">{{ item.reply_qty }}</div>
            <div class="truncate">{{ item.last_reply }}</div>
            <div class="truncate">{{ item.reply_time }}</div>
            <div class="truncate">{{ item.modify_user }}</div>
            <div class="truncate">{{ item.modify_time }}</div>

            <div class="flex justify-end gap-2 text-[#606060]">
               <Button variant="primary" size="sm" @click="replylist(index)">{{ c.queryButton }}</Button>
               <Button variant="secondary" size="sm" class="!bg-[#67C23A] !text-white hover:!bg-[#85ce61] border-none" @click="reply(index)">{{ c.replymessage }}</Button>
               <Button variant="danger" size="sm" @click="transfershow(index)">{{ c.dispatch }}</Button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Hidden Viewer -->
    <viewer :images="imgSrcs" class="hidden">
       <div class="img-box" ref="viewer" v-for="(src, index) in imgSrcs" :key="index">
          <img :src="src" :key="src" />
       </div>
    </viewer>

    <!-- Pagination -->
    <div class="flex justify-end p-4 border-t border-[#E5E5E5] bg-white text-xs text-[#606060]">
      <Pagination
        :page="query.page"
        :pageSize="query.size"
        :total="total"
        :l="l"
        @update:page="query.page = $event"
        @update:pageSize="query.size = $event"
        @change="getList"
      />
    </div>

    <!-- Reply Modal -->
    <a-modal v-model:visible="dialogVisible" :title="l.replyTitle || 'Reply Message'" :width="600" :footer="null">
       <div class="p-4" v-if="tableData[index]">
          <h3 class="font-medium mb-2">{{ l.proposal }}</h3>
          <p class="text-sm text-[#606060] mb-4 bg-[#F9F9F9] p-2 rounded">{{ tableData[index].content }}</p>

          <div class="flex items-center gap-2 mb-2">
             <span class="text-sm">{{ l.autoQuote || 'Include original message?' }}</span>
             <a-switch v-model="suggestionpz" />
          </div>

          <textarea
             v-model="textarea1"
             rows="4"
             class="w-full p-2 border border-[#CCCCCC] rounded outline-none focus:border-[#065FD4] resize-none text-sm"
             :placeholder="l.replyPlaceholder || 'Enter reply...'"
          ></textarea>
       </div>
       <div class="border-t border-[#E5E5E5] p-4 flex justify-end items-center gap-2">
           <Button variant="ghost" @click="dialogVisible = false">{{ c.cancel }}</Button>
           <Button variant="primary" @click="feedback">{{ c.reply || 'Reply' }}</Button>
       </div>
    </a-modal>

    <!-- Reply History Modal -->
    <a-modal v-model:visible="replylistVisible" :title="l.replyHistory || 'Reply History'" :width="800" :footer="null">
       <div class="p-4">
          <div class="flex items-center gap-4 mb-4">
             <span class="text-sm">{{ l.sort || 'Sort' }}:</span>
             <el-radio-group v-model="replylistreverse" size="small">
                <el-radio :label="true">{{ l.desc || 'Desc' }}</el-radio>
                <el-radio :label="false">{{ l.asc || 'Asc' }}</el-radio>
             </el-radio-group>
          </div>

          <div class="max-h-[400px] overflow-y-auto custom-scrollbar p-2">
             <el-timeline :reverse="replylistreverse">
                <el-timeline-item
                   v-for="(activity, idx) in replylistdata"
                   :key="idx"
                   :icon="timelinecolor"
                   color="#0bbd87"
                   :timestamp="activity.create_time"
                >
                   <div class="text-sm">
                      <span class="font-medium">{{ activity.create_user }}</span>: {{ activity.body }}
                   </div>
                </el-timeline-item>
             </el-timeline>
          </div>
       </div>
       <div class="border-t border-[#E5E5E5] p-4 flex justify-end">
           <Button variant="ghost" @click="replylistVisible = false">{{ c.back || 'Back' }}</Button>
       </div>
    </a-modal>

    <!-- Transfer Modal -->
    <a-modal v-model:visible="transferVisible" :title="l.dispatch || 'Transfer'" :width="400" :footer="null">
       <div class="p-4">
          <label class="block text-sm font-medium text-[#0D0D0D] mb-2">{{ l.empNo || 'Employee No' }}</label>
          <input
             v-model="transferempno"
             class="w-full p-2 border border-[#CCCCCC] rounded outline-none focus:border-[#065FD4] text-sm"
             :placeholder="l.empNoPlaceholder || 'Enter employee number'"
          />
       </div>
       <div class="border-t border-[#E5E5E5] p-4 flex justify-end items-center gap-2">
           <Button variant="ghost" @click="transferVisible = false">{{ c.cancel }}</Button>
           <Button variant="primary" @click="transferaction">{{ c.dispatch }}</Button>
       </div>
    </a-modal>

    <!-- Loading Overlay -->
    <div v-if="pageLoading" class="absolute inset-0 z-50 bg-white/50 flex items-center justify-center">
        <i class="el-icon-loading text-3xl text-[#065FD4]"></i>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, getCurrentInstance, onMounted, nextTick } from 'vue'
import { message, Modal } from 'ant-design-vue'
import api from '@/api'
import { useLocalI18n } from '@/composables/useLocalI18n'
import Button from '@/views/sysbasics/video/adminViews/component/common/Button.vue'
import Pagination from '@/views/sysbasics/video/adminViews/component/common/Pagination.vue'
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
import Vue from 'vue'

// Global instance
const instance = getCurrentInstance()
const { $request, $message, $confirm, $alert } = instance.proxy

// Localization
const { l, c } = useLocalI18n('userfeedback')

// State
const pageLoading = ref(false)
const dialogVisible = ref(false)
const replylistVisible = ref(false)
const transferVisible = ref(false)

const tableData = ref([])
const total = ref(0)
const query = reactive({
  queryString: { content: '', system: '', daterange: [] },
  size: 10,
  page: 1,
})

const index = ref(0)
const textarea1 = ref('')
const suggestionpz = ref(false)
const imgSrcs = ref([])
const viewer = ref(null)

// Reply History
const replylistreverse = ref(true)
const replylistdata = ref([])
const timelinecolor = 'el-icon-more'

// Transfer
const transferempno = ref('')

const feedbackdata = reactive({
    subject: '23213',
    body: '123123',
    payload: '',
    empnopz: 'N',
    orgidpz: 'N',
    deptnopz: 'N',
    otherspz: 'N',
    messagesourcessystem: 'app.userfeedback',
    messagesourcesid: '',
    userList: [],
    sendAll: 0
})

// Methods
const getList = () => {
  pageLoading.value = true

  if (query.queryString.daterange && query.queryString.daterange.length > 0) {
     query.queryString.begintime = query.queryString.daterange[0]
     query.queryString.endtime = query.queryString.daterange[1]
  }

  $request(api.userfeedback + 'getlist', query)
    .then(r => {
      if (r.data.list) {
         r.data.list.forEach(i => {
            if (i.imgs) i.imgSrcs = i.imgs.split(',')
         })
         tableData.value = r.data.list
         total.value = r.data.total
      }
      pageLoading.value = false
    })
    .catch(() => {
      pageLoading.value = false
    })
}

const search = () => {
  query.page = 1
  getList()
}

const showImgs = (row) => {
   imgSrcs.value = row.imgSrcs
   nextTick(() => {
      setTimeout(() => {
         // Access viewer instance ref. Since it's in v-for, refs might be array.
         // Wait, viewer component wraps the divs.
         // <viewer :images="imgSrcs" ...><div ref="viewer">...</div></viewer>
         // We need to trigger the viewer.
         // Usually viewer component has a method or we click the image.
         // In original code: this.$refs.viewer[0].children[0].click()
         // With Composition API, we need to ensure refs work.
         // In loop: ref="viewer" -> viewer.value is array of elements.
         if (viewer.value && viewer.value[0] && viewer.value[0].children[0]) {
            viewer.value[0].children[0].click()
         } else {
            // If viewer ref is on the component itself?
            // Original template used `ref="viewer"` on `div.img-box`.
            // My template mimics it.
            const el = instance.refs.viewer // In script setup, use `useTemplateRef` or simple ref if name matches?
            // Actually `ref="viewer"` inside `v-for` puts elements into `viewer` array ref.
            if (viewer.value && viewer.value.length > 0) {
               const img = viewer.value[0].querySelector('img')
               if (img) img.click()
            }
         }
      }, 500)
   })
}

const reply = (idx) => {
   suggestionpz.value = false
   index.value = idx
   const item = tableData.value[idx]
   let vstr = item.content
   if (vstr.length > 20) vstr = vstr.substring(0, 20) + '...'

   feedbackdata.subject = ` 您于${item.create_time} 提出《${vstr}》`
   feedbackdata.body = `您提出建议： \r\n${item.content} `
   feedbackdata.userList = []
   feedbackdata.messagesourcesid = item.id
   feedbackdata.userList.push(item.create_user)

   dialogVisible.value = true
}

const feedback = () => {
   if (!textarea1.value) {
      $alert(l.value.replyEmpty || 'Reply content cannot be empty', c.value.tips || 'Tips', {
         confirmButtonText: c.value.confirm,
         type: 'warning'
      })
      return
   }

   Modal.confirm({
      title: c.value.oprConfirm,
      content: `${textarea1.value} , confirm reply?`,
      onOk() {
         dialogVisible.value = false

         if (suggestionpz.value) {
            feedbackdata.body = feedbackdata.body + '\r\n 回复如下：\r\n' + textarea1.value
         } else {
            feedbackdata.body = textarea1.value
         }

         // Original pushed '42222' (test user?)
         feedbackdata.userList.push('42222')
         suggestionpz.value = false

         $request(api.Message + 'createAppMessgae', feedbackdata, 'post')
           .then(() => {
              textarea1.value = ''
              feedbackdata.userList = []
              message.success(c.value.success)
              getList()
           })
           .catch(e => {
              console.error(e)
           })
      }
   })
}

const replylist = (idx) => {
   index.value = idx
   const item = tableData.value[idx]

   $request(api.Message + 'getMessagelist', {
      vmessagesourcessystem: 'app.userfeedback',
      vmessagesourcesid: item.id,
      vempno: ''
   })
   .then(r => {
      replylistdata.value = r.data
      replylistVisible.value = true
   })
   .catch(() => {})
}

const transfershow = (idx) => {
   index.value = idx
   transferVisible.value = true
}

const transferaction = () => {
   if (!transferempno.value) {
      $alert('Employee No cannot be empty', 'Warning', { type: 'warning' })
      return
   }

   Modal.confirm({
      title: c.value.oprConfirm,
      content: `Confirm transfer to: ${transferempno.value}?`,
      onOk() {
         transferVisible.value = false
         const item = tableData.value[index.value]

         $request(api.suggest + 'gettransfer', {
            suggestid: item.id,
            enpno: transferempno.value
         })
         .then(() => {
            transferempno.value = ''
            message.success(c.value.success)
            getList()
         })
         .catch(e => {
            console.error(e)
         })
      }
   })
}

// Lifecycle
onMounted(() => {
  getList()
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #cccccc;
  border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #999999;
}
.hidden {
   display: none;
}
</style>

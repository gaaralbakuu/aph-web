<template>
  <div class="p-6 space-y-6" v-loading="pageLoading">
    <div class="flex items-center space-x-4">
      <div class="flex items-center space-x-2">
         <Input type="date" v-model="daterange[0]" class="w-[150px]" placeholder="Start Date" />
         <span>{{ l.to }}</span>
         <Input type="date" v-model="daterange[1]" class="w-[150px]" placeholder="End Date" />
      </div>
      <Input
        v-model="query.queryString.content"
        :placeholder="l.search"
        class="w-[250px]"
      />
      <Button variant="secondary" @click="search">{{ c.queryButton }}</Button>
    </div>

    <div class="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{{ l.date }}</TableHead>
            <TableHead>{{ l.user }}</TableHead>
            <TableHead>{{ l.proposal }}</TableHead>
            <TableHead>{{ l.screenshot }}</TableHead>
            <TableHead>{{ l.reassignment_no }}</TableHead>
            <TableHead>{{ l.reply_qty }}</TableHead>
            <TableHead>{{ l.last_reply }}</TableHead>
            <TableHead>{{ l.reply_time }}</TableHead>
            <TableHead>{{ l.modify_user }}</TableHead>
            <TableHead>{{ l.modify_time }}</TableHead>
            <TableHead>{{ c.operation }}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="(row, index) in tableData" :key="index">
            <TableCell>{{ row.create_time }}</TableCell>
            <TableCell>{{ row.create_user }}</TableCell>
            <TableCell class="truncate max-w-[200px]" :title="row.content">{{ row.content }}</TableCell>
            <TableCell>
               <Button
                  v-if="row.imgs"
                  variant="link"
                  class="text-blue-600 h-auto p-0"
                  @click.prevent="showImgs(row)"
               >
                  {{ row.imgSrcs?.length }} {{ l.Picture }}
               </Button>
            </TableCell>
            <TableCell>{{ row.reassignment_no }}</TableCell>
            <TableCell>{{ row.reply_qty }}</TableCell>
            <TableCell>{{ row.last_reply }}</TableCell>
            <TableCell>{{ row.reply_time }}</TableCell>
            <TableCell>{{ row.modify_user }}</TableCell>
            <TableCell>{{ row.modify_time }}</TableCell>
            <TableCell>
               <div class="flex space-x-2">
                  <Button size="sm" variant="default" @click="replylist(index)">{{ c.queryButton }}</Button>
                  <Button size="sm" variant="secondary" @click="reply(index)">{{ c.replymessage }}</Button>
                  <Button size="sm" variant="destructive" @click="transfershow(index)">{{ c.dispatch }}</Button>
               </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <div class="flex justify-end">
      <Pagination
        v-model="query.page"
        :total="total"
        :page-size="query.size"
        @update:modelValue="handleCurrentChange"
      />
    </div>

    <!-- Viewer (Hidden) -->
    <viewer :images="imgSrcs" class="hidden">
       <div ref="viewer" v-for="(src, index) in imgSrcs" :key="index"><img :src="src" /></div>
    </viewer>

    <!-- Reply Dialog -->
    <Dialog :open="dialogVisible" @update:open="val => dialogVisible = val">
      <DialogContent class="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>信息回复</DialogTitle>
        </DialogHeader>
        <div class="space-y-4 py-4">
           <div>
              <h3 class="font-bold">{{ l.proposal }}</h3>
              <p class="text-sm text-muted-foreground">{{ tableData[index]?.content }}</p>
           </div>
           <div class="flex items-center space-x-2">
              <span class="text-sm">回复时是否需要自动带上建议内容：</span>
              <!-- Switch substitute -->
              <input type="checkbox" v-model="suggestionpz" />
           </div>
           <Textarea
             v-model="textarea1"
             placeholder="请输入回复内容"
             class="min-h-[100px]"
           />
        </div>
        <DialogFooter>
          <Button variant="outline" @click="dialogVisible = false">取消</Button>
          <Button type="submit" @click="feedback">回复</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Reply List Dialog -->
    <Dialog :open="replylistVisible" @update:open="val => replylistVisible = val">
      <DialogContent class="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>回复信息查询</DialogTitle>
        </DialogHeader>
        <div class="space-y-4 py-4">
           <div class="flex items-center space-x-4">
              <span>排序：</span>
              <div class="flex items-center space-x-2">
                 <input type="radio" :value="true" v-model="replylistreverse" id="r1" /><label for="r1">倒序</label>
                 <input type="radio" :value="false" v-model="replylistreverse" id="r2" /><label for="r2">正序</label>
              </div>
           </div>

           <!-- Timeline replacement -->
           <div class="space-y-4 max-h-[400px] overflow-auto">
              <div v-for="(activity, idx) in sortedReplyList" :key="idx" class="border-l-2 border-green-500 pl-4 ml-2 relative">
                 <div class="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-green-500"></div>
                 <div class="text-xs text-muted-foreground">{{ activity.create_time }}</div>
                 <div class="text-sm mt-1">
                    回复用户：{{ activity.create_user }} <br/>
                    回复内容：{{ activity.body }}
                 </div>
              </div>
           </div>
        </div>
        <DialogFooter>
           <Button variant="outline" @click="replylistVisible = false">返回</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Transfer Dialog -->
    <Dialog :open="transferVisible" @update:open="val => transferVisible = val">
      <DialogContent class="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>回复转派</DialogTitle>
        </DialogHeader>
        <div class="py-4">
           <Label class="mb-2 block">员工编号</Label>
           <Input v-model="transferempno" placeholder="请输入转派后新回复者的员工编号" />
        </div>
        <DialogFooter>
           <Button variant="outline" @click="transferVisible = false">取消</Button>
           <Button type="submit" @click="transferaction">转派</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, getCurrentInstance, watch, nextTick } from 'vue'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog'
import { Pagination } from '@/components/ui/pagination'
import { useLocalI18n } from '@/composables/useLocalI18n'
import { _, api } from '@/views/_common'
import 'viewerjs/dist/viewer.css'

const { proxy } = getCurrentInstance()
const { l, c } = useLocalI18n('userfeedback') // name from original

const pageLoading = ref(true)
const tableData = ref([])
const total = ref(0)
const query = reactive({
  queryString: { content: '', system: '', daterange: [] },
  size: 10,
  page: 1
})
const daterange = ref(['', ''])

const index = ref(0)
const suggestionpz = ref(false)
const textarea1 = ref('')
const dialogVisible = ref(false)

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

const replylistVisible = ref(false)
const replylistreverse = ref(true)
const replylistdata = ref([])

const transferVisible = ref(false)
const transferempno = ref('')

const imgSrcs = ref([])
const viewer = ref(null)

const sortedReplyList = computed(() => {
   const list = [...replylistdata.value]
   return replylistreverse.value ? list.reverse() : list
   // Actually API returns ordered list? Or we sort by time?
   // Original used el-timeline reverse prop.
   // Assuming input list is chronological.
})

const getList = () => {
    pageLoading.value = true
    let url = api.userfeedback + 'getlist'
    if (daterange.value[0] && daterange.value[1]) {
        query.queryString.begintime = daterange.value[0]
        query.queryString.endtime = daterange.value[1]
    } else {
        query.queryString.begintime = ''
        query.queryString.endtime = ''
    }
    proxy.$request(url, query)
        .then(r => {
            r.data.list.forEach(i => {
                if(i.imgs) i.imgSrcs = i.imgs.split(',')
            })
            tableData.value = r.data.list
            total.value = r.data.total
            pageLoading.value = false
        })
        .catch(() => pageLoading.value = false)
}

const search = () => {
    query.page = 1
    getList()
}

const handleCurrentChange = (val) => {
    query.page = val
    getList()
}

const showImgs = (row) => {
    imgSrcs.value = row.imgSrcs || []
    nextTick(() => {
        setTimeout(() => {
            if(viewer.value && viewer.value[0] && viewer.value[0].children[0]) {
               viewer.value[0].children[0].click()
            }
        }, 500)
    })
}

const transfershow = (idx) => {
    transferVisible.value = true
    index.value = idx
}

const transferaction = () => {
    if(!transferempno.value) {
        alert('新转派的员工编号不能为空') // Replace with shadcn toast/dialog if available
        return
    }
    if(window.confirm(' 确认将此回复工作，转派给：' + transferempno.value + ' ?')) {
        transferVisible.value = false
        let url = api.suggest + 'gettransfer'
        proxy.$request(url, { suggestid: tableData.value[index.value].id, enpno: transferempno.value })
            .then(() => {
                transferempno.value = ''
                getList()
            })
            .catch(e => console.log(e))
    }
}

const reply = (idx) => {
    suggestionpz.value = false
    let vstr = tableData.value[idx].content
    vstr = vstr.substring(0, 20)

    feedbackdata.subject = ' 您于' + tableData.value[idx].create_time + ' 提出《' + vstr + '》'
    feedbackdata.body = '您提出建议： \r\n' + tableData.value[idx].content + ' '
    feedbackdata.userList = []
    feedbackdata.messagesourcesid = tableData.value[idx].id
    feedbackdata.userList.push(tableData.value[idx].create_user)

    dialogVisible.value = true
    index.value = idx
}

const replylist = (idx) => {
    let url = api.Message + 'getMessagelist'
    proxy.$request(url, { vmessagesourcessystem: 'app.userfeedback', vmessagesourcesid: tableData.value[idx].id, vempno: '' })
        .then(r => {
            replylistdata.value = r.data
        })
    replylistVisible.value = true
    index.value = idx
}

const feedback = () => {
    if(!textarea1.value) {
        alert('回复内容不能为空')
        return
    }
    if(window.confirm(textarea1.value + ' ，确认将此内容回复给用户?')) {
        dialogVisible.value = false
        let url = api.Message + 'createAppMessgae'

        if (suggestionpz.value) {
            feedbackdata.body = feedbackdata.body + '\r\n 回复如下：\r\n' + textarea1.value
        } else {
            feedbackdata.body = textarea1.value
        }
        feedbackdata.userList.push('42222') // From original code

        proxy.$request(url, feedbackdata, 'post')
            .then(() => {
                textarea1.value = ''
                feedbackdata.userList = []
                getList()
            })
            .catch(e => console.log(e))
    }
}

onMounted(() => {
    getList()
})
</script>

<style scoped>
</style>

<template>
  <div class="flex flex-col flex-1 overflow-hidden bg-[#F9F9F9] font-roboto text-[#0D0D0D]">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-[#E5E5E5] flex justify-between items-center bg-white h-[70px]">
      <h1 class="text-xl font-medium mb-0!">{{ l.questionDrawerTitle }}</h1>

      <div class="flex gap-2">
        <button class="flex items-center gap-2 px-4 py-2 bg-[#CC0000] text-white! font-medium text-sm uppercase rounded-sm hover:bg-[#990000] transition-colors shadow-sm" @click="addQuestion">
          <i class="el-icon-plus text-lg"></i>
          <span>{{ l.createQuestion }}</span>
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="px-6 pt-6 pb-2 border-b border-[#E5E5E5] bg-white sticky top-0 z-20">
      <div class="flex items-center gap-4 text-sm font-medium text-[#606060]">
        <!-- College Select -->
        <div class="relative group w-48">
          <button class="w-full flex items-center justify-between px-3 py-2 bg-white border border-[#CCCCCC] rounded text-sm text-[#0D0D0D] hover:border-[#999999] transition-colors group-hover:border-[#606060]">
            <span class="flex items-center gap-2">
              <i class="el-icon-office-building text-[#606060]"></i>
              <span class="truncate">{{ college_id ? returnCollegeName(college_id) : l.pleaseSelectCollege }}</span>
            </span>
            <i class="el-icon-arrow-down text-[#606060] text-xs group-hover:rotate-180 transition-transform"></i>
          </button>
           <!-- Invisible hover bridge -->
          <div class="absolute top-full left-0 right-0 h-1 hidden group-hover:block"></div>
          <!-- Dropdown Menu -->
          <div class="absolute top-full left-0 right-0 pt-1 hidden group-hover:block z-50">
            <div class="bg-white border border-[#E5E5E5] rounded shadow-lg">
              <div class="max-h-56 overflow-y-auto">
                <button
                  v-for="college in publicCodeObj.collegeList"
                  :key="college.id"
                  class="w-full text-left px-3 py-2 hover:bg-[#F2F2F2] text-sm text-[#0D0D0D] border-b border-[#E5E5E5] last:border-b-0"
                  :class="college_id === college.id ? 'bg-[#F0F0F0] text-[#065FD4] font-medium' : ''"
                  @click="college_id = college.id">
                  <div class="flex items-center gap-2">
                    <i class="el-icon-check text-[#065FD4]" :class="college_id === college.id ? 'opacity-100' : 'opacity-0'"></i>
                    <span>{{ college.name_label }}</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="flex-1 flex items-center gap-2 px-3 py-2 bg-white border border-[#CCCCCC] rounded hover:border-[#606060] transition-colors focus-within:border-[#065FD4]">
          <i class="el-icon-search text-[#606060] text-lg"></i>
          <input v-model="questionObj.query.name" type="text" :placeholder="l.titleFilter" class="bg-transparent border-none outline-none text-sm w-full placeholder-[#999999]" @change="getQuestionList" />
        </div>

        <div class="relative w-40">
           <select v-model="questionObj.query.question_type" @change="getQuestionList" class="w-full p-2 bg-white border border-[#CCCCCC] rounded text-sm outline-none focus:border-[#065FD4]">
              <option value="">{{ l.all }}</option>
              <option v-for="i in publicCodeObj.question_type" :key="i.value" :value="i.value">{{ i.label }}</option>
           </select>
        </div>

        <div class="relative w-40">
           <select v-model="questionObj.query.question_status" @change="getQuestionList" class="w-full p-2 bg-white border border-[#CCCCCC] rounded text-sm outline-none focus:border-[#065FD4]">
              <option value="">{{ l.all }}</option>
              <option v-for="i in publicCodeObj.question_status" :key="i.value" :value="i.value">{{ i.label }}</option>
           </select>
        </div>

        <button class="bg-[#065FD4] text-white! px-4 py-2 rounded text-sm uppercase font-medium shadow-sm hover:bg-[#0551B4]" @click="getQuestionList">{{ l.search }}</button>

      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex overflow-hidden">
      <!-- Left: Catalog Tree -->
      <div class="w-[300px] bg-white border-r border-[#E5E5E5] flex flex-col">
        <div class="p-4 border-b border-[#E5E5E5] bg-[#F9F9F9] flex justify-between items-center">
           <h2 class="font-medium text-sm text-[#0D0D0D]">{{ l.catalogDrawerTitle }}</h2>
           <button class="text-[#065FD4] text-sm hover:underline" @click="addCatalog">{{ l.add }}</button>
        </div>
        <div class="p-2 border-b border-[#E5E5E5]">
          <div class="flex gap-2">
             <div class="flex-1 border border-[#CCCCCC] rounded px-2 py-1 flex items-center bg-white">
                <input v-model="filterCatalogText" :placeholder="l.filterCatalog" class="w-full text-xs outline-none" />
             </div>
             <select v-model="catalogObj.query.is_valid" @change="getCatalogList" class="border border-[#CCCCCC] rounded px-1 py-1 text-xs outline-none bg-white w-20">
                <option value="">{{ l.all }}</option>
                <option value="Y">{{ l.enableFilter }}</option>
                <option value="N">{{ l.disableFilter }}</option>
             </select>
          </div>
        </div>
        <div class="flex-1 overflow-y-auto p-2">
           <el-tree
              ref="catalogTree"
              node-key="id"
              :expand-on-click-node="false"
              :accordion="true"
              :default-expand-all="true"
              :data="catalogObj.list"
              :filter-node-method="filterCatalog">
            <template #default="{ node, data }">
              <div class="flex-1 flex justify-between items-center pr-2 py-1 group cursor-pointer" @click="clickQuestionCatalog(data.id)">
                <span class="text-sm truncate" :class="questionObj.query.question_category_id === data.id ? 'text-[#065FD4] font-medium' : 'text-[#0D0D0D]'">{{ data.name_label }}</span>
                <div class="hidden group-hover:flex gap-2">
                  <span class="text-[#065FD4] text-xs hover:underline" @click.stop="editCatalog(data)">{{ l.edit }}</span>
                  <span v-if="data.is_valid == 'Y'" class="text-[#CC0000] text-xs hover:underline" @click.stop="modifyCatalogStatus(data)">{{ l.disable }}</span>
                  <span v-else class="text-[#069C56] text-xs hover:underline" @click.stop="modifyCatalogStatus(data)">{{ l.enable }}</span>
                </div>
              </div>
            </template>
          </el-tree>
        </div>
      </div>

      <!-- Right: Question List -->
      <div class="flex-1 overflow-y-auto bg-white flex flex-col">
          <div class="grid grid-cols-[50px_3fr_100px_120px_100px_100px_120px] gap-4 px-6 py-2 border-b border-[#E5E5E5] text-xs font-medium text-[#606060] bg-white sticky top-0 z-10">
            <div>{{ l.serialNumber }}</div>
            <div>{{ l.question }}</div>
            <div>{{ l.difficulty }}</div>
            <div>{{ l.questionTypeColumn }}</div>
            <div>{{ l.publishStatusColumn }}</div>
            <div>{{ l.status }}</div>
            <div class="text-right">{{ l.actions }}</div>
          </div>

          <div class="divide-y divide-[#E5E5E5]">
             <div v-if="questionObj.list.length === 0" class="flex flex-col items-center justify-center py-20">
              <div class="w-32 h-32 bg-[#F9F9F9] rounded-full flex items-center justify-center mb-4">
                <i class="el-icon-document text-4xl text-[#CCCCCC]"></i>
              </div>
              <p class="text-[#0D0D0D]">{{ c.noData }}</p>
            </div>
            <div v-else v-for="(item, index) in questionObj.list" :key="item.id" class="grid grid-cols-[50px_3fr_100px_120px_100px_100px_120px] gap-4 px-6 py-3 hover:bg-[#F9F9F9] items-center text-sm text-[#0D0D0D]">
               <div class="text-[#606060]">{{ (questionObj.query.page - 1) * questionObj.query.pageSize + index + 1 }}</div>
               <div class="font-medium truncate" :title="item.name_label">{{ item.name_label }}</div>
               <div>{{ item.difficulty_level }}</div>
               <div>{{ returnPublicObjLabel(item.question_type, 'value', 'label', 'question_type') }}</div>
               <div>{{ returnPublicObjLabel(item.question_status, 'value', 'label', 'question_status') }}</div>
               <div>
                  <span :class="item.is_valid === 'Y' ? 'text-[#069C56]' : 'text-[#CC0000]'">
                    {{ item.is_valid === 'Y' ? l.enableStatus : l.disableStatus }}
                  </span>
               </div>
               <div class="flex items-center justify-end gap-3">
                  <button class="text-[#606060] hover:text-[#0D0D0D]" @click="editQuestion(item)">
                    <i class="el-icon-edit text-lg"></i>
                  </button>
                   <button class="" :class="item.is_valid === 'Y' ? 'text-[#CC0000]' : 'text-[#069C56]'" @click="toggleQuestionStatus(item)">
                    <i :class="item.is_valid === 'Y' ? 'el-icon-video-pause' : 'el-icon-video-play'" class="text-lg"></i>
                  </button>
               </div>
            </div>
          </div>
      </div>
    </div>

    <!-- Pagination -->
     <div class="flex justify-end p-4 border-t border-[#E5E5E5] bg-white text-xs text-[#606060]">
      <div class="flex items-center gap-2">
        <span>{{ l.rowsPerPage }}:</span>
        <select
          class="border-none bg-transparent outline-none font-medium"
          v-model.number="questionObj.query.pageSize"
          @change="
            questionObj.query.page = 1
            getQuestionList()
          ">
          <option :value="10">10</option>
          <option :value="30">30</option>
          <option :value="50">50</option>
        </select>
        <span class="mx-2">{{ (questionObj.query.page - 1) * questionObj.query.pageSize + 1 }}-{{ Math.min(questionObj.query.page * questionObj.query.pageSize, questionObj.total) }} {{ l.of }} {{ questionObj.total }}</span>
        <i class="el-icon-arrow-left cursor-pointer hover:bg-[#F2F2F2] p-1 rounded-full" :class="questionObj.query.page <= 1 ? 'opacity-50 cursor-not-allowed' : ''" @click="questionObj.query.page > 1 && handlePageChange(questionObj.query.page - 1)"></i>
        <i class="el-icon-arrow-right cursor-pointer hover:bg-[#F2F2F2] p-1 rounded-full" :class="questionObj.query.page >= Math.ceil(questionObj.total / questionObj.query.pageSize) ? 'opacity-50 cursor-not-allowed' : ''" @click="questionObj.query.page < Math.ceil(questionObj.total / questionObj.query.pageSize) && handlePageChange(questionObj.query.page + 1)"></i>
      </div>
    </div>

    <!-- Catalog Drawer -->
    <a-drawer :visible="showObj.catalogDrawer" :title="l.catalogDrawerTitle" :width="600" @close="showObj.catalogDrawer = false" :body-style="{ padding: 0 }">
       <div class="flex flex-col h-full bg-white font-roboto">
          <div class="flex-1 overflow-y-auto p-6 space-y-4">
             <div class="relative group border border-[#CCCCCC] rounded px-3 py-2 focus-within:border-[#065FD4]">
                <label class="block text-xs text-[#606060] mb-1">{{ l.college }}</label>
                <select v-model="catalogObj.form.college_id" class="w-full outline-none text-sm bg-transparent" @change="catalogCollegeChange">
                  <option v-for="i in publicCodeObj.collegeList" :key="i.id" :value="i.id">{{ i.name_label }}</option>
                </select>
             </div>

             <div class="relative group border border-[#CCCCCC] rounded px-3 py-2 focus-within:border-[#065FD4]">
                <label class="block text-xs text-[#606060] mb-1">{{ l.parentCatalog }}</label>
                 <el-cascader v-model="catalogObj.form.pid" :options="publicCodeObj.catalogList" clearable :placeholder="l.defaultRootCatalog" style="width: 100%" :props="catalogObj.cascaderProps" class="w-full no-border-input"></el-cascader>
             </div>

             <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.nameZh }}</label>
                <input v-model="catalogObj.form.name_zh" class="w-full outline-none text-[#0D0D0D] text-sm" />
             </div>
             <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.nameTw }}</label>
                <input v-model="catalogObj.form.name_tw" class="w-full outline-none text-[#0D0D0D] text-sm" />
             </div>
             <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.nameEn }}</label>
                <input v-model="catalogObj.form.name_en" class="w-full outline-none text-[#0D0D0D] text-sm" />
             </div>
             <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.nameVi }}</label>
                <input v-model="catalogObj.form.name_vi" class="w-full outline-none text-[#0D0D0D] text-sm" />
             </div>

             <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.catalogDescription }}</label>
                <textarea v-model="catalogObj.form.description" class="w-full outline-none text-[#0D0D0D] text-sm resize-none" rows="4"></textarea>
             </div>
          </div>
          <div class="p-4 border-t border-[#E5E5E5] flex justify-end gap-2 bg-white">
            <button class="px-4 py-2 text-[#065FD4] font-medium text-sm uppercase hover:bg-[#F2F8FF] rounded-sm transition-colors" @click="showObj.catalogDrawer = false">
              {{ l.close }}
            </button>
            <button class="px-6 py-2 bg-[#065FD4] text-white! font-medium text-sm uppercase rounded-sm shadow-sm hover:bg-[#0551B4] transition-colors" @click="submitCatalog">
              {{ l.submit }}
            </button>
          </div>
       </div>
    </a-drawer>

    <!-- Question Drawer -->
    <a-drawer :visible="showObj.questionDrawer" :title="l.questionDrawerTitle" :width="900" @close="showObj.questionDrawer = false" :body-style="{ padding: 0 }">
       <div class="flex flex-col h-full bg-white font-roboto">
          <div class="flex-1 overflow-y-auto p-6 space-y-4">
             <!-- Top Form -->
             <div class="grid grid-cols-2 gap-4">
               <div class="relative group border border-[#CCCCCC] rounded px-3 py-2 focus-within:border-[#065FD4]">
                  <label class="block text-xs text-[#606060] mb-1">{{ l.college }}</label>
                  <select v-model="questionObj.form.college_id" class="w-full outline-none text-sm bg-transparent" @change="questionCollegeChange">
                    <option v-for="i in publicCodeObj.collegeList" :key="i.id" :value="i.id">{{ i.name_label }}</option>
                  </select>
               </div>
               <div class="relative group border border-[#CCCCCC] rounded px-3 py-2 focus-within:border-[#065FD4]">
                  <label class="block text-xs text-[#606060] mb-1">{{ l.questionCategory }}</label>
                   <el-cascader v-model="questionObj.form.question_category_id" :options="publicCodeObj.catalogList" clearable :placeholder="l.defaultRootCatalog" :props="catalogObj.cascaderProps" style="width: 100%" class="no-border-input"></el-cascader>
               </div>
             </div>

             <div class="grid grid-cols-2 gap-4">
               <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                  <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.nameZh }}</label>
                  <input v-model="questionObj.form.name_zh" class="w-full outline-none text-[#0D0D0D] text-sm" />
               </div>
               <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                  <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.nameTw }}</label>
                  <input v-model="questionObj.form.name_tw" class="w-full outline-none text-[#0D0D0D] text-sm" />
               </div>
               <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                  <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.nameEn }}</label>
                  <input v-model="questionObj.form.name_en" class="w-full outline-none text-[#0D0D0D] text-sm" />
               </div>
               <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                  <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.nameVi }}</label>
                  <input v-model="questionObj.form.name_vi" class="w-full outline-none text-[#0D0D0D] text-sm" />
               </div>
             </div>

             <div class="grid grid-cols-3 gap-4">
                <div class="relative group border border-[#CCCCCC] rounded px-3 py-2 focus-within:border-[#065FD4]">
                   <label class="block text-xs text-[#606060] mb-1">{{ l.questionType }}</label>
                   <select v-model="questionObj.form.question_type" class="w-full outline-none text-sm bg-transparent" @change="question_typeChange">
                      <option v-for="i in publicCodeObj.question_type" :key="i.value" :value="i.value">{{ i.label }}</option>
                   </select>
                </div>
                 <div class="relative group border border-[#CCCCCC] rounded px-3 py-2 focus-within:border-[#065FD4]">
                   <label class="block text-xs text-[#606060] mb-1">{{ l.publishStatus }}</label>
                   <select v-model="questionObj.form.question_status" class="w-full outline-none text-sm bg-transparent">
                      <option v-for="i in publicCodeObj.question_status" :key="i.value" :value="i.value">{{ i.label }}</option>
                   </select>
                </div>
                 <div class="relative group border border-[#CCCCCC] rounded px-3 py-2 focus-within:border-[#065FD4]">
                   <label class="block text-xs text-[#606060] mb-1">{{ l.difficultyLevel }}</label>
                   <select v-model="questionObj.form.difficulty_level" class="w-full outline-none text-sm bg-transparent">
                      <option v-for="i in 10" :key="i" :value="i">{{ i }}</option>
                   </select>
                </div>
             </div>

             <!-- Options Section -->
             <div class="mt-6">
                <div v-if="questionObj.form.question_type === 0">
                    <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                      <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.inputContent }}</label>
                      <textarea class="w-full outline-none text-[#0D0D0D] text-sm resize-none" rows="2"></textarea>
                    </div>
                </div>

                <div v-else-if="questionObj.form.question_type == 1 || questionObj.form.question_type == 2 || questionObj.form.question_type == 3">
                   <div v-for="(i, index) in (questionObj.form.question_type == 3 ? templateObj.judge : templateObj.radio)" :key="index" class="mb-4 border border-[#E5E5E5] rounded p-4 bg-[#F9F9F9]">
                      <div class="flex justify-between items-center mb-2 pb-2 border-b border-[#E5E5E5]">
                         <span class="font-medium text-sm">{{ l.option }} {{ index + 1 }}</span>
                         <div class="flex gap-2">
                            <i v-if="questionObj.form.question_type != 3" class="el-icon-remove-outline text-[#CC0000] text-xl cursor-pointer" @click="removeOption(index, 'radio')"></i>
                            <i v-if="questionObj.form.question_type != 3 && index + 1 == templateObj.radio.length" class="el-icon-circle-plus-outline text-[#065FD4] text-xl cursor-pointer" @click="addOption"></i>
                         </div>
                      </div>
                      <div class="grid grid-cols-2 gap-2 mb-2">
                         <div class="flex items-center border border-[#CCCCCC] rounded bg-white overflow-hidden">
                            <span class="bg-[#F2F2F2] px-2 py-2 text-xs text-[#606060] border-r border-[#CCCCCC] w-10 text-center">{{ l.zh }}</span>
                            <input v-model="i.name_zh" class="flex-1 px-2 py-1 outline-none text-sm" />
                         </div>
                          <div class="flex items-center border border-[#CCCCCC] rounded bg-white overflow-hidden">
                            <span class="bg-[#F2F2F2] px-2 py-2 text-xs text-[#606060] border-r border-[#CCCCCC] w-10 text-center">{{ l.en }}</span>
                            <input v-model="i.name_en" class="flex-1 px-2 py-1 outline-none text-sm" />
                         </div>
                         <div class="flex items-center border border-[#CCCCCC] rounded bg-white overflow-hidden">
                            <span class="bg-[#F2F2F2] px-2 py-2 text-xs text-[#606060] border-r border-[#CCCCCC] w-10 text-center">{{ l.vi }}</span>
                            <input v-model="i.name_vi" class="flex-1 px-2 py-1 outline-none text-sm" />
                         </div>
                         <div class="flex items-center border border-[#CCCCCC] rounded bg-white overflow-hidden">
                            <span class="bg-[#F2F2F2] px-2 py-2 text-xs text-[#606060] border-r border-[#CCCCCC] w-10 text-center">{{ l.tw }}</span>
                            <input v-model="i.name_tw" class="flex-1 px-2 py-1 outline-none text-sm" />
                         </div>
                      </div>
                      <div class="flex justify-end">
                         <label class="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" v-model="i.is_correct" class="accent-[#069C56]" />
                            <span class="text-sm font-medium" :class="i.is_correct ? 'text-[#069C56]' : 'text-[#606060]'">{{ l.correctAnswer }}</span>
                         </label>
                      </div>
                   </div>
                </div>
             </div>
          </div>
          <div class="p-4 border-t border-[#E5E5E5] flex justify-end gap-2 bg-white">
            <button class="px-4 py-2 text-[#065FD4] font-medium text-sm uppercase hover:bg-[#F2F8FF] rounded-sm transition-colors" @click="showObj.questionDrawer = false">
              {{ l.close }}
            </button>
            <button class="px-6 py-2 bg-[#065FD4] text-white! font-medium text-sm uppercase rounded-sm shadow-sm hover:bg-[#0551B4] transition-colors" @click="submitQuestion">
              {{ l.submit }}
            </button>
          </div>
       </div>
    </a-drawer>
  </div>
</template>

<script setup>
import { reactive, computed, watch, onMounted, ref, getCurrentInstance, set as vueSet } from 'vue'
import { message } from 'ant-design-vue'
import store from '@/store'
import api from '@/api'
import { useLocalI18n } from '@/composables/useLocalI18n'
import { assignObject } from '@/utils'

// Hooks
const { l, c } = useLocalI18n('videoAdminQuestion')
const instance = getCurrentInstance()
const route = instance.proxy.$route
const { $request, $prompt } = instance.proxy

// State
const isAdmin = computed(() => store.getters.isAdmin)
const college_id = ref(null)
const filterCatalogText = ref('')
const catalogTree = ref(null)

const showObj = reactive({
  catalogDrawer: false,
  questionDrawer: false,
})

const templateObj = reactive({
  radio: [],
  fillin: [{ id: '' }],
  judge: [],
})

const publicCodeObj = reactive({
  catalogList: [],
  collegeList: [],
  question_type: [
    { label: l.value.fillInBlank, value: 0 },
    { label: l.value.singleChoice, value: 1 },
    { label: l.value.multipleChoice, value: 2 },
    { label: l.value.judgement, value: 3 },
  ],
  question_status: [
    { label: l.value.unpublished, value: 0 },
    { label: l.value.published, value: 1 },
  ],
})

const questionObj = reactive({
  query: {
    id: '',
    name: '',
    question_status: '',
    question_type: '',
    question_category_id: '',
    page: 1,
    pageSize: 15,
  },
  form: {
    id: '',
    college_id: '',
    question_id: '',
    name_zh: '',
    name_tw: '',
    name_en: '',
    name_vi: '',
    question_type: '',
    difficulty_level: '',
    question_status: '',
    question_category_id: '',
    is_valid: '',
    rec_status: '',
    version: '',
    options: [],
  },
  list: [],
  total: 0,
})

const catalogObj = reactive({
  cascaderProps: {
    expandTrigger: 'hover',
    checkStrictly: true,
    emitPath: false,
    value: 'id',
    label: 'name_label',
  },
  query: {
    is_valid: '',
  },
  form: {
    id: '',
    college_id: '',
    pid: '',
    pname: '',
    sort: '',
    name_zh: '',
    name_tw: '',
    name_vi: '',
    name_en: '',
    description: '',
    is_valid: '',
    rec_status: '',
  },
  list: [],
})

// Watchers
watch(filterCatalogText, (val) => {
  if (catalogTree.value) {
    catalogTree.value.filter(val)
  }
})

watch(college_id, (n, o) => {
  questionObj.query.question_category_id = ''
  getQuestionList()
  getCatalogList()
})

// Methods
const returnCollegeName = (id) => {
  let college = publicCodeObj.collegeList.find((i) => i.id == id)
  if (college) {
    return college.name_label
  } else {
    return id
  }
}

const handlePageChange = (page) => {
  questionObj.query.page = page
  getQuestionList()
}

const returnPublicObjLabel = (inputValue, key, outputValue, filed) => {
  let item = publicCodeObj[filed].find((i) => {
    return i[key] == inputValue
  })
  if (item) {
    return item[outputValue]
  } else {
    return inputValue
  }
}

// Question Logic
const question_typeChange = (e) => {
   // e is event or value depending on browser, in Vue @change on select returns event.
   // But v-model updates value. Actually in Vue 2 select change param is value? No standard DOM event.
   // Wait, we used v-model.
   const v = questionObj.form.question_type;
   if (v == 1 || v == 2) {
    if (templateObj.radio.length == 0) {
      addOption()
    }
  } else if (v == 3) {
    if (templateObj.judge.length == 0) {
      templateObj.judge = [
        {
          id: '', option_id: '', pid: '', name_zh: '正确', name_tw: '正確', name_en: 'True', name_vi: 'Đúng', is_correct: false, sort: '', is_valid: 'Y', rec_status: 1,
        },
        {
          id: '', option_id: '', pid: '', name_zh: '错误', name_tw: '錯誤', name_en: 'False', name_vi: 'Sai', is_correct: false, sort: '', is_valid: 'Y', rec_status: 1,
        },
      ]
    }
  }
}

const clickQuestionCatalog = (id) => {
  questionObj.query.question_category_id = id
  getQuestionList()
}

const addOption = () => {
  if (questionObj.form.question_type === 0) {
    templateObj.fillin.push({ id: '', option_id: '', pid: '', name_zh: '', name_tw: '', name_en: '', name_vi: '', is_correct: false, sort: '', is_valid: 'Y', rec_status: 1 })
  } else if (questionObj.form.question_type === 3) {
    templateObj.judge.push({ id: '', option_id: '', pid: '', name_zh: '', name_tw: '', name_en: '', name_vi: '', is_correct: false, sort: '', is_valid: 'Y', rec_status: 1 })
  } else {
    templateObj.radio.push({ id: '', option_id: '', pid: '', name_zh: '', name_tw: '', name_en: '', name_vi: '', is_correct: false, sort: '', is_valid: 'Y', rec_status: 1 })
  }
}

const removeOption = (i, filed) => {
  templateObj[filed].splice(i, 1)
  if (templateObj[filed].length == 0) {
    addOption()
  }
}

const questionCollegeChange = (v) => {
  questionObj.query.question_category_id = ''
  getCatalogListById(v)
}

const addQuestion = () => {
  // Reset templateObj
  templateObj.radio = []
  templateObj.judge = []
  templateObj.fillin = [{ id: '' }]

  for (let key in questionObj.form) {
    if (questionObj.form.hasOwnProperty(key)) {
      if(key === 'options') questionObj.form[key] = []
      else questionObj.form[key] = ''
    }
  }
  Object.assign(questionObj.form, {
    is_valid: 'Y',
    rec_status: 1,
    college_id: college_id.value,
  })
  getCatalogListById(college_id.value)
  showObj.questionDrawer = true
}

const editQuestion = (data) => {
  assignObject(questionObj.form, data)
  getCatalogListById(data.college_id)
  if (questionObj.form.question_type === 0) {
    templateObj.fillin = JSON.parse(JSON.stringify(data.options))
  } else if (questionObj.form.question_type === 3) {
    templateObj.judge = JSON.parse(JSON.stringify(data.options))
  } else {
    templateObj.radio = JSON.parse(JSON.stringify(data.options))
  }
  showObj.questionDrawer = true
}

const submitQuestion = () => {
  if (questionObj.form.college_id == '') {
    return message.error(l.value.pleaseSelectCollege)
  }

  if (questionObj.form.question_type === 0) {
    questionObj.form.options = [{ id: '' }]
  } else if (questionObj.form.question_type === 3) {
    questionObj.form.options = templateObj.judge
  } else {
    questionObj.form.options = templateObj.radio
  }

  $request(api.videoServer + '/Video/VideoExam/addQuestion', questionObj.form, 'post')
    .then((r) => {
      if (r.httpCode == 200) {
        message.success(l.value.submitSuccess)
        let timer = setTimeout(() => {
          showObj.questionDrawer = false
          getQuestionList()
          clearTimeout(timer)
        }, 1500)
      }
    })
    .catch((e) => {
      console.log(e)
    })
}

const toggleQuestionStatus = (data) => {
  let msg
  let value
  if (data.is_valid == 'Y') {
    msg = l.value.disableQuestionConfirm.replace('{name}', data.name_label)
    value = 'N'
  } else {
    msg = l.value.enableQuestionConfirm.replace('{name}', data.name_label)
    value = 'Y'
  }

  $prompt(msg, {
    type: 'warning',
    inputPattern: /^[Y]{1}$/i,
    inputErrorMessage: l.value.inputError,
    confirmButtonText: l.value.confirm,
    cancelButtonText: l.value.cancel,
  })
    .then(() => {
      return $request(
        api.videoServer + '/Video/VideoExam/toggleQuestionStatus',
        {
          id: data.id,
          value,
        },
        'post'
      )
    })
    .then(() => {
      message.success(l.value.modifySuccess)
      getQuestionList()
    })
    .catch((err) => {
      console.log('cancel')
    })
}

const getQuestionList = () => {
  $request(api.videoServer + '/Video/VideoExam/getQuestionList', {
    ...questionObj.query,
    college_id: college_id.value,
  })
    .then((r) => {
      questionObj.list = r.data.list
      questionObj.total = r.data.total
    })
    .catch((e) => {
      console.log(e)
    })
}

// Catalog Logic
const catalogCollegeChange = (v) => {
  catalogObj.form.pid = ''
  getCatalogListById(v)
}

const filterCatalog = (value, data) => {
  if (!value) return true
  return data.name_label.indexOf(value) !== -1
}

const addCatalog = () => {
  catalogObj.form = {
    id: '', pid: '', pname: '', sort: '', name_zh: '', name_tw: '', name_en: '', name_vi: '', description: '', is_valid: 'Y', rec_status: 1, college_id: college_id.value,
  }
  showObj.catalogDrawer = true
}

const editCatalog = (data) => {
  assignObject(catalogObj.form, data)
  getCatalogListById(data.college_id)
  showObj.catalogDrawer = true
}

const modifyCatalogStatus = (data) => {
  let msg
  let status
  if (data.is_valid == 'Y') {
    msg = l.value.disableCatalogConfirm.replace('{name}', data.name_label)
    status = 'N'
  } else {
    msg = l.value.enableCatalogConfirm.replace('{name}', data.name_label)
    status = 'Y'
  }
  $prompt(msg, {
    type: 'warning',
    inputPattern: /^[Y]{1}$/i,
    inputErrorMessage: l.value.inputError,
    confirmButtonText: l.value.confirm,
    cancelButtonText: l.value.cancel,
  })
    .then(() => {
      $request(
        api.videoServer + '/Video/VideoExam/DeleteOrRecoveryCatagoryById',
        {
          key: data.id,
          value: status,
        },
        'post'
      ).then((r) => {
        message.success(l.value.modifySuccess)
        getCatalogList()
      })
    })
    .catch(() => {
      console.log('cancel')
    })
}

const submitCatalog = () => {
  if (catalogObj.form.college_id == '') {
    return message.error(l.value.pleaseSelectCollege)
  }
  if (catalogObj.form.name_zh == '') {
    return message.error(l.value.pleaseInputNameZh)
  }
  if (catalogObj.form.pid == '') {
    catalogObj.form.pid = '0'
  }
  $request(api.videoServer + '/Video/VideoExam/addQuestionCatagory', catalogObj.form, 'post')
    .then((r) => {
      if (r.httpCode == 200) {
        message.success(l.value.submitSuccess)
        let timer = setTimeout(() => {
          showObj.catalogDrawer = false
          getCatalogList()
          clearTimeout(timer)
        }, 1500)
      }
    })
    .catch((e) => {
      console.log(e)
    })
}

const getCatalogList = () => {
  $request(api.videoServer + '/Video/VideoExam/getQuestionCatagoryList', {
    ...catalogObj.query,
    college_id: college_id.value,
  })
    .then((r) => {
      catalogObj.list = r.data
    })
    .catch((e) => {
      console.log(e)
    })
}

const getCatalogListById = (id) => {
  $request(api.videoServer + '/Video/VideoExam/getQuestionCatagoryList', {
    ...catalogObj.query,
    college_id: id,
  })
    .then((r) => {
      publicCodeObj.catalogList = r.data
    })
    .catch((e) => {
      console.log(e)
    })
}

const getCollegeList = () => {
  $request(api.videoServer + '/Video/VideoMenu/getCollegeRoleByPath', {
    resource_path: route.path,
  })
    .then((r) => {
      publicCodeObj.collegeList = r.data
      college_id.value = r.data[0].id
    })
    .catch((e) => {
      message.error(e.message)
    })
}

onMounted(() => {
  getCollegeList()
})
</script>

<style scoped>
.no-border-input :deep(.el-input__inner) {
  border: none !important;
  height: 24px !important;
  line-height: 24px !important;
  padding: 0 !important;
}
.no-border-input :deep(.el-input__icon) {
  line-height: 24px !important;
}
</style>

<template>
  <div class="flex flex-col flex-1 overflow-hidden bg-[#F9F9F9] font-roboto text-[#0D0D0D]">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-[#E5E5E5] flex justify-between items-center bg-white h-[70px]">
      <h1 class="text-xl font-medium mb-0!">{{ l.manageClass }}</h1>
      <Button variant="primary" icon="el-icon-plus" @click="addClass">
        {{ l.create }}
      </Button>
    </div>

    <!-- Filter Tabs & Toolbar -->
    <div class="px-6 pt-6 pb-2 border-b border-[#E5E5E5] bg-white sticky top-0 z-20">
      <div class="flex items-center gap-6 text-sm font-medium text-[#606060]">
        <button
          class="pb-3 border-b-2 transition-colors"
          :class="classObj.query.is_valid === '' ? 'text-[#0D0D0D] border-[#0D0D0D]' : 'border-transparent hover:text-[#0D0D0D]'"
          @click="
            classObj.query.is_valid = ''
            getClassList()
          ">
          {{ l.all }}
        </button>
        <button
          class="pb-3 border-b-2 transition-colors"
          :class="classObj.query.is_valid === 'Y' ? 'text-[#0D0D0D] border-[#0D0D0D]' : 'border-transparent hover:text-[#0D0D0D]'"
          @click="
            classObj.query.is_valid = 'Y'
            getClassList()
          ">
          {{ l.enabled }}
        </button>
        <button
          class="pb-3 border-b-2 transition-colors"
          :class="classObj.query.is_valid === 'N' ? 'text-[#0D0D0D] border-[#0D0D0D]' : 'border-transparent hover:text-[#0D0D0D]'"
          @click="
            classObj.query.is_valid = 'N'
            getClassList()
          ">
          {{ l.disabled }}
        </button>
      </div>

      <!-- Filters Row -->
      <div class="mt-4 flex items-center gap-4 mb-2">
        <Dropdown
          v-if="isAdmin"
          :modelValue="classObj.query.college_id"
          :options="publicCodeObj.collegeList"
          :placeholder="l.pleaseSelectCollege"
          label-key="name_label"
          icon-class="el-icon-office-building"
          @update:modelValue="classObj.query.college_id = $event; getClassList()"
        />

        <div class="flex-1 flex items-center gap-2 px-3 py-2 bg-white border border-[#CCCCCC] rounded hover:border-[#606060] transition-colors focus-within:border-[#065FD4]">
          <i class="el-icon-search text-[#606060] text-lg"></i>
          <input
            v-model="classObj.query.name"
            type="text"
            :placeholder="l.className"
            class="bg-transparent border-none outline-none text-sm w-full placeholder-[#999999]"
            @keyup.enter="getClassList"
            @change="getClassList"
          />
        </div>
      </div>
    </div>

    <!-- Content List -->
    <div class="flex-1 overflow-y-scroll relative">
      <!-- Grid Header -->
      <div class="grid grid-cols-[50px_2fr_1.5fr_1.5fr_1.5fr_1fr_1.5fr_1.5fr_100px_150px] gap-4 px-6 py-2 border-b border-[#E5E5E5] text-xs font-medium text-[#606060] bg-white sticky top-0 z-10 min-w-[1400px]">
        <div>#</div>
        <div>{{ l.simplifiedChinese }}</div>
        <div>{{ l.college }}</div>
        <div>{{ l.affiliatedPlan }}</div>
        <div>{{ l.trainingContent }}</div>
        <div>{{ l.classTeacher }}</div>
        <div>{{ l.startTime }}</div>
        <div>{{ l.endTime }}</div>
        <div>{{ l.status }}</div>
        <div class="text-right">{{ l.operation }}</div>
      </div>

      <!-- Grid Body -->
      <div class="flex-1 overflow-hidden bg-white flex flex-col min-w-[1400px]">
         <div v-if="classObj.list.length === 0" class="flex flex-col items-center justify-center py-20">
            <div class="w-24 h-24 bg-[#F9F9F9] rounded-full flex items-center justify-center mb-4">
              <i class="el-icon-document-delete text-4xl text-[#CCCCCC]"></i>
            </div>
            <p class="text-[#0D0D0D]">{{ l.tempNoData }}</p>
         </div>
         <div v-else class="divide-y divide-[#E5E5E5]">
            <div v-for="(item, index) in classObj.list" :key="item.id" class="grid grid-cols-[50px_2fr_1.5fr_1.5fr_1.5fr_1fr_1.5fr_1.5fr_100px_150px] gap-4 px-6 py-3 hover:bg-[#F9F9F9] items-center text-sm text-[#0D0D0D] transition-colors">
              <div class="text-[#606060]">{{ index + 1 }}</div>
              <div class="font-medium truncate" :title="item.name_zh">{{ item.name_zh }}</div>
              <div class="truncate text-[#606060]">{{ returnCollegeLabel(item.college_id) }}</div>
              <div class="truncate text-[#606060]">{{ item.train_name_label }}</div>
              <div class="truncate text-[#606060]" :title="item.train_content">{{ item.train_content }}</div>
              <div class="truncate">
                <div v-if="item.tearcher && item.tearcher.length > 0">{{ item.tearcher[0].name_t }}</div>
              </div>
              <div class="text-[#606060] text-xs">{{ item.start_date }}</div>
              <div class="text-[#606060] text-xs">{{ item.end_date }}</div>
              <div>
                <span v-if="item.is_valid === 'Y'" class="px-2 py-1 rounded bg-[#E6F4EA] text-[#137333] text-xs font-medium">{{ l.enabled }}</span>
                <span v-else class="px-2 py-1 rounded bg-[#FCE8E6] text-[#C5221F] text-xs font-medium">{{ l.disabled }}</span>
              </div>
              <div class="flex justify-end gap-3 text-[#606060]">
                <i class="el-icon-edit text-lg cursor-pointer hover:text-[#065FD4]" :title="l.manage" @click="modifyClass(item)"></i>
                <i v-if="item.is_valid === 'N'" class="el-icon-video-play text-lg cursor-pointer hover:text-[#137333]" :title="l.enable" @click="modifyStatus(item)"></i>
                <i v-else class="el-icon-video-pause text-lg cursor-pointer hover:text-[#C5221F]" :title="l.disable" @click="modifyStatus(item)"></i>
              </div>
            </div>
         </div>
      </div>
    </div>

    <!-- Pagination Footer -->
    <div class="flex justify-end p-4 border-t border-[#E5E5E5] bg-white text-xs text-[#606060]">
      <Pagination
        :page="classObj.query.page"
        :pageSize="classObj.query.pageSize"
        :total="classObj.total"
        :l="l"
        @update:page="classObj.query.page = $event"
        @update:pageSize="classObj.query.pageSize = $event"
        @change="getClassList"
      />
    </div>

    <!-- Drawer: Create/Modify Class -->
    <a-drawer
      :visible="showObj.modifyClass || showObj.classShow"
      :title="showObj.classShow ? l.createClass : l.manageClass"
      :width="960"
      @close="closeDrawer"
      :body-style="{ padding: 0 }"
      class="youtube-drawer"
    >
      <div class="flex flex-col h-full bg-white relative">
        <div class="flex-1 overflow-y-auto custom-scrollbar">
           <!-- Tabs (only for Modify) -->
           <div v-if="showObj.modifyClass" class="px-6 border-b border-[#E5E5E5] bg-white sticky top-0 z-10 flex gap-6 text-sm font-medium text-[#606060]">
             <button class="py-3 border-b-2 transition-colors" :class="showObj.activeTabName === 'data' ? 'border-[#065FD4] text-[#065FD4]' : 'border-transparent hover:text-[#0D0D0D]'" @click="showObj.activeTabName = 'data'">{{ l.basicInfo }}</button>
             <button class="py-3 border-b-2 transition-colors" :class="showObj.activeTabName === 'task' ? 'border-[#065FD4] text-[#065FD4]' : 'border-transparent hover:text-[#0D0D0D]'" @click="tabClick({name: 'task'})">{{ l.taskList }}</button>
             <button class="py-3 border-b-2 transition-colors" :class="showObj.activeTabName === 'student' ? 'border-[#065FD4] text-[#065FD4]' : 'border-transparent hover:text-[#0D0D0D]'" @click="tabClick({name: 'student'})">{{ l.classStudents }}</button>
             <button class="py-3 border-b-2 transition-colors" :class="showObj.activeTabName === 'status' ? 'border-[#065FD4] text-[#065FD4]' : 'border-transparent hover:text-[#0D0D0D]'" @click="tabClick({name: 'status'})">{{ l.completionStatus }}</button>
           </div>

           <div class="p-8">
             <!-- Basic Info Tab -->
             <div v-show="showObj.activeTabName === 'data' || showObj.classShow">
                <div class="grid grid-cols-2 gap-6 mb-6">
                   <!-- Column 1 -->
                   <div class="space-y-6">
                      <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                        <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.college }} ({{ c.required }})</label>
                        <select v-model="classObj.form.college_id" class="w-full bg-transparent outline-none text-[#0D0D0D] text-sm h-6">
                          <option v-for="i in publicCodeObj.collegeList" :key="i.id" :value="i.id">{{ i.name_label }}</option>
                        </select>
                      </div>

                      <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                        <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.simplifiedChineseTitle }} ({{ c.required }})</label>
                        <input v-model="classObj.form.name_zh" class="w-full outline-none text-[#0D0D0D] text-sm" />
                      </div>

                      <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                         <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.traditionalChineseTitle }}</label>
                         <input v-model="classObj.form.name_tw" class="w-full outline-none text-[#0D0D0D] text-sm" />
                      </div>

                      <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                         <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.englishTitle }}</label>
                         <input v-model="classObj.form.name_en" class="w-full outline-none text-[#0D0D0D] text-sm" />
                      </div>

                      <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                         <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.vietnameseTitle }}</label>
                         <input v-model="classObj.form.name_vi" class="w-full outline-none text-[#0D0D0D] text-sm" />
                      </div>
                   </div>

                   <!-- Column 2 -->
                   <div class="space-y-6">
                      <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                         <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.trainingContent }} ({{ c.required }})</label>
                         <input v-model="classObj.form.train_content" class="w-full outline-none text-[#0D0D0D] text-sm" />
                      </div>

                      <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                         <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.trainingObjective }} ({{ c.required }})</label>
                         <input v-model="classObj.form.train_target" class="w-full outline-none text-[#0D0D0D] text-sm" />
                      </div>

                      <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                         <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.trainingTarget }} ({{ c.required }})</label>
                         <input v-model="classObj.form.train_object" class="w-full outline-none text-[#0D0D0D] text-sm" />
                      </div>

                      <!-- Select Training -->
                      <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4] flex items-center">
                         <div class="flex-1">
                            <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.affiliatedPlan }} ({{ c.required }})</label>
                            <input v-model="classObj.form.train_name_label" readonly class="w-full outline-none text-[#0D0D0D] text-sm bg-transparent cursor-default" />
                         </div>
                         <Button variant="ghost" size="sm" @click="showObj.selectTraining=true">{{ l.select }}</Button>
                      </div>

                      <!-- Select Teacher -->
                      <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4] flex items-center">
                         <div class="flex-1">
                            <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.classTeacher }} ({{ c.required }})</label>
                            <input v-model="classObj.form.teacher_name" readonly class="w-full outline-none text-[#0D0D0D] text-sm bg-transparent cursor-default" />
                         </div>
                         <Button variant="ghost" size="sm" @click="showObj.selectUser = true">{{ l.select }}</Button>
                      </div>

                      <div class="grid grid-cols-2 gap-4">
                         <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                            <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.startTime }}</label>
                            <el-date-picker v-model="classObj.form.start_date" type="datetime" :placeholder="l.selectStartTime" class="w-full !border-none !p-0 !h-6" value-format="yyyy-MM-dd HH:mm:ss" :clearable="false"></el-date-picker>
                         </div>
                         <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                            <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.endTime }}</label>
                            <el-date-picker v-model="classObj.form.end_date" type="datetime" :placeholder="l.selectEndTime" class="w-full !border-none !p-0 !h-6" value-format="yyyy-MM-dd HH:mm:ss" :clearable="false"></el-date-picker>
                         </div>
                      </div>
                   </div>
                </div>
             </div>

             <!-- Task List Tab -->
             <div v-show="showObj.activeTabName === 'task' && !showObj.classShow">
               <div class="border border-[#E5E5E5] rounded overflow-hidden">
                 <div class="grid grid-cols-[50px_1fr_100px_100px_150px] bg-[#F9F9F9] border-b border-[#E5E5E5] px-4 py-2 text-xs font-medium text-[#606060]">
                   <div>#</div>
                   <div>{{ l.name }}</div>
                   <div>{{ l.type }}</div>
                   <div>{{ l.required }}</div>
                   <div class="text-right">{{ l.operation }}</div>
                 </div>
                 <div class="divide-y divide-[#E5E5E5]">
                   <div v-for="(task, idx) in classObj.taskList" :key="idx" class="grid grid-cols-[50px_1fr_100px_100px_150px] px-4 py-3 text-sm text-[#0D0D0D] items-center">
                     <div>{{ idx + 1 }}</div>
                     <div>{{ task.name_label }}</div>
                     <div>{{ task.type == 1 ? l.exam : l.course }}</div>
                     <div>{{ task.is_must == 1 ? l.required : l.elective }}</div>
                     <div class="text-right flex justify-end gap-3">
                       <span class="text-[#065FD4] cursor-pointer hover:underline text-xs uppercase font-medium" @click="previewDetail(task)">{{ l.preview }}</span>
                       <span v-show="task.type == 1" class="text-[#065FD4] cursor-pointer hover:underline text-xs uppercase font-medium" @click="getExamRecord(task)">{{ l.statistics }}</span>
                     </div>
                   </div>
                 </div>
               </div>
             </div>

             <!-- Students Tab -->
             <div v-show="showObj.activeTabName === 'student' && !showObj.classShow">
                <div class="flex justify-between items-center mb-4">
                  <div class="flex gap-2">
                     <div class="relative border border-[#CCCCCC] rounded px-2 py-1 bg-white focus-within:border-[#065FD4]">
                       <input v-model="studentObj.query.user_name" :placeholder="l.name" class="outline-none text-sm w-40" />
                     </div>
                     <select v-model="studentObj.query.is_valid" class="border border-[#CCCCCC] rounded px-2 py-1 text-sm outline-none focus:border-[#065FD4]">
                        <option value="">{{ l.all }}</option>
                        <option value="Y">{{ l.enabled }}</option>
                        <option value="N">{{ l.disabled }}</option>
                     </select>
                     <Button variant="secondary" size="sm" @click="getClassmate(class_id)">{{ l.search }}</Button>
                  </div>
                  <Button variant="primary" size="sm" icon="el-icon-plus" @click="showObj.selectStudent = true">{{ l.addStudents }}</Button>
                </div>

                <div class="border border-[#E5E5E5] rounded overflow-hidden">
                   <div class="grid grid-cols-[50px_1fr_1fr_1fr_1fr_100px_100px] bg-[#F9F9F9] border-b border-[#E5E5E5] px-4 py-2 text-xs font-medium text-[#606060]">
                     <div>#</div>
                     <div>{{ l.barcode }}</div>
                     <div>{{ l.name }}</div>
                     <div>{{ l.department }}</div>
                     <div>{{ l.position }}</div>
                     <div>{{ l.status }}</div>
                     <div class="text-right">{{ l.operation }}</div>
                   </div>
                   <div class="max-h-[500px] overflow-y-auto divide-y divide-[#E5E5E5]">
                      <div v-for="(stu, idx) in studentObj.classmateList" :key="idx" class="grid grid-cols-[50px_1fr_1fr_1fr_1fr_100px_100px] px-4 py-2 text-sm text-[#0D0D0D] items-center">
                        <div>{{ idx + 1 }}</div>
                        <div>{{ stu.userId }}</div>
                        <div>{{ stu.userName }}</div>
                        <div>{{ stu.department }}</div>
                        <div>{{ stu.workName }}</div>
                        <div>{{ stu.is_valid }}</div>
                        <div class="text-right">
                           <span class="cursor-pointer text-xs font-medium uppercase" :class="stu.is_valid=='Y' ? 'text-[#CC0000]' : 'text-[#137333]'" @click="toggleStudentStatus(stu)">
                             {{ stu.is_valid=='Y' ? l.disable : l.enable }}
                           </span>
                        </div>
                      </div>
                   </div>
                </div>
             </div>

             <!-- Completion Status Tab -->
             <div v-show="showObj.activeTabName === 'status' && !showObj.classShow">
               <div class="border border-[#E5E5E5] rounded overflow-hidden">
                  <div class="grid grid-cols-[50px_100px_120px_100px_1fr_100px_100px_100px_100px_100px_100px] bg-[#F9F9F9] border-b border-[#E5E5E5] px-4 py-2 text-xs font-medium text-[#606060] gap-2">
                    <div>#</div>
                    <div>{{ l.jobNumber }}</div>
                    <div>{{ l.name }}</div>
                    <div>{{ l.department }}</div>
                    <div>{{ l.departmentName }}</div>
                    <div class="text-center">{{ l.courseCount }}</div>
                    <div class="text-center">{{ l.completedCourses }}</div>
                    <div class="text-center">{{ l.unfinishedCourses }}</div>
                    <div class="text-center">{{ l.examCount }}</div>
                    <div class="text-center">{{ l.completedExams }}</div>
                    <div class="text-center">{{ l.unfinishedExams }}</div>
                  </div>
                  <div class="max-h-[500px] overflow-y-auto divide-y divide-[#E5E5E5]">
                    <div v-for="(stat, idx) in learningObj.list" :key="idx" class="grid grid-cols-[50px_100px_120px_100px_1fr_100px_100px_100px_100px_100px_100px] px-4 py-2 text-sm text-[#0D0D0D] items-center gap-2 hover:bg-[#F9F9F9]">
                      <div>{{ idx + 1 }}</div>
                      <div>{{ stat.userid }}</div>
                      <div>{{ stat.name_t }}</div>
                      <div>{{ stat.dept_no }}</div>
                      <div class="truncate" :title="stat.department_t">{{ stat.department_t }}</div>
                      <div class="text-center font-bold">{{ stat.course_num }}</div>
                      <div class="text-center font-bold text-[#137333] cursor-pointer hover:underline" @click="checkCourse(stat.finsh_course_List, l.completedCourses)">{{ stat.finsh_course_num }}</div>
                      <div class="text-center font-bold text-[#065FD4] cursor-pointer hover:underline" @click="checkCourse(stat.no_finsh_course_List, l.unfinishedCourses)">{{ stat.no_finsh_course_List.length }}</div>
                      <div class="text-center font-bold">{{ stat.exam_num }}</div>
                      <div class="text-center font-bold text-[#137333] cursor-pointer hover:underline" @click="checkExam([...stat.finsh_course_exam_List, ...stat.finsh_train_exam_List], l.completedExams)">{{ stat.finsh_exam_num }}</div>
                      <div class="text-center font-bold text-[#065FD4] cursor-pointer hover:underline" @click="checkExam([...stat.no_finsh_course_exam_List, ...stat.no_finsh_train_exam_List], l.unfinishedExams)">{{ stat.no_finsh_course_exam_List.length + stat.no_finsh_train_exam_List.length }}</div>
                    </div>
                  </div>
               </div>
             </div>
           </div>
        </div>

        <!-- Drawer Footer -->
        <div class="p-4 border-t border-[#E5E5E5] flex justify-end gap-2 bg-white z-10">
           <Button variant="ghost" @click="closeDrawer">{{ c.cancel || 'CANCEL' }}</Button>
           <Button variant="primary" @click="handleSubmit">{{ l.submit || 'SAVE' }}</Button>
        </div>
      </div>
    </a-drawer>

    <!-- Dialogs -->
    <a-modal v-model="showObj.selectTraining" :title="l.selectTraining" :width="1000" :footer="null">
      <div class="mb-4 flex gap-4">
        <select v-model="trainingObj.query.college_id" @change="getTrainingList" class="border border-[#CCCCCC] rounded px-2 py-1 text-sm outline-none focus:border-[#065FD4]">
           <option v-for="i in publicCodeObj.collegeList" :key="i.id" :value="i.id">{{ i.name_label }}</option>
        </select>
        <input v-model="trainingObj.query.name" class="border border-[#CCCCCC] rounded px-2 py-1 text-sm outline-none w-64" :placeholder="l.trainingName" @keyup.enter="getTrainingList" />
        <Button variant="secondary" size="sm" @click="getTrainingList">{{ l.search }}</Button>
      </div>
      <div class="max-h-[500px] overflow-y-auto border border-[#E5E5E5]">
         <div class="grid grid-cols-[50px_1fr_1fr_150px_150px_80px_100px] bg-[#F9F9F9] border-b border-[#E5E5E5] px-4 py-2 text-xs font-medium text-[#606060]">
            <div>#</div>
            <div>{{ l.simplifiedChinese }}</div>
            <div>{{ l.college }}</div>
            <div>{{ l.startTime }}</div>
            <div>{{ l.endTime }}</div>
            <div>{{ l.status }}</div>
            <div class="text-right">{{ l.operation }}</div>
         </div>
         <div v-for="(t, idx) in trainingObj.list" :key="t.id" class="grid grid-cols-[50px_1fr_1fr_150px_150px_80px_100px] px-4 py-2 text-sm border-b border-[#E5E5E5] last:border-0 hover:bg-[#F9F9F9] items-center">
            <div>{{ idx + 1 }}</div>
            <div>{{ t.name_zh }}</div>
            <div>{{ returnCollegeLabel(t.college_id) }}</div>
            <div class="text-xs text-[#606060]">{{ t.start_date }}</div>
            <div class="text-xs text-[#606060]">{{ t.end_date }}</div>
            <div>{{ t.is_valid }}</div>
            <div class="text-right">
              <span class="text-[#065FD4] cursor-pointer hover:underline text-xs uppercase font-medium" @click="selectTraining(t)">{{ l.select }}</span>
            </div>
         </div>
      </div>
    </a-modal>

    <!-- Select User Dialog (Using existing component but hidden wrapper if possible) -->
    <chooseUser
      :visible.sync="showObj.selectUser"
      @submmit="selectUser"
      v-if="!showObj.classShow && !showObj.modifyClass"
    />
    <!-- Note: Original Logic uses selectUser for single teacher selection. But chooseUser component usually emits list. Original code: @submmit="submmitClassmate" for students, but for teacher?
         Looking at original code:
         Teacher selection: <el-dialog :visible="showObj.selectUser" ...> custom implementation.
         Student selection: <chooseUser :visible.sync="showObj.selectStudent" ...>

         My refactor:
         Teacher: I need a user selection dialog. I will reuse the one from `Training/Class.vue` original which was a custom dialog inside. I should probably copy that logic or make a reusable one.
         Original `Class.vue` had a custom `el-dialog` for `showObj.selectUser`.
         I will implement a simple user selector modal here for Teacher.
    -->
    <a-modal v-model="showObj.selectUser" :title="l.selectUser" :width="1000" :footer="null">
       <div class="flex gap-4 mb-4">
          <input v-model="userObj.query.queryString" :placeholder="l.userInfo" class="border border-[#CCCCCC] rounded px-2 py-1 text-sm outline-none flex-1" @keyup.enter="getUserList" />
          <Button variant="secondary" size="sm" @click="getUserList">{{ l.search }}</Button>
       </div>
       <div class="max-h-[400px] overflow-y-auto border border-[#E5E5E5]">
          <div class="grid grid-cols-[50px_1fr_1fr_1fr_1fr_100px_100px] bg-[#F9F9F9] px-4 py-2 text-xs font-medium text-[#606060]">
             <div>#</div>
             <div>{{ l.jobNumber }}</div>
             <div>{{ l.name }}</div>
             <div>{{ l.department }}</div>
             <div>{{ l.position }}</div>
             <div>{{ l.status }}</div>
             <div class="text-right">{{ l.operation }}</div>
          </div>
          <div v-for="(u, idx) in userObj.list" :key="u.userid" class="grid grid-cols-[50px_1fr_1fr_1fr_1fr_100px_100px] px-4 py-2 text-sm border-b border-[#E5E5E5] hover:bg-[#F9F9F9] items-center">
             <div>{{ idx + 1 }}</div>
             <div>{{ u.userid }}</div>
             <div>{{ u.username }}</div>
             <div>{{ u.department_t }}</div>
             <div>{{ u.work_name }}</div>
             <div>{{ u.is_valid }}</div>
             <div class="text-right">
                <span class="text-[#065FD4] cursor-pointer hover:underline text-xs uppercase font-medium" @click="selectUser(u)">{{ l.select }}</span>
             </div>
          </div>
       </div>
    </a-modal>

    <!-- Student Selection: Reuse existing ChooseUser component -->
    <chooseUser :visible.sync="showObj.selectStudent" :useridList.sync="studentObj.setClassmateList" @submmit="submmitClassmate"></chooseUser>

    <!-- Exam Record Dialog -->
    <a-modal v-model="showObj.recordDialog" :title="l.examRecord" :width="1000" :footer="null">
       <!-- Re-implement exam record table/search -->
       <div class="flex gap-4 mb-4">
          <input v-model="examObj.recordQuery.userid" :placeholder="l.studentBarcode" class="border border-[#CCCCCC] rounded px-2 py-1 text-sm outline-none flex-1" @keyup.enter="getExamRecord(null)" />
          <Button variant="secondary" size="sm" @click="getExamRecord(null)">{{ l.search }}</Button>
       </div>
       <div class="max-h-[400px] overflow-y-auto border border-[#E5E5E5]">
          <div class="grid grid-cols-[50px_1fr_1fr_1fr_150px] bg-[#F9F9F9] px-4 py-2 text-xs font-medium text-[#606060]">
             <div>#</div>
             <div>{{ l.examTime }}</div>
             <div>{{ l.studentName }}</div>
             <div>{{ l.score }}</div>
             <div class="text-right">{{ l.operation }}</div>
          </div>
          <div v-for="(rec, idx) in examObj.record" :key="idx" class="grid grid-cols-[50px_1fr_1fr_1fr_150px] px-4 py-2 text-sm border-b border-[#E5E5E5] hover:bg-[#F9F9F9] items-center">
             <div>{{ idx + 1 }}</div>
             <div>{{ rec.create_time }}</div>
             <div>{{ rec.create_user }}</div>
             <div>{{ rec.score }}</div>
             <div class="text-right flex justify-end gap-2">
                <span class="text-[#137333] cursor-pointer hover:underline text-xs uppercase font-medium" @click="reviewExam(rec)">{{ l.viewDetails }}</span>
                <span class="text-[#065FD4] cursor-pointer hover:underline text-xs uppercase font-medium" @click="readExam(rec)">{{ l.correctPapers }}</span>
             </div>
          </div>
       </div>
       <div class="mt-4 flex justify-end">
          <Pagination :page="examObj.recordQuery.page" :pageSize="examObj.recordQuery.pageSize" :total="examObj.recordTotal" :l="l" @update:page="examObj.recordQuery.page=$event" @update:pageSize="examObj.recordQuery.pageSize=$event; getExamRecord(null)" @change="getExamRecord(null)" />
       </div>
    </a-modal>

    <!-- Course Dialog (Status Check) -->
    <a-modal v-model="showObj.courseDialog" :title="showObj.courseAndExamDialogTitle" :width="800" :footer="null">
       <div class="max-h-[400px] overflow-y-auto">
          <div class="grid grid-cols-[50px_1fr_1fr] bg-[#F9F9F9] px-4 py-2 text-xs font-medium text-[#606060]">
             <div>#</div>
             <div>{{ l.name }}</div>
             <div>{{ l.description }}</div>
          </div>
          <div v-for="(c, i) in learningObj.unfinishCourse" :key="i" class="grid grid-cols-[50px_1fr_1fr] px-4 py-2 text-sm border-b border-[#E5E5E5]">
             <div>{{ i + 1 }}</div>
             <div>{{ c.name_zh }}</div>
             <div>{{ c.description }}</div>
          </div>
       </div>
    </a-modal>

    <!-- Exam Dialog (Status Check) -->
    <a-modal v-model="showObj.examDialog" :title="showObj.courseAndExamDialogTitle" :width="1000" :footer="null">
       <div class="max-h-[400px] overflow-y-auto">
          <div class="grid grid-cols-[50px_1fr_100px_100px_100px_150px_150px] bg-[#F9F9F9] px-4 py-2 text-xs font-medium text-[#606060]">
             <div>#</div>
             <div>{{ l.name }}</div>
             <div>{{ l.passScore }}</div>
             <div>{{ l.maxAttempts }}</div>
             <div>{{ l.examDuration }}</div>
             <div>{{ l.startTime }}</div>
             <div>{{ l.endTime }}</div>
          </div>
          <div v-for="(e, i) in learningObj.unfinishExam" :key="i" class="grid grid-cols-[50px_1fr_100px_100px_100px_150px_150px] px-4 py-2 text-sm border-b border-[#E5E5E5]">
             <div>{{ i + 1 }}</div>
             <div>{{ e.name_zh }}</div>
             <div>{{ e.pass_score }}</div>
             <div>{{ e.max_reply_num }}</div>
             <div>{{ e.test_duration }}</div>
             <div>{{ e.start_time }}</div>
             <div>{{ e.end_time }}</div>
          </div>
       </div>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, getCurrentInstance, watch } from 'vue'
import chooseUser from '@/views/_common/ChooseUser.vue'
import { useLocalI18n } from '@/composables/useLocalI18n'
import Button from '../common/Button.vue'
import Pagination from '../common/Pagination.vue'
import Dropdown from '../common/Dropdown.vue'

const { l, c } = useLocalI18n('videoAdminClass')
const { proxy } = getCurrentInstance()
const isAdmin = computed(() => proxy.$store.getters.isAdmin)

// Data
const class_id = ref('')
const train_id = ref('')
const train_primary_id = ref('')

const showObj = reactive({
  selectUser: false,
  activeTabName: 'data',
  selectCourse: false,
  selectTraining: false,
  classShow: false,
  modifyClass: false,
  selectStudent: false,
  courseDialog: false,
  examDialog: false,
  recordDialog: false,
  courseAndExamDialogTitle: ''
})

const trainingObj = reactive({
  query: {
    college_id: "",
    page: 1,
    pageSize: 10,
    name: "",
    is_valid: ''
  },
  list: [],
  total: 0
})

const userObj = reactive({
  query: {
    page: 1,
    size: 10,
    queryString: "",
    status: '0'
  },
  list: [],
  total: 0
})

const studentObj = reactive({
  query: {
    page: 1,
    size: 10,
    user_name: "",
    user_id: "",
    is_valid: 'Y',
    class_id: ''
  },
  setClassmateList: [],
  classmateList: [],
})

const classObj = reactive({
  taskList: [],
  query: {
    page: 1,
    pageSize: 10,
    name: "",
    train_id: '',
    college_id: "",
    is_valid: ''
  },
  form: {
    id: "",
    college_id: "",
    train_name_label: "",
    name_zh: "",
    name_en: "",
    name_vi: "",
    name_tw: "",
    start_date: "",
    end_date: "",
    is_valid: "Y",
    rec_status: 1,
    class_teachers: [""],
    tearcher: [{
      name_t: ''
    }],
    teacher_name: '',
    train_content: "",
    train_target: "",
    train_object: "",
  },
  list: [],
  total: 0
})

const publicCodeObj = reactive({
  collegeList: [],
})

const learningObj = reactive({
  query: {
    page: 1,
    pageSize: 15
  },
  total: 0,
  list: [],
  unfinishCourse: [],
  unfinishExam: []
})

const examObj = reactive({
  query: {
    page: 1,
    pageSize: 15,
    is_valid: "",
  },
  recordQuery: {
    userid: '',
    exam_id: '',
    questionnaire_id: '',
    page: 1,
    pageSize: 15,
  },
  form: {},
  list: [],
  record: [],
  total: 0,
  recordTotal: 0
})

// Methods
const tabClick = (v) => {
  showObj.activeTabName = v.name
  if (v.name == 'status') {
    getLearningStatus(class_id.value)
  } else if (v.name == 'student') {
    getClassmate(class_id.value)
  } else if (v.name == 'task') {
    getTaskList(train_id.value)
  }
}

const checkCourse = (v, label) => {
  showObj.courseAndExamDialogTitle = label
  if (v && v.length > 0) {
    learningObj.unfinishCourse = v
    showObj.courseDialog = true
  } else {
    proxy.$message.info(l.value.tempNoData)
  }
}

const checkExam = (v, label) => {
  showObj.courseAndExamDialogTitle = label
  if (v && v.length > 0) {
    learningObj.unfinishExam = v
    showObj.examDialog = true
  } else {
    proxy.$message.info(l.value.tempNoData)
  }
}

const getLearningStatus = (id) => {
  proxy.$request(proxy.$api.videoServer + '/Video/VideoAnalyze/getClassUserTrainLearingInfo', {
      ...learningObj.query,
      class_id: id
    }, 'post')
    .then(r => {
      learningObj.total = r.data.total
      learningObj.list = r.data.list
    })
}

const previewDetail = async (i) => {
  if (i.type === '0' || i.type === 0) {
    let routeUrl = proxy.$router.resolve({
      name: 'videoPlay',
      query: {
        course_id: i.bind_id,
      }
    }).href;
    window.open(routeUrl, '_blank');
  } else {
    let questionnaire_id
    if (i.questionnaire_id) {
      questionnaire_id = i.questionnaire_id
    } else {
      let res = await proxy.$request(proxy.$api.videoServer + '/Video/VideoExam/getExamList', {
        id: i.bind_id,
      })
      questionnaire_id = res.data.list[0].questionnaire_id
    }

    let url = proxy.$router.resolve({
      name: 'videoUserExamDetail',
      query: {
        train_id: "",
        course_id: '',
        exam_id: '',
        questionnaire_id: questionnaire_id,
        mode: 'preview'
      }
    }).href;
    window.open(url, '_blank');
  }
}

const getCollegeList = () => {
  proxy.$request(proxy.$api.videoServer + '/Video/VideoMenu/getCollegeRoleByPath', {
      resource_path: proxy.$route.path
    })
    .then((r) => {
      publicCodeObj.collegeList = [{ id: '', name_label: l.value.allChannels || 'All Colleges' }, ...r.data]
      if (!isAdmin.value && r.data.length > 0) {
        classObj.query.college_id = r.data[0].id
        trainingObj.query.college_id = r.data[0].id
      }
      getClassList()
    })
    .catch((e) => {
      proxy.$message.error(e.message)
    })
}

const submmitClassmate = () => {
  let postData = []
  if (studentObj.setClassmateList.length == 0) {
    return proxy.$message.error(l.value.addUserCannotBeEmpty)
  }

  studentObj.setClassmateList.forEach(e => {
    let j = {
      id: "",
      userid: e,
      class_id: class_id.value,
      train_id: train_id.value,
      is_valid: "Y",
      rec_status: 1
    }
    postData.push(j)
  })
  proxy.$request(proxy.$api.videoServer + '/Video/VideoTrain/setUserIntoTrain', postData, 'post')
    .then(r => {
      getClassmate(class_id.value)
    })
    .catch(e => {
      console.log(e);
    })
}

const toggleStudentStatus = (user) => {
  const confirmMsg = user.is_valid === 'Y' ? l.value.confirmDisable : l.value.confirmEnable
  if (window.confirm(confirmMsg)) {
    let j = {
      id: user.id,
      userid: user.userId,
      class_id: class_id.value,
      train_id: train_id.value,
      is_valid: user.is_valid == 'Y' ? 'N' : 'Y',
      rec_status: 1
    }
    proxy.$request(proxy.$api.videoServer + '/Video/VideoTrain/setUserIntoTrain', [j], 'post')
      .then(r => {
        getClassmate(class_id.value)
        proxy.$message.success(user.is_valid === 'Y' ? l.value.disableSuccess : l.value.enableSuccess)
      })
      .catch(e => {
        console.log(e);
      })
  }
}

const returnCollegeLabel = (college_id) => {
  let college = publicCodeObj.collegeList.find(i => i.id == college_id)
  if (college) {
    return college.name_label
  } else {
    return ""
  }
}

const getClassmate = (cid) => {
  if (cid) {
    studentObj.query.class_id = cid
  }
  proxy.$request(proxy.$api.videoServer + '/Video/VideoTrain/getClassUser', studentObj.query)
    .then(r => {
      if (r.httpCode == 200) {
        studentObj.classmateList = r.data.list
      }
    })
    .catch(e => {
      console.log(e);
    })
}

const selectTraining = (data) => {
  classObj.form.college_id = data.college_id
  classObj.form.train_name_label = data.name_label
  classObj.form.train_id = data.id // Ensure we use the correct ID for training plan
  showObj.selectTraining = false
}

const getTaskList = (id) => {
  proxy.$request(proxy.$api.videoServer + '/Video/VideoTrain/ShowTrainDetil', {
    train_id: id
  }).then(r => {
    classObj.taskList = r.data.detail
  })
}

const reviewExam = (data) => {
  let url = proxy.$router.resolve({
    name: 'videoUserExamDetail',
    query: {
      train_id: train_id.value,
      class_id: class_id.value,
      course_id: '',
      exam_id: data.id,
      questionnaire_id: data.questionnaire_id,
      reply_id: data.id,
      mode: 'review'
    }
  }).href;
  window.open(url, '_blank');
}

const readExam = (data) => {
  let url = proxy.$router.resolve({
    name: 'videoUserExamDetail',
    query: {
      train_id: train_id.value,
      class_id: class_id.value,
      course_id: '',
      exam_id: data.id,
      questionnaire_id: data.questionnaire_id,
      reply_id: data.id,
      mode: 'read'
    }
  }).href;
  window.open(url, '_blank');
}

const getExamRecord = (data) => {
  if (data) {
     let exam = data.detail?.find(i => {
      return i.exam != null
    })?.exam

    if (data.questionnaire_id) {
       examObj.recordQuery.questionnaire_id = data.questionnaire_id
    }
  }

  proxy.$request(proxy.$api.videoServer + '/Video/VideoExam/getAnswerList', {
    ...examObj.recordQuery,
    class_id: class_id.value,
    train_id: train_id.value,
    train_primary_id: train_primary_id.value,
  }).then(r => {
    examObj.record = r.data.list
    examObj.recordTotal = r.data.total
    showObj.recordDialog = true
  })
}

const getTrainingList = () => {
  proxy.$request(proxy.$api.videoServer + '/Video/VideoTrain/getlist', trainingObj.query)
    .then(r => {
      if (r.httpCode == 200) {
        trainingObj.list = r.data.list
        trainingObj.total = r.data.total
      }
    })
    .catch(e => {
      console.log(e);
    })
}

const getUserList = () => {
  proxy.$request(proxy.$api.videoServer + '/Platform/user/getlist', userObj.query)
    .then(r => {
      if (r.httpCode == 200) {
        userObj.list = r.data.list
        userObj.total = r.data.total
      }
    })
    .catch(e => {
      console.log(e);
    })
}

const selectUser = (data) => {
  classObj.form.class_teachers[0] = data.userid
  classObj.form.teacher_name = data.username
  showObj.selectUser = false
}

const addClass = () => {
  classObj.form = {
    college_id: isAdmin.value ? '' : publicCodeObj.collegeList[0]?.id,
    id: "",
    name_zh: "",
    name_en: "",
    name_vi: "",
    name_tw: "",
    start_date: "",
    end_date: "",
    is_valid: "Y",
    class_teachers: [''],
    rec_status: 1
  }
  showObj.classShow = true
  showObj.modifyClass = false
  showObj.activeTabName = 'data'
}

const modifyClass = (data) => {
  classObj.form = { ...data }
  if (data.tearcher && data.tearcher.length > 0) {
     classObj.form.teacher_name = data.tearcher[0].name_t
     classObj.form.class_teachers = [data.tearcher[0].userid]
  }

  class_id.value = data.id
  train_id.value = data.train_id
  train_primary_id.value = data.train_primary_id
  showObj.modifyClass = true
  showObj.classShow = false
  showObj.activeTabName = 'data'
}

const modifyStatus = (i) => {
  let value = i.is_valid == 'N' ? 'Y' : 'N'
  let oprate = i.is_valid == 'N' ? l.value.enable : l.value.disable

  if(window.confirm(`${l.value.confirmOperation}${oprate}《${i.name_zh||i.name_tw||i.name_en||i.name_vi}》？`)) {
    proxy.$request(proxy.$api.videoServer + '/Video/VideoTrain/ModifyClassStatus', {
      key: i.id,
      value: value
    }, 'post').then(r => {
      proxy.$message.success(l.value.operationSuccess)
      getClassList()
    })
  }
}

const handleSubmit = () => {
  const validationErrors = []

  if (!classObj.form.college_id) validationErrors.push(l.value.collegeRequired)
  if (!classObj.form.name_zh?.trim()) validationErrors.push(l.value.simplifiedChineseTitleRequired)
  if (!classObj.form.train_content?.trim()) validationErrors.push(l.value.trainingContentRequired)
  if (!classObj.form.train_target?.trim()) validationErrors.push(l.value.trainingObjectiveRequired)
  if (!classObj.form.train_object?.trim()) validationErrors.push(l.value.trainingTargetRequired)
  if (!classObj.form.train_id || !classObj.form.train_name_label) validationErrors.push(l.value.affiliatedPlanRequired)
  if (!classObj.form.class_teachers?.[0] || !classObj.form.teacher_name) validationErrors.push(l.value.classTeacherRequired)
  if (!classObj.form.start_date) validationErrors.push(l.value.startTimeRequired)
  if (!classObj.form.end_date) validationErrors.push(l.value.endTimeRequired)

  if (validationErrors.length > 0) {
    proxy.$message.error(validationErrors.join(', '))
    return
  }

  proxy.$request(proxy.$api.videoServer + '/Video/VideoTrain/addOrModifyClass', classObj.form, 'post')
    .then(r => {
      if (r.httpCode == 200) {
        proxy.$message.success(l.value.submitSuccess)
        closeDrawer()
        getClassList()
      }
    })
    .catch(e => {
      console.log(e);
    })
}

const closeDrawer = () => {
   showObj.classShow = false
   showObj.modifyClass = false
}

const getClassList = () => {
  proxy.$request(proxy.$api.videoServer + '/Video/VideoTrain/getClass', classObj.query)
    .then(r => {
      if (r.httpCode == 200) {
        classObj.list = r.data.list
        classObj.total = r.data.total
      }
    })
    .catch(e => {
      console.log(e);
    })
}

onMounted(() => {
  getCollegeList()
  // Add Teacher selection listener to handle return
  watch(() => showObj.selectUser, (val) => {
     if (val) getUserList()
  })
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #cccccc;
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #999999;
}
</style>

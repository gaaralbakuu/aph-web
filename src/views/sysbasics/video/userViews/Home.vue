<template>
  <div>
    <BannerCarousel :banners="bannerList" :auto-play="true" :auto-play-interval="5000" :show-navigation="true" :show-dots="true" @banner-click="clickBanner" />

    <!-- {{ bannerList }} -->
    <!-- {{ courseList }} -->
    <!-- {{ locale }} -->

    <div class="py-5">
      <div class="flex justify-between items-center">
        <div class="flex items-start gap-2">
          <div class="font-display text-2xl text-black tracking-wide">{{ l.newestCourse }}</div>
          <div class="bg-blue-500 text-white px-2 py-0.5 font-bold rounded">Mới</div>
        </div>
        <div class="pr-3 text-orange-500 hover:underline font-semibold" @click="toPage('videoCourse')" style="cursor: pointer">
          {{ l.moreCourse }}
          <i class="el-icon-arrow-right"></i>
        </div>
      </div>
    </div>

    <CourseCarousel :courses="courseList" :locale="locale" :items-per-view="3" :show-navigation="true" :show-dots="true" @course-click="handleCourseCardClick" />

    <!-- {{ subjectList }} -->

      <!-- {{subjectList}} -->

    <div class="series-wrapper" v-for="(i, index) in subjectList" :key="i.id">
      <div v-if="i.detail.length > 0">
        <div class="py-5">
          <div class="flex justify-between items-center">
            <div class="flex items-start gap-2">
              <div class="font-display text-2xl text-black tracking-wide">{{ i.title_label }}</div>
            </div>
            <div class="pr-3 text-orange-500 hover:underline font-semibold" @click="toDetailPage(i)" style="cursor: pointer">
              {{ l.enterTopic }}
              <i class="el-icon-arrow-right"></i>
            </div>
          </div>
        </div>

        <div class="playlist">
          <CourseCarousel :courses="i.detail" :locale="locale" :items-per-view="3" :show-navigation="true" @course-click="handleTopicClick" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import BannerCarousel from './component/BannerCarousel.vue'
import CourseCarousel from './component/CourseCarousel.vue'
import { mapGetters } from 'vuex'
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { getCurrentInstance, ref, computed, watch, onMounted } from 'vue'
import { useLocalI18n } from '@/composables/useLocalI18n'

const { l } = useLocalI18n('videoUserHome')
const instance = getCurrentInstance()
const locale = (() => {
  const lang = {
    'vi-VN': 'vi',
    'en-US': 'en',
    'zh-CN': 'zh',
    'zh-TW': 'tw',
  }
  return lang[instance.proxy.$i18n.locale] || 'zh'
})()
const { $request, $api } = instance.proxy

const value1 = ref('')
const queryMonth = ref('')
const subjectList = computed(() => subjectQuery.data.value || [])
const rankObj = ref({
  query: {
    start_date: '',
    end_date: '',
    page: 1,
    pageSize: 10,
  },
  rankingInfos: {
    0: [],
    1: [],
    2: [],
  },
})

const bannerQuery = useQuery({
  queryKey: ['banners', { status: '1', type: 'video' }],
  queryFn: async () => {
    const response = await $request($api.baseUrl + '/Platform/banner/getbanners', {
      status: '1',
      type: 'video',
    })
    return response.data
  },
})

const bannerList = computed(() => bannerQuery.data.value || [])

const collegeId = computed(() => instance.proxy.$store.getters.college_id)

const courseQuery = useQuery({
  queryKey: computed(() => ['videoCourses', { college_id: collegeId.value }]),
  queryFn: async () => {
    const response = await $request(
      $api.videoServer + '/Video/VideoCourseCatalog/getCourseList',
      {
        college_id: collegeId.value,
        page: 1,
        pageSize: 10,
        is_valid: 'Y',
        is_his: 0,
      },
      'post'
    )
    return response.data.list
  },
  enabled: computed(() => !!collegeId.value),
})

const courseList = computed(() => courseQuery.data.value || [])

const subjectQuery = useQuery({
  queryKey: computed(() => ['videoPageTag', { college_id: collegeId.value }]),
  queryFn: async () => {
    const response = await $request($api.videoServer + '/Video/VideoPageTag/getlist', {
      web_page: 'home',
      is_valid: 'Y',
      page: 1,
      pageSize: 4,
      college_id: collegeId.value,
    })
    console.log('✅ subjectQuery response:', response.data.list.filter((i) => i.detail.length != 0))
    return response.data.list.filter((i) => i.detail.length != 0)
  },
  enabled: computed(() => !!collegeId.value),
})

watch(
  () => collegeId.value,
  () => {
    courseQuery.refetch()
    subjectQuery.refetch()
  }
)

const handleCourseCardClick = (video) => {
  instance.proxy.$router.push({
    name: 'videoPlay',
    query: {
      course_primary_id: video.id,
      topic_id: video.pid,
    },
  })
  // let routeUrl = instance.proxy.$router.resolve({
  //   name: 'videoPlay',
  //   query: {
  //     course_primary_id: data.id,
  //     topic_id: data.pid,
  //   },
  // }).href
  // window.open(routeUrl, '_blank')
  // toPlayPage({
  //   id: video.id,
  // })
}

const handleTopicClick = (video) => {
  console.log('✅ handleTopicClick called with:', video)
  // toDetailPage({
  //   id: video.topic_id,
  // })
  instance.proxy.$router.push({
    name: 'videoPlay',
    query: {
      course_primary_id: video.course_primary_id,
      topic_id: video.pid,
    },
  })
  // let routeUrl = instance.proxy.$router.resolve({
  //   name: 'topicDetail',
  //   query: {
  //     topic_id: data.id,
  //   },
  // }).href
  // window.open(routeUrl, '_blank')
}

const clickBanner = (i) => {
  if (i.link) {
    let type = i.link.split('=')[0]
    let id = i.link.split('=')[1]
    if (type.includes('course')) {
      toPlayPage({
        id: id,
      })
    } else if (type.includes('topic')) {
      toDetailPage({
        id: id,
      })
    }
  }
}

const changeRankList = (e) => {
  rankObj.value.query.start_date = e[0]
  rankObj.value.query.end_date = e[1]
  fetchAllRankings()
}

const toPlayPage = (data) => {
  let routeUrl = instance.proxy.$router.resolve({
    name: 'videoPlay',
    query: {
      course_primary_id: data.id,
      topic_id: data.pid,
    },
  }).href
  window.open(routeUrl, '_blank')
}

const toPlayPageTag = (data) => {
  let routeUrl = instance.proxy.$router.resolve({
    name: 'videoPlay',
    query: {
      course_primary_id: data.course_primary_id,
      topic_id: data.pid,
    },
  }).href
  window.open(routeUrl, '_blank')
}

const toDetailPage = (data) => {
  // let routeUrl = instance.proxy.$router.resolve({
  //   name: 'topicDetail',
  //   query: {
  //     topic_id: data.id,
  //   },
  // }).href
  // window.open(routeUrl, '_blank')
  instance.proxy.$router.push({
    name: 'topicDetail',
    query: {
      topic_id: data.id,
    },
  })
}

const toPage = (target) => {
  instance.proxy.$router.push({
    name: target,
  })
}

const getCourseList = () => {
  const { college_id } = instance.proxy.$store.getters
  $request(
    $api.videoServer + '/Video/VideoCourseCatalog/getCourseList',
    {
      college_id: college_id,
      page: 1,
      pageSize: 10,
      is_valid: 'Y',
      is_his: 0,
    },
    'post'
  )
    .then((r) => {
      console.log(r.data.list)
      courseList.value = r.data.list
    })
    .catch((e) => {
      console.log(e)
    })
}

const getSubjectList = () => {
  const { college_id } = instance.proxy.$store.getters
  $request($api.videoServer + '/Video/VideoPageTag/getlist', {
    web_page: 'home',
    is_valid: 'Y',
    page: 1,
    pageSize: 4,
    college_id: college_id,
  })
    .then((r) => {
      subjectList.value.list = r.data.list.filter((i) => i.detail.length != 0)
    })
    .catch((e) => {
      console.log(e)
    })
}

const getMonthFirstAndLastDay = () => {
  const now = new Date()
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  const formatDate = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }
  return {
    firstDay: formatDate(firstDay),
    lastDay: formatDate(lastDay),
  }
}

const getRankList = (type, cb) => {
  if (rankObj.value.query.start_date == '') {
    let date = getMonthFirstAndLastDay()
    rankObj.value.query.start_date = date.firstDay
    rankObj.value.query.end_date = date.lastDay
    value1.value = [rankObj.value.query.start_date, rankObj.value.query.end_date]
    queryMonth.value = [rankObj.value.query.start_date, rankObj.value.query.end_date]
  }
  $request($api.videoServer + '/Video/VideoAnalyze/GetRank', {
    ...rankObj.value.query,
    type: type,
  })
    .then((r) => {
      if (r.status) {
        cb(r)
      } else {
        console.log(r)
      }
    })
    .catch((e) => {
      console.log(e)
    })
}

const fetchAllRankings = () => {
  const types = [0, 1, 2]
  types.forEach((type) => {
    getRankList(type, (r) => {
      if (r.data === null) {
        rankObj.value.rankingInfos[type] = []
      } else {
        rankObj.value.rankingInfos[type] = r.data
      }
    })
  })
}

onMounted(() => {
  courseQuery.refetch()
  subjectQuery.refetch()
})
</script>

<style scoped></style>

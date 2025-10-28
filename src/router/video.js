import Layout from '@/views/layout/Layout'
import SubLayout from '@/views/layout/SubLayout'

let isDevelopMode = process.env.NODE_ENV === 'development'

export default [
  // Exam detail route
  {
    path: '/examDetail',
    component: () => import('@/views/sysbasics/video/userViews/examDetail'),
    name: 'examDetail',
    meta: { noCache: isDevelopMode }
  },

  // User Video Layout
  {
    path: '/videoLayout',
    component: () => import('@/views/sysbasics/video/layout/videoUserLayout'),
    name: 'videoLayout',
    meta: { noCache: isDevelopMode },
    children: [
      {
        path: 'home',
        component: () => import('@/views/sysbasics/video/userViews/home'),
        name: 'videoHome',
        meta: { noCache: isDevelopMode, title: 'Video Dashboard' }
      },
      {
        path: 'trainingDetail',
        component: () => import('@/views/sysbasics/video/userViews/trainingDetail'),
        name: 'trainingDetail',
        meta: { noCache: isDevelopMode, title: 'Training Details' }
      },
      {
        path: 'topicDetail',
        component: () => import('@/views/sysbasics/video/userViews/topicDetail'),
        name: 'topicDetail',
        meta: { noCache: isDevelopMode, title: 'Topic Details' }
      },
      {
        path: 'play',
        component: () => import('@/views/sysbasics/video/userViews/play'),
        name: 'videoPlay',
        meta: { noCache: isDevelopMode, title: 'Video Player' }
      },
      {
        path: 'topic',
        component: () => import('@/views/sysbasics/video/userViews/topic'),
        name: 'videoTopic',
        meta: { noCache: isDevelopMode, title: 'Topics' }
      },
      {
        path: 'course',
        component: () => import('@/views/sysbasics/video/userViews/course'),
        name: 'videoCourse',
        meta: { noCache: isDevelopMode, title: 'Courses' }
      },
      {
        path: 'mine',
        component: () => import('@/views/sysbasics/video/userViews/mine'),
        name: 'videoMine',
        meta: { noCache: isDevelopMode, title: 'My Videos' },
        children: [
          {
            path: 'training',
            component: () => import('@/views/sysbasics/video/userViews/component/training'),
            name: 'myTraining',
            meta: { noCache: isDevelopMode, title: 'My Training' }
          },
          {
            path: 'favorite',
            component: () => import('@/views/sysbasics/video/userViews/component/favorite'),
            name: 'myFavorite',
            meta: { noCache: isDevelopMode, title: 'Favorites' }
          },
          {
            path: 'history',
            component: () => import('@/views/sysbasics/video/userViews/component/history'),
            name: 'myHistory',
            meta: { noCache: isDevelopMode, title: 'Watch History' }
          }
        ]
      }
    ]
  },

  // Admin Video Layout
  {
    path: '/videoAdminLayout',
    component: () => import('@/views/sysbasics/video/layout/videoAdminLayout'),
    name: 'videoAdminLayout',
    meta: { noCache: isDevelopMode },
    children: [
      // Lesson Management
      {
        path: 'lesson',
        component: () => import('@/views/sysbasics/video/adminViews/lesson'),
        name: 'adminLesson',
        meta: { noCache: isDevelopMode, title: 'Lesson Management' },
        children: [
          {
            path: 'contentManage',
            component: () => import('@/views/sysbasics/video/adminViews/component/lesson/content'),
            name: 'contentManage',
            meta: { noCache: isDevelopMode, title: 'Content Management' }
          },
          {
            path: 'tagManage',
            component: () => import('@/views/sysbasics/video/adminViews/component/lesson/tag'),
            name: 'tagManage',
            meta: { noCache: isDevelopMode, title: 'Tag Management' }
          },
          {
            path: 'catalogueManage',
            component: () => import('@/views/sysbasics/video/adminViews/component/lesson/catalogue'),
            name: 'catalogueManage',
            meta: { noCache: isDevelopMode, title: 'Catalog Management' }
          },
          {
            path: 'courseManage',
            component: () => import('@/views/sysbasics/video/adminViews/component/lesson/course'),
            name: 'courseManage',
            meta: { noCache: isDevelopMode, title: 'Course Management' }
          },
          {
            path: 'topicManage',
            component: () => import('@/views/sysbasics/video/adminViews/component/lesson/topic'),
            name: 'topicManage',
            meta: { noCache: isDevelopMode, title: 'Topic Management' }
          }
        ]
      },

      // Training Management
      {
        path: 'training',
        component: () => import('@/views/sysbasics/video/adminViews/training'),
        name: 'training',
        meta: { noCache: isDevelopMode, title: 'Training Management' },
        children: [
          {
            path: 'planManage',
            component: () => import('@/views/sysbasics/video/adminViews/component/training/plan'),
            name: 'planManage',
            meta: { noCache: isDevelopMode, title: 'Training Plans' }
          },
          {
            path: 'classManage',
            component: () => import('@/views/sysbasics/video/adminViews/component/training/class'),
            name: 'classManage',
            meta: { noCache: isDevelopMode, title: 'Class Management' }
          },
          {
            path: 'lecturerManage',
            component: () => import('@/views/sysbasics/video/adminViews/component/training/lecturer'),
            name: 'lecturerManage',
            meta: { noCache: isDevelopMode, title: 'Lecturer Management' }
          },
          {
            path: 'placeManage',
            component: () => import('@/views/sysbasics/video/adminViews/component/training/place'),
            name: 'placeManage',
            meta: { noCache: isDevelopMode, title: 'Training Places' }
          }
        ]
      },

      // Exam Management
      {
        path: 'exam',
        component: () => import('@/views/sysbasics/video/adminViews/exam'),
        name: 'exam',
        meta: { noCache: isDevelopMode, title: 'Exam Management' },
        children: [
          {
            path: 'questionManage',
            component: () => import('@/views/sysbasics/video/adminViews/component/exam/question'),
            name: 'questionManage',
            meta: { noCache: isDevelopMode, title: 'Question Bank' }
          },
          {
            path: 'questionnaireManage',
            component: () => import('@/views/sysbasics/video/adminViews/component/exam/questionnaire'),
            name: 'questionnaireManage',
            meta: { noCache: isDevelopMode, title: 'Questionnaires' }
          },
          {
            path: 'examManage',
            component: () => import('@/views/sysbasics/video/adminViews/component/exam/exam'),
            name: 'examManage',
            meta: { noCache: isDevelopMode, title: 'Exam Management' }
          }
        ]
      },

      // Analytics
      {
        path: 'analyze',
        component: () => import('@/views/sysbasics/video/adminViews/analyze'),
        name: 'analyze',
        meta: { noCache: isDevelopMode, title: 'Analytics' },
        children: [
          {
            path: 'index',
            component: () => import('@/views/sysbasics/video/adminViews/component/analyze/index'),
            name: 'analyzeIndex',
            meta: { noCache: isDevelopMode, title: 'System Overview' }
          },
          {
            path: 'collegeTraining',
            component: () => import('@/views/sysbasics/video/adminViews/component/analyze/collegeTraining'),
            name: 'collegeTraining',
            meta: { noCache: isDevelopMode, title: 'College Training Stats' }
          }
        ]
      },

      // System Management
      {
        path: 'system',
        component: () => import('@/views/sysbasics/video/adminViews/system'),
        name: 'system',
        meta: { noCache: isDevelopMode, title: 'System Settings' },
        children: [
          {
            path: 'bannerManage',
            component: () => import('@/views/sysbasics/video/adminViews/component/system/banner'),
            name: 'bannerManage',
            meta: { noCache: isDevelopMode, title: 'Banner Management' }
          },
          {
            path: 'menuManage',
            component: () => import('@/views/sysbasics/video/adminViews/component/system/menu'),
            name: 'menuManage',
            meta: { noCache: isDevelopMode, title: 'Menu Management' }
          },
          {
            path: 'roleManage',
            component: () => import('@/views/sysbasics/video/adminViews/component/system/role'),
            name: 'roleManage',
            meta: { noCache: isDevelopMode, title: 'Role Management' }
          },
          {
            path: 'collegeManage',
            component: () => import('@/views/sysbasics/video/adminViews/component/system/college'),
            name: 'collegeManage',
            meta: { noCache: isDevelopMode, title: 'College Management' }
          },
          {
            path: 'setting',
            component: () => import('@/views/sysbasics/video/adminViews/component/system/setting'),
            name: 'setting',
            meta: { noCache: isDevelopMode, title: 'System Settings' }
          }
        ]
      }
    ]
  }
]

const isDevelopMode = import.meta.env.DEV

export default [
  // Exam detail route
  {
    path: '/examDetail',
    component: () => import('@/views/sysbasics/video/userViews/ExamDetail'),
    name: 'examDetail',
    meta: { noCache: isDevelopMode }
  },

  // Admin Video Layout
  {
    path: '/videoAdminLayout',
    component: () => import('@/views/sysbasics/video/layout/VideoAdminLayout'),
    name: 'videoAdminLayout',
    meta: { noCache: isDevelopMode },
    children: [
      // Lesson Management
      {
        path: 'lesson',
        component: () => import('@/views/sysbasics/video/adminViews/Lesson'),
        name: 'adminLesson',
        meta: { noCache: isDevelopMode, title: 'Lesson Management' },
        children: [
          {
            path: 'contentManage',
            component: () => import('@/views/sysbasics/video/adminViews/component/lesson/Content'),
            name: 'contentManage',
            meta: { noCache: isDevelopMode, title: 'Content Management' }
          },
          {
            path: 'tagManage',
            component: () => import('@/views/sysbasics/video/adminViews/component/lesson/Tag'),
            name: 'tagManage',
            meta: { noCache: isDevelopMode, title: 'Tag Management' }
          },
          {
            path: 'catalogueManage',
            component: () => import('@/views/sysbasics/video/adminViews/component/lesson/Catalogue'),
            name: 'catalogueManage',
            meta: { noCache: isDevelopMode, title: 'Catalog Management' }
          },
          {
            path: 'courseManage',
            component: () => import('@/views/sysbasics/video/adminViews/component/lesson/Course'),
            name: 'courseManage',
            meta: { noCache: isDevelopMode, title: 'Course Management' }
          },
          {
            path: 'topicManage',
            component: () => import('@/views/sysbasics/video/adminViews/component/lesson/Topic'),
            name: 'topicManage',
            meta: { noCache: isDevelopMode, title: 'Topic Management' }
          }
        ]
      },

      // Training Management
      {
        path: 'training',
        component: () => import('@/views/sysbasics/video/adminViews/Training'),
        name: 'training',
        meta: { noCache: isDevelopMode, title: 'Training Management' },
        children: [
          {
            path: 'planManage',
            component: () => import('@/views/sysbasics/video/adminViews/component/training/Plan'),
            name: 'planManage',
            meta: { noCache: isDevelopMode, title: 'Training Plans' }
          },
          {
            path: 'classManage',
            component: () => import('@/views/sysbasics/video/adminViews/component/training/Class'),
            name: 'classManage',
            meta: { noCache: isDevelopMode, title: 'Class Management' }
          },
          {
            path: 'lecturerManage',
            component: () => import('@/views/sysbasics/video/adminViews/component/training/Lecturer'),
            name: 'lecturerManage',
            meta: { noCache: isDevelopMode, title: 'Lecturer Management' }
          },
          {
            path: 'placeManage',
            component: () => import('@/views/sysbasics/video/adminViews/component/training/Place'),
            name: 'placeManage',
            meta: { noCache: isDevelopMode, title: 'Training Places' }
          }
        ]
      },

      // Exam Management
      {
        path: 'exam',
        component: () => import('@/views/sysbasics/video/adminViews/Exam'),
        name: 'exam',
        meta: { noCache: isDevelopMode, title: 'Exam Management' },
        children: [
          {
            path: 'questionManage',
            component: () => import('@/views/sysbasics/video/adminViews/component/exam/Question'),
            name: 'questionManage',
            meta: { noCache: isDevelopMode, title: 'Question Bank' }
          },
          {
            path: 'questionnaireManage',
            component: () => import('@/views/sysbasics/video/adminViews/component/exam/Questionnaire'),
            name: 'questionnaireManage',
            meta: { noCache: isDevelopMode, title: 'Questionnaires' }
          },
          {
            path: 'examManage',
            component: () => import('@/views/sysbasics/video/adminViews/component/exam/Exam'),
            name: 'examManage',
            meta: { noCache: isDevelopMode, title: 'Exam Management' }
          }
        ]
      },

      // Analytics
      {
        path: 'analyze',
        component: () => import('@/views/sysbasics/video/adminViews/Analyze'),
        name: 'analyze',
        meta: { noCache: isDevelopMode, title: 'Analytics' },
        children: [
          {
            path: 'index',
            component: () => import('@/views/sysbasics/video/adminViews/component/analyze/Index'),
            name: 'analyzeIndex',
            meta: { noCache: isDevelopMode, title: 'System Overview' }
          },
          {
            path: 'collegeTraining',
            component: () => import('@/views/sysbasics/video/adminViews/component/analyze/CollegeTraining'),
            name: 'collegeTraining',
            meta: { noCache: isDevelopMode, title: 'College Training Stats' }
          }
        ]
      },

      // System Management
      {
        path: 'system',
        component: () => import('@/views/sysbasics/video/adminViews/System'),
        name: 'system',
        meta: { noCache: isDevelopMode, title: 'System Settings' },
        children: [
          {
            path: 'bannerManage',
            component: () => import('@/views/sysbasics/video/adminViews/component/system/Banner'),
            name: 'bannerManage',
            meta: { noCache: isDevelopMode, title: 'Banner Management' }
          },
          {
            path: 'menuManage',
            component: () => import('@/views/sysbasics/video/adminViews/component/system/Menu'),
            name: 'menuManage',
            meta: { noCache: isDevelopMode, title: 'Menu Management' }
          },
          {
            path: 'roleManage',
            component: () => import('@/views/sysbasics/video/adminViews/component/system/Role'),
            name: 'roleManage',
            meta: { noCache: isDevelopMode, title: 'Role Management' }
          },
          {
            path: 'collegeManage',
            component: () => import('@/views/sysbasics/video/adminViews/component/system/College'),
            name: 'collegeManage',
            meta: { noCache: isDevelopMode, title: 'College Management' }
          },
          {
            path: 'setting',
            component: () => import('@/views/sysbasics/video/adminViews/component/system/Setting'),
            name: 'setting',
            meta: { noCache: isDevelopMode, title: 'System Settings' }
          }
        ]
      }
    ]
  }
]

import { h } from 'vue'
import { createMemoryHistory, createRouter, createWebHashHistory, createWebHistory } from 'vue-router'

const AboutPage = () => {
  return h('h1', {}, 'About')
}

const routes = [
  {
    path: '/',
    component: AboutPage
  }
]

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

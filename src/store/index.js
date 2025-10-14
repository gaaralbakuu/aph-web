import { createStore } from 'vuex'
import app from './modules/app'
import errorLog from './modules/errorLog'
import permission from './modules/permission'
import tagsView from './modules/tagsView'
import user from './modules/user'
import dialogStack from './modules/dialogStack'

const store = createStore({
  modules: {
    app,
    errorLog,
    permission,
    tagsView,
    user,
    dialogStack
  }
})

export default store

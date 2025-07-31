const state = {
  dialogs: [], // Stack các dialog đang mở
  zIndexBase: 2000 // Z-index cơ sở cho dialog
}

const mutations = {
  PUSH_DIALOG(state, dialog) {
    // Thêm dialog vào stack
    state.dialogs.push({
      id: dialog.id,
      component: dialog.component,
      zIndex: state.zIndexBase + state.dialogs.length
    })
  },
  POP_DIALOG(state) {
    // Xóa dialog cuối cùng khỏi stack
    state.dialogs.pop()
  },
  REMOVE_DIALOG(state, dialogId) {
    // Xóa dialog cụ thể khỏi stack
    const index = state.dialogs.findIndex(dialog => dialog.id === dialogId)
    if (index !== -1) {
      state.dialogs.splice(index, 1)
      // Cập nhật lại z-index cho các dialog còn lại
      state.dialogs.forEach((dialog, idx) => {
        dialog.zIndex = state.zIndexBase + idx
      })
    }
  },
  CLEAR_DIALOGS(state) {
    // Xóa tất cả dialog
    state.dialogs = []
  }
}

const actions = {
  pushDialog({ commit }, dialog) {
    commit('PUSH_DIALOG', dialog)
  },
  popDialog({ commit, state }) {
    if (state.dialogs.length > 0) {
      const topDialog = state.dialogs[state.dialogs.length - 1]
      commit('POP_DIALOG')
      return topDialog
    }
    return null
  },
  removeDialog({ commit }, dialogId) {
    commit('REMOVE_DIALOG', dialogId)
  },
  clearDialogs({ commit }) {
    commit('CLEAR_DIALOGS')
  }
}

const getters = {
  dialogStack: state => state.dialogs,
  topDialog: state => state.dialogs.length > 0 ? state.dialogs[state.dialogs.length - 1] : null,
  dialogCount: state => state.dialogs.length,
  getDialogZIndex: state => dialogId => {
    const dialog = state.dialogs.find(d => d.id === dialogId)
    return dialog ? dialog.zIndex : state.zIndexBase
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}

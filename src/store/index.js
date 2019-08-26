import {
  createStore
} from '@mpxjs/core'

const store = createStore({
  state: {
    openId: null,
    classify: []
  },
  getters: {
    openId(state) {
      return state.openId
    },
    classify(state) {
      return state.classify
    }
  },
  mutations: {
    setOpenId(state, data) {
      state.openId = data;
    },
    setClassify(state, data) {
      state.classify = data;
    }
  },
  actions: {
    async getOpenId(context) {
      wx.cloud.callFunction({
        name: 'user'
      }).then(res => {
        context.commit('setOpenId', res.result.openid);
      })
    },
    getClassify(context) {
      wx.cloud.callFunction({
        name: 'getClassify'
      }).then(res => {
        let arr=res.result.data;
        arr.unshift({
          id: "",
          name: '请选择分类'
        })
        context.commit('setClassify', arr)
      })
    }
  }
})

export default store

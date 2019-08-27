import {
  createStore
} from '@mpxjs/core'

const store = createStore({
  state: {
    openId: null,
    classify: [],
    isAccredit:false
  },
  getters: {
    openId(state) {
      return state.openId
    },
    classify(state) {
      return state.classify
    },
    isAccredit(state) {
      return state.isAccredit
    }
  },
  mutations: {
    setOpenId(state, data) {
      state.openId = data;
    },
    setClassify(state, data) {
      state.classify = data;
    },
    setAccredit(state, data){
      state.isAccredit=data ? true : false;
    }
  },
  actions: {
     getOpenId(context) {
      wx.cloud.callFunction({
        name: 'user'
      }).then(res => {
        context.commit('setOpenId', res.result.openid);
      })
    },
    getAccredit(context){
      wx.getSetting({
        success: (res) => {
          context.commit('setAccredit', res.authSetting['scope.userInfo'])
        }
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

import Vue from 'vue'
import Vuex from 'vuex'
import project from './Project/Project'
Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    project,
    flag: false
  },
  mutations: {
    // TKE 判断Helm
    getFlag(state, data) {
      state.flag = data
    }
  },
  actions: {

  }
})

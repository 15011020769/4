import Vue from 'vue'
// import VueCookie from 'vue-cookie'
import { Loading } from 'element-ui'
import axios from 'axios'

const conf = {
  baseURL: 'http://212.64.104.240:8868/product' || '',
  timeout: 60 * 1000,
  loading: true,
  headers: {
    uuid: '65f2654cfa2b4ad59ec034899ad5d580',
    Pragma: 'no-cache',
    'Cache-Control': 'no-cache'
  }
}

const instance = axios.create(conf)
let loading

instance.interceptors.request.use((config) => {
  if (config.loading) {
    loading = Loading.service({
      lock: true,
      text: '加载中……',
      background: 'rgba(0, 0, 0, 0.1)'
    })
  }
  return config
})

instance.interceptors.response.use((res) => {
  if (loading) loading.close()
  if (res.status !== 200) return Promise.reject(res)
  return res.data
}, (err) => {
  if (loading) loading.close()
  return Promise.reject(err)
})

Plugin.install = function (vue) {
  vue.axios = instance
  window.axios = instance
  Object.defineProperties(vue.prototype, {
    axios: {
      get () {
        return instance
      }
    },
    $axios: {
      get () {
        return instance
      }
    }
  })
}

Vue.use(Plugin)

export default Plugin

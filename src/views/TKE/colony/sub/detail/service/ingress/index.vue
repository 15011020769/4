 <!-- Ingress-详情 -->
<template>
  <div class="colony-wrap">
    <div class="tke-content-header tke-detail-header">
      <div class="tke-grid ">
        <!-- 左侧 -->
        <div class="grid-left">
          <span class="goback" @click="goBack()">
            <i class="el-icon-back"></i>
          </span>
          <span class="goback" @click="goColonyList()">
            集群(中国台北) /
          </span>
          <span class="goback" @click="goBack()">
            cls-gwblk71e(tfy_test1) /
          </span>
          <h2 class="header-title">Ingress:ssss(default)</h2>
        </div>
        <!-- 右侧 -->
        <div class="grid-right"></div>
      </div>
    </div>

    <!-- 详情子菜单导航 -->
    <div class="tke-detial-nav">
      <router-link class="nav-item" :to="{name:'ingressDetailInfo',query: {clusterId: clusterId, namespace: namespace, ingressName: ingressName}}">详情</router-link>
      <router-link class="nav-item" :to="{name:'ingressDetailEvent',query: {clusterId: clusterId, namespace: namespace, ingressName: ingressName}}">事件</router-link>
      <router-link class="nav-item" :to="{name:'ingressDetailYaml',query: {clusterId: clusterId, namespace: namespace, ingressName: ingressName}}">YAML</router-link>
    </div>

    <!-- 子页面 -->
    <keep-alive>
        <transition name="fade" mode="out-in">
          <router-view></router-view>
        </transition>
    </keep-alive>

  </div>
</template>

<script>
import XLSX from 'xlsx'
import { ALL_CITY } from '@/constants'

export default {
  name: 'ingressDetail',
  data () {
    return {
      clusterId: '',
      namespace: '', // 所在页面的命名空间
      ingressName: '' // 所在页面的ingress名称
    }
  },
  components: {},
  created () {
    // 从路由获取集群id
    let { clusterId, ingressName, namespace } = this.$route.query
    this.clusterId = clusterId
    this.namespace = namespace
    this.ingressName = ingressName
  },
  methods: {
    // 返回上一层
    goBack () {
      this.$router.push({
        name: 'colonyServiceIngress'

      })
    },
    // 返回集群列表
    goColonyList () {
      this.$router.push({
        name: 'colony'
      })
    }
  }
}
</script>

 <style lang="scss" scoped>
 </style>

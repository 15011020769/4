 <!-- Service-详情 -->
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
            集群({{$t('TKE.overview.zgtb')}}) /
          </span>
          <span class="goback" @click="goBack()">
            {{clusterId}} /
          </span>
          <h2 class="header-title">Service:{{`${serviceName}(${spaceName})`}}</h2>
        </div>
        <!-- 右侧 -->
        <div class="grid-right"></div>
      </div>
    </div>

    <!-- 详情子菜单导航 -->
    <div class="tke-detial-nav">
      <router-link class="nav-item" :to="{name:'svcDetailInfo',query: {clusterId: clusterId,spaceName:spaceName,serviceName:serviceName}}">{{$t('TKE.overview.xq')}}</router-link>
      <router-link class="nav-item" :to="{name:'svcDetailEvent',query: {clusterId: clusterId,spaceName:spaceName,serviceName:serviceName}}">事件</router-link>
      <router-link class="nav-item" :to="{name:'svcDetailYaml',query: {clusterId: clusterId,spaceName:spaceName,serviceName:serviceName}}">YAML</router-link>
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
  name: 'svcDetail',
  data () {
    return {
      clusterId: '',
      spaceName: '',
      serviceName: ''
    }
  },
  components: {

  },
  created () {
    // 从路由获取集群id
    let { clusterId, spaceName, serviceName } = this.$route.query
    this.clusterId = clusterId
    this.spaceName = spaceName
    this.serviceName = serviceName
  },
  methods: {
    // 返回上一层
    goBack () {
      this.$router.push({
        name: 'colonyServiceSvc'

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

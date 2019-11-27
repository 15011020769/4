<template>
  <div id="CCN">
    <el-container v-if="$route.meta.keepAlive">
      <el-header>
        <nav-header></nav-header>
      </el-header>
      <el-container height="100%">
        <el-aside width="200px"
          height="100%">
          <left-aside></left-aside>
        </el-aside>
        <el-main class="">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>
import NavHeader from '@/components/HeaderAside/Header'
import LeftAside from './Public/Menu'
export default {
  data () {
    return {}
  },
  components: {
    NavHeader,
    LeftAside
  },
  mounted () {
    //this.getProgectList()
    if (this.$cookie.get('regionv1') === undefined || this.$cookie.get('regionv1') === '' || this.$cookie.get('regionv1') === null) {
      this.$cookie.set('regionv1', 'gz')
      this.$cookie.set('regionv2', 'ap-guangzhou')
    }
    console.log(this.$cookie.get('uuid'))
  },
  methods: {
    // 获取项目列表
    getProgectList () {
      var params = {}
      this.axios.post('account/DescribeProject', params).then(data => {
        let projectList = data.data
        let defaultPro = {
          projectId: 0,
          projectInfo: '默认项目',
          projectName: '默认项目'
        }
        projectList.unshift(defaultPro)
        // localStorage存储对象或者数据，必须先转成字符串JSON.stringify存储，在用JSON.parse进行解析
        localStorage.setItem('projectList', JSON.stringify(projectList))
      })
    }
  }
}
</script>
<style lang="scss" scoped>
#CCN {
  height: 100%;
  .el-container {
    height: 100%;
    .el-header {
      padding: 0 0 !important;
    }
    .el-aside {
      background-color: #292b36;
    }
    .el-main {
      padding: 0;
      background: #f2f2f2;
      height: 100%;
      padding: 0 20px;
    }
  }
}
</style>

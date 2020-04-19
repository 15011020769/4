<template>
    <el-card class="box-card">
        <p class="box-info">{{$t('TKE.overview.jbxx')}}</p>
        <el-form  class="tke-form"  label-position='left' label-width="120px" size="mini">
          <el-form-item :label="$t('TKE.mirrorDetail.ckmc')">
            <div class="tke-form-item_text"><span>{{$route.query.id}}</span></div>
          </el-form-item>
          <el-form-item :label="$t('TKE.overview.lx')">
            <div class="tke-form-item_text"><span>{{publics | publicsEdit}}</span></div>
          </el-form-item>
          <el-form-item :label="$t('TKE.mirrorDetail.ckdz')">
            <div class="tke-form-item_text"><span>{{server}}/{{$route.query.id}}</span>
            <i class="el-icon-document" style="cursor: pointer;"  @click="getContext($event)"></i>
            </div>
          </el-form-item>
          <el-form-item label="收藏量">
            <div class="tke-form-item_text"><span>{{favorCount}}</span></div>
          </el-form-item>
          <el-form-item :label="$t('TKE.totalMirror.xzl')">
            <div class="tke-form-item_text"><span>{{pullCount}}</span></div>
          </el-form-item>
          <el-form-item label="描述">
            <div class="tke-form-item_text"><span>{{description | descriptions}}</span></div>
          </el-form-item>
          <el-form-item :label="$t('TKE.overview.cjsj')">
            <div class="tke-form-item_text"><span>{{updateTime}}</span></div>
          </el-form-item>
        </el-form>
    </el-card>
</template>
<script>
import { TKE_GET_REPOSITORY_LIST } from '@/constants'
export default {
  data () {
    return {
      publics: '',
      server: '',
      pullCount: '',
      description: '',
      updateTime: '',
      favorCount:''
    }
  },
  created () {
    this.GetRepositoryList()
  },
  methods: {
    getContext (e) {
      let getText = e.currentTarget.previousElementSibling.innerHTML
      this.copy(getText)
    },
    copy (data) { // 复制功能
      let url = data
      let oInput = document.createElement('input')
      oInput.value = url
      document.body.appendChild(oInput)
      oInput.select() // 选择对象;
      document.execCommand('Copy') // 执行浏览器复制命令
      this.$message({
        message: this.$t('TKE.mirrorDetail.fzcg'),
        type: 'success',
        showClose: true,
        duration: 0
      })
      oInput.remove()
    },
    GetRepositoryList () { // 获取镜像版本
      const param = {
        reponame: this.$route.query.id,
        order: 'asc',
        offset: 0,
        limit: 1
      }
      this.axios.post(TKE_GET_REPOSITORY_LIST, param).then(res => {
        if (res.code === 0 && res.Error == undefined) {
          this.publics = res.data.repoInfo[0].public
          this.server = res.data.server
          this.pullCount = res.data.repoInfo[0].pullCount
          this.description = res.data.repoInfo[0].description
          this.updateTime = res.data.repoInfo[0].updateTime
          this.favorCount = res.data.repoInfo[0].favorCount
        } else {
          this.$message({
              message: ErrorTips[res.codeDesc],
              type: "error",
              showClose: true,
              duration: 0
          })
        }
      })
    }
  },
  filters: {
    publicsEdit: function (value) {
      // 类型过滤
      if (value == '1') {
        return '公有'
      } else {
        return '私有'
      }
    },
    descriptions: function (value) {
      if (value === '') {
        return '無'
      } else {
        return value
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .text {
    font-size: 14px;
  }

  .item {
    width: 100px;
    ul>li{
        padding-top:30px;
        font-size: 12px;
        color:#888;
    }
  }

  .box-card {
    width: 95%;
    position: absolute;
    top:40px;
    left:20px;
    .box-info{
        font-size: 14px;
        font-weight: 700;
        margin-bottom:20px;
    }
  }
</style>

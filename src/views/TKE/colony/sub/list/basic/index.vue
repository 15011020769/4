 <!-- 基本信息 -->
<template>
  <div >
    <subTitle title='基本信息'  />

    <el-row :gutter="20" style="display:flex;  align-items: stretch;">
      <el-col :span="12">
        <div class="tke-card tke-formpanel-wrap">
          <h4 class="tke-formpanel-title">集群信息</h4>
          <el-form  class="tke-form"  label-position='left' label-width="130px" size="mini">
            <el-form-item label="集群名称">
              <div class="tke-form-item_text"><span>tfydb</span><i class="el-icon-edit tke-icon"></i></div>
            </el-form-item>
            <el-form-item label="集群ID">
              <div class="tke-form-item_text"><span>cls-gwblk71e</span></div>
            </el-form-item>
            <el-form-item label="部署类型">
              <div class="tke-form-item_text"><span>托管集群</span></div>
            </el-form-item>
            <el-form-item label="状态">
              <div class="tke-form-item_text"><span>运行中</span></div>
            </el-form-item>
            <el-form-item label="所在地域">
              <div class="tke-form-item_text"><span>港澳台地区(中国台北)</span></div>
            </el-form-item>
            <el-form-item label="新增资源所属项目">
              <div class="tke-form-item_text"><span>1111</span><i class="el-icon-edit tke-icon"></i></div>
            </el-form-item>
            <el-form-item label="kubernetes版本">
              <div class="tke-form-item_text">
                <p>Master</p>
                <p>Node</p>
              </div>
            </el-form-item>
            <el-form-item label="运行时组件">
              <div class="tke-form-item_text"><span>docker</span></div>
            </el-form-item>
            <el-form-item label="集群描述">
              <div class="tke-form-item_text"><span>tfydbtfydb</span><i class="el-icon-edit tke-icon"></i></div>
            </el-form-item>
            <el-form-item label="创建时间">
              <div class="tke-form-item_text"><span>2020-01-02 14:01:57</span></div>
            </el-form-item>
          </el-form>
        </div>

      </el-col>
      <el-col :span="12">
        <div class="tke-card tke-formpanel-wrap">
          <h4 class="tke-formpanel-title">节点和网络信息</h4>
          <el-form  class="tke-form"  label-position='left' label-width="130px" size="mini">
            <el-form-item label="节点数量">
              <div class="tke-form-item_text"><span>1个</span></div>
            </el-form-item>
            <el-form-item label="默认操作系统">
              <div class="tke-form-item_text"><span>ubuntu16.04.1 LTSx86_64</span><i class="el-icon-edit tke-icon"></i></div>
            </el-form-item>

            <el-form-item label="系统镜像来源">
              <div class="tke-form-item_text"><span>公共镜像 - 基础镜像</span></div>
            </el-form-item>
            <el-form-item label="网络节点">
              <div class="tke-form-item_text"><span><a href="#">vpc-6whh21qa</a></span></div>
            </el-form-item>
            <el-form-item label="容器网络">
              <div class="tke-form-item_text">
                <p>172.16.0.0/16</p>
                <p>1024个Service/集群，64个Pod/节点,1008个节点/集群</p>
              </div>
            </el-form-item>
            <el-form-item label="网络模式">
              <div class="tke-form-item_text"><span>cni</span></div>
            </el-form-item>
            <el-form-item label="云联网">
              <div class="tke-form-item_text"><span>docker</span></div>
            </el-form-item>
            <el-form-item label="ipvs支持">
              <div class="tke-form-item_text"><span>未开启</span></div>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>

    <div class="tke-card tke-formpanel-wrap mt10">
      <h4 class="tke-formpanel-title">集群APIServer信息</h4>
      <el-form  class="tke-form"  label-position='left' label-width="130px" size="mini">
        <el-form-item label="访问地址">
          <div class="tke-form-item_text"><span>{{security.Domain}}</span></div>
        </el-form-item>
        <el-form-item label="外网访问">
          <div class="tke-form-item_text"><span>未开启</span></div>
        </el-form-item>

        <el-form-item label="内网访问">
          <div class="tke-form-item_text"><span>未开启</span></div>
        </el-form-item>
        <el-form-item label="Kubeconfig">
          <div class="tke-form-item_text tke-rich-textarea" >
            <div class="rich-content">
              <pre class="rich-text"> {{security.Kubeconfig}}</pre>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <hr>
      <div style='line-height:1.5'>
        <p><strong>通过Kubectl连接Kubernetes集群操作说明:</strong></p>
        <p class="mt10">1.安装Kubectl客户端：从Kubernetes版本页面下载最新的kubectl客户端，并安装和设置kubectl客户端，具体可参考安装和设置kubectl。</p>
        <p>2.配置Kubeconfig：复制上方Kubeconfig访问凭证内容，替换 $HOME/.kube/config 内已有内容；或下载该kubeconfig至指定位置，并配置环境变量： KUBECONFIG=$HOME/.kube/config:cls-gwblk71e-config。</p>
        <p>3.完成以上配置即可使用kubectl访问Kubernetes集群。如果无法连接请查看是否已经开启公网访问或内网访问入口，并确保访问客户端在指定的网络环境内。</p>
      </div>
    </div>
  </div>
</template>

<script>
import subTitle from '@/views/TKE/components/subTitle'
import Loading from '@/components/public/Loading'
import { ALL_CITY, CLUSTERS_DESCRIBE, CLUSTERS_SECURITY } from '@/constants'
export default {
  name: 'colonyBasic',
  data () {
    return {
      clusterId: '', // 集群id
      loadShow: false,
      security: {}
    }
  },
  components: {
    subTitle,
    Loading
  },
  created () {
    // 从路由获取集群id
    this.clusterId = this.$route.query.clusterId
    this.getSecurity()
  },
  methods: {
    // 获取集群APIServer信息 相关
    async getSecurity () {
      this.loadShow = true
      let params = {
        ClusterId: this.clusterId,
        Version: '2018-05-25'
      }
      const res = await this.axios.post(CLUSTERS_SECURITY, params)
      if (res.Error) {
        console.log(res)
        this.loadShow = false
      } else {
        // console.log(res)
        this.security = res.Response
        console.log(res)
        this.loadShow = false
      }
    }

  }
}
</script>

<style lang="scss" scoped>
.tke-formpanel-wrap{
  height: 100%;
}
.tke-form {
  .tke-rich-textarea{
    border: 1px solid #d1d2d3;
    background-color: #fff;
    border-radius: 3px;
    position: relative;
    display: inline-block;
    vertical-align: middle;
    box-sizing: border-box;
    overflow: auto;
    .rich-content{
      counter-reset: num 0;
      font-family: consolas;
      outline: 0;
      display: inline-block;
      word-break: break-word;
      .rich-text{
        margin: 0;
        font-size: 12px;
        line-height: 22px;
        color: #000;
        position: relative;
        padding: 5px;
        white-space: pre-wrap;
        overflow: auto;
        height: 300px;
        font-family: SFMono-Regular,Consolas,"Liberation Mono",Menlo,Courier,monospace;
        &:hover{
          background-color: #fafafa;
        }
      }
    }
  }

}

</style>

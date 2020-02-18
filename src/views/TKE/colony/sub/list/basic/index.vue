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
              <div class="tke-form-item_text"><span>{{clusterInfo.ClusterName}}</span><i class="el-icon-edit tke-icon" @click="showUpdateName = true"></i></div>
            </el-form-item>
            <el-form-item label="集群ID">
              <div class="tke-form-item_text"><span>{{clusterInfo.ClusterId}}</span></div>
            </el-form-item>
            <el-form-item label="部署类型">
              <div class="tke-form-item_text"><span>{{clusterInfo.ClusterId}}</span></div>
            </el-form-item>
            <el-form-item label="状态">
              <div class="tke-form-item_text"><span>{{changeStatus(clusterInfo.ClusterStatus)}}</span></div>
            </el-form-item>
            <el-form-item label="所在地域">
              <div class="tke-form-item_text"><span>港澳台地区(中国台北)</span></div>
            </el-form-item>
            <el-form-item label="新增资源所属项目">
              <div class="tke-form-item_text"><span>{{projectName}}</span><i class="el-icon-edit tke-icon" @click="showUpdateProject = true"></i></div>
            </el-form-item>
            <el-form-item label="kubernetes版本">
              <div class="tke-form-item_text">
                <p>Master    {{clusterInfo.ClusterId}}</p>
                <p>Node</p>
              </div>
            </el-form-item>
            <el-form-item label="运行时组件">
              <div class="tke-form-item_text"><span>{{clusterInfo.ContainerRuntime}}</span></div>
            </el-form-item>
            <el-form-item label="集群描述">
              <div class="tke-form-item_text"><span>{{clusterInfo.ClusterDescription}}</span><i class="el-icon-edit tke-icon" @click="showUpdateDescribe = true"></i></div>
            </el-form-item>
            <el-form-item label="创建时间">
              <div class="tke-form-item_text"><span>{{clusterInfo.CreatedTime}}</span></div>
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

    <el-dialog title="编辑集群名称" :visible.sync="showUpdateName" width="550px">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
        size="small"
        style="width:500px"
      >
        <el-form-item label="原名称">
            <p>{{clusterInfo.ClusterName}}</p>
        </el-form-item>
        <el-form-item label="新名称" prop="pass">
          <el-input type="text" v-model="ruleForm.name" autocomplete="off" style="width:200px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitNameForm('ruleForm')">提 交</el-button>
        <el-button @click="closeDialog('1')">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="编辑新增资源所属项目" :visible.sync="showUpdateProject" width="750px">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
        size="small"
        style="width:700px"
      >
        <el-form-item label="原项目">
            <p>{{projectName}}</p>
        </el-form-item>
        <el-form-item label="新项目" prop="pass">
          <el-select type="text" v-model="ruleForm.projectId" autocomplete="off" style="width:300px">
            <el-option
              v-for="item in projectData"
              :key="item.projectId"
              :label="item.projectInfo"
              :value="item.projectId"
            ></el-option>
          </el-select>
          <p>集群内新增的云服务器、负载均衡器等资源将自动分配到该项目下<a href="#">使用指引</a><i class="el-icon-edit-outline"></i></p>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitProjectForm('ruleForm')">提 交</el-button>
        <el-button @click="closeDialog('2')">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="编辑集群描述" :visible.sync="showUpdateDescribe" width="750px">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
        size="small"
        style="width:700px"
      >
        <el-form-item label="原描述">
            <p>{{clusterInfo.ClusterDescription}}</p>
        </el-form-item>
        <el-form-item label="新描述" style="width:400px"  prop="textarea"
        :rules="[
          { max: 1000, message: '请输入', trigger: 'blur' }
        ]">
          <el-input
            type="textarea"
            :rows="4"
            placeholder="请输入内容"
            v-model="ruleForm.textarea"
            >
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitDescribeForm('ruleForm')">提 交</el-button>
        <el-button @click="closeDialog('3')">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import subTitle from '@/views/TKE/components/subTitle'
import Loading from '@/components/public/Loading'
import { ErrorTips } from "@/components/ErrorTips";
import { CLUSTERS_SECURITY, TKE_COLONY_LIST, ALL_PROJECT, UPDATE_CLUSTER_NAME, UPDATE_PROJECT, CLUSTER_VERSION } from '@/constants'
export default {
  name: 'colonyBasic',
  data () {
    return {
      clusterId: '', // 集群id
      clusterInfo: {},
      clusterVersion: {},
      loadShow: false,
      projectData: [],
      projectName: "",
      security: {},
      showUpdateName: false,
      showUpdateProject: false,
      showUpdateDescribe: false,
      ruleForm: {
        name: '',
        projectId: '',
        textarea: ''
      },
      rules: {
        name: [
          {
            required: true,
            message: "请填写新名称",
            trigger: "blur"
          }
        ],
        projectId: [
          {
            required: true,
            message: "请选择项目",
            trigger: "blur"
          }
        ]
      }
    }
  },
  components: {
    subTitle,
    Loading
  },
  created () {
    // 从路由获取集群id
    this.clusterId = this.$route.query.clusterId;
    this.getSecurity();
    this.getColonyInfo();
    this.getAllPorject();
    this.getClusterVersion();
  },
  methods: {
    //获取集群信息
    async getColonyInfo () {
      this.loadShow = true;
      let params = {
        Version: "2018-05-25",
        Limit: 10,
        Offset: 0
      };
      params["ClusterIds.0"] = this.clusterId;
      const res = await this.axios.post(TKE_COLONY_LIST, params);
      if (res.Response.Error === undefined) {
        this.clusterInfo = res.Response.Clusters[0];
        console.log(this.clusterInfo);
        this.loadShow = false;
      } else {
        this.loadShow = false;
        let ErrTips = {
          "InternalError": "内部错误",
          "InternalError.CamNoAuth": "没有权限。",
          "InternalError.Db": "db错误。",
          "InternalError.DbAffectivedRows": "DB错误",
          "InternalError.Param": "Param。",
          "InternalError.PublicClusterOpNotSupport": "集群不支持当前操作。",
          "InternalError.QuotaMaxClsLimit": "超过配额限制。",
          "InternalError.QuotaMaxNodLimit": "超过配额限制。",
          "InvalidParameter": "参数错误",
          "InvalidParameter.Param": "参数错误。",
          "LimitExceeded": "超过配额限制",
          "ResourceNotFound": "资源不存在"
        };
        let ErrOr = Object.assign(ErrorTips, ErrTips);
        this.$message({
          message: ErrOr[res.Response.Error.Code],
          type: "error",
          showClose: true,
          duration: 0
        });
      }
    },

    async getClusterVersion () {
      this.loadShow = true;
      let params = {
        Version: "2018-05-25"
      }
      params["ClusterId"] = this.clusterId;
      const res = await this.axios.post(CLUSTER_VERSION, params);
      if (res.Response.Error === undefined) {
        this.clusterVersion = res.Response.Clusters[0];
        this.loadShow = false;
      } else {
        this.loadShow = false;
        let ErrTips = {
          
        };
        let ErrOr = Object.assign(ErrorTips, ErrTips);
        this.$message({
          message: ErrOr[res.Response.Error.Code],
          type: "error",
          showClose: true,
          duration: 0
        });
      }
    },

    //获取所有项目
    async getAllPorject() {
      this.loadShow = true;
      let params = {
        allList: 0
      }
      this.axios.post(ALL_PROJECT, params).then(data => {
        let project = data.data || [];
        if(project.length > 0) {
          project.map(o => {
            if (o.projectId === this.clusterInfo.ProjectId) {
              this.projectName = o.projectName;
            }
          });
        }
        this.projectData = project;
      });
    },

    //从所有项目中获取当前集群的项目
    // getCurrProject() {

    // }

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
    },

    //更新集群名称
    async updateName () {
      this.loadShow = true;
      let param = {
        clusterId: this.clusterId,
        clusterName: this.ruleForm.name
      }
      await this.axios.post(UPDATE_CLUSTER_NAME, param).then(res => {
        if(res.code === 0) {
          this.getColonyInfo();
          this.showUpdateName = false;
          this.loadShow = false;
        } else {
          this.loadShow = false;
          this.$message({
            message: res.message,
            type: 'error'
          });
        }
      });
    },

    //提交名称修改
    submitNameForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.updateName();
        } else {
          console.log('error submit!!')
          return false
        }
      });
    },

    //更新集群名称
    async updateDescribe () {
      this.loadShow = true;
      let param = {
        clusterId: this.clusterId,
        clusterName: this.ruleForm.textarea
      }
      await this.axios.post(UPDATE_CLUSTER_NAME, param).then(res => {
        if(res.code === 0) {
          this.getColonyInfo();
          this.showUpdateDescribe = false;
          this.loadShow = false;
        } else {
          this.loadShow = false;
          this.$message({
            message: res.message,
            type: 'error'
          });
        }
      });
    },

    //提交描述修改
    submitDescribeForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.updateDescribe();
        } else {
          console.log('error submit!!')
          return false
        }
      });
    },

    //修改项目名
    async updateProject() {
      this.loadShow = true;
      let param = {
        clusterId: this.clusterId,
        projectId: this.ruleForm.projectId
      }
      await this.axios.post(UPDATE_PROJECT, param).then(res => {
        if(res.code === 0) {
          this.getColonyInfo();
          this.getAllPorject();
          this.showUpdateProject = false;
          this.loadShow = false;
        } else {
          this.loadShow = false;
          this.$message({
            message: res.message,
            type: 'error'
          });
        }
      });
    },

    //提交修改项目
    submitProjectForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.updateProject();
        } else {
          console.log('error submit!!')
          return false
        }
      });
    },

    //根据集群状态返回中文状态
    changeStatus (type) {
      if(type === 'Running') {
        return '运行中';
      } else if (type === 'Creating') {
        return '创建中';
      } else {
        return '异常';
      }
    },

    //关闭弹窗
    closeDialog(type) {
      console.log(type);
      if(type === '1') {
        this.showUpdateName = false;
        this.ruleForm.name = "";
      } else if (type === '2') {
        this.showUpdateProject = false;
        this.ruleForm.projectId = '';
      } else if (type === '3') {
        this.showUpdateDescribe = false;
        this.ruleForm.textarea = '';
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

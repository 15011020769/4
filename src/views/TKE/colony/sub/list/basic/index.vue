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
              <div class="tke-form-item_text"><span>{{changeClusterType(clusterInfo.ClusterType)}}</span></div>
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
                <p>Master {{clusterVersion.ClusterVersion || ''}}</p>
                <p>Node {{clusterVersion.InstanceVersions && clusterVersion.InstanceVersions.length > 0 && clusterVersion.InstanceVersions[0].InstanceVersion || ''}}</p>
              </div>
            </el-form-item>
            <el-form-item label="运行时组件">
              <div class="tke-form-item_text"><span>{{clusterInfo.ContainerRuntime}}</span></div>
            </el-form-item>
            <el-form-item label="集群描述">
              <div class="tke-form-item_text"><span>{{clusterInfo.ClusterDescription}}</span><i class="el-icon-edit tke-icon" @click="showUpdateDescribe = true"></i></div>
            </el-form-item>
            <el-form-item label="创建时间">
              <div class="tke-form-item_text"><span>{{upTime(clusterInfo.CreatedTime)}}</span></div>
            </el-form-item>
          </el-form>
        </div>

      </el-col>
      <el-col :span="12">
        <div class="tke-card tke-formpanel-wrap">
          <h4 class="tke-formpanel-title">节点和网络信息</h4>
          <el-form  class="tke-form"  label-position='left' label-width="130px" size="mini">
            <el-form-item label="节点数量">
              <div class="tke-form-item_text"><span>{{clusterInfo.ClusterNodeNum}}个</span></div>
            </el-form-item>
            <el-form-item label="默认操作系统">
              <div class="tke-form-item_text"><span>{{clusterInfo.ClusterOs}}</span><i class="el-icon-edit tke-icon" @click="showOsModal()"></i></div>
            </el-form-item>

            <el-form-item label="系统镜像来源">
              <div class="tke-form-item_text"><span>公共镜像 - {{changeOsCustomizeType(clusterInfo.OsCustomizeType)}}</span></div>
            </el-form-item>
            <el-form-item label="网络节点">
              <div class="tke-form-item_text"><span><a href="#">{{clusterInfo.ClusterNetworkSettings && clusterInfo.ClusterNetworkSettings.VpcId}}</a></span></div>
            </el-form-item>
            <el-form-item label="容器网络">
              <div class="tke-form-item_text">
                <p>{{clusterInfo.ClusterNetworkSettings && clusterInfo.ClusterNetworkSettings.ClusterCIDR}}</p>
                <p>{{clusterInfo.ClusterNetworkSettings && clusterInfo.ClusterNetworkSettings.MaxClusterServiceNum}}个Service/集群，{{clusterInfo.ClusterNetworkSettings && clusterInfo.ClusterNetworkSettings.MaxNodePodNum}}个Pod/节点,1008个节点/集群</p>
              </div>
            </el-form-item>
            <el-form-item label="网络模式">
              <div class="tke-form-item_text"><span>{{clusterInfo.ClusterNetworkSettings && clusterInfo.ClusterNetworkSettings.Cni === true? 'cni' : 'bridge'}}</span></div>
            </el-form-item>
            <el-form-item label="云联网">
              <div class="tke-form-item_text" v-if="vpcList.length > 0">
                <el-switch class="ml10" v-model="autoRefresh" @change="changeSwitch()" ></el-switch>
                <span>{{autoRefresh ? '已注册' : '未注册'}}</span>
              </div>
              
              <div class="tke-form-item_text" v-else><span>当前VPC尚未关联云联网</span></div>
            </el-form-item>
            <el-form-item label="ipvs支持">
              <div class="tke-form-item_text"><span>{{changeipvs(clusterInfo.ClusterNetworkSettings && clusterInfo.ClusterNetworkSettings.Ipvs)}}</span></div>
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
        <el-form-item label="原名称" >
            <p>{{clusterInfo.ClusterName}}</p>
        </el-form-item>
        <el-form-item label="新名称" prop="name">
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
        <el-form-item label="新项目" prop="projectId">
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
    <el-dialog title="设置集群操作系统" :visible.sync="showUpdateOs" width="750px">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
        size="small"
        style="width:700px"
      >
        <el-form-item label="操作系统" prop="pass">
          <el-select type="text" v-model="os" autocomplete="off" style="width:300px" @change="changeOs">
            <el-option
              v-for="item in osList"
              :key="item.Id"
              :label="item.Alias"
              :value="item"
            ></el-option>
          </el-select>
          <p>注意：更改操作系统仅决定集群内新增或者重装升级节点的操作系统，不影响正在运行节点的操作系统，更多<a href="#">查看详情</a><i class="el-icon-edit-outline"></i></p>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitOsForm('ruleForm')">提 交</el-button>
        <el-button @click="closeDialog('4')">取 消</el-button>
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
        <el-form-item label="新描述" style="width:400px"  prop="textarea">
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
    <el-dialog title="确定要关闭注册？" :visible.sync="showCloseCidr" width="750px">
      <p style="#e54545;">关闭注册容器网络到云联网，可能会造成已有的云联网和容器间路由不通</p>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="closeNet">提 交</el-button>
        <el-button @click="unRegister">取 消</el-button>
      </div>
    </el-dialog>
    
  </div>
</template>

<script>
import subTitle from '@/views/TKE/components/subTitle'
import Loading from '@/components/public/Loading'
import moment from 'moment';
import { ErrorTips } from "@/components/ErrorTips";
import { CLUSTERS_SECURITY, TKE_COLONY_LIST, ALL_PROJECT, UPDATE_CLUSTER_NAME, 
  UPDATE_PROJECT, CLUSTER_VERSION, CLUSTER_OS, UPDATE_OS,CLUSTERS_INSTANCES, 
  TKE_CCN_ROUTES, ADD_CIDE_TO_CCN, CLOSE_CIDE_TO_CCN } from '@/constants'
export default {
  name: 'colonyBasic',
  data () {
    return {
      clusterId: '', // 集群id
      vpcList: [],//vpc列表
      clusterInfo: {},//集群信息
      clusterVersion: {},//kubernetes版本
      loadShow: false,//是否加载
      projectData: [],//所有项目列表
      projectName: "",//项目名称
      security: {},//访问地址
      showUpdateName: false,//是否显示更名modal
      showUpdateProject: false,//是否显示更改项目modal
      showUpdateDescribe: false,//是否显示更改描述modal
      showUpdateOs: false,//是否显示更改操作系统modal
      os: {},//操作系统
      osList: [],//所有操作系统列表
      routeSets:[],//云网络列表
      autoRefresh: false, //是否关联网络
      showCloseCidr: false,//是否显示关闭注册网络弹窗
      ruleForm: {
        name: '',
        projectId: '',
        textarea: ''
      },
      rules: {
        name: [
          {
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('集群名称不能为空'))
              } else if (!(/^[a-z][a-z\d-]*$/.test(value))) {
                callback(new Error('集群名称格式不正确'))
              } else {
                callback()
              }
            },
            trigger: "blur",
            required: true
          }
        ],
        projectId: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请选择项目'))
              } else {
                callback()
              }
            },
            trigger: "change"
          }
        ],
        textarea: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请选择项目'))
              } else {
                callback()
              }
            },
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
        this.loadShow = false;
        let params1 = {
          VpcId: res.Response.Clusters[0].ClusterNetworkSettings.VpcId,
          Version: "2018-05-25"
        }
        await this.axios.post(CLUSTERS_INSTANCES, params1).then(async (res1) => {
          if(res1.Response.Error === undefined) {
            this.loadShow = false;
            this.vpcList = res1.Response.InstanceSet;
            if(res1.Response.InstanceSet.length > 0) {
              let param = {
                VpcId: res.Response.Clusters[0].ClusterNetworkSettings.VpcId,
                ClusterCIDR: res1.Response.InstanceSet[0].Cidrs[0],
                Version: "2018-05-25"
              }
              this.loadShow = true;
              await this.axios.post(TKE_CCN_ROUTES, param).then(res2 => {
                if(res2.Response.Error === undefined) {
                  this.loadShow = false;
                  if(res2.Response.RouteSet.length > 0) {
                    this.autoRefresh = true;
                  }
                  this.routeSets = res2.Response.RouteSet;
                } else {
                  this.loadShow = false;
                  let ErrTips = {};
                  let ErrOr = Object.assign(ErrorTips, ErrTips);
                  this.$message({
                    message: ErrOr[res2.Response.Error.Code],
                    type: "error",
                    showClose: true,
                    duration: 0
                  });
                }
              });
            }
          } else {
            this.loadShow = false;
            let ErrTips = {};
            let ErrOr = Object.assign(ErrorTips, ErrTips);
            this.$message({
              message: ErrOr[res1.Response.Error.Code],
              type: "error",
              showClose: true,
              duration: 0
            });
          }
        });
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
      params["ClusterId.0"] = this.clusterId;
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
        this.loadShow = false
      } else {
        this.security = res.Response
        this.loadShow = false
      }
    },

    async getOsList() {
      let osString = this.clusterInfo.ClusterOs;
      await this.axios.post(CLUSTER_OS).then(res => {
        if(res && res.code === 0 && res.data) {
          if(res.data.images.length > 0) {
            for(let i = 0; i<res.data.images.length; i++) {
              let currOs = res.data.images[i].OsName;
              if(currOs === osString) {
                this.os = res.data.images[i];
              }
            }
          }
          this.osList = res.data.images;
        }
      });
    },

    //打开操作系统modal
    showOsModal() {
      this.showUpdateOs = true;
      this.getOsList();
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
          return false
        }
      });
    },

    //更新集群描述
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

    //关闭注册弹窗
    unRegister() {
      this.getColonyInfo();
      this.showCloseCidr = false
    },

    //注册、关闭网络
    async changeSwitch() {
      let autoRefresh = this.autoRefresh;
      let vpcid = this.clusterInfo.ClusterNetworkSettings.VpcId;
      let cidr = this.vpcList[0].Cidrs[0];
      let param = {
        Version: "2018-05-25",
        VpcId: vpcid,
        ClusterCIDR: cidr
      }
      if(autoRefresh) {
        this.loadShow = true;
        await this.axios.post(ADD_CIDE_TO_CCN, param).then(res => {
          if(res.Response.Error === undefined) {
            this.getColonyInfo();
            this.$message({
              message: '操作成功',
              type: "success",
              showClose: true,
              duration: 0
            });
            this.loadShow = false;
          } else {
            this.loadShow = false;
            let ErrTips = {};
            let ErrOr = Object.assign(ErrorTips, ErrTips);
            this.$message({
              message: ErrOr[res.Response.Error.Code],
              type: "error",
              showClose: true,
              duration: 0
            });
          }
        });
      } else {
        this.showCloseCidr = true;
      }
      //CLUSTERS_INSTANCES
    },
    //关闭网络
    async closeNet() {
      this.loadShow = true;
      let vpcid = this.clusterInfo.ClusterNetworkSettings.VpcId;
      let cidr = this.vpcList[0].Cidrs[0];
      let param = {
        Version: "2018-05-25",
        VpcId: vpcid,
        ClusterCIDR: cidr
      }
      await this.axios.post(CLOSE_CIDE_TO_CCN, param).then(res => {
        if(res.Response.Error === undefined) {
          this.getColonyInfo();
          this.$message({
            message: '操作成功',
            type: "success",
            showClose: true,
            duration: 0
          });
          this.showCloseCidr = false
          this.loadShow = false;
        } else {
          this.loadShow = false;
          let ErrTips = {};
          let ErrOr = Object.assign(ErrorTips, ErrTips);
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 0
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
          return false
        }
      });
    },

    //选择系统
    changeOs(val) {
      let ss = this.os;
    },
    //提交修改系统
    async submitOsForm(formName) {
      this.loadShow = true;
      let param = {
        Version: "2018-05-25",
        ClusterId: this.clusterId,
        OsCustomizeType: this.os.CustomizeType,
        ImageId: this.os.OsName
      }

      await this.axios.post(UPDATE_OS, param).then(res => {
        if(res.Response.Error === undefined) {
          this.getColonyInfo();
          this.showUpdateOs = false;
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

    //根据集群类型返回中文状态
    changeClusterType (type) {
      if(type === 'MANAGED_CLUSTER') {
        return '托管集群';
      } else if (type === 'INDEPENDENT_CLUSTER') {
        return '独立集群';
      }
    },

    //根据系统镜像返回中文
    changeOsCustomizeType(type) {
      if(type === 'DOCKER_CUSTOMIZE') {
        return 'TKE定制镜像';
      } else if (type === 'GENERAL') {
        return '基础镜像';
      } else {
        return '基础镜像';
      }
    },

    //根据ipvs状态返回中文
    changeipvs(status) {
      if(status === true) {
        return '已开启';
      } else if (status === false) {
        return '未开启';
      }
    },

    //关闭弹窗
    closeDialog(type) {
      if(type === '1') {
        this.showUpdateName = false;
        this.ruleForm.name = "";
      } else if (type === '2') {
        this.showUpdateProject = false;
        this.ruleForm.projectId = '';
      } else if (type === '3') {
        this.showUpdateDescribe = false;
        this.ruleForm.textarea = '';
      } else if (type === '4') {
        this.showUpdateOs = false;
      }
    },

    upTime(value) {
      return moment(value).format("YYYY-MM-DD HH:mm:ss");
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

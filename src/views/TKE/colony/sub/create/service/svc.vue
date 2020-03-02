 <!-- 新建Service -->
<template>
  <div class="colony-wrap">
    <div class="tke-content-header">
      <div class="tke-grid ">
        <!-- 左侧 -->
        <div class="grid-left">
          <span class="goback" @click="goBack">
            <i class="el-icon-back"></i>
          </span>
          <h2 class="header-title">新建Service</h2>
        </div>
        <!-- 右侧 -->
        <div class="grid-right"></div>
      </div>
    </div>
    <div class="colony-main">
      <div class="tke-card tke-formpanel-wrap mb60">
        <el-form  class="tke-form" :model="svc" :rules="rules" ref="form" label-position='left' label-width="120px" size="mini">
					<div style="padding: 0 10px 10px 10px;border-bottom:1px solid #dcdfe6;">
						<h3 style="margin-bottom:11px;">基本信息</h3>
						<el-form-item label="名称" prop='name'>
							<el-input class="w200" v-model="svc.name" placeholder="请输入名称"></el-input>
							<p>最长63个字符，只能包含小写字母、数字及分隔符("-")，且必须以小写字母开头，数字或小写字母结尾</p>
						</el-form-item>
						<el-form-item label="描述">
							<textarea v-model="svc.describe" name="" class="ms" placeholder="请输入描述信息，不超过1000个字符" id="" cols="30" rows="10"></textarea>
						</el-form-item>
						<el-form-item label="命名空间">
							<el-select v-model="svc.value" placeholder="请选择">
								<el-option
									v-for="item in svc.options"
									:key="item.metadata.name"
									:label="item.metadata.name"
									:value="item.metadata.name">
								</el-option>
							</el-select>
						</el-form-item>
					</div>
          <!-- 访问设置的封装组件 -->
					<Service :personObj="{ownLoadBalancer,LBsubnet,vpcNameAry}" :svcData.sync='svc'></Service>

					<div class="card">
						<h3 style="padding-bottom:20px;">Workload（选填）</h3>
						<el-form-item label="Selectors">
							<div style="padding-bottom:10px;" v-for="it in svc.workload" :key="it.key">
								<el-input placeholder="key" class="w100"></el-input>=
								<el-input placeholder="value" class="w100"></el-input>
								<el-tooltip class="item" effect="dark" content="删除" placement="right">
									<i style="font-size:18px;padding-left:20px;" class="el-icon-close" @click="removework(it)"></i>
								</el-tooltip>
							</div>
							<div>
								<a href="javascript:;" @click="addwork()">添加</a> | <a href="javascript:;" @click="dialogFormVisible = true">引用Workload</a>
							</div>
						</el-form-item>
					</div>
        </el-form>

        <!-- 底部 -->
        <div class="tke-formpanel-footer">
          <el-button size="small" type="primary" @click="submitFound('form')">创建Service</el-button>
          <el-button size="small">取消</el-button>
        </div>
      </div>
    </div>
		<!-- 幕布层 -->
		<el-dialog title="收货地址" :visible.sync="dialogFormVisible">
			<el-form label-width="100px">
				<el-form-item label="资源类型">
					<el-radio-group v-model="svc.tabPosition" style="margin-left:70px;">
						<el-radio-button label="dep" @click.native="handleType1">Deploymemt</el-radio-button>
						<el-radio-button label="state" @click.native="handleType2">Statefulset</el-radio-button>
						<el-radio-button label="daem" @click.native="handleType3">Daemonset</el-radio-button>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="资源列表">
					<el-select v-model="svc.resourcesValue" :placeholder="resourcesList.length?'请选择':'无可用资源'" :disabled="resourcesList.length?false:true" style="margin-left:70px;">
						<el-option
							v-for="item in resourcesList"
							:key="item.metadata.name"
							:label="item.metadata.name"
							:value="item.metadata.name">
						</el-option>
					</el-select>
					<div v-if="resourcesList.length?false:true" style="margin-left:70px;">无可用资源，可前往<a href="">资源控制台</a>新建</div>
				</el-form-item>
				<el-form-item label="Labels">
					<div style="margin-left:70px;">
            <p v-if="resourcesList.length === 0">请先选择Workload</p>
            <div v-else v-for="(v1, i1) in resourcesList" :key="i1">
              <!-- <p v-if="v1">1313</p> -->
              <p v-for="(item, key) in v1.metadata.labels" :key="key">{{key}}: {{item}}</p>
            </div>
            <!-- <p v-else v-for="(item,key,i) in resourcesList[i].metadata.labels" :key="i">{{key}}:{{item}}</p> -->
          </div>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
			</div>
		</el-dialog>
  </div>
</template>

<script>
import Service from './components/Service'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import { ALL_CITY, POINT_REQUEST, TKE_EDSCRIBELOADBALANCERS, TKE_COLONY_LIST, TKE_VPC_METWORK, TKE_WORKER_METWORK } from '@/constants'
import { ErrorTips } from '@/components/ErrorTips'
export default {
  name: 'svcCreate',
  data () {
    return {
      dialogFormVisible: false,
      svc: {
        show: true,
        time: 30,
        checked: false,
        name: '', // 新建的名称
        value: '', // 命名空间名称
        resourcesValue: '', // 幕布层资源列表选中的值
        loadBalance: '1', // 负载均衡
        // value: 'default',
        LBvalue1: '', // LB子网1
        LBvalue2: '', // LB子网2
        balancerValue: '', // 已有均衡器
        protocol: 'TCP', // 选中的协议
        // options: ['default', 'kube-public', 'kube-system', 'tfy-pub'],
        options: [], // 命名空间列表
        radio: '1',
        ETP: '1',
        SA: '2',
        input: '',
        list: [],
        workload: [], // 高级选项的值
        tabPosition: 'dep', // 幕布层资源类型
        describe: ''// 描述
      },
      clusterId: '', // 集群id
      spaceName: '', // 命名空间的名称
      ownLoadBalancer: [], // 已有负载均衡器
      vpcNameAry: [], // vpcName的数据
      LBsubnet: [], // LB所在子网
      resourcesList: [], // 幕布层资源列表
      rules: {
        name: [// 对服务名称的校验
          {
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('名称不能为空'))
              } else if (!(/^[a-z][a-z\d-]*$/.test(value))) {
                callback(new Error('名称格式不正确'))
              } else {
                callback()
              }
            },
            trigger: 'blur',
            required: true
          }
        ]
      }
    }
  },
  components: {
    Service
  },
  created () {
    // 从路由获取类型
    let { clusterId, nameSpaceName } = this.$route.query
    this.clusterId = clusterId
    // console.log(this.$route)
    this.spaceName = nameSpaceName
    this.GetSpaceValue()// 获取命名空间
    this.getDescribeLoadBalancers()// 扫描均衡器
    this.getDescribeSubnets()// 扫描子网
    this.getDescribeVpcs()// 描述Vpcs
    this.getDescribeClusters()// 获取集群列表
    this.getForwardRequest()// 转发请求
  },
  methods: {
    // 扫描均衡器
    async getDescribeLoadBalancers () {
      let params = {
        Forward: 1,
        Limit: 100,
        Offset: 0,
        Version: '2018-03-17'
      }
      await this.axios.post(TKE_EDSCRIBELOADBALANCERS, params).then(res => {
        if (res.Response.Error === undefined) {
          this.ownLoadBalancer = res.Response.LoadBalancerSet
          // console.log(this.ownLoadBalancer)
        } else {
          let ErrTips = {}
          let ErrOr = Object.assign(ErrorTips, ErrTips)
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: 'error',
            showClose: true,
            duration: 2000
          })
        }
      })
    },
    // 扫描子网
    async getDescribeSubnets () {
      let params = {
        // Filters: [{ Name: 'vpc-id', Values: ['vpc-apm60zou'] }],
        'Filters.0.Name': 'vpc-id',
        'Filters.0.Values.0': 'vpc-apm60zou',
        Limit: 100,
        Offset: 0,
        Version: '2017-03-12'
      }
      await this.axios.post(TKE_WORKER_METWORK, params).then(res => {
        if (res.Response.Error === undefined) {
          this.LBsubnet = res.Response.SubnetSet
          // console.log(222, this.LBsubnet)
        } else {
          let ErrTips = {}
          let ErrOr = Object.assign(ErrorTips, ErrTips)
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: 'error',
            showClose: true,
            duration: 2000
          })
        }
      })
    },
    // 描述Vpcs
    async getDescribeVpcs () {
      let params = {
        Limit: 100,
        Offset: 0,
        Version: '2017-03-12',
        'VpcIds.0': 'vpc-apm60zou'
        // VpcIds: ["vpc-apm60zou"]
      }
      await this.axios.post(TKE_VPC_METWORK, params).then(res => {
        if (res.Response.Error === undefined) {
          this.vpcNameAry = res.Response.VpcSet
          // console.log(res.Response.VpcSet)
        } else {
          let ErrTips = {}
          let ErrOr = Object.assign(ErrorTips, ErrTips)
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: 'error',
            showClose: true,
            duration: 2000
          })
        }
      })
    },
    // 获取集群列表
    async getDescribeClusters () {
      let params = {
        // ClusterIds: ["cls-a7rua9ae"]
        'ClusterIds.0': this.clusterId,
        Version: '2018-05-25'
      }
      await this.axios.post(TKE_COLONY_LIST, params).then(res => {
        if (res.Response.Error === undefined) {
          // console.log(res)
        } else {
          let ErrTips = {}
          let ErrOr = Object.assign(ErrorTips, ErrTips)
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: 'error',
            showClose: true,
            duration: 2000
          })
        }
      })
    },
    // 转发请求
    async getForwardRequest () {
      let params = {
        ClusterName: this.clusterId,
        Method: 'GET',
        Path: `/apis/apps/v1beta2/namespaces/${this.spaceName}/deployments`,
        Version: '2018-05-25'
      }
      this.axios.post(POINT_REQUEST, params).then(res => {
        if (res.Response.Error === undefined) {
          // console.log(res)
        } else {
          let ErrTips = {}
          let ErrOr = Object.assign(ErrorTips, ErrTips)
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: 'error',
            showClose: true,
            duration: 2000
          })
        }
      })
    },
    // 获取命名空间
    GetSpaceValue () {
      var params = {
        ClusterName: this.$route.query.clusterId,
        Method: 'GET',
        Path: '/api/v1/namespaces',
        Version: '2018-05-25'
      }
      this.axios.post(POINT_REQUEST, params).then(res => {
        if (res.Response.Error === undefined) {
          var searchOpt = JSON.parse(res.Response.ResponseBody).items// 得到数组
          this.svc.options = searchOpt// 赋值命名空间数据
          this.svc.value = searchOpt[0].metadata.name
          // console.log(searchOpt)
        } else {
          let ErrTips = {}
          let ErrOr = Object.assign(ErrorTips, ErrTips)
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: 'error',
            showClose: true,
            duration: 2000
          })
        }
      })
    },
    // 引用Workload资源的处理
    async handleType1 () {
      let params = {
        ClusterName: this.clusterId,
        Method: 'GET',
        Path: `/apis/apps/v1beta2/namespaces/${this.spaceName}/deployments`,
        Version: '2018-05-25'
      }
      await this.axios.post(POINT_REQUEST, params).then(res => {
        if (res.Response.Error === undefined) {
          // console.log(res)
          let msg = JSON.parse(res.Response.ResponseBody).items
          this.resourcesList = msg
          // this.svc.resourcesValue = msg.length > 0 && msg[0].metadata.name
        } else {
          let ErrTips = {

          }
          let ErrOr = Object.assign(ErrorTips, ErrTips)
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: 'error',
            showClose: true,
            duration: 0
          })
        }
      })
    },
    async handleType2 () {
      let params = {
        ClusterName: this.clusterId,
        Method: 'GET',
        Path: `/apis/apps/v1beta2/namespaces/${this.spaceName}/statefulsets`,
        Version: '2018-05-25'
      }
      await this.axios.post(POINT_REQUEST, params).then(res => {
        if (res.Response.Error === undefined) {
          // console.log(JSON.parse(res.Response.ResponseBody).items)
          let msg = JSON.parse(res.Response.ResponseBody).items
          this.resourcesList = msg
          this.svc.resourcesValue = msg.length > 0 && msg[0].metadata.name
        } else {
          let ErrTips = {

          }
          let ErrOr = Object.assign(ErrorTips, ErrTips)
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: 'error',
            showClose: true,
            duration: 0
          })
        }
      })
    },
    async handleType3 () {
      let params = {
        ClusterName: this.clusterId,
        Method: 'GET',
        Path: `/apis/apps/v1beta2/namespaces/${this.spaceName}/daemonsets`,
        Version: '2018-05-25'
      }
      await this.axios.post(POINT_REQUEST, params).then(res => {
        if (res.Response.Error === undefined) {
          // console.log(res)
          // this.resourcesList = JSON.parse(res.Response.ResponseBody).items
          let msg = JSON.parse(res.Response.ResponseBody).items
          this.resourcesList = msg
          // this.svc.resourcesValue = msg.length > 0 && msg[0].metadata.name
        } else {
          let ErrTips = {

          }
          let ErrOr = Object.assign(ErrorTips, ErrTips)
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: 'error',
            showClose: true,
            duration: 0
          })
        }
      })
    },
    // 新建服务
    async submitFound () {
      let { name, describe, list, value, time, ETP, SA } = this.svc
      let newPortAry = []
      list.forEach(ele => {
        let ports = {
          name: `${ele.input1}-${ele.input2}-${ele.protocol.toLowerCase()}`,
          port: Number(ele.input1),
          targetPort: Number(ele.input2),
          protocol: ele.protocol
        }
        newPortAry.push(ports)
      })
      var policy = 'Cluster'
      if (ETP === '2') {
        policy = 'Local'
      }
      var sessionTime = 'None'
      if (SA === '1') {
        sessionTime = { 'clientIP': { 'timeoutSeconds': time } }
      }
      let reqBody = {
        'kind': 'Service',
        'apiVersion': 'v1',
        'metadata': { 'name': name,
          'namespace': value,
          'annotations': {
            'service.kubernetes.io/service.extensiveParameters': '{"AddressIPVersion":"IPV4"}',
            'description': describe } },
        'spec': { 'type': 'LoadBalancer',
          'ports': newPortAry,
          'externalTrafficPolicy': policy,
          'sessionAffinity': sessionTime } }
      let param = {
        Method: 'POST',
        Path: `/api/v1/namespaces/${this.spaceName}/services`,
        Version: '2018-05-25',
        RequestBody: JSON.stringify(reqBody),
        ClusterName: this.clusterId
      }
      await this.axios.post(POINT_REQUEST, param).then(res => {
        if (res.Response.Error === undefined) {
          this.loadShow = false
          console.log(res)
          // this.$router.push({
          //   path: '/colony/sub/detail/service/svc/event',
          //   query: {
          //     clusterId: this.clusterId,
          //     ingressName: name,
          //     namespace: value
          //   }
          // })
        } else {
          this.loadShow = false
          let ErrTips = {

          }
          let ErrOr = Object.assign(ErrorTips, ErrTips)
          this.$message({
            message: ErrOr[Response.Error.Code],
            type: 'error',
            showClose: true,
            duration: 0
          })
        }
      })
    },

    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    // 删除work
    removework (item) {
      var index = this.svc.workload.indexOf(item)
      if (index !== -1) {
        this.svc.workload.splice(index, 1)
      }
    },
    // 删除端口
    // removeprot(item){
    // 	var index = this.svc.list.indexOf(item)
    // 	if(index !== -1){
    // 		this.svc.list.splice(index,1)
    // 	}
    // },
    // 新增work
    addwork () {
      this.svc.workload.push({
        value: '',
        key: Date.now()
      })
    },
    // 新增端口
    // addport(){
    // 	this.svc.list.push({
    // 		value: '',
    // 		key: Date.now()
    // 	})
    // },
    // 显示或隐藏高级设置
    show () {
      this.svc.show = !this.svc.show
    },
    // 返回上一层
    goBack () {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
.shadow {
	z-index: 999;
	float: left;
	width:100%;
	height: 900px;
	opacity: 0.6;
	background: black;
}
.w250 {
	width:250px;
}
.w100 {
	width:100px;
}
.flex {
	display: flex;
}
.port {
	max-width: 680px;
	border: 1px solid #ddd;
}
.card {
	padding: 10px;border-bottom:1px solid #dcdfe6;
}
.text-error {
	color: #e54545;
}
.text-warning {
 color: #ff9d00
}
.ms {
	width: 330px;
	padding: 5px 8px 8px 5px;
	height: 100px;
	border-radius: 4px;
	border: 1px solid #dcdfe6;
	resize: none;
}
</style>

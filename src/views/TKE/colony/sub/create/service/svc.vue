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
      <div class="tke-card tke-formpanel-wrap mb60" v-loading="loadShow">
        <el-form  class="tke-form" :model="svc" :rules="rules" ref="form" label-position='left' label-width="120px" size="mini">
					<div style="padding: 0 10px 10px 10px;border-bottom:1px solid #dcdfe6;">
						<h3 style="margin-bottom:11px;">{{$t('TKE.overview.jbxx')}}</h3>
						<el-form-item :label="$t('TKE.overview.mc')" prop='name'>
							<el-input class="w200" v-model="svc.name" :placeholder="$t('TKE.myMirror.qsrmc')"></el-input>
							<p>{{$t('TKE.overview.xz')}}</p>
						</el-form-item>
						<el-form-item label="描述">
							<textarea v-model="svc.describe" name="" class="ms" :placeholder="$t('TKE.subList.qsrmsxx')" id="" cols="30" rows="10"></textarea>
						</el-form-item>
						<el-form-item :label="$t('TKE.overview.mmkj')">
							<el-select v-model="svc.value" :placeholder="$t('TKE.overview.qxz')">
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
					<Service :personObj="{ownLoadBalancer1,ownLoadBalancer2,LBsubnet,vpcNameAry}" :svcData.sync='svc'></Service>
         <!-- Selectors中的workload选填 -->
					<div class="card">
						<h3 style="padding-bottom:20px;">Workload（{{$t('TKE.subList.xt')}}）</h3>
						<el-form-item label="Selectors">
							<div style="padding-bottom:10px;" v-for="(it,i) in svc.workload" :key="i">
								<el-input v-model="it.key" placeholder="key" class="w100"></el-input>=
								<el-input v-model="it.value" placeholder="value" class="w100"></el-input>
								<el-tooltip class="item" effect="dark" :content="$t('TKE.overview.sc')" placement="right">
									<i style="font-size:18px;padding-left:20px;" class="el-icon-close" @click="removework(it)"></i>
								</el-tooltip>
							</div>
							<div>
								<a href="javascript:;" @click="addwork()">添加</a> | 
                <a href="javascript:;" @click="dialogFormVisible = true">引用Workload</a>
                <!-- <span type="primary" @click="addwork()">添加</span> | <span type="primary" @click="dialogFormVisible = true">引用Workload</span> -->
							</div>
						</el-form-item>
					</div>
        </el-form>

        <!-- 底部 -->
        <div class="tke-formpanel-footer">
          <el-button size="small" type="primary" @click="submitSer('form')">{{$t('TKE.subList.cj')}}Service</el-button>
          <el-button size="small" @click="$router.go(-1)">取消</el-button>
        </div>
      </div>
    </div>
		<!-- 幕布层 -->
		<el-dialog class="dialog" :title="$t('TKE.subList.shdz')" :visible.sync="dialogFormVisible">
			 <!-- v-loading="dialogLoadShow" -->
      <el-form label-width="100px">
				<el-form-item :label="$t('TKE.event.zylx')">
					<el-radio-group v-model="svc.tabPosition" style="margin-left:70px;">
						<el-radio-button label="dep" @click.native="handleType('deployments')">Deploymemt</el-radio-button>
						<el-radio-button label="state" @click.native="handleType('statefulsets')">Statefulset</el-radio-button>
						<el-radio-button label="daem" @click.native="handleType('daemonsets')">Daemonset</el-radio-button>
					</el-radio-group>
				</el-form-item>
				<el-form-item v-loading="dialogLoadShow" :label="$t('TKE.overview.zylb')">
					<el-select v-model="svc.resourcesValue" :placeholder="resourcesList.length?'請選擇':'無可用資源'"
          :disabled="resourcesList.length?false:true" style="margin-left:70px;">
						<el-option
							v-for="item in resourcesList"
							:key="item.metadata.name"
							:label="item.metadata.name"
							:value="item.metadata.name">
						</el-option>
					</el-select>
					<div v-if="resourcesList.length?false:true" style="margin-left:70px;">{{$t('TKE.subList.wkyzy')}}<a href="">{{$t('TKE.subList.zykzt')}}</a>新建</div>
				</el-form-item>
				<el-form-item v-loading="dialogLoadShow" label="Labels">
					<div style="margin-left:70px;">
            <p v-if="resourcesList.length === 0">{{$t('TKE.subList.qxxz')}}Workload</p>
            <div v-else v-for="(v1, i1) in resourcesList" :key="i1">
              <!-- <p v-if="v1">1313</p> -->
              <p v-for="(item, key) in v1.metadata.labels" :key="key"
                v-if="svc.resourcesValue === v1.metadata.name">{{key}}: {{item}}</p>
            </div>
            <!-- <p v-else v-for="(item,key,i) in resourcesList[i].metadata.labels" :key="i">{{key}}:{{item}}</p> -->
          </div>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="handlerDet">{{$t('TKE.overview.qd')}}</el-button>
			</div>
		</el-dialog>
  </div>
</template>

<script>
import Loading from '@/components/public/Loading'
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
      dialogLoadShow:false,
      svc: {
        loadShow:false,
        show: false,
        time: 30,
        checked: false,
        name: '', // 新建的名称
        value: '', // 命名空间名称
        resourcesValue: '', // 幕布层资源列表选中的值
        loadBalance: '1', // 负载均衡
        // value: 'default',
        vpcId:'',//获取子网所用到的id值
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
        describe: '', // 描述
        inputValue1: '',
        inputValue2: '',
        workloadObj: {}
      },
      clusterId: '', // 集群id
      spaceName: '', // 命名空间的名称
      ownLoadBalancer1: [], // 已有负载均衡器
      ownLoadBalancer2:[],
      vpcNameAry: [], // vpcName的数据
      LBsubnet: [], // LB所在子网
      resourcesList: [], // 幕布层资源列表
      rules: {
        name: [// 对服务名称的校验
          {
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('名稱不能為空'))
              } else if (!(/^[a-z][a-z\d-]*$/.test(value))) {
                callback(new Error('名稱格式不正確'))
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
    Service,
    Loading
  },
  created () {
    // 从路由获取类型
    let { clusterId, nameSpaceName } = this.$route.query
    this.clusterId = clusterId
    this.spaceName = nameSpaceName    
    this.getInitData()    
  },
  methods: {
    async getInitData(){
      await this.GetSpaceValue()// 获取命名空间
      await this.getDescribeClusters()// 获取集群列表
      await this.getDescribeLoadBalancers()// 扫描均衡器
      await this.getDescribeSubnets()// 扫描子网
      await this.getDescribeVpcs()// 描述Vpcs
      await this.handleType('deployments')
    },
    // 获取集群列表
    async getDescribeClusters () {
      this.loadShow = true
      let params = {
        // ClusterIds: ["cls-a7rua9ae"]
        'ClusterIds.0': this.clusterId,
        Version: '2018-05-25'
      }
      await this.axios.post(TKE_COLONY_LIST, params).then(res => {
        if (res.Response.Error === undefined) {
          let msg = res.Response.Clusters
          msg.forEach(ele=>{
            this.svc.vpcId = ele.ClusterNetworkSettings.VpcId
          })
          // console.log(res)
          this.loadShow = false
        } else {
          this.loadShow = false
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
    // 扫描均衡器
    async getDescribeLoadBalancers () {
      this.loadShow = true
      let params = {
        Forward: 1,
        Limit: 100,
        Offset: 0,
        Version: '2018-03-17'
      }
      await this.axios.post(TKE_EDSCRIBELOADBALANCERS, params).then(res => {
        if (res.Response.Error === undefined) {
          let msg = res.Response.LoadBalancerSet
          msg.forEach(item=>{
            let {radio} = this.svc
            if(item.VipIsp=='BGP'){
              this.ownLoadBalancer1.push(item)
            }
            if(item.VipIsp=='INTERNAL'){
              this.ownLoadBalancer2.push(item)
            }
          })
          // this.svc.vpcId = msg[0].VpcId
          this.loadShow = false
        } else {
          this.loadShow = false
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
      this.loadShow = true
      let params = {
        'Filters.0.Name': 'vpc-id',
        'Filters.0.Values.0': this.svc.vpcId,
        Limit: 100,
        Offset: 0,
        Version: '2017-03-12'
      }
      await this.axios.post(TKE_WORKER_METWORK, params).then(res => {
        if (res.Response.Error === undefined) {
          let msg = res.Response.SubnetSet
          this.LBsubnet = msg
          this.svc.LBvalue2 = msg[0].SubnetId
          this.loadShow = false
        } else {
          this.loadShow = false
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
      this.loadShow = true
      let params = {
        Limit: 100,
        Offset: 0,
        Version: '2017-03-12',
        'VpcIds.0': this.svc.vpcId
        // VpcIds: ["vpc-apm60zou"]
      }
      await this.axios.post(TKE_VPC_METWORK, params).then(res => {
        if (res.Response.Error === undefined) {
          let msg = res.Response.VpcSet
          this.vpcNameAry = msg
          this.svc.LBvalue1 = msg[0].VpcId
          // console.log(res.Response.VpcSet)
          this.loadShow = false
        } else {
          this.loadShow = false
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
    // 获取命名空间请求(腾讯云传参)
    // Path: `/apis/apps/v1beta2/namespaces/${this.spaceName}/deployments`,
    // 获取命名空间
    GetSpaceValue () {
      this.loadShow = true
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
          this.loadShow = false
        } else {
          this.loadShow = false
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
    async handleType (val) {
      this.dialogLoadShow = true
      let params = {
        ClusterName: this.clusterId,
        Method: 'GET',
        Path: `/apis/apps/v1beta2/namespaces/${this.spaceName}/${val}`,
        Version: '2018-05-25'
      }
      await this.axios.post(POINT_REQUEST, params).then(res => {
        if (res.Response.Error === undefined) {
          let msg = JSON.parse(res.Response.ResponseBody).items
          this.resourcesList = msg
          // console.log(msg)
          if (msg.length > 0) {
            this.svc.resourcesValue = msg[0].metadata.name
          } else {
            this.svc.resourcesValue = ''
          }
          // this.svc.resourcesValue = msg.length > 0 && msg[0].metadata.name
          this.dialogLoadShow = false
        } else {
          this.dialogLoadShow = false
          let ErrTips = {}
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
    // 验证新建按钮
    submitSer (form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.submitFound()
        } else {
          return false
        }
      })
    },
    // 新建服务
    async submitFound () {
      let { name, describe, checked, radio, list, value, time, ETP, SA, loadBalance, balancerValue, workload, workloadObj } = this.svc
      let newPortAry = []
      list.forEach(ele => { // 端口映射参数
        let ports = {
          name: `${ele.input1}-${ele.input2}-${ele.protocol.toLowerCase()}`,
          port: Number(ele.input2),
          targetPort: Number(ele.input1),
          protocol: ele.protocol
        }
        if (this.svc.radio === '4') {
          ports.nodePort = Number(ele.input3)
        }
        newPortAry.push(ports)
      })
      let policy = 'Cluster'// 高级选项参数
      if (ETP === '2') {
        policy = 'Local'
      }
      let session = 'None'
      let sessionTime = {}
      if (SA === '1') { // 高级选项参数
        session = 'ClientIP'
        sessionTime = { 'clientIP': { 'timeoutSeconds': Number(time) } }
      }
      let specType = ''
      if (radio == '1' || radio == '3') { // 访问方式type的判断
        specType = 'LoadBalancer'
      } else if (radio == '2') {
        specType = 'ClusterIP'
      } else {
        specType = 'NodePort'
      }
      let reqBody = {// 传递的reqbody整体参数
        'kind': 'Service',
        'apiVersion': 'v1',
        'metadata': { 'name': name,
          'namespace': value,
          'annotations': {
            'service.kubernetes.io/service.extensiveParameters': '{"AddressIPVersion":"IPV4"}'
          } },
        'spec': {
          'type': specType,
          'ports': newPortAry,
          // 'externalTrafficPolicy': policy,
          'sessionAffinity': session } }
      if (radio == '2' || radio == '3' || radio == '4') reqBody.metadata.annotations = {}
      if (session == 'ClientIP') reqBody.spec.sessionAffinityConfig = sessionTime// 会话时间
      if (describe) reqBody.metadata.annotations.description = describe// 是否有描述
      // 是否选中 使用已有
      if (loadBalance == '2') reqBody.metadata.annotations['service.kubernetes.io/tke-existed-lbid'] = balancerValue
      if (radio == '3') { // 服务访问方式 第3个需要的参数
        reqBody.metadata.annotations['service.kubernetes.io/qcloud-loadbalancer-clusterid'] = this.clusterId
        reqBody.metadata.annotations['service.kubernetes.io/qcloud-loadbalancer-internal-subnetid'] = this.svc.LBvalue2
      }
      // 高级设置第一项的判断
      if (radio !== '2') { reqBody.spec.externalTrafficPolicy = policy }
      if (radio == '2' && !describe) { // 服务访问方式 第2个需要的参数
        reqBody = {
          'kind': 'Service',
          'apiVersion': 'v1',
          'metadata': { 'name': name, 'namespace': value },
          'spec': { 'ports': newPortAry, 'sessionAffinity': session } }
        // 'type': 'ClusterIP',
      }
      if (checked) {
        reqBody.spec.clusterIP = 'None'
      }
      if (radio == '4' && !describe) { // 服务访问方式 第4个需要的参数
        reqBody = {
          'kind': 'Service',
          'apiVersion': 'v1',
          'metadata': { 'name': name, 'namespace': value },
          'spec': {
            'type': 'NodePort',
            'ports': newPortAry,
            'externalTrafficPolicy': policy,
            'sessionAffinity': session
          }
        }
      }
      if (workload.length > 0) reqBody.spec.selector = workloadObj// Workload（选填）
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
          // console.log(res)
          this.$router.push({
            path: '/colony/sub/detail/service/svc/event',
            query: {
              clusterId: this.clusterId,
              spaceName: this.svc.value,
              serviceName: this.svc.name
            }
          })
          this.$message({
            message: '新建成功',
            type: 'success',
            duration: 0,
            showClose: true
          })
        } else {
          this.loadShow = false
          let ErrTips = {}
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
    // 处理幕布层确定按钮的事件
    handlerDet () {
      this.dialogFormVisible = false
      let ary = this.resourcesList.filter(item => {
        return item.metadata.name === this.svc.resourcesValue
      })
      let obj = ary.length && ary[0].metadata.labels
      this.svc.workload = []
      if (ary.length) {
        for (let k in obj) {
          this.svc.workload.push({ value: obj[k], key: k })
        }
      }
      this.handlerReqWorkload()
    },
    // 处理新建workload要传递的参数对象
    handlerReqWorkload () {
      this.svc.workload.forEach(item => {
        let obj = {}
        let key = item.key
        let value = item.value
        obj[key] = value
        this.svc.workloadObj = Object.assign(this.svc.workloadObj, obj)
      })
      // console.log(this.svc.workloadObj)
    },
    handleClose (done) {
      this.$confirm('確認關閉？')
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
        key: ''
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
.dialog ::v-deep .el-loading-spinner .circular {
    width: 30px;
    height: 30px;
    margin-top: 10px;
  }
</style>

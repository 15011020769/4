 <!-- 新建Service -->
<template>
  <div class="colony-wrap">
    <div class="tke-content-header">
      <div class="tke-grid">
        <!-- 左侧 -->
        <div class="grid-left">
          <span class="goback" @click="goBack">
            <i class="el-icon-back"></i>
          </span>
          <h2 class="header-title">更新访问方式</h2>
        </div>
        <!-- 右侧 -->
        <div class="grid-right"></div>
      </div>
    </div>
    <div class="colony-main">
      <div class="tke-card tke-formpanel-wrap mb60">
        <el-form class="tke-form" :model="svc" label-position="left" label-width="120px" size="mini">
          <el-form-item label="服务访问方式">
            <el-radio v-model="svc.radio" label="1">提供公网访问</el-radio>
            <el-radio v-model="svc.radio" label="2">仅在集群内访问</el-radio>
            <el-radio v-model="svc.radio" label="3">VPC内网访问</el-radio>
            <el-radio v-model="svc.radio" label="4">主机端口访问</el-radio>
            <a href="javascript:;" style="padding-left:10px;">如何选择</a>
            <i class="el-icon-edit-outline"></i>
            <!-- 方式介绍 -->
            <div>
              <div v-if="svc.radio=='1'">
                <div>
                  自动创建公网CLB（
                  <span class="text-warning">0.02元/小时</span>）以提供Internet访问入口，支持TCP/UDP协议，如web前台类服务可以选择公网访问。
                </div>
                <div>
                  如您需要公网通过HTTP/HTTPS协议或根据URL转发，您可以在Ingress页面使用Ingress进行路由转发，
                  <a href>查看详情</a>
                  <i class="el-icon-edit-outline"></i>
                </div>
              </div>
              <div v-if="svc.radio=='2'">
                <div>将提供一个可以被集群内其他服务或容器访问的入口，支持TCP/UDP协议，数据库类服务如Mysql可以选择集群内访问,来保证服务网络隔离性。</div>
                <div>
                  <el-checkbox v-model="svc.checked">Headless&nbsp;Service</el-checkbox>
                  <el-tooltip
                    content="不创建用于集群内访问的ClusterIP,访问Service名称时返回后端Pods IP地址,用于适配自有的服务发现机制。"
                    placement="top"
                    effect="light"
                  >
                    <i class="el-icon-question" style="margin-left:5px;"></i>
                  </el-tooltip>（Headless&nbsp;Service只支持创建时选择，
                  <span class="text-error">创建完成后不支持变更访问方式）</span>
                </div>
              </div>
              <div v-if="svc.radio=='3'">
                <div>将提供一个可以被集群所在VPC下的其他资源访问的入口，支持TCP/UDP协议，需要被同一VPC下其他集群、云服务器等访问的服务可以选择VPC内网访问的形式。</div>
                <div>
                  支持Ingress
                  <a href>查看详情</a>
                  <i class="el-icon-edit-outline"></i>
                </div>
              </div>
              <div v-if="svc.radio=='4'">
                <div>提供一个主机端口映射到容器的访问方式，支持TCP&UDP， 可用于业务定制上层LB转发到Node。</div>
                <div>
                  支持Ingress
                  <a href>查看详情</a>
                  <i class="el-icon-edit-outline"></i>
                </div>
              </div>
            </div>
          </el-form-item>

          <el-form-item v-if="svc.radio=='3'" label="LB所在子网">
			      <el-select v-model="svc.LBvalue1" placeholder="请选择" disabled>
			      	<el-option
			      		v-for="item in vpcNameAry"
			      		:key="item.VpcName"
			      		:label="item.VpcName"
			      		:value="item.VpcName">
			      	</el-option>
			      </el-select>
			      <el-select v-model="svc.LBvalue2" placeholder="请选择">
			      	<el-option
			      		v-for="item in LBsubnet"
			      		:key="item.SubnetName"
			      		:label="item.SubnetName"
			      		:value="item.SubnetName">
			      	</el-option>
			      </el-select>
			      <el-button style="border:none;"><i class="el-icon-refresh"></i></el-button>
			      共<span>{{addressCount.TotalIpAddressCount}}</span>个子网点，剩下<span>{{addressCount.AvailableIpAddressCount}}}</span>个可用
		      </el-form-item>

          <el-form-item label="负载均衡器" v-if="svc.radio=='3' || svc.radio=='1'">
            <div class="radio1">
              <el-radio-group v-model="svc.loadBalance" style="margin-bottom: 5px;">
                <el-radio-button label="1">自动创建</el-radio-button>
                <el-radio-button label="2">使用已有</el-radio-button>
              </el-radio-group>
            </div>
            <p v-show="svc.loadBalance=='1'">
              自动创建CLB用于公网/内网访问Service，请勿手动修改由TKE创建的CLB监听器，
              <a href="">查看更多说明</a>
            </p>
            <div v-show="svc.loadBalance=='2'">
              使用已有的CLB用于公网/内网访问Service，不覆盖已有监听器规则，请勿手动修改由TKE创建的CLB监听器，仅支持未被容器服务TKE使用的CLB
              <a href="">查看更多说明</a>
              <p>
                <el-select v-model="svc.value" placeholder="请选择">
				        	<el-option
				        		v-for="item in ownLoadBalancer"
				        		:key="item.LoadBalancerId"
				        		:label="item.LoadBalancerId+'  ('+item.LoadBalancerName+')'"
				        		:value="item.LoadBalancerId+'  ('+item.LoadBalancerName+')'">
				        	</el-option>
				        </el-select>
              </p>
            </div>
          </el-form-item>
          <el-form-item label="端口映射">
            <div class="port">
              <!-- 头部 -->
              <div class="flex">
                <div style="width:140px;padding-left:14px">
                  协议
                  <el-tooltip content="使用公网/内网负载均衡时，TCP和UDP协议不能混合使用" placement="top" effect="light">
                    <i class="el-icon-warning"></i>
                  </el-tooltip>
                </div>
                <div style="width:250px;">
                  容器端口
                  <el-tooltip content="端口范围1~65535" placement="top" effect="light">
                    <i class="el-icon-warning"></i>
                  </el-tooltip>
                </div>
                <div>
                  服务端口
                  <el-tooltip
                    content="集群外通过负载均衡域名或IP+服务端口访问服务，集群内通过服务名+服务端口访问服务"
                    placement="top"
                    effect="light"
                  >
                    <i class="el-icon-warning"></i>
                  </el-tooltip>
                </div>
              </div>
              <!-- 内容 -->
              <div style="border-top:1px solid #ddd;padding: 10px;">
                <div style="padding:5px 0;" v-for="it in svc.list" :key="it.key">
									<!-- 下拉框协议 -->
                  <el-select class="w100" v-model="svc.protocol" placeholder="请选择">
										<el-option
                      v-for="item in svc.options"
                      :key="item"
                      :label="item"
                      :value="item"
                    ></el-option>
                    <!-- <el-option
                      v-for="item in svc.options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option> -->
                  </el-select>
									<!-- 容器器端口 -->
                  <el-input class="w250" style="padding-left:30px;" v-model="svc.input1" placeholder="请输入内容"></el-input>
									<!-- 服务端口 -->
                  <el-input class="w250" style="padding-left:30px;" v-model="svc.input2" placeholder="请输入内容"></el-input>
									<!-- 关闭按钮 -->
                  <el-tooltip class="item" effect="dark" content="删除" placement="right">
                    <i
                      style="font-size:18px;padding-left:20px;"
                      class="el-icon-close"
                      @click="removeprot(it)"
                    ></i>
                  </el-tooltip>
                </div>
              </div>
            </div>
            <a href="javascript:;" @click="addport()">添加端口映射</a>
          </el-form-item>
          <!-- 高级设置 -->
          <div v-if="svc.show">
            <h3 style="padding-bottom:10px;">高级设置（选填）</h3>
            <el-form-item label-width="150px" label="ExtermalTrafficPolicy">
              <el-radio v-model="svc.ETP" label="1">Cluster</el-radio>
              <el-radio v-model="svc.ETP" label="2">Local</el-radio>
              <div v-if="svc.ETP=='1'">默认均衡转发到工作负载的所有Pod</div>
              <div v-if="svc.ETP=='2'">
                能够保留来源IP，并可以保证公网、VPC内网访问（LoadBalancer）和主机端口访问（NodePort）模式下流量仅在本节点转发。Local转发使部分没有业务Pod存在的节点健康检查失败，可能存在流量不均衡的转发的风险。
              </div>
            </el-form-item>
            <div>
              <el-form-item label-width="150px" label="Session Affinity">
                <el-radio v-model="svc.SA" label="1">ClienIP</el-radio>
                <el-radio v-model="svc.SA" label="2">None</el-radio>
              </el-form-item>
              <div v-if="svc.SA=='1'">
                <el-form-item prop="time" :rules="timeRules" label-width="150px" label="最大会话保持时间">
                  <el-input v-model="svc.time" class="w200"></el-input>
                  <div>会话保持时间范围为0~86400</div>
                </el-form-item>
              </div>
            </div>
          </div>
          <div v-if="!svc.show">
            <a href="javascript:;" @click="show()">显示高级设置</a>
          </div>
          <div v-if="svc.show">
            <a href="javascript:;" @click="show()">隐藏高级设置</a>
          </div>
        </el-form>

        <!-- 底部 -->
        <div class="tke-formpanel-footer">
          <el-button size="small" type="primary" @click="updateAccessMode()">更新访问方式</el-button>
          <el-button size="small">取消</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import Service from './components/Service'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import { ALL_CITY, POINT_REQUEST, TKE_COLONY_LIST, TKE_EDSCRIBELOADBALANCERS, TKE_VPC_METWORK, TKE_WORKER_METWORK } from '@/constants'
import { ErrorTips } from '@/components/ErrorTips'
export default {
  name: 'svcCreate',
  data () {
    return {
      dialogFormVisible: false,
      svc: {
        show: true,
        time: 30,
        checked: false, // 仅在集群内访问的多选框
        name: '',
        loadBalance: '1', // 负载平衡选项
        value: '', // 使用已有均衡器
        LBvalue2: '', // LB所在子网
        LBvalue1: '', // LB所在子网
        // options: ['default', 'kube-public', 'kube-system', 'tfy-pub'],
        options: ['TCP', 'UDP'],
        radio: '1', // 服务访问方式
        protocol: '', // 协议
        ETP: '1',
        SA: '2',
        input1: '', // 容器端口
        input2: '', // 服务端口
        list: [{}],
        workload: [],
        tabPosition: 'dep'
      },
      clusterId: '', // 集群id
      spaceName: '', // 命名空间的名称
      serviceName: '', // 服务的名称
      describeClustersList: [], // 描述聚群
      ownLoadBalancer: [], // 已有负载均衡器
      LBsubnet: [], // LB所在子网
      vpcNameAry: [], // vpcName的数据
      addressCount: {}, // LB中的子网点对象
      serviceInfo: {}, // 服务详情信息
      timeRules: [{
        validator: (rule, value, callback) => {
          let reg = /^\d+\.\d+$/
          if (value > 0 && value < 68400) {
            callback()
          } else if (!value) {
            callback(new Error('会话保持时间不能为空'))
          } else if (value < 0 && value > 68400) {
            callback(new Error('不在会话保持时间范围'))
          } else if (!reg.test(value)) {
            callback(new Error('会话保持时间格式错误'))
          } else {
            callback(new Error('会话保持时间格式错误'))
          }
        },
        trigger: 'blur',
        required: true
      }]
    }
  },
  components: {
    // Service
  },
  watch: {
    'svc.LBvalue2': function (val) {
      this.addressCount = this.LBsubnet.find(item => {
        return item.SubnetName === val
      })
    }
  },
  created () {
    // 从路由获取类型
    let { clusterId, spaceName, serviceName } = this.$route.query
    this.clusterId = clusterId
    this.spaceName = spaceName
    this.serviceName = serviceName
    this.getDescribeClusters()// 获取集群列表
    this.getDescribeLoadBalancers()// 扫描均衡器
    this.getDescribeVpcs()// 描述Vpcs
    this.getDescribeSubnets()// 扫描子网
    this.getInfo()// 获取服务详情信息
  },
  methods: {
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
        // console.log(1111111, res)
        if (res.Response.Error === undefined) {
          this.LBsubnet = res.Response.SubnetSet
          this.svc.LBvalue2 = res.Response.SubnetSet[0].SubnetName
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
    // 扫描vpcs
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
          // console.log(res)
          this.vpcNameAry = res.Response.VpcSet
          this.svc.LBvalue1 = res.Response.VpcSet[0].VpcName
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
          let msg = res.Response.LoadBalancerSet
          this.ownLoadBalancer = msg
          this.svc.value = msg[0].LoadBalancerId + '  (' + msg[0].LoadBalancerName + ')'
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
    // 获取集群列表
    async getDescribeClusters () {
      let params = {
        'ClusterIds.0': this.clusterId,
        Version: '2018-05-25'
      }
      await this.axios.post(TKE_COLONY_LIST, params).then(res => {
        if (res.Response.Error === undefined) {
          this.describeClustersList = res.Response.Clusters
          // console.log(this.describeClustersList)
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
    // 更新访问方式按钮的提交
    async updateAccessMode () {
      // RequestBody:"{"metadata":{"annotations":{"service.kubernetes.io/loadbalance-id":"lb-65hfh43a","service.kubernetes.io/service.extensiveParameters":"{\"AddressIPVersion\":\"IPV4\"}"}},"spec":{"type":"LoadBalancer","ports":[{"name":"12-12-tcp","nodePort":31922,"port":12,"targetPort":12,"protocol":"TCP"}],"externalTrafficPolicy":"Cluster","sessionAffinity":"None"}}",
      let jsonStr = JSON.stringify({ 'metadata': { 'annotations': { 'service.kubernetes.io/loadbalance-id': 'lb-65hfh43a', 'service.kubernetes.io/service.extensiveParameters': '{"AddressIPVersion":"IPV4"}' } }, 'spec': { 'type': 'LoadBalancer', 'ports': [{ 'name': '12-12-tcp', 'nodePort': 31922, 'port': 12, 'targetPort': 12, 'protocol': 'TCP' }], 'externalTrafficPolicy': 'Cluster', 'sessionAffinity': 'None' } })
      let param = {
        ContentType: 'application/merge-patch+json',
        Method: 'PATCH',
        Path: `/api/v1/namespaces/${this.spaceName}/services/${this.serviceName}`,
        RequestBody: jsonStr,
        Version: '2018-05-25',
        ClusterName: this.clusterId
      }
      await this.axios.post(POINT_REQUEST, param).then(res => {
        if (res.Response.Error === undefined) {
          // console.log(res, 13213)
          // let response = JSON.parse(res.Response.ResponseBody)
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
    // 获取服务详情
    async getInfo () {
      this.loadShow = true
      let params = {
        ClusterName: 'cls-a7rua9ae',
        Method: 'GET',
        Path: `/api/v1/namespaces/${this.spaceName}/services/${this.serviceName}`,
        Version: '2018-05-25'
      }
      await this.axios.post(POINT_REQUEST, params).then(res => {
        if (res.Response.Error === undefined) {
          // console.log(JSON.parse(res.Response.ResponseBody))
          let msg = JSON.parse(res.Response.ResponseBody)
          this.serviceInfo = msg
          let { protocol, port, targetPort } = msg.spec.ports[0]
          this.svc.protocol = protocol
          this.svc.input1 = port
          this.svc.input2 = targetPort
          this.loadShow = false
        } else {
          this.loadShow = false
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
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => { })
    },
    // 删除work
    removework (item) {
      var index = this.svc.workload.indexOf(item)
      if (index !== -1) {
        this.svc.workload.splice(index, 1)
      }
    },
    // 删除端口
    removeprot (item) {
    	var index = this.svc.list.indexOf(item)
    	if (index !== -1) {
    		this.svc.list.splice(index, 1)
    	}
    },
    // 新增work
    addwork () {
      this.svc.workload.push({
        value: '',
        key: Date.now()
      })
    },
    // 新增端口
    addport () {
    	this.svc.list.push({
    		value: '',
    		key: Date.now()
    	})
    },
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
  width: 100%;
  height: 900px;
  opacity: 0.6;
  background: black;
}
.w250 {
  width: 250px;
}
.w100 {
  width: 100px;
}
.flex {
  display: flex;
}
.port {
  max-width: 680px;
  border: 1px solid #ddd;
}
.card {
  padding: 10px;
  border-bottom: 1px solid #dcdfe6;
}
.text-error {
  color: #e54545;
}
.text-warning {
  color: #ff9d00;
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

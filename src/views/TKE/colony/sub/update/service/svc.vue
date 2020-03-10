 <!-- 新建Service -->
<template>
  <div class="colony-wrap" v-loading="loadShow">
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
            <el-radio :disabled="serviceName.includes('headless')?true:false" v-model="svc.radio" label="1">提供公网访问</el-radio>
            <el-radio :disabled="serviceName.includes('headless')?true:false" v-model="svc.radio" label="2">仅在集群内访问</el-radio>
            <el-radio :disabled="serviceName.includes('headless')?true:false" v-model="svc.radio" label="3">VPC内网访问</el-radio>
            <el-radio :disabled="serviceName.includes('headless')?true:false" v-model="svc.radio" label="4">主机端口访问</el-radio>
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
                  <el-checkbox v-model="svc.checked" disabled>Headless&nbsp;Service</el-checkbox>
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
			      <el-select v-model="svc.LBvalue1" :placeholder="svc.LBvalue1" disabled>
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
			      共<span>{{addressCount.TotalIpAddressCount}}</span>个子网点，剩下<span>{{addressCount.AvailableIpAddressCount}}</span>个可用
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
				        		:value="item.LoadBalancerId">
				        	</el-option>
				        </el-select>
              </p>
            </div>
          </el-form-item>
          <el-form-item label="端口映射">
            <div class="port" :class="{ports:svc.radio=='4'}">
              <!-- 头部 -->
              <div class="flex">
                <div style="width:140px;padding-left:14px">
                  协议
                  <el-tooltip content="使用公网/内网负载均衡时，TCP和UDP协议不能混合使用" placement="top" effect="light">
                    <i class="el-icon-warning"></i>
                  </el-tooltip>
                </div>
                <div :class="{titles:svc.radio=='4'}" :style="svc.radio=='4'?'width:204px':'width:250px;'">
                  容器端口
                  <el-tooltip content="端口范围1~65535" placement="top" effect="light">
                    <i class="el-icon-warning"></i>
                  </el-tooltip>
                </div>
                <div :class="{titles:svc.radio=='4'}" :style="svc.radio=='4'?'width:204px':'width:250px;'" v-if="svc.radio=='4'">
                  主机端口
						      <el-tooltip content="可通过云服务器IP+主机端口访问服务，端口范围30000~32767，不填自动分配" placement="top" effect="light">
						      <i class="el-icon-warning"></i>
						      </el-tooltip>
					      </div>
                <div :class="{titles:svc.radio=='4'}" :style="svc.radio=='4'?'':'padding-left:30px'">
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
                <div style="padding:5px 0;" v-for="(it,i) in svc.list" :key="i">
									<!-- 下拉框协议 -->
                  <el-form-item style="display: inline-block" :prop="`list.${i}.protocol`" :rules="ProtocolValidation">
                    <el-select class="w100" v-model="it.protocol" placeholder="请选择">
									  	<el-option v-for="item in svc.options" :key="item" :label="item" :value="item"></el-option>
                    </el-select>
                  </el-form-item>
									<!-- 容器端口 -->
                  <el-form-item :prop="`list.${i}.port`" :rules="verifyPort1" class="w250" :class="{cons:svc.radio=='4'}"
                   style="display: inline-block;padding-left:30px;">
                    <el-input v-model="it.port" placeholder="请输入内容"></el-input>
									</el-form-item>
                  <!-- 主机端口 -->
                  <el-form-item :class="{cons:svc.radio=='4'}" v-if="svc.radio=='4'"
						      style="display: inline-block;padding-left:30px;"  :prop="`list.${i}.nodePort`" :rules="verifyPort3">
						        <el-input class="w250" v-model="it.nodePort" placeholder="范围: 30000~32767"></el-input>
						      </el-form-item>
                  <!-- 服务端口 -->
                  <el-form-item :prop="`list.${i}.targetPort`" :rules="verifyPort2" class="w250"
                   :class="{cons:svc.radio=='4'}" style="display: inline-block;padding-left:30px;">
                    <el-input v-model="it.targetPort" placeholder="请输入内容"></el-input>
									</el-form-item>
                  <!-- 关闭按钮 -->
                  <el-tooltip class="item" effect="dark" content="不可删除，至少指定一个端口映射" placement="left" v-if="svc.list.length===1">
                    <i
                      style="font-size:18px;padding-left:20px;"
                      :style="svc.radio=='4'?'padding-left:40px;':'padding-left:20px;'"
                      class="el-icon-close"
                    ></i>
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" content="删除" placement="right" v-else>
                    <i
                      style="font-size:18px;padding-left:20px;"
                      :style="svc.radio=='4'?'padding-left:40px;':'padding-left:20px;'"
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
            <el-form-item label-width="150px" label="ExtermalTrafficPolicy" v-if="svc.radio!=='2'">
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
import Loading from '@/components/public/Loading'
import { ALL_CITY, POINT_REQUEST, TKE_COLONY_LIST, TKE_EDSCRIBELOADBALANCERS, TKE_VPC_METWORK, TKE_WORKER_METWORK } from '@/constants'
import { ErrorTips } from '@/components/ErrorTips'
export default {
  name: 'svcCreate',
  data () {
    return {
      loadShow: false, // 加载是否显示
      dialogFormVisible: false,
      svc: {
        show: false,
        time: 30, // 会话时间
        checked: false, // 仅在集群内访问的多选框
        name: '',
        loadBalance: '', // 负载平衡选项
        val: '', // 自有创建的id
        value: '', // 使用已有均衡器
        LBvalue2: '', // LB所在子网
        LBvalue1: '', // LB所在子网
        // options: ['default', 'kube-public', 'kube-system', 'tfy-pub'],
        options: ['TCP', 'UDP'],
        radio: '', // 服务访问方式
        protocol: '', // 协议
        ETP: '1',
        SA: '2',
        input1: '', // 容器端口
        input2: '', // 服务端口
        input3: '', // 主机端口
        list: [],
        workload: [],
        tabPosition: 'dep',
        vpcIds: '',
        subnetId: '',
        describe: ''// 描述
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
      // vpcId: [], // (2)中vpcids数据
      subnetAry: [], // 子网数组
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
      }],
      // 端口映射的验证
      verifyPort1: [// 容器端口的验证
        { validator: (rule, value, callback) => {
          let ls = this.svc.list
          let flog = false
          if (ls.length > 1) {
            for (let i = 0; i < ls.length - 1; i++) {
              ls[i].port === Number(value) ? flog = true : flog = false
            }
          }
          let portNumber = /^([1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]{1}|6553[0-5])$/
          if (!value) {
            callback(new Error('端口号不能为空'))
          } else if (!portNumber.test(value)) {
            callback(new Error('端口号格式不正确'))
          } else if (flog) {
            callback(new Error('端口不可重复映射'))
          } else {
            callback()
          }
        },
        trigger: 'blur',
        required: true }
      ],
      verifyPort2: [// 服务端口的验证
        { validator: (rule, value, callback) => {
          let ls = this.svc.list
          let flog = false
          if (ls.length > 1) {
            for (let i = 0; i < ls.length - 1; i++) {
              ls[i].targetPort === Number(value) ? flog = true : flog = false
            }
          }
          let portNumber = /^([1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]{1}|6553[0-5])$/
          if (!value) {
            callback(new Error('端口号不能为空'))
          } else if (!portNumber.test(value)) {
            callback(new Error('端口号格式不正确'))
          } else if (flog) {
            callback(new Error('端口不可重复映射'))
          } else {
            callback()
          }
        },
        trigger: 'blur',
        required: true }
      ],
      verifyPort3: [{// 主机端口的验证
        validator: (rule, value, callback) => {
          let ls = this.svc.list
          let flog = false
          if (ls.length > 1) {
            for (let i = 0; i < ls.length - 1; i++) {
              ls[i].nodePort === Number(value) ? flog = true : flog = false
            }
          }
          if (flog) {
            callback(new Error('端口不可重复映射'))
          }
          if (value > 30000 && value <= 32767) {
            callback()
          } else if (!value) {
            callback(new Error('端口号不能为空'))
          } else if (value < 0 && value > 32767) {
            callback(new Error('超出端口号范围'))
          } else if (!(/^\d+$/.test(value))) {
            callback(new Error('端口号格式不正确'))
          } else {
            callback(new Error('端口格式不正确'))
          }
        },
        trigger: 'blur',
        required: true
      }],
      ProtocolValidation: [// 协议的验证
        { validator: (rule, value, callback) => {
          let ls = this.svc.list
          let flog = false
          if (ls.length > 1) {
            for (let i = 0; i < ls.length - 1; i++) {
              ls[i].protocol === value ? flog = true : flog = false
            }
          }
          if (!flog) {
            callback(new Error('协议必须一致'))
          }
        },
        trigger: 'change',
        required: true }
      ]
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
    this.initRequery()
  },
  methods: {
    initRequery: async function () {
      await this.getInfo()// 获取服务详情信息
      await this.getDescribeClusters()// 获取集群列表
      await this.getDescribeLoadBalancers()// 扫描均衡器
      await this.getDescribeVpcs()// 描述Vpcs
      await this.getDescribeSubnets()// 扫描子网
    },
    // 获取集群列表(1)
    async getDescribeClusters () {
      this.loadShow = true
      let params = {
        'ClusterIds.0': this.clusterId,
        Version: '2018-05-25'
      }
      await this.axios.post(TKE_COLONY_LIST, params).then(res => {
        if (res.Response.Error === undefined) {
          let msg = res.Response.Clusters
          this.describeClustersList = msg
          this.svc.vpcIds = msg[0].ClusterNetworkSettings.VpcId
          // this.vpcId = msg
          // console.log(msg)
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
    // 扫描均衡器(2)
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
          this.ownLoadBalancer = msg
          // this.svc.value = msg[0].LoadBalancerId + '  (' + msg[0].LoadBalancerName + ')'
          // this.vpcId = this.vpcId.push(msg[0].VpcId)
          // msg.forEach(ele => {
          //   if (this.svc.value === ele.LoadBalancerId) {
          //     this.svc.loadBalance = '2'
          //   } else {
          //     this.svc.loadBalance = '1'
          //     // this.svc.value = ''
          //   }
          // })
          // console.log(msg)
          // console.log(this.ownLoadBalancer)
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
    // 扫描vpcs(3)
    async getDescribeVpcs () {
      this.loadShow = true
      let params = {
        Limit: 100,
        Offset: 0,
        Version: '2017-03-12'
        // 'VpcIds.0': this.svc.vpcIds
        // 'VpcIds.0': this.vpcId[0]
      }
      params['VpcIds.0'] = this.svc.vpcIds
      await this.axios.post(TKE_VPC_METWORK, params).then(res => {
        if (res.Response.Error === undefined) {
          let msg = res.Response.VpcSet
          this.vpcNameAry = msg
          if (this.svc.radio !== '3') {
            this.svc.LBvalue1 = res.Response.VpcSet[0].VpcName
          }
          msg.forEach(ele => {
            if (ele.VpcId == this.svc.vpcIds) {
              this.svc.LBvalue1 = ele.VpcName
            }
          })
          // console.log(msg)
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
    // 扫描子网(4)
    async getDescribeSubnets () {
      this.loadShow = true
      let params = {
        // Filters: [{ Name: 'vpc-id', Values: ['vpc-apm60zou'] }],
        // 'Filters.0.Name': 'vpc-id',
        // 'Filters.0.Values.0': this.svc.vpcIds,
        Limit: 100,
        Offset: 0,
        Version: '2017-03-12'
      }
      // params['Filters.0.Name'] = 'vpc-id'
      params['Filters.0.Name'] = 'vpc-id'
      // params['Filters.0.Values.0'] = this.svc.vpcIds
      params['Filters.0.Values.0'] = this.svc.vpcIds

      await this.axios.post(TKE_WORKER_METWORK, params).then(res => {
        // console.log(1111111, res)
        if (res.Response.Error === undefined) {
          let msg = res.Response.SubnetSet
          this.LBsubnet = msg
          // console.log(msg)
          if (this.svc.radio !== '3') {
            this.svc.LBvalue2 = res.Response.SubnetSet[0].SubnetName
          }
          this.loadShow = false
          msg.forEach(ele => {
            if (ele.SubnetId == this.svc.subnetId) {
              this.svc.LBvalue2 = ele.SubnetName
              // this.svc.subnetId = ele.SubnetId
            }
          })
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

    // 更新访问方式按钮的提交
    async updateAccessMode () {
      let { list, ETP, SA, time, val, value, radio, loadBalance, describe } = this.svc
      let newPortAry = []// 更改时的 端口映射数组
      list.forEach(ele => { // 端口映射传参的判断
        let ports = {
          name: `${ele.port}-${ele.targetPort}-${ele.protocol.toLowerCase()}`,
          port: Number(ele.port),
          targetPort: Number(ele.targetPort),
          // nodePort: ele.nodePort ? Number(ele.nodePort) : null,
          protocol: ele.protocol
        }
        if (ele.nodePort && radio !== '2') {
          ports.nodePort = Number(ele.nodePort)
        }
        newPortAry.push(ports)
      })
      let specType = ''
      if (radio == '1' || radio == '3') { // 访问方式type的判断
        specType = 'LoadBalancer'
      } else if (radio == '2') {
        specType = 'ClusterIP'
      } else {
        specType = 'NodePort'
      }
      // if(radio =='1')
      let policy = ''
      if (ETP === '2') { // 高级选项ExtermalTrafficPolicy判断
        policy = 'Local'
      } else {
        policy = 'Cluster'
      }
      let session = ''
      let sessionTime = {}
      if (SA === '1') { // 高级选项Session Affinity判断
        session = 'ClientIP'
        sessionTime = { 'clientIP': { 'timeoutSeconds': Number(time) } }
      } else {
        session = 'None'
      }
      let jsonStr = { 'metadata': {// 要传递的RequestBody参数
        'annotations': {
          // 'description': this.serviceName,
          'service.kubernetes.io/loadbalance-id': val || ''
          // 'service.kubernetes.io/service.extensiveParameters': '{"AddressIPVersion":"IPV4"}'
        } },
      'spec': { 'type': specType,
        'ports': newPortAry,
        // 'externalTrafficPolicy': policy
        'sessionAffinity': session
      } }
      // 是否有描述
      if (describe) jsonStr.metadata.annotations.description = describe
      // 会话时间的参数判断
      if (session == 'ClientIP') jsonStr.spec.sessionAffinityConfig = sessionTime
      // 访问方式1参数
      if (radio === '1' && loadBalance === '1') {
        jsonStr.metadata.annotations['service.kubernetes.io/service.extensiveParameters'] = '{"AddressIPVersion":"IPV4"}'
        jsonStr.metadata.annotations['service.kubernetes.io/qcloud-loadbalancer-internal-subnetid'] = ''
        jsonStr.metadata.annotations['service.kubernetes.io/tke-existed-lbid'] = ''
      } else if (radio === '1' && loadBalance === '2') {
        jsonStr.metadata.annotations['service.kubernetes.io/service.extensiveParameters'] = '{"AddressIPVersion":"IPV4"}'
        jsonStr.metadata.annotations['service.kubernetes.io/qcloud-loadbalancer-internal-subnetid'] = ''
        jsonStr.metadata.annotations['service.kubernetes.io/tke-existed-lbid'] = value
      }
      // 高级选项ExtermalTrafficPolicy的参数
      if (radio !== '2') jsonStr.spec.externalTrafficPolicy = policy
      // if (radio == '2') jsonStr.annotations['service.kubernetes.io/service.extensiveParameters'] = ''
      if (radio === '3' && loadBalance === '1') {
        this.getSubnetId()
        // jsonStr.annotations['service.kubernetes.io/service.extensiveParameters'] = ''
        jsonStr.metadata.annotations['service.kubernetes.io/tke-existed-lbid'] = ''
        jsonStr.metadata.annotations['service.kubernetes.io/qcloud-loadbalancer-clusterid'] = this.clusterId
        jsonStr.metadata.annotations['service.kubernetes.io/qcloud-loadbalancer-internal-subnetid'] = this.svc.subnetId
        // this.svc.value = ''
      } else if (radio === '3' && loadBalance === '2') {
        this.getSubnetId()
        // jsonStr.annotations['service.kubernetes.io/service.extensiveParameters'] = ''
        // jsonStr.metadata.annotations['service.kubernetes.io/loadbalance-id'] = ''
        jsonStr.metadata.annotations['service.kubernetes.io/qcloud-loadbalancer-clusterid'] = this.clusterId
        jsonStr.metadata.annotations['service.kubernetes.io/qcloud-loadbalancer-internal-subnetid'] = this.svc.subnetId
        jsonStr.metadata.annotations['service.kubernetes.io/tke-existed-lbid'] = value
      }
      // if (radio == '4') jsonStr.annotations['service.kubernetes.io/service.extensiveParameters'] = ''

      let param = {
        ContentType: 'application/merge-patch+json',
        Method: 'PATCH',
        Path: `/api/v1/namespaces/${this.spaceName}/services/${this.serviceName}`,
        RequestBody: JSON.stringify(jsonStr),
        Version: '2018-05-25',
        ClusterName: this.clusterId
      }
      await this.axios.post(POINT_REQUEST, param).then(res => {
        if (res.Response.Error === undefined) {
          // console.log(res, 13213)
          // let response = JSON.parse(res.Response.ResponseBody)
          this.$router.push({
            path: '/colony/sub/list/service/svc',
            query: {
              clusterId: this.clusterId
            }
          })
          this.$message({
            message: '更新成功',
            type: 'success',
            duration: 0,
            showClose: true
          })
        } else {
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
    // 获取服务详情
    async getInfo () {
      this.loadShow = true
      let params = {
        ClusterName: this.clusterId,
        Method: 'GET',
        Path: `/api/v1/namespaces/${this.spaceName}/services/${this.serviceName}`,
        Version: '2018-05-25'
      }
      await this.axios.post(POINT_REQUEST, params).then(res => {
        if (res.Response.Error === undefined) {
          // console.log(JSON.parse(res.Response.ResponseBody))
          let msg = JSON.parse(res.Response.ResponseBody)
          this.serviceInfo = msg
          this.svc.list = msg.spec.ports
          if (msg.spec.type === 'NodePort') { // 判断服务访问方式
            this.svc.radio = '4'
          } else if (msg.spec.type === 'ClusterIP') {
            this.svc.radio = '2'
          } else if (msg.spec.type === 'LoadBalancer' && msg.metadata.annotations['service.kubernetes.io/qcloud-loadbalancer-internal-subnetid']) {
            this.svc.radio = '3'
          } else {
            this.svc.radio = '1'
            // msg.metadata.annotations['service.kubernetes.io/qcloud-loadbalancer-internal-subnetid'] = ''
          }
          // var at = 'kubernetes.io/loadbalance-id'
          // 自有创建的均衡器id
          if (msg.metadata.annotations) {
            this.svc.val = msg.metadata.annotations['service.kubernetes.io/loadbalance-id']
          }
          if (this.svc.radio === '3') {
          // LB子网id
            this.svc.subnetId = msg.metadata.annotations['service.kubernetes.io/qcloud-loadbalancer-internal-subnetid']
          // 用来判断选中的是哪个访问方式
          // var isart = msg.metadata.annotations['service.kubernetes.io/qcloud-loadbalancer-internal-subnetid']
          }
          // 获取使用已有均衡器的id
          if (msg.metadata.annotations && msg.metadata.annotations['service.kubernetes.io/tke-existed-lbid']) {
            this.svc.value = msg.metadata.annotations['service.kubernetes.io/tke-existed-lbid']
          }
          // console.log(this.svc.value)
          // 获取描述信息
          if (msg.metadata.annotations) {
            this.svc.describe = msg.metadata.annotations.description
          }
          // console.log(this.svc.val, this.svc.subnetId, this.svc.value, isart)
          if (this.svc.value) {
            this.svc.loadBalance = '2'
          } else {
            this.svc.loadBalance = '1'
          }
          if (msg.spec.externalTrafficPolicy === 'Cluster') { // 高级选项ExtermalTrafficPolicy判断
            this.svc.ETP = '1'
          } else {
            this.svc.ETP = '2'
          }
          // console.log(msg.spec.sessionAffinityConfig.clientIP.timeoutSeconds)
          if (msg.spec.sessionAffinity === 'ClientIP') { // 高级选项Session Affinity判断
            this.svc.SA = '1'
            this.svc.time = msg.spec.sessionAffinityConfig.clientIP.timeoutSeconds
          } else {
            this.svc.SA = '2'
          }
          this.loadShow = false
        } else {
          this.loadShow = false
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
    // 获取subnetID
    getSubnetId () {
      this.LBsubnet.forEach(ele => {
        if (this.svc.LBvalue2 == ele.SubnetName) {
          this.svc.subnetId = ele.SubnetId
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
        protocol: 'TCP',
        port: '',
        targetPort: '',
        nodePort: '',
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
  max-width: 700px;
  border: 1px solid #ddd;
}
.ports{
  max-width: 848px;
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
.titles{
	width: 204px;
	.el-input{
		width: 184px
	}
}
.cons{
	width: 204px;
	.el-input{
		width: 200px
	}
}
</style>

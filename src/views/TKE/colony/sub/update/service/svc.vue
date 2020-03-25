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
          <h2 class="header-title">{{$t('TKE.subList.gxfwfs')}}</h2>
        </div>
        <!-- 右侧 -->
        <div class="grid-right"></div>
      </div>
    </div>
    <div class="colony-main">
      <div class="tke-card tke-formpanel-wrap mb60">
        <el-form class="tke-form" :model="svc" label-position="left" label-width="120px" size="mini">
          <el-form-item :label="$t('TKE.subList.fwfwfs')">
            <el-radio :disabled="serviceName.includes('headless')?true:false" v-model="svc.radio" label="1">{{$t('TKE.subList.tggwfw')}}</el-radio>
            <el-radio :disabled="serviceName.includes('headless')?true:false" v-model="svc.radio" label="2">{{$t('TKE.subList.jzjqnfw')}}</el-radio>
            <el-radio :disabled="serviceName.includes('headless')?true:false" v-model="svc.radio" label="3">{{$t('TKE.subList.vpcnwfw')}}</el-radio>
            <el-radio :disabled="serviceName.includes('headless')?true:false" v-model="svc.radio" label="4">{{$t('TKE.subList.zjdkfw')}}</el-radio>
            <!-- <a href="javascript:;" style="padding-left:10px;">如何选择</a> -->
            <!-- <i class="el-icon-edit-outline"></i> -->
            <!-- 方式介绍 -->
            <div>
              <div v-if="svc.radio=='1'">
                <div>
                  {{$t('TKE.subList.zdcjgw')}}（
                  <span class="text-warning">0.02元/{{$t('TKE.colony.xs')}}</span>）{{$t('TKE.subList.xzgwfw')}}。
                </div>
                <div>
                  {{$t('TKE.subList.lyzf')}}，
                  <!-- <a href>查看详情</a>
                  <i class="el-icon-edit-outline"></i> -->
                </div>
              </div>
              <div v-if="svc.radio=='2'">
                <div>{{$t('TKE.subList.bzfwwlglx')}}。</div>
                <div>
                  <el-checkbox v-model="svc.checked" disabled>Headless&nbsp;Service</el-checkbox>
                  <el-tooltip
                    :content="$t('TKE.subList.yyjz')"
                    placement="top"
                    effect="light"
                  >
                    <i class="el-icon-question" style="margin-left:5px;"></i>
                  </el-tooltip>（Headless&nbsp;Service{{$t('TKE.subList.zzccjsxz')}}，
                  <span class="text-error">{{$t('TKE.subList.bzcbgfw')}}）</span>
                </div>
              </div>
              <div v-if="svc.radio=='3'">
                <div>{{$t('TKE.subList.nwfwxs')}}。</div>
                <div>
                  支持Ingress
                  <!-- <a href>查看详情</a>
                  <i class="el-icon-edit-outline"></i> -->
                </div>
              </div>
              <div v-if="svc.radio=='4'">
                <div>{{$t('TKE.subList.zjdkys')}}。</div>
                <div>
                  支持Ingress
                  <!-- <a href>查看详情</a>
                  <i class="el-icon-edit-outline"></i> -->
                </div>
              </div>
            </div>
          </el-form-item>

          <el-form-item v-if="svc.radio=='3'" :label="$t('TKE.subList.szzw')">
			      <el-select v-model="svc.LBvalue1" :placeholder="svc.LBvalue1" disabled>
			      	<el-option
			      		v-for="item in vpcNameAry"
			      		:key="item.VpcName"
			      		:label="item.VpcName"
			      		:value="item.VpcName">
			      	</el-option>
			      </el-select>
			      <el-select v-model="svc.LBvalue2" :placeholder="$t('TKE.overview.qxz')">
			      	<el-option
			      		v-for="item in LBsubnet"
			      		:key="item.SubnetName"
			      		:label="item.SubnetName"
			      		:value="item.SubnetId">
			      	</el-option>
			      </el-select>
			      <el-button style="border:none;"><i class="el-icon-refresh"></i></el-button>
			      共<span>{{addressCount.TotalIpAddressCount}}</span>{{$t('TKE.subList.gzwd')}}<span>{{addressCount.AvailableIpAddressCount}}</span>{{$t('TKE.overview.ge')}}可用
		      </el-form-item>

          <el-form-item :label="$t('TKE.subList.fzjhq')" v-if="svc.radio=='3' || svc.radio=='1'">
            <div class="radio1">
              <el-radio-group v-model="svc.loadBalance" style="margin-bottom: 5px;">
                <el-radio-button label="1">{{$t('TKE.subList.zdcjian')}}</el-radio-button>
                <el-radio-button label="2">使用已有</el-radio-button>
              </el-radio-group>
            </div>
            <p v-show="svc.loadBalance=='1'">
              {{$t('TKE.subList.zdcj')}}，
              <!-- <a href="">查看更多说明</a> -->
            </p>
            <div v-show="svc.loadBalance=='2'">
              {{$t('TKE.subList.qwsdxgjt')}}
              <!-- <a href="">查看更多说明</a> -->
              <div>
                <el-select v-model="svc.value" :placeholder="$t('TKE.overview.qxz')">
				        	<el-option
				        		v-for="item in ownLoadBalancer"
				        		:key="item.LoadBalancerId"
				        		:label="item.LoadBalancerId+'  ('+item.LoadBalancerName+')'"
				        		:value="item.LoadBalancerId">
				        	</el-option>
                </el-select>
                <!-- <el-tooltip effect="light" content="请选择CLB" placement="right" v-if="svc.value===''">
                  <i class="el-icon-warning-outline" style="margin-left:10px;font-weight:800;"></i>
                </el-tooltip> -->
              </div>
            </div>
          </el-form-item>
          <el-form-item label="端口映射">
            <div class="port" :class="{ports:svc.radio=='4'}">
              <!-- 头部 -->
              <div class="flex">
                <div style="width:140px;padding-left:14px">
                  {{$t('TKE.subList.xy')}}
                  <el-tooltip :content="$t('TKE.subList.xybnhhsy')" placement="top" effect="light">
                    <i class="el-icon-warning"></i>
                  </el-tooltip>
                </div>
                <div :class="{titles:svc.radio=='4'}" :style="svc.radio=='4'?'width:204px':'width:250px;'">
                  容器端口
                  <el-tooltip :content="$t('TKE.subList.dkfw')" placement="top" effect="light">
                    <i class="el-icon-warning"></i>
                  </el-tooltip>
                </div>
                <div :class="{titles:svc.radio=='4'}" :style="svc.radio=='4'?'width:204px':'width:250px;'" v-if="svc.radio=='4'">
                  {{$t('TKE.subList.zjdk')}}
						      <el-tooltip :content="$t('TKE.subList.btzdfp')" placement="top" effect="light">
						      <i class="el-icon-warning"></i>
						      </el-tooltip>
					      </div>
                <div :class="{titles:svc.radio=='4'}" :style="svc.radio=='4'?'':'padding-left:30px'">
                  {{$t('TKE.subList.fwdk')}}
                  <el-tooltip
                    :content="$t('TKE.subList.jqw')"
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
                    <el-select class="w100" v-model="it.protocol" :placeholder="$t('TKE.overview.qxz')">
									  	<el-option v-for="item in svc.options" :key="item" :label="item" :value="item"></el-option>
                    </el-select>
                  </el-form-item>
									<!-- 容器端口 -->
                  <el-form-item :prop="`list.${i}.port`" :rules="verifyPort1" class="w250" :class="{cons:svc.radio=='4'}"
                   style="display: inline-block;padding-left:30px;">
                    <el-input v-model="it.targetPort" :placeholder="$t('TKE.colony.qsrnr')"></el-input>
									</el-form-item>
                  <!-- 主机端口 -->
                  <el-form-item :class="{cons:svc.radio=='4'}" v-if="svc.radio=='4'"
						      style="display: inline-block;padding-left:30px;"  :prop="`list.${i}.nodePort`" :rules="verifyPort3">
						        <el-input class="w250" v-model="it.nodePort" :placeholder="$t('TKE.subList.fwei')"></el-input>
						      </el-form-item>
                  <!-- 服务端口 -->
                  <el-form-item :prop="`list.${i}.targetPort`" :rules="verifyPort2" class="w250"
                   :class="{cons:svc.radio=='4'}" style="display: inline-block;padding-left:30px;">
                    <el-input v-model="it.port" :placeholder="$t('TKE.colony.qsrnr')"></el-input>
									</el-form-item>
                  <!-- 关闭按钮 -->
                  <el-tooltip class="item" effect="dark" :content="$t('TKE.subList.zslgdk')" placement="left" v-if="svc.list.length===1">
                    <i
                      style="font-size:18px;padding-left:20px;"
                      :style="svc.radio=='4'?'padding-left:40px;':'padding-left:20px;'"
                      class="el-icon-close"
                    ></i>
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" :content="$t('TKE.overview.sc')" placement="right" v-else>
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
            <h3 style="padding-bottom:10px;">{{$t('TKE.subList.gjszxt')}}</h3>
            <el-form-item label-width="150px" label="ExtermalTrafficPolicy" v-if="svc.radio!=='2'">
              <el-radio v-model="svc.ETP" label="1">Cluster</el-radio>
              <el-radio v-model="svc.ETP" label="2">Local</el-radio>
              <div v-if="svc.ETP=='1'">{{$t('TKE.subList.mrjhzf')}}</div>
              <div v-if="svc.ETP=='2'">
                {{$t('TKE.subList.ngblly')}}。
              </div>
            </el-form-item>
            <div>
              <el-form-item label-width="150px" label="Session Affinity">
                <el-radio v-model="svc.SA" label="1">ClienIP</el-radio>
                <el-radio v-model="svc.SA" label="2">None</el-radio>
              </el-form-item>
              <div v-if="svc.SA=='1'">
                <el-form-item prop="time" :rules="timeRules" label-width="150px" :label="$t('TKE.subList.zdhhbcsj')">
                  <el-input v-model="svc.time" class="w200"></el-input>
                  <div>{{$t('TKE.subList.hhbcsj')}}</div>
                </el-form-item>
              </div>
            </div>
          </div>
          <div v-if="!svc.show">
            <a href="javascript:;" @click="show()">{{$t('TKE.subList.xsgjsz')}}</a>
          </div>
          <div v-if="svc.show">
            <a href="javascript:;" @click="show()">{{$t('TKE.subList.yczgsz')}}</a>
          </div>
        </el-form>

        <!-- 底部 -->
        <div class="tke-formpanel-footer">
          <el-button size="small" type="primary" @click="updateAccessMode()">{{$t('TKE.subList.gxfwfs')}}</el-button>
          <el-button size="small" @click="$router.go(-1)">取消</el-button>
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
        radio: '1', // 服务访问方式
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
        subnetId: '',//子网id
        describe: ''// 描述
      },
      clusterId: '', // 集群id
      spaceName: '', // 命名空间的名称
      serviceName: '', // 服务的名称
      describeClustersList: [], // 描述聚群
      ownLoadBalancer:[],
      ownLoadBalancers:[],
      ownLoadBalancer1: [], // 已有负载均衡器
      ownLoadBalancer2: [], // 已有负载均衡器
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
            callback(new Error('會話保持時間不能為空'))
          } else if (value < 0 && value > 68400) {
            callback(new Error('不在會話保持時間範圍'))
          } else if (!reg.test(value)) {
            callback(new Error('会话保持时间格式错误'))
          } else {
            callback(new Error('會話保持時間格式錯誤'))
          }
        },
        trigger: 'blur',
        required: true
      }],
      // 端口映射的验证
      verifyPort1: [// 容器端口的验证
        { validator: (rule, value, callback) => {
          let ind = Number(rule.field.split('.')[1])
          console.log(ind)
          let ls = this.svc.list
          let flog = false
          for (let i = 0; i < ls.length; i++) {
            if (i !== ind && ls[i].port === Number(value)) {
              flog = true
            }
          }
          let portNumber = /^([1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]{1}|6553[0-5])$/
          if (!value) {
            callback(new Error('端口號不能為空'))
          } else if (!portNumber.test(value)) {
            callback(new Error('端口號格式不正確'))
          } else if (flog) {
            callback(new Error('端口不可重複映射'))
          } else {
            callback()
          }
        },
        trigger: 'blur',
        required: true }
      ],
      verifyPort2: [// 服务端口的验证
        { validator: (rule, value, callback) => {
          let ind = Number(rule.field.split('.')[1])
          let ls = this.svc.list
          let flog = false
          for (let i = 0; i < ls.length; i++) {
            if (i !== ind && ls[i].targetPort === Number(value)) {
              flog = true
            }
          }
          let portNumber = /^([1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]{1}|6553[0-5])$/
          if (!value) {
            callback(new Error('端口號不能為空'))
          } else if (!portNumber.test(value)) {
            callback(new Error('端口號格式不正確'))
          } else if (flog) {
            callback(new Error('端口不可重複映射'))
          } else {
            callback()
          }
        },
        trigger: 'blur',
        required: true }
      ],
      verifyPort3: [{// 主机端口的验证
        validator: (rule, value, callback) => {
          let ind = Number(rule.field.split('.')[1])
          let ls = this.svc.list
          let flog = false
          for (let i = 0; i < ls.length; i++) {
            if (i !== ind && ls[i].nodePort === Number(value)) {
              flog = true
            }
          }
          if (flog) {
            callback(new Error('端口不可重複映射'))
          }
          if (value > 30000 && value <= 32767) {
            callback()
          } else if (!value) {
            callback(new Error('端口號不能為空'))
          } else if (value < 0 && value > 32767) {
            callback(new Error('超出端口號範圍'))
          } else if (!(/^\d+$/.test(value))) {
            callback(new Error('端口號格式不正確'))
          } else {
            callback(new Error('端口格式不正確'))
          }
        },
        trigger: 'blur',
        required: true
      }],
      ProtocolValidation: [// 协议的验证
        { validator: (rule, value, callback) => {
          // let ind = Number(rule.field.split('.')[1])
          let ls = this.svc.list
          let flog = true
          if (ls.length > 1) {
            for (let i = 0; i < ls.length - 1; i++) {
              if (ls[i].protocol !== value) {
                flog = false
              }
            }
          }
          if (!flog) {
            callback(new Error('協議必須一致'))
          } else {
            callback()
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
        return item.SubnetId == val
      })
    },
    'svc.radio':function(val){
      let {ownLoadBalancers} = this
      let newAry = []  
      switch(this.svc.radio){
        case'1':newAry = ownLoadBalancers.filter(ele=>ele.VipIsp=='BGP');break
        case'3':newAry = ownLoadBalancers.filter(ele=>ele.VipIsp=='INTERNAL');break
      }
      this.ownLoadBalancer = newAry
      let aa = this.ownLoadBalancer.find(item=>this.svc.value===item.LoadBalancerId)
      if(aa!==undefined) this.svc.value = aa
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
      await this.getDescribeClusters()// 获取集群列表
      await this.getDescribeLoadBalancers()// 扫描均衡器
      await this.getDescribeVpcs()// 描述Vpcs
      await this.getDescribeSubnets()// 扫描子网
      await this.getInfo()// 获取服务详情信息      
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
          this.ownLoadBalancers = msg
          let ary = msg.filter(item=>item.VpcId === this.svc.vpcIds) 
          let newAry = []  
          switch(this.svc.radio){
            case'1':newAry = ary.filter(ele=>ele.VipIsp=='BGP');break
            case'3':newAry = ary.filter(ele=>ele.VipIsp=='INTERNAL');break
          }   
          this.ownLoadBalancer = newAry  
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
        Limit: 100,
        Offset: 0,
        Version: '2017-03-12'
      }
      params['Filters.0.Name'] = 'vpc-id'
      params['Filters.0.Values.0'] = this.svc.vpcIds

      await this.axios.post(TKE_WORKER_METWORK, params).then(res => {
        // console.log(1111111, res)
        if (res.Response.Error === undefined) {
          let msg = res.Response.SubnetSet
          this.LBsubnet = msg
          // console.log(msg)
          // if (this.svc.radio !== '3') {
          //   this.svc.LBvalue2 = res.Response.SubnetSet[0].SubnetId
          // }
          this.loadShow = false
          // msg.forEach(ele => {
          //   if (ele.SubnetId == this.svc.subnetId) {
          //     this.svc.LBvalue2 = ele.SubnetName
          //     // this.svc.subnetId = ele.SubnetId
          //   }
          // })
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
          name: `${ele.targetPort}-${ele.port}-${ele.protocol.toLowerCase()}`,
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
        // this.getSubnetId()
        // jsonStr.annotations['service.kubernetes.io/service.extensiveParameters'] = ''
        jsonStr.metadata.annotations['service.kubernetes.io/tke-existed-lbid'] = ''
        jsonStr.metadata.annotations['service.kubernetes.io/qcloud-loadbalancer-clusterid'] = this.clusterId
        jsonStr.metadata.annotations['service.kubernetes.io/qcloud-loadbalancer-internal-subnetid'] = this.svc.LBvalue2
      } else if (radio === '3' && loadBalance === '2') {
        // this.getSubnetId()
        // jsonStr.annotations['service.kubernetes.io/service.extensiveParameters'] = ''
        // jsonStr.metadata.annotations['service.kubernetes.io/loadbalance-id'] = ''
        jsonStr.metadata.annotations['service.kubernetes.io/qcloud-loadbalancer-clusterid'] = this.clusterId
        jsonStr.metadata.annotations['service.kubernetes.io/qcloud-loadbalancer-internal-subnetid'] = this.svc.LBvalue2
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
            // this.svc.subnetId = msg.metadata.annotations['service.kubernetes.io/qcloud-loadbalancer-internal-subnetid']
            this.svc.LBvalue2 = msg.metadata.annotations['service.kubernetes.io/qcloud-loadbalancer-internal-subnetid']
          // 用来判断选中的是哪个访问方式
          // var isart = msg.metadata.annotations['service.kubernetes.io/qcloud-loadbalancer-internal-subnetid']
          }
          // 获取使用已有均衡器的id
          if (msg.metadata.annotations && msg.metadata.annotations['service.kubernetes.io/tke-existed-lbid']) {
            this.svc.value = msg.metadata.annotations['service.kubernetes.io/tke-existed-lbid']
          }
          // 获取描述信息
          if (msg.metadata.annotations) {
            this.svc.describe = msg.metadata.annotations.description
          }
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
      this.$confirm('確認關閉？')
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

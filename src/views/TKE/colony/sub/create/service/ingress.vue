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
          <h2 class="header-title">新建Ingress</h2>
        </div>
        <!-- 右侧 -->
        <div class="grid-right"></div>
      </div>
    </div>
    <div class="colony-main">
      <div class="tke-card tke-formpanel-wrap mb60">
        <el-form class="tke-form" :model="ing" ref="form" :rules="rules" label-position='left' label-width="120px" size="mini">
          <el-form-item label="名称" prop="name">
            <el-input class="w200" v-model="ing.name" placeholder="请输入Ingress名称"></el-input>
            <p>最长63个字符，只能包含小写字母、数字及分隔符("-")，且必须以小写字母开头，数字或小写字母结尾</p>
          </el-form-item>
          <el-form-item label="描述">
            <textarea name="" class="ms" placeholder="请输入描述信息，不超过1000个字符" id="" cols="30" rows="10" v-model="ing.description"></textarea>
          </el-form-item>
          <el-form-item label="Ingress类型">
            <div>应用型负载均衡器（支持HTTP / HTTPS <span>{{ing.price}}</span> 元 / 小时)</div>
          </el-form-item>
          <el-form-item label="网络类型">
            <el-radio-group v-model="ing.tabPosition">
              <el-radio-button label="gw">公网</el-radio-button>
              <el-radio-button label="nw">内网</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="负载均衡器">
            <el-radio-group v-model="ing.fz">
              <el-radio-button label="zd">自动创建</el-radio-button>
              <el-radio-button label="yy">使用已有</el-radio-button>
            </el-radio-group>
            <div v-if="ing.fz=='yy'">
              <div>使用已有应用CLB型创建ingress，不覆盖已有监听规则，请勿手动修改由TKE创建CLB监听器，<a href="">查看更多说明</a><i
                class="el-icon-edit-outline"></i></div>
              <el-select v-model="ing.describeLoadBalancersValue" placeholder="请选择" class="borderRed" @change="describeLoadBalancersChange">
                <el-option
                  v-for="item in ing.describeLoadBalancersOption"
                  :key="item.LoadBalancerId"
                  :label="`${item.LoadBalancerId} (${item.LoadBalancerName})`"
                  :value="item.LoadBalancerId">
                </el-option>
              </el-select>
              <el-tooltip :content="`当前${ing.describeLoadBalancersValue}已有监听器规则， ingress使用已有CLB仅支持无监听规则的CLB`" placement="top"
                          effect="light">
                <i class="el-icon-warning text-error" style="margin-left:10px;font-size:16px;"></i>
              </el-tooltip>
            </div>
          </el-form-item>
          <el-form-item label="命名空间">
            <el-select v-model="ing.nameSpaceValue" placeholder="请选择" @change="ingNamespaceValueChange">
              <el-option
                v-for="item in ing.nameSpaceOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="ing.tabPosition=='nw'" label="所属网络">
            <el-select  :value="ing.vpcsValue" placeholder="请选择" :disabled="true">
              <el-option
                v-for="item in ing.vpcsOption"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
            <el-select v-model="ing.workerNetWorkValue" placeholder="请选择">
              <el-option
                v-for="item in ing.workerNetWorkOption"
                :key="item.SubnetName"
                :label="item.SubnetName"
                :value="item.SubnetName">
              </el-option>
            </el-select>
            <el-button @click="getWorkerNetwork" style="border:none;"><i class="el-icon-refresh"></i></el-button>
            共<span>{{ing.workerNetWorkOrder.TotalIpAddressCount}}</span>个子网点，剩下<span>{{ing.workerNetWorkOrder.AvailableIpAddressCount}}</span>个可用
          </el-form-item>
          <el-form-item label="监听端口">
            <el-checkbox disabled v-model="ing.checked">Http:80</el-checkbox>
            <el-checkbox v-model="ing.checkedtwo">Https:443</el-checkbox>
          </el-form-item>
          <el-form-item label="服务器证书" v-if="ing.checkedtwo">
            <el-select v-model="ing.certValue" placeholder="请选择">
              <el-option
                v-for="item in ing.certOption"
                :key="item.id"
                :label="`${item.alias} (${item.id})`"
                :value="item.id">
              </el-option>
            </el-select>
            <div>如您现有的证书不合适，可以<a href="">现在创建</a><i class="el-icon-edit-outline"></i></div>
          </el-form-item>
          <el-form-item label="转发配置">
            <div class="port">
              <!-- 头部 -->
              <div class="flex">
                <div style="padding-left:10px;width:150px;">协议</div>
                <div style="width:80px;">监听端口</div>
                <div style="width:168px;padding-left:12px">域名
                  <el-tooltip content="非通配的域名支持的字符集a-z 0-9.-;通配的域名，目前只支持*.example.com的形式，且单个域名中只出现一次" placement="top"
                              effect="light">
                    <i class="el-icon-warning"></i>
                  </el-tooltip>
                </div>
                <div style="width:80px;">路径</div>
                <div style="width:150px;padding-left:40px;">后端服务
                  <el-tooltip content="转发规则后端服务无法添加访问方式为集群内访问的服务，如有需要可更新服务的访问方式。不支持配置访问方式为不启用的服务" placement="top"
                              effect="light">
                    <i class="el-icon-warning"></i>
                  </el-tooltip>
                </div>
                <div style="padding-left:40px;">服务端口</div>
              </div>
              <!-- 内容 -->
              <div style="border-top:1px solid #ddd;padding: 10px;">
                <div style="padding:5px 0;" v-for="(it, i) in ing.list" :key="it.key">
                  <el-select style="width:120px;" v-model="it.protocolValue" placeholder="请选择" @change="protocolChange($event, it.key)">
                    <el-option
                      v-for="item in ing.protocolOption"
                      :key="item"
                      :label="item"
                      :value="item">
                    </el-option>
                  </el-select>
                  <span style="padding-left:23px">{{it.portNumber}}</span>
                  <el-input style="width:200px;padding-left:75px;" placeholder="默认为IPv4 IP" v-model="it.host"></el-input>
                  <el-form-item style="display: inline-block;width:120px;padding-left:30px;" :prop="`list.${i}.path`" :rules="pathValidator">
                    <el-input v-model="it.path"></el-input>
                  </el-form-item>
                  <el-form-item style="display: inline-block;padding-left:30px;width:150px;" :prop="`list.${i}.backendServiceSelect`" :rules="bssValidator">
                    <el-select v-model="it.backendServiceSelect" placeholder="请选择后端服务" @change="backendServiceChange($event, it.key)">
                      <el-option
                        v-for="item in ing.backendService"
                        :key="item.metadata.name"
                        :label="item.metadata.name"
                        :value="item.metadata.name">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item style="display: inline-block;padding-left:30px;width:150px;"
                                :prop="`list.${i}.backendServicePortSelect`" :rules="bspValidator">
                    <el-select v-model="it.backendServicePortSelect" placeholder="请选择" :disabled="it.backendServiceSelect==='请选择后端服务'">
                      <el-option
                        v-for="item in it.backendServicePortOption"
                        :key="item.name"
                        :label="item.port"
                        :value="item.port">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-tooltip class="item" effect="dark" content="删除" placement="right">
                    <i style="font-size:18px;padding-left:20px;" class="el-icon-close" @click="i!==0?removeprot(it):''"></i>
                  </el-tooltip>
                </div>
              </div>
            </div>
            <a href="javascript:;" @click="addport()">添加转发规则</a>
          </el-form-item>
        </el-form>
        <!-- 底部 -->
        <div class="tke-formpanel-footer">
          <el-button size="small" type="primary" @click="submitAdd('form')">创建Ingress</el-button>
          <el-button size="small" @click="()=>$router.back()">取消</el-button>
          <div class="tke-fe-alert tke-fe-alert--error" v-if="submitErrorMessage">{{submitErrorMessage}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import subscribeNew from '../../../../../CAM/UserListNew/components/subscribeNew'
import {
  ALL_CITY,
  TKE_GETCERTLIST,
  TKE_DESCRIBELISTENERS,
  TKE_INQUIRYPRICE,
  TKE_EDSCRIBELOADBALANCERS,
  TKE_WORKER_METWORK,
  TKE_VPC_METWORK,
  TKE_COLONY_LIST,
  POINT_REQUEST
} from '@/constants'
import { ErrorTips } from '@/components/ErrorTips.js'
export default {
  name: 'svcCreate',
  data () {
    return {
      dialogFormVisible: false,
      clusterId: '',
      namespace: '', // route 传入的命名空间名
      vpcId: '',
      vpcName: '',
      ing: {
        fz: 'zd',
        checked: true,
        checkedtwo: false,
        name: '',
        tabPosition: 'gw',
        value: '',
        options: [],
        input: '',
        certValue: '', // 证书值
        certOption: [], // 证书列表
        description: '',
        list: [],
        vpcsOption: [], // vpc数组
        vpcsValue: '', // vpc值
        vpcsUrlOption: [], // vpc地址数组
        vpcsUrlValue: '', // vpc地址值
        describeLoadBalancersOption: [], // 负载均衡数组
        describeLoadBalancersValue: '暂无数据', // 负载均衡值
        backendService: [], // 后端服务列表
        nameSpaceOptions: [],
        nameSpaceValue: '',
        workerNetWorkOption: [],
        workerNetWorkValue: '',
        workerNetWorkOrder: {},
        protocolOption: ['http'],
        portNumber: 80,
        price: 0
      },
      submitErrorMessage: '', // 提交失败后的消息
      rules: {
        name: [
          {
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('Ingress名称不能为空'))
              } else if (!(/^[a-z][a-z\d-]*$/.test(value))) {
                callback(new Error('Ingress名称格式不正确'))
              } else {
                callback()
              }
            },
            trigger: 'blur',
            required: true
          }
        ]
      },
      pathValidator: [{
        validator: (rule, value, callback) => {
          if (value === '') {
            callback(new Error('路径不能为空'))
          } else if (value.substr(0, 1) !== '/') {
            callback(new Error('格式不正确'))
          } else {
            callback()
          }
        },
        trigger: 'blur',
        required: true
      }],
      bssValidator: [{
        validator: (rule, value, callback) => {
          let itemObject = this.ing.backendService.find(item => {
            return item.metadata.name === value
          })
          console.log('itemObject.spec.type', itemObject.spec.type)
          if (value === '请选择后端服务') {
            callback(new Error('请选择后端服务'))
          } else if (itemObject.spec.type === 'ClusterIP') {
            callback(new Error('后端服务的访问类型不能为ClusterIP(仅在集群内访问)'))
          } else {
            callback()
          }
        },
        trigger: 'change',
        required: true
      }],
      bspValidator: [{
        validator: (rule, value, callback) => {
          if (value === '请选择端口') {
            callback(new Error('请选择端口'))
          } else {
            callback()
          }
        },
        trigger: 'change',
        required: true
      }],
      describeLoadBalancers: []
    }
  },
  components: {},
  watch: {
    // 监听子网列表选中值
    'ing.workerNetWorkValue': function (val) {
      this.ing.workerNetWorkOrder = this.ing.workerNetWorkOption.find(item => {
        return item.SubnetName === val
      })
    },
    // 监听https是否选中的
    'ing.checkedtwo': function (val) {
      this.ing.protocolValue = 'http'
      if (!val) {
        this.ing.protocolOption = ['http']
        this.ing.list.forEach((item) => {
          item.protocolValue = 'http'
          item.portNumber = 80
        })
      } else {
        this.ing.protocolOption = ['http', 'https']
      }
    },
    // 切换公网/内网
    'ing.tabPosition': function (val) {
      this.changeTabPosition()
    }
  },
  created () {
    // 从路由获取类型
    let { clusterId, np } = this.$route.query
    this.clusterId = clusterId
    this.ing.nameSpaceValue = this.namespace = np
    this.initNetworkRequery()
  },
  methods: {
    initNetworkRequery: async function () {
      this.getCertList()
      this.getDescribeListeners()
      this.getInquiryPrice()
      this.getDescribeLoadBalancers()
      await this.getColonyList()
      await this.getVpcNetwork()
      await this.getWorkerNetwork()
      await this.getNameSpaceList()
      await this.getBackEndService()
      this.addport()
    },
    // 公共的查询 ing.list
    selectIngList: function (key, func) {
      let item = this.ing.list
      for (let i = 0; i < item.length; i++) {
        if (item[i].key === key) {
          func(item[i])
          return
        }
      }
    },
    describeLoadBalancersChange: function (val) {
      console.log(val)
    },
    // 命名空间改变时触发
    ingNamespaceValueChange: function (val) {
      this.getBackEndService()
    },
    protocolChange: function (event, key) {
      this.selectIngList(key, (result) => {
        if (result.protocolValue === 'http') {
          result.portNumber = 80
        } else {
          result.portNumber = 443
        }
      })
    },
    backendServiceChange: function (event, key) {
      this.selectIngList(key, (result) => {
        let portsArr = this.ing.backendService.find(item => {
          return item.metadata.name === result.backendServiceSelect
        }).spec.ports
        result.backendServicePortOption = [{ port: '请选择端口' }, ...portsArr]
        result.backendServicePortSelect = '请选择端口'
      })
    },
    submitAdd: function (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.createIngress()
        } else {
          return false
        }
      })
    },
    // 点击创建功能
    createIngress: async function () {
      // 注释请求参数
      this.submitErrorMessage = ''
      let { list, name, nameSpaceValue, description, checkedtwo, certValue, tabPosition } = this.ing
      let httpRules = []
      let httpsRules = []
      let specRules = []
      list.forEach(item => {
        let { path, backendServiceSelect, backendServicePortSelect, host, protocolValue } = item
        let rules = {
          path: path,
          backend: { serviceName: backendServiceSelect, servicePort: backendServicePortSelect.toString() }
        }
        let oneSpecRules = {
          http: {
            paths: [{
              'backend': {
                'serviceName': backendServiceSelect,
                'servicePort': backendServicePortSelect
              },
              'path': path
            }]
          }
        }
        if (host !== '') {
          rules.host = host
          oneSpecRules.host = host
        }
        if (protocolValue === 'http') {
          httpRules.push(rules)
        } else {
          httpsRules.push(rules)
        }
        specRules.push(oneSpecRules)
      })
      if (httpRules.length === 0) httpRules = null
      if (httpsRules.length === 0) httpsRules = null
      let extensiveParameters = '{"AddressIPVersion":"IPV4"}'
      if (tabPosition !== 'gw') {
        // 获取选中 "所属网络" 对象
        let oneWorkerNetWorkOption = this.ing.workerNetWorkOption.find(item => {
          return item.SubnetName === this.ing.workerNetWorkValue
        })
        extensiveParameters = oneWorkerNetWorkOption.SubnetId
      }
      let ingressQueryBody = {
        'kind': 'Ingress',
        'apiVersion': 'extensions/v1beta1',
        'metadata': {
          'name': name,
          'namespace': nameSpaceValue,
          'annotations': {
            'kubernetes.io/ingress.class': 'qcloud',
            'kubernetes.io/ingress.extensiveParameters': extensiveParameters,
            'kubernetes.io/ingress.http-rules': JSON.stringify(httpRules),
            'kubernetes.io/ingress.https-rules': JSON.stringify(httpsRules),
            'kubernetes.io/ingress.rule-mix': `${checkedtwo}`
          }
        },
        'spec': {
          'rules': specRules
        }
      }
      // 如果描述有填写则添加到参数里面
      if (description) ingressQueryBody.metadata.annotations.description = description
      // 如果选中https 则需要证书 同时添加Secret
      let queryBodyJson = ''
      if (checkedtwo) {
        let secretQueryBody = {
          'kind': 'Secret',
          'apiVersion': 'v1',
          'metadata': {
            'name': name,
            'namespace': nameSpaceValue,
            'labels': {
              'qcloud-app': name
            }
          },
          'type': 'Opaque',
          'data': {
            'qcloud_cert_id': ''
          }
        }
        ingressQueryBody.spec.tls = [{ 'secretName': name }]
        ingressQueryBody.metadata.annotations.qcloud_cert_id = certValue
        queryBodyJson = JSON.stringify(secretQueryBody) + JSON.stringify(ingressQueryBody)
      } else {
        queryBodyJson = JSON.stringify(ingressQueryBody)
      }
      let param = {
        Method: 'POST',
        Path: `/apis/platform.tke/v1/clusters/${this.clusterId}/apply?notUpdate=true`,
        Version: '2018-05-25',
        RequestBody: queryBodyJson,
        ClusterName: this.clusterId
      }
      await this.axios.post(POINT_REQUEST, param).then(res => {
        if (res.Response.Error === undefined) {
          this.$message({
            message: '新建成功',
            type: 'success',
            showClose: true,
            duration: 2000
          })
          this.$router.replace({
            path: '/colony/sub/detail/service/ingress/event',
            query: {
              clusterId: this.clusterId,
              ingressName: name,
              namespace: nameSpaceValue
            }
          })
        } else {
          this.submitErrorMessage = JSON.parse(res.Response.Error.Message).message
        }
      })
    },
    removeprot (item) {
      var index = this.ing.list.indexOf(item)
      if (index !== -1) {
        this.ing.list.splice(index, 1)
      }
    },
    addport () {
      this.ing.list.push({
        key: Date.now(),
        protocolValue: 'http',
        portNumber: 80,
        host: '',
        backendServiceSelect: '请选择后端服务', // 后端服务选中的值
        backendServicePortOption: [],
        backendServicePortSelect: '', // 选中的端口号
        path: '' // 路径
      })
    },
    // 返回上一层
    goBack () {
      this.$router.go(-1)
    },
    // 获取证书列表
    getCertList: async function () {
      let param = {
        certType: 'SVR',
        count: 999,
        page: 1,
        withCert: 0,
        regionId: 39
      }
      this.axios.post(TKE_GETCERTLIST, param).then(res => {
        res.data.list.forEach((item, index) => {
          let { alias, id } = item
          if (alias === '') {
            alias = '未命名'
          }
          if (index === 0) {
            this.ing.certValue = id
          }
          this.ing.certOption.push({ alias, id })
        })
      })
    },
    // 获取描述者
    getDescribeListeners: async function () {
      let param = {
        Version: '2018-03-17',
        LoadBalancerId: 'lb-304y2b8e'
      }
      this.axios.post(TKE_DESCRIBELISTENERS, param).then(res => {
        console.log('getDescribeListeners', res)
      })
    },
    // 查询价格
    getInquiryPrice: async function () {
      let param = {
        Version: '2018-03-17',
        LoadBalancerType: 'OPEN',
        LoadBalancerChargeType: 'POSTPAID',
        'InternetAccessible.InternetChargeType': 'BANDWIDTH_POSTPAID_BY_HOUR'
      }
      param['InternetAccessible.InternetMaxBandwidthOut'] = this.ing.tabPosition === 'gw' ? 1 : 0
      await this.axios.post(TKE_INQUIRYPRICE, param).then(res => {
        if (this.ing.tabPosition === 'gw') {
          this.ing.price = res.Response.Price.InstancePrice.UnitPrice
        } else {
          this.ing.price = res.Response.Price.BandwidthPrice.UnitPrice
        }
      })
    },
    // 获取负载均衡器
    getDescribeLoadBalancers: async function () {
      let param = {
        Version: '2018-03-17',
        Forward: 1,
        Offset: 0,
        Limit: 100
      }
      await this.axios.post(TKE_EDSCRIBELOADBALANCERS, param).then(res => {
        let { Response: { LoadBalancerSet } } = res
        this.bindingDescribeLoadBalancers(LoadBalancerSet)
      })
    },
    // 绑定负载均衡器到下拉框
    bindingDescribeLoadBalancers: function (val) {
      let arr = val.filter(item => item.VpcId === this.vpcId)
      arr.forEach((item, index) => {
        let { LoadBalancerId, LoadBalancerName, LoadBalancerType } = item
        this.describeLoadBalancers.push({ LoadBalancerId, LoadBalancerName, LoadBalancerType })
      })
      this.changeTabPosition()
    },
    // 切换网络类型时，改变负载均衡器
    changeTabPosition: function () {
      this.ing.describeLoadBalancersOption = []
      this.ing.describeLoadBalancersValue = '暂无数据'
      let oneDes = []
      if (this.ing.tabPosition === 'gw') {
        oneDes = this.describeLoadBalancers.filter(item => item.LoadBalancerType === 'OPEN')
      } else {
        oneDes = this.describeLoadBalancers.filter(item => item.LoadBalancerType === 'INTERNAL')
      }
      this.ing.describeLoadBalancersOption = oneDes
      if (oneDes.length !== 0) {
        this.ing.describeLoadBalancersValue = oneDes[0].LoadBalancerName
      }
    },
    // 获取子网列表
    getWorkerNetwork: async function () {
      let param = {
        Version: '2017-03-12',
        'Filters.0.Name': 'vpc-id',
        'Filters.0.Values.0': this.vpcId,
        Offset: 0,
        Limit: 100
      }
      await this.axios.post(TKE_WORKER_METWORK, param).then(res => {
        let { Response: { SubnetSet } } = res
        this.ing.workerNetWorkOption = []
        SubnetSet.forEach((item, index) => {
          let { SubnetId, SubnetName, TotalIpAddressCount, AvailableIpAddressCount } = item
          if (index === 0) {
            this.ing.workerNetWorkValue = SubnetName
            this.ing.workerNetWorkOrder = { TotalIpAddressCount, AvailableIpAddressCount }
          }
          this.ing.workerNetWorkOption.push({ SubnetId, SubnetName, TotalIpAddressCount, AvailableIpAddressCount })
        })
      })
    },
    // 获取vps列表
    getVpcNetwork: async function () {
      let param = {
        Version: '2017-03-12',
        'VpcIds.0': this.vpcId,
        Offset: 0,
        Limit: 100
      }
      this.axios.post(TKE_VPC_METWORK, param).then(res => {
        let { Response: { VpcSet } } = res
        VpcSet.forEach((item, index) => {
          if (index === 0) {
            this.ing.vpcsValue = item.VpcName
          }
          this.ing.vpcsOption.push(item.VpcName)
        })
      })
    },
    // 获取集群列表
    getColonyList: async function () {
      let param = {
        'ClusterIds.0': this.clusterId,
        Version: '2018-05-25'
      }
      await this.axios.post(TKE_COLONY_LIST, param).then(res => {
        this.vpcId = res.Response.Clusters[0].ClusterNetworkSettings.VpcId
      })
    },
    // 获取命名空间
    async getNameSpaceList () {
      let param = {
        Method: 'GET',
        Path: '/api/v1/namespaces',
        Version: '2018-05-25',
        ClusterName: this.clusterId
      }
      await this.axios.post(POINT_REQUEST, param).then(res => {
        let searchOpt = JSON.parse(res.Response.ResponseBody).items
        searchOpt.forEach(item => {
          item.value = item.metadata.name
          item.label = item.metadata.name
        })
        this.ing.nameSpaceOptions = searchOpt
        this.ing.nameSpaceValue = searchOpt[0].label
      })
    },
    async getBackEndService () {
      let param = {
        Method: 'GET',
        Path: `/api/v1/namespaces/${this.ing.nameSpaceValue}/services`,
        Version: '2018-05-25',
        ClusterName: this.clusterId
      }
      await this.axios.post(POINT_REQUEST, param).then(res => {
        let { Response: { ResponseBody } } = res
        this.ing.backendService = [{
          metadata: { name: '请选择后端服务' },
          spec: { ports: [] }
        }, ...JSON.parse(ResponseBody).items]
        this.ing.list.forEach(item => {
          item.backendServiceSelect = '请选择后端服务'
        })
      })
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
    max-width: 855px;
    border: 1px solid #ddd;
  }

  .card {
    padding: 10px;
    border-bottom: 1px solid #dcdfe6;
  }

  .borderRed {
    border: 1px solid #e54545;
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
  .tke-fe-alert{
    padding: 10px 30px 10px 20px;
    vertical-align: middle;
    color: #003b80;
    border: 1px solid #97c7ff;
    border-radius: 2px;
    background: #e5f0ff;
    position: relative;
    box-sizing: border-box;
    margin-right: auto;
    display: inline-block;
    margin-left: 20px;
    margin-bottom: 0px;
    max-width: 750px;
    max-height: 120px;
    overflow: auto;
  }
  .tke-fe-alert--error{
    color: #b43537;
    border-color: #f6b5b5;
    background-color: #fcecec;
  }
</style>

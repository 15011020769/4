<!-- 更新转发配置 -->
<template>
  <div class="colony-wrap">
    <!-- 头部 -->
    <div class="tke-content-header">
      <div class="tke-grid ">
        <!-- 左侧 -->
        <div class="grid-left">
          <span class="goback" @click="()=>$router.back()">
            <i class="el-icon-back"></i>
          </span>
          <h2 class="header-title">更新</h2>
        </div>
        <!-- 右侧 -->
      </div>
    </div>
    <div class="colony-main">
      <div class="tke-card tke-formpanel-wrap mb60">
        <el-form class="tke-form" label-position="left" label-width="120px" size="mini" :model="ing" ref="form">
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
                  <el-tooltip content="非通配的域名支持的字符集a-z 0-9.-;通配的域名，目前只支持*.example.com的形式，且单个域名中只出现一次" placement="top" effect="light">
                    <i class="el-icon-warning"></i>
                  </el-tooltip>
                </div>
                <div style="width:80px;">路径</div>
                <div style="width:150px;padding-left:40px;">后端服务
                  <el-tooltip content="转发规则后端服务无法添加访问方式为集群内访问的服务，如有需要可更新服务的访问方式。不支持配置访问方式为不启用的服务" placement="top" effect="light">
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
                  <el-input style="width:200px;padding-left:75px;" placeholder="默认为IPv4 IP"></el-input>
                  <el-form-item style="display: inline-block;width:120px;padding-left:30px;" :prop="`list.${i}.path`" :rules="pathValidator">
                    <el-input v-model="it.path"></el-input>
                  </el-form-item>
                  <el-form-item style="display: inline-block;padding-left:30px;width:150px;" :prop="`list.${i}.backendServiceSelect`" :rules="bssValidator">
                    <el-select v-model="it.backendServiceSelect" placeholder="请选择" @change="backendServiceChange($event, it.key)">
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
                  <div style="display: inline-block">
                    <el-tooltip class="item" effect="dark" content="不可删除，至少指定一个端口映射" placement="right" v-if="ing.list.length === 1">
                      <i style="font-size:18px;padding-left:20px;" class="el-icon-close"></i>
                    </el-tooltip>
                    <i style="font-size:18px;padding-left:20px;" class="el-icon-close" @click="removeprot(it)" v-else></i>
                  </div>
                </div>
              </div>
            </div>
            <a href="javascript:;" @click="addport()">添加转发规则</a>
          </el-form-item>
        </el-form>
      </div>
      <!-- 底部 -->
      <div class="tke-formpanel-footer">
        <el-button size="small" type="primary" @click="submit">完成</el-button>
        <el-button size="small" @click="()=>$router.back()">取消</el-button>
        <div class="tke-fe-alert tke-fe-alert--error" v-if="submitErrorMessage">{{submitErrorMessage}}</div>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
import HeadCom from '@/components/public/Head'
import { ErrorTips } from '@/components/ErrorTips'
import { TKE_GETCERTLIST, TKE_EDSCRIBELOADBALANCERS, POINT_REQUEST } from '@/constants'
export default {
  name: 'configure',
  data () {
    return {
      type: '',
      number: 0,
      se: {
        tabPosition: 'jt',
        radio: '2'
      },
      ing: {
        fz: 'zd',
        checked: true,
        checkedtwo: false,
        name: '',
        tabPosition: 'gw',
        value: '',
        options: [],
        input: '',
        list: [],
        certOption: [],
        certValue: '',
        protocolOption: ['http', 'https'],
        describeLoadBalancersOption: [],
        describeLoadBalancersValue: ''
      },
      clusterId: '',
      namespace: '',
      resourceIns: '',
      pathValidator: [{
        validator: (rule, value, callback) => {
          console.log(value)
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
          if (value === '请选择后端服务') {
            callback(new Error('请选择后端服务'))
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
      submitErrorMessage: '' // 提交失败后的消息
    }
  },
  components: { HeadCom },
  watch: {
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
    }
  },
  created () {
    let { clusterId, np, resourceIns } = this.$route.query
    this.clusterId = clusterId
    this.namespace = np
    this.resourceIns = resourceIns
    this.initNetworkRequery()
  },
  methods: {
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
    protocolChange: function (event, key) {
      this.selectIngList(key, (result) => {
        if (result.protocolValue === 'http') {
          result.portNumber = 80
        } else {
          result.portNumber = 443
        }
      })
    },
    backendServiceChange: function (event, key, backendServicePortSelect) {
      this.selectIngList(key, (result) => {
        let portsArr = this.ing.backendService.find(item => {
          return item.metadata.name === result.backendServiceSelect
        }).spec.ports
        result.backendServicePortOption = [{ port: '请选择端口' }, ...portsArr]
        result.backendServicePortSelect = backendServicePortSelect || '请选择端口'
      })
    },
    initNetworkRequery: async function () {
      await this.getBackEndService()
      await this.getIngressDetail()
      // this.nameSpaceList()
      this.getCertList()
      this.getDescribeLoadBalancers()
    },
    // 命名空间选项
    /*  nameSpaceList () {
        if (this.clusterId) {
          var params = {
            Method: 'GET',
            Path: `/api/v1/namespaces/${this.namespace}/services`,
            Version: '2018-05-25',
            ClusterName: this.clusterId
          }
          this.axios.post(TKE_COLONY_QUERY, params).then(res => {
            if (res.Response.Error === undefined) {
              var data = JSON.parse(res.Response.ResponseBody)
              data.items.forEach(item => {
                this.cm.options.push(item.metadata.name)
              })
            }
          })
        }
      }, */
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
        let newArr = res.data.list.filter(item => item.status === 1)
        newArr.forEach((item, index) => {
          let { alias, id } = item
          if (alias === '') {
            alias = '未命名'
          }
          this.ing.certOption.push({ alias, id })
        })
        console.log('this.ing.certOption', this.ing.certOption)
        if (this.ing.certOption.length > 0) {
          this.ing.certValue = this.ing.certOption[0].id
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
    getIngressDetail: async function () {
      let param = {
        Method: 'GET',
        Path: `/apis/extensions/v1beta1/namespaces/${this.namespace}/ingresses/${this.resourceIns}`,
        Version: '2018-05-25',
        ClusterName: this.clusterId
      }
      await this.axios.post(POINT_REQUEST, param).then(res => {
        if (res.Response.Error === undefined) {
          var mes = JSON.parse(res.Response.ResponseBody)
          this.ingressDetail = mes
          let httpText = mes.metadata.annotations['kubernetes.io/ingress.http-rules']
          let httpsText = mes.metadata.annotations['kubernetes.io/ingress.https-rules']
          this.ing.certValue = mes.metadata.annotations.qcloud_cert_id
          this.ing.extensiveParameters = mes.metadata.annotations['kubernetes.io/ingress.extensiveParameters']
          this.ing.checkedtwo = mes.metadata.annotations['kubernetes.io/ingress.rule-mix'] === 'true'
          let tempFuncCount = 0
          let tempFunc = (item, protocol, listenPort) => {
            let tempArr = {}
            tempArr.key = tempFuncCount++
            tempArr.portNumber = protocol === 'http' ? 80 : 443
            tempArr.protocol = tempArr.protocolValue = protocol
            tempArr.listenPort = listenPort
            tempArr.backend = tempArr.backendServiceSelect = item.backend.serviceName
            tempArr.servicePort = tempArr.backendServicePortSelect = item.backend.servicePort
            tempArr.domainName = mes.status.loadBalancer && mes.status.loadBalancer && mes.status.loadBalancer.ingress && mes.status.loadBalancer.ingress[0].ip
            tempArr.path = item.path
            this.ing.list.push(tempArr)
            this.backendServiceChange(null, tempArr.key, item.backend.servicePort)
          }
          let httpArr = JSON.parse(httpText)
          let httpsArr = JSON.parse(httpsText)
          if (httpArr) {
            httpArr.forEach((item) => {
              tempFunc(item, 'http', 80)
            })
            this.ing.protocolOption = ['http']
          }
          if (httpsArr) {
            httpsArr.forEach((item) => {
              tempFunc(item, 'https', 443)
            })
            this.ing.protocolOption = ['http', 'https']
          }
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
    // 绑定负载均衡器到下拉框
    bindingDescribeLoadBalancers: function (val) {
      val.forEach((item, index) => {
        let { LoadBalancerId, LoadBalancerName } = item
        if (index === 0) this.ing.describeLoadBalancersValue = LoadBalancerId
        this.ing.describeLoadBalancersOption.push({ LoadBalancerId, LoadBalancerName })
      })
    },
    getBackEndService: async function () {
      let param = {
        Method: 'GET',
        Path: `/api/v1/namespaces/${this.namespace}/services`,
        Version: '2018-05-25',
        ClusterName: this.clusterId
      }
      await this.axios.post(POINT_REQUEST, param).then(res => {
        let { Response: { ResponseBody } } = res
        this.ing.backendService = [{
          metadata: { name: '请选择后端服务' },
          spec: { ports: [] }
        }, ...JSON.parse(ResponseBody).items]
      })
    },
    submit: async function () {
      this.submitErrorMessage = ''
      let { list, checkedtwo, certValue } = this.ing
      let httpRules = []
      let httpsRules = []
      let specRules = []
      list.forEach(item => {
        let rules = {
          path: item.path,
          backend: { serviceName: item.backendServiceSelect, servicePort: item.backendServicePortSelect.toString() }
        }
        if (item.protocolValue === 'http') {
          httpRules.push(rules)
        } else {
          httpsRules.push(rules)
        }
        specRules.push({
          http: {
            paths: [{
              'backend': {
                'serviceName': item.backendServiceSelect,
                'servicePort': parseInt(item.backendServicePortSelect)
              },
              'path': item.path
            }]
          }
        })
        console.log('1', specRules)
      })
      let ingressQueryBody = {
        'kind': 'Ingress',
        'apiVersion': 'extensions/v1beta1',
        'metadata': {
          'name': this.resourceIns,
          'namespace': this.namespace,
          'annotations': {
            'kubernetes.io/ingress.class': 'qcloud',
            'kubernetes.io/ingress.extensiveParameters': '{"AddressIPVersion":"IPV4"}',
            'kubernetes.io/ingress.http-rules': JSON.stringify(httpRules),
            'kubernetes.io/ingress.https-rules': JSON.stringify(httpsRules),
            // 'kubernetes.io/ingress.qcloud-loadbalance-id': this.ing.describeLoadBalancersValue,
            'kubernetes.io/ingress.rule-mix': `${checkedtwo}`,
          }
        },
        'spec': {
          'rules': specRules
        }
      }
      let queryBodyJson = ''
      if (checkedtwo) {
        let secretQueryBody = {
          'kind': 'Secret',
          'apiVersion': 'v1',
          'metadata': {
            'name': this.resourceIns,
            'namespace': this.namespace,
            'labels': {
              'qcloud-app': this.resourceIns
            }
          },
          'type': 'Opaque',
          'data': {
            'qcloud_cert_id': ''
          }
        }
        ingressQueryBody.spec['tls'] = [{ 'secretName': this.resourceIns }]
        ingressQueryBody.metadata.annotations.qcloud_cert_id = certValue
        queryBodyJson = JSON.stringify(secretQueryBody) + JSON.stringify(ingressQueryBody)
      } else {
        queryBodyJson = JSON.stringify(ingressQueryBody)
      }
      let param = {
        Method: 'POST',
        Path: `/apis/platform.tke/v1/clusters/${this.clusterId}/apply`,
        Version: '2018-05-25',
        RequestBody: queryBodyJson,
        ClusterName: this.clusterId
      }
      await this.axios.post(POINT_REQUEST, param).then(res => {
        if (res.Response.Error === undefined) {
          this.$message({
            message: '更改成功',
            showClose: true,
            type: 'success',
            duration: 2000
          })
          this.$router.replace({
            path: '/colony/sub/list/service/ingress',
            query: {
              clusterId: this.clusterId
            }
          })
        } else {
          this.submitErrorMessage = JSON.parse(res.Response.Error.Message).message
        }
      })
      console.log('this.ing', this.ing)
      console.log('param', param)
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
        backendServiceSelect: '请选择后端服务', // 命名空间选中的值
        backendServicePortOption: [],
        backendServicePortSelect: '', // 选中的端口号
        path: '' // 路径
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .colony-wrap .colony-main {
    padding: 20px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }

  .box-card {
    width: 100%;
    margin: 20px 0;
  }

  .box-black {
    margin: 10px;
    background: black;
  }

  .port {
    max-width: 855px;
    border: 1px solid #ddd;
  }

  .flex {
    display: flex;
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

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
        <el-form class="tke-form" :model="ing" label-position='left' label-width="120px" size="mini">
          <el-form-item label="名称">
            <el-input class="w200" v-model="ing.name" placeholder="请输入Ingress名称"></el-input>
            <p>最长63个字符，只能包含小写字母、数字及分隔符("-")，且必须以小写字母开头，数字或小写字母结尾</p>
          </el-form-item>
          <el-form-item label="描述">
            <textarea name="" class="ms" placeholder="请输入描述信息，不超过1000个字符" id="" cols="30" rows="10"></textarea>
          </el-form-item>
          <el-form-item label="Ingress类型">
            <div>应用型负载均衡器（支持HTTP / HTTPS <span>0.02</span> 元 / 小时)</div>
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
              <el-select v-model="ing.value" placeholder="请选择" disabled class="borderRed">
                <el-option
                  v-for="item in ing.options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <i class="el-icon-warning text-error" style="margin-left:10px;font-size:16px;"></i>
            </div>
          </el-form-item>
          <el-form-item label=""></el-form-item>
          <el-form-item label="命名空间">
            <el-select v-model="ing.value" placeholder="请选择">
              <el-option
                v-for="(item,index) in ing.options"
                :key="index"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="ing.tabPosition=='nw'" label="所属网络">
            <el-select v-model="ing.value" placeholder="请选择">
              <el-option
                v-for="item in ing.options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-select v-model="ing.value" placeholder="请选择">
              <el-option
                v-for="item in ing.options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-button style="border:none;"><i class="el-icon-refresh"></i></el-button>
            共<span>253</span>个子网点，剩下<span>156</span>个可用
          </el-form-item>
          <el-form-item label="监听端口">
            <el-checkbox disabled v-model="ing.checked">Http:80</el-checkbox>
            <el-checkbox v-model="ing.checkedtwo">Https:443</el-checkbox>
          </el-form-item>
          <el-form-item label="服务器证书" v-if="ing.checkedtwo">
            <el-select v-model="ing.certValue" placeholder="请选择">
              <el-option
                v-for="item in ing.certList"
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
                <div style="padding:5px 0;" v-for="it in ing.list" :key="it.key">
                  <el-select style="width:120px;" v-model="ing.value" placeholder="请选择">
                    <el-option
                      v-for="item in ing.options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <span style="padding-left:23px">80</span>
                  <el-input style="width:200px;padding-left:75px;" placeholder="默认为IPv4 IP"></el-input>
                  <el-input style="width:120px;padding-left:30px;"></el-input>
                  <el-select v-model="NameSpaceSelect" placeholder="请选择" style="padding-left:30px;width:150px;">
                    <el-option
                      v-for="item in NameSpaceList"
                      :key="item.metadata.name"
                      :label="item.metadata.name"
                      :value="item.spec.ports">
                    </el-option>
                  </el-select>
                  <el-select v-model="portSelect" placeholder="请选择" style="padding-left:30px;width:150px;" :disabled="!NameSpaceSelect.length">
                    <el-option
                      v-for="item in NameSpaceSelect"
                      :key="item.name"
                      :label="item.port"
                      :value="item.port">
                    </el-option>
                  </el-select>
                  <el-tooltip class="item" effect="dark" content="删除" placement="right">
                    <i style="font-size:18px;padding-left:20px;" class="el-icon-close" @click="removeprot(it)"></i>
                  </el-tooltip>
                </div>
              </div>
            </div>
            <a href="javascript:;" @click="addport()">添加转发规则</a>
          </el-form-item>
        </el-form>
        <!-- 底部 -->
        <div class="tke-formpanel-footer">
          <el-button size="small" type="primary">创建Ingress</el-button>
          <el-button size="small">取消</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import {
  ALL_CITY,
  TKE_GETCERTLIST,
  TKE_DESCRIBELISTENERS,
  TKE_INQUIRYPRICE,
  TKE_EDSCRIBELOADBALANCERS,
  TKE_Worker_METWORK,
  TKE_VPC_METWORK,
  TKE_COLONY_LIST,
  POINT_REQUEST
} from '@/constants'
export default {
  name: 'svcCreate',
  data () {
    return {
      dialogFormVisible: false,
      clusterId: '',
      namespace: '', // route 传入的命名空间名
      NameSpaceList: [], // 命名空间列表
      NameSpaceSelect: {}, // 命名空间选中的值
      portSelect: '', // 选中的端口号
      certList: [], // 证书列表
      ing: {
        fz: 'zd',
        checked: true,
        checkedtwo: false,
        name: '',
        tabPosition: 'gw',
        value: '',
        options: [],
        input: '',
        certValue: '',
        certList: [],
        list: [{}]
      }
    }
  },
  components: {},
  watch: {
    NameSpaceSelect: function (val) {
      console.log(val)
      this.portSelect = ''
    }
  },
  created () {
    // 从路由获取类型
    let { clusterId, np } = this.$route.query
    this.clusterId = clusterId
    this.namespace = np
    this.getCertList()
    this.getDescribeListeners()
    this.getInquiryPrice()
    this.getDescribeLoadBalancers()
    this.getWorkerNetwork()
    this.getVpcNetwork()
    this.getColonyList()
    this.getNameSpaceList()
  },
  methods: {
    removeprot (item) {
      var index = this.ing.list.indexOf(item)
      if (index !== -1) {
        this.ing.list.splice(index, 1)
      }
    },
    addport () {
      this.ing.list.push({
        value: '',
        key: Date.now()
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
        res.data.list.forEach((item) => {
          let { alias, id } = item
          if (alias === '') {
            alias = '未命名'
          }
          this.ing.certList.push({ alias, id })
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
        'InternetAccessible.InternetChargeType': 'BANDWIDTH_POSTPAID_BY_HOUR',
        'InternetAccessible.InternetMaxBandwidthOut': 1
      }
      await this.axios.post(TKE_INQUIRYPRICE, param).then(res => {
        console.log('getInquiryPrice', res)
      })
    },
    // 获取描述平衡器
    getDescribeLoadBalancers: async function () {
      let param = {
        Version: '2018-03-17',
        Forward: 1,
        Offset: 0,
        Limit: 100
      }
      await this.axios.post(TKE_EDSCRIBELOADBALANCERS, param).then(res => {
        console.log('getDescribeLoadBalancers', res)
      })
    },
    // 获取子网列表
    getWorkerNetwork: async function () {
      let param = {
        Version: '2017-03-12',
        'Filters.0.Name': 'vpc-id',
        'Filters.0.Values.0': 'vpc-apm60zou',
        Offset: 0,
        Limit: 100
      }
      this.axios.post(TKE_Worker_METWORK, param).then(res => {
        console.log('getWorkerNetwork', res)
      })
    },
    // 获取子网列表
    getVpcNetwork: async function () {
      let param = {
        Version: '2017-03-12',
        'VpcIds.0': 'vpc-apm60zou',
        Offset: 0,
        Limit: 100
      }
      this.axios.post(TKE_VPC_METWORK, param).then(res => {
        console.log('getVpcNetwork', res)
      })
    },
    // 获取集群列表
    getColonyList: async function () {
      let param = {
        'ClusterIds.0': 'cls-a7rua9ae',
        Version: '2018-05-25'
      }
      this.axios.post(TKE_COLONY_LIST, param).then(res => {
        console.log('getColonyList', res)
      })
    },
    // 获取命名空间
    async getNameSpaceList () {
      let param = {
        Method: 'GET',
        Path: `/api/v1/namespaces/${this.namespace}/services`,
        Version: '2018-05-25',
        ClusterName: this.clusterId
      }

      await this.axios.post(POINT_REQUEST, param).then(res => {
        let { Response: { ResponseBody } } = res
        this.NameSpaceList = JSON.parse(ResponseBody).items
        console.log('getNameSpaceList', res)
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
 </style>

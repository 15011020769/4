<template>
  <div class="container">
    <span class="tip">{{t('防护域名必须和负载均衡监听器进行绑定，才能对监听器中添加域名的HTTP或HTTPS流量进行防护', 'WAF.fhymlb')}}。</span>
    <el-row type="flex" class="col">
      <el-col :span="3">
        <label class="label">地域</label>
      </el-col>
      <el-col>
        <el-button type="primary" size="small">台北<span v-show="selectedTotal > 0">（{{selectedTotal}}）</span></el-button>
      </el-col>
    </el-row>
    <el-row type="flex" class="col">
      <el-col :span="3">
        <label class="label">{{t('负载均衡 - 监听器', 'WAF.lblis')}}</label>
      </el-col>
      <el-col>
        <el-input class="lb-input" :placeholder="t('请选择负载均衡实例', 'WAF.xzlbi')" />
          <ul class="lb-container">
            <li v-for="item in clbs" :key="item.LoadBalancerId">
              <p>
                <span class="lbname">{{item.LoadBalancerName}}（{{item.LoadBalancerId}}）</span>
                <el-button type="text" @click="openListenDialog(item)">
                  <span v-if="item.checkedListeners.length">
                    {{t('重新选择', 'WAF.resel')}}
                  </span>
                  <span v-else>
                    {{t('选择监听器', 'WAF.sellis')}}
                  </span>
                </el-button>
              </p>
              <p class="selcted ellipsis">
                {{t('已选择', 'WAF.yxz')}}{{item.checkedListeners.length}}个
                <span v-if="item.checkedListeners.length">
                  : {{item.checkedListeners.map(checkedListener => checkedListener.ListenerName).join('，')}}
                </span>
              </p>
            </li>
          </ul>
      </el-col>
    </el-row>
    <el-row type="flex" class="col">
      <el-col :span="3">
      </el-col>
      <el-col>
         <el-button type="primary" @click="add" :loading="reqLoading" size="small">完成</el-button>
      </el-col>
    </el-row>
    <el-dialog
      :title="t('选择监听器', 'WAF.sellis')"
      :visible.sync="dialogVisible"
      @close="beforeClose"
      width="840px"
    >
      <el-row type="flex" :gutter="10" class="dialog-container">
        <el-col>
          <el-input class="listener-input" v-model="keyword" :placeholder="t('请输入关键字', 'WAF.qsrgjz')" />
          <ul class="listener-container">
            <li class="listen-tip" v-if="queryListenerLoading">{{t('加载中', 'WAF.jzz')}} <i class="el-icon-loading"/></li>
            <template v-if="listeners.length > 0">
              <li v-for="item in listeners" :key="item.ListenerId">
                <label>
                  <div class="listen">
                    <el-checkbox :label="item.ListenerId" v-model="checkedListenerIds">
                      <div>
                        <p class="ellipsis">{{item.ListenerName}}({{item.ListenerId}})</p>
                        <p>{{item.Protocol.toLowerCase()}}://{{domain.domain}}:{{item.Port}}</p>
                      </div>
                    </el-checkbox>
                  </div> 
                </label>
              </li>
            </template>
            <li class="listen-tip" v-if="!queryListenerLoading && listeners.length === 0">
              {{t('没有找到对应域名的监听器，前往', 'WAF.myzddyym')}}
              <el-link type="primary" target="_blank" href="../CLB/index.html#/LB">{{t('负载均衡', 'WAF.clb')}}</el-link>
              配置
            </li>
          </ul>
        </el-col>
        <div class="direction">
          <div class="direction-icon">
            <i class="iconfont">&#xe603;</i>
          </div>
        </div>
        <el-col>
          <ul class="listener-container selected-listener-container">
            <li v-for="item in checkedListeners" :key="item.ListenerId">
              <div class="listen">
                <div>
                  <p class="ellipsis">{{item.ListenerName}}({{item.ListenerId}})</p>
                  <p>{{item.Protocol.toLowerCase()}}://{{domain.domain}}:{{item.Port}}</p>
                </div>
                <i class="el-icon-close del-listener" @click="remove(item.ListenerId)"></i>
              </div> 
            </li>
          </ul>
        </el-col>
      </el-row>
      <el-row class="dialog-footer">
        <el-button size="small" type="primary" @click="confirm">{{t('确 定', 'WAF.qd')}}</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import { CLB_LIST, DESCRIBE_LISTENERS, CREATE_HOST, MODIFY_HOST } from '@/constants'
import { ErrorTips } from '@/components/ErrorTips'
import { COMMON_ERROR } from '../../constants'
import { flatObj } from '@/utils'
export default {
  props: {
    domain: Object
  },
  computed: {
    selectedTotal() {
      return this.clbs.map(clb => clb.checkedListeners).flat().length
    }
  },
  data() {
    return {
      selectedCLB: {},
      keyword: '',
      clbs: [],
      listeners: [],
      listenersCopy: [],
      checkedListeners: [],
      checkedListenerIds: [],
      dialogVisible: false,
      reqLoading: false,
      queryListenerLoading: true,
    }
  },
  watch: {
    checkedListenerIds(n) {
      this.checkedListeners = this.listeners.filter(listener => n.includes(listener.ListenerId))
    },
    keyword(n) {
      if (n.trim()) {
        this.listeners = this.listenersCopy.filter(listener => listener.ListenerName.includes(n.trim()))
      } else {
        this.listeners = this.listenersCopy
      }
    },
  },
  mounted() {
    this.reqLoading = false
    this.axios.post(CLB_LIST, {
      Version: '2018-03-17',
      Region: 'ap-taipei', // ,'ap-taipei'
      Forward: 1,
      LoadBalancerType: 'OPEN',
      Offset: 0,
      Limit: 100
    })
    .then(resp => {
      this.generalRespHandler(resp, ({ LoadBalancerSet }) => {
        const clbs = LoadBalancerSet
        const existsClbs = this.domain.LoadBalancerSet || []
        clbs.forEach(clb => {
          clb.checkedListeners = existsClbs.filter(eclb => eclb.LoadBalancerId === clb.LoadBalancerId)
        })
        this.clbs = clbs
      })
    })
  },
  methods: {
    add() {
      this.reqLoading = true
      const lbset = []
      let url = CREATE_HOST
      if (this.domain.DomainId) {
        url = MODIFY_HOST
      }
      this.clbs.forEach(clb => {
        lbset.push(
          ...clb.checkedListeners.map(listener => ({
            ListenerId: listener.ListenerId,
            ListenerName: listener.ListenerName,
            Vport: listener.Port,
            Protocol: listener.Protocol,
            LoadBalancerId: clb.LoadBalancerId,
            LoadBalancerName: clb.LoadBalancerName,
            Vip: clb.LoadBalancerVips[0],
            Zone: '',
            Region: 'tpe', // tp1
          }))
        )
      })
      this.axios.post(url, flatObj({
        Version: '2018-01-25',
        Host: {
          Domain: this.domain.Domain,
          IsCdn: this.domain.IsCdn,
          Region: 'tpe', // tp1
          LoadBalancerSet: lbset,
          DomainId: this.domain.DomainId || '',
        }
      }))
      .then(resp => {
        this.generalRespHandler(resp, () => {
          this.$router.push({name: 'protectionSettings'})
        }, COMMON_ERROR, `${this.domain.DomainId ? this.t('编辑', 'WAF.bj') : '添加'}成功`)
      })
      .then(() => {
        this.reqLoading = false
      })
    },
    confirm() {
      const clb = this.clbs.find(clb => clb.LoadBalancerId === this.selectedCLB.LoadBalancerId)
      clb.checkedListeners = [...this.checkedListeners]
      this.dialogVisible = false
    },
    beforeClose() {
      this.selectedCLBId = ''
      this.checkedListenerIds = []
      this.checkedListeners = []
      this.listeners = []
      this.listenersCopy = []
    },
    remove(listenerId) {
      this.checkedListenerIds = this.checkedListenerIds.filter(checkedListenerId => checkedListenerId !== listenerId)
    },
    openListenDialog(clb) {
      this.selectedCLB = clb
      this.queryListenerLoading = true
      this.queryListener(this.selectedCLB.LoadBalancerId)
      this.dialogVisible = true
    },
    queryListener(lbId) {
      this.axios.post(DESCRIBE_LISTENERS, {
        LoadBalancerId: lbId,
        Version: '2018-03-17',
        Region: 'ap-taipei', // 'ap-taipei',
      })
      .then(resp => {
        this.generalRespHandler(resp, ({ Listeners }) => {
          // 过滤非当前域名的监听器
          const listeners = Listeners.filter(listener => listener.Rules && listener.Rules.some(rule => rule.Domain === this.domain.Domain))
          this.listeners = listeners
          this.listenersCopy = listeners
          this.checkedListenerIds = [...this.selectedCLB.checkedListeners.map(checkedListener => checkedListener.ListenerId)]
        })
      })
      .then(() => {
        this.queryListenerLoading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.container {
  margin-left: 20px;
  margin-top: 20px;
}
.tip {
  background-color: #fff4e3;
  color: #c07400;
  border-color: #ffd18b;
  font-size: 12px;
  font-weight: normal;
  padding: 10px 20px;
  border: 1px solid #97c7ff;
  height: 38px;
  line-height: 38px;
  margin-top: 20px;
  // display: inline-block;
}
.col {
  margin-top: 20px;
}
.label {
  color: #888;
}
.lb-input, .listener-input, .lb-container, .listener-container {
  font-size: 12px;
  width: 382px;
}
.lb-container, .listener-container {
  border: 1px solid #dcdfe6;
  border-top: none;
  max-height: 440px;
  overflow-y: scroll;
  li {
    padding: 0 10px;
    border-bottom: 1px solid #dcdfe6;
    .lbname {
      display: inline-block;
      width: 281px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
    &:last-of-type {
      border-bottom: none;
    }
    &:first-of-type {
      border-bottom: 1px solid #dcdfe6 !important;
    }
    p {
      height: 28px;
      line-height: 28px;
      &:first-of-type {
        display: flex;
        align-items: center;
        justify-content: space-between;
        button {
          font-size: 12px;
        }
      }
    }
  }
}
.selected {
  color: #bbb;
}
.listener-container {
  height: 340px;
  .listen {
    display: flex;
    align-items: center;
    padding: 5px 0;
    cursor: pointer;
    ::v-deep .el-checkbox {
      display: flex;
      align-items: center;
    }
    label {
      margin-right: 10px;
    }
    p {
      height: auto;
      line-height: 20px;
      font-size: 12px;
      &:first-of-type {
        width: 335px;
        display: block;
        color: #404a58;
      }
      &:last-of-type {
        color: #bbb;
      }
    }
  }
}
.selected-listener-container {
  height: 380px;
  border-top: 1px solid #dcdfe6;
  .listen {
    justify-content: space-between;
    cursor: default;
  }
}
.selcted {
  color: #bbb;
}
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.direction {
  transform: translateY(50%);
}
.del-listener {
  cursor: pointer;
}
.dialog-footer {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
.listen-tip {
  line-height: 40px;
  text-align: center;
}
</style>
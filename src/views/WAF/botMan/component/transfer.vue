<!--
 * @Author: T
 * @Date: 2020-02-20 13:32:35
 * @LastEditTime: 2020-02-28 12:31:21
 * @LastEditors: Please set LastEditors
 * @Description: 复制弹窗-穿梭框
 * @FilePath: /new_product/src/views/WAF/botMan/component/transfer.vue
 -->
<template>
  <div class="main">
    <span style="font-size: 12px">
      {{
        t(
          "您可以将当前域名的策略复制到其他开启了BOT流量分析的域名，最多可选20个。",
          "WAF.zwsjqqrym"
        )
      }}
    </span>
    <div class="transfer-box">
      <div class="left content-wrapper">
        <h4 class="title">{{ t("请选择", "WAF.qxz") }}域名</h4>
        <div class="content">
          <el-input v-model="inputSearch" class="domain-input">
            <div slot="suffix" class="input-search">
              <i style="cursor: pointer" class="el-icon-search" />
            </div>
          </el-input>
          <ul class="list-wrapper">
            <template v-if="!showLoading">
              <el-checkbox-group v-model="checkList">
                <li v-for="item in ulData" :key="item.id" class="list-content">
                  <el-checkbox name="ff" :label="item">
                    <div>
                      {{ item.Domain }}
                    </div>
                  </el-checkbox>
                </li>
              </el-checkbox-group>
              <li
                v-if="ulData.length === 0"
                class="list-content"
                style="text-align: center; display: flex; justify-content: center; font-size: 12px;"
              >
                {{
                  t(
                    "暂无数据，请确认域名是否开启了BOT流量分析",
                    "WAF.zwsjqqrym"
                  )
                }}
              </li>
            </template>
            <li
              v-if="showLoading"
              class="list-content"
              style="text-align: center; display: flex; justify-content: center"
            >
              <i class="el-icon-loading" />
              {{ t("载入中", "WAF.zrz") }}...
            </li>
          </ul>
        </div>
      </div>
      <i class="iconfont">&#xe603;</i>
      <div class="right content-wrapper">
        <h4 class="title">
          {{ t("已选择", "WAF.yxz") }}({{ checkList.length }})
        </h4>
        <div class="content">
          <ul class="list-wrapper right-wrapper">
            <li v-for="item in checkList" :key="item.id" class="list-content">
              <!-- <el-checkbox label=""/> -->
              <div class="right-list-contnt">
                <span>{{ item.Domain }}</span>
                <i
                  @click="onDelete(item)"
                  style="cursor: pointer"
                  class="el-icon-close"
                />
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <el-row type="flex" justify="center" style="margin-top: 30px;">
      <el-button
        style="padding: 5px 10px; margin-right: 10px;"
        :disabled="checkList.length === 0"
        :loading="loading"
        type="primary"
        @click="onSubmit"
        >{{ t("复制", "WAF.copy") }}</el-button
      >
      <el-button
        style="padding: 5px 10px; margin-right: 10px;"
        :disabled="loading"
        @click="onClose"
        >取消</el-button
      >
    </el-row>
  </div>
</template>

<script>
import { DESCRIBE_HOSTS, DESCRIBE_BOT_STATUS, COPY_BOT_UCB_PREINSTALL_RULE, COPY_BOTTCB_RULE, COPY_BOT_UCB_FEATURE_RULES } from '@/constants'
import { COMMON_ERROR } from '../../constants'

export default {
  props: {
    iptDomain: String,
    dialogVisible: Boolean,
    category: String,
    ruleNames: String
  },
  data () {
    return {
      ulData: [],
      checkList: [],
      inputSearch: '',
      showLoading: false,
      loading: false
    }
  },
  watch: {
    inputSearch (n, o) {
      let arr = [].concat(this.checkList)
      if (n.length) {
        this.ulData = this.ulData.filter(item => {
          return item.Domain.indexOf(n) > -1
        })
        return
      }
      this.ulData = JSON.parse(localStorage.getItem('data'))
      this.checkList = arr
    },
    iptDomain (n, o) {
      this.getDescribeHost()
    },
    checkList (val, oldVal) {
      if (val.length === 20) {
        this.$message({
          message: '最多只能选20个',
          type: 'error',
          showClose: true,
          duration: 0
        })
        this.checkList = oldVal
      }
    }
  },
  mounted () {
    this.getDescribeHost()
  },
  methods: {
    onDelete (item) {
      const currtIndex = this.checkList.findIndex(_item => _item.id === item.id)
      this.checkList.splice(currtIndex, 1)
    },
    onClose () {
      this.$emit('update:dialogVisible', false)
    },
    // 获取防护域名列表
    getDescribeHost () {
      console.log(111)
      let params = {
        Version: '2018-01-25'
      }
      this.showLoading = true
      this.axios.post(DESCRIBE_HOSTS, params)
        .then(resp => {
          this.generalRespHandler(resp, ({ HostList }) => {
            this.ulData = HostList
            this.getBotStatus()
          })
        })
    },

    // 查询bot开关
    getBotStatus () {
      console.log(123)
      let params = {
        Version: '2018-01-25',
        Category: 'bot'
      }
      this.axios.post(DESCRIBE_BOT_STATUS, params)
        .then(resp => {
          this.generalRespHandler(resp, ({ Data }) => {
            const botArr = Data.Res
            this.ulData.forEach(item => {
              let temp = botArr.find(_item => _item.Domain === item.Domain)
              temp && this.$set(item, 'botStatus', temp.Status)
            })
            this.showLoading = false
            this.ulData = this.ulData.filter(item => item.botStatus > 0 && item.Domain !== this.iptDomain)
            localStorage.setItem('data', JSON.stringify(this.ulData))
          })
        })
    },

    // 确定
    onSubmit () {
      this.loading = true
      let Target = this.checkList.reduce((prev, next, index) => {
        let str
        if (index === this.checkList.length - 1) {
          str = next.Domain
        } else {
          str = next.Domain + ';'
        }
        return prev.concat(str)
      }, '')
      let params = {
        Version: '2018-01-25',
        Domain: this.iptDomain,
        Target
      }
      let url = COPY_BOTTCB_RULE // 复制公开类型
      if (this.category) { // 复制自定义会话策略
        if (this.category === 'ucb') {
          url = COPY_BOT_UCB_FEATURE_RULES
          params.Rules = this.ruleNames
        } else {
          params.Category = this.category === 'xy' ? 1 : 2
          url = COPY_BOT_UCB_PREINSTALL_RULE
        }
      }
      this.axios.post(url, params)
        .then(res => {
          this.generalRespHandler(res, this.onClose, COMMON_ERROR, `${this.t('复制', 'WAF.copy')}成功`)
        }).then(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
  .transfer-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .content-wrapper {
    width: 380px;
    box-sizing: border-box;
    ::v-deep .el-input__suffix {
      display: flex;
      align-items: center;
    }
  }
  .content {
    border: 1px solid #ddd;
  }
  .list-wrapper {
    height: 350px;
    overflow-y: scroll;
    .list-content {
      height: 50px;
      display: flex;
      align-items: center;
      padding: 10px;
      box-sizing: border-box;
      border-bottom: 1px solid #ddd;
    }
  }
  .right-wrapper {
    height: 380px;
  }
  .right-list-contnt {
    padding-right: 20px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
.domain-input {
  ::v-deep input {
    border-top: none;
    border-left: none;
    border-right: none;
  }
}
.title {
  font-size: 12px;
}
</style>

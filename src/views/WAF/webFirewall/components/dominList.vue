<template>
  <div>
    <div class="dominList">
      <div class="dominListTitle">
        域名{{t('列表', 'WAF.qingdan')}}
      </div>
      <el-row type="flex" justify="space-between">
        <el-col :span="12">
          <el-row type="flex" align="middle">
            <el-button
              type="primary"
              @click="$router.push({ name: 'protectDomain' })"
              >添加域名</el-button
            >
            <el-button
              type="primary"
              :disabled="checkedWafs.length === 0"
              @click="enableWAF"
              >{{ t("开启", "WAF.open") }}</el-button
            >
            <el-button
              type="primary"
              :disabled="checkedWafs.length === 0"
              @click="disableWAF"
              >{{ t("关闭", "WAF.close") }}</el-button
            >
            <el-button
              type="primary"
              :disabled="checkedWafs.length === 0"
              @click="del"
              >删除</el-button
            >
            <span style="margin-left: 15px"
              >{{ t("一级域名套餐", "WAF.yjymtc")
              }}{{
                package.MainDomainLimit === package.MainDomainCount
                  ? "已用完，"
                  : `${t("还剩余", "WAF.hsy")}${package.MainDomainLimit -
                      package.MainDomainCount}${t("个", "WAF.g")}`
              }}
              <a
                @click="packageUpgradeModel"
                v-if="package.MainDomainLimit === package.MainDomainCount"
                >{{ t("立即升级", "WAF.ljsj") }}</a
              >
              ；{{ t("子域名套餐还剩余", "WAF.zymtchsy")
              }}{{
                package.DomainLimit &&
                  package.DomainLimit - package.DomainCount
              }}个。</span
            >
          </el-row>
        </el-col>
        <el-input
          :placeholder="
            t('支持域名、负载均衡名称、监听器名称模糊搜索', 'WAF.zcymlbkis')
          "
          v-model="keyword"
          class="search-input"
        >
          <i
            class="el-icon-search el-input__icon"
            slot="suffix"
            @click="getData"
          />
        </el-input>
      </el-row>
      <div class="tableList">
        <el-table
          :data="domains"
          @selection-change="handleSelectionChange"
          v-loading="loading"
          ref="table"
        >
          <el-table-column type="selection" width="55" :selectable="checkAble">
          </el-table-column>
          <el-table-column prop="domin" label="域名/ID">
            <template slot-scope="scope">
              <el-link type="primary" @click.native.prevent="toProtectConfig(scope.row)">{{scope.row.Domain}}</el-link>
              <p>{{scope.row.DomainId}} <i v-if="abnormal.includes(scope.row.State)" class="el-icon-loading" /><i v-if="scope.row.State === 0" class="el-icon-success" /></p>
            </template>
          </el-table-column>
          <el-table-column prop="proStatus" width="110">
            <div slot="header" style="padding: 0;">
              流量模式
              <el-tooltip
                placement="right-end"
                effect="light"
                class="mode-tooltip"
              >
                <i class="el-icon-info"></i>
                <img
                  slot="content"
                  src="~@/assets/WAF/wafmode.png"
                  style="width: 1000px"
                />
              </el-tooltip>
            </div>
            <template slot-scope="scope">
              {{
                scope.row.Mode === 1 ? t("镜像模式", "WAF.jxms") : "清洗模式"
              }}
            </template>
          </el-table-column>
          <el-table-column
            prop="vipAddress"
            :label="t('区域', 'WAF.qy')"
            width="70"
          >
            <template slot-scope="scope">
              中國台北
            </template>
          </el-table-column>
          <el-table-column :label="t('负载均衡（ID）', 'WAF.lbid')" width="110">
            <template slot-scope="scope">
              <span v-if="scope.row.LoadBalancerSet.length">
                <p
                  v-for="Id in uniqueId(scope.row.LoadBalancerSet)"
                  class="ellipsis"
                  :key="Id.ListenerName"
                >
                  {{ Id.LoadBalancerName }}{{ Id.LoadBalancerId }}<br/>
                </p>
              </span>
              <span v-else>
                未配置
              </span>
            </template>
          </el-table-column>
          <el-table-column width="110">
            <div slot="header" style="padding: 0;">
              {{ t("负载均衡VIP", "WAF.lbvip") }}
              <el-tooltip
                placement="right-end"
                :content="t('负载均衡外网地址', 'WAF.lbwwdz')"
                effect="light"
              >
                <i class="el-icon-info"></i>
              </el-tooltip>
            </div>
            <template slot-scope="scope">
              <span v-if="scope.row.LoadBalancerSet.length">
                <p
                  v-for="(item, index) in uniqueVip(scope.row.LoadBalancerSet)"
                  class="ellipsis"
                  :key="item.ListenerName"
                >
                  {{ item.Vip }}<br/>
                </p>
              </span>
              <span v-else>
                未配置
              </span>
            </template>
          </el-table-column>
          <el-table-column width="160">
            <div slot="header" style="padding: 0;">
              {{ t("监听器", "WAF.lis") }}
              <el-tooltip
                placement="right-end"
                :content="
                  t(
                    'WAF和负载均衡绑定后，将对经过负载均衡对应监听器的流量进行防护',
                    'WAF.waflbtip'
                  )
                "
                effect="light"
              >
                <i class="el-icon-info"></i>
              </el-tooltip>
            </div>
            <template slot-scope="scope">
              <span v-if="scope.row.LoadBalancerSet.length">
                <p
                  v-for="lb in scope.row.LoadBalancerSet"
                  class="ellipsis"
                  :key="lb.ListenerName"
                >
                  {{ lb.ListenerName }}({{ lb.Protocol }}:{{ lb.Vport }})
                </p>
              </span>
              <span v-else>
                未配置
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="logSwitch" width="140" align="center">
            <el-dropdown
              slot="header"
              style="padding: 0"
              @command="onChangeLogStatus"
            >
              <span class="el-dropdown-link" style="color: #909399;">
                {{ t("访问日志开关", "WAF.logkg")
                }}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="-1">全部</el-dropdown-item>
                <el-dropdown-item :command="1">{{
                  t("开启", "WAF.open")
                }}</el-dropdown-item>
                <el-dropdown-item :command="0">{{
                  t("关闭", "WAF.close")
                }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <template slot-scope="scope">
                <!-- :disabled="abnormal.includes(scope.row.State)" -->
              <el-switch
                v-model="scope.row.ClsStatusBool"
                @change="status => updateClsStatus(scope.row, status)"
                active-color="#006eff"
                inactive-color="#bbb"
              >
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="wafSwitch" width="120" align="center">
            <el-dropdown
              slot="header"
              @command="onChangeWafStatus"
              style="padding: 0"
            >
              <span class="el-dropdown-link" style="color: #909399;">
                {{ t("WAF开关", "WAF.waflg")
                }}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="-1">全部</el-dropdown-item>
                <el-dropdown-item :command="1">{{
                  t("开启", "WAF.open")
                }}</el-dropdown-item>
                <el-dropdown-item :command="0">{{
                  t("关闭", "WAF.close")
                }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <template slot-scope="scope">
                <!-- :disabled="abnormal.includes(scope.row.State)" -->
              <el-switch
                v-model="scope.row.StatusBool"
                @change="status => updateWafStatus(scope.row, status)"
                active-color="#006eff"
                inactive-color="#bbb"
              >
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column
            prop="action"
            label="操作"
            width="170"
            class-name="actions"
            align="center"
          >
            <template slot-scope="scope">
              <el-popover
                placement="bottom"
                width="280"
                v-model="scope.row.delDialog"
              >
                <div class="prpoDialog">
                  <h1>{{ t("确定删除此域名", "WAF.qdscym") }}？</h1>
                  <p>
                    {{
                      t("删除后源站IP将会遭受恶意攻击的威胁", "WAF.schyip")
                    }}。
                  </p>
                </div>
                <div style="text-align: center; margin: 0">
                  <el-button
                    size="mini"
                    type="text"
                    @click="delWafs([scope.row])"
                    >{{ t("确定", "WAF.qd") }}</el-button
                  >
                  <el-button
                    size="mini"
                    type="text"
                    @click="scope.row.delDialog = false"
                    >取消</el-button
                  >
                </div>
                <el-button
                  :disabled="abnormal.includes(scope.row.State)"
                  slot="reference"
                  style="color:#3E8EF7;background: transparent;font-size:12px;"
                  >删除</el-button
                >
              </el-popover>
              <el-button
                :disabled="abnormal.includes(scope.row.State)"
                type="text"
                size="small"
                @click="handelEdit(scope.row)"
                >{{ t("编辑", "WAF.bj") }}</el-button
              >
              <el-button
                @click.native.prevent="toProtectConfig(scope.row)"
                type="text"
                size="small"
                >{{ t("防护配置", "WAF.fhpz") }}</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 15, 20, 25, 30, 35, 40, 45, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
    <packageUpgradeModel
      :isShow="packageUpModelShow"
      @packageUpModelClose="packageUpModelClose"
    />
  </div>
</template>
<script>
import packageUpgradeModel from '../model/packageUpgradeModel'
import { DESCRIBE_HOSTS, DELETE_HOST, MODIFY_HOST_STATUS, MODIFY_HOST_ACCESS_LOG_STATUS } from '@/constants'
import { ErrorTips } from '@/components/ErrorTips'
import { COMMON_ERROR } from '../../constants'
import { flatObj } from '@/utils'

export default {
  props: {
    package: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      abnormal: [4, 5, 6, 9],
      loading: true,
      allDomains: [], // 表格数据
      keyword: '', // 搜索框绑定
      checkedWafs: [],
      logSwitchValue: true, // 访问日志开关
      deleteVisible: false, // 删除提示框
      packageUpModelShow: false, // 弹框
      ClsStatus: '',
      Status: '',
      total: 0,
      currentPage: 1,
      pageSize: 20,
      refresh: 1,
      timer: undefined
    }
  },
  computed: {
    checked() {
      return this.checkedWafs.map(a => a.DomainId)
    },
    domains () {
      const domains = this.allDomains.slice((this.currentPage - 1) * this.pageSize, (this.currentPage - 1) * this.pageSize + this.pageSize)
      return domains
    }
  },
  components: {
    packageUpgradeModel // 升级
  },
  watch: {
    ClsStatus () {
      this.getData()
    },
    Status () {
      this.getData()
    },
    refresh () {
      this.timer = setTimeout(() => {
        this.getData()
      }, 5000)
    }
  },
  beforeRouteLeave (to, from, next) {
    this.timer && clearTimeout(this.timer)
    next()
  },
  mounted () {
    this.getData()
  },
  methods: {
    uniqueVip(val) {
      let brr = []
      for (var i = 1; i < val.length; i++) {
        if (val[i].Vip === val[i-1].Vip ) {
          val[i - 1].Vip = " "
        }
      }
      return val
    },
    uniqueId(val) {
      for (var i = 1; i < val.length; i++) {
        if (val[i].LoadBalancerId === val[i-1].LoadBalancerId ) {
          val[i-1].LoadBalancerId = " "
          val[i-1].LoadBalancerName = " "
        }
      }
      return val
    },
    checkAble (row) {
      if (this.abnormal.includes(row.State)) {
        return false
      }
      return true
    },
    onChangeWafStatus (status) {
      if (status === -1) {
        this.Status = ''
      } else {
        this.Status = status
      }
    },
    onChangeLogStatus (status) {
      if (status === -1) {
        this.ClsStatus = ''
      } else {
        this.ClsStatus = status
      }
    },
    handleCurrentChange (page) {
      this.currentPage = page
    },
    handleSizeChange (size) {
      this.pageSize = size
    },
    enableWAF () {
      this.modifyHostStatus(this.checkedWafs, true)
    },
    disableWAF () {
      this.$confirm(this.t('关闭后，WAF将不再对经过负载均衡监听器的流量进行防护，WAF所有功能也将失效。确认关闭？', 'WAF.gbhjbz'), this.t('确认', 'WAF.qr'), {
        confirmButtonText: this.t('确认', 'WAF.qr'),
        cancelButtonText: '取消',
        type: ''
      }).then(() => {
        this.modifyHostStatus(this.checkedWafs, false)
      })
    },
    del () {
      this.$confirm('确定删除当前所选域名？', '删除域名', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delWafs(this.checkedWafs)
      })
    },
    updateClsStatus (waf, status) {
      this.loading = true
      this.axios.post(MODIFY_HOST_ACCESS_LOG_STATUS, ({
        Version: '2018-01-25',
        Domain: waf.Domain,
        Status: Number(status),
        Edition: 'clb-waf'
      })).then(resp => {
        this.generalRespHandler(resp, this.getData, COMMON_ERROR, '切换成功')
      })
    },
    updateWafStatus (waf, status) {
      waf.StatusBool = !status
      if (status) {
        this.modifyHostStatus([waf], status)
        return
      }
      this.$confirm(this.t('关闭后，WAF将不再对经过负载均衡监听器的流量进行防护，WAF所有功能也将失效。确认关闭？', 'WAF.gbhjbz'), this.t('确认', 'WAF.qr'), {
        confirmButtonText: this.t('确认', 'WAF.qr'),
        cancelButtonText: '取消',
        type: ''
      }).then(() => {
        this.modifyHostStatus([waf], status)
      })
    },
    modifyHostStatus (wafs, status) {
      this.loading = true
      this.axios.post(MODIFY_HOST_STATUS, flatObj({
        Version: '2018-01-25',
        HostsStatus: wafs.map(waf => ({
          Domain: waf.Domain,
          DomainId: waf.DomainId,
          Status: Number(status)
        }))
      })).then(resp => {
        this.generalRespHandler(resp, this.getData, COMMON_ERROR, '切换成功')
      })
    },
    delWafs (wafs) {
      this.loading = true
      this.axios.post(DELETE_HOST, flatObj({
        Version: '2018-01-25',
        HostsDel: wafs.map(waf => ({
          Domain: waf.Domain,
          DomainId: waf.DomainId
        }))
      })).then(resp => {
        this.generalRespHandler(resp, this.getData, COMMON_ERROR, '删除成功')
      })
    },
    handleSelectionChange (val) {
      console.log(val)
      this.checkedWafs = val
    },
    // 获取数据
    getData () {
      const param = {
        Version: '2018-01-25',
        Search: this.keyword
      }
      const item = {}
      if (this.Status !== undefined) {
        item.Status = this.Status
      }
      if (this.ClsStatus !== undefined) {
        item.ClsStatus = this.ClsStatus
      }
      if (Object.keys(item).length) {
        param.Item = item
      }
      this.axios.post(DESCRIBE_HOSTS, flatObj(param))
        .then(resp => {
          this.generalRespHandler(resp, ({ HostList, TotalCount }) => {
            const domains = HostList
            let refresh = false
            if (this.allDomains.length) {
              // 不能直接设置allDomains，会丢失选中状态
              domains.forEach((domain, i) => {
                this.allDomains[i].State = domain.State
                if (!refresh && this.abnormal.includes(domain.State)) {
                  refresh = true
                }
              })
            } else {
              domains.forEach(domain => {
                domain.StatusBool = !!domain.Status
                domain.ClsStatusBool = !!domain.ClsStatus
                domain.delDialog = false
                if (!refresh && this.abnormal.includes(domain.State)) {
                  refresh = true
                }
              })
              this.total = TotalCount
              this.allDomains = domains
            }
            if (refresh) {
              this.refresh += 1
            }
          })
        }).then(() => {
          this.loading = false
        })
    },
    // 点击编辑按钮
    handelEdit (domain) {
      this.$router.push({
        name: 'protectDomain',
        query: {
          domainId: domain.DomainId
        }
      })
    },
    // 跳转防护配置页
    toProtectConfig (domain) {
      this.$router.push({
        name: 'protectConfig',
        query: {
          domainId: domain.DomainId
        }
      })
    },
    // 升级按钮
    packageUpgradeModel () {
      this.packageUpModelShow = true
    },
    // 升级弹框关闭按钮
    packageUpModelClose (isShow) {
      this.packageUpModelShow = isShow
    }
  }
}
</script>
<style lang="scss" scoped>
.newClear:after {
  display: inline-block;
  content: "";
  clear: both;
}
::v-deep button {
  border-radius: 0;
  height: 30px;
  line-height: 30px;
  padding: 0 16px;
  border: none;
  outline: none;
}
::v-deep input {
  height: 30px;
  line-height: 30px;
  border-radius: 0;
}
.dominList {
  width: 100%;
  min-height: 100px;
  background-color: #fff;
  margin-top: 20px;
  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
  padding: 20px;
  .dominListTitle {
    font-size: 14px;
    color: #000;
    font-weight: 600;
    margin-bottom: 20px;
  }
}
.el-icon-info {
  margin-left: 10px;
}
::v-deep button.el-tooltip:hover {
  background: transparent;
  color: #606266;
}
.prpoDialog {
  text-align: center;
  h1 {
    font-size: 14px;
    font-weight: 600;
    color: #000;
    margin-top: 16px;
  }
  p {
    margin: 16px 0;
  }
}
::v-deep .el-popover {
  width: 300px !important;
  height: 136px !important;
}
.ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.search-input {
  width: 360px;
  font-size: 12px;
  .el-icon-search {
    cursor: pointer;
  }
  ::v-deep .el-input__suffix {
    top: -4px;
  }
}
.actions {
  button {
    padding: 0;
    margin-left: 15px;
  }
}
.el-icon-success {
  color: rgb(93, 186, 107);
}
::v-deep .is-disabled.el-popover__reference {
  color: #c0c4cc !important;
}
</style>

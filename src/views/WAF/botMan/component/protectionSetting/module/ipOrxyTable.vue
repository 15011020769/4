<!--
 * @Author: your name
 * @Date: 2020-02-20 10:13:21
 * @LastEditTime: 2020-02-28 18:06:58
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /new_product/src/views/WAF/botMan/component/protectionSetting/module/ipOrxyTable.vue
 -->
<template>
  <div class="main">
    <el-row type="flex" justify="between">
      <el-col>
        <el-button
          style="padding: 5px 10px; margin-right: 10px;"
          type="primary"
          @click="dialogVisible = true"
        >
          {{ t("复制", "WAF.copy") }}
        </el-button>
      </el-col>
      <i
        style="cursor: pointer; font-size: 16px;"
        @click="getPreinstallRule"
        class="el-icon-refresh"
      />
    </el-row>
    <el-table
      style="margin-top: 10px"
      row-key="ftname"
      default-expand-all
      :data="tabsFlag === 'xy' ? xyData : ipData"
      v-loading="loading"
    >
      <el-table-column prop="ftname" :label="t('策略名称', 'WAF.clmc')">
        <template slot-scope="scope">
          <el-row type="flex" align="middle">
            {{ scope.row.ftname }}&nbsp;&nbsp;
            <el-tooltip
              v-if="scope.row.name === '腾讯云WAF拨测'"
              effect="dark"
              :content="
                t(
                  'WAF用于检查客户域名健康状态的拨测服务，请勿设置为拦截。',
                  'WAF.wafyyjckhlj'
                )
              "
              placement="right"
            >
              <i class="el-icon-info" />
            </el-tooltip>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column prop="action" :label="t('动作', 'WAF.dz')">
        <template slot-scope="scope">
          <span :class="scope.row.action"
            >{{ UCB_ACTION[scope.row.action] }} </span
          >&nbsp;
          <span
            v-if="
              scope.row.action === UCB_ACTION.攔截 ||
                scope.row.action === UCB_ACTION.驗證碼
            "
          >
            {{ scope.row.validTime }}{{ t("分钟", "WAF.fz") }}</span
          >
        </template>
      </el-table-column>
      <el-table-column prop="status" :label="t('策略开关', 'WAF.clkg')">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            @change="status => onChangeStatus(scope.row, status)"
            v-if="!scope.row.children"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="updateTime"
        :label="t('修改时间', 'WAF.xgsj')"
      ></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            v-if="!scope.row.children"
            @click="onEdit(scope)"
            >{{ t("编辑", "WAF.bj") }}</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :visible="showEditDialog"
      :title="editDialogProp.ftname"
      width="470px"
      destroy-on-close
      :before-close="handleCloseEdit"
    >
      <EditDialog
        :visible.sync="showEditDialog"
        :info="editDialogProp"
        :iptDomain="ipSearch"
        :category="tabsFlag"
        @success="onSuccess"
      />
    </el-dialog>
    <el-dialog
      :title="`${t('复制', 'WAF.copy')}策略`"
      :visible="dialogVisible"
      width="850px"
      destroy-on-close
      :before-close="handleClose"
    >
      <Transfer
        :category="tabsFlag"
        :dialogVisible.sync="dialogVisible"
        :iptDomain="ipSearch"
      />
    </el-dialog>
  </div>
</template>

<script>
import Transfer from '../../transfer'
import EditDialog from '../../editDialog'
import { DESCRIBE_BOT_UCB_PREINSTALLRULE, MODIFY_BOT_UCB_PREINSTALL_RULE } from '@/constants'
import { UCB_PROTOCLS, UCB_IPS, UCB_ACTION } from '../../../../constants'
import moment from 'moment'
import { type } from 'os'

export default {
  data () {
    return {
      UCB_ACTION,
      dialogVisible: false, // 控制弹窗显示状态
      loading: true,
      xyData: [
        {
          type: 'ua',
          ftname: 'User-Agent类别',
          children: UCB_PROTOCLS.filter(item => item.type === 'ua')
        },
        {
          type: 'headers',
          ftname: 'HTTP头部',
          children: UCB_PROTOCLS.filter(item => item.type === 'headers')
        },
        {
          type: 'http',
          ftname: 'HTTP协议特征',
          children: UCB_PROTOCLS.filter(item => item.type === 'http')
        }
      ],
      ipData: [
        {
          type: 'boce',
          ftname: '撥測',
          children: UCB_IPS.filter(item => item.type === 'boce')
        },
        {
          type: 'idc',
          ftname: 'IDC-IP库',
          children: UCB_IPS.filter(item => item.type === 'idc')
        }
      ],
      showFlag: true, // 弹窗关闭切换内部元素显示状态
      showEditDialog: false, // 控制编辑弹窗状态
      editDialogProp: {} // 编辑弹窗传递参数
    }
  },
  props: {
    tabsFlag: {
      default: 'diy'
    },
    ipSearch: {
      type: String,
      default: ''
    }
  },
  watch: {
    tabsFlag (n, o) {
      this.getPreinstallRule()
    },
    ipSearch () {
      this.getPreinstallRule()
    }
  },
  components: {
    Transfer,
    EditDialog
  },
  mounted () {
    this.getPreinstallRule()
  },
  methods: {
    handleClose () {
      this.dialogVisible = false
    },
    handleCloseEdit () {
      this.showEditDialog = false
    },
    onEdit (row) {
      this.showEditDialog = true
      this.editDialogProp = row.row
    },
    onChangeStatus (feature, status) {
      console.log(feature)
      feature.status = !status
      this.axios.post(MODIFY_BOT_UCB_PREINSTALL_RULE, {
        Version: '2018-01-25',
        Domain: this.ipSearch,
        Category: this.tabsFlag === 'xy' ? 1 : 2,
        Name: feature.name,
        Status: status ? 'on' : 'off',
        Operate: feature.action,
        ValidTime: feature.validTime
      })
        .then(resp => {
          this.generalRespHandler(resp, this.getPreinstallRule)
        })
    },
    onSuccess () {
      this.showEditDialog = false
      this.getPreinstallRule()
    },
    // 获取协议特征策略
    getPreinstallRule () {
      this.loading = true
      // 1表示协议特征类型的内置规则；2表示IP情报类型的内置规则
      let params = {
        Version: '2018-01-25',
        Domain: this.ipSearch,
        Category: this.tabsFlag === 'ip' ? 2 : 1
      }
      this.axios.post(DESCRIBE_BOT_UCB_PREINSTALLRULE, params)
        .then(resp => {
          this.generalRespHandler(resp, ({ Data }) => {
            let key = 'xyData'
            if (this.tabsFlag === 'ip') {
              key = 'ipData'
            }
            Data && Data.Res.forEach(data => {
              this[key].forEach((row, parantIndex) => {
                this.$set(this[key], parantIndex, {
                  ...row,
                  children: row.children.map((child, childIndex) => {
                    console.log(child.ftname, data.Name)
                    if (
                      child.ftname === data.Name ||
                    (data.Name === '騰訊雲WAF撥測' && child.ftname === '台富雲WAF撥測') ||
                    (data.Name === 'IDC-IP 騰訊雲' && child.ftname === 'IDC-IP 台富雲')
                    ) {
                      console.log(data)
                      return {
                        ...child,
                        action: data.Action,
                        on_off: data.OnOff,
                        status: data.OnOff === 'on',
                        validTime: data.ValidTime,
                        updateTime: moment(data.Timestamp).format('YYYY-MM-DD HH:mm:ss')
                      }
                    }
                    return child
                  })
                })
              })
            })
          })
        }).then(() => {
          this.loading = false
        })
    }

  }
}
</script>

<style lang="scss" scoped>
.main {
  ::v-deep .el-table {
    .cell {
      display: flex;
    }
  }
}
::v-deep .expanded {
  color: #444;
  font-weight: 600;
}
.intercept {
  color: #e1504a;
}
.permit {
  color: #0abf5b;
}
.captcha {
  color: #ff9d00;
}
</style>

<!--
 * @Author: your name
 * @Date: 2020-02-19 17:26:56
 * @LastEditTime: 2020-02-28 11:57:16
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /new_product/src/views/WAF/botMan/component/protectionSetting/diyType.vue
 -->
<template>
  <div class="main">
    <el-row type="flex" justify="between" align="middle">
      <el-col>
        <el-button
          style="padding: 5px 10px; margin-right: 10px;"
          type="primary"
          @click="dialogVisible = true"
          >{{ t("复制", "WAF.copy") }}</el-button
        >
        <el-tooltip
          placement="right"
          :content="
            t(
              '你可以将当前域名的公开BOT策略复制到目标域名；注意，复制后，目标域名的公开BOT策略将会被覆盖',
              'WAF.nkyjdqymd'
            )
          "
        >
          <i class="el-icon-info" />
        </el-tooltip>
      </el-col>
      <i
        style="cursor: pointer; font-size: 16px;"
        @click="getTableList"
        class="el-icon-refresh"
      />
    </el-row>
    <el-card style="margin-top: 20px">
      <el-table
        :data="
          tabList
            ? tabList.slice(
                (currentPage - 1) * pageSize,
                currentPage * pageSize
              )
            : []
        "
        v-loading="loadShow"
      >
        <el-table-column width="80%" :label="t('序号', 'WAF.xh')">
          <template slot-scope="scope">
            &nbsp;&nbsp;&nbsp;&nbsp;{{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column prop="type" :label="t('BOT 分类', 'WAF.botfl')" />
        <el-table-column prop="count" :label="t('BOT 种类数', 'WAF.botzls')" />
        <el-table-column>
          <div slot="header">
            <el-dropdown trigger="click" style="line-height: 0">
              <span class="el-dropdown-link" style="font-size: 12px;">
                {{ t("动作", "WAF.dz")
                }}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  ><span @click="filterAction(undefined)"
                    >全部</span
                  ></el-dropdown-item
                >
                <el-dropdown-item
                  ><span @click="filterAction('monitor')">{{
                    t("监控", "WAF.jk")
                  }}</span></el-dropdown-item
                >
                <el-dropdown-item
                  ><span @click="filterAction('intercept')">{{
                    t("拦截", "WAF.lj")
                  }}</span></el-dropdown-item
                >
                <el-dropdown-item
                  ><span @click="filterAction('permit')"
                    >放行</span
                  ></el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <template slot-scope="scope">
            <span :class="scope.row.action">{{
              ALL_ACTION[scope.row.action]
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              @click="upDateRule(scope.row, 'monitor')"
              v-if="scope.row.action !== 'monitor'"
              type="text"
              >{{ t("设为", "WAF.sw") }}{{ t("监控", "WAF.jk") }}</el-button
            >
            <el-button
              @click="upDateRule(scope.row, 'intercept')"
              v-if="scope.row.action !== 'intercept'"
              type="text"
              >{{ t("设为", "WAF.sw") }}{{ t("拦截", "WAF.lj") }}</el-button
            >
            <el-button
              @click="upDateRule(scope.row, 'permit')"
              v-if="scope.row.action !== 'permit'"
              type="text"
              >{{ t("设为", "WAF.sw") }}放行</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="tabListPage">
        <el-pagination
          layout="total, sizes, prev, pager, next, jumper"
          :total="tabList.length"
          :page-sizes="[10, 20, 30, 50]"
          @size-change="val => (pageSize = val)"
          @current-change="val => (currentPage = val)"
        />
      </div>
    </el-card>
    <!--
       <el-dialog
        title="添加域名"
        :visible.sync="addDominModel"
        width="45%"
        :before-close="handleClose"
      >
     -->
    <el-dialog
      :title="t('复制公开类型策略', 'WAF.fzgklxcl')"
      :visible="dialogVisible"
      width="850px"
      :before-close="onClose"
      destroy-on-close
    >
      <Transfer :dialogVisible.sync="dialogVisible" :iptDomain="ipSearch" />
    </el-dialog>
  </div>
</template>

<script>
import { DESCRIBE_BOTTCB_RECORDS, MODIFY_BOTTCB_RULE } from '@/constants'
import { COMMON_ERROR, ALL_ACTION } from '../../../constants'
import Transfer from '../transfer'

import moment from 'moment'
export default {
  data () {
    return {
      ALL_ACTION,
      tabList: [],
      loadShow: false,
      currentPage: 1,
      pageSize: 10,
      dialogVisible: false
    }
  },

  props: {
    ipSearch: String
  },

  components: {
    Transfer
  },

  mounted () {
    this.getTableList()
  },

  watch: {
    ipSearch (n, o) {
      if (n) {
        this.getTableList()
      }
    }

  },
  methods: {

    //  获取表单数据
    getTableList () {
      let parmas = {
        Version: '2018-01-25',
        Domain: this.ipSearch
      }
      this.loadShow = true
      this.axios.post(DESCRIBE_BOTTCB_RECORDS, parmas)
        .then(resp => {
          this.generalRespHandler(resp, ({ Data }) => {
            const result = JSON.parse(Data.Res[0])
            this.tabList = []
            Object.keys(result).forEach(item => {
              if (result[item].count) {
                this.tabList.push({
                  type: item,
                  ...result[item],
                  Name: item
                })
              }
            })
            localStorage.setItem('BotTCBRule', JSON.stringify(this.tabList))
          })
        }).then(() => {
          this.loadShow = false
        })
    },
    // 策略更新
    upDateRule (row, rule) {
      let params = {
        Version: '2018-01-25',
        Domain: this.ipSearch,
        Name: row.Name,
        Operate: rule
      }

      this.axios.post(MODIFY_BOTTCB_RULE, params).then(res => {
        this.generalRespHandler(res, this.getTableList(), COMMON_ERROR, '修改成功')
      })
    },

    // 动作过滤
    filterAction (action) {
      const arr = JSON.parse(localStorage.getItem('BotTCBRule'))
      if (action) {
        this.tabList = arr.filter(item => item.action === action)
        return
      }

      this.tabList = arr
    },
    // 关闭弹框
    onClose () {
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.tabListPage {
  height: 50px;
  border-top: 1px solid #ddd;
  padding-top: 8px;
  text-align: right;
  background-color: #fff;
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

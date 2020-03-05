<template>
  <div id="unBlockingRecord">
    <div class="contentTit">{{ $t("DDOS.UnsealCode.UnsealName") }}</div>
    <div class="mainContentBlock">
      <div class="contPartOne">
        <el-date-picker
          class="dateUnBlock"
          v-model="dateChoice"
          type="datetimerange"
          range-separator="至"
          :start-placeholder="$t('DDOS.UnsealCode.beginDate')"
          :end-placeholder="$t('DDOS.UnsealCode.overDate')"
        ></el-date-picker>
      </div>
      <div class="contPartTwo">
        <div class="tableContentUn">
          <el-table
            :data="
              IpUnBlockList.slice(
                (currentPage - 1) * pageSize,
                currentPage * pageSize
              )
            "
            v-loading="loading"
            :empty-text="$t('DDOS.Statistical_forms.Nodate')"
          >
            <el-table-column prop="ip" label="IP">
              <template slot-scope="scope">
                <span>{{ scope.row.Ip }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="blockingTime"
              :label="$t('DDOS.UnlockOperation.BlockingTime')"
            >
              <template slot-scope="scope">{{ scope.row.BlockTime }}</template>
            </el-table-column>
            <el-table-column
              prop="unblockTime"
              :label="$t('DDOS.UnlockOperation.EstimatedTime')"
            >
              <template slot-scope="scope">{{
                scope.row.UnBlockTime
              }}</template>
            </el-table-column>
            <el-table-column
              prop="unblockType"
              :label="$t('DDOS.UnsealCode.UnsealingType')"
            >
              <template slot-scope="scope">{{
                $t("DDOS.Automatic_unsealing." + scope.row.ActionType)
              }}</template>
            </el-table-column>
          </el-table>
        </div>
        <div class="Right-style pagstyle">
          <span class="pagtotal"
            >共&nbsp;{{ totalItems }}&nbsp;{{
              $t("DDOS.UnsealCode.tiao")
            }}</span
          >
          <el-pagination
            @current-change="handleCurrentChange"
            :page-size="pageSize"
            :pager-count="7"
            layout="prev, pager, next"
            :total="totalItems"
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { IPUNBlOCKLIST_LIST } from '@/constants'
import { ErrorTips } from '@/components/ErrorTips'
export default {

  data () {
    return {
      datanum: this.$t('DDOS.Automatic_unsealing.auto'),
      currentPage: 1,
      pageSize: 10,
      totalItems: 0,
      // 日期区间：默认获取当前时间和前90天时间
      EndTime: this.getDateString(new Date()),
      BeginTime: this.getDateString(
        new Date(new Date().getTime() - 24 * 60 * 60 * 1000 * 90)
      ),

      // 日期选择
      dateChoice: [ this.getDateString(new Date(new Date().getTime() - 24 * 60 * 60 * 1000 * 90)), this.getDateString(new Date()) ],

      IpUnBlockList: [],
      loading: false
    }
  },
  watch: {
    dateChoice: function (value) {
      if (value !== null) {
        this.BeginTime = this.getDateString(value[0])
        this.EndTime = this.getDateString(value[1])
        this.describeIpUnBlockList()
      } else {
        this.IpUnBlockList = []
        this.totalItems = 0
      }
    }

  },

  created () {
    this.describeIpUnBlockList() // 获取IP解封记录接口
  },

  methods: {
    // 获取IP解封记录
    describeIpUnBlockList () {
      this.loading = true
      let params = {
        Version: '2018-07-09',
        BeginTime: this.BeginTime,
        EndTime: this.EndTime
      }
      this.axios.post(IPUNBlOCKLIST_LIST, params).then(res => {
        if (res.Response.Error === undefined) {
          this.IpUnBlockList = res.Response.List
          this.totalItems = res.Response.Total
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
        this.loading = false
      })
    },
    // 分页方法
    handleSizeChange (val) {
      this.pageSize = val
    },
    handleCurrentChange (val) {
      this.currentPage = val
    },
    currentChangePage () {

    },

    // 时间格式化'yyyy-MM-dd hh:mm:ss'
    getDateString (date) {
      let o = {
        y: date.getFullYear(),
        M: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        m: date.getMinutes(),
        s: date.getSeconds()
      }
      for (const i in o) {
        o[i] = (o[i] + '').length == 1 ? '0' + o[i] : o[i]
      }
      return o.y + '-' + o.M + '-' + o.d + ' ' + o.h + ':' + o.m + ':' + o.s
    }
  }
}
</script>
<style lang="scss" scoped>
.Right-style {
  display: flex;
  justify-content: flex-end;

  .esach-inputL {
    width: 300px;
    margin-right: 20px;
  }
}
.pagstyle {
  padding: 20px;

  .pagtotal {
    font-size: 13px;
    font-weight: 400;
    color: #565656;
    line-height: 32px;
  }
}
.newClear:after {
  content: "";
  clear: both;
  display: block;
}
.contentTit {
  width: 100%;
  height: 50px;
  padding: 0 20px;
  line-height: 50px;
  border-bottom: 1px solid #ddd;
  font-size: 16px;
  font-weight: 600;
  background-color: #fff;
}
#unBlockingRecord {
  .mainContentBlock {
    width: 100%;
    padding: 20px;
    .contPartOne {
      width: 100%;
      padding: 0 20px 20px 0;
      .dateUnBlock {
        width: 380px;
        height: 30px;
        border-radius: 0;
        line-height: 30px;
        input {
          font-size: 12px;
        }
        ::v-deep .el-range-separator {
          line-height: 22px;
          width: 10%;
        }
        ::v-deep .el-range__icon {
          line-height: 26px;
        }
      }
    }
    .contPartTwo {
      width: 100%;
      padding: 20px;
      background-color: #fff;
      border: 1px solid #ddd;
      box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
      min-height: 200px;
    }
  }
}
.tableContentUn {
  border-bottom: 1px solid #ddd;
  min-height: 450px;
}
.tabListPage {
  height: 50px;
  padding-top: 16px;
  text-align: right;
}
</style>

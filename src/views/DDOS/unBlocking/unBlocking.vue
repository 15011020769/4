<template>
  <div id="unBlocking">
    <div class="contentTit">{{ $t("DDOS.UnlockOperation.Unlock") }}</div>
    <div class="mainContentBlock">
      <div class="contPartOne newClear">
        <el-row>
          <el-col :span="8">
            <div class="contPartOneData">
              <p>{{ $t("DDOS.UnlockOperation.totalNum") }}</p>
              <p>
                <span>{{ unBlockStatis.Total }}</span>
                <span>次</span>
              </p>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="contPartOneData">
              <p>{{ $t("DDOS.UnlockOperation.CurrentlyUse") }}</p>
              <p>
                <span>{{ unBlockStatis.Used }}</span>
                <span>次</span>
              </p>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="contPartOneData contPartOneDataT">
              <p>{{ $t("DDOS.UnlockOperation.NotUse") }}</p>
              <p>
                <span>{{ unBlockStatis.Total - unBlockStatis.Used }}</span>
                <span>次</span>
              </p>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="contPartTwo">
        <div class="tableContentUn">
          <el-table
            :data="tableDatalist"
            v-loading="loading"
            height="450"
            :empty-text="$t('DDOS.Statistical_forms.Nodate')"
          >
            <el-table-column prop="Ip" label="IP">
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
              prop="status"
              :label="$t('DDOS.UnlockOperation.Unlockstate')"
            >
              <template slot-scope="scope">{{
                $t("DDOS.Automatic_unsealing." + scope.row.Status)
              }}</template>
            </el-table-column>
            <el-table-column
              prop="action"
              :label="$t('DDOS.UnlockOperation.UnlockOpera')"
              width="180"
            >
              <template slot-scope="scope">
                <el-button
                  @click.native.prevent="RenewModel(scope.row)"
                  type="text"
                  size="small"
                  :disabled="scope.row.Status === 'UnBlocking'"
                >
                  解封
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 解封弹框 -->
          <RenewModel
            :RenewShow="doalogRenewModel"
            :unsealingIP="dataUnsealingIP"
            @sureRenewModel="sureRenewModel"
            @closeRenewModel="closeRenewModel"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// eslint-disable-next-line camelcase
import {
  UNBlOCKSTATIS_NUM,
  IPBlOCKLIST_LIST,
  Create_UnblockIp
} from '@/constants'
import { ErrorTips } from '@/components/ErrorTips'
import RenewModel from './model/RenewModel'

export default {
  data () {
    return {
      unBlockStatis: {
        BeginTime: '',
        EndTime: '',
        RequestId: '',
        Total: 0,
        Used: 0
      },

      tableDatalist: [],
      loading: true,
      doalogRenewModel: false, // 解封弹框
      dataUnsealingIP: ''

    }
  },
  components: {
    RenewModel
  },
  created () {
    this.describeUnBlockStatis() // 获取黑洞解封次数接口
    this.describeIpBlockList() // 获取IP封堵列表接口
  },
  methods: {
    // 解封弹框
    RenewModel (val) {
      this.doalogRenewModel = true
      this.dataUnsealingIP = val.Ip
    },
    // 解封弹框关闭按钮
    closeRenewModel (isShow) {
      this.doalogRenewModel = isShow
    },
    // 解封弹出框确定
    sureRenewModel (isShow) {
      this.doalogRenewModel = isShow
      let params = {
        Action: 'CreateUnblockIp',
        Version: '2018-07-09',
        Region: localStorage.getItem('regionv2'),
        Ip: this.dataUnsealingIP,
        ActionType: 'user'
      }
      console.log(params, 'params')
      this.axios.post(Create_UnblockIp, params).then(res => {
        if (res.Response.Error === undefined) {
          this.describeIpBlockList()
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
    // 获取IP封堵列表接口
    describeIpBlockList () {
      this.loading = true
      let params = {
        Version: '2018-07-09'
      }
      this.axios.post(IPBlOCKLIST_LIST, params).then(res => {
        if (res.Response.Error === undefined) {
          this.tableDatalist = res.Response.List
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

    // 获取黑洞解封次数接口
    describeUnBlockStatis () {
      this.loading = true
      let params = {
        Version: '2018-07-09'
      }
      this.axios.post(UNBlOCKSTATIS_NUM, params).then(res => {
        if (res.Response.Error === undefined) {
          this.unBlockStatis = res.Response
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
    }
  }
}
</script>
<style lang="scss" scoped>
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
#unBlocking {
  .mainContentBlock {
    width: 100%;
    padding: 20px;
    .contPartOne {
      width: 100%;
      height: 115px;
      width: 100%;
      padding: 20px;
      margin-bottom: 20px;
      border: 1px solid #ddd;
      box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
      background-color: #fff;
      .contPartOneData {
        text-align: center;
        p:nth-child(1) {
          font-size: 12px;
          color: #888;
          margin-bottom: 26px;
        }
        p:nth-child(2) {
          color: #000;
          span:nth-child(1) {
            font-size: 24px;
          }
          span:nth-child(2) {
            font-size: 12px;
          }
        }
      }
      .contPartOneDataT {
        p {
          span:nth-child(1) {
            color: #0abf5b;
          }
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
      .tableContentUn {
        min-height: 450px;
        border-bottom: none;
      }
    }
  }
}
</style>

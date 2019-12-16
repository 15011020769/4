<template>
  <div id="unBlocking">
    <div class="contentTit">{{$t('DDOS.UnlockOperation.Unlock')}}</div>
    <div class="mainContentBlock">
      <div class="contPartOne newClear">
        <el-row>
          <el-col :span="8">
            <div class="contPartOneData">
              <p>{{$t('DDOS.UnlockOperation.totalNum')}}</p>
              <p>
                <span>{{unBlockStatis.Total}}</span>
                <span>次</span>
              </p>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="contPartOneData">
              <p>{{$t('DDOS.UnlockOperation.CurrentlyUse')}}</p>
              <p>
                <span>{{unBlockStatis.Used}}</span>
                <span>次</span>
              </p>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="contPartOneData contPartOneDataT">
              <p>{{$t('DDOS.UnlockOperation.NotUse')}}</p>
              <p>
                <span>{{unBlockStatis.Total - unBlockStatis.Used}}</span>
                <span>次</span>
              </p>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="contPartTwo">
        <div class="tableContentUn">
          <el-table :data="tableDatalist" v-loading="loading">
            <el-table-column prop="Ip" label="IP">
              <template slot-scope="scope">
                <a href="#" @click="toDoDetail(scope.$index, scope.row)">{{scope.row.Ip}}</a>
              </template>
            </el-table-column>
            <el-table-column prop="blockingTime" :label="$t('DDOS.UnlockOperation.BlockingTime')">
              <template slot-scope="scope">{{scope.row.BlockTime}}</template>
            </el-table-column>
            <el-table-column prop="unblockTime" :label="$t('DDOS.UnlockOperation.EstimatedTime')">
              <template slot-scope="scope">{{scope.row.UnBlockTime}}</template>
            </el-table-column>
            <el-table-column prop="status" :label="$t('DDOS.UnlockOperation.Unlockstate')">
              <template slot-scope="scope">{{scope.row.Status}}</template>
            </el-table-column>
            <el-table-column
              prop="action"
              :label="$t('DDOS.UnlockOperation.UnlockOpera')"
              width="180"
            >
              <template slot-scope="scope">
                <el-button
                  @click.native.prevent="deleteRow(scope.$index, scope.row)"
                  type="text"
                  size="small"
                >{{scope.row.ActionType}}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { UNBlOCKSTATIS_NUM, IPBlOCKLIST_LIST } from "@/constants";
export default {
  data() {
    return {
      unBlockStatis: {
        BeginTime: "",
        EndTime: "",
        RequestId: "",
        Total: 0,
        Used: 0
      },
      tableDatalist: [],
      loading: true
    };
  },
  created() {
    this.describeUnBlockStatis(); //获取黑洞解封次数接口
    this.describeIpBlockList(); //获取IP封堵列表接口
  },
  methods: {
    //获取IP封堵列表接口
    describeIpBlockList() {
      let params = {
        Version: "2018-07-09"
      };
      this.axios.post(IPBlOCKLIST_LIST, params).then(res => {
        console.log(params);
        console.log(res);
        this.tableDatalist = res.Response.List;
        this.loading = false;
      });
    },

    //获取黑洞解封次数接口
    describeUnBlockStatis() {
      let params = {
        Version: "2018-07-09"
      };
      this.axios.post(UNBlOCKSTATIS_NUM, params).then(res => {
        console.log(params);
        console.log(res);
        this.unBlockStatis = res.Response;
      });
    }
  }
};
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
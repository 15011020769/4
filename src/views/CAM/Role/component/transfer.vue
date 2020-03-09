<template>
  <div class="wrap">
    <div class="main" style="background:white;">
      <div class="left">
          <h3>
          選擇策略
          <span>（共{{strategiesTotalNum}}條）</span>
          <el-input
            placeholder="請輸入策略名稱/描述"
            v-model="policyInp"
            class="input-with-select"
            clearable
             style="margin-top: 15px;"
          >
            <el-button slot="append" icon="el-icon-search" @click="_policySearch"></el-button>
          </el-input>
        </h3>
        <div class="border">
          <el-table
            :data="strategies"
            max-height="520"
            style="width: 100%"
            @select="togglePolicy"
            @select-all="toggleAllPolicy"
            class="strategies-table"
            ref="strategiesTable"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column :label="$t('CAM.userList.strategyNames')">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" :content="scope.row.Description" placement="bottom">
                  <div>
                    <p>{{scope.row.PolicyName}}</p>
                    <p class="desc">{{scope.row.Description}}</p>
                  </div>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="Type" :label="$t('CAM.userList.clType')" width="100">
              <template slot-scope="scope">
                <p>{{tacticsType[scope.row.Type]}}</p>
              </template>
            </el-table-column>
            <infinite-loading
              slot="append"
              :identifier="strategiesInfiniteId"
              @infinite="loadStrategies"
              force-use-infinite-wrapper=".strategies-table .el-table__body-wrapper">
              <div slot="no-more"></div>
              <div slot="no-results"></div>
            </infinite-loading>
          </el-table>
        </div>
      </div>
      <div class="mid">
        <i class="el-icon-connection"></i>
      </div>
      <div class="right">
        <p class="title" style="margin-bottom: 15px;">
          <b style="font-size:13px;">{{$t('CAM.userList.choose')}}</b>
          &nbsp;({{selectedStrategies.length}}{{$t('CAM.strip')}})
        </p>
        <div class="right-main border">
          <el-table :data="selectedStrategies" style="width: 100%;height: 562px" :empty-text="$t('CAM.strategy.zwsj')">
            <el-table-column prop="PolicyName" label="策略名">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" :content="scope.row.Description" placement="bottom">
                  <div>
                    <p>{{scope.row.PolicyName}}</p>
                    <p class="desc">{{scope.row.Description}}</p>
                  </div>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="Type" :label="$t('CAM.userList.strategyChose')" width="100">
              <template slot-scope="scope">
                <p>{{tacticsType[scope.row.Type]}}</p>
              </template>
            </el-table-column>
            <el-table-column :label="$t('CAM.userGroup.colHandle')" width="50">
            &lt;!&ndash;
            <template slot-scope="scope">
              <el-button @click.native.prevent="deleteRow(scope.$index, scope.row)" type="text" size="small">x
              </el-button>
            </template>&ndash;&gt;
          </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
let timer;
import { POLICY_LIST } from "@/constants";
import { ErrorTips } from "@/components/ErrorTips";
import InfiniteLoading from 'vue-infinite-loading'
export default {
  name: "transfer",
  props: {
    groupId: String,
  },
  data() {
    return {
      strategiesInfiniteId: 1,
      selectedStrategies: [],
      selectedPolicyId: [],
      strategiesRp: 10,
      strategiesPage: 1,
      policyInp: "",
      strategiesTotalNum: 0,
      strategies: [],
      tacticsType: {
        1: "自定義策略",
        2: "預設策略"
      },
    };
  },
  components: {
    InfiniteLoading,
  },
  mounted() {
    this.loadStrategies()
  },
  methods: {
    togglePolicy(a, b) {
      this.selectedStrategies = a
      if (this.selectedPolicyId.includes(b.PolicyId)) {
        this.selectedPolicyId = this.selectedPolicyId.filter(selected => selected !== b.PolicyId)
      } else {
        this.selectedPolicyId.push(b.PolicyId)
      }
    },
    toggleAllPolicy(all) {
      this.selectedStrategies = all
      if (this.selectedPolicyId.length === this.strategies.length) {
        this.selectedPolicyId = []
      } else {
        this.selectedPolicyId = all.map(g => g.PolicyId)
      }
    },
    deleteRow(i, row) {
      this.selectedStrategies.splice(i, 1)
      this.selectedPolicyId.splice(i, 1)
      
      this.$refs.strategiesTable.toggleRowSelection(this.strategies.find(s => s.PolicyId === row.PolicyId), false)
    },
    loadStrategies($state) {
      const param = {
        Version: '2019-01-16',
        Page: this.strategiesPage,
        Rp: this.strategiesRp,
        Keyword: this.policyInp,
        Scope: 'QCS', // 自取预设策略
      }
      if (this.groupId) {
        param.FlagGroupId = this.groupId
      }
      this.axios.post(POLICY_LIST, param).then(res => {
        this.strategiesPage += 1
        this.strategiesTotalNum = res.Response.TotalNum
        this.strategies = this.strategies.concat(res.Response.List)
        if (this.selectedPolicyId.length) {
          this.$nextTick(() => {
            this.strategies.forEach(strategy => {
              if (this.selectedPolicyId.includes(strategy.PolicyId)) {
                this.$refs.strategiesTable.toggleRowSelection(strategy, true)
              }
            })
          })
        }
        if (this.strategies.length === res.Response.TotalNum) {
          $state && $state.complete()
        } else {
          $state && $state.loaded()
        }
      })
    },
    //策略搜索
    _policySearch() {
      this.strategies = []
      this.strategiesPage = 1
      this.strategiesInfiniteId += 1
    },
  }
};
</script>

<style scoped lang='scss'>
.wrap >>> .el-dropdown {
  font-size: 12px;
}
::v-deep .el-input__clear {
  position: absolute;
  right: calc(100% + 2px);
}
.wrap >>> .el-input__inner {
  height: 30px;
  border-radius: 0;
  padding-top: 0;
  line-height: 30px;
  font-size: 12px;
}
.wrap {
  margin-top: 25px;
  .title {
    margin-bottom: 5px;
    font-size: 12px;
  }
  .main {
    display: flex;
    overflow: hidden;

    .border {
      border: 1px #f2f2f2 solid;
    }
    .left {
      flex: 1;

      .seek {
        position: relative;

        p {
          position: absolute;
          z-index: 100px;
          top: 0;
          right: 0;
          display: flex;
          align-items: center;
          height: 100%;
          cursor: pointer;

          i {
            margin-right: 10px;
          }
        }
      }
    }
    .right {
      flex: 1;
    }
    .mid {
      width: 50px;
      display: flex;
      align-items: center;
      justify-content: center;

      i {
        font-size: 20px;
      }
    }
  }
}
.desc {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
</style>
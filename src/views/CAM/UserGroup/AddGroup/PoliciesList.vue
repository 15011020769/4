<template>
  <div class="Cam">
    <div class="container">
      <div class="container-left">
        <p style="margin-bottom:20px">{{$t('CAM.userList.choosepolicy')}}（共{{strategiesTotalNum}}{{$t('CAM.strip')}}）</p>
        <!-- <el-input size="mini" custom-class="dialogStyle" v-model="policyInp" style="width:100%"
          @keyup.enter.native="toQuery" />
        <i class="el-icon-search ifier" @click="toQuery"></i>-->
        <el-input
          clearable
          size="mini"
          custom-class="dialogStyle"
          v-model="policyInp"
          style="width:100%"
          :placeholder="$t('CAM.userList.policyPlaceholder')"
          @keyup.enter.native="_policySearch"
        >
          <i slot="suffix" class="el-input__icon el-icon-search" style="cursor: pointer;" @click="_policySearch"></i>
        </el-input>
        <el-table
          :data="strategies"
          size="small"
          max-height="520"
          style="width: 100%"
          @select="togglePolicy"
          @select-all="toggleAllPolicy"
          :empty-text="$t('CAM.strategy.zwsj')"
          class="strategies-table"
          ref="strategiesTable"
        >
          <el-table-column type="selection" prop="PolicyId" width="29"></el-table-column>
          <el-table-column
            prop="PolicyName"
            :label="$t('CAM.userList.strategyNames')"
          >
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
              <p v-show="scope.row.Type == 1">{{$t('CAM.userList.strategySelf')}}</p>
              <p v-show="scope.row.Type == 2">{{$t('CAM.userList.ysStrategy')}}</p>
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
      <div class="direction">
        <div class="direction-icon">
          <i class="iconfont">&#xe603;</i>
        </div>
      </div>
      <div class="container-right">
        <span style="margin-bottom:20px">{{$t('CAM.userList.choose')}} {{selectedStrategies.length}} {{$t('CAM.strip')}}</span>
        <el-table
          :data="selectedStrategies"
          size="small"
          style="width: 100%"
          :empty-text="$t('CAM.strategy.zwsj')"
        >
          <el-table-column
            prop="PolicyName"
            :label="$t('CAM.userList.strategyNames')"
          >
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
              <p v-show="scope.row.Type == 1">{{$t('CAM.userList.strategySelf')}}</p>
              <p v-show="scope.row.Type == 2">{{$t('CAM.userList.ysStrategy')}}</p>
            </template>
          </el-table-column>
          <el-table-column :label="$t('CAM.userGroup.colHandle')" width="50">
            &lt;!&ndash;
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="deleteRow(scope.$index, scope.row)"
                type="text"
                size="small"
              >x</el-button>
            </template>&ndash;&gt;
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { ErrorTips } from "@/components/ErrorTips";
import { POLICY_LIST } from "@/constants";
import InfiniteLoading from 'vue-infinite-loading'
export default {
  props: {
    // policiesSelectedData: () => []
    // policiesSelectedData: Array
  },
  data() {
    return {
      strategiesInfiniteId: 1,
      selectedStrategies: [],
      selectedPolicyId: [],
      strategiesPage: 1,
      policyInp: "",
      strategiesTotalNum: 0,
      strategies: [],
      loading: true,
      selectedPolicyId: [],
    };
  },
  components: {
    InfiniteLoading
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
    loadStrategies($state) {
      this.axios.post(POLICY_LIST, {
        Version: '2019-01-16',
        Page: this.strategiesPage,
        Rp: this.strategiesRp,
        Keyword: this.policyInp,
        Scope: 'QCS', // 自取预设策略
      }).then(res => {
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
    deleteRow(i, row) {
      this.selectedStrategies.splice(i, 1)
      this.selectedPolicyId.splice(i, 1)
      
      this.$refs.strategiesTable.toggleRowSelection(this.strategies.find(s => s.PolicyId === row.PolicyId), false)
    },
    //策略搜索
    _policySearch() {
      this.strategies = []
      this.strategiesPage = 1
      this.strategiesInfiniteId += 1
    },
    getDaata() {
      return this.selectedStrategies;
    }
  }
};
</script>
<style lang="scss" scoped>
::v-deep .el-input__clear {
  position: absolute;
  right: calc(100% + 2px);
}
.Cam {
  .container {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    p.title,
    p.explain {
      text-align: center;
      line-height: 20px;
      font-size: 16px;
      color: #000;
      font-weight: 700;
    }

    p.explain {
      font-size: 12px;
      color: #ccc;
      margin-top: 10px;
      line-height: 16px;
      color: #666;
    }

    .ifier {
      position: absolute;
      font-size: 130%;
      right: 2%;
      top: 6%;
    }

    .direction {
      display: table-cell;
      width: 38px;
      text-align: center;
      vertical-align: middle;
    }

    .direction-icon {
      width: 16px;
      height: 16px;
      display: inline-block;
      vertical-align: middle;
      background-repeat: no-repeat;
      background-position: inherit;
      font-size: 0;
    }

    .container-left {
      display: flex;
      flex-direction: column;
      width: 45%;
      height: 600px;
      justify-content: center;
      padding: 15px;
      box-sizing: border-box;
    }
    .container-right {
      display: flex;
      width: 45%;
      height: 600px;
      flex-direction: column;
      justify-content: center;
      padding: 15px;
      box-sizing: border-box;
    }
  }
}
</style>

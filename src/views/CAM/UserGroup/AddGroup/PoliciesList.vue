<template>
    <div class="Cam">
        <div class="container">
            <div class="container-left">
              <p>选择策略（共{{totalNum}}条）</p>
              <el-input size="mini" v-model="search"  style="width:85%"  @keyup.enter.native="toQuery"/>
              <el-button size="mini" class="suo" icon="el-icon-search" @click="toQuery"></el-button>
              <el-table
                class="table-left"
                    ref="multipleOption"
                    :data="policiesData"
                    size = "small"
                    height="300"
                    tooltip-effect="dark"
                    style="width: 100%"
                    @row-click="selectedRow"
                    @selection-change="handleSelectionChange">
                    <el-table-column type="selection" prop="policyId" width="30"> </el-table-column>
                      <el-table-column prop="policyName" label="策略名"  show-overflow-tooltip>
                        <template slot-scope="scope">
                          <p>{{scope.row.policyName}}</p>
                          <p>{{scope.row.description}}</p>
                        </template>
                      </el-table-column>
                      <el-table-column prop="type" label="策略类型"  width="100">
                        <template slot-scope="scope">
                          <p v-show="scope.row.type == 1">自定义策略</p>
                          <p v-show="scope.row.type == 2">预设策略</p>
                        </template>
                      </el-table-column>
                </el-table>
             </div>
            <div class="abs">
              <div>&nbsp;</div>
            </div>
            <div class="container-left">
              <span>已选择（共条）</span>
              <el-table
                  class="table-left"
                  ref="multipleSelected"
                  :data="policiesSelectedData"
                  tooltip-effect="dark"
                  size = "small"
                  height="300"
                  style="width: 100%">
                  <el-table-column prop="policyName" label="策略名"  show-overflow-tooltip>
                    <template slot-scope="scope">
                      <p>{{scope.row.policyName}}</p>
                      <p>{{scope.row.description}}</p>
                    </template>
                  </el-table-column>
                  <el-table-column prop="type" label="策略类型"  width="100">
                      <template slot-scope="scope">
                        <p v-show="scope.row.type == 1">自定义策略</p>
                        <p v-show="scope.row.type == 2">预设策略</p>
                      </template>
                    </el-table-column>
                  <el-table-column :label="$t('CAM.CAM.userGroup.colHandle')"  width="50">
                    &lt;!&ndash;<template slot-scope="scope">
                      <el-button
                        @click.native.prevent="deleteRow(scope.$index, policiesSelectedData)"
                        type="text"
                        size="small">
                        x
                      </el-button>
                    </template>&ndash;&gt;
                  </el-table-column>
              </el-table>
            </div>
        </div>
    </div>
</template>

<script>
  export default {
    props: {
      // policiesSelectedData: () => []
      // policiesSelectedData: Array
    },
    data() {
      return {
        policiesData: [],
        policiesSelectedData: [],
        totalNum: '',
        search: '',
        rp: 20,
        page: 1
      };
    },
    mounted() {
        this.init()
    },
    methods: {
        init() {
            let params = {
                Action: 'ListPolicies',
                rp: this.rp,
                page: this.page,
                scope:'All'
            }
            if(this.search != null && this.search != '') {
              params['Keyword'] = this.search
            }
            let url = "cam/ListPolicies"
            this.axios.post(url, params).then(res => {
                console.log(res)
                this.totalNum = res.data.totalNum
                this.policiesData = res.data.list
            }).catch(error => {
                console.log(error)
            })
        },
        handleSelectionChange(val) {
          // 给右边table框赋值，只需在此处赋值即可，selectedRow方法中不写，因为单独点击复选框，只有此方法有效。
          this.policiesSelectedData = val
        },
        selectedRow(row, column, event) {
        // 设置选中或者取消状态
          this.$refs.multipleOption.toggleRowSelection(row)
        },
        deleteRow(index, rows) {
          // 获取右边框中取消的行数据，将此行数据在右边框中的选中状态取消
          this.$refs.multipleOption.toggleRowSelection(rows[index],false)
        },
        toQuery() {
          this.init()
        },
        getDaata(){
          return this.policiesSelectedData
        }
    }
  };
</script>
<style lang="scss" scoped>
  .Cam {
  .container {
    width:96%;
    height:270px;
    min-height: 360px;
    margin:10px auto 0;
    background: #fff;
    padding:20px;
    p.title,p.explain{
      text-align: center;
      line-height: 20px;
      font-size: 16px;
      color: #000;
      font-weight: 700;
    }
    p.explain {
      font-size: 12px;
      color:#ccc;
      margin-top: 10px;
      line-height: 16px;
      color: #666;
    }
    .abs{
      display: inline-block;
      width: 100px;
      height: 300px;
      text-align: center;
    }
    .container-left{
      width: 44%;
      display: inline-block;
    }
  }

}
</style>
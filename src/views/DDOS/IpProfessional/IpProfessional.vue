<template>
  <div>
    <div class="statistReportTit">
      <div class="ReportTit newClear">
        <h3 class="ReportTitH3">统计报表</h3>
        <el-button class="ReportTitBtn" type="primary">新购</el-button>
      </div>
      <div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="DDoS攻击防护" name="first">
            <div class="mainConList">
              <div class="mainConListAll mainConListOne">
                <el-date-picker
                  v-model="value1"
                  type="daterange"
                  align="right"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="pickerOptions">
                </el-date-picker><br/>
                <el-input class="mainConListOneIpt" placeholder="请输入要查询的ID或名称"/>
              </div>
              <div class="mainConListAll mainConListTwo">
                <el-tabs class="tabsCard" v-model="activeName1" type="card" @tab-click="handleClick1">
                  <el-tab-pane label="攻击流量宽带" name="first">
                    <div>
                      攻击流量宽带
                    </div>
                  </el-tab-pane>
                  <el-tab-pane label="攻击包速率" name="second">
                    <div>
                      攻击包速率
                    </div>
                  </el-tab-pane>
                </el-tabs>
              </div>
              <div class="mainConListAll">

              </div>
              <div class="mainConListAll mainConListFour">
                <h3>DDoS攻击详情</h3>
                <el-table :data="tableDataBegin.slice((currentPage-1)*pageSize,currentPage*pageSize)">
                  <el-table-column prop="attackTime" label="攻击时间"></el-table-column>
                  <el-table-column prop="durnTime" label="持续时间"></el-table-column>
                  <el-table-column prop="attackType" label="攻击类型"></el-table-column>
                  <el-table-column prop="attackStatus" label="攻击状态"></el-table-column>
                  <el-table-column prop="attackAction" label="操作" width="180">
                    <template slot-scope="">
                      <el-button
                        type="text"
                        size="small"
                      >操作</el-button>
                      <!-- <el-dialog
                        :title="'您确定要删除'+scope.row.funName+'吗？'"
                        :visible.sync="dialogVisible"
                        width="30%"
                        :before-close="handleClose"
                      >
                        <span>删除函数将永久删除函数代码及已绑定的触发器。是否确定删除此函数？</span>
                        <span slot="footer" class="dialog-footer">
                          <el-button @click="dialogVisible = false">取 消</el-button>
                          <el-button type="primary" @click="sureDelete()">确 定</el-button>
                        </span>
                      </el-dialog> -->
                    </template>
                  </el-table-column>
                </el-table>
                <div class="tabListPage">
                  <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[10, 20, 30, 50]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="totalItems"
                  >
                  </el-pagination>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="CC攻击防护" name="second">
            <div class="mainConList">
              <div class="mainConListAll mainConListOne">
                <el-date-picker
                  v-model="value1"
                  type="daterange"
                  align="right"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="pickerOptions">
                </el-date-picker><br/>
                <el-input class="mainConListOneIpt" placeholder="请输入要查询的ID或名称"/>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="业务" name="third">
            <div class="mainConList">
              <div class="mainConListAll mainConListOne">
                <el-date-picker
                  v-model="value1"
                  type="daterange"
                  align="right"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="pickerOptions">
                </el-date-picker><br/>
                <el-input class="mainConListOneIpt" placeholder="请输入要查询的ID或名称"/>
              </div>
              <div class="mainConListAll mainConListTwo">
                <el-tabs class="tabsCard" v-model="activeName1" type="card" @tab-click="handleClick1">
                  <el-tab-pane label="攻击流量宽带" name="first">
                    <div>
                      攻击流量宽带
                    </div>
                  </el-tab-pane>
                  <el-tab-pane label="攻击包速率" name="second">
                    <div>
                      攻击包速率
                    </div>
                  </el-tab-pane>
                </el-tabs>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      activeName: 'first',
      activeName1:"first",
      value1:"",
      pickerOptions: {
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
              picker.$emit('pick', [start, end]);
            }
          },{
            text: '近7天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '近15天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 15);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '近30天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '近半年',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30 * 6);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        tableDataBegin: [],
      tableDataName: "",
      tableDataEnd: [],
      currentPage: 1,
      pageSize: 10,
      totalItems: 0,
      filterTableDataEnd: [],
      flag: false,
      allData:[
        {
          attackTime:"1",
          durnTime:"2",
          attackType:"3",
          attackStatus:"4"
        }
      ]
    }
  },
  created() {
    this.getData();
  },
  methods:{
    handleClick(tab, event) {
      //console.log(tab, event);
    },
    handleClick1(){},
    getData() {
      var cookies = document.cookie;
      var list = cookies.split(";");
      for (var i = 0; i < list.length; i++) {
        var arr = list[i].split("=");
      }
      console.log(arr[1]);
      let params = {
        // Action: "ListFunctions",
        Version: "2018-04-16",
        Region: arr[1]
      };
      //this.$axios.post('scf/ListFunctions', params).then(res => {
      //console.log(res.data);
      //this.tableDataBegin = res.data.dataTable;
      //this.allData = this.tableDataBegin;
        this.tableDataBegin = this.allData;
        // 将数据的长度赋值给totalItems
        this.totalItems = this.tableDataBegin.length;
        if (this.totalItems > this.pageSize) {
          for (let index = 0; index < this.pageSize; index++) {
            this.tableDataEnd.push(this.tableDataBegin[index]);
          }
        } else {
          this.tableDataEnd = this.tableDataBegin;
        }
      //});
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.handleCurrentChange(this.currentPage);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      //需要判断是否检索
      if (!this.flag) {
        this.currentChangePage(this.tableDataEnd);
      } else {
        this.currentChangePage(this.filterTableDataEnd);
      }
    }, //组件自带监控当前页码
    currentChangePage(list) {
      let from = (this.currentPage - 1) * this.pageSize;
      let to = this.currentPage * this.pageSize;
      this.tableDataEnd = [];
      for (; from < to; from++) {
        if (list[from]) {
          this.tableDataEnd.push(list[from]);
        }
      }
    }
  }
}

</script>
<style lang="scss">
.newClear{
  content:"";
  display: block;
  clear:both;
}
.statistReportTit{
  width:100%;
  height:84px;
  background-color:#fff;
  border-bottom:1px solid #ddd;
  padding:12px 20px 0;
  .ReportTitH3{
    float:left;
    font-size:16px;
    font-weight:600;
  }
  .ReportTitBtn{
    float:right;
    height:32px;
    line-height: 32px;
    padding:0 20px;
  }
}
.mainConList{
  padding:20px;
  width:100%;
  .mainConListAll{
    width:100%;
    min-height:100px;
    border:1px solid #ddd;
    margin-bottom:20px;
    background-color:#fff;
    padding:20px;
    box-shadow: 0 2px 3px 0 rgba(0,0,0,.2);
    .mainConListOneIpt{
      width:200px;
      margin-top:12px;
    }
    .tabsCard{
      border:none;
      .el-tabs__header{
        border:none;
        .el-tabs__nav{
          border-bottom:1px solid #e4e7ed;
        }
        .el-tabs__item.is-active{
          color: #3E8EF7;
          border: 1px solid #3E8EF7;
        }
      }
    }
  }
  .mainConListFour{
    h3{
      line-height:52px;
      font-size:14px;
      color:#888;
      font-weight:600;
    }
  }
}
.tabListPage{
  text-align:right;
}
</style>
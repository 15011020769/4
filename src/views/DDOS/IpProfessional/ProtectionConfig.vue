<template>
  <div>
    <div class="statistReportTit">
      <div class="ReportTit newClear">
        <h3 class="ReportTitH3">{{$t('DDOS.Proteccon_figura.Proteccon_title')}}</h3>
        <el-button class="ReportTitBtn" type="primary" @click="newBuy">{{$t('DDOS.Statistical_forms.new_bug')}}</el-button>
      </div>
      <div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane :label="$t('DDOS.Proteccon_figura.DDosprotection')" name="first">
            <div class="mainContent">
              <div class="textAlignTop newClear">
                <el-select class="checkListSelect" placeholder="要过滤的标签" v-model="filterConrent">
                  <el-option v-for="(item, index) in options1" :label="item.label" :value="item.value" :key="index"></el-option>
                </el-select>
                <el-input
                  v-model="tableDataName"
                  class="searchs"
                  placeholder="请输入要查询的内容"
                ></el-input>
                <el-button class="el-icon-search" @click="doFilter"></el-button>
              </div>
              <div class="mainTable">
                <el-table :data="tableDataBegin.slice((currentPage-1)*pageSize,currentPage*pageSize)">
                  <el-table-column prop="Record.Id" :label="$t('DDOS.Proteccon_figura.Id_name')">
                    <template slot-scope="scope">
                      <div v-for="(item, index) in scope.row.Record" :key="index">
                        <div v-if="item.Key=='Id'">{{item.Value}}</div>
                        <!-- <a v-if="item.Key=='Id'" href="#" @click="toDetail(scope.$index, scope.row)">{{item.Value}}</a> -->
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="Record.GroupIpList" label="IP">
                    <template slot-scope="scope">
                      <div v-for="(item, index) in scope.row.Record" :key="index">
                        <div v-if="item.Key=='GroupIpList'">{{item.Value}}</div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="origin" :label="$t('DDOS.Proteccon_figura.region')">
                    <template slot-scope="scope">
                      <div v-for="(item, index) in scope.row.Record" :key="index">
                        <div v-if="item.Key=='Id'">-</div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="Record.DefendStatus" :label="$t('DDOS.Proteccon_figura.Protection_state')">
                    <template slot-scope="scope">
                      <div v-for="(item, index) in scope.row.Record" :key="index">
                        <div v-if="item.Key=='DefendStatus' && item.Value == '1'">开启</div>
                        <div v-else-if="item.Key=='DefendStatus' && item.Value != '1'">-</div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="Record.DdosThreshold" label="清洗阈值">
                    <template slot-scope="scope">
                      <div v-for="(item, index) in scope.row.Record" :key="index">
                        <div v-if="item.Key=='DdosThreshold'">{{item.Value}}Mps</div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="saveGarden" :label="$t('DDOS.Proteccon_figura.Protection_level')">
                    <template slot-scope="scope">
                      <div v-for="(item, index) in scope.row.Record" :key="index">
                        <div v-if="item.Key=='Id'">-</div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="BusinessScene" :label="$t('DDOS.Proteccon_figura.Business_scenario')">
                    <template slot-scope="scope">
                      <div v-for="(item, index) in scope.row.Record" :key="index">
                        <div v-if="item.Key=='Id'">-</div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="advanced" :label="$t('DDOS.Proteccon_figura.Advanced_strategy')">
                    <template slot-scope="scope">
                      <div v-for="(item, index) in scope.row.Record" :key="index">
                        <div v-if="item.Key=='Id'">-</div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="action" label="操作" width="180">
                    <template slot-scope="scope">
                      <el-button
                        @click="changeRow(scope.$index, scope.row)"
                        type="text"
                        size="small"
                      >修改</el-button>
                    </template>
                  </el-table-column>
                  <!-- 修改弹框 -->
                  <changeModel :configShow="changeModel" @closeConfigModel="closeConfigModel"/>
                </el-table>
              </div>
              <div class="tabListPage">
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="currentPage"
                  :page-sizes="[10, 20, 30, 50]"
                  :page-size="pageSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="totalItems"
                ></el-pagination>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="$t('DDOS.Proteccon_figura.CC_protection')" name="second">
            <div>
              <ccProtection :ccProtectSele='resourceId'/>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="$t('DDOS.Proteccon_figura.Advanced_strategys')" name="third">
            <div class="mainContent">
              <div v-if="tableShow">
                <el-button class="addNewT" type="primary" @click="addNewTactics">添加新策略</el-button>
                <div class="minTable">
                  <el-table :data="tableDataPolicy">
                  <el-table-column prop="PolicyName" :label="$t('DDOS.Proteccon_figura.Policy_name')">
                    <template slot-scope="scope">
                      {{scope.row.PolicyName}}
                      <!-- <a href="#" @click="toDetail(scope.$index, scope.row)">{{scope.row.PolicyName}}</a> -->
                    </template>
                  </el-table-column>
                  <el-table-column prop="Resources.length" :label="$t('DDOS.Proteccon_figura.Number_resources')">
                    <template slot-scope="scope">{{scope.row.Resources.length}}</template>
                  </el-table-column>
                  <el-table-column prop="CreateTime" :label="$t('DDOS.Proteccon_figura.Creation_time')">
                    <template slot-scope="scope">{{scope.row.CreateTime}}</template>
                  </el-table-column>
                  <el-table-column prop="action" label="操作" width="180">
                    <template slot-scope="scope">
                      <el-button
                        @click="configListCon(scope.$index, scope.row)"
                        type="text"
                        size="small"
                      >配置</el-button>
                      <el-button
                        @click.native.prevent="deleteRow(scope.$index, scope.row)"
                        type="text"
                        size="small"
                      >删除</el-button>
                      <el-dialog
                        title="删除高级策略"
                        :visible.sync="dialogVisible"
                        width="30%"
                        :before-close="handleClose"
                      >
                        <h1 class="deleteTit"><i class="el-icon-warning"></i>确定删除该政策么？</h1>
                        <p class="deleteCont">删除策略后，该防护策略将从列表中永久删除，不可恢复。若您已开启UDP水印剥离开关，则策略会同步关闭UDP水印剥离开关。</p>
                        <p class="deleteCont">确定删除该条高级策略(erg)？</p>
                        <span slot="footer" class="dialog-footer">
                          <el-button @click="dialogVisible = false">取 消</el-button>
                          <el-button type="primary" @click="deleteDDoSPolicy()">确 定</el-button>
                        </span>
                      </el-dialog>
                      <el-button
                        @click="bindingResource(scope.$index, scope.row)"
                        type="text"
                        size="small"
                      >绑定资源</el-button>
                      <el-dialog
                        title="绑定资源"
                        :visible.sync="dialogVisible1"
                        width="43%"
                        :before-close="handleClose1"
                      >
                        <div style="text-align: center">
                          <el-transfer
                            style="text-align: left; display: inline-block"
                            v-model="valueThrou"
                            filterable
                            :left-default-checked="[2, 3]"
                            :right-default-checked="[1]"
                            :render-content="renderFunc"
                            :titles="['选择资源', '已选择']"
                            :button-texts="['到左边', '到右边']"
                            :format="{
                              noChecked: '${total}',
                              hasChecked: '${checked}/${total}'
                            }"
                          @change="handleChange"
                          :data="resData"
                        ></el-transfer>
                      </div>

                      <span slot="footer" class="dialog-footer">
                        <el-button @click="dialogVisible1 = false">取 消</el-button>
                        <el-button type="primary" @click="bindingResourceSure()">确 定</el-button>
                      </span>
                    </el-dialog>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <div v-if="!tableShow">
            <addNewTactics :policy="policy" :isShow="tableShow" @closePage="closePageAdd" />
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import addNewTactics from "./addNewTactics";
import ProtectConfigModel from "./model/ProtectConfigModel";
import ccProtection from "./tabs/ccProtection"; //cc防护模块
import {
  RESOURCE_LIST,
  DDOSPOLICY_CONT,
  DDOS_POLICY_DELETE
} from "@/constants";
import HeaderCom from "../../CLA/Public/Head";
export default {
  data() {
    return {
      resourceId: "", //资源ID
      tableDataBegin: [], //DDoS攻击防护列表
      // 过滤刷新列表过程中使用
      allData: [], // 存储全部实例列表
      changeModel: false, //修改框
      options1: [
        { label: "IP", value: "IP" },
        { label: "ID", value: "ID" },
        { label: "服务包名称", value: "serverBag" }
      ],
      tableDataName: "",
      tableDataTemp: [],
      tableDataTemp2: [],
      tableDataPolicy: [], //tab3,DDoS高级防护策略
      policy: {}, //配置高级防护策略的对象
      resData: this.generateData(),
      valueThrou: [1],
      renderFunc(h, option) {
        return <span>{option.key} </span>;
      }, //穿梭框
      activeName: "first", //tab页
      filterConrent: "IP",
      currentPage: 1, //当前页
      pageSize: 10, //每页数量
      totalItems: 0, //总数量
      flag: false, //定义一个开关
      multipleSelection: [],
      dialogVisible: false,
      dialogVisible1: false, //绑定资源弹框
      tableShow: true,
      deleteIndex: "",
      deleteBegin: {},
      deleteIndex1: "",
      deleteBegin1: {},
      thisData: ["1", "2", "3"],
      changeModelTip1: false, //修改模式提示弹框
      changeModelTip2: false,
      changeModelTip3: false
    };
  },
  components: {
    HeaderCom: HeaderCom,
    addNewTactics: addNewTactics,
    changeModel: ProtectConfigModel,
    ccProtection: ccProtection //cc防护模块
  },
  created() {
    this.describeResourceList();
    this.describeDDoSPolicy();
  },
  methods: {
    // 1.1.获取资源列表
    describeResourceList() {
      let params = {
        Version: "2018-07-09",
        Business: "net"
      };
      this.axios.post(RESOURCE_LIST, params).then(res => {
        // console.log(res)
        this.tableDataBegin = res.Response.ServicePacks;
        for (let i = 0; i < this.tableDataBegin.length; i++) {
          let list = this.tableDataBegin[i];
          list.Record.forEach((value, index) => {
            if (value.Key == "Id") {
              // console.log(value.Value)
              this.resourceId = value.Value;
            }
          });
        }
        this.allData = res.Response.ServicePacks;
        this.totalItems = res.Response.Total;
      });
    },
    // 1.2.获取DDoS高级策略
    describeDDoSPolicy() {
      let params = {
        Version: "2018-07-09",
        Business: "net"
      };
      this.axios.post(DDOSPOLICY_CONT, params).then(res => {
        // console.log(res)
        this.tableDataPolicy = res.Response.DDosPolicyList;
      });
    },

    // 修改
    changeRow(changeIndex, changeRow) {
      this.changeModel = true;
      // console.log(this.servicePack)
    },
    // 搜索
    doFilter() {
      // console.log(this.filterConrent, this.tableDataName);
      if (this.tableDataName != null && this.tableDataName != "") {
        //每次手动将数据置空,因为会出现多次点击搜索情况
        this.tableDataBegin = new Array();
        this.tableDataTemp = new Array();
        this.allData.forEach((val, index) => {
          if (this.filterConrent == "IP") {
            val.Record.forEach((val2, index) => {
              if (
                val2.Key == "GroupIpList" &&
                this.tableDataName.indexOf(val2.Value) > -1
              ) {
                this.tableDataTemp.push(val);
              }
            });
          } else if (this.filterConrent == "ID") {
            val.Record.forEach((val2, index) => {
              if (val2.Key == "Id" && val2.Value == this.tableDataName) {
                this.tableDataTemp.push(val);
              }
            });
          }
        });
        this.tableDataBegin = this.tableDataTemp;
      } else {
        // 如果没有输入搜素内容
        this.tableDataBegin = this.allData;
      }
      this.totalItems = this.tableDataBegin.length;
      //页面数据改变重新统计数据数量和当前页
      this.currentPage = 1;
      this.totalItems = this.tableDataBegin.length;
      //渲染表格,根据值
      this.currentChangePage(this.tableDataBegin);
      //页面初始化数据需要判断是否检索过
      this.flag = true;
    },
    // Tab页面切换
    handleClick(tab, event) {
      if (tab.name == "first") {
        //DDOS攻击防护
        this.describeResourceList();
      } else if (tab.name == "second") {
        //CC防护
        // console.log('second')
      } else if (tab.name == "third") {
        //DDOS高级防护策略
        this.describeDDoSPolicy();
      }
    },

    toDetail() {},
    //修改框关闭按钮
    // changeClose(){
    //   this.changeModel=false;
    // },
    openData() {},
    // 分页开始
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.handleCurrentChange(this.currentPage);
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.currentPage = val;
      //需要判断是否检索
      if (!this.flag) {
        this.currentChangePage(this.tableDataTemp);
      } else {
        this.currentChangePage(this.tableDataTemp2);
      }
    }, //组件自带监控当前页码
    currentChangePage(list) {
      let from = (this.currentPage - 1) * this.pageSize;
      let to = this.currentPage * this.pageSize;
      this.tableDataTemp = [];
      for (; from < to; from++) {
        if (list[from]) {
          this.tableDataTemp.push(list[from]);
        }
      }
    },
    handleClose() {
      this.dialogVisible = false;
    },
    //绑定资源弹框关闭按钮
    handleClose1() {
      this.dialogVisible1 = false;
    },
    //点击删除函数按钮
    deleteRow(index, dataBegin) {
      // console.log(index, dataBegin);
      this.deleteIndex = index;
      this.deleteBegin = dataBegin;
      this.dialogVisible = true;
    },
    //删除函数的确定按钮，调用删除接口
    deleteDDoSPolicy() {
      let params = {
        Version: "2018-07-09",
        Business: "net",
        PolicyId: this.deleteBegin.PolicyId
      };
      // console.log(params.PolicyId);
      this.axios.post(DDOS_POLICY_DELETE, params).then(res => {
        //console.log(res);
        this.describeDDoSPolicy();
        this.dialogVisible = false;
      });
    },
    // 添加高级防护策略
    addNewTactics() {
      this.policy = {};
      this.tableShow = false;
    },
    //点击表格操作配置按钮
    configListCon(configIndex, val) {
      this.policy = val;
      this.tableShow = false;
    },
    //绑定资源按钮
    bindingResource(bindingIndex, bindingCon) {
      this.deleteIndex1 = bindingIndex;
      this.deleteBegin1 = bindingCon;
      this.dialogVisible1 = true;
    },
    //绑定资源弹框确定按钮
    bindingResourceSure() {
      this.dialogVisible1 = false;
    },
    //接收子组件的方法，并让子组件消失父组件显示
    closePageAdd(obj) {
      // console.log(obj)
      this.tableShow = true;
    },
    //穿梭框事件
    handleChange(value, direction, movedKeys) {
      // console.log(value, direction, movedKeys);
    },
    generateData() {
      const data = [];
      // console.log(thisData)
      // for (let i =0; i < this.thisData.length; i++) {
      //   data.push(this.thisData[i]);
      // }
      return data;
    },
    //跳转新购页面
    newBuy() {
      let routeUrl = this.$router.resolve({
        path: "/choose"
      });
      window.open(routeUrl.href, "_blank");
    },
    //修改弹框关闭按钮
    closeConfigModel(isShow) {
      // console.log(isShow)
      this.changeModel = isShow;
    }
  }
};
</script>
<style lang="scss" scoped>
.wrap >>> .el-tabs__nav-wrap {
  background: white;
  padding: 0 15px;
  box-sizing: border-box;
}
.wrap >>> .el-input__inner {
  height: 30px;
  line-height: 30px;
  padding-top: 0;
  border-radius: 0;
}
.newClear:after {
  content: "";
  display: block;
  clear: both;
}
.statistReportTit {
  width: 100%;
  height: 84px;
  background-color: #fff;
  border-bottom: 1px solid #ddd;
  padding: 12px 20px 0;
  .ReportTitH3 {
    float: left;
    font-size: 16px;
    font-weight: 600;
  }
  .ReportTitBtn {
    float: right;
    height: 32px;
    line-height: 32px;
    padding: 0;
  }
}
.mainContent {
  width: 100%;
  min-height: 100px;
  background-color: #fff;
  padding: 20px;
  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
  border: 1px solid #ddd;
  margin-bottom: 20px;
  .textAlignTop {
    width: 100%;
    text-align: right;
    .checkListSelect {
      height: 30px;
      width: 100px;
      div {
        height: 30px;
        width: 100px;
        input {
          height: 30px;
          width: 100px;
          border-radius: 0;
        }
      }
    }
  }
  .addNewT {
    height: 30px;
    border-radius: 0;
    line-height: 30px;
    padding: 0 20px;
  }
  .minTable {
    min-height: 450px;
  }
}
.searchs {
  width: 200px !important;
  height: 30px;
  margin-bottom: 20px;
  input {
    height: 30px;
    border-radius: 0;
    width: 200px;
  }
}
button.el-icon-search {
  width: 50px;
  height: 30px;
  padding: 0;
  line-height: 30px;
  text-align: center;
  border-radius: 0;
  float: right;
}
.mainConListOneIpt {
  width: 200px;
  input {
    width: 200px;
  }
}
.el-icon-warning {
  color: red;
  font-size: 34px;
  margin-right: 15px;
  vertical-align: middle;
}
.deleteTit {
  font-size: 18px;
  color: #000;
  margin-bottom: 12px;
}
.deleteCont {
  padding-left: 50px;
}
.modelCenterCon {
  p {
    margin-bottom: 15px;
    span:nth-child(1).modelSpan1 {
      display: inline-block;
      font-size: 12px;
      color: #888;
      width: 126px;
      i {
        margin-left: 6px;
      }
    }
    span:nth-child(2) {
      .gardenChoose {
        padding: 0 20px;
        color: #000;
        font-size: 12px;
      }
      .seceltGarden {
        color: #006eff !important;
      }
    }
  }
}
.setSelect {
  width: 178px;
  height: 30px;
  border-radius: 0;
  div {
    width: 178px;
    height: 30px;
    border-radius: 0;
    input {
      width: 178px;
      height: 30px;
      border-radius: 0;
      padding-right: 15px !important;
    }
  }
  span.el-input__suffix {
    right: -41px;
  }
}
.intMbps {
  width: 120px !important;
  height: 30px;
  border-radius: 0;
  margin-left: 20px;
  border-radius: 0;
  input {
    width: 120px;
    height: 30px;
    border-radius: 0;
  }
}
.mainTable {
  min-height: 450px;
}
</style>
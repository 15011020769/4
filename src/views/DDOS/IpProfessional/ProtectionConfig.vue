<template>
  <!-- 防护配置 -->
  <div class="wrap">
    <HeaderCom title="防护配置" />
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <!-- DDOS攻击防护 -->
      <el-tab-pane
        :label="$t('DDOS.Statistical_forms.DDoS_Protection')"
        name="first"
        style="padding:0 20px;"
      >
        <div class="mainContent">
          <div class="textAlignTop newClear">
            <el-select
              class="checkListSelect"
              :placeholder="$t('DDOS.Proteccon_figura.yglbq')"
              v-model="filterConrent"
            >
              <el-option
                v-for="(item, index) in options1"
                :label="item.label"
                :value="item.value"
                :key="index"
              ></el-option>
            </el-select>
            <el-input
              v-model="tableDataName"
              class="searchs"
              :placeholder="$t('DDOS.Proteccon_figura.qsrcxnr')"
            ></el-input>
            <el-button class="el-icon-search" @click="doFilter"></el-button>
          </div>
          <div class="mainTable">
            <el-table
              :data="tableDataBegin.slice((currentPage-1)*pageSize,currentPage*pageSize)"
              v-loading="loading"
              empty-text="暫無數據"
            >
              <el-table-column prop="Record.Id" :label="$t('DDOS.Proteccon_figura.Id_name')">
                <template slot-scope="scope">
                  <div v-for="(item, index) in scope.row.Record" :key="index">
                    <div v-if="item.Key=='Id'">{{item.Value}}</div>
                    <!-- ID名称-->
                    <!-- <a v-if="item.Key=='Id'" href="#" @click="toDetail(scope.$index, scope.row)">{{item.Value}}</a> -->
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="Record.GroupIpList" label="IP">
                <template slot-scope="scope">
                  <div v-for="(item, index) in scope.row.Record" :key="index">
                    <div v-if="item.Key=='GroupIpList'">{{item.Value}}</div>
                    <!-- IP地址-->
                  </div>
                </template>
              </el-table-column>

              <el-table-column prop="origin" :label="$t('DDOS.Proteccon_figura.region')">
                <template slot-scope="scope">
                  <div v-for="(item, index) in scope.row.Record" :key="index">
                    <div v-if="item.Key=='Id'">中国台湾</div>
                    <!--地区：中国台湾 -->
                  </div>
                </template>
              </el-table-column>

              <el-table-column
                prop="Record.DefendStatus"
                :label="$t('DDOS.Proteccon_figura.Protection_state')"
              >
                <template slot-scope="scope">
                  <div v-for="(item, index) in scope.row.Record" :key="index">
                    <div
                      v-if="item.Key=='DefendStatus' && item.Value == '1'"
                    >{{$t('DDOS.AccesstoCon.AccOpen')}}</div>
                    <div v-else-if="item.Key=='DefendStatus' && item.Value != '1'">-</div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="Record.DdosThreshold"
                :label="$t('DDOS.protectCon.CleaningShold')"
              >
                <template slot-scope="scope">
                  <div v-for="(item, index) in scope.row.Record" :key="index">
                    <div v-if="item.Key=='DdosThreshold'">{{item.Value}}Mps</div>
                  </div>
                </template>
              </el-table-column>

              <el-table-column
                prop="saveGardenText"
                :label="$t('DDOS.Proteccon_figura.Protection_level')"
              >
                <template slot-scope="scope">
                  <div v-for="(item, index) in scope.row.Record" :key="index">
                    <div v-if="item.Key=='DDoSLevel'">{{DDoSLevel[item.Value]}}</div>
                    <!--防护等级 -->
                  </div>
                </template>
              </el-table-column>

              <el-table-column
                prop="BusinessScene"
                :label="$t('DDOS.Proteccon_figura.Business_scenario')"
              >
                <template slot-scope="scope">
                  <div v-for="(item, index) in scope.row.Record" :key="index">
                    <div v-if="item.Key=='Id'">-</div>
                    <!--业务场景 -->
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="Record.advanced"
                :label="$t('DDOS.Proteccon_figura.Advanced_strategy')"
              >
                <template slot-scope="scope">
                  <div v-for="(item, index) in scope.row.Record" :key="index">
                    <div v-if="item.Key=='Id'">-</div>
                    <!--高级防护策略 -->
                  </div>
                </template>
              </el-table-column>

              <el-table-column prop="action" label="操作" width="180">
                <template slot-scope="scope">
                  <el-button @click="changeRow(scope.$index, scope.row)" type="text" size="small">修改</el-button>
                </template>
              </el-table-column>
              <!-- 修改弹框 -->
              <changeModel
                :configShow="changeModel"
                :ddoslevel="ddoslevel"
                @closeConfigModel="closeConfigModel"
                :changeRow1="changeRow1"
              />
            </el-table>
          </div>
          <div class="Right-style pagstyle">
            <span class="pagtotal">共&nbsp;{{totalItems}}&nbsp;条</span>
            <el-pagination
              :page-size="pageSize"
              :pager-count="7"
              layout="prev, pager, next"
              @current-change="handleCurrentChange"
              :total="totalItems"
            ></el-pagination>
          </div>
        </div>
      </el-tab-pane>
      <!-- CC防护 -->
      <el-tab-pane :label="$t('DDOS.Proteccon_figura.CC_protection')" name="second">
        <div style="padding:0 20px;">
          <ccProtection />
        </div>
      </el-tab-pane>
      <!-- DDOS高级防护策略 -->
      <el-tab-pane
        :label="$t('DDOS.Proteccon_figura.Advanced_strategys')"
        name="third"
        style="padding:0 20px;"
      >
        <div class="mainContent">
          <div v-if="tableShow" style="background:white;">
            <el-button
              class="addNewT"
              type="primary"
              @click="addNewTactics"
            >{{$t('DDOS.Proteccon_figura.Add_newpolicy')}}</el-button>
            <div class="minTable">
              <el-table :data="tableDataPolicy" height="450" v-loading="loading" empty-text="暫無數據">
                <el-table-column prop="PolicyName" :label="$t('DDOS.Proteccon_figura.Policy_name')">
                  <template slot-scope="scope">
                    {{scope.row.PolicyName}}
                    <!-- <a href="#" @click="toDetail(scope.$index, scope.row)">{{scope.row.PolicyName}}</a> -->
                  </template>
                </el-table-column>
                <el-table-column
                  prop="Resources.length"
                  :label="$t('DDOS.Proteccon_figura.Number_resources')"
                >
                  <template slot-scope="scope">{{scope.row.Resources.length}}</template>
                </el-table-column>
                <el-table-column
                  prop="CreateTime"
                  :label="$t('DDOS.Proteccon_figura.Creation_time')"
                >
                  <template slot-scope="scope">{{scope.row.CreateTime}}</template>
                </el-table-column>
                <el-table-column prop="action" label="操作" width="180">
                  <template slot-scope="scope">
                    <el-button
                      @click="configListCon(scope.$index, scope.row)"
                      type="text"
                      size="small"
                      style="padding-left:7px"
                    >配置</el-button>
                    <el-button
                      @click.native.prevent="deleteRow(scope.$index, scope.row)"
                      type="text"
                      size="small"
                      :disabled="scope.row.BoundResources.length==0?false:true"
                    >{{$t('DDOS.Proteccon_figura.Delete')}}</el-button>
                    <el-dialog
                      title="删除高级策略"
                      :visible.sync="dialogVisible"
                      width="30%"
                      :before-close="handleClose"
                    >
                      <h1 class="deleteTit">
                        <i class="el-icon-warning"></i>
                        {{$t('DDOS.Proteccon_figura.delete_thepolicy')}}
                      </h1>
                      <p class="deleteCont">{{$t('DDOS.Proteccon_figura.After_deletingpolicy')}}</p>
                      <p class="deleteCont">{{$t('DDOS.Proteccon_figura.delete_advanced')}}({{deleteBegin.PolicyName}})?</p>
                      <span slot="footer" class="dialog-footer">
                        <el-button @click="dialogVisible = false">取 消</el-button>
                        <el-button
                          type="primary"
                          @click="deleteDDoSPolicy()"
                        >{{$t('DDOS.Proteccon_figura.Determination')}}</el-button>
                      </span>
                    </el-dialog>
                    <el-button
                      @click="bindingResource(scope.$index, scope.row)"
                      type="text"
                      size="small"
                      style="padding-left:7px"
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
                          :left-default-checked="[]"
                          :right-default-checked="[]"
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
                        <el-button
                          type="primary"
                          @click="bindingResourceSure()"
                        >{{$t('DDOS.Proteccon_figura.Determination')}}</el-button>
                      </span>
                    </el-dialog>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <div v-if="!tableShow">
            <addNewTactics
              :policy="policy"
              :isShow="tableShow"
              @closePage="closePageAdd"
              @describeDDoSPolicyADD="describeDDoSPolicy"
            />
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
  DDOS_POLICY_DELETE,
  GET_ID,
  Modify_Level,
  RESBIND_MODIFY
} from "@/constants";
import HeaderCom from "../../CLA/Public/Head";
export default {
  data() {
    return {
      loading: true,
      resourceId: "", //资源ID
      tableDataBegin: [], //DDoS攻击防护列表
      // 过滤刷新列表过程中使用
      allData: [], // 存储全部实例列表
      changeModel: false, //修改框
      options1: [
        {
          label: "IP",
          value: "IP"
        },
        {
          label: "ID",
          value: "ID"
        },
        {
          label: "服务包名称",
          value: "serverBag"
        }
      ],
      tableDataName: "",
      tableDataTemp: [],
      tableDataTemp2: [],
      tableDataPolicy: [], //tab3,DDoS高级防护策略
      policy: {}, //配置高级防护策略的对象
      resData: this.generateData(),
      valueThrou: [],
      valueRightOld: [],
      renderFunc(h, option) {
        return <div><span> {option.key} </span><br/><span>{option.label}</span></div>;
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
      bindingIndex: "",
      bindingCon: {},
      thisData: ["1", "2", "3"],
      changeModelTip1: false, //修改模式提示弹框
      changeModelTip2: false,
      changeModelTip3: false,
      changeRow1: "",
      DDoSLevel: {
        low: "宽松",
        middle: "正常",
        high: "严格"
      },
      ddoslevel: ""
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
      this.loading = true;
      let params = {
        Version: "2018-07-09",
        Business: "net"
      };
      this.axios.post(RESOURCE_LIST, params).then(res => {
        // console.log(res, 8888);
        this.tableDataBegin = res.Response.ServicePacks;
        for (let i = 0; i < this.tableDataBegin.length; i++) {
          let list = this.tableDataBegin[i];
          list.Record.forEach((value, index) => {
            if (value.Key == "Id") {
              this.resourceId = value.Value;
            }
          });
        }
        this.allData = res.Response.ServicePacks;
        this.totalItems = res.Response.Total;
        this.allData.forEach(val => {
          val.Record.forEach(item => {
            if (item.Key == "Id") {
              let params = {
                Version: "2018-07-09",
                Business: "net",
                Id: item.Value,
                Method: "get"
              };
              this.axios.post(Modify_Level, params).then(res => {
                const obj = {
                  Key: "DDoSLevel",
                  Value: res.Response.DDoSLevel
                };
                val.Record.push(obj);
              });
            }
          });
        });
        this.loading = false;

        //宽松 1
        // console.log(this.allData)
      });
    },
    //修改弹框关闭按钮
    closeConfigModel(isShow) {
      this.changeModel = isShow;
      this.describeResourceList();
    },
    // 1.2.获取DDoS高级策略
    describeDDoSPolicy() {
      // debugger
      this.loading = true;
      let params = {
        Version: "2018-07-09",
        Business: "net"
      };
      this.axios.post(DDOSPOLICY_CONT, params).then(res => {
        this.tableDataPolicy = res.Response.DDosPolicyList;
        this.loading = false;
        // console.log(this.tableDataPolicy)
      });
    },
    // 1.3.资源绑定DDoS高级策略
    modifyResBindDDoSPolicy(resId, method) {
      let params = {
        Version: "2018-07-09",
        Business: "net",
        Id: resId, //资源ID
        PolicyId: this.bindingCon.PolicyId, //策略ID
        Method: method //bind/unbind
      };
      this.axios.post(RESBIND_MODIFY, params).then(res => {
        // console.log(res.Response)
      });
    },
    // 修改
    changeRow(changeIndex, changeRow1) {
      changeRow1.Record.forEach(item => {
        if (item.Key == "DdosThreshold") {
          this.changeRow1 = item.Value;
        }
        if (item.Key == "DDoSLevel") {
          this.ddoslevel = item.Value;
        }
      });
      this.changeModel = true; //DdosThreshold"
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
      } else if (tab.name == "third") {
        //DDOS高级防护策略
        this.describeDDoSPolicy();
        this.closePageAdd();
      }
    },

    toDetail() {},
    openData() {},
    // 分页开始
    handleSizeChange(val) {
      this.pageSize = val;
      this.handleCurrentChange(this.currentPage);
    },
    handleCurrentChange(val) {
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
      this.axios.post(DDOS_POLICY_DELETE, params).then(res => {
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
      this.resData = [];
      // 循环策略列表（找出已被绑定的资源）
      let binded = [];
      this.tableDataPolicy.forEach(policy => {
        if(policy.PolicyId != bindingCon.PolicyId){
          policy.BoundResources.forEach(res => {
            binded.push(res);
          })
        }
      });
      // 循环资源列表
      this.tableDataBegin.forEach(resource => {
        const objTemp = {};
        resource.Record.forEach(element => {
          if(element.Key == "Id"){
            objTemp.key = element.Value;
          } else if(element.Key == "GroupIpList"){
            //175.97.143.121-tpe-bgp-300-1;175.97.142.153-tpe-bgp-100-1
            let arr = element.Value.split(';');
            objTemp.label = "";
            arr.forEach(ipStr => {
              objTemp.label += ipStr.substring(0, ipStr.indexOf('-'))+";";
            });
          }
        });
        if(binded.length>0 && binded.indexOf(objTemp.key)<0){
          this.resData.push(objTemp);
        } else if(binded.length==0){
          this.resData.push(objTemp);
        }
      });
      this.valueThrou = bindingCon.BoundResources;
      this.valueRightOld = bindingCon.BoundResources;
      // console.log(this.tableDataBegin);
      this.bindingIndex = bindingIndex;
      this.bindingCon = bindingCon;
      this.dialogVisible1 = true;
    },
    //绑定资源弹框确定按钮
    bindingResourceSure() {
      // 获取‘已选择’的两个数组差集
      let diff = [];// 1.绑定资源元素集（原数组中不包含的新元素）
      let tmp = JSON.parse(JSON.stringify(this.valueRightOld));// 2.解绑资源元素集（原数组中移除的元素）
      // 循环‘已选择’
      this.valueThrou.forEach(element => {
        if(this.valueRightOld.indexOf(element) < 0){
          diff.push(element);
        } else {
          tmp.splice(tmp.indexOf(element),1);
        }
      });
      this.loading = true;
      // console.log(diff, tmp);
      diff.forEach(resId => {
        this.modifyResBindDDoSPolicy(resId, "bind");
      });
      tmp.forEach(resId => {
        this.modifyResBindDDoSPolicy(resId, "unbind");
      });
      setTimeout(() => {
        this.describeDDoSPolicy();
      }, 2000);

      this.dialogVisible1 = false;
    },
    //接收子组件的方法，并让子组件消失父组件显示
    closePageAdd(obj) {
      this.tableShow = true;
    },
    //穿梭框事件(value右侧数组，direction:left/right，movedKeys移动元素)
    handleChange(value, direction, movedKeys) {
      // this.valueRightOld = value;
    },
    generateData() {
      const data = [];
      return data;
    },
    //跳转新购页面
    newBuy() {
      let routeUrl = this.$router.resolve({
        path: "/choose"
      });
      window.open(routeUrl.href, "_blank");
    }
  }
};
</script>
<style lang="scss" scoped>
a {
  cursor: pointer;
}
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
.header {
  border-bottom: none !important;
}
.tabListPage {
  height: 50px;
  padding-top: 8px;
  border-top: 1px solid #ddd;
  text-align: right;
}
</style>

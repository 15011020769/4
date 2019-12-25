<template>
<!-- 防护配置-CC防护-访问控制策略 -->
  <div id="addAccessControl">
    <div class="ccProtectPartThree">
      <div class="partThreeTop newClear">
        <el-button
          class="addAccessBtn"
          @click="addAccessModel"
        >{{$t('DDOS.Proteccon_figura.Add_access')}}</el-button>
        <span class="topTipAdd">{{$t('DDOS.Proteccon_figura.add_access')}}</span>
        <span class="floatRightSearch">
          <el-input class="searchIpt" placeholder="请输入要查找的策略名称" v-model="tableDataName"></el-input>
          <el-button @click="doFilter" class="el-icon-search"></el-button>
        </span>
      </div>
      <div class="tableList">
        <div class="tableConControl">
          <el-table
            :data="tableDataBegin.slice((currentPage-1)*pageSize,currentPage*pageSize)"
            style="width: 100%;margin: 18px 0 20px;"
            height="450"
            v-loading="loading"
          >
            <el-table-column
              prop="accessName"
              :label="$t('DDOS.Proteccon_figura.Policy_name')"
              width
            >
              <template slot-scope="scope">{{scope.row.Name}}</template>
            </el-table-column>
            <el-table-column prop="protocol" :label="$t('DDOS.Proteccon_figura.Agreement')" width>
              <template slot-scope="scope">{{scope.row.Protocol}}</template>
            </el-table-column>
            <el-table-column prop="protentIp" :label="$t('DDOS.Proteccon_figura.Protection_IP')">
              <template slot-scope="scope">
                <div v-for="(item, index) in scope.row.IpList" :key="index">
                  <span>{{item}};</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="domain" label="域名">
              <template slot-scope="scope">{{scope.row.Domain==''?'-':scope.row.Domain}}</template>
            </el-table-column>
            <el-table-column prop="MatchCondition" :label="$t('DDOS.Proteccon_figura.Matching_condition')">
              <template slot-scope="scope">
                <div v-for="(item, index) in scope.row.RuleList" :key="index">
                  {{item.Skey}}
                  <span v-if="item.Operator=='include'">包含</span>
                  <span v-else-if="item.Operator=='not_include'">不包含</span>
                  <span v-else-if="item.Operator=='equal'">等于</span>
                  {{item.Value}}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="exeMode" :label="$t('DDOS.Proteccon_figura.Matching_action')">
              <template slot-scope="scope">
                <span v-if="scope.row.ExeMode=='alg'">人机识别</span>
                <span v-else-if="scope.row.ExeMode=='drop'">拦截</span>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" :label="$t('DDOS.Proteccon_figura.Creation_time')">
              <template slot-scope="scope">{{scope.row.CreateTime}}</template>
            </el-table-column>
            <el-table-column prop="switch" :label="$t('DDOS.Proteccon_figura.Current_state')">
              <template slot-scope="scope">
                <el-switch
                  class="switch"
                  v-model="scope.row.Switch"
                  :active-value=1
                  :inactive-value=0
                  active-color="#006eff"
                  inactive-color="#bbb"
                  @change="changeSwitch(scope.row)"
                ></el-switch>
              </template>
            </el-table-column>
            <el-table-column prop="action" label="操作" width="180">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="handelEdit(scope.row)">编辑</el-button>
                <el-popover
                  placement="top"
                  width="160"
                  v-model="visible">
                  <p>删除此访问控制策略？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="visible = false">取消</el-button>
                    <el-button type="primary" size="mini" @click="deleteCCPolicy(scope.row)">确定</el-button>
                  </div>
                  <el-button slot="reference" type="text" size="small">删除</el-button>
                </el-popover>
              </template>
            </el-table-column>
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
    </div>
    <addAccessModel
      :isShow="addAccessContModel"
      :ccResourceId="ccResourceId"
      :editFlag="editFlag"
      :editCCPolicy="editCCPolicy"
      :dateFlag="new Date()"
      @closeDialogModel="closeDialogModel"
      @addAccessContSure="addAccessContSure"
    />
  </div>
</template>
<script>
import addAccessModel from "../model/addAccessContModel";
import { CCSELFDEFINEPOLICY_LIST, CCPOLICYSWITCH_MODIFY, CCSELFDEFINEPOLICY_DELETE } from "@/constants";
export default {
  props: {
    ccResourceId: String,//资源Id
  },
  data() {
    return {
      loading: false,
      tableDataBegin: [], //表格数据
      visible: false, //删除确认框
      editFlag: false,//是否是编辑
      editCCPolicy: {},//编辑CC对象
      tableDataName: "", //搜索框内容
      tableDataEnd: [], //定义一个数组
      currentPage: 1, //当前页
      pageSize: 10, //每页长度
      totalItems: 0, //总数
      filterTableDataEnd: [], //过滤后的数组
      addAccessContModel: false, //添加访问控制策略弹框
      flag: false,
      allData: [],//储存全量数据
    };
  },
  components: {
    addAccessModel: addAccessModel
  },
  mounted() {
    if(this.ccResourceId!=""){
      this.describeCCSelfDefinePolicy();
    }
  },
  watch: {
    ccResourceId(val) {
      this.ccResourceId = val;
      this.describeCCSelfDefinePolicy();
    }
  },
  methods: {
    // 1.1.获取CC自定义策略
    describeCCSelfDefinePolicy() {
      let params = {
        Version: "2018-07-09",
        Business: "net", //大禹子产品代号（bgp高防包；bgp-multip共享包）
        Id: this.ccResourceId
      };
      this.axios.post(CCSELFDEFINEPOLICY_LIST, params).then(res => {
        // console.log(params, res);
        this.tableDataBegin = res.Response.Policys;
        this.allData = res.Response.Policys;
        this.totalItems = res.Response.Total;
      });
    },
    //修改CC自定义策略开关
    changeSwitch(ccPolicy){
      // console.log(ccPolicy)
      this.modifyCCPolicySwitch(ccPolicy);
    },
    // 1.2.修改CC自定义策略开关
    modifyCCPolicySwitch(ccPolicy) {
      let params = {
        Version: "2018-07-09",
        Business: "net",
        Id: this.ccResourceId,
        SetId: ccPolicy.SetId,
        Switch: ccPolicy.Switch
      };
      this.axios.post(CCPOLICYSWITCH_MODIFY, params).then(res => {
        // console.log(params, res);
        this.describeCCSelfDefinePolicy();
      });
    },
    // 删除
    deleteCCPolicy(ccPolicy) {
      // console.log(ccPolicy)
      this.visible = false
      this.deleteCCSelfDefinePolicy(ccPolicy);
    },
    // 1.3.删除CC自定义策略
    deleteCCSelfDefinePolicy(ccPolicy) {
      let params = {
        Version: "2018-07-09",
        Business: "net",
        Id: this.ccResourceId,
        SetId: ccPolicy.SetId
      };
      this.axios.post(CCSELFDEFINEPOLICY_DELETE, params).then(res => {
        // console.log(params, res);
        this.describeCCSelfDefinePolicy();
      });
    },

    // 搜索
    doFilter() {
      this.tableDataBegin = this.allData;
      this.tableDataEnd = [];
      //每次手动将数据置空,因为会出现多次点击搜索情况
      this.filterTableDataEnd = [];
      this.tableDataBegin.forEach((val, index) => {
        if (val.Name.indexOf(this.tableDataName) >= 0) {
          this.filterTableDataEnd.push(val);
        } else {
          
        }
      });
      this.tableDataBegin = this.filterTableDataEnd;
      //页面数据改变重新统计数据数量和当前页
      this.currentPage = 1;
      this.totalItems = this.filterTableDataEnd.length;
      //渲染表格,根据值
      this.currentChangePage(this.filterTableDataEnd);
      //页面初始化数据需要判断是否检索过
      this.flag = true;
    },
    // 分页开始
    handleSizeChange(val) {
      this.pageSize = val;
      this.handleCurrentChange(this.currentPage);
    },
    handleCurrentChange(val) {
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
    },
    //添加访问控制策略弹框
    addAccessModel() {
      this.editFlag = false;
      this.addAccessContModel = true;
    },
    //添加访问控制策略弹框关闭按钮
    closeDialogModel(isShow) {
      this.addAccessContModel = isShow;
    },
    //添加访问控制策略确定按钮
    addAccessContSure(isShow) {
      this.addAccessContModel = isShow;
      this.describeCCSelfDefinePolicy();
    },
    //编辑
    handelEdit(ccPolicy){
      this.editFlag = true;
      this.editCCPolicy = ccPolicy;
      this.addAccessContModel = true;
    }
  }
};
</script>
<style lang="scss">
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
#addAccessControl {
  .ccProtectPartThree {
    margin-top: 10px;
    .addAccessBtn {
      height: 30px;
      border-radius: 0;
      background-color: #006eff;
      color: #fff;
      margin-right: 35px;
      padding: 0 12px;
      line-height: 30px;
    }
    .topTipAdd {
      font-size: 14px;
      color: #8f9297;
    }
    .floatRightSearch {
      float: right;
      .searchIpt {
        float: left;
        width: 180px;
        input {
          width: 180px;
          font-size: 12px;
        }
      }
      button {
        height: 30px;
        line-height: 30px;
        padding: 0 12px;
        border-radius: 0;
        float: left;
        :hover {
          background-color: transparent;
        }
      }
    }
    .tableList {
      width: 100%;
      background-color: #fff;
      border: 1px solid #ddd;
      box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
      margin-bottom: 20px;
      margin-top: 12px;
      .tableConControl {
        min-height: 450px;
      }
      .tabListPage {
        height: 50px;
        border-top: 1px solid #ddd;
        padding-top: 8px;
        text-align: right;
      }
    }
  }
}
</style>
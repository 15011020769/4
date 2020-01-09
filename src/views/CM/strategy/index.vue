<template>
  <div class="strategy-wrap">
    <Header title="告警策略">
      <div class="strategy-filter">
        <el-form
          :inline="true"
          :model="formInline"
          class="demo-form-inline"
          label-width="100px"
          size="mini"
          label-position="left"
        >
          <el-form-item label="策略名称">
            <el-input v-model="formInline.strategy_name" style="width:360px;"></el-input>
          </el-form-item>
          <el-form-item label="产品/策略类型">
            <el-select filterable v-model="formInline.product_name" style="width:100px;">
              <el-option
                v-for="(item,index) in formInline.product_kind"
                :key="index"
                :label="item.name"
                :value="item.id"
                label-width="40px"
              ></el-option>
            </el-select>
            <el-select
              multiple
              v-model="formInline.strategy_value"
              style="width:250px;margin-left:10px;"
            >
              <!-- <el-checkbox
                :indeterminate="isIndeterminate"
                v-model="checkAllProduct"
                @change="handleCheckAllChange"
              >全选</el-checkbox>
              <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
                <el-checkbox
                  v-for="(item,index) in formInline.strategy_kind"
                  :label="item.name"
                  :key="index"
                >{{item.name}}</el-checkbox>
              </el-checkbox-group>-->
              <el-option
                v-for="(item,index) in formInline.strategy_kind"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="告警对象">
            <el-select v-model="formInline.alarm" disabled style="width:360px;">
              <!-- <el-option
                v-for="(item,index) in formInline.alarm_list"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>-->
              <el-option label value></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="用户/组">
            <el-select v-model="formInline.user" style="width:100px;">
              <el-option
                v-for="(item,index) in formInline.user_kind"
                :key="index"
                :label="item.name"
                :value="item.value"
                label-width="40px"
              ></el-option>
            </el-select>
            <el-select
              multiple
              v-model="formInline.group"
              style="width:250px;margin-left:10px;margin-right:20px;"
            >
              <el-option
                v-for="(item,index) in formInline.kind_list"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
            <el-button type="text" class="clearBtn">清除筛选</el-button>

            <!-- <el-link type="primary">主要链接</el-link>
            <el-link type="info">信息链接</el-link>-->
          </el-form-item>
        </el-form>
      </div>
    </Header>
    <div class="overview-main">
      <div class="explain">
        <p>
          告警模板功能已上线，支持触发条件的复用与统一修改，请前往
          <a>触发条件模板</a>进行配置
          <a>查看详情</a>
        </p>
        <p>
          现已支持对告警策略的告警启停，可在策略维度、实例维度进行告警策略屏蔽，点击查看
          <a>告警启停文档</a>
        </p>
      </div>
    </div>
    <div class="table">
      <p class="addBtn">
        <el-row>
          <el-button type="primary" @click="addCreate">新增</el-button>
          <el-button :disable="operationFlag==-1?true:false">删除</el-button>
          <el-button :disable="operationFlag==-1?true:false">修改告警渠道</el-button>
        </el-row>
        <el-row class="iconBtn">
          <i class="el-icon-setting" @click="buyMessgae"></i>
          <i class="el-icon-refresh"></i>
          <i class="el-icon-download"></i>
        </el-row>
      </p>
      <el-table
        @cell-mouse-enter="mouseoverDefault"
        @cell-mouse-leave="mouseoutDefault"
        :data="tableData"
        style="width: 100%"
        height="450"
        v-loading="dataListLoading"
        :default-sort="{prop: 'changeData', order: 'descending'}"
      >
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column label="策略名称">
          <template slot-scope="scope">
            <a
              class="defaultDialog"
              @click="defaultClick(scope.row.grounpId)"
            >{{scope.row.groupName}}</a>
            <i v-show="defaultIconFlag" class="el-icon-edit"></i>
          </template>
        </el-table-column>
        <el-table-column label="触发条件">
          <template slot-scope="scope">
            <!-- {{scope.chufa1}} -->
            <p v-if="scope.row.chufa1.tiaojian">
              <span>触发条件：</span>
              <span>{{scope.row.chufa1.tiaojian}}</span>
            </p>
            <p v-if="scope.row.chufa1.zhiling">
              <span>指令告警：</span>
              <span>{{scope.row.chufa1.zhiling}}</span>
            </p>
            <p v-if="scope.row.chufa1.shijian">
              <span>事件告警：</span>
              <span>{{scope.row.chufa1.shijian}}</span>
            </p>
          </template>
        </el-table-column>
        <el-table-column prop="object" label="所属项目"></el-table-column>
        <el-table-column label="策略类型">
          <template slot-scope="scope">
            <b>{{scope.row.type}}</b>
          </template>
        </el-table-column>
        <el-table-column prop="YS" label="已启用/实例数"></el-table-column>
        <el-table-column label="最后修改">
          <template slot-scope="scope">
            <p>{{scope.row.lastChange.id}}</p>
            <p>{{scope.row.lastChange.data}}</p>
          </template>
        </el-table-column>
        <el-table-column label="告警渠道">
          <template slot-scope="scope">
            <div v-if="scope.row.qudao">
              <p class="qudaoInfo">
                <span>接收组：</span>
                <span>{{scope.row.qudao.jieshou}}个</span>
              </p>
              <p class="qudaoInfo">
                <span>有效期：</span>
                <span>{{scope.row.qudao.youxiao}}</span>
              </p>
              <p class="qudaoInfo">
                <span>渠道：</span>
                <span>{{scope.row.qudao.qudao}}</span>
              </p>
            </div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column label="告警启停">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.zanting" active-color="#13ce66" inactive-color="#eee"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template :slot-scope="scope.row">
            <el-button type="text" class="cloneBtn">复制</el-button>
            <el-button type="text" class="deleteBtn">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="Right-style pagstyle">
        <span class="pagtotal">共&nbsp;{{TotalCount}}&nbsp;{{$t("CVM.strip")}}</span>
        <el-pagination
          :page-size="pagesize"
          :pager-count="7"
          layout="prev, pager, next"
          @current-change="handleCurrentChange"
          :total="TotalCount"
        ></el-pagination>
      </div>
    </div>
    <!-- 点击设置 -->
    <Dialog :dialogVisible="dialogVisible" @cancel="cancel" @save="save" />
  </div>
</template>
<script>
import Header from "./components/Head";
import Dialog from "./components/dialog";
export default {
  name: "strategy",
  data() {
    return {
      checkAllProduct: false,
      checkedCities: [],
      cities: [
        {
          value: 0,
          name: "产品类型"
        },
        {
          value: 1,
          name: "策略类型"
        }
      ],
      isIndeterminate: true,

      formInline: {
        product_name: "产品类型", //策略
        product_kind: [
          {
            id: "1",
            value: 0,
            name: "产品类型"
          },
          {
            id: "2",
            value: 1,
            name: "策略类型"
          }
        ], //产品/.策略类型
        strategy_kind: [
          {
            value: 0,
            name: "全选"
          },
          {
            value: 1,
            name: "云服务器"
          },
          {
            value: 2,
            name: "云数据库"
          }
        ], //用户/组
        strategy_name: "", //策略名称
        alarm: "", //告警对象
        alarm_list: [
          {
            name: "告警对象1"
          }
        ], //告警对象数组
        user: "用户组", //用户
        group: "", //组
        user_kind: [
          {
            value: "0",
            name: "用户组"
          },
          {
            vale: "1",
            name: "用户名"
          }
        ], //用户类型数据
        kind_list: [
          {
            value: "0",
            name: "全选"
          },
          {
            value: "1",
            name: "误删"
          },
          {
            value: "2",
            name: "测试误删"
          }
        ], //用户名类型数据
        product_value: "", //产品
        strategy_value: "" //策略
      },
      tableData: [
        {
          grounpId: 3290043,
          groupName: "默认",
          isOpen: true,
          chufa1: {
            tiaojian: "我是条件",
            zhiling: "",
            shijian: ""
          },
          chufa: "容量使用率>80%,持续5分钟，不重复告警",
          object: "東崋雲计算有限公司",
          type: "默认云数据库-Redis-其他版本",
          YS: "3/3",
          yiqiying: 3,
          shilishu: 3,
          lastChange: {
            id: "100011921910",
            data: "2019/12/31 13:21:32"
          },
          lastEditUin: 100011921910,
          changeData: "2019/12/31 13:52:55",
          qudao: "",
          zanting: true
        },
        {
          grounpId: 3290043,
          groupName: "默认",
          isOpen: true,
          chufa1: {
            tiaojian: "我是条件",
            zhiling: "",
            shijian: "我是事件"
          },
          chufa: "容量使用率>80%,持续5分钟",
          object: "東崋雲计算有限公司",
          type: "默认云数据库",
          YS: "0/0",
          yiqiying: 3,
          shilishu: 3,
          lastChange: {
            id: "100011921910",
            data: "2019/12/31 13:21:32"
          },
          lastEditUin: 100011921910,
          changeData: "2019/12/31 13:21:32",
          qudao: {
            jieshou: "1",
            youxiao: "00:00:00 - 23:59:59",
            qudao: "邮箱、短信"
          },
          zanting: false
        },
        {
          grounpId: 3290043,
          groupName: "默认",
          isOpen: true,
          chufa1: {
            tiaojian: "我是条件",
            zhiling: "",
            shijian: "我是事件"
          },
          chufa: "容量使用率>80%",
          object: "東崋雲计算有限公司",
          type: "東崋雲云数据库",
          YS: "15/15",
          yiqiying: 3,
          shilishu: 3,
          lastChange: {
            id: "100011921910",
            data: "2019/12/31 13:21:32"
          },
          lastEditUin: 100011921910,
          changeData: "2019/12/31 7:16:46",
          qudao: "",
          zanting: true
        },
        {
          grounpId: 3290043,
          groupName: "默认",
          isOpen: true,
          chufa1: {
            tiaojian: "我是条件",
            zhiling: "我是指令",
            shijian: "我是事件"
          },
          chufa: "容量使用率>80%,持续5分钟，不重复告警",
          object: "東崋雲计算有限公司",
          type: "默认云数据库-Redis-其他版本",
          YS: "3/3",
          yiqiying: 3,
          shilishu: 3,
          lastChange: {
            id: "100011921910",
            data: "2019/12/31 13:21:32"
          },
          lastEditUin: 100011921910,
          changeData: "2019/12/31 13:52:55",
          qudao: "",
          zanting: true
        },
        {
          grounpId: 3290043,
          groupName: "默认",
          isOpen: true,
          chufa1: {
            tiaojian: "我是条件",
            zhiling: "我是指令",
            shijian: "我是事件"
          },
          chufa: "容量使用率>80%,持续5分钟",
          object: "東崋雲计算有限公司",
          type: "默认云数据库",
          YS: "0/0",
          yiqiying: 3,
          shilishu: 3,
          lastChange: {
            id: "100011921910",
            data: "2019/12/31 13:21:32"
          },
          lastEditUin: 100011921910,
          changeData: "2019/12/31 13:21:32",
          qudao: "",
          zanting: true
        },
        {
          grounpId: 3290043,
          groupName: "默认",
          isOpen: true,
          chufa1: {
            tiaojian: "我是条件",
            zhiling: "我是指令",
            shijian: "我是事件"
          },
          chufa: "容量使用率>80%",
          object: "東崋雲计算有限公司",
          type: "東崋雲云数据库",
          YS: "15/15",
          yiqiying: 3,
          shilishu: 3,
          lastChange: {
            id: "100011921910",
            data: "2019/12/31 13:21:32"
          },
          lastEditUin: 100011921910,
          changeData: "2019/12/31 7:16:46",
          qudao: "",
          zanting: true
        }
      ], //表格数据
      //分页
      TotalCount: 0, //总条数
      pagesize: 10, // 分页条数
      currpage: 1, // 当前页码
      operationFlag: -1, //按钮禁用开关
      dataListLoading: false,
      dialogVisible: false, //设置弹出框
      value: true,
      defaultIconFlag: false //鼠标事件
    };
  },
  components: {
    Header,
    Dialog
  },
  methods: {
    handleCheckAllChange(val) {
      this.checkedCities = val ? cityOptions : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.cities.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.cities.length;
    },
    onSubmit() {
      console.log("submit!");
    },
    //分页
    handleCurrentChange(val) {
      this.currpage = val;
    },
    //设置弹框
    buyMessgae() {
      // alert("11")
      this.dialogVisible = true;
    },
    //取消设置弹框
    cancel() {
      this.dialogVisible = false;
    },
    //确定设置弹框
    save() {
      this.dialogVisible = false;
    },
    defaultClick(id) {
      //点击默认按钮
      console.log(id, "id");
      //这里是写死的:id动态路由，写数据的时候改成动态的id
      this.$router.push({path: "/strategy/create:"+id});
      // this.$router.push({
      //   path: "/strategy/create:"+"id", // 新增告警策略默认点击按钮（详情），写死了，到时候可动态访问
      //   name: "strategy",
      //   component: () =>
      //     import(
      //       /* webpackChunkName: "strategy" */ "./components/defaultDetail.vue"
      //     ),
      //   meta: {
      //     keepAlive: true
      //   }
      // });
    },
    //思路：便利你所有的数据，给每条都加上defaultIconFlag：false属性，当你划过的时候就可以改成true
    mouseoverDefault() {
      //鼠标划入事件
      this.defaultIconFlag = true;
    },
    mouseoutDefault() {
      //鼠标移除事件
      this.defaultIconFlag = false;
    },
    addCreate() {
      // alert('/strategy/create');
      this.$router.push({ path: "/strategy/create" });
    }
  }
};
</script>

<style lang="scss" scoped>
.strategy-wrap >>> .el-button,
.strategy-wrap >>> .el-input__inner {
  height: 30px;
  border-radius: 0;
  padding-top: 0;
  line-height: 30px;
  font-size: 12px;
}
.strategy-wrap >>> .el-button:nth-child(0) {
  background: #006eff;
  width: 66px;
  height: 30px;
}
.strategy-wrap >>> .clearBtn > span:hover {
  border-bottom: 1px solid #006eff;
}

.strategy-wrap >>> .el-form-item__label {
  font-size: 12px;
  color: #888;
  font-weight: 200;
}

.strategy-wrap >>> .el-table .cell {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}
p.qudaoInfo {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}
a {
  color: #006eff;
  cursor: pointer;
}
a:hover {
  border-bottom: 1px solid #006eff;
}
.cursor {
  cursor: pointer;
}
.strategy-wrap >>> .cloneBtn > span:hover {
  border-bottom: 1px solid #006eff;
}
.strategy-wrap >>> .deleteBtn > span {
  color: #666;
}

.strategy-wrap {
  border-radius: 0;
  .strategy-filter {
    width: 100%;
    height: 100px;
  }
  .table {
    padding: 0 20px 20px 20px;

    .addBtn {
      width: 100%;
      height: 55px;
      padding: 20px 10px 0 10px;
      background: rgb(255, 255, 255);
      display: flex;
      justify-content: space-between;
      .iconBtn {
        font-size: 16px;
        color: #888;
        display: flex;
        align-items: center;
        > i {
          margin: 0 10px;
          font-weight: 600;
        }
        i:hover {
          cursor: pointer;
        }
      }
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
  }

  .overview-main {
    padding: 20px;
    box-sizing: border-box;

    .progress {
      padding: 10px 0;
      box-sizing: border-box;

      p {
        margin-bottom: 10px;
        font-weight: bold;

        span {
          float: right;
        }
      }
    }

    .main-box {
      display: flex;
    }

    .left {
      flex: 1;
      margin-right: 20px;
    }
    .right {
      width: 30%;
    }
    .head {
      display: flex;
      align-items: center;

      h3 {
        margin-right: 20px;
      }
    }
    .box {
      border: 1px solid #ddd;
      background-color: #fff;
      box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
      padding: 20px;
      box-sizing: border-box;
      margin-top: 20px;
    }

    .explain {
      padding: 10px 30px 10px 20px;
      vertical-align: middle;
      color: #003b80;
      border: 1px solid #97c7ff;
      background: #e5f0ff;

      p {
        font-size: 11px;
        line-height: 18px;
      }
    }
  }
}
</style>
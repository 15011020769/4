<template>
  <div class="strategy-wrap">
    <Header title="告警策略" class="flex-direction: column;">
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
            <el-select v-model="formInline.product_value" style="width:100px;">
              <el-option
                v-for="(item,index) in formInline.product_kind"
                :key="index"
                :label="item.name"
                :value="item.value"
                label-width="40px"
              ></el-option>
            </el-select>
            <el-select v-model="formInline.strategy_value" style="width:250px;margin-left:10px;">
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
          <el-button type="primary">新增</el-button>
          <el-button :disable="operationFlag==-1?true:false">删除</el-button>
          <el-button :disable="operationFlag==-1?true:false">修改告警渠道</el-button>
        </el-row>
        <el-row class="iconBtn">
          <i class="el-icon-setting"></i>
          <i class="el-icon-refresh"></i>
          <i class="el-icon-download"></i>
        </el-row>
      </p>
      <el-table
        :data="tableData"
        style="width: 100%"
        height="450"
        :default-sort="{prop: 'changeData', order: 'descending'}"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="groupName" label="策略名称"></el-table-column>
        <el-table-column prop="chufa" label="触发条件"></el-table-column>
        <el-table-column prop="object" label="所属项目"></el-table-column>
        <el-table-column prop="type" label="策略类型"></el-table-column>
        <el-table-column prop="YS" label="已启用/实例数"></el-table-column>
        <el-table-column prop="address" sortable label="最后修改"></el-table-column>
        <el-table-column prop="qudao" label="告警渠道"></el-table-column>
        <el-table-column prop="address" label="告警启停"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" class="cloneBtn">复制</el-button>
            <el-button type="text" class="deleteBtn">删除</el-button>
            <!-- <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button> -->
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
  </div>
</template>
<script>
import Header from "./components/Head";
export default {
  name: "strategy",
  data() {
    return {
      formInline: {
        product_kind: [
          {
            value: 0,
            name: "产品类型"
          },
          {
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
        user: "", //用户
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
          chufa: "容量使用率>80%,持续5分钟，不重复告警",
          object: "東崋雲计算有限公司",
          type: "默认云数据库-Redis-其他版本",
          YS: "3/3",
          yiqiying: 3,
          shilishu: 3,
          lastEditUin: 100011921910,
          changeData: "2019/12/31 13:52:55",
          qudao: "",
          zanting: true
        },
        {
          grounpId: 3290043,
          groupName: "默认",
          isOpen: true,
          chufa: "容量使用率>80%,持续5分钟",
          object: "東崋雲计算有限公司",
          type: "默认云数据库",
          YS: "0/0",
          yiqiying: 3,
          shilishu: 3,
          lastEditUin: 100011921910,
          changeData: "2019/12/31 13:21:32",
          qudao: "",
          zanting: true
        },
        {
          grounpId: 3290043,
          groupName: "默认",
          isOpen: true,
          chufa: "容量使用率>80%",
          object: "東崋雲计算有限公司",
          type: "東崋雲云数据库",
          YS: "15/15",
          yiqiying: 3,
          shilishu: 3,
          lastEditUin: 100011921910,
          changeData: "2019/12/31 7:16:46",
          qudao: "",
          zanting: true
        },
        {
          grounpId: 3290043,
          groupName: "默认",
          isOpen: true,
          chufa: "容量使用率>80%,持续5分钟，不重复告警",
          object: "東崋雲计算有限公司",
          type: "默认云数据库-Redis-其他版本",
          YS: "3/3",
          yiqiying: 3,
          shilishu: 3,
          lastEditUin: 100011921910,
          changeData: "2019/12/31 13:52:55",
          qudao: "",
          zanting: true
        },
        {
          grounpId: 3290043,
          groupName: "默认",
          isOpen: true,
          chufa: "容量使用率>80%,持续5分钟",
          object: "東崋雲计算有限公司",
          type: "默认云数据库",
          YS: "0/0",
          yiqiying: 3,
          shilishu: 3,
          lastEditUin: 100011921910,
          changeData: "2019/12/31 13:21:32",
          qudao: "",
          zanting: true
        },
        {
          grounpId: 3290043,
          groupName: "默认",
          isOpen: true,
          chufa: "容量使用率>80%",
          object: "東崋雲计算有限公司",
          type: "東崋雲云数据库",
          YS: "15/15",
          yiqiying: 3,
          shilishu: 3,
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
      operationFlag: -1 //按钮禁用开关
    };
  },
  components: {
    Header
  },
  methods: {
    onSubmit() {
      console.log("submit!");
    },
    //分页
    handleCurrentChange(val) {
      this.currpage = val;
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
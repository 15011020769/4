<template>
  <div class="Template-wrap">
    <Header title="觸發條件模板" />
    <div class="overview-main">
      <div class="explain">
        <p>
          触发条件模板功能支持对相同告警规则的复用和统一修改，点击查看
          <a>触发条件模板文档</a>
        </p>
      </div>
    </div>
    <div class="table">
      <div class="addBtn">
        <el-row>
          <el-button type="primary">新建</el-button>
        </el-row>
        <el-row class="seek">
            <el-input v-model="triggerInput" placeholder="请输入触发条件模板名搜索"></el-input>
            <el-button icon="el-icon-search" style="margin-left:-1px;"></el-button>
          </el-row>
      </div>
      
      <el-table
        :data="tableData"
        style="width: 100%"
        height="450"
        :default-sort="{prop: 'changeData', order: 'descending'}"
      >
        <el-table-column prop="groupName" label="模板名称"></el-table-column>
        <el-table-column prop="chufa" label="触发条件"></el-table-column>
        <el-table-column prop="type" label="策略类型"></el-table-column>
        <el-table-column prop="YS" label="备注"></el-table-column>
        <el-table-column prop="address" sortable label="绑定告警策略数"></el-table-column>
        <el-table-column prop="qudao" label="最后修改"></el-table-column>
        <el-table-column label="操作">
          <template :slot-scope="$scope.row">
            <el-button type="text" class="cloneBtn">复制</el-button>
            <el-button type="text" class="deleteBtn">删除</el-button>
            <!-- <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>-->
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
import Header from "@/components/public/Head";

export default {
  name: "Template",
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
        Template_kind: [
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
        Template_name: "", //策略名称
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
        Template_value: "" //策略
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
      operationFlag: -1, //按钮禁用开关
      searchName:"",
      triggerInput:"",//触发条件模板名
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
.Template-wrap >>> .el-button,
.Template-wrap >>> .el-input__inner {
  height: 30px;
  border-radius: 0;
  padding-top: 0;
  line-height: 30px;
  font-size: 12px;
}
.Template-wrap >>> .el-button:nth-child(0) {
  background: #006eff;
  width: 66px;
  height: 30px;
}
.Template-wrap >>> .clearBtn > span:hover {
  border-bottom: 1px solid #006eff;
}

.Template-wrap >>> .el-form-item__label {
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
.Template-wrap >>> .cloneBtn > span:hover {
  border-bottom: 1px solid #006eff;
}
.Template-wrap >>> .deleteBtn > span {
  color: #666;
}
.Template-wrap {
  border-radius: 0;
  .Template-filter {
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
      .seek{
        width: 240px;
        display: flex;

      }
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
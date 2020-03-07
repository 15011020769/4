<template>
  <div class="wrap">
    <el-dialog
      :visible.sync="newBuildShow.newBuildState"
      width="1024px"
      :show-close="false"
      class="dialog-box"
    >
      <div class="title">
        <h3>新建</h3>
        <a href="javascript:;" @click="cancel()">
          <i class="el-icon-close"></i>
        </a>
      </div>
      <div class="dialog">
        <div class="p">
          <span>分组名</span>
          <el-input
            v-model="input"
            placeholder="1-20个中英文字符或下划线"
            class="group-input"
          ></el-input>
        </div>
        <div class="p">
          <span>分组类型</span>
          <grouping-type @handleChangeChild="showMsgfromChild"></grouping-type>
        </div>
        <div class="p">
          <span>添加至组</span>
          <div class="main" style="background:white;">
            <div class="left">
              <div class="left-main border">
                <div class="seek" style="">
                  <el-input
                    v-model="input"
                    placeholder="请输入内容"
                    style=""
                  ></el-input>
                  <p>
                    <i class="el-icon-search"></i>
                  </p>
                </div>
                <el-table
                  :data="tableData"
                  style=""
                  height="420"
                  @selection-change="handleSelectionChange"
                >
                  <el-table-column
                    type="selection"
                    width="55"
                  ></el-table-column>
                  <el-table-column
                    prop="PolicyName"
                    label="ID/主机名"
                    width="80"
                  ></el-table-column>
                  <el-table-column
                    prop="Type"
                    label="网络类型"
                    width="120"
                  ></el-table-column>
                  <el-table-column
                    prop="PolicyName"
                    label="IP地址"
                    width="120"
                  ></el-table-column>
                </el-table>
              </div>
            </div>
            <div class="mid">
              <i class="el-icon-connection"></i>
            </div>
            <div class="right">
              <div class="right-main border">
                <el-table :data="multipleSelection" style="" height="450">
                  <el-table-column
                    prop="PolicyName"
                    label="策略名"
                    width="80"
                  ></el-table-column>
                  <el-table-column prop="Type" label="策略类型" width="150">
                    <template slot-scope="scope">
                      <p>{{ type[scope.row.Type] }}</p>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="PolicyName"
                    label="IP地址"
                    width="150"
                  ></el-table-column>
                </el-table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p slot="footer" class="dialog-footer" style="text-align:center">
        <el-button type="primary" @click="save">保 存</el-button>
        <el-button @click="cancel">取 消</el-button>
      </p>
    </el-dialog>
  </div>
</template>

<script>
import GroupingType from "@/components/GroupingType";
export default {
  name: "msg",
  data() {
    return {
      tableData: [],
      multipleSelection: [],
      input: "",
      options: [
        {
          value: "zhinan",
          label: "指南",
          children: [
            {
              value: "shejiyuanze",
              label: "设计原则",
              children: [
                {
                  value: "yizhi",
                  label: "一致"
                },
                {
                  value: "fankui",
                  label: "反馈"
                },
                {
                  value: "xiaolv",
                  label: "效率"
                },
                {
                  value: "kekong",
                  label: "可控"
                }
              ]
            },
            {
              value: "daohang",
              label: "导航",
              children: [
                {
                  value: "cexiangdaohang",
                  label: "侧向导航"
                },
                {
                  value: "dingbudaohang",
                  label: "顶部导航"
                }
              ]
            }
          ]
        }
      ]
    };
  },
  components: {
    GroupingType
  },
  props: {
    newBuildShow: {
      type: Object,
      default: () => []
    }
  },
  methods: {
    cancel() {
      this.$emit("close", false);
    },
    save() {},
    handleSelectionChange(val) {
      this.$emit("_multipleSelection", val);
    },
    //类型
    msgBtn(index) {
      this.liIndex = index;
    },
    // 新建
    showMsgfromChild(val) {
      console.log("val", val);
    }
  }
};
</script>

<style lang="scss" scoped>
.wrap >>> .el-button,
.wrap >>> .el-input__inner {
  height: 30px;
  border-radius: 0;
  padding-top: 0;
  line-height: 30px;
  font-size: 12px;
}
.wrap >>> .el-dialog__body {
  padding: 0 20px;
}
.wrap {
  .dialog {
    .p {
      display: flex;
      margin-bottom: 16px;

      span {
        width: 68px;
        line-height: 30px;
      }
      .group-input {
        width: 300px;
        ::v-deep .el-input__inner {
          border-radius: 0px;
          width: 300px;
          height: 30px;
        }
      }
    }
  }
}

.dialog-footer {
  text-align: center;
}
.dialog-box {
  ::v-deep .el-dialog__header {
    padding: 0px;
  }
}
.wrap >>> .el-dropdown {
  font-size: 12px;
}
.wrap >>> .el-input__inner {
  height: 30px;
  border-radius: 0;
  padding-top: 0;
  line-height: 30px;
  font-size: 12px;
}
.wrap {
  .title {
    height: 26px;
    line-height: 26px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    & > h3 {
      color: #000;
      font-size: 14px;
      font-weight: 700;
    }
    & > a {
      display: inline-block;
      height: 26px;
      width: 26px;
      text-align: center;
      line-height: 26px;
      &:hover {
        background-color: rgba(0, 0, 0, 0.05);
      }
      & > i {
        color: #888;
        font-size: 18px;
        line-height: 26px;
      }
    }
  }
  .main {
    display: flex;
    overflow: hidden;

    .border {
      border: 1px #f2f2f2 solid;
    }
    .left {
      // flex: 1;

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
    // .right {
    //   flex: 1;
    // }
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
</style>

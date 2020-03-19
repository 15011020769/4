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
          <el-tooltip
            :disabled="groupingNameTips"
            placement="bottom"
            effect="light"
          >
            <div slot="content" class="group-name">
              <i class="el-icon-info ml5"></i>
              {{ nameTips }}
            </div>
            <el-input
              v-model="groupingName"
              placeholder="1-20个中英文字符或下划线"
              class="group-input"
              @input="GroupingNameInput"
              maxlength="20"
            ></el-input>
          </el-tooltip>
        </div>
        <div class="p">
          <span>分组类型</span>
          <product-type-cpt
            v-on:PassData="passData"
            :searchParam="searchParam"
            :projectId="projectId"
            :productValue="productValue"
          />
        </div>
        <div class="p">
          <span>添加至组</span>
          <CamTransferCpt
            :productData="productListData"
            v-on:projectId="projectIds"
            v-on:searchParam="searchParams"
          ></CamTransferCpt>
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
// import GroupingType from "@/components/GroupingType";
import ProductTypeCpt from "@/views/CM/CM_assembly/product_type";
import { ErrorTips } from "@/components/ErrorTips";
import CamTransferCpt from "@/views/CM/CM_assembly/CamTransferCpt";
import { CM_GROUPING_NEWLY_BUILD } from "@/constants";
export default {
  name: "msg",
  data() {
    return {
      groupingName: "",
      groupingNameTips: true,
      nameTips: "分组名称不能为空",
      groupingType: ["云服务器", "cvm_device"],
      loadSign: true,
      pageSize: 20, // 分页条数
      pageIndex: 0, // 当前页码
      productListData: {},
      projectId: "",
      searchParam: {},
      productData: {},
      isShow: false,
      productValue: "cvm_device"
    };
  },
  components: {
    // GroupingType,
    CamTransferCpt,
    ProductTypeCpt
  },
  props: {
    newBuildShow: {
      type: Object,
      default: () => []
    }
  },
  watch: {
    productData: {
      hander(val) {
        this.productListData = val;
      },
      deep: true
    }
  },
  mounted() {},
  methods: {
    cancel() {
      this.$emit("close", false);
    },
    passData(data) {
      this.isShow = false;
      this.productListData = data;
      setTimeout(() => {
        this.productListData = {};
        // this.isShow = true;
      }, 500);
      setTimeout(() => {
        this.productListData = data;
        // this.isShow = true;
      }, 600);
    },
    projectIds(data) {
      this.projectId = data;
    },
    searchParams(data) {
      this.searchParam = data;
    },
    // 分组名
    GroupingNameInput() {
      if (this.groupingName === "") {
        this.nameTips = "分组名称不能为空";
        this.groupingNameTips = false;
      } else if (this.groupingName.length == 20) {
        this.nameTips = "分组名称不能超过 20 字";
        this.groupingNameTips = false;
      } else {
        this.groupingNameTips = true;
      }
    },
    // 保存
    save() {
      if (!this.groupingNameTips) {
        return false;
      }
      var _ViewName = "";
      if (this.groupingType.length > 0) {
        _ViewName = this.groupingType[this.groupingType.length - 1];
      }
      let param = {
        GroupName: this.groupingName,
        Version: "2018-07-24",
        Module: "monitor",
        ViewName: _ViewName
      };
      console.log(this.multipleSelection);
      for (let i in this.multipleSelection) {
        param["InstanceList." + i + ".Region"] = "ap-taipei";
        // param["InstanceList." + i + ".Dimensions"] = JSON.stringify({
        //   unInstanceId: this.multipleSelection[i].InstanceId
        // });
        // param["InstanceList." + i + ".EventDimensions"] = JSON.stringify({
        //   uuid: this.multipleSelection[i].Uuid
        // });
        param["InstanceList." + i + ".Dimensions"] = {
          unInstanceId: this.multipleSelection[i].InstanceId
        };
        param["InstanceList." + i + ".EventDimensions"] = {
          uuid: this.multipleSelection[i].Uuid
        };
      }
      this.axios.post(CM_GROUPING_NEWLY_BUILD, param).then(res => {
        if (res.Response.Error === undefined) {
          console.log(res);
        } else {
          let ErrTips = {
            FailedOperation: "操作失败。",
            InternalError: "内部错误。",
            "InternalError.ExeTimeout": "执行超时。",
            InvalidParameter: "参数错误。",
            "InvalidParameter.InvalidParameter": "参数错误。",
            "InvalidParameter.InvalidParameterParam": "参数错误。",
            InvalidParameterValue: "无效的参数值。",
            LimitExceeded: "超过配额限制。",
            MissingParameter: "缺少参数错误。",
            UnknownParameter: "未知参数错误。",
            UnsupportedOperation: "操作不支持。"
          };
          let ErrOr = Object.assign(ErrorTips, ErrTips);
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 0
          });
        }
      });
    },
    //类型
    msgBtn(index) {
      this.liIndex = index;
    },
    // 分组类型
    showMsgfromChild(val) {
      this.groupingType = val;
      console.log(this.groupingType);
    },
    loadMore() {
      if (this.loadSign) {
        this.loadSign = false;
        this.pageIndex++;
      }
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
}
.group-name {
  color: red;
}
.table-left {
  p {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    font-size: 12px;
    a {
      color: #006eff;
      &:hover {
        text-decoration: underline;
      }
    }
  }
  .out {
    color: #888;
  }
}
.resses {
  display: flex;
  align-items: center;
  i {
    margin-left: 10px;
    cursor: pointer;
  }
}
</style>

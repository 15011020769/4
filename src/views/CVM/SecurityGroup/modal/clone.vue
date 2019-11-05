<template>
  <div class="clone">
    <el-dialog :visible.sync="cloneShow.cloneState" width="38.55%" :show-close="false">
      <div class="title">
        <h3>克隆安全组</h3>
        <a href="javascript:;" @click="cancel()">
          <i class="el-icon-close"></i>
        </a>
      </div>
      <div class="body">
        <p>克隆过程，只将原安全组出入口规则克隆，云主机需另行关联。</p>
        <ul>
          <li>
            <span>目标项目</span>
            <div>
              <el-select
                v-model="projectId"
                @change="changeProjectId"
                placeholder="全部项目"
                size="small"
              >
                <el-option
                  v-for="item in projectList"
                  :key="item.projectId"
                  :label="item.projectName"
                  :value="item.projectId"
                ></el-option>
              </el-select>
            </div>
          </li>
          <li>
            <span>目标地域</span>
            <div>
              <el-select v-model="value" placeholder="请选择" size="small">
                <el-option
                  v-for="item in CityArr"
                  :key="item.regionCode"
                  :label="item.lable"
                  :value="item.Region"
                ></el-option>
              </el-select>
            </div>
          </li>
          <li>
            <span>原名称</span>
            <div>{{oldName}}</div>
          </li>
          <li>
            <span>新名称</span>
            <el-input v-model="newName"></el-input>
          </li>
        </ul>
      </div>
      <div class="footer">
        <el-button type="primary" @click="CloneSure()">确 定</el-button>
        <el-button @click="cancel()">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import CitySelect from "@/components/Tools/RegionSelect";
export default {
  data() {
    return {
      projectList: JSON.parse(localStorage.getItem("projectList")), // 项目列表
      projectId: "", // 点击下拉框获取的项目id
      oldName: "",
      newName: "",
      project: {
        // 项目
        "0": "默认项目",
        "1135407": "丙晟3期",
        "1135416": "丙晟4期",
        "1135781": "a1234a1234a1234a1234a1234a1234a1234a1234a1234a1234",
        "1135946": "df",
        "1136120": "g",
        "1143813": "Project234567890123456789234567892345678",
        "1143814": "Project001Project001Project001Project001Project001",
        "1152689": "12345678"
      },
      CityArr: [],
      value: this.$cookie.get("regionv2")
    };
  },
  props: {
    cloneShow: {
      type: Object,
      default: () => []
    }
  },
  components: {
    CitySelect
  },
  created() {
    this.oldName = this.cloneShow.cloneStateId.SecurityGroupName;
    for (let i in this.project) {
      if (this.cloneShow.cloneStateId.ProjectId === i) {
        this.projectId = this.project[i];
      }
    }
    this.axios.post("pub/zoneAll?product=FWQ").then(data => {
      this.CityArr = data.data;
      console.log(this.CityArr);
    });
  },
  methods: {
    CloneSure() {
      let params = {
        projectId: this.projectId,
        sgName: this.newName,
        srcRegion: this.$cookie.get("regionv1"),
        aimRegion: this.value,
        sgId: this.cloneShow.cloneStateId.SecurityGroupId
      };
      if (this.newName === "") {
        this.$message({
          message: "新名称不能为空",
          type: "error"
        });
        return;
      }
      this.axios
        .post("redesc/cloneSecurityGroup", params)
        .then(data => {
          if (data.stat === 0) {
            this.$message({
              message: "克隆成功",
              type: "success"
            });
            this.$emit("getDataList");
          } else {
            this.$message({
              message: data.info,
              type: "erroe"
            });
          }
          this.cancel();
        })
        .catch(error => {
          console.log(error);
        });
    },
    cancel() {
      this.$emit("close", false);
    },
    // 更换项目事件
    changeProjectId() {}
  }
};
</script>
<style lang="scss" scoped>
.clone {
  ::v-deep .el-dialog__header {
    padding: 0px;
  }
  ::v-deep .el-dialog__body {
    padding: 0px;
  }
  ::v-deep .el-dialog__footer {
    padding: 0px;
  }
  ::v-deep .el-dialog {
    padding: 20px;
  }
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
  .body {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    & > p {
      width: 100%;
      font-size: 12px;
      padding: 5px 10px;
      line-height: 22px;
      padding: 5px 10px;
      background: #d2e7f7;
      color: #264663;
      border: 1px solid #5d9fd6;
      margin-bottom: 20px;
    }
    & > ul {
      width: 100%;
      li {
        margin-bottom: 16px;
        display: flex;
        justify-content: flex-start;
        & > span {
          font-size: 12px;
          display: inline-block;
          width: 68px;
          color: #888;
        }
      }
    }
    ::v-deep .el-select .el-input {
      width: 280px;
    }
    ::v-deep .el-input--small .el-input__inner {
      border-radius: 0px;
    }
    ::v-deep .el-input {
      width: 280px;
    }
    ::v-deep .el-input__inner {
      width: 280px;
      height: 30px;
      border-radius: 0px;
    }
  }
  .footer {
    display: flex;
    justify-content: center;
    margin-top: 27px;
    /* 确定--取消按钮 */
    .el-button {
      width: 66px !important;
      padding: 0px;
      height: 30px;
      border-radius: 0px;
    }
    .el-button--primary {
      background: #006eff;
      border-color: #006eff !important;
    }
  }
}
</style>


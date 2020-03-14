<template>
  <div class="qudaoContent">
    <p class="receiving-objects">
      <span>接收对象&nbsp;&nbsp;</span>
      <el-select v-model="formInline.jieshou" style="width:100px;" @change='selectChange'>
        <el-option v-for="(item, index) in formInline.jieshouArr" :key="index" :label="item.name" :value="item.value" label-width="40px"></el-option>
      </el-select>
      <el-row class="seek" style="display:flex;margin:0 10px;">
        <el-input v-model="triggerInput" placeholder></el-input>
        <el-button icon="el-icon-search" style="margin-left:-1px;margin-top:1px;"></el-button>
      </el-row>
      <a href="">新增接收组</a>
    </p>
    <div>
      <el-table :data="tableData2" style="width: 100%" height="430" :default-sort="{ prop: 'changeData', order: 'descending' }">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="GroupName" label="用户组名"></el-table-column>
        <el-table-column prop="userDetail" label="用户名">
          <!-- <template slot-scope="scope">
            <span>{{ scope.row.userDetail }}</span>
          </template> -->
        </el-table-column>
      </el-table>
    </div>

    <p class="effective-period">
      <span>有效时段&nbsp;&nbsp;</span>
      <el-time-picker style="width:150px" v-model="value1" :picker-options="{selectableRange: '18:30:00 - 20:30:00'}" placeholder="任意时间点">
      </el-time-picker>
      <span>&nbsp;至&nbsp;</span>
      <el-time-picker style="width:150px" arrow-control v-model="value2" :picker-options="{selectableRange: '18:30:00 - 20:30:00'}" placeholder="任意时间点">
      </el-time-picker>
    </p>
    <p style="display:flex">
      <span>接收渠道&nbsp;&nbsp;</span>
      <el-checkbox-group v-model="qudaoCheckList">
        <el-checkbox label="邮件"></el-checkbox>
        <el-checkbox label="短信"></el-checkbox>
      </el-checkbox-group>
    </p>
  </div>
</template>

<script>
import {
  USER_GROUP,
  GET_GROUP,
} from "@/constants";
export default {
  data() {
    return {
      triggerInput: "",
      value1: '',
      value2: '',
      tableData: [],
      tableData2: [],
      qudaoCheckList: ["邮件", "短信"], //渠道选择
      formInline: {
        jieshou: "接收组",
        jieshouArr: [{
          value: "0",
          name: "接收组"
        }, {
          value: "1",
          name: "接收人"
        }]
      }
    };
  },
  mounted() {
    this.userGroup()  // 查询用户组
  },
  methods: {
    selectChange() {

    },

    // 查询用户组
    userGroup() {
      let params = {
        Version: "2019-01-16",
        Page: 1,
        Rp: 1000
      };
      // if (this.searchValue != null && this.searchValue != "") {
      //   params["Keyword"] = this.searchValue;
      // }
      this.axios
        .post(USER_GROUP, params)
        .then(res => {
          if (res.Response.Error === undefined) {
            this.tableData = res.Response.GroupInfo;
            for (let i = 0; i < this.tableData.length; i++) {
              this.userGroupDetail(this.tableData[i].GroupId)
            }
          } else {
            let ErrTips = {};
            let ErrOr = Object.assign(ErrorTips, ErrTips);
            this.$message({
              message: ErrOr[res.Response.Error.Code],
              type: "error",
              showClose: true,
              duration: 0
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    // 查询用户组详情
    userGroupDetail(GroupId) {
      let params = {
        Version: "2019-01-16"
      };
      let groupId = GroupId;
      if (groupId != "" && groupId != null) {
        params["GroupId"] = groupId;
      }
      this.axios
        .post(GET_GROUP, params)
        .then(res => {
          if (res.Response.Error === undefined) {

            this.groupData = res.Response;

            for (let i = 0; i < this.tableData.length; i++) {
              if (this.tableData[i].GroupId === this.groupData.GroupId) {
                let userDetail = ''
                for (let n = 0; n < this.groupData.UserInfo.length; n++) {
                  userDetail = userDetail + this.groupData.UserInfo[n].Name + '、'
                }
                if(userDetail === ''){
                  userDetail = '-'
                }
                this.tableData[i].userDetail = userDetail
              }
              if(i === this.tableData.length-1){
                this.tableData2 = this.tableData
                console.log(this.tableData2)
              }
            }
            

          } else {
            let ErrTips = {
              "ResourceNotFound.UserNotExist": "用戶不存在"
            };
            let ErrOr = Object.assign(ErrorTips, ErrTips);
            this.$message({
              message: ErrOr[res.Response.Error.Code],
              type: "error",
              showClose: true,
              duration: 0
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.qudaoContent {
  width: 94%;
  .receiving-objects {
    a {
      line-height: 30px;
    }
  }
  > div {
    margin: 10px 0;
    padding: 10px 20px;
    line-height: 30px;
    .content {
      margin-top: 10px;
      padding: 10px;
    }
  }
  ::v-deep .el-icon-time {
    line-height: 30px;
  }
}
.qudaoContent {
  padding: 10px;
  .receiving-objects {
    display: flex;
    align-items: center;
  }
}
</style>



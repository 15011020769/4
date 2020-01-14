<template>
  <div class="wrap">
    <div class="head">
      <Headcom :title="$t('CAM.userList.userAddGroup')" :backShow="true"  @_back="back" />
    </div>
    <div class="policyToUser">
      <div class="step">
        <el-steps
          :active="active"
          direction="vertical"
          simple
          :space="200"
          style="margin-right: 50%"
        >
          <el-step :title="$t('CAM.userList.setGroup')"></el-step>
          <el-step :title="$t('CAM.userList.reviewUserGroup')"></el-step>
        </el-steps>
      </div>
      <div v-show="active==1" class="table">
        <div class="container" >
        <div class="container-right">
          <span>{{$t('CAM.userList.listTitle')}}</span>
          <div style="margin-top:10px;">
            <el-input
              v-model="searchGroupValue"
              :placeholder="$t('CAM.userList.search')"
              size="small"
              class="inputSearchCl"
              @keyup.enter.native="searchGroup"
            >
              <i slot="suffix" class="el-input__icon el-icon-search" @click="searchGroup"></i>
            </el-input>
          </div>

          <el-table
            v-model="searchGroupValue"
            ref="multipleOption"
            tooltip-effect="dark"
            height="400"
            style="width: 80%; border:1px solid #ddd;"
            @row-click="selectedRow"
            @selection-change="handleSelection"
            :data="userGroup"
            v-loading='loading'
          >
            <el-input size="mini" style="width:20%" />
            <el-button size="mini" class="suo" icon="el-icon-search" show-overflow-tooltip></el-button>
            <el-table-column type="selection" :selectable="checkboxT"></el-table-column>
            <el-table-column :label="$t('CAM.userList.userGroup')" prop="GroupName"></el-table-column>
          </el-table>
        </div>

        <div class="container-left">
          <span>{{$t('CAM.userList.choose')}}</span>
          <el-table
            ref="multipleSelected"
            tooltip-effect="dark"
            height="400"
            style="width: 80%;border:1px solid #ddd;margin-top:10px;"
            :data="userGroupSelect"
          >
            <el-table-column :label="$t('CAM.userList.userGroup')"  prop="GroupName"></el-table-column>
            <el-table-column :label="$t('CAM.userList.userCz')" show-overflow-tooltip>
              &lt;!&ndash;
              <template slot-scope="scope">
                <el-button
                  @click.native.prevent="deleteRow(scope.$index,userGroupSelect)"
                  type="text"
                  size="small"
                >{{$t('CAM.userList.userRemove')}}</el-button>
              </template>&ndash;&gt;
            </el-table-column>
          </el-table>
        </div>
      </div>
      </div>
      <div v-show="active==2">
        <el-table style="width: 96%; margin: 0 auto;" :data="userNewGroup[0]">
          <el-table-column :label="$t('CAM.userList.userGroup')" prop="GroupName"></el-table-column>
           <el-table-column
      fixed="right"
     :label="$t('CAM.userList.userCz')">
      <template slot-scope="scope">
        <el-button
          @click.native.prevent="deleteRow(scope.$index, userNewGroup[0])"
          type="text"
          size="small">
          {{$t('CAM.userList.userRemove')}}
        </el-button>
      </template>
    </el-table-column>
  </el-table>
        </el-table>
      </div>
      <div class="button">
        <el-button
          style="margin-top:70px;"
          type="primary"
          size="medium"
          @click="prev()"
          v-if="active==2"
        >上一步</el-button>
        <el-button
          style="margin-top:70px;"
          type="primary"
          size="medium"
          @click="next()"
          v-if="active==0 || active==1"
        >下一步</el-button>
        <el-button
          style="margin-top:70px;"
          type="primary"
          size="medium"
          @click="complete()"
          v-if="active==2"
        >完成</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { ErrorTips } from "@/components/ErrorTips";
import Headcom from "../components/Head";
import { USER_GROUP,ADD_USERTOGROUP,RELATE_USER } from "@/constants";
export default {
  components: {
    Headcom, //头部组件
  },
  data() {
    return {
      active: 1,
      searchGroupValue:"",
      userGroup:[],
      userGroupSelect: [],
      userNewGroup:[],
      groupArr:[],
      loading:true,
      userGroup1:[]
    };
  },
  methods: {
    checkboxT(row, index) {
      if (row.status == 1) {
        return false;
      } else {
        return true;
      }
    },
    userGroups() {
      this.loading = true;
      let params = {
        Version: "2019-01-16"
      };
      if (this.searchGroupValue != null && this.searchGroupValue != "") {
        params["Keyword"] = this.searchGroupValue;
      }
      this.axios.post(USER_GROUP, params).then(res => {
        this.userGroup1 = res.Response.GroupInfo;
        const param = {
        Version: "2019-01-16",
        Uid: this.$route.query.Uid
        };
        this.axios.post(RELATE_USER, param).then(res => {
          this.groupArr = res.Response.GroupInfo;
          this.userGroup1.forEach(item => {
            item.status = 0;
            this.groupArr.forEach(val => {
              if (val.GroupId == item.GroupId) {
                item.status = 1;
              }
            });
          });
          this.userGroup = this.userGroup1;
          this.loading = false;
        });
      });
    },
    searchGroup() {
      this.userGroups();
    },
    complete(){
       var addGroup = [];
       this.userNewGroup[0].forEach(item => {
          addGroup.push(item)
       })
       console.log(addGroup)
       addGroup.forEach(item => {
           this.addUserGroup(item.GroupId)
       })
       this.$router.go(-1)
    },
    addUserGroup(val){
      console.log(this.$route.query.Uid)
      let params = {
                Version: "2019-01-16",
                "Info.0.Uid": this.$route.query.Uid,
                "Info.0.GroupId":val
            };
            console.log(params)
             this.axios.post(ADD_USERTOGROUP, params).then(res => {
               if(res.Response.Error === undefined){
                    console.log(res)
               }else{
                     let ErrTips = {
                        "InvalidParameter.GroupNotExist":'用户组不存在',
                        "InvalidParameter.GroupUserFull":'用户组中的子用户数量达到上限',
                        "InvalidParameter.UserGroupFull":'子用户加入的用户组数量达到上限',
                        "ResourceNotFound.UserNotExist":'用户不存在'
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
    prev() {
      --this.active;
      if (this.active < 0) this.active = 0;
    },
    next() {
      if (this.active++ > 3) this.active = 0;
    },
    selectedRow(row, column, event) {
      // 设置选中或者取消状态
      this.$refs.multipleOption.toggleRowSelection(row);
    },
    deleteRow(index, rows) {
      // 获取右边框中取消的行数据，将此行数据在右边框中的选中状态取消
      this.$refs.multipleOption.toggleRowSelection(rows[index], false);
    },
    handleSelection(val) {
      // 给右边table框赋值，只需在此处赋值即可，selectedRow方法中不写，因为单独点击复选框，只有此方法有效。
      this.userGroupSelect = val;
      let newGroupData = []
      newGroupData.push(val)
      console.log(val)
      this.userNewGroup = newGroupData
    },
     deleteRow(index, rows) {
        rows.splice(index, 1);
      },
      back(){
      this.$router.go(-1)
    }
  },
  created(){
    this.userGroups()
  }
};
</script>
<style lang="scss" scoped>
.wrap >>> .el-form-item__label {
  text-align: left;
}
.wrap >>> .el-button,
.wrap >>> .el-input__inner {
  border-radius: 0;
  height: 30px !important;
  line-height: 30px;
  padding-top: 0;
  font-size: 12px;
}
.policyToUser {
  width: 85%;
  background: white;
  margin: 0 auto;
  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
  margin-top: 20px;
  flex-direction: column;
  padding: 20px;
  box-sizing: border-box;
  .step{
    width: 100%;
  }
  .table{
    flex: 1;
  }
  .button{
    width: 100%;
  }
 .container {
  display: flex;
  padding: 20px;
  box-sizing: border-box;
  .container-right {
    width: 70%;
    flex-direction: column;
    justify-content: center;
    margin-left: 100px;
    .inputSearchCl {
      width: 80%;
    }
  }
  .container-left {
    width: 70%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex-direction: column;
  }
}
}
.step >>> .el-steps {
  background: white;
  padding-bottom: 25px;
}
</style>
<template>
  <div class="Cam">
    <div class="top">
      <span class="title-left">{{$t('CAM.CAM.userGroup.title')}}</span>
      <!-- <span class="title-right">
        <span>CAM用户组使用说明<i class="el-icon-share"></i></span>
      </span> -->
    </div>
    <div class="cam_button">
      <el-row class="cam-lt">
        <el-button type="primary"  @click="NewUser" >{{$t('CAM.CAM.userGroup.createBtn')}}</el-button>
        <el-button type="primary" @click="addUserGroup()" >{{$t('CAM.CAM.userGroup.addBtn')}}</el-button>
      </el-row>

      <div class="head-container">
        <!-- 搜索 -->
        <el-input v-model="searchValue" clearable :placeholder="$t('CAM.CAM.userGroup.placeholder')" style="width: 300px;"  @keyup.enter.native="toQuery"/>
        <el-button class="suo" icon="el-icon-search"  show-overflow-tooltip @click="toQuery"></el-button>
      </div>
      
    </div>
    <!-- 表格 -->
    <div class="cam-box">
      <el-table
        v-loading="loading"
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%; border:1px solid #ddd;padding-top: 8px;" 
        @selection-change="handleSelectionChange">
        <el-table-column prop="groupId" type="selection" width="30"> </el-table-column>
        <el-table-column prop="groupName" :label="$t('CAM.CAM.userGroup.colNmae')" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="remark" :label="$t('CAM.CAM.userGroup.colRemark')" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="createTime" :label="$t('CAM.CAM.userGroup.colCreTime')" show-overflow-tooltip> </el-table-column>
        <el-table-column :label="$t('CAM.CAM.userGroup.colHandle')" show-overflow-tooltip>
           &lt;!&ndash;<template slot-scope="scope">
          <el-button size="mini" type="text" @click="addUserGroup(scope.row.groupId)">{{$t('CAM.CAM.userGroup.createBtn')}}</el-button>
          <el-button size="mini" type="text" @click="delUserGroup(scope.row.groupId)">{{$t('CAM.CAM.userGroup.delBtn')}}</el-button>
        </template>&ndash;&gt;
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          :page-sizes="[10, 20, 30, 40]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          :total="40">
        </el-pagination>
      </div>
    </div>
    <template>
      <el-dialog :title="$t('CAM.CAM.userGroup.addTitle')" :visible.sync="dialogVisible" :before-close="handleClose" > 
          <el-transfer filterable
            :filter-placeholder="$t('CAM.CAM.userGroup.selSearch')"
            v-model="userModel"
            center="true"
            :titles="[$t('CAM.CAM.userGroup.selection'), $t('CAM.CAM.userGroup.selected')]"
            :data="userData"
            :props="{
              key: 'uid',
              label: 'name'
            }"
            @left-check-change="changeLeftData"
          >
          </el-transfer> 
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">{{$t('CAM.CAM.userGroup.selCancelBtn')}}</el-button>
          <el-button type="primary" @click="addUser">{{$t('CAM.CAM.userGroup.selConfirmBtn')}}</el-button>
        </div>
      </el-dialog>
    </template>
  </div>

</template>
<script>
  // import addUserGroup from './addUserGroup'
export default {
  data() {
    return {
      searchValue: '',
      userModel: [],
      userData: [],
      dialogVisible: false,
      tableData: [],
      loading: true
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    // 初始化方法。
    init() {
      let params = {
        Action: 'ListGroups',
        Version: '2019-01-16'
      }
      if(this.searchValue != null && this.searchValue != ''){
        params["keyword"] = this.searchValue
      }
      let url = "cam/ListGroups"
      this.axios.post(url, params).then(data => {
        this.tableData = data.data.groupInfo
        this.loading = false
      }).catch(error => {
        console.log(error)
      })
    },
    // 打开用户组页面
    addUserGroup(rowId) {
      this.checkedGroupId = rowId
      // let url = "cam/ListSubAccounts"//获取子用户信息
      // let params = {
      //   Version: "2017-03-12",
      //   'filterGroups':'',
      //   Region: this.$cookie.get("regionv2")
      // }
      // this.axios.post(url, params).then(data => {
      let data = {
        'code': 0,
        'data': {
          'code': 0,
          'message': '',
          'codeDesc': 'Success',
          'data': {
            'userInfo': [
              {
                'uid': 5303664,
                'uin': 100012031058,
                'name': 'taifucloud',
                'remark': '',
                'canLogin': 1,
                'phoneNum': '18738326518',
                'countryCode': '86',
                'phoneFlag': 0,
                'email': '18738326518@163.com',
                'emailFlag': 0,
                'userType': 3,
                'createTime': '2019-11-08 17:25:21',
                'isReceiverOwner': 0,
                'systemType': 'SubAccount',
                'needResetPassword': 0,
                'consoleLogin': 1,
                'wxzsStatus': 0,
                'permType': [],
                'isDeleted': 0
              },
              {
                'uid': 5303665,
                'name': 'taifucloud2'
              },
              {
                'uid': 5303666,
                'name': 'taifucloud3'
              },
              {
                'uid': 5303667,
                'name': 'taifucloud4'
              },
              {
                'uid': 5303668,
                'name': 'taifucloud5'
              }
            ],
            'ownerInfo': [{
              'uid': 5303664,
              'uin': 100011921910,
              'userName': '123456789',
              'checkStatus': 0
            }],
            'totalNum': '1'
          }
        },
        'mccode': 0,
        'errObj': {},
        'reqId': 'By7bcetir',
        'seqId': '7b539cc3-82a9-904a-1d13-42ca752bbeb5'
      }
      this.userData = data.data.data.userInfo
      this.owneruserData = data.data.data.ownerInfo
      // this.$message({ message: this.$t('CAM.CAM.userGroup.successInfo'), type: "success" })
      // 获取数据成功，打开dialog。
    this.dialogVisible = true
      //   this.cancel()
      // }).catch(error => {
      //   console.log(error)
      // })
    },
    // 删除用户组
    delUserGroup(groupId) {
      this.$confirm( this.$t('CAM.CAM.userGroup.delHint'), this.$t('CAM.CAM.userGroup.delTitle'), {
      confirmButtonText: this.$t('CAM.CAM.userGroup.delConfirmBtn'),
      cancelButtonText: this.$t('CAM.CAM.userGroup.delCancelBtn'),
      type: 'warning'
      }).then(() => {
      let url = "cam/DeleteGroup"
        let params = {
          Action: 'DeleteGroup',
          Version: '2019-01-16',
          groupId: groupId
        }
        this.axios.post(url, params).then(data => {
          if(data != null && data.codeDesc === 'Success') {
            this.$message({ type: 'success', message: this.$t('CAM.CAM.userGroup.delInfo')+'!' })
            this.init()
          }
        }).catch(error => {
          this.$message({ type: 'success', message: error })
          console.log(error)
        })
      }).catch(() => {
        // this.$message({ type: 'info', message: '已取消删除' })          
      })
    },
    changeLeftData(userModel) {
      this.userModel= [...this.userModel, ...userModel]
    },
    addUser() {
      this.dialogVisible = false
      let value = this.userModel
      if(value != null) {
        let url = "cam/AddUserToGroup"
        let params = {
        Action: 'AddUserToGroup',
        Version: "2019-01-16"
      }
      for(var i = 0; i < value.length; i++) {
        params['Info.' + i + '.Uid'] = value[i]
        params['Info.' + i + '.GroupId'] = this.checkedGroupId
      }
      this.axios.post(url, params).then(data => {
        this.$message({ message: this.$t('CAM.CAM.userGroup.successInfo'), type: "success" })
        this.$emit("update")
        this.cancel()
      }).catch(error => {
        console.log(error)
      })
    }
    },
    NewUser() {
      this.$router.push({name: 'NewUserGroup'})
    },
    // 查询方法
    toQuery(){
      this.loading = true
      this.init()
    },
    handleSelectionChange() {

    },
    handleClose() {
      this.dialogVisible = false
    }
  }
}
</script>
<style lang="scss" scoped>
  .Cam {
    .top {
      height: 45px;
      line-height: 45px;
      margin-bottom: 20px;
      padding: 0 20px;
      background: #fff;
      .title-left {
        font-size: 14px;
        font-weight: bolder;
      }
      .title-right {
        float: right;
        span:hover {
          color: #006eff;
          border-bottom: 1px solid #006eff;
        }
      }
    }
    .content {
      padding: 20px;
      .operation {
        margin-bottom: 10px;
      }
      .search {
        overflow: hidden;
        padding: 10px 0;
        .search-left {
          float: left;
          .searchBox {
            display: inline-block;
          }
        }
        .search-right {
          float: right;
          margin-top: 10px;
          :hover {
            cursor: pointer;
          }
          i {
            padding: 0 3px;
          }
        }
      }
      .cam-pag {
        padding: 10px 0;
        display: flex;
        justify-content: flex-end;
      }
    }

    .cam_button{
      width: 96%;
      height: 40px;
      margin: 10px auto;
    }
    .cam-lt{
      float: left;
    }
    .head-container{
      float: right;
    }
    .cam_button{
      position: relative;
    }
    .suo{
      position: absolute;
      right: 0;
    }
    .cam-box{
      width: 96%;
      padding: 20px;
      background-color: #fff;
      margin: 0 auto;
    }
    .block{
      text-align: right;
      padding-top: 10px;
    }
    .btn-fr{
      float: right;
    }
    .pad{
      padding: 0 20px 0 20px;
    }
    .bor-box{
      font-size: 12px;
      line-height: inherit;
      padding: 10px 30px 10px 20px;
      vertical-align: middle;
      color: #003b80;
      border: 1px solid #97c7ff;
      border-radius: 2px;
      background: #e5f0ff;
      position: relative;
      box-sizing: border-box;
      //max-width: 1360px;
      margin-left: auto;
    }
    .bor-box p{
      line-height: 1.5;
      margin-bottom: 8px;
    }
    .bor-box .num-item{
      text-indent: -10px;
      padding-left: 18px;
      margin-bottom: 0; 
    }
  }
</style>

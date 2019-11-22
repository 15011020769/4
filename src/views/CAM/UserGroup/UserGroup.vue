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
        <el-button type="primary"  @click="NewUser" >{{$t('CAM.CAM.userGroup.addBtn')}}</el-button>
        <el-button type="primary" :disabled="btnVisible" @click="addUserGroup()" >{{$t('CAM.CAM.userGroup.createBtn')}}</el-button>
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
       
        <el-table-column prop="groupId" type="selection" width="30"></el-table-column>
       <el-table-column prop="groupName" :label="$t('CAM.CAM.userGroup.colNmae')" show-overflow-tooltip>
          &lt;!&ndash;<template slot-scope="scope">
            <el-button @click="Interface" size="mini" type="text">{{scope.row.groupName}}</el-button>
          </template>&ndash;&gt;</el-table-column>
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
      <el-dialog :title="$t('CAM.CAM.userGroup.addTitle')"  :visible.sync="dialogVisible" :before-close="handleClose" width="70%"> 
        <div class="container-left">
          <p>选择添加的用户（共{{totalNum}}条）</p>
          <el-input size="mini" v-model="search"  style="width:85%"  @keyup.enter.native="toQuery"/>
          <el-button size="mini" class="suo" icon="el-icon-search" @click="toQuery"></el-button>
          <el-table
            class="table-left"
                ref="multipleOption"
                :data="userData"
                size = "small"
                height="300"
                tooltip-effect="dark"
                style="width: 100%"
                @row-click="selectedRow"
                @selection-change="handleSelectionChangeUser">
                <el-table-column type="selection" prop="Uin" width="30"> </el-table-column>
                  <el-table-column prop="Name" label="用户"  show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column label="用户类型"  width="100">
                    <template slot-scope="scope">
                      <p>用户类型</p>
                    </template>
                  </el-table-column>
          </el-table>
        </div>
        <div class="abs">
          <div>&nbsp;</div>
        </div>
        <div class="container-left">
          <span>已选择（共条）</span>
            <el-table
                class="table-left"
                ref="multipleSelected"
                :data="userSelData"
                tooltip-effect="dark"
                size = "small"
                height="300"
                style="width: 100%">
                <el-table-column prop="Name" label="用户"  show-overflow-tooltip> </el-table-column>
                <el-table-column label="用户类型"  width="100">
                  <template slot-scope="scope">
                      <p>用户类型</p>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('CAM.CAM.userGroup.colHandle')"  width="50">
                  &lt;!&ndash;<template slot-scope="scope">
                    <el-button
                      @click.native.prevent="deleteRow(scope.$index, userSelData)"
                      type="text"
                      size="small">
                      x
                    </el-button>
                  </template>&ndash;&gt;
                </el-table-column>
            </el-table>
        </div>
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
      userSelData: [],
      dialogVisible: false,
      tableData: [],
      search: '',
      totalNum: 0,
      btnVisible: true,
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
      let url = "cam2/ListUsers" // 拉取子用户
      let params = {
        Action: 'ListUsers',
        Version: "2019-01-16"
      }
      this.axios.post(url, params).then(res => {
      this.userData = res.Response.Data
      console.log(this.userData)
      // this.owneruserData = res.data.data.ownerInfo
      // this.$message({ message: this.$t('CAM.CAM.userGroup.successInfo'), type: "success" })
      // 获取数据成功，打开dialog。
      this.dialogVisible = true
      // this.cancel()
      }).catch(error => {
        console.log(error)
      })
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
    handleSelectionChange(val) {
      console.log(val)
      if(val != '') {
        this.btnVisible = false
      }else {
        this.btnVisible = true
      }
    },
    handleClose() {
      this.dialogVisible = false
    },
    handleSelectionChangeUser(val) {
      // 给右边table框赋值，只需在此处赋值即可，selectedRow方法中不写，因为单独点击复选框，只有此方法有效。
      this.userSelData = val
    },
    selectedRow(row, column, event) {
    // 设置选中或者取消状态
      this.$refs.multipleOption.toggleRowSelection(row)
    },
    deleteRow(index, rows) {
      // 获取右边框中取消的行数据，将此行数据在右边框中的选中状态取消
      this.$refs.multipleOption.toggleRowSelection(rows[index],false)
    },
    toQuery() {
      this.init()
    },
    //测试接口详情
    Interface(){
      this.$router.push({ name: "Interfacedetails" });
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
    .abs{
      display: inline-block;
      width: 100px;
      height: 300px;
      text-align: center;
    }
    .container-left{
      width: 44%;
      display: inline-block;
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

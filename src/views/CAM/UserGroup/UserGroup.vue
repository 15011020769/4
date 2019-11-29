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
        <el-button type="primary" size="small" @click="NewUser" >{{$t('CAM.CAM.userGroup.addBtn')}}</el-button>			 
        <el-button size="small" type="primary" :disabled="btnVisible" @click="addUserGroup()" >{{$t('CAM.CAM.userGroup.createBtn')}}</el-button>
      </el-row>
      <div class="head-container">
        <!-- 搜索 -->
        <el-input size="small" v-model="searchValue" clearable :placeholder="$t('CAM.CAM.userGroup.placeholder')" style="width: 300px;"  @keyup.enter.native="toQuery"/>
        <i class="el-icon-search ifier" show-overflow-tooltip @click="toQuery"></i>
        <i class="el-icon-s-tools gear" @click="gear=true"></i>
        <el-dialog title="自定义列表字段" :visible.sync="gear" width="45%" :before-close="handleCloseGear">
          <div class="app-cam-alert">
            <div class="app-cam-alert__info">请选择您想显示的列表详细信息</div>
          </div>
          <el-form ref="form" :model="form">
            <el-form-item>
              <el-checkbox-group v-model="form.type">
                <p>
                  <el-checkbox disabled label="用户组名称" name="type"></el-checkbox>
                </p>
                <p>
                  <el-checkbox label="备注" name="type"></el-checkbox>
                </p>
                <p>
                  <el-checkbox label="创建时间" name="type"></el-checkbox>
                </p>
                <p>
                  <el-checkbox disabled label="操作" name="type"></el-checkbox>
                </p>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button size="small" type="primary" @click="gear = false">确 定</el-button>
            <el-button size="small" @click="gear = false">取 消</el-button>
          </div>
        </el-dialog>													   
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
        <el-table-column prop="GroupId" type="selection" width="28"></el-table-column>
       <el-table-column prop="GroupName" :label="$t('CAM.CAM.userGroup.colNmae')" show-overflow-tooltip>
          &lt;!&ndash;<template slot-scope="scope">
            <el-button @click="Interface(scope.row.GroupId)" size="mini" type="text">{{scope.row.GroupName}}</el-button>
          </template>&ndash;&gt;
        </el-table-column>
        <el-table-column prop="Remark" :label="$t('CAM.CAM.userGroup.colRemark')" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="CreateTime" :label="$t('CAM.CAM.userGroup.colCreTime')" show-overflow-tooltip> </el-table-column>
        <el-table-column :label="$t('CAM.CAM.userGroup.colHandle')" show-overflow-tooltip>
           &lt;!&ndash;<template slot-scope="scope">
          <el-button size="mini" type="text" @click="addUserGroup(scope.row.GroupId)">{{$t('CAM.CAM.userGroup.createBtn')}}</el-button>							  
          <el-button size="mini" type="text" @click="delUserGroup(scope.row.GroupId)">{{$t('CAM.CAM.userGroup.delBtn')}}</el-button>
        </template>&ndash;&gt;
        </el-table-column>
      </el-table>
      <div style="background:#fff;padding:10px;display:flex;justify-content: space-between;line-height:30px">
        <div>
          <span style="font-size:12px;color:#888">已选 0 项，共 3 项</span>
        </div>
        <div>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="10"
            layout="sizes, prev, pager, next"
            :total="40"
          ></el-pagination>
        </div>
      </div>
    </div>
    <template>
      <el-dialog :title="$t('CAM.CAM.userGroup.addTitle')"  :visible.sync="dialogVisible" :before-close="handleClose" width="70%"> 
				<div class="container-left">
          <p>选择添加的用户（共{{totalNum}}条）</p>
          <el-input size="mini" v-model="search"  style="width:100%"  @keyup.enter.native="toQuery"/>
          <i size="mini" class="el-icon-search fier" @click="toQuery"></i>
          <el-table
            class="table-left"
                ref="multipleOption"
                :data="userData"
                size = "small"
                height="55vh"
                tooltip-effect="dark"
                style="width: 100%;"
                @row-click="selectedRow"
                @selection-change="handleSelectionChangeUser">
                <el-table-column type="selection" prop="Uin" width="28"> </el-table-column>
                  <el-table-column prop="Name" label="用户"  show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column label="用户类型"  width="100">
                    <template slot-scope="scope">
                      <p>子用户</p>
                    </template>
                  </el-table-column>
          </el-table>
        </div>
        <div class="direction">
          <div class="direction-icon">
            <i class="iconfont">&#xe603;</i>
          </div>
        </div>
        <div class="container-left">
          <span>已选择（{{selNum}}）</span>
            <el-table
                class="table-left"
                ref="multipleSelected"
                :data="userSelData"
                tooltip-effect="dark"
                size = "small"
                height="60vh"
                style="width: 100%;">
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
          <el-button type="primary" @click="addUser">{{$t('CAM.CAM.userGroup.selConfirmBtn')}}</el-button>
          <el-button @click="dialogVisible = false">{{$t('CAM.CAM.userGroup.selCancelBtn')}}</el-button>
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
		  form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },		  
      searchValue: '',
	    gear: false,
      userData: [],
      userSelData: [],
      dialogVisible: false,
      tableData: [],
      search: '',
      totalNum: 0,
      selNum: 0,
      btnVisible: true,
      selectedGroupId: 0,
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
        params["Keyword"] = this.searchValue
      }
      let url = "cam2/ListGroups"
      this.axios.post(url, params).then(res => {
        if(res != '') {
          this.tableData = res.Response.GroupInfo
          this.loading = false
        }else{
          this.loading = false
          this.$message({ type: 'info', message: '无响应数据！' })
        }
      }).catch(error => {
        console.log(error)
      })
    },
    // 打开添加用户页面
    addUserGroup(rowId) {
      let _this = this
      if(rowId != undefined && rowId != '') {
        this.selectedGroupId = rowId
      }
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
        this.userData = []
        let userAllData = res.Response.Data
        this.totalNum = this.userData.length
        // 获取用户组管理用户
        let owneruserData = []
        let paramsGroup = {
          Action: 'ListUsersForGroup',
          GroupId: _this.selectedGroupId,
          Version: '2019-01-16'
        }
        let urlGroup = "cam2/ListUsersForGroup"
        this.axios.post(urlGroup, paramsGroup).then(resGroup => {
          // 不直接将子用户信息赋予用户组选择框中,是避免页面出现 过滤后的子用户信息刷新覆盖初始信息
          owneruserData = resGroup.Response.UserInfo
          // 用户组拥有子用户，系统将拥有子用户从用户组添加框中去掉，避免重复选择
          if(owneruserData != '') {
            for(var i = 0; i < owneruserData.length; i++) {
              let ownerObj = owneruserData[i]
              for(var j = 0; j < userAllData.length; j++) {
                let allObj = userAllData[j]
                if(allObj.Uin === ownerObj.Uin){
                  userAllData.splice(j,1)
                }
              }
            }
            _this.userData = userAllData
          }else{
            _this.userData = userAllData
          }
        }).catch(error => {
          console.log(error)
        })
        // 获取数据成功，打开dialog。
        this.dialogVisible = true
        // this.cancel()
      }).catch(error => {
        console.log(error)
      })
    },
    // 删除用户组
    delUserGroup(groupId) {
      let _this = this
      this.$confirm( this.$t('CAM.CAM.userGroup.delHint'), this.$t('CAM.CAM.userGroup.delTitle'), {
        confirmButtonText: this.$t('CAM.CAM.userGroup.delConfirmBtn'),
        cancelButtonText: this.$t('CAM.CAM.userGroup.delCancelBtn'),
        type: 'warning'
      }).then(() => {
        let url = "cam2/DeleteGroup"
        let params = {
          Action: 'DeleteGroup',
          Version: '2019-01-16',
          GroupId: groupId
        }
        this.axios.post(url, params).then(data => {
          if(data != null && data.codeDesc === 'Success') {
            this.$message({ type: 'success', message: this.$t('CAM.CAM.userGroup.delInfo')+'!' })
            _this.init() // 重新加载页面
          }
        }).catch(error => {
          this.$message({ type: 'success', message: error })
          console.log(error)
        })
      }).catch(() => {
        // this.$message({ type: 'info', message: '已取消删除' })          
      })
    },
    // 用户组添加用户
    addUser() {
      let GroupId = this.selectedGroupId
      this.dialogVisible = false
      let value = this.userSelData
      if(value != '') {
        let params = {
          Action: 'AddUserToGroup',
          Version: "2019-01-16"
        }
        for(var i = 0; i < value.length; i++) {
          params['Info.' + i + '.Uid'] = value[i].Uid
          params['Info.' + i + '.GroupId'] = GroupId
        }
        let url = "cam2/AddUserToGroup"
        this.axios.post(url, params).then(data => {
          this.$message({ message: this.$t('CAM.CAM.userGroup.successInfo'), type: "success" })
          _this.init() // 重新加载页面
          // this.$emit("update")
          // this.cancel()
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
      if(val != '') {
        this.btnVisible = false
        this.selectedGroupId = val[0].GroupId
      }else {
        this.btnVisible = true
      }
    },
    handleClose() {
      this.dialogVisible = false
    },
    handleCloseGear() {
      this.gear = false
    },
    handleSelectionChangeUser(val) {
      // 给右边table框赋值，只需在此处赋值即可，selectedRow方法中不写，因为单独点击复选框，只有此方法有效。
      this.userSelData = val
      this.selNum = this.userSelData.length
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
    Interface(groupId){
      this.$router.push({
        name: "Interfacedetails",
        query:{
          GroupId: groupId
        }
      });
    },
    handleSizeChange() {

    },
    handleCurrentChange() {

    },
    currentPage2() {

    },
    currentPage() {

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
    .direction{
      display: table-cell;
      width: 38px;
      text-align: center;
      vertical-align: middle;
    }
    .direction-icon{
      width: 16px;
      height: 16px;
      display: inline-block;
      vertical-align: middle;
      background-repeat: no-repeat;
      background-position: inherit;
      font-size: 0;
    }
    .container-left {
      width: 48%;
      height: 100%;
      display: table-cell;
      position: relative;
      vertical-align: top;
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
    .ifier {
      cursor:pointer;
      font-size: 140%;
      color: #888;
      position: absolute;
      right: 3%;
      top: 18%;
    }
    .gear {
      cursor:pointer;
      font-size: 140%;
      color: #888;
      padding-left: 6px;
    }
    .fier{
      cursor:pointer;
      font-size: 140%;
      color: #888;
      position: absolute;
      right: 3%;
      top: 7%;
    }
    .app-cam-alert {
      padding: 10px 30px 10px 20px;
      vertical-align: middle;
      color: #003b80;
      border: 1px solid #97c7ff;
      border-radius: 2px;
      background: #e5f0ff;
      position: relative;
      box-sizing: border-box;
      margin-left: auto;
      margin-right: auto;
      margin-bottom: 20px;
    }
  }
</style>
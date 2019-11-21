<template>
  <div class="Cam">
    <div class="top">
      <span class="title-left">项目密钥管理</span>
    </div>
    <div class="cam_button">
      <el-row class="cam-lt">
        <el-button type="primary"  @click="NewUser" >新建秘钥</el-button>
      </el-row>
    </div>
    <!-- 表格 -->
    <div class="cam-box">
      <el-table
        v-loading="loading"
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%; border:1px solid #ddd;padding-top: 8px;" >
        <el-table-column prop="groupName1" label="项目名称" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="groupName" label="ID" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="remark" label="密钥" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="status" label="状态" show-overflow-tooltip> </el-table-column>
        <el-table-column label="操作" show-overflow-tooltip>
           &lt;!&ndash;<template slot-scope="scope">
          <el-button size="mini" type="text" >启用</el-button>
          <el-button size="mini" type="text" >删除</el-button>
        </template>&ndash;&gt;
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          :page-sizes="[10, 20, 30, 40]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>
    <div v-show="dialogVisible">
      <template>
        <el-dialog title="请选择需要生成密钥的项目" :visible.sync="dialogVisible" :before-close="handleClose" width="70%"> 
          <el-form ref="addModel" label-width="100px">
            <el-col :span="12">
              <el-radio-group v-model="addModel" size="mini">
                <el-radio label="1" border>默认项目</el-radio>
                <el-radio label="2" border>东华云计算有限公司</el-radio>
                <el-radio label="3" border>taifuyun</el-radio>
                <el-radio label="4" border>test</el-radio>
              </el-radio-group>
            </el-col>
          </el-form>
        </el-dialog>
      </template>
    </div>
  </div>

</template>
<script>
// import NewProgrameKey from "./NewProgrameKey.vue"
export default {
  // components: {
  //   NewProgrameKey
  // },
  data() {
    return {
      tableData: [],
      total: 0,
      loading: true,
      dialogVisible: false,
      addModel: '1'
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    // 初始化方法。
    init() {
      // let params = {
      //   Action: 'ListGroups',
      //   Version: '2019-01-16'
      // }
      // let url = "cam/ListGroups"
      // this.axios.post(url, params).then(res => {
      //   this.tableData = res.data.groupInfo
      //   this.total = parseInt(res.data.totalNum)
        this.loading = false
      // }).catch(error => {
      //   console.log(error)
      // })
    },
    NewUser() {
      const addModel = this.addModel
      this.dialogVisible = true
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
    .abs{
      display: inline-block;
      width: 100px;
      height: 300px;
      line-height: 150px;
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
    .suo{
      position: absolute;
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

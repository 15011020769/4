<template>
  <div class="Cam">
    <div class="top">
      <span class="title-left">API密钥管理</span>
    </div>
    <div class="explain">
      <p>
        <span>您的 API 密钥代表您的账号身份和所拥有的权限，等同于您的登录密码，切勿泄露他人。</span>
      </p>
    </div>
    <div class="cam_button">
      <el-row class="cam-lt">
        <el-button type="primary" size="small" @click="NewUser" >新建秘钥</el-button>
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
        <el-table-column prop="groupName" label="APPID" show-overflow-tooltip> </el-table-column>
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
    <template>
      <div>
        <el-dialog title="高风险提示" :visible.sync="highRiskHint" :before-close="highRisClose" width="40%"> 
          <p style="font-size:10px;">
            您正在使用主账号访问云API密钥管理页面，使用密钥通过云API可以无限制地访问您的腾讯云资源。 云API密钥泄露可能造成您的云上资产损失，强烈建议您登录子用户账户操作并使用子用户密钥访问云API。
          </p>
          <p style="font-size:10px;">
            <el-checkbox v-model="checked">不再显示此信息</el-checkbox>
          </p>
          <br/>
          <br/>
          <div style="margin:0 auto;text-align: center;">
            <el-button size="small" @click="highRiskHint = false">&nbsp;&nbsp;继续使用&nbsp;&nbsp;</el-button>
            <el-button size="small" type="primary" @click="highRiskLink">&nbsp;&nbsp;立即使用子账户&nbsp;&nbsp;</el-button>
          </div>
        </el-dialog>
      </div>
    </template>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableData: [],
      total: 0,
      loading: true,
      highRiskHint: true,
      checked: false
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
      this.$router.push({name: 'NewIdentityProvider'})
    },
    highRisClose() {
      this.highRiskHint = false
    },
    highRiskLink() {
      this.$router.push({ name: "custormCreate" });
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
    .explain {
      width: 96%;
      font-size: 12px;
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
    }
    .explain p {
      line-height: 1.5;
      margin-bottom: 8px;
    }
  }
</style>

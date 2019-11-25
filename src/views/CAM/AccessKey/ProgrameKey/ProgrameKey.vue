<template>
  <div class="Cam">
    <div class="top">
      <span class="title-left">项目密钥管理</span>
    </div>
    <div class="explain">
      <p>
        <span>目前项目密钥仅支持对象存储V4、数据万象（原万象优图）等产品。 使用项目密钥访问上述产品的 API 前，需要 SecretId 和 SecretKey 获取鉴权签名，否则将无法访问上述产品的 API。<a href="https://cloud.tencent.com/document/product/436/7778" target="_blank">如何获取鉴权签名<i class="el-icon-share"></i></a></span>
      </p>
      <p>
        <span>为了您的账号安全，请定期更换项目密钥，更换期间新旧密钥均可使用；当您更换密钥后，请及时删除旧密钥。</span>
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
      <div
        style="background:#fff;padding:10px;display:flex;justify-content: space-between;line-height:30px"
      >
        <div>
          <span style="font-size:12px;color:#888">已选 0 项，共 0 项</span>
        </div>
        <div>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage2"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="10"
            layout="sizes, prev, pager, next"
            :total="40"
          ></el-pagination>
        </div>
      </div>
    </div>
    <template>
      <div>
        <el-dialog title="请选择需要生成密钥的项目" :visible.sync="dialogHint" :before-close="handleClose" width="40%"> 
          <div class="explain" style="margin-bottom: 20px;margin-left: 0px;">
            <p>
              <span style="color:red;">项目密钥暂不支持在云 API 上分项目管理资源</span>
            </p>
          </div>
          <el-form ref="addModel" label-width="100px">
              <el-radio-group class="add" v-model="addModel" size="small" style="">
                <p>
                  <el-radio label="1" >默认项目</el-radio>
                </p>
                <p>
                  <el-radio label="2" >东华云计算有限公司1</el-radio>
                </p>
                <p>
                  <el-radio label="3" >taifuyun</el-radio>
                </p>
                <p>
                  <el-radio label="4" >test</el-radio>
                </p>
              </el-radio-group>
          </el-form>
          <br/>
          <br/>
          <div style="margin:0 auto;text-align: center;">
            <el-button size="small" type="primary" @click="addUser">确定生成</el-button>
            <el-button size="small" @click="dialogHint = false">取消</el-button>
          </div>
        </el-dialog>
      </div>
    </template>
    <template>
      <div>
        <el-dialog title="通知" :visible.sync="notificationHint" :before-close="notificationHintClose" width="40%"> 
          <p style="font-size:10px;">您已成功创建项目密钥。</p>
          <p style="color:red;font-size:10px;">
            项目密钥不支持访问腾讯云 API 。如需访问云 API ，请前往 <a href="https://console.cloud.tencent.com/cam/capi" target="_blank">API 密钥管理<i class="el-icon-share"></i></a> 生成API密钥。
          </p>
          <br/>
          <br/>
          <div style="margin:0 auto;text-align: center;">
            <el-button size="small" type="primary" @click="notificationHint = false">&nbsp;&nbsp;知道了&nbsp;&nbsp;</el-button>
          </div>
        </el-dialog>
      </div>
    </template>
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
      dialogHint: false,
      notificationHint: false,
      highRiskHint: true,
      addModel: '1',
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
      // const addModel = this.addModel
      this.dialogHint = true
    },
    handleClose() {
      this.dialogHint = false
    },
    addUser() {
      console.log(this.addModel)
      this.dialogHint = false
      this.notificationHint = true
      // this.$alert('<p style="font-size:12px;">您已成功创建项目密钥。</p><p style="color:red;font-size:12px;">项目密钥不支持访问腾讯云 API 。如需访问云 API ，请前往 <a>API 密钥管理</a> 生成API密钥。</p>', '通知', {
      //   dangerouslyUseHTMLString: true
      // });
    },
    notificationHintClose() {
      this.notificationHint = false
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
    .add p{
      height: 24px;
    }
  }
</style>

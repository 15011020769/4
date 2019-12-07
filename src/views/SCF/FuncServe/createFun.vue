<template>
  <div>
    <div class="topCreateFun">
      <span class="el-icon-back" @click="backFunlist"></span>
      <span class="createFunTit">创建函数</span>
      <span class="docRight">
        <!-- <a href="#">
          命令行工具创建函数
          <span class="el-icon-share"></span>
        </a>
        <a href="#">
          VS Code创建函数
          <span class="el-icon-share"></span>
        </a> -->
      </span>
    </div>
    <div class="mainContent">
      <div class="stepOneTopTit newClear">
        <span>1</span>
        <span>基础信息</span>
        <span>></span>
        <span>2</span>
        <span>函数配置</span>
      </div>
      <div class="mainContForm">
        <el-form :model="createFunTable" label-width="80px">
          <el-form-item label="函数名称" :required="true">
            <el-input class="funNameIpt" v-model="createFunTable.funName"></el-input>
            <p class="tipCon">1. 最多60个字符，最少2个字符</p>
            <p class="tipCon">2. 字母开头，支持 a-z，A-Z，0-9，-，_，且需要以数字或字母结尾</p>
          </el-form-item>
          <el-form-item label="运行环境">
            <el-select v-model="createFunTable.runMoment">
              <el-option label="Python2.7" value="Python2.7"></el-option>
              <el-option label="Python3.6" value="Python3.6"></el-option>
              <el-option label="Nodejs6.10" value="Nodejs6.10"></el-option>
              <el-option label="PHP5" value="PHP5"></el-option>
              <el-option label="PHP7" value="PHP7"></el-option>
              <el-option label="Golang1" value="Golang1"></el-option>
              <el-option label="Java8" value="Java8"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="创建环境">
            <div class="tabBtn">
              <div class="tabBtnBox tabBtnOne" :class="clickTab==true?'addBorderColor':''" @click="clickTab=true">
                <p>模板函数</p>
                <p>使用示例代码模板创建函数</p>
              </div>
              <!-- <div class="tabBtnBox tabBtnTwo" :class="clickTab==false?'addBorderColor':''" @click="clickTab=false">
                <p>空白函数</p>
                <p>使用helloworld示例创建空白函数</p>
              </div> -->
            </div>
          </el-form-item>
          <div v-if="clickTab">
            <el-form-item label="模板搜索">
              <el-input class="searchIpt" v-model="searchName"></el-input>
              <el-button class="btn" @click="doFilter" icon="el-icon-search"></el-button>
            </el-form-item>
            <div class="allFunList">
              <el-row>
                <el-col :span="8" v-for="(item,index) in tableDataBegin" :key="index">
                  <div class="allFunListBoxCon" :class="isactive==index ?'addBorderCla':''"
                    @click="mouseHandel(index,item.DemoId)">
                    <div class="funListBoxConTit newClear">
                      <span class="titNew">{{item.Name}}</span>
                      <a class="lookDetail" @click="lookFunDetails(item.DemoId)">查看详情</a>
                      <el-dialog title="模板详情" :visible.sync="dialogVisible" width="30%" :before-close="handleClose"
                        v-if="dialogVisible">
                        <div class="detailBoxCon">
                          <div class="detailBoxConOne detailBoxC">
                            <h2>基础信息</h2>
                            <div class="detailBoxCen">
                              <p>
                                <span class="leftWidth">名称</span>
                                <span>{{DataBeginDetail.application.Chinese.name}}</span>
                              </p>
                              <p>
                                <span class="leftWidth">语言</span>
                                <span>{{DataBeginDetail.functions.runtime}}</span>
                              </p>
                              <p>
                                <span class="leftWidth">描述</span>
                                <span>{{DataBeginDetail.functions.description}}</span>
                              </p>
                              <p>
                                <span class="leftWidth">作者</span>
                                <span>{{DataBeginDetail.application.Chinese.author.name}}</span>
                              </p>
                            </div>
                          </div>
                          <div class="detailBoxConTwo detailBoxC">
                            <h2>
                              输入参数
                              <i class="el-icon-document-copy"></i>
                            </h2>
                            <p>{{DataBeginDetail.application.input_parameters}}</p>
                          </div>
                          <div class="detailBoxConThree detailBoxC">
                            <h2>
                              输出参数
                              <i class="el-icon-document-copy"></i>
                            </h2>
                            <p>{{DataBeginDetail.application.output_parameters}}</p>
                          </div>
                          <div class="detailBoxConFour detailBoxC">
                            <h2>注意事项</h2>
                            <p>无</p>
                          </div>
                          <div class="detailBoxConFour detailBoxC">
                            <h2>证书</h2>
                            <p>{{DataBeginDetail.application.Chinese.license.content}}</p>
                          </div>
                          <div class="detailBoxConFive detailBoxC">
                            <!-- <h2>模板函数下载地址</h2>
                            <a :href="DataBeginDetail.application.download_address">点击下载</a> -->
                          </div>
                        </div>
                        <span slot="footer" class="dialog-footer">
                          <el-button @click="dialogVisible = false">关闭</el-button>
                          <!-- <el-button type="primary" @click="">提交</el-button> -->
                        </span>
                      </el-dialog>
                    </div>
                    <div class="funListBoxConP">
                      <p class="funListLangu">
                        <span>语言</span>
                        <span>{{item.Runtime}}</span>
                      </p>
                      <p class="funListDesc">
                        <span>描述</span>
                        <span class="funListDescspan">{{item.Describe}}</span>
                      </p>
                      <!-- <p class="funListTags">
                        <span>标签</span>
                        <span>{{item.Tags}}</span>
                      </p> -->
                      <p class="funListpublish">
                        <span>部署</span>
                        <span>{{item.Stars}}次</span>
                      </p>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
            <div class="tabListPage">
              <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="currentPage" :page-sizes="[6, 9, 12, 15]" :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper" :total="totalItems"></el-pagination>
            </div>
          </div>
        </el-form>
      </div>

      <el-button class="nextStep" @click="nextStep">下一步</el-button>
    </div>
  </div>
</template>

<script>
  import {
    TEMPLATE_LIST,
    TEMPLATE_DETAIL
  } from "@/constants";
  export default {
    data() {
      return {
        index: "",
        active: 0,
        showHide: false,
        searchName: '', //搜索
        createFunTable: {
          funName: "",
          modelNameSpace: "",
          runMoment: "Python2.7",
        },
        clickTab: true,
        tableDataBegin: [], //函数模板列表
        DemoId: '', //函数模板ID
        DataBeginDetail: '', //函数模板详情数据
        Detaildata: '',
        isactive: -1,
        currentPage: 1,
        pageSize: 6,
        totalItems: 0,
        allData: [],
        tableDataBegin1: [],
        tableDataName: "",
        tableDataEnd: [],
        filterTableDataEnd: [],
        flag: false,
        dialogVisible: false
      };
    },
    computed: {
      // 模糊搜索
    },
    created() {
      this.GetTemplateList();
    },
    methods: {
      backFunlist() {
        this.$router.push({
          path: "/FuncServe"
        });
      },
      GetTemplateList() { //获取函数模板列表
        let param = {
          Region: this.$cookie.get('regionv2'),
          Version: "2018-04-16",
          Offset: this.currentPage - 1,
          Limit: this.pageSize
        }
        if (this.searchName !== '') {
          param['SearchKey.0.Key'] = 'Runtime'
          param['SearchKey.0.Value'] = this.searchName
        }
        this.axios
          .post(TEMPLATE_LIST, param)
          .then(data => {
            this.tableDataBegin = data.Response.Demos
            this.DemoId = this.tableDataBegin[0].DemoId
            this.isactive = 0
            this.totalItems = data.Response.TotalCount
          })
      },

      GetTemplateDetail() { //获取函数模板详情
        let param = {
          Region: this.$cookie.get('regionv2'),
          Version: "2018-04-16",
          DemoId: this.DemoId
        }
        this.axios
          .post(TEMPLATE_DETAIL, param)
          .then(data => {

            this.Detaildata = data.Response
            let DataBeginDetail = JSON.parse(data.Response.DemoConfig)

            this.DataBeginDetail = DataBeginDetail['serverless-cloud-function-application']
          }).then(() => {
            this.dialogVisible = true;
          })
      },
      mouseHandel(index, DemoId) {
        this.isactive = index;
        this.DemoId = DemoId
      },
      //搜索
      doFilter() {
        if (this.searchName !== '') {
          this.GetTemplateList()
        } else {
          this.$message('请输入相关语言搜索');

        }
      },
      // 分页开始
      getData() {

      },
      //分页
      handleSizeChange(val) {
        this.pageSize = val
        this.currentPage = 1
        this.GetTemplateList();
      },
      //分页
      handleCurrentChange(val) {
        this.currentPage = val
        this.GetTemplateList();
      },
      //组件自带监控当前页码
      currentChangePage(list) {

      },
      nextStep() {
        if (this.DemoId === '') {
          this.$message('请选择函数模板');

        }
        window.sessionStorage.setItem("funNameSess", this.createFunTable.funName);
        window.sessionStorage.setItem("runMoent", this.createFunTable.runMoment);
        window.sessionStorage.setItem("DemoId", this.DemoId);
        if (this.createFunTable.funName == "") {

          this.$message('函数名不能为空');
          return false;
        }
        this.$router.push({
          path: "/createFunStep"
        });
      },
      lookFunDetails(DemoId) {

        this.DemoId = DemoId
        this.GetTemplateDetail()


      },
      handleClose(done) {
        this.$confirm("确认关闭？")
          .then(_ => {
            done();
          })
          .catch(_ => {});
      }
    }
  };

</script>
<style lang="scss">
  .funListDescspan{
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 282px;
    display: inline-block; 
  }
  .mainContForm input {
    height: 30px !important;
    line-height: 30px !important;
    border-radius: 0 !important;
  }

  .btn {
    height: 30px !important;
    // line-height: 30px !important;
    border-radius: 0 !important;
    padding: 0 15px !important;
    margin-left: -2px !important;
  }

  .mainContForm>>>.el-form-item__label {
    text-align: left;
  }

  .newClear:after {
    display: block;
    content: "";
    clear: both;
  }

  .topCreateFun {
    width: 100%;
    height: 52px;
    background-color: #fff;
    line-height: 52px;
    border-bottom: 1px solid #eee;
    padding: 0 20px;

    .createFunTit {
      font-size: 16px;
      font-weight: 600;
      line-height: 52px;
    }

    .el-icon-back {
      float: left;
      margin-top: 17px;
      font-size: 20px;
      margin-right: 20px;
    }

    .docRight {
      float: right;

      a {
        float: left;
        margin-left: 12px;

        .el-icon-share {
          font-size: 20px;
          margin-left: 5px;
        }
      }
    }
  }

  .mainContent {
    margin: 20px;
    padding: 20px;
    background-color: #fff;
    box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);

    .mainContForm {
      padding-bottom: 20px;
      border-bottom: 1px solid #eaeaea;

      .funNameIpt {
        width: 200px;
        border-right: 0;
      }

      .searchIpt {
        width: 400px;

        input {
          // border-right: 0;
          border-radius: 4px 0 0 4px;
        }

        input:focus+.el-icon-search {
          border: 1px solid #006eff;
        }
      }

      .tipCon {
        font-size: 12px;
        color: #888;
        line-height: 16px;
      }

      .tabBtnBox {
        width: 236px;
        height: 70px;
        border: 1px solid #eaeaea;
        padding: 20px 15px;
        float: left;

        p:nth-child(1) {
          color: #000;
          font-size: 14px;
          margin-bottom: 6px;
          line-height: 14px;
        }

        p:nth-child(2) {
          color: #888;
          font-size: 12px;
          line-height: 12px;
        }
      }

      .allFunListBoxCon {
        // min-height:400px;
        box-sizing: border-box;
        padding: 16px;
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.3);
        background-color: #fff;
        border: 1px solid transparent;
        margin-right: 20px;
        margin-bottom: 20px;

        .funListBoxConTit {
          margin-bottom: 20px;

          span:nth-child(1).titNew {
            margin-right: 20px;
            float: left;
          }

          a {
            display: none;
          }
        }
      }

      .addBgColor {
        background-color: #f2f2f2;
      }

      .addBorderCla {
        border: 1px solid #006eff;
      }

      .addBorderColor {
        border: 1px solid #006eff;
      }
    }
  }

  .allFunList {
    padding-left: 82px;
    font-size: 14px;

    .funListBoxConP {
      p {
        margin-bottom: 20px;
        font-size: 14px;

        span:nth-child(1) {
          color: #888;
          margin-right: 20px;
        }
      }
    }
  }

  .stepTip {
    width: 15%;
    margin-bottom: 12px;
  }

  .mainContent .mainContForm .allFunListBoxCon:hover {
    background-color: #f2f2f2;

    a {
      display: block;
      float: left;
    }

    a:hover {
      cursor: pointer;
      text-decoration: underline;
    }
  }

  .mainContent .mainContForm .searchIpt input:focus+.el-icon-search {
    border: 1px solid #006eff;
  }

  .stepOneTopTit {
    line-height: 32px;
    width: 100%;
    margin-bottom: 15px;

    span:nth-child(1) {
      width: 30px;
      float: left;
      height: 30px;
      line-height: 30px;
      text-align: center;
      background-color: #006eff;
      color: #fff;
      margin-right: 12px;
      border-radius: 100%;
    }

    span:nth-child(2) {
      float: left;
      color: #000;
      margin-right: 35px;
      font-weight: 600;
      font-size: 14px;
    }

    span:nth-child(3) {
      font-size: 14px;
      color: #888;
      float: left;
      margin-right: 35px;
    }

    span:nth-child(4) {
      width: 30px;
      float: left;
      height: 30px;
      line-height: 30px;
      text-align: center;
      border: 1px solid #888;
      color: #888;
      border-radius: 100%;
      margin-right: 12px;
    }

    span:nth-child(5) {
      float: left;
      color: #888;
      margin-right: 40px;
      font-weight: 600;
      font-size: 14px;
    }
  }

  .nextStep {
    margin-top: 12px !important;
    color: #fff !important;
    background-color: #006eff !important;
  }

  .detailBoxCon {
    min-height: 300px;

    .detailBoxC {
      border-bottom: 1px solid #eaeaea !important;
      padding: 20px 0 !important;

      h2 {
        font-size: 14px;
        font-weight: 600;
        color: #000;
        margin-bottom: 12px;
      }

      .detailBoxCen {
        p {
          margin-bottom: 20px;
          font-size: 12px;

          span:nth-child(1) {
            color: #888;
            display: inline-block;
            width: 46px;
          }
        }
      }
    }

    .detailBoxConFive {
      border-bottom: 0 !important;
    }
  }

</style>

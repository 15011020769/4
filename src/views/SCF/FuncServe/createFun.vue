<template>
  <div>
    <div class="topCreateFun">
      <span class="el-icon-back" @click="backFunlist"></span>
      <span class="createFunTit">创建函数</span>
      <span class="docRight">
        <a href="#">
          命令行工具创建函数
          <span class="el-icon-share"></span>
        </a>
        <a href="#">
          VS Code创建函数
          <span class="el-icon-share"></span>
        </a>
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
              <el-option label="Python2.7" value="python1"></el-option>
              <el-option label="Python3.6" value="python2"></el-option>
              <el-option label="Nodejs6.10" value="node"></el-option>
              <el-option label="PHP5" value="php1"></el-option>
              <el-option label="PHP7" value="php2"></el-option>
              <el-option label="Golang1" value="golang"></el-option>
              <el-option label="Java8" value="java"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="创建环境">
            <div class="tabBtn">
              <div
                class="tabBtnBox tabBtnOne"
                :class="clickTab==true?'addBorderColor':''"
                @click="clickTab=true"
              >
                <p>模板函数</p>
                <p>使用示例代码模板创建函数</p>
              </div>
              <div
                class="tabBtnBox tabBtnTwo"
                :class="clickTab==false?'addBorderColor':''"
                @click="clickTab=false"
              >
                <p>空白函数</p>
                <p>使用helloworld示例创建空白函数</p>
              </div>
            </div>
          </el-form-item>
          <div v-if="clickTab">
            <el-form-item label="模板搜索">
              <el-input class="searchIpt" v-model="createFunTable.searchName"></el-input>
              <el-button class="el-icon-search"  @click="doFilter"></el-button>
            </el-form-item>
            <div class="allFunList">
              <el-row>
                <el-col :span="8" v-for="(item,index) in tableDataBegin1" :key="index">
                  <div
                    class="allFunListBoxCon"
                    :class="isactive==index ?'addBorderCla':''"
                    @click="mouseHandel(index)"
                  >
                    <div class="funListBoxConTit newClear">
                      <span class="detailName">{{item.name}}</span>
                      <a class="lookDetail" @click="lookFunDetails(index)">查看详情</a>
                      <el-dialog
                        title="模板详情"
                        :visible.sync="dialogVisible"
                        width="30%"
                        :before-close="handleClose"
                        >
                        <div class="detailBoxCon">
                          <div class="detailBoxConOne detailBoxC">
                            <h2>基础信息</h2>
                          </div>
                          <div class="detailBoxConOne detailBoxC">
                            <h2>输入参数</h2>
                          </div>
                          <div class="detailBoxConOne detailBoxC">
                            <h2>输出参数</h2>
                          </div>
                          <div class="detailBoxConOne detailBoxC">
                            <h2>注意事项</h2>
                          </div>
                          <div class="detailBoxConOne detailBoxC">
                            <h2>模板函数下载地址</h2>
                          </div>
                        </div>
                        <span slot="footer" class="dialog-footer">
                          <el-button @click="dialogVisible = false">关闭</el-button>
                          <!-- <el-button type="primary" @click="">提交</el-button> -->
                        </span>
                      </el-dialog>
                    </div>
                    <div class="funListBoxConP">
                      <p class="funListLangu">
                        <span>语言</span>
                        <span>{{item.funListLangu}}</span>
                      </p>
                      <p class="funListDesc">
                        <span>描述</span>
                        <span>{{item.funListDesc}}</span>
                      </p>
                      <p class="funListTags">
                        <span>标签</span>
                        <span>{{item.funListTags}}</span>
                      </p>
                      <p class="funListpublish">
                        <span>部署</span>
                        <span>{{item.funListpublish}}次</span>
                      </p>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
            <div class="tabListPage">
              <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[6, 9, 12, 15]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalItems">
              </el-pagination>
            </div>
          </div>
        </el-form>
      </div>

      <el-button class="nextStep" @click="nextStep">下一步</el-button>
    </div>
  </div>
</template>
<script>

export default {
  data() {
    return {
      index: "",
      active: 0,
      showHide: false,
      funName: "",
      createFunTable: {
        funName: "",
        modelNameSpace: "",
        runMoment:"Python2.7",
        searchName: ""
      },
      clickTab: true,
      tableDataBegin: [
        {
          name: "函数1",
          funListLangu: "456",
          funListDesc: "789",
          funListTags: "123",
          funListpublish: "456"
        },
        {
          name: "函数2",
          funListLangu: "456",
          funListDesc: "789",
          funListTags: "123",
          funListpublish: "456"
        },
        {
          name: "函数3",
          funListLangu: "456",
          funListDesc: "789",
          funListTags: "123",
          funListpublish: "456"
        },
        {
          name: "函数3",
          funListLangu: "456",
          funListDesc: "789",
          funListTags: "123",
          funListpublish: "456"
        },
        {
          name: "函数3",
          funListLangu: "456",
          funListDesc: "789",
          funListTags: "123",
          funListpublish: "456"
        },
        {
          name: "函数4",
          funListLangu: "456",
          funListDesc: "789",
          funListTags: "123",
          funListpublish: "456"
        },
        {
          name: "函数3",
          funListLangu: "456",
          funListDesc: "789",
          funListTags: "123",
          funListpublish: "456"
        },
        {
          name: "函数3",
          funListLangu: "456",
          funListDesc: "789",
          funListTags: "123",
          funListpublish: "456"
        },
        {
          name: "函数3",
          funListLangu: "456",
          funListDesc: "789",
          funListTags: "123",
          funListpublish: "456"
        },
        {
          name: "函数3",
          funListLangu: "456",
          funListDesc: "789",
          funListTags: "123",
          funListpublish: "456"
        },
        {
          name: "函数3",
          funListLangu: "456",
          funListDesc: "789",
          funListTags: "123",
          funListpublish: "456"
        },
        {
          name: "函数3",
          funListLangu: "456",
          funListDesc: "789",
          funListTags: "123",
          funListpublish: "456"
        },
        {
          name: "函数3",
          funListLangu: "456",
          funListDesc: "789",
          funListTags: "123",
          funListpublish: "456"
        }
      ],
      isactive: -1,
      currentPage: 1,
      pageSize: 6,
      totalItems: 0,
      allData: [],
      // tableDataBegin: [],
      tableDataName: "",
      tableDataEnd: [],
      filterTableDataEnd: [],
      flag: false,
      dialogVisible:false
    };
  },
  computed: {
    // 模糊搜索
  },
  created() {
    this.getData();
  },
  methods: {
    backFunlist() {
      this.$router.push({
        path: "/FuncServe"
      });
    },
    mouseHandel(index) {
      console.log(index);
      this.isactive = index;
    },
    //搜索
    doFilter() {
      //alert(1)
      this.tableDataBegin = this.allData;
      this.tableDataEnd = []
        //每次手动将数据置空,因为会出现多次点击搜索情况
      this.filterTableDataEnd = [];
      console.log(this.tableDataBegin)
      this.tableDataBegin.forEach((val, index) => {
        console.log(val)
        if (val.name) {
          if (val.name.indexOf(this.createFunTable.searchName) == 0 ) {
            this.filterTableDataEnd.push(val);
            this.tableDataBegin1 = this.filterTableDataEnd.slice((this.currentPage-1)*this.pageSize,this.currentPage*this.pageSize);
            console.log(this.tableDataBegin1)
            // this.tableDataBegin1 = this.filterTableDataEnd.slice((this.currentPage-1)*this.pageSize,this.currentPage*this.pageSize);
            // console.log(this.tableDataBegin1)
          } else {
            this.filterTableDataEnd.push();
            this.tableDataBegin1 = this.filterTableDataEnd;
            // this.tableDataBegin1 = this.tableDataBegin.slice((this.currentPage-1)*this.pageSize,this.currentPage*this.pageSize);
          }
        };
      });
      //页面数据改变重新统计数据数量和当前页
      this.currentPage = 1
      this.totalItems = this.filterTableDataEnd.length
        //渲染表格,根据值
      this.currentChangePage(this.filterTableDataEnd);

      //页面初始化数据需要判断是否检索过
      this.flag = true;
    },
    // 分页开始
    getData() {
      //this.$axios.post('', {}).then((res) => {
        // console.log(res.data.tableData);
        //this.tableDataBegin = res.data.tableData;
        this.allData = this.tableDataBegin;
        this.tableDataBegin1 = this.tableDataBegin.slice((this.currentPage-1)*this.pageSize,this.currentPage*this.pageSize);
        //console.log(this.tableDataBegin.length,typeof(this.tableDataBegin))
        // 将数据的长度赋值给totalItems
        this.totalItems = this.tableDataBegin.length;
        if (this.totalItems > this.pageSize) {
          for (let index = 0; index < this.pageSize; index++) {
            this.tableDataEnd.push(this.tableDataBegin[index]);
          }
        } else {
          this.tableDataEnd = this.tableDataBegin;
        }
      //})

    },
    handleSizeChange(val) {
      //console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.tableDataBegin1 = this.tableDataBegin.slice((this.currentPage-1)*this.pageSize,this.currentPage*this.pageSize);
      this.handleCurrentChange(this.currentPage);
    },
    handleCurrentChange(val) {
      //console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.tableDataBegin1 = this.tableDataBegin.slice((this.currentPage-1)*this.pageSize,this.currentPage*this.pageSize);
      this.tableDataBegin1 = this.filterTableDataEnd.slice((this.currentPage-1)*this.pageSize,this.currentPage*this.pageSize);
      //需要判断是否检索
      if (!this.flag) {
        this.currentChangePage(this.tableDataEnd)
      } else {
        this.currentChangePage(this.filterTableDataEnd)
      }
    }, //组件自带监控当前页码
    currentChangePage(list) {
      let from = (this.currentPage - 1) * this.pageSize;
      let to = this.currentPage * this.pageSize;
      this.tableDataEnd = [];
      for (; from < to; from++) {
        if (list[from]) {
          this.tableDataEnd.push(list[from]);
        }
      }
    },
    nextStep(){
      window.sessionStorage.setItem("funNameSess", this.createFunTable.funName);
      window.sessionStorage.setItem("runMoent", this.createFunTable.runMoment);
      if(this.createFunTable.funName==''){
        alert("函数名不能为空");
        return false;
      }
      this.$router.push({
        path: "/createFunStep"
      });
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    lookFunDetails(detailIndex){
      this.dialogVisible=true;
    } 
  }
};
</script>
<style lang="scss" scoped>
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
      input:focus + .el-icon-search {
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
      margin-bottom:20px;
      .funListBoxConTit {
        margin-bottom: 20px;
        span:nth-child(1).detailName {
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
.mainContent .mainContForm .searchIpt input:focus + .el-icon-search {
  border: 1px solid #006eff;
}
.stepOneTopTit{
  line-height:32px;
  width:100%;
  margin-bottom:15px;
  span:nth-child(1){
    width:30px;
    float:left;
    height:30px;
    line-height:30px;
    text-align:center;
    background-color:#006eff;
    color:#fff;
    margin-right:12px;
    border-radius: 100%;
  }
  span:nth-child(2){
    float:left;
    color:#000;
    margin-right:35px;
    font-weight:600;
    font-size:14px;
  }
  span:nth-child(3){
    font-size:14px;
    color:#888;
    float:left;
    margin-right:35px;
  }
  span:nth-child(4){
    width:30px;
    float:left;
    height:30px;
    line-height:30px;
    text-align:center;
    border:1px solid #888;
    color:#888;
    border-radius: 100%;
    margin-right:12px;
  }
  span:nth-child(5){
    float:left;
    color:#888;
    margin-right:40px;
    font-weight:600;
    font-size:14px;
  }
}
.nextStep{
  margin-top:12px!important;
  color:#fff!important;
  background-color:#006eff!important;
}
.detailBoxCon{
  min-height:300px;
}
.detailBoxC{
  border-bottom:1px solid #eaeaea;
  padding:20px 0;
  h2{
    font-weight:600;
    font-size:14px;
    color:#000;
    margin-bottom:12px;
  }
}
</style>
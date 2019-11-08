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
      <el-steps :active="active" finish-status="success" class="stepTip">
        <el-step title="基础信息" class="stepTipOne"></el-step>
        <el-step title="函数配置" class="stepTipTwo"></el-step>
      </el-steps>
      <div class="mainContForm">
        <el-form :model="createFunTable" label-width="80px">
          <el-form-item label="函数名称" :required="true">
            <el-input class="funNameIpt" v-model="createFunTable.funName"></el-input>
            <p class="tipCon">1. 最多60个字符，最少2个字符</p>
            <p class="tipCon">2. 字母开头，支持 a-z，A-Z，0-9，-，_，且需要以数字或字母结尾</p>
          </el-form-item>
          <el-form-item label="运行环境">
            <el-select v-model="runMoment">
              <el-option label="北京" value="beijing"></el-option>
              <el-option label="台北" value="taibei"></el-option>
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
              <el-button class="el-icon-search"></el-button>
            </el-form-item>
            <div class="allFunList">
              <el-row>
                <el-col :span="8" v-for="(item,index) in allFunListBox" :key="index">
                  <div
                    class="allFunListBoxCon"
                    :class="isactive==index ?'addBorderCla':''"
                    @click="mouseHandel(index)"
                  >
                    <div class="funListBoxConTit newClear">
                      <span>{{item.name}}</span>
                      <a class="lookDetail">查看详情</a>
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
          </div>
        </el-form>
      </div>

      <el-button style="margin-top: 12px;" @click="next">下一步</el-button>
    </div>
  </div>
</template>
<script>
import SCF_LIST from "@/constants";
export default {
  data() {
    return {
      index: "",
      active: 0,
      showHide: false,
      funName: "",
      runMoment: "",
      createFunTable: {
        funName: "",
        modelNameSpace: "",
        searchName: ""
      },
      clickTab: true,
      allFunListBox: [
        {
          name: "123",
          funListLangu: "456",
          funListDesc: "789",
          funListTags: "123",
          funListpublish: "456"
        },
        {
          name: "123",
          funListLangu: "456",
          funListDesc: "789",
          funListTags: "123",
          funListpublish: "456"
        },
        {
          name: "123",
          funListLangu: "456",
          funListDesc: "789",
          funListTags: "123",
          funListpublish: "456"
        }
      ],
      isactive: -1
    };
  },
  computed: {
    // 模糊搜索
  },
  created() {},
  methods: {
    backFunlist() {
      this.$router.push({
        path: "/FuncServe"
      });
    },
    next() {
      if (this.active++ > 2) this.active = 0;
    },
    mouseHandel(index) {
      console.log(index);
      this.isactive = index;
    }
  }
};
</script>
<style lang="scss">
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
      .funListBoxConTit {
        margin-bottom: 20px;
        span:nth-child(1) {
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
</style>
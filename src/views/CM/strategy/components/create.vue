<template>
  <div class="create-wrap">
    <Header title="新增策略" backShow="true"></Header>
    <div class="create-main">
      <div class="box">
        <p class="rowCont">
          <span>策略名称</span>
          <el-input
            style="width:330px;margin:0"
            v-model="formInline.strategy_name"
            placeholder="1-20个中英文字符或下划线"
          ></el-input>
        </p>
        <p class="rowCont">
          <span style="margin-bottom:110px">备注</span>
          <el-input
            style="width:330px;"
            :autosize="{ minRows: 5, maxRows: 2}"
            type="textarea"
            placeholder="1-100个中英文字符或下划线"
            v-model="formInline.textarea"
            maxlength="100"
            show-word-limit
          ></el-input>
        </p>

        <p class="rowCont">
          <span>策略类型</span>
          <el-select v-model="formInline.strategy" style="width:100px;">
            <el-option
              v-for="(item,index) in formInline.strategy_kind"
              :key="index"
              :label="item.name"
              :value="item.value"
              label-width="40px"
            ></el-option>
          </el-select>
        </p>
        <p class="rowCont">
          <span>所属项目</span>
          <el-select v-model="formInline.projectName" style="width:100px;">
            <el-option
              v-for="(item,index) in formInline.project"
              :key="index"
              :label="item.name"
              :value="item.value"
              label-width="40px"
            ></el-option>
          </el-select>
        </p>
        <div class="qudao">
          <span style="line-height: 30px;">告警对象</span>
          <div class="objectContent">
            <p>
              <el-radio v-model="radio" label="1" @change="all">全部对象</el-radio>
            </p>
            <p>
              <el-radio v-model="radio" label="2" @change="some">选择部分对象</el-radio>
            </p>
            <p>
              <el-radio v-model="radio" label="3" @change="group">选择实例组</el-radio>
              <a>新建实例组</a>
            </p>
          </div>
        </div>
        <div class style="display: flex;">
          <span>触发条件</span>
          <div class="chufaContent">
            <div>
              <el-radio v-model="radioChufa" label="1" @change="template">触发条件模板</el-radio>
              <a>新增触发条件模板</a>
              <div class="tip" v-show="errorTip1==true?true:false">请至少配置1项触发条件</div>
              <br />
              <div class="content">
                <p>
                  <el-select v-model="formInline.projectName" style="width:150px;">
                    <el-option
                      v-for="(item,index) in formInline.project"
                      :key="index"
                      :label="item.name"
                      :value="item.value"
                      label-width="40px"
                    ></el-option>
                  </el-select>
                  <a>刷新</a>
                </p>
                <p>
                  <el-checkbox v-model="checkedGaojing" disabled>指标告警</el-checkbox>
                </p>
                <p>
                  <i>满足</i>
                  <el-select v-model="formInline.projectName" style="width:90px;margin:0 5px;">
                    <el-option
                      v-for="(item,index) in formInline.project"
                      :key="index"
                      :label="item.name"
                      :value="item.value"
                      label-width="40px"
                    ></el-option>
                  </el-select>
                  <i>条件时，触发告警</i>
                </p>
                <p>
                  if
                  <el-select v-model="formInline.projectName" style="width:150px;">
                    <el-option
                      v-for="(item,index) in formInline.project"
                      :key="index"
                      :label="item.name"
                      :value="item.value"
                      label-width="40px"
                    ></el-option>
                  </el-select>
                  <el-select v-model="formInline.projectName" style="width:130px;">
                    <el-option
                      v-for="(item,index) in formInline.project"
                      :key="index"
                      :label="item.name"
                      :value="item.value"
                      label-width="40px"
                    ></el-option>
                  </el-select>
                  <el-select v-model="formInline.projectName" style="width:60px;">
                    <el-option
                      v-for="(item,index) in formInline.project"
                      :key="index"
                      :label="item.name"
                      :value="item.value"
                      label-width="40px"
                    ></el-option>
                  </el-select>
  
                  <input style="height: 30px;line-height: 30px;width:85px;border: 1px solid #dcdfe6;" value="0" min="0" max="100" type="number"/>
                  <span>%</span>
                  <el-select v-model="formInline.projectName" style="width:110px;">
                    <el-option
                      v-for="(item,index) in formInline.project"
                      :key="index"
                      :label="item.name"
                      :value="item.value"
                      label-width="40px"
                    ></el-option>
                  </el-select>
                  then
                  <el-select v-model="formInline.projectName" style="width:150px;">
                    <el-option
                      v-for="(item,index) in formInline.project"
                      :key="index"
                      :label="item.name"
                      :value="item.value"
                      label-width="40px"
                    ></el-option>
                  </el-select>
                  <i class="el-icon-info" style="color:#888; margin:0 5px;"></i>
                </p>
              </div>
            </div>
            <div>
              <el-radio v-model="radioChufa" label="2" @change="config">配置触发条件</el-radio>
              <div class="tip" v-show="errorTip2==true?true:false">请至少配置1项触发条件</div>
              <div class="content"></div>
            </div>
          </div>
        </div>
        <div class>
          <span>告警渠道</span>
          <div class="qudaoContent"></div>
        </div>
        <div class>
          <span>接口回调</span>

          <el-select v-model="formInline.apiStr" style="width:100px;">
            <el-option
              v-for="(item,index) in formInline.apiArr"
              :key="index"
              :label="item.name"
              :value="item.value"
              label-width="40px"
            ></el-option>
          </el-select>
          <el-select
            filterable
            v-model="formInline.group"
            style="width:250px;margin-left:10px;margin-right:20px;"
          >
            <el-option
              v-for="(item,index) in formInline.kind_list"
              :key="index"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class>
          <p>
            <span>（选填）</span>
            <b style="font-weight:400">填写公网可访问到的url作为回调接口地址(域名或IP[:端口][/path])，云监控将及时把告警信息推送到该地址。</b>
          </p>
          <div class="overview-main">
            <div class="explain">
              <p>
                回调域名通过验证后生效，请于Response Body中返回以下code。
                <i class="el-icon-info" style="margin:0 5px;"></i>
              </p>
              <p>
                <b style="font-size:16px">y46vg1ma</b>
              </p>
            </div>
          </div>
        </div>
        <div class="foot">
          <el-button type="primary" size="small" @click="save">完成</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Header from "@/components/public/Head";
export default {
  data() {
    return {
      errorTip1: false, //触发条件模板错误提示
      errorTip2: true, //配置触发条件错误提示
      checkedGaojing: false, //指示告警

      radio: "1", //选择告警对象类型
      radioChufa: "1", //触发条件单选
      input: "",
      input1: "",
      tableData: [],
      options: [],
      values: "",
      formInline: {
        apiStr: "http", //接口回调
        apiArr: [
          {
            value: 0,
            name: "http"
          },
          {
            value: 1,
            name: "https"
          }
        ], //接口回调数据
        strategy_name: "", //策略名称
        textarea: "", //备注
        strategy: "云服务器-基础监控",
        strategy_kind: [
          {
            value: 0,
            name: "云服务器-基础监控"
          }
        ], //策略类型
        alarm: "", //策略类型
        projectName: "默认项目",
        project: [
          {
            value: 0,
            name: "默认项目"
          }
        ]
      },
      allFlag: true
    };
  },
  directives: {
    trigger: {
      inserted(el, binging) {
        el.click();
        $(el).trigger("click");
      }
    }
  },
  components: {
    Header
  },
  methods: {
    all() {
      //全部对象
      //   alert("all");
    },
    some() {
      //部分对象
      //   alert("some");
    },
    group() {
      //实例对象组
      //   alert("group");
    },
    //确定
    save() {
      this.$router.push({
        path: "/strategy"
      });
    }
  },
  destroyed() {}
};
</script>
<style lang="scss" scoped>
.create-wrap >>> .el-button,
.create-wrap >>> .el-input__inner {
  height: 30px;
  border-radius: 0;
  padding-top: 0;
  line-height: 30px;
  font-size: 12px;
}
.create-wrap >>> .el-radio__input.is-checked + .el-radio__label {
  color: rgb(92, 91, 91);
}
.create-main {
  padding: 20px 35px;
}
.create-wrap >>> .box a {
  padding: 3px 5px;
  margin-left: 20px;
  color: #006eff;
}
.create-wrap >>> .box a:hover {
  background: rgb(228, 227, 227);
  cursor: pointer;
}

.create-wrap >>> p {
  line-height: 30px;
  margin: 4px 2px;
}

.box {
  width: 100%;
  height: 100%;
  color: #888;
  background: white;
  padding: 20px;
  font-size: 12px;
  box-shadow: 1px 1px 5px #cccccc;
  span {
    line-height: 30px;
  }
  p.rowCont {
    padding: 10px 0;
    span {
      display: inline-block;
      width: 70px;
    }
  }
  .chufaContent {
    width: 100%;
    padding: 0 10px;
    > div {
      margin: 10px 0;
      padding: 10px 20px;
      background-color: #f2f2f2;
      line-height: 30px;
      .content {
        margin-top: 10px;
        padding: 10px;
        p {
        }
      }
    }
  }
  .qudao {
    display: flex;
    .objectContent {
      p {
        line-height: 30px;
      }
    }
  }
  input {
    margin: 0;
  }
  > div {
    margin-top: 20px;
    span {
      display: inline-block;
      width: 80px;
    }
  }

  .table {
    margin-top: 20px;
  }
  .foot {
    // margin: 10px;
    padding-top: 20px;
    border-top: 1px solid #ccc;
  }
}
.rowCont >>> .el-input {
  width: 200px;
  height: 30px;
}
.overview-main {
  padding: 20px;
  box-sizing: border-box;
  margin-left: 60px;
  .progress {
    padding: 10px 0;
    box-sizing: border-box;

    p {
      margin-bottom: 10px;
      font-weight: bold;
      line-height: 50px;
    }
  }

  .main-box {
    display: flex;
  }

  .left {
    flex: 1;
    margin-right: 20px;
  }
  .right {
    width: 30%;
  }
  .head {
    display: flex;
    align-items: center;

    h3 {
      margin-right: 20px;
    }
  }
  .box {
    border: 1px solid #c07400;
    background-color: #ffd18b;
    box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
    padding: 20px;
    box-sizing: border-box;
    margin-top: 20px;
  }

  .explain {
    width: 570px;
    padding: 10px 30px 10px 20px;
    vertical-align: middle;
    color: #c07400;
    border: 1px solid #ffd18b;
    background: #fff4e3;

    p {
      font-size: 12px;
      line-height: 40px;
    }
  }
}
.create-wrap >>> .tip {
  width: 100%;
  padding: 8px 20px;
  color: #b43537;
  border: 1px solid #f6b5b5;
  background-color: #fcecec;
  margin-bottom: 20px;
}
.create-wrap >>> .el-checkbox__input.is-disabled + span.el-checkbox__label {
  color: #606266;
}
.create-wrap >>> .el-checkbox__input.is-disabled .el-checkbox__inner {
  background-color: #ddd;
  border-color: #bbb;
}
.create-wrap >>> i {
  font-style: normal;
  color: rgb(0, 0, 0);
  font-size: 14px;
}
</style>
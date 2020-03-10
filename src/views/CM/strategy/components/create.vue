<template>
  <div class="create-wrap">
    <Header title="新增策略" :backShow="backShow"></Header>
    <div class="create-main">
      <div class="box">
        <p class="rowCont policy-name">
          <span>策略名称</span>
          <el-input
            style="width:330px;margin:0"
            v-model="formInline.strategy_name"
            placeholder="1-20个中英文字符或下划线"
          ></el-input>
        </p>
        <p class="rowCont remarks">
          <span style="margin-bottom:110px">备注</span>
          <el-input
            style="width:330px;"
            :autosize="{ minRows: 5, maxRows: 2 }"
            type="textarea"
            placeholder="1-100个中英文字符或下划线"
            v-model="formInline.textarea"
            maxlength="100"
            show-word-limit
          ></el-input>
        </p>

        <p class="rowCont policy-type">
          <span>策略类型</span>
          <grouping-type @handleChangeChild="showMsgfromChild"></grouping-type>
        </p>
        <p class="rowCont project">
          <span>所属项目</span>
          <el-select v-model="formInline.projectName" style="width:100px;">
            <el-option
              v-for="(item, index) in formInline.project"
              :key="index"
              :label="item.name"
              :value="item.value"
              label-width="40px"
            ></el-option>
          </el-select>
        </p>
        <div class="qudao alarm-object">
          <span>告警对象</span>
          <div class="objectContent">
            <p>
              <el-radio v-model="radio" label="1" @change="all"
                >全部对象</el-radio
              >
            </p>
            <p>
              <el-radio v-model="radio" label="2" @change="some"
                >选择部分对象</el-radio
              >
            </p>
            <p>
              <el-radio v-model="radio" label="3" @change="group"
                >选择实例组</el-radio
              >
              <a href="javascript:;" class="new-model">新建实例组</a>
            </p>
            <!-- <Transfer :multipleSelection="tableData"/> -->
            <Transfer
              v-show="showQudao1 == true ? true : false"
              :multipleSelection="options"
            />
            <p
              v-show="showQudao2 == true ? true : false"
              class="alarm-object-model"
            >
              <el-select v-model="formInline.projectName" style="width:150px;">
                <el-option
                  v-for="(item, index) in formInline.project"
                  :key="index"
                  :label="item.name"
                  :value="item.value"
                  label-width="40px"
                ></el-option>
              </el-select>
              <a href="javascript:;" style="margin-left:15px;">刷新</a>
            </p>
          </div>
        </div>
        <div class="trigger-condition">
          <span>触发条件</span>
          <div class="chufaContent">
            <div>
              <el-radio v-model="radioChufa" label="1" @change="chufaTemplate"
                >触发条件模板</el-radio
              >
              <a>新增触发条件模板</a>
              <div class="tip" v-show="errorTip1 == true ? true : false">
                请至少选中1项触发条件
              </div>
              <div class="content" v-show="showChufa1 == true ? true : false">
                <p>
                  <el-select
                    v-model="formInline.projectName"
                    style="width:150px;"
                  >
                    <el-option
                      v-for="(item, index) in formInline.project"
                      :key="index"
                      :label="item.name"
                      :value="item.value"
                      label-width="40px"
                    ></el-option>
                  </el-select>
                  <a>刷新</a>
                </p>
                <div>
                  <p>
                    <el-checkbox v-model="checkedZhibiao" disabled
                      >指标告警</el-checkbox
                    >
                  </p>
                  <p>
                    <i>满足</i>
                    <el-select
                      v-model="formInline.projectName"
                      style="width:90px;margin:0 5px;"
                    >
                      <el-option
                        v-for="(item, index) in formInline.project"
                        :key="index"
                        :label="item.name"
                        :value="item.value"
                        label-width="40px"
                      ></el-option>
                    </el-select>
                    <i>条件时，触发告警</i>
                  </p>
                  <!-- 在这里进行便利，添加 -->
                  <ul>
                    <li
                      style="display:flex;align-items: center;cursor: pointer;"
                    >
                      <p>
                        if&nbsp;
                        <el-select
                          v-model="formInline.projectName"
                          style="width:150px;"
                        >
                          <el-option
                            v-for="(item, index) in formInline.project"
                            :key="index"
                            :label="item.name"
                            :value="item.value"
                            label-width="40px"
                          ></el-option> </el-select
                        >&nbsp;
                        <el-select
                          v-model="formInline.projectName"
                          style="width:130px;"
                        >
                          <el-option
                            v-for="(item, index) in formInline.project"
                            :key="index"
                            :label="item.name"
                            :value="item.value"
                            label-width="40px"
                          ></el-option> </el-select
                        >&nbsp;
                        <el-select
                          v-model="formInline.projectName"
                          style="width:60px;"
                        >
                          <el-option
                            v-for="(item, index) in formInline.project"
                            :key="index"
                            :label="item.name"
                            :value="item.value"
                            label-width="40px"
                          ></el-option> </el-select
                        >&nbsp;
                        <input
                          placeholder="指标"
                          style="height: 30px;line-height: 30px;padding-left:10px;width:85px;border: 1px solid #dcdfe6;"
                          value="0"
                          min="0"
                          max="100"
                          type="number"
                        />
                        <b
                          style="padding:0 10px;display:inline-block;height: 30px;line-height: 30px;width:52px;border: 1px solid #dcdfe6;"
                          >%</b
                        >
                        &nbsp;
                        <el-select
                          v-model="formInline.projectName"
                          style="width:110px;"
                        >
                          <el-option
                            v-for="(item, index) in formInline.project"
                            :key="index"
                            :label="item.name"
                            :value="item.value"
                            label-width="40px"
                          ></el-option> </el-select
                        >&nbsp; then&nbsp;
                        <el-select
                          v-model="formInline.projectName"
                          style="width:150px;"
                        >
                          <el-option
                            v-for="(item, index) in formInline.project"
                            :key="index"
                            :label="item.name"
                            :value="item.value"
                            label-width="40px"
                          ></el-option>
                        </el-select>
                        <i
                          class="el-icon-info"
                          style="color:#888; margin:0 5px;"
                        ></i>
                      </p>
                      <i
                        class="el-icon-error"
                        style="color:#888; margin:0 5px;"
                        @click="delZhibiao"
                      ></i>
                    </li>
                    <a @click="addZhibiao">添加</a>
                  </ul>
                </div>
                <div>
                  <p>
                    <el-checkbox v-model="checkedGaojing" disabled>
                      事件告警
                      <i
                        class="el-icon-info"
                        style="color:#888; margin:0 5px;"
                      ></i>
                    </el-checkbox>
                  </p>
                  <!-- 在这里进行便利，添加 -->
                  <ul>
                    <li
                      style="display:flex;align-items: center;cursor: pointer;"
                    >
                      <p>
                        <el-select
                          v-model="formInline.projectName"
                          style="width:180px;margin:0 5px;"
                        >
                          <el-option
                            v-for="(item, index) in formInline.project"
                            :key="index"
                            :label="item.name"
                            :value="item.value"
                            label-width="40px"
                          ></el-option>
                        </el-select>
                      </p>
                      <i
                        class="el-icon-error"
                        style="color:#888; margin:0 5px;"
                        @click="delShijian"
                      ></i>
                    </li>
                    <a @click="addShijian">添加</a>
                  </ul>
                </div>
              </div>
            </div>
            <div>
              <el-radio v-model="radioChufa" label="2" @change="config"
                >配置触发条件</el-radio
              >
              <div class="tip" v-show="errorTip2 == true ? true : false">
                请至少配置1项触发条件
              </div>
              <div class="content" v-show="showChufa2 == true ? true : false">
                <p>
                  <el-select
                    v-model="formInline.projectName"
                    style="width:150px;"
                  >
                    <el-option
                      v-for="(item, index) in formInline.project"
                      :key="index"
                      :label="item.name"
                      :value="item.value"
                      label-width="40px"
                    ></el-option>
                  </el-select>
                  <a>刷新</a>
                </p>
                <div>
                  <p>
                    <el-checkbox v-model="checkedZhibiao">指标告警</el-checkbox>
                  </p>
                  <p>
                    <i>满足</i>
                    <el-select
                      v-model="formInline.projectName"
                      style="width:90px;margin:0 5px;"
                    >
                      <el-option
                        v-for="(item, index) in formInline.project"
                        :key="index"
                        :label="item.name"
                        :value="item.value"
                        label-width="40px"
                      ></el-option>
                    </el-select>
                    <i>条件时，触发告警</i>
                  </p>
                  <!-- 在这里进行便利，添加 -->
                  <ul>
                    <li
                      style="display:flex;align-items: center;cursor: pointer;"
                    >
                      <p>
                        if&nbsp;
                        <el-select
                          v-model="formInline.projectName"
                          style="width:150px;"
                        >
                          <el-option
                            v-for="(item, index) in formInline.project"
                            :key="index"
                            :label="item.name"
                            :value="item.value"
                            label-width="40px"
                          ></el-option> </el-select
                        >&nbsp;
                        <el-select
                          v-model="formInline.projectName"
                          style="width:130px;"
                        >
                          <el-option
                            v-for="(item, index) in formInline.project"
                            :key="index"
                            :label="item.name"
                            :value="item.value"
                            label-width="40px"
                          ></el-option> </el-select
                        >&nbsp;
                        <el-select
                          v-model="formInline.projectName"
                          style="width:60px;"
                        >
                          <el-option
                            v-for="(item, index) in formInline.project"
                            :key="index"
                            :label="item.name"
                            :value="item.value"
                            label-width="40px"
                          ></el-option> </el-select
                        >&nbsp;
                        <input
                          placeholder="指标"
                          style="height: 30px;line-height: 30px;padding:0 10px;width:85px;border: 1px solid #dcdfe6;"
                          value="0"
                          min="0"
                          max="100"
                          type="number"
                        />
                        <b
                          style="padding:0 10px;display:inline-block;height: 30px;line-height: 30px;width:52px;border: 1px solid #dcdfe6;"
                          >%</b
                        >
                        &nbsp;
                        <el-select
                          v-model="formInline.projectName"
                          style="width:110px;"
                        >
                          <el-option
                            v-for="(item, index) in formInline.project"
                            :key="index"
                            :label="item.name"
                            :value="item.value"
                            label-width="40px"
                          ></el-option> </el-select
                        >&nbsp; then&nbsp;
                        <el-select
                          v-model="formInline.projectName"
                          style="width:150px;"
                        >
                          <el-option
                            v-for="(item, index) in formInline.project"
                            :key="index"
                            :label="item.name"
                            :value="item.value"
                            label-width="40px"
                          ></el-option>
                        </el-select>
                        <i
                          class="el-icon-info"
                          style="color:#888; margin:0 5px;"
                        ></i>
                      </p>
                      <i
                        class="el-icon-error"
                        style="color:#888; margin:0 5px;"
                        @click="delZhibiao"
                      ></i>
                    </li>
                    <a @click="addZhibiao">添加</a>
                  </ul>
                </div>
                <div>
                  <p>
                    <el-checkbox v-model="checkedGaojing">
                      事件告警
                      <i
                        class="el-icon-info"
                        style="color:#888; margin:0 5px;"
                      ></i>
                    </el-checkbox>
                  </p>
                  <!-- 在这里进行便利，添加 -->
                  <ul>
                    <li
                      style="display:flex;align-items: center;cursor: pointer;"
                    >
                      <p>
                        <el-select
                          v-model="formInline.projectName"
                          style="width:180px;margin:0 5px;"
                        >
                          <el-option
                            v-for="(item, index) in formInline.project"
                            :key="index"
                            :label="item.name"
                            :value="item.value"
                            label-width="40px"
                          ></el-option>
                        </el-select>
                      </p>
                      <i
                        class="el-icon-error"
                        style="color:#888; margin:0 5px;"
                        @click="delShijian"
                      ></i>
                    </li>
                    <a @click="addShijian">添加</a>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="alarm-channel">
          <span>告警渠道</span>
          <div class="qudaoContent">
            <p class="receiving-objects">
              <span>接收对象</span>
              <el-select v-model="formInline.jieshou" style="width:100px;">
                <el-option
                  v-for="(item, index) in formInline.jieshouArr"
                  :key="index"
                  :label="item.name"
                  :value="item.value"
                  label-width="40px"
                ></el-option>
              </el-select>
              <el-row class="seek" style="display:flex;margin:0 10px;">
                <el-input v-model="triggerInput" placeholder></el-input>
                <el-button
                  icon="el-icon-search"
                  style="margin-left:-1px;"
                ></el-button>
              </el-row>
              <a>新增接收组</a>
              <!-- <a>新增接收人</a> -->
            </p>
            <div>
              <el-table
                :data="tableData"
                style="width: 100%"
                height="430"
                :default-sort="{ prop: 'changeData', order: 'descending' }"
              >
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column
                  prop="userGroupName"
                  label="用户组名"
                ></el-table-column>
                <el-table-column
                  prop="userName"
                  label="用户名"
                ></el-table-column>
              </el-table>
            </div>

            <p class="effective-period">
              <span>有效时段</span>
              <el-time-picker
                style="width:150px"
                v-model="value1"
                :picker-options="{
                  selectableRange: '18:30:00 - 20:30:00'
                }"
                placeholder="任意时间点"
              ></el-time-picker>
              <i>&nbsp;至&nbsp;</i>
              <el-time-picker
                style="width:150px"
                arrow-control
                v-model="value2"
                :picker-options="{
                  selectableRange: '18:30:00 - 20:30:00'
                }"
                placeholder="任意时间点"
              ></el-time-picker>
            </p>
            <p style="display:flex">
              <span>接收渠道</span>
              <el-checkbox-group v-model="qudaoCheckList">
                <el-checkbox label="邮件"></el-checkbox>
                <el-checkbox label="短信"></el-checkbox>
                <el-checkbox label="微信"></el-checkbox>
              </el-checkbox-group>
            </p>
          </div>
        </div>
        <div class>
          <span>接口回调</span>

          <el-select v-model="formInline.apiStr" style="width:100px;">
            <el-option
              v-for="(item, index) in formInline.apiArr"
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
              v-for="(item, index) in formInline.kind_list"
              :key="index"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class>
          <p>
            <span>（选填）</span>
            <b style="font-weight:400"
              >填写公网可访问到的url作为回调接口地址(域名或IP[:端口][/path])，云监控将及时把告警信息推送到该地址。</b
            >
          </p>
          <div class="overview-main">
            <div class="explain">
              <p>
                回调域名通过验证后生效，请于Response Body中返回以下code。
                <i
                  class="el-icon-info"
                  style="margin:0 5px;color: #c07400;"
                ></i>
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
import Header from "./Head";
import Transfer from "./transfer";
import GroupingType from "@/components/GroupingType";
export default {
  data() {
    return {
      backShow: "true",

      value1: new Date(2020, 1, 10, 18, 40),
      value2: new Date(2020, 1, 10, 18, 40),

      showChufa1: false, //触发条件1显示开关
      showChufa2: true, //触发条件2显示开关

      showQudao1: false, //渠道选择1显示开关
      showQudao2: false, //渠道选择2显示开关

      errorTip1: false, //触发条件模板错误提示
      errorTip2: true, //配置触发条件错误提示
      checkedZhibiao: false, //指示告警

      checkedGaojing: "", //告警
      triggerInput: "", //新增接收

      radio: "1", //选择告警对象类型
      radioChufa: "1", //触发条件单选
      input: "",
      input1: "",
      tableData: [
        {
          userGroupName: "测试勿删",
          userName: "test、test02"
        },
        {
          userGroupName: "勿删",
          userName:
            "测试1、TX测试---李慧、腾讯李慧、測試、test、mytest、test02、test03、test04、test111"
        },
        {
          userGroupName: "可以删除",
          userName: "测试一下"
        }
      ],
      options: [],
      values: "",
      qudaoCheckList: ["邮件", "短信"], //渠道选择
      formInline: {
        jieshou: "接收组",
        jieshouArr: [
          { value: "0", name: "接收组" },
          {
            value: "1",
            name: "接收人"
          }
        ],
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
  components: {
    Header,
    Transfer,
    GroupingType
  },
  methods: {
    all() {
      //全部对象
      //   alert("all");
      this.showQudao1 = false;
      this.showQudao2 = false;
    },
    some() {
      //部分对象
      //   alert("some");
      this.showQudao1 = true;
      this.showQudao2 = false;
    },
    group() {
      //实例对象组
      //   alert("group");
      this.showQudao1 = false;
      this.showQudao2 = true;
    },
    //确定
    save() {
      this.$router.push({
        path: "/strategy"
      });
    },
    chufaTemplate() {
      //触发条件模板
      this.showChufa1 = true;
      this.showChufa2 = false;
    },
    config() {
      //配置触发条件
      this.showChufa1 = false;
      this.showChufa2 = true;
    },
    addZhibiao() {
      //添加触发条件的指标告警
      alert("你要添加此项触发条件的指标告警");
    },
    delZhibiao() {
      //删除触发条件的指标告警
      alert("你要删除此项触发条件的指标告警");
    },
    addShijian() {
      //添加触发条件的事件告警
      alert("你要添加此项触发条件的事件告警");
    },
    delShijian() {
      //删除触发条件的事件告警
      alert("你要删除此项触发条件的事件告警");
    },
    // 策略类型
    showMsgfromChild(val) {
      console.log("val", val);
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
  padding: 0 5px;
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
    display: flex;
    span {
      display: inline-block;
      width: 68px;
    }
    ::v-deep .el-input__inner {
      border-radius: 0px;
    }
  }
  .chufaContent,
  .qudaoContent {
    width: 94%;
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
  .chufaContent {
    padding: 0;
  }
  .qudaoContent {
    background-color: #f2f2f2;
  }
  .qudao {
    display: flex;
    .objectContent {
      p {
        line-height: 30px;
      }
      .new-model {
        margin-left: 15px;
      }
      .alarm-object-model {
        ::v-deep .el-input__inner {
          width: 156px;
          height: 30px;
          border-radius: 0px;
        }
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
.create-wrap {
  .create-main {
    .policy-name {
      ::v-deep .el-input {
        width: 330px;
      }
      ::v-deep .el-input__inner {
        width: 330px;
        height: 30px;
      }
    }
    .remarks {
      ::v-deep .el-textarea__inner {
        width: 330px;
        border-radius: 0px;
      }
    }
    .policy-type {
      display: flex;
      align-items: center;
      line-height: 30px;
    }
    .project {
      ::v-deep .el-input__inner {
        width: 200px;
        height: 30px;
      }
    }
    .alarm-object {
      span {
        width: 68px;
      }
    }
    .trigger-condition {
      display: flex;
      span {
        width: 68px;
        margin-top: 10px;
      }
      ::v-deep .el-input__inner {
        border-radius: 0px;
        height: 30px;
      }
    }
  }
  .alarm-channel {
    display: flex;
    span {
      width: 68px;
    }
    ::v-deep .el-input__inner {
      border-radius: 0px;
      height: 30px;
    }
    ::v-deep .el-button {
      border-radius: 0px;
      height: 30px;
      padding: 0px 10px;
    }
    .qudaoContent {
      padding: 10px;
      .receiving-objects {
        display: flex;
        align-items: center;
      }
    }
  }
}
.effective-period {
  ::v-deep .el-input__icon {
    line-height: 30px;
  }
}
</style>

<template>
  <div class="defaultDetail">
    <Header title="管理告警策略" :backShow="backShow" />
    <el-card class="box-card">
      <div slot="header" class="clearfix" style="width:100%">
        <h3>基本信息</h3>
      </div>
      <ul>
        <li
          style="display:flex;line-height:40px;"
          v-for="(item, index) in listInfo"
          :key="index"
        >
          <span class="textColor">{{ item.name }}</span>
          <p style="margin:0 30px;color:#000">
            <span>{{ item.content }}</span>
            <i
              v-if="item.isEdit"
              style="color:#888;cursor: pointer;"
              class="el-icon-edit"
              @click="editInfo(item)"
            ></i>
          </p>
        </li>
      </ul>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix" style="width:100%;display:flex;">
        <h3>告警触发条件</h3>
        <a @click="editGaoJing">编辑</a>
      </div>
      <div class="box-content">
        <span class="textColor">指标告警（任意）</span>
        <p>CPU利用率 > 0%,持续1分钟，按一天重复警告</p>
        <span class="textColor">事件告警</span>
        <p>磁盘只读，不重复警告</p>
      </div>
    </el-card>
    <el-card class="box-card alarm-object">
      <div slot="header" class="clearfix">
        <h3>告警对象</h3>
        <a @click="editObject">编辑</a>
      </div>
      <div class="box-content">
        <el-row style="margin:10px 5px;padding-top:10px">
          <el-button type="primary">新增对象</el-button>
          <el-button disabled>解除</el-button>
          <el-button>全部解除</el-button>
        </el-row>
      </div>
      <div class="alarm-object-table">
        <el-table
          ref="multipleTable"
          :data="alarmObjectData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection"> </el-table-column>
          <el-table-column label="ID/主机名"> </el-table-column>
          <el-table-column label="状态"> </el-table-column>
          <el-table-column label="网络类型"> </el-table-column>
          <el-table-column label="IP地址"> </el-table-column>
          <el-table-column label="操作"> </el-table-column>
        </el-table>
      </div>
    </el-card>
    <el-card class="box-card alarm-object alarm-receiving-object">
      <div slot="header" class="clearfix">
        <h3>告警接收对象</h3>
      </div>
      <div class="box-content" style="margin-top:20px;">
        <el-row>
          <el-button type="primary">编辑</el-button>
          <el-button disabled>解除</el-button>
        </el-row>
      </div>
      <div class="alarm-object-table">
        <el-table
          ref="multipleTable"
          :data="receivingObjectData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection"> </el-table-column>
          <el-table-column label="ID/主机名"> </el-table-column>
          <el-table-column label="状态"> </el-table-column>
          <el-table-column label="网络类型"> </el-table-column>
          <el-table-column label="IP地址"> </el-table-column>
          <el-table-column label="操作"> </el-table-column>
        </el-table>
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix" style="width:100%;display:flex;">
        <h3>回调接口</h3>
      </div>
      <p class="tip">
        填写公网可访问到的url作为回调接口地址(域名或IP[:端口][/path])，云监控将及时把告警信息推送到该地址。
      </p>
      <div class="box-content" style="line-height: 30px;margin:20px 0;">
        未配置
        <el-tooltip content="Top center" placement="Top" effect="light">
          <i
            style="color:#888;cursor: pointer;"
            class="el-icon-edit"
            @click="callbackEdit"
          ></i>
        </el-tooltip>
      </div>
    </el-card>
    <!-- 修改名称 -->
    <el-dialog
      title="修改告警策略名称"
      :visible.sync="modifyNameDialogVisible"
      width="500px"
      custom-class="tke-dialog"
      class="dialog-box"
    >
      <div>
        <el-input
          size="small"
          placeholder="请输告警策略名称，20字以内"
          v-model="editSearchVal"
          @input="EditTips"
        ></el-input>
        <p v-if="tipsShow">告警策略名称不能为空</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary">确定</el-button>
        <el-button @click="modifyNameDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
    <!-- 修改备注 -->
    <el-dialog
      title="修改触发条件"
      :visible.sync="modifyRemarksDialogVisible"
      width="600px"
      custom-class="tke-dialog"
      class="dialog-box"
    >
      <div class="edit-dialog">
        <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入告警策略备注，100字以内"
          v-model="remarksVal"
        >
        </el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary">确定</el-button>
        <el-button @click="modifyRemarksDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
    <!-- 告警条件编辑 -->
    <el-dialog
      title="修改告警触发条件"
      :visible.sync="dialogEditGaojing"
      width="1024px"
    >
      <div>
        <div class="trigger-condition">
          <span>触发条件</span>
          <div class="chufaContent">
            <div>
              <el-radio v-model="radioChufa" label="1" @change="chufaTemplate"
                >触发条件模板</el-radio
              >
              <a style="margin-left:15px;">新增触发条件模板</a>
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
                    <span>满足</span>
                    <el-select
                      disabled
                      v-model="formInline_one.satisfyVal"
                      style="width:90px;margin:0 5px;"
                    >
                      <el-option
                        v-for="(item, index) in formInline.satisfy"
                        :key="index"
                        :label="item.name"
                        :value="item.value"
                        label-width="40px"
                      ></el-option>
                    </el-select>
                    <span>条件时，触发告警</span>
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
                    <span>满足</span>
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
                    <span>条件时，触发告警</span>
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
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogEditGaojing = false"
          >保 存</el-button
        >
        <el-button @click="dialogEditGaojing = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 告警对象编辑 -->
    <el-dialog title="修改告警对象" :visible.sync="dialogEditObject">
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogEditObject = false"
          >保 存</el-button
        >
        <el-button @click="dialogEditObject = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 回调接口 -->
    <el-dialog
      title="回调接口"
      :visible.sync="callbackInterface"
      width="550px"
      class="callback-dialog-box"
    >
      <div class="callback-interface-box">
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
        <p>
          填写公网可访问到的url作为回调接口地址(域名或IP[:端口][/path])，云监控将及时把告警信息推送到该地址。
        </p>
        <div class="bg-box">
          <p>
            回调域名通过验证后生效，请于Response Body中返回以下code。
            <el-tooltip
              effect="light"
              content="触发验证后推送请求三次，每次3s，累计9s未成功返回即验证超时。"
              placement="top"
              ><i class="el-icon-info"></i>
            </el-tooltip>
          </p>
          <span>c5oqchmd</span>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="callbackInterface = false"
          >保 存</el-button
        >
        <el-button @click="callbackInterface = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Header from "./Head";

export default {
  data() {
    return {
      backShow: true,
      listInfo: [
        {
          name: "策略名称",
          isEdit: true,
          content: "测试"
        },
        {
          name: "策略类型",
          isEdit: false,
          content: "云服务器-基础监控"
        },
        {
          name: "所属项目",
          isEdit: false,
          content: "默认项目"
        },
        {
          name: "最后修改人",
          isEdit: false,
          content: "100011921910"
        },
        {
          name: "最后修改时间",
          isEdit: false,
          content: "2020/01/10 10:03:50"
        },
        {
          name: "备注",
          isEdit: true,
          content: "这是测试，可以删除"
        }
      ],
      editBeizhuFlag: false,
      dialogFormVisible: false, //基本信息组件弹框
      dialogEditGaojing: false, //编辑告警弹框组件
      dialogEditObject: false, //编辑告警弹框组件
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
      formLabelWidth: "120px",
      modifyNameDialogVisible: false,
      editSearchVal: "",
      tipsShow: false,
      modifyRemarksDialogVisible: false,
      remarksVal: "",
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
        satisfy: [
          {
            value: 0,
            name: "任意"
          },
          {
            value: 1,
            name: "所有"
          }
        ]
      },
      formInline_one: {
        satisfyVal: 0
      },
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
      radioChufa: "2", //触发条件单选
      input: "",
      input1: "",
      alarmObjectData: [],
      receivingObjectData: [],
      callbackInterface: false
    };
  },
  components: { Header },
  methods: {
    callbackEdit() {
      // 回调接口配置
      this.callbackInterface = true;
    },
    EditTips() {
      if (this.editSearchVal == "") {
        this.tipsShow = true;
      } else {
        this.tipsShow = false;
      }
    },
    editObject() {
      //编辑告警对象
      this.dialogEditObject = true;
    },
    editGaoJing() {
      //编辑告警触发条件
      this.dialogEditGaojing = true;
    },
    editInfo(content) {
      //编辑备注
      if (content.name == "策略名称") {
        this.modifyNameDialogVisible = true;
      } else {
        this.modifyRemarksDialogVisible = true;
      }
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
    handleSelectionChange(val) {}
  }
};
</script>

<style lang="scss" scoped>
.defaultDetail >>> .el-button,
.defaultDetail >>> .el-input__inner {
  height: 30px;
  border-radius: 0;
  padding-top: 0;
  line-height: 30px;
  font-size: 12px;
}
.defaultDetail >>> .box-card {
  width: 98%;
  border-radius: 0;
  padding-top: 0;
  // line-height: 30px;
  font-size: 12px;
  margin: 20px;
}
.defaultDetail {
  width: 100%;
  height: 100%;
  background: rgb(235, 235, 235);
  ::v-deep .el-card {
    margin: 20px;
  }
}
.box-content {
  line-height: 30px;
}
span.textColor {
  color: #888;
  width: 100px;
}
a {
  margin: 0 5px;
}
a:hover {
  color: #006eff;
  cursor: pointer;
  border-bottom: 1px solid #006eff;
}
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  p.tip {
    padding: 15px 20px;
    color: #003b80;
    border: 1px solid #97c7ff;
    background: #e5f0ff;
  }
}
.dialog-box {
  ::v-deep .el-dialog__footer {
    text-align: center;
  }
  ::v-deep .el-textarea__inner {
    border-radius: 0;
    width: 330px;
    height: 110px;
  }
  .edit-dialog {
    ::v-deep .el-input__inner {
      border-radius: 0px;
      width: 200px;
      height: 30px;
      padding: 0 10px;
    }
    p {
      color: #b43537;
      border: 1px solid #f6b5b5;
      background-color: #fcecec;
      width: 258px;
      box-sizing: border-box;
      padding: 10px 20px;
      margin-top: 10px;
    }
    ::v-deep .el-dialog__footer {
      text-align: center;
    }
  }
}
.callback-dialog-box {
  ::v-deep .el-dialog__body {
    padding-top: 0px;
  }
  .callback-interface-box {
    margin-top: 14px;
    ::v-deep .el-input__inner {
      border-radius: 0;
      height: 30px;
    }
    & > p {
      color: #888;
      font-size: 12px;
      line-height: 22px;
      margin-top: 10px;
    }
    .bg-box {
      margin-top: 10px;
      background-color: #fff4e3;
      color: #c07400;
      border: 1px solid #ffd18b;
      padding: 10px 20px;
      font-size: 12px;
      line-height: 28px;
      span {
        margin: 10px 0;
        font-size: 16px;
        font-weight: 700;
      }
    }
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
.alarm-object {
  width: 100%;
  // ::v-deep .el-card__header {
  //   border: 0px;
  // }
  .clearfix {
    display: flex;
    align-items: center;
  }
  ::v-deep .el-card__body {
    padding-top: 0px;
  }
  .box-content {
    ::v-deep .el-button {
      border-radius: 0;
      height: 30px;
      padding: 0 20px;
    }
  }
}

.alarm-receiving-object {
  .clearfix {
    display: flex;
    align-items: center;
  }
}
</style>

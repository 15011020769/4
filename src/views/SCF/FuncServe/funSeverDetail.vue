<template>
  <div class="wrap">
    <div class="appIdTit">
      <div class="topTit newClear">
        <span>
          <i class="el-icon-back" @click="returnBack" style="cursor: pointer;"></i>
          {{funNameTit}}
        </span>
        <span class="spanRight">
          <span class="selectDrow" @click="selectDrow">
            <el-button style="font-size:12px;color:#000">{{functionData.FunctionVersion}}</el-button>
            <i class="el-icon-caret-bottom"></i>
          </span>
          <div class="selectDrowBox" v-if="trueOrFalse">
            <div style="position:relative;z-index:100;display:flex;align-items:center;">
              <el-input v-model="searchIpt" :placeholder="$t('SCF.total.qsrbm')"></el-input>
              <el-button class="el-icon-search"></el-button>
            </div>
            <div class="tabChange">
              <el-tabs class="allTabsModel" v-model="activeNameModel" @tab-click="handleClick1">
                <el-tab-pane :label="$t('SCF.total.bb')" name="firstModel">
                  <div>
                    <p v-for="(item,index) in versionArr" :key="index">{{item}}</p>
                  </div>
                </el-tab-pane>
                <el-tab-pane :label="$t('SCF.total.bm')" name="secondModel">
                  <div>{{ $t('SCF.total.zwbm') }}</div>
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
          <el-select v-model="action" :palceholder="$t('SCF.total.cz')" class="action"
            @change="publishNewVewsionHander">
            <el-option :label="$t('SCF.total.fbxbb')" value="action1"></el-option>

            <el-dialog :title="$t('SCF.total.fbbb')" :visible.sync="publishNewVewsion" width="30%"
              :append-to-body="true" :before-close="handleClosePublish">
              <el-form :model="publishVersion" label-width="100px">
                <el-form-item :label="$t('SCF.total.hsmc')">{{funNameTit}}</el-form-item>
                <el-form-item :label="$t('SCF.total.ms')" :required="true">
                  <el-input v-model="publishVersion.descript" type="textarea" :placeholder="$t('SCF.total.qsrms')" />
                  <span>{{ $t('SCF.total.zc') }}</span>
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button @click="publishNewVewsion = false">{{ $t('SCF.total.qx') }}</el-button>
                <el-button type="primary" @click="surePublish">{{ $t('SCF.total.qd') }}</el-button>
              </span>
            </el-dialog>
            <el-option :label="$t('SCF.total.xjbm')" value="action2"></el-option>
          </el-select>
        </span>
      </div>
      <div class="appIdListCon">
        <el-tabs class="allTabs" v-model="activeName" @tab-click="handleClick">
          <el-tab-pane :label="$t('SCF.total.hspz')" name="first">
            <div class="allConListMain">
              <div class="allConListMainOne">
                <div class="allConListMainTit newClear">
                  <h3>{{ $t('SCF.total.hspz') }}</h3>
                  <a href="#" @click="dialogVisible2=true">{{ $t('SCF.total.bj') }}</a>
                  <el-dialog :title="$t('SCF.total.bjpz')" :visible.sync="dialogVisible2" width="800px"
                    :before-close="handleClose2">
                    <el-form :model="functionData" label-width="100px">
                      <el-form-item prop="FunctionName" :label="$t('SCF.total.hsmc')">
                        <span>{{functionData.FunctionName}}</span>
                      </el-form-item>
                      <el-form-item prop="Role" :label="$t('SCF.total.yxjs')" :required="true">
                        <span slot="label">
                          {{ $t('SCF.total.yxjs') }}
                        </span>
                        <el-select v-model="functionData.Role">
                          <el-option label="SCF_QcsRole" value="SCF_QcsRole"></el-option>
                          <el-option label="QCS_SCFExcuteRole" value="QCS_SCFExcuteRole"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item prop="Runtime" :label="$t('SCF.total.yxhj')">
                        <span>{{functionData.Runtime}}</span>
                      </el-form-item>
                      <el-form-item prop="MemorySize" :label="$t('SCF.total.nc')" :required="true" class="intoAll">
                        <span slot="label">
                          {{ $t('SCF.total.nc') }}
                        </span>
                        <el-select v-model="functionData.MemorySize">
                          <el-option label="64MB" value="64"></el-option>
                          <el-option label="128MB" value="128"></el-option>
                          <el-option label="256MB" value="256"></el-option>
                          <el-option label="384MB" value="384"></el-option>
                          <el-option label="512MB" value="512"></el-option>
                          <el-option label="640MB" value="640"></el-option>
                          <el-option label="768MB" value="768"></el-option>
                          <el-option label="896MB" value="896"></el-option>
                          <el-option label="1024MB" value="1024"></el-option>
                          <el-option label="1152MB" value="1152"></el-option>
                          <el-option label="1280MB" value="1280"></el-option>
                          <el-option label="1408MB" value="1408"></el-option>
                          <el-option label="1536MB" value="1536"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item prop="Timeout" :label="$t('SCF.total.cssj')" :required="true"
                        class="timeOutDate newClear">
                        <span slot="label">
                          {{ $t('SCF.total.cssj') }}
                          <!-- <i class="el-icon-question"></i> -->
                        </span>
                        <el-input class="timeOutDate1" v-model="functionData.Timeout" placeholder></el-input>
                        <span>秒</span>
                        <br />
                        <p class="tipContent">{{ $t('SCF.total.sjfw') }}</p>
                      </el-form-item>
                      <el-form-item :label="$t('SCF.total.ms')" prop="Description">
                        <span slot="label">
                          {{ $t('SCF.total.ms') }}
                          <!-- <i class="el-icon-question"></i> -->
                        </span>
                        <el-input type="textarea" v-model="functionData.Description" placeholder></el-input>
                        <p class="tipContent">{{ $t('SCF.total.zc') }}</p>
                      </el-form-item>
                      <div class="seniorbox">
                        <p>{{ $t('SCF.total.hjbl') }}</p>
                        <div>
                          <div class="Science borderNone">
                            <p>Key</p>
                            <p>Value</p>
                          </div>
                          <div class="Science borderNone" v-for="(item,index) in ScienceArr" :key="index">
                            <p>
                              <el-input v-model="item.Key" class="Scienceinput"></el-input>
                            </p>
                            <p>
                              <el-input v-model="item.Value" class="Scienceinput"></el-input>
                            </p>
                            <p v-if="closeshow">
                              <i class="el-icon-close closeScience" @click="CloseScience(index)"></i>
                            </p>
                          </div>
                          <div class="Science">
                            <p @click="AddScience" class="addScience">{{ $t('SCF.total.tj') }}</p>
                          </div>
                        </div>
                      </div>
                          <!-- <i class="el-icon-question"></i> -->
                      <el-form-item :label="$t('SCF.total.nwfw')"  prop="VpcConfig">
                        <span slot="label">
                          {{ $t('SCF.total.nwfw') }}
                        </span>
                        <el-switch v-model="functionData.switchFlag" active-color="#006eff" inactive-color="#888">
                        </el-switch>
                        <div v-if="functionData.switchFlag">
                          <el-select v-model="functionData.VpcId" v-on:change="getSelectOne($event)">
                            <el-option v-for="(item,index) in functionData.VpcConfig.VpcId" :label="item.VpcId" :value="item.VpcId"
                              :key="index"></el-option>
                          </el-select>
                          <el-select v-model="functionData.SubnetId" v-on:change="getSelectTwo($event)">
                            <el-option v-for="(item,index) in functionData.VpcConfig.SubnetId" :label="item.SubnetId" :value="item.SubnetId"
                              :key="index"></el-option>
                          </el-select>
                        </div>
                      </el-form-item>
                    </el-form>
                    <span slot="footer" class="dialog-footer">
                      <el-button @click="cancel">{{ $t('SCF.total.qx') }}</el-button>
                      <el-button type="primary" @click="saveConfig()">{{ $t('SCF.total.bc') }}</el-button>
                    </span>
                  </el-dialog>
                </div>
                <div class="allConListMainCon" v-loading="loading">
                  <p>
                    <span>{{ $t('SCF.total.hsmc') }}</span>
                    <span>{{functionData.FunctionName}}</span>
                  </p>
                  <p>
                    <span>{{ $t('SCF.total.yxjs') }}</span>
                    <span v-show="functionData.Role">{{functionData.Role}}1</span>
                    <span v-show="!functionData.Role">{{ $t('SCF.total.wyxjs') }}</span>
                  </p>
                  <p>
                    <span>{{ $t('SCF.total.yxhj') }}</span>
                    <span>{{functionData.Runtime}}</span>
                  </p>
                  <p>
                    <span>{{ $t('SCF.total.nc') }}</span>
                    <span v-show="functionData.MemorySize">{{functionData.MemorySize}}MB</span>
                    <span v-show="!functionData.MemorySize">0MB</span>
                  </p>
                  <p>
                    <span>{{ $t('SCF.total.cssj') }}</span>
                    <span v-show="functionData.Timeout">{{functionData.Timeout}}秒</span>
                    <span v-show="!functionData.Timeout">0秒</span>
                  </p>
                  <p>
                    <span>{{ $t('SCF.total.ms') }}</span>
                    <span>{{functionData.Description}}</span>
                  </p>
                  <p>
                    <span>{{ $t('SCF.total.xgsj2') }}</span>
                    <span>{{functionData.ModTime}}</span>
                  </p>
                  <p>
                    <span>{{ $t('SCF.total.hjbl') }}</span>
                    <span v-show="environmentFlag">
                      {{environmentKey}}={{environmentValue}}
                      <!-- {{functionData.Environment.Variables[0].Key}}={{functionData.Environment.Variables[0].Value}} -->
                    </span>
                    <span v-show="!environmentFlag">{{ $t('SCF.total.whjbl') }}</span>
                  </p>
                  <p>
                    <span>{{ $t('SCF.total.sswl') }}</span>
                    <span v-show="vpcConfigFlag">{{vpcConfigVpcId}}</span>
                    <span v-show="!vpcConfigFlag">{{ $t('SCF.total.w') }}</span>
                  </p>
                  <p>
                    <span>{{ $t('SCF.total.sszw') }}</span>
                    <span v-show="vpcConfigFlag">{{vpcConfigSubnetId}}</span>
                    <span v-show="!vpcConfigFlag">{{ $t('SCF.total.wzw') }}</span>
                  </p>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="$t('SCF.total.hsdm')" name="second">
            <div class="allConListMain">
              <funCode />
            </div>
          </el-tab-pane>
          <el-tab-pane :label="$t('SCF.total.cffs')" name="third">
            <div class="allConListMain">
              <triggerMode ref="mychild" @childFn="childFn" />
            </div>
          </el-tab-pane>
          <el-tab-pane :label="$t('SCF.total.yxrz')" name="fouth">
            <div class="allConListMain">
              <runningLog />
            </div>
          </el-tab-pane>
          <el-tab-pane :label="$t('SCF.total.jkxx')" name="fifth">
            <div class="allConListMain">
              <monitInfo />
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <el-dialog :title="$t('SCF.total.ts')" :visible.sync="centerDialogVisible" width="30%">
        <h3 slot="title">{{ $t('SCF.total.qdsccfq') }}</h3>
        <span slot="footer" class="dialog-footer">
          <el-button @click="centerDialogVisible = false">{{ $t('SCF.total.qx') }}</el-button>
          <el-button type="primary" @click="detele()">{{ $t('SCF.total.qd') }}</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import triggerMode from "./triggerMode.vue";
  import funCode from "./funCode.vue";
  import runningLog from "./runningLog";
  import monitInfo from "./monitInfo";
  import {
    SCF_DETAILS,
    UPD_CONFIG,
    PUBLISH_VERSION,
    LIST_VERSION,
    DEL_TRIGGER
  } from "@/constants";
  export default {
   
    components: {
      triggerMode,
      funCode,
      runningLog,
      monitInfo
    },
    data() {
      return {
        StartTIme: "",
        closeshow: true,
        loading: true,
        ScienceArr: [{}],
        funNameTit: "",
        activeName: "first",
        activeNameModel: "firstModel",
        action: "",
        trueOrFalse: false,
        flag: true,
        searchIpt: "",
        dialogVisible1: false,
        dialogVisible2: false,
        dialogVisible3: false,
        tagAddTagsBtn: false,
        publishNewVewsion: false,
        centerDialogVisible: false,
        logData: {},
        publishVersion: {
          descript: ""
        },
        modelNameTags: [{
          nameSpaceOne: "",
          nameSpaceTwo: "",
          disableDelete: false
        }],
        modelNameTags1: [{
          nameSpaceOne: "",
          nameSpaceTwo: "",
          disableDelete: false
        }],
        functionData: {
          Environment: {
            Variables: ""
          },
          // 内网访问
          switchFlag:false,
          VpcId:'',
          SubnetId:'',
        },
        environmentFlag: true,
        vpcConfigFlag: true,
        environmentKey: [],
        environmentValue: [],
        vpcConfigVpcId: "",
        vpcConfigSubnetId: "",
        childData: {},
        funReast: {
          funName: this.funtitle,
          runRole: "",
          runMoment: "Python2.7",
          storageMb: "",
          timeOutDate: "",
          description: "",
          variable: [{
            key: "12",
            value: "1"
          }],
          valueChange: false,
          valueChangeSelect1: [{
              id: "1",
              value: "123",
              label: "123"
            },
            {
              id: "2",
              value: "456",
              label: "456"
            }
          ],
          valueChangeSelect2: [{
              id: "1",
              a: "123",
              b: "bbb"
            },
            {
              id: "2",
              a: "123",
              b: "bbb"
            },
            {
              id: "3",
              a: "456",
              b: "1"
            },
            {
              id: "4",
              a: "456",
              b: "1"
            }
          ]
        },
        selectChangeOption: "",
        selectChangeOption1: "",
        versionArr: []
      };
    },
    mounted() {
      this.funNameTit = this.$route.query.functionName;
      this.modelNameTags[0].nameSpaceOne = "";
      this.modelNameTags[0].nameSpaceTwo = "";
      this.modelNameTags[0].disableDelete = true;
      this.init();
      this.searchVersion();
      this.getfunction();
    },
    methods: {
      cancel() {
        this.init();
        this.dialogVisible2 = false;
      },
      //环境添加
      AddScience() {
        this.ScienceArr.push({});
        if (this.ScienceArr.length > 1) {
          this.closeshow = true;
        } else {
          this.closeshow = false;
        }
      },
      //环境删除
      CloseScience(index) {
        this.ScienceArr.splice(index, 1);
        if (this.ScienceArr.length > 1) {
          this.closeshow = true;
        } else {
          this.closeshow = false;
        }
      },
      creatRole() {
        this.$router.push({
          path: "../../CAM/Role/createProvider.vue"
        });
      },
      // 获取编辑详情
      init() {
        this.loading = true;
        let params = {
          Action: "GetFunction",
          Version: "2018-04-16",
          Region: localStorage.getItem('regionv2'), //this.$cookie.get("regionv2")
        };
        let functionName = this.$route.query.functionName;
        if (functionName != "" && functionName != null) {
          params["FunctionName"] = functionName;
        }
        this.axios
          .post(SCF_DETAILS, params)
          .then(res => {
            let _this = this;
            let returnData=res.Response;
           
            this.functionData =  returnData;
            this.loading = false;
            let funcData = this.functionData;
            if (funcData.VpcConfig.SubnetId != "") {
              _this.vpcConfigVpcId = funcData.VpcConfig.VpcId;
              _this.vpcConfigSubnetId = funcData.VpcConfig.SubnetId;
            } else {
              _this.vpcConfigFlag = false;
            }

            if (funcData.Environment.Variables.length != 0) {
              for (let i = 0; i <= funcData.Environment.Variables.length; i++) {
                _this.environmentKey = funcData.Environment.Variables[i].Key;
                _this.environmentValue = funcData.Environment.Variables[i].Value;
              }
            } else {
              _this.environmentFlag = false;
            }
          })
          .catch(error => {
            this.$message.error(error);
          });
      },
      // 函数配置修改
      saveConfig() {
        // debugger;
        let params = {
          Action: "UpdateFunctionConfiguration",
          Version: "2018-04-16",
          Region: localStorage.getItem('regionv2'),
          Description: this.functionData.Description,
          FunctionName: this.functionData.FunctionName,
          MemorySize: this.functionData.MemorySize,
          Role: this.functionData.Role,
          Timeout: this.functionData.Timeout //,
        };
        for (let i in this.ScienceArr) {
          (params["Environment.Variables." + i + ".Key"] = this.ScienceArr[
            i
          ].Key),
          (params["Environment.Variables." + i + ".Value"] = this.ScienceArr[
            i
          ].Value);
        }
        this.axios
          .post(UPD_CONFIG, params)
          .then(res => {
            this.$message({
              type: "success",
              message: "执行成功！"
            });
            this.getfunction();
            this.dialogVisible2 = false;
          })
          .catch(error => {
            this.$message.error(error);
          });
      },
      getfunction() {
        let params = {
          Version: "2018-04-16",
          Region: localStorage.getItem('regionv2'),
          Action: "GetFunction"
        };
        let functionName = this.$route.query.functionName;
        if (functionName != "" && functionName != null) {
          params["FunctionName"] = functionName;
        }
        this.axios.post(SCF_DETAILS, params).then(res => {
          this.triggerBoxList = res.Response.Triggers;
          for (let i = 0; i < this.triggerBoxList.length; i++) {
            this.switch1[i] = true;
          }
        });
      },
      inpChange(val) {},
      handleClick(tab, event) {},
      handleClick1() {},
      returnBack() {
        this.$router.push({
          path: "/FuncServe"
        });
      },
      selectDrow() {
        if (this.flag) {
          this.trueOrFalse = true;
          this.flag = false;
        } else {
          this.trueOrFalse = false;
          this.flag = true;
        }
      },
      handleClose1() {
        this.dialogVisible1 = false;
      },
      handleClose2() {
        this.dialogVisible2 = false;
      },
      handleClose3() {
        this.dialogVisible3 = false;
      },
      handleClosePublish() {
        this.publishNewVewsion = false;
      },
      //删除弹框标签
      spaceDelete(spaceIndex, spaceRow) {
        this.modelNameTags.splice(spaceIndex, 1);
      },
      spaceDelete1(spaceIndex, spaceRow) {
        this.modelNameTags1.splice(spaceIndex, 1);
      },
      //编辑标签提交按钮
      sureTabAdd() {},
      //新增标签提交按钮
      sureTabAdd1() {
        this.tagAddTagsBtn = false;
      },
      //发布新版本
      surePublish() {
        let params = {
          Action: "PublishVersion",
          Version: "2018-04-16",
          Region: localStorage.getItem('regionv2'),
          Description: this.publishVersion.descript
        };
        let functionName = this.$route.query.functionName;
        if (functionName != "" && functionName != null) {
          params["FunctionName"] = functionName;
        }
        this.axios
          .post(PUBLISH_VERSION, params)
          .then(res => {
            this.init();
            this.searchVersion();
          })
          .catch(error => {
            this.$message.error(error);
          });
        this.publishNewVewsion = false;
      },

      //监测select
      getSelectOne(eventNew) {
        let tempCity = [];
        this.funReast.valueChangeSelect2 = [{
            a: "123",
            b: "bbb"
          },
          {
            a: "123",
            b: "bbb"
          },
          {
            a: "456",
            b: "1"
          },
          {
            a: "456",
            b: "1"
          }
        ];
        for (var val of this.funReast.valueChangeSelect2) {
          if (eventNew == val.a) {
            tempCity.push({
              label: val.b,
              value: val.b
            });
          }
        }
        this.funReast.valueChangeSelect2 = tempCity;
      },
      getSelectTwo(SelectTwo) {
        this.$forceUpdate();
      },
      publishNewVewsionHander() {
        if (this.action == "action1") {
          this.publishNewVewsion = true;
        } else {
          this.publishNewVewsion = false;
        }
      },
      //查看函数新版本
      searchVersion() {
        let _this = this;
        let params = {
          Action: "ListVersionByFunction",
          Version: "2018-04-16",
          Region: localStorage.getItem('regionv2'),
        };
        let functionName = this.$route.query.functionName;
        if (functionName != "" && functionName != null) {
          params["FunctionName"] = functionName;
        }
        this.axios
          .post(LIST_VERSION, params)
          .then(res => {
            this.logData = res.Response.FunctionVersion;
            var arr = [];
            for (let i = 0; i < this.logData.length; i++) {
              // this.switch1[i] = true;
              arr.push(this.logData[i]);
            }
            this.versionArr = arr;
          })
          .catch(error => {
            this.$message.error(error);
          });
      },
      childFn(val) {
        this.childData = val;
        this.centerDialogVisible = true;
      },
      detele() {
        this.centerDialogVisible = false;
        let params = {
          Version: "2018-04-16",
          Region: localStorage.getItem('regionv2'),
          Action: "DeleteTrigger",
          TriggerName: this.childData.TriggerName,
          Type: this.childData.Type
        };
        let functionName = this.$route.query.functionName;
        if (functionName != "" && functionName != null) {
          params["FunctionName"] = functionName;
        }
        this.axios.post(DEL_TRIGGER, params).then(res => {
          this.$refs.mychild.getfunction();
        });
      },

    }
  };

</script>
<style lang="scss" scoped>
  .appIdTit>>>.el-loading-mask {
    background: white;
  }

  .appIdTit>>>.el-tabs__nav-wrap {
    width: 100%;
    background: white;
    position: relative;
    top: -5px;
  }

  .appIdTit>>>.el-select,
  .appIdTit>>>.el-input,
  .appIdTit>>>.el-select .el-input__inner {
    width: 100px;
  }

  .appIdTit>>>.el-input__inner,
  .appIdTit>>>.selectDrow,
  .appIdTit>>>button {
    height: 30px !important;
    border-radius: 0 !important;
    font-size: 12px;
    line-height: 30px !important;
    padding-top: 0 !important;
  }

  .selectDrow {
    overflow: hidden;
    background: transparent;
  }

  .appIdTit>>>button {
    padding: 0 15px;
    box-sizing: border-box;
  }

  .selectDrowBox {
    padding: 10px;
    box-sizing: border-box;
    text-align: center;
  }

  .seniorbox {
    display: flex;
    margin: 20px;

    ::v-deep .el-input {
      width: 170px !important;
    }

    .Science {
      margin-left: 20px;
      display: flex;
      width: 415px;
      height: 40px;
      border: 0.5px solid #ccc;

      p {
        color: #ccc;
        font-weight: bold;
        flex: 1;
        line-height: 40px;
        padding-left: 15px;
      }
    }

    .closeScience {
      cursor: pointer;
      font-size: 24px;
      line-height: 40px;
    }

    .addScience {
      cursor: pointer;
    }

    .borderNone {
      border-bottom: none;

      .Scienceinput {
        width: 165px !important;
      }
    }
  }

  .newClear:after {
    display: block;
    content: "";
    clear: both;
  }

  .appIdTit {
    width: 100%;
    padding: 20px 20px 0;
    background-color: #fff;
    height: 90px;

    .topTit {
      span:nth-child(1) {
        float: left;
        font-size: 16px;
        font-weight: 600;
      }

      span:nth-child(2).spanRight {
        float: right;
        position: relative;

        .selectDrow {
          width: 100px;
          height: 38px;
          border: 1px solid #eaeaea;
          border-radius: 4px;

          button {
            height: 36px;
            border: none;

            span {
              font-size: 12px;
              color: #000;
              font-weight: 500;
            }
          }
        }

        .action {
          height: 36px;

          input {
            height: 36px;

            .el-input__suffix {
              top: -28px;
            }
          }
        }

        .selectDrowBox {
          position: absolute;
          top: 40px;
          right: 127px;
          border: 1px solid #ddd;
          background-color: #fff;
          -webkit-box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
          box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
          width: 402px;
          min-height: 150px;
          z-index: 9;

          .el-input {
            width: 86%;
          }
        }

        .el-tabs__nav {
          width: 100%;

          .el-tabs__active-bar {
            width: 50%;
          }

          #tab-firstModel {
            width: 50%;
            text-align: center;
          }

          #tab-secondModel {
            width: 50%;
            text-align: center;
          }
        }
      }
    }
  }

  .el-icon-back {
    margin-right: 12px;
  }

  .allTabs {
    width: 100%;
    margin-top: -6px;

    .allConListMain {
      padding: 8px 0;

      .allConListMainOne {
        width: 100%;
        min-height: 300px;
        border: 1px solid #ddd;
        background-color: #fff;
        -webkit-box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
        box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
        padding: 20px;

        .allConListMainTit {
          margin-bottom: 20px;

          h3 {
            font-size: 14px;
            font-weight: 600;
            float: left;
          }

          a {
            float: right;
          }
        }

        .allConListMainCon {
          p {
            margin-bottom: 25px;

            span:nth-child(1) {
              display: inline-block;
              width: 70px;
              font-size: 12px;
              color: #888;
              text-align: left;
            }

            span:nth-child(2) {
              display: inline-block;
              font-size: 12px;
              color: #444;

              span {
                padding: 2px 3px;
                width: auto;
                background-color: #e5e5e5;
              }
            }
          }
        }
      }
    }
  }

  .tipContent {
    font-size: 12px;
    color: #888;

    span {
      float: left;
    }

    a.tipContentA {
      float: left !important;

      span.el-icon-share {
        float: right;
        margin: 14px 5px 0 0;
      }
    }
  }

  .timeOutDate {

    // width:200px!important;
    .timeOutDate1 {
      width: 200px;
      float: left;
    }

    span {
      float: left;
    }
  }

  .topTit>>>.el-input .el-input__inner {
    height: 30px !important;
    border-radius: 0;
  }

</style>

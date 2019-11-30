<template>
  <div>
    <div class="appIdTit">
      <div class="topTit newClear">
        <span>
          <i class="el-icon-back" @click="returnBack"></i>
          {{funNameTit}}
        </span>
        <span class="spanRight">
          <span class="selectDrow" @click="selectDrow">
            <el-button style="font-size:12px;color:#000">{{functionData.FunctionVersion}}</el-button>
            <i class="el-icon-caret-bottom"></i>
          </span>
          <div class="selectDrowBox" v-if="trueOrFalse">
            <div>
              <el-input v-model="searchIpt" placeholder="请输入别名或版本的名称进行搜索"></el-input>
              <el-button class="el-icon-search"></el-button>
            </div>
            <div class="tabChange">
              <el-tabs class="allTabsModel" v-model="activeNameModel" @tab-click="handleClick1">
                <el-tab-pane label="版本" name="firstModel">
                  <div></div>
                </el-tab-pane>
                <el-tab-pane label="别名" name="secondModel">
                  <div>暂无别名</div>
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
          <el-select
            v-model="action"
            palceholder="操作"
            class="action"
            @change="publishNewVewsionHander"
          >
            <el-option label="发布新版本" value="action1"></el-option>

            <el-dialog
              title="发布版本"
              :visible.sync="publishNewVewsion"
              width="30%"
              :append-to-body="true"
              :before-close="handleClosePublish"
            >
              <el-form :model="publishVersion" label-width="100px">
                <el-form-item label="函数名称">{{funNameTit}}</el-form-item>
                <el-form-item label="描述" :required="true">
                  <el-input
                    v-model="publishVersion.descript"
                    type="textarea"
                    placeholder="请输入版本的描述"
                  />
                  <span>最大支持1000个英文字母、数字、空格、逗号、句号、中文</span>
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button @click="publishNewVewsion = false">取 消</el-button>
                <el-button type="primary" @click="surePublish">确 定</el-button>
              </span>
            </el-dialog>
            <el-option label="新建别名" value="action2"></el-option>
          </el-select>
        </span>
      </div>
      <div class="appIdListCon">
        <el-tabs class="allTabs" v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="函数配置" name="first">
            <div class="allConListMain">
              <div class="allConListMainOne">
                <div class="allConListMainTit newClear">
                  <h3>函数配置</h3>
                  <a href="#" @click="dialogVisible2=true">编辑</a>
                  <el-dialog
                    title="编辑函数配置"
                    :visible.sync="dialogVisible2"
                    width="800px"
                    :before-close="handleClose2"
                  >
                    <el-form :model="functionData" label-width="100px">
                      <el-form-item prop="FunctionName" label="函数名称">
                        <span>{{functionData.FunctionName}}</span>
                      </el-form-item>
                      <el-form-item prop="Role" label="运行角色" :required="true">
                        <span slot="label">
                          运行角色
                          <i class="el-icon-question"></i>
                        </span>
                        <el-select v-model="functionData.Role">
                          <el-option label="SCF默认运行角色" value="default"></el-option>
                          <el-option label="SCF_QcsRole" value="qsrole"></el-option>
                        </el-select>
                        <p class="tipContent">
                          <span>此角色将用于授权函数运行时操作其他资源的权限。您可以</span>
                          <a class="tipContentA">
                            新建角色
                            <span class="el-icon-share"></span>
                          </a>
                          <span>或对角色</span>
                          <a class="tipContentA">
                            修改权限
                            <span class="el-icon-share"></span>
                          </a>
                        </p>
                      </el-form-item>
                      <el-form-item prop="Runtime" label="运行环境">
                        <span>{{functionData.Runtime}}</span>
                      </el-form-item>
                      <el-form-item prop="MemorySize" label="内存" :required="true" class="intoAll">
                        <span slot="label">
                          内存
                          <i class="el-icon-question"></i>
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
                      <el-form-item
                        prop="Timeout"
                        label="超时时间"
                        :required="true"
                        class="timeOutDate newClear"
                      >
                        <span slot="label">
                          超时时间
                          <i class="el-icon-question"></i>
                        </span>
                        <el-input class="timeOutDate1" v-model="functionData.Timeout" placeholder></el-input>
                        <span>秒</span>
                        <br>
                        <p class="tipContent">时间范围：1-900秒</p>
                      </el-form-item>
                      <el-form-item label="描述" prop="Description">
                        <span slot="label">
                          描述
                          <i class="el-icon-question"></i>
                        </span>
                        <el-input type="textarea" v-model="functionData.Description" placeholder></el-input>
                        <p class="tipContent">最大支持1000个英文字母、数字、空格、逗号、句号、中文</p>
                      </el-form-item>
                      <el-form-item label="环境变量" prop="variable">
                        <span slot="label">
                          环境变量
                          <i class="el-icon-question"></i>
                        </span>
                        <el-table
                          :data="functionData.Environment.Variables"
                          size="small"
                          border
                          element-loading-text="Loading"
                          highlight-current-row
                        >
                          <el-table-column label="key">
                            <template slot-scope="scope">
                              <el-form :model="functionData.Environment.Variables[scope.$index]">
                                <el-form-item prop="nameSpaceOne">
                                  <el-input
                                    v-show="true"
                                    v-model="functionData.Environment.Variables[scope.$index].key"
                                    placeholder
                                  />
                                </el-form-item>
                              </el-form>
                            </template>
                          </el-table-column>
                          <el-table-column label="value">
                            <template slot-scope="scope">
                              <el-form
                                ref="scope.row"
                                :model="functionData.Environment.Variables[scope.$index]"
                              >
                                <el-form-item prop="nameSpaceTwo">
                                  <el-input
                                    v-model="functionData.Environment.Variables[scope.$index].value"
                                    placeholder
                                  />
                                </el-form-item>
                              </el-form>
                            </template>
                          </el-table-column>
                          <el-table-column label="delete">
                            <template slot-scope="scope">
                              <el-form ref="scope.row">
                                <el-form-item>
                                  <el-button
                                    class="modelDelete"
                                    @click="spaceDelete1(scope.$index,scope.row)"
                                  >delete</el-button>
                                </el-form-item>
                              </el-form>
                            </template>
                          </el-table-column>
                        </el-table>
                        <a @click="addvariable">添加环境变量</a>
                      </el-form-item>
                      <el-form-item label="内网访问" prop="VpcConfig">
                        <span slot="label">
                          内网访问
                          <i class="el-icon-question"></i>
                        </span>
                        <el-switch
                          v-model="functionData.VpcConfig"
                          active-color="#006eff"
                          inactive-color="#888"
                        ></el-switch>
                        <div v-if="functionData.VpcConfig">
                          <el-select
                            v-model="functionData.VpcConfig"
                            v-on:change="getSelectOne($event)"
                          >
                            <el-option
                              v-for="item in functionData.VpcConfig"
                              :label="item.VpcId"
                              :value="item.VpcId"
                              :key="item"
                            ></el-option>
                          </el-select>
                          <el-select
                            v-model="functionData.VpcConfig"
                            v-on:change="getSelectTwo($event)"
                          >
                            <el-option
                              v-for="item in funReast.VpcConfig"
                              :label="item.SubnetId"
                              :value="item.SubnetId"
                              :key="item"
                            ></el-option>
                          </el-select>
                          <p class="tipContent">
                            <span>如现有的网络不合适，您可以去控制台</span>
                            <a class="tipContentA">
                              新建私有网络
                              <span class="el-icon-share"></span>
                            </a>
                            <span>或</span>
                            <a class="tipContentA">
                              新建子网
                              <span class="el-icon-share"></span>
                            </a>
                          </p>
                        </div>
                      </el-form-item>
                      <el-form-item label="标签" prop="tagLists">
                        <p>
                          <span></span>
                          <i class="el-icon-edit" @click="tagAddTagsBtn=true"></i>
                        </p>
                        <div title="您已经选择1个云资源" v-if="tagAddTagsBtn" width="800px">
                          <div>
                            <span>新增标签</span>
                            <el-table
                              :data="modelNameTags1"
                              size="small"
                              element-loading-text="Loading"
                              highlight-current-row
                            >
                              <el-table-column label="标签键">
                                <template slot-scope="scope">
                                  <el-form :model="modelNameTags1[scope.$index]">
                                    <el-form-item prop="nameSpaceOne">
                                      <!-- <span
                                        v-if="modelNameTags[scope.$index].disableDelete"
                                      >{{modelNameTags[scope.$index].nameSpaceOne}}</span>-->
                                      <el-input
                                        class="addTabsIpt"
                                        v-model="modelNameTags1[scope.$index].nameSpaceOne"
                                        placeholder="添加标签键"
                                      />
                                    </el-form-item>
                                  </el-form>
                                </template>
                              </el-table-column>
                              <el-table-column label="标签值">
                                <template slot-scope="scope">
                                  <el-form ref="scope.row" :model="modelNameTags1[scope.$index]">
                                    <el-form-item prop="nameSpaceTwo">
                                      <el-input
                                        class="addTabsIpt"
                                        v-model="modelNameTags1[scope.$index].nameSpaceTwo"
                                        placeholder
                                      />
                                    </el-form-item>
                                  </el-form>
                                </template>
                              </el-table-column>
                              <el-table-column label="删除">
                                <template slot-scope="scope">
                                  <el-form ref="scope.row">
                                    <el-form-item>
                                      <el-button
                                        class="modelDelete"
                                        @click="spaceDelete1(scope.$index,scope.row)"
                                      >删除</el-button>
                                    </el-form-item>
                                  </el-form>
                                </template>
                              </el-table-column>
                            </el-table>
                          </div>
                          <div>
                            <span @click="addTabs1">
                              <a href="#">添加</a>
                            </span>
                          </div>
                          <span slot="footer" class="dialog-footer">
                            <el-button @click="tagAddTagsBtn = false">取 消</el-button>
                            <el-button type="primary" @click="sureTabAdd1()">提交</el-button>
                          </span>
                        </div>
                      </el-form-item>
                    </el-form>
                    <span slot="footer" class="dialog-footer">
                      <el-button @click="dialogVisible2 = false">取 消</el-button>
                      <el-button type="primary" @click="saveConfig()">保存</el-button>
                    </span>
                  </el-dialog>
                </div>
                <div class="allConListMainCon">
                  <p>
                    <span>函数名称</span>
                    <span>{{functionData.FunctionName}}</span>
                  </p>
                  <p>
                    <span>运行角色</span>
                    <span>{{functionData.Role}}</span>
                  </p>
                  <p>
                    <span>运行环境</span>
                    <span>{{functionData.Runtime}}</span>
                  </p>
                  <p>
                    <span>内存</span>
                    <span v-show="functionData.MemorySize">{{functionData.MemorySize}}MB</span>
                    <span v-show="!functionData.MemorySize">0MB</span>
                  </p>
                  <p>
                    <span>超时时间</span>
                    <span v-show="functionData.Timeout">{{functionData.Timeout}}秒</span>
                    <span v-show="!functionData.Timeout">0秒</span>
                  </p>
                  <p>
                    <span>描述</span>
                    <span>{{functionData.Description}}</span>
                  </p>
                  <p>
                    <span>修改时间</span>
                    <span>{{functionData.ModTime}}</span>
                  </p>
                  <p>
                    <span>环境变量</span>
                    <span v-show="functionData.environmentFlag"></span>
                    <span v-show="functionData.environmentFlag">无环境变量</span>
                  </p>
                  <p>
                    <span>所属网络</span>
                    <span v-show="vpcConfigFlag">{{vpcConfigVpcId}}</span>
                    <span v-show="!vpcConfigFlag">无VPC</span>
                  </p>
                  <p>
                    <span>所属子网</span>
                    <span v-show="vpcConfigFlag">{{vpcConfigSubnetId}}</span>
                    <span v-show="!vpcConfigFlag">无子网</span>
                  </p>
                  <p>
                    <span>标签</span>
                    <span>
                      <i class="el-icon-edit" @click="dialogVisible1 = true"></i>
                    </span>
                  </p>
                  <el-dialog
                    title="您已经选择1个云资源"
                    :visible.sync="dialogVisible1"
                    width="800px"
                    :before-close="handleClose1"
                  >
                    <div>
                      <span>编辑已有标签</span>
                      <el-table
                        :data="modelNameTags"
                        size="small"
                        element-loading-text="Loading"
                        highlight-current-row
                      >
                        <el-table-column label="标签键">
                          <template slot-scope="scope">
                            <el-form :model="modelNameTags[scope.$index]">
                              <el-form-item prop="nameSpaceOne">
                                <el-input
                                  class="addTabsIpt"
                                  v-model="modelNameTags[scope.$index].nameSpaceOne"
                                  placeholder
                                />
                              </el-form-item>
                            </el-form>
                          </template>
                        </el-table-column>
                        <el-table-column label="标签值">
                          <template slot-scope="scope">
                            <el-form ref="scope.row" :model="modelNameTags[scope.$index]">
                              <el-form-item prop="nameSpaceTwo">
                                <el-input
                                  class="addTabsIpt"
                                  v-model="modelNameTags[scope.$index].nameSpaceTwo"
                                  placeholder
                                />
                              </el-form-item>
                            </el-form>
                          </template>
                        </el-table-column>
                        <el-table-column label="删除">
                          <template slot-scope="scope">
                            <el-form ref="scope.row">
                              <el-form-item>
                                <el-button
                                  class="modelDelete"
                                  @click="spaceDelete(scope.$index,scope.row)"
                                >删除</el-button>
                              </el-form-item>
                            </el-form>
                          </template>
                        </el-table-column>
                      </el-table>
                    </div>
                    <div>
                      <span @click="addTabs">
                        <a href="#">添加</a>
                      </span>
                    </div>
                    <span slot="footer" class="dialog-footer">
                      <el-button @click="dialogVisible1 = false">取 消</el-button>
                      <el-button type="primary" @click="sureTabAdd()">提交</el-button>
                    </span>
                  </el-dialog>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="函数代码" name="second">
            <div class="allConListMain">
              <funCode/>
            </div>
          </el-tab-pane>
          <el-tab-pane label="触发方式" name="third">
            <div class="allConListMain">
              <triggerMode ref="mychild" @childFn="childFn"/>
            </div>
          </el-tab-pane>
          <el-tab-pane label="运行日志" name="fouth">
            <div class="allConListMain">
              <runningLog/>
            </div>
          </el-tab-pane>
          <el-tab-pane label="监控信息" name="fifth">
            <div class="allConListMain">
              <monitInfo/>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <el-dialog title="提示" :visible.sync="centerDialogVisible" width="30%">
        <h3 slot="title">您确定要删除该触发器吗？</h3>
        <span slot="footer" class="dialog-footer">
          <el-button @click="centerDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="detele()">确 定</el-button>
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
export default {
  components: {
    triggerMode: triggerMode,
    funCode: funCode,
    runningLog: runningLog,
    monitInfo: monitInfo
  },
  data() {
    return {
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
      modelNameTags: [
        {
          nameSpaceOne: "",
          nameSpaceTwo: "",
          disableDelete: false
        }
      ],
      modelNameTags1: [
        {
          nameSpaceOne: "",
          nameSpaceTwo: "",
          disableDelete: false
        }
      ],
      options: [],
      options1: [],
      functionData: {
        Environment: {
          Variables: ""
        }
      },
      environmentFlag: true,
      vpcConfigFlag: true,
      VariablesArr: [],
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
        variable: [
          {
            key: "12",
            value: "1"
          }
        ],
        valueChange: false,
        valueChangeSelect1: [
          {
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
        valueChangeSelect2: [
          {
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
      selectChangeOption1: ""
    };
  },
  mounted() {
    this.funNameTit = this.$route.query.functionName;
    this.modelNameTags[0].nameSpaceOne = "";
    this.modelNameTags[0].nameSpaceTwo = "";
    this.modelNameTags[0].disableDelete = true;
    this.init();
    this.searchVersion();
    this.getModality()
  },
  methods: {
    // 获取编辑详情
    init() {
      let params = {
        Action: "GetFunction",
        Version: "2018-04-16",
        Region: this.$cookie.get("regionv2")
      };
      let functionName = this.$route.query.functionName;
      // functionName = 'tttt'
      if (functionName != "" && functionName != null) {
        params["FunctionName"] = functionName;
      }
      let url = "scf2/GetFunction";
      this.axios
        .post(url, params)
        .then(res => {
          let _this = this;
          this.functionData = res.Response;
          let funcData = this.functionData;
          if (funcData.FunctionName != undefined) {
            _this.VariablesArr = funcData.Environment.Variables;
            console.log(_this.VariablesArr);
            _this.vpcConfigVpcId = funcData.VpcConfig.VpcId;
            _this.vpcConfigSubnetId = funcData.VpcConfig.SubnetId;
          } else {
            _this.environmentFlag = false;
            _this.vpcConfigFlag = false;
          }
          console.log(this.functionData)
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 函数配置修改
    saveConfig() {
      // debugger;
      let params = {
        Action: "UpdateFunctionConfiguration",
        Version: "2018-04-16",
        Region: this.$cookie.get("regionv2"),
        Description: this.functionData.Description,
        // Environment: this.functionData.Environment, // 参数传递有问题，暂时屏蔽
        FunctionName: this.functionData.FunctionName,
        MemorySize: this.functionData.MemorySize,
        Role: this.functionData.Role,
        Timeout: this.functionData.Timeout //,
        // VpcConfig: this.functionData.VpcConfig // 参数传递有问题，暂时屏蔽
      };
      let url = "scf2/UpdateFunctionConfiguration";
      this.axios
        .post(url, params)
        .then(res => {
          console.log(res.Response);
          this.$message({ type: "success", message: "执行成功！" });
          this.dialogVisible2 = false;
        })
        .catch(error => {
          console.log(error);
        });
    },
    getfunction() {
      let params = {
        Version: "2018-04-16",
        Region: this.$cookie.get("regionv2"),
        Action: "GetFunction"
      };
      let functionName = this.$route.query.functionName;
      if (functionName != "" && functionName != null) {
        params["FunctionName"] = functionName;
      }
      this.$axios.post("scf2/GetFunction", params).then(res => {
        console.log(res);
        this.triggerBoxList = res.Response.Triggers;
        for (let i = 0; i < this.triggerBoxList.length; i++) {
          this.switch1[i] = true;
        }
      });
    },
    inpChange(val){
      console.log(val)
    },
    handleClick(tab, event) {
      console.log(tab.index);
    },
    handleClick1() {},
    returnBack() {
      this.$router.push({
        path: "/FuncServe"
      });
    },
    selectDrow() {
      // console.log(this.flag)
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
        Region: this.$cookie.get("regionv2"),
        Description:this.publishVersion.descript
      };
      let functionName = this.$route.query.functionName;
      if (functionName != "" && functionName != null) {
        params["FunctionName"] = functionName;
      }
      let url = "scf2/PublishVersion";
      this.axios
        .post(url, params)
        .then(res => {
          
        })
        .catch(error => {
          console.log(error);
        });
      this.publishNewVewsion = false;
    },
    //添加标签
    addTabs() {
      this.modelNameTags.push({
        nameSpaceOne: "",
        nameSpaceTwo: "",
        disableDelete: false
      });
    },
    addTabs1() {
      this.modelNameTags1.push({
        nameSpaceOne: "",
        nameSpaceTwo: "",
        disableDelete: false
      });
    },
    spaceDelete1(spaceIndex, spaceRow) {
      this.funReast.variable.splice(spaceIndex, 1);
    },
    //添加环境变量按钮
    addvariable() {
      this.funReast.variable.push({
        key: "",
        value: ""
      });
    },
    //监测select
    getSelectOne(eventNew) {
      let tempCity = [];
      this.funReast.valueChangeSelect2 = [
        {
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
      console.log(this.funReast.valueChangeSelect2);
      for (var val of this.funReast.valueChangeSelect2) {
        console.log(val.a);
        if (eventNew == val.a) {
          tempCity.push({ label: val.b, value: val.b });
        }
      }
      this.funReast.valueChangeSelect2 = tempCity;
    },
    getSelectTwo: function(SelectTwo) {
      this.$forceUpdate();
    },
    publishNewVewsionHander() {
      console.log(this.action);
      if (this.action == "action1") {
        this.publishNewVewsion = true;
      } else {
        this.publishNewVewsion = false;
      }
    },
    searchVersion() {
      let _this = this;
      let params = {
        Action: "ListVersionByFunction",
        Version: "2018-04-16",
        Region: this.$cookie.get("regionv2")
      };
      let functionName = this.$route.query.functionName;
      if (functionName != "" && functionName != null) {
        params["FunctionName"] = functionName;
      }
      let url = "scf2/ListVersionByFunction";
      this.axios
        .post(url, params)
        .then(res => {
          _this.logData = res.Response;
          console.log(_this.logData);
        })
        .catch(error => {
          console.log(error);
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
        Region: this.$cookie.get("regionv2"),
        Action: "DeleteTrigger",
        TriggerName: this.childData.TriggerName,
        Type: this.childData.Type
      };
      let functionName = this.$route.query.functionName;
      if (functionName != "" && functionName != null) {
        params["FunctionName"] = functionName;
      }
      this.$axios.post("scf2/DeleteTrigger", params).then(res => {
        console.log(res);
        console.log(this.$refs.mychild);
        this.$refs.mychild.getfunction();
      });
    },
    getTable() {
      let params = {
        Version: "2018-07-24",
        Region: this.$cookie.get("regionv2"),
        Action: "DescribeBaseMetrics",
        Namespace: "QCE/CVM"
      };
      this.$axios.post("scf2/DescribeBaseMetrics", params).then(res => {
        console.log(res, "table");
      });
    },
    // 监控数据
   getModality () {
      let params = {
        Version: "2018-07-24",
        Region: this.$cookie.get("regionv2"),
        Action: "GetMonitorData",
        Namespace: "QCE/VBC",
        MetricName: "RegionInPkg",
        Period: 300,
        "Instances.0.Dimensions.0.Name": "CcnId",
        "Instances.0.Dimensions.0.Value": this.$route.query.functionName,
        StartTime: this.Start_End.StartTIme,
        EndTime: this.Start_End.EndTIme,

      };
      console.log(params);
      let url = "monitor2/GetMonitorData";
      this.axios
        .post(url, params)
        .then(res => {
          console.log(res.Response);
          this.tableData.push(data.Response);
        })
        .catch(error => {
          console.log(error);
        });
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
          span{
            font-size:12px;
            color:#000;
            font-weight:500
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
</style>


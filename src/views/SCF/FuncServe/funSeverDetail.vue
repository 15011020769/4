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
            <el-button>{{}}</el-button>
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
            :disabled="action==='新建别名'?true:false"
          >
            <el-option label="发布新版本" value="action"></el-option>
            <el-option label="新建别名" value="action"></el-option>
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
                    <el-form :model="funReast" label-width="100px">
                      <el-form-item prop="funName" label="函数名称">
                        <span>{{funReast.funName}}</span>
                      </el-form-item>
                      <el-form-item prop="runRole" label="运行角色" :required="true">
                        <span slot="label">运行角色<i class="el-icon-question"></i></span>
                        <el-select v-model="funReast.runRole">
                          <el-option label="SCF默认运行角色" value="default"></el-option>
                          <el-option label="SCF_QcsRole" value="qsrole"></el-option>
                        </el-select>
                        <p class="tipContent">
                          <span>此角色将用于授权函数运行时操作其他资源的权限。您可以</span>
                          <a class="tipContentA">新建角色<span class="el-icon-share"></span></a>
                          <span>或对角色</span>
                          <a class="tipContentA">修改权限<span class="el-icon-share"></span></a>
                        </p>
                      </el-form-item>
                      <el-form-item prop="runMoment" label="运行环境">
                        <span>{{funReast.runMoment}}</span>
                      </el-form-item>
                      <el-form-item prop="storageMb" label="内存" :required="true" class="intoAll">
                        <span slot="label">内存<i class="el-icon-question"></i></span>
                        <el-select v-model="funReast.storageMb">
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
                      <el-form-item prop="timeOutDate" label="超时时间"  :required="true" class="timeOutDate newClear">
                        <span slot="label">超时时间<i class="el-icon-question"></i></span>
                        <el-input class="timeOutDate1" v-model="funReast.timeOutDate" placeholder=""></el-input><span>秒</span><br/>
                        <p class="tipContent">时间范围：1-900秒</p>
                      </el-form-item>
                      <el-form-item label="描述" prop="description">
                        <span slot="label">描述<i class="el-icon-question"></i></span>
                        <el-input type="textarea" v-model="funReast.description" placeholder=""></el-input>
                        <p class="tipContent">最大支持1000个英文字母、数字、空格、逗号、句号、中文</p>
                      </el-form-item>
                      <el-form-item label="环境变量" prop="variable">
                        <span slot="label">环境变量<i class="el-icon-question"></i></span>
                        <el-table
                          :data="funReast.variable"
                          size="small"
                          border
                          element-loading-text="Loading"
                          highlight-current-row>
                          <el-table-column label="key">
                            <template slot-scope="scope">
                              <el-form :model="funReast.variable[scope.$index]">
                                <el-form-item prop="nameSpaceOne">
                                  <el-input v-show="true" v-model="funReast.variable[scope.$index].key" placeholder />
                                </el-form-item>
                              </el-form>
                            </template>
                          </el-table-column>
                          <el-table-column label="value">
                            <template slot-scope="scope">
                              <el-form ref="scope.row"  :model="funReast.variable[scope.$index]">
                                <el-form-item prop="nameSpaceTwo">
                                  <el-input v-model="funReast.variable[scope.$index].value" placeholder  />
                                </el-form-item>
                              </el-form>
                            </template>
                          </el-table-column>
                          <el-table-column label="delete">
                            <template slot-scope="scope">
                              <el-form ref="scope.row">
                                <el-form-item>
                                  <el-button  class="modelDelete" @click="spaceDelete1(scope.$index,scope.row)">delete</el-button>
                                </el-form-item>
                              </el-form>
                            </template>
                          </el-table-column>
                        </el-table>
                        <a @click="addvariable">添加环境变量</a>
                      </el-form-item>
                      <el-form-item label="内网访问" prop="valueChange">
                        <span slot="label">内网访问<i class="el-icon-question"></i></span>
                        <el-switch
                          v-model="funReast.valueChange"
                          active-color="#006eff"
                          inactive-color="#888">
                        </el-switch>
                        <div v-if="funReast.valueChange">
                          <el-select v-model="funReast.valueChangeSelect" >
                            <el-option v-for="item in funReast.valueChangeSelect" :label="item.label" :value="item.value"></el-option>
                          </el-select>
                          <p class="tipContent">
                            <span>如现有的网络不合适，您可以去控制台</span>
                            <a class="tipContentA">新建私有网络<span class="el-icon-share"></span></a>
                            <span>或</span>
                            <a class="tipContentA">新建子网<span class="el-icon-share"></span></a>
                          </p>
                        </div>
                      </el-form-item>
                    </el-form>
                  </el-dialog>
                </div>
                <div class="allConListMainCon">
                  <p>
                    <span>函数名称</span>
                    <span>fun1</span>
                  </p>
                  <p>
                    <span>运行角色</span>
                    <span>QCS_SCFExcuteRole</span>
                  </p>
                  <p>
                    <span>运行环境</span>
                    <span>Python2.7</span>
                  </p>
                  <p>
                    <span>内存</span>
                    <span>128MB</span>
                  </p>
                  <p>
                    <span>超时时间</span>
                    <span>3秒</span>
                  </p>
                  <p>
                    <span>描述</span>
                    <span>helloworld 空白模板函数</span>
                  </p>
                  <p>
                    <span>修改时间</span>
                    <span>2019-11-13 10:36:05</span>
                  </p>
                  <p>
                    <span>环境变量</span>
                    <span>无环境变量</span>
                  </p>
                  <p>
                    <span>所属网络</span>
                    <span>无VPC</span>
                  </p>
                  <p>
                    <span>所属子网</span>
                    <span>无子网</span>
                  </p>
                  <p>
                    <span>标签</span>
                    <span>
                      <span>a:b</span>
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
                        :data="modelNameSpace"
                        size="small"
                        element-loading-text="Loading"
                        highlight-current-row
                      >

                        <el-table-column label="标签键">
                          <template slot-scope="scope">
                            <el-form :model="modelNameSpace[scope.$index]">
                              <el-form-item prop="nameSpaceOne">
                                <span v-if="modelNameSpace[scope.$index].disableDelete">{{modelNameSpace[scope.$index].nameSpaceOne}}</span>
                                <el-input class="addTabsIpt"
                                  v-model="modelNameSpace[scope.$index].nameSpaceOne"
                                  v-if="!modelNameSpace[scope.$index].disableDelete"
                                  placeholder
                                  :disabled="modelNameSpace[scope.$index].disableDelete"
                                />
                              </el-form-item>
                            </el-form>
                          </template>
                        </el-table-column>
                        <el-table-column label="标签值">
                          <template slot-scope="scope">
                            <el-form ref="scope.row" :model="modelNameSpace[scope.$index]">
                              <el-form-item prop="nameSpaceTwo">
                                <el-input class="addTabsIpt"
                                  v-model="modelNameSpace[scope.$index].nameSpaceTwo"
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
            <div class="allConListMain"></div>
          </el-tab-pane>
          <el-tab-pane label="触发方式" name="third">
            <div class="allConListMain"></div>
          </el-tab-pane>
          <el-tab-pane label="运行日志" name="fouth">
            <div class="allConListMain"></div>
          </el-tab-pane>
          <el-tab-pane label="监控信息" name="fifth">
            <div class="allConListMain"></div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>
<script>
export default {
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
      dialogVisible2:false,
      modelNameSpace:[
        {
          //input,textarea绑定的参数
          nameSpaceOne: "",
          nameSpaceTwo: "",
          disableDelete:false
        },
      ],
      funReast:{
        funName:this.funtitle,
        runRole:"",
        runMoment:"Python2.7",
        storageMb:"",
        timeOutDate:"",
        description:"",
        variable:[
          {
            key:"12",
            value:"1"
          }
        ],
        valueChange:false,
        valueChangeSelect:[
          {
            value:"123",
            label:"123"
          },
          {
            value:"456",
            label:"456"
          }
        ]
      
      }
    };
  },
  mounted() {
    console.log(this.$route.query.msg);
    this.funNameTit = this.$route.query.msg;
    this.modelNameSpace[0].nameSpaceOne="default";
    this.modelNameSpace[0].nameSpaceTwo="";
    this.modelNameSpace[0].disableDelete=true;
  },
  methods: {
    handleClick(tab, event) {
      //console.log(tab, event);
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
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    handleClose2(){
      this.dialogVisible2=false;
    },
    //删除弹框标签
    spaceDelete(spaceIndex, spaceRow) {
      this.modelNameSpace.splice(spaceIndex, 1);
    },
    //编辑标签提交按钮
    sureTabAdd(){

    },
    //添加标签
    addTabs(){
      this.modelNameSpace.push({
        nameSpaceOne: "",
        nameSpaceTwo: "",
        disableDelete:false
      });
    },
    spaceDelete1(spaceIndex, spaceRow) {
      this.funReast.variable.splice(spaceIndex, 1);
    },
    //添加环境变量按钮
    addvariable(){
      this.funReast.variable.push({
        key: "",
        value: ""
      })
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
.addTabsIpt{
  margin-top:45px;
}
.tipContent{
  font-size: 12px;
  color:#888;
  span{
    float:left;
  }
  a.tipContentA{
    float:left;
    span.el-icon-share{
      float:right;
      margin: 14px 5px 0 0;
    }
  }
}
.timeOutDate{
  // width:200px!important;
  .timeOutDate1{
    width:200px;
    float:left;
  }
  span{
    float:left;
  }
}
</style>
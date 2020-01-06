<template>
  <div class="wrap">
    <div class="topFun" style="display:flex;">
      <!-- 函数服务 -->
      <span>{{ $t('SCF.total.title') }}</span>
      <el-input class="addressName" readonly="readonly" v-model="addressIpt"></el-input>
      <div>
        {{ $t('SCF.total.mmkj') }}：
        <el-select class="nameSpace" v-model="nameSpaceValue" @change="nameRoom" placeholder="default(1)" filterable>
          <el-option v-for="item in nameSpace" :key="item.Name" :label="item.label" :value="item.Name"></el-option>
        </el-select>
      </div>
      <div style="display:flex;align-items:center;height:100%;">
        <el-button class="setBtn" icon="el-icon-setting" @click="dialogVisible3 = true"></el-button>
      </div>
    </div>
    <!-- 命名空间管理弹出框 -->
    <el-dialog :title="$t('SCF.total.mmkjgl')" :visible.sync="dialogVisible3" width="800px"
      :before-close="handleClose3">
      <div class="regionTit">
        {{ $t('SCF.total.ssdy') }}
        <span>{{addressIpt}}</span>
      </div>
      <div>
        <el-table :data="modelNameSpace" size="small" element-loading-text="Loading" highlight-current-row>
          <el-table-column :label="$t('SCF.total.mmkj')">
            <template slot-scope="scope">
              <el-form :model="modelNameSpace[scope.$index]">
                <el-form-item prop="Name">
                  <el-input v-show="true" :class="{'inputactive':!modelNameSpace[scope.$index].disableDelete}"
                    @blur="inpBlur(modelNameSpace[scope.$index].Name)" v-model="modelNameSpace[scope.$index].Name"
                    :disabled="modelNameSpace[scope.$index].disableDelete" placeholder />
                  <div v-if="!modelNameSpace[scope.$index].disableDelete" :class="{'errActive':isbol}">
                    <p class="modelNameSpace">{{ $t('SCF.total.ts1') }}</p>
                    <p class="modelNameSpace">{{ $t('SCF.total.ts2') }}</p>
                  </div>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column :label="$t('SCF.total.ms')">
            <template slot-scope="scope">
              <el-form ref="scope.row" :model="modelNameSpace[scope.$index]">
                <el-form-item prop="Description">
                  <el-input v-model="modelNameSpace[scope.$index].Description" placeholder
                    :disabled="modelNameSpace[scope.$index].disableDelete&&scope.$index == 0" />
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column :label="$t('SCF.total.cz')">
            <template slot-scope="scope">
              <el-form ref="scope.row">
                <el-form-item>
                  <span v-if="modelNameSpace[scope.$index].disableDelete&&scope.$index == 0">-</span>
                  <el-button v-if="modelNameSpace[scope.$index].disableDelete && scope.$index != 0" class="modelDelete"
                    @click="spaceDelete(scope.$index,scope.row)">{{ $t('SCF.total.sc') }}</el-button>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div>
        <span @click="addNewNameSpace">
          <a href="#" v-if="!showTips">{{ $t('SCF.total.xzmmkj') }}({{this.modelNameSpace.length}}/5)</a>
          <span v-if="showTips">{{ $t('SCF.total.xzmmkj') }}{{ $t('SCF.total.me') }}</span>
        </span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible3 = false">{{ $t('SCF.total.qx') }}</el-button>
        <el-button type="primary" @click="sureNameSpaceMag(modelNameSpace)">{{ $t('SCF.total.tj') }}</el-button>
      </span>
    </el-dialog>
    <div class="mainContainer">
      <div class="mainCon">
        <div class="tableTit newClear">
          <!-- 新建按钮 -->
          <el-button size="small" type="primary" class="newCreate" @click="newCreateFun()">{{ $t('SCF.total.xj') }}
          </el-button>
          <div class="searchRight">
            <el-select :placeholder="$t('SCF.total.glbq')" v-model="filterConrent">
              <el-option :label="$t('SCF.total.hsmc')" value="SearchKey"></el-option>
              <el-option :label="$t('SCF.total.hsms')" value="Description"></el-option>
            </el-select>
            <el-input v-model="tableDataName" class="searchs" :placeholder="$t('SCF.total.ssnr')" @change="iptChange">
            </el-input>
            <el-button class="el-icon-search" @click="doFilter"></el-button>
          </div>
        </div>
        <div class="mainTable">
          <el-table :data="tableDataBegin" v-loading="loading" height="450">
            <el-table-column prop="FunctionName" :label="$t('SCF.total.hsm')">
              <template slot-scope="scope">
                <!-- 点击函数名跳转页面 -->
                <a href="#" @click="toDoDetail(scope.$index, scope.row)">{{scope.row.FunctionName}}</a>
              </template>
            </el-table-column>
            <el-table-column :label="$t('SCF.total.hszt')">
              <template slot-scope="scope">
                <p>{{State[scope.row.Status]}}</p>
              </template>
            </el-table-column>
            <el-table-column prop="monitor" :label="$t('SCF.total.jk')"></el-table-column>
            <el-table-column prop="Runtime" :label="$t('SCF.total.yxhj')"></el-table-column>
            <el-table-column prop="Description" :label="$t('SCF.total.ms')"></el-table-column>
            <!--<el-table-column prop="funTabs" label="标签" width="70px"></el-table-column>-->
            <el-table-column prop="AddTime" :label="$t('SCF.total.cjsj')"></el-table-column>
            <el-table-column prop="ModTime" :label="$t('SCF.total.xgsj')"></el-table-column>
            <el-table-column prop="operate" :label="$t('SCF.total.cz')" width="180">
              <template slot-scope="scope">
                <el-button @click.native.prevent="deleteRow(scope.$index, scope.row)" type="text" size="small">
                  {{ $t('SCF.total.sc') }}</el-button>
                <el-dialog :title="$t('SCF.total.qdsc')" :visible.sync="dialogVisible" width="30%"
                  :before-close="handleClose">
                  <!--+scope.row.funName+$t('SCF.total.m')-->
                  <span>{{ $t('SCF.total.scqd') }}</span>
                  <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">{{ $t('SCF.total.qx') }}</el-button>
                    <el-button type="primary" @click="sureDelete()">{{ $t('SCF.total.qd') }}</el-button>
                  </span>
                </el-dialog>
                <el-button type="text" size="small" @click="handelCopy(scope.$index, scope.row)">
                  {{ $t('SCF.total.fz') }}</el-button>


                  <!-- 函数复制弹框 -->
                <el-dialog :title="$t('SCF.total.hsfz')" :visible.sync="dialogVisible2" class="dialog_copy" width="38%"
                  :before-close="handleClose2">
                  <el-form ref="form" :model="copyForm" label-width="80px"   >
                    <el-form-item :label="$t('SCF.total.ssdy')" :required="true">
                      <!-- <el-select v-model="addressIpt">
                        <el-option label="北京" value="beijing"></el-option>
                        <el-option label="台北" value="taibei"></el-option>
                      </el-select>-->
                      <el-button value="ap-taipei">{{ $t('SCF.total.zgtb') }}</el-button>
                    </el-form-item>
                    <el-form-item :label="$t('SCF.total.mmkj')" :required="true">
                      <el-select v-model="copyForm.nameSpaceValue">
                        <el-option label="fun1()" value="1"></el-option>
                        <el-option label="default()" value="2"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('SCF.total.hsmc')" prop="newname">
                      <el-input v-model="newname" label-width="80px" @blur="inpBlur"></el-input>
                      <p class="tipBot">{{ $t('SCF.total.ts1') }}</p>
                      <p class="tipBot">{{ $t('SCF.total.ts2') }}</p>
                    </el-form-item>
                    <el-form-item :label="$t('SCF.total.fznr')" :required="true">
                      <el-checkbox-group v-model="copyForm.copyCont">
                        <el-checkbox :label="$t('SCF.total.hsdm')" name="copyCont"></el-checkbox>
                        <el-checkbox :label="$t('SCF.total.hspz')" name="copyCont"></el-checkbox>
                      </el-checkbox-group>
                    </el-form-item>
                    <el-form-item :label="$t('SCF.total.fghs')">
                      <el-checkbox-group v-model="copyForm.coverFun">
                        <el-checkbox :label="$t('SCF.total.hsdm')" name="coverFun"></el-checkbox>
                      </el-checkbox-group>
                    </el-form-item>
                    <el-form-item :label="$t('SCF.total.ms')">
                      <el-input type="textarea" v-model="scope.row.description"></el-input>
                      <span class="tipDecs">{{ $t('SCF.total.zc') }}</span>
                    </el-form-item>
                  </el-form>
                  <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible2 = false">{{ $t('SCF.total.qx') }}</el-button>
                    <el-button type="primary" @click="sureCopy()">{{ $t('SCF.total.qd') }}</el-button>
                  </span>
                </el-dialog>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="Right-style pagstyle">
          <span class="pagtotal">共&nbsp;{{TotalCount}}&nbsp;条</span>
          <el-pagination :page-size="pagesize" :pager-count="7" layout="prev, pager, next"
            @current-change="handleCurrentChange" :total="TotalCount"></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {
    ALL_CITY,
    SCF_LIST,
    NAME_SPACE_LIST,
    SCF_DEL,
    SCF_COPY,
    NAME_SPACE_CREAT,
    NAME_SPACE_UPD,
    NAME_SPACE_DEL
  } from "@/constants";
  export default {
    
    data() {
       var validateNewName = (rule, value, callback) => {
      if (value === "") {
        this.warnFlag = true;
        callback();
      } else {
        let reg = /^[A-Za-z]([A-Za-z0-9]|-|_){0,58}([A-Za-z0-9])$/;
        let flag = reg.test(this.form.newName);
        if (!flag) {
          this.warnFlag = true;
          callback();
        } else {
          this.warnFlag = false;
          callback();
        }
      }
    };
      return {
        TotalCount: 0,
        pagesize: 10,
        currpage: 1,
        loading: true,
        nameSpaceValue: [{}],
        nameSpace: [{}],
        addressIpt: "台灣台北",
        showTables: [],
        search: "",
        newname: "",
        allData: [],
        title: [{
          title: "123"
        }, {
          title: "456"
        }],
        tableDataBegin: [],
        tableDataName: "",
        tableDataEnd: [],
        currentPage: 1,
        totalItems: 0,
        filterTableDataEnd: [],
        flag: false,
        multipleSelection: [],
        dialogVisible: false,
        deleteIndex: "",
        deleteBegin: {},
        dialogVisible2: false,
        defaults: "",
        branches: 0,
        rules: {
        newName: [
          { validator: validateNewName, trigger: "blur", required: true }
          ]
       },
        copyForm: {
          //复制函数
          region: this.addressIpt,
          nameSpace: this.nameSpaceValue,
          funName: "",
          copyCont: [],
          coverFun: "",
          funDecs: ""
        },

        dialogVisible3: false,
        modelNameSpace: [{
          //命名空间input,textarea绑定的参数
          Name: "",
          Description: "",
          disableDelete: true
        }],
        copyIndex2: "",
        filterConrent: "選擇資源屬性進行過濾",
        showTips: false,
        isbol: false,
        State: {
          Active: "正常",
          Creating: "創建中...",
          Updating: "更新中...",
          Publishing: "發布中...",
          UpdatingAndPublishing: "更新發布中...",
          CreateFailed: "創建失敗",
          UpdateFailed: "更新失敗"
        }
      };
    },
    created() {
      this.getData();
      this.getDModelNmaeSpace();
    },
    methods: {
      inpBlur(val) {
        if (val) {
          let reg = /^[a-zA-Z][a-zA-Z0-9_-]{2,59}$/;
          let bol = reg.test(val);
          if (!bol) {
            this.isbol = true;
          } else {
            this.isbol = false;
          }
        } else {
          this.isbol = true;
        }
      },
      //命名空间的列表
      getDModelNmaeSpace() {
        let params = {
          Version: "2018-04-16",
          Region: localStorage.getItem('regionv2')
        };
        this.axios.post(NAME_SPACE_LIST, params).then(res => {
          this.nameSpace = res.Response.Namespaces;
          this.modelNameSpace = res.Response.Namespaces;
          this.modelNameSpace.reverse();
          this.modelNameSpace.forEach(item => {
            item.disableDelete = true;
          });
        });
      },
      // 添加项目列表的表格数据
      getData() {
        this.loading = true;
        var cookies = document.cookie;
        var list = cookies.split(";");
        for (var i = 0; i < list.length; i++) {
          var arr = list[i].split("=");
        }
        let params = {
          // Action: "ListFunctions",
          Offset: this.currpage,
          Limit: this.pagesize,
          Version: "2018-04-16",
          Region: localStorage.getItem('regionv2')
        };
        if (this.tableDataName !== "") {
          params[this.filterConrent] = this.tableDataName;
        }
        // 获取表格数据
        this.axios.post(SCF_LIST, params).then(res => {
          console.log(res)
          if(res.Response.Functions){
            this.tableDataBegin = res.Response.Functions;
            this.TotalCount = res.Response.TotalCount;
            this.loading = false;
          }
        });
      },
      // 搜索
      doFilter() {
        this.currpage = 1;
        this.tableDataEnd = [];
        this.getData();
        //每次手动将数据置空,因为会出现多次点击搜索情况
        this.filterTableDataEnd = [];
        //页面数据改变重新统计数据数量和当前页
        this.totalItems = this.filterTableDataEnd.length;
        //渲染表格,根据值
        this.currentChangePage(this.filterTableDataEnd);
        //页面初始化数据需要判断是否检索过
        this.flag = true;
      },
      openData() {},

      // 分页开始
      handleCurrentChange(val) {
        this.currpage = val;
        this.getData();
      },
      //组件自带监控当前页码
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
      handleClose(done) {
        this.$confirm("确认关闭？")
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
      handleClose2(done) {
        this.$confirm("确认关闭？")
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
      handleClose3(done) {
        this.$confirm("确认关闭？")
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
      //点击删除函数按钮
      deleteRow(index, dataBegin) {
        this.deleteIndex = index;
        this.deleteBegin = dataBegin;
        this.dialogVisible = true;
      },
      //删除函数的确定按钮，调用删除接口
      sureDelete() {
        let params = {
          Action: "DeleteFunction",
          Version: "2018-04-16",
          Region: localStorage.getItem('regionv2'),
          FunctionName: this.deleteBegin.FunctionName
        };
        this.axios.post(SCF_DEL, params).then(res => {
          //console.log(res);
          this.tableDataBegin.splice(this.deleteIndex, 1);
          this.totalItems -= 1;
          this.dialogVisible = false;
          this.getData();
        });
      },
      //复制函数按钮点击
      handelCopy(copyIndex, copyRow) {
        this.copyIndex2 = copyRow;
        this.dialogVisible2 = true;
      },
      //复制函数弹框的确定按钮
      sureCopy() {
        let params = {
          Version: "2018-04-16",
          Region: localStorage.getItem('regionv2'),
          FunctionName: this.copyIndex2.FunctionName,
          NewFunctionName: this.newname,
          Action: "CopyFunction"
        };
        this.axios.post(SCF_COPY, params).then(res => {
          this.getData();
          this.dialogVisible2 = false;
        });
      },
      //命名空间管理的确定按钮
      sureNameSpaceMag(modelNameSpace) {
        if (this.isbol) {
          return;
        }
        let paras = {
          Version: "2018-04-16",
          Region: localStorage.getItem('regionv2'),
        };
        //与库中数据数据对比，判断添加修改
        this.axios.post(NAME_SPACE_LIST, paras).then(res => {
          if (modelNameSpace.length > 1) {
            for (var i = 0; i < modelNameSpace.length; i++) {
              for (var w = 0; w < res.Response.Namespaces.length; w++) {
                if (modelNameSpace[i].Name != res.Response.Namespaces[w].Name) {
                  //添加
                  let params = {
                    Version: "2018-04-16",
                    Region: localStorage.getItem('regionv2'),
                    Namespace: modelNameSpace[i].Name,
                    Description: modelNameSpace[i].Description
                  };
                  this.axios.post(NAME_SPACE_CREAT, params).then(res => {
                    this.dialogVisible3 = false;
                    this.getDModelNmaeSpace();
                  });
                } else if (
                  modelNameSpace[i].Name == res.Response.Namespaces[w].Name
                ) {
                  //更新
                  let params = {
                    Version: "2018-04-16",
                    Region: localStorage.getItem('regionv2'),
                    Namespace: modelNameSpace[i].Name,
                    Description: modelNameSpace[i].Description
                  };
                  this.axios.post(NAME_SPACE_UPD, params).then(res => {
                    this.dialogVisible3 = false;
                    this.getDModelNmaeSpace();
                  });
                }
              }
            }
          } else {
            this.dialogVisible3 = false;
          }
        });
      },
      //删除命名空间
      spaceDelete(spaceIndex, spaceRow) {
        let params = {
          Version: "2018-04-16",
          Region: localStorage.getItem('regionv2'),
          Namespace: spaceRow.Name
        };
        this.axios.post(NAME_SPACE_DEL, params).then(res => {});
        this.modelNameSpace.splice(spaceIndex, 1);
      },
      iptChange() {
        if (this.tableDataName == "") {
          this.getData();
          this.currpage = 1;
        }
      },
      newCreateFun() {
        this.$router.push({
          path: "/createFun"
        });
      },
      addNewNameSpace() {
        if (this.modelNameSpace.length < 5) {
          this.modelNameSpace.push({
            Name: "",
            Description: "",
            disableDelete: false
          });
        } else if ((this.modelNameSpace.length = 5)) {
          this.showTips = true;
        }
      },
      //跳转详情页点击事件
      toDoDetail(newIndex, newRow) {
        this.$router.push({
          path: "/funSeverDetail",
          query: {
            functionName: this.tableDataBegin[newIndex].FunctionName
          }
        });
      },
      nameRoom(val) {
        var cookies = document.cookie;
        var list = cookies.split(";");
        for (var i = 0; i < list.length; i++) {
          var arr = list[i].split("=");
        }
        let params = {
          Version: "2018-04-16",
          Region: localStorage.getItem('regionv2'),
          Namespace: val
        };
        this.axios.post(SCF_LIST, params).then(res => {
          this.tableDataBegin = res.data.functions;
          // 将数据的长度赋值给totalItems
          this.totalItems = this.tableDataBegin.length;
          if (this.totalItems > this.pageSize) {
            for (let index = 0; index < this.pageSize; index++) {
              this.tableDataEnd.push(this.tableDataBegin[index]);
            }
          } else {
            this.tableDataEnd = this.tableDataBegin;
          }
        });
      }
    }
  };

</script>
<style lang="scss" scoped>
  .Right-style {
    display: flex;
    background: white;
    width: 100%;
    justify-content: flex-end;
  }

  .pagstyle {
    padding: 20px;

    .pagtotal {
      font-size: 13px;
      font-weight: 400;
      color: #565656;
      line-height: 32px;
    }
  }

  .wrap>>>.el-select,
  .wrap>>>.el-input,
  .wrap>>>.el-select .el-input__inner {
    width: 180px;
  }

  .wrap>>>input,
  .wrap>>>button {
    height: 30px;
    border-radius: 0;
    font-size: 12px;
    line-height: 30px;
    padding-top: 0 !important;
  }

  .wrap>>>button {
    padding: 0 15px;
    box-sizing: border-box;
  }

  .newClear:after {
    display: block;
    content: "";
    clear: both;
  }

  .topFun {
    width: 100%;
    height: 52px;
    background-color: #fff;
    line-height: 52px;
    border-bottom: 1px solid #eee;
    padding: 0 20px;

    button {
      float: left;
    }

    .setBtn {
      margin-left: 12px;
      border: none;
      line-height: 24px;
      font-size: 18px;
    }

    span:nth-child(1) {
      font-size: 16px;
      font-weight: 600;
      color: #000;
      float: left;
    }

    div:nth-child(3) {
      float: left;

      .nameSpace {
        height: 30px;
        width: 200px;
        border-radius: 0;

        div.el-input {
          width: 200px;

          .el-input__inner {
            display: inline-block;
            height: 30px;
            width: 200px;
            line-height: 30px;
            border-radius: 0;
          }
        }
      }
    }

    span:nth-child(5) {
      font-size: 14px;
      color: #888;
      float: right;

      a {
        color: #888;
      }
    }
  }

  .errActive p {
    color: #e1504a !important;
  }

  .addressName {
    height: 30px;
    line-height: 30px;
    border-radius: 0;
    padding: 0 20px;
    margin-top: 10px;
    float: left;
    width: 130px !important;

    input {
      height: 30px;
      border-radius: 0;
    }
  }

  .mainContainer {
    width: 100%;
    padding: 20px 20px;
    box-sizing: border-box;
  }

  .tableTit {
    padding: 0 0 10px;

    .newCreate {
      float: left;
      background-color: #2277da;
      border-color: #1f6bc4;
    }

    .searchs {
      width: 450px;
      // float: right;
    }
  }

  .searchRight {
    float: right;

  }
     .searchRight>>>      .searchs{
        margin-left: -1px;
     }
 .searchRight>>>   .el-icon-search{
   float: right;
   margin-left: -2px;
 }
  .mainTable {
    // padding:20px 0;
    width: 100%;
    min-height: 150px;
    background-color: #fff;
    border-radius: 4px;
    border: 1px solid #eee;
    box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
    .dialog_copy>>>.el-dialog{
      box-shadow: none;
    }
  }

  .tabListPage {
    background: white;
    height: 70px;
    display: flex;
    align-items: center;
    padding: 0 20px;
    box-sizing: border-box;
    justify-content: flex-end;
  }

  .tipBot {
    color: #888;
    font-size: 12px;
  }

  .regionTit {
    font-size: 14px;
    color: #888;

    span {
      margin-left: 6px;
      color: #000;
    }
  }

  .tipDecs {
    color: #888;
  }

  .el-icon-share {
    float: right;
    margin-top: 17px;
    margin-left: 5px;
  }

  .modelDelete {
    border: 0 !important;
    color: #006eff !important;
  }

  .modelNameSpace {
    font-size: 12px;
    color: #888;
    line-height: 14px;
  }

  .inputactive {
    margin-top: 45px;
  }

</style>

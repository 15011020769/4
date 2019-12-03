<template>
  <div>
    <div class="topFun">
      <span>函数服务</span>
      <el-input class="addressName" readonly="readonly" v-model="addressIpt"></el-input>
      <div>
        命名空间：
        <el-select
          class="nameSpace"
          v-model="nameSpaceValue"
          @change="nameRoom"
          placeholder="default(1)"
          filterable
        >
          <el-option
            v-for="item in nameSpace"
            :key="item.Name"
            :label="item.label"
            :value="item.Name"
          ></el-option>
        </el-select>
      </div>
      <span>
        <el-button class="setBtn" icon="el-icon-setting" @click="dialogVisible3 = true"></el-button>
      </span>
      <span>
        <a href="#">
          函数服务帮助文档
          <span class="el-icon-share"></span>
        </a>
      </span>
    </div>
    <el-dialog
      title="命名空间管理"
      :visible.sync="dialogVisible3"
      width="800px"
      :before-close="handleClose3"
    >
      <div class="regionTit">
        所属地域
        <span>{{addressIpt}}</span>
      </div>
      <div>
        <el-table
          :data="modelNameSpace"
          size="small"
          element-loading-text="Loading"
          highlight-current-row
        >
          <el-table-column label="命名空间">
            <template slot-scope="scope">
              <el-form :model="modelNameSpace[scope.$index]">
                <el-form-item prop="Name">
                  <el-input
                    v-show="true"
                    :class="{'inputactive':!modelNameSpace[scope.$index].disableDelete}"
                    @blur="inpBlur(modelNameSpace[scope.$index].Name)"
                    v-model="modelNameSpace[scope.$index].Name"
                    :disabled="modelNameSpace[scope.$index].disableDelete"
                    placeholder
                  />
                  <div
                    v-if="!modelNameSpace[scope.$index].disableDelete"
                    :class="{'errActive':isbol}"
                  >
                    <p class="modelNameSpace">1. 最多60个字符，最少2个字符</p>
                    <p class="modelNameSpace">2. 字母开头，支持 a-z，A-Z，0-9，-，_，且需要以数字或字母结尾</p>
                  </div>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column label="描述">
            <template slot-scope="scope">
              <el-form ref="scope.row" :model="modelNameSpace[scope.$index]">
                <el-form-item prop="Description">
                  <el-input
                    v-model="modelNameSpace[scope.$index].Description"
                    placeholder
                    :disabled="modelNameSpace[scope.$index].disableDelete&&scope.$index == 0"
                  />
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-form ref="scope.row">
                <el-form-item>
                  <span v-if="modelNameSpace[scope.$index].disableDelete&&scope.$index == 0">-</span>
                  <el-button
                    v-if="modelNameSpace[scope.$index].disableDelete && scope.$index != 0"
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
        <span @click="addNewNameSpace">
          <a href="#" v-if="!showTips">新增命名空间({{this.modelNameSpace.length}}/5)</a>
          <span v-if="showTips">新增命名空间（共5个命名空间，已满额）</span>
        </span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible3 = false">取 消</el-button>
        <el-button type="primary" @click="sureNameSpaceMag(modelNameSpace)">提交</el-button>
      </span>
    </el-dialog>
    <div class="mainContainer">
      <div class="mainCon">
        <div class="tableTit newClear">
          <el-button size="small" type="primary" class="newCreate" @click="newCreateFun()">新建</el-button>
          <div class="searchRight">
            <el-select placeholder="要过滤的标签" v-model="filterConrent">
              <el-option label="函数名称" value="value2"></el-option>
              <el-option label="函数描述" value="value1"></el-option>
              <el-option label="标签" value="value3"></el-option>
            </el-select>
            <el-input
              v-model="tableDataName"
              class="searchs"
              placeholder="请输入搜索内容"
              @change="iptChange"
            ></el-input>
            <el-button class="el-icon-search" @click="doFilter"></el-button>
          </div>
        </div>
        <div class="mainTable">
          <el-table :data="tableDataBegin.slice((currentPage-1)*pageSize,currentPage*pageSize)">
            <el-table-column prop="FunctionName" label="函数名">
              <template slot-scope="scope">
                <a href="#" @click="toDoDetail(scope.$index, scope.row)">{{scope.row.FunctionName}}</a>
              </template>
            </el-table-column>
            <el-table-column  label="函数状态">
               <template slot-scope="scope">
                <p>{{State[scope.row.Status]}}</p >
              </template>
            </el-table-column>
            <el-table-column prop="monitor" label="监控"></el-table-column>
            <el-table-column prop="Runtime" label="运行环境"></el-table-column>
            <el-table-column prop="Description" label="描述"></el-table-column>
            <!--<el-table-column prop="funTabs" label="标签" width="70px"></el-table-column>-->
            <el-table-column prop="AddTime" label="创建时间"></el-table-column>
            <el-table-column prop="ModTime" label="上次修改时间"></el-table-column>
            <el-table-column prop="operate" label="操作" width="180">
              <template slot-scope="scope">
                <el-button
                  @click.native.prevent="deleteRow(scope.$index, scope.row)"
                  type="text"
                  size="small"
                >删除</el-button>
                <el-dialog
                  :title="'您确定要删除'+scope.row.funName+'吗？'"
                  :visible.sync="dialogVisible"
                  width="30%"
                  :before-close="handleClose"
                >
                  <span>删除函数将永久删除函数代码及已绑定的触发器。是否确定删除此函数？</span>
                  <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="sureDelete()">确 定</el-button>
                  </span>
                </el-dialog>
                <el-button type="text" size="small" @click="handelCopy(scope.$index, scope.row)">复制</el-button>
                <el-dialog
                  title="函数复制"
                  :visible.sync="dialogVisible2"
                  width="38%"
                  :before-close="handleClose2"
                >
                  <el-form ref="form" :model="copyForm" label-width="80px">
                    <el-form-item label="所属地域" :required="true">
                      <el-select v-model="addressIpt">
                        <el-option label="北京" value="beijing"></el-option>
                        <el-option label="台北" value="taibei"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="命名空间" :required="true">
                      <el-select v-model="nameSpaceValue">
                        <el-option label="fun1()" value="1"></el-option>
                        <el-option label="default()" value="2"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="函数名称" :required="true">
                      <el-input v-model="newname" label-width="80px" @blur="inpBlur"></el-input>
                      <p class="tipBot">1. 最多60个字符，最少2个字符</p>
                      <p class="tipBot">2. 字母开头，支持 a-z，A-Z，0-9，-，_，且需要以数字或字母结尾</p>
                    </el-form-item>
                    <el-form-item label="复制内容" :required="true">
                      <el-checkbox-group v-model="copyForm.copyCont">
                        <el-checkbox label="函数代码" name="copyCont"></el-checkbox>
                        <el-checkbox label="函数配置" name="copyCont"></el-checkbox>
                      </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="覆盖目标函数">
                      <el-checkbox-group v-model="copyForm.coverFun">
                        <el-checkbox label="函数代码" name="coverFun"></el-checkbox>
                      </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="描述">
                      <el-input type="textarea" v-model="scope.row.description"></el-input>
                      <span class="tipDecs">最大支持1000个英文字母、数字、空格、逗号、句号、中文</span>
                    </el-form-item>
                  </el-form>
                  <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible2 = false">取 消</el-button>
                    <el-button type="primary" @click="sureCopy()">确 定</el-button>
                  </span>
                </el-dialog>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="tabListPage">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalItems"
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import { ALL_CITY, SCF_LIST,NAME_SPACE_LIST,SCF_DEL,SCF_COPY,NAME_SPACE_CREAT,NAME_SPACE_UPD,NAME_SPACE_DEL } from "@/constants";
export default {
  data() {
    return {
      nameSpaceValue: [{}],
      nameSpace: [{}],
      addressIpt: "中国台北",
      tableData: [
        {
          date: "1",
          name: "赵",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2",
          name: "钱",
          address: "上海市普陀区金沙江路 1517 弄"
        },
        {
          date: "2",
          name: "孙",
          address: "上海市普陀区金沙江路 1519 弄"
        },
        {
          date: "4",
          name: "李",
          address: "上海市普陀区金沙江路 1516 弄"
        }
      ],
      showTables: [],
      search: "",
      newname: "",
      allData: [],
      title: [{ title: "123" }, { title: "456" }],
      tableDataBegin: [],
      tableDataName: "",
      tableDataEnd: [],
      currentPage: 1,
      pageSize: 10,
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
      modelNameSpace: [
        {
          //命名空间input,textarea绑定的参数
          Name: "",
          Description: "",
          disableDelete: true
        }
      ],
      copyIndex2: "",
      filterConrent: "value2",
      showTips: false,
      isbol: false,
      State:{
        Active:'正常',
        Creating: '创建中...',
        Updating:'更新中...',
        Publishing: '发布中...',
        UpdatingAndPublishing:'更新发布中...',
        CreateFailed: '创建失败',
        UpdateFailed:'更新失败'
      }
    };
  },
  computed: {
    // 模糊搜索
  },
  created() {
    this.getData();
    this.getDModelNmaeSpace();
  },
  mounted() {
    //this.modelNameSpace[0].Name="default";
    // this.modelNameSpace[0].Description="";
    //this.modelNameSpace[0].disableDelete=true;
  },
  methods: {
    inpBlur(val) {
      if (val) {
        let reg = /^[a-zA-Z][a-zA-Z0-9_-]{2,59}$/;
        let bol = reg.test(val);
        console.log(bol);
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
        Region: "ap-taipei"
      };
      this.axios.post(NAME_SPACE_LIST, params).then(res => {
        this.nameSpace = res.Response.Namespaces;
        this.modelNameSpace = res.Response.Namespaces;
        this.modelNameSpace.reverse();
        //  this.modelNameSpace[0].disableDelete=true;
        this.modelNameSpace.forEach(item => {
          item.disableDelete = true;
        });
      });
    },
    // 添加项目列表的表格数据
    getData() {
      var cookies = document.cookie;
      var list = cookies.split(";");
      for (var i = 0; i < list.length; i++) {
        var arr = list[i].split("=");
      }
      let params = {
        // Action: "ListFunctions",
        Version: "2018-04-16",
        Region: "ap-guangzhou"
      };
      // 获取表格数据
      this.axios.post(SCF_LIST, params).then(res => {
        //console.log(res.Response.Functions);
        this.tableDataBegin = res.Response.Functions;
        console.log(res)
        //this.allData = this.tableDataBegin;
        //this.tableDataBegin = this.allData;
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
    },
    // 搜索
    doFilter() {
      console.log(this.filterConrent);
      // this.tableDataBegin = this.allData;
      this.tableDataEnd = [];
      //每次手动将数据置空,因为会出现多次点击搜索情况
      this.filterTableDataEnd = [];
      console.log(this.tableDataBegin);
      console.log(this.tableDataName);
      this.tableDataBegin.forEach((val, index) => {
        if (this.filterConrent == "value2") {
          if (val.functionName) {
            if (val.functionName.indexOf(this.tableDataName) !== -1) {
              this.filterTableDataEnd.push(val);
              this.tableDataBegin = this.filterTableDataEnd;
            } else {
              this.filterTableDataEnd.push();
              this.tableDataBegin = this.filterTableDataEnd;
            }
          }
          console.log(this.tableDataBegin);
        } else if (this.filterConrent == "value1") {
          if (val.description) {
            if (val.description.indexOf(this.tableDataName) == 0) {
              this.filterTableDataEnd.push(val);
              this.tableDataBegin = this.filterTableDataEnd;
            } else {
              this.filterTableDataEnd.push();
              this.tableDataBegin = this.filterTableDataEnd;
            }
          }
        } else if (this.filterConrent == "value3") {
          if (val.funTabs) {
            if (val.funTabs.indexOf(this.tableDataName) == 0) {
              this.filterTableDataEnd.push(val);
              this.tableDataBegin = this.filterTableDataEnd;
            } else {
              this.filterTableDataEnd.push();
              this.tableDataBegin = this.filterTableDataEnd;
            }
          }
        }
      });
      //页面数据改变重新统计数据数量和当前页
      this.currentPage = 1;
      this.totalItems = this.filterTableDataEnd.length;
      //渲染表格,根据值
      this.currentChangePage(this.filterTableDataEnd);

      //页面初始化数据需要判断是否检索过
      this.flag = true;
    },
    openData() {},
    // 分页开始
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.handleCurrentChange(this.currentPage);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      //需要判断是否检索
      if (!this.flag) {
        this.currentChangePage(this.tableDataEnd);
      } else {
        this.currentChangePage(this.filterTableDataEnd);
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
      console.log(index, dataBegin);
      this.deleteIndex = index;
      this.deleteBegin = dataBegin;
      this.dialogVisible = true;
    },
    //删除函数的确定按钮，调用删除接口
    sureDelete() {
      let params = {
        Action: "DeleteFunction",
        Version: "2018-04-16",
        Region: this.$cookie.get("regionv2"),
        FunctionName: this.deleteBegin.functionName
      };
      console.log(params.FunctionName);
      this.axios.post(SCF_DEL, params).then(res => {
        //console.log(res);
        this.tableDataBegin.splice(this.deleteIndex, 1);
        this.totalItems -= 1;
        this.dialogVisible = false;
      });
    },
    //复制函数按钮点击
    handelCopy(copyIndex, copyRow) {
      console.log(copyRow);
      this.copyIndex2 = copyRow;
      this.dialogVisible2 = true;
    },
    //复制函数弹框的确定按钮
    sureCopy() {
      let params = {
        Version: "2018-04-16",
        Region: this.$cookie.get("regionv2"),
        FunctionName: this.copyIndex2.FunctionName,
        NewFunctionName: this.newname,
        Action: "CopyFunction"
      };
      console.log(this.copyIndex2);
      this.axios.post(SCF_COPY, params).then(res => {
        this.getData();
        this.dialogVisible2 = false;
      });
    },
    //命名空间管理的确定按钮
    sureNameSpaceMag(modelNameSpace) {
      console.log(modelNameSpace);
      if (this.isbol) {
        return;
      }
      let paras = {
        Version: "2018-04-16",
        Region: "ap-taipei"
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
                  Region: "ap-taipei",
                  Namespace: modelNameSpace[i].Name,
                  Description: modelNameSpace[i].Description
                };
                this.axios.post(NAME_SPACE_CREAT, params).then(res => {
                  console.log(res);
                  console.log("添加");
                  this.dialogVisible3 = false;
                  this.getDModelNmaeSpace();
                });
              } else if (
                modelNameSpace[i].Name == res.Response.Namespaces[w].Name
              ) {
                //更新
                let params = {
                  Version: "2018-04-16",
                  Region: "ap-taipei",
                  Namespace: modelNameSpace[i].Name,
                  Description: modelNameSpace[i].Description
                };
                this.axios.post(NAME_SPACE_UPD, params).then(res => {
                  console.log(res);
                  console.log("更新");
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
        Region: "ap-guangzhou",
        Namespace: spaceRow.Name
      };
      this.axios.post(NAME_SPACE_DEL, params).then(res => {
        console.log(res);
      });
      this.modelNameSpace.splice(spaceIndex, 1);
    },
    iptChange() {
      if (this.tableDataName == "") {
        this.getData();
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
      console.log(val);
      var cookies = document.cookie;
      var list = cookies.split(";");
      for (var i = 0; i < list.length; i++) {
        var arr = list[i].split("=");
      }
      let params = {
        // Action: "ListFunctions",
        Version: "2018-04-16",
        Region: this.$cookie.get("regionv2"),
        Namespace: val
      };
      this.axios.post(SCF_LIST, params).then(res => {
        // console.log(res.data.functions);
        this.tableDataBegin = res.data.functions;
        //this.allData = this.tableDataBegin;
        //this.tableDataBegin = this.allData;
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
<style lang="scss">
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
.mainTable {
  // padding:20px 0;
  width: 100%;
  min-height: 150px;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #eee;
  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
}
.tabListPage {
  text-align: right;
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
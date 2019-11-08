<template>
  <div>
    <div class="topFun">
      <span>函数服务</span>
      <el-input class="addressName" readonly="readonly" v-model="addressIpt"></el-input>
      <div>
        命名空间：
        <el-select class="nameSpace" v-model="nameSpaceValue" placeholder="default(1)" filterable>
          <el-option
            v-for="item in nameSpace"
            :key="item.value"
            :label="item.label"
            :value="item.value"
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
      width="30%"
      :before-close="handleClose3"
    >
      <div class="regionTit">
        所属地域
        <span>{{addressIpt}}</span>
      </div>
      <div>
        <el-table
          :data="nameSpaceList"
          size="small"
          element-loading-text="Loading"
          highlight-current-row
        >
          <el-table-column label="命名空间">
            <template slot-scope="scope">
              <el-form :model="modelNameSpace">
                <el-form-item prop="nameSpaceOne">
                  <el-input v-show="true" v-model="modelNameSpace.nameSpaceOne" placeholder />
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column label="描述">
            <template slot-scope="scope">
              <el-form ref="scope.row" :model="modelNameSpace">
                <el-form-item prop="nameSpaceTwo">
                  <el-input type="textarea" v-model="modelNameSpace.nameSpaceTwo" placeholder />
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-form ref="scope.row" :model="modelNameSpace">
                <el-form-item>
                  <el-button @click="spaceDelete(scope.$index,scope.row)">删除</el-button>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible3 = false">取 消</el-button>
        <el-button type="primary" @click="sureNameSpaceMag()">确 定</el-button>
      </span>
    </el-dialog>
    <div class="mainContainer">
      <div class="mainCon">
        <div class="tableTit newClear">
          <el-button size="small" type="primary" class="newCreate" @click="newCreateFun()">新建</el-button>
          <el-input
            v-model="tableDataName"
            @change="doFilter"
            class="searchs"
            placeholder="请输入搜索内容"
          ></el-input>
        </div>
        <div class="mainTable">
          <el-table :data="tableDataBegin.slice((currentPage-1)*pageSize,currentPage*pageSize)">
            <el-table-column prop="funName" label="函数名"></el-table-column>
            <el-table-column prop="funStatus" label="函数状态"></el-table-column>
            <el-table-column prop="monitor" label="监控"></el-table-column>
            <el-table-column prop="runMoent" label="运行环境"></el-table-column>
            <el-table-column prop="description" label="描述"></el-table-column>
            <el-table-column prop="funTabs" label="标签" width="70px"></el-table-column>
            <el-table-column prop="createTime" label="创建时间"></el-table-column>
            <el-table-column prop="changeTime" label="上次修改时间"></el-table-column>
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
                  width="30%"
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
                      <el-input v-model="scope.row.funName"></el-input>
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
import SCF_LIST from "@/constants";
export default {
  data() {
    return {
      nameSpaceValue: "",
      nameSpace: [
        {
          value: "default(1)",
          label: "default(1)"
        },
        {
          value: "default(2)",
          label: "default(2)"
        }
      ],
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
      allData: [
        {
          funName: "函数1",
          funStatus: "正常",
          monitor: "监控",
          runMoent: "python2.7",
          description: "描述",
          funTabs: "123",
          createTime: "2019-11-07 14：05：12",
          changeTime: "2019-11-07 14：05：12"
        }
      ],
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
      deleteBegin: "",
      dialogVisible2: false,
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
      modelNameSpace: {
        //命名空间input,textarea绑定的参数
        nameSpaceOne: "",
        nameSpaceTwo: ""
      },
      nameSpaceList: [], //命名空间表格绑定的数据
      copyIndex2: ""
    };
  },
  computed: {
    // 模糊搜索
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      var cookies = document.cookie;
      var list = cookies.split(";");
      for (var i = 0; i < list.length; i++) {
        var arr = list[i].split("=");
      }
      console.log(arr[1]);
      let params = {
        // Action: "ListFunctions",
        Version: "2018-04-16",
        Region: arr[1]
      };
      //this.$axios.post('scf/ListFunctions', params).then(res => {
      //console.log(res.data);
      //this.tableDataBegin = res.data.dataTable;
      //this.allData = this.tableDataBegin;
      this.tableDataBegin = this.allData;
      // 将数据的长度赋值给totalItems
      this.totalItems = this.tableDataBegin.length;
      if (this.totalItems > this.pageSize) {
        for (let index = 0; index < this.pageSize; index++) {
          this.tableDataEnd.push(this.tableDataBegin[index]);
        }
      } else {
        this.tableDataEnd = this.tableDataBegin;
      }
      //});
    },
    // 搜索
    doFilter() {
      console.log(1);
      this.tableDataBegin = this.allData;
      this.tableDataEnd = [];
      //每次手动将数据置空,因为会出现多次点击搜索情况
      this.filterTableDataEnd = [];
      this.tableDataBegin.forEach((val, index) => {
        if (val.funName) {
          if (val.funName.indexOf(this.tableDataName) == 0) {
            this.filterTableDataEnd.push(val);
            this.tableDataBegin = this.filterTableDataEnd;
          } else {
            this.filterTableDataEnd.push();
            this.tableDataBegin = this.filterTableDataEnd;
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
      console.log(this.deleteBegin);
      this.dialogVisible = true;
      console.log(this.deleteBegin.funName);
    },
    //删除函数的确定按钮，调用删除接口
    sureDelete() {
      let params = {
        Version: "2018-04-16",
        Region: this.addressIpt,
        FunctionName: this.deleteBegin.funName
      };
      console.log(this.deleteBegin.funName);
      this.$axios.post("scf/DeleteFunction", params).then(res => {
        console.log(res);
        console.log("成功");
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
        Region: this.addressIpt,
        FunctionName: this.copyIndex2.funName,
        NewFunctionName: ""
      };
      this.$axios.post("scf/CopyFunction", params).then(res => {
        console.log(res);
        console.log("成功");
        this.dialogVisible2 = false;
      });
    },
    //命名空间管理的确定按钮
    sureNameSpaceMag() {},
    //删除命名空间
    spaceDelete(spaceIndex, spaceRow) {},
    newCreateFun() {
      this.$router.push({
        path: "/createFun"
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
  }
  .searchs {
    width: 500px;
    float: right;
  }
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
</style>
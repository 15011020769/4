<template>
  <div class="Cam">
    <div class="top">
      <i
        @click="backoff"
        class="el-icon-back"
        style="padding-right: 10px;
      font-size: 130%;
      color: #006eff;
      font-weight: 900;
      cursor:pointer;"
      ></i>
      <span class="title-left">测试接口组</span>
    </div>
    <!-- 内容 -->
    <div class="Interface">
      <div class="Interface-top">
        <div class="upper-side">
          <h3 class="information">组信息</h3>
          <el-link @click="edit" class="edit" type="primary">编辑</el-link>
        </div>
        <div v-show="flag==true">
          <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="用户组名">
              <span>测试接口组</span>
            </el-form-item>
            <el-form-item label="备注">
              <span>测试接口使用</span>
            </el-form-item>
            <el-form-item label="创建时间">
              <span>2019-11-21 11:20:10</span>
            </el-form-item>
          </el-form>
        </div>
        <div v-show="flag==false">
          <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="用户组名">
              <el-input size="small" v-model="form.user">测试接口组</el-input><i class="el-icon-circle-check mark"></i>
            </el-form-item>
            <el-form-item label="备注">
              <el-input size="small" v-model="form.remarks"></el-input><i class="el-icon-circle-check mark"></i>
            </el-form-item>
            <el-form-item label>
              <el-button size="small" type="primary">保存</el-button>
              <el-button size="small">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="tabswitch">
        <template>
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="权限（4）" name="first">
              <div class="app-cam-alert">
                <div class="app-cam-alert__info">策略被关联后，该用户组内的所有用户都将获得策略所描述的权限</div>
              </div>
              <div class="btn">
                <el-button type="primary" @click="dialogVisible = true" size="small">关联策略</el-button>
              </div>
              <el-dialog
                title="关联策略"
                :visible.sync="dialogVisible"
                width="75%"
                :before-close="handleClose"
              >
                <div class="container">
                  <div class="container-left">
                    <span>选择用户组（共{{totalNum}}条）</span>
                    <div>
                      <el-input
                        size="mini"
                        v-model="searchValue"
                        style="width:89%"
                        @keyup.enter.native="toQuery"
                      />
                      <el-button
                        size="mini"
                        class="suo"
                        icon="el-icon-search"
                        show-overflow-tooltip
                        @click="toQuery"
                      ></el-button>
                    </div>
                    <el-table
                      class="table-left"
                      ref="multipleOption"
                      :data="policiesData"
                      height="300"
                      tooltip-effect="dark"
                      style="width: 100%; border:1px solid #ddd"
                      @row-click="selectedRow"
                      @selection-change="handleSelectionChange"
                    ></el-table>
                  </div>
                  <div class="abs">
                    <div>&nbsp;</div>
                  </div>

                  <div class="container-left">
                    <span>已选择（共条）</span>
                    <el-table
                      class="table-left"
                      ref="multipleSelected"
                      :data="policiesSelectedData"
                      tooltip-effect="dark"
                      height="300"
                      style="width: 100%;border:1px solid #ddd"
                    >
                      <el-table-column label="用户组"></el-table-column>
                    </el-table>
                  </div>
                </div>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="dialogVisible = false">取 消</el-button>
                  <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
                </span>
              </el-dialog>
              <div>
                <el-table :data="tableData" style="width: 100%; border:1px solid #ddd;">
                  <el-table-column label="策略名">
                    <template slot-scope="scope">
                      <span>
                        {{ scope.row.user }}
                        <i class></i>
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column label="关联时间">
                    <template slot-scope="scope">
                      <span>{{ scope.row.date }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <el-link type="primary">解除</el-link>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-tab-pane>
            <el-tab-pane label="用户(0)" name="second">
              <div class="addbtn">
                <el-button @click="dialog = true" size="small" type="primary">添加用户</el-button>
                <el-button size="small" disabled>默认按钮</el-button>
              </div>
              <el-dialog
                title="关联策略"
                :visible.sync="dialog"
                width="75%"
                :before-close="handleClose"
              >
                <div class="container">
                  <div class="container-left">
                    <span>选择用户组（共{{totalNum}}条）</span>
                    <div>
                      <el-input
                        size="mini"
                        v-model="searchValue"
                        style="width:89%"
                        @keyup.enter.native="toQuery"
                      />
                      <el-button
                        size="mini"
                        class="suo"
                        icon="el-icon-search"
                        show-overflow-tooltip
                        @click="toQuery"
                      ></el-button>
                    </div>
                    <el-table
                      class="table-left"
                      ref="multipleOption"
                      :data="policiesData"
                      height="300"
                      tooltip-effect="dark"
                      style="width: 100%; border:1px solid #ddd"
                      @row-click="selectedRow"
                      @selection-change="handleSelectionChange"
                    ></el-table>
                  </div>
                  <div class="abs">
                    <div>&nbsp;</div>
                  </div>

                  <div class="container-left">
                    <span>已选择（共条）</span>
                    <el-table
                      class="table-left"
                      ref="multipleSelected"
                      :data="policiesSelectedData"
                      tooltip-effect="dark"
                      height="300"
                      style="width: 100%;border:1px solid #ddd"
                    >
                      <el-table-column label="用户组"></el-table-column>
                    </el-table>
                  </div>
                </div>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="dialog = false">取 消</el-button>
                  <el-button type="primary" @click="dialog = false">确 定</el-button>
                </span>
              </el-dialog>
              <div>
                <el-table
                  ref="multipleTable"
                  :data="data"
                  tooltip-effect="dark"
                  style="width: 100%; border:1px solid #ddd"
                  @selection-change="handleSelectionChange"
                >
                  <el-table-column type="selection" width="55"></el-table-column>
                  <el-table-column label="用户名称">
                    <template slot-scope="scope">{{ scope.row.name }}</template>
                  </el-table-column>
                  <el-table-column prop="name" label="创建时间">
                    <template slot-scope="scope">{{ scope.row.time }}</template>
                  </el-table-column>
                  <el-table-column prop="address" label="备注" show-overflow-tooltip>
                    <template slot-scope="scope">{{ scope.row.remarks }}</template>
                  </el-table-column>
                  <el-table-column label="操作">
                    <template slot-scope="scope"></template>
                  </el-table-column>
                </el-table>
              </div>
            </el-tab-pane>
          </el-tabs>
        </template>
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage4"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="10"
            layout="total, sizes, prev, pager, next, jumper"
            :total="40"
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      flag: true,
      activeName: "first",
      dialog: false,
      dialogVisible: false,
      form: {
        user: "测试接口组",
        remarks: "测试接口使用"
      },
      //   权限数据
      tableData: [
        {
          user: "QCloudResourceFullAccess",
          date: "2016-05-02"
        },
        {
          user: "QCloudResourceFullAccess",
          date: "2016-05-04"
        },
        {
          user: "QCloudResourceFullAccess",
          date: "2016-05-01"
        },
        {
          user: "QCloudResourceFullAccess",
          date: "2016-05-03"
        }
      ],
      //   用户数据
      data: []
    };
  },
  methods: {
    edit() {
      this.flag = !this.flag;
      if (this.flag == true) {
      } else if (this.flag == false) {
      }
    },
    backoff() {
      this.$router.push({ path: "UserGroup" });
    },
    onSubmit() {
      console.log("submit!");
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    }
  }
};
</script>
<style lang="scss" scoped>
.Cam {
  .top {
    height: 45px;
    line-height: 45px;
    padding: 0 20px;
    background: #fff;
    .title-left {
      font-size: 14px;
      font-weight: bolder;
    }
    .title-right {
      float: right;
      span:hover {
        color: #006eff;
        border-bottom: 1px solid #006eff;
      }
    }
  }
  .Interface {
    background-color: #f2f2f2;
    padding: 20px;
  }
  .Interface-top {
    font-size: 12px;
    width: 100%;
    padding: 20px;
    
    margin: 0 auto;
    background: #fff;
    margin-bottom: 20px;
  }
  .upper-side {
    height: 30px;
  }
  .upper-side .information {
    float: left;
  }
  .upper-side .edit {
    float: right;
  }
  .el-form-item {
    margin: 0;
  }
  .el-form-item__label {
    text-align: left;
  }
  .tabswitch {
    font-size: 12px;
    width: 100%;
    padding: 20px;
    margin: 0 auto;
    background: #fff;
  }
  .app-cam-alert,
  .app-cam-alert__info {
    font-size: 12px;
    line-height: inherit;
  }
  .app-cam-alert {
    padding: 10px 30px 10px 20px;
    vertical-align: middle;
    color: #003b80;
    border: 1px solid #97c7ff;
    border-radius: 2px;
    background: #e5f0ff;
    position: relative;
    box-sizing: border-box;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 20px;
  }
  .btn {
    display: flex;
    width: 100%;
    align-items: center;
    height: 50px;
  }
  .container {
    width: 96%;
    height: 270px;
    min-height: 360px;
    margin: 10px auto 0;
    background: #fff;
    padding: 20px;
    p.title,
    p.explain {
      text-align: center;
      line-height: 20px;
      font-size: 16px;
      color: #000;
      font-weight: 700;
    }
    p.explain {
      font-size: 12px;
      color: #ccc;
      margin-top: 10px;
      line-height: 16px;
      color: #666;
    }
    .abs {
      display: inline-block;
      width: 100px;
      height: 300px;
      text-align: center;
    }
    .container-left {
      width: 44%;
      display: inline-block;
    }
  }
  .el-dialog__footer {
    text-align: center;
  }
  .block {
    text-align: right;
    margin-top: 10px;
  }
  .addbtn {
    margin-bottom: 10px;
  }
  .el-form-item__label {
    text-align: left;
  }
  .el-input {
    width: 20%;
  }
  .mark{
      color: #0ABF5B;
      margin-left: 10px;
  }
}
</style>
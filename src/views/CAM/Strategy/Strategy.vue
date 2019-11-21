<template>
  <div class="Cam">
    <div class="top">
      <div class="top-left">
        <span class="top-text">策略</span>
        <el-select size="mini" v-model="value" placeholder="全部策略">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            size="mini"
          ></el-option>
        </el-select>
      </div>
      <div class="top-right">
        <span class="right-text">
          <a href>CAM策略使用说明</a>
        </span>
        <i class="el-icon-share"></i>
      </div>
    </div>
    <div class="container">
      <div class="contant">
        <p class="contant_top">用户或者用户组与策略关联后，即可获得策略所描述的操作权限。</p>
        <div class="table_opare">
          <div>
            <el-button plain size="small">删除</el-button>
          </div>
          <div>
            <el-input v-model="input" placeholder="支持搜索策略名称/描述/备注" size="small">
              <i slot="suffix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </div>
        </div>
        <div class="table">
          <el-table
            :data="tableData"
            height="610"
            border
            style="width: 100%"
            :row-style="{height:0}"
            :cell-style="{padding:'5px 10px'}"
            :header-cell-style="{height:'20px',padding:'0px 10px'}"
          >
            <el-table-column type="selection" width="60"></el-table-column>
            <el-table-column prop="date" label="策略名" width="150">
              <template slot-scope="scope">
                <el-button @click="handleClick(scope)" type="text" size="small">{{scope.row.date}}</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="描述"></el-table-column>
            <el-table-column align="center" width="150">
              <template slot="header" slot-scope="scope">
                <el-dropdown trigger="click" @command="handleCommand" size="mini">
                  <span style="color:#909399">
                    {{ tableTitle }}
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      v-for="item in table_options"
                      :key="item.value"
                      :command="item.label"
                    >{{item.label}}</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
            <el-table-column prop="address" label="操作" width="150">
              <template slot-scope="scope">
                <el-button @click="handleClick_user(scope)" type="text" size="small">关联用户/组</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div
          style="background:#fff;padding:10px;display:flex;justify-content: space-between;line-height:30px"
        >
          <div>
            <span style="font-size:12px;color:#888">已选 0 项，共 309 项</span>
          </div>
          <div>
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="currentPage2"
              :page-sizes="[100, 200, 300, 400]"
              :page-size="100"
              layout="sizes, prev, pager, next"
              :total="1000"
            ></el-pagination>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title :visible.sync="dialogVisible" width="40%" :before-close="handleClose">
      <h3 style="color:#000;margin-bottom:20px;">关联用户/用户组</h3>
      <div class="dialog_div">
        <el-transfer
          v-model="transfer_value"
          :props="{key: 'value',label: 'desc'}"
          :data="transfer_data"
          filterable
        ></el-transfer>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      options: [
        {
          value: "选项1",
          label: "全部策略"
        },
        {
          value: "选项2",
          label: "自定义策略"
        },
        {
          value: "选项3",
          label: "预设策略"
        }
      ],
      value: "",
      input: "",
      tableData: [
        {
          date: "AdministratorAccess",
          name:
            "该策略允许您管理账户内所有用户及其权限、财务相关的信息、云服务资产。",
          address: "智能物联网关"
        },
        {
          date: "	ReadOnlyAccess",
          name:
            "该策略允许您只读访问账户内所有支持接口级鉴权或资源级鉴权的云服务资产。",
          address: "API网关"
        },
        {
          date: "AdministratorAccess",
          name:
            "该策略允许您管理账户内所有用户及其权限、财务相关的信息、云服务资产。",
          address: "智能物联网关"
        },
        {
          date: "	ReadOnlyAccess",
          name:
            "该策略允许您只读访问账户内所有支持接口级鉴权或资源级鉴权的云服务资产。",
          address: "API网关"
        },
        {
          date: "AdministratorAccess",
          name:
            "该策略允许您管理账户内所有用户及其权限、财务相关的信息、云服务资产。",
          address: "智能物联网关"
        },
        {
          date: "	ReadOnlyAccess",
          name:
            "该策略允许您只读访问账户内所有支持接口级鉴权或资源级鉴权的云服务资产。",
          address: "API网关"
        },
        {
          date: "AdministratorAccess",
          name:
            "该策略允许您管理账户内所有用户及其权限、财务相关的信息、云服务资产。",
          address: "智能物联网关"
        },
        {
          date: "	ReadOnlyAccess",
          name:
            "该策略允许您只读访问账户内所有支持接口级鉴权或资源级鉴权的云服务资产。",
          address: "API网关"
        },
        {
          date: "AdministratorAccess",
          name:
            "该策略允许您管理账户内所有用户及其权限、财务相关的信息、云服务资产。",
          address: "智能物联网关"
        },
        {
          date: "	ReadOnlyAccess",
          name:
            "该策略允许您只读访问账户内所有支持接口级鉴权或资源级鉴权的云服务资产。",
          address: "API网关"
        }
      ],
      table_options: [
        {
          value: "选项1",
          label: "全部服务"
        },
        {
          value: "选项2",
          label: "智能物联网关"
        },
        {
          value: "选项3",
          label: "API网关"
        }
      ],
      table_value: "",
      tableTitle: "服务类型",
      currentPage1: 5,
      currentPage2: 5,
      currentPage3: 5,
      currentPage4: 4,
      dialogVisible: false,
      transfer_value: [],
      transfer_data: [
        {
          value: 1,
          desc: "备选项1"
        },
        {
          value: 2,
          desc: "备选项2"
        },
        {
          value: 3,
          desc: "备选项3"
        }
      ]
    };
  },
  methods: {
    handleCommand(command) {
      console.log(command);
      this.tableTitle = command;
    },
    handleClick(scope) {
      console.log(scope);
      this.$router.push("/StrategyDetail");
    },
    handleSizeChange() {},
    handleCurrentChange() {},
    handleClick_user() {
      this.dialogVisible = true;
    },
    handleClose() {}
  }
};
</script>
<style lang="scss" scoped>
.Cam {
  height: 100%;
  .top {
    padding: 10px 20px;
    background: #fff;
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    .top-left {
      font-size: 16px;
      font-weight: 700;
      .top-text {
        margin-right: 15px;
      }
    }
    .top-right {
      line-height: 30px;
      cursor: pointer;
      .right-text {
        margin-right: 10px;
      }
    }
  }
  .container {
    .contant {
      max-width: 96%;
      margin: 0 auto;
      .contant_top {
        font-size: 12px;
        line-height: inherit;
        padding: 10px 30px 10px 20px;
        vertical-align: middle;
        color: #003b80;
        border: 1px solid #97c7ff;
        border-radius: 2px;
        background: #e5f0ff;
        position: relative;
        box-sizing: border-box;
        max-width: 96%;
        margin-bottom: 20px;
      }
      .table_opare {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
      }
      .dialog_div {
        text-align: center;
      }
    }
  }
}
</style>

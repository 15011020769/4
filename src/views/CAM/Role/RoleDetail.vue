<template>
  <div class="RoleDetail">
    <div class="top">
      <img
        style="width:20px;cursor: pointer;"
        @click="back"
        src="../../../assets/CAM/images/left.png"
        alt
      >
      <span class="top_text">CloudAudit_QCSRole</span>
    </div>
    <div class="container">
      <div class="baseInfo">
        <p class="baseInfo_title">角色信息</p>
        <div class="baseInfo_flex">
          <div class="baseInfo_left">
            <p class="baseInfo_cl item">角色名称</p>
            <p class="baseInfo_ms item">RoleArn</p>
            <p class="baseInfo_mark item">角色ID</p>
            <p class="baseInfo_type item">角色描述</p>
            <p class="baseInfo_time item">创建时间</p>
          </div>
          <div class="baseInfo_right">
            <p class="baseInfo_cl item">CloudAudit_QCSRole</p>
            <p class="baseInfo_ms item">qcs::cam::uin/100011921910:roleName/CloudAudit_QCSRole</p>
            <p class="baseInfo_type item">4611686018427967128</p>
            <p class="baseInfo_mark item">
              <el-input
                v-if="input_show"
                v-model="input_Value"
                size="mini"
                style="width:150px"
                placeholder="请输入内容"
              ></el-input>
              <a
                v-if="input_show"
                @click="input_sure"
                style="margin-left:10px"
                href="javascript:;"
              >确定</a>
              <a
                v-if="input_show"
                @click="input_cancel"
                style="margin-left:10px"
                href="javascript:;"
              >取消</a>
              <span v-if="!input_show">{{inputValue}}</span>
              <i
                v-if="!input_show"
                @click="icon_click"
                style="cursor: pointer;"
                class="el-icon-edit item"
              ></i>
            </p>
            <p class="baseInfo_time item">2016-06-02 19:40:09</p>
          </div>
        </div>
      </div>
      <div class="tabs">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="已授权策略" name="first">
            <p style="margin:10px">
              <el-button type="primary" @click="Relation_user" size="small">关联策略</el-button>
              <el-button
                type="primary"
                @click="Relation_user"
                size="small"
                :disabled="firstDisplay"
              >批量解除策略</el-button>
            </p>
            <div class="first_table">
              <el-table
                :data="first_tableData"
                height="300"
                border
                @selection-change="first_handleSelectionChange"
                :row-style="{height:0}"
                :cell-style="{padding:'5px 10px'}"
                :header-cell-style="{height:'20px',padding:'0px 10px'}"
                style="width: 100%"
              >
                <el-table-column type="selection" width="60"></el-table-column>
                <el-table-column prop="date" label="策略名">
                  <template slot-scope="scope">
                    <el-button
                      @click="first_handleClick(scope)"
                      type="text"
                      size="small"
                    >{{scope.row.date}}</el-button>
                  </template>
                </el-table-column>
                <el-table-column align="center">
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
                <el-table-column prop="startTime" label="关联时间"></el-table-column>
                <el-table-column prop="endTime" label="失效时间"></el-table-column>
                <el-table-column prop="address" label="操作">
                  <template slot-scope="scope">
                    <a href="javascript:;" @click="Relation_user">删除</a>
                  </template>
                </el-table-column>
              </el-table>
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
          </el-tab-pane>
          <el-tab-pane label="角色载体" name="second">
            <div class="config">
              <p style="margin:10px">
                <el-button type="primary" @click="Relation_user" size="small">关联用户/用户组</el-button>
              </p>
              <div class="config_table">
                <el-table
                  :data="second_tableData"
                  height="300"
                  border
                  @selection-change="handleSelectionChange"
                  :row-style="{height:0}"
                  :cell-style="{padding:'5px 10px'}"
                  :header-cell-style="{height:'20px',padding:'0px 10px'}"
                  style="width: 100%"
                >
                  <el-table-column prop="date" label="角色载体"></el-table-column>
                  <el-table-column prop="address" label="操作" >
                    <template slot-scope="scope">
                      <el-button size="mini" disabled >解除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
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
          </el-tab-pane>
          <el-tab-pane label="撤销会话" name="third">
            <p>
              <el-popover
                placement="top-start"
                title
                width="200"
                trigger="hover"
                content="您无法撤销服务角色的活跃会话"
              >
                <div slot="reference" style="display:inline-block">
                  <el-button disabled>撤销所有会话</el-button>
                </div>
              </el-popover>
            </p>
          </el-tab-pane>
        </el-tabs>
      </div>
      <el-dialog :visible.sync="dialogVisible" width="25%" :before-close="handleClose">
        <h3 slot="title">风险提醒</h3>
        <p
          style="line-height: 20px;padding: 0;background: #fff;font-size: 12px;margin-bottom: 27px;color: #444;"
        >该角色为您授权的服务角色，擅自更改角色内容（角色关联策略或者角色载体）可能导致您授权的服务无法正确使用该角色。</p>
        <p style="text-align:center" slot="footer">
          <el-button @click="dialogVisible = false" size="small">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false" size="small">确 定</el-button>
        </p>
      </el-dialog>
      <el-dialog :visible.sync="Relieve_dialogVisible" width="30%" :before-close="handleClose">
        <p class="dialog">解除用户/组</p>
        <div style="margin:15px 0">
          <p>
            已选择1个用户/组，
            <a href="javascript:;" @click="look_detail">查看详情</a>
            <i v-if="!isShow" class="el-icon-caret-bottom"></i>
            <i v-if="isShow" class="el-icon-caret-top"></i>
          </p>
          <div v-if="isShow" class="box">
            <p class="list" v-for="item in RelieveData" :key="item">{{item}}</p>
          </div>
          <h3 style="margin-top:15px">确认是否解除？</h3>
          <p>解除后，以上策略关联的用户或用户组将失去对应的权限。</p>
        </div>
        <p style="text-align:center">
          <el-button @click="Relieve_dialogVisible = false" size="small">取 消</el-button>
          <el-button type="primary" @click="Relieve_dialogVisible = false" size="small">确 定</el-button>
        </p>
      </el-dialog>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      activeName: "first",
      first_tableData: [
        {
          date: "2343535",
          name: "用户",
          address: "解除用户",
          startTime: "2018-12-14",
          endTime: "2019-11-11"
        }
      ],
      second_tableData: [
        {
          date: "2343535",
          name: "用户",
          address: "解除用户",
          startTime: "2018-12-14",
          endTime: "2019-11-11"
        }
      ],
      table_options: [
        {
          value: "选项1",
          label: "全部"
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
      firstDisplay: true,
      tableTitle: "策略类型",
      currentPage1: 5,
      currentPage2: 5,
      currentPage3: 5,
      currentPage4: 4,
      dialogVisible: false,
      Relieve_dialogVisible: false,
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
      ],
      display: true,
      RelieveData: [],
      isShow: false,
      popover_visible: false,
      inputValue: "-",
      input_Value: "",
      input_show: false
    };
  },
  methods: {
    handleClick() {},
    Relation_user() {
      this.dialogVisible = true;
    },
    Relieve_user() {
      this.Relieve_dialogVisible = true;
    },
    handleCommand(command) {
      this.tableTitle = command;
    },
    handleSizeChange() {},
    handleCurrentChange() {},
    handleClose() {},
    first_handleSelectionChange(val) {
      if (val.length != 0) {
        this.firstDisplay = false;
      } else {
        this.firstDisplay = true;
      }
    },
    look_detail() {
      this.isShow = !this.isShow;
    },
    icon_click() {
      this.input_show = true;
      this.input_Value = this.inputValue;
    },
    input_cancel() {
      this.input_show = false;
    },
    input_sure() {
      this.inputValue = this.input_Value;
      this.input_show = false;
    },
    back() {
      this.$router.push("/Role");
    }
  }
};
</script>
<style lang="scss" scoped>
.RoleDetail {
  .top {
    padding: 20px;
    background-color: #fff;
    margin-bottom: 20px;
    .top_text {
      font-size: 16px;
      font-weight: 700;
      vertical-align: bottom;
      margin-left: 20px;
    }
  }
  .container {
    max-width: 1360px;
    margin: 0 auto;
    .baseInfo {
      padding: 20px;
      background: #fff;
      margin-bottom: 20px;
      .baseInfo_title {
        font-size: 14px;
        color: #000;
        font-weight: 600;
        line-height: 30px;
        color: #000;
        margin-bottom: 11px;
        height: 30px;
      }
      .baseInfo_flex {
        display: flex;
        color: #888;
        .item {
          padding-bottom: 20px;
        }
        .baseInfo_right {
          padding-left: 20px;
        }
        .baseInfo_left {
          .baseInfo_type {
            padding-bottom: 40px;
          }
        }
      }
    }
    .tabs {
      background: #fff;
      padding: 20px;
      .markdown {
        width: 725px;
        height: 300px;
        background-color: #ddd;
      }
    }
    .dialog {
      color: #000;
      font-weight: 700;
      line-height: 26px;
      font-size: 14px;
    }
    .box {
      height: 125px;
      width: 360px;
      overflow: auto;
      border: 1px solid #ccc;
      .list {
        padding-left: 10px;
        cursor: pointer;
      }
      .list:hover {
        background: #f4f4f4;
      }
    }
  }
}
</style>

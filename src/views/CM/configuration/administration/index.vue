<template>
  <div class="admin-wrap">
    <Header :backShow="backShow" title="test1"></Header>
    <div class="admin-main">
      <div class="box">
        <!-- <div class="box_content"> -->
        <div class="box_first">
          <h3>指标基本配置</h3>
          <span>
            <i class="el-icon-edit"></i>
            <a >编辑</a>
          </span>
        </div>

        <div class="box_send">
          <p>命名空间</p>
          <span>test1</span>
        </div>

        <div class="box_dime">
          <p>维度</p>
          <span>1,2,3</span>
        </div>

        <div class="box_form">
          <p>指标</p>
          <div class="box_formtable">
            <el-table :data="tableData" style="width: 100%" height="200">
              <el-table-column prop="date" label="指标" width="180"></el-table-column>
              <el-table-column prop="name" label="指标中文" width="180"></el-table-column>
              <el-table-column prop="address" label="单位">%</el-table-column>
            </el-table>
          </div>
        <!-- </div> -->
        </div> 
      </div>
      <div class="indexdetail">
        <div class="indexdetail_head">
          <h2>指标详细配置</h2>
          <div class="explain" style="margin-bottom:20px;">
            <p>您可在指标详情中配置统计方式和聚合维度，配置统计方式的指标才可正常上报数据</p>
          </div>
        </div>
        <div class="indexdetail_content">
          <el-tabs
            v-model="editableTabsValue"
            type="cord"
            @edit="handleTabsEdit"
            tab-position="left"
            stretch
          >
            <el-tab-pane label="聚合维度(1)" name="first">
              <div class="tab_right">
                <h2>指标统计方式</h2>
                <p class="page_first">
                  <el-button type="primary">配置指标</el-button>
                </p>
                <el-table :data="tableData" style="width: 100%" height="100">
                  <el-table-column prop="address" label="指标" width="180"></el-table-column>
                  <el-table-column prop="address" label="统计方法"></el-table-column>
                  <el-table-column prop="address" label="统计周期" width="180"></el-table-column>
                  <el-table-column prop="address" label="操作"></el-table-column>
                </el-table>
                <div class="explains" style="margin-bottom:20px;">
                  <p>以此为通用告警管理，如需要对特定的监控对象配置告警规则和告警接收组，请至监控对象详情页进行配置。</p>
                </div>
                <p class="page_nav">
                  <el-button type="primary" size="small">配置告警</el-button>
                </p>
                <el-table :data="tableData" style="width: 100%" height="450">
                  <el-table-column prop="address" label="指标" width="180"></el-table-column>
                  <el-table-column prop="address" label="触发条件"></el-table-column>
                  <el-table-column prop="address" label="告警接收组" width="180"></el-table-column>
                  <el-table-column prop="address" label="操作"></el-table-column>
                </el-table>
              </div>
            </el-tab-pane>

            <el-tab-pane label="原始维度(1,2,3)" name="second">
              <div class="tab_right">
                <h2>指标统计方式</h2>
                <p class="page_first">
                  <el-button type="primary">配置指标</el-button>
                </p>
                <el-table :data="tableData" style="width: 100%" height="100">
                  <el-table-column prop="address" label="指标" width="180"></el-table-column>
                  <el-table-column prop="address" label="统计方法"></el-table-column>
                  <el-table-column prop="address" label="统计周期" width="180"></el-table-column>
                  <el-table-column prop="address" label="操作"></el-table-column>
                </el-table>
                <div class="explains" style="margin-bottom:20px;">
                  <p>以此为通用告警管理，如需要对特定的监控对象配置告警规则和告警接收组，请至监控对象详情页进行配置。</p>
                </div>
                <p class="page_nav">
                  <el-button type="primary" size="small">配置告警</el-button>
                </p>
                <el-table :data="tableData" style="width: 100%" height="450">
                  <el-table-column prop="address" label="指标" width="180"></el-table-column>
                  <el-table-column prop="address" label="触发条件"></el-table-column>
                  <el-table-column prop="address" label="告警接收组" width="180"></el-table-column>
                  <el-table-column prop="address" label="操作"></el-table-column>
                </el-table>
              </div>
            </el-tab-pane>
            <!-- <el-tab-pane label="新增聚合维度"  @click="addTab(editableTabsValue)" style="margin-top:20px">新增聚合维度</el-tab-pane> -->
          </el-tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "@/components/public/Head";
// import Custom from "./custom/custom"
export default {
  name: "admin",
  data() {
    return {
      tabPosition: "left",
      backShow: true,
      activeName: "first",
      value: 1,
      dialogVisible: false, //新增配置弹框
      input: "", //搜索框的值
      tableData: [],
      //city选择
      options: [],
      values: "",
      //管理表格
      editableTabsValue: "2",
      tableData: []
    };
  },
  components: {
    Header
    // Custom,
  },
  methods: {
    handleTabsEdit(targetName, action) {
      if (action === "add") {
        let newTabName = ++this.tabIndex + "";
        this.editableTabs.push({
          title: "New Tab",
          name: newTabName,
          content: "New Tab content"
        });
        this.editableTabsValue = newTabName;
      }
      if (action === "remove") {
        let tabs = this.editableTabs;
        let activeName = this.editableTabsValue;
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.name;
              }
            }
          });
        }
        this.editableTabsValue = activeName;
        this.editableTabs = tabs.filter(tab => tab.name !== targetName);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.admin-wrap >>> .el-select {
  margin-left: 20px;
  border: 0px;
}
.el-tabs {
  border: 0;
}
.el-tabs >>> .el-tabs__item {
  border: 1px solid #9c9c9c;
}

.el-tabs >>> .is-active {
  border-left: 3px solid red;
  border-right: 0;
}
.box {
  background: white;
  padding: 10px 20px 20px 20px;
  margin-bottom: 20px;
  .box_send,.box_dime {
    display: flex;
    margin: 25px 0;
    font-size: 14px;
    p {
      width: 100px;
    }
  }
  .box_first {
      display: flex;
    h3 {
      font-size: 16px;
      font-weight: 600;
      margin-right: 26px;
    }
    span {
      font-size: 15px;
    }
  }
  .box_form {
    width: 100%;
    display:flex;
    p{
        width: 100px;
    }
  }
  .box_formtable {
    width: 80%;
    border: 1px solid #ccc;
  }
}
.indexdetail {
  padding: 20px;
  background: white;
  .indexdetail_head {
    h2 {
      margin-bottom: 20px;
    }
  }
  .indexdetail_content {
    width: 100%;
    .tab_right {
      width: 100%;
      border: 1px solid #ccc;
      padding: 20px 20px;
      h2 {
        margin: 0 -20px;
      }
      .page_first >>> .el-button {
        margin: 20px -20px;
      }
    }
  }
}
.admin-main {
  padding: 20px;
}
.explain {
  padding: 10px 30px 10px 20px;
  vertical-align: middle;
  color: #003b80;
  border: 1px solid #97c7ff;
  background: pink;
  p {
    font-size: 11px;
    line-height: 18px;
  }
}
.explains {
  padding: 10px 30px 10px 20px;
  vertical-align: middle;
  color: #003b80;
  border: 1px solid #97c7ff;
  background: pink;
  margin: 0 -20px;
  p {
    font-size: 11px;
    line-height: 18px;
  }
}
.el-tabs >>> .el-tabs__item {
  width: 300px;
  height: 50px;
  text-align: left;
}
.el-tabs--left.el-tabs__nav-wrap.is-left::after {
  left: "";
}
.page_nav {
  width: 100%;
  background: #cfcfcf;
  margin: 0 -20px;
  > .el-button {
    margin: 0 0 10px 0;
  }
}
</style>  
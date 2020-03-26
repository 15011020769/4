<template>
  <div class="admin-wrap">
    <Header :backShow="backShow" title="test1"></Header>
    <div class="admin-main">
      <div class="box">
        <!-- <div class="box_content"> -->
        <div class="box_first">
          <h3>指標基本配置</h3>
          <span>
            <i class="el-icon-edit"></i>
            <a >編輯</a>
          </span>
        </div>

        <div class="box_send">
          <p>命名空間</p>
          <span>test1</span>
        </div>

        <div class="box_dime">
          <p>維度</p>
          <span>1,2,3</span>
        </div>

        <div class="box_form">
          <p>指標</p>
          <div class="box_formtable">
            <el-table :data="tableDatas" style="width: 100%" height="200">
              <el-table-column prop="date" label="指標" ></el-table-column>
              <el-table-column prop="name" label="指標中文" ></el-table-column>
              <el-table-column prop="address" label="單位">%</el-table-column>
            </el-table>
          </div>
        <!-- </div> -->
        </div>
      </div>
      <div class="indexdetail">
        <div class="indexdetail_head">
          <h2>指標詳細配置</h2>
          <div class="explain" style="margin-bottom:20px;">
            <p>您可在指標詳情中配置統計方式和聚合維度，配置統計方式的指標才可正常上報數據</p>
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
            <el-tab-pane label="聚合維度(1)" name="first">
              <div class="tab_right">
                <h2>指標統計方式</h2>
                <p class="page_first">
                  <el-button type="primary" @click="pageindex">配置指標</el-button>
                </p>
                <el-table :data="tableData" style="width: 100%" height="100">
                  <el-table-column prop="address" label="指標" width="180"></el-table-column>
                  <el-table-column prop="address" label="統計方法"></el-table-column>
                  <el-table-column prop="address" label="統計週期" width="180"></el-table-column>
                  <el-table-column prop="address" label="操作"></el-table-column>
                </el-table>
                <div class="explains" style="margin-bottom:20px;">
                  <p>以此爲通用告警管理，如需要對特定的監控物件配置告警規則和告警接收組，請至監控物件詳情頁進行配置。</p>
                </div>
                <p class="page_nav">
                  <el-button type="primary" size="small" @click="warings">配置告警</el-button>
                </p>
                <el-table :data="tableData" style="width: 100%" height="450">
                  <el-table-column prop="address" label="指標" width="180"></el-table-column>
                  <el-table-column prop="address" label="觸發條件"></el-table-column>
                  <el-table-column prop="address" label="告警接收組" width="180"></el-table-column>
                  <el-table-column prop="address" label="操作"></el-table-column>
                </el-table>
              </div>
            </el-tab-pane>

            <el-tab-pane label="原始維度(1,2,3)" name="second">
              <div class="tab_right">
                <h2>指標統計方式</h2>
                <p class="page_first">
                  <el-button type="primary" @click="pageindex">配置指標</el-button>
                </p>
                <el-table :data="tableData" style="width: 100%" height="100">
                  <el-table-column prop="address" label="指標" width="180"></el-table-column>
                  <el-table-column prop="address" label="統計方法"></el-table-column>
                  <el-table-column prop="address" label="統計週期" width="180"></el-table-column>
                  <el-table-column prop="address" label="操作"></el-table-column>
                </el-table>
                <div class="explains" style="margin-bottom:20px;">
                  <p>以此爲通用告警管理，如需要對特定的監控物件配置告警規則和告警接收組，請至監控物件詳情頁進行配置。</p>
                </div>
                <p class="page_nav">
                  <el-button type="primary" size="small" @click="warings">配置告警</el-button>
                </p>
                <el-table :data="tableData" style="width: 100%" height="450">
                  <el-table-column prop="address" label="指標" width="180"></el-table-column>
                  <el-table-column prop="address" label="觸發條件"></el-table-column>
                  <el-table-column prop="address" label="告警接收組" width="180"></el-table-column>
                  <el-table-column prop="address" label="操作"></el-table-column>
                </el-table>
              </div>
            </el-tab-pane>
            <el-button @click="addTab" style="margin-top:20px">新增聚合維度</el-button>
          </el-tabs>
        </div>
      </div>
    </div>
    <Pageindex :dialogVisible="dialogVisible" @cancel="cancel" @save="save"></Pageindex>
    <warings :dialogVisibles="dialogVisibles" @dele="dele" @yes="yes"/>
    <!-- <Newoage :dialogVisiblenew="dialogVisiblenew" @deletes="deletes" @shows="shows"/> -->
  </div>
</template>

<script>
import Header from "@/components/public/Head";
import Pageindex from "../pageindex/index.vue";
import Warings from "../warings/index.vue"
// import Newpage from "../newpage/index.vue"
export default {
  name: "admin",
  data() {
    return {
      tabPosition: "left",
      backShow: true,
      activeName: "first",
      value: 1,
      dialogVisible: false, //新增配置彈框
      dialogVisibles: false,
      // dialogVisiblenew: false,
      input: "", //搜索框的值
      tableData: [],
      //city選擇
      options: [],
      values: "",
      //管理表格
      editableTabsValue: "2",
      tableDatas: [{
          date:"aa",
          name:"內存",
          address:"%"
      }]
    };
  },
  components: {
    Header,
    Pageindex,
    Warings,
    // Newpage
  },
  methods: {
    pageindex(){
       this.dialogVisible = true;
    },
    warings(){
      this.dialogVisibles = true;
    },
    addtab(){
      this.dialogVisiblenew = true;
    },
    cancel(){
      this.dialogVisible = false;
    },
    save(){
      this.dialogVisible = false;
    },
    dele(){
      this.dialogVisibles = false;
    },
    yes(){
      this.dialogVisibles = false;
    },
    // deletes(){
    //   this.dialogVisiblenew = false;
    // },
    // shows(){
    //   this.dialogVisiblenew = false;
    // },

  }
};
</script>

<style lang="scss" scoped>
.admin-wrap >>> .el-button{
    height: 30px;
    line-height: 0px;
    border-radius: 0;
    cursor: pointer;
}
.admin-wrap >>> .el-select {
  margin-left: 20px;
  border: 0px;
}
.el-tabs {
  border: 0;
}
.admin-wrap >>> .el-tabs--left .el-tabs__active-bar.is-left, .el-tabs--left .el-tabs__nav-wrap.is-left::after{
    right:1;
    left:none;
}
.el-tabs >>> .el-tabs__item {
    border: 1px solid #dce0e8;
    border-bottom: 0;
    padding-left:22px;
    font-size: 14px;
    cursor: pointer;
}

.el-tabs >>> .is-active{
    color: #0071cc;
    border-left: 3px solid #2277da;
    padding-left: 20px;
    border-right-color: #fff;
    // border-bottom: 0;
}
.box {
  background: white;
  padding: 10px 20px 20px 20px;
  margin-bottom: 20px;
  .box_send,.box_dime {
    display: flex;
    margin: 25px 0;
    font-size: 13px;
    p {
      width: 100px;
    }
  }
  .box_first {
      display: flex;
      margin-top:20px;
    h3 {
      font-size: 15px;
      font-weight: 600;
      font-family: "微软雅黑";

      margin-right: 26px;
    }
    span {
      font-size: 15px;
      a:hover{
          cursor: pointer;
      }
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
    border-bottom:0;
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
        font-weight: 600;
        font-size: 14px;
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
    background: #e5f0ff;
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
    background: #e5f0ff;
  margin: 0 -20px;
  p {
    font-size: 11px;
    line-height: 18px;
  }
}
.el-tabs >>> .el-tabs__item {
  width: 300px;
  height: 62px;
  text-align: left;line-height: 62px;
}
.el-tabs--left.el-tabs__nav-wrap.is-left::after {
  left: "";
}
.page_nav {
    width: 110%;
    background-color: #f2f2f2;
    margin: 0 -20px;
    >.el-button {
        margin: 0 0 10px 0;
    }
}
</style>

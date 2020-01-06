<template>
  <div class="history-wrap">
    <div class="head">
      <Header title="监控视图">
        <el-select v-model="values" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        
        <el-select v-model="values" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>

        <el-select v-model="values" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </Header>
      <el-tabs v-model="activeName">
        <el-tab-pane label="原始维度(1,2,3)" name="first">
          <div class="history-main">
            <div class="explain" style="margin-bottom:20px;">
              <p>
                新版自定义监控以灰度上线，目前处于内侧阶段，如需使用可<a href="">申请内侧体验</a>。
              </p>
              <p>
                若在使用过程中遇到任何问题，您可以通过加入自定义监控交流QQ群（793979710），我们将竭诚为您服务!
              </p>
            </div>
            <div class="box">
              <div class="table">
                <el-table :data="tableData" style="width: 100%" height="450">
                  <el-table-column prop="address" label="监控对象" width="180"></el-table-column>
                  <el-table-column prop="address" label="监控" width="100"></el-table-column>
                  <el-table-column prop="address" label="cpu(5分钟，最大值)"></el-table-column>
                </el-table>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import Header from "@/components/public/Head";
import XTimeX from "@/components/public/TimeN";
export default {
  name: "history",
  data() {
    return {
      activeName: "first",
      value: 1,
      dialogVisible: false, //购买短信弹出框
      input: "", //搜索框的值
      tableData: [],
      //下拉框
      options:[],
      values:"",
    };
  },
  components: {
    Header,
    XTimeX,
    // Ecarts
  },
  created() {},
  methods: {
  },
};
</script>

<style lang="scss" scoped>
.history-wrap >>> .el-select{
  margin-left:20px;
}
.history-wrap >>> .header{
  border: 0;
  margin-bottom: -8px;
}
.history-wrap >>> .el-tabs__header {
  margin: 0;
  padding: 0 20px;
  box-sizing: border-box;
}
.history-wrap >>> .el-button,
.history-wrap >>> .el-input__inner {
  height: 30px;
  border-radius: 0;
  padding-top: 0;
  line-height: 30px;
  font-size: 12px;
}
.history-wrap {
  .head {
    background: white;
  }
  .Right-style {
    display: flex;
    justify-content: flex-end;

    .esach-inputL {
      width: 300px;
      margin-right: 20px;
    }
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
  a {
    color: #006eff;
    cursor: pointer;
  }
  .cursor {
    cursor: pointer;
  }
  .history-main {
    padding: 20px;
    box-sizing: border-box;
    background: #f2f2f2;
    .box {
      background: white;
      padding: 20px;
      padding-bottom: 0;
      box-sizing: border-box;
    }
  }
}
.explain {
  padding: 10px 30px 10px 20px;
  vertical-align: middle;
  color: #c07400;
  border:1px solid  #ffd18b;
  background: #fff4e3;
  p {
    font-size: 11px;
    line-height: 18px;
  }
}
</style>
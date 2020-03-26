<template>
  <div class="history-wrap">
    <div class="head">
      <Header title="監控視圖">
        <el-select v-model="value1" placeholder="請選擇">
            <el-option
            v-for="item in option1"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
        </el-select>

         <el-select v-model="value2" placeholder="請選擇">
            <el-option
            v-for="item in option2"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
        </el-select>

         <el-select v-model="value3" placeholder="請選擇">
            <el-option
            v-for="item in option3"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
        </el-select>
      </Header>
      <el-tabs v-model="activeName" @tab-click="tabchange">
        <el-tab-pane label="聚合維度(1)" name="first">
          <div class="history-main">
            <div class="explain" style="margin-bottom:20px;">
                <p>新版自定義監控已灰度上線，目前處于內測階段，如需使用可 <a href="">申請內測體驗 </a> 。</p>
                <p>若在使用過程中遇到任何問題，您可以通過加入自定義監控交流QQ群（793979710），我們將竭誠爲您服務！</p>
            </div>
            <div class="box">
              <div class="table">
                <el-table :data="tableData" style="width: 100%" height="450">
                  <el-table-column prop="address" label="監控對象" width="180"></el-table-column>
                  <el-table-column prop="address" label="監控"></el-table-column>
                </el-table>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="原始維度(1,2,3)" name="second">
          <div class="history-main">
            <div class="explain" style="margin-bottom:20px;">
                <p>新版自定義監控已灰度上線，目前處于內測階段，如需使用可 <a href="">申請內測體驗 </a> 。</p>
                <p>若在使用過程中遇到任何問題，您可以通過加入自定義監控交流QQ群（793979710），我們將竭誠爲您服務！</p>
            </div>
            <div class="box">
              <div class="table">
                <el-table :data="tableData" style="width: 100%" height="450">
                  <el-table-column prop="address" label="監控對象" width="180"></el-table-column>
                  <el-table-column prop="address" label="監控" width="180"></el-table-column>
                  <el-table-column prop="address" label="aa(5分鍾，最大值)"></el-table-column>
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
export default {
  name: "history",
  data() {
    return {
      activeName: "first",
      value: 1,
      value1:"",
      value2:"",
      value3:"",
      dialogVisible: false, //購買簡訊彈出框
      input: "", //搜索框的值
      tableData: [],
      option1:[],
      option2:[],
      option3:[],
    };
  },
  components: {
    Header,
  },
  created() {},
  methods: {
    //獲取數據
    GetDat(data) {
      console.log(data);
    },
    tabchange(tab,event){
        // console.log(tab,event)

    }
  }
};
</script>

<style lang="scss" scoped>
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
    .el-select{
        margin-left:20px;
    }
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

    .icons {
      display: flex;
      align-items: center;

      i {
        font-size: 15px;
        color: #666;
        margin-left: 5px;
        cursor: pointer;
        padding: 5px;
        box-sizing: border-box;
      }
      i:hover {
        background: #f2f2f2;
      }
    }

    .box {
      background: white;
      padding: 20px;
      padding-bottom: 0;
      box-sizing: border-box;
    }
    .table-top {
      display: flex;
      margin-bottom: 10px;
      .seek {
        width: 240px;
        display: flex;
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
  }
}
</style>

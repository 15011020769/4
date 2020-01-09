<template>
  <div class="create-wrap">
    <Header title="新建消息策略" backShow="true"></Header>
    <div class="create-main">
      <div class="box">
        <p class="rowCont">
          <span>策略名称</span>
          <el-input
            style="width:330px;margin:0"
            v-model="formInline.strategy_name"
            placeholder="1-20个中英文字符或下划线"
          ></el-input>
        </p>
        <p class="rowCont">
          <span style="margin-bottom:110px">备注</span>
          <el-input
            style="width:330px;"
            :autosize="{ minRows: 5, maxRows: 2}"
            type="textarea"
            placeholder="1-100个中英文字符或下划线"
            v-model="formInline.textarea"
            maxlength="100"
            show-word-limit
          ></el-input>
        </p>

        <p class="rowCont">
          <span>策略类型</span>
          <el-select v-model="formInline.strategy" style="width:100px;">
            <el-option
              v-for="(item,index) in formInline.strategy_kind"
              :key="index"
              :label="item.name"
              :value="item.value"
              label-width="40px"
            ></el-option>
          </el-select>
        </p>
        <p class="rowCont">
          <span>所属项目</span>
          <el-select v-model="formInline.projectName" style="width:100px;">
            <el-option
              v-for="(item,index) in formInline.project"
              :key="index"
              :label="item.name"
              :value="item.value"
              label-width="40px"
            ></el-option>
          </el-select>
        </p>
        <div class="qudao">
          <span>告警渠道</span>
          <div class="qudaoContent"></div>
        </div>
        <div class>
          <span>触发条件</span>
          <div class="qudaoContent"></div>
        </div>


        <div class="foot">
          <el-button type="primary" size="small" @click="save">完成</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Header from "@/components/public/Head";
export default {
  data() {
    return {
      input: "",
      input1: "",
      tableData: [],
      options: [],
      values: "",
      formInline: {
        strategy_name: "", //策略名称
        textarea: "", //备注
        strategy: "云服务器-基础监控",
        strategy_kind: [
          {
            value: 0,
            name: "云服务器-基础监控"
          }
        ], //策略类型
        alarm: "", //策略类型
        projectName: "默认项目",
        project: [
          {
            value: 0,
            name: "默认项目"
          }
        ]
      }
    };
  },
  components: {
    Header
  },
  methods: {
    //确定
    save() {
      this.$router.push({
        path: "/message"
      });
    }
  },
  destroyed() {}
};
</script>
<style lang="scss" scoped>
.create-wrap >>> .el-button,
.create-wrap >>> .el-input__inner {
  height: 30px;
  border-radius: 0;
  padding-top: 0;
  line-height: 30px;
  font-size: 12px;
}
.create-main {
  padding: 20px 35px;
}
.box {
  width: 100%;
  height: 100%;
  color: #888;
  background: white;
  padding: 20px;
  font-size: 12px;
  box-shadow: 1px 1px 5px #cccccc;
  p.rowCont {
    padding: 10px 0;
    span {
      display: inline-block;
      width: 70px;

    }
  }
  input {
    margin: 0;
  }
  > div {
    margin-top: 20px;
    span {
      display: inline-block;
      width: 80px;
    }
  }
  
  .table {
    margin-top: 20px;
  }
  .foot {
    // margin: 10px;
    padding-top: 20px;
    border-top: 1px solid #ccc;
  }
}
.box >>> .el-input {
  width: 200px;
  height: 30px;
  margin-left: 20px;
}
</style>
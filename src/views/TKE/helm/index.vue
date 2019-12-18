<template>
  <div class="helm-wrap">
    <HeadCom title="Helm应用"></HeadCom>
    <div class="wrap">
      <div class="wrap-bnt">
        <button type="button" disabled="disabled">新建</button>
      </div>
      <div class="helm-titleWrap">
        <div class="helm-titleBox">
          <p>Helm应用管理仅支持kubernetes 1.8以上版本的集群。</p>
        </div>
      </div>
      <div class="helm-table">
        <template>
          <el-table :data="tableData" style="width: 100%" height="450">
            <el-table-column label="应用名" width="180"></el-table-column>
            <el-table-column label="状态" width="180"></el-table-column>
            <el-table-column label="版本号"></el-table-column>
            <el-table-column label="创建时间" width="180"></el-table-column>
            <el-table-column label="Chart仓库" width="180"></el-table-column>
            <el-table-column label="Chart命名空间"></el-table-column>
            <el-table-column label="Chart版本" width="180"></el-table-column>
            <el-table-column label="操作"></el-table-column>
          </el-table>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import HeadCom from "@/components/public/Head";
export default {
  name: "helm",
  components: {
    HeadCom
  },
  data() {
    return {
      tableData: []
    };
  }
};
</script>

<style lang="scss" scoped>
.wrap {
  width: 100%;
  .wrap-bnt {
    width: 100%;
    padding: 20px 0 20px 20px;
    box-sizing: border-box;
    button {
      height: 30px;
      padding: 0 20px;
      background-color: #006eff;
      color: #fff;
      border: 1px solid #006eff;
      line-height: 30px;
      text-align: center;
      outline: 0 none;
      box-sizing: border-box;
      text-decoration: none;
      font-size: 12px;
    }
  }
  .helm-titleWrap {
    width: 100%;
    padding: 0px 20px 20px 20px;
    box-sizing: border-box;
    .helm-titleBox {
      color: #c07400;
      padding: 10px 30px 10px 20px;
      border: 1px solid #ffd18b;
      border-radius: 2px;
      background: #fff4e3;
      box-sizing: border-box;
    }
  }
  .helm-table {
    width: 100%;
    padding: 0px 20px 0 20px;
    box-sizing: border-box;
  }
}
</style>
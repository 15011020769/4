<template>
  <div class="newdFeeds-wrap">
    <HeadCom title="通知公告"></HeadCom>
    <div class="wrap">
      <div class="wrap-button">
        <el-button type="primary" :disabled="disabled">添加接收人</el-button>
        <el-button type="primary" :disabled="disabled">移除接收人</el-button>
      </div>
      <div class="wrap-table">
        <template>
          <el-table :data="tableData" style="width: 100%" height="450">
            <el-table-column  label="消息类型" width="180"></el-table-column>
            <el-table-column  label="站内信" width="180"></el-table-column>
            <el-table-column  label="邮件"></el-table-column>
            <el-table-column  label="短信" width="180"></el-table-column>
            <el-table-column  label="微信" width="180"></el-table-column>
            <el-table-column  label="企业微信"></el-table-column>
            <el-table-column  label="语音" width="180"></el-table-column>
            <el-table-column  label="接收人" width="180"></el-table-column>
            <el-table-column  label="操作"></el-table-column>
         </el-table>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import HeadCom from "@/components/public/Head";
export default {
  components: {
    HeadCom
  },
  name: "newdFeeds",
  data() {
    return {
      disabled: true,
      tableData: []
    };
  }
};
</script>

<style lang="scss" scoped>
.newdFeeds-wrap >>> .el-button {
  height: 30px;
  line-height: 30px;
  border-radius: 0;
  font-size: 12px;
  padding-top: 0;
}
.wrap {
  width: 100%;
  .wrap-button {
    width: 100%;
    padding: 20px 0px 20px 20px;
    box-sizing: border-box;
  }
  .wrap-table {
    width: 100%;
    padding: 0px 20px 0 20px;
    box-sizing: border-box;
  }
}
</style>
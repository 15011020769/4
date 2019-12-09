<template>
  <div class="wrap">
      <el-dialog
                  title="删除用户"
                  :visible.sync="dialogDeleteUser"
                  width="50%"
                  :before-close="handleClose"
                >
                  <p>以下用户存在删除前置处理项 禁用并删除 API 密钥：</p>
                  <div class="explainDelet">
                    <p>需要您注意的是， API 密钥删除后无法恢复，请您确认清楚再进行删除。用户被删除后，该用户无法登录腾讯云以及接收消息通知，同时会解除关联权限。</p>
                  </div>
                  <template>
                    <el-table style="width: 100%" >
                      <el-table-column label="用户名" width="180"></el-table-column>
                      <el-table-column prop="name" label="账户ID" width="180"></el-table-column>
                      <el-table-column prop="address" label="密钥ID"></el-table-column>
                      <el-table-column prop="address" label="创建时间"></el-table-column>
                      <el-table-column prop="address" label="状态"></el-table-column>
                      <el-table-column prop="address" label="操作"></el-table-column>
                    </el-table>
                  </template>
                  <span slot="footer" class="dialog-footer">
                    <el-button @click="handleClose">取 消</el-button>
                    <el-button type="primary" @click="confirm">确 定</el-button>
                  </span>
      </el-dialog>
  </div>
</template>
<script>
export default {
   data(){
     return {
     }
   },
   props:{
     dialogDeleteUser:false
   },
   methods:{
      handleClose(){
        this.$emit('suerClose')
      },
      confirm(){
         this.$emit('confirm')
      }
   }
}
</script>
<style scoped>
   .explainDelet {
  width: 100%;
  font-size: 12px;
  padding: 10px 30px 10px 20px;
  vertical-align: middle;
  color: #003b80;
  border: 1px solid #97c7ff;
  border-radius: 2px;
  background: #e5f0ff;
  position: relative;
  box-sizing: border-box;
  margin-top: 15px;
  color: #c07400;
  border-color: #ffd18b;
  background-color: #fff4e3;
}
</style>
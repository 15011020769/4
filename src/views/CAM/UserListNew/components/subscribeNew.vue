<template>
  <div class="wrap">
    <el-dialog title="订阅信息" :visible.sync="subscribe" width="700px" :before-close="handleClose">
      <div class="title">
        <p class="title-p">
          要管理不同消息类型的接收人及接收方式可以前往
          <a href>
            消息中心-消息订阅
            <i class="external-link-icon"></i>
          </a>
        </p>
      </div>
      <div class="letter">
        <div class="receive">
          <label>消息接收人</label>
        </div>
        <div class="number">
          <p>123123123123123</p>
        </div>
      </div>
      <div class="subs">
        <label>订阅消息类型</label>
      </div>
      <el-menu style="border:1px solid #ccc">
        <div style="border-bottom:1px solid #ccc">
                <div class="tab-top">
                  <el-checkbox v-model="checked"></el-checkbox>
                  <span>全部</span>
                </div>
        </div>
        
        <el-submenu index="1">
         
          
          <template slot="title">
            <el-checkbox v-model="checked"></el-checkbox>
            <span>财务消息</span>
          </template>
          <el-menu-item-group>
            <el-checkbox class="bor" v-model="checked2">
              账户欠费通知
              <span>站内信，邮件，短信，微信</span>
            </el-checkbox>
            <el-checkbox class="bor" v-model="checked2">
              账户提现通知
              <span>站内信，邮件，短信</span>
            </el-checkbox>
            <el-checkbox class="bor" v-model="checked2">
              余额预警通知
              <span>站内信，邮件，短信，微信</span>
            </el-checkbox>
            <el-checkbox class="bor" v-model="checked2">
              账单出账通知
              <span>站内信，邮件，短信</span>
            </el-checkbox>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="handleClose">确 定</el-button>
        <el-button size="small" @click="confirm">取 消</el-button>
      </div>
    </el-dialog>
  </div>      
</template>
<script>
export default {
    data() {
      return {
        checked2: true,
        checked: true,
      }
    },
    props:{
      subscribe:false
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
<style lang="scss" scoped>
    .title {
      width: 100%;
      font-size: 12px;
      padding: 10px 30px 10px 20px;
      vertical-align: middle;
      color: #003b80;
      border: 1px solid #97c7ff;
      border-radius: 2px;
      background: #e5f0ff;
      position: relative;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      margin-left: auto;
      margin-right: auto;
    }
    .letter {
      margin-bottom: 30px;
      width: 100%;
      margin-top: 20px;
    }
    .receive {
      text-align: center;
      display: inline-block;
    }
    .number {
      display: inline-block;
    }
   .subs {
      text-align: left;
      padding-bottom: 20px;
    }
  .tab-top{
      width: 100%;
      height: 56px;
      line-height: 56px;
      margin-left:20px; 
  }
   .bor {
      margin:0 0 0 20px;
      width: 100%;
      height: 30px;
      line-height: 30px;
    }
</style>
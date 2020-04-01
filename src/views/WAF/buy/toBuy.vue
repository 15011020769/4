<template>
  <!-- <div> -->
    <!-- <div class="topHead"></div> -->
    <div class="wrapper">
      <div class="content">
        
        <h1>{{t('欢迎使用负载均衡WAF(CLBWAF)', 'WAF.hysywaf')}}</h1>
        <p>{{t('台富云负载均衡WAF（CLBWAF）为台富云所有使用负载均衡产品（7层）的用户提供一站式Web安全解决方案，通过创建CLBWAF实例绑定负载均衡监听器，对所有经过负载均衡的HTTP/HTTPs进行旁路检测和防护，最大限度减少安全防护对网站稳定性的影响，保护网站稳定运行。', 'WAF.wafsykjy')}}</p>
        <p>{{t('CLBWAF通过提供AI +规则双引擎防护Web漏洞攻击，通过BOT行为管理对抗机器人、爬虫、恶意刷量等行为，通过共享台富云大数据威胁情报和攻防对抗最佳实践对抗最新威胁，保护网站基础设施、核心业务安全，一站式解决网站安全问题，保障网站安全无忧。', 'WAF.zydwzfh')}}</p>
        <img src="~@/assets/WAF/waf-describe.png" />
        <div class="botBtn">
          <el-button class="immeBuy" @click="immeBuy">{{t('立即购买', 'WAF.ljgm')}}</el-button>
        </div>
      </div>
    </div>
  <!-- </div> -->
</template>
<script>
export default {
  data(){
    return{
      imgUrl1:require("./img/img1.png"),
      imgUrl2:require("./img/img2.png"),
      imgUrl3:require("./img/img3.png"),
      imgUrl4:require("./img/img4.png"),
    }
  },
  methods:{
    //立即购买
    immeBuy(){
      this.$router.push({
        name:'choose'
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.wrapper{
  background-color:#fff;
  width:100%;
  height: 100%;
  .content{
  height: 100%;
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: center;
    max-width: 860px;
    margin-left: auto;
    margin-right: auto;
    h1{
      font-size:16px;
      font-weight:600;
      color:#000;
      text-align:center;
      margin-bottom: 30px;
    }
    p {
      color: #666;
      text-indent: 25px;
      line-height: 30px;
      margin-bottom: 20px;
    }
  }
}
.botBtn{
  text-align: center;
  .immeBuy{
    height:30px;
    border-radius: 0;
    color:#fff;
    background-color:#ff9700;
    line-height:30px;
    padding:0 20px;
    margin-top:20px;
  }
}

</style>
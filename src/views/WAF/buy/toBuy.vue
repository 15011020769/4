<template>
  <div>
    <div class="topHead"></div>
    <div class="wrapper">
      <div class="content">
        
        <h1>{{t('欢迎使用Web应用防火墙', 'WAF.hysywaf')}}</h1>
        <h2>{{t('Web应用防火墙是一款基于网站防护的一站式安全服务平台，可以为网站开发者提供网站入侵防护、业务访问风险、网站传播护航等安全服务', 'WAF.wafsykjy')}}</h2>
        <div class="boxAll newClear">
          <div class="boxC">
            <div>
              <img :src="imgUrl1" width="80" height="80" alt="">
            </div>
            <p class="litTitle">{{t('专业的网站防护能力', 'WAF.zydwzfh')}}</p>
            <p class="botPcon">{{t('千余条防御规则全面防护各种Web入侵攻击，专业攻防团队7*24小时实时防护', 'WAF.qwtfhg')}}</p>
          </div>
          <div class="boxC">
            <div>
              <img :src="imgUrl2" width="80" height="80" alt="">
            </div>
            <p class="litTitle">{{t('及时的补订修复保障', 'WAF.jsdbdxf')}}</p>
            <p class="botPcon">
              {{t('12h内更新高危漏洞补丁', 'WAF.ngxgwld')}}<br/>
              {{t('24h更新常见通用型漏洞补丁', 'WAF.gxcjlg')}}<br/>
              {{t('云端自动升级 秒级同步下发', 'WAF.ydzdsj')}}
            </p>
          </div>
          <div class="boxC">
            <div>
              <img :src="imgUrl3" width="80" height="80" alt="">
            </div>
            <p class="litTitle">{{t('稳定的高可用业务保障', 'WAF.wddgky')}}</p>
            <p class="botPcon" style="text-align: center;">
              {{t('BGP线路接入 多地容灾', 'WAF.bgpxljr')}}<br/>
              {{t('一键DNS接入 隐藏源站', 'WAF.yjdnsjr')}}<br/>
              {{t('一键大流量BGP高防整合', 'WAF.yjdll')}}
            </p>
          </div>
          <div class="boxC">
            <div>
              <img :src="imgUrl4" width="80" height="80" alt="">
            </div>
            <p class="litTitle">{{t('常见web攻击防护', 'WAF.cjwebsj')}}</p>
            <p class="botPcon">{{t('防御SQL注入、XSS跨站脚本、Web服务器插件漏洞等常见攻击', 'WAF.fysqlzr')}}</p>
          </div>
        </div>
        <div class="botBtn">
          <el-button class="immeBuy" @click="immeBuy">{{t('立即购买', 'WAF.ljgm')}}</el-button>
        </div>
      </div>
    </div>
  </div>
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
.newClear:after{
  content:'';
  display:block;
  clear:both;
}
.topHead{
  width:100%;
  height:50px;
  background-color:#fff;
  border-bottom:1px solid #ddd;
}
.wrapper{
  width:100%;
  padding:20px;
  .content{
    box-shadow: 0 2px 3px #e2e9ee;
    border:1px solid #ddd;
    background-color:#fff;
    padding:80px 0;
    h1{
      font-size:16px;
      font-weight:600;
      color:#000;
      text-align:center;
    }
    h2{
      font-size:14px;
      text-align:center;
      color:#666;
      margin:20px 0;
    }
    .boxAll{
      margin:40px 0 40px;
      text-align:center;
      width:920px;
      margin:0 auto;
    }
    .boxC{
      border:1px solid #ddd;
      padding:20px;
      width:210px;
      height:210px;
      float:left;
      margin-right:20px;
    }
    .boxC:bth-child(4){
      margin-right:0;
    }
    .litTitle{
      font-size:14px;
      color:#666;
      margin-top:12px;
    }
    .botPcon{
      margin-top: 15px;
      font-size: 12px;
      color: #888;
      line-height: 20px;
      text-align: left;
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
<template>
  <div class="first">
    <p class="title">基本信息</p>
    <div class="box">
      <p>CNAME</p>
      <p>{{details.TargetDomain}}</p>
    </div>
    <div class="box">
      <p>创建时间</p>
      <p>{{details.CreateTime}}</p>
    </div>
    <div class="box">
      <p>类型</p>
      <p>{{filterType[details.Type]}}</p>
    </div>
    <div class="box">
      <p>API Key</p>
      <p>f5ad1c36d3cb7d48fe43e72d5dc028c4</p>
    </div>
  </div>
</template>
<script>
  import {
    DOMAIN_DELTILS
  } from '@/constants'
  export default {
    data() {
      return {
        name: this.$route.query.name,
        details: {},
        filterType: {
          '0': '推流域名',
          '1': '播放域名'
        }
      }
    },
    created() {
      this.Getdetails()
    },
    methods: {
      Getdetails() {
        const param = {
          Version: '2018-08-01',
          DomainName: this.name
        };
        // 获取表格数据
        this.axios.post(DOMAIN_DELTILS, param).then(data => {
          if (data.Response.Error == undefined) {
            this.details = data.Response.DomainInfo
            console.log(this.details)
          } else {
            this.$message.error(data.Response.Error.Message);
          }
        });
      }
    },
  }

</script>
<style lang="scss" scoped>
  .first {
    background: #fff;
    padding: 20px;

    .title {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 10px;
    }

    .box {
      display: flex;
      height: 30px;
      line-height: 30px;

      p:first-child {
        width: 70px;
        color: rgb(136, 136, 136);
        font-size: 12px;
      }
    }
  }

</style>

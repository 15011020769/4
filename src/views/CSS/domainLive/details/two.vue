<template>
  <div class="first">
    <p class="title">鉴权配置</p>
    <div class="box">
      <p>推流鉴权</p>
      <p>{{filterType[details.Enable]}}</p>
    </div>
    <div class="box">
      <p>主KEY</p>
      <p>{{details.MasterAuthKey}}</p>
    </div>
    <div class="box">
      <p>备KEY</p>
      <p>{{details.BackupAuthKey}}</p>
    </div>

  </div>
</template>
<script>
  import {
    FLOWKEY_DELTILS
  } from '@/constants'
  export default {
    data() {
      return {
        name: this.$route.query.name,
        details: {},
        filterType: {
          '0': '关闭',
          '1': '启用'
        }
      }
    },
    created() {
      this.GetFLOWkey()
    },
    methods: {
      GetFLOWkey() {
        const param = {
          Version: '2018-08-01',
          DomainName: this.name
        };
        // 获取表格数据
        this.axios.post(FLOWKEY_DELTILS, param).then(data => {
          if (data.Response.Error == undefined) {
            this.details = data.Response.PushAuthKeyInfo
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

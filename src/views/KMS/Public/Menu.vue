<template>
  <div class="kms">
    <div class="big-title">{{ $t('KMS.total.title') }} KMS</div>
    <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose"
      background-color="#292b36" text-color="#fff" active-text-color="#fff" :router="true">
      <el-menu-item @click="_class" :class="{'active':classValue=='userKms'}">
        <span slot="title">{{ $t('KMS.total.subMenu') }}</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
  import {
    SERV_KMS,
  } from '@/constants'
  export default {
    data() {
      return {
        classValue: '',
        openload: false
      };
    },
    created() {
      this.classValue = this.$route.name
    },
    methods: {
      _class(key) {
        let params = {
          Version: "2019-01-18",
          Region: localStorage.getItem("regionv2")
        }
        this.axios.post(SERV_KMS, params).then((res) => {
          if (res.Response.Error === undefined) {
            if (res.Response.ServiceEnabled === true) {
              this.$router.push({
                name: "userKms"
              });
            } else {
              this.openload = false
              this.$message({
                message: "請點擊購買秘鑰管理系統KMS開通",
                type: "warning",
                showClose: true,
                duration: 0
              });
            }
          }
        })

        this.classValue = key.index
      },
      handleOpen(key, keyPath) {
        // console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        // console.log(key, keyPath);
      }
    }
  };

</script>

<style lang="scss" scoped>
  .kms {
    ::v-deep .el-menu {
      border-right: 0 !important;
    }

    .big-title {
      font-size: 16px;
      font-weight: bold;
      color: white;
      padding: 20px 0 15px 20px;
      background: #292b36;
      height: 45px;
      margin: 10px 0;
    }

    .iconfont {
      margin-right: 5px;
      width: 24px;
      text-align: center;
      font-size: 16px;
      vertical-align: middle;
    }

    ::v-deep .el-menu-item {
      padding-left: 20px !important;
      height: 45px;
      display: flex;
      align-items: center;
      font-size: 14px;
    }

    .active {
      background-color: #20222c !important;
      color: white;
    }
  }

</style>

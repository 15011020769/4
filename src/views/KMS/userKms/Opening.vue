<template>
  <div class="Opening" v-loading='openload'>
    <div class="tols">
      <h4>欢迎使用秘钥管理系统KMS</h4>
      <p>安全、易用的秘钥管理系统,轻松创建和管理加密数据的秘钥</p>
    </div>
    <div class="contont">
      <div v-for="(item,index) in list" :key="index" class="child">
        <p><img :src='item.img'></p>
        <p>{{item.title}}</p>
        <p class="childp">{{item.content}}</p>
      </div>
    </div>
    <p class="purchase">
      <button @click="open">立即购买</button>
    </p>
  </div>
</template>
<script>
  import {
    SERV_KMS,
    OPEN_KMS
  } from '@/constants'
  export default {
    data() {
      return {
        openload: true,
        list: [{
            img: require('@/assets/KMS/open1.jpeg'),
            title: '安全合规',
            content: '基于第三方认证的硬件安全模块(HSM)来生产和保护秘钥'
          },
          {
            img: require('@/assets/KMS/open3.jpeg'),
            title: '安全合规',
            content: '你可以依托台富云秘钥管理系统轻松的创建、保护以及执行你的各项秘钥管理系统策略'
          },
          {
            img: require('@/assets/KMS/open2.jpeg'),
            title: '安全合规',
            content: '与台富云对象存储、分布式数据库、云硬盘等服务无缝集成，您可以通过秘钥管理系统对其进行秘钥管理'
          },
          {
            img: require('@/assets/KMS/open4.jpeg'),
            title: '安全合规',
            content: '多机房分布式集群化的业务部署和冷热备份，确保秘钥管理系统的高可用性'
          }


        ]
      }
    },
    created() {
      this._Verification()
    },
    methods: {
      //验证此账户是否开通kms
      _Verification() {
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
            }
          }
        })
      },
      //开通KMS
      open() {
        let params = {
          Version: "2019-01-18",
          Region: localStorage.getItem("regionv2")
        }
        this.axios.post(OPEN_KMS, params).then((res) => {
          if (res.Response.Error === undefined) {
            this.$router.push({
              name: "userKms"
            });

          }
        })
      }
    }
  }

</script>
<style lang="scss" scoped>
  .Opening {
    background: #fff;
    height: 100%;

    p {
      color: rgb(104, 101, 101);
    }

    .tols {
      padding-top: 7%;
      text-align: center;

      h4 {
        font-size: 18px;
        margin-bottom: 20px;
      }


    }

    .contont {
      display: flex;
      width: 84%;
      margin: 0 auto;

      .child {
        margin: 50px 20px;
        width: 220px;
        height: 220px;
        border: 1px solid #ccc;

        p {
          width: 70%;
          padding-top: 20px;
          margin: 0 auto;
          text-align: center;

          img {
            width: 35%;
          }
        }

        .childp {
          text-align: left;
        }
      }
    }

    .purchase {
      text-align: center;

      button {
        background: orange;
        padding: 7px 14px;
        color: #fff;
        border: none;
        cursor: pointer;
      }
    }
  }

</style>

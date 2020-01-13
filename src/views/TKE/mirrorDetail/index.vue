<template>
  <div class="myMirror-wrap">
    <div class="datails-nav">
      <ul>
        <router-link to="/myMirror">
          <li>
            <i class="el-icon-back"></i>
            <span>{{name}}</span>
          </li>
        </router-link>
      </ul>
    </div>
    <div class="my-title">
        <ul class="my-ul">
            <li @click="getTrue()" class="li-one" :style="{fontWeight:this.dataObject.flag==true?'700':''}">
              镜像信息<div class="bottom-one" :style="{width:this.dataObject.flag==true?'78px':'0'}"></div>
            </li>
            <li @click="getFalse()" class="li-two" :style="{fontWeight:this.dataObject.flag==false?'700':''}">
              镜像详情<div class="bottom-two" :style="{width:this.dataObject.flag==false?'78px':'0'}"></div>
            </li>
        </ul>
    </div>
    <div class="room">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
export default {
  name: 'myMirror',
  data () {
    return {
      dataObject: {
        flag: true
      },
      name: this.$route.query.id
    }
  },
  methods: {
    // 切换点击事件
    getTrue () {
      this.dataObject.flag = true
      this.$router.push({
        name: 'mirrorDetailInfo',
        query: {
          id: this.name
        }
      })
    },
    getFalse () {
      this.dataObject.flag = false
      this.$router.push({
        name: 'mirrorDetailDetail',
        query: {
          id: this.name
        }
      })
    }
  }
}

</script>
<style lang="scss" scoped>
   .my-title{
     width: 100%;
     height: 40px;
     background: #fff;
     .my-ul{
        li{
        float: left;
        position: relative;
        line-height: 40px;
        margin-left: 30px;
        font-size:14px;
        box-sizing:border-box;
        width: 76px;
        text-align: center;
        cursor: pointer;
        color:#000;
      }
     }
   }
   .bottom-one{
     position: absolute;
     width: 0px;
     height: 2px;
     background: #006eff;
     left:0;
     top:38px;
     transition: 0.05s;
   }
   .bottom-two{
     position: absolute;
     width: 0px;
     height: 2px;
     background: #006eff;
     left:0;
     top:38px;
     transition: 0.05s;
   }
   .li-one:hover .bottom-one{
      width: 78px!important;
   }
   .li-two:hover .bottom-two{
      width: 78px!important;
   }
   .font-size-one{
     font-weight: 700;
   }
   .room{
     position: relative;
   }
   .datails-nav {
      height: 40px;
      background: #fff;
      span {
        color: #000;
        font-size: 14px;
        padding: 0 20px;
        box-sizing: border-box;
      }
      ul {
        display: flex;
        height: 40px;
        line-height: 40px;
        margin-left: 20px;
        li {
          display: flex;
          align-items: center;
          justify-content: center;
          i {
            font-size: 16px;
            font-weight: bold;
          }
          span{
            font-size: 16px;
            font-weight: 700;
          }
        }
        li:nth-child(1) {
          color: blue;
        }
      }
}
</style>

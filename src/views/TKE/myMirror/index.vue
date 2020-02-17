<template>
  <div class="myMirror-wrap">
    <HeadCom title="我的镜像">
      <slot>
        <div class="head-address">
          <City :Cityvalue.sync="selectedRegion" :cities="cities" class="city" @changeCity="changeCity"></City>
        </div>
      </slot>
    </HeadCom>
    <div class="my-title">
        <ul class="my-ul">
          <router-link :to="{name: 'myMirrorUser'}">
            <li @click="getTrue()" class="li-one" :style="{fontWeight:this.dataObject.flag==true?'700':''}">
              我的镜像<div class="bottom-one" :style="{width:this.dataObject.flag==true?'78px':'0'}"></div>
            </li>
          </router-link>
          <router-link :to="{name: 'myMirrorLocal'}">
            <li @click="getFalse()" class="li-two" :style="{fontWeight:this.dataObject.flag==false?'700':''}">
                命名空间<div class="bottom-two" :style="{width:this.dataObject.flag==false?'78px':'0'}"></div>
            </li>
          </router-link>
        </ul>
    </div>
    <div class="room">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
import City from '@/components/public/CITY'
import HeadCom from '@/components/public/Head'
import {
  ALL_CITY
} from '@/constants'
export default {
  components: {
    HeadCom,
    City
  },
  name: 'myMirror',
  data () {
    return {
      dataObject: {
        flag: this.$route.meta.flag
      },
      cities: [],
      selectedRegion: '',
      selectedCity: '',
      select: ''
    }
  },
   created () {
    this.GetCity()
  },
  methods: {
    // 切换点击事件
    getTrue () {
      this.dataObject.flag = true
    },
    getFalse () {
      this.dataObject.flag = false
    },
    GetCity () {
      this.axios.get(ALL_CITY).then(data => {
        console.log(data.data)
        this.cities = data.data
        this.selectedRegion = data.data[0].Region
        this.selectedCity = data.data[0]
        this.$cookie.set('regionv2', this.selectedCity.Region)
      })
    },
    changeCity (city) {
      this.selectedCity = city
      this.$cookie.set('regionv2', city.Region)
    },
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
        // font-weight:700;
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
   .head-address{
    margin-top:10px;
    margin-left:20px;
    width: 250px;
    display: flex;
    justify-content: space-between;
   
}
</style>

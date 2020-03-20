<template>
  <div class="overview-wrap">
    <HeaderCom :title="$t('CSS.builder.22')" />
    <div class="overview-main">
      <el-row style="text-align: center;">
        <el-col :span="24" >
          <img src="./image/cbimage.png" alt="">
        </el-col>
      </el-row>
      <el-row style="text-align: center;">
        <el-col :span="24">
          <div class="text-top">{{$t('CSS.builder.23')}}</div>
          <div class="text-content">
            <p >{{$t('CSS.builder.24')}}</p>
            <p>{{$t('CSS.builder.25')}}</p>
            </div>
          <div>
            <el-checkbox v-model="checked" >
              同意
            </el-checkbox>
            <a href="#" >《{{$t('CSS.builder.26')}}》</a>
            <sapn :class="{ 'active': checked }">和</sapn>
              <a href="#">《{{$t('CSS.builder.27')}}》</a>
          </div>
          <div class="button">
            <el-button type="primary" :disabled="!checked" style="border-radius: 0;width:150px;height:40px">
              {{$t('CSS.builder.28')}}
            </el-button>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>

import HeaderCom from '@/components/public/Head'

export default {
  name: 'live',
  data () {
    return {
      checked: false

    }
  },
  components: {
    HeaderCom

  },
  created () {

  },

  methods: {

  }
}
</script>

<style lang="scss" scoped>

.overview-main{
  background: #fff;
  margin: 20px;
  box-shadow: 0 2px 3px 0 rgba(0,0,0,.2);
  box-sizing: border-box;
}
.text-top{
  font-size: 30px;
  margin-bottom: 20px;
  font-weight: bolder;
}
.text-content{
  font-size: 16px;
  margin-bottom: 20px;
  font-weight: bolder;
  p: {
    line-height: 30px;
  }
}
.button{
  margin-top: 30px;
  margin-bottom: 50px;

}
.active{
  color: #65a5f9;
}
</style>

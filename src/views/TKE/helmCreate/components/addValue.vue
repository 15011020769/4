<template>
    <div>
        <el-form class="demo-dynamic">
            <el-form-item
                v-for="(domain, index) in domains"
                :key="domain.key"
                :prop="'domains.' + index + '.value'"
            >
            <div class="form-input">
                <el-input v-model="domain.value" size="mini" placeholder="变量名"></el-input>
                <span>=</span>
                <el-input v-model="domain.valueKey" size="mini" placeholder="变量值"></el-input>
                 <el-tooltip class="item" effect="dark" content="删除" placement="right">
                    <i class="el-icon-close" @click.prevent="removeDomain(domain)"></i>
                </el-tooltip>
            </div>
            </el-form-item>
            <p v-show="domains.length?true:false" class="form-p">可通过设置自定义参数替换Chart包的默认配置，如：image.repository = nginx</p>
        </el-form>
        <el-link type="primary" style="cursor: pointer;"  @click="addDomain" :disabled="flag">新增变量</el-link>
    </div>
</template>
<script>
export default {
  data () {
    return {
        domains: [],
        flag: false
    }
  },
  watch:{
      domains:{
        handler(news,old){
          for(var i in news){
            if(news[i].value == "" || news[i].valueKey == "" && news.length != 0 ){
                this.flag = true
            } else if(news.length == 0){
                this.flag = false
            } else {
                this.flag = false
            }
          }
        },
        immediate: true,
        deep: true
      }
    },
  

  methods: {
    removeDomain (item) {
      var index = this.domains.indexOf(item)
      if (index !== -1) {
        this.domains.splice(index, 1)
       
      }
      if(this.domains.length == 0){
        this.flag = false
      }
    },
    addDomain () {
      this.domains.push({
        value: '',
        valueKey: '',
        // key: Date.now()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.form-input{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top:10px;
    span{
        margin:0 10px;
    }
    i{
        margin:0 10px;
        cursor: pointer;
    }
}
.form-p{
    margin-bottom: 10px;
    font-size: 12px;
    color: #888;

}
.box {
    width: 400px;

    .top {
      text-align: center;
    }

    .left {
      float: left;
      width: 60px;
    }

    .right {
      float: right;
      width: 60px;
    }

    .bottom {
      clear: both;
      text-align: center;
    }

    .item {
      margin: 4px;
    }

    .left .el-tooltip__popper,
    .right .el-tooltip__popper {
      padding: 8px 10px;
    }
  }
</style>

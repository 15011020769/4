<template>
  <div class="myMirror-wrap">
    <div class="datails-nav">
      <ul>
        <router-link to="/helm">
          <li>
            <i class="el-icon-back"></i>
            <span>新建 Helm 应用</span>
          </li>
        </router-link>
      </ul>
    </div>
    <div class="room-center">
        <div class="explain" style="margin-bottom:20px;">
            <p>创建Helm应用，若应用中包含了公网CLB类型的Services或Ingress，将按照腾讯云CLB对应价格收费。若应用中包含PV/PVC/StorageClass，其创建的存储资源将按对应的产品价格收费。
            </p>
        </div>
        <el-card class="box-card">
            <el-form  class="tke-form m0" :model="ruleForm" label-position='left' label-width="100px" size="mini">
              <el-form-item label="应用名">
                <el-input class="w200" v-model="ruleForm.name" placeholder="请输入StorageClass名称"></el-input>
                <p>最长63个字符，只能包含小写字母、数字及分隔符("-")，且必须以小写字母开头，数字或小写字母结尾</p>
              </el-form-item>
              <el-form-item label="所在地域">
                <div>{{ruleForm.local}}</div>
              </el-form-item>
               <el-form-item label="运行集群">
                <div>{{ruleForm.colony}}</div>
              </el-form-item>
              <hr class="hr-mod">
               <el-form-item label="来源">
                <div class="li-box">第三方仓库</div>
              </el-form-item>
              <el-form-item label="下载地址">
                 <el-input class="w200" v-model="ruleForm.name" placeholder="请输入Chart的下载地址"></el-input>
                 <p>请输入Helm Chart压缩包的可下载地址，压缩包文件一般为.tgz格式</p>
              </el-form-item>
              <el-form-item label="类型">
                <el-radio-group v-model="isCollapse"  size="mini" @change="getRoom($event)">
                  <el-radio-button :label="true" >公有</el-radio-button>
                  <el-radio-button :label="false">私有</el-radio-button>
                </el-radio-group>
                 <div v-show="!dataObject.flag" class="user-room">
                    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="60px" class="demo-ruleForm">
                        <el-form-item label="用户名" prop="name" class="margin-length">
                            <el-input type="text" v-model="ruleForm.name" size="mini" style="width:180px;"></el-input>
                        </el-form-item>
                          <el-form-item label="密码" prop="pass" class="margin-length">
                            <el-input type="password" v-model="ruleForm.pass" size="mini" style="width:180px;"></el-input>
                        </el-form-item>
                    </el-form>
                  </div>
              </el-form-item>
              <el-form-item label="Key-Value">
                <div style="width:450px;">
                  <div class="form-input"
                  v-for="(domain, index) in domains"
                  :key="domain.key"
                  :prop="'domains.' + index + '.value'">
                      <el-input v-model="domain.value" size="mini" placeholder="变量名"></el-input>
                      <span>=</span>
                      <el-input v-model="domain.valueKey" size="mini" placeholder="变量值"></el-input>
                        <el-tooltip class="item" effect="dark" content="删除" placement="right">
                          <i class="el-icon-close" @click.prevent="removeDomain(domain)"></i>
                      </el-tooltip>
                  </div>
                </div>
                <p v-show="domains.length?true:false" class="form-p">可通过设置自定义参数替换Chart包的默认配置，如：image.repository = nginx</p>
                <el-link type="primary" style="cursor: pointer;"  @click="addDomain" :disabled="flag">新增变量</el-link>
              </el-form-item>
              <hr class="hr-mod">
              <el-button type="primary" size="mini">完成</el-button>
              <el-button size="mini">取消</el-button>
            </el-form>
        </el-card> 
    </div>
  </div>
</template>
<script>
import AddValue from '@/views/TKE/helmCreate/components/addValue.vue'
export default {
  name: 'helm',
  components: {
    AddValue
  },
  data () {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入用户名'))
      } else {
        callback()
      }
    }
    return {
      isCollapse: true,
      input: '',
      dataObject: {
        flag: true
      },
      ruleForm: {
        colony:"555",
        local:"台湾",
        name:"",// 应用名
        pass: "",
        name: ""
      },
      domains: [],
      flag: false,
      rules: {
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        name: [
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
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
    // 切换点击事件
    // getTrue () {
    //   this.dataObject.flag = true
    // },
    // getFalse () {
    //   this.dataObject.flag = false
    // },
    getRoom (e) {
      // console.log(e)
      this.dataObject.flag = e
    },
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
      })
    }
  }
}
</script>
<style lang="scss" scoped>
    .myMirror-wrap{
       position: relative;
    }
   .datails-nav {
      height: 68px;
      background: #fff;
      span {
        color: #000;
        font-size: 16px;
        padding: 0 20px;
        box-sizing: border-box;
      }
      ul {
        display: flex;
        height: 40px;
        line-height: 68px;
        margin-left: 20px;
        li {
          display: flex;
          align-items: center;
          justify-content: center;
          i {
            font-size: 16px;
            font-weight: bold;
          }
        }
        li:nth-child(1) {
          color: blue;
        }
      }
    }
    .room-center{
        position: absolute;
        top:90px;
        left:20px;
        width: 95%;
        height: auto;
        .explain {
            padding: 10px 30px 10px 20px;
            vertical-align: middle;
            color: #003b80;
            border: 1px solid #97c7ff;
            background: #e5f0ff;
            p {
                font-size: 11px;
                line-height: 18px;
            }
        }
    }
    .li-left{
        width:80px;
    }
    .box-ul-one{
        li{
            display: flex;
            align-items: center;
            margin:30px 0;
        }
    }
    .p-text{
        font-size: 12px;
        color: #888;
        vertical-align: middle;
        margin-top: 8px;
    }
    .hr-mod {
        font-size: 5px;
        border: none;
        border-bottom: 1px solid #ccc;
        margin-bottom: 18px;
    }
    .li-box{
        padding: 5px;
        border:1px solid #006eff;
        width: 90px;
        text-align: center;
        color:#006eff;
        cursor: pointer;
    }
    .li-right{
        ul{
            li{
                width: 70px;
                border:1px solid #ddd;
                float: left;
                color:#000;
                padding:7px;
                text-align: center;
            }
        }
    }
    .user-room{
        margin-top:20px;
        height:140px;
        width: 280px;
        background: #f2f2f2;
    }
    .margin-length{
      padding:20px 0;
    }
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
</style>

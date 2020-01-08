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
            <ul class="box-ul-one">
               <li>
                   <div class="li-left">应用名</div>
                   <div>
                       <el-input v-model="input" placeholder="请输入应用名称" size="mini" style="width:200px;"></el-input>
                       <p class="p-text">最长63个字符，只能包含小写字母、数字及分隔符("-")，且必须以小写字母开头，数字或小写字母结尾</p>
                    </div>
               </li>
               <li>
                   <div class="li-left">所在地域</div>
                   <div>中国台北</div>
               </li>
               <li>
                   <div class="li-left">运行集群</div>
                   <div>tfy_tp_test</div>
               </li>
               <div>
                    <hr class="hr-mod">
                </div>
               <li>
                   <div class="li-left">来源</div>
                   <div class="li-box">第三方仓库</div>
               </li>
               <li>
                   <div class="li-left">下载地址</div>
                   <div>
                       <el-input v-model="input" placeholder="请输入Chart的下载地址" size="mini" style="width:200px;"></el-input>
                       <p class="p-text">请输入Helm Chart压缩包的可下载地址，压缩包文件一般为.tgz格式</p>
                    </div>
               </li>
                <li>
                   <div class="li-left">类型</div>
                   <div class="li-right">
                       <el-radio-group v-model="isCollapse"  size="mini" @change="getRoom($event)">
                          <el-radio-button :label="true" >公有</el-radio-button>
                          <el-radio-button :label="false">私有</el-radio-button>
                       </el-radio-group>
                       <div v-show="!flag" class="user-room">
                           <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="60px" class="demo-ruleForm">
                                <el-form-item label="用户名" prop="name">
                                    <el-input type="text" v-model="ruleForm.name" size="mini"  style="width:180px;"></el-input>
                                </el-form-item>
                                 <el-form-item label="密码" prop="pass">
                                    <el-input type="password" v-model="ruleForm.pass" size="mini" style="width:180px;"></el-input>
                                </el-form-item>
                           </el-form>
                       </div>
                    </div>
               </li>
               <li>
                   <div class="li-left">Kry-Value</div>
                    <el-link type="primary" style="cursor: pointer;">新增变量</el-link>
               </li>
            </ul>
        </el-card>
    </div>
  </div>
</template>
<script>
export default {
  name: 'myMirror',
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
      flag: true,
      dataObject: {
        flag: true
      },
      ruleForm: {
        pass: '',
        name: ''
      },
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
  methods: {
    // 切换点击事件
    getTrue () {
      this.dataObject.flag = true
    },
    getFalse () {
      this.dataObject.flag = false
    },
    getRoom (e) {
      console.log(e)
      this.flag = e
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
        padding: 10px;
        border:1px solid #006eff;
        width: 102px;
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
</style>

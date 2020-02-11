<template>
  <div class="funCongig" v-loading='Congigload'>
    <div class="title">
      <h4>函数配置</h4>
      <p><a>编辑</a></p>
    </div>
    <div v-if="edit">
      <div class="Content">
        <p>函数名称</p>
        <p>{{ConfigDate.FunctionName}}</p>
      </div>
      <div class="Content">
        <p>运行角色</p>
        <p>{{ConfigDate.Role}}</p>
      </div>
      <div class="Content">
        <p>运行环境</p>
        <p>{{ConfigDate.Runtime}}</p>
      </div>
      <div class="Content">
        <p>内存</p>
        <p>{{ConfigDate.MemorySize}}</p>
      </div>
      <div class="Content">
        <p>超时时间</p>
        <p>{{ConfigDate.Timeout}}</p>
      </div>
      <div class="Content">
        <p>描述</p>
        <p>{{ConfigDate.Description}}</p>
      </div>
      <div class="Content">
        <p>修改时间</p>
        <p>{{ConfigDate.ModTime}}</p>
      </div>
      <div class="Content" v-if="!Congigload">
        <p>环境变量</p>
        <p v-if="Variables.length===0">暂无环境变量</p>
        <p v-else v-for="(item,index) in Variables">
          <span>{{item.Key}}={{item.Value}}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </p>
      </div>
      <div class="Content" v-if="!Congigload">
        <p>所属网络</p>
        <p v-if="VpcConfig.VpcId===''">无VPC</p>
        <p v-else>{{ConfigDate.VpcConfig.VpcId}}</p>
      </div>
      <div class="Content" v-if="!Congigload">
        <p>所属子网</p>
        <p v-if="VpcConfig.SubnetId===''">无子网</p>
        <p v-else>{{ConfigDate.VpcConfig.SubnetId}}</p>
      </div>
    </div>
    <div v-if="!edit">
      <div class="Content">
        <p>函数名称</p>
        <p>{{ConfigDate.FunctionName}}</p>
      </div>
      <div class="Content">
        <p>运行角色</p>
        <p>{{ConfigDate.Role}}</p>
      </div>
      <div class="Content">
        <p>运行环境</p>
        <p>{{ConfigDate.Runtime}}</p>
      </div>
      <div class="Content">
        <p>内存</p>
        <p>{{ConfigDate.MemorySize}}</p>
      </div>
      <div class="Content">
        <p>超时时间</p>
        <p>{{ConfigDate.Timeout}}</p>
      </div>
      <div class="Content">
        <p>描述</p>
        <p>{{ConfigDate.Description}}</p>
      </div>
      <div class="Content">
        <p>修改时间</p>
        <p>{{ConfigDate.ModTime}}</p>
      </div>
      <div class="Content" v-if="!Congigload">
        <p>环境变量</p>
        <p v-if="Variables.length===0">暂无环境变量</p>
        <p v-else v-for="(item,index) in Variables">
          <span>{{item.Key}}={{item.Value}}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </p>
      </div>
      <div class="Content" v-if="!Congigload">
        <p>所属网络</p>
        <p v-if="VpcConfig.VpcId===''">无VPC</p>
        <p v-else>{{ConfigDate.VpcConfig.VpcId}}</p>
      </div>
      <div class="Content" v-if="!Congigload">
        <p>所属子网</p>
        <p v-if="VpcConfig.SubnetId===''">无子网</p>
        <p v-else>{{ConfigDate.VpcConfig.SubnetId}}</p>
      </div>
    </div>
  </div>
</template>
<script>
  import {
    SCF_DETAILS,
  } from "@/constants";
  import {
    ErrorTips
  } from "@/components/ErrorTips";
  export default {
    data() {
      return {
        Congigload: true,
        edit: false,
        functionName: this.$route.query.functionName,
        ConfigDate: '',
        Variables: [],
        VpcConfig: {}
      }
    },
    mounted() {
      this.GetDate()
    },
    methods: {
      //获取详情数据
      GetDate() {
        let param = {
          Region: localStorage.getItem('regionv2'),
          Version: "2018-04-16",
          FunctionName: this.functionName,
        };
        this.axios.post(SCF_DETAILS, param).then(res => {
          if (res.Response.Error === undefined) {
            this.ConfigDate = res.Response
            this.Variables = res.Response.Environment.Variables
            this.VpcConfig = res.Response.VpcConfig
            console.log(this.VpcConfig)
            this.Congigload = false
          } else {
            let ErrTips = {
              'InternalError': '内部错误',
              'InternalError.System': '内部系统错误',
              'InvalidParameter.Payload': '请求参数不合法',
              'InvalidParameterValue': '参数取值错误',
              'InvalidParameterValue.CodeSecret': 'CodeSecret传入错误',
              'ResourceNotFound.Function': '函数不存在',
              'ResourceNotFound.FunctionName': '函数不存在',
              'UnauthorizedOperation': '未授权操作',
              'UnauthorizedOperation.CAM': 'CAM鉴权失败',
              'UnauthorizedOperation.CodeSecret': '无访问代码权限'
            };
            let ErrOr = Object.assign(ErrorTips, ErrTips);
            this.$message({
              message: ErrOr[res.Response.Error.Code],
              type: "error",
              showClose: true,
              duration: 0
            });
          }
        });
      }
    }
  }

</script>
<style lang="scss" scoped>
  .funCongig {
    padding: 20px;
    background-color: #fff;
    box-shadow: 0 2px 3px 0 rgba(0, 0, 0, .2);

    .title {
      display: flex;
      justify-content: space-between;
      margin-bottom: 30px;

      h4 {
        font-size: 14px;
      }

      p {
        font-size: 12px;

      }
    }

    .Content {
      display: flex;
      font-size: 12px;
      height: 40px;

      p:first-child {
        width: 70px;
        color: #888;
      }

      p:last-child {
        font-weight: bold;
      }
    }
  }

</style>

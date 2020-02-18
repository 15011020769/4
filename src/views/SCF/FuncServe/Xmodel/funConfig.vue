<template>
  <div class="funCongig" v-loading='Congigload'>
    <div class="title">
      <h4>函数配置</h4>
      <p><a @click="edit=true">编辑</a></p>
    </div>
    <div v-if="edit===false">
      <div class="Content">
        <p>函数名称</p>
        <p>{{ConfigDate.FunctionName}}</p>
      </div>
      <div class="Content">
        <p>运行角色</p>
        <p v-if="ConfigDate.Role">{{ConfigDate.Role}}</p>
        <p v-else>暂无运行角色</p>
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
    <div v-if="edit===true">
      <div class="Content">
        <p>函数名称</p>
        <p>{{ConfigDate.FunctionName}}</p>
      </div>
      <div class="Content">
        <p>运行角色</p>
        <div>
          <el-select v-model="RoleValue" placeholder="请选择">
            <el-option v-for="item in RoleArr" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="Content">
        <p></p>
        <p class="Tips">此角色将用于授权函数运行时操作其他资源的权限。您可以新建角色或对角色修改权限</p>
      </div>
      <div class="Content">
        <p>运行环境</p>
        <p>{{ConfigDate.Runtime}}</p>
      </div>
      <div class="Content">
        <p>内存</p>
        <div>
          <el-select v-model="MemoryValue" placeholder="请选择">
            <el-option v-for="item in MemoryArr" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="Content">
        <p>超时时间</p>
        <div>
          <el-input v-model="TimeoutValue">
            <el-button slot="append">秒</el-button>
          </el-input>
        </div>
      </div>
      <div class="Content">
        <p></p>
        <p class="Tips">时间范围：1-900秒</p>
      </div>
      <div class="Content">
        <p>描述</p>
        <p>
          <el-input type="textarea" :rows="1" v-model="ConfigDate.Description">
          </el-input>
        </p>
      </div>
      <div class="Content">
        <p></p>
        <p class="Tips">只能包含字母、数字、空格、逗号、句号、中文，长度最多1000个字符</p>
      </div>
      <div class="Content" v-if="!Congigload">
        <p>环境变量</p>
        <div>
          <div class="Science borderNone">
            <p>Key</p>
            <p>Value</p>
          </div>
          <div class="Science borderNone" v-for="(item,index) in ScienceArr" :key="index">
            <p>
              <el-input v-model="item.Key" class="Scienceinput"></el-input>
            </p>
            <p>
              <el-input v-model="item.Value" class="Scienceinput"></el-input>
            </p>
            <p v-if="closeshow">
              <i class="el-icon-close closeScience" @click="CloseScience(index)"></i>
            </p>
          </div>
          <div class="Science">
            <p @click="AddScience" class="addScience"><a>添加</a></p>
          </div>
        </div>
      </div>

      <div class="Content">
        <p>内网访问
          <el-tooltip content="Bottom center" placement="bottom" effect="light">
            <span><i class="el-icon-question"></i></span>
          </el-tooltip>
        </p>
        <div>
          <el-switch v-model="IntranetValue" active-color="#006eff" inactive-color="#888888">
          </el-switch>
        </div>
      </div>

      <div class="Content" v-if="IntranetValue">
        <p></p>
        <div>
          <el-select v-model="VPCvalue" placeholder="请选择">
            <el-option v-for="item in VPCoptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="Subvalue" placeholder="请选择">
            <el-option v-for="item in Suboptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <p style="color:#888">如现有的网络不合适，您可以去控制台
            <a href="">新建私有网络</a>
            或
            <a href="">新建子网</a> </p>
        </div>
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
        VpcConfig: {},
        RoleValue: '', //运行角色
        RoleArr: [], //运行角色数组
        MemoryValue: '', //内存
        MemoryArr: [{
            label: '64MB',
            value: 64
          },
          {
            label: '128MB',
            value: 128
          },
          {
            label: '256MB',
            value: 256
          },
          {
            label: '384MB',
            value: 384
          },
          {
            label: '512MB',
            value: 512
          },
          {
            label: '640MB',
            value: 640
          },
          {
            label: '768MB',
            value: 768
          },
          {
            label: '896B',
            value: 896
          },
          {
            label: '1024MB',
            value: 1024
          },
          {
            label: '1152MB',
            value: 1152
          },
          {
            label: '1280MB',
            value: 1280
          },
          {
            label: '1408MB',
            value: 1408
          },
          {
            label: '1536MB',
            value: 1536
          }

        ], //内存数组
        TimeoutValue: '', //超出时间
        ScienceArr: [{}],
        closeshow: false, //删除按钮控制
        IntranetValue: true,
        VPCvalue: '',
        Subvalue: '',
        VPCoptions: [],
        Suboptions: []
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
            if (this.Variables.length === 0) {
              this.MemoryArr = [{}]
            } else {
              this.MemoryArr = this.Variables
            }
            this.VpcConfig = res.Response.VpcConfig
            this.RoleValue = this.ConfigDate.Role
            this.MemoryValue = this.ConfigDate.MemorySize
            this.TimeoutValue = this.ConfigDate.Timeout

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
      },
      //环境添加
      AddScience() {
        this.ScienceArr.push({});
        if (this.ScienceArr.length > 1) {
          this.closeshow = true;
        } else {
          this.closeshow = false;
        }
      },
      //环境删除
      CloseScience(index) {
        this.ScienceArr.splice(index, 1);
        if (this.ScienceArr.length > 1) {
          this.closeshow = true;
        } else {
          this.closeshow = false;
        }
      },
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

        a {
          cursor: pointer;
        }
      }
    }

    .Content {
      display: flex;
      font-size: 12px;
      line-height: 40px;

      .Tips {
        color: #888;
      }

      p:first-child {
        width: 70px;
        color: #888;
      }

      p:last-child {
        font-weight: bold;
      }

      .Science {
        display: flex;
        width: 415px;
        height: 40px;
        border: 0.5px solid #ccc;

        a {
          cursor: pointer;
        }

        p {
          color: #ccc;
          font-weight: bold;
          flex: 1;
          line-height: 40px;
          padding-left: 15px;
        }

        .borderNone {
          border-bottom: none;
        }
      }
    }
  }

</style>

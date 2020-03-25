<template>
  <div class="funCongig" v-loading='Congigload'>
    <div class="title">
      <h4>{{$t('SCF.total.hspz')}}</h4>
      <p>
        <el-button type="text" @click="edit=true" :disabled='disedit'>{{$t('SCF.total.bj')}}</el-button>
      </p>
    </div>
    <div v-if="edit===false">
      <div class="Content">
        <p>{{$t('SCF.total.hsmc')}}</p>
        <p>{{ConfigDate.FunctionName}}</p>
      </div>
      <div class="Content">
        <p>{{$t('SCF.total.yxjs')}}</p>
        <p v-if="ConfigDate.Role">{{ConfigDate.Role}}</p>
        <p v-else>{{$t('SCF.total.zwyxjs')}}</p>
      </div>
      <div class="Content">
        <p>{{$t('SCF.total.yxhj')}}</p>
        <p>{{ConfigDate.Runtime}}</p>
      </div>
      <div class="Content">
        <p>{{$t('SCF.total.nc')}}</p>
        <p>{{ConfigDate.MemorySize}}</p>
      </div>
      <div class="Content">
        <p>{{$t('SCF.total.cssj')}}</p>
        <p>{{ConfigDate.Timeout}}</p>
      </div>
      <div class="Content">
        <p>{{$t('SCF.total.ms')}}</p>
        <p>{{ConfigDate.Description}}</p>
      </div>
      <div class="Content">
        <p>{{$t('SCF.total.xgsj2')}}</p>
        <p>{{ConfigDate.ModTime}}</p>
      </div>
      <div class="Content" v-if="!Congigload">
        <p>{{$t('SCF.total.hjbl')}}</p>
        <p v-if="Variables.length===0">{{$t('SCF.total.whjbl')}}</p>
        <p v-else v-for="(item,index) in Variables">
          <span>{{item.Key}}={{item.Value}}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </p>
      </div>
      <div class="Content" v-if="!Congigload">
        <p>{{$t('SCF.total.sswl')}}</p>
        <p v-if="Vpc_Smb.Vpc===''">{{$t('SCF.total.w')}}</p>
        <p v-else>
          <a :href="'../VPC/index.html#/priNetwork/priNetworkDetial/'+ ConfigDate.VpcConfig.VpcId + '/ap-taipei'"
            target="_self"> {{ConfigDate.VpcConfig.VpcId}}</a>
          ({{Vpc_Smb.Vpc.VpcId}} | {{Vpc_Smb.Vpc.VpcName}} | {{Vpc_Smb.Vpc.CidrBlock}})
        </p>
      </div>
      <div class="Content" v-if="!Congigload">
        <p>{{$t('SCF.total.sszw')}}</p>
        <p v-if="ConfigDate.VpcConfig.SubnetId===''">{{$t('SCF.total.wzw')}}</p>
        <p v-else>
          <a :href="'../VPC/index.html#/subnet/subnetDetailOther/'+ ConfigDate.VpcConfig.SubnetId+ConfigDate.VpcConfig.VpcId + '/ap-taipei'"
            target="_self"> {{ConfigDate.VpcConfig.SubnetId}}</a>
          ({{Vpc_Smb.Smb.SubnetId}} | {{Vpc_Smb.Smb.SubnetName}} | {{Vpc_Smb.Smb.CidrBlock}})
        </p>
      </div>
      <div class="Content" v-if="!Congigload">
        <p>标签</p>
        <span v-for="(v,i) in ConfigDate.Tags" :key="i">{{v}}</span>
        <p><i @click="modifyLabels()" class="el-icon-edit" style="cursor:pointer"></i></p>
      </div>
      <editLabel :editVisible.sync="dialogVisible" :labelsInfo='labelsInfo'></editLabel>
    </div>
    <div v-if="edit===true">
      <div class="Content">
        <p>{{$t('SCF.total.hsmc')}}</p>
        <p>{{ConfigDate.FunctionName}}</p>
      </div>
      <div class="Content">
        <p>{{$t('SCF.total.yxjs')}}</p>
        <div>
          <el-select v-model="RoleValue" :placeholder="$t('SCF.total.qsz')">
            <el-option v-for="item in RoleArr" :key="item.RoleName" :label="item.RoleName" :value="item.RoleName">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="Content">
        <p></p>
        <p class="Tips">{{$t('SCF.total.jsqxxg')}}</p>
      </div>
      <div class="Content">
        <p>{{$t('SCF.total.yxhj')}}</p>
        <p>{{ConfigDate.Runtime}}</p>
      </div>
      <div class="Content">
        <p>{{$t('SCF.total.nc')}}</p>
        <div>
          <el-select v-model="MemoryValue" :placeholder="$t('SCF.total.qsz')">
            <el-option v-for="item in MemoryArr" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="Content">
        <p>{{$t('SCF.total.cssj')}}</p>
        <div>
          <el-input v-model="TimeoutValue">
            <el-button slot="append">秒</el-button>
          </el-input>
        </div>
      </div>
      <div class="Content">
        <p></p>
        <p class="Tips">{{$t('SCF.total.sjfw')}}</p>
      </div>
      <div class="Content">
        <p>{{$t('SCF.total.ms')}}</p>
        <p>
          <el-input type="textarea" :rows="1" v-model="ConfigDate.Description">
          </el-input>
        </p>
      </div>
      <div class="Content">
        <p></p>
        <p class="Tips">{{$t('SCF.total.znbh')}}</p>
      </div>
      <div class="Content" v-if="!Congigload">
        <p>{{$t('SCF.total.hjbl')}}</p>
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
        <p>{{$t('SCF.total.nwfw')}}
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
          <el-select v-model="VPCvalue" :placeholder="$t('SCF.total.qsz')">
            <el-option v-for="item in VPCoptions" :key="item.VpcId"
              :label="item.VpcId+' | '+ item.VpcName+' | '+item.CidrBlock" :value="item.VpcId">
            </el-option>
          </el-select>
          <el-select v-model="Subvalue" :placeholder="$t('SCF.total.qsz')">
            <el-option v-for="item in Suboptions" :key="item.SubnetId"
              :label="item.SubnetId+' | '+ item.SubnetName+' | '+item.CidrBlock" :value="item.SubnetId">
            </el-option>
          </el-select>
          <p style="color:#888">{{$t('SCF.total.wlbs')}}
            <a :href="'../VPC/index.html#/priNetwork/'" target="_self">{{$t('SCF.total.xjsywl')}}</a>
            或
            <a :href="'../VPC/index.html#/subnet/'" target="_self">{{$t('SCF.total.xjzw')}}</a> </p>
        </div>
      </div>
      <div class="Preservation">
        <el-button type="primary" size="small" @click="_Preservation">{{$t('SCF.total.bc')}}</el-button>
        <el-button size="small" @click="_cancel"> 取消</el-button>
      </div>


    </div>
  </div>
</template>
<script>
  import {
    SCF_DETAILS,
    VPCS_LIST,
    SUBNET_LIST,
    DESCRIB_ROLE,
    UPD_CONFIG
  } from "@/constants";
  import {
    ErrorTips
  } from "@/components/ErrorTips";
  import editLabel from './editLabels.vue'
  export default {
    props: ['FunctionVersion'],
    data() {
      return {
        disedit: false, //编辑按钮禁用
        dialogVisible: false, //标签弹出框
        labelsInfo: {},
        Congigload: true,
        edit: false,
        functionName: this.$route.query.functionName,
        ConfigDate: '',
        Variables: [],
        VpcConfig: {},
        Vpc_Smb: {
          Vpc: {},
          Smb: {}
        },
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
      if (this.FunctionVersion !== '$LATEST') {
        this.disedit = true
      }
      this.GetDate()
      this.AddScience()
      this._Getrole()
    },
    watch: {
      VpcConfig() {
        this._GetVpc()
      },
      VPCvalue() {
        this._GetSmb()
      }
    },
    methods: {
      //编辑标签
      modifyLabels() {
        this.dialogVisible = true;
        // this.labelsInfo={
        //   TagSet:row.TagSet,
        //   resourceId:row.CcnId
        // }
      },
      getLabelsFather() {
        let params = {
          FunctionName: this.functionName,
          Namespace: this.$route.query.SpaceValue,
          Qualifier: this.FunctionVersion,
          Region: "ap-taipei",
          ShowCode: "TRUE",
          Version: "2018-04-16",
        }
        this.axios.post(SCF_DETAILS, params).then(res => {
          console.log(res)
          if (res.Response.Error === undefined) {

          }
        })
      },
      //获取详情数据
      GetDate() {
        this.Congigload = true
        let param = {
          Region: localStorage.getItem('regionv2'),
          Version: "2018-04-16",
          FunctionName: this.functionName,
          Qualifier: this.FunctionVersion,
          Namespace: this.$route.query.SpaceValue
        };
        console.log(param)
        this.axios.post(SCF_DETAILS, param).then(res => {
          if (res.Response.Error === undefined) {
            console.log(res.Response)
            this.ConfigDate = res.Response
            this.labelsInfo = {
              TagSet: res.Response.Tags,
              resourceId: res.Response.FunctionId
            }
            this.Variables = res.Response.Environment.Variables
            if (this.Variables.length !== 0) {
              this.ScienceArr = this.Variables
            }
            this.VpcConfig = res.Response.VpcConfig
            this.RoleValue = this.ConfigDate.Role
            this.MemoryValue = this.ConfigDate.MemorySize
            this.TimeoutValue = this.ConfigDate.Timeout
          } else {
            let ErrTips = {
              'InternalError': '內部錯誤',
              'InternalError.System': '內部系統錯誤',
              'InvalidParameter.Payload': '請求參數不合法',
              'InvalidParameterValue': '參數取值錯誤',
              'InvalidParameterValue.CodeSecret': 'CodeSecret傳入錯誤',
              'ResourceNotFound.Function': '函數不存在',
              'ResourceNotFound.FunctionName': '函數不存在',
              'UnauthorizedOperation': '未授權操作',
              'UnauthorizedOperation.CAM': 'CAM鑒權失敗',
              'UnauthorizedOperation.CodeSecret': '無訪問程式碼權限'
            };
            let ErrOr = Object.assign(ErrorTips, ErrTips);
            this.$message({
              message: ErrOr[res.Response.Error.Code],
              type: "error",
              showClose: true,
              duration: 0
            });
          }
        }).then(() => {
          this._GetVpc()
        })
      },
      _Getrole() { //获取角色
        let param = {
          Region: localStorage.getItem('regionv2'),
          Version: "2019-01-16",
          Page: 1,
          Rp: 200
        };
        this.axios.post(DESCRIB_ROLE, param).then(res => {
          if (res.Response.Error === undefined) {
            let List = res.Response.List
            List.forEach(item => {
              let strategyArr = JSON.parse(item.PolicyDocument)
              let strategy = strategyArr.statement[0].principal.service
              if (typeof strategy === 'object') {
                strategy.forEach(i => {
                  if (i.split(".")[0] === 'scf') {
                    this.RoleArr.push(item)
                  }
                });
              } else if (typeof strategy === "string") {
                if (strategy.split(".")[0] === 'scf') {
                  this.RoleArr.push(item)
                }
              }
            });
          } else {
            let ErrTips = {
              'InternalError.SystemError': 'InternalError.SystemError',
              'InvalidParameter.ParamError': '非法入參'
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
      //查询私有网络列表
      _GetVpc() {
        let param = {
          Region: localStorage.getItem('regionv2'),
          Version: "2017-03-12",
        };
        this.axios.post(VPCS_LIST, param).then(res => {
          if (res.Response.Error === undefined) {
            this.VPCoptions = res.Response.VpcSet
            if (this.VpcConfig.VpcId === '') {
              this.Vpc_Smb.Vpc = ''
            } else {
              this.VPCoptions.forEach(item => {
                if (this.VpcConfig.VpcId === item.VpcId) {
                  this.Vpc_Smb.Vpc = item
                  this.VPCvalue = this.Vpc_Smb.Vpc.VpcId
                }
              });
            }
          } else {
            let ErrTips = {
              'InvalidParameter.Coexist': '參數不支持同時指定',
              'InvalidParameterValue.Malformed': '入參格式不合法',
              'ResourceNotFound': '資源不存在'
            };
            let ErrOr = Object.assign(ErrorTips, ErrTips);
            this.$message({
              message: ErrOr[res.Response.Error.Code],
              type: "error",
              showClose: true,
              duration: 0
            });
          }
        }).then(() => {
          this.Congigload = false
          if (this.VPCvalue) {
            this._GetSmb()
          }

        })
      },
      //查询子网列表
      _GetSmb() {
        this.Subvalue = ''
        this.Suboptions = []
        let param = {
          Region: localStorage.getItem('regionv2'),
          Version: "2017-03-12",
          'Filters.0.Name': 'vpc-id',
          'Filters.0.Values.0': this.VPCvalue
        };
        this.axios.post(SUBNET_LIST, param).then(res => {
          if (res.Response.Error === undefined) {
            this.Suboptions = res.Response.SubnetSet
            if (this.VpcConfig.SubnetId === '') {
              this.Vpc_Smb.Smb = ''
            } else {
              this.Suboptions.forEach(item => {
                if (this.VpcConfig.SubnetId === item.SubnetId) {
                  this.Vpc_Smb.Smb = item
                  this.Subvalue = this.Vpc_Smb.Smb.SubnetId
                }
              });
            }

          } else {
            let ErrTips = {
              'InvalidParameter.Coexist': '參數不支持同時指定',
              'InvalidParameterValue.Malformed': '入參格式不合法',
              'ResourceNotFound': '資源不存在'
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
      //保存更改配置
      _Preservation() {
        let param = {
          Region: localStorage.getItem('regionv2'),
          Version: "2018-04-16",
          FunctionName: this.ConfigDate.FunctionName,
          Description: this.ConfigDate.Description,
          MemorySize: this.MemoryValue,
          Timeout: this.TimeoutValue
        };
        if (this.RoleValue !== '') {
          param['Role'] = this.RoleValue
        }
        if (this.IntranetValue === true) {
          param['VpcConfig.VpcId'] = this.VPCvalue
          param['VpcConfig.SubnetId'] = this.Subvalue
        }
        for (let i in this.ScienceArr) {
          (param["Environment.Variables." + i + ".Key"] = this.ScienceArr[
            i
          ].Key),
          (param["Environment.Variables." + i + ".Value"] = this.ScienceArr[
            i
          ].Value);
        }
        this.axios.post(UPD_CONFIG, param).then(res => {
          if (res.Response.Error === undefined) {
            this.$message({
              message: '修改成功',
              type: "success",
              showClose: true,
              duration: 0
            });
            this.edit = false
            this.GetDate()
          } else {
            let ErrTips = {
              'InternalError.System': '內部系統錯誤',
              'InvalidParameter.Payload': '請求參數不合法',
              'InvalidParameterValue': '參數取值錯誤',
              'InvalidParameterValue.Cls': 'Cls傳入錯誤',
              'InvalidParameterValue.Description': 'Description傳入錯誤',
              'InvalidParameterValue.EipConfig': 'EipConfig參數錯誤',
              'InvalidParameterValue.Environment': 'Environment傳入錯誤',
              'InvalidParameterValue.FunctionName': '函數不存在',
              'InvalidParameterValue.Handler': 'Handler傳入錯誤',
              'InvalidParameterValue.Layers': 'Layers參數傳入錯誤',
              'InvalidParameterValue.MemorySize': 'MemorySize錯誤',
              'LimitExceeded.Memory': '記憶體超出最大限制',
              'LimitExceeded.Timeout': 'Timeout超出最大限制',
              'ResourceNotFound.Function': '函數不存在',
              'ResourceNotFound.FunctionName': '函數不存在',
              'ResourceNotFound.Layer': 'layer不存在',
              'ResourceNotFound.Vpc': 'VPC或子網不存在',
              'UnauthorizedOperation.CAM': 'CAM鑒權失敗'
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
      //取消
      _cancel() {
        this.edit = false
      }
    },
    components: {
      editLabel
    },
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


    .Preservation {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
    }
  }

</style>

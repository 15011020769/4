<template>
  <div class="FuncServe">
    <!-- ----------------头部----------------- -->
    <div class="title">
      <p class="text">
        函数服务
      </p>
      <p>
        <el-button size="small">{{regionName}}</el-button>
      </p>
      <div>
        <span class="namespace">命名空间:</span>
        <el-select v-model="SpaceValue" @change="_GetFuncList">
          <el-option v-for="(item,index) in SpaceList" :key="index" :label="item.label" :value="item.name">
          </el-option>
        </el-select>
        <el-button class='setBtn' icon="el-icon-setting" size="small" @click="SpaceVisible=true"></el-button>
      </div>
    </div>
    <div class="tool">
      <p>
        <el-button type="primary" size="small">{{ $t('SCF.total.xj') }}</el-button>
      </p>
      <div class="searchRight">
        <el-select :placeholder="$t('SCF.total.glbq')" v-model="ChoiceValue">
          <el-option :label="$t('SCF.total.hsmc')" value="SearchKey"></el-option>
          <el-option :label="$t('SCF.total.hsms')" value="Description"></el-option>
        </el-select>
        <el-input v-model="searchValue" class="searchs" :placeholder="$t('SCF.total.ssnr')" @change="_searchchange">
        </el-input>
        <el-button class="el-icon-search" size="small" @click="_search"></el-button>
      </div>
    </div>
    <div>
      <el-dialog title="命名空间管理" :visible.sync="SpaceVisible">
        <el-table :data="SpaceListK">
          <el-table-column label="命名空间">
            <template slot-scope="$scope">
              <div v-if="$scope.row.disabled">
                <el-input v-model="SpaceListK[$scope.$index].name" :disabled="true"> </el-input>
              </div>
              <div v-else>
                <el-input v-model="SpaceListK[$scope.$index].name"> </el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="描述">
            <template slot-scope="$scope">
              <div v-if="$scope.row.name==='default'">
                <el-input v-model="SpaceListK[$scope.$index].Description" type="textarea" :disabled="true" :rows="3">
                </el-input>
              </div>
              <div v-else>
                <el-input v-model="SpaceListK[$scope.$index].Description" type="textarea" :rows="3">
                </el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="$scope">
              <p v-if="$scope.row.name==='default'">-</p>
              <p v-else><a @click="_deleteSpace($scope.row,$scope.$index)">删除</a></p>
            </template>
          </el-table-column>
        </el-table>
        <p v-if="SpaceListK.length<5">
          <a @click="_addSpace"> 新增命名空间（{{SpaceListK.length}}/5）</a>
        </p>
        <p v-else><a>新增命名空间（共5个命名空间，已满额）</a></p>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="_keepSpace">提 交</el-button>
          <el-button @click="SpaceVisible = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import {
    SCF_LIST,
    NAME_SPACE_LIST,
    NAME_SPACE_DEL,
    NAME_SPACE_CREAT
  } from '@/constants'
  import {
    ErrorTips
  } from '@/components/ErrorTips'
  export default {
    data() {
      return {
        region: localStorage.getItem('regionv2'),
        regionName: localStorage.getItem('regionv3'),
        FuncList: [], //函数列表
        pagesize: 10,
        currpage: 1,
        TotalCount: 0, //函数列表总条数
        SpaceList: [], //命名空间列表下拉
        SpaceListK: [], //命名空间列表管理
        SpaceValue: 'default', //命名空间
        ChoiceValue: '', //搜索选择
        searchValue: '', //搜索值
        SpaceVisible: false, //命名空间管理模态框
      }
    },
    created() {
      this._GetFuncList()
    },
    watch: {
      TotalCount: function () {
        this._GetSpaceList()
      }
    },
    methods: {
      //获取函数列表
      _GetFuncList() {
        let param = {
          Region: localStorage.getItem('regionv2'),
          Version: "2018-04-16",
          Offset: this.currpage,
          Limit: this.pagesize,
          Namespace: this.SpaceValue
        };
        this.axios.post(SCF_LIST, param).then(res => {
          if (res.Response.Error == undefined) {
            this.FuncList = res.Response.Functions
            this.TotalCount = res.Response.TotalCount
          } else {
            let ErrTips = {
              'InternalError.System': '内部系统错误',
              'InvalidParameter.Payload': '请求参数不合法',
              'InvalidParameterValue': '参数取值错误',
              'InvalidParameterValue.Limit': 'Limit传入错误',
              'InvalidParameterValue.Offset': '偏移量不合法',
              'InvalidParameterValue.Order': 'Order传入错误',
              'InvalidParameterValue.Orderby': 'Orderby传入错误',
              'UnauthorizedOperation.CAM': 'CAM鉴权失败',
              'UnauthorizedOperation.Region': 'Region错误',
            }
            let ErrOr = Object.assign(ErrorTips, ErrTips)
            this.$message({
              message: ErrOr[res.Response.Error.Code],
              type: "error",
              showClose: true,
              duration: 0
            });
          }
        })
      },

      //获取命名空间列表
      _GetSpaceList() {
        let param = {
          Region: localStorage.getItem('regionv2'),
          Version: "2018-04-16",
        };
        this.axios.post(NAME_SPACE_LIST, param).then(res => {
          if (res.Response.Error == undefined) {
            let SpaceList = res.Response.Namespaces.reverse()
            SpaceList.forEach(item => {
              this.SpaceListK.push({
                name: item.Name,
                Description: item.Description,
                disabled: true
              })
              if (item.Name === 'default') {
                this.SpaceList.push({
                  label: `${item.Name}(${this.TotalCount})`,
                  name: item.Name
                })
              }
              if (item.Name !== 'default') {
                this.SpaceList.push({
                  label: item.Name,
                  name: item.Name
                })
              }
            });
          } else {
            let ErrTips = {
              'InvalidParameterValue.Filters': 'Filters参数错误',
              'InvalidParameterValue.Order': 'Order传入错误',
              'InvalidParameterValue.Orderby': 'Orderby传入错误',
              'InvalidParameterValue.SearchKey': 'searchkey 不是 Keyword,Tag 或者 Runtime'
            }
            let ErrOr = Object.assign(ErrorTips, ErrTips)
            this.$message({
              message: ErrOr[res.Response.Error.Code],
              type: "error",
              showClose: true,
              duration: 0
            });
          }
        });
      },

      //搜索
      _search() {

      },
      // 搜索框内容为空
      _searchchange() {

      },
      //删除命名空间
      _deleteSpace(item, index) {
        this.SpaceListK.splice(index, 1);
        if (item.name !== '') {
          let param = {
            Region: localStorage.getItem('regionv2'),
            Version: "2018-04-16",
            Namespace: item.name
          };
          this.axios.post(NAME_SPACE_DEL, param).then(res => {
            if (res.Response.Error == undefined) {
              console.log('删除成功')
            } else {
              let ErrTips = {
                'FailedOperation.DeleteNamespace': '无法删除默认Namespace',
                'InternalError': '内部错误',
                'InvalidParameterValue': '参数取值错误',
                'InvalidParameterValue.Namespace': 'Namespace参数传入错误',
                'InvalidParameterValue.NamespaceInvalid': '规则不正确，Namespace为英文字母、数字、-_ 符号组成，长度30',
                'ResourceInUse.Namespace': 'Namespace已存在',
                'ResourceNotFound.Namespace': 'Namespace不存在',
                'UnauthorizedOperation.CAM': 'CAM鉴权失败'
              }
              let ErrOr = Object.assign(ErrorTips, ErrTips)
              this.$message({
                message: ErrOr[res.Response.Error.Code],
                type: "error",
                showClose: true,
                duration: 0
              });
            }
          })
        }
      },
      //新增命名空间模板
      _addSpace() {
        this.SpaceListK.push({
          name: '',
          Description: '',
          disabled: false
        })
      },
      _keepSpace() {

        // let param = {
        //   Region: localStorage.getItem('regionv2'),
        //   Version: "2018-04-16",
        //   Namespace: name,
        //   Description: Description
        // };
        // this.axios.post(NAME_SPACE_CREAT, param).then(res => {
        //   if (res.Response.Error == undefined) {
        //     console.log('创建成功')
        //   } else {
        //     let ErrTips = {
        //       'FailedOperation.CreateNamespace': '创建命名空间失败',
        //       'InternalError': '内部错误',
        //       'InvalidParameterValue': '参数取值错误',
        //       'InvalidParameterValue.DefaultNamespace': '默认Namespace无法创建',
        //       'InvalidParameterValue.Description': 'Description传入错误',
        //       'InvalidParameterValue.Namespace': 'Namespace参数传入错误',
        //       'InvalidParameterValue.NamespaceInvalid': '规则不正确，Namespace为英文字母、数字、-_ 符号组成，长度30',
        //       'LimitExceeded.Namespace': 'Namespace数量超过上限',
        //       'ResourceInUse.Namespace': 'Namespace已存在',
        //       'UnauthorizedOperation.CAM': 'CAM鉴权失败'
        //     }
        //     let ErrOr = Object.assign(ErrorTips, ErrTips)
        //     this.$message({
        //       message: ErrOr[res.Response.Error.Code],
        //       type: "error",
        //       showClose: true,
        //       duration: 0
        //     });
        //   }
        // })

        let param = {
          Region: localStorage.getItem('regionv2'),
          Version: "2018-04-16",
        };
        this.axios.post(NAME_SPACE_LIST, param).then(res => {
          if (res.Response.Error == undefined) {
            let Spacelist = res.Response.Namespaces
            console.log(Spacelist)
            console.log(this.SpaceListK)
            // this.SpaceListK 

          } else {
            let ErrTips = {
              'InvalidParameterValue.Filters': 'Filters参数错误',
              'InvalidParameterValue.Order': 'Order传入错误',
              'InvalidParameterValue.Orderby': 'Orderby传入错误',
              'InvalidParameterValue.SearchKey': 'searchkey 不是 Keyword,Tag 或者 Runtime'
            }
            let ErrOr = Object.assign(ErrorTips, ErrTips)
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
  .FuncServe {
    a {
      cursor: pointer;
    }

    ::v-deep .el-input__inner {
      height: 32px !important;
      width: 180px !important;
    }

    ::v-deep .el-input {
      height: 32px !important;
    }

    .title {
      display: flex;
      background: #fff;
      line-height: 50px;
      border-bottom: 1px solid #ddd;

      p {
        margin: 0 20px;
      }

      .namespace {
        margin-right: 10px;
      }


      .setBtn {
        margin-left: 12px;
        border: none;
        line-height: 24px;
        font-size: 16px;
      }


      .text {
        font-size: 18px;
        font-weight: bold;
      }
    }

    .tool {
      margin: 20px 20px 10px 20px;
      display: flex;
      justify-content: space-between;

      ::v-deep .el-button {
        border-radius: 0 !important;
      }

      ::v-deep .el-button--small {
        border-radius: 0 !important;

      }

      .searchRight {
        display: flex;
      }
    }

    ::v-deep .el-dialog__footer {
      text-align: center !important
    }
  }

</style>

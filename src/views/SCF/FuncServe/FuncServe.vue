<template>
  <div class="FuncServe">
    <!-- ----------------头部----------------- -->
    <div class="title">
      <p class="text">
        {{ $t('SCF.total.title') }}
      </p>
      <p>
        <el-button size="small">{{regionName}}</el-button>
      </p>
      <div>
        <span class="namespace">{{ $t('SCF.total.mmkj') }}:</span>
        <el-select v-model="SpaceValue" @change="_GetFuncList">
          <el-option v-for="(item,index) in SpaceList" :key="index" :label="item.label" :value="item.name">
          </el-option>
        </el-select>
        <el-button class='setBtn' icon="el-icon-setting" size="small" @click="SpaceVisible=true"></el-button>
      </div>
    </div>
    <!-- 工具栏 -->
    <div class="tool">
      <p>
        <el-button type="primary" size="small" @click="_newCreateFun">{{ $t('SCF.total.xj') }}</el-button>
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
    <div class="Functable">
      <el-table :data="FuncList" v-loading="loading">
        <el-table-column prop="FunctionName" :label="$t('SCF.total.hsm')">
          <template slot-scope="$scope">
            <!-- 点击函数名跳转页面 -->
            <a href="#" @click="toDoDetail($scope.row,'first',SpaceValue)">{{$scope.row.FunctionName}}</a>
          </template>
        </el-table-column>
        <el-table-column :label="$t('SCF.total.hszt')">
          <template slot-scope="$scope">
            <p>{{State[$scope.row.Status]}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="monitor" :label="$t('SCF.total.jk')">
          <template slot-scope="scope">
            <div class="a" @click="toDoDetail(scope.row,'fifth',SpaceValue)"></div>
          </template>


        </el-table-column>
        <el-table-column prop="Runtime" :label="$t('SCF.total.yxhj')"></el-table-column>
        <el-table-column prop="Description" :label="$t('SCF.total.ms')"></el-table-column>
        <el-table-column prop="AddTime" :label="$t('SCF.total.cjsj')"></el-table-column>
        <el-table-column prop="ModTime" :label="$t('SCF.total.xgsj')"></el-table-column>
        <el-table-column prop="operate" :label="$t('SCF.total.cz')" width="180">
          <template slot-scope="$scope">
            <el-button type="text" size="small" @click="_deleteFunc($scope.row.FunctionName)">
              {{ $t('SCF.total.sc') }}</el-button>
            <el-button type="text" size="small" @click="_copyFunc($scope.row)">
              {{ $t('SCF.total.fz') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="Right-style pagstyle">
        <span class="pagtotal">共&nbsp;{{TotalCount}}&nbsp;{{ $t('SCF.total.tiao') }}</span>
        <el-pagination :page-size="pagesize" :pager-count="7" layout="prev, pager, next"
          @current-change="handleCurrentChange" :total="TotalCount"></el-pagination>
      </div>

    </div>
    <!-- 设置命名空间模态框 -->
    <div>
      <el-dialog :title="$t('SCF.total.mmkjgl')" :visible.sync="SpaceVisible">
        <el-table :data="SpaceListK" v-loading='mmkjglshow'>
          <el-table-column :label="$t('SCF.total.mmkj')" width="250">
            <template slot-scope="$scope">
              <div v-if="$scope.row.disabled">
                <el-input v-model="SpaceListK[$scope.$index].name" :disabled="true"> </el-input>
              </div>
              <div v-else>
                <el-input v-model="SpaceListK[$scope.$index].name" @blur="inpBlur(SpaceListK[$scope.$index].name)">
                </el-input>
                <div :class="{'errActive':isbol}">
                  <p class="modelNameSpace">{{ $t('SCF.total.ts1') }}</p>
                  <p class="modelNameSpace">{{ $t('SCF.total.ts2') }}</p>
                </div>

              </div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('SCF.total.ms')" width="300">
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
              <div>
                <p v-if="$scope.row.name==='default'">-</p>
                <p v-else><a @click="_deleteSpace($scope.row,$scope.$index)">{{$t('SCF.total.sc')}}</a></p>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <p v-if="SpaceListK.length<5">
          <a @click="_addSpace"> {{$t('SCF.total.xzmmkj')}}（{{SpaceListK.length}}/5）</a>
        </p>
        <p v-else><a>{{$t('SCF.total.xzmmkj')}}{{$t('SCF.total.me')}}</a></p>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="_keepSpace" :loading='keeploanding' size="small">{{$t('SCF.total.tj')}}
          </el-button>
          <el-button @click="SpaceVisible = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- 删除函数模态框 -->
    <div>
      <el-dialog :visible.sync="DeleteVisible" width="550px" center>
        <div slot="title" class="DeleteVisible">
          {{$t('SCF.total.qdschs')}} {{FunctionName}} 吗？
        </div>
        <span>{{$t('SCF.total.scqd')}}</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="_DeleteDetermine">{{$t('SCF.total.qd')}}</el-button>
          <el-button @click="DeleteVisible = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- 复制函数模态框 -->
    <div>
      <copy :CopyVisible='CopyVisible' :SpaceDate='SpaceDate' @cancel='_cancel' />
    </div>
  </div>
</template>
<script>
  import {
    SCF_LIST,
    NAME_SPACE_LIST,
    NAME_SPACE_DEL,
    NAME_SPACE_CREAT,
    NAME_SPACE_UPD,
    SCF_DEL
  } from '@/constants'
  import {
    ErrorTips
  } from '@/components/ErrorTips'
  import copy from './Fmodel/copy'
  export default {
    data() {
      return {
        region: localStorage.getItem('regionv2'),
        regionName: localStorage.getItem('regionv3'),
        FuncList: [], //函数列表
        State: {
          Active: "正常",
          Creating: "創建中...",
          Updating: "更新中...",
          Publishing: "發布中...",
          UpdatingAndPublishing: "更新發布中...",
          CreateFailed: "創建失敗",
          UpdateFailed: "更新失敗"
        },
        loading: true,
        pagesize: 10,
        currpage: 0,
        TotalCount: 0, //函数列表总条数
        SpaceList: [], //命名空间列表下拉
        SpaceListK: [], //命名空间列表管理
        SpaceValue: 'default', //命名空间
        ChoiceValue: '', //搜索选择
        searchValue: '', //搜索值
        SpaceVisible: false, //命名空间管理模态框
        isbol: false, //判断值是否输入正确
        keeploanding: false, //设置命名空间保存按钮加载
        DeleteVisible: false, //删除函数模态框
        FunctionName: '', //函数名字
        CopyVisible: false, //复制函数模态框
        SpaceDate: {}, //选择函数  单一数据
        mmkjglshow: true,
      }
    },
    components: {
      copy
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
        this.loading = true
        let param = {
          Region: localStorage.getItem('regionv2'),
          Version: "2018-04-16",
          Offset: this.currpage,
          Limit: this.pagesize,
          Namespace: this.SpaceValue
        };
        if (this.ChoiceValue !== '' && this.searchValue !== '') {
          param[this.ChoiceValue] = this.searchValue
        }
        this.axios.post(SCF_LIST, param).then(res => {
          if (res.Response.Error == undefined) {
            this.FuncList = res.Response.Functions
            this.TotalCount = res.Response.TotalCount
          } else {
            let ErrTips = {
              'InternalError.System': '內部系統錯誤',
              'InvalidParameter.Payload': '請求參數不合法',
              'InvalidParameterValue': '參數取值錯誤',
              'InvalidParameterValue.Limit': 'Limit傳入錯誤',
              'InvalidParameterValue.Offset': '偏移量不合法',
              'InvalidParameterValue.Order': 'Order傳入錯誤',
              'InvalidParameterValue.Orderby': 'Orderby傳入錯誤',
              'UnauthorizedOperation.CAM': 'CAM鑒權失敗',
              'UnauthorizedOperation.Region': 'Region錯誤',
            }
            let ErrOr = Object.assign(ErrorTips, ErrTips)
            this.$message({
              message: ErrOr[res.Response.Error.Code],
              type: "error",
              showClose: true,
              duration: 0
            });
          }
          this.loading = false
        })

      },
      //获取命名空间列表
      _GetSpaceList() {
        this.SpaceListK = []
        this.SpaceList = []
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
                  label: `${item.Name}`,
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
            this.mmkjglshow = false
          } else {
            let ErrTips = {
              'InvalidParameterValue.Filters': 'Filters參數錯誤',
              'InvalidParameterValue.Order': 'Order傳入錯誤',
              'InvalidParameterValue.Orderby': 'Orderby傳入錯誤',
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
        this.pagesize = 10
        this.currpage = 0
        if (this.ChoiceValue !== '' && this.searchValue !== '') {
          this._GetFuncList()
        } else {
          this.$message({
            message: '請選擇過濾條件且輸入搜索值',
            type: "warning",
            showClose: true,
            duration: 0
          });
        }
      },
      // 搜索框内容为空
      _searchchange() {
        if (this.searchValue === '') {
          this._GetFuncList()
        }
      },
      // 分页
      handleCurrentChange(val) {
        this.currpage = (val - 1) * this.pagesize;
        this._GetFuncList();
      },
      //删除命名空间
      _deleteSpace(item, index) {
        this.mmkjglshow = true
        this.SpaceListK.splice(index, 1);
        if (item.name !== '') {
          let param = {
            Region: localStorage.getItem('regionv2'),
            Version: "2018-04-16",
            Namespace: item.name
          };
          this.axios.post(NAME_SPACE_DEL, param).then(res => {
            if (res.Response.Error == undefined) {

            } else {
              let ErrTips = {
                'FailedOperation.DeleteNamespace': '無法刪除預設Namespace',
                'InternalError': '內部錯誤',
                'InvalidParameterValue': '參數取值錯誤',
                'InvalidParameterValue.Namespace': 'Namespace參數傳入錯誤',
                'InvalidParameterValue.NamespaceInvalid': '規則不正確，Namespace為英文字母、數字、-_ 符號組成，長度30',
                'ResourceInUse.Namespace': '命名空間下有函數存在，無法刪除',
                'ResourceNotFound.Namespace': 'Namespace不存在',
                'UnauthorizedOperation.CAM': 'CAM鑒權失敗'
              }
              let ErrOr = Object.assign(ErrorTips, ErrTips)
              this.$message({
                message: ErrOr[res.Response.Error.Code],
                type: "error",
                showClose: true,
                duration: 0
              });
              this._GetSpaceList()
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
      //创建命名空间名字校验
      inpBlur(val) {
        if (val) {
          let reg = /^[a-zA-Z][a-zA-Z0-9_-]{2,59}$/;
          let bol = reg.test(val);
          if (!bol) {
            this.isbol = true;
          } else {
            this.isbol = false;
          }
        } else {
          this.isbol = true;
        }
      },
      //创建命名空间和保存
      _keepSpace() {
        if (this.isbol) {
          return;
        }
        this.keeploanding = true
        let param = {
          Region: localStorage.getItem('regionv2'),
          Version: "2018-04-16",
        };
        this.axios.post(NAME_SPACE_LIST, param).then(res => {
          if (res.Response.Error == undefined) {
            this.SpaceValue = 'default'
            let Spacelist = res.Response.Namespaces
            const Originalnum = Spacelist.length
            const nownum = this.SpaceListK.length
            for (var i = 0; i < Spacelist.length; i++) {
              for (var j = 0; j < this.SpaceListK.length; j++) {
                if (Spacelist[i].Name === this.SpaceListK[j].name) {
                  if (Spacelist[i].Description !== this.SpaceListK[j].Description) {
                    this._Spacemodify(this.SpaceListK[j].name, this.SpaceListK[j].Description)
                  }
                } else if (nownum - Originalnum !== 0) {
                  for (var k = 0; k < nownum - Originalnum; k++) {
                    this._SpaceEstablish(this.SpaceListK[Originalnum + k].name, this.SpaceListK[Originalnum + k]
                      .Description)
                  }
                }
              }
            }
            this._GetSpaceList()
          } else {
            let ErrTips = {
              'InvalidParameterValue.Filters': 'Filters參數錯誤',
              'InvalidParameterValue.Order': 'Order傳入錯誤',
              'InvalidParameterValue.Orderby': 'Orderby傳入錯誤',
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
          setTimeout(() => {
            this.keeploanding = false
            this.SpaceVisible = false
            this._GetFuncList()
          }, 1000);
        });

      },
      //创建命名空间
      _SpaceEstablish(name, Description) {
        let param = {
          Region: localStorage.getItem('regionv2'),
          Version: "2018-04-16",
          Namespace: name,
          Description: Description
        };
        this.axios.post(NAME_SPACE_CREAT, param).then(res => {
          if (res.Response.Error == undefined) {

          } else {
            let ErrTips = {
              'FailedOperation.CreateNamespace': '創建命名空間失敗',
              'InternalError': '内部錯誤',
              'InvalidParameterValue': '參數取值錯誤',
              'InvalidParameterValue.DefaultNamespace': '預設Namespace无法创建',
              'InvalidParameterValue.Description': 'Description傳入錯誤',
              'InvalidParameterValue.Namespace': 'Namespace參數傳入錯誤',
              'InvalidParameterValue.NamespaceInvalid': '規則不正確，Namespace為英文字母、數字、-_ 符號組成，長度30',
              'LimitExceeded.Namespace': 'Namespace數量超過上限',
              'ResourceInUse.Namespace': 'Namespace已存在',
              'UnauthorizedOperation.CAM': 'CAM鑒權失敗'
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
      //更改命名空间
      _Spacemodify(name, Description) {
        let param = {
          Region: localStorage.getItem('regionv2'),
          Version: "2018-04-16",
          Namespace: name,
          Description: Description
        };
        this.axios.post(NAME_SPACE_UPD, param).then(res => {
          if (res.Response.Error == undefined) {

          } else {
            let ErrTips = {
              'InvalidParameterValue.Description': 'Description傳入錯誤',
              'ResourceNotFound.Namespace': 'Namespace不存在'
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
      //删除函数
      _deleteFunc(name) {
        this.FunctionName = name
        this.DeleteVisible = true
      },
      //确定删除函数
      _DeleteDetermine() {
        let param = {
          Region: localStorage.getItem('regionv2'),
          Version: "2018-04-16",
          FunctionName: this.FunctionName,
          Namespace: this.SpaceValue
        };
        this.axios.post(SCF_DEL, param).then(res => {
          if (res.Response.Error == undefined) {
            this.$message({
              message: '删除成功',
              type: "success",
              showClose: true,
              duration: 0
            });
            this.DeleteVisible = false
            this._GetFuncList()
          } else {
            let ErrTips = {
              'FailedOperation.FunctionNameStatusError': '函數在部署中，無法更新程式碼',
              'FailedOperation.FunctionStatusError': '函數在部署中,無法做此操作',
              'InternalError.Cmq': '刪除cmq觸發器失敗',
              'InternalError.System': '內部系統錯誤',
              'InvalidParameter.Payload': '請求參數不合法',
              'InvalidParameterValue': '參數取值錯誤',
              'ResourceNotFound.Function': '函數不存在',
              'ResourceNotFound.FunctionName': '函數不存在',
              'UnauthorizedOperation.CAM': 'CAM鑒權失敗',
              'UnauthorizedOperation.DeleteFunction': '沒有權限的操作',
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
      //打开复制函数模态框
      _copyFunc(data) {
        this.SpaceDate = data
        this.CopyVisible = true
      },
      _cancel(val) {
        this.CopyVisible = val
      },
      //跳转新建
      _newCreateFun() {
        this.$router.push({
          path: "/createFun",
          query: {
            Namespace: this.SpaceValue
          }

        });
      },
      //跳转详情页点击事件
      toDoDetail(data, num, SpaceValue) {
        this.$router.push({
          path: "/funSeverDetail",
          query: {
            functionName: data.FunctionName,
            num: num,
            SpaceValue: SpaceValue
          }
        });
      },
    }
  }

</script>
<style lang="scss" scoped>
  .FuncServe {
    a {
      cursor: pointer;
    }

    .a {
      background-image: url("./../../../assets/CAM/images/cvm-20199061519.svg");
      background-size: 267px 176px;
      background-repeat: no-repeat;
      background-position: -47px -71px;
      height: 15px;
      width: 16px;
      cursor: pointer;
    }

    ::v-deep .el-input__inner {
      height: 32px !important;
      line-height: 32px !important;
      width: 180px !important;
    }

    ::v-deep .el-input {
      height: 32px !important;
      line-height: 32px !important;
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

    .Functable {
      background: #fff;
      margin: 20px;

      .Right-style {
        display: flex;
        background: white;
        width: 100%;
        justify-content: flex-end;
      }

      .pagstyle {
        padding: 20px;

        .pagtotal {
          font-size: 13px;
          font-weight: 400;
          color: #565656;
          line-height: 32px;
        }
      }

    }

    ::v-deep .el-dialog__footer {
      text-align: center !important
    }

    ::v-deep .el-textarea {
      width: 200px !important;
    }

    .errActive p {
      color: #e1504a !important;
    }

    .DeleteVisible {
      text-align: left;
      font-weight: bold;
    }

  }

</style>

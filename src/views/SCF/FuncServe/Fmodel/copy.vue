<template>
  <div class="copyFunc">
    <el-dialog :visible.sync="CopyVisible" width="550px" :show-close=false :close-on-click-modal=false
      :close-on-press-escape=false>
      <div slot="title" class="copyTitle">
        <h4>{{$t('SCF.total.hsfz')}}</h4>
        <p>
          <el-button type="text" icon="el-icon-close" @click="_cancel"></el-button>
        </p>
      </div>
      <div>
        <div class="Tips">
          <p> {{$t('SCF.total.ts3')}}</p>
        </div>
        <div class="content">
          <p>{{$t('SCF.total.ssdy')}}</p>
          <div>
            <el-select v-model="Cityvalue">
              <el-option v-for="item in cityArr" :key="item.Region" :label="item.lable" :value="item.Region">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="content">
          <p>{{$t('SCF.total.mmkj')}}</p>
          <div>
            <el-select v-model="NewSpacevalue">
              <el-option v-for="item in SpaceList" :key="item.Name" :label="item.Name" :value="item.Name">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="content">
          <p>{{$t('SCF.total.hsmc')}}</p>
          <div>
            <el-input v-model="NewFuncName" @change="_changeName"></el-input>
            <div class="rubC" v-show="showA">{{$t('SCF.total.hsmcbwk')}}</div>
            <div class="rubC" v-show="showB">
              <p class="p_style"> {{$t('SCF.total.ts1')}}</p>
              <p class="p_style"> {{$t('SCF.total.ts2')}}</p>
            </div>
            <div class="rubC" v-show="showC">{{$t('SCF.total.ghsmycz')}}</div>
          </div>
        </div>
        <div class="content">
          <p>{{$t('SCF.total.fznr')}}</p>
          <div>
            <p>
              <el-checkbox v-model="checked1" disabled>{{$t('SCF.total.hsdm')}}</el-checkbox>
            </p>
            <p>
              <el-checkbox v-model="checked2">{{$t('SCF.total.hspz')}}</el-checkbox>
            </p>
          </div>
        </div>
        <div class="content">
          <p>{{$t('SCF.total.fghs')}}</p>
          <div>
            <p>
              <el-checkbox v-model="checked3"></el-checkbox>
            </p>
          </div>
        </div>
        <div class="content">
          <p>{{$t('SCF.total.ms')}}</p>
          <div>
            <el-input type="textarea" :rows="5" v-model="textarea">
            </el-input>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="_Determine">{{$t('SCF.total.tj')}}</el-button>
        <el-button @click="_cancel">{{$t('SCF.total.gb')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import {
    ALL_CITY,
    NAME_SPACE_LIST,
    SCF_COPY
  } from "@/constants";
  import {
    ErrorTips
  } from '@/components/ErrorTips'
  export default {
    props: {
      CopyVisible: {
        required: true,
        type: Boolean
      },
      SpaceDate: {
        required: true,
        type: Object
      }
    },
    data() {
      return {
        cityArr: [], //城市数组
        Cityvalue: 'ap-taipei', //城市
        SpaceList: [], //命名空间数组
        Spacevalue: "", //命名空间
        NewSpacevalue: "", //新命名空间
        FuncName: '', //函数名称
        NewFuncName: '', //新函数名称
        checked1: true,
        checked2: false,
        checked3: false,
        textarea: '', //描述
        showA: false,
        showB: false,
        showC: false,
        check: false, //校验函数名
      }
    },
    watch: {
      SpaceDate(val) {
        this.Spacevalue = val.Namespace
        this.NewSpacevalue = val.Namespace
        this.FuncName = val.FunctionName
        this.NewFuncName = val.FunctionName
        this.textarea = val.Description
        this._GetSpaceList()
      }
    },
    created() {
      this.GetCity()
      this._GetSpaceList()
    },
    methods: {
      // 获取城市列表
      GetCity() {
        this.axios.get(ALL_CITY).then(data => {
          this.cityArr = data.data
        });
      },
      //获取命名空间列表
      _GetSpaceList() {
        let param = {
          Region: localStorage.getItem('regionv2'),
          Version: "2018-04-16",
        };
        this.axios.post(NAME_SPACE_LIST, param).then(res => {
          if (res.Response.Error == undefined) {
            this.SpaceList = res.Response.Namespaces.reverse()
            console.log(this.SpaceList)
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
      //函数名校验
      _changeName() {
        var reg = /^[a-zA-Z]([-_a-zA-Z0-9]{2,60})$/;
        if (this.NewFuncName === '') {
          this.showA = true;
          this.showB = false;
          this.showC = false;
        } else if (!reg.test(this.NewFuncName)) {
          this.showA = false;
          this.showB = true;
          this.showC = false;
        } else if (this.FuncName === this.NewFuncName && this.Spacevalue === this.NewSpacevalue) {
          this.showA = false;
          this.showB = false;
          this.showC = true;
        } else {
          this.check = true
          this.showA = false;
          this.showB = false;
          this.showC = false;
        }

      },
      //确定
      _Determine() {
        this._changeName()
        if (this.check === false) {
          return
        } else {
          let param = {
            Region: localStorage.getItem('regionv2'),
            Version: "2018-04-16",
            FunctionName: this.FuncName,
            NewFunctionName: this.NewFuncName,
            Namespace: this.Spacevalue,
            TargetNamespace: this.NewSpacevalue,
            Description: this.textarea,
            TargetRegion: this.Cityvalue
          };
          if (this.checked3 === true) {
            param['Override'] = 'TRUE'
          } else {
            param['Override'] = 'FALSE'
          }

          if (this.checked2 === true) {
            param['CopyConfiguration'] = 'TRUE'
          } else {
            param['CopyConfiguration'] = 'FALSE'
          }




          this.axios.post(SCF_COPY, param).then(res => {
            if (res.Response.Error == undefined) {
              this.$emit('cancel', false)
              this.$message({
                message: '複製成功',
                type: "success",
                showClose: true,
                duration: 0
              });
              this.$parent._GetFuncList();
            } else {
              let ErrTips = {

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

        // this.$emit('cancel', false)
      },
      //取消
      _cancel() {
        this.$emit('cancel', false)
      }
    }

  }

</script>
<style lang="scss" scoped>
  .copyFunc {
    .copyTitle {
      display: flex;
      justify-content: space-between;

      h4 {
        font-size: 16px;
        line-height: 40px;
      }

      p {
        cursor: pointer;

      }

      .el-button--text {
        color: #ccc;
        font-size: 18px;
      }
    }

    .Tips {
      width: 500px;
      margin: 0 auto;
      vertical-align: middle;
      color: #003b80;
      border: 1px solid #97c7ff;
      border-radius: 2px;
      background: #e5f0ff;

      p {
        padding: 20px;
        font-size: 12px;
      }
    }

    .content {
      margin-top: 20px;
      display: flex;

      p {
        line-height: 32px;
        color: #888;
        font-size: 12px;
        width: 92px;
      }

      .p_style {
        width: 400px;
        color: #e1504a;

      }

      .rubC {
        font-size: 12px;
        color: #e1504a;
      }

      .el-textarea {
        width: 340px !important;
      }
    }
  }

</style>

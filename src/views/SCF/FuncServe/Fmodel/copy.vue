<template>
  <div class="copyFunc">
    <el-dialog :visible.sync="CopyVisible" width="550px" :show-close=false :close-on-click-modal=false
      :close-on-press-escape=false>
      <div slot="title" class="copyTitle">
        <h4>函数复制</h4>
        <p>
          <el-button type="text" icon="el-icon-close" @click="_cancel"></el-button>
        </p>
      </div>
      <div>
        <div class="Tips">
          <p> 提示：如果云函数配置了vpc，在跨地域复制时，不会将vpc配置也复制过去。</p>
        </div>
        <div class="content">
          <p>所属地域</p>
          <div>
            <el-select v-model="Cityvalue">
              <el-option v-for="item in cityArr" :key="item.Region" :label="item.lable" :value="item.Region">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="content">
          <p>命名空间</p>
          <div>
            <el-select v-model="NewSpacevalue">
              <el-option v-for="item in SpaceList" :key="item.Name" :label="item.Name" :value="item.Name">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="content">
          <p>函数名称</p>
          <div>
            <el-input v-model="NewFuncName" @change="_changeName"></el-input>
            <div class="rubC" v-show="showA">函数名称不能为空</div>
            <div class="rubC" v-show="showB">
              <p class="p_style"> 1. 最多60个字符，最少2个字符</p>
              <p class="p_style"> 2. 字母开头，支持 a-z，A-Z，0-9，-，_，且需要以数字或字母结尾</p>
            </div>
            <div class="rubC" v-show="showC">该函数名在当前地域和命名空间下已存在</div>
          </div>
        </div>
        <div class="content">
          <p>复制内容</p>
          <div>
            <p>
              <el-checkbox v-model="checked1" disabled>函数代码</el-checkbox>
            </p>
            <p>
              <el-checkbox v-model="checked2">函数配置</el-checkbox>
            </p>
          </div>
        </div>
        <div class="content">
          <p>覆盖目标函数</p>
          <div>
            <p>
              <el-checkbox v-model="checked3"></el-checkbox>
            </p>
          </div>
        </div>
        <div class="content">
          <p>描述</p>
          <div>
            <el-input type="textarea" :rows="5" v-model="textarea">
            </el-input>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="_Determine">提 交</el-button>
        <el-button @click="_cancel">关 闭</el-button>
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

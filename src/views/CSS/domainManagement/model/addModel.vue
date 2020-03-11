<template>
  <div>
    <div>
      <el-dialog
        title="添加域名"
        :visible.sync="addDominModel"
        width="45%"
        :before-close="handleClose"
      >
        <div class="newClear">
          <div class="newClear conList">
            <p>域名</p>
            <p>
              <el-input
                class="ipt"
                v-model="dominForm.DominName"
                placeholder="請填寫域名，如：www.test.com"
                @blur="domainNameInputOnBlur"
              ></el-input>
              <p class="errorTips" v-show="errorTips.length>0">{{errorTips}}</p>
            </p>
          </div>
          <div class="newClear conList">
            <p>類型</p>
            <p>
              <el-select
                v-model="dominForm.DomainType"
                @change="selectDominType"
                class="ipt"
              >
                <el-option label="推流域名" :value="0"></el-option>
                <el-option label="播放域名" :value="1"></el-option>
              </el-select>
            </p>
          </div>
          <div
            class="newClear conList"
            v-if="dominForm.DomainType == 1 ? true : false"
          >
            <p>加速區域</p>
            <p>
              <el-select
                v-model="PlayType"
                @change="changePlayType"
                class="ipt"
              >
                <el-option label="中國大陸" :value="1"></el-option>
                <el-option label="全球加速" :value="2"></el-option>
                <el-option
                  label="中國港澳台地區及海外地區"
                  value="3"
                ></el-option>
              </el-select>
            </p>
          </div>
          <div class="newClear conList" v-if="speedAre1">
            <p>
              <i class="el-icon-warning"></i>
            </p>
            <p class="spe">
              您正申請開通全球加速，海外直播價格與國內直播價格不同，請知悉。
            </p>
          </div>
          <div class="newClear conList" v-if="speedAre2">
            <p>
              <i class="el-icon-warning"></i>
            </p>
            <p class="spe">
              您正申請開通中國港澳台地區及海外地區直播加速，中國大陸的請求將無法解析，請知悉。
            </p>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="addDominSure">确定</el-button>
          <el-button @click="handleClose">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { ADD_DOMAIN } from '@/constants'
import { CSSErrorTips } from '../../components/CSSErrorTips'
export default {
  props: {
    isShow: Boolean
  },
  computed: {
    addDominModel () {
      return this.isShow
    }
  },
  data () {
    return {
      dialogmodel: '', // 弹框
      // 添加域名表单
      dominForm: {
        DominName: '',
        DomainType: 0,
        region: '1'
      },
      PlayType: 1,
      speedAre1: false, // 监测加速区域select  全球
      speedAre2: false, // 监测加速区域select  境外

      checkDomin: '', // 選擇域名类型
      addDominModel2: false, // 添加域名
      addDominModel3: false,
      errorTips: false
    }
  },
  methods: {
    // 初始化数据和显示标记
    initData () {
      this.dominForm = {
        DominName: '',
        DomainType: 0,
        region: '1'
      }
      this.PlayType = 1
      this.changePlayType()
    },
    // 关闭弹框
    handleClose () {
      // TODO
      this.initData()
      this.dialogmodel = false
      this.$emit('closeAddModel', this.dialogmodel)
    },
    validateDomainName () {
      if (this.dominForm.DominName.length === 0) {
        this.errorTips = '請輸入域名'
        return false
      }

      if (
        !/[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/.test(
          this.dominForm.DominName
        )
      ) {
        this.errorTips = '域名格式錯誤，請輸入正確格式。'
        return false
      }

      if (this.dominForm.DominName.length > 30) {
        this.errorTips = '域名超出30位長度限制，請更換域名或者提交工單解決'
        return false
      }

      this.errorTips = ''
      return true
    },
    domainNameInputOnBlur (e) {
      this.validateDomainName()
    },
    // 添加域名确定按钮
    addDominSure () {
      // console.log(this.dominForm, this.PlayType);

      if (!this.validateDomainName()) {
        return
      }

      // TODO
      let params = {
        Version: '2018-08-01',
        DomainName: this.dominForm.DominName,
        DomainType: this.dominForm.DomainType
      }
      this.axios.post(ADD_DOMAIN, params).then(({ Response }) => {
        if (Response.Error) {
          let ErrTips = {}
          let ErrOr = Object.assign(CSSErrorTips, ErrTips)
          this.$message({
            type: 'error',
            message: ErrOr[Response.Error.Code],
            showClose: true,
            duration: 0
          })
          return
        }
        this.initData()
        this.dialogmodel = false
        this.$emit('closeAddModel', this.dialogmodel)
        this.$parent.describeLiveDomains()
      })
    },
    // 域名类型change事件
    selectDominType () {
      console.log(this.dominForm.DomainType)
    },
    // 加速区域change事件
    changePlayType () {
      if (this.PlayType == '1') {
        this.speedAre1 = false
        this.speedAre2 = false
      } else if (this.PlayType == '2') {
        this.speedAre1 = true
        this.speedAre2 = false
      } else if (this.PlayType == '3') {
        this.speedAre2 = true
        this.speedAre1 = false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.newClear:after {
  display: block;
  content: "";
  clear: both;
}
::v-deep .el-dialog__title {
  font-size: 14px;
  font-weight: 600;
}
::v-deep .el-dialog__footer {
  text-align: center;
}
::v-deep .el-input {
  width: 100%;
}
.dominChos {
  font-size: 12px;
  color: #999;
  i {
    font-style: normal;
    font-weight: 600;
    color: #000;
  }
}
.pDomin {
  margin-bottom: 16px;
}
.conList {
  margin-bottom: 20px;
  p:nth-child(1) {
    width: 70px;
    float: left;
    color: #999;
    font-size: 12px;
  }
  p:nth-child(2) {
    float: left;
    width: calc(100% - 70px);
  }
}
::v-deep input {
  height: 30px;
  width: 100% !important;
  border-radius: 0;
}
.ipt {
  width: 70%;
  input {
    width: 100%;
  }
}
.el-icon-warning {
  color: red;
}
.spe {
  font-weight: 600;
  font-size: 12px;
  color: gray;
}
.errorTips {
  font-size: 10px;
  color: red;
  margin-left: 70px;
}
</style>

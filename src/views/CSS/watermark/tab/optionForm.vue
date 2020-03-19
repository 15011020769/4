<template>
  <div class="form-wrap">
    <h4>水印配置</h4>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
      <el-form-item :label="$t('CSS.watermark.8')" prop="WatermarkName">
        <el-input v-model="ruleForm.WatermarkName" style="width:330px;" />
      </el-form-item>
      <el-form-item :label="$t('CSS.watermark.13')" prop="PictureUrl">
        <el-row type="flex">
          <img v-if="ruleForm.PictureUrl" :src="ruleForm.PictureUrl" style="width: 100px; height: 100px; margin-right: 20px" />
          <div v-else style="width: 100px; height: 100px; margin-right: 20px; border: 1px solid #ddd;"></div>
          <el-upload
            class="upload-demo"
            action="/"
            accept=".png"
            :on-change="beforeUpload"
            list-type="picture"
            :show-file-list="false"
            :auto-upload="false"
          >
            <el-button size="small" type="primary">{{$t('CSS.watermark.16')}}</el-button>
            <div slot="tip" class="el-upload__tip">{{$t('CSS.watermark.14')}}</div>
            <div slot="file" slot-scope="{file}">
            </div>
          </el-upload>
        </el-row>
      </el-form-item>
      <el-form-item :label="$t('CSS.watermark.7')">
        <div class="edit-img">
          <draggable-resizable
            :x="x"
            :y="y"
            :w="w"
            :h="h"
            :maxWidth="200"
            :parent="true"
            @dragging="onDrag"
            @dragstop="onDragstop"
            @resizing="onResize"
          >
            <!-- @@dragging="onDragging" -->
            <img :src="ruleForm.PictureUrl" style="max-width: 100%; max-height: 100%; position: absolute;" />
          </draggable-resizable>
        </div>
      </el-form-item>
      <el-form-item :label="$t('CSS.watermark.15')" prop="XPosition">
        <el-input-number v-model="ruleForm.XPosition" :step="1" step-strictly :max="99" :min="0" @blur="xblur" /> %
      </el-form-item>
      <el-form-item :label="$t('CSS.watermark.17')" prop="YPosition">
        <el-input-number v-model="ruleForm.YPosition" :step="1" step-strictly :max="99" :min="0" @blur="yblur"/> %
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
        <el-button @click="$parent._cancel()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { LIVE_ADDLIVEWATERMARK, LIVE_UPDATELIVEWATERMARK } from '@/constants'
import DraggableResizable from 'vue-draggable-resizable'
import 'vue-draggable-resizable/dist/VueDraggableResizable.css'
import COS from 'cos-js-sdk-v5'
import moment from 'moment'
import Vue from 'vue'
const cos = new COS({
  getAuthorization: async (_, callback) => {
    const res = await Vue.prototype.axios({
      url: 'bucket/uploadKey3',
      method: 'get'
    })
    console.log(res)
    callback({
      TmpSecretId: res.data.secretId,
      TmpSecretKey: res.data.secretKey,
      XCosSecurityToken: res.data.sessionToken,
      ExpiredTime: res.data.extra.expiredTime // SDK 在 ExpiredTime 时间前，不会再次调用 getAuthorization
    })
  }
})
export default {
  name: 'optionForm',
  components: {
    DraggableResizable
  },
  props: {
    selectItem: {
      type: Object
    }
  },

  data () {
    return {
      ruleForm: {
        WatermarkName: '',
        PictureUrl: '',
        YPosition: 0,
        XPosition: 0
      },
      w: 52,
      h: 27,
      x: 0,
      y: 0,
      rules: {
        WatermarkName: [
          { required: true, message: '填寫水印名稱', trigger: 'blur' },
          { validator (rule, value, callback) {
            if (!/^[\u4e00-\u9fa5a-zA-Z\d_-]{1,30}$/.test(value)) {
              callback(new Error('僅支持中文、英文、數字、_、-，不超過30個字符'))
            } else {
              callback()
            }
          },
          trigger: 'blur' }
        ],
        PictureUrl: [
          { required: true, message: '請上傳圖片', trigger: 'blur' }
        ]
      }
    }
  },

  mounted () {
    this.initTableParams()
    if (this.selectItem) {
      const w = Math.ceil(this.selectItem.Width * 640 / 100)
      this.x = Math.ceil(this.selectItem.XPosition * 640 / 100)
      this.y = Math.ceil(this.selectItem.YPosition * 360 / 100)
      const img = new Image()
      img.src = this.selectItem.PictureUrl
      img.onload = () => {
        this.w = w
        this.h = Math.ceil(img.height / (img.width / w))
      }
    }
  },

  methods: {
    onResize (x, y, width, height) {
      this.x = x
      this.y = y
      this.w = width
      this.h = height
    },
    onDrag (x, y) {
      this.x = x
      this.y = y
    },
    onDragstop (x, y) {
      this.ruleForm.XPosition = Math.ceil(x / 640 * 100)
      this.ruleForm.YPosition = Math.ceil(y / 360 * 100)
    },
    beforeUpload (f) {
      // console.log(file)
      const file = f.raw
      const isPNG = file.type === 'image/png'
      if (!isPNG) {
        this.$message({
          type: 'warning',
          message: '文件格式不正確'
        })
        return isPNG
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message({
          type: 'warning',
          message: '文件大小不能超過2M'
        })
        return isLt2M
      }

      cos.putObject({
        Bucket: 'livewatermark-1300560981', // 'watermark-1300560981', // 'wjtest-1301459465' "workorder-1300560981",
        Region: 'ap-taipei',
        StorageClass: 'STANDARD',
        Key: '/' + moment(new Date()).format('YYYY-MM-DD').valueOf() + '/' + file.name,
        Body: file // 上传文件对象
      },
      (err, data) => {
        this.ruleForm.PictureUrl = `https://${data.Location}`
      }
      )
      return true
    },
    xblur () {
      if (!this.ruleForm.XPosition) this.ruleForm.XPosition = 0
    },
    yblur () {
      if (!this.ruleForm.YPosition) this.ruleForm.YPosition = 0
    },
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 如果有selectItem则为修改

          const params = {
            PictureUrl: this.ruleForm.PictureUrl,
            XPosition: this.ruleForm.XPosition,
            YPosition: this.ruleForm.YPosition,
            WatermarkName: this.ruleForm.WatermarkName,
            Width: Math.ceil(this.w / 640 * 100),
            Height: 0,
            Version: '2018-08-01'
          }
          console.log(params)

          if (Object.keys(this.selectItem).length) {
            params.WatermarkId = this.ruleForm.WatermarkId,
            this.handleUpdate(params)
            return
          }

          this.handleAdd(params)
        }
      })
    },

    handleAdd (params) {
      this.axios.post(LIVE_ADDLIVEWATERMARK, params).then(data => {
        if (data.Response.Error == undefined) {
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          this.$parent.fetchRecordingList()
          this.$emit('update:formShow', false)
          return
        }
        this.$message.error(data.Response.Error.Message)
      })
    },

    handleUpdate (params) {
      this.axios.post(LIVE_UPDATELIVEWATERMARK, params).then(data => {
        if (data.Response.Error == undefined) {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.$parent.fetchRecordingList()
          this.$emit('update:formShow', false)
          return
        }
        this.$message.error(data.Response.Error.Message)
      })
    },

    initTableParams () {
      if (Object.keys(this.selectItem).length) {
        this.ruleForm = JSON.parse(JSON.stringify(this.selectItem))
      }
    }
  }
}
</script>

<style scoped lang='scss'>
.edit-img {
  height: 360px;
  width: 640px;
  position: relative;
  padding: 0px;
  background-color: gray;
}
.form-wrap >>> .el-input__inner,
.form-wrap >>> .el-button {
  height: 30px;
  line-height: 30px;
  padding-top: 0;
  font-size: 12px !important;
  border-radius: 0;
}
.input-number >>> .el-input__inner {
  height: 40px;
}
.form-wrap >>> .el-textarea__inner {
  border-radius: 0;
  font-size: 12px !important;
}
.form-wrap >>> .el-radio__label,
.form-wrap >>> .el-checkbox__label {
  font-size: 12px !important;
}
.form-wrap >>> .el-form-item__label {
  text-align: left;
  font-size: 12px !important;
}
.form-wrap {
  h4 {
    font-size: 14px;
    margin-bottom: 15px;
  }
  .explain {
    display: inline-block;
    p {
      line-height: 18px;

      a {
        color: #006eff;
      }
      a:hover {
        border-bottom: 1px #006eff solid;
      }
    }
  }
}
::v-deep .el-input-number{
  line-height: 28px
}
::v-deep .el-input__inner {
  height: 30px;
  line-height: 30px;
}
</style>

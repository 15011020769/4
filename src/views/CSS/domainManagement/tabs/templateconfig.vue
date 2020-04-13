<template>
  <div>
    <div class="newClear">
      <div class="leftFloat">
        <div class="modileCon">
          <h1>
            回調配置
            <a @click="callBackEdit">{{ $t("CSS.domainManagement.10") }}</a>
          </h1>
          <div>
            <el-table empty-text="暫無數據" :data="callbackconfigData">
              <el-table-column
                prop="TemplateName"
                :label="$t('CSS.domainManagement.14')"
              ></el-table-column>
              <el-table-column
                prop="TemplateId"
                :label="$t('CSS.domainManagement.49')"
              ></el-table-column>
              <el-table-column
                prop="StreamBeginNotifyUrl"
                :label="$t('CSS.domainManagement.18')"
              ></el-table-column>
            </el-table>
          </div>
        </div>
        <div class="modileCon" v-if="info.IsDelayLive === 0">
          <h1>
            {{ $t("CSS.domainManagement.13") }}
            <a @click="ScreenshotEdit">{{ $t("CSS.domainManagement.10") }}</a>
          </h1>
          <div>
            <el-table empty-text="暫無數據" :data="screenshotData">
              <el-table-column
                prop="TemplateName"
                :label="$t('CSS.domainManagement.14')"
              ></el-table-column>
              <el-table-column
                prop="TemplateId"
                :label="$t('CSS.domainManagement.49')"
              ></el-table-column>
              <el-table-column
                prop="SnapshotInterval"
                :label="$t('CSS.domainManagement.17')"
              ></el-table-column>
              <el-table-column
                prop="PornFlag"
                :label="$t('CSS.domainManagement.16')"
              >
                <template slot-scope="scope">{{
                  scope.row.PornFlag === 0
                    ? $t("CSS.domainManagement.19")
                    : $t("CSS.domainManagement.20")
                }}</template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <div class="rightFloat">
        <div class="modileCon">
          <h1>
            {{ $t("CSS.domainManagement.12") }}
            <a @click="recordconfigEdit">{{ $t("CSS.domainManagement.10") }}</a>
          </h1>
          <div>
            <el-table empty-text="暫無數據" :data="recordingconfigData">
              <el-table-column
                prop="TemplateName"
                :label="$t('CSS.domainManagement.14')"
              ></el-table-column>
              <el-table-column
                prop="TemplateId"
                :label="$t('CSS.domainManagement.49')"
              ></el-table-column>
              <el-table-column
                prop="address"
                :label="$t('CSS.domainManagement.15')"
              >
                <template slot-scope="scope">{{ scope.row | format }}</template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="modileCon" v-if="info.IsDelayLive === 0">
          <h1>
            水印配置
            <a @click="waterEdit">{{ $t("CSS.domainManagement.10") }}</a>
          </h1>
          <div>
            <el-table empty-text="暫無數據" :data="watermarkconfigData">
              <el-table-column
                prop="WatermarkName"
                :label="$t('CSS.domainManagement.14')"
              ></el-table-column>
              <el-table-column
                prop="WatermarkId"
                :label="$t('CSS.domainManagement.49')"
              ></el-table-column>
              <el-table-column prop="address" label="水印位置">
                <template slot-scope="scope">{{
                  scope.row | position
                }}</template>
              </el-table-column>
              <el-table-column prop="address" label="操作">
                <template slot-scope="scope">
                  <a href="#" @click="previewWatermark(scope.row)">{{
                    $t("CSS.domainManagement.21")
                  }}</a>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <callbackconfigDataModel
        :checkedTemplateId="
          callbackconfigData.length > 0 && callbackconfigData[0].TemplateId
        "
        :isShow="callBackModel"
        @closeModel="closeModel"
      />
      <ScreenshotdataModel
        :checkedTemplateId="
          screenshotData.length > 0 && screenshotData[0].TemplateId
        "
        :isShow="ScreenshotModel"
        @closeScreenshotModel="closeScreenshotModel"
      />
      <recordconfigModel
        :checkedTemplateId="
          recordingconfigData.length > 0 && recordingconfigData[0].TemplateId
        "
        :isShow="recordconfigModel"
        @closeRecordModel="closeRecordModel"
      />
      <watermarkconfigmode
        :checkedWatermarkId="
          watermarkconfigData.length > 0 && watermarkconfigData[0].WatermarkId
        "
        :isShow="watermarkconfigmode"
        @closeWaterModel="closeWaterModel"
        @preview="previewWatermark"
      />
      <el-dialog width="800px" :visible.sync="previewDialog" title="预览">
        <div style="position: relative;">
          <img
            src="https://imgcache.qq.com/open_proj/proj_qcloud_v2/mc_2014/video/css/img/video-img.png"
          />
          <img :src="preview" :style="previewStyle" />
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import callbackconfigDataModel from '../model/callbackconfigDataModel'
import ScreenshotdataModel from '../model/ScreenshotdataModel'
import recordconfigModel from '../model/recordconfigModel'
import watermarkconfigmode from '../model/watermarkconfigmode'
import {
  RULELIST_DELTILS,
  LIVELIST_DELTILS,
  LIVE_DESCRIBE_LIVESNAPSHOTRULES,
  LIVE_DESCRIBE_LIVEWATERMARKRULES,
  SINGLECALLBACK_DELTILS,
  SINGLELIVE_DELTILS,
  LIVE_DESCRIBE_LIVESNAPSHOTTEMPLATE,
  LIVE_DESCRIBE_LIVEWATERMARK
} from '@/constants'

const defaultParam = {
  Version: '2018-08-01'
}
export default {
  props: {
    info: {
      required: false,
      type: Object
    }
  },
  data () {
    return {
      callbackconfigData: [], // 回调配置table
      screenshotData: [], // 截图&鉴黄配置
      recordingconfigData: [], // 录制配置
      watermarkconfigData: [], // 水印配置
      callBackModel: false, // 回调配置弹框
      ScreenshotModel: false, // 截图鉴黄配置弹框
      recordconfigModel: false, // 录制配置弹框
      watermarkconfigmode: false, // 水印配置弹框
      preview: '',
      previewDialog: false,
      previewStyle: {}
    }
  },
  components: {
    callbackconfigDataModel: callbackconfigDataModel,
    ScreenshotdataModel: ScreenshotdataModel,
    recordconfigModel: recordconfigModel,
    watermarkconfigmode: watermarkconfigmode
  },
  filters: {
    position (b) {
      if (!b) return
      if (b.XPosition < 50 && b.YPosition < 50) return '左上角'
      if (b.XPosition >= 50 && b.YPosition < 50) return '右上角'
      if (b.XPosition < 50 && b.YPosition >= 50) return '左下角'
      if (b.XPosition >= 50 && b.YPosition >= 50) return '右下角'
    },
    format (record) {
      const format = []
      if (record.FlvParam.Enable === 1) format.push('FLV')
      if (record.HlsParam.Enable === 1) format.push('HLS')
      if (record.Mp4Param.Enable === 1) format.push('MP4')
      if (record.AacParam.Enable === 1) format.push('AAC')
      if (record.Mp3Param.Enable === 1) format.push('MP3')
      return format.join()
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.callback()
      this.record()
      this.screenshot()
      this.watermark()
    },
    previewWatermark (obj) {
      this.preview = obj.PictureUrl
      this.previewDialog = true
      this.previewStyle = {
        position: 'absolute',
        'max-width': '200px',
        'max-height': '112px',
        width: `${0.01 * obj.Width * 760}px`,
        top: `${0.01 * obj.YPosition * 430}px`,
        left: `${0.01 * obj.XPosition * 760}px`
      }
    },
    callback () {
      this.setTemplate(
        RULELIST_DELTILS,
        SINGLECALLBACK_DELTILS,
        'callbackconfigData'
      )
    },
    record () {
      this.setTemplate(
        LIVELIST_DELTILS,
        SINGLELIVE_DELTILS,
        'recordingconfigData'
      )
    },
    screenshot () {
      this.setTemplate(
        LIVE_DESCRIBE_LIVESNAPSHOTRULES,
        LIVE_DESCRIBE_LIVESNAPSHOTTEMPLATE,
        'screenshotData'
      )
    },
    watermark () {
      this.setTemplate(
        LIVE_DESCRIBE_LIVEWATERMARKRULES,
        LIVE_DESCRIBE_LIVEWATERMARK,
        'watermarkconfigData',
        'WatermarkId'
      )
    },
    getRule (rules) {
      const domain = this.$route.query.Name
      return rules.find(rule => rule.DomainName === domain)
    },
    setTemplate (ruleUrl, templateUrl, key, paramKey = 'TemplateId') {
      this.axios.post(ruleUrl, defaultParam).then(({ Response }) => {
        const template = this.getRule(Response.Rules)
        if (template !== undefined) {
          this.axios
            .post(templateUrl, {
              ...defaultParam,
              [paramKey]: template.TemplateId
            })
            .then(({ Response }) => {
              this[key] = [Response.Template || Response.Watermark]
            })
        } else {
          this[key] = []
        }
      })
    },
    // 回调配置编辑
    callBackEdit () {
      this.callBackModel = true
    },
    // 关闭弹框
    closeModel (isShow) {
      this.callback()
      this.callBackModel = isShow
    },
    // 截图鉴黄配置编辑
    ScreenshotEdit () {
      this.ScreenshotModel = true
    },
    closeScreenshotModel (isShow) {
      this.screenshot()
      this.ScreenshotModel = isShow
    },
    // 录制配置编辑按钮
    recordconfigEdit () {
      this.recordconfigModel = true
    },
    // 关闭
    closeRecordModel (isShow) {
      this.record()
      this.recordconfigModel = isShow
    },
    // 水印配置编辑
    waterEdit () {
      this.watermarkconfigmode = true
    },
    // 关闭
    closeWaterModel (isShow) {
      this.watermark()
      this.watermarkconfigmode = isShow
    }
  }
}
</script>
<style lang="scss" scoped>
.newClear:after {
  content: "";
  display: block;
  clear: both;
}
.leftFloat {
  float: left;
  width: 50%;
  padding-right: 10px;
}
.rightFloat {
  float: left;
  padding-left: 10px;
  width: 50%;
}
.modileCon {
  width: 100%;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
  min-height: 100px;
  margin-bottom: 20px;
  h1 {
    font-size: 14px;
    color: #000;
    font-weight: 600;
    a {
      float: right;
      font-size: 12px;
      font-weight: 100;
      margin-bottom: 12px;
    }
  }
}
</style>

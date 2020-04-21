<template>
  <div>
    <div>
      <el-dialog
        title="錄製配置"
        :visible.sync="isShow"
        :before-close="handleClose"
      >
        <div class="newClear">
          <p class="tip">
           {{$t('CSS.detailPlay.mbxz')}} 【<router-link
              to="/transcribe"
              >{{$t('CSS.leftSide.3')}}</router-link
            >】 <i class="el-icon-share"></i>{{$t('CSS.detailPlay.zjxsz')}}）
          </p>
          <div class="tableCon">
            <el-table
              :data="recordData"
              ref="multipleTable"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="55"> </el-table-column>
              <el-table-column
                prop="TemplateName"
                 :label="$t('CSS.domainManagement.14')"
              ></el-table-column>
              <el-table-column
                prop="TemplateId"
                :label="$t('CSS.domainManagement.49')"
              ></el-table-column>
              <el-table-column prop="TemplateName" label="錄製格式">
                <template slot-scope="scope">
                  {{ scope.row | format }}
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="saverecordEdit">保存</el-button>
          <el-button @click="handleClose">取消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { RECORDING_DELTILS, LIVE_DELETELIVERECORDRULE, LIVERULE_DELTILS } from '@/constants'
export default {
  props: {
    isShow: {
      required: false,
      type: Boolean
    },
    checkedTemplateId: {
      required: false
    }
  },
  data () {
    return {
      recordData: [], // 表格
      selection: []
    }
  },
  filters: {
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
  watch: {
    isShow (newVal) {
      if (newVal === true) {
        if (this.checkedTemplateId) {
          this.$nextTick(() => {
            this.recordData.forEach(template => {
              if (template.TemplateId === this.checkedTemplateId) {
                this.$refs.multipleTable.toggleRowSelection(template, true)
              }
            })
          })
        }
      }
    }
  },
  mounted () {
    this.axios.post(RECORDING_DELTILS, {
      Version: '2018-08-01',
      IsDelayLive: this.$route.query.IsDelayLive
    }).then(({ Response }) => {
      this.recordData = Response.Templates
    })
  },
  methods: {
    // checkbox
    handleSelectionChange (val) {
      this.selection = val
      if (val.length > 1) {
        this.$refs.multipleTable.clearSelection()
        this.$refs.multipleTable.toggleRowSelection(val.pop())
      }
    },
    // 关闭弹框
    handleClose () {
      this.$emit('closeRecordModel', false)
    },
    // 保存
    saverecordEdit () {
      this.axios.post(LIVE_DELETELIVERECORDRULE, {
        Version: '2018-08-01',
        DomainName: this.$route.query.Name,
        AppName: ''
      }).then(res => {
        if (this.selection.length > 0) {
          this.axios.post(LIVERULE_DELTILS, {
            Version: '2018-08-01',
            DomainName: this.$route.query.Name,
            AppName: '',
            TemplateId: this.selection[0].TemplateId
          }).then(() => {
            this.$emit('closeRecordModel', false)
          })
        } else {
          this.$emit('closeRecordModel', false)
        }
      })
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
::v-deep .el-dialog__header {
  font-size: 14px;
  font-weight: 600;
}
::v-deep .el-dialog__footer {
  text-align: center;
}
.tip {
  font-size: 12px;
}
.tableCon {
  width: 100%;
  border: 1px solid #ddd;
}
::v-deep thead {
  .el-table-column--selection {
    .cell {
      display: none;
    }
  }
}
</style>

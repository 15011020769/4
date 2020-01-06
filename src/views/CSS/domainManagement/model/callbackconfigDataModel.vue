<template>
  <div>
    <div>
      <el-dialog
        title="回调配置"
        :visible.sync="isShow"
        :before-close="handleClose">
        <div class="newClear">
          <p class="tip">模板选择（如需添加新模板，请前往<a>【 功能模板】<i class="el-icon-share"></i></a>中进行设置）</p>
          <div class="tableCon">
            <el-table
              :data="callbackconfigData"
              ref="multipleTable"
              @selection-change="handleSelectionChange"
            >
              <el-table-column
                type="selection"
                width="55">
              </el-table-column>
              <el-table-column prop="TemplateName" label="模板名称"></el-table-column>
              <el-table-column prop="TemplateId" label="模板ID"></el-table-column>
              <el-table-column prop="StreamBeginNotifyUrl" label="回调地址"></el-table-column>
            </el-table>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="saveCallEdit">保存</el-button>
          <el-button @click="handleClose">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { CALLBACK_DELTILS, LIVE_DELETELIVECALLBACKRULE, BACKRULE_DELTILS } from '@/constants'
export default {
  props:{
    isShow:{
      required:false,
      type:Boolean
    },
    checkedTemplateId: {
      required: false,
    },
  },
  data(){
    return{
      callbackconfigData:[],//表格
      selection: [],
    }
  },
  watch: {
    isShow(newVal) {
      if (newVal === true) {
        if (this.checkedTemplateId) {
          this.$nextTick(() => {
            this.callbackconfigData.forEach(template => {
              if (template.TemplateId === this.checkedTemplateId) {
                this.$refs.multipleTable.toggleRowSelection(template, true)
              }
            })
          })
        }
      }
    }
  },
  mounted() {
    this.axios.post(CALLBACK_DELTILS, {
      Version: '2018-08-01'
    }).then(({ Response }) => {
      this.callbackconfigData = Response.Templates
    })
  },
  methods:{
    handleSelectionChange(val) {
      this.selection = val
      if (val.length > 1) {
        this.$refs.multipleTable.clearSelection()
        this.$refs.multipleTable.toggleRowSelection(val[1], true)
      }
    },
    //关闭弹框
    handleClose(){
      this.$emit("closeModel",false)
    },
    //保存
    saveCallEdit(){
      this.axios.post(LIVE_DELETELIVECALLBACKRULE, {
        Version: '2018-08-01',
        DomainName: this.$route.params.domain,
        AppName: ''
      }).then(res => {
        if (this.selection.length > 0) {
          this.axios.post(BACKRULE_DELTILS, {
            Version: '2018-08-01',
            DomainName: this.$route.params.domain,
            AppName: '',
            TemplateId: this.selection[0].TemplateId
          }).then(() => {
            this.$emit("closeModel",false)
          })
        } else {
          this.$emit("closeModel",false)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.newClear:after{
  display: block;
  content:'';
  clear:both;
}
::v-deep .el-dialog__header{
  font-size:14px;
  font-weight: 600;
}
::v-deep .el-dialog__footer{
  text-align:center;
}
.tip{
  font-size: 12px;
}
.tableCon{
  width:100%;
  border:1px solid #ddd;
}
::v-deep thead {
    .el-table-column--selection {
      .cell {
        display: none;
      }
    }
  }
</style>
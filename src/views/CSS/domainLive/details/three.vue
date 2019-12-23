<template>
  <div class="callback">
    <div class="callbackConfig one">
      <div class="callbackFlex">
        <p>回调配置</p>
        <p @click="callbackVisble = true">编辑</p>
      </div>
      <div>
        <el-table :data="callBackTemplate" style="width: 100%">
          <el-table-column prop="TemplateName" label="模板名称" width="180">
          </el-table-column>
          <el-table-column prop="TemplateId" label="模板ID" width="180">
          </el-table-column>
          <el-table-column prop="StreamBeginNotifyUrl" label="回调地址">
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="callbackConfig">
      <div class="callbackFlex">
        <p>录制配置</p>
        <p @click="cliveVisble = true">编辑</p>
      </div>
      <div>
        <el-table :data="RecordingTemplate" style="width: 100%">
          <el-table-column prop="TemplateName" label="模板名称" width="180">
          </el-table-column>
          <el-table-column prop="TemplateId" label="模板ID" width="180">
          </el-table-column>
          <el-table-column prop="" label="录制格式">
            <template slot-scope="scope">
              <span v-for="(item,index) in scope.row.RecordingFormat">
                {{item}},
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog title="回调配置" :visible.sync="callbackVisble" width="50%" center>
      <el-table :data="callBackList" style="width: 100%">
        <el-table-column width="30">
          <template slot-scope="scope">
            <el-radio v-model="callbackrRadio" :label="scope.row.TemplateId"
              @change.native="getCurrentRow(scope.row.TemplateId)">
            </el-radio>
          </template>
        </el-table-column>

        <el-table-column prop="TemplateName" label="模板名称">
        </el-table-column>
        <el-table-column prop="TemplateId" label="模板ID">
        </el-table-column>
        <el-table-column prop="StreamBeginNotifyUrl" label="回调地址">
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="callbackVisble = false">取 消</el-button>
        <el-button type="primary" @click="callbackVisble = false">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="录制配置" :visible.sync="cliveVisble" width="50%" center>
      <el-table :data="RecordingList" style="width: 100%">
        <el-table-column width="30">
          <template slot-scope="scope">
            <el-radio v-model="liveRadio" :label="scope.row.TemplateId"
              @change.native="getCurrent(scope.row.TemplateId)">
            </el-radio>
          </template>
        </el-table-column>
        <el-table-column prop="TemplateName" label="模板名称">
        </el-table-column>
        <el-table-column prop="TemplateId" label="模板ID">
        </el-table-column>
        <el-table-column prop="" label="录制格式">
          <template slot-scope="scope">
            <span v-for="(item,index) in scope.row.RecordingFormat">
              {{item}},
            </span>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cliveVisble = false">取 消</el-button>
        <el-button type="primary" @click="cliveVisble = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import {
    CALLBACK_DELTILS,
    RECORDING_DELTILS,
    RULELIST_DELTILS,
    LIVELIST_DELTILS,
    SINGLECALLBACK_DELTILS,
    SINGLELIVE_DELTILS
  } from '@/constants'
  export default {
    data() {
      return {
        name: this.$route.query.name,
        callBackList: [], //回调配置列表
        RecordingList: [], //录制配置列表
        callBackTemplate: [], //回调配置
        RecordingTemplate: [], //录制配置
        callBackTemplateId: '',
        liveTemplateId: '',
        callbackVisble: false,
        cliveVisble: false,
        callbackrRadio: '',
        liveRadio: ''
      }
    },
    created() {
      this.GetCallbackList()
      this.GetRecordingList()
      this.GetRULELIST()
      this.GetRLIVELIST()
    },
    methods: {
      // 获取回调规则列表并拿到对应模板配置
      GetRULELIST() {
        const param = {
          Version: '2018-08-01',
        };
        this.axios.post(RULELIST_DELTILS, param).then(data => {
          if (data.Response.Error == undefined) {
            let callbackrule = data.Response.Rules
            callbackrule.forEach(item => {
              if (item.DomainName === this.name) {
                this.callBackTemplateId = item.TemplateId
                let parms = {
                  Version: '2018-08-01',
                  TemplateId: this.callBackTemplateId
                }
                this.axios.post(SINGLECALLBACK_DELTILS, parms).then(data => {
                  if (data.Response.Error == undefined) {
                    this.callbackrRadio = data.Response.Template.TemplateId
                    this.callBackTemplate.push(data.Response.Template)
                  } else {
                    this.$message.error(data.Response.Error.Message);
                  }
                });
              }
            })
          } else {
            this.$message.error(data.Response.Error.Message);
          }
        })
      },
      // 获取录制规则列表并拿到对应模板配置
      GetRLIVELIST() {
        const param = {
          Version: '2018-08-01',
        };
        this.axios.post(LIVELIST_DELTILS, param).then(data => {
          if (data.Response.Error == undefined) {
            let liverule = data.Response.Rules
            liverule.forEach(item => {
              if (item.DomainName === this.name) {
                this.liveTemplateId = item.TemplateId
                let parms = {
                  Version: '2018-08-01',
                  TemplateId: this.liveTemplateId
                }
                this.axios.post(SINGLELIVE_DELTILS, parms).then(data => {
                  if (data.Response.Error == undefined) {
                    let RecordingT = data.Response.Template
                    this.liveRadio = RecordingT.TemplateId
                    RecordingT.RecordingFormat = []
                    if (RecordingT.HlsParam.Enable == '1') {
                      RecordingT.RecordingFormat.push('HlsParam')
                    }
                    if (RecordingT.AacParam.Enable == '1') {
                      RecordingT.RecordingFormat.push('AacParam')
                    }
                    if (RecordingT.FlvParam.Enable == '1') {
                      RecordingT.RecordingFormat.push('FlvParam')
                    }
                    if (RecordingT.Mp4Param.Enable == '1') {
                      RecordingT.RecordingFormat.push('Mp4Param')
                    }
                    if (RecordingT.Mp3Param.Enable == '1') {
                      RecordingT.RecordingFormat.push('Mp3Param')
                    }
                    this.RecordingTemplate.push(data.Response.Template)
                  } else {
                    this.$message.error(data.Response.Error.Message);
                  }
                });
              }
            })
          } else {
            this.$message.error(data.Response.Error.Message);
          }
        })
      },




      GetCallbackList() {
        const param = {
          Version: '2018-08-01',
        };
        this.axios.post(CALLBACK_DELTILS, param).then(data => {
          if (data.Response.Error == undefined) {
            this.callBackList = data.Response.Templates
          } else {
            this.$message.error(data.Response.Error.Message);
          }
        });
      },
      GetRecordingList() {
        const param = {
          Version: '2018-08-01',
          IsDelayLive: 1
        };
        this.axios.post(RECORDING_DELTILS, param).then(data => {
          if (data.Response.Error == undefined) {
            this.RecordingList = data.Response.Templates
            this.RecordingList.forEach(item => {
              item.RecordingFormat = []
              if (item.HlsParam.Enable == '1') {
                item.RecordingFormat.push('HlsParam')
              }
              if (item.AacParam.Enable == '1') {
                item.RecordingFormat.push('AacParam')
              }
              if (item.FlvParam.Enable == '1') {
                item.RecordingFormat.push('FlvParam')
              }
              if (item.Mp4Param.Enable == '1') {
                item.RecordingFormat.push('Mp4Param')
              }
              if (item.Mp3Param.Enable == '1') {
                item.RecordingFormat.push('Mp3Param')
              }
            });
          } else {
            this.$message.error(data.Response.Error.Message);
          }
        });
      },
      getCurrentRow(TemplateId) {
        console.log(TemplateId)
        this.callbackrRadio = TemplateId
      },
      getCurrent(TemplateId) {
        console.log(TemplateId)
        this.liveRadio = TemplateId
      }
    },
  }

</script>
<style lang="scss" scoped>
  .callback {
    display: flex;

    .callbackConfig {
      .callbackFlex {
        display: flex;
        justify-content: space-between;
      }

      background-color: #fff;
      padding: 20px;
      flex: 1;


      p {
        line-height: 30px;
      }

      p:first-child {
        font-weight: bold;
        font-size: 14px;
      }

      p:last-child {
        color: #006EFF;
        cursor: pointer;
      }
    }

    .one {
      margin-right: 20px;
    }
  }

</style>

<template>
  <div class="transcribe-wrap">
    <HeaderCom :title="$t('CSS.transcribe.0')" />
    <div class="transcribe-main">
      <!-- <div class="explain">
        <p>
          {{$t('CSS.transcribe.1')}}
          <a href="#">{{$t('CSS.transcribe.2')}}</a>
        </p>
      </div> -->
      <div class="explain">
        <p>
          {{$t('CSS.watermark.3')}}
          <router-link to="/domainManagement">域名管理</router-link>{{$t('CSS.watermark.4')}}
          <!-- <a href="#">{{$t('CSS.watermark.2')}}</a> -->
          {{$t('CSS.watermark.5')}}
        </p>
      </div>
      <div class="main-box">
        <div class="left">
          <i class="el-icon-plus" @click="_add" />
          <i class="el-icon-delete" @click="modalVisible=true"/>
          <ul class="recording-list-box">
            <li
              v-for="item in configList"
              @click="onSelectRecording(item)"
              :class="selectItem.TemplateId === item.TemplateId && 'is-selected'"
              >
                {{item.TemplateName}}
              </li>
          </ul>
        </div>
        <div class="right">
          <OptionForm
            :formShow.sync="formShow"
            :selectItem="selectItem"
            v-if="formShow"
            />
          <ConfigDetail
            v-if="!formShow"
            :selectItem="selectItem"
            :formShow.sync="formShow"
            />
        </div>
          <DeleteModal
            :modalVisible.sync="modalVisible"
            :domainName="selectItem.TemplateName"
          />
      </div>
    </div>
  </div>
</template>

<script>
import HeaderCom from "@/components/public/Head"
import OptionForm from "./tab/optionForm"
import ConfigDetail from "./tab/configDetail"
import DeleteModal from './modal/modal'
import { RECORDING_DELTILS, DELETE_RECORDING_CONFIG } from "@/constants"
export default {
  name: "transcribe",
  data() {
    return {
      formShow: false,
      configList: [],
      selectItem: {},
      modalVisible: false,
      selectIndex: 0
    };
  },
  components: {
    HeaderCom,
    OptionForm,
    ConfigDetail,
    DeleteModal
  },

  mounted() {
    this.fetchRecordingList()
  },

  methods: {
    _add() {
      this.selectItem = {}
      this.formShow = true;
    },

    _close() {
      this.formShow = false;
    },

     _cancel() {
      this.selectItem = this.configList[this.selectIndex]
      this.formShow = false;
    },

    _delete() {
      this.axios.post(DELETE_RECORDING_CONFIG, {
        Version: '2018-08-01',
        TemplateId: this.selectItem.TemplateId
      }).then(data => {
       if (data.Response.Error == undefined) {
         this.modalVisible = false
         this.$message({
           message: '删除成功',
           type: 'success'
         })
          this.fetchRecordingList()
          return
        }
        this.$message.error(data.Response.Error.Message)
      })
    },

    fetchRecordingList() {
      this.axios.post(RECORDING_DELTILS, {
        Version: '2018-08-01'
      }).then(data => {
        if (data.Response.Error == undefined) {
          this.configList = data.Response.Templates
          this.selectItem=this.configList[0]
          return
        }
        this.$message.error(data.Response.Error.Message)
      })
    },

    // 选中模板
    onSelectRecording(item) {
      this.formShow = false
      this.selectItem = item
      this.selectIndex = this.configList.findIndex(_item => item.TemplateId === _item.TemplateId)

    }
  }
};
</script>

<style lang="scss" scoped>
.transcribe-wrap {
  .transcribe-main {
    padding: 20px;
    box-sizing: border-box;

    .main-box {
      background-color: #fff;
      box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
      padding: 20px;
      box-sizing: border-box;
      margin-bottom: 20px;
      display: flex;

      .left {
        width: 20%;
        i {
          font-size: 15px;
          font-weight: bold;
          color: #666;
          margin-right: 14px;
          cursor: pointer;
        }
        .recording-list-box {
          margin-top: 20px;
          > li {
            height: 35px;
            line-height: 35px;
            cursor: pointer;
            padding-left: 10px;
          }
          .is-selected {
            background-color: #e5e5e5;
          }
        }
      }
      .right {
        flex: 1;
        border-left: 1px #ccc solid;
        padding: 20px;
        box-sizing: border-box;
        margin-left: 10px;
      }
    }

    .explain {
      color: #003b80;
      border: 1px solid #97c7ff;
      background: #e5f0ff;
      padding: 10px 30px 10px 20px;
      margin-bottom: 20px;
      border-radius: 2px;

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
}
</style>

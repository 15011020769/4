<template>
  <div class="Journal">
    <div class="Choice">
      <el-select v-model="ChoiceValue" class="select" @change="_GetJournal">
        <el-option v-for="item in ChoiceOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <TimeDropDown :TimeArr="TimeArr" :Datecontrol="true" :Graincontrol="false" :Difference="'H'"
        v-on:switchData="GetDat" v-on:_Reset="_Reset" />
      <el-input :placeholder="$t('SCF.total.qsrid')" v-model="requestId" @change="_search"></el-input>
      <el-button icon="el-icon-search" size="small" @click="_GetJournal"></el-button>
    </div>
    <div class="content" v-if="contentshow===true">
      <div class="menu">
        <ul v-for="(item,index) in JournalList" :key="index">
          <li @click="_switch(item)">
            <span>{{item.StartTime}}</span>
            <span v-if="item.RetCode===0" class="success">{{$t('SCF.total.dycg')}}</span>
            <span v-else class="fail">{{$t('SCF.total.dysb')}}</span>
          </li>
        </ul>
      </div>
      <div class="contentx">
        <p class="contentID">{{$t('SCF.total.qqid')}}:&nbsp;&nbsp;&nbsp;{{content.RequestId}}</p>
        <div class="information">
          <p>
            {{$t('SCF.total.sj')}}:
            <span>{{content.StartTime}}</span>
          </p>
          <p>
            {{$t('SCF.total.yxsj')}}:
            <span>{{content.Duration}}ms</span>
          </p>
          <p>
            {{$t('SCF.total.jfsj')}}:
            <span>{{content.BillDuration}}ms</span>
          </p>
          <p>
            {{$t('SCF.total.yxnc')}}:
            <span>{{content.MemUsage |UpMB()}}MB</span>
          </p>
        </div>
        <div class="RetMsg_Log">
          <div>
            <p class="title">{{$t('SCF.total.fhsj')}}:</p>
            <p>{{content.RetMsg}}</p>
          </div>
          <div>
            <p class="title">{{$t('SCF.total.rz')}}:</p>
            <p>{{content.Log}}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="content" v-if="contentshow===false">
      <div class="menu">
        <ul>
          <li>{{$t('SCF.total.zwrzxx')}}</li>
        </ul>
      </div>
      <div class="contentx">
        <p class="contentID">{{$t('SCF.total.qqid')}}:&nbsp;&nbsp;&nbsp;</p>
        <div class="information">
          <p>
            {{$t('SCF.total.sj')}}:
            <span></span>
          </p>
          <p>
            {{$t('SCF.total.yxsj')}}:
            <span>0ms</span>
          </p>
          <p>
            {{$t('SCF.total.jfsj')}}:
            <span>0ms</span>
          </p>
          <p>
            {{$t('SCF.total.yxnc')}}:
            <span>0MB</span>
          </p>
        </div>
        <div class="RetMsg_Log">
          <div>
            <p class="title">{{$t('SCF.total.fhsj')}}:</p>
            <p></p>
          </div>
          <div>
            <p class="title">{{$t('SCF.total.rz')}}:</p>
            <p></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {
    FUN_LOG
  } from "@/constants";
  import {
    ErrorTips
  } from "@/components/ErrorTips";
  import TimeDropDown from "./TimeDropDown"; //引入时间组件
  export default {
    props: ["FunctionVersion"],
    data() {
      return {
        functionName: this.$route.query.functionName,
        ChoiceOptions: [{
            label: "全部日誌",
            value: ""
          },
          {
            label: "正確日誌",
            value: "is0"
          },
          {
            label: "錯誤日誌",
            value: "not0"
          }
        ],
        ChoiceValue: "",
        TimeArr: [{
            name: "實時",
            Time: "realTime",
            TimeGranularity: [{
              value: "",
              label: ""
            }]
          },
          {
            name: "近24小時",
            Time: "Nearly_24_hours",
            TimeGranularity: [{
              value: "",
              label: ""
            }]
          }
        ],
        requestId: "",
        Time: {},
        JournalList: [], //日志列表
        contentID: "",
        contentshow: true,
        content: {}
      };
    },
    components: {
      TimeDropDown
    },
    created() {},
    methods: {
      GetDat(data) {
        this.Time = data[1];
        this._GetJournal();
      },
      _GetJournal() {
        let param = {
          Region: localStorage.getItem("regionv2"),
          Version: "2018-04-16",
          FunctionName: this.functionName,
          StartTime: this.Time.StartTIme,
          EndTime: this.Time.EndTIme,
          "Filter.RetCode": this.ChoiceValue,
          Qualifier: this.FunctionVersion,
          Namespace: this.$route.query.SpaceValue
        };
        if (this.requestId != "") {
          param["FunctionRequestId"] = this.requestId;
        }
        this.axios.post(FUN_LOG, param).then(res => {
          if (res.Response.Error === undefined) {
            this.JournalList = res.Response.Data;
            if (this.JournalList.length !== 0) {
              this.contentshow = true;
              if (this.contentID === "") {
                this.contentID = this.JournalList[0].RequestId;
              }
              this.JournalList.forEach(item => {
                if (this.contentID === item.RequestId) {
                  this.content = item;
                }
              });
            } else {
              this.contentshow = false;
            }
          } else {
            let ErrTips = {
              InternalError: "內部錯誤",
              "nternalError.ES": "ES錯誤",
              "InternalError.System": "內部系統錯誤",
              "InvalidParameter.Payload": "請求參數不合法",
              InvalidParameterValue: "參數取值錯誤",
              "InvalidParameterValue.DateTime": "DateTime傳入錯誤",
              "InvalidParameterValue.StartTimeOrEndTime": "開始時間與結束時間僅可相差一天"
            };
            let ErrOr = Object.assign(ErrorTips, ErrTips);
            this.$message({
              message: ErrOr[res.Response.Error.Code],
              type: "error",
              showClose: true,
              duration: 0
            });
          }
        });
      },
      _Reset() {
        this.ChoiceValue = ''
        this.requestId = ''
        this._GetJournal();
      },
      _search() {
        if (this.requestId == "") {
          this._GetJournal();
        }
      },
      _switch(data) {
        this.contentID = data.RequestId;
        this.JournalList.forEach(item => {
          if (this.contentID === item.RequestId) {
            this.content = item;
          }
        });
      }
    },
    filters: {
      UpMB(value) {
        return (value / 1048576).toFixed(3);
      }
    }
  };

</script>
<style lang="scss" scoped>
  // .Journal >>> .el-time-spinner__list {
  //   margin: -12px;
  // }
  // .Journal
  //   >>> .el-time-panel__content
  //   .el-scrollbar__wrap
  //   ul.el-time-spinner__list {
  //   margin: -12px !important;
  //   margin-left: -12px !important;
  //   margin-right: 12px !important;
  //   margin-top: -12px !important;
  //   margin-bottom: -12px !important;
  // }
  .Journal>>>.el-input__inner {
    height: 32px !important;
    line-height: 32px !important;
  }

  .Journal {
    background-color: #fff;
    box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
    padding: 20px;

    .Choice {
      display: flex;

      .TimeDropDown {
        margin-right: 20%;
      }

      .el-input {
        width: 160px;
        height: 32px !important;
        line-height: 32px !important;
      }

      .el-select {
        width: 120px;
      }

      .select {
        margin-right: 20px;
      }
    }

    .content {
      display: flex;
      margin-top: 30px;

      .menu {
        height: 800px;
        width: 260px;
        border-right: 1px solid #ddd;

        ul {
          li {
            cursor: pointer;
            line-height: 50px;
            border-bottom: 1px solid #ddd;

            .success {
              padding-left: 20px;
              color: #0abf5b;
            }

            .fail {
              padding-left: 30px;
              color: #e54545;
            }
          }
        }
      }

      .contentx {
        width: 100%;
        margin-left: 20px;

        .contentID {
          font-size: 14px;
        }

        .information {
          margin-top: 20px;
          display: flex;
          background-color: rgb(242, 242, 242);
          padding: 10px;

          p {
            padding-right: 20px;
            color: #888;

            span {
              padding-left: 6px;
              color: black;
            }
          }
        }

        .RetMsg_Log {
          font-size: 14px;
          margin-top: 20px;
          padding-left: 20px;
          background-color: rgb(242, 242, 242);
          height: 800px;

          div {
            padding-top: 20px;

            .title {
              color: rgb(48, 127, 220);
              padding-bottom: 10px;
            }
          }
        }
      }
    }
  }

</style>

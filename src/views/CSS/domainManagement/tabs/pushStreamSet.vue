<template>
  <div>
    <div class="basicinfo">
      <h1 class="newClear" style="cursor: pointer">
        {{ $t("CSS.domainManagement.22") }}
        <a @click="editSet">{{ $t("CSS.domainManagement.10") }}</a>
      </h1>
      <div class="newClear">
        <div class="newClear newList">
          <p>{{ $t("CSS.domainManagement.23") }}</p>
          <p>
            {{
              pushAuthKeyInfo.Enable === 0
                ? $t("CSS.domainManagement.32")
                : $t("CSS.domainManagement.7")
            }}
          </p>
        </div>
        <div class="newClear newList">
          <p>主KEY</p>
          <p>{{ pushAuthKeyInfo.MasterAuthKey }}</p>
        </div>
        <div class="newClear newList">
          <p>{{ $t("CSS.domainManagement.24") }}</p>
          <p>{{ pushAuthKeyInfo.BackupAuthKey }}</p>
        </div>
      </div>

      <editSet
        :isShow="editSetModel"
        :pushAuthKeyInfo="pushAuthKeyInfo"
        @closeModel="closeModel"
        @changed="pushAuthKeyInfoChanged"
      />
    </div>
    <div class="basicinfo">
      <h1 class="newClear">推流地址生成器</h1>
      <div class="bgGray">
        <div class="newClear newList1">
          <p>{{ $t("CSS.domainManagement.25") }}Key</p>
          <p>{{ pushAuthKeyInfo.MasterAuthKey }}</p>
        </div>
        <div class="newClear newList1">
          <p>{{ $t("CSS.domainManagement.26") }}</p>
          <p>{{ callBackTemplate.StreamBeginNotifyUrl }}</p>
        </div>
        <div class="newClear newList1">
          <p>推流域名</p>
          <p>{{ $route.query.Name }}</p>
        </div>
      </div>
      <div class="dateOut">
        <span class="spanBlod">{{ $t("CSS.domainManagement.27") }}</span>
        <el-date-picker
          class="dataDateTime"
          :clearable="false"
          v-model="dataDateTime"
          type="date"
          :placeholder="$t('CSS.domainManagement.31')"
        ></el-date-picker>
        <el-time-picker
          :clearable="false"
          v-model="dateValue"
          class="dateValue"
        ></el-time-picker>
        <span class="spanBlod">StreamName &nbsp;&nbsp;</span>
        <el-input
          :placeholder="$t('CSS.domainManagement.28')"
          v-model="streamName"
          class="streamName"
        ></el-input>
        <el-button @click="generatePushUrl">生成堆流地址</el-button>
      </div>
      <div class="newClear">
        <span class="leftCon">推流地址</span>
        <span v-if="pushUrl">{{ pushUrl }}</span>
        <span class="rightCon" v-else>{{ $t("CSS.domainManagement.29") }}</span>
      </div>
    </div>
    <div class="basicinfo">
      <h1 class="newClear">{{ $t("CSS.domainManagement.30") }}</h1>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="php" name="first">
          <div class="greyContent">
            <pre>
    function getPushUrl($domain, $streamName, $key = null, $time = null){
      if($key && $time){
        $txTime = strtoupper(base_convert(strtotime($time),10,16));
        //txSecret = MD5( KEY + streamName + txTime )
        $txSecret = md5($key.$streamName.$txTime);
        $ext_str = "?".http_build_query(array(
          "txSecret"=> $txSecret,
          "txTime"=> $txTime
        ));
      }
      return "rtmp://".$domain."/live/".$streamName . (isset($ext_str) ? $ext_str : "");
    }

    echo getPushUrl("123.test.com","123456","69e0daf7234b01f257a7adb9f807ae9f","2016-09-11 20:08:07");
            </pre>
          </div>
        </el-tab-pane>
        <el-tab-pane label="Java" name="second">
          <div class="greyContent">
            <pre>
    package com.test;

    import java.io.UnsupportedEncodingException;
    import java.security.MessageDigest;
    import java.security.NoSuchAlgorithmException;

    public class Test {

      public static void main(String[] args) {
            System.out.println(getSafeUrl("txrtmp", "11212122", 1469762325L));
      }

      private static final char[] DIGITS_LOWER =
            {'0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'};

      /*
      * KEY+ streamName + txTime
      */
      private static String getSafeUrl(String key, String streamName, long txTime) {
        String input = new StringBuilder().
                          append(key).
                          append(streamName).
                          append(Long.toHexString(txTime).toUpperCase()).toString();

        String txSecret = null;
        try {
              MessageDigest messageDigest = MessageDigest.getInstance("MD5");
              txSecret  = byteArrayToHexString(
                          messageDigest.digest(input.getBytes("UTF-8")));
        } catch (NoSuchAlgorithmException e) {
              e.printStackTrace();
        } catch (UnsupportedEncodingException e) {
              e.printStackTrace();
        }

        return txSecret == null ? "" :
                          new StringBuilder().
                          append("txSecret=").
                          append(txSecret).
                          append("&").
                          append("txTime=").
                          append(Long.toHexString(txTime).toUpperCase()).
                          toString();
      }

      private static String byteArrayToHexString(byte[] data) {
        char[] out = new char[data.length << 1];

        for (int i = 0, j = 0; i < data.length; i++) {
              out[j++] = DIGITS_LOWER[(0xF0 & data[i]) >>> 4];
              out[j++] = DIGITS_LOWER[0x0F & data[i]];
        }
        return new String(out);
      }
    }

            </pre>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import editSet from "../model/editSet";
import {
  LIVE_DESCRIBELIVE_PUSHAUTHKEY,
  RULELIST_DELTILS,
  SINGLECALLBACK_DELTILS
} from "@/constants";
import { toUTF8Array } from "@/utils";
import moment from "moment";
import md5 from "js-md5";
export default {
  props: {
    info: Object
  },
  data() {
    return {
      editSetModel: false, // 编辑弹框
      dataDateTime: new Date(), // 过期时间月份
      dateValue: new Date(moment().endOf("d")), // 时间
      streamName: "", // streamName
      activeName: "first", // tab
      pushAuthKeyInfo: {},
      callBackTemplate: {},
      pushUrl: ""
    };
  },
  watch: {
    streamName(newVal, oldVal) {
      this.streamName = newVal.replace(/[^\u0000-\u00FF]/g, "");
    }
  },
  components: {
    editSet: editSet
  },
  mounted() {
    // this.getLiveConfig();
    this.getAuthConf();
    const domain = this.$route.query.Name;
    const param = {
      Version: "2018-08-01"
    };
    this.axios.post(RULELIST_DELTILS, param).then(data => {
      if (data.Response.Error == undefined) {
        let callbackrule = data.Response.Rules;
        callbackrule.forEach(item => {
          if (item.DomainName === domain) {
            let parms = {
              Version: "2018-08-01",
              TemplateId: item.TemplateId
            };
            this.axios.post(SINGLECALLBACK_DELTILS, parms).then(data => {
              if (data.Response.Error == undefined) {
                this.callBackTemplate = data.Response.Template;
              } else {
                this.$message.error(data.Response.Error.Message);
              }
            });
          }
        });
      } else {
        this.$message.error(data.Response.Error.Message);
      }
    });
  },
  methods: {
    // getLiveConfig() {
    //   const param = {
    //     g_tk: "2033061200",
    //     _format: "jsonp",
    //     callback: "_jqjsp",
    //     Version: "2018-08-01",
    //     _1583895416231: ""
    //   };
    //   this.axios.get("live2/Live_Config_QueryLVBCodeMode", { params: param }).then(res => {
    //     console.log(res);
    //   });
    // },
    pushAuthKeyInfoChanged() {
      this.getAuthConf();
    },
    getAuthConf() {
      const domain = this.$route.query.Name;
      this.axios
        .post(LIVE_DESCRIBELIVE_PUSHAUTHKEY, {
          Version: "2018-08-01",
          DomainName: domain
        })
        .then(({ Response: { PushAuthKeyInfo } }) => {
          this.pushAuthKeyInfo = PushAuthKeyInfo;
        });
    },
    generatePushUrl() {
      if (!this.streamName || !this.streamName.trim()) {
        this.$message({
          type: "warning",
          message: "請輸入 StreamName"
        });
        return;
      }
      const timeHex = moment(
        `${moment(this.dataDateTime).format("YYYY-MM-DD")} ${moment(
          this.dateValue
        ).format("HH:mm:ss")}`
      )
        .unix()
        .toString(16)
        .toUpperCase();

      // console.log(this.pushAuthKeyInfo);

      // const Enable = this.pushAuthKeyInfo.Enable;
      let str = null;
      // 开启鉴权用主key，否则用备用key
      // if (Enable === 0) {
      //   str = `${this.pushAuthKeyInfo.BackupAuthKey}${this.streamName}${timeHex}`;
      // } else {
        str = `${this.pushAuthKeyInfo.MasterAuthKey}${this.streamName}${timeHex}`;
      // }
      // rtmp://68922.livepush.myqcloud.com/live/test?txSecret=edc5c066211981d3978afaff535aef3c&txTime=5E690AFF
      // rtmp://68922.livepush.myqcloud.com/live/test?txSecret=9d4125882f78603520c69b03a3ddca36&txTime=5E690AFF

      // rtmp://68922.livepush.myqcloud.com/live/test?txSecret=9d4125882f78603520c69b03a3ddca36&txTime=5E690AFF
      // rtmp://68922.livepush.myqcloud.com/live/test?txSecret=6a7f9adf0df2390b9ca6f8bbf32c9300&txTime=5E690AFF
      const txSecret = md5.hex(str);
      this.pushUrl = `rtmp://${this.$route.query.Name}/live/${this.streamName}?txSecret=${txSecret}&txTime=${timeHex}`;
    },
    // 编辑
    editSet() {
      this.editSetModel = true;
    },
    // 关闭
    closeModel(isShow) {
      this.getAuthConf();
      this.editSetModel = isShow;
    },
    // tab
    handleClick() {}
  }
};
</script>
<style lang="scss" scoped>
.newClear:after {
  display: block;
  content: "";
  clear: both;
}
::v-deep input {
  height: 30px;
  border-radius: 0;
  width: 100%;
}
::v-deep button {
  height: 30px;
  padding: 0 20px;
  line-height: 30px;
  // color: #fff;
  // background-color: #006eff;
  // border-radius: 0;
  // border: 1px solid #006eff;
}
.bgGray {
  background-color: #f2f2f2;
  width: 100%;
  padding: 20px;
  margin-bottom: 20px;
  .newList1 {
    margin-bottom: 30px;
    p:nth-child(1) {
      font-size: 12px;
      color: #999;
      float: left;
      width: 120px;
    }
    p:nth-child(2) {
      font-size: 12px;
      color: #000;
      float: left;
      width: calc(100% - 120px);
    }
  }
}
.basicinfo {
  width: 100%;
  min-height: 100px;
  background-color: #fff;
  border: 1px solid #ddd;
  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
  padding: 20px;
  margin-bottom: 20px;
  h1 {
    font-size: 14px;
    font-weight: 600;
    color: #000;
    margin-bottom: 30px;
    a {
      float: right;
      font-size: 12px;
      font-weight: 100;
    }
  }
  .newList {
    margin-bottom: 30px;
    p:nth-child(1) {
      font-size: 12px;
      color: #999;
      float: left;
      width: 70px;
    }
    p:nth-child(2) {
      font-size: 12px;
      color: #000;
      float: left;
      width: calc(100% - 70px);
    }
  }
}
.dateOut {
  padding-bottom: 20px;
  border-bottom: 1px solid #ddd;
  margin-bottom: 20px;
  .spanBlod {
    font-size: 12px;
    color: #888;
    font-weight: 600;
  }
}
.dataDateTime {
  width: 132px;
  margin: 0 20px 0 12px;
  font-size: 12px;
  ::v-deep .el-input__icon {
    line-height: 1;
  }
}
.dateValue {
  width: 120px;
  margin-right: 20px;
  ::v-deep .el-input__icon {
    line-height: 1;
  }
}
.streamName {
  width: 200px;
  margin: 0 30px 0 0;
  font-size: 12px;
}
.leftCon {
  display: inline-block;
  width: 70px;
  font-size: 12px;
  color: #999;
}
.rightCon {
  display: inline-block;
  width: calc(100% - 70px);
  font-size: 12px;
  color: #999;
}
.greyContent {
  width: 100%;
  height: 285px;
  overflow-y: auto;
  background-color: #f5f2f0;
  border-radius: 4px;
}
</style>

<template>
  <div>
    <div class="basicinfo" v-loading="loading">
      <el-row type="flex" justify="space-between">
        <h1 class="">{{ $t("CSS.domainManagement.22") }}</h1>
        <el-button @click="edit" type="text">
          {{ $t("CSS.watermark.12") }}
        </el-button>
      </el-row>
      <div class="bgGray">
        <div class="newClear newList1">
          <p>{{ $t("CSS.detailPlay.playauthentication") }}</p>
          <p>
            {{
              playAuthKeyInfo.Enable === 1
                ? $t("CSS.domainManagement.20")
                : $t("CSS.domainManagement.32")
            }}
          </p>
        </div>
        <div class="newClear newList1">
          <p>主KEY</p>
          <p>{{ playAuthKeyInfo.AuthKey }}</p>
        </div>
        <div class="newClear newList1">
          <p>备KEY</p>
          <p>{{ playAuthKeyInfo.AuthBackKey }}</p>
        </div>
        <div class="newClear newList1">
          <p>{{ $t("CSS.detailPlay.effectivetime") }}(秒)</p>
          <p>{{ playAuthKeyInfo.AuthDelta }}</p>
        </div>
      </div>
    </div>
    <el-dialog
      :visible.sync="visible"
      :title="$t('CSS.domainManagement.22')"
      width="550px"
      destroy-on-close
    >
      <auth-config
        :authKeyInfo="playAuthKeyInfo"
        :visible.sync="visible"
        @success="getAuthConf"
      />
    </el-dialog>
  </div>
</template>
<script>
import {
  LIVE_DESCRIBE_LIVEPLAYAUTHKEY
} from '@/constants'
import AuthConfig from '../model/authConfig'
import moment from 'moment'
import md5 from 'js-md5'
export default {
  data () {
    return {
      playAuthKeyInfo: {},
      loading: true,
      visible: false
    }
  },
  components: {
    AuthConfig
  },
  mounted () {
    this.getAuthConf()
  },
  methods: {
    getAuthConf () {
      this.loading = true
      this.visible = false
      this.axios
        .post(LIVE_DESCRIBE_LIVEPLAYAUTHKEY, {
          Version: '2018-08-01',
          DomainName: this.$route.query.Name
        })
        .then(({ Response: { PlayAuthKeyInfo } }) => {
          this.loading = false
          this.playAuthKeyInfo = PlayAuthKeyInfo
        })
    },
    edit () {
      this.visible = true
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
.bgGray {
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
      word-break: break-word;

      line-height: 20px;
    }
  }
}
.basicinfo {
  width: 50%;
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
  .newClear {
    margin-bottom: 30px;
  }
  .newList {
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
  width: 135px;
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
.sub-text {
  font-size: 12px;
  color: #888;
  margin-left: 5px;
}
.tip {
  color: #888;
}
</style>

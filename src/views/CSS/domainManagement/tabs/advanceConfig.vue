<template>
  <el-row :gutter="20">
    <el-col :span="12">
      <div class="basicinfo" v-loading="loading1">
        <el-row type="flex" justify="space-between">
          <h1 class="">
            HTTPS配置
            <el-tooltip
              class="item"
              effect="dark"
              :content="$t('CSS.detailPlay.3')"
              placement="right"
            >
              <i class="el-icon-info" />
            </el-tooltip>
          </h1>
          <el-button @click="editCert" type="text">{{
            $t("CSS.watermark.12")
          }}</el-button>
        </el-row>
        <div class="bgGray">
          <div class="newClear newList1">
            <p>HTTPS{{ $t("CSS.detailPlay.service") }}</p>
            <p>
              {{
                cert && cert.Status === 1
                  ? $t("CSS.domainManagement.20")
                  : $t("CSS.domainManagement.32") ||
                    $t("CSS.domainManagement.20")
              }}
            </p>
          </div>
          <div class="newClear newList1">
            <p>{{ $t("CSS.detailPlay.certificateExpirationTime") }}</p>
            <p>{{ (cert && cert.CertExpireTime) || "暂无" }}</p>
          </div>
        </div>
      </div>
      <!-- </el-card> -->
      <!-- <el-card> -->
      <div class="basicinfo" v-loading="loading2">
        <el-row type="flex" justify="space-between">
          <h1 class="">
            {{ $t("CSS.detailPlay.bandwidthCapping") }}配置
            <el-tooltip
              class="item"
              effect="dark"
              :content="$t('CSS.detailPlay.4')"
              placement="right"
            >
              <i class="el-icon-info" />
            </el-tooltip>
          </h1>
          <el-button @click="editBandLimit" type="text">{{
            $t("CSS.watermark.12")
          }}</el-button>
        </el-row>
        <div class="bgGray">
          <div class="newClear newList1">
            <p>{{ $t("CSS.detailPlay.bandwidthCapping") }}</p>
            <p>
              {{
                bandLimit.BandLimitEnable === 1
                  ? $t("CSS.domainManagement.20")
                  : $t("CSS.domainManagement.32")
              }}
            </p>
          </div>
          <div
            class="newClear newList1"
            v-if="
              bandLimit.AbroadBandLimitEnable === 1 && domainInfo.PlayType === 3
            "
          >
            <p>港澳台及海外地区带宽阈值</p>
            <p>{{ bandLimit.AbroadBandLimitValue | unit }}</p>
          </div>
          <div
            class="newClear newList1"
            v-if="
              bandLimit.DomesticBandLimitEnable === 1 &&
                domainInfo.PlayType === 1
            "
          >
            <p>中国大陆带宽阈值</p>
            <p>{{ bandLimit.DomesticBandLimitValue | unit }}</p>
          </div>
          <div
            class="newClear newList1"
            v-if="
              bandLimit.GlobalBandLimitEnable === 1 && domainInfo.PlayType === 2
            "
          >
            <p>全球带宽阈值</p>
            <p>{{ bandLimit.GlobalBandLimitValue | unit }}</p>
          </div>
        </div>
      </div>
      <!-- </div> -->
      <!-- </el-card> -->
    </el-col>
    <el-col :span="12">
      <!-- <el-card> -->
      <div class="basicinfo" v-loading="loading3">
        <el-row type="flex" justify="space-between">
          <h1 class="">{{ $t("CSS.detailPlay.rgional") }}配置</h1>
          <el-button @click="editRegion" type="text">{{
            $t("CSS.watermark.12")
          }}</el-button>
        </el-row>
        <div class="bgGray">
          <div class="newClear newList1">
            <p>加速{{ $t("CSS.detailPlay.rgional") }}</p>
            <p>{{ domainInfo.PlayType | playType }}</p>
          </div>
        </div>
      </div>

      <div class="basicinfo" v-loading="loading4">
        <el-row type="flex" justify="space-between">
          <h1 class="">
            {{ $t("CSS.detailPlay.sourceStationSetup") }}
            <el-tooltip
              class="item"
              effect="dark"
              :content="$t('CSS.detailPlay.5')"
              placement="bottom"
            >
              <i class="el-icon-info" />
            </el-tooltip>
          </h1>
          <el-button @click="editResource" type="text">{{
            $t("CSS.watermark.12")
          }}</el-button>
        </el-row>
        <div class="bgGray">
          <div class="newClear newList1">
            <p>{{ $t("CSS.detailPlay.sourceStationSetup") }}</p>

            <p v-if="resource.Status === 0">部署中</p>
            <p v-if="resource.Status === 1">
              {{ $t("CSS.domainManagement.32") }}
            </p>
            <p v-if="resource.Status === 2">
              {{ $t("CSS.domainManagement.20") }}中
            </p>
            <p v-if="resource.Status === 3">
              {{ $t("CSS.domainManagement.20") }}
            </p>
          </div>
          <div class="newClear newList1">
            <p>{{ $t("CSS.detailPlay.6") }}</p>
            <p>{{ resource.SourceStreamFormat || "暂无" }}</p>
          </div>
          <div class="newClear newList1">
            <p>{{ $t("CSS.detailPlay.7") }}</p>
            <p>{{ resource.CdnStreamFormat || "暂无" }}</p>
          </div>
          <div class="newClear newList1">
            <p>源站地址ip/domain</p>
            <p>{{ resource.SourceServerType === 0 ? "ip" : "domain" }}</p>
          </div>
          <div class="newClear newList1">
            <p>主源地址</p>
            <p>
              {{
                (resource.SourceServerAddress &&
                  resource.SourceServerAddress[0]) ||
                  "暂无"
              }}
            </p>
          </div>
        </div>
      </div>
      <!-- </el-card> -->
      <el-dialog
        title="HTTPS配置"
        :visible.sync="visibleHttps"
        destroy-on-close
        width="550px"
      >
        <cert :cert="cert" @success="getCert" :visible="visibleHttps" />
      </el-dialog>
      <el-dialog
        :title="$t('CSS.detailPlay.bandwidthCapping') + '配置'"
        :visible.sync="visibleBandLimit"
        destroy-on-close
        width="800px"
      >
        <band-limit
          :playType="domainInfo.PlayType"
          :bandLimit="bandLimit"
          @success="getBandLimit"
          :visible="visibleBandLimit"
        />
      </el-dialog>
      <el-dialog
        :title="取消 + '配置'"
        :visible.sync="visibleRegional"
        destroy-on-close
        width="500px"
      >
        <regional-config-model
          :bandLimit="domainInfo.PlayType"
          @success="getRegion"
          @handleClose="handleCloseRegion"
          :visible="visibleBandLimit"
        />
      </el-dialog>
      <el-dialog
        :title="$t('CSS.detailPlay.sourceStationSetup')"
        :visible.sync="visibleSourceStationSetup"
        destroy-on-close
        width="500px"
      >
        <source-station-setup
          :playType="domainInfo.PlayType"
          :bandLimit="domainInfo"
          :resourceData="resource"
          @success="getResource"
          @handleClose="handleCloseSource"
          :visible="visibleBandLimit"
        />
      </el-dialog>
    </el-col>
  </el-row>
</template>
<script>
import {
  DESCRIBE_LIVE_BAND_LIMIT,
  DESCRIBE_LIVE_DOMAIN_CERT,
  DESCRIBE_SOURCE_STREAM_INFO,
  DOMAIN_DELTILS,
  MODIFY_LIVE_BAND_LIMIT } from '@/constants'
import Cert from '../model/cert'
import BandLimit from '../model/bandLimit'
import regionalConfigModel from '../model/regionalConfigModel'
import sourceStationSetup from '../model/sourceStationSetup'

export default {
  data () {
    return {
      cert: {},
      domainInfo: {},
      bandLimit: {},
      bandLimitRegional: '',
      resource: {},
      visibleHttps: false,
      visibleBandLimit: false,
      visibleRegional: false,
      visibleSourceStationSetup: false,
      loading1: true,
      loading2: true,
      loading3: true,
      loading4: true
    }
  },
  components: {
    Cert,
    BandLimit,
    regionalConfigModel,
    sourceStationSetup
  },
  filters: {
    unit (value) {
      if (value >= 1000) {
        return `${value / 1000} Gbps`
      } else if (value >= 10000) {
        return `${value / 10000} Tbps`
      }
      return `${value} Mbps`
    },
    playType (val) {
      switch (val) {
        case 1:
          return '中國大陸'
        case 2:
          return '全球加速'
        case 3:
          return '中國港澳台地區及海外地區'
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.getCert()
      this.getRegion()
      this.getBandLimit()
      this.getResource()
    },
    getCert () {
      this.loading1 = true
      this.visibleHttps = false
      this.axios.post(DESCRIBE_LIVE_DOMAIN_CERT, {
        Version: '2018-08-01',
        DomainName: this.$route.query.Name
      })
        .then(({ Response }) => {
          this.cert = Response.DomainCertInfo
        })
        .then(() => {
          this.loading1 = false
        })
    },
    editCert () {
      this.visibleHttps = true
    },
    getRegion () {
      this.visibleRegional = false
      this.axios.post(DOMAIN_DELTILS, {
        Version: '2018-08-01',
        DomainName: this.$route.query.Name
      }).then(({ Response }) => {
        this.domainInfo = Response.DomainInfo
      }).then(() => {
        this.loading3 = false
      })
    },
    editRegion () {
      this.getRegion()
      this.visibleRegional = true
    },
    getBandLimit () {
      this.loading2 = true
      this.visibleBandLimit = false
      this.axios.post(DESCRIBE_LIVE_BAND_LIMIT, {
        Version: '2018-08-01',
        DomainName: this.$route.query.Name
      })
        .then(({ Response }) => {
          this.bandLimit = Response
        })
        .then(() => {
          this.loading2 = false
        })
    },
    editBandLimit () {
      this.visibleBandLimit = true
    },
    getResource () {
      this.visibleSourceStationSetup = false
      this.axios.post(DESCRIBE_SOURCE_STREAM_INFO, {
        Version: '2018-08-01',
        DomainName: this.$route.query.Name
      })
        .then(({ Response }) => {
          this.resource = Response
          if (Response.CdnStreamFormat.length !== 0) {
            this.resource.CdnStreamFormat = Response.CdnStreamFormat.join('|')
          }
        })
        .then(() => {
          this.loading4 = false
        })
    },
    // 这是一个定时器
    timer () {
      return setTimeout(() => {
        this.getResource()
      }, 2000)
    },
    editResource () {
      this.getResource()
      if (this.resource.Status == 2) {
        this.$message({
          message: '请等待上一次的操作关闭完成',
          type: 'error',
          showClose: true,
          duration: 0
        })
      } else if (this.resource.Status == 0) {
        this.$message({
          message: '请等待上一次的操作部署完成',
          type: 'error',
          showClose: true,
          duration: 0
        })
      } else {
        this.visibleSourceStationSetup = true
        if (this.resource.Status === 1) {
          this.resource.Status = true
        } else if (this.resource.Status === 3) {
          this.resource.Status = false
        }
      }
    },
    handleCloseRegion () {
      this.visibleRegional = false
    },
    handleCloseSource () {
      this.visibleSourceStationSetup = false
    }
  },
  watch: {
    resource () {
      if (this.resource.Status == 0 || this.resource.Status == 2) {
        this.timer()
      } else {
        clearTimeout(this.timer)
      }
    }

  },
  destroyed () {
    clearTimeout(this.timer)
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
::v-deep .el-dialog__body {
  padding: 10px 20px;
}
</style>

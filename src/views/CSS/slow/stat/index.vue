<template>
  <div class="domainManagement-wrap">
    <HeadCom title="統計分析"></HeadCom>
     <div class="conTabs">
      <el-tabs v-model="tabType">
        <div class="toolbar">
          <el-button-group style="margin-left: 15px;">
            <el-button size="small" :type="createTimeType === '0d' ? 'primary' : ''" @click="onTimeClick(0, 'd')">今天</el-button>
            <el-button size="small" :type="createTimeType === '1d' ? 'primary' : ''" @click="onTimeClick(1, 'd')">昨天</el-button>
            <el-button size="small" :type="createTimeType === '6d' ? 'primary' : ''" @click="onTimeClick(6, 'd')">近7天</el-button>
            <el-button size="small" :type="createTimeType === '1month' ? 'primary' : ''" @click="onTimeClick(30, 'd')">近30天</el-button>
          </el-button-group>
          <el-date-picker
            size="small"
            :clearable="false"
            style="border-left: none;"
            v-model="timeValue"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
          ></el-date-picker>
          <div class="search">
          <el-dropdown
              :hide-on-click="false"
              trigger="click"
              ref="doaminRef"
              style="margin-left: 30px"
            >
              <el-button type="primary" size="small">
                {{
                  domainCheckedListCopy.length === domainData.length
                    ? "全部域名"
                    : domainCheckedListCopy.join()
                }}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <label class="domain-label">
                    <el-checkbox
                      :value="domainCheckedList.length === domainData.length"
                      @change="checkDomainAll"
                    />全部域名
                  </label>
                </el-dropdown-item>
                <el-dropdown-item v-for="item in domainData" :key="item">
                  <label class="domain-label">
                    <el-checkbox
                      @change="checked => doaminChange(checked, item)"
                      :value="domainCheckedList.indexOf(item)== -1 ? false : true "
                    />
                    {{ item }}
                  </label>
                </el-dropdown-item>
                <el-row class="doamin-btn-container">
                  <el-button size="small" type="primary" @click="comfirmDomain">{{
                    $t("CSS.overview.12")
                  }}</el-button>
                  <el-button size="small" @click="cancelDomain">取消</el-button>
                </el-row>
              </el-dropdown-menu>
            </el-dropdown>
            <el-button size="small" type="primary" style="margin-left: 15px;">
              台灣台北{{tabType === '0' && '以及海外' || ''}}
            </el-button>
            <el-button
              type="primary"
              size="small"
              class="searchbtn"
              @click="query"
              >{{ $t("CSS.cutout.1") }}</el-button
            >
          </div>
        </div>
        <el-tab-pane label="流量頻寬" name="1" lazy>
          <fluxbandlimit ref="fluxbandlimitRef" :timeValue="timeValue" :playDomains="domainCheckedListCopy" />
        </el-tab-pane>
        <el-tab-pane label="錄製路數" name="0" lazy>
          <concurrent-record-stream-num ref="concurrentRecordStreamNumRef" :timeValue="timeValue" :playDomains="domainCheckedListCopy" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import HeadCom from '@/components/public/Head'
import Fluxbandlimit from './fluxbandlimit'
import ConcurrentRecordStreamNum from './concurrentRecordStreamNum'
import XTimeX from '@/components/public/TimeZ'
import moment from 'moment'
import { DOMAIN_LIST } from '@/constants'

export default {
  components: {
    HeadCom,
    Fluxbandlimit,
    ConcurrentRecordStreamNum,
    XTimeX,
  },
  data() {
    return {
      tabType: '1',
      createTimeType: '0d',
      timeValue: [moment().startOf('d'), moment()],
      searchInput: this.$route.query.name || '',
      selectDate: '',
      domainData: [],
      domainCheckedList: [],
      domainCheckedListCopy: [],
      pickerOptions: {
        onPick: ({maxDate, minDate}) => {
          this.selectDate= minDate.getTime();
          if (maxDate) {
            this.selectDate = ''
          }
        }, disabledDate: (date) => {
          if (this.selectDate!== '') {
            const minTime = moment(this.selectDate).subtract(30, 'd')
            const maxTime = moment(this.selectDate).add(29, 'd')
            return moment(date).isBefore(minTime) || moment(date).isAfter(maxTime) || moment(date) < moment().subtract(180, 'd') || date.getTime() > Date.now()
          }
          return date.getTime() > Date.now() || moment(date) < moment().subtract(180, 'd')
        }
      }
    }
  },
  watch: {
    tabType: {
      handler() {
        this.getDomains()
      },
      immediate: true,
    }
  },
  methods: {
    comfirmDomain () {
      if (this.domainCheckedList.length === 0) {
        this.$message({
          type: 'warning',
          message: '請選擇域名',
          duration: 0,
          showClose: true,
        })
      } else {
        this.$refs.doaminRef.visible = false
        this.domainCheckedListCopy = [...this.domainCheckedList]
      }
    },
    cancelDomain () {
      this.domainCheckedList = [...this.domainCheckedListCopy]
      this.$refs.doaminRef.visible = false
    },
    checkDomainAll (checked) {
      if (checked) {
        this.domainCheckedList = [...this.domainData]
      } else {
        this.domainCheckedList = []
      }
    },
    doaminChange (checked, domain) {
      if (checked) {
        this.domainCheckedList.push(domain)
      } else {
        this.domainCheckedList = this.domainCheckedList.filter(
          item => item !== domain
        )
      }
    },
    getDomains() {
      const domainType = Number(this.tabType)
      let params = {
        Version: '2018-08-01',
        IsDelayLive: 1, // 慢直播
        PageSize: 100, // 分页大小，范围：10~100。默认10
        PageNum: 1, // 取第几页，范围：1~100000。默认1
        DomainType: domainType,
      }
      this.axios.post(DOMAIN_LIST, params)
      .then(({ Response: { DomainList } }) => {
          const domains = []
          if (Array.isArray(DomainList)) {
            DomainList.forEach(domain => {
              if (domain.Type === domainType) {
                domains.push(domain.Name)
              }
            })
          }
          this.domainCheckedList = domains
          this.domainData = domains
          this.domainCheckedListCopy = domains
          this.$nextTick(this.query)
        })
    },
    onTimeClick (t, u) {
      this.createTimeType = `${t}${u}`
      let start = moment().subtract(t, u).startOf('d')
      let end = moment().endOf('d')
      if (t === 0) {
        end = moment()
      }
      if (t == 1 && u === 'd') {
        end = end.subtract(1, 'd')
      }
      this.timeValue = [start, end]
    },
    query() {
      if (this.tabType === '1') { // 流量頻寬
        this.$refs.fluxbandlimitRef.getTrend()
      } else { // 錄製路數
        this.$refs.concurrentRecordStreamNumRef.getTrend()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.conTabs {
  margin: 20px 30px;
  padding: 15px;
  background: #fff;
}
.toolbar {
  display: flex;
  .search {
    display: flex;

    ::v-deep .el-input__inner {
      height: 34px !important;
    }

    .searchbtn {
      margin-left: 15px;
    }
  }
}
.domain-label {
  display: block;
  cursor: pointer;
}
.doamin-btn-container {
  margin: 0 20px;
}
::v-deep .el-range-separator {
  line-height: 30px !important;
  height: 30px;
  width: 7%;
}
</style>

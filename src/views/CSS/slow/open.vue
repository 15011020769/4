<template>
  <div class="overview-wrap">
    <HeaderCom title="申请开通慢直播服务" />
    <div class="overview-main">
      <el-row style="text-align: center;">
        <h3 class="lcb-media-text-title">什麼是慢直播?</h3>
        <p>慢直播是台富雲針對大規模音視頻上行的方案，專為音視頻高並發推流的場景而定製，更具價格優勢。價格詳見
          <a href="../../index.html#/documentCenter/productDocument/34175"
            target="_blank">計費說明</a>
          文檔。</p>
        <p>配合台富雲的智能AI和雲點播服務，提供了包括智能標籤、智能識別、音視頻錄製、時移回看等功能。</p>
      </el-row>
      <div class="lcb-media-table">
        <table class="lcb-comparison-table">
          <colgroup>
            <col style="width: 20%;">
            <col style="width: 40%;">
            <col style="width: 40%;">
          </colgroup>
          <thead>
            <tr>
              <th>
                <div class="lcb-comparison-table-inner">
                  <p></p>
                </div>
              </th>
              <th>
                <div class="lcb-comparison-table-inner">
                  <p>慢直播</p>
                </div>
              </th>
              <th>
                <div class="lcb-comparison-table-inner">
                  <p>雲直播</p>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div class="lcb-comparison-table-inner">產品特性</div>
              </td>
              <td>
                <div class="lcb-comparison-table-inner">上行推流數多，下行播放寬頻較小</div>
              </td>
              <td>
                <div class="lcb-comparison-table-inner">下行播放寬頻大，下行播放低延時</div>
              </td>
            </tr>
            <tr>
              <td>
                <div class="lcb-comparison-table-inner">端測能力</div>
              </td>
              <td>
                <div class="lcb-comparison-table-inner">上行推流</div>
              </td>
              <td>
                <div class="lcb-comparison-table-inner">上行推流</div>
              </td>
            </tr>
            <tr>
              <td>
                <div class="lcb-comparison-table-inner">雲測關鍵能力</div>
              </td>
              <td>
                <div class="lcb-comparison-table-inner">雲錄製、 播放時移、視頻分析、事件回調</div>
              </td>
              <td>
                <div class="lcb-comparison-table-inner">CDN雲轉碼雲錄製</div>
              </td>
            </tr>
            <tr>
              <td>
                <div class="lcb-comparison-table-inner">方案優勢</div>
              </td>
              <td>
                <div class="lcb-comparison-table-inner">高並發上行，少量觀看場景下性價比高</div>
              </td>
              <td>
                <div class="lcb-comparison-table-inner">轉碼等各種能力齊全，播放低延時</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="lcb-media-foot">
        <div class="lcb-media-foot-title">
          <h3>慢直播適合以下場景</h3>
        </div>
        <div class="tc-g">
          <div class="tc-g-u-1-3">
            <div class="media"><a class="media-left" href="#"><img class="media-object" src="./images/lcb-media-01.png" alt=""></a>
              <div class="media-body">
                <h4 class="media-heading">安防監控</h4>
                <p>多角度並發監控；</p>
                <p>視頻實時查看；</p>
                <p>陽光廚房、交通監控，校園安防。</p>
              </div>
            </div>
          </div>
          <div class="tc-g-u-1-3">
            <div class="media"><a class="media-left" href="#"><img class="media-object" src="./images/lcb-media-02.png" alt=""></a>
              <div class="media-body">
                <h4 class="media-heading">一部手機游雲南</h4>
                <p>定點攝像多路上行；</p>
                <p>24h隨時查看風景；</p>
                <p>在線遊覽景點，減輕高峰壓力。</p>
              </div>
            </div>
          </div>
          <div class="tc-g-u-1-3">
            <div class="media"><a class="media-left" href="#"><img class="media-object" src="./images/lcb-media-03.png" alt=""></a>
              <div class="media-body">
                <h4 class="media-heading">汽車4S門店</h4>
                <p>門店展區熱度分析；</p>
                <p>客戶線索跟蹤；</p>
                <p>門店客戶識別追蹤。</p>
              </div>
            </div>
          </div>
        </div>
        <div class="lcb-media-ft">
          <div>
            <el-checkbox v-model="checked">
              同意
            </el-checkbox>
            <a href="../../index.html#/footerContent/termService">《{{$t('CSS.builder.26')}}》</a>
          </div>
          <el-button type="primary" @click="open" :disabled="!checked" style="border-radius: 0;width:150px;height:40px">
            立即開通
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import HeaderCom from '@/components/public/Head'

export default {
  name: 'live',
  data() {
    return {
      checked: false
    }
  },
  components: {
    HeaderCom
  },
  methods: {
    open() {
      this.axios.post('live2/OpenDelayLive', { "Version": "2018-08-01" })
        .then(res => {
          if (!res || res.Response.Error) {
            this.$message({
              message: '开通失败',
              type: 'error',
              showClose: true,
              duration: 0
            })
            return
          }
          this.$router.push({
            name: 'slow-domains',
            params: { open: true }
          })
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.overview-main {
  // height: calc(100% - 100px);
  padding-bottom: 20px;
  background: #fff;
  max-width: 1360px;
  margin: 20px auto;
  margin-bottom: 0;
  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-top: 40px;
  .lcb-media-text-title {
    font-size: 24px;
    color: #000;
    font-weight: 500;
    padding-bottom: 30px;
  }
  p {
    font-size: 12px;
    color: #333;
    line-height: 25px;
  }
  .lcb-media-table {
    max-width: 1100px;
    margin: 0 auto;
    padding-top: 30px;
    width: 100%;
  }
  .lcb-comparison-table {
    width: 100%;
    border: 1px solid #e6ebf2;
    color: #333;
    text-align: left;
    font-size: 14px;
    border-collapse: collapse;
  }
  .lcb-comparison-table thead th {
    line-height: 1;
    font-size: 18px;
  }
  .lcb-comparison-table thead .lcb-comparison-table-inner {
    padding: 13px 40px;
    font-size: 14px;
  }
  .lcb-comparison-table tbody tr td:first-child {
    font-weight: 700;
  }
  .lcb-comparison-table tbody .lcb-comparison-table-inner {
    font-weight: 400;
    font-size: 12px;
  }
  .lcb-comparison-table colgroup col:nth-child(2),
  .lcb-comparison-table tr td:nth-child(2),
  .lcb-comparison-table tr th:nth-child(2) {
    border: 1px double #97c7ff;
    background-color: #e5f0ff;
  }
  .lcb-comparison-table .lcb-comparison-table-inner {
    padding: 10px 40px;
    color: inherit;
  }
  .lcb-comparison-table td,
  .lcb-comparison-table th {
    vertical-align: top;
    line-height: 1.7;
    padding: 0;
    border: 1px solid #e4e4e4;
  }
  .lcb-media-foot {
    padding-top: 50px;
    max-width: 1100px;
    margin: 0 auto;
    width: 100%;
    .lcb-media-foot-title {
      text-align: center;
      h3 {
        font-weight: 500;
        font-size: 18px;
        padding-bottom: 40px;
      }
    }
    .tc-g-u-1-3,
    .tc-g-u-8-24 {
      width: 33.3333%;
    }
    .tc-g {
      margin-left: -10px;
      margin-right: -10px;
      font-size: 0;
      [class*="tc-g-u"] {
        display: inline-block;
        vertical-align: top;
        font-size: 14px;
        box-sizing: border-box;
        padding-left: 10px;
        padding-right: 10px;
      }
      .media-left {
        padding-right: 10px;
      }
      .media-body,
      .media-left,
      .media-right {
        display: table-cell;
        vertical-align: top;
        text-align: left;
      }
      .media-object {
        width: 150px;
        height: 100px;
        display: block;
      }
      .media-body {
        width: 10000px;
        overflow: hidden;
        zoom: 1;
        p {
          font-size: 12px;
          line-height: 22px;
        }
      }
      .media-heading {
        margin-top: 0;
        margin-bottom: 5px;
        font-size: 14px;
      }
    }
    .lcb-media-ft {
      margin-top: 50px;
      text-align: center;
      & > div {
        margin-bottom: 20px;
      }
    }
  }
}
.text-top {
  font-size: 30px;
  margin-bottom: 20px;
  font-weight: bolder;
}
.text-content {
  font-size: 16px;
  margin-bottom: 20px;
  font-weight: bolder;
  p: {
    line-height: 30px;
  }
}
.button {
  margin-top: 30px;
  margin-bottom: 50px;
}
.active {
  color: #65a5f9;
}
.message-box {
  width: auto;
}
</style>

<template>
  <div class="overview-wrap">
    <HeaderCom title="概览" />
    <div class="overview-main">
      <div class="explain">
        <p>
          新用户9.9元特惠包（100G流量，1年有效期），限购1次，
          <a href="#">立即购买</a>
        </p>
        <p>
          CDN(直播)日志实时分析解决方案内测开放， 实时分析与检索日志数据，
          <a href="#">立即申请>>>></a>
        </p>
      </div>
      <div class="main-box">
        <h3>今日数据</h3>
        <div class="overview">
          <dl>
            <dt>
              <span>0</span>Mbps
            </dt>
            <dd>
              <p>实时下行带宽</p>
            </dd>
          </dl>
          <dl>
            <dt>
              <span>0</span>MB
            </dt>
            <dd>
              <p>今日下行流量</p>
            </dd>
          </dl>
          <dl>
            <dt>
              <span>0</span>人
            </dt>
            <dd>
              <p>
                直播在线数
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="在线数是直播过程中，平台统计的并发连接数量。"
                  placement="bottom"
                >
                  <span style="cursor: pointer;">
                    <i class="el-icon-info"></i>
                  </span>
                </el-tooltip>
              </p>
            </dd>
          </dl>
          <dl>
            <dt>
              <span>1</span>个
            </dt>
            <dd>
              <p>流量包</p>
              <p style="margin-top:10px;">总流量 20.0 GB</p>
              <p>已使用 0.0 GB</p>
            </dd>
          </dl>
        </div>
      </div>
      <div class="main-box">
        <el-date-picker
          v-model="value2"
          align="right"
          type="date"
          placeholder="选择日期"
          :picker-options="pickerOptions"
        ></el-date-picker>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderCom from "@/components/public/Head";
export default {
  name: "overview",
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          }
        ]
      },
      value2: ""
    };
  },
  components: {
    HeaderCom
  }
};
</script>

<style lang="scss" scoped>
.overview-wrap >>> .el-input__inner{
  height: 30px;
  line-height: 30px;
  padding-top: 0;
  border-radius: 0;
  font-size: 12px;
  position: relative;

  .el-input__icon{
    margin-top: -6px !important;
  }
}
.overview-wrap {
  .overview-main {
    padding: 20px;
    box-sizing: border-box;

    .main-box {
      background-color: #fff;
      box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
      padding: 20px;
      box-sizing: border-box;
      margin-bottom: 20px;

      .overview {
        display: flex;
        dl {
          flex: 1;
          padding-top: 20px;
          padding-bottom: 10px;
          box-sizing: border-box;

          dt {
            font-size: 14px;
            padding-left: 2px;
            span {
              font-size: 36px;
              font-weight: normal;
            }
          }
          dd {
            margin-top: 10px;
            color: #888;
          }
        }
      }
    }

    .explain {
      color: #003b80;
      border: 1px solid #97c7ff;
      background: #e5f0ff;
      padding: 10px 30px 10px 20px;
      margin-bottom: 10px;

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
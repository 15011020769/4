<template>
  <div class="createServe">
    <div class="top">
      <img
        style="width:20px;cursor: pointer;"
        @click="back"
        src="../../../assets/CAM/images/left.png"
        alt
      >
      <span class="top_text">新建自定义角色</span>
    </div>
    <div class="container">
      <div class="contant">
        <div class="step">
          <el-steps :active="active" finish-status="success">
            <el-step title="输入角色载体信息"></el-step>
            <el-step title="配置角色策略"></el-step>
            <el-step title="审阅"></el-step>
          </el-steps>
        </div>
        <div v-if="active == 1" class="contant_flex">
          <div class="flex_left">
            <p style="margin-top:5px;text-overflow:ellipsis;white-space:nowrap">支持角色的服务*</p>
          </div>
          <div class="flex_right">
            <el-checkbox-group
              v-model="checkedCities"
              @change="handleCheckedCitiesChange"
              style="display:flex;flex-flow: row wrap;align-content: flex-start;font-size:12px"
            >
              <el-checkbox
                v-for="city in cities"
                :label="city"
                :key="city"
                style="flex: 0 0 16%;margin-bottom:15px"
              >{{city}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
        <div class="tansfer">
          <el-transfer
            filterable
            :filter-method="filterMethod"
            filter-placeholder="支持搜索策略名称/描述/备注"
            v-model="value"
            :data="data"
          ></el-transfer>
        </div>
        <div style="margin:20px 0px">
          <el-button size="small" v-if="active != 1" @click="reTurn">返回</el-button>
          <el-button type="primary" size="small" @click="next" v-if="active != 3">下一步</el-button>
          <el-button type="primary" size="small" v-if="active == 3">完成</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      active: 1,
      checkedCities: [],
      cities: [
        "宙斯盾安全防护",
        "API网关",
        "弹性伸缩",
        "腾讯区块链开发平台",
        "对象存储批量处理",
        "蓝鲸平台",
        "黑石物理服务器1.0",
        "商业流程服务",
        "容器服务",
        "云数据库 MySQL",
        "内容分发网络",
        "文件存储",
        "云防火墙",
        "数据万象",
        "消息队列 CKafka",
        "负载均衡",
        "云审计",
        "云端开发环境",
        "日志服务",
        "CODING DevOps",
        "对象存储",
        "云服务器",
        "腾讯云开发者平台",
        "数据集成",
        "数据安全治理中心",
        "数据传输服务",
        "弹性MapReduce",
        "人脸识别",
        "身份管理服务",
        "物联网通信",
        "加速物联网套件",
        "开发者实验室",
        "云直播",
        "云数据库 MariaDB",
        "小游戏联机对战引擎",
        "云数据库 MongoDB",
        "视频处理",
        "迁移服务平台",
        "媒体转码服务",
        "网络资产风险监测系统",
        "小程序云主机",
        "云函数",
        "流计算Oceanus",
        "云数据仓库套件-Sparkling",
        "安全运营中心",
        "云开发",
        "数据库中间件",
        "腾讯智能钛",
        "智能钛机器学习加速器",
        "智能钛弹性模型服务",
        "智能钛机器学习平台",
        "智能钛自动机器学习",
        "腾讯微服务平台",
        "客服支持平台",
        "微Mall",
        "腾讯优Mall",
        "织云"
      ]
    };
  },
  methods: {
    back() {},
    next() {
      if (this.checkedCities.length == 0) {
        this.$message("请至少选择一个服务");
        return;
      }
      if (this.active == 3) {
        return;
      }
      this.active = this.active + 1;
    },
    reTurn() {
      if (this.active == 1) {
        return;
      }
      this.active = this.active - 1;
    },
    handleCheckedCitiesChange(val) {
      console.log(val);
    }
  }
};
</script>
<style lang="scss" scoped>
.createServe {
  .top {
    padding: 20px;
    background-color: #fff;
    margin-bottom: 20px;
    .top_text {
      font-size: 16px;
      font-weight: 700;
      vertical-align: bottom;
      margin-left: 20px;
    }
  }
  .container {
    padding-top: 20px;
    .contant {
      max-width: 1360px;
      margin: 0 auto;
      padding: 20px;
      background: #fff;
      .step {
        border-bottom: 1px solid #ddd;
        padding-bottom: 20px;
      }
      .contant_flex {
        display: flex;
        padding-top: 20px;
        border-bottom: 1px solid #ddd;
        padding-bottom: 20px;
        .flex_right {
          padding-left: 20px;
          .el-checkbox {
            margin-left: 0;
          }
        }
      }
    }
  }
}
</style>

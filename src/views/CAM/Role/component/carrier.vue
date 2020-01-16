<template>
  <div class="carrier">
    <Head :title="$t('CAM.Role.gljszt')" :backShow="true" @_back="_back" />
    <div class="main">
      <div class="box contant_flex">
        <div class="flex_left">
          <p
            style="margin-top:5px;text-overflow:ellipsis;white-space:nowrap"
          >{{$t('CAM.Role.support')}}*</p>
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
              style="margin-bottom:15px"
            >{{city}}</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Head from "../../UserListNew/components/Head";
export default {
  name: "carrier",
  data() {
    return {
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
        "雲数据库 MySQL",
        "内容分发网络",
        "文件存储",
        "雲防火墙",
        "数据万象",
        "消息队列 CKafka",
        "负载均衡",
        "雲审计",
        "雲端开发环境",
        "日志服务",
        "CODING DevOps",
        "对象存储",
        "雲服务器",
        "腾讯雲开发者平台",
        "数据集成",
        "数据安全治理中心",
        "数据传输服务",
        "弹性MapReduce",
        "人脸识别",
        "身份管理服务",
        "物联网通信",
        "加速物联网套件",
        "开发者实验室",
        "雲直播",
        "雲数据库 MariaDB",
        "小游戏联机对战引擎",
        "雲数据库 MongoDB",
        "视频处理",
        "迁移服务平台",
        "媒体转码服务",
        "网络资产风险监测系统",
        "小程序雲主机",
        "雲函数",
        "流计算Oceanus",
        "雲数据仓库套件-Sparkling",
        "安全运营中心",
        "雲开发",
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
        "织雲"
      ],
      checkedCities: []
    };
  },
  methods: {
    handleCheckedCitiesChange(val) {
      console.log(val);
    },
    //返回上一级
    _back() {
      this.$router.go(-1);
    }
  },
  components: {
    Head
  },
  created() {
    console.log(this.$route.query.id);
  }
};
</script>

<style scoped lang='scss'>
.carrier >>> .el-checkbox {
  width: 20% !important;
}
.carrier {
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
  .main {
    padding: 20px;
    box-sizing: border-box;
    .box {
      background: white;
      padding: 20px;
      box-sizing: border-box;
    }
  }
}
</style>
<template>
  <div class="createServe">
    <HeadCom :title="$t('CAM.Role.createServe')" :backShow="true" @_back="_back" />

    <div class="container">
      <div class="contant">
        <div class="step">
          <el-steps
            :active="active"
            direction="vertical"
            simple
            :space="200"
            finish-status="success"
          >
            <el-step :title="$t('CAM.Role.Enter')"></el-step>
            <el-step :title="$t('CAM.Role.Configuring')"></el-step>
            <el-step :title="$t('CAM.Role.reviewCheck')"></el-step>
          </el-steps>
        </div>
        <div v-if="active == 1" class="contant_flex">
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
                style="flex: 0 0 16%;margin-bottom:15px"
              >{{city}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
        <div class="tansfer" v-if="active == 2">
          <transfer ref="tansferStep"></transfer>
        </div>
        <div class="shenyue" v-if="active == 3">
          <div class="content_flex">
            <div class="content_left">
              <p class="juese">{{$t('CAM.Role.roleName')}}*</p>
              <p class="juese" style="margin-top:55px">{{$t('CAM.Role.roleDesc')}}</p>
              <p class="juese">{{$t('CAM.Role.roleCarrier')}}</p>
            </div>
            <div class="content_right">
              <div class="jscontent" style="height:50px">
                <el-input
                  v-model="inputRoleName"
                  :placeholder="$t('CAM.Role.inputRoleName')"
                  size="mini"
                  @blur="jsname"
                ></el-input>
                <p
                  v-if="have"
                  style="font-size:12px;color:#E1504A;padding-top:10px"
                >{{$t('CAM.Role.empty')}}</p>
              </div>
              <p class="jscontent">
                <el-input v-model="inputRoleDesc" placeholder size="mini"></el-input>
              </p>
              <p class="jscontent text">服务 -mps.cloud.tencent.com</p>
            </div>
          </div>
          <div class="content_table">
            <el-table
              :data="policiesSelectedData"
              :height="tableHeight"
              border
              style="width: 100%"
              :row-style="{height:0}"
              :cell-style="{padding:'5px 10px'}"
              :header-cell-style="{height:'20px',padding:'0px 10px'}"
            >
              <el-table-column prop="PolicyName" :label="$t('CAM.Role.strategyName')"></el-table-column>
              <el-table-column prop="Description" :label="$t('CAM.Role.desc')"></el-table-column>
              <el-table-column prop="Type" :label="$t('CAM.Role.strategyType')">
                <template slot-scope="scope">
                  <p v-show="scope.row.Type == 1">{{$t('CAM.Role.customPolicy')}}</p>
                  <p v-show="scope.row.Type == 2">{{$t('CAM.Role.defaultPolicy')}}</p>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div style="margin:20px 0px">
          <el-button size="small" v-if="active != 1" @click="reTurn">返回</el-button>
          <el-button type="primary" size="small" @click="next" v-if="active != 3">下一步</el-button>
          <el-button type="primary" size="small" v-if="active == 3" @click="complete">完成</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import HeadCom from "../UserListNew/components/Head";
import transfer from "./component/transfer1";
import { CREATE_ROLE, ATTACH_ROLE } from "@/constants";
export default {
  components: {
    transfer,
    HeadCom
  },
  data() {
    return {
      tableHeight: 300,
      active: 1,
      inputRoleDesc: "",
      inputRoleName: "",
      have: false,
      policiesSelectedData: [],
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
      transfer_value: [],
      transfer_data: [
        {
          value: 1,
          desc: "备选项1"
        },
        {
          value: 2,
          desc: "备选项2"
        },
        {
          value: 3,
          desc: "备选项3"
        }
      ],
      tableData: [
        {
          date: "QCloudFinanceFullAccess",
          name: "该策略允许您管理账户内财务相关的内容，例如：付款、开票。",
          address: "预设策略"
        }
      ]
    };
  },
  methods: {
    //返回上一级
    _back() {
      this.$router.go(-1);
    },
    back() {
      this.$router.push("/Role");
    },
    next() {
      if (this.active === 1) {
        if (this.checkedCities.length === 0) {
          this.$message("请至少选择一个服务");
          return;
        }
        if (this.active === 3) {
          return;
        }
        this.active = this.active + 1;
      } else if (this.active === 2) {
        if (this.active === 3) {
          return;
        }
        this.policiesSelectedData = this.$refs.tansferStep.getData();
        console.log(this.policiesSelectedData);
        this.active = this.active + 1;
      }
    },
    reTurn() {
      if (this.active === 1) {
        return;
      }
      this.active = this.active - 1;
    },
    handleCheckedCitiesChange(val) {
      console.log(val);
    },
    leftCheck(val) {},
    jsname() {
      if (!this.inputRoleName) {
        this.have = true;
      } else {
        this.have = false;
      }
    },
    //新建自定义角色创建
    complete() {
      let _this = this;
      if (!this.inputRoleName) {
        this.have = true;
        return;
      }
      /**
       * PolicyDocument参数示例：principal用于指定角色的授权对象。获取该参数可参阅 获取角色详情 输出参数RoleInfo
        {
          "version": "2.0",
          "statement": [{
            "action": "name/sts:AssumeRole",
            "effect": "allow",
            "principal": {
              "service": ["cloudaudit.cloud.tencent.com", "cls.cloud.tencent.com"]
            }
          }]
        }
       */
      let params = {
        Version: "2019-01-16",
        RoleName: this.inputRoleName,
        Description: this.inputRoleDesc,
        PolicyDocument:
          '{"version":"2.0","statement":[{"action":"name/sts:AssumeRole","effect":"allow","principal":{"service":["cloudaudit.cloud.tencent.com","cls.cloud.tencent.com"]}}]}'
      };
      this.axios.post(CREATE_ROLE, params).then(data => {
        let roleId = data.Response.RoleId; // 获取创建的角色id
        if (data.Response.Error) {
          if (data.Response.Error.Code == "InvalidParameter.RoleNameError") {
            this.$message.error("角色名不合法,创建失败");
          }
        } else {
          this.$message("创建角色成功");
        }
        let policiesArray = this.policiesSelectedData; // 获取权限策略
        // 根据获取的角色ID创建角色策略
        if (roleId != undefined && roleId != "" && policiesArray != "") {
          for (let i = 0; i < policiesArray.length; i++) {
            let obj = policiesArray[i];
            let params = {
              Action: "AttachRolePolicy",
              Version: "2019-01-16",
              PolicyId: obj.PolicyId,
              AttachRoleId: roleId
            };
            _this.AttachRolePolicy(params);
          }
        }
        this.back();
      });
    },
    // 绑定权限策略到角色
    AttachRolePolicy(params) {
      this.$axios.post(ATTACH_ROLE, params).then(res => {
        console.log(res);
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.createServe {
  .top {
    padding: 0 20px;
    background-color: #fff;
    margin-bottom: 20px;
    color: #000;
    height: 45px;
    line-height: 45px;
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
      max-width: 96%;
      margin: 0 auto;
      padding: 20px;
      background: #fff;
      .el-steps--simple {
        background-color: #fff;
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
  .shenyue {
    .content_flex {
      display: flex;
      padding: 20px 0 0 5px;
      .content_left {
        color: #888;
        padding-right: 20px;
        .juese {
          margin-bottom: 40px;
          margin-top: 10px;
        }
      }
      .content_right {
        .jscontent {
          margin-bottom: 20px;
        }
        .text {
          margin-top: 35px;
        }
      }
    }
  }
  .step {
    margin-bottom: 20px;
  }
}
</style>
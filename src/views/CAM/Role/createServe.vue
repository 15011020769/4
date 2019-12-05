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
          <el-steps :active="active" direction="vertical" simple :space="200" finish-status="success">
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
        <div class="tansfer" v-if="active == 2">
          <transfer ref="tansferStep"></transfer>
        </div>
        <div class="shenyue" v-if="active == 3">
          <div class="content_flex">
            <div class="content_left">
              <p class="juese">角色名称*</p>
              <p class="juese" style="margin-top:55px">角色描述</p>
              <p class="juese">角色载体</p>
            </div>
            <div class="content_right">
              <div class="jscontent" style="height:50px">
                <el-input v-model="inputRoleName" placeholder="请输入角色名称" size="mini" @blur="jsname"></el-input>
                <p v-if="have" style="font-size:12px;color:#E1504A;padding-top:10px">角色名称不能为空</p>
              </div>
              <p class="jscontent">
                <el-input v-model="inputRoleDesc" placeholder size="mini"></el-input>
              </p>
              <p class="jscontent text">服务-mps.cloud.tencent.com</p>
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
              <el-table-column prop="PolicyName" label="策略名称"></el-table-column>
              <el-table-column prop="Description" label="描述"></el-table-column>
              <el-table-column prop="Type" label="策略类型">
                <template slot-scope="scope">
                      <p v-show="scope.row.Type == 1">自定义策略</p >
                      <p v-show="scope.row.Type == 2">预设策略</p >
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
import transfer from './component/transfer'
export default {
  components: {
    transfer
  },
  data () {
    return {
      tableHeight:300,
      active: 1,
      inputRoleDesc: '',
      inputRoleName: '',
      have: false,
      policiesSelectedData: [],
      checkedCities: [],
      cities: [
        '宙斯盾安全防护',
        'API网关',
        '弹性伸缩',
        '腾讯区块链开发平台',
        '对象存储批量处理',
        '蓝鲸平台',
        '黑石物理服务器1.0',
        '商业流程服务',
        '容器服务',
        '云数据库 MySQL',
        '内容分发网络',
        '文件存储',
        '云防火墙',
        '数据万象',
        '消息队列 CKafka',
        '负载均衡',
        '云审计',
        '云端开发环境',
        '日志服务',
        'CODING DevOps',
        '对象存储',
        '云服务器',
        '腾讯云开发者平台',
        '数据集成',
        '数据安全治理中心',
        '数据传输服务',
        '弹性MapReduce',
        '人脸识别',
        '身份管理服务',
        '物联网通信',
        '加速物联网套件',
        '开发者实验室',
        '云直播',
        '云数据库 MariaDB',
        '小游戏联机对战引擎',
        '云数据库 MongoDB',
        '视频处理',
        '迁移服务平台',
        '媒体转码服务',
        '网络资产风险监测系统',
        '小程序云主机',
        '云函数',
        '流计算Oceanus',
        '云数据仓库套件-Sparkling',
        '安全运营中心',
        '云开发',
        '数据库中间件',
        '腾讯智能钛',
        '智能钛机器学习加速器',
        '智能钛弹性模型服务',
        '智能钛机器学习平台',
        '智能钛自动机器学习',
        '腾讯微服务平台',
        '客服支持平台',
        '微Mall',
        '腾讯优Mall',
        '织云'
      ],
      transfer_value: [],
      transfer_data: [
        {
          value: 1,
          desc: '备选项1'
        },
        {
          value: 2,
          desc: '备选项2'
        },
        {
          value: 3,
          desc: '备选项3'
        }
      ],
      tableData: [
        {
          date: 'QCloudFinanceFullAccess',
          name: '该策略允许您管理账户内财务相关的内容，例如：付款、开票。',
          address: '预设策略'
        }
      ]
    }
  },
  mounted() {
    console.log(window.innerHeight)
        console.log(this.$refs.topictable.$el)
        console.log(this.$refs.topictable.$el.offsetTop)
        this.tableHeight =
          window.innerHeight - this.$refs.topictable.$el.offsetTop - 50;
        console.log(this.tableHeight)
  },
  methods: {
    back () {
      this.$router.push('/Role')
    },
    next () {
      if (this.active === 1) {
        if (this.checkedCities.length === 0) {
          this.$message('请至少选择一个服务')
          return
        }
        if (this.active === 3) {
          return
        }
        this.active = this.active + 1
      } else if (this.active === 2) {
        if (this.active === 3) {
          return
        }
        this.policiesSelectedData = this.$refs.tansferStep.getData()
        console.log(this.policiesSelectedData)
        this.active = this.active + 1
      }
    },
    reTurn () {
      if (this.active === 1) {
        return
      }
      this.active = this.active - 1
    },
    handleCheckedCitiesChange (val) {
      console.log(val)
    },
    leftCheck (val) {},
    jsname () {
      if (!this.inputRoleName) {
        this.have = true
      } else {
        this.have = false
      }
    },
    //新建自定义角色创建
    complete() {
      let _this = this
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
        Action: "CreateRole",
        Version: "2019-01-16",
        RoleName: this.inputRoleName,
        Description: this.inputRoleDesc,
        PolicyDocument: '{"version":"2.0","statement":[{"action":"name/sts:AssumeRole","effect":"allow","principal":{"service":["cloudaudit.cloud.tencent.com","cls.cloud.tencent.com"]}}]}'
      };
      let url = "cam2/CreateRole";
      this.axios.post(url, params).then(data => {
        let roleId = data.Response.RoleId; // 获取创建的角色id
        this.$message("创建角色成功");
        let policiesArray = this.policiesSelectedData // 获取权限策略
        // 根据获取的角色ID创建角色策略
        if(roleId != undefined && roleId != '' && policiesArray != '') {
          for(let i=0; i < policiesArray.length; i++) {
            let obj = policiesArray[i]
            let params = {
              Action: 'AttachRolePolicy',
              Version: '2019-01-16',
              PolicyId: obj.PolicyId,
              AttachRoleId: roleId
            }
            _this.AttachRolePolicy(params)
          }
        }
        this.back()
      });
    },
    // 绑定权限策略到角色
    AttachRolePolicy(params) {
      this.$axios.post('cam2/AttachRolePolicy', params).then(res  => {
        console.log(res)
      })
    }
    
  }
}
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
      .el-steps--simple{
        background-color:#fff;   
      }
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
}
</style>
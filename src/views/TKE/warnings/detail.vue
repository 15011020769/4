<template>
  <div>
    <div class="datails-nav">
      <ul>
        <router-link to="/warnings">
          <li>
            <i class="el-icon-back"></i>
            <span>告警策略详情</span>
          </li>
        </router-link>
      </ul>
    </div>
    <div style="padding:20px">
      <el-card class="box-card">
        <h3 style="margin-bottom:20px;">基本信息</h3>
        <router-link :to="{name: 'warningUpdate'}">
            <el-button size='mini' type="text" class="detail">编辑</el-button>
        </router-link>
        <el-form label-width="150px" class='tke-form' label-position="left">
          <el-form-item label="告警策略名称">
            <div>1</div>
          </el-form-item>
          <el-form-item label="备注">
            <div>2</div>
          </el-form-item>
          <el-form-item label="策略类型">
            <div><a>https://hub.docker.com/_/3</a></div>
          </el-form-item>
          <el-form-item label="策略对象">
            <div>docker pull 4:latest</div>
          </el-form-item>
          <el-form-item label="触发条件">
            <div>5</div>
          </el-form-item>
          <el-form-item label="接收组">
            <div>6</div>
          </el-form-item>
          <el-form-item label="接收渠道">
            <div>7</div>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>
<script>
import {
  TKE_WARNING_GETCOLONY,
} from "@/constants";
  export default {
    name: 'warningDetail',
    data() {
      return {
        tableData:[]
      }
    },
    created(){
        this.getWarningListItem()
        console.log(this.$route.query.clusterId)
    },
    methods: {
      // 告警配置列表
      getWarningListItem() {
        const param = {
          ClusterInstanceId: this.$route.query.clusterId,
          Version: "2018-05-25"
        }
        this.axios.post(TKE_WARNING_GETCOLONY, param).then(res => {
          if (res.Error == undefined) {
            console.log(res)
            this.tableData = res.Response.AlarmPolicySet
            // this.TotalCount = res.Response.TotalCount
            // this.delete = []
            // this.loadShow = false
          } else {
            this.$message({
              message: ErrorTips[res.Response.Error.code],
              type: "error",
              showClose: true,
              duration: 0
            })
          }
        })
      },
    }
  }
</script>
<style lang="scss" scoped>
  .datails-nav {
    height: 40px;
    background: #fff;

    span {
      color: #000;
      font-size: 14px;
      padding: 0 20px;
      box-sizing: border-box;
    }

    ul {
      display: flex;
      height: 40px;
      line-height: 40px;
      margin-left: 20px;

      li {
        display: flex;
        align-items: center;
        justify-content: center;

        i {
          font-size: 16px;
          font-weight: bold;
        }

        span {
          font-size: 16px;
          font-weight: 700;
        }
      }

      li:nth-child(1) {
        color: blue;
      }
    }
  }

  .box-card {
    width: 100%;
    position:relative;
  }
  .detail{
    position:absolute;
    top:10px;
    right:20px;
 }
</style>

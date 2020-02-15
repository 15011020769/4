<template>
  <div class="container">
    <span class="tip">防护域名必须和负载均衡监听器进行绑定，才能对监听器中添加域名的HTTP或HTTPS流量进行防护。前往负载均衡</span>
    <el-row type="flex" class="col">
      <el-col :span="3">
        <label class="label">地域</label>
      </el-col>
      <el-col>
        <el-button type="primary" size="small">台北</el-button>
      </el-col>
    </el-row>
    <el-row type="flex" class="col">
      <el-col :span="3">
        <label class="label">负载均衡 - 监听器</label>
      </el-col>
      <el-col>
        <el-input class="lb-input" placeholder="请选择负载均衡实例" />
          <ul class="lb-container">
            <li v-for="item in clbs" :key="item.LoadBalancerId">
              <p>
                <span>{{item.LoadBalancerName}}（{{item.LoadBalancerId}}）</span>
                <el-button type="text" @click="openListenDialog(item.LoadBalancerId)">选择监听器</el-button>
              </p>
              <p class="selcted">已选择0个</p>
            </li>
          </ul>
      </el-col>
    </el-row>
    <el-dialog
      title="选择监听器"
      :visible.sync="dialogVisible"
      width="840px"
    >
      <el-row type="flex" :gutter="10" class="dialog-container">
        <el-col>
          <el-input class="listener-input" placeholder="请输入关键字" />
          <ul class="listener-container">
            <li v-for="item in listeners" :key="item.ListenerId">
              <label>
                <div class="listen">
                  <el-checkbox />
                  <div>
                    <p>{{item.ListenerName}}</p>
                    <p>http:aa.aa</p>
                  </div>
                </div> 
              </label>
            </li>
          </ul>
        </el-col>
        <div class="direction">
          <div class="direction-icon">
            <i class="iconfont">&#xe603;</i>
          </div>
        </div>
        <el-col>
          <ul class="listener-container selected-listener-container">
            <li v-for="item in listeners" :key="item.ListenerId">
              <div class="listen">
                <div>
                  <p>{{item.ListenerName}}</p>
                  <p>http:aa.aa</p>
                </div>
                <i class="el-icon-close del-listener"></i>
              </div> 
            </li>
          </ul>
        </el-col>
      </el-row>
        <el-button slot="footer" type="primary" @click="dialogVisible = false">确 定</el-button>
    </el-dialog>
  </div>
</template>
<script>
import { CLB_LIST, DESCRIBE_LISTENERS } from '@/constants'
import { ErrorTips } from '@/components/ErrorTips'

export default {
  data() {
    return {
      clbs: [],
      listeners: [],
      dialogVisible: false,
    }
  },
  mounted() {
    this.axios.post(CLB_LIST, {
      Version: '2018-03-17',
      Region: 'ap-guangzhou',
      Forward: 1,
      LoadBalancerType: 'OPEN',
      Offset: 0,
      Limit: 100
    }).then(({ Response }) => {
      if (Response.Error) {
        this.$message({
          message: ErrorTips[Response.Error.Code],
          type: "error",
          showClose: true,
          duration: 0
        });
      } else {
        this.clbs = Response.LoadBalancerSet
      }
    })
  },
  methods: {
    openListenDialog(lbId) {
      this.queryListener(lbId)
      this.dialogVisible = true
    },
    queryListener(lbId) {
      this.axios.post(DESCRIBE_LISTENERS, {
        LoadBalancerId: lbId,
        Version: '2018-03-17',
        Region: 'ap-guangzhou',
      }).then(({ Response }) => {
        if (Response.Error) {
          this.$message({
            message: ErrorTips[Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 0
          });
        } else {
          this.listeners = Response.Listeners
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.container {
  margin-left: 20px;
  margin-top: 20px;
}
.tip {
  background-color: #fff4e3;
  color: #c07400;
  border-color: #ffd18b;
  font-size: 12px;
  font-weight: normal;
  padding: 10px 20px;
  border: 1px solid #97c7ff;
  height: 38px;
  line-height: 38px;
  margin-top: 20px;
  // display: inline-block;
}
.col {
  margin-top: 20px;
}
.label {
  color: #888;
}
.lb-input, .listener-input, .lb-container, .listener-container {
  width: 382px;
}
.lb-container, .listener-container {
  border: 1px solid #dcdfe6;
  border-top: none;
  li {
    padding: 0 10px;
    border-bottom: 1px solid #dcdfe6;
    // &:last-of-type {
    //   border-bottom: none;
    // }
    p {
      height: 28px;
      line-height: 28px;
      &:first-of-type {
        display: flex;
        align-items: center;
        justify-content: space-between;
        button {
          font-size: 12px;
        }
      }
    }
  }
}
.selected {
  color: #bbb;
}
.listener-container {
  height: 340px;
  .listen {
    display: flex;
    align-items: center;
    padding: 5px 0;
    cursor: pointer;
    label {
      margin-right: 10px;
    }
    p {
      height: auto;
      line-height: 20px;
    }
  }
}
.selected-listener-container {
  height: 380px;
  border-top: 1px solid #dcdfe6;
  .listen {
    justify-content: space-between;
    cursor: default;
  }
}
.direction {
  transform: translateY(50%);
}
.del-listener {
  cursor: pointer;
}
</style>
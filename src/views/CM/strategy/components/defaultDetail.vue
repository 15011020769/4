<template>
  <span class="defaultDetail">
    <Header title="管理告警策略" :backShow="backShow" />
    <el-card class="box-card">
      <div slot="header" class="clearfix" style="width:100%">
        <h3>基本信息</h3>
      </div>
      <ul>
        <li style="display:flex;line-height:40px;" v-for="(item,index) in listInfo" :key="index">
          <span class="textColor">{{item.name}}</span>
          <p style="margin:0 30px;color:#000">
            <span>{{item.content}}</span>
            <i
              v-if="item.isEdit"
              style="color:#888;cursor: pointer;"
              class="el-icon-edit"
              @click="editInfo(item)"
            ></i>
          </p>
          <el-dialog :title="'修改告警'+item.name" :visible.sync="dialogFormVisible">
            <el-form :model="form">
              <el-input v-model="form.name" autocomplete="off" :placeholder="item.content"></el-input>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click="dialogFormVisible = false">保 存</el-button>
              <el-button @click="dialogFormVisible = false">取 消</el-button>
            </div>
          </el-dialog>
        </li>
      </ul>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix" style="width:100%;display:flex;">
        <h3>告警触发条件</h3>
        <a @click="editGaoJing">编辑</a>
      </div>
      <div class="box-content">
        <span class="textColor">指标告警（任意）</span>
        <p>CPU利用率 > 0%,持续1分钟，按一天重复警告</p>
        <span class="textColor">事件告警</span>
        <p>磁盘只读，不重复警告</p>
        <el-dialog title="修改告警触发条件" :visible.sync="dialogEditGaojing">
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dialogEditGaojing = false">保 存</el-button>
            <el-button @click="dialogEditGaojing = false">取 消</el-button>
          </div>
        </el-dialog>
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix" style="width:100%;display:flex;">
        <h3>告警对象</h3>
        <a @click="editObject">编辑</a>
      </div>
      <p class="tip">无告警策略绑定实例的地域不显示</p>
      <div class="box-content">
        <el-row style="margin:10px 5px;padding-top:10px">
          <el-button type="primary">编辑</el-button>
          <el-button disabled>解绑</el-button>
          <el-button>全部解绑</el-button>
        </el-row>
        <el-row style="margin:10px 5px;padding-bottom:10px">
          <el-button>北京(1)</el-button>
        </el-row>

        <el-dialog title="修改告警对象" :visible.sync="dialogEditObject">
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dialogEditObject = false">保 存</el-button>
            <el-button @click="dialogEditObject = false">取 消</el-button>
          </div>
        </el-dialog>
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix" style="width:100%;display:flex;">
        <h3>告警接收对象</h3>
      </div>
      <div class="box-content">
        <el-row>
          <el-button type="primary">编辑</el-button>
          <el-button disabled>解绑</el-button>
        </el-row>
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix" style="width:100%;display:flex;">
        <h3>回调接口</h3>
      </div>
      <p class="tip">填写公网可访问到的url作为回调接口地址(域名或IP[:端口][/path])，云监控将及时把告警信息推送到该地址。</p>
      <div class="box-content" style="line-height: 30px;margin:20px 0;">
        未配置
        <el-tooltip content="Top center" placement="Top" effect="light">
            <i style="color:#888;cursor: pointer;" class="el-icon-edit" @click="callbackEdit"></i>
        </el-tooltip>
      </div>
    </el-card>
  </span>
</template>

<script>
import Header from "./Head";

export default {
  data() {
    return {
      backShow: true,
      listInfo: [
        {
          name: "策略名称",
          isEdit: true,
          content: "测试"
        },
        {
          name: "策略类型",
          isEdit: false,
          content: "云服务器-基础监控"
        },
        {
          name: "所属项目",
          isEdit: false,
          content: "默认项目"
        },
        {
          name: "最后修改人",
          isEdit: false,
          content: "100011921910"
        },
        {
          name: "最后修改时间",
          isEdit: false,
          content: "2020/01/10 10:03:50"
        },
        {
          name: "备注",
          isEdit: true,
          content: "这是测试，可以删除"
        }
      ],
      editBeizhuFlag: false,
      dialogFormVisible: false, //基本信息组件弹框
      dialogEditGaojing: false, //编辑告警弹框组件
      dialogEditObject: false, //编辑告警弹框组件
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      formLabelWidth: "120px"
    };
  },
  components: { Header },
  methods: {
    callbackEdit(){
      //回调接口配置
      alert()
    },
    editObject() {
      //编辑告警对象
      this.dialogEditObject = true;
    },
    editGaoJing() {
      //编辑告警触发条件
      this.dialogEditGaojing = true;
    },
    editInfo(content) {
      //编辑备注
      if (content.name == "策略名称") {
        alert(content.content);
        // this.dialogFormVisible = true;
      } else {
        alert(content.content);
        // this.dialogFormVisible = true;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.defaultDetail >>> .el-button,
.defaultDetail >>> .el-input__inner {
  height: 30px;
  border-radius: 0;
  padding-top: 0;
  line-height: 30px;
  font-size: 12px;
}
.defaultDetail >>> .box-card {
  width: 98%;
  border-radius: 0;
  padding-top: 0;
  // line-height: 30px;
  font-size: 12px;
  margin: 20px 1%;
}
.defaultDetail {
  width: 100%;
  height: 100%;
  background: rgb(235, 235, 235);
}
.box-content {
  line-height: 30px;
}
span.textColor {
  color: #888;
  width: 100px;
}
a {
  margin: 0 5px;
}
a:hover {
  color: #006eff;
  cursor: pointer;
  border-bottom: 1px solid #006eff;
}
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  p.tip {
    padding: 15px 20px;
    color: #003b80;
    border: 1px solid #97c7ff;
    background: #e5f0ff;
  }
}
</style>
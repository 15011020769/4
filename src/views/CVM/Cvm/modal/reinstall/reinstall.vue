<template>
  <div class="resetpassword">
    <el-dialog :visible.sync="reinstallStatus.reinstallDialog" :show-close="false" width="45%">
      <div slot="title" class="title-wrap">
        <span>重装系统</span>
        <i class="el-icon-close" @click="handleCancel(false)"></i>
      </div>
      <div class="content">
        <span>
          您已选
          <span>1</span>台 实例，
        </span>
        <span class="packdown">查看详情</span>
        <el-button type="text" class="basicInfo-pack" @click="handlePack">
          <i :class="[basic?'el-icon-arrow-up':'el-icon-arrow-down']"></i>
        </el-button>
        <div :class="[basic?'table':'']">
          <el-table
            ref="instanceTable"
            :data="instanceInfo"
            :header-cell-style="{'font-size':'12px'}"
            :row-style="tableRowStyle"
            v-if="basic"
            max-height="200px"
          >
            <el-table-column type="index" width="55" label="No."></el-table-column>
            <el-table-column label="实例名">
              <template slot-scope="scope">
                <div>
                  <span>{{scope.row.InstanceId}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="实例ID">
              <template slot-scope="scope">
                <div>
                  <a href @click="handleInstanceId">{{scope.row.InstanceId}}</a>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="当前带宽上限">
              <template slot-scope="scope">
                <div>
                  <span>{{scope.row.InstanceId}}</span>
                  Mbps
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div style="margin-top: 10px;">
          <div class="renewdetail">
            <div>注意：重装后，实例系统盘内的所有数据将被清除，恢复到初始状态。</div>
            <div>
              1.请在操作前通过制作快照或镜像做好相关备份，以免数据丢失给您造成损失，具体请参看
              <!-- <span class="operate">操作指引</span> -->
              <a href>操作指引</a>
            </div>
            <div>
              2.实例数据盘的数据不会清除，但重装后需要手动挂载才能使用，具体请参看
              <!-- <span class="operate">操作指引</span> -->
              <a href>操作指引</a>
            </div>
          </div>
          <div class="formMirror">
            <el-form
              ref="projectform"
              :model="projectform"
              :rules="rules"
              label-width="80px"
              :label-position="labelPosition"
              :hide-required-asterisk="hideasterisk"
            >
              <el-form-item label="镜像来源" prop="describe" class="button">
                <el-button size="mini" @click="status=1">当前镜像</el-button>
                <el-button size="mini" @click="status=2">公共镜像</el-button>
                <el-button size="mini" @click="status=3">自定义镜像</el-button>
              </el-form-item>
              <div>
                <el-form-item label="镜像" prop="password" v-show="status==1">
                  <div>CentOS 7.6 64位</div>
                  <div>
                    <el-checkbox v-model="projectform.checked1">免费开通DDos防护和云镜实例防护</el-checkbox>
                    <a href>安全加固介绍</a>
                  </div>
                  <div>
                    <el-checkbox v-model="projectform.checked2">免费开通云产品监控、分析和实时告警</el-checkbox>
                    <a href>云监控介绍</a>
                  </div>
                </el-form-item>
                <el-form-item label="操作系统" prop="password" class="button" v-show="status==2">
                  <el-button size="mini">CentOS</el-button>
                  <el-button size="mini">CoreOS</el-button>
                  <el-button size="mini">Debian</el-button>
                  <el-button size="mini">FreeBSD</el-button>
                  <el-button size="mini">openSUSE</el-button>
                  <el-button size="mini">Ubuntu</el-button>
                  <el-button size="mini">Windows</el-button>
                </el-form-item>
                <el-form-item label="系统版本" prop="password" class="button" v-show="status==2">
                  <el-select v-model="planTenderMethod" placeholder="请选择" size="mini">
                    <el-option
                      v-for="item in sshkeyList"
                      :key="item.key"
                      :label="item.val"
                      :value="item.key"
                    ></el-option>
                  </el-select>
                  <div>
                    <el-checkbox v-model="projectform.checked1">免费开通DDos防护和云镜实例防护</el-checkbox>
                    <a href>安全加固介绍</a>
                  </div>
                  <div>
                    <el-checkbox v-model="projectform.checked2">免费开通云产品监控、分析和实时告警</el-checkbox>
                    <a href>云监控介绍</a>
                  </div>
                </el-form-item>
                <el-form-item label="镜像" prop="password" class="button" v-show="status==3">
                  <el-select v-model="planTenderMethod" placeholder="请选择" size="mini">
                    <el-option
                      v-for="item in sshkeyList"
                      :key="item.key"
                      :label="item.val"
                      :value="item.key"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="系统盘" prop="passwordconfirm">
                  <div>
                    <el-slider
                      :max="500"
                      @change="slider"
                      :min="50"
                      :step="1"
                      v-model="slidervalue"
                      show-input
                    ></el-slider>
                  </div>
                  <a>系统盘扩容介绍</a>
                </el-form-item>
                <el-form-item label="登录设置" prop="passwordconfirm" class="button">
                  <el-button size="mini" @click="keyStatus=1">密码</el-button>
                  <el-button size="mini" @click="keyStatus=2">SSH密钥</el-button>
                  <el-button size="mini" @click="keyStatus=3" v-show="status==3">保留镜像设置</el-button>
                </el-form-item>
                <el-form-item label="用户名" v-show="keyStatus==1">
                  <span>root</span>
                </el-form-item>
                <el-form-item label="密码" prop="passwordconfirm" v-show="keyStatus==1">
                  <el-input v-model="password" size="mini" style="width: 150px;"></el-input>
                </el-form-item>
                <el-form-item label="SSH密钥" prop="passwordconfirm" v-show="keyStatus==2">
                  <el-select v-model="planTenderMethod" placeholder="请选择" size="mini">
                    <el-option
                      v-for="item in sshkeyList"
                      :key="item.key"
                      :label="item.val"
                      :value="item.key"
                    ></el-option>
                  </el-select>
                  <span style="margin-left:10px;">密钥使用说明</span>
                  <div>
                    如您现有的密钥不合适，可以
                    <a href>现在创建</a>
                  </div>
                </el-form-item>
                <el-form-item label="" v-show="keyStatus==3">
                  <span>重装后，您可使用自定义镜像内登录信息(密钥/密码)登录</span>
                </el-form-item>
                <el-form-item label="应付费用">
                  <span style="font-size: 18px;color:red;">59.84元</span>
                  <span style="margin-left: 10px;">调整后的系统盘将随实例一起到期，您须补齐相应的差价</span>
                </el-form-item>
              </div>
            </el-form>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" size="mini" @click="handleCancel(true)">开始重装</el-button>
          <el-button size="mini" @click="handleCancel(false)">取消</el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      basic: true,
      labelPosition: "left",
      hideasterisk: true,
      slidervalue: 50,
      status: 1, //默认显示当前镜像
      keyStatus: 1, //1.密码  2.SSH密钥
      instanceInfo: [], //实例列表
      //用户信息
      projectform: {
        checked1: false,
        checked2: false
      },
      rules: {
        describe: [
          {
            required: true,
            message: "仅可对系统中已存在的用户进行重置密码操作",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message:
              "Linux 机器密码需8到30位，至少包括三项（[a-z],[A-Z],[0-9]和[()`~!@#$%^&*-+=_|{}[]:;'<>,.?/]的特殊符号）",
            trigger: "blur"
          }
        ],
        passwordconfirm: [
          { required: true, message: "请输入确认密码", trigger: "blur" }
        ]
      },
      password: "",
      sshkeyList: [
        {
          key: 1,
          val: "112221"
        },
        {
          key: 2,
          val: "2221"
        },
        {
          key: 3,
          val: "3331"
        },
        {
          key: 4,
          val: "21212"
        }
      ],
      planTenderMethod: 1
    };
  },
  props: {
    reinstallStatus: {
      type: Object,
      default: () => []
    }
  },
  computed: {},
  mounted() {
    this.instanceInfo = this.reinstallStatus.InstanceItem
  },
  methods: {
    tableRowStyle({ row, rowIndex }) {
      return {
        "font-size": "12px"
      };
    },
    handlePack() {
      this.basic = !this.basic;
    },
    handleInstanceId() {},
    // 容量发生变化
    slider() {},
    //确定开机/取消
    handleCancel(value) {
      if (value) {
        var params = {
          Version: "2017-03-12",
          Region: this.$cookie.get("regionv2")
        };
        this.instanceInfo.forEach(function(item, index) {
          params["InstanceIds." + index] = item.InstanceId;
        });
        this.axios.post("cvm2/StartInstances", params).then(data => {});
      }
      this.$emit("close", false);
    }
  },
  components: {}
};
</script>
<style lang="scss" scoped>
.resetpassword {
  .title-wrap {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    span {
      font-weight: bolder;
    }
    i {
      font-size: 16px;
      font-weight: 900;
    }
  }
  .content {
    font-size: 12px;
    .packdown {
      color: #006eff;
    }
    .table {
      border: 1px solid #eee;
      border-bottom: none;
    }
    .renewdetail {
      padding: 0 5px;
      font-size: 12px;
      background: #e5f0ff;
      color: #003b80;
      border: 1px solid #97c7ff;
      .operate {
        color: #006eff;
        cursor: pointer;
        :hover {
          border-bottom: 1px solid #006eff;
        }
      }
    }
    .formMirror {
      ::v-deep .el-form-item__label {
        font-size: 12px;
      }
      ::v-deep .el-form-item__content {
        font-size: 12px;
      }
      ::v-deep .el-checkbox__label {
        font-size: 12px;
      }
      .button {
        ::v-deep .el-button + .el-button {
          margin-left: 0;
        }
      }
    }
    .dialog-footer {
      display: block;
      text-align: center;
      padding-top: 10px;
    }
    ::v-deep .el-form-item {
      margin-bottom: 5px;
    }
    ::deep .el-form-item__label {
      font-size: 12px;
    }
    ::v-deep .el-form-item__error {
      padding-top: 0;
      top: 95%;
    }
  }
}
</style>


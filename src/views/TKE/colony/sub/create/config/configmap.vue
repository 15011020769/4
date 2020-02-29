 <!-- 新建ConfigMap -->
<template>
  <div class="colony-wrap">
    <div class="tke-content-header">
      <div class="tke-grid">
        <!-- 左侧 -->
        <div class="grid-left">
          <span class="goback" @click="goBack">
            <i class="el-icon-back"></i>
          </span>
          <h2 class="header-title">新建ConfigMap</h2>
        </div>
        <!-- 右侧 -->
        <div class="grid-right"></div>
      </div>
    </div>
    <div class="colony-main">
      <div class="tke-card tke-formpanel-wrap mb60">
        <el-form
          ref="form"
          class="tke-form"
          :model="cm"
          label-position="left"
          :rules="rules"
          label-width="120px"
          size="mini"
        >
          <el-form-item label="名称" prop="name">
            <el-input class="w200" v-model="cm.name" placeholder="请输入名称"></el-input>
            <p :class="{ activeColor: fontColor }">最长63个字符，只能包含小写字母、数字及分隔符("-")，且必须以小写字母开头，数字或小写字母结尾</p>
          </el-form-item>
          <el-form-item label="命名空间">
            <el-select v-model="cm.value" placeholder="请选择">
              <el-option
                v-for="(item,index) in cm.options"
                :key="index"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <div class="border">
              <!-- 头部 -->
              <div class="flex f12 header">
                <div class="pl5" style="width:800px;">变量名</div>
                <div class="pl5" style="width:50%">变量值</div>
              </div>
              <!-- 主体 -->
              <div class="flex" style="padding:10px;border-top:1px solid #ddd;">
                <!-- <addValue></addValue> -->
                <el-form style="margin-bottom:10px;">
                  <el-form-item
                    v-for="(domain, index) in dynamicValidateForm.domains"
                    :key="index"
                    :prop="'domains.' + index + '.value'"
                  >
                    <div class="form-input">
                      <el-input v-model="domain.value" size="mini" placeholder="变量名"></el-input>
                      <span>=</span>
                      <textarea class="text" v-model="domain.valueKey"></textarea>
                      <el-tooltip
                        v-if="dynamicValidateForm.domains.length=='1'"
                        class="item"
                        effect="dark"
                        content="不可删除，至少设置一项"
                        placement="right"
                      >
                        <i class="el-icon-close"></i>
                      </el-tooltip>
                      <el-tooltip v-else class="item" effect="dark" content="删除" placement="right">
                        <i class="el-icon-close" @click.prevent="removeDomain(domain)"></i>
                      </el-tooltip>
                    </div>
                  </el-form-item>
                </el-form>
                <p>
                  <el-link type="primary" style="cursor: pointer;" @click="addDomain">新增变量</el-link>
                </p>
              </div>
              <p
                v-show="errorShow"
                style="color:red"
              >新增变量名格式不正确，只能包含字母、数字及分隔符("-"、"_"、".")，且必须以字母、数字开头和结尾</p>
            </div>
          </el-form-item>
        </el-form>

        <!-- 底部 -->
        <div class="tke-formpanel-footer">
          <el-button size="small" type="primary" @click="creatConfigmap">创建ConfigMap</el-button>
          <el-button size="small" @click="$router.go(-1)">取消</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import AddValue from '@/views/TKE/colony/sub/create/config/components/addValue.vue'
import addValue from "./components/addValue";
import FileSaver from "file-saver";
import XLSX from "xlsx";
import { ALL_CITY, TKE_COLONY_QUERY } from "@/constants";
export default {
  name: "configmapCreate",
  components: {
    addValue
  },
  data() {
    //验证名称
    var validateName = (rule, value, callback) => {
      console.log(value);
      if (value === "") {
        this.fontColor = true;
        callback();
      } else {
        let reg = /^[a-z]([a-z0-9]|-){0,61}([a-z0-9])$/;
        let flag = reg.test(this.cm.name);
        if (!flag) {
          this.fontColor = true;
          callback();
        } else {
          this.fontColor = false;
          callback();
        }
      }
    };
    return {
      rules: {
        name: [
          {
            validator: validateName,
            trigger: "blur",
            required: false
          }
        ]
      },
      fontColor: false,
      errorShow: false,
      cm: {
        name: "",
        value: "default",
        options: ["请选择Namespace"]
      },
      dynamicValidateForm: {
        domains: [
          {
            value: "",
            valueKey: ""
          }
        ]
      },
      clusterId: ""
    };
  },
  watch: {
    dynamicValidateForm: {
      handler(val) {
        let reg = /^[a-z]([a-z0-9]|-|_|.)*([a-z0-9])$/;
        val.domains.forEach(v => {
          if (!reg.test(v.value)) {
            this.errorShow = true;
          } else {
            this.errorShow = false;
          }
        });
      },
      deep: true
    }
  },
  created() {
    // 从路由获取类型
    this.clusterId = this.$route.query.clusterId;
    this.nameSpaceList();
  },
  methods: {
    //返回上一层
    goBack() {
      this.$router.go(-1);
    },
    creatConfigmap() {
      if (this.cm.name == "") {
        this.$refs.form.validateField("name");
        this.$message("名称不能為空");
        return false;
      }

      let arr = this.dynamicValidateForm.domains;
      let obj = {};
      arr.forEach(v => {
        obj[v.value] = v.valueKey;
      });

      if (arr[0].value == "") {
        this.$message({
          message: "变量名不能為空，至少设置一项",
          type: "error"
        });
        return false;
      }
      var params = {
        ClusterName: this.clusterId,
        Method: "POST",
        Path: "/api/v1/namespaces/" + this.cm.value + "/configmaps",
        RequestBody: {
          kind: "ConfigMap",
          apiVersion: "v1",
          metadata: { name: this.cm.name, namespace: this.cm.value },
          data: obj
        },
        Version: "2018-05-25"
      };
      if (!this.errorShow) {
        this.axios.post(TKE_COLONY_QUERY, params).then(res => {
          if (res.Response.Error == undefined) {
            this.$router.go(-1);
          }
        });
      }
    },

    //命名空间选项
    nameSpaceList() {
      if (this.clusterId) {
        var params = {
          ClusterName: this.clusterId,
          Method: "GET",
          Path: "/api/v1/namespaces",
          Version: "2018-05-25"
        };
        this.axios.post(TKE_COLONY_QUERY, params).then(res => {
          if (res.Response.Error == undefined) {
            var data = JSON.parse(res.Response.ResponseBody);
            var nameList = [];
            data.items.forEach(item => {
              this.cm.options.push(item.metadata.name);
            });
          }
        });
      }
    },
    removeDomain(item) {
      var index = this.dynamicValidateForm.domains.indexOf(item);
      if (index !== -1) {
        this.dynamicValidateForm.domains.splice(index, 1);
      }
    },
    addDomain() {
      this.dynamicValidateForm.domains.push({
        value: "",
        valueKey: ""
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.ipu {
  border: 1px solid #ddd;
}
textarea {
  width: 90%;
  max-width: 260px;
  height: 30px;
  line-height: normal;
  border: 1px solid #ddd;
}
.flex {
  display: flex;
}
.f12 {
  font-size: 12px;
  color: #888;
  font-weight: bold;
}
.pl5 {
  padding-left: 5px;
}
.header {
  width: 300px;
  height: 40px;
  line-height: 40px;
}
.border {
  width: 550px;
  max-height: 400px;
  border: 1px solid #ddd;
}
.text {
  width: 90%;
  max-width: 260px;
  height: 30px;
  line-height: normal;
  border: 1px solid #ddd;
}
.form-input {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
  span {
    margin: 0 10px;
  }
  i {
    margin: 0 10px;
    cursor: pointer;
  }
}
.form-p {
  margin-bottom: 10px;
  font-size: 12px;
  color: #888;
}
.box {
  width: 400px;

  .top {
    text-align: center;
  }

  .left {
    float: left;
    width: 60px;
  }

  .right {
    float: right;
    width: 60px;
  }

  .bottom {
    clear: both;
    text-align: center;
  }

  .item {
    margin: 4px;
  }

  .left .el-tooltip__popper,
  .right .el-tooltip__popper {
    padding: 8px 10px;
  }
}
.activeColor {
  color: #f56c6c !important;
}
</style>


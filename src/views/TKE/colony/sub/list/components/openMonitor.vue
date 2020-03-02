<template>
  <div class="monitor">
    <!-- 顶部标题 -->
    <div class="tke-content-header">
      <div class="tke-grid">
        <!-- 左侧 -->
        <div class="grid-left">
          <span class="goback" @click="goBack">
            <i class="el-icon-back"></i>
            <span>{{this.$route.query.title}} / 监控</span>
          </span>
        </div>
      </div>
    </div>
    <!-- 主体 -->
    <div class="room-bottom">
      <div class="box-top">
        <div class="box-top-left">
          <span class="span-1">实时</span>
          <div class="block">
            <el-date-picker
              v-model="value2"
              type="datetimerange"
              :picker-options="pickerOptions"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right"
              size="mini"
              @change="setTime()"
              style="width:300px;"
            ></el-date-picker>
          </div>
          <!-- 对比维度 -->
          <div v-show="dimensionflag">
            <span class="span-2">对比维度</span>
            <el-radio-group v-model="isCollapse" size="mini" @change="getRoom($event)">
              <el-radio-button :label="true">节点</el-radio-button>
              <el-radio-button :label="false">pod</el-radio-button>
            </el-radio-group>
            <span class="span-2" v-show="!isCollapse">所属节点</span>
            <el-select v-model="value" placeholder="请选择" size="mini" v-show="!isCollapse">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </div>
      </div>
      <div class="box-bottom">
        <div class="box-bottom-left">
          <el-checkbox
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            @change="handleCheckAllChange"
          >全选(共{{this.cities.length}}个)</el-checkbox>
          <!-- <div style="margin: 15px 0;"></div> -->
          <el-checkbox-group
            v-model="checkedCities"
            @change="handleCheckedCitiesChange"
            class="check-flex"
          >
            <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="box-bottom-right">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="事件" name="first">事件</el-tab-pane>
            <el-tab-pane label="CPU" name="second">CPU</el-tab-pane>
            <el-tab-pane label="内存" name="third">内存</el-tab-pane>
            <el-tab-pane label="网络" name="fourth">网络</el-tab-pane>
            <el-tab-pane label="GPU" name="five">GPU</el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import subTitle from "@/views/TKE/components/subTitle";
const cityOptions = ["asdasd", "3dsda", "asdaqwe"];
export default {
  name: "openMonitor",
  props: {
    dimensionflag: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      activeName: "first",
      value: "",
      checkAll: true,
      options: [],
      isCollapse: true,
      checkedCities: ["asdasd", "3dsda", "asdaqwe"],
      isIndeterminate: false,
      cities: cityOptions,
      pickerOptions: {
        shortcuts: [
          {
            text: "实时",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000);
              start.setTime(start.getTime());
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "近1天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "近7天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      value1: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
      value2: ""
    };
  },
  created() {},
  methods: {
    //返回上一层
    goBack() {
      this.$router.go(-1);
    },
    changeFlag() {
      this.$emit("changeFlag", false);
    },
    handleCheckAllChange(val) {
      this.checkedCities = val ? cityOptions : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.cities.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.cities.length;
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    setTime() {
      this.$emit("setTime", this.value2);
    },
    getRoom(e) {
      this.isCollapse = e;
    }
  },
  components: {
    subTitle
  }
};
</script>
<style lang='scss' scoped>
.room-bottom {
  width: 94%;
  margin: 20px auto;
  padding: 0 20px;
  .box-top {
    height: 40px;
    width: 100%;
    .box-top-left {
      display: flex;
      align-items: center;
      .span-1 {
        padding: 5px 10px;
        border: 1px solid #006eff;
        font-size: 12px;
        color: #006eff;
        cursor: pointer;
      }
      .span-2 {
        margin: 0px 10px;
      }
    }
  }
  .box-bottom {
    background: #ffffff;
    box-sizing: border-box;
    height: 580px;
    display: flex;
    justify-content: space-between;
    .box-bottom-left {
      width: 20%;
      height: 100%;
      border: 1px solid #e5e5e5;
      padding: 20px;
      .check-flex {
        display: flex;
        flex-direction: column;
        margin-top: 15px;
      }
    }
    .box-bottom-right {
      width: 65%;
      margin-right: 5%;
      .el-tab-pane {
        height: auto;
        overflow-y: scroll;
      }
    }
  }
}

.el-checkbox + .el-checkbox {
  margin-left: 0;
  margin-top: 15px;
  width: 50px;
}
.monitor >>> .el-date-picker {
  border-radius: 0;
}
</style>
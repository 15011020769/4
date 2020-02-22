<template>
  <div class="wrap">

    <div class="title">
      <span>
        <i class="el-icon-back icon" @click="returnBack" style="cursor: pointer;"></i>
        {{funNameTit}}
      </span>
    </div>
    <div class="wrapTab">
      <el-tabs v-model="activeName" @tab-click="handleClick" class="tabs">
        <!-- 函数配置 -->
        <el-tab-pane :label="$t('SCF.total.hspz')" name="first">
          <funConfig />
        </el-tab-pane>
        <!-- 函数代码 -->
        <el-tab-pane :label="$t('SCF.total.hsdm')" name="second">
          <funCode />
        </el-tab-pane>
        <!-- 触发方式 -->
        <el-tab-pane :label="$t('SCF.total.cffs')" name="third">
          <triggerMode ref="mychild" />
        </el-tab-pane>
        <!-- 通行日志 -->
        <el-tab-pane :label="$t('SCF.total.yxrz')" name="fouth">
          <runningLog />
        </el-tab-pane>
        <!-- 监控信息 -->
        <el-tab-pane :label="$t('SCF.total.jkxx')" name="fifth">
          <monitInfo v-if="montshow" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
  import triggerMode from "./Xmodel/triggerMode";
  import funCode from "./Xmodel/funCode";
  import runningLog from "./Xmodel/runningLog";
  import monitInfo from "./Xmodel/monitInfo";
  import funConfig from './Xmodel/funConfig'
  export default {
    data() {
      return {
        montshow: false,
        activeName: 'first',
        funNameTit: "",
      }
    },
    watch: {
      activeName(val) {
        if (val === 'fifth') {
          this.montshow = true
        }
      }
    },
    components: {
      funConfig,
      triggerMode,
      funCode,
      runningLog,
      monitInfo
    },
    mounted() {
      this.funNameTit = this.$route.query.functionName;
    },
    methods: {
      returnBack() {
        this.$router.push({
          path: "/FuncServe"
        });
      },
      handleClick(tab, event) {},
      childFn(val) {
        this.childData = val;
        this.centerDialogVisible = true;
      },
    }
  };

</script>
<style lang="scss" scoped>
  .wrap {

    ::v-deep .el-input__inner {
      height: 32px;
    }



    .title {
      background: #fff;
      height: 40px;
      line-height: 40px;

      span {
        font-weight: bold;
        font-size: 14px;
        margin-left: 20px;

        .icon {
          margin-right: 20px;
          color: #006eff;
        }
      }
    }

    .wrapTab {

      ::v-deep .el-tabs__nav-scroll {
        background-color: #fff;
        padding: 0 20px;
      }

      ::v-deep .el-tabs__content {
        margin: 0 20px;
      }
    }

  }

</style>

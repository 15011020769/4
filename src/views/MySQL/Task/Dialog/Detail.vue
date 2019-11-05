<template>
  <div class="create">
    <el-dialog :visible.sync="detailObj.detailShow" :show-close='false'>
      <div slot="title" class="title-wrap">
        <span>详情</span>
        <i class="el-icon-close" @click="close"></i>
      </div>
      <ul class="body">
        <li>
          <div class="div-1">任务ID</div>
          <div class="div-2">{{ detailObj.detailInfo.JobId }}</div>
        </li>
        <li>
          <div class="div-1">实例ID</div>
          <div class="div-2">{{ detailObj.detailInfo.Data[0].InstanceId }}</div>
        </li>
        <li>
          <div class="div-1">实例名</div>
          <div class="div-2">{{ detailObj.detailInfo.Data[0].InstanceId  }}</div>
        </li>
        <li>
          <div class="div-1">开始时间</div>
          <div class="div-2">{{ detailObj.detailInfo.StartTime }}</div>
        </li>
        <li>
          <div class="div-1">结束时间</div>
          <div class="div-2">{{ detailObj.detailInfo.EndTime }}</div>
        </li>
        <li>
          <div class="div-1">结果提示</div>
          <div class="div-2 color-1">{{ detailObj.detailInfo.Status | taskStatus }}</div>
        </li>
      </ul>
       <div slot="footer" class="dialog-footer">
        <el-button @click="close">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    detailObj: {
      type: Object,
      default: () => []
    }
  },
  data() {
    return {

    }
  },
  methods: {

    // 关闭模态框
    close() {
      this.$emit('detailShowFun', false);
    }
  },
  filters: {

    // 任务执行进度过滤
    taskStatus: function (value) {
      let status = {
        '0': '运行中',
        '2': '执行成功',
        '3': '执行失败',
        '4': '已中止',
        '5': '已删除',
        '6': '正在中止'
      }
      return status[value]
    }
  }

};
</script>

<style lang='scss' scoped>
.create {
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
      cursor: pointer;
    }
  }
  .body {
    li {
      height: 50px;
      .div-1 {
        float: left;
        color: #888;
        width: 80px;
      }
      .div-2 {
        float: left;
        color: #000;
      }
      .color-1 {
        color: #0abf5b;
      }
    }
  }
  .dialog-footer {
    display: block;
    text-align: center;
  }
}
</style>

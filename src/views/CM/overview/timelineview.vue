<template>
  <div class="container">
    <ul class="time-vertical">
      <li v-for="item in data" :key="item.Id">
        <b></b><span></span
        ><a href="javascript:void(0)">
          <p class="datetime">{{ formatDate(item.FirstOccurTime) }}</p>
          <p class="content">{{ item.Content }}</p>
          <p>
            {{ item.InstanceId + " " }}
            <label>{{ formatStatus(item.Status) }}</label>
          </p>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "timelineview",
  props: {
    data: Array
  },
  methods: {
    formatDate(date) {
      return moment(date).format("YYYY-MM-DD HH:mm:ss");
    },
    formatStatus(status) {
      if (status === 0) {
        return "未恢復";
      } else {
        return "已恢復";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  padding: 10px;
  width: 200px;

  .time-vertical {
    list-style-type: none;
    border-left: 1px solid #aaaaaa;
    padding: 0px;
    height: auto;
    li {
      height: 110px;
      position: relative;
      .datetime {
        color: #aaaaaa;
      }
      .content {
        color: #409eff;
      }
      p {
        font-size: 12px;
        line-height: 20px;
        label {
          color: #e54545;
        }
      }
      a {
        display: inline-block;
        margin-left: 20px;
        margin-top: 15px;
        text-decoration: none;
        color: #000;
      }
      b:before {
        content: "";
        position: absolute;
        top: 15px;
        left: -10px;
        width: 18px;
        height: 18px;
        border: 2px solid #98fb98;
        border-radius: 10px;
        background: #98fb98;
      }
      span {
        position: absolute;
        color: #fff;
        top: 18px;
        left: -6px;
      }
    }
  }
}
</style>

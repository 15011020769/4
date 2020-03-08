<!--
 * @Author: T
 * @Date: 2020-01-03 11:13:24
 * @LastEditTime : 2020-01-07 17:09:03
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /new_product/src/views/CSS/transcoding/tab/configDetail.vue
 -->
<template>
  <div class="detail-wrap">
    <el-row type="flex" justify="space-between" align="middle">
      <h3>水印配置</h3>
      <el-button type="text" @click="onEdit">{{$t('CSS.watermark.12')}}</el-button>
    </el-row>
    <ul class="content-box">
      <li>
        <el-row type="flex">
          <label>{{$t('CSS.watermark.7')}}</label>
          <div class="watermark-wrap">
            <img :src="selectItem.PictureUrl" />
          </div>
        </el-row>
      </li>
      <li>
        <el-row type="flex">
          <label>{{$t('CSS.watermark.8')}}</label>
          <div class="text-black">{{ selectItem.WatermarkName }}</div>
        </el-row>
      </li>
      <li>
        <el-row type="flex">
          <label>{{$t('CSS.watermark.9')}}</label>
          <div class="text-black">{{ selectItem | position }}</div>
        </el-row>
      </li>
      <li>
        <el-row type="flex">
          <label>X{{$t('CSS.watermark.10')}}</label>
          <div class="text-black">{{ selectItem.XPosition }}%</div>
        </el-row>
      </li>
      <li>
        <el-row type="flex">
          <label>Y{{$t('CSS.watermark.10')}}</label>
          <div class="text-black">{{ selectItem.YPosition }}%</div>
        </el-row>
      </li>
      <li>
        <el-row type="flex">
          <label>水印id</label>
          <div class="text-black">{{ selectItem.WatermarkId }}</div>
        </el-row>
      </li>
      <li>
        <el-row type="flex">
          <div>
            <el-button type="text" @click="previewDialog=true">預覽</el-button>
          </div>
          <!-- <div class="text-black">{{ selectItem.CosBucket }}</div> -->
        </el-row>
      </li>
    </ul>
    <el-dialog
      width="800px"
      :visible.sync="previewDialog"
      :title="$t('CSS.watermark.11')"
      @open="handleOpen"
    >
      <div style="position: relative;" v-if="selectItem">
        <img
          src="https://imgcache.qq.com/open_proj/proj_qcloud_v2/mc_2014/video/css/img/video-img.png"
        />
        <img
          :src="selectItem.PictureUrl"
          :style="'position: absolute;width:' + .01 * selectItem.Width * 760 + 'px;left:' + .01 * selectItem.XPosition * 760 + 'px;top:' + .01 * selectItem.YPosition * 430 + 'px'"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "configDetail",
  filters: {
    position(b) {
      if (!b) return;
      if (b.XPosition < 50 && b.YPosition < 50) return "左上角";
      if (b.XPosition >= 50 && b.YPosition < 50) return "右上角";
      if (b.XPosition < 50 && b.YPosition >= 50) return "左下角";
      if (b.XPosition >= 50 && b.YPosition >= 50) return "右下角";
    }
  },
  props: {
    selectItem: {
      type: Object
    }
  },

  data() {
    return {
      previewDialog: false
    };
  },
  methods: {
    onEdit() {
      this.$emit("update:formShow", true);
    },
    handleOpen() {
      console.log(this.selectItem);
    }
  }
};
</script>

<style lang="scss" scoped>
.detail-wrap {
  .watermark-wrap {
    width: 100px;
    height: 100px;
    img {
      max-width: 100%;
      max-height: 100%;
    }
  }
  .content-box {
    label {
      width: 68px;
    }
    label + div {
      color: #444;
      font-size: 12px;
    }
    > li {
      font-size: 12px;
      line-height: 1.5;
      color: #888;
      padding-right: 20px;
      padding: 6px;
    }
  }
}
</style>

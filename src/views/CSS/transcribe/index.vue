<template>
  <div class="transcribe-wrap">
    <HeaderCom :title="$t('CSS.transcribe.0')" />
    <div class="transcribe-main">
      <div class="explain">
        <p>
          {{$t('CSS.watermark.3')}}
          <router-link to="/domainManagement">域名管理</router-link>
          {{$t('CSS.watermark.4')}}
          <!-- <a href="#">{{$t('CSS.watermark.2')}}</a> -->
          {{$t('CSS.watermark.5')}}
        </p>
      </div>
      <contents />
    </div>
  </div>
</template>

<script>
import HeaderCom from '@/components/public/Head'
import Contents from './content.vue'
export default {
  name: 'transcribe',
  components: {
    HeaderCom,
    Contents
  },
}
</script>

<style lang="scss" scoped>
.transcribe-wrap {
  .transcribe-main {
    padding: 20px;
    box-sizing: border-box;

    .explain {
      color: #003b80;
      border: 1px solid #97c7ff;
      background: #e5f0ff;
      padding: 10px 30px 10px 20px;
      margin-bottom: 20px;
      border-radius: 2px;

      p {
        line-height: 18px;

        a {
          color: #006eff;
        }
        a:hover {
          border-bottom: 1px #006eff solid;
        }
      }
    }
  }
}
</style>

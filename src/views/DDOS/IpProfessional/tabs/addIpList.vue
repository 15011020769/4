<template>
  <!-- 防护配置-CC防护-URL黑白名单 -->
  <div id="addIpList">
    <div class="ccProtectPartFour">
      <div class="topBtnList">
        <el-button-group class="btnGroup">
          <el-button @click="checkListBtn(1)" :style="thisType==1?'color:#006eff;border:1px solid #006eff;':''">
            {{$t('DDOS.Proteccon_figura.URL_whitelist')}}
          </el-button>
          <el-button @click="checkListBtn(2)" :style="thisType==2?'color:#006eff;border:1px solid #006eff;':''">
            {{$t('DDOS.Proteccon_figura.IP_whitelist')}}
          </el-button>
          <el-button @click="checkListBtn(3)" :style="thisType==3?'color:#006eff;border:1px solid #006eff;':''">
            {{$t('DDOS.Proteccon_figura.IP_blacklist')}}
          </el-button>
        </el-button-group>
      </div>
      <div>
        <urlWhitelist :ccResourceId="ccResourceId" :switchState="switchState" v-if="thisType==1?true:false"/>
        <ipWhitelist :ccResourceId="ccResourceId" :switchState="switchState" v-if="thisType==2?true:false" />
        <ipBlacklist :ccResourceId="ccResourceId" :switchState="switchState" v-if="thisType==3?true:false" />
      </div>
    </div>
  </div>
</template>
<script>
import urlWhitelist from "./components/urlWhitelist";
import ipWhitelist from "./components/ipWhitelist";
import ipBlacklist from "./components/ipBlacklist";
export default {
  props: {
    ccResourceId: String, //资源ID
    switchState: Boolean, //防护状态
  },
  data() {
    return {
      thisType: 1 //默认选择URl白名单
    };
  },
  components: {
    urlWhitelist: urlWhitelist,
    ipWhitelist: ipWhitelist,
    ipBlacklist: ipBlacklist
  },
  watch: {
    ccResourceId(val) {
      this.ccResourceId = val;
    },
    switchState(val) {
      this.switchState = val;
    }
  },
  methods: {
    //选择名单属性
    checkListBtn(thisType) {
      this.thisType = thisType;
    }
  }
};
</script>
<style lang="scss">
#addIpList {
  .ccProtectPartFour {
    margin-top: 20px;
  }
  .topBtnList {
    margin-bottom: 12px;
    .btnGroup {
      button {
        height: 30px;
        border-radius: 0;
        line-height: 30px;
        padding: 0 20px;
        margin-right: 0;
      }
    }
  }
}
</style>
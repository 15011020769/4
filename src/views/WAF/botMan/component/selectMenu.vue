<!--
 * @Author: your name
 * @Date: 2020-02-21 15:10:45
 * @LastEditTime: 2020-02-21 18:42:37
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /new_product/src/views/WAF/botMan/component/selectMenu.vue
 -->
<template>
  <div class="main">
    <ul class="ul-wrapper">
      <li>
        <h4>会话特征</h4>
        <p @click="onSelect(sessionItem)" v-for="sessionItem in sessionRules">{{sessionItem.label}}</p>
      </li>
      <li>
        <h4>IP特征</h4>
        <p @click="onSelect(ipItem)" v-for="ipItem in ipRules">{{ipItem.label}}</p>
      </li>
      <li>
        <h4>请求特征</h4>
        <p @click="onSelect(reqItem)" v-for="reqItem in reqRules">{{reqItem.label}}</p>
      </li>
      <li>
        <h4>高级特征</h4>
        <p @click="onSelect(advanceItem)" v-for="advanceItem in advanceRules">{{advanceItem.label}}</p>
      </li>
      <li>
        <h4>UA</h4>
        <p @click="onSelect(uaItem)" v-for="uaItem in uaRules">{{uaItem.label}}</p>
      </li>
      <li>
        <h4>COOKIE</h4>
        <p @click="onSelect(cookItem)" v-for="cookItem in cookieRules">{{cookItem.label}}</p>
      </li>
      <li>
        <h4>Referer</h4>
        <p @click="onSelect(referItem)" v-for="referItem in referRules">{{referItem.label}}</p>
      </li>
      <li>
        <h4>HTTP头部</h4>
        <p @click="onSelect(headerItem)" v-for="headerItem in headerRules">{{headerItem.label}}</p>
      </li>
    </ul>
  </div>
</template>

<script>
import { sessionRules, ipRules, reqRules, advanceRules, uaRules, cookieRules, referRules, headerRules } from '../../constants'
export default {
  data() {
    return {
      sessionRules,
      ipRules,
      reqRules,
      advanceRules,
      uaRules,
      cookieRules,
      referRules,
      headerRules
    }
  },

  methods: {
    onSelect(item) {
      // console.log(item);
      this.$emit('update:selectInfo', item)
      this.$emit('update:showSelectMenu', false)
      // console.log()
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
  .ul-wrapper {
    display: flex;
    width: 763px;
    flex-wrap: wrap;
    padding-left: 20px;
    
    li {
      width: 25%;
      P {
        cursor: pointer;
      }
    }
  }
}
</style>
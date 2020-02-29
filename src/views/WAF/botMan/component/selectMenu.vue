<!--
 * @Author: your name
 * @Date: 2020-02-21 15:10:45
 * @LastEditTime: 2020-02-21 18:42:37
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /new_product/src/views/WAF/botMan/component/selectMenu.vue
 -->
<template>
  <!-- <div class="main"> -->
    <ul class="ul-wrapper" @click.stop>
      <li>
        <h4>会话特征</h4>
        <p
          @click="onSelect(item)"
          :class="{
            disabled: selected.includes(item.key) && item.key !== current,
            actived: item.key === current
          }"
          v-for="item in sessionRules"
          :key="item.key"
        >
          {{item.label}}
        </p>
      </li>
      <li>
        <h4>IP特征</h4>
         <p
          @click="onSelect(item)"
          :class="{
            disabled: selected.includes(item.key) && item.key !== current,
            actived: item.key === current
          }"
          v-for="item in ipRules"
          :key="item.key"
        >
          {{item.label}}
        </p>
      </li>
      <li>
        <h4>请求特征</h4>
        <p
          @click="onSelect(item)"
          :class="{
            disabled: selected.includes(item.key) && item.key !== current,
            actived: item.key === current
          }"
          v-for="item in reqRules"
          :key="item.key"
        >
          {{item.label}}
        </p>
      </li>
      <li>
        <h4>高级特征</h4>
        <p
          @click="onSelect(item)"
          :class="{
            disabled: selected.includes(item.key) && item.key !== current,
            actived: item.key === current
          }"
          v-for="item in advanceRules"
          :key="item.key"
        >
          {{item.label}}
        </p>
      </li>
      <li>
        <h4>UA</h4>
         <p
          @click="onSelect(item)"
          :class="{
            disabled: selected.includes(item.key) && item.key !== current,
            actived: item.key === current
          }"
          v-for="item in uaRules"
          :key="item.key"
        >
          {{item.label}}
        </p>
      </li>
      <li>
        <h4>COOKIE</h4>
        <p
          @click="onSelect(item)"
          :class="{
            disabled: selected.includes(item.key) && item.key !== current,
            actived: item.key === current
          }"
          v-for="item in cookieRules"
          :key="item.key"
        >
          {{item.label}}
        </p>
      </li>
      <li>
        <h4>Referer</h4>
        <p
          @click="onSelect(item)"
          :class="{
            disabled: selected.includes(item.key) && item.key !== current,
            actived: item.key === current
          }"
          v-for="item in referRules"
          :key="item.key"
        >
          {{item.label}}
        </p>
      </li>
      <li>
        <h4>HTTP头部</h4>
        <p
          @click="onSelect(item)"
          :class="{
            disabled: selected.includes(item.key) && item.key !== current,
            actived: item.key === current
          }"
          v-for="item in headerRules"
          :key="item.key"
        >
          {{item.label}}
        </p>
      </li>
    </ul>
  <!-- </div> -->
</template>

<script>
import { sessionRules, ipRules, reqRules, advanceRules, uaRules, cookieRules, referRules, headerRules } from '../../constants'
export default {
  props: {
    selected: Array,
    current: String,
  },
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
      if (!this.selected.includes(item.key)) {
        this.$emit('select', item)
      }
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
    position: absolute;
    background: #fff;
    z-index: 1000;
    border: 1px solid #d1d5de;
    li {
      width: 25%;
      P {
        cursor: pointer;
        line-height: 30px;
        color: #000;
        &.disabled {
          cursor: not-allowed;
          color: #bbb;
        }
        &.actived {
          color: #006eff;
        }
      }
    }
  }
}
</style>
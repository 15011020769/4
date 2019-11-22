<template>
  <div>
    <div class='datails-nav'>
     <ul>
       <router-link to="/CVM"><li><i class="el-icon-back"></i></li></router-link>

       <li><h3>{{ID}}</h3></li>
     </ul>
     <div class='datails-tab'>
       <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="监控" name="first"><Monitor/></el-tab-pane>
        <el-tab-pane label="告警策略" name="second"><strategy/></el-tab-pane>
      </el-tabs>
     </div>
    </div>
  </div>
</template>

<script>
import strategy from './tab/strategy'
import Monitor from './tab/Monitor'

export default {
  data() {
    return {
      activeName: 'first',
      ID: this.$route.query.id,
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
  },
  components: {
    strategy,
    Monitor,
  },
}
</script>

<style scoped lang="scss">
.datails-nav{height: 80px;background: #fff;
 ul{display: flex;height: 40px;line-height: 40px;margin-left: 20px;
  li:nth-child(1){color: blue;}
  li:nth-child(2){margin-left: 10px;}
  li:nth-child(3){margin-left: 10px;font-size: 12px;}
 }
.datails-tab{margin-left: 20px;margin-right: 20px;}

}
</style>

<template>
  <div>
    <div class="datails-nav">
      <ul>
        <router-link to="/domainLive">
          <li>
            <i class="el-icon-back"></i>
            <span>域名管理</span>
          </li>
        </router-link>
        <li>
          <h3>{{name}}</h3>
        </li>
      </ul>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick" class="detailsTabs">
      <el-tab-pane label="基本信息" name="first">
        <first />
      </el-tab-pane>
      <el-tab-pane label="推流配置" name="two">
        <two />
      </el-tab-pane>
      <el-tab-pane label="模板配置" name="three">
        <three />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
  import first from './first'
  import two from './two'
  import three from './three'
  export default {
    data() {
      return {
        activeName: "first",
        name: this.$route.query.name
      };
    },
    methods: {
      handleClick(tab, event) {
        // console.log(tab, event);
      }
    },
    components: {
      first,
      two,
      three
    }
  };

</script>

<style scoped lang="scss">
  .datails-nav {
    background: #fff;

    span {
      color: #006eff;
      font-size: 14px;
      padding: 0 10px;
      box-sizing: border-box;
    }


    ul {
      display: flex;
      height: 50px;
      line-height: 50px;
      margin-left: 20px;

      li {
        display: flex;
        align-items: center;
        justify-content: center;

        i {
          font-size: 16px;
          font-weight: bold;
        }
      }

      li:nth-child(1) {
        color: blue;
      }

      li:nth-child(2) {
        margin-left: 10px;
      }

      li:nth-child(3) {
        margin-left: 10px;
        font-size: 12px;
      }
    }


  }

  .detailsTabs {
    margin-left: 20px;
    margin-right: 20px;
  }

</style>

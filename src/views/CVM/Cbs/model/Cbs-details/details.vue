<template>
  <div class="cbs-details">

    <div class="details-title">
      <router-link class="el-icon-back"
        to='/Cbs'
        tag='i'></router-link>
      <h2>{{id}}</h2>
    </div>
    <el-tabs v-model="activeName"
      @tab-click="handleClick">
      <el-tab-pane label="参数"
        name="first">
        <parameter :CbsDetail='CbsDetail'
          v-if="this.CbsDetail.length>0"></parameter>
      </el-tab-pane>
      <el-tab-pane label="操作日志"
        name="second">
        <Journal :CbsDetail='CbsDetail'
          v-if="this.CbsDetail.length>0"></Journal>
      </el-tab-pane>
      <el-tab-pane label="硬盘监控" class="el-tab-monitor"
        name="third">
        <Monitor :CbsDetail='CbsDetail'
          v-if="this.CbsDetail.length>0" />
      </el-tab-pane>

    </el-tabs>

  </div>
</template>

<script>
import parameter from './parameter'
import Journal from './Journal'
import Monitor from './Monitor'
export default {
  data () {
    return {
      id: this.$route.query.id,
      CbsDetail: '',
      activeName: 'first'
    }
  },
  components: {
    parameter,
    Journal,
    Monitor
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      this.loading = true
      var parms = {
        Version: '2017-03-12',
        Region: this.$cookie.get('regionv2'),
        'DiskIds.0': this.id
      }
      this.axios.post('cbs2/DescribeDisks', parms).then(data => {
        this.CbsDetail = data.Response.DiskSet
      })
    },
    handleClick (tab, event) {
      // console.log(tab, event)
    }
  }
}
</script>
<style lang="scss" scoped>
.cbs-details {
  .details-title {
    background: #fff;
    padding: 10px 20px;
    display: flex;
    & > i {
      font-size: 16px;
      font-weight: 900;
      line-height: 30px;
      width: 26px;
      box-sizing: border-box;
      display: inline-block;
      text-align: center;
      margin-left: -6px;
      margin-right: 24px;
      vertical-align: middle;
      overflow: hidden;
      color: #006eff;
      cursor: pointer;
    }
    & > h2 {
      font-size: 16px;
      font-weight: 700;
      color: #171d25;
      height: 30px;
      line-height: 30px;
    }
  }
}
</style>
<style lang="scss" >
.cbs-details {
  .el-tabs__nav-scroll {
    padding-left: 20px;
    background: #fff;
  }
}
.el-tabs__content {
  margin: 20px;
  background-color: #fff;
  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
  padding: 20px;
}

</style>

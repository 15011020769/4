<template>
    <div>
        <el-form :model="dynamicValidateForm" ref="dynamicValidateForm"  class="demo-dynamic" style="margin-bottom:10px;">
            <el-form-item
                v-for="(domain, index) in dynamicValidateForm.domains"
                :key="domain.key"
                :prop="'domains.' + index + '.value'"
            >
            <div class="form-input">
                <el-input v-model="domain.value" size="mini" placeholder="变量名"></el-input>
                <span>=</span>
                <textarea class="text" v-model="domain.valueKey"></textarea>
                 <el-tooltip class="item" effect="dark" content="删除" placement="right">
                    <i class="el-icon-close" @click.prevent="removeDomain(domain)"></i>
                </el-tooltip>
            </div>
            </el-form-item>
        </el-form>
        <el-link type="primary" style="cursor: pointer;"  @click="addDomain">新增变量</el-link>
    </div>
</template>
<script>
export default {
  name: 'addValue',
  data () {
    return {
      dynamicValidateForm: {
        domains: []
      }
    }
  },
  methods: {
    removeDomain (item) {
      var index = this.dynamicValidateForm.domains.indexOf(item)
      if (index !== -1) {
        this.dynamicValidateForm.domains.splice(index, 1)
      }
    },
    addDomain () {
      this.dynamicValidateForm.domains.push({
        value: '',
        valueKey: '',
        key: Date.now()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.text {
  width: 90%;
  max-width: 260px;
  height: 30px;
  line-height: normal;
  border:1px solid #ddd;
}
.form-input{
    display: flex;
    justify-content: space-between;
    align-items: center;
    span{
        margin:0 10px;
    }
    i{
        margin:0 10px;
        cursor: pointer;
    }
}
.form-p{
    margin-bottom: 10px;
    font-size: 12px;
    color: #888;

}
.box {
    width: 400px;

    .top {
      text-align: center;
    }

    .left {
      float: left;
      width: 60px;
    }

    .right {
      float: right;
      width: 60px;
    }

    .bottom {
      clear: both;
      text-align: center;
    }

    .item {
      margin: 4px;
    }

    .left .el-tooltip__popper,
    .right .el-tooltip__popper {
      padding: 8px 10px;
    }
  }
</style>

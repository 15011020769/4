<template>
    <div>
        <el-form :model="dynamicValidateForm" ref="dynamicValidateForm"  class="demo-dynamic">
            <el-form-item
                v-for="(domain, index) in dynamicValidateForm.domains"
                :key="domain.key"
                :prop="'domains.' + index + '.value'"
            >
            <div class="form-input">
                <el-input v-model="domain.value" size="mini" placeholder="变量名"></el-input>
                <span>=</span>
                <el-input v-model="domain.valueKey" size="mini" placeholder="变量值"></el-input>
                 <el-tooltip class="item" effect="dark" content="删除" placement="right">
                    <i class="el-icon-close" @click.prevent="removeDomain(domain)"></i>
                </el-tooltip>
            </div>
            </el-form-item>
            <p v-show="dynamicValidateForm.domains.length?true:false" class="form-p">可通过设置自定义参数替换Chart包的默认配置，如：image.repository = nginx</p>
        </el-form>
        <el-link type="primary" style="cursor: pointer;"  @click="addDomain">新增变量</el-link>
    </div>
</template>
<script>
export default {
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

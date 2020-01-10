<template>
    <div>
        <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" label-width="100px" class="demo-dynamic">
            <el-form-item
                v-for="(domain, index) in dynamicValidateForm.domains"
                :key="domain.key"
                :prop="'domains.' + index + '.value'"
            >
            <el-form-item
                v-for="(domain, index) in dynamicValidateForm.domains"
                :key="domain.key"
                :prop="'domains.' + index + '.value'"
            >
            <el-input v-model="domain.value" size="mini"></el-input><el-button @click.prevent="removeDomain(domain)"  size="mini">删除</el-button>
            </el-form-item>
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
      },
      index: ''
    }
  },
  methods: {
    removeDomain (item) {
      var index = this.dynamicValidateForm.domains.indexOf(item)
      console.log(index)
      if (index !== -1) {
        this.dynamicValidateForm.domains.splice(index, 1)
      }
    },
    addDomain () {
      this.dynamicValidateForm.domains.push({
        value: '',
        key: Date.now()
      })
    }
  }

}
</script>
<style lang="scss" scoped>

</style>

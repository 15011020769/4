<template>
  <div class="bind">
    <el-dialog :visible.sync="applyObj.applyShow" :show-close="false">
      <div slot="title" class="title-wrap">
        <span>申请弹性公网IP</span>
        <i class="el-icon-close" @click="close"></i>
      </div>
      <div class="body">
        <el-row class="row-margin">
          <el-col :span="4">
            <div>选择地域</div>
          </el-col>
          <el-col :span="20">
            <region-select :parm="parm" @changeSelect="changeSelect"></region-select>
          </el-col>
        </el-row>
        <el-row class="row-margin">
          <el-col :span="4">
            <div>数量</div>
          </el-col>
          <el-col :span="20">
            <el-input-number v-model="num" size="small" @change="handleChange" :min="1" :max="20" label="描述文字"></el-input-number>
            <span> {{num}}/ 20</span>
          </el-col>
        </el-row>
        <el-row class="row-margin">
          <el-col :span="4">
            <div>费用</div>
          </el-col>
          <el-col :span="20">
            <p class="p-1">{{ 0.20 * num | keepTowNum}}元/小时</p>
            <p class="p-2">空置时收费，绑定资源减免费用</p>
          </el-col>
        </el-row>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submitForm()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import RegionSelect from '@/components/Tools/RegionSelect'
export default {
  props: {
    applyObj: {
      type: Object,
      default: () => []
    }
  },
  data () {
    return {
      parm: 'FWQ',
      value: '',
      num: 1
    }
  },
  components: {
    RegionSelect
  },
  mounted () {},
  methods: {
    // 城市点击事件 触发表格更新
    changeSelect (val) {},
    // 数量计数器
    handleChange (value) {
      // console.log(value)
    },
    // 提交
    submitForm () {
      let params = {
        Version: '2017-03-12',
        Region: this.$cookie.get('regionv2')
      }
      this.axios.post('vpc2/AllocateAddresses', params).then(data => {
        setTimeout(() => {
          this.$parent.getDataList() // 请求父组件的列表
          this.$message({
            message: '申请中，请稍后查看',
            type: 'success'
          })
        }, 1000)
        this.$emit('applyShowVal', false)
      })
    },

    // 关闭模态框
    close () {
      this.$emit('applyShowVal', false)
    }
  },
  filters: {
    keepTowNum: function (val) {
      val = Number(val)
      return val.toFixed(2)
    }
  }
}
</script>

<style lang='scss' scoped>
.bind {
  .title-wrap {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    span {
      font-weight: bolder;
    }
    i {
      font-size: 16px;
      font-weight: 900;
      cursor: pointer;
    }
  }
  .body {
    .row-margin:not(:first-child) {
      margin-top: 10px;
    }
    .p-1 {
      color: #ff7800;
      font-size: 24px;
    }
    .p-2 {
      font-size: 12px;
      color: #888;
      vertical-align: middle;
      margin-top: 8px;
    }
  }
  .dialog-footer {
    display: block;
    text-align: center;
  }
}
</style>

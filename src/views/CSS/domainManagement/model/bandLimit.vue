<template>
  <div class="container">
    <el-row type="flex" :gutter="20" class="limit">
      <span style="display: inline-block; width: 100px;">带宽封顶</span>
      <el-col>
        <el-switch v-model="enable" />
      </el-col>
    </el-row>
    <div class="content">
      <el-row type="flex">
        <el-col :span="10">限制区域</el-col>
        <el-col :span="12">带宽阈值</el-col>
        <el-col :span="2">操作</el-col>
      </el-row>
      <el-row type="flex" v-for="(limit, i) in info" :key="limit.key">
        <el-col :span="10">
          <el-select size="small" style="width: 210px" v-model="limit.playType" :disabled="playType !== 2">
            <el-option label="中国大陆" :value="1"></el-option>
            <el-option label="全球加速" :value="2"></el-option>
            <el-option label="中国港澳台地区及海外地区" :value="3"></el-option>
          </el-select>
        </el-col>
        <el-col :span="12">
          <el-input style="width: 140px" size="small"  placeholder="请输入整数" :maxlength="13" v-model="limit.value" @input="v => limit.value = v.replace(/[^\d]/g,'')"/>&nbsp;
          <el-select style="width: 190px" size="small" v-model="limit.unit">
            <el-option label="Mbps" :value="1"></el-option>
            <el-option label="Gbps" :value="2"></el-option>
            <el-option label="Tbps" :value="3"></el-option>
          </el-select>
        </el-col>
        <el-col :span="2">
          <el-button type="text" @click="remove(i)">删除</el-button>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center" v-show="showAdd">
        <el-button size="small" type="text" @click="add">新增一行</el-button>
      </el-row>
    </div>
    <el-row type="flex" justify="center" class="oper">
      <el-button size="small" type="primary" @click="save">保存</el-button>
      <el-button size="small" @click="$emit('update:visible', false)">取消</el-button>
    </el-row>
  </div>
</template>
<script>
import { MODIFY_LIVE_BAND_LIMIT } from '@/constants'
let key = 1
export default {
  props: {
    bandLimit: Object,
    playType: Number
  },
  data() {
    return {
      enable: false,
      info: []
    }
  },
  watch: {
    enable(n) {
      if (!n) {
        this.info = []
      }
    },
  },
  computed: {
    playTypes() {
      return this.info.map(l => l.playType)
    },
    showAdd() {
      return this.enable && (this.playType === 2 && !this.playTypes.includes(2) || this.info.length === 0)
    }
  },
  mounted() {
    if (this.bandLimit && this.bandLimit.BandLimitEnable === 1) {
      // if ()
      this.enable = true
      const info = {
        unit: 1
      }
      if (this.playType === 1) {
        info.value = this.bandLimit.DomesticBandLimitValue
      } else if (this.playType === 2) {
        info.value = this.bandLimit.GlobalBandLimitValue
      } else {
        info.value = this.bandLimit.AbroadBandLimitValue
      }
      if (info.value >= 1000) {
        info.value /= 1000
        info.unit = 2
      } else if (info.value >= 10000) {
        info.value /= 10000
        info.unit = 3
      }
      this.info.push({
        key,
        ...info,
        playType: this.playType,
      })
    }
  },
  methods: {

    save() {
      const req = {
        Version: "2018-08-01",
        DomainName: this.$route.query.Name,
        BandLimitEnable: Number(this.enable),
        AbroadBandLimitEnable: 0, // 港澳台启用禁用
        AbroadBandLimitValue: 100, // 港澳台带宽
        DomesticBandLimitEnable: 0, // 国内
        DomesticBandLimitValue: 100,
        GlobalBandLimitEnable: 0, // 全球
        GlobalBandLimitValue: 100,
      }
      if (this.enable && this.info.length === 0) {
        return void this.msg('带宽封顶已开启，请添加限制条件')
      }
      const bandLimit = {}
      for (let i = 0; i < this.info.length; i++) {
        if (Number(this.info[i].value) < 100 && this.info[i].unit === 1) {
          return void this.msg('带宽封顶值必须大于等于100Mbps')
        }
        bandLimit[this.info[i].playType] = this.toMbps(this.info[i])
      }
      if (bandLimit[1]) { // 国内
        req.DomesticBandLimitEnable = 1
        req.DomesticBandLimitValue = Number(bandLimit[1])
      }
      if (bandLimit[2]) { // 全球
        req.GlobalBandLimitEnable = 1
        req.GlobalBandLimitValue = Number(bandLimit[2])
      }
      if (bandLimit[3]) { // 港澳台
        req.AbroadBandLimitEnable = 1
        req.AbroadBandLimitValue = Number(bandLimit[3])
      }
      this.axios.post(MODIFY_LIVE_BAND_LIMIT, req)
        .then(res => {
          this.msg('保存成功', 'success')
          this.$emit('success')
        })
    },
    toMbps(info) {
      if (info.unit === 2) { // Gbps
        return info.value * 1000
      }
      if (info.unit === 3) { // Tbps
        return info.value * 10000
      }
      return info.value
    },
    add() {
      this.info.push({
        key: ++key,
        playType: this.playType,
        value: 100,
        unit: 1,
      })
    },
    remove(i) {
      this.info.splice(i, 1)
    },
    msg(msg, type = 'error') {
      this.$message({
        message: msg,
        type,
        showClose: true,
        duration: 0
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.container {
  padding: 20px;
  .limit {
    margin-left: 5px !important;
    margin-bottom: 15px;
  }
  .oper {
    margin-top: 20px;
  }
  .content {
    border: 1px solid #ddd;
    border-top: none;
    & > div {
      &:first-of-type {
      line-height: 40px;
        height: 40px;
      }
      padding-left: 10px;
      border-top: 1px solid #ddd;
      height: 50px;
      line-height: 50px;
    }
  }
}
.sub-text {
  font-size: 12px;
  color: #888;
  vertical-align: middle;
}
</style>
<template>
  <div>
    <div class="newClear">
      <div class="newClear addressList">
        <div class="addreLabel">{{t('国内', 'WAF.gn')}}</div>
        <div class="addreIpt">
          <el-radio-group v-model="internalRadio">
            <el-radio :label="1">全部</el-radio>
            <el-radio :label="0">{{t('选择省市自治区', 'WAF.xzsszzq')}}</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="newClear addressList" v-show="internalRadio === 0">
        <div class="addreLabel">{{t('请选择', 'WAF.qxz')}}</div>
        <div class="addreIpt">
          <el-checkbox-group v-model="internalCheck" class="provinces">
            <el-checkbox v-for="(item,index) in availableBanProvinces" :label="item" :key="item" name="type"></el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <div class="newClear addressList">
        <div class="addreLabel">{{t('国外', 'WAF.gw')}}</div>
        <div class="addreIpt ">
          <el-radio-group v-model="foreignRadio">
            <el-radio :label="1">全部</el-radio>
            <el-radio :label="0">{{t('选择国家/地区', 'WAF.xzgqdq')}}</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="newClear addressList" v-show="foreignRadio === 0">
        <div class="addreLabel">{{t('请选择', 'WAF.qxz')}}</div>
        <div class="addreIpt foreign">
          <el-select
            v-model="foreignCheck"
            multiple
            filterable
            default-first-option
            :placeholder="t('请输入', 'WAF.qsr')">
            <el-option
              v-for="item in availableBanNation"
              :key="item.en"
              :label="`${item.zh}(${item.en})`"
              :value="item.zh"
              v-if="item.en !== 'China'"
            >
            </el-option>
          </el-select>
        </div>
      </div>
    </div>
    <span class="footer">
      <el-button class="sureAddress" @click="sureAddress">{{t('确定', 'WAF.qd')}}</el-button>
      <el-button @click="handleClose">取消</el-button>
    </span>
  </div>
</template>
<script>
import { MODIFY_AREA_BAN_AREAS, ADD_AREA_BAN_AREAS } from '@/constants'
import { flatObj } from '@/utils'
import { COMMON_ERROR } from '../../constants'
export default {
  props: {
    availableBanProvinces: Array,
    availableBanNation: Array,
    areaBanAreas: {
      type: Object,
      required: false
    },
    visible: Boolean,
    domain: Object
  },
  data(){
    return{
      internalCheck: this.areaBanAreas && this.areaBanAreas.Areas.filter(area => this.availableBanProvinces.includes(area)) || [],//国内选择
      foreignCheck: this.areaBanAreas && this.areaBanAreas.Areas.filter(area => !this.availableBanProvinces.includes(area)) || [],//国外选择
      internalRadio: this.areaBanAreas && this.areaBanAreas.Areas.includes(this.t('国内', 'WAF.gn')) ? 1: 0,
      foreignRadio: this.areaBanAreas && this.areaBanAreas.Areas.includes(this.t('国外', 'WAF.gw')) ? 1: 0
    }
  },
  methods:{
    //关闭按钮
    handleClose(){
      this.$emit("update:visible", false)
    },
    //确定按钮
    sureAddress(){
      let areas = []
      if (this.internalRadio === 1) {
        areas.push(this.t('国内', 'WAF.gn'))
      } else {
        areas = [...this.internalCheck]
      }
      if (this.foreignRadio === 1) {
        areas.push(this.t('国外', 'WAF.gw'))
      } else {
        areas = areas.concat(this.foreignCheck)
      }

      if (areas.length === 0) {
        areas.push('none') // 什么都不选
      }
      const param = {}
      let url = MODIFY_AREA_BAN_AREAS
      if (!this.areaBanAreas) {
        url = ADD_AREA_BAN_AREAS
        param.Edition = 'clb-waf'
      }
      this.axios.post(url, flatObj({
        Version: '2018-01-25',
        Domain: this.domain.Domain,
        Areas: areas,
        ...param,
      })).then(resp => {
        this.generalRespHandler(resp, () => {
          this.$emit("update:visible", false)
          this.$emit("success", this.domain)
        }, COMMON_ERROR, '编辑地域封禁成功')
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.newClear:after{
  content:'';
  clear:both;
  display:block;
}
::v-deep .el-dialog__title{
  font-size:14px;
  font-weight: 600;
}
.footer{
  display:inline-block;
  width:100%;
  text-align:center;
  .sureAddress{
    background-color:#006eff;
    color:#fff;
  }
}
.addressList{
  margin-bottom:16px;
  div:nth-child(1).addreLabel{
    float:left;
    width:60px;
    font-size:12px;
  }
  div:nth-child(2).addreIpt{
    float:left;
    width:calc(100% - 60px);
  } 
}
.provinces {
  margin-left: -30px;
  label {
    margin-left: 30px;
  }
}
.foreign {
  ::v-deep .el-select {
    width: 100%;
  }
}
</style>
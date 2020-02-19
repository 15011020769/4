<template>
    <el-drawer
    title="我是标题"
    :visible.sync="flag"
    :with-header="false"
    :before-close="changeFlag"
    :modal='false'
    class='drawer-height'
    size='65%'>
           <div class='room-top'>{{title}}</div>
           <div class='room-bottom'>
               <div class='box-top'>
                   <div class='box-top-left'>
                       <span class='span-1'>实时</span>
                       <div class="block" >
                            <el-date-picker
                            v-model="value2"
                            type="datetimerange"
                            :picker-options="pickerOptions"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            align="right" size="mini"
                            @change='setTime()'
                            style="width:300px;">
                            </el-date-picker>
                        </div>
                        <span class='span-2'>对比维度</span>
                        <el-radio-group v-model="isCollapse"  size="mini" @change="getRoom($event)">
                          <el-radio-button :label="true" >节点</el-radio-button>
                          <el-radio-button :label="false">pod</el-radio-button>
                       </el-radio-group>
                       <span class='span-2'  v-show='!isCollapse'>所属节点</span>
                        <el-select v-model="value" placeholder="请选择" size='mini' v-show='!isCollapse'>
                            <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                            >
                            </el-option>
                        </el-select>
                   </div>
               </div>
                <div class='box-bottom'>
                  <div class='box-bottom-left'>
                    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选(共{{this.cities.length}}个)</el-checkbox>
                      <!-- <div style="margin: 15px 0;"></div> -->
                      <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange" class='check-flex'>
                        <el-checkbox v-for="city in cities" :label="city" :key="city" >{{city}}</el-checkbox>
                      </el-checkbox-group>
                  </div>
                  <div class='box-bottom-right'>
                     <el-tabs v-model="activeName" @tab-click="handleClick">
                        <el-tab-pane label="事件" name="first">事件</el-tab-pane>
                        <el-tab-pane label="CPU" name="second">CPU</el-tab-pane>
                        <el-tab-pane label="内存" name="third">内存</el-tab-pane>
                        <el-tab-pane label="网络" name="fourth">网络</el-tab-pane>
                        <el-tab-pane label="GPU" name="five">GPU</el-tab-pane>
                      </el-tabs>
                  </div>
                </div>
              </div>
    </el-drawer>
</template>
<script>
const cityOptions = ['asdasd', '3dsda', 'asdaqwe'];
export default {
  props: {
    flag: {
      type: Boolean,
      default: false
    },
    title: {
      required: true,
      type: String
    }
  },
  data () {
    return {
      activeName: 'first',
      value: '',
      checkAll: true,
      options:[],
      isCollapse: true,
      checkedCities: ['asdasd', '3dsda', 'asdaqwe'],
      isIndeterminate: false,
      cities: cityOptions,
      pickerOptions: {
        shortcuts: [{
          text: '实时',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000)
            start.setTime(start.getTime())
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '近1天',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 1)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '近7天',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end])
          }
        }] },
      value1: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
      value2: ''
    }
  },
  methods: {
    changeFlag () {
      this.$emit('changeFlag', false)
    },
    handleCheckAllChange (val) {
      this.checkedCities = val ? cityOptions : []
      this.isIndeterminate = false
    },
    handleCheckedCitiesChange (value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.cities.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length
    },
    handleClick (tab, event) {
      console.log(tab, event)
    },
    setTime () {
      this.$emit('setTime', this.value2)
    },
    getRoom (e) {
      this.isCollapse = e
    }
  }
}
</script>
<style lang='scss' scoped>
.drawer-height{
    top:60px;
    right:0;
    bottom:0;
    // overflow:scroll;
}
.room-top{
    width:100%;
    height:50px;
    border-bottom:1px solid #f2f2f2;
    font-size:14px;
    font-weight:bold;
    padding-left:20px;
    line-height:50px;
}
.room-bottom{
  // overflow:auto;
    height:85%;
    padding:20px 0 20px 20px;
    .box-top{
        height:40px;
        width:100%;
        margin-bottom:10px;
        .box-top-left{
            display:flex;
            align-items:center;
            .span-1{
                padding:5px 10px;
                border:1px solid #006eff;
                font-size:12px;
                color:#006eff;
                cursor:pointer;
            }
            .span-2{
                margin:0px 10px;
            }
        }
    }
}
.box-bottom{
  padding-top:10px;
  height:100%;
  display:flex;
  justify-content:space-between;
  .box-bottom-left{
    width:20%;
    height:100%;
    border:1px solid #e5e5e5;
    padding:20px;
    .check-flex{
        display:flex;
        flex-direction:column;
        margin-top:15px;
      }
  }
  .box-bottom-right{
    width:70%;
    margin-right:20px;
    height:auto;
  }
}
.el-checkbox+.el-checkbox{
    margin-left:0;
    margin-top:15px;
    width:50px;
}
</style>
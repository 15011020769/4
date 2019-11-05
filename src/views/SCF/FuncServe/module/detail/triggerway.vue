<template>
  <div class="triggerway">
    <div class="triggerbutton">
      <span class='triggerbuttonOne' @click="addtriggerWay" v-if="!addStatus">添加触发方式</span>
      <span class="triggerbuttonTwo" v-else>添加触发方式</span>
    </div>
    <div class="waylist" v-if="addStatus">
      <span style="font-weight:bolder;">添加触发方式</span>
      <el-form ref='primaryData' :model="primaryData" :rules="rules" :label-position="labelPosition" label-width="120px" class="formItemAdd" style="border-bottom: 1px solid #ccc;">
        <el-form-item prop="triggerway" >
          <span slot="label">触发方式<i class="el-icon-question" style="margin:0 3px;"></i></span>
          <el-select v-model="primaryData.search" placeholder="" size="mini">
            <el-option
              v-for="item in searchList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="taskname">
          <span slot="label">定时任务名称<i class="el-icon-question" style="margin:0 3px;"></i></span>
          <el-input v-model="primaryData.taskname" size="mini" style="width:210px;"></el-input>
        </el-form-item>
        <el-form-item prop="triggertime">
          <span slot="label">触发周期</span>
          <el-select v-model="primaryData.search" placeholder="" size="mini">
            <el-option
              v-for="item in timeList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="taskname">
          <span slot="label">填写入参<i class="el-icon-warning" style="margin:0 3px;"></i></span>
          <el-select v-model="primaryData.choice" placeholder="" size="mini">
            <el-option
              v-for="item in choiceList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="taskname">
          <span slot="label">立即启用</span>
          <el-checkbox v-model="checked"><span style="font-size:12px;">勾选后定时触发器将立即开启（于下个配置周期触发）</span></el-checkbox>
        </el-form-item>
      </el-form>
      <div style="margin-top:20px;">
        <el-button type="primary" size="mini" @click="close(1)">保存</el-button>
        <el-button size="mini" @click="close(2)">取消</el-button>
      </div>
    </div>
    <div>
      <div class="waylist" v-for="(item,index) in triggerWayItemList" :key="index">
        <span style="font-weight:bolder;">{{item.title}}</span>
        <span style="float:right;"><el-switch v-model="item.value3"></el-switch><i class="el-icon-delete" style="margin-left:10px;font-weight:bolder;"></i></span>
        <el-form ref='triggerWayItemList' :model="triggerWayItemList" :rules="rules" :label-position="labelPosition" label-width="120px" class="formItem">
          <el-form-item prop="triggerway" >
            <span slot="label">名称</span>
            <span>{{item.name}}</span>
          </el-form-item>
          <el-form-item prop="taskname">
            <span slot="label">触发器周期</span>
            <span>{{item.time}}</span>
          </el-form-item>
          <el-form-item prop="triggertime">
            <span slot="label">cron表达式</span>
            <span>{{item.expression}}</span>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      labelPosition: 'left',
      primaryData: {
        search: '',
        taskname: '',
        triggertime:''
      },
      searchList: [{
        value: '1',
        label: '全部语言'
      }, {
        value: '2',
        label: ''
      }],
      timeList: [{
        value: '1',
        label: '每1分钟（每分钟0秒执行一次）'
      },{
        value: '2',
        label: '每5分钟（每分钟0秒执行一次）'
      },{
        value: '3',
        label: '每10分钟（每分钟0秒执行一次）'
      },{
        value: '4',
        label: '每15分钟（每分钟0秒执行一次）'
      },{
        value: '5',
        label: '每20分钟（每分钟0秒执行一次）'
      }],
      choiceList: [{
        value: '1',
        label: '是'
      },{
        value: '2',
        label: '否'
      }],
      checked: false,
      addStatus: false,
      triggerWayItemList: [{
        title: '定时触发',
        name: 'sdsd',
        time: '每5分钟（每5分钟的0秒执行一次）',
        expression: '	0 */5 * * * * *',
        value3: true
      },{
        title: '定时触发1',
        name: 'sdsd1',
        time: '每15分钟（每5分钟的0秒执行一次）',
        expression: '	0 */5 * * * * *',
        value3: false
      }]
    };
  },
  mounted() {
  },
  components: {
  },
  methods: {
    addtriggerWay() {
      this.addStatus = true;
    },
    close(val) {
      this.addStatus = !this.addStatus;
      if(val==2) {
      }
    }
  }
};
</script>

<style scoped lang="scss">
  .triggerway {
    padding: 20px;
    background: #fff;
  }
  .triggerbutton {
    width: 100%;
    text-align: center;
    height: 60px;
    line-height: 60px;
    background: #fff;
    border: 1px solid #ccc;
    font-size: 12px; 
    color: #006eff;
  }
  .triggerbuttonOne:hover {
    border-bottom: 1px solid #006eff;
    cursor: pointer;
  }
  .triggerbuttonTwo {
    color: #ccc;
  }
  .waylist {
    margin-top: 20px;
    padding: 20px;
    border: 1px solid #ccc;
  }
</style>
<style>
  .formItem /deep/ .el-form-item__label {
    position: relative;
    font-size: 12px;
    color: #888;
  }
  .formItem /deep/ .el-form-item {
    margin-bottom: 0px;
  }
  .formItemAdd /deep/ .el-form-item {
    margin-bottom: 10px;
  }
</style>

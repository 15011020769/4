<template>
  <div>
    <p>
      <el-checkbox v-model="event.checkedGaojing" :checked="event.checkedGaojing">
        事件告警
        <!-- <i class="el-icon-info" style="color:#888; margin:0 5px;"></i> -->
      </el-checkbox>
    </p>
    <ul class="color">
      <li style="display:flex;align-items: center;cursor: pointer;" v-for="(item,i) in event.eventAry" :key="i">
        <p>
          <el-select :disabled="!event.checkedGaojing" v-model="item.EventId" style="width:180px;margin:0 5px;">
            <el-option
              v-for="item in event.eventType"
              :key="item.EventId"
              :label="item.EventShowName"
              :value="item.EventId"
              label-width="40px"
            ></el-option>
          </el-select>
        </p>
        <i class="el-icon-error" style="color:#888; margin:0 5px;"
          @click="delShijian(item)" v-if="event.eventAry.length>1"></i>
      </li>
      <a @click="addShijian" style="cursor:pointer">添加</a>
      <p style="color:red" v-if="event.IsEventRepeated">
        <i class="el-icon-info" style="color:#888; margin:0 5px;color:red"></i>
        請勿重複配置
      </p>
    </ul>
  </div>
</template>

<script>
export default {
  props:{
    eventData:{
      required: true,
      type: Object
    }
  },
  data(){
    return{
      event:this.eventData,
    }
  },
  watch:{
    event:{
      handler:function(val){
        this.$emit('update:eventData',val)
      },
      deep:true,
      immediate:true
    },
    eventData:{
      handler:function(val){
        this.event = val
      },
      deep:true,
      immediate:true
    },
    'event.eventAry':{
      handler:function(val){
        let ary = []
        val.forEach((ele,i)=>[
          !ary.some(item=>{
            return item.EventId === ele.EventId
          }) && ary.push(ele)
        ])
        if(val.length !== ary.length){
          this.event.IsEventRepeated = true
        }else{
          this.event.IsEventRepeated = false
        }
      },
      deep:true
    }
  },
  methods:{
    // 添加觸發條件的事件告警
    addShijian() {
      let { eventType,eventAry } = this.event
      for(let i = 0;i<eventType.length;i++){
        let msg = eventAry.some(item=>{
          return item.EventId === eventType[i].EventId
        })
        this.event.IsEventRepeated = msg
        if(!msg){
          eventAry.push({
            EventId:eventType[i].EventId,
            AlarmNotifyPeriod:0,
            AlarmNotifyType:0,
          });
          return
        }
      }
      eventAry.push({
        EventId:eventType[0].EventId,
        AlarmNotifyPeriod:0,
        AlarmNotifyType:0,
      });
    },
    // 刪除觸發條件的事件告警
    delShijian(item) {
      var index = this.event.eventAry.indexOf(item);
      if (index !== -1) {
        this.event.eventAry.splice(index, 1);
      }
    },
  }
}
</script>

<style scoped lang='scss'>
.color {
  border: 1px solid #ddd;
  font-size: 12px;
  padding: 10px;

  background-color: #f2f2f2;
  p {
    margin: 5px 0;
  }
}</style>
<template>
  <div class="persistenceSetting">
    <div class="back-hd flex">
      <router-link :to="'/warnings'">
        <i class="el-icon-back hd-icon-back"></i>
      </router-link>
      <h3>新建策略</h3>
    </div>
      <div class="tf-g app-tke-fe-content__inner">
        <div class="event-persistence font">
          <!-- 内容标题 -->
           <div class="flex padding">
            <div class='data-card-hd'>地域</div>
            <div class="data-card-list">北京</div>
          </div>
          <div class="flex padding">
            <div class='data-card-hd'>集群</div>
            <div class="data-card-list">(sssssssss)cls-kukvzoc1</div>
          </div>
          <div class="flex padding">
            <div class='data-card-hd'>告警策略名称</div>
            <div>
              <input type="text" placeholder="请输入告警策略名称">
              <div style="padding:10px 0 5px 0;">最长40个字符</div>
            </div>
          </div>
          <div class="flex padding">
            <div class='data-card-hd'>备注</div>
            <div>
              <textarea placeholder="请输入策略备注" name="" id="" cols="30" rows="10"></textarea>
            </div>
          </div>
          <div class="flex padding">
            <div class='data-card-hd' style="padding-top:5px;" >策略类型</div>
            <div>
              <el-select v-model="value" placeholder="请选择" >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>
<script>
import HeadCom from "@/components/public/Head";
export default {
  data(){
    return{
      value:'集群',
      options: [
        {
        value: '1',
        label: '集群'
        },
        {
        value: '2',
        label: '节点'
        },
        {
        value: '3',
        label: 'Pod'
        }
      ]
    }
  },
  props:["uid"],
  components: {
    HeadCom
  },
}
</script>
<style lang="scss" scoped>
.data-card-select {
  width: 999999px;
}
.back-hd {
  width: 100%;
  height: 51px;
  background: white;
  padding:15px;
  border-bottom: 1px solid #cccccc;
  font-size: 16px;
}
.hd-icon-back {
  font-weight: 900;
  font-size: 20px;
  color: #006eff;
  padding-right: 10px;
}
.log-div {
  display: inline-block;
  position: relative;
}
.log-input-red {
  border: 1px solid red;
  color:red;
}
.log-icon {
  position: absolute;
  top: 8px;
  right: 4px;
}
.log-input {
  width: 150px;
}
input {
  width: 200px;
  height: 28px;
  padding: 5px 10px;
  color: #eeeeee;
}
.tabs-size {
  width: 114px;
  height: 28px;
  font-size: 12px;
}
.active {
  width: 114px;
  height: 30px; 
  border: 1px solid #006eff;
  margin: auto;
  line-height: 30px;
}
.padding {
  padding:5px 0 5px 0;
}
.font-orange {
  color: #ff9d00;
}
.data-card-list {
  height: 28px;
  line-height: 28px;
}
.data-card-hd {
  width: 100px;
  height: 28px;
  line-height: 28px;
}
.flex {
  display: flex;
}
.font {
  font-size: 12px;
  color: #888888;
}
.app-tke-fe-content__inner {
  padding-top: 20px;
  max-width: 1360px;
  margin:0 auto;
}
.tf-g {
  font-size: 0;
  margin-bottom: 50px;
  // background: pink;
}
.event-persistence {
  padding: 20px;
  background: white;
  box-shadow: 0 1px 3px 0 rgba(0,0,0,.1);
}
</style>
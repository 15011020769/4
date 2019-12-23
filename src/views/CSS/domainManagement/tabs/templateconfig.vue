<template>
  <div>
    <div class="newClear">
      <div class="leftFloat">
        <div class="modileCon">
          <h1>回调配置<a @click="callBackEdit">编辑</a></h1>
          <div>
            <el-table
              :data="callbackconfigData">
              <el-table-column prop="date" label="模板名称"></el-table-column>
              <el-table-column prop="name" label="模板ID"></el-table-column>
              <el-table-column prop="address" label="回调地址"></el-table-column>
            </el-table>
          </div>
        </div>
        <div class="modileCon">
          <h1>截图&鉴黄配置<a @click="ScreenshotEdit">编辑</a></h1>
          <div>
            <el-table
              :data="ScreenshotData">
              <el-table-column prop="date" label="模板名称"></el-table-column>
              <el-table-column prop="name" label="模板ID"></el-table-column>
              <el-table-column prop="address" label="截图间隔(秒)"></el-table-column>
              <el-table-column prop="address" label="只能鉴黄"></el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <div class="rightFloat">
        <div class="modileCon">
          <h1>录制配置<a @click="recordconfigEdit">编辑</a></h1>
          <div>
            <el-table
              :data="recordingconfigData">
              <el-table-column prop="date" label="模板名称"></el-table-column>
              <el-table-column prop="name" label="模板ID"></el-table-column>
              <el-table-column prop="address" label="录制格式"></el-table-column>
            </el-table>
          </div>
        </div>
        <div class="modileCon">
          <h1>水印配置<a @click="waterEdit">编辑</a></h1>
          <div>
            <el-table
              :data="watermarkconfigData">
              <el-table-column prop="date" label="模板名称"></el-table-column>
              <el-table-column prop="name" label="模板ID"></el-table-column>
              <el-table-column prop="address" label="水印位置"></el-table-column>
              <el-table-column prop="address" label="操作">
                <template>
                  <a href="#">预览</a>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <callbackconfigDataModel :isShow="callBackModel" @closeModel="closeModel"/>
      <ScreenshotdataModel :isShow="ScreenshotModel" @closeScreenshotModel="closeScreenshotModel"/>
      <recordconfigModel :isShow="recordconfigModel" @closeRecordModel="closeRecordModel"/>
      <watermarkconfigmode :isShow="watermarkconfigmode" @closeWaterModel="closeWaterModel"/>
    </div>
  </div>
</template>
<script>
import callbackconfigDataModel from '../model/callbackconfigDataModel'
import ScreenshotdataModel from '../model/ScreenshotdataModel'
import recordconfigModel from '../model/recordconfigModel'
import watermarkconfigmode from '../model/watermarkconfigmode'
export default {
  data(){
    return{
      callbackconfigData:[],//回调配置table
      ScreenshotData:[],//截图&鉴黄配置
      recordingconfigData:[],//录制配置
      watermarkconfigData:[],//水印配置
      callBackModel:false,//回调配置弹框
      ScreenshotModel:false,//截图鉴黄配置弹框
      recordconfigModel:false,//录制配置弹框
      watermarkconfigmode:false,//水印配置弹框
    }
  },
  components:{
    callbackconfigDataModel:callbackconfigDataModel,
    ScreenshotdataModel:ScreenshotdataModel,
    recordconfigModel:recordconfigModel,
    watermarkconfigmode:watermarkconfigmode
  },
  methods:{
    //回调配置编辑
    callBackEdit(){
      this.callBackModel=true;
    },
    //关闭弹框
    closeModel(isShow){
      this.callBackModel=isShow;
    },
    //截图鉴黄配置编辑
    ScreenshotEdit(){
      this.ScreenshotModel=true;
    },
    closeScreenshotModel(isShow){
      this.ScreenshotModel=isShow;
    },
    //录制配置编辑按钮
    recordconfigEdit(){
      this.recordconfigModel=true;
    },
    //关闭
    closeRecordModel(isShow){
      this.recordconfigModel=isShow;
    },
    //水印配置编辑
    waterEdit(){
      this.watermarkconfigmode=true;
    },
    //关闭
    closeWaterModel(isShow){
      this.watermarkconfigmode=isShow;
    }
  }
}
</script>
<style lang="scss" scoped>
.newClear:after{
  content:'';
  display: block;
  clear:both;
}
.leftFloat{
  float:left;
  width:50%;
  padding-right:10px;
}
.rightFloat{
  float:left;
  padding-left:10px;
  width:50%;
}
.modileCon{
  width:100%;
  padding:20px;
  background-color: #fff;
  box-shadow: 0 2px 3px 0 rgba(0,0,0,.2);
  min-height:100px;
  margin-bottom:20px;
  h1{
    font-size:14px;
    color:#000;
    font-weight: 600;
    a{
      float:right;
      font-size:12px;
      font-weight: 100;
      margin-bottom:12px;
    }
  }
}
</style>
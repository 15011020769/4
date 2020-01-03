<template>
  <div class="persistence-wrap">
    <div class="back-hd flex">
      <h2>事件持久化</h2>
      <div style="width:20px"></div>
      <el-button  type="primary" class="init hd-button">中国台北</el-button>
    </div>
    <div class="app-tke-fe-content__inner">
      <div class="tf-g">
        <!-- 搜索框 -->
        <div class="flex" style="justify-content: flex-end;  position: relative;">
          <input type="search" placeholder="请输入集群名称" class="search">
          <button class="el-icon-search ip-btn"></button>
        </div>
        <!-- 内容 -->
        <div class="event-persistence">
          <div class="ep-data-card-main" style="padding-top:5px;">
            <el-row>
              <el-col :span="4"><div class="font">ID/名称</div></el-col>
              <el-col :span="4"><div class="font">状态</div></el-col>
              <el-col :span="4"><div class="font">存储端</div></el-col>
              <el-col :span="8"><div class="font">存储对象</div></el-col>
              <el-col :span="4"><div class="font">操作</div></el-col>
            </el-row>
          </div>
          <!-- 数据绑定 -->
          <div class="ep-data-card-main font" style="text-align:center;">
            您选择的改区域的集群列表为空，您可以
            <a href="">[新建一个集群]</a>，或切换到其他地域
          </div>
          <div class="ep-data-card-main" style="padding-top:20px;">
            <el-row>
              <el-col :span="4"><div class="font">
                  <a href="javascript:;">cls-kukvzoc1</a>
                  <div>ssssss</div>
                </div></el-col>
              <el-col :span="4"><div class="font center">未开启</div></el-col>
              <el-col :span="4"><div class="font center">-</div></el-col>
              <el-col :span="8"><div class="font center">-</div></el-col>
              <el-col :span="4"><div class="font center">
                <router-link :to="'/persistenceSetting/'+uid">
                  <span>设置</span>
                </router-link>
                </div></el-col>
            </el-row>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HeadCom from "@/components/public/Head";
export default {
  name:'persistence',
  data(){
    return{}
  },
  components: {
    HeadCom
  },
}
</script>

<style lang="scss" scoped>
.hd-button {
  width: 80px;
  height: 22px;
  padding-left: 30px;
}
.back-hd {
  width: 100%;
  height: 51px;
  background: white;
  padding:15px;
  border-bottom: 1px solid #cccccc;
  font-size: 12px;
}
.init{
  padding: 0;
  margin: 0;
}
.show {
  display: block;
}
.hide {
  display: none;
}
.center {
  padding-top: 6px;
}
.ep-data-card-main {
  padding: 20px 0 20px 0;
  border-bottom: 1px solid #cccccc;
}
.ep-data-card-hd {
  width: 50px;
  height: 30px;
}
.font {
  font-size: 12px;
}
.flex {
  display: flex;
}
.search {
  width: 200px;
  height: 30px;
  margin: 20px 0 20px 0;
  font-size: 12px;
  padding-left: 5px;
  border: 1px solid #cccccc;
}
.ip-btn {
  font-size: 12px;
  width: 30px;
  height: 30px;
  background: none;
  border:none;
  position: absolute;
  z-index: 1;
  top: 20px;
}
.app-tke-fe-content__inner {
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
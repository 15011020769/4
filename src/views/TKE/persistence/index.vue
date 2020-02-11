<template>
  <div class="persistence-wrap" v-loading='funllscreenLoading'>
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
      <el-table
      :data="tableData"
      style="width: 100%">
        <el-table-column
          prop="date"
          label="ID/名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="name"
          label="状态"
          width="180">
        </el-table-column>
        <el-table-column
          prop="address"
          label="存储端">
        </el-table-column>
           <el-table-column
          prop="date"
          label="存储对象"
          width="180">
        </el-table-column>
        <el-table-column
          label="操作">
           <template slot-scope="scope">
              <el-button @click="handleClick(scope.row)" type="text" size="small">设置</el-button>
            </template>
        </el-table-column>
    </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import {
  CreateListGroups,
  WARNING_GetCOLONY,
  WARNING_GetUSER
} from "@/constants";
import HeadCom from "@/components/public/Head";
export default {
  name:'persistence',
  data(){
    return{
      list: [],
      funllscreenLoading:false,
      tableData:[]
    }
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      this.funllscreenLoading = true;
      let params = {
        Version: "2018-05-25"
      }
      const res = this.axios.post(WARNING_GetUSER,params).then(res=>{
        console.log(res);
        this.funllscreenLoading = false;
      });
    }
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
  margin: 20px 0 10px 0;
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
  padding:20px;
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
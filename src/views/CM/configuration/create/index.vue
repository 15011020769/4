<template>
  <div class="create-wrap">
    <Header title="新增配置项"></Header>
    <div class="create-main">
      <div class="box">
        <div class="city">
          <span>地域</span>
          <el-select v-model="values" placeholder="请选择">
                <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                >
                </el-option>
            </el-select>
        </div>
        <div class="namespace">
          <span>命名空间</span>
          <el-input v-model="input" placeholder="请输入命名空间"></el-input>
        </div>
        <div class="dimension">
          <span>维度</span>
          <el-input v-model="input1" placeholder="请输入维度"></el-input>
        </div>
        <div class="montingindex">
          <span>监控指标</span>
          <p>同命名空间和维度下，监控指标不能重复。每个用户最多设置50个指标</p>
          <div class="table">
            <el-table :data="tableData" style="width: 80%;margin:0 auto;border:1px solid #ccc;">
              <el-table-column prop="date" label="监控指标" width="270"></el-table-column>
              <el-table-column prop="name" label="指标中文名" width="250"></el-table-column>
              <el-table-column prop="address" label="单位" width="250"></el-table-column>
              <el-table-column prop="address" label="操作"></el-table-column>
            </el-table>
          </div>
        </div>
        <div class="foot">
          <el-button type="primary" size="small" @click="save">确定</el-button>
          <el-button  size="small" @click="cancel">取消</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Header from "@/components/public/Head";
export default {
  data() {
    return {
      input: "",
      input1: "",
      tableData: [],
      options:[],
      values:"",
    };
  },
  components: {
    Header
  },
  methods: {
      //确定
        save(){
            this.$router.push({
                path:"/configuration",
                // name:"configuration",
                // component:()=>
                // import('../../configuration'),
                // meta:{
                // keepAlive:true
                // }
            })
        },
        //取消
        cancel(){
            this.$router.push({
                path:"/configuration",
                // name:"configuration",
                // component:()=>
                // import('../../configuration'),
                // meta:{
                // keepAlive:true
                // }
            })
        }
  }
};
</script>
<style lang="scss" scoped>
.create-main {
  padding: 20px 35px;
}
.box {
  width: 100%;
  height: 100%;
  color: #9c9c9c;
  background: white;
  > div {
    margin-top: 20px;
    span {
      display: inline-block;
      width: 80px;
      margin-left: 15px;
    }
  }
  .montingindex{
      border-bottom:1px solid #ccc;
      padding-bottom: 20px;
  }
  .montingindex p {
    display: inline-block;
    margin-left: 20px;
  }
  .table{
      margin-top:20px;
  }
  .foot{
      margin:10px;
  }
}
.box >>> .el-input {
  width: 200px;
  height: 30px;
  margin-left: 20px;
}

</style>
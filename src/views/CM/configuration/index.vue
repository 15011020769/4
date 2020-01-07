<template>
  <div class="product-wrap">
    <Header title="监控配置">
      <el-select v-model="values" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          >
        </el-option>
      </el-select>
    </Header>
    <div class="product-main">
      <div class="explain" style="margin-bottom:20px;">
        <p>
          新版自定义监控以灰度上线，目前处于内侧阶段，如需使用可<a href="">申请内侧体验</a>
        </p>
        <p>
          若在使用过程中遇到任何问题，您可以通过加入自定义监控交流QQ群（793979710），我们将竭诚为您服务!
        </p>
      </div>
      <div class="box">
        <div class="table_top">
          <div class="type_data">
            <el-button  type="primary"  @click="newbtn" style="line-height:30px;">+新增配置项</el-button>
          </div>
         
          <div class="icons"> 
            <div class="writeput">
                <el-input v-model="input" placeholder="请输入实例组名搜索"></el-input>
                <el-button icon="el-icon-search" style="margin-left:-1px;"></el-button>     
            </div>
                <i class="el-icon-setting" @click="setup"></i>
          </div>
        </div>
        <div class="table">
          <el-table :data="tableData" style="width: 100%" height="450">
            <el-table-column prop="namespace" label="命名空间"></el-table-column>
            <el-table-column prop="index" label="指标"></el-table-column>
            <el-table-column prop="dimension" label="维度" ></el-table-column>
            <el-table-column prop="method" label="统计方式" ></el-table-column>
            <el-table-column prop="operation" label="操作"> <a @click="montior">监控</a> <a @click="administration">管理</a> <a @click="delet">删除</a> </el-table-column>
          </el-table>

          <!-- 分页 -->
          <div class="Right-style pagstyle">
            <span class="pagtotal">共&nbsp;{{TotalCount}}&nbsp;{{$t("CVM.strip")}}</span>
            <el-pagination
              :page-size="pagesize"
              :pager-count="7"
              layout="prev, pager, next"
              @current-change="handleCurrentChange"
              :total="TotalCount"
            ></el-pagination>
          </div>
        </div>
      </div>
    </div>
      <Custom :dialogVisible="dialogVisible" @cancel="cancel" @save="save"/>
  </div>
</template>

<script>
import Header from "@/components/public/Head";
import Custom from "./custom/custom"
export default {
  name: "product",
  data() {
    return {
      activeName: "first",
      value: 1,
      dialogVisible: false, //新增配置弹框
      input: "", //搜索框的值
      tableData: [
        {
          namespace:"test1",
          index:"qq",
          dimension:"1,2,3",
          method:"已配置",
        },
      ],
      //分页
      TotalCount: 0, //总条数
      pagesize: 10, // 分页条数
      currpage: 1, // 当前页码
      //city选择
      options:[],
      values:"",
    };
  },
  components: {
    Header,
    Custom
  },
  methods: {
    //获取数据
    GetDat(data) {
      console.log(data);
    },
     //分页
    handleCurrentChange(val) {
      this.currpage = val;
    },
    //新增配置项
    newbtn(){
      this.$router.push({
        path:"/configuration/create",//      新增配置项
      })
      // console.log("点击")
    },
    //取消
    cancel(){
      this.dialogVisible = false;
    },
    //确定
    save(){
      this.dialogVisible = false;
    },
    //icon自定义按钮
    setup(){
      this.dialogVisible = true;
    },
    //监控
    montior(){
      this.$router.push( {
        path:"/configuration/montior",//     监控页面
      },
      )
    },
    //管理
    administration(){
      this.$router.push( {
        path:"/configuration/administration",//     管理页面
      },
      )
    },
    //删除
    delet(){
      console.log('删除')
    },
    
  },
};
</script>

<style lang="scss" scoped>
.product-wrap > header {
  width: 100%;
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 17px 20px;
  position: relative;
  p:first-child {
    font-size: 16px;
    font-weight: 600;
    a {
      color: #000;
    }
  }
}
.product-wrap >>> .el-select{
    margin-left:20px;
    border:0px;
}
.product-wrap >>> .el-button,
.product-wrap >>> .el-input__inner {
  height: 30px;
  border-radius: 0;
  padding-top: 0;
  line-height: 30px;
  font-size: 12px;
}
.product-main {
  padding: 20px;
}
.box {
  width: 100%;
  .table_top{
    width:100%;
    margin:15px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .icons {
      display: flex;
      align-items: center;
      >i{
        font-size: 16px;
      }
      .writeput{
          width: 240px;
          display: flex;
          margin-right:20px;
      }
    }
  }
  .table {
    width: 100%;
    background: white;
    box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.32);
    a{
      display: inline-block;
      margin:0 5px;
    }
    a:hover{
    cursor: pointer;
    }
  }
}
.explain {
  padding: 10px 30px 10px 20px;
  vertical-align: middle;
  color: #c07400;
  border:1px solid  #ffd18b;
  background: #fff4e3;
  p {
    font-size: 11px;
    line-height: 18px;
  }
}
.Right-style {
  display: flex;
  justify-content: flex-end;

  .esach-inputL {
    width: 300px;
    margin-right: 20px;
  }
}
.pagstyle {
  padding: 20px;
  .pagtotal {
    font-size: 13px;
    font-weight: 400;
    color: #565656;
    line-height: 32px;
  }
}
</style>  
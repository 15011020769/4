<template>
  <div class="product-wrap">
    <Header title="监控配置">
      <!-- <p>产品事件</p> -->
    </Header>
    <div class="product-main">
      <div class="explain" style="margin-bottom:20px;">
        <p>
          新版自定义监控以灰度上线，目前处于内侧阶段，如需使用可<a href="">申请内侧体验</a>。
        </p>
        <p>
          若在使用过程中遇到任何问题，您可以通过加入自定义监控交流QQ群（793979710），我们将竭诚为您服务!
        </p>
      </div>
      <div class="box">
        <div class="table_top">
          <div class="type_data">
            <el-button  type="primary">+新增配置项</el-button>
          </div>
         
          <div class="icons"> 
            <div class="writeput">
                <input type="text" placeholder="请输入关键字">
                <i class="el-icon-search"></i>              
            </div>
                <i class="el-icon-setting"></i>
          </div>
        </div>
        <div class="table">
          <el-table :data="tableData" style="width: 100%" height="450">
            <el-table-column prop="namespace" label="命名空间"></el-table-column>
            <el-table-column prop="index" label="指标"></el-table-column>
            <el-table-column prop="dimension" label="维度" ></el-table-column>
            <el-table-column prop="method" label="统计方式" ></el-table-column>
            <el-table-column prop="operation" label="操作"></el-table-column>
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
  </div>
</template>

<script>
import Header from "@/components/public/Head";

export default {
  name: "product",
  data() {
    return {
      activeName: "first",
      value: 1,
      dialogVisible: false, //购买短信弹出框
      input: "", //搜索框的值
      tableData: [
        {
          namespace: 'test1',
          index: 'aa',
          dimension: '1,2,3',
          method:"已配置",
          operation:"监控 管理 删除",
        },{
           namespace: 'test2',
          index: 'bb',
          dimension: '4,5,6',
          method:"已配置",
          operation:"监控 管理 删除",
        }
      ],
      //分页
      TotalCount: 0, //总条数
      pagesize: 10, // 分页条数
      currpage: 1 // 当前页码
    };
  },
  components: {
    Header
  }
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
  p:first-child {
    font-size: 16px;
    font-weight: 600;
    a {
      color: #000;
    }
  }
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
           input{
            font-size: 15px;
            padding: 5px;
            margin-right:10px;
          }
          >i{
             font-size: 16px;
            margin-left:-30px;
          }
        }
       
        
      }
  }
  
  .table {
    width: 100%;
    background: white;
    box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.32);
  }
}
.explain {
  padding: 10px 30px 10px 20px;
  vertical-align: middle;
  color: #003b80;
  border: 1px solid #97c7ff;
  background: pink;
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
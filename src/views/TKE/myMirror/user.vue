<template>
  <div class="room">
    <div class="room-top">
      <div class="top-left">
        <el-button type="primary" size="mini" class="botton-size">新建</el-button>
        <el-button disabled size="mini" class="botton-size">删除</el-button>
        <el-button size="mini" class="botton-size">重置密码</el-button>
        <el-button size="mini" class="botton-size">源代码授权</el-button>
      </div>
      <div class="top-right">
        <el-input
          placeholder="请输入镜像名称"
          suffix-icon="el-icon-search"
          v-model="input"
          class="search-input"
        ></el-input>
      </div>
    </div>
    <div class="room-center">
      <div class="explain" style="margin-bottom:20px;">
        <p>
          当前默认地域内镜像仓库暂不支持海外集群通过内网访问，请配置公网进行访问，或使用与集群位于相同地域的镜像仓库
        </p>
      </div>
    </div>
    <div class="room-bottom">
       <el-table :data="tableData" style="width: 100%" height="450">
           <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="address" label="名称"></el-table-column>
            <el-table-column prop="address" label="类型"></el-table-column>
            <el-table-column prop="address" label="命名空间"></el-table-column>
            <el-table-column prop="address" label="镜像地址"></el-table-column>
            <el-table-column prop="address" label="创建时间"></el-table-column>
            <el-table-column prop="address" label="操作">
              <template slot-scope="scope">
                <el-button @click="handleClick(scope.row)" type="text" size="small">删除</el-button>
                <el-button type="text" size="small">构建配置</el-button>
            </template>
            </el-table-column>
        </el-table>
        <div class="Right-style pagstyle">
            <span class="pagtotal">共&nbsp;{{TotalCount}}&nbsp;页</span>
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
</template>
<script>
export default {
  data () {
    return {
      input: '',
      tableData: [{
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }
      ],
      TotalCount: 0, // 总条数
      pagesize: 10, // 分页条数
      currpage: 1 // 当前页码
    }
  },
  methods: {
    handleClick (row) {
      console.log(row)
    },
    // 分页
    handleCurrentChange (val) {
      this.currpage = val
    }
  }

}
</script>
<style lang="scss" scoped>
.room {
  position: absolute;
  left: 40px;
  top: 40px;
  width: 1069px;
  height: auto;
}
.room-top {
  width: 1069px;
  height: 30px;
}
.top-left {
  float: left;
  height: 30px;
}
.top-right {
  float: right;
  height: 30px;
}
.botton-size {
  text-align: center;
  margin-right: 10px;
  height: 30px;
}
.search-input {
  width: 180px;
  height: 28px;
}
.room-center{
    margin-top:20px;
    .explain {
        padding: 10px 30px 10px 20px;
        vertical-align: middle;
        color: #003b80;
        border: 1px solid #97c7ff;
        background: #e5f0ff;
            p {
                font-size: 11px;
                line-height: 18px;
            }
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

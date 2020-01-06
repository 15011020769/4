<template>
  <div class="DockerHub-wrap">
    <HeadCom title="Docker Hub镜像"></HeadCom>
    <div class="body">
      <div class="room">
        <div class="room-top">
          <div class="context-center">
            <p>来自<a href="https://hub.docker.com/" target="_blank">hub.docker.com</a>的镜像</p>
            <div>
              <el-input placeholder="请输入内容" v-model="input" class="input-with-select">
                <el-button slot="append" icon="el-icon-search" class="btn-search"></el-button>
              </el-input>
            </div>
          </div>
        </div>
        <div class="room-bottom">
          <el-table
            :data="tableData"
            style="width: 100%"
            height="450"
          >
            <!-- 自定义样式 -->
            <el-table-column  align="center" width="40">
              <template>
                <el-tooltip class="item" effect="light" content="收藏" placement="left">
                  <i class="el-icon-star-off" ></i>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="address" label="名称"></el-table-column>
            <el-table-column prop label="" >
              <template slot-scope="scope">
                <p>
                  <a style="cursor:pointer;" @click="jump()">跳转</a>
                </p>
              </template>
            </el-table-column>
            <el-table-column prop="address" label="类型" ></el-table-column>
            <el-table-column prop="address" label="收藏量"></el-table-column>
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
    </div>
  </div>
</template>
<script>
import HeadCom from '@/components/public/Head'
export default {
  name: 'myFavorite',
  components: {
    HeadCom
  },
  data () {
    return {
      input: '',
      tableData: [
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }
      ],
      TotalCount: 0, // 总条数
      pagesize: 10, // 分页条数
      currpage: 1, // 当前页码
      multipleSelection: ''
    }
  },
  methods: {
    handleClick (row) {
      console.log(row)
    },
    // 分页
    handleCurrentChange (val) {
      this.currpage = val
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
      console.log(this.multipleSelection)
    },
    jump () {
      this.$router.push({
        name: 'DockerHubDetailInfo',
        query: {
          id: 1
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.body {
  position: relative;
}
.room {
  position: absolute;
  left: 20px;
  top: 20px;
  width: 95%;
  height: auto;
}
.room-top {
  height: 30px;
  display:flex;
  justify-content:center;
  .context-center{
    height: 100px;
    width: 480px;
    font-size: 14px;
  }
}
.room-bottom {
  background: white;
  margin-top:100px;
}
.top-left {
  height: 30px;
  display: flex;
  justify-content: space-between;
}
.top-right {
  height: 30px;
  display: flex;
  justify-content: space-between;
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
.room-center {
  margin-top: 20px;
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
  margin-bottom: 20px;
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
i{
  cursor: pointer;
}
// .el-icon-star-off{
//   color: #97c7ff
// }
.el-icon-download{
  font-size: 15px;
  color: #666;
  margin-left: 5px;
  cursor: pointer;
  padding: 5px;
  box-sizing: border-box;
  &:hover {
    background: #f2f2f2;
  }
}
.box {
    width: 400px;
    .top {
      text-align: center;
    }
    .left {
      float: left;
      width: 60px;
    }
    .right {
      float: right;
      width: 60px;
    }
    .bottom {
      clear: both;
      text-align: center;
    }
    .item {
      margin: 4px;
    }
    .left .el-tooltip__popper,
    .right .el-tooltip__popper {
      padding: 8px 10px;
    }
  }
  .btn-search{
    background:#2177D9!important;
    color:#fff!important;
  }
</style>

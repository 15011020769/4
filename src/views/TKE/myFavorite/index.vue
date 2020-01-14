<template>
  <div class="myFavorite-wrap">
    <HeadCom title="我的收藏"></HeadCom>
    <div class="body">
      <div class="room">
        <div class="room-top">
          <div class="top-left">
            <el-button :disabled="this.multipleSelection.length?false:true" size="mini" class="botton-size">取消收藏</el-button>
          </div>
          <div class="top-right">
              <el-input v-model.trim="input" placeholder="请输入镜像名称" size="mini" ></el-input>
              <el-button icon="el-icon-search" size="mini" style="margin-left:-1px;height:28px;" :plain="true" @click="getSearch()"></el-button>
              <i class="el-icon-download"></i>
          </div>
        </div>
        <div class="room-bottom">
          <el-table
            :data="tableData"
            style="width: 100%"
            height="450"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="address" label="名称"></el-table-column>
            <el-table-column prop="address" label="类型"></el-table-column>
            <el-table-column prop="address" label="地域"></el-table-column>
            <el-table-column prop="address" label="收藏量"></el-table-column>
            <el-table-column prop="address" label="操作">
              <template slot-scope="scope">
                <el-button @click="handleClick(scope.row)" type="text" size="small">取消收藏</el-button>
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
    </div>
  </div>
</template>
<script>
import HeadCom from '@/components/public/Head'
import { GETFAVOR } from '@/constants'
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
      multipleSelection: []
    }
  },
  created () {
    this.GetFavor()
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
    GetFavor () {
      const param = {
        reponame: '',
        offset: 0,
        limit: 10
      }
      this.axios.post(GETFAVOR, param).then(res => {
        console.log(res)
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
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.room-bottom {
  background: white;
}
.top-left {
  height: 30px;
  display: flex;
  justify-content: space-between;
}
.top-right {
  width:240px;
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
i {
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
</style>

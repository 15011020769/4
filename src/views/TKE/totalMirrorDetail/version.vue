<template>
    <div class="room">
        <div  class="room-table">
            <el-table
                :data="tableData"
                style="width: 100%"
                v-loading="loadShow"
                >
                <el-table-column
                    prop="tagName"
                    label="镜像版本"
                    min-width="15%">
                </el-table-column>
                <el-table-column
                    prop="pushTime"
                    label="创建时间"
                    min-width="30%"
                    :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column
                    prop="tagId"
                    label="镜像ID（SHA256）"
                    min-width="40%"
                    :show-overflow-tooltip="true">
                </el-table-column>
                 <el-table-column
                    prop="size"
                    label="大小"
                    min-width="15%">
                </el-table-column>
            </el-table>
            <div class="Right-style pagstyle">
              <span class="pagtotal">共&nbsp;{{TotalCount}}&nbsp;条</span>
              <el-pagination
                :page-size="pagesize"
                layout="prev, pager, next"
                :current-page.sync="currpage"
                @current-change="handleCurrentChange"
                :total="TotalCount"
              ></el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
import { GET_TAGLIST } from '@/constants'
export default {
  data () {
    return {
      tableData: [],
      TotalCount: 0, // 总条数
      pagesize: 20, // 分页条数
      currpage: 1, // 当前页码
      loadShow: true
    }
  },
  created () {
    this.GetTagList()
  },
  methods: {
    handleCurrentChange (val) {
      this.currpage = val
      this.GetMyMirror()
      this.loadShow = true
    },
    GetTagList () { // 获取镜像版本
      const param = {
        reponame: this.$route.query.id
      }
      this.axios.post(GET_TAGLIST, param).then(res => {
        console.log(res)
        if (res.code === 0) {
          this.tableData = res.data.tagInfo
          this.TotalCount = res.data.tagCount
          this.loadShow = false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
    .room{
       width: 100%;
       padding:20px;
        height:auto;
    }
    .room-table{
        background: white;
    }
    .Right-style {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 20px;
      align-items:center;
      height:60px;
      .esach-inputL {
        width: 300px;
        margin-right: 20px;
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
}
</style>

<template>
    <div class="room">
        <div  class="room-table">
            <el-table
                :data="tableData"
                style="width: 100%"
                >
                <el-table-column
                    prop="date"
                    label="镜像版本"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="创建时间"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="address"
                    label="镜像ID（SHA256）">
                </el-table-column>
                 <el-table-column
                    prop="address"
                    label="大小">
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
export default {
  data () {
    return {
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }]
    }
  }
}
</script>
<style lang="scss" scoped>
    .room{
       position: relative;
       width: 100%;
    }
    .room-table{
        position: absolute;
        width: 95%;
        top:40px;
        left:10px;
    }
</style>

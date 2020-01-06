<template>
  <div class="room">
    <div class="room-top">
      <div class="top-left">
        <el-button type="primary" size="mini" class="botton-size" @click="dialogVisible = true">新建</el-button>
      </div>
      <div class="top-right">
          <el-input v-model="input" placeholder="请输入名称" size="mini"></el-input>
          <el-button icon="el-icon-search" size="mini" style="margin-left:-1px;height:28px;"></el-button>
      </div>
    </div>
    <div class="room-bottom">
       <el-table :data="tableData" style="width: 100%" height="450"  >
            <el-table-column prop="address" label="命名空间"></el-table-column>
            <el-table-column prop="address" label="仓库数目" ></el-table-column>
            <el-table-column prop="address" label="创建时间"></el-table-column>
            <el-table-column prop="address" label="操作" >
              <template slot-scope="scope">
                <el-button @click="handleClick(scope.row)" type="text" size="small">删除</el-button>
            </template>
            </el-table-column>
        </el-table>
        <div class="Right-style pagstyle">
            <span class="pagtotal">共&nbsp;{{TotalCount}}&nbsp;条</span>
            <el-pagination
              :page-size="pagesize"
              :pager-count="7"
              layout="prev, pager, next"
              @current-change="handleCurrentChange"
              :total="TotalCount"
            ></el-pagination>
        </div>
    </div>
    <el-dialog
      title="新建命名空间"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="名称:" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
          <p  class="form-p">最长30个字符，只能包含小写字母、数字及分隔符("."、"_"、"-")，且不能以分隔符开头、结尾或连续</p>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
// import { CGI_LIST } from '@/constants'
export default {
  data () {
    return {
      input: '',
      tableData: [{
        date: '201z6-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }
      ],
      ruleForm: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      TotalCount: 0, // 总条数
      pagesize: 10, // 分页条数
      currpage: 1, // 当前页码
      multipleSelection: '',
      dialogVisible: false,
      rules: {
        name: [
          { required: true, message: '请输入命名空间名称', trigger: 'blur' },
          { max: 30, message: '命名空间不能超过30个字符', trigger: 'blur' }
        ]
      }
    }
  },
  // created () {
  //   this.GetMyMirrorData()
  // },
  methods: {
    handleClick (row) {
      console.log(row)
    },
    // 分页
    handleCurrentChange (val) {
      this.currpage = val
    },
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    }
  }

}
</script>
<style lang="scss" scoped>
.room {
  position: absolute;
  left: 20px;
  top: 40px;
  width: 95%;
  height: auto;
}
.room-top {
  height: 30px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.top-left {
  height: 30px;
  display: flex;
  justify-content: space-between;
}
.top-right {
  width:240px;
  display: flex;
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
  .room-bottom{
    background: white;
  }
  .form-p{
  font-size: 12px;
  line-height: 1.8;
  color: #bbb;
}
</style>

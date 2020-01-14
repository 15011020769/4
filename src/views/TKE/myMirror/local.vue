<template>
  <div class="room">
    <div class="room-top">
      <div class="top-left">
        <el-button type="primary" size="mini" class="botton-size" @click="dialogVisible = true">新建</el-button>
      </div>
      <div class="top-right">
          <el-input v-model.trim="input" placeholder="请输入名称" size="mini" ></el-input>
          <el-button icon="el-icon-search" size="mini" style="margin-left:-1px;height:28px;" :plain="true" @click="getSearch()"></el-button>
      </div>
    </div>
    <div class="room-bottom">
       <el-table :data="tableData" style="width: 100%" height="450" v-loading="loadShow">
            <el-table-column prop="namespace" label="命名空间"></el-table-column>
            <el-table-column prop="repoCount" label="仓库数目" ></el-table-column>
            <el-table-column prop="creationTime" label="创建时间"></el-table-column>
            <el-table-column prop="repoCount" label="操作" >
              <template slot-scope="scope">
                <el-button @click="handleClick(scope.row)" type="text" size="small"  :disabled="scope.row.repoCount ? true:false">删除</el-button>
              </template>
            </el-table-column>
        </el-table>
        <div class="Right-style pagstyle">
            <span class="pagtotal">共&nbsp;{{TotalCount}}&nbsp;条</span>
            <el-pagination
              :page-size="pagesize"
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
           <!-- @blur="getExist()" -->
          <el-input v-model="ruleForm.name" size="mini" style="width:40%;"></el-input>
          <p  class="form-p">最长30个字符，只能包含小写字母、数字及分隔符("."、"_"、"-")，且不能以分隔符开头、结尾或连续</p>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
        <el-button @click="getClose()">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { SPACENAME_LIST, SPACENAME_DELETE, SPACENAME_PRESENCE, CREATE_SPACENAME } from '@/constants'
export default {
  data () {
    var validatePass = (rule, value, callback) => {
      // 获取命名空间是否存在的接口
      const param = {
        namespace: this.ruleForm.name
      }
      this.axios.post(SPACENAME_PRESENCE, param).then(res => {
        console.log(res)
        if (res.code === 0 && res.data.isExist) {
          callback(new Error('命名空间已存在'))
        } else {
          callback()
        }
      })
    }
    return {
      input: '',
      loadShow: true, // 加载是否显示
      namespace: '',
      repoCount: Number,
      tableData: [],
      namespaceCount: Number,
      ruleForm: {
        name: ''
      },
      TotalCount: 0, // 总条数
      pagesize: 20, // 分页条数
      currpage: 1, // 当前页码
      multipleSelection: '',
      dialogVisible: false,
      rules: {
        name: [
          { required: true, message: '请输入命名空间名称', trigger: 'blur' },
          { min: 4, message: '命名空间不能少于4个字符', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.GetSpaceName()
  },
  // watch: {
  //   isExist (val) {
  //     this.isExist = val
  //   },
  //   immediate: true
  // },
  methods: {
    handleClick (row) {
      this.namespace = row.namespace
      this.repoCount = row.repoCount
      this.DeleteSpaceName()
    },
    // 分页
    handleCurrentChange (val) {
      this.currpage = val
      this.GetSpaceName()
      this.loadShow = true
    },
    getClose () {
      this.dialogVisible = false
      this.$refs.ruleForm.clearValidate()
      this.$refs.ruleForm.resetFields()
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogVisible = !valid
          this.CreateSpaceName()
          this.loadShow = true
          this.GetSpaceName()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getExist () {
      if (this.ruleForm.name.length >= 4) {
        this.GetIsExist()
      }
    },
    getSearch () {
      var regex = /^[a-z0-9\.\-_]+$/g
      if (regex.test(this.input) || this.input === '') {
        this.loadShow = true
        this.GetSpaceName()
      } else {
        this.$message({
          message: '当前输入的镜像名称不符合镜像仓库命名规范，仅支持小写字母、数字及分隔符("."、"_"、"-")',
          type: 'warning'
        })
      }
    },
    GetSpaceName () { // 获取命名空间
      const param = {
        namespace: this.input,
        offset: 20 * (this.currpage - 1),
        limit: this.pagesize
      }
      this.axios.post(SPACENAME_LIST, param).then(res => {
        if (res.code === 0) {
          this.tableData = res.data.namespaceInfo
          this.TotalCount = res.data.namespaceCount
          this.loadShow = false
        }
      })
    },
    DeleteSpaceName () { // 删除命名空间
      const param = {
        namespace: this.namespace
      }
      this.axios.post(SPACENAME_DELETE, param).then(res => {
        console.log(res)
        if (res.code === 0) {
          this.loadShow = true
          this.GetSpaceName()
        }
      })
    },
    CreateSpaceName () { // 创建命名空间
      const param = {
        namespace: this.ruleForm.name
      }
      this.axios.post(CREATE_SPACENAME, param).then(res => {
        console.log(res)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.room {
  // position: absolute;
  // left: 20px;
  // top: 40px;
  // width: 95%;
  height: auto;
  padding:20px;
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

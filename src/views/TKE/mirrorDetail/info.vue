<template>
  <div class="room">
    <div class="room-center">
      <div class="explain" style="margin-bottom:20px;">
        <p>当前账号下镜像仓库内镜像版本配额为1000个，当前仓库版本数为0个，您可设置
            <el-button type="text" size="small">自动清理策略</el-button>
            以仅保留较新版本的容器镜像，以免因达到配额限制而无法上传新版本镜像。
        </p>
      </div>
    </div>
    <div class="room-top" style="margin-bottom:20px;">
      <div class="top-left">
        <el-button
          type="primary"
          size="mini"
          class="botton-size"
          @click="dialogFormVisible = true"
        >使用索引</el-button>
        <el-button disabled size="mini" class="botton-size">删除</el-button>
      </div>
      <div class="top-right">
          <el-input v-model="input" placeholder="请输入实例组名搜索" size="mini"></el-input>
          <el-button icon="el-icon-search" size="mini" style="margin-left:-1px;height:28px;"></el-button>
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
    <!-- 新建弹出窗 -->
    <el-dialog title="新建仓库镜像" :visible.sync="dialogFormVisible" width="550px">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
        size="small"
        style="width:500px"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="ruleForm.name" style="width:200px"></el-input>
          <p class="form-p">最长为200个字符，只能包含小写字母、数字及分隔符("."、"_"、"-")，且不能以分隔符开头或结尾</p>
        </el-form-item>
        <el-form-item label="类型" prop="region">
          <el-select v-model="ruleForm.region" placeholder="请选择活动区域">
            <el-option label="私有" value="shanghai"></el-option>
            <el-option label="公有" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="命名空间" prop="region2">
          <el-select v-model="ruleForm.region2" placeholder="请选择活动区域">
            <el-input placeholder="请输入镜像名称" suffix-icon="el-icon-search" v-model="input2" class="search-input2" size="mini"></el-input>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input type="textarea" size="medium" v-model="ruleForm.desc" :autosize="{ minRows: 2, maxRows: 4}" maxlength=1000></el-input>
          <p class="form-p">最长为1000个字符</p>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      input: '',
      input2: '',
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
      currpage: 1, // 当前页码
      dialogTableVisible: false,
      dialogFormVisible: false,
      formLabelWidth: '120px',
      ruleForm: {
        name: '',
        region: '',
        region2: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入镜像名称', trigger: 'blur' },
          { max: 200, message: '镜像名称不能超过200个字符', trigger: 'blur' }
        ],
        region: [
          { message: '请选择活动区域', trigger: 'change' }
        ],
        type: [
          { type: 'array', message: '请至少选择一个活动性质', trigger: 'change' }
        ],
        resource: [
          { message: '请选择活动资源', trigger: 'change' }
        ]
      }
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
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogFormVisible = !valid
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    jump () {
      this.$router.push({
        name: 'mirrorDetailInfo',
        query: {
          id: 1
        }
      })
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
.search-input2 {
  margin-left:5px;
  width: 185px;
}
.room-center {
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
.form-p{
  font-size: 12px;
  line-height: 1.8;
  color: #bbb;
}
</style>

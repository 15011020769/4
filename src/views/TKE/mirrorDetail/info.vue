<template>
  <div class="room">
    <div class="room-center">
      <div class="explain" style="margin-bottom:20px;">
        <p>当前账号下镜像仓库内镜像版本配额为1000个，当前仓库版本数为0个，您可设置
            <el-button type="text" size="small" @click="dialogVisible = true">设置自动清理策略</el-button>
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
          <i class="el-icon-setting"  @click="dialogVisible = true"></i>
          <span>设置自动清理旧版本镜像策略</span>
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
    <el-dialog title="使用指引" :visible.sync="dialogFormVisible" width="620px">
        <ul>
          <li>
            <p>登录腾讯云docker registry</p>
            <div class="tip">
              <p class="tip-p">sudo docker login --username=100011921910sudo</p>
                <div class="tip-position" @click="getContext($event)">复制</div>
            </div>
          </li>
          <li>
            <p>从registry拉取镜像</p>
            <div class="tip">
              <p class="tip-p">sudo docker login --username=100011921910</p>
                <div class="tip-position" @click="getContext($event)">复制</div>
            </div>
          </li>
          <li>
            <p>将镜像推送到registry</p>
            <div class="tip">
              <p class="tip-p">sudo docker login --username=100011921910sudo docker login --username=100011921910</p>
                <div class="tip-position" @click="getContext($event)">复制</div>
            </div>
          </li>
        </ul>
    </el-dialog>
    <!-- 设置 -->
    <el-dialog
      title="自动删除镜像设置"
      :visible.sync="dialogVisible"
      width="40%"
    >
      <div class="explain2" style="margin-bottom:20px;">
        <p>当前账号下镜像仓库内镜像版本配额为1000个，当前仓库内镜像版本数达到此配额后，将触发自动清理策略。</p>
      </div>
      <el-form :model="ruleForm" ref="ruleForm" label-width="30px" class="demo-ruleForm">
        <el-form-item>
          <el-radio v-model="radio" label="1">
            保留最新的<el-input v-model="input3" :disabled="flag1" class="dialog-input" size="mini"></el-input>个镜像版本
          </el-radio>
        </el-form-item>
         <el-form-item>
          <el-radio v-model="radio" label="2">
            保留最新的<el-input v-model="input4" :disabled="flag2" class="dialog-input" size="mini"></el-input>天内的镜像版本
          </el-radio>
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
export default {
  data () {
    return {
      input: '',
      input2: '',
      input3: '',
      input4: '',
      radio: '1',
      flag1: false,
      flag2: true,
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
      dialogVisible: false,
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
        ]
      }
    }
  },
  watch: {
    radio (newName, oldName) {
      if (newName === '1') {
        this.flag1 = false
        this.flag2 = true
        this.input4 = ''
      }
      if (newName === '2') {
        this.flag1 = true
        this.flag2 = false
        this.input3 = ''
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
    jump () { // 路由跳转
      this.$router.push({
        name: 'mirrorDetailInfo',
        query: {
          id: 1
        }
      })
    },
    getContext (e) {
      let getText = e.currentTarget.previousElementSibling.innerHTML
      this.copy(getText)
    },
    copy (data) { // 复制功能
      let url = data
      let oInput = document.createElement('input')
      oInput.value = url
      document.body.appendChild(oInput)
      oInput.select() // 选择对象;
      console.log(oInput.value)
      document.execCommand('Copy') // 执行浏览器复制命令
      this.$message({
        message: '复制成功',
        type: 'success'
      })
      oInput.remove()
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
  align-items: center;
  justify-content: flex-end;
  i{
    font-size: 14px;
    cursor: pointer;
  }
  span{
    margin-left:10px;
  }
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
.dialog-input{
  margin-left:10px;
  width:70px;
  margin-right:10px;
}
.explain2 {
    padding: 10px 30px 10px 20px;
    vertical-align: middle;
    color: #003b80;
    border: 1px solid #ffd18b;
    background: #fff4e3;
    p {
      font-size: 11px;
      line-height: 18px;
    }
  }
.tip{
    padding: 8px 16px;
    background-color: #ecf8ff;
    border-radius: 4px;
    border-left: 5px solid #50bfff;
    margin: 20px 0;
    position: relative;
}
.tip-position{
    font-size: 12px;
    text-align: center;
    color: #2177D9;
    position: absolute;
    right: 0;
    top: 0;
    background-color: #E1E1E1;
    padding: 3px 5px;
    cursor: pointer;
}
</style>

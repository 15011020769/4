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
          <span v-show="false">当前仅保留最新的1个镜像版本<el-button type="text" size="mini">删除自动清理策略</el-button></span>
          <span v-show="false">当前仅保留最近1天以内的镜像版本<el-button type="text" size="mini">删除自动清理策略</el-button></span>
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
            <p class="pli-1">登录腾讯云docker registry</p>
            <div class="tip">
              <p class="tip-p">sudo docker login --username={{userID}}<br>
                {{server}}
              </p>
                <div class="tip-position" @click="getContext($event)">复制</div>
            </div>
            <p class="pli-2">登录registry的用户名是您的腾讯云的账号ID，密码是您开通镜像仓库服务时设置的密码</p>
          </li>
          <li>
            <p class="pli-1">从registry拉取镜像</p>
            <div class="tip">
              <p class="tip-p">sudo docker pull t{{server}}/{{reponame}}:[tag]</p>
                <div class="tip-position" @click="getContext($event)">复制</div>
            </div>
            <p class="pli-2">其中[tag]请根据您的镜像版本信息进行填写。</p>
          </li>
          <li>
            <p class="pli-1">将镜像推送到registry</p>
            <div class="tip">
              <p class="tip-p">sudo docker login --username={{userID}}<br>
                {{server}}</p>
                <div class="tip-position" @click="getContext($event)">复制</div>
            </div>
             <div class="tip tip-one">
              <p class="tip-p">sudo docker tag [ImageId] {{server}}/{{reponame}}:[tag]</p>
                <div class="tip-position" @click="getContext($event)">复制</div>
            </div>
             <div class="tip">
              <p class="tip-p">sudo docker push {{server}}/{{reponame}}:[tag]</p>
                <div class="tip-position" @click="getContext($event)">复制</div>
            </div>
             <p class="pli-2">其中[ImageId]请根据您的实际镜像ID信息进行填写, [tag]请根据您的镜像版本信息进行填写。</p>
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
            保留最新的<el-input v-model.number="ruleForm.input1" :disabled="flag1" class="dialog-input" size="mini"></el-input>个镜像版本
          </el-radio>
        </el-form-item>
         <el-form-item>
          <el-radio v-model="radio" label="2">
            保留最新的<el-input v-model.number="ruleForm.input2" :disabled="flag2" class="dialog-input" size="mini"></el-input>天内的镜像版本
          </el-radio>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm ('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { MIRROR_ROAD } from '@/constants'
export default {
  data () {
    return {
      userID: 100011921910,
      radio: '1',
      flag1: false,
      flag2: true,
      name: this.$route.query.id,
      tableData: [],
      TotalCount: 0, // 总条数
      pagesize: 10, // 分页条数
      currpage: 1, // 当前页码
      dialogTableVisible: false,
      dialogFormVisible: false,
      dialogVisible: false,
      formLabelWidth: '120px',
      reponame: '',
      server: '',
      ruleForm: {
        input1: '',
        input2: ''
      },
      rules: {
        input1: [
          { required: true, trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    radio (newName, oldName) {
      if (newName === '1') {
        this.flag1 = false
        this.flag2 = true
        this.ruleForm.input2 = ''
      }
      if (newName === '2') {
        this.flag1 = true
        this.flag2 = false
        this.ruleForm.input1 = ''
      }
    }
  },
  created () {
    this.GetSpaceName()
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
          this.dialogVisible = !valid
        } else {
          console.log('error submit!!')
          return false
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
    },
    GetSpaceName () { // 获取命名空间
      const param = {
        reponame: this.name
      }
      this.axios.post(MIRROR_ROAD, param).then(res => {
        if (res.code === 0) {
          // console.log(res.data)
          this.server = res.data.server
          this.reponame = res.data.reponame
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
    background-color: #F5F5F5;
    border-left: 10px solid #D1E7F7;
    position: relative;
}
.tip-one{margin: 20px 0 ;}
.tip-p{
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
  width: 475px;
}
.tip-position{
    font-size: 12px;
    text-align: center;
    color: #2177D9;
    position: absolute;
    right: 0;
    top: 0;
    background-color: #E1E1E1;
    padding: 0 5px;
    cursor: pointer;
}
.pli-1{
  padding: 8px 0;
  font-size: 14px;
  color: #444;
  font-weight: bolder;
}
.pli-2{
  padding: 8px 0;

    font-size: 12px;
    color: #bbb
}
</style>

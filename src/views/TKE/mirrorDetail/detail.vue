<template>
    <el-card class="box-card">
        <p class="box-info">基本信息</p>
        <el-form  class="tke-form" :model="colony" label-position='left' label-width="120px" size="mini">
          <el-form-item label="仓库名称">
            <div class="tke-form-item_text"><span>{{name}}</span></div>
          </el-form-item>
          <el-form-item label="类型">
            <div class="tke-form-item_text"><span>{{form.region|publicsEdit}}<i class="el-icon-edit" style="cursor: pointer;" @click="getEdit()"></i></span></div>
          </el-form-item>
          <el-form-item label="仓库地址">
            <div class="tke-form-item_text"><span>{{server}}/{{name}}</span><i class="el-icon-document" style="cursor: pointer;"  @click="getContext($event)"></i></div>
          </el-form-item>
          <el-form-item label="描述">
            <div class="tke-form-item_text"><span>{{forminput.textarea | descriptions}}<i class="el-icon-edit" style="cursor: pointer;" @click="getEditTwo()"></i></span></div>
          </el-form-item>
          <el-form-item label="创建时间">
            <div class="tke-form-item_text"><span>{{creationTime}}</span></div>
          </el-form-item>
        </el-form>
        <!-- 修改类型 -->
        <el-dialog title="修改镜像仓库类型" :visible.sync="dialogFormVisible">
          <el-form :model="form">
            <el-form-item label="类型" :label-width="formLabelWidth">
              <el-select v-model="form.region" placeholder="请选择活动区域" @change="setPublic()">
                <el-option label="私有" value='0'></el-option>
                <el-option label="公有" value='1'></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
          </div>
        </el-dialog>
        <!-- 修改描述 -->
        <el-dialog title="修改镜像仓库描述" :visible.sync="dialogFormVisible2">
          <el-form :model="forminput" ref="forminput">
            <el-form-item label="描述" :label-width="formLabelWidth"  prop="textarea"
            :rules="[
              { max: 1000, message: '长度不能超过1000个字符', trigger: 'blur' }
            ]">
                <el-input
                  type="textarea"
                  :rows="4"
                  placeholder="请输入内容"
                  v-model="forminput.textarea"
                  >
                </el-input>
                 <p style="font-size:12px;color:#bbb;">最长为1000个字符</p>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible2 = false">取 消</el-button>
            <el-button type="primary" @click="submitForm('forminput')">确 定</el-button>
          </div>
        </el-dialog>
    </el-card>
</template>
<script>
import { MIRROR_LIST, MIRROR_UPDATE, MIRROR_UPDATE_DESC } from '@/constants'
export default {
  data () {
    return {
      reponame: this.$route.query.id.split('/')[1],
      name: '',
      publics: '0',
      address: '',
      description: '',
      creationTime: '',
      server: '',
      dialogFormVisible: false,
      dialogFormVisible2: false,
      form: {
        region: ''
      },
      forminput: {
        textarea: ''
      },
      formLabelWidth: '100px'
    }
  },
  created () {
    this.GetMyMirror()
  },
  methods: {
    getEdit () {
      this.dialogFormVisible = true
    },
    setPublic () {
      this.SetMyMirrorPublic()
    },
    submitForm (formName) {
      console.log(formName)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogFormVisible2 = !valid
          this.description = this.forminput.textarea
          console.log(this.description)
          this.SetMyMirrorDesc()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // @blur="setDescription()"
    setDescription () {
      this.description = this.forminput.textarea
    },
    getEditTwo () {
      this.dialogFormVisible2 = true
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
    GetMyMirror () { // 获得我的镜像数据
      const param = {
        reponame: this.reponame,
        offset: 0,
        limit: 1
      }
      this.axios.post(MIRROR_LIST, param).then(res => {
        if (res.code === 0) {
          this.name = res.data.repoInfo[0].reponame
          this.form.region = res.data.repoInfo[0].public.toString()
          this.forminput.textarea = res.data.repoInfo[0].description
          this.creationTime = res.data.repoInfo[0].creationTime
          this.server = res.data.server
          // console.log(res.data)
        }
      })
    },
    SetMyMirrorPublic () { // 修改类型
      const param = {
        reponame: this.name,
        public: Number(this.form.region)
      }
      this.axios.post(MIRROR_UPDATE, param).then(res => {
        console.log(res)
      })
    },
    SetMyMirrorDesc () { // 修改描述
      const param = {
        reponame: this.name,
        description: this.description
      }
      this.axios.post(MIRROR_UPDATE_DESC, param).then(res => {
        console.log(res)
      })
    }
  },
  filters: {
    publicsEdit: function (value) {
      // 类型过滤
      if (value === '1') {
        return '公有'
      } else {
        return '私有'
      }
    },
    descriptions: function (value) {
      if (value === '') {
        return '无'
      } else {
        return value
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .text {
    font-size: 14px;
  }
  .item {
    ul>li{
        margin-top:30px;
        font-size: 12px;
        color:#888;

    }
  }
  .box-card {
    width: 95%;
    position: absolute;
    top:40px;
    left:20px;
    .box-info{
        font-size: 14px;
        font-weight: 700;
        margin-bottom:20px;
    }
  }
  .li-one{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .li-p-one{
    width:15%;
  }
  .li-p-two{
    width: 85%;
    font-size: 12px;
    color: #444;
  }
</style>

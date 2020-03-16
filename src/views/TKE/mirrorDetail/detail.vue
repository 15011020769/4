<template>
    <el-card class="box-card">
        <p class="box-info">{{$t('TKE.overview.jbxx')}}</p>
        <el-form  class="tke-form"  label-position='left' label-width="120px" size="mini">
          <el-form-item :label="$t('TKE.mirrorDetail.ckmc')">
            <div class="tke-form-item_text"><span>{{name}}</span></div>
          </el-form-item>
          <el-form-item :label="$t('TKE.overview.lx')">
            <div class="tke-form-item_text"><span>{{form.region|publicsEdit}}<i class="el-icon-edit" style="cursor: pointer;" @click="getEdit()"></i></span></div>
          </el-form-item>
          <el-form-item :label="$t('TKE.mirrorDetail.ckdz')">
            <div class="tke-form-item_text"><span>{{server}}/{{name}}</span>
            <i class="el-icon-document" style="cursor: pointer;"  @click="getContext($event)"></i>
            </div>
          </el-form-item>
          <el-form-item label="描述">
            <div class="tke-form-item_text"><span>{{description| descriptions}}<i class="el-icon-edit" style="cursor: pointer;" @click="getEditTwo()"></i></span></div>
          </el-form-item>
          <el-form-item :label="$t('TKE.overview.cjsj')">
            <div class="tke-form-item_text"><span>{{creationTime}}</span></div>
          </el-form-item>
        </el-form>
        <!-- 修改类型 -->
        <el-dialog :title="$t('TKE.mirrorDetail.xgjxcklx')" :visible.sync="dialogFormVisible">
          <el-form :model="form" class="tke-form">
            <el-form-item :label="$t('TKE.overview.lx')" :label-width="formLabelWidth">
              <el-select v-model="form.region" :placeholder="$t('TKE.overview.xzhdqy')"  size="mini">
                <el-option label="私有" value='0'></el-option>
                <el-option label="公有" value='1'></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="setPublic()">{{$t('TKE.overview.qd')}}</el-button>
          </div>
        </el-dialog>
        <!-- 修改描述 -->
          <el-dialog title="修改镜像仓库描述" :visible.sync="dialogFormVisible2">
          <el-form :model="forminput" ref="forminput" :rules="rules">
            <el-form-item label="描述" :label-width="formLabelWidth"  prop="textarea"
            :rules="[
              { max: 1000, message: $t('TKE.mirrorDetail.cdbncg1000gzf'), trigger: 'blur' },
              { required: true, message: $t('TKE.mirrorDetail.msbnwk'), trigger: 'blur' }
            ]" class="tke-form">
                <el-input
                  type="textarea"
                  :rows="4"
                  :placeholder="$t('TKE.colony.qsrnr')"
                  v-model="forminput.textarea"
                  size="mini">
                </el-input>
                 <p style="font-size:12px;color:#bbb;">{{$t('TKE.myMirror.zcw1000gzf')}}</p>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="resetForm">取 消</el-button>
            <el-button type="primary" @click="submitForm('forminput')">{{$t('TKE.overview.qd')}}</el-button>
          </div>
        </el-dialog>
    </el-card>
</template>
<script>
import { ErrorTips } from "@/components/ErrorTips";
import { TKE_MIRROR_LIST, TKE_MIRROR_UPDATE, TKE_MIRROR_UPDATE_DESC } from '@/constants'
export default {
  name:'MirrorDetails',
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
      formLabelWidth: '100px',
      rules:{
         textarea: [
          { max: 1000, message: this.$t('TKE.mirrorDetail.cdbncg1000gzf'), trigger: 'blur' },
          { required: true, message: this.$t('TKE.mirrorDetail.msbnwk'), trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.GetMyMirror()
  },
  // watch:{
  //   'form.region'(val){
  //     console.log(val)
  //   }
  // },
  methods: {
    getEdit () {
      this.dialogFormVisible = true
    },
    setPublic () {
      this.SetMyMirrorPublic()
      this.dialogFormVisible = false
    },
    submitForm (formName) {
      console.log(formName)
      this.$refs[formName].validate((valid) => {
        if (valid && this.forminput.textarea) {
          this.dialogFormVisible2 = !valid
          // this.description = this.forminput.textarea
          // console.log(this.description)
          this.SetMyMirrorDesc()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(){
      this.dialogFormVisible2 = false
      this.$refs[forminput].resetFields();
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
        message: this.$t('TKE.mirrorDetail.fzcg'),
        type: 'success',
        showClose: true,
      })
      oInput.remove()
    },
    GetMyMirror () { // 获得我的镜像数据
      const param = {
        reponame: this.reponame,
        offset: 0,
        limit: 1
      }
      this.axios.post(TKE_MIRROR_LIST, param).then(res => {
        if (res.code == 0 && res.Error == undefined) {
          this.name = res.data.repoInfo[0].reponame
          this.form.region = res.data.repoInfo[0].public.toString()
          this.region = res.data.repoInfo[0].public.toString()
          this.forminput.textarea = res.data.repoInfo[0].description
          this.description = res.data.repoInfo[0].description
          this.creationTime = res.data.repoInfo[0].creationTime
          this.server = res.data.server
        } else {
          this.$message({
              message: ErrorTips[res.codeDesc],
              type: "error",
              showClose: true,
              duration: 0
          })
        }
      })
    },
    SetMyMirrorPublic () { // 修改类型
      const param = {
        reponame: this.name,
        public: Number(this.form.region)
      }
      this.axios.post(TKE_MIRROR_UPDATE, param).then(res => {
        if(res.code == 0 && res.Error == undefined){
          this.GetMyMirror()
          this.$message({
                  message: "修改成功",
                  type: "success",
                  showClose: true,
                  duration: 0
              })
          return
        }
        this.$message({
            message: ErrorTips[res.codeDesc],
            type: "error",
            showClose: true,
            duration: 0
        })
      })
    },
    SetMyMirrorDesc () { // 修改描述
      const param = {
        reponame: this.name,
        description: this.forminput.textarea
      }
      this.axios.post(TKE_MIRROR_UPDATE_DESC, param).then(res => {
        if(res.code == 0 && res.Error == undefined){
            this.GetMyMirror()
            this.$message({
                  message: "修改成功",
                  type: "success",
                  showClose: true,
                  duration: 0
              })
            return
        }
        this.$message({
            message: ErrorTips[res.codeDesc],
            type: "error",
            showClose: true,
            duration: 0
        })
      })
    }
  },
  filters: {
    publicsEdit: function (value) {
      // 类型过滤
      if (value == '1') {
        return '公有'
      } else {
        return '私有'
      }
    },
    descriptions: function (value) {
      if (value == '') {
        return '無'
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

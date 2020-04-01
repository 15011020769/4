<template>
  <div class="room">
    <div class="room-top">
      <div class="top-left">
        <el-button
          type="primary"
          size="mini"
          class="botton-size"
          @click="dialogFormVisible = true"
        >新建</el-button>
        <el-button :disabled="this.multipleSelection.length>=1?false:true" size="mini" class="botton-size" @click="deleteOpen()">{{$t('TKE.overview.sc')}}</el-button>
        <el-button size="mini" class="botton-size" @click="dialogFormVisible2 = true">{{$t('TKE.myMirror.czmm')}}</el-button>
      </div>
      <div class="top-right">
          <el-input v-model.trim="input" :placeholder="$t('TKE.myMirror.qsrjxmc')" size="mini" ></el-input>
          <el-button icon="el-icon-search" size="mini" style="margin-left:-1px;height:28px;" :plain="true" @click="getSearch()"></el-button>
      </div>
    </div>
    <div class="room-center">
      <div class="explain" style="margin-bottom:20px;">
        <p>{{$t('TKE.myMirror.mydqmrdynjxck')}}</p>
      </div>
    </div>
    <div class="room-bottom">
      <el-table :data="tableData" style="width: 100%" height="450" v-loading="loadShow" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="reponame" :label="$t('TKE.overview.mc')">
          <template slot-scope="scope">
            <p>
              <a style="cursor:pointer;" @click="jump(scope.row)">{{scope.row.reponame|reponameCg}}</a>
            </p>
          </template>
        </el-table-column>
        <el-table-column prop="public" :label="$t('TKE.overview.lx')">
           <template slot-scope="scope">
                {{scope.row.public|publics}}
            </template>
        </el-table-column>
        <el-table-column prop="reponame">
          <template slot="header">
            {{$t('TKE.overview.mmkj')}}
            <!-- <ul>
              <li>全部</li>
            </ul> -->
          </template>
           <template slot-scope="scope">
                {{scope.row.reponame|reponameCgs}}
            </template>
        </el-table-column>
        <el-table-column prop="reponame" :label="$t('TKE.myMirror.jxdz')">
          <template slot-scope="scope">
                {{tableServer+'/'+scope.row.reponame|tableServers}}
            </template>
        </el-table-column>
        <el-table-column prop="creationTime" :label="$t('TKE.overview.cjsj')"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small">{{$t('TKE.overview.sc')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="Right-style pagstyle">
        <span class="pagtotal">共&nbsp;{{TotalCount}}&nbsp;{{$t('TKE.overview.tiao')}}</span>
        <el-pagination
          :page-size="pagesize"
          layout="sizes, prev, pager, next"
          :current-page.sync="currpage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 20, 50, 100]"
          :total="TotalCount"
        ></el-pagination>
      </div>
    </div>
    <!-- 新建弹出窗 -->
    <el-dialog :title="$t('TKE.myMirror.xjjxck')" :visible.sync="dialogFormVisible" width="550px" :before-close="close">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm tke-form"
        size="small"
        style="width:500px"
        label-position="left">
        <el-form-item :label="$t('TKE.overview.mc')" prop="name" size="mini">
          <el-input  v-model="name" @change="getName()" style="width:200px"></el-input>
          <p class="form-p">{{$t('TKE.myMirror.zcw200gzf')}}</p>
        </el-form-item>
        <el-form-item :label="$t('TKE.overview.lx')"  size="mini">
          <el-select v-model="ruleForm.region" label="私有">
            <el-option label="私有" value="0"></el-option>
            <el-option label="公有" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('TKE.overview.mmkj')" prop="region2" size="mini">
           <el-select v-model="ruleForm.region2" filterable :placeholder="$t('TKE.overview.qxz')">
              <el-option v-for="(item,key) in spaceName" :key="key" :label="item.namespace" :value="item.namespace"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="desc" size="mini">
          <el-input type="textarea" size="medium" v-model="ruleForm.desc" :autosize="{ minRows: 2, maxRows: 4}" maxlength=1000></el-input>
          <p class="form-p">{{$t('TKE.myMirror.zcw1000gzf')}}</p>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('ruleForm')">{{$t('TKE.myMirror.qd')}}</el-button>
        <el-button @click="close()">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 重置密码弹出窗口 -->
    <el-dialog :title="$t('TKE.myMirror.czmm')" :visible.sync="dialogFormVisible2" width="550px">
      <el-form
        :model="rulePass"
        :rules="rules"
        ref="rulePass"
        label-width="100px"
        class="demo-ruleForm tke-form"
        size="small"
        style="width:500px"
        label-position="left"
      >
        <p class="form-pt">{{$t('TKE.myMirror.njczsy')}}</p>
        <el-form-item :label="$t('TKE.overview.mc')">
            <p>{{nameId}}</p>
        </el-form-item>
        <el-form-item :label="$t('TKE.overview.mm')" prop="pass" size="mini">
          <el-input type="password" v-model="rulePass.pass" autocomplete="off" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item :label="$t('TKE.colony.qrmm')" prop="checkPass" size="mini">
          <el-input type="password" v-model="rulePass.checkPass" autocomplete="off" style="width:200px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitPass('rulePass')">{{$t('TKE.myMirror.qd')}}</el-button>
        <el-button @click="dialogFormVisible2 = false">取消</el-button>
      </div>
    </el-dialog>
    <!-- 删除弹窗 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="40%">
      <p>{{$t('TKE.myMirror.nqdyscjxck')}}"{{reponame}}"{{$t('TKE.myMirror.ma')}}？</p>
      <p class="form-p">{{$t('TKE.myMirror.gjxckxdsyjx')}}</p>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="deleteOne()">{{$t('TKE.myMirror.qd')}}</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
    <!-- 全选删除弹窗 -->
    <el-dialog title="提示" :visible.sync="dialogTableVisible" width="35%">
      <p>{{$t('TKE.myMirror.nqdyycyxjxck')}}？</p>
      <div>{{$t('TKE.colony.yxze')}}<span style="color:#ff9d00;">{{this.deleteData.length}}{{$t('TKE.overview.ge')}}</span>{{$t('TKE.myMirror.jxck')}},<a @click="show=!show" style="cursor: pointer;">{{$t('TKE.overview.ckxq')}}</a></div>
          <el-collapse-transition>
            <div v-show="show">
              <el-table :data="deleteData" height="200">
                <el-table-column property="reponame" :label="$t('TKE.overview.mc')" width="150"></el-table-column>
                <el-table-column :label="$t('TKE.overview.zt')" width="200">
                  <template>{{$t('TKE.myMirror.ksc')}}</template>
                </el-table-column>
              </el-table>
            </div>
          </el-collapse-transition>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="deleteAll()">{{$t('TKE.myMirror.qd')}}</el-button>
          <el-button @click="dialogTableVisible = false">取消</el-button>
        </span>
    </el-dialog>
  </div>
</template>
<script>
import { ErrorTips } from "@/components/ErrorTips";
import { ALL_CITY, TKE_MIRROR_LIST, TKE_SPACENAME_LIST, TKE_MIRROR_DELETE, ALL_PROJECT, TKE_MIRROR_PRESENCE, TKE_MIRROR_CREATE, TKE_CHANGEPASSWORD} from '@/constants'
export default {
  name:'MirrorUser',
  data () {
    var validatePass = (rule, value, callback) => {
      var ckAll = /^(?![a-zA-Z]+$)(?!\d+$)(?![^\x00-\xff]+$).+$/
      if (value === '') {
        callback(new Error(this.$t('TKE.myMirror.qsrmm')))
      }else if(value.length<8 || value.length>16){
        callback(new Error(this.$t('TKE.myMirror.mmbxw')))
      }else if(!ckAll.test(value)){
        callback(new Error(this.$t('TKE.myMirror.mmbxbh')))
      } else {
        if (this.rulePass.checkPass !== '') {
          this.$refs.rulePass.validateField('checkPass')
        }
        // console.log(value.length)
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      var ckAll = /^(?![a-zA-Z]+$)(?!\d+$)(?![^\x00-\xff]+$).+$/
      if (value === '') {
        callback(new Error(this.$t('TKE.myMirror.qzcsrmm')))
      } else if (value !== this.rulePass.pass) {
        callback(new Error(this.$t('TKE.myMirror.lcsrmmbyz')))
      } else if(value.length<8 || value.length>16){
        callback(new Error(this.$t('TKE.myMirror.mmbxw')))
      }else if(!ckAll.test(value)){
        callback(new Error('TKE.myMirror.mmbxbh'))
      }  else {
        callback()
      }
    }
    var validatePass3 = (rule, value, callback) => {
      const version = /^[0-9a-z]([0-9a-z]|.|_|-){0,198}[0-9a-z]$/
      // 判断新建是否存在镜像名称接口
      const param = {
        reponame: this.isReponame
      }
      this.axios.post(TKE_MIRROR_PRESENCE, param).then(res => {
        if (res.code == 0 && res.data.isExist) {
          callback(new Error(this.$t('TKE.myMirror.jxmcycz')))
        } else if (!version.test(this.ruleForm.name)) {
          callback(new Error(this.$t('TKE.myMirror.jxgsbzq')))
        } else {
          callback()
        }
      })
    }
    return {
      nameId: this.$cookie.get('uin'),
      name: '',
      input: '',
      input2: '',
      tableData: [], // 我的镜像数据
      TotalCount: 0, // 总条数
      pagesize: 20, // 分页条数
      currpage: 1, // 当前页码
      tableServer: '',
      loadShow: true, // 加载是否显示
      dialogTableVisible: false,
      dialogFormVisible: false,
      dialogFormVisible2: false,
      dialogVisible: false,
      formLabelWidth: '120px',
      multipleSelection: '',
      reponame: '',
      show: true,
      deleteData: [],
      flag: true,
      deleteSpace: '',
      spaceName: [], // 命名空间
      isReponame: '',
      // isExist: '', // 镜像名称是否存在变量
      rulePass:{
        pass:'',
        checkPass:''
      },
      ruleForm: {
        name: '',
        region: '0',
        region2: '',
        desc: '',
      },
      rules: {
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ],
        name: [
          { required: true, message: this.$t('TKE.myMirror.qsrjxmc'), trigger: 'blur' },
          { max: 200, message: this.$t('TKE.myMirror.jxmcbncg200gzf'), trigger: 'blur' },
          { validator: validatePass3, trigger: 'blur,change' }
        ],
        region2: [
          { required: true, message: this.$t('TKE.myMirror.mmkjbnwk'), trigger: 'change' }
        ]
      }
    }
  },
  created () {
    this.GetMyMirror()
    this.GetSpaceName()

  },
  computed: {
    dateRange () {
      const { name, region2 } = this.ruleForm
      return {
        name,
        region2
      }
    }
  },
  watch: {
    dateRange (val) {
      if (val.name !== '' && val.region2 !== '') {
        this.isReponame = val.region2 + '/' + val.name
        // this.isPresence()
      }
    },
    input(val){
      if(val == ""){
        this.getSearch()
      }
    }
  },
  methods: {
    // 多选删除弹出框
    handleClick (row) {
      this.reponame = row.reponame
      this.dialogVisible = true
    },
    // 分页
    handleCurrentChange (val) {
      this.currpage = val
      this.GetMyMirror()
      this.loadShow = true
    },
    // 整选分页
    handleSizeChange(val){
       this.pagesize = val
       this.loadShow = true
       this.GetMyMirror()
        console.log(val)
    },
    submitForm (formName) {
      // console.log(formName)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogFormVisible = !valid
          this.CreateMyMirror()

          this.$refs.ruleForm.clearValidate()
          this.$refs.ruleForm.resetFields()
          this.name = ''
          this.ruleForm.name = ''
          this.loadShow = true
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    submitPass(form){
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.dialogFormVisible2 = !valid
          this.ChangePassword(this.rulePass.checkPass)
          this.$refs.rulePass.clearValidate()
          this.$refs.rulePass.resetFields()
        }
        else {
          return false
        }
    })
    },
    // changeSearch(){
    //   if(this.input === ""){
    //     this.getSearch()
    //   }
    // },
    // 命名空间列表
    // setListName(){

    // },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    getName () {
      this.ruleForm.name = this.name
    },
    // 关闭新建窗口
    close () {
      this.dialogFormVisible = false
      this.$refs.ruleForm.clearValidate()
      this.$refs.ruleForm.resetFields()
      this.name = ''
    },
    // 路由跳转
    jump (row) {
      // console.log(row)
      this.$router.push({
        name: 'mirrorDetailInfo',
        query: {
          id: row.reponame
        }
      })
    },
    // 搜索
    getSearch () {
      var regex = /^[a-z0-9\.\-_]+$/g
      if (regex.test(this.input) || this.input === '') {
        this.loadShow = true
        this.GetMyMirror()
      } else {
        this.$message({
          message: this.$t('TKE.myMirror.mydqsrdjxmc'),
          type: 'warning',
          showClose: true,
          duration: 0
        })
      }
    },
    // 单个删除
    deleteOne () {
      this.dialogVisible = false
      this.deleteSpace = { 'reponames.0': this.reponame }
      this.DeleteMyMirror()
    },
    // 全选删除弹窗
    deleteOpen () {
      this.dialogTableVisible = true
      this.deleteData = this.multipleSelection
      // console.log(this.deleteData)
    },
    // 全选删除
    deleteAll () {
      this.dialogTableVisible = false
      var obj = {}
      for (var i = 0; i < this.multipleSelection.length; i++) {
        obj['reponames.' + i] = this.multipleSelection[i].reponame
      }
      this.deleteSpace = obj
      this.DeleteMyMirror()
    },
    // open3 () {
    //   this.$message({
    //     message: '警告哦，这是一条警告消息',
    //     type: 'warning'
    //   })
    // },
    // 获得我的镜像数据
    GetMyMirror () {
      const param = {
        reponame: this.input,
        offset: 20 * (this.currpage - 1),
        limit: this.pagesize
      }
      this.axios.post(TKE_MIRROR_LIST, param).then(res => {
        if (res.code === 0 && res.Error == undefined) {
          this.tableData = res.data.repoInfo
          this.tableServer = res.data.server
          this.TotalCount = res.data.totalCount
          this.loadShow = false
        } else {
          console.log(2)
          this.$message({
              message: ErrorTips[res.codeDesc],
              type: "error",
              showClose: true,
              duration: 0
          })
        }
      })
    },
    DeleteMyMirror () { // 删除我的镜像数据
      const param = this.deleteSpace
      this.axios.post(TKE_MIRROR_DELETE, param).then(res => {
        if (res.code === 0 && res.Error == undefined) {
          this.currpage = 1
          this.GetMyMirror()
          this.loadShow = true
          this.deleteSpace = ''
          this.$message({
              message: this.$t('TKE.myMirror.sccg'),
              type: "success",
              showClose: true,
              duration: 0
          })
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
    GetSpaceName () { // 获取命名空间
      const param = {
        namespace: '',
        offset: 0,
        limit: 100
      }
      this.axios.post(TKE_SPACENAME_LIST, param).then(res => {
        if (res.code === 0 && res.Error == undefined) {
          this.spaceName = res.data.namespaceInfo
          console.log(this.spaceName)
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
    CreateMyMirror () { // 创建我的镜像数据
      const param = {
        reponame: this.isReponame,
        public: this.ruleForm.region,
        description: this.ruleForm.desc
      }
      this.axios.post(TKE_MIRROR_CREATE, param).then(res => {
        if (res.code === 0 && res.Error == undefined) {
          this.GetMyMirror()
          this.loadShow = false
          console.log(res)
          this.$message({
              message: "新建成功",
              type: "success",
              showClose: true,
              duration: 0
          })
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
    // 重置密码
    ChangePassword(word){
      const param = {
        // password: word
        // Version: "2019-09-24",
        password: word,
        RequestOperator:this.$cookie.get('uuid')
      }
      this.axios.post(TKE_CHANGEPASSWORD, param).then(res => {
        // console.log(res)
        if (res.code == 0 && res.Error == undefined) {
          this.loadShow = false
           this.$message({
              message: "重置密碼成功",
              type: "success",
              showClose: true,
              duration: 0
          })
          // console.log(res)
          // console.log(ErrorTips)
        } else {
          this.$message({
              message: ErrorTips[res.codeDesc],
              type: "error",
              showClose: true,
              duration: 0
          })
        }
      })
    }
  },
  filters: {
    reponameCg: function (value) {
      // 名称过滤
      return value.split('/')[1]
    },
    reponameCgs: function (value) {
      // 命名空间过滤
      return value.split('/')[0]
    },
    publics: function (value) {
      // 类型过滤
      if (value === 1) {
        return '公有'
      } else {
        return '私有'
      }
    },
    tableServers:function(value){
       var index = value.replace('tencent', 'taipei').replace('cloud', 'Top Cloud').replace('qcloud', 'Top Cloud')
        return index
    }
  }
}
</script>
<style lang="scss" scoped>
.room {
  height: auto;
  padding:20px;
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
.form-p{
  font-size: 12px;
  line-height: 1.8;
  color: #bbb;
}
.form-pt{
  font-size: 12px;
  line-height: 1.8;
  color: #bbb;
  margin-left:60px;
  margin-bottom:20px;
}
.el-dropdown-link {
    cursor: pointer;
    color: #909399;
    font-size: 12px;
    // line-height: 30px;
    // text-align: left;
    margin-left:-10px;
    margin-top: 5px;
}
  .el-icon-arrow-down {
    font-size: 12px;
  }
  .demonstration {
    display: block;
    color: #8492a6;
    font-size: 14px;
    margin-bottom: 20px;
  }
</style>

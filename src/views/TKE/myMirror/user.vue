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
        <el-button :disabled="this.multipleSelection.length>=1?false:true" size="mini" class="botton-size" @click="deleteOpen()">删除</el-button>
        <el-button size="mini" class="botton-size" @click="dialogFormVisible2 = true">重置密码</el-button>
      </div>
      <div class="top-right">
          <el-input v-model="input" placeholder="请输入镜像名称" size="mini"></el-input>
          <el-button icon="el-icon-search" size="mini" style="margin-left:-1px;height:28px;" @click="getSearch()"></el-button>
      </div>
    </div>
    <div class="room-center">
      <div class="explain" style="margin-bottom:20px;">
        <p>当前默认地域内镜像仓库暂不支持海外集群通过内网访问，请配置公网进行访问，或使用与集群位于相同地域的镜像仓库</p>
      </div>
    </div>
    <div class="room-bottom">
      <el-table :data="tableData" style="width: 100%" height="450" v-loading="loadShow" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="reponame" label="名称">
          <template slot-scope="scope">
            <p>
              <a style="cursor:pointer;" @click="jump">{{scope.row.reponame|reponameCg}}</a>
            </p>
          </template>
        </el-table-column>
        <el-table-column prop="public" label="类型">
           <template slot-scope="scope">
                {{scope.row.public|publics}}
            </template>
        </el-table-column>
        <el-table-column prop="reponame" label="命名空间">
           <template slot-scope="scope">
                {{scope.row.reponame|reponameCgs}}
            </template>
        </el-table-column>
        <el-table-column prop="reponame" label="镜像地址">
          <template slot-scope="scope">
                {{tableServer+'/'+scope.row.reponame}}
            </template>
        </el-table-column>
        <el-table-column prop="creationTime" label="创建时间"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small">删除</el-button>
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
    <!-- 新建弹出窗 -->
    <el-dialog title="新建镜像仓库" :visible.sync="dialogFormVisible" width="550px">
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
          <el-input  v-model="name" @blur="getName()" style="width:200px"></el-input>
          <p class="form-p">最长为200个字符，只能包含小写字母、数字及分隔符("."、"_"、"-")，且不能以分隔符开头或结尾</p>
        </el-form-item>
        <el-form-item label="类型" prop="region">
          <el-select v-model="ruleForm.region" label="私有">
            <el-option label="私有" value="0"></el-option>
            <el-option label="公有" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="命名空间" prop="region2">
           <el-select v-model="ruleForm.region2" filterable placeholder="请选择">
              <el-option v-for="(item,key) in spaceName" :key="key" :label="item.namespace" :value="item.namespace"></el-option>
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
    <!-- 重置密码弹出窗口 -->
    <el-dialog title="重置密码" :visible.sync="dialogFormVisible2" width="550px">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
        size="small"
        style="width:500px"
      >
        <p class="form-pt">您将重置使用docker login命令登录到腾讯云镜像仓库的密码</p>
        <el-form-item label="名称">
            <p>110111001</p>
        </el-form-item>
        <el-form-item label="密码" prop="pass">
          <el-input type="password" v-model="ruleForm.pass" autocomplete="off" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off" style="width:200px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
        <el-button @click="dialogFormVisible2 = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 删除弹窗 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="40%">
      <p>您确定要删除镜像仓库"{{reponame}}"吗？</p>
      <p class="form-p">该镜像仓库下的所有镜像版本将一并销毁，请提前备份好数据。</p>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="deleteOne()">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 全选删除弹窗 -->
    <el-dialog title="提示" :visible.sync="dialogTableVisible" width="35%">
      <p>您确定要移出以下镜像仓库么？</p>
      <div>已选择<span style="color:#ff9d00;">{{this.deleteData.length}}个</span>镜像仓库,<a @click="show=!show" style="cursor: pointer;">查看详情</a></div>
          <el-collapse-transition>
            <div v-show="show">
              <el-table :data="deleteData" height="200">
                <el-table-column property="reponame" label="名称" width="150"></el-table-column>
                <el-table-column label="状态" width="200">
                  <template>
                      可删除
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-collapse-transition>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="deleteAll()">确 定</el-button>
          <el-button @click="dialogTableVisible = false">取 消</el-button>
        </span>
    </el-dialog>
  </div>
</template>
<script>
import { ALL_CITY, MIRROR_LIST, SPACENAME_LIST, MIRROR_DELETE, ALL_PROJECT, MIRROR_PRESENCE, MIRROR_CREATE } from '@/constants'
export default {
  data () {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    var validatePass3 = (rule, value, callback) => {
      if (this.isExist) {
        callback(new Error('镜像名称已存在'))
      } else {
        callback()
      }
    }
    return {
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
      isExist: '', // 镜像名称是否存在变量
      ruleForm: {
        name: '',
        region: '0',
        region2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
        pass: ''
      },
      rules: {
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入镜像名称', trigger: 'blur' },
          { max: 200, message: '镜像名称不能超过200个字符', trigger: 'blur' },
          { validator: validatePass3, trigger: 'blur, change' }
        ],
        region2: [
          { required: true, message: '命名空间不能为空', trigger: 'change' }
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
        console.log(this.isReponame)
        this.isPresence()
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
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(valid)
          if (!this.isExist) {
            this.dialogFormVisible = !valid
            this.CreateMyMirror()
            this.GetMyMirror()
            this.loadShow = true
            // this.name = ''
            // this.ruleForm = {
            //   region2: '',
            //   region: '0',
            //   desc: ''
            // }
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    getName () {
      this.ruleForm.name = this.name
    },
    // 路由跳转
    jump () {
      this.$router.push({
        name: 'mirrorDetailInfo',
        query: {
          id: 1
        }
      })
    },
    // 搜索
    getSearch () {
      this.GetMyMirror()
      this.loadShow = true
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
      console.log(this.deleteData)
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
    GetMyMirror () { // 获得我的镜像数据
      const param = {
        reponame: this.input,
        offset: 20 * (this.currpage - 1),
        limit: this.pagesize
      }
      this.axios.post(MIRROR_LIST, param).then(res => {
        if (res.code === 0) {
          this.tableData = res.data.repoInfo
          this.tableServer = res.data.server
          this.TotalCount = res.data.totalCount
          this.loadShow = false
        }
      })
    },
    DeleteMyMirror () { // 删除我的镜像数据
      const param = this.deleteSpace
      this.axios.post(MIRROR_DELETE, param).then(res => {
        if (res.code === 0) {
          this.currpage = 1
          this.GetMyMirror()
          this.loadShow = true
          this.deleteSpace = ''
        }
      })
    },
    GetSpaceName () { // 获取命名空间
      const param = {
        namespace: '',
        offset: 0,
        limit: 100
      }
      this.axios.post(SPACENAME_LIST, param).then(res => {
        if (res.code === 0) {
          this.spaceName = res.data.namespaceInfo
          console.log(this.spaceName)
        }
      })
    },
    CreateMyMirror () { // 创建我的镜像数据
      const param = {
        reponame: this.isReponame,
        public: this.ruleForm.region,
        description: this.ruleForm.desc
      }
      this.axios.post(MIRROR_CREATE, param).then(res => {
        if (res.code === 0) {
          // this.loadShow = false
          console.log(res)
        }
      })
    },
    // 判断新建是否存在镜像名称接口
    isPresence () {
      const param = {
        reponame: this.isReponame
      }
      this.axios.post(MIRROR_PRESENCE, param).then(res => {
        if (res.code === 0) {
          this.isExist = res.data.isExist
          console.log(this.isExist)
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
</style>

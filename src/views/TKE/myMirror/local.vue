<template>
  <div class="room">
    <div class="room-top">
      <div class="top-left">
         <el-popover
          placement="right"
          width="100"
          trigger="hover"
          :content="$t('TKE.myMirror.slyddxz')"
          :disabled="tableData.length == 10?false:true">
          <div slot="reference">
            <el-button type="primary" size="mini"  @click="dialogVisible = true" :disabled="tableData.length == 10" >新建</el-button>
          </div>
         </el-popover>
      </div>
      <div class="top-right">
          <el-input v-model.trim="input" :placeholder="$t('TKE.myMirror.qsrmc')" size="mini" ></el-input>
          <el-button icon="el-icon-search" size="mini" style="margin-left:-1px;height:28px;" :plain="true" @click="getSearch()"></el-button>
      </div>
    </div>
    <div class="room-bottom">
       <el-table :data="tableData" style="width: 100%" height="450" v-loading="loadShow">
            <el-table-column prop="namespace" :label="$t('TKE.overview.mmkj')"></el-table-column>
            <el-table-column prop="repoCount" :label="$t('TKE.myMirror.cksm')"></el-table-column>
            <el-table-column prop="creationTime" :label="$t('TKE.overview.cjsj')"></el-table-column>
            <el-table-column prop="repoCount" label="操作" >
              <template slot-scope="scope">
                  <el-popover
                    placement="left"
                    width="300"
                    trigger="hover"
                    :content="$t('TKE.myMirror.jsckslbwl')"
                    :disabled="!scope.row.repoCount"
                   >
                  <div slot="reference">
                      <el-button @click="handleClick(scope.row)" type="text" size="small"  :disabled="scope.row.repoCount ? true:false" >
                        {{$t('TKE.overview.sc')}}
                      </el-button>
                  </div>
                </el-popover>
              </template>
            </el-table-column>
        </el-table>
        <div class="Right-style pagstyle">
            <span class="pagtotal">共&nbsp;{{TotalCount}}&nbsp;{{$t('TKE.overview.tiao')}}</span>
            <el-pagination
              :page-size="pagesize"
              layout="sizes,prev, pager, next"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :page-sizes="[10, 20, 50, 100]"
              :total="TotalCount"
            ></el-pagination>
        </div>
    </div>
    <el-dialog :title="$t('TKE.myMirror.xjmmkj')" :visible.sync="dialogVisible" width="50%">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm tke-form">
        <el-form-item :label="$t('TKE.overview.mc')+':'" prop="name">
           <!-- @blur="getExist()" -->
          <el-input v-model="ruleForm.name" size="mini" style="width:40%;"></el-input>
          <p  class="form-p">{{$t('TKE.myMirror.myzc')}}</p>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('ruleForm')">{{$t('TKE.myMirror.qd')}}</el-button>
        <el-button @click="getClose()">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { ErrorTips } from "@/components/ErrorTips";
import { SPACENAME_LIST, SPACENAME_DELETE, SPACENAME_PRESENCE, CREATE_SPACENAME } from '@/constants'
export default {
  name:'MirrorLocal',
  data () {
    var validatePass = (rule, value, callback) => {
      // 获取命名空间是否存在的接口
      var regex = /[0-9a-z]([0-9a-z_\.-](?!(\-\-)|(\.\.)|(\-\.)|(\.\-)|(\_\_)|(\-\_)|(\.\_))[0-9a-z_\.-])(?!-\._$){4,30}$/
      const param = {
        namespace: this.ruleForm.name
      }
      this.axios.post(SPACENAME_PRESENCE, param).then(res => {
        console.log(res)
        if (res.code === 0 && res.data.isExist) {
          callback(new Error(this.$t('TKE.myMirror.mmkjycz')))
        } else if(!regex.test(value)){
          callback(new Error(this.$t('TKE.myMirror.mmkjgsbzq')))
        }else {
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
      flag:false,// 提示判断
      TotalCount: 0, // 总条数
      pagesize: 20, // 分页条数
      currpage: 0, // 当前页码
      multipleSelection: '',
      dialogVisible: false,
      rules: {
        name: [
          { required: true, message: this.$t('TKE.myMirror.qsrmmkjmc'), trigger: 'blur' },
          { min: 4, message: this.$t('TKE.myMirror.mmkjsy4gzf'), trigger: 'blur' },
          { max: 30, message: this.$t('TKE.myMirror.mmkjbncg30zf'), trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.GetSpaceName()
  },
  watch: {
    input(val){
      if(val == ""){
        this.getSearch()
      }
    }
  },
  methods: {
    handleClick (row) {
      this.namespace = row.namespace
      this.repoCount = row.repoCount
      this.DeleteSpaceName()
    },
    // 分页
    handleCurrentChange (val) {
      this.currpage = val - 1;
      this.GetSpaceName();
      this.currpage+=1;
      this.loadShow = true
    },
    // 整体分页
    handleSizeChange(val){
      this.currpage = 0;
      this.pagesize = val
      this.loadShow = true
      this.GetSpaceName()
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
    // 是否存在命名空间
    getExist () {
      if (this.ruleForm.name.length >= 4) {
        this.GetIsExist()
      }
    },
    // 查询
    getSearch () {
      var regex = /^[a-z0-9\.\-_]+$/g
      if (regex.test(this.input) || this.input === '') {
        this.loadShow = true
        this.GetSpaceName()
      } else {
        this.$message({
          message: this.$t('TKE.myMirror.mydqsrdjxmc'),
          type: 'warning'
        })
      }
    },
    GetSpaceName () { // 获取命名空间
      const param = {
        namespace: this.input,
        offset: this.pagesize * this.currpage,
        limit: this.pagesize
      }
      this.axios.post(SPACENAME_LIST, param).then(res => {
        if (res.code === 0 && res.Error == undefined) {
          this.tableData = res.data.namespaceInfo
          this.TotalCount = res.data.namespaceCount
          this.loadShow = false
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
    DeleteSpaceName () { // 删除命名空间
      const param = {
        namespace: this.namespace
      }
      this.axios.post(SPACENAME_DELETE, param).then(res => {
        console.log(res)
        if (res.code === 0 && res.Error == undefined) {
          this.loadShow = true
          this.GetSpaceName()
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
    CreateSpaceName () { // 创建命名空间
      const param = {
        namespace: this.ruleForm.name
      }
      this.axios.post(CREATE_SPACENAME, param).then(res => {
        console.log(res)
        if(res.code == 0 && res.Error == undefined){
           this.GetSpaceName()
           this.$message({
              message: "新建成功",
              type: "success",
              showClose: true,
              duration: 0
          })
           return
        }
        let Errtip = {
          'UserNamespaceMaxLimit': '(202)' + this.$t('TKE.myMirror.yhmmkjsddpe')
        }
        let Error = Object.assign(ErrorTips,Errtip)
        this.$message({
              message: Error[res.codeDesc],
              type: "error",
              showClose: true,
              duration: 0
          })
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
.touch-delete{
   &:hover .touch-right{
      width: 100px;
      height: 80px;
      color:black;
      font-size: 14px;
   }
}
// .touch-delete:hover .touch-right{
//       width: 100px;
//       height: 80px;
//       color:black;
//       font-size: 14px;
// }
</style>

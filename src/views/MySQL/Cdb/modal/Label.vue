<template>
  <div class="Cdb-Label">
    <el-dialog :visible.sync="LabelShow"
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      :show-close='false'
      width="580px"
      center>
      <div slot="title"
        class="title-wrap">
        <span>编辑标签</span>
        <i class="el-icon-close"
          @click="close"></i>
      </div>
         <div class="Cdb-mountbottom"> 您已选 1台 云硬盘 <a @click="Detailshow">查看详情</a></div>
      <div v-if="Detailsshow"
        class="Cdb-mountbottom">
        <el-table :data="tableDataCDB"
          border
          style="width: 100%">
          <el-table-column prop="InstanceId"
            label="实例ID">
          </el-table-column>
          <el-table-column prop="InstanceName"
            label="实例名">
          </el-table-column>
          <el-table-column prop=""
            label="实例类型">
            <template slot-scope="scope">
              {{scope.row.InstanceType|MYSQLTYPEFilter()}}
            </template>
          </el-table-column>
          <el-table-column prop="DeadlineTime"
            label="关联实例">
            <template slot-scope="scope">
            -
            </template>
          </el-table-column>
        </el-table>
      </div>
      <p>
        新增标签
      </p>
      <div class="addtable-style">
        <el-table :data="tableData"
          type=index
          style="width: 100%">
          <el-table-column prop=""
            label="标签键"
            width="200">
            <template slot-scope="scope">
              <el-select v-model="scope.row.KeysID"
                @change='changeKeysID'
                placeholder="请选择">
                <el-option v-for="item in scope.row.a"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
              <p></p>
            </template>
          </el-table-column>
          <el-table-column prop=""
            label="标签值"
            width="200">
            <template slot-scope="scope">
              <el-select v-model="scope.row.valueID"
                @change='changeValue(scope.row.valueID,scope.$index)'
                placeholder="请选择">
                <el-option v-for="item in valueArr"
                  :key="item.TagValue"
                  :label="item.TagValue"
                  :value="item.TagValue">
                </el-option>
              </el-select>
              <p></p>
            </template>
          </el-table-column>
          <el-table-column prop=""
            width="100"
            label="操作">
            <template slot-scope="scope">

              <p>
                <el-button type="text"
                  size="mini"
                  @click="deletel(scope.$index,scope.row)">删除</el-button>
              </p>

            </template>
          </el-table-column>
        </el-table>
        <el-button type="text"
          size="mini"
          class="addtable-style-p"
          @click="AddtoTr">添加</el-button> <span style="color:red"> 不可选相同标签健的相同标签值</span>

      </div>
      <span slot="footer"
        class="dialog-footer">
        <el-button type="primary"
          @click="Label">确 定</el-button>
        <el-button @click="close">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    LabelShow: Boolean,
    Cdbdata: Object
  },
  data () {
    return {
      Detailsshow: false,
      tableData: [],
      KeysArr: [], // 标签健列表
      KeysID: '', // 选中标签健
      valueArr: [], // 标签值列表
      valueID: '', // 选中标签值
      keyValueArr: [], // 标签键和值
      tableDataCDB: []
    }
  },
  components: {},
  created () {
    console.log(this.Cdbdata)
    this.tableDataCDB.push(this.Cdbdata)
    this.TagKeys()
  },
  methods: {
    Detailshow () {
      this.Detailsshow = !this.Detailsshow
    },
    // 添加标签行
    AddtoTr () {
      let obj = {
        a: this.KeysArr
      }
      this.tableData.push(obj)
    },
    // 删除标签行
    deletel (index, value) {
      this.tableData.splice(index, 1)
      if (this.tableData.length === 0) {
        this.AddtoTr()
        this.keyValueArr = []
      }
      for (var i = 0; i < this.keyValueArr.length; i++) {
        if (
          this.keyValueArr[i].key === value.KeysID &&
          this.keyValueArr[i].value === value.valueID
        ) {
          this.keyValueArr.splice(index, 1)
        }
      }
    },
    // 查询标签键
    TagKeys () {
      var parms = {
        Version: '2018-08-13',
        Region: this.$cookie.get('regionv2')
      }
      this.axios
        .post('tag2/DescribeTagKeys', parms)
        .then(data => {
          this.KeysArr = data.Response.Tags
        })
        .then(data => {
          this.AddtoTr()
        })
    },
    // 选中标签键
    changeKeysID (value) {
      this.KeysID = value
      if (this.KeysID) {
        this.Getvalue()
      }
    },
    // 标签值
    Getvalue () {
      this.valueArr = []
      var parms = {
        Version: '2018-08-13',
        Region: this.$cookie.get('regionv2'),
        'TagKeys.0': this.KeysID
      }
      this.axios.post('tag2/DescribeTagValues', parms).then(data => {
        this.valueArr = data.Response.Tags
      })
    },
    // 选中标签值
    changeValue (value, index) {
      this.valueID = value
      var keyObj = {
        key: this.KeysID,
        value: this.valueID
      }
      this.keyValueArr.push(keyObj)
    },
    // 编辑标签确定
    Label () {
      console.log(this.keyValueArr)
      var parms = {
        Version: '2017-03-20',
        Region: this.$cookie.get('regionv2'),
        InstanceId: this.Cdbdata.InstanceId
      }
      for (let i in this.keyValueArr) {
        parms['ReplaceTags.' + i + '.TagKey'] = this.keyValueArr[i].key
        parms['ReplaceTags.' + i + '.TagValue.' + i] = this.keyValueArr[i].value
      }
      this.axios.post('cdb2/ModifyInstanceTag', parms).then(data => {
        console.log(data)
        if (data.Response.Error === undefined) {
          this.$emit('LabelShow', false)
          this.$parent.getDataList()
          this.$message({
            message: '编辑标签成功',
            type: 'success'
          })
        }
      })
    },
    // 取消
    close () {
      this.$emit('LabelShow', false)
    }
  }
}
</script>

<style lang="scss" >
.Cdb-Label {
  a {
    cursor: pointer;
  }
  .title-wrap {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    span {
      font-weight: bolder;
    }
    i {
      font-size: 16px;
      font-weight: 900;
      cursor: pointer;
    }
  }
  .el-dialog__body {
    padding: 10px 20px 30px;
    font-size: 12px;
    line-height: 20px;
    .addtable-style {
      border: 1px solid #ccc;
      .el-input--suffix .el-input__inner {
        width: 180px;
        height: 25px;
      }
      .el-input__suffix {
        right: -40px;
      }
      .addtable-style-p {
        padding: 10px;
      }
    }
  }
  .Cdb-mountbottom {
    margin-bottom: 15px;
  }
  h2 {
    color: black;
    font-size: 14px;
  }
}
</style>

<!--  -->
<template>
  <div class="tabOne">
    <div class="btn">
      <el-button type="text" @click="newVisible = true">新增实例</el-button>
    </div>
    <div class="table">
      <el-table :data="tableData" style="width: 100%">
        <template slot="empty">暂无数据</template>
        <el-table-column prop="name" label="名称/ID" width>
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text">{{ scope.row.name }}</el-button>
            <p class="edit">12121</p>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width>
          <template slot-scope="scope">
            <div v-if="scope.row.status==0" class="close_color">关闭</div>
            <div v-if="scope.row.status==1" class="off_color">已连接</div>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="实例类型" width>
          <template slot-scope="scope">
            <div>私有网络</div>
          </template>
        </el-table-column>
        <el-table-column prop="bucketName" label="所属帐号" width>
          <template slot-scope="scope">我的帐号</template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width></el-table-column>
        <el-table-column prop="operate" label="操作" width>
          <template slot-scope="scope">
            <el-button type="text" @click="dialogVisible = true">解关联</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新建关联实例模态窗 -->
    <el-dialog title="关联实例" :visible.sync="newVisible" class="newDialog">
      <div>
        <span>
          同地域带宽免费，点击
          <a href>查看详情</a>
        </span>
        <div class="body-con">
          <div class="tr-con" v-for="(item, index) in formArr">
            <td>
              <el-select v-model="value" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </td>
            <td>
              <el-select v-model="value" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </td>
            <td>
              <el-input
                size="small"
                placeholder="请输入内容"
                suffix-icon="el-icon-search"
                v-model="input"
              ></el-input>
            </td>
            <td>
              <a v-on:click="removeRow(index);" v-show="index >= 0">删除</a>
            </td>
          </div>
          <a v-on:click="addRow()" v-show="formArr.length < 5">添加</a>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="newVisible = false">提交</el-button>
        <el-button @click="newVisible = false">关闭</el-button>
      </div>
    </el-dialog>
    <!-- 删除模态窗 -->
    <el-dialog
      title="您确认要解除该实例与云联网的关联吗？"
      :visible.sync="dialogVisible"
      width="40%"
    >
      <span>解除关联后，该实例与云联网内其他实例的连接将立刻中断，请您务必确认影响后再操作。</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 认</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      newVisible: false,
      dialogVisible: false,
      tableData: [
        {
          name: 'dddaa',
          status: '1',
          type: '私有网络',
          createTime: '2019-11-07 14：05：12'
        }
      ], // 列表数据
      options: [
        {
          value: '选项1',
          label: '私有网络'
        },
        {
          value: '选项2',
          label: '专线网关'
        },
        {
          value: '选项3',
          label: '黑石私有网络'
        }
      ],
      value: '',
      input: '',

      formInfoObj: {
        key: undefined
      },
      formArr: []
    }
  },
  created () {
    this.formArr.push(this.formInfoObj)
  },
  methods: {
    // 生产一个新的obj对象
    copyObj: function () {
      var des = {
        key: undefined
      }
      return des
    },
    // 新增一行
    addRow: function () {
      var des = this.copyObj()
      this.formArr.push(des)
    },
    // 删除一行
    removeRow: function (idx) {
      this.formArr.splice(idx, 1)
    }
  }
}
</script>
<style lang="scss">
.el-select {
  .el-input__inner {
    height: 30px !important;
  }
}
</style>
<style lang='scss' scoped>
.tabOne {
  .btn {
    .el-button {
      height: 30px;
      background-color: #006eff;
      color: #fff;
      border: 1px solid #006eff;
      line-height: 0px;
      border-radius: 0px;
      font-size: 12px !important;
      padding: 10px 15px;
    }
    .el-button.is-plain:hover {
      background-color: #0063e5;
      color: #fff;
      border: 1px solid #0063e5;
    }
  }
  .table {
    margin-top: 20px;
    min-height: 450px;
    background: #fff;
    .close_color {
      color: #e54545;
    }
    .off_color {
      color: #0abf5b;
    }
  }
  .newDialog {
    span {
      color: #444;
    }
    .body-con {
      margin-top: 10px;
      .tr-con {
        display: table;
        width: 100%;
        padding: 10px;
        box-sizing: border-box;
        margin-bottom: 10px;
        background-color: #f7f7f7;
      }
    }
  }
  .dialog-footer {
    text-align: center;
    .el-button {
      height: 30px;
      line-height: 6px;
      border-radius: 0px;
    }
  }
}
</style>

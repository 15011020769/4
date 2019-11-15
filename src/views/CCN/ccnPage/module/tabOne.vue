<!--  -->
<template>
  <div class="tabOne">
    <div class="btn">
      <el-button type="text" @click="newVisible = true">{{$t("CCN.CCN.tabs.tab1new")}}</el-button>
    </div>
    <div class="table">
      <el-table :data="tableData" style="width: 100%">
        <template slot="empty">{{$t("CCN.CCN.tabs.tab1no")}}</template>
        <el-table-column prop="name" :label="$t('CCN.CCN.tabs.tab1tr1')" width>
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text">{{ scope.row.name }}</el-button>
            <p class="edit">12121</p>
          </template>
        </el-table-column>
        <el-table-column prop="status" :label="$t('CCN.CCN.tabs.tab1tr2')" width>
          <template slot-scope="scope">
            <div v-if="scope.row.status==0" class="close_color">关闭</div>
            <div v-if="scope.row.status==1" class="off_color">已连接</div>
          </template>
        </el-table-column>
        <el-table-column prop="type" :label="$t('CCN.CCN.tabs.tab1tr3')" width>
          <template slot-scope="scope">
            <div>私有网络</div>
          </template>
        </el-table-column>
        <el-table-column prop="bucketName" :label="$t('CCN.CCN.tabs.tab1tr4')" width>
          <template slot-scope="scope">我的帐号</template>
        </el-table-column>
        <el-table-column prop="createTime" :label="$t('CCN.CCN.tabs.tab1tr5')" width></el-table-column>
        <el-table-column prop="region" :label="$t('CCN.CCN.tabs.tab1tr6')" width></el-table-column>
        <el-table-column prop="operate" :label="$t('CCN.CCN.tabs.tab1tr7')" width>
          <template slot-scope="scope">
            <el-button type="text" @click="dialogVisible = true">解关联</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新建关联实例模态窗 -->
    <el-dialog :title="$t('CCN.CCN.tabs.tab1')" :visible.sync="newVisible" class="newDialog">
      <div>
        <span>
          {{$t("CCN.CCN.tabs.tab1new1")}}
        </span>
        <div class="body-con">
          <div class="tr-con" v-for="(item, index) in formArr">
            <td>
              <el-select v-model="value" :placeholder="$t('CCN.CCN.tabs.tab1new2')">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </td>
            <td>
              <el-select v-model="value" :placeholder="$t('CCN.CCN.tabs.tab1new4')">
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
               :placeholder="$t('CCN.CCN.tabs.select')"
                suffix-icon="el-icon-search"
                v-model="input"
              ></el-input>
            </td>
            <td>
              <a v-on:click="removeRow(index);" v-show="index >= 0">{{$t("CCN.CCN.total.td3")}}</a>
            </td>
          </div>
          <a v-on:click="addRow()" v-show="formArr.length < 5">添加</a>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="newVisible = false">提交</el-button>
        <el-button @click="newVisible = false">{{$t('CCN.CCN.tabs.tab1newc')}}</el-button>
      </div>
    </el-dialog>
    <!-- 解除关联模态窗 -->
    <el-dialog
      :title="$t('CCN.CCN.tabs.tab1del')"
      :visible.sync="dialogVisible"
      width="40%"
    >
      <span>{{$t('CCN.CCN.tabs.tab1del1')}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">{{$t('CCN.CCN.total.sure')}}</el-button>
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
          region: '中国台北',
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

<!--  -->
<template>
  <div class="tabThree">
    <div class="btn">
      <el-button type="text" @click="newVisible = true">购买带宽</el-button>
    </div>
    <div class="table">
      <el-table :data="tableData" style="width: 100%">
        <template slot="empty">暂无数据</template>
        <el-table-column prop="" label="地域A" width>
          <template slot-scope="scope">
            <p class="edit">12121</p>
          </template>
        </el-table-column>
        <el-table-column prop="" label="地域B" width>
          <template slot-scope="scope">
            台北
          </template>
        </el-table-column>
        <el-table-column prop="band" label="带宽上限(Mbps)" width> </el-table-column>
        <el-table-column prop="expireTime" label="到期时间" width></el-table-column>
        <el-table-column prop="" label="自动续费" width>
          <template slot-scope="scope">是</template>
        </el-table-column>
        <el-table-column prop="operate" label="操作" width>
          <template slot-scope="scope">
            <el-button type="text">解关联</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 购买带宽模态窗 -->
    <el-dialog title="购买带宽" :visible.sync="newVisible" class="newDialog">
      <div>
        <el-form :model="form">
          <el-form-item label="地域A" :label-width="formLabelWidth">
            <el-select v-model="form.region" placeholder="请选择地域">
              <el-option label="广州" value="shanghai"></el-option>
              <el-option label="北京" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="地域B" :label-width="formLabelWidth">
            <el-select v-model="form.regionB" placeholder="请选择地域">
              <el-option label="广州" value="shanghai"></el-option>
              <el-option label="北京" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="目标带宽上限" :label-width="formLabelWidth">
            <el-input placeholder="请输入内容" v-model="form.input">
              <template slot="append">Mbps</template>
            </el-input>
          </el-form-item>
          <el-form-item label="购买时长" :label-width="formLabelWidth">
            <el-radio-group v-model="form.radio" size="medium">
              <el-radio-button label="上海"></el-radio-button>
              <el-radio-button label="北京"></el-radio-button>
              <el-radio-button label="广州"></el-radio-button>
              <el-radio-button label="深圳"></el-radio-button>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="自动续费" :label-width="formLabelWidth">
            <el-checkbox v-model="form.checked">账户余额足够时，到期后按月自动续费</el-checkbox>
          </el-form-item>
          <el-form-item label="费用" :label-width="formLabelWidth">
            <span class="price">￥185.00</span>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="newVisible = false">确定</el-button>
        <el-button @click="newVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      newVisible: false,
      tableData: [
        {
          name: 'dddaa',
          status: '1',
          band: '10',
          expireTime: '2019-11-07 14：05：12'
        }
      ], // 列表数据
      form: {
        // 表单数据
        region: '',
        regionB: '',
        input: '',
        radio1: '上海',
        checked: false
      },
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
      formLabelWidth: '100px'
    }
  },
  created () {},
  methods: {}
}
</script>
<style lang="scss">
.el-form-item {
  .el-form-item__label {
    text-align: left;
  }
  .el-input {
    width: 120px;
  }
}
</style>
<style lang="scss" scoped>
.tabThree {
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
    .price {
      color: #ff7800;
      font-size: 24px;
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

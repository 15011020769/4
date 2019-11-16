<!--  -->
<template>
  <div class="tabThree">
    <!-- 地域间带宽 -->
    <div v-show="regionShow">
      <span
        >限速方式：地域间带宽限速 <a @click="updateBandwidthLimitTypeVisible = true">变更</a></span
      >
      <div class="table">
        <div class="btn">
          <el-button type="text" @click="newVisible = true">调整带宽</el-button>
        </div>
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
        </el-table>
      </div>
      <!--调整带宽模态窗 -->
      <el-dialog title="" :visible.sync="newVisible" class="newDialog">
        <div>
          <table class="table-div">
            <tr class="t-head">
              <td>地域A</td>
              <td>地域B</td>
              <td>带宽上限</td>
              <td></td>
            </tr>
            <tr class="t-body" v-for="(item, index) in formArr">
              <td>
                <el-select v-model="value" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </td>
              <td>
                <el-select v-model="value" placeholder="请选择">
                  <el-option
                    v-for="item in options2"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </td>
              <td>
                <el-input v-model="input">
                  <template slot="append">Mbps</template>
                </el-input>
              </td>
              <td>
                <a v-on:click="removeRow(index)" v-show="index >= 0"
                  ><i class="el-icon-error"></i
                ></a>
              </td>
            </tr>
            <tr>
              <td colspan="4" style="text-align: center;">
                <a v-on:click="addRow()" v-show="formArr.length < 5">添加</a>
              </td>
            </tr>
          </table>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="newVisible = false">确定</el-button>
          <el-button @click="newVisible = false">取消</el-button>
        </div>
      </el-dialog>
      <!-- 修改限速方式的模态窗 -->
      <el-dialog
        :title="$t('CCN.CCN.total.eWay')"
        :visible.sync="updateBandwidthLimitTypeVisible"
        class="formDialog"
      >
        <el-form :model="ccnPublic">
          <el-form-item :label="$t('CCN.CCN.total.eWay1')">
            <el-select v-model="ccnPublic.BandwidthLimitType" placeholder>
              <el-option :label="$t('CCN.CCN.total.eWay2')" value="INTER_REGION_LIMIT"></el-option>
              <el-option :label="$t('CCN.CCN.total.eWay3')" value="OUTER_REGION_LIMIT"></el-option>
            </el-select>
            <p class="edit-p">{{ $t('CCN.CCN.total.eWay4') }} <a href="">工單申請</a></p>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="updateBandwidthLimitTypeVisible = false">取 消</el-button>
          <el-button type="primary" @click="upBandwidthLimitType(ccnPublic)">{{
            $t('CCN.CCN.total.sure')
          }}</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 地域出带宽 -->
    <div v-show="!regionShow">
      <span
        >限速方式：地域出带宽限速 <a @click="updateBandwidthLimitTypeVisible = true">变更</a></span
      >
      <div class="table">
        <div class="btn">
          <el-button type="text" @click="updateVisible = true">调整带宽限速</el-button>
        </div>
        <el-table :data="tableData" style="width: 100%">
          <template slot="empty">暂无数据</template>
          <el-table-column prop="" label="地域" width>
            <template slot-scope="scope">
              <p class="edit">中国台北</p>
            </template>
          </el-table-column>
          <el-table-column prop="band" label="带宽上限(Mbps)" width> </el-table-column>
        </el-table>
      </div>
      <!--调整带宽限速模态窗 -->
      <el-dialog title="" :visible.sync="updateVisible" class="updateDialog">
        <div class="transfer">
          <div class="left">
            <span>添加地域出口限速</span>
            <div class="region">
              <el-checkbox v-model="checked">中国台北</el-checkbox>
            </div>
          </div>
          <div class="icon">
            <i class="el-icon-arrow-right"></i>
          </div>
          <div class="right">
            <span>已选择</span>
            <div class="region">
              <div class="t-head">
                <div>地域</div>
                <div>带宽上限</div>
              </div>
              <div class="t-body">
                <div>中国台北</div>
                <div>
                  <input type="text">
                </div>
              </div>
            </div>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="updateVisible = false">确定</el-button>
          <el-button @click="updateVisible = false">取消</el-button>
        </div>
      </el-dialog>
      <!-- 修改限速方式的模态窗 -->
      <el-dialog
        :title="$t('CCN.CCN.total.eWay')"
        :visible.sync="updateBandwidthLimitTypeVisible"
        class="formDialog"
      >
        <el-form :model="ccnPublic">
          <el-form-item :label="$t('CCN.CCN.total.eWay1')">
            <el-select v-model="ccnPublic.BandwidthLimitType" placeholder>
              <el-option :label="$t('CCN.CCN.total.eWay2')" value="INTER_REGION_LIMIT"></el-option>
              <el-option :label="$t('CCN.CCN.total.eWay3')" value="OUTER_REGION_LIMIT"></el-option>
            </el-select>
            <p class="edit-p">{{ $t('CCN.CCN.total.eWay4') }} <a href="">工單申請</a></p>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="updateBandwidthLimitTypeVisible = false">取 消</el-button>
          <el-button type="primary" @click="upBandwidthLimitType(ccnPublic)">{{
            $t('CCN.CCN.total.sure')
          }}</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      regionShow: false,
      newVisible: false,
      updateVisible: false,
      tableData: [
        {
          name: 'dddaa',
          status: '1',
          band: '10',
          expireTime: '2019-11-07 14：05：12'
        }
      ], // 列表数据
      options: [
        {
          value: '选项1',
          label: '北京'
        },
        {
          value: '选项2',
          label: '中国台北'
        },
        {
          value: '选项3',
          label: '广州'
        }
      ],
      options2: [
        {
          value: '选项1',
          label: '北京'
        },
        {
          value: '选项2',
          label: '中国台北'
        },
        {
          value: '选项3',
          label: '广州'
        }
      ],
      value: '',
      input: '',
      formLabelWidth: '100px',
      // 调整带宽
      formInfoObj: {
        key: undefined
      },
      formArr: [],

      updateBandwidthLimitTypeVisible: false,
      ccnPublic: {},
      // 穿梭框数据
      checked: false
    }
  },
  created () {
    this.formArr.push(this.formInfoObj)
  },
  methods: {
    // 修改限速方式弹窗
    updateBandwidthLimitType: function (ccnDetail) {
      this.ccnPublic = ccnDetail
      this.updateBandwidthLimitTypeVisible = true
    },
    upBandwidthLimitType: function (ccnDetail) {
      console.log(ccnDetail)
      var params = {
        Version: '2017-03-12',
        Region: 'ap-taipei',
        CcnId: ccnDetail.CcnId,
        BandwidthLimitType: ccnDetail.BandwidthLimitType
      }
      this.$axios.post('vpc2/ModifyCcnRegionBandwidthLimitsType', params).then(res => {
        console.log(params)
        console.log(res)
        console.log('修改成功')
        this.getData()
      })
      this.updateBandwidthLimitTypeVisible = false
    },
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
  .table {
    margin-top: 20px;
    min-height: 450px;
    padding: 20px 0 0 20px;
    background: #fff;
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
    .close_color {
      color: #e54545;
    }
    .off_color {
      color: #0abf5b;
    }
  }
  .newDialog {
    .table-div {
      width: 90%;
      padding: 5px;
      border: 1px solid #ddd;
      tr {
        width: 25%;
        a {
          text-align: center;
        }
      }
      .t-head {
        height: 45px;
      }
      .t-body {
        height: 45px;
        min-height: 200px;
      }
      .el-input {
        margin-bottom: 5px;
      }
    }
  }
  .formDialog {
    .edit-p {
      color: #e54545;
      line-height: 20px;
      margin-left: 10%;
    }
  }
  .updateDialog {
    .transfer {
      height: 260px;
      .left {
        float: left;
        width: 45%;
        .region {
          min-height: 200px;
          border: 1px solid #ddd;
          padding: 5px;
        }
      }
      .icon {
        display: inline-block;
        float: left;
        margin-top: 20%;
        font-size: 20px;
        font-weight: bold;
      }
      .right {
        width: 45%;
        float: left;
        .region {
          min-height: 200px;
          border: 1px solid #ddd;
          padding: 5px;
            .t-head {
              display: flex;
              padding: 0 5px;
              div{
                margin-right: 40px;
              }
            }
            .t-body {
             display: flex;
              // min-height: 200px;
              div{
                margin-right: 20px;
              }
            }

        }
      }
    }
  }
  .dialog-footer {
    margin-top: 20px;
    text-align: center;
    .el-button {
      height: 30px;
      line-height: 6px;
      border-radius: 0px;
    }
  }
}
</style>

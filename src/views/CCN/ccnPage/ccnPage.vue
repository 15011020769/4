<template>
  <div>
    <div class="title_top">
      <h1>云联网</h1>
    </div>
    <div class="tea-content__body">
      <div class="btn">
        <el-button type="text" @click="dialogFormVisible = true">新建</el-button>
      </div>
    </div>
    <div class="tables">
      <el-table :data="tableData" style="width: 100%">
        <template slot="empty">暂无数据</template>
        <el-table-column prop="CcnName" label="名称/ID" width="125">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text">{{ scope.row.CcnName }}</el-button>
            <p class="edit">
              <el-popover placement="bottom" width="210" v-model="visible">
                <div class="pop-div" style="height:40px;border-bottom:1px solid #ddd">
                  <input type="text" style="height:30px;width:100%" />
                </div>
                <div class="btn-footer" style="margin-top:10px;">
                  <el-button type="primary" size="mini" @click="visible = false">保存</el-button>
                  <el-button size="mini" type="text" @click="visible = false">取消</el-button>
                </div>
                <span slot="reference">
                  <i class="el-icon-edit"></i>
                </span>
              </el-popover>
            </p>
          </template>
        </el-table-column>
        <el-table-column prop="State" label="状态" width="80">
          <template slot-scope="scope">
            <div v-if="scope.row.State=='AVAILABLE'" class="off_color">运行中</div>
            <div v-else class="close_color">关闭</div>
          </template>
        </el-table-column>
        <el-table-column prop="QosLevel" label="服务质量" width="80">
          <template slot-scope="scope">
            <div v-if="scope.row.QosLevel=='PT'">白金</div>
            <div v-else-if="scope.row.QosLevel=='AU'">金</div>
            <div v-else-if="scope.row.QosLevel=='AG'">银</div>
            <div v-else>金</div>
          </template>
        </el-table-column>
        <el-table-column prop="InstanceCount" label="关联实例" width="100">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text">{{ scope.row.InstanceCount }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop label="备注" width="80">
          <template slot-scope="scope">
            <p class="edit">
              {{ scope.row.CcnDescription }}
              <el-popover placement="bottom" width="210" v-model="visibleDes">
                <div class="pop-div" style="height:40px;border-bottom:1px solid #ddd">
                  <input type="text" style="height:30px;width:100%" />
                </div>
                <div class="btn-footer" style="margin-top:10px;">
                  <el-button type="primary" size="mini" @click="visibleDes = false">保存</el-button>
                  <el-button size="mini" type="text" @click="visibleDes = false">取消</el-button>
                </div>
                <span slot="reference">
                  <i class="el-icon-edit"></i>
                </span>
              </el-popover>
            </p>
          </template>
        </el-table-column>
        <el-table-column prop="InstanceChargeType" label="计费模式" width="115">
          <template slot-scope="scope">
            <div v-if="scope.row.InstanceChargeType=='PREPAID'">预付费</div>
            <div v-else-if="scope.row.InstanceChargeType=='POSTPAID'">后付费</div>
            <div v-else>后付费</div>
          </template>
        </el-table-column>
        <el-table-column prop="BandwidthLimitType" label="限速方式" width="115">
          <template slot-scope="scope">
            <div class="edit" v-if="scope.row.BandwidthLimitType=='OUTER_REGION_LIMIT'">地域出口限速</div>
            <div class="edit" v-else-if="scope.row.BandwidthLimitType=='INTER_REGION_LIMIT'">地域间限速</div>
            <div class="edit" v-else>地域出口限速</div>
            <!-- <span class="edit">{{scope.row.BandwidthLimitType}}</span> -->
            <i type="text" @click="editVisible = true">
              <i class="el-icon-edit"></i>
            </i>
          </template>
        </el-table-column>
        <el-table-column prop="CreateTime" label="创建时间" width="200"></el-table-column>
        <el-table-column prop="operate" label="操作" width="180">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small">管理实例</el-button>
            <el-button type="text" size="small"></el-button>
            <el-button type="text" @click="dialogTagVisible = true">编辑标签</el-button>
            <br />
            <el-button type="text" @click="deleteCcnClick(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage4"
        :page-sizes="[10, 15, 20, 25, 30, 35, 40]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <!-- 删除的模态窗 -->
    <el-dialog title="您确认要删除该云联网吗？" :visible.sync="dialogTableVisible">
      <el-table :data="gridData">
        <el-table-column property="ID" label="ID" width="150"></el-table-column>
        <el-table-column property="CcnName" label="名称" width="200"></el-table-column>
        <el-table-column property="State" label="状态">
          <template slot-scope="scope">
            <div v-if="scope.row.State=='AVAILABLE'" class="off_color">运行中</div>
            <div v-else class="close_color">关闭</div>
          </template>
        </el-table-column>
        <el-table-column property="address" label="关联实例">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text">{{ scope.row.conn }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogTableVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 新建模态窗 -->
    <el-dialog title="新建云联网实例" :visible.sync="dialogFormVisible" class="newDialog">
      <el-form :model="form">
        <el-form-item label="名称">
          <el-input v-model="form.CcnName" autocomplete="off" class="inputName"></el-input>
        </el-form-item>

        <el-form-item label="计费模式">
          <el-radio-group v-model="form.InstanceChargeType">
            <el-radio label="PREPAID">预付费</el-radio>
            <el-radio label="POSTPAID">月95后付费</el-radio>
          </el-radio-group>
          <br />
          <span class="hint trankHint">为了便于测试连通性，地域间默认享有免费10Kbps带宽</span>
        </el-form-item>
        <el-form-item label="限速方式">
          <el-radio-group v-model="form.BandwidthLimitType">
            <el-radio label="OUTER_REGION_LIMIT">地域出口限速</el-radio>
            <el-radio label="INTER_REGION_LIMIT">地域间限速</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 8}"
            placeholder="请输入内容"
            v-model="form.CcnDescription"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="服务质量">
          <el-radio-group v-model="form.QosLevel">
            <el-radio label="PT">白金</el-radio>
            <el-radio label="AU">金</el-radio>
            <el-radio label="AG">银</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="关联实例">
          <el-select v-model="form.vpc" placeholder="请选择私有网络">
            <el-option label="私有网络" value="VPC"></el-option>
            <el-option label="专线网关" value="DIRECTCONNECT"></el-option>
            <el-option label="黑石私有网络" value="BMVPC"></el-option>
          </el-select>
          <el-select v-model="form.Region" placeholder="请选择所属区域">
            <!-- <el-option label="华南地区(广州)" value="ap-taipei"></el-option> -->
            <el-option label="港澳台地区(中国台北)" value="ap-taipei"></el-option>
          </el-select>
          <el-select v-model="form.item" placeholder="搜索VPC名称或ID">
            <el-option label="vpc-cpoj691h(TestVPC|10.8.0.0/16)" value></el-option>
            <el-option label="vpc-12uojx67(123|172.16.0.0/16)" value></el-option>
            <el-option label="vpc-d8dncvmt(sa|10.0.0.0/16)" value></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="createClick(form)">确 定</el-button>
        <!-- <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button> -->
      </div>
    </el-dialog>
    <!-- 编辑模态窗 -->
    <el-dialog title="您已经选择1个云资源" :visible.sync="dialogTagVisible" class="editDialog">
      <table class="table-div">
        <tr class="t-head">
          <td>标签键</td>
          <td>标签值</td>
          <td>删除</td>
        </tr>
        <tr class="t-body" v-for="(item, index) in formArr">
          <td>
            <input type="text" />
          </td>
          <td>
            <input type="text" />
          </td>
          <td>
            <a v-on:click="removeRow(index);" v-show="index >= 0">删除</a>
          </td>
        </tr>
      </table>
      <a v-on:click="addRow()" v-show="formArr.length < 5">添加</a>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogTagVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogTagVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改限速方式的模态窗 -->
    <el-dialog title="变更限速方式" :visible.sync="editVisible" class="formDialog">
      <el-form :model="formWay">
        <el-form-item label="限速方式">
          <el-select v-model="formWay.way" placeholder>
            <el-option label="地域间带宽" value="INTER_REGION_LIMIT"></el-option>
            <el-option label="地域出带宽" value="OUTER_REGION_LIMIT"></el-option>
          </el-select>
          <p class="edit-p">注意：变更后，原有限速配置将删除， 带宽将设置为 1Gbps（默认），如需更大默认带宽，请提 <a href="">工单申请</a></p>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="editVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      value1: '',
      input3: '',
      visible: false,
      visibleDes: false,
      tableData: [
        {
          // BandwidthLimitType: "INTER_REGION_LIMIT",
          // CcnDescription: "hi",
          // CcnId: "ccn-5d8lfgtn",
          // CcnName: "xs",
          // CreateTime: "2019-11-11 09:44:24",
          // InstanceChargeType: "PREPAID",
          // InstanceCount: 1,
          // QosLevel: "AU",
          // State: "AVAILABLE"
        }
      ], 
      // 列表数据
      currentPage4: 1,
      total: 0,
      gridData: [
        {
          ID: 'ccn-5d8lfgtn',
          CcnName: 'xs',
          State: 'AVAILABLE',
          conn: '1'
        }
      ],
      // 新建ccn表单
      form: {
        CcnName: '',
        InstanceChargeType: 'POSTPAID',
        BandwidthLimitType: 'OUTER_REGION_LIMIT',
        CcnDescription: '',
        QosLevel: 'AU',
        vpc: '',
        Region: '',
        item: ''
      },
      formWay: {
        way: '地域间带宽'
      },
      dialogTableVisible: false, // 删除模态窗
      dialogFormVisible: false, // 新建模态窗
      dialogTagVisible: false, // 编辑模态窗
      editVisible: false, // 修改限速方式模态窗

      formInfoObj: {
        key: undefined
      },
      formArr: [],
      baijin:"PT"
    }
  },
  created () {
    this.getData()
    this.formArr.push(this.formInfoObj)
  },
  methods: {
    // 初始化CCN列表数据
    getData () {
      var params = {
        Version: "2017-03-12",
        Region: "ap-taipei"
      }
      this.$axios.post("vpc2/DescribeCcns", params).then(res => {
        console.log(params);
        console.log(res);
        // console.log(res.Response.CcnSet);
        console.log("成功");
        this.tableData = res.Response.CcnSet;
        this.total = res.Response.TotalCount;
      })
    },

    // 详情页跳转
    handleClick (rows) {
      this.$router.push({
        path: '/ccnDetail',
        query: {
          ccnList: rows.CcnName
        }
      })
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
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
    },
    // 新增ccn
    createClick: function (form) {
      console.log(form)
      var params = {
        Version: "2017-03-12",
        Region: "ap-taipei",
        CcnName: form.CcnName,
        // CcnDescription: form.CcnDescription,
        // QosLevel: form.QosLevel,
        // InstanceChargeType: form.InstanceChargeType,
        // BandwidthLimitType: form.BandwidthLimitType
      }
      this.$axios.post("vpc2/CreateCcn", params).then(res => {
        console.log(params);
        console.log(res);
        console.log("新建成功");
      })
      this.dialogFormVisible = false;
      this.getData();
    },
    // 删除ccn
    deleteCcnClick: function (ccnDetail) {
      console.log(ccnDetail);
      var params = {
        Version: "2017-03-12",
        Region: "ap-taipei",
        CcnId: ccnDetail.CcnId
      }
      this.$axios.post("vpc2/DeleteCcn", params).then(res => {
        console.log(params);
        console.log(res);
        console.log("删除成功");
      })
      this.getData();
    }
  }
}
</script>
<style lang="scss">
.el-input__inner {
  height: 30px;
}
</style>
<style scoped lang="scss">
.title_top {
  height: 50px;
  background: #fff;
  h1 {
    padding-left: 20px;
    line-height: 50px;
    font-size: 16px;
    font-weight: 700;
  }
}
.tea-content__body {
  padding: 20px;
  .explain {
    font-size: 12px;
    padding: 10px 30px 10px 20px;
    vertical-align: middle;
    color: #003b80;
    border: 1px solid #97c7ff;
    border-radius: 2px;
    background: #e5f0ff;
    position: relative;
    box-sizing: border-box;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 20px;
    p {
      line-height: 20px;
    }
  }
}
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
.tables {
  margin-top: 10px;
  margin: 0 20px;
  .el-table th > .cell {
    font-size: 12px;
  }
  .el-table td {
    font-size: 12px;
  }
  .el-table .cell {
    height: 23px;
  }
  .el-button--text {
    height: 23px;
    line-height: 0px;
  }
  .el-table td:nth-of-type(2) {
    color: #006eff;
  }
  .close_color {
    color: #e54545;
  }
  .off_color {
    color: #0abf5b;
  }
  .el-pagination {
    float: right;
  }
  .el-popover {
    .btn-footer {
      text-align: center;
      margin: 0;
    }
    .pop-div {
      height: 40px;
    }
  }

  .el-icon-edit {
    display: none;
  }
  .el-table__row:hover {
    .el-icon-edit {
      display: inline-block;
    }
  }
}
.newDialog {
  .inputName {
    width: 370px;
    float: left;
    margin-left: 30px;
  }
  .el-textarea {
    width: 370px;
    height: 100px;
    float: left;
    margin-left: 30px;
    .el-textarea__inner {
      height: 100px;
    }
  }
  .trankHint {
    color: #888 !important;
    font-size: 12px;
    margin-left: 10%;
  }
  .el-select {
    margin-right: 10px;
  }
}
.editDialog {
  .table-div {
    width: 90%;
    border: 1px solid #ddd;
    tr {
      width: 30%;
    }
    .t-head {
      height: 45px;
      padding: 0 5px;
    }
    .t-body {
      height: 45px;
      min-height: 200px;
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
</style>

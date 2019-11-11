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
        <el-table-column prop="name" label="名称/ID" width="125">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text">{{ scope.row.name }}</el-button>
            <p class="edit">
              12121
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
        <el-table-column prop="status" label="状态" width="80">
          <template slot-scope="scope">
            <div v-if="scope.row.status==0" class="close_color">关闭</div>
            <div v-if="scope.row.status==1" class="off_color">运行中</div>
          </template>
        </el-table-column>
        <el-table-column prop="service" label="服务质量" width="80">
          <template slot-scope="scope">
            <div>金</div>
          </template>
        </el-table-column>
        <el-table-column prop="bucketName" label="关联实例" width="100">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text">{{ scope.row.bucketName }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop label="备注" width="80">
          <template slot-scope="scope">
            <p class="edit">
              1
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
        <el-table-column prop="mode" label="计费模式" width="115"></el-table-column>
        <el-table-column prop label="限速方式" width="115">
          <template slot-scope="scope">
            <span class="edit">{{scope.row.limite}}</span>
            <i type="text" @click="editVisible = true">
              <i class="el-icon-edit"></i>
            </i>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="200"></el-table-column>
        <el-table-column prop="operate" label="操作" width="180">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small">管理实例</el-button>
            <el-button type="text" size="small"></el-button>
            <el-button type="text" @click="dialogTagVisible = true">编辑标签</el-button>
            <br />
            <el-button type="text" @click="dialogTableVisible = true">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage4"
        :page-sizes="[10,15, 20,25, 30, 35,40]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="20"
      ></el-pagination>
    </div>
    <!-- 删除的模态窗 -->
    <el-dialog title="您确认要删除该云联网吗？" :visible.sync="dialogTableVisible">
      <el-table :data="gridData">
        <el-table-column property="ID" label="ID" width="150"></el-table-column>
        <el-table-column property="name" label="名称" width="200"></el-table-column>
        <el-table-column property="status" label="状态">
          <template slot-scope="scope">
            <div v-if="scope.row.status==0" class="close_color">关闭</div>
            <div v-if="scope.row.status==1" class="off_color">运行中</div>
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
          <el-input v-model="form.name" autocomplete="off" class="inputName"></el-input>
        </el-form-item>

        <el-form-item label="计费模式">
          <el-radio-group v-model="form.radio">
            <el-radio :label="0">预付费</el-radio>
            <el-radio :label="1">月95后付费</el-radio>
          </el-radio-group>
          <br />
          <span class="hint trankHint">为了便于测试连通性，地域间默认享有免费10Kbps带宽</span>
        </el-form-item>
        <el-form-item label="限速方式">
          <el-radio-group v-model="form.radio2">
            <el-radio :label="0">地域出口限速</el-radio>
            <el-radio :label="1">地域间限速</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 8}"
            placeholder="请输入内容"
            v-model="form.textarea"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="服务质量">
          <el-radio-group v-model="form.radio3">
            <el-radio :label="0">白金</el-radio>
            <el-radio :label="1">金</el-radio>
            <el-radio :label="2">银</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="关联实例">
          <el-select v-model="form.vpc" placeholder="请选择私有网络">
            <el-option label="私有网络" value="VPC"></el-option>
            <el-option label="专线网关" value="DIRECTCONNECT"></el-option>
            <el-option label="黑石私有网络" value="BMVPC"></el-option>
          </el-select>
          <el-select v-model="form.region" placeholder="请选择所属区域">
            <el-option label="华南地区(广州)" value></el-option>
            <el-option label="华东地区(上海)" value></el-option>
            <el-option label="港澳台地区(中国台北)" value></el-option>
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
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
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
          name: '函数1',
          status: '1',
          monitor: '监控',
          service: '金',
          bucketName: '1',
          desc: '1',
          mode: '预付费',
          limite: '地域间限速',
          createTime: '2019-11-07 14：05：12'
        }
      ], // 列表数据
      currentPage4: 1,
      gridData: [
        {
          ID: 'ccn-5d8lfgtn',
          name: 'xs',
          status: '1',
          conn: '1'
        }
      ],
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
        radio: 1,
        radio2: 1,
        radio3: 0
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
      formArr: []
    }
  },
  created () {
    this.getData()
    this.formArr.push(this.formInfoObj)
  },
  methods: {
    // 详情页跳转
    handleClick (rows) {
      this.$router.push({
        path: '/ccnDetail',
        query: {
          ccnList: rows.name
        }
      })
    },
    getData () {},
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

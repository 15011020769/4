<!--  -->
<template>
  <div class="tabOne">
    <div class="btn">
      <el-button type="text" @click="newVisible = true">{{$t("CCN.CCN.tabs.tab1new")}}</el-button>
    </div>
    <div class="table">
      <el-table :data="tableData" style="width: 100%">
        <template slot="empty">{{$t("CCN.CCN.tabs.tab1no")}}</template>
        <el-table-column prop="InstanceId" :label="$t('CCN.CCN.tabs.tab1tr1')" width>
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text">{{ scope.row.InstanceId }}</el-button>
            <p class="edit">{{ scope.row.InstanceName }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="State" :label="$t('CCN.CCN.tabs.tab1tr2')" width>
          <template slot-scope="scope">
            <div v-if="scope.row.State=='ACTIVE'" class="off_color">已连接</div>
            <div v-else-if="scope.row.State=='PENDING'" class="off_color">申请中</div>
            <div v-else-if="scope.row.State=='EXPIRED'" class="close_color">已过期</div>
            <div v-else-if="scope.row.State=='REJECTED'" class="close_color">已拒绝</div>
            <div v-else-if="scope.row.State=='DELETED'" class="close_color">已删除</div>
            <div v-else-if="scope.row.State=='FAILED'" class="close_color">失败的（2小时后将异步强制解关联）</div>
            <div v-else-if="scope.row.State=='ATTACHING'" class="off_color">关联中</div>
            <div v-else-if="scope.row.State=='DETACHING'" class="off_color">解关联中</div>
            <div v-else-if="scope.row.State=='DETACHFAILED'" class="close_color">解关联失败（2小时后将异步强制解关联）</div>
            <!-- <div v-else-if="scope.row.State==''" class="off_color"></div> -->
          </template>
        </el-table-column>
        <el-table-column prop="InstanceType" :label="$t('CCN.CCN.tabs.tab1tr3')" width>
          <template slot-scope="scope">
            <div v-if="scope.row.InstanceType=='VPC'">私有网络</div>
            <div v-else-if="scope.row.InstanceType=='DIRECTCONNECT'">专线网关</div>
          </template>
        </el-table-column>
        <el-table-column prop="InstanceUin" :label="$t('CCN.CCN.tabs.tab1tr4')" width>
          <template slot-scope="scope" >我的帐号</template>
        </el-table-column>
        <el-table-column prop="AttachedTime" :label="$t('CCN.CCN.tabs.tab1tr5')" width>
          <template slot-scope="scope" >{{ scope.row.AttachedTime }}
          </template>
        </el-table-column>
        <el-table-column prop="InstanceRegion" :label="$t('CCN.CCN.tabs.tab1tr6')" width>
          <template slot-scope="scope" >
            <div v-if="scope.row.InstanceRegion=='ap-guangzhou'">广州</div>
            <div v-else-if="scope.row.InstanceRegion=='ap-taipei'">台北</div>
            <div v-else-if="scope.row.InstanceRegion=='ap-chengdu'">成都</div>
            <div v-else-if="scope.row.InstanceRegion=='ap-beijing'">北京</div>
            <div v-else-if="scope.row.InstanceRegion=='ap-shanghai'">上海</div>
            <div v-else>{{ scope.row.InstanceRegion }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="operate" :label="$t('CCN.CCN.tabs.tab1tr7')" width>
          <template slot-scope="scope">
            <el-button type="text" @click="delCcnIns(scope.row)">解关联</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新建关联实例模态窗 -->
    <el-dialog :title="$t('CCN.CCN.tabs.tab1')" :visible.sync="newVisible" class="newDialog">
      <el-form :model="form">
        <div>
          <span>
            {{$t("CCN.CCN.tabs.tab1new1")}}
          </span>
          <div class="body-con">
            <div class="tr-con" v-for="(item, index) in formArr">
              <td>
                <el-select v-model="form.instanceType" :placeholder="$t('CCN.CCN.tabs.tab1new2')">
                  <el-option label="私有网络" value="VPC"></el-option>
                  <el-option label="专线网关" value="DIRECTCONNECT"></el-option>
                </el-select>
                <!-- <el-select v-model="value" :placeholder="$t('CCN.CCN.tabs.tab1new2')">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select> -->
              </td>
              <td>
                <el-select v-model="form.instanceRegion" :placeholder="$t('CCN.CCN.tabs.tab1new4')">
                  <el-option label="港澳台地区(中国台北)" value="ap-taipei"></el-option>
                </el-select>
                <!-- <el-select v-model="value" :placeholder="$t('CCN.CCN.tabs.tab1new4')">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select> -->
              </td>
              <td>
                <el-select v-model="form.instanceId" :placeholder="$t('CCN.CCN.tabs.select')">
                  <el-option
                    v-for="(item2,index2) in vpcs"
                    :key="index2"
                    :label="item2.VpcId"
                    :value="item2.VpcId"
                  ></el-option>
                </el-select>
                <!-- <el-input
                  size="small"
                :placeholder="$t('CCN.CCN.tabs.select')"
                  suffix-icon="el-icon-search"
                  v-model="input"
                ></el-input> -->
              </td>
              <!-- <td>
                <a v-on:click="removeRow(index);" v-show="index >= 0">{{$t("CCN.CCN.total.td3")}}</a>
              </td> -->
            </div>
            <!-- <a v-on:click="addRow()" v-show="formArr.length < 5">添加</a> -->
          </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="attCcnIns(form)">提交</el-button>
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
        <el-button type="primary" @click="doDelCcnIns()">{{$t('CCN.CCN.total.sure')}}</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      ccnId: '',
      newVisible: false,
      dialogVisible: false,
      tableData: [{}], // 列表数据
      // 解关联模态窗回显数据
      instance:{
        CcnId:'',
        InstanceId:'',
        InstanceRegion:'',
        InstanceType:''
      },
      // 添加关联实例，根据私有网络/专线网络查询VPC列表
      vpcs: [{}],
      // 添加关联实例表单
      form: {
        instanceType: '',
        instanceRegion: 'ap-taipei',
        instanceId: ''
      },
      value: '',
      input: '',

      formInfoObj: {
        key: undefined
      },
      formArr: []
    }
  },
  watch: {
    "form.instanceType": function (value) {
      // console.log(value)
      this.getInstanceIds(value)
    },
  },
  created () {
    console.log(this.$route.query)
    this.ccnId = this.$route.query.ccnId
    this.getData()
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
    },
    // 初始化数据
    getData: function (){
      var params = {
        Version: "2017-03-12",
        Region: "ap-taipei",
        CcnId: this.ccnId
      }
      // 查询关联实例列表
      this.$axios.post("vpc2/DescribeCcnAttachedInstances", params).then(res => {
        console.log(res);
        this.tableData = res.Response.InstanceSet;
        this.total = res.Response.TotalCount;
      })
    },
    // 解除关联模态窗-回显数据
    delCcnIns: function (ins) {
      this.instance.CcnId = ins.CcnId
      this.instance.InstanceId = ins.InstanceId
      this.instance.InstanceRegion = ins.InstanceRegion
      this.instance.InstanceType = ins.InstanceType
      console.log(this.instance)
      this.dialogVisible = true
    },
    doDelCcnIns: function () {
      var params = {
        Version: "2017-03-12",
        Region: "ap-taipei",
        CcnId: this.instance.CcnId,
        'Instances.0.InstanceId': this.instance.InstanceId,
        'Instances.0.InstanceRegion': this.instance.InstanceRegion,
        'Instances.0.InstanceType': this.instance.InstanceType
      }
      this.$axios.post("vpc2/DetachCcnInstances", params).then(res => {
        console.log(params);
        console.log(res);
        this.getData();
      })
      this.dialogVisible = false
    },
    // 查询instanceId
    getInstanceIds: function (instanceType) {
      console.log(instanceType)
      var params = {
        Version: '2017-03-12',
        Region: 'ap-taipei'
      }
      if (instanceType == "VPC") {  // 私有网络
        this.$axios.post("vpc2/DescribeVpcs", params).then(res => {
          console.log(res)
          this.vpcs = res.Response.VpcSet;
        })
      } else if (instanceType == "DIRECTCONNECT") { // 专线网络
        this.$axios.post("vpc2/DescribeDirectConnectGateways", params).then(res => {
          console.log(res)
          this.vpcs = res.Response.DirectConnectGatewaySet;
        })
      }
    },
    // 新增关联实例
    attCcnIns: function (ins) {
      // 关联实例
      var params = {
        Version: "2017-03-12",
        Region: 'ap-taipei',
        CcnId: this.ccnId,
        'Instances.0.InstanceId': ins.instanceId,
        'Instances.0.InstanceRegion': ins.instanceRegion,
        'Instances.0.InstanceType': ins.instanceType
      }
      console.log(params);
      this.$axios.post("vpc2/AttachCcnInstances", params).then(res => {
        console.log(res);
        this.getData();
      })
      console.log("新建成功");
      this.newVisible = false;
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

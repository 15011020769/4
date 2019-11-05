<template>
  <div class="edit">
    <el-dialog :visible.sync="configurateStatus.configurateDialog" :show-close="false" width="60%">
      <div slot="title" class="title-wrap">
        <span>调整配置</span>
        <i class="el-icon-close" @click="handleCancel(false)"></i>
      </div>
      <div class="content">
        <div class="contentSlider">
          <div class="sliderOne">
            <span :class="['circle',step==1?'st1':'st2']">
              <span v-if="step==1" class="number">1</span>
              <span v-else :class="['el-icon-check','number']"></span>
            </span>
            <span :class="['slidetitle',step==1?'st7':'']">选择目标配置</span>
          </div>
          <div class="sliderCenter">
            <i class="el-icon-arrow-right"></i>
          </div>
          <div class="sliderTwo">
            <span :class="['circle',step==2?'st4':'st3']">
              <span :class="['number',step==2?'':'st5']">2</span>
            </span>
            <span :class="['slidetitle',step==2?'st8':'st6']">费用统计</span>
          </div>
          <div class="sliderCenter">
            <i class="el-icon-arrow-right"></i>
          </div>
          <div class="sliderThree">
            <span :class="['circle',step==3?'st4':'st3']">
              <span :class="['number',step==3?'':'st5']">3</span>
            </span>
            <span :class="['slidetitle',step==3?'st8':'st6']">关机提示</span>
          </div>
        </div>
        <div class="listContent">
          <div v-show="step==1" class="firstContent">
            <span>
              已选
              <span>1</span>台 实例，
            </span>
            <span class="packdown">查看详情</span>
            <el-button type="text" class="basicInfo-pack" @click="handlePack">
              <i :class="[basic?'el-icon-arrow-up':'el-icon-arrow-down']"></i>
            </el-button>
            <div :class="[basic?'tableList':'']">
              <el-table
                ref="instanceTable"
                :data="instanceInfo"
                :header-cell-style="{'font-size':'12px'}"
                :row-style="tableRowStyle"
                v-if="basic"
                style="margin-top: 10px;"
              >
                <el-table-column type="index" width="55" label="No"></el-table-column>
                <el-table-column label="实例名称" prop="InstanceName"></el-table-column>
                <el-table-column label="实例ID" prop="InstanceId"></el-table-column>

                <el-table-column label="当前配置">
                  <template slot-scope="scope">
                    <div>
                      <span>{{scope.row.InstanceType}}(标准型S2,{{scope.row.CPU}}核{{scope.row.Memory}}GB)</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="计费时长">
                  <template slot-scope="scope">
                    <div>
                      <span>{{scope.row.ExpiredTime}}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="状态">
                  <template slot-scope="scope">
                    <div>
                      <span>{{scope.row.InstanceState |cvmState}}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <div>
                      <span v-show="btnBig">可调整配置</span>
                      <span v-show="!btnBig">大数据机型不支持调整配置</span>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div>
              <p>请选择您的目标配置</p>
              <div style="margin-bottom:10px;">
                <el-select v-model="chioce.cpu" placeholder size="mini" style="margin-left:10px;">
                  <el-option
                    v-for="item in CPUList"
                    :key="item.key"
                    :label="item.val"
                    :value="item.key"
                  ></el-option>
                </el-select>
                <el-select
                  v-model="chioce.memory"
                  placeholder
                  size="mini"
                  style="margin-left:10px;"
                >
                  <el-option
                    v-for="item in memoryList"
                    :key="item.key"
                    :label="item.val"
                    :value="item.key"
                  ></el-option>
                </el-select>
                <el-select v-model="chioce.type" placeholder size="mini" style="margin-left:10px;">
                  <el-option
                    v-for="item in typeList"
                    :key="item.key"
                    :label="item.val"
                    :value="item.key"
                  ></el-option>
                </el-select>
                <!-- 目标配置选择 -->
                <el-table
                  ref="targetInstance"
                  border
                  :data="targetInstance"
                  v-loading="loading"
                  style="width: 100%"
                  :header-cell-style="{'font-size':'12px'}"
                  :row-style="tableRowStyle"
                  max-height="200px"
                >
                  <el-table-column width="55">
                    <template slot-scope="scope">
                      <el-radio
                        v-model="radio"
                        :label="scope.row.InstanceType"
                        @change="getSelectPlan(scope.row.InstanceType)"
                      >{{""}}</el-radio>
                    </template>
                  </el-table-column>
                  <el-table-column label="机型" width="60" prop="TypeName"></el-table-column>
                  <el-table-column label="规格" width="100" prop="InstanceType"></el-table-column>
                  <el-table-column label="vCPU" width="70" prop="name">
                    <template slot-scope="scope">
                      <div>
                        <span>{{scope.row.Cpu}}核</span>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="内存" width="70">
                    <template slot-scope="scope">
                      <div>
                        <span>{{scope.row.Memory}}GB</span>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="InstanceType" label="处理器型号(主频)">
                    <template slot-scope="scope">
                      <div>
                        <span>{{scope.row.CpuModelName}}({{scope.row.Frequency}})</span>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="内网带宽" width="90" prop="name">
                    <template slot-scope="scope">
                      <div>
                        <span>{{scope.row.MaxBandwidth}}Gbps</span>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="网络收发包" width="90" prop="name">
                    <template slot-scope="scope">
                      <div>
                        <span>{{scope.row.Pps}}万pps</span>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="备注" width="70" prop="name">
                    <template slot-scope="scope">
                      <div>
                        <span v-if="scope.row.Remark">{{scope.row.Remark}}</span>
                        <span v-else></span>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
                <div class="cvm-pag">
                  <el-pagination
                    @size-change="sizeChangeHandle"
                    @current-change="currentChangeHandle"
                    :current-page="pageIndex"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size="pageSize"
                    :total="totalPage"
                    layout="total, sizes, prev, pager, next, jumper"
                  ></el-pagination>
                </div>
              </div>
            </div>
          </div>
          <div v-show="step==2" class="sencondContent">
            <el-table
              ref="instanceTable"
              :data="instanceInfo"
              :header-cell-style="{'font-size':'12px'}"
              :row-style="tableRowStyle"
              v-if="basic"
              style="margin-top: 10px;"
            >
              <el-table-column type="index" width="55" label="No"></el-table-column>
              <el-table-column label="实例名" prop="InstanceName"></el-table-column>
              <el-table-column label="实例ID" prop="InstanceId"></el-table-column>
              <el-table-column label="当前配置">
                <template slot-scope="scope">
                  <div>
                    <span>{{scope.row.InstanceType}}(标准型S2,{{scope.row.CPU}}核{{scope.row.Memory}}GB)</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="目标配置">
                <template slot-scope="scope">
                  <div>
                    <span>{{scope.row.InstanceType}}(标准型S2,{{scope.row.CPU}}核{{scope.row.Memory}}GB)</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="计费时长">
                <template slot-scope="scope">
                  <div>
                    <span>{{scope.row.ExpiredTime}}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="费用">
                <template slot-scope="scope">
                  <div class="cost">
                    <span style="狗">1275元</span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <div class="cost">
              <span>需支付费用合计</span>
              <span class="paycost">1275元</span>
            </div>
            <div>
              <el-checkbox v-model="agree">
                已阅读并同意
                <a href>实例调整配置费用说明</a>
              </el-checkbox>
            </div>
          </div>
          <div v-show="step==3" class="thirdContent">
            <div>
              <span style="font-weight:bolder;">调整配置需要在关机状态下操作，目前所选实例已处于关机状态</span>
            </div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="prevStep()" v-show="step>1">上一步</el-button>
          <el-button type="primary" size="mini" v-show="firstStatus" @click="nextStep">下一步</el-button>
          <el-button
            type="primary"
            size="mini"
            :disabled="!agree"
            v-show="secondstatus"
            @click="nextStep"
          >下一步</el-button>
          <el-button type="primary" size="mini" v-show="step==3" @click="handleCancel(true)">开始调整</el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      basic: true,
      btnBig: true, //可调整配置
      loading: false,
      radio: "", //目标配置勾选项
      step: 3, //当前节点
      pageIndex: 1, // 当前页
      pageSize: 10, // 每页数
      totalPage: 0, // 表格数据数组长度
      agree: false, //同意实例
      instanceInfo: [], //实例列表
      targetInstance: [], //目标配置列表
      rules: {
        instancename: [
          {
            required: true,
            message: "你还可以输入49个字符",
            trigger: "blur"
          }
        ]
      },
      CPUList: [
        {
          key: 1,
          val: 1
        },
        {
          key: 2,
          val: 2
        },
        {
          key: 3,
          val: 3
        }
      ],
      memoryList: [
        {
          key: 1,
          val: 1
        },
        {
          key: 2,
          val: 2
        },
        {
          key: 3,
          val: 3
        }
      ],
      typeList: [
        {
          key: 1,
          val: 1
        },
        {
          key: 2,
          val: 2
        },
        {
          key: 3,
          val: 3
        }
      ],
      chioce: {}
    };
  },
  props: {
    configurateStatus: {
      type: Object,
      default: () => []
    }
  },
  computed: {
    firstStatus() {
      return this.step == 1 && this.radio;
    },
    secondstatus() {
      return this.step == 2;
    }
  },
  mounted() {
    this.instanceInfo = this.configurateStatus.InstanceItem;
    this.gettypeList(); //获取实例详情
    this.getTaretList(); //获取目标配置
  },
  methods: {
    tableRowStyle({ row, rowIndex }) {
      return {
        "font-size": "12px"
      };
    },
    //折叠
    handlePack() {
      this.basic = !this.basic;
    },
    //获取机型列表
    gettypeList() {
      var params = {
        Version: "2017-03-12",
        Region: this.$cookie.get("regionv2")
      };
      this.axios.post("cvm2/DescribeInstanceConfigInfos", params).then(data => {
        // this.typeList = data.Response
      });
    },
    //获取目标配置列表
    getTaretList() {
      var params = {
        Version: "2017-03-12",
        Region: this.$cookie.get("regionv2"),
        "Filters.0.Name": "zone",
        "Filters.0.Values.0": "ap-chengdu-1",
        "Filters.1.Name": "instance-charge-type",
        "Filters.1.Values.0": "POSTPAID_BY_HOUR"
      };
      this.axios
        .post("cvm2/DescribeZoneInstanceConfigInfos", params)
        .then(data => {
          this.targetInstance = data.Response.InstanceTypeQuotaSet;
          console.log(this.targetInstance);
        });
    },
    //选择目标配置
    getSelectPlan(val) {},
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val;
      this.pageIndex = 1;
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val;
    },
    //下一步
    nextStep() {
      if (this.step < 3) {
        this.step = this.step + 1;
      }
    },
    //上一步
    prevStep() {
      if (this.step > 1) {
        this.step = this.step - 1;
      }
    },
    handleCancel(val) {
      if (val) {
        var params = {
          Version: "2017-03-12",
          Region: this.$cookie.get("regionv2"),
          "InstanceIds.0": "ins-r8hr2upy",
          InstanceType: "S1.LARGE4"
        };
        this.axios.post("cvm2/ResetInstancesType", params).then(data => {});
      }
      this.$emit("close", false);
    }
  },
  components: {}
};
</script>
<style lang="scss" scoped>
.edit {
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
    }
  }
  .content {
    font-size: 12px;
    .contentSlider {
      border-bottom: 1px solid #ccc;
      padding-bottom: 10px;
      .sliderOne {
        display: inline-block;
        .circle {
          border-radius: 50%;
          height: 25px;
          width: 25px;
          display: inline-block;
          vertical-align: top;
          .number {
            display: block;
            color: #fff;
            height: 25px;
            line-height: 25px;
            text-align: center;
            font-size: 12px;
            font-weight: bolder;
          }
          .el-icon-check {
            color: #006eff;
            font-weight: bolder;
          }
        }
        .st1 {
          background: #006eff;
        }
        .st2 {
          border: 1px solid #006eff;
        }
        .st7 {
          font-weight: bolder;
        }
        .slidetitle {
          display: inline-block;
          margin-left: 20px;
          font-size: 12px;
        }
      }
      .sliderCenter {
        display: inline-block;
        .el-icon-arrow-right {
          font-size: 24px;
          margin: 0 20px;
          color: #ddd;
        }
      }
      .sliderTwo {
        display: inline-block;
        .circle {
          border-radius: 50%;
          height: 25px;
          width: 25px;
          display: inline-block;
          vertical-align: top;
          .number {
            display: block;
            color: #fff;
            height: 25px;
            line-height: 25px;
            text-align: center;
            font-size: 12px;
            font-weight: bolder;
          }
          .st5 {
            color: #ccc;
          }
        }
        .st3 {
          border: 1px solid #ccc;
        }
        .st4 {
          background: #006eff;
        }
        .slidetitle {
          display: inline-block;
          margin-left: 20px;
          font-size: 12px;
        }
        .st6 {
          color: #ccc;
        }
        .st8 {
          font-weight: bolder;
        }
      }
      .sliderThree {
        display: inline-block;
        .circle {
          border-radius: 50%;
          height: 25px;
          width: 25px;
          display: inline-block;
          vertical-align: top;
          .number {
            display: block;
            color: #fff;
            height: 25px;
            line-height: 25px;
            text-align: center;
            font-size: 12px;
            font-weight: bolder;
          }
          .st5 {
            color: #ccc;
          }
        }
        .st3 {
          border: 1px solid #ccc;
        }
        .st4 {
          background: #006eff;
        }
        .slidetitle {
          display: inline-block;
          margin-left: 20px;
          font-size: 12px;
        }
        .st6 {
          color: #ccc;
        }
        .st8 {
          font-weight: bolder;
        }
      }
    }
    .listContent {
      .firstContent {
        .packdown {
          color: #006eff;
        }
        .tableList {
          border: 1px solid #eee;
          border-bottom: none;
        }
      }
      .sencondContent {
        .cost {
          margin-top: 10px;
          .paycost {
            font-size: 18px;
            color: #ff7800;
          }
        }
      }
    }
    .cvm-pag {
      padding: 10px 0;
      display: flex;
      justify-content: flex-end;
    }
    .dialog-footer {
      display: block;
      text-align: center;
      padding-top: 10px;
    }
  }
}
</style>


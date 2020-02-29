 <!-- 新建伸缩组 -->
<template>
  <div class="colony-wrap">
    <!-- <HeadCom title="集群管理">
      <el-button style="margin-left:10px;" v-if="!btnload">{{region}}</el-button>
      <el-button style="margin-left:10px;"  icon="el-icon-loading"></el-button>
    </HeadCom> -->
    <div class="tke-content-header">
      <div class="tke-grid ">
        <!-- 左侧 -->
        <div class="grid-left">
          <span class="goback" @click="goBack">
            <i class="el-icon-back"></i>
          </span>
          <h2 class="header-title">新建伸缩组</h2>
        </div>
        <!-- 右侧 -->
        <div class="grid-right"></div>
      </div>
    </div>  
    <div class="colony-main">

      <div class="tke-card tke-formpanel-wrap mb60">
        <h4  class="tke-formpanel-title">启动配置</h4>
        <el-form  class="tke-form" :model="asg" :rules="rules"
            ref="asg" label-position='left' label-width="120px" size="mini">
          <el-form-item label="名称">
            <el-input class="w200" v-model="asg.name" placeholder="请输入名称"></el-input>
          </el-form-item>
          <el-form-item label="实例类型">
             <el-radio-group  v-model="asg.typeRadio" size="small">
              <el-radio-button label="type1">按量计费</el-radio-button>
              <el-radio-button label="type2">竞价付费</el-radio-button>
            </el-radio-group>
            <p v-if="asg.typeRadio=='type2'">	竞价实例(Spot)可以让您以一定幅度的折扣购买实例,但同时系统可能会自动回收这些折扣售卖的实例,<span class="tke-text-link">查看详情</span></p>
          </el-form-item>
          <el-form-item label="机型设置">
            <div class='form-controls' >
              <el-form  class="tke-form"  label-position='left' label-width="120px" size="mini">
                <el-form-item label="可用区">
                  <el-radio-group  v-model="asg.regionRadio" size="small">
                    <el-radio-button label="region1">全部可用区</el-radio-button>
                    <el-radio-button label="region2">台北一区</el-radio-button>
                  </el-radio-group>
                  <p>启动配置里不包含可用区信息，提供可用区选择的目的是帮助您在已确定将启动实例可用区时，过滤出可用实例类型。</p>
                </el-form-item>
                <el-form-item label="机型">
                  <div class="tke-form-item_text">
                    <span>{{asg.zoneInstanceConfigInfo}}</span>
                    <i class="el-icon-edit tke-icon" @click="typeModelShow = true"></i>
                  </div>
                </el-form-item>
                <el-form-item label="系统盘">
                  <div class="tke-form-item_text">
                    <span>高性能云硬盘 50GB</span>
                    <i class="el-icon-edit tke-icon" @click="diskModelShow = true"></i>
                  </div>
                </el-form-item>
                <el-form-item label="数据盘">
                  <div class="tke-form-item_text">
                    <span>暂不购买</span>
                    <i class="el-icon-edit tke-icon" @click="dataDiskShow = true"></i>
                  </div>
                </el-form-item>
                <el-form-item label="公网带宽">
                  <div class="tke-form-item_text"><span>按带宽计费 1Mbps</span><i class="el-icon-edit tke-icon"></i></div>
                </el-form-item>
              </el-form>
            </div>
          </el-form-item>

          <el-form-item label="登录方式">
             <el-radio-group  v-model="asg.pwdRadio" size="small" @change="setLable($event)">
              <el-radio-button label="pwd1">设置密码</el-radio-button>
              <el-radio-button label="pwd2">立即关联密钥</el-radio-button>
              <el-radio-button label="pwd3">自动生成密码</el-radio-button>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="SSH密钥" v-show="flag1">
             <el-select v-model="value" filterable placeholder="请选择"  class="w200">
              <el-option
                v-for="item in secretList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="用户名" v-show="flag2">
             <div class="tke-form-item_text"><span>uunin</span></div>
          </el-form-item>
          <el-form-item label="密码" v-show="flag2">
             <el-input class="w200" v-model="pass.password" placeholder="请输入密码"></el-input>
             <p class="pass">linux机器密码需8到16位，至少包括两项（[a-z,A-Z] , [0-9]和[()`~!@#$%^&*-+=|{}[]:;',.?/]的特殊符号</p>
          </el-form-item>
          <el-form-item label="确认密码" v-show="flag2">
            <el-input class="w200" v-model="pass.passwordAgin" placeholder="请输入确认密码"></el-input>
          </el-form-item>
          
          <el-form-item label="容器目录">
             <el-checkbox v-model="checked">设置容器和镜像存储目录，建议存储到数据盘</el-checkbox>
              <el-form-item v-show="checked">
                <el-input class="w200" v-model="inputRoom"></el-input>
              </el-form-item>
          </el-form-item>

          <!-- 添加安全组 -->
          <el-form-item label="安全组">
              <el-select v-model="valueOne" placeholder="请选择"  class='w200' style="margin-bottom:15px;">
                <el-option
                  v-for="item in optionsOne"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                 >
                </el-option>
              </el-select><i class="el-icon-refresh ml10"></i><i class="el-icon-error ml10" v-show="this.domains.length?true:false" @click.prevent="deleteAll()"></i>
                 <el-form-item
                    v-for="(domain, index) in domains"
                    :key="domain.key"
                  >
                  <el-select v-model="values" placeholder="请选择"  class='w200'>
                    <el-option
                      v-for="item in domain.value"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select><i class="el-icon-refresh ml10"></i><i class="el-icon-error ml10" @click.prevent="removeDomain(domain)"></i>
                </el-form-item>
                <el-form-item>
                  <el-button type="text"  @click="addDomain" >新增域名</el-button>
                </el-form-item>
          </el-form-item>

          <el-form-item label="安全加固">
             <el-checkbox v-model="checkedOne">免费开通</el-checkbox>
              <el-form-item>
               安装组件免费开通DDoS防护、WAF和云镜主机防护<a href="https://cloud.tencent.com/product/cwp?_ga=1.173966502.440655928.1500464439" target="_blank">详细介绍</a>
              </el-form-item>
          </el-form-item>

          <el-form-item label="云监控">
             <el-checkbox v-model="checkedTwo">免费开通</el-checkbox>
              <el-form-item>
               <p style="color:#ff9d00;" v-show='!checkedTwo'>取消勾选将无法获得集群、主机、容器等相关监控信息及告警等能力，请慎重选择</p>
               <p>免费开通云产品监控、分析和实施告警，安装组件获取主机监控指标<a href="https://cloud.tencent.com/product/cm" target="_blank">详细介绍</a></p>
              </el-form-item>
          </el-form-item>

          <!-- <el-form-item label="Label">
                 <el-form-item
                    v-for="(domain, index) in domainstion"
                    :key="domain.key"
                  >
                   <div class="form-input">
                      <el-input v-model="domain.value" size="mini"  class='w70'></el-input>
                      <span>=</span>
                      <el-input v-model="domain.valueKey" size="mini"  class='w70'></el-input><i class="el-icon-error ml10" @click.prevent="removeDomain2(domain)"></i>
                    </div>
                </el-form-item>
                <el-form-item>
                  <el-button type="text"  @click="addDomain2" >新增Lable</el-button>
                </el-form-item>
          </el-form-item> -->
          <p><i :class="[isActive?'el-icon-caret-bottom':'el-icon-caret-right']"></i><el-button type="text" style='font-size:12px;' @click='isActive=!isActive'>高级设置</el-button></p>
          <el-form-item label="自定义数据" v-show="isActive">
            <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows:4 }"
                placeholder="请输入内容"
                v-model="textarea2"
                class='w420'>
              </el-input>
          </el-form-item>

          <el-form-item label="封锁（cordon）" v-show='isActive'>
             <el-checkbox v-model="checkedThree">开启封锁</el-checkbox>
              <el-form-item>
               <p>封锁节点后，将不接受新的Pod调度到该节点，需要手动取消封锁的节点，或在自定义数据中执行<a href="https://cloud.tencent.com/document/product/457/18824" target="_blank">取消封锁命令</a></p>
              </el-form-item>
          </el-form-item>
        </el-form>
        
        <hr>
        
        <h4  class="tke-formpanel-title">伸缩组配置</h4>

        <el-form class="tke-form" :model="asg" label-position='left' label-width="120px" size="mini">
          <el-form-item label="支持网络">
             <el-select v-model="value" disabled placeholder="请选择">
              <el-option
                v-for="item in optionsOne"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          
          <el-form-item label="支持子网">
              <el-table
                ref="multipleTable"
                :data="tableData"
                tooltip-effect="dark"
                style="width: 80%"
                @selection-change="handleSelectionChange">
                <el-table-column
                  type="selection"
                  width="55">
                </el-table-column>
                <el-table-column
                  label="子网ID"
                  width="200">
                  <template slot-scope="scope">{{ scope.row.date }}</template>
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="子网名称"
                  width="200">
                </el-table-column>
                <el-table-column
                  prop="address"
                  label="可用区"
                  show-overflow-tooltip>
                </el-table-column>
            </el-table>
          </el-form-item>

           <el-form-item label="节点数量范围">
            <div class="form-input">
              <el-input v-model="textOne" size="mini"  class='w150' placeholder="最小节点"></el-input>
              <span>~</span>
              <el-input v-model="textTwo" size="mini"  class='w150' placeholder="最大节点"></el-input>
            </div>
            <p>在设定的节点范围内自动调节，不会超出该设定范围</p>
            <p>扩缩容条件 集群内容器缺少可用资源调度时将触发扩容，集群内空闲资源较多时将触发缩容，详情见<a href='https://cloud.tencent.com/document/product/457/32190#.E9.80.9A.E8.BF.87.E5.BC.B9.E6.80.A7.E4.BC.B8.E7.BC.A9.E8.87.AA.E5.8A.A8.E6.B7.BB.E5.8A.A0.2F.E7.A7.BB.E9.99.A4.E8.8A.82.E7.82.B9' target="_blank">集群自动扩缩容说明</a></p>
          </el-form-item>

          <el-form-item label="重试策略">
             <el-radio-group  v-model="Radio" size="small" @change="setRadio($event)">
              <el-radio-button label="pwd1">快速重试</el-radio-button>
              <el-radio-button label="pwd2">简介递增重试</el-radio-button>
            </el-radio-group>
            <p v-show="Radio==='pwd1'">立即重试，在较短时间内快速重试，连续失败超过一定次数（5次）后不再重试。</p>
            <p v-show="Radio==='pwd2'">间隔递增重试，随着连续失败次数的增加，重试间隔逐渐增大，重试间隔从秒级到1天不等。</p>
          </el-form-item>
        </el-form>
        <!-- 底部 -->
        <div class="tke-formpanel-footer">
          <el-button size="small" type="primary" @click="submitGroup()">创建伸缩组</el-button>
          <el-button size="small">取消</el-button>
        </div>
      </div>
    </div>
    <el-dialog title="选择机型" :visible.sync="typeModelShow" width="80%">
      <div
        class="tke-second-worker-model-box"
        v-if="typeModelShow"
      >
        <div class="tke-second-worker-model">
          <div class="model-bg">
            <div>
              <el-select v-model="cpuValue" placeholder="请选择">
                <el-option
                  v-for="item in AllCPU"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
              <el-select v-model="memeryValue" placeholder="请选择">
                <el-option
                  v-for="item in AllRAM"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
            <div style="margin-top:16px;">
              <el-radio-group>
                <el-radio-button label="1"
                  >全部实例族</el-radio-button
                >
                <el-radio-button label="2">标准型</el-radio-button>
                <el-radio-button label="3">内存型</el-radio-button>
                <el-radio-button label="4">计算型</el-radio-button>
              </el-radio-group>
            </div>
            <div style="margin-top:16px;">
              <el-radio-group>
                <el-radio-button label="1"
                  >全部实例类型</el-radio-button
                >
                <el-radio-button label="2"
                  >标准型S3</el-radio-button
                >
                <el-radio-button label="3"
                  >计算型C3</el-radio-button
                >
                <el-radio-button label="4"
                  >内存型M3</el-radio-button
                >
              </el-radio-group>
            </div>
            <div style="margin-top:16px;">
              <el-table
                ref="singleTable"
                :data="zoneInfoList"
                highlight-current-row
                @current-change="handleCurrentChange"
                style="width: 100%"
                height="500px"
              >
                <el-table-column width="50">
                  <template slot-scope="scope">
                    <el-radio v-model="modeRadio" :label="scope.$index">
                      <i></i>
                    </el-radio>
                  </template>
                </el-table-column>
                <el-table-column label="机型">
                  <template slot-scope="scope">
                    {{ModelTypeName(scope.row.TypeName)}}
                  </template>
                </el-table-column>
                <el-table-column label="规格">
                  <template slot-scope="scope">
                    {{ scope.row.InstanceType }}
                  </template>
                </el-table-column>
                <el-table-column label="CPU">
                  <template slot-scope="scope">
                    {{ scope.row.Cpu }}核
                  </template>
                </el-table-column>
                <el-table-column label="内存">
                  <template slot-scope="scope">
                    {{ scope.row.Memory }}GB
                  </template>
                </el-table-column>
                <el-table-column label="配置费用">
                  <template slot-scope="scope">
                    <span class="text-orange"
                      >￥{{ scope.row.Price.UnitPrice }}</span
                    >元/小时起
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="ModelSure()">确 定</el-button>
        <el-button @click="typeModelShow = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="diskModelShow" width="35%">
      <div class="tke-second-worker-popover-disk">
        <div>
          <el-select
            v-model="secretList"
            placeholder="请选择"
          >
            <el-option
              v-for="item in secretList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-input-number
            v-model="secretList"
            :min="50"
            :max="500"
          ></el-input-number>
          <span>GB</span>
          <p>范围：50~500，步长：1</p>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="deleteSingleGroup('single')">确 定</el-button>
        <el-button @click="diskModelShow = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="dataDiskShow" width="35%">
      <el-checkbox
        v-model="buyDataDisk"
        @change="changeIsBuy()"
        >购买数据盘
      </el-checkbox>
    </el-dialog>
    <el-dialog :visible.sync="buyDataDiskShow" width="50%">
      <div>
        <p>云盘设置</p>
        <div>
          <el-select
            v-model="buyDataDisk"
            placeholder="请选择"
          >
            <el-option
              v-for="item in secretList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-input-number
            v-model="secretList"
            :min="10"
            :max="16000"
          ></el-input-number>
          <span>GB</span>
          <el-checkbox
            v-model="secretList"
            class="format-and-mount"
            >格式化并挂载</el-checkbox
          >
          <p>范围：10~16000，步长：10</p>
        </div>
        <p
          style="margin-top:16px;"
          v-if="secretList"
        >
          格式化设置
        </p>
        <div
          style="margin-top:16px;"
          
        >
          <el-select
            placeholder="请选择"
          >
            <el-option
              v-for="item in secretList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-input v-model="value"></el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="deleteSingleGroup('single')">确 定</el-button>
        <el-button @click="buyDataDiskShow = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import FileSaver from "file-saver";
import XLSX from "xlsx";
import { ErrorTips } from "@/components/ErrorTips";
import { ALL_CITY,
      DESCRIBE_ZONE_INFO,
      TKE_MISG,
      TKE_SSH } from "@/constants";
export default {
  name: "asgCreate",
  data() {
    return {
      flag1: true,
      flag2: false,
      checked: false,
      checkedOne: true,
      checkedTwo: true,
      checkedThree: false,
      typeModelShow: false,//是否打开机型modal
      diskModelShow: false,//是否打开系统盘modal
      dataDiskShow: false,//是否打开数据盘modal
      buyDataDisk: false,//是否显示是否购买数据盘
      buyDataDiskShow: false,//是否显示购买数据盘
      securityGroups: [],//安全组列表
      secretList: [],//SSH秘钥密码
      cpuValue: '0',//选中的cpu类型
      memeryValue: '0',//选中的内存类型
      zoneInfoList: [],//电脑机型列表
      modeRadio: '0',//默认选中的机型
      modeData: {},//机型表格中选中的数据
      textarea2: '',
      inputRoom: '/var/lib/docker',
      isActive: false,
      textOne: '',
      textTwo: '',
      Radio: 'pwd1',
      asg: {
        name: '',
        typeRadio:'type1',
        pwdRadio:'pwd1',
        regionRadio:'region1',
        sshKeySel: "",//ssh秘钥
        security:'',//安全组
        zoneInstanceConfigInfo: '',//机型
      },
      pass:{
        password:'',
        passwordAgin: ''
      },
      // 选中机型
      AllCPU: [
        {
          label: "全部CPU",
          value: "0"
        },
        {
          value: "1",
          label: "1核"
        },
        {
          value: "2",
          label: "2核"
        },
        {
          value: "4",
          label: "4核"
        },
        {
          value: "8",
          label: "8核"
        },
        {
          value: "12",
          label: "12核"
        },
        {
          value: "16",
          label: "16核"
        },
        {
          value: "24",
          label: "24核"
        },
        {
          value: "32",
          label: "32核"
        },
        {
          value: "48",
          label: "48核"
        },
        {
          value: "64",
          label: "64核"
        },
        {
          value: "80",
          label: "80核"
        }
      ],
      optionsOne: [{
        value: '选项1',
        label: 'xijian'
      }, {
        value: '选项2',
        label: 'SSEE'
      }, {
        value: '选项3',
        label: 'SSEEE'
      }],
      //所有内存
      AllRAM: [
        {
          value: "0",
          label: "全部内存"
        },
        {
          value: "1",
          label: "1GB"
        },
        {
          value: "2",
          label: "2GB"
        },
        {
          value: "4",
          label: "4GB"
        },
        {
          value: "8",
          label: "8GB"
        },
        {
          value: "16",
          label: "16GB"
        },
        {
          value: "24",
          label: "24GB"
        },
        {
          value: "32",
          label: "32GB"
        },
        {
          value: "48",
          label: "48GB"
        },
        {
          value: "64",
          label: "64GB"
        },
        {
          value: "96",
          label: "96GB"
        },
        {
          value: "128",
          label: "128GB"
        },
        {
          value: "144",
          label: "144GB"
        },
        {
          value: "192",
          label: "192GB"
        },
        {
          value: "256",
          label: "256GB"
        },
        {
          value: "320",
          label: "320GB"
        },
        {
          value: "384",
          label: "384GB"
        },
        {
          value: "512",
          label: "512GB"
        }
      ],
      optionsOne: [],
      domains: [],
      domainstion: [],
      value: '0',
      valueOne: '',
      values: [],
      tableData: [{
          date: 'subnet-nn56635p',
          name: 'asd',
          address: '台北一区'
        }, {
          date: 'subnet-nn56635p',
          name: 'asd',
          address: '台北一区'
        }, {
          date: 'subnet-nn56635p',
          name: 'asd',
          address: '台北一区'
        }],
      rules: {
        name: [
          { required: true, message: '请输入伸缩组名称', trigger: 'change' }
        ],
        ScaleDownUtilizationThreshold: [
          { required: true, message: '占比不能为空', trigger: 'change' }
        ],
         ScaleDownUnneededTime: [
          { required: true, message: '时间不能为空', trigger: 'change' }
        ],
         ScaleDownDelay: [
          { required: true, message: '时间不能为空', trigger: 'change' }
        ],
      }  
    }
  },
  components: {
   
  },
  created() {
    this.getDescribeZoneInstanceConfigInfos();
    this.getSecurityGroups();
    this.getSecretList();
  },
  methods: {
    //提交添加伸缩组
    async submitGroup() {
      this.loadShow = true;
      let params = {
        Version: '2018-05-25',
        ClusterId: this.clusterId,
        LaunchConfigurePara: {},
        InstanceAdvancedSettings: {},
      }
    },
    //返回上一层
    goBack(){
        this.$router.go(-1);
    },
    setLable(e){
      if(e === 'pwd1'){
        this.flag1 = true
        this.flag2 = false
      }
      if(e === 'pwd2'){
        this.flag1 = false
        this.flag2 = false
      }
      if(e === 'pwd3'){
        this.flag1 = false
        this.flag2 = true
      }

      console.log(e)
    },
    removeDomain(item) {
      console.log(item)
      var index = this.domains.indexOf(item)
      if (index !== -1) {
        this.domains.splice(index, 1)
      }
    },
    removeDomain2(item) {
      console.log(item)
      var index = this.domainstion.indexOf(item)
      if (index !== -1) {
        this.domainstion.splice(index, 1)
      }
    },
    addDomain() {
      this.domains.push({
        value: [],
        key: Date.now()
      })
    },
    addDomain2() {
      this.domainstion.push({
        value: '',
        valueKey: '',
        key: Date.now()
      })
    },
    deleteAll(){
      this.domains.splice(0,this.domains.length)
    },
    setRadio(e){

    },
    handleSelectionChange(){

    },
    //机型表格选中的数据
    handleCurrentChange(val) {
      this.modeData = val;
    },
    //机型model确定选择数据
    ModelSure() {
      let modeData = this.modeData;
      this.asg.zoneInstanceConfigInfo = modeData.InstanceType+"("+ this.ModelTypeName(modeData.TypeName)+","+ modeData.Cpu+ "核" + modeData.Memory +"GB)";
      this.typeModelShow =false;
    },
    //获取可用区机型配置信息
    async getDescribeZoneInstanceConfigInfos() {
      let param = {
        Version: "2017-03-12"        
      }
      param["Filters.0.Name"] = "instance-charge-type";
      param["Filters.0.Values.0"] = "POSTPAID_BY_HOUR";
      await this.axios.post(DESCRIBE_ZONE_INFO, param).then(res => {
        if(res.Response.Error === undefined) {
          this.zoneInfoList = res.Response.InstanceTypeQuotaSet;
          this.asg.zoneInstanceConfigInfo = res.Response.InstanceTypeQuotaSet[0].InstanceType 
            +"("+ this.ModelTypeName(res.Response.InstanceTypeQuotaSet[0].TypeName)+","+ res.Response.InstanceTypeQuotaSet[0].Cpu 
            + "核" + res.Response.InstanceTypeQuotaSet[0].Memory +"GB)";
        } else {
          this.loadShow = false;
          let ErrTips = {
            "InvalidInstanceType.Malformed": "指定InstanceType参数格式不合法",
            "InvalidRegion.NotFound": "未找到该区域",
            "InvalidZone.MismatchRegion": "指定的zone不存在",
          };
          let ErrOr = Object.assign(ErrorTips, ErrTips);
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 0
          });
        }
      });
    },
    //选择是否购买数据盘
    changeIsBuy() {
      if(this.buyDataDisk) {
        this.dataDiskShow = false;
        this.buyDataDiskShow = true;
      }
    },
    //获取安全组列表
    async getSecurityGroups() {
      this.loadShow = true;
      let params = {
        Version: "2017-03-12",
        Offset: 0,
        Limit: 100,
      }
      params["Filters.0.Name"] = "project-id";
      params["Filters.0.Values.0"] = 0;

      await this.axios.post(TKE_MISG, params).then(res => {
        if(res.Response.Error === undefined) {
          this.SecurityGroupSet = res.Response.SecurityGroupSet;
          this.asg.security = res.Response.SecurityGroupSet[0].SecurityGroupName
          this.loadShow = false;
        } else {
          this.loadShow = false;
          let ErrTips = {};
          let ErrOr = Object.assign(ErrorTips, ErrTips);
          this.$message({
            message: ErrOr[k8sRes.Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 0
          });
        }
      });
    },
    //获取ssh秘钥密码
    async getSecretList() {
      this.loadShow = true;
      let params = {
        Version: "2017-03-12",
        Limit: 100
      }
      await this.axios.post(TKE_SSH, params).then(res => {
        if(res.Response.Error === undefined) {
          this.secretList = res.Response.KeyPairSet;
          this.loadShow = false;
        } else {
          this.loadShow = false;
          let ErrTips = {};
          let ErrOr = Object.assign(ErrorTips, ErrTips);
          this.$message({
            message: ErrOr[k8sRes.Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 0
          });
        }
      });
      secretList  
    },
    ModelTypeName(val) {
      if (val === "Standard S3") {
        return "标准型S3";
      } else if (val === "Compute C3") {
        return "计算型C3";
      } else if (val === "MEM-optimized M3") {
        return "内存型M3";
      }
    }
  },
  filters: {
    
  }
};
</script>

<style lang="scss" scoped>
.pass{
  font-size: 12px;
  color: #888;
  margin-top:8px;
}
.form-input{
    display: flex;
    justify-content: space-between;
    align-items: center;
    width:200px;
    span{
        margin:0 10px;
    }
    i{
        margin:0 10px;
        cursor: pointer;
    }
}
.form-p{
    margin-bottom: 10px;
    font-size: 12px;
    color: #888;
}

.text-orange {
  font-size: 14px;
  color: #ff7800;
  font-weight: 600;
}

</style>


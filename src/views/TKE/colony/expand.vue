<!-- 创建集群 -->
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
          <h2 class="header-title">新建节点</h2>
        </div>
        <!-- 右侧 -->
        <div class="grid-right"></div>
      </div>
    </div>
    <div class="colony-main">
      <div class="tke-step tke-grid">
        <div class="tke-step-item is-curr">
          <span class="num">1</span>
          <span class="title">集群信息</span>
          <i class="el-icon-arrow-right"></i>
        </div>
        <div class="tke-step-item is-curr">
          <span class="num">2</span>
          <span class="title">选择机型</span>
          <i class="el-icon-arrow-right"></i>
        </div>
        <div
          class="tke-step-item"
          :class="{ 'is-curr': thirdBox || fourthBox }"
        >
          <span class="num">3</span>
          <span class="title">云服务器配置</span>
          <i class="el-icon-arrow-right"></i>
        </div>
        <div class="tke-step-item" :class="{ 'is-curr': fourthBox }">
          <span class="num">4</span>
          <span class="title">信息确认</span>
        </div>
      </div>
      <hr />
      <!-- 第二步 选择机型 -->
      <div
        v-if="secondBox"
        class="tke-second-box tke-card tke-formpanel-wrap mb60"
      >
        <div class="tke-second-title">已选配置</div>
        <el-form
          ref="form"
          :model="colonySecond"
          label-width="120px"
          label-position="left"
        >
          <el-form-item label="集群名">
            <p>{{ nodeForm.name }}</p>
          </el-form-item>
          <el-form-item label="Kubernetes版本">
            <p>{{ nodeForm.kuValue }}</p>
          </el-form-item>
          <el-form-item label="所在地域">
            <p>{{ nodeForm.cityRadio }}</p>
          </el-form-item>
          <el-form-item label="容器网络">
            <p>{{ nodeForm.container }}</p>
          </el-form-item>
          <div class="tke-second-tips">
            <p>操作系统<i class="el-icon-info"></i></p>
            <p>
              {{nodeForm.os}}
            </p>
          </div>
          <div
            class="tke-second-tips"
            style="border: 0px;margin:0px;padding:0px;"
          >
            <p>计费模式<i class="el-icon-info"></i></p>
            <div class="tke-second-radio-btn tke-second-icon-btn">
              <el-radio-group
                v-model="nodeForm.instanceChargeType"
                @change="SecondCharging"
              >
                <el-radio-button label="POSTPAID_BY_HOUR">按量计费</el-radio-button>
                <el-radio-button label="PREPAID">包年包月</el-radio-button>
              </el-radio-group>
              <a href="#">详细对比</a>
            </div>
          </div>
          <el-form-item label="所在地域">
            <p style="line-height:48px;">{{ nodeForm.cityRadio }}</p>
          </el-form-item>
          <div
            class="tke-second-tips"
            style="border: 0px;margin:0px;padding-bottom:16px;"
          >
            <p>可用区<i class="el-icon-info"></i></p>
            <div class="tke-second-radio-btn tke-second-icon-btn">
              <el-radio-group v-model="colonySecond.charging">
                <el-radio-button label="1">台北一区</el-radio-button>
              </el-radio-group>
            </div>
          </div>
          <div
            class="tke-second-tips"
            style="border: 0px;margin:0px;padding-bottom:11px;"
          >
            <p>节点网络<i class="el-icon-info"></i></p>
            <div class="tke-second-worker-select">
              <el-select v-model="nodeForm.groupVps" disabled placeholder="请选择">
                <el-option
                  v-for="item in nodeForm.describeVpcs"
                  :key="item.VpcId"
                  :label="item.VpcName"
                  :value="item.VpcId"
                >
                </el-option>
              </el-select>
              <el-select v-model="nodeForm.subnetId" placeholder="请选择">
                <el-option
                  v-for="item in nodeForm.subNetList"
                  :key="item.SubnetId"
                  :label="item.SubnetName"
                  :value="item.SubnetId"
                >
                </el-option>
              </el-select>
            </div>
          </div>
          <el-form-item label="实例族">
            <div class="tke-second-radio-btn tke-second-icon-btn">
              <el-radio-group v-model="colonySecond.buyTime">
                <el-radio-button label="1">全部实例族</el-radio-button>
                <el-radio-button label="2">标准型</el-radio-button>
                <el-radio-button label="3">内存型</el-radio-button>
                <el-radio-button label="4">计算型</el-radio-button>
              </el-radio-group>
            </div>
          </el-form-item>
          <el-form-item label="实例类型">
            <div class="tke-second-radio-btn tke-second-icon-btn">
              <el-radio-group v-model="colonySecond.buyTime">
                <el-radio-button label="1">全部实例类型</el-radio-button>
                <el-radio-button label="2">标准型S3</el-radio-button>
                <el-radio-button label="3">计算型C3</el-radio-button>
                <el-radio-button label="4">内存型M3</el-radio-button>
              </el-radio-group>
            </div>
          </el-form-item>
          <el-form-item>
            <div class="model-bg">
              <el-table
                ref="singleTable"
                :data="nodeForm.zoneInfoList"
                highlight-current-row
                @current-change="handleCurrentChange"
                style="width: 100%"
              >
                <el-table-column width="50">
                  <template slot-scope="scope">
                    <el-radio v-model="nodeForm.modelType" :label="scope.row"
                      ><i></i
                    ></el-radio>
                  </template>
                </el-table-column>
                <el-table-column property="date" label="机型">
                  <template slot-scope="scope">
                    <span>{{scope.row.TypeName | ModelTypeName}}</span>
                  </template>
                </el-table-column>
                <el-table-column property="name" label="规格">
                  <template slot-scope="scope">
                    <span>{{scope.row.InstanceType}}</span>
                  </template>
                </el-table-column>
                <el-table-column property="address" label="CPU">
                  <template slot-scope="scope">
                    <span>{{scope.row.Cpu}}核</span>
                  </template>
                </el-table-column>
                <el-table-column property="address" label="内存">
                  <template slot-scope="scope">
                    <span>{{scope.row.Memory}}GB</span>
                  </template>
                </el-table-column>
                <el-table-column property="address" label="配置费用">
                  <template slot-scope="scope">
                    <span class="text-orange" style="color:#ff7800;" v-if="nodeForm.instanceChargeType === 'POSTPAID_BY_HOUR'">￥{{ scope.row.Price.UnitPrice }}</span>
                    <span class="text-orange" style="color:#ff7800;" v-else>￥{{ scope.row.Price.DiscountPrice }}</span>
                    元/{{nodeForm.instanceChargeType === 'POSTPAID_BY_HOUR' ? '小时' : '月'}}起
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-form-item>
        </el-form>
        <!-- 底部 -->
        <div class="tke-formpanel-footer">
          <el-button size="small" type="primary" @click="secondNext"
            >下一步</el-button
          >
        </div>
      </div>
      <!-- 第三步 云服务器配置 -->
      <div
        v-if="thirdBox"
        class="tke-second-box tke-third-box tke-card tke-formpanel-wrap mb60"
      >
        <div class="tke-second-title">已选配置</div>
        <el-form
          ref="nodeForm"
          :model="nodeForm"
          label-width="120px"
          label-position="left"
          :rules="rules"
        >
          <el-form-item label="集群名">
            <p>{{ nodeForm.name }}</p>
          </el-form-item>
          <el-form-item label="Kubernetes版本">
            <p>{{ nodeForm.kuValue }}</p>
          </el-form-item>
          <el-form-item label="所在地域">
            <p>{{ nodeForm.cityRadio }}</p>
          </el-form-item>
          <el-form-item label="容器网络">
            <p>{{ nodeForm.container }}</p>
          </el-form-item>
          <el-form-item label="计费模式">
            <p>{{nodeForm.instanceChargeType | instanceChargeType}}</p>
          </el-form-item>
          <div class="tke-second-tips tke-third-tips-h">
            <p>操作系统<i class="el-icon-info"></i></p>
            <p>
              {{nodeForm.os}}
            </p>
          </div>
          <el-form-item label="机型">
            <p>{{nodeForm.modelType.TypeName | ModelTypeName}}</p>
          </el-form-item>
          <el-form-item label="规格" class="norms">
            <p>{{nodeForm.instanceType}} ({{nodeForm.modelType.Cpu}}核{{nodeForm.modelType.Memory}}GB)</p>
          </el-form-item>
          <el-form-item label="系统盘">
            <div class="tke-second-radio-btn tke-third-radio-btn">
              <el-radio-group v-model="nodeForm.systemDiskType">
                <el-radio-button label="CLOUD_PREMIUM">高性能云硬盘</el-radio-button>
                <el-radio-button label="CLOUD_SSD">SSD云硬盘</el-radio-button>
              </el-radio-group>
              <div class="block">
                <el-slider :min="50" :max="500" :step="10" :show-tooltip="true" v-model="nodeForm.systemSize" show-input></el-slider>
              </div>
            </div>
          </el-form-item>
          <div class="tke-second-tips tke-third-tips-h">
            <p>数据盘</p>
            <div class="data-disk">
              <el-checkbox v-model="nodeForm.isShowDataDisk" @change="isBuyDataDisk"
                >购买数据盘</el-checkbox
              >
            </div>
            <!-- <div
              class="tke-second-checkbox"
              style="padding-left:20px;"
            >
              <el-checkbox
                v-model="item.buyDataDisk"
                @change="BuyDataDisk(index, 1)"
                >购买数据盘</el-checkbox
              >
            </div> -->
            
          </div>
          <el-form-item label="容器目录">
            <el-checkbox v-model="nodeForm.containerChecked"
              >设置容器和镜像存储目录，建议存储到数据盘</el-checkbox
            >
            <el-input
              v-model="nodeForm.containerInput"
              placeholder="容器目录格式如 /var/lib/docker"
              v-if="nodeForm.containerChecked"
              prop="container"
            ></el-input>
          </el-form-item>
          <div class="tke-second-tips tke-third-broadband">
            <p>公网宽带<i class="el-icon-info"></i></p>
            <div class="tke-second-radio-btn tke-third-radio-btn">
              <el-radio-group v-model="nodeForm.internetChargeType">
                <el-radio-button label="BANDWIDTH_POSTPAID_BY_HOUR">按带宽计费</el-radio-button>
                <el-radio-button label="TRAFFIC_POSTPAID_BY_HOUR">按使用流量</el-radio-button>
              </el-radio-group>
              <div style="overflow:hidden;margin-left:120px;">
                <div class="block">
                  <el-slider :min="0" :max="100" :step="1" v-model="nodeForm.internetMaxBandwidthOut" show-input
                  @change="changeInternet"></el-slider>
                </div>
                <div class="data-disk">
                  <p v-show="nodeForm.internetMaxBandwidthOut === 0">
                    您设置的带宽为0，容器服务将无法直接提供外网服务
                  </p>
                  <el-checkbox v-model="nodeForm.publicIpAssigned" :disabled = "nodeForm.disabled"
                    >免费分配公网IP<a href="javascript:;"
                      >使用指引</a
                    ></el-checkbox
                  >
                  <p v-show="nodeForm.internetMaxBandwidthOut === 0 || nodeForm.publicIpAssigned === false">
                    如果您对业务安全有要求不希望业务直接暴露到公网，同时又希望访问公网，您可以使用腾讯云NAT网关,点击查看
                    <a href="javascript:;">NAT网关详细介绍</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <el-form-item label="实例名称">
            <div class="tke-second-radio-btn tke-third-radio-btn">
              <el-radio-group v-model="nodeForm.instanceNameType">
                <el-radio-button label="auto">自动命名</el-radio-button>
                <el-radio-button label="manual">手动命名</el-radio-button>
              </el-radio-group>
              <p v-show="nodeForm.instanceNameType === 'auto'">云服务器将自动命名为 tke_集群id_worker</p>
            </div>
          </el-form-item>
          <el-form-item v-show="nodeForm.instanceNameType === 'manual'" style="margin-top: 20px;">
            <el-input type="text" v-model="nodeForm.instanceName" placeholder="请输入内容" ></el-input>
            <p>实例名称不超过60个字符</p>
          </el-form-item>
          <el-form-item label="登录方式">
            <div class="tke-second-radio-btn tke-third-radio-btn">
              <el-radio-group
                v-model="nodeForm.loginSettings"
                @change="LoginMode"
              >
                <el-radio-button label="relation">立即关联密钥</el-radio-button>
                <el-radio-button label="auto">自动生成密码</el-radio-button>
                <el-radio-button label="set">设置密码</el-radio-button>
              </el-radio-group>
              <p v-if="colonyThird.two">
                注：创建后，自动生成的密码将通过站内信发送给您。也可登录CVM控制台重置密码。
              </p>
            </div>
          </el-form-item>
          <el-form-item
            label="用户名"
            v-if="nodeForm.loginSettings === 'relation' || nodeForm.loginSettings === 'set'"
          >
            <p>ubuntu</p>
          </el-form-item>
          <el-form-item label="SSH密钥" v-if="nodeForm.loginSettings === 'relation'">
            <div class="tke-third-select">
              <el-select v-model="nodeForm.keyIds" placeholder="请选择">
                <el-option
                  v-for="item in nodeForm.secretList"
                  :key="item.KeyId"
                  :label="item.KeyName"
                  :value="item.KeyId"
                >
                </el-option>
              </el-select>
              <p>如您现有的密钥不合适，可以<a href="#">现在创建</a></p>
            </div>
          </el-form-item>
          <el-form-item label="密码" v-if="nodeForm.loginSettings === 'set'" class="password">
            <el-input
              placeholder="请输入主机密码"
              v-model="nodeForm.password"
              show-password
            ></el-input>
            <p>
              linux机器密码需8到16位，至少包括两项（[a-z,A-Z] ,
              [0-9]和[()`~!@#$%^&}*-+=|{}[]:;',.?/]的特殊符号）
            </p>
          </el-form-item>
          <el-form-item
            label="确认密码"
            v-if="nodeForm.loginSettings === 'set'"
            class="password"
          >
            <el-input
              placeholder="请输入主机密码"
              v-model="nodeForm.confirmPassword"
              show-password
            ></el-input>
          </el-form-item>
          <div class="tke-third-tips">
            <p>安全组<i class="el-icon-info"></i></p>
            <div>
              <el-select v-model="nodeForm.securityId" placeholder="请选择">
                <el-option
                  v-for="item in nodeForm.securityGroups"
                  :key="item.SecurityGroupId"
                  :label="item.SecurityGroupName"
                  :value="item.SecurityGroupId"
                >
                </el-option>
              </el-select>
              <p>
                <a href="#">添加安全组</a>
              </p>
            </div>
          </div>
          <el-form-item label="安全加固">
            <div class="tke-third-checkbox" style="padding-bottom:10px;">
              <el-checkbox v-model="nodeForm.securityService"
                >免费开通</el-checkbox
              >
              <p>
                安装组件免费开通DDoS防护、WAF和云镜主机防护<a href="#"
                  >详细介绍</a
                >
              </p>
            </div>
          </el-form-item>
          <el-form-item label="云监控">
            <div class="tke-third-checkbox">
              <el-checkbox v-model="nodeForm.monitorService"
                >免费开通</el-checkbox
              >
              <p class="checkbox-tips" v-if="!nodeForm.monitorService">
                取消勾选将无法获得集群、主机、容器等相关监控信息及告警等能力，请慎重选择
              </p>
              <p>
                免费开通云产品监控、分析和实施告警，安装组件获取主机监控指标<a
                  href="#"
                  >详细介绍</a
                >
              </p>
            </div>
          </el-form-item>
        </el-form>
        <!-- 底部 -->
        <div class="tke-formpanel-footer">
          <el-button size="small" @click="thirdPrev">上一步</el-button>
          <el-button size="small" type="primary" @click="thirdNext('nodeForm')"
            >下一步</el-button
          >
        </div>
      </div>
      <!-- 第四步 信息确认 -->
      <div
        v-if="fourthBox"
        class="tke-second-box tke-fourth-box tke-card tke-formpanel-wrap mb60"
      >
        <div class="tke-second-title">已选配置</div>
        <el-form ref="form" label-width="120px" label-position="left">
          <el-form-item label="集群名">
            <p>{{ nodeForm.name }}</p>
          </el-form-item>
          <el-form-item label="Kubernetes版本">
            <p>{{ nodeForm.kuValue }}</p>
          </el-form-item>
          <el-form-item label="所在地域">
            <p>{{ nodeForm.cityRadio }}</p>
          </el-form-item>
          <el-form-item label="容器网络">
            <p>{{ nodeForm.container }}, {{clusterInfo.ClusterNetworkSettings.MaxClusterServiceNum}}个service/集群, {{clusterInfo.ClusterNetworkSettings.MaxNodePodNum}}个Pod/节点, 上限1008个节点</p>
          </el-form-item>
          <el-form-item label="计费模式">
            <p>{{nodeForm.instanceChargeType | instanceChargeType}}</p>
          </el-form-item>
          <el-form-item label="机型">
            <p>{{nodeForm.modelType.TypeName | ModelTypeName}}</p>
          </el-form-item>
          <el-form-item label="规格">
            <p>{{nodeForm.instanceType}} ({{nodeForm.modelType.Cpu}}核{{nodeForm.modelType.Memory}}GB)</p>
          </el-form-item>
          <el-form-item label="操作系统">
            {{nodeForm.os}}
          </el-form-item>
          <el-form-item label="系统盘">
            <p>{{nodeForm.systemDiskType | systemDiskType}} ({{nodeForm.systemSize}}GB)</p>
          </el-form-item>
          <el-form-item label="数据盘">
            <p v-if="!nodeForm.isShowDataDisk">暂不购买</p>
            <p v-else>dataDiskType</p>
            
          </el-form-item>
          <el-form-item label="公网带宽" class="tke-fourth-broadband">
            <p>{{nodeForm.internetChargeType | internetChargeType}} ({{nodeForm.internetMaxBandwidthOut}}Mbps)</p>
          </el-form-item>
          <el-form-item label="云服务器数量" class="cvm-num">
            <el-input-number v-model="nodeForm.instanceCount" :min="1" :max="10"></el-input-number>
          </el-form-item>
          <el-form-item label="总计费用">
            <div class="tke-second-cost">
              <span class="tke-second-cost-num">0.16</span
              ><span class="tke-second-cost-h">元/小时</span
              ><span class="tke-second-cost-t">(配置费用)</span>
              <i>|</i>
              <span class="tke-second-cost-num">0.06</span
              ><span class="tke-second-cost-h">元/小时</span
              ><span class="tke-second-cost-w"> (网络费用-按带宽计费)</span>
            </div>
          </el-form-item>
        </el-form>
        <!-- 底部 -->
        <div class="tke-formpanel-footer">
          <el-button size="small" @click="fourthPrev">上一步</el-button>
          <el-button size="small" type="primary" @click="submitOk()">完成</el-button>
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="nodeForm.dataDiskShow">
      <div v-if="nodeForm.dataDiskShow">
        <div
          class="tke-second-worker-popover-data-bg"
          v-for="(x, i) in nodeForm.buyDataDiskArr"
          :key="i"
        >
          <div>
            <div class="box">
              <p>云盘设置</p>
              <div>
                <el-select
                  v-model="x.dataDiskVal"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in nodeForm.dataDiskOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
                <el-input-number
                  v-model="x.dataDiskNum"
                  :min="10"
                  :max="16000"
                  :step="10"
                ></el-input-number>
                <span>GB</span>
                <el-checkbox
                  v-model="x.formatMount"
                  class="format-and-mount"
                  >格式化并挂载</el-checkbox
                >
                <p>范围：10~16000，步长：10</p>
              </div>
              <p
                style="margin-top:16px;"
                v-if="x.formatMount"
              >
                格式化设置
              </p>
              <div
                style="margin-top:16px;"
                v-if="x.formatMount"
              >
                <el-select
                  v-model="x.latticeSetVal"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="x in nodeForm.latticeSetOpt"
                    :key="x.value"
                    :label="x.label"
                    :value="x.value"
                  >
                  </el-option>
                </el-select>
                <el-input
                  v-model="x.setValue"
                ></el-input>
              </div>
            </div>
          </div>
          <i
            class="el-icon-error ml5"
            style="margin-top:10px;"
            @click="deleteDataDisk(i)"
          ></i>
        </div>
      </div>
      <div
        class="add-data-disk"
        v-if="
          nodeForm.buyDataDisk &&
            nodeForm.buyDataDiskArr.length != 0
        "
        @click="AddDataDisk(index)"
      >
        添加数据盘
      </div>
      <div class="btn">
        <el-button @click="DataDiskSure(index, 1)"
          >确定</el-button
        >
        <el-button @click="nodeForm.dataDiskShow = false"
          >取消</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import HeadCom from '@/components/public/Head'
// import SEARCH from '@/components/public/SEARCH'
import { ErrorTips } from "@/components/ErrorTips";
import { type } from 'os';
import { ALL_CITY,
  TKE_COLONY_LIST,
  DESCRIBE_ZONE_INFO,
  TKE_VPC_METWORK,
  TKE_WORKER_METWORK,
  TKE_SSH,
  TKE_MISG,
  TKE_ADD_NODE } from "@/constants";
export default {
  name: "create",
  data() {
    return {
      loadShow: false,//是否显示加载
      clusterId: '',//集群id
      clusterInfo: {},//集群基本信息
      // 步骤显示
      secondBox: true,
      thirdBox: false,
      fourthBox: false,
      //form绑定数据
      nodeForm: {
        name: "", // 集群名称
        kuValue: "", // 版本
        cityRadio: "台湾台北",//区域
        container: "",//容器网络
        os:'',//操作系统
        instanceChargeType: 'POSTPAID_BY_HOUR',//付费方式
        describeVpcs: [],//vpsc列表
        subNetList: [],//子网列表
        groupVps: '',//vpcsID
        subnetId: '',//子网id
        zoneInfoList: [],//机型列表
        secretList: [],//SSH秘钥列表
        securityGroups: [],//安全组列表
        systemDiskType: 'CLOUD_PREMIUM',//系统盘类型
        systemSize: 50,//系统盘大小
        modelType: {},//实例机型对象
        instanceType: 'S1.SMALL1',//实例机型类型
        isShowDataDisk: false,//是否购买数据盘
        dataDiskShow: false,//是否显示购买数据盘modal
        buyDataDiskArr: [],//数据盘购买列表
        dataDiskOptions: [
          {
            value: "CLOUD_PREMIUM",
            label: "高性能云硬盘"
          },
          {
            value: "CLOUD_SSD",
            label: "SSD云硬盘"
          }
        ],
        latticeSetOpt: [
          { value: "ext3", label: "ext3" },
          { value: "ext4", label: "ext4" },
          { value: "xfs", label: "xfs" }
        ],
        containerChecked: false,// 容器目录
        containerInput: '/var/lib/docker',//容器目录内容
        internetChargeType: 'BANDWIDTH_POSTPAID_BY_HOUR',//公网带宽类型
        internetMaxBandwidthOut: 1,//公网大小
        publicIpAssigned: true,//是否免费分配公网
        disabled: false,//是否禁用
        instanceNameType: 'auto',//实例名称选择方式
        instanceName: '',//实例名称
        loginSettings: 'relation',//登录方式
        keyIds: '',//ssh秘钥id
        password: '',//密码 
        confirmPassword: '',//确认密码
        securityId: '',//安全组id
        securityService: true,//云服务器
        monitorService: true,//云监控
        instanceCount: 1,//购买实例数量
      },
      rules: {
        container: [
          {
            validator: (rule, value, callback) => {
              debugger
              if (this.nodeForm.containerChecked && value === '') {
                callback(new Error('容器目录不能为空'))
              } else {
                callback()
              }
            },
            trigger: "blur",
            required: true
          }
        ]
      },
      // 第二步
      colonySecond: {
        source: 1,
        master: 1,
        workerShow: false,
        worker: 1,
        buyTime: 1, // 购买时长
        renew: true, // 自动续费
        charging: 1,
        chargingShow: false,
        usableArea: 1,
        // 机型
        tableData: [
          {
            date: "2016-05-02",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1518 弄"
          },
          {
            date: "2016-05-04",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1517 弄"
          },
          {
            date: "2016-05-01",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1519 弄"
          },
          {
            date: "2016-05-03",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1516 弄"
          },
          {
            date: "2016-05-01",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1519 弄"
          },
          {
            date: "2016-05-03",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1516 弄"
          }
        ],
        // 机型
        modelShow: false,
        // 系统盘
        systemDiskNum: 50,
        systemDiskShow: false,
        systemDiskOptions: [
          {
            value: "1",
            label: "高性能云硬盘"
          },
          {
            value: "2",
            label: "SSD云硬盘"
          }
        ],
        systemDiskVal: "1",
        systemDiskValue: "高性能云硬盘",
        systemDiskNumber: "50",
        // 数据盘
        dataDiskValue: "暂不购买",
        dataDiskShow: false,
        buyDataWidth: 300,
        buyDataDisk: false,
        formatMount: false,
        dataDiskNum: 10,
        dataDiskOptions: [
          {
            value: "1",
            label: "高性能云硬盘"
          },
          {
            value: "2",
            label: "SSD云硬盘"
          }
        ],
        dataDiskVal: "1",
        dataDiskNumber: "10",
        // 公网宽带
        broadbandValue: "暂不购买",
        broadbandShow: false,
        broadbandWidth: 300,
        broadbandDisk: false,

        broadbandNum: 10,
        broadbandOptions: [
          {
            value: "1",
            label: "按宽带计费"
          },
          {
            value: "2",
            label: "按使用流量"
          }
        ],
        broadbandVal: "1",
        broadbandNumber: "10"
      },
      // 第三步
      colonyThird: {
        
        containerInput: "",
        // 登录方式
        loginModeRadio: 1,
        one: true,
        two: false,
        three: false,
        // 密码
        password: "",
        // 确认密码
        confirmPassword: "",
        // 安全加固
        safetyChecked: true,
        // 云监控
        cloudwatchChecked: true
      },
      radio1: 1,
      options: [
        {
          value: "选项1",
          label: "黄金糕"
        },
        {
          value: "选项2",
          label: "双皮奶"
        },
        {
          value: "选项3",
          label: "蚵仔煎"
        },
        {
          value: "选项4",
          label: "龙须面"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
        }
      ],
      value: "50",
      num: 1,
      checked: true,
      input: "",
      value1: 0
    };
  },
  components: {
    // HeadCom,
    // SEARCH
  },
  created() {
    this.clusterId = this.$route.query.clusterId;
    this.getColonyInfo();
    this.getDescribeZoneInstanceConfigInfos();
    // this.getDescribeVpcs();
    this.getSecretList();
    this.getSecurityGroups();
  },
  methods: {
    //提交保存
    
    //新建节点
    async submitOk() {
      let LoginSettings = {};
      if(this.nodeForm.loginSettings === 'relation') {
        LoginSettings.KeyIds = [this.nodeForm.keyIds];
      } else if (this.nodeForm.loginSettings === 'auto') {
        LoginSettings = {};
      } else {
        LoginSettings.Password = this.nodeForm.password;
      }
      let SecurityGroupIds = [];//未做完
      SecurityGroupIds.push(this.nodeForm.securityId);
      let RunInstancePara = {
        InstanceChargeType: this.nodeForm.instanceChargeType,
        Placement: {Zone: "ap-taipei-1", ProjectId: 0},
        InstanceType: this.nodeForm.instanceType,
        SystemDisk: {DiskType: this.nodeForm.systemDiskType, DiskSize: Number(this.nodeForm.systemSize)},
        DataDisks:[],//未做完
        VirtualPrivateCloud: {VpcId: this.nodeForm.groupVps, SubnetId: this.nodeForm.subnetId, AsVpcGateway: false},
        InternetAccessible: {InternetChargeType: this.nodeForm.internetChargeType,
            InternetMaxBandwidthOut: Number(this.nodeForm.internetMaxBandwidthOut),PublicIpAssigned: this.nodeForm.publicIpAssigned},
        InstanceCount: this.nodeForm.instanceCount,
        ImageId: '',//未取值
        InstanceName: this.nodeForm.instanceName,
        LoginSettings: LoginSettings,
        SecurityGroupIds: SecurityGroupIds,
        EnhancedService: {SecurityService: {Enabled: this.nodeForm.securityService}, MonitorService: {Enabled: this.nodeForm.monitorService}}
      };
      let containerInput = "";
      if(this.nodeForm.containerChecked) {
        containerInput = this.nodeForm.containerInput;
      }
      let InstanceAdvancedSettings = {
        DockerGraphPath: JSON.stringify(containerInput),
        UserScript: '',
        Unschedulable: Number(0)
        // ,Labels: []
        // ,ExtraArgs: {Kubelet: []}
      }
      // InstanceAdvancedSettings['Labels'] = '';
      // InstanceAdvancedSettings.ExtraArgs = {};
      // InstanceAdvancedSettings.ExtraArgs['Kubelet'] = '';
      let param = {
        Version: '2018-05-25',
        ClusterId: this.clusterId,
        RunInstancePara: JSON.stringify(RunInstancePara),
        InstanceAdvancedSettings: InstanceAdvancedSettings
      }
      await this.axios.post(TKE_ADD_NODE, param).then(res => {
        debugger
        if(res.Response.Error === undefined) {
          
        } else {
          this.loadShow = false;
          let ErrTips = {
            "FailedOperation":"操作失败",
            "InternalError": "内部错误",
            "InternalError.CvmCommon": "cvm创建节点报错。",
            "InternalError.CvmNotFound": "cvm不存在。",
            "InternalError.Db": "db错误。",
            "InternalError.DbAffectivedRows": "DB错误",
            "InternalError.DbRecordNotFound": "记录未找到。",
            "InternalError.ImageIdNotFound": "镜像未找到。",
            "InternalError.OsNotSupport": "镜像OS不支持。",
            "InternalError.Param": "Param。",
            "InternalError.QuotaMaxClsLimit": "超过配额限制。",
            "InternalError.QuotaMaxNodLimit":"超过配额限制。",
            "InternalError.QuotaMaxRtLimit":"超过配额限制。",
            "InternalError.UnexceptedInternal":"内部错误",
            "InternalError.VpcCommon":"VPC报错。",
            "InternalError.VpcPeerNotFound":"对等连接不存在。",
            "InternalError.VpcRecodrNotFound": "未发现vpc记录。",
            "InvalidParameter": "参数错误",
            "MissingParameter":"缺少参数错误",
            "ResourceInUse":"资源被占用",
            "ResourceNotFound":	"资源不存在",
            "ResourceUnavailable":	"资源不可用",
            "UnauthorizedOperation":"未授权操作",
            "UnknownParameter": "未知参数错误",
            "UnsupportedOperation": "操作不支持"
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
    //获取集群信息
    async getColonyInfo () {
      this.loadShow = true;
      let params = {
        Version: "2018-05-25",
        Limit: 10,
        Offset: 0
      };
      params["ClusterIds.0"] = this.clusterId;
      const res = await this.axios.post(TKE_COLONY_LIST, params);
      if (res.Response.Error === undefined) {
        let response = res.Response.Clusters[0];
        this.nodeForm.name = response.ClusterName;
        this.nodeForm.container = response.ClusterNetworkSettings.ClusterCIDR;
        this.nodeForm.os = response.ClusterOs;
        this.clusterInfo = response;
        this.nodeForm.groupVps = response.ClusterNetworkSettings.VpcId;
        this.loadShow = false;
        this.loadShow = true;
        let params = {
          Version: "2017-03-12",
          Offset: 0,
          Limit: 100,
        };
        await this.axios.post(TKE_VPC_METWORK, params).then( async(res2) => {
          if(res2.Response.Error === undefined) {
            this.describeVpcs = res2.Response.VpcSet;
            if(res2.Response.VpcSet.length > 0) {
              this.loadShow = true;
              let param = {
                Version: "2017-03-12",
                Offset: 0,
                Limit: 100,
                "Filters.0.Name": "zone",
                "Filters.0.Values.0": 'ap-taipei-1',
                "Filters.1.Name": "vpc-id",
                "Filters.1.Values.0": response.ClusterNetworkSettings.VpcId
              }
              await this.axios.post(TKE_WORKER_METWORK, param).then(res1 => {
                if(res1.Response.Error === undefined) {
                  this.nodeForm.subNetList = res1.Response.SubnetSet;
                  this.nodeForm.subnetId = res1.Response.SubnetSet[0].SubnetId;
                  this.loadShow = false;
                } else {
                  this.loadShow = false;
                  let ErrTips = {};
                  let ErrOr = Object.assign(ErrorTips, ErrTips);
                  this.$message({
                    message: ErrOr[res1.Response.Error.Code],
                    type: "error",
                    showClose: true,
                    duration: 0
                  });
                }
              });
            }
            this.loadShow = false;
          } else {
            this.loadShow = false;
            let ErrTips = {};
            let ErrOr = Object.assign(ErrorTips, ErrTips);
            this.$message({
              message: ErrOr[res2.Response.Error.Code],
              type: "error",
              showClose: true,
              duration: 0
            });
          }
        });
      } else {
        this.loadShow = false;
        let ErrTips = {
          "InternalError": "内部错误",
          "InternalError.CamNoAuth": "没有权限。",
          "InternalError.Db": "db错误。",
          "InternalError.DbAffectivedRows": "DB错误",
          "InternalError.Param": "Param。",
          "InternalError.PublicClusterOpNotSupport": "集群不支持当前操作。",
          "InternalError.QuotaMaxClsLimit": "超过配额限制。",
          "InternalError.QuotaMaxNodLimit": "超过配额限制。",
          "InvalidParameter": "参数错误",
          "InvalidParameter.Param": "参数错误。",
          "LimitExceeded": "超过配额限制",
          "ResourceNotFound": "资源不存在"
        };
        let ErrOr = Object.assign(ErrorTips, ErrTips);
        this.$message({
          message: ErrOr[res.Response.Error.Code],
          type: "error",
          showClose: true,
          duration: 0
        });
      }
    },
    //获取可用区机型配置信息
    async getDescribeZoneInstanceConfigInfos() {
      let param = {
        Version: "2017-03-12"        
      }
      param["Filters.0.Name"] = "zone";
      param["Filters.0.Values.0"] = "ap-taipei-1";
      param["Filters.1.Name"] = "instance-charge-type";
      param["Filters.1.Values.0"] = this.nodeForm.instanceChargeType;
      await this.axios.post(DESCRIBE_ZONE_INFO, param).then(res => {
        if(res.Response.Error === undefined) {
          this.nodeForm.zoneInfoList = res.Response.InstanceTypeQuotaSet;
          this.nodeForm.modelType = res.Response.InstanceTypeQuotaSet[0];
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
    //获取支持网络
    async getDescribeVpcs() {
      this.loadShow = true;
      let params = {
        Version: "2017-03-12",
        Offset: 0,
        Limit: 100,
      };
      await this.axios.post(TKE_VPC_METWORK, params).then( async(res) => {
        if(res.Response.Error === undefined) {
          this.describeVpcs = res.Response.VpcSet;
          if(res.Response.VpcSet.length > 0) {
            this.loadShow = true;
            let param = {
              Version: "2017-03-12",
              Offset: 0,
              Limit: 100,
              "Filters.0.Name": "zone",
              "Filters.0.Values.0": 'ap-taipei-1',
              "Filters.1.Name": "vpc-id",
              "Filters.1.Values.0": this.groupVps
            }
            await this.axios.post(TKE_WORKER_METWORK, param).then(res1 => {
              if(res1.Response.Error === undefined) {
                this.nodeForm.subNetList = res1.Response.SubnetSet;
                this.nodeForm.subnetId = res1.Response.SubnetId;
                this.loadShow = false;
              } else {
                this.loadShow = false;
                let ErrTips = {};
                let ErrOr = Object.assign(ErrorTips, ErrTips);
                this.$message({
                  message: ErrOr[res1.Response.Error.Code],
                  type: "error",
                  showClose: true,
                  duration: 0
                });
              }
            });
          }
          this.loadShow = false;
        } else {
          this.loadShow = false;
          let ErrTips = {};
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
          this.nodeForm.securityGroups = res.Response.SecurityGroupSet;
          // this.asg.security = res.Response.SecurityGroupSet[0].SecurityGroupName
          this.loadShow = false;
        } else {
          this.loadShow = false;
          let ErrTips = {};
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
    //获取ssh秘钥密码
    async getSecretList() {
      this.loadShow = true;
      let params = {
        Version: "2017-03-12",
        Limit: 100
      }
      await this.axios.post(TKE_SSH, params).then(res => {
        if(res.Response.Error === undefined) {
          this.nodeForm.secretList = res.Response.KeyPairSet;
          this.loadShow = false;
        } else {
          this.loadShow = false;
          let ErrTips = {};
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
    // 返回上一层
    goBack() {
      this.$router.go(-1);
    },
    // -------------------------------------- 第二步 ---------------------------------
    // Master 节点
    SecondMaster(val) {
      // console.log(val)
      if (val === "2") {
        this.colonySecond.workerShow = true;
      } else {
        this.colonySecond.workerShow = false;
      }
    },
    // 计费模式
    SecondCharging(val) {
      this.getDescribeZoneInstanceConfigInfos()
    },
    // 机型
    handleCurrentChange(val) {
      this.nodeForm.modelType = val;
      this.nodeForm.instanceType = val.InstanceType;
    },

    // 购买数据盘
    BuyDataDisk(val) {
      if (val === true) {
        this.colonySecond.buyDataWidth = 764;
      } else {
        this.colonySecond.buyDataWidth = 300;
      }
    },
    // 数据盘 弹框确认
    DataDiskSure() {},
    // 第二步 下一步
    secondNext() {
      this.secondBox = false;
      this.thirdBox = true;
      this.fourthBox = false;
    },
    // ----------------------------------------- 第三步 -------------------------------------
    // 登录方式
    LoginMode(val) {
      console.log(val);
      if (val === "1") {
        this.colonyThird.one = true;
        this.colonyThird.two = false;
        this.colonyThird.three = false;
      } else if (val === "2") {
        this.colonyThird.one = false;
        this.colonyThird.two = true;
        this.colonyThird.three = false;
      } else {
        this.colonyThird.one = false;
        this.colonyThird.two = false;
        this.colonyThird.three = true;
      }
    },
    // 第三步 上一步
    thirdPrev() {
      this.secondBox = true;
      this.thirdBox = false;
      this.fourthBox = false;
    },
    // 第三步 下一步
    thirdNext(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.secondBox = false;
          this.thirdBox = false;
          this.fourthBox = true;
        } else {
          return false
        }
      });
      
    },
    // ----------------------------------------- 第四步 ---------------------------------------
    // 第三步 下一步
    fourthPrev() {
      this.secondBox = false;
      this.thirdBox = true;
      this.fourthBox = false;
    },
    //是否购买数据盘
    isBuyDataDisk() {
      this.nodeForm.dataDiskShow = true;
    },
    // 删除
    deleteDataDisk(index) {
      this.nodeForm.buyDataDiskArr.splice(index, 1);
      // if (this.colonySecond.workerOneList[index].buyDataDiskArr.length === 0) {
      //   this.colonySecond.buyDataDisk = false;
      //   this.colonySecond.buyDataWidth = 300;
      // }
    },
    // 购买数据盘 添加数据盘
    AddDataDisk(index) {
      this.nodeForm.buyDataDiskArr.push({
        dataDiskVal: "CLOUD_PREMIUM",
        dataDiskNum: "10",
        formatMount: false,
        latticeSetVal: "ext3",
        setValue: "/var/lib/docker"
      });
    },
    //选择带宽
    changeInternet() {
      if(this.nodeForm.internetMaxBandwidthOut === 0) {
        this.nodeForm.publicIpAssigned = false;
        this.nodeForm.disabled = true;
      } else {
        this.nodeForm.publicIpAssigned = true;
        this.nodeForm.disabled = false;
      }
    }
  },
  filters: {
    ModelTypeName(val) {
      if (val === "Standard S3") {
        return "标准型S3";
      } else if (val === "Compute C3") {
        return "计算型C3";
      } else if (val === "MEM-optimized M3") {
        return "内存型M3";
      }
    },
    //付费模式
    instanceChargeType(val) {
      if(val) {
        if(val === 'POSTPAID_BY_HOUR') {
          return '按量计费';
        } else {
          return '包年包月';
        }
      }
    },
    //系统盘类型
    systemDiskType(val) {
      if(val) {
        if(val === 'CLOUD_PREMIUM') {
          return "高性能云盘";
        } else {
          return "SSD云盘";
        }
      }
    },
    //数据盘类型
    dataDiskType() {
      if(val) {
        if(val === 'CLOUD_PREMIUM') {
          return "高性能云盘";
        } else {
          return "SSD云盘";
        }
      }
    },
    //宽带类型
    internetChargeType(val) {
      if(val) {
        if(val === 'BANDWIDTH_POSTPAID_BY_HOUR') {
          return '按带宽计费';
        } else {
          return '按使用流量';
        }
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.tke-formpanel-footer {
  ::v-deep .el-button--primary {
    background: #006eff;
    border-color: #006eff;
  }
}
.tke-card {
  a {
    color: #006eff;
    &:hover {
      text-decoration: underline;
    }
  }
  ::v-deep .el-input__inner {
    border-radius: 0px;
  }
  ::v-deep .el-radio-button__inner {
    border-radius: 0px;
  }
  ::v-deep .el-radio-button__orig-radio:checked + .el-radio-button__inner {
    border-color: #006eff;
    background: #fff;
    color: #006eff;
  }
  .el-icon-warning-outline {
    color: #e1504a;
    margin-left: 5px;
    font-weight: 600;
    font-size: 16px;
  }
  .cluster-wran {
    ::v-deep .el-input__inner {
      border: 1px solid #e1504a;
    }
  }
}
// 第二步
.tke-second-box {
  .tke-second-title {
    font-size: 14px;
    color: #000;
    font-weight: 700;
    margin-bottom: 11px;
  }
  ::v-deep .el-form-item__label {
    line-height: 40px;
    font-size: 12px;
    color: #888;
  }
  ::v-deep .el-form-item__content {
    line-height: 40px;
    font-size: 12px;
    color: #444;
    overflow: hidden;
  }
  ::v-deep .el-form-item {
    margin-bottom: 0px;
  }
  .tke-second-tips {
    overflow: hidden;
    padding-bottom: 20px;
    margin-bottom: 20px;
    border-bottom: 1px solid rgb(221, 221, 221);
    .tke-second-worker-select {
      ::v-deep .el-input__inner {
        width: 180px;
        height: 30px;
      }
      ::v-deep .el-select {
        margin-right: 10px;
      }
    }
    & > p {
      float: left;
      &:nth-of-type(1) {
        width: 120px;
        padding: 6px 20px 0px 0px;
        line-height: 18px;
        font-size: 12px;
        color: #888;
        & > i {
          font-size: 14px;
          // margin-top: 2px;
        }
      }
      &:nth-of-type(2) {
        line-height: 24px;
      }
    }
    .data-disk {
      line-height: 40px;
    }
  }
  .tke-second-radio-btn {
    padding-bottom: 16px;
    ::v-deep .el-radio-button {
      width: 90px;
      height: 30px;
      border-radius: 0px;
    }
    ::v-deep .el-radio-button__inner {
      padding: 0px;
      width: 90px;
      height: 30px;
      border-radius: 0px;
      font-size: 12px;
      line-height: 30px;
    }
    ::v-deep .el-radio-button__orig-radio:checked + .el-radio-button__inner {
      border: 1px solid #006eff;
      color: #006eff;
      background: #fff;
      font-size: 12px;
      box-shadow: unset;
    }
    & > p {
      line-height: 14px;
      font-size: 12px;
      color: #888;
      vertical-align: middle;
      margin-top: 8px;
      a {
        color: #006eff;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
  .model-bg {
    width: 99%;
    margin-top: 10px;
    margin-left: 2px;
    box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
    ::v-deep .el-table th {
      padding: 6px 0px;
      font-size: 12px;
    }
    ::v-deep .el-table thead {
      color: #888;
      font-weight: 700;
    }
    ::v-deep .el-table tbody .cell {
      color: #444;
    }
  }
  .tke-second-radio-time {
    padding-bottom: 10px;
    ::v-deep .el-form-item__label {
      line-height: 30px;
    }
    .tke-second-radio-btn {
      margin: 0px;
      padding: 0px;
      line-height: 30px;
      ::v-deep .el-radio-button {
        width: unset;
      }
      ::v-deep .el-radio-button__inner {
        width: unset;
        padding: 0 20px;
      }
      ::v-deep .el-radio-button__orig-radio:checked + .el-radio-button__inner {
        padding: 0 20px;
        width: unset;
      }
    }
  }
  .tke-second-checkbox {
    ::v-deep .el-checkbox__input.is-checked .el-checkbox__inner {
      background: #006eff;
      width: 16px;
      height: 16px;
      border-color: #006eff;
    }
    ::v-deep .el-checkbox__label {
      font-size: 12px;
      padding-left: 6px;
      color: #000;
    }
    ::v-deep .el-checkbox__inner {
      width: 16px;
      height: 16px;
    }
    ::v-deep .el-checkbox__inner::after {
      height: 9px;
      left: 5px;
    }
    ::v-deep .el-checkbox__input.is-checked + .el-checkbox__label {
      font-size: 12px;
      color: #444;
      padding-left: 6px;
    }
    ::v-deep .el-input {
      line-height: 30px;
      width: 88%;
      top: -8px;
    }
    ::v-deep .el-input__inner {
      border-radius: 0px;
      width: 200px;
      height: 30px;
    }
    ::v-deep .el-checkbox {
      line-height: 30px;
    }
  }
  .tke-second-icon-btn {
    margin: 0px;
    padding: 0px;
    a {
      font-size: 12px;
      margin-left: 10px;
      color: #006eff;
      position: relative;
      top: 6px;
      &:hover {
        text-decoration: underline;
      }
    }
  }

  .tke-second-worker {
    overflow: hidden;
    .tke-second-worker-l {
      width: 120px;
      float: left;
      font-size: 12px;
      color: #888;
      padding-top: 6px;
    }
    .tke-second-worker-r {
      width: 88%;
      float: left;
      .tke-second-worker-array {
        width: 100%;
        background-color: #fff;
        -webkit-box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
        box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
        margin-left: auto;
        margin-right: auto;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        padding: 20px;
        margin-top: 4px;
        margin-bottom: 10px;
        & > p {
          text-align: right;
          span {
            cursor: pointer;
            color: #006eff;
            font-size: 12px;
            margin-left: 10px;
          }
        }
        & > ol {
          li {
            font-size: 12px;
            line-height: 24px;
            & > span {
              &:nth-of-type(1) {
                display: inline-block;
                width: 120px;
                text-align: left;
                color: #888;
              }
              &:nth-of-type(2) {
                color: #444;
              }
            }
          }
        }
      }

      .tke-second-worker-add-models {
        border: 1px dashed #ddd;
        margin-top: 10px;
        font-size: 12px;
        text-align: center;
        background: #fff;
        margin-bottom: 16px;
        ::v-deep .el-button {
          border: 0px;
          color: #006eff;
          padding: 0px;
          line-height: 50px;
          &:active {
            background: #fff;
          }
          &:hover {
            background: #fff;
            color: #006eff;
            text-decoration: underline;
          }
          &:focus {
            background: #fff;
          }
        }
      }
    }
  }
  .tke-second-cost {
    .tke-second-cost-num {
      font-size: 14px;
      color: #ff7800;
      font-weight: 400;
    }
    i {
      font-style: normal;
      margin: 0 10px;
    }
    .tke-second-cost-h {
      font-size: 12px;
      color: #444;
    }
    .tke-second-cost-t {
      margin-left: 4px;
      color: #888;
      font-size: 12px;
    }
    .tke-second-cost-w {
      margin-left: 4px;
      color: #bbb;
      font-size: 12px;
    }
  }
}
// 第三步
.tke-third-box {
  ::v-deep .el-checkbox__label {
    font-size: 12px;
    padding-left: 6px;
    color: #000;
  }
  ::v-deep .el-checkbox__inner {
    width: 16px;
    height: 16px;
  }
  ::v-deep .el-checkbox__input.is-checked .el-checkbox__inner {
    background: #006eff;
    width: 16px;
    height: 16px;
    border-color: #006eff;
  }
  ::v-deep .el-checkbox__inner::after {
    height: 9px;
    left: 5px;
  }
  ::v-deep .el-checkbox__input.is-checked + .el-checkbox__label {
    font-size: 12px;
    color: #444;
    padding-left: 6px;
  }
  ::v-deep .el-input {
    line-height: 30px;
    width: 88%;
    top: -8px;
  }
  ::v-deep .el-input__inner {
    border-radius: 0px;
    width: 200px;
    height: 30px;
  }
  ::v-deep .el-checkbox {
    line-height: 30px;
  }
  .password {
    ::v-deep .el-input {
      top: 0px;
      width: 200px;
    }
    p {
      font-size: 12px;
      color: #888;
      vertical-align: middle;
      margin-top: 4px;
      line-height: 14px;
      padding-bottom: 14px;
    }
  }
  .tke-third-tips {
    overflow: hidden;
    padding-bottom: 16px;
    & > p {
      float: left;
      width: 120px;
      padding: 6px 20px 0px 0px;
      line-height: 30px;
      font-size: 12px;
      color: #888;
      & > i {
        font-size: 14px;
      }
    }
    ::v-deep .el-input {
      top: 0px;
      line-height: 36px;
    }
    & > div {
      float: left;
      & > p {
        line-height: 22px;
        font-size: 12px;
        color: #888;
        & > a {
          color: #006eff;
          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }
  .tke-third-tips-h {
    margin: 0px;
    padding: 0px;
    border: 0px;
    & > p {
      line-height: 40px !important;
      &:nth-of-type(1) {
        padding-top: 0px !important;
      }
    }
  }
  .tke-third-broadband {
    padding: 0px;
    margin: 0px;
    border: 0px;
    & > p {
      padding-top: 0px !important;
      line-height: 40px !important;
    }
    ::v-deep .el-radio-group {
      margin-top: 10px;
    }
  }
  .norms {
    border-bottom: 1px solid rgb(221, 221, 221);
    margin-bottom: 20px;
    ::v-deep .el-form-item__content {
      padding-bottom: 10px;
    }
  }
  .tke-third-radio-btn {
    padding-bottom: 0px;
    ::v-deep .el-radio-button__inner {
      width: unset;
      padding: 0px 20px;
    }
    ::v-deep .el-radio-button {
      width: unset;
    }
    .block {
      width: 60%;
      margin-left: 10px;
      ::v-deep .el-input__inner {
        width: 130px;
      }
      ::v-deep .el-input {
        top: 0px;
      }
      ::v-deep .el-input-number__decrease {
        height: 28px;
      }
      ::v-deep .el-input-number__increase {
        height: 28px;
      }
    }
  }
  .tke-third-select {
    ::v-deep .el-input {
      top: 0px;
    }
    ::v-deep .el-input__suffix {
      right: -14px;
      top: -2px;
    }
    & > p {
      line-height: 22px;
      font-size: 12px;
      color: #888;
      & > a {
        color: #006eff;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
  .tke-third-checkbox {
    & > p {
      line-height: 14px;
      font-size: 12px;
      color: #888;
      margin-top: -3px;
      & > a {
        color: #006eff;
        &:hover {
          text-decoration: underline;
        }
      }
    }
    .checkbox-tips {
      color: #ff9d00;
      margin-bottom: 8px;
    }
  }
}
.tke-fourth-box {
  .tke-fourth-node {
    padding-bottom: 40px;
    border-bottom: 1px solid rgb(221, 221, 221);
    margin-bottom: 20px;
    p {
      line-height: 20px;
      &:nth-of-type(1) {
        margin-top: 10px;
      }
    }
  }
  .tke-fourth-broadband {
    border-bottom: 1px solid rgb(221, 221, 221);
    margin-bottom: 14px;
    ::v-deep .el-form-item__content {
      padding-bottom: 14px;
    }
  }
  .cvm-num {
    ::v-deep .el-input__inner {
      height: 30px;
    }
    ::v-deep .el-input-number__decrease {
      width: 30px;
      height: 28px;
      top: 5px;
      line-height: 28px;
    }
    ::v-deep .el-input-number__increase {
      width: 30px;
      height: 28px;
      top: 5px;
      line-height: 28px;
    }
  }
}
.tke-second-worker-popover-disk {
  padding: 6px;
  span {
    display: inline-block;
    height: 30px;
    line-height: 30px;
    padding: 0 10px;
    font-size: 12px;
    border: 1px solid #ddd;
    border-radius: 0;
    color: #444;
    background-color: #f2f2f2;
    position: relative;
    top: 1px;
    left: -1px;
  }
  & > div {
    & > p {
      font-size: 12px;
      color: #888;
      vertical-align: middle;
      margin-top: 8px;
    }
  }
  ::v-deep .el-select {
    margin-right: 10px;
  }
  ::v-deep .el-input__inner {
    border-radius: 0px;
    width: 200px;
    height: 30px;
    font-size: 12px;
  }
  ::v-deep .el-input-number__decrease {
    width: 30px;
    height: 30px;
    line-height: 30px;
    top: 4px;
    left: 0px;
    border: 1px solid #ddd;
    border-radius: 0px;
    background-color: #f2f2f2;
    color: #bbb;
  }
  ::v-deep .el-input-number__increase {
    width: 30px;
    height: 30px;
    line-height: 30px;
    top: 4px;
    right: 0px;
    border: 1px solid #ddd;
    border-radius: 0px;
    background-color: #f2f2f2;
    color: #bbb;
  }
  ::v-deep .el-input-number {
    width: 120px;
  }
  ::v-deep .el-input-number .el-input__inner {
    width: 120px;
  }
  .btn {
    margin-top: 24px;
    text-align: right;
    ::v-deep .el-button {
      border: 0px;
      padding: 0px;
      color: #006eff;
      &:hover {
        color: #006eff;
        text-decoration: underline;
        background: #fff;
      }
    }
  }
  .tke-second-worker-popover-data-bg {
    padding: 0 20px;
    & > div {
      background-color: #f2f2f2;
      padding: 10px;
      margin-top: 10px;
      overflow: hidden;
      & > p {
        width: 120px;
        float: left;
        padding-top: 6px;
        font-size: 12px;
        color: #888;
      }
      & > div {
        float: left;
        & > p {
          font-size: 12px;
          color: #888;
          vertical-align: middle;
          margin-top: 4px;
        }
      }
    }
    .format-and-mount {
      margin-left: 10px;
      ::v-deep .el-checkbox__input.is-checked .el-checkbox__inner {
        background: #006eff;
        width: 16px;
        height: 16px;
        border-color: #006eff;
      }
      ::v-deep .el-checkbox__label {
        font-size: 12px;
        padding-left: 6px;
        color: #000;
      }
      ::v-deep .el-checkbox__inner {
        width: 16px;
        height: 16px;
      }
      ::v-deep .el-checkbox__inner::after {
        height: 9px;
        left: 5px;
      }
      ::v-deep .el-checkbox__input.is-checked + .el-checkbox__label {
        font-size: 12px;
        color: #444;
        padding-left: 6px;
      }
      ::v-deep .el-input {
        line-height: 30px;
        width: 88%;
        top: -8px;
      }
      ::v-deep .el-input__inner {
        border-radius: 0px;
        width: 200px;
        height: 30px;
      }
      ::v-deep .el-checkbox {
        line-height: 30px;
      }
    }
    ::v-deep .el-input {
      width: 200px;
    }
  }
  .add-data-disk {
    padding-left: 20px;
    color: #006eff;
    font-size: 12px;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
}
.distribution {
  padding: 0px !important;
  .format-and-mount {
    margin-top: 16px;
    margin-left: 0px !important;
    a {
      color: #006eff;
      &:hover {
        color: #006eff;
        text-decoration: underline;
      }
    }
  }
}
</style>

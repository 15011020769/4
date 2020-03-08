 <!-- 新建伸缩组 -->
<template>
  <div class="colony-wrap">
    <!-- <HeadCom title="集群管理">
      <el-button style="margin-left:10px;" v-if="!btnload">{{region}}</el-button>
      <el-button style="margin-left:10px;"  icon="el-icon-loading"></el-button>
    </HeadCom>-->
    <div class="tke-content-header">
      <div class="tke-grid">
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
        <h4 class="tke-formpanel-title">启动配置</h4>
        <el-form
          class="tke-form"
          :model="asg"
          :rules="rules"
          ref="asg"
          label-position="left"
          label-width="120px"
          size="mini"
        >
          <el-form-item label="名称">
            <el-input class="w200" v-model="asg.name" placeholder="请输入名称"></el-input>
          </el-form-item>
          <el-form-item label="实例类型">
            <el-radio-group v-model="asg.typeRadio" size="small">
              <el-radio-button label="POSTPAID_BY_HOUR">按量计费</el-radio-button>
              <el-radio-button label="SPOTPAID">竞价付费</el-radio-button>
            </el-radio-group>
            <p v-if="asg.typeRadio=='SPOTPAID'">
              竞价实例(Spot)可以让您以一定幅度的折扣购买实例,但同时系统可能会自动回收这些折扣售卖的实例,
              <span class="tke-text-link">查看详情</span>
            </p>
          </el-form-item>
          <el-form-item label="机型设置">
            <div class="form-controls">
              <el-form class="tke-form" label-position="left" label-width="120px" size="mini">
                <el-form-item label="可用区">
                  <el-radio-group v-model="asg.regionRadio" size="small">
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
                    <span>{{systemDiskShow}}</span>
                    <i class="el-icon-edit tke-icon" @click="diskModelShow = true"></i>
                  </div>
                </el-form-item>
                <el-form-item label="数据盘">
                  <div class="tke-form-item_text">
                    <span>{{datadisk}}</span>
                    <i class="el-icon-edit tke-icon" @click="dataDiskShow = true"></i>
                  </div>
                </el-form-item>
                <el-form-item label="公网带宽">
                  <div class="tke-form-item_text">
                    <span>{{publicband}}</span>
                    <i class="el-icon-edit tke-icon" @click="publicBroadband = true"></i>
                  </div>
                </el-form-item>
              </el-form>
            </div>
          </el-form-item>
          <el-form-item label="最高出价" v-show="asg.typeRadio === 'SPOTPAID'">
            <el-input type="text" v-model="asg.maxPrice" style="width: 300px;"></el-input>
            <span>元/小时</span>
            <p>最高出价默认为当前机型按量计费模式的刊定价(不包括带宽费用)</p>
          </el-form-item>
          <el-form-item label="登录方式">
            <el-radio-group v-model="asg.pwdRadio" size="small">
              <el-radio-button label="pwd1">立即关联密钥</el-radio-button>
              <el-radio-button label="pwd2">自动生成密码</el-radio-button>
              <el-radio-button label="pwd3">设置密码</el-radio-button>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="SSH密钥" v-show="asg.pwdRadio === 'pwd1'">
            <el-select v-model="asg.sshSecret" filterable placeholder="请选择" class="w200">
              <el-option
                v-for="item in secretList"
                :key="item.KeyId"
                :label="item.KeyName"
                :value="item.KeyId"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="用户名" v-show="asg.pwdRadio === 'pwd3'">
            <div class="tke-form-item_text">
              <span>uunin</span>
            </div>
          </el-form-item>
          <el-form-item label="密码" v-show="asg.pwdRadio === 'pwd3'">
            <el-input class="w200" v-model="asg.password" placeholder="请输入密码"></el-input>
            <p
              class="pass"
            >linux机器密码需8到16位，至少包括两项（[a-z,A-Z] , [0-9]和[()`~!@#$%^&*-+=|{}[]:;',.?/]的特殊符号</p>
          </el-form-item>
          <el-form-item label="确认密码" v-show="asg.pwdRadio === 'pwd3'">
            <el-input class="w200" v-model="asg.passwordAgin" placeholder="请输入确认密码"></el-input>
          </el-form-item>

          <el-form-item label="容器目录">
            <el-checkbox v-model="checked">设置容器和镜像存储目录，建议存储到数据盘</el-checkbox>
            <el-form-item v-show="checked">
              <el-input class="w200" v-model="inputRoom"></el-input>
            </el-form-item>
          </el-form-item>

          <!-- 添加安全组 -->
          <el-form-item label="安全组">
            <el-select
              v-model="asg.security"
              placeholder="请选择"
              class="w200"
              style="margin-bottom:15px;"
              @change="addsecurity()"
            >
              <el-option
                v-for="item in securityGroups"
                :key="item.SecurityGroupId"
                :label="changeSecurity(item)"
                :value="item.SecurityGroupId"
              ></el-option>
            </el-select>
            <i class="el-icon-refresh ml10" @click="refresh()"></i>
            <i
              class="el-icon-error ml10"
              v-show="this.domains.length?true:false"
              @click.prevent="deleteAll()"
            ></i>
            <el-form-item v-for="(domain,w) in domains" :key="domain.key">
              <el-select v-model="values" placeholder="请选择" class="w200"  @change="a1(w)">
                <el-option
                  v-for="item in securityGroups"
                  :key="item.SecurityGroupId"
                  :label="changeSecurity(item)"
                  :value="item.SecurityGroupId"
                ></el-option>
              </el-select>
              <i class="el-icon-refresh ml10" @click="refresh()"></i>
              <i class="el-icon-error ml10" @click.prevent="removeDomain(domain)"></i>
            </el-form-item>
            <el-form-item>
              <el-button type="text" @click="addDomain">新增安全组</el-button>
            </el-form-item>
          </el-form-item>

          <el-form-item label="安全加固">
            <el-checkbox v-model="asg.securityService">免费开通</el-checkbox>
            <el-form-item>
              安装组件免费开通DDoS防护、WAF和云镜主机防护
              <a
                href="https://cloud.tencent.com/product/cwp?_ga=1.173966502.440655928.1500464439"
                target="_blank"
              >详细介绍</a>
            </el-form-item>
          </el-form-item>

          <el-form-item label="云监控">
            <el-checkbox v-model="asg.monitor">免费开通</el-checkbox>
            <el-form-item>
              <p style="color:#ff9d00;" v-show="!asg.monitor">取消勾选将无法获得集群、主机、容器等相关监控信息及告警等能力，请慎重选择</p>
              <p>
                免费开通云产品监控、分析和实施告警，安装组件获取主机监控指标
                <a
                  href="https://cloud.tencent.com/product/cm"
                  target="_blank"
                >详细介绍</a>
              </p>
            </el-form-item>
          </el-form-item>

          <!-- <el-form-item label="Label">
            <el-form-item v-for="(domain) in domainstion" :key="domain.key">
              <div class="form-input">
                <el-input v-model="domain.value" size="mini" class="w70"></el-input>
                <span>=</span>
                <el-input v-model="domain.valueKey" size="mini" class="w70"></el-input>
                <i class="el-icon-error ml10" @click.prevent="removeDomain2(domain)"></i>
              </div>
            </el-form-item>
            <el-form-item>
              <el-button type="text" @click="addDomain2">新增Lable</el-button>
            </el-form-item>
          </el-form-item> -->
          <p>
            <i :class="[isActive?'el-icon-caret-bottom':'el-icon-caret-right']"></i>
            <el-button type="text" style="font-size:12px;" @click="isActive=!isActive">高级设置</el-button>
          </p>
          <el-form-item label="自定义数据" v-show="isActive">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows:4 }"
              placeholder="请输入内容"
              v-model="textarea2"
              class="w420"
            ></el-input>
          </el-form-item>

          <el-form-item label="封锁（cordon）" v-show="isActive">
            <el-checkbox v-model="checkedThree">开启封锁</el-checkbox>
            <el-form-item>
              <p>
                封锁节点后，将不接受新的Pod调度到该节点，需要手动取消封锁的节点，或在自定义数据中执行
                <a
                  href="https://cloud.tencent.com/document/product/457/18824"
                  target="_blank"
                >取消封锁命令</a>
              </p>
            </el-form-item>
          </el-form-item>
        </el-form>

        <hr />

        <h4 class="tke-formpanel-title">伸缩组配置</h4>

        <el-form
          class="tke-form"
          :model="asg"
          label-position="left"
          label-width="120px"
          size="mini"
        >
          <el-form-item label="支持网络">
            <el-select v-model="asg.groupVps" disabled placeholder="请选择" @change="changeVpcs()">
              <el-option
                v-for="item in describeVpcs"
                :key="item.VpcId"
                :label="item.VpcName"
                :value="item.VpcId"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="支持子网">
            <el-table
              ref="multipleTable"
              :data="subNetList"
              tooltip-effect="dark"
              style="width: 80%"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column label="子网ID" width="200">
                <template slot-scope="scope">{{ scope.row.SubnetId }}</template>
              </el-table-column>
              <el-table-column prop="name" label="子网名称" width="200">
                <template slot-scope="scope">{{ scope.row.SubnetName }}</template>
              </el-table-column>
              <el-table-column prop="address" label="可用区" show-overflow-tooltip>
                <template slot-scope="scope">{{ scope.row.Zone | Zone }}</template>
              </el-table-column>
            </el-table>
          </el-form-item>

          <el-form-item label="节点数量范围">
            <div class="form-input">
              <el-input v-model="asg.minSize" size="mini" class="w150" placeholder="最小节点"></el-input>
              <span>~</span>
              <el-input v-model="asg.maxSize" size="mini" class="w150" placeholder="最大节点"></el-input>
            </div>
            <p>在设定的节点范围内自动调节，不会超出该设定范围</p>
            <p>
              扩缩容条件 集群内容器缺少可用资源调度时将触发扩容，集群内空闲资源较多时将触发缩容，详情见
              <a
                href="https://cloud.tencent.com/document/product/457/32190#.E9.80.9A.E8.BF.87.E5.BC.B9.E6.80.A7.E4.BC.B8.E7.BC.A9.E8.87.AA.E5.8A.A8.E6.B7.BB.E5.8A.A0.2F.E7.A7.BB.E9.99.A4.E8.8A.82.E7.82.B9"
                target="_blank"
              >集群自动扩缩容说明</a>
            </p>
          </el-form-item>

          <p>
            <i :class="[isActiveMode?'el-icon-caret-bottom':'el-icon-caret-right']"></i>
            <el-button type="text" style="font-size:12px;" @click="isActiveMode=!isActiveMode">高级设置</el-button>
          </p>
          <el-form-item label="重试策略" v-show="isActiveMode">
            <el-radio-group v-model="asg.restart" size="small" @change="setRadio($event)">
              <el-radio-button label="IMMEDIATE_RETRY">快速重试</el-radio-button>
              <el-radio-button label="INCREMENTAL_INTERVALS">简介递增重试</el-radio-button>
            </el-radio-group>
            <p v-show="asg.restart==='IMMEDIATE_RETRY'">立即重试，在较短时间内快速重试，连续失败超过一定次数（5次）后不再重试。</p>
            <p
              v-show="asg.restart==='INCREMENTAL_INTERVALS'"
            >间隔递增重试，随着连续失败次数的增加，重试间隔逐渐增大，重试间隔从秒级到1天不等。</p>
          </el-form-item>
          <el-form-item label="扩缩容模式" v-show="isActiveMode">
            <el-radio-group v-model="asg.shrinkage" size="small">
              <el-radio-button label="RELEASE_MODE">释放模式</el-radio-button>
            </el-radio-group>
            <p>缩容时自动释放Cluster AutoScaler判断的空余节点， 扩容时自动创建新的CVM节点加入到伸缩组</p>
          </el-form-item>
        </el-form>
        <!-- 底部 -->
        <div class="tke-formpanel-footer">
          <el-button size="small" type="primary" @click="submitGroup()">创建伸缩组</el-button>
          <el-button size="small" @click="goBack">取消</el-button>
        </div>
      </div>
    </div>

    <el-dialog title="选择机型" :visible.sync="typeModelShow" width="80%">
      <div class="tke-second-worker-model-box" v-if="typeModelShow">
        <div class="tke-second-worker-model">
          <div class="model-bg">
            <div>
              <el-select v-model="cpuValue" placeholder="请选择">
                <el-option
                  v-for="item in AllCPU"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-select v-model="memeryValue" placeholder="请选择">
                <el-option
                  v-for="item in AllRAM"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
            <div style="margin-top:16px;">
              <el-radio-group v-model="asg.familyObj" @change="changeObj">
                <el-radio-button label="all1">全部实例族</el-radio-button>
                <el-radio-button label="standard1">标准型</el-radio-button>
                <el-radio-button label="Memory1">内存型</el-radio-button>
                <el-radio-button label="Calculation1">计算型</el-radio-button>
              </el-radio-group>
            </div>
            <div style="margin-top:16px;">
              <el-radio-group v-model="asg.familyType" @change="changeType">
                <el-radio-button label="all2">全部实例类型</el-radio-button>
                <el-radio-button v-show="v1" label="standard2">标准型S3</el-radio-button>
                <el-radio-button v-show="v2" label="Memory2">计算型C3</el-radio-button>
                <el-radio-button v-show="v3" label="Calculation2">内存型M3</el-radio-button>
              </el-radio-group>
            </div>
            <div style="margin-top:16px;">
              <el-table
                ref="singleTable"
                :data="zoneInfoList"
                v-loading="loadShow"
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
                  <template slot-scope="scope">{{ModelTypeName(scope.row.TypeName)}}</template>
                </el-table-column>
                <el-table-column label="规格">
                  <template slot-scope="scope">{{ scope.row.InstanceType }}</template>
                </el-table-column>
                <el-table-column label="CPU">
                  <template slot-scope="scope">{{ scope.row.Cpu }}核</template>
                </el-table-column>
                <el-table-column label="内存">
                  <template slot-scope="scope">{{ scope.row.Memory }}GB</template>
                </el-table-column>
                <el-table-column label="配置费用">
                  <template slot-scope="scope">
                    <span class="text-orange">￥{{ scope.row.Price.UnitPrice }}</span>元/小时起
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
          <el-select v-model="asg.diskType" placeholder="请选择">
            <el-option
              v-for="item in systemDisk"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-input-number v-model="asg.diskCapacity" :min="50" :max="500"></el-input-number>
          <span>GB</span>
          <p>范围：50~500，步长：1</p>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="changeDisk()">确 定</el-button>
        <el-button @click="diskModelShow = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="dataDiskShow" width="35%">
      <el-checkbox v-model="buyDataDisk" @change="changeIsBuy()">购买数据盘</el-checkbox>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="changeDataDisk()">确 定</el-button>
        <el-button @click="dataDiskShow = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="buyDataDiskShow" width="60%">
      <div class="tke-second-worker-popover-data-bg" v-for="(x, i) in buyDataDiskArr" :key="i">
        <div>
          <div>
            <p>云盘设置</p>
            <div class="box">
              <el-select v-model="x.dataDiskVal" placeholder="请选择">
                <el-option
                  v-for="item in systemDisk"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-input-number v-model="x.dataDiskNum" :min="10" :max="16000" :step="10"></el-input-number>
              <span>GB</span>
              <el-checkbox v-model="x.formatMount" class="format-and-mount">格式化并挂载</el-checkbox>
            </div>
            <p>范围：10~16000，步长：10</p>
            <p style="margin-top:16px;" v-if="x.formatMount">格式化设置</p>
            <div style="margin-top:16px;" class="box" v-if="x.formatMount">
              <el-select v-model="x.latticeSetVal" placeholder="请选择">
                <el-option
                  v-for="x in latticeSetOpt"
                  :key="x.value"
                  :label="x.label"
                  :value="x.value"
                ></el-option>
              </el-select>
              <el-input v-model="x.setValue"></el-input>
            </div>
          </div>
        </div>
        <i class="el-icon-error ml5" style="margin-top:10px;" @click="deleteDataDisk(i)"></i>
      </div>
      <div
        class="add-data-disk"
        v-if="buyDataDisk && buyDataDiskArr.length != 0"
        @click="AddDataDisk()"
      >添加数据盘</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="changeDataDisk()">确 定</el-button>
        <el-button @click="buyDataDiskShow = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="publicBroadband" width="30%">
      <div class="tke-second-worker-text">
        <div class="tke-second-worker-icon-pen">
          <!-- <el-popover
            placement="bottom"
            width="450"
            trigger="click"
            v-model="publicBroadband"
          >-->
          <div class="tke-second-worker-popover-disk">
            <div>
              <el-select v-model="asg.broadbandVal" placeholder="请选择">
                <el-option
                  v-for="item in broadbandOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-input-number v-model="asg.broadbandNum" :min="0" :max="100"></el-input-number>
              <span>Mbps</span>
              <p>带宽上限：0~100</p>
              <div class="tke-second-worker-popover-data-bg distribution">
                <el-checkbox v-model="asg.pubBroadbandShow" class="format-and-mount">
                  分配免费公网IP，
                  <a href="#">查看详情</a>
                </el-checkbox>
              </div>
            </div>
          </div>
          <!-- </el-popover> -->
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="changePublic()">确 定</el-button>
        <el-button @click="publicBroadband = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import FileSaver from "file-saver";
import XLSX from "xlsx";
import Loading from "@/components/public/Loading";
import { ErrorTips } from "@/components/ErrorTips";
import {
  ALL_CITY,
  DESCRIBE_ZONE_INFO,
  TKE_MISG,
  TKE_SSH,
  TKE_VPC_METWORK,
  TKE_WORKER_METWORK,
  CREATE_GROUP
} from "@/constants";
export default {
  name: "asgCreate",
  data() {
    return {
      clusterId: "", //集群id
      flag1: true,
      flag2: false,
      checked: false,
      checkedOne: true,
      checkedTwo: true,
      loadShow: true, // 加载是否显示
      checkedThree: false,
      typeModelShow: false, //是否打开机型modal
      diskModelShow: false, //是否打开系统盘modal
      dataDiskShow: false, //是否打开数据盘modal
      buyDataDisk: false, //是否显示是否购买数据盘
      buyDataDiskShow: false, //是否显示购买数据盘
      publicBroadband: false,
      securityGroups: [], //安全组列表
      secretList: [], //SSH秘钥密码
      cpuValue: "0", //选中的cpu类型
      memeryValue: "0", //选中的内存类型
      zoneInfoList: [], //电脑机型列表
      modeRadio: "0", //默认选中的机型
      modeData: {}, //机型表格中选中的数据
      describeVpcs: [], //支持的网络
      subNetList: [], //子网列表
      buyDataDiskArr: [], //购买的数据盘列表
      publicband: "按宽带计费 1Mbps", //公共带宽
      datadisk: "暂不购买", //数据盘
      systemDiskShow: "高性能云硬盘 50GB",
      textarea2: "",
      inputRoom: "/var/lib/docker",
      isActive: false,
      isActiveMode: false,
      textOne: "",
      textTwo: "",
      Radio: "pwd1",
      asg: {
        name: "", //名称
        typeRadio: "POSTPAID_BY_HOUR", //实例类型
        pwdRadio: "pwd3", //登录方式
        regionRadio: "region1",
        sshKeySel: "", //ssh秘钥
        security: "", //安全组
        zoneInstanceConfigInfo: "", //机型
        minSize: "", //最小节点数量
        maxSize: "", //最大节点数
        restart: "IMMEDIATE_RETRY", //重试策略
        instanceType: "", //机器类型
        diskType: "CLOUD_PREMIUM", //云盘类型
        groupVps: "", //支持的网络
        diskCapacity: 50, //系统盘容量
        sshSecret: "", //ssh秘钥
        password: "", //密码
        passwordAgin: "", //确认密码
        changeSubNets: [], //选中子网列表
        securityService: true, //是否选中安全加固
        monitor: true, //是否选中云监控
        maxPrice: 0, //最高竞价
        dataDiskVal: "CLOUD_PREMIUM", //默认的数据盘类型
        dataDiskNum: 0,
        formatMount: false,
        latticeSetVal: "ext3",
        setValue: "/var/lib/docker",
        broadbandVal: "BANDWIDTH_POSTPAID_BY_HOUR", //带宽类型
        broadbandNum: 1, //带宽大小
        pubBroadbandShow: true, //是否分配免费IP
        shrinkage: "RELEASE_MODE", //扩缩容模式
        familyObj: "all1", //实例族
        familyType: "all2" //实例类型
      },
      v1: true,
      v2: true,
      v3: true,
      systemDisk: [
        {
          label: "高性能云硬盘",
          value: "CLOUD_PREMIUM"
        },
        {
          label: "SSD云硬盘",
          value: "CLOUD_SSD"
        }
      ],
      latticeSetOpt: [
        { value: "ext3", label: "ext3" },
        { value: "ext4", label: "ext4" },
        { value: "xfs", label: "xfs" }
      ],
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
      optionsOne: [
        {
          value: "选项1",
          label: "xijian"
        },
        {
          value: "选项2",
          label: "SSEE"
        },
        {
          value: "选项3",
          label: "SSEEE"
        }
      ],
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
      broadbandOptions: [
        {
          value: "BANDWIDTH_POSTPAID_BY_HOUR",
          label: "按宽带计费"
        },
        {
          value: "TRAFFIC_POSTPAID_BY_HOUR",
          label: "按使用流量"
        }
      ],
      optionsOne: [],
      domains: [],
      domainstion: [],
      value: "0",
      valueOne: "",
      values: [],
      tableData: [
        {
          date: "subnet-nn56635p",
          name: "asd",
          address: "台北一区"
        },
        {
          date: "subnet-nn56635p",
          name: "asd",
          address: "台北一区"
        },
        {
          date: "subnet-nn56635p",
          name: "asd",
          address: "台北一区"
        }
      ],
      rules: {
        name: [
          { required: true, message: "请输入伸缩组名称", trigger: "change" }
        ],
        ScaleDownUtilizationThreshold: [
          { required: true, message: "占比不能为空", trigger: "change" }
        ],
        ScaleDownUnneededTime: [
          { required: true, message: "时间不能为空", trigger: "change" }
        ],
        ScaleDownDelay: [
          { required: true, message: "时间不能为空", trigger: "change" }
        ]
      }
    };
  },
  components: {},
  created() {
    this.getDescribeZoneInstanceConfigInfos();
    this.getSecurityGroups();
    this.getSecretList();
    this.getDescribeVpcs();
    this.clusterId = this.$route.query.clusterId;
  },
  methods: {
    a1(w,e){
    },
    //提交添加伸缩组
    async submitGroup() {
      this.loadShow = true;
      let subNets = this.asg.changeSubNets;
      let subNetList = [];
      if (subNets.length > 0) {
        for (let i = 0; i < subNets.length; i++) {
          subNetList.push(subNets[i].SubnetId);
        }
      }
      let AutoScalingGroupPara = {
        AutoScalingGroupName: this.asg.name,
        MaxSize: this.asg.maxSize,
        MinSize: this.asg.minSize,
        VpcId: this.asg.groupVps,
        SubnetIds: subNetList,
        RetryPolicy: this.asg.restart,
        ServiceSettings: { ScalingMode: "CLASSIC_SCALING" } //不确定
      };
      let LoginSettings = {};
      if (this.asg.pwdRadio === "pwd1") {
        LoginSettings = {
          KeyIds: [this.asg.sshSecret]
        };
      } else if (this.asg.pwdRadio === "pwd3") {
        LoginSettings = {
          Password: this.asg.password
        };
      }
      let LaunchConfigurePara = {
        LaunchConfigurationName: "",
        InstanceType: this.asg.instanceType,
        SystemDisk: {
          DiskType: this.asg.diskType,
          DiskSize: this.asg.diskCapacity
        },
        InternetAccessible: {
          InternetChargeType: this.asg.broadbandVal,
          InternetMaxBandwidthOut: this.asg.broadbandNum,
          PublicIpAssigned: this.asg.pubBroadbandShow
        },
        LoginSettings: LoginSettings,
        SecurityGroupIds: [this.asg.security], //未做完整
        EnhancedService: {
          SecurityService: { Enabled: this.asg.securityService }
        },
        MonitorService: { Enabled: this.asg.monitor },
        InstanceChargeType: this.asg.typeRadio,
        InstanceMarketOptions: { SpotOptions: { MaxPrice: this.asg.maxPrice } }
      };
      let InstanceAdvancedSettings = {
        MountTarget: "",
        DockerGraphPath: "/var/lib/docker",
        UserScript: "",
        Unschedulable: 0,
        ExtraArgs: { Kubelet: [] }
      };
      let dataArr = this.buyDataDiskArr;
      let datadisk = [];
      let dataDisks = [];
      if (this.buyDataDisk) {
        for (let i = 0; i < dataArr.length; i++) {
          let disk = {
            DiskType: dataArr[i].dataDiskVal,
            DiskSize: dataArr[i].dataDiskNum
          };
          datadisk.push(disk);
          let datadis = {
            AutoFormatAndMount: dataArr[i].formatMount,
            FileSystem: dataArr[i].latticeSetVal,
            MountTarget: dataArr[i].setValue,
            DiskType: dataArr[i].dataDiskVal,
            DiskSize: dataArr[i].dataDiskNum
          };
          dataDisks.push(datadis);
        }
        LaunchConfigurePara.DataDisks = datadisk;
        InstanceAdvancedSettings.DataDisks = dataDisks;
      }

      let params = {
        Version: "2018-05-25",
        ClusterId: this.clusterId,
        AutoScalingGroupPara: JSON.stringify(AutoScalingGroupPara),
        LaunchConfigurePara: JSON.stringify(LaunchConfigurePara),
        InstanceAdvancedSettings: InstanceAdvancedSettings
      };
//       Version: "2018-05-25"
// ClusterId: "cls-h3phnkpy"
// AutoScalingGroupPara: "{"AutoScalingGroupName":"asdasd","MaxSize":3,"MinSize":2,"VpcId":"vpc-6whh21qa","SubnetIds":["subnet-nn56635p"],"RetryPolicy":"IMMEDIATE_RETRY","ServiceSettings":{"ScalingMode":"CLASSIC_SCALING"}}"
// LaunchConfigurePara: "{"LaunchConfigurationName":"","InstanceType":"S3.SMALL1","SystemDisk":{"DiskType":"CLOUD_PREMIUM","DiskSize":50},"InternetAccessible":{"InternetChargeType":"BANDWIDTH_POSTPAID_BY_HOUR","InternetMaxBandwidthOut":1,"PublicIpAssigned":true},"LoginSettings":{"Password":"asdasd123"},"SecurityGroupIds":["sg-81y1wst4","sg-p8r1uybc"],"EnhancedService":{"SecurityService":{"Enabled":true},"MonitorService":{"Enabled":true}},"InstanceChargeType":"POSTPAID_BY_HOUR"}"
// InstanceAdvancedSettings: {MountTarget: "", DockerGraphPath: "", UserScript: "", Unschedulable: 0, ExtraArgs: {Kubelet: []}}
// MountTarget: ""
// DockerGraphPath: ""
// UserScript: ""
// Unschedulable: 0
// ExtraArgs: {Kubelet: []}
// Kubelet: []

      await this.axios.post(CREATE_GROUP, params).then(res => {
        if (res.Response.Error === undefined) {
          this.$message({
            message: "新增成功",
            type: "success",
            showClose: true,
            duration: 0
          });
          this.$router.push({
            name: "colonyNodeManageAsg",
            query: {}
          });
          this.loadShow = false;
        } else {
          this.loadShow = false;
          let ErrTips = {
            FailedOperation: "操作失败",
            InternalError: "内部错误",
            "InternalError.AccountUserNotAuthenticated": "账户未通过认证。",
            "InternalError.AsCommon": "伸缩组资源创建报错。",
            "InternalError.CvmCommon": "cvm创建节点报错。",
            "InternalError.CvmNotFound": "cvm不存在。",
            "InternalError.Db": "db错误。",
            "InternalError.DbAffectivedRows": "DB错误",
            "InternalError.ImageIdNotFound": "镜像未找到。",
            "InternalError.OsNotSupport": "镜像OS不支持。",
            "InternalError.Param": "Param。",
            InvalidParameter: "参数错误",
            "InvalidParameter.AsCommonError": "弹性伸缩组创建参数错误。",
            LimitExceeded: "超过配额限制",
            MissingParameter: "缺少参数错误",
            UnsupportedOperation: "操作不支持"
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
    refresh(){
      this.getSecurityGroups();
    },
    changeObj() {
      if (this.asg.familyObj == "all1") {
        this.getDescribeZoneInstanceConfigInfos();
        this.asg.familyType = "all2";
        this.v1 = true;
        this.v2 = true;
        this.v3 = true;
      } else if (this.asg.familyObj == "standard1") {
        this.asg.familyType = "standard2";
        this.v1 = true;
        this.v2 = false;
        this.v3 = false;
        this.getDescribeZoneInstanceConfigInfos();
      } else if (this.asg.familyObj == "Memory1") {
        this.asg.familyType = "Memory2";
        this.v1 = false;
        this.v2 = true;
        this.v3 = false;
        this.getDescribeZoneInstanceConfigInfos();
      } else if (this.asg.familyObj == "Calculation1") {
        this.asg.familyType = "Calculation2";
        this.v2 = false;
        this.v3 = true;
        this.v1 = false;
        this.getDescribeZoneInstanceConfigInfos();
      }
    },
    changeType() {},
    goBack() {
      this.$router.go(-1);
    },
    removeDomain(item) {
      console.log(item);
      var index = this.domains.indexOf(item);
      if (index !== -1) {
        this.domains.splice(index, 1);
      }
    },
    removeDomain2(item) {
      console.log(item);
      var index = this.domainstion.indexOf(item);
      if (index !== -1) {
        this.domainstion.splice(index, 1);
      }
    },
    addDomain() {
      this.domains.push({
        value: [],
        key: Date.now()
      });
    },
    addDomain2() {
      this.domainstion.push({
        value: "",
        valueKey: "",
        key: Date.now()
      });
    },
    deleteAll() {
      this.domains.splice(0, this.domains.length);
    },
    setRadio(e) {},
    handleSelectionChange(val) {
      this.asg.changeSubNets = val;
    },
    //机型表格选中的数据
    handleCurrentChange(val) {
      this.modeData = val;
    },
    //机型model确定选择数据
    ModelSure() {
      let modeData = this.modeData;
      this.asg.zoneInstanceConfigInfo =
        modeData.InstanceType +
        "(" +
        this.ModelTypeName(modeData.TypeName) +
        "," +
        modeData.Cpu +
        "核" +
        modeData.Memory +
        "GB)";
      this.asg.instanceType = modeData.InstanceType;
      this.typeModelShow = false;
    },
    //系统盘选择
    changeDisk() {
      if (this.asg.diskType === "") {
        this.systemDiskShow = "高性能云硬盘   " + this.asg.diskCapacity;
      } else {
        this.systemDiskShow = "SSD云硬盘   " + this.asg.diskCapacity;
      }
      this.diskModelShow = false;
    },
    changeSecurity(item) {
      return item.SecurityGroupId + "  |  " + item.SecurityGroupName;
    },
    //获取可用区机型配置信息
    async getDescribeZoneInstanceConfigInfos() {
      this.loadShow = true;
      var param = {
        Version: "2017-03-12"
      };
      param["Filters.0.Name"] = "instance-charge-type";
      param["Filters.0.Values.0"] = "POSTPAID_BY_HOUR";
      await this.axios.post(DESCRIBE_ZONE_INFO, param).then(res => {
        var dataList = res.Response.InstanceTypeQuotaSet;
        if (res.Response.Error === undefined) {
          this.loadShow = false;
          if (this.asg.familyObj !== "all1" && this.v1 == true) {
            var list = [];
            dataList.map((v, i) => {
              if (v.InstanceFamily == "S3") {
                return list.push(v);
              }
            });
            dataList = list;
          } else if (this.asg.familyObj !== "all1" && this.v2 == true) {
            var list = [];
            dataList.map((v, i) => {
              if (v.InstanceFamily == "M3") {
                return list.push(v);
              }
            });
            dataList = list;
          } else if (this.asg.familyObj !== "all1" && this.v3 == true) {
            var list = [];
            dataList.map((v, i) => {
              if (v.InstanceFamily == "C3") {
                return list.push(v);
              }
            });
            dataList = list;
          }
          this.zoneInfoList = dataList;
          this.asg.zoneInstanceConfigInfo =
            dataList[0].InstanceType +
            "(" +
            this.ModelTypeName(dataList[0].TypeName) +
            "," +
            dataList[0].Cpu +
            "核" +
            dataList[0].Memory +
            "GB)";
        } else {
          this.loadShow = false;
          let ErrTips = {
            "InvalidInstanceType.Malformed": "指定InstanceType参数格式不合法",
            "InvalidRegion.NotFound": "未找到该区域",
            "InvalidZone.MismatchRegion": "指定的zone不存在"
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
    changeIsBuy(value) {
      this.buyDataDiskShow = true;
      this.dataDiskShow = false;
      if (this.buyDataDisk === true) {
        this.AddDataDisk();
      } else {
        this.buyDataDiskArr = [];
      }
    },
    // 购买数据盘 添加数据盘
    AddDataDisk() {
      this.buyDataDiskArr.push({
        dataDiskVal: "CLOUD_PREMIUM",
        dataDiskNum: "10",
        formatMount: false,
        latticeSetVal: "ext3",
        setValue: "/var/lib/docker"
      });
    },
    //根据数据盘选择显示
    changeDataDisk() {
      let dataArr = this.buyDataDiskArr;
      let datadisk = "";
      if (this.buyDataDisk) {
        for (let i = 0; i < dataArr.length; i++) {
          if (dataArr[i].dataDiskVal === "CLOUD_PREMIUM") {
            datadisk +=
              "[" +
              (i + 1) +
              "]" +
              "高性能云硬盘" +
              dataArr[i].dataDiskNum +
              "GB;";
          } else if (dataArr[i].dataDiskVal === "CLOUD_SSD") {
            datadisk +=
              "[" +
              (i + 1) +
              "]" +
              "SSD云硬盘" +
              dataArr[i].dataDiskNum +
              "GB;";
          }
        }
        this.datadisk = datadisk.substring(0, datadisk.length - 1);
        this.buyDataDiskShow = false;
      } else {
        this.datadisk = "暂不购买";
        this.dataDiskShow = false;
      }
    },
    // 删除
    deleteDataDisk(index) {
      this.buyDataDiskArr.splice(index, 1);
      if (this.buyDataDiskArr.length === 0) {
        this.buyDataDisk = false;
      }
    },
    //根据公网带宽选择数据显示
    changePublic() {
      this.publicBroadband = false;
      if (this.asg.broadbandVal === "BANDWIDTH_POSTPAID_BY_HOUR") {
        this.publicband = "按宽带计费 " + this.asg.broadbandNum + "Mbps";
      } else if (this.asg.broadbandVal === "TRAFFIC_POSTPAID_BY_HOUR") {
        this.publicband = "按使用流量 " + this.asg.broadbandNum + "Mbps";
      }
    },

    //获取安全组列表
    async getSecurityGroups() {
      this.loadShow = true;
      let params = {
        Version: "2017-03-12",
        Offset: 0,
        Limit: 100
      };
      params["Filters.0.Name"] = "project-id";
      params["Filters.0.Values.0"] = 0;
      await this.axios.post(TKE_MISG, params).then(res => {
        if (res.Response.Error === undefined) {
          this.securityGroups = res.Response.SecurityGroupSet;
          this.asg.security = res.Response.SecurityGroupSet[0].SecurityGroupName;
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
      };
      await this.axios.post(TKE_SSH, params).then(res => {
        if (res.Response.Error === undefined) {
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
    },
    ModelTypeName(val) {
      if (val === "Standard S3") {
        return "标准型S3";
      } else if (val === "Compute C3") {
        return "计算型C3";
      } else if (val === "MEM-optimized M3") {
        return "内存型M3";
      }
    },
    //获取支持网络
    async getDescribeVpcs() {
      this.loadShow = true;
      let params = {
        Version: "2017-03-12",
        Offset: 0,
        Limit: 100
      };
      await this.axios.post(TKE_VPC_METWORK, params).then(async res => {
        if (res.Response.Error === undefined) {
          this.describeVpcs = res.Response.VpcSet;
          this.asg.groupVps = res.Response.VpcSet[0].VpcId;
          if (res.Response.VpcSet.length > 0) {
            this.loadShow = true;
            let param = {
              Version: "2017-03-12",
              Offset: 0,
              Limit: 100,
              "Filters.0.Name": "vpc-id",
              "Filters.0.Values.0": res.Response.VpcSet[0].VpcId
            };
            await this.axios.post(TKE_WORKER_METWORK, param).then(res => {
              if (res.Response.Error === undefined) {
                this.subNetList = res.Response.SubnetSet;
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
          }
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
    //获取子网列表
    async getDescribeSubnets() {
      this.loadShow = true;
      let param = {
        Version: "2017-03-12",
        Offset: 0,
        Limit: 100,
        "Filters.0.Name": "vpc-id",
        "Filters.0.Values.0": this.asg.groupVps
      };
      await this.axios.post(TKE_WORKER_METWORK, param).then(res => {
        debugger;
        if (res.Response.Error === undefined) {
          this.subNetList = res.Response.SubnetSet;
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
    //选择网络
    changeVpcs() {
      this.getDescribeSubnets();
    },
    //点击添加安全组
    addsecurity() {
      let domains = this.domains;
    }
  },
  filters: {
    Zone(val) {
      console.log(val.substring(3, val.length - 2));
      if (val.substring(3, val.length - 2) === "taipei") {
        return "台北" + val.substring(val.length - 1, val.length) + "区";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.pass {
  font-size: 12px;
  color: #888;
  margin-top: 8px;
}
.form-input {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 200px;
  span {
    margin: 0 10px;
  }
  i {
    margin: 0 10px;
    cursor: pointer;
  }
}
.form-p {
  margin-bottom: 10px;
  font-size: 12px;
  color: #888;
}

.text-orange {
  font-size: 14px;
  color: #ff7800;
  font-weight: 600;
}

.tke-second-worker-popover-data-bg {
  padding: 0 20px;
  display: flex;
  & > div {
    display: flex;
    width: 99%;
  }
  .box {
    width: 99%;
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
}
</style>


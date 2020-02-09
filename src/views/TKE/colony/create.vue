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
          <h2 class="header-title">创建集群</h2>
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
        <div class="tke-step-item">
          <span class="num">2</span>
          <span class="title">选择机型</span>
          <i class="el-icon-arrow-right"></i>
        </div>
        <div class="tke-step-item">
          <span class="num">3</span>
          <span class="title">云服务器配置</span>
          <i class="el-icon-arrow-right"></i>
        </div>
        <div class="tke-step-item">
          <span class="num">4</span>
          <span class="title">信息确认</span>
        </div>
      </div>
      <hr />
      <!-- 第一步 -->
      <div style="display:none;">
        <div class="tke-reminder">
          当您使用容器服务时，需要先创建集群，容器服务运行在集群中。一个集群由若干节点（云服务器）构成，可运行多个容器服务。集群的更多说明参考<a
            href="#"
            >集群概述</a
          >
        </div>
        <div class="tke-card tke-formpanel-wrap mb60">
          <el-form
            class="tke-form"
            :model="colony"
            label-position="left"
            label-width="120px"
            size="mini"
          >
            <el-form-item label="集群名称">
              <el-input
                class="w200"
                v-model="colony.name"
                placeholder="请输入集群名称，不超过60个字符"
              ></el-input>
            </el-form-item>
            <el-form-item label="新增资源所属项目">
              <el-select
                class="w200"
                v-model="colony.projectValue"
                filterable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in colony.projectOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
              <p>
                集群内新增的云服务器、负载均衡器等资源将会自动分配到该项目下。<a
                  href="#"
                  >使用指引</a
                >
              </p>
            </el-form-item>
            <el-form-item label="Kubernetes版本">
              <el-select
                class="w200"
                v-model="colony.kuValue"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in colony.kuOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="运行时组件">
              <el-radio-group v-model="colony.assemblyRadio" size="small">
                <el-radio-button label="docker">docker</el-radio-button>
                <el-radio-button label="containerd"
                  >containerd (beta)</el-radio-button
                >
              </el-radio-group>
              <a href="#" class="ml5">如何选择</a>
              <p v-if="colony.assemblyRadio == 'docker'">
                dockerd是社区版运行时组件，支持docker api
              </p>
              <p v-else>
                containerd是更为稳定的运行时组件，支持OCI标准，不支持docker
                api，不支持GPU
              </p>
            </el-form-item>
            <el-form-item label="所在地域">
              <el-radio-group v-model="colony.cityRadio" size="small">
                <el-radio-button label="gz">广州</el-radio-button>
                <el-radio-button label="sh">上海</el-radio-button>
                <el-radio-button label="tb">台湾台北</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="集群网络">
              <el-select
                class="w200"
                v-model="colony.networkValue"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in colony.networkOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
              <i class="el-icon-refresh ml5"></i>
              <span class="ml5 text-gray">CIDR: 10.0.0.0/16</span>
              <p>
                如现有的网络不合适，您可以去控制台<a href="#">新建私有网络</a>
              </p>
            </el-form-item>
            <el-form-item>
              <span slot="label">容器网络 <i class="el-icon-info"></i></span>
              <div class="form-controls" style="width:600px">
                <el-form
                  class="tke-form"
                  label-position="left"
                  label-width="140px"
                  size="mini"
                >
                  <el-form-item label="CIDR">
                    <el-select class="w70" v-model="colony.CIDRValue_1">
                      <el-option
                        v-for="item in colony.CIDROptions_1"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                    .
                    <el-tooltip
                      effect="dark"
                      content="范围：16, 18, ... , 31"
                      placement="bottom"
                    >
                      <el-input
                        class="w50"
                        v-model="colony.CIDRValue_2"
                      ></el-input>
                    </el-tooltip>
                    .
                    <el-input
                      class="w50"
                      disabled
                      v-model="colony.CIDRValue_3"
                    ></el-input>
                    .
                    <el-input
                      class="w50"
                      disabled
                      v-model="colony.CIDRValue_4"
                    ></el-input>
                    /
                    <el-select class="w70" v-model="colony.CIDRValue_5">
                      <el-option
                        v-for="item in colony.CIDROptions_5"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                    <a href="#" class="ml5">使用指引</a>
                  </el-form-item>
                  <el-form-item label="Pod数量上限/节点">
                    <el-select
                      class="w200"
                      v-model="colony.PodValue"
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in colony.PodOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="Service数量上限/集群">
                    <el-select
                      class="w200"
                      v-model="colony.ServiceValue"
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in colony.ServiceOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-form>
                <p>
                  当前容器网络配置下，集群最多
                  <strong class="text-red">1008</strong> 个节点
                </p>
              </div>
            </el-form-item>
            <el-form-item label="操作系统">
              <el-select
                class="w320"
                v-model="colony.OSvalue"
                filterable
                placeholder="请选择"
              >
                <el-option-group
                  v-for="group in colony.OSoptions"
                  :key="group.label"
                  :label="group.label"
                >
                  <el-option
                    v-for="item in group.options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-option-group>
              </el-select>
              <a href="#" class="ml5">如何选择</a>
            </el-form-item>
            <el-form-item label="集群描述">
              <el-input
                class="w420"
                type="textarea"
                :rows="6"
                placeholder="请输入集群描述"
                v-model="colony.desc"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="ipvs支持">
              <el-switch v-model="colony.ipvs"> </el-switch>
              <p>
                开启Kube-proxy
                Ipvs支持，注意开启后将不支持关闭，适用于大规模场景下提供更优的转发性能。
              </p>
            </el-form-item>
          </el-form>

          <!-- 底部 -->
          <div class="tke-formpanel-footer">
            <el-button size="small">取消</el-button>
            <el-button size="small" type="primary">下一步</el-button>
          </div>
        </div>
      </div>
      <!-- 第二步 选择机型 -->
      <div
        style="display:none;"
        class="tke-second-box tke-card tke-formpanel-wrap mb60"
      >
        <div class="tke-second-title">已选配置</div>
        <el-form
          ref="form"
          :model="colonySecind"
          label-width="110px"
          label-position="left"
        >
          <el-form-item label="集群名">
            <p>{{ colonySecind.name }}</p>
          </el-form-item>
          <el-form-item label="Kubernetes版本">
            <p>{{ colonySecind.name }}</p>
          </el-form-item>
          <el-form-item label="所在地域">
            <p>{{ colonySecind.name }}</p>
          </el-form-item>
          <el-form-item label="容器网络">
            <p>{{ colonySecind.name }}</p>
          </el-form-item>
          <div class="tke-second-tips">
            <p>操作系统<i class="el-icon-info"></i></p>
            <p>
              Ubuntu Server 18.04.1 LTS 64bit TKE-Optimized
            </p>
          </div>
          <el-form-item label="节点来源">
            <div class="tke-second-radio-btn">
              <el-radio-group v-model="radio1">
                <el-radio-button label="1">新增节点</el-radio-button>
                <el-radio-button label="2">已有节点</el-radio-button>
              </el-radio-group>
            </div>
          </el-form-item>
          <el-form-item label="Master 节点">
            <div class="tke-second-radio-btn">
              <el-radio-group v-model="radio1">
                <el-radio-button label="1">平台托管</el-radio-button>
                <el-radio-button label="2">独立部署</el-radio-button>
              </el-radio-group>
              <p>
                默认集群的Master、Etcd等组件由腾讯云提供维护和服务；为了方便管理，您也可以购买CVM部署Master，详情请参考
                <a href="#">《集群托管模式说明》</a>
                <i class=""></i>
              </p>
            </div>
          </el-form-item>
          <div class="tke-second-tips" style=" border: 0px;">
            <p>计费模式<i class="el-icon-info"></i></p>
            <div class="tke-second-radio-btn tke-second-icon-btn">
              <el-radio-group v-model="radio1">
                <el-radio-button label="1">平台托管</el-radio-button>
                <el-radio-button label="2">独立部署</el-radio-button>
              </el-radio-group>
              <a href="#">详细对比</a>
            </div>
          </div>
          <div class="tke-second-worker">
            <p class="tke-second-worker-l">Worker 配置</p>
            <div class="tke-second-worker-r">
              <ul>
                <li>
                  <p>可用区<i class="el-icon-info"></i></p>
                  <div>
                    <el-radio-group v-model="radio1">
                      <el-radio-button label="1">平台托管</el-radio-button>
                      <el-radio-button label="2">独立部署</el-radio-button>
                    </el-radio-group>
                  </div>
                </li>
                <li>
                  <p>节点网络<i class="el-icon-info"></i></p>
                  <div class="tke-second-worker-select">
                    <el-select v-model="value" placeholder="请选择">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                    <el-select v-model="value" placeholder="请选择">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                    <span>共16381个子网IP，剩16304个可用</span>
                    <p>CIDR:10.209.0.0/16</p>
                    <p>
                      如现有的网络不合适，您可以去控制台<a href="#"
                        >新建私有网络</a
                      >或<a href="#">新建子网</a>
                    </p>
                  </div>
                </li>
                <li>
                  <p>机型</p>
                  <p class="tke-second-worker-text">
                    S3.SMALL1(标准型S3,1核1GB)
                  </p>
                </li>
                <li>
                  <p>系统盘</p>
                  <p class="tke-second-worker-text">
                    高性能云硬盘 50GB
                  </p>
                </li>
                <li>
                  <p>数据盘</p>
                  <p class="tke-second-worker-text">
                    暂不购买
                  </p>
                </li>
                <li>
                  <p>公网带宽</p>
                  <p class="tke-second-worker-text">
                    按带宽计费 1Mbps
                  </p>
                </li>
                <li>
                  <p>数据</p>
                  <div class="tke-second-worker-data">
                    <el-input-number
                      v-model="num"
                      @change="handleChange"
                      :min="1"
                      :max="10"
                      label="描述文字"
                    ></el-input-number>
                    <p>
                      CVM配额:您当前云服务器个数配额为0/0，您最多可购买0台，
                      您可以通过<a href="#">提交工单</a>申请提升配额。
                    </p>
                    <el-row>
                      <el-button class="worker-determine-btn">确定</el-button>
                      <el-button class="worker-cancel-btn-dis">取消</el-button>
                      <el-button class="worker-cancel-btn">取消</el-button>
                    </el-row>
                  </div>
                </li>
              </ul>
              <div class="tke-second-worker-add-models">
                <el-button>添加机型</el-button>
              </div>
            </div>
          </div>
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
          <el-button size="small">上一步</el-button>
          <el-button size="small" type="primary">下一步</el-button>
        </div>
      </div>
      <!-- 第三步 云服务器配置 -->
      <div
        style="display:none;"
        class="tke-second-box tke-third-box tke-card tke-formpanel-wrap mb60"
      >
        <div class="tke-second-title">已选配置</div>
        <el-form
          ref="form"
          :model="colonySecind"
          label-width="110px"
          label-position="left"
        >
          <el-form-item label="集群名">
            <p>{{ colonySecind.name }}</p>
          </el-form-item>
          <el-form-item label="Kubernetes版本">
            <p>{{ colonySecind.name }}</p>
          </el-form-item>
          <el-form-item label="所在地域">
            <p>{{ colonySecind.name }}</p>
          </el-form-item>
          <el-form-item label="容器网络">
            <p>{{ colonySecind.name }}</p>
          </el-form-item>
          <div class="tke-second-tips">
            <p>操作系统<i class="el-icon-info"></i></p>
            <p>
              Ubuntu Server 18.04.1 LTS 64bit TKE-Optimized
            </p>
          </div>
          <el-form-item label="容器目录">
            <el-checkbox v-model="checked"
              >设置容器和镜像存储目录，建议存储到数据盘</el-checkbox
            >
            <el-input v-model="input" placeholder="请输入内容"></el-input>
          </el-form-item>
          <div class="tke-third-tips">
            <p>安全组<i class="el-icon-info"></i></p>
            <div>
              <el-input v-model="input" placeholder="请输入内容"></el-input>
              <p>
                集群节点间的正常通信需要放通部分端口，集群创建完成后可查看安全组及修改规则。<a
                  href="#"
                  >预览默认安全组规则</a
                >
              </p>
              <p>
                如您业务需要自定义配置安全组规则，可<a href="#">添加安全组</a>
              </p>
            </div>
          </div>
          <el-form-item label="登录方式">
            <div class="tke-second-radio-btn tke-third-radio-btn">
              <el-radio-group v-model="radio1">
                <el-radio-button label="1">立即关联密钥</el-radio-button>
                <el-radio-button label="2">自动生成密码</el-radio-button>
                <el-radio-button label="3">设置密码</el-radio-button>
              </el-radio-group>
            </div>
          </el-form-item>
          <el-form-item label="用户名">
            <p>名字</p>
          </el-form-item>
          <el-form-item label="SSH密钥">
            <div class="tke-third-select">
              <el-select v-model="value" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
              <p>如您现有的密钥不合适，可以<a href="#">现在创建</a></p>
            </div>
          </el-form-item>
          <el-form-item label="安全加固">
            <div class="tke-third-checkbox" style="padding-bottom:10px;">
              <el-checkbox v-model="checked">免费开通</el-checkbox>
              <p>
                安装组件免费开通DDoS防护、WAF和云镜主机防护<a href="#"
                  >详细介绍</a
                >
              </p>
            </div>
          </el-form-item>
          <el-form-item label="云监控">
            <div class="tke-third-checkbox">
              <el-checkbox v-model="checked">免费开通</el-checkbox>
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
          <el-button size="small">上一步</el-button>
          <el-button size="small" type="primary">下一步</el-button>
        </div>
      </div>
      <!-- 第四步 信息确认 -->
      <div
        class="tke-second-box tke-fourth-box tke-card tke-formpanel-wrap mb60"
      >
        <div class="tke-second-title">已选配置</div>
        <el-form
          ref="form"
          :model="colonySecind"
          label-width="110px"
          label-position="left"
        >
          <el-form-item label="集群名">
            <p>{{ colonySecind.name }}</p>
          </el-form-item>
          <el-form-item label="Kubernetes版本">
            <p>{{ colonySecind.name }}</p>
          </el-form-item>
          <el-form-item label="所在地域">
            <p>{{ colonySecind.name }}</p>
          </el-form-item>
          <el-form-item label="容器网络">
            <p>{{ colonySecind.name }}</p>
          </el-form-item>
          <el-form-item label="操作系统">
            <p>Ubuntu Server 18.04.1 LTS 64bit TKE-Optimized</p>
          </el-form-item>
          <el-form-item label="Node节点" class="tke-fourth-node">
            <p>可用区:台北一区</p>
            <p>机型:S3.SMALL1(标准型S3,1核1GB)</p>
            <p>系统盘:高性能云硬盘 50GB</p>
            <p>数据盘:暂不购买</p>
            <p>公网带宽:按带宽计费 1Mbps</p>
            <p>数量:1</p>
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
          <el-button size="small">上一步</el-button>
          <el-button size="small" type="primary">完成</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HeadCom from "@/components/public/Head";
import SEARCH from "@/components/public/SEARCH";
import FileSaver from "file-saver";
import XLSX from "xlsx";
import { ALL_CITY } from "@/constants";
export default {
  name: "create",
  data() {
    return {
      colony: {
        name: "",
        projectOptions: [
          {
            value: "a",
            label: "默认项目"
          },
          {
            value: "b",
            label: "测试项目"
          }
        ],
        projectValue: "",
        kuOptions: [
          {
            value: "a",
            label: "1.1.1"
          },
          {
            value: "b",
            label: "1.2.1"
          }
        ],
        kuValue: "a",
        assemblyRadio: "docker",
        cityRadio: "gz",
        networkOptions: [
          {
            value: "a",
            label: "TestVPC"
          },
          {
            value: "b",
            label: "Default-VPC"
          }
        ],
        networkValue: "a",
        CIDROptions_1: [
          {
            value: "192",
            label: "192"
          },
          {
            value: "172",
            label: "172"
          },
          {
            value: "10",
            label: "10"
          }
        ],
        CIDRValue_1: "192",
        CIDRValue_2: "16",
        CIDRValue_3: "0",
        CIDRValue_4: "0",
        CIDROptions_5: [
          {
            value: "16",
            label: "16"
          },
          {
            value: "17",
            label: "17"
          },
          {
            value: "18",
            label: "18"
          },
          {
            value: "19",
            label: "19"
          }
        ],
        CIDRValue_5: "16",
        PodOptions: [
          {
            value: "32",
            label: "32"
          },
          {
            value: "64",
            label: "64"
          },
          {
            value: "128",
            label: "128"
          },
          {
            value: "256",
            label: "256"
          }
        ],
        PodValue: "32",
        ServiceOptions: [
          {
            value: "128",
            label: "128"
          },
          {
            value: "256",
            label: "256"
          },
          {
            value: "512",
            label: "512"
          },
          {
            value: "1024",
            label: "1024"
          }
        ],
        ServiceValue: "1024",
        desc: "",
        OSoptions: [
          {
            label: "Ubuntu",
            options: [
              {
                value: "Ubuntu-1",
                label: "Ubuntu Server 18.04.1 LTS 64bit TKE-Optimized"
              },
              {
                value: "Ubuntu-2",
                label: "Ubuntu Server 18.04.1 LTS 64bit"
              },
              {
                value: "Ubuntu-3",
                label: "Ubuntu Server 16.04.1 LTS 64bit"
              }
            ]
          },
          {
            label: "CentOS",
            options: [
              {
                value: "CentOS-1",
                label: "CentOS 7.6 64bit TKE-Optimized"
              },
              {
                value: "CentOS-2",
                label: "CentOS 7.6 64bit"
              },
              {
                value: "CentOS-3",
                label: "CentOS 7.2 64bit"
              }
            ]
          }
        ],
        OSvalue: "Ubuntu-1",
        ipvs: false
      },
      // 第二步
      colonySecind: {
        name: "55"
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
      value: "",
      num: 1,
      checked: true,
      input: ""
    };
  },
  components: {
    HeadCom,
    SEARCH
  },
  created() {},
  methods: {
    // 返回上一层
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="scss" scoped>
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
    & > p {
      float: left;
      &:nth-of-type(1) {
        width: 110px;
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
  }
  .tke-second-radio-btn {
    margin-top: -6px;
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
      width: 110px;
      float: left;
      font-size: 12px;
      color: #888;
    }
    .tke-second-worker-r {
      width: 89%;
      float: left;
      & > ul {
        width: 100%;
        padding: 10px;
        background: #f2f2f2;
        & > li {
          overflow: hidden;
          & > p {
            float: left;
            color: #888;
            font-size: 12px;
            width: 100px;
            padding: 6px 20px 6px 0px;
          }
          .tke-second-worker-text {
            padding: 6px 24px 16px 0px;
            font-size: 12px;
            color: #444;
            width: 88%;
          }
          & > div {
            float: left;
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
            ::v-deep
              .el-radio-button__orig-radio:checked
              + .el-radio-button__inner {
              border: 1px solid #006eff;
              color: #006eff;
              background: #fff;
              font-size: 12px;
              box-shadow: unset;
            }
            ::v-deep .el-input {
              height: 30px;
            }
            ::v-deep .el-input__inner {
              height: 30px;
              border-radius: 0px;
            }
            ::v-deep .el-select {
              &:nth-of-type(2) {
                margin-left: 10px;
              }
            }
            ::v-deep .el-input-number__decrease {
              height: 28px;
              border-radius: 0px;
              line-height: 28px;
            }
            ::v-deep .el-input-number__increase {
              height: 28px;
              border-radius: 0px;
              line-height: 28px;
            }
            ::v-deep .el-input-number {
              line-height: unset;
            }
          }
          .tke-second-worker-select {
            & > span {
              margin-left: 5px;
              font-size: 12px;
              color: #000;
            }
            & > p {
              font-size: 12px;
              color: #888;
              vertical-align: middle;
              margin-top: 8px;
              & > a {
                color: #006eff;
                &:hover {
                  text-decoration: underline;
                }
              }
            }
          }
          .tke-second-worker-data {
            padding-bottom: 0px;
            & > p {
              font-size: 12px;
              color: #888;
              vertical-align: middle;
              margin-top: 8px;
              & > a {
                color: #006eff;
                &:hover {
                  text-decoration: underline;
                }
              }
            }
            ::v-deep .el-button {
              width: 66px;
              height: 30px;
              line-height: 30px;
              border-radius: 0px;
              padding: 0px;
              margin-top: 16px;
            }
            .worker-determine-btn {
              background-color: #006eff;
              color: #fff;
              border: 1px solid #006eff;
            }
            .worker-cancel-btn {
              background-color: #fff;
              border-color: #ddd;
              color: #000;
            }
            .worker-cancel-btn-dis {
              background-color: #fff;
              border-color: #ddd;
              color: #bbbbbb;
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
.tke-third-box {
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
  .tke-third-tips {
    overflow: hidden;
    padding-bottom: 16px;
    & > p {
      float: left;
      width: 110px;
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
  .tke-third-radio-btn {
    margin-top: 0px;
    padding-bottom: 0px;
  }
  .tke-third-select {
    ::v-deep .el-input {
      top: 0px;
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
      & > a {
        color: #006eff;
        &:hover {
          text-decoration: underline;
        }
      }
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
}
</style>

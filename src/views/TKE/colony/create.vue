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
          <h2 class="header-title">{{$t('TKE.colony.cjjq')}}</h2>
        </div>
        <!-- 右侧 -->
        <div class="grid-right"></div>
      </div>
    </div>
    <div class="colony-main">
      <div class="tke-step tke-grid">
        <div class="tke-step-item is-curr">
          <span class="num">1</span>
          <span class="title">{{$t('TKE.colony.jqxx')}}</span>
          <i class="el-icon-arrow-right"></i>
        </div>
        <div
          class="tke-step-item"
          :class="{ 'is-curr': secondBox || thirdBox || fourthBox }"
        >
          <span class="num">2</span>
          <span class="title">{{$t('TKE.colony.xzjx')}}</span>
          <i class="el-icon-arrow-right"></i>
        </div>
        <div
          class="tke-step-item"
          :class="{ 'is-curr': thirdBox || fourthBox }"
        >
          <span class="num">3</span>
          <span class="title">{{$t('TKE.colony.yfwqpz')}}</span>
          <i class="el-icon-arrow-right"></i>
        </div>
        <div class="tke-step-item" :class="{ 'is-curr': fourthBox }">
          <span class="num">4</span>
          <span class="title">{{$t('TKE.colony.xxqr')}}</span>
        </div>
      </div>
      <hr />
      <!-- 第一步 -->
      <div v-if="firstBox">
        <div class="tke-reminder">
          {{$t('TKE.colony.syrqfw')}}
          <!-- <a href="#">集群概述</a> -->
        </div>
        <div class="tke-card tke-formpanel-wrap mb60">
          <el-form
            class="tke-form"
            :model="colony"
            label-position="left"
            label-width="120px"
            size="mini"
          >
            <el-form-item :label="$t('TKE.colony.jqmc')">
              <el-input
                class="w200"
                v-model="colony.name"
                :class="{ 'cluster-wran': colony.nameWran }"
                @blur="ClusterNameBlur"
                @focus="ClusterNameFocus"
                :placeholder="$t('TKE.colony.qsrjqmc')"
              ></el-input>
              <el-tooltip
                effect="light"
                :content="$t('TKE.colony.jqmcbwk')"
                placement="right"
                v-if="colony.nameWran"
                ><i class="el-icon-warning-outline ml5"></i>
              </el-tooltip>
            </el-form-item>
            <el-form-item :label="$t('TKE.colony.xzzyssxm')">
              <el-select
                class="w200"
                v-model="colony.projectValue"
                filterable
                :placeholder="$t('TKE.overview.qxz')"
              >
                <el-option
                  v-for="item in colony.projectOptions"
                  :key="item.projectId"
                  :label="item.projectName"
                  :value="item.projectId"
                >
                </el-option>
              </el-select>
              <p>
                {{$t('TKE.colony.zyzdfpxm')}}
                <!-- <a href="../../index.html#/documentcenter/doc/11185">使用指引</a> -->
              </p>
            </el-form-item>
            <el-form-item label="Kubernetes版本">
              <el-select
                class="w200"
                v-model="colony.kuValue"
                :placeholder="$t('TKE.overview.qxz')"
                @change="KubernetesChange"
              >
                <el-option
                  v-for="item in colony.kuOptions"
                  :key="item.Version"
                  :label="item.Version"
                  :value="item.Version"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('TKE.colony.yxszj')">
              <el-radio-group v-model="colony.assemblyRadio" size="small">
                <el-radio-button label="docker">docker</el-radio-button>
                <el-radio-button label="containerd" v-if="!colony.assemblyDis"
                  >containerd (beta)</el-radio-button
                >
                <el-tooltip
                  effect="light"
                  :content="$t('TKE.colony.jzcbb')"
                  placement="top"
                  v-if="colony.assemblyDis"
                >
                  <el-radio-button label="containerd" disabled
                    >containerd (beta)</el-radio-button
                  >
                </el-tooltip>
              </el-radio-group>
              <el-popover placement="right" width="450" trigger="click">
                <div class="how-choose">
                  <h3>{{$t('TKE.colony.rhxz')}}</h3>
                  <p>{{$t('TKE.colony.tkezcyhxz')}}</p>
                  <p>
                    {{$t('TKE.colony.cdylgd')}}
                    {{$t('TKE.colony.jyxz')}} containerd。
                  </p>
                  <p>{{$t('TKE.colony.qxdzwzj')}}</p>
                  <ul>
                    <li><span></span>{{$t('TKE.colony.rxsy')}} docker in docker</li>
                    <li>
                      <span></span>{{$t('TKE.colony.rxjdsyd')}}
                      build/push/save/load 等命令
                    </li>
                    <li><span></span>{{$t('TKE.colony.rxdy')}} docker API</li>
                    <li><span></span>如需 docker compose 或 docker swarm</li>
                    <li><span></span>{{$t('TKE.colony.rxcjyy')}}</li>
                    <li><span></span>{{$t('TKE.colony.rxrzcj')}}</li>
                  </ul>
                  <p class="hover-target">
                    <!-- <a href="../../index.html#/documentcenter/doc/35747" class="ml5" slot="reference">查看详情</a> -->
                  </p>
                </div>
                <a href="javascript:;" class="ml5" slot="reference">{{$t('TKE.colony.rhxz')}}</a>
              </el-popover>

              <p v-if="colony.assemblyRadio == 'docker'">
                {{$t('TKE.colony.dzcapi')}}
              </p>
              <p v-else>
                {{$t('TKE.colony.cbzcd')}}
                api，不支持GPU
              </p>
            </el-form-item>
            <el-form-item label="所在地域">
              <el-radio-group v-model="colony.cityRadio" size="small">
                <el-radio-button label="tb">{{$t('TKE.overview.zgtb')}}</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('TKE.colony.jqwl')">
              <el-select
                class="w200"
                v-model="colony.networkValue"
                :placeholder="$t('TKE.colony.qxzjqwl')"
                @change="NetWork"
              >
                <el-option
                  v-for="item in colony.networkOptions"
                  :key="item.VpcId"
                  :label="item.VpcName"
                  :value="item.VpcId"
                >
                </el-option>
              </el-select>
              <i class="el-icon-refresh ml5" @click="NetworkRefresh()"></i>
              <span class="ml5 text-gray">CIDR: {{ colony.CidrBlock }}</span>
              <p>
                {{$t('TKE.colony.wlbhs')}}<a href="../priNetwork">{{$t('TKE.colony.xjsywl')}}</a>
              </p>
            </el-form-item>
            <el-form-item>
              <span slot="label"
                >{{$t('TKE.colony.rqwl')}}
                <el-tooltip
                  effect="light"
                  :content="$t('TKE.colony.rqbyjdct')"
                  placement="right"
                  ><i class="el-icon-info"></i> </el-tooltip
              ></span>
              <div class="form-controls" style="width:600px">
                <el-form
                  class="tke-form"
                  label-position="left"
                  label-width="140px"
                  size="mini"
                >
                  <el-form-item
                    label="CIDR"
                    :class="{ 'cidr-color': colony.CIDRTips.IsConflict }"
                  >
                    <el-select
                      class="w70"
                      v-model="colony.CIDRValue_1"
                      @change="CIDchange_1"
                    >
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
                      effect="light"
                      :content="colony.CIDRValueContent_2"
                      placement="bottom"
                      :disabled="colony.CIDRTipsDis_2"
                    >
                      <el-input
                        class="w56"
                        v-model="colony.CIDRValue_2"
                        :disabled="colony.CIDRValueDis_2"
                        @input="NetWork()"
                        @blur="CIDR2(colony.CIDRValue_2)"
                      ></el-input>
                    </el-tooltip>
                    .
                    <el-tooltip
                      effect="light"
                      :content="colony.CIDRValueContent_3"
                      placement="bottom"
                      :disabled="colony.CIDRTipsDis_3"
                    >
                      <el-input
                        class="w56"
                        :disabled="colony.CIDRValueDis_3"
                        v-model="colony.CIDRValue_3"
                        @input="NetWork()"
                        @blur="CIDR3(colony.CIDRValue_3)"
                      ></el-input>
                    </el-tooltip>
                    .
                    <el-input
                      class="w56"
                      :disabled="colony.CIDRValueDis_4"
                      v-model="colony.CIDRValue_4"
                      @input="NetWork()"
                    ></el-input>
                    /
                    <el-select
                      class="w70"
                      v-model="colony.CIDRValue_5"
                      @change="CIDchange_5"
                    >
                      <el-option
                        v-for="item in colony.CIDROptions_5"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                    <!-- <a href="#" class="ml5">使用指引</a> -->
                    <div
                      class="cid-tips tke-second-box"
                      v-if="colony.CIDRTips.IsConflict"
                    >
                      <p>
                        {{$t('TKE.colony.czct')}}
                        {{ colony.CIDRTips.ConflictType }}
                      </p>
                      <p>{{ colony.CIDRTips.ConflictMsg }}</p>
                      <!-- <div class="tke-second-checkbox">
                                            <el-checkbox v-model="colonyThird.safetyChecked"></el-checkbox>
                                            <span>与路由冲突时，强制使用该地址访问  <el-tooltip
                              effect="dark"
                              content="容器网段路由将由系统自动生成且优先级高于VPC中其他已配置自定义路由"
                              placement="bottom"
                            ><i class="el-icon-info"></i></el-tooltip></span>
                                        </div> -->
                    </div>
                  </el-form-item>
                  <el-form-item :label="$t('TKE.colony.pslsx')">
                    <el-select
                      class="w200"
                      v-model="colony.PodValue"
                      :placeholder="$t('TKE.overview.qxz')"
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
                  <el-form-item :label="$t('TKE.colony.sslsx')">
                    <el-select
                      class="w200"
                      v-model="colony.ServiceValue"
                      :placeholder="$t('TKE.overview.qxz')"
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
                <!-- <p>当前容器网络配置下，集群最多
                                <strong class="text-red">1008</strong> 个节点
                            </p> -->
              </div>
            </el-form-item>
            <el-form-item :label="$t('TKE.colony.czxt')">
              <el-select
                class="w320"
                v-model="colony.OSvalue"
                filterable
                :placeholder="$t('TKE.overview.qxz')"
              >
                <el-option
                  v-for="group in colony.OSoptions"
                  :key="group.ImageId"
                  :label="group.Alias"
                  :value="group.ImageId"
                >
                </el-option>
              </el-select>
              <el-popover placement="right" width="550" trigger="click">
                <div class="how-choose">
                  <h2>TKE-Optimized 的{{$t('TKE.colony.ys')}}</h2>
                  <h3>{{$t('TKE.colony.nhdz')}}</h3>
                  <li>{{$t('TKE.colony.jynh')}}</li>
                  <li>{{$t('TKE.colony.zjxtx')}}</li>
                  <h3>容器支持</h3>
                  <li>{{$t('TKE.colony.zdrqcj')}}</li>
                  <li>支持 meminfo、vmstat、cpuinfo、stat、loadavg {{$t('TKE.colony.dgl')}}</li>
                  <li>支持 sysctl {{$t('TKE.colony.gli')}}，如 tcp_no_delay_ack、tcp_max_orphans</li>
                  <li>{{$t('TKE.colony.xf')}} bug</li>
                  <h3>{{$t('TKE.colony.xnyh')}}</h3>
                  <li>{{$t('TKE.colony.yhncfp')}}</li>
                  <li>{{$t('TKE.colony.yhwlsb')}}</li>
                  <li>{{$t('TKE.colony.xzxt')}} OOM</li>
                </div>
                <!-- <a href="javascript:;" class="ml5">如何选择</a> -->
                <!-- <a href="javascript:;" class="ml5" slot="reference">{{$t('TKE.colony.rhxz')}}</a> -->
              </el-popover>
              <!-- <a href="#" class="ml5">如何选择</a> -->
            </el-form-item>
            <el-form-item label="集群描述">
              <el-input
                class="w420"
                type="textarea"
                :rows="6"
                :placeholder="$t('TKE.colony.qsrjqms')"
                v-model="colony.desc"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="ipvs支持">
              <el-switch v-model="colony.ipvs"> </el-switch>
              <p>
                {{$t('TKE.colony.kq')}}Kube-proxy
                {{$t('TKE.colony.ipvszc')}}
              </p>
            </el-form-item>
          </el-form>
          <!-- 底部 -->
          <div class="tke-formpanel-footer">
            <el-button size="small" @click="goBack">取消</el-button>
            <el-button size="small" type="primary" @click="firstNext"
              >下一步</el-button
            >
          </div>
        </div>
      </div>
      <!-- 第二步 选择机型 -->
      <div
        v-if="secondBox"
        class="tke-second-box tke-card tke-formpanel-wrap mb60"
      >
        <div class="tke-second-title">{{$t('TKE.colony.yxpz')}}</div>
        <el-form
          ref="form"
          :model="colonySecond"
          label-width="120px"
          label-position="left"
        >
          <el-form-item :label="$t('TKE.colony.jqm')">
            <p>{{ dispose.name }}</p>
          </el-form-item>
          <el-form-item label="Kubernetes版本">
            <p>{{ dispose.kuValue }}</p>
          </el-form-item>
          <el-form-item label="所在地域">
            <p>{{ dispose.cityRadio }}</p>
          </el-form-item>
          <el-form-item :label="$t('TKE.colony.rqwl')">
            <p>{{ dispose.container }}</p>
          </el-form-item>
          <div class="tke-second-tips">
            <p>
              {{$t('TKE.colony.czxt')}}<el-tooltip
                :content="$t('TKE.colony.xghsyxxt')"
                placement="right"
                effect="light"
                ><i class="el-icon-info ml5"></i
              ></el-tooltip>
            </p>
            <p>
              {{ dispose.OSvalue }}
            </p>
          </div>
          <el-form-item :label="$t('TKE.colony.jdly')">
            <div class="tke-second-radio-btn">
              <el-radio-group
                v-model="colonySecond.source"
                @change="NodeSource"
              >
                <el-radio-button label="1">{{$t('TKE.colony.xzjdian')}}</el-radio-button>
                <el-radio-button label="2">{{$t('TKE.colony.yyjd')}}</el-radio-button>
              </el-radio-group>
            </div>
          </el-form-item>
          <el-form-item :label="$t('TKE.colony.mjd')">
            <div class="tke-second-radio-btn">
              <el-radio-group
                v-model="colonySecond.master"
                @change="SecondMaster"
              >
                <el-radio-button label="1">{{$t('TKE.colony.pttg')}}</el-radio-button>
                <el-radio-button label="2">{{$t('TKE.colony.dlbs')}}</el-radio-button>
              </el-radio-group>
              <p>
                {{$t('TKE.colony.mrjqm')}}
                <!-- <a href="#">《集群托管模式说明》</a> -->
                <i class=""></i>
              </p>
            </div>
          </el-form-item>
          <div v-if="colonySecond.boxShow">
            <el-form-item :label="$t('TKE.colony.wjd')" v-if="colonySecond.workerShow">
              <div class="tke-second-radio-btn">
                <el-radio-group
                  v-model="colonySecond.worker"
                  @change="WorkerNodeChange"
                >
                  <el-radio-button label="1">立即部署</el-radio-button>
                  <el-radio-button label="2">{{$t('TKE.colony.zbbs')}}</el-radio-button>
                </el-radio-group>
              </div>
            </el-form-item>
            <div
              class="tke-second-tips"
              style="border: 0px;margin:0px;"
              v-if="colonySecond.sourceShow"
            >
              <p>
                {{$t('TKE.colony.jfms')}}
                <el-popover placement="right" width="450" trigger="hover">
                  <div class="charging-mode">
                    <div>
                      <span>{{$t('TKE.colony.aljf')}}</span>
                      <p>
                        {{$t('TKE.colony.amjf')}}
                      </p>
                    </div>
                    <div>
                      <span>包年包月</span>
                      <p>
                        {{$t('TKE.colony.syny')}}
                      </p>
                    </div>
                  </div>
                  <i class="el-icon-info ml5" slot="reference"></i>
                </el-popover>
              </p>
              <div class="tke-second-radio-btn tke-second-icon-btn">
                <el-radio-group
                  v-model="colonySecond.charging"
                  @change="SecondCharging"
                >
                  <el-radio-button label="1">{{$t('TKE.colony.aljf')}}</el-radio-button>
                  <!-- <el-radio-button label="2">包年包月</el-radio-button> -->
                </el-radio-group>
                <!-- <a href="#">详细对比</a> -->
              </div>
            </div>
            <el-form-item
              :label="$t('TKE.colony.gmsc')"
              v-if="colonySecond.chargingShow"
              class="tke-second-radio-time"
            >
              <div class="tke-second-radio-btn">
                <el-radio-group
                  v-model="colonySecond.buyTime"
                  @change="BuyTime"
                >
                  <el-radio-button label="1">1{{$t('TKE.colony.gy')}}</el-radio-button>
                  <el-radio-button label="2">2{{$t('TKE.colony.gy')}}</el-radio-button>
                  <el-radio-button label="3">3{{$t('TKE.colony.gy')}}</el-radio-button>
                  <el-radio-button label="4">6{{$t('TKE.colony.gy')}}</el-radio-button>
                  <el-radio-button label="12">1年</el-radio-button>
                  <el-radio-button label="24">2年</el-radio-button>
                  <el-radio-button label="36">3年</el-radio-button>
                </el-radio-group>
              </div>
            </el-form-item>
            <el-form-item :label="$t('TKE.colony.zdxf')" v-if="colonySecond.chargingShow">
              <div class="tke-second-checkbox">
                <el-checkbox v-model="colonySecond.renew"
                  >{{$t('TKE.colony.zhyezg')}}</el-checkbox
                >
              </div>
            </el-form-item>
            <div
              class="tke-second-worker"
              style="margin-bottom:10px;"
              v-if="
                colonySecond.workerShow === true && colonySecond.source == 1
              "
            >
              <p class="tke-second-worker-l">Master&Etcd 配置</p>
              <div class="tke-second-worker-r">
                <div
                  v-for="(item, index) in colonySecond.masterOneList"
                  :key="index"
                >
                  <div class="tke-second-worker-array" v-if="item.showText">
                    <p v-if="colonySecond.masterOneList.length > 0">
                      <span @click="EditWorker(index, 2)">{{$t('TKE.overview.bj')}}</span>
                      <span
                        @click="DeleteWorker(index, 2)"
                        v-if="colonySecond.masterOneList.length > 0"
                        >{{$t('TKE.overview.sc')}}</span
                      >
                      <el-tooltip
                        v-else
                        :content="$t('TKE.colony.bksc')"
                        placement="top"
                        effect="light"
                      >
                        <span class="delete-color">{{$t('TKE.overview.sc')}}</span>
                      </el-tooltip>
                    </p>
                    <ol>
                      <li>
                        <span>{{$t('TKE.colony.kyq')}}</span>
                        <span>{{$t('TKE.colony.tbyq')}}</span>
                      </li>
                      <li>
                        <span>{{$t('TKE.colony.jdwl')}}</span>
                        <span>{{ item.workerNodeNetworkValue }}</span>
                      </li>
                      <li>
                        <span>配置</span>
                        <span
                          >{{ item.modelName }}({{ item.modelType }},{{
                            item.modelHe
                          }}核{{ item.modelGB }}GB)</span
                        >
                      </li>
                      <li>
                        <span>{{$t('TKE.colony.xtp')}}</span>
                        <span
                          >{{ item.systemDiskValue }}
                          {{ item.systemDiskNumber }}GB</span
                        >
                      </li>
                      <li>
                        <span>{{$t('TKE.colony.sjp')}}</span>
                        <span>{{ item.dataDiskValue }}</span>
                      </li>
                      <li>
                        <span>{{$t('TKE.colony.gwdk')}}</span>
                        <span
                          >{{ item.broadbandValue }}
                          {{ item.broadbandNumber }}Mbps</span
                        >
                      </li>
                      <li>
                        <span>{{$t('TKE.colony.sliang')}}</span>
                        <span>{{ item.dataNum }} 台</span>
                      </li>
                    </ol>
                  </div>
                  <ul v-if="item.showEdit">
                    <li>
                      <p>
                        {{$t('TKE.colony.kyq')}}<el-tooltip
                          :content="$t('TKE.colony.kyqstydy')"
                          placement="right"
                          effect="light"
                          ><i class="el-icon-info ml5"></i
                        ></el-tooltip>
                      </p>
                      <div>
                        <el-radio-group v-model="colonySecond.usableArea">
                          <el-radio-button label="1">{{$t('TKE.colony.tbyq')}}</el-radio-button>
                        </el-radio-group>
                      </div>
                    </li>
                    <li>
                      <p>
                        {{$t('TKE.colony.jdwl')}}<el-tooltip
                          :content="$t('TKE.colony.xtwjqzjfp')"
                          placement="right"
                          effect="light"
                          ><i class="el-icon-info ml5"></i
                        ></el-tooltip>
                      </p>
                      <div class="tke-second-worker-select">
                        <el-select
                          v-model="colony.networkValue"
                          :placeholder="$t('TKE.overview.qxz')"
                          disabled
                        >
                          <el-option
                            v-for="item in colony.networkOptions"
                            :key="item.VpcId"
                            :label="item.VpcName"
                            :value="item.VpcId"
                          >
                          </el-option>
                        </el-select>
                        <el-select
                          v-model="item.workerNodeNetworkVal"
                          :placeholder="$t('TKE.overview.qxz')"
                          @change="NodeSelect"
                        >
                          <el-option
                            v-for="item in colonySecond.workerNodeNetOpt"
                            :key="item.SubnetId"
                            :label="item.SubnetName"
                            :value="item.SubnetId"
                          >
                          </el-option>
                        </el-select>
                        <span
                          >共{{ item.nodeTotalNum }}{{$t('TKE.colony.gzw')}}{{
                            item.nodeSurplusNum
                          }}{{$t('TKE.overview.ge')}}可用</span
                        >
                        <p>CIDR:{{ colony.CidrBlock }}</p>
                        <p>
                          {{$t('TKE.colony.wlbhs')}}<a href="../priNetwork">{{$t('TKE.colony.xjsywl')}}</a>或
                          <a href="../subnet">{{$t('TKE.colony.xjzw')}}</a>
                        </p>
                      </div>
                    </li>
                    <li>
                      <p>{{$t('TKE.colony.jxing')}}</p>
                      <p class="tke-second-worker-text">
                        {{ item.modelName }}({{ item.modelType }},{{
                          item.modelHe
                        }}核{{ item.modelGB }}GB)
                        <i
                          class="el-icon-edit"
                          @click="item.modelShow = true"
                        ></i>
                      </p>
                      <div
                        class="tke-second-worker-model-box"
                        v-if="item.modelShow"
                      >
                        <div class="tke-second-worker-model">
                          <p>
                            <span>{{$t('TKE.colony.xzjx')}}</span
                            ><i
                              class="el-icon-close"
                              @click="item.modelShow = false"
                            ></i>
                          </p>
                          <div class="model-bg">
                            <div>
                              <el-select
                                v-model="colonySecond.AllCPUVal"
                                :placeholder="$t('TKE.overview.qxz')"
                                @change="TableFilter(2)"
                              >
                                <el-option
                                  v-for="item in colonySecond.AllCPU"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value"
                                >
                                </el-option>
                              </el-select>
                              <el-select
                                v-model="colonySecond.AllRAMVal"
                                :placeholder="$t('TKE.overview.qxz')"
                                @change="TableFilter(2)"
                              >
                                <el-option
                                  v-for="item in colonySecond.AllRAM"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value"
                                >
                                </el-option>
                              </el-select>
                            </div>
                            <div style="margin-top:16px;">
                              <el-radio-group
                                v-model="colonySecond.caseRace"
                                @change="
                                  AllModel();
                                  TableFilter(2);
                                "
                              >
                                <el-radio-button label="1"
                                  >{{$t('TKE.colony.qbslz')}}</el-radio-button
                                >
                                <el-radio-button label="Standard"
                                  >{{$t('TKE.colony.bzx')}}</el-radio-button
                                >
                                <el-radio-button label="MEM-optimized"
                                  >{{$t('TKE.colony.ncx')}}</el-radio-button
                                >
                                <el-radio-button label="Compute"
                                  >{{$t('TKE.colony.jsx')}}</el-radio-button
                                >
                              </el-radio-group>
                            </div>
                            <div style="margin-top:16px;">
                              <el-radio-group
                                v-model="colonySecond.caseType"
                                @change="TableFilter(2)"
                              >
                                <el-radio-button label="1"
                                  >{{$t('TKE.colony.qbsllx')}}</el-radio-button
                                >
                                <el-radio-button label="S3" v-if="S3show"
                                  >{{$t('TKE.colony.bzx')}}S3</el-radio-button
                                >
                                <el-radio-button label="C3" v-if="C3show"
                                  >{{$t('TKE.colony.jsx')}}C3</el-radio-button
                                >
                                <el-radio-button label="M3" v-if="M3show"
                                  >{{$t('TKE.colony.ncx')}}M3</el-radio-button
                                >
                              </el-radio-group>
                            </div>
                            <div
                              style="margin-top:16px;"
                              v-if="tableFilterShow"
                            >
                              <el-table
                                ref="masterSingleTable"
                                :data="colonySecond.masterTableList"
                                highlight-current-row
                                @current-change="handleCurrentChange"
                                style="width: 100%"
                                height="500px"
                              >
                                <el-table-column width="50">
                                  <template slot-scope="scope">
                                    <el-radio
                                      v-model="item.radio1"
                                      :label="scope.$index"
                                    >
                                      <i></i>
                                    </el-radio>
                                  </template>
                                </el-table-column>
                                <el-table-column :label="$t('TKE.colony.jxing')">
                                  <template slot-scope="scope">
                                    {{ ModelTypeName(scope.row.TypeName) }}
                                  </template>
                                </el-table-column>
                                <el-table-column :label="$t('TKE.colony.gz')">
                                  <template slot-scope="scope">
                                    {{ scope.row.InstanceType }}
                                  </template>
                                </el-table-column>
                                <el-table-column label="CPU">
                                  <template slot-scope="scope">
                                    {{ scope.row.Cpu }}核
                                  </template>
                                </el-table-column>
                                <el-table-column :label="$t('TKE.overview.ncun')">
                                  <template slot-scope="scope">
                                    {{ scope.row.Memory }}GB
                                  </template>
                                </el-table-column>
                                <el-table-column :label="$t('TKE.colony.pzfy')">
                                  <template slot-scope="scope">
                                    <span class="text-orange"
                                      >￥{{ scope.row.Price.UnitPrice }}</span
                                    >元/{{$t('TKE.colony.xs')}}起
                                  </template>
                                </el-table-column>
                              </el-table>
                            </div>
                            <div
                              style="margin-top:16px;"
                              v-if="!tableFilterShow"
                            >
                              <el-table
                                ref="singleTable"
                                :data="colonySecond.tableList1"
                                highlight-current-row
                                @current-change="handleCurrentChange"
                                style="width: 100%"
                                height="500px"
                              >
                                <el-table-column width="50">
                                  <template slot-scope="scope">
                                    <el-radio
                                      v-if="!scope.row.tableDisShow"
                                      v-model="item.radio1"
                                      :label="scope.$index"
                                    >
                                      <i></i>
                                    </el-radio>
                                    <el-tooltip
                                      :content="$t('TKE.colony.bncfxz')"
                                      placement="right"
                                      effect="light"
                                      v-if="scope.row.tableDisShow"
                                    >
                                      <i class="el-icon-info"></i>
                                    </el-tooltip>
                                  </template>
                                </el-table-column>
                                <el-table-column :label="$t('TKE.colony.jxing')">
                                  <template slot-scope="scope">
                                    {{ ModelTypeName(scope.row.TypeName) }}
                                  </template>
                                </el-table-column>
                                <el-table-column :label="$t('TKE.colony.gz')">
                                  <template slot-scope="scope">
                                    {{ scope.row.InstanceType }}
                                  </template>
                                </el-table-column>
                                <el-table-column label="CPU">
                                  <template slot-scope="scope">
                                    {{ scope.row.Cpu }}核
                                  </template>
                                </el-table-column>
                                <el-table-column :label="$t('TKE.overview.ncun')">
                                  <template slot-scope="scope">
                                    {{ scope.row.Memory }}GB
                                  </template>
                                </el-table-column>
                                <el-table-column :label="$t('TKE.colony.pzfy')">
                                  <template slot-scope="scope">
                                    <span class="text-orange"
                                      >￥{{ scope.row.Price.UnitPrice }}</span
                                    >元/{{$t('TKE.colony.xs')}}起
                                  </template>
                                </el-table-column>
                              </el-table>
                            </div>
                          </div>
                          <div class="model-btn">
                            <el-button
                              class="determine"
                              @click="ModelSure(index, 2)"
                              >{{$t('TKE.overview.qd')}}</el-button
                            >
                            <el-button
                              class="cancel"
                              @click="item.modelShow = false"
                              >取消</el-button
                            >
                          </div>
                        </div>
                      </div>
                    </li>
                    <li>
                      <p>{{$t('TKE.colony.xtp')}}</p>
                      <div class="tke-second-worker-text">
                        <span
                          >{{ item.systemDiskValue }}
                          {{ item.systemDiskNumber }}GB</span
                        >
                        <div class="tke-second-worker-icon-pen">
                          <el-popover
                            placement="bottom"
                            width="450"
                            trigger="click"
                            v-model="item.systemDiskShow"
                          >
                            <i class="el-icon-edit" slot="reference"></i>
                            <div class="tke-second-worker-popover-disk">
                              <div>
                                <el-select
                                  v-model="item.systemDiskVal"
                                  :placeholder="$t('TKE.overview.qxz')"
                                >
                                  <el-option
                                    v-for="item in colonySecond.systemDiskOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                  >
                                  </el-option>
                                </el-select>
                                <el-input-number
                                  v-model="colonySecond.systemDiskNum"
                                  :min="50"
                                  :max="500"
                                ></el-input-number>
                                <span>GB</span>
                                <p>{{$t('TKE.colony.fw')}}：50~500，{{$t('TKE.colony.bc')}}：1</p>
                                <div class="btn">
                                  <el-button @click="SystemDiskSure(index, 2)"
                                    >{{$t('TKE.overview.qd')}}</el-button
                                  >
                                  <el-button
                                    @click="item.systemDiskShow = false"
                                    >取消</el-button
                                  >
                                </div>
                              </div>
                            </div>
                          </el-popover>
                        </div>
                      </div>
                    </li>
                    <li>
                      <p>{{$t('TKE.colony.sjp')}}</p>
                      <div class="tke-second-worker-text">
                        <span>{{ item.dataDiskValue }}</span>
                        <div class="tke-second-worker-icon-pen">
                          <el-popover
                            placement="bottom"
                            :width="colonySecond.buyDataWidth"
                            trigger="click"
                            v-model="item.dataDiskShow"
                          >
                            <i class="el-icon-edit" slot="reference"></i>
                            <div
                              class="tke-second-worker-popover-disk tke-second-box"
                            >
                              <div
                                class="tke-second-checkbox"
                                style="padding-left:20px;"
                              >
                                <el-checkbox
                                  v-model="item.buyDataDisk"
                                  @change="BuyDataDisk(index, 2)"
                                  >{{$t('TKE.colony.gmsjp')}}</el-checkbox
                                >
                              </div>
                              <div v-if="item.buyDataDisk">
                                <div class="tke-second-worker-popover-data-bg">
                                  <div>
                                    <div class="box">
                                      <p>{{$t('TKE.colony.ypsz')}}</p>
                                      <div>
                                        <el-select
                                          v-model="item.dataDiskVal"
                                          :placeholder="$t('TKE.overview.qxz')"
                                          @change="DataDiskChange(2, index)"
                                        >
                                          <el-option
                                            v-for="j in colonySecond.dataDiskOptions"
                                            :key="j.value"
                                            :label="j.label"
                                            :value="j.value"
                                          >
                                          </el-option>
                                        </el-select>
                                        <el-input-number
                                          v-model="item.dataDiskNum"
                                          :min="item.dataDiskMinNum"
                                          :max="16000"
                                          :step="10"
                                          class="input-number"
                                        ></el-input-number>
                                        <span>GB</span>
                                        <p
                                          v-if="
                                            item.dataDiskVal === 'CLOUD_PREMIUM'
                                          "
                                        >
                                          {{$t('TKE.colony.fw')}}：10~16000，{{$t('TKE.colony.bc')}}：10
                                        </p>
                                        <p
                                          v-if="
                                            item.dataDiskVal === 'CLOUD_SSD'
                                          "
                                        >
                                          {{$t('TKE.colony.fw')}}：100~16000，{{$t('TKE.colony.bc')}}：10
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div class="btn">
                                <el-button @click="DataDiskSure(index, 2)"
                                  >{{$t('TKE.overview.qd')}}</el-button
                                >
                                <el-button @click="item.dataDiskShow = false"
                                  >取消</el-button
                                >
                              </div>
                            </div>
                          </el-popover>
                        </div>
                      </div>
                    </li>
                    <li>
                      <p>{{$t('TKE.colony.gwdk')}}</p>
                      <div class="tke-second-worker-text">
                        <span
                          >{{ item.broadbandValue }}
                          {{ item.broadbandNumber }}Mbps</span
                        >
                        <div class="tke-second-worker-icon-pen">
                          <el-popover
                            placement="bottom"
                            width="450"
                            trigger="click"
                            v-model="item.broadbandShow"
                          >
                            <i class="el-icon-edit" slot="reference"></i>
                            <div class="tke-second-worker-popover-disk">
                              <div>
                                <el-select
                                  v-model="item.broadbandVal"
                                  :placeholder="$t('TKE.overview.qxz')"
                                >
                                  <el-option
                                    v-for="item in colonySecond.broadbandOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                  >
                                  </el-option>
                                </el-select>
                                <el-input-number
                                  v-model="colonySecond.broadbandNum"
                                  :min="0"
                                  :max="100"
                                ></el-input-number>
                                <span>Mbps</span>
                                <p>{{$t('TKE.colony.dksx')}}：0~100</p>
                                <div
                                  class="tke-second-worker-popover-data-bg distribution"
                                >
                                  <el-checkbox
                                    v-model="colonySecond.pubBroadbandShow"
                                    class="format-and-mount"
                                    >{{$t('TKE.colony.fpmfgw')}}，
                                    <!-- <a href="#"
                                      >查看详情</a
                                    > -->
                                  </el-checkbox
                                  >
                                </div>
                                <div class="btn">
                                  <el-button @click="BroadbandSure(index, 2)"
                                    >{{$t('TKE.overview.qd')}}</el-button
                                  >
                                  <el-button @click="item.broadbandShow = false"
                                    >取消</el-button
                                  >
                                </div>
                              </div>
                            </div>
                          </el-popover>
                        </div>
                      </div>
                    </li>
                    <li>
                      <p>
                        {{$t('TKE.colony.sj')}}<el-tooltip
                          :content="$t('TKE.colony.mzsbs')"
                          placement="right"
                          effect="light"
                          ><i class="el-icon-info ml5"></i
                        ></el-tooltip>
                      </p>
                      <div class="tke-second-worker-data">
                        <el-input-number
                          v-model="item.dataNum"
                          :min="1"
                          :max="1"
                        ></el-input-number>
                        <p v-if="!colonySecond.chargingShow">
                          {{$t('TKE.colony.cvmzdpe')}}
                         {{$t('TKE.colony.tjgnsqpe') }}
                          <!-- <a href="#">提交工单</a> -->
                        </p>
                        <p v-if="colonySecond.chargingShow">
                          {{$t('TKE.colony.cvmpe')}}
                        </p>
                        <el-row>
                          <el-button
                            class="worker-determine-btn"
                            @click="WorkerSure(index, 2)"
                            >{{$t('TKE.overview.qd')}}</el-button
                          >
                          <el-button
                            class="worker-cancel-btn"
                            @click="DeleteWorker(index, 2)"
                            v-if="colonySecond.masterOneList.length > 1"
                            >取消</el-button
                          >

                          <el-tooltip
                            v-else
                            :content="$t('TKE.colony.zsxzygjx')"
                            placement="right"
                            effect="light"
                          >
                            <el-button class="worker-cancel-btn-dis"
                              >取消</el-button
                            >
                          </el-tooltip>
                        </el-row>
                      </div>
                    </li>
                  </ul>
                </div>
                <div class="tke-second-worker-add-models">
                  <el-button @click="MasterAddModel">{{$t('TKE.colony.tjjx')}}</el-button>
                </div>
              </div>
            </div>
            <el-form-item
              :label="$t('TKE.colony.msjpgz')"
              v-if="colonySecond.masterDataDiskMountShow"
              class="tke-second-checkbox"
            >
              <el-checkbox v-model="colonySecond.masterDataDiskMount"
                >{{$t('TKE.colony.zdgsh')}} Master
                {{$t('TKE.colony.jdsjpc')}}</el-checkbox
              >
              <el-input
                v-model="colonySecond.masterDataDiskMountVal"
                :placeholder="$t('TKE.colony.qsrnr')"
                v-if="colonySecond.masterDataDiskMount"
              ></el-input>
            </el-form-item>
            <div
              class="tke-second-worker"
              style="margin-bottom:10px;"
              v-if="colonySecond.source == 2 && colonySecond.master == 2"
            >
              <p class="tke-second-worker-l">Master&Etcd 配置</p>
              <div class="tke-second-worker-r">
                <div class="bg">
                  <div class="flex">
                    <div class="left-box">
                      <div class="search">
                        <el-input
                          :placeholder="$t('TKE.colony.qsrjdmc')"
                          v-model="searchInputMaster"
                          class="input-with-select"
                        >
                          <el-select
                            v-model="selectListMaster"
                            slot="prepend"
                            :placeholder="$t('TKE.overview.qxz')"
                          >
                            <el-option label="完整ID" value="1"></el-option>
                            <el-option :label="$t('TKE.colony.jdmc')" value="2"></el-option>
                          </el-select>
                          <el-button
                            slot="append"
                            icon="el-icon-search"
                            @click="ExistingNodes"
                          ></el-button>
                        </el-input>
                      </div>
                      <div class="right-table">
                        <el-table
                          ref="multipleTableMaster"
                          :data="leftListMaster"
                          tooltip-effect="dark"
                          style="width: 430px"
                          height="250"
                          @selection-change="handleSelectionChangeMaster"
                        >
                          <el-table-column
                            align="center"
                            type="selection"
                            :selectable="selectInitMaster"
                            width="55"
                            :key="Math.random()"
                          >
                          </el-table-column>
                          <el-table-column
                            :label="leftListMasterVal"
                            :key="Math.random()"
                          >
                            <template slot-scope="scope">
                              <div class="table-row">
                                <div>
                                  <p>
                                    {{ scope.row.InstanceId }}
                                  </p>
                                  <p>{{ scope.row.InstanceName }}</p>
                                </div>
                                <el-tooltip
                                  :content="
                                    scope.row.UnusableReason
                                      ? scope.row.UnusableReason
                                      : 'Master&Etcd 节点需配置4核及以上的机型'
                                  "
                                  placement="right"
                                  effect="light"
                                  v-if="
                                    scope.row.Usable === false ||
                                      scope.row.CPU < 4
                                  "
                                >
                                  <i class="el-icon-info ml5"></i>
                                </el-tooltip>
                              </div>
                            </template>
                          </el-table-column>
                        </el-table>
                      </div>
                    </div>
                    <div class="center-box">
                      <i class="el-icon-arrow-left"></i>
                      <i class="el-icon-arrow-right"></i>
                    </div>
                    <div class="right-box">
                      <el-table
                        :data="rightListMaster"
                        tooltip-effect="dark"
                        style="width: 430px;"
                        height="290"
                      >
                        <el-table-column :label="rightListMasterVal">
                          <template slot-scope="scope">
                            <p>
                              {{ scope.row.InstanceId }}
                            </p>

                            <p>{{ scope.row.InstanceName }}</p>
                          </template>
                        </el-table-column>
                        <el-table-column width="55">
                          <template slot-scope="scope">
                            <span
                              class="el-delete"
                              @click="DeleteListMaster(scope.row)"
                              >{{$t('TKE.overview.sc')}}</span
                            >
                          </template>
                        </el-table-column>
                      </el-table>
                    </div>
                  </div>
                </div>
                <div
                  class="tips"
                  v-if="
                    colonySecond.worker == 2 &&
                      colonySecond.source == 2 &&
                      colonySecond.master == 2
                  "
                >
                  <p>{{$t('TKE.colony.zyxz')}}：</p>
                  <p>
                    1、{{$t('TKE.colony.sxxczxt')}}
                  </p>
                  <p>2、{{$t('TKE.colony.sxyfwq')}}</p>
                  <p>
                    3、{{$t('TKE.colony.yfwqxzqy')}}
                  </p>
                </div>
              </div>
            </div>

            <div
              class="tke-second-worker"
              v-if="colonySecond.sourceShow && colonySecond.worker != 2"
            >
              <p class="tke-second-worker-l">Worker 配置</p>
              <div class="tke-second-worker-r">
                <div
                  v-for="(item, index) in colonySecond.workerOneList"
                  :key="index"
                >
                  <div class="tke-second-worker-array" v-if="item.showText">
                    <p>
                      <span @click="EditWorker(index, 1)">{{$t('TKE.overview.bj')}}</span>
                      <span
                        @click="DeleteWorker(index, 1)"
                        v-if="colonySecond.workerOneList.length > 1"
                        >{{$t('TKE.overview.sc')}}</span
                      >
                      <el-tooltip
                        v-else
                        :content="$t('TKE.colony.bksc')"
                        placement="top"
                        effect="light"
                      >
                        <span class="delete-color">{{$t('TKE.overview.sc')}}</span>
                      </el-tooltip>
                    </p>
                    <ol>
                      <li>
                        <span>{{$t('TKE.colony.kyq')}}</span>
                        <span>{{$t('TKE.colony.tbyq')}}</span>
                      </li>
                      <li>
                        <span>{{$t('TKE.colony.jdwl')}}</span>
                        <span>{{ item.workerNodeNetworkValue }}</span>
                      </li>
                      <li>
                        <span>配置</span>
                        <span
                          >{{ item.modelName }}({{ item.modelType }},{{
                            item.modelHe
                          }}核{{ item.modelGB }}GB)</span
                        >
                      </li>
                      <li>
                        <span>{{$t('TKE.colony.xtp')}}</span>
                        <span
                          >{{ item.systemDiskValue }}
                          {{ item.systemDiskNumber }}GB</span
                        >
                      </li>
                      <li>
                        <span>{{$t('TKE.colony.sjp')}}</span>
                        <span>{{ item.dataDiskValue }}</span>
                      </li>
                      <li>
                        <span>{{$t('TKE.colony.gwdk')}}</span>
                        <span
                          >{{ item.broadbandValue }}
                          {{ item.broadbandNumber }}Mbps</span
                        >
                      </li>
                      <li>
                        <span>{{$t('TKE.colony.sliang')}}</span>
                        <span>{{ item.dataNum }} 台</span>
                      </li>
                    </ol>
                  </div>
                  <ul v-if="item.showEdit">
                    <li>
                      <p>
                        {{$t('TKE.colony.kyq')}}<el-tooltip
                          :content="$t('TKE.colony.kyqstydy')"
                          placement="right"
                          effect="light"
                          ><i class="el-icon-info ml5"></i
                        ></el-tooltip>
                      </p>
                      <div>
                        <el-radio-group v-model="colonySecond.usableArea">
                          <el-radio-button label="1">{{$t('TKE.colony.tbyq')}}</el-radio-button>
                        </el-radio-group>
                      </div>
                    </li>
                    <li>
                      <p>
                        {{$t('TKE.colony.jdwl')}}<el-tooltip
                          :content="$t('TKE.colony.xtwjqzjfp')"
                          placement="right"
                          effect="light"
                          ><i class="el-icon-info ml5"></i
                        ></el-tooltip>
                      </p>
                      <div class="tke-second-worker-select">
                        <el-select
                          v-model="colony.networkValue"
                          :placeholder="$t('TKE.overview.qxz')"
                          disabled
                        >
                          <el-option
                            v-for="item in colony.networkOptions"
                            :key="item.VpcId"
                            :label="item.VpcName"
                            :value="item.VpcId"
                          >
                          </el-option>
                        </el-select>
                        <el-select
                          v-model="item.workerNodeNetworkVal"
                          :placeholder="$t('TKE.overview.qxz')"
                          @change="NodeSelect"
                        >
                          <el-option
                            v-for="item in colonySecond.workerNodeNetOpt"
                            :key="item.SubnetId"
                            :label="item.SubnetName"
                            :value="item.SubnetId"
                          >
                          </el-option>
                        </el-select>
                        <span
                          >共{{ item.nodeTotalNum }}{{$t('TKE.colony.gzw')}}{{
                            item.nodeSurplusNum
                          }}{{$t('TKE.overview.ge')}}可用</span
                        >
                        <p>CIDR:{{ colony.CidrBlock }}</p>
                        <!-- <p>
                          {{$t('TKE.colony.wlbhs')}}<a href="#"
                            >{{$t('TKE.colony.xjsywl')}}</a
                          >或<a href="#">{{$t('TKE.colony.xjzw')}}</a>
                        </p> -->
                      </div>
                    </li>
                    <li>
                      <p>{{$t('TKE.colony.jxing')}}</p>
                      <p class="tke-second-worker-text">
                        {{ item.modelName }}({{ item.modelType }},{{
                          item.modelHe
                        }}核{{ item.modelGB }}GB)
                        <i
                          class="el-icon-edit"
                          @click="item.modelShow = true"
                        ></i>
                      </p>
                      <div
                        class="tke-second-worker-model-box"
                        v-if="item.modelShow"
                      >
                        <div class="tke-second-worker-model">
                          <p>
                            <span>{{$t('TKE.colony.xzjx')}}</span
                            ><i
                              class="el-icon-close"
                              @click="item.modelShow = false"
                            ></i>
                          </p>
                          <div class="model-bg">
                            <div>
                              <el-select
                                v-model="colonySecond.AllCPUVal"
                                :placeholder="$t('TKE.overview.qxz')"
                                @change="TableFilter(1)"
                              >
                                <el-option
                                  v-for="item in colonySecond.AllCPU"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value"
                                >
                                </el-option>
                              </el-select>
                              <el-select
                                v-model="colonySecond.AllRAMVal"
                                :placeholder="$t('TKE.overview.qxz')"
                                @change="TableFilter(1)"
                              >
                                <el-option
                                  v-for="item in colonySecond.AllRAM"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value"
                                >
                                </el-option>
                              </el-select>
                            </div>
                            <div style="margin-top:16px;">
                              <el-radio-group
                                v-model="colonySecond.caseRace"
                                @change="
                                  AllModel();
                                  TableFilter(1);
                                "
                              >
                                <el-radio-button label="1"
                                  >{{$t('TKE.colony.qbslz')}}</el-radio-button
                                >
                                <el-radio-button label="Standard"
                                  >{{$t('TKE.colony.bzx')}}</el-radio-button
                                >
                                <el-radio-button label="MEM-optimized"
                                  >{{$t('TKE.colony.ncx')}}</el-radio-button
                                >
                                <el-radio-button label="Compute"
                                  >{{$t('TKE.colony.jsx')}}</el-radio-button
                                >
                              </el-radio-group>
                            </div>
                            <div style="margin-top:16px;">
                              <el-radio-group
                                v-model="colonySecond.caseType"
                                @change="TableFilter(1)"
                              >
                                <el-radio-button label="1"
                                  >{{$t('TKE.colony.qbsllx')}}</el-radio-button
                                >
                                <el-radio-button label="S3" v-if="S3show"
                                  >{{$t('TKE.colony.bzx')}}S3</el-radio-button
                                >
                                <el-radio-button label="C3" v-if="C3show"
                                  >{{$t('TKE.colony.jsx')}}C3</el-radio-button
                                >
                                <el-radio-button label="M3" v-if="M3show"
                                  >{{$t('TKE.colony.ncx')}}M3</el-radio-button
                                >
                              </el-radio-group>
                            </div>
                            <div
                              style="margin-top:16px;"
                              v-if="tableFilterShow"
                            >
                              <el-table
                                ref="singleTable"
                                :data="colonySecond.tableList"
                                highlight-current-row
                                @current-change="handleCurrentChange1"
                                style="width: 100%"
                                height="500px"
                              >
                                <el-table-column width="50">
                                  <template slot-scope="scope">
                                    <el-radio
                                      v-if="!scope.row.tableDisShow"
                                      v-model="item.radio1"
                                      :label="scope.row.index"
                                      @change="
                                        Radio1Change(index, scope.row.index)
                                      "
                                    >
                                      <i></i>
                                    </el-radio>
                                    <el-tooltip
                                      :content="$t('TKE.colony.bncfxz')"
                                      placement="right"
                                      effect="light"
                                      v-if="scope.row.tableDisShow"
                                    >
                                      <i class="el-icon-info"></i>
                                    </el-tooltip>
                                  </template>
                                </el-table-column>
                                <el-table-column :label="$t('TKE.colony.jxing')">
                                  <template slot-scope="scope">
                                    {{ ModelTypeName(scope.row.TypeName) }}
                                  </template>
                                </el-table-column>
                                <el-table-column :label="$t('TKE.colony.gz')">
                                  <template slot-scope="scope">
                                    {{ scope.row.InstanceType }}
                                  </template>
                                </el-table-column>
                                <el-table-column label="CPU">
                                  <template slot-scope="scope">
                                    {{ scope.row.Cpu }}核
                                  </template>
                                </el-table-column>
                                <el-table-column :label="$t('TKE.overview.ncun')">
                                  <template slot-scope="scope">
                                    {{ scope.row.Memory }}GB
                                  </template>
                                </el-table-column>
                                <el-table-column :label="$t('TKE.colony.pzfy')">
                                  <template slot-scope="scope">
                                    <span class="text-orange"
                                      >￥{{ scope.row.Price.UnitPrice }}</span
                                    >元/{{$t('TKE.colony.xs')}}起
                                  </template>
                                </el-table-column>
                              </el-table>
                            </div>
                            <div
                              style="margin-top:16px;"
                              v-if="!tableFilterShow"
                            >
                              <el-table
                                ref="singleTable"
                                :data="colonySecond.tableList1"
                                highlight-current-row
                                @current-change="handleCurrentChange1"
                                style="width: 100%"
                                height="500px"
                              >
                                <el-table-column width="50">
                                  <template slot-scope="scope">
                                    <el-radio
                                      v-if="!scope.row.tableDisShow"
                                      v-model="item.radio1"
                                      :label="scope.row.index"
                                      @change="
                                        Radio1Change(index, scope.row.index)
                                      "
                                    >
                                      <i></i>
                                    </el-radio>
                                    <el-tooltip
                                      :content="$t('TKE.colony.bncfxz')"
                                      placement="right"
                                      effect="light"
                                      v-if="scope.row.tableDisShow"
                                    >
                                      <i class="el-icon-info"></i>
                                    </el-tooltip>
                                  </template>
                                </el-table-column>
                                <el-table-column :label="$t('TKE.colony.jxing')">
                                  <template slot-scope="scope">
                                    {{ ModelTypeName(scope.row.TypeName) }}
                                  </template>
                                </el-table-column>
                                <el-table-column :label="$t('TKE.colony.gz')">
                                  <template slot-scope="scope">
                                    {{ scope.row.InstanceType }}
                                  </template>
                                </el-table-column>
                                <el-table-column label="CPU">
                                  <template slot-scope="scope">
                                    {{ scope.row.Cpu }}核
                                  </template>
                                </el-table-column>
                                <el-table-column :label="$t('TKE.overview.ncun')">
                                  <template slot-scope="scope">
                                    {{ scope.row.Memory }}GB
                                  </template>
                                </el-table-column>
                                <el-table-column :label="$t('TKE.colony.pzfy')">
                                  <template slot-scope="scope">
                                    <span class="text-orange"
                                      >￥{{ scope.row.Price.UnitPrice }}</span
                                    >元/{{$t('TKE.colony.xs')}}起
                                  </template>
                                </el-table-column>
                              </el-table>
                            </div>
                          </div>
                          <div class="model-btn">
                            <el-button
                              class="determine"
                              @click="ModelSure(index, 1)"
                              >{{$t('TKE.overview.qd')}}</el-button
                            >
                            <el-button
                              class="cancel"
                              @click="item.modelShow = false"
                              >取消</el-button
                            >
                          </div>
                        </div>
                      </div>
                    </li>
                    <li>
                      <p>{{$t('TKE.colony.xtp')}}</p>
                      <div class="tke-second-worker-text">
                        <span
                          >{{ item.systemDiskValue }}
                          {{ item.systemDiskNumber }}GB</span
                        >
                        <div class="tke-second-worker-icon-pen">
                          <el-popover
                            placement="bottom"
                            width="450"
                            trigger="click"
                            v-model="item.systemDiskShow"
                          >
                            <i class="el-icon-edit" slot="reference"></i>
                            <div class="tke-second-worker-popover-disk">
                              <div>
                                <el-select
                                  v-model="item.systemDiskVal"
                                  :placeholder="$t('TKE.overview.qxz')"
                                >
                                  <el-option
                                    v-for="item in colonySecond.systemDiskOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                  >
                                  </el-option>
                                </el-select>
                                <el-input-number
                                  v-model="colonySecond.systemDiskNum"
                                  :min="50"
                                  :max="500"
                                ></el-input-number>
                                <span>GB</span>
                                <p>{{$t('TKE.colony.fw')}}：50~500，{{$t('TKE.colony.bc')}}：1</p>
                                <div class="btn">
                                  <el-button @click="SystemDiskSure(index, 1)"
                                    >{{$t('TKE.overview.qd')}}</el-button
                                  >
                                  <el-button
                                    @click="item.systemDiskShow = false"
                                    >取消</el-button
                                  >
                                </div>
                              </div>
                            </div>
                          </el-popover>
                        </div>
                      </div>
                    </li>
                    <li>
                      <p>{{$t('TKE.colony.sjp')}}</p>
                      <div class="tke-second-worker-text">
                        <span>{{ item.dataDiskValue }}</span>
                        <div class="tke-second-worker-icon-pen">
                          <el-popover
                            placement="bottom"
                            :width="colonySecond.buyDataWidth"
                            trigger="click"
                            v-model="item.dataDiskShow"
                          >
                            <i class="el-icon-edit" slot="reference"></i>
                            <div
                              class="tke-second-worker-popover-disk tke-second-box"
                            >
                              <div
                                class="tke-second-checkbox"
                                style="padding-left:20px;"
                              >
                                <el-checkbox
                                  v-model="item.buyDataDisk"
                                  @change="BuyDataDisk(index, 1)"
                                  >{{$t('TKE.colony.gmsjp')}}</el-checkbox
                                >
                              </div>
                              <div v-if="item.buyDataDisk">
                                <div
                                  class="tke-second-worker-popover-data-bg"
                                  v-for="(x, i) in item.buyDataDiskArr"
                                  :key="i"
                                >
                                  <div>
                                    <div class="box">
                                      <p>{{$t('TKE.colony.ypsz')}}</p>
                                      <div>
                                        <el-select
                                          v-model="x.dataDiskVal"
                                          :placeholder="$t('TKE.overview.qxz')"
                                          @change="DataDiskChange(1, index, i)"
                                        >
                                          <el-option
                                            v-for="item in colonySecond.dataDiskOptions"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value"
                                          >
                                          </el-option>
                                        </el-select>
                                        <el-input-number
                                          v-model="x.dataDiskNum"
                                          :min="x.dataDiskMinNum"
                                          :max="16000"
                                          :step="10"
                                          class="input-number"
                                        ></el-input-number>
                                        <span>GB</span>
                                        <p
                                          v-if="
                                            x.dataDiskVal === 'CLOUD_PREMIUM'
                                          "
                                        >
                                          {{$t('TKE.colony.fw')}}：10~16000，{{$t('TKE.colony.bc')}}：10
                                        </p>
                                        <p v-if="x.dataDiskVal === 'CLOUD_SSD'">
                                          {{$t('TKE.colony.fw')}}：100~16000，{{$t('TKE.colony.bc')}}：10
                                        </p>
                                      </div>
                                      <p
                                        style="margin-top:16px;"
                                        v-if="x.formatMount"
                                      >
                                        {{$t('TKE.colony.gshsz')}}
                                      </p>
                                      <div
                                        style="margin-top:16px;"
                                        v-if="x.formatMount"
                                      >
                                        <el-select
                                          v-model="x.latticeSetVal"
                                          :placeholder="$t('TKE.overview.qxz')"
                                        >
                                          <el-option
                                            v-for="x in colonySecond.latticeSetOpt"
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
                                    @click="deleteDataDisk(index, i)"
                                  ></i>
                                </div>
                              </div>
                              <div
                                class="add-data-disk"
                                v-if="
                                  item.buyDataDisk &&
                                    item.buyDataDiskArr.length != 0
                                "
                                @click="AddDataDisk(index)"
                              >
                                {{$t('TKE.colony.tjsjp')}}
                              </div>
                              <div class="btn">
                                <el-button @click="DataDiskSure(index, 1)"
                                  >{{$t('TKE.overview.qd')}}</el-button
                                >
                                <el-button @click="item.dataDiskShow = false"
                                  >取消</el-button
                                >
                              </div>
                            </div>
                          </el-popover>
                        </div>
                      </div>
                    </li>
                    <li>
                      <p>{{$t('TKE.colony.gwdk')}}</p>
                      <div class="tke-second-worker-text">
                        <span
                          >{{ item.broadbandValue }}
                          {{ item.broadbandNumber }}Mbps</span
                        >
                        <div class="tke-second-worker-icon-pen">
                          <el-popover
                            placement="bottom"
                            width="450"
                            trigger="click"
                            v-model="item.broadbandShow"
                          >
                            <i class="el-icon-edit" slot="reference"></i>
                            <div class="tke-second-worker-popover-disk">
                              <div>
                                <el-select
                                  v-model="item.broadbandVal"
                                  :placeholder="$t('TKE.overview.qxz')"
                                >
                                  <el-option
                                    v-for="item in colonySecond.broadbandOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                  >
                                  </el-option>
                                </el-select>
                                <el-input-number
                                  v-model="colonySecond.broadbandNum"
                                  :min="0"
                                  :max="100"
                                ></el-input-number>
                                <span>Mbps</span>
                                <p>{{$t('TKE.colony.dksx')}}：0~100</p>
                                <div
                                  class="tke-second-worker-popover-data-bg distribution"
                                >
                                  <el-checkbox
                                    v-model="colonySecond.pubBroadbandShow"
                                    class="format-and-mount"
                                    >{{$t('TKE.colony.fpmfgw')}}，
                                    <!-- <a href="#"
                                      >查看详情</a
                                    > -->
                                  </el-checkbox
                                  >
                                </div>
                                <div class="btn">
                                  <el-button @click="BroadbandSure(index, 1)"
                                    >{{$t('TKE.overview.qd')}}</el-button
                                  >
                                  <el-button @click="item.broadbandShow = false"
                                    >取消</el-button
                                  >
                                </div>
                              </div>
                            </div>
                          </el-popover>
                        </div>
                      </div>
                    </li>
                    <li>
                      <p>{{$t('TKE.colony.sj')}}</p>
                      <div class="tke-second-worker-data">
                        <el-input-number
                          v-model="item.dataNum"
                          :min="1"
                          :max="1"
                        ></el-input-number>
                        <p v-if="!colonySecond.chargingShow">
                          {{$t('TKE.colony.cvmzdpe')}}
                          {{$t('TKE.colony.tjgnsqpe')}}
                          <!-- <a href="#">提交工单</a> -->
                        </p>
                        <p v-if="colonySecond.chargingShow">
                          {{$t('TKE.colony.cvmpe')}}
                        </p>
                        <el-row>
                          <el-button
                            class="worker-determine-btn"
                            @click="WorkerSure(index, 1)"
                            >{{$t('TKE.overview.qd')}}</el-button
                          >
                          <el-button
                            class="worker-cancel-btn"
                            @click="DeleteWorker(index, 1)"
                            v-if="colonySecond.workerOneList.length > 1"
                            >取消</el-button
                          >

                          <el-tooltip
                            v-else
                            :content="$t('TKE.colony.zsxzygjx')"
                            placement="right"
                            effect="light"
                          >
                            <el-button class="worker-cancel-btn-dis"
                              >取消</el-button
                            >
                          </el-tooltip>
                        </el-row>
                      </div>
                    </li>
                  </ul>
                </div>
                <div class="tke-second-worker-add-models">
                  <el-button @click="OneAddModel">{{$t('TKE.colony.tjjx')}}</el-button>
                </div>
              </div>
            </div>
            <div class="tke-second-worker" v-if="colonySecond.workerDeployShow">
              <p class="tke-second-worker-l">Worker 配置</p>
              <div class="tke-second-worker-r">
                <div class="bg">
                  <div class="flex">
                    <div class="left-box">
                      <div class="search">
                        <el-input
                          :placeholder="$t('TKE.colony.qsrjdmc')"
                          v-model="searchInput"
                          class="input-with-select"
                        >
                          <el-select
                            v-model="selectList"
                            slot="prepend"
                            :placeholder="$t('TKE.overview.qxz')"
                          >
                            <el-option label="完整ID" value="1"></el-option>
                            <el-option :label="$t('TKE.colony.jdmc')" value="2"></el-option>
                          </el-select>
                          <el-button
                            slot="append"
                            icon="el-icon-search"
                            @click="DataList"
                          ></el-button>
                        </el-input>
                      </div>

                      <div class="right-table">
                        <el-table
                          ref="multipleTable"
                          :data="leftList"
                          tooltip-effect="dark"
                          style="width: 430px"
                          height="250"
                          @selection-change="handleSelectionChange"
                          class="pg-table-box"
                        >
                          <el-table-column
                            align="center"
                            type="selection"
                            :selectable="selectInit"
                            width="55"
                            :key="Math.random()"
                          >
                          </el-table-column>
                          <el-table-column
                            :label="leftListVal"
                            :key="Math.random()"
                          >
                            <template slot-scope="scope">
                              <div class="table-row">
                                <div>
                                  <p>
                                    {{ scope.row.InstanceId }}
                                  </p>
                                  <p>{{ scope.row.InstanceName }}</p>
                                </div>
                                <el-tooltip
                                  :content="scope.row.UnusableReason"
                                  placement="right"
                                  effect="light"
                                  v-if="!scope.row.Usable"
                                >
                                  <i class="el-icon-info ml5"></i>
                                </el-tooltip>
                              </div>
                            </template>
                          </el-table-column>
                        </el-table>
                      </div>
                    </div>
                    <div class="center-box">
                      <i class="el-icon-arrow-left"></i>
                      <i class="el-icon-arrow-right"></i>
                    </div>
                    <div class="right-box">
                      <el-table
                        :data="rightList"
                        tooltip-effect="dark"
                        style="width: 430px;"
                        height="290"
                      >
                        <el-table-column :label="rightListVal">
                          <template slot-scope="scope">
                            <p>
                              {{ scope.row.InstanceId }}
                            </p>

                            <p>{{ scope.row.InstanceName }}</p>
                          </template>
                        </el-table-column>
                        <el-table-column width="55">
                          <template slot-scope="scope">
                            <span
                              class="el-delete"
                              @click="DeleteList(scope.row)"
                            >
                              {{$t('TKE.overview.sc')}}</span
                            >
                          </template>
                        </el-table-column>
                      </el-table>
                    </div>
                  </div>
                </div>
                <div class="tips">
                  <p>{{$t('TKE.colony.zyxz')}}：</p>
                  <p>
                    1、{{$t('TKE.colony.sxxczxt')}}
                  </p>
                  <p>2、{{$t('TKE.colony.sxyfwq')}}</p>
                  <p>
                    3、{{$t('TKE.colony.yfwqxzqy')}}
                  </p>
                </div>
              </div>
            </div>
            <el-form-item :label="$t('TKE.colony.zjfy')" v-if="colonySecond.sourceShow">
              <div class="tke-second-cost-query" v-if="colonySecond.costShow">
                {{$t('TKE.colony.cxz')}}...
              </div>
              <div class="tke-second-cost" v-if="!colonySecond.costShow">
                <span class="tke-second-cost-num">{{
                  colonySecond.allocationCost
                }}</span
                ><span class="tke-second-cost-h">元/{{$t('TKE.colony.xs')}}</span
                ><span class="tke-second-cost-t">({{$t('TKE.colony.pzfy')}})</span>
                <i>|</i>
                <span class="tke-second-cost-num">{{
                  colonySecond.networkCost
                }}</span
                ><span class="tke-second-cost-h">元/{{$t('TKE.colony.xs')}}</span
                ><span class="tke-second-cost-w"> ({{$t('TKE.colony.wlfyong')}})</span>
              </div>
            </el-form-item>
          </div>
        </el-form>
        <!-- 底部 -->
        <div class="tke-formpanel-footer">
          <el-button size="small" @click="secondPrev">上一步</el-button>
          <p v-if="!colonySecond.completeBtn">
            <el-button
              size="small"
              type="primary"
              @click="secondNext"
              v-if="colonySecond.secondNextShow"
              >下一步</el-button
            >
            <el-button size="small" disabled v-if="!colonySecond.secondNextShow"
              >下一步</el-button
            >
          </p>
          <span class="footer-tips" v-if="colonySecond.workerTips">
            {{$t('TKE.colony.qxzwjd')}}
          </span>
          <span class="footer-tips" v-if="colonySecond.masterTips">
            Master {{$t('TKE.colony.jdzsxz')}}
          </span>
          <el-button
            size="small"
            type="primary"
            v-if="colonySecond.completeBtn"
            @click="SecondCreateFinish"
          >
            完成
          </el-button>
        </div>
      </div>
      <!-- 第三步 云服务器配置 -->
      <div
        v-if="thirdBox"
        class="tke-second-box tke-third-box tke-card tke-formpanel-wrap mb60"
      >
        <div class="tke-second-title">{{$t('TKE.colony.yxpz')}}</div>
        <el-form
          ref="form"
          :model="colonyThird"
          label-width="120px"
          label-position="left"
        >
          <el-form-item :label="$t('TKE.colony.jqm')">
            <p>{{ dispose.name }}</p>
          </el-form-item>
          <el-form-item label="Kubernetes版本">
            <p>{{ dispose.kuValue }}</p>
          </el-form-item>
          <el-form-item label="所在地域">
            <p>{{ dispose.cityRadio }}</p>
          </el-form-item>
          <el-form-item :label="$t('TKE.colony.rqwl')">
            <p>{{ dispose.container }}</p>
          </el-form-item>
          <el-form-item :label="$t('TKE.colony.jfms')">
            <p>{{ colonySecond.charging == 1 ? "按量計費" : "包年包月" }}</p>
          </el-form-item>
          <div class="tke-second-tips">
            <p>
              {{$t('TKE.colony.czxt')}}<el-tooltip
                :content="$t('TKE.colony.xghsyxxt')"
                placement="right"
                effect="light"
                ><i class="el-icon-info ml5"></i
              ></el-tooltip>
            </p>
            <p>
              {{ dispose.OSvalue }}
            </p>
          </div>
          <el-form-item :label="$t('TKE.colony.sjpgz')" v-if="colonySecond.workerDeployShow">
            <el-checkbox v-model="colonyThird.dataDiskChecked"
              >{{$t('TKE.colony.zdgshsjp')}}</el-checkbox
            >
            <el-input
              v-model="colonyThird.dataDiskInput"
              :placeholder="$t('TKE.colony.qsrnr')"
              v-if="colonyThird.dataDiskChecked"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('TKE.colony.rqml')">
            <el-checkbox v-model="colonyThird.containerChecked"
              >{{$t('TKE.colony.jyccdsjp')}}</el-checkbox
            >
            <el-input
              v-model="colonyThird.containerInput"
              :placeholder="$t('TKE.colony.qsrnr')"
              v-if="colonyThird.containerChecked"
            ></el-input>
          </el-form-item>
          <div class="tke-third-tips">
            <p>
              {{$t('TKE.colony.aqz')}}<el-tooltip
                :content="$t('TKE.colony.aqzyfhqgn')"
                placement="right"
                effect="light"
                ><i class="el-icon-info ml5"></i
              ></el-tooltip>
            </p>
            <div class="input-box">
              <p v-if="colonyThird.defaultSafeBox">
                <el-input :value="$t('TKE.colony.xjbdaqz')" disabled></el-input>
                <i
                  class="el-icon-error"
                  v-if="colonyThird.defaultSafe"
                  @click="colonyThird.defaultSafeBox = false"
                ></i>
              </p>
              <div v-if="colonyThird.safeArr.length > 0">
                <div v-for="(item, index) in colonyThird.safeArr" :key="index">
                  <div>
                    <el-select
                      :placeholder="$t('TKE.colony.qxzaqz')"
                      v-model="item.securityGroupSel"
                    >
                      <el-option
                        v-for="x in securityGroupOpt"
                        :key="x.value"
                        :label="x.label"
                        :value="x.value"
                      >
                      </el-option>
                    </el-select>
                    <i class="el-icon-refresh ml5"></i>
                    <i
                      class="el-icon-error ml5"
                      @click="deleteExceptPrice(index)"
                    ></i>
                  </div>
                </div>
              </div>
              <p v-if="colonyThird.safeArr.length === 0">
                {{$t('TKE.colony.xggz')}}
                <!-- <a href="#">预览默认安全组规则</a> -->
              </p>

              <p>
                <span v-if="colonyThird.safeArr.length === 0"
                  >{{$t('TKE.colony.ywxyzdy')}}</span
                ><a href="javascript:;" @click="AddSafe">{{$t('TKE.colony.tjaqz')}}</a>
              </p>
            </div>
          </div>
          <el-form-item :label="$t('TKE.colony.dlfs')">
            <div class="tke-second-radio-btn tke-third-radio-btn">
              <el-radio-group
                v-model="colonyThird.loginModeRadio"
                @change="LoginMode"
              >
                <el-tooltip
                  :content="$t('TKE.colony.sshmyscgmy')"
                  placement="top"
                  effect="light"
                >
                  <el-radio-button label="1">{{$t('TKE.colony.ljglmy')}}</el-radio-button>
                </el-tooltip>
                <el-radio-button label="2">{{$t('TKE.colony.zdscmm')}}</el-radio-button>
                <el-radio-button label="3">{{$t('TKE.colony.szmm')}}</el-radio-button>
              </el-radio-group>
              <p v-if="colonyThird.two">
                {{$t('TKE.colony.czmm')}}
              </p>
            </div>
          </el-form-item>
          <el-form-item
            :label="$t('TKE.overview.yhm')"
            v-if="colonyThird.one || colonyThird.three"
          >
            <p>ubuntu</p>
          </el-form-item>
          <el-form-item :label="$t('TKE.colony.sshmy')" v-if="colonyThird.one">
            <div class="tke-third-select">
              <el-select :placeholder="$t('TKE.overview.qxz')" v-model="colonyThird.sshKeySel">
                <el-option
                  v-for="item in colonyThird.sshKey"
                  :key="item.KeyId"
                  :label="item.KeyName"
                  :value="item.KeyId"
                >
                </el-option>
              </el-select>
              <i class="el-icon-refresh ml5"></i>
              <p>{{$t('TKE.colony.mybhs')}}<a href="../sshkey">{{$t('TKE.colony.xzcj')}}</a></p>
            </div>
          </el-form-item>
          <el-form-item :label="$t('TKE.overview.mm')" v-if="colonyThird.three" class="password">
            <el-input
              :placeholder="$t('TKE.colony.qsrzjmm')"
              :class="{ 'cluster-wran': colonyThird.passwordWran }"
              v-model="colonyThird.password"
              @blur="PasswordInput(colonyThird.password)"
              show-password
            ></el-input>
            <el-tooltip
              effect="light"
              :content="colonyThird.passwordTips"
              placement="right"
              v-if="colonyThird.passwordWran"
              ><i class="el-icon-warning-outline ml5"></i>
            </el-tooltip>
            <p>
              linux機器密碼需8到16位，至少包括兩項（[a-z,A-Z] ,
              [0-9]和[()`~!@#$%^&}*-+=|{}[]:;',.?/]的特殊符號）
            </p>
          </el-form-item>
          <!-- <el-form-item
            label="确认密码"
            v-if="colonyThird.three"
            class="password"
          >
            <el-input
              placeholder="请输入主机密码"
              v-model="colonyThird.confirmPassword"
              show-password
            ></el-input>
          </el-form-item> -->
          <el-form-item label="安全加固">
            <div class="tke-third-checkbox" style="padding-bottom:10px;">
              <el-checkbox v-model="colonyThird.safetyChecked"
                >{{$t('TKE.colony.mfkt')}}</el-checkbox
              >
              <p>
                {{$t('TKE.colony.azzjmfkt')}}
                <!-- <a href="#">详细介绍</a> -->
              </p>
            </div>
          </el-form-item>
          <el-form-item :label="$t('TKE.colony.yjk')">
            <div class="tke-third-checkbox">
              <el-checkbox v-model="colonyThird.cloudwatchChecked"
                >{{$t('TKE.colony.mfkt')}}</el-checkbox
              >
              <p class="checkbox-tips" v-if="!colonyThird.cloudwatchChecked">
                {{$t('TKE.colony.qxgx')}}
              </p>
              <p>
                {{$t('TKE.colony.mfktzj')}}
                <!-- <a href="#">详细介绍</a> -->
              </p>
            </div>
          </el-form-item>
        </el-form>
        <!-- 底部 -->
        <div class="tke-formpanel-footer">
          <el-button size="small" @click="thirdPrev">上一步</el-button>
          <el-button size="small" type="primary" @click="thirdNext"
            >下一步</el-button
          >
        </div>
      </div>
      <!-- 第四步 信息确认 -->
      <div
        v-if="fourthBox"
        class="tke-second-box tke-fourth-box tke-card tke-formpanel-wrap mb60"
      >
        <div class="tke-second-title">{{$t('TKE.colony.yxpz')}}</div>
        <el-form ref="form" label-width="120px" label-position="left">
          <el-form-item :label="$t('TKE.colony.jqm')">
            <p>{{ dispose.name }}</p>
          </el-form-item>
          <el-form-item label="Kubernetes版本">
            <p>{{ dispose.kuValue }}</p>
          </el-form-item>
          <el-form-item :label="$t('TKE.colony.jqlx')">
            <p>{{ colonySecond.master == 1 ? "託管集群" : "獨立集群" }}</p>
          </el-form-item>
          <el-form-item label="所在地域">
            <p>{{ dispose.cityRadio }}</p>
          </el-form-item>
          <el-form-item :label="$t('TKE.colony.rqwl')">
            <p>
              {{ dispose.container }}，{{
                colony.ServiceValue
              }}{{$t('TKE.overview.ge')}}Service/集群，{{ colony.PodValue }}{{$t('TKE.colony.gjd')}}
            </p>
          </el-form-item>
          <el-form-item :label="$t('TKE.colony.jfms')">
            <p>{{ colonySecond.charging == 1 ? "按量計費" : "包年包月" }}</p>
          </el-form-item>
          <el-form-item :label="$t('TKE.colony.czxt')">
            {{ dispose.OSvalue }}
          </el-form-item>
          <el-form-item
            :label="$t('TKE.colony.mejd')"
            v-if="colonySecond.source == 2 && colonySecond.master == 2"
            class="tke-fourth-node-text"
          >
            <p v-for="(item, index) in rightListMaster" :key="index">
              {{ item.InstanceId }}<span v-if="rightListMaster.length > 1">,</span>
            </p>
          </el-form-item>
          <el-form-item
            :label="$t('TKE.colony.nodejd')"
            v-if="!colonySecond.sourceShow"
            class="tke-fourth-node-text"
          >
            <p v-for="(item, index) in rightList" :key="index">
             {{ item.InstanceId }}<span v-if="rightList.length > 1">,</span>
            </p>
          </el-form-item>
          <el-form-item
            :label="$t('TKE.colony.mejd')"
            class="tke-fourth-node"
            style="padding:0px;border:0px;"
            v-if="colonySecond.workerShow === true && colonySecond.source == 1"
          >
            <div
              v-for="(item, index) in colonySecond.masterOneList"
              :key="index"
            >
              <p>{{$t('TKE.colony.kyq')}}:{{$t('TKE.colony.tbyq')}}</p>
              <p>
                {{$t('TKE.colony.jxing')}}:{{ item.modelName }}({{ item.modelType }},{{
                  item.modelHe
                }}核{{ item.modelGB }}GB)
              </p>
              <p>
                {{$t('TKE.colony.xtp')}}:{{ item.systemDiskValue }} {{ item.systemDiskNumber }}GB
              </p>
              <p>{{$t('TKE.colony.sjp')}}:{{ item.dataDiskValue }}</p>
              <p>
                {{$t('TKE.colony.gwdk')}}:{{ item.broadbandValue }}
                {{ item.broadbandNumber }}Mbps
              </p>
              <p>{{$t('TKE.colony.sliang')}}:{{ item.dataNum }}</p>
            </div>
          </el-form-item>
          <el-form-item
            :label="$t('TKE.colony.nodejd')"
            class="tke-fourth-node"
            v-if="colonySecond.sourceShow && colonySecond.worker != 2"
          >
            <div
              v-for="(item, index) in colonySecond.workerOneList"
              :key="index"
            >
              <p>{{$t('TKE.colony.kyq')}}:{{$t('TKE.colony.tbyq')}}</p>
              <p>
                {{$t('TKE.colony.jxing')}}:{{ item.modelName }}({{ item.modelType }},{{
                  item.modelHe
                }}核{{ item.modelGB }}GB)
              </p>
              <p>
                {{$t('TKE.colony.xtp')}}:{{ item.systemDiskValue }} {{ item.systemDiskNumber }}GB
              </p>
              <p>{{$t('TKE.colony.sjp')}}:{{ item.dataDiskValue }}</p>
              <p>
                {{$t('TKE.colony.gwdk')}}:{{ item.broadbandValue }}
                {{ item.broadbandNumber }}Mbps
              </p>
              <p>{{$t('TKE.colony.sliang')}}:{{ item.dataNum }}</p>
            </div>
          </el-form-item>
          <el-form-item
            :label="$t('TKE.colony.zjfy')"
            v-if="colonySecond.sourceShow && colonySecond.worker != 2"
          >
            <div class="tke-second-cost">
              <span class="tke-second-cost-num">{{
                colonySecond.allocationCost
              }}</span
              ><span class="tke-second-cost-h">元/{{$t('TKE.colony.xs')}}</span
              ><span class="tke-second-cost-t">({{$t('TKE.colony.pzfy')}})</span>
              <i>|</i>
              <span class="tke-second-cost-num">{{
                colonySecond.networkCost
              }}</span
              ><span class="tke-second-cost-h">元/{{$t('TKE.colony.xs')}}</span
              ><span class="tke-second-cost-w"> ({{$t('TKE.colony.wlfyong')}})</span>
            </div>
          </el-form-item>
        </el-form>
        <!-- 底部 -->
        <div class="tke-formpanel-footer">
          <el-button size="small" @click="fourthPrev">上一步</el-button>
          <el-button size="small" type="primary" @click="CreateFinish"
            >完成</el-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import HeadCom from '@/components/public/Head'
// import SEARCH from '@/components/public/SEARCH'
import FileSaver from "file-saver";
import XLSX from "xlsx";
import { ErrorTips } from "@/components/ErrorTips";
import {
  ALL_CITY,
  ALL_PROJECT,
  TKE_NEW_EDITION,
  TKE_VPC_METWORK,
  TKE_OPERAT_SYSTEM,
  TKE_VPC_CIDR,
  // 第二步
  TKE_EXIST_NODES,
  TKE_WORKER_METWORK,
  TKE_EXIST,
  DESCRIBE_ZONE_INFO,
  TKE_PRICE,
  // 第三步
  TKE_MISG,
  TKE_SSH,
  // 第四步
  TKE_CREATW_CLUSTERS
} from "@/constants";
export default {
  name: "create",
  data() {
    return {
      // 步骤显示
      firstBox: true,
      secondBox: false,
      thirdBox: false,
      fourthBox: false,
      // 第一步
      colony: {
        name: "",
        nameWran: false,
        projectOptions: [
          {
            projectId: "0",
            projectName: "預設專案"
          }
        ],
        projectValue: "0",
        kuOptions: [],
        kuValue: "",
        assemblyRadio: "docker",
        assemblyDis: false,
        cityRadio: "tb",
        networkOptions: [],
        CidrBlock: "",
        CIDRTips: "",
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
        CIDRValue_1: "172",
        CIDRValue_2: "16",
        CIDRValue_3: "0",
        CIDRValue_4: "0",
        CIDRValueDis_2: false,
        CIDRValueDis_3: true,
        CIDRValueDis_4: true,
        CIDRValueContent_2: "範圍：16, 18, ... , 31",
        CIDRValueContent_3: "",
        CIDRTipsDis_2: false,
        CIDRTipsDis_3: true,
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
        // Pod数量上限/节点
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
        PodValue: "64",
        // Service数量上限/集群
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
          },
          {
            value: "2048",
            label: "2048"
          },
          {
            value: "4096",
            label: "4096"
          },
          {
            value: "8192",
            label: "8192"
          },
          {
            value: "16384",
            label: "16384"
          },
          {
            value: "32768",
            label: "32786"
          }
        ],
        ServiceValue: "1024",
        // 集群描述
        desc: "",
        // 操作系统
        OSoptions: [],
        OSvalue: "",
        ipvs: false
      },
      // 第二步
      colonySecond: {
        // 节点来源
        source: 1,
        sourceShow: true,
        master: 1,
        workerShow: false,
        workerDeployShow: false,
        worker: 1,
        boxShow: true,
        masterOneList: [
          {
            showText: false,
            showEdit: true,
            radio1: 0,
            modelShow: false,
            modelName: "",
            InstanceChargeType: "POSTPAID_BY_HOUR",
            modelType: "",
            modelHe: "",
            modelGB: "",
            systemDiskShow: false,
            dataDiskShow: false,
            broadbandShow: false,
            workerNodeNetworkValue: "",
            systemDiskVal: "CLOUD_PREMIUM",
            systemDiskValue: "高性能雲硬碟",
            systemDiskNumber: "50",
            // 数据盘
            dataDiskValue: "暫不購買",
            buyDataDisk: false,
            dataDiskArr: [],
            buyDataDiskArr: [],
            dataDiskVal: "CLOUD_PREMIUM",
            dataDiskNum: "10",
            dataDiskNumber: "10",
            dataDiskMinNum: 10,
            latticeSetVal: "ext3",
            setValue: "/var/lib/docker",
            broadbandValue: "按寬頻計費",
            broadbandVal: "BANDWIDTH_POSTPAID_BY_HOUR",
            broadbandNumber: "1",
            formatMount: true,
            dataNum: "1"
          }
        ],
        workerOneList: [
          {
            showText: false,
            showEdit: true,
            radio1: null,
            radioIndex: null,
            modelShow: false,
            modelName: "",
            modelType: "",
            modelHe: "",
            modelGB: "",
            systemDiskShow: false,
            dataDiskShow: false,
            broadbandShow: false,
            workerNodeNetworkValue: "",
            InstanceChargeType: "POSTPAID_BY_HOUR",
            systemDiskVal: "CLOUD_PREMIUM",
            systemDiskValue: "高性能雲硬碟",
            systemDiskNumber: "50",
            // 数据盘
            dataDiskValue: "暫不購買",
            dataDiskArr: [],
            buyDataDiskArr: [],
            buyDataDisk: false,
            dataDiskVal: "CLOUD_PREMIUM",
            dataDiskNumber: "10",
            dataDiskNum1: "100",
            latticeSetVal: "ext3",
            setValue: "/var/lib/docker",
            broadbandValue: "按寬頻計費",
            broadbandVal: "BANDWIDTH_POSTPAID_BY_HOUR",
            broadbandNumber: "1",
            formatMount: true,
            dataNum: "1"
          }
        ],
        masterDataDiskMountShow: false,
        masterDataDiskMount: false,
        masterDataDiskMountVal: "/var/lib/docker",
        index: 0,
        masterIndex: 0,
        buyTime: 1, // 购买时长
        renew: false, // 自动续费
        charging: 1,
        chargingShow: false,
        usableArea: 1,
        networkValue: "",
        // 节点网络
        workerNodeNetOpt: [],
        nodeTotalNum: "",
        nodeSurplusNum: "",
        // 机型
        tableList: [],
        tableList1: [],
        masterTableList: [],
        modelText: "",
        modelText2: "",
        modelShow: false,
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
        AllCPUVal: "0",
        AllRAM: [
          {
            value: "0",
            label: "全部記憶體"
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
        AllRAMVal: "0",
        caseRace: "1",
        caseType: "1",
        // 系统盘
        systemDiskNum: 50,
        systemDiskOptions: [
          {
            value: "CLOUD_PREMIUM",
            label: "高性能雲硬碟"
          },
          {
            value: "CLOUD_SSD",
            label: "SSD雲硬碟"
          }
        ],
        systemDiskNumber: "50",
        buyDataWidth: 300,
        buyDataDiskArr: [],
        dataDiskOptions: [
          {
            value: "CLOUD_PREMIUM",
            label: "高性能雲硬碟"
          },
          {
            value: "CLOUD_SSD",
            label: "SSD雲硬碟"
          }
        ],
        latticeSetOpt: [
          { value: "ext3", label: "ext3" },
          { value: "ext4", label: "ext4" },
          { value: "xfs", label: "xfs" }
        ],
        dataDiskNumber: "10",
        // 公网宽带
        broadbandWidth: 300,
        broadbandNum: 0,
        pubBroadbandShow: true,
        broadbandOptions: [
          {
            value: "BANDWIDTH_POSTPAID_BY_HOUR",
            label: "按寬頻計費"
          },
          {
            value: "TRAFFIC_POSTPAID_BY_HOUR",
            label: "按使用流量"
          }
        ],
        // 总计费用
        costShow: true,
        // 配置费用
        allocationCost: "",
        // 网络费用
        networkCost: "",
        // 下一步
        secondNextShow: true,
        workerTips: false,
        masterTips: false,
        completeBtn: false
      },
      // worker 配置
      searchInput: "",
      basicNews: "",
      selectList: "",
      VpcId: "",
      leftList: [],
      rightList: [],
      leftListVal: "共 0 雲伺服器",
      rightListVal: "已選擇 0 台",
      // Master
      searchInputMaster: "",
      basicNewsMaster: "",
      selectListMaster: "",
      VpcIdMaster: "",
      leftListMaster: [],
      rightListMaster: [],
      leftListMasterVal: "共 0 雲伺服器",
      rightListMasterVal: "已選擇 0 台",

      // 第三步
      colonyThird: {
        // 容器目录
        containerChecked: false,
        containerInput: "/var/lib/docker",
        // 数据盘挂载
        dataDiskChecked: false,
        dataDiskInput: "/var/lib/docker",
        // 安全组
        safeArr: [],
        defaultSafe: false,
        defaultSafeBox: true,
        // 登录方式
        loginModeRadio: 1,
        one: true,
        two: false,
        three: false,
        // 密码
        password: "",
        passwordWran: false,
        passwordTips: "密碼不能為空",
        // 确认密码
        confirmPassword: "",
        // SSH密钥
        sshKey: [],
        sshKeySel: "",
        // 安全加固
        safetyChecked: true,
        // 云监控
        cloudwatchChecked: true
      },
      securityGroupOpt: [],
      securityGroupSel: "",
      radio1: 0,
      checked: true,
      input: "",
      costAll: [],
      costAll2: [],
      // 已选配置
      dispose: {
        name: "",
        kuValue: "",
        cityRadio: "台灣台北",
        container: "",
        OSvalue: ""
      },
      param: [],
      params: [],
      tableFilterShow: true,
      S3show: true,
      C3show: true,
      M3show: true
    };
  },
  components: {
    // HeadCom,
    // SEARCH
  },
  created() {},
  mounted() {
    // --------------------------------  第一步 -----------------------------
    // 新增资源所属项目
    this.NewProject();
    // Kubernetes版本
    this.KubernetesEditionData();
    // 集群网络
    this.ClusterNetworkData();
    // 操作系统
    this.OperatSystemData();
    //  --------------------------------  第三步 -----------------------------
    // 安全组
    this.SecurityGroup();
    // SSH密钥
    this.SSHKey();
  },
  methods: {
    // 返回上一层
    goBack() {
      this.$router.go(-1);
    },
    // --------------------------------  第一步 -----------------------------
    // 第一步 集群名称输入框
    ClusterNameBlur() {
      if (this.colony.name === "") {
        this.colony.nameWran = true;
      } else {
        this.colony.nameWran = false;
      }
    },
    ClusterNameFocus() {
      if (this.colony.nameWran === true) {
        this.colony.nameWran = false;
      }
    },
    // 新增资源所属项目
    NewProject() {
      this.axios.get(ALL_PROJECT).then(res => {
        if (res.codeDesc === "Success") {
          var arr = res.data;
          for (var i in arr) {
            this.colony.projectOptions.push(arr[i]);
          }
        } else {
          let ErrTips = {
            InternalError: "内部錯誤",
            UnauthorizedOperation: "未授權操作"
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
    // Kubernetes版本
    KubernetesEditionData() {
      const param = {
        Version: "2018-05-25"
      };
      this.axios.post(TKE_NEW_EDITION, param).then(res => {
        if (res.Response.Error === undefined) {
          this.colony.kuOptions = res.Response.VersionInstanceSet;
          this.colony.kuValue =
            res.Response.VersionInstanceSet[
              this.colony.kuOptions.length - 1
            ].Version;
        } else {
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
    KubernetesChange(val) {
      let _valOne = Number(val.split(".")[0]);
      let _valTwo = Number(val.split(".")[1]);
      if (_valOne > 0 && _valTwo > 11) {
        this.colony.assemblyDis = false;
      } else {
        this.colony.assemblyDis = true;
      }
    },
    // 集群网络
    ClusterNetworkData() {
      const param = {
        Region: "ap-taipei",
        Version: "2017-03-12"
      };
      this.axios.post(TKE_VPC_METWORK, param).then(res => {
        if (res.Response.Error === undefined) {
          this.colony.networkOptions = res.Response.VpcSet;
          this.colony.networkValue = res.Response.VpcSet[0].VpcId;
          this.colony.CidrBlock = res.Response.VpcSet[0].CidrBlock;
          this.NetWork();
        } else {
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
    NetworkRefresh() {
      // this.ClusterNetworkData()
    },
    NetWork(val) {
      if (val) {
        let array = this.colony.networkOptions;
        for (var i in array) {
          if (val === array[i].VpcId) {
            this.colony.CidrBlock = array[i].CidrBlock;
          }
        }
      }
      var _cidr =
        this.colony.CIDRValue_1 +
        "." +
        this.colony.CIDRValue_2 +
        "." +
        this.colony.CIDRValue_3 +
        "." +
        this.colony.CIDRValue_4 +
        "/" +
        this.colony.CIDRValue_5;
      const param = {
        ClusterCIDR: _cidr,
        Version: "2018-05-25",
        VpcId: this.colony.networkValue
      };
      this.axios.post(TKE_VPC_CIDR, param).then(res => {
        if (res.Response.Error === undefined) {
          this.colony.CIDRTips = res.Response;
        }
      });
      this.DataList();
      this.ExistingNodes();
    },
    // 容器网络 CID
    CIDchange_1(val) {
      if (val === "192") {
        this.colony.CIDRValue_2 = "168";
        this.colony.CIDRValueDis_2 = true;
        this.colony.CIDRTipsDis_2 = true;
        this.colony.CIDRValueDis_3 = true;
        this.colony.CIDRTipsDis_3 = true;
        this.colony.CIDROptions_5 = [];
        this.colony.CIDROptions_5.push(
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
        );
        this.colony.CIDRValue_5 = "16";
      } else if (val === "172") {
        this.colony.CIDRValue_2 = "16";
        this.colony.CIDRValueDis_2 = false;
        this.colony.CIDRTipsDis_2 = false;
        this.colony.CIDRValueContent_2 = "範圍：16, 18, ... , 31";
        this.colony.CIDRValue_3 = "0";
        this.colony.CIDRValueDis_3 = true;
        this.colony.CIDRTipsDis_3 = true;
        this.colony.CIDRValue_5 = "16";
        this.colony.CIDROptions_5 = [];
        this.colony.CIDROptions_5.push(
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
        );
        this.colony.CIDRValue_5 = "16";
      } else if (val === "10") {
        this.colony.CIDRValueDis_2 = false;
        this.colony.CIDRValue_2 = "0";
        this.colony.CIDRValue_3 = "0";
        this.colony.CIDRValueDis_3 = true;
        this.colony.CIDRTipsDis_3 = true;
        this.colony.CIDRValue_5 = "14";
        this.colony.CIDRValueContent_2 = "範圍：0, 4, ... , 252";
        this.colony.CIDROptions_5 = [];
        this.colony.CIDROptions_5.push(
          {
            value: "14",
            label: "14"
          },
          {
            value: "15",
            label: "15"
          },
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
        );
        this.colony.CIDRValue_5 = "14";
      }
      this.NetWork();
    },
    CIDR2(val) {
      if (
        this.colony.CIDRValue_1 == "172" &&
        Number(this.colony.CIDRValue_5) >= 16
      ) {
        if (Number(~~val) < 18) {
          this.colony.CIDRValue_2 = 16;
        }
        if (Number(~~val) > 31) {
          this.colony.CIDRValue_2 = 31;
        }
      }
      if (this.colony.CIDRValue_1 == "10") {
        if (this.colony.CIDRValue_5 == "14") {
          if (Number(~~val) < 3) {
            this.colony.CIDRValue_2 = 0;
          } else if (Number(~~val) > 251) {
            this.colony.CIDRValue_2 = 252;
          } else {
            if (Number(~~val) % 4 == 0) {
              this.colony.CIDRValue_2 = ~~val;
            } else {
              let num = Math.floor(Number(~~val) / 4);
              this.colony.CIDRValue_2 = 4 * num;
            }
          }
        }
        if (this.colony.CIDRValue_5 == "15") {
          if (Number(~~val) < 2) {
            this.colony.CIDRValue_2 = 0;
          } else if (Number(~~val) > 253) {
            this.colony.CIDRValue_2 = 254;
          } else {
            if (Number(~~val) % 2 == 0) {
              this.colony.CIDRValue_2 = ~~val;
            } else {
              let num = Math.floor(Number(~~val) / 2);
              this.colony.CIDRValue_2 = 2 * num;
            }
          }
        }
        if (Number(this.colony.CIDRValue_5) >= 16) {
          if (Number(~~val) > 254) {
            this.colony.CIDRValue_2 = 255;
          } else {
            this.colony.CIDRValue_2 = ~~val;
          }
        }
      }
    },
    CIDR3(val) {
      if (this.colony.CIDRValue_5 == 17) {
        if (Number(~~val) < 65) {
          this.colony.CIDRValue_3 = 0;
        } else {
          this.colony.CIDRValue_3 = 128;
        }
      }
      if (this.colony.CIDRValue_5 == 18) {
        if (Number(~~val) < 33) {
          this.colony.CIDRValue_3 = 0;
        } else if (Number(~~val) < 97) {
          this.colony.CIDRValue_3 = 64;
        } else if (Number(~~val) < 161) {
          this.colony.CIDRValue_3 = 128;
        } else {
          this.colony.CIDRValue_3 = 192;
        }
      }
      if (this.colony.CIDRValue_5 == 19) {
        if (Number(~~val) < 17) {
          this.colony.CIDRValue_3 = 0;
        } else if (Number(~~val) < 49) {
          this.colony.CIDRValue_3 = 32;
        } else if (Number(~~val) < 81) {
          this.colony.CIDRValue_3 = 64;
        } else if (Number(~~val) < 113) {
          this.colony.CIDRValue_3 = 96;
        } else if (Number(~~val) < 145) {
          this.colony.CIDRValue_3 = 128;
        } else if (Number(~~val) < 177) {
          this.colony.CIDRValue_3 = 160;
        } else if (Number(~~val) < 209) {
          this.colony.CIDRValue_3 = 192;
        } else {
          this.colony.CIDRValue_3 = 224;
        }
      }
    },
    CIDchange_5(val) {
      if (val == 17) {
        this.colony.CIDRValueContent_3 = "範圍：0, 128";
      } else if (val == 18) {
        this.colony.CIDRValueContent_3 = "範圍：0, 64, 128, 192";
      } else {
        this.colony.CIDRValueContent_3 = "範圍：0, 32, ... , 224";
      }
      if (this.colony.CIDRValue_1 == "192") {
        this.colony.CIDRValueDis_3 = false;
        this.colony.CIDRTipsDis_3 = false;
      }
      if (this.colony.CIDRValue_1 == "172") {
        this.colony.CIDRValueDis_3 = false;
        this.colony.CIDRTipsDis_3 = false;
      }
      if (this.colony.CIDRValue_1 == "10") {
        if (val == "14") {
          this.colony.CIDRValue_2 = 0;
          this.colony.CIDRValueContent_2 = "範圍：0, 4, ... , 252";
        } else if (val == 15) {
          this.colony.CIDRValue_2 = 0;
          this.colony.CIDRValueContent_2 = "範圍：0, 2, ... , 254";
        } else if (Number(val) >= 16) {
          this.colony.CIDRValue_2 = 0;
          this.colony.CIDRValueContent_2 = "範圍：0, 1, ... , 255";
        }
        if (Number(val) > 16) {
          this.colony.CIDRValue_3 = "0";
          this.colony.CIDRValueDis_3 = false;
          this.colony.CIDRTipsDis_3 = false;
        } else {
          this.colony.CIDRValue_3 = "0";
          this.colony.CIDRValueDis_3 = true;
          this.colony.CIDRTipsDis_3 = true;
        }
      }
      this.NetWork();
    },
    // 操作系统
    OperatSystemData() {
      const param = {
        Version: "2018-05-25"
      };
      this.axios.post(TKE_OPERAT_SYSTEM, param).then(res => {
        if (res.Response.Error === undefined) {
          this.colony.OSoptions = res.Response.ImageInstanceSet;
          this.colony.OSvalue = this.colony.OSoptions[0].ImageId;
        } else {
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
    // 第一步 下一步
    firstNext() {
      if (this.colony.name !== "" && this.colony.CIDRTips.IsConflict !== true) {
        this.firstBox = false;
        this.secondBox = true;
        this.thirdBox = false;
        this.fourthBox = false;
        this.dispose.name = this.colony.name;
        for (var i in this.colony.kuOptions) {
          if (this.colony.kuOptions[i].Version === this.colony.kuValue) {
            this.dispose.kuValue = this.colony.kuOptions[i].Version;
          }
        }
        var CIDRValue_1 = "";
        var CIDRValue_5 = "";
        for (var i in this.colony.CIDROptions_1) {
          if (this.colony.CIDROptions_1[i].value === this.colony.CIDRValue_1) {
            CIDRValue_1 = this.colony.CIDROptions_1[i].label;
          }
        }
        for (var i in this.colony.CIDROptions_5) {
          if (this.colony.CIDROptions_5[i].value === this.colony.CIDRValue_5) {
            CIDRValue_5 = this.colony.CIDROptions_5[i].label;
          }
        }
        this.dispose.container =
          CIDRValue_1 +
          "." +
          this.colony.CIDRValue_2 +
          "." +
          this.colony.CIDRValue_3 +
          "." +
          this.colony.CIDRValue_4 +
          "/" +
          CIDRValue_5;

        if (this.rightList.length != 0) {
          this.$nextTick(() => {
            this.rightList.forEach(row => {
              this.$refs.multipleTable.toggleRowSelection(row, true);
            });
          });
        }
        for (let i in this.colony.OSoptions) {
          if (this.colony.OSvalue === this.colony.OSoptions[i].ImageId) {
            this.dispose.OSvalue = this.colony.OSoptions[i].Alias;
          }
        }
        this.ChildNodes();
        // 机型 选择机型
        this.getDescribeZoneInstanceConfigInfos();
      }
      if (this.colony.name === "") {
        this.colony.nameWran = true;
      }
    },
    // -------------------------------------- 第二步 ---------------------------------
    AllModel() {
      this.colonySecond.caseType = 1;
      if (this.colonySecond.caseRace == 1) {
        this.C3show = true;
        this.S3show = true;
        this.M3show = true;
      } else if (this.colonySecond.caseRace == "Standard") {
        this.C3show = false;
        this.S3show = true;
        this.M3show = false;
      } else if (this.colonySecond.caseRace == "Compute") {
        this.C3show = true;
        this.S3show = false;
        this.M3show = false;
      } else if (this.colonySecond.caseRace == "MEM-optimized") {
        this.C3show = false;
        this.S3show = false;
        this.M3show = true;
      }
    },
    // 过滤机型table
    TableFilter(a) {
      let _tableListArr = [];
      if (a == 1) {
        _tableListArr = this.colonySecond.tableList;
      } else {
        _tableListArr = this.colonySecond.masterTableList;
      }
      let _array = [];
      this.colonySecond.tableList1 = [];
      for (let i in _tableListArr) {
        if (
          this.colonySecond.AllCPUVal == _tableListArr[i].Cpu &&
          this.colonySecond.AllRAMVal == 0 &&
          this.colonySecond.caseRace == 1 &&
          this.colonySecond.caseType == 1
        ) {
          _array.push(_tableListArr[i]);
        }
        if (
          this.colonySecond.AllCPUVal == _tableListArr[i].Cpu &&
          this.colonySecond.AllRAMVal == 0 &&
          this.colonySecond.caseRace == 1 &&
          this.colonySecond.caseType == _tableListArr[i].InstanceFamily
        ) {
          _array.push(_tableListArr[i]);
        }
        if (
          this.colonySecond.AllCPUVal == _tableListArr[i].Cpu &&
          this.colonySecond.AllRAMVal == 0 &&
          this.colonySecond.caseRace ==
            _tableListArr[i].TypeName.split(" ")[0] &&
          this.colonySecond.caseType == 1
        ) {
          _array.push(_tableListArr[i]);
        }
        if (
          this.colonySecond.AllCPUVal == _tableListArr[i].Cpu &&
          this.colonySecond.AllRAMVal == 0 &&
          this.colonySecond.caseRace ==
            _tableListArr[i].TypeName.split(" ")[0] &&
          this.colonySecond.caseType == _tableListArr[i].InstanceFamily
        ) {
          _array.push(_tableListArr[i]);
        }

        if (
          this.colonySecond.AllCPUVal == _tableListArr[i].Cpu &&
          this.colonySecond.AllRAMVal == _tableListArr[i].Memory &&
          this.colonySecond.caseRace == 1 &&
          this.colonySecond.caseType == 1
        ) {
          _array.push(_tableListArr[i]);
        }
        if (
          this.colonySecond.AllCPUVal == _tableListArr[i].Cpu &&
          this.colonySecond.AllRAMVal == _tableListArr[i].Memory &&
          this.colonySecond.caseRace == 1 &&
          this.colonySecond.caseType == _tableListArr[i].InstanceFamily
        ) {
          _array.push(_tableListArr[i]);
        }
        if (
          this.colonySecond.AllCPUVal == _tableListArr[i].Cpu &&
          this.colonySecond.AllRAMVal == _tableListArr[i].Memory &&
          this.colonySecond.caseRace ==
            _tableListArr[i].TypeName.split(" ")[0] &&
          this.colonySecond.caseType == 1
        ) {
          _array.push(_tableListArr[i]);
        }
        if (
          this.colonySecond.AllCPUVal == _tableListArr[i].Cpu &&
          this.colonySecond.AllRAMVal == _tableListArr[i].Memory &&
          this.colonySecond.caseRace ==
            _tableListArr[i].TypeName.split(" ")[0] &&
          this.colonySecond.caseType == _tableListArr[i].InstanceFamily
        ) {
          _array.push(_tableListArr[i]);
        }

        if (
          this.colonySecond.AllCPUVal == 0 &&
          this.colonySecond.AllRAMVal == _tableListArr[i].Memory &&
          this.colonySecond.caseRace == 1 &&
          this.colonySecond.caseType == 1
        ) {
          _array.push(_tableListArr[i]);
        }
        if (
          this.colonySecond.AllCPUVal == 0 &&
          this.colonySecond.AllRAMVal == _tableListArr[i].Memory &&
          this.colonySecond.caseRace == 1 &&
          this.colonySecond.caseType == _tableListArr[i].InstanceFamily
        ) {
          _array.push(_tableListArr[i]);
        }
        if (
          this.colonySecond.AllCPUVal == 0 &&
          this.colonySecond.AllRAMVal == _tableListArr[i].Memory &&
          this.colonySecond.caseRace ==
            _tableListArr[i].TypeName.split(" ")[0] &&
          this.colonySecond.caseType == 1
        ) {
          _array.push(_tableListArr[i]);
        }
        if (
          this.colonySecond.AllCPUVal == 0 &&
          this.colonySecond.AllRAMVal == _tableListArr[i].Memory &&
          this.colonySecond.caseRace ==
            _tableListArr[i].TypeName.split(" ")[0] &&
          this.colonySecond.caseType == _tableListArr[i].InstanceFamily
        ) {
          _array.push(_tableListArr[i]);
        }

        if (
          this.colonySecond.AllCPUVal == 0 &&
          this.colonySecond.AllRAMVal == 0 &&
          this.colonySecond.caseRace == 1 &&
          this.colonySecond.caseType == _tableListArr[i].InstanceFamily
        ) {
          _array.push(_tableListArr[i]);
        }
        if (
          this.colonySecond.AllCPUVal == 0 &&
          this.colonySecond.AllRAMVal == 0 &&
          this.colonySecond.caseRace ==
            _tableListArr[i].TypeName.split(" ")[0] &&
          this.colonySecond.caseType == 1
        ) {
          _array.push(_tableListArr[i]);
        }
        if (
          this.colonySecond.AllCPUVal == 0 &&
          this.colonySecond.AllRAMVal == 0 &&
          this.colonySecond.caseRace ==
            _tableListArr[i].TypeName.split(" ")[0] &&
          this.colonySecond.caseType == _tableListArr[i].InstanceFamily
        ) {
          _array.push(_tableListArr[i]);
        }
      }

      this.tableFilterShow = false;
      if (
        this.colonySecond.AllCPUVal == 0 &&
        this.colonySecond.AllRAMVal == 0 &&
        this.colonySecond.caseRace == 1 &&
        this.colonySecond.caseType == 1
      ) {
        this.tableFilterShow = true;
      }
      this.colonySecond.tableList1 = _array;
    },
    // 节点来源
    NodeSource(val) {
      // colonySecond.source
      this.rightList = [];
      if (val == "2") {
        this.colonySecond.workerTips = true;
        this.colonySecond.masterTips = false;
        this.colonySecond.sourceShow = false;
        this.colonySecond.secondNextShow = false;
        this.colonySecond.workerDeployShow = true;
        if (this.colonySecond.worker == 2) {
          this.colonySecond.workerDeployShow = false;
        }
      } else {
        this.colonySecond.workerDeployShow = false;
        this.colonySecond.worker = 1;
        this.colonySecond.workerTips = false;
        this.colonySecond.masterTips = false;
        this.colonySecond.secondNextShow = true;
        this.colonySecond.sourceShow = true;
      }
      if (
        this.colonySecond.worker == 2 &&
        this.colonySecond.source == 2 &&
        this.colonySecond.master == 1
      ) {
        this.colonySecond.boxShow = false;
        this.colonySecond.completeBtn = true;
      } else {
        this.colonySecond.boxShow = true;
        this.colonySecond.completeBtn = false;
      }
    },
    // 节点来源 已有节点 worker 配置
    //
    IfStatus() {
      if (this.colonySecond.source == 2 && this.colonySecond.master == 1) {
        if (this.rightList.length != 0) {
          this.colonySecond.workerTips = false;
          this.colonySecond.masterTips = false;
          this.colonySecond.secondNextShow = true;
        } else {
          this.colonySecond.workerTips = true;
          this.colonySecond.masterTips = false;
          this.colonySecond.secondNextShow = false;
        }
      }
      if (this.colonySecond.source == 2 && this.colonySecond.master == 2) {
        if (this.rightList.length != 0) {
          this.colonySecond.workerTips = false;
          this.colonySecond.masterTips = false;
          this.colonySecond.secondNextShow = true;
        } else {
          this.colonySecond.workerTips = true;
          this.colonySecond.masterTips = false;
          this.colonySecond.secondNextShow = false;
        }
        if (this.rightListMaster.length > 2) {
          this.colonySecond.workerTips = false;
          this.colonySecond.masterTips = false;
          this.colonySecond.secondNextShow = true;
        } else {
          this.colonySecond.workerTips = false;
          this.colonySecond.masterTips = true;
          this.colonySecond.secondNextShow = false;
        }
      }
    },
    // 复选框操作
    selectInit(row, index) {
      if (row.Usable === false) {
        return false; // 不可勾选
      } else {
        return true; // 可勾选
      }
    },
    // left 列表
    handleSelectionChange(val) {
      this.rightList = val;
      this.rightListVal = "已選擇 " + this.rightList.length + " 台";
      this.IfStatus();
    },
    // right 列表删除
    DeleteList(row) {
      this.$refs.multipleTable.toggleRowSelection(row);
      for (var i in this.rightList) {
        if (row.InstanceId === this.rightList[i].InstanceId) {
          this.rightList.splice(this.rightList[i], 1);
        }
      }
      this.IfStatus();
    },
    // 复选框操作
    selectInitMaster(row, index) {
      if (row.Usable === false || row.CPU < 4) {
        return false; // 不可勾选
      } else {
        return true; // 可勾选
      }
    },
    // left 列表
    handleSelectionChangeMaster(val) {
      this.rightListMaster = val;
      this.rightListMasterVal = "已選擇 " + this.rightListMaster.length + " 台";
      this.IfStatus();
    },
    // right 列表删除
    DeleteListMaster(row) {
      this.$refs.multipleTableMaster.toggleRowSelection(row);
      for (var i in this.rightListMaster) {
        if (row.InstanceId === this.rightListMaster[i].InstanceId) {
          this.rightListMaster.splice(this.rightListMaster[i], 1);
        }
      }
      this.IfStatus();
    },
    DataList() {
      let params = {
        Version: "2018-05-25"
      };
      if (
        (this.selectList == "" && this.searchInput == "") ||
        (this.selectList != "" && this.searchInput == "")
      ) {
        params["ClusterId"] = "";
        params["Filters.0.Name"] = "vpc-id";
        params["Filters.0.Values.0"] = this.colony.networkValue;
      }

      if (this.selectList == 1 && this.searchInput != "") {
        params["InstanceIds.0"] = this.searchInput;
      }
      if (
        (this.selectList == "" && this.searchInput != "") ||
        (this.selectList == 2 && this.searchInput != "")
      ) {
        params["VagueInstanceName"] = this.searchInput;
        params["ClusterId"] = "";
        params["Filters.0.Name"] = "vpc-id";
        params["Filters.0.Values.0"] = this.colony.networkValue;
      }
      this.axios.post(TKE_EXIST, params).then(res => {
        if (res.Response.Error === undefined) {
          this.leftList = res.Response.ExistedInstanceSet;
          // console.log(res.Response.ExistedInstanceSet);
          this.leftListVal = " 共 " + this.leftList.length + " 雲伺服器";
        } else {
          this.leftList = [];
          let ErrTips = {
            FailedOperation: "操作失敗",
            InternalError: "内部錯誤",
            "InternalError.AccountUserNotAuthenticate": "帳戶未通過認證。",
            "InternalError.CreateMasterFailed": "創建集群失敗。",
            "InternalError.CvmCommon": "cvm創建節點報錯。",
            "InternalError.CvmNotFound": "cvm不存在。",
            "InternalError.Db": "db錯誤。",
            "InternalError.DbAffectivedRows": "DB錯誤",
            "InternalError.DbRecordNotFound": "記錄未找到。",
            "InternalError.ImageIdNotFound": "映像未找到。",
            "InternalError.InitMasterFailed": "初始化master失敗。",
            "InternalError.InvalidPrivateNetworkCidr": "無效CIDR。",
            "InternalError.OsNotSupport": "映像OS不支持。",
            "InternalError.Param": "Param。",
            "InternalError.UnexceptedInternal	": "内部錯誤",
            "InternalError.VpcCommon": "VPC報錯。",
            "InternalError.VpcRecodrNotFound": "未發現vpc記錄。",
            InvalidParameter: "參數錯誤",
            LimitExceeded: "超過配額限制",
            MissingParameter: "缺少參數錯誤",
            ResourceInUse: "資源被佔用",
            ResourceNotFound: "資源不存在",
            ResourceUnavailable: "資源不可用",
            UnauthorizedOperation: "未授權操作",
            UnknownParameter: "未知參數錯誤",
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
    ExistingNodes() {
      let params = {
        Version: "2018-05-25"
      };
      if (
        (this.selectListMaster == "" && this.searchInputMaster == "") ||
        (this.selectListMaster != "" && this.searchInputMaster == "")
      ) {
        params["ClusterId"] = "";
        params["Filters.0.Name"] = "vpc-id";
        params["Filters.0.Values.0"] = this.colony.networkValue;
      }

      if (this.selectListMaster == 1 && this.searchInputMaster != "") {
        params["InstanceIds.0"] = this.searchInputMaster;
      }
      if (
        (this.selectListMaster == "" && this.searchInputMaster != "") ||
        (this.selectListMaster == 2 && this.searchInputMaster != "")
      ) {
        params["VagueInstanceName"] = this.searchInputMaster;
        params["ClusterId"] = "";
        params["Filters.0.Name"] = "vpc-id";
        params["Filters.0.Values.0"] = this.colony.networkValue;
      }
      this.axios.post(TKE_EXIST, params).then(res => {
        if (res.Response.Error === undefined) {
          this.leftListMaster = res.Response.ExistedInstanceSet;
          // console.log(res.Response.ExistedInstanceSet);
          this.leftListMasterVal =
            " 共 " + this.leftListMaster.length + " 雲伺服器";
        } else {
          this.leftListMaster = [];
          let ErrTips = {
            FailedOperation: "操作失敗",
            InternalError: "内部錯誤",
            "InternalError.AccountUserNotAuthenticate": "帳戶未通過認證。",
            "InternalError.CreateMasterFailed": "創建集群失敗。",
            "InternalError.CvmCommon": "cvm創建節點報錯。",
            "InternalError.CvmNotFound": "cvm不存在。",
            "InternalError.Db": "db錯誤。",
            "InternalError.DbAffectivedRows": "DB錯誤",
            "InternalError.DbRecordNotFound": "記錄未找到。",
            "InternalError.ImageIdNotFound": "映像未找到。",
            "InternalError.InitMasterFailed": "初始化master失敗。",
            "InternalError.InvalidPrivateNetworkCidr": "無效CIDR。",
            "InternalError.OsNotSupport": "映像OS不支持。",
            "InternalError.Param": "Param。",
            "InternalError.UnexceptedInternal	": "内部錯誤",
            "InternalError.VpcCommon": "VPC報錯。",
            "InternalError.VpcRecodrNotFound": "未發現vpc記錄。",
            InvalidParameter: "參數錯誤",
            LimitExceeded: "超過配額限制",
            MissingParameter: "缺少參數錯誤",
            ResourceInUse: "資源被佔用",
            ResourceNotFound: "資源不存在",
            ResourceUnavailable: "資源不可用",
            UnauthorizedOperation: "未授權操作",
            UnknownParameter: "未知參數錯誤",
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
    // 子网络
    ChildNodes() {
      const param = {
        // Region: "ap-taipei",
        Version: "2017-03-12",
        "Filters.0.Name": "vpc-id",
        "Filters.0.Values.0": this.colony.networkValue
      };
      this.axios.post(TKE_WORKER_METWORK, param).then(res => {
        if (res.Response.Error === undefined) {
          this.colonySecond.workerNodeNetOpt = res.Response.SubnetSet;
          // console.log(res.Response.SubnetSet)
          for (var i in this.colonySecond.workerOneList) {
            this.colonySecond.workerOneList[
              i
            ].workerNodeNetworkVal = this.colonySecond.workerNodeNetOpt[0].SubnetId;
            this.colonySecond.workerOneList[
              i
            ].workerNodeNetworkValue = this.colonySecond.workerNodeNetOpt[0].SubnetName;
            this.colonySecond.workerOneList[
              i
            ].nodeTotalNum = this.colonySecond.workerNodeNetOpt[0].TotalIpAddressCount;
            this.colonySecond.workerOneList[
              i
            ].nodeSurplusNum = this.colonySecond.workerNodeNetOpt[0].AvailableIpAddressCount;
          }
          for (var i in this.colonySecond.masterOneList) {
            this.colonySecond.masterOneList[
              i
            ].workerNodeNetworkVal = this.colonySecond.workerNodeNetOpt[0].SubnetId;
            this.colonySecond.masterOneList[
              i
            ].workerNodeNetworkValue = this.colonySecond.workerNodeNetOpt[0].SubnetName;
            this.colonySecond.masterOneList[
              i
            ].nodeTotalNum = this.colonySecond.workerNodeNetOpt[0].TotalIpAddressCount;
            this.colonySecond.masterOneList[
              i
            ].nodeSurplusNum = this.colonySecond.workerNodeNetOpt[0].AvailableIpAddressCount;
          }
        } else {
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
    //
    NodeSelect(val) {
      let arr = this.colonySecond.workerNodeNetOpt;
      for (let i = 0; i < arr.length; i++) {
        if (val === arr[i].SubnetId) {
          this.colonySecond.nodeTotalNum = arr[i].TotalIpAddressCount;
          this.colonySecond.nodeSurplusNum = arr[i].AvailableIpAddressCount;
        }
      }
    },
    // Master 节点
    SecondMaster(val) {
      // console.log(val)
      this.rightList = [];
      this.rightListMaster = [];
      this.colonySecond.workerTips = false;
      this.colonySecond.completeBtn = false;
      this.colonySecond.secondNextShow = false;
      if (val == "2") {
        this.colonySecond.workerShow = true;
        this.colonySecond.masterTips = true;
      } else {
        this.colonySecond.workerShow = false;
        this.colonySecond.workerTips = false;
        this.colonySecond.completeBtn = false;
        this.colonySecond.masterTips = false;
        this.colonySecond.secondNextShow = true;
        if (this.colonySecond.source == 2) {
          this.colonySecond.secondNextShow = false;
          this.colonySecond.workerTips = true;
        }
      }
      if (
        this.colonySecond.worker == 2 &&
        this.colonySecond.source == 2 &&
        this.colonySecond.master == 1
      ) {
        this.colonySecond.boxShow = false;
        this.colonySecond.completeBtn = true;
        this.colonySecond.workerTips = false;
        this.colonySecond.masterTips = false;
        this.colonySecond.secondNextShow = false;
      } else {
        this.colonySecond.boxShow = true;
        this.colonySecond.completeBtn = false;
      }
      this.TotalCost();
    },
    WorkerNodeChange(val) {
      if (val == 2) {
        if (this.colonySecond.source == 2 && this.colonySecond.master == 2) {
          this.colonySecond.workerDeployShow = false;
        } else {
          this.colonySecond.workerDeployShow = true;
        }
      } else {
        if (this.colonySecond.source == 2 && this.colonySecond.master == 2) {
          this.colonySecond.workerDeployShow = true;
        } else {
          this.colonySecond.workerDeployShow = false;
        }
      }
    },
    // 计费模式
    SecondCharging(val) {
      // console.log(val);
      if (val === "2") {
        this.colonySecond.chargingShow = true;
      } else {
        this.colonySecond.chargingShow = false;
      }
      this.TotalCost();
    },
    // 购买时长
    BuyTime(val) {
      this.TotalCost();
    },
    // 机型  选择机型
    //获取可用区机型配置信息
    getDescribeZoneInstanceConfigInfos() {
      let param = {
        Version: "2017-03-12"
      };
      param["Filters.0.Name"] = "instance-charge-type";
      param["Filters.0.Values.0"] = "POSTPAID_BY_HOUR";
      this.axios.post(DESCRIBE_ZONE_INFO, param).then(res => {
        if (res.Response.Error === undefined) {
          this.colonySecond.tableList = res.Response.InstanceTypeQuotaSet;

          for (let i in this.colonySecond.tableList) {
            this.colonySecond.tableList[i]["tableDisShow"] = false;
            this.colonySecond.tableList[i]["index"] = Number(i);
          }
          // console.log(this.colonySecond.tableList);
          for (var i in this.colonySecond.workerOneList) {
            this.colonySecond.workerOneList[
              i
            ].modelName = this.colonySecond.tableList[i].InstanceType;
            this.colonySecond.workerOneList[
              i
            ].radio1 = this.colonySecond.tableList[i].index;

            this.colonySecond.workerOneList[i].modelType = this.ModelTypeName(
              this.colonySecond.tableList[i].TypeName
            );
            this.colonySecond.workerOneList[
              i
            ].modelHe = this.colonySecond.tableList[i].Cpu;
            this.colonySecond.workerOneList[
              i
            ].modelGB = this.colonySecond.tableList[i].Memory;
          }
          for (let x in this.colonySecond.tableList) {
            if (this.colonySecond.tableList[x].Cpu >= 4) {
              this.colonySecond.masterTableList.push(
                this.colonySecond.tableList[x]
              );
            }
          }
          for (var i in this.colonySecond.masterOneList) {
            this.colonySecond.masterOneList[
              i
            ].modelName = this.colonySecond.masterTableList[i].InstanceType;
            this.colonySecond.masterOneList[i].modelType = this.ModelTypeName(
              this.colonySecond.masterTableList[i].TypeName
            );
            this.colonySecond.masterOneList[
              i
            ].modelHe = this.colonySecond.masterTableList[i].Cpu;
            this.colonySecond.masterOneList[
              i
            ].modelGB = this.colonySecond.masterTableList[i].Memory;
          }

          // 总计费用
          this.TotalCost();
        } else {
          let ErrTips = {
            "InvalidInstanceType.Malformed": "指定InstanceType參數格式不合法",
            "InvalidRegion.NotFound": "未找到該區域",
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
    // 机型
    ModelTypeName(val) {
      if (val === "Standard S3") {
        return "標準型S3";
      } else if (val === "Compute C3") {
        return "計算型C3";
      } else if (val === "MEM-optimized M3") {
        return "記憶體型M3";
      }
    },
    // 机型
    handleCurrentChange1(val) {
      this.modelText = val;
    },
    Radio1Change(index, i) {
      this.colonySecond.workerOneList[index].radioIndex = i;
    },
    // 机型
    handleCurrentChange(val) {
      this.modelText2 = val;
    },
    // 机型 弹框确认
    ModelSure(index, a) {
      if (this.modelText === undefined) {
        this.modelText = this.colonySecond.tableList[index];
      }
      if (this.modelText2 === undefined) {
        this.modelText2 = this.colonySecond.masterTableList[index];
      }
      if (a == 1) {
        this.colonySecond.workerOneList[
          index
        ].modelName = this.modelText.InstanceType;
        this.colonySecond.workerOneList[
          index
        ].InstanceChargeType = this.modelText.InstanceChargeType;
        this.colonySecond.workerOneList[index].modelType = this.ModelTypeName(
          this.modelText.TypeName
        );
        this.colonySecond.workerOneList[index].modelHe = this.modelText.Cpu;
        this.colonySecond.workerOneList[index].modelGB = this.modelText.Memory;
        this.colonySecond.index = this.colonySecond.workerOneList[
          index
        ].radioIndex;
        this.colonySecond.workerOneList[
          index
        ].radioIndex = this.colonySecond.workerOneList[index].radioIndex;
        this.colonySecond.workerOneList[index].modelShow = false;
      } else {
        this.colonySecond.masterOneList[
          index
        ].modelName = this.modelText2.InstanceType;
        this.colonySecond.masterOneList[
          index
        ].InstanceChargeType = this.modelText2.InstanceChargeType;
        this.colonySecond.masterOneList[index].modelType = this.ModelTypeName(
          this.modelText2.TypeName
        );
        this.colonySecond.masterOneList[index].modelHe = this.modelText2.Cpu;
        this.colonySecond.masterOneList[index].modelGB = this.modelText2.Memory;
        this.colonySecond.masterOneList[index].modelShow = false;
      }
      // 总计费用
      this.TotalCost();
    },
    // 系统盘 弹框确认
    SystemDiskSure(index, a) {
      var systemDiskOptions = this.colonySecond.systemDiskOptions;
      for (var i in systemDiskOptions) {
        if (a == 1) {
          this.colonySecond.workerOneList[
            index
          ].systemDiskNumber = this.colonySecond.systemDiskNum;

          if (
            this.colonySecond.workerOneList[index].systemDiskVal ==
            systemDiskOptions[i].value
          ) {
            this.colonySecond.workerOneList[index].systemDiskValue =
              systemDiskOptions[i].label;
          }
          this.colonySecond.workerOneList[index].systemDiskShow = false;
        } else {
          this.colonySecond.masterOneList[
            index
          ].systemDiskNumber = this.colonySecond.systemDiskNum;
          if (
            this.colonySecond.masterOneList[index].systemDiskVal ==
            systemDiskOptions[i].value
          ) {
            this.colonySecond.masterOneList[index].systemDiskValue =
              systemDiskOptions[i].label;
          }
          this.colonySecond.masterOneList[index].systemDiskShow = false;
        }
      }
      this.TotalCost();
    },
    // 购买数据盘
    BuyDataDisk(index, a) {
      if (a == 1) {
        if (this.colonySecond.workerOneList[index].buyDataDisk === true) {
          this.colonySecond.buyDataWidth = 764;
          this.AddDataDisk(index);
        } else {
          this.colonySecond.buyDataWidth = 300;
          this.colonySecond.workerOneList[index].buyDataDiskArr = [];
        }
      } else {
        if (this.colonySecond.masterOneList[index].buyDataDisk === true) {
          this.colonySecond.buyDataWidth = 764;
        } else {
          this.colonySecond.buyDataWidth = 300;
        }
      }
    },
    DataDiskChange(a, index, i) {
      if (a == 1) {
        if (
          this.colonySecond.workerOneList[index].buyDataDiskArr[i]
            .dataDiskVal !== "CLOUD_PREMIUM"
        ) {
          this.colonySecond.workerOneList[index].buyDataDiskArr[i].dataDiskNum =
            "100";
          this.colonySecond.workerOneList[index].buyDataDiskArr[
            i
          ].dataDiskMinNum = 100;
        } else {
          this.colonySecond.workerOneList[index].buyDataDiskArr[i].dataDiskNum =
            "10";
          this.colonySecond.workerOneList[index].buyDataDiskArr[
            i
          ].dataDiskMinNum = 10;
        }
      } else {
        if (
          this.colonySecond.masterOneList[index].dataDiskVal !== "CLOUD_PREMIUM"
        ) {
          this.colonySecond.masterOneList[index].dataDiskNum = "100";
          this.colonySecond.masterOneList[index].dataDiskMinNum = 100;
        } else {
          this.colonySecond.masterOneList[index].dataDiskNum = "10";
          this.colonySecond.masterOneList[index].dataDiskMinNum = 10;
        }
      }
    },
    // 购买数据盘 添加数据盘
    AddDataDisk(index) {
      this.colonySecond.workerOneList[index].buyDataDiskArr.push({
        dataDiskVal: "CLOUD_PREMIUM",
        dataDiskNum: "10",
        dataDiskMinNum: 10,
        formatMount: false,
        latticeSetVal: "ext3",
        setValue: "/var/lib/docker"
      });
    },
    // 删除
    deleteDataDisk(index, i) {
      this.colonySecond.workerOneList[index].buyDataDiskArr.splice(i, 1);
      if (this.colonySecond.workerOneList[index].buyDataDiskArr.length === 0) {
        this.colonySecond.workerOneList[index].buyDataDisk = false;
        this.colonySecond.buyDataWidth = 300;
      }
    },
    // 数据盘 弹框确认
    DataDiskSure(index, a) {
      this.colonySecond.workerOneList[index].dataDiskArr = [];
      let _masterOneList = this.colonySecond.masterOneList;
      let text = [];
      let text_2 = "";
      if (this.colonySecond.workerOneList[index].dataDiskArr.length === 0) {
        this.colonySecond.workerOneList[index].dataDiskValue = "暫不購買";
      }

      if (a == 1) {
        let buyDataDiskArr = this.colonySecond.workerOneList[index]
          .buyDataDiskArr;
        for (var i in buyDataDiskArr) {
          for (let j in this.colonySecond.dataDiskOptions) {
            if (
              buyDataDiskArr[i].dataDiskVal ===
              this.colonySecond.dataDiskOptions[j].value
            ) {
              let num = i - 0 + (1 - 0);
              text.push(
                "[" +
                  num +
                  "]" +
                  this.colonySecond.dataDiskOptions[j].label +
                  " " +
                  buyDataDiskArr[i].dataDiskNum +
                  "GB;"
              );
              this.colonySecond.workerOneList[
                index
              ].dataDiskValue = text.toString().replace(",", "");

              this.colonySecond.workerOneList[index].dataDiskArr.push({
                DiskType: this.colonySecond.dataDiskOptions[j].value,
                DiskSize: buyDataDiskArr[i].dataDiskNum,
                formatMount: buyDataDiskArr[i].formatMount,
                latticeSetVal: buyDataDiskArr[i].latticeSetVal,
                setValue: buyDataDiskArr[i].setValue
              });
            }
          }
        }
        this.colonySecond.workerOneList[index].dataDiskShow = false;
      } else {
        console.log(_masterOneList[index].buyDataDisk);
        if (!_masterOneList[index].buyDataDisk) {
          _masterOneList[index].dataDiskValue = "暫不購買";
        } else {
          for (let i in this.colonySecond.dataDiskOptions) {
            if (
              _masterOneList[index].dataDiskVal ==
              this.colonySecond.dataDiskOptions[i].value
            ) {
              text_2 = this.colonySecond.dataDiskOptions[i].label;
            }
          }
          _masterOneList[index].dataDiskValue =
            "[1]" + text_2 + " " + _masterOneList[index].dataDiskNum + "GB";
        }
        _masterOneList[index].dataDiskShow = false;
      }
      let arrMaster = [];
      for (let i in this.colonySecond.masterOneList) {
        if (this.colonySecond.masterOneList[i].buyDataDisk === true) {
          arrMaster.push(this.colonySecond.masterOneList[i]);
        }
      }
      if (arrMaster.length > 0) {
        this.colonySecond.masterDataDiskMountShow = true;
      } else {
        this.colonySecond.masterDataDiskMountShow = false;
      }
      // 总计费用
      this.$nextTick(() => {
        this.TotalCost();
      });
    },
    // 公网带宽 弹框确认
    BroadbandSure(index, a) {
      var broadbandOptions = this.colonySecond.broadbandOptions;
      if (a == 1) {
        this.colonySecond.workerOneList[
          index
        ].broadbandNumber = this.colonySecond.broadbandNum;
        for (var i in broadbandOptions) {
          if (
            this.colonySecond.workerOneList[index].broadbandVal ===
            broadbandOptions[i].value
          ) {
            this.colonySecond.workerOneList[index].broadbandValue =
              broadbandOptions[i].label;
          }
        }
        this.colonySecond.workerOneList[index].broadbandShow = false;
      } else {
        this.colonySecond.masterOneList[
          index
        ].broadbandNumber = this.colonySecond.broadbandNum;
        for (var i in broadbandOptions) {
          if (
            this.colonySecond.masterOneList[index].broadbandVal ===
            broadbandOptions[i].value
          ) {
            this.colonySecond.masterOneList[index].broadbandValue =
              broadbandOptions[i].label;
          }
        }
        this.colonySecond.masterOneList[index].broadbandShow = false;
      }
      this.TotalCost();
    },
    // 确定
    WorkerSure(index, a) {
      if (a == 1) {
        let worker = this.colonySecond.workerNodeNetOpt;
        for (var i in worker) {
          if (
            this.colonySecond.workerOneList[index].workerNodeNetworkVal ===
            worker[i].SubnetId
          ) {
            this.colonySecond.workerOneList[index].workerNodeNetworkValue =
              worker[i].SubnetName;
          }
        }
        this.colonySecond.workerOneList[index].showText = true;
        this.colonySecond.workerOneList[index].showEdit = false;
      } else {
        let worker = this.colonySecond.workerNodeNetOpt;
        for (var i in worker) {
          if (
            this.colonySecond.masterOneList[index].workerNodeNetworkVal ===
            worker[i].SubnetId
          ) {
            this.colonySecond.masterOneList[index].workerNodeNetworkValue =
              worker[i].SubnetName;
          }
        }
        this.colonySecond.masterOneList[index].showText = true;
        this.colonySecond.masterOneList[index].showEdit = false;
      }
    },
    // worker 配置 编辑
    EditWorker(index, a) {
      if (a == 1) {
        let workerOneList = this.colonySecond.workerOneList;
        for (let i in workerOneList) {
          if (index == i) {
            this.colonySecond.workerOneList[index].showText = false;
            this.colonySecond.workerOneList[index].showEdit = true;
          } else {
            this.colonySecond.workerOneList[i].showText = true;
            this.colonySecond.workerOneList[i].showEdit = false;
          }
        }
      } else {
        let masterOneList = this.colonySecond.masterOneList;
        for (let i in masterOneList) {
          if (index == i) {
            this.colonySecond.masterOneList[index].showText = false;
            this.colonySecond.masterOneList[index].showEdit = true;
          } else {
            this.colonySecond.masterOneList[i].showText = true;
            this.colonySecond.masterOneList[i].showEdit = false;
          }
        }
      }
      this.TotalCost();
    },
    // worker 配置 删除
    DeleteWorker(index, a) {
      if (a == 1) {
        this.colonySecond.workerOneList.splice(index, 1);
      } else {
        this.colonySecond.masterOneList.splice(index, 1);
      }
      this.TotalCost();
    },
    // 添加机型
    OneAddModel() {
      console.log(this.colonySecond.index);
      this.colonySecond.index++;
      this.colonySecond.workerOneList.push({
        showText: false,
        showEdit: true,
        radio1: this.colonySecond.index,
        radioIndex: null,
        modelShow: false,
        modelName: "",
        modelType: "",
        modelHe: "",
        modelGB: "",
        systemDiskShow: false,
        dataDiskShow: false,
        broadbandShow: false,
        workerNodeNetworkValue: "",
        systemDiskVal: "CLOUD_PREMIUM",
        systemDiskValue: "高性能雲硬碟",
        systemDiskNumber: "50",
        // 数据盘
        dataDiskValue: "暫不購買",
        buyDataDisk: false,
        dataDiskArr: [],
        buyDataDiskArr: [],
        dataDiskVal: "CLOUD_PREMIUM",
        dataDiskNumber: "10",
        dataDiskNum: "10",
        dataDiskNum1: "100",
        latticeSetVal: "ext3",
        setValue: "/var/lib/docker",
        broadbandValue: "按寬頻計費",
        broadbandVal: "BANDWIDTH_POSTPAID_BY_HOUR",
        broadbandNumber: "1",
        formatMount: true,
        dataNum: "1"
      });
      let _workerOneList = this.colonySecond.workerOneList;
      let _length = this.colonySecond.workerOneList.length;
      _workerOneList[_length - 2].showText = true;
      _workerOneList[_length - 2].showEdit = false;
      this.ChildNodes();
      this.TotalCost();
      _workerOneList[_length - 1].modelName = this.colonySecond.tableList[
        this.colonySecond.index
      ].InstanceType;
      _workerOneList[_length - 1].modelType = this.ModelTypeName(
        this.colonySecond.tableList[this.colonySecond.index].TypeName
      );
      _workerOneList[_length - 1].modelHe = this.colonySecond.tableList[
        this.colonySecond.index
      ].Cpu;
      _workerOneList[_length - 1].modelGB = this.colonySecond.tableList[
        this.colonySecond.index
      ].Memory;
      for (let i in this.colonySecond.tableList) {
        for (let j in _workerOneList) {
          if (
            this.colonySecond.tableList[i].index == _workerOneList[j].radioIndex
          ) {
            this.colonySecond.tableList[i].tableDisShow = true;
          }
        }
      }
    },
    // Master&Etcd 配置 添加机型
    MasterAddModel() {
      // this.colonySecond.masterIndex++;
      this.colonySecond.masterOneList.push({
        showText: false,
        showEdit: true,
        radio1: this.colonySecond.masterIndex,
        modelShow: false,
        modelName: "",
        modelType: "",
        modelHe: "",
        modelGB: "",
        systemDiskShow: false,
        dataDiskShow: false,
        broadbandShow: false,
        workerNodeNetworkValue: "",
        systemDiskVal: "CLOUD_PREMIUM",
        systemDiskValue: "高性能雲硬碟",
        systemDiskNumber: "50",
        // 数据盘
        dataDiskValue: "暫不購買",
        buyDataDisk: false,
        dataDiskArr: [],
        buyDataDiskArr: [],
        dataDiskVal: "CLOUD_PREMIUM",
        dataDiskNumber: "10",
        dataDiskNum: "10",
        dataDiskNum1: "100",
        latticeSetVal: "ext3",
        setValue: "/var/lib/docker",
        broadbandValue: "按寬頻計費",
        broadbandVal: "BANDWIDTH_POSTPAID_BY_HOUR",
        broadbandNumber: "1",
        formatMount: true,
        dataNum: "1"
      });
      let _length = this.colonySecond.masterOneList.length;
      let _masterOneList = this.colonySecond.masterOneList;
      _masterOneList[_length - 2].showText = true;
      _masterOneList[_length - 2].showEdit = false;
      _masterOneList[_length - 1].modelName = this.colonySecond.masterTableList[
        this.colonySecond.masterIndex
      ].InstanceType;
      _masterOneList[_length - 1].modelType = this.ModelTypeName(
        this.colonySecond.masterTableList[this.colonySecond.masterIndex]
          .TypeName
      );
      _masterOneList[_length - 1].modelHe = this.colonySecond.masterTableList[
        this.colonySecond.masterIndex
      ].Cpu;
      _masterOneList[_length - 1].modelGB = this.colonySecond.masterTableList[
        this.colonySecond.masterIndex
      ].Memory;
      this.ChildNodes();
      this.TotalCost();
      if (this.colonySecond.masterOneList.length > 2) {
        this.colonySecond.masterTips = false;
        this.colonySecond.secondNextShow = true;
      }
    },
    // 总计费用
    async TotalCost() {
      this.colonySecond.costShow = true;
      var _allcost,
        _netcost,
        _allcost2,
        _netcost2 = "";
      var num = 0;
      var _workerOneList = this.colonySecond.workerOneList;
      this.costAll = [];

      for (var i in _workerOneList) {
        let param = {
          Version: "2017-03-12",
          // ImageId: this.colony.OSvalue,
          ImageId: "img-6yudrskj",
          "Placement.ProjectId": Number(this.colony.projectValue),
          "Placement.Zone": "ap-taipei-1",
          // 机型
          InstanceChargeType: _workerOneList[i].InstanceChargeType,
          InstanceType: _workerOneList[i].modelName,
          // 数量
          InstanceCount: 1,
          // 系统盘
          "SystemDisk.DiskSize": Number(_workerOneList[i].systemDiskNumber),
          "SystemDisk.DiskType": _workerOneList[i].systemDiskVal,
          PurchaseSource: "MC"
        };
        // 数据盘
        if (_workerOneList[i].buyDataDisk) {
          let dataDisk = _workerOneList[i].dataDiskArr;
          for (let j in dataDisk) {
            param["DataDisks." + j + ".DiskSize"] = dataDisk[j].DiskSize;
            param["DataDisks." + j + ".DiskType"] = dataDisk[j].DiskType;
          }
        }
        // 公网带宽
        param["InternetAccessible.InternetChargeType"] =
          _workerOneList[i].broadbandVal;
        param["InternetAccessible.InternetMaxBandwidthOut"] = Number(
          _workerOneList[i].broadbandNumber
        );
        if (_workerOneList[i].broadbandNumber == 0) {
          param["InternetAccessible.PublicIpAssigned"] = false;
        } else {
          param["InternetAccessible.PublicIpAssigned"] = true;
        }
        if (this.colonySecond.charging == 2) {
          param["EnhancedService.SecurityService.Enabled"] = true;
          param["EnhancedService.MonitorService.Enabled"] = true;
          param["InstanceChargePrepaid.Period"] = this.colonySecond.buyTime;
          // if (this.colonySecond.renew === true) {
          param["InstanceChargePrepaid.RenewFlag"] = "NOTIFY_AND_AUTO_RENEW";
          // }
        }
        await this.axios.post(TKE_PRICE, param).then(res => {
          if (res.Response.Error === undefined) {
            let _data = res.Response.Price;
            this.costAll.push(_data);
          } else {
            let ErrTips = {
              AccountQualificationRestrictions: "該請求帳戶未通過資格審計。",
              InstancesQuotaLimitExceeded:
                "表示當前創建的實例個數超過了該帳戶允許購買的剩餘配額數。",
              "InvalidClientToken.TooLong":
                "指定的ClientToken字元串長度超出限制，必須小於等於64位元組。",
              "InvalidHostId.NotFound":
                "指定的HostId不存在，或不屬於該請求帳號所有。",
              "InvalidInstanceName.TooLong":
                "指定的InstanceName字元串長度超出限制，必須小於等於60位元組。",
              "InvalidInstanceType.Malformed":
                "指定InstanceType參數格式不合法。",
              InvalidParameterCombination: "表示參數組合不正確。",
              InvalidParameterValue:
                "無效參數值。參數值格式錯誤或者參數值不被支持等。",
              "InvalidParameterValue.Range":
                "無效參數值。參數值取值範圍不合法。",
              InvalidPassword:
                "無效密碼。指定的密碼不符合密碼複雜度限制。例如密碼長度不符合限制等。",
              InvalidPeriod:
                "無效時長。目前只支持時長：[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 24, 36]，單位：月。",
              InvalidPermission: "帳戶不支持該操作。",
              "InvalidZone.MismatchRegion": "指定的zone不存在。",
              MissingParameter: "參數缺失。請求沒有帶必選參數。"
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
      }
      if (this.colonySecond.master == 2 && this.colonySecond.source == 1) {
        var _masterOneList = this.colonySecond.masterOneList;
        this.costAll2 = [];
        for (var i in _masterOneList) {
          let params = {
            Version: "2017-03-12",
            // ImageId: this.colony.OSvalue,
            ImageId: "img-6yudrskj",
            "Placement.ProjectId": Number(this.colony.projectValue),
            "Placement.Zone": "ap-taipei-1",
            // 机型
            InstanceChargeType: _masterOneList[i].InstanceChargeType,
            InstanceType: _masterOneList[i].modelName,
            // 数量
            InstanceCount: 1,
            // 系统盘
            "SystemDisk.DiskSize": Number(_masterOneList[i].systemDiskNumber),
            "SystemDisk.DiskType": _masterOneList[i].systemDiskVal,
            PurchaseSource: "MC"
          };
          // 数据盘
          if (_masterOneList[i].buyDataDisk) {
            params["DataDisks.0.DiskSize"] = _masterOneList[i].dataDiskNum;
            params["DataDisks.0.DiskType"] = _masterOneList[i].dataDiskVal;
          }
          // 公网带宽
          params["InternetAccessible.InternetChargeType"] =
            _masterOneList[i].broadbandVal;
          params["InternetAccessible.InternetMaxBandwidthOut"] = Number(
            _masterOneList[i].broadbandNumber
          );
          if (_masterOneList[i].broadbandNumber == 0) {
            params["InternetAccessible.PublicIpAssigned"] = false;
          } else {
            params["InternetAccessible.PublicIpAssigned"] = true;
          }

          if (this.colonySecond.charging == 2) {
            params["EnhancedService.SecurityService.Enabled"] = true;
            params["EnhancedService.MonitorService.Enabled"] = true;

            params["InstanceChargePrepaid.Period"] = this.colonySecond.buyTime;
            // if (this.colonySecond.renew === true) {
            params["InstanceChargePrepaid.RenewFlag"] = "NOTIFY_AND_AUTO_RENEW";
            // }
          }
          await this.axios.post(TKE_PRICE, params).then(res => {
            if (res.Response.Error === undefined) {
              let _data = res.Response.Price;
              this.costAll2.push(_data);
            } else {
              let ErrTips = {
                AccountQualificationRestrictions: "該請求帳戶未通過資格審計。",
              InstancesQuotaLimitExceeded:
                "表示當前創建的實例個數超過了該帳戶允許購買的剩餘配額數。",
              "InvalidClientToken.TooLong":
                "指定的ClientToken字元串長度超出限制，必須小於等於64位元組。",
              "InvalidHostId.NotFound":
                "指定的HostId不存在，或不屬於該請求帳號所有。",
              "InvalidInstanceName.TooLong":
                "指定的InstanceName字元串長度超出限制，必須小於等於60位元組。",
              "InvalidInstanceType.Malformed":
                "指定InstanceType參數格式不合法。",
              InvalidParameterCombination: "表示參數組合不正確。",
              InvalidParameterValue:
                "無效參數值。參數值格式錯誤或者參數值不被支持等。",
              "InvalidParameterValue.Range":
                "無效參數值。參數值取值範圍不合法。",
              InvalidPassword:
                "無效密碼。指定的密碼不符合密碼複雜度限制。例如密碼長度不符合限制等。",
              InvalidPeriod:
                "無效時長。目前只支持時長：[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 24, 36]，單位：月。",
              InvalidPermission: "帳戶不支持該操作。",
              "InvalidZone.MismatchRegion": "指定的zone不存在。",
              MissingParameter: "參數缺失。請求沒有帶必選參數。"
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
        }
      }
      _allcost = this.costAll.reduce(
        (num, item) => num + item.InstancePrice.UnitPrice,
        0
      );
      _netcost = this.costAll.reduce(
        (num, item) => num + item.BandwidthPrice.UnitPrice,
        0
      );

      this.colonySecond.allocationCost = _allcost.toFixed(2);
      this.colonySecond.networkCost = _netcost.toFixed(2);

      if (this.colonySecond.source == 1 && this.colonySecond.master == 2) {
        _allcost2 = this.costAll2.reduce(
          (num, item) => num + item.InstancePrice.UnitPrice,
          0
        );
        _netcost2 = this.costAll2.reduce(
          (num, item) => num + item.BandwidthPrice.UnitPrice,
          0
        );
        this.colonySecond.allocationCost = (_allcost + _allcost2).toFixed(2);
        this.colonySecond.networkCost = (_netcost + _netcost2).toFixed(2);
      }
      this.colonySecond.costShow = false;
    },
    // 第二步 上一步
    secondPrev() {
      this.firstBox = true;
      this.secondBox = false;
      this.thirdBox = false;
      this.fourthBox = false;
    },
    // 第二步 下一步
    secondNext() {
      this.firstBox = false;
      this.secondBox = false;
      this.thirdBox = true;
      this.fourthBox = false;
    },
    // 第二步 完成
    SecondCreateFinish() {
      let param = {
        Version: "2018-05-25",
        "ClusterCIDRSettings.ClusterCIDR": this.dispose.container,
        "ClusterCIDRSettings.IgnoreClusterCIDRConflict": false,
        "ClusterCIDRSettings.MaxNodePodNum": Number(this.colony.PodValue),
        "ClusterCIDRSettings.MaxClusterServiceNum": Number(
          this.colony.ServiceValue
        )
      };
      if (this.colonySecond.master == 1) {
        param["ClusterType"] = "MANAGED_CLUSTER";
      } else {
        param["ClusterType"] = "INDEPENDENT_CLUSTER";
      }

      let ClusterOs = "";
      for (let i in this.colony.OSoptions) {
        if (this.colony.OSvalue === this.colony.OSoptions[i].ImageId) {
          ClusterOs = this.colony.OSoptions[i].OsName;
        }
      }
      param["ClusterBasicSettings.ClusterOs"] = ClusterOs;
      param["ClusterBasicSettings.ClusterVersion"] = this.colony.kuValue;
      param["ClusterBasicSettings.ClusterName"] = this.colony.name;
      param["ClusterBasicSettings.ClusterDescription"] = this.colony.desc;
      param["ClusterBasicSettings.VpcId"] = this.colony.networkValue;
      param["ClusterBasicSettings.ProjectId"] = Number(
        this.colony.projectValue
      );
      if (this.colonyThird.defaultSafeBox === true) {
        param["ClusterBasicSettings.NeedWorkSecurityGroup"] = true;
      } else {
        param["ClusterBasicSettings.NeedWorkSecurityGroup"] = false;
      }
      param["ClusterBasicSettings.OsCustomizeType"] = "GENERAL";
      // param["ClusterBasicSettings.TagSpecification.0.ResourceType"] = "cluster";
      param["ClusterBasicSettings.TagSpecification.0.Tags.0.Key"] = "";
      param["ClusterBasicSettings.TagSpecification.0.Tags.0.Value"] = "";

      if (this.colony.ipvs === true) {
        param["ClusterAdvancedSettings.IPVS"] = true;
      } else {
        param["ClusterAdvancedSettings.IPVS"] = false;
      }
      param["ClusterAdvancedSettings.AsEnabled"] = false;
      param[
        "ClusterAdvancedSettings.ContainerRuntime"
      ] = this.colony.assemblyRadio;
      param["ClusterAdvancedSettings.NodeNameType"] = "lan-ip";
      param["ClusterAdvancedSettings.ExtraArgs.KubeAPIServer.0"] = "";
      param["ClusterAdvancedSettings.ExtraArgs.KubeControllerManager.0"] = "";
      param["ClusterAdvancedSettings.ExtraArgs.KubeScheduler.0"] = "";

      param["InstanceAdvancedSettings.MountTarget"] = "";
      param["InstanceAdvancedSettings.DockerGraphPath"] = "";
      param["InstanceAdvancedSettings.UserScript"] = "";
      param["InstanceAdvancedSettings.Unschedulable"] = 0;
      param["InstanceAdvancedSettings.Labels.0.Name"] = "";
      param["InstanceAdvancedSettings.Labels.0.Value"] = "";

      this.axios.post(TKE_CREATW_CLUSTERS, param).then(res => {
        if (res.Response.Error === undefined) {
          console.log(res.Response);
          this.$router.go(-1);
        } else {
          let ErrTips = {
            InternalError: "内部錯誤",
            "InternalError.AccountUserNotAuthenticated": "帳戶未通過認證。",
            "InternalError.AsCommon": "伸縮組資源創建報錯。",
            "InternalError.CidrConflictWithOtherCluster":
              "CIDR和其他集群CIDR衝突。",
            "InternalError.CidrConflictWithOtherRoute": "CIDR和其他路由衝突。",
            "InternalError.CidrConflictWithVpcCidr": "CIDR和vpc衝突。",
            "InternalError.CidrConflictWithVpcGlobalRoute":
              "CIDR和全局路由衝突。",
            "InternalError.CidrInvali": "CIDR無效。",
            "InternalError.CidrMaskSizeOutOfRange": "CIDR掩碼無效。",
            "InternalError.CreateMasterFailed": "創建集群失敗。",
            "InternalError.CvmCommon": "cvm創建節點報錯。",
            "InternalError.Db": "db錯誤。",
            "InternalError.DbAffectivedRows": "DB錯誤",
            "InternalError.DfwGetUSGCount": "獲得當前安全組總數失敗。",
            "InternalError.DfwGetUSGQuota": "獲得安全組配額失敗。",
            "InternalError.InitMasterFailed": "初始化master失敗。",
            "InternalError.InvalidPrivateNetworkCidr": "無效CIDR。",
            "InternalError.Param": "Param。",
            "InternalError.PublicClusterOpNotSupport": "集群不支持當前操作。",
            "InternalError.QuotaMaxClsLimit": "超過配額限制。",
            "InternalError.QuotaMaxNodLimit": "超過配額限制。",
            "InternalError.QuotaUSGLimit": "安全組配額不足。",
            "InternalError.UnexceptedInternal": "内部錯誤",
            "InternalError.VpcCommon": "VPC報錯。",
            "InternalError.VpcRecodrNotFound": "未發現vpc記錄。",
            InvalidParameter: "參數錯誤",
            LimitExceeded: "超過配額限制"
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
    // ----------------------------------------- 第三步 -------------------------------------
    // 安全组
    SecurityGroup() {
      let param = {
        Version: "2017-03-12"
      };
      param["Filters.0.Name"] = "project-id";
      param["Filters.0.Values.0"] = this.colony.projectValue;
      this.axios.post(TKE_MISG, param).then(res => {
        if (res.Response.Error === undefined) {
          var arr = res.Response.SecurityGroupSet;
          for (var i in arr) {
            this.securityGroupOpt.push({
              label: arr[i].SecurityGroupId + "|" + arr[i].SecurityGroupName,
              value: arr[i].SecurityGroupId
            });
          }
          this.securityGroupOpt[0].securityGroupSel = this.securityGroupOpt[0].value;
        } else {
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
    AddSafe() {
      this.colonyThird.defaultSafeBox = true;
      this.colonyThird.defaultSafe = true;
      this.colonyThird.safeArr.push({
        securityGroupSel: ""
      });
    },
    //删除一项
    deleteExceptPrice(index) {
      this.colonyThird.safeArr.splice(index, 1);
      if (this.colonyThird.safeArr.length === 0) {
        this.colonyThird.defaultSafeBox = true;
        this.colonyThird.defaultSafe = false;
      }
    },
    // 登录方式
    LoginMode(val) {
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
    // SSH密钥
    SSHKey() {
      let param = {
        Version: "2017-03-12"
      };
      this.axios.post(TKE_SSH, param).then(res => {
        if (res.Response.Error === undefined) {
          this.colonyThird.sshKey = res.Response.KeyPairSet;
          // console.log(res.Response.KeyPairSet);
          this.colonyThird.sshKeySel = this.colonyThird.sshKey[0].KeyId;
        } else {
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
    // 第三步 上一步
    thirdPrev() {
      this.firstBox = false;
      this.secondBox = true;
      this.thirdBox = false;
      this.fourthBox = false;
      this.$nextTick(() => {
        this.rightList.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row, true);
        });
      });
    },
    ValueParam() {
      this.param = [];
      this.params = [];
      let _workerOneList = this.colonySecond.workerOneList;
      for (let i in _workerOneList) {
        let param = {
          Version: "2017-03-12",
          ImageId: this.colony.OSvalue,
          // ImageId: "img-0amm1ukz",
          Placement: {
            ProjectId: Number(this.colony.projectValue),
            Zone: "ap-taipei-1"
          },
          // 机型
          InstanceChargeType: _workerOneList[i].InstanceChargeType,
          InstanceType: _workerOneList[i].modelName,
          // 数量
          InstanceCount: 1,
          // 系统盘
          SystemDisk: {
            DiskSize: Number(_workerOneList[i].systemDiskNumber),
            DiskType: _workerOneList[i].systemDiskVal
          },
          VirtualPrivateCloud: {
            VpcId: this.colony.networkValue,
            SubnetId: _workerOneList[i].workerNodeNetworkVal
          },
          InstanceName: "",
          UserData: "",
          PurchaseSource: "docker_dashboard"
        };

        // 数据盘
        let _dtaDisk = [];
        if (_workerOneList[i].buyDataDisk) {
          let dataDisk = _workerOneList[i].dataDiskArr;
          for (let j in dataDisk) {
            _dtaDisk.push({
              DiskSize: dataDisk[j].DiskSize,
              DiskType: dataDisk[j].DiskType
            });
          }
          param["DataDisks"] = _dtaDisk;
        }

        // 公网带宽
        param["InternetAccessible"] = {
          InternetChargeType: _workerOneList[i].broadbandVal,
          InternetMaxBandwidthOut: Number(_workerOneList[i].broadbandNumber)
        };
        if (_workerOneList[i].broadbandNumber == 0) {
          param["InternetAccessible"].PublicIpAssigned = false;
        } else {
          param["InternetAccessible"].PublicIpAssigned = true;
        }
        param["EnhancedService"] = {
          SecurityService: { Enabled: true },
          MonitorService: { Enabled: true }
        };

        if (this.colonySecond.charging == 2) {
          if (this.colonySecond.renew === true) {
            param["InstanceChargePrepaid"] = {
              Period: this.colonySecond.buyTime,
              RenewFlag: "NOTIFY_AND_AUTO_RENEW"
            };
          }
        }

        // 登录方式
        if (this.colonyThird.loginModeRadio == 1) {
          param["LoginSettings"] = {
            KeyIds: [this.colonyThird.sshKeySel]
          };
        }
        if (this.colonyThird.loginModeRadio == 3) {
          param["LoginSettings"] = {
            Password: this.colonyThird.password
          };
        }

        // 安全组
        let _safeArr1 = this.colonyThird.safeArr;
        if (_safeArr1.length > 0) {
          let _saArr = [];

          for (let i in _safeArr1) {
            _saArr.push(_safeArr1[i].securityGroupSel);
          }

          param["SecurityGroupIds"] = _saArr1;
        }
        this.param.push(param);
      }

      let _masterOneList = this.colonySecond.masterOneList;
      for (let i in _masterOneList) {
        let params = {
          Version: "2017-03-12",
          ImageId: this.colony.OSvalue,
          // ImageId: "img-0amm1ukz",
          Placement: {
            ProjectId: Number(this.colony.projectValue),
            Zone: "ap-taipei-1"
          },
          // 机型
          InstanceChargeType: _masterOneList[i].InstanceChargeType,
          InstanceType: _masterOneList[i].modelName,
          // 数量
          InstanceCount: 1,
          // 系统盘
          SystemDisk: {
            DiskSize: Number(_masterOneList[i].systemDiskNumber),
            DiskType: _masterOneList[i].systemDiskVal
          },
          VirtualPrivateCloud: {
            VpcId: this.colony.networkValue,
            SubnetId: _masterOneList[i].workerNodeNetworkVal
          },
          InstanceName: "",
          UserData: "",
          PurchaseSource: "docker_dashboard"
        };

        // 数据盘
        if (_masterOneList[i].buyDataDisk) {
          let _dtaDisk = [];

          _dtaDisk.push({
            DiskSize: _masterOneList[i].dataDiskNum,
            DiskType: _masterOneList[i].dataDiskVal
          });

          params["DataDisks"] = _dtaDisk;
        }
        // 公网带宽
        params["InternetAccessible"] = {
          InternetChargeType: _masterOneList[i].broadbandVal,
          InternetMaxBandwidthOut: Number(_masterOneList[i].broadbandNumber)
        };
        if (_masterOneList[i].broadbandNumber == 0) {
          params["InternetAccessible"].PublicIpAssigned = false;
        } else {
          params["InternetAccessible"].PublicIpAssigned = true;
        }
        params["EnhancedService"] = {
          SecurityService: { Enabled: true },
          MonitorService: { Enabled: true }
        };
        if (this.colonySecond.charging == 2) {
          if (this.colonySecond.renew === true) {
            params["InstanceChargePrepaid"] = {
              Period: this.colonySecond.buyTime,
              RenewFlag: "NOTIFY_AND_AUTO_RENEW"
            };
          }
        }

        // 登录方式
        if (this.colonyThird.loginModeRadio == 1) {
          params["LoginSettings"] = {
            KeyIds: [this.colonyThird.sshKeySel]
          };
        }
        if (this.colonyThird.loginModeRadio == 3) {
          params["LoginSettings"] = {
            Password: this.colonyThird.password
          };
        }
        let _safeArr = this.colonyThird.safeArr;
        // 安全组
        if (_safeArr.length > 0) {
          let _saArr = [];

          for (let i in _safeArr) {
            _saArr.push(_safeArr[i].securityGroupSel);
          }

          params["SecurityGroupIds"] = _saArr;
        }
        this.params.push(params);
      }
    },
    // 设置密码
    PasswordInput(val) {
      if (val == "") {
        this.colonyThird.passwordTips = "密碼不能為空";
        this.colonyThird.passwordWran = true;
      } else if (val.length <= 8 || val.length > 16) {
        this.colonyThird.passwordTips = "密碼必須為8到16位";
        this.colonyThird.passwordWran = true;
      } else if (
        !/^(?![A-Z]+$)(?![a-z]+$)(?![0-9]+$)(?![/`!#$%^&*()-+=|{\\[\\]':;,.?}\/]+$)[\da-zA-Z0-9`!#$%^&*()-+=|{[\]':;,.?/}].{8,16}$/.test(
          val
        )
      ) {
        // ()`~!@#$%^&}*-+=|{}[]:;',.?/
        this.colonyThird.passwordTips =
          "密碼必須包含數字、字母、特殊字元中至少兩項";
        this.colonyThird.passwordWran = true;
      } else {
        this.colonyThird.passwordWran = false;
      }
    },
    // 第三步 下一步
    thirdNext() {
      if (this.colonyThird.passwordWran === true) {
        return false;
      } else {
        this.firstBox = false;
        this.secondBox = false;
        this.thirdBox = false;
        this.fourthBox = true;
      }
      this.ValueParam();
    },
    // ----------------------------------------- 第四步 ---------------------------------------
    // 第四步 上一步
    fourthPrev() {
      this.firstBox = false;
      this.secondBox = false;
      this.thirdBox = true;
      this.fourthBox = false;
    },
    // 创建 完成
    CreateFinish() {
      var workerOneListArr = this.colonySecond.workerOneList;
      var masterOneListArr = this.colonySecond.masterOneList;
      let param = {
        Version: "2018-05-25",
        "ClusterCIDRSettings.ClusterCIDR": this.dispose.container,
        "ClusterCIDRSettings.IgnoreClusterCIDRConflict": false,
        "ClusterCIDRSettings.MaxNodePodNum": Number(this.colony.PodValue),
        "ClusterCIDRSettings.MaxClusterServiceNum": Number(
          this.colony.ServiceValue
        )
      };
      if (this.colonySecond.master == 1) {
        param["ClusterType"] = "MANAGED_CLUSTER";
      } else {
        param["ClusterType"] = "INDEPENDENT_CLUSTER";
      }
      if (!this.colonySecond.workerDeployShow) {
        if (
          this.colonySecond.workerShow === true &&
          this.colonySecond.source == 1
        ) {
          param["RunInstancesForNode.1.NodeRole"] = "MASTER_ETCD";
          for (let i in masterOneListArr) {
            param[
              "RunInstancesForNode.1.RunInstancesPara." + i
            ] = JSON.stringify(this.params[i]);
            if (this.colonySecond.masterDataDiskMount === true) {
              param[
                "RunInstancesForNode.1.InstanceAdvancedSettingsOverrides." +
                  i +
                  ".MountTarget"
              ] = this.colonySecond.masterDataDiskMountVal;
            } else {
              param[
                "RunInstancesForNode.1.InstanceAdvancedSettingsOverrides." +
                  i +
                  ".MountTarget"
              ] = "";
            }

            if (this.colonyThird.containerChecked) {
              param[
                "RunInstancesForNode.0.InstanceAdvancedSettingsOverrides." +
                  i +
                  ".DockerGraphPath"
              ] = this.colonyThird.containerInput;
            } else {
              param[
                "RunInstancesForNode.0.InstanceAdvancedSettingsOverrides." +
                  i +
                  ".DockerGraphPath"
              ] = "";
            }
            param[
              "RunInstancesForNode.1.InstanceAdvancedSettingsOverrides." +
                i +
                ".UserScript"
            ] = "";
            param[
              "RunInstancesForNode.1.InstanceAdvancedSettingsOverrides." +
                i +
                ".Unschedulable"
            ] = 0;
            param[
              "RunInstancesForNode.0.InstanceAdvancedSettingsOverrides." +
                i +
                ".ExtraArgs.Kubelet.0"
            ] = "";
            param[
              "RunInstancesForNode.0.InstanceAdvancedSettingsOverrides." +
                i +
                ".Labels.0.Name"
            ] = "";
            param[
              "RunInstancesForNode.0.InstanceAdvancedSettingsOverrides." +
                i +
                ".Labels.0.Value"
            ] = "";
          }
        }

        param["RunInstancesForNode.0.NodeRole"] = "WORKER";
        for (let i in workerOneListArr) {
          param["RunInstancesForNode.0.RunInstancesPara." + i] = JSON.stringify(
            this.param[i]
          );
          if (this.colonySecond.masterDataDiskMount === true) {
            param[
              "RunInstancesForNode.0.InstanceAdvancedSettingsOverrides." +
                i +
                ".MountTarget"
            ] = this.colonySecond.masterDataDiskMountVal;
          } else {
            param[
              "RunInstancesForNode.0.InstanceAdvancedSettingsOverrides." +
                i +
                ".MountTarget"
            ] = "";
          }
          if (this.colonyThird.containerChecked) {
            param[
              "RunInstancesForNode.0.InstanceAdvancedSettingsOverrides." +
                i +
                ".DockerGraphPath"
            ] = this.colonyThird.containerInput;
          } else {
            param[
              "RunInstancesForNode.0.InstanceAdvancedSettingsOverrides." +
                i +
                ".DockerGraphPath"
            ] = "";
          }

          param[
            "RunInstancesForNode.0.InstanceAdvancedSettingsOverrides." +
              i +
              ".UserScript"
          ] = "";
          param[
            "RunInstancesForNode.0.InstanceAdvancedSettingsOverrides." +
              i +
              ".Unschedulable"
          ] = 0;
          param[
            "RunInstancesForNode.0.InstanceAdvancedSettingsOverrides." +
              i +
              ".ExtraArgs.Kubelet.0"
          ] = "";
          param[
            "RunInstancesForNode.0.InstanceAdvancedSettingsOverrides." +
              i +
              ".Labels.0.Name"
          ] = "";
          param[
            "RunInstancesForNode.0.InstanceAdvancedSettingsOverrides." +
              i +
              ".Labels.0.Value"
          ] = "";
        }
      }

      let ClusterOs = "";
      for (let i in this.colony.OSoptions) {
        if (this.colony.OSvalue === this.colony.OSoptions[i].ImageId) {
          ClusterOs = this.colony.OSoptions[i].OsName;
        }
      }
      param["ClusterBasicSettings.ClusterOs"] = ClusterOs;
      param["ClusterBasicSettings.ClusterVersion"] = this.colony.kuValue;
      param["ClusterBasicSettings.ClusterName"] = this.colony.name;
      param["ClusterBasicSettings.ClusterDescription"] = this.colony.desc;
      param["ClusterBasicSettings.VpcId"] = this.colony.networkValue;
      param["ClusterBasicSettings.ProjectId"] = Number(
        this.colony.projectValue
      );
      if (this.colonyThird.defaultSafeBox === true) {
        param["ClusterBasicSettings.NeedWorkSecurityGroup"] = true;
      } else {
        param["ClusterBasicSettings.NeedWorkSecurityGroup"] = false;
      }
      param["ClusterBasicSettings.OsCustomizeType"] = "GENERAL";
      // param["ClusterBasicSettings.TagSpecification.0.ResourceType"] = "cluster";
      param["ClusterBasicSettings.TagSpecification.0.Tags.0.Key"] = "";
      param["ClusterBasicSettings.TagSpecification.0.Tags.0.Value"] = "";

      if (this.colony.ipvs === true) {
        param["ClusterAdvancedSettings.IPVS"] = true;
      } else {
        param["ClusterAdvancedSettings.IPVS"] = false;
      }
      param["ClusterAdvancedSettings.AsEnabled"] = false;
      param[
        "ClusterAdvancedSettings.ContainerRuntime"
      ] = this.colony.assemblyRadio;
      param["ClusterAdvancedSettings.NodeNameType"] = "lan-ip";
      param["ClusterAdvancedSettings.ExtraArgs.KubeAPIServer.0"] = "";
      param["ClusterAdvancedSettings.ExtraArgs.KubeControllerManager.0"] = "";
      param["ClusterAdvancedSettings.ExtraArgs.KubeScheduler.0"] = "";

      if (!this.colonySecond.workerDeployShow) {
        if (this.colonySecond.masterDataDiskMount === true) {
          param[
            "InstanceAdvancedSettings.MountTarget"
          ] = this.colonySecond.masterDataDiskMountVal;
        } else {
          param["InstanceAdvancedSettings.MountTarget"] = "";
        }
        if (this.colonyThird.containerChecked) {
          param[
            "InstanceAdvancedSettings.DockerGraphPath"
          ] = this.colonyThird.containerInput;
        } else {
          param["InstanceAdvancedSettings.DockerGraphPath"] = "";
        }
        param["InstanceAdvancedSettings.UserScript"] = "";
        param["InstanceAdvancedSettings.Unschedulable"] = 0;
        param["InstanceAdvancedSettings.Labels.0.Name"] = "";
        param["InstanceAdvancedSettings.Labels.0.Value"] = "";
      } else {
        if (this.colonyThird.dataDiskChecked) {
          param[
            "InstanceAdvancedSettings.MountTarget"
          ] = this.colonyThird.dataDiskInput;
        } else {
          param["InstanceAdvancedSettings.MountTarget"] = "";
        }
        if (this.colonyThird.containerChecked) {
          param[
            "InstanceAdvancedSettings.DockerGraphPath"
          ] = this.colonyThird.containerInput;
        } else {
          param["InstanceAdvancedSettings.DockerGraphPath"] = "";
        }
        param["InstanceAdvancedSettings.UserScript"] = "";
        param["InstanceAdvancedSettings.Unschedulable"] = 0;
        param["InstanceAdvancedSettings.Labels.0.Name"] = "";
        param["InstanceAdvancedSettings.Labels.0.Value"] = "";
      }
      if (!this.colonySecond.workerDeployShow) {
        let buyDataArr = [];
        for (let i in workerOneListArr) {
          if (workerOneListArr[i].buyDataDisk === true) {
            buyDataArr.push(workerOneListArr[i]);
            for (let x in buyDataArr) {
              param["InstanceDataDiskMountSettings." + x + ".InstanceType"] =
                workerOneListArr[i].modelName;
              param["InstanceDataDiskMountSettings." + x + ".Zone"] =
                "ap-taipei-1";
              for (let j in workerOneListArr[i].dataDiskArr) {
                param[
                  "InstanceDataDiskMountSettings." +
                    x +
                    ".DataDisks." +
                    j +
                    ".DiskType"
                ] = workerOneListArr[i].dataDiskArr[j].DiskType;
                param[
                  "InstanceDataDiskMountSettings." +
                    x +
                    ".DataDisks." +
                    j +
                    ".DiskSize"
                ] = workerOneListArr[i].dataDiskArr[j].DiskSize;
                param[
                  "InstanceDataDiskMountSettings." +
                    x +
                    ".DataDisks." +
                    j +
                    ".AutoFormatAndMount"
                ] = workerOneListArr[i].dataDiskArr[j].formatMount;
                param[
                  "InstanceDataDiskMountSettings." +
                    x +
                    ".DataDisks." +
                    j +
                    ".FileSystem"
                ] = workerOneListArr[i].dataDiskArr[j].latticeSetVal;
                param[
                  "InstanceDataDiskMountSettings." +
                    x +
                    ".DataDisks." +
                    j +
                    ".MountTarget"
                ] = workerOneListArr[i].dataDiskArr[j].setValue;
              }
            }
          }
        }
      }
      if (
        this.colonySecond.source == 2 &&
        this.colonySecond.master == 1 &&
        this.colonySecond.worker == 1
      ) {
        param["ExistedInstancesForNode.0.NodeRole"] = "WORKER";
        param[
          "ExistedInstancesForNode.0.ExistedInstancesPara.EnhancedService.MonitorService.Enabled"
        ] = true;
        param[
          "ExistedInstancesForNode.0.ExistedInstancesPara.EnhancedService.SecurityService.Enabled"
        ] = true;
        for (let i in this.rightList) {
          param[
            "ExistedInstancesForNode.0.ExistedInstancesPara.InstanceIds." + i
          ] = this.rightList[i].InstanceId;
        }
        // 登录方式
        if (this.colonyThird.loginModeRadio == 1) {
          param[
            "ExistedInstancesForNode.0.ExistedInstancesPara.LoginSettings.KeyIds.0"
          ] = this.colonyThird.sshKeySel;
        }
        if (this.colonyThird.loginModeRadio == 3) {
          param[
            "ExistedInstancesForNode.0.ExistedInstancesPara.LoginSettings.Password"
          ] = this.colonyThird.password;
        }
        param[
          "ExistedInstancesForNode.0.ExistedInstancesPara.SecurityGroupIds.0"
        ] = "";
      }
      if (
        this.colonySecond.source == 2 &&
        this.colonySecond.master == 2 &&
        this.colonySecond.worker == 1
      ) {
        param["ExistedInstancesForNode.0.NodeRole"] = "WORKER";
        param[
          "ExistedInstancesForNode.0.ExistedInstancesPara.EnhancedService.MonitorService.Enabled"
        ] = true;
        param[
          "ExistedInstancesForNode.0.ExistedInstancesPara.EnhancedService.SecurityService.Enabled"
        ] = true;
        for (let i in this.rightList) {
          param[
            "ExistedInstancesForNode.0.ExistedInstancesPara.InstanceIds." + i
          ] = this.rightList[i].InstanceId;
        }
        // 登录方式
        if (this.colonyThird.loginModeRadio == 1) {
          param[
            "ExistedInstancesForNode.0.ExistedInstancesPara.LoginSettings.KeyIds.0"
          ] = this.colonyThird.sshKeySel;
        }
        if (this.colonyThird.loginModeRadio == 3) {
          param[
            "ExistedInstancesForNode.0.ExistedInstancesPara.LoginSettings.Password"
          ] = this.colonyThird.password;
        }
        param["ExistedInstancesForNode.0.SecurityGroupIds.0"] = "";
        param["ExistedInstancesForNode.1.NodeRole"] = "MASTER_ETCD";
        param[
          "ExistedInstancesForNode.1.ExistedInstancesPara.EnhancedService.MonitorService.Enabled"
        ] = true;
        param[
          "ExistedInstancesForNode.1.ExistedInstancesPara.EnhancedService.SecurityService.Enabled"
        ] = true;
        for (let i in this.rightList) {
          param[
            "ExistedInstancesForNode.1.ExistedInstancesPara.InstanceIds." + i
          ] = this.rightList[i].InstanceId;
        }
        // 登录方式
        if (this.colonyThird.loginModeRadio == 1) {
          param[
            "ExistedInstancesForNode.1.ExistedInstancesPara.LoginSettings.KeyIds.0"
          ] = this.colonyThird.sshKeySel;
        }
        if (this.colonyThird.loginModeRadio == 3) {
          param[
            "ExistedInstancesForNode.1.ExistedInstancesPara.LoginSettings.Password"
          ] = this.colonyThird.password;
        }
        param[
          "ExistedInstancesForNode.1.ExistedInstancesPara.SecurityGroupIds.0"
        ] = "";
      }
      if (
        this.colonySecond.source == 2 &&
        this.colonySecond.master == 2 &&
        this.colonySecond.worker == 2
      ) {
        param["ExistedInstancesForNode.0.NodeRole"] = "MASTER_ETCD";
        param[
          "ExistedInstancesForNode.0.ExistedInstancesPara.EnhancedService.MonitorService.Enabled"
        ] = true;
        param[
          "ExistedInstancesForNode.0.ExistedInstancesPara.EnhancedService.SecurityService.Enabled"
        ] = true;
        for (let i in this.rightList) {
          param[
            "ExistedInstancesForNode.0.ExistedInstancesPara.InstanceIds." + i
          ] = this.rightList[i].InstanceId;
        }
        // 登录方式
        if (this.colonyThird.loginModeRadio == 1) {
          param[
            "ExistedInstancesForNode.0.ExistedInstancesPara.LoginSettings.KeyIds.0"
          ] = this.colonyThird.sshKeySel;
        }
        if (this.colonyThird.loginModeRadio == 3) {
          param[
            "ExistedInstancesForNode.0.ExistedInstancesPara.LoginSettings.Password"
          ] = this.colonyThird.password;
        }
        param[
          "ExistedInstancesForNode.0.ExistedInstancesPara.SecurityGroupIds.0"
        ] = "";
      }

      console.log(param);
      this.axios.post(TKE_CREATW_CLUSTERS, param).then(res => {
        if (res.Response.Error === undefined) {
          console.log(res.Response);
          this.$router.go(-1);
        } else {
          let ErrTips = {
            InternalError: "内部錯誤",
            "InternalError.AccountUserNotAuthenticated": "帳戶未通過認證。",
            "InternalError.AsCommon": "伸縮組資源創建報錯。",
            "InternalError.CidrConflictWithOtherCluster":
              "CIDR和其他集群CIDR衝突。",
            "InternalError.CidrConflictWithOtherRoute": "CIDR和其他路由衝突。",
            "InternalError.CidrConflictWithVpcCidr": "CIDR和vpc衝突。",
            "InternalError.CidrConflictWithVpcGlobalRoute":
              "CIDR和全局路由衝突。",
            "InternalError.CidrInvali": "CIDR無效。",
            "InternalError.CidrMaskSizeOutOfRange": "CIDR掩碼無效。",
            "InternalError.CreateMasterFailed": "創建集群失敗。",
            "InternalError.CvmCommon": "cvm配額不足,請釋放部分資源後再創建",
            "InternalError.Db": "db錯誤。",
            "InternalError.DbAffectivedRows": "DB錯誤",
            "InternalError.DfwGetUSGCount": "獲得當前安全組總數失敗。",
            "InternalError.DfwGetUSGQuota": "獲得安全組配額失敗。",
            "InternalError.InitMasterFailed": "初始化master失敗。",
            "InternalError.InvalidPrivateNetworkCidr": "無效CIDR。",
            "InternalError.Param": "Param。",
            "InternalError.PublicClusterOpNotSupport": "集群不支持當前操作。",
            "InternalError.QuotaMaxClsLimit": "超過配額限制。",
            "InternalError.QuotaMaxNodLimit": "超過配額限制。",
            "InternalError.QuotaUSGLimit": "安全組配額不足。",
            "InternalError.UnexceptedInternal": "内部錯誤",
            "InternalError.VpcCommon": "VPC報錯。",
            "InternalError.VpcRecodrNotFound": "未發現vpc記錄。",
            InvalidParameter: "參數錯誤",
            LimitExceeded: "超過配額限制"
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
    }
  }
};
</script>

<style lang="scss" scoped>
// 第一步
.how-choose {
  padding: 8px;
  h3 {
    font-size: 14px;
    margin-bottom: 10px;
    font-weight: 700;
    color: #000;
  }
  p {
    font-size: 12px;
    color: #000;
  }
  ul {
    li {
      margin-bottom: 8px;
      font-size: 12px;
      color: #000;
      display: flex;
      align-items: center;
      span {
        display: inline-block;
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: #000;
        margin-right: 4px;
      }
    }
  }
  .hover-target {
    margin-top: 24px;
    text-align: right;
    a {
      color: #006eff;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}
.cid-tips {
  margin-top: 8px;
  color: #e54545;
  font-size: 12px;
  line-height: 30px;
  span {
    margin-left: 6px;
    color: #000;
    font-size: 12px;
    i {
      margin-left: 18px;
      color: #888;
      font-size: 14px;
    }
  }
}

.tke-formpanel-footer {
  display: flex;
  ::v-deep .el-button--primary {
    margin-left: 10px;
    background: #006eff;
    border-color: #006eff;
  }
  ::v-deep .el-button.is-disabled {
    height: 37px;
    margin-left: 10px;
  }
  .footer-tips {
    display: inline-block;
    padding: 10px 30px 10px 20px;
    margin-left: 20px;
    color: #b43537;
    font-size: 12px;
    background-color: #fcecec;
    border: 1px solid #f6b5b5;
    border-radius: 2px;
  }
}

.cidr-color {
  ::v-deep .el-input__inner {
    color: #e1504a;
    border-color: #e1504a;
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
    border-radius: 0;
  }
  ::v-deep .el-radio-button__inner {
    border-radius: 0;
  }
  ::v-deep .el-radio-button__orig-radio:checked + .el-radio-button__inner {
    color: #006eff;
    background: #fff;
    border-color: #006eff;
  }
  .el-icon-warning-outline {
    margin-left: 5px;
    color: #e1504a;
    font-size: 16px;
    font-weight: 600;
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
    margin-bottom: 11px;
    color: #000;
    font-size: 14px;
    font-weight: 700;
  }
  ::v-deep .el-form-item__label {
    color: #888;
    font-size: 12px;
    line-height: 40px;
    width: 130px !important;
  }
  ::v-deep .el-form-item__content {
    overflow: hidden;
    color: #444;
    font-size: 12px;
    line-height: 40px;
  }
  ::v-deep .el-form-item {
    margin-bottom: 0;
  }
  .tke-second-tips {
    overflow: hidden;
    padding-bottom: 20px;
    margin-bottom: 20px;
    border-bottom: 1px solid rgb(221, 221, 221);
    & > p {
      float: left;
      &:nth-of-type(1) {
        width: 130px;
        padding: 6px 20px 0 0;
        color: #888;
        font-size: 12px;
        line-height: 18px;
        & > i {
          font-size: 14px; // margin-top: 2px;
        }
      }
      &:nth-of-type(2) {
        line-height: 24px;
      }
    }
  }
  .tke-second-radio-btn {
    padding-bottom: 16px;
    margin-top: -6px;
    ::v-deep .el-radio-button {
      width: 90px;
      height: 30px;
      border-radius: 0;
    }
    ::v-deep .el-radio-button__inner {
      width: 90px;
      height: 30px;
      padding: 0;
      font-size: 12px;
      line-height: 30px;
      border-radius: 0;
    }
    ::v-deep .el-radio-button__orig-radio:checked + .el-radio-button__inner {
      color: #006eff;
      font-size: 12px;
      background: #fff;
      box-shadow: unset;
      border: 1px solid #006eff;
    }
    & > p {
      margin-top: 8px;
      color: #888;
      font-size: 12px;
      line-height: 14px;
      vertical-align: middle;
      a {
        color: #006eff;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
  .tke-second-radio-time {
    padding-bottom: 10px;
    ::v-deep .el-form-item__label {
      line-height: 30px;
    }
    .tke-second-radio-btn {
      padding: 0;
      margin: 0;
      line-height: 30px;
      ::v-deep .el-radio-button {
        width: unset;
      }
      ::v-deep .el-radio-button__inner {
        width: unset;
        padding: 0 20px;
      }
      ::v-deep .el-radio-button__orig-radio:checked + .el-radio-button__inner {
        width: unset;
        padding: 0 20px;
      }
    }
  }
  .tke-second-checkbox {
    ::v-deep .el-checkbox__input.is-checked .el-checkbox__inner {
      width: 16px;
      height: 16px;
      background: #006eff;
      border-color: #006eff;
    }
    ::v-deep .el-checkbox__label {
      padding-left: 6px;
      color: #000;
      font-size: 12px;
    }
    ::v-deep .el-checkbox__inner {
      width: 16px;
      height: 16px;
    }
    ::v-deep .el-checkbox__inner::after {
      left: 5px;
      height: 9px;
    }
    ::v-deep .el-checkbox__input.is-checked + .el-checkbox__label {
      padding-left: 6px;
      color: #444;
      font-size: 12px;
    }
    ::v-deep .el-input {
      top: -8px;
      width: 88%;
      line-height: 30px;
    }
    ::v-deep .el-input__inner {
      width: 200px;
      height: 30px;
      border-radius: 0;
    }
    ::v-deep .el-checkbox {
      line-height: 30px;
    }
  }
  .tke-second-icon-btn {
    padding: 0;
    margin: 0;
    a {
      position: relative;
      top: 6px;
      margin-left: 10px;
      color: #006eff;
      font-size: 12px;
      &:hover {
        text-decoration: underline;
      }
    }
  }
  .tke-second-worker {
    overflow: hidden;
    .tke-second-worker-l {
      float: left;
      width: 130px;
      padding-top: 6px;
      color: #888;
      font-size: 12px;
    }
    .tke-second-worker-r {
      float: left;
      width: 88%;
      .tke-second-worker-array {
        box-sizing: border-box;
        width: 100%;
        padding: 20px;
        margin-top: 4px;
        margin-right: auto;
        margin-bottom: 10px;
        margin-left: auto;
        background-color: #fff;
        box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);

        -webkit-box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
        -webkit-box-sizing: border-box;
        & > p {
          text-align: right;
          span {
            margin-left: 10px;
            color: #006eff;
            font-size: 12px;
            cursor: pointer;
          }
        }
        .delete-color {
          color: #bbb;
          cursor: not-allowed;
        }
        & > ol {
          li {
            font-size: 12px;
            line-height: 24px;
            & > span {
              &:nth-of-type(1) {
                display: inline-block;
                width: 120px;
                color: #888;
                text-align: left;
              }
              &:nth-of-type(2) {
                color: #444;
              }
            }
          }
        }
      }
      ul {
        width: 100%;
        padding: 10px;
        background: #f2f2f2;
        & > li {
          overflow: hidden;
          & > p {
            float: left;
            width: 100px;
            padding: 6px 20px 6px 0;
            color: #888;
            font-size: 12px;
          }
          .tke-second-worker-text {
            overflow: hidden;
            width: 88%;
            padding: 6px 24px 16px 0;
            color: #444;
            font-size: 12px;
            span {
              float: left;
            }
            .tke-second-worker-icon-pen {
              float: left;
              margin-left: 4px;
            }
          }
          .tke-second-worker-model-box {
            position: fixed;
            top: 0;
            left: 0;
            z-index: 1200;
            overflow: auto;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            .tke-second-worker-model {
              width: 90%;
              padding: 25px;
              margin-left: 5%;
              background: #fff;
              & > p {
                overflow: hidden;
                margin-bottom: 24px;
                span {
                  float: left;
                  font-size: 14px;
                  font-weight: 700;
                  line-height: 26px;
                }
                i {
                  float: right;
                  display: inline-block;
                  width: 26px;
                  height: 26px;
                  font-size: 20px;
                  line-height: 26px;
                  text-align: center;
                  cursor: pointer;
                  &:active {
                    background-color: rgba(0, 0, 0, 0.05);
                  }
                }
              }
              .model-bg {
                padding: 20px;
                background-color: rgb(242, 242, 242);
                box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
              }
              .model-btn {
                margin-top: 30px;
                text-align: center;
                ::v-deep .el-button {
                  width: 56px;
                  height: 30px;
                  padding: 0;
                  font-size: 12px;
                  border-radius: 0;
                }
                .determine {
                  color: #fff;
                  background-color: #006eff;
                  border: 1px solid #006eff;
                }
                .cancel {
                  color: #000;
                  background-color: #fff;
                  border-color: #ddd;
                }
              }
            }
          }
          & > div {
            float: left;
            padding-bottom: 16px;
            ::v-deep .el-radio-button {
              width: 90px;
              height: 30px;
              border-radius: 0;
            }
            ::v-deep .el-radio-button__inner {
              width: 90px;
              height: 30px;
              padding: 0;
              font-size: 12px;
              line-height: 30px;
              border-radius: 0;
            }
            ::v-deep
              .el-radio-button__orig-radio:checked
              + .el-radio-button__inner {
              color: #006eff;
              font-size: 12px;
              background: #fff;
              box-shadow: unset;
              border: 1px solid #006eff;
            }
            ::v-deep .el-input {
              height: 30px;
            }
            ::v-deep .el-input__inner {
              height: 30px;
              border-radius: 0;
            }
            ::v-deep .el-select {
              &:nth-of-type(2) {
                margin-left: 10px;
              }
            }
            ::v-deep .el-input-number__decrease {
              height: 28px;
              line-height: 28px;
              border-radius: 0;
            }
            ::v-deep .el-input-number__increase {
              height: 28px;
              line-height: 28px;
              border-radius: 0;
            }
            ::v-deep .el-input-number {
              line-height: unset;
            }
          }
          .tke-second-worker-select {
            & > span {
              margin-left: 5px;
              color: #000;
              font-size: 12px;
            }
            & > p {
              margin-top: 8px;
              color: #888;
              font-size: 12px;
              vertical-align: middle;
              & > a {
                color: #006eff;
                &:hover {
                  text-decoration: underline;
                }
              }
            }
          }
          .tke-second-worker-data {
            padding-bottom: 0;
            & > p {
              margin-top: 8px;
              color: #888;
              font-size: 12px;
              vertical-align: middle;
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
              padding: 0;
              margin-top: 16px;
              line-height: 30px;
              border-radius: 0;
            }
            .worker-determine-btn {
              color: #fff;
              background-color: #006eff;
              border: 1px solid #006eff;
            }
            .worker-cancel-btn {
              color: #000;
              background-color: #fff;
              border-color: #ddd;
            }
            .worker-cancel-btn-dis {
              color: #bbb;
              background-color: #fff;
              border-color: #ddd;
            }
          }
        }
      }
      .tke-second-worker-add-models {
        margin-top: 10px;
        margin-bottom: 16px;
        font-size: 12px;
        text-align: center;
        background: #fff;
        border: 1px dashed #ddd;
        ::v-deep .el-button {
          height: 48px;
          padding: 0;
          color: #006eff;
          line-height: 50px;
          border: 0;
          &:active {
            background: #fff;
          }
          &:hover {
            color: #006eff;
            text-decoration: underline;
            background: #fff;
          }
          &:focus {
            background: #fff;
          }
        }
      }
      .bg {
        padding: 10px;
        background-color: rgb(240, 240, 240);
        .el-delete {
          color: #006eff;
          font-size: 12px;
          cursor: pointer;
          &:hover {
            text-decoration: underline;
          }
        }
        .flex {
          display: flex;
          .left-box {
            color: #000;
            font-size: 12px;
            font-weight: 700;
            line-height: 30px;
            .search {
              ::v-deep .el-input__inner {
                height: 30px;
                padding: 0;
                line-height: 30px;
              }
              ::v-deep .el-select {
                width: 80px;
              }
            }
          }
          .center-box {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            height: 290px;
            margin: 0 5px;
          }
          .right-box {
            color: #000;
            font-size: 12px;
            font-weight: 700;
            line-height: 30px;
          }
          ::v-deep .el-table {
            border: 1px solid rgb(221, 221, 221);
          }
        }
      }
      .tips {
        box-sizing: border-box;
        width: 100%;
        padding: 10px 20px;
        margin-top: 16px;
        color: #b43537;
        line-height: 20px;
        background: #fcecec;
        border: 1px solid #f6b5b5;
      }
    }
  }
  .tke-second-cost {
    .tke-second-cost-num {
      color: #ff7800;
      font-size: 14px;
      font-weight: 400;
    }
    i {
      margin: 0 10px;
      font-style: normal;
    }
    .tke-second-cost-h {
      color: #444;
      font-size: 12px;
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
  .tke-second-cost-query {
    color: #ff7800;
    font-size: 18px;
  }
}

// 第三步
.tke-third-box {
  ::v-deep .el-checkbox__label {
    padding-left: 6px;
    color: #000;
    font-size: 12px;
  }
  ::v-deep .el-checkbox__inner {
    width: 16px;
    height: 16px;
  }
  ::v-deep .el-checkbox__input.is-checked .el-checkbox__inner {
    width: 16px;
    height: 16px;
    background: #006eff;
    border-color: #006eff;
  }
  ::v-deep .el-checkbox__inner::after {
    left: 5px;
    height: 9px;
  }
  ::v-deep .el-checkbox__input.is-checked + .el-checkbox__label {
    padding-left: 6px;
    color: #444;
    font-size: 12px;
  }
  ::v-deep .el-input {
    top: -8px;
    width: 88%;
    line-height: 30px;
  }
  ::v-deep .el-input__inner {
    width: 200px;
    height: 30px;
    border-radius: 0;
  }
  ::v-deep .el-checkbox {
    line-height: 30px;
  }
  .password {
    ::v-deep .el-input {
      top: 0;
      width: 200px;
    }
    p {
      padding-bottom: 14px;
      margin-top: 4px;
      color: #888;
      font-size: 12px;
      line-height: 14px;
      vertical-align: middle;
    }
  }
  .tke-third-tips {
    overflow: hidden;
    padding-bottom: 16px;
    & > p {
      float: left;
      width: 120px;
      padding: 6px 20px 0 0;
      color: #888;
      font-size: 12px;
      line-height: 30px;
      & > i {
        font-size: 14px;
      }
    }
    ::v-deep .el-input {
      top: 0;
      line-height: 36px;
    }
    & > div {
      float: left;
      & > p {
        color: #888;
        font-size: 12px;
        line-height: 22px;
        & > a {
          color: #006eff;
          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
    .input-box {
      ::v-deep .el-input {
        width: auto;
      }
      i {
        margin-left: 6px;
        font-size: 16px;
      }
    }
  }
  .tke-third-radio-btn {
    padding-bottom: 0;
    margin-top: 0;
  }
  .tke-third-select {
    ::v-deep .el-input {
      top: 0;
    }
    ::v-deep .el-input__suffix {
      top: -2px;
      right: -14px;
    }
    & > p {
      color: #888;
      font-size: 12px;
      line-height: 22px;
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
      margin-top: -3px;
      color: #888;
      font-size: 12px;
      line-height: 14px;
      & > a {
        color: #006eff;
        &:hover {
          text-decoration: underline;
        }
      }
    }
    .checkbox-tips {
      margin-bottom: 8px;
      color: #ff9d00;
    }
  }
}

.tke-fourth-box {
  .tke-fourth-node {
    padding-bottom: 40px;
    margin-bottom: 20px;
    border-bottom: 1px solid rgb(221, 221, 221);
    p {
      line-height: 20px;
      &:nth-of-type(1) {
        margin-top: 10px;
      }
    }
  }
  .tke-fourth-node-text {
    margin-bottom: 40px;
    border-bottom: 1px solid rgb(221, 221, 221);
    padding-bottom: 20px;
    ::v-deep .el-form-item__content {
      display: flex;
    }
  }
}

.tke-second-worker-popover-disk {
  padding: 6px;
  span {
    position: relative;
    top: 1px;
    left: -1px;
    display: inline-block;
    height: 30px;
    padding: 0 10px;
    color: #444;
    font-size: 12px;
    line-height: 30px;
    background-color: #f2f2f2;
    border: 1px solid #ddd;
    border-radius: 0;
  }
  & > div {
    & > p {
      margin-top: 8px;
      color: #888;
      font-size: 12px;
      vertical-align: middle;
    }
  }
  ::v-deep .el-select {
    margin-right: 10px;
  }
  ::v-deep .el-input__inner {
    width: 200px;
    height: 30px;
    font-size: 12px;
    border-radius: 0;
  }
  ::v-deep .el-input-number__decrease {
    top: 4px;
    left: 0;
    width: 30px;
    height: 30px;
    color: #bbb;
    line-height: 30px;
    background-color: #f2f2f2;
    border: 1px solid #ddd;
    border-radius: 0;
  }
  ::v-deep .el-input-number__increase {
    top: 4px;
    right: 0;
    width: 30px;
    height: 30px;
    color: #bbb;
    line-height: 30px;
    background-color: #f2f2f2;
    border: 1px solid #ddd;
    border-radius: 0;
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
      padding: 0;
      color: #006eff;
      border: 0;
      &:hover {
        color: #006eff;
        text-decoration: underline;
        background: #fff;
      }
    }
  }
  .tke-second-worker-popover-data-bg {
    display: flex;
    padding: 0 20px;
    & > div {
      display: flex;
      width: 99%;
    }
    .box {
      overflow: hidden;
      width: 99%;
      padding: 10px;
      margin-top: 10px;
      background-color: #f2f2f2;
      & > p {
        float: left;
        width: 120px;
        padding-top: 6px;
        color: #888;
        font-size: 12px;
      }
      & > div {
        float: left;
        & > p {
          margin-top: 4px;
          color: #888;
          font-size: 12px;
          vertical-align: middle;
        }
      }
      .input-number {
        width: 130px;
        ::v-deep .el-input {
          width: 250px;
        }
        ::v-deep .el-input__inner {
          padding: 0px;
        }
      }
    }
    .format-and-mount {
      margin-left: 10px;
      ::v-deep .el-checkbox__input.is-checked .el-checkbox__inner {
        width: 16px;
        height: 16px;
        background: #006eff;
        border-color: #006eff;
      }
      ::v-deep .el-checkbox__label {
        padding-left: 6px;
        color: #000;
        font-size: 12px;
      }
      ::v-deep .el-checkbox__inner {
        width: 16px;
        height: 16px;
      }
      ::v-deep .el-checkbox__inner::after {
        left: 5px;
        height: 9px;
      }
      ::v-deep .el-checkbox__input.is-checked + .el-checkbox__label {
        padding-left: 6px;
        color: #444;
        font-size: 12px;
      }
      ::v-deep .el-input {
        top: -8px;
        width: 88%;
        line-height: 30px;
      }
      ::v-deep .el-input__inner {
        width: 200px;
        height: 30px;
        border-radius: 0;
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
  padding: 0 !important;
  .format-and-mount {
    margin-top: 16px;
    margin-left: 0 !important;
    a {
      color: #006eff;
      &:hover {
        color: #006eff;
        text-decoration: underline;
      }
    }
  }
}
.text-orange {
  color: #ff7800;
  font-size: 14px;
  font-weight: 600;
}
// 计费模式 提示
.charging-mode {
  & > div {
    display: flex;
    justify-content: space-between;
    &:nth-of-type(1) {
      margin-bottom: 10px;
    }
    span {
      color: #000;
      font-size: 12px;
      font-weight: 700;
    }
    p {
      width: 82%;
      color: #000;
      font-size: 12px;
    }
  }
}
// Worker 配置 表格
.table-row {
  display: flex;
  align-items: center;
  div {
    & > p {
      &:nth-of-type(1) {
        color: #404a58;
        font-size: 12px;
      }
      &:nth-of-type(2) {
        color: #ababab;
        font-size: 12px;
      }
    }
  }
  i {
    font-size: 18px;
    color: #838383;
  }
}
// 输入框条件样式
.cluster-wran {
  ::v-deep .el-input__inner {
    border: 1px solid #e1504a;
  }
}
</style>

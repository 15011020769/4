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
        <div
          class="tke-step-item"
          :class="{ 'is-curr': secondBox || thirdBox || fourthBox }"
        >
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
      <!-- 第一步 -->
      <div v-if="firstBox">
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
                :class="{ 'cluster-wran': colony.nameWran }"
                @blur="ClusterNameBlur"
                @focus="ClusterNameFocus"
                placeholder="请输入集群名称，不超过60个字符"
              ></el-input>
              <i class="el-icon-warning-outline" v-if="colony.nameWran"></i>
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
        <div class="tke-second-title">已选配置</div>
        <el-form
          ref="form"
          :model="colonySecond"
          label-width="120px"
          label-position="left"
        >
          <el-form-item label="集群名">
            <p>{{ dispose.name }}</p>
          </el-form-item>
          <el-form-item label="Kubernetes版本">
            <p>{{ dispose.kuValue }}</p>
          </el-form-item>
          <el-form-item label="所在地域">
            <p>{{ dispose.cityRadio }}</p>
          </el-form-item>
          <el-form-item label="容器网络">
            <p>{{ dispose.container }}</p>
          </el-form-item>
          <div class="tke-second-tips">
            <p>操作系统<i class="el-icon-info"></i></p>
            <p>
              Ubuntu Server 18.04.1 LTS 64bit TKE-Optimized
            </p>
          </div>
          <el-form-item label="节点来源">
            <div class="tke-second-radio-btn">
              <el-radio-group v-model="colonySecond.source">
                <el-radio-button label="1">新增节点</el-radio-button>
                <el-radio-button label="2">已有节点</el-radio-button>
              </el-radio-group>
            </div>
          </el-form-item>
          <el-form-item label="Master 节点">
            <div class="tke-second-radio-btn">
              <el-radio-group
                v-model="colonySecond.master"
                @change="SecondMaster"
              >
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
          <el-form-item label="Worker 节点" v-if="colonySecond.workerShow">
            <div class="tke-second-radio-btn">
              <el-radio-group v-model="colonySecond.worker">
                <el-radio-button label="1">立即部署</el-radio-button>
                <el-radio-button label="2">暂不部署</el-radio-button>
              </el-radio-group>
            </div>
          </el-form-item>
          <div class="tke-second-tips" style="border: 0px;margin:0px;">
            <p>计费模式<i class="el-icon-info"></i></p>
            <div class="tke-second-radio-btn tke-second-icon-btn">
              <el-radio-group
                v-model="colonySecond.charging"
                @change="SecondCharging"
              >
                <el-radio-button label="1">按量计费</el-radio-button>
                <el-radio-button label="2">包年包月</el-radio-button>
              </el-radio-group>
              <a href="#">详细对比</a>
            </div>
          </div>
          <el-form-item
            label="购买时长"
            v-if="colonySecond.chargingShow"
            class="tke-second-radio-time"
          >
            <div class="tke-second-radio-btn">
              <el-radio-group v-model="colonySecond.buyTime">
                <el-radio-button label="1">1个月</el-radio-button>
                <el-radio-button label="2">2个月</el-radio-button>
                <el-radio-button label="3">3个月</el-radio-button>
                <el-radio-button label="4">6个月</el-radio-button>
                <el-radio-button label="5">1年</el-radio-button>
                <el-radio-button label="6">2年</el-radio-button>
                <el-radio-button label="7">3年</el-radio-button>
              </el-radio-group>
            </div>
          </el-form-item>
          <el-form-item label="自动续费" v-if="colonySecond.chargingShow">
            <div class="tke-second-checkbox">
              <el-checkbox v-model="colonySecond.renew"
                >账户余额足够时，设备到期后按月自动续费</el-checkbox
              >
            </div>
          </el-form-item>
          <div class="tke-second-worker">
            <p class="tke-second-worker-l">Worker 配置</p>
            <div class="tke-second-worker-r">
              <div class="tke-second-worker-array">
                <p>
                  <span>编辑</span>
                  <span>删除</span>
                </p>
                <ol>
                  <li>
                    <span>可用区</span>
                    <span>台北一区</span>
                  </li>
                  <li>
                    <span>节点网络</span>
                    <span>10.19.2.0</span>
                  </li>
                  <li>
                    <span>配置</span>
                    <span>S3.LARGE8(标准型S3,4核8GB)</span>
                  </li>
                  <li>
                    <span>系统盘</span>
                    <span>SSD云硬盘 50GB</span>
                  </li>
                  <li>
                    <span>数据盘</span>
                    <span>暂不购买</span>
                  </li>
                  <li>
                    <span>公网带宽</span>
                    <span>按带宽计费 1Mbps</span>
                  </li>
                  <li>
                    <span>数量</span>
                    <span>1 台</span>
                  </li>
                </ol>
              </div>
              <ul>
                <li>
                  <p>可用区<i class="el-icon-info"></i></p>
                  <div>
                    <el-radio-group v-model="colonySecond.usableArea">
                      <el-radio-button label="1">台北一区</el-radio-button>
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
                    <i
                      class="el-icon-edit"
                      @click="colonySecond.modelShow = true"
                    ></i>
                  </p>
                  <div
                    class="tke-second-worker-model-box"
                    v-if="colonySecond.modelShow"
                  >
                    <div class="tke-second-worker-model">
                      <p>
                        <span>选择机型</span
                        ><i
                          class="el-icon-close"
                          @click="colonySecond.modelShow = false"
                        ></i>
                      </p>
                      <div class="model-bg">
                        <div>
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
                        </div>
                        <div style="margin-top:16px;">
                          <el-radio-group v-model="colonySecond.buyTime">
                            <el-radio-button label="1"
                              >全部实例族</el-radio-button
                            >
                            <el-radio-button label="2">标准型</el-radio-button>
                            <el-radio-button label="3">内存型</el-radio-button>
                            <el-radio-button label="4">计算型</el-radio-button>
                          </el-radio-group>
                        </div>
                        <div style="margin-top:16px;">
                          <el-radio-group v-model="colonySecond.buyTime">
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
                            :data="colonySecond.tableData"
                            highlight-current-row
                            @current-change="handleCurrentChange"
                            style="width: 100%"
                          >
                            <el-table-column width="50">
                              <template slot-scope="scope">
                                <el-radio v-model="radio1" :label="scope.row"
                                  ><i></i
                                ></el-radio>
                              </template>
                            </el-table-column>
                            <el-table-column property="date" label="机型">
                            </el-table-column>
                            <el-table-column property="name" label="规则">
                            </el-table-column>
                            <el-table-column property="address" label="CPU">
                            </el-table-column>
                            <el-table-column property="address" label="内存">
                            </el-table-column>
                            <el-table-column
                              property="address"
                              label="配置费用"
                            >
                            </el-table-column>
                          </el-table>
                        </div>
                      </div>
                      <div class="model-btn">
                        <el-button class="determine">确定</el-button>
                        <el-button
                          class="cancel"
                          @click="colonySecond.modelShow = false"
                          >取消</el-button
                        >
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  <p>系统盘</p>
                  <div class="tke-second-worker-text">
                    <span
                      >{{ colonySecond.systemDiskValue }}
                      {{ colonySecond.systemDiskNumber }}GB</span
                    >
                    <div class="tke-second-worker-icon-pen">
                      <el-popover
                        placement="bottom"
                        width="450"
                        trigger="click"
                        v-model="colonySecond.systemDiskShow"
                      >
                        <i class="el-icon-edit" slot="reference"></i>
                        <div class="tke-second-worker-popover-disk">
                          <div>
                            <el-select
                              v-model="colonySecond.systemDiskVal"
                              placeholder="请选择"
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
                            <p>范围：50~500，步长：1</p>
                            <div class="btn">
                              <el-button @click="SystemDiskSure"
                                >确定</el-button
                              >
                              <el-button
                                @click="colonySecond.systemDiskShow = false"
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
                  <p>数据盘</p>
                  <div class="tke-second-worker-text">
                    <span>{{ colonySecond.dataDiskValue }}</span>
                    <div class="tke-second-worker-icon-pen">
                      <el-popover
                        placement="bottom"
                        :width="colonySecond.buyDataWidth"
                        trigger="click"
                        v-model="colonySecond.dataDiskShow"
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
                              v-model="colonySecond.buyDataDisk"
                              @change="BuyDataDisk"
                              >购买数据盘</el-checkbox
                            >
                          </div>
                          <div
                            class="tke-second-worker-popover-data-bg"
                            v-if="colonySecond.buyDataDisk"
                          >
                            <div>
                              <p>云盘设置</p>
                              <div>
                                <el-select
                                  v-model="colonySecond.dataDiskVal"
                                  placeholder="请选择"
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
                                  v-model="colonySecond.dataDiskNum"
                                  :min="10"
                                  :max="16000"
                                ></el-input-number>
                                <span>GB</span>
                                <el-checkbox
                                  v-model="colonySecond.formatMount"
                                  class="format-and-mount"
                                  >格式化并挂载</el-checkbox
                                >
                                <p>范围：10~16000，步长：10</p>
                              </div>
                              <p
                                style="margin-top:16px;"
                                v-if="colonySecond.formatMount"
                              >
                                格式化设置
                              </p>
                              <div
                                style="margin-top:16px;"
                                v-if="colonySecond.formatMount"
                              >
                                <el-select
                                  v-model="colonySecond.dataDiskVal"
                                  placeholder="请选择"
                                >
                                  <el-option
                                    v-for="item in colonySecond.dataDiskOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                  >
                                  </el-option>
                                </el-select>
                                <el-input v-model="value"></el-input>
                              </div>
                            </div>
                          </div>
                          <div
                            class="add-data-disk"
                            v-if="colonySecond.buyDataDisk"
                          >
                            添加数据盘
                          </div>
                          <div class="btn">
                            <el-button @click="DataDiskSure">确定</el-button>
                            <el-button
                              @click="colonySecond.dataDiskShow = false"
                              >取消</el-button
                            >
                          </div>
                        </div>
                      </el-popover>
                    </div>
                  </div>
                </li>
                <li>
                  <p>公网带宽</p>
                  <div class="tke-second-worker-text">
                    <span>按带宽计费 1Mbps</span>
                    <div class="tke-second-worker-icon-pen">
                      <el-popover
                        placement="bottom"
                        width="450"
                        trigger="click"
                        v-model="colonySecond.broadbandShow"
                      >
                        <i class="el-icon-edit" slot="reference"></i>
                        <div class="tke-second-worker-popover-disk">
                          <div>
                            <el-select
                              v-model="colonySecond.broadbandVal"
                              placeholder="请选择"
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
                              :min="50"
                              :max="500"
                            ></el-input-number>
                            <span>Mbps</span>
                            <p>带宽上限：0~100</p>
                            <div
                              class="tke-second-worker-popover-data-bg distribution"
                            >
                              <el-checkbox
                                v-model="colonySecond.formatMount"
                                class="format-and-mount"
                                >分配免费公网IP，<a href="#"
                                  >查看详情</a
                                ></el-checkbox
                              >
                            </div>
                            <div class="btn">
                              <el-button @click="SystemDiskSure"
                                >确定</el-button
                              >
                              <el-button
                                @click="colonySecond.broadbandShow = false"
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
                  <p>数据</p>
                  <div class="tke-second-worker-data">
                    <el-input-number
                      v-model="num"
                      :min="1"
                      :max="10"
                    ></el-input-number>
                    <p v-if="!colonySecond.chargingShow">
                      CVM配额:您当前云服务器个数配额为0/0，您最多可购买0台，
                      您可以通过<a href="#">提交工单</a>申请提升配额。
                    </p>
                    <p v-if="colonySecond.chargingShow">
                      CVM配额:当前账号最大可购买100台
                    </p>
                    <el-row>
                      <el-button class="worker-determine-btn">确定</el-button>
                      <el-button class="worker-cancel-btn-dis">取消</el-button>
                      <el-button class="worker-cancel-btn" style="display:none;"
                        >取消</el-button
                      >
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
          <el-button size="small" @click="secondPrev">上一步</el-button>
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
          ref="form"
          :model="colonyThird"
          label-width="120px"
          label-position="left"
        >
          <el-form-item label="集群名">
            <p>{{ dispose.name }}</p>
          </el-form-item>
          <el-form-item label="Kubernetes版本">
            <p>{{ dispose.kuValue }}</p>
          </el-form-item>
          <el-form-item label="所在地域">
            <p>{{ dispose.cityRadio }}</p>
          </el-form-item>
          <el-form-item label="容器网络">
            <p>{{ dispose.container }}</p>
          </el-form-item>
          <div class="tke-second-tips">
            <p>操作系统<i class="el-icon-info"></i></p>
            <p>
              Ubuntu Server 18.04.1 LTS 64bit TKE-Optimized
            </p>
          </div>
          <el-form-item label="容器目录">
            <el-checkbox v-model="colonyThird.containerChecked"
              >设置容器和镜像存储目录，建议存储到数据盘</el-checkbox
            >
            <el-input
              v-model="colonyThird.containerInput"
              placeholder="请输入内容"
              v-if="colonyThird.containerChecked"
            ></el-input>
          </el-form-item>
          <div class="tke-third-tips">
            <p>安全组<i class="el-icon-info"></i></p>
            <div>
              <el-input value="新建并绑定默认安全组" disabled></el-input>
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
              <el-radio-group
                v-model="colonyThird.loginModeRadio"
                @change="LoginMode"
              >
                <el-radio-button label="1">立即关联密钥</el-radio-button>
                <el-radio-button label="2">自动生成密码</el-radio-button>
                <el-radio-button label="3">设置密码</el-radio-button>
              </el-radio-group>
              <p v-if="colonyThird.two">
                注：创建后，自动生成的密码将通过站内信发送给您。也可登录CVM控制台重置密码。
              </p>
            </div>
          </el-form-item>
          <el-form-item
            label="用户名"
            v-if="colonyThird.one || colonyThird.three"
          >
            <p>名字</p>
          </el-form-item>
          <el-form-item label="SSH密钥" v-if="colonyThird.one">
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
          <el-form-item label="密码" v-if="colonyThird.three" class="password">
            <el-input
              placeholder="请输入主机密码"
              v-model="colonyThird.password"
              show-password
            ></el-input>
            <p>
              linux机器密码需8到16位，至少包括两项（[a-z,A-Z] ,
              [0-9]和[()`~!@#$%^&}*-+=|{}[]:;',.?/]的特殊符号）
            </p>
          </el-form-item>
          <el-form-item
            label="确认密码"
            v-if="colonyThird.three"
            class="password"
          >
            <el-input
              placeholder="请输入主机密码"
              v-model="colonyThird.confirmPassword"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item label="安全加固">
            <div class="tke-third-checkbox" style="padding-bottom:10px;">
              <el-checkbox v-model="colonyThird.safetyChecked"
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
              <el-checkbox v-model="colonyThird.cloudwatchChecked"
                >免费开通</el-checkbox
              >
              <p class="checkbox-tips" v-if="!colonyThird.cloudwatchChecked">
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
        <div class="tke-second-title">已选配置</div>
        <el-form ref="form" label-width="120px" label-position="left">
          <el-form-item label="集群名">
            <p>{{ dispose.name }}</p>
          </el-form-item>
          <el-form-item label="Kubernetes版本">
            <p>{{ dispose.kuValue }}</p>
          </el-form-item>
          <el-form-item label="所在地域">
            <p>{{ dispose.cityRadio }}</p>
          </el-form-item>
          <el-form-item label="容器网络">
            <p>{{ dispose.container }}</p>
          </el-form-item>
          <el-form-item label="操作系统">
            Ubuntu Server 18.04.1 LTS 64bit TKE-Optimized
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
          <el-button size="small" @click="fourthPrev">上一步</el-button>
          <el-button size="small" type="primary">完成</el-button>
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
import { ALL_CITY } from "@/constants";
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
            value: "a",
            label: "默认项目"
          },
          {
            value: "b",
            label: "测试项目"
          }
        ],
        projectValue: "a",
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
        cityRadio: "tb",
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
        // 容器目录
        containerChecked: false,
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
      value: "",
      num: 1,
      checked: true,
      input: "",
      // 已选配置
      dispose: {
        name: "",
        kuValue: "",
        cityRadio: "台湾台北",
        container: ""
      }
    };
  },
  components: {
    // HeadCom,
    // SEARCH
  },
  created() {},
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
    // 第一步 下一步
    firstNext() {
      console.log(this.colony.OSvalue);
      if (this.colony.name !== "") {
        this.firstBox = false;
        this.secondBox = true;
        this.thirdBox = false;
        this.fourthBox = false;
        this.dispose.name = this.colony.name;
        for (var i in this.colony.kuOptions) {
          if (this.colony.kuOptions[i].value === this.colony.kuValue) {
            this.dispose.kuValue = this.colony.kuOptions[i].label;
          }
        }
        var CIDRValue_1 = "";
        var CIDRValue_5 = "";
        for (var i in this.colony.CIDROptions_1) {
          console.log(this.colony.CIDROptions_1[i]);
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
      } else {
        this.colony.nameWran = true;
      }
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
      // console.log(val);
      if (val === "2") {
        this.colonySecond.chargingShow = true;
      } else {
        this.colonySecond.chargingShow = false;
      }
    },
    // 机型
    handleCurrentChange(val) {
      console.log(val);
    },
    // 系统盘 弹框确认
    SystemDiskSure() {
      this.colonySecond.systemDiskNumber = this.colonySecond.systemDiskNum;
      var systemDiskOptions = this.colonySecond.systemDiskOptions;
      for (var i in systemDiskOptions) {
        if (systemDiskOptions[i].value == this.colonySecond.systemDiskVal) {
          this.colonySecond.systemDiskValue = systemDiskOptions[i].label;
        }
      }
      this.colonySecond.systemDiskShow = false;
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
      this.firstBox = false;
      this.secondBox = true;
      this.thirdBox = false;
      this.fourthBox = false;
    },
    // 第三步 下一步
    thirdNext() {
      this.firstBox = false;
      this.secondBox = false;
      this.thirdBox = false;
      this.fourthBox = true;
    },
    // ----------------------------------------- 第四步 ---------------------------------------
    // 第三步 下一步
    fourthPrev() {
      this.firstBox = false;
      this.secondBox = false;
      this.thirdBox = true;
      this.fourthBox = false;
    }
  }
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
            overflow: hidden;
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
            top: 0px;
            left: 0px;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 1200;
            overflow: auto;
            .tke-second-worker-model {
              width: 90%;
              background: #fff;
              padding: 25px;
              margin-left: 5%;
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
                  display: inline-block;
                  float: right;
                  width: 26px;
                  height: 26px;
                  font-size: 20px;
                  cursor: pointer;
                  text-align: center;
                  line-height: 26px;
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
                text-align: center;
                margin-top: 30px;
                ::v-deep .el-button {
                  border-radius: 0px;
                  width: 56px;
                  height: 30px;
                  padding: 0px;
                  font-size: 12px;
                }
                .determine {
                  background-color: #006eff;
                  color: #fff;
                  border: 1px solid #006eff;
                }
                .cancel {
                  background-color: #fff;
                  border-color: #ddd;
                  color: #000;
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
  .tke-third-radio-btn {
    margin-top: 0px;
    padding-bottom: 0px;
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

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
          <h2 class="header-title">{{$t('TKE.colony.xjjd')}}</h2>
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
        <div class="tke-step-item is-curr">
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
      <!-- 第二步 选择机型 -->
      <div
        v-if="secondBox"
        class="tke-second-box tke-card tke-formpanel-wrap mb60"
      >
        <div class="tke-second-title">{{$t('TKE.colony.yxpz')}}</div>
        <el-form
          ref="form"
          :model="nodeForm"
          label-width="120px"
          label-position="left"
        >
          <el-form-item :label="$t('TKE.colony.jqm')">
            <p>{{ nodeForm.name }}</p>
          </el-form-item>
          <el-form-item label="Kubernetes版本">
            <p>{{ nodeForm.clusterVersion.ClusterVersion | ClusterVersion }}</p>
          </el-form-item>
          <el-form-item label="所在地域">
            <p>{{ nodeForm.cityRadio }}</p>
          </el-form-item>
          <el-form-item :label="$t('TKE.colony.rqwl')">
            <p>{{ nodeForm.container }}</p>
          </el-form-item>
          <div class="tke-second-tips">
            <p>{{$t('TKE.colony.czxt')}}<i class="el-icon-info"></i></p>
            <p>
              {{nodeForm.os}}
            </p>
          </div>
          <div
            class="tke-second-tips"
            style="border: 0px;margin:0px;padding:0px;"
          >
            <p>{{$t('TKE.colony.jfms')}}<i class="el-icon-info"></i></p>
            <div class="tke-second-radio-btn tke-second-icon-btn">
              <el-radio-group
                v-model="nodeForm.instanceChargeType"
                @change="SecondCharging();costPrice()"
              >
                <el-radio-button label="POSTPAID_BY_HOUR">{{$t('TKE.colony.aljf')}}</el-radio-button>
                <!-- <el-radio-button label="PREPAID">包年包月</el-radio-button> -->
              </el-radio-group>
              <!-- <a href="#">详细对比</a> -->
            </div>
          </div>
          <el-form-item label="所在地域">
            <p style="line-height:48px;">{{ nodeForm.cityRadio }}</p>
          </el-form-item>
          <div
            class="tke-second-tips"
            style="border: 0px;margin:0px;padding-bottom:16px;"
          >
            <p>{{$t('TKE.colony.kyq')}}<i class="el-icon-info"></i></p>
            <div class="tke-second-radio-btn tke-second-icon-btn">
              <el-radio-group v-model="nodeForm.charging">
                <el-radio-button label="1">{{$t('TKE.colony.tbyq')}}</el-radio-button>
              </el-radio-group>
            </div>
          </div>
          <div
            class="tke-second-tips"
            style="border: 0px;margin:0px;padding-bottom:11px;"
          >
            <p>{{$t('TKE.colony.jdwl')}}<i class="el-icon-info"></i></p>
            <div class="tke-second-worker-select">
              <el-select v-model="nodeForm.groupVps" disabled :placeholder="$t('TKE.overview.qxz')">
                <el-option
                  v-for="item in nodeForm.describeVpcs"
                  :key="item.VpcId"
                  :label="item.VpcName"
                  :value="item.VpcId"
                >
                </el-option>
              </el-select>
              <el-select v-model="nodeForm.subnetId" :placeholder="$t('TKE.overview.qxz')">
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
          <el-form-item :label="$t('TKE.colony.cpunc')">
            <div class="tke-second-radio-btn tke-second-icon-btn">
              <el-select v-model="nodeForm.cpu" :placeholder="$t('TKE.overview.qxz')" @change="getFilterZoneList()">
                <el-option
                  v-for="item in nodeForm.AllCPU"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
              <el-select v-model="nodeForm.memory" :placeholder="$t('TKE.overview.qxz')" @change="getFilterZoneList()">
                <el-option
                  v-for="item in nodeForm.AllRAM"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item :label="$t('TKE.colony.slz')">
            <div class="tke-second-radio-btn tke-second-icon-btn">
              <el-radio-group v-model="nodeForm.example" @change="getFilterZoneList()">
                <el-radio-button label="all">{{$t('TKE.colony.qbslz')}}</el-radio-button>
                <el-radio-button label="S3">{{$t('TKE.colony.bzx')}}</el-radio-button>
                <el-radio-button label="M3">{{$t('TKE.colony.ncx')}}</el-radio-button>
                <el-radio-button label="C3">{{$t('TKE.colony.jsx')}}</el-radio-button>
              </el-radio-group>
            </div>
          </el-form-item>
          <el-form-item :label="$t('TKE.colony.sllx')">
            <div class="tke-second-radio-btn tke-second-icon-btn">
              <el-radio-group v-model="nodeForm.exampleType" @change="getFilterZoneList()">
                <el-radio-button label="all">{{$t('TKE.colony.qbsllx')}}</el-radio-button>
                <el-radio-button label="S3" v-show="nodeForm.example === 'all' || nodeForm.example === 'S3'">{{$t('TKE.colony.bzx')}}S3</el-radio-button>
                <el-radio-button label="C3" v-show="nodeForm.example === 'all' || nodeForm.example === 'M3'">{{$t('TKE.colony.jsx')}}C3</el-radio-button>
                <el-radio-button label="M3" v-show="nodeForm.example === 'all' || nodeForm.example === 'C3'">{{$t('TKE.colony.ncx')}}M3</el-radio-button>
              </el-radio-group>
            </div>
          </el-form-item>
          <el-form-item>
            <div class="model-bg">
              <el-table
                ref="singleTable"
                :data="nodeForm.isShowZoneInfoFilterData?nodeForm.zoneInfoFilters:nodeForm.zoneInfoList"
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
                <el-table-column property="date" :label="$t('TKE.colony.jxing')">
                  <template slot-scope="scope">
                    <!-- <span>{{scope.row.TypeName | ModelTypeName}}</span> -->
                    <span>{{scope.row.TypeName}}</span>
                  </template>
                </el-table-column>
                <el-table-column property="name" :label="$t('TKE.colony.gg')">
                  <template slot-scope="scope">
                    <span>{{scope.row.InstanceType}}</span>
                  </template>
                </el-table-column>
                <el-table-column property="address" label="CPU">
                  <template slot-scope="scope">
                    <span>{{scope.row.Cpu}}核</span>
                  </template>
                </el-table-column>
                <el-table-column property="address" :label="$t('TKE.overview.nc')">
                  <template slot-scope="scope">
                    <span>{{scope.row.Memory}}GB</span>
                  </template>
                </el-table-column>
                <el-table-column property="address" :label="$t('TKE.colony.pzfy')">
                  <template slot-scope="scope">
                    <span class="text-orange" style="color:#ff7800;" v-if="nodeForm.instanceChargeType === 'POSTPAID_BY_HOUR'">NT$ {{ scope.row.cost }}</span>
                    <span class="text-orange" style="color:#ff7800;" v-else>NT${{ scope.row.Price.DiscountPrice }}</span>
                    {{nodeForm.instanceChargeType === 'POSTPAID_BY_HOUR' ? '每小時' : '月'}}
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
        <div class="tke-second-title">{{$t('TKE.colony.yxpz')}}</div>
        <el-form
          ref="nodeForm"
          :model="nodeForm"
          label-width="120px"
          label-position="left"
          :rules="rules"
        >
          <el-form-item :label="$t('TKE.colony.jqm')">
            <p>{{ nodeForm.name }}</p>
          </el-form-item>
          <el-form-item label="Kubernetes版本">
            <p>{{ nodeForm.clusterVersion.ClusterVersion | ClusterVersion }}</p>
          </el-form-item>
          <el-form-item label="所在地域">
            <p>{{ nodeForm.cityRadio }}</p>
          </el-form-item>
          <el-form-item :label="$t('TKE.colony.rqwl')">
            <p>{{ nodeForm.container }}</p>
          </el-form-item>
          <el-form-item :label="$t('TKE.colony.jfms')">
            <p>{{nodeForm.instanceChargeType | instanceChargeType}}</p>
          </el-form-item>
          <div class="tke-second-tips tke-third-tips-h">
            <p>{{$t('TKE.colony.czxt')}}<i class="el-icon-info"></i></p>
            <p>
              {{nodeForm.os}}
            </p>
          </div>
          <el-form-item :label="$t('TKE.colony.jxing')">
            <!-- <p>{{nodeForm.modelType.TypeName | ModelTypeName}}</p> -->
            <p>{{nodeForm.modelType.TypeName}}</p>
          </el-form-item>
          <el-form-item :label="$t('TKE.colony.gg')" class="norms">
            <p>{{nodeForm.instanceType}} ({{nodeForm.modelType.Cpu}}核{{nodeForm.modelType.Memory}}GB)</p>
          </el-form-item>
          <el-form-item :label="$t('TKE.colony.xtp')" style="margin-bottom:20px">
            <div class="tke-second-radio-btn tke-third-radio-btn">
              <el-radio-group v-model="nodeForm.systemDiskType" @change="changeSyetemType">
                <el-radio-button label="CLOUD_PREMIUM">{{$t('TKE.colony.gxnyp')}}</el-radio-button>
                <el-radio-button label="CLOUD_SSD">{{$t('TKE.colony.yyp')}}</el-radio-button>
              </el-radio-group>
              <div class="block">
                <el-slider :min="50" :max="500" :step="10" :show-tooltip="true" v-model="nodeForm.systemSize" 
                    show-input @change="changeSyetem" :marks="mark"></el-slider>
              </div>
            </div>
          </el-form-item>
          <div class="tke-second-tips tke-third-tips-h">
            <p>{{$t('TKE.colony.sjp')}}</p>
            <div class="data-disk">
              <el-checkbox v-model="nodeForm.isShowDataDisk" @change="isBuyDataDisk"
                >{{$t('TKE.colony.gmsjp')}}</el-checkbox
              >
            </div>
            <div v-if="nodeForm.dataDiskShow" style="margin: 0 120px;background-color: #f2f2f2;" class="tke-second-radio-btn tke-third-radio-btn">
              <div>
                <div v-for="(item, i) in nodeForm.buyDataDiskArr" :key="i" style="display: flex;"><!--v-for="(item, i) in nodeForm.buyDataDiskArr" :key="i"-->
                  <div style="flex: 1;" >
                    <el-form-item :label="$t('TKE.colony.sjplx')" class="norms" style="padding-left: 10px;" >
                      <el-radio-group v-model="item.dataDiskType" @change="changeDataDiskType">
                        <el-radio-button label="CLOUD_PREMIUM">{{$t('TKE.colony.gxnyp')}}</el-radio-button>
                        <el-radio-button label="CLOUD_SSD">{{$t('TKE.colony.yyp')}}</el-radio-button>
                      </el-radio-group>
                      <div class="block" style="height: auto;" v-if="item.dataDiskType = 'CLOUD_PREMIUM'">
                        <el-slider :min="10" :max="16000" :step="10" :show-tooltip="true" v-model="item.dataSize"
                         show-input @change="changeDataDisk"></el-slider>
                      </div>
                      <div class="block" style="height: auto;" v-else>
                        <el-slider :min="100" :max="16000" :step="10" :show-tooltip="true" v-model="item.dataSize"
                         show-input @change="changeDataDisk"></el-slider>
                      </div>
                    </el-form-item>
                    <el-form-item :label="$t('TKE.colony.gshsz')" class="norms" style="padding-left: 10px;">
                      <el-checkbox v-model="item.fomatAndMount" @change="isFomatMount">
                        {{$t('TKE.colony.gshbgz')}}          
                      </el-checkbox>
                      <div v-if="item.fomatAndMount" style="display: flex;width:440px">
                        <!-- <div style="width:600px"> -->
                        <el-select v-model="item.fileSystem" :placeholder="$t('TKE.overview.qxz')" style="padding-right: 10px;">
                          <el-option
                            v-for="item in nodeForm.latticeSetOpt"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          >
                          </el-option>
                        </el-select>
                        <!-- <div class='box-form'> -->
                        
                        <el-input v-model="item.filePath" :placeholder="$t('TKE.colony.qsrgzlj')" @blur="getInput()" :class='[item.rule? "box-form" : ""]' ></el-input>
                        <el-tooltip class="item" effect="light" content="挂载路径不可重复" placement="top">
                          <i class="el-icon-info" v-if="item.rule"></i>
                        </el-tooltip>
                        </div>
                      <!-- </div> -->
                    </el-form-item>
                  </div>
                  <span v-if="nodeForm.buyDataDiskArr.length > 1">
                    <i
                      class="el-icon-error ml5"
                      style="margin-top:10px;height: 20px;width:20px;"
                      @click="deleteDataDisk(i)"
                    ></i>
                  </span>
                </div>
              </div>
              <div
                class="add-data-disk" style="margin-top: 10px;"
                v-if="nodeForm.dataDiskShow"
              >
                <el-button :disabled="nodeForm.buyDataDiskArr.length >19?true:false" @click="AddDataDisk()" style="color: #006eff;">{{$t('TKE.colony.tjsjp')}}</el-button> 
              </div>
            </div>
          </div>
          <el-form-item :label="$t('TKE.colony.rqml')" v-if="nodeForm.dataDiskShow">
            <el-checkbox v-model="nodeForm.containerChecked"
              >{{$t('TKE.colony.jyccdsjp')}}</el-checkbox
            >
            <el-input
              v-model="nodeForm.containerInput"
              :placeholder="$t('TKE.colony.rqmlgs')"
              v-if="nodeForm.containerChecked"
              prop="container"
            ></el-input>
          </el-form-item>
          <div class="tke-second-tips tke-third-broadband">
            <p>{{$t('TKE.colony.gwdk')}}<i class="el-icon-info"></i></p>
            <div class="tke-second-radio-btn tke-third-radio-btn">
              <el-radio-group v-model="nodeForm.internetChargeType" @change="changeInternetType">
                <el-radio-button label="BANDWIDTH_POSTPAID_BY_HOUR">{{$t('TKE.colony.adkjf')}}</el-radio-button>
                <el-radio-button label="TRAFFIC_POSTPAID_BY_HOUR">按使用流量</el-radio-button>
              </el-radio-group>
              <div style="overflow:hidden;margin-left:120px;">
                <div class="block">
                  <el-slider :min="0" :max="100" :step="1" v-model="nodeForm.internetMaxBandwidthOut" show-input
                  @change="changeInternet"></el-slider>
                </div>
                <div class="data-disk">
                  <p v-show="nodeForm.internetMaxBandwidthOut === 0">
                    {{$t('TKE.colony.nszkd')}}
                  </p>
                  <el-checkbox v-model="nodeForm.publicIpAssigned" :disabled = "nodeForm.disabled"
                    >{{$t('TKE.colony.mffpgw')}}
                    <!-- <a href="javascript:;">使用指引</a> -->
                  </el-checkbox>
                  <p v-show="nodeForm.internetMaxBandwidthOut === 0 || nodeForm.publicIpAssigned === false">
                    {{$t('TKE.colony.ywyq')}}
                    <!-- <a href="javascript:;">NAT网关详细介绍</a> -->
                  </p>
                </div>
              </div>
            </div>
          </div>
          <el-form-item :label="$t('TKE.colony.slmc')">
            <div class="tke-second-radio-btn tke-third-radio-btn">
              <el-radio-group v-model="nodeForm.instanceNameType">
                <el-radio-button label="auto">{{$t('TKE.colony.zdmm')}}</el-radio-button>
                <el-radio-button label="manual">{{$t('TKE.colony.sdmm')}}</el-radio-button>
              </el-radio-group>
              <p v-show="nodeForm.instanceNameType === 'auto'">{{$t('TKE.colony.yfwqjzdmm')}}</p>
            </div>
          </el-form-item>
          <el-form-item v-show="nodeForm.instanceNameType === 'manual'" style="margin-top: 20px;">
            <el-input type="text" v-model="nodeForm.instanceName" :placeholder="$t('TKE.colony.qsrnr')" @blur="nameManual(nodeForm.instanceName)" ></el-input>
            <p>{{$t('TKE.colony.slmcbcg')}}</p>
          </el-form-item>
          <el-form-item :label="$t('TKE.colony.dlfs')">
            <div class="tke-second-radio-btn tke-third-radio-btn">
              <el-radio-group
                v-model="nodeForm.loginSettings"
                @change="LoginMode"
              >
                <el-radio-button label="relation">{{$t('TKE.colony.ljglmy')}}</el-radio-button>
                <el-radio-button label="auto">{{$t('TKE.colony.zdscmm')}}</el-radio-button>
                <el-radio-button label="set">{{$t('TKE.colony.szmm')}}</el-radio-button>
              </el-radio-group>
              <p v-if="nodeForm.loginSettings === 'auto'">
                {{$t('TKE.colony.czmm')}}
              </p>
            </div>
          </el-form-item>
          <el-form-item
            :label="$t('TKE.overview.yhm')"
            v-if="nodeForm.loginSettings === 'relation' || nodeForm.loginSettings === 'set'"
          >
            <p>{{ nodeForm.os | OSvalue }}</p>
          </el-form-item>
          <el-form-item :label="$t('TKE.colony.sshmy')" v-if="nodeForm.loginSettings === 'relation'">
            <div class="tke-third-select">
              <el-select v-model="nodeForm.keyIds" :placeholder="$t('TKE.overview.qxz')">
                <el-option
                  v-for="item in nodeForm.secretList"
                  :key="item.KeyId"
                  :label="item.KeyName"
                  :value="item.KeyId"
                >
                </el-option>
              </el-select>
              <p>{{$t('TKE.colony.mybhs')}}<a href="#">{{$t('TKE.colony.xzcj')}}</a></p>
            </div>
          </el-form-item>
          <el-form-item :label="$t('TKE.overview.mm')" v-if="nodeForm.loginSettings === 'set'" class="password">
            <el-input
              :placeholder="$t('TKE.colony.qsrzjmm')"
              v-model="nodeForm.password"
              @blur="PasswordInput(nodeForm.password)"
              show-password
            ></el-input>
            <p>
              linux機器密碼需8到16位，至少包括兩項（[a-z,A-Z] ,
              [0-9]和[()`~!@#$%^&}*-+=|{}[]:;',.?/]的特殊符號）
            </p>
          </el-form-item>
          <el-form-item
            :label="$t('TKE.colony.qrmm')"
            v-if="nodeForm.loginSettings === 'set'"
            class="password"
          >
            <el-input
              :placeholder="$t('TKE.colony.qsrzjmm')"
              v-model="nodeForm.confirmPassword"
              @blur="confirmPasswordInput(nodeForm.confirmPassword)"
              show-password
            ></el-input>
          </el-form-item>
          <div class="tke-third-tips">
            <p>{{$t('TKE.colony.aqz')}}<el-tooltip
                :content="$t('TKE.colony.aqzyfhqgn')"
                placement="right"
                effect="light"
                ><i class="el-icon-info ml5"></i
              ></el-tooltip></p>

            <div class="input-box">
              <el-select
                :placeholder="$t('TKE.colony.qxzaqz')"
                v-model="nodeForm.securityId"
              >
                <el-option
                  v-for="x in nodeForm.securityGroups"
                  :key="x.SecurityGroupId"
                  :label="x.SecurityGroupName"
                  :value="x.SecurityGroupId"
                >
                </el-option>
              </el-select>
              <i class="el-icon-refresh ml5" @click="refeshSecurity"></i>
              <div v-for="(item, index) in nodeForm.safeArr" :key="index">
                <div>
                  <el-select
                    :placeholder="$t('TKE.colony.qxzaqz')"
                    v-model="item.securityId"
                    @change="selectChange"
                  >
                    <el-option
                      v-for="x in nodeForm.securityGroups"
                      :key="x.SecurityGroupId"
                      :label="x.SecurityGroupName"
                      :value="x.SecurityGroupId"
                    >
                    </el-option>
                  </el-select>
                  <el-tooltip
                    class="hide"
                    :class="{ active: item.error }"
                    effect="light"
                    :content="item.error ? '安全组重复' : ''"
                    placement="right"
                  >
                    <i class="el-icon-warning-outline ml5"></i>
                  </el-tooltip>
                  <i class="el-icon-refresh ml5" @click="refeshSecurity"></i>
                  <i
                    class="el-icon-error ml5"
                    @click="deleteExceptPrice(index)"
                  ></i>
                </div>
              </div>
              <div>
                <el-button :disabled="nodeForm.safeArr.length > 8 ? true : false" @click="AddSafe" type="text">
                  {{$t('TKE.colony.tjaqz')}}
                </el-button>
              </div>
              <!-- <p @click="AddSafe" style="color:blue;">{{$t('TKE.colony.tjaqz')}}</p> -->
            </div>
          </div>
          <el-form-item label="安全加固">
            <div class="tke-third-checkbox" style="padding-bottom:10px;">
              <el-checkbox v-model="nodeForm.securityService"
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
              <el-checkbox v-model="nodeForm.monitorService"
                >{{$t('TKE.colony.mfkt')}}</el-checkbox
              >
              <p class="checkbox-tips" v-if="!nodeForm.monitorService">
                {{$t('TKE.colony.qxgx')}}
              </p>
              <p>
                {{$t('TKE.colony.mfktzj')}}
                <!-- <a href="#">详细介绍</a> -->
              </p>
            </div>
          </el-form-item>
          <!-- 高級設置 -->
          <p class="advanced-setting-a">
            <i class="el-icon-caret-right" v-if="!nodeForm.advancedSettingShow"></i>
            <i class="el-icon-caret-bottom" v-if="nodeForm.advancedSettingShow"></i
            ><a href="javascript:;" @click="AdvancedSettingBtn">高級設置</a>
          </p>
          <div class="advanced-setting-box" v-if="nodeForm.advancedSettingShow" style="margin-top: 10px;">
            <div class="tke-second-tips">
              <p>
                節點啟動配置
                <el-tooltip
                  content="指定自定義數據配置Node，即當Node啟動後運行配置的腳本，需要自行保證腳本的可重入及重試邏輯, 腳本及其生成的日誌文件可在節點的/usr/local/qcloud/tke/userscript路徑檢視"
                  placement="right"
                  width="200px"
                  effect="light"
                  ><i class="el-icon-info ml5"></i
                ></el-tooltip>
              </p>
              <p>
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4 }"
                  placeholder="可選，用於啟動時配置實例，支持 Shell 格式，原始數據不能超過 16 KB"
                  v-model="nodeForm.textarea2"
                  class="w420"
                >
                </el-input>
              </p>
            </div>
            <div class="tke-second-tips">
              <p>封鎖（cordon）</p>
              <div>
                <el-checkbox v-model="nodeForm.checkoutFs">
                  開啟封鎖
                </el-checkbox>
                <p style="margin-left: 120px">
                  封鎖節點後，將不接受新的Pod調度到該節點，需要手動取消封鎖的節點，或在自定義數據中執行取消封鎖命令
                </p>
              </div>
            </div>
            <!-- <div class="tke-second-tips">
              <p>Label</p>
              <div>
                <ul>
                  <li v-for="(item, index) in nodeForm.advancedSettingArr" :key="index">
                    <el-input v-model="item.name"></el-input>
                    <span style="margin:0 10px;">=</span>
                    <el-input v-model="item.value"></el-input>
                    <i
                      class="el-icon-close"
                      @click="DeleteAdvancedSetting(index)"
                    ></i>
                  </li>
                </ul>
                <a href="javascript:;" @click="AddAdvancedSetting">新增</a>
                <p>
                  標籤名稱只能包含字母、數字及分隔符("-"、"_"、"."、"/")，且必須以字母、數字開頭和結尾
                </p>
                <p>
                  標籤值只能包含字母、數字及分隔符("-"、"_"、".")，且必須以字母、數字開頭和結尾
                </p>
              </div>
            </div> -->
          </div>
        </el-form>
        <!-- 底部 -->
        <div class="tke-formpanel-footer">
          <el-button size="small" @click="thirdPrev">上一步</el-button>
          <el-button size="small" type="primary" :disabled="nodeForm.isShowathirdNext?true:false" @click="thirdNext('nodeForm')"
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
            <p>{{ nodeForm.name }}</p>
          </el-form-item>
          <el-form-item label="Kubernetes版本">
            <p>{{ nodeForm.clusterVersion.ClusterVersion | ClusterVersion }}</p>
          </el-form-item>
          <el-form-item label="所在地域">
            <p>{{ nodeForm.cityRadio }}</p>
          </el-form-item>
          <el-form-item :label="$t('TKE.colony.rqwl')">
            <p>{{ nodeForm.container }}, {{clusterInfo.ClusterNetworkSettings.MaxClusterServiceNum}}{{$t('TKE.overview.ge')}}service/集群, {{clusterInfo.ClusterNetworkSettings.MaxNodePodNum}}{{$t('TKE.colony.sxjd')}}</p>
          </el-form-item>
          <el-form-item :label="$t('TKE.colony.jfms')">
            <p>{{nodeForm.instanceChargeType | instanceChargeType}}</p>
          </el-form-item>
          <el-form-item :label="$t('TKE.colony.jxing')">
            <!-- <p>{{nodeForm.modelType.TypeName | ModelTypeName}}</p> -->
            <p>{{nodeForm.modelType.TypeName}}</p>
          </el-form-item>
          <el-form-item :label="$t('TKE.colony.gg')">
            <p>{{nodeForm.instanceType}} ({{nodeForm.modelType.Cpu}}核{{nodeForm.modelType.Memory}}GB)</p>
          </el-form-item>
          <el-form-item :label="$t('TKE.colony.czxt')">
            {{nodeForm.os}}
          </el-form-item>
          <el-form-item :label="$t('TKE.colony.xtp')">
            <p>{{nodeForm.systemDiskType | systemDiskType}} ({{nodeForm.systemSize}}GB)</p>
          </el-form-item>
          <el-form-item :label="$t('TKE.colony.sjp')">
            <p v-if="!nodeForm.isShowDataDisk">{{$t('TKE.colony.zbgm')}}</p>
            <p v-else>{{nodeForm.buyDataDiskArr | buyDataDiskArr}}</p>
            
          </el-form-item>
          <el-form-item :label="$t('TKE.colony.gwdk')" class="tke-fourth-broadband">
            <p>{{nodeForm.internetChargeType | internetChargeType}} ({{nodeForm.internetMaxBandwidthOut}}Mbps)</p>
          </el-form-item>
          <el-form-item :label="$t('TKE.colony.yfwqsl')" class="cvm-num" v-if="nodeForm.instanceChargeType === 'PREPAID'">
            <el-input-number v-model="nodeForm.instanceCount" :min="1" :max="10" @change="costPrice"></el-input-number>
          </el-form-item>
          <el-form-item :label="$t('TKE.colony.yfwqsl')" class="cvm-num" v-else>
            <el-input-number v-model="nodeForm.instanceCount" :min="1" :max="100" @change="costPrice"></el-input-number>
          </el-form-item>
          <el-form-item
            :label="$t('TKE.colony.gmsc')"
            v-if="nodeForm.instanceChargeType === 'PREPAID' "
            class="tke-second-radio-time"
          >
            <div class="tke-second-radio-btn">
              <el-radio-group
                v-model="nodeForm.buyTime"
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
          <el-form-item :label="$t('TKE.colony.zdxf')" v-if="nodeForm.instanceChargeType === 'PREPAID'">
            <div class="tke-second-checkbox">
              <el-checkbox v-model="nodeForm.renew"
                >{{$t('TKE.colony.zhyezg')}}</el-checkbox
              >
            </div>
          </el-form-item>
          <el-form-item :label="$t('TKE.colony.zjfy')" v-if="nodeForm.instanceChargeType === 'PREPAID'">
            <div class="tke-second-cost">
              <span class="tke-second-cost-num">{{nodeForm.totalPrice}}</span
              ><span class="tke-second-cost-h">元</span
              >
            
            </div>
          </el-form-item>
          <el-form-item :label="$t('TKE.colony.zjfy')" v-else>
            <div class="tke-second-cost">
              <span class="tke-second-cost-num">NT${{nodeForm.allocationCost}} 每{{$t('TKE.colony.xs')}}</span>
              <!-- <span class="tke-second-cost-h">元/{{$t('TKE.colony.xs')}}</span> -->
              <span class="tke-second-cost-t">({{$t('TKE.colony.pzfy')}})</span>
              <i>|</i>
              <span class="tke-second-cost-num">NT${{nodeForm.networkCost}} 每GB</span>
              <!-- <span class="tke-second-cost-h">元/{{$t('TKE.colony.xs')}}</span> -->
              <span class="tke-second-cost-w"> {{$t('TKE.colony.wlfy')}}</span>
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
  </div>
</template>

<script>
// import HeadCom from '@/components/public/Head'
// import SEARCH from '@/components/public/SEARCH'
import { ErrorTips } from "@/components/ErrorTips";
import { Base64 } from "js-base64";
import { type } from 'os';
import { ALL_CITY,
  TKE_COLONY_LIST,
  DESCRIBE_ZONE_INFO,
  TKE_VPC_METWORK,
  TKE_WORKER_METWORK,
  TKE_SSH,
  TKE_MISG,
  TKE_ADD_NODE,
  TKE_OPERAT_SYSTEM,
  TKE_PRICE,
  CLUSTER_VERSION } from "@/constants";
export default {
  name: "create",
  data() {
    return {
      marks:{
        0: '10',
        100: '16000',
      },
      mark:{
        60: '50G',
        300: '500G'
      },//slider滑块
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
        cityRadio: "台灣台北",//区域
        container: "",//容器网络
        os:'',//操作系统
        clusterVersion: {},//kubernetes版本
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
        dataDiskType : 'CLOUD_PREMIUM',//系统盘类型
        dataSize: 10,//数据盘大小
        fomatAndMount: false,//数据盘是否格式化
        isShowFomatMount: false,//是否显示数据挂载
        fileSystem: 'ext4',//数据类型
        filePath: '/var/lib/docker',//文件路径
        modelType: {},//实例机型对象
        instanceType: 'S3.SMALL1',//实例机型类型
        isShowDataDisk: false,//是否购买数据盘
        dataDiskShow: false,//是否显示购买数据盘modal
        buyDataDiskArr: [],//数据盘购买列表
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
        safeArr: [],//安全组
        charging: 1,
        imageId: 'img-6yudrskj',//镜像ID
        memory: 'all',//内存
        cpu: 'all',//cpu
        example: 'all',//实例族
        exampleType: 'all',//实例类型
        zoneInfoFilters: [],//机型过滤数据列表
        isShowZoneInfoFilterData: false,//列表是否显示过滤数据
        AllCPU: [
          {
            label: "全部CPU",
            value: "all"
          },
          {
            value: 1,
            label: "1核"
          },
          {
            value: 2,
            label: "2核"
          },
          {
            value: 4,
            label: "4核"
          },
          {
            value: 8,
            label: "8核"
          },
          {
            value: 12,
            label: "12核"
          },
          {
            value: 16,
            label: "16核"
          },
          {
            value: 24,
            label: "24核"
          },
          {
            value: 32,
            label: "32核"
          },
          {
            value: 48,
            label: "48核"
          },
          {
            value: 64,
            label: "64核"
          },
          {
            value: 80,
            label: "80核"
          }
        ],
        AllRAM: [
          {
            value: "all",
            label: "全部記憶體"
          },
          {
            value: 1,
            label: "1GB"
          },
          {
            value: 2,
            label: "2GB"
          },
          {
            value: 4,
            label: "4GB"
          },
          {
            value: 8,
            label: "8GB"
          },
          {
            value: 16,
            label: "16GB"
          },
          {
            value: 24,
            label: "24GB"
          },
          {
            value: 32,
            label: "32GB"
          },
          {
            value: 48,
            label: "48GB"
          },
          {
            value: 64,
            label: "64GB"
          },
          {
            value: 96,
            label: "96GB"
          },
          {
            value: 128,
            label: "128GB"
          },
          {
            value: 144,
            label: "144GB"
          },
          {
            value: 192,
            label: "192GB"
          },
          {
            value: 256,
            label: "256GB"
          },
          {
            value: 320,
            label: "320GB"
          },
          {
            value: 384,
            label: "384GB"
          },
          {
            value: 512,
            label: "512GB"
          }
        ],
        projectId: '',//项目id
        buyTime: 36, // 购买时长
        renew: false, // 自动续费
        totalPrice: '',//报年报月费用
        allocationCost: '',//配置费用
        networkCost: '',//网络费用
        isShowathirdNext: false,//是否禁用第三步下一步
        // 第三步 高級設置
        advancedSettingShow: false,
        textarea2: "",
        checkoutFs: false,
        advancedSettingArr: [],
        dataShow: []
      },
      rules: {
        container: [
          {
            validator: (rule, value, callback) => {
              if (this.nodeForm.containerChecked && value === '') {
                callback(new Error('容器目錄不能為空'))
              } else {
                callback()
              }
            },
            trigger: "blur",
            required: true
          }
        ]
      },
      radio1: 1,
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
    this.getClusterVersion();
  },
  methods: {
    AddAdvancedSetting() {
      this.nodeForm.advancedSettingArr.push({
        name: "",
        value: ""
      });
    },
    DeleteAdvancedSetting(index) {
      this.nodeForm.advancedSettingArr.splice(index, 1);
    },
    // 高級設置
    AdvancedSettingBtn() {
      this.nodeForm.advancedSettingShow = !this.nodeForm.advancedSettingShow;
    },
    //获取镜像 
    async getImagesList() {
      
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
        this.nodeForm.projectId = response.ProjectId;
        this.loadShow = false;
        this.loadShow = true;
        let params = {
          Version: "2017-03-12",
          Offset: 0,
          Limit: 100,
        };
        this.loadShow = true;
        let paramImage = {
          Version: "2018-05-25"
        }
        
        await this.axios.post(TKE_OPERAT_SYSTEM, paramImage).then(resImage => {
          if(resImage.Response.Error === undefined) {
            let images = resImage.Response.ImageInstanceSet;
            if(images.length > 0) {
              for (let i = 0; i < images.length; i++) {
                let image = images[i];
                if(response.ClusterOs === image.OsName) {
                  this.nodeForm.imageId = image.ImageId;
                  continue;
                }
              }
            }
          } else {
            this.loadShow = false;
            let ErrTips = {};
            let ErrOr = Object.assign(ErrorTips, ErrTips);
            this.$message({
              message: ErrOr[resImage.Response.Error.Code],
              type: "error",
              showClose: true,
              duration: 0
            });
          }
        });
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
          "InternalError": "内部錯誤",
          "InternalError.CamNoAuth": "沒有權限。",
          "InternalError.Db": "db錯誤。",
          "InternalError.DbAffectivedRows": "DB錯誤",
          "InternalError.Param": "Param。",
          "InternalError.PublicClusterOpNotSupport": "集群不支持當前操作。",
          "InternalError.QuotaMaxClsLimit": "超過配額限制。",
          "InternalError.QuotaMaxNodLimit": "超過配額限制。",
          "InvalidParameter": "參數錯誤",
          "InvalidParameter.Param": "參數錯誤",
          "LimitExceeded": "超過配額限制。",
          "ResourceNotFound": "資源不存在"
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
      let usdRate = localStorage.getItem('usdRate');   // 美元汇率
      let tpdRate = localStorage.getItem('tpdRate');   // 台币汇率
      let taRate = localStorage.getItem('taRate');  // 税率
      await this.axios.post(DESCRIBE_ZONE_INFO, param).then(res => {
        if(res.Response.Error === undefined) {
          console.log(res.Response.InstanceTypeQuotaSet);
          if(res.Response.InstanceTypeQuotaSet.length > 0) {
            for(let i = 0; i < res.Response.InstanceTypeQuotaSet.length; i++) {
              res.Response.InstanceTypeQuotaSet[i].cost = (res.Response.InstanceTypeQuotaSet[i].Price.UnitPrice * usdRate * tpdRate * taRate).toFixed(8);
            }
          }
          this.nodeForm.zoneInfoList = res.Response.InstanceTypeQuotaSet;
          console.log(this.nodeForm.zoneInfoList)
          this.nodeForm.modelType = res.Response.InstanceTypeQuotaSet[0];
        } else {
          this.loadShow = false;
          let ErrTips = {
            "InvalidInstanceType.Malformed": "指定InstanceType參數格式不合法",
            "InvalidRegion.NotFound": "未找到該區域",
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
          this.nodeForm.securityId = res.Response.SecurityGroupSet[0].SecurityGroupId;
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
    //刷新安全组列表
    refeshSecurity() {
      this.getSecurityGroups();
    },
    //获取k8s版本
    async getClusterVersion () {
      this.loadShow = true;
      let params = {
        Version: "2018-05-25"
      }
      params["ClusterId.0"] = this.clusterId;
      const res = await this.axios.post(CLUSTER_VERSION, params);
      if (res.Response.Error === undefined) {
        this.nodeForm.clusterVersion = res.Response.Clusters[0];
        this.loadShow = false;
      } else {
        this.loadShow = false;
        let ErrTips = {
          
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
          this.nodeForm.keyIds = res.Response.KeyPairSet[0].KeyId;
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
    //根据条件过滤条件 zoneInfoList
    getFilterZoneList() {
      this.nodeForm.isShowZoneInfoFilterData = true;
      let zoneInfoList = this.nodeForm.zoneInfoList;
      let exampleType = this.nodeForm.exampleType;
      let cpu = this.nodeForm.cpu;
      let memory = this.nodeForm.memory;
      let example = this.nodeForm.example;
      let zoneInfoFilters = [];
      if(example === 'all' && exampleType === 'all' && cpu === 'all' && memory === 'all') {
        zoneInfoFilters = zoneInfoList;
      } else if(example !== 'all' && cpu === 'all' && memory === 'all') {
        zoneInfoFilters = zoneInfoList.filter( res => res.InstanceFamily === example);
      } else if(example !== 'all' && cpu !== 'all' && memory === 'all') {
        zoneInfoFilters = zoneInfoList.filter( 
          res => res.InstanceFamily === example && res.Cpu === cpu);
      } else if(example !== 'all' && cpu !== 'all' && memory !== 'all') {
        zoneInfoFilters = zoneInfoList.filter( 
          res => res.InstanceFamily === example && res.Cpu === cpu && res.Memory === memory);
      } else if (example !== 'all' && cpu === 'all' && memory !== 'all') {
        zoneInfoFilters = zoneInfoList.filter(res => res.InstanceFamily === example && res.Memory === memory);
      } else if(example === 'all' && exampleType !== 'all' && cpu === 'all' && memory === 'all') {
        zoneInfoFilters = zoneInfoList.filter( res => res.InstanceFamily === exampleType);
      } else if(example === 'all' && exampleType !== 'all' && cpu !== 'all' && memory === 'all') {
        zoneInfoFilters = zoneInfoList.filter(res => res.InstanceFamily === exampleType && res.Cpu === cpu);
      } else if(example === 'all' && exampleType !== 'all' && cpu !== 'all' && memory !== 'all') {
        zoneInfoFilters = zoneInfoList.filter( res => res.InstanceFamily === exampleType && res.Cpu === cpu && res.Memory === memory);
      } else if(example === 'all' && exampleType !== 'all' && cpu === 'all' && memory !== 'all') {
        zoneInfoFilters = zoneInfoList.filter( res => res.InstanceFamily === exampleType && res.Memory === memory);
      } else if(example === 'all' && exampleType === 'all' && cpu === 'all' && memory !== 'all') {
        zoneInfoFilters = zoneInfoList.filter( res => res.Memory === memory);
      } else if (example === 'all' && exampleType === 'all' && cpu !== 'all' && memory === 'all') {
        zoneInfoFilters = zoneInfoList.filter( res => res.Cpu === cpu);
      } else if(example === 'all' && exampleType === 'all' && cpu !== 'all' && memory !== 'all') {
        zoneInfoFilters = zoneInfoList.filter( res => res.Cpu === cpu && res.Memory === memory);
      }
      this.nodeForm.zoneInfoFilters = zoneInfoFilters;
      this.nodeForm.modelType = zoneInfoFilters[0];
      this.nodeForm.instanceType = zoneInfoFilters[0].InstanceType;
      this.costPrice();
    },
    // 返回上一层
    goBack() {
      this.$router.go(-1);
    },
    // -------------------------------------- 第二步 ---------------------------------
    //关闭数据盘购买
    closeDataDisk() {
      this.nodeForm.dataDiskShow = false;
      this.nodeForm.isShowDataDisk = false;
    },
    // 计费模式
    SecondCharging(val) {
      this.getDescribeZoneInstanceConfigInfos()
    },
    // 机型
    handleCurrentChange(val) {
      this.nodeForm.modelType = val;
      this.nodeForm.instanceType = val.InstanceType;
      this.costPrice();
    },

    DataDiskChange() {

    },

    getInput(){
      let arr=[]
      for( let i = 0 ; i <this.nodeForm.buyDataDiskArr.length; i++){
           let test = this.nodeForm.buyDataDiskArr[i].filePath
            for(let j = 0 ; j <this.nodeForm.buyDataDiskArr.length; j++){
                if(i!=j){
                  if(this.nodeForm.buyDataDiskArr[j].filePath === test){
                     arr.push(j)
                  }
                }
            }
        }
        Array.from(new Set(arr))
        for(let key in this.nodeForm.buyDataDiskArr){
          this.nodeForm.buyDataDiskArr[key]['rule'] = false
          for(let keys in arr){
            if(key == arr[keys]){
                this.nodeForm.buyDataDiskArr[key]['rule'] = true
            } 
          }
        }
        console.log(this.nodeForm.buyDataDiskArr)
    },
    isFomatMount() {
      this.getInput()
      if(this.nodeForm.fomatAndMount) {
        this.nodeForm.isShowFomatMount = true;
      } else {
        this.nodeForm.isShowFomatMount = false;
      }
    },

    // 购买数据盘 添加数据盘
    AddDataDisk(index) {
        this.nodeForm.buyDataDiskArr.push({
          dataDiskType: "CLOUD_PREMIUM",
          dataSize: 100,
          fomatAndMount: false,
          fileSystem: "ext4",
          filePath: "/var/lib/docker",
          rule:false
        });
      this.costPrice();
    },

    // 第二步 下一步
    secondNext() {
      this.secondBox = false;
      this.thirdBox = true;
      this.fourthBox = false;
      this.costPrice();
    },
    // ----------------------------------------- 第三步 -------------------------------------
    // 登录方式
    LoginMode(val) {
      
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
    changeSyetemType() {
      this.costPrice();
    },
    changeSyetem() {
      this.costPrice();
    },
    changeDataDiskType() {
      this.costPrice();
    },
    changeDataDisk() {
      this.costPrice();
    },
    changeInternetType() {
      this.costPrice();
    },
    // 设置密码
    PasswordInput(val) {
      if (val == "") {
        this.$message({
          message: "密碼不能為空",
          type: "warning",
          showClose: true,
          duration: 0
        });
        this.nodeForm.isShowathirdNext = true;
      } else if (val.length < 8 || val.length > 16) {
        this.$message({
          message: "密碼必須為8到16位",
          type: "warning",
          showClose: true,
          duration: 0
        });
        this.nodeForm.isShowathirdNext = true;
      } else if (
        !/^(?![A-Z]+$)(?![a-z]+$)(?![0-9]+$)(?![/`!#$%^&*()-+=|{\\[\\]':;,.?}\/]+$)[\da-zA-Z0-9`!#$%^&*()-+=|{[\]':;,.?/}].{8,16}$/.test(
          val
        )
      ) {
        this.$message({
          message: "密碼必須包含數字、字母、特殊字元中至少兩項",
          type: "warning",
          showClose: true,
          duration: 0
        });
        this.nodeForm.isShowathirdNext = true;
      } else {
        this.nodeForm.isShowathirdNext = false;
      }
    },
    //确认密码
    confirmPasswordInput(val) {
      if(this.nodeForm.password !== val) {
        this.$message({
          message: "兩次輸入端密碼不一致",
          type: "warning",
          showClose: true,
          duration: 0
        });
        this.nodeForm.isShowathirdNext = true;
      } else {
        this.nodeForm.isShowathirdNext = false;
      }
    },
    //手动命名
    nameManual(val) {
      if(val === '') {
        this.$message({
          message: "實例名稱不能為空",
          type: "warning",
          showClose: true,
          duration: 0
        });
        this.nodeForm.isShowathirdNext = true;
      } else if (val.length > 60) {
        this.$message({
          message: "實例名稱長度不能超過60個字元",
          type: "warning",
          showClose: true,
          duration: 0
        });
        this.nodeForm.isShowathirdNext = true;
      } else {
        this.nodeForm.isShowathirdNext = false;
      }
    },
    // ----------------------------------------- 第四步 ---------------------------------------
    // 第四步 上一步
    fourthPrev() {
      this.secondBox = false;
      this.thirdBox = true;
      this.fourthBox = false;
    },
    //是否购买数据盘
    isBuyDataDisk() {
      if(this.nodeForm.isShowDataDisk) {
        this.nodeForm.dataDiskShow = true;
        this.AddDataDisk();
      } else {
        this.nodeForm.dataDiskShow = false;
        this.nodeForm.buyDataDiskArr=[]
      }
    },
    // 购买时长
    BuyTime(val) {
      this.costPrice();
    },
    // 删除
    deleteDataDisk(index) {
      this.nodeForm.buyDataDiskArr.splice(index, 1);
      this.getInput()
      this.costPrice();
    },
    //删除安全组
    deleteExceptPrice(index) {
      this.nodeForm.safeArr.splice(index, 1);
    },
    //添加安全组
    AddSafe() {
      this.nodeForm.safeArr.push({
        securityId:''
      });
    },
    selectChange() {
      let { safeArr } = this.nodeForm;
      // safeArr.push({securityId: this.nodeForm.securityId});
      if(safeArr.length === 1) {
         if(safeArr[0].securityId === this.nodeForm.securityId) {
          safeArr[safeArr.length-1].error = true;
        } else {
          safeArr[safeArr.length-1].error = false;
        }
      } else {
        for (let i = 0; i < safeArr.length -1; i++) {
          if(safeArr[i].securityId === this.nodeForm.securityId) {
            safeArr[safeArr.length-1].error = true;
          } else {
            safeArr[safeArr.length-1].error = true;
          }
          if (safeArr[i].securityId === safeArr[safeArr.length -1].securityId) {
            safeArr[safeArr.length-1].error = true;
          } else {
            safeArr[safeArr.length-1].error = false;
          }
        }
      }
      console.log(safeArr);
      this.nodeForm.safeArr = safeArr;
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
      this.costPrice();
    },
    //新建节点
    async submitOk() {
      this.loadShow = true;
      let LoginSettings = {};
      if(this.nodeForm.loginSettings === 'relation') {
        LoginSettings.KeyIds = [this.nodeForm.keyIds];
      } else if (this.nodeForm.loginSettings === 'auto') {
        LoginSettings = {};
      } else {
        LoginSettings.Password = this.nodeForm.password;
      }
      let SecurityGroupIds = [];
      SecurityGroupIds.push(this.nodeForm.securityId);
      let safeArr = this.nodeForm.safeArr;
      for(let i = 0; i < safeArr.length; i++) {
        SecurityGroupIds.push(safeArr[i].securityId);
      }
      let RunInstancePara = {
        InstanceChargeType: this.nodeForm.instanceChargeType,
        Placement: {Zone: "ap-taipei-1", ProjectId: this.nodeForm.projectId},
        InstanceType: this.nodeForm.instanceType,
        SystemDisk: {DiskType: this.nodeForm.systemDiskType, DiskSize: Number(this.nodeForm.systemSize)},
        VirtualPrivateCloud: {VpcId: this.nodeForm.groupVps, SubnetId: this.nodeForm.subnetId, AsVpcGateway: false},
        InternetAccessible: {InternetChargeType: this.nodeForm.internetChargeType,
            InternetMaxBandwidthOut: Number(this.nodeForm.internetMaxBandwidthOut),PublicIpAssigned: this.nodeForm.publicIpAssigned},
        InstanceCount: this.nodeForm.instanceCount,
        ImageId: this.nodeForm.imageId,
        InstanceName: this.nodeForm.instanceName,
        LoginSettings: LoginSettings,
        SecurityGroupIds: SecurityGroupIds,
        EnhancedService: {SecurityService: {Enabled: this.nodeForm.securityService}, MonitorService: {Enabled: this.nodeForm.monitorService}}
      };
      let buyDataDisks = this.nodeForm.buyDataDiskArr;
      if(buyDataDisks.length > 0) {
        
        let dataDisks = [];
        for(let i = 0; i < buyDataDisks.length; i++) {
          let buyDataDisk = {
            DiskType: buyDataDisks[i].dataDiskType,
            DiskSize: Number(buyDataDisks[i].dataSize)
          };
          dataDisks.push(buyDataDisk);
        }
        RunInstancePara.DataDisks = dataDisks;
      }
      let containerInput = "";
      if(this.nodeForm.containerChecked) {
        containerInput = this.nodeForm.containerInput;
      }
      
      let param = {
        Version: '2018-05-25',
        ClusterId: this.clusterId,
        RunInstancePara: JSON.stringify(RunInstancePara)
      }
      param["InstanceAdvancedSettings.DockerGraphPath"] = containerInput;
      
      param["InstanceAdvancedSettings.Labels.0.Name"] = "";
      param["InstanceAdvancedSettings.Labels.0.Value"] = "";
      param["InstanceAdvancedSettings.ExtraArgs.Kubelet.0"] = "";

      if (this.nodeForm.advancedSettingShow) {
        param["InstanceAdvancedSettings.UserScript"] = Base64.encode(
          this.nodeForm.textarea2
        );
        if(this.nodeForm.checkoutFs) {
          param["InstanceAdvancedSettings.Unschedulable"] = 1;
        } else {
          param["InstanceAdvancedSettings.Unschedulable"] = 0;
        }
      }  
      // param["InstanceAdvancedSettings.Kubelet.0"] = "";

      let buyDataDiskArr = this.nodeForm.buyDataDiskArr;
      if(buyDataDiskArr.length > 0) {
        for(let i = 0; i < buyDataDiskArr.length; i++) {
          param["InstanceAdvancedSettings.DataDisks." + i + ".DiskSize"] = Number(buyDataDiskArr[i].dataSize);
          param["InstanceAdvancedSettings.DataDisks." + i + ".DiskType"] = buyDataDiskArr[i].dataDiskType;
          param["InstanceAdvancedSettings.DataDisks." + i + ".AutoFormatAndMount"] = buyDataDiskArr[i].fomatAndMount;
          if(buyDataDiskArr[i].fomatAndMount) {
            param["InstanceAdvancedSettings.DataDisks." + i + ".FileSystem"] = buyDataDiskArr[i].fileSystem;
            param["InstanceAdvancedSettings.DataDisks." + i + ".MountTarget"] = buyDataDiskArr[i].filePath;
          }
        }
      }

      await this.axios.post(TKE_ADD_NODE, param).then(res => {
        if(res.Response.Error === undefined) {
          this.$message({
            message: "創建成功",
            type: "success",
            showClose: true,
            duration: 0
          });
          this.goBack();
          this.loadShow = false;
        } else {
          this.loadShow = false;
          let ErrTips = {
            "FailedOperation":"操作失敗",
            "InternalError": "内部錯誤",
            "InternalError.CvmCommon": "cvm配額不足,請釋放部分資源後再創建",
            "InternalError.CvmNotFound": "cvm不存在。",
            "InternalError.Db": "db錯誤。",
            "InternalError.DbAffectivedRows": "DB錯誤",
            "InternalError.DbRecordNotFound": "記錄未找到。",
            "InternalError.ImageIdNotFound": "映像未找到。",
            "InternalError.OsNotSupport": "映像OS不支持。",
            "InternalError.Param": "Param。",
            "InternalError.QuotaMaxClsLimit": "超過配額限制。",
            "InternalError.QuotaMaxNodLimit":"超過配額限制。",
            "InternalError.QuotaMaxRtLimit":"超過配額限制。",
            "InternalError.UnexceptedInternal":"内部錯誤",
            "InternalError.VpcCommon":"VPC報錯。",
            "InternalError.VpcPeerNotFound":"對等連接不存在。",
            "InternalError.VpcRecodrNotFound": "未發現vpc記錄。",
            "InvalidParameter": "參數錯誤",
            "MissingParameter":"缺少參數錯誤",
            "ResourceInUse":"資源被佔用",
            "ResourceNotFound":	"資源不存在",
            "ResourceUnavailable":	"資源不可用",
            "UnauthorizedOperation":"未授權操作",
            "UnknownParameter": "未知參數錯誤",
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
    //计算价格
    async costPrice() {
      this.loadShow = true;
      let param = {
        // DataDisks:dataDisks,
        ImageId: this.nodeForm.imageId,//镜像id
        InstanceChargeType: this.nodeForm.instanceChargeType,//付费类型
        InstanceCount: Number(this.nodeForm.instanceCount),//购买数量
        InstanceType: this.nodeForm.instanceType,//规格
        "Placement.ProjectId": this.nodeForm.projectId,
        "Placement.Zone": "ap-taipei-1",
        "SystemDisk.DiskSize": Number(this.nodeForm.systemSize),
        "SystemDisk.DiskType": this.nodeForm.systemDiskType,
        Version: "2017-03-12", 
        PurchaseSource: "MC"
      }
      //公网
      param["InternetAccessible.InternetChargeType"] = this.nodeForm.internetChargeType;
      param["InternetAccessible.InternetMaxBandwidthOut"] = Number(this.nodeForm.internetMaxBandwidthOut);
      param["InternetAccessible.PublicIpAssigned"] = this.nodeForm.publicIpAssigned;
      let buyDataDiskArr = this.nodeForm.buyDataDiskArr;
      if(buyDataDiskArr.length > 0) {
        for(let i = 0; i < buyDataDiskArr.length; i++) {
          param["DataDisks." + i + ".DiskSize"] = Number(buyDataDiskArr[i].dataSize);
          param["DataDisks." + i + ".DiskType"] = buyDataDiskArr[i].dataDiskType;
        }
      }
      if(this.nodeForm.instanceChargeType === "PREPAID") {
         //云监控、云服务
        param["EnhancedService.SecurityService.Enabled"] = this.nodeForm.securityService;
        param["EnhancedService.MonitorService.Enabled"] = this.nodeForm.monitorService;
        param["InstanceChargePrepaid.Period"] = Number(this.nodeForm.buyTime);
        param["InstanceChargePrepaid.RenewFlag"] = "NOTIFY_AND_MANUAL_RENEW";
        param["InstanceChargePrepaid.TimeUnit"] = "MONTH";
      }
      if(this.nodeForm.instanceChargeType === "POSTPAID_BY_HOUR") {
        await this.axios.post(TKE_PRICE, param).then(res => {
          if(res.Response.Error === undefined) {
            let price = res.Response.Price;
            this.nodeForm.allocationCost = price.InstancePrice.UnitPrice;
            this.nodeForm.networkCost = price.BandwidthPrice.UnitPrice;
            this.loadShow = false;
          } else {
            this.loadShow = false;
            let ErrTips = {
              "AccountQualificationRestrictions": "該請求帳戶未通過資格審計。",
              "InstancesQuotaLimitExceeded":
                "表示當前創建的實例個數超過了該帳戶允許購買的剩餘配額數。",
              "InvalidClientToken.TooLong":
                "指定的ClientToken字元串長度超出限制，必須小於等於64位元組。",
              "InvalidHostId.NotFound":
                "指定的HostId不存在，或不屬於該請求帳號所有。",
              "InvalidInstanceName.TooLong":
                "指定的InstanceName字元串長度超出限制，必須小於等於60位元組。",
              "InvalidInstanceType.Malformed":
                "指定InstanceType參數格式不合法。",
              "InvalidParameterCombination": "表示參陣列合不正確。",
              "InvalidParameterValue":
                "無效參數值。參數值格式錯誤或者參數值不被支持等。",
              "InvalidParameterValue.Range":
                "無效參數值。參數值取值範圍不合法。",
              "InvalidPassword":
                "無效密碼。指定的密碼不符合密碼複雜度限制。例如密碼長度不符合限制等。",
              "InvalidPeriod":
                "無效時長。目前只支持時長：[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 24, 36]，單位：月。",
              "InvalidPermission": "帳戶不支持該操作。",
              "InvalidZone.MismatchRegion": "指定的zone不存在。",
              "MissingParameter": "參數缺失。請求沒有帶必選參數。",
              "InvalidCloudDisk.SsdDataDiskSize": "SSD雲硬碟為數據盤時，購買大小不得小於100GB",
              "InvalidCloudDisk.Unavailable": "雲硬碟為數據盤時，購買大小必須為10的倍數"
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
      } else {
        await this.axios.post(TKE_PRICE, param).then(res => {
          if(res.Response.Error === undefined) {
            // let price = res.Response.Price;
            // this.nodeForm.networkCost = price.InstancePrice.UnitPrice.toFixed(2);
            this.loadShow = false;
          } else {
            this.loadShow = false;
            let ErrTips = {
              "AccountQualificationRestrictions": "該請求帳戶未通過資格審計。",
              "InstancesQuotaLimitExceeded":
                "表示當前創建的實例個數超過了該帳戶允許購買的剩餘配額數。",
              "InvalidClientToken.TooLong":
                "指定的ClientToken字元串長度超出限制，必須小於等於64位元組。",
              "InvalidHostId.NotFound":
                "指定的HostId不存在，或不屬於該請求帳號所有。",
              "InvalidInstanceName.TooLong":
                "指定的InstanceName字元串長度超出限制，必須小於等於60位元組。",
              "InvalidInstanceType.Malformed":
                "指定InstanceType參數格式不合法。",
              "InvalidParameterCombination": "表示參陣列合不正確。",
              "InvalidParameterValue":
                "無效參數值。參數值格式錯誤或者參數值不被支持等。",
              "InvalidParameterValue.Range":
                "無效參數值。參數值取值範圍不合法。",
              "InvalidPassword":
                "無效密碼。指定的密碼不符合密碼複雜度限制。例如密碼長度不符合限制等。",
              "InvalidPeriod":
                "無效時長。目前只支持時長：[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 24, 36]，單位：月。",
              "InvalidPermission": "帳戶不支持該操作。",
              "InvalidZone.MismatchRegion": "指定的zone不存在。",
              "MissingParameter": "參數缺失。請求沒有帶必選參數。"
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
  },
  filters: {
    ModelTypeName(val) {
      if (val === "Standard S3") {
        return "標準型S3";
      } else if (val === "Compute C3") {
        return "計算型C3";
      } else if (val === "MEM-optimized M3") {
        return "記憶體型M3";
      }
    },
    //付费模式
    instanceChargeType(val) {
      if(val) {
        if(val === 'POSTPAID_BY_HOUR') {
          return '按量計費';
        } else {
          return '包年包月';
        }
      }
    },
    OSvalue(val) {
      let _val = val.substring(0, 6).toLowerCase();
        // .trim()
        // .split(" ")[0]
        // .toLowerCase();
      if (_val === "ubuntu") {
        _val = "ubuntu";
      } else {
        _val = "root";
      }
      return _val;
    },
    //系统盘类型
    systemDiskType(val) {
      if(val) {
        if(val === 'CLOUD_PREMIUM') {
          return "高性能雲盤";
        } else {
          return "SSD雲碟";
        }
      }
    },
    //数据盘类型
    dataDiskType() {
      if(val) {
        if(val === 'CLOUD_PREMIUM') {
          return "高性能雲盤";
        } else {
          return "SSD雲碟";
        }
      }
    },
    //宽带类型
    internetChargeType(val) {
      if(val) {
        if(val === 'BANDWIDTH_POSTPAID_BY_HOUR') {
          return '按頻寬計費';
        } else {
          return '按使用流量';
        }
      }
    },
    //数据盘
    buyDataDiskArr(val) {
      let res = '';
      if(val.length > 0) {
        for(let i = 0; i< val.length; i++) {
          if(val[i].dataDiskType === 'CLOUD_PREMIUM') {
            res += '[' + (i+1) + ']高性能雲硬碟' + val[i].dataSize + 'GB;';
          } else {
            res += '[' + (i+1) + ']SSD硬碟' + val[i].dataSize + 'GB;';
          }
        }
      }
      return res = res.substring(0, res.length - 1);
    },
    ClusterVersion(val) {
      if(val) {
        return val.substring(0, 6);
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
    // margin-top:20px;
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
.box-form{
  ::v-deep.el-input__inner {
        // border: 0 none;
        border: 1px solid red;
        border-radius: 0px;
    }
}
.hide {
  display: none;
  &.active {
    display: inline;
  }
}
</style>

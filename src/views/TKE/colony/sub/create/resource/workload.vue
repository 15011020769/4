<!-- 新建Workload -->
<template>
  <div class="colony-wrap">
    <div class="tke-content-header">
      <div class="tke-grid ">
        <!-- 左侧 -->
        <div class="grid-left">
          <span class="goback" @click="()=>$router.back()">
            <i class="el-icon-back"></i>
          </span>
          <h2 class="header-title">新建Workload</h2>
        </div>
        <!-- 右侧 -->
        <div class="grid-right"></div>
      </div>
    </div>
    <div class="colony-main">
      <div class="tke-card tke-formpanel-wrap mb60">
        <el-form class="tke-form special" ref="form" :model="wl" label-position="left" label-width="120px"
                 size="mini">
          <el-form-item :label="$t('TKE.overview.mc')" prop="name" :rules="nameValidator">
            <el-input class="w200" v-model="wl.name" :placeholder="$t('TKE.subList.qsrwmc')"></el-input>
            <p>
              {{$t('TKE.subList.zczf')}}
            </p>
          </el-form-item>
          <el-form-item label="描述">
            <el-input class="w420" type="textarea" :rows="6" :placeholder="$t('TKE.subList.qsrmsxx')" v-model="wl.description">
            </el-input>
          </el-form-item>
          <!--  标签  用div包裹用于做验证   -->
          <div style="margin-bottom: 18px">
            <label style="width: 120px;vertical-align: middle;float: left;padding: 0 12px 0 0;line-height: 28px">{{$t('TKE.subList.bq')}}</label>
            <div style="margin-left: 120px;">
              <div v-for="(v,i) in wl.labels" :key="i">
                <el-form-item style="display: inline-block" label-width="0px" :prop="`labels.${i}.key`" :rules="labelKeyValidator">
                  <el-input :disabled="i===0" class="w100" v-model="v.key"></el-input>
                </el-form-item>
                =
                <el-form-item style="display: inline-block" label-width="0px" :prop="`labels.${i}.value`" :rules="labelValueValidator">
                  <el-input class="w100" v-model="v.value" prop="labels"></el-input>
                </el-form-item>
                <el-tooltip class="item" effect="light" :content="$t('TKE.subList.mrbqbksc')" placement="right"
                            :disabled="i===0">
                  <i class="el-icon-close" style="font-size:20px;margin-left:20px;cursor:pointer"
                     @click="i!==0?delLabel(i):''"></i>
                </el-tooltip>
              </div>
              <el-button type="text" size="mini" :disabled="!addLabelFlag" @click="addLabelFlag?addLabel():''">{{$t('TKE.overview.xzbl')}}</el-button>
              <p style="line-height: 28px">
                {{$t('TKE.subList.zczf')}}
              </p>
            </div>
          </div>
          <el-form-item :label="$t('TKE.overview.mmkj')">
            <el-select v-model="wl.namespace" :placeholder="$t('TKE.overview.qxz')" @change="namespaceChange">
              <el-option v-for="item in namespaceOptions" :key="item.metadata.name" :label="item.metadata.name"
                         :value="item.metadata.name">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('TKE.overview.lx')">
            <div class="form-controls" style="width:350px">
              <el-radio-group class="tke-radio-group" v-model="wl.type">
                <el-radio label="Deployment">Deployment（{{$t('TKE.subList.kkzbs')}}Pod）</el-radio>
                <el-radio label="DaemonSet">DaemonSet（{{$t('TKE.subList.zjsyx')}}Pod）</el-radio>
                <el-radio label="StatefulSet">StatefulSet（{{$t('TKE.subList.yztjyx')}}Pod）</el-radio>
                <el-radio label="CronJob">CronJob（{{$t('TKE.subList.dsyx')}}）</el-radio>
                <el-radio label="Job">Job（{{$t('TKE.subList.dcrw')}}）</el-radio>
              </el-radio-group>
            </div>
          </el-form-item>
          <el-form-item :label="$t('TKE.subList.zxcl')" v-show="wl.type=='CronJob'" :prop="'executionStrategy'" :rules="executionStrategyValidator">
            <el-input class="w192" :placeholder="$t('TKE.subList.qsrzxclr')" v-model="wl.executionStrategy"></el-input>
          </el-form-item>
          <!-- Job设置 -->
          <div style="margin-bottom: 18px" v-show="wl.type==='CronJob'||wl.type==='Job'">
            <label style="width: 120px;vertical-align: middle;float: left;padding: 0 12px 0 0;line-height: 28px">Job{{$t('TKE.overview.sz')}}</label>
            <div style="margin-left: 120px;background-color: #f2f2f2;padding: 10px;width: 350px">
              <el-form-item :label="$t('TKE.subList.cfcs')" :prop="'jobSettings.repeatNumber'" :rules="jobSettingRepeatValidator">
                <el-tooltip class="item" effect="light" :content="$t('TKE.subList.xcfzx')" placement="right">
                  <i class="el-icon-info setPosition2"></i>
                </el-tooltip>
                <el-input class="w192" v-model="wl.jobSettings.repeatNumber"></el-input>
              </el-form-item>
              <el-form-item :label="$t('TKE.subList.bxd')" :prop="'jobSettings.parallelNumber'" :rules="jobSettingParallelValidator">
                <el-tooltip class="item" effect="light" :content="$t('TKE.subList.bzxsl')" placement="right">
                  <i class="el-icon-info  setPosition2"></i>
                </el-tooltip>
                <el-input class="w192" v-model="wl.jobSettings.parallelNumber"></el-input>
              </el-form-item>
              <el-form-item :label="$t('TKE.subList.sbcqcl')">
                <el-tooltip class="item" effect="light"
                            :content="$t('TKE.subList.yctc')"
                            placement="right">
                  <i class="el-icon-info  setPosition2"></i>
                </el-tooltip>
                <el-select v-model="wl.jobSettings.failedRestartPolicy" :placeholder="$t('TKE.overview.qxz')" class="w192">
                  <el-option v-for="item in failedRestartPolicyOption"
                             :key="item" :label="item" :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
          </div>
          <!-- 数据卷（选填） -->
          <div style="margin-bottom: 18px">
            <label style="width: 120px;vertical-align: middle;float: left;padding: 0 12px 0 0;line-height: 28px">{{$t('TKE.subList.sjjxt')}}</label>
            <div style="margin-left: 120px">
              <div class="search-one" v-for="(item, index) in wl.dataVolumes" :key="index">
                <el-form-item style="display: inline-block; margin-bottom: 0px" label-width="0px">
                  <el-select v-model="item.name" :placeholder="$t('TKE.overview.qxz')">
                    <el-option v-for="item in searchOptions" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item style="display: inline-block; margin-bottom: 0px" label-width="0px">
                  <el-input class="search-input" v-model="item.name2" :placeholder="$t('TKE.subList.mcr')"></el-input>
                </el-form-item>
                <div class="search-hidden">
                  <div v-if="item.name == 'usePath'">
                    <div style="display: inline-block" v-if="item.hostPath.path === ''">{{$t('TKE.subList.zwszzjlj')}}</div>
                    <div style="display: inline-block" v-else>
                      <el-popover
                        placement="top-start"
                        width="200"
                        trigger="hover">
                        <p>{{item.hostPath.path}}</p>
                        <p>{{item.hostPath.type}}</p>
                        <div slot="reference">{{$t('TKE.subList.zjljsz')}}<i class="el-icon-warning-outline" style="cursor:pointer"></i></div>
                      </el-popover>
                    </div>
                    <el-button type="text" size="mini" @click="openPathDialog">{{$t('TKE.subList.zjljsz')}}</el-button>
                    <el-dialog :title="$t('TKE.subList.szzjlj')" :visible.sync="dialogVisiblePath" width="30%">
                      <el-form :model="wl" label-position="left" label-width="120px" size="mini">
                        <el-form-item :label="$t('TKE.subList.zjlj')" style="margin-top:10px">
                          <el-input class="w192" v-model="item.hostPath.tempPath" placeholder="如：/data/dev"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('TKE.subList.jclx')">
                          <el-select class="w192" v-model="item.hostPath.type" :placeholder="$t('TKE.overview.qxz')">
                            <el-option v-for="item in checkTypeOptions" :key="item.name" :label="item.name"
                                       :value="item.name"></el-option>
                          </el-select>
                          <p>{{checkTypeOptions.find(cItem=>cItem.name===item.hostPath.type).describe}}</p>
                        </el-form-item>
                      </el-form>
                      <div slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="()=>{item.hostPath.path=item.hostPath.tempPath; dialogVisiblePath = false}">{{$t('TKE.overview.qd')}}</el-button>
                        <el-button @click="()=>{dialogVisiblePath = false;item.hostPath.tempPath=''}">取 消</el-button>
                      </div>
                    </el-dialog>
                  </div>
                  <p v-if="item.name == 'useNFS'">
                    <el-form-item style="display: inline-block;margin-bottom: 0px" label-width="0px"
                      :prop="`dataVolumes.${index}.nfs.serverAndPath`" :rules="dataVolumesNfsServerAndPathValidator">
                      <el-input style="width: 210px" v-model="item.nfs.serverAndPath"
                                :placeholder="$t('TKE.subList.ljing')"></el-input>
                    </el-form-item>
                     </p>
                  <p v-if="item.name == 'usePVC'">
                    <el-form-item style="display: inline-block;margin-bottom: 0px" label-width="0px">
                      <el-select v-model="item.persistentVolumeClaim.claimName" :placeholder="$t('TKE.subList.qxzvpc')">
                        <el-option v-for="item in usePvcOptions" :key="item" :label="item" :value="item">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </p>
                  <div v-if="item.name == 'useYun'">
                    <div style="display:inline-block;margin-right: 10px" v-if="item.qcloudCbs.cbsDiskId">
                      {{item.qcloudCbs.cbsDiskId}}
                    </div>
                    <el-button type="text" size="mini" @click="openYunDialog">{{item.qcloudCbs.cbsDiskId?'重新選擇':'選擇雲硬碟'}}</el-button>&nbsp;&nbsp;
                    <el-tooltip class="item" effect="light" :content="$t('TKE.subList.sjjlx')" placement="top">
                      <i style="cursor:pointer" class="el-icon-warning"></i>
                    </el-tooltip>
                    <el-dialog :title="$t('TKE.subList.xzyyp')" :visible.sync="dialogVisibleYun" width="40%">
                      <div class="select-yun">
                        <el-select :value="$t('TKE.colony.tbyq')" disabled>
                          <el-option v-for="item in ['台北一區']" :key="item" :label="item" :value="item">
                          </el-option>
                        </el-select>
                        <el-input class="w192 ml10" :placeholder="$t('TKE.subList.srsjpid')" v-model="searchYun" clearable>
                          <i slot="suffix" class="el-input__icon el-icon-search"></i>
                        </el-input>
                      </div>
                      <div class="select-yun-body">
                        <el-table ref="multipleTable" :data="useYunOptions.slice((currpage - 1) * pagesize, currpage * pagesize)" tooltip-effect="dark" style="width: 100%"
                                  highlight-current-row @current-change="tableCurrentChange($event, item)">
                          <el-table-column width="55">
                            <template slot-scope="scope">
                              <el-radio v-model="item.qcloudCbs.tempCbsDiskId" :label="scope.row.DiskId">&nbsp;</el-radio>
                            </template>
                          </el-table-column>
                          <el-table-column label="ID" width="130">
                            <template slot-scope="scope">{{ scope.row.DiskId }}</template>
                          </el-table-column>
                          <el-table-column prop="name" :label="$t('TKE.overview.mc')">
                            <template slot-scope="scope">
                              <div style="width: 100%;overflow: hidden;white-space: nowrap;text-overflow: ellipsis">
                                {{ scope.row.DiskName }}
                              </div>
                            </template>
                          </el-table-column>
                          <el-table-column prop="address" label="大小" show-overflow-tooltip>
                            <template slot-scope="scope">{{ scope.row.DiskSize }}GB</template>
                          </el-table-column>
                        </el-table>
                        <!-- 分页 -->
                        <div class="pagstyle" style="height:70px;">
                          <span>共&nbsp;{{ TotalCount }}&nbsp;{{$t('TKE.colony.xiang')}}</span>
                          <div class="pagestyle_right">
                            <el-pagination :page-size="pagesize" :pager-count="7" :page-sizes="[50, 40, 30, 20, 10]"
                                           layout="sizes, prev, pager, next" @current-change="handleCurrentChange"
                                           @size-change="handleSizeChange" :total="TotalCount"></el-pagination>
                          </div>
                        </div>
                      </div>
                      <div slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="()=>{item.qcloudCbs.cbsDiskId = item.qcloudCbs.tempCbsDiskId;dialogVisibleYun = false}">{{$t('TKE.overview.qd')}}</el-button>
                        <el-button @click="()=>{dialogVisibleYun = false;item.qcloudCbs.tempCbsDiskId = item.qcloudCbs.cbsDiskId?item.qcloudCbs.cbsDiskId:''}">取 消</el-button>
                      </div>
                    </el-dialog>
                  </div>
                  <div v-if="item.name == 'useConfig'">
                    <div style="display: inline-block" v-if="item.configMap.items.length>0"></div>
                    <div style="display: inline-block" v-else>{{$t('TKE.subList.zwxz')}}ConfigMap</div>
                    <el-button type="text" size="mini" @click="openConfigMapDialog">{{$t('TKE.subList.xzpzx')}}</el-button>
                    <sc-dialog type="ConfigMap" :visible.sync="dialogVisibleConfig" :index="index" :sc-option="configMap.option" :sc-data.sync="item.configMap"></sc-dialog>
                  </div>
                  <div v-if="item.name == 'useSecret'">
                  <div style="display: inline-block" v-if="item.secret.items.length>0"></div>
                  <div style="display: inline-block" v-else>{{$t('TKE.subList.zwxz')}}Secret</div>
                    <el-button type="text" size="mini" @click="openSecretDialog">{{$t('TKE.subList.xze')}}Secret</el-button>
                    <sc-dialog type="Secret" :visible.sync="dialogVisibleSecret" :index="index" :sc-option="secrets.option" :sc-data.sync="item.secret"></sc-dialog>
                  </div>
                </div>
                <el-tooltip effect="light" :content="$t('TKE.overview.sc')" placement="top" :disabled="useDataVolumes.includes(item.name2)">
                  <i class="el-icon-close" @click="useDataVolumes.includes(item.name2)?'':delDataVolume(index)"
                     :style="{cursor: useDataVolumes.includes(item.name2)?'not-allowed':'pointer'}" ></i>
                </el-tooltip>
              </div>
              <div>
                <el-button type="text" size="mini" :disabled="yesOrnoAddDataJuan" @click="addDataVolume">
                  {{$t('TKE.subList.tjsjj')}}
                </el-button>
              </div>
              <p style="line-height: 28px">{{$t('TKE.subList.gzljzdrq')}}
                <!-- <span style="color:#409eff;cursor:pointer">使用指引</span> -->
              </p>
            </div>
          </div>
          <!-- 实例内容器 -->
          <div style="margin-bottom: 18px">
            <label style="width: 120px;vertical-align: middle;float: left;padding: 0 12px 0 0;line-height: 28px">{{$t('TKE.subList.slnrq')}}</label>
            <div style="margin-left: 120px">
              <div v-for="(v,i) in wl.instanceContent" :key="i">
                <div v-show="v.editStatus" class="case-content" style="margin-bottom: 18px">
                  <el-form-item style="margin-bottom: 0px">
                    <div style="float: right">
                      <el-tooltip effect="light" :content="$t('TKE.subList.qwcdbjx')" placement="top" :disabled="isAddContainer">
                        <i class="el-icon-check"
                           style="font-size:20px;margin-left:20px;"
                           :style="{cursor: isAddContainer?'pointer':'no-drop'}"
                           @click="isAddContainer?editInstanceContent(i):''">
                        </i>
                      </el-tooltip>
                      <el-tooltip effect="light" :content="$t('TKE.subList.bksczs')" placement="top" :disabled="wl.instanceContent.length!==1">
                        <i class="el-icon-close"
                           style="font-size:20px;margin-left:20px;cursor:pointer"
                           @click="wl.instanceContent.length!==1?delInstanceContent(i):''">
                        </i>
                      </el-tooltip>
                    </div>
                  </el-form-item>
                  <el-form-item :label="$t('TKE.overview.mc')" :rules="instanceContentNameValidator" :prop="`instanceContent.${i}.name`" >
                    <el-input class="w192" v-model="v.name" :placeholder="$t('TKE.subList.srrqmc')" ></el-input>
                    <p>{{$t('TKE.subList.qsrrqmc')}}</p>
                  </el-form-item>
                  <el-form-item :label="$t('TKE.overview.jx')" :rules="instanceContentMirrorImgValidator" :prop="`instanceContent.${i}.mirrorImg`">
                    <el-input class="w192" v-model="v.mirrorImg"></el-input>
                    <el-button type="text" size="mini" @click="SelectMirrorImgFlag=true">{{$t('TKE.subList.xzjxiang')}}</el-button>
                    </el-form-item>
                  <el-form-item :label="$t('TKE.subList.jxbbt')">
                    <el-input class="w192" v-model="v.versions"></el-input>
                  </el-form-item>
                  <el-form-item :label="$t('TKE.subList.jxlqcl')">
                    <template>
                      <el-radio-group v-model="v.mirrorPullTactics" style="margin-bottom: 5px;">
                        <el-radio-button label="Always">Always</el-radio-button>
                        <el-radio-button label="IfNotPresent">IfNotPresent</el-radio-button>
                        <el-radio-button label="Never">Never</el-radio-button>
                      </el-radio-group>
                      <p v-show="v.mirrorPullTactics === ''">{{$t('TKE.subList.bszlqjx')}}</p>
                      <p v-show="v.mirrorPullTactics === 'Always'">{{$t('TKE.subList.yclqjx')}}</p>
                      <p v-show="v.mirrorPullTactics === 'IfNotPresent'">{{$t('TKE.subList.mrsybdjx')}}</p>
                      <p v-show="v.mirrorPullTactics === 'Never'">{{$t('TKE.subList.zsybdjx')}}</p>
                    </template>
                  </el-form-item>
                  <div style="margin-bottom: 18px" v-show="v.showMountPoint">
                    <label style="width: 120px;vertical-align: middle;float: left;padding: 0 12px 0 0;line-height: 28px">{{$t('TKE.subList.gzd')}}</label>
                    <div style="margin-left: 120px; position: relative">
                      <div class="bottom10" v-for="(mItem, mIndex) in v.mountPoints" :key="mItem.key">
                        <el-form-item label-width="0px" style="display: inline-block;margin-bottom: 0px;">
                          <el-select v-model="mItem.dataVolumeValue" :placeholder="$t('TKE.subList.qxzsjj')" value-key="name">
                            <el-option v-for="(dItem, dIndex) in mountPointArr"
                                       :key="dIndex" :label="dItem.name" :value="dItem">
                            </el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item label-width="0px" style="display: inline-block;margin-bottom: 0px;margin-left: 10px">
                          <el-input :placeholder="$t('TKE.subList.mblj')" v-model="mItem.targetPath"></el-input>
                        </el-form-item>
                        <el-form-item label-width="0px" style="display: inline-block;margin-bottom: 0px;margin-left: 10px">
                          <el-input :placeholder="$t('TKE.subList.gzzlj')" v-model="mItem.mountSubPath"></el-input>
                        </el-form-item>
                        <el-form-item label-width="0px" style="display: inline-block;margin-bottom: 0px;margin-left: 10px">
                          <el-select v-model="mItem.permission">
                            <el-option :label="$t('TKE.subList.dxie')" value="dx" selected></el-option>
                            <el-option :label="$t('TKE.subList.zdu')" value="zd"></el-option>
                          </el-select>
                        </el-form-item>
                        <i class="el-icon-close" style="font-size:20px;margin-left:20px;cursor:pointer" @click="delMountPoint(i, mIndex)"></i>
                      </div>
                      <el-button type="text" size="mini" @click='addMountPoint(i)'>{{$t('TKE.subList.tjgzd')}}</el-button>
                    </div>
                  </div>
                  <el-form-item :label="$t('TKE.subList.cpuncxz')">
                    <div class="cpu-limit">
                      <div>
                        <p>CPU限制</p>
                        <div style="display:flex">
                          <div class="cpu-limit2">
                            <span>request</span>
                            <el-input class="w192" v-model="v.requestCpu"></el-input>
                          </div>
                          -
                          <div class="cpu-limit2">
                            <span>limit</span>
                            <el-input class="w192" v-model="v.limitCpu"></el-input>
                          </div>
                          核
                        </div>
                      </div>
                      <div>
                        <p>{{$t('TKE.subList.ncxz')}}</p>
                        <div style="display:flex">
                          <div class="cpu-limit2">
                            <span>request</span>
                            <el-input class="w192" v-model="v.requestMemory"></el-input>
                          </div>
                          -
                          <div class="cpu-limit2">
                            <span>limit</span>
                            <el-input class="w192" v-model="v.limitMemory"></el-input>
                          </div>
                          Mib
                        </div>
                      </div>
                    </div>
                    <p style="margin-top:10px;">
                      {{$t('TKE.subList.jdzyxhgd')}}</p>
                  </el-form-item>
                  <el-form-item label="GPU限制">
                    <el-input-number v-model="v.gpuNum" size="small" :min="0"></el-input-number> {{$t('TKE.overview.ge')}}
                  </el-form-item>
                  <div style="margin-bottom: 18px">
                    <label style="width: 120px;vertical-align: middle;float: left;padding: 0 12px 0 0;line-height: 28px">{{$t('TKE.subList.hjbl')}}</label>
                    <div style="margin-left: 120px; position: relative">
                      <el-tooltip class="item" effect="light" :content="$t('TKE.subList.szrqbl')" placement="top">
                        <i class="el-icon-info  setPosition"></i>
                      </el-tooltip>
                      <!-- 新增变量 -->
                      <div v-for="val in v.environmentVar" :key="val.onlyId">
                        <el-form-item style="display: inline-block;margin-bottom: 0px" label-width="0px">
                          <el-input class="w100" v-model="val.key" :placeholder="$t('TKE.overview.blm')"></el-input>
                        </el-form-item>
                        =
                        <el-form-item style="display: inline-block;margin-bottom: 0px" label-width="0px">
                          <el-input class="w192" v-model="val.value" :placeholder="$t('TKE.overview.blz')"></el-input>
                        </el-form-item>
                        <i class="el-icon-close" style="font-size:20px;margin-left:20px;cursor:pointer" @click="delEnvironmentVar(i, val.onlyId)"></i>
                      </div>
                      <el-divider v-if="v.environmentVar.length>0&&v.citeCs.length>0"></el-divider>
                      <!-- 引用ConfigMap/Secret -->
                      <div v-for="(val,idx) in v.citeCs" :key="val.key">
                        <el-form-item style="display: inline-block;margin-bottom: 0px" label-width="0px">
                          <el-select v-model="val.value1" class="w100" :placeholder="$t('TKE.subList.qxzlx')" @change="citeCsValue1Change($event, val)">
                            <el-option v-for="item in val.option1" :key="item" :label="item" :value="item">
                            </el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item style="display: inline-block;margin-bottom: 0px" label-width="0px">
                          <el-select v-model="val.value2" class="w100" style="margin:0px 10px;"
                                     :placeholder="$t('TKE.subList.qxzzy')" :disabled="val.value1===''" @change="citeCsValue2Change($event, val)">
                            <el-option v-for="item in val.option2" :key="item.name" :label="item.name"
                                       :value="item.name">
                            </el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item style="display: inline-block;margin-bottom: 0px" label-width="0px">
                          <el-select v-model="val.value3" class="w100" :placeholder="$t('TKE.subList.qxzk')" :disabled="val.value2===''">
                            <el-option v-for="item in val.option3" :key="item" :label="item"
                                       :value="item">
                            </el-option>
                          </el-select></el-form-item>
                        以
                        <el-form-item style="display: inline-block;margin-bottom: 0px" label-width="0px" :prop="`instanceContent.${i}.citeCs.${idx}.input1`" :rules="citeCsInput1Validator">
                          <el-input class="w150" v-model="val.input1"></el-input>
                        </el-form-item>
                        {{$t('TKE.subList.wbm')}}
                        <i class="el-icon-close" style="font-size:20px;margin-left:20px;cursor:pointer" @click="delCiteCs(i, val.key)"></i>
                      </div>
                      <el-button type="text" size="mini" @click='addEnvironmentVar(i)'>{{$t('TKE.overview.xzbl')}}</el-button>
                      <el-button type="text" size="mini" @click='addCiteCs(i)'>引用ConfigMap/Secret</el-button>
                      <p>{{$t('TKE.subList.znbh')}}</p>
                    </div>
                  </div>
                  <div v-show="v.disAdvancedSetting">
                    <el-form-item :label="$t('TKE.subList.gzml')">
                      <el-input class="w192" v-model="v.workDirectory"></el-input>
                      <p> {{$t('TKE.subList.zdgzml')}}
                        <!-- <a href="#">查看详情</a> -->
                      </p>
                    </el-form-item>
                    <el-form-item :label="$t('TKE.subList.yxml')">
                      <el-input type="textarea" class="w400" v-model="v.runCommand" rows="3" resize="none"></el-input>
                      <p> {{$t('TKE.subList.kzsrml')}}，
                        <!-- <a href="#">查看详情</a> -->
                      </p>
                    </el-form-item>
                    <el-form-item :label="$t('TKE.subList.yxcs')">
                      <el-input type="textarea" class="w400" v-model="v.runParam" rows="3" resize="none"></el-input>
                      <p>{{$t('TKE.subList.srcs')}}，
                        <!-- <a href="#">查看详情</a> -->
                      </p>
                    </el-form-item>
                    <el-form-item :label="$t('TKE.subList.rqjkjc')">
                      <el-tooltip class="item" effect="light" :content="$t('TKE.subList.jkjcbzzcyz')" placement="top">
                        <i class="el-icon-info  setPosition2"></i>
                      </el-tooltip>
                      <p>
                        <el-checkbox v-model="v.surviveExamine">{{$t('TKE.subList.chjc')}}</el-checkbox>
                        <span>{{$t('TKE.subList.jcrqsfzc')}}</span>
                      </p>
                      <!-- 存活检查 -->
                      <div v-show="v.surviveExamine" class="from-1">
                        <!-- 存活检查 -->
                        <div style="background: #f2f2f2;padding: 6px;">
                          <el-form-item :label="$t('TKE.subList.jcff')">
                            <el-select v-model="v.surviveExamineContent.inspectMethodValue">
                              <el-option v-for="item in v.surviveExamineContent.inspectMethodOption" :key="item" :label="item"
                                         :value="item">
                              </el-option>
                            </el-select>
                          </el-form-item>
                          <el-form-item :label="$t('TKE.subList.jcxy')" v-show="v.surviveExamineContent.inspectMethodValue==='HTTP請求檢查'">
                            <el-select v-model="v.surviveExamineContent.inspectProtocolValue">
                              <el-option v-for="item in v.surviveExamineContent.inspectProtocolOption" :key="item" :label="item"
                                         :value="item">
                              </el-option>
                            </el-select>
                          </el-form-item>
                          <el-form-item :label="$t('TKE.subList.zxml')" v-show="v.surviveExamineContent.inspectMethodValue==='執行命令檢查'">
                            <el-input type="textarea" class="w192" v-model="v.surviveExamineContent.executiveOrder" rows="4" resize="none"></el-input>
                          </el-form-item>
                          <el-form-item :label="$t('TKE.subList.jcdk')" v-show="v.surviveExamineContent.inspectMethodValue!=='執行命令檢查'">
                            <el-input class="w100" v-model="v.surviveExamineContent.inspectPort"></el-input>
                            <span>端口{{$t('TKE.colony.fw')}}：1~65535</span>
                          </el-form-item>
                          <el-form-item :label="$t('TKE.subList.qqlj')" v-show="v.surviveExamineContent.inspectMethodValue==='HTTP請求檢查'">
                            <el-input class="w100" v-model="v.surviveExamineContent.requestPath"></el-input>
                          </el-form-item>
                          <el-form-item :label="$t('TKE.subList.qdys')">
                            <el-tooltip effect="light" :content="$t('TKE.subList.rqysqd')" placement="right">
                              <i class="el-icon-info  setPosition"></i>
                            </el-tooltip>
                            <el-input class="w100" v-model="v.surviveExamineContent.startDelay"></el-input>
                            <span>{{$t('TKE.colony.fw')}}：0~60秒</span>
                          </el-form-item>
                          <el-form-item :label="$t('TKE.subList.xycs')">
                            <el-tooltip effect="light" :content="$t('TKE.subList.jcxyzcsj')" placement="right">
                              <i class="el-icon-info  setPosition"></i>
                            </el-tooltip>
                            <el-input class="w100" v-model="v.surviveExamineContent.responseTimeout"></el-input>
                            <span>{{$t('TKE.colony.fw')}}：2~60秒</span>
                          </el-form-item>
                          <el-form-item :label="$t('TKE.subList.jgsj')">
                            <el-tooltip effect="light" :content="$t('TKE.subList.jkjcsjjg')" placement="right">
                              <i class="el-icon-info  setPosition"></i>
                            </el-tooltip>
                            <el-input class="w100" v-model="v.surviveExamineContent.intervalTime"></el-input>
                            <span>{{$t('TKE.colony.fw')}}：2~300秒</span>
                          </el-form-item>
                          <el-form-item :label="$t('TKE.subList.jkyz')">
                            <el-tooltip effect="light" :content="$t('TKE.subList.hdrqsbdcg')" placement="right">
                              <i class="el-icon-info  setPosition"></i>
                            </el-tooltip>
                            <el-input class="w100" v-model="v.surviveExamineContent.healthyThreshold" :disabled="true"></el-input>
                            <span>{{$t('TKE.colony.fw')}}：1次</span>
                          </el-form-item>
                          <el-form-item :label="$t('TKE.subList.bjkyz')">
                            <el-tooltip effect="light" :content="$t('TKE.subList.hdrqcgdsb')" placement="right">
                              <i class="el-icon-info  setPosition3"></i>
                            </el-tooltip>
                            <el-input class="w100" v-model="v.surviveExamineContent.unhealthyThreshold"></el-input>
                            <span>{{$t('TKE.colony.fw')}}：1~10次</span>
                          </el-form-item>
                        </div>
                      </div>
                      <p>
                        <el-checkbox v-model="v.readyToCheck">{{$t('TKE.subList.jxjc')}}</el-checkbox>
                        <span>{{$t('TKE.subList.jcrqsfjx')}}</span>
                      </p>
                      <!-- 存活检查 -->
                      <div v-show="v.readyToCheck" class="from-1">
                        <!-- 就绪检查 -->
                        <div style="background: #f2f2f2;padding: 6px;">
                          <el-form-item :label="$t('TKE.subList.jcff')">
                            <el-select v-model="v.readyToCheckContent.inspectMethodValue">
                              <el-option v-for="item in v.readyToCheckContent.inspectMethodOption" :key="item" :label="item"
                                         :value="item">
                              </el-option>
                            </el-select>
                          </el-form-item>
                          <el-form-item :label="$t('TKE.subList.jcxy')" v-show="v.readyToCheckContent.inspectMethodValue==='HTTP请求检查'">
                            <el-select v-model="v.readyToCheckContent.inspectProtocolValue">
                              <el-option v-for="item in v.readyToCheckContent.inspectProtocolOption" :key="item" :label="item"
                                         :value="item">
                              </el-option>
                            </el-select>
                          </el-form-item>
                          <el-form-item :label="$t('TKE.subList.zxml')" v-show="v.readyToCheckContent.inspectMethodValue==='執行命令檢查'">
                            <el-input type="textarea" class="w192" v-model="v.readyToCheckContent.executiveOrder" rows="4" resize="none"></el-input>
                          </el-form-item>
                          <el-form-item :label="$t('TKE.subList.jcdk')" v-show="v.readyToCheckContent.inspectMethodValue!=='執行命令檢查'">
                            <el-input class="w100" v-model="v.readyToCheckContent.inspectPort"></el-input>
                            <span>端口{{$t('TKE.colony.fw')}}：1~65535</span>
                          </el-form-item>
                          <el-form-item :label="$t('TKE.subList.qqlj')" v-show="v.readyToCheckContent.inspectMethodValue==='HTTP請求檢查'">
                            <el-input class="w100" v-model="v.readyToCheckContent.requestPath"></el-input>
                          </el-form-item>
                          <el-form-item :label="$t('TKE.subList.qdys')">
                            <el-tooltip effect="light" :content="$t('TKE.subList.rqysqd')" placement="right">
                              <i class="el-icon-info  setPosition"></i>
                            </el-tooltip>
                            <el-input class="w100" v-model="v.readyToCheckContent.startDelay"></el-input>
                            <span>{{$t('TKE.colony.fw')}}：0~60秒</span>
                          </el-form-item>
                          <el-form-item :label="$t('TKE.subList.xycs')">
                            <el-tooltip effect="light" :content="$t('TKE.subList.jcxyzcsj')" placement="right">
                              <i class="el-icon-info  setPosition"></i>
                            </el-tooltip>
                            <el-input class="w100" v-model="v.readyToCheckContent.responseTimeout"></el-input>
                            <span>{{$t('TKE.colony.fw')}}：2~60秒</span>
                          </el-form-item>
                          <el-form-item :label="$t('TKE.subList.jgsj')">
                            <el-tooltip effect="light" :content="$t('TKE.subList.jkjcsjjg')" placement="right">
                              <i class="el-icon-info  setPosition"></i>
                            </el-tooltip>
                            <el-input class="w100" v-model="v.readyToCheckContent.intervalTime"></el-input>
                            <span>{{$t('TKE.colony.fw')}}：2~300秒</span>
                          </el-form-item>
                          <el-form-item :label="$t('TKE.subList.jkyz')">
                            <el-tooltip effect="light" :content="$t('TKE.subList.hdrqsbdcg')" placement="right">
                              <i class="el-icon-info  setPosition"></i>
                            </el-tooltip>
                            <el-input class="w100" v-model="v.readyToCheckContent.healthyThreshold"></el-input>
                            <span>{{$t('TKE.colony.fw')}}：1~10次</span>
                          </el-form-item>
                          <el-form-item :label="$t('TKE.subList.bjkyz')">
                            <el-tooltip effect="light" :content="$t('TKE.subList.hdrqcgdsb')" placement="right">
                              <i class="el-icon-info  setPosition3"></i>
                            </el-tooltip>
                            <el-input class="w100" v-model="v.readyToCheckContent.unhealthyThreshold"></el-input>
                            <span>{{$t('TKE.colony.fw')}}：1~10次</span>
                          </el-form-item>
                        </div>
                      </div>
                      <p>{{$t('TKE.subList.cjjkjc')}}
                        <!-- <a href="#">使用指引</a> -->
                      </p>
                    </el-form-item>
                    <el-form-item :label="$t('TKE.subList.tqjrq')">
                      <el-switch active-color="#006eff" inactive-color="#888" v-model="v.privilegeLevelContainer"></el-switch>
                      <p> {{$t('TKE.subList.rqkqtq')}} </p>
                    </el-form-item>
                  </div>
                  <div>
                    <el-button type="text" size="mini" @click="v.disAdvancedSetting = !v.disAdvancedSetting">
                      {{v.disAdvancedSetting?'隱藏高級設置':'顯示高級設置'}}
                    </el-button>
                  </div>
                </div>
                <div v-show="!v.editStatus" class="case-content" style="margin-bottom: 18px">
                  <el-form-item style="margin-bottom: 0px" label-width="0px">
                    <div style="float: left">{{v.name}} ({{v.mirrorImg}}) </div>
                    <div style="float: right">
                      <el-tooltip effect="light" :content="$t('TKE.subList.qwcdbjx')" placement="top" :disabled="isAddContainer">
                        <i class="el-icon-edit-outline"
                           style="font-size:20px;margin-left:20px;"
                           :style="{cursor: isAddContainer?'pointer':'no-drop'}"
                           @click="isAddContainer?editInstanceContent(i):''">
                        </i>
                      </el-tooltip>
                      <el-tooltip effect="light" :content="$t('TKE.subList.bksczs')" placement="top" :disabled="wl.instanceContent.length!==1">
                        <i class="el-icon-close"
                           style="font-size:20px;margin-left:20px;cursor:pointer"
                           @click="wl.instanceContent.length!==1?delInstanceContent(i):''">
                        </i>
                      </el-tooltip>
                    </div>
                  </el-form-item>
                </div>
                <SelectMirrorImg :dialogVisible.sync='SelectMirrorImgFlag' @confirm='confirmMirrorImg($event, i)'></SelectMirrorImg>
              </div>
              <p class="addcontent" :style="{color: isAddContainer?'#006eff':'#bbbbbb'}" @click="isAddContainer?addInstanceContent():''">添加容器</p>
              <p>{{$t('TKE.subList.zyxg')}}</p>
            </div>
          </div>
          <!-- 实例数量 -->
          <div style="margin-bottom: 18px" v-show="wl.type === 'Deployment' || wl.type === 'StatefulSet'">
            <label style="width: 120px;vertical-align: middle;float: left;padding: 0 12px 0 0;line-height: 28px">{{$t('TKE.subList.slsl')}}</label>
            <div style="margin-left: 120px">
              <el-form-item label-width="0px">
                <el-radio-group v-model="wl.caseNum">
                  <el-radio label="handAdjust">{{$t('TKE.subList.sdtj')}}</el-radio>
                  <el-radio label="autoAdjust">{{$t('TKE.subList.zdtjie')}}</el-radio>
                </el-radio-group>
              </el-form-item>
              <!-- 手动调节 -->
              <div v-show="wl.caseNum==='handAdjust'">
                <p style="line-height: 28px">{{$t('TKE.subList.zjsd')}}</p>
                <div class="case-content" style="background-color: #f2f2f2;margin-top:6px;padding:20px;">
                  <el-form-item :label="$t('TKE.subList.slsl')" style="margin-bottom: 0px">
                    <el-input-number v-model="wl.replicas" size="small" :min="0"></el-input-number> {{$t('TKE.overview.ge')}}
                  </el-form-item>
                </div>
              </div>
              <!-- 自动调节 -->
              <div v-show="wl.caseNum==='autoAdjust'">
                <p style="line-height: 28px">{{$t('TKE.subList.mzrysdtj')}}
                  <!-- <a href="#">查看更多</a> -->
                </p>
                <div class="case-content" style="background-color: #f2f2f2;margin-top:6px;padding:20px;">
                  <el-form-item :label="$t('TKE.subList.cfcl')">
                    <div class="flex bottom10" v-for="(item,index) in wl.touchTactics" :key="index">
                      <el-select class="w100" v-model="item.touch1">
                        <el-option v-for="item in touchOptions1" :key="item.value" :label="item.label"
                                   :value="item.value">
                        </el-option>
                      </el-select>
                      <el-select class="w192  margin-middle" v-model="item.touch2">
                        <el-option v-for="touth2item in item.touch2Option" :key="touth2item.value" :label="touth2item.label"
                                   :value="touth2item.value">
                        </el-option>
                      </el-select>
                      <el-input class="w100" v-model="item.size"></el-input>
                      <span v-if='item.touch2 === 1'>核</span>
                      <el-tooltip
                        v-if='item.touch2 === 2||item.touch2 === 3||item.touch2 === 4||item.touch2 === 7||item.touch2 === 8||item.touch2 === 9||item.touch2 === 10||item.touch2 === 11||item.touch2 === 12'
                        class="item" effect="light" :content="$t('TKE.subList.yzfw')" placement="right">
                        <span>%</span>
                      </el-tooltip>
                      <span v-if='item.touch2 === 5||item.touch2 === 6'>MiB</span>
                      <span v-if='item.touch2 === 13||item.touch2 === 14||item.touch2 === 19||item.touch2 === 20'>KB/s</span>
                      <span v-if='item.touch2 === 15||item.touch2 === 16'>次/s</span>
                      <span v-if='item.touch2 === 17||item.touch2 === 18'>Mbps</span>
                      <span v-if='item.touch2 === 21||item.touch2 === 22'>{{$t('TKE.overview.ge')}}</span>
                      <el-tooltip effect="light" :content="$t('TKE.subList.zsblygzb')" placement="right" :disabled="wl.touchTactics.length!==1">
                        <i class="el-icon-close" style="font-size:20px;margin-left:20px;cursor:pointer" @click="wl.touchTactics.length>1?delTouchTactics(item.key):''"></i>
                      </el-tooltip>
                    </div>
                    <el-button type="text" size="mini" @click="addTouchTactics">{{$t('TKE.subList.xzzb')}}</el-button>
                  </el-form-item>
                  <el-form-item :label="$t('TKE.subList.slfw')">
                    <el-input class="w100" v-model="wl.caseScope1"></el-input> ~ <el-input class="w100" v-model="wl.caseScope2"></el-input>
                    <p>{{$t('TKE.subList.bccsdfw')}}</p>
                  </el-form-item>
                </div>
              </div>
            </div>
          </div>
          <!-- 高级设置 -->
          <div v-show="highLevelSetShow2">
            <!-- imagePullSecrets -->
            <div style="margin-bottom: 18px">
              <label style="width: 120px;vertical-align: middle;float: left;padding: 0 12px 0 0;line-height: 28px">imagePullSecrets</label>
              <div style="margin-left: 120px">
                <el-form-item label-width="0px">
                  <el-select v-model="wl.imagePullSecrets.value1"
                             :disabled="wl.imagePullSecrets.option1.length == 0"
                             :placeholder="wl.imagePullSecrets.option1.length == 0 ? '暫無數據' : '請選擇'">
                    <el-option v-for="item in wl.imagePullSecrets.option1" :key="item" :label="item" :value="item"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label-width="0px">
                  <el-select v-model="wl.imagePullSecrets.value2"
                             :disabled="wl.imagePullSecrets.option2.length == 0"
                             :placeholder="wl.imagePullSecrets.option2.length == 0 ? '暫無數據' : '請選擇'">
                    <el-option v-for="item in wl.imagePullSecrets.option2" :key="item" :label="item" :value="item"></el-option>
                  </el-select>
                </el-form-item>
                <el-button type="text" size="mini" :disabled="true">添加</el-button>
              </div>
            </div>
            <div v-show="wl.type!=='CronJob'&&wl.type!=='Job'">
              <el-form-item label="更新方式">
                <el-select v-model="wl.updateWay">
                  <el-option :label="$t('TKE.subList.gdgxtj')" :value="$t('TKE.subList.gdgxtj')"></el-option>
                  <el-option label="快速更新" value="快速更新"></el-option>
                </el-select>
                <p v-show="wl.updateWay=='滾動更新（推薦）'"> {{$t('TKE.subList.dslzggx')}}</p>
                <p v-show="wl.updateWay=='快速更新'"> {{$t('TKE.subList.zjgbsysl')}}</p>
              </el-form-item>
              <div v-show="wl.updateWay=='滾動更新（推薦）'">
                <el-form-item :label="$t('TKE.subList.gxjg')">
                  <el-input class="w100" v-model="wl.updateInterval"></el-input> 秒
                </el-form-item>
                <el-form-item label="更新策略" v-show="wl.type==='Deployment'">
                  <el-radio-group v-model="wl.updateTactics">
                    <el-radio :label="1">{{$t('TKE.subList.qdtz')}}</el-radio>
                    <el-radio :label="2">{{$t('TKE.subList.tzqd')}}</el-radio>
                    <el-radio :label="3">{{$t('TKE.subList.zdy')}}</el-radio>
                  </el-radio-group>
                  <p v-show="wl.updateTactics===1">{{$t('TKE.subList.sfdzjqbk')}}</p>
                </el-form-item>
                <!-- 策略配置 -->
                <div style="margin-bottom: 18px">
                  <label style="width: 120px;vertical-align: middle;float: left;padding: 0 12px 0 0;line-height: 28px">{{$t('TKE.subList.clpz')}}</label>
                  <div style="margin-left: 120px;width: 350px;" class="form-controls">
                    <el-form-item label="Pods" v-show="wl.type === 'Deployment' && wl.updateTactics !== 3">
                      <el-input class="w192" :placeholder="$t('TKE.subList.zzs')"
                                v-model="wl.configTacticsPods"></el-input>
                      <p>{{$t('TKE.subList.plqdtz')}}</p>
                    </el-form-item>
                    <el-form-item label="MaxSurge" v-show="wl.type === 'Deployment' && wl.updateTactics === 3">
                      <el-input class="w192" :placeholder="$t('TKE.subList.zzs')"
                                v-model="wl.configTacticsMaxSurge"></el-input>
                      <p>{{$t('TKE.subList.yxccsl')}}</p>
                    </el-form-item>
                    <el-form-item label="MaxUnavailable"
                                  v-show="(wl.type === 'Deployment' && wl.updateTactics === 3) || wl.type === 'DaemonSet'">
                      <el-input class="w192" :placeholder="$t('TKE.subList.zzs')"
                                v-model="wl.configTacticsMaxUnavailable"></el-input>
                      <p>{{$t('TKE.subList.yxzdbkysl')}}</p>
                    </el-form-item>
                    <el-form-item label="Partition"
                                  v-show="wl.type === 'StatefulSet'">
                      <el-input class="w192" :placeholder="$t('TKE.subList.zzs')"
                                v-model="wl.configTacticsPartition"></el-input>
                      <p>{{$t('TKE.subList.yxzdbkysl')}}</p>
                    </el-form-item>
                  </div>
                </div>
              </div>
            </div>
            <div style="margin-bottom: 18px">
              <label style="width: 120px;vertical-align: middle;float: left;padding: 0 12px 0 0;line-height: 28px">{{$t('TKE.subList.jdddcl')}}</label>
              <div style="margin-left: 120px">
                <el-form-item label-width="0px">
                  <el-radio-group v-model="wl.nodeTactics">
                    <el-radio :label="1">{{$t('TKE.subList.bsyddcl')}}</el-radio>
                    <el-radio :label="2">{{$t('TKE.subList.zdjddd')}}</el-radio>
                    <el-radio :label="3">{{$t('TKE.subList.zdyddgz')}}</el-radio>
                  </el-radio-group>
                </el-form-item>
                <p>{{$t('TKE.subList.gjddgz')}}</p>
              </div>
            </div>
            <!-- 指定节点调度 -->
            <div style="margin-bottom: 18px" v-show="wl.nodeTactics===2">
              <div style="margin-left: 120px;width: 350px" class="form-controls">
                <p style="line-height: 28px">{{$t('TKE.colony.tbyq')}}</p>
                <el-form-item label-width="0px">
                  <el-checkbox-group v-model="wl.specifyNodeDispatchValue">
                    <div v-for="item in specifyNodeDispatchOption" :key="item.id">
                      <el-checkbox :label="item.id">{{item.id}}({{item.name}})</el-checkbox>
                    </div>
                  </el-checkbox-group>
                </el-form-item>
              </div>
            </div>
            <!-- 自定义调度规则 -->
            <!-- 强制满足条件 -->
            <div style="margin-bottom: 18px" v-show="wl.nodeTactics===3">
              <label style="width: 120px;vertical-align: middle;float: left;padding: 0 12px 0 0;line-height: 28px">{{$t('TKE.subList.qzmztj')}}</label>
              <div style="margin-left: 120px; position: relative">
                <el-tooltip class="item" effect="light" :content="$t('TKE.subList.ddqj')"
                            placement="right">
                  <i class="el-icon-info  setPosition2"></i>
                </el-tooltip>
                <div class="case-content" style="margin-bottom: 18px" v-for="(val1,index1) in wl.mustCondition" :key="index1">
                  <i class="el-icon-close set-i1" @click="delMustCondition(idx)"></i>
                  <div style="clear: both; margin-bottom:10px"></div>
                  <div>
                    <label style="width: 120px;vertical-align: middle;float: left;padding: 0 12px 0 0;line-height: 28px">{{$t('TKE.subList.tiaoj')}}</label>
                    <div style="margin-left: 120px; position: relative">
                      <el-tooltip class="item" effect="light" :content="$t('TKE.subList.dggztsmz')" placement="right">
                        <i class="el-icon-info setPosition"></i>
                      </el-tooltip>
                      <div v-for="(val2,index2) in val1" :key="index2">
                        <el-form-item style="display: inline-block" label-width="0px">
                          <el-input class="w150" v-model="val2.name" placeholder="Label Key"></el-input>
                        </el-form-item>
                        <el-form-item style="display: inline-block" label-width="0px">
                          <el-select v-model="val2.connect" class="w100" style="margin:0px 10px;">
                            <el-option v-for="item in conditionOptions" :key="item.value" :label="item.label"
                                       :value="item.value">
                            </el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item style="display: inline-block" label-width="0px">
                          <el-input class="w150" v-model="val2.rule"
                                    :placeholder="['Exists', 'DoesNotExist'].includes(val2.connect)?'DoesNotExist,Exists操作符不需要填寫value':'多個Label Value請以 \';\' 分隔符隔開'"
                                    :disabled="['Exists', 'DoesNotExist'].includes(val2.connect)"></el-input>
                        </el-form-item>
                        <el-tooltip class="item" effect="light" :content="$t('TKE.subList.zspzygxzq')" placement="right" :disabled="val1.length!==1">
                          <i class="el-icon-close" style="font-size: 18px; padding-left: 20px;cursor:pointer" @click="val1.length>1?delMustRule(index1, index2):''"></i>
                        </el-tooltip>
                      </div>
                      <p>
                        <el-button type="text" size="mini" @click="addMustRule(index1)">{{$t('TKE.subList.tjgz')}}</el-button>
                      </p>
                    </div>
                  </div>
                </div>
                <el-button type="text" size="mini" @click="addMustCondition">{{$t('TKE.subList.tjtj')}}</el-button>
              </div>
            </div>
            <!-- 尽量满足条件 -->
            <div style="margin-bottom: 18px" v-show="wl.nodeTactics===3">
              <label style="width: 120px;vertical-align: middle;float: left;padding: 0 12px 0 0;line-height: 28px">{{$t('TKE.subList.jlmztj')}}</label>
              <div style="margin-left: 120px;position: relative">
                <el-tooltip class="item" effect="light" :content="$t('TKE.subList.sjddryjd')"
                            placement="right">
                  <i class="el-icon-info  setPosition2"></i>
                </el-tooltip>
                <div class="case-content" style="margin-bottom: 18px"  v-for="(val1,index1) in wl.needCondition" :key="index1">
                  <i class="el-icon-close set-i1" @click="delNeedCondition(idx)"></i>
                  <div style="clear: both; margin-bottom:10px"></div>
                  <div>
                    <el-form-item :label="$t('TKE.subList.quanz')">
                      <el-input v-model="val1.weight" class="w150" :placeholder="$t('TKE.subList.qzhong')"></el-input>
                    </el-form-item>
                  </div>
                  <div>
                    <label style="width: 120px;vertical-align: middle;float: left;padding: 0 12px 0 0;line-height: 28px">{{$t('TKE.subList.tiaoj')}}</label>
                    <div style="margin-left: 120px; position: relative">
                      <el-tooltip class="item" effect="light" :content="$t('TKE.subList.dggztsmz')" placement="right">
                        <i class="el-icon-info setPosition"></i>
                      </el-tooltip>
                      <div v-for="(val2,index2) in val1.arr" :key="index2">
                        <el-form-item style="display: inline-block" label-width="0px">
                          <el-input class="w150" v-model="val2.name" placeholder="Label Key"></el-input>
                        </el-form-item>
                        <el-form-item style="display: inline-block" label-width="0px">
                          <el-select v-model="val2.connect" class="w100" style="margin:0px 10px;">
                            <el-option v-for="item in conditionOptions" :key="item.value" :label="item.label"
                                       :value="item.value">
                            </el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item style="display: inline-block" label-width="0px">
                          <el-input class="w150" v-model="val2.rule"
                                    :placeholder="['Exists', 'DoesNotExist'].includes(val2.connect)?'DoesNotExist,Exists操作符不需要填寫value':'多個Label Value請以 \';\' 分隔符隔開'"
                                    :disabled="['Exists', 'DoesNotExist'].includes(val2.connect)"></el-input>
                        </el-form-item>
                        <el-tooltip class="item" effect="light" :content="$t('TKE.subList.zspzygxzq')" placement="right" :disabled="val1.arr.length!==1">
                          <i class="el-icon-close" style="font-size: 18px; padding-left: 20px;cursor:pointer" @click="val1.arr.length>1?delNeedRule(index1, index2):''"></i>
                        </el-tooltip>
                      </div>
                      <p>
                        <el-button type="text" size="mini" @click="addNeedRule(index1)">{{$t('TKE.subList.tjgz')}}</el-button>
                      </p>
                    </div>
                  </div>
                </div>
                <el-button type="text" size="mini" @click="addNeedCondition">{{$t('TKE.subList.tjtj')}}</el-button>
              </div>
            </div>
          </div>
          <div><el-button type="text" size="mini" @click="highLevelSetShow2=!highLevelSetShow2">{{highLevelSetShow2?'隱藏高級設置':'顯示高級設置'}}</el-button></div>
          <el-divider></el-divider>
          <div v-show="wl.type === 'Deployment' || wl.type==='StatefulSet'">
            <h3 style="margin-bottom:11px;">{{$t('TKE.subList.fwsz')}}(Service)</h3>
            <el-form-item label="Service">
              <el-checkbox v-model="wl.serviceEnbel">{{$t('TKE.subList.qiy')}}</el-checkbox>
            </el-form-item>
            <div v-if="wl.serviceEnbel">
              <el-form-item :label="$t('TKE.subList.fwfwfs')">
                <el-radio v-model="wl.serviceAccess" label="1">{{$t('TKE.subList.tggwfw')}}</el-radio>
                <el-radio v-model="wl.serviceAccess" label="2">{{$t('TKE.subList.jzjqnfw')}}</el-radio>
                <el-radio v-model="wl.serviceAccess" label="3">{{$t('TKE.subList.vpcnwfw')}}</el-radio>
                <el-radio v-model="wl.serviceAccess" label="4">{{$t('TKE.subList.zjdkfw')}}</el-radio>
                <!-- <a href="" style="padding-left:10px;">如何选择</a><i class="el-icon-edit-outline"></i> -->
              </el-form-item>
              <!-- 服务访问方式介绍 -->
              <div style="margin-bottom: 18px">
                <div style="margin-left: 120px">
                  <el-form-item v-if="wl.serviceAccess=='1'" label-width="0px">
                    <div>
                      {{$t('TKE.subList.zdcjgw')}}（<span class="text-warning">0.02元/{{$t('TKE.colony.xs')}}</span>）{{$t('TKE.subList.xzgwfw')}}。
                    </div>
                    <div>
                      {{$t('TKE.subList.lyzf')}}，
                      <!-- <a href="">查看详情</a><i
                      class="el-icon-edit-outline"></i> -->
                    </div>
                  </el-form-item>
                  <el-form-item v-if="wl.serviceAccess=='2'" label-width="0px">
                    <div>{{$t('TKE.subList.bzfwwlglx')}}。</div>
                    <div>
                      <el-checkbox v-model="wl.handlessChecked">Headless&nbsp;Service</el-checkbox>
                      <el-tooltip :content="$t('TKE.subList.yyjz')"
                                  placement="top" effect="light">
                        <i class="el-icon-question" style="margin-left:5px;"></i>
                      </el-tooltip>
                      （Headless&nbsp;Service{{$t('TKE.subList.zzccjsxz')}}，<span class="text-error">{{$t('TKE.subList.bzcbgfw')}}）</span>
                    </div>
                  </el-form-item>
                  <el-form-item v-if="wl.serviceAccess=='3'" label-width="0px">
                    <div>{{$t('TKE.subList.nwfwxs')}}。</div>
                    <div>支持Ingress
                      <!-- <a href="">查看详情</a><i class="el-icon-edit-outline"></i> -->
                    </div>
                  </el-form-item>
                  <el-form-item v-if="wl.serviceAccess=='4'" label-width="0px">
                    <div>{{$t('TKE.subList.zjdkys')}}。</div>
                    <div>支持Ingress
                      <!-- <a href="">查看详情</a><i class="el-icon-edit-outline"></i> -->
                    </div>
                  </el-form-item>
                </div>
              </div>
              <div style="margin-bottom: 18px" v-show="wl.serviceAccess === '3'">
                <div style="margin-left: 120px">
                  <el-form-item style="display: inline-block" label-width="0px">
                    <el-select v-model="wl.subnetOneValue" :placeholder="$t('TKE.overview.qxz')" :disabled="true">
                      <el-option
                        v-for="item in subnetOneOption"
                        :key="item"
                        :label="item"
                        :value="item">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item style="display: inline-block" label-width="0px">
                    <el-select v-model="wl.subnetTwoValue" :placeholder="$t('TKE.overview.qxz')">
                      <el-option
                        v-for="item in subnetTwoOption"
                        :key="item.SubnetName"
                        :label="item.SubnetName"
                        :value="item.SubnetName">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <span>共{{subnetOrder.TotalIpAddressCount}}{{$t('TKE.colony.gzw')}}{{subnetOrder.AvailableIpAddressCount}}{{$t('TKE.overview.ge')}}可用</span>
                  <p>{{$t('TKE.colony.wlbhs')}}<el-button type="text" size="mini">{{$t('TKE.colony.xjzw')}}</el-button></p>
                </div>
              </div>
              <el-form-item :label="$t('TKE.subList.fzjhq')" v-show="wl.serviceAccess=='1' || wl.serviceAccess=='3'">
                <div class="radio1">
                  <el-radio-group v-model='wl.loadBalance' style="margin-bottom: 5px;">
                    <el-radio-button label="1">{{$t('TKE.subList.zdcjian')}}</el-radio-button>
                    <el-radio-button label="2">使用已有</el-radio-button>
                  </el-radio-group>
                </div>
                <p v-show="wl.loadBalance=='1'">{{$t('TKE.subList.zdcj')}}，
                  <!-- <a href="javascript:;">查看更多说明</a> -->
                </p>
                <div v-show="wl.loadBalance=='2'">
                  <div>{{$t('TKE.subList.qwsdxgjt')}}
                    <!-- <el-button type="text" size="mini">查看更多说明</el-button> -->
                  </div>
                  <el-select v-show="wl.loadBalance=='2'" v-model="wl.describeLoadBalancersValue" :placeholder="$t('TKE.overview.qxz')" class="borderRed">
                    <el-option
                      v-for="item in describeLoadBalancersOption"
                      :key="item.LoadBalancerId"
                      :label="`${item.LoadBalancerId} (${item.LoadBalancerName})`"
                      :value="item.LoadBalancerId">
                    </el-option>
                  </el-select>
                </div>
              </el-form-item>
              <div style="margin-bottom: 18px">
                <label style="width: 120px;vertical-align: middle;float: left;padding: 0 12px 0 0;line-height: 28px">{{$t('TKE.subList.dkys')}}</label>
                <div style="margin-left: 120px">
                  <div class="port" :style="{width: wl.serviceAccess === '4'?'950px':'680px'}">
                    <!-- 头部 -->
                    <div class="flex">
                      <div style="width:140px;padding-left:14px">{{$t('TKE.subList.xy')}}
                        <el-tooltip :content="$t('TKE.subList.xybnhhsy')" placement="top" effect="light">
                          <i class="el-icon-warning"></i>
                        </el-tooltip>
                      </div>
                      <div style="width:250px;">{{$t('TKE.subList.rqdk')}}
                        <el-tooltip :content="$t('TKE.subList.dkfw')" placement="top" effect="light">
                          <i class="el-icon-warning"></i>
                        </el-tooltip>
                      </div>
                      <div style="width:250px;"  v-if="wl.serviceAccess === '4'">{{$t('TKE.subList.zjdk')}}
                        <el-tooltip :content="$t('TKE.subList.btzdfp')" placement="top" effect="light">
                          <i class="el-icon-warning"></i>
                        </el-tooltip>
                      </div>
                      <div>{{$t('TKE.subList.fwdk')}}
                        <el-tooltip :content="$t('TKE.subList.ktgfwm')" placement="top" effect="light">
                          <i class="el-icon-warning"></i>
                        </el-tooltip>
                      </div>
                    </div>
                    <!-- 内容 -->
                    <div style="border-top:1px solid #ddd;padding: 10px;">
                      <div style="padding:5px 0;" v-for="(val,index) in wl.portMapping" :key="index">
                        <el-form-item style="display: inline-block" label-width="0px">
                          <el-select class="w100" v-model="val.portValue" :placeholder="$t('TKE.overview.qxz')">
                            <el-option
                              v-for="item in protocolOption"
                              :key="item"
                              :label="item"
                              :value="item">
                            </el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item class="w250" style="padding-left:30px;display: inline-block" label-width="0px" :prop="`portMapping.${index}.conPort`" :rules="portMappingConPortValidator">
                          <el-input v-model="val.conPort"
                                    :placeholder="$t('TKE.subList.rqnyycxjt')"></el-input>
                        </el-form-item>
                        <el-form-item style="display: inline-block" label-width="0px" v-if="wl.serviceAccess === '4'">
                          <el-input class="w250" style="padding-left:30px;" v-model="val.host"
                                    :placeholder="$t('TKE.subList.fanw')"></el-input>
                        </el-form-item>
                        <el-form-item class="w250" style="padding-left:30px;display: inline-block" label-width="0px" :prop="`portMapping.${index}.servicePort`" :rules="portMappingServicePortValidator">
                          <el-input v-model="val.servicePort"
                                    :placeholder="$t('TKE.subList.jyydkyz')"></el-input>
                        </el-form-item>
                        <el-tooltip class="item" effect="dark" :content="$t('TKE.subList.bnsc')" placement="right"
                                    :disabled="wl.portMapping!==1">
                          <i style="font-size:18px;padding-left:20px;" class="el-icon-close"
                             @click="wl.portMapping.length>1?removeProtMapping(it): ''"></i>
                        </el-tooltip>
                      </div>
                    </div>
                  </div>
                  <el-button type="text" size="mini" @click="addProtMapping()">{{$t('TKE.subList.tjdkys')}}</el-button>
                </div>
              </div>
              <!-- 高级设置 -->
              <div v-if="wl.isShowAdvancedSet">
                <el-form-item label-width="150px" label="ExtermalTrafficPolicy">
                  <el-radio v-model="wl.ETP" label="Cluster">Cluster</el-radio>
                  <el-radio v-model="wl.ETP" label="Local">Local</el-radio>
                  <div v-if="wl.ETP==='Cluster'">{{$t('TKE.subList.mrjhzf')}}</div>
                  <div v-if="wl.ETP==='Local'">
                    {{$t('TKE.subList.ngblly')}}
                  </div>
                </el-form-item>
                <el-form-item label-width="150px" label="Session Affinity">
                  <el-radio v-model="wl.SA" label="ClienIP">ClienIP</el-radio>
                  <el-radio v-model="wl.SA" label="None">None</el-radio>
                  <p v-if="wl.SA === 'ClienIP'">{{$t('TKE.subList.jyly')}}</p>
                </el-form-item>
                <el-form-item v-if="wl.SA==='ClienIP'" label-width="150px" :label="$t('TKE.subList.zdhhbcsj')">
                  <el-input v-model="wl.maxSessionTime" class="w200"></el-input>
                  <div>{{$t('TKE.subList.hhbcsjfw')}}</div>
                </el-form-item>
              </div>
              <el-button type="text" size="mini" @click="wl.isShowAdvancedSet = !wl.isShowAdvancedSet">{{wl.isShowAdvancedSet?'隱藏高級設置':'顯示高級設置'}}</el-button>
            </div>
          </div>
        </el-form>
        <!-- 底部 -->
        <div class="tke-formpanel-footer">
          <el-button size="small" type="primary" @click="submitAdd()">{{$t('TKE.subList.cj')}}Workload</el-button>
          <el-button size="small" @click="()=>$router.back()">取消</el-button>
          <div class="tke-fe-alert tke-fe-alert--error" v-if="submitErrorMessage">{{submitErrorMessage}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
import Service from '../service/components/Service'
import SelectMirrorImg from './components/selectMirrorImg'
import { ErrorTips } from '@/components/ErrorTips'
import workloadMixin from './workloadMixin'
import {
  ALL_CITY,
  POINT_REQUEST,
  ZONE_CVM2_LIST,
  TKE_COLONY_LIST,
  TKE_DELETE_XS,
  TKE_EDSCRIBELOADBALANCERS,
  TKE_EXIST_NODES,
  JOB_ID,
  DISK_LIST,
  TKE_VPC_METWORK,
  TKE_GETTKEDATAJOB,
  TKE_GETTKEDATARESULT,
  TKE_WORKER_METWORK
} from '@/constants'
import ScDialog from './components/scdialog'

export default {
  name: 'workloadCreate',
  mixins: [workloadMixin],
  data () {
    return {
      clusterId: '', // 集群id
      namespaceOptions: [], // 命名空间列表
      vpcId: '',
      loadShow: false, // 是否显示加载
      addLabelFlag: false, // 是否可以新建标签
      failedRestartPolicyOption: ['OnFailure', 'Never'],
      specifyNodeDispatchOption: [], // 指定节点调度
      subnetOneOption: [], // LB所在子网 option1
      subnetTwoOption: [], // LB所在子网 option2
      subnetOrder: {}, // LB所在子网 显示子网IP,剩余可用
      describeLoadBalancersOption: [], // 负载均衡数组
      describeLoadBalancers: [], // 负载均衡未筛选的数组
      protocolOption: ['TCP', 'UDP'], // 协议 option
      jobId: '',
      isAddContainer: false, // 是否可以点击 添加容器
      wl: {
        name: '', // 名称
        description: '', // 描述
        labels: [{ key: 'k8s-app', value: '' }], // 标签
        type: '', // 类型
        namespace: '', // 命名空间
        executionStrategy: '', // 执行策略
        jobSettings: {
          repeatNumber: 1,
          parallelNumber: 1,
          failedRestartPolicy: 'OnFailure'
        },
        instanceContent: [], // 实例内容器
        dataVolumes: [],
        caseNum: 'handAdjust',
        replicas: 1, // 实例数量-》手动调节-》实例数量
        touchTactics: [], // 实例数量-》自动调节-》触发策略
        caseScope1: '', // 实例数量-》自动调节-》实例范围
        caseScope2: '',
        imagePullSecrets: {
          option1: [],
          value1: '',
          option2: [],
          value2: ''
        },
        updateWay: '滾動更新（推薦）',
        updateTactics: 1, // 更新策略 单选
        updateInterval: 0, // 更新间隔
        configTacticsPods: 1, // 配置策略-》pods (出现条件：type === 'Deployment' && updateTactics !== 3)
        configTacticsMaxSurge: '25%', // 配置策略-》MaxSurge (出现条件：type === 'Deployment' && updateTactics === 3)
        configTacticsMaxUnavailable: '25%', // 配置策略-》MaxUnavailable (出现条件：(type === 'Deployment' && updateTactics === 3) || type === 'DaemonSet')
        configTacticsPartition: '0', // 配置策略-》Partition (出现条件：type === 'StatefulSet')
        mustCondition: [], // 强制满足条件
        needCondition: [], // 尽量满足条件
        nodeTactics: 1, // 节点调度 单选
        specifyNodeDispatchValue: [], // 指定节点调度 选中项
        serviceEnbel: true, // 是否启用service
        serviceAccess: '1', // 服务访问方式 单选
        handlessChecked: false, // 仅在集群内访问 多选按钮
        subnetOneValue: '', // LB所在子网 value1
        subnetTwoValue: '', // LB所在子网 value2
        loadBalance: '1', // 负载均衡器 1.自动创建 2.使用已有
        portMapping: [], // 端口映射 数组
        isShowAdvancedSet: false, // 访问设置 显示隐藏高级设置
        describeLoadBalancersValue: '暫無數據', // 负载均衡值
        ETP: 'Cluster', // 访问设置-》高级设置-》ExternalTrafficPolicy
        SA: 'None', // 访问设置-》高级设置-》Session Affinity
        maxSessionTime: 30, // 最大会话保持时间
        pointList: [],
        mountPath: '',
        subPath: '',
        pointName: ''
      },
      // 实例数量自动调节下拉框内容, // 触发策略
      touchOptions1: [
        {
          value: 1,
          label: 'CPU'
        }, {
          value: 2,
          label: '記憶體'
        }, {
          value: 3,
          label: '硬碟'
        }, {
          value: 4,
          label: '網路'
        }
      ],
      touchOptions2: [
        [{
          value: 1,
          label: 'CPU使用量',
          type: 'k8s_pod_cpu_core_used'
        }, {
          value: 2,
          label: 'CPU利用率(佔節點)',
          type: 'k8s_pod_rate_cpu_core_used_node'
        }, {
          value: 3,
          label: 'CPU利用率(佔Request)',
          type: 'k8s_pod_rate_cpu_core_used_request'
        }, {
          value: 4,
          label: 'CPU利用率(佔Limit)',
          type: 'k8s_pod_rate_cpu_core_used_limit'
        }],
        [{
          value: 5,
          label: '記憶體使用量',
          type: 'k8s_pod_mem_usage_bytes'
        }, {
          value: 6,
          label: '記憶體使用量(不含Cache)',
          type: 'k8s_pod_mem_no_cache_bytes'
        }, {
          value: 7,
          label: '記憶體使用量(佔節點)',
          type: 'k8s_pod_rate_mem_usage_node'
        }, {
          value: 8,
          label: '記憶體使用量(佔節點、不含Cache)',
          type: 'k8s_pod_rate_mem_no_cache_node'
        }, {
          value: 9,
          label: '記憶體使用量(佔Request)',
          type: 'k8s_pod_rate_mem_usage_request'
        }, {
          value: 10,
          label: '記憶體使用量(佔Request、不含Cache)',
          type: 'k8s_pod_rate_mem_no_cache_request'
        }, {
          value: 11,
          label: '記憶體使用量(佔Limit)',
          type: 'k8s_pod_rate_mem_usage_limit'
        }, {
          value: 12,
          label: '記憶體使用量(佔Limit、不含Cache)',
          type: 'k8s_pod_rate_mem_no_cache_limit'
        }],
        [{
          value: 13,
          label: '硬碟寫流量',
          type: 'k8s_pod_fs_write_bytes'
        }, {
          value: 14,
          label: '硬碟讀流量',
          type: 'k8s_pod_fs_read_bytes'
        }, {
          value: 15,
          label: '硬碟讀IOPS',
          type: 'k8s_pod_fs_read_times'
        }, {
          value: 16,
          label: '硬碟寫IOPS',
          type: 'k8s_pod_fs_write_times'
        }],
        [{
          value: 17,
          label: '網路出頻寬',
          type: 'k8s_pod_network_receive_bytes_bw'
        }, {
          value: 18,
          label: '網路入頻寬',
          type: 'k8s_pod_network_transmit_bytes_bw'
        }, {
          value: 19,
          label: '網路出流量',
          type: 'k8s_pod_network_receive_bytes'
        }, {
          value: 20,
          label: '網路入流量',
          type: 'k8s_pod_network_transmit_bytes'
        }, {
          value: 21,
          label: '網路出包量',
          type: 'k8s_pod_network_receive_packets'
        }, {
          value: 22,
          label: '網路入包量',
          type: 'k8s_pod_network_transmit_packets'
        }]
      ],
      isDisMountPoint: false, // 是否显示挂载点
      yesOrnoAddDataJuan: false,
      input: '',
      searchOptions: [
        {
          value: 'useMenu',
          label: '使用臨時目錄'
        }, {
          value: 'usePath',
          label: '使用主機路徑'
        }, {
          value: 'useNFS',
          label: '使用NFS盤'
        }, {
          value: 'usePVC',
          label: '使用已有PVC'
        }, {
          value: 'useYun',
          label: '使用雲硬碟'
        }, {
          value: 'useConfig',
          label: '使用ConfigMap'
        }, {
          value: 'useSecret',
          label: '使用Secret'
        }
      ],
      // 条件
      conditionOptions: [
        {
          value: 'In',
          label: 'In'
        }, {
          value: 'NotIn',
          label: 'NotIn'
        }, {
          value: 'Exists',
          label: 'Exists'
        }, {
          value: 'DoesNotExist',
          label: 'DoesNotExist'
        }, {
          value: 'Gt',
          label: 'Gt'
        }, {
          value: 'Lt',
          label: 'Lt'
        }
      ],
      condition: [{
        name: '',
        rule: '',
        connect: 'In'
      }],
      value: '',
      usePvcOptions: [],
      useYunOptions: [],
      checkTypeOptions: [
        { name: 'NoChecks', describe: '不對指定路徑做任何檢查' },
        { name: 'DirectoryOrCreate', describe: '如果給定路徑中不存在任何內容，則將根據需要創建一個空目錄，且許可權設置為0755' },
        { name: 'Directory', describe: '目錄必須存在於指定路徑中' },
        { name: 'FileOrCreate', describe: '如果給定路徑中不存在任何內容，則會根據需要創建一個空文件，且許可權設置為0644' },
        { name: 'File', describe: '文件必須存在於指定路徑中' },
        { name: 'Socket', describe: 'UNIX socket 必須存在於指定路徑中' },
        { name: 'CharDevice', describe: '字元設備必須存在於指定路徑中' },
        { name: 'BlockDevice', describe: '塊設備必須存在於指定路徑中' }
      ],
      tableData: [],
      // 分页
      TotalCount: 0,
      pagesize: 10,
      currpage: 1,
      searchYun: '',
      dialogVisiblePath: false,
      dialogVisibleYun: false,
      dialogVisibleConfig: false,
      dialogVisibleSecret: false,
      highLevelSetShow: false,
      highLevelSetShow2: false, // 是否显示高级设置
      SelectMirrorImgFlag: false,
      secrets: {}, // 引用ConfigMap/Secret secrets
      configMap: {}, // 引用ConfigMap/Secret ConfigMap
      describeClustersInstances: [],
      submitErrorMessage: '',
      mountPointArr: [],
      useDataVolumes: [] // 使用中的的数据卷
    }
  },
  components: { ScDialog, Service, SelectMirrorImg },
  watch: {
    // 监听标签
    'wl.name': {
      handler: function (val) {
        this.wl.labels[0].value = val
      }
    },
    'wl.labels': {
      handler: function (val) {
        let addLabelFlag = true
        val.forEach(item => {
          if (item.key === '' || item.value === '') addLabelFlag = false
        })
        this.addLabelFlag = addLabelFlag
      },
      deep: true
    },
    'wl.subnetTwoValue': {
      handler: function (val) {
        this.subnetOrder = this.subnetTwoOption.find(item => {
          return item.SubnetName === val
        })
      }
    },
    'wl.instanceContent': {
      handler: function (val) {
        let isAddContainer = true
        let useDataVolumes = []
        val.forEach(item => {
          let completed = true
          let { name, mirrorImg, environmentVar, citeCs, disAdvancedSetting,
            surviveExamine, readyToCheck, surviveExamineContent, mountPoints } = item
          if (name === '' || mirrorImg === '') {
            completed = false
          }
          if (environmentVar.length > 0) { // 新增变量
            for (let i = 0; i < environmentVar.length; i++) {
              if (environmentVar[i].key === '') {
                completed = false
              }
            }
          }
          if (citeCs.length > 0) { // 引用ConfigMap/Secret
            for (let i = 0; i < citeCs.length; i++) {
              let { value1, value2, value3, input1 } = citeCs[i]
              if (value1 === '' || value2 === '' || value3 === '' || input1 === '') {
                completed = false
              }
            }
          }
          if (disAdvancedSetting) { // 高级设置为显示时
            if (surviveExamine) { // 存活检查
              let { inspectMethodOption, executiveOrder, responseTimeout, intervalTime, unhealthyThreshold, inspectPort } = surviveExamineContent
              if (inspectMethodOption === '執行命令檢查') {
                if (executiveOrder === '' || responseTimeout === '' || intervalTime === '' || unhealthyThreshold === '') {
                  completed = false
                }
              } else {
                if (inspectPort === '') {
                  completed = false
                }
              }
            }
            if (readyToCheck) { // 就绪检查
              let { inspectMethodOption, executiveOrder, responseTimeout, intervalTime, healthyThreshold, unhealthyThreshold, inspectPort } = readyToCheck
              if (inspectMethodOption === '執行命令檢查') {
                if (executiveOrder === '' || responseTimeout === '' || intervalTime === '' || healthyThreshold === '' || unhealthyThreshold === '') {
                  completed = false
                }
              } else {
                if (inspectPort === '') {
                  completed = false
                }
              }
            }
          }
          if (!completed) {
            isAddContainer = false
          }
          let oneMountArr = mountPoints.filter(mItem => {
            return mItem.dataVolumeValue.name !== undefined
          }).map(mItem => {
            return mItem.dataVolumeValue.name
          })
          useDataVolumes = [...useDataVolumes, ...oneMountArr]
          item.completed = completed
        })
        this.useDataVolumes = useDataVolumes
        console.log('useDataVolumes', useDataVolumes)
        this.isAddContainer = isAddContainer
      },
      deep: true
    },
    'wl.touchTactics': {
      handler: function (newVal) {
        newVal.forEach(newItem => {
          newItem.touch2Option = this.touchOptions2[newItem.touch1 - 1]
          let isExistence = true
          newItem.touch2Option.forEach(item => {
            if (item.value === newItem.touch2) {
              isExistence = false
            }
          })
          if (isExistence) {
            newItem.touch2 = newItem.touch2Option[0].value
          }
        })
      },
      immediate: true,
      deep: true
    },
    'wl.serviceAccess': {
      handler: function (val) {
        this.changeServiceAccess()
      }
    },
    'wl.mustCondition': {
      handler: function (val) {
        console.log(val)
      },
      deep: true
    },
    'wl.dataVolumes': {
      handler: function (val) {
        let panDuan = false
        let mountPointArr = []
        for (let i = 0; i < val.length; i++) {
          if (val[i].name2 === '') {
            if (!panDuan) panDuan = true
            continue
          }
          if (val[i].name === 'useMenu') {
            mountPointArr.push({ type: 'useMenu', name: val[i].name2 })
          } else if (val[i].name === 'usePath') {
            if (val[i].hostPath.path === '') {
              if (!panDuan) panDuan = true
            } else {
              mountPointArr.push({ type: 'usePath', name: val[i].name2 })
            }
          } else if (val[i].name === 'useNFS') {
            if (val[i].nfs.serverAndPath === '') {
              if (!panDuan) panDuan = true
            } else {
              mountPointArr.push({ type: 'useNFS', name: val[i].name2 })
            }
          } else if (val[i].name === 'usePVC') {
            if (val[i].persistentVolumeClaim.claimName === '') {
              if (!panDuan) panDuan = true
            } else {
              mountPointArr.push({ type: 'usePVC', name: val[i].name2 })
            }
          } else if (val[i].name === 'useYun') {
            if (val[i].qcloudCbs.cbsDiskId === '') {
              if (!panDuan) panDuan = true
            } else {
              mountPointArr.push({ type: 'useYun', name: val[i].name2 })
            }
          } else if (val[i].name === 'useConfig') {
            if (val[i].configMap.name === '' || (val[i].configMap.name !== '' && val[i].configMap.checked !== 'all' && val[i].configMap.items.length < 1)) {
              if (!panDuan) panDuan = true
            } else {
              mountPointArr.push({ type: 'useConfig', name: val[i].name2 })
            }
          } else if (val[i].name === 'useSecret') {
            if (val[i].secret.name === '' || (val[i].secret.name !== '' && val[i].secret.checked !== 'all' && val[i].secret.items.length < 1)) {
              if (!panDuan) panDuan = true
            } else {
              mountPointArr.push({ type: 'useSecret', name: val[i].name2 })
            }
          }
        }
        this.yesOrnoAddDataJuan = panDuan
        this.mountPointArr = mountPointArr
        this.wl.instanceContent = this.wl.instanceContent.map(item => {
          item.showMountPoint = mountPointArr.length > 0
          return item
        })
      },
      deep: true
    }
  },
  created () {
    // 从路由获取类型
    let { type, clusterId, spaceName } = this.$route.query
    console.log(this.$route.query)
    this.wl.type = type
    this.clusterId = clusterId
    this.wl.namespace = spaceName
    this.initNetworkRequery()
    this.addProtMapping()
    this.addTouchTactics()
    this.addInstanceContent()
  },
  methods: {
    initNetworkRequery: async function () {
      this.getZoneCvmList()
      await this.getColonyList()
      await this.getDescribeVpcs()
      await this.getDescribeSubnets()
      this.getStorageClasses()
      this.getConfigmaps()
      this.getSecrets()
      this.getPersistentvolumeclaims()
      await this.getDescribeClusterInstances()
      await this.getDescribeInstances()
      this.getDescribeLoadBalancers()
      await this.getTkeDataJob()
      await this.getTkeDataResult()
      this.getNodes()
      this.getDescribeDisks()
      this.getNameSpaceInfo()
    },
    getZoneCvmList: async function () {
      await this.axios.post(ZONE_CVM2_LIST, { Version: '2017-03-12' }).then(res => {
        this.axiosUtils(res, () => {
          console.log('cvm2/DescribeZones', JSON.stringify(res))
        })
      })
    },
    // 获取集群列表
    getColonyList: async function () {
      let param = {
        'ClusterIds.0': this.clusterId,
        Version: '2018-05-25'
      }
      await this.axios.post(TKE_COLONY_LIST, param).then(res => {
        this.axiosUtils(res, () => {
          this.vpcId = res.Response.Clusters[0].ClusterNetworkSettings.VpcId
        })
      })
    },
    getStorageClasses: async function () {
      let param = {
        Method: 'GET',
        Path: '/apis/storage.k8s.io/v1/storageclasses',
        Version: '2018-05-25',
        ClusterName: this.clusterId
      }
      await this.axios.post(POINT_REQUEST, param).then(res => {
        this.axiosUtils(res, () => {
          let ResponseBody = res.Response.ResponseBody
          console.log('getStorageClasses', JSON.parse(ResponseBody))
        })
      })
    },
    getConfigmaps: async function () {
      let param = {
        Method: 'GET',
        Path: `/api/v1/namespaces/${this.wl.namespace}/configmaps`,
        Version: '2018-05-25',
        ClusterName: this.clusterId
      }
      await this.axios.post(POINT_REQUEST, param).then(res => {
        this.axiosUtils(res, () => {
          let ResponseBody = res.Response.ResponseBody
          let result = JSON.parse(ResponseBody)
          let option = result.items.map(item => {
            return { name: item.metadata.name, option: Object.keys(item.data) }
          })
          this.configMap = JSON.parse(ResponseBody)
          this.configMap.option = option
        })
      })
    },
    getSecrets: async function () {
      let param = {
        Method: 'GET',
        Path: `/api/v1/namespaces/${this.wl.namespace}/secrets`,
        Version: '2018-05-25',
        ClusterName: this.clusterId
      }
      await this.axios.post(POINT_REQUEST, param).then(res => {
        this.axiosUtils(res, () => {
          let ResponseBody = res.Response.ResponseBody
          let result = JSON.parse(ResponseBody)
          let option = result.items.map(item => {
            return { name: item.metadata.name, option: Object.keys(item.data) }
          })
          this.secrets = JSON.parse(ResponseBody)
          this.secrets.option = option
        })
      })
    },
    getPersistentvolumeclaims: async function () {
      let param = {
        Method: 'GET',
        Path: `/api/v1/namespaces/${this.wl.namespace}/persistentvolumeclaims`,
        Version: '2018-05-25',
        ClusterName: this.clusterId
      }
      await this.axios.post(POINT_REQUEST, param).then(res => {
        this.axiosUtils(res, () => {
          let ResponseBody = res.Response.ResponseBody
          // this.usePvcOptions =
          let resObj = JSON.parse(ResponseBody)
          this.usePvcOptions = resObj.items.map(item => {
            return item.metadata.name
          })
        })
      })
    },
    getDescribeClusterInstances: async function () {
      let param = {
        ClusterId: this.clusterId,
        Offset: 0,
        Limit: 20,
        Version: '2018-05-25',
        InstanceRole: 'WORKER'
      }
      await this.axios.post(TKE_DELETE_XS, param).then(res => {
        this.axiosUtils(res, () => {
          this.describeClustersInstances = res.Response.InstanceSet
        })
      })
    },
    // 获取负载均衡器
    getDescribeLoadBalancers: async function () {
      let param = {
        Version: '2018-03-17',
        Forward: 1,
        Offset: 0,
        Limit: 100
      }
      await this.axios.post(TKE_EDSCRIBELOADBALANCERS, param).then(res => {
        this.axiosUtils(res, () => {
          let { Response: { LoadBalancerSet } } = res
          let arr = LoadBalancerSet.filter(item => item.VpcId === this.vpcId)
          arr.forEach((item, index) => {
            let { LoadBalancerId, LoadBalancerName, LoadBalancerType } = item
            this.describeLoadBalancers.push({ LoadBalancerId, LoadBalancerName, LoadBalancerType })
          })
          this.changeServiceAccess()
        })
      })
    },
    changeServiceAccess: function () {
      let { serviceAccess } = this.wl
      this.describeLoadBalancersOption = []
      this.wl.describeLoadBalancersValue = '暫無數據'
      let oneDes = []
      switch (serviceAccess) {
        case '1':
          oneDes = this.describeLoadBalancers.filter(item => item.LoadBalancerType === 'OPEN')
          break
        case '3':
          oneDes = this.describeLoadBalancers.filter(item => item.LoadBalancerType === 'INTERNAL')
          break
      }
      this.describeLoadBalancersOption = oneDes
      if (oneDes.length !== 0) {
        this.wl.describeLoadBalancersValue = oneDes[0].LoadBalancerId
      }
    },
    getDescribeInstances: async function () {
      let param = {
        Version: '2017-03-12',
        Limit: 20
      }
      this.describeClustersInstances.forEach((item, index) => {
        param[`InstanceIds.${index}`] = item.InstanceId
      })
      await this.axios.post(TKE_EXIST_NODES, param).then(res => {
        this.axiosUtils(res, () => {
          let { Response: { InstanceSet } } = res
          this.specifyNodeDispatchOption = InstanceSet.map(item => {
            return { id: item.InstanceId, name: item.InstanceName, PrivateIpAddresses: item.PrivateIpAddresses }
          })
        })
      })
    },
    getTkeDataJob: async function () {
      let param = {
        'Conditions.0': JSON.stringify(['tke_cluster_instance_id', '=', this.clusterId]),
        'Conditions.1': JSON.stringify(['node_role', '=', 'Node']),
        EndTime: new Date().getTime(),
        'Fields.0': 'avg(k8s_node_cpu_core_request_total)',
        'Fields.1': 'avg(k8s_node_memory_request_bytes_total)',
        'GroupBys.0': 'timestamp(60s)',
        'GroupBys.1': 'unInstanceId',
        Limit: 65535,
        Module: '/front/v1',
        NamespaceName: 'k8s_node',
        Offset: 0,
        Order: 'desc',
        OrderBy: 'timestamp',
        StartTime: new Date().getTime(),
        Version: '2019-06-06'
      }
      await this.axios.post(TKE_GETTKEDATAJOB, param).then(res => {
        this.axiosUtils(res, () => {
          this.jobId = res.Response.JobId
        })
      })
    },
    getNodes: async function () {
      let param = {
        Method: 'GET',
        Path: '/api/v1/nodes',
        Version: '2018-05-25',
        ClusterName: this.clusterId
      }
      await this.axios.post(POINT_REQUEST, param).then(res => {
        this.axiosUtils(res, () => {
          let ResponseBody = res.Response.ResponseBody
          console.log('/api/v1/nodes', JSON.parse(ResponseBody))
        })
      })
    },
    getDescribeDisks: async function () {
      let param = {
        'Version': '2017-03-12',
        'Offset': 0,
        'Limit': 20,
        'Filters.0.Name': 'disk-usage',
        'Filters.0.Values.0': 'DATA_DISK',
        'Filters.1.Name': 'portable',
        'Filters.1.Values.0': 'TRUE',
        'Filters.2.Name': 'disk-state',
        'Filters.2.Values.0': 'UNATTACHED',
        'Filters.3.Name': 'zone',
        'Filters.3.Values.0': 'ap-taipei-1'
      }
      await this.axios.post(DISK_LIST, param).then(res => {
        this.axiosUtils(res, () => {
          this.useYunOptions = res.Response.DiskSet.map(item => {
            let { DiskId, DiskName, DiskSize } = item
            return { DiskId, DiskName, DiskSize }
          })
        })
      })
    },
    getDescribeVpcs: async function () {
      let param = {
        Version: '2017-03-12',
        'VpcIds.0': this.vpcId,
        Offset: 0,
        Limit: 100
      }
      await this.axios.post(TKE_VPC_METWORK, param).then(res => {
        this.axiosUtils(res, () => {
          let { Response: { VpcSet } } = res
          VpcSet.forEach((item, index) => {
            if (index === 0) {
              this.wl.subnetOneValue = item.VpcName
            }
            this.subnetOneOption.push(item.VpcName)
          })
        })
      })
    },
    getTkeDataResult: async function () {
      let param = {
        JobId: this.jobId,
        Version: '2019-06-06',
        Module: '/front/v1'
      }
      await this.axios.post(TKE_GETTKEDATARESULT, param).then(res => {
        this.axiosUtils(res, () => {
          console.log('tsm2/GetTkeDataResult', res)
        })
      })
    },
    // 获取子网列表
    getDescribeSubnets: async function () {
      let param = {
        Version: '2017-03-12',
        'Filters.0.Name': 'vpc-id',
        'Filters.0.Values.0': this.vpcId,
        Offset: 0,
        Limit: 100
      }
      await this.axios.post(TKE_WORKER_METWORK, param).then(res => {
        this.axiosUtils(res, () => {
          let { Response: { SubnetSet } } = res
          this.subnetTwoOption = []
          SubnetSet.forEach((item, index) => {
            let { SubnetId, SubnetName, TotalIpAddressCount, AvailableIpAddressCount } = item
            if (index === 0) {
              this.wl.subnetTwoValue = SubnetName
              this.subnetOrder = { TotalIpAddressCount, AvailableIpAddressCount }
            }
            this.subnetTwoOption.push({ SubnetId, SubnetName, TotalIpAddressCount, AvailableIpAddressCount })
          })
        })
      })
    },
    // 获取命名空间列表
    getNameSpaceInfo: async function () {
      let param = {
        Method: 'GET',
        Path: '/api/v1/namespaces',
        Version: '2018-05-25',
        ClusterName: this.clusterId
      }
      await this.axios.post(POINT_REQUEST, param).then(res => {
        this.axiosUtils(res, () => {
          let searchOpt = JSON.parse(res.Response.ResponseBody).items
          searchOpt.forEach((item, index) => {
            if (index === 0) {
              this.wl.namespace = item.metadata.name
            }
            item.value = item.metadata.name
            item.label = item.metadata.name
          })
          this.namespaceOptions = searchOpt
        })
      })
    },
    handleSizeChange (val) {
      console.log(`每頁 ${val} 條`)
    },
    // 改变页数
    handleCurrentChange (val) {
      this.currpage = val
    },
    // 点击确定绑定镜像
    confirmMirrorImg: function (val, index) {
      console.log(val, index)
      this.wl.instanceContent[index].mirrorImg = val
    },
    // 提交新增
    submitAdd: function () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.submit()
        } else {
          console.error('有些驗證失敗')
          return false
        }
      })
    },
    submit: async function () {
      // 注释请求参数
      this.submitErrorMessage = ''
      let {
        name, labels, type, namespace, description, replicas, updateWay, configTacticsPods,
        updateInterval, instanceContent, portMapping, caseNum, caseScope1,
        caseScope2, touchTactics, updateTactics, configTacticsMaxSurge, configTacticsMaxUnavailable,
        serviceEnbel, nodeTactics, specifyNodeDispatchValue, mustCondition, needCondition,
        serviceAccess, ETP, SA, time, describeLoadBalancersValue, loadBalance, handlessChecked, subnetTwoValue,
        jobSettings, executionStrategy, configTacticsPartition, dataVolumes
      } = this.wl
      let labelsObj = {}
      labels.forEach(item => {
        labelsObj[item.key] = item.value
      })
      labelsObj['qcloud-app'] = name
      this.loadShow = true
      // 实例内容器 赋值
      // 存活检查，就绪检查 共用赋值函数
      let inspectFunc = (obj) => {
        let {
          inspectMethodValue,
          inspectProtocolValue,
          executiveOrder, // 执行命令
          inspectPort, // 检查端口
          requestPath, // 请求路径
          startDelay, // 启动延时
          responseTimeout, // 响应超时,
          intervalTime, // 间隔时间
          healthyThreshold, // 健康阀值
          unhealthyThreshold // 不健康阀值
        } = obj
        let newObj = {
          failureThreshold: parseInt(unhealthyThreshold),
          successThreshold: parseInt(healthyThreshold),
          timeoutSeconds: parseInt(responseTimeout),
          periodSeconds: parseInt(intervalTime)
        }
        if (parseInt(startDelay) !== 0) {
          newObj.initialDelaySeconds = parseInt(startDelay)
        }
        if (inspectMethodValue === 'TCP端口檢查') {
          newObj.tcpSocket = { port: parseInt(inspectPort) }
        } else if (inspectMethodValue === 'HTTP請求檢查') {
          newObj.httpGet = {
            path: requestPath,
            port: parseInt(inspectPort),
            scheme: inspectProtocolValue
          }
        } else if (inspectMethodValue === '執行命令檢查' && executiveOrder !== '') {
          newObj.exec = {
            command: executiveOrder.split('\n')
          }
        }
        return newObj
      }
      let containerList = instanceContent.map(item => {
        let {
          name: iName, mirrorImg, versions, requestCpu, limitCpu, requestMemory, mountPoints,
          limitMemory, gpuNum, privilegeLevelContainer, environmentVar, citeCs, workDirectory,
          runCommand, runParam, surviveExamine, readyToCheck, surviveExamineContent, readyToCheckContent, mirrorPullTactics
        } = item
        if (versions !== '') mirrorImg = `${mirrorImg}:${versions}`
        let oneContainer = {
          name: iName,
          image: mirrorImg,
          volumeMounts: [],
          resources: {
            limits: {},
            requests: {}
          },
          env: [],
          workingDir: workDirectory,
          command: [],
          args: [],
          securityContext: {
            privileged: privilegeLevelContainer
          }
        }
        // 挂载点
        let volumeMounts = []
        mountPoints.forEach(mItem => {
          let { dataVolumeValue, targetPath, mountSubPath, permission } = mItem
          let oneVolumeMount = {
            mountPath: targetPath,
            subPath: mountSubPath,
            name: dataVolumeValue.name
          }
          if (permission === 'zd') {
            oneVolumeMount.readOnly = true
          }
          volumeMounts.push(oneVolumeMount)
        })
        oneContainer.volumeMounts = volumeMounts
        // 镜像拉取策略
        if (mirrorPullTactics) oneContainer.imagePullPolicy = mirrorPullTactics
        if (limitCpu) oneContainer.resources.limits.cpu = limitCpu
        if (requestCpu) oneContainer.resources.requests.cpu = requestCpu
        if (limitMemory) oneContainer.resources.limits.memory = limitMemory + 'Mi'
        if (requestMemory) oneContainer.resources.requests.memory = requestMemory + 'Mi'
        if (gpuNum !== 0) oneContainer.resources.limits['nvidia.com/gpu'] = gpuNum.toString()
        // 新增变量
        if (environmentVar.length > 0) {
          let environmentVarArr = environmentVar.map(item => {
            return { name: item.key, value: item.value }
          })
          oneContainer.env = [...oneContainer.env, ...environmentVarArr]
        }
        // 新增引用
        if (citeCs.length > 0) {
          let citeCsArr = citeCs.map(item => {
            let oneCiteCs = {
              name: item.input1,
              valueFrom: {}
            }
            let oneRef = {
              key: item.value3,
              name: item.value2,
              optional: false
            }
            if (item.value1 === 'ConfigMap') {
              oneCiteCs.valueFrom.configMapKeyRef = oneRef
            } else {
              oneCiteCs.valueFrom.secretKeyRef = oneRef
            }
            return oneCiteCs
          })
          oneContainer.env = [...oneContainer.env, ...citeCsArr]
        }
        // 运行命令
        if (runCommand !== '') oneContainer.command = runCommand.split('\n')
        // 运行参数
        if (runParam !== '') oneContainer.args = runParam.split('\n')
        // 存活检查
        if (surviveExamine) oneContainer.livenessProbe = inspectFunc(surviveExamineContent)
        // 就绪检查
        if (readyToCheck) oneContainer.readinessProbe = inspectFunc(readyToCheckContent)
        return oneContainer
      })
      // 基本 requestBody
      let params = {
        Method: 'POST',
        Version: '2018-05-25',
        ClusterName: this.clusterId
      }
      let requestBody = {
        kind: type,
        metadata: {
          name: name,
          namespace: namespace,
          labels: labelsObj
        },
        spec: {
          minReadySeconds: updateInterval
        }
      }
      let template = {
        metadata: {
          labels: labelsObj
        },
        spec: {
          volumes: [],
          containers: containerList,
          restartPolicy: 'Always',
          imagePullSecrets: [
            {
              'name': 'qcloudregistrykey'
            },
            {
              'name': 'tencenthubkey'
            }
          ]
        }
      }
      // 数据卷
      if (dataVolumes.length > 0) {
        let volumes = []
        dataVolumes.forEach(item => {
          let { name, name2, emptyDir, hostPath, nfs, persistentVolumeClaim, qcloudCbs, configMap, secret } = item
          if (name === 'useMenu') {
            volumes.push({
              name: name2,
              emptyDir: emptyDir
            })
          } else if (name === 'usePath') {
            volumes.push({
              name: name2,
              hostPath: {
                path: hostPath.path,
                type: hostPath.type
              }
            })
          } else if (name === 'useNFS') {
            let nfsArr = nfs.serverAndPath.split(':')
            volumes.push({
              name: name2,
              nfs: {
                server: nfsArr[0],
                path: nfsArr[1]
              }
            })
          } else if (name === 'usePVC') {
            volumes.push({
              name: name2,
              persistentVolumeClaim: {
                claimName: persistentVolumeClaim.claimName
              }
            })
          } else if (name === 'useYun') {
            volumes.push({
              name: name2,
              qcloudCbs: {
                cbsDiskId: qcloudCbs.cbsDiskId,
                fsType: qcloudCbs.fsType
              }
            })
          } else if (name === 'useConfig') {
            let useConfigItems = configMap.items.map(uItem => {
              let { key, mode, path } = uItem
              return { key, path, mode: parseInt(mode) === 644 ? 420 : parseInt(mode) }
            })
            volumes.push({
              name: name2,
              configMap: {
                name: configMap.name,
                items: useConfigItems
              }
            })
          } else if (name === 'useSecret') {
            let useSecretItems = secret.items.map(uItem => {
              let { key, mode, path } = uItem
              return { key, path, mode: parseInt(mode) === 644 ? 420 : parseInt(mode) }
            })
            volumes.push({
              name: name2,
              secret: {
                secretName: secret.name,
                items: useSecretItems
              }
            })
          }
        })
        template.spec.volumes = volumes
      }
      let queryBodyJson = ''
      // 判断 描述
      if (description !== '') requestBody.metadata.description = description
      // 节点调度策略
      if (nodeTactics === 2) {
        let matchExpressionsValue = []
        specifyNodeDispatchValue.forEach(item => {
          let oneSpecify = this.specifyNodeDispatchOption.find(item2 => {
            return item2.id === item
          })
          matchExpressionsValue.push(...matchExpressionsValue, ...oneSpecify.PrivateIpAddresses)
        })
        let affinity = {
          nodeAffinity: {
            requiredDuringSchedulingIgnoredDuringExecution: {
              nodeSelectorTerms: [
                {
                  matchExpressions: [
                    {
                      key: 'kubernetes.io/hostname',
                      operator: 'In',
                      values: matchExpressionsValue
                    }
                  ]
                }
              ]
            }
          }
        }
        console.log(affinity)
        template.spec.affinity = affinity
      } else if (nodeTactics === 3) {
        let affinity = { nodeAffinity: {} }
        if (mustCondition.length > 0) {
          // 强制满足条件
          affinity.nodeAffinity.requiredDuringSchedulingIgnoredDuringExecution = {
            nodeSelectorTerms: mustCondition.map(item => {
              return {
                matchExpressions: item.map(item2 => {
                  let item2Obj = {
                    key: item2.name,
                    operator: item2.connect
                  }
                  if (!['Exists', 'DoesNotExist'].includes(item2.connect)) {
                    item2Obj.values = item2.rule.split(';')
                  }
                  return item2Obj
                })
              }
            })
          }
        }
        if (needCondition.length > 0) {
          // 尽量满足条件
          affinity.nodeAffinity.preferredDuringSchedulingIgnoredDuringExecution = needCondition.map(item => {
            return {
              weight: parseInt(item.weight),
              preference: {
                matchExpressions: item.arr.map(item2 => {
                  let item2Obj = {
                    key: item2.name,
                    operator: item2.connect
                  }
                  if (!['Exists', 'DoesNotExist'].includes(item2.connect)) {
                    item2Obj.values = item2.rule.split(';')
                  }
                  return item2Obj
                })
              }
            }
          })
        }
        template.spec.affinity = affinity
      }
      // 类型为 Deployment 或 statefulSet 需要提交 Services
      if ((type === 'Deployment' || type === 'StatefulSet') && serviceEnbel) {
        let ports = portMapping.map(item => {
          let { portValue, conPort, host, servicePort } = item
          let onePort = {
            'name': `${conPort}-${servicePort}-${portValue.toLowerCase()}`,
            'port': parseInt(servicePort),
            'targetPort': parseInt(conPort),
            'protocol': portValue
          }
          if (serviceAccess === '4') onePort.nodePort = parseInt(host)
          return onePort
        })
        let serviceRequestBody = {
          kind: 'Service',
          apiVersion: 'v1',
          metadata: {
            name: name,
            namespace: namespace
          },
          spec: {
            ports: ports,
            selector: labelsObj,
            sessionAffinity: SA
          }
        }
        // 服务访问方式 不同选项传不同值
        if (serviceAccess === '1') {
          serviceRequestBody.metadata.annotations = {}
          serviceRequestBody.spec.type = 'LoadBalancer'
          serviceRequestBody.spec.externalTrafficPolicy = ETP
          serviceRequestBody.metadata.annotations['service.kubernetes.io/service.extensiveParameters'] = JSON.stringify({ AddressIPVersion: 'IPV4' })
        } else if (serviceAccess === '2') {
          serviceRequestBody.spec.type = 'ClusterIP'
          if (handlessChecked) serviceRequestBody.spec.clusterIP = 'None'
        } else if (serviceAccess === '3') {
          serviceRequestBody.metadata.annotations = {}
          serviceRequestBody.spec.type = 'LoadBalancer'
          serviceRequestBody.spec.externalTrafficPolicy = ETP
          serviceRequestBody.metadata.annotations['service.kubernetes.io/qcloud-loadbalancer-clusterid'] = this.clusterId
          let oneSubOption = this.subnetTwoOption.find(item => item.SubnetName === subnetTwoValue)
          serviceRequestBody.metadata.annotations['service.kubernetes.io/qcloud-loadbalancer-internal-subnetid'] = oneSubOption.SubnetId
        } else if (serviceAccess === '4') {
          serviceRequestBody.spec.externalTrafficPolicy = ETP
          serviceRequestBody.spec.type = 'NodePort'
        }
        if ((serviceAccess === '1' || serviceAccess === '3') && loadBalance === '2') {
          serviceRequestBody.metadata.annotations['service.kubernetes.io/tke-existed-lbid'] = describeLoadBalancersValue
        }
        // 实例数量为自动调节时
        if (caseNum === 'autoAdjust') {
          let hpaName = `hpa-${this.name}-${Date.now().toString(36)}`
          let metrics = touchTactics.map(item => {
            let { touch2, touch2Option, size } = item
            let oneOption = touch2Option.find(item2 => item2.value === touch2)
            return {
              type: 'Pods',
              pods: {
                metricName: oneOption.type,
                targetAverageValue: size
              }
            }
          })
          let hpaRequestBody = {
            kind: 'HorizontalPodAutoscaler',
            apiVersion: 'autoscaling/v2beta1',
            metadata: {
              name: hpaName,
              namespace: namespace,
              labels: {
                'qcloud-app': hpaName
              }
            },
            spec: {
              minReplicas: parseInt(caseScope1),
              maxReplicas: parseInt(caseScope2),
              metrics: metrics,
              scaleTargetRef: {
                apiVersion: 'apps/v1beta2',
                kind: type,
                name: name
              }
            }
          }
          console.log('hpaRequestBody', JSON.stringify(hpaRequestBody))
          queryBodyJson += JSON.stringify(hpaRequestBody)
        }
        if (SA === 'ClientIP') {
          serviceRequestBody.spec.sessionAffinityConfig = {
            clientIP: {
              timeoutSeconds: time
            }
          }
        }
        console.log('serviceRequestBody', JSON.stringify(serviceRequestBody))
        queryBodyJson += JSON.stringify(serviceRequestBody)
      }
      if (type === 'Job' || type === 'CronJob') {
        template.spec.restartPolicy = jobSettings.failedRestartPolicy
        requestBody.spec.updateStrategy = {
          type: 'RollingUpdate',
          rollingUpdate: {}
        }
      } else {
        // 判断 更新方式
        if (type === 'Deployment') {
          if (updateWay === '滾動更新（推薦）') {
            let strategy = {
              type: 'RollingUpdate',
              rollingUpdate: {
                maxSurge: 0,
                maxUnavailable: 0
              }
            }
            // 更新策略
            switch (updateTactics) {
              case 1:
                strategy.rollingUpdate.maxSurge = parseInt(configTacticsPods)
                break
              case 2:
                strategy.rollingUpdate.maxUnavailable = parseInt(configTacticsPods)
                break
              case 3:
                strategy.rollingUpdate = {
                  maxSurge: configTacticsMaxSurge,
                  maxUnavailable: configTacticsMaxUnavailable
                }
                break
            }
            requestBody.spec.strategy = strategy
          } else { // 快速更新
            requestBody.spec.strategy = {
              type: 'Recreate',
              rollingUpdate: null
            }
          }
        } else if (type === 'DaemonSet') {
          requestBody.spec.updateStrategy = {
            type: 'RollingUpdate',
            rollingUpdate: {
              maxUnavailable: configTacticsMaxUnavailable
            }
          }
        } else if (type === 'StatefulSet') {
          requestBody.spec.updateStrategy = {
            type: 'RollingUpdate',
            rollingUpdate: {
              partition: parseInt(configTacticsPartition)
            }
          }
        }
      }
      if (type === 'CronJob') {
        requestBody.spec.schedule = executionStrategy
        requestBody.spec.jobTemplate = {}
        requestBody.spec.jobTemplate.spec = {}
        requestBody.spec.jobTemplate.spec.completions = parseInt(jobSettings.repeatNumber)
        requestBody.spec.jobTemplate.spec.parallelism = parseInt(jobSettings.parallelNumber)
        requestBody.spec.jobTemplate.spec.template = template
        requestBody.apiVersion = 'batch/v1beta1'
        params.Path = `/apis/batch/v1beta1/namespaces/${namespace}/cronjobs`
      } else if (type === 'Job') {
        requestBody.spec.completions = parseInt(jobSettings.repeatNumber)
        requestBody.spec.parallelism = parseInt(jobSettings.parallelNumber)
        requestBody.spec.template = template
        requestBody.apiVersion = 'batch/v1'
        params.Path = `/apis/batch/v1/namespaces/${namespace}/jobs`
      } else {
        requestBody.spec.template = template
        requestBody.spec.replicas = replicas
        requestBody.spec.selector = {
          matchLabels: labelsObj
        }
        requestBody.apiVersion = 'apps/v1beta2'
        params.Path = `/apis/platform.tke/v1/clusters/${this.clusterId}/apply?notUpdate=true`
      }
      console.log('requestBody', JSON.stringify(requestBody))
      queryBodyJson += JSON.stringify(requestBody)
      params.RequestBody = queryBodyJson
      await this.axios.post(POINT_REQUEST, params).then(res => {
        if (res.Response.Error === undefined) {
          this.loadShow = false
          let routerName = ''
          switch (type) {
            case 'Deployment':
              routerName = 'colonyResourceDeployment'
              break
            case 'DaemonSet':
              routerName = 'colonyResourceDaemonSet'
              break
            case 'StatefulSet':
              routerName = 'colonyResourceStatefulSet'
              break
            case 'CronJob':
              routerName = 'colonyResourceCronJob'
              break
            case 'Job':
              routerName = 'colonyResourceJob'
              break
          }
          this.$message({
            message: '新建成功',
            type: 'success',
            showClose: true,
            duration: 2000
          })
          this.$router.replace({
            name: routerName,
            query: {
              /* spaceName: namespace,
              rowData: {
                metadata: {
                  name: name,
                  namespace: namespace
                }
              }, */
              clusterId: this.clusterId,
              ProjectId: 0
            }
          })
        } else {
          this.loadShow = false
          this.submitErrorMessage = JSON.parse(res.Response.Error.Message).message
        }
      })
    },
    openPathDialog: function () {
      this.dialogVisiblePath = true
    },
    openYunDialog () {
      this.dialogVisibleYun = true
    },
    openConfigMapDialog () {
      this.dialogVisibleConfig = true
    },
    openSecretDialog () {
      this.dialogVisibleSecret = true
    },
    tableCurrentChange: function (row, item) {
      if (!row) return
      item.qcloudCbs.tempCbsDiskId = row.DiskId
      item.qcloudCbs.DiskName = row.DiskName
    }
  }
}

</script>

<style lang="scss" scoped>
  .tke-radio-group {
    .el-radio {
      display: block;
    }

    .el-radio + .el-radio {
      margin-left: 0;
      margin-top: 10px;

    }
  }

  a {
    cursor: pointer;
  }

  .w192 {
    width: 192px;
  }

  .w100 {
    width: 100px;
  }

  .w150 {
    width: 150px;
  }

  .margin-middle {
    margin: 0px 10px;
  }

  .special {
    border-bottom: solid 1px #f2f2f2;
    padding: 0px 0px 26px;
  }

  .search-one {
    display: flex;
    align-items: center;
    width: 80%;
    background: #f2f2f2;
    height: 50px;
    box-sizing: border-box;
    padding: 0px 20px;
    margin-bottom: 1px;
    .search-input {
      width: 210px;
      margin-left: 10px;
    }

    .search-hidden {
      flex: 1;
      margin-left: 10px;
    }

    .el-icon-close {
      font-size: 18px;
      cursor: pointer;
    }

    .cancle-addjuan {
      cursor: no-drop;
      color: #888;
    }
  }

  .select-yun {
    display: flex;
  }

  .ml10 {
    margin-left: 10px;
  }

  .ml100 {
    margin-left: 100px;
  }

  .w400 {
    width: 400px;
  }

  .w150 {
    width: 150px;
  }

  .pagstyle {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .pagestyle_right {
      display: flex;
      justify-content: flex-start;

      div {
        span {
          margin-right: 10px;
        }
      }
    }
  }

  .case-content {
    width: 80%;
    background: #f2f2f2;
    overflow: hidden;
    box-sizing: border-box;
    padding: 20px;
  }

  .cpu-limit {
    display: flex;

    & > div:nth-of-type(1) {
      margin-right: 60px;

    }
  }

  .cpu-limit2 {
    width: 120px;
    display: flex;
    text-align: center;
    border: solid 1px #ddd;

    span {
      display: block;
      height: 28px;
      line-height: 28px;
      width: 180px;
      border-right: solid 1px #ddd;
    }

    ::v-deep .el-input__inner {
      border: none !important;
    }
  }

  .setPosition {
    position: absolute;
    left: -64px;
    top: 8px;
  }

  .setPosition2 {
    position: absolute;
    left: -38px;
    top: 8px;
  }

  .setPosition4 {
    position: absolute;
    left: -78px;
    top: 8px;
  }

  .setPosition3 {
    position: absolute;
    left: -52px;
    top: 8px;
  }

  .from-1 {
    width: 80%;
    background: white;
    box-sizing: border-box;
    padding: 10px;

    & > > > .el-form-item:nth-of-type(1) {
      margin-top: 0px !important;
    }

    .from-set {
      background: #f2f2f2;
      padding: 6px;
    }
  }

  .form-2 {
    width: 60%;
    background: #f2f2f2;
    box-sizing: border-box;
    padding: 10px;
  }

  .addcontent {
    width: 80%;
    border: dotted 2px #f2f2f2;
    height: 40px;
    text-align: center;
    line-height: 40px;
    margin: 6px 0px;

    &:hover {
      background: #f2f2f2;
    }
  }

  .flex {
    display: flex;
    align-items: center;
  }

  .bg {
    width: 50%;
    background: #f2f2f2;
    box-sizing: border-box;
    padding: 10px;
  }

  .bg2 {
    width: 60%;
    background: #f2f2f2;
    box-sizing: border-box;
    padding: 10px 20px;
    margin-bottom: 10px;
  }

  .set-i1 {
    font-size: 20px;
    cursor: pointer;
    float: right;
  }

  .bottom10 {
    margin-bottom: 10px;
  }

  .text-error {
    color: #e54545;
  }

  .text-warning {
    color: #ff9d00
  }

  .ms {
    width: 330px;
    padding: 5px 8px 8px 5px;
    height: 100px;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    resize: none;
  }

  .w250 {
    width: 250px;
  }

  .port{
    border: 1px solid #ddd;
    color: #888888;
    .flex {
      line-height: 28px;
    }
  }

  .tke-fe-alert{
    padding: 10px 30px 10px 20px;
    vertical-align: middle;
    color: #003b80;
    border: 1px solid #97c7ff;
    border-radius: 2px;
    background: #e5f0ff;
    position: relative;
    box-sizing: border-box;
    margin-right: auto;
    display: inline-block;
    margin-left: 20px;
    margin-bottom: 0px;
    max-width: 750px;
    max-height: 120px;
    overflow: auto;
  }
  .tke-fe-alert--error{
    color: #b43537;
    border-color: #f6b5b5;
    background-color: #fcecec;
  }
</style>

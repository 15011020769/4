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
          <h2 class="header-title">{{$t('TKE.subList.xjssz')}}</h2>
        </div>
        <!-- 右侧 -->
        <div class="grid-right"></div>
      </div>
    </div>
    <div class="colony-main">
      <div class="tke-card tke-formpanel-wrap mb60">
        <h4 class="tke-formpanel-title">{{$t('TKE.subList.qdpz')}}</h4>
        <el-form
          class="tke-form"
          :model="asg"
          :rules="rules"
          ref="asg"
          label-position="left"
          label-width="120px"
          size="mini"
        >
          <el-form-item :label="$t('TKE.overview.mc')">
            <el-input class="w200" v-model="asg.name" :placeholder="$t('TKE.myMirror.qsrmc')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('TKE.colony.sllx')">
            <el-radio-group v-model="asg.typeRadio" size="small">
              <el-radio-button label="POSTPAID_BY_HOUR">{{$t('TKE.colony.aljf')}}</el-radio-button>
              <el-radio-button label="SPOTPAID">{{$t('TKE.subList.jjjf')}}</el-radio-button>
            </el-radio-group>
            <p v-if="asg.typeRadio=='SPOTPAID'">
              {{$t('TKE.subList.jjsl')}}
              <!-- <span class="tke-text-link">{{$t('TKE.overview.ckxq')}}</span> -->
            </p>
          </el-form-item>
          <el-form-item :label="$t('TKE.subList.jxsz')">
            <div class="form-controls">
              <el-form class="tke-form" label-position="left" label-width="120px" size="mini">
                <el-form-item :label="$t('TKE.colony.kyq')">
                  <el-radio-group v-model="asg.regionRadio" size="small">
                    <el-radio-button label="region1">{{$t('TKE.subList.qbkyq')}}</el-radio-button>
                    <el-radio-button label="region2">{{$t('TKE.colony.tbyq')}}</el-radio-button>
                  </el-radio-group>
                  <p>{{$t('TKE.subList.qdpzbbhkyq')}}</p>
                </el-form-item>
                <el-form-item :label="$t('TKE.colony.jxing')">
                  <div class="tke-form-item_text">
                    <span>{{asg.zoneInstanceConfigInfo}}</span>
                    <i class="el-icon-edit tke-icon" @click="typeModelShow = true"></i>
                  </div>
                </el-form-item>
                <el-form-item :label="$t('TKE.colony.xtp')">
                  <div class="tke-form-item_text">
                    <span>{{systemDiskShow}}</span>
                    <i class="el-icon-edit tke-icon" @click="diskModelShow = true"></i>
                  </div>
                </el-form-item>
                <el-form-item :label="$t('TKE.colony.sjp')">
                  <div class="tke-form-item_text">
                    <span>{{datadisk}}</span>
                    <i class="el-icon-edit tke-icon" @click="dataDiskShow = true"></i>
                  </div>
                </el-form-item>
                <el-form-item :label="$t('TKE.colony.gwdk')">
                  <div class="tke-form-item_text">
                    <span>{{publicband}}</span>
                    <i class="el-icon-edit tke-icon" @click="publicBroadband = true"></i>
                  </div>
                </el-form-item>
              </el-form>
            </div>
          </el-form-item>
          <el-form-item :label="$t('TKE.subList.zgcj')" v-show="asg.typeRadio === 'SPOTPAID'">
            <el-input type="text" v-model="asg.maxPrice" style="width: 300px;"></el-input>
            <span>元/{{$t('TKE.colony.xs')}}</span>
            <p>{{$t('TKE.subList.zgcjmrjx')}}</p>
          </el-form-item>
          <el-form-item :label="$t('TKE.colony.dlfs')">
            <el-radio-group v-model="asg.pwdRadio" size="small">
              <el-radio-button label="pwd1">{{$t('TKE.colony.ljglmy')}}</el-radio-button>
              <el-radio-button label="pwd2">{{$t('TKE.colony.zdscmm')}}</el-radio-button>
              <el-radio-button label="pwd3">{{$t('TKE.colony.szmm')}}</el-radio-button>
            </el-radio-group>
          </el-form-item>

          <el-form-item :label="$t('TKE.colony.sshmy')" v-show="asg.pwdRadio === 'pwd1'">
            <el-select v-model="asg.sshSecret" filterable :placeholder="$t('TKE.overview.qxz')" class="w200">
              <el-option
                v-for="item in secretList"
                :key="item.KeyId"
                :label="item.KeyName"
                :value="item.KeyId"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item :label="$t('TKE.overview.yhm')" v-show="asg.pwdRadio === 'pwd3'">
            <div class="tke-form-item_text">
              <span>uunin</span>
            </div>
          </el-form-item>
          <el-form-item :label="$t('TKE.overview.mm')" v-show="asg.pwdRadio === 'pwd3'">
            <el-input class="w200" type="password" v-model="asg.password" :placeholder="$t('TKE.myMirror.qsrmm')"></el-input>
            <p
              class="pass"
            >linux機器密碼需8到16位，至少包括兩項（[a-z,A-Z] , [0-9]和[()`~!@#$%^&*-+=|{}[]:;',.?/]的特殊符號</p>
          </el-form-item>
          <el-form-item :label="$t('TKE.colony.qrmm')" v-show="asg.pwdRadio === 'pwd3'">
            <el-input class="w200" type="password" v-model="asg.passwordAgin" :placeholder="$t('TKE.subList.qqrmm')"></el-input>
          </el-form-item>

          <el-form-item :label="$t('TKE.colony.rqml')">
            <el-checkbox v-model="checked">{{$t('TKE.colony.jyccdsjp')}}</el-checkbox>
            <el-form-item v-show="checked">
              <el-input class="w200" v-model="inputRoom" @change="changeValue()"></el-input>
            </el-form-item>
          </el-form-item>

          <!-- 添加安全组 -->
          <el-form-item :label="$t('TKE.colony.aqz')">
            <el-select
              v-model="asg.security"
              :placeholder="$t('TKE.overview.qxz')"
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
              <el-select v-model="values" :placeholder="$t('TKE.overview.qxz')" class="w200" @change="a1(w)">
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
              <el-button type="text" @click="addDomain">{{$t('TKE.subList.xzaqzu')}}</el-button>
            </el-form-item>
          </el-form-item>

          <el-form-item label="安全加固">
            <el-checkbox v-model="asg.securityService">{{$t('TKE.colony.mfkt')}}</el-checkbox>
            <el-form-item>
              {{$t('TKE.colony.azzjmfkt')}}
              <!-- <a
                href="https://cloud.tencent.com/product/cwp?_ga=1.173966502.440655928.1500464439"
                target="_blank"
              >详细介绍</a> -->
            </el-form-item>
          </el-form-item>

          <el-form-item :label="$t('TKE.colony.yjk')">
            <el-checkbox v-model="asg.monitor">{{$t('TKE.colony.mfkt')}}</el-checkbox>
            <el-form-item>
              <p style="color:#ff9d00;" v-show="!asg.monitor">{{$t('TKE.colony.qxgx')}}</p>
              <p>
                {{$t('TKE.colony.mfktzj')}}
                <!-- <a
                  href="https://cloud.tencent.com/product/cm"
                  target="_blank"
                >详细介绍</a> -->
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
          </el-form-item>-->
          <p>
            <i :class="[isActive?'el-icon-caret-bottom':'el-icon-caret-right']"></i>
            <el-button type="text" style="font-size:12px;" @click="isActive=!isActive">{{$t('TKE.colony.gjszhi')}}</el-button>
          </p>
          <el-form-item :label="$t('TKE.colony.zdysj')" v-show="isActive">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows:4 }"
              :placeholder="$t('TKE.colony.qsrnr')"
              v-model="textarea2"
              class="w420"
            ></el-input>
          </el-form-item>

          <el-form-item :label="$t('TKE.colony.fs')" v-show="isActive">
            <el-checkbox v-model="checkedThree">{{$t('TKE.colony.kqfs')}}</el-checkbox>
            <el-form-item>
              <p>
                {{$t('TKE.colony.fsjdh')}}
                <!-- <a
                  href="https://cloud.tencent.com/document/product/457/18824"
                  target="_blank"
                >取消封锁命令</a> -->
              </p>
            </el-form-item>
          </el-form-item>
        </el-form>

        <hr />

        <h4 class="tke-formpanel-title">{{$t('TKE.subList.sszpz')}}</h4>

        <el-form
          class="tke-form"
          :model="asg"
          label-position="left"
          label-width="120px"
          size="mini"
        >
          <el-form-item :label="$t('TKE.subList.zcwl')">
            <el-select v-model="asg.groupVps" disabled :placeholder="$t('TKE.overview.qxz')" @change="changeVpcs()">
              <el-option
                v-for="item in describeVpcs"
                :key="item.VpcId"
                :label="item.VpcName"
                :value="item.VpcId"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item :label="$t('TKE.subList.zczw')">
            <el-table
              ref="multipleTable"
              :data="subNetList"
              tooltip-effect="dark"
              style="width: 80%"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column :label="$t('TKE.subList.zwid')" width="200">
                <template slot-scope="scope">{{ scope.row.SubnetId }}</template>
              </el-table-column>
              <el-table-column prop="name" :label="$t('TKE.subList.zwmc')" width="200">
                <template slot-scope="scope">{{ scope.row.SubnetName }}</template>
              </el-table-column>
              <el-table-column prop="address" :label="$t('TKE.colony.kyq')" show-overflow-tooltip>
                <template slot-scope="scope">{{ scope.row.Zone | Zone }}</template>
              </el-table-column>
            </el-table>
          </el-form-item>

          <el-form-item :label="$t('TKE.subList.jdslfw')">
            <div class="form-input">
              <el-input v-model="asg.minSize" size="mini" class="w150" :placeholder="$t('TKE.subList.zxjd')"></el-input>
              <span>~</span>
              <el-input v-model="asg.maxSize" size="mini" class="w150" :placeholder="$t('TKE.subList.zdjd')"></el-input>
            </div>
            <p>{{$t('TKE.subList.sdjdfw')}}</p>
            <p>
              {{$t('TKE.subList.ksrtj')}}
              <!-- <a
                href="https://cloud.tencent.com/document/product/457/32190#.E9.80.9A.E8.BF.87.E5.BC.B9.E6.80.A7.E4.BC.B8.E7.BC.A9.E8.87.AA.E5.8A.A8.E6.B7.BB.E5.8A.A0.2F.E7.A7.BB.E9.99.A4.E8.8A.82.E7.82.B9"
                target="_blank"
              >集群自动扩缩容说明</a> -->
            </p>
          </el-form-item>

          <p>
            <i :class="[isActiveMode?'el-icon-caret-bottom':'el-icon-caret-right']"></i>
            <el-button type="text" style="font-size:12px;" @click="isActiveMode=!isActiveMode">{{$t('TKE.colony.gjszhi')}}</el-button>
          </p>
          <el-form-item :label="$t('TKE.subList.cscl')" v-show="isActiveMode">
            <el-radio-group v-model="asg.restart" size="small" @change="setRadio($event)">
              <el-radio-button label="IMMEDIATE_RETRY">{{$t('TKE.subList.kscs')}}</el-radio-button>
              <el-radio-button label="INCREMENTAL_INTERVALS">{{$t('TKE.subList.jjdzcs')}}</el-radio-button>
            </el-radio-group>
            <p v-show="asg.restart==='IMMEDIATE_RETRY'">{{$t('TKE.subList.ljcs')}}</p>
            <p
              v-show="asg.restart==='INCREMENTAL_INTERVALS'"
            >{{$t('TKE.subList.jgdzcs')}}</p>
          </el-form-item>
          <el-form-item :label="$t('TKE.subList.ksrms')" v-show="isActiveMode">
            <el-radio-group v-model="asg.shrinkage" size="small">
              <el-radio-button label="RELEASE_MODE">{{$t('TKE.subList.sfms')}}</el-radio-button>
            </el-radio-group>
            <p>{{$t('TKE.subList.srszdsf')}}</p>
          </el-form-item>
        </el-form>
        <!-- 底部 -->
        <div class="tke-formpanel-footer">
          <el-button size="small" type="primary" @click="submitGroup()">{{$t('TKE.subList.cjssz')}}</el-button>
          <el-button size="small" @click="goBack">取消</el-button>
        </div>
      </div>
    </div>

    <el-dialog :title="$t('TKE.colony.xzjx')" :visible.sync="typeModelShow" width="80%">
      <div class="tke-second-worker-model-box" v-if="typeModelShow">
        <div class="tke-second-worker-model">
          <div class="model-bg">
            <div>
              <el-select v-model="cpuValue" :placeholder="$t('TKE.overview.qxz')">
                <el-option
                  v-for="item in AllCPU"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-select v-model="memeryValue" :placeholder="$t('TKE.overview.qxz')">
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
                <el-radio-button label="all1">{{$t('TKE.colony.qbslz')}}</el-radio-button>
                <el-radio-button label="standard1">{{$t('TKE.colony.bzx')}}</el-radio-button>
                <el-radio-button label="Memory1">{{$t('TKE.colony.ncx')}}</el-radio-button>
                <el-radio-button label="Calculation1">{{$t('TKE.colony.jsx')}}</el-radio-button>
              </el-radio-group>
            </div>
            <div style="margin-top:16px;">
              <el-radio-group v-model="asg.familyType" @change="changeType">
                <el-radio-button label="all2">{{$t('TKE.colony.qbsllx')}}</el-radio-button>
                <el-radio-button v-show="v1" label="standard2">{{$t('TKE.colony.bzx')}}S3</el-radio-button>
                <el-radio-button v-show="v2" label="Memory2">{{$t('TKE.colony.jsx')}}C3</el-radio-button>
                <el-radio-button v-show="v3" label="Calculation2">{{$t('TKE.colony.ncx')}}M3</el-radio-button>
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
                    <el-radio v-model="modeData" :label="scope.row">
                      <i></i>
                    </el-radio>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('TKE.colony.jxing')">
                  <template slot-scope="scope">{{ModelTypeName(scope.row.TypeName)}}</template>
                </el-table-column>
                <el-table-column :label="$t('TKE.colony.gg')">
                  <template slot-scope="scope">{{ scope.row.InstanceType }}</template>
                </el-table-column>
                <el-table-column label="CPU">
                  <template slot-scope="scope">{{ scope.row.Cpu }}核</template>
                </el-table-column>
                <el-table-column :label="$t('TKE.overview.ncun')">
                  <template slot-scope="scope">{{ scope.row.Memory }}GB</template>
                </el-table-column>
                <el-table-column :label="$t('TKE.colony.pzfy')">
                  <template slot-scope="scope">
                    <span class="text-orange">￥{{ scope.row.Price.UnitPrice }}</span>元/{{$t('TKE.colony.xs')}}起
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="ModelSure()">{{$t('TKE.overview.qd')}}</el-button>
        <el-button @click="typeModelShow = false">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog :visible.sync="diskModelShow" width="35%">
      <div class="tke-second-worker-popover-disk">
        <div>
          <el-select v-model="asg.diskType" :placeholder="$t('TKE.overview.qxz')">
            <el-option
              v-for="item in systemDisk"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-input-number v-model="asg.diskCapacity" :min="50" :max="500"></el-input-number>
          <span>GB</span>
          <p>{{$t('TKE.colony.fw')}}：50~500，{{$t('TKE.colony.bc')}}：1</p>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="changeDisk()">{{$t('TKE.overview.qd')}}</el-button>
        <el-button @click="diskModelShow = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="dataDiskShow" width="35%">
      <el-checkbox v-model="buyDataDisk" @change="changeIsBuy()">{{$t('TKE.colony.gmsjp')}}</el-checkbox>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="changeDataDisk()">{{$t('TKE.overview.qd')}}</el-button>
        <el-button @click="dataDiskShow = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="buyDataDiskShow" width="60%">
      <div class="tke-second-worker-popover-data-bg" v-for="(x, i) in buyDataDiskArr" :key="i">
        <div>
          <div>
            <p>{{$t('TKE.colony.ypsz')}}</p>
            <div class="box">
              <el-select v-model="x.dataDiskVal" :placeholder="$t('TKE.overview.qxz')">
                <el-option
                  v-for="item in systemDisk"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-input-number v-model="x.dataDiskNum" :min="10" :max="16000" :step="10"></el-input-number>
              <span>GB</span>
              <el-checkbox v-model="x.formatMount" class="format-and-mount">{{$t('TKE.colony.gshbgz')}}</el-checkbox>
            </div>
            <p>{{$t('TKE.colony.fw')}}：10~16000，{{$t('TKE.colony.bc')}}：10</p>
            <p style="margin-top:16px;" v-if="x.formatMount">{{$t('TKE.colony.gshsz')}}</p>
            <div style="margin-top:16px;" class="box" v-if="x.formatMount">
              <el-select v-model="x.latticeSetVal" :placeholder="$t('TKE.overview.qxz')">
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
      >{{$t('TKE.colony.tjsjp')}}</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="changeDataDisk()">{{$t('TKE.overview.qd')}}</el-button>
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
              <el-select v-model="asg.broadbandVal" :placeholder="$t('TKE.overview.qxz')">
                <el-option
                  v-for="item in broadbandOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-input-number v-model="asg.broadbandNum" :min="0" :max="100"></el-input-number>
              <span>Mbps</span>
              <p>{{$t('TKE.colony.dksx')}}：0~100</p>
              <div class="tke-second-worker-popover-data-bg distribution">
                <el-checkbox v-model="asg.pubBroadbandShow" class="format-and-mount">
                  {{$t('TKE.colony.fpmfgw')}}，
                  <!-- <a href="#">查看详情</a> -->
                </el-checkbox>
              </div>
            </div>
          </div>
          <!-- </el-popover> -->
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="changePublic()">{{$t('TKE.overview.qd')}}</el-button>
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
      // modeData: {}, //默认选中的机型
      modeData: {}, //机型表格中选中的数据
      describeVpcs: [], //支持的网络
      subNetList: [], //子网列表
      buyDataDiskArr: [], //购买的数据盘列表
      publicband: "按寬頻計費 1Mbps", //公共带宽
      datadisk: "暫不購買", //数据盘
      systemDiskShow: "高性能雲硬碟 50GB",
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
        zoneInstanceConfigInfo: "S3.SMALL2(標準型S3,1核2GB)", //机型
        minSize: "", //最小节点数量
        maxSize: "", //最大节点数
        restart: "IMMEDIATE_RETRY", //重试策略
        instanceType: "S3.SMALL1", //机器类型
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
          label: "高性能雲硬碟",
          value: "CLOUD_PREMIUM"
        },
        {
          label: "SSD雲硬碟",
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
          value: "選項1",
          label: "xijian"
        },
        {
          value: "選項2",
          label: "SSEE"
        },
        {
          value: "選項3",
          label: "SSEEE"
        }
      ],
      //所有内存
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
          address: "台北一區"
        },
        {
          date: "subnet-nn56635p",
          name: "asd",
          address: "台北一區"
        },
        {
          date: "subnet-nn56635p",
          name: "asd",
          address: "台北一區"
        }
      ],
      rules: {
        name: [
          { required: true, message: "請輸入伸縮組名稱", trigger: "change" }
        ],
        ScaleDownUtilizationThreshold: [
          { required: true, message: "佔比不能為空", trigger: "change" }
        ],
        ScaleDownUnneededTime: [
          { required: true, message: "時間不能為空", trigger: "change" }
        ],
        ScaleDownDelay: [
          { required: true, message: "時間不能為空", trigger: "change" }
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
    changeValue(val) {
      console.log(this.inputRoom);
    },
    a1(w, e) {},
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
        MaxSize: Number(this.asg.maxSize),
        MinSize: Number(this.asg.minSize),
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
          DiskSize: Number(this.asg.diskCapacity)
        },
        InternetAccessible: {
          InternetChargeType: this.asg.broadbandVal,
          InternetMaxBandwidthOut: Number(this.asg.broadbandNum),
          PublicIpAssigned: this.asg.pubBroadbandShow
        },
        LoginSettings: LoginSettings,
        SecurityGroupIds: [this.asg.security], //未做完整

        InstanceChargeType: this.asg.typeRadio
        // InstanceMarketOptions: { SpotOptions: { MaxPrice: this.asg.maxPrice } }//最高价格
      };

      let InstanceAdvancedSettings = {
        MountTarget: "",
        DockerGraphPath: this.inputRoom,
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
        AutoScalingGroupPara: JSON.stringify(AutoScalingGroupPara), //伸缩组配置
        LaunchConfigurePara: JSON.stringify(LaunchConfigurePara) //启动配置
        // InstanceAdvancedSettings: InstanceAdvancedSettings
      };
      params["InstanceAdvancedSettings.DockerGraphPath"] = this.inputRoom;
      params["InstanceAdvancedSettings.UserScript"] = "";
      params["InstanceAdvancedSettings.Unschedulable"] = 0;
      params["InstanceAdvancedSettings.Labels.0.Name"] = "";
      params["InstanceAdvancedSettings.Labels.0.Value"] = "";

      // params[ //不能传递参数
      //   "EnhancedService.SecurityService.Enabled"
      // ] = this.asg.securityService;
      // params["EnhancedService.MonitorService.Enabled"] = this.asg.monitor;

      // Version: "2018-05-25"
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

      console.log(params);
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
            "FailedOperation": "操作失敗",
            "InternalError": "内部錯誤",
            "InternalError.AccountUserNotAuthenticated	": "帳戶未通過認證",
            "InternalError.AsCommon": "配額不足,請釋放部分資源後再創建",
            "InternalError.CvmCommon": "cvm創建節點報錯。",
            "InternalError.CvmNotFound": "cvm不存在。",
            "InternalError.Db": "db錯誤。",
            "InternalError.DbAffectivedRows": "DB錯誤",
            "InternalError.ImageIdNotFound": "映像未找到。",
            "InternalError.OsNotSupport": "映像OS不支持。",
            "InternalError.Param": "Param。",
            InvalidParameter: "參數錯誤",
            "InvalidParameter.AsCommonError": "彈性伸縮組創建參數錯誤。",
            LimitExceeded: "超過配額限制",
            MissingParameter: "缺少參數錯誤",
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
    refresh() {
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
      console.log(val);
    },
    //机型model确定选择数据
    ModelSure() {
      var modeData = this.modeData;
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
        this.systemDiskShow = "高性能雲硬碟   " + this.asg.diskCapacity;
      } else {
        this.systemDiskShow = "SSD雲硬碟   " + this.asg.diskCapacity;
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
        if (res.Response.Error === undefined) {
          var dataList = res.Response.InstanceTypeQuotaSet;
          this.modeData = res.Response.InstanceTypeQuotaSet[0];
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
              if (v.InstanceFamily == "C3") {
                return list.push(v);
              }
            });
            dataList = list;
          } else if (this.asg.familyObj !== "all1" && this.v3 == true) {
            var list = [];
            dataList.map((v, i) => {
              if (v.InstanceFamily == "M3") {
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
        setValue: this.inputRoom
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
              "高性能雲硬碟" +
              dataArr[i].dataDiskNum +
              "GB;";
          } else if (dataArr[i].dataDiskVal === "CLOUD_SSD") {
            datadisk +=
              "[" +
              (i + 1) +
              "]" +
              "SSD雲硬碟" +
              dataArr[i].dataDiskNum +
              "GB;";
          }
        }
        this.datadisk = datadisk.substring(0, datadisk.length - 1);
        this.buyDataDiskShow = false;
      } else {
        this.datadisk = "暫不購買";
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
        this.publicband = "按寬頻計費 " + this.asg.broadbandNum + "Mbps";
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
          this.asg.security =
            res.Response.SecurityGroupSet[0].SecurityGroupName;
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
        return "標準型S3";
      } else if (val === "Compute C3") {
        return "計算型C3";
      } else if (val === "MEM-optimized M3") {
        return "記憶體型M3";
      } else {
        return val;
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
        return "台北" + val.substring(val.length - 1, val.length) + "區";
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


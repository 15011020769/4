<template>
  <div class="defaultDetail">
    <Header title="管理告警策略" :backShow="backShow" />
    <el-card class="box-card">
      <div slot="header" class="clearfix" style="width:100%">
        <h3>基本信息</h3>
      </div>
      <ul>
        <li>
          <span class="textColor">策略名称</span>
          <p>
            <span>{{ basicNews.GroupName }}</span>
            <i class="el-icon-edit" @click="editInfo('name')"></i>
          </p>
        </li>
        <li>
          <span class="textColor">策略类型</span>
          <p>
            <span>{{ basicNews.ShowName }}</span>
          </p>
        </li>
        <li>
          <span class="textColor">所属项目</span>
          <p>
            <span>{{ basicNews.ProjectId | ProjectName }}</span>
          </p>
        </li>
        <li>
          <span class="textColor">最后修改人</span>
          <p>
            <span>{{ basicNews.LastEditUin }}</span>
          </p>
        </li>
        <li>
          <span class="textColor">最后修改时间</span>
          <p>
            <span>{{ basicNews.UpdateTime }}</span>
          </p>
        </li>
        <li>
          <span class="textColor">备注</span>
          <p>
            <span>{{ basicNews.Remark }}</span>
            <i class="el-icon-edit" @click="editInfo('remarks')"></i>
          </p>
        </li>
      </ul>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix" style="width:100%;display:flex;">
        <h3>告警触发条件</h3>
        <a @click="editGaoJing">编辑</a>
      </div>
      <div class="box-content">
        <span class="textColor"
          >指标告警（{{ basicNews.IsUnionRule === 0 ? "任意" : "所有" }}）</span
        >
        <div
          v-for="(i, x) in basicNews.ConditionsConfig"
          class="trigger-condition"
          :key="x"
        >
          <p>
            {{ i.MetricShowName }}
            {{ i.CalcType | CalcType }} {{ i.CalcValue }}{{ i.Unit }}，持续{{
              i.ContinueTime / 60
            }}分钟，按{{ i.AlarmNotifyPeriod | AlarmNotifyPeriod
            }}{{ i.AlarmNotifyPeriod > 0 ? "重复告警" : "不重复告警" }}
          </p>
        </div>
        <span class="textColor" v-if="basicNews.EventConfig">事件告警</span>
        <div
          v-for="(j, q) in basicNews.EventConfig"
          class="trigger-condition"
          :key="q + 1"
        >
          <p>
            {{ j.EventShowName }}，{{
              j.AlarmNotifyPeriod > 0 ? "重复告警" : "不重复告警"
            }}
          </p>
        </div>
      </div>
    </el-card>
    <el-card class="box-card alarm-object">
      <div slot="header" class="clearfix">
        <h3>告警对象</h3>
        <a @click="editObject">编辑</a>
      </div>
      <div class="box-content">
        <el-row style="margin:10px 5px;padding-top:10px">
          <el-button type="primary">新增对象</el-button>
          <el-button
            v-if="UniqueId.length > 0"
            @click="AlarmObjectRemoval('', 2)"
            >解除</el-button
          >
          <el-button disabled v-else>解除</el-button>
          <el-button @click="alarmObjectRemovalAllVisible = true"
            >全部解除</el-button
          >
        </el-row>
      </div>
      <div class="alarm-object-table">
        <el-table
          ref="multipleTable"
          :data="alarmObjectData"
          style="width: 100%"
          v-loading="alarmObjecLoad"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection"></el-table-column>
          <el-table-column label="ID/主机名">
            <template slot-scope="scope">
              <p>
                {{ scope.row.InstanceId }}
                <!-- <a href="javascript:;">{{ scope.row.InstanceId }}</a> -->
              </p>
              <p>{{ scope.row.InstanceName }}</p>
            </template>
          </el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <p
                :class="{
                  green: scope.row.InstanceState === 'RUNNING',
                  red:
                    scope.row.InstanceState === 'STARTING' ||
                    scope.row.InstanceState === 'STOPPED'
                }"
              >
                {{ scope.row.InstanceState | InstanceState }}
              </p>
            </template>
          </el-table-column>
          <el-table-column label="网络类型">
            VPC 网络
          </el-table-column>
          <el-table-column label="IP地址">
            <template slot-scope="scope">
              <p>{{ scope.row.PrivateIpAddresses[0] }}(内网)</p>
              <p class="out-color-text">
                {{ scope.row.PublicIpAddresses[0] }}(外网)
              </p>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <a href="javascript:;" @click="AlarmObjectRemoval(scope.row, 1)"
                >移除</a
              >
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="tke-page">
          <div class="block">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pageIndex"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next"
              :total="total"
            ></el-pagination>
          </div>
        </div>
      </div>
    </el-card>
    <el-card class="box-card alarm-object alarm-receiving-object">
      <div slot="header" class="clearfix">
        <h3>告警接收对象</h3>
      </div>
      <div class="box-content" style="margin-top:20px;">
        <el-row>
          <el-button type="primary">编辑</el-button>
          <el-button @click="Remove('', 2)">解除</el-button>
          <el-button disabled>解除</el-button>
        </el-row>
      </div>
      <div class="alarm-object-table">
        <el-table
          ref="multipleTable"
          :data="receivingObjectData"
          style="width: 100%"
          height="300px"
          v-loading="receivingObjectLoad"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection"> </el-table-column>
          <el-table-column label="接收人">
            <template slot-scope="scope">
              {{ scope.row.Name }}
            </template>
          </el-table-column>
          <el-table-column label="有效时段"> </el-table-column>
          <el-table-column label="网络类型"> </el-table-column>
          <el-table-column label="IP地址"> </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <a href="javascript:;" @click="Remove(scope.row, 1)">移除</a>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix" style="width:100%;display:flex;">
        <h3>回调接口</h3>
      </div>
      <p class="tip">
        填写公网可访问到的url作为回调接口地址(域名或IP[:端口][/path])，云监控将及时把告警信息推送到该地址。
      </p>
      <div class="box-content" style="line-height: 30px;margin:20px 0;">
        未配置
        <el-tooltip content="Top center" placement="Top" effect="light">
          <i
            style="color:#888;cursor: pointer;"
            class="el-icon-edit"
            @click="callbackEdit"
          ></i>
        </el-tooltip>
      </div>
    </el-card>
    <!-- 修改名称 -->
    <el-dialog
      title="修改告警策略名称"
      :visible.sync="modifyNameDialogVisible"
      width="500px"
      custom-class="tke-dialog"
    >
      <div class="edit-dialog">
        <el-input
          size="small"
          placeholder="请输告警策略名称，20字以内"
          v-model="GroupName"
          @input="EditTips"
        ></el-input>
        <p v-if="tipsShow">告警策略名称不能为空</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="NameSure()">确定</el-button>
        <el-button @click="modifyNameDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
    <!-- 修改备注 -->
    <el-dialog
      title="修改告警策略备注"
      :visible.sync="modifyRemarksDialogVisible"
      width="600px"
      custom-class="tke-dialog"
    >
      <div class="edit-dialog">
        <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入告警策略备注，100字以内"
          v-model="remarksVal"
          maxlength="100"
        >
        </el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="NameSure">确定</el-button>
        <el-button @click="modifyRemarksDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
    <!-- 告警条件编辑 -->
    <el-dialog
      title="修改告警触发条件"
      :visible.sync="dialogEditGaojing"
      width="1024px"
    >
      <div>
        <div class="trigger-condition">
          <span>触发条件</span>
          <div class="chufaContent">
            <div>
              <el-radio v-model="radioChufa" label="1" @change="chufaTemplate"
                >触发条件模板</el-radio
              >
              <a style="margin-left:15px;">新增触发条件模板</a>
              <div class="content" v-show="showChufa1 == true ? true : false">
                <p>
                  <el-select
                    v-model="nameVal"
                    style="width:150px;"
                    @change="TriggerChange"
                    :disabled="nameVal === '当前策略下没有触发条件模板'"
                  >
                    <el-option
                      v-for="item in triggerCondition"
                      :key="item.GroupID"
                      :label="item.GroupName"
                      :value="item.GroupID"
                      label-width="40px"
                    ></el-option>
                  </el-select>
                  <a href="javascript:;" @click="AlarmTriggerCondition">刷新</a>
                </p>
                <div v-if="nameVal !== '当前策略下没有触发条件模板'">
                  <p>
                    <el-checkbox disabled>指标告警</el-checkbox>
                  </p>
                  <p>
                    <span>满足</span>
                    <el-select
                      disabled
                      v-model="Conditions.IsUnionRule"
                      style="width:90px;margin:0 5px;"
                    >
                      <el-option
                        v-for="x in satisfy"
                        :key="x.value"
                        :label="x.label"
                        :value="x.value"
                        label-width="40px"
                      ></el-option>
                    </el-select>
                    <span>条件时，触发告警</span>
                  </p>
                  <!-- 在这里进行便利，添加 -->
                  <ul class="ul-one">
                    <li
                      v-for="(item, index) in Conditions.Conditions"
                      :key="index"
                    >
                      <div>
                        if&nbsp;
                        <el-select
                          v-model="item.MetricDisplayName"
                          style="width:130px;"
                          disabled
                        >
                          <el-option
                            label
                            value
                            label-width="40px"
                          ></el-option> </el-select
                        >&nbsp;
                        <el-select
                          v-model="item.Period"
                          style="width:140px;"
                          disabled
                        >
                          <el-option
                            v-for="i in cycle"
                            :key="i.value"
                            :label="i.label"
                            :value="i.value"
                            label-width="40px"
                          ></el-option> </el-select
                        >&nbsp;
                        <el-select
                          v-model="item.CalcType"
                          style="width:70px;"
                          disabled
                        >
                          <el-option
                            v-for="i in CalcType"
                            :key="i.value"
                            :label="i.label"
                            :value="i.value"
                            label-width="40px"
                          ></el-option> </el-select
                        >&nbsp;
                        <div class="input-style-dis-box">
                          <el-input
                            class="input-style-dis"
                            :value="item.CalcValue"
                            disabled
                          />
                          <span class="input-p">{{ item.Unit }}</span>
                        </div>
                        &nbsp;
                        <el-select
                          v-model="item.ContinueTime"
                          style="width:130px;"
                          disabled
                        >
                          <el-option
                            v-for="i in ContinueTime"
                            :key="i.value"
                            :label="i.label"
                            :value="i.value"
                            label-width="40px"
                          ></el-option> </el-select
                        >&nbsp; <span>then</span>&nbsp;
                        <el-select
                          v-model="item.AlarmNotifyPeriod"
                          style="width:180px;"
                          disabled
                        >
                          <el-option
                            v-for="x in AlarmNotifyPeriod"
                            :key="x.value"
                            :label="x.label"
                            :value="x.value"
                            label-width="40px"
                          ></el-option>
                        </el-select>
                        <el-popover placement="top" width="360" trigger="hover">
                          <div>
                            <p>
                              重复通知：可以设置告警发生24小时内重复发送通知；超过24小时，每天告警一次，超过72小时，不再发送告警通知。
                            </p>
                            <p style="margin-top:5px;">
                              周期指数递增通知:
                              告警持续时长到达告警统计周期的1，2，4，8，16，32...倍时发送告警通知
                            </p>
                          </div>
                          <i
                            class="el-icon-info"
                            style="color:#888; margin:0 5px;"
                            slot="reference"
                          ></i>
                        </el-popover>
                      </div>
                    </li>
                  </ul>
                </div>
                <div v-if="nameVal !== '当前策略下没有触发条件模板'">
                  <p>
                    <el-checkbox disabled>
                      事件告警
                    </el-checkbox>
                    <el-popover placement="right" trigger="hover">
                      <div>
                        <p>各事件规则<a href="javascript:;">详情</a></p>
                      </div>
                      <i
                        class="el-icon-info"
                        style="color:#888; margin:0 5px;"
                        slot="reference"
                      ></i>
                    </el-popover>
                  </p>
                  <!-- 在这里进行便利，添加 -->
                  <ul>
                    <li v-for="(x, i) in Conditions.EventConditions" :key="i">
                      <div style="margin-left:15px;">
                        <el-select
                          v-model="x.EventDisplayName"
                          style="width:180px;margin-top: 6px;"
                          disabled
                        >
                          <el-option label value label-width="40px"></el-option>
                        </el-select>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div>
              <el-radio v-model="radioChufa" label="2" @change="config"
                >配置触发条件</el-radio
              >
              <div
                class="content content-pz"
                v-show="showChufa2 == true ? true : false"
              >
                <div>
                  <p style="line-height:30px;">
                    <el-checkbox
                      v-model="formWrite.checkedZhibiao"
                      style="height:30px;"
                      >指标告警</el-checkbox
                    >
                  </p>
                  <p>
                    <span>满足</span>
                    <el-select
                      v-model="formWrite.satisfyVal"
                      style="width:90px;margin:0 5px;"
                    >
                      <el-option
                        v-for="x in satisfy"
                        :key="x.value"
                        :label="x.name"
                        :value="x.value"
                        label-width="40px"
                      ></el-option>
                    </el-select>
                    <span>条件时，触发告警</span>
                  </p>
                  <!-- 在这里进行便利，添加 -->
                  <ul class="ul-one ul-two" v-if="formWrite.satisfyVal === 0">
                    <li v-for="(item, index) in formWrite.arr" :key="index">
                      <div>
                        if&nbsp;
                        <el-select v-model="item.typeVal" style="width:150px;">
                          <el-option
                            v-for="x in typeOpt"
                            :key="x.value"
                            :label="x.label"
                            :value="x.value"
                            label-width="40px"
                          ></el-option> </el-select
                        >&nbsp;
                        <el-select
                          v-model="item.censusVal"
                          style="width:140px;"
                        >
                          <el-option
                            v-for="x in cycle"
                            :key="x.value"
                            :label="x.label"
                            :value="x.value"
                            label-width="40px"
                          ></el-option> </el-select
                        >&nbsp;
                        <el-select
                          v-model="item.calcTypeVal"
                          style="width:60px;"
                        >
                          <el-option
                            v-for="x in CalcType"
                            :key="x.value"
                            :label="x.label"
                            :value="x.value"
                            label-width="40px"
                          ></el-option> </el-select
                        >&nbsp;
                        <div class="input-style-dis-box">
                          <input
                            class="input-style-dis"
                            placeholder="指标"
                            :value="item.number"
                            min="0"
                            max="100"
                            type="number"
                          />
                          <span class="input-p">{{ item.unit }}</span>
                        </div>
                        &nbsp;
                        <el-select
                          v-model="item.continuousCycleVal"
                          style="width:110px;"
                        >
                          <el-option
                            v-for="x in continuousCycleOpt"
                            :key="x.value"
                            :label="x.label"
                            :value="x.value"
                            label-width="40px"
                          ></el-option> </el-select
                        >&nbsp; <span>then</span>&nbsp;
                        <el-select
                          v-model="item.warningVal"
                          style="width:150px;"
                        >
                          <el-option
                            v-for="item in warningOpt"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                            label-width="40px"
                          ></el-option>
                        </el-select>
                        <el-popover placement="top" width="360" trigger="hover">
                          <div>
                            <p>
                              重复通知：可以设置告警发生24小时内重复发送通知；超过24小时，每天告警一次，超过72小时，不再发送告警通知。
                            </p>
                            <p style="margin-top:5px;">
                              周期指数递增通知:
                              告警持续时长到达告警统计周期的1，2，4，8，16，32...倍时发送告警通知
                            </p>
                          </div>
                          <i
                            class="el-icon-info"
                            style="color:#888; margin:0 5px;"
                            slot="reference"
                          ></i>
                        </el-popover>
                      </div>
                      <i
                        v-if="formWrite.arr.length > 0"
                        class="el-icon-error"
                        style="color:#888; margin:10px 5px;"
                        @click="delZhibiao"
                      ></i>
                    </li>
                    <a @click="addZhibiao('deploy')">添加</a>
                  </ul>
                  <ul class="ul-one ul-two" v-if="formWrite.satisfyVal === 1">
                    <li v-for="(item, index) in formWrite.arrAll" :key="index">
                      <div>
                        if&nbsp;
                        <el-select v-model="item.typeVal" style="width:150px;">
                          <el-option
                            v-for="x in typeOpt"
                            :key="x.value"
                            :label="x.label"
                            :value="x.value"
                            label-width="40px"
                          ></el-option> </el-select
                        >&nbsp;
                        <el-select
                          v-model="item.censusVal"
                          style="width:140px;"
                        >
                          <el-option
                            v-for="x in cycle"
                            :key="x.value"
                            :label="x.label"
                            :value="x.value"
                            label-width="40px"
                          ></el-option> </el-select
                        >&nbsp;
                        <el-select
                          v-model="item.calcTypeVal"
                          style="width:60px;"
                        >
                          <el-option
                            v-for="x in CalcType"
                            :key="x.value"
                            :label="x.label"
                            :value="x.value"
                            label-width="40px"
                          ></el-option> </el-select
                        >&nbsp;
                        <div class="input-style-dis-box">
                          <input
                            class="input-style-dis"
                            placeholder="指标"
                            :value="item.number"
                            min="0"
                            max="100"
                            type="number"
                          />
                          <span class="input-p">{{ item.unit }}</span>
                        </div>
                        &nbsp;
                        <el-select
                          v-model="item.continuousCycleVal"
                          style="width:110px;"
                        >
                          <el-option
                            v-for="x in continuousCycleOpt"
                            :key="x.value"
                            :label="x.label"
                            :value="x.value"
                            label-width="40px"
                          ></el-option> </el-select
                        >&nbsp;
                      </div>
                    </li>
                    <a @click="addZhibiao("all")">添加</a>
                    <div>
                      <span>then</span>&nbsp;
                      <el-select
                        v-model="formWrite.warningVal"
                        style="width:150px;"
                      >
                        <el-option
                          v-for="item in warningOpt"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                          label-width="40px"
                        ></el-option>
                      </el-select>
                      <el-popover placement="top" width="360" trigger="hover">
                        <div>
                          <p>
                            重复通知：可以设置告警发生24小时内重复发送通知；超过24小时，每天告警一次，超过72小时，不再发送告警通知。
                          </p>
                          <p style="margin-top:5px;">
                            周期指数递增通知:
                            告警持续时长到达告警统计周期的1，2，4，8，16，32...倍时发送告警通知
                          </p>
                        </div>
                        <i
                          class="el-icon-info"
                          style="color:#888; margin:0 5px;"
                          slot="reference"
                        ></i>
                      </el-popover>
                    </div>
                    <i
                      v-if="formWrite.arr.length === 0"
                      class="el-icon-error"
                      style="color:#888; margin:10px 5px;"
                      @click="delZhibiao"
                    ></i>
                  </ul>
                </div>
                <div>
                  <p>
                    <el-checkbox v-model="formWrite.checkedGaojing">
                      事件告警
                      <el-popover placement="right" trigger="hover">
                        <div>
                          <p>各事件规则<a href="javascript:;">详情</a></p>
                        </div>
                        <i
                          class="el-icon-info"
                          style="color:#888; margin:0 5px;"
                          slot="reference"
                        ></i>
                      </el-popover>
                    </el-checkbox>
                  </p>
                  <!-- 在这里进行便利，添加 -->
                  <ul>
                    <li v-for="(i, x) in formWrite.gaoArr" :key="x">
                      <p>
                        <el-select
                          v-model="i.eventVal"
                          style="width:180px;margin:0 5px;"
                        >
                          <el-option
                            v-for="item in eventOpt"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                            label-width="40px"
                          ></el-option>
                        </el-select>
                      </p>
                      <i
                        class="el-icon-error"
                        style="color:#888; margin:0 5px;"
                        @click="delShijian"
                      ></i>
                    </li>
                    <a @click="addShijian">添加</a>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogEditGaojing = false"
          >保 存</el-button
        >
        <el-button @click="dialogEditGaojing = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 告警对象编辑 -->
    <el-dialog title="修改告警对象" :visible.sync="dialogEditObject">
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogEditObject = false"
          >保 存</el-button
        >
        <el-button @click="dialogEditObject = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 告警对象移出 -->
    <el-dialog
      :title="alarmObjecTitle"
      :visible.sync="alarmObjectRemovalVisible"
      width="500px"
      custom-class="tke-dialog"
    >
      <div class="edit-dialog">
        解除后，将不会收到告警
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="AlarmObjectRemovalSure"
          >解除</el-button
        >
        <el-button @click="alarmObjectRemovalVisible = false">取消</el-button>
      </span>
    </el-dialog>
    <!-- 告警对象全部移出 -->
    <el-dialog
      title="确定解除当前地域下所有实例？"
      :visible.sync="alarmObjectRemovalAllVisible"
      width="500px"
      custom-class="tke-dialog"
    >
      <div class="edit-dialog">
        解除后，将不会收到告警
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="AlarmObjectRemovalAllSure"
          >全部解除</el-button
        >
        <el-button @click="alarmObjectRemovalAllVisible = false"
          >取消</el-button
        >
      </span>
    </el-dialog>
    <!-- 回调接口 -->
    <el-dialog
      title="回调接口"
      :visible.sync="callbackInterface"
      width="550px"
      class="callback-dialog-box"
    >
      <div class="callback-interface-box">
        <el-select v-model="formInline.apiStr" style="width:100px;">
          <el-option
            v-for="(item, index) in formInline.apiArr"
            :key="index"
            :label="item.name"
            :value="item.value"
            label-width="40px"
          ></el-option>
        </el-select>
        <el-select
          filterable
          v-model="formInline.group"
          style="width:250px;margin-left:10px;margin-right:20px;"
        >
          <el-option
            v-for="(item, index) in formInline.kind_list"
            :key="index"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
        <p>
          填写公网可访问到的url作为回调接口地址(域名或IP[:端口][/path])，云监控将及时把告警信息推送到该地址。
        </p>
        <div class="bg-box">
          <p>
            回调域名通过验证后生效，请于Response Body中返回以下code。
            <el-tooltip
              effect="light"
              content="触发验证后推送请求三次，每次3s，累计9s未成功返回即验证超时。"
              placement="top"
              ><i class="el-icon-info"></i>
            </el-tooltip>
          </p>
          <span>c5oqchmd</span>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="callbackInterface = false"
          >保 存</el-button
        >
        <el-button @click="callbackInterface = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 告警接收对象 解除 -->
    <el-dialog
      :title="relieveTitle"
      :visible.sync="relieveDialogVisible"
      width="600px"
      custom-class="tke-dialog"
    >
      <div>
        确认解除告警接收人关联
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary">确定</el-button>
        <el-button @click="relieveDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Header from "./Head";
import { ErrorTips } from "@/components/ErrorTips";
import {
  CM_ALARM_STRATEGY_DETAILS,
  CM_GROUPING_LIST_EDIT,
  ALL_PROJECT,
  CM_ALARM_OBJECT_LIST,
  CM_GROUPING_MANAGELIST,
  CM_ALARM_OBJECT_LIST_OUT,
  CM_ALARM_OBJECT_LIST_ALLOUT,
  CM_ALARM_RECEIVE_OBJECT_LIST,
  CM_CALLBACK,
  CM_ALARM_TRIGGER_CONDITION,
  CM_ALARM_RECEIVE_OBJECT_RELIEVE
} from "@/constants";
var project = [];
var _ReceiverUserList = [];
export default {
  data() {
    return {
      backShow: true,
      basicNews: "",
      editName: "",
      GroupName: "",
      Remark: "",
      project,
      _ReceiverUserList,
      editBeizhuFlag: false,
      dialogFormVisible: false, //基本信息组件弹框
      dialogEditGaojing: false, //编辑告警弹框组件
      dialogEditObject: false, //编辑告警弹框组件
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      formLabelWidth: "120px",
      modifyNameDialogVisible: false,
      tipsShow: false,
      modifyRemarksDialogVisible: false,
      remarksVal: "",
      formInline: {
        jieshou: "接收组",
        jieshouArr: [
          { value: "0", name: "接收组" },
          {
            value: "1",
            name: "接收人"
          }
        ],
        apiStr: "http", //接口回调
        apiArr: [
          {
            value: 0,
            name: "http"
          },
          {
            value: 1,
            name: "https"
          }
        ], //接口回调数据
        strategy_name: "", //策略名称
        textarea: "", //备注
        strategy: "云服务器-基础监控",
        strategy_kind: [
          {
            value: 0,
            name: "云服务器-基础监控"
          }
        ], //策略类型
        alarm: "", //策略类型
        projectName: "默认项目"
      },
      showChufa1: false, //触发条件1显示开关
      showChufa2: true, //触发条件2显示开关
      showQudao1: false, //渠道选择1显示开关
      showQudao2: false, //渠道选择2显示开关
      errorTip1: false, //触发条件模板错误提示
      errorTip2: true, //配置触发条件错误提示
      triggerInput: "", //新增接收
      radio: "1", //选择告警对象类型
      radioChufa: "2", //触发条件单选
      input: "",
      input1: "",
      alarmObjectData: [],
      alarmObjecLoad: true,
      receivingObjectData: [],
      callbackInterface: false,
      //分页
      total: 0, //总条数
      pageSize: 10, // 分页条数
      pageIndex: 0, // 当前页码
      // 告警对象
      alarmObjectRemovalVisible: false,
      alarmObjecTitle: "确定解除与该告警对象的关联？",
      UniqueId: "",
      alarmObjectRemovalAllVisible: false,
      // 修改触发条件
      nameVal: "",
      triggerCondition: [],
      Offset: 0,
      describeContactList: [],
      describeContactListLength: "",
      // 告警接收对象
      relieveDialogVisible: false,
      relieveTitle: "",
      remove: "",
      receivingObjectLoad: true,
      // 编辑告警触发条件
      Conditions: [],
      ViewName: "",
      cycle: [
        {
          value: "60",
          label: "统计周期1分钟"
        },
        {
          value: "300",
          label: "统计周期5分钟"
        }
      ],
      satisfy: [
        {
          value: 0,
          name: "任意"
        },
        {
          value: 1,
          name: "所有"
        }
      ],
      satisfyVal: 0,
      CalcType: [
        {
          value: "1",
          label: ">"
        },
        {
          value: "2",
          label: ">="
        },
        {
          value: "3",
          label: "<"
        },
        {
          value: "4",
          label: "<="
        },
        {
          value: "5",
          label: "="
        },
        {
          value: "6",
          label: "!="
        }
      ],
      ContinueTime: [],
      AlarmNotifyPeriod: [],
      formWrite: {
        checkedZhibiao: true,
        satisfyVal: 0,
        checkedGaojing: true,
        warningVal: 0,
        index:0,
        arr: [
          {
            typeVal: "1",
            censusVal: "300",
            calcTypeVal: "1",
            number: "0",
            unit: "%",
            continuousCycleVal: "1",
            warningVal: "0"
          }
        ],
        arrAll: [
          {
            typeVal: "1",
            censusVal: "300",
            calcTypeVal: "1",
            number: "0",
            unit: "%",
            continuousCycleVal: "1"
          }
        ],
        gaoArr: [
          {
            eventVal: "1"
          }
        ]
      },
      typeOpt: [
        {
          value: "CPU利用率",
          label: "CPU利用率"
        },
        {
          value: "内存利用率",
          label: "内存利用率"
        },
        {
          value: "内存使用量",
          label: "内存使用量"
        },
        {
          value: "磁盘利用率",
          label: "磁盘利用率"
        },
        {
          value: "磁盘读流量",
          label: "磁盘读流量"
        },
        {
          value: "磁盘写流量",
          label: "磁盘写流量"
        },
        {
          value: "磁盘IO等待",
          label: "磁盘IO等待"
        },
        {
          value: "内网入包量",
          label: "内网入包量"
        },
        {
          value: "内网出包量",
          label: "内网出包量"
        },
        {
          value: "外网入带宽",
          label: "外网入带宽"
        },
        {
          value: "外网出带宽",
          label: "外网出带宽"
        },
        {
          value: "外网入包量",
          label: "外网入包量"
        },
        {
          value: "外网出包量",
          label: "外网出包量"
        },
        {
          value: "外网带宽使用率",
          label: "外网带宽使用率"
        },
        {
          value: "TCP连接数",
          label: "TCP连接数"
        },
        {
          value: "CPU一分钟平均负载",
          label: "CPU一分钟平均负载"
        },
        {
          value: "CPU五分钟平均负载",
          label: "CPU五分钟平均负载"
        },
        {
          value: "CPU十五分钟平均负载",
          label: "CPU十五分钟平均负载"
        },
        {
          value: "基础CPU利用率",
          label: "基础CPU利用率"
        },
        {
          value: "内网入带宽",
          label: "内网入带宽"
        },
        {
          value: "内网出带宽",
          label: "内网出带宽"
        }
      ],
      continuousCycleOpt: [
        {
          value: "1",
          label: "持续1个周期"
        },
        {
          value: "2",
          label: "持续2个周期"
        },
        {
          value: "3",
          label: "持续3个周期"
        },
        {
          value: "4",
          label: "持续4个周期"
        },
        {
          value: "5",
          label: "持续5个周期"
        }
      ],
      warningOpt: [
        {
          value: "0",
          label: "不重复"
        },
        {
          value: "300",
          label: "每5分钟警告一次"
        },
        {
          value: "600",
          label: "每10分钟警告一次"
        },
        {
          value: "900",
          label: "每15分钟警告一次"
        },
        {
          value: "1800",
          label: "每30分钟警告一次"
        },
        {
          value: "3600",
          label: "每1小时警告一次"
        },
        {
          value: "7200",
          label: "每2小时警告一次"
        },
        {
          value: "10800",
          label: "每3小时警告一次"
        },
        {
          value: "21600",
          label: "每6小时警告一次"
        },
        {
          value: "43200",
          label: "每12小时警告一次"
        },
        {
          value: "86400",
          label: "每1天警告一次"
        },
        {
          value: "1",
          label: "周期指数递增"
        }
      ],
      eventOpt: [
        {
          value: "1",
          label: "磁盘只读"
        },
        {
          value: "2",
          label: "内核故障"
        },
        {
          value: "3",
          label: "内存oom"
        },
        {
          value: "4",
          label: "ping不可达"
        },
        {
          value: "5",
          label: "机器重启"
        },
        {
          value: "6",
          label: "外网出带宽超限导致丢包"
        },
        {
          value: "7",
          label: "agent上报超时"
        },
        {
          value: "8",
          label: "子机nvme设备error"
        }
      ]
    };
  },
  components: { Header },
  mounted() {
    this.DetailsInit();
    this.Project();
    // 告警对象列表
    this.AlarmObjectList();
  },
  methods: {
    async DetailsInit() {
      let params = {
        Version: "2018-07-24",
        Module: "monitor",
        GroupId: this.$route.query.groupId
      };
      await this.axios.post(CM_ALARM_STRATEGY_DETAILS, params).then(res => {
        if (res.Response.Error === undefined) {
          this.basicNews = res.Response;
          this.ViewName = this.basicNews.ViewName;
          if (this.basicNews.ReceiverInfos !== undefined) {
            _ReceiverUserList = this.basicNews.ReceiverInfos[0]
              .ReceiverUserList;

            this.describeContactList = [];
            this.receivingObjectLoad = true;
            var setTime = setInterval(() => {
              this.receivingObjectData = [];
              this.Offset++;
              let params = {
                // Region: "ap-taipei",
                Version: "2018-07-24",
                Module: "monitor",
                Limit: 100,
                Offset: this.Offset
              };
              this.axios
                .post(CM_ALARM_RECEIVE_OBJECT_LIST, params)
                .then(res => {
                  if (res.Response.Error === undefined) {
                    var arr = res.Response.List;
                    this.describeContactListLength = res.Response.TotalNum;
                    for (let i = 0; i < arr.length; i++) {
                      this.describeContactList.push(arr[i]);
                    }

                    for (let i in _ReceiverUserList) {
                      for (let j in this.describeContactList) {
                        if (
                          _ReceiverUserList[i] ==
                          this.describeContactList[j].Uid
                        ) {
                          this.receivingObjectData.push(
                            this.describeContactList[j]
                          );
                        }
                      }
                    }

                    console.log(
                      "this.receivingObjectData",
                      this.receivingObjectData
                    );
                  } else {
                    let ErrTips = {
                      FailedOperation: "操作失败。",
                      InternalError: "内部错误。",
                      InvalidParameter: "参数错误。",
                      LimitExceeded: "超过配额限制。",
                      MissingParameter: "缺少参数错误。",
                      ResourceInUse: "资源被占用。",
                      ResourceInsufficient: "资源不足。",
                      ResourceNotFound: "资源不存在。",
                      ResourceUnavailable: "资源不可用。",
                      UnauthorizedOperation: "未授权操作。",
                      UnknownParameter: "未知参数错误。",
                      UnsupportedOperation: "操作不支持。"
                    };
                    let ErrOr = Object.assign(ErrorTips, ErrTips);
                    this.$message({
                      message: ErrOr[res.Response.Error.Code],
                      type: "error",
                      showClose: true,
                      duration: 0
                    });
                  }

                  if (
                    this.Offset ==
                    Math.ceil(Number(this.describeContactListLength) / 100)
                  ) {
                    clearInterval(setTime);
                    this.receivingObjectLoad = false;
                  }
                });
            }, 1000);
          }
        } else {
          let ErrTips = {
            "AuthFailure.UnauthorizedOperation":
              "请求未授权。请参考 CAM 文档对鉴权的说明。",
            DryRunOperation:
              "DryRun 操作，代表请求将会是成功的，只是多传了 DryRun 参数。",
            FailedOperation: "	操作失败。",
            "FailedOperation.AlertFilterRuleDeleteFailed": "删除过滤条件失败。",
            "FailedOperation.AlertPolicyCreateFailed": "创建告警策略失败。",
            "FailedOperation.AlertPolicyDeleteFailed": "告警策略删除失败。",
            "FailedOperation.AlertPolicyDescribeFailed": "告警策略查询失败。",
            "FailedOperation.AlertPolicyModifyFailed": "告警策略修改失败。",
            "FailedOperation.AlertTriggerRuleDeleteFailed":
              "删除触发条件失败。",
            "FailedOperation.DbQueryFailed": "数据库查询失败。",
            "FailedOperation.DbRecordCreateFailed": "创建数据库记录失败。",
            "FailedOperation.DbRecordDeleteFailed": "数据库记录删除失败。",
            "FailedOperation.DbRecordUpdateFailed": "数据库记录更新失败。",
            "FailedOperation.DbTransactionBeginFailed": "数据库事务开始失败。",
            "FailedOperation.DbTransactionCommitFailed": "数据库事务提交失败。",
            "FailedOperation.DimQueryRequestFailed": "请求维度查询服务失败。",
            "FailedOperation.DruidQueryFailed": "查询分析数据失败。",
            "FailedOperation.DuplicateName": "名字重复。",
            "FailedOperation.ServiceNotEnabled":
              "服务未启用，开通服务后方可使用。",
            InternalError: "内部错误。",
            "InternalError.ExeTimeout": "执行超时。",
            InvalidParameter: "参数错误。",
            "InvalidParameter.InvalidParameter": "参数错误。",
            "InvalidParameter.InvalidParameterParam": "参数错误。",
            InvalidParameterValue: "无效的参数值。",
            LimitExceeded: "超过配额限制。",
            "LimitExceeded.MetricQuotaExceeded":
              "指标数量达到配额限制，禁止含有未注册指标的请求。",
            MissingParameter: "	缺少参数错误。",
            ResourceInUse: "资源被占用。",
            ResourceInsufficient: "资源不足。",
            ResourceNotFound: "资源不存在。",
            ResourceUnavailable: "资源不可用。",
            ResourcesSoldOut: "资源售罄。",
            UnauthorizedOperation: "未授权操作。",
            UnknownParameter: "未知参数错误。",
            UnsupportedOperation: "操作不支持。"
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
    // 项目
    Project() {
      this.axios.get(ALL_PROJECT).then(res => {
        if (res.codeDesc === "Success") {
          var arr = res.data;
          project = arr;
        } else {
          let ErrTips = {
            InternalError: "内部错误",
            UnauthorizedOperation: "未授权操作"
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
    callbackEdit() {
      // 回调接口配置
      this.callbackInterface = true;
    },
    EditTips() {
      if (this.GroupName == "") {
        this.tipsShow = true;
      } else {
        this.tipsShow = false;
      }
    },
    editObject() {
      //编辑告警对象
      this.dialogEditObject = true;
    },
    editGaoJing() {
      // 编辑告警触发条件
      this.dialogEditGaojing = true;
      this.AlarmTriggerCondition();
      console.log(this.basicNews);
      this.formWrite.satisfyVal = this.basicNews.IsUnionRule;
      if (this.basicNews.ConditionsConfig) {
        var _ConditionsConfig = this.basicNews.ConditionsConfig;
        this.formWrite.arr = [];
        for (let i in _ConditionsConfig) {
          this.formWrite.arr.push({
            typeVal: _ConditionsConfig[i].MetricShowName,
            censusVal: _ConditionsConfig[i].Period.toString(),
            calcTypeVal: _ConditionsConfig[i].CalcType.toString(),
            number: _ConditionsConfig[i].CalcValue.toString(),
            unit: _ConditionsConfig[i].Unit,
            continuousCycleVal: (
              Number(_ConditionsConfig[i].ContinueTime) /
              Number(_ConditionsConfig[i].Period)
            ).toString(),
            warningVal: _ConditionsConfig[i].AlarmNotifyPeriod.toString()
          });
        }
      }
    },
    // 告警触发条件
    AlarmTriggerCondition() {
      let param = {
        Version: "2018-07-24",
        Module: "monitor",
        ViewName: this.ViewName
      };
      this.axios.post(CM_ALARM_TRIGGER_CONDITION, param).then(res => {
        if (res.Response.Error === undefined) {
          // console.log(res.Response);
          this.triggerCondition = res.Response.TemplateGroupList;
          console.log(this.triggerCondition);
          this.nameVal =
            this.triggerCondition.length === 0
              ? "当前策略下没有触发条件模板"
              : this.triggerCondition[0].GroupID;
          this.TriggerChange();
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
    TriggerChange() {
      console.log(this.nameVal);

      for (let i in this.triggerCondition) {
        if (this.triggerCondition[i].GroupID == this.nameVal) {
          this.Conditions = this.triggerCondition[i];
        }
      }

      for (let j in this.Conditions.Conditions) {
        this.ContinueTime.push({
          value: this.Conditions.Conditions[j].ContinueTime,
          label:
            "持续" +
            Number(this.Conditions.Conditions[j].ContinueTime) /
              Number(this.Conditions.Conditions[j].Period) +
            "个周期"
        });
        if (
          (this.Conditions.Conditions[j].AlarmNotifyPeriod / 60 / 60) % 1 ==
          0
        ) {
          if (
            (this.Conditions.Conditions[j].AlarmNotifyPeriod / 60 / 60 / 24) %
              1 ==
            0
          ) {
            this.AlarmNotifyPeriod.push({
              value: this.Conditions.Conditions[j].AlarmNotifyPeriod,
              label:
                "每" +
                this.Conditions.Conditions[j].AlarmNotifyPeriod / 60 / 60 / 24 +
                "天警告一次"
            });
          } else {
            this.AlarmNotifyPeriod.push({
              value: this.Conditions.Conditions[j].AlarmNotifyPeriod,
              label:
                "每" +
                this.Conditions.Conditions[j].AlarmNotifyPeriod / 60 / 60 +
                "小时警告一次"
            });
          }
        } else if (
          (this.Conditions.Conditions[j].AlarmNotifyPeriod / 60) % 1 ==
          0
        ) {
          this.AlarmNotifyPeriod.push({
            value: this.Conditions.Conditions[j].AlarmNotifyPeriod,
            label:
              "每" +
              this.Conditions.Conditions[j].AlarmNotifyPeriod / 60 +
              "分钟警告一次"
          });
        }
      }
      console.log(" this.Conditions ", this.Conditions);
    },
    editInfo(name) {
      //编辑备注
      if (name === "name") {
        this.modifyNameDialogVisible = true;
        this.GroupName = this.basicNews.GroupName;
      } else {
        this.modifyRemarksDialogVisible = true;
        this.remarksVal = this.basicNews.Remark;
      }
      this.editName = name;
    },
    NameSure() {
      if (this.GroupName == "" && this.editName === "name") {
        return false;
      }
      let param = {
        Version: "2018-07-24",
        Module: "monitor",
        GroupId: this.$route.query.groupId,
        GroupType: 1
      };
      if (this.editName === "name") {
        param["Key"] = "groupName";
        param["Value"] = this.GroupName;
      } else {
        param["Key"] = "remark";
        param["Value"] = this.remarksVal;
      }
      this.axios.post(CM_GROUPING_LIST_EDIT, param).then(res => {
        if (res.Response.Error === undefined) {
          this.modifyNameDialogVisible = false;
          this.modifyRemarksDialogVisible = false;
          this.DetailsInit();
          if (this.editName === "name") {
            this.$message({
              message: "修改名称成功",
              type: "success",
              showClose: true,
              duration: 0
            });
          } else {
            this.$message({
              message: "修改备注成功",
              type: "success",
              showClose: true,
              duration: 0
            });
          }
        } else {
          let ErrTips = {
            FailedOperation: "操作失败。",
            InternalError: "内部错误。",
            "InternalError.ExeTimeout": "执行超时。",
            InvalidParameter: "参数错误。",
            "InvalidParameter.InvalidParameter": "参数错误。",
            "InvalidParameter.InvalidParameterParam": "参数错误。",
            InvalidParameterValue: "无效的参数值。",
            LimitExceeded: "超过配额限制。",
            MissingParameter: "缺少参数错误。",
            UnknownParameter: "未知参数错误。",
            UnsupportedOperation: "操作不支持。"
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
    // 告警对象列表
    async AlarmObjectList() {
      this.alarmObjecLoad = true;
      let param = {
        Version: "2018-07-24",
        Module: "monitor",
        GroupId: this.$route.query.groupId,
        Limit: this.pageSize,
        Offset: this.pageIndex
      };
      await this.$axios.post(CM_ALARM_OBJECT_LIST, param).then(res => {
        if (res.Response.Error === undefined) {
          // console.log(res.Response);
          var _enterList = res.Response.List;
          console.log(_enterList);
          this.total = res.Response.Total;
          if (this.total > 0) {
            let params = {
              Version: "2017-03-12",
              Limit: this.pageSize,
              Offset: this.pageIndex
            };

            for (let i in _enterList) {
              params["InstanceIds." + i] = JSON.parse(
                _enterList[i].Dimensions
              ).unInstanceId;
            }

            this.axios.post(CM_GROUPING_MANAGELIST, params).then(res => {
              if (res.Response.Error === undefined) {
                this.alarmObjectData = res.Response.InstanceSet;
                for (let i in _enterList) {
                  for (let j in this.alarmObjectData) {
                    if (
                      JSON.parse(_enterList[i].Dimensions).unInstanceId ===
                      this.alarmObjectData[j].InstanceId
                    ) {
                      this.alarmObjectData[j]["UniqueId"] =
                        _enterList[i].UniqueId;
                    }
                  }
                }
                console.log(this.alarmObjectData);
                this.alarmObjecLoad = false;
              } else {
                let ErrTips = {
                  FailedOperation: "操作失败",
                  InternalError: "内部错误",
                  "InternalError.Param": "Param。",
                  "InternalError.PublicClusterOpNotSupport":
                    "集群不支持当前操作。",
                  InvalidParameter: "参数错误",
                  ResourceNotFound: "资源不存在",
                  ResourceUnavailable: "资源不可用"
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
            this.alarmObjectData = [];
            this.alarmObjecLoad = false;
          }
        } else {
          let ErrTips = {
            "AuthFailure.UnauthorizedOperation":
              "请求未授权。请参考 CAM 文档对鉴权的说明。",
            DryRunOperation:
              "DryRun 操作，代表请求将会是成功的，只是多传了 DryRun 参数。",
            FailedOperation: "	操作失败。",
            "FailedOperation.AlertFilterRuleDeleteFailed": "删除过滤条件失败。",
            "FailedOperation.AlertPolicyCreateFailed": "创建告警策略失败。",
            "FailedOperation.AlertPolicyDeleteFailed": "告警策略删除失败。",
            "FailedOperation.AlertPolicyDescribeFailed": "告警策略查询失败。",
            "FailedOperation.AlertPolicyModifyFailed": "告警策略修改失败。",
            "FailedOperation.AlertTriggerRuleDeleteFailed":
              "删除触发条件失败。",
            "FailedOperation.DbQueryFailed": "数据库查询失败。",
            "FailedOperation.DbRecordCreateFailed": "创建数据库记录失败。",
            "FailedOperation.DbRecordDeleteFailed": "数据库记录删除失败。",
            "FailedOperation.DbRecordUpdateFailed": "数据库记录更新失败。",
            "FailedOperation.DbTransactionBeginFailed": "数据库事务开始失败。",
            "FailedOperation.DbTransactionCommitFailed": "数据库事务提交失败。",
            "FailedOperation.DimQueryRequestFailed": "请求维度查询服务失败。",
            "FailedOperation.DivisionByZero": "被除数为0。",
            "FailedOperation.DruidQueryFailed": "查询分析数据失败。",
            "FailedOperation.DruidTableNotFound": "druid表不存在。",
            "FailedOperation.DuplicateName": "名字重复。",
            "FailedOperation.ServiceNotEnabled":
              "服务未启用，开通服务后方可使用。",
            InternalError: "内部错误。",
            "InternalError.ExeTimeout": "执行超时。",
            InvalidParameter: "参数错误。",
            "InvalidParameter.InvalidParameter": "参数错误。",
            "InvalidParameter.InvalidParameterParam": "参数错误。",
            InvalidParameterValue: "无效的参数值。",
            LimitExceeded: "超过配额限制。",
            "LimitExceeded.MetricQuotaExceeded":
              "指标数量达到配额限制，禁止含有未注册指标的请求。",
            MissingParameter: "缺少参数错误。",
            ResourceInUse: "资源被占用。",
            ResourceInsufficient: "资源不足。",
            ResourceNotFound: "资源不存在。",
            ResourceUnavailable: "资源不可用。",
            ResourcesSoldOut: "资源售罄。",
            UnauthorizedOperation: "未授权操作。",
            UnknownParameter: "未知参数错误。",
            UnsupportedOperation: "操作不支持。"
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
    // 告警对象移除
    AlarmObjectRemoval(row, index) {
      console.log(row, index);
      if (index == 1) {
        this.alarmObjecTitle = "确定解除与该告警对象的关联？";
        this.UniqueId = row.UniqueId;
      } else {
        this.alarmObjecTitle =
          "已选择" + this.UniqueId.length + "个告警对象，确定要解除关联？";
      }
      this.alarmObjectRemovalVisible = true;
    },
    handleSelectionChange(val) {
      this.UniqueId = val;
    },
    AlarmObjectRemovalSure() {
      let param = {
        Version: "2018-07-24",
        Module: "monitor",
        GroupId: this.$route.query.groupId
      };
      if (!Array.isArray(this.UniqueId)) {
        param["UniqueId.0"] = this.UniqueId;
      } else {
        for (let i in this.UniqueId) {
          param["UniqueId." + i] = this.UniqueId[i].UniqueId;
        }
      }

      this.axios.post(CM_ALARM_OBJECT_LIST_OUT, param).then(res => {
        if (res.Response.Error === undefined) {
          this.alarmObjectRemovalVisible = false;
          this.$message({
            message: "移除成功",
            type: "success",
            showClose: true,
            duration: 0
          });
          this.AlarmObjectList();
        } else {
          let ErrTips = {
            "AuthFailure.UnauthorizedOperation":
              "请求未授权。请参考 CAM 文档对鉴权的说明。",
            DryRunOperation:
              "DryRun 操作，代表请求将会是成功的，只是多传了 DryRun 参数。",
            FailedOperation: "操作失败。",
            "FailedOperation.AlertFilterRuleDeleteFailed": "删除过滤条件失败。",
            "FailedOperation.AlertPolicyCreateFailed": "创建告警策略失败。",
            "FailedOperation.AlertPolicyDeleteFailed": "告警策略删除失败。",
            "FailedOperation.AlertPolicyDescribeFailed": "告警策略查询失败。",
            "FailedOperation.AlertPolicyModifyFailed": "告警策略修改失败。",
            "FailedOperation.AlertTriggerRuleDeleteFailed":
              "删除触发条件失败。",
            "FailedOperation.DbQueryFailed": "数据库查询失败。",
            "FailedOperation.DbRecordCreateFailed": "创建数据库记录失败。",
            "FailedOperation.DbRecordDeleteFailed": "数据库记录删除失败。",
            "FailedOperation.DbRecordUpdateFailed": "数据库记录更新失败。",
            "FailedOperation.DbTransactionBeginFailed": "数据库事务开始失败。",
            "FailedOperation.DbTransactionCommitFailed": "数据库事务提交失败。",
            "FailedOperation.DimQueryRequestFailed": "请求维度查询服务失败。",
            "FailedOperation.DruidQueryFailed": "查询分析数据失败。",
            "FailedOperation.DuplicateName": "名字重复。",
            "FailedOperation.ServiceNotEnabled":
              "服务未启用，开通服务后方可使用。",
            InternalError: "内部错误。",
            "InternalError.ExeTimeout": "执行超时。",
            InvalidParameter: "参数错误。",
            "InvalidParameter.InvalidParameter": "参数错误。",
            "InvalidParameter.InvalidParameterParam": "参数错误。",
            InvalidParameterValue: "无效的参数值。",
            LimitExceeded: "超过配额限制。",
            "LimitExceeded.MetricQuotaExceeded":
              "指标数量达到配额限制，禁止含有未注册指标的请求。",
            MissingParameter: "缺少参数错误。",
            ResourceInUse: "资源被占用。",
            ResourceInsufficient: "资源不足。",
            ResourceNotFound: "资源不存在。",
            ResourceUnavailable: "资源不可用。",
            ResourcesSoldOut: "资源售罄。",
            UnauthorizedOperation: "未授权操作。",
            UnknownParameter: "未知参数错误。",
            UnsupportedOperation: "操作不支持。"
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
    // 全部解除
    AlarmObjectRemovalAllSure() {
      let param = {
        Version: "2018-07-24",
        Module: "monitor",
        GroupId: this.$route.query.groupId
      };
      this.axios.post(CM_ALARM_OBJECT_LIST_ALLOUT, param).then(res => {
        if (res.Response.Error === undefined) {
          this.alarmObjectRemovalAllVisible = false;
          this.$message({
            message: "移除成功",
            type: "success",
            showClose: true,
            duration: 0
          });
          this.AlarmObjectList();
        } else {
          let ErrTips = {
            "AuthFailure.UnauthorizedOperation":
              "请求未授权。请参考 CAM 文档对鉴权的说明。",
            DryRunOperation:
              "DryRun 操作，代表请求将会是成功的，只是多传了 DryRun 参数。",
            FailedOperation: "操作失败。",
            "FailedOperation.AlertFilterRuleDeleteFailed": "删除过滤条件失败。",
            "FailedOperation.AlertPolicyCreateFailed": "创建告警策略失败。",
            "FailedOperation.AlertPolicyDeleteFailed": "告警策略删除失败。",
            "FailedOperation.AlertPolicyDescribeFailed": "告警策略查询失败。",
            "FailedOperation.AlertPolicyModifyFailed": "告警策略修改失败。",
            "FailedOperation.AlertTriggerRuleDeleteFailed":
              "删除触发条件失败。",
            "FailedOperation.DbQueryFailed": "数据库查询失败。",
            "FailedOperation.DbRecordCreateFailed": "创建数据库记录失败。",
            "FailedOperation.DbRecordDeleteFailed": "数据库记录删除失败。",
            "FailedOperation.DbRecordUpdateFailed": "数据库记录更新失败。",
            "FailedOperation.DbTransactionBeginFailed": "数据库事务开始失败。",
            "FailedOperation.DbTransactionCommitFailed": "数据库事务提交失败。",
            "FailedOperation.DimQueryRequestFailed": "请求维度查询服务失败。",
            "FailedOperation.DruidQueryFailed": "查询分析数据失败。",
            "FailedOperation.DuplicateName": "名字重复。",
            "FailedOperation.ServiceNotEnabled":
              "服务未启用，开通服务后方可使用。",
            InternalError: "内部错误。",
            "InternalError.ExeTimeout": "执行超时。",
            InvalidParameter: "参数错误。",
            "InvalidParameter.InvalidParameter": "参数错误。",
            "InvalidParameter.InvalidParameterParam": "参数错误。",
            InvalidParameterValue: "无效的参数值。",
            LimitExceeded: "超过配额限制。",
            "LimitExceeded.MetricQuotaExceeded":
              "指标数量达到配额限制，禁止含有未注册指标的请求。",
            MissingParameter: "缺少参数错误。",
            ResourceInUse: "资源被占用。",
            ResourceInsufficient: "资源不足。",
            ResourceNotFound: "资源不存在。",
            ResourceUnavailable: "资源不可用。",
            ResourcesSoldOut: "资源售罄。",
            UnauthorizedOperation: "未授权操作。",
            UnknownParameter: "未知参数错误。",
            UnsupportedOperation: "操作不支持。"
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
    // 分页
    handleCurrentChange(val) {
      this.pageIndex = val - 1;
      this.ListInit();
      this.pageIndex += 1;
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.ListInit();
    },
    // 告警接收对象 解除
    Remove(row, index) {
      console.log(row);
      if (index == 1) {
        this.remove = row;
        this.relieveTitle = "确定解除与该$接收人的关联？";
      } else {
        this.relieveTitle = "已选择" + 1 + "个告警接收人，确定要解除关联？";
      }
      this.relieveDialogVisible = true;
    },
    Receive() {
      let param = {
        Version: "2018-07-24",
        Module: "monitor",
        GroupId: this.$route.query.groupId
      };
      this.axios.post(CM_ALARM_RECEIVE_OBJECT_RELIEVE, param).then(res => {
        if (res.Response.Error === undefined) {
          this.$message({
            message: "告警接收对象解除成功",
            type: "success",
            showClose: true,
            duration: 0
          });
        } else {
          let ErrTips = {
            "AuthFailure.UnauthorizedOperation":
              "请求未授权。请参考 CAM 文档对鉴权的说明。",
            DryRunOperation:
              "DryRun 操作，代表请求将会是成功的，只是多传了 DryRun 参数。",
            FailedOperation: "操作失败。",
            "FailedOperation.AlertFilterRuleDeleteFailed": "删除过滤条件失败。",
            "FailedOperation.AlertPolicyCreateFailed": "创建告警策略失败。",
            "FailedOperation.AlertPolicyDeleteFailed": "告警策略删除失败。",
            "FailedOperation.AlertPolicyDescribeFailed": "告警策略查询失败。",
            "FailedOperation.AlertPolicyModifyFailed": "告警策略修改失败。",
            "FailedOperation.AlertTriggerRuleDeleteFailed":
              "删除触发条件失败。",
            "FailedOperation.DbQueryFailed": "数据库查询失败。",
            "FailedOperation.DbRecordCreateFailed": "创建数据库记录失败。",
            "FailedOperation.DbRecordDeleteFailed": "数据库记录删除失败。",
            "FailedOperation.DbRecordUpdateFailed": "数据库记录更新失败。",
            "FailedOperation.DbTransactionBeginFailed": "数据库事务开始失败。",
            "FailedOperation.DbTransactionCommitFailed": "数据库事务提交失败。",
            "FailedOperation.DimQueryRequestFailed": "请求维度查询服务失败。",
            "FailedOperation.DruidQueryFailed": "查询分析数据失败。",
            "FailedOperation.DuplicateName": "名字重复。",
            "FailedOperation.ServiceNotEnabled":
              "服务未启用，开通服务后方可使用。",
            InternalError: "内部错误。",
            "InternalError.ExeTimeout": "执行超时。",
            InvalidParameter: "参数错误。",
            "InvalidParameter.InvalidParameter": "参数错误。",
            "InvalidParameter.InvalidParameterParam": "参数错误。",
            InvalidParameterValue: "无效的参数值。",
            LimitExceeded: "超过配额限制。",
            "LimitExceeded.MetricQuotaExceeded":
              "指标数量达到配额限制，禁止含有未注册指标的请求。",
            MissingParameter: "缺少参数错误。",
            ResourceInUse: "资源被占用。",
            ResourceInsufficient: "资源不足。",
            ResourceNotFound: "资源不存在。",
            ResourceUnavailable: "资源不可用。",
            ResourcesSoldOut: "资源售罄。",
            UnauthorizedOperation: "未授权操作。",
            UnknownParameter: "未知参数错误。",
            UnsupportedOperation: "操作不支持。"
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

    chufaTemplate() {
      //触发条件模板
      this.showChufa1 = true;
      this.showChufa2 = false;
    },
    config() {
      //配置触发条件
      this.showChufa1 = false;
      this.showChufa2 = true;
    },
    addZhibiao(val) {
      //添加触发条件的指标告警
      alert("你要添加此项触发条件的指标告警");
      if(val === 'deploy'){
        this.formWrite.index++;
        if(this.formWrite.index+1 === this.formWrite.arr.length){
          this.formWrite.index = 0
        }
this.formWrite.arr.push({
  typeVal: this.typeOpt[this.formWrite.index].value,
            censusVal: "60",
            calcTypeVal: "1",
            number: "0",
            unit: "",
            continuousCycleVal: "1",
            warningVal: "0"
})
      }else{

      }
    },
    delZhibiao() {
      //删除触发条件的指标告警
      alert("你要删除此项触发条件的指标告警");
    },
    addShijian() {
      //添加触发条件的事件告警
      alert("你要添加此项触发条件的事件告警");
    },
    delShijian() {
      //删除触发条件的事件告警
      alert("你要删除此项触发条件的事件告警");
    }
  },
  filters: {
    // 状态
    InstanceState(val) {
      if (val === "PENDING") {
        return "创建中";
      } else if (val === "LAUNCH_FAILED") {
        return "创建失败";
      } else if (val === "RUNNING") {
        return "运行中";
      } else if (val === "STOPPED") {
        return "关机";
      } else if (val === "STARTING") {
        return "关机中";
      } else if (val === "REBOOTING") {
        return "重启中";
      } else if (val === "SHUTDOWN") {
        return "停止待销毁";
      } else if (val === "TERMINATING") {
        return "销毁中";
      }
    },
    formatDate(value) {
      let date = new Date(value * 1000);
      let y = date.getFullYear();
      let MM = date.getMonth() + 1;
      MM = MM < 10 ? "0" + MM : MM;
      let d = date.getDate();
      d = d < 10 ? "0" + d : d;
      let h = date.getHours();
      h = h < 10 ? "0" + h : h;
      let m = date.getMinutes();
      m = m < 10 ? "0" + m : m;
      let s = date.getSeconds();
      s = s < 10 ? "0" + s : s;
      return y + "-" + MM + "-" + d + " " + h + ":" + m + ":" + s;
    },
    CalcType(value) {
      if (value == 1) {
        return ">";
      } else if (value == 2) {
        return ">=";
      } else if (value == 3) {
        return "<";
      } else if (value == 4) {
        return "<=";
      } else if (value == 5) {
        return "=";
      } else if (value == 6) {
        return "!=";
      } else if (value == 7) {
        return "日同比上涨";
      } else if (value == 8) {
        return "日同比下降";
      } else if (value == 9) {
        return "周同比上涨";
      } else if (value == 10) {
        return "周同比下降";
      } else if (value == 11) {
        return "周期环比上涨";
      } else if (value == 12) {
        return "周期环比下降";
      }
    },
    AlarmNotifyPeriod(val) {
      if ((val / 60 / 60) % 1 == 0) {
        if ((val / 60 / 60 / 24) % 1 == 0) {
          return val / 60 / 60 / 24 + "天";
        } else {
          return val / 60 / 60 + "小时";
        }
      } else if ((val / 60) % 1 == 0) {
        return val / 60 + "分钟";
      }
    },
    NotifyWay(val) {
      if (val === "EMAIL") {
        return "邮件";
      } else if (val === "SMS") {
        return "短信";
      } else if (val === "WECHAT") {
        return "微信";
      } else if (val === "CALL") {
        return "电话";
      }
    },
    ProjectName(val) {
      if (val == 0) {
        return "默认项目";
      }
      for (let i in project) {
        if (val == project[i].projectId) {
          return project[i].projectName;
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.defaultDetail >>> .el-button,
.defaultDetail >>> .el-input__inner {
  height: 30px;
  border-radius: 0;
  padding-top: 0;
  line-height: 30px;
  font-size: 12px;
}
.defaultDetail >>> .box-card {
  width: 98%;
  border-radius: 0;
  padding-top: 0;
  // line-height: 30px;
  font-size: 12px;
  margin: 20px;
}
.defaultDetail {
  width: 100%;
  height: 100%;
  background: rgb(235, 235, 235);
  ::v-deep .el-card {
    margin: 20px;
  }
}
.box-content {
  line-height: 30px;
}
span.textColor {
  color: #888;
  width: 100px;
}
a {
  margin: 0 5px;
}
a:hover {
  color: #006eff;
  cursor: pointer;
  border-bottom: 1px solid #006eff;
}
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  p.tip {
    padding: 15px 20px;
    color: #003b80;
    border: 1px solid #97c7ff;
    background: #e5f0ff;
  }
  ul {
    li {
      display: flex;
      line-height: 40px;
      & > p {
        margin: 0 30px;
        color: #000;
        & > i {
          color: #888;
          cursor: pointer;
        }
      }
    }
  }
}
.tke-dialog {
  ::v-deep .el-dialog__footer {
    text-align: center;
  }
  .edit-dialog {
    ::v-deep .el-input__inner {
      border-radius: 0px;
      width: 200px;
      height: 30px;
      padding: 0 10px;
    }
    p {
      color: #b43537;
      border: 1px solid #f6b5b5;
      background-color: #fcecec;
      width: 258px;
      box-sizing: border-box;
      padding: 10px 20px;
      margin-top: 10px;
    }
    ::v-deep .el-dialog__footer {
      text-align: center;
    }
  }
}
.callback-dialog-box {
  ::v-deep .el-dialog__body {
    padding-top: 0px;
  }
  .callback-interface-box {
    margin-top: 14px;
    ::v-deep .el-input__inner {
      border-radius: 0;
      height: 30px;
    }
    & > p {
      color: #888;
      font-size: 12px;
      line-height: 22px;
      margin-top: 10px;
    }
    .bg-box {
      margin-top: 10px;
      background-color: #fff4e3;
      color: #c07400;
      border: 1px solid #ffd18b;
      padding: 10px 20px;
      font-size: 12px;
      line-height: 28px;
      span {
        margin: 10px 0;
        font-size: 16px;
        font-weight: 700;
      }
    }
  }
}
.trigger-condition {
  display: flex;
  span {
    width: 68px;
    margin-top: 10px;
  }
  ::v-deep .el-input__inner {
    border-radius: 0px;
    height: 30px;
  }
}
.chufaContent,
.qudaoContent {
  width: 94%;
  > div {
    margin: 10px 0;
    padding: 10px 20px;
    background-color: #f2f2f2;
    line-height: 30px;
    .content {
      padding: 10px;
      p {
      }
    }
  }
}
.chufaContent {
  padding: 0;
}
.qudaoContent {
  background-color: #f2f2f2;
}
.qudao {
  display: flex;
  .objectContent {
    p {
      line-height: 30px;
    }
    .new-model {
      margin-left: 15px;
    }
  }
}
input {
  margin: 0;
}
> div {
  margin-top: 20px;
  span {
    display: inline-block;
    width: 80px;
  }
}

.table {
  margin-top: 20px;
}
.foot {
  // margin: 10px;
  padding-top: 20px;
  border-top: 1px solid #ccc;
}
.alarm-object {
  width: 100%;
  // ::v-deep .el-card__header {
  //   border: 0px;
  // }
  .clearfix {
    display: flex;
    align-items: center;
  }
  ::v-deep .el-card__body {
    padding-top: 0px;
  }
  .box-content {
    ::v-deep .el-button {
      border-radius: 0;
      height: 30px;
      padding: 0 20px;
    }
  }
}

.alarm-receiving-object {
  .clearfix {
    display: flex;
    align-items: center;
  }
}
.tke-page {
  padding: 20px;
  display: flex;
  flex-direction: row-reverse;
  background: #fff;
}
.green {
  color: #0abf5b;
}
.red {
  color: #b43537;
}
.out-color-text {
  color: #888;
}
.chufaContent {
  .ul-one {
    li {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      margin-top: 10px;
      & > div {
        display: flex;
        align-items: center;
        & > span {
          width: 40px;
          line-height: 30px;
          margin-top: 0px;
        }
      }
    }
    .input-style-dis-box {
      height: 30px;
      line-height: 30px;
      display: flex;
      align-items: center;
      .input-style-dis {
        height: 30px;
        line-height: 30px;
        padding-left: 10px;
        width: 85px;
      }
      .input-p {
        cursor: not-allowed;
        background: #f5f7fa;
        padding: 0 10px;
        display: inline-block;
        height: 30px;
        line-height: 30px;
        width: 52px;
        border: 1px solid #dcdfe6;
        margin-top: 0px;
      }
    }
  }
}
.content-pz {
  padding-top: 0 !important;
}
.chufaContent {
  .ul-two {
    li {
      & > div {
        width: 98%;
        flex-wrap: wrap;
      }
    }
  }
}
</style>

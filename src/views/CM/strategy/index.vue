<template>
  <div class="strategy-wrap">
    <Header title="告警策略">
      <div class="strategy-filter">
        <el-form
          :inline="true"
          :model="formInline"
          class="demo-form-inline"
          label-width="100px"
          size="mini"
          label-position="left"
        >
          <div>
            <el-form-item label="策略名称">
              <el-input v-model="formInline.strategy_name"></el-input>
            </el-form-item>
            
            <el-form-item>
              <div style="display: flex;">
                <el-select
                  filterable
                  v-model="formInline.product_name"
                  class="select-option"
                >
                  <el-option
                    v-for="(item, index) in formInline.product_kind"
                    :key="index"
                    :label="item.name"
                    :value="item.id"
                    label-width="40px"
                  ></el-option>
                </el-select>
                <el-select
                  filterable
                  v-model="formInline.productArr"
                  class="select-option-tow"
                  v-if="formInline.product_name === '1'"
                  multiple
                >
                  <el-option
                    v-for="(item, index) in productOptions"
                    :key="index"
                    :label="item.label"
                    :value="item.viewName"
                    label-width="40px"
                  ></el-option>
                </el-select>
                <el-select
                  filterable
                  v-model="productValue"
                  class="select-option-tow"
                  v-if="formInline.product_name === '2'"
                  @change="changeMonitor"
                >
                  <el-option
                    v-for="(item, index) in productOptions"
                    :key="index"
                    :label="item.label"
                    :value="item.viewName"
                    label-width="40px"
                  ></el-option>
                </el-select>
              </div>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="告警对象">
              <el-input :disabled="productValue!==''?false:true" @focus="isShowPopover = true" v-model="monitorNumber" style="width:300px" placeholder="请输入内容"></el-input>
              <el-popover
                placement="bottom"
                width="600"
                trigger="click"
                v-model="isShowPopover">

                <el-table :data="dataList" height="200" ref="multipleTable" @selection-change="handleSelectionSte"
                  class="table-left">
                  <el-table-column type="selection" width="55"></el-table-column>
                  <el-table-column :label="headConfig.title1" width="120">
                    <template slot-scope="scope">
                      <div v-if="productValue === 'cvm_device'">
                        <p>{{ scope.row.InstanceId }}</p>
                        <p>{{ scope.row.InstanceName }}</p>
                      </div>
                      <div v-if="productValue === 'VPN_GW'">
                        <p>{{scope.row.VpnGatewayId}}</p>
                        <p>{{scope.row.VpnGatewayName}}</p>
                      </div>
                      <div v-if="productValue === 'vpn_tunnel'">
                        <p>{{scope.row.VpnConnectionId}}</p>
                        <p>{{scope.row.VpnConnectionName}}</p>
                      </div>
                      <div v-if="productValue === 'nat_tc_stat'">
                        <p>{{scope.row.NatGatewayId}}</p>
                        <p>{{scope.row.NatGatewayName}}</p>
                      </div>
                      <div v-if="productValue === 'DC_GW'">
                        <p>{{scope.row.DirectConnectGatewayId}}</p>
                        <p>{{scope.row.DirectConnectGatewayName}}</p>
                      </div>
                      <div v-if="productValue === 'EIP'">
                        <p>{{scope.row.AddressId}}</p>
                      </div>
                      <div v-if="productValue === 'cdb_detail'">
                        <p>{{scope.row.InstanceId}}</p>
                        <p>{{scope.row.InstanceName}}</p>
                      </div>
                      <div v-if="productValue === 'REDIS-CLUSTER'">
                        <p>{{scope.row.InstanceName}}</p>
                        <p>{{scope.row.InstanceName}}</p>
                      </div>
                      <div v-if="productValue === 'dcchannel'">
                        <p>{{scope.row.DirectConnectTunnelId}}</p>
                        <p>{{scope.row.DirectConnectTunnelName}}</p>
                      </div>
                      <div v-if="productValue === 'dcline'">
                        <p>{{scope.row.DirectConnectId}}</p>
                        <p>{{scope.row.DirectConnectName}}</p>
                      </div>
                      <div v-if="productValue === 'COS'">
                        <p>{{scope.row.Name}}</p>
                      </div>
                      <div v-if="productValue === 'BS'">
                        <p>{{scope.row.DiskId}}</p>
                        <p>{{scope.row.DiskName}}</p>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column :label="headConfig.title2" width="120">
                    <template slot-scope="scope">
                      <div v-if="productValue == 'cvm_device'">
                        <p>VPC 网络</p>
                      </div>
                      <div v-if="productValue === 'VPN_GW'">
                        <p>{{vpcConnState[scope.row.State]}}</p>
                      </div>
                      <div v-if="productValue === 'vpn_tunnel'">
                        <p>{{scope.row.VpcId}}</p>
                      </div>
                      <div v-if="productValue === 'nat_tc_stat'">
                        <p>{{natStatu[scope.row.State]}}</p>
                      </div>
                      <div v-if="productValue === 'DC_GW'">
                        <p>不支持</p>
                      </div>
                      <div v-if="productValue === 'EIP'">
                        <p>{{scope.row.AddressId}}</p>
                      </div>
                      <div v-if="productValue === 'cdb_detail'">
                        <p>{{scope.row.Vip}}</p>
                        <p>{{scope.row.Vport}}</p>
                      </div>
                      <div v-if="productValue === 'REDIS-CLUSTER'">
                        <p>master-slave</p>
                      </div>
                      <div v-if="productValue === 'dcchannel'">
                        <p>{{scope.row.VpcId}}</p>
                      </div>
                      <div v-if="productValue === 'dcline'">
                        <p>{{scope.row.Location}}</p>
                      </div>
                      <div v-if="productValue === 'COS'">
                        <p>{{scope.row.zone.zone}}</p>
                      </div>
                      <div v-if="productValue === 'BS'">
                        <p>{{scope.row.DiskSize}}</p>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column :label="headConfig.title3" width="150">
                    <template slot-scope="scope">
                      <div v-if="productValue == 'cvm_device'">
                        <p>{{scope.row.PrivateIpAddresses[0]}}(内网)</p>
                        <p>{{scope.row.PublicIpAddresses[0]}}(外网)</p>
                      </div>
                      <div v-if="productValue === 'VPN_GW'">
                        <p>{{scope.row.VpcId}}</p>
                      </div>
                      <div v-if="productValue === 'vpn_tunnel'">
                        <p>{{scope.row.VpnGatewayId}}</p>
                      </div>
                      <div v-if="productValue === 'nat_tc_stat'">
                        <p>{{scope.row.VpcId}}</p>
                      </div>
                      <div v-if="productValue === 'DC_GW'">
                        <p>{{scope.row.VpcId}}</p>
                      </div>
                      <div v-if="productValue === 'EIP'">
                        <p>{{scope.row.AddressId}}</p>
                      </div>
                      
                      <div v-if="productValue === 'REDIS-CLUSTER'">
                        <p>{{scope.row.WanIp}}</p>
                      </div>
                      <div v-if="productValue === 'dcchannel'">

                      </div>
                      <div v-if="productValue === 'dcline'">
                        <p>{{scope.row.Bandwidth}}</p>
                      </div>
                      <div v-if="productValue === 'COS'">
                        <p>{{scope.row.CreationDate | CreateDate}}</p>
                      </div>
                      <div v-if="productValue === 'BS'">
                        <p>{{DiskType[scope.row.DiskType]}}</p>
                        <p>{{DiskUsage[scope.row.DiskUsage]}}</p>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column :label="headConfig.title4" v-if="productValue === 'nat_tc_stat'">
                    <template slot-scope="scope">
                      <div v-if="productValue === 'nat_tc_stat'">
                        <p>最大并发连接数{{scope.row.MaxConcurrentConnection}}</p>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
                <div  class="dialog-footer">
                  <el-button type="primary" @click="selectOk">确定</el-button>
                  <el-button @click="isShowPopover = false">取消</el-button>
                </div>
              </el-popover>
            </el-form-item>
            <el-form-item label="用户/组">
              <el-select v-model="formInline.user" class="select-option">
                <el-option
                  v-for="(item, index) in formInline.user_kind"
                  
                  :key="index"
                  :label="item.name"
                  :value="item.value"
                  label-width="40px"
                ></el-option>
              </el-select>
              <el-select
                multiple
                v-model="formInline.group"
                class="select-option-tow"
              >
                <el-option
                  v-for="(item, index) in formInline.kind_list"
                  :key="index"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">查询</el-button>
              <el-button type="text" class="clearBtn">清除筛选</el-button>
            </el-form-item>
          </div>
          
        </el-form>
      </div>
    </Header>
    <div class="overview-main">
      <!-- <div class="explain">
        <p>
          告警模板功能已上线，支持触发条件的复用与统一修改
          ，请前往
          <a>触发条件模板</a>进行配置
          <a>查看详情</a>
        </p>
        <p>
          现已支持对告警策略的告警启停，可在策略维度、实例维度进行告警策略屏蔽
          ，点击查看
          <a>告警启停文档</a>
        </p>
      </div> -->
    </div>
    <div class="table">
      <p class="addBtn">
        <el-row>
          <el-button type="primary" @click="addCreate">新增</el-button>
          <el-button v-if="multipleSelection.length > 0" @click="AllDelete"
            >删除</el-button
          >
          <el-button v-else disabled>删除</el-button>
          <el-button v-if="ModifyAlarm" @click="ModifyAlarmBtn()"
            >修改告警渠道</el-button
          >
          <el-button v-if="!ModifyAlarm" disabled>修改告警渠道</el-button>
        </el-row>
        <el-row class="iconBtn">
          <!-- <i class="el-icon-setting" @click="buyMessgae"></i> -->
          <i class="el-icon-refresh" @click="ListInit"></i>
          <i class="el-icon-download" @click="exportExcel"></i>
        </el-row>
      </p>
      <el-table
        :data="tableData"
        style="width: 100%"
        v-loading="loadShow"
        height="450"
        @selection-change="handleSelectionChange"
        id="exportTable"
      >
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column label="策略名称">
          <template slot-scope="scope">
            <a class="defaultDialog" @click="defaultClick(scope.row)">{{
              scope.row.GroupName
            }}</a>
            <i @click="NameModify(scope.row)" class="el-icon-edit"></i>
          </template>
        </el-table-column>
        <el-table-column label="触发条件">
          <template slot-scope="scope">
            <el-popover placement="left-start" width="400" trigger="hover">
              <div class="popover-box">
                <p class="text-color">指标告警（任意）：</p>
                <div
                  v-for="i in scope.row.Conditions"
                  class="trigger-condition"
                >
                  <p>
                    {{ i.MetricShowName }}
                    {{ i.CalcType | CalcType }} {{ i.CalcValue
                    }}{{ i.Unit }}，持续{{ i.ContinueTime / 60 }}分钟，按{{
                      i.AlarmNotifyPeriod | AlarmNotifyPeriod
                    }}{{ i.AlarmNotifyPeriod > 0 ? "重复告警" : "不重复告警" }}
                  </p>
                </div>
                <p class="text-color">事件告警：</p>
                <div
                  v-for="j in scope.row.EventConditions"
                  class="trigger-condition"
                >
                  <p>
                    {{ j.EventShowName }}，{{
                      j.AlarmNotifyPeriod > 0 ? "重复告警" : "不重复告警"
                    }}
                  </p>
                </div>
              </div>
              <div slot="reference">
                <div
                  v-for="(item, index) in scope.row.Conditions"
                  :key="index"
                  class="trigger-condition"
                >
                  <p>
                    {{ item.MetricShowName }}
                    {{ item.CalcType | CalcType }} {{ item.CalcValue
                    }}{{ item.Unit }}，持续{{
                      item.ContinueTime / 60
                    }}分钟，按{{ item.AlarmNotifyPeriod | AlarmNotifyPeriod
                    }}{{
                      item.AlarmNotifyPeriod > 0 ? "重复告警" : "不重复告警"
                    }}
                  </p>
                </div>
                <div
                  v-for="(items, indexs) in scope.row.EventConditions"
                  class="trigger-condition"
                >
                  <p>
                    {{ items.EventShowName }}，{{
                      items.AlarmNotifyPeriod > 0 ? "重复告警" : "不重复告警"
                    }}
                  </p>
                </div>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="所属项目">
          <template slot-scope="scope">
            {{ scope.row.ProjectId | ProjectName }}
          </template>
        </el-table-column>
        <el-table-column label="策略类型">
          <template slot-scope="scope">
            <el-popover placement="left-start" trigger="hover">
              <div>
                <p>
                  <span
                    >策略类型： <span v-if="scope.row.IsDefault == 1">默认</span
                    >{{ scope.row.Name }}</span
                  >
                </p>
                <p
                  v-if="
                    scope.row.IsDefault == 0 &&
                      scope.row.CanSetDefault === false
                  "
                  style="color:#888;"
                >
                  此告警策略绑定的对象是实力组，当前不支持设置为默认策略
                </p>
              </div>
              <div slot="reference">
                <div
                  :class="{ strong: scope.row.IsDefault == 1 }"
                  @mouseenter="enter(scope.$index)"
                  @mouseleave="leave()"
                >
                  <span v-if="scope.row.IsDefault == 1">默认</span
                  >{{ scope.row.Name }}
                  <p
                    v-show="edit && scope.$index == current"
                    v-if="scope.row.IsDefault != 1 && scope.row.CanSetDefault"
                  >
                    <a href="javascript:;" @click="SetDefault(scope.row)"
                      >设置默认</a
                    >
                  </p>
                </div>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="已启用/实例数">
          <template slot-scope="scope">
            <p>{{ scope.row.NoShieldedSum }} / {{ scope.row.UseSum }}</p>
            <p class="group-color" v-if="scope.row.InstanceGroup != undefined">
              组：{{ scope.row.InstanceGroup.GroupName }}
            </p>
          </template>
        </el-table-column>
        <el-table-column label="最后修改">
          <template slot-scope="scope">
            <p>{{ scope.row.LastEditUin }}</p>
            <p>{{ scope.row.UpdateTime | formatDate }}</p>
          </template>
        </el-table-column>
        <el-table-column label="告警渠道">
          <template slot-scope="scope">
            <div v-if="scope.row.ReceiverInfos != undefined">
              <div v-for="(i, x) in scope.row.ReceiverInfos" :key="x">
                <p>接收组：{{ i.ReceiverGroupList.length }}个</p>
                <!-- <p>有效期：</p> -->
                <p v-if="i.NotifyWay.length > 0">
                  渠道：<span v-for="(j, k) in i.NotifyWay" :key="k"
                    >{{ j | NotifyWay
                    }}<i v-if="i.NotifyWay.length - 1 > k">、</i></span
                  >
                </p>
                <p v-else>渠道：-</p>
              </div>
            </div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column label="告警启停">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.IsOpen"
              active-color="#006eff"
              inactive-color="#888"
              @change="AlarmStart(scope.row, scope.$index)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" class="cloneBtn">复制</el-button>
            <el-tooltip
              content="默认策略不支持删除，可解绑所有资源或设置新的默认策略后将此转为非默认策略"
              placement="left"
              effect="light"
              v-if="scope.row.IsDefault != 0"
            >
              <el-button type="text" class="deleteBtn-color deleteBtn"
                >删除</el-button
              >
            </el-tooltip>
            <el-tooltip
              content="解绑所有资源后支持删除"
              placement="left"
              effect="light"
              v-else-if="scope.row.UseSum != 0"
            >
              <el-button type="text" class="deleteBtn-color deleteBtn"
                >删除</el-button
              >
            </el-tooltip>
            <el-button
              type="text"
              class="deleteBtn"
              v-else
              @click="Delete(scope.row)"
              >删除</el-button
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
    <!-- 点击设置 -->
    <Dialog :dialogVisible="dialogVisible" @cancel="cancel" @save="save" />
    <!-- 修改名称 -->
    <el-dialog
      title="修改告警策略名称"
      :visible.sync="modifyNameDialogVisible"
      width="500px"
      custom-class="dialog-box"
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
        <el-button type="primary" @click="NameSure">确定</el-button>
        <el-button @click="modifyNameDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
    <!-- 删除 -->
    <el-dialog
      title="策略删除确认"
      :visible.sync="deleteDialogVisible"
      width="500px"
      custom-class="tke-dialog"
      class="dialog-box"
    >
      <div>您确定要删除此条告警策略吗？</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="DeleteSure()">确定</el-button>
        <el-button @click="deleteDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
    <!-- 删除策略 -->
    <el-dialog
      title="删除策略"
      :visible.sync="deleteAllDialogVisible"
      width="600px"
      custom-class="tke-dialog"
      class="dialog-box"
    >
      <div>
        <p>您已选择{{ multipleSelection.length }}条策略，详情如下:</p>
        <div class="delete-table">
          <el-table
            :data="multipleSelection"
            style="width: 100%"
            height="200px"
          >
            <el-table-column label="策略名">
              <template slot-scope="scope">
                {{ scope.row.GroupName }}
              </template>
            </el-table-column>
            <el-table-column label="备注">
              <template slot-scope="scope">
                <p
                  class="text-color-red"
                  v-if="scope.row.IsDefault != 0"
                  id="text-color-red"
                >
                  <span>默认策略,无法删除</span>
                  <el-tooltip
                    content="默认策略不支持删除，可解绑所有资源或设置新的默认策略后将此转为非默认策略"
                    placement="left"
                    effect="light"
                  >
                    <i class="el-icon-info ml5"></i>
                  </el-tooltip>
                </p>

                <p
                  class="text-color-red"
                  v-else-if="scope.row.UseSum != 0"
                  id="text-color-red"
                >
                  <span>已关联对象,无法删除</span>
                  <el-tooltip
                    content="解绑所有资源后支持删除"
                    placement="left"
                    effect="light"
                  >
                    <i class="el-icon-info ml5"></i>
                  </el-tooltip>
                </p>

                <p v-else class="text-color-grey">可删除</p>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-if="showIsAll">
          <p class="tips">确定删除所选可删除策略？</p>
          <p class="tips-grey">删除后,策略配置将彻底销毁</p>
        </div>
        <div v-if="showIsDefault">
          <p class="tips">无可删除策略</p>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" v-if="!showIsDefault" @click="DeleteSure"
          >确定</el-button
        >
        <el-button disabled v-if="showIsDefault">确定</el-button>
        <el-button @click="deleteAllDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
    <!-- 修改告警渠道 -->
    <el-dialog
      title="修改告警渠道"
      :visible.sync="ModifyDialogVisible"
      width="600px"
      custom-class="tke-dialog"
      class="dialog-box"
    >
      <div>
        <p>
          <el-tooltip
            effect="light"
            content="告警渠道为空的策略不支持修改"
            placement="top"
          >
            <i class="el-icon-info"></i>
          </el-tooltip>
          您已选择{{ multipleSelection.length }}条策略，其中{{
            arr.length
          }}条支持修改。接收渠道统计如下:
        </p>
        <div class="modify-box">
          <div>
            <p>
              <span>邮件</span>
              <span>已开通数:{{ emailOpen }},未开通数:{{ emailClose }}</span>
            </p>
            <el-select v-model="emailVal" placeholder="请选择">
              <el-option
                v-for="item in emailOpt"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
          <div>
            <p>
              <span>短信</span>
              <span>已开通数:{{ SMSOpen }},未开通数:{{ SMSClose }}</span>
            </p>
            <el-select v-model="SMSVal" placeholder="请选择">
              <el-option
                v-for="item in SMSOpt"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
          <div>
            <p>
              <span>微信</span>
              <span>已开通数:{{ wechatOpen }},未开通数:{{ wechatClose }}</span>
            </p>
            <el-select v-model="wechatVal" placeholder="请选择">
              <el-option
                v-for="item in wechatOpt"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
          <div>
            <p>
              <span>电话</span>
              <span>已开通数:{{ callOpen }},未开通数:{{ callClose }}</span>
            </p>
            <el-select v-model="callVal" placeholder="请选择">
              <el-option
                v-for="item in callOpt"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="ModifyNotifySure">确定</el-button>
        <el-button @click="ModifyDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
    <!-- 告警启停 -->
    <el-dialog
      title="告警操作确认"
      :visible.sync="startStop"
      width="500px"
      custom-class="tke-dialog"
      :before-close="CelStart"
    >
      <div>
        <p>确定停用告警策略【{{ GroupName }}】</p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="SureStart()">确定</el-button>
        <el-button @click="CelStart()">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Header from "./components/Head";
import Dialog from "./components/dialog";
import FileSaver from "file-saver";
import ProductTypeCpt from "@/views/CM/CM_assembly/product_type_str";
import XLSX from "xlsx";
import { ErrorTips } from "@/components/ErrorTips";
import {
  CM_ALARM_LIST,
  ALL_PROJECT,
  CM_GROUPING_LIST_TYPE,
  CM_GROUPING_ALARM_START,
  CM_ALARM_DELETE,
  CM_ALARM_SET_DEFAULT,
  CM_GROUPING_LIST_EDIT,
  CM_ALARM_MODIFY_NOTIFY,
  CVM_LIST, //云服务器列表
  NAT_LIST, //NAT网关列表
  VPN_LIST, //VPN网关列表
  VPNTD_LIST, //VPN通道列表
  DCG_LIST, //专线网关列表
  MYSQL_LIST, //MYSQL列表
  REDIS_LIST, //REDIS列表
  Physics_LIST, //物理专线列表
  Private_LIST, //专线通道列表
  OBJ_LIST, //对象存储列表
  DISK_LIST, //云硬盘列表
} from "@/constants";
var project = [];
export default {
  name: "strategy",
  data() {
    return {
      checkAllProduct: false,
      checkedCities: [],
      cities: [
        {
          value: 0,
          name: "产品类型"
        },
        {
          value: 1,
          name: "策略类型"
        }
      ],
      //产品
      productOptions: [{
          label: '云服务器',
          viewName: 'cvm_device',
        }, {
          label: '云硬盘',
          viewName: 'BS',
        },
        {
          label: 'VPN网关',
          viewName: 'VPN_GW',
        }, {
          label: 'VPN通道',
          viewName: 'vpn_tunnel',
        }, {
          label: 'NAT网关',
          viewName: 'nat_tc_stat',
        }, {
          label: '专线网关',
          viewName: 'DC_GW',
        }, {
          label: 'MYSQL',
          viewName: 'cdb_detail',
        }, {
          label: 'Redis',
          viewName: 'REDIS-CLUSTER',
        }, {
          label: '专用通道',
          viewName: 'dcchannel',
        }, {
          label: '物理专线',
          viewName: 'dcline',
        }, {
          label: '对象存储',
          viewName: 'COS',
        }
      ],
      isIndeterminate: true,
      formInline: {
        product_name: '1', //策略
        productArr: [],//产品类型列表
        product_kind: [
          {
            id: "1",
            name: "产品类型"
          },
          {
            id: "2",
            name: "策略类型"
          }
        ], //产品/.策略类型
        strategy_kind: [
          {
            value: 0,
            name: "请选择"
          }
        ], //用户/组
        strategy_name: "", //策略名称
        alarm: "", //告警对象
        alarm_list: [
          {
            name: "告警对象1"
          }
        ], //告警对象数组
        user: "用户组", //用户
        group: "", //组
        user_kind: [
          {
            value: "0",
            name: "用户组"
          },
          {
            vale: "1",
            name: "用户名"
          }
        ], //用户类型数据
        kind_list: [
          {
            value: "0",
            name: "全选"
          },
          {
            value: "1",
            name: "误删"
          },
          {
            value: "2",
            name: "测试误删"
          }
        ], //用户名类型数据
        product_value: "", //产品
        strategy_value: "" //策略
      },
      tableData: [], //表格数据
      loadShow: true,
      edit: false,
      current: "", // 编辑
      //分页
      total: 0, //总条数
      pageSize: 10, // 分页条数
      pageIndex: 0, // 当前页码
      operationFlag: -1, //按钮禁用开关
      dataListLoading: false,
      dialogVisible: false, //设置弹出框
      defaultIconFlag: false, //鼠标事件
      deleteDialogVisible: false,
      deleteAllDialogVisible: false,
      deleteTableData: [],
      ModifyAlarm: false,
      ModifyDialogVisible: false,
      modifyNameDialogVisible: false,
      editSearchVal: "",
      tipsShow: false,
      project,
      GroupId: "",
      GroupName: "",
      startStop: false,
      IsOpen: false,
      inputVal: "",
      indexs: "",
      multipleSelection: [],
      arr: [],
      arrOpen: [],
      arrClose: [],
      showIsDefault: false,
      showIsAll: true,
      // 邮件
      emailVal: "1",
      emailOpt: [
        {
          value: "1",
          label: "-(保持不变)"
        }
      ],
      emailOpen: 0,
      emailClose: 0,
      // 短信
      SMSVal: "1",
      SMSOpt: [
        {
          value: "1",
          label: "-(保持不变)"
        }
      ],
      SMSOpen: 0,
      SMSClose: 0,
      // 微信
      wechatVal: "1",
      wechatOpt: [
        {
          value: "1",
          label: "-(保持不变)"
        }
      ],
      wechatOpen: 0,
      wechatClose: 0,
      // 电话
      callVal: "1",
      callOpt: [
        {
          value: "1",
          label: "-(保持不变)"
        }
      ],
      callOpen: 0,
      callClose: 0,
      searchParam: {},
      projectId: 0,
      productValue: '',
      loading: true,
      dataList:[],//查询告警对象列表
      selectStrategyList: [],//选中的告警对象列表
      headConfig: {
        title1: '',
        title2: '',
        title3: '',
        title4: ''
      },
      monitorNumber: '',
      DiskType: {
        CLOUD_BASIC: "普通雲硬碟",
        CLOUD_PREMIUM: "高性能雲硬碟",
        CLOUD_SSD: "SSD雲硬碟"
      },
      vpcConnState: {
        PENDING: "生產中",
        AVAILABLE: "運行中",
        DELETING: "刪除中"
      },
      natStatu: {
        PENDING: "生產中",
        DELETING: "刪除中",
        AVAILABLE: "運行中",
        UPDATING: "升級中",
        FAILED: "失敗"
      },
      DiskUsage: {
        SYSTEM_DISK: "系統盤",
        DATA_DISK: "數據盤"
      },
      isShowPopover: false,
    };
  },
  components: {
    Header,
    Dialog,
    ProductTypeCpt
  },
  mounted() {
    this.ListInit();
    this.Project();
  },
  methods: {
    passData(data) {
      console.log("data",data);
      this.isShow = false;
      this.productListData = data;
      this.productValue = data.productValue;
      setTimeout(() => {
        this.productListData = {};
        // this.isShow = true;
      }, 500);
      setTimeout(() => {
        this.productListData = data;
        // this.isShow = true;
      }, 600);
    },
    Type_loading(val) {
      this.loading = val
    },
    async ListInit() {
      this.loadShow = true;
      let params = {
        Version: "2018-07-24",
        Region: "ap-taipei",
        Module: "monitor",
        Limit: this.pageSize,
        Offset: this.pageIndex
      };
      if(this.formInline.strategy_name !== '') {
        params.Like = this.formInline.strategy_name;
      }
      if(this.formInline.productArr.length > 0) {
        for(let i = 0; i < this.formInline.productArr.length; i++) {
          params['ViewNames.' + i] = this.formInline.productArr[i];
        }
      }
      if(this.formInline.product_name === '2') {
        params['ViewNames.0'] = this.productValue;
      }
      if(this.selectStrategyList.length > 0) {
        if (this.productValue === 'cvm_device') {
          let strategyArr = [];
          for(let i = 0; i < this.selectStrategyList.length; i++) {
            let strategys = [];
            let strategy = this.selectStrategyList[i];
            strategys.push(JSON.stringify({name:"unInstanceId", value:strategy.InstanceId}));
            strategyArr.push(strategys);
          }
          params.Dimensions = strategyArr;
        } else if (this.productValue === 'nat_tc_stat') {
          let strategyArr = [];
          for(let i = 0; i < this.selectStrategyList.length; i++) {
            let strategys = [];
            let strategy = this.selectStrategyList[i];
            strategys.push(JSON.stringify({name:"uniq_nat_id", value:strategy.NatGatewayId}));
            strategyArr.push(strategys);
          }
          params.Dimensions = strategyArr;
        } else if (this.productValue === 'VPN_GW') {
          let strategyArr = [];
          for(let i = 0; i < this.selectStrategyList.length; i++) {
            let strategys = [];
            let strategy = this.selectStrategyList[i];
            strategys.push(JSON.stringify({name:"appid", value:strategy.DiskId}));//怎么取值
            strategys.push(JSON.stringify({name:"vip", value:strategy.PublicIpAddress}));
            strategyArr.push(strategys);
          }
          params.Dimensions = strategyArr;
        } else if (this.productValue === 'vpn_tunnel') {
          let strategyArr = [];
          for(let i = 0; i < this.selectStrategyList.length; i++) {
            let strategys = [];
            let strategy = this.selectStrategyList[i];
            strategys.push(JSON.stringify({name:"uniqVpnconnId", value:strategy.VpnConnectionId}));
            strategyArr.push(strategys);
          }
          params.Dimensions = strategyArr;
        } else if (this.productValue === 'DC_GW') {
         let strategyArr = [];
          for(let i = 0; i < this.selectStrategyList.length; i++) {
            let strategys = [];
            let strategy = this.selectStrategyList[i];
            strategys.push(JSON.stringify({name:"directconnectgatewayid", value:strategy.DirectConnectGatewayId}));
            strategyArr.push(strategys);
          }
          params.Dimensions = strategyArr;
        } else if (this.productValue === 'cdb_detail') {
          let strategyArr = [];
          for(let i = 0; i < this.selectStrategyList.length; i++) {
            let strategys = [];
            let strategy = this.selectStrategyList[i];
            strategys.push(JSON.stringify({name:"uInstanceId", value:strategy.InstanceId}));
            strategyArr.push(strategys);
          }
          params.Dimensions = strategyArr;
        } else if (this.productValue === 'REDIS-CLUSTER') {
          let strategyArr = [];
          for(let i = 0; i < this.selectStrategyList.length; i++) {
            let strategys = [];
            let strategy = this.selectStrategyList[i];
            strategys.push(JSON.stringify({name:"appid", value:strategy.DiskId}));//怎么取值
            strategys.push(JSON.stringify({name:"instanceid", value:strategy.InstanceName}));
            strategyArr.push(strategys);
          }
          params.Dimensions = strategyArr;
        } else if (this.productValue === 'dcline') {
          let strategyArr = [];
          for(let i = 0; i < this.selectStrategyList.length; i++) {
            let strategys = [];
            let strategy = this.selectStrategyList[i];
            strategys.push(JSON.stringify({name:"directconnectid", value:strategy.DirectConnectId}));
            strategyArr.push(strategys);
          }
          params.Dimensions = strategyArr;
        } else if (this.productValue === 'dcchannel') {
          let strategyArr = [];
          for(let i = 0; i < this.selectStrategyList.length; i++) {
            let strategys = [];
            let strategy = this.selectStrategyList[i];
            strategys.push(JSON.stringify({name:"directconnecttunnelid", value:strategy.DirectConnectTunnelId}));
            strategyArr.push(strategys);
          }
          params.Dimensions = strategyArr;
        } else if (this.productValue === 'COS') {
          let strategyArr = [];
          for(let i = 0; i < this.selectStrategyList.length; i++) {
            let strategys = [];
            let strategy = this.selectStrategyList[i];
            strategys.push(JSON.stringify({name:"bucket", value:strategy.Name}));
            strategys.push(JSON.stringify({name:"appid", value:strategy.Name}));//如何取值
            strategyArr.push(strategys);
          }
          params.Dimensions = strategyArr;
        } else if (this.productValue === 'BS') {
          let strategyArr = [];
          for(let i = 0; i < this.selectStrategyList.length; i++) {
            let strategys = [];
            let strategy = this.selectStrategyList[i];
            strategys.push(JSON.stringify({name:"diskid", value:strategy.DiskId}));
            strategyArr.push(strategys);
          }
          params.Dimensions = strategyArr;
        }
      }
      await this.axios.post(CM_ALARM_LIST, params).then(res => {
        if (res.Response.Error === undefined) {
          var _tableData = res.Response.GroupList;
          this.total = res.Response.Total;
          let param = {
            Version: "2018-07-24",
            Module: "monitor"
          };
          this.axios.post(CM_GROUPING_LIST_TYPE, param).then(res => {
            if (res.Response.Error === undefined) {
              let Conditions = res.Response.Conditions;
              for (let i in _tableData) {
                for (let j in Conditions) {
                  if (_tableData[i].ViewName === Conditions[j].PolicyViewName) {
                    _tableData[i]["Name"] = Conditions[j].Name;
                  }
                }
              }
              this.tableData = _tableData;
              console.log("tableData", this.tableData);
              this.loadShow = false;
            } else {
              this.loadShow = false;
              let ErrTips = {
                "AuthFailure.UnauthorizedOperation":
                  "请求未授权。请参考 CAM 文档对鉴权的说明。",
                DryRunOperation:
                  "DryRun 操作，代表请求将会是成功的，只是多传了 DryRun 参数。",
                FailedOperation: "操作失败。",
                "FailedOperation.AlertFilterRuleDeleteFailed":
                  "删除过滤条件失败。",
                "FailedOperation.AlertPolicyCreateFailed": "创建告警策略失败。",
                "FailedOperation.AlertPolicyDeleteFailed": "告警策略删除失败。",
                "FailedOperation.AlertPolicyDescribeFailed":
                  "告警策略查询失败。",
                "FailedOperation.AlertPolicyModifyFailed": "告警策略修改失败。",
                "FailedOperation.AlertTriggerRuleDeleteFailed":
                  "删除触发条件失败。",
                "FailedOperation.DbQueryFailed": "数据库查询失败。",
                "FailedOperation.DbRecordCreateFailed": "创建数据库记录失败。",
                "FailedOperation.DbRecordDeleteFailed": "数据库记录删除失败。",
                "FailedOperation.DbRecordUpdateFailed": "数据库记录更新失败。",
                "FailedOperation.DbTransactionBeginFailed":
                  "数据库事务开始失败。",
                "FailedOperation.DbTransactionCommitFailed":
                  "数据库事务提交失败。",
                "FailedOperation.DimQueryRequestFailed":
                  "请求维度查询服务失败。",
                "FailedOperation.DruidQueryFailed": "查询分析数据失败。",
                "FailedOperation.DuplicateName": "名字重复。",
                "FailedOperation.ServiceNotEnabled":
                  "服务未启用，开通服务后方可使用。",
                InternalError: "内部错误。",
                "InternalError.ExeTimeout": "	执行超时。",
                InvalidParameter: "	参数错误。",
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
            UnauthorizedOperation: "未授权操作。UnknownParameter	未知参数错误。",
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
    // 告警启停
    AlarmStart(row, index) {
      console.log(row);
      this.startStop = true;
      this.GroupId = row.GroupId;
      this.GroupName = row.GroupName;
      this.IsOpen = !row.IsOpen;
      this.indexs = index;
    },
    SureStart() {
      let param = {
        Version: "2018-07-24",
        Module: "monitor",
        GroupId: this.GroupId
      };
      if (this.IsOpen === false) {
        param["IsShielded"] = 0;
      } else {
        param["IsShielded"] = 1;
      }
      this.axios.post(CM_GROUPING_ALARM_START, param).then(res => {
        if (res.Response.Error === undefined) {
          this.startStop = false;
          this.ListInit();
        } else {
          let ErrTips = {
            "AuthFailure.UnauthorizedOperation":
              "请求未授权。请参考 CAM 文档对鉴权的说明。",
            FailedOperation: "操作失败。",
            InternalError: "内部错误。",
            InvalidParameter: "参数错误。",
            "InvalidParameter.InvalidParameter": "参数错误。",
            "InvalidParameter.InvalidParameterParam": "参数错误。",
            InvalidParameterValue: "无效的参数值。",
            LimitExceeded: "超过配额限制。",
            MissingParameter: "缺少参数错误。"
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
    CelStart() {
      this.startStop = false;
      this.tableData[this.indexs].IsOpen = !this.tableData[this.indexs].IsOpen;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.arr = [];
      console.log(this.multipleSelection);
      for (let i in this.multipleSelection) {
        if (this.multipleSelection[i].IsDefault == 0) {
          this.arr.push(this.multipleSelection[i]);
        }
      }
      if (this.arr.length > 0) {
        this.ModifyAlarm = true;
      } else {
        this.ModifyAlarm = false;
      }
      if (this.multipleSelection.length === 0) {
        this.ModifyAlarm = false;
      }
    },
    handleSelectionSte(val) {
      this.selectStrategyList = val;
    },
    onSubmit() {
      this.ListInit();
    },
    loadMore() {
      if (this.loadSign) {
        this.loadSign = false;
        // this.pageIndex++;
      }
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
    //设置弹框
    buyMessgae() {
      // alert("11")
      this.dialogVisible = true;
    },
    //取消设置弹框
    cancel() {
      this.dialogVisible = false;
    },
    //确定设置弹框
    save() {
      this.dialogVisible = false;
    },
    defaultClick(row) {
      console.log(row);
      this.$router.push({
        name: "strategyCreateDetail",
        query: {
          groupId: row.GroupId,
          viewName: row.ViewName
        }
      });
    },
    //思路：便利你所有的数据，给每条都加上defaultIconFlag：false属性，当你划过的时候就可以改成true
    mouseoverDefault() {
      //鼠标划入事件
      this.defaultIconFlag = true;
    },
    mouseoutDefault() {
      //鼠标移除事件
      this.defaultIconFlag = false;
    },
    addCreate() {
      // alert('/strategy/create');
      this.$router.push({ path: "/strategy/create" });
    },
    // 修改名称
    NameModify(row) {
      this.modifyNameDialogVisible = true;
      this.GroupId = row.GroupId;
      this.GroupName = row.GroupName;
    },
    NameSure() {
      let param = {
        Version: "2018-07-24",
        Module: "monitor",
        GroupId: this.GroupId,
        GroupType: 1,
        Key: "groupName",
        Value: this.GroupName
      };
      this.axios.post(CM_GROUPING_LIST_EDIT, param).then(res => {
        if (res.Response.Error === undefined) {
          this.modifyNameDialogVisible = false;
          this.ListInit();
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
    // 删除
    Delete(row) {
      this.deleteDialogVisible = true;
      this.GroupId = row.GroupId;
      this.multipleSelection = row;
    },
    // 全部删除
    AllDelete() {
      this.deleteAllDialogVisible = true;
      this.$nextTick(() => {
        let dom = document.getElementsByClassName("text-color-red");
        if (dom.length === this.multipleSelection.length) {
          this.showIsDefault = true;
          this.showIsAll = false;
        }
        if (dom.length < this.multipleSelection.length) {
          this.showIsDefault = false;
          this.showIsAll = true;
        }
      });
    },
    DeleteSure() {
      let param = {
        Version: "2018-07-24",
        Module: "monitor",
        Region: "ap-taipei"
      };
      if (!Array.isArray(this.multipleSelection)) {
        param["GroupId.0"] = this.GroupId;
      } else {
        for (let i in this.multipleSelection) {
          param["GroupId." + i] = this.multipleSelection[i].GroupId;
        }
      }
      this.axios.post(CM_ALARM_DELETE, param).then(res => {
        if (res.Response.Error === undefined) {
          this.deleteDialogVisible = false;
          this.deleteAllDialogVisible = false;
          this.ListInit();
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
            "FailedOperation.DbQueryFailed": "	数据库查询失败。",
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
    // 策略类型
    enter(index) {
      this.edit = true;
      this.current = index;
    },
    leave() {
      this.edit = false;
      this.current = null;
    },
    // 设置默认
    SetDefault(row) {
      let param = {
        GroupId: row.GroupId,
        Version: "2018-07-24",
        Module: "monitor"
      };
      this.axios.post(CM_ALARM_SET_DEFAULT, param).then(res => {
        if (res.Response.Error === undefined) {
          console.log(res);
          this.ListInit();
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
    // 修改名称
    EditTips() {
      if (this.GroupName == "") {
        this.tipsShow = true;
      } else {
        this.tipsShow = false;
      }
    },
    // 修改告警渠道
    ModifyAlarmBtn() {
      this.ModifyDialogVisible = true;
      // console.log(this.arr[0].ReceiverInfos[0].NotifyWay);
      // for (let i = 0; i < this.arr.length; i++) {
      //   if (this.arr[i]) {
      //   }
      // }
      // 邮件
      this.emailOpt = [
        {
          value: "1",
          label: "-(保持不变)"
        }
      ];
      this.emailOpen = 0;
      this.emailClose = 0;
      this.emailVal = "1";
      // 短信
      this.SMSOpt = [
        {
          value: "1",
          label: "-(保持不变)"
        }
      ];
      this.SMSOpen = 0;
      this.SMSClose = 0;
      this.SMSVal = "1";
      // 微信
      this.wechatOpt = [
        {
          value: "1",
          label: "-(保持不变)"
        }
      ];
      this.wechatOpen = 0;
      this.wechatClose = 0;
      this.wechatVal = "1";
      // 电话
      this.callOpt = [
        {
          value: "1",
          label: "-(保持不变)"
        }
      ];
      this.callOpen = 0;
      this.callClose = 0;
      this.callVal = "1";
      for (let i in this.arr) {
        if (this.arr[i].ReceiverInfos[0].NotifyWay.length > 0) {
          for (let k in this.arr[i].ReceiverInfos[0].NotifyWay) {
            console.log(this.arr[i].ReceiverInfos[0].NotifyWay);
            // if(this.arr[i].ReceiverInfos[0].NotifyWay.toString())
            if (this.arr[i].ReceiverInfos[0].NotifyWay[k] === "EMAIL") {
              this.emailOpen++;
            }
            if (this.arr[i].ReceiverInfos[0].NotifyWay[k] === "SMS") {
              this.SMSOpen++;
            }
            if (this.arr[i].ReceiverInfos[0].NotifyWay[k] === "WECHAT") {
              this.wechatOpen++;
            }
            if (this.arr[i].ReceiverInfos[0].NotifyWay[k] === "CALL") {
              this.callOpen++;
            }
          }
        } else {
          this.emailClose = this.arr.length - this.emailOpen;
          this.SMSClose = this.arr.length - this.SMSOpen;
          this.wechatClose = this.arr.length - this.wechatOpen;
          this.callClose = this.arr.length - this.callOpen;
        }
      }
      this.emailClose = this.arr.length - this.emailOpen;
      this.SMSClose = this.arr.length - this.SMSOpen;
      this.wechatClose = this.arr.length - this.wechatOpen;
      this.callClose = this.arr.length - this.callOpen;
      if (this.emailOpen > 0) {
        this.emailOpt.push({
          value: "2",
          label: "关闭已开通的" + this.emailOpen + "条策略"
        });
      }
      if (this.emailClose > 0) {
        this.emailOpt.unshift({
          value: "0",
          label: "开启未开通的" + this.emailClose + "条策略"
        });
      }

      if (this.SMSOpen > 0) {
        this.SMSOpt.push({
          value: "2",
          label: "关闭已开通的" + this.SMSOpen + "条策略"
        });
      }
      if (this.SMSClose > 0) {
        this.SMSOpt.unshift({
          value: "0",
          label: "开启未开通的" + this.SMSClose + "条策略"
        });
      }

      if (this.wechatOpen > 0) {
        this.wechatOpt.push({
          value: "2",
          label: "关闭已开通的" + this.wechatOpen + "条策略"
        });
      }
      if (this.wechatClose > 0) {
        this.wechatOpt.unshift({
          value: "0",
          label: "开启未开通的" + this.wechatClose + "条策略"
        });
      }

      if (this.callOpen > 0) {
        this.callOpt.push({
          value: "2",
          label: "关闭已开通的" + this.callOpen + "条策略"
        });
      }
      if (this.callClose > 0) {
        this.callOpt.unshift({
          value: "0",
          label: "开启未开通的" + this.callClose + "条策略"
        });
      }
    },
    ModifyNotifySure() {
      let param = {
        Version: "2018-07-24",
        Module: "monitor"
      };
      for (let i in this.arr) {
        param["GroupNotifyInfos." + i + ".GroupId"] = this.arr[i].GroupId;

        if (this.emailVal == 0) {
          param["GroupNotifyInfos." + i + ".NotifyWay.0"] = "EMAIL";
        } else if (this.emailVal == 1) {
          if (!this.arr[i].ReceiverInfos[0].NotifyWay.indexOf("EMAIL")) {
            param["GroupNotifyInfos." + i + ".NotifyWay.0"] = "EMAIL";
          } else {
            param["GroupNotifyInfos." + i + ".NotifyWay.0"] = "";
          }
        } else if (this.emailVal == 2) {
          param["GroupNotifyInfos." + i + ".NotifyWay.0"] = "";
        }
        if (this.SMSVal == 0) {
          param["GroupNotifyInfos." + i + ".NotifyWay.1"] = "SMS";
        } else if (this.SMSVal == 1) {
          if (!this.arr[i].ReceiverInfos[0].NotifyWay.indexOf("SMS")) {
            param["GroupNotifyInfos." + i + ".NotifyWay.1"] = "SMS";
          } else {
            param["GroupNotifyInfos." + i + ".NotifyWay.1"] = "";
          }
        } else if (this.SMSVal == 2) {
          param["GroupNotifyInfos." + i + ".NotifyWay.1"] = "";
        }
        if (this.wechatVal == 0) {
          param["GroupNotifyInfos." + i + ".NotifyWay.2"] = "WECHAT";
        } else if (this.wechatVal == 1) {
          if (!this.arr[i].ReceiverInfos[0].NotifyWay.indexOf("WECHAT")) {
            param["GroupNotifyInfos." + i + ".NotifyWay.2"] = "WECHAT";
          } else {
            param["GroupNotifyInfos." + i + ".NotifyWay.2"] = "";
          }
        } else if (this.wechatVal == 2) {
          param["GroupNotifyInfos." + i + ".NotifyWay.2"] = "";
        }
        if (this.callVal == 0) {
          param["GroupNotifyInfos." + i + ".NotifyWay.3"] = "CALL";
        } else if (this.callVal == 1) {
          if (!this.arr[i].ReceiverInfos[0].NotifyWay.indexOf("CALL")) {
            param["GroupNotifyInfos." + i + ".NotifyWay.3"] = "CALL";
          } else {
            param["GroupNotifyInfos." + i + ".NotifyWay.3"] = "";
          }
        } else if (this.callVal == 2) {
          param["GroupNotifyInfos." + i + ".NotifyWay.3"] = "";
        }

        for (let j in this.arr[i].ReceiverInfos[0].NotifyWay) {
          if (this.emailVal == 1) {
            if (this.arr[i].ReceiverInfos[0].NotifyWay[j] === "EMAIL") {
              param["GroupNotifyInfos." + i + ".NotifyWay.0"] = this.arr[
                i
              ].ReceiverInfos[0].NotifyWay[j];
            }
          }
          if (this.SMSVal == 1) {
            if (this.arr[i].ReceiverInfos[0].NotifyWay[j] === "SMS") {
              param["GroupNotifyInfos." + i + ".NotifyWay.1"] = this.arr[
                i
              ].ReceiverInfos[0].NotifyWay[j];
            }
          }
          if (this.wechatVal == 1) {
            if (this.arr[i].ReceiverInfos[0].NotifyWay[j] === "WECHAT") {
              param["GroupNotifyInfos." + i + ".NotifyWay.2"] = this.arr[
                i
              ].ReceiverInfos[0].NotifyWay[j];
            }
          }
          if (this.callVal == 1) {
            if (this.arr[i].ReceiverInfos[0].NotifyWay[j] === "CALL") {
              param["GroupNotifyInfos." + i + ".NotifyWay.3"] = this.arr[
                i
              ].ReceiverInfos[0].NotifyWay[j];
            }
          }
        }
      }
      console.log(param);
      this.axios.post(CM_ALARM_MODIFY_NOTIFY, param).then(res => {
        if (res.Response.Error === undefined) {
          this.ModifyDialogVisible = false;
          this.ListInit();
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
    // 导出表格
    exportExcel() {
      console.log("exportExcel...");
      /* generate workbook object from table */
      var wb = XLSX.utils.table_to_book(document.querySelector("#exportTable"));
      /* get binary string as output */
      var wbout = XLSX.write(wb, {
        bookType: "xlsx",
        bookSST: true,
        type: "array"
      });
      try {
        FileSaver.saveAs(
          new Blob([wbout], {
            type: "application/octet-stream"
          }),
          "download(policy).xlsx"
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
    },
    // _PassValue() {
    //   this.productValue = this.productValue1
    //   this.Date = this.Date
    //   this.Pass.HeadConfig = this.HeadConfig
    //   this.Pass.SearchConfig = this.SearchConfig
    //   this.Pass.Namespace = this.Namespace
    //   this.Pass.MetricName = this.MetricName
    //   this.Pass.id = this.id
    //   this.Pass.Metrics = this.Metrics
    // },
    changeMonitor() {
      if (this.productValue === 'cvm_device') {
        this._GetCVM()
      } else if (this.productValue === 'nat_tc_stat') {
        this._GetNat()
      } else if (this.productValue === 'VPN_GW') {
        this._GetVPNG()
      } else if (this.productValue === 'vpn_tunnel') {
        this._GetVPNX()
      } else if (this.productValue === 'DC_GW') {
        this._GetPRI()
      } else if (this.productValue === 'cdb_detail') {
        this._GetMYSQL()
      } else if (this.productValue === 'REDIS-CLUSTER') {
        this._GetREDIS()
      } else if (this.productValue === 'dcline') {
        this._GetDCLINE()
      } else if (this.productValue === 'dcchannel') {
        this._GetDcPri()
      } else if (this.productValue === 'COS') {
        this._GetOBJ()
      } else if (this.productValue === 'BS') {
        this._GetBs()
      }
    },
    // 获取云服务器列表
    _GetCVM() {
      let parms = {
        Region: localStorage.getItem("regionv2"),
        Version: "2017-03-12",
      }
      this.axios.post(CVM_LIST, parms).then(data => {
        this.headConfig = {
          title1: 'ID/主机名',
          title2: '网络类型',
          title3: 'IP地址'
        }
        this.dataList = data.Response.InstanceSet
      });
    },
    // 获取NAT网关列表
    _GetNat() {
      let parms = {
        Region: localStorage.getItem("regionv2"),
        Version: "2017-03-12",
      }
      
      this.axios.post(NAT_LIST, parms).then(data => {
        this.dataList = data.Response.NatGatewaySet
        this.headConfig = {
          title1: 'ID/名称',
          title2: '状态',
          title3: '私有网络',
          title4: '类型',
        }
      });
    },
    // 获取VPN网关列表
    _GetVPNG() {
      let parms = {
        Region: localStorage.getItem("regionv2"),
        Version: "2017-03-12",
      }
      this.axios.post(VPN_LIST, parms).then(data => {
        this.dataList = data.Response.VpnGatewaySet
        this.headConfig = {
          title1: 'ID/名称',
          title2: '状态',
          title3: '所属网络',
        }
      });
    },
    // 获取VPN通道列表
    _GetVPNX() {
      let parms = {
        Region: localStorage.getItem("regionv2"),
        Version: "2017-03-12",
      }
      this.axios.post(VPNTD_LIST, parms).then(data => {
        this.dataList = data.Response.VpnConnectionSet
        this.headConfig = {
          title1: 'ID/名称',
          title2: '所属网络',
          title3: 'VPN网关',
        }
      });
    },
    // 获取专线网关列表
    _GetPRI() {
      let parms = {
        Region: localStorage.getItem("regionv2"),
        Version: "2017-03-12",
      }
      this.axios.post(DCG_LIST, parms).then(data => {
        this.dataList = data.Response.DirectConnectGatewaySet;
        this.headConfig = {
          title1: 'ID/名称',
          title2: 'NAT配置状态',
          title3: '所属网络',
        }
      });
    },
    // 获取mysql列表
    _GetMYSQL() {
      let parms = {
        Region: localStorage.getItem("regionv2"),
        Version: "2017-03-20",
      }
      this.axios.post(MYSQL_LIST, parms).then(data => {
        this.dataList = data.Response.Items
        this.headConfig = {
          title1: 'ID/名称',
          title2: '内网IP/端口',
          // title3: '网络类型',
          // title4: '类型',
        }
      });
    },
    // 获取RESIS列表
    _GetREDIS() {
      let parms = {
        Region: localStorage.getItem("regionv2"),
        Version: "2018-04-12",
      }
      this.axios.post(REDIS_LIST, parms).then(data => {
        this.dataList = data.Response.InstanceSet
        this.headConfig = {
          title1: 'ID/名称',
          title2: '规格',
          title3: '内网地址',
        }
      });
    },
    //获取物理专线列表
    _GetDCLINE() {
      let parms = {
        Region: this.selectedRegion,
        Version: '2018-04-10',
      }
      this.axios.post(Physics_LIST, parms).then(data => {
        this.dataList = data.Response.DirectConnectSet
        this.headConfig = {
          title1: '名称/ID',
          title2: '所在地',
          title3: '带宽',
        }
      });
    },
    //获取专线通道列表
    _GetDcPri() {
      let parms = {
        Region: this.selectedRegion,
        Version: '2018-04-10',
      }
      this.axios.post(Private_LIST, parms).then(data => {
        this.dataList = data.Response.DirectConnectTunnelSet
        this.headConfig = {
          title1: 'ID/名称',
          title2: '私有网络',
        }
      });
    },
    //获取对象存储列表
    _GetOBJ() {
      let parms = {
        Region: this.selectedRegion,
        Version: '2018-04-10',
      }
      this.axios.post(OBJ_LIST, parms).then(data => {
        this.dataList = data.Buckets.Bucket
        this.headConfig = {
          title1: 'Bucket名称',
          title2: '地域',
          title3: '创建时间'
        }
      });
    },
    //获取云硬盘
    _GetBs() {
      let parms = {
        Region: localStorage.getItem("regionv2"),
        Version: "2017-03-12",
      }
      this.axios.post(DISK_LIST, parms).then(data => {
        this.dataList = data.Response.DiskSet
        this.headConfig = {
          title1: 'ID/名称',
          title2: '大小(GB)',
          title3: '硬盘类型',
        }
      });
    },
    selectOk() {
      this.isShowPopover = false;
      this.monitorNumber = "已选择"+ this.selectStrategyList.length +"个对象";
    }
  },
  filters: {
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
    CreateDate(val) {
      if (val) {
        return moment(val).format('YYYY-MM-DD HH :mm:ss');
      }
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
.strategy-wrap >>> .el-button,
.strategy-wrap >>> .el-input__inner {
  height: 30px;
  border-radius: 0;
  padding-top: 0;
  line-height: 30px;
  font-size: 12px;
}
.strategy-wrap >>> .el-button:nth-child(0) {
  background: #006eff;
  width: 66px;
  height: 30px;
}
.strategy-wrap >>> .clearBtn > span:hover {
  border-bottom: 1px solid #006eff;
}

.strategy-wrap >>> .el-form-item__label {
  font-size: 12px;
  color: #888;
  font-weight: 200;
}

.strategy-wrap >>> .el-table .cell {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}
p.qudaoInfo {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}
a {
  color: #006eff;
  cursor: pointer;
}
a:hover {
  border-bottom: 1px solid #006eff;
}
.cursor {
  cursor: pointer;
}
.strategy-wrap >>> .cloneBtn > span:hover {
  border-bottom: 1px solid #006eff;
}
.strategy-wrap >>> .deleteBtn > span {
  color: #666;
}

.strategy-wrap {
  border-radius: 0;
  .strategy-filter {
    width: 100%;
    height: 100px;
    ::v-deep .el-form-item__label {
      padding: 0px;
      font-size: 12px;
      color: #888;
      font-weight: 400;
    }
    ::v-deep .el-input__inner {
      border-radius: 0px;
      height: 30px;
      width: 360px;
    }
    .select-option {
      ::v-deep .el-input__inner {
        border-radius: 0px;
        height: 30px;
        width: 100px;
      }
    }
    .select-option-tow {
      ::v-deep .el-input__inner {
        border-radius: 0px;
        height: 30px;
        width: 250px;
        margin-left: 10px;
      }
      ::v-deep .el-select__tags {
        margin-left: 10px;
      }
    }
  }
  .table {
    padding: 0 20px 20px 20px;

    .addBtn {
      width: 100%;
      height: 55px;
      padding: 20px 10px 0 10px;
      background: rgb(255, 255, 255);
      display: flex;
      justify-content: space-between;
      .iconBtn {
        font-size: 16px;
        color: #888;
        display: flex;
        align-items: center;
        > i {
          margin: 0 10px;
          font-weight: 600;
        }
        i:hover {
          cursor: pointer;
        }
      }
      ::v-deep .el-button {
        border-radius: 0px;
        height: 30px;
        line-height: 30px;
        padding: 0 20px;
      }
    }
    .Right-style {
      display: flex;
      justify-content: flex-end;

      .esach-inputL {
        width: 300px;
        margin-right: 20px;
      }
    }
    .pagstyle {
      padding: 20px;

      .pagtotal {
        font-size: 13px;
        font-weight: 400;
        color: #565656;
        line-height: 32px;
      }
    }
  }

  .overview-main {
    padding: 20px;
    box-sizing: border-box;

    .progress {
      padding: 10px 0;
      box-sizing: border-box;

      p {
        margin-bottom: 10px;
        font-weight: bold;

        span {
          float: right;
        }
      }
    }

    .main-box {
      display: flex;
    }

    .left {
      flex: 1;
      margin-right: 20px;
    }
    .right {
      width: 30%;
    }
    .head {
      display: flex;
      align-items: center;

      h3 {
        margin-right: 20px;
      }
    }
    .box {
      border: 1px solid #ddd;
      background-color: #fff;
      box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
      padding: 20px;
      box-sizing: border-box;
      margin-top: 20px;
    }

    .explain {
      padding: 10px 30px 10px 20px;
      vertical-align: middle;
      color: #003b80;
      border: 1px solid #97c7ff;
      background: #e5f0ff;

      p {
        font-size: 11px;
        line-height: 18px;
      }
    }
  }
}
.dialog-box {
  ::v-deep .el-dialog__footer {
    text-align: center;
  }
  ::v-deep .el-dialog__body {
    padding-top: 15px;
  }
  .delete-table {
    margin-top: 10px;
    ::v-deep .el-table {
      border: 1px solid #ebeef5;
      margin-left: 1px;
    }
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
  .tips {
    margin-top: 20px;
    color: #444 !important;
    font-size: 12px;
    vertical-align: middle;
    font-weight: 700;
    .tips-grey {
      color: #bbb;
      font-size: 14px;
    }
  }
  .modify-box {
    & > div {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 10px;
      padding: 10px;
      background-color: #f2f2f2;
      border: 1px solid #ddd;
      ::v-deep .el-input {
        width: 155px;
        margin-right: 30px;
      }
      ::v-deep .el-input__inner {
        border-radius: 0;
        height: 30px;
        width: 155px;
      }
      & > p {
        span {
          &:nth-of-type(1) {
            margin-right: 10px;
            font-size: 14px;
            color: #444;
          }
          &:nth-of-type(2) {
            margin-right: 10px;
            font-size: 12px;
            color: #888;
          }
        }
      }
    }
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
.popover-box {
  .text-color {
    font-size: 12px;
    color: #888;
    &:nth-of-type(2) {
      margin-top: 20px;
    }
  }
}
.trigger-condition {
  p {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
  }
}
.tke-page {
  padding: 20px;
  display: flex;
  flex-direction: row-reverse;
  background: #fff;
}
.group-color {
  color: #888;
  font-size: 14px;
}
.deleteBtn-color {
  cursor: pointer;
  color: #bbb;
}
.strong {
  font-weight: 700;
}
.text-color-red {
  span {
    color: #e54545;
  }
  i {
    color: #888;
    margin-left: 2px;
  }
}

.text-color-grey {
  color: #bbb;
}
</style>

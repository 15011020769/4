<template>
  <div class="defaultDetail">
    <Header title="管理告警策略" :backShow="backShow" />
    <product-type-cpt
      v-on:PassData="passData"
      :searchParam="searchParam"
      :projectId="projectId"
      :productValue="ViewName"
      style="display:none;"
      v-on:loading="Type_loading"
    />

    <el-card class="box-card">
      <div slot="header" class="clearfix" style="width:100%">
        <h3>基本信息</h3>
      </div>
      <ul>
        <li>
          <span class="textColor">策略名稱</span>
          <p>
            <span>{{ basicNews.GroupName }}</span>
            <i class="el-icon-edit" @click="editInfo('name')"></i>
          </p>
        </li>
        <li>
          <span class="textColor">策略類型</span>
          <p>
            <span>{{ basicNews.ShowName }}</span>
          </p>
        </li>
        <li v-if="basicNews.ProjectId != -1">
          <span class="textColor">所屬項目</span>
          <p>
            <span>{{ basicNews.ProjectId | ProjectName }}</span>
          </p>
        </li>
        <li>
          <span class="textColor">最後修改人</span>
          <p>
            <span>{{ basicNews.LastEditUin }}</span>
          </p>
        </li>
        <li>
          <span class="textColor">最後修改時間</span>
          <p>
            <span>{{ basicNews.UpdateTime }}</span>
          </p>
        </li>
        <li>
          <span class="textColor">備注</span>
          <p>
            <span>{{ basicNews.Remark }}</span>
            <i class="el-icon-edit" @click="editInfo('remarks')"></i>
          </p>
        </li>
      </ul>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix" style="width:100%;display:flex;">
        <h3>告警觸發條件</h3>
        <a
          v-loading="gaoJingLoading"
          v-if="gaoJingLoading1"
          class="gao-jing-loading"
          >編輯</a
        >
        <a @click="editGaoJing" v-if="!gaoJingLoading1" class="gao-jing-loading"
          >編輯</a
        >
      </div>
      <div class="box-content">
        <p v-if="basicNews.ConditionsTemp">
          <span class="textColor" style="margin-right:20px;">
            模板名稱
          </span>
          {{ basicNews.ConditionsTemp.GroupName }}
        </p>
        <span class="textColor"
          >指標告警（{{ basicNews.IsUnionRule === 0 ? "任意" : "所有" }}）</span
        >
        <div
          v-for="i in basicNews.ConditionsConfig"
          class="trigger-condition"
          :key="i.MetricShowName"
        >
          <p>
            {{ i.MetricShowName }}
            {{ i.CalcType | CalcType }} {{ i.CalcValue }}{{ i.Unit }}，持續{{
              i.ContinueTime / 60
            }}分钟，
            <span v-if="i.AlarmNotifyType != 1"
              >按{{ i.AlarmNotifyPeriod | AlarmNotifyPeriod
              }}{{ i.AlarmNotifyPeriod > 0 ? "重复告警" : "不重复告警" }}
            </span>
            <span v-else>
              按周期指数递增重复告警
            </span>
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
              j.AlarmNotifyPeriod > 0 ? "重複告警" : "不重複告警"
            }}
          </p>
        </div>
      </div>
    </el-card>
    <el-card class="box-card alarm-object">
      <div slot="header" class="clearfix">
        <h3>告警對象</h3>
        <a @click="editObject">編輯</a>
      </div>
      <div class="box-content" v-if="!InstanceGroupShow.InstanceGroup">
        <el-row style="margin:10px 5px;padding-top:10px">
          <el-button type="primary" @click="AlarmObjectNews"
            >新增對象</el-button
          >
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
      <div class="alarm-object-table" v-if="!InstanceGroupShow.InstanceGroup">
        <el-table
          ref="multipleTable"
          :data="alarmObjectData"
          style="width: 100%"
          v-loading="alarmObjecLoad"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="50"></el-table-column>
          <el-table-column label="ID/主機名" v-if="ViewName === 'cvm_device'">
            <template slot-scope="scope">
              <p>{{ scope.row.InstanceId }}</p>
              <p>{{ scope.row.InstanceName }}</p>
            </template>
          </el-table-column>
          <el-table-column label="狀態" v-if="ViewName === 'cvm_device'">
            <template slot-scope="scope">
              <span>{{ InstanceState(scope.row.InstanceState) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="網絡類型" v-if="ViewName === 'cvm_device'">
            VPC 網絡
          </el-table-column>
          <el-table-column label="IP地址" v-if="ViewName === 'cvm_device'">
            <template slot-scope="scope">
              <p>
                <span
                  v-for="(item, index) in scope.row.PrivateIpAddresses"
                  :key="index"
                >
                  {{ item }}(內網)
                </span>
              </p>
              <p>
                <span
                  v-for="(item, index) in scope.row.PublicIpAddresses"
                  :key="index"
                >
                  {{ item }}(外網)
                </span>
              </p>
            </template>
          </el-table-column>
          <!-- BS -->
          <el-table-column label="ID/名稱" v-if="ViewName === 'BS'">
            <template slot-scope="scope">
              <p>{{ scope.row.DiskId }}</p>
              <p>{{ scope.row.DiskName }}</p>
            </template>
          </el-table-column>
          <el-table-column label="大小(GB)" v-if="ViewName === 'BS'">
            <template slot-scope="scope">
              <span>{{ scope.row.DiskSize }}</span>
            </template>
          </el-table-column>
          <el-table-column label="硬碟類型" v-if="ViewName === 'BS'">
            <template slot-scope="scope">
              <p>{{ scope.row.DiskType | DiskType }}</p>
              <p>{{ scope.row.DiskUsage | DiskUsage }}</p>
            </template>
          </el-table-column>
          <el-table-column label="關聯雲主機ID" v-if="ViewName === 'BS'">
            <template slot-scope="scope">
              <p>{{ scope.row.InstanceId }}</p>
              <!-- <p>{{ scope.row. }}</p> -->
            </template>
          </el-table-column>
          <!-- VPN_GW -->
          <el-table-column label="ID/名稱" v-if="ViewName === 'VPN_GW'">
            <template slot-scope="scope">
              <p>{{ scope.row.VpnGatewayId }}</p>
              <p>{{ scope.row.VpnGatewayName }}</p>
            </template>
          </el-table-column>
          <el-table-column label="狀態" v-if="ViewName === 'VPN_GW'">
            <template slot-scope="scope">
              <span>{{ VPN_GW_State(scope.row.State) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="所屬網絡" v-if="ViewName === 'VPN_GW'">
            <template slot-scope="scope">
              <p>{{ scope.row.VpcId }}</p>
              <!-- <p>{{scope.row.}}</p> -->
            </template>
          </el-table-column>

          <!-- vpn_tunnel -->
          <el-table-column label="ID/名稱" v-if="ViewName === 'vpn_tunnel'">
            <template slot-scope="scope">
              <p>{{ scope.row.VpnGatewayId }}</p>
              <p>{{ scope.row.VpnConnectionName }}</p>
            </template>
          </el-table-column>
          <el-table-column label="狀態" v-if="ViewName === 'vpn_tunnel'">
            <template slot-scope="scope">
              <span>{{ VPN_Tunnel_State(scope.row.State) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="所屬網絡" v-if="ViewName === 'vpn_tunnel'">
            <template slot-scope="scope">
              <p>{{ scope.row.VpcId }}</p>
              <!-- <p>{{scope.row.}}</p> -->
            </template>
          </el-table-column>
          <el-table-column label="VPN網關" v-if="ViewName === 'vpn_tunnel'">
            <template slot-scope="scope">
              <p>{{ scope.row.VpnGatewayId }}</p>
              <!-- <p>{{scope.row.}}</p> -->
            </template>
          </el-table-column>
          <el-table-column label="對端網關" v-if="ViewName === 'vpn_tunnel'">
            <template slot-scope="scope">
              <p>{{ scope.row.CustomerGatewayId }}</p>
              <!-- <p>{{scope.row.}}</p> -->
            </template>
          </el-table-column>

          <!-- nat_tc_stat -->
          <el-table-column label="ID/名稱" v-if="ViewName === 'nat_tc_stat'">
            <template slot-scope="scope">
              <p>{{ scope.row.NatGatewayId }}</p>
              <p>{{ scope.row.NatGatewayName }}</p>
            </template>
          </el-table-column>
          <el-table-column label="狀態" v-if="ViewName === 'nat_tc_stat'">
            <template slot-scope="scope">
              <span>{{ VPN_Tunnel_State(scope.row.State) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="私有網絡" v-if="ViewName === 'nat_tc_stat'">
            <template slot-scope="scope">
              <p>{{ scope.row.VpcId }}</p>
              <!-- <p>{{scope.row.}}</p> -->
            </template>
          </el-table-column>
          <el-table-column label="類型" v-if="ViewName === 'nat_tc_stat'">
            <template slot-scope="scope">
              <p>小型</p>
              <p>最大並發連接數{{ scope.row.maxConcurrent / 100 }}萬</p>
            </template>
          </el-table-column>

          <!-- DC_GW -->
          <el-table-column label="ID/名稱" v-if="ViewName === 'DC_GW'">
            <template slot-scope="scope">
              <p>{{ scope.row.DirectConnectGatewayId }}</p>
              <p>{{ scope.row.DirectConnectGatewayName }}</p>
            </template>
          </el-table-column>
          <el-table-column label="NAT配置狀態" v-if="ViewName === 'DC_GW'">
            <template slot-scope="scope">
              <span>{{ NAT_Status(scope.row.GatewayType) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="所屬網絡" v-if="ViewName === 'DC_GW'">
            <template slot-scope="scope">
              <p>{{ scope.row.VpcId }}</p>
              <!-- <p>{{scope.row.}}</p> -->
            </template>
          </el-table-column>

          <!-- EIP -->
          <el-table-column label="ID/名稱" v-if="ViewName === 'EIP'">
            <template slot-scope="scope">
              <p>{{ scope.row.AddressId }}</p>
            </template>
          </el-table-column>
          <el-table-column label="彈性IP地址" v-if="ViewName === 'EIP'">
            <template slot-scope="scope">
              <span>{{ scope.row.AddressIp }}</span>
            </template>
          </el-table-column>

          <!-- cdb_detail -->
          <el-table-column label="ID/名稱" v-if="ViewName === 'cdb_detail'">
            <template slot-scope="scope">
              <p>{{ scope.row.InstanceId }}</p>
              <p>{{ scope.row.InstanceName }}</p>
            </template>
          </el-table-column>
          <el-table-column label="狀態" v-if="ViewName === 'cdb_detail'">
            <template slot-scope="scope">
              <p>{{ CDB_Status(scope.row.Status) }}</p>
            </template>
          </el-table-column>
          <el-table-column label="內網IP/端口" v-if="ViewName === 'cdb_detail'">
            <template slot-scope="scope">
              <span>{{ scope.row.Vip }}</span>
              <p>{{ scope.row.Vport }}</p>
            </template>
          </el-table-column>
          <el-table-column label="網絡類型" v-if="ViewName === 'cdb_detail'">
            <template slot-scope="scope">
              VPC
            </template>
          </el-table-column>
          <el-table-column label="類型" v-if="ViewName === 'cdb_detail'">
            <template slot-scope="scope">
              {{ CDB_InstanceType(scope.row.InstanceType) }}
            </template>
          </el-table-column>

          <!-- REDIS-CLUSTER -->
          <el-table-column label="ID/名稱" v-if="ViewName === 'REDIS-CLUSTER'">
            <template slot-scope="scope">
              <p>{{ scope.row.InstanceId }}</p>
              <p>{{ scope.row.InstanceName }}</p>
            </template>
          </el-table-column>
          <el-table-column label="狀態" v-if="ViewName === 'REDIS-CLUSTER'">
            <template slot-scope="scope">
              <p>{{ REDIS_Status(scope.row.Status) }}</p>
            </template>
          </el-table-column>
          <el-table-column label="規格" v-if="ViewName === 'REDIS-CLUSTER'">
            <template slot-scope="scope">
              master-slave
            </template>
          </el-table-column>
          <el-table-column label="內網地址" v-if="ViewName === 'REDIS-CLUSTER'">
            <template slot-scope="scope">
              {{ scope.row.WanIp }}
            </template>
          </el-table-column>
          <!-- dcchannel -->
          <el-table-column label="名稱/ID" v-if="ViewName === 'dcchannel'">
            <template slot-scope="scope">
              <p>{{ scope.row.DirectConnectTunnelId }}</p>
              <p>{{ scope.row.DirectConnectTunnelName }}</p>
            </template>
          </el-table-column>
          <el-table-column label="物理專線" v-if="ViewName === 'dcchannel'">
            <template slot-scope="scope">
              <p>{{ dcchannel_Status(scope.row.State) }}</p>
            </template>
          </el-table-column>
          <el-table-column label="私有網絡" v-if="ViewName === 'dcchannel'">
            <template slot-scope="scope">
              master-slave
            </template>
          </el-table-column>
          <el-table-column label="關聯專線網關" v-if="ViewName === 'dcchannel'">
            <template slot-scope="scope">
              {{ scope.row.WanIp }}
            </template>
          </el-table-column>
          <!-- dcline -->
          <el-table-column label="名稱/ID" v-if="ViewName === 'dcline'">
            <template slot-scope="scope">
              <p>{{ scope.row.DirectConnectName }}</p>
              <p>{{ scope.row.DirectConnectId }}</p>
            </template>
          </el-table-column>
          <el-table-column label="所在地" v-if="ViewName === 'dcline'">
            <template slot-scope="scope">
              <p>{{ scope.row.Location }}</p>
            </template>
          </el-table-column>
          <el-table-column label="帶寬" v-if="ViewName === 'dcline'">
            <template slot-scope="scope">
              <p>{{ scope.row.Bandwidth }}Mbps</p>
            </template>
          </el-table-column>
          <!-- COS -->
          <el-table-column label="Bucket名稱" v-if="ViewName === 'COS'">
            <template slot-scope="scope">
              <p>{{ scope.row.Name }}</p>
            </template>
          </el-table-column>
          <el-table-column label="地域" v-if="ViewName === 'COS'">
            <template slot-scope="scope">
              <p>{{ scope.row.zone.zone }}</p>
            </template>
          </el-table-column>
          <el-table-column label="創建時間" v-if="ViewName === 'COS'">
            <template slot-scope="scope">
              {{ CreationDate(scope.row.CreationDate) }}
            </template>
          </el-table-column>

          <el-table-column prop="address" label="操作">
            <template slot-scope="scope">
              <a href="javascript:;" @click="AlarmObjectRemoval(scope.row, 1)"
                >移出</a
              >
            </template>
          </el-table-column>
        </el-table>
        <!-- 分頁 -->
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
      <div
        class="alarm-object-table-instance"
        v-if="InstanceGroupShow.InstanceGroup"
      >
        <ul>
          <li>
            <span>實例組</span>
            <span>{{ InstanceGroupShow.InstanceGroup.GroupName }}</span>
            <a href="javascript:;" @click="unBindingInstance = true"
              >解除綁定</a
            >
          </li>
          <li>
            <span>實例數</span>
            <span
              >{{ InstanceGroupShow.InstanceGroup.InstanceSum }}個(啓用告警：
              {{ InstanceGroupShow.NoShieldedSum }}個)</span
            >
            <a href="javascript:;" @click="retract = !retract">{{
              retract ? "收起" : "展開"
            }}</a>
          </li>
          <li v-if="retract">
            <span></span>
            <div>
              <div class="left">
                <div class="left-main border">
                  <!-- <div class="seek" style="">
                    <el-select v-model="searchItem" placeholder="請選擇">
                      <el-option
                        v-for="item in searchItemOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                    <el-input
                      placeholder="請輸入內容"
                      v-model="searchInput"
                      class="input-with-select"
                    >
                      <el-button
                        slot="append"
                        icon="el-icon-search"
                        @click="changeSearch"
                      ></el-button>
                    </el-input>
                  </div> -->
                  <el-table
                    :data="alarmObjectData"
                    height="400"
                    ref="multipleTable"
                    class="table-left"
                    v-loading="alarmInstanceLond"
                  >
                    <el-table-column
                      label="ID/主機名"
                      v-if="ViewName === 'cvm_device'"
                    >
                      <template slot-scope="scope">
                        <p>{{ scope.row.InstanceId }}</p>
                        <p>{{ scope.row.InstanceName }}</p>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="狀態"
                      v-if="ViewName === 'cvm_device'"
                    >
                      <template slot-scope="scope">
                        <span>{{
                          InstanceState(scope.row.InstanceState)
                        }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="網絡類型"
                      v-if="ViewName === 'cvm_device'"
                    >
                      VPC 網絡
                    </el-table-column>
                    <el-table-column
                      label="IP地址"
                      v-if="ViewName === 'cvm_device'"
                    >
                      <template slot-scope="scope">
                        <p>
                          <span
                            v-for="(item, index) in scope.row
                              .PrivateIpAddresses"
                            :key="index"
                            >{{ item }}(內網)</span
                          >
                        </p>
                        <p>
                          <span
                            v-for="(item, index) in scope.row.PublicIpAddresses"
                            :key="index"
                            >{{ item }}(外網)</span
                          >
                        </p>
                      </template>
                    </el-table-column>
                    <!-- BS -->
                    <el-table-column label="ID/名稱" v-if="ViewName === 'BS'">
                      <template slot-scope="scope">
                        <p>{{ scope.row.DiskId }}</p>
                        <p>{{ scope.row.DiskName }}</p>
                      </template>
                    </el-table-column>
                    <el-table-column label="大小(GB)" v-if="ViewName === 'BS'">
                      <template slot-scope="scope">
                        <span>{{ scope.row.DiskSize }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="硬碟類型" v-if="ViewName === 'BS'">
                      <template slot-scope="scope">
                        <p>{{ scope.row.DiskType | DiskType }}</p>
                        <p>{{ scope.row.DiskUsage | DiskUsage }}</p>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="關聯雲主機ID"
                      v-if="ViewName === 'BS'"
                    >
                      <template slot-scope="scope">
                        <p>{{ scope.row.InstanceId }}</p>
                        <!-- <p>{{ scope.row. }}</p> -->
                      </template>
                    </el-table-column>
                    <!-- VPN_GW -->
                    <el-table-column
                      label="ID/名稱"
                      v-if="ViewName === 'VPN_GW'"
                    >
                      <template slot-scope="scope">
                        <p>{{ scope.row.VpnGatewayId }}</p>
                        <p>{{ scope.row.VpnGatewayName }}</p>
                      </template>
                    </el-table-column>
                    <el-table-column label="狀態" v-if="ViewName === 'VPN_GW'">
                      <template slot-scope="scope">
                        <span>{{ VPN_GW_State(scope.row.State) }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="所屬網絡"
                      v-if="ViewName === 'VPN_GW'"
                    >
                      <template slot-scope="scope">
                        <p>{{ scope.row.VpcId }}</p>
                        <!-- <p>{{scope.row.}}</p> -->
                      </template>
                    </el-table-column>

                    <!-- vpn_tunnel -->
                    <el-table-column
                      label="ID/名稱"
                      v-if="ViewName === 'vpn_tunnel'"
                    >
                      <template slot-scope="scope">
                        <p>{{ scope.row.VpnGatewayId }}</p>
                        <p>{{ scope.row.VpnConnectionName }}</p>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="狀態"
                      v-if="ViewName === 'vpn_tunnel'"
                    >
                      <template slot-scope="scope">
                        <span>{{ VPN_Tunnel_State(scope.row.State) }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="所屬網絡"
                      v-if="ViewName === 'vpn_tunnel'"
                    >
                      <template slot-scope="scope">
                        <p>{{ scope.row.VpcId }}</p>
                        <!-- <p>{{scope.row.}}</p> -->
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="VPN網關"
                      v-if="ViewName === 'vpn_tunnel'"
                    >
                      <template slot-scope="scope">
                        <p>{{ scope.row.VpnGatewayId }}</p>
                        <!-- <p>{{scope.row.}}</p> -->
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="對端網關"
                      v-if="ViewName === 'vpn_tunnel'"
                    >
                      <template slot-scope="scope">
                        <p>{{ scope.row.CustomerGatewayId }}</p>
                        <!-- <p>{{scope.row.}}</p> -->
                      </template>
                    </el-table-column>

                    <!-- nat_tc_stat -->
                    <el-table-column
                      label="ID/名稱"
                      v-if="ViewName === 'nat_tc_stat'"
                    >
                      <template slot-scope="scope">
                        <p>{{ scope.row.NatGatewayId }}</p>
                        <p>{{ scope.row.NatGatewayName }}</p>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="狀態"
                      v-if="ViewName === 'nat_tc_stat'"
                    >
                      <template slot-scope="scope">
                        <span>{{ VPN_Tunnel_State(scope.row.State) }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="私有網絡"
                      v-if="ViewName === 'nat_tc_stat'"
                    >
                      <template slot-scope="scope">
                        <p>{{ scope.row.VpcId }}</p>
                        <!-- <p>{{scope.row.}}</p> -->
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="類型"
                      v-if="ViewName === 'nat_tc_stat'"
                    >
                      <template slot-scope="scope">
                        <p>小型</p>
                        <p>
                          最大並發連接數{{ scope.row.maxConcurrent / 100 }}萬
                        </p>
                      </template>
                    </el-table-column>

                    <!-- DC_GW -->
                    <el-table-column
                      label="ID/名稱"
                      v-if="ViewName === 'DC_GW'"
                    >
                      <template slot-scope="scope">
                        <p>{{ scope.row.DirectConnectGatewayId }}</p>
                        <p>{{ scope.row.DirectConnectGatewayName }}</p>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="NAT配置狀態"
                      v-if="ViewName === 'DC_GW'"
                    >
                      <template slot-scope="scope">
                        <span>{{ NAT_Status(scope.row.GatewayType) }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="所屬網絡"
                      v-if="ViewName === 'DC_GW'"
                    >
                      <template slot-scope="scope">
                        <p>{{ scope.row.VpcId }}</p>
                        <!-- <p>{{scope.row.}}</p> -->
                      </template>
                    </el-table-column>

                    <!-- EIP -->
                    <el-table-column label="ID/名稱" v-if="ViewName === 'EIP'">
                      <template slot-scope="scope">
                        <p>{{ scope.row.AddressId }}</p>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="彈性IP地址"
                      v-if="ViewName === 'EIP'"
                    >
                      <template slot-scope="scope">
                        <span>{{ scope.row.AddressIp }}</span>
                      </template>
                    </el-table-column>

                    <!-- cdb_detail -->
                    <el-table-column
                      label="ID/名稱"
                      v-if="ViewName === 'cdb_detail'"
                    >
                      <template slot-scope="scope">
                        <p>{{ scope.row.InstanceId }}</p>
                        <p>{{ scope.row.InstanceName }}</p>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="狀態"
                      v-if="ViewName === 'cdb_detail'"
                    >
                      <template slot-scope="scope">
                        <p>{{ CDB_Status(scope.row.Status) }}</p>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="內網IP/端口"
                      v-if="ViewName === 'cdb_detail'"
                    >
                      <template slot-scope="scope">
                        <span>{{ scope.row.Vip }}</span>
                        <p>{{ scope.row.Vport }}</p>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="網絡類型"
                      v-if="ViewName === 'cdb_detail'"
                    >
                      <template slot-scope="scope">
                        VPC
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="類型"
                      v-if="ViewName === 'cdb_detail'"
                    >
                      <template slot-scope="scope">
                        {{ CDB_InstanceType(scope.row.InstanceType) }}
                      </template>
                    </el-table-column>

                    <!-- REDIS-CLUSTER -->
                    <el-table-column
                      label="ID/名稱"
                      v-if="ViewName === 'REDIS-CLUSTER'"
                    >
                      <template slot-scope="scope">
                        <p>{{ scope.row.InstanceId }}</p>
                        <p>{{ scope.row.InstanceName }}</p>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="狀態"
                      v-if="ViewName === 'REDIS-CLUSTER'"
                    >
                      <template slot-scope="scope">
                        <p>{{ REDIS_Status(scope.row.Status) }}</p>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="規格"
                      v-if="ViewName === 'REDIS-CLUSTER'"
                    >
                      <template slot-scope="scope">
                        master-slave
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="內網地址"
                      v-if="ViewName === 'REDIS-CLUSTER'"
                    >
                      <template slot-scope="scope">
                        {{ scope.row.WanIp }}
                      </template>
                    </el-table-column>
                    <!-- dcchannel -->
                    <el-table-column
                      label="ID/名稱"
                      v-if="ViewName === 'dcchannel'"
                    >
                      <template slot-scope="scope">
                        <p>{{ scope.row.DirectConnectTunnelId }}</p>
                        <p>{{ scope.row.DirectConnectTunnelName }}</p>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="狀態"
                      v-if="ViewName === 'dcchannel'"
                    >
                      <template slot-scope="scope">
                        <p>{{ dcchannel_Status(scope.row.State) }}</p>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="規格"
                      v-if="ViewName === 'dcchannel'"
                    >
                      <template slot-scope="scope">
                        master-slave
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="內網地址"
                      v-if="ViewName === 'dcchannel'"
                    >
                      <template slot-scope="scope">
                        {{ scope.row.WanIp }}
                      </template>
                    </el-table-column>
                    <!-- dcline -->
                    <el-table-column
                      label="名稱/ID"
                      v-if="ViewName === 'dcline'"
                    >
                      <template slot-scope="scope">
                        <p>{{ scope.row.DirectConnectName }}</p>
                        <p>{{ scope.row.DirectConnectId }}</p>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="所在地"
                      v-if="ViewName === 'dcline'"
                    >
                      <template slot-scope="scope">
                        <p>{{ scope.row.Location }}</p>
                      </template>
                    </el-table-column>
                    <el-table-column label="帶寬" v-if="ViewName === 'dcline'">
                      <template slot-scope="scope">
                        <p>{{ scope.row.Bandwidth }}Mbps</p>
                      </template>
                    </el-table-column>
                    <!-- COS -->
                    <el-table-column
                      label="Bucket名稱"
                      v-if="ViewName === 'COS'"
                    >
                      <template slot-scope="scope">
                        <p>{{ scope.row.Name }}</p>
                      </template>
                    </el-table-column>
                    <el-table-column label="地域" v-if="ViewName === 'COS'">
                      <template slot-scope="scope">
                        <p>{{ scope.row.zone.zone }}</p>
                      </template>
                    </el-table-column>
                    <el-table-column label="創建時間" v-if="ViewName === 'COS'">
                      <template slot-scope="scope">
                        {{ CreationDate(scope.row.CreationDate) }}
                      </template>
                    </el-table-column>

                    <el-table-column label="啓用告警">
                      <template slot-scope="scope">
                        <el-switch
                          v-model="scope.row.IsShielded"
                          active-color="#006eff"
                          inactive-color="#888"
                          @change="AlarmStart(scope.row, scope.$index)"
                        >
                        </el-switch>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </el-card>
    <el-card class="box-card alarm-object alarm-receiving-object">
      <div slot="header" class="clearfix">
        <h3>告警接收對象</h3>
      </div>
      <div class="box-content" style="margin-top:20px;">
        <el-row>
          <el-button type="primary" @click="EditReceiveObject">編輯</el-button>
          <el-button @click="Remove('', 2)" v-if="remove.length > 0"
            >解除</el-button
          >
          <el-button disabled v-else>解除</el-button>
        </el-row>
      </div>
      <div class="alarm-object-table">
        <el-table
          ref="multipleTable"
          :data="receivingObjectData"
          style="width: 100%"
          height="300px"
          v-loading="receivingObjectLoad"
          @selection-change="receivingSelectionChange"
        >
          <el-table-column type="selection"> </el-table-column>
          <el-table-column
            label="接收組"
            v-if="
              receivingObjectData.length === 0 ||
                ReceiverInfos.ReceiverType === 'group'
            "
          >
            <template slot-scope="scope">
              {{ scope.row.GroupName }}
            </template>
          </el-table-column>
          <el-table-column
            label="接收人"
            v-if="
              receivingObjectData.length === 0 ||
                ReceiverInfos.ReceiverType === 'group'
            "
          >
            <template slot-scope="scope">
              <div v-if="scope.row.UserInfo.length > 0">
                <span v-for="(item, index) in scope.row.UserInfo" :key="index">
                  {{ item.Name
                  }}<i v-if="index != scope.row.UserInfo.length - 1">、</i>
                </span>
              </div>
              <div v-else>
                未設置
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="有效時段"
            v-if="
              receivingObjectData.length === 0 ||
                ReceiverInfos.ReceiverType === 'group'
            "
          >
            {{ ReceiverInfos.StartTime | EndTime }} -
            {{ ReceiverInfos.EndTime | EndTime }}
          </el-table-column>

          <el-table-column
            label="告警渠道"
            v-if="
              receivingObjectData.length === 0 ||
                ReceiverInfos.ReceiverType === 'group'
            "
          >
            <span v-for="(item, index) in ReceiverInfos.NotifyWay" :key="index">
              {{ item | NotifyWay
              }}<i v-if="index != ReceiverInfos.NotifyWay.length - 1">、</i>
            </span>
          </el-table-column>
          <el-table-column
            label="接收人"
            v-if="ReceiverInfos.ReceiverType === 'user'"
          >
            <template slot-scope="scope">
              <div>
                {{ scope.row.Name }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="有效時段"
            v-if="ReceiverInfos.ReceiverType === 'user'"
          >
            {{ ReceiverInfos.StartTime | EndTime }} -
            {{ ReceiverInfos.EndTime | EndTime }}
          </el-table-column>
          <el-table-column
            label="告警渠道"
            v-if="ReceiverInfos.ReceiverType === 'user'"
          >
            <span v-for="(item, index) in ReceiverInfos.NotifyWay" :key="index">
              {{ item | NotifyWay
              }}<i v-if="index != ReceiverInfos.NotifyWay.length - 1">、</i>
            </span>
          </el-table-column>
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
        <h3>回調接口</h3>
      </div>
      <p class="tip">
        填寫公網可訪問到的url作爲回調接口地址(域名或IP[:端口][/path])，雲監控將及時把告警信息推送到該地址。
      </p>
      <div
        class="box-content"
        style="line-height: 30px;margin:20px 0;"
        v-if="!basicNews.Callback"
      >
        未配置

        <i
          style="color:#888;cursor: pointer;"
          class="el-icon-edit"
          @click="callbackEdit"
        ></i>
      </div>
      <div class="Callback-box-content" v-if="basicNews.Callback">
        <span>{{ basicNews.Callback.CallbackUrl }}</span>
        <span v-if="Verification">
          {{ basicNews.Callback.ValidFlag == 0 ? "" : "驗證超時" }}</span
        >
        <span v-if="!Verification">驗證中</span>
        <i
          class="el-icon-refresh ml5"
          v-if="Verification"
          @click="CallBackRefresh"
        ></i>
        <i class="el-icon-edit ml5" @click="callbackEdit"></i>
        <i class="el-icon-error ml5" @click="CallBackSave(2)"></i>
        <div class="bg-box" style="width:40%;margin-top:16px;">
          <p>
            回調域名通過驗證後生效，請于Response Body中返回以下code。
            <el-tooltip
              effect="light"
              content="觸發驗證後推送請求三次，每次3s，累計9s未成功返回即驗證超時。"
              placement="top"
              ><i class="el-icon-info"></i>
            </el-tooltip>
          </p>
          <span> {{ basicNews.Callback.VerifyCode }}</span>
        </div>
      </div>
    </el-card>
    <!-- 修改名稱 -->
    <el-dialog
      title="修改告警策略名稱"
      :visible.sync="modifyNameDialogVisible"
      width="500px"
      custom-class="tke-dialog"
    >
      <div class="edit-dialog">
        <el-input
          size="small"
          placeholder="請輸告警策略名稱，20字以內"
          v-model="GroupName"
          @input="EditTips"
        ></el-input>
        <p v-if="tipsShow">告警策略名稱不能爲空</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="NameSure()">確定</el-button>
        <el-button @click="modifyNameDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
    <!-- 修改備注 -->
    <el-dialog
      title="修改告警策略備注"
      :visible.sync="modifyRemarksDialogVisible"
      width="600px"
      custom-class="tke-dialog"
    >
      <div class="edit-dialog">
        <el-input
          type="textarea"
          :rows="2"
          placeholder="請輸入告警策略備注，100字以內"
          v-model="remarksVal"
          maxlength="100"
        >
        </el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="NameSure">確定</el-button>
        <el-button @click="modifyRemarksDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
    <!-- 告警觸發條件編輯 -->
    <el-dialog
      title="修改告警觸發條件"
      :visible.sync="dialogEditGaojing"
      width="1024px"
    >
      <div>
        <div class="trigger-condition">
          <span>觸發條件</span>
          <div class="chufaContent">
            <div>
              <el-radio v-model="radioChufa" label="1" @change="chufaTemplate"
                >觸發條件模板</el-radio
              >
              <a
                style="margin-left:15px;"
                @click="$router.push({ path: '/Template' })"
                >新增触发条件模板</a
              >
              <div class="content" v-if="radioChufa == 1">
                <p>
                  <el-select
                    v-model="nameVal"
                    style="width:150px;"
                    @change="TriggerChange"
                    :disabled="nameVal === '當前策略下沒有觸發條件模板'"
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
                <div v-if="nameVal !== '當前策略下沒有觸發條件模板'">
                  <p>
                    <el-checkbox disabled>指標告警</el-checkbox>
                  </p>
                  <p>
                    <span>滿足</span>
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
                    <span>條件時，觸發告警</span>
                  </p>
                  <!-- 在這裏進行便利，添加 -->
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
                            v-for="i in typeOpt"
                            :key="i.MetricId"
                            :label="i.MetricShowName"
                            :value="i.MetricId"
                            label-width="40px"
                          ></el-option> </el-select
                        >&nbsp;
                        <el-select
                          v-model="item.Period"
                          style="width:140px;"
                          disabled
                        >
                          <el-option
                            v-for="(i, x) in cycle"
                            :key="x"
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
                        >&nbsp;
                        <div
                          v-if="!basicNews.ConditionsTemp"
                          style="display:flex;aline-items:center;"
                        >
                          <span style="width:40px;margin:0px;">then</span>&nbsp;
                          <el-select
                            v-model="item.AlarmNotifyPeriod"
                            style="width:180px;"
                            disabled
                          >
                            <el-option
                              v-for="(x, i) in AlarmNotifyPeriod"
                              :key="i"
                              :label="x.label"
                              :value="x.value"
                              label-width="40px"
                            ></el-option>
                          </el-select>
                        </div>
                        <el-popover placement="top" width="360" trigger="hover">
                          <div>
                            <p>
                              重複通知：可以設置告警發生24小時內重複發送通知；超過24小時，每天告警壹次，超過72小時，不再發送告警通知。
                            </p>
                            <p style="margin-top:5px;">
                              周期指數遞增通知:
                              告警持續時長到達告警統計周期的1，2，4，8，16，32...倍時發送告警通知
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
                  <div style="margin-top:10px;" v-if="basicNews.ConditionsTemp">
                    <span>then</span>&nbsp;
                    <el-select
                      v-model="alarmNotifyPeriodVal"
                      style="width:180px;"
                      disabled
                    >
                      <el-option
                        v-for="(x, i) in AlarmNotifyPeriod"
                        :key="i"
                        :label="x.label"
                        :value="x.value"
                        label-width="40px"
                      ></el-option>
                    </el-select>

                    <el-popover placement="top" width="360" trigger="hover">
                      <div>
                        <p>
                          重複通知：可以設置告警發生24小時內重複發送通知；超過24小時，每天告警壹次，超過72小時，不再發送告警通知。
                        </p>
                        <p style="margin-top:5px;">
                          周期指數遞增通知:
                          告警持續時長到達告警統計周期的1，2，4，8，16，32...倍時發送告警通知
                        </p>
                      </div>
                      <i
                        class="el-icon-info"
                        style="color:#888; margin:0 5px;"
                        slot="reference"
                      ></i>
                    </el-popover>
                  </div>
                </div>
                <div v-if="nameVal !== '當前策略下沒有觸發條件模板'">
                  <p v-if="basicNews.EventConfig">
                    <el-checkbox disabled v-if="Conditions.EventConditions">
                      事件告警
                    </el-checkbox>
                    <el-popover placement="right" trigger="hover">
                      <div>
                        <p>各事件規則<a href="javascript:;">詳情</a></p>
                      </div>
                      <i
                        class="el-icon-info"
                        style="color:#888; margin:0 5px;"
                        slot="reference"
                      ></i>
                    </el-popover>
                  </p>
                  <!-- 在這裏進行便利，添加 -->
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
                >配置觸發條件</el-radio
              >
              <div class="content content-pz" v-if="radioChufa == 2">
                <div>
                  <p style="line-height:30px;">
                    <el-checkbox
                      v-model="formWrite.checkedZhibiao"
                      style="height:30px;"
                      >指標告警</el-checkbox
                    >
                  </p>
                  <p>
                    <span>滿足</span>
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
                    <span>條件時，觸發告警</span>
                  </p>
                  <!-- 在這裏進行便利，添加 -->
                  <ul class="ul-one ul-two">
                    <li v-for="(item, index) in formWrite.arr" :key="index">
                      <div>
                        if&nbsp;
                        <el-select
                          v-model="item.typeVal"
                          style="width:150px;"
                          @change="TypeChange(index)"
                        >
                          <el-option
                            v-for="x in typeOpt"
                            :key="x.MetricId"
                            :label="x.MetricShowName"
                            :value="x.MetricId"
                            label-width="40px"
                          ></el-option> </el-select
                        >&nbsp;
                        <el-select
                          v-model="item.censusVal"
                          style="width:140px;"
                        >
                          <el-option
                            v-for="(x, i) in cycle"
                            :key="i"
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
                          <el-input-number
                            class="input-style-dis"
                            v-model="item.number"
                            controls-position="right"
                            :min="0"
                            :max="item.max"
                          ></el-input-number>
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
                        <div v-if="formWrite.satisfyVal === 0">
                          <span>then</span>&nbsp;
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
                          <el-popover
                            placement="top"
                            width="360"
                            trigger="hover"
                          >
                            <div>
                              <p>
                                重複通知：可以設置告警發生24小時內重複發送通知；超過24小時，每天告警壹次，超過72小時，不再發送告警通知。
                              </p>
                              <p style="margin-top:5px;">
                                周期指數遞增通知:
                                告警持續時長到達告警統計周期的1，2，4，8，16，32...倍時發送告警通知
                              </p>
                            </div>
                            <i
                              class="el-icon-info"
                              style="color:#888; margin:0 5px;"
                              slot="reference"
                            ></i>
                          </el-popover>
                        </div>
                      </div>
                      <i
                        v-if="formWrite.arr.length !== 1"
                        class="el-icon-error"
                        style="color:#888; margin:10px 5px;"
                        @click="delZhibiao(index)"
                      ></i>
                    </li>
                    <a @click="addZhibiao()">添加</a>
                    <div v-if="formWrite.satisfyVal === 1">
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
                            重複通知：可以設置告警發生24小時內重複發送通知；超過24小時，每天告警壹次，超過72小時，不再發送告警通知。
                          </p>
                          <p style="margin-top:5px;">
                            周期指數遞增通知:
                            告警持續時長到達告警統計周期的1，2，4，8，16，32...倍時發送告警通知
                          </p>
                        </div>
                        <i
                          class="el-icon-info"
                          style="color:#888; margin:0 5px;"
                          slot="reference"
                        ></i>
                      </el-popover>
                    </div>
                  </ul>
                </div>
                <!-- <div v-if="basicNews.EventConfig">
                  <p>
                    <el-checkbox v-model="formWrite.checkedGaojing">
                      事件告警
                      <el-popover placement="right" trigger="hover">
                        <div>
                          <p>各事件規則<a href="javascript:;">詳情</a></p>
                        </div>
                        <i
                          class="el-icon-info"
                          style="color:#888; margin:0 5px;"
                          slot="reference"
                        ></i>
                      </el-popover>
                    </el-checkbox>
                  </p>
                  <ul class="ul-one">
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
                        v-if="formWrite.gaoArr.length !== 1"
                        class="el-icon-error"
                        style="color:#888; margin:0 5px;"
                        @click="delShijian(x)"
                      ></i>
                    </li>
                    <a @click="addShijian">添加</a>
                  </ul>
                </div> -->
              </div>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="GaoJingKeepBtn">保 存</el-button>
        <el-button @click="dialogEditGaojing = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 告警對象編輯 -->
    <el-dialog
      title="編輯告警對象"
      :visible.sync="dialogEditObject"
      width="1024px"
    >
      <div class="edit-alarm-object">
        <el-radio-group v-model="editAlarmObjectRadio">
          <p><el-radio label="1">全部對象</el-radio></p>
          <p>
            <el-radio label="2"
              >選擇部分對象
              <!-- (已選{{ multipleSelection.length }}個) -->
            </el-radio>
          </p>
          <p><el-radio label="3">選擇實例組</el-radio></p>
        </el-radio-group>
        <div class="table" v-if="editAlarmObjectRadio == 2">
          <CamTransferCpt
            :productData="productListData"
            v-on:projectId="projectIds"
            v-on:searchParam="searchParams"
            v-on:multipleSelection="selectDatas"
            :isShowRight="isShowRight"
            v-loading="loading"
            v-on:CAM_loading="CAM_loading"
          ></CamTransferCpt>
        </div>
        <div class="table" v-if="editAlarmObjectRadio == 3">
          <el-select v-model="InstanceGroup" style="width:100px;">
            <el-option
              v-for="item in InstanceGroupOpt"
              :key="item.InstanceGroupId"
              :label="item.GroupName"
              :value="item.InstanceGroupId"
              label-width="40px"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="EditObjectSave()">保 存</el-button>
        <el-button @click="dialogEditObject = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 告警對象-新增對象 -->
    <el-dialog
      title="關聯告警對象"
      :visible.sync="alarmObjectNews"
      width="1024px"
    >
      <div class="edit-alarm-object-news">
        <p>選擇部分對象</p>
        <div class="table">
          <CamTransferCpt
            :productData="productListData"
            v-on:projectId="projectIds"
            v-on:searchParam="searchParams"
            v-on:multipleSelection="selectDatas"
            :isShowRight="isShowRight"
            v-loading="loading"
            v-on:CAM_loading="CAM_loading"
          ></CamTransferCpt>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="EditObjectSave()">保 存</el-button>
        <el-button @click="alarmObjectNews = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 告警對象移出 -->
    <el-dialog
      :title="alarmObjecTitle"
      :visible.sync="alarmObjectRemovalVisible"
      width="500px"
      custom-class="tke-dialog"
    >
      <div class="edit-dialog">
        解除後，將不會收到告警
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="AlarmObjectRemovalSure"
          >解除</el-button
        >
        <el-button @click="alarmObjectRemovalVisible = false">取消</el-button>
      </div>
    </el-dialog>
    <!-- 告警對象全部移出 -->
    <el-dialog
      title="確定解除當前地域下所有實例？"
      :visible.sync="alarmObjectRemovalAllVisible"
      width="500px"
      custom-class="tke-dialog"
    >
      <div class="edit-dialog">
        解除後，將不會收到告警
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="AlarmObjectRemovalAllSure"
          >全部解除</el-button
        >
        <el-button @click="alarmObjectRemovalAllVisible = false"
          >取消</el-button
        >
      </div>
    </el-dialog>
    <!-- 告警接收對象 編輯 -->
    <el-dialog
      title="告警接收對象"
      :visible.sync="editReceiveObjectVisuble"
      width="800px"
      custom-class="tke-dialog"
    >
      <div class="edit-receive-object">
        <p>您可到訪問管理控制台修改用戶和用戶組信息</p>
        <div>
          <Cam @camClick="camFun"></Cam>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="EditReceiveSave">保存</el-button>
        <el-button @click="editReceiveObjectVisuble = false">取消</el-button>
      </div>
    </el-dialog>
    <!-- 回調接口 -->
    <el-dialog
      title="回調接口"
      :visible.sync="callbackInterface"
      width="550px"
      class="callback-dialog-box"
    >
      <div class="callback-interface-box">
        <div class="text-http">
          <el-select
            v-model="httpVal"
            placeholder="請選擇"
            @change="HttpTypeChange"
          >
            <el-option
              v-for="item in httpOpt"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-input
            v-model="httpInput"
            placeholder="例如：www.com:8080/callback"
            @focus="HttpHistroy"
            @blur="HttpHistroyBlur"
            class="input-http"
            @input="HttpHistruyInput"
          ></el-input>
          <ul v-if="httpShow" @mouseleave="leave()">
            <li
              v-for="(item, index) in httpOption"
              :key="index"
              @click="HttpSelect(item)"
            >
              <p>
                {{
                  item.Url.substring(
                    item.Url.lastIndexOf("/") + 1,
                    item.Url.length
                  )
                }}
                <span>{{ item.ValidFlag == 0 ? "" : "驗證超時" }}</span>
              </p>
            </li>
            <li v-if="httpOption.length === 0">
              無數據
            </li>
          </ul>
        </div>
        <p>
          填寫公網可訪問到的url作爲回調接口地址(域名或IP[:端口][/path])，雲監控將及時把告警信息推送到該地址。
        </p>
        <div class="bg-box">
          <p>
            回調域名通過驗證後生效，請于Response Body中返回以下code。
            <el-tooltip
              effect="light"
              content="觸發驗證後推送請求三次，每次3s，累計9s未成功返回即驗證超時。"
              placement="top"
              ><i class="el-icon-info"></i>
            </el-tooltip>
          </p>
          <span>{{ httpCode }}</span>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="CallBackSave(1)">保 存</el-button>
        <el-button @click="callbackInterface = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 告警對象 解除綁定 -->
    <el-dialog
      title="確定解綁告警策略"
      :visible.sync="unBindingInstance"
      width="600px"
      custom-class="tke-dialog"
    >
      <div>
        解綁後，策略將不再對實例分組生效
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="UnBindingInstance"
          >確定解綁</el-button
        >
        <el-button @click="unBindingInstance = false">取消</el-button>
      </div>
    </el-dialog>
    <!-- 告警接收對象 解除 -->
    <el-dialog
      :title="relieveTitle"
      :visible.sync="relieveDialogVisible"
      width="600px"
      custom-class="tke-dialog"
    >
      <div>
        確認解除告警接收人關聯
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="Receive">確定</el-button>
        <el-button @click="relieveDialogVisible = false">取消</el-button>
      </div>
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
  CM_ALARM_RECEIVE_OBJECT_GetGroup,
  CM_CALLBACK,
  CM_ALARM_TRIGGER_CONDITION,
  CM_ALARM_RECEIVE_OBJECT_RELIEVE,
  CM_ALARM_TRIGGER_MODIFY,
  TKE_EXIST_NODES,
  CM_GROUPING_NEWLY_BUILD,
  VPN_LIST,
  DISK_LIST,
  VPNTD_LIST,
  NAT_LIST,
  DCG_LIST,
  NETIP_LIST,
  MYSQL_LIST,
  REDIS_LIST,
  Private_LIST,
  Physics_LIST,
  OBJ_LIST,
  CM_ALARM_OBJECT_LIST_EDIT,
  CM_GROUPING_LIST,
  CM_GROUPING_ALARM_START,
  CM_GROUPING_UNBINDING,
  CM_CALLBACK_HISTORY,
  CM_CALLBACK_SAVE,
  CM_CALLBACK_Verify
} from "@/constants";
import ProductTypeCpt from "@/views/CM/CM_assembly/product_type";
import CamTransferCpt from "@/views/CM/CM_assembly/CamTransferCpt";
import Cam from "@/views/CM/CM_assembly/Cam";
import moment from "moment";
var project = [];
var _ReceiverUserList = [];
export default {
  data() {
    return {
      backShow: true,
      httpOpt: [
        {
          value: "http",
          label: "http"
        },
        {
          value: "https",
          label: "https"
        }
      ],
      httpVal: "http",
      httpShow: false,
      httpOption: [],
      httpOption1: [],
      httpOption2: [],
      httpOption3: [],
      httpCodes: "",
      httpCode: "",
      httpInput: "",
      basicNews: "",
      editName: "",
      GroupName: "",
      ReceiverInfos: [],
      Remark: "",
      project,
      _ReceiverUserList,
      editBeizhuFlag: false,
      dialogFormVisible: false, //基本信息组件弹框
      dialogEditGaojing: false, //编辑告警弹框组件
      dialogEditObject: false, //编辑告警弹框组件
      formLabelWidth: "120px",
      modifyNameDialogVisible: false,
      tipsShow: false,
      modifyRemarksDialogVisible: false,
      remarksVal: "",
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
      alarmInstanceLond: true,
      receivingObjectData: [],
      receiving: [],
      callbackInterface: false,
      //分頁
      total: 0, //總條數
      pageSize: 10, // 分頁條數
      pageIndex: 0, // 當前頁碼
      // 告警對象
      alarmObjectNews: false,
      alarmObjectRemovalVisible: false,
      alarmObjecTitle: "確定解除與該告警對象的關聯？",
      UniqueId: "",
      alarmObjectRemovalAllVisible: false,
      // 修改觸發條件
      nameVal: "",
      triggerCondition: [],
      describeContactListLength: "",
      // 告警接收對象
      relieveDialogVisible: false,
      relieveTitle: "",
      remove: "",
      receivingObjectLoad: true,
      describeContactList: [],
      // 編輯告警觸發條件
      gaoJingLoading: true,
      gaoJingLoading1: true,
      Conditions: [],
      ViewName: this.$route.query.viewName,
      cycle: [
        {
          value: 60,
          label: "統計周期1分鍾"
        },
        {
          value: 300,
          label: "統計周期5分鍾"
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
      alarmNotifyPeriodVal: "",
      AlarmNotifyPeriod: [],

      formWrite: {
        checkedZhibiao: true,
        satisfyVal: 0,
        checkedGaojing: true,
        warningVal: 86400,
        index: 0,
        gaoIndex: 0,
        arr: [
          {
            max: 100,
            typeVal: "",
            censusVal: 60,
            calcTypeVal: "1",
            number: 0,
            unit: "%",
            continuousCycleVal: 1,
            warningVal: 0
          }
        ],
        gaoArr: [
          {
            eventVal: "1"
          }
        ]
      },
      typeOpt: [],
      continuousCycleOpt: [
        {
          value: 1,
          label: "持續1個周期"
        },
        {
          value: 2,
          label: "持續2個周期"
        },
        {
          value: 3,
          label: "持續3個周期"
        },
        {
          value: 4,
          label: "持續4個周期"
        },
        {
          value: 5,
          label: "持續5個周期"
        }
      ],
      warningOpt: [
        {
          value: 0,
          label: "不重複"
        },
        {
          value: 300,
          label: "每5分鍾警告壹次"
        },
        {
          value: 600,
          label: "每10分鍾警告壹次"
        },
        {
          value: 900,
          label: "每15分鍾警告壹次"
        },
        {
          value: 1800,
          label: "每30分鍾警告壹次"
        },
        {
          value: 3600,
          label: "每1小時警告壹次"
        },
        {
          value: 7200,
          label: "每2小時警告壹次"
        },
        {
          value: 10800,
          label: "每3小時警告壹次"
        },
        {
          value: 21600,
          label: "每6小時警告壹次"
        },
        {
          value: 43200,
          label: "每12小時警告壹次"
        },
        {
          value: 86400,
          label: "每1天警告壹次"
        },
        {
          value: 60,
          label: "周期指數遞增"
        }
      ],
      eventOpt: [
        {
          value: "1",
          label: "磁盤只讀"
        },
        {
          value: "2",
          label: "內核故障"
        },
        {
          value: "3",
          label: "內存oom"
        },
        {
          value: "4",
          label: "ping不可達"
        },
        {
          value: "5",
          label: "機器重啓"
        },
        {
          value: "6",
          label: "外網出帶寬超限導致丟包"
        },
        {
          value: "7",
          label: "agent上報超時"
        },
        {
          value: "8",
          label: "子機nvme設備error"
        }
      ],
      productListData: {},
      projectId: 0,
      searchParam: {},
      productData: {},
      isShow: false,
      loadShow: true,
      isShowRight: true,
      editAlarmObjectRadio: "2",
      InstanceGroup: "",
      InstanceGroupShow: "",
      InstanceGroupOpt: [],
      retract: true,
      unBindingInstance: false,
      Offset: 0,
      editReceiveObjectVisuble: false,
      Verification: true,
      loading: true,
      cam: {} // cam組件的值
    };
  },
  components: { Header, CamTransferCpt, ProductTypeCpt, Cam },
  mounted() {
    this.DetailsInit();
    this.Project();
    // 告警對象列表
    this.AlarmObjectList();
    this.AlarmTriggerCondition();
    this.GaoJingGrouping();
    this.HttpInit();
  },
  methods: {
    passData(data) {
      this.isShow = false;
      this.productListData = data;
      this.typeOpt = data.Metrics;
      setTimeout(() => {
        this.productListData = {};
        // this.isShow = true;
      }, 500);
      setTimeout(() => {
        this.productListData = data;
        // this.isShow = true;
      }, 600);
      this.gaoJingLoading = false;
      this.gaoJingLoading1 = false;
    },
    projectIds(data) {
      this.projectId = data;
    },
    searchParams(data) {
      this.searchParam = data;
    },
    Type_loading(val) {
      this.loading = val;
    },
    CAM_loading(val) {
      this.loading = val;
    },
    //選擇右側表格數據
    selectDatas(val) {
      console.log(val);
      this.multipleSelection = val;
    },
    async DetailsInit() {
      let params = {
        Version: "2018-07-24",
        Module: "monitor",
        GroupId: this.$route.query.groupId
      };
      await this.axios.post(CM_ALARM_STRATEGY_DETAILS, params).then(res => {
        if (res.Response.Error === undefined) {
          this.basicNews = res.Response;
          console.log(this.basicNews);
          this.ViewName = this.basicNews.ViewName;
          this.GroupName = this.basicNews.GroupName;
          this.projectId = this.basicNews.ProjectId;
          this.receivingObjectLoad = true;
          this.Offset = 0;
          this.receivingObjectData = [];
          _ReceiverUserList = [];
          if (this.basicNews.ReceiverInfos !== undefined) {
            this.ReceiverInfos = this.basicNews.ReceiverInfos[0];
            if (this.ReceiverInfos.ReceiverType === "group") {
              _ReceiverUserList = this.basicNews.ReceiverInfos[0]
                .ReceiverGroupList;
              for (let i in _ReceiverUserList) {
                let params = {
                  Version: "2019-01-16",
                  GroupId: _ReceiverUserList[i]
                };
                this.axios
                  .post(CM_ALARM_RECEIVE_OBJECT_GetGroup, params)
                  .then(res => {
                    if (res.Response.Error === undefined) {
                      this.receivingObjectData.push(res.Response);
                      this.receivingObjectLoad = false;
                      console.log(
                        "this.receivingObjectData",
                        this.receivingObjectData
                      );
                    } else {
                      let ErrTips = {
                        FailedOperation: "操作失敗。",
                        InternalError: "內部錯誤。",
                        InvalidParameter: "參數錯誤。",
                        LimitExceeded: "超過配額限制。",
                        MissingParameter: "缺少參數錯誤。",
                        ResourceInUse: "資源被占用。",
                        ResourceInsufficient: "資源不足。",
                        ResourceNotFound: "資源不存在。",
                        ResourceUnavailable: "資源不可用。",
                        UnauthorizedOperation: "未授權操作。",
                        UnknownParameter: "未知參數錯誤。",
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
              }
            } else {
              _ReceiverUserList = this.basicNews.ReceiverInfos[0]
                .ReceiverUserList;
              this.describeContactList = [];
              this.receivingObjectLoad = true;
              // var setTime = setInterval(() => {
              this.receivingObjectData = [];
              var arr = [];
              this.Offset++;
              let params = {
                Version: "2018-07-24",
                Module: "monitor",
                Limit: 100,
                Offset: 1
              };
              this.axios
                .post(CM_ALARM_RECEIVE_OBJECT_LIST, params)
                .then(res => {
                  if (res.Response.Error === undefined) {
                    arr = res.Response.List;
                    this.describeContactListLength = res.Response.TotalNum;
                    for (let i in arr) {
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
                    this.receivingObjectLoad = false;
                    console.log(
                      "this.receivingObjectData",
                      this.receivingObjectData
                    );
                    // if (
                    //   this.Offset ==
                    //   Math.ceil(Number(this.describeContactListLength) / 100)
                    // ) {
                    //   console.log(
                    //     Number(this.describeContactListLength / 100)
                    //   );
                    //   clearInterval(setTime);
                    //   this.receivingObjectLoad = false;
                    //   return false;
                    // }
                  } else {
                    let ErrTips = {
                      FailedOperation: "操作失敗。",
                      InternalError: "內部錯誤。",
                      InvalidParameter: "參數錯誤。",
                      LimitExceeded: "超過配額限制。",
                      MissingParameter: "缺少參數錯誤。",
                      ResourceInUse: "資源被占用。",
                      ResourceInsufficient: "資源不足。",
                      ResourceNotFound: "資源不存在。",
                      ResourceUnavailable: "資源不可用。",
                      UnauthorizedOperation: "未授權操作。",
                      UnknownParameter: "未知參數錯誤。",
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
              // }, 1000);
            }
          } else {
            this.receivingObjectData = [];
            this.receivingObjectLoad = false;
          }
        } else {
          let ErrTips = {
            "AuthFailure.UnauthorizedOperation":
              "請求未授權。請參考 CAM 文檔對鑒權的說明。",
            DryRunOperation:
              "DryRun 操作，代表請求將會是成功的，只是多傳了 DryRun 參數。",
            FailedOperation: "	操作失敗。",
            "FailedOperation.AlertFilterRuleDeleteFailed": "刪除過濾條件失敗。",
            "FailedOperation.AlertPolicyCreateFailed": "創建告警策略失敗。",
            "FailedOperation.AlertPolicyDeleteFailed": "告警策略刪除失敗。",
            "FailedOperation.AlertPolicyDescribeFailed": "告警策略查詢失敗。",
            "FailedOperation.AlertPolicyModifyFailed": "告警策略修改失敗。",
            "FailedOperation.AlertTriggerRuleDeleteFailed":
              "刪除觸發條件失敗。",
            "FailedOperation.DbQueryFailed": "數據庫查詢失敗。",
            "FailedOperation.DbRecordCreateFailed": "創建數據庫記錄失敗。",
            "FailedOperation.DbRecordDeleteFailed": "數據庫記錄刪除失敗。",
            "FailedOperation.DbRecordUpdateFailed": "數據庫記錄更新失敗。",
            "FailedOperation.DbTransactionBeginFailed": "數據庫事務開始失敗。",
            "FailedOperation.DbTransactionCommitFailed": "數據庫事務提交失敗。",
            "FailedOperation.DimQueryRequestFailed": "請求維度查詢服務失敗。",
            "FailedOperation.DruidQueryFailed": "查詢分析數據失敗。",
            "FailedOperation.DuplicateName": "名字重複。",
            "FailedOperation.ServiceNotEnabled":
              "服務未啓用，開通服務後方可使用。",
            InternalError: "內部錯誤。",
            "InternalError.ExeTimeout": "執行超時。",
            InvalidParameter: "參數錯誤。",
            "InvalidParameter.InvalidParameter": "參數錯誤。",
            "InvalidParameter.InvalidParameterParam": "參數錯誤。",
            InvalidParameterValue: "無效的參數值。",
            LimitExceeded: "超過配額限制。",
            "LimitExceeded.MetricQuotaExceeded":
              "指標數量達到配額限制，禁止含有未注冊指標的請求。",
            MissingParameter: "	缺少參數錯誤。",
            ResourceInUse: "資源被占用。",
            ResourceInsufficient: "資源不足。",
            ResourceNotFound: "資源不存在。",
            ResourceUnavailable: "資源不可用。",
            ResourcesSoldOut: "資源售罄。",
            UnauthorizedOperation: "未授權操作。",
            UnknownParameter: "未知參數錯誤。",
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
    // 項目
    Project() {
      this.axios.get(ALL_PROJECT).then(res => {
        if (res.codeDesc === "Success") {
          var arr = res.data;
          project = arr;
        } else {
          let ErrTips = {
            InternalError: "內部錯誤",
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

    EditTips() {
      if (this.GroupName == "") {
        this.tipsShow = true;
      } else {
        this.tipsShow = false;
      }
    },
    // 編輯告警對象
    editObject() {
      this.multipleSelection = [];
      this.dialogEditObject = true;
    },
    AlarmObjectNews() {
      this.alarmObjectNews = true;
      this.editAlarmObjectRadio = "2";
    },
    // 選擇實例組
    GaoJingGrouping() {
      let param = {
        Version: "2018-07-24",
        Module: "monitor",
        Limit: 100,
        Offset: 0,
        ViewName: this.ViewName
      };
      this.axios.post(CM_GROUPING_LIST, param).then(res => {
        if (res.Response.Error === undefined) {
          this.InstanceGroupOpt = res.Response.InstanceGroupList;
          if (res.Response.Total > 0) {
            this.InstanceGroup =
              res.Response.InstanceGroupList[0].InstanceGroupId;
          }
        } else {
          let ErrTips = {
            FailedOperation: "操作失敗。",
            InternalError: "內部錯誤。",
            "InternalError.ExeTimeout": "執行超時。",
            InvalidParameter: "參數錯誤。",
            "InvalidParameter.InvalidParameter": "參數錯誤。",
            "InvalidParameter.InvalidParameterParam": "參數錯誤。",
            InvalidParameterValue: "無效的參數值。",
            LimitExceeded: "超過配額限制。",
            MissingParameter: "缺少參數錯誤。",
            UnknownParameter: "未知參數錯誤。",
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
    EditObjectSave() {
      let param = {
        GroupId: this.$route.query.groupId,
        Version: "2018-07-24",
        Module: "monitor"
      };
      if (this.editAlarmObjectRadio != 3) {
        if (this.editAlarmObjectRadio == 1) {
          this.multipleSelection = this.productListData.Date;
        }
        for (let i in this.multipleSelection) {
          param["Dimensions." + i + ".Region"] = "tpe";
          if (this.ViewName === "cvm_device") {
            param["Dimensions." + i + ".Dimensions"] = {
              unInstanceId: this.multipleSelection[i].InstanceId
            };
            param["Dimensions." + i + ".EventDimensions"] = {
              uuid: this.multipleSelection[i].Uuid
            };
          } else if (this.ViewName === "BS") {
            param["InstanceList." + i + ".Dimensions"] = {
              diskid: this.multipleSelection[i].DiskId
            };
          } else if (this.ViewName === "vpn_tunnel") {
            param["Dimensions." + i + ".Dimensions"] = {
              uniqVpnconnId: this.multipleSelection[i].VpnConnectionId
            };
          } else if (this.ViewName === "VPN_GW") {
            param["Dimensions." + i + ".Dimensions"] = {
              vip: this.multipleSelection[i].PublicIpAddress
            };
            param["Dimensions." + i + ".EventDimensions"] = {
              VpnGatewayId: this.multipleSelection[i].VpnGatewayId
            };
          } else if (this.ViewName === "vpn_tunnel") {
            param["Dimensions." + i + ".Dimensions"] = {
              uniqVpnconnId: this.multipleSelection[i].VpnConnectionId
            };
          } else if (this.ViewName === "nat_tc_stat") {
            param["Dimensions." + i + ".Dimensions"] = {
              uniq_nat_id: this.multipleSelection[i].NatGatewayId
            };
            param["Dimensions." + i + ".EventDimensions"] = {
              instanceId: this.multipleSelection[i].NatGatewayId
            };
          } else if (this.ViewName === "DC_GW") {
            param["Dimensions." + i + ".Dimensions"] = {
              directconnectgatewayid: this.multipleSelection[i]
                .DirectConnectGatewayId
            };
            param["Dimensions." + i + ".EventDimensions"] = {
              instanceId: this.multipleSelection[i].DirectConnectGatewayId
            };
          } else if (this.ViewName === "EIP") {
            param["Dimensions." + i + ".Dimensions"] = {
              vip: this.multipleSelection[i].AddressIp
            };
          } else if (this.ViewName === "cdb_detail") {
            param["Dimensions." + i + ".Dimensions"] = {
              uInstanceId: this.multipleSelection[i].InstanceId
            };
            param["Dimensions." + i + ".EventDimensions"] = {
              InstanceId: this.multipleSelection[i].InstanceId
            };
          } else if (this.ViewName === "REDIS-CLUSTER") {
            param["Dimensions." + i + ".Dimensions"] = {
              instanceid: this.multipleSelection[i].InstanceId
            };
            param["Dimensions." + i + ".EventDimensions"] = {
              instanceid: this.multipleSelection[i].InstanceId
            };
          } else if (this.ViewName === "dcchannel") {
            param["Dimensions." + i + ".Dimensions"] = {
              directconnecttunnelid: this.multipleSelection[i]
                .DirectConnectTunnelId
            };
          } else if (this.ViewName === "dcline") {
            param["Dimensions." + i + ".Dimensions"] = {
              directconnectid: this.multipleSelection[i].DirectConnectId
            };
          } else if (this.ViewName === "COS") {
            param["Dimensions." + i + ".Dimensions"] = {
              bucket: this.multipleSelection[i].Name
            };
          }
        }
      } else {
        param["InstanceGroupId"] = this.InstanceGroup;
      }
      this.axios.post(CM_ALARM_OBJECT_LIST_EDIT, param).then(res => {
        if (res.Response.Error === undefined) {
          this.dialogEditObject = false;
          this.alarmObjectNews = false;
          this.AlarmObjectList();
        } else {
          let ErrTips = {
            FailedOperation: "操作失敗。",
            InternalError: "內部錯誤。",
            "InternalError.ExeTimeout": "執行超時。",
            InvalidParameter: "參數錯誤。",
            "InvalidParameter.InvalidParameter": "參數錯誤。",
            "InvalidParameter.InvalidParameterParam": "參數錯誤。",
            InvalidParameterValue: "無效的參數值。",
            LimitExceeded: "超過配額限制。",
            MissingParameter: "缺少參數錯誤。",
            UnknownParameter: "未知參數錯誤。",
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
    editGaoJing() {
      // 編輯告警觸發條件
      this.dialogEditGaojing = true;
      console.log(this.basicNews);
      if (this.basicNews.ConditionsTemp) {
        this.radioChufa = "1";
      } else {
        this.formWrite.satisfyVal = this.basicNews.IsUnionRule;
        if (this.basicNews.ConditionsConfig) {
          var _ConditionsConfig = this.basicNews.ConditionsConfig;
          var _typeVal = "";
          var _max = "";
          var _AlarmNotifyPeriod = "";
          this.formWrite.arr = [];
          for (let i in _ConditionsConfig) {
            for (let j in this.typeOpt) {
              if (
                _ConditionsConfig[i].MetricShowName ===
                this.typeOpt[j].MetricShowName
              ) {
                _typeVal = this.typeOpt[j].MetricId;
                _max = Math.floor(this.typeOpt[j].ConfigManual.CalcValue.Max);
              }
            }

            if (_ConditionsConfig[i].AlarmNotifyType == 1) {
              _AlarmNotifyPeriod = 60;
            } else {
              _AlarmNotifyPeriod = _ConditionsConfig[i].AlarmNotifyPeriod;
            }
            console.log(_AlarmNotifyPeriod);
            this.formWrite.arr.push({
              max: _max,
              typeVal: _typeVal,
              censusVal: _ConditionsConfig[i].Period,
              calcTypeVal: _ConditionsConfig[i].CalcType.toString(),
              number: _ConditionsConfig[i].CalcValue,
              unit: _ConditionsConfig[i].Unit,
              continuousCycleVal:
                Number(_ConditionsConfig[i].ContinueTime) /
                Number(_ConditionsConfig[i].Period),
              warningVal: _AlarmNotifyPeriod
            });
          }
        }
      }
    },
    // 告警觸發條件
    AlarmTriggerCondition() {
      let param = {
        Version: "2018-07-24",
        Module: "monitor",
        ViewName: this.ViewName
      };
      this.axios.post(CM_ALARM_TRIGGER_CONDITION, param).then(res => {
        if (res.Response.Error === undefined) {
          this.triggerCondition = res.Response.TemplateGroupList;
          if (this.basicNews.ConditionsTemp) {
            this.nameVal = this.basicNews.ConditionsTemp.GroupId;
            this.alarmNotifyPeriodVal = this.triggerCondition[0].Conditions[0].AlarmNotifyPeriod;
          } else {
            this.nameVal =
              this.triggerCondition.length === 0
                ? "當前策略下沒有觸發條件模板"
                : this.triggerCondition[0].GroupID;
          }

          this.TriggerChange();
        } else {
          let ErrTips = {
            "AuthFailure.UnauthorizedOperation":
              "請求未授權。請參考 CAM 文檔對鑒權的說明。",
            DryRunOperation:
              "DryRun 操作，代表請求將會是成功的，只是多傳了 DryRun 參數。",
            FailedOperation: "操作失敗。",
            "FailedOperation.AlertFilterRuleDeleteFailed": "刪除過濾條件失敗。",
            "FailedOperation.AlertPolicyCreateFailed": "創建告警策略失敗。",
            "FailedOperation.AlertPolicyDeleteFailed": "告警策略刪除失敗。",
            "FailedOperation.AlertPolicyDescribeFailed": "告警策略查詢失敗。",
            "FailedOperation.AlertPolicyModifyFailed": "告警策略修改失敗。",
            "FailedOperation.AlertTriggerRuleDeleteFailed":
              "刪除觸發條件失敗。",
            "FailedOperation.DbQueryFailed": "數據庫查詢失敗。",
            "FailedOperation.DbRecordCreateFailed": "創建數據庫記錄失敗。",
            "FailedOperation.DbRecordDeleteFailed": "數據庫記錄刪除失敗。",
            "FailedOperation.DbRecordUpdateFailed": "數據庫記錄更新失敗。",
            "FailedOperation.DbTransactionBeginFailed": "數據庫事務開始失敗。",
            "FailedOperation.DbTransactionCommitFailed": "數據庫事務提交失敗。",
            "FailedOperation.DimQueryRequestFailed": "	請求維度查詢服務失敗。",
            "FailedOperation.DruidQueryFailed": "查詢分析數據失敗。",
            "FailedOperation.DuplicateName": "名字重複。",
            "FailedOperation.ServiceNotEnabled":
              "服務未啓用，開通服務後方可使用。",
            InternalError: "內部錯誤。",
            "InternalError.ExeTimeout": "執行超時。",
            InvalidParameter: "參數錯誤。",
            "InvalidParameter.InvalidParameter": "參數錯誤。",
            "InvalidParameter.InvalidParameterParam": "參數錯誤。",
            InvalidParameterValue: "無效的參數值。",
            LimitExceeded: "超過配額限制。",
            "LimitExceeded.MetricQuotaExceeded":
              "指標數量達到配額限制，禁止含有未注冊指標的請求。",
            MissingParameter: "缺少參數錯誤。",
            ResourceInUse: "資源被占用。",
            ResourceInsufficient: "資源不足。",
            ResourceNotFound: "資源不存在。",
            ResourceUnavailable: "資源不可用。",
            ResourcesSoldOut: "資源售罄。",
            UnauthorizedOperation: "未授權操作。",
            UnknownParameter: "未知參數錯誤。",
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
    TriggerChange() {
      this.ContinueTime = [];
      var _AlarmNotifyPeriod = [];
      for (let i in this.triggerCondition) {
        if (this.triggerCondition[i].GroupID == this.nameVal) {
          this.Conditions = this.triggerCondition[i];
        }
      }
      console.log(this.Conditions.Conditions);
      for (let j in this.Conditions.Conditions) {
        this.ContinueTime.push({
          value: this.Conditions.Conditions[j].ContinueTime,
          label:
            "持續" +
            Number(this.Conditions.Conditions[j].ContinueTime) /
              Number(this.Conditions.Conditions[j].Period) +
            "個周期"
        });
        console.log(this.Conditions.Conditions[j].AlarmNotifyType);
        if (this.Conditions.Conditions[j].AlarmNotifyType == 1) {
          this.Conditions.Conditions[j].AlarmNotifyPeriod = "周期指数递增";
        } else {
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
                  this.Conditions.Conditions[j].AlarmNotifyPeriod /
                    60 /
                    60 /
                    24 +
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
      }
      let newobj = {};
      this.ContinueTime = this.ContinueTime.reduce((preVal, curVal) => {
        newobj[curVal.value]
          ? ""
          : (newobj[curVal.value] = preVal.push(curVal));
        return preVal;
      }, []);
      let obj = {};
      this.AlarmNotifyPeriod = this.AlarmNotifyPeriod.reduce(
        (preVal, curVal) => {
          obj[curVal.value] ? "" : (obj[curVal.value] = preVal.push(curVal));
          return preVal;
        },
        []
      );
    },
    // 告警觸發條件保存
    GaoJingKeepBtn() {
      let param = {
        Version: "2018-07-24",
        Module: "monitor",
        GroupId: this.$route.query.groupId,
        ViewName: this.ViewName,
        GroupName: this.GroupName
      };
      let _Conditions = this.Conditions.Conditions;
      console.log(_Conditions);
      let _EventConfig = this.Conditions.EventConditions;
      let _arr = this.formWrite.arr;
      let _gaoArr = this.formWrite.gaoArr;
      if (this.radioChufa == 1) {
        param["IsUnionRule"] = this.Conditions.IsUnionRule;
        for (let i in _Conditions) {
          param["Conditions." + i + ".MetricId"] = _Conditions[i].MetricID;
          param["Conditions." + i + ".CalcType"] = _Conditions[i].CalcType;
          param["Conditions." + i + ".CalcValue"] = Number(
            _Conditions[i].CalcValue
          );
          param["Conditions." + i + ".CalcPeriod"] = _Conditions[i].Period;
          param["Conditions." + i + ".ContinuePeriod"] =
            Number(_Conditions[i].ContinueTime) / Number(_Conditions[i].Period);
          param["Conditions." + i + ".AlarmNotifyType"] =
            _Conditions[i].AlarmNotifyType;
          param["Conditions." + i + ".AlarmNotifyPeriod"] =
            _Conditions[i].AlarmNotifyPeriod;
          // param["Conditions." + i + ".RuleId"] = _Conditions[i].RuleID;
        }
        for (let j in _EventConfig) {
          param["EventConditions." + j + ".EventId"] = Number(
            _EventConfig[j].EventID
          );
          param["EventConditions." + j + ".AlarmNotifyType"] =
            _EventConfig[j].AlarmNotifyType;
          param["EventConditions." + j + ".AlarmNotifyPeriod"] =
            _EventConfig[j].AlarmNotifyPeriod;
          // param["EventConditions." + j + ".RuleId"] = _EventConfig[j].RuleID;
        }
      } else {
        param["IsUnionRule"] = this.formWrite.satisfyVal;

        for (let i in _arr) {
          param["Conditions." + i + ".MetricId"] = _arr[i].typeVal;
          param["Conditions." + i + ".CalcType"] = _arr[i].calcTypeVal;
          param["Conditions." + i + ".CalcValue"] = _arr[i].number;
          param["Conditions." + i + ".CalcPeriod"] = _arr[i].censusVal;
          param["Conditions." + i + ".ContinuePeriod"] =
            _arr[i].continuousCycleVal;
          if (_arr[i].warningVal == 60) {
            param["Conditions." + i + ".AlarmNotifyType"] = 1;
          } else {
            param["Conditions." + i + ".AlarmNotifyType"] = 0;
          }
          if (this.formWrite.satisfyVal == 0) {
            param["Conditions." + i + ".AlarmNotifyPeriod"] =
              _arr[i].warningVal;
          } else {
            param[
              "Conditions." + i + ".AlarmNotifyPeriod"
            ] = this.formWrite.warningVal;
          }
        }
      }
      // for (let j in _gaoArr) {
      //   param["EventConditions." + j + ".EventId"] = Number(
      //     _gaoArr[j].EventID
      //   );
      //   param["EventConditions." + j + ".AlarmNotifyType"] =
      //     _gaoArr[j].AlarmNotifyType;
      //   param["EventConditions." + j + ".AlarmNotifyPeriod"] =
      //     _gaoArr[j].AlarmNotifyPeriod;
      //   param["EventConditions." + j + ".RuleId"] = _gaoArr[j].RuleID;
      // }

      this.axios.post(CM_ALARM_TRIGGER_MODIFY, param).then(res => {
        if (res.Response.Error === undefined) {
          this.dialogEditGaojing = false;
          console.log(res);
          this.DetailsInit();
        } else {
          let ErrTips = {
            "AuthFailure.UnauthorizedOperation":
              "	請求未授權。請參考 CAM 文檔對鑒權的說明。",
            DryRunOperation:
              "DryRun 操作，代表請求將會是成功的，只是多傳了 DryRun 參數。",
            FailedOperation: "操作失敗。",
            "FailedOperation.AlertFilterRuleDeleteFailed": "刪除過濾條件失敗。",
            "FailedOperation.AlertPolicyCreateFailed": "創建告警策略失敗。",
            "FailedOperation.AlertPolicyDeleteFailed": "告警策略刪除失敗。",
            "FailedOperation.AlertPolicyDescribeFailed": "告警策略查詢失敗。",
            "FailedOperation.AlertPolicyModifyFailed": "告警策略修改失敗。",
            "FailedOperation.AlertTriggerRuleDeleteFailed":
              "刪除觸發條件失敗。",
            "FailedOperation.DbQueryFailed": "數據庫查詢失敗。",
            "FailedOperation.DbRecordCreateFailed": "創建數據庫記錄失敗。",
            "FailedOperation.DbRecordDeleteFailed": "數據庫記錄刪除失敗。",
            "FailedOperation.DbRecordUpdateFailed": "數據庫記錄更新失敗。",
            "FailedOperation.DbTransactionBeginFailed": "數據庫事務開始失敗。",
            "FailedOperation.DbTransactionCommitFailed": "數據庫事務提交失敗。",
            "FailedOperation.DimQueryRequestFailed": "請求維度查詢服務失敗。",
            "FailedOperation.DruidQueryFailed": "查詢分析數據失敗。",
            "FailedOperation.DuplicateName": "名字重複。",
            "FailedOperation.ServiceNotEnabled":
              "服務未啓用，開通服務後方可使用。",
            InternalError: "內部錯誤。",
            "InternalError.ExeTimeout": "執行超時。",
            InvalidParameter: "參數錯誤。",
            "InvalidParameter.InvalidParameter": "參數錯誤。",
            "InvalidParameter.InvalidParameterParam": "參數錯誤。",
            InvalidParameterValue: "無效的參數值。",
            LimitExceeded: "超過配額限制。",
            "LimitExceeded.MetricQuotaExceeded":
              "指標數量達到配額限制，禁止含有未注冊指標的請求。",
            MissingParameter: "缺少參數錯誤。",
            ResourceInUse: "資源被占用。",
            ResourceInsufficient: "資源不足。",
            ResourceNotFound: "資源不存在。",
            ResourceUnavailable: "資源不可用。",
            ResourcesSoldOut: "資源售罄。",
            UnauthorizedOperation: "未授權操作。",
            UnknownParameter: "未知參數錯誤。",
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
    editInfo(name) {
      //編輯備注
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
              message: "修改名稱成功",
              type: "success",
              showClose: true,
              duration: 0
            });
          } else {
            this.$message({
              message: "修改備注成功",
              type: "success",
              showClose: true,
              duration: 0
            });
          }
        } else {
          let ErrTips = {
            FailedOperation: "操作失敗。",
            InternalError: "內部錯誤。",
            "InternalError.ExeTimeout": "執行超時。",
            InvalidParameter: "參數錯誤。",
            "InvalidParameter.InvalidParameter": "參數錯誤。",
            "InvalidParameter.InvalidParameterParam": "參數錯誤。",
            InvalidParameterValue: "無效的參數值。",
            LimitExceeded: "超過配額限制。",
            MissingParameter: "缺少參數錯誤。",
            UnknownParameter: "未知參數錯誤。",
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
    // 告警對象列表
    async AlarmObjectList() {
      this.alarmObjecLoad = true;
      this.alarmInstanceLond = true;
      let param = {
        Version: "2018-07-24",
        Module: "monitor",
        GroupId: this.$route.query.groupId,
        Limit: this.pageSize,
        Offset: this.pageIndex
      };
      await this.$axios.post(CM_ALARM_OBJECT_LIST, param).then(res => {
        if (res.Response.Error === undefined) {
          this.InstanceGroupShow = res.Response;
          console.log(this.InstanceGroupShow);
          var _enterList = res.Response.List;
          this.total = res.Response.Total;
          if (this.total > 0) {
            if (this.ViewName === "cvm_device") {
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
                        if (_enterList[i].IsShielded == 0) {
                          this.alarmObjectData[j]["IsShielded"] = true;
                        } else {
                          this.alarmObjectData[j]["IsShielded"] = false;
                        }
                      }
                    }
                  }
                  console.log("alarmObjectData", this.alarmObjectData);
                  this.alarmObjecLoad = false;
                  this.alarmInstanceLond = false;
                } else {
                  let ErrTips = {
                    FailedOperation: "操作失敗",
                    InternalError: "內部錯誤",
                    "InternalError.Param": "Param。",
                    "InternalError.PublicClusterOpNotSupport":
                      "集群不支持當前操作。",
                    InvalidParameter: "參數錯誤",
                    ResourceNotFound: "資源不存在",
                    ResourceUnavailable: "資源不可用"
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
            } else if (this.ViewName === "BS") {
              let params = {
                Version: "2017-03-12",
                Limit: this.pageSize,
                Offset: this.pageIndex
              };
              params["Filters.0.Name"] = "disk-id";
              for (let i in _enterList) {
                params["Filters.0.Values." + i] = JSON.parse(
                  _enterList[i].Dimensions
                ).diskid;
              }
              this.axios.post(DISK_LIST, params).then(res => {
                if (res.Response.Error === undefined) {
                  this.alarmObjectData = res.Response.DiskSet;
                  for (let i in _enterList) {
                    for (let j in this.alarmObjectData) {
                      if (
                        JSON.parse(_enterList[i].Dimensions).diskid ===
                        this.alarmObjectData[j].DiskId
                      ) {
                        this.alarmObjectData[j]["UniqueId"] =
                          _enterList[i].UniqueId;
                        if (_enterList[i].IsShielded == 0) {
                          this.alarmObjectData[j]["IsShielded"] = true;
                        } else {
                          this.alarmObjectData[j]["IsShielded"] = false;
                        }
                      }
                    }
                  }
                  this.alarmObjecLoad = false;
                  this.alarmInstanceLond = false;
                } else {
                  let ErrTips = {
                    "InvalidVpnGatewayId.Malformed":
                      "無效的VPN網關,VPN實例ID不合法。",
                    "InvalidVpnGatewayId.NotFound":
                      "無效的VPN網關,VPN實例不存在，請再次核實您輸入的資源信息是否正確。"
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
            } else if (this.ViewName === "VPN_GW") {
              let params = {
                Version: "2017-03-12",
                Limit: this.pageSize,
                Offset: this.pageIndex
              };
              params["Filters.0.Name"] = "public-ip-address";
              for (let i in _enterList) {
                params["Filters.0.Values." + i] = JSON.parse(
                  _enterList[i].Dimensions
                ).vip;
              }
              this.axios.post(VPN_LIST, params).then(res => {
                if (res.Response.Error === undefined) {
                  this.alarmObjectData = res.Response.VpnGatewaySet;
                  for (let i in _enterList) {
                    for (let j in this.alarmObjectData) {
                      if (
                        JSON.parse(_enterList[i].Dimensions).vip ===
                        this.alarmObjectData[j].PublicIpAddress
                      ) {
                        this.alarmObjectData[j]["UniqueId"] =
                          _enterList[i].UniqueId;
                        if (_enterList[i].IsShielded == 0) {
                          this.alarmObjectData[j]["IsShielded"] = true;
                        } else {
                          this.alarmObjectData[j]["IsShielded"] = false;
                        }
                      }
                    }
                  }
                  this.alarmObjecLoad = false;
                  this.alarmInstanceLond = false;
                } else {
                  let ErrTips = {
                    "InvalidVpnGatewayId.Malformed":
                      "無效的VPN網關,VPN實例ID不合法。",
                    "InvalidVpnGatewayId.NotFound":
                      "無效的VPN網關,VPN實例不存在，請再次核實您輸入的資源信息是否正確。"
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
            } else if (this.ViewName === "vpn_tunnel") {
              let params = {
                Version: "2017-03-12",
                Limit: this.pageSize,
                Offset: this.pageIndex
              };
              params["Filters.0.Name"] = "vpn-connection-id";
              for (let i in _enterList) {
                params["Filters.0.Values." + i] = JSON.parse(
                  _enterList[i].Dimensions
                ).uniqVpnconnId;
              }
              this.axios.post(VPNTD_LIST, params).then(res => {
                if (res.Response.Error === undefined) {
                  this.alarmObjectData = res.Response.VpnConnectionSet;
                  for (let i in _enterList) {
                    for (let j in this.alarmObjectData) {
                      if (
                        JSON.parse(_enterList[i].Dimensions).uniqVpnconnId ===
                        this.alarmObjectData[j].VpnConnectionId
                      ) {
                        this.alarmObjectData[j]["UniqueId"] =
                          _enterList[i].UniqueId;
                        if (_enterList[i].IsShielded == 0) {
                          this.alarmObjectData[j]["IsShielded"] = true;
                        } else {
                          this.alarmObjectData[j]["IsShielded"] = false;
                        }
                      }
                    }
                  }
                  this.alarmObjecLoad = false;
                  this.alarmInstanceLond = false;
                } else {
                  let ErrTips = {
                    "InvalidParameter.Coexist": "參數不支持同時指定。",
                    "InvalidParameterValue.Malformed": "入參格式不合法。",
                    ResourceNotFound: "	資源不存在。"
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
            } else if (this.ViewName === "nat_tc_stat") {
              let params = {
                Version: "2017-03-12",
                Limit: this.pageSize,
                Offset: this.pageIndex
              };
              params["Filters.0.Name"] = "nat-gateway-id";
              for (let i in _enterList) {
                params["Filters.0.Values." + i] = JSON.parse(
                  _enterList[i].Dimensions
                ).uniq_nat_id;
              }
              this.axios.post(NAT_LIST, params).then(res => {
                if (res.Response.Error === undefined) {
                  this.alarmObjectData = res.Response.NatGatewaySet;
                  for (let i in _enterList) {
                    for (let j in this.alarmObjectData) {
                      if (
                        JSON.parse(_enterList[i].Dimensions).uniq_nat_id ===
                        this.alarmObjectData[j].VpnConnectionId
                      ) {
                        this.alarmObjectData[j]["UniqueId"] =
                          _enterList[i].UniqueId;
                        if (_enterList[i].IsShielded == 0) {
                          this.alarmObjectData[j]["IsShielded"] = true;
                        } else {
                          this.alarmObjectData[j]["IsShielded"] = false;
                        }
                      }
                    }
                  }
                  this.alarmObjecLoad = false;
                  this.alarmInstanceLond = false;
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
            } else if (this.ViewName === "DC_GW") {
              let params = {
                Version: "2017-03-12",
                Limit: this.pageSize,
                Offset: this.pageIndex
              };
              params["Filters.0.Name"] = "direct-connect-gateway-id";
              for (let i in _enterList) {
                params["Filters.0.Values." + i] = JSON.parse(
                  _enterList[i].Dimensions
                ).directconnectgatewayid;
              }
              this.axios.post(DCG_LIST, params).then(res => {
                if (res.Response.Error === undefined) {
                  this.alarmObjectData = res.Response.DirectConnectGatewaySet;

                  for (let i in _enterList) {
                    for (let j in this.alarmObjectData) {
                      if (
                        JSON.parse(_enterList[i].Dimensions)
                          .directconnectgatewayid ===
                        this.alarmObjectData[j].DirectConnectGatewayId
                      ) {
                        this.alarmObjectData[j]["UniqueId"] =
                          _enterList[i].UniqueId;
                        if (_enterList[i].IsShielded == 0) {
                          this.alarmObjectData[j]["IsShielded"] = true;
                        } else {
                          this.alarmObjectData[j]["IsShielded"] = false;
                        }
                      }
                    }
                  }
                  this.alarmObjecLoad = false;
                  this.alarmInstanceLond = false;
                } else {
                  let ErrTips = {
                    "InvalidParameter.Coexist": "參數不支持同時指定。",
                    InvalidParameterValue: "參數值不合法。",
                    "InvalidParameterValue.Malformed": "入參格式不合法。",
                    "InvalidParameterValue.TooLong": "無效參數值。參數值太長。"
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
            } else if (this.ViewName === "EIP") {
              let params = {
                Version: "2017-03-12",
                Limit: this.pageSize,
                Offset: this.pageIndex
              };
              params["Filters.0.Name"] = "address-ip";
              for (let i in _enterList) {
                params["Filters.0.Values." + i] = JSON.parse(
                  _enterList[i].Dimensions
                ).vip;
              }
              this.axios.post(NETIP_LIST, params).then(res => {
                if (res.Response.Error === undefined) {
                  this.alarmObjectData = res.Response.AddressSet;
                  this.total = res.Response.TotalCount;
                  for (let i in _enterList) {
                    for (let j in this.alarmObjectData) {
                      if (
                        JSON.parse(_enterList[i].Dimensions).vip ===
                        this.alarmObjectData[j].AddressIp
                      ) {
                        this.alarmObjectData[j]["UniqueId"] =
                          _enterList[i].UniqueId;
                        if (_enterList[i].IsShielded == 0) {
                          this.alarmObjectData[j]["IsShielded"] = true;
                        } else {
                          this.alarmObjectData[j]["IsShielded"] = false;
                        }
                      }
                    }
                  }
                  this.alarmObjecLoad = false;
                  this.alarmInstanceLond = false;
                } else {
                  let ErrTips = {
                    InvalidParameter: "入參不合法。"
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
            } else if (this.ViewName === "cdb_detail") {
              let params = {
                Version: "2017-03-20",
                Limit: this.pageSize,
                Offset: this.pageIndex
              };
              for (let i in _enterList) {
                params["InstanceIds." + i] = JSON.parse(
                  _enterList[i].Dimensions
                ).uInstanceId;
              }
              this.axios.post(MYSQL_LIST, params).then(res => {
                if (res.Response.Error === undefined) {
                  this.alarmObjectData = res.Response.Items;
                  this.total = res.Response.TotalCount;
                  for (let i in _enterList) {
                    for (let j in this.alarmObjectData) {
                      if (
                        JSON.parse(_enterList[i].Dimensions).uInstanceId ===
                        this.alarmObjectData[j].InstanceId
                      ) {
                        this.alarmObjectData[j]["UniqueId"] =
                          _enterList[i].UniqueId;
                        if (_enterList[i].IsShielded == 0) {
                          this.alarmObjectData[j]["IsShielded"] = true;
                        } else {
                          this.alarmObjectData[j]["IsShielded"] = false;
                        }
                      }
                    }
                  }
                  this.alarmObjecLoad = false;
                  this.alarmInstanceLond = false;
                } else {
                  let ErrTips = {
                    CdbError: "後端錯誤或者流程錯誤。",
                    "InternalError.DatabaseAccessError": "數據庫內部錯誤。",
                    "InternalError.DesError": "系統內部錯誤。",
                    InvalidParameter: "參數錯誤。",
                    "InvalidParameter.InstanceNotFound": "實例不存在。",
                    "OperationDenied.WrongStatus": "後端任務狀態非法。"
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
            } else if (this.ViewName === "REDIS-CLUSTER") {
              let params = {
                Version: "2018-04-12",
                Limit: this.pageSize,
                Offset: this.pageIndex
              };
              for (let i in _enterList) {
                params["SearchKeys." + i] = JSON.parse(
                  _enterList[i].Dimensions
                ).instanceid;
              }
              this.axios.post(REDIS_LIST, params).then(res => {
                if (res.Response.Error === undefined) {
                  this.alarmObjectData = res.Response.InstanceSet;
                  this.total = res.Response.TotalCount;
                  for (let i in _enterList) {
                    for (let j in this.alarmObjectData) {
                      if (
                        JSON.parse(_enterList[i].Dimensions).instanceid ===
                        this.alarmObjectData[j].InstanceId
                      ) {
                        this.alarmObjectData[j]["UniqueId"] =
                          _enterList[i].UniqueId;
                        if (_enterList[i].IsShielded == 0) {
                          this.alarmObjectData[j]["IsShielded"] = true;
                        } else {
                          this.alarmObjectData[j]["IsShielded"] = false;
                        }
                      }
                    }
                  }
                  this.alarmObjecLoad = false;
                  this.alarmInstanceLond = false;
                } else {
                  let ErrTips = {
                    "InternalError.DbOperationFailed":
                      "統壹的 DB 操作錯誤，可以是 update insert select..。",
                    InvalidParameter: "參數錯誤",
                    "InvalidParameter.EmptyParam": "參數爲空。",
                    "InvalidParameter.InvalidParameter": "業務參數錯誤。",
                    "InvalidParameter.PermissionDenied": "接口沒有cam權限。",
                    "UnauthorizedOperation.NoCAMAuthed": "無cam 權限。"
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
            } else if (this.ViewName === "dcchannel") {
              let params = {
                Version: "2018-04-10",
                Limit: this.pageSize,
                Offset: this.pageIndex
              };
              params["Filters.0.Name"] = "direct-connect-tunnel-id";
              for (let i in _enterList) {
                params["Filters.0.Values." + i] = JSON.parse(
                  _enterList[i].Dimensions
                ).directconnecttunnelid;
              }
              this.axios.post(Private_LIST, params).then(res => {
                if (res.Response.Error === undefined) {
                  this.alarmObjectData = res.Response.DirectConnectTunnelSet;
                  this.total = res.Response.TotalCount;
                  console.log(this.alarmObjectData);
                  for (let i in _enterList) {
                    for (let j in this.alarmObjectData) {
                      if (
                        JSON.parse(_enterList[i].Dimensions)
                          .directconnecttunnelid ===
                        this.alarmObjectData[j].DirectConnectTunnelId
                      ) {
                        this.alarmObjectData[j]["UniqueId"] =
                          _enterList[i].UniqueId;
                        if (_enterList[i].IsShielded == 0) {
                          this.alarmObjectData[j]["IsShielded"] = true;
                        } else {
                          this.alarmObjectData[j]["IsShielded"] = false;
                        }
                      }
                    }
                  }
                  console.log(this.alarmObjectData);
                  this.alarmObjecLoad = false;
                  this.alarmInstanceLond = false;
                } else {
                  let ErrTips = {
                    InternalError: "內部錯誤",
                    ResourceNotFound: "資源不存在",
                    "ResourceNotFound.DirectConnectTunnelIdIsNotExist":
                      "專用通道不存在。"
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
            } else if (this.ViewName === "dcline") {
              let params = {
                Version: "2018-04-10",
                Limit: this.pageSize,
                Offset: this.pageIndex
              };
              for (let i in _enterList) {
                params["DirectConnectIds." + i] = JSON.parse(
                  _enterList[i].Dimensions
                ).directconnectid;
              }
              this.axios.post(Physics_LIST, params).then(res => {
                if (res.Response.Error === undefined) {
                  this.alarmObjectData = res.Response.DirectConnectSet;
                  this.total = res.Response.TotalCount;
                  console.log(this.alarmObjectData);
                  for (let i in _enterList) {
                    for (let j in this.alarmObjectData) {
                      if (
                        JSON.parse(_enterList[i].Dimensions).directconnectid ===
                        this.alarmObjectData[j].DirectConnectId
                      ) {
                        this.alarmObjectData[j]["UniqueId"] =
                          _enterList[i].UniqueId;
                        if (_enterList[i].IsShielded == 0) {
                          this.alarmObjectData[j]["IsShielded"] = true;
                        } else {
                          this.alarmObjectData[j]["IsShielded"] = false;
                        }
                      }
                    }
                  }
                  console.log(this.alarmObjectData);
                  this.alarmObjecLoad = false;
                  this.alarmInstanceLond = false;
                } else {
                  let ErrTips = {
                    FailedOperation: "操作失敗。",
                    InternalError: "內部錯誤。",
                    "InternalError.ExeTimeout": "執行超時。",
                    InvalidParameter: "參數錯誤。",
                    "InvalidParameter.InvalidParameter": "參數錯誤。",
                    "InvalidParameter.InvalidParameterParam": "參數錯誤。",
                    InvalidParameterValue: "無效的參數值。",
                    LimitExceeded: "超過配額限制。",
                    MissingParameter: "缺少參數錯誤。",
                    UnknownParameter: "未知參數錯誤。",
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
            } else if (this.ViewName === "COS") {
              this.axios.get(OBJ_LIST).then(res => {
                var _arr = res.Buckets.Bucket;
                console.log(_arr);
                for (let i in _enterList) {
                  for (let j in _arr) {
                    if (
                      JSON.parse(_enterList[i].Dimensions).bucket ===
                      _arr[j].Name
                    ) {
                      this.alarmObjectData.push(_arr[j]);
                      this.alarmObjectData[i]["UniqueId"] =
                        _enterList[i].UniqueId;
                      if (_enterList[i].IsShielded == 0) {
                        this.alarmObjectData[j]["IsShielded"] = true;
                      } else {
                        this.alarmObjectData[j]["IsShielded"] = false;
                      }
                    }
                  }
                }
                console.log(this.alarmObjectData);
                this.alarmObjecLoad = false;
                this.alarmInstanceLond = false;
              });
            }
            console.log(this.alarmObjectData);
          } else {
            this.alarmObjectData = [];
            this.alarmObjecLoad = false;
            this.alarmInstanceLond = false;
          }
        } else {
          let ErrTips = {
            "AuthFailure.UnauthorizedOperation":
              "請求未授權。請參考 CAM 文檔對鑒權的說明。",
            DryRunOperation:
              "DryRun 操作，代表請求將會是成功的，只是多傳了 DryRun 參數。",
            FailedOperation: "	操作失敗。",
            "FailedOperation.AlertFilterRuleDeleteFailed": "刪除過濾條件失敗。",
            "FailedOperation.AlertPolicyCreateFailed": "創建告警策略失敗。",
            "FailedOperation.AlertPolicyDeleteFailed": "告警策略刪除失敗。",
            "FailedOperation.AlertPolicyDescribeFailed": "告警策略查詢失敗。",
            "FailedOperation.AlertPolicyModifyFailed": "告警策略修改失敗。",
            "FailedOperation.AlertTriggerRuleDeleteFailed":
              "刪除觸發條件失敗。",
            "FailedOperation.DbQueryFailed": "數據庫查詢失敗。",
            "FailedOperation.DbRecordCreateFailed": "創建數據庫記錄失敗。",
            "FailedOperation.DbRecordDeleteFailed": "數據庫記錄刪除失敗。",
            "FailedOperation.DbRecordUpdateFailed": "數據庫記錄更新失敗。",
            "FailedOperation.DbTransactionBeginFailed": "數據庫事務開始失敗。",
            "FailedOperation.DbTransactionCommitFailed": "數據庫事務提交失敗。",
            "FailedOperation.DimQueryRequestFailed": "請求維度查詢服務失敗。",
            "FailedOperation.DivisionByZero": "被除數爲0。",
            "FailedOperation.DruidQueryFailed": "查詢分析數據失敗。",
            "FailedOperation.DruidTableNotFound": "druid表不存在。",
            "FailedOperation.DuplicateName": "名字重複。",
            "FailedOperation.ServiceNotEnabled":
              "服務未啓用，開通服務後方可使用。",
            InternalError: "內部錯誤。",
            "InternalError.ExeTimeout": "執行超時。",
            InvalidParameter: "參數錯誤。",
            "InvalidParameter.InvalidParameter": "參數錯誤。",
            "InvalidParameter.InvalidParameterParam": "參數錯誤。",
            InvalidParameterValue: "無效的參數值。",
            LimitExceeded: "超過配額限制。",
            "LimitExceeded.MetricQuotaExceeded":
              "指標數量達到配額限制，禁止含有未注冊指標的請求。",
            MissingParameter: "缺少參數錯誤。",
            ResourceInUse: "資源被占用。",
            ResourceInsufficient: "資源不足。",
            ResourceNotFound: "資源不存在。",
            ResourceUnavailable: "資源不可用。",
            ResourcesSoldOut: "資源售罄。",
            UnauthorizedOperation: "未授權操作。",
            UnknownParameter: "未知參數錯誤。",
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
    // 告警對象移除
    AlarmObjectRemoval(row, index) {
      if (index == 1) {
        this.alarmObjecTitle = "確定解除與該告警對象的關聯？";
        this.UniqueId = row.UniqueId;
      } else {
        this.alarmObjecTitle =
          "已選擇" + this.UniqueId.length + "個告警對象，確定要解除關聯？";
      }
      this.alarmObjectRemovalVisible = true;
    },
    AlarmStart(row, index) {
      this.alarmInstanceLond = true;
      let param = {
        Version: "2018-07-24",
        Module: "monitor",
        GroupId: this.$route.query.groupId
      };
      if (row.IsShielded === true) {
        param["IsShielded"] = 0;
      } else {
        param["IsShielded"] = 1;
      }
      if (this.ViewName !== "BS") {
        param["Dimensions.0.Region"] = "tpe";
      }

      if (this.ViewName === "cvm_device") {
        param["Dimensions.0.Dimensions"] = {
          unInstanceId: row.InstanceId
        };
        param["Dimensions.0.EventDimensions"] = {
          uuid: row.Uuid
        };
      } else if (this.ViewName === "BS") {
        param["Dimensions.0.Dimensions"] = {
          diskid: row.DiskId
        };
        param["Dimensions.0.EventDimensions"] = {
          VpnGatewayId: row.VpnGatewayId
        };
      } else if (this.ViewName === "VPN_GW") {
        param["Dimensions.0.Dimensions"] = {
          vip: row.PublicIpAddress
        };
        param["Dimensions.0.EventDimensions"] = {
          VpnGatewayId: row.VpnGatewayId
        };
      } else if (this.ViewName === "vpn_tunnel") {
        param["Dimensions.0.Dimensions"] = {
          uniqVpnconnId: row.VpnConnectionId
        };
      } else if (this.ViewName === "nat_tc_stat") {
        param["Dimensions.0.Dimensions"] = {
          uniq_nat_id: row.NatGatewayId
        };
        param["Dimensions.0.EventDimensions"] = {
          instanceId: row.NatGatewayId
        };
      } else if (this.ViewName === "DC_GW") {
        param["Dimensions.0.Dimensions"] = {
          directconnectgatewayid: row.DirectConnectGatewayId
        };
        param["Dimensions.0.EventDimensions"] = {
          instanceId: row.DirectConnectGatewayId
        };
      } else if (this.ViewName === "EIP") {
        param["Dimensions.0.Dimensions"] = {
          vip: row.AddressIp
        };
      } else if (this.ViewName === "cdb_detail") {
        param["Dimensions.0.Dimensions"] = {
          uInstanceId: row.InstanceId
        };
        param["Dimensions.0.EventDimensions"] = {
          InstanceId: row.InstanceId
        };
      } else if (this.ViewName === "REDIS-CLUSTER") {
        param["Dimensions.0.Dimensions"] = {
          instanceid: row.InstanceId
        };
        param["Dimensions.0.EventDimensions"] = {
          instanceid: row.InstanceId
        };
      } else if (this.ViewName === "dcchannel") {
        param["Dimensions.0.Dimensions"] = {
          directconnecttunnelid: row.DirectConnectTunnelId
        };
      } else if (this.ViewName === "dcline") {
        param["Dimensions.0.Dimensions"] = {
          directconnectid: row.DirectConnectId
        };
      } else if (this.ViewName === "COS") {
        param["Dimensions.0.Dimensions"] = {
          bucket: row.Name
        };
      }
      this.axios.post(CM_GROUPING_ALARM_START, param).then(res => {
        if (res.Response.Error === undefined) {
          this.AlarmObjectList();
        } else {
          let ErrTips = {
            "AuthFailure.UnauthorizedOperation":
              "請求未授權。請參考 CAM 文檔對鑒權的說明。",
            FailedOperation: "操作失敗。",
            InternalError: "內部錯誤。",
            InvalidParameter: "參數錯誤。",
            "InvalidParameter.InvalidParameter": "參數錯誤。",
            "InvalidParameter.InvalidParameterParam": "參數錯誤。",
            InvalidParameterValue: "無效的參數值。",
            LimitExceeded: "超過配額限制。",
            MissingParameter: "缺少參數錯誤。"
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
    // 解除綁定
    UnBindingInstance() {
      let param = {
        Version: "2018-07-24",
        Module: "monitor",
        InstanceGroupId: this.InstanceGroupShow.InstanceGroup.InstanceGroupId,
        PolicyGroupId: this.$route.query.groupId,
        IsDelRelatedPolicy: 2
      };
      this.axios.post(CM_GROUPING_UNBINDING, param).then(res => {
        if (res.Response.Error === undefined) {
          this.AlarmObjectList();
          this.unBindingInstance = false;
        } else {
          let ErrTips = {
            "AuthFailure.UnauthorizedOperation":
              "請求未授權。請參考 CAM 文檔對鑒權的說明。",
            FailedOperation: "操作失敗。",
            InternalError: "內部錯誤。",
            InvalidParameter: "參數錯誤。",
            "InvalidParameter.InvalidParameter": "參數錯誤。",
            "InvalidParameter.InvalidParameterParam": "參數錯誤。",
            InvalidParameterValue: "無效的參數值。",
            LimitExceeded: "超過配額限制。",
            MissingParameter: "缺少參數錯誤。"
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
              "請求未授權。請參考 CAM 文檔對鑒權的說明。",
            DryRunOperation:
              "DryRun 操作，代表請求將會是成功的，只是多傳了 DryRun 參數。",
            FailedOperation: "操作失敗。",
            "FailedOperation.AlertFilterRuleDeleteFailed": "刪除過濾條件失敗。",
            "FailedOperation.AlertPolicyCreateFailed": "創建告警策略失敗。",
            "FailedOperation.AlertPolicyDeleteFailed": "告警策略刪除失敗。",
            "FailedOperation.AlertPolicyDescribeFailed": "告警策略查詢失敗。",
            "FailedOperation.AlertPolicyModifyFailed": "告警策略修改失敗。",
            "FailedOperation.AlertTriggerRuleDeleteFailed":
              "刪除觸發條件失敗。",
            "FailedOperation.DbQueryFailed": "數據庫查詢失敗。",
            "FailedOperation.DbRecordCreateFailed": "創建數據庫記錄失敗。",
            "FailedOperation.DbRecordDeleteFailed": "數據庫記錄刪除失敗。",
            "FailedOperation.DbRecordUpdateFailed": "數據庫記錄更新失敗。",
            "FailedOperation.DbTransactionBeginFailed": "數據庫事務開始失敗。",
            "FailedOperation.DbTransactionCommitFailed": "數據庫事務提交失敗。",
            "FailedOperation.DimQueryRequestFailed": "請求維度查詢服務失敗。",
            "FailedOperation.DruidQueryFailed": "查詢分析數據失敗。",
            "FailedOperation.DuplicateName": "名字重複。",
            "FailedOperation.ServiceNotEnabled":
              "服務未啓用，開通服務後方可使用。",
            InternalError: "內部錯誤。",
            "InternalError.ExeTimeout": "執行超時。",
            InvalidParameter: "參數錯誤。",
            "InvalidParameter.InvalidParameter": "參數錯誤。",
            "InvalidParameter.InvalidParameterParam": "參數錯誤。",
            InvalidParameterValue: "無效的參數值。",
            LimitExceeded: "超過配額限制。",
            "LimitExceeded.MetricQuotaExceeded":
              "指標數量達到配額限制，禁止含有未注冊指標的請求。",
            MissingParameter: "缺少參數錯誤。",
            ResourceInUse: "資源被占用。",
            ResourceInsufficient: "資源不足。",
            ResourceNotFound: "資源不存在。",
            ResourceUnavailable: "資源不可用。",
            ResourcesSoldOut: "資源售罄。",
            UnauthorizedOperation: "未授權操作。",
            UnknownParameter: "未知參數錯誤。",
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
              "請求未授權。請參考 CAM 文檔對鑒權的說明。",
            DryRunOperation:
              "DryRun 操作，代表請求將會是成功的，只是多傳了 DryRun 參數。",
            FailedOperation: "操作失敗。",
            "FailedOperation.AlertFilterRuleDeleteFailed": "刪除過濾條件失敗。",
            "FailedOperation.AlertPolicyCreateFailed": "創建告警策略失敗。",
            "FailedOperation.AlertPolicyDeleteFailed": "告警策略刪除失敗。",
            "FailedOperation.AlertPolicyDescribeFailed": "告警策略查詢失敗。",
            "FailedOperation.AlertPolicyModifyFailed": "告警策略修改失敗。",
            "FailedOperation.AlertTriggerRuleDeleteFailed":
              "刪除觸發條件失敗。",
            "FailedOperation.DbQueryFailed": "數據庫查詢失敗。",
            "FailedOperation.DbRecordCreateFailed": "創建數據庫記錄失敗。",
            "FailedOperation.DbRecordDeleteFailed": "數據庫記錄刪除失敗。",
            "FailedOperation.DbRecordUpdateFailed": "數據庫記錄更新失敗。",
            "FailedOperation.DbTransactionBeginFailed": "數據庫事務開始失敗。",
            "FailedOperation.DbTransactionCommitFailed": "數據庫事務提交失敗。",
            "FailedOperation.DimQueryRequestFailed": "請求維度查詢服務失敗。",
            "FailedOperation.DruidQueryFailed": "查詢分析數據失敗。",
            "FailedOperation.DuplicateName": "名字重複。",
            "FailedOperation.ServiceNotEnabled":
              "服務未啓用，開通服務後方可使用。",
            InternalError: "內部錯誤。",
            "InternalError.ExeTimeout": "執行超時。",
            InvalidParameter: "參數錯誤。",
            "InvalidParameter.InvalidParameter": "參數錯誤。",
            "InvalidParameter.InvalidParameterParam": "參數錯誤。",
            InvalidParameterValue: "無效的參數值。",
            LimitExceeded: "超過配額限制。",
            "LimitExceeded.MetricQuotaExceeded":
              "指標數量達到配額限制，禁止含有未注冊指標的請求。",
            MissingParameter: "缺少參數錯誤。",
            ResourceInUse: "資源被占用。",
            ResourceInsufficient: "資源不足。",
            ResourceNotFound: "資源不存在。",
            ResourceUnavailable: "資源不可用。",
            ResourcesSoldOut: "資源售罄。",
            UnauthorizedOperation: "未授權操作。",
            UnknownParameter: "未知參數錯誤。",
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
    // 分頁
    handleCurrentChange(val) {
      this.pageIndex = val - 1;
      this.ListInit();
      this.pageIndex += 1;
    },
    handleSizeChange(val) {
      // console.log(`每頁 ${val} 條`);
      this.pageSize = val;
      this.ListInit();
    },
    // 告警接收對象 編輯
    EditReceiveObject() {
      this.editReceiveObjectVisuble = true;
    },

    // 獲取cam組件的值
    camFun(val) {
      this.cam = val;
      console.log(this.cam);
      // var time = 57599;
      // var unixTimestamp = new Date(time);
      // var commonTime = unixTimestamp.toLocaleString();
      // console.log(commonTime);
    },
    EditReceiveSave() {
      let param = {
        Version: "2018-07-24",
        Module: "monitor",
        GroupId: this.$route.query.groupId
      };
      if (this.cam.selectUserGroup.length > 0) {
        param["ReceiverInfos.0.StartTime"] = this.cam.time[0];
        param["ReceiverInfos.0.EndTime"] = this.cam.time[1];
        if (this.cam.channel.length > 0) {
          for (let i in this.cam.channel) {
            if (this.cam.channel[i] === "郵件") {
              param["ReceiverInfos.0.NotifyWay." + i] = "EMAIL";
            } else if (this.cam.channel[i] === "間訊") {
              param["ReceiverInfos.0.NotifyWay." + i] = "SMS";
            }
          }
        } else {
          this.$message({
            message: "請選擇接收渠道 ",
            type: "error",
            showClose: true,
            duration: 0
          });
          return false;
        }

        // param[
        //   "ReceiverInfos.0.PersonInterval"
        // ] = this.ReceiverInfos.PersonInterval;
        // param["ReceiverInfos.0.RoundNumber"] = this.ReceiverInfos.RoundNumber;
        // param[
        //   "ReceiverInfos.0.RoundInterval"
        // ] = this.ReceiverInfos.RoundInterval;
        // for (let i in this.ReceiverInfos.RecoverNotify) {
        //   param[
        //     "ReceiverInfos.0.RoundInterval." + i
        //   ] = this.ReceiverInfos.RecoverNotify[i];
        // }
        // param[
        //   "ReceiverInfos.0.NeedSendNotice"
        // ] = this.ReceiverInfos.NeedSendNotice;

        if (this.cam.selectType === "group" || this.cam.selectType === "") {
          param["ReceiverInfos.0.ReceiverType"] = "group";
          for (let i in this.cam.selectUserGroup) {
            param[
              "ReceiverInfos.0.ReceiverGroupList." + i
            ] = this.cam.selectUserGroup[i].GroupId;
          }
        }
      }
      if (this.cam.selectUserList.length > 0) {
        param["ReceiverInfos.0.StartTime"] = this.cam.time[0];
        param["ReceiverInfos.0.EndTime"] = this.cam.time[1];
        if (this.cam.channel.length > 0) {
          for (let i in this.cam.channel) {
            if (this.cam.channel[i] === "郵件") {
              param["ReceiverInfos.0.NotifyWay." + i] = "EMAIL";
            } else if (this.cam.channel[i] === "間訊") {
              param["ReceiverInfos.0.NotifyWay." + i] = "SMS";
            }
          }
        } else {
          this.$message({
            message: "請選擇接收渠道 ",
            type: "error",
            showClose: true,
            duration: 0
          });
          return false;
        }

        if (this.cam.selectType === "user") {
          param["ReceiverInfos.0.ReceiverType"] = "user";
          for (let i in this.cam.selectUserList) {
            param[
              "ReceiverInfos.0.ReceiverUserList." + i
            ] = this.cam.selectUserList[i].Uid;
          }
        }
      }

      console.log(param);
      this.axios.post(CM_ALARM_RECEIVE_OBJECT_RELIEVE, param).then(res => {
        if (res.Response.Error === undefined) {
          this.editReceiveObjectVisuble = false;
          this.DetailsInit();
        } else {
          let ErrTips = {
            "AuthFailure.InvalidSecretId": "密鑰非法（不是雲 API 密鑰類型）。",
            "AuthFailure.MFAFailure": "MFA 錯誤。",
            "AuthFailure.SecretIdNotFound": "密鑰不存在。",
            "AuthFailure.SignatureExpire": "簽名過期。",
            "AuthFailure.SignatureFailure": "簽名錯誤。",
            "AuthFailure.TokenFailure	token": "錯誤。",
            "AuthFailure.UnauthorizedOperation": "請求未 CAM 授權。",
            DryRunOperation:
              "DryRun 操作，代表請求將會是成功的，只是多傳了 DryRun 參數。",
            FailedOperation: "操作失敗。",
            InternalError: "內部錯誤。",
            InvalidAction: "接口不存在。",
            InvalidParameter: "參數錯誤。",
            InvalidParameterValue: "參數取值錯誤。",
            LimitExceeded: "超過配額限制。",
            MissingParameter: "缺少參數錯誤。",
            NoSuchVersion: "接口版本不存在。",
            RequestLimitExceeded: "請求的次數超過了頻率限制。",
            ResourceInUse: "資源被占用。",
            ResourceInsufficient: "資源不足。",
            ResourceNotFound: "資源不存在。",
            ResourceUnavailable: "資源不可用。",
            UnauthorizedOperation: "未授權操作。",
            UnknownParameter: "未知參數錯誤。",
            UnsupportedOperation: "操作不支持。",
            UnsupportedProtocol:
              "HTTPS 請求方法錯誤，只支持 GET 和 POST 請求。",
            UnsupportedRegion: "接口不支持所傳地域。"
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
    // 告警接收對象 select
    receivingSelectionChange(val) {
      console.log(val);
      this.remove = val;
    },
    // 告警接收對象 解除
    Remove(row, index) {
      if (index == 1) {
        this.remove = [];
        this.remove = row;
        this.relieveTitle = "確定解除與該$接收人的關聯？";
      } else {
        this.relieveTitle =
          "已選擇" + this.remove.length + "個告警接收人，確定要解除關聯？";
      }
      this.relieveDialogVisible = true;
    },
    Receive() {
      let param = {
        Version: "2018-07-24",
        Module: "monitor",
        GroupId: this.$route.query.groupId
      };
      if (_ReceiverUserList.length > 1) {
        if (this.remove.length !== _ReceiverUserList.length) {
          param["ReceiverInfos.0.StartTime"] = this.ReceiverInfos.StartTime;
          param["ReceiverInfos.0.EndTime"] = this.ReceiverInfos.EndTime;
          for (let i in this.ReceiverInfos.NotifyWay) {
            param[
              "ReceiverInfos.0.NotifyWay." + i
            ] = this.ReceiverInfos.NotifyWay[i];
          }
          param[
            "ReceiverInfos.0.ReceiverType"
          ] = this.ReceiverInfos.ReceiverType;
          // param[
          //   "ReceiverInfos.0.PersonInterval"
          // ] = this.ReceiverInfos.PersonInterval;
          // param["ReceiverInfos.0.RoundNumber"] = this.ReceiverInfos.RoundNumber;
          // param[
          //   "ReceiverInfos.0.RoundInterval"
          // ] = this.ReceiverInfos.RoundInterval;
          // for (let i in this.ReceiverInfos.RecoverNotify) {
          //   param[
          //     "ReceiverInfos.0.RoundInterval." + i
          //   ] = this.ReceiverInfos.RecoverNotify[i];
          // }
          // param[
          //   "ReceiverInfos.0.NeedSendNotice"
          // ] = this.ReceiverInfos.NeedSendNotice;
          if (this.ReceiverInfos.ReceiverType === "group") {
            if (Array.isArray(this.remove)) {
              for (let i in this.remove) {
                for (let j in _ReceiverUserList) {
                  if (_ReceiverUserList[j] === this.remove[i].GroupId) {
                    _ReceiverUserList.splice(j, 1);
                  }
                }
              }
            } else {
              for (let j in _ReceiverUserList) {
                if (_ReceiverUserList[j] === this.remove.GroupId) {
                  _ReceiverUserList.splice(j, 1);
                }
              }
            }

            for (let i in _ReceiverUserList) {
              param["ReceiverInfos.0.ReceiverGroupList." + i] =
                _ReceiverUserList[i];
            }
          } else {
            if (Array.isArray(this.remove)) {
              for (let i in this.remove) {
                for (let j in _ReceiverUserList) {
                  if (_ReceiverUserList[j] === this.remove[i].Uid) {
                    _ReceiverUserList.splice(j, 1);
                  }
                }
              }
            } else {
              for (let j in _ReceiverUserList) {
                if (_ReceiverUserList[j] === this.remove.Uid) {
                  _ReceiverUserList.splice(j, 1);
                }
              }
            }
            for (let i in _ReceiverUserList) {
              param["ReceiverInfos.0.ReceiverUserList." + i] =
                _ReceiverUserList[i];
            }
          }
        }
      }
      console.log(param);
      this.axios.post(CM_ALARM_RECEIVE_OBJECT_RELIEVE, param).then(res => {
        if (res.Response.Error === undefined) {
          this.relieveDialogVisible = false;
          this.DetailsInit();
          this.$message({
            message: "告警接收對象解除成功",
            type: "success",
            showClose: true,
            duration: 0
          });
        } else {
          let ErrTips = {
            "AuthFailure.InvalidSecretId": "密鑰非法（不是雲 API 密鑰類型）。",
            "AuthFailure.MFAFailure": "MFA 錯誤。",
            "AuthFailure.SecretIdNotFound": "密鑰不存在。",
            "AuthFailure.SignatureExpire": "簽名過期。",
            "AuthFailure.SignatureFailure": "簽名錯誤。",
            "AuthFailure.TokenFailure	token": "錯誤。",
            "AuthFailure.UnauthorizedOperation": "請求未 CAM 授權。",
            DryRunOperation:
              "DryRun 操作，代表請求將會是成功的，只是多傳了 DryRun 參數。",
            FailedOperation: "操作失敗。",
            InternalError: "內部錯誤。",
            InvalidAction: "接口不存在。",
            InvalidParameter: "參數錯誤。",
            InvalidParameterValue: "參數取值錯誤。",
            LimitExceeded: "超過配額限制。",
            MissingParameter: "缺少參數錯誤。",
            NoSuchVersion: "接口版本不存在。",
            RequestLimitExceeded: "請求的次數超過了頻率限制。",
            ResourceInUse: "資源被占用。",
            ResourceInsufficient: "資源不足。",
            ResourceNotFound: "資源不存在。",
            ResourceUnavailable: "資源不可用。",
            UnauthorizedOperation: "未授權操作。",
            UnknownParameter: "未知參數錯誤。",
            UnsupportedOperation: "操作不支持。",
            UnsupportedProtocol:
              "HTTPS 請求方法錯誤，只支持 GET 和 POST 請求。",
            UnsupportedRegion: "接口不支持所傳地域。"
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
      //觸發條件模板
    },
    config() {
      //配置觸發條件
      this.showChufa1 = false;
      this.showChufa2 = true;
    },
    addZhibiao() {
      //添加觸發條件的指標告警
      this.formWrite.index++;
      if (this.formWrite.index + 1 === this.formWrite.arr.length) {
        this.formWrite.index = 0;
      }
      this.formWrite.arr.push({
        max: Math.floor(
          this.typeOpt[this.formWrite.index].ConfigManual.CalcValue.Max
        ),
        typeVal: this.typeOpt[this.formWrite.index].MetricId,
        censusVal: 60,
        calcTypeVal: "1",
        number: 0,
        unit: "",
        continuousCycleVal: 1,
        warningVal: 86400
      });
    },
    delZhibiao(index) {
      this.formWrite.arr.splice(index, 1);
    },
    addShijian() {
      //添加觸發條件的事件告警
      this.formWrite.gaoIndex++;
      if (this.formWrite.gaoIndex + 1 === this.formWrite.gaoArr.length) {
        this.formWrite.gaoIndex = 0;
      }
      this.formWrite.gaoArr.push({
        eventVal: this.eventOpt[this.formWrite.gaoIndex].value
      });
    },
    delShijian(index) {
      this.formWrite.gaoArr.splice(index, 1);
    },
    TypeChange(index) {
      for (let i in this.typeOpt) {
        if (this.typeOpt[i].MetricId === this.formWrite.arr[index].typeVal) {
          this.formWrite.arr[index].unit = this.typeOpt[i].MetricUnit;
          this.formWrite.arr[index].number = 0;
          this.formWrite.arr[index].max = Math.floor(
            this.typeOpt[i].ConfigManual.CalcValue.Max
          );
        }
      }
    },
    callbackEdit() {
      // 回調接口配置
      this.callbackInterface = true;
      let param = {
        Version: "2018-07-24",
        Module: "monitor"
      };
      this.axios.post(CM_CALLBACK, param).then(res => {
        if (res.Response.Error === undefined) {
          this.httpCodes = res.Response.VerifyCode;
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
      if (this.basicNews.Callback) {
        this.httpVal = this.basicNews.Callback.CallbackUrl.substring(
          0,
          this.basicNews.Callback.CallbackUrl.lastIndexOf(":")
        );
        this.httpInput = this.basicNews.Callback.CallbackUrl.substring(
          this.basicNews.Callback.CallbackUrl.lastIndexOf("/") + 1,
          this.basicNews.Callback.CallbackUrl.length
        );
        this.httpCode = this.basicNews.Callback.VerifyCode;
      } else {
        this.httpCode = this.httpCodes;
      }
    },
    // 回調接口
    HttpHistroy() {
      this.httpOption = [];
      this.httpOption1 = [];
      let param = {
        Version: "2018-07-24",
        Module: "monitor"
      };
      this.axios.post(CM_CALLBACK_HISTORY, param).then(res => {
        if (res.Response.Error === undefined) {
          var list = res.Response.List;

          for (let i in list) {
            if (
              this.httpVal ===
              list[i].Url.substring(0, list[i].Url.lastIndexOf(":"))
            ) {
              this.httpOption.push(list[i]);
              this.httpOption1.push(list[i]);
            }
          }

          this.httpShow = true;
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
    HttpHistroyBlur() {
      // this.httpShow = false;
    },
    leave() {
      this.httpShow = false;
    },
    HttpHistruyInput() {
      this.httpShow = true;
      this.httpOption = [];
      this.httpOption = this.httpOption1;
      var _arr = [];
      for (let i in this.httpOption) {
        //如果字符串中不包含目標字符會返回-1
        if (this.httpOption[i].Url.indexOf(this.httpInput) >= 0) {
          _arr.push(this.httpOption[i]);
        }
      }
      this.httpOption = _arr;
      if (this.httpVal == "http") {
        for (let i in this.httpOption2) {
          if (
            this.httpOption2[i].Url.substring(
              this.httpOption2[i].Url.lastIndexOf("/") + 1,
              this.httpOption2[i].Url.length
            ) === this.httpInput
          ) {
            this.HttpSelect(this.httpOption2[i]);
            return false;
          } else {
            this.httpCode = this.httpCodes;
          }
        }
      } else {
        for (let i in this.httpOption3) {
          if (
            this.httpOption3[i].Url.substring(
              this.httpOption3[i].Url.lastIndexOf("/") + 1,
              this.httpOption3[i].Url.length
            ) === this.httpInput
          ) {
            this.HttpSelect(this.httpOption3[i]);
            return false;
          } else {
            this.httpCode = this.httpCodes;
          }
        }
      }
    },
    HttpInit() {
      let param = {
        Version: "2018-07-24",
        Module: "monitor"
      };
      this.axios.post(CM_CALLBACK_HISTORY, param).then(res => {
        if (res.Response.Error === undefined) {
          let list = res.Response.List;

          for (let i in list) {
            if (
              "http" === list[i].Url.substring(0, list[i].Url.lastIndexOf(":"))
            ) {
              this.httpOption2.push(list[i]);
            }
            if (
              "https" === list[i].Url.substring(0, list[i].Url.lastIndexOf(":"))
            ) {
              this.httpOption3.push(list[i]);
            }
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
    HttpTypeChange() {
      this.httpShow = false;
      if (this.httpVal == "http") {
        for (let i in this.httpOption2) {
          if (
            this.httpOption2[i].Url.substring(
              this.httpOption2[i].Url.lastIndexOf("/") + 1,
              this.httpOption2[i].Url.length
            ) === this.httpInput
          ) {
            this.HttpSelect(this.httpOption2[i]);
            return false;
          } else {
            this.httpCode = this.httpCodes;
          }
        }
      } else {
        for (let i in this.httpOption3) {
          if (
            this.httpOption3[i].Url.substring(
              this.httpOption3[i].Url.lastIndexOf("/") + 1,
              this.httpOption3[i].Url.length
            ) === this.httpInput
          ) {
            this.HttpSelect(this.httpOption3[i]);
            return false;
          } else {
            this.httpCode = this.httpCodes;
          }
        }
      }
    },
    HttpSelect(item) {
      console.log(item);
      this.httpInput = item.Url.substring(
        item.Url.lastIndexOf("/") + 1,
        item.Url.length
      );
      this.httpCode = item.VerifyCode;
      this.httpShow = false;
    },
    // 回調接口 保存
    CallBackSave(val) {
      let param = {
        Version: "2018-07-24",
        Module: "monitor",
        GroupId: this.$route.query.groupId
      };
      if (val == 1) {
        param["UserAction"] = "bind";
        param["Url"] = this.httpVal + "://" + this.httpInput;
        param["VerifyCode"] = this.httpCode;
      } else {
        param["UserAction"] = "unbind";
      }
      this.axios.post(CM_CALLBACK_SAVE, param).then(res => {
        if (res.Response.Error === undefined) {
          this.callbackInterface = false;
          this.DetailsInit();
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
    // 刷新
    CallBackRefresh() {
      this.Verification = false;
      let param = {
        Version: "2018-07-24",
        Module: "monitor",
        GroupId: this.$route.query.groupId
      };

      this.axios.post(CM_CALLBACK_Verify, param).then(res => {
        if (res.Response.Error === undefined) {
          if (res.Response.VerifyStatus === "fail") {
            this.basicNews.Callback.ValidFlag = 2;
          } else {
            this.basicNews.Callback.ValidFlag = 0;
          }
          this.Verification = true;
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
    // 狀態
    InstanceState(val) {
      if (val === "PENDING") {
        return "創建中";
      } else if (val === "LAUNCH_FAILED") {
        return "創建失敗";
      } else if (val === "RUNNING") {
        return "運行中";
      } else if (val === "STOPPED") {
        return "關機";
      } else if (val === "STARTING") {
        return "關機中";
      } else if (val === "REBOOTING") {
        return "重啓中";
      } else if (val === "SHUTDOWN") {
        return "停止待銷毀";
      } else if (val === "TERMINATING") {
        return "銷毀中";
      }
    },
    VPN_GW_State(val) {
      if (val === "PENDING") {
        return "生産中";
      } else if (val === "DELETING") {
        return "刪除中";
      } else if (val === "AVAILABLE") {
        return "運行中";
      }
    },
    VPN_Tunnel_State(val) {
      if (val === "PENDING") {
        return "生産中";
      } else if (val === "DELETING") {
        return "刪除中";
      } else if (val === "AVAILABLE") {
        return "運行中";
      } else if (val === "UPDATING") {
        return "升級中";
      } else if (val === "FAILE") {
        return "失敗";
      }
    },
    NAT_Status(val) {
      if (val === "NAT") {
        return "支持";
      } else {
        return "不支持";
      }
    },
    CDB_Status(val) {
      if (val == 0) {
        return "創建中";
      } else if (val == 1) {
        return "運行中";
      } else if (val == 4) {
        return "隔離中";
      } else if (val == 5) {
        return "已隔離";
      }
    },
    REDIS_Status(val) {
      if (val == 0) {
        return "待初始化";
      } else if (val == 1) {
        return "流程中";
      } else if (val == 2) {
        return "運行中";
      } else if (val == -2) {
        return "已隔離";
      } else if (val == -3) {
        return "待刪除";
      }
    },
    CDB_InstanceType(val) {
      if (val == 1) {
        return "主實例";
      } else if (val == 2) {
        return "災備實例";
      } else if (val == 3) {
        return "只讀實例";
      }
    },
    dcchannel_Status(val) {
      if (val == "AVAILABLE") {
        return "就緒或者已連接";
      } else if (val == "PENDING") {
        return "申請中";
      } else if (val == "ALLOCATING") {
        return "配置中";
      } else if (val == "ALLOCATED") {
        return "配置完成";
      } else if (val == "ALTERING") {
        return "修改中";
      } else if (val == "DELETING") {
        return "刪除中";
      } else if (val == "DELETED") {
        return "刪除完成";
      } else if (val == "COMFIRMING") {
        return "待接受";
      } else if (val == "REJECTED") {
        return "拒絕";
      }
    },
    dcline_Status(val) {
      if (val == "PENDING") {
        return "申請中";
      } else if (val == "REJECTED") {
        return "申請駁回";
      } else if (val == "TOPAY") {
        return "待付款";
      } else if (val == "PAID") {
        return "已付款";
      } else if (val == "ALLOCATED") {
        return "建設中";
      } else if (val == "AVAILABLE") {
        return "已開通";
      } else if (val == "DELETING") {
        return "刪除中";
      } else if (val == "DELETED") {
        return "已刪除";
      }
    }
  },
  filters: {
    // 狀態
    InstanceState(val) {
      if (val === "PENDING") {
        return "創建中";
      } else if (val === "LAUNCH_FAILED") {
        return "創建失敗";
      } else if (val === "RUNNING") {
        return "運行中";
      } else if (val === "STOPPED") {
        return "關機";
      } else if (val === "STARTING") {
        return "關機中";
      } else if (val === "REBOOTING") {
        return "重啓中";
      } else if (val === "SHUTDOWN") {
        return "停止待銷毀";
      } else if (val === "TERMINATING") {
        return "銷毀中";
      }
    },
    EndTime(val) {
      return moment(val * 1000).format("HH:mm:ss");
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
        return "日同比上漲";
      } else if (value == 8) {
        return "日同比下降";
      } else if (value == 9) {
        return "周同比上漲";
      } else if (value == 10) {
        return "周同比下降";
      } else if (value == 11) {
        return "周期環比上漲";
      } else if (value == 12) {
        return "周期環比下降";
      }
    },
    AlarmNotifyPeriod(val) {
      if ((val / 60 / 60) % 1 == 0) {
        if ((val / 60 / 60 / 24) % 1 == 0) {
          return val / 60 / 60 / 24 + "天";
        } else {
          return val / 60 / 60 + "小時";
        }
      } else if ((val / 60) % 1 == 0) {
        return val / 60 + "分鍾";
      }
    },
    NotifyWay(val) {
      if (val === "EMAIL") {
        return "郵件";
      } else if (val === "SMS") {
        return "短信";
      } else if (val === "WECHAT") {
        return "微信";
      } else if (val === "CALL") {
        return "電話";
      }
    },
    ProjectName(val) {
      if (val == 0) {
        return "默認項目";
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
  text-decoration: underline;
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
    ::v-deep .el-select {
      width: 100px;
    }
    .input-http {
      width: 78%;
      margin-left: 10px;
    }
    ::v-deep .el-input__inner {
      border-radius: 0;
      height: 30px;
    }
    .text-http {
      position: relative;
      ul {
        position: absolute;
        z-index: 1000;
        left: 110px;
        width: 78%;
        background: #fff;
        top: 40px;
        border: 1px solid #ddd;
        li {
          padding: 5px;
          width: 100%;
          box-sizing: border-box;
          cursor: pointer;
          &:hover {
            background: #f2f2f2;
          }
          span {
            color: #999;
            font-size: 12px;
          }
        }
      }
    }
    & > p {
      color: #888;
      font-size: 12px;
      line-height: 22px;
      margin-top: 10px;
    }
  }
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
      ::v-deep .el-input-number__decrease {
        height: 15px !important;
        width: auto;
      }
      ::v-deep .el-input-number__increase {
        width: auto;
        height: 15px !important;
      }
      ::v-deep .el-input-number.is-controls-right .el-input__inner {
        padding-left: 10px;
        padding-right: 20px;
      }
      .input-style-dis {
        height: 30px;
        line-height: 30px;
        padding-left: 10px;
        width: 90px;
      }
      .input-p {
        cursor: not-allowed;
        background: #f5f7fa;
        padding: 0 10px;
        display: inline-block;
        height: 30px;
        line-height: 30px;
        min-width: 52px;
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
        width: 97%;
        flex-wrap: wrap;
      }
    }
  }
}
.edit-alarm-object {
  p {
    margin-bottom: 10px;
  }
}
.edit-alarm-object-news {
  p {
    font-size: 12px;
    color: #444;
    background-color: #f0f4f7;
    padding: 10px 12px;
    width: 100%;
    box-sizing: border-box;
  }
}
.gao-jing-loading {
  display: flex;
  align-items: center;
  ::v-deep .el-loading-spinner .circular {
    width: 20px;
    height: 20px;
    margin-top: 10px;
  }
}
.left {
  // flex: 1;
  ::v-deep .el-table {
    width: 650px;
  }
  .border {
    border: 1px solid #dcdfe6;
    border-bottom: 0px;
  }
  .seek {
    display: flex;
    align-items: center;
    width: 500px;
    margin-top: -6px;
    ::v-deep .el-select {
      width: 100px;
      font-size: 12px;
    }
    ::v-deep .el-input-group {
      width: 80%;
    }
    ::v-deep .el-input__inner {
      border-radius: 0;
      height: 30px;
      font-size: 12px;
      padding: 0px 10px;
    }
    ::v-deep .el-input-group__append {
      border-radius: 0;
    }
  }
}
.alarm-object-table-instance {
  ul {
    li {
      display: flex;
      align-content: center;
      span {
        &:nth-of-type(1) {
          display: inline-block;
          width: 56px;
          color: #888;
        }
        &:nth-of-type(2) {
          color: #000;
          margin-right: 18px;
        }
      }
    }
  }
}
.edit-receive-object {
  p {
    font-size: 12px;
    line-height: inherit;
    padding: 10px 30px 10px 20px;
    vertical-align: middle;
    color: #003b80;
    border: 1px solid #97c7ff;
    background: #e5f0ff;
    margin-bottom: 10px;
  }
}
.Callback-box-content {
  margin-top: 20px;
  span {
    &:nth-of-type(2) {
      color: #ff9d00;
      margin-left: 10px;
    }
  }
  i {
    color: #888;
    cursor: pointer;
    margin: 0px 4px;
    font-size: 14px;
    font-weight: 600;
  }
}
</style>

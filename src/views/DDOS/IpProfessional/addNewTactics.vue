<template>
  <!-- 添加/修改 高级防护策略 -->
  <div class="wrapBox">
    <!-- 策略名称 -->
    <div>
      <span class="fontWeightBold">
        {{ $t("DDOS.Proteccon_figura.Policy_name") }}
      </span>
      <el-input
        class="tacticsName"
        v-model="tacticsName"
        :disabled="nameFlag == true ? false : true"
        @change="val"
      ></el-input>
    </div>
    <!-- 黑白名单表格 -->
    <div>
      <span class="fontWeightBold">
        {{ $t("DDOS.Proteccon_figura.Blackwhite_list") }}
      </span>
      <div class="tableConOne">
        <div class="tableConOneTop newClear">
          <el-button type="primary" @click="toAddBW">添加</el-button>
        </div>
        <el-button class="el-icon-search" @click="doFilterBlackWhiteList"></el-button>
        <el-input
          v-model="blackWhiteListInput"
          class="searchs"
          :placeholder="$t('DDOS.Proteccon_figura.filterIP')"
        ></el-input>
        <div>
          <el-table
            :data="
              BWListTemp.slice(
                (currentPage - 1) * pageSize,
                currentPage * pageSize
              )
            "
            empty-text="暫無數據"
          >
            <el-table-column prop="Type" label="策略">
              <template slot-scope="scope">
                <span v-if="scope.row.Type == 'black'">
                  {{ $t("DDOS.Proteccon_figura.Blacklist") }}
                </span>
                <span v-else-if="scope.row.Type == 'white'">
                  {{ $t("DDOS.Proteccon_figura.Whitelist") }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="Ip" label="地址">
              <template slot-scope="scope">{{ scope.row.Ip }}</template>
            </el-table-column>
            <el-table-column prop="action" label="操作" width="180">
              <template slot-scope="scope">
                <el-button
                  @click.native.prevent="toEditBW(scope.$index, scope.row)"
                  type="text"
                  size="small"
                >{{ $t("DDOS.Proteccon_figura.Edit") }}</el-button>
                <el-button
                  @click.native.prevent="deleteRowBW(scope.$index, scope.row)"
                  type="text"
                  size="small"
                >{{ $t("DDOS.Proteccon_figura.Delete") }}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="Right-style pagstyle">
          <span
            class="pagtotal"
          >共&nbsp;{{BWListTemp.length}}&nbsp;{{$t('DDOS.UnsealCode.tiao')}}</span>
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="pageSize"
            layout="prev, pager, next"
            :total="BWListTemp.length"
          ></el-pagination>
        </div>
      </div>
    </div>
    <!-- DDos高级安全策略 -->
    <div>
      <span class="fontWeightBold">
        {{ $t("DDOS.Proteccon_figura.Advanced_policy") }}
      </span>
      <!-- 禁用协议 -->
      <div class="childContTit">
        <h2>{{ $t("DDOS.Proteccon_figura.Disable_protocol") }}</h2>
        <el-checkbox-group v-model="DdisableProtocol">
          <el-checkbox label="ICMP" name="type"></el-checkbox>
          <el-checkbox label="TCP" name="type"></el-checkbox>
          <el-checkbox label="UDP" name="type"></el-checkbox>
          <el-checkbox :label="$t('DDOS.Proteccon_figura.Other_agreements')" name="type"></el-checkbox>
        </el-checkbox-group>
      </div>
      <!-- 禁用端口 -->
      <div class="childContTit">
        <h2>端口號</h2>
        <table class="table-div">
          <tr class="t-head">
            <td>{{ $t("DDOS.Proteccon_figura.Agreement") }}</td>
            <td>{{ $t("DDOS.Proteccon_figura.dklx") }}</td>
            <td>{{ $t("DDOS.Proteccon_figura.port_number") }}</td>
            <td>{{ $t("DDOS.Proteccon_figura.port_action") }}</td>
            <td>操作</td>
          </tr>
          <tr class="t-body" v-for="(item, index) in tags" :key="index">
            <td>
              <el-select
                class="selectChange"
                v-model="item.Protocol"
                :placeholder="$t('DDOS.Proteccon_figura.qxz')"
              >
                <el-option label="TCP" value="tcp"></el-option>
                <el-option label="UDP" value="udp"></el-option>
              </el-select>
            </td>
            <td>
              <el-select
                class="selectChange"
                v-model="item.Kind"
                :placeholder="$t('DDOS.Proteccon_figura.qxz')"
              >
                <el-option v-for="t in portArr" :key="t.value" :label="t.label" :value="t.value"></el-option>
              </el-select>
            </td>
            <td>
              <!-- 端口号 -->
              <el-input class="inputChange" v-model="item.portNum" autocomplete="off" @input="updateView($event)"></el-input>
            </td>
            <td>
              <!-- 动作 -->
              <el-select v-model="item.Action" :placeholder="$t('DDOS.AccesstoCon.searchAccess')">
                <el-option
                  v-for="(item, index) in actionList"
                  :label="item.label"
                  :value="item.value"
                  :key="index"
                ></el-option>
              </el-select>
            </td>
            <td>
              <a v-on:click="removeRow(index, 1)" v-show="index >= 0">
                {{ $t("DDOS.Proteccon_figura.Delete") }}
              </a>
            </td>
          </tr>
        </table>

        <a v-on:click="addRow(1)" class="addNewRow">添加</a>
      </div>
      <!-- 报文过滤特征 -->
      <div class="childContTit childContStyle">
        <h2>{{ $t("DDOS.Proteccon_figura.Message_features") }}</h2>
        <table class="table-div">
          <tr class="t-head">
            <td>{{ $t("DDOS.Proteccon_figura.Agreement") }}</td>
            <td>{{ $t("DDOS.Proteccon_figura.Start_portnumber") }}</td>
            <td>{{ $t("DDOS.Proteccon_figura.End_portnumbe") }}</td>
            <td>{{ $t("DDOS.Proteccon_figura.start_destination") }}</td>
            <td>{{ $t("DDOS.Proteccon_figura.end_destination") }}</td>
            <td>{{ $t("DDOS.Proteccon_figura.Minimum_length") }}</td>
            <td>{{ $t("DDOS.Proteccon_figura.Maximum_length") }}</td>
            <td>{{ $t("DDOS.Proteccon_figura.Monitoring_load") }}</td>
            <td>{{ $t("DDOS.Proteccon_figura.regular_expression") }}</td>
            <td>{{ $t("DDOS.Proteccon_figura.Offset") }}</td>
            <td>{{ $t("DDOS.Proteccon_figura.Inspectiondepth") }}</td>
            <td>是否包括</td>
            <td>{{ $t("DDOS.Proteccon_figura.character_string") }}</td>
            <td>策略</td>
            <td>操作</td>
          </tr>
          <tr class="t-body" v-for="(item, index) in tags1" :key="index">
            <td>
              <el-select
                class="selectChange1"
                v-model="item.Protocol"
                :placeholder="$t('DDOS.Proteccon_figura.qxz')"
                @change="protocolChange(index)"
              >
                <el-option label="TCP" value="tcp"></el-option>
                <el-option label="UDP" value="udp"></el-option>
                <!-- <el-option label="ICMP" value="icmp"></el-option>
                <el-option label="ALL" value="all"></el-option>-->
              </el-select>
            </td>
            <td>
              <el-input class="inputChange1" v-model="item.SportStart" autocomplete="off"></el-input>
            </td>
            <td>
              <el-input class="inputChange1" v-model="item.SportEnd" autocomplete="off"></el-input>
            </td>
            <td>
              <el-input class="inputChange1" v-model="item.DportStart" autocomplete="off"></el-input>
            </td>
            <td>
              <el-input class="inputChange1" v-model="item.DportEnd" autocomplete="off"></el-input>
            </td>
            <td>
              <el-input class="inputChange1" v-model="item.PktlenMin" autocomplete="off"></el-input>
            </td>
            <td>
              <el-input class="inputChange1" v-model="item.PktlenMax" autocomplete="off"></el-input>
            </td>
            <td>
              <el-select class="selectChange1" v-model="item.MatchBegin" @change="matchBeginChange(index)">
                <el-option
                  v-for="(item, index) in matchBeginList"
                  :label="item.label"
                  :value="item.value"
                  :key="index"
                ></el-option>
              </el-select>
            </td>
            <td>
              <el-select
                class="selectChange1"
                v-model="item.MatchType"
                :placeholder="$t('DDOS.Proteccon_figura.qxz')"
              >
                <el-option :label="$t('DDOS.updateddos.gjzi')" value="sunday"></el-option>
                <el-option :label="$t('DDOS.Proteccon_figura.regular_expression')" value="pcre"></el-option>
              </el-select>
            </td>
            <td>
              <el-input class="inputChange1" v-model="item.Offset" autocomplete="off" :disabled="item.MatchBegin == 'no_match'?true:false"></el-input>
            </td>
            <td>
              <el-input class="inputChange1" v-model="item.Depth" autocomplete="off" :disabled="item.MatchBegin == 'no_match'?true:false"></el-input>
            </td>
            <td>
              <el-select
                class="selectChange1"
                v-model="item.IsNot"
                :placeholder="$t('DDOS.Proteccon_figura.qxz')"
              >
                <el-option label="包含" :value="1"></el-option>
                <el-option label="不包含" :value="0"></el-option>
              </el-select>
            </td>
            <td>
              <el-input class="inputChange1" v-model="item.Str" autocomplete="off" :disabled="item.MatchBegin == 'no_match'?true:false"></el-input>
            </td>
            <td>
              <el-select
                class="selectChange1"
                v-model="item.Action"
                :placeholder="$t('DDOS.Proteccon_figura.qxz')"
              >
                <!-- 策略动作，取值范围[drop，drop_black，drop_rst，drop_black_rst，transmit] -->
                <el-option :label="$t('DDOS.updateddos.dqbw')" value="drop"></el-option>
                <el-option :label="$t('DDOS.updateddos.dqqlh')" value="drop_black"></el-option>
                <el-option v-if="item.Protocol == 'tcp'" :label="$t('DDOS.updateddos.dqqdk')" value="drop_rst"></el-option>
                <el-option v-if="item.Protocol == 'tcp'" :label="$t('DDOS.updateddos.dqdkqlh')" value="drop_black_rst"></el-option>
                <el-option :label="$t('DDOS.updateddos.zjzf')" value="transmit"></el-option>
              </el-select>
            </td>
            <td>
              <a
                v-on:click="removeRow(index, 2)"
                v-show="index >= 0"
              >{{$t('DDOS.AccesstoCon.AccDel')}}</a>
            </td>
          </tr>
        </table>
        <a v-on:click="addRow(2)" class="addNewRow">添加</a>
      </div>
      <!-- 限速 -->
      <div class="childContTit">
        <h2>限速</h2>
        <table class="table-div">
          <tr class="t-head">
            <td>{{ $t("DDOS.Proteccon_figura.Agreement") }}</td>
            <td>限速閾值</td>
            <td>操作</td>
          </tr>
          <tr class="t-body" v-for="(item, index) in tags3" :key="index">
            <td>
              <el-select
                class="selectChange"
                v-model="item.protocol"
                @change="ProV(item.protocol)"
                :placeholder="$t('DDOS.Proteccon_figura.qxz')"
              >
                <el-option label="ICMP" value="ICMP"></el-option>
                <el-option label="OTHER" value="OTHER"></el-option>
                <el-option label="TCP" value="TCP"></el-option>
                <el-option label="UDP" value="UDP"></el-option>
              </el-select>
            </td>
            <td>
              <el-input
                class="inputChange"
                v-model="item.speedLimit"
                @change="speedV(item.speedLimit)"
                autocomplete="off"
              ></el-input>Mbps
            </td>
            <td>
              <a
                v-on:click="removeRow(index, 3)"
                v-show="index >= 0"
              >{{$t('DDOS.AccesstoCon.AccDel')}}</a>
            </td>
          </tr>
        </table>
        <a v-on:click="addRow(3)" class="addNewRow">添加</a>
      </div>
      <!-- 拒绝海外流量 -->
      <div class="childContTit">
        <h2>{{ $t("DDOS.Proteccon_figura.overseas_traffic") }}</h2>
        <span class="spanStyleLabel">
          {{ $t("DDOS.Proteccon_figura.overseas_traffic") }}
        </span>
        <el-radio-group v-model="radios1">
          <el-radio label="關閉"></el-radio>
          <el-radio label="開啟"></el-radio>
        </el-radio-group>
      </div>
      <!-- 连接耗尽防护 -->
      <div class="childContTit">
        <!-- <h2>{{$t('DDOS.Proteccon_figura.overseas_traffic')}}</h2> -->
        <h2>連接耗盡防護</h2>
        <span class="spanStyleLabel">
          {{ $t("DDOS.Proteccon_figura.Air_protection") }}
          <el-tooltip class="item" effect="light" placement="bottom-start">
            <div
              slot="content"
              class="tooltip_text"
            >{{$t('DDOS.Proteccon_figura.Air_protection_tooltip')}}</div>
            <i class="el-icon-info"></i>
          </el-tooltip>
        </span>
        <el-radio-group v-model="radios2">
          <el-radio :label="$t('DDOS.Proteccon_figura.Shut_down')"></el-radio>
          <el-radio :label="$t('DDOS.Proteccon_figura.Opening')"></el-radio>
        </el-radio-group>
        <br />
        <span class="spanStyleLabel">
          {{ $t("DDOS.Proteccon_figura.Source_limit") }}
        </span>
        <el-radio-group v-model="radios3" @change="thisNextShowRow(3)">
          <!-- 源 -->
          <el-radio :label="$t('DDOS.Proteccon_figura.Shut_down')"></el-radio>
          <el-radio :label="$t('DDOS.Proteccon_figura.Opening')"></el-radio>
        </el-radio-group>
        <span v-if="thisRadio3">
          <el-input class="inputChange1" v-model="input3"></el-input>
          <span class="company">{{$t('DDOS.updateddos.g')}}/秒</span>
        </span>
        <br />
        <span class="spanStyleLabel">
          {{ $t("DDOS.Proteccon_figura.Sourceconnection") }}
        </span>
        <el-radio-group v-model="radios4" @change="thisNextShowRow(4)">
          <el-radio :label="$t('DDOS.Proteccon_figura.Shut_down')"></el-radio>
          <el-radio :label="$t('DDOS.Proteccon_figura.Opening')"></el-radio>
        </el-radio-group>
        <span v-if="thisRadio4">
          <el-input class="inputChange1" v-model="input4"></el-input>
          <span class="company">{{$t('DDOS.updateddos.g')}}</span>
        </span>
        <br />
        <span class="spanStyleLabel">
          {{ $t("DDOS.Proteccon_figura.Purpose_newconnection") }}
        </span>
        <el-radio-group v-model="radios5" @change="thisNextShowRow(5)">
          <el-radio :label="$t('DDOS.Proteccon_figura.Shut_down')"></el-radio>
          <el-radio :label="$t('DDOS.Proteccon_figura.Opening')"></el-radio>
        </el-radio-group>
        <span v-if="thisRadio5">
          <el-input class="inputChange1" v-model="input5"></el-input>
          <span class="company">{{$t('DDOS.updateddos.g')}}/秒</span>
        </span>
        <br />
        <span class="spanStyleLabel">
          {{ $t("DDOS.Proteccon_figura.Destination_concurren") }}
        </span>
        <el-radio-group v-model="radios6" @change="thisNextShowRow(6)">
          <el-radio :label="$t('DDOS.Proteccon_figura.Shut_down')"></el-radio>
          <el-radio :label="$t('DDOS.Proteccon_figura.Opening')"></el-radio>
        </el-radio-group>
        <span v-if="thisRadio6">
          <el-input class="inputChange1" v-model="input6"></el-input>
          <span class="company">{{$t('DDOS.updateddos.g')}}</span>
        </span>
      </div>
      <!-- 异常连接检测 -->
      <div class="childContTit">
        <h2>
          {{ $t("DDOS.Proteccon_figura.Abnormal_detection") }}
          <el-tooltip class="item" effect="light" placement="bottom-start">
            <div
              slot="content"
              class="tooltip_text"
            >{{$t('DDOS.Proteccon_figura.Abnormal_detection_tooltip')}}</div>
            <i class="el-icon-info"></i>
          </el-tooltip>
        </h2>
        <span class="spanStyleLabel">
          {{ $t("DDOS.Proteccon_figura.Abnormal_detection") }}
        </span>
        <el-radio-group v-model="radios7" @change="thisNextShow">
          <el-radio :label="$t('DDOS.Proteccon_figura.Shut_down')"></el-radio>
          <el-radio :label="$t('DDOS.Proteccon_figura.Opening')"></el-radio>
        </el-radio-group>
        <span v-if="thisRadio7">
          <el-input class="inputChange1" v-model="input7"></el-input>
          <span class="company">{{$t('DDOS.updateddos.g')}}</span>
        </span>
        <br />
        <div v-if="thisRadio7">
          <span class="spanStyleLabel">Syn報文占比檢測:</span>
          <el-radio-group v-model="radios8" @change="thisNextShowRow(8)">
            <el-radio :label="$t('DDOS.Proteccon_figura.Shut_down')"></el-radio>
            <el-radio :label="$t('DDOS.Proteccon_figura.Opening')"></el-radio>
          </el-radio-group>
          <span v-if="thisRadio8">
            <span class="spanText">Syn報文占比檢測:</span>
            <el-input class="inputChange1" v-model="input8"></el-input>
          </span>
          <br />
          <span class="spanStyleLabel">Syn報文數檢測</span>
          <el-radio-group v-model="radios9" @change="thisNextShowRow(9)">
            <el-radio :label="$t('DDOS.Proteccon_figura.Shut_down')"></el-radio>
            <el-radio :label="$t('DDOS.Proteccon_figura.Opening')"></el-radio>
          </el-radio-group>
          <span v-if="thisRadio9">
            <span class="spanText">Syn報文數檢測：</span>
            <el-input class="inputChange1" v-model="input9"></el-input>
          </span>
          <br />
          <span class="spanStyleLabel">連接超時檢測</span>
          <el-radio-group v-model="radios10" @change="thisNextShowRow(10)">
            <el-radio :label="$t('DDOS.Proteccon_figura.Shut_down')"></el-radio>
            <el-radio :label="$t('DDOS.Proteccon_figura.Opening')"></el-radio>
          </el-radio-group>
          <span v-if="thisRadio10">
            <el-input class="inputChange1" v-model="input10"></el-input>
            <span class="company">秒</span>
          </span>
          <br />
          <span class="spanStyleLabel">異常空連接防護</span>
          <el-radio-group v-model="radios11">
            <el-radio :label="$t('DDOS.Proteccon_figura.Shut_down')"></el-radio>
            <el-radio :label="$t('DDOS.Proteccon_figura.Opening')"></el-radio>
          </el-radio-group>
        </div>
      </div>
      <!-- 水印防护 -->
      <div class="childContTit">
        <h2>{{ $t("DDOS.Proteccon_figura.Watermark_protection") }}</h2>
        <el-table :data="tableDataBegin2" class="tableBorderTop" empty-text="暫無數據">
          <el-table-column :label="$t('DDOS.Proteccon_figura.TCP_protectionport')" prop="tcpPort">
            <template slot-scope="scope">{{scope.row.tcpPort.join()}}</template>
          </el-table-column>
          <el-table-column :label="$t('DDOS.Proteccon_figura.UDP_protectionport')" prop="udpPort">
            <template slot-scope="scope">{{scope.row.udpPort.join()}}</template>
          </el-table-column>
          <el-table-column :label="$t('DDOS.Proteccon_figura.UDP_split')" prop="RemoveSwitch">
            <template slot-scope="scope">
              {{ scope.row.RemoveSwitch == 0 ? "不自動剝離" : "自動剝離" }}
            </template>
          </el-table-column>
          <!-- 策略开关 -->
          <el-table-column :label="$t('DDOS.Proteccon_figura.Policy_switch')" prop="OpenStatus">
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.OpenStatus"
                :placeholder="$t('DDOS.AccesstoCon.searchAccess')"
              >
                <el-option
                  v-for="(item, index) in openStatusList"
                  :label="item.label"
                  :value="item.value"
                  :key="index"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="action" label="操作" width="180">
            <template slot-scope="scope">
              <el-button @click="modifyRow(scope.$index, scope.row)" type="text" size="small">修改配置</el-button>
            </template>
          </el-table-column>
        </el-table>
        <a href="#" class="addNewRow" @click.once="dialogVisible = true" v-if="tableDataBegin2.length<1">
          {{ $t("DDOS.Proteccon_figura.Click_open") }}
        </a>
        <el-dialog
          title="水印創建"
          :visible.sync="dialogVisible"
          width="50%"
          :before-close="handleClose"
        >
          <div class="childContTit childContTitModel">
            <h2>{{ $t("DDOS.Proteccon_figura.TCP_port") }}</h2>
            <table class="table-div">
              <tr class="t-head">
                <td>{{ $t("DDOS.Proteccon_figura.Start_portnumber") }}</td>
                <td>{{ $t("DDOS.Proteccon_figura.End_portnumbe") }}</td>
                <td>操作</td>
              </tr>
              <tr class="t-body" v-for="(item, index) in tags4" :key="index">
                <td>
                  <el-input class="inputChange" v-model="item.beginPort" autocomplete="off"></el-input>
                </td>
                <td>
                  <el-input class="inputChange" v-model="item.endPort" autocomplete="off"></el-input>
                </td>
                <td>
                  <a v-on:click="removeRow(index, 4)" v-show="index >= 0">
                    {{ $t("DDOS.Proteccon_figura.Delete") }}
                  </a>
                </td>
              </tr>
            </table>
            <a v-on:click="addRow(4)" class="addNewRow">添加</a>
            <p>{{ $t("DDOS.Proteccon_figura.port_segments") }}</p>
          </div>
          <div class="childContTit childContTitModel">
            <h2>{{ $t("DDOS.Proteccon_figura.UDP_protocolport") }}</h2>
            <table class="table-div">
              <tr class="t-head">
                <td>{{ $t("DDOS.Proteccon_figura.Start_portnumber") }}</td>
                <td>{{ $t("DDOS.Proteccon_figura.End_portnumbe") }}</td>
                <td>操作</td>
              </tr>
              <tr class="t-body" v-for="(item, index) in tags5" :key="index">
                <td>
                  <el-input class="inputChange" v-model="item.beginPort" autocomplete="off"></el-input>
                </td>
                <td>
                  <el-input class="inputChange" v-model="item.endPort" autocomplete="off"></el-input>
                </td>
                <td>
                  <a
                    v-on:click="removeRow(index, 5)"
                    v-show="index >= 0"
                  >{{$t('DDOS.AccesstoCon.AccDel')}}</a>
                </td>
              </tr>
            </table>
            <a v-on:click="addRow(5)" class="addNewRow">添加</a>
            <p>{{ $t("DDOS.Proteccon_figura.UDP_protection") }}</p>
          </div>
          <div class="childContTit childContTitModel">
            <h2>
              <span class="hSpanTit">
                {{ $t("DDOS.Proteccon_figura.Automatic_stripping") }}
              </span>
              <el-radio-group v-model="radios12">
                <el-radio :label="$t('DDOS.Proteccon_figura.Shut_down')"></el-radio>
                <el-radio :label="$t('DDOS.Proteccon_figura.Opening')"></el-radio>
              </el-radio-group>
            </h2>
            <p>{{ $t("DDOS.Proteccon_figura.After_passing") }}</p>
          </div>
          <div class="childContTit childContTitNoBorder">
            <h2>
              <span class="hSpanTit">偏移量</span>
              <el-input class="OffsetNum" v-model="moveNum"></el-input>
            </h2>
            <p>{{ $t("DDOS.Proteccon_figura.Specify") }}</p>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="createSY">
              {{ $t("DDOS.Proteccon_figura.Determination") }}
            </el-button>
          </span>
        </el-dialog>
      </div>
      <div class="bottomBtn">
        <el-button
          type="primary"
          @click="createDDoSPolicy(true)"
          v-if="nameFlag"
        >{{$t('DDOS.AccesstoCon.ImSure')}}</el-button>
        <el-button
          type="primary"
          @click="createDDoSPolicy(false)"
          v-else
        >{{$t('DDOS.AccesstoCon.ImSure')}}</el-button>
        <el-button @click="closeAddPage">取消</el-button>
      </div>
    </div>
    <!-- 添加 黑白名单弹框 -->
    <el-dialog
      class="dialogModelAddBw"
      :title="$t('DDOS.updateddos.tjhbmd')"
      :visible.sync="dialogModelAddBw"
      width="40%"
      :before-close="handleCloseAddBw"
    >
      <div class="contantList newClear">
        <p class="tc-15-msg" v-if="checkflg == false">{{this.errorMsg}}</p>
        <div class="newClear">
          <p>地址</p>
          <p>
            <el-input
              class="inputText"
              v-model="blackWhiteText"
              type="textarea"
              :placeholder="$t('DDOS.updateddos.qsrdz')"
            ></el-input>
          </p>
        </div>
        <div class="newClear">
          <p>{{ $t("DDOS.Proteccon_figura.CeLue") }}</p>
          <p>
            <el-radio-group v-model="blackOrWhite" class="blackWhiteBtn">
              <el-radio-button label="black">黑名單</el-radio-button>
              <el-radio-button label="white">白名單</el-radio-button>
            </el-radio-group>
          </p>
        </div>
      </div>
      <span class="footerBw">
        <el-button @click="addBWSure">{{$t('DDOS.AccesstoCon.ImSure')}}</el-button>
        <el-button @click="dialogModelAddBw = false">取消</el-button>
      </span>
    </el-dialog>
    <!-- 编辑 黑白名单弹框 -->
    <el-dialog
      class="dialogModelAddBw"
      :title="$t('DDOS.updateddos.bjhnmd')"
      :visible.sync="dialogEdit"
      width="40%"
    >
      <div class="contantList newClear">
        <p class="tc-15-msg" v-if="checkflg == false">{{this.errorMsg}}</p>
        <div class="newClear">
          <p>地址</p>
          <p>
            <el-input
              class="inputText"
              v-model="blackWhiteText"
              type="textarea"
              :placeholder="$t('DDOS.updateddos.qsrdz')"
            ></el-input>
          </p>
        </div>
        <div class="newClear">
          <p>{{ $t("DDOS.Proteccon_figura.CeLue") }}</p>
          <p>
            <el-radio-group v-model="blackOrWhite" class="blackWhiteBtn">
              <el-radio-button label="black">黑名單</el-radio-button>
              <el-radio-button label="white">白名單</el-radio-button>
            </el-radio-group>
          </p>
        </div>
      </div>
      <span class="footerBw">
        <el-button @click="editBWSure">{{$t('DDOS.AccesstoCon.ImSure')}}</el-button>
        <el-button @click="dialogEdit = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { DDOS_POLICY_CREATE, DDOS_POLICY_MODIFY } from "@/constants";
import { ErrorTips } from "@/components/ErrorTips";
export default {
  props: {
    isShow: Boolean,
    policy: Object
  },
  data() {
    return {
      tacticsName: "", // 策略名称
      nameFlag: true, //名称是否可编辑 true:可编辑
      tags: [],
      tags1: [],
      tags3: [],
      tags4: [],
      tags5: [],
      tableDataName1: "",
      // 黑白名单
      blackWhiteListInput: "",
      IpBlackWhiteLists: [], //黑白名单数据
      BWListTemp: [], //黑白名单临时数据（条件搜索时显示使用）
      dialogModelAddBw: false, //添加黑白名单弹框
      blackWhiteText: "",
      blackOrWhite: "black", // 黑名单/白名单
      dialogEdit: false, //编辑黑白名单弹框
      BWIndex: 0, //编辑黑白名单时跳转弹框需要记忆临时数据BWListTemp的索引
      // 禁用端口数据
      portArr: [
        { value: 0, label: "目的端口" },
        { value: 1, label: "源端口" },
        { value: 2, label: "目的端口和源端口" }
      ],
      actionList: [
        { value: "drop", label: "丟棄" },
        { value: "transmit", label: "轉發" }
      ],
      openStatusList: [
        { value: 1, label: "開啟" },
        { value: 0, label: "關閉" }
      ],
      checkflg: true,
      errorMsg: "",
      tableDataBegin2: [], //水印防护
      tableDataEnd: [],
      currentPage: 1,
      pageSize: 10,
      totalItems: 0,
      filterTableDataEnd: [],
      flag: false,
      multipleSelection: [],
      dialogVisible: false,
      filterConrent: "",
      matchBeginList: [
        { label: "不檢測", value: "no_match" },
        { label: "IP頭開始檢查", value: "begin_l3" },
        { label: "TCP/UDP頭開始檢查", value: "begin_l4" },
        { label: "載荷開始檢查", value: "begin_l5" }
      ], //报文过滤特征检测
      DdisableProtocol: [], //禁用协议
      radios1: "關閉", //拒绝海外流量
      radios2: "關閉",
      radios3: "關閉",
      radios4: "關閉",
      radios5: "關閉",
      radios6: "關閉",
      radios7: "關閉",
      radios8: "關閉",
      radios9: "關閉",
      radios10: "關閉",
      radios11: "關閉",
      radios12: "關閉",
      moveNum: 0, //水印防护偏移量
      thisRadio3: false,
      input3: "",
      thisRadio4: false,
      input4: "",
      thisRadio5: false,
      input5: "",
      thisRadio6: false,
      input6: "",
      thisRadio7: false, //异常链接检测
      input7: "",
      thisRadio8: false,
      input8: "",
      thisRadio9: false,
      input9: "",
      thisRadio10: false,
      input10: "",
      policyTemp: {}, //编辑用的暂存对象
      depthChangeVale: 0, //depth[0-1500]
      proStr: "", //全局协议
      speedStr: "",
      deleteBegin: {}
    };
  },
  watch: {
    // 搜索 黑白名单
    blackWhiteListInput: function() {
      this.doFilterBlackWhiteList();
    }
  },
  created() {
    //根据有无对象传入，判断是添加还是配置
    if (this.policy.PolicyId == undefined) {
    } else {
      //配置
      // console.log(this.policyTemp);
      this.policyTemp = JSON.parse(JSON.stringify(this.policy));
      this.tacticsName = this.policyTemp.PolicyName;
      this.nameFlag = false;
      this.IpBlackWhiteLists = this.policyTemp.IpBlackWhiteLists;
      this.BWListTemp = JSON.parse(JSON.stringify(this.IpBlackWhiteLists)); // 黑白名单临时数据（条件搜索使用)
      this.DdisableProtocol.push(
        this.policyTemp.DropOptions.DropTcp == 0 ? "" : "TCP"
      );
      this.DdisableProtocol.push(
        this.policyTemp.DropOptions.DropUdp == 0 ? "" : "UDP"
      );
      this.DdisableProtocol.push(
        this.policyTemp.DropOptions.DropIcmp == 0 ? "" : "ICMP"
      );
      this.DdisableProtocol.push(
        this.policyTemp.DropOptions.DropOther == 0 ? "" : "其他協議"
      );
      this.tags = JSON.parse(JSON.stringify(this.policyTemp.PortLimits)); //禁用协议
      for (let i in this.tags) {
        if (this.policyTemp.PortLimits[i].Kind == 1) { //源端口
          if (this.tags[i].SPortStart == this.tags[i].SPortEnd) {
            this.tags[i].portNum = this.policyTemp.PortLimits[i].SPortStart;
          } else {
            this.tags[i].portNum = this.policyTemp.PortLimits[i].SPortStart + "-" + this.policyTemp.PortLimits[i].SPortEnd;
          }
        } else {
          if (this.tags[i].DPortStart == this.tags[i].DPortEnd) {
            this.tags[i].portNum = this.policyTemp.PortLimits[i].DPortStart;
          } else {
            this.tags[i].portNum = this.policyTemp.PortLimits[i].DPortStart + "-" + this.policyTemp.PortLimits[i].DPortEnd;
          }
        }
      }
      this.tags1 = this.policyTemp.PacketFilters; //报文
      // var speedLimit="";
      if (this.policyTemp.DropOptions.DIcmpMbpsLimit) {
        this.tags3.push({
          protocol: "ICMP",
          speedLimit: this.policyTemp.DropOptions.DIcmpMbpsLimit
        });
      }
      if (this.policyTemp.DropOptions.DOtherMbpsLimit) {
        this.tags3.push({
          protocol: "OTHER",
          speedLimit: this.policyTemp.DropOptions.DOtherMbpsLimit
        });
      }
      if (this.policyTemp.DropOptions.DUdpMbpsLimit) {
        this.tags3.push({
          protocol: "UDP",
          speedLimit: this.policyTemp.DropOptions.DUdpMbpsLimit
        });
      }
      if (this.policyTemp.DropOptions.DTcpMbpsLimit) {
        this.tags3.push({
          protocol: "TCP",
          speedLimit: this.policyTemp.DropOptions.DTcpMbpsLimit
        });
      }
      if (this.policyTemp.DropOptions.DropAbroad == 0) {
        this.radios1 = "關閉"; //拒绝海外流量
      } else {
        this.radios1 = "開啟";
      }
      if (this.policyTemp.DropOptions.CheckSyncConn == 0) {
        this.radios2 = "關閉";
      } else {
        this.radios2 = "開啟";
      }
      if (this.policyTemp.DropOptions.SdNewLimit == 0) {
        //基于来源IP及目的IP的新建连接抑制
        this.radios3 = "關閉";
      } else {
        this.radios3 = "開啟";
        this.thisRadio3 = true;
        this.input3 = this.policyTemp.DropOptions.SdNewLimit;
      }
      if (this.policyTemp.DropOptions.SdConnLimit == 0) {
        //基于来源IP及目的IP的并发连接抑制
        this.radios4 = "關閉";
      } else {
        this.radios4 = "開啟";
        this.thisRadio4 = true;
        this.input4 = this.policyTemp.DropOptions.SdConnLimit;
      }
      if (this.policyTemp.DropOptions.DstNewLimit == 0) {
        //基于目的IP的新建连接抑制
        this.radios5 = "關閉";
      } else {
        this.radios5 = "開啟";
        this.thisRadio5 = true;
        this.input5 = this.policyTemp.DropOptions.DstNewLimit;
      }
      if (this.policyTemp.DropOptions.DstConnLimit == 0) {
        //基于目的IP的并发连接抑制
        this.radios6 = "關閉";
      } else {
        this.radios6 = "開啟";
        this.thisRadio6 = true;
        this.input6 = this.policyTemp.DropOptions.DstConnLimit;
      }
      if (this.policyTemp.DropOptions.BadConnThreshold == 0) {
        //基于连接抑制触发阈值
        this.radios7 = "關閉";
      } else {
        this.radios7 = "開啟";
        this.thisRadio7 = true;
        this.input7 = this.policyTemp.DropOptions.BadConnThreshold;
      }
      if (this.policyTemp.DropOptions.SynRate == 0) {
        //syn占比ack百分比
        this.radios8 = "關閉";
      } else {
        this.radios8 = "開啟";
        this.thisRadio8 = true;
        this.input8 = this.policyTemp.DropOptions.SynRate;
      }
      if (this.policyTemp.DropOptions.SynLimit == 0) {
        //syn阈值
        this.radios9 = "關閉";
      } else {
        this.radios9 = "開啟";
        this.thisRadio9 = true;
        this.input9 = this.policyTemp.DropOptions.SynLimit;
      }
      if (this.policyTemp.DropOptions.ConnTimeout == 0) {
        //连接超时
        this.radios10 = "關閉";
      } else {
        this.radios10 = "開啟";
        this.thisRadio10 = true;
        this.input10 = this.policyTemp.DropOptions.ConnTimeout;
      }
      if (this.policyTemp.DropOptions.NullConnEnable == 0) {
        this.radios11 = "關閉";
      } else {
        this.radios11 = "開啟";
      }
      if (this.policyTemp.WaterPrint[0]) {
        this.moveNum = this.policyTemp.WaterPrint[0].Offset;
        if (this.policyTemp.WaterPrint[0].RemoveSwitch == 0) {
          this.radios12 = "關閉";
        } else {
          this.radios12 = "開啟";
        }
        var des = this.policyTemp.WaterPrint[0].TcpPortList;
        this.tags4 = this.turn(des);
        var des1 = this.policyTemp.WaterPrint[0].UdpPortList;
        this.tags5 = this.turn(des1);
        this.tableDataBegin2.push({
          tcpPort: this.policyTemp.WaterPrint[0].TcpPortList,
          udpPort: this.policyTemp.WaterPrint[0].UdpPortList,
          RemoveSwitch: this.radios12,
          OpenStatus: this.policyTemp.WaterPrint[0].OpenStatus,
          Offset: this.moveNum
        });
      }
    }
  },
  methods: {
    turn(arr) {
      var newArr = [];
      arr.forEach(index => {
        newArr.push({
          Protocol: "",
          tortType: "",
          beginPort: index.split("-")[0],
          endPort: index.split("-")[1]
        });
      });
      return newArr;
    },
    ProV(p) {
      //限速 ===》协议
      this.proStr = p;
    },
    speedV(s) {
      //限速 ===》阈值
      this.speedStr = s;
    },
    //判断策略名称
    val: function() {
      if (this.tacticsName == "") {
        this.$message("請填寫策略名稱");
      }
    },
    modifyRow(index, dataBegin) {
      //配置水印
      this.dialogVisible = true;
    },
    // 添加DDoS高级策略
    createDDoSPolicy(bl) {
      this.tacticsName = this.tacticsName.replace(/^\s*|\s*$/g, "");
      if (this.tacticsName.length <= 0 || this.tacticsName.length > 32) {
        this.$message("策略名稱不符合規範（兩端無空格,長度1-32字符）");
      } else {
        let params = {
          Version: "2018-07-09",
          Region: localStorage.getItem("regionv2"),
          Business: "net",
          // DropOptions.N 协议禁用，必须填写且数组长度必须为1
          "DropOptions.0.DropTcp":
            this.DdisableProtocol.indexOf("TCP") > -1 ? 1 : 0,
          "DropOptions.0.DropUdp":
            this.DdisableProtocol.indexOf("UDP") > -1 ? 1 : 0,
          "DropOptions.0.DropIcmp":
            this.DdisableProtocol.indexOf("ICMP") > -1 ? 1 : 0,
          "DropOptions.0.DropOther":
            this.DdisableProtocol.indexOf("其他協議") > -1 ? 1 : 0,
          "DropOptions.0.DropAbroad": this.radios1 == "開啟" ? 1 : 0, // 拒绝海外流量

          "DropOptions.0.CheckSyncConn": this.radios2 == "開啟" ? 1 : 0, //空链接防护
          "DropOptions.0.SdNewLimit": this.radios3 == "開啟" ? 1 : 0, //基于来源IP及目的IP的新建连接抑制
          "DropOptions.0.SdConnLimit": this.radios4 == "開啟" ? 1 : 0, //基于来源IP及目的IP的并发连接抑制
          "DropOptions.0.DstNewLimit": this.radios5 == "開啟" ? 1 : 0, //基于目的IP的新建连接抑制
          "DropOptions.0.DstConnLimit": this.radios6 == "開啟" ? 1 : 0, //基于目的IP的并发连接抑制

          "DropOptions.0.BadConnThreshold": this.radios7 == "開啟" ? 1 : 0, //基于连接抑制触发阈值
          "DropOptions.0.SynRate": this.radios8 == "開啟" ? 1 : 0, //syn占比ack百分比
          "DropOptions.0.SynLimit": this.radios9 == "開啟" ? 1 : 0, //syn阈值
          "DropOptions.0.ConnTimeout": this.radios10 == "開啟" ? 1 : 0, //连接超时
          "DropOptions.0.NullConnEnable": this.radios11 == "開啟" ? 1 : 0 //空连接防护开关
        };
        // IpAllowDenys.N IP黑白名单，当没有IP黑白名单时填空数组
        for (let i in this.IpBlackWhiteLists) {
          params["IpAllowDenys." + i + ".Ip"] = this.IpBlackWhiteLists[i].Ip;
          params["IpAllowDenys." + i + ".Type"] = this.IpBlackWhiteLists[
            i
          ].Type;
        }

        this.tags3.map((item, index) => {
          if (item.protocol == "ICMP") {
            params["DropOptions.0.DIcmpMbpsLimit"] = item.speedLimit;
          }
          if (item.protocol == "OTHER") {
            params["DropOptions.0.DOtherMbpsLimit"] = item.speedLimit
          }
          if (item.protocol == "TCP") {
            params["DropOptions.0.DTcpMbpsLimit"] = item.speedLimit
          }
          if (item.protocol == "UDP") {
            params["DropOptions.0.DUdpMbpsLimit"] = item.speedLimit
          }
        });
        if (this.radios3 == "開啟") {
          params["DropOptions.0.SdNewLimit"] = this.input3; //基于来源IP及目的IP的新建连接抑制
        }
        if (this.radios4 == "開啟") {
          params["DropOptions.0.SdConnLimit"] = this.input4; //基于来源IP及目的IP的并发连接抑制
        }
        if (this.radios5 == "開啟") {
          params["DropOptions.0.DstNewLimit"] = this.input5; //基于目的IP的新建连接抑制
        }
        if (this.radios6 == "開啟") {
          params["DropOptions.0.DstConnLimit"] = this.input6; //基于目的IP的并发连接抑制
        }
        if (this.radios7 == "開啟") {
          params["DropOptions.0.BadConnThreshold"] = this.input7; //基于连接抑制触发阈值
        }
        if (this.radios8 == "開啟") {
          params["DropOptions.0.SynRate"] = this.input8; //syn占比ack百分比
        }
        if (this.radios9 == "開啟") {
          params["DropOptions.0.SynLimit"] = this.input9; //syn阈值
        }
        if (this.radios10 == "開啟") {
          params["DropOptions.0.ConnTimeout"] = this.input10; //连接超时
        }
        // PortLimits.N 端口禁用，当没有禁用端口时填空数组
        let regNUM = /(^[0-9]\d*$)/;
        for (let i in this.tags) {
          if (this.tags[i].portNum.length != "") {//此处对输入的端口区间进行校验
            let portArr = (this.tags[i].portNum+"").split('-');
            for (let i in portArr) {
              if (!regNUM.test(portArr[i])) {
                this.$message({
                  message: "端口號錯誤，未輸入有效值",
                  type: "warning",
                  showClose: true,
                  duration: 0
                });
                return
              }
            }
            if (portArr.length === 1) {
              portArr[1] = portArr[0]
            }
            if (portArr[0] < 0 || portArr[0] > 65535 || portArr[1] < 0 || portArr[1] > 65535) {
              this.$message({
                message: "端口號錯誤，限制範圍[0-65535]",
                type: "warning",
                showClose: true,
                duration: 0
              });
              return
            }
            if (portArr[0] > portArr[1]) {
              this.$message({
                message: "端口號錯誤，要求結束端口大於等於開始端口",
                type: "warning",
                showClose: true,
                duration: 0
              });
              return
            }
            params["PortLimits." + i + ".Protocol"] = this.tags[i].Protocol; //协议，取值范围[tcp,udp,icmp,all]
            params["PortLimits." + i + ".Kind"] = this.tags[i].Kind; //取值[0（目的端口范围禁用）， 1（源端口范围禁用）， 2（目的和源端口范围同时禁用）]
            params["PortLimits." + i + ".DPortStart"] = portArr[0]; //开始目的端口，取值范围[0,65535]
            params["PortLimits." + i + ".DPortEnd"] = portArr[1]; //结束目的端口，取值范围[0,65535]，要求大于等于开始目的端口
            if (this.tags[i].Kind != 0) {
              params["PortLimits." + i + ".SPortStart"] = portArr[0]; //开始源端口，取值范围[0,65535]
              params["PortLimits." + i + ".SPortEnd"] = portArr[1]; //结束源端口，取值范围[0,65535]，要求大于等于开始源端口
            }
            params["PortLimits." + i + ".Action"] = this.tags[i].Action; //执行动作，取值[drop(丢弃) ，transmit(转发)]
          } else {
            this.$message({
              message: "端口號錯誤，未輸入有效值",
              type: "warning",
              showClose: true,
              duration: 0
            });
            return
          }
        }
        // PacketFilters.N 报文过滤特征，当没有报文过滤时填空数组
          for (let i in this.tags1) {
            params["PacketFilters." + i + ".Protocol"] = this.tags1[i].Protocol;
          params["PacketFilters." + i + ".SportStart"] = this.tags1[i].SportStart;
            params["PacketFilters." + i + ".SportEnd"] = this.tags1[i].SportEnd;
          params["PacketFilters." + i + ".DportStart"] = this.tags1[i].DportStart;
            params["PacketFilters." + i + ".DportEnd"] = this.tags1[i].DportEnd;
          params["PacketFilters." + i + ".PktlenMin"] = this.tags1[i].PktlenMin;
          params["PacketFilters." + i + ".PktlenMax"] = this.tags1[i].PktlenMax;
          params["PacketFilters." + i + ".MatchBegin"] = this.tags1[i].MatchBegin;
          params["PacketFilters." + i + ".MatchType"] = this.tags1[i].MatchType;
            params["PacketFilters." + i + ".Str"] = this.tags1[i].Str;
            params["PacketFilters." + i + ".Depth"] = this.tags1[i].Depth;
            params["PacketFilters." + i + ".Offset"] = this.tags1[i].Offset;
            params["PacketFilters." + i + ".IsNot"] = this.tags1[i].IsNot;
            params["PacketFilters." + i + ".Action"] = this.tags1[i].Action;
          }
          // WaterPrint.N 水印策略参数，当没有启用水印功能时填空数组，最多只能传一条水印策略（即数组大小不超过1）
        for (let i in this.tableDataBegin2) {
          params["WaterPrint." + i + ".Offset"] = this.tableDataBegin2[i].Offset; //	水印偏移量，取值范围[0, 100)
          params["WaterPrint." + i + ".RemoveSwitch"] = this.tableDataBegin2[i].RemoveSwitch; //是否自动剥离，取值[0（不自动剥离），1（自动剥离）]
          params["WaterPrint." + i + ".OpenStatus"] = this.tableDataBegin2[i].OpenStatus;

          let arr = this.tableDataBegin2[i].tcpPort.map(t => {
            return t.split(",");
          });
          if (arr == []) {
            this.$message("TCP防護端口不能為空");
            return;
          }
          arr.forEach((item, index) => {
            params["WaterPrint." + i + ".TcpPortList." + index] = item[0];
          });
          let arr2 = this.tableDataBegin2[i].udpPort.map(t => {
            return t.split(",");
          });
          if (this.radios12 == "開啟") {
            if (arr2.length == 0) {
              this.$message("開啟UDP防護端口不能為空");
              return;
            }
          }
          arr2.forEach((item, index) => {
            params["WaterPrint." + i + ".UdpPortList." + index] = item[0];
          });
        }
        if (bl) {
          params.Name = this.tacticsName;
          // console.log(params, "tianjia");
          this.axios.post(DDOS_POLICY_CREATE, params).then(res => {
            if (res.Response.Error === undefined) {
              this.$message({
                message: "添加成功",
                type: "success",
                showClose: true,
                duration: 0
              });
              // 关闭添加页面
              this.closeAddPage();
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
        } else {
          params.PolicyId = this.policy.PolicyId;
          // console.log(params, "xiugai");
          this.axios.post(DDOS_POLICY_MODIFY, params).then(res => {
            if (res.Response.Error === undefined) {
              this.$message({
                message: "修改成功",
                type: "success",
                showClose: true,
                duration: 0
              });
              // 关闭修改页面
              this.closeAddPage();
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
        }
      }
    },
    handleClose(done) {
      this.dialogVisible = false;
    },
    delItem(item, list) {
      //去除指定值
      list.splice(list.indexOf(item), 1);
    },
    // 搜索
    doFilter() {
      //页面数据改变重新统计数据数量和当前页
      this.currentPage = 1;
      this.totalItems = this.filterTableDataEnd.length;
      //渲染表格,根据值
      this.currentChangePage(this.filterTableDataEnd);
      //页面初始化数据需要判断是否检索过
      this.flag = true;
    },
    openData() {},
    // 分页开始
    handleSizeChange(val) {
      this.pageSize = val;
      this.handleCurrentChange(this.currentPage);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      //需要判断是否检索
      if (!this.flag) {
        this.currentChangePage(this.tableDataEnd);
      } else {
        this.currentChangePage(this.filterTableDataEnd);
      }
    }, //组件自带监控当前页码
    currentChangePage(list) {
      let from = (this.currentPage - 1) * this.pageSize;
      let to = this.currentPage * this.pageSize;
      this.tableDataEnd = [];
      for (; from < to; from++) {
        if (list[from]) {
          this.tableDataEnd.push(list[from]);
        }
      }
    },
    //关闭新增页面
    closeAddPage() {
      this.tableShow = true;
      this.$emit("closePage", { message: this.tableShow });
    },
    // 报文过滤特征
    protocolChange(i){
      if (this.tags1[i].Protocol == "udp") {
        if (this.tags1[i].Action == "drop_rst" || this.tags1[i].Action == "drop_black_rst") {
          this.tags1[i].Action = "drop";
        }
      }
    },
    matchBeginChange(i){
      if (this.tags1[i].MatchBegin == "no_match") {
        this.tags1[i].Offset = 0;
        this.tags1[i].Depth = 1;
        this.tags1[i].Str = "";
      }
    },
    //新增一行
    addRow: function(type) {
      var des = {Protocol: "tcp", tortType: "", beginPort: "", endPort: ""};
      if (type == 1) {
        if (this.tags.length >= 16) {
          this.$message("禁用端口數量不能超過16條");
          return;
        }
        des.portNum = "";
        des.Action = "drop";
        this.tags.push(des);
      } else if (type == 2) {
        if (this.tags1.length >= 5) {
          this.$message("報文過濾特徵不能超過5條");
          return;
        }
        des.PktlenMin = 0;
        des.PktlenMax = 0;
        des.MatchType = "sunday";
        des.Offset = 0;
        des.Depth = 1;
        des.IsNot = 1;
        des.MatchBegin = "no_match";
        des.Action = "drop";
        this.tags1.push(des);
      } else if (type == 3) {
        if (this.tags3.length >= 4) {
          this.$message("最多添加有四條協議限速");
          return;
        }
        this.tags3.push(des);
      } else if (type == 4) {
        if (this.tags4.length >= 5) {
          this.$message("端口段不能超過五條");
          return;
        }
        this.tags4.push(des);
      } else if (type == 5) {
        if (this.tags5.length >= 5) {
          this.$message("端口段不能超過五條");
          return;
        }
        this.tags5.push(des);
      }
    },
    // 删除一行
    removeRow: function(idx, typeNode) {
      if (typeNode == 1) {
        this.tags.splice(idx, 1);
      } else if (typeNode == 2) {
        this.tags1.splice(idx, 1);
      } else if (typeNode == 3) {
        this.tags3.splice(idx, 1);
      } else if (typeNode == 4) {
        this.tags4.splice(idx, 1);
      } else if (typeNode == 5) {
        this.tags5.splice(idx, 1);
      }
    },
    thisNextShow() {
      if (this.radios7 == "開啟") {
        this.thisRadio7 = true;
      } else {
        this.thisRadio7 = false;
      }
    },
    thisNextShowRow(radioNumber) {
      if (radioNumber == 3) {
        if (this.radios3 == "開啟") {
          this.thisRadio3 = true;
        } else {
          this.thisRadio3 = false;
        }
      } else if (radioNumber == 4) {
        if (this.radios4 == "開啟") {
          this.thisRadio4 = true;
        } else {
          this.thisRadio4 = false;
        }
      } else if (radioNumber == 5) {
        if (this.radios5 == "開啟") {
          this.thisRadio5 = true;
        } else {
          this.thisRadio5 = false;
        }
      } else if (radioNumber == 6) {
        if (this.radios6 == "開啟") {
          this.thisRadio6 = true;
        } else {
          this.thisRadio6 = false;
        }
      } else if (radioNumber == 8) {
        if (this.radios8 == "開啟") {
          this.thisRadio8 = true;
        } else {
          this.thisRadio8 = false;
        }
      } else if (radioNumber == 9) {
        if (this.radios9 == "開啟") {
          this.thisRadio9 = true;
        } else {
          this.thisRadio9 = false;
        }
      } else if (radioNumber == 10) {
        if (this.radios10 == "開啟") {
          this.thisRadio10 = true;
        } else {
          this.thisRadio10 = false;
        }
      }
    },
    // 搜索 黑白名单列表
    doFilterBlackWhiteList() {
      if (this.blackWhiteListInput == "") {
        this.BWListTemp = JSON.parse(JSON.stringify(this.IpBlackWhiteLists));
      } else {
        this.BWListTemp = [];
        for (let i = 0; i < this.IpBlackWhiteLists.length; i++) {
          if (this.IpBlackWhiteLists[i].Ip.indexOf(this.blackWhiteListInput) > -1) {
            this.BWListTemp.push(this.IpBlackWhiteLists[i]);
          }
        }
      }
      
    },
    // 跳转添加黑白名单弹框
    toAddBW() {
      this.blackWhiteText = "";
      this.blackOrWhite = "black";
      this.dialogModelAddBw = true;
    },
    // 添加黑白名单关闭按钮
    handleCloseAddBw() {
      this.dialogModelAddBw = false;
    },
    // 添加黑白名单确定按钮
    addBWSure() {
      this.checkflg = true;
      if (this.blackWhiteText.length == 0) {
        this.dialogModelAddBw = false;
        return;
      }
      let arrTemp = this.blackWhiteText.split(/[\n]/);
      // 自身去重
      let arr = [];
      for (let i in arrTemp) {
        if (arr.indexOf(arrTemp[i]) == -1) {
          arr.push(arrTemp[i]);
        }
      }
      //IP数量不能超过100
      if (
        arr.length > 100 ||
        this.BWListTemp.length + arr.length > 100
      ) {
        this.checkflg = false;
        this.errorMsg = "IP支持數量不能超過100個";
        return;
      }
      //校验IP
      var regIP = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
      for (let i = 0; i < arr.length; i++) {
        if (!regIP.test(arr[i])) {
          this.checkflg = false;
          this.errorMsg = "IP " + arr[i] + " 非法";
          return;
        }
      }
      // 与已有黑白名单数据查重
      for (let i = 0; i < this.IpBlackWhiteLists.length; i++) {
        if (arr.indexOf(this.IpBlackWhiteLists[i].Ip) > -1) {
          this.checkflg = false;
          this.errorMsg = "IP " + this.IpBlackWhiteLists[i].Ip + " 已存在";
          return;
        }
      }
      for (let i in arr) {
        let temp = { Type: this.blackOrWhite, Ip: arr[i] };
        this.BWListTemp.push(temp);
        this.IpBlackWhiteLists.push(temp);
      }
      this.totalItems = this.BWListTemp.length;
      this.dialogModelAddBw = false;
    },
    // 删除黑白名单
    deleteRowBW(index, row) {
      this.BWListTemp.splice(index, 1);
      for (let i = 0; i <this.IpBlackWhiteLists.length; i++) {
        if (this.IpBlackWhiteLists[i].Ip == row.Ip) {
          this.IpBlackWhiteLists.splice(i, 1);
          return
        }
      }
    },
    // 编辑黑白名单确认按钮
    editBWSure() {
      this.checkflg = true;
      // 只能输入一条IP
      let arr = [];
      arr = this.blackWhiteText.split(/[\n]/);
      if (arr.length != 1 ) {
        this.checkflg = false;
        this.errorMsg = "必須且只能輸入1個IP";
        return;
      }
      //校验IP
      var regIP = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
      if (!regIP.test(this.blackWhiteText)) {
        this.checkflg = false;
        this.errorMsg = "IP " + this.blackWhiteText + " 非法";
        return;
      }
      // 判断IP是否改动
      if (this.blackWhiteText == this.BWListTemp[this.BWIndex].Ip) {
        // IP无改动，判断Type是否改动
        if (this.blackOrWhite == this.BWListTemp[this.BWIndex].Type) {
          // Type无改动，都无改动直接关闭弹框
          this.dialogEdit = false;
        } else {
          // Type有改动（需要遍历数据列表，通过临时数据找到修改的这条数据，重新赋值Type）
          for (let i = 0; i < this.IpBlackWhiteLists.length; i++) {
            if (this.BWListTemp[this.BWIndex].Ip == this.IpBlackWhiteLists[i].Ip) {
              this.IpBlackWhiteLists[i].Type = this.blackOrWhite;
              this.BWListTemp[this.BWIndex].Type = this.blackOrWhite;
              this.dialogEdit = false;
              return;
            }
          }
        }
      } else {
        // IP有改动，判断与已有黑白名单数据查重
        for (let i = 0; i < this.IpBlackWhiteLists.length; i++) {
          if (this.blackWhiteText == this.IpBlackWhiteLists[i].Ip) {
            this.checkflg = false;
            this.errorMsg = "IP " + this.blackWhiteText + " 已存在";
            return;
          }
        }
        // IP有改动，且无重复（需要遍历数据列表，通过临时数据找到修改的这条数据，重新赋值）
        for (let i = 0; i < this.IpBlackWhiteLists.length; i++) {
          if (this.BWListTemp[this.BWIndex].Ip == this.IpBlackWhiteLists[i].Ip) {
            this.IpBlackWhiteLists[i].Ip = this.blackWhiteText;
            this.IpBlackWhiteLists[i].Type = this.blackOrWhite;
            this.BWListTemp[this.BWIndex].Ip = this.blackWhiteText;
            this.BWListTemp[this.BWIndex].Type = this.blackOrWhite;
            this.dialogEdit = false;
            return;
          }
        }
      }
    },
    // 跳转编辑黑白名单弹框
    toEditBW(index, row) {
      console.log(index, row)
      this.BWIndex = index;
      this.blackWhiteText = row.Ip;
      this.blackOrWhite = row.Type;
      this.dialogEdit = true;
    },
    // 水印防护
    createSY() {
      let str = [];
      for (let i in this.tags4) {
        if (this.tags4[i].beginPort !== "" && this.tags4[i].endPort !== "") {
          str.push(this.tags4[i].beginPort + "-" + this.tags4[i].endPort);
        }
      }
      let str2 = [];
      for (let j in this.tags5) {
        if (this.tags5[j].beginPort !== "" && this.tags5[j].endPort !== "") {
          str2.push(this.tags5[j].beginPort + "-" + this.tags5[j].endPort);
        }
      }
      let temp = {
        tcpPort: str,
        udpPort: str2,
        RemoveSwitch: this.radios12 == "關閉" ? 0 : 1,
        OpenStatus: 1,
        Offset: this.moveNum
      };
      if (!this.nameFlag) {//编辑页面
        temp.OpenStatus = (this.tableDataBegin2.length == 0 ? 1 : this.tableDataBegin2[0].OpenStatus);
      } else {
        temp.OpenStatus = 1;
      }
      this.tableDataBegin2 = []; //lxx
      this.tableDataBegin2.push(temp);
      this.dialogVisible = false;
    },
    // 端口再次輸入失敗修復
    updateView(e) {
      this.$forceUpdate()
    } 
  }
};
</script>
<style lang="scss">
.wrapBox >>> .childContStyle {
  .table-div {
    width: 100%;
  }
  td {
    width: 70px !important;
  }
}
a {
  cursor: pointer;
}
.newClear:after {
  display: block;
  clear: both;
  content: "";
}
.fontWeightBold {
  font-size: 14px;
  font-weight: 600;
  color: #000;
  margin-right: 10px;
  margin-top: 12px;
  display: inline-block;
}
.tacticsName {
  width: 480px !important;
  input {
    width: 480px;
  }
}
.tableConOne {
  margin-top: 20px;
  .tableConOneTop {
    float: left;
    padding: 8px 10px;
  }
  .searchs {
    float: right;
    height: 40px;
    width: 178px;
    input {
      height: 30px;
      border-radius: 0;
    }
  }
  .el-icon-search {
    float: right;
    height: 30px;
    margin-top: 10px;
    width: 40px;
    text-align: center;
    padding: 0;
    border-radius: 0;
  }
}
.childContTit {
  margin-top: 25px;
  margin-bottom: 6px;
  h2 {
    font-size: 12px;
    font-weight: 600;
    color: #000;
    margin-bottom: 15px;
  }
}
.tableBorderTop {
  border-top: 1px solid #eaeaea;
  border-left: 1px solid #eaeaea;
  border-right: 1px solid #eaeaea !important;
}
.addNewRow {
  display: inline-block;
  width: 100%;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border: 1px solid #eaeaea;
  border-top: 0;
  border-bottom: 3px solid #eaeaea;
}
.spanStyleLabel {
  font-size: 12px;
  color: #888;
  margin-right: 50px;
  display: inline-block;
  line-height: 30px;
  width: 147px;
}
.el-icon-info {
  color: #888;
}
.bottomBtn {
  width: 100%;
  border-top: 1px solid #eaeaea;
  padding: 20px 0;
  margin-top: 20px;
}
.childContTitModel {
  padding-bottom: 20px;
  border-bottom: 1px solid #ddd;
  p {
    color: #888;
    font-size: 12px;
    margin-top: 12px;
  }
}
.childContTitNoBorder {
  padding-bottom: 20px;
  p {
    color: #888;
    font-size: 12px;
    margin-top: 12px;
  }
  .OffsetNum {
    width: 120px;
    input {
      width: 120px;
    }
  }
}
.hSpanTit {
  margin-right: 22px;
}
.table-div {
  width: 100%;
  border: 1px solid #ddd;
  tr {
    width: 30%;
  }
  .t-head {
    height: 45px;
    padding: 0 5px;
    td {
      border-bottom: 1px solid #eaeaea;
    }
  }
  .t-body {
    height: 45px;
    min-height: 200px;
    td {
      border-bottom: 1px solid #eaeaea;
      .selectChange {
        height: 30px;
        div {
          height: 30px;
          input {
            height: 30px;
            border-radius: 0;
          }
        }
      }
      .selectChange1 {
        height: 30px;
        div {
          height: 30px;
          input {
            height: 30px;
            border-radius: 0;
          }
        }
      }
      .inputChange {
        height: 30px;
        width: 150px;
        input {
          height: 30px;
          width: 150px;
          border-radius: 0;
        }
      }
      .inputChange1 {
        height: 30px;
        width: 70px;
        margin-bottom: 0;
        input {
          height: 30px;
          width: 70px;
          border-radius: 0;
        }
      }
    }
  }
}
.inputChange1 {
  height: 30px;
  width: 66px !important;
  margin-left: 12px;
  margin-bottom: 10px;
  margin-right: 6px;
  input {
    height: 30px;
    width: 80px;
    border-radius: 0;
  }
}
.spanText {
  margin-left: 12px;
}
.contantList {
  div {
    margin-bottom: 15px;
    p:nth-child(1) {
      width: 50px;
      float: left;
      color: #999;
      font-size: 12px;
    }
    p:nth-child(2) {
      float: left;
      width: calc(100% - 50px);
      .inputText {
        width: 100%;
        height: 100px;
        textarea {
          width: 100%;
          height: 100%;
          resize: none;
          border-radius: 0;
        }
      }
      .blackWhiteBtn {
        height: 30px;
        .el-radio-button__inner {
          border-radius: 0;
        }
      }
    }
  }
}
.footerBw {
  text-align: center;
  display: inline-block;
  width: 100%;
  button {
    height: 30px;
    padding: 0;
    line-height: 30px;
    width: 60px;
    text-align: center;
    border-radius: 0;
  }
  button:nth-child(1) {
    color: #fff;
    background-color: #006eff;
  }
}
.el-dialog__title {
  font-size: 14px !important;
  font-weight: 600;
}
.company {
  margin-left: 20px;
}
.tooltip_text {
  font-size: 14px;
}
.tc-15-msg {
  color: #b43537;
  border: 1px solid #f6b5b5;
  background-color: #fcecec;
  background: #fcecec;
  border-radius: 0;
  font-size: 12px;
  line-height: inherit;
  padding: 10px 30px 10px 20px;
  position: relative;
  max-width: 1360px;
  margin-block-end: 1em;
}
</style>

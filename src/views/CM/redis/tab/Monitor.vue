<template>
  <div class="Monitor">
    <TimeDropDown :TimeArr='TimeArr' :Datecontrol='true' :Graincontrol='true' :Difference="'H'"
      v-on:switchData="GetDat" />
    <div class="box-dis">
      <p>
        <i class="el-icon-info"></i>注釋：Max、Min和Avg數值統計為當前折線圖內所有點的最大值、最小值和平均值
      </p>

    </div>
    <div class="box-table">
      <!-- 表格 -->
      <el-table :data="tableData" style="width: 100%" v-loading='TableLoad'>
        <el-table-column prop width="200">
          <template slot-scope="scope">
            <p>
              <span class='span_1'>{{disName[scope.row.MetricName]}}</span>
              <span class='span_2'>{{Company[scope.row.MetricName]}}</span>
              <el-popover placement="bottom-start" title width="200" trigger="hover">
                <p>{{Tips[scope.row.MetricName]}}</p>
                <i class="el-icon-warning" slot="reference"></i>
              </el-popover>
            </p>
          </template>
        </el-table-column>

        <el-table-column width="550">
          <template slot-scope="scope">
            <p v-if="scope.row.DataPoints[0].Values.length==0">暂无数据</p>
            <div v-if="scope.row.DataPoints[0].Values.length!=0">
              <echart-line id="diskEchearrts-line" :time="scope.row.DataPoints[0].Timestamps | UpTime"
                :opData="scope.row.DataPoints[0].Values" :scale="3" :period="Period" :xdata="false"
                :MetricName='disName[scope.row.MetricName]'></echart-line>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop>
          <template slot-scope="scope">
            <p style="font-size:12px;color:#bbb;font-weight:600">Max:</p>
            <template v-if="scope.row.DataPoints[0].Values.length!==0">
              <span style="color:#333;font-weight:600;font-size: 12px;">{{scope.row.DataPoints[0].Values|CMMax}} <span
                  class='span_2'>{{Company[scope.row.MetricName]}}</span></span>
              <span style="color:#333;font-weight:600;font-size: 12px;">{{scope.row.symbol}}</span>
            </template>
            <template v-if="scope.row.DataPoints[0].Values.length==0">-</template>
          </template>
        </el-table-column>
        <el-table-column prop>
          <template slot-scope="scope">
            <p style="font-size:12px;color:#bbb;font-weight:600">Min:</p>
            <template v-if="scope.row.DataPoints[0].Values.length!==0">
              <span style="color:#333;font-weight:600;font-size: 12px;">{{scope.row.DataPoints[0].Values|CMMin}} <span
                  class='span_2'>{{Company[scope.row.MetricName]}}</span></span>
              <span style="color:#333;font-weight:600;font-size: 12px;">{{scope.row.symbol}}</span>
            </template>
            <template v-if="scope.row.DataPoints[0].Values.length==0">-</template>
          </template>
        </el-table-column>

        <el-table-column prop>
          <template slot-scope="scope">
            <p style="font-size:12px;color:#bbb;font-weight:600">Avg:</p>
            <template v-if="scope.row.DataPoints[0].Values.length!==0">
              <span style="color:#333;font-weight:600;font-size: 12px;">{{scope.row.DataPoints[0].Values|CMAvg}} <span
                  class='span_2'>{{Company[scope.row.MetricName]}}</span></span>
              <span style="color:#333;font-weight:600;font-size: 12px;">{{scope.row.symbol}}</span>
            </template>
            <template v-if="scope.row.DataPoints[0].Values.length==0">-</template>
          </template>
        </el-table-column>
      </el-table>

    </div>
  </div>
</template>
<script>
  import moment from "moment";
  import TimeDropDown from '@/components/public/TimeDropDown' //引入时间组件
  import echartLine from "@/components/public/echars-line"; //引入图标组件
  import {
    ErrorTips
  } from "@/components/ErrorTips";
  import {
    ALL_Basics,
    All_MONITOR
  } from '@/constants'

  export default {
    data() {
      return {
        TimeArr: [{
            name: '实时',
            Time: 'realTime',
            TimeGranularity: [{
                value: "60",
                label: "1分鐘"
              },
              {
                value: "300",
                label: "5分鐘"
              }
            ]
          },
          {
            name: '近24小时',
            Time: 'Nearly_24_hours',
            TimeGranularity: [{
                value: "60",
                label: "1分鐘"
              },
              {
                value: "300",
                label: "5分鐘"
              },
              {
                value: "3600",
                label: "1小時"
              },
              {
                value: "86400",
                label: "1天"
              }
            ]
          },
          {
            name: '近7天',
            Time: 'Nearly_7_days',
            TimeGranularity: [{
                value: "3600",
                label: "1小時"
              },
              {
                value: "86400",
                label: "1天"
              }
            ]
          }
        ],
        ID: this.$route.query.id,
        BaseList: [], //全部指标列表
        BaseListK: [], //用到的指标列表
        TableLoad: true,
        Period: '', //粒度
        Time: {}, //监控传递时间
        MonitorData: [], //监控数据
        tableData: [], // 组合数据
        available: [
          'BigValueMin',
          'BigValueNodeMin',
          'CacheHitRatioMin',
          'CacheHitRatioNodeMin',
          'CmdstatDelNodeMin',
          'CmdstatFlushallNodeMin',
          'CmdstatFlushdbNodeMin',
          'CmdstatGetbitNodeMin',
          'CmdstatGetrangeNodeMin',
          'CmdstatGetNodeMin',
          'CmdstatHgetallNodeMin',
          'CmdstatHgetNodeMin',
          'CmdstatHmget',
          'CmdstatHmgetNodeMin',
          'CmdstatHmsetNodeMin',
          'CmdstatHsetnxNodeMin',
          'CmdstatHsetNodeMin',
          'CmdstatLsetNodeMin',
          'CmdstatMgetNodeMin',
          'CmdstatMsetnxNodeMin',
          'CmdstatMsetNodeMin',
          'CmdstatSetbitNodeMin',
          'CmdstatSetexNodeMin',
          'CmdstatSetnxNodeMin',
          'CmdstatSetrangeNodeMin',
          'CmdstatSetNodeMin',
          'CmdErrMin',
          'CmdErrNodeMin',
          'ConnectionsMin',
          'ConnectionsUsMin',
          'CpuMaxUsMin',
          'CpuUsNodeMin',
          'EvictedKeysMin',
          'EvictedKeysNodeMin',
          'ExpiredKeysMin',
          'ExpiredKeysNodeMin',
          'GossipInFlowNodeMin',
          'GossipOutFlowNodeMin',
          'InFlowMin',
          'InFlowUsMin',
          'KeysMin',
          'KeysNodeMin',
          'LatencyGetMin',
          'LatencyGetNodeMin',
          'LatencyMin',
          'LatencyNodeMin',
          'LatencyOtherMin',
          'LatencyOtherNodeMin',
          'LatencySetNodeMin',
          'MemsizeDatasetNodeMin',
          'MemsizeOverheadNodeMin',
          'OutFlowMin',
          'OutFlowNodeMin',
          'OutFlowUsMin',
          'QpsNodeMin',
          'SlowQuery',
          'SlowQueryNodeMin',
          'StatGetNodeMin',
          'StatMissedNodeMin',
          'StatOtherNodeMin',
          'StatSetNodeMin',
          'StatSuccessNodeMin',
          'Storage',
          'StorageMaxUsMin',
          'StorageNodeMin',
          'StorageSlopeNodeMin',
          'StorageUsNodeMin',
        ], //可用指标
        disName: {

          'BigValueMin': '执行次数',
          'BigValueNodeMin': '大value',
          'CacheHitRatioMin': ' Key命中',
          'CacheHitRatioNodeMin': 'cache命中率',
          'CmdstatDelNodeMin': 'DEL命令执行次数',
          'CmdstatFlushallNodeMin': 'Flushall执行次数',
          'CmdstatFlushdbNodeMin': 'Flushdb执行次数',
          'CmdstatGetbitNodeMin': 'Getbit执行次数',
          'CmdstatGetrangeNodeMin': 'Getrange执行次数',
          'CmdstatGetNodeMin': 'Get执行次数',
          'CmdstatHgetallNodeMin': 'Hgetall执行次数',
          'CmdstatHgetNodeMin': 'Hget执行次数',
          'CmdstatHmget': 'hmget数量',
          'CmdstatHmgetNodeMin': 'Hmget执行次数',
          'CmdstatHmsetNodeMin': 'Hmset执行次数',
          'CmdstatHsetnxNodeMin': 'Hsetnx执行次数',
          'CmdstatHsetNodeMin': 'Hset执行次数',
          'CmdstatLsetNodeMin': 'Lset执行次数',
          'CmdstatMgetNodeMin': 'Mget执行次数',



          'CmdstatMsetnxNodeMin': 'Msetnx执行次数',

          'CmdstatMsetNodeMin': 'Mset执行次数',



          'CmdstatSetbitNodeMin': 'Setbit执行次数',


          'CmdstatSetexNodeMin': 'Setex执行次数',


          'CmdstatSetnxNodeMin': 'Setnx执行次数',


          'CmdstatSetrangeNodeMin': 'Setrange执行次数',

          'CmdstatSetNodeMin': 'Set执行次数',

          'CmdErrMin': '命令执行错误的次数',
          'CmdErrNodeMin': '错误命令数量',

          'ConnectionsMin': 'TCP连接数量',


          'ConnectionsUsMin': '连接数使用率',
          'CpuMaxUsMin': '单分片最大cpu使用率',


          'CpuUsNodeMin': 'CPU使用率',

          'EvictedKeysMin': '驱逐的Key',
          'EvictedKeysNodeMin': 'keys驱逐数量',
          'ExpiredKeysMin': '淘汰的Key',
          'ExpiredKeysNodeMin': 'keys过期数量',
          'GossipInFlowNodeMin': 'gossip入流',

          'GossipOutFlowNodeMin': 'gossip出流',

          'InFlowMin': '内网入流量',


          'InFlowUsMin': '入流使用率',

          'KeysMin': '总Key',
          'KeysNodeMin': 'Key数量',


          'LatencyGetMin': '读命令平均执行时延',
          'LatencyGetNodeMin': '读请求平均延迟',
          'LatencyMin': '执行时延平均值',
          'LatencyNodeMin': '请求平均延迟',

          'LatencyOtherMin': '命令平均执行时延',
          'LatencyOtherNodeMin': '平均延迟',


          'LatencySetNodeMin': '写命令平均执行时延',

          'MemsizeDatasetNodeMin': '数据内存',

          'MemsizeOverheadNodeMin': '其他内存',

          'OutFlowMin': '内网出流量',
          'OutFlowNodeMin': '指标',

          'OutFlowUsMin': '出流使用率',


          'QpsNodeMin': 'QPS命令执行次数',
          'SlowQuery': '命令次数',

          'SlowQueryNodeMin': '配置命令次数',


          'StatGetNodeMin': '读命令执行次数',

          'StatMissedNodeMin': '读请求Key不存在的个数',


          'StatOtherNodeMin': '读写命令之外的命令执行次数',


          'StatSetNodeMin': '写命令执行次数',


          'StatSuccessNodeMin': '读请求Key存在的个数',
          'Storage': '内存容量',
          'StorageMaxUsMin': '单分片最大使用率',

          'StorageNodeMin': '使用内存容量',

          'StorageSlopeNodeMin': '分片内存使用率',


          'StorageUsNodeMin': '实际使用内存和申请总内存之比',
        },
        Company: {
          'Bigkey': '个',
          'BigValue': '次/分钟',
          'BigValueMin': '次/分钟',
          'BigValueNodeMin': '',
          'CacheHitRatio': '',
          'CacheHitRatioMin': ' ',
          'CacheHitRatioNodeMin': '%',
          'CmdstatDelMin': '次/分钟',
          'CmdstatDelNodeMin': '次/分钟',
          'CmdstatFlushallMin': ' 次/分钟',
          'CmdstatFlushallNodeMin': '次/分钟',
          'CmdstatFlushdbMin': '次/分钟',
          'CmdstatFlushdbNodeMin': '次/分钟',
          'CmdstatGet': '次/分钟',
          'CmdstatGetbit': '次/分钟',
          'CmdstatGetbitMin': '次/分钟',
          'CmdstatGetbitNodeMin': '次/分钟',
          'CmdstatGetrange': '次/分钟',
          'CmdstatGetrangeMin': '次/分钟',
          'CmdstatGetrangeNodeMin': '次/分钟',
          'CmdstatGetMin': '次/分钟',
          'CmdstatGetNodeMin': '次/分钟',
          'CmdstatHget': '次/分钟',
          'CmdstatHgetall': '次/分钟',
          'CmdstatHgetallMin': '次/分钟',
          'CmdstatHgetallNodeMin': '次/分钟',
          'CmdstatHgetMin': '次/分钟',
          'CmdstatHgetNodeMin': '次/分钟',
          'CmdstatHmget': 'Mb/分钟',
          'CmdstatHmgetMin': '次/分钟',
          'CmdstatHmgetNodeMin': '次/分钟',
          'CmdstatHmset': '次/分钟',
          'CmdstatHmsetMin': '次/分钟',
          'CmdstatHmsetNodeMin': '次/分钟',
          'CmdstatHset': '次/分钟',
          'CmdstatHsetnx': '次/分钟',
          'CmdstatHsetnxMin': '次/分钟',
          'CmdstatHsetnxNodeMin': '次/分钟',
          'CmdstatHsetMin': '次/分钟',
          'CmdstatHsetNodeMin': '次/分钟',
          'CmdstatLset': '次/分钟',
          'CmdstatLsetMin': '次/分钟',
          'CmdstatLsetNodeMin': '次/分钟',
          'CmdstatMget': '次/分钟',
          'CmdstatMgetMin': '次/分钟',
          'CmdstatMgetNodeMin': '次/分钟',
          'CmdstatMset': '次/分钟',
          'CmdstatMsetnx': '次/分钟',
          'CmdstatMsetnxMin': '次/分钟',
          'CmdstatMsetnxNodeMin': '次/分钟',
          'CmdstatMsetMin': '次/分钟',
          'CmdstatMsetNodeMin': '次/分钟',
          'CmdstatSet': '次/分钟',
          'CmdstatSetbit': '次/分钟',
          'CmdstatSetbitMin': '次/分钟',
          'CmdstatSetbitNodeMin': '次/分钟',
          'CmdstatSetex': '次/分钟',
          'CmdstatSetexMin': '次/分钟',
          'CmdstatSetexNodeMin': '次/分钟',
          'CmdstatSetnx': '次/分钟',
          'CmdstatSetnxMin': '次/分钟',
          'CmdstatSetnxNodeMin': '次/分钟',
          'CmdstatSetrange': '次/分钟',
          'CmdstatSetrangeMin': '次/分钟',
          'CmdstatSetrangeNodeMin': '次/分钟',
          'CmdstatSetMin': '次/分钟',
          'CmdstatSetNodeMin': '次/分钟',
          'CmdErr': '次/分钟',
          'CmdErrMin': '次/分钟',
          'CmdErrNodeMin': 'Mb/分钟',
          'Connections': 'Mb/分钟',
          'ConnectionsMin': 'Mb/分钟',
          'ConnectionsNodeMin': '%',
          'ConnectionsUs': '%',
          'ConnectionsUsMin': '%',
          'CpuMaxUsMin': '%',
          'CpuUs': '%',
          'CpuUsMin': '%',
          'CpuUsNodeMin': '%',
          'EvictedKeys': '个',
          'EvictedKeysMin': '个',
          'EvictedKeysNodeMin': 'Mb/分钟',
          'ExpiredKeys': '个',
          'ExpiredKeysMin': '个',
          'ExpiredKeysNodeMin': 'Mb/分钟',
          'GossipInFlowMin': '',
          'GossipInFlowNodeMin': '',
          'GossipOutFlowMin': '',
          'GossipOutFlowNodeMin': '',
          'InFlow': 'Mb/分钟',
          'InFlowMin': 'Mb/分钟',
          'InFlowNodeMin': '%',
          'InFlowUs': '%',
          'InFlowUsMin': '%',
          'Keys': '个',
          'KeysMin': '个',
          'KeysNodeMin': '个',
          'Latency': 'Mb/分钟',
          'LatencyGet': 'Mb/分钟',
          'LatencyGetMin': 'Mb/分钟',
          'LatencyGetNodeMin': 'Mb/分钟',
          'LatencyMin': 'Mb/分钟',
          'LatencyNodeMin': 'Mb/分钟',
          'LatencyOther': 'Mb/分钟',
          'LatencyOtherMin': 'Mb/分钟',
          'LatencyOtherNodeMin': 'Mb/分钟',
          'LatencySet': 'Mb/分钟',
          'LatencySetMin': 'Mb/分钟',
          'LatencySetNodeMin': 'Mb/分钟',
          'MemsizeDatasetMin': 'Mb/分钟',
          'MemsizeDatasetNodeMin': 'Mb/分钟',
          'MemsizeOverheadMin': 'Mb/分钟',
          'MemsizeOverheadNodeMin': 'Mb/分钟',
          'OutFlow': 'Mb/分钟',
          'OutFlowMin': 'Mb/分钟',
          'OutFlowNodeMin': 'Mb/分钟',
          'OutFlowUs': '%',
          'OutFlowUsMin': '%',
          'Qps': '次/分钟',
          'QpsMin': '次/分钟',
          'QpsNodeMin': '次/分钟',
          'SlowQuery': '次/分钟',
          'SlowQueryMin': '次/分钟',
          'SlowQueryNodeMin': '次/分钟',
          'StatGet': '次/分钟',
          'StatGetMin': '次/分钟',
          'StatGetNodeMin': '次/分钟',
          'StatMissed': '个',
          'StatMissedMin': '个',
          'StatMissedNodeMin': '个',
          'StatOther': '次/分钟',
          'StatOtherMin': '次/分钟',
          'StatOtherNodeMin': '次/分钟',
          'StatSet': '次/分钟',
          'StatSetMin': '次/分钟',
          'StatSetNodeMin': '次/分钟',
          'StatSuccess': '次/分钟',
          'StatSuccessMin': '个',
          'StatSuccessNodeMin': '个',
          'Storage': 'Mb/分钟',
          'StorageMaxUsMin': '%',
          'StorageMin': 'Mb/分钟',
          'StorageNodeMin': 'Mb/分钟',
          'StorageSlopeMin': '%',
          'StorageSlopeNodeMin': '%',
          'StorageUs': '',
          'StorageUsMin': '',
          'StorageUsNodeMin': '',
        },
        Tips: {
          'Bigkey': '大key数量',
          'BigValue': '请求命令大小超过32KB的执行次数',
          'BigValueMin': '请求命令大小超过32KB的执行次数',
          'BigValueNodeMin': '大value',
          'CacheHitRatio': 'Key命中/(Key命中+KeyMiss)，该指标可以反应Cache Miss的情况，当访问为0时，该值为null',
          'CacheHitRatioMin': ' Key命中/(Key命中+KeyMiss)，该指标可以反应Cache Miss的情况，当访问为0时，该值为null',
          'CacheHitRatioNodeMin': 'cache命中率',
          'CmdstatDelMin': 'DEL命令执行次数',
          'CmdstatDelNodeMin': 'DEL命令执行次数',
          'CmdstatFlushallMin': ' Flushall执行次数',
          'CmdstatFlushallNodeMin': 'Flushall执行次数',
          'CmdstatFlushdbMin': 'Flushdb执行次数',
          'CmdstatFlushdbNodeMin': 'Flushdb执行次数',
          'CmdstatGet': 'Get执行次数',
          'CmdstatGetbit': 'Getbit执行次数',
          'CmdstatGetbitMin': 'Getbit执行次数',
          'CmdstatGetbitNodeMin': 'Getbit执行次数',
          'CmdstatGetrange': 'Getrange执行次数',
          'CmdstatGetrangeMin': 'Getrange执行次数',
          'CmdstatGetrangeNodeMin': 'Getrange执行次数',
          'CmdstatGetMin': 'Get执行次数',
          'CmdstatGetNodeMin': 'Get执行次数',
          'CmdstatHget': 'Hget执行次数',
          'CmdstatHgetall': 'Hgetall执行次数',
          'CmdstatHgetallMin': 'Hgetall执行次数',
          'CmdstatHgetallNodeMin': 'Hgetall执行次数',
          'CmdstatHgetMin': 'Hget执行次数',
          'CmdstatHgetNodeMin': 'Hget执行次数',
          'CmdstatHmget': 'hmget数量',
          'CmdstatHmgetMin': 'Hmget执行次数',
          'CmdstatHmgetNodeMin': 'Hmget执行次数',
          'CmdstatHmset': 'Hmset执行次数',
          'CmdstatHmsetMin': 'Hmset执行次数',
          'CmdstatHmsetNodeMin': 'Hmset执行次数',
          'CmdstatHset': 'Hset执行次数',
          'CmdstatHsetnx': 'Hsetnx执行次数',
          'CmdstatHsetnxMin': 'Hsetnx执行次数',
          'CmdstatHsetnxNodeMin': 'Hsetnx执行次数',
          'CmdstatHsetMin': 'Hset执行次数',
          'CmdstatHsetNodeMin': 'Hset执行次数',
          'CmdstatLset': 'Lset执行次数',
          'CmdstatLsetMin': 'Lset执行次数',
          'CmdstatLsetNodeMin': 'Lset执行次数',
          'CmdstatMget': 'Mget执行次数',
          'CmdstatMgetMin': 'Mget执行次数',
          'CmdstatMgetNodeMin': 'Mget执行次数',
          'CmdstatMset': 'Mset执行次数',
          'CmdstatMsetnx': 'Msetnx执行次数',
          'CmdstatMsetnxMin': 'Msetnx执行次数',
          'CmdstatMsetnxNodeMin': 'Msetnx执行次数',
          'CmdstatMsetMin': 'Mset执行次数',
          'CmdstatMsetNodeMin': 'Mset执行次数',
          'CmdstatSet': 'Set执行次数',
          'CmdstatSetbit': 'Setbit执行次数',
          'CmdstatSetbitMin': 'Setbit执行次数',
          'CmdstatSetbitNodeMin': 'Setbit执行次数',
          'CmdstatSetex': 'Setex执行次数',
          'CmdstatSetexMin': 'Setex执行次数',
          'CmdstatSetexNodeMin': 'Setex执行次数',
          'CmdstatSetnx': 'Setnx执行次数',
          'CmdstatSetnxMin': 'Setnx执行次数',
          'CmdstatSetnxNodeMin': 'Setnx执行次数',
          'CmdstatSetrange': 'Setrange执行次数',
          'CmdstatSetrangeMin': 'Setrange执行次数',
          'CmdstatSetrangeNodeMin': 'Setrange执行次数',
          'CmdstatSetMin': 'Set执行次数',
          'CmdstatSetNodeMin': 'Set执行次数',
          'CmdErr': '命令执行错误的次数， 例如命令不存在、 参数错误等情况',
          'CmdErrMin': '命令执行错误的次数， 例如命令不存在、 参数错误等情况',
          'CmdErrNodeMin': '错误命令数量',
          'Connections': '连接到实例的TCP连接数量',
          'ConnectionsMin': '连接到实例的TCP连接数量',
          'ConnectionsNodeMin': '指标',
          'ConnectionsUs': '连接数使用率',
          'ConnectionsUsMin': '连接数使用率',
          'CpuMaxUsMin': '单分片最大cpu使用率',
          'CpuUs': '平均CPU使用率',
          'CpuUsMin': '平均CPU使用率',
          'CpuUsNodeMin': 'CPU使用率',
          'EvictedKeys': '时间窗内被驱逐的Key个数， 对应info命令输出的evicted_keys',
          'EvictedKeysMin': '时间窗内被驱逐的Key个数， 对应info命令输出的evicted_keys',
          'EvictedKeysNodeMin': 'keys驱逐数量',
          'ExpiredKeys': '时间窗内被淘汰的Key个数， 对应info命令输出的expired_keys',
          'ExpiredKeysMin': '时间窗内被淘汰的Key个数， 对应info命令输出的expired_keys',
          'ExpiredKeysNodeMin': 'keys过期数量',
          'GossipInFlowMin': 'gossip入流',
          'GossipInFlowNodeMin': 'gossip入流',
          'GossipOutFlowMin': 'gossip出流',
          'GossipOutFlowNodeMin': 'gossip出流',
          'InFlow': '内网入流量',
          'InFlowMin': '内网入流量',
          'InFlowNodeMin': '指标',
          'InFlowUs': '人流使用率',
          'InFlowUsMin': '入流使用率',
          'Keys': '实例存储的总Key个数（ 一级Key）',
          'KeysMin': '实例存储的总Key个数（ 一级Key）',
          'KeysNodeMin': 'Key数量',
          'Latency': 'proxy到redis server的执行时延平均值',
          'LatencyGet': 'proxy到redis server的读命令平均执行时延， 读命令分类',
          'LatencyGetMin': 'proxy到redis server的读命令平均执行时延， 读命令分类',
          'LatencyGetNodeMin': '读请求平均延迟',
          'LatencyMin': 'proxy到redis server的执行时延平均值',
          'LatencyNodeMin': '请求平均延迟',
          'LatencyOther': 'proxy到redis server的读写命令之外的命令平均执行时延， 其他命令分类',
          'LatencyOtherMin': 'proxy到redis server的读写命令之外的命令平均执行时延， 其他命令分类',
          'LatencyOtherNodeMin': '其他请求平均延迟',
          'LatencySet': 'proxy到redis server的写命令平均执行时延， 读命令分类',
          'LatencySetMin': 'proxy到redis server的写命令平均执行时延， 读命令分类',
          'LatencySetNodeMin': 'proxy到redis server的写命令平均执行时延， 读命令分类',
          'MemsizeDatasetMin': '数据内存',
          'MemsizeDatasetNodeMin': '数据内存',
          'MemsizeOverheadMin': '其他内存',
          'MemsizeOverheadNodeMin': '其他内存',
          'OutFlow': '内网出流量',
          'OutFlowMin': '内网出流量',
          'OutFlowNodeMin': '指标',
          'OutFlowUs': '出流使用率',
          'OutFlowUsMin': '出流使用率',
          'Qps': 'QPS， 命令执行次数',
          'QpsMin': 'QPS， 命令执行次数',
          'QpsNodeMin': 'QPS， 命令执行次数',
          'SlowQuery': '执行时延大于slowlog - log - slower - than配置的命令次数',
          'SlowQueryMin': '执行时延大于slowlog - log - slower - than配置的命令次数',
          'SlowQueryNodeMin': '执行时延大于slowlog - log - slower - than配置的命令次数',
          'StatGet': '读命令执行次数， 读命令分类， ',
          'StatGetMin': '读命令执行次数， 读命令分类， ',
          'StatGetNodeMin': '读命令执行次数， 读命令分类， ',
          'StatMissed': '读请求Key不存在的个数， 对应info命令输出的keyspace_misses指标',
          'StatMissedMin': '读请求Key不存在的个数， 对应info命令输出的keyspace_misses指标',
          'StatMissedNodeMin': '读请求Key不存在的个数， 对应info命令输出的keyspace_misses指标',
          'StatOther': ' 读写命令之外的命令执行次数， 其他命令分类， ',
          'StatOtherMin': ' 读写命令之外的命令执行次数， 其他命令分类， ',
          'StatOtherNodeMin': '读写命令之外的命令执行次数， 其他命令分类， ',
          'StatSet': '写命令执行次数， 读命令分类， ',
          'StatSetMin': '写命令执行次数， 读命令分类， ',
          'StatSetNodeMin': '写命令执行次数， 读命令分类， ',
          'StatSuccess': '读请求Key存在的个数， 对应info命令输出的keyspace_hits指标',
          'StatSuccessMin': '读请求Key存在的个数， 对应info命令输出的keyspace_hits指标',
          'StatSuccessNodeMin': '读请求Key存在的个数， 对应info命令输出的keyspace_hits指标',
          'Storage': '实际使用内存容量， 包含数据和缓存部分',
          'StorageMaxUsMin': '单分片最大使用率',
          'StorageMin': '实际使用内存容量， 包含数据和缓存部分',
          'StorageNodeMin': '实际使用内存容量， 包含数据和缓存部分',
          'StorageSlopeMin': '分片内存使用率 - 所有分片平均内存使用率， 结果值范围(-100 % , +100 % )',
          'StorageSlopeNodeMin': '分片内存使用率 - 所有分片平均内存使用率， 结果值范围(-100 % , +100 % )',
          'StorageUs': '实际使用内存和申请总内存之比',
          'StorageUsMin': '实际使用内存和申请总内存之比',
          'StorageUsNodeMin': '实际使用内存和申请总内存之比',
        },

      }
    },
    components: {
      TimeDropDown,
      echartLine
    },
    watch: {
      MonitorData(val) {
        if (this.MonitorData) {
          this.MonitorData.forEach(element => {
            this.BaseListK.forEach(item => {
              if (item.MetricName === element.MetricName) {
                item.DataPoints = element.DataPoints
              }
            });
          });
          if (this.BaseListK.length == val.length) {
            this.tableData = this.BaseListK
            this.TableLoad = false
          }
        }
      }
    },
    methods: {
      GetDat(data) {
        this.Period = data[0]
        this.Time = data[1]
        this.TableLoad = true
        this._GetBase()
      },
      //获取基础指标详情
      _GetBase() {
        let parms = {
          Version: '2018-07-24',
          Region: localStorage.getItem('regionv2'),
          Namespace: 'QCE/REDIS'
        }
        this.axios.post(ALL_Basics, parms).then(res => {
          if (res.Response.Error == undefined) {
            this.BaseList = res.Response.MetricSet
            this.MonitorData = []
            this.BaseListK = []
            this.BaseList.forEach(item => {
              this.available.forEach(element => {
                if (item.MetricName === element) {
                  if (item.Period.indexOf(Number(this.Period)) !== -1) {
                    this.BaseListK.push(item)
                    this._GetMonitorData(item.MetricName)
                  }
                }
              });
            });
          } else {
            this.$message({
              message: ErrorTips[res.Response.Error.Code],
              type: "error",
              showClose: true,
              duration: 0
            });
          }
        });
      },
      //获取监控数据
      _GetMonitorData(MetricName) {
        let parms = {
          Version: '2018-07-24',
          Region: localStorage.getItem('regionv2'),
          Namespace: 'QCE/REDIS',
          Period: this.Period,
          StartTime: this.Time.StartTIme,
          EndTime: this.Time.EndTIme,
          MetricName: MetricName,
          'Instances.0.Dimensions.0.Name': 'redis_uuid',
          'Instances.0.Dimensions.0.Value': this.ID,
        }
        this.axios.post(All_MONITOR, parms).then(data => {
          if (data.Response.Error == undefined) {
            this.MonitorData.push(data.Response);
          } else {
            this.$message({
              message: ErrorTips[data.Response.Error.Code],
              type: "error",
              showClose: true,
              duration: 0
            });
          }
        });
      },
    },
    filters: {
      UpTime(value) {
        let timeArr = [];
        for (let i = 0; i < value.length; i++) {
          let uptime = moment(value[i] * 1000).format("YYYY-MM-DD HH:mm:ss");
          timeArr.push(uptime);
        }
        return timeArr;
      }
    }
  }

</script>
<style lang="scss" scoped>
  .Monitor {
    background: #ffffff;
    margin-top: 20px;
    margin-bottom: 50px;
    border: 1px solid #cccccc;
    -webkit-box-shadow: 0px 3px 3px #c8c8c8;
    -moz-box-shadow: 0px 3px 3px #c8c8c8;
    box-shadow: 0px 3px 3px #c8c8c8;
    padding: 20px;

    .box-dis {
      margin-top: 20px;
      color: #ccc;
      font-size: 14px;
    }

    .box-table {
      .span_1 {
        font-size: 14px;
        font-weight: bold;
        color: black;
      }

      .span_2 {
        font-size: 12px;
        color: #BBBBBB;
      }
    }
  }

</style>

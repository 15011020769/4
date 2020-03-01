<template>
  <div>
    <div class="wrapper">
      <div class="topDateIpt">
        <div class="newClear listTop">
          <el-select
            v-model="dominList"
            filterable
            allow-create
            class="dominList"
            default-first-option>
            <el-option
              v-for="item in dominOptions"
              :key="item.DomainId"
              :label="item.Domain"
              :value="item.Domain">
            </el-option>
          </el-select>
          <el-button-group class="btnGroup">
            <el-button :class="thisType=='1'?'addBgColor':''" @click="choseDate(1)">近1小{{t('时', 'WAF.hour')}}</el-button>
            <el-button :class="thisType=='2'?'addBgColor':''" @click="choseDate(2)">近6小{{t('时', 'WAF.hour')}}</el-button>
            <el-button :class="thisType=='3'?'addBgColor':''" @click="choseDate(3)">今天</el-button>
            <el-button :class="thisType=='4'?'addBgColor':''" @click="choseDate(4)">昨天</el-button>
            <el-button :class="thisType=='5'?'addBgColor':''" @click="choseDate(5)">近7天</el-button>
          </el-button-group>
          <el-date-picker
            v-model="timeValue"
            type="datetimerange"
            class="dataTime"
            range-separator="至"
            :start-placeholder="t('开始日期', 'WAF.ksrq')"
            :end-placeholder="t('结束日期', 'WAF.jsrq')">
          </el-date-picker>
        </div>
        <div>
          <el-input placeholder="请输入" v-model="keyword" class="input-with-select">
            <el-select v-model="condi" value-key="label" slot="prepend" placeholder="请选择过滤条件" style="width: 150px;">
              <el-option v-for="item in query" :key="item.value" :label="item.value" :value="item"></el-option>
            </el-select>
            <el-button slot="append" @click="addCondi">添加过滤条件</el-button>
          </el-input>&nbsp;&nbsp;
          <el-button class="selectBtn" @click="search">{{t('查询', 'WAF.js')}}</el-button>
          <i class="el-icon-download" style="cursor: pointer;" @click="createDownTask"></i>
        </div>
        <div style="margin-top: 10px;">
          <el-tag
            size="small"
            v-for="(tag, i) in condis"
            :key="tag.condi.label"
            closable
            @close="removeCondi(tag, i)"
            style="margin-right: 10px;"
          >
          {{tag.condi.value}}:{{tag.keyword}}
        </el-tag>
        </div>
      </div>
      <div class="tableCon">
        <el-row type="flex" align="middle" justify="space-between" style="margin: 0 10px;">
          {{t('总数量', 'WAF.zsl')}}：{{total}} {{t('项', 'WAF.x')}}
          <div class="topSet newClear">
            <i class="el-icon-setting" style="cursor: pointer;" @click="openDialog"></i>
          </div>
        </el-row>
        <div class="tableMian">
          <el-table :data="tableDataBegin" :empty-text="t('暂无数据', 'WAF.zwsj')" v-loading="loading">
            <el-table-column type="index" :label="t('序号', 'WAF.xh')"></el-table-column>
            <el-table-column :label="t('时间', 'WAF.time')" v-if="columnsCopy.includes('time')">
              <template slot-scope="scope">{{formatTime(scope.row.msec)}}</template>
            </el-table-column>
            <el-table-column prop="client" :label="t('访问源IP', 'WAF.fwyip')" v-if="columnsCopy.includes('client')"></el-table-column>
            <el-table-column :label="t('来源地址', 'WAF.lydz')" v-if="columnsCopy.includes('source')">
              <template slot-scope="scope">{{scope.row.ipinfo_nation}} • {{scope.row.ipinfo_province}}</template>
            </el-table-column>
            <el-table-column :label="t('请求详情', 'WAF.qqxq')" v-if="columnsCopy.includes('request')">
              <template slot-scope="scope">
                <div>
                  <p><strong>方法:</strong>{{scope.row.method}}</p>
                  <p><strong>协议:</strong>{{scope.row.schema}}</p>
                  <p><strong>HOST:</strong>{{scope.row.host}}</p>
                  <p><strong>URI:</strong>{{scope.row.url}}</p>
                  <p><strong>Query:</strong>{{scope.row.query}}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="body" label="Body" v-if="columnsCopy.includes('body')"></el-table-column>
            <el-table-column :label="t('请求头', 'WAF.qqt')" v-if="columnsCopy.includes('header')">
              <template slot-scope="scope">
                <div>
                  <p><strong>Referer:</strong>{{scope.row.referer}}</p>
                  <p><strong>UA:</strong>{{scope.row.user_agent}}</p>
                  <p><strong>Cookie:</strong>{{scope.row.cookie}}</p>
                  <p><strong>X_Forwarded_For:</strong>{{scope.row.client}}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="回源信息" v-if="columnsCopy.includes('upstream')">
              <template slot-scope="scope">
                <div>
                  <p><strong>回源地址:</strong>{{scope.row.upstream}}</p>
                  <p><strong>回源耗时:</strong>{{parseFloat(scope.row.upstream_connect_time) * 1000}}ms</p>
                  <p><strong>源站响应耗时:</strong>{{parseFloat(scope.row.upstream_response_time) * 1000}}ms</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column :label="t('响应详情', 'WAF.xyxq')" v-if="columnsCopy.includes('response')">
              <template slot-scope="scope">
                <div>
                  <p><strong>WAF响应码:</strong>{{scope.row.status}}</p>
                  <p><strong>源站响应码:</strong>{{scope.row.upstream_status}}</p>
                  <p><strong>响应大小:</strong>{{scope.row.bytes_sent}}字节</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="action" label="操作" width="180">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="$router.push({name: 'accessLogDetail', params: {log: scope.row}})">{{t('详情', 'WAF.xq')}}</el-button>
              </template>
            </el-table-column>
          </el-table>
          <p class="loadmore" v-if="Context && !loadmoreloading">
            <el-button type="text" size="small" @click="loadmore">{{t('点击加载更多', 'WAF.djjzgd')}}</el-button>
          </p>
          <p class="loadmore" v-if="loadmoreloading">
            <el-button type="text">{{t('加载中', 'WAF.zrz')}}</el-button>
          </p>
        </div>
      </div>
      <el-dialog
        :title="t('自定义列表字段', 'WAF.dzylbzd')"
        :visible.sync="visible"
        width="420px"
        center
      >
        <el-checkbox-group v-model="columns" class="columns">
          <el-checkbox label="index" disabled>{{t('序号', 'WAF.xh')}}</el-checkbox>
          <el-checkbox label="time">{{t('时间', 'WAF.bgjwz')}}</el-checkbox>
          <el-checkbox label="client">{{t('访问源IP', 'WAF.fwyip')}}</el-checkbox>
          <el-checkbox label="source">{{t('来源地址', 'WAF.lydz')}}</el-checkbox>
          <el-checkbox label="request">{{t('请求详情', 'WAF.qqxq')}}</el-checkbox>
          <el-checkbox label="body">Body</el-checkbox>
          <el-checkbox label="header">{{t('请求头', 'WAF.qqt')}}</el-checkbox>
          <el-checkbox label="upstream">回源信息</el-checkbox>
          <el-checkbox label="response">{{t('响应详情', 'WAF.xyxq')}}</el-checkbox>
          <el-checkbox label="action" disabled>操作</el-checkbox>
        </el-checkbox-group>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelDialog">取消</el-button>
          <el-button type="primary" @click="setColumns">{{t('确定', 'WAF.qd')}}</el-button>
        </span>
      </el-dialog>
      <createDownTaskModel :isShow="createDownTaskModel" @create="createDownloadTask" @closeCreateTaskModel="closeCreateTaskModel"/>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import createDownTaskModel from '../model/createDownTaskModel'
import { COMMON_ERROR } from '../../constants'
import { DESCRIBE_HOSTS, DESCRIBE_ACCESS_LOGS, DESCRIBE_ACCESSLOG_COUNT, CREATE_ACCESS_DOWNLOAD_RECORD } from '@/constants'

export default {
  data(){
    return{
      dominList: 'ALL',//域名下拉
      dominOptions:[],
      thisType:'1',//默认时间选择
      timeValue:'',//时间选择
      keyword: '',
      condi: {},
      condis: [],
      tableDataBegin:[],
      createDownTaskModel:false,//创建下载任务弹框
      Context: '',
      loadmoreloading: false,
      loading: false,
      startTime: moment().format("YYYY-MM-DD HH:mm:ss"),
      endTime: moment().subtract(1, 'h').format('YYYY-MM-DD HH:mm:ss'),
      columnsCopy: [],
      columns: ['index', 'action', 'time', 'client', 'source', 'request', 'body', 'header', 'upstream', 'response'],
      total: 0,
      visible: false,
      queryCopy: [{
        label: 'client',
        value: '访问源IP',
      }, {
        label: 'url',
        value: '访问URI',
      }, {
        label: 'query',
        value: 'Query',
      }, {
        label: 'referer',
        value: 'Referer',
      }, {
        label: 'cookie',
        value: 'Cookie',
      }, {
        label: 'user_agent',
        value: 'User-Agent',
      }, {
        label: 'x_forwarded_for',
        value: 'X-Forwarded-For',
      }, {
        label: 'status',
        value: 'WAF响应码',
      }, {
        label: 'upstream_status',
        value: '源站响应码',
      }, {
        label: 'body',
        value: 'Body',
      }],
      query: []
    }
  },
  components:{
    createDownTaskModel,
  },
  watch: {
    columns(val, oldVal) {
      if (val.length === 3) {
        this.$message({
          message: this.t('至少选择4个', 'WAF.zsxz4g'),
          type: 'error',
          showClose: true,
          duration: 0
        })
        this.columns = [...oldVal]
      }
    },
  },
  mounted() {
    this.columnsCopy = [...this.columns]
    this.query = JSON.parse(JSON.stringify(this.queryCopy))
    this.init()
    this.axios.post(DESCRIBE_HOSTS, {
      Version: '2018-01-25',
    }).then(resp => {
      this.generalRespHandler(resp, ({ HostList }) => {
        HostList = HostList.filter(host => host.ClsStatus === 1)
        this.dominOptions = [{
          Domain: 'ALL',
        }, ...HostList]
      })
    })
  },
  methods:{
    init() {
      this.loading = true
      this.queryLogs()
      this.queryLogCount()
    },
    addCondi() {
      const { condi, keyword, condis, queryCopy, query } = this
      if (condi.label && keyword && keyword.trim()) {
        condis.push({ condi, keyword })
        this.condi = {}
        this.keyword = ''
        this.query = query.filter(q => q.value !== condi.value)
      }
    },
    removeCondi(tag, index) {
      const vals = this.query.map(q => q.value)
      vals.push(tag.condi.value)
      this.query = this.queryCopy.filter(q => vals.includes(q.value))
      this.condis.splice(index, 1)
    },
    openDialog() {
      this.columnsCopy = [...this.columns]
      this.visible = true
    },
    cancelDialog() {
      this.visible = false
      this.columns = [...this.columnsCopy]
    },
    setColumns() {
      this.columnsCopy = [...this.columns]
      this.visible = false
    },
    search() { // 检索
      this.tableDataBegin = []
      this.Context = ''
      this.init()
    },
    queryLogCount() {
      const params = {
        Version: '2018-01-25',
        FromTime: this.startTime,
        ToTime: this.endTime,
      }
      this.addQuery(params)
      this.axios.post(DESCRIBE_ACCESSLOG_COUNT, params).then(resp => {
        this.generalRespHandler(resp, ({ Count }) => {
          this.total = Count
        })
      })
    },
    formatTime(mm) {
      return moment(Number(mm) * 1000).format('YYYY-MM-DD HH:mm:ss')
    },
    loadmore() {
      this.loadmoreloading = true
      this.queryLogs()
    },
    addQuery(params) {
      let domain = this.dominList
      const condis = JSON.parse(JSON.stringify(this.condis))
      if (domain !== 'ALL') {
        condis.push({
          condi: {label: 'domain'},
          keyword: domain
        })
      }
      const Query = condis.map(item => `${item.condi.label}:${item.keyword}`).join(' and ')
      if (Query) {
        params.Query = Query
      }
    },
    queryLogs() {
      const { Context, startTime, endTime, dominList } = this
      const params = {
        Version: '2018-01-25',
        Count: 20,
        FromTime: startTime,
        ToTime: endTime,
        Context, 
      }
      this.addQuery(params)
      this.axios.post(DESCRIBE_ACCESS_LOGS, params).then(resp => {
        this.generalRespHandler(resp, ({ Data: { Context, Data, Count }}) => {
          Data = Data.map(d => JSON.parse(d))
          this.tableDataBegin = this.tableDataBegin.concat(Data)
          this.Context = Context
        })
      }).then(() => {
        this.loading = false
        this.loadmoreloading = false
      })
    },
    //时间选择按钮
    choseDate(thisType){
      this.thisType=thisType;
      var ipt1 = document.querySelector(".dataTime input:nth-child(2)");
      var ipt2 = document.querySelector(".dataTime input:nth-child(4)");
      const end = new Date();
      const start = new Date();
      if (thisType == "1") {
        start.setTime(start.getTime() - 3600 * 1000);
      } else if (thisType == "2") {
        start.setTime(start.getTime() - 3600 * 1000 * 6);
      } else if (thisType == "3") {
        start.setTime(start.getTime() - 3600 * 1000 * 24);
      }else if (thisType == "4") {
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 2);
        end.setTime(end.getTime() - 3600 * 1000 * 24);
      }else if (thisType == "5") {
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      }
      ipt1.value = moment(start).format("YYYY-MM-DD HH:mm:ss");
      ipt2.value = moment(end).format("YYYY-MM-DD HH:mm:ss");
      this.startTime = moment(start).format("YYYY-MM-DD HH:mm:ss");
      this.endTime = moment(end).format("YYYY-MM-DD HH:mm:ss");
    },
    //创建下载任务
    createDownTask(){
      this.createDownTaskModel=true;
    },
    //关闭下载任务弹框
    closeCreateTaskModel(isShow){
      this.createDownTaskModel=false;
    },
    createDownloadTask(name) {
      const { Context, startTime, endTime, dominList } = this
      let domain = dominList
      if (domain === 'ALL') {
        domain = 'all'
      }
      const params = {
        Version: '2018-01-25',
        Host: domain,
        FromTime: startTime,
        ToTime: endTime,
        Name: name,
        Sort: 'desc',
        Edition: 'clb-waf',
      }
      this.addQuery(params)
      this.axios.post(CREATE_ACCESS_DOWNLOAD_RECORD, params).then(resp => {
        this.generalRespHandler(resp, ({ Context, Data, Count }) => {
          this.createDownTaskModel = false
        }, COMMON_ERROR, this.t('创建成功，你可以前往“查询下载任务”界面查看任务状态', 'WAF.cjcgnkyqwcx'))
      })
    },
  }
}
</script>
<style lang="scss" scoped>
.newClear:after{
  content:'';
  clear:both;
  display:block;
}
::v-deep input{
  height:30px;
  line-height:30px;
  border-radius: 0;
}
::v-deep button{
  height:30px;
  line-height:30px;
  padding:0 20px;
  border-radius: 0;
}
.wrapper{
  width:100%;
}
.topDateIpt{
  width:100%;
  background-color: #fff;
  box-shadow: 0 2px 3px 0 rgba(0,0,0,.2);
  padding:20px;
  border:1px solid #ddd;
  box-shadow: 0 2px 3px 0 rgba(0,0,0,.2);
  .listTop{
    margin-bottom:20px;
  }
}
.dominList{
  float:left;
  margin-right:10px;
}
.addBgColor{
  color:#fff;
  background-color:#006eff;
}
.btnGroup{
  float:left;
}
.dataTime{
  height:30px;
  line-height: 30px;
  border-radius: 0;
  float:left;
  margin-left:10px;
  ::v-deep .el-input__icon{
    line-height: 26px;
  }
  ::v-deep .el-range-separator{
    line-height: 26px;
    width:7%;
  }
}
.shortSelect{
  width:120px;
  font-size:12px;
  margin-right:10px;
  ::v-deep input{
    font-size:12px;
  }
}
.inputIpt{
  width:178px;
  margin-right:10px;
}
::v-deep button.selectBtn{
  background-color:#006eff;
  color:#fff;
}
.el-icon-download{
  float:right;
  font-size:20px;
}
.tableCon{
  width:100%;
  min-height:200px;
  background-color:#fff;
  box-shadow: 0 2px 3px 0 rgba(0,0,0,.2);
  padding: 20px 0;
  margin:20px 0;
  border:1px solid #ddd;
}
.topSet{
  text-align:right;
  padding-bottom:20px;
  padding-right:20px;
  border-bottom:1px solid #ddd;
  .el-icon-setting{
    font-size:18px;
    float:right;
  }
}
.tableMian{
  min-height: 450px;
}
.columns {
  label {
    width: 120px;
  }
  ::v-deep .el-checkbox+.el-checkbox {
    margin-left: 0;
  }
  ::v-deep .el-checkbox {
    font-size: 12px;
  }
  ::v-deep .el-checkbox__label {
    font-size: 12px;
  }
}
.loadmore {
  border-bottom: 1px solid #ebeef5;
  padding: 5px 0;
  text-align: center;
}
.input-with-select {
  width: 600px;
  ::v-deep .el-input-group__append {
    button {
      padding: 0 5px;
      font-size: 12px;
    }
  }
}
</style>
<template>
  <div class="wrapper_item">
    <div class="header_top">
      <el-row type="flex" justify="space-between">
        <el-col>
          <el-button type="primary" @click="getExpends">{{t('一键展开', 'WAF.yjzk')}}</el-button>
          <span style="color: #bbb; margin-left: 10px">{{t('统计数据源为会话前600条数据', 'WAF.tjsjy')}}</span>
        </el-col>
        <el-col>
          <el-row type="flex">
            <el-input placeholder="请输入" v-model="keyword" class="input-with-select">
              <el-select v-model="condi" value-key="label" slot="prepend" :placeholder="t('请选择过滤条件', 'WAF.qxzgltj')" style="width: 150px;">
                <el-option v-for="item in query" :key="item.value" :label="item.value" :value="item"></el-option>
              </el-select>
              <el-button slot="append" @click="addCondi">{{t('添加过滤条件', 'WAF.tjgltj')}}</el-button>
            </el-input>&nbsp;&nbsp;
            <el-button class="selectBtn" @click="search">{{t('查询', 'WAF.js')}}</el-button>
            <!-- <el-tooltip placement="top" effect="dark" class="mode-tooltip" v-if="infoIcon">
              <i class="el-icon-info"></i>
              <span slot="content" @click="openDialog"><span style="cursor: pointer">帮助</span></span>
            </el-tooltip> -->
            <!-- <el-input clearable v-model="recordSearch">
              <i class="el-icon-search el-input__icon" slot="suffix"/>
            </el-input>
            <el-button type="primary" class="selectBtn">查询</el-button></span> -->
          </el-row>
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
        </el-col>
      </el-row>
    </div>
      <el-dialog title="搜索帮助" :visible.sync="imgShow" width="1000px">
        <img src="~@/assets/WAF/search-dialog.png" style="width: 940px" />
      </el-dialog>
    <div class="content"> 
      <el-table
        :data="recordList"
        style="width: 100%"
        :expand-row-keys="expendsAll"
        :row-key="getRowKeys"
        :empty-text="t('暂无数据', 'WAF.zwsj')"
        v-loading="loading"
      >
        <el-table-column
          type="selection"
          class-name="hide"
          width="1"
        />
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item :label="t('GET参数', 'WAF.canshu')">
                <span>{{ props.row.query }}</span>
              </el-form-item>
              <el-form-item label="Body">
                <span>{{ props.row.body }}</span>
              </el-form-item>
              <el-form-item label="UA">
                <span>{{ props.row.ua }}</span>
              </el-form-item>
              <el-form-item label="Referer">
                <span>{{ props.row.http_referer }}</span>
              </el-form-item>
              <el-form-item label="Cookie">
                <span>{{ props.row.cookie }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column :label="t('请求时间', 'WAF.qqsj')" prop="timestamp">
          <el-button type="text" slot="header" style="padding: 0; color: #444;" @click="setSort('timestamp')">
            {{t('请求时间', 'WAF.qqsj')}}
            <i class="el-icon-caret-top" v-if="sort === 'timestamp:1'"></i>
            <i class="el-icon-caret-bottom" v-if="sort === 'timestamp:-1'"></i>
          </el-button>
          <template slot-scope="scope">
            {{ scope.row.timestamp | formatMillisecond }}
          </template>
        </el-table-column>
        <el-table-column label="HTTP协议版本" prop="protocal" v-if="httpOptions.length">
          <el-dropdown slot="header" style="padding: 0" @command="onChangeProtocal">
            <span class="el-dropdown-link" style="color: #909399;">
              HTTP{{t('协议', 'WAF.xy')}}版本<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="0">全部</el-dropdown-item>
              <el-dropdown-item v-for="item in httpOptions" :command="item">{{item}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-table-column>
        <el-table-column :label="t('请求方法', 'WAF.qqff')" prop="http" v-if="requestOptions.length">
          <el-dropdown slot="header" style="padding: 0" @command="onChangeRequest">
            <span class="el-dropdown-link" style="color: #909399;">
              {{t('请求方法', 'WAF.qqff')}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="0">全部</el-dropdown-item>
              <el-dropdown-item v-for="item in requestOptions" :command="item">{{item}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-table-column>
        <el-table-column label="UA" prop="ua" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column :label="t('请求URL', 'WAF.qqurl')" prop="url"></el-table-column>
        <el-table-column :label="t('GET参数', 'WAF.canshu')" prop="query"></el-table-column>
        <el-table-column :label="t('状态码', 'WAF.ztm')" prop="status" v-if="statusOptions.length">
          <el-dropdown slot="header" style="padding: 0" @command="onChangeStatus">
            <span class="el-dropdown-link" style="color: #909399;">
              {{t('状态码', 'WAF.ztm')}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="0">全部</el-dropdown-item>
              <el-dropdown-item v-for="item in statusOptions" :command="item">{{item}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 15, 20, 25, 30, 35, 40, 45, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import pako from 'pako'
import { DESCRIBE_BOT_RECORD_ITEMS } from '@/constants'
export default {
  data () {
    return {
      tableData: [],
      tableDataCopy: [],
      total: 0, // 总条数
      currentPage: 1, // 当前页
      pageSize: 20, // 每页显示条数
      recordSearch: "", // 搜索框绑定
      imgShow: false, // 弹出框状态
      expendsAll: [], // 设置你要展开行的id
      toogle: false,
      httpOptions: [],
      requestOptions: [],
      statusOptions: [],
      infoIcon: false,
      condi: "", // select绑定
      condis: [],
      keyword: "",
      sort: 'timestamp:-1',
      queryCopy: [
        {
          label: 'ua',
          value: 'UA',
        },
        {
          label: 'cookie',
          value: 'Cookie',
        },
        {
          label: 'url',
          value: this.t('请求URL', 'WAF.qqurl'),
        },
        {
          label: 'query',
          value: this.t('GET参数', 'WAF.canshu'),
        },
        {
          label: 'body',
          value: 'Body',
        },
        {
          label: 'http_referer',
          value: 'Referer',
        },
      ],
      query: [],
      loading: true
    }
  },
  components: {
  },
  created() {
    this.SrcIp = this.$route.query.SrcIp
    this.Id = this.$route.query.Id
    this.domain = this.$route.query.domain
  },
  mounted() {
    this.query = JSON.parse(JSON.stringify(this.queryCopy))
    this.getRecordList()
  },
  filters: {
    formatMillisecond(val) {
      return moment(val).format("YYYY-MM-DD HH:mm:ss")
    },
  },
  computed: {
    recordList() {
      return this.tableData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
    },
  },
  methods: {
    setSort(key) {
      if (this.sort.includes(key)) { // 升降序
        if (this.sort.includes('-')) {
          this.sort = `${key}:1`
          this.tableData = this.tableDataCopy.sort((a, b) => {
            return a.timestamp - b.timestamp
          })
        } else {
          this.sort = `${key}:-1`
          this.tableData = this.tableDataCopy.sort((a, b) => {
            return b.timestamp - a.timestamp
          })
        }
      } else { // 换个排序字段 默认降序
        this.sort = `${key}:-1`
      }
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
    search() {
      if (!this.condis.length) {
        this.getRecordList()
      }
      this.condis.forEach(item => {
        this.tableData = this.tableDataCopy.filter(v => {
          return v[item.condi.label].includes(item.keyword)
        })
      })
      this.total = this.tableData.length
    },
    getExpends(){
      this.toogle = !this.toogle
      var Id = this.recordList.map(item => item.id)
      this.expendsAll = this.toogle ? Id :[]
    },
    getRowKeys(row){
      return row.id
    },
    openDialog() {
      this.imgShow = true
    },
    handleSizeChange(size) {
      this.pageSize = size
    },
    handleCurrentChange(page) {
      this.currentPage = page
    },
    // http协议版本筛选
    onChangeProtocal(status) {
      if (status == 0) {
        this.getRecordList()
      }
      this.tableData = this.tableDataCopy.filter((v) => {
        return v.protocal == status
      })
      this.total = this.tableData.length
    },
    // 请求方法筛选
    onChangeRequest(status) {
      if (status == 0) {
        this.getRecordList()
      }
      this.tableData = this.tableDataCopy.filter((v) => {
        return v.http == status
      })
      this.total = this.tableData.length
    },
     // 状态码筛选
    onChangeStatus(status) {
      if (status == 0) {
        this.getRecordList()
      }
      this.tableData = this.tableDataCopy.filter((v) => {
        return v.status == status
      })
      this.total = this.tableData.length
    },
    // 清空
    clearTip() {
      
    },
    unzip(e) {
      var t = "";
      try {
        var a = atob(e);
        var n = a.split("").map(function (e) {
          return e.charCodeAt(0)
        });
        return pako.inflate(n, {
          to: "string"
        })
      } catch (i) {
        return t
      }
    },
    // BOT记录访问详情
    getRecordList() {
      this.loading = true
      const params = {
        Version: "2018-01-25",
        Domain: this.domain,
        Id: this.Id
      }
      this.axios.post(DESCRIBE_BOT_RECORD_ITEMS, params).then((resp) => {
        this.generalRespHandler(resp, (Response) => {
          const s = this.unzip(Response.Res[0].Items)
          let list = s.split("#-4789-#");
          let items = [];
          list.forEach((item, index) => {
              let array = item.split("#-9874-#");
              array = array.map((item) => {
                  return "txw4f-none" === item ? "空" : ("object" === typeof item && !item ? "null" : item || "空");
              });
              let queryStr = array[2];
              try {
                  queryStr = decodeURIComponent(array[2]);
              } catch (error) {
                  queryStr = array[2];
              }
              items.push({
                  id: (index + 1) + "",
                  url: array[1],
                  http: array[3],
                  query:queryStr,
                  body: array[7],
                  status: array[16],
                  protocal: array[15],
                  ua: array[5],
                  http_referer: array[6],
                  timestamp: parseInt(array[4], 10),
                  cookie: array[13],
                  http_connection: array[8],
                  http_accept: array[9],
                  http_accept_encoding: array[10],
                  http_accept_language: array[11],
                  http_upgrade_insecure_requests: array[12]
              });
          });
          this.tableData = items.sort((a, b) => {
            return b.timestamp - a.timestamp
          })
          this.tableDataCopy = items
          this.total = items.length
        })
      }).then(() => {
        let httpArr = []
        let requestArr = []
        let statusArr = []
        this.tableData.forEach((item) => {
          httpArr.push(item.protocal)
          requestArr.push(item.http)
          statusArr.push(item.status)
        })
        this.httpOptions = Array.from(new Set(httpArr))
        this.requestOptions = Array.from(new Set(requestArr))
        this.statusOptions = Array.from(new Set(statusArr))
        this.loading = false
      })
    },
  }
}

</script>
<style lang='scss' scoped>
 ::v-deep .demo-table-expand {
    font-size: 0;
  }
 ::v-deep .demo-table-expand label {
    width: 90px;
  }
::v-deep .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
  }
::v-deep button.selectBtn{
  margin-left: 10px;
}
::v-deep .el-icon-info {
  position: absolute;
  left: calc(100% - 180px);
  line-height: 30px;
  cursor: pointer;
}
::v-deep .el-input__clear {
  position: absolute;
  right: calc(100% + 16px);
}
::v-deep .hide {
  visibility: hidden;
}
.wrapper_item {
  .header_top {
    width: 100%;
    margin-bottom: 10px;
    .el-input__icon {
      line-height: 30px;
    }
    ::v-deep button{
      border-radius: 0;
      height:30px;
      line-height: 30px;
      padding:0 16px;
      border:none;
      outline: none;
    }
   ::v-deep button.selectBtn{
      background-color:#006eff;
      color:#fff;
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
  }
  .content {
    width: 100%;
    background-color: #fff;
    border-bottom: 1px solid #ddd;
    padding: 20px 20px 0 20px;
    ::v-deep .el-form-item {
      height:24px;
    }
    ::v-deep .el-form-item__label {
      font-weight: 900;
    }
  }
}

</style>

<template>
  <div class="streamManagement-wrap">
    <HeadCom title="流管理"></HeadCom>
    <div class="streamWrap">
      <div class="streamBnt">
        <div class="bntWrap" style="flex:1">
          <el-radio-group v-model="type">
            <el-radio-button :label="$t('CSS.domainManagement.33')">{{$t('CSS.domainManagement.33')}}</el-radio-button>
            <el-radio-button :label="$t('CSS.domainManagement.34')">{{$t('CSS.domainManagement.34')}}</el-radio-button>
            <el-radio-button label="禁推流">禁推流</el-radio-button>
          </el-radio-group>
        </div>
        <div class="streamInp" v-show="type !== '禁推流'">
          <el-input v-model="streamName" placeholder="按照推流ID搜索" size="small" class="inputSearch" style="width:90%;">
            <i slot="suffix" class="el-input__icon el-icon-search" @click="doFilter"></i>
          </el-input>
          <svg
            @click="doFilter"
            t="1576486867236"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="2180"
            width="200"
            height="200"
            style="width:30px;height:30px;float:right;"
          >
            <path
              d="M512 269.922592l0 121.038704 161.384597-161.384597L512 68.191078l0 121.038704c-178.330548 0-322.770218 144.43967-322.770218 322.770218 0 63.343677 18.559705 122.047684 50.02944 171.874509l58.905598-58.905598c-17.953907-33.689287-28.242228-72.018244-28.242228-112.969934C269.922592 378.251833 378.251833 269.922592 512 269.922592zM784.740778 340.124468l-58.905598 58.905598c17.953907 33.689287 28.242228 72.018244 28.242228 112.969934 0 133.748167-108.329241 242.077408-242.077408 242.077408L512 633.038704 350.614379 794.423301l161.384597 161.384597L511.998977 834.770218c178.330548 0 322.770218-144.43967 322.770218-322.770218C834.770218 448.656323 816.210513 389.952316 784.740778 340.124468z"
              p-id="2181"
            />
          </svg>
        </div>
      </div>
      <div class="streamWTable">
        <div class="tableWrap">
          <el-table :data="tableData" empty-text="暫無數據" style="width: 100%">
            <el-table-column prop="StreamName" :label="$t('CSS.domainManagement.35')"></el-table-column>

            <template v-if="type !== '禁推流'">
              <el-table-column prop="DomainName" label="域名"></el-table-column>
              <el-table-column prop="AppName" :label="$t('CSS.domainManagement.36')"></el-table-column>
            </template>

            <template v-if="type !== $t('CSS.domainManagement.34')">
              <el-table-column :label="$t('CSS.domainManagement.3')">
                <span v-if="type === '在线流'">直播中</span>
                <span v-if="type === '禁推流'">已禁用</span>
              </el-table-column>
            </template>

            <template v-if="type === $t('CSS.domainManagement.33')">
              <el-table-column :label="$t('CSS.domainManagement.37')" width="180">
                <template slot-scope="scope">
                  {{format(scope.row.PublishTimeList[0].PublishTime)}}
                </template>
              </el-table-column>
            </template>

            <template v-if="type === $t('CSS.domainManagement.34')">
              <el-table-column prop="StreamEndTime" :label="$t('CSS.domainManagement.38')" width="180">
                <template slot-scope="scope">
                  {{format(scope.row.StreamEndTime)}}
                </template>
              </el-table-column>
            </template>

            <el-table-column label="操作">
              <template slot-scope="scope">
                <template v-if="type === $t('CSS.domainManagement.33')">
                  <el-button type="text" size="small" @click="test(scope.row)">{{$t('CSS.domainManagement.39')}}</el-button>
                  <el-button type="text" size="small" @click="dropStream(scope.row)">{{$t('CSS.domainManagement.40')}}</el-button>
                </template>
                <el-button v-if="type === '禁推流'" type="text" size="small" @click="enable(scope.row)">{{$t('CSS.domainManagement.7')}}</el-button>
                <el-button v-else type="text" size="small" @click="disable(scope.row)">禁用</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="tabListPage">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNum"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HeadCom from "@/components/public/Head";
import { 
  LIVE_DESCRIBE_LIVESTREAMONLINELIST,
  LIVE_DESCRIBE_LIVESTREAMEVENTLIST,
  LIVE_DESCRIBE_LIVEFORBIDSTREAMLIST,
  LIVE_FORBIDLIVESTREAM,
  LIVE_RESUMELIVESTREAM,
  LIVE_DROPLIVESTREAM
} from '@/constants'
import moment from 'moment'
export default {
  components: {
    HeadCom
  },
  name: "streamManagement",
  data() {
    return {
      type: this.$t('CSS.domainManagement.33'),
      tableData: [],
      streamName: '',
      pageNum: 1,
      pageSize: 10,
      total: 0,
    };
  },
  watch: {
    type(n) {
      this.onTypeChange(n)
    }
  },
  mounted() {
    this.onTypeChange(this.type)
  },
  methods: {
    format(utcDate) {
      return moment(utcDate).format('YYYY-MM-DD HH:mm:ss')
    },
    onTypeChange(val) {
      this.tableData = []
      let url = LIVE_DESCRIBE_LIVESTREAMONLINELIST
      let key = 'OnlineInfo'
      const params = {
        Version: '2018-08-01',
        PageNum: this.pageNum,
        PageSize: this.pageSize,
        StreamName: this.streamName,
      }
      let cb
      switch(val) {
        case this.$t('CSS.domainManagement.33'):
          break
        case this.$t('CSS.domainManagement.34'):
          url = LIVE_DESCRIBE_LIVESTREAMEVENTLIST
          key = 'EventList'
          params.EndTime = moment.utc().format()
          params.StartTime = moment().subtract(7, 'd').utc().format()
          params.IsFilter = 1 // 返回推流历史记录
          break
        case '禁推流':
          url = LIVE_DESCRIBE_LIVEFORBIDSTREAMLIST
          key = 'ForbidStreamList'
          delete params.StreamName
          break
        default: break
      }
      this.axios.post(url, params).then(({ Response }) => {
        this.tableData = Response[key]
        this.total = Response.TotalNum
      })
    },
    test(row) {

    },
    disable(row) {
      this.$confirm(`${this.$t('CSS.domainManagement.46')}${row.StreamName}?`, '禁用', {
        confirmButtonText: this.$t('CSS.domainManagement.43'),
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.post(LIVE_FORBIDLIVESTREAM, {
          Version: '2018-08-01',
          AppName: row.AppName,
          DomainName: row.DomainName,
          StreamName: row.StreamName,
        }).then(() => this.onTypeChange(this.type))
      })
    },
    enable(row) {
      this.$confirm(`${$t('CSS.domainManagement.44')}${row.StreamName}?`, this.$t('CSS.domainManagement.7'), {
        confirmButtonText: this.$t('CSS.domainManagement.43'),
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.post(LIVE_RESUMELIVESTREAM, {
          Version: '2018-08-01',
          AppName: row.AppName || '',
          DomainName: row.DomainName || '',
          StreamName: row.StreamName,
        }).then(() => this.onTypeChange(this.type))
      })
    },
    dropStream(row) {
      this.$confirm(`${this.$t('CSS.domainManagement.42')}${row.StreamName}?`, this.$t('CSS.domainManagement.45'), {
        confirmButtonText: this.$t('CSS.domainManagement.43'),
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.post(LIVE_DROPLIVESTREAM, {
          Version: '2018-08-01',
          AppName: row.AppName,
          DomainName: row.DomainName,
          StreamName: row.StreamName,
        }).then(() => {
          this.$message({
            message: this.$t('CSS.domainManagement.41'),
            type: 'success'
          })
          this.onTypeChange(this.type)
        })
      })
    },
    doFilter() {
      this.currentPage = 1
      this.$nextTick(() => this.onTypeChange(this.type))
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.$nextTick(() => this.onTypeChange(this.type))
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.$nextTick(() => this.onTypeChange(this.type))
    }
  }
};
</script>

<style lang="scss" scoped>
.streamManagement-wrap >>> .el-button {
  height: 30px;
  line-height: 30px;
  border-radius: 0;
  font-size: 12px;
  padding-top: 0;
}
.streamWrap {
  width: 100%;
  .streamBnt {
    width: 100%;
    display: flex;
    padding: 20px;
    box-sizing: border-box;
  }
  .streamInp {
    width: 300px;
  }
   .streamWTable{
     width: 100%;
     padding: 0px 20px 0px 20px;
     box-sizing: border-box;
   }
}
.streamWTable {
  padding: 20px 20px 0px 20px;
  box-sizing: border-box;
  width: 100%;
  .tableWrap {
    width: 100%;
    min-height: 450px;
    background: white;
    .Right-style {
      display: flex;
      justify-content: flex-end;

      .esach-inputL {
        width: 300px;
        margin-right: 20px;
      }
    }
    .page-box {
      padding: 20px;
      padding-right: 30px;
      box-sizing: border-box;
    }
  }
}
.tabListPage{
  height:50px;
  padding-top:8px;
  border-top:1px solid #ddd;
  text-align:right;
  background-color:#fff;
  ::v-deep .el-input__inner {
    width: 100% !important;
    height: 30px !important;
  }
}
</style>
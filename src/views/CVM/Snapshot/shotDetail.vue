<template>
  <div id="shot-detail">
    <div class="Title">
      <h2>
        <i class="el-icon-back" @click="$router.go(-1)"></i>
        <span>{{shotDetail.SnapshotId}} ({{shotDetail.SnapshotName}})详情</span>
      </h2>
    </div>
    <div class="tab-div">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="参数" name="first" class="tab-one">
          <div class="div-title">
            <p>快照信息</p>
            <div>
              <ul>
                <li>
                  <span class="span-1">名称</span>
                  <span class="span-2">{{shotDetail.SnapshotName}}</span>
                </li>
                <li>
                  <span class="span-1">快照ID</span>
                  <span class="span-2">{{shotDetail.SnapshotId}}</span>
                </li>
                <li>
                  <span class="span-1">地域</span>
                  <span class="span-2">{{this.shotZone | Regionfilter()}}</span>
                </li>
                <li>
                  <span class="span-1">大小</span>
                  <span class="span-2">{{shotDetail.DiskSize}}GB</span>
                </li>
                <li>
                  <span class="span-1">关联硬盘</span>
                  <span class="span-2">
                    <a href>{{shotDetail.DiskId}}</a>
                  </span>
                </li>
                <li>
                  <span class="span-1">快照类型</span>
                  <span class="span-2">{{shotDetail.DiskUsage | Attributefilter()}}</span>
                </li>
                <li>
                  <span class="span-1">保留时间</span>
                  <span class="span-2">{{shotDetail.IsPermanent === true ? '永久保留':'非永久保留'}}</span>
                </li>
                <li>
                  <span class="span-1">创建时间</span>
                  <span class="span-2">{{shotDetail.CreateTime}}</span>
                </li>
              </ul>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="操作日志" name="second">
          <div class="div-log">
            <div class="div-time">
              <date-picker @getDatePicker="getDatePicker"></date-picker>
            </div>
            <div class="div-table">
              <el-table :data="logArr" style="width: 100%">
                <el-table-column prop="StartTime" label="操作时间"></el-table-column>
                <el-table-column prop="" label="操作名称">
                    <template slot-scope="scope">
                      <p>{{scope.row.Operation | logState()}}</p>
                    </template>
                </el-table-column>
                <el-table-column prop="" label="Action">-</el-table-column>
                <el-table-column prop="Operator" label="操作者"></el-table-column>
                <el-table-column prop="" label="操作结果">
                  <template slot-scope="scope">
                    <p
                      v-if="scope.row.OperationState === 'SUCCESS' "
                      :class="scope.row.OperationState=== 'SUCCESS' ?'green-c':''"
                    >成功</p>
                  </template>
                </el-table-column>
                <el-table-column prop="" label="详情">
                  <template slot-scope="scope">
                    <a disabled>详情</a>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      activeName: 'first',
      shotDetail: '', // 获取当前实例的信息
      shotZone: '',
      logArr: [] // 操作日志信息
    }
  },
  mounted () {
    this.getShotInfo()
    // this.getLog()
  },
  methods: {
    // 基本信息列表
    getShotInfo () {
      var params = {
        Version: '2017-03-12',
        Region: this.$cookie.get('regionv2'),
        'SnapshotIds.0': this.$route.query.SnapshotId
      }

      this.axios.post('cbs2/DescribeSnapshots', params).then(data => {
        this.shotDetail = data.Response.SnapshotSet[0]
        this.shotZone = this.shotDetail.Placement.Zone
      })
    },
    // 得到选中的时间
    getDatePicker (val) {
      this.datePicker = val
      this.getLog()
    },
    // 操作日志信息
    getLog () {
       var params = {
        Version: '2017-03-12',
        Region: this.$cookie.get('regionv2'),
        'Filters.0.Name': 'snapshot-id',
        'Filters.0.Values.0':this.$route.query.SnapshotId
      }

      this.axios.post('cbs2/DescribeSnapshotOperationLogs', params).then(data => {   
        this.logArr = data.Response.SnapshotOperationLogSet
      })
    },
    handleClick (tab, event) {
      console.log(tab, event)
    }
  }
}
</script>

<style lang="scss" scoped>
#shot-detail {
  background: #f2f2f2;
  .Title {
    h2 {
      padding-left: 20px;
      i {
        color: #006eff;
        font-weight: bold;
        padding-right: 20px;
      }
      span {
        font-size: 16px;
        font-weight: 700;
      }
    }
  }
  .tab-div {
    ::v-deep .el-tabs__header {
      background-color: #fff;
      .el-tabs__nav-wrap{
        padding-left: 20px;
      }
    }
    ::v-deep .el-tab-pane {
      max-width: 100%;
      background-color: #fff;
      border: 1px solid #ddd;
    }
    .el-tab-pane {
      margin: 20px;
      padding: 10px;
      .div-title {
        padding: 15px;
        p {
          font-size: 14px;
          font-weight: bold;
          margin: 10px 0;
        }
        ul {
          li {
            line-height: 35px;
            .span-1 {
              color: #888;
              padding-right: 20px;
              white-space: nowrap;
              text-align: left;
              width: 70px;
              display: inline-block;
            }
            .span-2 {
              color: #444;
              word-break: break-word;
            }
          }
        }
      }
      .div-time{

      }
    }
    .tab-one {
      width: 40%;
    }
  }
}
</style>

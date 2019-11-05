<template>
  <div class="OverView">
    <div class="view-tit">概览</div>
    <div class="view-box">
      <div class="bg-purple">
        <div class="item-one">
          <div class="item-tit">资源概览</div>
          <div class="item-div">
            <el-row>
              <el-col :span="5">
                <div class="grid-content">
                  <p class="p-1">您共有云服务器</p>
                  <span class="font-num black-c">{{resourceData.TotalCount}}</span>
                  <span class="span-n">台</span>
                </div>
              </el-col>
              <el-col :span="5">
                <div class="grid-content">
                  <p class="p-1">运行中</p>
                  <span class="font-num green-c">{{resourceData.RunningCount}}</span>
                  <span class="span-n">台</span>
                </div>
              </el-col>
              <el-col :span="5">
                <div class="grid-content">
                  <p class="p-1">安全隔离</p>
                  <span class="font-num yellow-c">{{resourceData.UnSecurityCount}}</span>
                  <span class="span-n">台</span>
                </div>
              </el-col>
              <el-col :span="5">
                <div class="grid-content">
                  <p class="p-1">
                    已过期
                    <i class="el-icon-warning gray-c"></i>
                  </p>
                  <span class="font-num red-c">{{resourceData.ExpiredInstanceCount}}</span>
                  <span class="span-n">台</span>
                </div>
              </el-col>
              <el-col :span="4">
                <div class="grid-content">
                  <p class="p-1">
                    将到期
                    <i class="el-icon-warning gray-c"></i>
                  </p>
                  <span class="font-num red">{{resourceData.DueInstanceCount}}</span>
                  <span class="span-n">台</span>
                </div>
              </el-col>
              <el-col :span="4">
                <div class="grid-content"></div>
              </el-col>
            </el-row>
          </div>
          <div class="item-div">
            <el-row>
              <el-col :span="5">
                <div class="grid-content">
                  <p class="p-1">云硬盘</p>
                  <span class="font-num blank-c">{{diskData.DiskNumberTotal}}</span>
                  <span class="span-n">个</span>
                </div>
              </el-col>
              <el-col :span="5">
                <div class="grid-content">
                  <p class="p-1">已过期云硬盘</p>
                  <span class="font-num red-c">{{diskData.ExpiredNumberTotal}}</span>
                  <span class="span-n">个</span>
                </div>
              </el-col>
              <el-col :span="5">
                <div class="grid-content">
                  <p class="p-1">将到期云硬盘</p>
                  <span class="font-num red-c">{{diskData.DiskNumberExpireIn7days}}</span>
                  <span class="span-n">个</span>
                </div>
              </el-col>
              <el-col :span="5">
                <div class="grid-content">
                  <p class="p-1">快照数量</p>
                  <span class="font-num black-c">{{shotData.SnapshotNumberUsedTotal}}</span>
                  <span class="span-n">个</span>
                </div>
              </el-col>
              <el-col :span="4">
                <div class="grid-content">
                  <p class="p-1">快照容量</p>
                  <span class="font-num black-c">{{shotData.SnapshotCapacityUsedTotal}}</span>
                  <span class="span-n">GB</span>
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="item-div">
            <el-row>
              <el-col :span="8">
                <div class="grid-content">
                  <p>入侵检测</p>
                  <p>
                    <i class="el-icon-warning red-c"></i>
                    <span>
                      发现
                      <span class="red-c">{{securityData.BruteForceNum}}</span> 次暴力破解
                    </span>
                  </p>
                  <p>
                    <i class="el-icon-warning red-c"></i>
                    <span>
                      发现
                      <span class="red-c">{{securityData.NonlocalLoginNum}}</span> 次异地登录行为
                    </span>
                  </p>
                  <p>
                    <i class="el-icon-warning red-c"></i>
                    <span>
                      发现
                      <span class="red-c">{{securityData.TrojanFileNum}}</span> 个木马文件
                    </span>
                  </p>
                  <p>
                    <i class="el-icon-warning red-c"></i>
                    <span>
                      发现
                      <span class="red-c">{{securityData.VulNum}}</span> 个漏洞
                    </span>
                  </p>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="grid-content">
                  <p>DDos防护</p>
                  <p>
                    <i class="el-icon-success green-c"></i>
                    <span>DDos防护正常</span>
                  </p>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="grid-content">
                  <p>Web应用防火墙</p>
                  <p>
                    <i class="el-icon-warning red-c"></i>
                    <span>未启用Web应用防火墙（WAF）</span>
                  </p>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="item-one">
          <div class="item-tit tit-2">
            各地域资源
            <div class="tit-r">
              <el-checkbox v-model="checked">只显示有资源的地域</el-checkbox>
            </div>
          </div>
          <div class="item-box">
            <div class="box-1" v-for="(item,index) in infoArr" :key="index" v-show="checked=== false">
              <div class="box-tit">{{cityArr[index] | RegionAllfilter()}}</div>
              <h4>云服务器</h4>
              <div class="div-1 div-flex">
                <div>
                  <p class="p-3">数量</p>
                  <span class="span-2">{{item.ResourceDetail.TotalCount}}</span>
                </div>
                <div>
                  <p class="p-3">运行中</p>
                  <span class="span-2 green-c">{{item.ResourceDetail.RunningCount}}</span>
                </div>
                <div>
                  <p class="p-3">已隔离</p>
                  <span class="span-2">{{item.ResourceDetail.UnSecurityCount}}</span>
                </div>
                <div>
                  <p class="p-3">已过期</p>
                  <span class="span-2">{{item.ResourceDetail.ExpiredInstanceCount}}</span>
                </div>
                <div>
                  <p class="p-3">将到期</p>
                  <span class="span-2 orange-c">{{item.ResourceDetail.DueInstanceCount}}</span>
                </div>
              </div>
              <div class="div-2 border-right">
                <p class="p-tit">包年包月云服务器</p>
                <div class="div-3">
                  <p class="p-3">已有</p>
                  <span
                    class="span-2"
                  >{{item.PrePayQuota.TotalUsedQuota == undefined ? 0:item.PrePayQuota.TotalUsedQuota}}</span>
                </div>
                <div class="div-3">
                  <p class="p-3">剩余配额</p>
                  <span
                    class="span-2"
                  >{{item.PrePayQuota.SurplusQuota == undefined ? 0 :item.PrePayQuota.SurplusQuota}}</span> &nbsp;
                  <i class="el-icon-warning gray-c"></i>
                </div>
              </div>
              <div class="div-2">
                <p class="p-tit">按量计费云服务器</p>
                <div class="div-3">
                  <p class="p-3">已有</p>
                  <span
                    class="span-2"
                  >{{item.PostPayQuota.TotalUsedQuota == undefined ? 0:item.PostPayQuota.TotalUsedQuota}}</span>
                </div>
                <div class="div-3">
                  <p class="p-3">剩余配额</p>
                  <span
                    class="span-2"
                  >{{item.PostPayQuota.SurplusQuota == undefined ? 0 :item.PostPayQuota.SurplusQuota}}</span> &nbsp;
                  <i class="el-icon-warning gray-c"></i>
                </div>
              </div>
              <div class="div-4">
                <p class="p-line">快照</p>
                <div>
                  <el-progress :percentage="item.percentage10"></el-progress>
                  <p>
                    快照容量：
                    <span>
                      已用
                      <span>{{item.SnapShotQuota.UsedCapacity == undefined ? 0:item.SnapShotQuota.UsedCapacity}}</span> GB
                    </span>
                  </p>
                </div>
                <div>
                  <el-progress :percentage="item.percentage20"></el-progress>
                  <p>
                    配额：
                    <span>
                      已用
                      <span>{{item.SnapShotQuota.UsedQuota == undefined ? 0 :item.SnapShotQuota.UsedQuota}}</span> GB
                    </span>，共
                    <span>{{item.SnapShotQuota.TotalQuota == undefined ? 0 : item.SnapShotQuota.TotalQuota}}</span>个
                  </p>
                </div>
              </div>
              <div class="div-4">
                <p class="p-line">自定义镜像</p>
                <div>
                  <el-progress :percentage="item.percentage30"></el-progress>
                  <p>
                    配额：
                    <span>
                      已用
                      <span>{{item.ImageQuota.UsedQuota == undefined ? 0 :item.ImageQuota.UsedQuota}}</span> GB
                    </span>，共
                    <span>{{item.ImageQuota.TotalQuota == undefined ? 0 :item.ImageQuota.TotalQuota }}</span>个
                  </p>
                </div>
              </div>
            </div>
            <div class="box-1" v-for="(item,index) in infoArr" v-show="checked=== true && item.ResourceDetail.TotalCount > 0">
              <div class="box-tit">{{cityArr[index] | RegionAllfilter()}}</div>
              <h4>云服务器</h4>
              <div class="div-1 div-flex">
                <div>
                  <p class="p-3">数量</p>
                  <span class="span-2">{{item.ResourceDetail.TotalCount}}</span>
                </div>
                <div>
                  <p class="p-3">运行中</p>
                  <span class="span-2 green-c">{{item.ResourceDetail.RunningCount}}</span>
                </div>
                <div>
                  <p class="p-3">已隔离</p>
                  <span class="span-2">{{item.ResourceDetail.UnSecurityCount}}</span>
                </div>
                <div>
                  <p class="p-3">已过期</p>
                  <span class="span-2">{{item.ResourceDetail.ExpiredInstanceCount}}</span>
                </div>
                <div>
                  <p class="p-3">将到期</p>
                  <span class="span-2 orange-c">{{item.ResourceDetail.DueInstanceCount}}</span>
                </div>
              </div>
              <div class="div-2 border-right">
                <p class="p-tit">包年包月云服务器</p>
                <div class="div-3">
                  <p class="p-3">已有</p>
                  <span
                    class="span-2"
                  >{{item.PrePayQuota.TotalUsedQuota == undefined ? 0:item.PrePayQuota.TotalUsedQuota}}</span>
                </div>
                <div class="div-3">
                  <p class="p-3">剩余配额</p>
                  <span
                    class="span-2"
                  >{{item.PrePayQuota.SurplusQuota == undefined ? 0 :item.PrePayQuota.SurplusQuota}}</span> &nbsp;
                  <i class="el-icon-warning gray-c"></i>
                </div>
              </div>
              <div class="div-2">
                <p class="p-tit">按量计费云服务器</p>
                <div class="div-3">
                  <p class="p-3">已有</p>
                  <span
                    class="span-2"
                  >{{item.PostPayQuota.TotalUsedQuota == undefined ? 0:item.PostPayQuota.TotalUsedQuota}}</span>
                </div>
                <div class="div-3">
                  <p class="p-3">剩余配额</p>
                  <span
                    class="span-2"
                  >{{item.PostPayQuota.SurplusQuota == undefined ? 0 :item.PostPayQuota.SurplusQuota}}</span> &nbsp;
                  <i class="el-icon-warning gray-c"></i>
                </div>
              </div>
              <div class="div-4">
                <p class="p-line">快照</p>
                <div>
                  <el-progress :percentage="item.percentage10"></el-progress>
                  <p>
                    快照容量：
                    <span>
                      已用
                      <span>{{item.SnapShotQuota.UsedCapacity == undefined ? 0:item.SnapShotQuota.UsedCapacity}}</span> GB
                    </span>
                  </p>
                </div>
                <div>
                  <el-progress :percentage="item.percentage20"></el-progress>
                  <p>
                    配额：
                    <span>
                      已用
                      <span>{{item.SnapShotQuota.UsedQuota == undefined ? 0 :item.SnapShotQuota.UsedQuota}}</span> GB
                    </span>，共
                    <span>{{item.SnapShotQuota.TotalQuota == undefined ? 0 : item.SnapShotQuota.TotalQuota}}</span>个
                  </p>
                </div>
              </div>
              <div class="div-4">
                <p class="p-line">自定义镜像</p>
                <div>
                  <el-progress :percentage="item.percentage30"></el-progress>
                  <p>
                    配额：
                    <span>
                      已用
                      <span>{{item.ImageQuota.UsedQuota == undefined ? 0 :item.ImageQuota.UsedQuota}}</span> GB
                    </span>，共
                    <span>{{item.ImageQuota.TotalQuota == undefined ? 0 :item.ImageQuota.TotalQuota }}</span>个
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      checked: true, // 选择框
      resourceData: [], // 资源
      cityArr: [], // 城市组
      infoArr: [],
      securityData: [],
      diskData: [], // 云硬盘数组
      shotData: [], // 快照数组
      percentage: 0, // 百分比
      fullscreenLoading: false // 页面加载动画
    }
  },
  created () {
    this.getData()
    this.getDisk()
  },
  methods: {
    getData () {
      // 请求云服务器列表
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      var parms = {
        Version: '2017-03-12',
        Region: this.$cookie.get('regionv2')
      }
      this.axios.post('cvm2/DescribeResourcesOverview', parms).then(data => {
        // console.log(data.Response)
        this.resourceData = data.Response.ResourceOverview
        this.securityData =
          data.Response.SecurityOverview.SecurityIntrusions.InstrusionsDetectionDetail
        this.resourceDetailData = data.Response.ResourceDetailOverview

        for (var index in this.resourceDetailData) {
          this.cityArr.push(index)
          this.infoArr.push(this.resourceDetailData[index])
        }

        for (var i in this.infoArr) {
          this.percentage = Math.ceil(this.infoArr[i].SnapShotQuota.UsedQuota) * 100 / (this.infoArr[i].SnapShotQuota.TotalQuota)
          this.percentage1 = Math.ceil(this.infoArr[i].SnapShotQuota.UsedQuota) * 100 / (this.infoArr[i].SnapShotQuota.TotalQuota)
          this.percentage2 = Math.ceil(this.infoArr[i].ImageQuota.UsedQuota) * 100 / (this.infoArr[i].ImageQuota.TotalQuota)
          this.infoArr[i].percentage10 = Math.ceil(this.percentage)
          this.infoArr[i].percentage20 = Math.ceil(this.percentage1)
          this.infoArr[i].percentage30 = Math.ceil(this.percentage2)
          if (isNaN(this.percentage)) {
            this.infoArr[i].percentage10 = 0
          }
          if (isNaN(this.percentage1)) {
            this.infoArr[i].percentage20 = 0
          }
          if (isNaN(this.percentage2)) {
            this.infoArr[i].percentage30 = 0
          }
        }
        loading.close()
      })
    },
    getDisk () {
      // 请求硬盘列表
      var parms = {
        Version: '2017-03-12',
        Region: this.$cookie.get('regionv2')
      }
      this.axios.post('cbs2/DescribeUserDiskResources', parms).then(data => {
        this.diskData = data.Response.DiskOverview
        this.shotData = data.Response.SnapOverview
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.OverView {
  .view-tit {
    height: 50px;
    font-size: 16px;
    font-weight: 700;
    line-height: 50px;
    padding: 0 20px;
    background: #fff;
  }
  .view-box {
    margin: 20px;
    .bg-purple {
      .item-one {
        padding: 20px;
        margin-bottom: 20px;
        background: #fff;
        .item-tit {
          font-size: 16px;
          font-weight: 700;
          .tit-r {
            float: right;
            font-size: 12px;
            a {
              font-weight: normal;
              text-decoration: none;
              color: #006eff;
              margin-left: 15px;
            }
            .el-checkbox__label {
              font-size: 12px !important;
            }
          }
        }
        .item-div {
          padding-bottom: 15px;
          margin-top: 20px;
          border-bottom: 1px solid #ddd;
          p {
            line-height: 25px;
            i {
              margin-right: 5px;
            }
          }
          .p-1 {
            font-size: 12px;
            font-weight: bold;
            color: #444;
            margin-bottom: 12px;
          }
          .font-num {
            font-size: 36px;
          }
          .div-right {
            margin-right: 100px;
          }
          .span-n {
            color: #bbb;
          }
        }
        .item-div:last-child {
          border-bottom: none;
        }
        ul {
          margin-left: 20px;
        }
        li {
          list-style: disc;
          color: #c2c2c2;
          line-height: 1.5;
          margin-bottom: 13px;
        }
        li:first-child {
          margin-top: 15px;
        }
        li a {
          color: #444;
          text-decoration: none;
        }
        .item-box {
          display: flex;
          flex-wrap: wrap;
          margin-top: 20px;
          .box-1 {
            width: 48%;
            height: 440px;
            border: 1px solid #ddd;
            margin-bottom: 20px;
            margin-right: 20px;
            .box-tit {
              background-color: #f2f2f2;
              height: 30px;
              line-height: 30px;
              padding-left: 10px;
              padding-right: 10px;
            }
            h4 {
              margin: 20px 0;
              padding-left: 10px;
            }
            .div-flex {
              display: flex;
              flex-direction: row;
              justify-content: space-between;
            }
            .div-2 {
              width: 50%;
              height: 65px;
              float: left;
            }
            .div-1,
            .div-2 {
              padding: 0 10px;
              margin: 15px 0;
              .p-3 {
                font-size: 12px;
                color: #bbb;
                margin-bottom: 5px;
              }
              .p-tit {
                font-size: 12px;
                font-weight: bold;
                color: #444;
                margin-bottom: 15px;
              }
              .span-2 {
                font-size: 18px;
                // color: #444;
              }

              .div-3 {
                width: 50%;
                float: left;
              }
            }
            .border-right {
              border-right: 1px solid #ddd;
            }
            .div-4 {
              padding: 0 10px;
              p {
                margin: 10px 0;
                span {
                  color: #bbb;
                  span {
                    color: #000;
                  }
                }
              }
              .p-line {
                font-size: 12px;
                font-weight: bold;
                color: #444;
                margin-top: 10px;
              }
            }
          }
          .box-1:nth-of-type(odd){
             margin-right: 20px;
          }
        }
      }
    }
  }
}
</style>

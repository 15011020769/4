<template>
  <div class="image-details">
    <div class="details-title">
      <i class="el-icon-back" @click="back()"></i>
      <h2>{{datailsData.ImageId}}（{{datailsData.ImageName}}）</h2>
    </div>
    <div class="details-box">
      <div class="details-jx">
        <h3>镜像信息</h3>
        <div class="details-bd">
          <ul>
            <li>
              <span>名称</span>
              <span>{{datailsData.ImageName}}</span>
            </li>
            <li>
              <span>镜像ID</span>
              <span>{{datailsData.ImageId}}</span>
            </li>
            <li>
              <span>状态</span>
              <span>{{datailsData.ImageState|imageState}}</span>
            </li>
            <li>
              <span>镜像类型</span>
              <span>{{this.$route.query.ImageTypes|imageState}}</span>
            </li>
            <li>
              <span>操作系统</span>
              <span>{{datailsData.OsName}}</span>
            </li>
            <li v-if="this.$route.query.ImageTypes !== 'PUBLIC_IMAGE'">
              <span>创建者</span>
              <span>{{datailsData.ImageCreator}}</span>
            </li>
            <!-- <li v-if="this.$route.query.ImageTypes !== 'PUBLIC_IMAGE'">
              <span>镜像包含数据</span>
              <span></span>
            </li>-->
            <li v-if="this.$route.query.ImageTypes !== 'PUBLIC_IMAGE'">
              <span>镜像硬盘大小</span>
              <span>{{datailsData.ImageSize}}GB</span>
            </li>
            <li v-if="this.$route.query.ImageTypes !== 'PUBLIC_IMAGE'">
              <span>创建时间</span>
              <span>{{datailsData.CreatedTime?datailsData.CreatedTime:"-"|renderTime}}</span>
            </li>
            <li>
              <span>镜像描述</span>
              <span>{{datailsData.ImageDescription==""?"无":datailsData.ImageDescription}}</span>
            </li>
          </ul>
        </div>
      </div>
      <div
        class="details-gl"
        v-if="this.$route.query.ImageTypes !== 'PUBLIC_IMAGE'"
        v-show="relationData.length !== 0"
      >
        <h3>关联的快照</h3>
        <el-table :data="relationData" style="width: 100%" height="500px">
          <el-table-column label="ID">
            <template slot-scope="scope">
              <a href="javascript:;">{{scope.row.SnapshotId}}</a>
            </template>
          </el-table-column>
          <el-table-column prop="SnapshotName" label="名称"></el-table-column>
          <el-table-column label="属性">
            <template slot-scope="scope">
              <span>{{ scope.row.DiskUsage| Attributefilter()}}</span>
            </template>
          </el-table-column>
          <el-table-column label="大小">
            <template slot-scope="scope">
              <span>{{scope.row.DiskSize}}G</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="details-gx" v-if="this.$route.query.ImageTypes !== 'PUBLIC_IMAGE'">
        <h3>镜像共享</h3>
        <div class="btn">
          <el-button type="primary" size="mini" @click="shareBtn()">共享镜像</el-button>
          <div class="unsharing" @mouseenter="enter()" @mouseleave="leave()">
            <el-button size="mini" v-show="multipleSelection.length === 0">取消共享</el-button>
            <p v-if="Unsharing">请选择要取消共享的帐号</p>
          </div>
          <el-button
            size="mini"
            type="primary"
            v-show="multipleSelection.length !== 0"
            @click="unsharingBtn(multipleSelection)"
          >取消共享</el-button>
        </div>
        <div class="table">
          <el-table
            ref="multipleTable"
            :data="shareData"
            style="width: 100%"
            border
            height="350px"
            v-loading="loading"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="对端账号唯一ID" prop="AccountId"></el-table-column>
            <el-table-column prop="name" label="共享时间">
              <template
                slot-scope="scope"
              >{{ scope.row.CreatedTime?scope.row.CreatedTime:"-"|renderTime}}</template>
            </el-table-column>
            <el-table-column prop="address" label="操作">
              <template slot-scope="scope">
                <span class="un-btn" @click="unsharingBtn(scope.row)">取消共享</span>
              </template>
            </el-table-column>
          </el-table>
          <div class="row">
            <p>已选 {{multipleSelection.length}} 项，共 {{shareData.length}} 项</p>
          </div>
        </div>
      </div>
    </div>
    <share
      :shareShow="shareByVal"
      @MirrorSharing="MirrorSharing"
      v-if="shareByVal.shareState"
      v-on:close="shareClose()"
    ></share>
    <unsharing
      :unsharingVal="unsharingByVal"
      @MirrorSharing="MirrorSharing"
      v-if="unsharingByVal.unsharing"
      v-on:close="unsharingClose()"
    ></unsharing>
  </div>
</template>
<script>
import share from "./modal/share";
import unsharing from "./modal/unsharing";
export default {
  data() {
    return {
      datailsData: "",
      relationDataId: "",
      relationData: [], // 关联的快照
      Unsharing: false,
      shareData: [], // 共享镜像
      loading: true,
      multipleSelection: [],
      fullscreenLoading: false, // 页面加载动画
      shareByVal: {
        // 共享
        shareState: false,
        shareStateId: "",
        norm: ""
      },
      unsharingByVal: {
        unsharing: false, // 取消共享
        unsharingId: "", // 传id值
        selection: ""
      }
    };
  },
  components: {
    share,
    unsharing
  },
  created() {
    this.DetailsList();
    this.MirrorSharing();
  },
  methods: {
    // 返回
    back() {
      this.$router.push({
        path: "Image"
      });
    },
    // 镜像信息
    DetailsList() {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      let parms = {
        Version: "2017-03-12",
        Region: this.$cookie.get("regionv2"),
        "Filters.0.Name": "image-type",
        "Filters.0.Values.0": this.$route.query.ImageTypes,
        "Filters.0.Name": "image-id",
        "Filters.0.Values.0": this.$route.query.ImageId
      };
      this.axios
        .post("cvm2/DescribeImages", parms)
        .then(data => {
          this.datailsData = data.Response.ImageSet[0];
          this.relationDataId = this.datailsData.DiskSnapList[0].snapId;
          this.RelevantSnapshots();
          setTimeout(() => {
            loading.close();
          }, 1000);
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 关联的快照
    RelevantSnapshots() {
      let parms = {
        Version: "2017-03-12",
        Region: this.$cookie.get("regionv2"),
        "Filters.0.Name": "snapshot-id",
        "Filters.0.Values.0": this.relationDataId
      };
      this.axios
        .post("cbs2/DescribeSnapshots", parms)
        .then(data => {
          this.relationData = data.Response.SnapshotSet;
          this.loading = false;
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 镜像共享
    MirrorSharing() {
      let parms = {
        Version: "2017-03-12",
        Region: this.$cookie.get("regionv2"),
        ImageId: this.$route.query.ImageId
      };
      this.axios
        .post("cvm2/DescribeImageSharePermission", parms)
        .then(data => {
          this.shareData = data.Response.SharePermissionSet;
          this.loading = false;
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 共享按钮
    shareBtn() {
      this.shareByVal.shareState = true;
      this.shareByVal.shareStateId = this.$route.query.ImageId;
      let param = {
        Version: "2017-03-12",
        Region: this.$cookie.get("regionv2"),
        ImageId: this.$route.query.ImageId
      };
      this.axios
        .post("cvm2/DescribeImageSharePermission", param)
        .then(data => {
          this.shareByVal.norm = data.Response.SharePermissionSet;
        })
        .catch(error => {
          this.$message({
            message: "数据加载错误",
            type: "error"
          });
        });
    },
    shareClose() {
      this.shareByVal.shareState = false;
    },
    // 取消共享按钮
    unsharingBtn(id) {
      this.unsharingByVal.unsharing = true;
      this.unsharingByVal.unsharingId = this.$route.query.ImageId;
      this.unsharingByVal.selection = id;
    },
    unsharingClose() {
      this.unsharingByVal.unsharing = false;
    },
    enter() {
      this.Unsharing = true;
    },
    leave() {
      this.Unsharing = false;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
  }
};
</script>
<style lang="scss" scoped>
.image-details {
  .details-title {
    background: #fff;
    padding: 10px 20px;
    border-bottom: 1px solid #ccc;
    display: flex;
    & > i {
      font-size: 16px;
      font-weight: 900;
      height: 26px;
      line-height: 26px;
      width: 26px;
      box-sizing: border-box;
      display: inline-block;
      text-align: center;
      margin-left: -6px;
      margin-right: 24px;
      vertical-align: middle;
      overflow: hidden;
      color: #006eff;
      cursor: pointer;
    }
    & > h2 {
      font-size: 16px;
      font-weight: 700;
      color: #171d25;
      height: 30px;
      line-height: 30px;
    }
  }
  .details-box {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    .details-jx {
      padding: 20px;
      margin: 20px;
      width: 47%;
      background: #fff;
      border: 1px solid #ddd;
      & > h3 {
        color: #000;
        margin-bottom: 18px;
      }
      .details-bd {
        ul {
          li {
            margin-bottom: 16px;
            font-size: 12px;
            & > span {
              &:nth-of-type(1) {
                display: inline-block;
                color: #888;
                margin-right: 20px;
                min-width: 72px;
              }
              &:nth-of-type(2) {
                color: #444;
              }
            }
          }
        }
      }
    }
    .details-gl {
      padding: 20px;
      margin: 20px;
      margin-left: 0px;
      width: 47.78%;
      background: #fff;
      border: 1px solid #ddd;
      & > h3 {
        font-size: 16px;
        font-weight: 700;
        color: #000;
        margin-bottom: 18px;
      }
      ::v-deep .el-table th {
        padding: 0px;
        height: 40px;
      }
      ::v-deep .el-table th > .cell {
        color: #888;
        font-size: 12px;
        font-weight: bold;
      }
      ::v-deep .el-table .cell {
        color: #444;
        font-size: 12px;
      }
      a {
        color: #006eff;
        &:hover {
          text-decoration: underline;
        }
      }
    }
    .details-gx {
      padding: 20px;
      margin: 20px;
      margin-top: 0px;
      width: 100%;
      background: #fff;
      border: 1px solid #ddd;
      & > h3 {
        color: #000;
        font-size: 14px;
        font-weight: 700;
        margin-bottom: 18px;
      }
      .btn {
        display: flex;
        margin-bottom: 18px;
        .el-button--primary {
          background: #006eff;
        }
        .el-button {
          border-radius: 0px;
          border-radius: 0px;
          margin-right: 10px;
          width: 85px;
          height: 30px;
        }
        .unsharing {
          position: relative;
          ::v-deep .el-button {
            color: #ddd;
            cursor: not-allowed;
          }
          ::v-deep .el-button:focus,
          .el-button:hover {
            background: #fff;
          }
          & > p {
            position: absolute;
            top: 30px;
            left: 40px;
            background: #fff;
            padding: 5px 10px;
            border: 1px solid #ddd;
            color: #333;
            z-index: 1000;
            width: 178px;
          }
        }
      }
      .table {
        ::v-deep .el-table--border {
          border: 1px solid #ddd;
        }
        ::v-deep .el-table td {
          border-bottom: 1px solid #ddd;
        }
        ::v-deep .el-table th.is-leaf {
          border-bottom: 1px solid #ddd;
        }
        ::v-deep .el-table--border th {
          border-right: 0px;
        }
        ::v-deep .el-table--border td {
          border-right: 0px;
        }
        ::v-deep .el-table--border td:nth-of-type(1) {
          text-align: center;
        }
        ::v-deep .el-table th {
          padding: 0px;
          height: 40px;
        }
        ::v-deep .el-table--border th:first-child .cell:nth-child(1) {
          text-align: center;
        }
        ::v-deep .el-table th > .cell {
          color: #888;
          font-size: 12px;
          font-weight: 700;
        }
        ::v-deep .el-table .cell {
          color: #444;
          font-size: 12px;
        }
        .row {
          border: 1px solid #ddd;
          border-top: 0px;
          height: 58.5px;
          line-height: 58.5px;
          & > p {
            padding-left: 10px;
            color: #888;
            font-size: 12px;
          }
        }
        .un-btn {
          cursor: pointer;
          color: #006eff;
          font-size: 12px;
          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }
}
</style>


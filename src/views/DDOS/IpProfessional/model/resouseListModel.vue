<template>
  <div id="IPprofessionalDetail">
    <div>
      <!-- 资源详情模态框 -->
      <el-dialog
        class="modelDetail"
        :title="resName"
        :visible.sync="resouseListShow"
        width="40%"
        :before-close="handleClose"
      >
        <div class="contentDetail">
          <div class="contentDetailTop">
            <h2>
              {{$t('DDOS.protectCon.BasicText')}}
              <a href="#" @click="editBtn">{{$t('DDOS.AccesstoCon.AccUpdate')}}</a>
            </h2>
            <div class="basicInfo newClear">
              <div class="newClear" v-for="(item) in resObj.Record" :key="item.key">
                <span class="basicLabel" v-if="item.Key=='Id'">{{$t('DDOS.protectCon.ResourceId')}}</span>
                <span class="basicIpt" v-if="item.Key=='Id'">{{item.Value}}</span>
              </div>
              <div class="newClear" v-for="(item) in resObj.Record" :key="item.key">
                <span
                  class="basicLabel"
                  v-if="item.Key=='Name'"
                >{{$t('DDOS.protectCon.ResourceName')}}</span>
                <span class="basicIpt" v-if="item.Key=='Name'">{{item.Value==""?'未命名':item.Value}}</span>
                <el-input
                  class="resouseName"
                  v-model="editName"
                  v-if="thisEditShow && item.Key=='Name'"
                ></el-input>
              </div>
              <div class="newClear" v-for="(item) in resObj.Record" :key="item.key">
                <span class="basicLabel" v-if="item.Key=='CName'">CNAME</span>
                <span class="basicIpt" v-if="item.Key=='CName'">{{item.Value}}</span>
              </div>
              <div class="newClear" v-for="(item) in resObj.Record" :key="item.key">
                <span
                  class="basicLabel"
                  v-if="item.Key=='OriginRegion'"
                >{{$t('DDOS.protectCon.initialREgion')}}</span>
                <span class="basicIpt" v-if="item.Key=='OriginRegion'">{{item.Value=='tpe'?$t('DDOS.total.address'):item.Value}}</span>
              </div>
              <div class="newClear" v-for="(item) in resObj.Record" :key="item.key">
                <span
                  class="basicLabel"
                  v-if="item.Key=='CurrentRegion'"
                >{{$t('DDOS.protectCon.currentRegion')}}</span>
                <span class="basicIpt" v-if="item.Key=='CurrentRegion'">{{item.Value=='tpe'?$t('DDOS.total.address'):item.Value}}</span>
              </div>
              <div class="newClear" v-for="(item) in resObj.Record" :key="item.key">
                <span
                  class="basicLabel"
                  v-if="item.Key=='Status'"
                >{{$t('DDOS.protectCon.currentstates')}}</span>
                <span class="basicIpt" v-if="item.Key=='Status'&&item.Value=='idle'">{{$t('DDOS.AssetList.Running')}}</span>
                <span class="basicIpt" v-else-if="item.Key=='Status'&&item.Value=='attacking'" style="color: red;">{{$t('DDOS.AssetList.Attacking')}}</span>
                <span class="basicIpt" v-else-if="item.Key=='Status'&&item.Value=='blocking'">{{$t('DDOS.AssetList.Blocking')}}</span>
                <span class="basicIpt" v-else-if="item.Key=='Status'&&item.Value=='isolate'">{{$t('DDOS.AssetList.Isolate')}}</span>
              </div>
            </div>
            <div class="editBtn" v-if="thisEditShow">
              <el-button class="editSure" @click="editSure">{{$t('DDOS.AccesstoCon.ImSure')}}</el-button>
              <el-button @click="thisEditShow=false">取消</el-button>
            </div>
          </div>
          <div class="contentDetailBot contentDetailTop">
            <h2>{{$t('DDOS.protectCon.ProtectionCon')}}</h2>
            <div class="basicInfo newClear">
              <div class="newClear" v-for="(item) in resObj.Record" :key="item.key">
                <span
                  class="basicLabel"
                  v-if="item.Key=='DdosMax'"
                >{{$t('DDOS.choose.MinimumProtection')}}</span>
                <span class="basicIpt" v-if="item.Key=='DdosMax'">{{item.Value/1000}}Gbps</span>
              </div>
              <div class="newClear" v-for="(item) in resObj.Record" :key="item.key">
                <span
                  class="basicLabel"
                  v-if="item.Key=='ElasticLimit'"
                >{{$t('DDOS.choose.ElasticProtection')}}</span>
                <span class="basicIpt" v-if="item.Key=='ElasticLimit'">{{item.Value=='0'?$t('DDOS.choose.doNotOpen'):(item.Value/1000+'G')}}</span>
              </div>
              <div class="newClear" v-for="(item) in resObj.Record" :key="item.key">
                <span class="basicLabel" v-if="item.Key=='CCMax'">{{$t('DDOS.choose.CCMinimum')}}</span>
                <span class="basicIpt" v-if="item.Key=='CCMax'">{{item.Value}}QPS</span>
              </div>
              <div class="newClear" v-for="(item) in resObj.Record" :key="item.key">
                <span
                  class="basicLabel"
                  v-if="item.Key=='IPText'"
                >{{$t('DDOS.protectCon.IpResour')}}</span>
                <span class="basicIpt" v-if="item.Key=='IPText'">{{item.Value.join(';')}}</span>
              </div>
              <div class="newClear" v-for="(item) in resObj.Record" :key="item.key">
                <span class="basicLabel" v-if="item.Key=='Expire'">{{$t('DDOS.AssetList.DueTime')}}</span>
                <span class="basicIpt" v-if="item.Key=='Expire'">{{item.Value}}</span>
              </div>
              <div class="newClear">
                <span class="basicLabel">回源IP段</span>
                <span class="basicIpt">{{this.ipSegment}}</span>
              </div>
            </div>
          </div>
        </div>
      </el-dialog>
      <!-- 添加标签模态框 -->
      <el-dialog
        class="modelDetail"
        title="net-0000006y"
        :visible.sync="addTagsModel"
        width="40%"
        :before-close="handleCloseTags"
      >
        <div class="tableContent">
          <table class="table-div1">
            <tr class="t-head1">
              <td>{{$t('DDOS.protectCon.labelKey')}}</td>
              <td>{{$t('DDOS.protectCon.labelValue')}}</td>
              <td>操作</td>
            </tr>
            <tr class="t-body1" v-for="(item, index) in tags" :key="index">
              <td>
                <!-- <input type="text" /> -->
                <el-input class="inputChange" v-model="item.beginPort" autocomplete="off"></el-input>
              </td>
              <td>
                <el-input class="inputChange" v-model="item.endPort" autocomplete="off"></el-input>
              </td>
              <td>
                <a
                  v-on:click="removeRow(index,1)"
                  v-show="index >= 0"
                >{{$t('DDOS.AccesstoCon.AccDel')}}</a>
              </td>
            </tr>
          </table>
        </div>
        <a v-on:click="addRow(1)" class>添加</a>
        <span class="footerBtn">
          <el-button @click="addTagsSureResouse">{{$t('DDOS.AccesstoCon.ImSure')}}</el-button>
          <el-button @click="handleCloseTags">取消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import {
  RULESETS_CONT,
  INSTANCENAME_CONT
} from "@/constants";
export default {
  props: {
    isShow: Boolean,
    ipSegment: String,//回源IP段
  },
  computed: {
    resouseListShow() {
      this.dialogModel = this.isShow;
      return this.isShow;
    }
  },
  data() {
    return {
      resName: "", //资源名称
      resObj: {}, //资源对象
      editName: '', //编辑名称

      dialogModel: "", //模态框
      thisEditShow: false, //点击编辑时展示的东西
      addTagsModel: false, //添加标签弹框
      tags: [{}]
    };
  },
  created() {},
  methods: {
    init(scopeRow) {
      this.resObj = JSON.parse(JSON.stringify(scopeRow));
      //循环获取name
      // console.log(this.resObj)
      this.resObj.Record.forEach(item => {
        if (item.Key == "Id") {
          this.resName = item.Value;
        }
      });
      this.editName = '';
      this.thisEditShow = false;
    },

    //关闭按钮
    handleClose() {
      this.dialogModel = false;
      this.$emit("closeListDetail", [this.dialogModel,this.resName,'']);
    },
    //点击编辑按钮
    editBtn() {
      this.thisEditShow = true;
    },
    //编辑确定按钮
    editSure() {
      this.dialogModel = false;
      this.$emit("closeListDetail", [this.dialogModel,this.resName,this.editName]);
    },
    //标签编辑按钮
    addTags() {
      this.addTagsModel = true;
      this.dialogModel = false;
      this.$emit("closeListDetail", [this.dialogModel,this.resName,'']);
    },
    //编辑标签确定按钮
    addTagsSureResouse() {
      this.addTagsModel = false;
    },
    //编辑标签取消关闭按钮
    handleCloseTags() {
      this.addTagsModel = false;
    },
    copyObj: function() {
      var des = {
        tagsKey: "",
        tagsValue: ""
      };
      return des;
    },
    //新增一行
    addRow: function(type) {
      var des = this.copyObj();
      this.tags.push(des);
    },
    // 删除一行
    removeRow: function(idx, typeNode) {
      this.tags.splice(idx, 1);
    }
  }
};
</script>
<style lang="scss">
#IPprofessionalDetail {
  .newClear:after {
    display: block;
    content: "";
    clear: both;
  }
  .contentDetailTop {
    h2 {
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 14px;
    }
    .basicInfo {
      div {
        margin-bottom: 14px;
        font-size: 12px;
        span:nth-child(1).basicLabel {
          float: left;
          width: 70px;
          color: #999;
        }
        span:nth-child(2).basicIpt {
          float: left;
          width: calc(100% - 70px);
          color: #444;
        }
        .resouseName {
          width: 180px;
          height: 30px;
          input {
            width: 180px;
            height: 30px;
            border-radius: 0;
          }
        }
      }
    }
    .editBtn {
      text-align: center;
      button {
        height: 30px;
        border-radius: 0;
        padding: 0 20px;
        line-height: 30px;
      }
      button.editSure {
        color: #fff;
        background-color: #006eff;
      }
    }
  }
  .contentDetailBot {
    h2 {
      font-size: 14px;
      font-weight: 600;
    }
    span:nth-child(1).basicLabel {
      width: 90px !important;
    }
    span:nth-child(2).basicIpt {
      width: calc(100% - 90px) !important;
    }
  }
  .modelDetail {
    .el-dialog__header {
      font-size: 14px;
      font-weight: 600;
      .el-dialog__title {
        font-size: 14px;
        font-weight: 600;
      }
    }
  }
}
.tableContent {
  border: 1px solid #ddd;
  margin-bottom: 10px;
  min-height: 450px;
  max-height: 450px;
  overflow: auto;
  .table-div1 {
    width: 100%;
    tr {
      width: 30%;
    }
    .t-head1 {
      height: 45px;
      padding: 0 5px;
      td {
        border-bottom: 1px solid #eaeaea;
        padding-left: 10px;
      }
    }
    .t-body1 {
      height: 45px;
      min-height: 200px;
      td {
        // border-bottom:1px solid #eaeaea;
        padding-left: 10px;
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
          margin-left: 0;
          input {
            height: 30px;
            width: 70px;
            border-radius: 0;
          }
        }
      }
    }
  }
}
.footerBtn {
  display: block;
  margin-top: 20px;
  text-align: center;
  button {
    width: 64px;
    height: 30px;
    border-radius: 0;
    padding: 0;
    line-height: 30px;
    text-align: center;
  }
  button:nth-child(1) {
    background-color: #006eff;
    color: #fff;
  }
}
</style>
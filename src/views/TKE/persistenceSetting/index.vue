<template>
  <div class="persistenceSetting">
    <div class="back-hd flex">
      <router-link :to="'/persistence'">
        <i class="el-icon-back hd-icon-back"></i>
      </router-link>
      <h3>{{$t('TKE.overview.szcjh')}}</h3>
    </div>
    <div class="tf-g app-tke-fe-content__inner">
      <div class="event-persistence font">
        <!-- 内容标题 -->
        <div class="flex padding">
          <div class="data-card-hd">集群</div>
          <div>{{this.$route.query.ClusterName}}({{this.$route.query.ClusterId}})</div>
        </div>
        <div class="flex padding">
          <div class="data-card-hd">{{$t('TKE.overview.cjhcc')}}</div>
          <div>
            <el-switch
              v-model="value"
              @change="okChange"
              active-color="#006EFF"
              inactive-color="#cccccc"
            ></el-switch>
            <div style="padding-top:8px;">
              {{$t('TKE.overview.kqcjh')}}
              <span class="font-orange">&nbsp;CPU&nbsp;（0.2核）{{$t('TKE.overview.nc')}}（100MB）</span>
              {{$t('TKE.overview.gbsfzy')}}
            </div>
            <!-- <div v-if="deteleFlag" style="color:#e54545;padding-top:12px;">{{$t('TKE.overview.wfkqcjh')}}</div> -->
          </div>
        </div>
        <div v-show="value">
          <div class="flex padding" style="padding-bottom:0px;">
            <div class="data-card-hd" style="line-height:28px;">{{$t('TKE.overview.ccdxz')}}</div>
            <div class="flex">
              <el-radio-group
                v-model="tabPosition"
                class="font"
                style="margin-bottom: 30px;"
                size="mini"
              >
                <el-radio-button class="tabs-size" style="font-size:12px;" label="Els">Elasticsearch</el-radio-button>
                <!-- <el-tooltip class="item" effect="light" content="该地区不支持日志服务CLS" placement="right">
                  <el-radio-button class="tabs-size" label="log" disabled>日志服务CLS</el-radio-button>
                </el-tooltip> -->
              </el-radio-group>
            </div>
          </div>
          <!-- Els -->

          <div class="flex padding" v-if="tabPosition=='Els'">
            <div class="data-card-hd" style="line-height:28px;">Elasticsearch</div>
            <div>
              <el-tooltip
                content="Bottom center"
                :placement="$t('TKE.overview.qsrzqgs2')"
                effect="light"
              >
                <input
                  style="color:#000;"
                  type="text"
                  v-model="elasticVal"
                  placeholder="eg: http://190.0.0.1:9200"
                  @change="elastic"
                />
              </el-tooltip>
            </div>
          </div>
          <div class="flex padding" style="padding-bottom:0px;" v-if="tabPosition=='Els'">
            <div class="data-card-hd" style="line-height:28px;">索引</div>
            <div>
              <input
                style="color:#000;"
                type="text"
                v-model="indexesVal"
                placeholder="eg: fluentd"
                @change="indexes"
              />
              <div style="padding-top:10px;">{{$t('TKE.overview.zc60zf')}}</div>
            </div>
          </div>
        </div>

        <!-- blog -->
        <div class="flex padding" style="padding-bottom:0px;" v-if="tabPosition=='log'">
          <div class="data-card-hd" style="line-height:28px;">{{$t('TKE.overview.rzfwsl')}}</div>
          <div>
            <div class="log-div" style="margin-right:20px;">
              <input class="log-input log-input-red" type="text" :placeholder="$t('TKE.overview.wu')" />
              <i class="el-icon-caret-bottom log-icon"></i>
            </div>
            <div class="log-div">
              <input class="log-input log-input-red" type="text" :placeholder="$t('TKE.overview.wu')" />
              <i class="el-icon-caret-bottom log-icon"></i>
            </div>
            <div style="padding-top:20px">
              {{$t('TKE.overview.rzfwbhs')}}
              <a href>{{$t('TKE.overview.xjrzj')}}</a>
              <i class="el-icon-edit-outline"></i>
            </div>
          </div>
        </div>
        <el-form>
          <el-form-item style="margin-top:40px;margin-left:30px;">
            <el-button type="primary" @click="onSubmit" size="mini" :disabled="okFlag">{{ok}}</el-button>
            <el-button size="mini" @click="onCancel">取消</el-button>
          </el-form-item>
        </el-form>

        <el-dialog :title="$t('TKE.overview.sczy')" :visible.sync="showNameSpaceModal" width="35%">
          <p
            style="color:#444;font-weight:bolder;"
          >{{$t('TKE.overview.qdscjq')}} {{this.$route.query.ClusterId}} 的 PersistentEvent {{$t('TKE.overview.zym')}}</p>
          <p style="color:red;margin-top:5px;">{{$t('TKE.overview.qbfsj')}}</p>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitDelete">{{$t('TKE.overview.qd')}}</el-button>
            <el-button @click="showNameSpaceModal = false">取 消</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script>
import HeadCom from "@/components/public/Head";
import { TKE_COLONY_LIST, TKE_COLONY_QUERY } from "@/constants/TKE-jz";
import { ErrorTips } from "@/components/ErrorTips.js"; //公共错误码
export default {
  data() {
    return {
      value: true, //事件持久化存储开关
      tabPosition: "Els",
      loadShow: true, // 加载是否显示
      dataList: {},
      elasticVal: "",
      indexesVal: "",
      ok: "保存",
      okFlag: false,
      deteleFlag: false,
      showNameSpaceModal: false,
      placement: "格式為eg: http://190.0.0.1:9200"
    };
  },
  methods: {
    //删除
    submitDelete() {
      this.elasticVal = "";
      this.indexesVal = "";
      this.loadShow = true;
      console.log(this.dataList);
      const params1 = {
        Method: "DELETE",
        Path:
          "/apis/platform.tke/v1/persistentevents/" +
          this.dataList.metadata.name,
        Version: "2018-05-25",
        RequestBody: { propagationPolicy: "Background", gracePeriodSeconds: 0 },
        ClusterName: this.$route.query.ClusterId
      };
      this.axios.post(TKE_COLONY_QUERY, params1).then(res => {
        this.$router.push({
          path: "/persistence"
        });
        if (res.Response.Error === undefined) {
          this.loadShow = false;
          this.showNameSpaceModal = false;
        } else {
          this.loadShow = false;
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
    //存储
    elastic() {
      var reg = "http://[1-9]{1}.[1-9]{1}.[1-9]{1}.[1-9]{1}";
      if (this.elasticVal.match(reg)) {
        this.placement="輸入正確"
      }else{
        this.placement="輸入正確"
      }
      // console.log(this.elasticVal);
    },
    //索引
    indexes() {
      // console.log(this.indexesVal);
    },
    status() {
      if (this.value == false) {
        this.ok = "刪除";
        this.deteleFlag = true;
        // this.okFlag = true;
        // this.elasticVal = "";
        // this.indexesVal = "";
      } else {
        this.deteleFlag = false;
        // this.okFlag = false;
        this.ok = "保存";
      }
    },
    okChange() {
      this.status();
    },
    onSubmit() {
      // 保存数据持久化集群
      this.status();
      if (this.ok == "刪除") {
        this.showNameSpaceModal = true;
        return;
      } else {
        if (this.elasticVal == "" || this.indexesVal == "") {
          this.$message({
            message: "請填寫Elasticsearch和索引",
            type: "error",
            showClose: true,
            duration: 2000
          });
          return;
        }

        let params = {
          Method: "POST",
          Path: "/apis/platform.tke/v1/persistentevents",
          Version: "2018-05-25",
          RequestBody:
            '{"kind":"PersistentEvent","apiVersion":"platform.tke/v1","metadata":{"generateName":"pe"},"spec":{"clusterName":"' +
            this.$route.query.ClusterId +
            '","persistentBackEnd":{"es":{"ip":"' +
            this.elasticVal.substring(7, this.elasticVal.length - 5) +
            '","port":' +
            this.elasticVal.substring(
              this.elasticVal.length - 4,
              this.elasticVal.length
            ) +
            ',"scheme":"' +
            this.elasticVal.substring(0, 4) +
            '","indexName":"' +
            this.indexesVal +
            '"}}}}',
          ClusterName: this.$route.query.ClusterId
        };
        console.log(params);
        this.axios.post(TKE_COLONY_QUERY, params).then(res => {
          if (res.Response.Error === undefined) {
            console.log(res);
            this.loadShow = false;
          } else {
            let ErrTips = {};
            let ErrOr = Object.assign(ErrorTips, ErrTips);
            this.$message({
              message: ErrOr[res.Response.Error.Code],
              type: "error",
              showClose: true,
              duration: 2000
            });
          }
        });
        this.$router.push({
          path: "/persistence",
          query: {
            elasticVal: this.elasticVal,
            indexesVal: this.indexesVal,
            targetId: this.$route.query.ClusterId
          }
        });
      }
    },
    onCancel() {
      //取消
      this.$router.push({
        path: "/persistence"
      });
    },
    getColonyList() {
      //数据持久化集群列表
      console.log(this.$route.name); //persistence
      let params = {
        Method: "GET",
        Path: "/apis/platform.tke/v1/persistentevents/",
        Version: "2018-05-25"
      };
      this.axios.post(TKE_COLONY_QUERY, params).then(res => {
        if (res.Response.Error === undefined) {
          var data = JSON.parse(res.Response.ResponseBody).items;
          var name = this.$route.params.uid;
          data.forEach(item => {
            if (item.spec.clusterName == name) {
              this.dataList = item;
            }
          });
          console.log(this.dataList);
          this.loadShow = false;
        } else {
          let ErrTips = {};
          let ErrOr = Object.assign(ErrorTips, ErrTips);
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 2000
          });
        }
      });
    }
  },
  created() {
    this.getColonyList();
    if (this.$route.query.storageObject && this.$route.query.indexName) {
      this.okFlag = false;
      this.elasticVal = this.$route.query.storageObject.substring(
        6,
        this.$route.query.storageObject.length - 1
      );
      this.indexesVal = this.$route.query.indexName.substring(
        3,
        this.$route.query.indexName.length - 1
      );
    } else {
      // this.value = false;
      // this.okFlag = true;
      this.status();
    }
  },
  props: ["uid"],
  components: {
    HeadCom
  }
};
</script>
<style lang="scss" scoped>
.back-hd {
  width: 100%;
  height: 51px;
  background: white;
  padding: 15px;
  border-bottom: 1px solid #cccccc;
  font-size: 16px;
}
.hd-icon-back {
  font-weight: 900;
  font-size: 20px;
  color: #006eff;
  padding-right: 10px;
}
.log-div {
  display: inline-block;
  position: relative;
}
.log-input-red {
  border: 1px solid red;
  color: red;
}
.log-icon {
  position: absolute;
  top: 8px;
  right: 4px;
}
.log-input {
  width: 150px;
}
input {
  width: 200px;
  height: 28px;
  padding: 5px 10px;
  color: #eeeeee;
}
.tabs-size {
  width: 114px;
  height: 28px;
  font-size: 12px;
}
.active {
  width: 114px;
  height: 30px;
  border: 1px solid #006eff;
  margin: auto;
  line-height: 30px;
}
.padding {
  padding: 5px 0 20px 0;
}
.font-orange {
  color: #ff9d00;
}
.data-card-hd {
  width: 100px;
  height: 28px;
}
.flex {
  display: flex;
}
.font {
  font-size: 12px;
  color: #888888;
}
.app-tke-fe-content__inner {
  padding-top: 20px;
  max-width: 1360px;
  margin: 0 auto;
  padding: 20px;
}
.tf-g {
  font-size: 0;
  margin-bottom: 50px;
  // background: pink;
}
.event-persistence {
  padding: 20px;
  background: white;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}
</style>

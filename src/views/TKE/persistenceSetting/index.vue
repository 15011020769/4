<template>
  <div class="persistenceSetting">
    <div class="back-hd flex">
      <router-link :to="'/persistence'">
        <i class="el-icon-back hd-icon-back"></i>
      </router-link>
      <h3>设置事件持久化</h3>
    </div>
    <div class="tf-g app-tke-fe-content__inner">
      <div class="event-persistence font">
        <!-- 内容标题 -->
        <div class="flex padding">
          <div class="data-card-hd">集群</div>
          <div>sssssssss({{}})</div>
        </div>
        <div class="flex padding">
          <div class="data-card-hd">事件持久化存储</div>
          <div>
            <el-switch v-model="value" active-color="#006EFF" inactive-color="#cccccc" ></el-switch>
            <div style="padding-top:8px;">
              开启事件持久化存储功能会额外占用您集群资源
              <span class="font-orange">&nbsp;CPU&nbsp;（0.2核）内存（100MB）</span>
              。关闭本功能会释放占用的资源
            </div>
          </div>
        </div>
        <div class="flex padding" style="padding-bottom:0px;">
          <div class="data-card-hd" style="line-height:28px;">存储端选择</div>
          <div class="flex">
            <el-radio-group
              v-model="tabPosition"
              class="font"
              style="margin-bottom: 30px;"
              size="mini"
            >
              <el-radio-button class="tabs-size" style="font-size:12px;" label="Els">Elasticsearch</el-radio-button>
              <el-radio-button class="tabs-size" label="log">日志服务CLS</el-radio-button>
            </el-radio-group>
          </div>
        </div>
        <!-- Els -->
        <div class="flex padding" v-if="tabPosition=='Els'">
          <div class="data-card-hd" style="line-height:28px;">Elasticsearch</div>
          <div>
            <input type="text" placeholder="eg: http://190.0.0.1:9200" />
          </div>
        </div>
        <div class="flex padding" style="padding-bottom:0px;" v-if="tabPosition=='Els'">
          <div class="data-card-hd" style="line-height:28px;">索引</div>
          <div>
            <input type="text" placeholder="eg: fluentd" />
            <div style="padding-top:10px;">最长60个字符，只能包含小写字母，数字及分隔符("-","_","+"),且必须以小写字母开头</div>
          </div>
        </div>
        <!-- blog -->
        <div class="flex padding" style="padding-bottom:0px;" v-if="tabPosition=='log'">
          <div class="data-card-hd" style="line-height:28px;">日志服务实例</div>
          <div>
            <div class="log-div" style="margin-right:20px;">
              <input class="log-input log-input-red" type="text" placeholder="无" />
              <i class="el-icon-caret-bottom log-icon"></i>
            </div>
            <div class="log-div">
              <input class="log-input log-input-red" type="text" placeholder="无" />
              <i class="el-icon-caret-bottom log-icon"></i>
            </div>
            <div style="padding-top:20px">
              若现有的日志服务CLS不合适，您可以去控制台
              <a href>新建日志集</a>
              <i class="el-icon-edit-outline"></i>
            </div>
          </div>
        </div>
        <el-form>
          <el-form-item style="margin-top:40px;margin-left:30px;">
            <el-button type="primary" @click="onSubmit" size="mini">立即创建</el-button>
            <el-button size="mini">取消</el-button>
          </el-form-item>
        </el-form>
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
      value: true,//事件持久化存储开关
      tabPosition: "Els",
      loadShow: true, // 加载是否显示
      dataList:{}
    };
  },
  methods:{
    onSubmit(){
      this.$router.push({
        path:"/persistence"
      })
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
          // console.log(JSON.parse(res.Response.ResponseBody).items);
          var data=JSON.parse(res.Response.ResponseBody).items;
          var name=this.$route.params.uid;
          data.forEach((item) => {
            if(item.spec.clusterName==name){
              // console.log(item)
              this.dataList = item;
            }
          });
          console.log(this.dataList)
          this.loadShow = false;
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
  },
  created(){
    this.getColonyList();
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
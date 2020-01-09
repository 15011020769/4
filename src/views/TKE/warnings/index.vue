<template>
  <div class="warnings-wrap">
    <!-- 头部 -->
    <div class="back-hd flex">
      <h2>警告设置</h2>
      <div style="width:20px"></div>
      <div style="padding-top:3px;">地域</div> 
      &nbsp;<el-button  type="primary" class="init hd-button">中国台北</el-button>
      <div style="width:20px"></div>
      <div style="padding-top:3px;">集群</div> 
      &nbsp;
      <el-select size="mini" v-model="value" placeholder="请选择" @change="GetCOLONY_name()">
        <el-option
          v-for="item in options"
          :key="item.value"
          :value="item.value">
        </el-option>
      </el-select>
    </div>
    <div class="app-tke-fe-content__inner">
      <!-- 搜索框与新建，删除 -->
      <div class="flex">
        <div class="font" style="flex:1;padding-top:20px;">
          <router-link :to="'/warningCreate'">
            <button class="data-card-hd">新建</button>
          </router-link>
          <button class="data-card-hd data-card-hd-del" style="margin-left:8px;">删除</button>
        </div>
        <div style="position: relative;">
          <input type="search" placeholder="请输入集群名称" class="search">
          <button class="el-icon-search ip-btn"></button>
        </div>
      </div>
      <!-- 内容 -->
      <div class="event-persistence">
        <div class="ep-data-card-main" style="padding:5px 0 10px 0;">
          <el-row>
            <el-col :span="5"><div class="font"><input type="checkbox" class="app-tke-fe-checkbox"> 告警策略名称</div></el-col>
            <el-col :span="4"><div class="font">策略类型</div></el-col>
            <el-col :span="5"><div class="font">触发条件</div></el-col>
            <el-col :span="5"><div class="font">警告渠道</div></el-col>
            <el-col :span="5"><div class="font">操作</div></el-col>
          </el-row>
        </div>
        <!-- 数据绑定 -->
        <div ref="dataHide" class="ep-data-card-main font" style="text-align:center;">
          您选择的集群的告警设置列表为空，您可以
          <a href="">新建告警设置</a>，或切换到其他集群
        </div>
        <div ref="dataShow" class="ep-data-card-main" style="padding-top:20px;display:none">
          <el-row>
            <el-col :span="5"><div class="font pt12">
                <input type="checkbox" class="app-tke-fe-checkbox"><a href="javascript:;">aaaaaaa</a>
              </div></el-col>
            <el-col :span="4"><div class="font pt12">集群</div></el-col>
            <el-col :span="5"><div class="font">
                <div>CPU利用率>90%,持续5分钟告警</div>
                <div>内存利用率>90%,持续5分钟告警</div>
                <div>CPU分配率>90%,持续5分钟告警</div>
              </div></el-col>
            <el-col :span="5"><div class="font pt6">
                <div>接收组:1个</div>
                <div>渠道:短信 邮箱</div>
              </div></el-col>
            <el-col :span="5"><div class="font pt12">
              <router-link :to="''">
                <span>删除</span>
              </router-link>
              <div style="width:10px;display:inline-block"></div>
               <router-link :to="''">
                <span>复制</span>
              </router-link>
              </div></el-col>
          </el-row>
        </div>
        <div class="font flex">
          <div style="flex:1;padding-top:17px;">共&nbsp;{{length}}&nbsp;项</div>
          <div class="block" style="padding-top:5px;">
            <el-pagination
              :page-sizes="[10, 20, 30, 40, 50]"
              :page-size="20"
              layout="sizes, prev, pager, next"
              :total="100">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  CreateListGroups,
  WARNING_GetCOLONY,
  WARNING_GetUSER
} from "@/constants";
export default {
  name:'warnings',
  data() {
    return {
      length: '0',
      pageSize: 20,
      pageIndex: 0,
      options: [],
      value: '',
      tableData: [{
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }
      ],
      multipleSelection: [],
      funllscreenLoading:false
    }
  },
  watch:{
    value(val) {
      let params = {
        ClusterInstanceId: (val.split('('))[0],
        Limit: this.pageSize,
        Offset: this.pageIndex,
        Version: "2018-05-25"
      }
      console.log((val.split('('))[0])
      const res = this.axios.post(CreateListGroups,params).then(res=>{
        // console.log(res)
        if(res.Response.AlarmPolicySet.length>0){
          this.$refs.dataHide.style.display = 'none'
          this.$refs.dataShow.style.display = 'block'
          let resData= res.Response.AlarmPolicySet
          this.length = resData.length;
          console.log(resData)
          for (let i = 0; i < resData.length; i++) {
            let getData = {
              AlarmPolicyName:'',AlarmPolicyType:''
            };
            getData.name = resData.AlarmPolicySettings
          }
        }else{
          this.$refs.dateHide.style.display = 'block'
          this.$refs.dateShow.style.display = 'none'
          console.log('数据请求出错')
        }
      });
    }
  },
  created() {
    // 获取集群列表
    this.getWarningList();
    // 数据加载遮罩层
    this.openFullScreen1();
    // 获取集群列表详情
    // this.getWarningListItem();
  },
  methods:{
    openFullScreen1() {
        this.fullscreenLoading = true;
        setTimeout(() => {
          this.fullscreenLoading = false;
        }, 2000);
      },
    // 获取集群列表
    async getWarningList() {
      let params = {
          Limit: this.pageSize,
          Offset: this.pageIndex,
          Version: "2018-05-25"
        }
      // console.log(params)
      const res = await this.axios.post(WARNING_GetUSER, params);
      if(res.Error){
        console.log(res)
      }else{
        // console.log(res)
        if(res.Response.Clusters.length>0){
          let ids=[];
          res.Response.Clusters = res.Response.Clusters.map(item => {
              ids.push(item.ClusterId+'('+item.ClusterName+')');
              return item;
          })
          // 放到页面上
          for (let i = 0; i < ids.length; i++) {
            let option = {}
            option.value = ids[i]
            this.options.push(option)
            this.value = this.options[0].value
          }
          // console.log(this.options)
        }
      }
    },
    // 获取集群列表详情
    async getWarningListItem() {
      let params = {
          // ClusterInstanceId: this.options
          Limit: this.pageSize,
          Offset: this.pageIndex,
          Version: "2018-05-25"
        }
      console.log(params)
      const res = await this.axios.post(WARNING_GetUSER, params);
      if(res.Error){
        console.log(res)
      }else{
        if(res.Response.Clusters.length>0){
          let ids=[];
          res.Response.Clusters = res.Response.Clusters.map(item => {
              ids.push(item.ClusterId+'('+item.ClusterName+')');
              return item;
          })
          // 放到页面上
          for (let i = 0; i < ids.length; i++) {
            const element = ids[i];
            this.options[i].value = i
            this.options[i].label = ids[i]
          }
        }
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.pt20 {
  padding-top: 20px;
}
.pt12 {
  padding-top: 12px;
}
.pt6 {
  padding-top: 6px;
}
.app-tke-fe-checkbox {
  width: 16px;
  height: 16px;
  cursor: pointer;
  vertical-align: middle;
  outline: none;
  -webkit-appearance: none;
  border: 1px solid #bbb;
  background-color: #fff;
  margin:0 10px 0 10px;
}
.ep-data-card-main {
  padding: 20px 0 20px 0;
  border-bottom: 1px solid #cccccc;
}
.data-card-hd {
  height: 30px;
  min-width: 24px;
  padding: 0 20px;
  background-color: #006eff;
  color: #fff;
  border: 1px solid #006eff;
  line-height: 30px;
  text-align: center;
  display: inline-block;
  cursor: pointer;
  outline: 0 none;
  box-sizing: border-box;
  text-decoration: none;
  font-size: 12px;
  vertical-align: middle;
  white-space: nowrap;
}
.data-card-hd-del {
  border-color: #ddd;
  background-color: #fff;
  color: #bbb;
  cursor: not-allowed;
}
.init {
  padding: 0;
  margin: 0;
}
.hd-button {
  width: 80px;
  height: 22px;
}
.back-hd {
  width: 100%;
  height: 51px;
  background: white;
  padding:15px;
  border-bottom: 1px solid #cccccc;
  font-size: 12px;
}
.flex {
  display: flex;
}
.event-persistence {
  padding: 20px 20px 10px 20px;
  background: white;
  box-shadow: 0 1px 3px 0 rgba(0,0,0,.1);
}
.app-tke-fe-content__inner {
  max-width: 1360px;
  margin:0 auto;
  font-size: 0;
  margin-bottom: 50px;
}
.search {
  width: 200px;
  height: 30px;
  margin: 20px 0 10px 0;
  font-size: 12px;
  padding-left: 5px;
  border: 1px solid #cccccc;
}
.ip-btn {
  font-size: 12px;
  width: 30px;
  height: 30px;
  background: none;
  border:none;
  position: absolute;
  z-index: 1;
  top: 20px;
  right: 0px;
}
.font {
  font-size: 12px;
}
.hide {
  display: none;
}
.show {
  display: block;
}
</style>
<template>
  <div class="warnings-wrap">
    <!-- 头部 -->
    <div class="back-hd flex">
      <h2 style="padding-top:3px;">{{$t('TKE.overview.gjsz')}}</h2>
      <div style="width:20px"></div>
      <div style="padding-top:6px;">地域</div> 
      &nbsp; <City :Cityvalue.sync="selectedRegion" :cities="cities" class="city" @changeCity="changeCity"></City>
      <div style="width:20px"></div>
      <div style="padding-top:6px;">集群</div> 
      &nbsp;
      <el-select size="mini" v-model="value" :placeholder="$t('TKE.overview.qxz')"
      style="margin-bottom:5px;" @change="getList($event)">
        <el-option
          v-for="item in options"
          :key="item.ClusterId"
          :value="item.ClusterId"
          :label="item.ClusterId+'('+item.ClusterName+')'">
        </el-option>
      </el-select>
    </div>
    <div class="app-tke-fe-content__inner">
      <!-- 搜索框与新建，删除 -->
      <div class="flex">
        <div class="font" style="flex:1;padding-top:20px;">
          <router-link :to="'/warningCreate'">
             <el-button type="primary" size="mini">新建</el-button>
          </router-link>
            <el-button  size="mini" style="margin-left:8px;" :disabled="this.multipleSelection.length>=1?false:true" @click="dialogVisible = true">{{$t('TKE.overview.sc')}}</el-button>
        </div>
        <div style="position: relative;">
          <input type="search" :placeholder="$t('TKE.overview.qsrjqmc')" class="search" v-model ='input'>
          <button class="el-icon-search ip-btn" @click="getSearch()"></button>
        </div>
      </div>
      <!-- 内容 -->
      <div class="room-bottom">
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          v-loading="loadShow"
           :empty-text="$t('TKE.overview.zwsj')">
          <el-table-column
            type="selection"
            width="55"
            >
          </el-table-column>
          <el-table-column
            :label="$t('TKE.overview.gjclmc')"
            min-width="12%"
            prop='AlarmPolicySettings'>
            <template slot-scope="scope">
              <a style="cursor:pointer;" @click="jump(scope.row)">{{scope.row.AlarmPolicySettings.AlarmPolicyName}}</a>
            </template>
          </el-table-column>
          <el-table-column
            prop="AlarmPolicySettings"
            :label="$t('TKE.overview.cllx')"
            min-width="18%">
            <template slot-scope="scope">
                {{scope.row.AlarmPolicySettings.AlarmObjectsType | AlarmObjectsTypes}}
            </template>
          </el-table-column>
          <el-table-column
            prop="AlarmPolicySettings"
            :label="$t('TKE.overview.cftj')"
            min-width="30%">
             <template slot-scope="scope">
               <div v-for="(item,index) in scope.row.AlarmPolicySettings.AlarmMetrics" :key='index'>
                  {{item.ArgusPolicyName}}{{item.Evaluator|Evaluators}}{{item.Evaluator|EvaluatorValues}}{{item.Unit}}{{$t('TKE.overview.cx')}}{{item.ContinuePeriod}}{{$t('TKE.overview.fzjg')}}
               </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="AlarmPolicySettings"
            label="告警管道"
            min-width="20%">
            <template slot-scope="scope">
                <div>{{$t('TKE.overview.jsz')}}:{{scope.row.NotifySettings.ReceiverGroups.length}}{{$t('TKE.overview.ge')}}</div>
                <div>管道:<span v-for="(item,index) in scope.row.NotifySettings.NotifyWay" :key='index'>{{item|NotifyWays}}</span></div>
            </template>
          </el-table-column>
          <el-table-column
            prop="address"
            label="操作"
            min-width="20%">
               <template slot-scope="scope">
                  <el-button
                    @click="deleteRow(scope.$index, tableData)"
                    type="text"
                    size="small">
                    {{$t('TKE.overview.sc')}}
                  </el-button>
                  <el-button
                    type="text"
                    size="small"
                    @click="copyRow(scope.$index, tableData)">
                    {{$t('TKE.overview.fz')}}
                  </el-button>
                </template>
          </el-table-column>
        </el-table>
        <div class="Right-style pagstyle">
          <span class="pagtotal">共&nbsp;{{TotalCount}}&nbsp;{{$t('TKE.overview.tiao')}}</span>
          <el-pagination
            :page-size="pagesize"
            layout="prev, pager, next"
            :current-page.sync="currpage"
            @current-change="handleCurrentChange"
            :total="TotalCount"
          ></el-pagination>
        </div>
      </div>
    </div>
      <!-- 全选删除提示信息 -->
      <el-dialog
        :title="$t('TKE.overview.scgjsz')"
        :visible.sync="dialogVisible"
        width="50%">
        <div>{{$t('TKE.overview.qdsc')}}<span v-for="(item,index) in multipleSelection" :key="index">{{item.AlarmPolicySettings.AlarmPolicyName}}<span v-if="(index+1)!==item.length">,</span></span>嗎？</div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible=false">取 消</el-button>
          <el-button type="primary" @click="deleteAll()">{{$t('TKE.overview.qd')}}</el-button>
        </span>
      </el-dialog>
      <!-- 单选删除 -->
      <el-dialog
        :title="$t('TKE.overview.scgjsz')"
        :visible.sync="dialogVisibleO"
        width="50%"
        @close='disClose'>
        <div>{{$t('TKE.overview.qdsc')}}<span v-for="(item,index) in name" :key="index">{{item}}</span>嗎？</div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="disClose()">取 消</el-button>
          <el-button type="primary" @click="deleteOne()">{{$t('TKE.overview.qd')}}</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  TKE_COLONY_LIST,
  TKE_WARNING_GETCOLONY,
  TKE_DELETE_POLICIES,
  ALL_CITY
} from "@/constants";
import City from '@/components/public/CITY'
export default {
  name:'warnings',
  components: {
    City
  },
  data() {
    return {
      length: 1,
      TotalCount: 0, // 总条数
      pagesize: 20, // 分页条数
      currpage: 1, // 当前页码
      options: [],
      cities: [],
      selectedRegion: '',
      selectedCity: '',
      select: '',
      value: '',
      listData: [],
      multipleSelection: [],
      tableData: [],
      dialogVisible:false,
      dialogVisibleO:false,
      delete:[],
      input:'',
      name:[],
      loadShow:true
    }
  },
  created() {
    this.getColony()
    this.GetCity()
  },
  methods:{
    handleSelectionChange(val) {
        this.multipleSelection = val;
        // console.log(this.multipleSelection)
    },
    handleCurrentChange(val){
        this.currpage = val
        this.loadShow = true
        this.getWarningListItem()
    },
    copyRow(){
      this.$router.push({
        name: 'warningCopy',
      })
    },
    getList(e){
      this.value = e
      this.loadShow = true
      this.getWarningListItem()
    },
    getSearch(){
      this.getWarningListItem()
    },
    // 获取集群列表
    getColony () { 
      const param = {
        Version: "2018-05-25"
      }
      this.axios.post(TKE_COLONY_LIST, param).then(res => {
        if (res.Error == undefined) {
          // console.log(res)
          this.options = res.Response.Clusters
          this.value = res.Response.Clusters[0].ClusterId
          // this.loadShow = false
          this.getWarningListItem()
        } else {
          this.$message({
              message: ErrorTips[res.codeDesc],
              type: "error",
              showClose: true,
              duration: 0
          })
        }
      })
    },
    // 告警配置列表
    getWarningListItem () { 
      const param = {
        ClusterInstanceId: this.value,
        // Filter:{AlarmPolicyName:this.input},
        Limit: this.pagesize,
        Offset: (this.currpage-1)*20,
        Version: "2018-05-25"
      }
      this.axios.post(TKE_WARNING_GETCOLONY, param).then(res => {
        if (res.Error == undefined) {
          console.log(res)
          this.tableData = res.Response.AlarmPolicySet
          this.TotalCount = res.Response.TotalCount
          this.delete=[]
          this.loadShow = false
        } else {
          this.$message({
              message: ErrorTips[res.Response.Error.code],
              type: "error",
              showClose: true,
              duration: 0
          })
        }
      })
    },
    // 点击删除
    deleteRow(e,count){
      // console.log(count[e].AlarmPolicySettings.AlarmPolicyName)
      this.name.push(count[e].AlarmPolicySettings.AlarmPolicyName)
      this.delete.push(count[e].AlarmPolicyId)
      this.dialogVisibleO = true
      // console.log(this.delete)
    },
    // 点击弹窗确定
    deleteOne(){
      this.DeleteWarning()
      this.dialogVisibleO = false
      this.name=[]
    },
    // 点击全选删除
    deleteAll(){
      this.delete=[]
      this.delete = this.multipleSelection.map(item=>{
        return item.AlarmPolicyId
      })
      // console.log(this.delete)
      this.DeleteWarning()
      this.dialogVisibleO = false
    },
    // 点击弹窗取消
    disClose(){
      this.dialogVisibleO=false
      this.delete=[]
      this.name=[]
    },
    // 删除告警配置
    DeleteWarning () { 
      const param = {
        AlarmPolicyIds: this.delete,
        ClusterInstanceId: this.value,
        Version: "2018-05-25"
      }
      this.axios.post(TKE_DELETE_POLICIES, param).then(res => {
        console.log(res)
        if (res.Error == undefined) {
          // console.log(res)
          this.getWarningListItem()
          // this.tableData = res.Response.AlarmPolicySet
        } else {
          this.$message({
              message: ErrorTips[res.Response.Error.Code],
              type: "error",
              showClose: true,
              duration: 0
          })
        }
      })
    },
    GetCity () {
      this.axios.get(ALL_CITY).then(data => {
        console.log(data.data)
        this.cities = data.data
        this.selectedRegion = data.data[0].Region
        this.selectedCity = data.data[0]
        this.$cookie.set('regionv2', this.selectedCity.Region)
      })
    },
    changeCity (city) {
      this.selectedCity = city
      this.$cookie.set('regionv2', city.Region)
    },
    // 路由跳转
    jump (row) {
      // console.log(row)
      this.$router.push({
        name: 'warningDetail',
        query: {
          clusterId:this.value,
          alarmPolicyId: row.AlarmPolicyId
        }
      })
    },
  },
  filters:{
    AlarmObjectsTypes:function(value){
        if(value == 'all'){
          return "集群"
        }
    },
    Evaluators:function(value){
      if(value.Type == 'gt'){
        return ">"
      } else if(value.Type == 'lt' && value.Value != '1' && value.Value != '0'){
        return "<"
      } else if(value.Value == '1' || value.Value == '0') {
        return "="
      }
    },
    EvaluatorValues:function(value){
      // console.log(value)
      if(value.Value == '1'){
        return 'False'
      } else if(value.Value == '0') {
        return "True"
      } else {
        return value.Value
      }
    },
    NotifyWays:function(value){
      if(value == 'SMS'){
        return "簡訊 "
      } else if(value == 'CALL'){
        return "電話 "
      } else if(value == 'EMAIL'){
        return "郵箱 "
      } else {
        return "微信 "
      }
    }
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
  padding:12px 15px 15px 15px;
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
  padding:20px;
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
.Right-style {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
  .esach-inputL {
    width: 300px;
    margin-right: 20px;
  }
}
.pagstyle {
  padding: 20px;
  .pagtotal {
    font-size: 13px;
    font-weight: 400;
    color: #565656;
    line-height: 32px;
  }
}
.room-bottom {
  background: white;
}
</style>
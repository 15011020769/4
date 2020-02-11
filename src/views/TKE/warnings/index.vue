<template>
  <div class="warnings-wrap">
    <!-- 头部 -->
    <div class="back-hd flex">
      <h2 style="padding-top:3px;">警告设置</h2>
      <div style="width:20px"></div>
      <div style="padding-top:6px;">地域</div> 
      &nbsp;<el-button  type="primary" class="init hd-button" style="margin-top:2px;">中国台北</el-button>
      <div style="width:20px"></div>
      <div style="padding-top:6px;">集群</div> 
      &nbsp;
      <el-select size="mini" v-model="value" placeholder="请选择"
      style="margin-bottom:5px;">
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
          <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            label="告警策略名称"
            width="120">
            <template slot-scope="scope">{{ scope.row.date }}</template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="策略类型"
            width="120">
          </el-table-column>
          <el-table-column
            prop="address"
            label="触发条件"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="name"
            label="告警渠道"
            width="120">
          </el-table-column>
          <el-table-column
            prop="address"
            label="操作"
            show-overflow-tooltip>
               <template slot-scope="scope">
                  <el-button
                    @click.native.prevent="deleteRow(scope.$index, tableData)"
                    type="text"
                    size="small">
                    删除
                  </el-button>
                      <el-button
                    @click.native.prevent="deleteRow(scope.$index, tableData)"
                    type="text"
                    size="small">
                    复制
                  </el-button>
                </template>
          </el-table-column>
        </el-table>
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
      length: 1,
      pageSize: 20,
      pageIndex: 0,
      options: [],
      value: '',
      listData: [],
      multipleSelection: [],
      funllscreenLoading:false,
      tableData: [{
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }]
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
      this.funllscreenLoading = true;
      console.log((val.split('('))[0])
      const res = this.axios.post(WARNING_GetCOLONY,params).then(res=>{
        console.log(res)
        if(res.Response.AlarmPolicySet.length>0){
          let resData= res.Response.AlarmPolicySet;
          this.length = resData.length;
          this.listData = resData;
          console.log(resData)
          for (let i = 0; i < resData.length; i++) {
            let getData = {
              AlarmPolicyName:'',AlarmPolicyType:''
            };
            getData.name = resData.AlarmPolicySettings
          }
          this.funllscreenLoading = false;
        }else{
          this.funllscreenLoading = false;
          this.length = 0;
          console.log('数据请求出错')
        }
      });
    }
  },
  created() {
    // 获取集群列表
    this.getWarningList();
  },
  methods:{
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
</style>
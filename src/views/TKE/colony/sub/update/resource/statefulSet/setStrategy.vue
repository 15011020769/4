<!-- 工作负载设置更新策略 -->
<template>
  <div class="colony-wrap">
    <!-- 头部 -->
    <div class="tke-content-header " >
      <div class="tke-grid ">
        <!-- 左侧 -->
        <div class="grid-left">
          <span class="goback" @click="goBack">
            <i class="el-icon-back"></i>
          </span>
          <h2 class="header-title">{{$t('TKE.subList.szgxcl')}}</h2>
        </div>
        <!-- 右侧 -->
      </div>
    </div>

    <div class="colony-main">
      <div class="tke-card tke-formpanel-wrap mb60">
        <el-form
					class="tke-form"
					:model="cl"
					label-position="left"
					label-width="120px"
					size="mini"
				>
					 <el-form-item label="更新方式" >
              <el-select v-model="updateWay">
                <el-option :label="$t('TKE.subList.gdgxtj')" value="1"> </el-option>
                <el-option label="OnDelete" value="2"> </el-option>
              </el-select>
              <p v-show="updateWay=='1'"> {{$t('TKE.subList.dslzggx')}}</p>
              <p v-show="updateWay=='2'">{{$t('TKE.subList.sdsc')}}</p>
            </el-form-item>
            <div v-show="updateWay=='1'">
              <el-form-item label="策略配置" >
                <div class="flex bg">
                  <span>Partition</span>
                  <div style="margin-left:50px;">
                    <el-input class="w192" v-model="cl.podNum"></el-input>
                  </div>
                </div>
              </el-form-item>
            </div>
        </el-form>
				<!-- 底部 -->
        <div class="tke-formpanel-footer">
					<el-button size="small"   type="primary" @click="submit">完成</el-button>
          <el-button size="small" @click="goBack">取消</el-button>
        </div>
      </div>    
    </div>
  </div>
</template>

<script>
import HeadCom from "@/components/public/Head";
import {TKE_COLONY_QUERY} from '@/constants'
export default {
  name: "setStrategy2",
  data() {
    return {
      cl:{
        podNum:'',
      },
      updateWay:'1',
      clusterId:'',
      name:'',
      spaceName:'',
      workload:'',
      type:''
    };
  },
  components: {
    HeadCom
  },
  created() {
    this.clusterId=this.$route.query.clusterId;
    this.name=this.$route.query.name;
    this.spaceName=this.$route.query.spaceName;
    this.workload=this.$route.query.workload;
    this.baseData();
  },
  methods: {
    //返回上一层
    goBack(){
      this.$router.go(-1);
		},
		submit(){
      var params;
      if(this.updateWay==2){//手动删除
       params={
          ClusterName: this.clusterId,
          ContentType: "application/strategic-merge-patch+json",
          Method: "PATCH",
          Path: `/apis/apps/v1beta2/namespaces/${this.spaceName}/${this.workload}/${this.name}`,
          RequestBody:  JSON.stringify({"spec":{"updateStrategy":{"type":"OnDelete","rollingUpdate":null}}}) ,
          Version: "2018-05-25"
       }
      }else if(this.updateWay==1){//滚动更新
        params={
          ClusterName: this.clusterId,
          ContentType: "application/strategic-merge-patch+json",
          Method: "PATCH",
          Path: `/apis/apps/v1beta2/namespaces/${this.spaceName}/${this.workload}/${this.name}`,
          RequestBody:  JSON.stringify({"spec":{"updateStrategy":{"type":"RollingUpdate","rollingUpdate":{"partition":Number(this.cl.podNum)}}}}) , 
          Version: "2018-05-25",
        }
      }
      console.log(params)
      this.axios.post(TKE_COLONY_QUERY,params).then(res=>{
            console.log(res)
            if(res.Response.Error === undefined){
              this.$router.go(-1);
              this.$message({
                message: '更新成功',
                type: "success",
                showClose: true,
                duration: 0
              });


            }else{
              let ErrTips = {};
              let ErrOr = Object.assign(this.$ErrorTips, ErrTips);
              this.$message({
                message: ErrOr[res.Response.Error.Code],
                type: "error",
                showClose: true,
                duration: 0
               });
           }
      })
    },
    baseData(){
        var params={
              Method: "GET",
              Path:"/apis/apps/v1beta2/namespaces/" +this.spaceName +"/"+this.workload+"?fieldSelector=metadata.name=" +
                this.name,
              Version: "2018-05-25",
              ClusterName: this.clusterId
        }
        this.axios.post(TKE_COLONY_QUERY,params).then(res=>{
           let response = JSON.parse(res.Response.ResponseBody);
           console.log(response)
           let obj=response.items[0];
          console.log(obj)

          this.cl.podNum=obj.spec.revisionHistoryLimit;
          this.type=obj.spec.updateStrategy.type
          console.log(this.type)
          if(this.type!='RollingUpdate'){
            this.updateWay='2'
          }else{
            this.updateWay='1'
          }
        })

    },

  }
};
</script>

<style lang="scss" scoped>
	.tke-type{
		font-size: 12px;
		color: #888;
		margin-top: 8px;
	}
	.tke-set{
		background-color: #f2f2f2;
		height: 50px;
		width	: 400px;
	}
   .flex {
    display: flex;
    align-items: center;
  }

  .bg {
    width: 50%;
    background: #f2f2f2;
    box-sizing: border-box;
    padding: 10px;
  }
  .w192{
    width:192px;
  }

</style>


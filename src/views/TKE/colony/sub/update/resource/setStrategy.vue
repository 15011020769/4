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
          <h2 class="header-title">设置更新策略</h2>
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
                <el-option label="滚动更新（推荐）" value="1"> </el-option>
                <el-option label="快速更新" value="2"> </el-option>
              </el-select>
              <p v-show="updateWay=='1'"> 对实例进行逐个更新，这种方式可以让您不中断业务实现对服务的更新</p>
              <p v-show="updateWay=='2'"> 直接关闭所有实例，启动相同数量的新实例</p>
            </el-form-item>
            <div v-show="updateWay=='1'">
              <el-form-item label="更新间隔">
                <el-input class="w100" v-model="cl.timeInterval" ></el-input>秒
              </el-form-item>
              <el-form-item label="更新策略">
                <el-radio-group v-model="updateTactics">
                  <el-radio label="1">启动新的Pod,停止旧的Pod</el-radio>
                  <el-radio label="2">停止旧的Pod，启动新的Pod</el-radio>
                  <el-radio label="3">自定义</el-radio>
                </el-radio-group>
                <p v-show="updateTactics==1">请确认集群有足够的CPU和内存用于启动新的Pod, 否则可能导致集群崩溃</p>
              </el-form-item>
              <el-form-item label="策略配置" >
                <div class="flex bg" v-show="updateTactics!=3">
                  <span>Pods</span>
                  <div style="margin-left:150px;">
                    <el-input class="w192" v-model="cl.podNum"></el-input>
                    <p> Pod将批量启动或停止</p>
                  </div>
                </div>
                <div class="bg" v-show="updateTactics==3">
                  <div class="flex">
                    <span>MaxSurge</span>
                    <div style="margin-left:150px;">
                      <el-input class="w192" v-model="cl.maxPodOver"></el-input>
                      <p>允许超出所需规模的最大Pod数量</p>
                    </div>
                  </div>
                  <div class="flex">
                    <span>MaxUnavailable</span>
                    <div style="margin-left:114px;">
                      <el-input class="w192" v-model="cl.maxPodNot"></el-input>
                      <p>允许最大不可用的Pod数量</p>
                    </div>
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
  name: "setStrategy",
  data() {
    return {
      number:0,
      cl:{
        timeInterval:'',
        podNum:'',
        maxPodOver:'',
        maxPodNot:'',
      },
      updateWay:'1',
      updateTactics:'1',
      clusterId:'',
      name:'',
      spaceName:'',
      workload:'',
      type:'RollingUpdate',
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
      if(this.updateWay==2){//快速更新
      let obj={
        "spec":{"minReadySeconds":0,"strategy":{"type":"Recreate","rollingUpdate":null}}
        }
        params={
          ClusterName: this.clusterId,
          ContentType: "application/strategic-merge-patch+json",
          Method: "PATCH",
          Path: "/apis/apps/v1beta2/namespaces/"+this.spaceName+"/"+this.workload+"/"+this.name,
          RequestBody: JSON.stringify(obj),
          Version: "2018-05-25",
        }
      }else if(this.updateWay==1){//滚动更新
        
        let obj={};
        if(this.updateTactics==1){
          obj={
            "spec":{"minReadySeconds":Number(this.cl.timeInterval) ,"strategy":{"type":"RollingUpdate","rollingUpdate":{"maxSurge":Number(this.cl.podNum) ,"maxUnavailable":0}}}
          }
        }else if(this.updateTactics==2){
           obj={
            "spec":{"minReadySeconds":Number(this.cl.timeInterval) ,"strategy":{"type":"RollingUpdate","rollingUpdate":{"maxSurge":0 ,"maxUnavailable":Number(this.cl.podNum)}}}
          }
        }else{
           obj={
            "spec":{"minReadySeconds":Number(this.cl.timeInterval) ,"strategy":{"type":"RollingUpdate","rollingUpdate":{"maxSurge":this.cl.maxPodOver.indexOf('%')!=-1?this.cl.maxPodOver:Number(this.cl.maxPodOver),"maxUnavailable":this.cl.maxPodNot.indexOf('%')!=-1?this.cl.maxPodNot:Number(this.cl.maxPodNot)}}}
          }
        }
        params={
          ClusterName:this.clusterId,
          ContentType: "application/strategic-merge-patch+json",
          Method: "PATCH",
          Path: "/apis/apps/v1beta2/namespaces/"+this.spaceName+"/"+this.workload+"/"+this.name,
          RequestBody:JSON.stringify(obj),
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
          this.type=obj.spec.strategy.type;

         if(this.type=='RollingUpdate'){
            this.updateWay='1'//滚动更新
            this.cl.timeInterval=obj.spec.minReadySeconds;

            let maxSurge=obj.spec.strategy.rollingUpdate.maxSurge;
            let maxUnavailable=obj.spec.strategy.rollingUpdate.maxUnavailable;

            if(maxSurge===0){
              this.updateTactics='2';
              this.cl.podNum=maxUnavailable
            }else if( maxUnavailable===0){
               this.updateTactics='1';
               this.cl.podNum=maxSurge
            }else{
               this.updateTactics='3';
               this.cl.maxPodOver=maxSurge;
               this.cl.maxPodNot= maxUnavailable
            }
           }else{
           this.updateWay='2'//快速更新
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


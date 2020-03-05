<!-- 工作负载更新调度策略 -->
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
          <h2 class="header-title">更新调度策略</h2>
        </div>
        <!-- 右侧 -->
      </div>
    </div>

    <div class="colony-main">
      <div class="tke-card tke-formpanel-wrap mb60">
        <el-form
					class="tke-form"
					label-position="left"
					label-width="120px"
					size="mini"
				>
					<el-form-item label="节点调度策略">
						<el-radio-group class="tke-radio-group" v-model="se.radio">
							<el-radio label="1">不使用调度策略</el-radio>
							<el-radio label="2">指定节点调度</el-radio>
							<el-radio label="3">自定义调度规则</el-radio>
						</el-radio-group>
				    <p>可根据调度规则，将Pod调度到符合预期的Label的节点中。设置工作负载的调度规则指引</p>
            <div v-show="se.radio==2" class="bg">
              <div style="height:110px;overflow:auto">
              <p>台北一区</p>
                <!-- <p>
                  <el-checkbox></el-checkbox>ins-4bhved3k(as-变化的2)
                </p>
                <p>
                  <el-checkbox></el-checkbox>ins-5ic5rvb2(as-qewq)
                </p> -->
                <el-checkbox-group v-model="appointNode" @change="selectNode">
                  <p v-for="(item,index) in content" :key="index">
                    <el-checkbox :label="item.metadata.name">{{item.metadata.labels['cloud.tencent.com/node-instance-id']}}</el-checkbox>
                  </p>
                </el-checkbox-group>
              </div>
            </div> 
					</el-form-item>
          <div  v-show="se.radio==3">
              <el-form-item label="强制满足条件">
                <el-tooltip class="item" effect="light" content="调度期间如果满足其中一个亲和性条件则调度到对应node，如果没有节点满足条件则调度失败。"
                  placement="right">
                  <i class="el-icon-info  setPosition2"></i>
                </el-tooltip>
                <div class="bg2" v-for="(val,idx) in mustCondition" :key="idx">
                  <i class="el-icon-close set-i1" @click="delMustCondition(idx)"></i>
                  <div style="clear: both; margin-bottom:10px"></div>
                  <p style="float:left">条件
                    <el-tooltip class="item" effect="light" content="多个规则为同时满足" placement="right">
                      <i class="el-icon-info "></i>
                    </el-tooltip>
                  </p>
                  <div style="float:right;">
                    <div v-for="(i,index) in val" :key="index" style="margin-bottom:6px;" class="flex">
                      <el-input class="w150" v-model="i.name"></el-input>
                      <el-select v-model="i.connect" class="w100" style="margin:0px 10px;">
                        <el-option v-for="item in conditionOptions" :key="item.value" :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                      <el-input class="w150" v-model="i.rule"></el-input>
                      <el-tooltip v-if="val.length==1" class="item" effect="light" content="至少配置一个选择器" placement="top">
                        <i class="el-icon-close" style="font-size:20px;cursor:pointer"></i>
                      </el-tooltip>
                      <i class="el-icon-close" v-else @click="val.splice(index,1)"
                        style="font-size:20px;cursor:pointer"></i>
                    </div>
                    <a href="#" @click="addRule1(idx)">添加规则</a>
                  </div>
                  <div style="clear: both;"></div>
                </div>
                <a href="#" @click="addCondition">添加条件</a>
              </el-form-item>
              <el-form-item label="尽量满足条件">
                <el-tooltip class="item" effect="light" content="调度期间如果满足其中一个亲和性条件则调度到对应node，如果没有节点满足条件则随机调度到任意节点。"
                  placement="right">
                  <i class="el-icon-info  setPosition2"></i>
                </el-tooltip>
                <div class="bg2" v-for="(val,idx) in needCondition" :key="idx">
                  <i class="el-icon-close set-i1" @click="delNeedCondition(idx)"></i>
                  <div style="clear: both; margin-bottom:10px"></div>
                  <div style="float:left">
                  <p style="margin-bottom:10px">权重</p>
                    <p>条件
                    <el-tooltip class="item" effect="light" content="多个规则为同时满足" placement="right">
                      <i class="el-icon-info "></i>
                    </el-tooltip></p>
                  </div>
                  <div style="float:right;">
                      <div style="margin-bottom:10px"><el-input   v-model="val.weight" class="w150" ></el-input></div>
                      <div v-for="(i,index) in val.arr" :key="index" style="margin-bottom:6px;" class="flex">
                        <el-input class="w150" v-model="i.name"></el-input>
                        <el-select v-model="i.connect" class="w100" style="margin:0px 10px;">
                          <el-option v-for="item in conditionOptions" :key="item.value" :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                        <el-input class="w150" v-model="i.rule"></el-input>
                        <el-tooltip v-if="val.arr.length==1" class="item" effect="light" content="至少配置一个选择器"
                          placement="top">
                          <i class="el-icon-close" style="font-size:20px;cursor:pointer"></i>
                        </el-tooltip>
                        <i class="el-icon-close" v-else @click="val.arr.splice(index,1)"
                          style="font-size:20px;cursor:pointer"></i>
                      </div>
                      <a href="#" @click="addRule2(idx)">添加规则</a>
                  </div>
                  <div style="clear: both;"></div>
                </div>
                <a href="#" @click="addCondition2">添加条件</a>
              </el-form-item>
            </div>
        </el-form>
				<!-- 底部 -->
        <div class="tke-formpanel-footer">
					<el-button size="small" type="primary" @click="submit">完成</el-button>
          <el-button size="small" @click="goBack">取消</el-button>
        </div>
      </div>    
    </div>
  </div>
</template>

<script>
import HeadCom from "@/components/public/Head";
import {TKE_COLONY_QUERY,TKE_COLONY_INSTANCES} from '@/constants'
export default {
  name: "updateStrategy",
  data() {
    return {
			number:0,
      se: {
        tabPosition: 'jt',
        radio: '1'
      },
      appointNode:[],//指定节点调度
      content:[],//接收后台返回的节点调度数值
      //条件
        conditionOptions: [{
            value: 'In',
            label: 'In'
          },
          {
            value: 'NotIn',
            label: 'NotIn'
          },
          {
            value: 'Exists',
            label: 'Exists'
          },
          {
            value: 'DoesNotExist',
            label: 'DoesNotExist'
          },
          {
            value: 'Gt',
            label: 'Gt'
          },
          {
            value: 'Lt',
            label: 'Lt'
          },
        ],
      mustCondition: [], //强制满足条件
      needCondition: [], //尽量满足条件
      clusterId:'',
      name:'',
      spaceName:'',
    };
  },
  components: {
    HeadCom
  },
  created() {
     this.clusterId=this.$route.query.clusterId;
     this.name=this.$route.query.name;
     this.spaceName=this.$route.query.spaceName;
     this.findNodeData();
     this.findNode();
     this.baseData()
  },
  methods: {
    //返回上一层
    goBack(){
      this.$router.go(-1);
		},
		submit(){
      var params={
        ClusterName: "cls-otln4thi",
        ContentType: "application/merge-patch+json",
        Method: "PATCH",
        Path: "/apis/apps/v1beta2/namespaces/"+this.spaceName+"/deployments/"+this.name,
        RequestBody:{
          spec:{
            template:{
              spec:{affinity:''}
            }
        }},
        Version: "2018-05-25",
      }
 


      if(this.se.radio=='1'){
        params.RequestBody.spec.template.spec.affinity=null
      }else if(this.se.radio=='2'){
        params.RequestBody.spec.template.spec.affinity={
						"nodeAffinity": {
							"requiredDuringSchedulingIgnoredDuringExecution": {
								"nodeSelectorTerms": [{
									"matchExpressions": [{
										"key": "kubernetes.io/hostname",
										"operator": "In",
										"values": this.appointNode
									}]
								}]
							},
							"preferredDuringSchedulingIgnoredDuringExecution": null
						}
					}
      }
      console.log(params)
      this.axios.post(TKE_COLONY_QUERY,params).then(res=>{
        console.log(res)
         if(res.Response.Error === undefined){
          //  this.$router.go(-1)
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

    selectNode(val){
      console.log(val)
      console.log(this.appointNode)
    },
    findNodeData(){
      var params={
        ClusterId: this.clusterId,
        InstanceRole: "WORKER",
        Version: "2018-05-25"
      }
      console.log(params)
      this.axios.post(TKE_COLONY_INSTANCES,params).then(res=>{
        console.log(res)
          if(res.Response.Error === undefined){
              // this.content=res.Response.InstanceSet
              console.log( this.content)
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
    findNode(){
      var params={
       ClusterName: this.clusterId,
       Method: "GET",
       Path: "/api/v1/nodes",
       Version: "2018-05-25",
      }
      this.axios.post(TKE_COLONY_QUERY,params).then(res=>{
        console.log(res)
          if(res.Response.Error === undefined){
            let response = JSON.parse(res.Response.ResponseBody);
            console.log(response.items)
              this.content=response.items
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
              Path:"/apis/apps/v1beta2/namespaces/" +this.spaceName +"/deployments?fieldSelector=metadata.name=" +
                this.name,
              Version: "2018-05-25",
              ClusterName: this.clusterId
        }
        this.axios.post(TKE_COLONY_QUERY,params).then(res=>{
              console.log(res)
              if(res.Response.Error === undefined){
                let response = JSON.parse(res.Response.ResponseBody);
                let obj=response.items[0];
              console.log(obj)
              }

         })
    },

     //节点调度策略
    delMustCondition(index) {// 删除强制满足条件
      this.mustCondition.splice(index, 1)
    },
    delNeedCondition(index) {//删除尽可能满足条件
      this.needCondition.splice(index, 1)
    },
  //节点调度策略
    addRule1(index) {//添加规则1
        this.mustCondition[index].push({
          name: '',
          rule: '',
          connect: 'In'
        })
     },
    addRule2(index) {//添加规则2
        this.needCondition[index].arr.push({
          name: '',
          rule: '',
          connect: 'In'
        })
    },
     //节点调度策略
    addCondition() {// 添加强制满足条件
        var arr = [{
          name: '',
          connect: 'In',
          rule: ''
        }];
        this.mustCondition.push(arr)
    },
    addCondition2() {// 添加尽可能满足条件
        var obj = {
          weight:'',
          arr:[{
            name: '',
            connect: 'In',
            rule: ''
          }]
        };
        this.needCondition.push(obj)
    },
  }
};
</script>

<style lang="scss" scoped>
 .bg {
    width: 50%;
    background: #f2f2f2;
    box-sizing: border-box;
    padding: 10px;
  }
	.bg2 {
    width: 60%;
    background: #f2f2f2;
    box-sizing: border-box;
    padding: 10px 20px;
    margin-bottom: 10px;
  }
  .setPosition2 {
    position: absolute;
    left: -38px;
    top: 8px;
  }
  .set-i1 {
    font-size: 20px;
    cursor: pointer;
    float: right;
  }

</style>


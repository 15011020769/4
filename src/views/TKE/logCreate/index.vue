<template>
  <div class="persistenceSetting">
    <div class="back-hd flex">
      <router-link :to="'/logCollection'">
        <i class="el-icon-back hd-icon-back"></i>
      </router-link>
      <h3>新建日志采集规则</h3>
    </div>
      <div class="tf-g app-tke-fe-content__inner">
        <div class="event-persistence font">
          <el-form ref="form" :model="form"  :rules="rules" label-width="100px" class='tke-form' label-position="left" >
            <el-form-item label="收集规则名称" prop="name">
              <el-input size="mini" class="el-input" placeholder="请输入日志收集规则名称" v-model='form.name'></el-input>
              <div :class="{activeColor:fontColor}">最长63个字符，只能包含小写字母、数字及分隔符("-")，且必须以小写字母开头，数字或小写字母结尾</div>
            </el-form-item>
            <el-form-item label="所在地域">
              <div>中国台北</div>
            </el-form-item>
            <el-form-item label="所属集群">
              <div>{{$route.query.clusterId}}</div>
            </el-form-item>
            <el-form-item label="类型">
              <el-radio-group v-model="tabPosition"  size='mini'>
                <el-radio-button label="one">容器标准输出</el-radio-button>
                <el-radio-button label="two">容器文件路径</el-radio-button>
                <el-radio-button label="three">节点文件路径</el-radio-button>
              </el-radio-group>
              <div>
                采集集群内任意服务下的容器日志，仅支持Stderr和Stdout的日志
                <a href="" style="margin-left:10px;">查看示例</a>
              </div>
            </el-form-item>
            <el-form-item label="日志源">
              <el-radio-group v-model="vlog" size='mini' v-if="tabPosition == 'one'">
                <el-radio-button label="one">所有容器</el-radio-button>
                <el-radio-button label="two">指定容器</el-radio-button>
              </el-radio-group>
              <div v-for="(item,index) in formFour" :key="index" style="margin-bottom:10px;">
                <div class="form-form position-form" v-if="vlog == 'two' && tabPosition == 'one' && item.flag == false">
                    <i class='el-icon-edit-outline icon-edit-outline' @click='item.flag=true'></i>
                    <i class='el-icon-close icon-close' @click="removeNewRoom(formFour,index)"></i>
                    <div><span>Namespace:</span><span>default</span>|<span>采集对象:</span><span>全部容器</span></div>
                </div>

                <div class="form-form position-form" v-if="vlog == 'two' && tabPosition == 'one' && item.flag == true">
                    <i class='el-icon-check icon-check'  @click='item.flag=false'></i>
                    <i class='el-icon-close icon-close' @click="removeNewRoom(formFour,index)"></i>
                  <el-form-item label="所属Namespace" label-width="150px">
                      <el-select placeholder="请选择" size='mini' v-model='formTwo.value1'> 
                          <el-option
                            v-for="item in item.option1"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                      </el-select>
                  </el-form-item>
                  <el-form-item label="所属集群">
                      <el-radio-group v-model="item.radio">
                        <el-radio label="1">全部容器包含该Namespace下所有的容器</el-radio>
                        <el-radio label="2">按工作负载（Workload）选择</el-radio>
                      </el-radio-group>
                  </el-form-item>
                  <el-form-item label=" " v-if='item.radio == 2'>
                    <div class='border-room'>
                      <div class='border-text'>
                        <div class='border-left'>工作负载类型</div>
                        <div class='border-right'>列表</div>
                      </div>
                      <el-tabs tab-position="left" style="height: 200px;" v-model="item.activeName">
                        <el-tab-pane label="用户管理" name="first">用户管理</el-tab-pane>
                        <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
                        <el-tab-pane label="角色管理"  name="third">角色管理</el-tab-pane>
                        <el-tab-pane label="定时任务补偿"  name="fourth">定时任务补偿</el-tab-pane>
                      </el-tabs>
                    </div>
                  </el-form-item>
                  </div>
                </div>
                <div v-if="vlog == 'two' && tabPosition == 'one'" class="new-room" @click="addNewRoom">新增容器</div>
              <div class="form-form" v-if="tabPosition == 'two'">
                <el-form  :model="formTwo" label-width="100px" class='tke-form' label-position="left">
                     <el-form-item label="工作负载选项">
                       <el-select placeholder="请选择" size='mini' v-model='formTwo.value1'> 
                          <el-option
                            v-for="item in formTwo.option1"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                        <el-select placeholder="请选择" size='mini' class='ml10' v-model='formTwo.value2'>
                          <el-option
                            v-for="item in formTwo.option2"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                        <el-select placeholder="请选择" size='mini' class='ml10' v-model="formTwo.value3">
                          <el-option
                            v-for="item in formTwo.option3"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="配置采集路径">
                        <div v-for="(domain,index) in formTwo.optionAll">
                          <el-form-item label="容器名">
                            <el-select placeholder="请选择" size='mini' class='ml10' v-model='domain.value4'>
                              <el-option
                                v-for="item in domain.option4"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                                >
                              </el-option>
                            </el-select>
                          </el-form-item>
                          <el-form-item label="文件路径">
                            <el-select placeholder="请选择" size='mini' class='ml10' v-model='domain.value5'>
                              <el-option
                                v-for="item in domain.option5"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                              </el-option>
                            </el-select>
                            <el-input class='w180' size='mini' placeholder="请输入文件路径"></el-input>
                            <el-tooltip class="item" effect="dark" content="删除" placement="right" v-if='index !=0'>
                                <i class="el-icon-close" @click.prevent="removeDomain(domain)"></i>
                            </el-tooltip>
                          </el-form-item>
                         </div>
                         <el-link type="primary" style="cursor: pointer;font-size:12px;"  @click="addDomain">新增变量</el-link>
                        <p>可配置多个路径，路径必须以`/`开头，支持通配符（*），请保证容器的日志文件保存在数据卷，否则收集规则无法生效</p>
                    </el-form-item>
                </el-form>
              </div>

              <div class="form-form" v-if="tabPosition == 'three'">
                <el-form-item label="收集路径">
                  <el-input size="mini" class="el-input" placeholder="请输入日志收集路径" v-model='formThree.value'></el-input>
                  <div>指定采集日志的文件路径，支持通配符(*)，必须以`/`开头</div>
                </el-form-item>
                <el-form-item label="metadata">
                  <div style="width:300px;" > 
                    <div class="form-input"  v-for="(domain, index) in formThree.domains"
                  :key="domain.key">
                          <el-input v-model="domain.value" size="mini" placeholder="变量名"></el-input>
                          <span>=</span>
                          <el-input v-model="domain.valueKey" size="mini" placeholder="变量值"></el-input>
                          <el-tooltip class="item" effect="light" content="删除" placement="right">
                              <i class="el-icon-close" @click.prevent="removeMetadata(domain)"></i>
                          </el-tooltip>
                      </div>
                    </div>
                  <el-link type="primary" style="cursor: pointer;font-size:12px;"  @click="addMetadata">新增metadata</el-link>
                  <div>收集规则收集的日志会带上metadata，并上报到消费端</div>
                </el-form-item>
              </div>
            </el-form-item>
            <el-form-item label="消费端">
              <div class="form-form">
                <!-- 内表单 -->
                <el-form  :model="form" label-width="90px" size="mini">
                  <el-form-item label="类型">
                    <el-radio-group v-model="consumer">
                      <el-radio-button label="one">Kafka</el-radio-button>
                      <!-- <el-radio-button label="two">日志服务CLS</el-radio-button>
                      <el-radio-button label="three">Elasticsearch</el-radio-button> -->
                    </el-radio-group>
                    <div style="font-size:10px;">
                      将采集的日志消费到消息服务Kafka中。
                      <a href="">查看示例</a>
                    </div>
                  </el-form-item>
                  <div v-if="consumer=='one'">
                    <el-form-item label="Kafka类型">
                      <div class="flex">
                        <el-checkbox v-model="checked">使用腾讯云消息队列CKafka</el-checkbox>
                      </div>
                    </el-form-item>
                    <el-form-item label="CKafka实例" v-if='checked'>
                        <div class="flex">
                            <el-select v-model="Ckafka.value" placeholder="请选择" style='margin-right:10px;'>
                              <el-option
                                v-for="item in Ckafka.options"
                                :key="item"
                                :value="item">
                              </el-option>
                            </el-select>
                          <el-select placeholder="请选择" :disabled='Topic.options.length=="1"' v-model="Topic.value">
                            <el-option
                              v-for="item in Topic.options"
                              :key="item"
                              :value="item">
                            </el-option>
                          </el-select>
                        </div>
                      </el-form-item>
                      <el-form-item label="访问地址" label-width="100px" v-if='!checked'>
                        <el-input placeholder="请输入IP地址" style='margin-right:10px;' v-model='form.region'></el-input>
                        <el-input placeholder="请输入IP端口号" v-model='form.number'></el-input>
                      </el-form-item>
                      <el-form-item label="主题（Topic）" label-width="100px" v-if='!checked'>
                          <el-input placeholder="请输入Topic"  v-model='form.topic'></el-input>
                      </el-form-item>
                  </div>

                  <div v-if="consumer=='two'">
                    <el-form-item label="日志服务实例" label-width="100px" v-if='!checked'>
                        <el-select placeholder="请选择" v-model='form.value1' style='margin-right:10px;'>
                          <el-option
                            v-for="item in form.option1"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                        <el-select placeholder="请选择" v-model='form.value2' disabled>
                          <el-option
                            v-for="item in form.option2"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                        <p>如现有的日志服务CLS不合适，您可以去控制台<el-link style='font-size:12px;' type="primary">新建日志集</el-link></p>
                    </el-form-item>
                  </div>

                  <div v-if="consumer=='three'">
                    <el-form-item label="Elasticsearch地址" label-width="120px" >
                          <el-input placeholder="eg"  v-model='form.Elasticsearch'></el-input>
                    </el-form-item>
                    <el-form-item label="索引" label-width="120px" >
                          <el-input placeholder="eg"  v-model='form.index'></el-input>
                          <p>最长60个字符，只能包含小写字母、数字及分隔符("-"、"_"、"+")，且必须以小写字母开头</p>
                    </el-form-item>
                  </div>
                </el-form>
              </div>
            </el-form-item>
            <!-- <el-form-item>
              <el-button type="primary" @click="onSubmit"  size='mini'>立即创建</el-button>
              <el-button  size='mini'>取消</el-button>
            </el-form-item> -->
          </el-form>
           <!-- 底部 -->
        <div class="tke-formpanel-footer footer">
          <p>
          <el-button size="small"  :disabled='show1' @click="logCreat" type="primary">立即创建</el-button>
          <el-button size="small" @click="$router.go(-1)">取消</el-button>
          </p>
          <p v-show="show1">当前日志采集器状态（checking）下无法创建日志采集规则 
             <el-tooltip class="item" effect="dark" content="刷新日志采集器状态" placement="bottom-start">
    <i class='el-icon-refresh'></i>
    </el-tooltip>
                 </p>
          <p></p>
        </div>
        </div>
      </div>
    </div>
</template>
<script>
import HeadCom from "@/components/public/Head";
 import {
    TKE_COLONY_QUERY,TKE_KAFKA_LIST,TKE_TOPIC_LIST
  } from "@/constants";
export default {
  data(){
    var validateName = (rule, value, callback) => {
        if (value === '') {
          this.fontColor=true;
          callback();
        } else {
            let reg=/^[a-z]([a-z0-9]|-){0,61}([a-z0-9])$/;
            let flag=reg.test(this.form.name)
            if(!flag){
               this.fontColor=true;
            callback();
            }else{
               this.fontColor=false;
              callback();
            }
        }
      };
    return{
      genDataValue:[],
      filterMethod(query, item) {
        return item.pinyin.indexOf(query) > -1;
      },
      show1:false,
      fontColor:false,
       rules:{
          name:[
            { validator: validateName, trigger: 'blur' ,required:false}
          ],
        },
      form: {
        name:'',
        region: '',
        number:'',
        topic:'',
        option1:[],
        option2:[],
        value1:'',
        value2:'',
        Elasticsearch:'',
        index:''
      },
      formTwo:{
        option1:[
          {
            value:1,
            label:'请选择Namespace'
          },
          {
            value:2,
            label:'default'
          },
          {
            value:3,
            label:'kube-public'
          },
          {
            value:4,
            label:'kube-system'
          },
          {
            value:5,
            label:'tfy-pub'
          }
        ],
         option2:[],
        option3:[],
        optionAll:[{
          option4:[],
          option5:[],
          value4:'',
          value5:'',
          valueKey:''
        }],
        value1:'',
        value2:'',
        value3:'',
      },
      formThree:{
        value:'',
        domains:[{
          value:'',
          valueKey:''
        }]
      },
      formFour:[{
        option1:[
          {
            value:1,
            label:'请选择Namespace'
          },
          {
            value:2,
            label:'default'
          },
          {
            value:3,
            label:'kube-public'
          },
          {
            value:4,
            label:'kube-system'
          },
          {
            value:5,
            label:'tfy-pub'
          }
        ],
        radio:'',
        flag:true,
        activeName:'first'
      }],
      value:'jq',
      Ckafka:{
        value:'',
        options:['请选择CKafka',]
      },
      Topic:{
        value:'',
        options:['请选择Topic']
      },
       options:[],
       output:{
         instance_id:'',
         topic_id:'',
         host:'',
         port:'',
         topic:''
       },
      tabPosition: 'one',
      vlog:'one',
      consumer:'one',
      checked:false,
      instanceList:[],
    }
  },
  watch: {
    value() {
      console.log(this.value)
    },
    Ckafka:{
      handler(val){
        var params={
            instanceId:(val.value.split('('))[0],
        }
      this.output.instance_id=(val.value.split('('))[0];
      var filtdata= this.instanceList.filter(item=>{
        return  item.instanceId==(val.value.split('('))[0]
      })
      this.output.host=filtdata[0].vipList[0].vip
      this.output.port=filtdata[0].vipList[0].vport
      console.log( this.output)
      this.axios.post(TKE_TOPIC_LIST,params).then(res=>{
         if(res.codeDesc === 'Success'){
           var arr=['请选择Topic'];
           res.data.topicList.forEach((item)=>{
             arr.push(item.topicId+'('+item.topicName+')')
           })
           if(arr.length!=1){
             this.Topic.value=arr[1];
           }else{
             this.Topic.value='无'
           }
           this.Topic.options=arr;
         }
       })
      },
      deep:true
    },
    Topic:{
      handler(val){
        if(val.value!='无'&&val.value!='请选择Topic'){
          this.output.topic_id=(val.value.split('('))[0];
          this.output.topic=(val.value.split('('))[1].split(')')[0]
          }else{

        }
      },
      deep:true
    }
  },
  created(){
    this.checkCluster();//检查是否可以创建日志
    this.kafkaList();
  },
  mounted(){
    
  },
  methods: {
    logCreat(){
       if (this.form.name == "") {
          this.$refs.form.validateField('name');
          this.$message("函數名不能為空");
          return false;
        }
        var params={
          ClusterName: "cls-a7rua9ae",
          Method: "POST",
          Path: "/apis/platform.tke/v1/clusters/cls-a7rua9ae/logcollector?namespace=kube-system",
          RequestBody: {"kind":"LogCollector","apiVersion":"ccs.cloud.tencent.com/v1","metadata":{"name":this.form.name,"namespace":"kube-system"},"spec":{"description":"tempory nothing","input":{"container_log_input":{"all_namespaces":true,"namespaces":[]},"type":"container-log"},"output":{"ckafka_output":{"instance_id":"ckafka-ps5oivkn","topic_id":"topic-lu40u62s","host":this.output.host,"port":this.output.port,"topic":this.output.topic},"type":"ckafka"}}},
          Version: "2018-05-25",
        }
        this.axios.post(TKE_COLONY_QUERY, params).then(res=>{
            console.log(this.$route.query.clusterId)
            var  clusterId=this.$route.query.clusterId;
            if(res.Response.Error === undefined){
              this.$router.go(-1);
            }
        })
    },
    onSubmit() {
      alert('已提交')
    },
    removeDomain (item) {
        var index = this.formTwo.optionAll.indexOf(item)
        if (index !== -1) {
            this.formTwo.optionAll.splice(index, 1)
        }
    },
    addDomain () {
      this.formTwo.optionAll.push({
          option4:[],
          option5:[],
          value4:'',
          value5:'',
          valueKey:''
      })
    },
    addMetadata () {
      this.formThree.domains.push({
            value: '',
            valueKey: '',
        })
    },
    removeMetadata (item) {
        var index = this.formThree.domains.indexOf(item)
        if (index !== -1) {
            this.formThree.domains.splice(index, 1)
        }
    },
    removeNewRoom (item,index) {
        if(item.length !== 1){
            this.formFour.splice(index, 1)
        } 
    },
    addNewRoom () {
      this.formFour.push({option1:[
          {
            value:1,
            label:'请选择Namespace'
          },
          {
            value:2,
            label:'default'
          },
          {
            value:3,
            label:'kube-public'
          },
          {
            value:4,
            label:'kube-system'
          },
          {
            value:5,
            label:'tfy-pub'
          }
        ],
        radio:'',
        flag:true,
        activeName:'first'})
    },
     kafkaList(){
       var params={
         data:{
           status: [1],
         }
       }
       this.axios.post(TKE_KAFKA_LIST,params).then(res=>{
           if(res.codeDesc === 'Success'){
              res.data.instanceList.forEach((item,index)=>{
                this.Ckafka.options.push(item.instanceId+'('+item.instanceName+')')
                if(index==0){
                  this.Ckafka.value=item.instanceId+'('+item.instanceName+')'
                }
              })
              //保存kafka的信息
              this.instanceList=res.data.instanceList;
           }
       })
     },
    //监测是否可以创建日志采集
    checkCluster(){
      var params={
        ClusterName: this.$route.query.clusterId.split('(')[0],
        Method: "GET",
        Path: "/apis/platform.tke/v1/logcollectors/"+this.$route.query.clusterId.split('(')[0],
        Version: "2018-05-25",
      }
      console.log(params)
      this.axios.post(TKE_COLONY_QUERY, params).then(res=>{
        console.log(res)
        if(res.Response.Error === undefined){
          var data = JSON.parse(res.Response.ResponseBody);
          this.show1=data.status.phase=='running'?false:true
          console.log(data)
        }else{

        }
      })
    },
  },
  props:["uid"],
  components: {
    HeadCom
  },
}
</script>
<style lang="scss" scoped>
.workload {
  width:200px;
  height:30px;
  background-color:white;
  margin-left:96px;
  line-height:30px;
  padding-left: 5px;
}
.init {
  margin:0;
}
.mt12 {
  margin-top:12px;
}
.p3 {
  padding:3px 0 3px 0;
}
.numberEnd {
  display: inline-block;
  width: 28px;
  height: 29px;
  text-align: center;
  line-height: 28px;
  border: 1px solid #cccccc;
}
.w100 {
  width: 100px !important;
}
.glw {
  width:80px;
  padding-left: 5px;
}
.el-checkbox {
  width: 15px;
  height: 15px;
}
.form-form {
  width: 840px;
  padding: 20px;
  background-color: #f2f2f2;
  display: table;
  font-size: 12px;
  line-height: 1.5
}
.el-textarea {
  max-width:900px;
  width: 420px;
  padding-top: 5px;
  padding-bottom: 5px;
  // height: 100px;
}
.el-input {
  width:200px;
}
.back-hd {
  width: 100%;
  height: 51px;
  background: white;
  padding:15px;
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
  color:red;
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
  padding:5px 0 5px 0;
}
.font-orange {
  color: #ff9d00;
}
.data-card-list {
  height: 28px;
  line-height: 28px;
}
.data-card-hd {
  width: 100px;
  height: 28px;
  line-height: 28px;
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
  margin:0 auto;
}
.tf-g {
  font-size: 0;
  margin-bottom: 50px;
  // background: pink;
  padding:20px;
}
.event-persistence {
  padding: 20px;
  background: white;
  box-shadow: 0 1px 3px 0 rgba(0,0,0,.1);
}
.form-input{
    display: flex;
    justify-content: space-between;
    align-items: center;
    span{
        margin:0 10px;
    }
    i{
        margin:0 10px;
        cursor: pointer;
    }
}
.position-form{
  position:relative;
}
.icon-edit-outline{
  position:absolute;
  top:10px;
  right:50px;
}
.icon-check{
   position:absolute;
  top:10px;
  right:50px;
}
.icon-close{
  position:absolute;
  top:10px;
  right:30px;
}
.border-room{
  border:1px solid #e5e5e5;
  .border-text{
    height:36px;
    border-bottom:1px solid #e5e5e5;
    .border-left{
      float:left;
      height:36px;
      width:124px;
      border-right:2px solid #e5e5e5;
      padding-left:10px;
    }
    .border-right{
      float:left;
      height:36px;
      padding-left:10px;

    }
  }
}
.new-room{
  text-align: center;
  line-height: 30px;
  height: 30px;
  width: 840px;
  border:1px dashed #e5e5e5;
  margin-top:10px;
  cursor: pointer;
  &:hover{
    background-color:#f2f2f2;
  }
}
.footer{
  display:flex;
  align-items:center;
  justify-content:space-between;
  p:nth-of-type(2){
    border:solid 1px #F6B5B5;
    padding:20px 30px;
    background:#fcecec;
    flex:1;
    color:#b43537;
  }
   p:nth-of-type(1), p:nth-of-type(3){
     flex:1
   }

}
i{cursor:pointer}
.activeColor{
    color: #F56C6C !important;
  }
</style>
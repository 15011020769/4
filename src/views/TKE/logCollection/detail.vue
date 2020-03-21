<template>
  <div>
    <div class="datails-nav">
      <ul>
        <router-link to="/logCollection">
          <li>
            <i class="el-icon-back"></i>
            <span>{{$route.query.stashName}}</span>
          </li>
        </router-link>
      </ul>
    </div>
    <div class='room'>
      <el-card class="box-card">
        <el-form label-width="150px" class='tke-form' label-position="left">
          <h3 style='margin-bottom:20px;'>{{$t('TKE.overview.jbxx')}}</h3>
          <el-form-item :label="$t('TKE.overview.rzgzmc')">
            {{$route.query.stashName}}
          </el-form-item>
          <el-form-item :label="$t('TKE.overview.ssjq')">
            <a @click="goCluster()">{{$route.query.clusterId}}</a>
          </el-form-item>
          <el-form-item :label="$t('TKE.overview.cjsj')">
            {{timeFormat(createTime)}}
          </el-form-item>
          <el-divider></el-divider>
          <h3 style='margin-bottom:20px;'>{{$t('TKE.overview.rzxx')}}</h3>
          <el-form-item :label="$t('TKE.overview.rzlx')">
            <span v-if="$route.query.type.type == 'host-log'">{{$t('TKE.overview.zdzjwj')}}</span>
            <!-- <span v-if="$route.query.type.type == 'host-log'">{{$t('TKE.overview.zdrqrz')}}</span> -->
            <span v-if="$route.query.type['container_log_input']&&$route.query.type['container_log_input']['all_namespaces']">{{$t('TKE.overview.rqbzsc')}}</span>
            <span v-if="$route.query.type['container_log_input']&&!$route.query.type['container_log_input']['all_namespaces']">	指定容器日志</span>
            <span v-if="$route.query.type.type == 'pod-log'">{{$t('TKE.overview.zdrqwj')}}</span>
            <!-- <span>指定主机文件</span> -->
          </el-form-item>
          <!-- <el-form-item  v-if="$route.query.type == 'host-log'||$route.query.type == 'container-log'"   :label="$t('TKE.overview.rzy')"> -->
          <div v-if="$route.query.type.type != 'host-log'">
            <el-form-item  v-if="$route.query.type.type != 'pod-log'" :label="$t('TKE.overview.rzy')">
              <span v-if="all_namespaces">{{$t('TKE.overview.syrq')}}</span>
              <span v-if="!logInfo">{{$t('TKE.overview.syrq')}}</span>
              <div v-if="logInfo">
                <div v-for="(v,i) in logInfo" :key="i">
                  <p v-for="(vc,ic) in v.workloads" :key="ic">{{v.namespace}}/{{vc.type}}/{{vc.name}}</p>
                </div>
              </div>
            </el-form-item>
          </div>
          <!-- 收集路径 -->
          <div  v-if="$route.query.type.type == 'host-log'">
             <el-form-item label="收集路径">
                {{path}}
              </el-form-item>
          </div>
          <!--  -->
          <div  v-if="$route.query.type.type == 'pod-log'">
             <el-form-item :label="$t('TKE.overview.gzfz')">
                  kube-system / Deployment / -
              </el-form-item>
             <el-form-item :label="$t('TKE.overview.cjlj')">
                  {{$t('TKE.overview.rqmclj')}}
              </el-form-item>
          </div>
          <el-divider></el-divider>
          <h3 style='margin-bottom:20px;'>{{$t('TKE.overview.xfd')}}</h3>
          <el-form-item :label="$t('TKE.overview.lx')">
            {{type}}
          </el-form-item>
          <div v-if="type=='ckafka'">
              <el-form-item :label="$t('TKE.overview.sl')">
               {{ckafka.case}}
              </el-form-item>
              <el-form-item label="CKafka Topic">
                {{ckafka.topic}}
              </el-form-item>
          </div>
          <div v-if="type=='kafka'">
              <el-form-item :label="$t('TKE.overview.fwdzip')">
               {{kafka.ip}}
              </el-form-item>
              <el-form-item :label="$t('TKE.overview.fwdzdk')">
               {{kafka.port}}
              </el-form-item>
              <el-form-item :label="$t('TKE.overview.zti')">
                {{kafka.topic}}
              </el-form-item>
          </div>
        </el-form>
      </el-card>
    </div>
  </div>
</template>
<script>
import {
    TKE_COLONY_QUERY
  } from "@/constants";
  export default {
    name: 'logDetail',
    data() {
      return {
        createTime:'',
        type:'',
        kafka:{//kafka数据
            ip:'',
            port:'',
            topic:'',
        },
        ckafka:{//ckafka数据
            case:'',
            topic:''
        },
        id:'',
        logInfo:[],
        all_namespaces:false,
        path:'',//收集路径
      }
    },
    created(){
      console.log(this.$route.query.type)
        if(this.$route.query.clusterId&&this.$route.query.stashName&&this.$route.query.namespace){
          this.findData()
        }
        this.id=this.$route.query.clusterId
    },
    methods: {

      goCluster(){
      this.$router.push({
        name: "colonySub",
        query: {
          clusterId: this.id.split("(")[0],
          ProjectId:0
        }
      });

      },
      //  TKE_COLONY_QUERY
      timeFormat(times) {
        var d = new Date(times);
        var n = d.getFullYear();
        var y = (d.getMonth() + 1)<9?'0'+(d.getMonth() + 1):(d.getMonth() + 1);
        
        var r = d.getDate();
        var h = d.getHours(); //12
        var m = d.getMinutes(); //12
        var s = d.getSeconds();
        h < 10 ? h = "0" + h : h;
        m < 10 ? m = "0" + m : m
        s < 10 ? s = '0' + s : s

        return n + '-' + y + '-' + r + ' ' + h + ':' + m + ':' + s
      },

      findData() {

          var params = {
            ClusterName: this.$route.query.clusterId.split("(")[0],
            Method: "GET",
            Path: "/apis/platform.tke/v1/clusters/" + this.$route.query.clusterId.split("(")[0] + "/logcollector?namespace=" + this.$route.query.namespace +
              "&name=" +this.$route.query.stashName,
            Version: "2018-05-25",
          };
          this.axios.post(TKE_COLONY_QUERY, params).then(res => {
              if (res.Response.Error == undefined) {
                  var data = JSON.parse(res.Response.ResponseBody);
                  console.log(data)
                  this.createTime=data.metadata.creationTimestamp;
                  this.type=data.spec.output.type;
                  if(data.spec.input.container_log_input){//标准容器输出
                    let namespaces=data.spec.input.container_log_input.namespaces;
                    let flag=data.spec.input.container_log_input.all_namespaces
                      this.all_namespaces=flag;
                      console.log(namespaces,'namespaces')
                      console.log(this.all_namespaces,'this.all_namespaces')
                      this.logInfo=namespaces

                  }

                  if(data.spec.input.host_log_input){
                    this.path=data.spec.input.host_log_input.path
                  }
                


                  if(data.spec.output.type=='kafka'){
                      this.kafka.ip=data.spec.output.kafka_output.host
                      this.kafka.port=data.spec.output.kafka_output.port
                      this.kafka.topic=data.spec.output.kafka_output.topic
                  }else{
                      this.ckafka.topic=data.spec.output.ckafka_output.topic_id;
                      this.ckafka.case=data.spec.output.ckafka_output.instance_id
                  }

            } else {
            
            }
          })
      },

    }
  }

</script>
<style lang="scss" scoped>
  .datails-nav {
    height: 40px;
    background: #fff;

    span {
      color: #000;
      font-size: 14px;
      padding: 0 20px;
      box-sizing: border-box;
    }

    ul {
      display: flex;
      height: 40px;
      line-height: 40px;
      margin-left: 20px;

      li {
        display: flex;
        align-items: center;
        justify-content: center;

        i {
          font-size: 16px;
          font-weight: bold;
        }

        span {
          font-size: 16px;
          font-weight: 700;
        }
      }

      li:nth-child(1) {
        color: blue;
      }
    }
  }

  .box-card {
    width: 100%;
  }

  .room {
    padding: 20px;
  }
a{
  cursor:pointer;
}
</style>

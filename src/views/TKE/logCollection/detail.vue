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
          <h3 style='margin-bottom:20px;'>基本信息</h3>
          <el-form-item label="日志规则名称">
            {{$route.query.stashName}}
          </el-form-item>
          <el-form-item label="所属集群">
            {{$route.query.clusterId}}
          </el-form-item>
          <el-form-item label="创建时间">
            {{timeFormat(createTime)}}
          </el-form-item>
          <el-divider></el-divider>
          <h3 style='margin-bottom:20px;'>日志信息</h3>
          <el-form-item label="日志类型">
            <span v-if="$route.query.type == 'host-log'">指定容器日志</span>
            <span v-if="$route.query.type == 'container-log'">容器标准输出</span>
          </el-form-item>
          <el-form-item label="日志源">
            <span>所有容器</span>
          </el-form-item>
          <el-divider></el-divider>
          <h3 style='margin-bottom:20px;'>消费端</h3>
          <el-form-item label="类型">
            {{type}}
          </el-form-item>
          <div v-if="type=='ckafka'">
              <el-form-item label="CKafka实例">
               {{ckafka.case}}
              </el-form-item>
              <el-form-item label="CKafka Topic">
                {{ckafka.topic}}
              </el-form-item>
          </div>
          <div v-if="type=='kafka'">
              <el-form-item label="访问地址IP">
               {{kafka.ip}}
              </el-form-item>
              <el-form-item label="访问地址端口">
               {{kafka.port}}
              </el-form-item>
              <el-form-item label="主题（Topic）">
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
        kafka:{
            ip:'',
            port:'',
            topic:'',
        },
        ckafka:{
            case:'',
            topic:''
        }
      }
    },
    created(){
        if(this.$route.query.clusterId&&this.$route.query.stashName&&this.$route.query.namespace){
            console.log(1)
            this.findData()
        }
    },
    methods: {
      //  TKE_COLONY_QUERY
      timeFormat(times) {
        var d = new Date(times);
        var n = d.getFullYear();
        var y = d.getMonth() + 1;
        var r = d.getDate();
        var h = d.getHours(); //12
        var m = d.getMinutes(); //12
        var s = d.getSeconds();
        h < 10 ? h = "0" + h : h;
        m < 10 ? m = "0" + m : m

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

</style>

 <!-- deployment-基本信息 -->
<template>
  <div class="colony-main">
    <div class="tke-card tke-formpanel-wrap">
      <h4  class="tke-formpanel-title">基本信息</h4>
      <el-form  class="tke-form" label-position='left' label-width="120px" size="mini">
        <el-form-item label="名称">
          <div class="tke-form-item_text">{{rowData.metadata && rowData.metadata.name}}</div>
        </el-form-item>
        <el-form-item label="Namespace">
          <div class="tke-form-item_text">{{rowData.metadata && rowData.metadata.namespace}}</div>
        </el-form-item>
        <el-form-item label="描述">
          <div class="tke-form-item_text">{{rowData.metadata && rowData.metadata.annotations && rowData.metadata.annotations.description || '-'}}</div>
        </el-form-item>
        <el-form-item label="启动时间">
          <div class="tke-form-item_text">{{rowData.metadata.creationTimestamp | startTime}}</div>
        </el-form-item>
        <el-form-item label="Labels">
          <div class="tke-form-item_text">{{changeLabel(rowData.metadata && rowData.metadata.labels)}}</div>
        </el-form-item>
        <el-form-item label="执行策略">
          <div class="tke-form-item_text">{{rowData.spec && rowData.spec.schedule || '-'}}</div>
        </el-form-item>
        <el-form-item label="并发策略">
          <div class="tke-form-item_text">{{rowData.spec && rowData.spec.concurrencyPolicy || '-'}}</div>
        </el-form-item>
        <el-form-item label="并行度">
          <div class="tke-form-item_text">{{rowData.spec.jobTemplate.spec.parallelism || 0}}</div>
        </el-form-item>
        <el-form-item label="重复次数">
          <div class="tke-form-item_text">{{rowData.spec.jobTemplate.spec.completions || 0}}</div>
        </el-form-item>
        
        
      </el-form>
    </div>

    <!-- <div class="tke-card tke-formpanel-wrap mt10">
      <h4  class="tke-formpanel-title">数据卷（Volumes）</h4>
      <el-form  class="tke-form" label-position='left' label-width="120px" size="mini"  v-for="(item, i) in rowData.spec.template.spec.volumes && rowData.spec.template.spec.volumes" :key="i">
        <el-form-item label="">
          <div class="tke-form-item_text">{{item | volumes}}</div>
        </el-form-item>
      </el-form>
    </div> -->

    <div class="tke-card tke-formpanel-wrap mt10">
      <h4  class="tke-formpanel-title">容器（Containers）</h4>
      <hr style="margin-left:-20px; margin-right:-20px">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane v-for="(item, i) in rowData.spec.jobTemplate.spec.template.spec.containers" :key="i"  :label="item.name" :name="item.name">
          <el-form  class="tke-form" label-position='left' label-width="120px" size="mini">
            <el-form-item label="容器名称">
              <div class="tke-form-item_text">{{item.name}}</div>
            </el-form-item>
            <el-form-item label="镜像">
              <div class="tke-form-item_text">{{item.image}}</div>
            </el-form-item>
            <el-form-item label="运行命令" v-if="item.command">
              <div class="tke-form-item_text">{{item.command && item.command | command}}</div>
            </el-form-item>
            <el-form-item label="CPU Requested" v-if="item.resources.requests">
              <div class="tke-form-item_text">{{item.resources && item.resources.requests && item.resources.requests.cpu || '-'}}</div>
            </el-form-item>
            <el-form-item label="CPU Limited" v-if="item.resources.limits">
              <div class="tke-form-item_text">{{item.resources && item.resources.limits && item.resources.limits.cpu || '-'}}</div>
            </el-form-item>
            <el-form-item label="内存 Requested" v-if="item.resources.requests">
              <div class="tke-form-item_text">{{item.resources && item.resources.requests && item.resources.requests.memory || '-'}}</div>
            </el-form-item>
            <el-form-item label="内存 Limited" v-if="item.resources.limits">
              <div class="tke-form-item_text">{{item.resources && item.resources.limits && item.resources.limits.memory || '-'}}</div>
            </el-form-item>
            <el-form-item label="运行参数" v-if="item.args">
              <div class="tke-form-item_text">
                {{item.args | args}}
              </div>
            </el-form-item>
            <el-form-item label="环境变量" v-if="item.env">
              <div class="tke-form-item_text">{{item.env && item.env | environment}}</div>
              <!-- <div class="tke-form-item_text">{{item.env && item.env | environment1}}</div> -->
            </el-form-item>
            <el-form-item label="挂载点" v-if="item.volumeMounts">
              <div class="tke-form-item_text">
                {{item.volumeMounts && item.volumeMounts | volumeMount}}
              </div>
            </el-form-item>
            <el-form-item label="存活检查" v-if="item.livenessProbe">
              <div class="tke-form-item_text">{{item.livenessProbe && item.livenessProbe | livenessProbe}}</div>
            </el-form-item>
            <el-form-item label="就绪检查" v-if="item.readinessProbe">
              <div class="tke-form-item_text">{{item.readinessProbe && item.readinessProbe | readinessProbe}}</div>
            </el-form-item>

          </el-form>
        </el-tab-pane>
        <!-- <el-tab-pane label="dnsmasq" name="second">dnsmasq</el-tab-pane>
        <el-tab-pane label="sidecar" name="third">sidecar</el-tab-pane> -->
      </el-tabs>
      <!-- <el-form  class="tke-form" label-position='left' label-width="120px" size="mini">
        <el-form-item label="configMap">
          <div class="tke-form-item_text">kube-dns-config（卷名称） kube-dns（资源名称）</div>
        </el-form-item>
      </el-form> -->
    </div>
   </div>
</template>

<script>
import moment from 'moment';
import { ALL_CITY } from "@/constants";
export default {
  name: "deploymentDetailInfo",
  data() {
    return {
      activeName: '',
      clusterId:'',//集群id
      rowData: {},//传过来的数据
      spaceName: '',//路由传过来的命名空间名称
    };
  },
  components: {
   
  },
  created() {
    // 从路由获取类型
    this.clusterId=this.$route.query.clusterId;
    this.spaceName = this.$route.query.spaceName;
    this.rowData = this.$route.query.rowData;
    this.activeName = this.$route.query.rowData.spec.jobTemplate.spec.template.spec.containers[0].name;
  },
  methods: {
    handleClick(tab, event) {
    },
    //转换label
    changeLabel(value){
      if(value) {
        let labels = '';
        for(let i in value) {
          labels += i + " : " + value[i] + '、'
        }
        return labels.substring(0,labels.length - 1);
      } else {
        return "-"
      }
    },
    //转换Selector
    changeSelector(value){
      if(value) {
        let labels = '';
        for(let i in value) {
          labels += i + " : " + value[i] + '、'
        }
        return labels.substring(0,labels.length - 1);
      } else {
        return "-"
      }
    }
  },
  filters: {
    environment(value) {
      let res = '';
      if(value) {
        for(let i = 0; i < value.length; i++) {
          if(value[i].value) {
            res += value[i].name + '=' + value[i].value + ","
          } else {
            let name = Object.keys(value[i].valueFrom)[0];
            res += value[i].name + '=' + name 
              // + "   名称：" +value[i].valueFrom.name.name 
                // + "   Key：" + value[i].valueFrom.name.key 
                + ","
          }
        }
        return res.substring(0,res.length - 1);
      } else {
        return res;
      }
      
    },
    environment1(value) {
      let res = '';
      if(value) {
        for(let i = 0; i < value.length; i++) {
          if(value[i].valueFrom) {
            res += value[i].name + '=secretKeyRef' + "   名称：" +value[i].valueFrom.secretKeyRef.name + "Key：" + value[i].valueFrom.secretKeyRef.key+ ","
          }
        }
        return res.substring(0,res.length - 1);
      } else {
        return res;
      }
      
    },
    volumeMount(value) {
      let res = '';
      if(value) {
        for(let i = 0; i < value.length; i++) {
          if(value[i].subPath) {
            res += '数据卷名称:' + value[i].name + ' 目标路径:' + value[i].mountPath + ' 挂载子路径:' + value[i].subPath + ','
          } else {
            res += '数据卷名称:' + value[i].name + ' 目标路径:' + value[i].mountPath + ' 挂载子路径:未设置,默认全覆盖目标路径' + ','
          }
        }
        return res.substring(0,res.length - 1);
      } else {
        return res;
      }
      
    },
    command(value) {
      let res = '';
      if(value) {
        for(let i = 0; i < value.length; i++) {
          res += value[i] + '   ,         '
        }
        return res.substring(0,res.length - 1);
      } else {
        return res;
      }
    },
    livenessProbe(value) {
      if(value) {
        let res = "";
        let keys = Object.keys(value);
        let values = Object.values(value);
        if(keys.length > 0) {
          if(keys[0] === 'tcpSocket') {
            res = Object.keys(values[0])[0] + ":    " + Object.values(values[0])[0] + "  ,   inspection method:    " + keys[0] + "  ,   "
          } else if(keys[0] === 'httpGet') {
            res = "inspection method:    " + keys[0] + "  ,   ";
            let val = values[0];
            let keylist = Object.keys(val);
            let vlist = Object.values(val);
            for(let a = 0; a < keylist.length; a++) {
              for(let b = 0; b < vlist.length; b++) {
                if(a === b) {
                  res+= keylist[a] + ":    " + vlist[b] + "  ,   ";
                }
              }
            }
          } else if (keys[0] === 'exec') {
            res = Object.keys(values[0])[0] + ":    " + Object.values(values[0])[0] + "  ,   inspection method:    " + keys[0] + "  ,   "
          }
          for(let i = 1; i < keys.length; i++) {
            for(let j = 1; j < keys.length; j++) {
              if(i === j) {
                res+= keys[i] + ":    " + values[j]  + "  ,"
              }
            }
          }
          res = res.substring(0,res.length - 1);
        }
        return res;
      }
    },
    readinessProbe(value) {
      if(value) {
        let res = "";
        let keys = Object.keys(value);
        let values = Object.values(value);
        if(keys.length > 0) {
          if(keys[0] === 'tcpSocket') {
            res = Object.keys(values[0])[0] + ":    " + Object.values(values[0])[0] + "  ,   inspection method:    " + keys[0] + "  ,   "
          } else if(keys[0] === 'httpGet') {
            res = "inspection method:    " + keys[0] + "  ,   ";
            let val = values[0];
            let keylist = Object.keys(val);
            let vlist = Object.values(val);
            for(let a = 0; a < keylist.length; a++) {
              for(let b = 0; b < vlist.length; b++) {
                if(a === b) {
                  res+= keylist[a] + ":    " + vlist[b] + "  ,   ";
                }
              }
            }
          } else if (keys[0] === 'exec') {
            res = Object.keys(values[0])[0] + ":    " + Object.values(values[0])[0] + "  ,   inspection method:    " + keys[0] + "  ,   "
          }
          for(let i = 1; i < keys.length; i++) {
            for(let j = 1; j < keys.length; j++) {
              if(i === j) {
                res+= keys[i] + ":    " + values[j]  + "  ,"
              }
            }
          }
          res = res.substring(0,res.length - 1);
        }
        return res;
      }
    },
    volumes(value) {
      let res = '';
      if(value) {
        res = value.name + "(数据卷)"
        return res;
      } else {
        res = '暂无数据卷';
      }
    },
    volumesName(value) {
      let res = '';
      if(value) {
        for(let i in value) {
          res = value[1];
        }
        return res;
      } else {
        return res;
      }
    },
    startTime(value) {
      if(value) {
        return moment(value).format("YYYY-MM-DD HH:mm:ss");
      } else {
        return '';
      }
    },
    args(val) {
      if(val) {
        let res = "";
        val.forEach(element => {
          res+= element + "        ,"
        });
        return res.substring(0, res.length - 1);
      }
    }
  }
};
</script>

<style lang="scss" scoped>




</style>


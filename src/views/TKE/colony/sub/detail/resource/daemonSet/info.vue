 <!-- deployment-基本信息 -->
<template>
  <div class="colony-main">
    <div class="tke-card tke-formpanel-wrap">
      <h4  class="tke-formpanel-title">基本信息</h4>
      <el-form  class="tke-form" label-position='left' label-width="120px" size="mini">
        <el-form-item label="名称">
          <div class="tke-form-item_text"><span>{{rowData.metadata && rowData.metadata.name}}</span></div>
        </el-form-item>
        <el-form-item label="Namespace">
          <div class="tke-form-item_text">{{rowData.metadata && rowData.metadata.namespace}}</div>
        </el-form-item>
        <el-form-item label="描述">
          <div class="tke-form-item_text">{{rowData.metadata && rowData.metadata.annotations && rowData.metadata.annotations.description || '-'}}</div>
        </el-form-item>
        <el-form-item label="创建时间">
          <div class="tke-form-item_text">{{rowData.addTime}}</div>
        </el-form-item>
        <el-form-item label="Labels">
          <div class="tke-form-item_text">{{changeLabel(rowData.metadata && rowData.metadata.labels)}}</div>
        </el-form-item>
        <!-- <el-form-item label="annotations">
          <div class="tke-form-item_text">{{rowData.metadata && rowData.metadata.annotations && rowData.metadata.annotations.description || '-'}}</div>
        </el-form-item> -->
        <el-form-item label="Selector">
          <div class="tke-form-item_text">{{changeSelector(rowData.spec && rowData.spec.selector && rowData.spec.selector.matchLabels)}}</div>
        </el-form-item>
        <el-form-item label="更新策略">
          <div class="tke-form-item_text">
            {{rowData.spec && rowData.spec.updateStrategy && rowData.spec.updateStrategy.type || '-'}}
          </div>
        </el-form-item>
        <el-form-item label="副本数">
          <div class="tke-form-item_text">{{rowData.status && rowData.status.desiredNumberScheduled || '-'}}</div>
        </el-form-item>
        <el-form-item label="运行副本数">
          <div class="tke-form-item_text">
            {{rowData.status && rowData.status.currentNumberScheduled || '-'}}
          </div>
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
        <el-tab-pane v-for="(item, i) in rowData.spec.template.spec.containers" :key="i"  :label="item.name" :name="item.name">
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
            <!-- <el-form-item label="运行参数">
              <div class="tke-form-item_text">
                --domain=cluster.local. <br>
                --dns-port=10053<br>
                --config-dir=/kube-dns-config<br>
                --v=2
              </div>
            </el-form-item> -->
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
import FileSaver from "file-saver";
import XLSX from "xlsx";
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
    this.activeName = this.$route.query.rowData.spec.template.spec.containers[0].name;
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
            res += value[i].name + '=secretKeyRef' + "   名称：Key：" + ","
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
          res += value[i] + '   ,       '
        }
        return res.substring(0,res.length - 1);
      } else {
        return res;
      }
    },
    livenessProbe(value) {

    },
    readinessProbe(value) {

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
    }
  }
};
</script>

<style lang="scss" scoped>




</style>


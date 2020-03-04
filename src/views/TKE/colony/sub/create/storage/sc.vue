 <!-- 新建PersistentVolume -->
<template>
  <div class="colony-wrap">
    <div class="tke-content-header">
      <div class="tke-grid ">
        <!-- 左侧 -->
        <div class="grid-left">
          <span class="goback" @click="goBack">
            <i class="el-icon-back"></i>
          </span>
          <h2 class="header-title">新建StorageClass</h2>
        </div>
        <!-- 右侧 -->
        <div class="grid-right"></div>
      </div>
    </div>  
    <div class="colony-main">

      <div class="tke-card tke-formpanel-wrap mb60">
        <el-form  class="tke-form m0" :model="pv" label-position='left' label-width="120px" size="mini">
          <el-form-item label="名称">
            <el-input class="w200" v-model="pv.name" placeholder="请输入StorageClass名称"></el-input>
            <p>最长63个字符，只能包含小写字母、数字及分隔符("-")，且必须以小写字母开头，数字或小写字母结尾</p>
          </el-form-item>
          <el-form-item label="Provisioner" class="m0">
            <el-radio-group v-model="pv.cloud" style="margin-bottom: 30px;">
              <el-radio-button label="CBS">云硬盘CBS</el-radio-button>
              <el-radio-button label="CFS" disabled>文件存储CFS</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="地域">
            <div>港澳台地区(中国台北)</div>
          </el-form-item>
          <el-form-item label="可用区">
              <!-- <el-checkbox-group v-model="checkListO">
                <el-checkbox v-model="tap1">随机可用区</el-checkbox>
              </el-checkbox-group> -->
              <el-checkbox-group v-model="checkListT">
                 <el-checkbox v-for="(item,index) in checkListT" :label="item" :key="index">{{item}}</el-checkbox>
              </el-checkbox-group>
          </el-form-item>
          <el-form-item label="计费模式">
            <el-radio-group v-model="pv.money">
              <el-radio-button label="CBS">按量计费</el-radio-button>
              <el-radio-button label="CFS">包年包月</el-radio-button>
            </el-radio-group>
            <div>支持删除和保留的回收策略</div>
          </el-form-item>
          <el-form-item label="云盘类型">
            <el-radio-group v-model="pv.ps">
              <el-radio-button label="CBS">高性能云硬盘</el-radio-button>
              <el-radio-button label="CFS">SSD云硬盘</el-radio-button>
            </el-radio-group>
            <div>容量限制可查看<a href="">CBS类型说明</a></div>
          </el-form-item>
          <el-form-item label="回收策略" class="m0">
            <el-radio-group v-model="pv.del" style="margin-bottom: 30px;">
              <el-radio-button label="CBS">删除</el-radio-button>
              <el-radio-button label="CFS">保留</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="定期备份" class="m0">
            <el-checkbox v-model="pv.checked" @change="!pv.checked">设置定期备份</el-checkbox>
            <div v-show="pv.checked">
               <el-select v-model="value" filterable placeholder="请选择">
                  <el-option
                    v-for="item in info"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <span style="margin-left:10px;">策略详情<i class="el-icon-info"></i></span>
                <p>设置定期备份可有效保护数据安全，备份数据将产生额外费用，请见<a>价格总览</a><i class="el-icon-edit-outline"></i></p>
            </div>
          </el-form-item>
        </el-form>

       
        <!-- 底部 -->
        <div class="tke-formpanel-footer">
          <el-button size="small" type="primary">新建StorageClass</el-button>
          <el-button size="small">取消</el-button>
        </div>
      </div>
    </div>

   
  </div>
</template>

<script>
import FileSaver from "file-saver";
import { ErrorTips } from "@/components/ErrorTips";
import XLSX from "xlsx";
import { ALL_CITY ,TKE_CBS_POLICIES} from "@/constants";
export default {
  name: "pvCreate",
  data() {
    return {
      pv: {
        cloud:"CBS",
        money:"CBS",
        ps: 'CBS',
        del:'CBS',
        name: '',
        options: ['cbs','ttt'],
        radio: '1',
        info:[],
        checked: false,
        checkListO:[],
        checkListT:["台北一区"],
        city:''
      },
      num:0
    };
  },
  components: {
    
  },
  created() {
     // 从路由获取类型
    this.GetPolicies()
  },
  methods: {
    //返回上一层
    goBack(){
          this.$router.go(-1);
    },
    GetPolicies(){
      const param = {
          "Filters.0.Name":"auto-snapshot-policy-state",
          "Filters.0.Values.0":"NORMAL",
          TryCreateDefaultAutoSnapshotPolicy: true,
          Version: "2017-03-12"
        }
        this.axios.post(TKE_CBS_POLICIES, param).then(res => {
          console.log(res)
            if (res.Response.Error == undefined) {
              console.log(res)
              // this.loadShow = false
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
  }
};
</script>

<style lang="scss" scoped>
.m0 {
  margin:0;
};
.red {
  color: #e54545;
};
.err {
  border: 1px solid #e54544;
}
</style>


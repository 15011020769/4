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
          <h2 class="header-title">新建PersistentVolume</h2>
        </div>
        <!-- 右侧 -->
        <div class="grid-right"></div>
      </div>
    </div>  
    <div class="colony-main">

      <div class="tke-card tke-formpanel-wrap mb60">
        <el-form  class="tke-form m0" :model="pv" label-position='left' label-width="120px" size="mini">
          <el-form-item label="来源设置" class="m0">
            <el-radio-group v-model="pv.tabPosition" style="margin-bottom: 30px;">
              <el-radio-button label="jt">静态创建</el-radio-button>
              <el-radio-button label="dt">动态创建</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <div v-if="pv.tabPosition=='jt'">
            <el-form-item label="名称" class="m0">
              <el-input class="w200" v-model="pv.name" placeholder="请输入名称"></el-input>
              <p>最长63个字符，只能包含小写字母、数字及分隔符("-")，且必须以小写字母开头，数字或小写字母结尾</p>
            </el-form-item>
            <el-form-item label="Provisioner" class="m0">
              <el-radio-group v-model="pv.ps" style="margin-bottom: 30px;">
                <el-radio-button label="CBS">云硬盘CBS</el-radio-button>
                <el-radio-button label="CFS" disabled>文件存储CFS</el-radio-button>
                <el-radio-button label="CFS" disabled>对象存储COS</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="读写权利" class="m0">
                <el-radio-group v-model="pv.rw" style="margin-bottom: 30px;">
                  <el-radio-button label="orw">单机读写</el-radio-button>
                  <el-radio-button label="tor" :disabled="pv.ps=='CBS'">多机只读
                  </el-radio-button>
                  <el-radio-button label="trw" :disabled="pv.ps=='CBS'">多机读写</el-radio-button>
                </el-radio-group>
              </el-form-item>
            <div v-if="pv.ps=='CBS'">
              <el-form-item label="StorageClass" class="m0">
                <el-select v-model="pv.value" placeholder="请选择">
                  <el-option
                    v-for="(item,index) in pv.options"
                    :key="index"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
                <el-button size="mini" style="height:28px;padding-bottom:2px;border:none;" icon="el-icon-refresh"></el-button>
              </el-form-item>
              <el-form-item label="选择云盘" class="m0">
                <div>未选择数据盘<a @click="dialogFormVisible=true">选择云硬盘</a></div>
              </el-form-item>
              <el-form-item label="文件系统" class="m0">
                <el-radio v-model="pv.radio" label="1">ext4</el-radio>
              </el-form-item>
            </div>
            <div v-if="pv.ps=='CFS'">
              <el-form-item label="StorageClass" class="m0">
                <el-select class="err" v-model="pv.value" placeholder="暂无数据" disabled>
                  <el-option
                    v-for="(item,index) in pv.options"
                    :key="index"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
                <el-button size="mini" style="height:28px;padding-bottom:2px;border:none;" icon="el-icon-refresh"></el-button>
                <i class="el-icon-warning red"></i>
                <div>当前类型无可用StorageClass，请前往<a href="">StorageClass</a><i class="el-icon-edit-outline"></i>进行新建</div>
              </el-form-item>
              <el-form-item label="选择CFS" class="m0">
                <el-select v-model="pv.value" placeholder="暂无数据" disabled>
                  <el-option
                    v-for="(item,index) in pv.options"
                    :key="index"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
                <el-button size="mini" style="height:28px;padding-bottom:2px;border:none;" icon="el-icon-refresh"></el-button>
                <div>如当前CFS不适合，请前往<a href="">文件存储控制台</a><i class="el-icon-edit-outline"></i>进行新建</div>
              </el-form-item>
              <el-form-item label="CFS子目录" class="m0">
              <el-input class="w200" v-model="pv.name" placeholder="子目录默认为/"></el-input>
              <p class="red">请确保CFS中存在该子目录，否则会挂载失败</p>
            </el-form-item>
            </div>
          </div>
          <div v-if="pv.tabPosition=='dt'">
            <el-form-item label="说明">
              <div>动态创建无须您手动创建PV，创建工作负载时指定数据卷为PVC类型，将自动创建PV</div>
            </el-form-item>
          </div>
        </el-form>
        <!-- 底部 -->
        <div class="tke-formpanel-footer">
          <el-button size="small" type="primary">创建PersistentVolume</el-button>
          <el-button size="small">取消</el-button>
        </div>
      </div>
    </div>
    <el-dialog title="选择云硬盘" :visible.sync="dialogFormVisible">
      <div class="post-room">
        <el-select v-model="form.value" placeholder="请选择" size='mini' style="width:200px;">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
        </el-select>
        <el-input v-model="form.input" placeholder="请输入内容" size='mini' style="width:200px;margin-left:10px;"></el-input>
          <div class="room-bottom">
          <el-table
            :data="tableData"
            stripe
            style="width: 100%;margin:20px 0;">
            <el-table-column
              prop="date"
              label=""
              width="80">
            </el-table-column>
            <el-table-column
              prop="date"
              label="ID"
              width="180">
            </el-table-column>
            <el-table-column
              prop="name"
              label="名称"
              width="180">
            </el-table-column>
            <el-table-column
              prop="address"
              label="大小">
            </el-table-column>
          </el-table>
          <div class="Right-style pagstyle">
            <span class="pagtotal">共&nbsp;{{TotalCount}}&nbsp;条</span>
            <el-pagination
              :page-size="pagesize"
              layout="prev, pager, next"
              :current-page.sync="currpage"
              @current-change="handleCurrentChange"
              :total="TotalCount"
            ></el-pagination>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import FileSaver from "file-saver";
import XLSX from "xlsx";
import { ALL_CITY,TKE_DESCRIBEDISKS } from "@/constants";
export default {
  name: "pvCreate",
  data() {
    return {
      pv: {
        name: '',
        tabPosition: 'jt',
        ps: 'CBS',
        rw:'orw',
        value: 'cbs',
        options: ['cbs','ttt'],
        radio: '1'
      },
      options:[],
      form:{
        value:'',
        input:''
      },
      tableData:[],
      dialogFormVisible:false
    };
  },
  components: {
    
  },
  created() {
     // 从路由获取类型
   this.GetDescribeDisks()
  },
  methods: {
     // 获取云硬盘
   GetDescribeDisks(){
      const param = {
        "Filters.0.Name":"disk-usage",
        "Filters.0.Values.0":"DATA_DISK",
        "Filters.1.Name":"disk-state",
        "Filters.1.Values.0":"ATTACHED",
         Limit: 20,
         Offset: 0,
         Version: "2017-03-12"
        
      }
      this.axios.post(TKE_DESCRIBEDISKS, param).then(res => {
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
    //返回上一层
    goBack(){
          this.$router.go(-1);
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
.post-room{
  width:100%;
  padding:20px;
}
.Right-style {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
  .esach-inputL {
    width: 300px;
    margin-right: 20px;
  }
}
.pagstyle {
  padding: 20px;
  .pagtotal {
    font-size: 13px;
    font-weight: 400;
    color: #565656;
    line-height: 32px;
  }
}
.room-bottom {
  background: white;
}
</style>


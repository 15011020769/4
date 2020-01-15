 <!-- 命名空间-基本信息 -->
<template>
  <div class="colony-main">
    <div class="tke-card tke-formpanel-wrap">
      <h4  class="tke-formpanel-title">基本信息</h4>
      <el-form  class="tke-form" label-position='left' label-width="120px" size="mini">
        <el-form-item label="名称">
          <div class="tke-form-item_text">default</div>
        </el-form-item>
        <el-form-item label="状态">
          <div class="tke-form-item_text"><span class="text-green">Active</span></div>
        </el-form-item>
        <el-form-item label="描述">
          <div class="tke-form-item_text">-</div>
        </el-form-item>
        <el-form-item label="创建时间">
          <div class="tke-form-item_text">2020-01-02 14:02:22</div>
        </el-form-item>
        <el-form-item label="镜像仓库秘钥">
          <div style="overflow: visible; max-width: 550px;">
            <el-table
              :data="list"
              
              style="width: 100%">
              <el-table-column
                prop="name"
                label="名称"
                 width="300"
                >
              </el-table-column>
              <el-table-column
                prop=""
                label="状态"
                >
                <template slot-scope="scope">
                  <span v-if="scope.row.status===true" class="text-green">已下发 <i class="el-icon-success"></i></span>
                  <span v-else class="text-red">未下发 <i class="el-icon-error"></i></span>
                </template>
              </el-table-column>
              <el-table-column
                prop=""
                label="操作"
                >
                <template slot-scope="scope">
                  <el-tooltip v-if="scope.row.status===true" effect="dark" content="当前密钥已下发，无需再次下发" placement="right">
                    <span  class="text-gray">下发</span>
                  </el-tooltip>
                  <span v-else class="tke-text-link">下发</span>
                </template>
              </el-table-column>
              
            </el-table>
          </div>
        </el-form-item>
        
      </el-form>
    </div>
  </div>
</template>

<script>
import FileSaver from "file-saver";
import XLSX from "xlsx";
import { ALL_CITY } from "@/constants";
export default {
  name: "namespaceDetailInfo",
  data() {
    return {
      list:[
        {
          name:'qcloudregistrykey',
          status:true,
        },
        {
          name:'tencenthubkey',
          status:false,
        },
      ], //列表
        
   
    };
  },
  components: {
   
  },
  created() {
     // 从路由获取类型
   
  },
  methods: {
   
  }
};
</script>

<style lang="scss" scoped>




</style>


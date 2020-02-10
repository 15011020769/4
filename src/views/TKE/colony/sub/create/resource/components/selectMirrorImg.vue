<template>
  <el-dialog title="选择镜像" :visible.sync="visible" class="dialog" :before-close="handleClose" :close-on-click-modal='set'
    :close-on-press-escape='set'>
    <div class="dialog-content">
      <p>
        <el-radio-group v-model="radio" text-color="#000">
          <el-radio label="选择容器服务镜像"></el-radio>
        </el-radio-group>
      </p>
      <el-tabs v-model="activeName" @tab-click="handleClick(activeName)">
        <el-tab-pane label="我的镜像" name="first">
        </el-tab-pane>
        <el-tab-pane label="我的收藏" name="second">
          
        </el-tab-pane>
        <el-tab-pane label="公有镜像" name="third"></el-tab-pane>
        <el-tab-pane label="Docker Hub镜像" name="fourth"></el-tab-pane>
      </el-tabs>
      <div v-show="activeName=='first'||activeName=='third'">
          <el-radio-group v-model="radio1">
            <el-radio-button v-for="(v,i) in city" :key="i" :label="v"></el-radio-button>
          </el-radio-group>
          <p class="wdred">建议您选择与容器集群相同地域的镜像仓库，访问不同地域的镜像仓库受公网网络出入带宽影响。</p>
          <el-input placeholder="请输入镜像名称" class="input-set">
            <i slot="suffix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <el-table  height="300" :data="tableData.slice((currpage - 1) * pagesize, currpage * pagesize)" tooltip-effect="dark" style="width: 100%">
              <el-table-column width="55">
                <template slot-scope="scope">
                  <el-radio v-model="id" :label="scope.row.id">&nbsp;</el-radio>
                </template>
              </el-table-column>
              <el-table-column label="名称" width="120">
                <template slot-scope="scope">{{ scope.row.ID }}</template>
              </el-table-column>
              <el-table-column prop="name" label="类型" width="120">
              </el-table-column>
              <el-table-column prop="address" label="命名空间" >
              </el-table-column>
              <el-table-column prop="address" label="仓库地址" show-overflow-tooltip>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <div class="pagstyle" style="height:70px;">
              <span>共&nbsp;{{ TotalCount }}&nbsp;项</span>
              <div class="pagestyle_right">
                <el-pagination :page-size="pagesize" :pager-count="7" :page-sizes="[50, 40, 30, 20, 10]"
                  layout="sizes, prev, pager, next" @current-change="handleCurrentChange"
                  @size-change="handleSizeChange" :total="TotalCount"></el-pagination>
              </div>
            </div>
      </div>
      <div v-show="activeName=='second'||activeName=='fourth'">
          <el-input placeholder="请输入镜像名称" class="input-set">
            <i slot="suffix" class="el-input__icon el-icon-search"></i>
          </el-input>
     </div>
        <div>  
          <el-table  height="300" :data="tableData.slice((currpage - 1) * pagesize, currpage * pagesize)" tooltip-effect="dark" style="width: 100%">
              <el-table-column width="55">
                <template slot-scope="scope">
                  <el-radio v-model="id" :label="scope.row.id">&nbsp;</el-radio>
                </template>
              </el-table-column>
              <el-table-column label="名称" width="120">
                <template slot-scope="scope">{{ scope.row.ID }}</template>
              </el-table-column>
              <el-table-column prop="name" label="类型" width="120">
              </el-table-column>
              <el-table-column prop="address" label="命名空间" >
              </el-table-column>
              <el-table-column prop="address" label="仓库地址" show-overflow-tooltip>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <div class="pagstyle" style="height:70px;">
              <span>共&nbsp;{{ TotalCount }}&nbsp;项</span>
              <div class="pagestyle_right">
                <el-pagination :page-size="pagesize" :pager-count="7" :page-sizes="[50, 40, 30, 20, 10]"
                  layout="sizes, prev, pager, next" @current-change="handleCurrentChange"
                  @size-change="handleSizeChange" :total="TotalCount"></el-pagination>
              </div>
            </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancle">取 消</el-button>
      <el-button type="primary" @click="sure">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
  export default {
    props: ['dialogVisible'],
    data() {
      return {
        visible: false,
        set: false,
        radio: '选择容器服务镜像',
        radio1: '默认区域',
        activeName: 'first',
        city: ['默认区域', '1', '2', '3', '4', '5', '6', '7', '8'],
        //分页
        tableData: [],
        TotalCount: 0,
        pagesize: 10,
        currpage: 1,
      }
    },
    watch: {
      dialogVisible(val) {
        console.log(val)
        this.visible = val
      }
    },
    mounted() {
      console.log(this.dialogVisible)
    },
    methods: {
      handleClose(done) {
        this.visible = false;
        this.$emit('close', this.visible)

      },
      cancle() {
        this.visible = false;
        this.$emit('close', this.visible)
      },
      sure() {
        this.visible = false;
        this.$emit('close', this.visible)
      },
      handleClick(tab) {
       this.activeName=tab;
      },
      // 改变页数
      handleCurrentChange(val) {
        this.currpage = val;
      },
       handleSizeChange(val) {
        console.log(`每頁 ${val} 條`);
      },
    },
  }

</script>
<style scoped lang="scss">
  /* css */
 
  .dialog>>>.el-dialog {
    height: 100%;
    margin-top: 0px !important;
    position: fixed;
    bottom: 0px;
    top: 0px;
    left: 0px;
    right: 0px;
    overflow: auto;
  }
  .dialog>>>.el-dialog__footer{
         text-align: center !important;   
        }

  .wdred {
    color: red;
  }

  .dialog-content {
    min-height: 500px;
    background: #f2f2f2;
    padding: 10px;
  }
  .input-set>>>input{
      margin: 15px 0px;
      height: 30px;
  }
  .pagstyle {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .pagestyle_right {
      display: flex;
      justify-content: flex-start;

      div {
        span {
          margin-right: 10px;
        }
      }
    }
  }
       
</style>

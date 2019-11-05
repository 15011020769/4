<template>
  <div class="functionCode">
    <div v-if="status==1">
      <div><span style="font-weight:bolder;">函数配置</span><span class="compile" @click="handleCompileClcik">编辑</span></div>
      <div class="messageContent">
        <div style="margin-top:20px;">
          <span class="title-left">函数名称</span class="title-right"><span>see</span>
        </div>
        <div style="margin-top:20px;">
          <span class="title-left">运行角色</span><span>QCS_SCFExcuteRole</span>
        </div>
        <div style="margin-top:20px;">
          <span class="title-left">运行环境</span><span>Python2.7</span>  
        </div>
        <div style="margin-top:20px;">
          <span class="title-left">内存</span><span>128</span>
        </div>
        <div style="margin-top:20px;">
          <span class="title-left">超时时间</span><span>3</span>
        </div>
        <div style="margin-top:20px;">
          <span class="title-left">描述</span><span>helloworld 空白模板函数</span>
        </div>
        <div style="margin-top:20px;">
          <span class="title-left">修改时间</span><span>2019-05-17 15:32:45</span>
        </div>
        <div style="margin-top:20px;">
          <span class="title-left">启用GPU</span><span>未启用</span>
        </div>
        <div style="margin-top:20px;">
          <span class="title-left">标签</span>
          <!--<el-tooltip class="item" effect="light" content="修改标签" placement="bottom-start">
            <span><i class="el-icon-edit" style="cursor:pointer;" @click="changeShow"></i></span>
          </el-tooltip>-->
          <el-popover
            placement="bottom-start"
            width="40"
            trigger="hover"
            content="修改标签">
            <i slot="reference" class="el-icon-edit" style="cursor:pointer;" @click="changeShow"></i>
          </el-popover>
        </div>
      </div>
    </div>
    <div v-if="status==2">
      <el-form ref='primaryData' :model="primaryData" :hide-required-asterisk= 'true' :label-position="labelPosition" label-width="90px" style="border-bottom: 1px solid #ccc;">
        <el-row style="margin-bottom: 20px;">
          <el-col :span="12">
            <span class="leftLocation">
              <span style="font-size: 12px;">函数名</span>
            </span>
            <span>{{primaryData.funcname}}</span> 
          </el-col>
          <el-col :span="12">
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 20px;">
          <el-col :span="12">
            <span class="leftLocation">
              <span style="font-size: 12px;">运行角色</span>
              <i class="el-icon-warning-outline" style="position: relative;"></i>
            </span>
            <el-select v-model="primaryData.role" placeholder="" size="mini">
              <el-option
                v-for="item in projectContent.addressList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <i class="el-icon-refresh" style="margin-left: 5px;font-weight: bolder;" @mouseover="refresh"></i>
            <span class="explain">此角色将用于授权函数运行时操作其他资源的权限。您可以<a href="" target="_blank">新建角色</a>或对角色<a href="" target="_blank">修改权限</a></span>
          </el-col>
          <el-col :span="12">
          </el-col>
        </el-row> 
        <el-row style="margin-bottom: 20px;">
          <el-col :span="12">
            <span class="leftLocation">
              <span style="font-size: 12px;">运行环境</span> 
            </span>
            <span>111</span>
          </el-col>
          <el-col :span="12">
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 20px;">
          <el-col :span="12">
            <span class="leftLocation">
              <span style="font-size: 12px;">内存</span>
              <i class="el-icon-warning-outline"></i>  
            </span>
            <el-select style="width: 100px;" v-model="primaryData.neicun" placeholder="" size="mini">
              <el-option
                v-for="item in projectContent.networkList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="12">
          </el-col>
        </el-row> 
        <el-row style="margin-bottom: 20px;">
          <el-col :span="12">
            <span class="leftLocation">
              <span style="font-size: 12px;">超时时间</span>
              <i class="el-icon-warning-outline"></i>   
            </span>
            <el-input size="mini" style="width: 200px" v-model="primaryData.time"></el-input><span style="background: #f2f2f2;padding: 4px 10px;">秒</span>
            <span style="display: block;margin:10px 90px;font-size: 12px;">1-300秒</span>
          </el-col>
          <el-col :span="12">
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="描述" prop='describe'>
              <el-input
                type="textarea"
                :rows="5"
                placeholder=""
                v-model="primaryData.miaoshu">
              </el-input>
              <span style="font-size: 12px; color: #bbb;">最大支持1000个英文字母、数字、空格、逗号、句号、中文</span>
            </el-form-item>
          </el-col>
          <el-col :span="16">
          </el-col>
        </el-row>
        <div class='environment'>
          <span class='environment-title'>
            <span>环境变量</span>
            <i class="el-icon-warning-outline"></i>
          </span>
          <div class='environment-content'>
            <el-table :data="primaryData.spaceControl">
              <el-table-column label="key" min-width="180">
                <template slot-scope="scope">
                  <el-input size="mini" placeholder="请输入环境变量" v-model='primaryData.spaceControl[scope.$index].space' style="width: 150px;"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="value" min-width="180">
                <template slot-scope="scope">
                  <el-input size="mini" placeholder="请输入环境变量的值" v-model='primaryData.spaceControl[scope.$index].desc' style="width: 150px;"></el-input>
                </template>                  
              </el-table-column>
              <el-table-column label="" min-width="40">
                <template slot-scope="scope">
                  <i class='el-icon-close' @click="closeenvironment(scope.$index, primaryData.spaceControl)"></i>
                </template>                  
              </el-table-column>
            </el-table>
            <a class="add-variable" @click="addVariable">新增变量</a>
          </div>
        </div>
        <el-row style="margin-bottom: 20px;">
          <el-col :span="16">
            <span class="leftLocation">
              <span style="font-size: 12px;">网络配置</span>
              <i class="el-icon-warning-outline" style="position: relative;"></i>
            </span>
            <el-select v-model="primaryData.role" placeholder="" size="mini">
              <el-option
                v-for="item in projectContent.addressList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-select v-model="primaryData.role" placeholder="" size="mini" style="width: 120px;">
              <el-option
                v-for="item in projectContent.addressList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <span style="display: block;margin-left: 90px;font-size:12px;color:#888;margin-top:15px;">请选择私有网络请选择子网如现有的网络不合适，您可以去控制台<a>新建私有网络<i class="el-icon-edit-outline" style="padding: 0 3px;"></i></a><a>新建子网<i class="el-icon-edit-outline" style="padding: 0 3px;"></i></a>
            </span>
          </el-col>
          <el-col :span="8">
          </el-col>
        </el-row> 
        <el-row style="margin-bottom: 20px;">
          <el-col :span="12">
            <span class="leftLocation">
              <span style="font-size: 12px;">标签</span>
            </span>
            <i class="el-icon-edit" style="cursor: pointer;" @click="changeShow"></i>
          </el-col>
          <el-col :span="12">
          </el-col>
        </el-row> 
      </el-form>
      <div style="margin-top: 20px;">
        <el-button size="mini" type="primary" @click="save(1)">保存</el-button>
        <el-button size="mini" @click='save(0)'>取消</el-button>
      </div>
    </div>
    <compile :compiledialog="compiledialog" v-on:changeClose="changeClose"></compile>
  </div>
</template>

<script>
import compile from "./functionconfigue/compile.vue";
export default {
  data() {
    return {
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
      }],
      labelPosition: 'left',
      status: 1,
      primaryData: {
        funcname: 'dgffs122212',
        role: '',
        neicun: '',
        time: '',
        miaoshu: '',
        spaceControl: [{
          space: '',
          desc: ''
        }],
      },

      projectContent: {
        addressList: [{
          value: '1',
          label: 'SCF_QcsRole'
        }, {
          value: '2',
          label: 'SCF默认运行角色'
        }],
        typeList: [{
          value: '1',
          label: '在线编辑'
        }],
        networkList: [{
          value: '1',
          label: '128M'
        }, {
          value: '2',
          label: '256M'
        }],
      },
      compiledialog: false,
    };
  },
  mounted() {
  },
  computed: {
  },
  components: {
    compile
  },
  methods: {
    close(value) {
      this.$emit("deleteClose",value);
    },
    handleCompileClcik() {
      this.status = 2;
    },
    save(val) {
      this.status = 1;
      if(val==1) {

      }else {

      }
    },
    refresh() {

    },
    //新增环境变量
    addVariable() {
      let obj = {
        space: '',
        desc: ''
      }
      this.primaryData.spaceControl.push(obj);
    },
    closeenvironment(index, rows) {
      rows.splice(index, 1);
    },
    changeShow() {
      this.compiledialog = true;
    },
    changeClose(val) {
      this.compiledialog=false;      
      if(val==1) {

      }else {

      }
    }
  }
};
</script>

<style scoped lang="scss">
  .functionCode {
    padding: 20px;
    background: #fff;
  }
  .messageContent {
    font-size: 12px;
  }
  .title-left {
    display: inline-block;
    width: 80px;
    color: #888;
  }
  .compile {
    float: right;
    display: inline-block;
    padding: 5px;
    font-size: 12px;
    color: #006eff;
  }
  .compile:hover {
    background: #f2f2f2;
    cursor: pointer;
  }
  
  .funcdeploy {
    margin-bottom: 20px;
    border-bottom: 1px solid #f2f2f2;
  }
  .leftLocation {
    display: inline-block;
    width: 90px;
    color: #8f8f8f;
  }
  .el-icon-warning-outline {
    margin-left: 3px;
    font-weight: bolder;
  }
  .el-select {
    width: 160px;
  }
  .explain {
    display: block;
    margin-top: 5px;
    font-size: 12px;
    margin-left: 90px;
    color: #8f8f8f;
  }
  .code-show {
    width: 600px;
    height: 500px;
    margin: 20px 90px;
    overflow-y: scroll;
  }
  .text {
    height: 700px;
    background: #f2f2f2;
    width: 100%;
  }
  .tip {
    display: none;
    width: 400px;
    position: absolute;
    z-index: 11;
    background: #fff;
    font-size: 12px;
    padding: 12px;
    border: 1px solid #ccc;
    left: -40px;
    top: -100px;
  }
  .add-variable {
    display:block;
    font-size:12px;
    padding: 20px;
    cursor: pointer;
  }
  .environment {
    position: relative;
    margin-bottom: 20px;
  }
  .environment-title {
    position: absolute;
    top: 0;
  }
  .environment-title span{
    font-size:12px;color:#888;
  }
  .environment-content {
    display:inline-block;
    background: #fff; 
    border:1px solid #ddd;
    position: relative;
    left: 90px;
  }
  .el-icon-close {
    font-size: 20px;
    font-weight: bolder;
    opacity: 0.8;
    cursor: pointer;
  }
</style>
<style>
  .el-form-item__label {
    color: #888;
    font-size: 12px;
  }
</style>

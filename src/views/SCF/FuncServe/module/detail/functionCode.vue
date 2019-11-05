<template>
  <div class="functionCode">
    <div>
      <span style="margin-right: 30px;">
        <span class="titlename">提交方法<i class="el-icon-question"></i></span>
        <el-select v-model="searchthing.submitmethod" placeholder="" size="mini" style="width:160px;">
          <el-option
            v-for="item in submitList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </span>
      <span style="margin-right: 30px;">
        <span class="titlename">执行方法<i class="el-icon-question"></i></span>
        <el-input v-model="searchthing.executemethod" size="mini" style="width: 180px;"></el-input>
      </span>
      <span style="margin-right: 30px;">
        <span class="titlename" style="margin-right: 10px;">运行环境
        {{searchthing.runenvironment}}
        </span>
      </span>
      <span style='float:right;'>
        <div class="laguage">Python2.7语言说明</div>
        <span class="laguage" style="float:right;">下载代码包</span>
      </span>
    </div>
    <div v-show="searchthing.submitmethod==1">
      <div class="code-show">
        <div class="text"
          v-html="innerText"
          :contenteditable="canEdit"
          @input="changeText">
        </div>
      </div>
    </div>
    <div v-show="searchthing.submitmethod==2"  style="margin-top: 20px;">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="函数代码" class="codename">
          <el-upload class="upload-demo" style="width:200px;"
            :file-list="fileList"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-preview="handlePreview"
            :on-remove="handleRemove">
            <el-button size="mini">上传</el-button>
          </el-upload>  
        </el-form-item>
      </el-form>
    </div>
    <div v-show="searchthing.submitmethod==3">
      <span style="margin-right: 30px;">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="函数代码" class="codename">
            <el-upload class="upload-demo" style="width:200px;"
              :file-list="fileList"
              action="https://jsonplaceholder.typicode.com/posts/"
              :on-preview="handlePreview"
              :on-remove="handleRemove">
              <el-button size="mini">上传</el-button>
            </el-upload>  
          </el-form-item>
        </el-form>
      </span>
    </div>
    <div v-show="searchthing.submitmethod==4">
      <span style="margin-right: 30px;">
        <div>
          <span class="titlename">COS Bucket<i class="el-icon-warning"></i></span>
          <el-select v-model="bucket" placeholder="" size="mini" style="width:160px;">
            <el-option
              v-for="item in bucketList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div style="margin-top:20px;">
          <span class="titlename">COS对象文件<i class="el-icon-warning"></i></span>
          <el-input size="mini" style="width: 200px" v-model="filepath" placeholder="请输入cos对象文件路径"></el-input>

        </div>
      </span>
    </div>
    <div style="padding-bottom: 40px;border-bottom: 1px solid #ccc;">
    </div>
    <div class="footer-button">
      <el-button size="mini" type="primary" @click="save">保存</el-button>
      <el-button v-if='searchthing.submitmethod==1' size="mini" @click="savetest(1)">保存并测试</el-button>
      <el-button v-else size="mini" @click="savetest(2)">测试</el-button>
      <span style="font-size:12px;padding:0 10px;color:#888;">当前测试模版</span>
      <span style="padding:0 10px;">{{searchthing.template}}</span>
      <span class="change" @click="showreplace">更换</span>
      <span class="change" @click="showallocation">配置</span>
    </div>
    <div v-show="teststatus">
      <div style="font-weight:bolder;margin-top:20px;">测试结果：<span style="color:#0abf5b;">成功</span></div>

      <div style="margin-top:20px;background:#f2f2f2;padding:10px 0;border-left:10px solid #d2e7f7;">
        <div style="margin-left:20px;">返回结果<div>"hello from scf"</div></div>
      </div>
      <div style="margin-top:20px;">
        <div style="float:left;width:300px;height:300px;background:#f2f2f2;padding:10px;border-left:10px solid #d2e7f7;font-size:12px;">
          <span style="color:#006eff;">摘要</span>
          <span style='display:block;'><span style="color:#006eff;">请求ID:</span><span>a35e853e-7c74-11e9-8560-525400365aa2</span></span>
          <span style='display:block;'><span style="color:#006eff;">运行时间:</span><span>0.2199999988079071ms</span></span>
          <span style='display:block;'><span style="color:#006eff;">计费时间:</span><span>100ms</span></span>
          <span style='display:block;'><span style="color:#006eff;">占用内存:</span><span>0.12109375MB</span></span> 
        </div>
        <div style="margin-left:360px;height:300px;background:#f2f2f2;padding:10px;border-left:10px solid #d2e7f7;font-size:12px;">
          <div style="color:#006eff;">日志:</div>
          <div>
            START RequestId: a35e853e-7c74-11e9-8560-525400365aa2
            Event RequestId: a35e853e-7c74-11e9-8560-525400365aa2
            Start Hello World function
            Hello World
            value1 = test value 1
            value2 = test value 2
            END RequestId: a35e853e-7c74-11e9-8560-525400365aa2
            Report RequestId: a35e853e-7c74-11e9-8560-525400365aa2 Duration:0.22ms Memory:128MB MaxMemoryUsed:0.121094MB
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      :visible.sync="replacedialog"
      width="50%"
      center
      :show-close="false">
      <div slot="title" class="title-wrap"><span style='font-weight: bolder;'>更换测试模版</span><i class="el-icon-close" @click="closereplace(2)"></i></div>
      <span style="color:#888;">测试事件模版<i class="el-icon-info" style="margin-left:5px;"></i></span>
      <el-select v-model="replaceboard" placeholder="" size="mini" style="margin:0 5px;">
        <el-option
        v-for="item in replaceboardList"
        :key="item.value"
        :label="item.label"
        :value="item.value">
        </el-option>
      </el-select>
      <div>
      <div class="moduleborad">
        <div class="text"
          v-html="innerText"
          :contenteditable="canEdit"
          @input="changeText">
        </div>
      </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="closereplace(1)">提交</el-button>
        <el-button size="mini" @click="closereplace(2)">关闭</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="allocationdialog"
      width="50%"
      center
      :show-close="false">
      <div slot="title" class="title-wrap"><span style='font-weight: bolder;'>配置测试模版</span><i class="el-icon-close" @click="closeallocation(2)"></i></div>
      <div class="tabTitle">
        <span :class="['tab',showIndex==1?'active':'']" @click="handleClick(1)">新建模板</span>
        <span :class="['tab',showIndex==2?'active':'']" @click="handleClick(2)">删除模板</span>
      </div>
      <div v-show='showIndex==1'>
        <el-form ref='primaryData' :model="primaryData" :rules="rules" :label-position="labelPosition" label-width="100px">
          <el-form-item prop="" >
            <span slot="label" style="color:#888;font-size:12px;">测试事件模板</span>
            <el-input v-model="primaryData.modulename" size="mini" style="width:200px;"></el-input>
          </el-form-item>
          <el-form-item prop="triggerway" >
            <span slot="label" style="color:#888;font-size:12px;">引用模板代码</span>
            <el-select v-model="primaryData.modulecheckname" placeholder="" size="mini">
              <el-option
                v-for="item in moduleList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div class="moduleborad">
          <div class="text"
            v-html="innerText"
            :contenteditable="canEdit"
            @input="changeText">
          </div>
        </div>
      </div>
      <div v-show='showIndex==2'>
        <div style="line-height:40px;background:#f2f2f2;border:1px solid #ccc;font-size:12px;padding-left:20px;">您还没有<span style="color:#006eff;cursor:pointer;" @click="showIndex=1">创建</span>自定义的事件模版</div>
        <el-form ref='primaryData' :model="primaryData" :rules="rules" :label-position="labelPosition" label-width="100px">
          <el-form-item prop="triggerway" >
            <span slot="label" style="color:#888;font-size:12px;">删除模板代码</span>
            <el-select v-model="primaryData.modulecheckname" placeholder="请选择" size="mini">
              <el-option
                v-for="item in moduleList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="closeallocation(1)">提交</el-button>
        <el-button size="mini" @click="closeallocation(2)">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fileList: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}],
      searchthing: {
        submitmethod: '2',
        executemethod: 'index.main_handler',
        runenvironment: 'Python2.7',
        template: 'Ckafka 事件模版'
      },
      submitList: [{
        value: '1',
        label: '在线编译'
      }, {
        value: '2',
        label: '本地上传zip包'
      },{
        value: '3',
        label: '本地上传文件夹'
      },{
        value: '4',
        label: '通过cos上传zip包'
      }],
      innerText: '',
      labelPosition: "left",
      bucketList: [{
        value: '1',
        label: '请选择COS Bucket'
      }],
      bucket: '',
      filepath: '',
      replacedialog: false,
      allocationdialog: false,
      replaceboard: '',
      replaceboardList: [{
        value: '1',
        label: '事件模板1'
      },{
        value: '2',
        label: '事件模板2'
      },{
        value: '3',
        label: '事件模板3'
      }],
      showIndex: 1,
      labelPosition: 'left',
      primaryData: {
        modulename: '',
        modulecheckname: ''
      },
      moduleList: [
        {
        value: '1',
        label: '模板名称1'
      },{
        value: '2',
        label: '模板名称2'
      }],
      teststatus: false
    };
  },
  mounted() {
  },
  components: {
  },
  methods: {
    changeText() {

    },
    handleRemove(file, fileList) {
      // console.log(file, fileList);
    },
    handlePreview(file) {
      // console.log(file);
    },
    handleExceed(files, fileList) { 
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },
    save() {

    },
    savetest(val) {
      this.teststatus = true;
    },
    showreplace() {
      this.replacedialog = true;
    },
    closereplace() {
      this.replacedialog = false;
    },
    showallocation() {
      this.allocationdialog = true;
    },
    closeallocation() {
      this.allocationdialog = false;
    },
    handleClick(val) {
      this.showIndex = val;
    }
  }
};
</script>

<style scoped lang="scss">
  .functionCode {
    padding: 20px;
    background: #fff;
  }
  .titlename {
    font-size: 12px;
    color: #888;
    margin-right:10px;
  }
  .el-icon-question {
    margin-left: 3px;
    font-size: 16px;
  }
  .laguage {
    font-size: 12px;
    color: #006eff;
  }
  .laguage:hover {
    border-bottom: 1px solid #006eff;
    cursor: pointer;
  }
  .code-show {
    width: 100%;
    height: 500px;
    overflow-y: scroll;
  }
  .text {
    height: 700px;
    background: #f2f2f2;
    width: 100%;
  }
  .footer-button {
    margin-top: 30px;
  }
  .change {
    font-size:12px;
    margin-left:10px;
    color: #006eff;
  }
  .change:hover {
    cursor: pointer;
    border-bottom: 1px solid #006eff;
  }

  .title-wrap {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    font-weight: bolder;
  }
  .title-wrap>i {
    font-size: 16px;
    font-weight: 900;
  }
  .el-icon-close {
    padding: 5px;
    color: #9c9c9c;
  }
  .el-icon-close:hover {
    background: #f2f2f2;
    cursor: pointer;
  }
  .moduleborad {
    width: 100%;
    height: 300px;
    margin-top: 10px;
    overflow-y: scroll;
  }
  .tabTitle {
    background: #fff;
    height: 20px;
    line-height: 10px;
    border-bottom: 1px solid #ccc;
  }
  .tab {
    padding: 5px 10px;
    margin: 10px 5px;
    cursor: pointer;
  }
  .active {
    border-bottom: 2px solid #006eff;
    font-weight: bolder;
  }
</style>
<style>
.codename /deep/ .el-form-item__label {
  color: #888;
  font-size: 12px;
}
</style>

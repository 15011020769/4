<template>
  <div id="addAccessModel">
    <div>
      <el-dialog
        class="addAccessModel"
        :title="$t('DDOS.accessCopy.AddAsk')"
        :visible.sync="dislogModelShow"
        width="40%"
        :before-close="handleClose">
        <div>
          <div class="topBlueAcc">
            {{$t('DDOS.accessCopy.AddAskTitle')}}
          </div>
          <div class="formList">
            <div class="newClear">
              <p>{{$t('DDOS.accessCopy.strageName')}}</p>
              <p>
                <el-input class="accessName" :placeholder="$t('DDOS.accessCopy.searchStarge')"></el-input>
              </p>
            </div>
            <div class="newClear">
              <p>{{$t('DDOS.accessCopy.agreement')}}</p>
              <p>
                <el-radio label="HTTP" v-model="accessRadio" value="HTTP"></el-radio>
              </p>
            </div>
            <div class="newClear">
              <p>模式</p>
              <p>
                <el-radio-group v-model="modelCheck">
                  <el-radio label="1">匹配模式</el-radio>
                  <el-radio label="2">限速模式</el-radio>
                </el-radio-group><br/>
                <span v-if="modelCheck=='1'?false:true" class="executionSpan">{{$t('DDOS.accessCopy.speedModelTitle')}}</span>
              </p>
            </div>
            <div class="newClear" v-if="modelCheck=='1'?false:true">
              <p>策略</p>
              <p>{{$t('DDOS.accessCopy.ipAsk')}}<el-input class="xiansuNub" v-model="number"></el-input>{{$t('DDOS.accessCopy.askTime')}}</p>
            </div>
            <div class="newClear" v-if="modelCheck=='1'?true:false">
              <p>策略</p>
              <p>
                <table class="">
                  <tr class="t-body" v-for="(item, index) in tags3" :key="index">
                    <td>{{item.dang}}</td>
                    <td width="110px">
                      <el-select v-model="item.hoseDomin" class="hoseDomin">
                        <el-option label="host" value="host"></el-option>
                        <el-option label="CGI" value="CGI"></el-option>
                        <el-option label="user_agent" value="user_agent"></el-option>
                        <el-option label="referer" value="referer"></el-option>
                      </el-select>
                    </td>
                    <td width="90px">
                      <el-select v-model="item.relese" class="relese">
                        <el-option label="包含" value="contain"></el-option>
                        <el-option :label="$t('DDOS.accessCopy.equalTo')" value="unequal"></el-option>
                        <el-option :label="$t('DDOS.accessCopy.noEqua')" value="equal"></el-option>
                      </el-select>
                    </td>
                    <td width="150px">
                      <el-input class="iptText"></el-input>{{$t('DDOS.accessCopy.when')}}
                    </td>
                    <td>
                      <a v-on:click="removeRow(index,3)" v-show="index >= 0">{{item.delete}}</a>
                    </td>
                  </tr>
                </table>
                <a v-on:click="addRow(3,tags3.length)" v-if="tags3.length<'4'?true:false">+添加一行</a>
              </p>
            </div>
            <div class="newClear" v-if="modelCheck=='1'?true:false">
              <p>{{$t('DDOS.accessCopy.perform')}}</p>
              <p>
                <el-select v-model="execution">
                  <el-option :label="$t('DDOS.accessCopy.intercept')" value='1'></el-option>
                  <el-option :label="$t('DDOS.accessCopy.identification')" value="2"></el-option>
                </el-select>
                <span class="executionSpan" v-if="execution=='2'?true:false">{{$t('DDOS.accessCopy.identificationTitle')}}</span>
              </p>
            </div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="addAccessSureBtn">{{$t('DDOS.accessCopy.domainSure')}}</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
export default {
  props:{
    isShow:Boolean
  },
  data(){
    return{
      dialogVisible:'',//弹框
      accessRadio:'HTTP',//协议
      modelCheck:'1',//模式
      execution:'1',//执行
      number:'0',//限速模式策略
      tags3:[
        {
          dang:'当',
          hoseDomin:'host',
          relese:'包含',
          delete:''
        }
      ],
    }
  },
  computed:{
    dislogModelShow(){
      this.dialogVisible=this.isShow;
      return this.isShow;
    }
  },
  methods:{
    //弹框关闭按钮
    handleClose(){
      this.dialogVisible=false;
      this.$emit("closeDialogModel",this.dialogVisible)
    },
    //添加访问控制策略确定按钮
    addAccessSureBtn(){
      this.dialogVisible=false;
      this.$emit("addAccessContSure",this.dialogVisible)
    },
    copyObj: function () {
      var des = {
        dang:'且当',
        hoseDomin:"",
        relese:"包含",
        delete:'删除'
      }
      return des
    },
    //新增一行
    addRow: function (type,length) {
      var des = this.copyObj();
      if(length==1){
        des.hoseDomin='CGI';
        this.tags3.push(des)
      }else if(length==2){
        des.hoseDomin='user_agent';
        this.tags3.push(des)
      }else if(length==3){
        des.hoseDomin='referer';
        this.tags3.push(des)
      }
    },
    // 删除一行
    removeRow: function (idx,typeNode) {
      this.tags3.splice(idx, 1);
    }
  }
}
</script>
<style lang="scss">
#addAccessModel{
  .addAccessModel{
    .el-dialog__title{
      font-size:14px;
      font-weight:600;
    }
    .dialog-footer{
      text-align:center;
    }
    .topBlueAcc{
      font-size: 12px;
      line-height: inherit;
      padding: 10px 30px 10px 20px;
      vertical-align: middle;
      color: #003b80;
      border: 1px solid #97c7ff;
      margin-bottom: 20px;
      background: #e5f0ff;
    }
    .formList{
      div{
        margin-bottom:10px;
        p:nth-child(1){
          font-size:12px;
          color:#999;
          float:left;
          width:70px;
        }
        p:nth-child(2){
          float:left;
          width:calc(100% - 70px);
        }
        .accessName{
          width:200px;
          height:30px;
          input{
            width:100%;
            height:30px;
            border-radius: 0;
            font-size:12px;
          }
        }
        .executionSpan{
          color:#DF9500;
          font-size:12px;
          margin-left:20px;
        }
        .hoseDomin{
          width:100px;
          div{
            width:100px;
            input{
              width:100px;
            }
          }
        }
        .relese{
          width:80px;
          div{
            width:80px;
            input{
              width:80px;
            }
          }
        }
        .iptText{
          width:120px;
          margin-right:10px;
          input{
            width:120px;
          }
        }
      }
    }
  }
}
</style>
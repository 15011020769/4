<template>
  <div id="addUrlModel">
    <div>
      <el-dialog
        title="添加IP"
        :visible.sync="dialogVisible1"
        width="45%"
        :before-close="handleClose">
        <div class="newClear">
          <div class="httpCheck newClear">
            <span class="checkSpan1">{{$t('DDOS.Proteccon_figura.Agreement')}}</span>
            <span class="checkSpan2">
              <el-radio-group v-model="httpCheck">
                <el-radio label="HTTP"></el-radio>
                <el-radio label="HTTPS"></el-radio>
              </el-radio-group>
            </span>
          </div>
          <div class="blueTip">
           {{$t('DDOS.Proteccon_figura.IP_address')}}
          </div>
          <div class="addUrlBox">
            <h3>IP地址</h3>
            <div class="tableUrl">
              <table class="tableCon">
                <!-- <tr class="t-head">
                  <td></td>
                  <td></td>
                </tr> -->
                <tr class="bodyCon" v-for="(item, index) in tags5" :key="index">
                  <td>
                    <el-input class="inputChange" placeholder="请输入IP" v-model="item.urlAddress" autocomplete="off"></el-input>
                  </td>
                  <td>
                    <a v-on:click="removeRow(index)" v-show="index >= 0">{{$t('DDOS.Proteccon_figura.Delete')}}</a>
                  </td>
                </tr>
              </table>
            </div>
            <a v-on:click="addRow()" class="addNewRowUrl">添加IP</a>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="addIpBlackSure">{{$t('DDOS.Proteccon_figura.Determination')}}</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
export default {
  props:{
    isShow1:Boolean
  },
  computed:{
    dialogVisible1(){
      this.dialogVisible=this.isShow1
      return this.isShow1
    }
  },
  data(){
    return{
      dialogVisible:'',//弹框状态
      httpCheck:'HTTP',//协议
      tags5:[
        {
          urlAddress:""
        }
      ],
    }
  },
  methods:{
    //关闭按钮
    handleClose(){
      this.dialogVisible=false;
      this.$emit("closeModel1",this.dialogVisible)
    },
    copyObj: function () {
      var des = {
        urlAddress:""
      }
      return des
    },
    //新增一行
    addRow: function () {
      var des = this.copyObj()
      this.tags5.push(des)
    },
    // 删除一行
    removeRow: function (idx) {
      this.tags5.splice(idx, 1)
    },
    //确定按钮
    addIpBlackSure(){
      this.dialogVisible=false;
      this.$emit("addIpBlackSure",this.dialogVisible)
    }
  }
}
</script>
<style lang="scss" scoped>


</style>
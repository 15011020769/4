<template>
  <!-- 防护配置-CC防护-IP白名单-添加IP -->
  <div id="addUrlModel">
    <div>
      <el-dialog
        title="添加IP"
        :visible.sync="dialogVisible1"
        width="45%"
        :before-close="handleClose"
      >
        <div class="newClear">
          <div class="httpCheck newClear">
            <span class="checkSpan1">{{$t('DDOS.Proteccon_figura.Agreement')}}</span>
            <span class="checkSpan2">
              <el-radio-group v-model="httpCheck">
                <el-radio label="HTTP"></el-radio>
                <el-radio label="HTTPS" disabled></el-radio>
              </el-radio-group>
            </span>
          </div>
          <div class="blueTip" v-if="checkNumFlg == true">{{$t('DDOS.Proteccon_figura.IP_address')}}</div>
          <p class="tc-15-msg error" v-if="checkNumFlg == false">
            {{$t('DDOS.Proteccon_figura.UrlNumWarning')}}
          </p>
          <div class="addUrlBox">
            <h3>IP地址</h3>
            <div class="tableUrl">
              <table class="tableCon">
                <!-- <tr class="t-head">
                  <td></td>
                  <td></td>
                </tr>-->
                <tr class="bodyCon" v-for="(item, index) in tags5" :key="index">
                  <td>
                    <el-input
                      class="inputChange"
                      :placeholder="$t('DDOS.Proteccon_figura.qsrip')"
                      v-model="item.urlAddress"
                      autocomplete="off"
                    ></el-input>
                  </td>
                  <td>
                    <a
                      v-on:click="removeRow(index)"
                      v-show="tags5.length > 1"
                    >{{$t('DDOS.Proteccon_figura.Delete')}}</a>
                  </td>
                </tr>
              </table>
            </div>
            <a v-on:click="addRow()" class="addNewRowUrl">添加IP</a>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button
            type="primary"
            @click="addIpWhiteSure"
          >{{$t('DDOS.Proteccon_figura.Determination')}}</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { CCIPALLOWDENY_MODIFY } from "@/constants";
export default {
  props: {
    ccResourceId: String, //资源ID
    isShow1: Boolean
  },
  computed: {
    dialogVisible1() {
      this.dialogVisible = this.isShow1;
      return this.isShow1;
    }
  },
  watch: {
    ccResourceId(val) {
      this.ccResourceId = val;
    }
  },
  data() {
    return {
      checkNumFlg: true,
      dialogVisible: "", //弹框状态
      httpCheck: "HTTP", //协议
      method: "add", //add表示添加，delete表示删除
      tags5: [
        {
          urlAddress: ""
        }
      ]
    };
  },
  methods: {
    // 1.1.添加或删除CC的URL白名单
    modifyCCIpAllowDeny() {
      let params = {
        Version: "2018-07-09",
        Region: localStorage.getItem("regionv2"),
        Business: "net",
        Id: this.ccResourceId,
        Method: this.method, //add表示添加，delete表示删除
        Type: "white"
      };
      for (let i = 0; i < this.tags5.length; i++) {
        if (this.tags5[i].urlAddress != "") {
          params["IpList." + i] = this.tags5[i].urlAddress;
        }
      }
      if (params["IpList.0"] != undefined) {
        this.axios.post(CCIPALLOWDENY_MODIFY, params).then(res => {
          if (res.Response.Error) {
            if (this.method == "delete") {
              this.$message.error("刪除失敗");
            } else if (this.method == "add") {
              if (res.Response.Error.Code == "InvalidParameterValue") {
                this.$message.error("添加失敗，參數錯誤");
              } else {
                this.$message.error("添加失敗");
              }
            }
          } else {
            if (this.method == "delete") {
              this.$message({
                message: "刪除成功",
                type: "success"
              });
            } else if (this.method == "add") {
              this.$message({
                message: "添加成功",
                type: "success"
              });
            }
          }
        });
      }
    },
    //关闭按钮
    handleClose() {
      this.tags5 = [{urlAddress: ""}];
      this.dialogVisible = false;
      this.$emit("closeModel1", this.dialogVisible);
    },
    copyObj: function() {
      var des = {
        urlAddress: ""
      };
      return des;
    },
    //新增一行
    addRow: function() {
      this.checkNumFlg = true;
      var des = this.copyObj();
      this.tags5.push(des);
      if (this.tags5.length > 50) {
        this.checkNumFlg = false;
      }
    },
    // 删除一行
    removeRow: function(idx) {
      this.tags5.splice(idx, 1);
      if (this.tags5.length > 50) {
        this.checkNumFlg = false;
      } else {
        this.checkNumFlg = true;
      }
    },
    //确定按钮
    addIpWhiteSure() {
      if (!this.checkNumFlg) {
        return
      }
      this.modifyCCIpAllowDeny();
      this.dialogVisible = false;
      this.$emit("addIpWhiteSure", this.dialogVisible);
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
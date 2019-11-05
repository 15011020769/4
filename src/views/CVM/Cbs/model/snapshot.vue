<template>
  <div class="Cbs-snapshot">
    <el-dialog
      :visible.sync="snapshotShow"
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      :show-close='false'
      width="480px"
      center>
      <div slot="title"
        class="title-wrap">
        <span>创建快照</span>
        <i class="el-icon-close"
          @click="close"></i>
      </div>
      <div class="snapshot-xin">
        <p>为了保证快照能完整的捕获硬盘数据内容，建议制作快照前，进行以下操作：</p>
        <p>数据库业务：Flush & Lock Table</p>
        <p>文件系统：Sync 操作，将内存数据强制刷入硬盘内</p>
        <p>云硬盘快照已于2019年1月22日0点启动正式商业化， 查看快照用量和预估费用请前往快照概览，详细请查看 商业化公告</p>
      </div>
      <ul>
        <li>
          <p>云硬盘ID</p>
          <div>{{Cbsdata.DiskId}}</div>
        </li>
        <li>
          <p>云硬盘名称</p>
          <div>
            {{Cbsdata.DiskName}}
          </div>
        </li>
        <li>
          <p>硬盘容量</p>
          <div>
            {{Cbsdata.DiskSize}}GB
          </div>
        </li>
        <li>
          <p>硬盘类型</p>
          <div>
            {{Cbsdata.DiskType|Toconfigurefilter()}}
          </div>
        </li>
        <li>
          <p>快照名称</p>
          <div class="input-style">
            <el-input v-model="snapshotinput" @input='changeinput'
              placeholder=""></el-input>
              <span v-if="numok">还可输入{{Num}}个字符</span>
               <span class="span-color-num" v-if="numno">你已超过{{60-Num-60}}个字符</span>
          </div>
        </li>
      </ul>
      <span slot="footer"
        class="dialog-footer">
        <el-button type="primary" :disabled="numdis"
          @click="snapshot">确 定</el-button>
        <el-button @click="close">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    snapshotShow: Boolean,
    Cbsdata: Object
  },
  data () {
    return {
      snapshotinput: '',
      Num: 60, // 默认最低输入60
      numok: true, // <=60字
      numno: false, // >60字
      numdis: false
    }
  },
  components: {},
  created () {
    console.log(this.Cbsdata)
  },
  methods: {
    changeinput (value) {
      this.Num = 60 - value.length
      if (this.Num < 0) {
        this.numok = false
        this.numno = true
        this.numdis = true
      } else {
        this.numok = true
        this.numno = false
        this.numdis = false
      }
    },
    // 取消
    close () {
      this.$emit('snapshotShow', false)
    },
    // 创建快照确定
    snapshot () {
      var parms = {
        Version: '2017-03-12',
        Region: this.$cookie.get('regionv2'),
        SnapshotName: this.snapshotinput,
        DiskId: this.Cbsdata.DiskId

      }
      this.axios.post('cbs2/CreateSnapshot', parms).then(data => {
        if (data.Response.Error === undefined) {
          this.$emit('snapshotShow', false)
          this.$message({
            message: '创建快照成功',
            type: 'success'
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" >
.Cbs-snapshot {
  .title-wrap {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    span {
      font-weight: bolder;
    }
    i {
      font-size: 16px;
      font-weight: 900;
      cursor: pointer;
    }
  }
  .el-dialog__body {
    font-size: 12px;
    line-height: 20px;
    .snapshot-xin {
      background-color: #fff4e3;
      color: #c07400;
      border: 1px solid #ffd18b;
      padding: 10px 30px 10px 20px;
    }
    ul {
      li {
        display: flex;
        padding: 10px 0;
        p {
          width: 25%;
        }
        a {
          padding-left: 20px;
          cursor: pointer;
        }
        .block {
          width: 600px;
        }
        .input-style{
          .el-input__inner{
            height: 30px;
          }
          span{
            color: #cccccc
          }
          .span-color-num{
            color: red
          }
        }
      }
    }
  }
}
</style>

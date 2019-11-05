<template>
  <div class="Cbs-modifyName">
    <el-dialog :visible.sync="modifyNameShow"
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      :show-close='false'
      width="480px"
      center>
      <div slot="title"
        class="title-wrap">
        <span>改名</span>
        <i class="el-icon-close"
          @click="close"></i>
      </div>
      <div class="ModifyName">
        <p>新建云硬盘</p>
        <div>
          <div class="input-style">
            <el-input v-model="modifyNameinput"
              @input='changeinput'
              placeholder=""></el-input>
            <span v-if="numok">还可输入{{Num}}个字符</span>
            <span class="span-color-num"
              v-if="numno">你已超过{{20-Num-20}}个字符</span>
          </div>
        </div>
      </div>
      <span slot="footer"
        class="dialog-footer">
        <el-button type="primary"
          :disabled="numdis"
          @click="modifyName">确 定</el-button>
        <el-button @click="close">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    modifyNameShow: Boolean,
    Cbsdata: Object
  },
  data () {
    return {
      modifyNameinput: '',
      Num: 20, // 默认最低输入20
      numok: true, // <=20字
      numno: false, // >20字
      numdis: false
    }
  },
  components: {},
  created () {},
  methods: {
    changeinput (value) {
      this.Num = 20 - value.length
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
    modifyName () {
      var parms = {
        Version: '2017-03-12',
        Region: this.$cookie.get('regionv2'),
        DiskName: this.modifyNameinput,
        'DiskIds.0': this.Cbsdata.DiskId
      }
      this.axios.post('cbs2/ModifyDiskAttributes', parms).then(data => {
        if (data.Response.Error === undefined) {
          this.$emit('modifyNameShow', false)
          this.$message({
            message: '更改名称成功',
            type: 'success'
          })
        }
        this.$parent.getDataList()
      })
    },

    // 取消
    close () {
      this.$emit('modifyNameShow', false)
    }
  }
}
</script>

<style lang="scss" >
.Cbs-modifyName {
  font-size: 12px;
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
  .ModifyName {
    display: flex;
    padding: 10px 0;
    p {
      color: #888;
      width: 25%;
    }

    .block {
      width: 600px;
    }
    .input-style {
      .el-input__inner {
        height: 30px;
      }
      span {
        color: #cccccc;
        font-size: 12px;
      }
      .span-color-num {
        color: red;
      }
    }
  }
}
</style>

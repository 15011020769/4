<template>
  <div class="wrap">
    <el-dialog :title="KMStitle" :visible.sync="dialogVisibleKMS" width="50%">
      <p>
        <b>{{KMStxt}}</b>
      </p>
      <p>
        您已选
        <b>{{KMSdata.length}}个密钥服务</b>
        <span style="color:#006eff;" @click="_list">
          查看详情
          <i class="el-icon-caret-bottom" v-show="!listBol"></i>
          <i class="el-icon-caret-top" v-show="listBol"></i>
        </span>
      </p>
      <div v-show="listBol">
        <div class="list" v-for="(item,index) in KMSdata" :key="index">
          <p>{{index+1}}</p>
          <p>{{item.Alias}}</p>
          <p>{{state}}</p>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="_cancel">取 消</el-button>
        <el-button type="primary" @click="_confirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      listBol: false
    };
  },
  props: {
    dialogVisibleKMS: Boolean,
    KMStitle: String,
    KMStxt: String,
    KMSdata: Array,
    state: String
  },
  methods: {
    _confirm() {
      this.$emit("_confirm");
    },
    _cancel() {
      this.$emit("_cancel");
    },
    //查看详情
    _list() {
      this.listBol = !this.listBol;
    }
  }
};
</script>

<style scoped lang='scss'>
.wrap >>> .el-dialog__body {
  p {
    margin-bottom: 10px;
    font-size: 12px;
  }
}

.list:nth-last-child(1) {
  border-bottom: 1px #f2f2f2 solid;
}
.list:nth-child(1) {
  border-top: 1px #f2f2f2 solid;
}
.list {
  display: flex;
  border: 1px #f2f2f2 solid;
  border-bottom: 0;
  border-top: 0;
  p {
    flex: 1;
    padding: 5px 10px;
    box-sizing: border-box;
    margin-bottom: 0 !important;
  }
  p:nth-child(2) {
    border-right: 1px #f2f2f2 solid;
  }
  p:nth-child(1) {
    border-right: 1px #f2f2f2 solid;
    width: 40px;
    flex: none;
    text-align: center;
  }
}
</style>
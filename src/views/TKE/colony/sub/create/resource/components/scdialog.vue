<template>
  <el-dialog :title="`设置${type}`" :visible.sync="show" width="45%">
    <el-form-item :label="`选择${type}`">
      <el-select v-model="tempData.name" @change="nameChange">
        <el-option v-for="item in options" :key="item.name" :label="item.name" :value="item.name"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="选项">
      <el-radio-group v-model="tempData.checked">
        <el-radio label="all">全部</el-radio>
        <el-radio label="part">指定部分Key</el-radio>
      </el-radio-group>
    </el-form-item>
    <div style="margin-bottom: 19px" v-show="tempData.checked === 'part'">
      <label style="width: 120px;vertical-align: middle;float: left;padding: 0 12px 0 0;line-height: 28px;font-size: 12px">Items</label>
      <div style="margin-left: 120px; line-height: 28px;font-size: 12px">
        <div v-for="(v, i) in tempData.items" :key="v.ikey">
          <el-form-item style="display: inline-block" label-width="0px">
            <el-select v-model="v.key">
              <el-option v-for="iItem in items" :label="iItem" :key="iItem" :value="iItem"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="display: inline-block;margin-left: 10px" label-width="0px">
            <el-input v-model="v.path" placeholder="请输入子路径，eg: dev"></el-input>
          </el-form-item>
          <el-form-item style="display: inline-block;margin-left: 10px" label-width="0px">
            <el-input v-model="v.mode" placeholder="文件权限，如0644"></el-input>
          </el-form-item>
          <el-tooltip class="item" effect="light" :content="tempData.items.length===1?'不可删除，至少指定一个Key':''"
                      placement="right" :disabled="tempData.items.length!==1">
            <i class="el-icon-close" style="font-size:20px;margin-left:20px;cursor:pointer" @click="tempData.items.length>1?delDataItems(i):''"></i>
          </el-tooltip>
        </div>
        <p v-if="tempData.items.length>0">向特定路径挂载，如挂载点是 /data/config，子路径是dev，最终会存储在/data/config/dev下</p>
        <div v-if="items.length === 0 || items.length - tempData.items.length <= 0">添加Item
          <el-tooltip class="item" effect="light" :content="`${type}无更多可用Key`" placement="top">
            <i class="el-icon-warning-outline" style="color:red;cursor:pointer"></i>
          </el-tooltip>
        </div>
        <div v-else>
          <el-button type="text" size="mini" @click="addDataItems">添加Item</el-button>
        </div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="confirm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script type="text/javascript">
export default {
  name: 'sc-dialog',
  props: {
    visible: Boolean,
    type: String,
    scData: Object,
    scOption: Array
  },
  data: function () {
    return {
      show: this.visible,
      data: this.scData,
      tempData: this.scData,
      options: this.scOption,
      items: []
    }
  },
  watch: {
    visible: function (value) {
      this.show = value
    },
    show: function (value) {
      this.$emit('update:visible', value)
    },
    scData: {
      handler: function (value) {
        this.data = value
        this.tempData = value
      },
      deep: true
    },
    data: function (value) {
      this.$emit('update:scData', value)
    },
    scOption: {
      handler: function (value) {
        this.options = value
      },
      deep: true
    }
  },
  methods: {
    nameChange: function (event) {
      this.items = this.options.find(item => item.name === this.tempData.name).option
      this.tempData.items = []
    },
    addDataItems: function () {
      let len = this.tempData.items.length
      this.tempData.items.push({
        ikey: Date.now(),
        key: this.items[len],
        mode: '0644',
        path: ''
      })
    },
    delDataItems: function (index) {
      this.tempData.items.splice(index, 1)
    },
    confirm: function () {
      this.data = this.tempData
      this.show = false
    },
    cancel: function () {
      this.tempData = this.data
      this.show = false
    }
  }
}
</script>

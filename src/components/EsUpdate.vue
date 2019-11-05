<template>
  <div>

    <el-dialog
      title="扩容"
      class="dialog"
      :visible.sync="showDilatation">
      <p class="tips">集群扩容，一次操作只支持对节点类型（节点规格和磁盘容量）或节点个数中的一项进行扩容调整，不支持同时调整。</p>
      <el-row class="title">
        <el-col :span="12">集群</el-col>
        <el-col :span="12">当前配置</el-col>
      </el-row>
      <el-row class="configuration">
        <el-col :span="12">
          <p>ID: {{ copyEsInstance.InstanceId }}</p>
          <p>名称: {{ copyEsInstance.InstanceName }}</p>
          <!-- <p>地域: {{ getRegionObj(copyEsInstance.Region).lable }}</p> -->
          <p>可用区: {{ area[copyEsInstance.Zone] }}</p>
        </el-col>
        <el-col :span="12">
          <p>节点机型: {{ copyEsInstance.NodeType }}（{{ nodeType[copyEsInstance.NodeType] }}）</p>
          <p>节点存储量: {{ copyEsInstance.DiskSize }} GB {{ diskType[copyEsInstance.DiskType] }}</p>
          <p>节点个数: {{ copyEsInstance.NodeNum }}</p>
          <p>集群总存储量: {{ copyEsInstance.NodeNum * copyEsInstance.DiskSize }}GB</p>
          <div v-if="copyEsInstance.MasterNodeInfo">
            <p>专用主节点规格: {{ copyEsInstance.MasterNodeInfo && copyEsInstance.MasterNodeInfo.MasterNodeType  + '（' + nodeType[copyEsInstance.MasterNodeInfo.MasterNodeType] + '）' }}</p>
            <p>专用主节点系统盘: {{ copyEsInstance.MasterNodeInfo && copyEsInstance.MasterNodeInfo.MasterNodeDiskSize }}GB {{ copyEsInstance.MasterNodeInfo && diskType[copyEsInstance.MasterNodeInfo.MasterNodeDiskType] }}</p>
            <p>专用主节点个数: {{ copyEsInstance.MasterNodeInfo && copyEsInstance.MasterNodeInfo.MasterNodeNum }}</p>
          </div>
        </el-col>
      </el-row>
      <el-form label-width="180px" label-position="left">
        <el-form-item label="节点机型">
          <!-- {{ diffKey }}, -->
          <!-- {{ esInstance.MasterNodeInfo.EnableDedicatedMaster }}, -->
          {{ copyEsInstance.MasterNodeInfo.EnableDedicatedMaster }},
          {{ !copyEsInstance.MasterNodeInfo.EnableDedicatedMaster }},
          {{ typeof(copyEsInstance.MasterNodeInfo.EnableDedicatedMaster) }},
          <!-- {{ (esInstance.MasterNodeInfo.EnableDedicatedMaster && !copyEsInstance.MasterNodeInfo.EnableDedicatedMaster) }} -->
          <el-select v-model="esInstance.NodeType" :disabled="(diffKey && diffKey!=='NodeType' && diffKey !== 'DiskSize') || (esInstance.MasterNodeInfo.EnableDedicatedMaster && !copyEsInstance.MasterNodeInfo.EnableDedicatedMaster)">
            <el-option v-for="(v, i) in nodeTypes" :key="i" :label="v.val+'-'+v.name" :value="v.val" />
          </el-select>&nbsp;
        </el-form-item>
        <el-form-item label="节点数量">
          <el-input-number v-model="esInstance.NodeNum" :precision="0" :step="1" :min="2" :max="50" :disabled="(diffKey && diffKey!=='NodeNum') || (esInstance.MasterNodeInfo.EnableDedicatedMaster && !copyEsInstance.MasterNodeInfo.EnableDedicatedMaster)"></el-input-number>
        </el-form-item>
        <el-form-item label="单节点存储">
          <div class="slider-wrap">
            <el-slider class="slider" v-model="esInstance.DiskSize" :value="20" :step="10" :min="100" :max="2000" show-input
            :disabled="(diffKey && diffKey!=='DiskSize' && diffKey !== 'NodeType') || (esInstance.MasterNodeInfo.EnableDedicatedMaster && !copyEsInstance.MasterNodeInfo.EnableDedicatedMaster)"/>&nbsp;GB
          </div>
        </el-form-item>
          <el-form-item label="配置专用主节点">
            <el-checkbox label="启用" v-model="esInstance.MasterNodeInfo.EnableDedicatedMaster"
            :disabled="copyEsInstance.MasterNodeInfo.EnableDedicatedMaste || (diffKey && diffKey!=='EnableDedicatedMaster' && !esInstance.MasterNodeInfo.EnableDedicatedMaster)"></el-checkbox>
          </el-form-item>
        <div v-if="esInstance.MasterNodeInfo.EnableDedicatedMaster">
          <el-form-item label="专用主节点机型">
            <el-select v-model="esInstance.MasterNodeInfo.MasterNodeType" :disabled="diffKey && diffKey!=='MasterNodeType' && (!esInstance.MasterNodeInfo.EnableDedicatedMaster || copyEsInstance.MasterNodeInfo.EnableDedicatedMaster)">
              <el-option v-for="(n, i) in nodeTypes" :key="i" :label="n.val+'-'+n.name" :value="n.val" />
            </el-select>
          </el-form-item>
          <el-form-item label="专用主节点个数">
            <el-select v-model="esInstance.MasterNodeInfo.MasterNodeNum" :disabled="diffKey && diffKey!=='MasterNodeNum' && (!esInstance.MasterNodeInfo.EnableDedicatedMaster || copyEsInstance.MasterNodeInfo.EnableDedicatedMaster)">
              <el-option v-for="n in [3, 5]" :key="n" :label="n" :value="n" />
            </el-select>
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer">
        <el-button @click.native="closeDilatationDialog">取 消</el-button>
        <el-button @click.native="resetEs">重 置</el-button>
        <el-button type="primary" @click.native="closeDilatationDialog">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="销毁ES集群" class="dialog" :visible.sync="showDestroy">
      <el-form label-width="80px" label-position="left">
        <el-form-item label="集群ID">
          {{ esInstance.InstanceId }}
        </el-form-item>
        <el-form-item label="集群名称">
          {{ esInstance.InstanceName }}
        </el-form-item>
        <el-form-item>
          确定销毁该集群？销毁后，集群数据将被清空，资源会被回收
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click.native="closeDestroyDialog">取 消</el-button>
        <el-button type="primary" @click.native="confirmDestroy">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  TENCENT_API_VERSION_2018_04_16, ES_DESTROY, AREA, DISK_TYPE, NODE_TYPE,
} from '@/constants'
import { NODE_TYPE as nodeTypes } from '@/views/ES-add/data'
import { type, clone } from 'ramda'

export default {
  props: {
    showDestroy: {
      type: Boolean,
      default: false,
    },
    showDilatation: {
      type: Boolean,
      default: false,
    },
    es: Object,
  },
  watch: {
    esInstance: {
      handler() {
        const diffKey = this.diff(this.esInstance, this.copyEsInstance)
        console.log(this.esInstance)
        console.log(this.copyEsInstance)
        console.log(diffKey)
        this.diffKey = diffKey
      },
      deep: true,
    },
    'esInstance.MasterNodeInfo.EnableDedicatedMaster': function (n) {
      if (n === false) {
        this.excludeKey.splice(1, 2, 'MasterNodeNum', 'MasterNodeType')
      } else if (n === true && this.copyEsInstance.MasterNodeInfo.EnableDedicatedMaster) {
        this.excludeKey = ['EnableDedicatedMaster']
      }
    },
  },
  data() {
    return {
      esInstance: JSON.parse(JSON.stringify(this.es)),
      copyEsInstance: JSON.parse(JSON.stringify(this.es)),
      diffKey: undefined,
      area: AREA,
      diskType: DISK_TYPE,
      nodeType: NODE_TYPE,
      nodeTypes,
      excludeKey: ['EnableDedicatedMaster'],
    }
  },

  methods: {
    closeDestroyDialog() {
      this.$emit('update:showDestroy', false)
    },
    closeDilatationDialog() {
      this.$emit('update:showDilatation', false)
    },
    confirmDestroy() {
      this.axios.get(
        `${ES_DESTROY}?Version=${TENCENT_API_VERSION_2018_04_16}&Region=${this.esInstance.Region}&InstanceId=${this.esInstance.InstanceId}`,
      ).then(({ Response: data }) => {
        if (data.Error) this.$alert('销毁失败', { type: 'error' })
        else {
          this.$alert('销毁中...').then(() => {
            this.close()
            this.$emit('toEsList')
          })
        }
      })
    },
    diff(target, targetCopy) {
      const keys = Object.keys(target)
      let diffkey
      for (const k of keys) { // eslint-disable-line
        if (type(target[k]) === 'Object') {
          diffkey = this.diff(target[k], targetCopy[k])
          if (diffkey) break
        } else if (!this.excludeKey.includes(k) && target[k] != targetCopy[k]) {
          diffkey = k
          break
        }
      }
      return diffkey
    },
  },
}
</script>
<style lang="scss" scoped>
.dialog {
  .tips {
    background: #e5f0ff;
    color: #003b80;
    padding: 10px 30px 10px 20px;
    font-size: 12px;
    ul {
      padding-left: 10px;
      li {
        padding: 10px 0;
        list-style: disc;
      }
    }
  }
  .title {
    border: 1px solid rgba(158, 158, 158, 0.3);
    margin-top: 20px;
    padding: 10px;
  }
  .configuration {
    border: 1px solid rgba(158, 158, 158, 0.3);
    border-top: none;
    padding: 10px;
    margin-bottom: 20px;
    font-size: 12px;
  }
}
</style>

<template>
  <div class="Cbs-parameter">
    <h2>云硬盘信息</h2>
    <ul class="Cbs-ul">
      <li>
        <p>名称</p>
        <div>{{Cbsparameter.DiskName}}

          <span @click="modifyNameShow=true;Cbsdata=Cbsparameter"
            class="a-style">改名</span>
        </div>
      </li>
      <li>
        <p>资源ID</p>
        <div>{{Cbsparameter.DiskId}}</div>
      </li>
      <li>
        <p>状态</p>
        <div :class="Cbsparameter.DiskState==='UNATTACHED'?'orange-c':(Cbsparameter.DiskState==='ATTACHED'?'green-c':(Cbsparameter.DiskState==='ATTACHING'?'blue-c':'red-c'))">{{Cbsparameter.DiskState|Statefilter()}} </div>
      </li>
      <li>
        <p>所属项目</p>
        <div>{{Cbsparameter.Placement.ProjectName}}</div>
      </li>
      <li>
        <p>地域</p>
        <div>{{Cbsparameter.Placement.Zone|Regionfilter()}}</div>
      </li>
      <li>
        <p>硬盘类型</p>
        <div>{{Cbsparameter.DiskType|Toconfigurefilter()}}</div>
      </li>
      <li>
        <p>硬盘属性</p>
        <div>{{Cbsparameter.DiskUsage|Attributefilter()}}</div>
      </li>
      <li>
        <p>云硬盘容量</p>
        <div>{{Cbsparameter.DiskSize}}GB
          <span @click="CapacityShow=true;Cbsdata=Cbsparameter"
            class="a-style">扩容</span>
        </div>
      </li>
      <li>
        <p>已挂载实例</p>
        <div v-if="Cbsparameter.InstanceId!==''">{{Cbsparameter.InstanceId}}
          <span @click="uninstallShow=true;Cbsdata=Cbsparameter"
            class="a-style"
            v-if="Cbsparameter.DiskState==='ATTACHED'">卸载</span>
        </div>
        <div v-else>未挂载
          <span @click="mountShow=true;Cbsdata=Cbsparameter"
            class="a-style"
            v-if="Cbsparameter.DiskState==='UNATTACHED'">挂载</span>
        </div>
      </li>
      <li>
        <p>是否随实例销毁</p>
        <div>
          <span v-if="Cbsparameter.DeleteWithInstance===false">否</span>
          <span v-if="Cbsparameter.DeleteWithInstance===true">是</span>
        </div>
      </li>
      <li>
        <p>是否加密</p>
        <div>
          <span v-if="Cbsparameter.Encrypt===false">否</span>
          <span v-if="Cbsparameter.Encrypt===true">是</span>
        </div>
      </li>
      <li>
        <p>可卸载</p>
        <div>支持</div>
      </li>

      <li>
        <p>计费模式</p>
        <div>{{Cbsparameter.DiskChargeType|Billingmodelfilter()}}

          <span @click="renewShow=true;Cbsdata=Cbsparameter"
            class="a-style">续费</span>

        </div>
      </li>
      <li>
        <p>创建时间</p>
        <div>{{Cbsparameter.CreateTime}}</div>
      </li>
      <li>
        <p>到期时间</p>
        <div>{{Cbsparameter.DeadlineTime}}</div>
      </li>
      <li>
        <p>本硬盘快照</p>
        <div>
          <ul class="Snapshot-style">
            <li v-for="(item,key) in SnapshotsArr"
              :key="key">{{item.SnapshotId}}</li>
            <li> <span @click="snapshotShow=true;Cbsdata=Cbsparameter"
                class="a-style">创建快照</span></li>
          </ul>

        </div>
      </li>
      <li>
        <p>标签</p>
        <div v-if="Cbsparameter.Tags.length===0">-
          <span @click="LabelShow=true;Cbsdata=Cbsparameter"><i class="el-icon-edit"></i> </span>

        </div>
        <div v-else>
          <el-button-group v-for="(item,i) in Cbsparameter.Tags"
            :key="i">
            <el-button @click="LabelShow=true;Cbsdata=Cbsparameter"
              size="mini">{{item.Key}}:{{item.Value}}<i class="el-icon-edit"></i> </el-button>
          </el-button-group>
        </div>
      </li>

    </ul>
    <!-- 修改名字模态框 -->
    <modifyName v-if="modifyNameShow"
      :modifyNameShow='modifyNameShow'
      :Cbsdata='Cbsparameter'
      @modifyNameShow='modifyNameShow1'></modifyName>
    <!-- 扩容模态框 -->
    <Capacity v-if="CapacityShow"
      :CapacityShow='CapacityShow'
      :Cbsdata='Cbsparameter'
      @CapacityShow='CapacityShow1'></Capacity>
    <!-- 续费模态框 -->
    <renew v-if="renewShow"
      :renewShow="renewShow"
      :Cbsdata='Cbsparameter'
      @renewShow='renewShow1'></renew>
    <!-- 创建快照模态框 -->
    <snapshot v-if="snapshotShow"
      :snapshotShow='snapshotShow'
      :Cbsdata='Cbsparameter'
      @snapshotShow='snapshotShow1'></snapshot>
    <!-- 挂载模态框 -->
    <mount v-if="mountShow"
      :mountShow='mountShow'
      :Cbsdata='Cbsdata'
      @mountShow='mountShow1'></mount>
    <!-- 卸载模态框 -->
    <uninstall v-if="uninstallShow"
      :uninstallShow='uninstallShow'
      :Cbsdata='Cbsdata'
      @uninstallShow='uninstallShow1'> </uninstall>
    <!-- 编辑标签模态框 -->
    <Label v-if="LabelShow"
      :LabelShow='LabelShow'
      :Cbsdata='Cbsdata'
      @LabelShow='LabelShow1'></Label>
  </div>
</template>

<script>
import modifyName from '../modifyName'
import Capacity from '../Capacity'
import renew from '../renew'
import snapshot from '../snapshot'
import mount from '../mount'
import uninstall from '../uninstall'
import Label from '../Label'
export default {
  data () {
    return {
      Cbsparameter: '', // 数据
      modifyNameShow: false,
      CapacityShow: false,
      snapshotShow: false,
      renewShow: false,
      mountShow: false, // 挂载模态框
      uninstallShow: false, // 卸载模态框
      LabelShow: false, // 编辑标签模态框
      SnapshotsArr: []
    }
  },
  props: ['CbsDetail'],
  components: {
    modifyName,
    Capacity,
    renew,
    Label,
    mount,
    uninstall,
    snapshot
  },
  created () {
    this.Cbsparameter = this.CbsDetail[0]
    this.GetSnapshots()
  },
  methods: {
    // 查询快照列表
    GetSnapshots () {
      var parms = {
        Version: '2017-03-12',
        Region: this.$cookie.get('regionv2'),
        'Filters.0.Name': 'disk-id',
        'Filters.0.Values.0': this.Cbsparameter.DiskId
      }
      this.axios.post('cbs2/DescribeSnapshots', parms).then(data => {
        this.SnapshotsArr = data.Response.SnapshotSet
      })
    },
    // 模态框取消方法
    modifyNameShow1 (val) {
      this.modifyNameShow = val
      // this.$router.go(0)
    },
    CapacityShow1 (val) {
      this.CapacityShow = val
      // this.$router.go(0)
    },
    renewShow1 (val) {
      this.renewShow = val
      // this.$router.go(0)
    },
    snapshotShow1 (val) {
      this.snapshotShow = val
      // this.$router.go(0)
    },
    mountShow1 (val) {
      this.mountShow = val
      // this.$router.go(0)
    },
    uninstallShow1 (val) {
      this.uninstallShow = val
    },
    LabelShow1 (val) {
      this.LabelShow = val
    }
  }
}
</script>
<style lang="scss" scoped>
.Cbs-parameter {
  h2 {
    font-size: 14px;
    margin-bottom: 10px;
  }
  .Cbs-ul {
    li {
      padding: 13px 0;
      display: flex;
      p {
        width: 100px;
        color: #ccc;
      }
      div {
        .a-style {
          padding-left: 10px;
          color: blue;
          cursor: pointer;
        }
      }
    }
  }
  .Snapshot-style {
    display: flex;
    li {
      padding: 0;
      padding-right: 20px;
    }
  }
}
</style>

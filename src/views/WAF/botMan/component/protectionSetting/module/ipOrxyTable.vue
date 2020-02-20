<!--
 * @Author: your name
 * @Date: 2020-02-20 10:13:21
 * @LastEditTime: 2020-02-20 15:40:55
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /new_product/src/views/WAF/botMan/component/protectionSetting/module/ipOrxyTable.vue
 -->
<template>
  <div class="main">
    <el-row type="flex" justify="between">
      <el-col>
        <el-button 
          style="padding: 5px 10px; margin-right: 10px;" 
          type="primary"
          @click="dialogVisible = true"
          >
            复制
          </el-button>
      </el-col>
      <i style="cursor: pointer" class="el-icon-refresh"/>
    </el-row>
    <el-table
      style="margin-top: 10px"
      row-key="id"
      default-expand-all
      :data="tabsFlag === 'xy' ? tableData : ipData"
    >
      <el-table-column width="200px" prop="name" label="策略名称"/>
      <el-table-column prop="action" label="动作"/>
      <el-table-column prop="switch" label="策略开关">
        <template slot-scope="scope">
          <el-switch v-if="!scope.row.children" />
        </template>
      </el-table-column>
      <el-table-column prop="time" label="修改时间"/>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <a v-if="!scope.row.children" @click="onEdit(scope)">编辑</a>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="复制策略"
      :visible.sync="dialogVisible"
      width="850px"
      destroy-on-close
      >
      <!-- <span>这是一段信息</span> -->
        <Transfer v-if="showFlag" />
        <div slot="footer">
          <el-row type="flex" justify="center">
            <el-button type="primary">复制</el-button>
            <el-button @click="onClose">取消</el-button>
          </el-row>
        </div>
    </el-dialog>
    <EditDialog :visible.sync="showEditDialog" :info="editDialogProp" />
  </div>
</template>

<script>
import Transfer from '../../transfer'
import EditDialog from '../../editDialog'
export default {
  data() {
    return {
      dialogVisible: false, // 控制弹窗显示状态
      tableData: [
        {
          id: 1,
          name: 'User-Agent类别',
          children: [
            {
              id: 11,
              name: 'User-Agent为空或不存在',
              action: '监控',
              switch: '1',
              time: '2020-02-15 18:00:30'
            },
            {
              id: 12,
              name: 'User-Agent为空或不存在',
              action: '监控',
              switch: '1',
              time: '2020-02-15 18:00:30'
            },
            {
              id: 13,
              name: 'User-Agent为空或不存在',
              action: '监控',
              switch: '1',
              time: '2020-02-15 18:00:30'
            },
          ]
        }
      ],
      ipData: [
       {
          id: 1,
          name: 'IDC-IP库',
          children: [
            {
              id: 11,
              name: 'IDC-IP 腾讯云',
              action: '监控',
              switch: '1',
              time: '2020-02-15 18:00:30'
            },
            {
              id: 12,
              name: 'IDC-IP 阿里云',
              action: '监控',
              switch: '1',
              time: '2020-02-15 18:00:30'
            },
            {
              id: 13,
              name: 'IDC-IP UCloud',
              action: '监控',
              switch: '1',
              time: '2020-02-15 18:00:30'
            },
          ]
        }
      ],
      showFlag: true, // 弹窗关闭切换内部元素显示状态
      showEditDialog: false, // 控制编辑弹窗状态
      editDialogProp: {} // 编辑弹窗传递参数
    }
  },
  props: {
    tabsFlag: {
      default: 'diy'
    }
  },
  watch: {
    tabsFlag(n, o) {
      console.log(n)
    }
  },

  components: {
    Transfer,
    EditDialog
  },

  methods: {
    onEdit(row) {
      this.showEditDialog = true
      this.editDialogProp = row.row
    },
    onClose() {
      this.dialogVisible = false
      this.showFlag = false
      setTimeout(() => {
        this.showFlag = true
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
  ::v-deep .el-table {
    .cell {
      display: flex;
    }
  }
}
</style>
<!--
 * @Author: your name
 * @Date: 2020-02-20 17:09:59
 * @LastEditTime: 2020-02-28 12:39:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /new_product/src/views/WAF/botMan/component/protectionSetting/module/diyTable.vue
 -->
<template>
  <div class="main">
    <el-row type="flex" justify="between">
      <el-col>
        <el-button  style="padding: 5px 10px; margin-right: 10px;"  type="primary" @click="onAdd">添加</el-button>
        <el-button style="padding: 5px 10px; margin-right: 10px;" >复制</el-button>
        <span style="color: #bbb; font-size: 12px; margin-left: 10px">最多可以添加50条</span>
      </el-col>
      <el-row type="flex" align="middle">
        <el-input placeholder="请输入策略名称" style="width: 180px; font-size: 12px">
          <div style="cursor: pointer" slot="suffix">
            <i class="el-icon-search"/>
          </div>
        </el-input>
        <i style="margin-left: 10px" class="el-icon-refresh" />
      </el-row>
    </el-row>
    <el-card>
    <el-table 
      style="margin-top: 20px"
      :data="tableData"
      v-loading="loading" :empty-text="t('暂无数据', 'WAF.zwsj')"
    >
      <el-table-column
      type="selection"
      width="55"
      />
      <el-table-column label="序号" type="index"></el-table-column>
      <el-table-column prop="name" label="策略名称/描述">
      <template slot-scope="scope">
        
      </template>
      </el-table-column>
      <el-table-column prop="term" label="匹配条件" />
      <el-table-column prop="action" label="动作" />
      <el-table-column label="策略开关">
        <el-switch />
      </el-table-column>
      <el-table-column prop="time" label="修改时间" />
      <el-table-column label="操作">
        <template>
          <a href="">编辑</a>
          <a style="margin-left: 5px" href="">删除</a>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="skip"
      :page-sizes="[10, 15, 20, 25, 30, 35, 40, 45, 50]"
      :page-size="limit"
      layout="total, sizes, prev, pager, next"
      :total="total">
    </el-pagination>
    </el-card>
    <DiySessionDialog :visible.sync="showSessionDialog" :infoProp="infoProp" />
  </div>
</template>

<script>
import DiySessionDialog from '../../diySessionDIalog'
import { DESCRIBE_BOT_UCB_FEATURE_RULE } from '@/constants'
export default {
  data() {
    return {
      tableData: [],
      skip: 1,
      limit: 10,
      loading: true,
      total: 0,
      showSessionDialog: false,
      infoProp: {}
    }
  },

  components: {
    DiySessionDialog
  },
  mounted() {
    console.log(this.$route)
    this.getUCBRule()
  },
  methods: {
    getUCBRule() {
      this.axios.post(DESCRIBE_BOT_UCB_FEATURE_RULE, {
        "Version": 
        "2018-01-25",
        "Domain": "tfc.dhycloud.com", 
        "Skip": this.skip, 
        "Limit": this.limit
      }).then(resp => {
        this.generalRespHandler(resp, ({ Data }) => {
          const data = Data.Res.map(data => JSON.parse(data))
          this.tableData = data
          this.total = Data.TotalCount
        })
      })
    },
    handleCurrentChange(page) {
      this.skip = page
      this.getUCBRule()
    },
    handleSizeChange(size) {
      this.limit = size
      this.getUCBRule()
    },
    onAdd() {
      this.showSessionDialog = true
      this.infoProp.title = '添加自定义会话特征'
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
  ::v-deep .el-input__suffix {
    height: 30px;
    display: flex;
    align-items: center;
  }
}
</style>
<!--
 * @Author: your name
 * @Date: 2020-02-20 17:09:59
 * @LastEditTime: 2020-02-20 20:48:11
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /new_product/src/views/WAF/botMan/component/protectionSetting/module/diyTable.vue
 -->
<template>
  <div class="main">
    <el-row type="flex" justify="between">
      <el-col>
        <el-button type="primary">添加</el-button>
        <el-button>复制</el-button>
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
    <el-table 
      style="margin-top: 20px"
      :data="tableData"
      >
      <el-table-column
      type="selection"
      width="55"
      />
      <el-table-column label="序号">
        <!-- <span slot-scope="scope">{{scope.row}}</span> -->
        <span slot-scope="scope">1</span>
      </el-table-column>
      <el-table-column prop="name" label="策略名称/描述" />
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [{
        name: 'testpp3',
        term: 'IP所有者 属于 百度云 腾讯云',
        action: '放行',
        switch: '1',
        time: '2020-02-20 17:26:32	'
      }]
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
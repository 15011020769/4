<template>
  <div>
    <div>
      <div class="tableCon">
        <el-table
          :data="tags"
          style="width: 100%;"
        >
          <el-table-column prop="Key" label="標籤鍵">
            <template slot-scope="scope">
              <el-input
                v-model.trim="scope.row.tagKey"
                @input="v => scope.row.tagKey = v.replace(/[^\w\u4e00-\u9fa5]/g, '')"
                autocomplete="off"
                class="inputKey"
                placeholder="請輸入標籤鍵"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="Value" label="標籤值">
            <template slot-scope="scope">
              <el-input
                v-model.trim="scope.row.tagValue"
                @input="v => scope.row.tagValue = v.replace(/[^\w\u4e00-\u9fa5]/g, '')"
                autocomplete="off"
                class="inputKey"
                placeholder="請輸入標籤值"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="operate" label="操作">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="deleteRow(scope.$index)"
                type="text"
                size="small"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="tabListPage">
        <el-pagination
          :disabled="disabledPagination"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalItems"
        ></el-pagination>
      </div>
      <el-button type="text" @click="addRow">添加</el-button>
    </div>
    <el-row type="flex" align="middle" justify="center">
      <el-button type="primary" size="small" @click="editTagsSure">確 定</el-button>
      <el-button size="small" @click="handleClose">取 消</el-button>
    </el-row>
  </div>
</template>
<script>
import { flatObj } from '@/utils'
import VueCookie from 'vue-cookie'
import axios from "axios"
export default {
  props: {
    domains: Array,
    visible: Boolean,
  },
  data() {
    return {
      tags: [], //表格绑定数据
      removeTags: [],
      currentPage: 1,
      pageSize: 10,
      totalItems: 0,
      disabledPagination: false,
    };
  },
  watch: {
    visible: {
      handler(n) {
        if (n) {
          this.getData()
        }
      },
      immediate: true
    }
  },
  methods: {
    //获取数据
    getData() {
      this.removeTags = []
      this.$axios.post('tag/GetResourceTagsByResourceIds', flatObj({
      "Version": "2018-08-01",
      "serviceType": "lvb",
      "resourcePrefix": "live",
      "region": "ap-guangzhou",
      rp: this.pageSize,
      page: this.currentPage,
      resourceIds: this.domains.map(domain => domain.Name)
      })).then(res => {
        this.tags = res.data.rows
        this.totalItems = res.data.total
      })
    },
    //关闭弹框按钮
    handleClose() {
      this.$emit("update:visible", false)
    },
    //确定按钮
    async editTagsSure() {
      const tags = this.tags.filter(tag => tag.tagKey && tag.tagValue)
      if (this.removeTags.length) {
        Promise.all(this.domains.map(domain => this.$axios.post('tag/ModifyResourceTags', flatObj({
          resource: `qcs::lvb:ap-guangzhou:uin/${VueCookie.get('uin')}:live/${domain.Name}`,
          deleteTags: this.removeTags.map(tag => ({ tagKey: tag.tagKey, tagValue: tag.tagValue, resourceId: '' }))
        })))).then(res => {
          if (tags.length) {
            Promise.all(this.domains.map(domain => this.$axios.post('tag/ModifyResourceTags', flatObj({
              resource: `qcs::lvb:ap-guangzhou:uin/${VueCookie.get('uin')}:live/${domain.Name}`,
              replaceTags: tags.map(tag => ({ tagKey: tag.tagKey, tagValue: tag.tagValue }))
            })))).then(res => {
              this.$emit("success")
            })
          } else {
            this.$emit("success")
          }
        })
      } else {
        if (tags.length) {
          Promise.all(this.domains.map(domain => this.$axios.post('tag/ModifyResourceTags', flatObj({
            resource: `qcs::lvb:ap-guangzhou:uin/${VueCookie.get('uin')}:live/${domain.Name}`,
            replaceTags: tags.map(tag => ({ tagKey: tag.tagKey, tagValue: tag.tagValue }))
          })))).then(res => {
            this.$emit("success")
          })
        } else {
          this.$emit("success")
        }
      }
    },
    addRow(){
      if (!this.tags.some(tag => !tag.tagKey || !tag.tagValue)) {
        this.disabledPagination = true
        this.tags.push({
          tagKey: '',
          tagValue: '',
        });
      }
    },
    // 删除一行
    deleteRow(index) {
      this.removeTags.push(this.tags[index])
      this.tags.splice(index, 1)
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getData()
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getData()
    },
  }
};
</script>
<style lang="scss" scoped>
.newClear:after {
  content: "";
  clear: both;
  display: block;
}
::v-deep .el-dialog__title {
  font-size: 14px;
  color: #000;
  font-weight: 600;
}
::v-deep .el-dialog__footer {
  text-align: center;
}
.tabListPage {
  width: 100%;
  height: 50px;
  border: 1px solid #ddd;
  border-top: none;
  text-align: right;
  padding-top: 8px;
}
.tableCon {
  height: 450px;
  border: 1px solid #ddd;
  overflow-y: auto;
  background-color: #fff;
  ::v-deep input {
    width: 180px;
    height: 30px;
    border-radius: 0;
  }
  ::v-deep table {
    margin-bottom: 0;
  }
}
</style>
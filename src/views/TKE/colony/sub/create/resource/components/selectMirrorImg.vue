<template>
  <el-dialog :title="$t('TKE.subList.xzjxiang')" :visible.sync="visible" class="dialog" :before-close="handleClose" :close-on-click-modal='set'
             :close-on-press-escape='set'>
    <div class="dialog-content">
      <p>
        <el-radio-group v-model="radio" text-color="#000">
          <el-radio :label="$t('TKE.subList.xzrqfwjx')"></el-radio>
        </el-radio-group>
      </p>
      <el-tabs v-model="activeName" @tab-click="handleClick(activeName)">
        <el-tab-pane :label="$t('TKE.myMirror.wdjx')" name="first"></el-tab-pane>
        <el-tab-pane label="我的收藏" name="second"></el-tab-pane>
        <el-tab-pane :label="$t('TKE.totalMirror.gyjx')" name="third"></el-tab-pane>
        <el-tab-pane :label="$t('TKE.subList.dhjx')" name="fourth"></el-tab-pane>
      </el-tabs>
      <el-input :placeholder="$t('TKE.myMirror.qsrjxmc')" class="input-set">
        <i slot="suffix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <div v-show="activeName === 'first'">
        <el-table height="300" :data="tableData.slice((currpage - 1) * pagesize, currpage * pagesize)"
                  tooltip-effect="dark" style="width: 100%" highlight-current-row @current-change="tableCurrentChange">
          <el-table-column width="55">
            <template slot-scope="scope">
              <el-radio v-model="mirrorImageRadio" :label="scope.row.reponame">&nbsp;</el-radio>
            </template>
          </el-table-column>
          <el-table-column :label="$t('TKE.overview.mc')" width="120">
            <template slot-scope="scope">{{ scope.row.name }}</template>
          </el-table-column>
          <el-table-column prop="publicText" :label="$t('TKE.overview.lx')" width="120">
          </el-table-column>
          <el-table-column prop="namespace" :label="$t('TKE.overview.mmkj')">
          </el-table-column>
          <el-table-column prop="address" :label="$t('TKE.mirrorDetail.ckdz')" show-overflow-tooltip>
            <template slot-scope="scope">tpeccr.ccs.tencentyun.com/{{ scope.row.reponame }}</template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="activeName!=='first'">
        <el-table :data="tableData2.slice((currpage - 1) * pagesize, currpage * pagesize)" height="300" tooltip-effect="dark" style="width: 100%"
                  highlight-current-row @current-change="tableCurrentChange">
          <el-table-column width="55">
            <template slot-scope="scope">
              <el-radio v-model="mirrorImageRadio" :label="scope.row.reponame">&nbsp;</el-radio>
            </template>
          </el-table-column>
          <el-table-column prop="reponame" :label="$t('TKE.overview.mc')" width="220">
          </el-table-column>
          <el-table-column prop="repotype" :label="$t('TKE.overview.lx')" width="220">
          </el-table-column>
          <el-table-column prop="favorCount" label="收藏量">
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页 -->
      <div class="pagstyle" style="height:70px;">
        <span>共&nbsp;{{ TotalCount }}&nbsp;{{$t('TKE.colony.xiang')}}</span>
        <div class="pagestyle_right">
          <el-pagination :page-size="pagesize" :pager-count="10" :page-sizes="[50, 40, 30, 20, 10]"
                         layout="sizes, prev, pager, next" @current-change="handleCurrentChange"
                         @size-change="handleSizeChange"
                         :total="TotalCount">
          </el-pagination>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancle">取 消</el-button>
      <el-button type="primary" @click="sure">{{$t('TKE.overview.qd')}}</el-button>
    </span>
  </el-dialog>
</template>
<script type="text/javascript">
import { SPACENAME_LIST, MIRROR_LIST, GETFAVOR, GET_REPOSITORY_LIST, TKE_DOCKERHUB_LIST } from '@/constants'
export default {
  props: ['dialogVisible'],
  data () {
    return {
      visible: false,
      set: false,
      radio: '選擇容器服務映像',
      // radio1: '默认区域',
      activeName: 'first',
      // city: ['默认区域', '1', '2', '3', '4', '5', '6', '7', '8'],
      // 分页
      mirrorImageRadio: '',
      tableData: [],
      tableData2: [],
      TotalCount: 0,
      pagesize: 10,
      currpage: 1,
    }
  },
  watch: {
    dialogVisible (val) {
      if (val) this.initRequery()
      this.visible = val
    },
    visible (val) {
      this.$emit('update:dialogVisible', val)
    },
    activeName (val) {
      this.mirrorImageRadio = ''
      let arr = {
        first: this.searchUserRepository,
        second: this.getFavor,
        third: this.getRepositoryList,
        fourth: this.getDockerHubRepositoryList
      }
      arr[val]()
    }
  },
  methods: {
    tableCurrentChange: function (row) {
      if (!row) return
      this.mirrorImageRadio = row.reponame
      console.log(row)
    },
    initRequery: function () {
      this.getNamespaceInfo()
      this.searchUserRepository()
    },
    getNamespaceInfo: async function () {
      await this.axios.post(SPACENAME_LIST, { limit: 100 }).then(res => {
        console.log(res)
      })
    },
    searchUserRepository: async function () {
      await this.axios.post(MIRROR_LIST, {
        offset: 0,
        limit: 20
      }).then(res => {
        let { data: { repoInfo } } = res
        repoInfo.forEach(item => {
          let reponameArr = item.reponame.split('/')
          item.namespace = reponameArr[0]
          item.name = reponameArr[1]
          item.publicText = item.public ? '公有' : '私有'
        })
        this.tableData = repoInfo;
        this.TotalCount= repoInfo.length;
        
        console.log('searchUserRepository', this.tableData)
      })
    },
    getFavor: async function () {
      await this.axios.post(GETFAVOR, {
        offset: 0,
        limit: 20
      }).then(res => {
        console.log(res)
        let { data: { repoInfo } } = res
        this.tableData2 = repoInfo
        this.TotalCount= repoInfo.length;
      })
    },
    getRepositoryList: async function () {
      await this.axios.post(GET_REPOSITORY_LIST, {
        offset: 0,
        limit: 20
      }).then(res => {
        let { data: { repoInfo } } = res
        this.tableData2 = repoInfo
        this.TotalCount= repoInfo.length;
      })
    },
    getDockerHubRepositoryList: async function () {
      await this.axios.post(TKE_DOCKERHUB_LIST, {
        offset: 0,
        limit: 20
      }).then(res => {
        let { data: { repoInfo } } = res
        this.tableData2 = repoInfo
        this.TotalCount= repoInfo.length;
      })
    },
    handleClose (done) {
      this.visible = false
      this.$emit('close', this.visible)
    },
    cancle () {
      this.visible = false
      this.$emit('close', this.visible)
    },
    sure () {
      this.visible = false
      if (this.activeName === 'first') {
        if (this.mirrorImageRadio !== '') {
          this.$emit('confirm', `tpeccr.ccs.tencentyun.com/${this.mirrorImageRadio}`)
        }
      } else {
        this.$emit('confirm', this.mirrorImageRadio)
      }
    },
    handleClick (tab) {
      this.activeName = tab
    },
    // 改变页数
    handleCurrentChange (val) {
      this.currpage = val
    },
    handleSizeChange (val) {
      console.log(`每頁 ${val} 條`)
    }
  }
}

</script>
<style scoped lang="scss">
  /* css */
  .dialog > > > .el-dialog {
    height: 100%;
    margin-top: 0px !important;
    position: fixed;
    bottom: 0px;
    top: 0px;
    left: 0px;
    right: 0px;
    overflow: auto;
  }

  .dialog > > > .el-dialog__footer {
    text-align: center !important;
  }

  .wdred {
    color: red;
  }

  .dialog-content {
    height: auto;
    min-height: 500px;
    background: #f2f2f2;
    padding: 10px;
  }

  .input-set > > > input {
    margin: 15px 0px;
    height: 30px;
  }

  .pagstyle {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .pagestyle_right {
      display: flex;
      justify-content: flex-start;

      div {
        span {
          margin-right: 10px;
        }
      }
    }
  }

</style>

<template>
  <div class="Cam">
    <div class="top">
      <span class="title-left">添加到用户组</span>
    </div>
    <div class="add-box">
      <div>
        <el-steps :active="active" :space="200" style="margin-right: 70%" simple finish-status="success">
          <el-step title="设置用户组"></el-step>
          <el-step title="审阅用户组"></el-step>
        </el-steps>
        <div v-show="active==1" class="add-top">
          <hr />
          <div class="container">
            <div class="container-left">
              <span>选择用户组（共{{totalNum}}条）</span>
              <div>
                <el-input size="mini" v-model="searchValue" style="width:89%" @keyup.enter.native="toQuery" />
                <el-button size="mini" class="suo" icon="el-icon-search" show-overflow-tooltip @click="toQuery"></el-button>
              </div>
              <el-table
                class="table-left"
                ref="multipleOption"
                :data="policiesData"
                height="300"
                tooltip-effect="dark"
                style="width: 100%; border:1px solid #ddd"
                @row-click="selectedRow"
                @selection-change="handleSelectionChange"
              >
              </el-table>
            </div>
            <div class="abs">
              <div>&nbsp;</div>
            </div>

            <div class="container-left">
              <span>已选择（共条）</span>
              <el-table
                class="table-left"
                ref="multipleSelected"
                :data="policiesSelectedData"
                tooltip-effect="dark"
                height="300"
                style="width: 100%;border:1px solid #ddd"
              >              
                <el-table-column label="用户组">
                </el-table-column>
              </el-table>
            </div>
          </div>
          <hr />
        </div>
      </div>
      <div v-show="active==2">
        <template>
          <addreview />
        </template>
      </div>
      <div class="btn">
        <el-button
          style="margin-top: 12px;"
          type="primary"
          size="medium"
          @click="prev()"
          v-if="active==2"
        >上一步</el-button>
        <el-button
          style="margin-top: 12px;"
          type="primary"
          size="medium"
          @click="next()"
          v-if="active==1"
        >下一步</el-button>
        <el-button
          style="margin-top: 12px;"
          type="primary"
          size="medium"
          @click="complete()"
          v-if="active==2"
        >完成</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import addreview from "./addreview";
export default {
  components: {
    addreview
  },
  props: {
    policiesSelectedData: [
      {
        policyId: String,
        policyName: String,
        description: String,
        attachments: String,
        createMode: String,
        serviceType: String,
        addTime: String,
        type: String
      }
    ]
  },
  data() {
    return {
      policiesData: [],
      totalNum: "",
      active: 1,
      searchValue: ''
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    prev() {
      --this.active;
      if (this.active < 0) this.active = 0;
    },
    next() {
      if (this.active++ > 2) this.active = 0;
    },
    complete() {
      let params = {
         Action:'AddUser',
         Version:'2019-01-16'
      }
      let url = 'cam2/AddUser'
      this.axios.post(url,params).then((data)=>{
        console.log(data)
      })
    },
    init() {
      let params = {
        Action: "ListPolicies",
        scope: "All"
      };
      let url = "cam/ListPolicies";
      this.axios
        .post(url, params)
        .then(res => {
          console.log(res);
          this.totalNum = res.data.totalNum;
          this.policiesData = res.data.list;
        })
        .catch(error => {
          console.log(error);
        });
    },
    handleSelectionChange(val) {
      // 给右边table框赋值，只需在此处赋值即可，selectedRow方法中不写，因为单独点击复选框，只有此方法有效。
      this.policiesSelectedData = val;
    },
    selectedRow(row, column, event) {
      // 设置选中或者取消状态
      this.$refs.multipleOption.toggleRowSelection(row);
    },
    deleteRow(index, rows) {
      // 获取右边框中取消的行数据，将此行数据在右边框中的选中状态取消
      this.$refs.multipleOption.toggleRowSelection(rows[index], false);
    },
    toQuery() {}
  }
};
</script>
<style lang="scss">
.Cam {
  .top {
    height: 45px;
    line-height: 45px;
    padding: 0 20px;
    background: #fff;
    .title-left {
      font-size: 14px;
      font-weight: bolder;
    }
    .title-right {
      float: right;
      span:hover {
        color: #006eff;
        border-bottom: 1px solid #006eff;
      }
    }
  }
  .add-box {
    margin: 20px auto;
    width: 96%;
    background-color: #fff;
    padding: 20px;
    .add-bor {
      margin-top: 20px;
      border-bottom: 1px solid #dddddd;
    }
    hr {
      padding: 0;
      border: none;
      border-bottom: 1px solid #ddd;
      margin: 20px 0;
    }
    .btn {
      background-color: #fff;
    }
  }
  .container {
    width: 96%;
    height: 270px;
    min-height: 360px;
    margin: 10px auto 0;
    background: #fff;
    padding: 20px;
    p.title,
    p.explain {
      text-align: center;
      line-height: 20px;
      font-size: 16px;
      color: #000;
      font-weight: 700;
    }
    p.explain {
      font-size: 12px;
      color: #ccc;
      margin-top: 10px;
      line-height: 16px;
      color: #666;
    }
    .abs {
      display: inline-block;
      width: 100px;
      height: 300px;
      text-align: center;
    }
    .container-left {
      width: 44%;
      display: inline-block;
    }
  }
  .el-steps--simple{
    background-color: #fff;
  }
  .el-steps--simple{
    padding:0 8px;
  }
  .step{
    height: 45px;
    padding: 0;
  }
}
</style>
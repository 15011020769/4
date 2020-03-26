<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="从策略列表中选取策略关联" name="first">
      <div class="search">
        <p>
          <el-button size="small" type="primary">新建自定义策略</el-button>
          <i class="el-icon-refresh refresh"></i>
        </p>
        <p>
          <el-input v-model="input" size="small" placeholder="支持搜索策略名称/描述"></el-input>
          <i class="iconfont"></i>
        </p>
      </div>
      <!-- 从策略列表中选取策略关联中的表单 -->
      <div class="table-Header">
        <p>策略列表</p>
        <p>(共304条)</p>
      </div>
      <el-table
        :data="tableDatas"
        height="350"
        style="width: 100%; border:1px solid #ddd;padding-top: 8px;"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="策略名" width prop="PolicyName"></el-table-column>
        <el-table-column label="描述" width prop="Description"></el-table-column>
        <el-table-column label="引用次数" width prop="Attachments"></el-table-column>
        <el-table-column label="策略类型" width prop="Type">
          <template slot-scope="scope">
              {{scope.row.type == '1'?'自定义策略':'预设策略'}}
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="复用现有用户策略" name="second">
      <div class="tea-alert">
        <div class="tea-alert__info">因子用户登录使用用户名，用户名一经确认将无法更改。在创建用户后，您可以查看并下载密钥等相关信息。</div>
      </div>
      <div class>
        <p class="search-inp">
          <el-input v-model="input" size="small" placeholder="支持搜索策略名称/描述"></el-input>
          <i icon="el-icon-search"></i>
        </p>
      </div>
      <!-- 复用现有用户策略中的表格 -->
      <el-table
        height="350"
        highlight-current-row
        style="width: 100%; border:1px solid #ddd;padding-top: 8px;"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="用户" width>
          <template slot-scope="scope">
            <span>{{ scope.row.user }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" width>
          <template slot-scope="scope">
            <span>{{ scope.row.remarks }}</span>
          </template>
        </el-table-column>
        <el-table-column label="已关联策略" width>
          <template slot-scope="scope">
            <span>{{ scope.row.associated }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="添加至组获得随组权限" name="third">
      <div class="tea-alert">
        <div class="tea-alert__info">因子用户登录使用用户名，用户名一经确认将无法更改。在创建用户后，您可以查看并下载密钥等相关信息。</div>
      </div>
      <div class="search">
        <p>
          <el-button @click="dialogVisible = true" size="small" type="primary">快捷建组</el-button>
        </p>
        <!-- 自定义弹框 -->
        <el-dialog
          title="添加组"
          :visible.sync="dialogVisible"
          width="30%"
          :before-close="handleClose"
        >
          <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label-width="80" label="用户组名称">
              <el-input class="wid" v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="备注">
              <el-input type="textarea" v-model="form.desc"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
          </span>
        </el-dialog>
        <p>
          <el-input v-model="input" size="small" placeholder="支持搜索策略名称/描述"></el-input>
          <i icon="el-icon-search"></i>
        </p>
      </div>
      <!-- 添加至组获得随组权限中的表格 -->
      <el-table
        height="350"
        style="width: 100%; border:1px solid #ddd;padding-top: 8px;"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="组名" width>
          <template slot-scope="scope">
            <span>{{ scope.row.group }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" width>
          <template slot-scope="scope">
            <span>{{ scope.row.prepare }}</span>
          </template>
        </el-table-column>
        <el-table-column label="已关联策略" width>
          <template slot-scope="scope">
            <span>{{ scope.row.relation }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      dialogVisible: false,
      activeName: "first",
      checked: "",
      tableDatas: []
    };
  },

  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
  },
  created(){
    let params = {
      Action: "ListPolicies",
      Version: "2019-01-16"
    };
    let url = "cam2/ListPolicies";
    this.axios.post(url, params).then(data => {
      this.tableDatas = data.Response.List;
      console.log(data);
    });
  }
};
</script>

<style lang="scss" scoped>
.refresh {
  font-size: 130%;
  padding-left: 10px;
}
.search {
  margin-top: 10px;
  margin-bottom: 10px;
}
.search p {
  display: inline-block;
  width: 50%;
}
.search-inp {
  float: right;
  width: 260px;
  margin-bottom: 16px;
}
.table-Header p {
  margin: 20px 5px 10px 0;
  display: inline-block;
}
.tea-alert {
  padding: 10px 30px 10px 20px;
  vertical-align: middle;
  color: #003b80;
  border: 1px solid #97c7ff;
  border-radius: 2px;
  background: #e5f0ff;
  position: relative;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 20px;
}
.tea-alert,
.tea-alert__info {
  font-size: 12px;
  line-height: inherit;
}
.wid {
  width: 50%;
}
</style>

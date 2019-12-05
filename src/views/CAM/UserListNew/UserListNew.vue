<template>
  <div class="wrap">
    <div class="top">
      <span class="title-left">用户列表</span>
    </div>
    <div class="explain">
      <p style="font-weight:bold">如何查看更多信息?</p>
      <p>访问管理对您的敏感信息进行安全升级保护，您可以点击列表中【详情】列下拉按钮【▶】查看用户的身份安全状态、已加入组以及消息订阅等更多信息。您也可以点击用户名进入用户详细信息中查看或编辑。</p>
    </div>
    <div class="operation">
      <button class="addUser" @click="addUser">新增用户</button>
     
      <template>
  <el-select v-model="value" placeholder="请选择" @change="select" class="select">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
</template>
      <el-input  placeholder="支持搜索用户名" size="small" class="inputSearch">
        <i slot="suffix" class="el-input__icon el-icon-search"></i>
      </el-input>
    </div>
    <div class="tableBody">
      <el-table style="width: 96%; margin: 0 auto;" :data="tableData">
        <el-table-column  type="selection" width="55"></el-table-column>
        <el-table-column type="expand" label="详情" width="50">
          <template slot-scope="scope">
            <el-form label-position="left" inline class="demo-table-expand" >
              <el-form-item label="用户组:"></el-form-item>
              <el-form-item label="用户名称:"></el-form-item>
              <el-form-item label="用户类型:"></el-form-item>
              <el-form-item label="账号ID:"></el-form-item>
              <el-form-item label="关联信息:"></el-form-item>
              <el-form-item label="登录保护:">
                <span style="color:red">未开启保护</span>
              </el-form-item>
              <el-form-item label="消息订阅:"></el-form-item>
              <el-form-item label="操作保护:">
                <span style="color:red">未开启保护</span>
              </el-form-item>
              <el-form-item label="控制台访问:">
                <span style="color:green">启用</span>
              </el-form-item>
              <el-form-item label="MFA设备:">
                <span style="color:red">未绑定MFA设备</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>

        <el-table-column label="用户名称" prop="Name">
        </el-table-column>

        <el-table-column label="用户类型" prop="Remark">
        </el-table-column>

        <el-table-column label="账号ID" prop="Uin">
        </el-table-column>

        <el-table-column label="关联信息">
          <template slot-scope="scope">
            <i  class="el-icon-mobile mobile"></i>
            <i  class="el-icon-message message"></i>
          </template>
        </el-table-column>
        <el-table-column  label="操作" width="140">
          <template scope="scope">
            <el-button type="text">授权</el-button>
            <span>|</span>
            <el-dropdown :hide-on-click="false">
              <span class="el-dropdown-link" style="color: #3E8EF7">
                更多
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <el-button type="text" style="color:#000" >添加到组</el-button>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button type="text" style="color:#000">订阅信息</el-button>
                </el-dropdown-item>
                <el-button
                  type="text"
                  style="color:#000;padding-left:20px;"
                >删除</el-button>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { USER_LIST } from '@/constants';
export default {
  data() {
    return {
      tableData: [],
        options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
        value: ''
    };
  },
  methods: {
    init() {
      let userList = {
        Version: "2019-01-16"
      };
      this.axios.post(USER_LIST, userList).then(data => {
        this.tableData = data.Response.Data;
        console.log(data);
      });
    },
    //添加用户路由跳转
    addUser(){
        this.$router.push('/adduserNew')
    },
    select(){
       console.log(this.value)
    }
  },
  created(){
      this.init()
  }
};
</script>
<style lang="scss" scoped>
.wrap {
  width: 100%;
  height: 100%;
  background-color: #f2f2f2 !important;
  .top {
    width: 100%;
    height: 45px;
    background-color: #fff;
    margin-bottom: 20px;
    .title-left {
      font-size: 14px;
      font-weight: bolder;
      padding-left: 20px;
      line-height: 45px;
    }
  }
  .explain {
    width: 96%;
    margin: 0 auto;
    font-size: 12px;
    padding: 10px 30px 10px 20px;
    vertical-align: middle;
    color: #003b80;
    border: 1px solid #97c7ff;
    border-radius: 2px;
    background: #e5f0ff;
    position: relative;
    box-sizing: border-box;
    margin-bottom: 20px;
    p {
      line-height: 20px;
    }
  }
  .operation {
    width: 100%;
    margin-bottom: 20px;
    .addUser {
      height: 30px;
      min-width: 24px;
      padding: 0 20px;
      background-color: #006eff;
      color: #fff;
      border: 1px solid #006eff;
      text-align: center;
      display: inline-block;
      cursor: pointer;
      outline: 0;
      box-sizing: border-box;
      text-decoration: none;
      margin-left: 35px;
    }
    .select {
      border-radius: none;
      margin-left: 10px;
      color: black;
    }
    .inputSearch {
      width: 15%;
      float: right;
      margin-right: 35px;
    }
  }
  .tableBody {
    width: 100%;
  }
}
</style>
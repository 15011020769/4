<template>
  <div class="Cam">
    <div class="top">
      <span class="title-left">用户列表</span>
      <span class="title-right">
        <span>CAM用户使用说明</span>
        <i class="el-icon-share"></i>
      </span>
    </div>
    <div class="explain">
      <p>
        <span>如何查看更多信息？</span>
      </p >
      <p>
        <span>&nbsp;&nbsp;访问管理对您的敏感信息进行安全升级保护，您可以点击列表中【详情】列下拉按钮【?】查看用户的身份安全状态、已加入组以及消息订阅等更多信息。您也可以点击用户名进入用户详细信息中</span>
      </p >
      <p>
        <span>&nbsp;&nbsp;&nbsp;查看或编辑。</span>
      </p >
    </div>

    <div class="cam_button">
      <el-row class="cam-lt">
        <el-button type="primary"  @click="NewUser" >新建用户</el-button>
        <template>
          <el-select v-model="value" placeholder="更多操作">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled">
            </el-option>
          </el-select>
        </template>
      </el-row>

      <div class="head-container">
        <!-- 搜索 -->
        <el-input v-model="value" clearable placeholder="支持多关键词(间隔为空格)搜索用户名/ID/SecretId/手机/邮箱/备注" style="width: 200px;"  @keyup.enter.native="toQuery"/>
        <el-button class="suo" icon="el-icon-search" circle></el-button>
      </div>
    </div>


    <!-- 表格 -->
    <el-table
      :data="tableData"
      style="width: 96%; margin: 0 auto;">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column type="expand" label="详情" width="50">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="商品名称">
              <span>{{ props.row.name }}</span>
            </el-form-item>
            <el-form-item label="所属店铺">
              <span>{{ props.row.shop }}</span>
            </el-form-item>
            <el-form-item label="商品 ID">
              <span>{{ props.row.id }}</span>
            </el-form-item>
            <el-form-item label="店铺 ID">
              <span>{{ props.row.shopId }}</span>
            </el-form-item>
            <el-form-item label="商品分类">
              <span>{{ props.row.category }}</span>
            </el-form-item>
            <el-form-item label="店铺地址">
              <span>{{ props.row.address }}</span>
            </el-form-item>
            <el-form-item label="商品描述">
              <span>{{ props.row.desc }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        label="商品 ID"
        prop="id">
      </el-table-column>
      <el-table-column
        label="商品名称"
        prop="name">
      </el-table-column>
      <el-table-column
        label="描述"
        prop="desc">
      </el-table-column>
      <el-table-column
        prop="oper"
        label="操作" width="140">
        <template scope="scope">
          <el-button type="text">授权</el-button>
          <span>|</span>
          <el-dropdown :hide-on-click="false">
        <span class="el-dropdown-link" style="color: #3E8EF7">
          更多<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>添加到组</el-dropdown-item>
              <el-dropdown-item>订阅信息</el-dropdown-item>
              <el-dropdown-item>删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage4"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="40">
      </el-pagination>
    </div>
  </div>
</template>a
<script>
  export default {
    data() {
      return {
        tableData: [{
          id: '12987122',
          name: '好滋好味鸡蛋仔',
          category: '江浙小吃、小吃零食',
          desc: '荷兰优质淡奶，奶香浓而不腻',
          address: '上海市普陀区真北路',
          shop: '王小虎夫妻店',
          shopId: '10333'
        }, {
          id: '12987123',
          name: '好滋好味鸡蛋仔',
          category: '江浙小吃、小吃零食',
          desc: '荷兰优质淡奶，奶香浓而不腻',
          address: '上海市普陀区真北路',
          shop: '王小虎夫妻店',
          shopId: '10333'
        }, {
          id: '12987125',
          name: '好滋好味鸡蛋仔',
          category: '江浙小吃、小吃零食',
          desc: '荷兰优质淡奶，奶香浓而不腻',
          address: '上海市普陀区真北路',
          shop: '王小虎夫妻店',
          shopId: '10333'
        }, {
          id: '12987126',
          name: '好滋好味鸡蛋仔',
          category: '江浙小吃、小吃零食',
          desc: '荷兰优质淡奶，奶香浓而不腻',
          address: '上海市普陀区真北路',
          shop: '王小虎夫妻店',
          shopId: '10333'
        }],
      options: [{
        value: '选项1',
        label: '添加到组',
        disabled: true
      }, {
        value: '选项2',
        label: '删除',
        disabled: true
      }],
      }
    },
    methods: {
      NewUser() {
        this.$router.push({name: 'NewUser'})
      }
    }
  }
</script>
<style lang="scss" scoped>
.Cam {
  .top {
    height: 45px;
    line-height: 45px;
    margin-bottom: 20px;
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
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .content {
    padding: 20px;
    .operation {
      margin-bottom: 10px;
    }
    .search {
      overflow: hidden;
      padding: 10px 0;
      .search-left {
        float: left;
        .searchBox {
          display: inline-block;
        }
      }
      .search-right {
        float: right;
        margin-top: 10px;
        :hover {
          cursor: pointer;
        }
        i {
          padding: 0 3px;
        }
      }
    }
    .cam-pag {
      padding: 10px 0;
      display: flex;
      justify-content: flex-end;
    }
  }
  .tc-15-search .tc-15-btn.search {
    position: absolute;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    width: 28px !important;
    right: 1px;
    border: none;
    height: 28px;
    top: 1px;
    z-index: 99;
  }
  .explain{
    width: 96%;
   font-size: 12px;
    padding: 10px 30px 10px 20px;
    vertical-align: middle;
    color: #003b80;
    border: 1px solid #97c7ff;
    border-radius: 2px;
    background: #e5f0ff;
    position: relative;
    box-sizing: border-box;
    margin-left: auto;
    margin-right: auto;
  }
  .explain p{
    line-height: 1.5;
    margin-bottom: 8px;
  }
  .cam_button{
    width: 96%;
    margin: 10px auto;
  }
  .cam-lt{
    float: left;
  }
  .head-container{
    float: right;
  }
  .cam_button{
    position: relative;
  }
  .suo{
    position: absolute;
    right: 0;
  }

}
</style>

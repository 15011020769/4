<template>
  <div class="Cam">
    <div class="top">
      <span class="title-left">角色</span>
      <span class="title-right">
        <span>实例使用指南</span>
        <i class="el-icon-share"></i>
      </span>
    </div>
  </div>
</template>
<script>

</script>
<style lang="scss" scoped>
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
    .tableList {
      margin-top: 40px;
      background: #fff;
      .detail-code {
        color: #006eff;
        :hover {
          cursor: pointer;
        }
      }
      .detail-name {
        .el-icon-edit {
          margin-left: 10px;
        }
      }
      .cloudHostrenewa {
        color: #888888;
        cursor: default;
      }

      .cloudHostrenewa:hover {
        color: #888888;
        cursor: default;
      }
      .el-dropdown-link {
        margin-left: 5px;
        font-size: 12px !important;
        color: #006eff;
      }
      .el-dropdown-list {
        font-size: 12px;
        color: #006eff;
      }
    }
    .cam-pag {
      padding: 10px 0;
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>

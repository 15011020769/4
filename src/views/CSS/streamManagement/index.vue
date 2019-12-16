<template>
  <div class="streamManagement-wrap">
    <HeadCom title="流管理"></HeadCom>
    <div class="streamWrap">
      <div class="streamBnt">
        <div class="bntWrap" style="flex:1">
          <el-button type="primary">在线流</el-button>
          <el-button type="primary">历史流</el-button>
          <el-button type="primary">禁推流</el-button>
        </div>
        <div class="streamInp">
          <el-input placeholder="输入部分域名搜索" size="small" class="inputSearch" style="width:90%;">
            <i slot="suffix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <svg
            t="1576486867236"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="2180"
            width="200"
            height="200"
            style="width:30px;height:30px;float:right;"
          >
            <path
              d="M512 269.922592l0 121.038704 161.384597-161.384597L512 68.191078l0 121.038704c-178.330548 0-322.770218 144.43967-322.770218 322.770218 0 63.343677 18.559705 122.047684 50.02944 171.874509l58.905598-58.905598c-17.953907-33.689287-28.242228-72.018244-28.242228-112.969934C269.922592 378.251833 378.251833 269.922592 512 269.922592zM784.740778 340.124468l-58.905598 58.905598c17.953907 33.689287 28.242228 72.018244 28.242228 112.969934 0 133.748167-108.329241 242.077408-242.077408 242.077408L512 633.038704 350.614379 794.423301l161.384597 161.384597L511.998977 834.770218c178.330548 0 322.770218-144.43967 322.770218-322.770218C834.770218 448.656323 816.210513 389.952316 784.740778 340.124468z"
              p-id="2181"
            />
          </svg>
        </div>
      </div>
      <div class="streamWTable">
        <template>
          <el-table :data="tableData" style="width: 100%">
            <el-table-column  label="流名称" width="180"></el-table-column>
            <el-table-column  label="域名" width="180"></el-table-column>
            <el-table-column  label="应用名"></el-table-column>
            <el-table-column  label="状态" width="180"></el-table-column>
            <el-table-column  label="开始推流时间" width="180"></el-table-column>
            <el-table-column  label="操作"></el-table-column>
          </el-table>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import HeadCom from "@/components/public/Head";
export default {
  components: {
    HeadCom
  },
  name: "streamManagement",
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
.streamManagement-wrap >>> .el-button {
  height: 30px;
  line-height: 30px;
  border-radius: 0;
  font-size: 12px;
  padding-top: 0;
}
.streamWrap {
  width: 100%;
  .streamBnt {
    width: 100%;
    display: flex;
    padding: 20px;
    box-sizing: border-box;
  }
  .streamInp {
    width: 300px;
  }
   .streamWTable{
     width: 100%;
     padding: 0px 20px 0px 20px;
     box-sizing: border-box;
   }
}
</style>
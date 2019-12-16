<template>
  <div class="domainManagement-wrap">
    <HeadCom title="域名管理"></HeadCom>
    <div class="wrap">
      <div class="domainTitle-wrap">
        <div class="title">
          <p>关于推流域名：直播已为您提供系统推流域名，您亦可添加自有已备案域名进行推流。</p>
          <p>关于播放域名：您需要添加自有已备案域名进行直播播放，更多域名管理使用方法参见域名管理和CNAME配置</p>
          <p>若您暂无域名，可通过腾讯云域名注册快速注册属于您的域名。</p>
        </div>
      </div>
      <div class="domainTitleBnt">
        <div class="bntWrap" style="flex:1">
          <el-button type="primary" :disabled="disabled">添加接收人</el-button>
          <el-button type="primary" :disabled="disabled">移除接收人</el-button>
        </div>

        <div class="input" style="width:300px;">
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
      <div class="domainTable">
        <div class="tableWrap">
          <template>
            <el-table :data="tableData" style="width: 100%" height="450">
              <el-table-column  label="域名" width="180"></el-table-column>
              <el-table-column  label="CNAME" width="180"></el-table-column>
              <el-table-column  label="类型"></el-table-column>
              <el-table-column  label="状态" width="180"></el-table-column>
              <el-table-column  label="开始时间" width="180"></el-table-column>
              <el-table-column  label="过期时间"></el-table-column>
              <el-table-column  label="操作"></el-table-column>
            </el-table>
          </template>
  
  <div class="page-box Right-style pagstyle">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[20, 30, 40,50,100]"
            :page-size="pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="tableData.length"
          ></el-pagination>
    </div>
          
        </div>
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
  name: "domainManagement",
  data() {
    return {
      tableData: []
    };
  }
};
</script>

<style lang="scss" scoped>
.domainManagement-wrap >>> .el-button {
  height: 30px;
  line-height: 30px;
  border-radius: 0;
  font-size: 12px;
  padding-top: 0;
}
.wrap {
  width: 100%;
  .domainTitle-wrap {
    padding: 20px;
    box-sizing: border-box;
    width: 100%;
    .title {
      color: #003b80;
      padding: 10px 30px 10px 20px;
      border: 1px solid #97c7ff;
      border-radius: 2px;
      background: #e5f0ff;
      box-sizing: border-box;
      p {
        margin: 5px;
      }
    }
  }
  .domainTitleBnt {
    width: 100%;
    display: flex;
    padding: 0px 20px 0 20px;
    box-sizing: border-box;
  }
  .domainTable {
    padding: 20px 20px 0px 20px;
    box-sizing: border-box;
    width: 100%;
    .tableWrap {
      width: 100%;
      background: white;
       .Right-style {
    display: flex;
    justify-content: flex-end;

    .esach-inputL {
      width: 300px;
      margin-right: 20px;
    }
  }
      .page-box {
    padding: 20px;
    padding-right: 30px;
    box-sizing: border-box;
  }
    }
    
  }
}
</style>
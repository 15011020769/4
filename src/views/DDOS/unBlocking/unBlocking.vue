<template>
  <div id="unBlocking">
    <div class="contentTit">
      解封操作
    </div>
    <div class="mainContentBlock">
      <div class="contPartOne">
        <el-row>
          <el-col :span="8">
            <div class="contPartOneData">
              <p>总配额数</p>
              <p><span>3</span><span>次</span></p>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="contPartOneData">
              <p>当前已使用</p>
              <p><span>0</span><span>次</span></p>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="contPartOneData contPartOneDataT">
              <p>当前未使用</p>
              <p><span>3</span><span>次</span></p>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="contPartTwo">
        <el-table :data="tableDataBegin">
          <el-table-column prop="ip" label="IP">
            <template slot-scope="scope">
              <a href="#" @click="toDoDetail(scope.$index, scope.row)">{{scope.row.ip}}</a>
            </template>
          </el-table-column>
          <el-table-column prop="blockingTime" label="封堵时间"></el-table-column>
          <el-table-column prop="unblockTime" label="预计解封时间"></el-table-column>
          <el-table-column prop="status" label="状态"></el-table-column>
          <el-table-column prop="action" label="操作" width="180">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="deleteRow(scope.$index, scope.row)"
                type="text"
                size="small"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableDataBegin:[],
      allData:[
        {
          ip:"10.1.1.212",
          blockingTime:"2019-11-19 10:25:52",
          unblockTime:"2019-11-20 10:25:52",
          status:"状态"
        }
      ]
    }
  },
  mounted() {
    this.getData();
  },
  methods:{
    getData() {
      var cookies = document.cookie;
      var list = cookies.split(";");
      for (var i = 0; i < list.length; i++) {
        var arr = list[i].split("=");
      }
      let params = {
        // Action: "ListFunctions",
        Version: "2018-04-16",
        Region: arr[1]
      };
      //this.$axios.post('', params).then(res => {
        // console.log(res.data.functions);
        //this.tableDataBegin = res.data.functions;
        this.tableDataBegin = this.allData;
        // 将数据的长度赋值给totalItems
        this.totalItems = this.tableDataBegin.length;
        if (this.totalItems > this.pageSize) {
          for (let index = 0; index < this.pageSize; index++) {
            this.tableDataEnd.push(this.tableDataBegin[index]);
          }
        } else {
          this.tableDataEnd = this.tableDataBegin;
        }
      //});
    },
  }
}
</script>
<style lang="scss">
.newClear:after{
  content:"";
  clear:both;
  display:block;
}
.contentTit{
  width:100%;
  height:50px;
  padding:0 20px;
  line-height: 50px;
  border-bottom:1px solid #ddd;
  font-size:16px;
  font-weight:600;
  background-color:#fff;
}
#unBlocking{
  .mainContentBlock{
    width:100%;
    padding:20px;
    .contPartOne{
      width:100%;
      height:115px;
      width:100%;
      padding:20px;
      margin-bottom:20px;
      border:1px solid #ddd;
      box-shadow: 0 2px 3px 0 rgba(0,0,0,.2);
      background-color:#fff;
      .contPartOneData{
        p:nth-child(1){
          font-size: 12px;
          color:#888;
          margin-bottom:26px;
        }
        p:nth-child(2){
          color:#000;
          span:nth-child(1){
            font-size:24px;
          }
          span:nth-child(2){
            font-size:12px;
          }
        }
      }
      .contPartOneDataT{
        p{
          span:nth-child(1){
            color:#0abf5b;
          }
        }
      }
    }
    .contPartTwo{
      width:100%;
      padding:20px;
      background-color:#fff;
      border:1px solid #ddd;
      box-shadow: 0 2px 3px 0 rgba(0,0,0,.2);
      min-height:200px;
    }
  }
}

</style>
<template>
  <div>
    <!-- 城市按钮 -->
    <div class="CVM-title">MySQL</div>
    <div class="tool">
      <Cities
        :cities="cities"
        class="city"
        :Cityvalue.sync="selectedRegion"
        @changeCity="changeCity"
      />
      <!-- 搜索 -->
      <SEARCH
        :searchOptions="searchOptions"
        :searchValue="searchValue"
        @changeValue="changeValue"
        :searchInput="searchInput"
        @changeinput="changeinput"
        @clicksearch="clicksearch"
      ></SEARCH>
    </div>
    <!-- 表格 -->
    <div class="Table-SY">
      <el-table
        :data="ProTableData.slice((currpage - 1) * pagesize, currpage * pagesize)"
        height="550"
        style="width: 100%"
      >
        <el-table-column prop label="ID/名称">
          <template slot-scope="scope">
            <p>
              <a
                @click="jump(scope.row.InstanceId)"
                style="cursor:pointer;"
              >{{scope.row.InstanceId}}</a>
            </p>
            <p>{{ scope.row.InstanceName}}</p>
            
          </template>
        </el-table-column>
        <el-table-column prop label="监控">
          <template slot-scope="scope">
            <i class="el-icon-share"></i>
          </template>
        </el-table-column>
        <el-table-column prop label="状态">
          <template slot-scope="scope">
            <p>{{RestrictState[scope.row.Status]}}</p>
          </template>
        </el-table-column>
        <el-table-column prop label="内网IP/端口">
          <template slot-scope="scope">
            <p>{{scope.row.Vip}}/{{scope.row.Vport}}</p>
          </template>
        </el-table-column>

        <el-table-column prop label="网络类型">
          <template slot-scope="scope">
            <p>VPC 网络</p>
          </template>
        </el-table-column>

        <el-table-column prop label="类型">
          <template slot-scope="scope">
            <p>{{InstanceTypeState[scope.row.InstanceType]}}</p>
          </template>
        </el-table-column>

        <el-table-column prop="projectName" label="所属项目">
          <template slot-scope="scope">
            <p>{{scope.row.projectName}}</p>
          </template></el-table-column>
      </el-table>
      <div class="Right-style pagstyle">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[5,10, 20, 30, 40,50]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="ProTableData.length"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import Cities from "@/components/public/CITY";
import SEARCH from "@/components/public/SEARCH";
import { ALL_CITY, MYSQL_LIST, ALL_PROJECT, OBJ_LIST } from "@/constants";
export default {
  data() {
    return {
      searchOptions: [
        {
          value: "bucket",
          label: "存储桶名称"
        }
      ],
      searchValue: "",
      TaskStatusStatus: {
        0: "没有任务",
        1: "升级中",
        2: "数据导入中",
        3: "开放Slave中",
        4: "外网访问开通中",
        5: "批量操作执行中",
        6: "回档中",
        7: "外网访问关闭中",
        8: "密码修改中",
        9: "实例名修改中",
        10:"重启中",
        12:"自建迁移中",
        13:"删除库表中",
        14:"灾备实例创建同步中",
        15:"升级待切换",
        16:"升级切换中",
        17:"升级切换完成"
      },
      RestrictState: {
        0: "创建中",
        1: "运行中",
        4: "隔离中",
        5: "已隔离"
      },
       InstanceTypeState: {
        1: "主实例",
        2: "灾备实例",
        3: "只读实例"
      },
      cities: [],
      selectedRegion: "ap-taipei", // 默认选中城市
      selectedCity: {}, // 切换城市
      search: "", // 搜索
      searchInput: "",
      TbaleData: [], // 表格数据
      ProjectData: [], // 项目列表数据
      ProTableData: [], // 添加完项目列表的表格数据
      pagesize: 20, // 分页条数
      currpage: 1 // 当前页码
    };
  },
  created() {
    this.GetCity();
    this.GetTabularData();
  },
  components: {
    Cities,
    SEARCH
  },
  methods: {
    // 获取城市列表
    GetCity() {
      this.axios.get(ALL_CITY).then(data => {
        this.cities = data.data;
        this.selectedRegion = data.data[0].Region;
        this.selectedCity = data.data[0];
        this.$cookie.set("regionv2", this.selectedCity.Region);
      });
    },
    // 切换城市
    changeCity(city) {
      this.selectedCity = city;
      this.$cookie.set("regionv2", city.Region);
      this.GetTabularData();
    },
    //选择搜索条件
    changeValue(val) {
      this.searchValue = val;
    },
    changeinput(val) {
      this.searchInput = val;
      if (this.searchInput === "") {
        this.GetTabularData();
      }
    },
    clicksearch(val) {
      this.searchInput = val;
      if (this.searchInput !== "" && this.searchValue !== "") {
        this.GetTabularData();
      } else {
        this.$message.error("请输入正确搜索信息");
      }
    },
    // 添加项目列表的表格数据
    GetTabularData() {
      const param = {
        Region: this.selectedRegion,
        Version: "2017-03-20",
        Offset: this.currpage * this.pagesize - this.pagesize,
        Limit: this.pagesize
      };
      if (this.searchValue !== "" && this.searchInput !== "") {
        param["Filters.0.Name"] = this.searchValue;
        param["Filters.0.Values.0"] = this.searchInput;
      }
      const paramS = {
        allList: 0
      };
      // 获取表格数据
      this.axios
        .post(MYSQL_LIST, param)
        .then(data => {
          // console.log(data);
          // if (data.Response.Error == undefined) {
          this.TbaleData = data.Response.Items;
          // } else {
          //   this.$message.error(data.Response.Error.Message);
          // }
          // this.ProTableData = this.TbaleData;
        })

        .then(() => {
          // 获取项目列表
          this.axios.post(ALL_PROJECT, paramS).then(data => {
            // console.log(data)
            this.ProjectData = data.data;
            for (let i = 0; i < this.TbaleData.length; i++) {
              for (let j = 0; j < this.ProjectData.length; j++) {
                if (
                  this.TbaleData[i].rojectId == this.ProjectData[j].projectId
                ) {
                  this.TbaleData[i].projectName = this.ProjectData[
                    j
                  ].projectName;
                }
                if (this.TbaleData[i].ProjectId == 0) {
                  this.TbaleData[i].projectName = "默认项目";
                }
              }
            }
            this.ProTableData = this.TbaleData;
            console.log(this.ProTableData);
          });
        });
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.currpage = 1;
      this.GetTabularData();
    },
    handleCurrentChange(val) {
      this.currpage = val;
      this.GetTabularData();
    },
    jump(id) {
      console.log(id);
      this.$router.push({
        name: "CMMysqldetails",
        query: {
          id
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
.green {
  color: green;
}

.red {
  color: red;
}

.orange {
  color: orange;
}

.tool {
  display: flex;
  justify-content: space-between;
  margin: 20px 20px 0 20px;
}

.CVM-title {
  background: #fff;
  line-height: 60px;
  font-weight: bold;
  padding-left: 20px;
  font-size: 16px;
}

.Right-style {
  display: flex;
  justify-content: flex-end;

  .esach-inputL {
    width: 300px;
    margin-right: 20px;
  }
}

.Table-SY {
  background: #fff;
  margin: 20px;
}

.pagstyle {
  padding: 20px;
}
</style>

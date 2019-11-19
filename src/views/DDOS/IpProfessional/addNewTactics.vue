<template>
  <div>
    <!-- 策略名称 -->
    <div>
      <span class="fontWeightBold">策略名称</span><el-input class="tacticsName" v-model="tacticsName"></el-input>
    </div>
    <!-- 黑白名单表格 -->
    <div>
      <span class="fontWeightBold">黑白名单</span>
      <div class="tableConOne">
        <div class="tableConOneTop newClear">
          <el-button type="primary">添加</el-button>
          <span class="rightSearch">
            <el-input
              v-model="tableDataName1"
              class="searchs"
              placeholder="请输入要查询的内容"
            ></el-input>
            <el-button class="el-icon-search" @click="doFilter"></el-button>
          </span>
        </div>
        <div>
          <el-table :data="tableDataBegin1.slice((currentPage-1)*pageSize,currentPage*pageSize)">
            <el-table-column prop="strategy" label="策略"></el-table-column>
            <el-table-column prop="address" label="地址"></el-table-column>
            <el-table-column prop="action" label="操作" width="180">
              <template slot-scope="scope">
                <el-button
                  @click.native.prevent="editRow(scope.$index, scope.row)"
                  type="text"
                  size="small"
                >编辑</el-button>
                <el-button
                  @click.native.prevent="deleteRow(scope.$index, scope.row)"
                  type="text"
                  size="small"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="tabListPage">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalItems"
          ></el-pagination>
        </div>
      </div>
    </div>
    <!-- 高级安全策略 -->
    <div>
      <span class="fontWeightBold">高级安全策略</span>
      <!-- 禁用协议 -->
      <div class="childContTit">
        <h2>禁用协议</h2>
        <el-checkbox-group v-model="DdisableProtocol">
          <el-checkbox label="ICMP" name="type"></el-checkbox>
          <el-checkbox label="TCP" name="type"></el-checkbox>
          <el-checkbox label="UDP" name="type"></el-checkbox>
          <el-checkbox label="其他协议" name="type"></el-checkbox>
        </el-checkbox-group>
      </div>
      <!-- 禁用端口 -->
      <div class="childContTit">
        <h2>禁用端口</h2>
        <el-table :data="tableDataBegin2" class="tableBorderTop">
          <el-table-column prop="strategy" label="协议">
            <template>
              <el-select v-model="strategy">
                <el-option label="TCP" value="tcp"></el-option>
                <el-option label="UDP" value="udp"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="端口类型">
            <template>
              <el-select v-model="strategy">
                <el-option label="目的端口" value="tcp"></el-option>
                <el-option label="源端口" value="udp"></el-option>
                <el-option label="目的端口和源端口" value="udp"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="开始端口号">
            <template>
              <el-input></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="结束端口号">
            <template>
              <el-input></el-input>
            </template>
          </el-table-column>
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
        <a href="#" class="addNewRow">添加</a>
      </div>
      <!-- 报文过滤特征 -->
      <div class="childContTit">
        <h2>报文过滤特征</h2>
        <el-table :data="tableDataBegin2" class="tableBorderTop">
          <el-table-column prop="strategy" label="协议">
            <template>
              <el-select v-model="strategy">
                <el-option label="TCP" value="tcp"></el-option>
                <el-option label="UDP" value="udp"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="开始源端口">
            <template>
              <el-input></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="结束源端口">
            <template>
              <el-input></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="开始目的端口">
            <template>
              <el-input></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="结束目的端口">
            <template>
              <el-input></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="最小包长">
            <template>
              <el-input></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="最大包长">
            <template>
              <el-input></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="strategy" label="监测载荷">
            <template>
              <el-select v-model="strategy">
                <el-option label="不检测" value="tcp"></el-option>
                <el-option label="IP头开始检查" value="udp"></el-option>
                <el-option label="TCP/UDP头开始检查" value="tcp"></el-option>
                <el-option label="载荷开始检查" value="udp"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="strategy" label="正则表达式">
            <template>
              <el-select v-model="strategy">
                <el-option label="关键字" value="tcp"></el-option>
                <el-option label="正则表达式" value="udp"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="偏移量">
            <template>
              <el-input></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="检查深度">
            <template>
              <el-input></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="strategy" label="是否包括">
            <template>
              <el-select v-model="strategy">
                <el-option label="包含" value="tcp"></el-option>
                <el-option label="不包含" value="udp"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="字符串">
            <template>
              <el-input></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="strategy" label="策略">
            <template>
              <el-select v-model="strategy">
                <el-option label="丢弃报文" value="tcp"></el-option>
                <el-option label="丢弃且拉黑源IP" value="udp"></el-option>
                <el-option label="丢弃且断开连接" value="tcp"></el-option>
                <el-option label="丢弃, 断开连接且拉黑" value="udp"></el-option>
                <el-option label="直接转发" value="tcp"></el-option>
              </el-select>
            </template>
          </el-table-column>
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
        <a href="#" class="addNewRow">添加</a>
      </div>
      <!-- 限速 -->
      <div class="childContTit">
        <h2>限速</h2>
        <el-table :data="tableDataBegin2" class="tableBorderTop">
          <el-table-column prop="strategy" label="协议">
            <template>
              <el-select v-model="strategy">
                <el-option label="ICMP" value="tcp"></el-option>
                <el-option label="OTHER" value="udp"></el-option>
                <el-option label="TCP" value="tcp"></el-option>
                <el-option label="UDP" value="udp"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="限速阈值">
            <template>
              <el-input></el-input>Mbps
            </template>
          </el-table-column>
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
        <a href="#" class="addNewRow">添加</a>
      </div>
      <!-- 拒绝海外流量 -->
      <div class="childContTit">
        <h2>拒绝海外流量</h2>
        <span class="spanStyleLabel">特殊资源</span>
        <el-radio-group v-model="radios1">
          <el-radio label="关闭" name="radio1"></el-radio>
          <el-radio label="开启" name="radio1"></el-radio>
        </el-radio-group>
      </div>
      <!-- 连接耗尽防护 -->
      <div class="childContTit">
        <h2>连接耗尽防护</h2>
        <span class="spanStyleLabel">空连接防护<i class="el-icon-info"></i></span>
        <el-radio-group>
          <el-radio label="关闭"></el-radio>
          <el-radio label="开启"></el-radio>
        </el-radio-group><br/>
        <span class="spanStyleLabel">源新建连接限速</span>
        <el-radio-group>
          <el-radio label="关闭"></el-radio>
          <el-radio label="开启"></el-radio>
        </el-radio-group><br/>
        <span class="spanStyleLabel">源并发连接限制</span>
        <el-radio-group>
          <el-radio label="关闭"></el-radio>
          <el-radio label="开启"></el-radio>
        </el-radio-group><br/>
        <span class="spanStyleLabel">目的新建连接限速</span>
        <el-radio-group>
          <el-radio label="关闭"></el-radio>
          <el-radio label="开启"></el-radio>
        </el-radio-group><br/>
        <span class="spanStyleLabel">目的并发连接数限制</span>
        <el-radio-group>
          <el-radio label="关闭"></el-radio>
          <el-radio label="开启"></el-radio>
        </el-radio-group>
      </div>
      <!-- 异常连接检测 -->
      <div class="childContTit">
        <h2>异常连接检测<i class="el-icon-info"></i></h2>
        <span class="spanStyleLabel">源IP最大异常连接数</span>
        <el-radio-group>
          <el-radio label="关闭"></el-radio>
          <el-radio label="开启"></el-radio>
        </el-radio-group><br/>
        <span class="spanStyleLabel">Syn报文占比检测</span>
        <el-radio-group>
          <el-radio label="关闭"></el-radio>
          <el-radio label="开启"></el-radio>
        </el-radio-group><br/>
        <span class="spanStyleLabel">Syn报文数检测</span>
        <el-radio-group>
          <el-radio label="关闭"></el-radio>
          <el-radio label="开启"></el-radio>
        </el-radio-group><br/>
        <span class="spanStyleLabel">连接超时检测</span>
        <el-radio-group>
          <el-radio label="关闭"></el-radio>
          <el-radio label="开启"></el-radio>
        </el-radio-group><br/>
        <span class="spanStyleLabel">异常空连接防护</span>
        <el-radio-group>
          <el-radio label="关闭"></el-radio>
          <el-radio label="开启"></el-radio>
        </el-radio-group>
      </div>
      <!-- 水印防护 -->
      <div class="childContTit">
        <h2>水印防护</h2>
        <el-table :data="tableDataBegin2" class="tableBorderTop">
          <el-table-column label="TCP防护端口"></el-table-column>
          <el-table-column label="UDP防护端口"></el-table-column>
          <el-table-column label="UDP水印剥离"></el-table-column>
          <el-table-column label="策略开关"></el-table-column>
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
        <a href="#" class="addNewRow" @click="dialogVisible = true">点击开启</a>
        <el-dialog
          title="水印创建"
          :visible.sync="dialogVisible"
          width="50%"
          :before-close="handleClose">
          <div class="childContTit childContTitModel">
            <h2>TCP协议防护端口</h2>
            <el-table :data="tableDataBegin2" class="tableBorderTop">
              <el-table-column label="开始端口号">
                <template>
                  <el-input></el-input>
                </template>
              </el-table-column>
              <el-table-column label="结束端口号">
                <template>
                  <el-input></el-input>
                </template>
              </el-table-column>
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
            <a href="#" class="addNewRow">增加</a>
            <p>TCP防护端口最多可以配置5个端口段；不同端口段不可以互相重合；起止端口号相同则认为是一个端口；TCP或UDP协议端口段需要至少配置一条。</p>
          </div>
          <div class="childContTit childContTitModel">
            <h2>UDP协议防护端口</h2>
            <el-table :data="tableDataBegin2" class="tableBorderTop">
              <el-table-column label="开始端口号">
                <template>
                  <el-input></el-input>
                </template>
              </el-table-column>
              <el-table-column label="结束端口号">
                <template>
                  <el-input></el-input>
                </template>
              </el-table-column>
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
            <a href="#" class="addNewRow">增加</a>
            <p>UDP防护端口最多可以配置5个端口段；不同端口段不可以互相重合；起止端口号相同则认为是一个端口；TCP或UDP协议端口段需要至少配置一条。</p>
          </div>
          <div class="childContTit childContTitModel">
            <h2>
              <span class="hSpanTit">自动剥离UDP报文水印</span>
              <el-radio-group>
                <el-radio label="关闭"></el-radio>
                <el-radio label="开启"></el-radio>
              </el-radio-group>
            </h2>
            <p>数据报文经过安全防护系统后，自动剥离UDP报文中的水印，再传到源站。海外地区不支持。</p>
          </div>
          <div class="childContTit childContTitNoBorder">
            <h2>
              <span class="hSpanTit">偏移量</span>
              <el-input class="OffsetNum"></el-input>
            </h2>
            <p>指定水印标签在UDP报文中的偏移量，可填范围 0-99</p>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
          </span>
        </el-dialog>
      </div>
      <div class="bottomBtn">
        <el-button type="primary">确定</el-button>
        <el-button>取消</el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data(){
    return{
      tacticsName:"",
      tableDataName1:"",
      tableDataBegin1: [],
      tableDataBegin2:[],
      tableDataEnd: [],
      currentPage: 1,
      pageSize: 10,
      totalItems: 0,
      filterTableDataEnd: [],
      flag: false,
      multipleSelection: [],
      dialogVisible: false,
      filterConrent:"",
      DdisableProtocol:"",
      allData1:[
        {
          strategy:"白名单",
          address:"10.1.1.212"
        }
      ],
      radios1:""
    }
  },
  mounted() {
    this.getData1();
  },
  methods:{
    handleClose(done) {
      this.dialogVisible=false;
    },
    getData1() {
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
        this.tableDataBegin1 = this.allData1;
        // 将数据的长度赋值给totalItems
        this.totalItems = this.tableDataBegin1.length;
        if (this.totalItems > this.pageSize) {
          for (let index = 0; index < this.pageSize; index++) {
            this.tableDataEnd.push(this.tableDataBegin[index]);
          }
        } else {
          this.tableDataEnd = this.tableDataBegin1;
        }
      //});
    },
    // 搜索
    doFilter() {
      console.log(this.filterConrent);
      this.tableDataBegin1 = this.allData1;
      this.tableDataEnd = [];
      //每次手动将数据置空,因为会出现多次点击搜索情况
      this.filterTableDataEnd = [];
      this.tableDataBegin1.forEach((val, index) => {
        if (val.address==this.tableDataName1) {
          this.filterTableDataEnd.push(val);
          this.tableDataBegin1 = this.filterTableDataEnd;
        } else {
          this.filterTableDataEnd.push();
          this.tableDataBegin1 = this.filterTableDataEnd;
        }
      });
      //页面数据改变重新统计数据数量和当前页
      this.currentPage = 1;
      this.totalItems = this.filterTableDataEnd.length;
      //渲染表格,根据值
      this.currentChangePage(this.filterTableDataEnd);

      //页面初始化数据需要判断是否检索过
      this.flag = true;
    },
    openData() {},
    // 分页开始
    handleSizeChange(val) {
      this.pageSize = val;
      this.handleCurrentChange(this.currentPage);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      //需要判断是否检索
      if (!this.flag) {
        this.currentChangePage(this.tableDataEnd);
      } else {
        this.currentChangePage(this.filterTableDataEnd);
      }
    }, //组件自带监控当前页码
    currentChangePage(list) {
      let from = (this.currentPage - 1) * this.pageSize;
      let to = this.currentPage * this.pageSize;
      this.tableDataEnd = [];
      for (; from < to; from++) {
        if (list[from]) {
          this.tableDataEnd.push(list[from]);
        }
      }
    },
  }
}
</script>
<style lang="scss">
.newClear:after{
  display: block;
  clear:both;
  content:"";
}
.fontWeightBold{
  font-size:14px;
  font-weight: 600;
  color:#000;
  margin-right:10px;
  margin-top:12px;
  display: inline-block;
}
.tacticsName{
  width:120px!important;
  input{
    width:120px;
  }
}
.tableConOne{
  margin-top:20px;
  .rightSearch{
    float:right;
  }
}
.childContTit{
  margin-top:25px;
  margin-bottom:6px;
  h2{
    font-size:12px;
    font-weight: 600;
    color:#000;
    margin-bottom:15px;
  }
}
.tableBorderTop{
  border-top:1px solid #eaeaea;
  border-left:1px solid #eaeaea;
  border-right:1px solid #eaeaea!important;
}
.addNewRow{
  display: inline-block;
  width: 100%;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border: 1px solid #eaeaea;
  border-top: 0;
  border-bottom: 3px solid #eaeaea;
}
.spanStyleLabel{
  font-size:12px;
  color:#888;
  margin-right:50px;
  margin-bottom:25px;
  line-height:30px;
}
.el-icon-info{
  color:#888;
}
.bottomBtn{
  width:100%;
  border-top:1px solid #eaeaea;
  padding:20px 0;
  margin-top:20px;
}
.childContTitModel{
  padding-bottom:20px;
  border-bottom:1px solid #ddd;
  p{
    color:#888;
    font-size:12px;
    margin-top:12px;
  }
}
.childContTitNoBorder{
  padding-bottom:20px;
  p{
    color:#888;
    font-size:12px;
    margin-top:12px;
  }
  .OffsetNum{
    width:120px;
    input{
      width:120px;
    }
  }
}
.hSpanTit{
  margin-right:22px;
}
</style>
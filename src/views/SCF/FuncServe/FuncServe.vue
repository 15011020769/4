<template>
    <div>
        <div class="topFun">
            <span>函数服务</span>
            <el-input class="addressName" readonly="readonly" v-model="addressIpt"></el-input>
            <div>命名空间：
                <el-select class="nameSpace" v-model="nameSpaceValue" placeholder="default(1)" filterable >
                    <el-option
                        v-for="item in nameSpace"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <span><el-button class="setBtn">设置</el-button></span>
            <span><a href="#">函数服务帮助文档</a></span>
        </div>
        <div class="mainContainer">
            <div class="mainCon">
                <div class="tableTit newClear">
                    <el-button size="small" type="primary" class="newCreate">新建</el-button>
                    <el-input v-model="tableDataName" @change="doFilter" class='searchs' placeholder="请输入搜索内容"></el-input>
                </div>
                <div class="mainTable">
										<el-table :data="tableDataBegin.slice((currentPage-1)*pageSize,currentPage*pageSize)">
											<el-table-column prop="funName" label="函数名"></el-table-column>
											<el-table-column prop="funStatus" label="函数状态"></el-table-column>
											<el-table-column prop="monitor" label="监控"></el-table-column>
											<el-table-column prop="runMoent" label="运行环境"></el-table-column>
											<el-table-column prop="description" label="描述"></el-table-column>
											<el-table-column prop="funTabs" label="标签" width="70px"></el-table-column>
											<el-table-column prop="createTime" label="创建时间"></el-table-column>
											<el-table-column prop="changeTime" label="上次修改时间"></el-table-column>
											<el-table-column prop="operate" label="操作" width="180">
												<template slot-scope="scope">
													<el-button @click.native.prevent="deleteRow(scope.$index, tableDataBegin)" type="text" size="small">删除</el-button>
													<el-button type="text" size="small" @click="handelCopy(scope.$index, scope.row)">复制</el-button>
												</template>
											</el-table-column>
										</el-table>
                </div>
                <div class="tabListPage">
									<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalItems">
									</el-pagination>
								</div>
            </div>
        </div>
    </div>
</template>
<script>
import SCF_LIST from '@/constants'
    export default {
        data() {
            return{
                nameSpaceValue:"",
                nameSpace:[
                    {
                        value:1,
                        label:"default(1)"
                    },
                    {
                        value:2,
                        label:"default(2)"
                    }
                ],
                addressIpt:"中国台北",
                tableData: [
                    {
                        date: '1',
                        name: '赵',
                        address: '上海市普陀区金沙江路 1518 弄'
                    }, {
                        date: '2',
                        name: '钱',
                        address: '上海市普陀区金沙江路 1517 弄'
                    }, {
                        date: '2',
                        name: '孙',
                        address: '上海市普陀区金沙江路 1519 弄'
                    }, {
                        date: '4',
                        name: '李',
                        address: '上海市普陀区金沙江路 1516 弄'
                    }
                ],
                showTables:[
                    {
                        funName:"函数1",
                        funStatus:"正常",
                        monitor:"监控",
                        runMoent:"python2.7",
                        description:"啦啦啦啦啦啦",
                        funTabs:"123",
                        createTime:"2019-11-07 14：05：12",
                        changeTime:"2019-11-07 14：05：12"
                    },
                    {
                        funName:"函数3",
                        funStatus:"正常",
                        monitor:"监控",
                        runMoent:"python2.7",
                        description:"啦啦啦啦啦啦",
                        funTabs:"123",
                        createTime:"2019-11-07 14：05：12",
                        changeTime:"2019-11-07 14：05：12"
                    },
                    {
                        funName:"函数2",
                        funStatus:"正常",
                        monitor:"监控",
                        runMoent:"python2.7",
                        description:"啦啦啦啦啦啦",
                        funTabs:"123",
                        createTime:"2019-11-07 14：05：12",
                        changeTime:"2019-11-07 14：05：12"
                    },
                    {
                        funName:"函数6",
                        funStatus:"正常",
                        monitor:"监控",
                        runMoent:"python2.7",
                        description:"啦啦啦啦啦啦",
                        funTabs:"123",
                        createTime:"2019-11-07 14：05：12",
                        changeTime:"2019-11-07 14：05：12"
                    },
                    {
                        funName:"函数5",
                        funStatus:"正常",
                        monitor:"监控",
                        runMoent:"python2.7",
                        description:"啦啦啦啦啦啦",
                        funTabs:"123",
                        createTime:"2019-11-07 14：05：12",
                        changeTime:"2019-11-07 14：05：12"
                    },
                    {
                        funName:"函数6",
                        funStatus:"正常",
                        monitor:"监控",
                        runMoent:"python2.7",
                        description:"啦啦啦啦啦啦",
                        funTabs:"123",
                        createTime:"2019-11-07 14：05：12",
                        changeTime:"2019-11-07 14：05：12"
                    },
                    {
                        funName:"函数7",
                        funStatus:"正常",
                        monitor:"监控",
                        runMoent:"python2.7",
                        description:"啦啦啦啦啦啦",
                        funTabs:"123",
                        createTime:"2019-11-07 14：05：12",
                        changeTime:"2019-11-07 14：05：12"
                    },
                    {
                        funName:"函数7",
                        funStatus:"正常",
                        monitor:"监控",
                        runMoent:"python2.7",
                        description:"啦啦啦啦啦啦",
                        funTabs:"123",
                        createTime:"2019-11-07 14：05：12",
                        changeTime:"2019-11-07 14：05：12"
                    },
                    {
                        funName:"函数7",
                        funStatus:"正常",
                        monitor:"监控",
                        runMoent:"python2.7",
                        description:"啦啦啦啦啦啦",
                        funTabs:"123",
                        createTime:"2019-11-07 14：05：12",
                        changeTime:"2019-11-07 14：05：12"
                    },
                    {
                        funName:"函数7",
                        funStatus:"正常",
                        monitor:"监控",
                        runMoent:"python2.7",
                        description:"啦啦啦啦啦啦",
                        funTabs:"123",
                        createTime:"2019-11-07 14：05：12",
                        changeTime:"2019-11-07 14：05：12"
                    },
                    {
                        funName:"函数7",
                        funStatus:"正常",
                        monitor:"监控",
                        runMoent:"python2.7",
                        description:"啦啦啦啦啦啦",
                        funTabs:"123",
                        createTime:"2019-11-07 14：05：12",
                        changeTime:"2019-11-07 14：05：12"
                    },
                    {
                        funName:"函数7",
                        funStatus:"正常",
                        monitor:"监控",
                        runMoent:"python2.7",
                        description:"啦啦啦啦啦啦",
                        funTabs:"123",
                        createTime:"2019-11-07 14：05：12",
                        changeTime:"2019-11-07 14：05：12"
                    }
								],
								search:"",
								allData: [
									{
											"funName":"函数1",
											"funStatus":"正常",
											"monitor":"监控",
											"runMoent":"python2.7",
											"description":"啦啦啦啦啦啦",
											"funTabs":"123",
											"createTime":"2019-11-07 14：05：12",
											"changeTime":"2019-11-07 14：05：12"
									},
									{
											"funName":"函数3",
											"funStatus":"正常",
											"monitor":"监控",
											"runMoent":"python2.7",
											"description":"啦啦啦啦啦啦",
											"funTabs":"123",
											"createTime":"2019-11-07 14：05：12",
											"changeTime":"2019-11-07 14：05：12"
									},
									{
											"funName":"函数2",
											"funStatus":"正常",
											"monitor":"监控",
											"runMoent":"python2.7",
											"description":"啦啦啦啦啦啦",
											"funTabs":"123",
											"createTime":"2019-11-07 14：05：12",
											"changeTime":"2019-11-07 14：05：12"
									},
									{
											"funName":"函数6",
											"funStatus":"正常",
											"monitor":"监控",
											"runMoent":"python2.7",
											"description":"啦啦啦啦啦啦",
											"funTabs":"123",
											"createTime":"2019-11-07 14：05：12",
											"changeTime":"2019-11-07 14：05：12"
									},
									{
											"funName":"函数5",
											"funStatus":"正常",
											"monitor":"监控",
											"runMoent":"python2.7",
											"description":"啦啦啦啦啦啦",
											"funTabs":"123",
											"createTime":"2019-11-07 14：05：12",
											"changeTime":"2019-11-07 14：05：12"
									},
									{
											"funName":"函数6",
											"funStatus":"正常",
											"monitor":"监控",
											"runMoent":"python2.7",
											"description":"啦啦啦啦啦啦",
											"funTabs":"123",
											"createTime":"2019-11-07 14：05：12",
											"changeTime":"2019-11-07 14：05：12"
									},
									{
											"funName":"函数7",
											"funStatus":"正常",
											"monitor":"监控",
											"runMoent":"python2.7",
											"description":"啦啦啦啦啦啦",
											"funTabs":"123",
											"createTime":"2019-11-07 14：05：12",
											"changeTime":"2019-11-07 14：05：12"
									},
									{
											"funName":"函数7",
											"funStatus":"正常",
											"monitor":"监控",
											"runMoent":"python2.7",
											"description":"啦啦啦啦啦啦",
											"funTabs":"123",
											"createTime":"2019-11-07 14：05：12",
											"changeTime":"2019-11-07 14：05：12"
									},
									{
											"funName":"函数7",
											"funStatus":"正常",
											"monitor":"监控",
											"runMoent":"python2.7",
											"description":"啦啦啦啦啦啦",
											"funTabs":"123",
											"createTime":"2019-11-07 14：05：12",
											"changeTime":"2019-11-07 14：05：12"
									},
									{
											"funName":"函数7",
											"funStatus":"正常",
											"monitor":"监控",
											"runMoent":"python2.7",
											"description":"啦啦啦啦啦啦",
											"funTabs":"123",
											"createTime":"2019-11-07 14：05：12",
											"changeTime":"2019-11-07 14：05：12"
									},
									{
											"funName":"函数7",
											"funStatus":"正常",
											"monitor":"监控",
											"runMoent":"python2.7",
											"description":"啦啦啦啦啦啦",
											"funTabs":"123",
											"createTime":"2019-11-07 14：05：12",
											"changeTime":"2019-11-07 14：05：12"
									},
									{
											"funName":"函数7",
											"funStatus":"正常",
											"monitor":"监控",
											"runMoent":"python2.7",
											"description":"啦啦啦啦啦啦",
											"funTabs":"123",
											"createTime":"2019-11-07 14：05：12",
											"changeTime":"2019-11-07 14：05：12"
									}
								],
								tableDataBegin: [],
								tableDataName: "",
								tableDataEnd: [],
								currentPage: 1,
								pageSize: 10,
								totalItems: 0,
								filterTableDataEnd: [],
								flag: false,
								multipleSelection: []
						}
        },
        computed: {
            // 模糊搜索
            
        },
        
        methods: {
					getData() {
					// var cookies=document.cookie;
					// var list=cookies.split(";");
					// for(var i=0;i<list.length;i++){
					// 	var arr=list[i].split("=");
					// }
					// console.log(arr[1])
					// let params = {
					// 	Action: ListFunctions, // 结束时间1558108799
					// 	Version: "2018-04-16",
					// 	Region:
					// }
					//this.$axios.get(SCF_LIST, {}).then((res) => {
						// console.log(res.data.tableData);
						//this.tableDataBegin = res.data.dataTable;
						//this.allData = this.tableDataBegin;
						this.tableDataBegin = this.allData
						// 将数据的长度赋值给totalItems
						this.totalItems = this.tableDataBegin.length;
						if (this.totalItems > this.pageSize) {
							for (let index = 0; index < this.pageSize; index++) {
								this.tableDataEnd.push(this.tableDataBegin[index]);
							}
						} else {
							this.tableDataEnd = this.tableDataBegin;
						}
					//})

				},
				// 搜索
				doFilter() {
					console.log(1)
					this.tableDataBegin = this.allData;
					this.tableDataEnd = []
						//每次手动将数据置空,因为会出现多次点击搜索情况
					this.filterTableDataEnd = []
					this.tableDataBegin.forEach((val, index) => {
						if (val.funName) {
							if (val.funName.indexOf(this.tableDataName) == 0) {
								this.filterTableDataEnd.push(val);
								this.tableDataBegin = this.filterTableDataEnd;
							} else {
								this.filterTableDataEnd.push();
								this.tableDataBegin = this.filterTableDataEnd;
							}
						};
					});
					//页面数据改变重新统计数据数量和当前页
					this.currentPage = 1
					this.totalItems = this.filterTableDataEnd.length
						//渲染表格,根据值
					this.currentChangePage(this.filterTableDataEnd);

					//页面初始化数据需要判断是否检索过
					this.flag = true;

				},

				openData() {},
				// 分页开始
				handleSizeChange(val) {
					console.log(`每页 ${val} 条`);
					this.pageSize = val;
					this.handleCurrentChange(this.currentPage);
				},
				handleCurrentChange(val) {
					console.log(`当前页: ${val}`);
					this.currentPage = val;
					//需要判断是否检索
					if (!this.flag) {
						this.currentChangePage(this.tableDataEnd)
					} else {
						this.currentChangePage(this.filterTableDataEnd)
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
				}
			},
			created: function() {
				this.getData();
			}
    }
    
</script>
<style lang="scss">
.newClear:after{
  display: block;
  content:"";
  clear:both;
}
.topFun{
  width:100%;
  height:52px;
  background-color:#fff;
  line-height: 52px;
  border-bottom:1px solid #eee;
  padding:0 20px;
  button{
      float:left;
  }
  .setBtn{
    margin-left:12px;
  }
  span:nth-child(1){
    font-size: 16px;
    font-weight: 600;
    color:#000;
    float:left;
  }
  div:nth-child(3){
    float:left;
    .nameSpace{
			height:30px;
			width:200px;
			border-radius: 0;
			div.el-input{
				width:200px;
				.el-input__inner{
						display: inline-block;
						height:30px;
						width:200px;
						line-height: 30px;
						border-radius: 0;
				}
			}
    }
    
  }

  span:nth-child(5){
    font-size:14px;
    color:#888;
    float:right;
    a{
      color:#888;
    }
  }
}

.addressName{
	height: 30px;
	line-height: 30px;
	border-radius: 0;
	padding: 0 20px;
	margin-top: 10px;
	float: left;
	width: 130px!important;
	input{
		height:30px;
		border-radius: 0;
	}
}

.mainContainer{
  width:100%;
  padding:20px 20px;
  box-sizing: border-box;
}
.tableTit{
  padding:0 0 10px;
	.newCreate{
		float:left;
	}
	.searchs{
		width:500px;
		float:right;
	}
}
.mainTable{
    // padding:20px 0;
	width:100%;
	min-height:150px;
	background-color:#fff;
	border-radius: 4px;
	border:1px solid #eee;
	box-shadow: 0 2px 3px 0 rgba(0,0,0,.2);
}

</style>
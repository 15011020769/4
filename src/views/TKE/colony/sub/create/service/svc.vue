 <!-- 新建Service -->
<template>
  <div class="colony-wrap">
    <div class="tke-content-header">
      <div class="tke-grid ">
        <!-- 左侧 -->
        <div class="grid-left">
          <span class="goback" @click="goBack">
            <i class="el-icon-back"></i>
          </span>
          <h2 class="header-title">新建Service</h2>
        </div>
        <!-- 右侧 -->
        <div class="grid-right"></div>
      </div>
    </div>  
    <div class="colony-main">
      <div class="tke-card tke-formpanel-wrap mb60">
        <el-form  class="tke-form" :model="svc" label-position='left' label-width="120px" size="mini">
					<div style="padding: 0 10px 10px 10px;border-bottom:1px solid #dcdfe6;">
						<h3 style="margin-bottom:11px;">基本信息</h3>
						<el-form-item label="名称">
							<el-input class="w200" v-model="svc.name" placeholder="请输入名称"></el-input>
							<p>最长63个字符，只能包含小写字母、数字及分隔符("-")，且必须以小写字母开头，数字或小写字母结尾</p>
						</el-form-item>
						<el-form-item label="描述">
							<textarea name="" class="ms" placeholder="请输入描述信息，不超过1000个字符" id="" cols="30" rows="10"></textarea>
						</el-form-item>
						<el-form-item label="命名空间">
							<el-select v-model="svc.value" placeholder="请选择">
								<el-option
									v-for="(item,index) in svc.options"
									:key="index"
									:label="item"
									:value="item">
								</el-option>
							</el-select>
						</el-form-item>
					</div>
					<Service></Service>	
					<div class="card">
						<h3 style="padding-bottom:20px;">Workload（选填）</h3>
						<el-form-item label="Selectors">
							<div style="padding-bottom:10px;" v-for="it in svc.workload" :key="it.key">
								<el-input placeholder="key" class="w100"></el-input>=
								<el-input placeholder="value" class="w100"></el-input>
								<el-tooltip class="item" effect="dark" content="删除" placement="right">
									<i style="font-size:18px;padding-left:20px;" class="el-icon-close" @click="removework(it)"></i>
								</el-tooltip>
							</div>
							<div>
								<a href="javascript:;" @click="addwork()">添加</a> | <a href="javascript:;" @click="dialogFormVisible = true">引用Workload</a>
							</div>
						</el-form-item>
					</div>
        </el-form>

       
        <!-- 底部 -->
        <div class="tke-formpanel-footer">
          <el-button size="small" type="primary">创建Service</el-button>
          <el-button size="small">取消</el-button>
        </div>
      </div>
    </div>
		<!-- 幕布层 -->
		<el-dialog title="收货地址" :visible.sync="dialogFormVisible">
			<el-form label-width="100px">
				<el-form-item label="资源类型">
					<el-radio-group v-model="svc.tabPosition" style="margin-left:70px;">
						<el-radio-button label="dep">Deploymemt</el-radio-button>
						<el-radio-button label="state">Statefulset</el-radio-button>
						<el-radio-button label="daem">Daemonset</el-radio-button>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="资源列表">
					<el-select v-model="svc.value" placeholder="请选择" style="margin-left:70px;">
						<el-option
							v-for="item in svc.options"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
					<div style="margin-left:70px;">无可用资源，可前往<a href="">资源控制台</a>新建</div>
				</el-form-item>
				<el-form-item label="Labels">
					<div style="margin-left:70px;">请先选择Workload</div>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
			</div>
		</el-dialog>
  </div>
	
</template>

<script>
import Service from './components/Service'
import FileSaver from "file-saver";
import XLSX from "xlsx";
import { ALL_CITY } from "@/constants";
export default {
  name: "svcCreate",
  data() {
    return {
			dialogFormVisible: false,
      svc: {
				show: true,
				time: 30,
				checked:false,
        name: '',
				value: 'default',
				options: ['default','kube-public','kube-system','tfy-pub'],
				radio: '1',
				ETP: '1',
				SA: '2',
				input: '',
				list: [{}],
				workload: [],
				tabPosition: 'dep'
      }  
    };
  },
  components: {
    Service
  },
  created() {
     // 从路由获取类型

  },
  methods: {
		handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
		// 删除work
		removework(item){
			var index = this.svc.workload.indexOf(item)
			if(index !== -1){
				this.svc.workload.splice(index,1)
			}
		},
		// 删除端口
		// removeprot(item){
		// 	var index = this.svc.list.indexOf(item)
		// 	if(index !== -1){
		// 		this.svc.list.splice(index,1)
		// 	}
		// },
		// 新增work
		addwork(){
			this.svc.workload.push({
				value: '',
				key: Date.now()
			})
		},
		// 新增端口
		// addport(){
		// 	this.svc.list.push({
		// 		value: '',
		// 		key: Date.now()
		// 	})
		// },
		// 显示或隐藏高级设置
		// show(){
		// 	this.svc.show = !this.svc.show;
		// },
    //返回上一层
    goBack(){
          this.$router.go(-1);
    },
  }
};
</script>

<style lang="scss" scoped>
.shadow {
	z-index: 999;
	float: left;
	width:100%;
	height: 900px;
	opacity: 0.6;
	background: black;
}
.w250 {
	width:250px;
}
.w100 {
	width:100px;
}
.flex {
	display: flex;
}
.port {
	max-width: 680px;
	border: 1px solid #ddd;
}
.card {
	padding: 10px;border-bottom:1px solid #dcdfe6;
}
.text-error {
	color: #e54545;
}
.text-warning {
 color: #ff9d00
}
.ms {
	width: 330px;
	padding: 5px 8px 8px 5px;
	height: 100px;
	border-radius: 4px;
	border: 1px solid #dcdfe6;
	resize: none;
}
</style>


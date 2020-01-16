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
					<div class="card">
						<h3 style="margin-bottom:11px;">访问设置(Service)</h3>
						<el-form-item label="服务访问方式">
							<el-radio v-model="svc.radio" label="1">提供公网访问</el-radio>
  						<el-radio v-model="svc.radio" label="2">仅在集群内访问</el-radio>
							<el-radio v-model="svc.radio" label="3">VPC内网访问</el-radio>
							<el-radio v-model="svc.radio" label="4">主机端口访问</el-radio>
							<a href="" style="padding-left:10px;">如何选择</a><i class="el-icon-edit-outline"></i>
							<!-- 方式介绍 -->
							<div>
								<div v-if="svc.radio=='1'">
									<div>
										自动创建公网CLB（<span class="text-warning">0.02元/小时</span>）以提供Internet访问入口，支持TCP/UDP协议，如web前台类服务可以选择公网访问。
									</div>
									<div>
										如您需要公网通过HTTP/HTTPS协议或根据URL转发，您可以在Ingress页面使用Ingress进行路由转发，<a href="">查看详情</a><i class="el-icon-edit-outline"></i>
									</div>
								</div>
								<div v-if="svc.radio=='2'">
									<div>将提供一个可以被集群内其他服务或容器访问的入口，支持TCP/UDP协议，数据库类服务如Mysql可以选择集群内访问,来保证服务网络隔离性。</div>
									<div>
										<el-checkbox v-model="svc.checked">Headless&nbsp;Service</el-checkbox>
										<el-tooltip content="不创建用于集群内访问的ClusterIP,访问Service名称时返回后端Pods IP地址,用于适配自有的服务发现机制。" placement="top" effect="light">
										<i class="el-icon-question" style="margin-left:5px;"></i>
										</el-tooltip>
										（Headless&nbsp;Service只支持创建时选择，<span class="text-error">创建完成后不支持变更访问方式）</span>
									</div>
								</div>
								<div v-if="svc.radio=='3'">
									<div>将提供一个可以被集群所在VPC下的其他资源访问的入口，支持TCP/UDP协议，需要被同一VPC下其他集群、云服务器等访问的服务可以选择VPC内网访问的形式。</div>
									<div>支持Ingress<a href="">查看详情</a><i class="el-icon-edit-outline"></i></div>
								</div>
								<div v-if="svc.radio=='4'">
									<div>提供一个主机端口映射到容器的访问方式，支持TCP&UDP， 可用于业务定制上层LB转发到Node。</div>
									<div>支持Ingress<a href="">查看详情</a><i class="el-icon-edit-outline"></i></div>
								</div>
							</div>
						</el-form-item>
						<el-form-item label="端口映射">
							<div class="port">
								<!-- 头部 -->
								<div class="flex">
									<div style="width:140px;padding-left:14px">协议
										<el-tooltip content="使用公网/内网负载均衡时，TCP和UDP协议不能混合使用" placement="top" effect="light">
										<i class="el-icon-warning"></i>
										</el-tooltip>
									</div>
									<div style="width:250px;">容器端口
										<el-tooltip content="端口范围1~65535" placement="top" effect="light">
										<i class="el-icon-warning"></i>
										</el-tooltip>
									</div>
									<div>服务端口
										<el-tooltip content="集群外通过负载均衡域名或IP+服务端口访问服务，集群内通过服务名+服务端口访问服务" placement="top" effect="light">
										<i class="el-icon-warning"></i>
										</el-tooltip>
									</div>
								</div>
								<!-- 内容 -->
								<div style="border-top:1px solid #ddd;padding: 10px;">
									<div style="padding:5px 0;" v-for="it in svc.list" :key="it.key">
										<el-select class="w100" v-model="svc.value" placeholder="请选择">
										<el-option
											v-for="item in svc.options"
											:key="item.value"
											:label="item.label"
											:value="item.value">
										</el-option>
										</el-select>
										<el-input class="w250" style="padding-left:30px;" v-model="svc.input" placeholder="请输入内容"></el-input>
										<el-input class="w250" style="padding-left:30px;" v-model="svc.input" placeholder="请输入内容"></el-input>
										<el-tooltip class="item" effect="dark" content="删除" placement="right">
											<i style="font-size:18px;padding-left:20px;" class="el-icon-close" @click="removeprot(it)"></i>
										</el-tooltip>
									</div>					
								</div>
							</div>
							<a href="javascript:;" @click="addport()">添加端口映射</a>
						</el-form-item>
						<!-- 高级设置 -->
						<div v-if="svc.show">
							<h3 style="padding-bottom:10px;">高级设置（选填）</h3>
							<el-form-item label-width="150px" label="ExtermalTrafficPolicy">
								<el-radio v-model="svc.ETP" label="1">Cluster</el-radio>
  							<el-radio v-model="svc.ETP" label="2">Local</el-radio>
								<div v-if="svc.ETP=='1'">默认均衡转发到工作负载的所有Pod</div>
								<div v-if="svc.ETP=='2'">能够保留来源IP，并可以保证公网、VPC内网访问（LoadBalancer）和主机端口访问（NodePort）模式下流量仅在本节点转发。Local转发使部分没有业务Pod存在的节点健康检查失败，可能存在流量不均衡的转发的风险。</div>
							</el-form-item>
							<div>
								<el-form-item label-width="150px" label="Session Affinity">
									<el-radio v-model="svc.SA" label="1">ClienIP</el-radio>
  								<el-radio v-model="svc.SA" label="2">None</el-radio>
								</el-form-item>
								<div v-if="svc.SA=='1'">
									<el-form-item label-width="150px" label="最大会话保持时间">
										<el-input v-model="svc.time" class="w200"></el-input>
										<div>会话保持时间范围为0~86400</div>
									</el-form-item>
								</div>
							</div>
						</div>
						<div v-if="!svc.show"><a href="javascript:;" @click="show()">显示高级设置</a></div>
						<div v-if="svc.show"><a href="javascript:;" @click="show()">隐藏高级设置</a></div>
					</div>
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
		removeprot(item){
			var index = this.svc.list.indexOf(item)
			if(index !== -1){
				this.svc.list.splice(index,1)
			}
		},
		// 新增work
		addwork(){
			this.svc.workload.push({
				value: '',
				key: Date.now()
			})
		},
		// 新增端口
		addport(){
			this.svc.list.push({
				value: '',
				key: Date.now()
			})
		},
		// 显示或隐藏高级设置
		show(){
			this.svc.show = !this.svc.show;
		},
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


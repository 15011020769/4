<template>
	<div class="card">
		<h3 style="margin-bottom:11px;">访问设置(Service)</h3>
		<el-form-item label="服务访问方式">
			<el-radio v-model="svc.radio" label="1">提供公网访问</el-radio>
			<el-radio v-model="svc.radio" label="2">仅在集群内访问</el-radio>
			<el-radio v-model="svc.radio" label="3">VPC内网访问</el-radio>
			<el-radio v-model="svc.radio" label="4">主机端口访问</el-radio>
			<a href="#" style="padding-left:10px;">如何选择</a><i class="el-icon-edit-outline"></i>
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
					<div>支持Ingress<a href="#">查看详情</a><i class="el-icon-edit-outline"></i></div>
				</div>
				<div v-if="svc.radio=='4'">
					<div>提供一个主机端口映射到容器的访问方式，支持TCP&UDP， 可用于业务定制上层LB转发到Node。</div>
					<div>支持Ingress<a href="#">查看详情</a><i class="el-icon-edit-outline"></i></div>
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
</template>

<script>
export default {
	data(){
		return{
			svc:{
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
		}
	},
	methods:{
		// 显示或隐藏高级设置
		show(){
			this.svc.show = !this.svc.show;
		},
		// 删除端口
		removeprot(item){
			var index = this.svc.list.indexOf(item)
			if(index !== -1){
				this.svc.list.splice(index,1)
			}
		},
		// 新增端口
		addport(){
			this.svc.list.push({
				value: '',
				key: Date.now()
			})
		},
	}
}
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
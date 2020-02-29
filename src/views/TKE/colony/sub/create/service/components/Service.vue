<template>
	<div class="card">
		<h3 style="margin-bottom:11px;">访问设置(Service)</h3>
		<el-form-item label="服务访问方式">
			<el-radio v-model="svc.radio" label="1">提供公网访问</el-radio>
			<el-radio v-model="svc.radio" label="2">仅在集群内访问</el-radio>
			<el-radio v-model="svc.radio" label="3">VPC内网访问</el-radio>
			<el-radio v-model="svc.radio" label="4">主机端口访问</el-radio>
			<a href="javascript:;" target="_blank" style="padding-left:10px;">如何选择</a><i class="el-icon-edit-outline"></i>
			<!-- 方式介绍 -->
			<div>
				<div v-if="svc.radio=='1'">
					<div>
						自动创建公网CLB（<span class="text-warning">0.02元/小时</span>）以提供Internet访问入口，支持TCP/UDP协议，如web前台类服务可以选择公网访问。
					</div>
					<div>
						如您需要公网通过HTTP/HTTPS协议或根据URL转发，您可以在Ingress页面使用Ingress进行路由转发，<a href="javascript:;">查看详情</a><i class="el-icon-edit-outline"></i>
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

    <el-form-item v-if="svc.radio=='3'" label="LB所在子网">
			<el-select v-model="svc.LBvalue1" placeholder="请选择" disabled>
				<el-option
					v-for="item in personObj.vpcNameAry"
					:key="item.VpcName"
					:label="item.VpcName"
					:value="item.VpcName">
				</el-option>
			</el-select>
			<el-select v-model="svc.LBvalue2" placeholder="请选择">
				<el-option
					v-for="item in personObj.LBsubnet"
					:key="item.SubnetName"
					:label="item.SubnetName"
					:value="item.SubnetName">
				</el-option>
			</el-select>
			<el-button style="border:none;"><i class="el-icon-refresh"></i></el-button>
			共<span>{{addressCount.TotalIpAddressCount}}</span>个子网点，剩下<span>{{addressCount.AvailableIpAddressCount}}</span>个可用
		</el-form-item>

		<el-form-item label="负载均衡器" v-if="svc.radio=='1' || svc.radio=='3'">
			<div class="radio1">
			<el-radio-group v-model='svc.loadBalance' style="margin-bottom: 5px;">
        <el-radio-button label="1">自动创建</el-radio-button>
        <el-radio-button label="2">使用已有</el-radio-button>
      </el-radio-group>

			</div>
			<p v-show="svc.loadBalance=='1'">自动创建CLB用于公网/内网访问Service，请勿手动修改由TKE创建的CLB监听器，<a href="javascript:;">查看更多说明</a></p>
			<div v-show="svc.loadBalance=='2'">使用已有的CLB用于公网/内网访问Service，不覆盖已有监听器规则，请勿手动修改由TKE创建的CLB监听器，仅支持未被容器服务TKE使用的CLB<a href="javascript:;">查看更多说明</a>
			<p>
				<el-select v-model="svc.balancerValue" placeholder="请选择">
					<el-option
						v-for="item in personObj.ownLoadBalancer"
						:key="item.LoadBalancerId"
						:label="item.LoadBalancerId+'  ('+item.LoadBalancerName+')'"
						:value="item.LoadBalancerId+'  ('+item.LoadBalancerName+')'">
					</el-option>
				</el-select>
			</p>
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
					<div style="padding-left:30px">服务端口
						<el-tooltip content="集群外通过负载均衡域名或IP+服务端口访问服务，集群内通过服务名+服务端口访问服务" placement="top" effect="light">
						<i class="el-icon-warning"></i>
						</el-tooltip>
					</div>
				</div>
				<!-- 内容 -->
				<div style="border-top:1px solid #ddd;padding: 10px;">
					<div style="padding:5px 0;" v-for="(it,i) in svc.list" :key="it.key">
						<el-form-item style="display: inline-block">
							<!-- <el-select class="w100" v-model="svc.protocol" placeholder="请选择"> -->
							<el-select class="w100" v-model="it.protocol" placeholder="请选择">
						    <el-option
						    	v-for="item in protocolList"
						    	:key="item"
						    	:label="item"
						    	:value="item">
						    </el-option>
						  </el-select>
						</el-form-item>
						<el-form-item style="display: inline-block;padding-left:30px;"  :prop="`list.${i}.input1`" :rules="verifyPort">
						  <el-input class="w250" v-model="it.input1" placeholder="请输入内容"></el-input>
						</el-form-item>
						<el-form-item style="display: inline-block;padding-left:30px;"  :prop="`list.${i}.input2`" :rules="verifyPort">
						  <el-input class="w250" v-model="it.input2" placeholder="请输入内容"></el-input>
						</el-form-item>
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
					<el-form-item prop="time" :rules="timeRules" label-width="150px" label="最大会话保持时间">
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
  props: ['personObj', 'svcData'],
  data () {
    return {
      svc: this.svcData,
      // TotalIpAddressCount: '', // 总共的子网数
      // AvailableIpAddressCount: '', // 剩余可用子网数
      protocolList: ['TCP', 'UDP'], // 协议列表
      addressCount: {}, // 子网点对象
      // 会话事件的验证
      timeRules: [{
        validator: (rule, value, callback) => {
          if (value > 0 && value < 68400) {
            callback()
          } else if (!value) {
            callback(new Error('会话保持时间不能为空'))
          } else if (value < 0 && value > 68400) {
            callback(new Error('不在会话保持时间范围'))
          } else if (/^\d+\.\d+$/.test(value)) {
            callback(new Error('会话保持时间格式错误'))
          } else {
            callback(new Error('会话保持时间格式错误'))
          }
        },
        trigger: 'blur',
        required: true
      }],
      // 端口映射的验证
      verifyPort: [
        { validator: (rule, value, callback) => {
          let portNumber = /^([1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]{1}|6553[0-5])$/
          if (!value) {
            callback(new Error('端口号不能为空'))
          } else if (!portNumber.test(value)) {
            callback(new Error('端口号格式不正确'))
          } else {
            callback()
          }
        },
        trigger: 'blur',
        required: true }
      ]
    }
  },
  created: function () {
    this.addport()
  },
  watch: {
    svc: {
      handler: function (val) {
        this.$emit('update:svcData', val)
      },
      deep: true,
      immediate: true
    },
    svcData: {
      handler: function (val) {
        this.svc = val
      },
      deep: true,
      immediate: true
    },
  	'svc.LBvalue2': function (val) {
  		this.addressCount = this.personObj.LBsubnet.find(item => {
        return item.SubnetName === val
      })
    },
    personObj: {
      handler: function () {
        let { LBsubnet, vpcNameAry, ownLoadBalancer } = this.personObj
        if (!(LBsubnet[0] && vpcNameAry[0] && ownLoadBalancer[0])) return
        this.svc.LBvalue2 = LBsubnet[0].SubnetName
        this.svc.LBvalue1 = vpcNameAry[0].VpcName
        this.svc.balancerValue = ownLoadBalancer[0].LoadBalancerId + ' (' + ownLoadBalancer[0].LoadBalancerName + ')'
      }
    }
  },
  methods: {
    // 显示或隐藏高级设置
    show () {
      this.svc.show = !this.svc.show
      // console.log(this.personObj.ownLoadBalancer)
    },
    // 删除端口
    removeprot (item) {
      var index = this.svc.list.indexOf(item)
      if (index !== -1) {
        this.svc.list.splice(index, 1)
      }
    },
    // 新增端口
    addport () {
      // console.log(this.svc.list)
      this.svc.list.push({
        value: '',
        input1: '',
        input2: '',
        protocol: 'TCP',
        key: Date.now()
      })
    }
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
	max-width: 720px;
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

// .radio1 {
//    ::v-deep .el-radio-button__orig-radio:checked + .el-radio-button__inner {
//               border: 1px solid #006eff;
//               color: #006eff;
//               background: #fff;
//               box-shadow: unset;
//             }
// }
</style>

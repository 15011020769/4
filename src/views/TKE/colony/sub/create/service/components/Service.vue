<template>
	<div class="card">
		<h3 style="margin-bottom:11px;">{{$t('TKE.subList.fwsz')}}(Service)</h3>
		<el-form-item :label="$t('TKE.subList.fwfwfs')">
			<el-radio v-model="svc.radio" label="1">{{$t('TKE.subList.tggwfw')}}</el-radio>
			<el-radio v-model="svc.radio" label="2">{{$t('TKE.subList.jzjqnfw')}}</el-radio>
			<el-radio v-model="svc.radio" label="3">{{$t('TKE.subList.vpcnwfw')}}</el-radio>
			<el-radio v-model="svc.radio" label="4">{{$t('TKE.subList.zjdkfw')}}</el-radio>
			<!-- <a href="javascript:;" target="_blank" style="padding-left:10px;">如何选择</a><i class="el-icon-edit-outline"></i> -->
			<!-- 方式介绍 -->
			<div>
				<div v-if="svc.radio=='1'">
					<div>
						{{$t('TKE.subList.zdcjgw')}}（<span class="text-warning">0.02元/{{$t('TKE.colony.xs')}}</span>）{{$t('TKE.subList.xzgwfw')}}。
					</div>
					<div>
						{{$t('TKE.subList.lyzf')}}，
            <!-- <a href="javascript:;">查看详情</a><i class="el-icon-edit-outline"></i> -->
					</div>
				</div>
				<div v-if="svc.radio=='2'">
					<div>{{$t('TKE.subList.bzfwwlglx')}}。</div>
					<div>
						<el-checkbox v-model="svc.checked">Headless&nbsp;Service</el-checkbox>
						<el-tooltip :content="$t('TKE.subList.yyjz')" placement="top" effect="light">
						<i class="el-icon-question" style="margin-left:5px;"></i>
						</el-tooltip>
						（Headless&nbsp;Service{{$t('TKE.subList.zzccjsxz')}}，<span class="text-error">{{$t('TKE.subList.bzcbgfw')}}）</span>
					</div>
				</div>
				<div v-if="svc.radio=='3'">
					<div>{{$t('TKE.subList.nwfwxs')}}</div>
					<div>支持Ingress
            <!-- <a href="">查看详情</a><i class="el-icon-edit-outline"></i> -->
          </div>
				</div>
				<div v-if="svc.radio=='4'">
					<div>{{$t('TKE.subList.zjdkys')}}</div>
					<div>支持Ingress
            <!-- <a href="">查看详情</a><i class="el-icon-edit-outline"></i> -->
          </div>
				</div>
			</div>
		</el-form-item>

    <el-form-item v-if="svc.radio=='3'" :label="$t('TKE.subList.szzw')">
			<el-select v-model="svc.LBvalue1" :placeholder="$t('TKE.overview.qxz')" disabled>
				<el-option
					v-for="item in personObj.vpcNameAry"
					:key="item.VpcName"
					:label="item.VpcName"
					:value="item.VpcId">
				</el-option>
			</el-select>
			<el-select v-model="svc.LBvalue2" :placeholder="$t('TKE.overview.qxz')">
				<el-option
					v-for="item in personObj.LBsubnet"
					:key="item.SubnetId"
					:label="item.SubnetName"
					:value="item.SubnetId">
				</el-option>
			</el-select>
			<!-- <el-button style="border:none;"><i class="el-icon-refresh"></i></el-button> -->
			&nbsp;共<span>{{addressCount.TotalIpAddressCount}}</span>{{$t('TKE.subList.gzwd')}}<span>{{addressCount.AvailableIpAddressCount}}</span>{{$t('TKE.overview.ge')}}可用
		</el-form-item>

		<el-form-item :label="$t('TKE.subList.fzjhq')" v-show="svc.radio=='1' || svc.radio=='3'">
			<div class="radio1">
			<el-radio-group v-model='svc.loadBalance' style="margin-bottom: 5px;">
        <el-radio-button label="1">{{$t('TKE.subList.zdcjian')}}</el-radio-button>
        <el-radio-button label="2">使用已有</el-radio-button>
      </el-radio-group>

			</div>
			<p v-show="svc.loadBalance=='1'">{{$t('TKE.subList.zdcj')}}
        <!-- <a href="javascript:;">查看更多说明</a> -->
      </p>
			<div v-show="svc.loadBalance=='2'">{{$t('TKE.subList.qwsdxgjt')}}
        <!-- <a href="javascript:;">查看更多说明</a> -->
			<p>
				<el-select v-show="svc.radio==='1'" v-model="svc.balancerValue" :placeholder="$t('TKE.overview.qxz')">
					<el-option
						v-for="item in personObj.ownLoadBalancer1"
						:key="item.LoadBalancerId"
						:label="`${item.LoadBalancerId}  (${item.LoadBalancerName})`"
						:value="item.LoadBalancerId">
					</el-option>
				</el-select>
        <el-select v-show="svc.radio==='3'" v-model="svc.balancerValue" :placeholder="$t('TKE.overview.qxz')">
					<el-option
						v-for="item in personObj.ownLoadBalancer2"
						:key="item.LoadBalancerId"
						:label="`${item.LoadBalancerId}  (${item.LoadBalancerName})`"
						:value="item.LoadBalancerId">
					</el-option>
				</el-select>
			</p>
			</div>
		</el-form-item>
		<el-form-item label="端口映射">
			<div class="port" :class="{ports:svc.radio=='4'}">
				<!-- 头部 -->
				<div class="flex">
					<div style="width:140px;padding-left:14px">{{$t('TKE.subList.xy')}}
						<el-tooltip :content="$t('TKE.subList.xybnhhsy')" placement="top" effect="light">
						<i class="el-icon-warning"></i>
						</el-tooltip>
					</div>
					<div :class="{titles:svc.radio=='4'}" :style="svc.radio=='4'?'width:204px':'width:250px;'">
						容器端口
						<el-tooltip :content="$t('TKE.subList.dkfw')" placement="top" effect="light">
						<i class="el-icon-warning"></i>
						</el-tooltip>
					</div>
					<div :class="{titles:svc.radio=='4'}" :style="svc.radio=='4'?'width:204px':'width:250px;'" v-if="svc.radio=='4'">
						{{$t('TKE.subList.zjdk')}}
						<el-tooltip :content="$t('TKE.subList.btzdfp')" placement="top" effect="light">
						<i class="el-icon-warning"></i>
						</el-tooltip>
					</div>
					<div :class="{titles:svc.radio=='4'}" :style="svc.radio=='4'?'':'padding-left:30px'">
						{{$t('TKE.subList.fwdk')}}
						<el-tooltip :content="$t('TKE.subList.jqw')" placement="top" effect="light">
						<i class="el-icon-warning"></i>
						</el-tooltip>
					</div>
				</div>
				<!-- 内容 -->
				<div style="border-top:1px solid #ddd;padding: 10px;">
					<div style="padding:5px 0;" v-for="(it,i) in svc.list" :key="it.key">
						 <!-- -->
						<el-form-item style="display: inline-block" :prop="`list.${i}.protocol`" :rules="ProtocolValidation">
							<!-- <el-select class="w100" v-model="svc.protocol" placeholder="请选择"> -->
							<el-select class="w100" v-model="it.protocol" :placeholder="$t('TKE.overview.qxz')">
						    <el-option
						    	v-for="item in protocolList"
						    	:key="item"
						    	:label="item"
						    	:value="item">
						    </el-option>
						  </el-select>
						</el-form-item>
						<!-- 容器端口 -->
						<el-form-item :class="{cons:svc.radio=='4'}" style="display: inline-block;padding-left:30px;"
						:prop="`list.${i}.input1`" :rules="verifyPort1">
						  <el-input class="w250" v-model="it.input1" :placeholder="$t('TKE.subList.rqnyycxjt')"></el-input>
						</el-form-item>
						<!-- 主机端口 -->
						<el-form-item :class="{cons:svc.radio=='4'}" v-if="svc.radio=='4'"
						style="display: inline-block;padding-left:30px;"  :prop="`list.${i}.input3`" :rules="verifyPort2">
						  <el-input class="w250" v-model="it.input3" :placeholder="$t('TKE.subList.fwei')"></el-input>
						</el-form-item>
						<!-- 服务端口 -->
						<el-form-item :class="{cons:svc.radio=='4'}" style="display: inline-block;padding-left:30px;"
						:prop="`list.${i}.input2`" :rules="verifyPort3">
						  <el-input class="w250" v-model="it.input2" :placeholder="$t('TKE.subList.jyydkyz')"></el-input>
						</el-form-item>
						<!-- 对删除按钮的判断 -->
						<el-tooltip class="item" effect="dark" :content="$t('TKE.subList.zslgdk')"
                        placement="right" v-if="svc.list.length===1">
							<i style="font-size:18px;" 
                 :style="svc.radio=='4'?'padding-left:40px;':'padding-left:20px;'" class="el-icon-close"></i>
						</el-tooltip>
						<el-tooltip class="item" effect="dark" :content="$t('TKE.overview.sc')" 
                        placement="right" v-else>
							<i style="font-size:18px;" 
              :style="svc.radio=='4'?'padding-left:40px;':'padding-left:20px;'" class="el-icon-close" @click="removeprot(it)"></i>
						</el-tooltip>
					</div>
				</div>
			</div>
			<a href="javascript:;" @click="addport()">添加端口映射</a>
		</el-form-item>
		<!-- 高级设置 -->
		<div v-if="svc.show">
			<h3 style="padding-bottom:10px;">{{$t('TKE.subList.gjszxt')}}</h3>
			<el-form-item label-width="150px" label="ExtermalTrafficPolicy" v-if="svc.radio!=='2'">
				<el-radio v-model="svc.ETP" label="1">Cluster</el-radio>
				<el-radio v-model="svc.ETP" label="2">Local</el-radio>
				<div v-if="svc.ETP=='1'">{{$t('TKE.subList.mrjhzf')}}</div>
				<div v-if="svc.ETP=='2'">{{$t('TKE.subList.ngblly')}}</div>
			</el-form-item>
			<div>
				<el-form-item label-width="150px" label="Session Affinity">
					<el-radio v-model="svc.SA" label="1">ClienIP</el-radio>
					<el-radio v-model="svc.SA" label="2">None</el-radio>
				</el-form-item>
				<div v-if="svc.SA=='1'">
					<el-form-item prop="time" :rules="timeRules" label-width="150px" :label="$t('TKE.subList.zdhhbcsj')">
						<el-input v-model="svc.time" class="w200"></el-input>
						<div>{{$t('TKE.subList.hhbcsj')}}</div>
					</el-form-item>
				</div>
			</div>
		</div>
		<div v-if="!svc.show"><a href="javascript:;" @click="show()">{{$t('TKE.subList.xsgjsz')}}</a></div>
		<div v-if="svc.show"><a href="javascript:;" @click="show()">{{$t('TKE.subList.yczgsz')}}</a></div>
	</div>
</template>

<script>
export default {
  props: ['personObj', 'svcData'],
  data () {
    return {
      svc: this.svcData,
      protocolList: ['TCP', 'UDP'], // 协议列表
      addressCount: {}, // 子网点对象
      timeRules: [{// 会话时间的验证
        validator: (rule, value, callback) => {
          if (value > 0 && value <= 68400) {
            callback()
          } else if (!value) {
            callback(new Error('會話保持時間不能為空'))
          } else if (value < 0 && value > 68400) {
            callback(new Error('不在會話保持時間範圍'))
          } else if (!(/^\d+$/.test(value))) {
            callback(new Error('會話保持時間格式錯誤'))
          } else {
            callback(new Error('會話保持時間格式錯誤'))
          }
        },
        trigger: 'blur',
        required: true
      }],
      // 端口映射的验证
      verifyPort1: [// 容器端口的验证
        { validator: (rule, value, callback) => {
          let ind = Number(rule.field.split('.')[1])
          let ls = this.svc.list
          let flog = false
          for (var i = 0; i < ls.length; i++) {
            if (i !== ind && ls[i].input1 === value) {
              flog = true
            }
          }
          let portNumber = /^([1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]{1}|6553[0-5])$/
          if (!value) {
            callback(new Error('端口號不能為空'))
          } else if (!portNumber.test(value)) {
            callback(new Error('端口號格式不正確'))
          } else if (flog) {
            callback(new Error('端口不可重複映射'))
          } else {
            callback()
          }
        },
        trigger: 'blur',
        required: true }
      ],
      verifyPort2: [{// 主机端口的验证
        validator: (rule, value, callback) => {
          // console.log(rule.field.split('.')[1])
          let ind = Number(rule.field.split('.')[1])
          let ls = this.svc.list
          let flog = false
          for (var i = 0; i < ls.length; i++) {
            if (i !== ind && ls[i].input3 === value) {
              flog = true
            }
          }
          if (flog) {
            callback(new Error('端口不可重複映射'))
          }
          if (value > 30000 && value <= 32767) {
            callback()
          } else if (!value) {
            callback(new Error('端口號不能為空'))
          } else if (value < 0 && value > 32767) {
            callback(new Error('超出端口號範圍'))
          } else if (!(/^\d+$/.test(value))) {
            callback(new Error('端口號格式不正確'))
          } else {
            callback(new Error('端口格式不正確'))
          }
        },
        trigger: 'blur',
        required: true
      }],
      verifyPort3: [// 服务端口的验证
        { validator: (rule, value, callback) => {
          let idx = Number(rule.field.split('.')[1])
          let ls = this.svc.list
          let flog = false
          for (var i = 0; i < ls.length; i++) {
            if (i !== idx && ls[i].input2 === value) {
              flog = true
            }
          }
          let portNumber = /^([1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]{1}|6553[0-5])$/
          if (!value) {
            callback(new Error('端口號不能為空'))
          } else if (!portNumber.test(value)) {
            callback(new Error('端口號格式不正確'))
          } else if (flog) {
            callback(new Error('端口不可重複映射'))
          } else {
            callback()
          }
        },
        trigger: 'blur',
        required: true }
      ],
      ProtocolValidation: [// 协议的验证
        { validator: (rule, value, callback) => {
          let idx = Number(rule.field.split('.')[1])
          let ls = this.svc.list
          let flog = true
          // if (ls.length > 1) {
          for (var i = 0; i < ls.length; i++) {
            if (i !== idx && ls[i].protocol !== value) {
              flog = false
            }
          }
          // }
          if (!flog) {
            callback(new Error('協議必須一致'))
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
        return item.SubnetId === val
      })
    },
    personObj: {
      handler: function () {
        //  LBsubnet, vpcNameAry,   LBsubnet[0] && vpcNameAry[0] && 
        let { ownLoadBalancer1, ownLoadBalancer2 } = this.personObj
        if (!(ownLoadBalancer1[0] && ownLoadBalancer2[0])) return
        // this.svc.LBvalue2 = LBsubnet[0].SubnetId
        // this.svc.LBvalue1 = vpcNameAry[0].VpcId
        if(this.svc.radio==='1') this.svc.balancerValue = ownLoadBalancer1[0].LoadBalancerId
        // if(this.svc.radio==='3') this.svc.balancerValue = ownLoadBalancer2[0].LoadBalancerId
      },
      deep:true
    },
    'svc.radio':function(val){
      let { LBsubnet, vpcNameAry, ownLoadBalancer1, ownLoadBalancer2 } = this.personObj
      if (!(ownLoadBalancer1[0] && ownLoadBalancer2[0])) return
      if(val==='1') this.svc.balancerValue = ownLoadBalancer1[0].LoadBalancerId
      if(val==='3') this.svc.balancerValue = ownLoadBalancer2[0].LoadBalancerId
    }
  },
  methods: {
    // 显示或隐藏高级设置
    show () {
      this.svc.show = !this.svc.show
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
      this.svc.list.push({
        value: '',
        input1: '',
        input3: '',
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
.ports{
  max-width: 848px;
}
.titles{
	width: 204px;
	.el-input{
		width: 184px
	}
}
.cons{
	width: 204px;
	.el-input{
		width: 200px
	}
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

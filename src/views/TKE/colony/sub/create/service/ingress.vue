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
          <h2 class="header-title">新建Ingress</h2>
        </div>
        <!-- 右侧 -->
        <div class="grid-right"></div>
      </div>
    </div>  
    <div class="colony-main">
      <div class="tke-card tke-formpanel-wrap mb60">
        <el-form  class="tke-form" :model="ing" label-position='left' label-width="120px" size="mini">
					<el-form-item label="名称">
						<el-input class="w200" v-model="ing.name" placeholder="请输入Ingress名称"></el-input>
						<p>最长63个字符，只能包含小写字母、数字及分隔符("-")，且必须以小写字母开头，数字或小写字母结尾</p>
					</el-form-item>
					<el-form-item label="描述">
						<textarea name="" class="ms" placeholder="请输入描述信息，不超过1000个字符" id="" cols="30" rows="10"></textarea>
					</el-form-item>
					<el-form-item label="Ingress类型">
						<div>应用型负载均衡器（支持HTTP / HTTPS <span>0.02</span> 元 / 小时)</div>
					</el-form-item>
					<el-form-item label="网络类型">
						<el-radio-group v-model="ing.tabPosition">
							<el-radio-button label="gw">公网</el-radio-button>
							<el-radio-button label="nw">内网</el-radio-button>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="负载均衡器">
						<el-radio-group v-model="ing.fz">
							<el-radio-button label="zd">自动创建</el-radio-button>
							<el-radio-button label="yy">使用已有</el-radio-button>
						</el-radio-group>
						<div v-if="ing.fz=='yy'">
							<div>使用已有应用CLB型创建ingress，不覆盖已有监听规则，请勿手动修改由TKE创建CLB监听器，<a href="">查看更多说明</a><i class="el-icon-edit-outline"></i></div>
							<el-select v-model="ing.value" placeholder="请选择" disabled class="borderRed">
								<el-option
									v-for="item in ing.options"
									:key="item.value"
									:label="item.label"
									:value="item.value">
								</el-option>
							</el-select>
							<i class="el-icon-warning text-error" style="margin-left:10px;"></i>
						</div>
					</el-form-item>
					<el-form-item label=""></el-form-item>
					<el-form-item label="命名空间">
						<el-select v-model="ing.value" placeholder="请选择">
							<el-option
								v-for="(item,index) in ing.options"
								:key="index"
								:label="item"
								:value="item">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item v-if="ing.tabPosition=='nw'" label="所属网络">
						<el-select v-model="ing.value" placeholder="请选择">
							<el-option
								v-for="item in ing.options"
								:key="item.value"
								:label="item.label"
								:value="item.value">
							</el-option>
						</el-select>
						<el-select v-model="ing.value" placeholder="请选择">
							<el-option
								v-for="item in ing.options"
								:key="item.value"
								:label="item.label"
								:value="item.value">
							</el-option>
						</el-select>
						<el-button style="border:none;"><i class="el-icon-refresh"></i></el-button>
						共<span>253</span>个子网点，剩下<span>156</span>个可用
					</el-form-item>
					<el-form-item label="监听端口">
						<el-checkbox disabled v-model="ing.checked">Http:80</el-checkbox>
						<el-checkbox v-model="ing.checkedtwo">Https:443</el-checkbox>
					</el-form-item>
					<el-form-item label="服务器证书">
						<el-select v-model="ing.value" placeholder="请选择" disabled class="borderRed">
							<el-option
								v-for="item in ing.options"
								:key="item.value"
								:label="item.label"
								:value="item.value">
							</el-option>
						</el-select>
						<div>如您现有的证书不合适，可以<a href="">现在创建</a><i class="el-icon-edit-outline"></i></div>
					</el-form-item>
					<el-form-item label="转发配置">
						<div class="port">
							<!-- 头部 -->
							<div class="flex">
								<div style="padding-left:10px;width:150px;">协议</div>
								<div style="width:80px;">监听端口</div>
								<div style="width:168px;padding-left:12px">域名
									<el-tooltip content="非通配的域名支持的字符集a-z 0-9.-;通配的域名，目前只支持*.example.com的形式，且单个域名中只出现一次" placement="top" effect="light">
									<i class="el-icon-warning"></i>
									</el-tooltip>
								</div>
								<div style="width:80px;">路径</div>
								<div style="width:150px;padding-left:40px;">后端服务
									<el-tooltip content="转发规则后端服务无法添加访问方式为集群内访问的服务，如有需要可更新服务的访问方式。不支持配置访问方式为不启用的服务" placement="top" effect="light">
									<i class="el-icon-warning"></i>
									</el-tooltip>
								</div>
								<div style="padding-left:40px;">服务端口</div>
							</div>
							<!-- 内容 -->
							<div style="border-top:1px solid #ddd;padding: 10px;">
								<div style="padding:5px 0;" v-for="it in ing.list" :key="it.key">
									<el-select style="width:120px;" v-model="ing.value" placeholder="请选择">
									<el-option
										v-for="item in ing.options"
										:key="item.value"
										:label="item.label"
										:value="item.value">
									</el-option>
									</el-select>
									<span style="padding-left:23px">80</span>
									<el-input style="width:200px;padding-left:75px;" placeholder="默认为IPv4 IP"></el-input>
									<el-input style="width:120px;padding-left:30px;"></el-input>
									<el-select v-model="ing.value" placeholder="请选择" style="padding-left:30px;width:150px;">
										<el-option
											v-for="item in ing.options"
											:key="item.value"
											:label="item.label"
											:value="item.value">
										</el-option>
									</el-select>
									<el-select v-model="ing.value" placeholder="请选择" style="padding-left:30px;width:150px;">
										<el-option
											v-for="item in ing.options"
											:key="item.value"
											:label="item.label"
											:value="item.value">
										</el-option>
									</el-select>
									<el-tooltip class="item" effect="dark" content="删除" placement="right">
										<i style="font-size:18px;padding-left:20px;" class="el-icon-close" @click="removeprot(it)"></i>
									</el-tooltip>
								</div>					
							</div>
						</div>
						<a href="javascript:;" @click="addport()">添加转发规则</a>
					</el-form-item>
        </el-form>

       
        <!-- 底部 -->
        <div class="tke-formpanel-footer">
          <el-button size="small" type="primary">创建Ingress</el-button>
          <el-button size="small">取消</el-button>
        </div>
      </div>
    </div>
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
      ing: {
				fz: 'zd',
				checked: true,
				checkedtwo: false,
				name: '',
				tabPosition: 'gw',
				value: '',
				options:[],
				input: '',
				list:[{}]
      }  
    };
  },
  components: {
    
  },
  created() {
     // 从路由获取类型

  },
  methods: {
		removeprot(item){
			var index = this.ing.list.indexOf(item)
			if(index !== -1){
				this.ing.list.splice(index,1)
			}
		},
		addport(){
			this.ing.list.push({
				value: '',
				key: Date.now()
			})
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
	max-width: 855px;
	border: 1px solid #ddd;
}
.card {
	padding: 10px;border-bottom:1px solid #dcdfe6;
}
.borderRed {
	border: 1px solid #e54545;
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


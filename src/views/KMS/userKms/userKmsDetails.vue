<template>
  <div>
		<div class="projectDetailTit">
			<i class="el-icon-back" @click="returnList"></i>
			<span>{{projectDetail.KeyId}}</span>
		</div>
		<div class="projectDetailCon">
			<div class="projectDetailCenter">
				<div class="projectDetailOne">
					<h2>密钥信息</h2>
					<div class="detailList">
						<p><span>名称</span><span>{{projectDetail.Alias}}</span><i class="el-icon-edit" @click="changeNameHand"></i></p>
						<el-dialog
							class="changeNameModel"
							title="修改密钥名称"
							:visible.sync="dialogModel1"
							width="30%"
							:before-close="handleClose1">
							<div class="dialogModelCon newClear">
								<div class="newClear"><span>原名称</span><span>{{projectDetail.Alias}}</span></div>
								<div class="newClear"><span>新名称</span><span><el-input v-model="changeName" class="newName"></el-input><p class="tipP">最长可输入60个字符，不可为空，请使用字母、数字及字符“_”和“-”，首字符必须为字母或者数字，且不能用 KMS- 开头。</p></span></div>
							</div>
							<span slot="footer" class="dialog-footer">
								<el-button @click="dialogModel1 = false">取 消</el-button>
								<el-button type="primary" @click="changeNameSure">确 定</el-button>
							</span>
						</el-dialog>
						<p><span>ID</span><span>{{projectDetail.KeyId}}</span></p>
						<p><span>状态</span><span>{{projectDetail.KeyState}}</span></p>
						<p><span>地区</span><span>{{projectDetail.address}}</span></p>
						<p><span>创建时间</span><span>{{projectDetail.CreateTime}}</span></p>
						<p><span>创建者</span><span>{{createUser}}</span></p>
						<p><span>轮换状态</span><span>{{projectDetail.CreateTime}}</span></p>
						<p><span>描述信息</span><span>{{discription}}</span><i class="el-icon-edit" @click="newDescription"></i></p>
						<el-dialog
							class="changeNameModel"
							title="修改密钥描述信息"
							:visible.sync="dialogModel2"
							width="30%"
							:before-close="handleClose2">
							<div class="dialogModelCon">
								<div class="newClear"><span>原描述信息</span><span>{{discription}}</span></div>
								<div class="newClear"><span>新描述信息</span><span><el-input type="textarea" v-model="descriptionNew" class="newDescription"></el-input></span></div>
							</div>
							<span slot="footer" class="dialog-footer">
								<el-button @click="dialogModel2 = false">取 消</el-button>
								<el-button type="primary" @click="changeDescriptionSure">确 定</el-button>
							</span>
						</el-dialog>
					</div>
				</div>
				<div class="projectDetailOne">
					<h2>密钥材料</h2>
					<div class="detailList">
						<p><span>密钥来源</span><span>{{projectDetail.Origin}}</span></p>
						<p><span>密钥材料</span><span><a href="#" @click="dialogModel3=true">导入密钥材料</a></span></p>
						<el-dialog
							class="changeNameModel"
							title="导入密钥材料"
							:visible.sync="dialogModel3"
							width="30%"
							:before-close="handleClose3">
							<div class="dialogModelCon">
								
							</div>
							<span slot="footer" class="dialog-footer">
								<el-button @click="dialogModel3 = false">取 消</el-button>
								<el-button type="primary" @click="changeDescriptionSure">确 定</el-button>
							</span>
						</el-dialog>
					</div>
				</div>
				<div class="projectDetailThree newClear">
					<h2>在线工具<i class="el-icon-info"></i></h2>
					<div class="btnBottom">
						<button @click="changeBtnEncrypt(1)" :class="thisType=='1'?'bthBorderColor':''">加密</button>
						<button @click="changeBtnEncrypt(2)" :class="thisType=='2'?'bthBorderColor':''">解密</button>
					</div>
					<div class="EncryptText newClear">
						<div v-if="thisType=='1'?true:false">
							<el-input class="textareaIpt" v-model="Plaintext" type="textarea" placeholder="请输入明文" @input='changeTextarea1'></el-input>
							<el-button @click="actionPlain" :disabled="disableTextarea" type="primary">执行</el-button>
						</div>
						<div v-if="thisType=='2'?true:false">
							<el-input class="textareaIpt" v-model="Ciphertext" type="textarea" placeholder="请输入密文" @input='changeTextarea1'></el-input>
							<el-button @click="actionCipher" :disabled="disableTextarea" type="primary">执行</el-button>
						</div>
						<div>
							<el-input class="textareaIpt" :disabled="true" type="textarea" v-model="downLoadText"></el-input>
							<el-button :disabled="downLoadText==''?true:false" type="primary">下载</el-button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	data(){
		return{
			projectDetail:{},
			createUser:"",
			discription:"",
			dialogModel1:false,//修改名称模态框
			dialogModel2:false,//修改描述模态框
			dialogModel3:false,//导入密钥材料模态框
			changeName:'',//新的名称
			descriptionNew:"",//新的描述
			thisType:1,
			Plaintext:'',//请输入明文
			Ciphertext:"",//请输入密文
			disableTextarea:true,//解密加密第二框
			downLoadText:'',//'执行加解密之后的下载框'
		}
	},
	created(){
		this.projectDetail=JSON.parse(sessionStorage.getItem("projectId"));
		//console.log(this.projectDetail)
		this.createUser="one";
		this.discription="123"
	},
	methods:{
		//修改名称关闭按钮
		handleClose1(){
			this.dialogModel1=false;
		},
		//修改描述关闭按钮
		handleClose2(){
			this.dialogModel2=false;
		},
		//导入密钥材料关闭按钮
		handleClose3(){
			this.dialogModel3=false;
		},
		//修改名称按钮
		changeNameHand(){
			this.dialogModel1=true;
			this.changeName=this.projectDetail.Alias
		},
		//修改描述信息按钮
		newDescription(){
			this.dialogModel2=true;
			this.descriptionNew=this.discription;
		},
		//修改密钥名称确定按钮
		changeNameSure(){
			let params = {
				Action:"UpdateAlias",
				Version: '2019-01-18',
				Region: 'ap-taipei',
				Alias:this.changeName,
				KeyId:this.projectDetail.KeyId
			};
			this.$axios.post('kms2/UpdateAlias', params).then(res => {
				console.log(res)
				this.projectDetail.Alias=this.changeName;
				this.dialogModel1=false;
			})
		},
		//修改密钥描述确定按钮
		changeDescriptionSure(){
			let params = {
				Action:"UpdateKeyDescription",
        Version: '2019-01-18',
        Region: 'ap-taipei',
				Description:this.descriptionNew,
				KeyId:this.projectDetail.KeyId
			};
			this.$axios.post('kms2/UpdateKeyDescription', params).then(res => {
				console.log(res)
				this.discription=this.descriptionNew;
				this.dialogModel2=false;
			})
		},
		//加密解密按钮
		changeBtnEncrypt(thisType){
			this.thisType=thisType;
		},
		//明文执行按钮
		actionPlain(){
			let params = {
				Action:"Encrypt",
        Version: '2019-01-18',
        Region: 'ap-taipei',
				Plaintext:this.Plaintext,
				KeyId:this.projectDetail.KeyId
			};
			this.$axios.post('kms2/Encrypt', params).then(res => {
				console.log(res);
				this.downLoadText=res.Response.CiphertextBlob
			})
		},
		//密文执行按钮
		actionCipher(){
			let params = {
				Action:"Decrypt",
        Version: '2019-01-18',
        Region: 'ap-taipei',
				CiphertextBlob:this.Ciphertext
			};
			this.$axios.post('kms2/Decrypt', params).then(res => {
				console.log(res)
				this.downLoadText=res.Response.Plaintext
			})
		},
		//返回列表页
		returnList(){
			this.$router.push({
				name:"userKms"
			})
		},
		//监测输入框是否有内容
		changeTextarea1(e){
			if(e==''){
				this.disableTextarea=true;
			}else{
				this.disableTextarea=false;
			}
		},
	}
}
</script>
<style lang="scss">
.newClear{
	display:block;
	content:"";
	clear:both;
}
.projectDetailTit{
	width:100%;
	height:50px;
	background-color:#fff;
	border-bottom:1px solid #ddd;
	padding:0 20px;
	line-height:50px;
	i{
		color:#006eff;
		font-size:18px;
		font-weight: 600;
	}
	span{
		font-size:16px;
		font-weight:600;
		margin-left:20px;
	}
}
.projectDetailCon{
	width:100%;
	padding:20px;
	.projectDetailCenter{
		width:100%;
		min-height:200px;
		border:1px solid #ddd;
		background-color:#fff;
		box-shadow: 0 1px 3px 0 rgba(0,0,0,.1);
		padding:20px;
		h2{
			font-size:14px;
			font-weight: 600;
			margin-bottom:20px;
		}
		.detailList{
			p{
				margin-bottom:20px;
				span:nth-child(1){
					font-size:12px;
					color:#888;
					display: inline-block;
					width:70px;
				}
				span:nth-child(2){
					font-size:12px;
					color:#000;
				}
				i.el-icon-edit{
					margin-left:6px;
				}
			}
		}
		.projectDetailOne{
			margin-bottom:12px;
			border-bottom:1px solid #ddd;
		}
		.projectDetailThree{
			padding-bottom:20px;
			button{
				width:66px;
				height:30px;
				border-radius: 0;
				border:1px solid #ddd;
				outline: none;
				//background-color:#fff;
				line-height: 30px;
				padding:0;
				text-align: center;
			}
			.bthBorderColor{
				border:1px solid #006eff;
				color:#006eff;
			}
			.EncryptText{
				>div{
					float:left;
					margin-right:30px;
					text-align: right;
					width:330px;
					textarea{
						width:330px;
						height:100px;
						border-radius: 0;
						resize: none;
					}
				}
				.textareaIpt{
					width:330px;
					height:100px;
					margin-bottom:20px;
					margin-top:20px;
				}
			}
		}
		.btnBottom{
			button{
				background-color:#fff;
			}
		}
	}
}
.dialogModelCon{
	div{
		margin-bottom:20px;
		width:100%;
		span:nth-child(1){
			font-size:12px;
			color:#888;
			display: inline-block;
			width:80px;
			float:left;
		}
		span:nth-child(2){
			font-size:12px;
			color:#888;
			float:left;
			width:calc(100% - 80px);
			.newName{
				width:200px;
				height:30px;
				input{
					width:200px;
					height:30px;
					border-radius: 0;
				}
			}
			.newDescription{
				textarea{
					width:330px;
					height:100px;
					resize: none;
					border-radius: 0;
				}
			}
			.tipP{
				color:#888;
				font-size:12px;
			}
		}
	}
}
.changeNameModel{
	.el-dialog__title{
		font-size:14px;
		font-weight:600;
	}
}
</style>
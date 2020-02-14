<!-- 更新转发配置 -->
<template>
  <div class="colony-wrap">
    <!-- 头部 -->
    <div class="tke-content-header " >
      <div class="tke-grid ">
        <!-- 左侧 -->
        <div class="grid-left">
          <span class="goback" @click="goBack">
            <i class="el-icon-back"></i>
          </span>
          <h2 class="header-title">更新</h2>
        </div>
        <!-- 右侧 -->
      </div>
    </div>
    <div class="colony-main">
			<el-form
				class="tke-form"
				label-position="left"
				label-width="120px"
				size="mini"
			>
				<el-form-item label="数据盘挂载">
					<el-checkbox></el-checkbox>
					<span style="color:#000;">Http:80</span>
					<el-checkbox ></el-checkbox>
					<span style="color:#000;">Https:443</span>
				</el-form-item>
				<el-form-item label="服务器证书">
					<el-select placeholder="请选择">
						<el-option
							v-for="item in options"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						>
						</el-option>
					</el-select>
					<p>如您现有的证书不合适，可以<a href="#">现在创建</a><i class="el-icon-edit-outline"></i></p>
				</el-form-item>
				<el-form-item label="转发配置">
					
				</el-form-item>
			</el-form>
			<!-- 底部 -->
			<div class="tke-formpanel-footer">
				<el-button size="small" type="primary" @click="submit">完成</el-button>
				<el-button size="small" @click="goBack">取消</el-button>
			</div>
    </div>	
  </div>
</template>

<script>
import HeadCom from "@/components/public/Head";
export default {
  name: "configure",
  data() {
    return {
			type: '',
			number:0,
      se: {
        tabPosition: 'jt',
        radio: '2'
      }
    };
  },
  components: {
    HeadCom
  },
  created() {

  },
  methods: {
    //返回上一层
    goBack(){
      this.$router.go(-1);
		},
		submit(){

		}
  }
};
</script>

<style lang="scss" scoped>
  .box-card {
    width: 100%;
    margin:20px 0;
  }
	.box-black{
    margin:10px;
    background:black;
  }
</style>


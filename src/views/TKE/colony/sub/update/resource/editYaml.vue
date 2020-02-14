<!-- 工作负载更新调度策略 -->
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
    <el-card class='box-card'> 
      <div class='box-black'>1</div>
    </el-card>
		<!-- 底部 -->
		<div class="tke-formpanel-footer">
			<el-button size="small" type="primary" @click="submit">完成</el-button>
			<el-button size="small" @click="goBack">取消</el-button>
		</div>
  </div>
</template>

<script>
import HeadCom from "@/components/public/Head";
export default {
  name: "editYaml",
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
		this.type = this.$router.query.type;
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


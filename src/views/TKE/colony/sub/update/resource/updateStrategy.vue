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
          <h2 class="header-title">更新调度策略</h2>
        </div>
        <!-- 右侧 -->
      </div>
    </div>

    <div class="colony-main">
      <div class="tke-card tke-formpanel-wrap mb60">
        <el-form
					class="tke-form"
					label-position="left"
					label-width="120px"
					size="mini"
				>
					<el-form-item label="节点调度策略">
						<el-radio-group class="tke-radio-group" v-model="se.radio">
							<el-radio label="deployment">不使用调度策略</el-radio>
							<el-radio label="daemonSet">指定节点调度</el-radio>
							<el-radio label="statefulSet">自定义调度规则</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item>
						<p>可根据调度规则，将Pod调度到符合预期的Label的节点中。
							<a href="#">设置工作负载的调度规则指引</a>
							<i class="el-icon-edit-outline"></i>
						</p>
					</el-form-item>
        </el-form>
				<!-- 底部 -->
        <div class="tke-formpanel-footer">
					<el-button size="small" type="primary" @click="submit">完成</el-button>
          <el-button size="small" @click="goBack">取消</el-button>
        </div>
      </div>    
    </div>
  </div>
</template>

<script>
import HeadCom from "@/components/public/Head";
export default {
  name: "updateStrategy",
  data() {
    return {
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
	
</style>


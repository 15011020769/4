<!-- 工作负载设置更新策略 -->
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
          <h2 class="header-title">设置更新策略</h2>
        </div>
        <!-- 右侧 -->
      </div>
    </div>

    <div class="colony-main">
      <div class="tke-card tke-formpanel-wrap mb60">
        <el-form
					class="tke-form"
					:model="strategy"
					label-position="left"
					label-width="120px"
					size="mini"
				>
					<el-form-item label="更新方式">
						<el-select placeholder="请选择">
							<el-option
							v-for="item in options"
							:key="item.value"
							:label="item.label"
							:value="item.value"
							>
							</el-option>
						</el-select>
						<p class="tke-type">对实例进行逐个更新，这种方式可以让您不中断业务实现对服务的更新</p>	
					</el-form-item>
					<el-form-item label="策略配置">
						<div class="tke-set">
							<el-form-item style="padding:10px;" label="Partition">
								<el-input
                  type="text"
                  v-model="number"
                  class='w420'
									style="width:200px;">
                </el-input>
							</el-form-item>	
						</div>
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
  name: "setStrategy",
  data() {
    return {
			number:0,
      options: [
        {
          value: '选项1',
          label: '黄金糕'
        },
        {
          value: '选项2',
          label: '双皮奶'
        },
        {
          value: '选项3',
          label: '蚵仔煎'
        },
        {
          value: '选项4',
          label: '龙须面'
        },
        {
          value: '选项5',
          label: '北京烤鸭'
        }
      ]
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
	.tke-type{
		font-size: 12px;
		color: #888;
		margin-top: 8px;
	}
	.tke-set{
		background-color: #f2f2f2;
		height: 50px;
		width	: 400px;
	}

</style>


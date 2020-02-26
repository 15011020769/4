 <!-- 新建Secret -->
<template>
  <div class="colony-wrap">
    <div class="tke-content-header">
      <div class="tke-grid ">
        <!-- 左侧 -->
        <div class="grid-left">
          <span class="goback" @click="goBack">
            <i class="el-icon-back"></i>
          </span>
          <h2 class="header-title">新建Secret</h2>
        </div>
        <!-- 右侧 -->
        <div class="grid-right"></div>
      </div>
    </div>  
    <div class="colony-main">

      <div class="tke-card tke-formpanel-wrap mb60">
        <el-form  class="tke-form" :model="se" label-position='left' label-width="120px" size="mini">
          <el-form-item label="名称">
            <el-input class="w200" v-model="se.name" placeholder="请输入名称"></el-input>
            <p>最长63个字符，只能包含小写字母、数字及分隔符("-")，且必须以小写字母开头，数字或小写字母结尾</p>
          </el-form-item>
          <el-form-item label="Secret类型">
            <el-radio-group v-model="se.tabPosition" style="margin-bottom: 30px;">
              <el-radio-button label="jt">Opaque</el-radio-button>
              <el-radio-button label="dt">Dockercfg</el-radio-button>
            </el-radio-group>
            <div>适用于保存秘钥证书和配置文件，Value将以base64格式编码</div>
          </el-form-item>
          <el-form-item label="生效范围">
            <div>
              <div class="bg">
                <el-radio v-model="se.radio" label="1">存量所有命名空间（不包括kube-system、kube-public和后续增量命名空间）</el-radio>
              </div>
              <div class="bg">
                <el-radio v-model="se.radio" label="2">指定命名空间</el-radio>
                <div v-if="se.radio=='2'">
                  <el-transfer
                  filterable
                  :filter-method="filterMethod"
                  filter-placeholder="请输入"
                  v-model="se.value"
                  :data="data">
                  </el-transfer>
                </div>
              </div>
            </div>
          </el-form-item>
					<div v-if="se.tabPosition=='jt'">
						<el-form-item label="内容">
							<div style="width:400px;">
								<!-- 头部 -->
								<div class="flex header">
									<div style="width:200px">变量名</div>
									<div>变量值</div>
								</div>
								<addSecret></addSecret>
							</div>
          	</el-form-item>
					</div>
          <div v-if="se.tabPosition=='dt'">
						<el-form-item label="仓库域名">
							 <el-input class="w200" v-model="se.name" placeholder="请输入域名或IP"></el-input>
						</el-form-item>
						<el-form-item label="用户名">
							 <el-input class="w200" v-model="se.name" placeholder="请输入第三方仓库的用户名"></el-input>
						</el-form-item>
						<el-form-item label="密码">
							 <el-input class="w200" v-model="se.name" placeholder="请输入第三方仓库的登录密码"></el-input>
						</el-form-item>
					</div>
        </el-form>
        <!-- 底部 -->
        <div class="tke-formpanel-footer">
          <el-button size="small" type="primary" @click="creatSecret()">创建Secret</el-button>
          <el-button size="small">取消</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import addSecret from './components/addValue'
import FileSaver from "file-saver";
import XLSX from "xlsx";
import { ALL_CITY } from "@/constants";
export default {
  name: "secretCreate",
  data() {
    const generateData = _ => {
      const data = [];
      const cities = ['上海', '北京', '广州', '深圳', '南京', '西安', '成都'];
      const pinyin = ['shanghai', 'beijing', 'guangzhou', 'shenzhen', 'nanjing', 'xian', 'chengdu'];
      cities.forEach((city, index) => {
        data.push({
          label: city,
          key: index,
          pinyin: pinyin[index]
        });
      });
      return data;
    };
    return {
      data: generateData(),
      filterMethod(query, item) {
          return item.pinyin.indexOf(query) > -1;
        },
      se: {
        tabPosition: 'jt',
        value: [],
        name: '',
        radio: '2'
      }  
    };
  },
  components: {
   addSecret
  },
  created() {
     // 从路由获取类型
    
  },
  methods: {
    //返回上一层
    goBack(){
          this.$router.go(-1);
    },
    creatSecret(){
       this.$router.push({name:'secret'});
    }
  }
};
</script>

<style lang="scss" scoped>
.header {
  height:40px;
  border-bottom:1px solid #ddd;
  padding-bottom:10px;
}
.flex {
  display: flex;
}
.bg {
  background-color: #F2F2F2;
  margin-bottom: 10px;
  padding: 10px;
  width:590px;
}
</style>


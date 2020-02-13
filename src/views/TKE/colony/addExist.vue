<!-- 添加已有节点 -->
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
          <h2 class="header-title">cls-gwblk71e（tfy_test1）</h2>
        </div>
        <!-- 右侧 -->
        <div class="grid-right"></div>
      </div>
    </div>

    <div class="colony-main">
      
      <div class="tke-card tke-formpanel-wrap mb60">
        <div class="tke-step tke-grid">
          <div class="tke-step-item is-curr">
            <span class="num">1</span>
            <span class="title">选择节点</span>
            <i class="el-icon-arrow-right"></i>
          </div>
          <div class="tke-step-item" :class="{ 'is-curr': secondTab }">
            <span class="num">2</span>
            <span class="title">云服务器配置</span>
          </div>
        </div>
        <hr style="margin-left:-20px;margin-right:-20px"/>
        <!--第一步-->
        <div class="tke-" v-if="firstTab">
          <div class="flex">
            <div>可用用户组</div>
            <div style="margin-left:320px;">已选择用户组</div>
          </div>
          <el-transfer
            filterable
            filter-placeholder="请输入用户组名称"
            v-model="genDataValue"
            :data="data">
          </el-transfer>
        </div>
        <!-- 底部 -->
        <div class="tke-formpanel-footer">
          <el-button size="small" @click="goBack">取消</el-button>
          <el-button size="small" type="primary" @click="firstNext">下一步</el-button>
        </div>
        <!--第二歨-->
        <div v-if="secondTab">
          <el-form
            class="tke-form"
            :model="colony"
            label-position="left"
            label-width="120px"
            size="mini"
          >
            <el-form-item label="已选节点">
              <p>
                <a
                  href="#"
                  >ins-8zy655uc</a
                >
              </p>
              <span class="tke-tips">提示：以上节点需要重装系统，同时会将以上节点迁移至当前集群的新增资源所属项目下。注意：重装后，节点系统盘内的所有数据将被清除，恢复到初始状态；迁移项目后原安全组解绑，需要重新绑定安全组</span>
            </el-form-item>
            <el-form-item label="数据盘挂载">
              <el-checkbox></el-checkbox>
              <!-- <input class="tke-checkbox" type="checkbox"/> -->
              <span style="color:#000;">自动格式化数据盘成ext4，仅对拥有一块数据盘的节点生效</span>
            </el-form-item>
            <el-form-item label="容器目录">
              <el-checkbox></el-checkbox>
              <!-- <input class="tke-checkbox" type="checkbox"/> -->
              <span style="color:#000;">设置容器和镜像存储目录，建议存储到数据盘</span>
            </el-form-item>
            <hr/>
            <el-form-item label="新增资源所属项目">
              <p style="color:#000;">默认项目</p>
              <span>集群内新增的云服务器、负载均衡器等资源将会自动分配到该项目下。<a href="#">使用指引</a><i class="el-icon-edit-outline"></i></span>
            </el-form-item>
            <el-form-item>
              <span slot="label">操作系统 <i class="el-icon-info"></i></span>
              <p style="color:#000;">Ubuntu Server 16.04.1 LTS 64bit</p>
            </el-form-item>
            <el-form-item label="登录方式">
              <div class="tke-second-radio-btn">
                <el-radio-group @change="changeType" v-model="loginType">
                  <el-radio-button label="1">立即关联秘钥</el-radio-button>
                  <el-radio-button label="2">自动生成密码</el-radio-button>
                  <el-radio-button label="3">设置密码</el-radio-button>
                </el-radio-group>
              </div>
            </el-form-item>
            <el-form-item label="用户名" v-if="joinPassWord">
              <p style="color:#000;">user</p>
            </el-form-item>
            <el-form-item label="SSH密钥" v-if="joinPassWord">
              <div class="tke-third-select">
                <el-select placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
                <i class="el-icon-refresh ml5"></i>
                <a href="#">使用指引</a><i class="el-icon-edit-outline"></i>
                <p>如您现有的密钥不合适，可以<a href="#">现在创建</a><i class="el-icon-edit-outline"></i></p>
              </div>
            </el-form-item>
            <el-form-item label="用户名" v-if="setPassWord">
              <p style="color:#000;">user</p>
            </el-form-item>
            <el-form-item label="密码" v-if="setPassWord">
              <input type="password"/>
              <p>linux机器密码需8到16位，至少包括两项（[a-z,A-Z] , [0-9]和[()`~!@#$%^&*-+=|{}[]:;',.?/]的特殊符号）</p>
            </el-form-item>
            <el-form-item>
              <span slot="label">安全组 <i class="el-icon-info"></i></span>
              <div class="tke-third-select">
                <el-select placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
                <i class="el-icon-refresh ml5"></i>
                <p><a href="#">添加安全组</a></p>
              </div>
            </el-form-item>
            <el-form-item label="安全加固">
              <el-checkbox>免费开通</el-checkbox>
              <p>安装组件免费开通DDoS防护、WAF和云镜主机防护<a href="#">详细介绍</a><i class="el-icon-edit-outline"></i></p>
            </el-form-item>
            <el-form-item label="云监控">
              <el-checkbox>免费开通</el-checkbox>
              <p>免费开通云产品监控、分析和实施告警，安装组件获取主机监控指标<a href="#">详细介绍</a><i class="el-icon-edit-outline"></i></p>
            </el-form-item>
            <p><i :class="[isActive?'el-icon-caret-bottom':'el-icon-caret-right']"></i><el-button type="text" style='font-size:12px;' @click='isActive=!isActive'>高级设置</el-button></p>
            <el-form-item v-show="isActive">
              <span slot="label">自定义数据 <i class="el-icon-info"></i></span>
              <el-input
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows:4 }"
                  placeholder="可选，用于启动时配置实例，支持Shell格式，原始数据不能超过16KB"
                  v-model="textarea2"
                  class='w420'>
                </el-input>
            </el-form-item>

            <el-form-item label="封锁（cordon）" v-show='isActive'>
              <el-checkbox>开启封锁</el-checkbox>
                <el-form-item>
                <p>封锁节点后，将不接受新的Pod调度到该节点，需要手动取消封锁的节点，或在自定义数据中执行<a href="https://cloud.tencent.com/document/product/457/18824" target="_blank">取消封锁命令</a><i class="el-icon-edit-outline"></i></p>
                </el-form-item>
            </el-form-item>
            <el-form-item label="Label" v-show="isActive">
              <el-form-item
                v-for="(domain, index) in domainstion"
                :key="domain.key"
              >
                <div class="form-input">
                  <el-input size="mini"  class='w70'></el-input>
                  <span>=</span>
                  <el-input size="mini"  class='w70'></el-input><i class="el-icon-error ml10" @click.prevent="removeDomain2(domain)"></i>
                </div>
              </el-form-item>
              <el-form-item>
                <el-button type="text"  @click="addDomain2" >新增Lable</el-button>
                <p>标签名称只能包含字母、数字及分隔符("-"、"_"、"."、"/")，且必须以字母、数字开头和结尾</p>
                <p>标签值只能包含字母、数字及分隔符("-"、"_"、".")，且必须以字母、数字开头和结尾</p>
              </el-form-item>
            </el-form-item>
          </el-form>
          <!-- 底部 -->
          <div class="tke-formpanel-footer">
            <el-button size="small" @click="secondPrev">上一步</el-button>
            <el-button size="small" type="primary" @click="firstNext">完成</el-button>
          </div>
        </div>
      </div>
    </div>

   
  </div>
</template>

<script>
import HeadCom from "@/components/public/Head";
import SEARCH from "@/components/public/SEARCH";
import FileSaver from "file-saver";
import XLSX from "xlsx";
import { ALL_CITY } from "@/constants";
export default {
  name: "clusterAddExist",
  data() {
    const generateData = _ => {
      const data = [];
      const cities = ['测试误删', '误删', 'ac', '可以删除', 'dfa', 'aaaaaaaaaaaaa', 'ddddddddd'];
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
      //第一个tab
      firstTab: true,
      //第二个tab
      secondTab: false,
      //关联密码选项
      joinPassWord: true,
      //自动生成密码选项
      autoPassWord: false,
      //设置密码选项
      setPassWord: false,
      isActive: false,
      domainstion: [],
      loginType: 1,
      textarea2: '',
      data: generateData(),
      genDataValue:[],
      colony: {
        chargingMode:'mode1',
        
      },
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
      ],
      searchInput: ""
    };
  },
  components: {
    HeadCom,
    SEARCH
  },
  created() {

  },
  methods: {
    //返回上一层
    goBack(){
          this.$router.go(-1);
    },
    // 监听搜索框的值
    changeSearchInput(val) {
      this.searchInput = val;
    },
    // 点击搜索
    clickSearch(val) {
      this.searchInput = val;
    },
    // 第一步 下一步
    firstNext () {
      this.firstTab = false;
      this.secondTab = true;
    },
    //第二歨 上一步
    secondPrev() {
      this.firstTab = true;
      this.secondTab = false;
    },
    addDomain2() {
      this.domainstion.push({
        value: '',
        valueKey: '',
        key: Date.now()
      })
    },
    //选择登录方式
    changeType(val) {
      if(val === '1') {
        this.joinPassWord = true;
        this.autoPassWord = false;
        this.setPassWord = false;
      } else if (val === '2') {
        this.joinPassWord = false;
        this.autoPassWord = true;
        this.setPassWord = false;
      } else {
        this.joinPassWord = false;
        this.autoPassWord = false;
        this.setPassWord = true;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
  .tke-tips{
    color: #e54545;
  }
  .tke-checkbox{
    height: 16px;
    width: 16px;
    background-color: #fff;
    vertical-align: middle;
    margin-right: 5px;
    border: 1px solid #bbb;
  }
  .flex {
    display: flex;
  }

</style>


 <!-- 新建伸缩组 -->
<template>
  <div class="colony-wrap">
    <!-- <HeadCom title="集群管理">
      <el-button style="margin-left:10px;" v-if="!btnload">{{region}}</el-button>
      <el-button style="margin-left:10px;"  icon="el-icon-loading"></el-button>
    </HeadCom> -->
    <div class="tke-content-header">
      <div class="tke-grid ">
        <!-- 左侧 -->
        <div class="grid-left">
          <span class="goback" @click="goBack">
            <i class="el-icon-back"></i>
          </span>
          <h2 class="header-title">新建伸缩组</h2>
        </div>
        <!-- 右侧 -->
        <div class="grid-right"></div>
      </div>
    </div>  
    <div class="colony-main">

      <div class="tke-card tke-formpanel-wrap mb60">
        <h4  class="tke-formpanel-title">启动配置</h4>
        <el-form  class="tke-form" :model="asg" label-position='left' label-width="120px" size="mini">
          <el-form-item label="名称">
            <el-input class="w200" v-model="asg.name" placeholder="请输入名称"></el-input>
          </el-form-item>
          <el-form-item label="实例类型">
             <el-radio-group  v-model="asg.typeRadio" size="small">
              <el-radio-button label="type1">按量计费</el-radio-button>
              <el-radio-button label="type2">竞价付费</el-radio-button>
            </el-radio-group>
            <p v-if="asg.typeRadio=='type2'">	竞价实例(Spot)可以让您以一定幅度的折扣购买实例,但同时系统可能会自动回收这些折扣售卖的实例,<span class="tke-text-link">查看详情</span></p>
          </el-form-item>
          <el-form-item label="机型设置">
            <div class='form-controls' >
              <el-form  class="tke-form"  label-position='left' label-width="120px" size="mini">
                <el-form-item label="可用区">
                  <el-radio-group  v-model="asg.regionRadio" size="small">
                    <el-radio-button label="region1">全部可用区</el-radio-button>
                    <el-radio-button label="region2">台北一区</el-radio-button>
                  </el-radio-group>
                  <p>启动配置里不包含可用区信息，提供可用区选择的目的是帮助您在已确定将启动实例可用区时，过滤出可用实例类型。</p>
                </el-form-item>
                <el-form-item label="机型">
                  <div class="tke-form-item_text"><span>S3.SMALL1(标准型S3,1核1GB)</span><i class="el-icon-edit tke-icon"></i></div>
                </el-form-item>
                <el-form-item label="系统盘">
                  <div class="tke-form-item_text"><span>高性能云硬盘 50GB</span><i class="el-icon-edit tke-icon"></i></div>
                </el-form-item>
                <el-form-item label="数据盘">
                  <div class="tke-form-item_text"><span>暂不购买</span><i class="el-icon-edit tke-icon"></i></div>
                </el-form-item>
                <el-form-item label="公网带宽">
                  <div class="tke-form-item_text"><span>按带宽计费 1Mbps</span><i class="el-icon-edit tke-icon"></i></div>
                </el-form-item>
              </el-form>
            </div>
          </el-form-item>

          <el-form-item label="登录方式">
             <el-radio-group  v-model="asg.pwdRadio" size="small" @change="setLable($event)">
              <el-radio-button label="pwd1">设置密码</el-radio-button>
              <el-radio-button label="pwd2">立即关联密钥</el-radio-button>
              <el-radio-button label="pwd3">自动生成密码</el-radio-button>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="SSH密钥" v-show="flag1">
             <el-select v-model="value" filterable placeholder="请选择"  class="w200">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="用户名" v-show="flag2">
             <div class="tke-form-item_text"><span>uunin</span></div>
          </el-form-item>
          <el-form-item label="密码" v-show="flag2">
             <el-input class="w200" v-model="pass.password" placeholder="请输入密码"></el-input>
             <p class="pass">linux机器密码需8到16位，至少包括两项（[a-z,A-Z] , [0-9]和[()`~!@#$%^&*-+=|{}[]:;',.?/]的特殊符号</p>
          </el-form-item>
          <el-form-item label="确认密码" v-show="flag2">
            <el-input class="w200" v-model="pass.passwordAgin" placeholder="请输入确认密码"></el-input>
          </el-form-item>
          
          <el-form-item label="容器目录">
             <el-checkbox v-model="checked">设置容器和镜像存储目录，建议存储到数据盘</el-checkbox>
              <el-form-item v-show="checked">
                <el-input class="w200" v-model="inputRoom"></el-input>
              </el-form-item>
          </el-form-item>

          <!-- 添加安全组 -->
          <el-form-item label="安全组">
              <el-select v-model="valueOne" placeholder="请选择"  class='w200' style="margin-bottom:15px;">
                <el-option
                  v-for="item in optionsOne"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                 >
                </el-option>
              </el-select><i class="el-icon-refresh ml10"></i><i class="el-icon-error ml10" v-show="this.domains.length?true:false" @click.prevent="deleteAll()"></i>
                 <el-form-item
                    v-for="(domain, index) in domains"
                    :key="domain.key"
                  >
                  <el-select v-model="values" placeholder="请选择"  class='w200'>
                    <el-option
                      v-for="item in domain.value"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select><i class="el-icon-refresh ml10"></i><i class="el-icon-error ml10" @click.prevent="removeDomain(domain)"></i>
                </el-form-item>
                <el-form-item>
                  <el-button type="text"  @click="addDomain" >新增域名</el-button>
                </el-form-item>
          </el-form-item>

          <el-form-item label="安全加固">
             <el-checkbox v-model="checkedOne">免费开通</el-checkbox>
              <el-form-item>
               安装组件免费开通DDoS防护、WAF和云镜主机防护<a href="https://cloud.tencent.com/product/cwp?_ga=1.173966502.440655928.1500464439" target="_blank">详细介绍</a>
              </el-form-item>
          </el-form-item>

          <el-form-item label="云监控">
             <el-checkbox v-model="checkedTwo">免费开通</el-checkbox>
              <el-form-item>
               <p style="color:#ff9d00;" v-show='!checkedTwo'>取消勾选将无法获得集群、主机、容器等相关监控信息及告警等能力，请慎重选择</p>
               <p>免费开通云产品监控、分析和实施告警，安装组件获取主机监控指标<a href="https://cloud.tencent.com/product/cm" target="_blank">详细介绍</a></p>
              </el-form-item>
          </el-form-item>

          <el-form-item label="Label">
                 <el-form-item
                    v-for="(domain, index) in domainstion"
                    :key="domain.key"
                  >
                   <div class="form-input">
                      <el-input v-model="domain.value" size="mini"  class='w70'></el-input>
                      <span>=</span>
                      <el-input v-model="domain.valueKey" size="mini"  class='w70'></el-input><i class="el-icon-error ml10" @click.prevent="removeDomain2(domain)"></i>
                    </div>
                </el-form-item>
                <el-form-item>
                  <el-button type="text"  @click="addDomain2" >新增Lable</el-button>
                </el-form-item>
          </el-form-item>
          <p><i :class="[isActive?'el-icon-caret-bottom':'el-icon-caret-right']"></i><el-button type="text" style='font-size:12px;' @click='isActive=!isActive'>高级设置</el-button></p>
          <el-form-item label="自定义数据" v-show="isActive">
            <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows:4 }"
                placeholder="请输入内容"
                v-model="textarea2"
                class='w420'>
              </el-input>
          </el-form-item>

          <el-form-item label="封锁（cordon）" v-show='isActive'>
             <el-checkbox v-model="checkedThree">开启封锁</el-checkbox>
              <el-form-item>
               <p>封锁节点后，将不接受新的Pod调度到该节点，需要手动取消封锁的节点，或在自定义数据中执行<a href="https://cloud.tencent.com/document/product/457/18824" target="_blank">取消封锁命令</a></p>
              </el-form-item>
          </el-form-item>
        </el-form>
        
        <hr>
        
        <h4  class="tke-formpanel-title">伸缩组配置</h4>

        <el-form class="tke-form" :model="asg" label-position='left' label-width="120px" size="mini">
          <el-form-item label="支持网络">
             <el-select v-model="value" disabled placeholder="请选择">
              <el-option
                v-for="item in optionsOne"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          
          <el-form-item label="支持子网">
              <el-table
                ref="multipleTable"
                :data="tableData"
                tooltip-effect="dark"
                style="width: 80%"
                @selection-change="handleSelectionChange">
                <el-table-column
                  type="selection"
                  width="55">
                </el-table-column>
                <el-table-column
                  label="子网ID"
                  width="200">
                  <template slot-scope="scope">{{ scope.row.date }}</template>
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="子网名称"
                  width="200">
                </el-table-column>
                <el-table-column
                  prop="address"
                  label="可用区"
                  show-overflow-tooltip>
                </el-table-column>
            </el-table>
          </el-form-item>

           <el-form-item label="节点数量范围">
            <div class="form-input">
              <el-input v-model="textOne" size="mini"  class='w150' placeholder="最小节点"></el-input>
              <span>~</span>
              <el-input v-model="textTwo" size="mini"  class='w150' placeholder="最大节点"></el-input>
            </div>
            <p>在设定的节点范围内自动调节，不会超出该设定范围</p>
            <p>扩缩容条件 集群内容器缺少可用资源调度时将触发扩容，集群内空闲资源较多时将触发缩容，详情见<a href='https://cloud.tencent.com/document/product/457/32190#.E9.80.9A.E8.BF.87.E5.BC.B9.E6.80.A7.E4.BC.B8.E7.BC.A9.E8.87.AA.E5.8A.A8.E6.B7.BB.E5.8A.A0.2F.E7.A7.BB.E9.99.A4.E8.8A.82.E7.82.B9' target="_blank">集群自动扩缩容说明</a></p>
          </el-form-item>

          <el-form-item label="重试策略">
             <el-radio-group  v-model="Radio" size="small" @change="setRadio($event)">
              <el-radio-button label="pwd1">快速重试</el-radio-button>
              <el-radio-button label="pwd2">简介递增重试</el-radio-button>
            </el-radio-group>
            <p v-show="Radio==='pwd1'">立即重试，在较短时间内快速重试，连续失败超过一定次数（5次）后不再重试。</p>
            <p v-show="Radio==='pwd2'">间隔递增重试，随着连续失败次数的增加，重试间隔逐渐增大，重试间隔从秒级到1天不等。</p>
          </el-form-item>
        </el-form>
        <!-- 底部 -->
        <div class="tke-formpanel-footer">
          <el-button size="small" type="primary">创建伸缩组</el-button>
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
  name: "asgCreate",
  data() {
    return {
      flag1: true,
      flag2: false,
      checked: false,
      checkedOne: true,
      checkedTwo: true,
      checkedThree: false,
      textarea2: '',
      inputRoom: '/var/lib/docker',
      isActive: false,
      textOne: '',
      textTwo: '',
      Radio: 'pwd1',
      asg: {
        name: '',
        typeRadio:'type1',
        pwdRadio:'pwd1',
        regionRadio:'region1',
      },
      pass:{
        password:'',
        passwordAgin: ''
      },
      options: [{
        value: '选项1',
        label: 'xijian'
      }, {
        value: '选项2',
        label: 'SSEE'
      }, {
        value: '选项3',
        label: 'SSEEE'
      }],
      optionsOne: [{
        value: '选项1',
        label: 'xijian'
      }, {
        value: '选项2',
        label: 'SSEE'
      }, {
        value: '选项3',
        label: 'SSEEE'
      }],
      optionsOne: [],
      domains: [],
      domainstion: [],
      value: '',
      valueOne: '',
      values: [],
      tableData: [{
          date: 'subnet-nn56635p',
          name: 'asd',
          address: '台北一区'
        }, {
          date: 'subnet-nn56635p',
          name: 'asd',
          address: '台北一区'
        }, {
          date: 'subnet-nn56635p',
          name: 'asd',
          address: '台北一区'
        }],
    }
  },
  components: {
   
  },
  created() {

  },
  methods: {
    //返回上一层
    goBack(){
        this.$router.go(-1);
    },
    setLable(e){
      if(e === 'pwd1'){
        this.flag1 = true
        this.flag2 = false
      }
      if(e === 'pwd2'){
        this.flag1 = false
        this.flag2 = false
      }
      if(e === 'pwd3'){
        this.flag1 = false
        this.flag2 = true
      }

      console.log(e)
    },
     removeDomain(item) {
       console.log(item)
        var index = this.domains.indexOf(item)
        if (index !== -1) {
          this.domains.splice(index, 1)
        }
      },
      removeDomain2(item) {
       console.log(item)
        var index = this.domainstion.indexOf(item)
        if (index !== -1) {
          this.domainstion.splice(index, 1)
        }
      },
     addDomain() {
        this.domains.push({
          value: [],
          key: Date.now()
        })
      },
      addDomain2() {
        this.domainstion.push({
          value: '',
          valueKey: '',
          key: Date.now()
        })
      },
      deleteAll(){
        this.domains.splice(0,this.domains.length)
      },
      setRadio(e){

      }
  }
};
</script>

<style lang="scss" scoped>
.pass{
  font-size: 12px;
  color: #888;
  margin-top:8px;
}
.form-input{
    display: flex;
    justify-content: space-between;
    align-items: center;
    width:200px;
    span{
        margin:0 10px;
    }
    i{
        margin:0 10px;
        cursor: pointer;
    }
}
.form-p{
    margin-bottom: 10px;
    font-size: 12px;
    color: #888;
}

</style>


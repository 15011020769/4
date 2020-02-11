<template>
  <div class="persistenceSetting">
    <div class="back-hd flex">
      <router-link :to="'/logCollection'">
        <i class="el-icon-back hd-icon-back"></i>
      </router-link>
      <h3>新建日志采集规则</h3>
    </div>
      <div class="tf-g app-tke-fe-content__inner">
        <div class="event-persistence font">
          <el-form ref="form" :model="form" label-width="100px" class='tke-form' label-position="left">
            <el-form-item label="收集规则名称">
              <el-input size="mini" class="el-input" placeholder="请输入日志收集规则名称"></el-input>
              <div>最长63个字符，只能包含小写字母、数字及分隔符("-")，且必须以小写字母开头，数字或小写字母结尾</div>
            </el-form-item>
            <el-form-item label="所在地域">
              <div>中国台北</div>
            </el-form-item>
            <el-form-item label="所属集群">
              <div>cls-gwblk71e(tfy_test)</div>
            </el-form-item>
            <el-form-item label="类型">
              <el-radio-group v-model="tabPosition"  size='mini'>
                <el-radio-button label="one">容器标准输出</el-radio-button>
                <el-radio-button label="two">容器文件路径</el-radio-button>
                <el-radio-button label="three">节点文件路径</el-radio-button>
              </el-radio-group>
              <div>
                采集集群内任意服务下的容器日志，仅支持Stderr和Stdout的日志
                <a href="" style="margin-left:10px;">查看示例</a>
              </div>
            </el-form-item>
            <el-form-item label="日志源">
              <el-radio-group v-model="vlog" size='mini' v-if="tabPosition == 'one'">
                <el-radio-button label="one">所有容器</el-radio-button>
                <el-radio-button label="two">指定容器</el-radio-button>
              </el-radio-group>

              <div class="form-form position-form" v-if="vlog == 'one' && tabPosition == 'one'">
                  <i class='el-icon-edit-outline'></i>
                  <i class='el-icon-close'></i>
                  <div><span>Namespace:</span><span>default</span>|<span>采集对象:</span><span>全部容器</span></div>
              </div>

              <div class="form-form position-form" v-if="vlog == 'two' && tabPosition == 'one'">
                  <i class='el-icon-check'></i>
                  <i class='el-icon-close'></i>
                 <el-form-item label="所属Namespace" label-width="150px">
                    <el-select placeholder="请选择" size='mini' v-model='formTwo.value1'> 
                        <el-option
                          v-for="item in formFour.option1"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                 <el-form-item label="所属集群">
                  <div>cls-gwblk71e(tfy_test)</div>
                </el-form-item>
              </div>
















              <div class="form-form" v-if="tabPosition == 'two'">
                <el-form ref="form" :model="formTwo" label-width="100px" class='tke-form' label-position="left">
                     <el-form-item label="工作负载选项">
                       <el-select placeholder="请选择" size='mini' v-model='formTwo.value1'> 
                          <el-option
                            v-for="item in formTwo.option1"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                        <el-select placeholder="请选择" size='mini' class='ml10' v-model='formTwo.value2'>
                          <el-option
                            v-for="item in formTwo.option2"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                        <el-select placeholder="请选择" size='mini' class='ml10'>
                          <el-option
                            v-for="item in formTwo.option3"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="配置采集路径">
                        <div v-for="(domain,index) in formTwo.optionAll">
                          <el-form-item label="容器名">
                            <el-select placeholder="请选择" size='mini' class='ml10' v-model='domain.value4'>
                              <el-option
                                v-for="item in domain.option4"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                              </el-option>
                            </el-select>
                          </el-form-item>
                          <el-form-item label="文件路径">
                            <el-select placeholder="请选择" size='mini' class='ml10' v-model='domain.value5'>
                              <el-option
                                v-for="item in domain.option5"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                              </el-option>
                            </el-select>
                            <el-input class='w180' size='mini' placeholder="请输入文件路径"></el-input>
                            <el-tooltip class="item" effect="dark" content="删除" placement="right" v-if='index !=0'>
                                <i class="el-icon-close" @click.prevent="removeDomain(domain)"></i>
                            </el-tooltip>
                          </el-form-item>
                         </div>
                         <el-link type="primary" style="cursor: pointer;font-size:12px;"  @click="addDomain">新增变量</el-link>
                        <p>可配置多个路径，路径必须以`/`开头，支持通配符（*），请保证容器的日志文件保存在数据卷，否则收集规则无法生效</p>
                    </el-form-item>
                </el-form>
              </div>

              <div class="form-form" v-if="tabPosition == 'three'">
                <el-form-item label="收集路径">
                  <el-input size="mini" class="el-input" placeholder="请输入日志收集路径" v-model='formThree.value'></el-input>
                  <div>指定采集日志的文件路径，支持通配符(*)，必须以`/`开头</div>
                </el-form-item>
                <el-form-item label="metadata">
                  <div style="width:300px;" > 
                    <div class="form-input"  v-for="(domain, index) in formThree.domains"
                  :key="domain.key">
                          <el-input v-model="domain.value" size="mini" placeholder="变量名"></el-input>
                          <span>=</span>
                          <el-input v-model="domain.valueKey" size="mini" placeholder="变量值"></el-input>
                          <el-tooltip class="item" effect="light" content="删除" placement="right">
                              <i class="el-icon-close" @click.prevent="removeMetadata(domain)"></i>
                          </el-tooltip>
                      </div>
                    </div>
                  <el-link type="primary" style="cursor: pointer;font-size:12px;"  @click="addMetadata">新增metadata</el-link>
                  <div>收集规则收集的日志会带上metadata，并上报到消费端</div>
                </el-form-item>
              </div>
            </el-form-item>
            <el-form-item label="消费端">
              <div class="form-form">
                <!-- 内表单 -->
                <el-form ref="form" :model="form" label-width="90px" size="mini">
                  <el-form-item label="类型">
                    <el-radio-group v-model="consumer">
                      <el-radio-button label="one">Kafka</el-radio-button>
                      <el-radio-button label="two">日志服务CLS</el-radio-button>
                      <el-radio-button label="three">Elasticsearch</el-radio-button>
                    </el-radio-group>
                    <div style="font-size:10px;">
                      将采集的日志消费到消息服务Kafka中。
                      <a href="">查看示例</a>
                      
                    </div>
                  </el-form-item>
                  <el-form-item label="Kafka类型">
                    <div class="flex">
                      <input style="margin-top:6px;" class="el-checkbox" type="checkbox">
                      <div style="margin-left:5px;">使用腾讯云消息队列CKafka</div>
                    </div>
                  </el-form-item>
                  <el-form-item label="CKafka实例">
                    <div class="flex">
                      <el-select v-model="Ckafka.value" placeholder="请选择">
                        <el-option
                          v-for="item in Ckafka.options"
                          :key="item"
                          :value="item">
                        </el-option>
                      </el-select>
                     <el-select placeholder="请选择" disabled>
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                    </div>
                  </el-form-item>
                </el-form>
              </div>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit"  size='mini'>立即创建</el-button>
              <el-button  size='mini'>取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
</template>
<script>
import HeadCom from "@/components/public/Head";
export default {
  data(){
    return{
      genDataValue:[],
      filterMethod(query, item) {
        return item.pinyin.indexOf(query) > -1;
      },
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      formTwo:{
        option1:[
          {
            value:1,
            label:'请选择Namespace'
          },
          {
            value:2,
            label:'default'
          },
          {
            value:3,
            label:'kube-public'
          },
          {
            value:4,
            label:'kube-system'
          },
          {
            value:5,
            label:'tfy-pub'
          }
        ],
         option2:[
          {
            value:1,
            label:'请选择工作负载类型'
          },
          {
            value:2,
            label:'Deployment'
          },
          {
            value:3,
            label:'Daemonset'
          },
          {
            value:4,
            label:'Statefulset'
          },
          {
            value:5,
            label:'Cronjob'
          }
        ],
        option3:[],
        optionAll:[{
          option4:[],
          option5:[],
          value4:'',
          value5:'',
          valueKey:''
        }],
        value1:'',
        value2:'',
        value3:'',
      },
      formThree:{
        value:'',
        domains:[{
          value:'',
          valueKey:''
        }]
      },
      formFour:{
        option1:[
          {
            value:1,
            label:'请选择Namespace'
          },
          {
            value:2,
            label:'default'
          },
          {
            value:3,
            label:'kube-public'
          },
          {
            value:4,
            label:'kube-system'
          },
          {
            value:5,
            label:'tfy-pub'
          }
        ],
      },
      value:'jq',
      Ckafka:{
        value:'ckafka-2fnu2ckz(kafka-JC3LVVH3)',
        options:['请选择CKafka','ckafka-2fnu2ckz(kafka-Jc3LVVH3)','ckafka-hziw17yp(kafka-3JT6PKQD)','ckafka-ao3o6wyn(kafka-UJ62M7QY)','ckafka-4ty9m3w1(kafka-MZX5P5PX)']
      },
      tabPosition: 'one',
      vlog:'one',
      consumer:'one'
    }
  },
  watch: {
    value() {
      console.log(this.value)
    }
  },
  methods: {
    onSubmit() {
      alert('已提交')
    },
    removeDomain (item) {
        var index = this.formTwo.optionAll.indexOf(item)
        if (index !== -1) {
            this.formTwo.optionAll.splice(index, 1)
        }
    },
    addDomain () {
      this.formTwo.optionAll.push({
          option4:[],
          option5:[],
          value4:'',
          value5:'',
          valueKey:''
      })
    },
    addMetadata () {
      this.formThree.domains.push({
            value: '',
            valueKey: '',
        })
    },
    removeMetadata (item) {
        var index = this.formThree.domains.indexOf(item)
        if (index !== -1) {
            this.formThree.domains.splice(index, 1)
        }
    },
  },
  props:["uid"],
  components: {
    HeadCom
  },
}
</script>
<style lang="scss" scoped>
.workload {
  width:200px;
  height:30px;
  background-color:white;
  margin-left:96px;
  line-height:30px;
  padding-left: 5px;
}
.init {
  margin:0;
}
.mt12 {
  margin-top:12px;
}
.p3 {
  padding:3px 0 3px 0;
}
.numberEnd {
  display: inline-block;
  width: 28px;
  height: 29px;
  text-align: center;
  line-height: 28px;
  border: 1px solid #cccccc;
}
.w100 {
  width: 100px !important;
}
.glw {
  width:80px;
  padding-left: 5px;
}
.el-checkbox {
  width: 15px;
  height: 15px;
}
.form-form {
  width: 840px;
  padding: 20px;
  background-color: #f2f2f2;
  display: table;
  font-size: 12px;
  line-height: 1.5
}
.el-textarea {
  max-width:900px;
  width: 420px;
  padding-top: 5px;
  padding-bottom: 5px;
  // height: 100px;
}
.el-input {
  width:200px;
}
.back-hd {
  width: 100%;
  height: 51px;
  background: white;
  padding:15px;
  border-bottom: 1px solid #cccccc;
  font-size: 16px;
}
.hd-icon-back {
  font-weight: 900;
  font-size: 20px;
  color: #006eff;
  padding-right: 10px;
}
.log-div {
  display: inline-block;
  position: relative;
}
.log-input-red {
  border: 1px solid red;
  color:red;
}
.log-icon {
  position: absolute;
  top: 8px;
  right: 4px;
}
.log-input {
  width: 150px;
}
input {
  width: 200px;
  height: 28px;
  padding: 5px 10px;
  color: #eeeeee;
}
.tabs-size {
  width: 114px;
  height: 28px;
  font-size: 12px;
}
.active {
  width: 114px;
  height: 30px; 
  border: 1px solid #006eff;
  margin: auto;
  line-height: 30px;
}
.padding {
  padding:5px 0 5px 0;
}
.font-orange {
  color: #ff9d00;
}
.data-card-list {
  height: 28px;
  line-height: 28px;
}
.data-card-hd {
  width: 100px;
  height: 28px;
  line-height: 28px;
}
.flex {
  display: flex;
}
.font {
  font-size: 12px;
  color: #888888;
}
.app-tke-fe-content__inner {
  padding-top: 20px;
  max-width: 1360px;
  margin:0 auto;
}
.tf-g {
  font-size: 0;
  margin-bottom: 50px;
  // background: pink;
  padding:20px;
}
.event-persistence {
  padding: 20px;
  background: white;
  box-shadow: 0 1px 3px 0 rgba(0,0,0,.1);
}
.form-input{
    display: flex;
    justify-content: space-between;
    align-items: center;
    span{
        margin:0 10px;
    }
    i{
        margin:0 10px;
        cursor: pointer;
    }
}
.position-form{
  position:relative;
}
.el-icon-edit-outline{
  position:absolute;
  top:10px;
  right:50px;
}
.el-icon-check{
   position:absolute;
  top:10px;
  right:50px;
}
.el-icon-close{
  position:absolute;
  top:10px;
  right:30px;
}
</style>
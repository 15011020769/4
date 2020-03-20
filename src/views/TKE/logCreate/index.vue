<template>
  <div class="persistenceSetting">
    <div class="back-hd flex">
      <router-link :to="'/logCollection'">
        <i class="el-icon-back hd-icon-back"></i>
      </router-link>
      <h3 v-if="editStatus">{{$t('TKE.overview.bjgz')}}</h3>
      <h3 v-else>{{$t('TKE.overview.xjrzcj')}}</h3>
    </div>
    <div class="tf-g app-tke-fe-content__inner">
      <div class="event-persistence font">
        <el-form ref="form" :model="form" :rules="rules" label-width="100px" class="tke-form" label-position="left">
          <el-form-item :label="$t('TKE.overview.sjgzmc')" prop="name">
            <div v-if="editStatus">
              {{ $route.query.stashName }}
            </div>
            <div v-else>
              <el-input size="mini" class="el-input" :placeholder="$t('TKE.overview.qsrrzgzmc')" v-model="form.name"></el-input>
              <div :class="{ activeColor: fontColor }">
                {{$t('TKE.overview.xz')}}
              </div>
            </div>
          </el-form-item>
          <el-form-item label="所在地域">
            <div>{{$t('TKE.overview.zgtb')}}</div>
          </el-form-item>
          <el-form-item :label="$t('TKE.overview.ssjq')">
            <div>{{ $route.query.clusterId }}</div>
          </el-form-item>
          <el-form-item :label="$t('TKE.overview.lx')">
            <div v-if="!editStatus">
              <el-radio-group v-model="tabPosition" size="mini">
                <el-radio-button label="one">{{$t('TKE.overview.rqbzsc')}}</el-radio-button>
                <el-radio-button label="two">{{$t('TKE.overview.rqwjlj')}}</el-radio-button>
                <el-radio-button label="three">{{$t('TKE.overview.jdwjlj')}}</el-radio-button>
              </el-radio-group>
              <p v-if='tabPosition=="one"'>
                {{$t('TKE.overview.jzc')}}
                <!-- <a href="" style="margin-left:10px;">{{$t('TKE.overview.cksl')}}</a> -->
              </p>
              <p v-if='tabPosition=="two"'>
                {{$t('TKE.overview.cjzdrq')}}
                <!-- <a href="" style="margin-left:10px;">{{$t('TKE.overview.cksl')}}</a> -->
              </p>
              <p v-if='tabPosition=="three"'>
                {{$t('TKE.overview.zdlj')}}
                <!-- <a href="" style="margin-left:10px;">{{$t('TKE.overview.cksl')}}</a> -->
              </p>
            </div>
            <div v-else>
              <span v-if="$route.query.type == 'host-log'">{{$t('TKE.overview.jdwjlj')}}</span>
              <span v-if="$route.query.type == 'container-log'">{{$t('TKE.overview.rqbzsc')}}</span>
              <span v-if="$route.query.type == 'pod-log'"> {{$t('TKE.overview.rqwjlj')}}</span>
            </div>
          </el-form-item>
          <el-form-item :label="$t('TKE.overview.rzy')">
            <el-radio-group v-model="vlog" size="mini" v-if="tabPosition == 'one'">
              <el-radio-button label="one">所有容器</el-radio-button>
              <el-radio-button label="two">指定容器</el-radio-button>
            </el-radio-group>
            <div v-for="(item, index) in formFour" :key="index" style="margin-bottom:10px;">
              <div class="form-form position-form" v-show="
                  vlog == 'two' && tabPosition == 'one' && item.flag == false
                ">
                <i class="el-icon-edit-outline icon-edit-outline" @click="roomShow(index,item.value1)"></i>
                <i class="el-icon-close icon-close" @click="removeNewRoom(formFour, index)"></i>
                <div>
                  <span>Namespace:</span><span>{{item.value1}}</span>|<span>{{$t('TKE.overview.cjdx')}}</span>
                  <span v-show="item.radio=='1'">全部容器</span>
                  <span v-show="item.radio!='1'">{{item.workload}}{{$t('TKE.overview.ggzfz')}}</span>
                </div>
              </div>

              <div class="form-form position-form" v-show="
                  vlog == 'two' && tabPosition == 'one' && item.flag == true 
                ">
                <i class="el-icon-check icon-check" @click="roomShow(index,item.value1)"></i>
                <i class="el-icon-close icon-close" @click="removeNewRoom(formFour, index)"></i>
                <el-form-item :label="$t('TKE.overview.ssnmkj')" label-width="150px">
                  <el-select :placeholder="$t('TKE.overview.qxz')" size="mini" v-model="item.value1" @change="clearSelect(index)">
                    <el-option v-for="item in namespaceOptions1" :key="item" :value="item">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label="$t('TKE.overview.ssjq')">
                  <el-radio-group v-model="item.radio">
                    <el-radio label="1">{{$t('TKE.overview.qbrq')}}</el-radio>
                    <el-radio label="2">{{$t('TKE.overview.agzfzxz')}}</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item v-show="item.radio == 2">
                  <div class="border-room">
                    <div class="border-text">
                      <div class="border-left">{{$t('TKE.overview.gzfzlx')}}</div>
                      <div class="border-right">{{$t('TKE.overview.lb')}}</div>
                    </div>
                   <!-- 传入相应工作负载选项 -->
                    <el-tabs tab-position="left" class="tab-set" style="height: 200px;" v-model="item.activeName"
                    
                      @tab-click="workLoadTab(item.activeName, index)">
                      <el-tab-pane label="Deployment" name="Deployment">
                        <div v-show="workload1" style="overflow:auto">
                          <el-checkbox-group v-model="item.check0" @change="checkboxChange0(item.check0,item.value1,item.activeName,index)">
                            <p v-for="(item0,index0) in workload1" :key="index0">
                              <el-checkbox :label="item0.metadata.name">{{item0.metadata.name}}</el-checkbox>
                            </p>
                          </el-checkbox-group>

                        </div>
                        <span  v-show="workload1.length==0">{{$t('TKE.overview.dqlbwk')}}</span>
                      </el-tab-pane>
                      <el-tab-pane label="DaemonSet " name="DaemonSet">
                        <div v-show="workload1" style="overflow:auto">
                          <el-checkbox-group v-model="item.check1" @change="checkboxChange1(item.check1,item.value1,item.activeName,index)">
                            <p v-for="(item1,index1) in workload1" :key="index1">
                              <el-checkbox :label="item1.metadata.name">{{item1.metadata.name}}</el-checkbox>
                            </p>
                          </el-checkbox-group>
                        </div>
                        <span  v-show="workload1.length==0">{{$t('TKE.overview.dqlbwk')}}</span>
                      </el-tab-pane>
                      <el-tab-pane label="StatefulSet" name="StatefulSet">
                        <div v-show="workload1" style="overflow:auto">
                          <el-checkbox-group v-model="item.check2" @change="checkboxChange2(item.check2,item.value1,item.activeName,index)">
                            <p v-for="(item,index) in workload1" :key="index">
                              <el-checkbox :label="item.metadata.name">{{item.metadata.name}}</el-checkbox>
                            </p>
                          </el-checkbox-group>
                        </div>
                        <span  v-show="workload1.length==0">{{$t('TKE.overview.dqlbwk')}}</span>
                      </el-tab-pane>
                      <el-tab-pane label="CronJob" name="CronJob">
                        <div v-show="workload1" style="overflow:auto">
                          <el-checkbox-group v-model="item.check3" @change="checkboxChange3(item.check3,item.value1,item.activeName,index)">
                            <p v-for="(item,index) in workload1" :key="index">
                              <el-checkbox :label="item.metadata.name">{{item.metadata.name}}</el-checkbox>
                            </p>
                          </el-checkbox-group>
                        </div>
                        <span  v-show="workload1.length==0">{{$t('TKE.overview.dqlbwk')}}</span>
                      </el-tab-pane>
                      <el-tab-pane label="Job" name="Job">
                        <div v-show="workload1" style="overflow:auto">
                          <el-checkbox-group v-model="item.check4" @change="checkboxChange4(item.check4,item.value1,item.activeName,index)">
                            <p v-for="(item,index) in workload1" :key="index">
                              <el-checkbox :label="item.metadata.name">{{item.metadata.name}}</el-checkbox>
                            </p>
                          </el-checkbox-group>
                        </div>
                        <span  v-show="workload1.length==0">{{$t('TKE.overview.dqlbwk')}}</span>
                      </el-tab-pane>
                    </el-tabs>
                  </div>
                </el-form-item>
              </div>
            </div>
            <el-button :disabled="newroomFlag" v-show="vlog == 'two' && tabPosition == 'one'" class="new-room"
              @click="addNewRoom()">
              添加Namespace
            </el-button>
            <div class="form-form" v-if="tabPosition == 'two'">
              <el-form :model="formTwo" label-width="100px" class="tke-form" label-position="left">
                <el-form-item :label="$t('TKE.overview.gzfzxx')">
                  <el-select :placeholder="$t('TKE.overview.qxzmmkj')" :disabled='editStatus' size="mini" v-model="formTwo.value1">
                    <el-option v-for="item in namespaceOptions" :key="item" :label="item" :value="item">
                    </el-option>
                  </el-select>
                  <el-select :placeholder="$t('TKE.overview.qxz')" size="mini" :disabled='editStatus' class="ml10" v-model="formTwo.value2">
                    <el-option v-for="item in formTwo.option2" :key="item" :label="item" :value="item">
                    </el-option>
                  </el-select>
                  <el-select :placeholder="$t('TKE.overview.qxz')" :disabled="formTwo.value3=='無'||editStatus" size="mini" class="ml10"
                    v-model="formTwo.value3">
                    <el-option v-for="item in formTwo.option3" :key="item" :label="item" :value="item">
                    </el-option>
                  </el-select>
                  <p v-show="wlFlag" style="color:red"> {{$t('TKE.overview.qxzgz')}}</p>
                </el-form-item>
                <el-form-item :label="$t('TKE.overview.pzlj')" v-if="formTwo.value3!='無'">
                  <div v-for="(domain, index) in formTwo.optionAll" :key="index">
                    <el-form-item label="容器名">
                      <el-select :placeholder="$t('TKE.overview.qxz')" size="mini" class="ml10" v-model="domain.value4">
                        <el-option v-for="item in domain.option4" :key="item" :label="item" :value="item">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('TKE.overview.wjlj')">
                      <span v-if="!editStatus">
                        <el-select :placeholder="$t('TKE.overview.qxz')" size="mini" class="ml10" v-model="domain.value5">
                          <el-option v-for="item in domain.option5" :key="item" :label="item" :value="item">
                          </el-option>
                        </el-select>
                        <el-input class="w180" size="mini" v-model="domain.value6" :placeholder="$t('TKE.overview.qsrwjlj')"></el-input>
                      </span>
                      <span v-else>
                        <el-input class="w180" size="mini" v-model="domain.value7" :placeholder="$t('TKE.overview.qsrwjlj')"></el-input>
                      </span>
                      <el-tooltip class="item" effect="dark" :content="$t('TKE.overview.sc')" placement="right" v-if="index != 0">
                        <i class="el-icon-close" @click.prevent="removeDomain(domain)"></i>
                      </el-tooltip>
                    </el-form-item>
                  </div>
                  <el-link type="primary" style="cursor: pointer;font-size:12px;" @click="addDomain">{{$t('TKE.overview.xzbl')}}</el-link>
                  <p v-show="pathFlag" style="color:red">{{$t('TKE.overview.tj')}}</p>
                  <p>
                    {{$t('TKE.overview.pzdglj')}}
                  </p>
                </el-form-item>
              </el-form>
            </div>

            <div class="form-form" v-if="tabPosition == 'three'">
              <el-form-item :label="$t('TKE.overview.sjlj')">
                <el-input size="mini" class="el-input" :placeholder="$t('TKE.overview.qsrrzsjlj')" v-model="formThree.value"></el-input>
                <div :class="{active2:colFlag}">{{$t('TKE.overview.zctpf')}}</div>
              </el-form-item>
              <el-form-item label="metadata">
                <div style="width:300px;">
                  <div class="form-input" v-for="(domain, index) in formThree.domains" :key="index">
                    <el-input v-model="domain.value" size="mini" :placeholder="$t('TKE.overview.blm')"></el-input>
                    <span>=</span>
                    <el-input v-model="domain.valueKey" size="mini" :placeholder="$t('TKE.overview.blz')"></el-input>
                    <el-tooltip class="item" effect="light" :content="$t('TKE.overview.sc')" placement="right">
                      <i class="el-icon-close" @click.prevent="removeMetadata(domain)"></i>
                    </el-tooltip>
                  </div>
                </div>
                <el-link type="primary" style="cursor: pointer;font-size:12px;" @click="addMetadata">新增metadata
                </el-link>
                <div>{{$t('TKE.overview.sbxfd')}}</div>
                <p v-show="metaFlag" class="active2">{{$t('TKE.overview.qsrwz')}}</p>
              </el-form-item>
            </div>
          </el-form-item>
          <el-form-item :label="$t('TKE.overview.xfduan')">
            <div class="form-form">
              <!-- 内表单 -->
              <el-form :model="form" ref="form" :rules="rules" label-width="90px" size="mini">
                <el-form-item :label="$t('TKE.overview.lx')">
                  <el-radio-group v-model="consumer">
                    <el-radio-button label="one">Kafka</el-radio-button>
                    <!-- <el-radio-button label="two">日志服务CLS</el-radio-button>
                      <el-radio-button label="three">Elasticsearch</el-radio-button> -->
                  </el-radio-group>
                  <div style="font-size:10px;">
                    {{$t('TKE.overview.xxfw')}}
                    <!-- <a href="">{{$t('TKE.overview.cksl')}}</a> -->
                  </div>
                </el-form-item>
                <div v-if="consumer == 'one'">
                  <el-form-item :label="$t('TKE.overview.kfklx')">
                    <div class="flex">
                      <el-checkbox v-model="checked">{{$t('TKE.overview.sytfy')}}</el-checkbox>
                    </div>
                  </el-form-item>
                  <el-form-item :label="$t('TKE.overview.sl')" v-if="checked">
                    <div class="flex">
                      <el-col :span="10">
                        <el-form-item prop="CKafka">
                          <!-- <el-select v-model="form.Ckafka" placeholder="请选择" style='margin-right:10px;'> -->
                          <el-select v-model="Ckafka.value" :placeholder="$t('TKE.overview.qxz')" class="setwidth2"
                            style="margin-right:5px;">
                            <el-option v-for="item in Ckafka.options" :key="item" :value="item">
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="10">
                        <el-form-item prop="Topic">
                          <el-select :placeholder="$t('TKE.overview.qxz')" class="setwidth" :disabled="Topic.options.length == '1'"
                            v-model="Topic.value">
                            <el-option v-for="item in Topic.options" :key="item" :value="item">
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </div>
                  </el-form-item>
                  <el-form-item :label="$t('TKE.overview.fwdz')" label-width="100px" v-if="!checked">
                    <el-input :placeholder="$t('TKE.overview.qsripdz')" style="margin-right:10px;" v-model="output2.host"></el-input>
                    <el-input :placeholder="$t('TKE.overview.qsrdk')" v-model="output2.port"></el-input>
                  </el-form-item>
                  <el-form-item :label="$t('TKE.overview.zti')" label-width="100px" v-if="!checked">
                    <el-input :placeholder="$t('TKE.overview.qsrt')" v-model="output2.topic"></el-input>
                    <p>
                      {{$t('TKE.overview.zc')}}
                    </p>
                    <p v-show="kafkaFlag" style="color:red">{{$t('TKE.overview.qsrzqgs')}}</p>
                  </el-form-item>
                </div>

                <!-- <div v-if="consumer=='two'">
                  <el-form-item label="日志服务实例" label-width="100px" v-if='!checked'>
                    <el-select placeholder="请选择" v-model='form.value1' style='margin-right:10px;'>
                      <el-option v-for="item in form.option1" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                    <el-select placeholder="请选择" v-model='form.value2' disabled>
                      <el-option v-for="item in form.option2" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                    <p>如现有的日志服务CLS不合适，您可以去控制台<el-link style='font-size:12px;' type="primary">新建日志集</el-link>
                    </p>
                  </el-form-item>
                </div> -->

                <!-- <div v-if="consumer=='three'">
                  <el-form-item label="Elasticsearch地址" label-width="120px">
                    <el-input placeholder="eg" v-model='form.Elasticsearch'></el-input>
                  </el-form-item>
                  <el-form-item label="索引" label-width="120px">
                    <el-input placeholder="eg" v-model='form.index'></el-input>
                    <p>最长60个字符，只能包含小写字母、数字及分隔符("-"、"_"、"+")，且必须以小写字母开头</p>
                  </el-form-item>
                </div> -->
              </el-form>
            </div>
          </el-form-item>
        </el-form>
        <!-- 底部 -->
        <div class="tke-formpanel-footer footer">
          <p>
            <el-button size="small" v-if="editStatus" @click="editSure" type="primary">完成</el-button>
            <el-button size="small" v-else :disabled="show1" @click="logCreat" type="primary">{{$t('TKE.overview.ljcj')}}</el-button>
            <el-button size="small" @click="$router.go(-1)">取消</el-button>
          </p>
          <p v-show="show1">
            {{$t('TKE.overview.wfcjgz')}}
            <el-tooltip class="item" effect="dark" :content="$t('TKE.overview.sxrzzt')" placement="bottom-start">
              <i class="el-icon-refresh"></i>
            </el-tooltip>
          </p>
          <p></p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import HeadCom from "@/components/public/Head";
  import {
    TKE_COLONY_QUERY,
    TKE_KAFKA_LIST,
    TKE_TOPIC_LIST
  } from "@/constants";
  export default {
    data() {
      //验证名称
      var validateName = (rule, value, callback) => {
        if (value === "") {
          this.fontColor = true;
          callback();
        } else {
          let reg = /^[a-z]([a-z0-9]|-){0,61}([a-z0-9])$/;
          let flag = reg.test(this.form.name);
          if (!flag) {
            this.fontColor = true;
            callback();
          } else {
            this.fontColor = false;
            callback();
          }
        }
      };
      return {
        editStatus: false,
        genDataValue: [],
        flagOne: true,
        filterMethod(query, item) {
          return item.pinyin.indexOf(query) > -1;
        },
        show1: false,
        fontColor: false,
        rules: {
          name: [{
            validator: validateName,
            trigger: "blur",
            required: false
          }],
        },
        form: {
          name: "",
          region: "",
          number: "",
          topic: "",
          option1: [],
          option2: [],
          value1: "",
          value2: "",
          Elasticsearch: "",
          index: "",
          Ckafka: "",
          Topic: ""
        },
        formTwo: {
          option1: [],
          option2: ['請選擇工作負載類型', 'Deployment', 'Daemonset', 'StatefulSet', 'Cronjob'],
          option3: ['請選擇workload'],
          optionAll: [{
            option4: ['請選擇容器名稱'],
            option5: ['請選擇掛載目錄'],
            value4: "", //容器名
            value5: "請選擇掛載目錄", //挂载目录文件路径1
            value6: '', //路径
            value7: '', //编辑状态下的路径
            valueKey: ""
          }],
          value1: "", //命名空间
          value2: "Deployment",
          value3: ""
        },
        formThree: {
          value: "",
          domains: []
        },
        formFour: [{
          value1: "",//命名空间
          radio: "1",
          flag: true,
          activeName: "Deployment",
          workload: '',
          check0:[],
          check1:[],
          check2:[],
          check3:[],
          check4:[],
          checkObj:{
            check1:{},
            check2:{},
            check3:{},
            check4:{},
            check5:{},
          },
        }],
        namespaceOptions: [],
        namespaceOptions1: [],
        value: "jq",
        Ckafka: {
          value: "",
          options: ["請選擇CKafka"]
        },
        Topic: {
          value: "",
          options: ["請選擇Topic"]
        },
        newroomFlag: true,
        options: [],
        output: {
          instance_id: "",
          topic_id: "",
          host: "",
          port: "",
          topic: ""
        },
        output2: {
          host: "",
          port: "",
          topic: ""
        },
        wlFlag: false,
        pathFlag: false,
        colFlag: false,
        metaFlag: false,
        kafkaFlag: false,
        tabPosition: "one",
        vlog: "one",
        consumer: "one",
        checked: true,
        instanceList: [],
        workload1: [],
        resourceVersion: '',
      };
    },
    watch: {
      Ckafka: {
        handler(val) {
          var params = {
            instanceId: val.value.split("(")[0]
          };
          this.output.instance_id = val.value.split("(")[0];
          var filtdata = this.instanceList.filter(item => {
            return item.instanceId == val.value.split("(")[0];
          });
          this.output.host = filtdata[0].vip;
          this.output.port = filtdata[0].vport;
          this.axios.post(TKE_TOPIC_LIST, params).then(res => {
            if (res.codeDesc === "Success") {
              var arr = ["請選擇Topic"];
              res.data.topicList.forEach(item => {
                arr.push(item.topicId + "(" + item.topicName + ")");
              });
              if (arr.length == '1') {
                this.Topic.value = "無"
              } else {
                this.Topic.value = arr[1]
              }
              this.Topic.options = arr;
            }
          });
        },
        deep: true
      },
      Topic: {
        handler(val) {
          if (val.value != "無" && val.value != "請選擇Topic") {
            this.output.topic_id = val.value.split("(")[0];
            this.output.topic = val.value.split(")")[0].split('(')[1];
          } else {
            this.output.topic_id = "";
            this.output.topic = "";
          }
        },
        deep: true
      },
      formTwo: {
        handler(val) {
          var params = {
            ClusterName: this.$route.query.clusterId.split("(")[0],
            Method: "GET",
            Path: "/apis/apps/v1beta2/namespaces/" + val.value1 + "/" + val.value2.toLocaleLowerCase() + 's',
            Version: "2018-05-25"
          };
          this.axios.post(TKE_COLONY_QUERY, params).then(res => {
            if (res.Response.Error === undefined) {
              this.formTwo.option3 = ['請選擇workload'];
              var data = JSON.parse(res.Response.ResponseBody);
              if (data.items) {
                data.items.forEach(item => {
                  //workload选项
                  this.formTwo.option3.push(item.metadata.name)
                })
                var needData = data.items.filter(val1 => {
                  return val1.metadata.name == this.formTwo.value3
                })
                if (needData.length != 0) {
                  //容器名称选项
                  val.optionAll.forEach(v => {
                    v.option4 = ['請選擇容器名稱']
                  })
                  var optionData = needData[0].spec.template.spec.containers; //存放容器名
                  optionData.forEach(val2 => {
                    val.optionAll.forEach(v => {
                      v.option4.push(val2.name) //容器名选项
                    })
                  })

                  val.optionAll.forEach(vi => { //当切换容器会出现不同下拉菜单选项
                    var needData2 = optionData.filter(val3 => {
                      return val3.name == vi.value4
                    }) //容器 存放
                    if (needData2.length != 0) {
                      if (needData2[0].volumeMounts) {
                        val.optionAll.forEach(v => {
                          v.option5 = ['請選擇掛載目錄']
                        })
                        needData2[0].volumeMounts.forEach(val4 => {
                          val.optionAll.forEach(v => {
                            v.option5.push(val4.mountPath)
                          })
                          // val.optionAll[0].option5.push(val4.mountPath)
                        })
                      } else {
                        val.optionAll.forEach(v => {
                          v.value5 = "無"
                        })
                      }
                    }
                  })
                } else {
                  val.optionAll[0].value4 = '無'
                }
              }
              
            }
          });


        },
        deep: true
      },
      formFour: {
        handler(val){
          val.forEach((item,index )=> {
            console.log('this.namespaceOptions.length',this.namespaceOptions.length)
            console.log('formFour.length',val.length)
            if (val.length == this.namespaceOptions.length) {
              this.newroomFlag = true
              return false
            }
            if (item.radio == '2') {
              //请求接口，重新获得workload数据
              this.workload1=[];

                this.workLoadTab(item.activeName, index)
            }
            //新建禁用判断
            if (item.radio == '1') {
              this.newroomFlag = false
            } else if (item.radio == '2' && val.length != this.namespaceOptions.length) {
              this.newroomFlag = false
            } else {
              this.newroomFlag = true
            }
          })
        },
        deep: true
      },
    },
    created() {
      //判断是否是编辑状态
      if (this.$route.query.stashName) {
        this.editStatus = true;
        //回显数据
        this.reflowData()
      } else {
        this.editStatus = false;
        this.nameSpaceList();
      }
      this.checkCluster(); //检查是否可以创建日志
      this.kafkaList();
    },
    mounted() {},
    methods: {
     
      async reflowData(){
         await this.nameSpaceList()
         await this.findEditData();
      },
      //创建
      logCreat() {
        if (this.form.name == "") {
          this.$refs.form.validateField("name");
          this.$message({
            message:"規則名不能為空",
            type:'warning',
            showClose: true,
            duration: 0
            });
          return false;
        }

        var params = {
          ClusterName: this.$route.query.clusterId.split("(")[0],
          Method: "POST",
          Path: "/apis/platform.tke/v1/clusters/" +
            this.$route.query.clusterId.split("(")[0] +
            "/logcollector?namespace=kube-system",
          RequestBody: {
            kind: "LogCollector",
            apiVersion: "ccs.cloud.tencent.com/v1",
            metadata: {
              name: this.form.name,
              namespace: "kube-system"
            },
            spec: {
              description: "tempory nothing",
              input: {},
              output: {}
            }
          },
          Version: "2018-05-25"
        };


        if (this.checked) {
          //是否使用腾讯云消息队列kafka
          params.RequestBody.spec.output.ckafka_output = this.output;
          params.RequestBody.spec.output.type = "ckafka";
        } else {

          if (!this.IsRule1(this.output2.topic) || !this.IsIp(this.output2.host) || this.output2.port == '') {
            this.kafkaFlag = true
            return false
          } else {
            this.kafkaFlag = false;
          }

          params.RequestBody.spec.output.kafka_output = this.output2;
          params.RequestBody.spec.output.type = "kafka";
        }

        //容器标准输出
        if (this.tabPosition == "one") {

          if (this.vlog == 'one') { //所有容器
            params.RequestBody.spec.input = {
              container_log_input: {
                all_namespaces: true,
                namespaces: []
              },
              type: "container-log"
            };
          } else { //指定容器

            var arr1=[],arr2=[] ;
            var map = {}, result = [];
            console.log(this.formFour,'this.formFour')
            this.formFour.forEach(item => {
              var obj = new Object();
              obj['namespace'] = item.value1;
              if (item.radio == '1') {
                obj['all_containers'] = true;
                obj['workloads'] = [];
                arr2.push(obj)
              }else {
                // let
               for(let i in  item.checkObj){
                  if(item.checkObj[i].val&&item.checkObj[i].val.length){
                        console.log(item.checkObj[i],'zhi')
                      let obj2={};
                      obj2.namespace=item.checkObj[i].acname;
                      obj2.all_containers= false;
                      obj2.workloads=item.checkObj[i].val.map(v=>{
                        return {type:item.checkObj[i].type,name:v}
                      })
                  arr1.push(obj2)
                  }
                }
              }
            })
            for(var i = 0; i < arr1.length; i++){
                  var ai = arr1[i];
                  if(!map[ai.namespace]){
                      result.push({
                          namespace: ai.namespace,
                          all_containers: false,
                          workloads: ai.workloads
                      });
                      map[ai.namespace] = ai;
                  }else{
                      for(var j = 0; j < result.length; j++){
                          var dj = result[j];
                          if(dj.namespace == ai.namespace){
                              dj.workloads.push(...ai.workloads);
                              break;
                          }
                      }
                  }
            }
              console.log(result,'result')
            params.RequestBody.spec.input = {
              container_log_input: {
                all_namespaces: false,
                namespaces: [...result,...arr2],
              },
              type: "container-log"
            };
          }
        } else if (this.tabPosition == "two") {
          //容器文件路径
          if (!this.formTwo.value3 | this.formTwo.value3 == '請選擇workload') { //工作负载选项判断
            this.wlFlag = true
            return false
          } else {
            this.wlFlag = false
          }
          this.formTwo.optionAll.forEach(v => { //采集路径选项判断
            if (v.value4 == '請選擇容器名稱' || v.value4 == '無' || v.value5 == '請選擇掛載目錄' || v.value6 == '' || v.value6 ==
              undefined || v.value6[0] != '/') {
              this.pathFlag = true
              return false
            } else {
              this.pathFlag = false
            }
          })
          if(this.pathFlag){
            return false
          }
          let data = this.formTwo.optionAll;
          var obj = new Object();
          data.forEach((x, y) => {
            if (!obj[x.value4]) {
              obj[x.value4] = []
            }
            obj[x.value4].push({
              path: x.value5 + x.value6
            })
          })
          params.RequestBody.spec.input = {
            pod_log_input: {
              container_log_files: obj,
              metadata: true,
              workload: {
                name: this.formTwo.value3,
                type: this.formTwo.value2
              }
            },
            type: "pod-log"
          };
        } else if (this.tabPosition == "three") {
          //节点文件路径
          if (!(/^\//.test(this.formThree.value))) {
            this.colFlag = true
            return false
          } else {
            this.colFlag = false
          }

          if (this.formThree.domains.length != 0) {
            this.formThree.domains.forEach(v => {
              if (!(/^[a-z]([a-z0-9]|-){0,61}([a-z0-9])$/.test(v.value)) || v.valueKey == '') {
                this.metaFlag = true
                return false
              } else {
                this.metaFlag = false
              }
            })
          }
          var obj = new Object();
          this.formThree.domains.forEach(item => {
            obj[item.value] = item.valueKey;
          });
          params.RequestBody.spec.input = {
            host_log_input: {
              labels: obj,
              path: this.formThree.value
            },
            type: "host-log"
          };
        }
        // console.log(params)
          this.axios.post(TKE_COLONY_QUERY, params).then(res => {
            if (res.Response.Error === undefined) {
               this.$message({
                type: "success",
                message: "新建成功",
                duration: 0,
                showClose: true
              });
              this.$router.go(-1);
            }
          });
      },



      //编辑数据回显
     async   findEditData() {
        var stashName = this.$route.query.stashName;
        var namespace = this.$route.query.namespace;
        var clusterId = this.$route.query.clusterId;
        var params = {
          ClusterName: this.$route.query.clusterId.split("(")[0],
          Method: "GET",
          Path: "/apis/platform.tke/v1/clusters/" +
            this.$route.query.clusterId.split("(")[0] +
            "/logcollector?namespace=" +
            namespace +
            "&name=" +
            stashName,
          Version: "2018-05-25"
        };
     await   this.axios.post(TKE_COLONY_QUERY, params).then(res => {
          if (res.Response.Error === undefined) {
            var data = JSON.parse(res.Response.ResponseBody);
            this.resourceVersion = data.metadata.resourceVersion
            //节点文件路径
            if (data.spec.input.type == 'host-log') {
              this.tabPosition = 'three';
              this.formThree.value = data.spec.input.host_log_input.path;
              var data1 = data.spec.input.host_log_input.labels,
                arr = [];
              for (let i in data1) {
                var obj = {};
                obj['value'] = i;
                obj['valueKey'] = data1[i]
                arr.push(obj)
              }
              this.formThree.domains = arr
            } else if (data.spec.input.type == 'pod-log') { //容器文件路径

              this.tabPosition = 'two';

              this.formTwo.value1 = data.metadata.namespace;
              this.formTwo.value2 = data.spec.input.pod_log_input.workload.type;
              this.formTwo.value3 = data.spec.input.pod_log_input.workload.name;
              var data3 = data.spec.input.pod_log_input.container_log_files;

              var arr = [];
              for (let i in data3) {
                for (let j in data3[i]) {
                  var obj = new Object();
                  obj['value4'] = i;
                  obj['value5'] = '請選擇掛載目錄';
                  obj['value6'] = '';
                  obj['valueKey'] = '';
                  obj['value7'] = data3[i][j].path;
                  obj['option4'] = ['請選擇容器名稱'];
                  obj['option5'] = ['請選擇掛載目錄'];
                  arr.push(obj)
                }
              }
              this.formTwo.optionAll = arr;
            } else if (data.spec.input.type == 'container-log') { //容器标准输出
              //指定文件
              if (!data.spec.input.container_log_input.all_namespaces) {
                this.vlog = 'two';
               
              }
              let namespace=data.spec.input.container_log_input.namespaces,arr=[];
              console.log(namespace)
              namespace.forEach(item=>{
                if(item.all_containers){
                  let obj={}
                  obj.value1=item.namespace
                  obj.radio='1';
                  obj.flag=false;
                  obj.activeName='Deployment';
                  obj.workload= '';
                  obj.check0=[],
                  obj.check1=[],
                  obj.check2=[],
                  obj.check3=[],
                  obj.check4=[],
                  obj.checkObj={
                    check1:{},
                    check2:{},
                    check3:{},
                    check4:{},
                    check5:{},
                  }
                     arr.push(obj)
                }
                
                if(!item.all_containers){
                  let obj2={}
                   obj2.value1=item.namespace;
                   obj2.radio='2';
                   obj2.flag=false;
                   obj2.activeName='Deployment';
                   obj2.workload= item.workloads.length;
                   obj2.check0=[],
                   obj2.check1=[],
                   obj2.check2=[],
                   obj2.check3=[],
                   obj2.check4=[],
                   obj2.checkObj={
                      check1:{},
                      check2:{},
                      check3:{},
                      check4:{},
                      check5:{},
                    }
                  let arr1=[],arr2=[],arr3=[],arr4=[],arr5=[];
                  item.workloads.forEach(v=>{
                    if(v.type=='deployment'){
                        obj2.check0.push(v.name)
                        arr1.push(v.name)
                        obj2.checkObj.check1={
                           type:'deployment',
                           acname:item.namespace,
                           val:arr1,
                        }
                    }else if(v.type=='daemonset'){
                        obj2.check1.push(v.name)
                         arr2.push(v.name)
                        obj2.checkObj.check2={
                           type:'daemonset',
                           acname:item.namespace,
                           val:arr2,
                        }
                    }else if(v.type=='statefulset'){
                         obj2.check2.push(v.name)
                           arr3.push(v.name)
                        obj2.checkObj.check3={
                           type:'statefulset',
                           acname:item.namespace,
                           val:arr3,
                        }
                    }else if(v.type=='cronjob'){
                       obj2.check3.push(v.name)
                         arr4.push(v.name)
                        obj2.checkObj.check4={
                           type:'cronjob',
                           acname:item.namespace,
                           val:arr4,
                        }
                    }else if(v.type=='job'){
                       obj2.check4.push(v.name)
                         arr5.push(v.name)
                        obj2.checkObj.check5={
                           type:'job',
                           acname:item.namespace,
                           val:arr5,
                        }
                    }
                  })
                  console.log(obj2,'obj2')
                   arr.push(obj2)
                }
              })

              if(arr.length!=0){
                this.formFour=arr;
              }
              if(this.formFour.length!=this.namespaceOptions.length){
                this.newroomFlag=false
              }else{
                  this.newroomFlag=true 
              }
            }
            if (data.spec.output.ckafka_output) {
              this.axios.post(TKE_KAFKA_LIST, {}).then(val => {
                if (val.codeDesc === "Success") {
                  //保存kafka的信息
                  this.instanceList = val.data.instanceList;
                  var value1 = this.instanceList.filter(item => {
                    return (
                      data.spec.output.ckafka_output.instance_id ==
                      item.instanceId
                    );
                  });
                  //消费端数据回显
                  this.Ckafka.value =
                    value1[0].instanceId + "(" + value1[0].instanceName + ")";
                  var params2 = {
                    instanceId: value1[0].instanceId
                  };
                  this.axios.post(TKE_TOPIC_LIST, params2).then(res3 => {
                    if (res3.codeDesc === "Success") {
                      var value2 = res3.data.topicList.filter(item => {
                        return data.spec.output.ckafka_output.topic_id == item.topicId
                      });
                      //消费端数据回显
                      this.Topic.value = value2[0].topicId + '(' + value2[0].topicName + ')';
                    }
                  });
                }
              });
            } else {
              this.checked = false;
              this.output2.host = data.spec.output.kafka_output.host;
              this.output2.port = data.spec.output.kafka_output.port;
              this.output2.topic = data.spec.output.kafka_output.topic;
            }
          }
        });
      },


      //确认编辑
      editSure() {

        var params = {
          ClusterName: this.$route.query.clusterId.split("(")[0],
          Method: "PUT",
          Path: "/apis/platform.tke/v1/clusters/" +
            this.$route.query.clusterId.split("(")[0] +
            "/logcollector?namespace=" +
            this.$route.query.namespace +
            "&name=" +
            this.$route.query.stashName,
          RequestBody: {
            kind: "LogCollector",
            apiVersion: "ccs.cloud.tencent.com/v1",
            metadata: {
              name: this.$route.query.stashName,
              namespace: this.$route.query.namespace,
              resourceVersion: this.resourceVersion
            },
            spec: {
              description: "tempory nothing",
              input: {},
              output: {}
            }
          },
          Version: "2018-05-25"
        };
        if (this.checked) {
          //是否使用腾讯云消息队列kafka
          params.RequestBody.spec.output.ckafka_output = this.output;
          params.RequestBody.spec.output.type = "ckafka";
        } else {
          if (!this.IsRule1(this.output2.topic) || !this.IsIp(this.output2.host) || this.output2.port == '') {
            this.kafkaFlag = true
            return false
          } else {
            this.kafkaFlag = false;
          }
          params.RequestBody.spec.output.kafka_output = this.output2;
          params.RequestBody.spec.output.type = "kafka";
        }
        //容器标准输出
        if (this.tabPosition == "one") {

          if (this.vlog == 'one') { //所有容器
            params.RequestBody.spec.input = {
              container_log_input: {
                all_namespaces: true,
                namespaces: []
              },
              type: "container-log"
            };
          } else { //指定容器

             var arr1=[],arr2=[] ;
            var map = {}, result = [];
            this.formFour.forEach(item => {
              var obj = new Object();
              obj['namespace'] = item.value1;
              if (item.radio == '1') {
                obj['all_containers'] = true;
                obj['workloads'] = [];
                arr2.push(obj);
              }else {
                // let
               for(let i in  item.checkObj){
                  if(item.checkObj[i].val&&item.checkObj[i].val.length){
                      let obj2={};
                      obj2.namespace=item.checkObj[i].acname;
                      obj2.all_containers= false;
                      obj2.workloads=item.checkObj[i].val.map(v=>{
                        return {type:item.checkObj[i].type,name:v}
                      })
                  arr1.push(obj2)
                  }
                }
              }
            })
            for(var i = 0; i < arr1.length; i++){
                  var ai = arr1[i];
                  if(!map[ai.namespace]){
                      result.push({
                          namespace: ai.namespace,
                          all_containers: false,
                          workloads: ai.workloads
                      });
                      map[ai.namespace] = ai;
                  }else{
                      for(var j = 0; j < result.length; j++){
                          var dj = result[j];
                          if(dj.namespace == ai.namespace){
                              dj.workloads.push(...ai.workloads);
                              break;
                          }
                      }
                  }
            }
           
            params.RequestBody.spec.input = {
              container_log_input: {
                all_namespaces: false,
                namespaces: [...result,...arr2]
              },
              type: "container-log"
            };
          }
        } else if (this.tabPosition == "two") {
          //容器文件路径
          if (!this.formTwo.value3 | this.formTwo.value3 == '請選擇workload') { //工作负载选项判断
            this.wlFlag = true
            return false
          } else {
            this.wlFlag = false
          }
          this.formTwo.optionAll.forEach(v => { //采集路径选项判断
            if (v.value4 == '請選擇容器名稱' || v.value4 == '無' || v.value7 == '' ||  v.value7==
              undefined || v.value7[0] != '/') {
              this.pathFlag = true
              return false
            } else {
              this.pathFlag = false
            }
          })
          let data = this.formTwo.optionAll;
          var obj = new Object();
          data.forEach((x, y) => {
            if (!obj[x.value4]) {
              obj[x.value4] = []
            }
            obj[x.value4].push({
              path: x.value7
            })
          })
          params.RequestBody.spec.input = {
            pod_log_input: {
              container_log_files: obj,
              metadata: true,
              workload: {
                name: this.formTwo.value3,
                type: this.formTwo.value2
              }
            },
            type: "pod-log"
          };
        } else if (this.tabPosition == "three") {
          //节点文件路径
          if (!(/^\//.test(this.formThree.value))) {
            this.colFlag = true
            return false
          } else {
            this.colFlag = false
          }

          if (this.formThree.domains.length != 0) {
            this.formThree.domains.forEach(v => {
              if (!(/^[a-z]([a-z0-9]|-){0,61}([a-z0-9])$/.test(v.value)) || v.valueKey == '') {
                this.metaFlag = true
                return false
              } else {
                this.metaFlag = false
              }
            })
          }
          var obj = new Object();
          this.formThree.domains.forEach(item => {
            obj[item.value] = item.valueKey;
          });
          params.RequestBody.spec.input = {
            host_log_input: {
              labels: obj,
              path: this.formThree.value
            },
            type: "host-log"
          };
        }
        console.log('qrbjallcanshu',params)
        if(!this.pathFlag ){
          this.axios.post(TKE_COLONY_QUERY, params).then(res => {
            if (res.Response.Error === undefined) {
               this.$message({
                  type: "success",
                  message: "編輯完成",
                  duration: 0,
                  showClose: true
                });
              this.$router.go(-1);
            }
          });
        }
      },
      clearSelect(index){
        this.formFour[index].checkObj.check1={};
        this.formFour[index].checkObj.check2={};
        this.formFour[index].checkObj.check3={};
        this.formFour[index].checkObj.check4={};
        this.formFour[index].checkObj.check5={};
        this.formFour[index].check0=[];
        this.formFour[index].check1=[];
        this.formFour[index].check2=[];
        this.formFour[index].check3=[];
        this.formFour[index].check4=[];
      },
      checkboxChange0(val,np,clickname,index) {
        let cname=clickname.toLocaleLowerCase(),arr=[];
        this.formFour[index].checkObj.check1={
              type:cname,
              acname:np,
              val:val,
        }
      },
      checkboxChange1(val,np,clickname,index) {
         let cname=clickname.toLocaleLowerCase(),arr=[];
        this.formFour[index].checkObj.check2={
            type:cname,
            acname:np,
            val:val,
          }
      },
      checkboxChange2(val,np,clickname,index) {
          let cname=clickname.toLocaleLowerCase(),arr=[];
          this.formFour[index].checkObj.check3={
            type:cname,
            acname:np,
            val:val,
          }
      },
      checkboxChange3(val,np,clickname,index) {
          let cname=clickname.toLocaleLowerCase(),arr=[];
        this.formFour[index].checkObj.check4={
            type:cname,
            acname:np,
            val:val,
          }
      },
      checkboxChange4(val,np,clickname,index) {
          let cname=clickname.toLocaleLowerCase(),arr=[];
          this.formFour[index].checkObj.check5={
            type:cname,
            acname:np,
            val:val,
          }
      },
      workLoadTab(workLoad, index) {
        let that=this;
        if (this.$route.query.clusterId) {
          var namespace = this.formFour[index].value1;
          var params = {
            ClusterName: this.$route.query.clusterId.split("(")[0],
            Method: "GET",
            Path: "/apis/apps/v1beta2/namespaces/" + namespace + "/" + workLoad.toLocaleLowerCase() + 's',
            Version: "2018-05-25"
          };
          console.log(params)
          this.workload1 = [];
          this.axios.post(TKE_COLONY_QUERY, params).then(res => {
            console.log(res)
            if (res.Response.Error === undefined) {
              var data = JSON.parse(res.Response.ResponseBody);
              if( data.items&&data.items.length!=0){
                console.log(data.items,'worklods++++++++++++++++++++++++++++++++')
                this.workload1 = data.items;
              }
            }
          });
        }
      },

      //kafka列表
      kafkaList() {
        var params = {
          //  action: "DescribeInstancesDetail",
        };
          this.axios.post(TKE_KAFKA_LIST, params).then(res => {
          if (res.codeDesc === "Success") {
              // console.log(res)
            res.data.instanceList.forEach((item, index) => {
              this.Ckafka.options.push(
                item.instanceId + "(" + item.instanceName + ")"
              );
              if (index == 0) {
                this.Ckafka.value =
                  item.instanceId + "(" + item.instanceName + ")";
              }
            });
            //保存kafka的信息
            this.instanceList = res.data.instanceList;
          }
        });
      },
      //命名空间选项
      async nameSpaceList() {
        if (this.$route.query.clusterId) {
          var params = {
            ClusterName: this.$route.query.clusterId.split("(")[0],
            Method: "GET",
            Path: "/api/v1/namespaces",
            Version: "2018-05-25"
          };
        await  this.axios.post(TKE_COLONY_QUERY, params).then(res => {
            if (res.Response) {
              var data = JSON.parse(res.Response.ResponseBody);
              this.namespaceOptions=[];
              this.namespaceOption1s=[];
              data.items.forEach(item => {
                this.namespaceOptions.push(item.metadata.name);
                this.namespaceOptions1.push(item.metadata.name);
              });
              console.log(this.namespaceOptions,'命名空间选项')
              this.formFour[0].value1 = this.namespaceOptions[0];
            }
          });
        }
      },
      //监测是否可以创建日志采集
      checkCluster() {
        var params = {
          ClusterName: this.$route.query.clusterId.split("(")[0],
          Method: "GET",
          Path: "/apis/platform.tke/v1/logcollectors/" +
            this.$route.query.clusterId.split("(")[0],
          Version: "2018-05-25"
        };
        this.axios.post(TKE_COLONY_QUERY, params).then(res => {
          if (res.Response.Error === undefined) {
            var data = JSON.parse(res.Response.ResponseBody);
            this.show1 = data.status.phase == "running" ? false : true;
          } else {}
        });
      },
      removeDomain(item) {
        var index = this.formTwo.optionAll.indexOf(item);
        if (index !== -1) {
          this.formTwo.optionAll.splice(index, 1);
        }
      },
      addDomain() {
        this.formTwo.optionAll.push({
          option4: [],
          option5: [],
          value4: "",
          value5: "",
          valueKey: ""
        });
      },
      addMetadata() {
        this.formThree.domains.push({
          value: "",
          valueKey: ""
        });
      },
      removeMetadata(item) {
        var index = this.formThree.domains.indexOf(item);
        if (index !== -1) {
          this.formThree.domains.splice(index, 1);
        }
      },
      removeNewRoom(item, index) {
        var val = this.formFour[index].value1,
          val2 = [];
        if (val != '') {
          this.namespaceOptions1.push(val)
        }
        this.namespaceOptions1 = Array.from(new Set(this.namespaceOptions1))
        if (item.length !== 1) {
          this.formFour.splice(index, 1);
        }
      },
      roomShow(index,np) {
        console.log(np,'np')
        if (this.namespaceOptions1.length == '1') {
          this.namespaceOptions1 = []
        }
        if(this.formFour[index].radio=='2'){
          var s = 0;
          console.log(this.formFour)
          for(let i in this.formFour[index].checkObj){
            if(JSON.stringify(this.formFour[index].checkObj[i])!='{}'){

              for(let j in this.formFour[index].checkObj[i]){
              
                if( this.formFour[index].checkObj[i].acname==np){
                
                  s=this.formFour[index].checkObj[i].val.length
                }
              }
            }
          }
          console.log('长度',s)
          if(s==0){
             this.$message({
                  message: '已選工作負載項為0個，請至少選擇一個工作負載項或者選擇全部容器',
                  type: "warning",
                  showClose: true,
                  duration: 0
                });
         
          }else{
            this.formFour[index].workload = s;
            this.formFour[index].flag = !this.formFour[index].flag;
          }
        }else{
            this.formFour[index].workload = '';
            this.formFour[index].flag = !this.formFour[index].flag;
        }

      },
      addNewRoom() { //
      
        //实现数组内容递减
        var arr = [],arr2, arr3 = [];
        this.formFour.forEach(v => {
          arr.push(v.value1)
        })
        arr2 = Array.from(new Set(arr));
        arr2.forEach(v => {
          let i = this.namespaceOptions1.indexOf(v)
          if (i != -1) {
            this.namespaceOptions1.splice(i, 1)
          }
        })
        this.formFour.push({
          value1: this.namespaceOptions1[0],
          radio: "1",
          flag: true,
          activeName: "Deployment",
          workload:'',
          check0:[],
          check1:[],
          check2:[],
          check3:[],
          check4:[],
          checkObj:{
            check1:{},
            check2:{},
            check3:{},
            check4:{},
            check5:{},
          },
        });
      },
      IsRule1(str) {
        let reg = /^[a-z]([a-z0-9]|-){0,61}([a-z0-9])$/;
        return reg.test(str)
      },
      IsIp(str) {
        let reg =
          /^(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/;
        return reg.test(str)
      },
   
    },
    components: {
      HeadCom
    }
  };

</script>
<style lang="scss" scoped>
  .workload {
    width: 200px;
    height: 30px;
    background-color: white;
    margin-left: 96px;
    line-height: 30px;
    padding-left: 5px;
  }

  .init {
    margin: 0;
  }

  .mt12 {
    margin-top: 12px;
  }

  .p3 {
    padding: 3px 0 3px 0;
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
    width: 80px;
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
    line-height: 1.5;
  }

  .el-textarea {
    max-width: 900px;
    width: 420px;
    padding-top: 5px;
    padding-bottom: 5px;
    // height: 100px;
  }

  .el-input {
    width: 200px;
  }

  .back-hd {
    width: 100%;
    height: 51px;
    background: white;
    padding: 15px;
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
    color: red;
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
    padding: 5px 0 5px 0;
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
    margin: 0 auto;
  }

  .tf-g {
    font-size: 0;
    margin-bottom: 50px;
    // background: pink;
    padding: 20px;
  }

  .event-persistence {
    padding: 20px;
    background: white;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  }

  .form-input {
    display: flex;
    justify-content: space-between;
    align-items: center;

    span {
      margin: 0 10px;
    }

    i {
      margin: 0 10px;
      cursor: pointer;
    }
  }

  .position-form {
    position: relative;
  }

  .icon-edit-outline {
    position: absolute;
    top: 10px;
    right: 50px;
  }

  .icon-check {
    position: absolute;
    top: 10px;
    right: 50px;
  }

  .icon-close {
    position: absolute;
    top: 10px;
    right: 30px;
  }

  .border-room {
    border: 1px solid #e5e5e5;

    .border-text {
      height: 36px;
      border-bottom: 1px solid #e5e5e5;

      .border-left {
        float: left;
        height: 36px;
        width: 124px;
        border-right: 1px solid #e5e5e5;
        // border-right: 2px solid #e5e5e5;
        padding-left: 10px;
      }

      .border-right {
        float: left;
        height: 36px;
        padding-left: 10px;
      }
    }
  }

  .active2 {
    color: red
  }

  .new-room {
    text-align: center;
    width: 840px;
    border: 1px dashed #e5e5e5;
    cursor: pointer;

    &:hover {
      background-color: #f2f2f2;
    }
  }

  .footer {
    display: flex;
    align-items: center;
    justify-content: space-between;

    p:nth-of-type(2) {
      border: solid 1px #f6b5b5;
      padding: 20px 30px;
      background: #fcecec;
      flex: 1;
      color: #b43537;
    }

    p:nth-of-type(1),
    p:nth-of-type(3) {
      flex: 1;
    }
  }

  .setwidth {
    width: 200px;
  }

  .setwidth2 {
    width: 280px;
  }

  i {
    cursor: pointer;
  }

  .activeColor {
    color: #f56c6c !important;
  }

  .tab-set {
    overflow: auto !important;

    ::v-deep .el-tabs__header {
      width: 123px;
    }

    ::v-deep .el-tabs__content {
      overflow: auto !important;
      height: 200px;
    }
  }

</style>

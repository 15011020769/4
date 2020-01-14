 <!-- 创建集群 -->
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
          <h2 class="header-title">创建集群</h2>
        </div>
        <!-- 右侧 -->
        <div class="grid-right"></div>
      </div>
    </div>  
    <div class="colony-main">

      <div class="tke-step tke-grid">
        <div class="tke-step-item is-curr">
          <span class="num">1</span>
          <span class="title">集群信息</span>
          <i class="el-icon-arrow-right"></i>
        </div>
        <div class="tke-step-item">
          <span class="num">2</span>
          <span class="title">选择机型</span>
          <i class="el-icon-arrow-right"></i>
        </div>
        <div class="tke-step-item">
          <span class="num">3</span>
          <span class="title">云服务器配置</span>
          <i class="el-icon-arrow-right"></i>
        </div>
        <div class="tke-step-item">
          <span class="num">4</span>
          <span class="title">信息确认</span>
        </div>

      </div>
      <hr>
      <div class="tke-reminder">当您使用容器服务时，需要先创建集群，容器服务运行在集群中。一个集群由若干节点（云服务器）构成，可运行多个容器服务。集群的更多说明参考<a href="#">集群概述</a></div>

      <div class="tke-card tke-formpanel-wrap">
        <el-form  class="tke-form" :model="colony" label-position='left' label-width="120px" size="mini">
          <el-form-item label="集群名称">
            <el-input class="w200" v-model="colony.name" placeholder="请输入集群名称，不超过60个字符"></el-input>
          </el-form-item>
          <el-form-item label="新增资源所属项目">
            <el-select class="w200" v-model="colony.projectValue" filterable placeholder="请选择">
              <el-option
                v-for="item in colony.projectOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <p>集群内新增的云服务器、负载均衡器等资源将会自动分配到该项目下。<a href="#">使用指引</a></p>
          </el-form-item>
          <el-form-item label="Kubernetes版本">
            <el-select class="w200" v-model="colony.kuValue" placeholder="请选择">
              <el-option
                v-for="item in colony.kuOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="运行时组件">
             <el-radio-group  v-model="colony.assemblyRadio" size="small">
              <el-radio-button label="docker">docker</el-radio-button>
              <el-radio-button label="containerd">containerd (beta)</el-radio-button>
            </el-radio-group>
            <a href="#" class="ml5">如何选择</a>
            <p v-if="colony.assemblyRadio=='docker'">dockerd是社区版运行时组件，支持docker api</p>
            <p v-else>containerd是更为稳定的运行时组件，支持OCI标准，不支持docker api，不支持GPU</p>
          </el-form-item>
          <el-form-item label="所在地域">
             <el-radio-group  v-model="colony.cityRadio" size="small">
              <el-radio-button label="gz">广州</el-radio-button>
              <el-radio-button label="sh">上海</el-radio-button>
              <el-radio-button label="tb">台湾台北</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="集群网络">
            <el-select class="w200" v-model="colony.networkValue" placeholder="请选择">
              <el-option
                v-for="item in colony.networkOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <i class="el-icon-refresh ml5"></i>
            <span class="ml5 text-gray">CIDR: 10.0.0.0/16</span>
            <p>如现有的网络不合适，您可以去控制台<a href="#">新建私有网络</a></p>
          </el-form-item>
          <el-form-item >
            <span slot="label">容器网络 <i class="el-icon-info"></i></span>
            <div class='form-controls' style="width:600px">
              <el-form  class="tke-form"  label-position='left' label-width="140px" size="mini">
                <el-form-item label="CIDR">
                  <el-select class="w70" v-model="colony.CIDRValue_1" >
                    <el-option
                      v-for="item in colony.CIDROptions_1"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select> .
                  <el-tooltip  effect="dark" content="范围：16, 18, ... , 31" placement="bottom">
                    <el-input class="w50" v-model="colony.CIDRValue_2"></el-input>
                  </el-tooltip>  .
                  <el-input class="w50" disabled v-model="colony.CIDRValue_3"></el-input> .
                  <el-input class="w50" disabled v-model="colony.CIDRValue_4"></el-input> /
                  <el-select class="w70" v-model="colony.CIDRValue_5" >
                    <el-option
                      v-for="item in colony.CIDROptions_5"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <a href="#" class="ml5">使用指引</a>
                </el-form-item>
                <el-form-item label="Pod数量上限/节点">
                  <el-select class="w200" v-model="colony.PodValue" placeholder="请选择">
                    <el-option
                      v-for="item in colony.PodOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="Service数量上限/集群">
                  <el-select class="w200" v-model="colony.ServiceValue" placeholder="请选择">
                    <el-option
                      v-for="item in colony.ServiceOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-form>
              <p>当前容器网络配置下，集群最多 <strong class="text-red">1008</strong> 个节点</p>
            </div>
            
         
          </el-form-item>
          <el-form-item label="操作系统">
            <el-select class="w320" v-model="colony.OSvalue" filterable placeholder="请选择">
              <el-option-group
                v-for="group in colony.OSoptions"
                :key="group.label"
                :label="group.label">
                <el-option
                  v-for="item in group.options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-option-group>
            </el-select>
            <a href="#" class="ml5">如何选择</a>
          </el-form-item>
          <el-form-item label="集群描述">
             <el-input
                class="w420"
                type="textarea"
                :rows="6"
                placeholder="请输入集群描述"
                v-model="colony.desc">
              </el-input>
          </el-form-item>
          <el-form-item label="ipvs支持">
             <el-switch v-model="colony.ipvs" >
              </el-switch>
              <p>开启Kube-proxy Ipvs支持，注意开启后将不支持关闭，适用于大规模场景下提供更优的转发性能。</p>
          </el-form-item>
        </el-form>

        <!-- 底部 -->
        <div class="tke-formpanel-footer">
          <el-button size="small">取消</el-button>
          <el-button size="small" type="primary">下一步</el-button>
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
  name: "create",
  data() {
    return {
      colony: {
        name: '',
        projectOptions: [
          {
            value: 'a',
            label: '默认项目'
          }, 
          {
            value: 'b',
            label: '测试项目'
          }
        ],
        projectValue: '',
        kuOptions: [
          {
            value: 'a',
            label: '1.1.1'
          }, 
          {
            value: 'b',
            label: '1.2.1'
          }
        ],
        kuValue: 'a',
        assemblyRadio:'docker',
        cityRadio:'gz',
        networkOptions: [
          {
            value: 'a',
            label: 'TestVPC'
          }, 
          {
            value: 'b',
            label: 'Default-VPC'
          }
        ],
        networkValue: 'a',
        CIDROptions_1: [
          {
            value: '192',
            label: '192'
          }, 
          {
            value: '172',
            label: '172'
          },
          {
            value: '10',
            label: '10'
          }
        ],
        CIDRValue_1: '192',
        CIDRValue_2: '16',
        CIDRValue_3: '0',
        CIDRValue_4: '0',
        CIDROptions_5: [
          {
            value: '16',
            label: '16'
          }, 
          {
            value: '17',
            label: '17'
          },
          {
            value: '18',
            label: '18'
          },
          {
            value: '19',
            label: '19'
          }
        ],
        CIDRValue_5: '16',
        PodOptions: [
          {
            value: '32',
            label: '32'
          }, 
          {
            value: '64',
            label: '64'
          },
          {
            value: '128',
            label: '128'
          },
          {
            value: '256',
            label: '256'
          }
        ],
        PodValue: '32',
        ServiceOptions: [
          {
            value: '128',
            label: '128'
          }, 
          {
            value: '256',
            label: '256'
          },
          {
            value: '512',
            label: '512'
          },
          {
            value: '1024',
            label: '1024'
          }
        ],
        ServiceValue: '1024',
        desc:'',
        OSoptions: [
          {
            label: 'Ubuntu',
            options: [
              {
                value: 'Ubuntu-1',
                label: 'Ubuntu Server 18.04.1 LTS 64bit TKE-Optimized'
              }, 
              {
                value: 'Ubuntu-2',
                label: 'Ubuntu Server 18.04.1 LTS 64bit'
              }, 
              {
                value: 'Ubuntu-3',
                label: 'Ubuntu Server 16.04.1 LTS 64bit'
              }
            ]
          }, 
          {
            label: 'CentOS',
            options: [
              {
                value: 'CentOS-1',
                label: 'CentOS 7.6 64bit TKE-Optimized'
              }, 
              {
                value: 'CentOS-2',
                label: 'CentOS 7.6 64bit'
              }, 
              {
                value: 'CentOS-3',
                label: 'CentOS 7.2 64bit'
              }
            ]
          }
        ],
        OSvalue:'Ubuntu-1',
        ipvs:false
      }  
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
  }
};
</script>

<style lang="scss" scoped>




</style>


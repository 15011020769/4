 <!-- 新建HPA -->
<template>
  <div class="colony-wrap">
    <div class="tke-content-header">
      <div class="tke-grid ">
        <!-- 左侧 -->
        <div class="grid-left">
          <span class="goback" @click="goBack">
            <i class="el-icon-back"></i>
          </span>
          <h2 class="header-title">新建HPA</h2>
        </div>
        <!-- 右侧 -->
        <div class="grid-right"></div>
      </div>
    </div>  
    <div class="colony-main">

      <div class="tke-card tke-formpanel-wrap mb60">
        <el-form  class="tke-form" :model="hpa" label-position='left' label-width="120px" size="mini">
          <el-form-item label="名称">
            <el-input class="w180" v-model="hpa.name" placeholder="请输入名称"></el-input>
            <p>最长63个字符，只能包含小写字母、数字及分隔符("-")，且必须以小写字母开头，数字或小写字母结尾</p>
          </el-form-item>
          
           <el-form-item label="命名空间">
             <el-select v-model="hpa.value1" placeholder="请选择" size="mini">
                <el-option
                  v-for="item in hpa.option1"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
          </el-form-item>

          <el-form-item label="工作负载类型">
             <el-select v-model="hpa.value2" placeholder="请选择" size="mini">
                <el-option
                  v-for="item in hpa.option2"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
          </el-form-item>

          <el-form-item label="关联工作负载">
             <el-select v-model="hpa.value3" placeholder="请选择" size="mini">
                <el-option
                  v-for="item in hpa.option3"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
          </el-form-item>

           <el-form-item label="解决策略">
              <div class='app-tke-fe-form w520'>
                <div class="form-input"
                 v-for="(domain, index) in hpa.domains"
                :key="domain.key"
                :prop="'domains.' + index + '.value'">
                     <el-select v-model="domain.value4" placeholder="请选择" size="mini" class="w100">
                      <el-option
                        v-for="item in domain.options"
                        :key="item.label"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>

                     <el-select v-model="domain.value5" placeholder="请选择" size="mini" class="w200">
                      <el-option
                        v-for="item in domain.option1"
                        :key="item.label"
                        :label="item.label"
                        :value="item.value"
                        v-if='domain.value4 == 1'>
                      </el-option>
                      <el-option
                        v-for="item in domain.option2"
                        :key="item.label"
                        :label="item.label"
                        :value="item.value"
                        v-if='domain.value4 == 2'>
                      </el-option>
                      <el-option
                        v-for="item in domain.option3"
                        :key="item.label"
                        :label="item.label"
                        :value="item.value"
                        v-if='domain.value4 == 3'>
                      </el-option>
                      <el-option
                        v-for="item in domain.option4"
                        :key="item.label"
                        :label="item.label"
                        :value="item.value"
                        v-if='domain.value4 == 4'>
                      </el-option>
                    </el-select>

                    <el-input v-model="domain.valueKey" size="mini" placeholder="变量值" class='w100'></el-input><span v-if='domain.value4 == 1'>核</span><span v-if='domain.value4 == 2'>MiB</span><span v-if='domain.value4 == 3'>KB/s</span><span v-if='domain.value4 == 4'>Mbps</span>

                    <el-tooltip class="item" effect="light" content="至少保留一个指标" placement="right">
                        <i class="el-icon-close" @click.prevent="removeDomain(hpa.domains,index)"></i>
                    </el-tooltip>

                </div>
                <el-link type="primary" style="cursor: pointer;font-size:12px;"  @click="addDomain">新增指标</el-link>
              </div>
          </el-form-item>
          <el-form-item label="实例范围">
                <el-input class='w100' v-model='hpa.vLeft'></el-input>
                <span class='w-span'>~</span>  
                <el-input class='w100' v-model='hpa.vRight'></el-input>
                <p>在设定的实例范围内自动调节，不会超出该设定范围</p>
          </el-form-item>
        </el-form>

       
        <!-- 底部 -->
        <div class="tke-formpanel-footer">
          <el-button size="small" type="primary">创建HPA</el-button>
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
  name: "hpaCreate",
  data() {
    return {
      hpa: {
        name: '',
        option1:[
          {
            value: 'kube-system',
            label: 'kube-system'
          }
        ],
        option2:[
          {
            value: 'defualt',
            label: 'defualt'
          }
        ],
        option3:[
          {
            value: 'kube',
            label: 'kube'
          }
        ],
        domains:[
          {
            options:[{
               value: 1,
               label: 'CPU'
            },{
               value: 2,
               label: '内存'
            },{
               value: 3,
               label: '硬盘'
            },{
               value: 4,
               label: '网络'
            }],

            option1:[{
               value: 1,
               label: 'CPU使用量'
            },{
               value: 2,
               label: 'CPU利用率(占节点)'
            },{
               value: 3,
               label: 'CPU利用率(占Request)'
            },{
               value: 4,
               label: 'CPU利用率(占Limit)'
            }],

            option2:[{
               value: 1,
               label: '内存使用量'
            },{
               value: 1,
               label: '内存使用量(不含Cache)'
            },{
               value: 2,
               label: '内存使用量(占节点)'
            },{
               value: 2,
               label: '内存使用量(占节点、不含Cache)'
            },{
               value: 3,
               label: '内存使用量(占Request)'
            },{
               value: 3,
               label: '内存使用量(占Request、不含Cache)'
            },{
               value: 4,
               label: '内存使用量(占Limit)'
            },{
               value: 4,
               label: '内存使用量(占Limit、不含Cache)'
            }],

            option3:[{
               value: 1,
               label: '硬盘写流量'
            },{
               value: 2,
               label: '硬盘读流量'
            },{
               value: 3,
               label: '硬盘读IOPS'
            },{
               value: 4,
               label: '硬盘写IOPS'
            }],

            option4:[{
               value: 1,
               label: '网络出带宽'
            },{
               value: 2,
               label: '网络入带宽'
            },{
               value: 3,
               label: '网络出流量'
            },{
               value: 4,
               label: '网络入流量'
            },{
               value: 3,
               label: '网络出包量'
            },{
               value: 4,
               label: '网络入包量'
            }],
            value4:1,
            value5:1,
            valueKey:''
          }
        ],
        value1:'',
        value2:'',
        value3:'',
        vLeft:'',
        vRight:''
      }  
    };
  },
  components: {
   
  },
  created() {
     // 从路由获取类型
   
  },
  methods: {
    //返回上一层
    goBack(){
        this.$router.go(-1);
    },
    removeDomain (domain,index) {
      // console.log(domain,index)
      //  var index = this.form.domains.indexOf(item)
        if (domain.length !== 1) {
            this.hpa.domains.splice(index, 1)
        }
    },
    addDomain () {
        this.hpa.domains.push({
            options:[{
               value: 1,
               label: 'CPU'
            },{
               value: 2,
               label: '内存'
            },{
               value: 3,
               label: '硬盘'
            },{
               value: 4,
               label: '网络'
            }],

            option1:[{
               value: 1,
               label: 'CPU使用量'
            },{
               value: 2,
               label: 'CPU利用率(占节点)'
            },{
               value: 3,
               label: 'CPU利用率(占Request)'
            },{
               value: 4,
               label: 'CPU利用率(占Limit)'
            }],

            option2:[{
               value: 1,
               label: '内存使用量'
            },{
               value: 1,
               label: '内存使用量(不含Cache)'
            },{
               value: 2,
               label: '内存使用量(占节点)'
            },{
               value: 2,
               label: '内存使用量(占节点、不含Cache)'
            },{
               value: 3,
               label: '内存使用量(占Request)'
            },{
               value: 3,
               label: '内存使用量(占Request、不含Cache)'
            },{
               value: 4,
               label: '内存使用量(占Limit)'
            },{
               value: 4,
               label: '内存使用量(占Limit、不含Cache)'
            }],

            option3:[{
               value: 1,
               label: '硬盘写流量'
            },{
               value: 2,
               label: '硬盘读流量'
            },{
               value: 3,
               label: '硬盘读IOPS'
            },{
               value: 4,
               label: '硬盘写IOPS'
            }],

            option4:[{
               value: 1,
               label: '网络出带宽'
            },{
               value: 2,
               label: '网络入带宽'
            },{
               value: 3,
               label: '网络出流量'
            },{
               value: 4,
               label: '网络入流量'
            },{
               value: 3,
               label: '网络出包量'
            },{
               value: 4,
               label: '网络入包量'
            }],
            value4:1,
            value5:1,
            valueKey:''
          }
        )
    }
  }
};
</script>

<style lang="scss" scoped>
.app-tke-fe-form{
    background-color: #f2f2f2;
    padding: 10px;
}
.form-input{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top:10px;
    span{
        margin:0 10px;
    }
    i{
        margin:0 10px;
        cursor: pointer;
    }
}
.w-span{
  margin:0 10px;
}

</style>


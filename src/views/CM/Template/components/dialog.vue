<template>
  <div class="dialog">
    <el-dialog title="新建" :visible.sync="show" @open="$emit('open')">
      <el-form :model="formInline" :rules="rules" ref="form">
        <p class="rowCont">
          <span>策略名称</span>
          <el-form-item style="display:inline-block" prop="strategy_name">
            <!-- v-model="formInline.strategy_name" -->
            <el-input
              style="width:330px;margin:0"
              v-model="strategy_name"
              placeholder="1-20个中英文字符或下划线"
            ></el-input>
          </el-form-item>
        </p>
        <p class="rowCont">
          <span style="vertical-align:top">备注</span>
          <el-form-item style="display:inline-block" prop="textareas">
            <!-- v-model="formInline.textareas" -->
            <el-input
              style="width:330px;"
              :autosize="{ minRows: 5, maxRows: 2}"
              type="textarea"
              placeholder="1-100个中英文字符或下划线"
              v-model="remark"
              maxlength="100"
              show-word-limit
            ></el-input>
          </el-form-item>
        </p>
      </el-form>
      <p class="rowCont" style="display: flex">
        <span>策略类型</span>
        <grouping-type @handleChangeChild="showMsgfromChild"></grouping-type>
        <!-- <el-select v-model="formInline.strategy" style="width:200px;">
          <el-option
            v-for="(item,index) in formInline.strategy_kind"
            :key="index"
            :label="item.name"
            :value="item.value"
            label-width="40px"
          ></el-option>
        </el-select> -->
        <el-checkbox v-model="checkedUse" style="margin-left:20px;">
          使用预置触发条件
          <el-popover trigger="hover" placement="top" content="根据系统预先设定的模版，自动设置对应云产品的告警策略常用触发条件。">
            <i class="el-icon-info" slot="reference"></i>
          </el-popover>
        </el-checkbox>
      </p>
      <div class="rowCont cont">
        <span>触发条件</span>
        <div>
          <div>
            <p>
              <el-checkbox v-model="checkedZhibiao" :checked="checkedZhibiao" @change="isDisabledZB()">指标告警</el-checkbox>
            </p>
            <div class="color">
              <p>
                <span style="display:inline">满足</span>
                <el-select :disabled="isDisabled" v-model="formInline.projectName" style="width:90px;margin:0 5px;">
                  <el-option
                    v-for="(item,index) in conditionList"
                    :key="index"
                    :label="item"
                    :value="item"
                    label-width="40px"
                  ></el-option>
                </el-select>
                <span style="display:inline">条件时，触发告警</span>
              </p>
              <!-- 在这里进行便利，添加 -->
              <ul>
                  <!-- <li style="display:flex;align-items: center;cursor: pointer;"> -->
                <li style="display:flex;align-items: center;cursor: pointer;" v-for="(it,i) in indexAry" :key="i">
                  <p>
                    if&nbsp;
                    <!-- <el-select v-model="formInline.projectName" style="width:150px;"> -->
                    <el-select :disabled="isDisabled" v-model="it.projectName" style="width:150px;">
                      <el-option
                        v-for="(item,index) in zhibiaoType"
                        :key="index"
                        :label="item"
                        :value="item"
                        label-width="40px"
                      ></el-option>
                    </el-select>&nbsp;
                    <!-- <el-select v-model="formInline.projectName" style="width:130px;"> -->
                    <el-select :disabled="isDisabled" v-model="it.projectName" style="width:130px;">
                      <el-option
                        v-for="(item,index) in tongjiZQ"
                        :key="index"
                        :label="item"
                        :value="item"
                        label-width="40px"
                      ></el-option>
                    </el-select>&nbsp;
                    <!-- <el-select v-model="formInline.projectName" style="width:60px;"> -->
                    <el-select :disabled="isDisabled" v-model="it.projectName" style="width:60px;">
                      <el-option
                        v-for="(item,index) in SymbolList"
                        :key="index"
                        :label="item"
                        :value="item"
                        label-width="40px"
                      ></el-option>
                    </el-select>&nbsp;
                    <input :disabled="isDisabled" placeholder="指标" value="0" min="0" max="100" type="number"
                      style="height: 30px;line-height: 30px;padding:0 10px;width:85px;border: 1px solid #dcdfe6;"/>
                    <b
                      style="padding:0 10px;display:inline-block;height: 30px;line-height: 30px;width:52px;border: 1px solid #dcdfe6;"
                    >%</b>
                    &nbsp;
                    <!-- <el-select v-model="formInline.projectName" style="width:110px;"> -->
                    <el-select :disabled="isDisabled" v-model="it.projectName" style="width:110px;">
                      <el-option
                        v-for="(item,index) in chixuZQ"
                        :key="index"
                        :label="item"
                        :value="item"
                        label-width="40px"
                      ></el-option>
                    </el-select>&nbsp;
                    then&nbsp;
                    <!-- <el-select v-model="formInline.projectName" style="width:150px;"> -->
                    <el-select :disabled="isDisabled" v-model="it.projectName" style="width:150px;">
                      <el-option
                        v-for="(item,index) in jinggaoZQ"
                        :key="index"
                        :label="item"
                        :value="item"
                        label-width="40px"
                      ></el-option>
                    </el-select>
                    <i class="el-icon-info" style="color:#888; margin:0 5px;"></i>
                  </p>
                  <i class="el-icon-error" style="color:#888; margin:0 5px;"
                  @click="delZhibiao(it)" v-if="indexAry.length>1"></i>
                </li>
                <a @click="addZhibiao" style="cursor:pointer">添加</a>
              </ul>
            </div>
          </div>
          <div>
            <p>
              <el-checkbox v-model="checkedGaojing" :checked="checkedGaojing" @change="isDisabledGJ()">
                事件告警
                <i class="el-icon-info" style="color:#888; margin:0 5px;"></i>
              </el-checkbox>
            </p>
            <!-- 在这里进行便利，添加 -->
            <ul class="color">
              <!-- <li style="display:flex;align-items: center;cursor: pointer;"> -->
              <li style="display:flex;align-items: center;cursor: pointer;" v-for="(item,i) in eventAry" :key="i">
                <p>
                  <!-- <el-select v-model="formInline.projectName" style="width:180px;margin:0 5px;"> -->
                  <el-select :disabled="isDisGJ" v-model="item.projectName" style="width:180px;margin:0 5px;">
                    <el-option
                      v-for="(item,index) in eventType"
                      :key="index"
                      :label="item"
                      :value="item"
                      label-width="40px"
                    ></el-option>
                  </el-select>
                </p>
                <i class="el-icon-error" style="color:#888; margin:0 5px;"
                  @click="delShijian(item)" v-if="eventAry.length>1"></i>
              </li>
              <a @click="addShijian" style="cursor:pointer">添加</a>
            </ul>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save('form')">保 存</el-button>
        <el-button @click="show=false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import GroupingType from '@/components/GroupingType'
import { GET_TENCENTCLOUDAPI, UPDATE_TEMPLATE } from '@/constants/CM-yhs.js'
export default {
  data () {
    return {
      isChected: true, // 多选框是否选中
      isDisabled: false, // 指标告警是否禁用
      isDisGJ: false, // 事件告警是否禁用
      backShow: 'true',
      strategy_name: '', // 策略名称
      remark: '', // 备注信息
      value1: new Date(2020, 1, 10, 18, 40),
      value2: new Date(2020, 1, 10, 18, 40),

      showChufa1: false, // 触发条件1显示开关
      showChufa2: true, // 触发条件2显示开关

      showQudao1: false, // 渠道选择1显示开关
      showQudao2: false, // 渠道选择2显示开关

      errorTip1: false, // 触发条件模板错误提示
      errorTip2: true, // 配置触发条件错误提示
      checkedZhibiao: true, // 指示告警
      checkedUse: false, // 使用预置触发条件
      SymbolList: ['>', '>=', '<', '<=', '=', '!='], // 符号数组
      formInline: {
        jieshou: '接收组',
        jieshouArr: [
          { value: '0', name: '接收组' },
          {
            value: '1',
            name: '接收人'
          }
        ],
        apiStr: 'http', // 接口回调
        apiArr: [
          {
            value: 0,
            name: 'http'
          },
          {
            value: 1,
            name: 'https'
          }
        ], // 接口回调数据
        strategy_name: '', // 策略名称
        textareas: '', // 备注
        strategy: '云服务器-基础监控',
        strategy_kind: [
          {
            value: 0,
            name: '云服务器-基础监控'
          }
        ], // 策略类型
        alarm: '', // 策略类型
        projectName: '默认项目',
        project: [
          {
            value: 0,
            name: '默认项目'
          }
        ]
      },
      indexAry: [ // 指标告警数组
        {
          jieshou: '接收组',
          jieshouArr: [
            { value: '0', name: '接收组' },
            {
              value: '1',
              name: '接收人'
            }
          ],
          apiStr: 'http', // 接口回调
          apiArr: [
            {
              value: 0,
              name: 'http'
            },
            {
              value: 1,
              name: 'https'
            }
          ], // 接口回调数据
          strategy_name: '', // 策略名称
          textareas: '', // 备注
          strategy: '云服务器-基础监控',
          strategy_kind: [
            {
              value: 0,
              name: '云服务器-基础监控'
            }
          ], // 策略类型
          alarm: '', // 策略类型
          projectName: '默认项目',
          project: [
            {
              value: 0,
              name: '默认项目'
            }
          ]
        }
      ],
      eventAry: [// 事件告警数组
        {
          jieshou: '接收组',
          jieshouArr: [
            { value: '0', name: '接收组' },
            {
              value: '1',
              name: '接收人'
            }
          ],
          apiStr: 'http', // 接口回调
          apiArr: [
            {
              value: 0,
              name: 'http'
            },
            {
              value: 1,
              name: 'https'
            }
          ], // 接口回调数据
          strategy_name: '', // 策略名称
          textareas: '', // 备注
          strategy: '云服务器-基础监控',
          strategy_kind: [
            {
              value: 0,
              name: '云服务器-基础监控'
            }
          ], // 策略类型
          alarm: '', // 策略类型
          projectName: '默认项目',
          project: [
            {
              value: 0,
              name: '默认项目'
            }
          ]
        }
      ],
      conditionList: ['任意', '所有'],
      tongjiZQ: ['统计周期1分钟', '统计周期5分钟'],
      chixuZQ: ['持续1个周期', '持续2个周期', '持续3个周期', '持续4个周期', '持续5个周期'],
      jinggaoZQ: [// 警告周期
        '不重复',
        '每5分钟警告一次',
        '每10分钟警告一次',
        '每15分钟警告一次',
        '每30分钟警告一次',
        '每1小时警告一次',
        '每2小时警告一次',
        '每3小时警告一次',
        '每6小时警告一次',
        '每12小时警告一次',
        '每1天警告一次',
        '周期指数递增'
      ],
      zhibiaoType: [// 指标告警类型
        'CPU利用率',
        '内存利用率',
        '内存使用量',
        '磁盘利用率',
        '磁盘读流量',
        '磁盘写流量',
        '磁盘IO等待',
        '内网入包量',
        '内网出包量',
        '外网入带宽',
        '外网出带宽',
        '外网入包量',
        '外网出包量',
        '外网带宽使用率',
        'TCP连接数',
        'CPU一分钟平均负载',
        'CPU五分钟平均负载',
        'CPU十五分钟平均负载',
        '基础CPU利用率',
        '内网入带宽',
        '内网出带宽'
      ],
      eventType:[//事件告警类型
        '磁盘只读',
        '内核故障',
        '内存oom',
        'ping不可达',
        '机器重启',
        '外网出带宽超限导致丢包',
        'agent上报超时',
        '子机nvme设备error'
      ],
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
      checkedGaojing: '', // 告警
      // dialogFormVisible: false //监控面板的开关
      rules: {
        strategy_name: [
          {
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('名称不能为空'))
              } else if (!(/^[\u4e00-\u9fa5_a-zA-Z_]{1,20}$/.test(value))) {
                callback(new Error('名称格式不正确'))
              } else {
                callback()
              }
            },
            trigger: 'blur',
            required: true
          }
        ],
        textareas: [
          {
            validator: (rule, value, callback) => {
              if (value.length === 100) {
                callback(new Error('描述不能超过100个字'))
              } else {
                callback()
              }
            },
            trigger: 'change',
            required: true
          }
        ]
      }, // 名称和备注的验证
      show: this.dialogVisible
    }
  },
  watch: {
    dialogVisible: function (val) {
      this.show = val
    },
    show: function (val) {
      this.$emit('update:dialogVisible', val)
    }
  },
  components: {
    GroupingType
  },
  props: {
    dialogVisible: {
      default: false,
      type: Boolean
    }
  },
  methods: {
    save (form) {
      // this.$emit('save')
      this.$refs[form].validate((valid) => {
        if (valid) {
          // this.submitFound()
          console.log('完成', form)
        } else {
          return false
        }
      })
    },
    // 新建完成保存
    // newBuild () {
    //   // let zbAry = []
    //   // let sjAry = []
    //   let params = {
    //     conditions: this.indexAry, // 指标告警
    //     eventConditions: this.eventAry, // 事件告警
    //     groupName: this.strategy_name,
    //     isUnionRule: 0,
    //     lang: 'zh',
    //     remark: this.remark,
    //     viewName: 'cvm_device'
    //   }
    //   this.axios.post(UPDATE_TEMPLATE, params).then(res => {
    //     console.log(res)
    //   })
    // },
    // 类型
    msgBtn (index) {
      this.liIndex = index
    },
    addZhibiao () { // 添加触发条件的指标告警
      this.indexAry.push(
        {
          jieshou: '接收组',
          jieshouArr: [
            { value: '0', name: '接收组' },
            {
              value: '1',
              name: '接收人'
            }
          ],
          apiStr: 'http', // 接口回调
          apiArr: [
            {
              value: 0,
              name: 'http'
            },
            {
              value: 1,
              name: 'https'
            }
          ], // 接口回调数据
          strategy_name: '', // 策略名称
          textareas: '', // 备注
          strategy: '云服务器-基础监控',
          strategy_kind: [
            {
              value: 0,
              name: '云服务器-基础监控'
            }
          ], // 策略类型
          alarm: '', // 策略类型
          projectName: '默认项目',
          project: [
            {
              value: 0,
              name: '默认项目'
            }
          ]
        }
      )
    },
    delZhibiao (it) { // 删除触发条件的指标告警
      var index = this.indexAry.indexOf(it)
      if (index !== -1) {
        this.indexAry.splice(index, 1)
      }
    },
    addShijian () { // 添加触发条件的事件告警
      this.eventAry.push(
        {
          jieshou: '接收组',
          jieshouArr: [
            { value: '0', name: '接收组' },
            {
              value: '1',
              name: '接收人'
            }
          ],
          apiStr: 'http', // 接口回调
          apiArr: [
            {
              value: 0,
              name: 'http'
            },
            {
              value: 1,
              name: 'https'
            }
          ], // 接口回调数据
          strategy_name: '', // 策略名称
          textareas: '', // 备注
          strategy: '云服务器-基础监控',
          strategy_kind: [
            {
              value: 0,
              name: '云服务器-基础监控'
            }
          ], // 策略类型
          alarm: '', // 策略类型
          projectName: '默认项目',
          project: [
            {
              value: 0,
              name: '默认项目'
            }
          ]
        }
      )
    },
    delShijian (item) { // 删除触发条件的事件告警
      var index = this.eventAry.indexOf(item)
      if (index !== -1) {
        this.eventAry.splice(index, 1)
      }
    },
    // 指标告警是否禁用
    isDisabledZB () {
      if (this.checkedZhibiao) {
        this.isDisabled = false
      } else {
        this.isDisabled = true
      }
    },
    // 事件告警是否禁用
    isDisabledGJ () {
      if (this.checkedGaojing) {
        this.isDisGJ = false
      } else {
        this.isDisGJ = true
      }
    },
    // 新建策略类型
    showMsgfromChild (val) {
      console.log('val', val)
    }
  }
}
</script>
<style lang="scss" scoped>
.dialog >>> .el-button,
.dialog >>> .el-input__inner {
  height: 30px;
  border-radius: 0;
  padding-top: 0;
  line-height: 30px;
  font-size: 12px;
}

.dialog >>> .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #606266;
}
.dialog >>> .el-dialog__body {
  padding: 0 20px;
}
.dialog .color {
  border: 1px solid #ddd;
  font-size: 12px;
  padding: 10px;

  background-color: #f2f2f2;
  p {
    margin: 5px 0;
  }
}
.dialog {
  width: 100%;
  height: 100%;
  color: #888;
  background: white;
  box-shadow: 1px 1px 5px #cccccc;
  span {
    line-height: 30px;
  }
  .cont {
    display: flex;
  }
  p.rowCont {
    line-height: 30px;
    // padding: 10px 0;
    span {
      display: inline-block;
      width: 70px;
    }
  }
  input {
    margin: 0;
  }
  > div {
    span {
      display: inline-block;
      width: 70px;
    }
  }

  .table {
    margin-top: 20px;
  }
  .foot {
    padding-top: 20px;
    border-top: 1px solid #ccc;
  }
}
</style>

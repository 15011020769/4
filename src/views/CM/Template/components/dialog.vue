<template>
  <div class="dialog">
    <el-dialog title="新建" :visible.sync="dialogVisible">
      <el-form :model="formInline" :rules="rules" ref="form">
        <p class="rowCont">
          <span>策略名称</span>
          <el-form-item style="display:inline-block" prop="strategy_name">
            <el-input
              style="width:330px;margin:0"
              v-model="formInline.strategy_name"
              placeholder="1-20个中英文字符或下划线"
            ></el-input>
          </el-form-item>
        </p>
        <p class="rowCont">
          <span style="vertical-align:top">备注</span>
          <el-form-item style="display:inline-block" prop="textareas">
            <el-input
              style="width:330px;"
              :autosize="{ minRows: 5, maxRows: 2}"
              type="textarea"
              placeholder="1-100个中英文字符或下划线"
              v-model="formInline.textareas"
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
              <el-checkbox v-model="checkedZhibiao">指标告警</el-checkbox>
            </p>
            <div class="color">
              <p>
                <i>满足</i>
                <el-select v-model="formInline.projectName" style="width:90px;margin:0 5px;">
                  <el-option
                    v-for="(item,index) in formInline.project"
                    :key="index"
                    :label="item.name"
                    :value="item.value"
                    label-width="40px"
                  ></el-option>
                </el-select>
                <i>条件时，触发告警</i>
              </p>
              <!-- 在这里进行便利，添加 -->
              <ul>
                <li style="display:flex;align-items: center;cursor: pointer;">
                  <p>
                    if&nbsp;
                    <el-select v-model="formInline.projectName" style="width:150px;">
                      <el-option
                        v-for="(item,index) in formInline.project"
                        :key="index"
                        :label="item.name"
                        :value="item.value"
                        label-width="40px"
                      ></el-option>
                    </el-select>&nbsp;
                    <el-select v-model="formInline.projectName" style="width:130px;">
                      <el-option
                        v-for="(item,index) in formInline.project"
                        :key="index"
                        :label="item.name"
                        :value="item.value"
                        label-width="40px"
                      ></el-option>
                    </el-select>&nbsp;
                    <el-select v-model="formInline.projectName" style="width:60px;">
                      <el-option
                        v-for="(item,index) in formInline.project"
                        :key="index"
                        :label="item.name"
                        :value="item.value"
                        label-width="40px"
                      ></el-option>
                    </el-select>&nbsp;
                    <input
                      placeholder="指标"
                      style="height: 30px;line-height: 30px;padding:0 10px;width:85px;border: 1px solid #dcdfe6;"
                      value="0"
                      min="0"
                      max="100"
                      type="number"
                    />
                    <b
                      style="padding:0 10px;display:inline-block;height: 30px;line-height: 30px;width:52px;border: 1px solid #dcdfe6;"
                    >%</b>
                    &nbsp;
                    <el-select v-model="formInline.projectName" style="width:110px;">
                      <el-option
                        v-for="(item,index) in formInline.project"
                        :key="index"
                        :label="item.name"
                        :value="item.value"
                        label-width="40px"
                      ></el-option>
                    </el-select>&nbsp;
                    then&nbsp;
                    <el-select v-model="formInline.projectName" style="width:150px;">
                      <el-option
                        v-for="(item,index) in formInline.project"
                        :key="index"
                        :label="item.name"
                        :value="item.value"
                        label-width="40px"
                      ></el-option>
                    </el-select>
                    <i class="el-icon-info" style="color:#888; margin:0 5px;"></i>
                  </p>
                  <i class="el-icon-error" style="color:#888; margin:0 5px;" @click="delZhibiao"></i>
                </li>
                <a @click="addZhibiao">添加</a>
              </ul>
            </div>
          </div>
          <div>
            <p>
              <el-checkbox v-model="checkedGaojing">
                事件告警
                <i class="el-icon-info" style="color:#888; margin:0 5px;"></i>
              </el-checkbox>
            </p>
            <!-- 在这里进行便利，添加 -->
            <ul class="color">
              <li style="display:flex;align-items: center;cursor: pointer;">
                <p>
                  <el-select v-model="formInline.projectName" style="width:180px;margin:0 5px;">
                    <el-option
                      v-for="(item,index) in formInline.project"
                      :key="index"
                      :label="item.name"
                      :value="item.value"
                      label-width="40px"
                    ></el-option>
                  </el-select>
                </p>
                <i class="el-icon-error" style="color:#888; margin:0 5px;" @click="delShijian"></i>
              </li>
              <a @click="addShijian">添加</a>
            </ul>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save('form')">保 存</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import GroupingType from '@/components/GroupingType'
export default {
  data () {
    return {
      backShow: 'true',

      value1: new Date(2020, 1, 10, 18, 40),
      value2: new Date(2020, 1, 10, 18, 40),

      showChufa1: false, // 触发条件1显示开关
      showChufa2: true, // 触发条件2显示开关

      showQudao1: false, // 渠道选择1显示开关
      showQudao2: false, // 渠道选择2显示开关

      errorTip1: false, // 触发条件模板错误提示
      errorTip2: true, // 配置触发条件错误提示
      checkedZhibiao: false, // 指示告警
      checkedUse: false, // 使用预置触发条件
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
      }// 名称和备注的验证
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
    cancel () {
      this.$emit('cancel')
    },
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
    // 类型
    msgBtn (index) {
      this.liIndex = index
    },
    addZhibiao () {
      // 添加触发条件的指标告警
      alert('你要添加此项触发条件的指标告警')
    },
    delZhibiao () {
      // 删除触发条件的指标告警
      alert('你要删除此项触发条件的指标告警')
    },
    addShijian () {
      // 添加触发条件的事件告警
      alert('你要添加此项触发条件的事件告警')
    },
    delShijian () {
      // 删除触发条件的事件告警
      alert('你要删除此项触发条件的事件告警')
    },
    // 新建
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
      width: 80px;
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

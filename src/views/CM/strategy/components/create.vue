<template>
  <div class="create-wrap">
    <Header title="新增策略" :backShow="true"></Header>
    <div class="create-main">
      <div class="box">
        <el-form class="create-form" :model="formInline" ref="form" label-position='left' label-width="70px" size="mini">
          <el-form-item label="策略名称" prop='strategy_name'>
            <el-input class="w200" v-model="formInline.strategy_name" placeholder="1-20个中英文字符或下划线"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="textarea">
            <el-input class="w420" :autosize="{ minRows: 5, maxRows: 2 }" type="textarea" placeholder="1-100个中英文字符或下划线" v-model="formInline.textarea" maxlength="100" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="策略类型">
            <grouping-type @handleChangeChild="showMsgfromChild"></grouping-type>
          </el-form-item>
          <el-form-item label="所属项目" prop="projectName">
            <el-select class="w200" v-model="formInline.projectName">
              <el-option
                v-for="(item, index) in formInline.project"
                :key="index"
                :label="item.name"
                :value="item.value"
                label-width="40px"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="告警对象">
            <p>
              <el-radio v-model="radio" label="1">全部对象</el-radio>
            </p>
            <p>
              <el-radio v-model="radio" label="2">选择部分对象</el-radio>
            </p>
            <p>
              <el-radio v-model="radio" label="3">选择实例组</el-radio>
              <el-button type="text" size="mini" style="position: relative;margin-left: 20px">新建实例组</el-button>
            </p>
          </el-form-item>
          <!-- 告警对象-》选择部分对象 -->
          <div style="margin-bottom: 18px" v-show="radio==='2'">
            <div style="margin-left: 70px">
              <Transfer :multipleSelection="options"/>
            </div>
          </div>
          <!-- 告警对象-》 选择实例组 -->
          <div style="margin-bottom: 18px" v-show="radio==='3'">
            <div style="margin-left: 70px">
              <el-form-item label-width="0px">
                <el-select v-model="formInline.projectName" style="width:150px;">
                  <el-option v-for="(item, index) in formInline.project" :key="index" :label="item.name" :value="item.value" label-width="40px"></el-option>
                </el-select>
                <el-button type="text" size="mini" style="width: 50px">刷新</el-button>
              </el-form-item>
            </div>
          </div>
          <!-- 触发条件 -->
          <div style="margin-bottom: 18px">
            <label style="width: 70px;vertical-align: middle;float: left;padding: 0 12px 0 0;line-height: 28px">触发条件</label>
            <div style="margin-left: 70px">
              <!-- 触发条件模板 -->
              <div style="background-color: #f2f2f2;padding: 20px">
                <el-radio v-model="radioChufa" label="1">触发条件模板</el-radio>
                <el-button type="text" size="mini" style="margin-left: 20px">新增触发条件模板</el-button>
                <div v-show="radioChufa === '1'" style="padding: 10px">
                  <el-form-item label-width="0px" style="margin-bottom: 0px">
                    <el-select v-model="formInline.projectName" style="width:150px;">
                      <el-option v-for="(item, index) in formInline.project" :key="index" :label="item.name" :value="item.value" label-width="40px"></el-option>
                    </el-select>
                    <el-button type="text" size="mini" style="margin-left: 20px">刷新</el-button>
                  </el-form-item>
                  <p style="line-height: 28px"><el-checkbox disabled>指标告警</el-checkbox></p>
                  <div style="padding-left: 21px">
                    <el-form-item label-width="0px">
                      <span>满足</span>
                      <el-select v-model="formInline.projectName" style="margin: 0px 5px">
                        <el-option v-for="(item, index) in formInline.project" :key="index" :label="item.name" :value="item.value" label-width="40px"></el-option>
                      </el-select>
                      <span>条件时，触发告警</span>
                    </el-form-item>
                    <div v-for="item in [0,1,2,3]" :key="item">
                      <span>if</span>
                      <el-form-item label-width="0px" style="display: inline-block">
                        <el-select v-model="formInline.projectName" style="width:150px;">
                          <el-option v-for="(item, index) in formInline.project" :key="index" :label="item.name" :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label-width="0px" style="display: inline-block">
                        <el-select v-model="formInline.projectName" style="width:150px;">
                          <el-option v-for="(item, index) in formInline.project" :key="index" :label="item.name" :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label-width="0px" style="display: inline-block">
                        <el-select v-model="formInline.projectName" style="width:130px;">
                          <el-option v-for="(item, index) in formInline.project" :key="index" :label="item.name" :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label-width="0px" style="display: inline-block">
                        <el-select v-model="formInline.projectName" style="width:60px;">
                          <el-option v-for="(item, index) in formInline.project" :key="index" :label="item.name" :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label-width="0px" style="display: inline-block">
                        <el-input class="w200" style="vertical-align: baseline" placeholder="指标" value="0" min="0" max="100" type="number">
                          <template slot="append">%</template>
                        </el-input>
                      </el-form-item>
                      <el-form-item label-width="0px" style="display: inline-block">
                        <el-select v-model="formInline.projectName" style="width:60px;">
                          <el-option v-for="(item, index) in formInline.project" :key="index" :label="item.name" :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                      <span>then</span>
                      <el-form-item label-width="0px" style="display: inline-block">
                        <el-select v-model="formInline.projectName" style="width:60px;">
                          <el-option v-for="(item, index) in formInline.project" :key="index" :label="item.name" :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                      <i class="el-icon-info" style="color:#888; margin:0 5px;"></i>
                    </div>
                  </div>
                  <!-- 事件告警 -->
                  <p style="line-height: 28px">
                    <el-checkbox disabled>事件告警</el-checkbox>
                    <i class="el-icon-info" style="color:#888; margin:0 5px;"></i>
                  </p>
                  <div style="padding-left: 21px">
                    <el-form-item label-width="0px">
                      <el-select v-model="formInline.projectName" style="width:180px;">
                        <el-option v-for="(item, index) in formInline.project" :key="index" :label="item.name" :value="item.value" label-width="40px"></el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </div>
              </div>
              <!-- 配置触发条件 -->
              <div style="background-color: #f2f2f2;padding: 20px;margin-top: 10px;">
                <el-radio v-model="radioChufa" label="2">配置触发条件</el-radio>
<!--                <div class="tip">请至少配置1项触发条件</div>-->
                <div v-show="radioChufa === '2'" style="padding: 10px">
                  <p style="line-height: 28px"><el-checkbox>指标告警</el-checkbox></p>
                  <div style="padding-left: 21px">
                    <el-form-item label-width="0px">
                      <span>满足</span>
                      <el-select v-model="formInline.projectName" style="margin: 0px 5px">
                        <el-option v-for="(item, index) in formInline.project" :key="index" :label="item.name" :value="item.value" label-width="40px"></el-option>
                      </el-select>
                      <span>条件时，触发告警</span>
                    </el-form-item>
                    <div v-for="item in [0,1,2,3]" :key="item">
                      <span>if</span>
                      <el-form-item label-width="0px" style="display: inline-block">
                        <el-select v-model="formInline.projectName" style="width:150px;">
                          <el-option v-for="(item, index) in formInline.project" :key="index" :label="item.name" :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label-width="0px" style="display: inline-block">
                        <el-select v-model="formInline.projectName" style="width:150px;">
                          <el-option v-for="(item, index) in formInline.project" :key="index" :label="item.name" :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label-width="0px" style="display: inline-block">
                        <el-select v-model="formInline.projectName" style="width:130px;">
                          <el-option v-for="(item, index) in formInline.project" :key="index" :label="item.name" :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label-width="0px" style="display: inline-block">
                        <el-select v-model="formInline.projectName" style="width:60px;">
                          <el-option v-for="(item, index) in formInline.project" :key="index" :label="item.name" :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label-width="0px" style="display: inline-block">
                        <el-input class="w200" style="vertical-align: baseline" placeholder="指标" value="0" min="0" max="100" type="number">
                          <template slot="append">%</template>
                        </el-input>
                      </el-form-item>
                      <el-form-item label-width="0px" style="display: inline-block">
                        <el-select v-model="formInline.projectName" style="width:60px;">
                          <el-option v-for="(item, index) in formInline.project" :key="index" :label="item.name" :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                      <span>then</span>
                      <el-form-item label-width="0px" style="display: inline-block">
                        <el-select v-model="formInline.projectName" style="width:60px;">
                          <el-option v-for="(item, index) in formInline.project" :key="index" :label="item.name" :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                      <i class="el-icon-info" style="color:#888; margin:0 5px;"></i>
                      <i class="el-icon-error" style="color:#888; margin:0 5px;"></i>
                    </div>
                    <el-button type="text" size="mini">添加</el-button>
                  </div>
                  <!-- 事件告警 -->
                  <p style="line-height: 28px">
                    <el-checkbox disabled>事件告警</el-checkbox>
                    <i class="el-icon-info" style="color:#888; margin:0 5px;"></i>
                  </p>
                  <div style="padding-left: 21px">
                    <el-form-item label-width="0px">
                      <el-select v-model="formInline.projectName" style="width:180px;">
                        <el-option v-for="(item, index) in formInline.project" :key="index" :label="item.name" :value="item.value" label-width="40px"></el-option>
                      </el-select>
                      <i class="el-icon-error" style="color:#888; margin:0 5px;"></i>
                    </el-form-item>
                    <el-button type="text" size="mini">添加</el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 告警渠道 -->
          <div style="margin-bottom: 18px">
            <label style="width: 70px;vertical-align: middle;float: left;padding: 0 12px 0 0;line-height: 28px">告警渠道</label>
            <div style="margin-left: 70px;background-color: #f2f2f2;">
              <Cam :camClick="camFun"></Cam>
            </div>
          </div>
          <!-- 接口回调 -->
          <div style="margin-bottom: 18px">
            <div style="width: 70px;">
              <label style="vertical-align: middle;float: left;padding: 0 12px 0 0;line-height: 28px">接口回调</label>
              <!--<p>（选填）</p>-->
            </div>
            <div style="margin-left: 70px">
              <el-form-item style="display: inline-block" label-width="0px">
                <el-select v-model="formInline.apiStr" style="display: inline-block">
                  <el-option v-for="(item, index) in formInline.apiArr" :key="index" :label="item.name" :value="item.value" label-width="40px"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item style="display: inline-block;margin-left: 10px" label-width="0px">
                <el-select filterable v-model="formInline.group">
                  <el-option v-for="(item, index) in formInline.kind_list" :key="index" :label="item.name" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              <p style="line-height: 28px">填写公网可访问到的url作为回调接口地址(域名或IP[:端口][/path])，云监控将及时把告警信息推送到该地址。</p>
              <div>
                <p>回调域名通过验证后生效，请于Response Body中返回以下code。<i class="el-icon-info" style="margin:0 5px;color: #c07400;"></i></p>
                <p>y46vg1ma</p>
              </div>
            </div>
          </div>
        </el-form>
        <div class="foot">
          <el-button type="primary" size="small" @click="save">完成</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
import Header from './Head'
import Transfer from './transfer'
import GroupingType from '@/components/GroupingType'
import Cam from '@/views/CM/CM_assembly/Cam'
import { ErrorTips } from '@/components/ErrorTips'
import { CM_ALARM_STRATEGY_DETAILS } from '@/constants'

export default {
  components: {
    Header,
    Transfer,
    GroupingType,
    Cam
  },
  data: function () {
    return {
      radio: '1', // 选择告警对象类型
      radioChufa: '1', // 触发条件单选
      options: [],
      formInline: {
        apiStr: 'http', // 接口回调
        apiArr: [{
          value: 0,
          name: 'http'
        }, {
          value: 1,
          name: 'https'
        }], // 接口回调数据
        strategy_name: '', // 策略名称
        textarea: '', // 备注
        strategy: '云服务器-基础监控',
        strategy_kind: [{
          value: 0,
          name: '云服务器-基础监控'
        }], // 策略类型
        alarm: '', // 策略类型
        projectName: '默认项目',
        project: [{
          value: 0,
          name: '默认项目'
        }]
      },
      cam: {} // cam组件的值
    }
  },
  methods: {
    detailsInit: async function () {
      let params = {
        Version: '2018-07-24',
        Module: 'monitor',
        GroupId: this.$route.query.groupId
      }
      await this.axios.post(CM_ALARM_STRATEGY_DETAILS, params).then(res => {
        if (res.Response.Error === undefined) {
          console.log(res.Response)
        } else {
          let ErrTips = {}
          let ErrOr = Object.assign(ErrorTips, ErrTips)
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: 'error',
            showClose: true,
            duration: 0
          })
        }
      })
    },
    // 策略类型
    showMsgfromChild (val) {
      console.log('val', val)
    },
    // 获取cam组件的值
    camFun (data) {
      this.cam = data
    },
    // 保存
    save: function () {
      this.$router.push({
        path: '/strategy'
      })
    }
  },
  created: function () {
    this.detailsInit()
  },
  mounted: function () {
  }
}
</script>
<style lang="scss" scoped>
  .w200 {
    width: 200px;
  }
  .w420 {
    width: 420px;
  }
  .create-main {
    padding: 20px 35px;
    .box {
      width: 100%;
      height: 100%;
      color: #888;
      background: white;
      padding: 20px;
      font-size: 12px;
      box-shadow: 1px 1px 5px #cccccc;
    }
  }
  .create-form {
    >>>.el-form-item__label,
    >>>.el-form-item__content {
      font-size: 12px;
      color: #888;
    }
  }
</style>

<template>
  <div class="close">
    <el-dialog :visible.sync="educeStatus.educeDialog" :show-close="false" width="35%">
      <div slot="title" class="title-wrap">
        <span>自定义导出字段</span>
        <i class="el-icon-close" @click="handleCancel(false)"></i>
      </div>
      <div class="content">
        <div class="message">请选择你要导出的字段，最多勾选26个字段，已勾选26个。</div>
        <div class="check-box">
          <el-checkbox :isIndeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange"></el-checkbox>
          <span class="checkboxtext">全选</span>
        </div>
        <div class="exportcontent">
          <el-row>
            <el-col :span="8">
              <el-checkbox v-model="exportField.num1" disabled></el-checkbox>
              <span class="checkboxtext">ID</span>
            </el-col>
            <el-col :span="8">
              <el-checkbox v-model="exportField.num2" disabled></el-checkbox>
              <span class="checkboxtext">实例名</span>
            </el-col>
            <el-col :span="8">
              <el-checkbox v-model="exportField.num3" @click="handleCheckedCitiesChange()"></el-checkbox>
              <span class="checkboxtext">状态</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-checkbox v-model="exportField.num4" @click="handleCheckedCitiesChange"></el-checkbox>
              <span class="checkboxtext">地域</span>
            </el-col>
            <el-col :span="8">
              <el-checkbox v-model="exportField.num5" @click="handleCheckedCitiesChange"></el-checkbox>
              <span class="checkboxtext">可用区</span>
            </el-col>
            <el-col :span="8">
              <el-checkbox v-model="exportField.num6"></el-checkbox>
              <span class="checkboxtext">实例类型</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-checkbox v-model="exportField.num7" @click="handleCheckedCitiesChange"></el-checkbox>
              <span class="checkboxtext">地域</span>
            </el-col>
            <el-col :span="8">
              <el-checkbox v-model="exportField.num8" @click="handleCheckedCitiesChange"></el-checkbox>
              <span class="checkboxtext">可用区</span>
            </el-col>
            <el-col :span="8">
              <el-checkbox v-model="exportField.num9"></el-checkbox>
              <span class="checkboxtext">实例类型</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-checkbox v-model="exportField.num9" @click="handleCheckedCitiesChange"></el-checkbox>
              <span class="checkboxtext">操作系统</span>
            </el-col>
            <el-col :span="8">
              <el-checkbox v-model="exportField.num10" @click="handleCheckedCitiesChange"></el-checkbox>
              <span class="checkboxtext">镜像id</span>
            </el-col>
            <el-col :span="8">
              <el-checkbox v-model="exportField.num11"></el-checkbox>
              <span class="checkboxtext">CPU</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-checkbox v-model="exportField.num12" @click="handleCheckedCitiesChange"></el-checkbox>
              <span class="checkboxtext">内存</span>
            </el-col>
            <el-col :span="8">
              <el-checkbox v-model="exportField.num13" @click="handleCheckedCitiesChange"></el-checkbox>
              <span class="checkboxtext">带宽</span>
            </el-col>
            <el-col :span="8">
              <el-checkbox v-model="exportField.num14"></el-checkbox>
              <span class="checkboxtext">公网IP</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-checkbox v-model="exportField.num15" @click="handleCheckedCitiesChange"></el-checkbox>
              <span class="checkboxtext">内网IP</span>
            </el-col>
            <el-col :span="8">
              <el-checkbox v-model="exportField.num16" @click="handleCheckedCitiesChange"></el-checkbox>
              <span class="checkboxtext">系统盘类型</span>
            </el-col>
            <el-col :span="8">
              <el-checkbox v-model="exportField.num17"></el-checkbox>
              <span class="checkboxtext">系统盘大小</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-checkbox v-model="exportField.num18" @click="handleCheckedCitiesChange"></el-checkbox>
              <span class="checkboxtext">数据盘类型</span>
            </el-col>
            <el-col :span="8">
              <el-checkbox v-model="exportField.num19" @click="handleCheckedCitiesChange"></el-checkbox>
              <span class="checkboxtext">数据盘大小</span>
            </el-col>
            <el-col :span="8">
              <el-checkbox v-model="exportField.num20"></el-checkbox>
              <span class="checkboxtext">所属网络</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-checkbox v-model="exportField.num21" @click="handleCheckedCitiesChange"></el-checkbox>
              <span class="checkboxtext">所在子网</span>
            </el-col>
            <el-col :span="8">
              <el-checkbox v-model="exportField.num22" @click="handleCheckedCitiesChange"></el-checkbox>
              <span class="checkboxtext">关联vpc</span>
            </el-col>
            <el-col :span="8">
              <el-checkbox v-model="exportField.num23"></el-checkbox>
              <span class="checkboxtext">创建时间</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-checkbox v-model="exportField.num24" @click="handleCheckedCitiesChange"></el-checkbox>
              <span class="checkboxtext">到期时间</span>
            </el-col>
            <el-col :span="8">
              <el-checkbox v-model="exportField.num25" @click="handleCheckedCitiesChange"></el-checkbox>
              <span class="checkboxtext">实例计费模式</span>
            </el-col>
            <el-col :span="8">
              <el-checkbox v-model="exportField.num26"></el-checkbox>
              <span class="checkboxtext">网络计费模式</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-checkbox v-model="exportField.num27" @click="handleCheckedCitiesChange"></el-checkbox>
              <span class="checkboxtext">所属项目</span>
            </el-col>
            <el-col :span="8">
              <el-checkbox v-model="exportField.num28" @click="handleCheckedCitiesChange"></el-checkbox>
              <span class="checkboxtext">标签</span>
            </el-col>
          </el-row>
          <div>
            <el-row>
              <el-col :span="6">
                <span>导出范围</span>
              </el-col>
              <el-col :span="18">
                <div>
                  <el-radio v-model="radio" label="1" class="box">导出全部实例</el-radio>
                </div>
                <div>
                  <el-radio v-model="radio" label="2" class="box">备选项</el-radio>
                </div>
                <div>
                  <el-radio v-model="radio" label="3" class="box">备选项</el-radio>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" size="mini" @click="handleCancel">确定</el-button>
          <el-button size="mini" @click="handleCancel(false)">取消</el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      checkAll: false, //是否全选
      isIndeterminate: true, //
      exportField: {
        num1: '',
        num2: '',
        num3: '',
        num4:'',
        num5: '',
        num6: '',
      },
      radio: "1"
    };
  },
  props: {
    educeStatus: {
      type: Object,
      default: () => []
    }
  },
  computed: {},
  methods: {
    //全选
    handleCheckAllChange(val) {
      // this.exportField = val ? cityOptions : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(index) {
      // let checkedCount = value.length;
      // this.checkAll = checkedCount === this.cities.length;
      // this.isIndeterminate =
      //   checkedCount > 0 && checkedCount < this.cities.length;
    },
    handleCancel() {
      this.$emit("close", false);
    }
  },
  components: {},
  mounted() {}
};
</script>
<style lang="scss" scoped>
.close {
  .title-wrap {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    span {
      font-weight: bolder;
    }
    i {
      font-size: 16px;
      font-weight: 900;
    }
  }
  .content {
    font-size: 12px;
    .check-box {
      padding: 10px 0;
      .checkboxtext {
        margin-left: 5px;
      }
    }
    .exportcontent {
      border-top: 1px solid #ccc;
      padding-top: 10px;
      .checkboxtext {
        margin-left: 5px;
      }
    }
    .message {
      padding: 10px 20px;
      background: #e5f0ff;
      color: #003b80;
    }
    .dialog-footer {
      display: block;
      text-align: center;
      padding-top: 10px;
    }
  }
}
</style>
<style>
.formStyle /deep/.el-form-item__label {
  font-size: 12px;
}
.exportcontent /deep/ .box .el-radio__label {
  font-size: 12px;
}
</style>



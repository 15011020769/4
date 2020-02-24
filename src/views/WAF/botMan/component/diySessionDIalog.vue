<!--
 * @Author: your name
 * @Date: 2020-02-21 10:54:14
 * @LastEditTime: 2020-02-21 19:22:06
 * @LastEditors: Please set LastEditors
 * @Description: 自定义会话特征弹窗
 * @FilePath: /new_product/src/views/WAF/botMan/component/diySessionDIalog.vue
 -->
<template>
<div class="main">
  <el-dialog
    :visible="visible"
    :title="infoProp.title"
    @close="onCancel"
    width="1100px"
  >
    <el-form
      v-model="formValue"
      :rules="rule"
      label-width="150px"
      label-position="left"
    >
      <el-form-item label="策略名称" prop="name">
        <el-input style="width: 480px" />
      </el-form-item>
      <el-form-item label="策略描述" prop="describe">
        <el-input style="width: 480px" />
      </el-form-item>
      <el-form-item label="策略开关" prop="switch">
        <el-switch v-model="formValue.switch" />
      </el-form-item>
      <el-form-item prop="term">
        <div slot="label">
          匹配条件
          <el-tooltip effect="light" content="同一规则的多个条件是“与”关系，同时满足才会执行动作，且最多配置10个；若匹配条件输入类型为字符串，区分大小写。">
            <i class="el-icon-info" />
          </el-tooltip>
        </div>
        <ul class="table-wrapper" >
          <li class="table-title">
            <h4 style="width: 166px">匹配字段</h4>
            <h4 style="width: 233px">匹配参数</h4>
            <h4 style="width: 84px">逻辑符号</h4>
            <h4 style="width: 260px">匹配内容</h4>
            <h4 style="width: 166px">操作</h4>
          </li>
          <li class="table-content">
            <!-- <div>
              <div @click="showSelectMenu=true" style="position: relative; width: 170px;">
                <span class="match-field">{{selectInfo.label}}</span>
                <i style="position: absolute; right: 35px; top: 10px;" slot="suffix" class="el-icon-arrow-down" />
              </div>
              <div class="menu-wrapper">
                <SelectMenu 
                  :selectInfo.sync="selectInfo" 
                  :showSelectMenu.sync="showSelectMenu" 
                  v-if="showSelectMenu" 
                  class="menu-box" 
                />
              </div>
            </div>
            <el-input 
              :style="`visibility: ${selectInfo.argplaceholder ? '' : 'hidden'}`" 
              style="width: 213px;"
              :placeholder="selectInfo.argplaceholder"
              />
            <el-select
              class="Logical-select"
              v-model="selectValue"
            >
              <el-option
                v-for="item in selectInfo.opoptions"
                :label="item | labelFilter"
                :value="item"
              />
            </el-select>
            <el-input 
              v-model="input" 
              class="content-input"
              :placeholder="selectInfo.placeholder"
            />
            <el-button class="delete-box">删除</el-button> -->
            <DiySessionItem :showSelectMenu.sync="showSelectMenu" :selectInfo="selectInfo"  />
          </li>
          <li class="table-footer">
            <el-button>添加</el-button>
            <span>还可以添加8条，最多10条</span>
          </li>
        </ul>
      </el-form-item>
    </el-form>
    <el-row slot="footer" type="flex" justify="center">
      <el-button>确定</el-button>
      <el-button @click="onCancel">取消</el-button>
    </el-row>
  </el-dialog>
</div>
</template>

<script>
import SelectMenu from './selectMenu'
import DiySessionItem from './diySessionItem'
export default {
  data() {
    return {
      formValue: {
        name: '',
        describe: '',
        switch: ''
      },
      rule: {
        name: [
          { required: true, message: '请输入策略名称' }
        ]
      },
      tableData: [
        {
          name: 'ff434'
        }
      ],
      showSelectMenu: false,
      selectInfo: {},
      selectValue: '',
      input: ''
    }
  },

  props: {
    visible: {
      default: false
    },
    infoProp: {
      default: {}
    },
  },

  methods: {
    onCancel() {
      this.$emit('update:visible', false)
    },
  },

  watch: {
    selectInfo: {
      handler:function(n, o) {
        this.selectValue = this.selectInfo.opoptions[0]
      },
      deep: true
    }
  },

  components: {
    SelectMenu,
    DiySessionItem
  },

  filters: {
    labelFilter(e) {
      switch (e) {
        case '>': return '大于'
        case '<': return '小于'
        case 'belong': return '属于'
        case 'not belong': return '不属于'
        case 'contains': return '包含'
        case 'not contains': return '不包含'
        case 'yes': return '是'
        case 'no': return '否'
        default: break;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
  font-size: 12px;
  * {
    font-size: 12px;
  }
}
.table-wrapper {
  border: 1px solid #ddd;
  .table-content {
    display: flex;
    align-items: center;
  }
  li {
    border-bottom: 1px solid #ddd;
  }
}
.table-title {
  color: #888;
  line-height: 40px;
  font-size: 12px;
  display: flex;
}
.table-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  ::v-deep .el-button {
    border: none;
    background: white;
    color: #006eff;
    padding: 0;
    margin-right: 5px;
  }
}
</style>
<template>
  <el-form :model="form" ref="form" label-width="100px">
    <el-form-item label="身份提供商" prop="name" :rules="{
                      required: true, message: '請選擇身份提供商'
                    }">
      <el-select v-model="form.name" filterable :placeholder="$t('CAM.Role.zwkxsftgs')" size="small">
        <el-option v-for="item in providers" :key="item.Name" :label="item.Name" :value="item.Name"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="使用條件">
    
      <el-table :data="form.condition" max-height="450" class="condi-table" :empty-text="$t('CAM.strategy.zwsj')">
        <el-table-column prop="date" :label="$t('CAM.Role.jian')" width="200px">
          <template slot-scope="scope">
            <el-form-item :prop="`condition.${scope.$index}.key`" :rules="{
                            required: true, message: ' ', trigger: 'blur'
                          }">
              <el-select v-model="form.condition[scope.$index].key" :placeholder="$t('CAM.Role.qxz')" size="small">
                <el-option v-for="item in keys" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="name" :label="$t('CAM.Role.tj')" width="250px">
          <template slot-scope="scope">
            <el-form-item :prop="`condition.${scope.$index}.condi`" :rules="{
                            required: true, message: ' ', trigger: 'blur'
                          }">
              <el-select v-model="form.condition[scope.$index].condi" :placeholder="$t('CAM.Role.qxz')" size="small" style="width: 230px">
                <el-option v-for="item in values" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="值">
          <template slot-scope="scope">
            <el-form-item :prop="`condition.${scope.$index}.val`" :rules="{
                            required: true, message: ' ', trigger: 'blur'
                          }">
              <el-input v-model="form.condition[scope.$index].val" :placeholder="$t('CAM.strategy.inputContent')" size="small"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="address" label width="100">
          <template slot-scope="scope">
            <a href="JavaScript:;" @click="detele(scope)">删除</a>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <p style="margin-top: -15px;">共{{form.condition.length}}项</p>
      <p style="margin-top:20px">
        <el-button size="small" @click="add_use">{{$t('CAM.Role.xzsytj')}}</el-button>
      </p>
    </el-form-item>
    <el-row type="flex" justify="center">
      <el-button type="primary" @click="save" size="small">保存</el-button>
      <el-button size="small" @click="$emit('update:visible', false)">取消</el-button>
    </el-row>
  </el-form>
</template>
<script>
import { LIST_PROVIDERS } from '@/constants'
export default {
  name: 'provider',
  props: {
    removeProviders: Array,
  },
  data() {
    return {
      providers: [],
      form: {
        name: '',
        condition: [],
      },
      keys: [
        {
          value: "saml:iss",
          label: "saml:iss"
        },
        {
          value: "saml:aud",
          label: "saml:aud"
        },
        {
          value: "saml:sub",
          label: "saml:sub"
        },
        {
          value: "saml:sub_type",
          label: "saml:sub_type"
        }
      ],
      values: [
        {
          value: 'string_equal',
          label: 'string_equal',
        },
        {
          value: 'string_not_equal',
          label: 'string_not_equal',
        },
        {
          value: 'string_equal_ignore_case',
          label: 'string_equal_ignore_case',
        },
        {
          value: 'string_not_equal_ignore_case',
          label: 'string_not_equal_ignore_case',
        },
      ],
    }
  },
  watch: {
    removeProviders: {
      handler() {
        let params = {
          Version: "2019-01-16"
        };
        this.axios
          .post(LIST_PROVIDERS, params)
          .then(res => {
            const p = this.removeProviders.map(p => p.name)
            this.providers = res.Response.SAMLProviderSet.filter(smal => !p.includes(smal.Name))
          })
      },
      immediate: true
    }
  },
  methods: {
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$emit('add', this.form)
        }
      })
    },
    add_use() {
      this.form.condition.push({});
    },
    detele(val) {
      this.form.condition.splice(val.$index, 1);
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-table {
  width: auto !important;
  border: 1px solid #ebeef5;
  border-bottom: none;
  th {
    padding: 0;
  }
}
</style>
<!-- 更新转发配置 -->
<template>
  <div class="colony-wrap">
    <!-- 头部 -->
    <div class="tke-content-header">
      <div class="tke-grid ">
        <!-- 左侧 -->
        <div class="grid-left">
          <span class="goback" @click="goBack">
            <i class="el-icon-back"></i>
          </span>
          <h2 class="header-title">更新</h2>
        </div>
        <!-- 右侧 -->
      </div>
    </div>
    <div class="colony-main">
      <div class="tke-card tke-formpanel-wrap mb60">
        <el-form
          class="tke-form"
          label-position="left"
          label-width="120px"
          size="mini"
        >
          <el-form-item label="监听端口">
            <el-checkbox disabled v-model="ing.checked">Http:80</el-checkbox>
            <el-checkbox v-model="ing.checkedtwo">Https:443</el-checkbox>
          </el-form-item>
          <el-form-item label="服务器证书">
            <el-select v-model="ing.value" placeholder="请选择">
              <el-option
                v-for="item in ing.options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <div>如您现有的证书不合适，可以<a href="">现在创建</a><i class="el-icon-edit-outline"></i></div>
          </el-form-item>
          <el-form-item label="转发配置">
            <div class="port">
              <!-- 头部 -->
              <div class="flex">
                <div style="padding-left:10px;width:150px;">协议</div>
                <div style="width:80px;">监听端口</div>
                <div style="width:168px;padding-left:12px">域名
                  <el-tooltip content="非通配的域名支持的字符集a-z 0-9.-;通配的域名，目前只支持*.example.com的形式，且单个域名中只出现一次" placement="top" effect="light">
                    <i class="el-icon-warning"></i>
                  </el-tooltip>
                </div>
                <div style="width:80px;">路径</div>
                <div style="width:150px;padding-left:40px;">后端服务
                  <el-tooltip content="转发规则后端服务无法添加访问方式为集群内访问的服务，如有需要可更新服务的访问方式。不支持配置访问方式为不启用的服务" placement="top" effect="light">
                    <i class="el-icon-warning"></i>
                  </el-tooltip>
                </div>
                <div style="padding-left:40px;">服务端口</div>
              </div>
              <!-- 内容 -->
              <div style="border-top:1px solid #ddd;padding: 10px;">
                <div style="padding:5px 0;" v-for="it in ing.list" :key="it.key">
                  <el-select style="width:120px;" v-model="ing.value" placeholder="请选择">
                    <el-option
                      v-for="item in ing.options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <span style="padding-left:23px">80</span>
                  <el-input style="width:200px;padding-left:75px;" placeholder="默认为IPv4 IP"></el-input>
                  <el-input style="width:120px;padding-left:30px;"></el-input>
                  <el-select v-model="ing.value" placeholder="请选择" style="padding-left:30px;width:150px;">
                    <el-option
                      v-for="item in ing.options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-select v-model="ing.value" placeholder="请选择" style="padding-left:30px;width:150px;">
                    <el-option
                      v-for="item in ing.options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-tooltip class="item" effect="dark" content="删除" placement="right">
                    <i style="font-size:18px;padding-left:20px;" class="el-icon-close" @click="removeprot(it)"></i>
                  </el-tooltip>
                </div>
              </div>
            </div>
            <a href="javascript:;" @click="addport()">添加转发规则</a>
          </el-form-item>
        </el-form>
      </div>
      <!-- 底部 -->
      <div class="tke-formpanel-footer">
        <el-button size="small" type="primary" @click="submit">完成</el-button>
        <el-button size="small" @click="goBack">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import HeadCom from '@/components/public/Head'
export default {
  name: 'configure',
  data () {
    return {
      type: '',
      number: 0,
      se: {
        tabPosition: 'jt',
        radio: '2'
      },
      ing: {
        fz: 'zd',
        checked: true,
        checkedtwo: false,
        name: '',
        tabPosition: 'gw',
        value: '',
        options: [],
        input: '',
        list: [{}]
      }
    }
  },
  components: {
    HeadCom
  },
  created () {

  },
  methods: {
    // 返回上一层
    goBack () {
      this.$router.go(-1)
    },
    submit () {

    },
    removeprot (item) {
      var index = this.ing.list.indexOf(item)
      if (index !== -1) {
        this.ing.list.splice(index, 1)
      }
    },
    addport () {
      this.ing.list.push({
        value: '',
        key: Date.now()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .colony-wrap .colony-main {
    padding: 20px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }

  .box-card {
    width: 100%;
    margin: 20px 0;
  }

  .box-black {
    margin: 10px;
    background: black;
  }
  .port {
    max-width: 855px;
    border: 1px solid #ddd;
  }
  .flex {
    display: flex;
  }
</style>

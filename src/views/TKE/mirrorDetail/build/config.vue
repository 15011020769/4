<template>
    <div>
        <div class="datails-nav">
            <ul>
                <router-link :to="{name: 'mirrorDetailBuild',query: {id: this.$route.query.id}}">
                    <li>
                        <i class="el-icon-back"></i>
                        <span>构建配置</span>
                    </li>
                </router-link>
            </ul>
        </div>
        <div class="room">
            <el-card class="box-card">
                <el-form :label-position="labelPosition" label-width="130px" :model="form" size="mini" class="tke-form" >
                    <el-form-item label="镜像地址">
                        <p>	ccr.ccs.tencentyun.com/undefined</p>
                    </el-form-item>
                    <el-form-item label="代码源">
                        <ul class='room-ul' @change="setChange($event)">
                            <li class='border-color'>Github</li>
                            <li>Gitlab</li>
                        </ul>
                    </el-form-item>
                    <el-form-item label="镜像版本命名规则">
                        <el-input v-model="form.name" class='w180 float' placeholder="请输入命名规则"></el-input>
                        <el-checkbox-group v-model="form.checkList" size='mini' style="float:left;margin-left:20px;">
                            <el-checkbox label="分支/标签" ></el-checkbox>
                            <el-checkbox label="更新时间" class='left'></el-checkbox>
                            <el-checkbox label="commit号" class='left'></el-checkbox>
                        </el-checkbox-group>
                        <p class='float' style="width:100%;">自定义前缀，支持$(Foo)形式的变量</p>
                    </el-form-item>
                    
                    <el-form-item label="覆盖镜像版本">
                        <el-input v-model="form.type" class='w180' placeholder="请输入tag"></el-input>
                        <p>自定义前缀，支持$(Foo)形式的变量</p>
                    </el-form-item>
                    <el-form-item label="Dockerfile路径">
                        <el-input v-model="form.road" class='w180' placeholder="请输入路径"></el-input>
                        <p>生成的镜像同时会包含该tag</p>
                    </el-form-item>
                    <el-form-item label="构建目录">
                        <el-input v-model="form.catalog" class='w180' placeholder="请输入目录"></el-input>
                        <p>Dockerfile文件在代码源中的路径</p>
                    </el-form-item>
                    <el-form-item label="构建参数">
                        <el-form-item
                            v-for="(domain, index) in form.domains"
                            :key="domain.key"
                            :prop="'domains.' + index + '.value'"
                        >
                        <div style="width:300px;">
                            <div class="form-input">
                                <el-input v-model="domain.value" size="mini" placeholder="变量名"></el-input>
                                <span>=</span>
                                <el-input v-model="domain.valueKey" size="mini" placeholder="变量值"></el-input>
                                <el-tooltip class="item" effect="dark" content="删除" placement="right">
                                    <i class="el-icon-close" @click.prevent="removeDomain(domain)"></i>
                                </el-tooltip>
                            </div>
                        </div>
                        </el-form-item>
                        <el-link type="primary" style="cursor: pointer;font-size:12px;"  @click="addDomain">新增变量</el-link>
                    </el-form-item>
                    <el-form-item label=" ">
                         <el-button type="primary">完成</el-button>
                    </el-form-item >
                </el-form>
            </el-card>
        </div>
    </div>
</template>
<script>
  export default {
    data() {
      return {
        labelPosition: 'left',
        form: {
          name:'',
          type: '',
          catalog:'',
          road:'',
          domains:[],
          checkList: []
        },
      }
    },
    methods:{
        setChange(e){
            console.log(e)
        },
        removeDomain (item) {
            var index = this.form.domains.indexOf(item)
            if (index !== -1) {
                this.form.domains.splice(index, 1)
            }
        },
        addDomain () {
            this.form.domains.push({
                value: '',
                valueKey: '',
                key: Date.now()
            })
        }
    }
  }
</script>
<style lang="scss" scoped>
.datails-nav {
      height: 40px;
      background: #fff;
      span {
        color: #000;
        font-size: 14px;
        padding: 0 20px;
        box-sizing: border-box;
      }
      ul {
        display: flex;
        height: 40px;
        line-height: 40px;
        margin-left: 20px;
        li {
          display: flex;
          align-items: center;
          justify-content: center;
          i {
            font-size: 16px;
            font-weight: bold;
          }
          span{
            font-size: 16px;
            font-weight: 700;
          }
        }
        li:nth-child(1) {
          color: blue;
        }
      }
}
.room{
    padding:20px;
    .box-card {
        width: 100%;
    }
}
.room-ul{
    li{
        float:left;
        padding:10px 20px;
        border:1px solid #a2a2a2;
        margin-right:20px;
        cursor:pointer;
    }
}
.border-color{
    border-color:#2277DA;
}
.left{
    margin-left:-20px;
}
.float{
    float:left;
}
.form-input{
    display: flex;
    justify-content: space-between;
    align-items: center;
    span{
        margin:0 10px;
    }
    i{
        margin:0 10px;
        cursor: pointer;
    }
}
.form-p{
    margin-bottom: 10px;
    font-size: 12px;
    color: #888;

}
</style>
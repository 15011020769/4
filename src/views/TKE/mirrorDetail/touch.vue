<template>
    <div class='room'>
        <el-card class="box-card">
            <div class="explain" style="margin-bottom:20px;">
                <p>通过触发器，可以在每次生成新的Tag（镜像版本）时，自行执行动作，如：自动更新使用该镜像仓库的服务</p>
            </div>
            <div class='room-border' v-for="(item,index) in formLabelAlign" :key="index">
                <div class="room">
                    <el-form :label-position="labelPosition" label-width="100px" :model="item" size="mini" class="tke-form">
                        <el-form-item label="触发器名称">
                            <el-input v-model="item.name" size="mini" class="w180"></el-input>
                            <div  style="font-size:12px;">英文字母开头，2-64个字符以内，支持a-z、A-Z、0-9、-、_</div>
                        </el-form-item>
                        <el-form-item label="触发条件">
                            <el-radio-group v-model="item.radio" @change="getRadio($event)" class="radio">
                                <el-radio :label="3" >全部触发</el-radio>
                            </el-radio-group>
                            <p class='f12'>镜像仓库内，有新的Tag生成，或Tag发生更新时，触发动作</p>
                            <el-radio-group v-model="item.radio" @change="getRadio($event)" class="radio">
                                <el-radio :label="6" class='mt20 f12'>指定Tag触发</el-radio>
                            </el-radio-group>
                            <p class='f12'>镜像仓库内，有指定Tag生成或更新时，触发动作</p>
                            <el-input v-model="input" class="w180" v-if="item.radio=='6'"></el-input>
                            <p style="color:#888;"  v-if="item.radio=='6'" class='f12'>多个Tag名称之间用分号分隔</p>
                            <el-radio-group v-model="item.radio" @change="getRadio($event)" class="radio">
                                <el-radio :label="9" class='mt20'>正则触发</el-radio>
                            </el-radio-group>
                            <p class='f12'>镜像仓库内，有符合正则表达式的Tag生成或更新时,触发动作</p>
                            <el-input v-model="input" class="w180"  v-if="item.radio=='9'"></el-input>
                            <p style="color:#888;"  v-if="item.radio=='9'" class='f12'>输入匹配Tag的正则表达式</p>
                        </el-form-item>
                        <el-form-item label="触发动作">
                            <p class='f12'>更新容器的镜像</p>
                            <p class='f12' style="color:#888;">需指定更新的服务,以及该服务下的指定容器镜像</p>
                        </el-form-item>
                        <el-form-item label="选择服务/容器">
                           <select class='select-style' :style="{'width':(item.flag?'500px':'150px')}"  @click="item.flag=!item.flag">
                               <option disabled selected style='display:none;'>请选择容器</option> 
                           </select>
                            <el-tabs v-model="item.activeName" @tab-click="handleClick" style="width:500px;" v-if="item.flag">
                                <el-tab-pane label="地域" name="1">地域</el-tab-pane>
                                <el-tab-pane label="集群" name="2">集群</el-tab-pane>
                                <el-tab-pane label="Namespace" name="3">Namespace</el-tab-pane>
                                <el-tab-pane label="工作负载类型" name="4">工作负载类型</el-tab-pane>
                                <el-tab-pane label="工作负载" name="5">工作负载</el-tab-pane>
                                <el-tab-pane label="容器" name="6">容器</el-tab-pane>
                            </el-tabs>
                        </el-form-item>
                        <el-form-item label="">
                            <el-button type="primary">保存</el-button>
                            <el-button @click="deleteBox(index)">取消</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <el-button type="text" size="mini" @click="setAddBox()">添加触发器</el-button>
            <p class='f14' style="font-weight:700;margin:20px 0;">触发记录</p>
             <el-table
                :data="tableData"
                style="width: 100%">
                <el-table-column
                    prop="date"
                    label="触发器名称"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="触发器条件"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="address"
                    label="触发动作">
                </el-table-column>
                 <el-table-column
                    prop="address"
                    label="触发结果">
                </el-table-column>
                 <el-table-column
                    prop="address"
                    label="触发时间">
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>
<script>
    export default {
        data(){
            return{
            labelPosition: 'right',
            formLabelAlign: [],
            tableData:[]
          }
        },
        methods:{
            getRadio(e){
            },
            setAddBox(){
                this.formLabelAlign.push({
                    name: '',
                    region: '',
                    type: '',
                    radio:3,
                    check:[
                        {location:""},
                        {colony:""},
                        {namespace:""},
                        {type:""},
                        {workload:""},
                        {room:""}
                    ],
                    activeName:'1',
                    flag:false
                })
            },
            deleteBox(index){
                this.formLabelAlign.splice(index, 1)
            },
            handleClick(tab, event) {
            }
        }
    }
</script>
<style >
 .room{
     width:100%;
     padding:10px;
 }
 .explain {
    padding: 10px 30px 10px 20px;
    vertical-align: middle;
    color: #003b80;
    border: 1px solid #97c7ff;
    background: #e5f0ff;
}
  .box-card {
    width: 100%;
  }
  .room-border{
      border:1px solid #d2d2d2;
      margin-bottom:10px;
  }
  .el-form-item__label{
      font-size:12px;
  }
  .radio{
      display:flex;
      flex-direction:column;
      /* margin-top:15px; */
  }
  .select-style{
       cursor: pointer; 
  }
  select{
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);   
    outline:none;
    }
</style>
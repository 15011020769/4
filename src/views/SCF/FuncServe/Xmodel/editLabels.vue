<template>
  <el-dialog :title="$t('SCF.total.yxzy')" :visible.sync="visible" width="50%" >
      <div class="dialog-content">
          <div>
            <div class="dc-1">
                <p class="p_1"><span class="s-1">{{$t('SCF.total.bqj')}}</span><span  class="s-2">{{$t('SCF.total.bqz')}}</span><span  class="s-3">{{$t('SCF.total.sc')}}</span></p>
                <div class="content-list">
                <p class="p_2" v-for="(v,i) in list" :key="i">
                    <span  class="s-1">
                        <span  class="word_limmit"   v-if="v.action=='showAgain'">{{v.Key}}</span>
                        <el-autocomplete
                        size="small"
                        v-else
                        v-model="v.Key"
                        :fetch-suggestions="querySearch"
                        @select="handleSelect"
                        ></el-autocomplete>
                    </span>
                    <span  class="s-2"><el-input  v-show="v.Key!=''"  @focus="valueFocus(v.Value,i)" @blur="valueBlur(v,i)" v-model="v.Value" size="small"></el-input></span>
                    <span  class="s-3"> <el-button type="text" size="small" @click="delKeyValue(i,v)">{{$t('SCF.total.sc')}}</el-button></span>
                </p>
                </div>
            </div>
            <el-button type="text" size="small" @click="addKeyValue">添加</el-button>
          </div>

      </div>

    
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="submit">{{$t('SCF.total.qd')}}</el-button>
    </span>
  </el-dialog>
</template>
<script>
 import {
    ErrorTips
  } from "@/components/ErrorTips";
import {EDIT_LABELS_JZ,GET_LABELS_LIST}  from "@/constants";
import VueCookie from 'vue-cookie'
export default {
  props:{
    editVisible:Boolean,
    labelsInfo:Object,
  },
  data() {
    return {
        visible:false,
        list:[],//表格数据
        listCopy:[],//存放鼠标聚焦输入框后表格的数据
        delArr:[],//存放删除的数组
        editArr:[],//筛选后的数组
        editArrCopy:[],//存放鼠标失焦后存储的数据
        restaurants:[],//默认下拉框内容
        resourceId:'',
    };
  },
  created(){
      this.getLabels()
  },
  methods: {
    submit(){
        this.visible=false;
        let addArr=this.list.filter(item=>{//新增数组
            return item.action=='new'&&item.Key!=''
        })

        let delArrSure=this.delArr.filter(item=>{//删除的数组
            return item.action=='showAgain'
        })
        let editArrSure=this.editArr.filter(item=>{//编辑的数组
            if(item.action=='showAgain'){
                return {
                    tagKey:item.Key,
                    tagValue:item.Value
                }
            }
        })
        let editArrSure2=[];
        if(delArrSure.length!=0){//判端删除的数据中是否含有编辑的数据，没有的话等于原数组，有的话进行去重处理
            delArrSure.forEach(item=>{
                editArrSure.forEach(val=>{
                    if(item.Key!=val.Key){
                        editArrSure2.push(val)
                    }
                })
            })
        }else{
            editArrSure2=editArrSure
        }
    
        let   fnDel=(arr)=>{
            let obj={}; 
            arr.forEach((v,i)=>{
                obj[`DeleteTags.${i}.TagKey`]=v.Key
            })
            return obj
        }
        let  fnEdit=(arr)=>{
            let obj={}; 
            arr.forEach((v,i)=>{
                obj[`ReplaceTags.${i}.TagKey`]=v.Key
                obj[`ReplaceTags.${i}.TagValue`]=v.Value
            })
            return obj
        }
        let params={
            ...fnDel(delArrSure),
            ...fnEdit(addArr),
            ...fnEdit(editArrSure2),
            Resource: `qcs::scf:ap-taipei:uin/${VueCookie.get('uin')}:lam/${this.resourceId}`,
            Version:'2018-08-13',
            Action:'ModifyResourceTags',
        }
        console.log(params)
        if(JSON.stringify(fnDel(delArrSure))!='{}'||JSON.stringify(fnEdit(addArr))!='{}'||JSON.stringify(fnEdit(editArrSure2))!="{}"){
            this.axios.post(EDIT_LABELS_JZ,params).then(res=>{
                console.log(res)
                 if (res.Response.Error === undefined){
                     this.$parent.GetDate()

                      this.$message({
                        message:'操作成功',
                        type: "success",
                        showClose: true,
                        duration: 0
                      });
                 }else{
                    let ErrTips = {
                        "InvalidParameter.Tag": "Tag參數錯誤",
                        "InvalidParameterValue.DeleteTagsParamError":'DeleteTags中不能包含ReplaceTags或AddTags中元素',
                        "InvalidParameterValue.ResourceDescriptionError":'資源描述錯誤',
                        "LimitExceeded.TagKey":'用戶創建標籤鍵達到上限數 1000',
                        "LimitExceeded.TagValue":'單個標籤鍵對應標籤值達到上限數 1000',
                    };
                    let ErrOr = Object.assign(ErrorTips, ErrTips);
                    this.$message({
                    message: ErrOr[res.Response.Error.Code],
                    type: "error",
                    showClose: true,
                    duration: 0
                    }); 
                 }
            })

        }
       
    },
    getLabels(){
        this.axios.post(GET_LABELS_LIST,{rp:1000}).then(res=>{
          console.log(res)
           if (res.codeDesc === 'Success'){
                let tags=res.data.rows;
                    tags=tags.map((item)=>{
                        return {value:item}
                    })
                this.restaurants=tags;//设置下拉框内容
           }else{
               let ErrTips = {
                 "InvalidParameterValue.UinInvalid": "Uin參數不合法",
               };
                let ErrOr = Object.assign(ErrorTips, ErrTips);
                this.$message({
                message: ErrOr[res.Response.Error.Code],
                type: "error",
                showClose: true,
                duration: 0
                });
           }
      })
    },
    querySearch(queryString, cb) {
        var restaurants = this.restaurants;
        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
        // 调用 callback 返回建议列表的数据
        cb(results);
    },
    createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
    },
    handleSelect(item){
        console.log(item)
    },
    addKeyValue(){//添加
        let arr=[...this.list];//添加的数组
        arr.push({Key:'',Value:'',action:'new'});
        this.list=arr
    },
    delKeyValue(index,item){//删除
         this.list.splice(index,1)
         this.delArr.push(item)
    },
    valueFocus(val,index){//聚焦时保存数组
        let arr=JSON.parse(JSON.stringify(this.list))
        this.listCopy=arr;
    },
    valueBlur(val,index){
        if(this.listCopy[index].Value!=val.Value){
            this.editArrCopy.push(val)//存放编辑的数组
        }
        let arr=[...this.editArrCopy],obj={};
        arr = arr.reduce(function(item, next) {
           obj[next.Key] ? '' : obj[next.Key] = true && item.push(next);
            return item;
        }, []);//去重
        this.editArr=arr;//拿到实际操作要编辑的数组
    },
  },
  watch:{
      editVisible:function(val){
         this.visible=val;
      },
      visible:function(val){
          this.$emit('update:editVisible',val)
      },
      labelsInfo:{//父组件传给子组件的信息
          handler(val){
              console.log(val)
              let arr=[];
              arr=val.TagSet.map(item=>{
                  return {
                      Key:item.Key,
                      Value:item.Value,
                      action:'showAgain'//自定义字段判断是否是编辑
                  }
              })
              arr.push({Key:'',Value:'',action:'new'})//默认进来添加一条
              this.list=arr;
              this.storageDefaultInfoDataByTransmit=arr;
              this.resourceId=val.resourceId;
              //清除默认数据
              this.listCopy=[];
              this.delArr=[];
              this.editArr=[];
              this.editArrCopy=[]
          },
          deep:true
      },
      list:{
          handler(val){
              for (let i = 0; i < val.length; i++) {
                setTimeout(() => {
                 for(let j = i+1; j<val.length;j++){
                     if(val[i].Key===val[j].Key){
                             val[j].Key=''
                     }
                 }
                }, 1000);
              }
          },
          deep:true
      }
    
  }

};
</script>
<style scoped lang="scss">
/* css */
.dialog-content{

    .dc-1{
       border:solid 1px #ddd;
       .p_1{
        display: flex;
        padding: 6px 0px;
        text-align: center;
        border-bottom: solid 1px #ddd;
        margin-bottom: -1px;
       }
       .content-list{
           height: 400px;
           overflow: auto;
            .p_2{
                display: flex;
                text-align: center;
                border-top:solid 1px #ddd ;
                padding: 14px 0px;  
                align-items: center;
                &:hover{
                    background: #eeeeee;
                }
                ::v-deep .el-input{
                    width: 180px;
                    margin-left: 20px;
                }
                ::v-deep .el-input__inner{
                    border-radius: 0px;
                }
                .word_limmit{
                   overflow: hidden;
				   white-space: nowrap;
				   text-overflow: ellipsis;
                   width: 200px;
                   display: inline-block;
                }
            }
       }
        .s-1{
            width: 33%;
        }
        .s-2{
            width: 35%;
        }
        .s-3{
            width: 32%;
        }
       
    }
}
</style>

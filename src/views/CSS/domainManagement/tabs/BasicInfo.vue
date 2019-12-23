<template>
  <div>
    <div class="basicinfo">
      <h1>基本信息</h1>
      <div class="newClear">
        <div class="newClear newList">
          <p>CNAME</p>
          <p>{{Con.Name}}</p>
        </div>
        <div class="newClear newList">
          <p>创建时间</p>
          <p>{{Con.CreateTime}}</p>
        </div>
        <div class="newClear newList">
          <p>类型</p>
          <p>{{Con.Type|typeCh}}</p>
        </div>
        <div class="newClear newList">
          <p>API Key</p>
          <p>f5ad1c36d3cb7d48fe43e72d5dc028c4</p>
        </div>
        <div class="newClear newList">
          <p>标签</p>
          <p><span class="spanTags">fff:fff</span><i class="el-icon-edit" @click="editTags"></i></p>
        </div>
      </div>
      <editTagsModel :isShow="modelEdit" @closeEditTagsModel="closeEditTagsModel"/>
    </div>
  </div>
</template>
<script>
import editTagsModel from '../model/editTagsModel'
export default {
  props:{
    // Con:Object,
    Con: {
      required: false,
      type: Object
    },
  },
  components:{
    editTagsModel:editTagsModel
  },
  filters: {
    typeCh (val) {
      console.log(val);
      if(val=='0'){
        return '推流域名'
      }else if(val=='1'){
        return '播放域名'
      }
    }
  },
  data(){
    return{
      modelEdit:false,//编辑弹框
    }
  },
  methods:{
    //编辑标签
    editTags(){
      this.modelEdit=true;
    },
    //关闭弹框
    closeEditTagsModel(isShow){
      this.modelEdit=isShow;
    }
  }
}
</script>
<style lang="scss" scoped>
.newClear:after{
  display:block;
  content:'';
  clear:both;
}
.basicinfo{
  width:100%;
  min-height:100px;
  background-color:#fff;
  border:1px solid #ddd;
  box-shadow: 0 2px 3px 0 rgba(0,0,0,.2);
  padding: 20px;
  h1{
    font-size:14px;
    font-weight: 600;
    color:#000;
    margin-bottom:30px;
  }
  .newList{
    margin-bottom:30px;
    p:nth-child(1){
      font-size:12px;
      color:#999;
      float:left;
      width:70px;
    }
    p:nth-child(2){
      font-size:12px;
      color:#000;
      float:left;
      width:calc(100% - 70px);
      .spanTags{
        display: inline-block;
        font-size: 12px;
        background-color: #f2f2f2;
        padding: 1px 4px;
        color: #000;
        margin-right: 4px;
        border: 1px solid #ddd;
      }
    }
  }
}
</style>
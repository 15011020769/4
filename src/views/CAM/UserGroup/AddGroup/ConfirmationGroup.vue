<template>
    <div class="Cam">
        <div class="container">
            <label>用户组名称：</label>
            <span>{{addModel.groupName}}</span>
            <br/>
            <label>备注：</label>
            <span>{{addModel.remark}}</span>
        </div>
    </div>
</template>

<script>
  export default {
    props: {
      addModel: {
        groupName: String,
        remark: String
      }
    },
    data() {
      return {
      };
    },
    methods: {
    }
  }
</script>
<style lang="scss" scoped>
  .Cam {
  .container {
    width:96%;
    height:200px;
    min-height: 200px;
    margin:10px auto 0;
    background: #fff;
    padding:20px;
    padding-right: 50%;
    p.title,p.explain{
      text-align: center;
      line-height: 20px;
      font-size: 16px;
      color: #000;
      font-weight: 700;
    }
    p.explain {
      font-size: 12px;
      color:#ccc;
      margin-top: 10px;
      line-height: 16px;
      color: #666;
    }
  }

}
</style>
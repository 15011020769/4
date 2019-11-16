<template>
    <div class="Cam">
        <div class="container">
            <el-transfer
                filterable
                filter-placeholder="请输入城市拼音"
                v-model="policiesModel"
                :data="policiesData"
                :props="{
                    key: 'policyId',
                    label: 'policyName'
                    }"
                @left-check-change="changeLeftData"
                >
            </el-transfer>
        </div>
    </div>
</template>

<script>
  export default {
    data() {
      return {
        policiesData: [],
        policiesModel: []
      };
    },
    mounted() {
        this.init()
    },
    methods: {
        init() {
            let params = {
                Action: 'ListPolicies',
                scope:'All'
            }
            let url = "cam/ListPolicies"
            this.axios.post(url, params).then(data => {
                console.log(data)
                this.policiesData = data.data.list
            }).catch(error => {
                console.log(error)
            })
        },
        changeLeftData(policiesModel) {
        this.policiesModel= [...this.policiesModel, ...policiesModel]
        },
    }
  };
</script>
<style lang="scss" scoped>
  .Cam {
  .container {
    width:96%;
    height:270px;
    min-height: 360px;
    margin:10px auto 0;
    background: #fff;
    padding:20px;
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
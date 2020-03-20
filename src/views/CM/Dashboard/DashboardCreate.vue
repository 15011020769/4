<template>
    <div class="room">
        <h2>创建监控图表</h2>
        <div class="top">
            <div class="top-one">
                <span>产品类型</span>
                <Type v-on:PassData="PassData" :projectId='projectId' :searchParam='searchParam'></Type>
            </div>
            <div class="top-two">
                <span>数据视图</span>
                <div class="top-two-see">明细试图</div>
            </div>
        </div>
        <h3 style="margin-bottom:20px">配置监控图表</h3>
        <div class="footer">
            <div class="footer-left"></div>
            <div class="footer-right"></div>
        </div>
        <div class="bottom">
             <el-button type="primary" size='mini'>确定</el-button>
             <el-button size='mini'>取消</el-button>
        </div>
    </div>
</template>
<script>
import Type from '@/views/CM/CM_assembly/product_type'
export default {
    name:"DashboardCreate",
    components:{
        Type
    },
    data(){
        return{
            projectId:'',
            searchParam: {},
        }
    },
    methods:{
        PassData(data) {
            console.log(data)
            this.ceshi999 = data.productValue
            console.log(this.ceshi999)
        },
    }
}
</script>
<style lang="scss" scoped>
    .room{
        padding:20px;
        background: white;
    }
    .top{
        margin-top:20px;
        font-size: 14px;
        height: 50px;
        // line-height: center;
        .top-one{
            width: 300px;
            float: left;
            display: flex;
            justify-content: space-between;
            // align-self: center;
            align-items: center;
        }
        .top-two{
            width: 150px;
            float: left;
            margin-left: 20px;
             display: flex;
            justify-content: space-between;
            // align-self: center;
            align-items: center;
            .top-two-see{
                border:1px solid rgb(0, 110, 255);
                width:80px;
                height: 30px;
                color: rgb(0, 110, 255) ;
                line-height: 30px;
                text-align: center;
                cursor: pointer;
            }
        }
    }
    .footer{
        display: flex;
        justify-content: space-between;
        align-items: center;
        .footer-left{
            width: 70%;
            height: 450px;
            border:1px solid #ccc;
        }
        .footer-right{
            width: 25%;
            height: 450px;
            border:1px solid #ccc;
        }
    }
    .bottom{
        margin-top:20px;
    }
</style>
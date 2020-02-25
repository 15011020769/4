<template>
  <div>
    <div class="topTitle">
      <div class="topTitleMain newClear">
        <div class="tit">核对信息</div>
      </div>
    </div>
    <div class="wrapper">
      <div class="wrapperCon">
        <div class="payTable">
          <el-table
            :data="tableData">
            <el-table-column prop="name" label="产品名称"></el-table-column>
            <el-table-column prop="setInfi" label="配置信息">
              <template>
                <p>Web应用防火墙 : 高级版</p>
                <p>扩展域名包个数 : 0</p>
                <p>地域 : 广州</p>
              </template>
            </el-table-column>
            <el-table-column prop="price" label="单价"></el-table-column>
            <el-table-column prop="num" label="数量"></el-table-column>
            <el-table-column prop="payMethods" label="付费方式"></el-table-column>
            <el-table-column prop="buyTime" label="购买时长"></el-table-column>
            <el-table-column prop="youhui" label="优惠"></el-table-column>
            <el-table-column prop="total" label="费用">
              <template slot-scope="scope">
                <span class="feeColor">{{scope.row.total}}</span>
              </template> 
            </el-table-column>
          </el-table>
        </div>
        <div class="payBot">
          <div class="btnGroup">
            <span class="totalMo">总计费用：</span><span class="totaoMoneyO">¥<i>3880.00</i></span>
            &nbsp;<el-button @click="next" size="mini" class="selfPay">自行支付</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data(){
    return{
      active: 0,//第一步
      tableData:[
        {
          name:'Web应用防火墙新购',
          price:'3880.00元/月',
          num:'1',
          payMethods:'预付费',
          buyTime:'1个月',
          youhui:'无',
          total:'3880.00元'
        }
      ],//表格
      useCard:false,//使用代金券
    }
  },
  methods:{
    //下一步
    next() {
      if (this.active++ > 2) this.active = 0;
    }
  }
}
</script>
<style lang="scss" scoped>
.newClear:after{
  display: block;
  content:'';
  clear:both;
}
.topTitle{
  width:100%;
  height:90px;
  background-color:#fff;
  box-shadow: 0 2px 3px #e2e9ee;
  .topTitleMain{
    width:1120px;
    margin:0 auto;
    .tit{
      float:left;
      font-size: 26px;
      font-weight: 400;
      line-height: 90px;
      color: #000;
    }
    .step{
      float:right;
      width:500px;
      padding-top:20px;
    }
  }
}
.wrapper{
  width:100%;
  .wrapperCon{
    width:1120px;
    margin:0 auto;
    .payTable{
      background-color:#fff;
      margin:20px 0;
      .feeColor{
        color:#fa7821;
      }
    }
    .payBot{
      background-color:#fff;
      padding:20px;
      .noneTip{
        color:#999;
        margin-left:10px;
        font-size:14px;
      }
      .duihaun{
        color:#006eff;
        float:right;
      }
      .btnGroup{
        display: flex;
        align-items: center;
        justify-content: flex-end;
        .totalMo{
          font-size:14px;
          color:#666;
        }
        .totaoMoneyO{
          color:#fa7821;
          i{
            font-style: normal;
            font-size:30px;
          }
        }
        .agentPay{
          margin-left:10px;
          color:#0071ce;
        }
        .selfPay{
          background-color:#fa7821;
          color:#fff;
        }
      }
    }
  }
}
</style>
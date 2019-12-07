<template>
  <div id="configModel">
    <div>
      <el-dialog
        title="DDoS防护配置"
        :visible.sync="configIsShow"
        width="40%"
        :append-to-body="true"
        :before-close="handleClose"
      >
        <div class="modelCenterCon">
          <p>
            <span class="modelSpan1">防护状态</span>
            <span>
              <el-switch
                v-model="servicePack.DefendStatus"
                active-color="#006eff"
                inactive-color="#999">
              </el-switch>
            </span>
          </p>
          <p>
            <span class="modelSpan1">清洗阈值<i class="el-icon-info"></i></span>
            <span>
              <el-select v-model="servicePack.DdosThreshold" class="setSelect">
                <el-option v-for="(item, index) in cleanNumOption" :label="item.label" :value="item.value" :key="index"></el-option>
              </el-select>
            </span>
          </p>
          <p>
            <span class="modelSpan1">防护等级<i class="el-icon-info"></i></span>
            <span>
              <a class="gardenChoose" :class="saveGarden==1?'seceltGarden':''" @click="clickGarden(1,'宽松')">宽松</a>
              <a class="gardenChoose" :class="saveGarden==2?'seceltGarden':''" @click="clickGarden(2,'正常')">正常</a>
              <a class="gardenChoose" :class="saveGarden==3?'seceltGarden':''" @click="clickGarden(3,'严格')">严格</a>
            </span>
            <el-dialog
              title="确认切换到严格模式？"
              :visible.sync="changeModelTip3"
              width="30%"
              :append-to-body="true"
              :before-close="changeCloseTip3"
            >
              <p>严格模式可能会影响业务，建议仅在正常模式透传攻击包影响业务时才使用。如果严格模式仍然无法解决透传影响业务的问题，请联系售后技术支持定制策略。</p>
              <span slot="footer" class="dialog-footer">
                <el-button @click="changeCloseTip3">取 消</el-button>
                <el-button type="primary" @click="changeSureTip3()">确 定</el-button>
              </span>
            </el-dialog>
            <el-dialog
              title="确认切换到正常模式？"
              :visible.sync="changeModelTip2"
              width="30%"
              :append-to-body="true"
              :before-close="changeCloseTip2"
            >
              <p>默认清洗模式，清洗策略不松不紧。</p>
              <span slot="footer" class="dialog-footer">
                <el-button @click="changeCloseTip2">取 消</el-button>
                <el-button type="primary" @click="changeSureTip2()">确 定</el-button>
              </span>
            </el-dialog>
            <el-dialog
              title="确认切换到宽松模式？"
              :visible.sync="changeModelTip1"
              width="30%"
              :append-to-body="true"
              :before-close="changeCloseTip1"
            >
              <p>宽松模式在遇到复杂攻击时可能会存在攻击透传，建议仅在正常模式存在误杀影响业务时使用。如果宽松模式仍然无法解决误杀问题，请联系售后技术支持进行策略定制。</p>
              <span slot="footer" class="dialog-footer">
                <el-button @click="changeCloseTip2">取 消</el-button>
                <el-button type="primary" @click="changeSureTip1()">确 定</el-button>
              </span>
            </el-dialog>

          </p>
          <p>
            <span class="modelSpan1">高级策略</span>
            <span>
              <el-select v-model="topFun" class="setSelect">
                <el-option label="无" value="no"></el-option>
                <el-option label="erg" value="erg"></el-option>
              </el-select>
            </span>
          </p>
          <p>
            <span class="modelSpan1">DDoS共计告警阈值</span>
            <span>
              <el-select v-model="ddosWarning" class="setSelect" @change="selectChange1">
                <el-option label="未设置" value="no"></el-option>
                <el-option label="入流量宽带" value="into"></el-option>
                <el-option label="清洗流量" value="clean"></el-option>
              </el-select>
              <span v-if="iptNummbps"><el-input v-model="iptmbpsText" class="intMbps"></el-input> Mbps</span>
            </span>
          </p>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
export default {
  props:{
    configShow:Boolean
  },
  data(){
    return{
      modelIsShow:'',//模态框
      servicePack: {
        DefendStatus:'',
        DdosThreshold: '',
      },//修改框数据绑定
      cleanNumOption:[
        {label:'默认', value:'0'},
        {label:'60Mbps', value:'60'},
        {label:'80Mbps', value:'80'},
        {label:'100Mbps', value:'100'},
        {label:'150Mbps', value:'150'},
        {label:'200Mbps', value:'0'},
        {label:'250Mbps', value:'0'},
        {label:'60Mbps', value:'0'},
        {label:'300Mbps', value:'0'},
        {label:'400Mbps', value:'0'},
        {label:'500Mbps', value:'0'},
        {label:'700Mbps', value:'0'},
        {label:'1000Mbps', value:'0'}
      ],//阈值
      saveGarden:1,//防护等级
      saveGardenText:'宽松',
      topFun:'erg',//高级策略
      ddosWarning:'no',//攻告警阈值
      iptNummbps:false,//告警阈值输入框隐藏
      iptmbpsText:'1000',
      saveStatus:true,//防护状态
      cleanNum:'100Mbps',//清洗阈值
      resourceId: 'net-0000006y',
      tableDataPolicy:[],//tab3,DDoS高级防护策略
      changeModelTip1:false,//修改模式提示弹框
      changeModelTip2:false,
      changeModelTip3:false,
    }
  },
  computed:{
    configIsShow(){
      return this.configShow
    }
  },
  methods:{
    //弹框关闭按钮
    handleClose(){
      this.modelIsShow=false;
      this.$emit("closeConfigModel",this.modelIsShow)
    },
    selectChange1(){
      if(this.ddosWarning=='no'){
        this.iptNummbps=false;
      }else{
        this.iptNummbps=true;;
      }
    },
    //选择防护等级
    clickGarden(typeNum,type){
      //this.saveGarden=typeNum;
      //this.saveGardenText=type;
      this.changeModel=false;
      if(typeNum==3){
        this.changeModelTip3=true;
      }else if(typeNum==2){
        this.changeModelTip2=true;
      }else if(typeNum==1){
        this.changeModelTip1=true;
      }
    },
    changeCloseTip1(){
      this.changeModelTip1=false;
      this.changeModel=true;
    },
    changeCloseTip2(){
      this.changeModelTip2=false;
      this.changeModel=true;
    },
    changeCloseTip3(){
      this.changeModelTip3=false;
      this.changeModel=true;
    },
    changeSureTip1(){
      this.saveGarden=1;
      this.saveGardenText='宽松'
      this.changeModelTip1=false;
      this.changeModel=true;
    },
    changeSureTip2(){
      this.saveGarden=2;
      this.saveGardenText='正常'
      this.changeModelTip2=false;
      this.changeModel=true;
    },
    changeSureTip3(){
      this.saveGarden=3;
      this.saveGardenText='严格'
      this.changeModelTip3=false;
      this.changeModel=true;
    }
  }
}
</script>
<style lang="scss">
#configModel{
  .modelCenterCon{
    p{
      margin-bottom:15px;
      span:nth-child(1).modelSpan1{
        display: inline-block;
        font-size:12px;
        color:#888;
        width:126px;
        i{
          margin-left:6px;
        }
      }
      span:nth-child(2){
        .gardenChoose{
          padding:0 20px;
          color:#000;
          font-size:12px;
          
        }
        .seceltGarden{
          color:#006eff !important;
        }
      }
    }
  }
}
</style>

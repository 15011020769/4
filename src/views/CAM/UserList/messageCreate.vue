<template>
  <div class="Cam">
    <div class="top">
      <i class="el-icon-arrow-left" @click="goback"></i>
      <span class="title-left">新建消息接收人</span>
    </div>
    <div class="container">
      <div class="tea-form">
        <div class="tea-form__item">
          <div class="tea-form__label is-required">
            <label>用户名</label>
          </div>
          <div class="tea-form__controls">
            <input class="tea-input" value />
          </div>
        </div>
        <div class="tea-form__item">
          <div class="tea-form__label">
            <label>备注</label>
          </div>
          <div class="tea-form__controls">
            <textarea class="tea-textarea" style="width: 330px;height: 100px;"></textarea>
          </div>
        </div>
        <div class="tea-form__item">
          <div class="tea-form__label is-required">
            <label>手机</label>
          </div>
          <div class="tea-form__controls tea-form__controls--text">
            <select
              class="tea-select"
              placeholder="请选择"
              style="min-width: 80px; width: 180px; margin-right: 3px;"
            >
              <option disabled hidden>请选择</option>
              <option value="ALB">阿尔巴尼亚(+355)</option>
              <option value="DZA">阿尔及利亚(+213)</option>
              <option value="AFG">阿富汗(+93)</option>
              <option value="ARG">阿根廷(+54)</option>
              <option value="ARE">阿拉伯联合酋长国(+971)</option>
              <option value="ABW">阿鲁巴(+297)</option>
              <option value="OMN">阿曼(+968)</option>
              <option value="AZE">阿塞拜疆(+994)</option>
              <option value="EGY">埃及(+20)</option>
              <option value="ETH">埃塞俄比亚(+251)</option>
              <option value="IRL">爱尔兰(+353)</option>
              <option value="EST">爱沙尼亚(+372)</option>
              <option value="AND">安道尔(+376)</option>
              <option value="AGO">安哥拉(+244)</option>
              <option value="AIA">安圭拉(+1264)</option>
              <option value="ATG">安提瓜和巴布达(+1268)</option>
              <option value="AUT">奥地利(+43)</option>
              <option value="AUS">澳大利亚(+61)</option>
              <option value="BRB">巴巴多斯(+1246)</option>
              <option value="PNG">巴布亚新几内亚(+675)</option>
              <option value="BHS">巴哈马(+1242)</option>
              <option value="PAK">巴基斯坦(+92)</option>
              <option value="PRY">巴拉圭(+595)</option>
              <option value="PSE">巴勒斯坦(+970)</option>
              <option value="BHR">巴林(+973)</option>
              <option value="PAN">巴拿马(+507)</option>
              <option value="BRA">巴西(+55)</option>
              <option value="BLR">白俄罗斯(+375)</option>
              <option value="BMU">百慕大(+1441)</option>
              <option value="BGR">保加利亚(+359)</option>
              <option value="MNP">北马里亚纳群岛(+1670)</option>
              <option value="BEN">贝宁(+229)</option>
              <option value="BEL">比利时(+32)</option>
              <option value="ISL">冰岛(+354)</option>
              <option value="PRI">波多黎各(+1787)</option>
              <option value="POL">波兰(+48)</option>
              <option value="BIH">波斯尼亚和黑塞哥维那(+387)</option>
              <option value="BOL">玻利维亚(+591)</option>
              <option value="BLZ">伯利兹(+501)</option>
              <option value="BWA">博茨瓦纳(+267)</option>
              <option value="BTN">不丹(+975)</option>
              <option value="BFA">布基纳法索(+226)</option>
              <option value="BDI">布隆迪(+257)</option>
              <option value="GNQ">赤道几内亚(+240)</option>
              <option value="DNK">丹麦(+45)</option>
              <option value="DEU">德国(+49)</option>
              <option value="TLS">东帝汶(+670)</option>
              <option value="TGO">多哥(+228)</option>
              <option value="DMA">多米尼加(+1767)</option>
              <option value="DOM">多明尼加共和国(+1809)</option>
              <option value="RUS">俄国(+7)</option>
              <option value="ECU">厄瓜多尔(+593)</option>
              <option value="ERI">厄立特里亚(+291)</option>
              <option value="FRA">法国(+33)</option>
              <option value="FRO">法罗群岛(+298)</option>
              <option value="PYF">法属波利尼西亚(+689)</option>
              <option value="VAT">梵帝冈(+379)</option>
              <option value="PHL">菲律宾(+63)</option>
              <option value="FJI">斐济(+679)</option>
              <option value="FIN">芬兰(+358)</option>
              <option value="CPV">佛得角(+238)</option>
              <option value="FLK">福克兰群岛(+500)</option>
              <option value="GMB">冈比亚(+220)</option>
              <option value="COG">刚果民主共和国(+242)</option>
              <option value="COD">刚果民主共和国(+243)</option>
              <option value="COL">哥伦比亚(+57)</option>
              <option value="CRI">哥斯达黎加(+506)</option>
              <option value="GRD">格林纳达(+1473)</option>
              <option value="GRL">格陵兰(+299)</option>
              <option value="GEO">格鲁吉亚(+995)</option>
              <option value="GUM">关岛(+1671)</option>
              <option value="GUY">圭亚那(+592)</option>
              <option value="KAZ">哈萨克斯坦(+7)</option>
              <option value="HTI">海地(+509)</option>
              <option value="KOR">韩国(+82)</option>
              <option value="NLD">荷兰(+31)</option>
              <option value="ANT">荷属安的列斯(+599)</option>
              <option value="MNE">黑山(+382)</option>
              <option value="HND">洪都拉斯(+504)</option>
              <option value="KIR">基里巴斯(+686)</option>
              <option value="DJI">吉布提(+253)</option>
              <option value="KGZ">吉尔吉斯斯坦(+996)</option>
              <option value="GIN">几内亚(+224)</option>
              <option value="CAN">加拿大(+1)</option>
              <option value="GHA">加纳(+233)</option>
              <option value="GAB">加蓬(+241)</option>
              <option value="KHM">柬埔寨(+855)</option>
              <option value="CZE">捷克共和国(+420)</option>
              <option value="ZWE">津巴布韦(+263)</option>
              <option value="CMR">喀麦隆(+237)</option>
              <option value="QAT">卡塔尔(+974)</option>
              <option value="CYM">开曼群岛(+1345)</option>
              <option value="CCK">科科斯群岛(+61)</option>
              <option value="COM">科摩罗(+269)</option>
              <option value="KWT">科威特(+965)</option>
              <option value="HRV">克罗地亚(+385)</option>
              <option value="KEN">肯尼亚(+254)</option>
              <option value="COK">库克群岛(+682)</option>
              <option value="LVA">拉脱维亚(+371)</option>
              <option value="LSO">莱索托(+266)</option>
              <option value="LAO">老挝(+856)</option>
              <option value="LBN">黎巴嫩(+961)</option>
              <option value="LTU">立陶宛(+370)</option>
              <option value="LBR">利比里亚(+231)</option>
              <option value="LBY">利比亚(+218)</option>
              <option value="LIE">列支敦士登(+423)</option>
              <option value="REU">留尼汪(+262)</option>
              <option value="LUX">卢森堡(+352)</option>
              <option value="RWA">卢旺达(+250)</option>
              <option value="ROU">罗马尼亚(+40)</option>
              <option value="MDG">马达加斯加(+261)</option>
              <option value="MDV">马尔代夫(+960)</option>
              <option value="MLT">马耳他(+356)</option>
              <option value="MWI">马拉维(+265)</option>
              <option value="MYS">马来西亚(+60)</option>
              <option value="MLI">马里(+223)</option>
              <option value="MKD">马其顿(+389)</option>
              <option value="MHL">马绍尔群岛(+692)</option>
              <option value="MYT">马约特(+262)</option>
              <option value="MUS">毛里求斯(+230)</option>
              <option value="MRT">毛里塔尼亚(+222)</option>
              <option value="USA">美国(+1)</option>
              <option value="ASM">美属萨摩亚(+1684)</option>
              <option value="VIR">美属维尔京群岛(+1340)</option>
              <option value="MNG">蒙古(+976)</option>
              <option value="MSR">蒙特塞拉特(+1664)</option>
              <option value="BGD">孟加拉国(+880)</option>
              <option value="PER">秘鲁(+51)</option>
              <option value="FSM">密克罗尼西亚(+691)</option>
              <option value="MMR">缅甸(+95)</option>
              <option value="MDA">摩尔多瓦(+373)</option>
              <option value="MAR">摩洛哥(+212)</option>
              <option value="MCO">摩纳哥(+377)</option>
              <option value="MOZ">莫桑比克(+258)</option>
              <option value="MEX">墨西哥(+52)</option>
              <option value="NAM">纳米比亚(+264)</option>
              <option value="ZAF">南非(+27)</option>
              <option value="SSD">南苏丹(+211)</option>
              <option value="NRU">瑙鲁(+674)</option>
              <option value="NIC">尼加拉瓜(+505)</option>
              <option value="NPL">尼泊尔(+977)</option>
              <option value="NER">尼日尔(+227)</option>
              <option value="NGA">尼日利亚(+234)</option>
              <option value="NIU">纽埃(+683)</option>
              <option value="NOR">挪威(+47)</option>
              <option value="PLW">帕劳(+680)</option>
              <option value="PRT">葡萄牙(+351)</option>
              <option value="JPN">日本(+81)</option>
              <option value="SWE">瑞典(+46)</option>
              <option value="CHE">瑞士(+41)</option>
              <option value="SLV">萨尔瓦多(+503)</option>
              <option value="WSM">萨摩亚(+685)</option>
              <option value="SRB">塞尔维亚(+381)</option>
              <option value="SLE">塞拉利昂(+232)</option>
              <option value="SEN">塞内加尔(+221)</option>
              <option value="CYP">塞浦路斯(+357)</option>
              <option value="SYC">塞舌尔(+248)</option>
              <option value="SAU">沙特阿拉伯(+966)</option>
              <option value="CXR">圣诞岛(+61)</option>
              <option value="STP">圣多美和普林西比(+239)</option>
              <option value="SHN">圣赫勒拿(+290)</option>
              <option value="KNA">圣基茨和尼维斯(+1869)</option>
              <option value="LCA">圣卢西亚(+1758)</option>
              <option value="SMR">圣马力诺(+378)</option>
              <option value="SPM">圣皮埃尔和密克隆(+508)</option>
              <option value="VCT">圣文森特和格林纳丁斯(+1784)</option>
              <option value="LKA">斯里兰卡(+94)</option>
              <option value="SVK">斯洛伐克(+421)</option>
              <option value="SVN">斯洛文尼亚(+386)</option>
              <option value="SJM">斯瓦尔巴特(+47)</option>
              <option value="SWZ">斯威士兰(+268)</option>
              <option value="SDN">苏丹(+249)</option>
              <option value="SUR">苏里南(+597)</option>
              <option value="SLB">所罗门群岛(+677)</option>
              <option value="SOM">索马里(+252)</option>
              <option value="TJK">塔吉克斯坦(+992)</option>
              <option value="THA">泰国(+66)</option>
              <option value="TZA">坦桑尼亚(+255)</option>
              <option value="TON">汤加(+676)</option>
              <option value="TCA">特克斯和凯科斯群岛(+1649)</option>
              <option value="TTO">特立尼达和多巴哥(+1868)</option>
              <option value="TUN">突尼斯(+216)</option>
              <option value="TUV">图瓦卢(+688)</option>
              <option value="TUR">土耳其(+90)</option>
              <option value="TKM">土库曼斯坦(+993)</option>
              <option value="TKL">托克劳(+690)</option>
              <option value="WLF">瓦利斯和富图纳群岛(+681)</option>
              <option value="VUT">瓦努阿图(+678)</option>
              <option value="GTM">危地马拉(+502)</option>
              <option value="VEN">委内瑞拉(+58)</option>
              <option value="BRN">文莱(+673)</option>
              <option value="UGA">乌干达(+256)</option>
              <option value="UKR">乌克兰(+380)</option>
              <option value="URY">乌拉圭(+598)</option>
              <option value="UZB">乌兹别克斯坦(+998)</option>
              <option value="ESP">西班牙(+34)</option>
              <option value="ESH">西撒哈拉(+212)</option>
              <option value="GRC">希腊(+30)</option>
              <option value="SGP">新加坡(+65)</option>
              <option value="NCL">新喀里多尼亚(+687)</option>
              <option value="NZL">新西兰(+64)</option>
              <option value="HUN">匈牙利(+36)</option>
              <option value="JAM">牙买加(+1876)</option>
              <option value="ARM">亚美尼亚(+374)</option>
              <option value="YEM">也门(+967)</option>
              <option value="IRQ">伊拉克(+964)</option>
              <option value="ISR">以色列(+972)</option>
              <option value="ITA">意大利(+39)</option>
              <option value="IND">印度(+91)</option>
              <option value="IDN">印度尼西亚(+62)</option>
              <option value="GBR">英国(+44)</option>
              <option value="VGB">英属维尔京群岛(+1284)</option>
              <option value="IOT">英属印度洋领地(+246)</option>
              <option value="JOR">约旦(+962)</option>
              <option value="VNM">越南(+84)</option>
              <option value="ZMB">赞比亚(+260)</option>
              <option value="TCD">乍得(+235)</option>
              <option value="GIB">直布罗陀(+350)</option>
              <option value="CHL">智利(+56)</option>
              <option value="CHN">中国大陆(+86)</option>
              <option value="HKG">中国香港(+852)</option>
              <option value="MAC">中国澳门(+853)</option>
              <option value="TWN">中国台湾(+886)</option>
              <option value="CAF">中非共和国(+236)</option>
            </select>
            <input class="tea-input" name="phoneNum" value />
          </div>
        </div>
        <div class="tea-form__item">
          <div class="tea-form__label is-required">
            <label>邮箱</label>
          </div>
          <div class="tea-form__controls">
            <input class="tea-input" value />
          </div>
        </div>
        <div class="tea-form__item">
          <div class="tea-form__label is-required">
            <label>是否允许微信接收通知</label>
          </div>
          <div class="tea-form__controls tea-form__controls--text">
            <label class="tea-form-check" name="1">
              <input readonly type="radio" class="tea-radio" checked />
              <span class="tea-form-check__label">是</span>
            </label>
            <label class="tea-form-check" name="0">
              <input readonly type="radio" class="tea-radio" />
              <span class="tea-form-check__label">否</span>
            </label>
          </div>
        </div>
      </div>
      <div style="padding-top: 20px; border-top: 1px solid rgb(221, 221, 221); margin-top: 20px;">
        <button class="tea-btn">完成</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    goback() {
      this.$router.push({ name: "NewUser" });
    }
  }
};
</script>

<style lang="scss" scoped>
.Cam {
  .top {
    height: 45px;
    line-height: 45px;
    margin-bottom: 20px;
    padding: 0 20px;
    background: #fff;
    .title-left {
      font-size: 18px;
      font-weight: bolder;
      margin-left: 20px;
    }
  }
  .container {
    width: 96%;
    min-height: 480px;
    margin: 10px auto 0;
    background: #fff;
    padding: 20px;
    .tea-btn {
      height: 30px;
      min-width: 24px;
      padding: 0 20px;
      background-color: #006eff;
      color: #fff;
      border: 1px solid #006eff;
      line-height: 30px;
      text-align: center;
      display: inline-block;
      cursor: pointer;
      outline: 0;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      text-decoration: none;
      font-size: 12px;
      vertical-align: middle;
      white-space: nowrap;
    }

    .tea-form {
      display: table;
      font-size: 12px;
      line-height: 1.5;
      .tea-form__item {
        display: table-row;
        .tea-form__label {
          display: table-cell;
          vertical-align: baseline;
          color: #888;
          padding-right: 100px;
          padding-top: 6px;
          padding-bottom: 6px;
          width: 1px;
          label {
            display: inline-block;
            white-space: nowrap;
            font-size: 12px;
            -webkit-transform: translateZ(0);
            transform: translateZ(0);
          }
          label:after {
            display: inline-block;
            content: "*";
            color: #e1504a;
            line-height: 1;
            position: absolute;
            margin: 5px 0 0 3px;
          }
        }
        .tea-form__controls {
          color: #000;
          word-break: break-word;
          padding-right: 24px;
          width: 100%;
          .tea-input {
            vertical-align: middle;
            width: 200px;
            display: inline-block;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            vertical-align: middle;
            height: 30px;
            padding-left: 10px;
            padding-right: 10px;
            font-size: 12px;
            border: 1px solid #ddd;
            border-radius: 0;
            color: #444;
            -webkit-transition: 0.2s ease-in-out;
            transition: 0.2s ease-in-out;
            -webkit-transition-property: color, background-color, border;
            transition-property: color, background-color, border;
          }
          .tea-textarea {
            padding-top: 5px;
            padding-bottom: 5px;
            resize: none;
            width: 200px;
            height: 100px;
            display: inline-block;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            vertical-align: middle;
            height: 30px;
            padding-left: 10px;
            padding-right: 10px;
            font-size: 12px;
            border: 1px solid #ddd;
            border-radius: 0;
            color: #444;
            -webkit-transition: 0.2s ease-in-out;
            transition: 0.2s ease-in-out;
            -webkit-transition-property: color, background-color, border;
            transition-property: color, background-color, border;
          }
        }
        .tea-form__controls--text {
          padding-top: 18px;
          .tea-select {
            display: inline-block;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            vertical-align: middle;
            height: 30px;
            font-size: 12px;
            border: 1px solid #ddd;
            border-radius: 0;
            -webkit-transition: 0.2s ease-in-out;
            transition: 0.2s ease-in-out;
            -webkit-transition-property: color, background-color, border;
            transition-property: color, background-color, border;
            color: #000;
            cursor: pointer;
            line-height: 30px;
            padding: 0 24px 0 10px;
            width: 200px;
            -webkit-appearance: none;
            -moz-appearance: none;
            -ms-appearance: none;
            appearance: none;
            .tea-form-check {
              position: relative;
              display: inline-block;
              vertical-align: middle;
              padding-left: 21px;
              margin-top: 0;
              margin-right: 18px;
              min-height: 16px;
            }
          }
        }
      }
    }
  }

  .cam_button {
    width: 96%;
    margin: 10px auto;
  }
  .cam-lt {
    float: left;
  }
  .head-container {
    float: right;
  }
  .cam_button {
    position: relative;
  }
  .suo {
    position: absolute;
    right: 0;
  }
}
</style>  

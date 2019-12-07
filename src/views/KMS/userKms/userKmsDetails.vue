<template>
  <div>
    <div class="projectDetailTit">
      <i class="el-icon-back" @click="returnList"></i>
      <span>{{projectDetail.KeyId}}</span>
    </div>
    <div class="projectDetailCon">
      <div class="projectDetailCenter">
        <div class="projectDetailOne">
          <h2>密钥信息</h2>
          <div class="detailList">
            <p><span>名称</span><span>{{keyList.Alias}}</span><i class="el-icon-edit" @click="changeNameHand"></i></p>
            <el-dialog class="changeNameModel" title="修改密钥名称" :visible.sync="dialogModel1" width="30%" :before-close="handleClose1">
              <div class="dialogModelCon newClear">
                <div class="newClear"><span class="dialogText">原名称</span><span>{{keyList.Alias}}</span></div>
                <div class="newClear"><span class="dialogText">新名称</span><span>
                    <el-input v-model="changeName" class="newName"></el-input>
                    <p class="tipP">最长可输入60个字符，不可为空，请使用字母、数字及字符“_”和“-”，首字符必须为字母或者数字，且不能用 KMS- 开头。</p>
                  </span></div>
              </div>
              <span slot="footer" class="dialog-footer">
                <el-button @click="dialogModel1 = false">取 消</el-button>
                <el-button type="primary" @click="changeNameSure">确 定</el-button>
              </span>
            </el-dialog>
            <p><span>ID</span><span>{{projectDetail.KeyId}}</span></p>
            <p><span>状态</span><span :style="keyList.KeyState=='Enabled'?'color:#000':'color:#ff9d00'">
                <!-- {{projectDetail.KeyState}} -->
                {{keyList.KeyState=="PendingDelete"?'于'+timestampToTime(projectDetail.DeletionDate)+'彻底删除':filterState(keyList.KeyState)}}
              </span>&nbsp;
              <a href="#" :style="keyList.KeyState=='Disabled' || keyList.KeyState=='PendingImport' || keyList.KeyState=='PendingDelete'?'display:none':'display:inline-block'" @click="startKms(keyList,$event)">禁用密钥</a>
              <a href="#" :style="keyList.KeyState=='Enabled' || keyList.KeyState=='PendingImport' || keyList.KeyState=='PendingDelete'?'display:none':'display:inline-block'" @click="startKms(keyList,$event)">启用密钥</a>
              <a href="#" :style="keyList.KeyState=='Enabled' || keyList.KeyState=='PendingImport' || keyList.KeyState=='Disabled'?'display:none':'display:inline-block'" @click="openDelete(keyList,$event)">取消删除</a>
            </p>
            <p><span>地区</span><span>{{projectDetail.address}}</span></p>
            <p><span>创建时间</span><span>{{projectDetail.CreateTime}}</span></p>
            <p><span>创建者</span><span>{{keyList.Owner}}</span></p>
            <p><span>轮换状态</span>

              <span :style="keyList.KeyRotationEnabled==true?'display:none':'{display:inline-block;color: #ff9d00 ;}'">已禁用</span>
              <span :style="projectDetail.KeyState=='待导入' || keyList.KeyState=='PendingDelete'?'display:none':'{display:inline-block;}'" v-if="keyList.KeyRotationEnabled">已启用</span>
              <span :style=" projectDetail.KeyState=='待导入'?'display:none':'display:inline-block'">每年自动轮换&nbsp;</span>
              <a href="#" v-if="!keyList.KeyRotationEnabled" :style=" projectDetail.KeyState=='待导入'?'display:none':'display:inline-block'" :class=" keyList.KeyState=='PendingDelete' || keyList.Origin == 'EXTERNAL'?'atclor':''" @click="startChange(keyList,$event)">启用轮换</a>
              <a href="#" v-if="keyList.KeyRotationEnabled" @click="startChange(keyList,$event)">禁用轮换</a>
            </p>
            <p><span>描述信息</span><span>{{keyList.Description}}</span><i class="el-icon-edit" @click="newDescription"></i></p>
            <el-dialog class="changeNameModel" title="修改密钥描述信息" :visible.sync="dialogModel2" width="30%" :before-close="handleClose2">
              <div class="dialogModelCon">
                <div class="newClear"><span>原描述信息</span><span>{{keyList.Description}}</span></div>
                <div class="newClear"><span>新描述信息</span><span>
                    <el-input type="textarea" v-model="descriptionNew" class="newDescription"></el-input>
                  </span></div>
              </div>
              <span slot="footer" class="dialog-footer">
                <el-button @click="dialogModel2 = false">取 消</el-button>
                <el-button type="primary" @click="changeDescriptionSure">确 定</el-button>
              </span>
            </el-dialog>
            <LstopChange :isShow="dialogModelChange" :content="doalogModelBox" @parentByClick="childrenShow" @startSure="startSure" @stopSure="stopSure" />
            <LstartKms :isShow="dialogModelKms" :content="doalogModelBox1" @parentByClick="childrenShow1" @startKmsSure="startKmsSure" @stopKmsSure="stopKmsSure" />
            <LopenDelete :isShow="dialogModelDelete" :content="doalogModelBox2" @parentByClick="childrenShow2" @openDeleteSure="openDeleteSure" @closeDeleteSure="closeDeleteSure" />
          </div>
        </div>
        <div class="projectDetailOne" v-if="keyList.Origin == 'EXTERNAL'|| ishowkms==false?keyStatus=true:keyStatus=false">
          <h2>密钥材料</h2>
          <div class="detailList">
            <p><span>密钥来源</span><span>{{projectDetail.Origin}}</span></p>
            <p v-if='keyList.KeyState=="PendingImport"?true:false'><span>密钥材料</span><span><a href="#" @click="dialogModel3=true">导入密钥材料</a></span></p>
            <div v-if='keyList.KeyState=="Enabled"||keyList.KeyState=="Disabled" ||keyList.KeyState=="PendingDelete"?true:false'>
              <p><span>密钥材料</span><span><a href="#" :class=" keyList.KeyState=='PendingDelete' || keyList.KeyState=='Disabled'?'atclor':''" @click="dialogModel3=true" >重新导入</a>&nbsp;&nbsp;&nbsp;<a href="#" :class=" keyList.KeyState=='PendingDelete'?'atclor':''" @click="dialogModel4=true">删除密钥材料</a></span></p>
              <p><span>过期时间</span><span><span style="color: #000;width: auto;">{{timestampToTime(keyList.ValidTo)}}</span></span></p>
            </div>
            <el-dialog class="changeNameModel" title="导入密钥材料" :visible.sync="dialogModel3" width="30%" :before-close="handleClose3">
              <div class="dialogModelConT">
                <div class="TopStepDownload" v-if="thisStepOne">
                  <div class="topStepOne newClear">
                    <p class="stepOne step"><span class="stepCir">1</span><span class="stepText">密钥参数下载</span></p>
                    <span class="rightArrow">></span>
                    <p class="step"><span class="stepCir">2</span><span class="stepText">密钥导入</span></p>
                    <span class="rightArrow">></span>
                    <p class="step"><span class="stepCir">3</span><span class="stepText">导入状态</span></p>
                  </div>
                  <div class="tipBlue">
                    温馨提示：密钥材料需要通过加密公钥加密后才可以导入，请选择一个用于加密密钥材料的算法，生成的密钥导入参数将在24小时后过期，请及时下载！
                  </div>
                  <div class="labelCheck newClear">
                    <div class="newClear"><span class="labelCheckText">算法类型</span><span>
                        <el-radio v-model="thisSuanType" label="RSA_2048"></el-radio>
                      </span></div>
                    <div class="newClear">
                      <span class="labelCheckText">加密算法</span>
                      <span>
                        <el-select class="selectSuan" v-model="thisAddSuan">
                          <el-option label="RSAES_PKCS1_V1_5" value="RSAES_PKCS1_V1_5"></el-option>
                          <el-option label="RSAES_OAEP_SHA_1" value="RSAES_OAEP_SHA_1"></el-option>
                          <el-option label="RSAES_OAEP_SHA_256" value="RSAES_OAEP_SHA_256"></el-option>
                        </el-select>
                        <el-button @click="downloadTxt1">下载</el-button>
                      </span>
                    </div>
                  </div>
                  <div class="botBtn">
                    <el-button @click="dialogModel3 = false">取 消</el-button>
                    <el-button type="primary" @click="nextStepOne">下一步</el-button>
                  </div>
                </div>
                <div class="TopStepDownload" v-if="thisStepTwo">
                  <div class="topStepOne newClear">
                    <p class="stepTwo step"><span class="stepCir"><i class="el-icon-check"></i></span><span class="stepText">密钥参数下载</span></p>
                    <span class="rightArrow">></span>
                    <p class="stepOne step"><span class="stepCir">2</span><span class="stepText">密钥导入</span></p>
                    <span class="rightArrow">></span>
                    <p class="step"><span class="stepCir">3</span><span class="stepText">导入状态</span></p>
                  </div>
                  <div class="labelCheckTwo newClear">
                    <div class="newClear">
                      <span class="labelCheckText">加密密钥材料</span>
                      <span><input class="choseFileText" type="text" v-model="PlaintextRead" placeholder="还未选择文件" readonly /><a href="#" class="chooseFile"><span>选择文件</span><input type="file" @change="PlaintextReadHande" ref="inputer"></a></span>
                    </div>
                    <div class="newClear">
                      <span class="labelCheckText">导入令牌</span>
                      <span><input class="choseFileText" v-model="exportRead" type="text" placeholder="还未选择文件" readonly /><a href="#" class="chooseFile"><span>选择文件</span><input type="file" @change="exportChange"></a></span>
                    </div>
                    <div class="newClear">
                      <span class="labelCheckText">密钥材料过期时间</span>
                      <span>
                        <el-select class="selectSuanTwo" v-model="outTimeSet" @change="timeOutChange">
                          <el-option label="永不过期" value="forver"></el-option>
                          <el-option label="设置过期时间" value="setTime"></el-option>
                        </el-select>
                        <el-date-picker v-if="isSettimeOut" v-model="selectTime" type="date" placeholder="选择日期" class="setTimeOutTime">
                        </el-date-picker><br />
                        <span class="tipStep">若您已订阅产品信息，您将在密钥材料过期前三天收到告警信息</span>
                      </span>
                    </div>
                  </div>
                  <div class="botBtn">
                    <el-button type="primary" @click="prevOne">上一步</el-button>
                    <el-button @click="nextStepTwo" :disabled="PlaintextRead==''||exportRead==''?true:false">导入密钥</el-button>
                  </div>
                </div>
                <div class="TopStepDownload" v-if="thisStepThree">
                  <div class="topStepOne newClear">
                    <p class="stepTwo step"><span class="stepCir"><i class="el-icon-check"></i></span><span class="stepText">密钥参数下载</span></p>
                    <span class="rightArrow">></span>
                    <p class="stepTwo step"><span class="stepCir"><i class="el-icon-check"></i></span><span class="stepText">密钥导入</span></p>
                    <span class="rightArrow">></span>
                    <p class="stepOne step"><span class="stepCir">3</span><span class="stepText">导入状态</span></p>
                  </div>
                  <div class="labelCheckTwo newClear">
                    <p v-if="ishowkms" style="text-align: center;padding: 50px;"><i class="el-icon-circle-check iconys"></i>秘钥成功导入</p>
                    <p v-if="!ishowkms" style="text-align: center;padding: 50px;"><i class="el-icon-circle-close iconys"></i>秘钥导入失败，请返回上一步重试！</p>
                  </div>
                  <div class="botBtn">
                    <el-button type="primary" @click="prevTwo">上一步</el-button>
                    <el-button @click="dialogModel3=false" :disabled="!ishowkms==false?false:true">确定</el-button>
                  </div>
                </div>
              </div>
            </el-dialog>

            <el-dialog class="changeNameModel" title="删除密钥材料" :visible.sync="dialogModel4" width="30%" :before-close="handleClose4">
              <div class="dialogModelConT">
                <div class="TopStepDownload" v-if="thisStepOne">

                  <div class="tipBlue">
                    温馨提示：密钥材料将从KMS中删除，请确保您已经保管该密钥材料副本！
                  </div>
                  <div class="labelCheck newClear">
                    <div class="newClear">确定删除该密钥材料么？</div>

                  </div>
                  <div class="botBtn">
                    <el-button @click="dialogModel4 = false">取 消</el-button>
                    <el-button type="primary" @click="deletekms">确定</el-button>
                  </div>
                </div>
              </div>
            </el-dialog>

          </div>
        </div>
        <div class="projectDetailThree newClear">
          <h2>在线工具<i class="el-icon-info"></i></h2>
          <div class="btnBottom">
            <button @click="changeBtnEncrypt(1)" :class="thisType=='1'?'bthBorderColor':''" :disabled='projectDetail.KeyState=="已禁用"||projectDetail.KeyState=="PendingDelete"?true:false'>加密</button>
            <button @click="changeBtnEncrypt(2)" :class="thisType=='2'?'bthBorderColor':''" :disabled='projectDetail.KeyState=="已禁用"||projectDetail.KeyState=="PendingDelete"?true:false'>解密</button>
          </div>
          <div class="EncryptText newClear">
            <div v-if="thisType=='1'||thisType=='0'?true:false">
              <el-input :disabled='projectDetail.KeyState=="已禁用"||projectDetail.KeyState=="PendingDelete"?true:false' class="textareaIpt" v-model="Plaintext" type="textarea" placeholder="请输入明文" @input='changeTextarea1'></el-input>
              <el-button @click="actionPlain" :disabled="disableTextarea" type="primary">执行</el-button>
            </div>
            <div v-if="thisType=='2'||thisType=='3'?true:false">
              <el-input class="textareaIpt" v-model="Ciphertext" type="textarea" placeholder="请输入密文" @input='changeTextarea1'></el-input>
              <el-button @click="actionCipher" :disabled="disableTextarea" type="primary">执行</el-button>
            </div>
            <div>
              <el-input class="textareaIpt" :disabled="true" type="textarea" v-model="downLoadText"></el-input>
              <el-button :disabled="downLoadText==''?true:false" type="primary" @click="downloadTxt">下载</el-button>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import LstopChange from './LstopChange'
import LstartKms from './LstartKms'
import LopenDelete from './LopenDelete'
import { Des_KMS, UP_NAME, UP_DESC, Encrypt, Decrypt, GET_CMK, ImportKey,DEL_KMS } from "@/constants";
export default {
  data() {
    return {
      projectDetail: {},
      createUser: "",
      discription: "",
      dialogModel1: false,//修改名称模态框
      dialogModel2: false,//修改描述模态框
      dialogModel3: false,//导入密钥材料模态框
      dialogModel4: false,//导入密钥材料模态框
      changeName: '',//新的名称
      descriptionNew: "",//新的描述
      thisType: 1,
      Plaintext: '',//请输入明文
      Ciphertext: "",//请输入密文
      disableTextarea: true,//解密加密第二框
      downLoadText: '',//'执行加解密之后的下载框'
      downLoadText1: '',//'执行加解密之后的下载框'
      downLoadText2: '',//'执行加解密之后的下载框'
      thisSuanType: 'RSA_2048',//算法类型
      thisAddSuan: 'RSAES_PKCS1_V1_5',//加密算法
      thisStepOne: true,//第一步
      thisStepTwo: false,//第二步
      thisStepThree: false,//第三步
      selectTime: '0',//选择过期时间
      outTimeSet: "forver",//绑定过期时间
      isSettimeOut: false,//是否设置过期时间
      PlaintextRead: "",//密钥材料
      exportRead: "",//导入令牌
      keyList: [],
      keyStatus: true,
      GetParameters: '',
      doalogModelBox: [],//启用轮换内容框
      doalogModelBox1: [],//启用密钥内容框
      doalogModelBox2: [],//计划删除框
      dialogModelChange: false,//是否启用轮换弹框
      dialogModelKms: false,//是否启用密钥弹框
      dialogModelDelete: false,//是否计划删除
      dialogModelOpenDelete: false,//计划删除如果是已启用时候的弹框
      ishowkms: true,//密钥材料显示
      EncryptedKeyMaterial1: '',//加密秘钥材料参数
      ImportToken1: '',//导入令牌参数

    }
  },
  components: {
    LstopChange: LstopChange,
    LstartKms: LstartKms,
    LopenDelete: LopenDelete
  },
  created() {
    this.GetList();
  },
  methods: {
    GetList() {
      this.projectDetail = JSON.parse(sessionStorage.getItem("projectId"));
      this.projectDetail.KeyState == "已禁用" || this.projectDetail.KeyState == "PendingDelete" ? this.thisType = "0" : 3
      // console.log(this.projectDetail)
      let params = {
        Version: '2019-01-18',
        Region: 'ap-taipei',
        KeyId: this.projectDetail.KeyId
      };
      this.axios.post(Des_KMS, params).then(res => {
        this.keyList = res.Response.KeyMetadata;
      });
    },
    //修改名称关闭按钮
    handleClose1() {
      this.dialogModel1 = false;
    },
    //修改描述关闭按钮
    handleClose2() {
      this.dialogModel2 = false;
    },
    //导入密钥材料关闭按钮
    handleClose3() {
      this.dialogModel3 = false;
    },
    //删除密钥材料
    handleClose4() {
      this.dialogModel4 = false;
    },
    //修改名称按钮
    changeNameHand() {
      this.dialogModel1 = true;
      this.changeName = this.keyList.Alias
    },
    //修改描述信息按钮
    newDescription() {
      this.dialogModel2 = true;
      this.descriptionNew = this.keyList.Description;
    },
    //禁用密钥确定按钮
    stopKmsSure(sureShow) {
      this.dialogModelKms = sureShow
    },
    //启用轮换
    startChange(scopeRow, e) {
      this.dialogModelChange = true;
      let params = [scopeRow.Alias, scopeRow.KeyId, e.target.innerHTML]
      this.doalogModelBox = params;
    },
    //是否启动密钥服务
    startKms(scopeRow, e) {
      this.dialogModelKms = true;
      let params = [scopeRow.Alias, scopeRow.KeyId, e.target.innerHTML]
      this.doalogModelBox1 = params;
    },
    //是否计划删除
    openDelete(scopeRow, e) {

      if (scopeRow.KeyState == "Enabled") {
        this.dialogModelOpenDelete = true;
      } else {
        this.dialogModelDelete = true;
        let params = [scopeRow.Alias, '于' + this.timestampToTime(scopeRow.DeletionDate) + '彻底删除', e.target.innerHTML, scopeRow.KeyId]
        this.doalogModelBox2 = params;
      }
    },
    //轮换弹框消失
    childrenShow(trueOrFalse) {
      this.dialogModelChange = trueOrFalse
    },
    //启动轮换确定按钮
    startSure(sureShow) {
      this.dialogModelChange = sureShow[0]
    },
    //禁用轮换确定按钮
    stopSure(sureShow) {
      this.dialogModelChange = sureShow
    },
    //轮换弹框消失
    childrenShow1(trueOrFalse) {
      this.dialogModelKms = trueOrFalse
    },
    //启用密钥确定按钮
    startKmsSure(sureShow) {
      this.dialogModelKms = sureShow
    },
    //禁用密钥确定按钮
    stopKmsSure(sureShow) {
      this.dialogModelKms = sureShow
    },
    //计划删除弹框消失
    childrenShow2(trueOrFalse) {
      this.dialogModelDelete = trueOrFalse
    },
    //计划删除确定按钮
    openDeleteSure(deleteShow) {
      this.dialogModelDelete = deleteShow[0]
    },
    //取消删除确定按钮
    closeDeleteSure(deleteShow) {
      this.dialogModelDelete = deleteShow
    },
    //修改密钥名称确定按钮
    changeNameSure() {
      let params = {
        Version: '2019-01-18',
        Region: 'ap-taipei',
        Alias: this.changeName,
        KeyId: this.projectDetail.KeyId
      };
      this.axios.post(UP_NAME, params).then(res => {
        this.keyList.Alias = this.changeName;
        this.dialogModel1 = false;
      })
    },
    //修改密钥描述确定按钮
    changeDescriptionSure() {
      let params = {
        Version: '2019-01-18',
        Region: 'ap-taipei',
        Description: this.descriptionNew,
        KeyId: this.projectDetail.KeyId
      };
      this.axios.post(UP_DESC, params).then(res => {
        this.keyList.Description = this.descriptionNew;
        this.dialogModel2 = false;
      })
    },
    //加密解密按钮
    changeBtnEncrypt(thisType) {
      this.thisType = thisType;
    },
    //明文执行按钮
    actionPlain() {
      let params = {
        Action: "Encrypt",
        Version: '2019-01-18',
        Region: 'ap-taipei',
        Plaintext: this.Plaintext,
        KeyId: this.projectDetail.KeyId
      };
      this.axios.post(Encrypt, params).then(res => {
        // console.log(res.Response.Error.Message);
        if (res.Response.Error !== undefined) {
          this.$message({
            showClose: true,
            message: res.Response.Error.Message,
            type: 'error'
          });
        }
        this.downLoadText = res.Response.CiphertextBlob
      })
    },
    //密文执行按钮
    actionCipher() {
      let params = {
        Action: "Decrypt",
        Version: '2019-01-18',
        Region: 'ap-taipei',
        CiphertextBlob: this.Ciphertext
      };
      this.axios.post(Decrypt, params).then(res => {
        // console.log(res)
        if (res.Response.Error !== undefined) {
          this.$message({
            showClose: true,
            message: res.Response.Error.Message,
            type: 'error'
          });
        }
        this.downLoadText = res.Response.Plaintext
      })
    },
    //返回列表页
    returnList() {
      this.$router.push({
        name: "userKms"
      })
    },
    //监测输入框是否有内容
    changeTextarea1(e) {
      if (e == '') {
        this.disableTextarea = true;
      } else {
        this.disableTextarea = false;
      }
    },
    //下载按钮
    downloadTxt() {
      this.exportRaw(this.projectDetail.KeyId + '.txt', this.downLoadText)
    },

    //密钥参数下载
    downloadTxt1() {
      let params = {
        Version: '2019-01-18',
        Region: 'ap-taipei',
        KeyId: this.projectDetail.KeyId,
        WrappingAlgorithm: this.thisAddSuan,
        WrappingKeySpec: this.thisSuanType
      };
      //获取导入主密钥（CMK）材料的参数
      this.axios.post(GET_CMK, params).then(res => {
        this.GetParameters = res.Response
        this.downLoadText1 = this.GetParameters.ImportToken
        this.downLoadText2 = this.GetParameters.PublicKey
        this.exportRaw('ImportToken' + '.txt', this.downLoadText1)
        this.exportRaw('public_key' + '.base64', this.downLoadText2)
        var README = ''
        README += '算法类型：' + this.thisSuanType + '\n' +
          '加密算法：' + this.thisAddSuan + '\n' +
          '加密公钥文件：public_key' + '\n' +
          '导入令牌文件：ImportToken' + '\n' +
          '密钥导入材料过期时间：' + this.timestampToTime(this.GetParameters.ParametersValidTo)
        this.exportRaw('README' + '.txt', README)
      })

    },
     //第二步的下一步按钮\导入密钥按钮
    nextStepTwo() {
      this.thisStepOne = false;
      this.thisStepTwo = false;
      let params = {
        Version: '2019-01-18',
        Region: 'ap-taipei',
        EncryptedKeyMaterial: sessionStorage.getItem("EncryptedKeyMaterial1"),
        ImportToken: sessionStorage.getItem("ImportToken1"),
        KeyId: this.projectDetail.KeyId,
        ValidTo:this.selectTime
      };

      if (this.selectTime == '0') {
        params['ValidTo'] = '0'
      } else {
        params['ValidTo'] = Date.parse(moment(this.selectTime).format('YYYY-MM-DD')) / 1000
      }
      this.axios.post(ImportKey, params).then(res => {
        if (res.Response.Error !== undefined) {
          this.$message({
            showClose: true,
            message: res.Response.Error.Message,
            type: 'error'
          });
           this.ishowkms = false
        }else{
          this.ishowkms = true
          this.keyStatus = true
          this.GetList();
        }
      })
      this.thisStepThree = true;
    },
    //下载文件函数
    fakeClick(obj) {
      var ev = document.createEvent("MouseEvents");
      ev.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      obj.dispatchEvent(ev);
    },
    //下载文件函数
    exportRaw(name, data) {
      var urlObject = window.URL || window.webkitURL || window;
      var export_blob = new Blob([data]);
      var save_link = document.createElementNS("http://www.w3.org/1999/xhtml", "a")
      save_link.href = urlObject.createObjectURL(export_blob);
      save_link.download = name;
      this.fakeClick(save_link);
    },
    //第一步的下一步按钮 获取导入主密钥（CMK）材料的参数
    nextStepOne() {
      this.thisStepOne = false;
      this.thisStepThree = false;
      this.thisStepTwo = true;
    },
    //第二步的上一步按钮
    prevOne() {
      this.thisStepOne = true;
      this.thisStepTwo = false;
      this.thisStepThree = false;
    },
    //第三步的上一步按钮
    prevTwo() {
      this.thisStepOne = false;
      this.thisStepTwo = true;
      this.thisStepThree = false;
    },
    //监测选择设置过期时间变化
    timeOutChange() {
      if (this.outTimeSet == 'setTime') {
        this.isSettimeOut = true;
        this.selectTime = ''
      } else {
        this.isSettimeOut = false;
        this.selectTime = '0'
      }
    },
    // 删除秘钥材料
    deletekms() {
       let params = {
        Version: '2019-01-18',
        Region: 'ap-taipei',
        KeyId: this.projectDetail.KeyId,
      };
      this.axios.post(DEL_KMS, params).then(res => {
        // console.log(res)
        if (res.Response.Error !== undefined) {
          this.$message({
            showClose: true,
            message: res.Response.Error.Message,
            type: 'error'
          });
        }
        this.dialogModel4 = false;
        this.GetList();
      })
    },
    //加密密钥材料change
    PlaintextReadHande(e) {
      this.PlaintextRead = e.target.files[0].name;
      const selectedFile = e.target.files[0];
      // 读取文件名
      const name = selectedFile.name
      // 读取文件大小
      const size = selectedFile.size
      // FileReader对象，h5提供的异步api，可以读取文件中的数据。
      const reader = new FileReader()
      // readAsText是个异步操作，只有等到onload时才能显示数据。
      reader.readAsText(selectedFile)
      reader.onload = function () {
        //当读取完成后回调这个函数,然后此时文件的内容存储到了result中,直接操作即可
        this.EncryptedKeyMaterial1 = this.result
        sessionStorage.setItem("EncryptedKeyMaterial1", this.result)
        console.log(this.EncryptedKeyMaterial1)
      }
    },

    //导入令牌change
    exportChange(e) {
      this.exportRead = e.target.files[0].name;
      const selectedFile = e.target.files[0]
      const reader = new FileReader()
      // 文件内容载入完毕之后的回调。
      reader.onload = function (e) {
        this.ImportToken1 = e.target.result
        sessionStorage.setItem("ImportToken1", e.target.result)
      }
      reader.readAsText(selectedFile)
    },
    //时间
    timestampToTime(timestamp) {
      if (timestamp == '0') {
          return '不过期'
        } else {
          let date = new Date(timestamp * 1000);
          let y = date.getFullYear();
          let MM = date.getMonth() + 1;
          MM = MM < 10 ? ('0' + MM) : MM;
          let d = date.getDate();
          d = d < 10 ? ('0' + d) : d;
          let h = date.getHours();
          h = h < 10 ? ('0' + h) : h;
          let m = date.getMinutes();
          m = m < 10 ? ('0' + m) : m;
          let s = date.getSeconds();
          s = s < 10 ? ('0' + s) : s;
          return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s;
        }
      
    },
    //状态处理
    filterState(state) {
      if (state == 'Enabled') {
        state = '已启用'
      } else if (state == 'PendingImport') {
        state = '待导入'
      } else if (state == 'Disabled') {
        state = '已禁用'
      }
      return state;
    }
  }
}
</script>
<style lang="scss">
.newClear {
  display: block;
  content: "";
  clear: both;
}
.projectDetailTit {
  width: 100%;
  height: 50px;
  background-color: #fff;
  border-bottom: 1px solid #ddd;
  padding: 0 20px;
  line-height: 50px;
  i {
    color: #006eff;
    font-size: 18px;
    font-weight: 600;
  }
  span {
    font-size: 16px;
    font-weight: 600;
    margin-left: 20px;
  }
}
.projectDetailCon {
  width: 100%;
  padding: 20px;
  .projectDetailCenter {
    width: 100%;
    min-height: 200px;
    border: 1px solid #ddd;
    background-color: #fff;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    padding: 20px;
    h2 {
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 20px;
    }
    .detailList {
      p {
        margin-bottom: 20px;
        span:nth-child(1) {
          font-size: 12px;
          color: #888;
          display: inline-block;
          width: 70px;
        }
        span:nth-child(2) {
          font-size: 12px;
          color: #000;
        }
        i.el-icon-edit {
          margin-left: 6px;
        }
      }
    }
    .projectDetailOne {
      margin-bottom: 12px;
      border-bottom: 1px solid #ddd;
    }
    .projectDetailThree {
      padding-bottom: 20px;
      button {
        width: 66px;
        height: 30px;
        border-radius: 0;
        border: 1px solid #ddd;
        outline: none;
        //background-color:#fff;
        line-height: 30px;
        padding: 0;
        text-align: center;
      }
      .bthBorderColor {
        border: 1px solid #006eff;
        color: #006eff;
      }
      .EncryptText {
        > div {
          float: left;
          margin-right: 30px;
          text-align: right;
          width: 330px;
          textarea {
            width: 330px;
            height: 100px;
            border-radius: 0;
            resize: none;
          }
        }
        .textareaIpt {
          width: 330px;
          height: 100px;
          margin-bottom: 20px;
          margin-top: 20px;
        }
      }
    }
    .btnBottom {
      button {
        background-color: #fff;
      }
    }
  }
}
.dialogModelCon {
  div {
    margin-bottom: 20px;
    width: 100%;
    span:nth-child(1).dialogText {
      font-size: 12px;
      color: #888;
      display: inline-block;
      width: 80px;
      float: left;
    }
    span:nth-child(2) {
      font-size: 12px;
      color: #888;
      float: left;
      width: calc(100% - 80px);
      .newName {
        width: 200px;
        height: 30px;
        input {
          width: 200px;
          height: 30px;
          border-radius: 0;
        }
      }
      .newDescription {
        textarea {
          width: 330px;
          height: 100px;
          resize: none;
          border-radius: 0;
        }
      }
      .tipP {
        color: #888;
        font-size: 12px;
      }
    }
  }
}
.changeNameModel {
  .el-dialog__title {
    font-size: 14px;
    font-weight: 600;
  }
}
.dialogModelConT {
  button {
    width: 70px;
    height: 30px;
    border-radius: 0;
    padding: 0;
    line-height: 30px;
  }
}
.TopStepDownload {
  .topStepOne {
    width: 100%;
    border-bottom: 1px solid #ddd;
    margin-bottom: 20px;
    p.step {
      float: left;
      span:nth-child(1).stepCir {
        width: 26px;
        height: 26px;
        display: inline-block;
        border-radius: 100%;
        background-color: #fff;
        margin-right: 12px;
        color: #999;
        text-align: center;
        line-height: 26px;
        float: left;
        border: 1px solid #999;
      }
      span:nth-child(2).stepText {
        color: #999;
        font-size: 12px;
        width: 78px;
      }
    }
    p.stepOne {
      span:nth-child(1).stepCir {
        background-color: #0068f2;
        color: #fff;
        border: 1px solid #0068f2;
      }
      span:nth-child(2).stepText {
        color: #000;
        font-weight: bold;
      }
    }
    p.stepTwo {
      span:nth-child(1).stepCir {
        background-color: #fff;
        color: #0068f2;
        border: 1px solid #0068f2;
      }
      span:nth-child(2).stepText {
        color: #000;
      }
    }
    span.rightArrow {
      font-size: 20px !important;
      color: #999;
      float: left;
      margin: 0 3.6%;
      width: auto !important;
    }
  }
  .tipBlue {
    font-size: 12px;
    margin-bottom: 20px;
    line-height: inherit;
    padding: 10px 30px 10px 20px;
    color: #003b80;
    border: 1px solid #97c7ff;
    background-color: #e5f0ff;
  }
  .labelCheck {
    div {
      margin-bottom: 12px;
      span:nth-child(1).labelCheckText {
        display: inline-block;
        width: 70px;
        color: #999;
        font-size: 12px;
      }
      .selectSuan {
        width: 170px;
        height: 30px;
        div {
          width: 170px;
          height: 30px;
          input {
            width: 170px;
            height: 30px;
            border-radius: 0;
          }
        }
      }
      button {
        height: 30px;
        border-radius: 0;
        display: inline-block;
        padding: 0;
        line-height: 30px;
        width: 70px;
        margin-left: 20px;
      }
    }
  }
  .labelCheckTwo {
    div {
      margin-bottom: 12px;
      span:nth-child(1).labelCheckText {
        display: inline-block;
        width: 115px;
        color: #999;
        font-size: 12px;
      }
      .choseFileText {
        height: 30px;
        line-height: normal;
        width: 180px;
        border: 1px solid #ddd;
        outline: none;
        background: #f2f2f2;
        text-indent: 12px;
        font-size: 12px;
      }
      .chooseFile {
        text-decoration: none;
        color: #000;
        border: solid 1px #ddd;
        width: 70px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        display: inline-block;
        overflow: hidden;
        position: relative;
        top: 9px;
        margin-left: 10px;
        font-size: 12px;
        input {
          opacity: 0;
          filter: alpha(opacity=0);
          position: absolute;
          top: 0;
          right: 0;
          cursor: pointer;
        }
      }
      .selectSuanTwo {
        width: 100px;
        height: 30px;
        div {
          width: 100px;
          height: 30px;
          input {
            width: 100px;
            height: 30px;
            border-radius: 0;
            font-size: 12px;
          }
        }
      }
      .tipStep {
        padding-left: 115px;
        font-size: 12px;
        color: #999;
        display: inline-block;
        margin: 12px 0;
      }
    }
    .setTimeOutTime {
      width: 120px;
      height: 30px;
      margin-left: 12px;
      input {
        width: 120px;
        height: 30px;
        border-radius: 0;
      }
      .el-input__icon {
        line-height: 32px;
      }
    }
  }
  .botBtn {
    padding-left: 200px;
  }
}
.atclor {
  color: #bbb;
  cursor: default;
}
.atclor:hover {
  color: #bbb;
  cursor: default;
}
.iconys{
    font-size: 24px;
    vertical-align: bottom !important;
    margin-right: 4px;
}
</style>
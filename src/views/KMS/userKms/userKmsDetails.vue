<template>
  <div>
    <div class="projectDetailTit">
      <i class="el-icon-back" @click="returnList"></i>
      <span>{{projectDetail.KeyId}}</span>
    </div>
    <div class="projectDetailCon" v-loading='loading'>
      <div class="projectDetailCenter">
        <div class="projectDetailOne">
          <h2>{{$t('KMS.total.kmsInfo')}}</h2>
          <div class="detailList">
            <p><span>{{$t('KMS.total.name')}}</span><span>{{keyList.Alias}}</span><i class="el-icon-edit"
                @click="changeNameHand"></i></p>
            <el-dialog class="changeNameModel" :title="$t('KMS.total.changeKmsName')" :visible.sync="dialogModel1"
              width="40%" :before-close="handleClose1">
              <div class="dialogModelCon newClear">
                <div class="newClear"><span
                    class="dialogText">{{$t('KMS.total.oldName')}}</span><span>{{keyList.Alias}}</span></div>
                <div class="newClear"><span class="dialogText">{{$t('KMS.total.newName')}}</span><span>
                    <el-input v-model="changeName" class="newName"></el-input>
                    <p class="tipP">{{$t('KMS.total.tip4')}}</p>
                  </span></div>
              </div>
              <span slot="footer" class="dialog-footer">
                <el-button @click="dialogModel1 = false">{{$t('KMS.total.modelClose')}}</el-button>
                <el-button type="primary" @click="changeNameSure">{{$t('KMS.total.modelSure')}}</el-button>
              </span>
            </el-dialog>
            <p><span>ID</span><span>{{projectDetail.KeyId}}</span></p>
            <p><span>{{$t('KMS.total.status')}}</span><span
                :style="keyList.KeyState=='Enabled'?'color:#000':'color:#ff9d00'">
                <!-- {{projectDetail.KeyState}} -->
                {{keyList.KeyState=="PendingDelete"?$t('KMS.total.yu')+timestampToTime(projectDetail.DeletionDate)+$t('KMS.total.allDelete'):filterState(keyList.KeyState)}}
              </span>&nbsp;
              <a href="#"
                :style="keyList.KeyState=='Disabled' || keyList.KeyState=='PendingImport' || keyList.KeyState=='PendingDelete'?'display:none':'display:inline-block'"
                @click="startKms(keyList,$event)">{{$t('KMS.total.stopKms')}}</a>
              <a href="#"
                :style="keyList.KeyState=='Enabled' || keyList.KeyState=='PendingImport' || keyList.KeyState=='PendingDelete'?'display:none':'display:inline-block'"
                @click="startKms(keyList,$event)">{{$t('KMS.total.startKms')}}</a>
              <a href="#"
                :style="keyList.KeyState=='Enabled' || keyList.KeyState=='PendingImport' || keyList.KeyState=='Disabled'?'display:none':'display:inline-block'"
                @click="openDelete(keyList,$event)">{{$t('KMS.total.closeDelete')}}</a>
            </p>
            <p><span>{{$t('KMS.total.address')}}</span><span>{{projectDetail.address}}</span></p>
            <p><span>{{$t('KMS.total.createTime')}}</span><span>{{projectDetail.CreateTime}}</span></p>
            <p><span>{{$t('KMS.total.createUser')}}</span><span>{{keyList.Owner}}</span></p>
            <p><span>{{$t('KMS.total.changeStatus')}}</span>

              <span
                :style="keyList.KeyRotationEnabled==true?'display:none':'{display:inline-block;color: #ff9d00 ;}'">{{$t('KMS.total.alredayStop')}}</span>
              <span
                :style="projectDetail.KeyState==$t('KMS.total.willImport') || keyList.KeyState=='PendingDelete'?'display:none':'{display:inline-block;}'"
                v-if="keyList.KeyRotationEnabled">{{$t('KMS.total.alredayStart')}}</span>
              <span
                :style=" projectDetail.KeyState==$t('KMS.total.willImport')?'display:none':'display:inline-block'">{{$t('KMS.total.autoChange')}}&nbsp;</span>
              <a href="#" v-if="!keyList.KeyRotationEnabled"
                :style=" projectDetail.KeyState==$t('KMS.total.willImport')?'display:none':'display:inline-block'"
                :class=" keyList.KeyState=='PendingDelete' || keyList.Origin == 'EXTERNAL'?'atclor':''"
                @click="startChange(keyList,$event)">{{$t('KMS.total.startChange')}}</a>
              <a href="#" v-if="keyList.KeyRotationEnabled"
                @click="startChange(keyList,$event)">{{$t('KMS.total.stopChange')}}</a>
            </p>
            <p><span>{{$t('KMS.total.xclhsj')}}</span><span>{{timestampToTime(keyList.NextRotateTime)}}</span></p>
            <p><span>{{$t('KMS.total.descriptInfo')}}</span><span>{{keyList.Description}}</span><i class="el-icon-edit"
                @click="newDescription"></i></p>
            <el-dialog class="changeNameModel" :title="$t('KMS.total.changeKmsInfo')" :visible.sync="dialogModel2"
              width="40%" :before-close="handleClose2">
              <div class="dialogModelCon">
                <div class="newClear"><span>{{$t('KMS.total.oldDescript')}}</span><span>{{keyList.Description}}</span>
                </div>
                <div class="newClear"><span>{{$t('KMS.total.newDescript')}}</span><span>
                    <el-input type="textarea" v-model="descriptionNew" class="newDescription"></el-input>
                  </span></div>
              </div>
              <span slot="footer" class="dialog-footer">
                <el-button @click="dialogModel2 = false">{{$t('KMS.total.modelClose')}}</el-button>
                <el-button type="primary" @click="changeDescriptionSure">{{$t('KMS.total.modelSure')}}</el-button>
              </span>
            </el-dialog>
            <LstopChange :isShow="dialogModelChange" :content="doalogModelBox" @parentByClick="childrenShow"
              @startSure="startSure" @stopSure="stopSure" />
            <LstartKms :isShow="dialogModelKms" :content="doalogModelBox1" @parentByClick="childrenShow1"
              @startKmsSure="startKmsSure" @stopKmsSure="stopKmsSure" />
            <LopenDelete :isShow="dialogModelDelete" :content="doalogModelBox2" @parentByClick="childrenShow2"
              @openDeleteSure="openDeleteSure" @closeDeleteSure="closeDeleteSure" />
          </div>
        </div>
        <div v-if="projectDetail.Origin!=='KMS'">
          <div class="projectDetailOne"
            v-if="keyList.Origin == 'EXTERNAL'|| ishowkms==false?keyStatus=true:keyStatus=false">
            <h2>{{$t('KMS.total.kmsMaterial')}}</h2>
            <div class="detailList">
              <p><span>{{$t('KMS.total.kmsOrigin')}}</span><span>{{projectDetail.Origin}}</span></p>
              <p v-if='keyList.KeyState=="PendingImport"?true:false'>
                <span>{{$t('KMS.total.kmsMaterial')}}</span><span><a href="#"
                    @click="dialogModel3=true">{{$t('KMS.total.importKmsM')}}</a></span></p>
              <div
                v-if='keyList.KeyState=="Enabled"||keyList.KeyState=="Disabled" ||keyList.KeyState=="PendingDelete"?true:false'>
                <p><span>{{$t('KMS.total.kmsMaterial')}}</span><span><a href="#"
                      :class=" keyList.KeyState=='PendingDelete' || keyList.KeyState=='Disabled'?'atclor':''"
                      @click="dialogModel3=true">{{$t('KMS.total.reImport')}}</a>&nbsp;&nbsp;&nbsp;<a href="#"
                      :class=" keyList.KeyState=='PendingDelete'?'atclor':''"
                      @click="dialogModel4=true">{{$t('KMS.total.deleteKmsM')}}</a></span></p>
                <p><span>{{$t('KMS.total.outTime')}}</span><span><span
                      style="color: #000;width: auto;">{{timestampToTime(keyList.ValidTo)}}</span></span></p>
              </div>
              <el-dialog class="changeNameModel" :title="$t('KMS.total.importKmsM')" :visible.sync="dialogModel3"
                width="40%" :before-close="handleClose3">
                <div class="dialogModelConT">
                  <div class="TopStepDownload" v-if="thisStepOne">
                    <div class="topStepOne newClear">
                      <p class="stepOne step"><span class="stepCir">1</span><span
                          class="stepText">{{$t('KMS.total.kmsParamsDownload')}}</span></p>
                      <span class="rightArrow">></span>
                      <p class="step"><span class="stepCir">2</span><span
                          class="stepText">{{$t('KMS.total.kmsImport')}}</span></p>
                      <span class="rightArrow">></span>
                      <p class="step"><span class="stepCir">3</span><span
                          class="stepText">{{$t('KMS.total.importStatus')}}</span></p>
                    </div>
                    <div class="tipBlue">
                      {{$t('KMS.total.tip5')}}
                    </div>
                    <div class="labelCheck newClear">
                      <div class="newClear"><span class="labelCheckText">{{$t('KMS.total.algorithmType')}}</span><span>
                          <el-radio v-model="thisSuanType" label="RSA_2048"></el-radio>
                        </span></div>
                      <div class="newClear">
                        <span class="labelCheckText">{{$t('KMS.total.EncryptionAlgorithm')}}</span>
                        <span>
                          <el-select class="selectSuan" v-model="thisAddSuan">
                            <el-option label="RSAES_PKCS1_V1_5" value="RSAES_PKCS1_V1_5"></el-option>
                            <el-option label="RSAES_OAEP_SHA_1" value="RSAES_OAEP_SHA_1"></el-option>
                            <el-option label="RSAES_OAEP_SHA_256" value="RSAES_OAEP_SHA_256"></el-option>
                          </el-select>
                          <el-button @click="downloadTxt1">{{$t('KMS.total.downLoad')}}</el-button>
                        </span>
                      </div>
                    </div>
                    <div class="botBtn">
                      <el-button @click="dialogModel3 = false">{{$t('KMS.total.modelClose')}}</el-button>
                      <el-button type="primary" @click="nextStepOne">{{$t('KMS.total.next')}}</el-button>
                    </div>
                  </div>
                  <div class="TopStepDownload" v-if="thisStepTwo">
                    <div class="topStepOne newClear">
                      <p class="stepTwo step"><span class="stepCir"><i class="el-icon-check"></i></span><span
                          class="stepText">{{$t('KMS.total.kmsParamsDownload')}}</span></p>
                      <span class="rightArrow">></span>
                      <p class="stepOne step"><span class="stepCir">2</span><span
                          class="stepText">{{$t('KMS.total.kmsImport')}}</span></p>
                      <span class="rightArrow">></span>
                      <p class="step"><span class="stepCir">3</span><span
                          class="stepText">{{$t('KMS.total.importStatus')}}</span></p>
                    </div>
                    <div class="labelCheckTwo newClear">
                      <div class="newClear">
                        <span class="labelCheckText">{{$t('KMS.total.CryptographicKeyMaterial')}}</span>
                        <span><input class="choseFileText" type="text" v-model="PlaintextRead"
                            :placeholder="$t('KMS.total.nofileChoose')" readonly /><a href="#"
                            class="chooseFile"><span>{{$t('KMS.total.chooseFile')}}</span><input type="file"
                              @change="PlaintextReadHande" ref="inputer"></a></span>
                      </div>
                      <div class="newClear">
                        <span class="labelCheckText">{{$t('KMS.total.ImportToken')}}</span>
                        <span><input class="choseFileText" v-model="exportRead" type="text"
                            :placeholder="$t('KMS.total.nofileChoose')" readonly /><a href="#"
                            class="chooseFile"><span>{{$t('KMS.total.chooseFile')}}</span><input type="file"
                              @change="exportChange"></a></span>
                      </div>
                      <div class="newClear">
                        <span class="labelCheckText">{{$t('KMS.total.kmsMoutTime')}}</span>
                        <span>
                          <el-select class="selectSuanTwo" v-model="outTimeSet" @change="timeOutChange">
                            <el-option :label="$t('KMS.total.foverNoTime')" value="forver"></el-option>
                            <el-option :label="$t('KMS.total.setTimeOut')" value="setTime"></el-option>
                          </el-select>
                          <el-date-picker v-if="isSettimeOut" v-model="selectTime" type="date" :picker-options="picker"
                            :placeholder="$t('KMS.total.chooseTime')" class="setTimeOutTime">
                          </el-date-picker><br />
                          <span class="tipStep">{{$t('KMS.total.tip6')}}</span>
                        </span>
                      </div>
                    </div>
                    <div class="botBtn">
                      <el-button type="primary" @click="prevOne">{{$t('KMS.total.prev')}}</el-button>
                      <el-button @click="nextStepTwo" :disabled="PlaintextRead==''||exportRead==''?true:false">
                        {{$t('KMS.total.impoetKms')}}</el-button>
                    </div>
                  </div>
                  <div class="TopStepDownload" v-if="thisStepThree">
                    <div class="topStepOne newClear">
                      <p class="stepTwo step"><span class="stepCir"><i class="el-icon-check"></i></span><span
                          class="stepText">{{$t('KMS.total.kmsParamsDownload')}}</span></p>
                      <span class="rightArrow">></span>
                      <p class="stepTwo step"><span class="stepCir"><i class="el-icon-check"></i></span><span
                          class="stepText">{{$t('KMS.total.kmsImport')}}</span></p>
                      <span class="rightArrow">></span>
                      <p class="stepOne step"><span class="stepCir">3</span><span
                          class="stepText">{{$t('KMS.total.importStatus')}}</span></p>
                    </div>
                    <div class="labelCheckTwo newClear">
                      <p v-if="ishowkms" style="text-align: center;padding: 50px;"><i
                          class="el-icon-circle-check iconys"></i>{{$t('KMS.total.kmsImportSuccess')}}</p>
                      <p v-if="!ishowkms" style="text-align: center;padding: 50px;"><i
                          class="el-icon-circle-close iconys"></i>{{$t('KMS.total.tip7')}}</p>
                    </div>
                    <div class="botBtn">
                      <el-button type="primary" @click="prevTwo">{{$t('KMS.total.prev')}}</el-button>
                      <el-button @click="dialogModel3=false" :disabled="!ishowkms==false?false:true">
                        {{$t('KMS.total.modelSure')}}</el-button>
                    </div>
                  </div>
                </div>
              </el-dialog>

              <el-dialog class="changeNameModel" :title="$t('KMS.total.deleteKmsM')" :visible.sync="dialogModel4"
                width="40%" :before-close="handleClose4">
                <div class="dialogModelConT">
                  <div class="TopStepDownload" v-if="thisStepOne">
                    <div class="tipBlue">
                      {{$t('KMS.total.tip8')}}
                    </div>
                    <div class="labelCheck newClear">
                      <div class="newClear">{{$t('KMS.total.tip9')}}</div>

                    </div>
                    <div class="botBtn">
                      <el-button @click="dialogModel4 = false">{{$t('KMS.total.modelClose')}}</el-button>
                      <el-button type="primary" @click="deletekms">{{$t('KMS.total.modelSure')}}</el-button>
                    </div>
                  </div>
                </div>
              </el-dialog>

            </div>
          </div>
        </div>
        <div class="projectDetailThree newClear">
          <h2>{{$t('KMS.total.onlineTool')}}<i class="el-icon-info" v-popover:popover></i></h2>
          <el-popover ref="popover" placement="right-start" width="400" trigger="hover" content="在线工具可以使用当前主密钥对文本、密钥等小型数据(小于等于4K)进行方便快捷的加密操作。
            解密操作根据密文使用的主密钥，自动调用该主密钥进行解密操作。
            解密后明文以 Base64 展示。
            （工具仅密钥启用状态时可用）">
          </el-popover>
          <div class="btnBottom">
            <button @click="changeBtnEncrypt(1)" :class="thisType=='1'?'bthBorderColor':''"
              :disabled='projectDetail.KeyState==$t("KMS.total.alredayStop")||projectDetail.KeyState=="PendingDelete"?true:false'>{{$t('KMS.total.encryption')}}</button>
            <button @click="changeBtnEncrypt(2)" :class="thisType=='2'?'bthBorderColor':''"
              :disabled='projectDetail.KeyState==$t("KMS.total.alredayStop")||projectDetail.KeyState=="PendingDelete"?true:false'>{{$t('KMS.total.Decrypt')}}</button>
          </div>
          <div class="EncryptText newClear">
            <div v-if="thisType=='1'||thisType=='0'?true:false">
              <el-input
                :disabled='projectDetail.KeyState==$t("KMS.total.alredayStop")||projectDetail.KeyState=="PendingDelete"?true:false'
                class="textareaIpt" v-model="Plaintext" type="textarea" :placeholder="$t('KMS.total.placeholder2')"
                @input='changeTextarea1'></el-input>
              <el-button @click="actionPlain" :disabled="disableTextarea" type="primary">{{$t('KMS.total.action1')}}
              </el-button>
            </div>
            <div v-if="thisType=='2'||thisType=='3'?true:false">
              <el-input class="textareaIpt" v-model="Ciphertext" type="textarea"
                :placeholder="$t('KMS.total.enterText')" @input='changeTextarea1'></el-input>
              <el-button @click="actionCipher" :disabled="disableTextarea" type="primary">{{$t('KMS.total.action1')}}
              </el-button>
            </div>
            <div>
              <el-input class="textareaIpt" :disabled="true" type="textarea" v-model="downLoadText"></el-input>
              <el-button :disabled="downLoadText==''?true:false" type="primary" @click="downloadTxt">
                {{$t('KMS.total.downLoad')}}</el-button>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
<script>
  import {
    ErrorTips
  } from "@/components/ErrorTips";
  import VueCookie from "vue-cookie";
  import moment from 'moment'
  import LstopChange from './LstopChange'
  import LstartKms from './LstartKms'
  import LopenDelete from './LopenDelete'
  import {
    Des_KMS,
    UP_NAME,
    UP_DESC,
    Encrypt,
    Decrypt,
    GET_CMK,
    ImportKey,
    DEL_KMS
  } from "@/constants";
  export default {
    data() {
      return {
        loading: true,
        projectDetail: {},
        createUser: "",
        discription: "",
        dialogModel1: false, //修改名称模态框
        dialogModel2: false, //修改描述模态框
        dialogModel3: false, //导入密钥材料模态框
        dialogModel4: false, //导入密钥材料模态框
        changeName: '', //新的名称
        descriptionNew: "", //新的描述
        thisType: 1,
        Plaintext: '', //请输入明文
        Ciphertext: "", //请输入密文
        disableTextarea: true, //解密加密第二框
        downLoadText: '', //'执行加解密之后的下载框'
        downLoadText1: '', //'执行加解密之后的下载框'
        downLoadText2: '', //'执行加解密之后的下载框'
        thisSuanType: 'RSA_2048', //算法类型
        thisAddSuan: 'RSAES_PKCS1_V1_5', //加密算法
        thisStepOne: true, //第一步
        thisStepTwo: false, //第二步
        thisStepThree: false, //第三步
        selectTime: '0', //选择过期时间
        outTimeSet: "forver", //绑定过期时间
        isSettimeOut: false, //是否设置过期时间
        PlaintextRead: "", //密钥材料
        exportRead: "", //导入令牌
        keyList: [],
        keyStatus: true,
        GetParameters: '',
        doalogModelBox: [], //启用轮换内容框
        doalogModelBox1: [], //启用密钥内容框
        doalogModelBox2: [], //计划删除框
        dialogModelChange: false, //是否启用轮换弹框
        dialogModelKms: false, //是否启用密钥弹框
        dialogModelDelete: false, //是否计划删除
        dialogModelOpenDelete: false, //计划删除如果是已启用时候的弹框
        ishowkms: false, //密钥材料显示
        EncryptedKeyMaterial1: '', //加密秘钥材料参数
        ImportToken1: '', //导入令牌参数
        picker: {
          disabledDate(time) {
            return time.getTime() < Date.now()
          }
        },
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
        this.loading = true;
        this.projectDetail = JSON.parse(sessionStorage.getItem("projectId"));
        console.log(this.projectDetail)
        this.projectDetail.KeyState == this.$t('KMS.total.alredayStop') || this.projectDetail.KeyState ==
          "PendingDelete" ? this.thisType = "0" : 3
        let params = {
          Version: '2019-01-18',
          Region: localStorage.getItem("regionv2"),
          KeyId: this.projectDetail.KeyId
        };
        this.axios.post(Des_KMS, params).then(res => {
          if (res.Response.Error === undefined) {

            this.keyList = res.Response.KeyMetadata;
            console.log(this.keyList)
            this.loading = false;
          } else {
            let ErrTips = {
              "InternalError": '內部錯誤',
              "InvalidParameter": '參數錯誤',
              "InvalidParameterValue.InvalidKeyId": 'KeyId不合法',
              "ResourceUnavailable.CmkNotFound": 'CMK不存在',
              "UnauthorizedOperation": '未授權操作'
            };
            let ErrOr = Object.assign(ErrorTips, ErrTips);
            this.$message({
              message: ErrOr[res.Response.Error.Code],
              type: "error",
              showClose: true,
              duration: 0
            });
          }
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
          let params = [scopeRow.Alias, this.$t('KMS.total.yu') + this.timestampToTime(scopeRow.DeletionDate) + this.$t(
            'KMS.total.allDelete'), e.target.innerHTML, scopeRow.KeyId]
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
        this.dialogModelKms = false
      },
      //禁用密钥确定按钮
      stopKmsSure(sureShow) {

        this.dialogModelKms = false
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
          // Region: VueCookie.get("regionv2"),
          Region: localStorage.getItem("regionv2"),
          Alias: this.changeName,
          KeyId: this.projectDetail.KeyId
        };
        this.axios.post(UP_NAME, params).then(res => {
          if (res.Response.Error === undefined) {
            this.keyList.Alias = this.changeName;
            this.dialogModel1 = false;
          } else {
            let ErrTips = {
              "InternalError": '內部錯誤',
              "InvalidParameter": '參數錯誤',
              "InvalidParameterValue.AliasAlreadyExists": '別名已經存在',
              "InvalidParameterValue.InvalidAlias": '別名格式錯誤',
              "InvalidParameterValue.InvalidKeyId": 'KeyId不合法',
              "ResourceUnavailable.CmkNotFound": 'CMK不存在',
              "UnauthorizedOperation": '未授權操作'
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
      //修改密钥描述确定按钮
      changeDescriptionSure() {
        let params = {
          Version: '2019-01-18',
          // Region: VueCookie.get("regionv2"),
          Region: localStorage.getItem("regionv2"),
          Description: this.descriptionNew,
          KeyId: this.projectDetail.KeyId
        };
        this.axios.post(UP_DESC, params).then(res => {
          if (res.Response.Error === undefined) {
            this.keyList.Description = this.descriptionNew;
            this.dialogModel2 = false;
          } else {
            let ErrTips = {
              "InternalError": '內部錯誤',
              "InvalidParameter": '參數錯誤',
              "InvalidParameterValue.InvalidKeyId": 'KeyId不合法',
              "ResourceUnavailable.CmkNotFound": 'CMK不存在',
              "UnauthorizedOperation": '未授權操作'
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
      //加密解密按钮
      changeBtnEncrypt(thisType) {
        this.thisType = thisType;
      },
      //明文执行按钮
      actionPlain() {
        var encode = encodeURI(this.Plaintext);
        // 对编码的字符串转化base64
        var base64 = btoa(encode);
        let params = {
          Version: '2019-01-18',
          Region: localStorage.getItem("regionv2"),
          Plaintext: base64,
          KeyId: this.projectDetail.KeyId
        };
        this.axios.post(Encrypt, params).then(res => {
          if (res.Response.Error == undefined) {
            this.$message({
              showClose: true,
              message: '加密成功',
              type: 'success',
              duration: 0
            });
          } else {
            let ErrTips = {
              "InternalError": '內部錯誤',
              "InvalidParameter": '參數錯誤',
              "InvalidParameterValue.InvalidKeyId": 'KeyId不合法',
              "InvalidParameterValue.InvalidPlaintext": 'Plaintext不合法',
              "ResourceUnavailable.CmkDisabled": 'CMK已被禁用',
              "ResourceUnavailable.CmkNotFound": 'CMK不存在',
              "UnauthorizedOperation": '未授權操作',
              'encryption failed, please check input parameters': '加密失败，请检查加密参数。',
              'illegal encryptionContext': 'encryptionContext 非法，该字段必须为json格式字符串。',
              'plaintext is not encoded with base64': 'plaintext 必须使用base64编码。'
            };
            let ErrOr = Object.assign(ErrorTips, ErrTips);
            this.$message({
              message: ErrOr[res.Response.Error.Code],
              type: "error",
              showClose: true,
              duration: 0
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
          Region: localStorage.getItem("regionv2"),
          CiphertextBlob: this.Ciphertext
        };
        this.axios.post(Decrypt, params).then(res => {
          if (res.Response.Error === undefined) {
            this.$message({
              showClose: true,
              message: '解密成功',
              type: 'success',
              duration: 0
            });
          } else {
            let ErrTips = {
              "InternalError": '內部錯誤',
              "InvalidParameter": '參數錯誤',
              "InvalidParameterValue.InvalidCiphertext": '密文格式錯誤',
              "ResourceUnavailable.CmkDisabled": 'CMK已被禁用',
              "ResourceUnavailable.CmkNotFound": 'CMK不存在',
              "UnauthorizedOperation": '未授權操作'
            };
            let ErrOr = Object.assign(ErrorTips, ErrTips);
            this.$message({
              message: ErrOr[res.Response.Error.Code],
              type: "error",
              showClose: true,
              duration: 0
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
          Region: localStorage.getItem("regionv2"),
          KeyId: this.projectDetail.KeyId,
          WrappingAlgorithm: this.thisAddSuan,
          WrappingKeySpec: this.thisSuanType
        };
        //获取导入主密钥（CMK）材料的参数
        this.axios.post(GET_CMK, params).then(res => {
          if (res.Response.Error === undefined) {
            this.GetParameters = res.Response
            this.downLoadText1 = this.GetParameters.ImportToken
            this.downLoadText2 = this.GetParameters.PublicKey
            this.exportRaw('ImportToken' + '.txt', this.downLoadText1)
            this.exportRaw('public_key' + '.base64', this.downLoadText2)
            var README = ''
            README += '演算法類型：' + this.thisSuanType + '\n' +
              '加密演算法：' + this.thisAddSuan + '\n' +
              '加密公鑰文件：public_key' + '\n' +
              '導入令牌文件：ImportToken' + '\n' +
              '密鑰導入材料過期時間：' + this.timestampToTime(this.GetParameters.ParametersValidTo)
            this.exportRaw('README' + '.txt', README)
          } else {
            let ErrTips = {
              "InternalError": '內部錯誤',
              "InvalidParameter": '參數錯誤',
              "ResourceUnavailable.CmkNotFound": 'CMK不存在',
              "UnsupportedOperation.NotExternalCmk": 'CMK類型錯誤,僅支持External CMK'
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
      //第二步的下一步按钮\导入密钥按钮
      nextStepTwo() {
        this.thisStepOne = false;
        this.thisStepTwo = false;
        let params = {
          Version: '2019-01-18',
          Region: localStorage.getItem("regionv2"),
          EncryptedKeyMaterial: sessionStorage.getItem("EncryptedKeyMaterial1"),
          ImportToken: sessionStorage.getItem("ImportToken1"),
          KeyId: this.projectDetail.KeyId,
          ValidTo: this.selectTime
        };

        if (this.selectTime == '0') {
          params['ValidTo'] = '0'
        } else {
          params['ValidTo'] = Date.parse(moment(this.selectTime).format('YYYY-MM-DD')) / 1000
        }
        this.axios.post(ImportKey, params).then(res => {
          if (res.Response.Error === undefined) {
            this.ishowkms = true
            this.GetList()
          } else {
            this.ishowkms = false
            this.keyStatus = true
            this.GetList();
            let ErrTips = {
              "InternalError": '內部錯誤',
              "InvalidParameter": '參數錯誤',
              "InvalidParameter.DecryptMaterialError": '解密EncryptedKeyMaterial失敗',
              "InvalidParameterValue.MaterialNotMatch": '導入的密鑰材料和歷史導入不同',
              "ResourceUnavailable.CmkNotFound": 'CMK不存在',
              "ResourceUnavailable.CmkStateNotSupport": 'CMK狀態不支持該操作',
              "ResourceUnavailable.TokenExpired": 'Token已過期',
              "UnsupportedOperation.NotExternalCmk": 'CMK類型錯誤,僅支持External CMK'
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
          Region: localStorage.getItem("regionv2"),
          KeyId: this.projectDetail.KeyId,
        };
        this.axios.post(DEL_KMS, params).then(res => {
          if (res.Response.Error === undefined) {
            this.$message({
              showClose: true,
              message: '刪除密鑰材料成功',
              type: 'success',
              duration: 0
            });
            this.dialogModel4 = false;
          } else {
            let ErrTips = {
              "InternalError": '內部錯誤',
              "InvalidParameter": '參數錯誤',
              "InvalidParameterValue.InvalidKeyId": 'KeyId不合法',
              "ResourceUnavailable.CmkNotFound": 'CMK不存在',
              "ResourceUnavailable.CmkStateNotSupport": 'CMK狀態不支持該操作',
              "UnsupportedOperation.NotExternalCmk": 'CMK類型錯誤,僅支持External CMK'
            };
            let ErrOr = Object.assign(ErrorTips, ErrTips);
            this.$message({
              message: ErrOr[res.Response.Error.Code],
              type: "error",
              showClose: true,
              duration: 0
            });
          }

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
          return this.$t('KMS.total.noTimeout')
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
          state = this.$t('KMS.total.alredayStart')
        } else if (state == 'PendingImport') {
          state = this.$t('KMS.total.willImport')
        } else if (state == 'Disabled') {
          state = this.$t('KMS.total.alredayStop')
        }
        return state;
      }
    }
  }

</script>
<style lang="scss" scoped>
  .newClear:after {
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
            width: 90px;
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
          >div {
            float: left;
            margin-right: 30px;
            text-align: right;
            width: 330px;

            ::v-deep textarea {
              width: 80%;
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
        ::v-deep button {
          background-color: #fff;
        }
      }
    }
  }

  .dialogModelCon {
    div {
      margin-bottom: 20px;
      width: 100%;

      span:nth-child(1) {
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

          ::v-deep input {
            width: 200px;
            height: 30px;
            line-height: 30px;
            border-radius: 0;
          }
        }

        .newDescription {
          ::v-deep textarea {
            width: 80%;
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
    ::v-deep .el-dialog__title {
      font-size: 14px;
      font-weight: 600;
    }
  }

  .dialogModelConT {
    ::v-deep button {
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

            ::v-deep input {
              width: 170px;
              height: 30px;
              line-height: 30px;
              border-radius: 0;
            }
          }
        }

        ::v-deep button {
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

          ::v-deep input {
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

            ::v-deep input {
              width: 100px;
              height: 30px;
              line-height: 30px;
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

        ::v-deep input {
          width: 120px;
          height: 30px;
          line-height: 30px;
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
    pointer-events: none;
  }

  .atclor:hover {
    color: #bbb;
    cursor: default;
    pointer-events: none;
  }

  .iconys {
    font-size: 24px;
    vertical-align: bottom !important;
    margin-right: 4px;
  }

</style>

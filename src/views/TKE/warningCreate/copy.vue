<template>
  <div class="persistenceSetting">

    <div class="back-hd flex">
      <router-link :to="'/warnings'">
        <i class="el-icon-back hd-icon-back"></i>
      </router-link>
      <h3>{{$t('TKE.overview.fzcl')}}</h3>
    </div>
    <div class='room'>
      <el-card class="box-card">
        <div class="tf-g app-tke-fe-content__inner">
          <div class="event-persistence font">
            <el-form ref="form" :model="form" label-width="100px" label-position="left" class="tke-form">
              <el-form-item label="地域">
                <div>{{$t('TKE.overview.zgtb')}}</div>
              </el-form-item>
              <el-form-item label="集群">
                <div>cls-gwblk71e(tfy_test)</div>
              </el-form-item>
              <el-form-item :label="$t('TKE.overview.gjclmc')">
                <el-input size="mini" class="el-input" :placeholder="$t('TKE.overview.qsrgjclmc')"></el-input>
                <div>{{$t('TKE.overview.zczf40')}}</div>
              </el-form-item>
              <el-form-item :label="$t('TKE.overview.bz')">
                <el-input type="textarea" class="el-textarea" :placeholder="$t('TKE.overview.srclbz')" v-model="form.desc"></el-input>
                <div>{{$t('TKE.overview.zczf100')}}</div>
              </el-form-item>
              <el-form-item :label="$t('TKE.overview.cllx')">
                <el-select v-model="value" :placeholder="$t('TKE.overview.xzhdqy')" size="mini">
                  <el-option label="集群" value="jq">
                  </el-option>
                  <el-option :label="$t('TKE.overview.jd')" value="jd"></el-option>
                  <el-option label="pod" value="pod"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item :label="$t('TKE.overview.gjdx')" v-if="value == 'jd'">
                <el-radio v-model="form.radio1" label="1">{{$t('TKE.overview.qbxz')}}</el-radio>
              </el-form-item>

              <el-form-item :label="$t('TKE.overview.gjdx')" v-if="value == 'pod'">
                <el-radio-group v-model="form.radio2">
                  <el-radio :label="1">{{$t('TKE.overview.agzfzxz2')}}</el-radio>
                  <div v-if="form.radio2 == '1'">
                    <el-form-item label="Namespace" >
                          <el-select :placeholder="$t('TKE.overview.qxz')" v-model='form.value1' size='mini'>
                              <el-option
                                v-for="item in form.input1"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                              </el-option>
                            </el-select>
                    </el-form-item>
                    <el-form-item label="WorkloadType" >
                      <el-select :placeholder="$t('TKE.overview.qxz')" v-model='form.value2' size='mini'>
                              <el-option
                                v-for="item in form.input2"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                              </el-option>
                            </el-select>
                    </el-form-item>
                  </div>
                  <el-radio :label="2">{{$t('TKE.overview.qbxz')}}</el-radio>
              </el-radio-group>
            </el-form-item>
              <!-- 集群显示内容 -->
              <div>
                <el-form-item :label="$t('TKE.overview.zb')">
                  <div class="form-form" v-if="value == 'jq'">
                    <div class="flex p3">
                      <!-- 内容 -->
                      <div class="flex" style="flex:1;padding-top:5px;">
                        <el-checkbox  v-model="formOne[0].checked">CPU利用率</el-checkbox>
                      </div>
                      <div>
                        <el-select :placeholder="$t('TKE.overview.qxz')" v-model='formOne[0].option.value1' size='mini'>
                          <el-option
                            v-for="item in option1"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                        <el-select :placeholder="$t('TKE.overview.qxz')" v-model='formOne[0].option.value2' size='mini'>
                          <el-option
                            v-for="item in option2"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                        <el-input v-model="formOne[0].option.value3" size="mini" class="w100"></el-input>
                        <span class="numberEnd">%</span>
                         <el-select :placeholder="$t('TKE.overview.qxz')" v-model='formOne[0].option.value4' size='mini'>
                          <el-option
                            v-for="item in option3"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      </div>
                    </div>

                    <div class="flex p3">
                      <!-- 内容 -->
                      <div class="flex" style="flex:1;padding-top:5px;">
                        <el-checkbox  v-model="formOne[1].checked">{{$t('TKE.overview.nclyl')}}</el-checkbox>
                      </div>
                      <div>
                        <el-select :placeholder="$t('TKE.overview.qxz')" v-model='formOne[1].option.value1' size='mini'>
                          <el-option
                            v-for="item in option1"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                        <el-select :placeholder="$t('TKE.overview.qxz')" v-model='formOne[1].option.value2' size='mini'>
                          <el-option
                            v-for="item in option2"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                        <el-input v-model="formOne[1].option.value3" size="mini" class="w100"></el-input>
                        <span class="numberEnd">%</span>
                         <el-select :placeholder="$t('TKE.overview.qxz')" v-model='formOne[1].option.value4' size='mini'>
                          <el-option
                            v-for="item in option3"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      </div>
                    </div>

                    <div class="flex p3">
                      <!-- 内容 -->
                      <div class="flex" style="flex:1;padding-top:5px;">
                        <el-checkbox  v-model="formOne[2].checked">CPU分配率</el-checkbox>
                      </div>
                      <div>
                        <el-select :placeholder="$t('TKE.overview.qxz')" v-model='formOne[2].option.value1' size='mini'>
                          <el-option
                            v-for="item in option1"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                        <el-select :placeholder="$t('TKE.overview.qxz')" v-model='formOne[2].option.value2' size='mini'>
                          <el-option
                            v-for="item in option2"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                        <el-input v-model="formOne[2].option.value3" size="mini" class="w100"></el-input>
                        <span class="numberEnd">%</span>
                         <el-select :placeholder="$t('TKE.overview.qxz')" v-model='formOne[2].option.value4' size='mini'>
                          <el-option
                            v-for="item in option3"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      </div>
                    </div>

                    <div class="flex p3">
                      <!-- 内容 -->
                      <div class="flex" style="flex:1;padding-top:5px;">
                        <el-checkbox  v-model="formOne[3].checked">{{$t('TKE.overview.ncfpl')}}</el-checkbox>
                      </div>
                      <div>
                        <el-select :placeholder="$t('TKE.overview.qxz')" v-model='formOne[3].option.value1' size='mini'>
                          <el-option
                            v-for="item in option1"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                        <el-select :placeholder="$t('TKE.overview.qxz')" v-model='formOne[3].option.value2' size='mini'>
                          <el-option
                            v-for="item in option2"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                        <el-input v-model="formOne[3].option.value3" size="mini" class="w100"></el-input>
                        <span class="numberEnd">%</span>
                         <el-select :placeholder="$t('TKE.overview.qxz')" v-model='formOne[3].option.value4' size='mini'>
                          <el-option
                            v-for="item in option3"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      </div>
                    </div>
                  </div>

                  <!-- 节点显示内容 -->
                  <div class="form-form" v-if="value == 'jd'">
                    <div class="flex p3">
                      <div class="flex" style="flex:1;padding-top:5px;">
                        <el-checkbox  v-model="formTwo[0].checked">CPU利用率</el-checkbox>
                      </div>
                      <div>
                        <el-select :placeholder="$t('TKE.overview.qxz')" v-model='formTwo[0].option.value1' size='mini'>
                          <el-option
                            v-for="item in option1"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                        <el-select :placeholder="$t('TKE.overview.qxz')" v-model='formTwo[0].option.value2' size='mini'>
                          <el-option
                            v-for="item in option2"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                        <el-input v-model="formTwo[0].option.value3" size="mini" class="w100"></el-input>
                        <span class="numberEnd">%</span>
                         <el-select :placeholder="$t('TKE.overview.qxz')" v-model='formTwo[0].option.value4' size='mini'>
                          <el-option
                            v-for="item in option3"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      </div>
                    </div>

                    <div class="flex p3">
                      <div class="flex" style="flex:1;padding-top:5px;">
                        <el-checkbox  v-model="formTwo[1].checked">{{$t('TKE.overview.nclyl')}}</el-checkbox>
                      </div>
                      <div>
                        <el-select :placeholder="$t('TKE.overview.qxz')" v-model='formTwo[1].option.value1' size='mini'>
                          <el-option
                            v-for="item in option1"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                        <el-select :placeholder="$t('TKE.overview.qxz')" v-model='formTwo[1].option.value2' size='mini'>
                          <el-option
                            v-for="item in option2"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                        <el-input v-model="formTwo[1].option.value3" size="mini" class="w100"></el-input>
                        <span class="numberEnd">%</span>
                         <el-select :placeholder="$t('TKE.overview.qxz')" v-model='formTwo[1].option.value4' size='mini'>
                          <el-option
                            v-for="item in option3"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      </div>
                    </div>

                    <div class="flex p3">
                      <div class="flex" style="flex:1;padding-top:5px;">
                        <el-checkbox  v-model="formTwo[2].checked">{{$t('TKE.overview.jdcqcs')}}</el-checkbox>
                      </div>
                      <div>
                        <el-select :placeholder="$t('TKE.overview.qxz')" v-model='formTwo[2].option.value1' size='mini'>
                          <el-option
                            v-for="item in option1"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                        <el-select :placeholder="$t('TKE.overview.qxz')" v-model='formTwo[2].option.value2' size='mini'>
                          <el-option
                            v-for="item in option2"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                        <el-input v-model="formTwo[2].option.value3" size="mini" class="w100"></el-input>
                        <span class="numberEnd">%</span>
                         <el-select :placeholder="$t('TKE.overview.qxz')" v-model='formTwo[2].option.value4' size='mini'>
                          <el-option
                            v-for="item in option3"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      </div>
                    </div>

                    <div class="flex p3">
                      <div class="flex" style="flex:1;padding-top:5px">
                        <el-checkbox  v-model="formTwo[3].checked">Node Ready</el-checkbox>
                      </div>
                      <div>
                        <el-select :placeholder="$t('TKE.overview.qxz')" v-model='formTwo[3].option.value1' size='mini'>
                          <el-option
                            v-for="item in option1"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                        <el-select :placeholder="$t('TKE.overview.qxz')" v-model='formTwo[3].option.value2' size='mini'>
                          <el-option
                            v-for="item in option2"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                        <el-select :placeholder="$t('TKE.overview.qxz')" v-model='formTwo[3].option.value3' size='mini'>
                          <el-option
                            v-for="item in option5"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                         <el-select :placeholder="$t('TKE.overview.qxz')" v-model='formTwo[3].option.value4' size='mini'>
                          <el-option
                            v-for="item in option3"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      </div>
                    </div>
                  </div>

                  <!-- pod显示内容 -->
                  <div class="form-form" v-if="value == 'pod'">

                    <div class="flex p3">
                      <div class="flex" style="flex:1;padding-top:5px;">
                        <el-checkbox  v-model="formTwo[0].checked">CPU利用率</el-checkbox>
                      </div>
                      <div>
                        <el-select :placeholder="$t('TKE.overview.qxz')" v-model='formTwo[0].option.value1' size='mini'>
                          <el-option
                            v-for="item in option1"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                        <el-select :placeholder="$t('TKE.overview.qxz')" v-model='formTwo[0].option.value2' size='mini'>
                          <el-option
                            v-for="item in option2"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                        <el-input v-model="formTwo[0].option.value3" size="mini" class="w100"></el-input>
                        <span class="numberEnd">%</span>
                         <el-select :placeholder="$t('TKE.overview.qxz')" v-model='formTwo[0].option.value4' size='mini'>
                          <el-option
                            v-for="item in option3"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      </div>
                    </div>

                    <div class="flex p3">
                      <div class="flex" style="flex:1;padding-top:5px;">
                        <el-checkbox  v-model="formTwo[1].checked">{{$t('TKE.overview.nclyl')}}</el-checkbox>
                      </div>
                      <div>
                        <el-select :placeholder="$t('TKE.overview.qxz')" v-model='formTwo[1].option.value1' size='mini'>
                          <el-option
                            v-for="item in option1"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                        <el-select :placeholder="$t('TKE.overview.qxz')" v-model='formTwo[1].option.value2' size='mini'>
                          <el-option
                            v-for="item in option2"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                        <el-input v-model="formTwo[1].option.value3" size="mini" class="w100"></el-input>
                        <span class="numberEnd">%</span>
                         <el-select :placeholder="$t('TKE.overview.qxz')" v-model='formTwo[1].option.value4' size='mini'>
                          <el-option
                            v-for="item in option3"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      </div>
                    </div>

                    <div class="flex p3">
                      <div class="flex" style="flex:1;padding-top:5px;">
                        <el-checkbox  v-model="formTwo[2].checked">{{$t('TKE.overview.jdcqcs')}}</el-checkbox>
                      </div>
                      <div>
                        <el-select :placeholder="$t('TKE.overview.qxz')" v-model='formTwo[2].option.value1' size='mini'>
                          <el-option
                            v-for="item in option1"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                        <el-select :placeholder="$t('TKE.overview.qxz')" v-model='formTwo[2].option.value2' size='mini'>
                          <el-option
                            v-for="item in option2"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                        <el-input v-model="formTwo[2].option.value3" size="mini" class="w100"></el-input>
                        <span class="numberEnd">%</span>
                         <el-select :placeholder="$t('TKE.overview.qxz')" v-model='formTwo[2].option.value4' size='mini'>
                          <el-option
                            v-for="item in option3"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      </div>
                    </div>

                    <div class="flex p3">
                      <div class="flex" style="flex:1;padding-top:5px">
                        <el-checkbox  v-model="formTwo[3].checked">Node Ready</el-checkbox>
                      </div>
                      <div>
                        <el-select :placeholder="$t('TKE.overview.qxz')" v-model='formTwo[3].option.value1' size='mini'>
                          <el-option
                            v-for="item in option1"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                        <el-select :placeholder="$t('TKE.overview.qxz')" v-model='formTwo[3].option.value2' size='mini'>
                          <el-option
                            v-for="item in option2"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                        <el-select :placeholder="$t('TKE.overview.qxz')" v-model='formTwo[3].option.value3' size='mini'>
                          <el-option
                            v-for="item in option5"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                         <el-select :placeholder="$t('TKE.overview.qxz')" v-model='formTwo[3].option.value4' size='mini'>
                          <el-option
                            v-for="item in option3"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      </div>
                    </div>

                    <div class="flex p3">
                      <div class="flex" style="flex:1;padding-top:5px;">
                        <el-checkbox  v-model="formTwo[0].checked">CPU利用率</el-checkbox>
                      </div>
                      <div>
                        <el-select :placeholder="$t('TKE.overview.qxz')" v-model='formTwo[0].option.value1' size='mini'>
                          <el-option
                            v-for="item in option1"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                        <el-select :placeholder="$t('TKE.overview.qxz')" v-model='formTwo[0].option.value2' size='mini'>
                          <el-option
                            v-for="item in option2"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                        <el-input v-model="formTwo[0].option.value3" size="mini" class="w100"></el-input>
                        <span class="numberEnd">%</span>
                         <el-select :placeholder="$t('TKE.overview.qxz')" v-model='formTwo[0].option.value4' size='mini'>
                          <el-option
                            v-for="item in option3"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      </div>
                    </div>

                    <div class="flex p3">
                      <div class="flex" style="flex:1;padding-top:5px;">
                        <el-checkbox  v-model="formTwo[1].checked">{{$t('TKE.overview.nclyl')}}</el-checkbox>
                      </div>
                      <div>
                        <el-select :placeholder="$t('TKE.overview.qxz')" v-model='formTwo[1].option.value1' size='mini'>
                          <el-option
                            v-for="item in option1"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                        <el-select :placeholder="$t('TKE.overview.qxz')" v-model='formTwo[1].option.value2' size='mini'>
                          <el-option
                            v-for="item in option2"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                        <el-input v-model="formTwo[1].option.value3" size="mini" class="w100"></el-input>
                        <span class="numberEnd">%</span>
                         <el-select :placeholder="$t('TKE.overview.qxz')" v-model='formTwo[1].option.value4' size='mini'>
                          <el-option
                            v-for="item in option3"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      </div>
                    </div>

                    <div class="flex p3">
                      <div class="flex" style="flex:1;padding-top:5px;">
                        <el-checkbox  v-model="formTwo[2].checked">{{$t('TKE.overview.jdcqcs')}}</el-checkbox>
                      </div>
                      <div>
                        <el-select :placeholder="$t('TKE.overview.qxz')" v-model='formTwo[2].option.value1' size='mini'>
                          <el-option
                            v-for="item in option1"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                        <el-select :placeholder="$t('TKE.overview.qxz')" v-model='formTwo[2].option.value2' size='mini'>
                          <el-option
                            v-for="item in option2"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                        <el-input v-model="formTwo[2].option.value3" size="mini" class="w100"></el-input>
                        <span class="numberEnd">%</span>
                         <el-select :placeholder="$t('TKE.overview.qxz')" v-model='formTwo[2].option.value4' size='mini'>
                          <el-option
                            v-for="item in option3"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      </div>
                    </div>

                    <div class="flex p3">
                      <div class="flex" style="flex:1;padding-top:5px">
                        <el-checkbox  v-model="formTwo[3].checked">Node Ready</el-checkbox>
                      </div>
                      <div>
                        <el-select :placeholder="$t('TKE.overview.qxz')" v-model='formTwo[3].option.value1' size='mini'>
                          <el-option
                            v-for="item in option1"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                        <el-select :placeholder="$t('TKE.overview.qxz')" v-model='formTwo[3].option.value2' size='mini'>
                          <el-option
                            v-for="item in option2"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                        <el-select :placeholder="$t('TKE.overview.qxz')" v-model='formTwo[3].option.value3' size='mini'>
                          <el-option
                            v-for="item in option5"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                         <el-select :placeholder="$t('TKE.overview.qxz')" v-model='formTwo[3].option.value4' size='mini'>
                          <el-option
                            v-for="item in option3"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      </div>
                    </div>

                  </div>

                </el-form-item>
              </div>
    
              <el-form-item :label="$t('TKE.overview.jsz')">
                  <el-transfer
                    filterable
                    :filter-method="filterMethod"
                    :filter-placeholder="$t('TKE.overview.sryhzmc')"
                    v-model="genDataValue"
                    :titles="['可用用戶組', '已選擇用戶組']"
                    :data="data">
                  </el-transfer>
                  <div>{{$t('TKE.overview.whsz')}}<a href="">{{$t('TKE.overview.xjyhz')}}</a><i class="el-icon-edit-outline"></i></div>
                </el-form-item>
                <el-form-item :label="$t('TKE.overview.gjqd')" style="margin-top:0;">
                    <el-checkbox-group v-model="tellWarning.checkList">
                        <el-checkbox :label="$t('TKE.overview.dx')"></el-checkbox>
                    </el-checkbox-group>
                    <el-checkbox-group v-model="tellWarning.checkList">
                        <el-checkbox :label="$t('TKE.overview.yx')"></el-checkbox>
                    </el-checkbox-group>
                    <el-checkbox-group v-model="tellWarning.checkList">
                        <el-checkbox :label="$t('TKE.overview.wx')"></el-checkbox>
                    </el-checkbox-group>
                    <el-checkbox-group v-model="tellWarning.checkList">
                        <el-checkbox :label="$t('TKE.overview.dh')"></el-checkbox>
                    </el-checkbox-group>
                    <div class='form-form1' v-if="tellWarning.checkList == '電話'">
                      <el-form-item :label="$t('TKE.overview.lxcs')">
                         <el-select :placeholder="$t('TKE.overview.qxz')" v-model='formPhone.value1' size='mini'>
                          <el-option
                            v-for="item in formPhone.option1"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                        <p>{{$t('TKE.overview.dcjg')}}</p>
                      </el-form-item>
                      <el-form-item :label="$t('TKE.overview.lxsx')">
                        <el-table
                          :data="formPhone.tableData"
                          style="width: 100%">
                          <el-table-column
                            prop="date"
                            :label="$t('TKE.overview.jsr')"
                            width="180">
                          </el-table-column>
                          <el-table-column
                            prop="name"
                            :label="$t('TKE.overview.ssyhz')"
                            width="180">
                          </el-table-column>
                        </el-table>
                      </el-form-item>
                      <el-form-item :label="$t('TKE.overview.lxjg')">
                        <el-form-item :label="$t('TKE.overview.dclxjg')" label-width='150px'>
                           <el-select :placeholder="$t('TKE.overview.qxz')" v-model='formPhone.value2' size='mini'>
                            <el-option
                              v-for="item in formPhone.option2"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                            </el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item :label="$t('TKE.overview.lclxjg')" label-width='150px'>
                           <el-select :placeholder="$t('TKE.overview.qxz')" v-model='formPhone.value3' size='mini'>
                            <el-option
                              v-for="item in formPhone.option3"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-form-item>
                      <el-form-item :label="$t('TKE.overview.cdtz')">
                        <el-switch
                          v-model="formPhone.value4"
                          >
                        </el-switch>
                      </el-form-item>
                    </div>
                </el-form-item>
             
              
         
              <el-form-item>
                <el-button type="primary" @click="onSubmit">{{$t('TKE.overview.ljcj')}}</el-button>
                <el-button>取消</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-card>
    </div>
    </div>
</template>
<script>
import HeadCom from "@/components/public/Head";
export default {
  data(){
    const generateData = _ => {
      const data = [];
      const cities = ['測試誤刪', '誤刪', 'ac', '可以刪除', 'dfa', 'aaaaaaaaaaaaa', 'ddddddddd'];
      const pinyin = ['shanghai', 'beijing', 'guangzhou', 'shenzhen', 'nanjing', 'xian', 'chengdu'];
      cities.forEach((city, index) => {
        data.push({
          label: city,
          key: index,
          pinyin: pinyin[index]
        });
      });
      return data;
    };
    return{
      data: generateData(),
      genDataValue:[],
      filterMethod(query, item) {
        return item.pinyin.indexOf(query) > -1;
      },
      form: {
        radio1:'1',
        radio2:'1',
        input1:[],
        input2:[],
        value1:'',
        value2:'',
       
        // name: '',
        // region: '',
        // date1: '',
        // date2: '',
        // delivery: false,
        // type: [],
        // resource: '',
        // desc: ''
      },
      formPhone:{
        option1:[],
        option2:[],
        option3:[],
        value1:'',
        value2:'',
        value3:'',
        value4:false,
         tableData:''
      },
      value:'jq',
      TWA: true,
      WorkloadType: {
        content: 'Deployment',
        contents: ['Deployment','DeamonSet','StatefulSet']
      },
      Namespace: {
        content: 'default',
        contents: ['default','kube-public','bube-system']
      },
      tellWarning: {
        checkList:[]
      },
      option1:[
          {
            value:1,
            label:'統計周期1分鐘'
          },
          {
            value:2,
            label:'統計周期2分鐘'
          },
          {
            value:3,
            label:'統計周期3分鐘'
          },
          {
            value:4,
            label:'統計周期4分鐘'
          },
          {
            value:5,
            label:'統計周期5分鐘'
          }
        ],
        option2:[
          {
            value:1,
            label:'>'
          },
          {
            value:2,
            label:'<'
          }
        ],
        option3:[
           {
            value:1,
            label:'持續1個周期'
          },
          {
            value:2,
            label:'持續2個周期'
          },
          {
            value:3,
            label:'持續3個周期'
          },
          {
            value:4,
            label:'持續4個周期'
          },
          {
            value:5,
            label:'持續5個周期'
          }
        ],
        option4:[
          {
            value:1,
            label:'>'
          },
          {
            value:2,
            label:'='
          },
          {
            value:3,
            label:'<'
          },
        ],
        option5:[
          {
            value:true,
            label:'true'
          },
          {
            value:false,
            label:'false'
          }
        ],
        // 集群
      formOne:[{
        checked:true,
        option:{
          value1:'',
          value2:'',
          value3:'',
          value4:'',
        }
      },{
        checked:true,
        option:{
          value1:'',
          value2:'',
          value3:'',
          value4:'',
        }
      },{
        checked:true,
        option:{
          value1:'',
          value2:'',
          value3:'',
          value4:'',
        }
      },{
        checked:true,
        option:{
          value1:'',
          value2:'',
          value3:'',
          value4:'',
        }
      }],
      // 节点
      formTwo:[{
        checked:true,
        option:{
          value1:'',
          value2:'',
          value3:'',
          value4:'',
        }
      },{
        checked:true,
        option:{
          value1:'',
          value2:'',
          value3:'',
          value4:'',
        }
      },{
        checked:true,
        option:{
          value1:'',
          value2:'',
          value3:'',
          value4:'',
        }
      },{
        checked:true,
        option:{
          value1:'',
          value2:'',
          value3:'',
          value4:'',
        }
      }],
      // pod
      formThree:[{
        checked:true,
        option:{
          value1:'',
          value2:'',
          value3:'',
          value4:'',
        }
      },{
        checked:true,
        option:{
          value1:'',
          value2:'',
          value3:'',
          value4:'',
        }
      },{
        checked:true,
        option:{
          value1:'',
          value2:'',
          value3:'',
          value4:'',
        }
      },{
        checked:true,
        option:{
          value1:'',
          value2:'',
          value3:'',
          value4:'',
        }
      },{
        checked:true,
        option:{
          value1:'',
          value2:'',
          value3:'',
          value4:'',
        }
      },{
        checked:true,
        option:{
          value1:'',
          value2:'',
          value3:'',
          value4:'',
        }
      },{
        checked:true,
        option:{
          value1:'',
          value2:'',
          value3:'',
          value4:'',
        }
      },{
        checked:true,
        option:{
          value1:'',
          value2:'',
          value3:'',
          value4:'',
        }
      },{
        checked:true,
        option:{
          value1:'',
          value2:'',
          value3:'',
          value4:'',
        }
      },{
        checked:true,
        option:{
          value1:'',
          value2:'',
          value3:'',
          value4:'',
        }
      },{
        checked:true,
        option:{
          value1:'',
          value2:'',
          value3:'',
          value4:'',
        }
      },{
        checked:true,
        option:{
          value1:'',
          value2:'',
          value3:'',
          value4:'',
        }
      },{
        checked:true,
        option:{
          value1:'',
          value2:'',
          value3:'',
          value4:'',
        }
      },{
        checked:true,
        option:{
          value1:'',
          value2:'',
          value3:'',
          value4:'',
        }
      }]
    }
  },
  watch: {
    value() {
    }
  },
  methods: {
    onSubmit() {
      alert('已提交')
    }
  },
  props:["uid"],
  components: {
    HeadCom
  },
}
</script>
<style lang="scss" scoped>
.workload {
  width:200px;
  height:30px;
  background-color:white;
  margin-left:96px;
  line-height:30px;
  padding-left: 5px;
}
.init {
  margin:0;
}
.mt12 {
  margin-top:12px;
}
.p3 {
  padding:3px 0 3px 0;
}
.numberEnd {
  display: inline-block;
  width: 28px;
  height: 29px;
  text-align: center;
  line-height: 28px;
  border: 1px solid #cccccc;
}
.w100 {
  width: 100px !important;
}
.glw {
  width:80px;
  padding-left: 5px;
}
.el-checkbox {
  width: 18px;
  height: 18px;
}
.form-form {
  width: 950px;
  padding: 20px;
  background-color: #f2f2f2;
  display: table;
  font-size: 12px;
  line-height: 1.5
}
.form-form1 {
  width: 660px;
  padding: 20px;
  background-color: #f2f2f2;
  display: table;
  font-size: 12px;
  line-height: 1.5
}
.el-textarea {
  max-width:900px;
  width: 420px;
  padding-top: 5px;
  padding-bottom: 5px;
  // height: 100px;
}
.el-input {
  width:200px;
}
.back-hd {
  width: 100%;
  height: 51px;
  background: white;
  padding:15px;
  border-bottom: 1px solid #cccccc;
  font-size: 16px;
}
.hd-icon-back {
  font-weight: 900;
  font-size: 20px;
  color: #006eff;
  padding-right: 10px;
}
.log-div {
  display: inline-block;
  position: relative;
}
.log-input-red {
  border: 1px solid red;
  color:red;
}
.log-icon {
  position: absolute;
  top: 8px;
  right: 4px;
}
.log-input {
  width: 150px;
}
input {
  width: 200px;
  height: 28px;
  padding: 5px 10px;
  color: #eeeeee;
}
.tabs-size {
  width: 114px;
  height: 28px;
  font-size: 12px;
}
.active {
  width: 114px;
  height: 30px; 
  border: 1px solid #006eff;
  margin: auto;
  line-height: 30px;
}
.padding {
  padding:5px 0 5px 0;
}
.font-orange {
  color: #ff9d00;
}
.data-card-list {
  height: 28px;
  line-height: 28px;
}
.data-card-hd {
  width: 100px;
  height: 28px;
  line-height: 28px;
}
.flex {
  display: flex;
}
.font {
  font-size: 12px;
  color: #888888;
}
.app-tke-fe-content__inner {
  // padding: 20px;
  max-width: 1360px;
  margin:0 auto;
}
.tf-g {
  font-size: 0;
  // margin-bottom: 50px;
  // padding:20px;
  // background: pink;
}
.event-persistence {
  padding: 20px;
  background: white;
  // box-shadow: 0 1px 3px 0 rgba(0,0,0,.1);
}
.box-card{
  width:100%;
}
.room{
  padding:20px;
}
</style>
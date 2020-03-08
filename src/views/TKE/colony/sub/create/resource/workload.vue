<!-- 新建Workload -->
<template>
  <div class="colony-wrap">
    <div class="tke-content-header">
      <div class="tke-grid ">
        <!-- 左侧 -->
        <div class="grid-left">
          <span class="goback" @click="()=>$router.back()">
            <i class="el-icon-back"></i>
          </span>
          <h2 class="header-title">新建Workload</h2>
        </div>
        <!-- 右侧 -->
        <div class="grid-right"></div>
      </div>
    </div>
    <div class="colony-main">
      <div class="tke-card tke-formpanel-wrap mb60">
        <el-form class="tke-form special" ref="form" :model="wl" label-position="left" label-width="120px"
                 size="mini">
          <el-form-item label="名称" prop="name" :rules="nameValidator">
            <el-input class="w200" v-model="wl.name" placeholder="请输入Workload名称"></el-input>
            <p>
              最长40个字符，只能包含小写字母、数字及分隔符("-")，且必须以小写字母开头，数字或小写字母结尾
            </p>
          </el-form-item>
          <el-form-item label="描述">
            <el-input class="w420" type="textarea" :rows="6" placeholder="请输入描述信息，不超过1000个字符" v-model="wl.description">
            </el-input>
          </el-form-item>
          <!--  标签  用div包裹用于做验证   -->
          <div style="margin-bottom: 18px">
            <label style="width: 120px;vertical-align: middle;float: left;padding: 0 12px 0 0;line-height: 28px">标签</label>
            <div style="margin-left: 120px;">
              <div v-for="(v,i) in wl.labels" :key="i">
                <el-form-item style="display: inline-block" label-width="0px" :prop="`labels.${i}.key`" :rules="labelKeyValidator">
                  <el-input :disabled="i===0" class="w100" v-model="v.key"></el-input>
                </el-form-item>
                =
                <el-form-item style="display: inline-block" label-width="0px" :prop="`labels.${i}.value`" :rules="labelValueValidator">
                  <el-input class="w100" v-model="v.value" prop="labels"></el-input>
                </el-form-item>
                <el-tooltip class="item" effect="light" content="默认标签不可删除" placement="right"
                            :disabled="i===0">
                  <i class="el-icon-close" style="font-size:20px;margin-left:20px;cursor:pointer"
                     @click="i!==0?delLabel(i):''"></i>
                </el-tooltip>
              </div>
              <el-button type="text" size="mini" :disabled="!addLabelFlag" @click="addLabelFlag?addLabel():''">新增变量</el-button>
              <p style="line-height: 28px">
                最长40个字符，只能包含小写字母、数字及分隔符("-")，且必须以小写字母开头，数字或小写字母结尾
              </p>
            </div>
          </div>
          <el-form-item label="命名空间">
            <el-select v-model="wl.namespace" placeholder="请选择" @change="namespaceChange">
              <el-option v-for="item in namespaceOptions" :key="item.metadata.name" :label="item.metadata.name"
                         :value="item.metadata.name">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="类型">
            <div class="form-controls" style="width:350px">
              <el-radio-group class="tke-radio-group" v-model="wl.type">
                <el-radio label="Deployment">Deployment（可扩展的部署Pod）</el-radio>
                <el-radio label="daemonSet">DaemonSet（在每个主机上运行Pod）</el-radio>
                <el-radio label="statefulSet">StatefulSet（有状态集的运行Pod）</el-radio>
                <el-radio label="cronJob">CronJob（按照Cron的计划定时运行）</el-radio>
                <el-radio label="job">Job（单次任务）</el-radio>
              </el-radio-group>
            </div>
          </el-form-item>
          <el-form-item label="执行策略" v-show="wl.type=='cronJob'" :prop="'executionStrategy'" :rules="executionStrategyValidator">
            <el-input class="w192" placeholder="请输入执行策略,如0 0 2 1 *" v-model="wl.executionStrategy"></el-input>
          </el-form-item>
          <!-- Job设置 -->
          <div style="margin-bottom: 18px" v-show="wl.type==='cronJob'||wl.type==='job'">
            <label style="width: 120px;vertical-align: middle;float: left;padding: 0 12px 0 0;line-height: 28px">Job设置</label>
            <div style="margin-left: 120px;background-color: #f2f2f2;padding: 10px;width: 350px">
              <el-form-item label="重复次数" :prop="'jobSettings.repeatNumber'" :rules="jobSettingRepeatValidator">
                <el-tooltip class="item" effect="light" content="该Job下的Pod需要重复执行次数" placement="right">
                  <i class="el-icon-info setPosition2"></i>
                </el-tooltip>
                <el-input class="w192" v-model="wl.jobSettings.repeatNumber"></el-input>
              </el-form-item>
              <el-form-item label="并行度" :prop="'jobSettings.parallelNumber'" :rules="jobSettingParallelValidator">
                <el-tooltip class="item" effect="light" content="该Job下Pod并行执行的数量" placement="right">
                  <i class="el-icon-info  setPosition2"></i>
                </el-tooltip>
                <el-input class="w192" v-model="wl.jobSettings.parallelNumber"></el-input>
              </el-form-item>
              <el-form-item label="失败重启策略">
                <el-tooltip class="item" effect="light"
                            content="Pod下容器异常推出后的重启策略， Never：不重启容器，直至Pod下所有容器退出; OnFailure : Pod继续运行，容器将重新启动"
                            placement="right">
                  <i class="el-icon-info  setPosition2"></i>
                </el-tooltip>
                <el-select v-model="wl.jobSettings.failedRestartPolicy" placeholder="请选择" class="w192">
                  <el-option v-for="item in failedRestartPolicyOption"
                             :key="item" :label="item" :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
          </div>
          <el-form-item label="数据卷（选填）">
            <div class="search-one" v-show="dataFlag" v-for="(item, index) in wl.dataJuan" :key="index">
              <el-select v-model="item.name1" placeholder="请选择">
                <el-option v-for="item in searchOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
              <el-input class="search-input" v-model="item.name2" placeholder="请输入内容"></el-input>
              <div class="search-hidden">
                <p v-if="item.name1 == 'usePath'">
                  暂未设置主机路径设置主机路径
                  <span class="add-check" @click="dialogVisiblePath = true">主机路径设置</span>
                </p>
                <p v-if="item.name1 == 'useNFS'">
                  <el-input class="search-input" v-model="item.name3" placeholder="NFS路径 如：127.0.0.1:/dir"></el-input>
                </p>
                <p v-if="item.name1 == 'usePVC'">
                  <el-select v-model="item.name3" :disabled="usePvcOptions.length == 0" :placeholder="
                      usePvcOptions.length == 0 ? '暂无数据' : '请选择'
                    ">
                    <el-option v-for="item in usePvcOptions" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </p>
                <p v-if="item.name1 == 'useYun'">
                  <span class="add-check" @click="selectYun">选择云硬盘</span>&nbsp;&nbsp;
                  <el-tooltip class="item" effect="light" content="数据卷类型为腾讯云硬盘，实例数量最大为1" placement="top">
                    <i style="cursor:pointer" class="el-icon-warning"></i>
                  </el-tooltip>
                </p>
                <p v-if="item.name1 == 'useConfig'">
                  暂未选择ConfigMap
                  <span class="add-check" @click="selectConfig">选择配置项</span>
                </p>
                <p v-if="item.name1 == 'useSecret'">
                  暂未选择Secret
                  <span class="add-check" @click="selectSecret">选择Secret</span>
                </p>
              </div>
              <i class="el-icon-close" @click="delDataJuan(index)"></i>
            </div>
            <p>
              <el-button type="text" :disabled="yesOrnoAddDataJuan" @click="addDataJuan">添加数据卷</el-button>
            </p>
            <p>为容器提供存储，目前支持临时路径、主机路径、云硬盘数据卷、文件存储NFS、配置文件、PVC，还需挂载到容器的指定路径中。
              <span style="color:#409eff;cursor:pointer">使用指引</span>
            </p>
          </el-form-item>
          <!-- 实例内容器 -->
          <div style="margin-bottom: 18px">
            <label style="width: 120px;vertical-align: middle;float: left;padding: 0 12px 0 0;line-height: 28px">实例内容器</label>
            <div style="margin-left: 120px">
              <div v-for="(v,i) in wl.instanceContent" :key="i">
                <div v-show="v.editStatus" class="case-content" style="margin-bottom: 18px">
                  <el-form-item style="margin-bottom: 0px">
                    <div style="float: right">
                      <el-tooltip effect="light" content="请完成待编辑项" placement="top" :disabled="v.completed">
                        <i class="el-icon-check"
                           style="font-size:20px;margin-left:20px;"
                           :style="{cursor: v.completed?'pointer':'no-drop'}"
                           @click="v.completed?editInstanceContent(i):''">
                        </i>
                      </el-tooltip>
                      <el-tooltip effect="light" content="不可删除，至少创建一个容器" placement="top" :disabled="wl.instanceContent.length!==1">
                        <i class="el-icon-close"
                           style="font-size:20px;margin-left:20px;cursor:pointer"
                           @click="wl.instanceContent.length!==1?delInstanceContent(i):''">
                        </i>
                      </el-tooltip>
                    </div>
                  </el-form-item>
                  <el-form-item label="名称" :rules="instanceContentNameValidator" :prop="`instanceContent.${i}.name`" >
                    <el-input class="w192" v-model="v.name" placeholder="请输入容器名称" ></el-input>
                    <p>请输入容器名称最长63个字符，只能包含小写字母、数字及分隔符("-")，且不能以分隔符开头或结尾</p>
                  </el-form-item>
                  <el-form-item label="镜像" :rules="instanceContentMirrorImgValidator" :prop="`instanceContent.${i}.mirrorImg`">
                    <el-input class="w192" v-model="v.mirrorImg"></el-input>
                    <el-button type="text" size="mini" @click="SelectMirrorImgFlag=true">选择镜像</el-button>
                    <SelectMirrorImg :dialogVisible.sync='SelectMirrorImgFlag' @confirm='confirmMirrorImg($event, i)'></SelectMirrorImg>
                  </el-form-item>
                  <el-form-item label="镜像版本（Tag）">
                    <el-input class="w192" v-model="v.versions"></el-input>
                  </el-form-item>
                  <el-form-item label="镜像拉取策略">
                    <template>
                      <el-radio-group v-model="v.mirrorPullTactics" style="margin-bottom: 5px;">
                        <el-radio-button label="Always">Always</el-radio-button>
                        <el-radio-button label="IfNotPresent">IfNotPresent</el-radio-button>
                        <el-radio-button label="Never">Never</el-radio-button>
                      </el-radio-group>
                      <p v-show="v.mirrorPullTactics === ''">若不设置镜像拉取策略，当镜像版本为空或:latest时，使用Always策略，否则使用IfNotPresent策略</p>
                      <p v-show="v.mirrorPullTactics === 'Always'">总是从远程拉取该镜像</p>
                      <p v-show="v.mirrorPullTactics === 'IfNotPresent'">默认使用本地镜像，若本地无该镜像则远程拉取该镜像</p>
                      <p v-show="v.mirrorPullTactics === 'Never'">只使用本地镜像，若本地没有该镜像将报异常</p>
                    </template>
                  </el-form-item>
                  <el-form-item label="挂载点" v-show="wl.dataJuan.length > 0">
                    <div v-show="showMountPoint" v-for="(point,i) in wl.pointList" :key="i">
                      <el-select v-model="wl.pointName"></el-select>
                      <el-input v-model="wl.mountPath"></el-input>
                      <el-input v-model="wl.subPath"></el-input>
                      <el-select></el-select>
                    </div>
                    <el-button type="text" @click="changIsShowmount()">添加挂载点</el-button>
                  </el-form-item>
                  <el-form-item label="CPU/内存限制">
                    <div class="cpu-limit">
                      <div>
                        <p>CPU限制</p>
                        <div style="display:flex">
                          <div class="cpu-limit2">
                            <span>request</span>
                            <el-input class="w192" v-model="v.requestCpu"></el-input>
                          </div>
                          -
                          <div class="cpu-limit2">
                            <span>limit</span>
                            <el-input class="w192" v-model="v.limitCpu"></el-input>
                          </div>
                          核
                        </div>
                      </div>
                      <div>
                        <p>内存限制</p>
                        <div style="display:flex">
                          <div class="cpu-limit2">
                            <span>request</span>
                            <el-input class="w192" v-model="v.requestMemory"></el-input>
                          </div>
                          -
                          <div class="cpu-limit2">
                            <span>limit</span>
                            <el-input class="w192" v-model="v.limitMemory"></el-input>
                          </div>
                          Mib
                        </div>
                      </div>
                    </div>
                    <p style="margin-top:10px;">
                      Request用于预分配资源,当集群中的节点没有request所要求的资源数量时,容器会创建失败。Limit用于设置容器使用资源的最大上限,避免异常情况下节点资源消耗过多。</p>
                  </el-form-item>
                  <el-form-item label="GPU限制">
                    <el-input-number v-model="v.gpuNum" size="small" :min="0"></el-input-number> 个
                  </el-form-item>
                  <div style="margin-bottom: 18px">
                    <label style="width: 120px;vertical-align: middle;float: left;padding: 0 12px 0 0;line-height: 28px">环境变量</label>
                    <div style="margin-left: 120px; position: relative">
                      <el-tooltip class="item" effect="light" content="设置容器中的变量" placement="top">
                        <i class="el-icon-info  setPosition"></i>
                      </el-tooltip>
                      <!-- 新增变量 -->
                      <div v-for="val in v.environmentVar" :key="val.onlyId">
                        <el-form-item style="display: inline-block;margin-bottom: 0px" label-width="0px">
                          <el-input class="w100" v-model="val.key" placeholder="变量名"></el-input>
                        </el-form-item>
                        =
                        <el-form-item style="display: inline-block;margin-bottom: 0px" label-width="0px">
                          <el-input class="w192" v-model="val.value" placeholder="变量值"></el-input>
                        </el-form-item>
                        <i class="el-icon-close" style="font-size:20px;margin-left:20px;cursor:pointer" @click="delEnvironmentVar(i, val.onlyId)"></i>
                      </div>
                      <el-divider v-if="v.environmentVar.length>0&&v.citeCs.length>0"></el-divider>
                      <!-- 引用ConfigMap/Secret -->
                      <div v-for="val in v.citeCs" :key="val.key">
                        <el-form-item style="display: inline-block;margin-bottom: 0px" label-width="0px">
                          <el-select v-model="val.value1" class="w100" placeholder="请选择类型" @change="citeCsValue1Change($event, val)">
                            <el-option v-for="item in val.option1" :key="item" :label="item" :value="item">
                            </el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item style="display: inline-block;margin-bottom: 0px" label-width="0px">
                          <el-select v-model="val.value2" class="w100" style="margin:0px 10px;"
                                     placeholder="请选择资源" :disabled="val.value1===''" @change="citeCsValue2Change($event, val)">
                            <el-option v-for="item in val.option2" :key="item.name" :label="item.name"
                                       :value="item.name">
                            </el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item style="display: inline-block;margin-bottom: 0px" label-width="0px">
                          <el-select v-model="val.value3" class="w100" placeholder="请选择key" :disabled="val.value2===''">
                            <el-option v-for="item in val.option3" :key="item" :label="item"
                                       :value="item">
                            </el-option>
                          </el-select></el-form-item>
                        以
                        <el-form-item style="display: inline-block;margin-bottom: 0px" label-width="0px">
                          <el-input class="w150" v-model="val.input1"></el-input>
                        </el-form-item>
                        为别名
                        <i class="el-icon-close" style="font-size:20px;margin-left:20px;cursor:pointer" @click="delCiteCs(i, val.key)"></i>
                      </div>
                      <el-button type="text" size="mini" @click='addEnvironmentVar(i)'>新增变量</el-button>
                      <el-button type="text" size="mini" @click='addCiteCs(i)'>引用ConfigMap/Secret</el-button>
                      <p>只能包含字母、数字及分隔符("-"、"_"、".")，且必须以字母开头</p>
                    </div>
                  </div>
                  <div v-show="v.disAdvancedSetting">
                    <el-form-item label="工作目录">
                      <el-input class="w192" v-model="wl.name"></el-input>
                      <p> 指定容器运行后的工作目录，<a href="#">查看详情</a></p>
                    </el-form-item>
                    <el-form-item label="运行命令">
                      <el-input type="textarea" class="w400" v-model="wl.name" rows="3" resize="none"></el-input>
                      <p> 控制容器运行的输入命令，<a href="#">查看详情</a></p>
                    </el-form-item>
                    <el-form-item label="运行参数">
                      <el-input type="textarea" class="w400" v-model="wl.name" rows="3" resize="none"></el-input>
                      <p>传递给容器运行命令的输入参数，注意每个参数单独一行，<a href="#">查看详情</a></p>
                    </el-form-item>
                    <el-form-item label="容器健康检查">
                      <el-tooltip class="item" effect="light" content="健康检查可以帮助你探测容器是否正常，以保证服务的正常运作" placement="top">
                        <i class="el-icon-info  setPosition2"></i>
                      </el-tooltip>
                      <p>
                        <el-checkbox v-model="v.surviveExamine">存活检查</el-checkbox>
                        <span>检查容器是否正常，不正常则重启实例</span>
                      </p>
                      <!-- 存活检查 -->
                      <div v-show="v.surviveExamine" class="from-1">
                        <!-- 存活检查 -->
                        <div style="background: #f2f2f2;padding: 6px;">
                          <el-form-item label="检查方法">
                            <el-select v-model="v.surviveExamineContent.inspectMethodValue">
                              <el-option v-for="item in v.surviveExamineContent.inspectMethodOption" :key="item" :label="item"
                                         :value="item">
                              </el-option>
                            </el-select>
                          </el-form-item>
                          <el-form-item label="检查协议" v-show="v.surviveExamineContent.inspectMethodValue==='HTTP请求检查'">
                            <el-select v-model="v.surviveExamineContent.inspectProtocolValue">
                              <el-option v-for="item in v.surviveExamineContent.inspectProtocolOption" :key="item" :label="item"
                                         :value="item">
                              </el-option>
                            </el-select>
                          </el-form-item>
                          <el-form-item label="执行命令" v-show="v.surviveExamineContent.inspectMethodValue==='执行命令检查'">
                            <el-input type="textarea" class="w192" v-model="v.surviveExamineContent.executiveOrder" rows="4" resize="none"></el-input>
                          </el-form-item>
                          <el-form-item label="检查端口" v-show="v.surviveExamineContent.inspectMethodValue!=='执行命令检查'">
                            <el-input class="w100" v-model="v.surviveExamineContent.inspectPort"></el-input>
                            <span>端口范围：1~65535</span>
                          </el-form-item>
                          <el-form-item label="请求路径" v-show="v.surviveExamineContent.inspectMethodValue==='HTTP请求检查'">
                            <el-input class="w100" v-model="v.surviveExamineContent.requestPath"></el-input>
                          </el-form-item>
                          <el-form-item label="启动延时">
                            <el-tooltip effect="light" content="容器延时启动健康检查的时间，范围：0~60秒" placement="right">
                              <i class="el-icon-info  setPosition"></i>
                            </el-tooltip>
                            <el-input class="w100" v-model="v.surviveExamineContent.startDelay"></el-input>
                            <span>范围：0~60秒</span>
                          </el-form-item>
                          <el-form-item label="响应超时">
                            <el-tooltip effect="light" content="每次健康检查响应的最大超时时间，范围：2~60秒" placement="right">
                              <i class="el-icon-info  setPosition"></i>
                            </el-tooltip>
                            <el-input class="w100" v-model="v.surviveExamineContent.responseTimeout"></el-input>
                            <span>范围：2~60秒</span>
                          </el-form-item>
                          <el-form-item label="间隔时间">
                            <el-tooltip effect="light" content="进行健康检查的时间间隔，范围：大于响应超时，小于300秒" placement="right">
                              <i class="el-icon-info  setPosition"></i>
                            </el-tooltip>
                            <el-input class="w100" v-model="v.surviveExamineContent.intervalTime"></el-input>
                            <span>范围：2~300秒</span>
                          </el-form-item>
                          <el-form-item label="健康阙值">
                            <el-tooltip effect="light" content="表示后端容器从失败到成功的连续健康检查成功次数，范围：只能为1" placement="right">
                              <i class="el-icon-info  setPosition"></i>
                            </el-tooltip>
                            <el-input class="w100" v-model="v.surviveExamineContent.healthyThreshold"></el-input>
                            <span>范围：1次</span>
                          </el-form-item>
                          <el-form-item label="不健康阙值">
                            <el-tooltip effect="light" content="表示后端容器从成功到失败的连续健康检查成功次数，范围：1~10次" placement="right">
                              <i class="el-icon-info  setPosition3"></i>
                            </el-tooltip>
                            <el-input class="w100" v-model="v.surviveExamineContent.unhealthyThreshold"></el-input>
                            <span>范围：1~10次</span>
                          </el-form-item>
                        </div>
                      </div>
                      <p>
                        <el-checkbox v-model="v.readyToCheck">就绪检查</el-checkbox>
                        <span>检查容器是否就绪，不就绪则停止转发流量到当前实例</span>
                      </p>
                      <!-- 存活检查 -->
                      <div v-show="v.readyToCheck" class="from-1">
                        <!-- 就绪检查 -->
                        <div style="background: #f2f2f2;padding: 6px;">
                          <el-form-item label="检查方法">
                            <el-select v-model="v.readyToCheckContent.inspectMethodValue">
                              <el-option v-for="item in v.readyToCheckContent.inspectMethodOption" :key="item" :label="item"
                                         :value="item">
                              </el-option>
                            </el-select>
                          </el-form-item>
                          <el-form-item label="检查协议" v-show="v.readyToCheckContent.inspectMethodValue==='HTTP请求检查'">
                            <el-select v-model="v.readyToCheckContent.inspectProtocolValue">
                              <el-option v-for="item in v.readyToCheckContent.inspectProtocolOption" :key="item" :label="item"
                                         :value="item">
                              </el-option>
                            </el-select>
                          </el-form-item>
                          <el-form-item label="执行命令" v-show="v.readyToCheckContent.inspectMethodValue==='执行命令检查'">
                            <el-input type="textarea" class="w192" v-model="v.readyToCheckContent.executiveOrder" rows="4" resize="none"></el-input>
                          </el-form-item>
                          <el-form-item label="检查端口" v-show="v.readyToCheckContent.inspectMethodValue!=='执行命令检查'">
                            <el-input class="w100" v-model="v.readyToCheckContent.inspectPort"></el-input>
                            <span>端口范围：1~65535</span>
                          </el-form-item>
                          <el-form-item label="请求路径" v-show="v.readyToCheckContent.inspectMethodValue==='HTTP请求检查'">
                            <el-input class="w100" v-model="v.readyToCheckContent.requestPath"></el-input>
                          </el-form-item>
                          <el-form-item label="启动延时">
                            <el-tooltip effect="light" content="容器延时启动健康检查的时间，范围：0~60秒" placement="right">
                              <i class="el-icon-info  setPosition"></i>
                            </el-tooltip>
                            <el-input class="w100" v-model="v.readyToCheckContent.startDelay"></el-input>
                            <span>范围：0~60秒</span>
                          </el-form-item>
                          <el-form-item label="响应超时">
                            <el-tooltip effect="light" content="每次健康检查响应的最大超时时间，范围：2~60秒" placement="right">
                              <i class="el-icon-info  setPosition"></i>
                            </el-tooltip>
                            <el-input class="w100" v-model="v.readyToCheckContent.responseTimeout"></el-input>
                            <span>范围：2~60秒</span>
                          </el-form-item>
                          <el-form-item label="间隔时间">
                            <el-tooltip effect="light" content="进行健康检查的时间间隔，范围：大于响应超时，小于300秒" placement="right">
                              <i class="el-icon-info  setPosition"></i>
                            </el-tooltip>
                            <el-input class="w100" v-model="v.readyToCheckContent.intervalTime"></el-input>
                            <span>范围：2~300秒</span>
                          </el-form-item>
                          <el-form-item label="健康阙值">
                            <el-tooltip effect="light" content="表示后端容器从失败到成功的连续健康检查成功次数，范围：只能为1" placement="right">
                              <i class="el-icon-info  setPosition"></i>
                            </el-tooltip>
                            <el-input class="w100" v-model="v.readyToCheckContent.healthyThreshold"></el-input>
                            <span>范围：1次</span>
                          </el-form-item>
                          <el-form-item label="不健康阙值">
                            <el-tooltip effect="light" content="表示后端容器从成功到失败的连续健康检查成功次数，范围：1~10次" placement="right">
                              <i class="el-icon-info  setPosition3"></i>
                            </el-tooltip>
                            <el-input class="w100" v-model="v.readyToCheckContent.unhealthyThreshold"></el-input>
                            <span>范围：1~10次</span>
                          </el-form-item>
                        </div>
                      </div>
                      <p>查看健康检查和就绪检查<a href="#">使用指引</a></p>
                    </el-form-item>
                    <el-form-item label="特权级容器">
                      <el-switch active-color="#006eff" inactive-color="#888" v-model="v.privilegeLevelContainer"></el-switch>
                      <p> 容器开启特权级，将拥有宿主机的root权限 </p>
                    </el-form-item>
                  </div>
                  <div>
                    <el-button type="text" size="mini" @click="v.disAdvancedSetting = !v.disAdvancedSetting">
                      {{v.disAdvancedSetting?'隐藏高级设置':'显示高级设置'}}
                    </el-button>
                  </div>
                </div>
                <div v-show="!v.editStatus" class="case-content" style="margin-bottom: 18px">
                  <el-form-item style="margin-bottom: 0px" label-width="0px">
                    <div style="float: left">{{v.name}} ({{v.mirrorImg}}) </div>
                    <div style="float: right">
                      <el-tooltip effect="light" content="请完成待编辑项" placement="top" :disabled="v.completed">
                        <i class="el-icon-edit-outline"
                           style="font-size:20px;margin-left:20px;cursor:pointer"
                           @click="v.completed?editInstanceContent(i):''">
                        </i>
                      </el-tooltip>
                      <el-tooltip effect="light" content="不可删除，至少创建一个容器" placement="top" :disabled="wl.instanceContent.length!==1">
                        <i class="el-icon-close"
                           style="font-size:20px;margin-left:20px;cursor:pointer"
                           @click="wl.instanceContent.length!==1?delInstanceContent(i):''">
                        </i>
                      </el-tooltip>
                    </div>
                  </el-form-item>
                </div>
              </div>
              <p class="addcontent" :style="{color: isAddContainer?'#006eff':'#bbbbbb'}" @click="isAddContainer?addInstanceContent():''">添加容器</p>
              <p>注意：Workload创建完成后，容器的配置信息可以通过更新YAML的方式进行修改</p>
            </div>
          </div>
          <!-- 实例数量 -->
          <div style="margin-bottom: 18px">
            <label style="width: 120px;vertical-align: middle;float: left;padding: 0 12px 0 0;line-height: 28px">实例数量</label>
            <div style="margin-left: 120px">
              <el-form-item label-width="0px">
                <el-radio-group v-model="wl.caseNum">
                  <el-radio label="handAdjust">手动调节</el-radio>
                  <el-radio label="autoAdjust">自动调节</el-radio>
                </el-radio-group>
              </el-form-item>
              <!-- 手动调节 -->
              <div v-show="wl.caseNum==='handAdjust'">
                <p style="line-height: 28px">直接设定实例数量</p>
                <div class="case-content" style="background-color: #f2f2f2;margin-top:6px;padding:20px;">
                  <el-form-item label="实例数量" style="margin-bottom: 0px">
                    <el-input-number v-model="wl.replicas" size="small" :min="0"></el-input-number> 个
                  </el-form-item>
                </div>
              </div>
              <!-- 自动调节 -->
              <div v-show="wl.caseNum==='autoAdjust'">
                <p style="line-height: 28px">满足任一设定条件，则自动调节实例（pod）数目<a href="#">查看更多</a></p>
                <div class="case-content" style="background-color: #f2f2f2;margin-top:6px;padding:20px;">
                  <el-form-item label="触发策略">
                    <div class="flex bottom10" v-for="(item,index) in wl.touchTactics" :key="index">
                      <el-select class="w100" v-model="item.touch1">
                        <el-option v-for="item in touchOptions1" :key="item.value" :label="item.label"
                                   :value="item.value">
                        </el-option>
                      </el-select>
                      <el-select class="w192  margin-middle" v-model="item.touch2">
                        <el-option v-for="touth2item in item.touch2Option" :key="touth2item.value" :label="touth2item.label"
                                   :value="touth2item.value">
                        </el-option>
                      </el-select>
                      <el-input class="w100" v-model="item.size"></el-input>
                      <span v-if='item.touch2 === 1'>核</span>
                      <el-tooltip
                        v-if='item.touch2 === 2||item.touch2 === 3||item.touch2 === 4||item.touch2 === 7||item.touch2 === 8||item.touch2 === 9||item.touch2 === 10||item.touch2 === 11||item.touch2 === 12'
                        class="item" effect="light" content="阙值范围0-100" placement="right">
                        <span>%</span>
                      </el-tooltip>
                      <span v-if='item.touch2 === 5||item.touch2 === 6'>MiB</span>
                      <span v-if='item.touch2 === 13||item.touch2 === 14||item.touch2 === 19||item.touch2 === 20'>KB/s</span>
                      <span v-if='item.touch2 === 15||item.touch2 === 16'>次/s</span>
                      <span v-if='item.touch2 === 17||item.touch2 === 18'>Mbps</span>
                      <span v-if='item.touch2 === 21||item.touch2 === 22'>个</span>
                      <el-tooltip effect="light" content="至少保留一个指标" placement="right" :disabled="wl.touchTactics.length!==1">
                        <i class="el-icon-close" style="font-size:20px;margin-left:20px;cursor:pointer" @click="wl.touchTactics.length>1?delTouchTactics(item.key):''"></i>
                      </el-tooltip>
                    </div>
                    <el-button type="text" size="mini" @click="addTouchTactics">新增指标</el-button>
                  </el-form-item>
                  <el-form-item label="实例范围">
                    <el-input class="w100" v-model="wl.caseScope1"></el-input> ~ <el-input class="w100" v-model="wl.caseScope2"></el-input>
                    <p>在设定的实例范围内自动调节，不会超出该设定范围</p>
                  </el-form-item>
                </div>
              </div>
            </div>
          </div>
          <!-- 高级设置 -->
          <div v-show="highLevelSetShow2">
            <!-- imagePullSecrets -->
            <div style="margin-bottom: 18px">
              <label style="width: 120px;vertical-align: middle;float: left;padding: 0 12px 0 0;line-height: 28px">imagePullSecrets</label>
              <div style="margin-left: 120px">
                <el-form-item label-width="0px">
                  <el-select v-model="wl.imagePullSecrets.value1" :disabled="wl.imagePullSecrets.option1.length == 0" :placeholder="wl.imagePullSecrets.option1.length == 0 ? '暂无数据' : '请选择'">
                    <el-option v-for="item in wl.imagePullSecrets.option1" :key="item" :label="item" :value="item"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label-width="0px">
                  <el-select v-model="wl.imagePullSecrets.value2" :disabled="wl.imagePullSecrets.option2.length == 0" :placeholder="wl.imagePullSecrets.option2.length == 0 ? '暂无数据' : '请选择'">
                    <el-option v-for="item in wl.imagePullSecrets.option2" :key="item" :label="item" :value="item"></el-option>
                  </el-select>
                </el-form-item>
                <el-button type="text" size="mini" :disabled="true">添加</el-button>
              </div>
            </div>
            <div v-show="wl.type!=='cronJob'&&wl.type!=='job'">
              <el-form-item label="更新方式">
                <el-select v-model="wl.updateWay">
                  <el-option label="滚动更新（推荐）" value="滚动更新（推荐）"></el-option>
                  <el-option label="快速更新" value="快速更新"></el-option>
                </el-select>
                <p v-show="wl.updateWay=='滚动更新（推荐）'"> 对实例进行逐个更新，这种方式可以让您不中断业务实现对服务的更新</p>
                <p v-show="wl.updateWay=='快速更新'"> 直接关闭所有实例，启动相同数量的新实例</p>
              </el-form-item>
              <div v-show="wl.updateWay=='滚动更新（推荐）'">
                <el-form-item label="更新间隔">
                  <el-input class="w100" v-model="wl.updateInterval"></el-input> 秒
                </el-form-item>
                <el-form-item label="更新策略">
                  <el-radio-group v-model="wl.updateTactics">
                    <el-radio :label="1">启动新的Pod,停止旧的Pod</el-radio>
                    <el-radio :label="2">停止旧的Pod，启动新的Pod</el-radio>
                    <el-radio :label="3">自定义</el-radio>
                  </el-radio-group>
                  <p v-show="wl.updateTactics===1">请确认集群有足够的CPU和内存用于启动新的Pod, 否则可能导致集群崩溃</p>
                </el-form-item>
                <!-- 策略配置 -->
                <div style="margin-bottom: 18px">
                  <label style="width: 120px;vertical-align: middle;float: left;padding: 0 12px 0 0;line-height: 28px">策略配置</label>
                  <div style="margin-left: 120px;width: 350px;" class="form-controls" v-show="wl.updateTactics !== 3">
                    <el-form-item label="Pods">
                      <el-input class="w192" placeholder="正整数或者正百分数（default: 25%）" v-model="wl.configTacticsPods"></el-input>
                      <p>Pod将批量启动或停止</p>
                    </el-form-item>
                  </div>
                  <div style="margin-left: 120px;width: 350px;" class="form-controls" v-show="wl.updateTactics === 3">
                    <el-form-item label="MaxSurge">
                      <el-input class="w192" placeholder="0、正整数或者正百分数（default: 25%）" v-model="wl.configTacticsMaxSurge"></el-input>
                      <p>允许超出所需规模的最大Pod数量</p>
                    </el-form-item>
                    <el-form-item label="MaxUnavailable">
                      <el-input class="w192" placeholder="0、正整数或者正百分数（default: 25%）" v-model="wl.configTacticsMaxUnavailable"></el-input>
                      <p>允许最大不可用的Pod数量</p>
                    </el-form-item>
                  </div>
                </div>
              </div>
            </div>
            <div style="margin-bottom: 18px">
              <label style="width: 120px;vertical-align: middle;float: left;padding: 0 12px 0 0;line-height: 28px">节点调度策略</label>
              <div style="margin-left: 120px">
                <el-form-item label-width="0px">
                  <el-radio-group v-model="wl.nodeTactics">
                    <el-radio :label="1">不使用调度策略</el-radio>
                    <el-radio :label="2">指定节点调度</el-radio>
                    <el-radio :label="3">自定义调度规则</el-radio>
                  </el-radio-group>
                </el-form-item>
                <p>可根据调度规则，将Pod调度到符合预期的Label的节点中。设置工作负载的调度规则指引</p>
              </div>
            </div>
            <!-- 指定节点调度 -->
            <div style="margin-bottom: 18px" v-show="wl.nodeTactics===2">
              <div style="margin-left: 120px;width: 350px" class="form-controls">
                <p style="line-height: 28px">台北一区</p>
                <el-form-item label-width="0px">
                  <el-checkbox-group v-model="wl.specifyNodeDispatchValue">
                    <div v-for="item in specifyNodeDispatchOption" :key="item">
                      <el-checkbox :label="item"></el-checkbox>
                    </div>
                  </el-checkbox-group>
                </el-form-item>
              </div>
            </div>
            <!-- 自定义调度规则 -->
            <!-- 强制满足条件 -->
            <div style="margin-bottom: 18px" v-show="wl.nodeTactics===3">
              <label style="width: 120px;vertical-align: middle;float: left;padding: 0 12px 0 0;line-height: 28px">强制满足条件</label>
              <div style="margin-left: 120px; position: relative">
                <el-tooltip class="item" effect="light" content="调度期间如果满足其中一个亲和性条件则调度到对应node，如果没有节点满足条件则调度失败。"
                            placement="right">
                  <i class="el-icon-info  setPosition2"></i>
                </el-tooltip>
                <div class="case-content" style="margin-bottom: 18px" v-for="(val1,index1) in wl.mustCondition" :key="index1">
                  <i class="el-icon-close set-i1" @click="delMustCondition(idx)"></i>
                  <div style="clear: both; margin-bottom:10px"></div>
                  <div>
                    <label style="width: 120px;vertical-align: middle;float: left;padding: 0 12px 0 0;line-height: 28px">条件</label>
                    <div style="margin-left: 120px; position: relative">
                      <el-tooltip class="item" effect="light" content="多个规则为同时满足" placement="right">
                        <i class="el-icon-info setPosition"></i>
                      </el-tooltip>
                      <div v-for="(val2,index2) in val1" :key="index2">
                        <el-form-item style="display: inline-block" label-width="0px">
                          <el-input class="w150" v-model="val2.name"></el-input>
                        </el-form-item>
                        <el-form-item style="display: inline-block" label-width="0px">
                          <el-select v-model="val2.connect" class="w100" style="margin:0px 10px;">
                            <el-option v-for="item in conditionOptions" :key="item.value" :label="item.label"
                                       :value="item.value">
                            </el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item style="display: inline-block" label-width="0px">
                          <el-input class="w150" v-model="val2.rule"></el-input>
                        </el-form-item>
                        <el-tooltip class="item" effect="light" content="至少配置一个选择器" placement="right" :disabled="val1.length!==1">
                          <i class="el-icon-close" style="font-size: 18px; padding-left: 20px;cursor:pointer" @click="val1.length>1?delMustRule(index1, index2):''"></i>
                        </el-tooltip>
                      </div>
                      <p>
                        <el-button type="text" size="mini" @click="addMustRule(index1)">添加规则</el-button>
                      </p>
                    </div>
                  </div>
                </div>
                <el-button type="text" size="mini" @click="addMustCondition">添加条件</el-button>
              </div>
            </div>
            <!-- 尽量满足条件 -->
            <div style="margin-bottom: 18px" v-show="wl.nodeTactics===3">
              <label style="width: 120px;vertical-align: middle;float: left;padding: 0 12px 0 0;line-height: 28px">尽量满足条件</label>
              <div style="margin-left: 120px;position: relative">
                <el-tooltip class="item" effect="light" content="调度期间如果满足其中一个亲和性条件则调度到对应node，如果没有节点满足条件则随机调度到任意节点。"
                            placement="right">
                  <i class="el-icon-info  setPosition2"></i>
                </el-tooltip>
                <div class="case-content" style="margin-bottom: 18px"  v-for="(val1,index1) in wl.needCondition" :key="index1">
                  <i class="el-icon-close set-i1" @click="delNeedCondition(idx)"></i>
                  <div style="clear: both; margin-bottom:10px"></div>
                  <div>
                    <el-form-item label="权重">
                      <el-input v-model="val1.weight" class="w150"></el-input>
                    </el-form-item>
                  </div>
                  <div>
                    <label style="width: 120px;vertical-align: middle;float: left;padding: 0 12px 0 0;line-height: 28px">条件</label>
                    <div style="margin-left: 120px; position: relative">
                      <el-tooltip class="item" effect="light" content="多个规则为同时满足" placement="right">
                        <i class="el-icon-info setPosition"></i>
                      </el-tooltip>
                      <div v-for="(val2,index2) in val1.arr" :key="index2">
                        <el-form-item style="display: inline-block" label-width="0px">
                          <el-input class="w150" v-model="val2.name"></el-input>
                        </el-form-item>
                        <el-form-item style="display: inline-block" label-width="0px">
                          <el-select v-model="val2.connect" class="w100" style="margin:0px 10px;">
                            <el-option v-for="item in conditionOptions" :key="item.value" :label="item.label"
                                       :value="item.value">
                            </el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item style="display: inline-block" label-width="0px">
                          <el-input class="w150" v-model="val2.rule"></el-input>
                        </el-form-item>
                        <el-tooltip class="item" effect="light" content="至少配置一个选择器" placement="right" :disabled="val1.arr.length!==1">
                          <i class="el-icon-close" style="font-size: 18px; padding-left: 20px;cursor:pointer" @click="val1.arr.length>1?delNeedRule(index1, index2):''"></i>
                        </el-tooltip>
                      </div>
                      <p>
                        <el-button type="text" size="mini" @click="addNeedRule(index1)">添加规则</el-button>
                      </p>
                    </div>
                  </div>
                </div>
                <el-button type="text" size="mini" @click="addNeedCondition">添加条件</el-button>
              </div>
            </div>
          </div>
          <div><el-button type="text" size="mini" @click="highLevelSetShow2=!highLevelSetShow2">{{highLevelSetShow2?'隐藏高级设置':'显示高级设置'}}</el-button></div>
          <el-divider></el-divider>
          <div v-show="wl.type === 'Deployment' || wl.type==='statefulSet'">
            <h3 style="margin-bottom:11px;">访问设置(Service)</h3>
            <el-form-item label="Service">
              <el-checkbox v-model="wl.serviceEnbel">启用</el-checkbox>
            </el-form-item>
            <div v-if="wl.serviceEnbel">
              <el-form-item label="服务访问方式">
                <el-radio v-model="wl.serviceAccess" label="1">提供公网访问</el-radio>
                <el-radio v-model="wl.serviceAccess" label="2">仅在集群内访问</el-radio>
                <el-radio v-model="wl.serviceAccess" label="3">VPC内网访问</el-radio>
                <el-radio v-model="wl.serviceAccess" label="4">主机端口访问</el-radio>
                <a href="" style="padding-left:10px;">如何选择</a><i class="el-icon-edit-outline"></i>
              </el-form-item>
              <!-- 服务访问方式介绍 -->
              <div style="margin-bottom: 18px">
                <div style="margin-left: 120px">
                  <el-form-item v-if="wl.serviceAccess=='1'" label-width="0px">
                    <div>
                      自动创建公网CLB（<span class="text-warning">0.02元/小时</span>）以提供Internet访问入口，支持TCP/UDP协议，如web前台类服务可以选择公网访问。
                    </div>
                    <div>
                      如您需要公网通过HTTP/HTTPS协议或根据URL转发，您可以在Ingress页面使用Ingress进行路由转发，<a href="">查看详情</a><i
                      class="el-icon-edit-outline"></i>
                    </div>
                  </el-form-item>
                  <el-form-item v-if="wl.serviceAccess=='2'" label-width="0px">
                    <div>将提供一个可以被集群内其他服务或容器访问的入口，支持TCP/UDP协议，数据库类服务如Mysql可以选择集群内访问,来保证服务网络隔离性。</div>
                    <div>
                      <el-checkbox v-model="wl.handlessChecked">Headless&nbsp;Service</el-checkbox>
                      <el-tooltip content="不创建用于集群内访问的ClusterIP,访问Service名称时返回后端Pods IP地址,用于适配自有的服务发现机制。"
                                  placement="top" effect="light">
                        <i class="el-icon-question" style="margin-left:5px;"></i>
                      </el-tooltip>
                      （Headless&nbsp;Service只支持创建时选择，<span class="text-error">创建完成后不支持变更访问方式）</span>
                    </div>
                  </el-form-item>
                  <el-form-item v-if="wl.serviceAccess=='3'" label-width="0px">
                    <div>将提供一个可以被集群所在VPC下的其他资源访问的入口，支持TCP/UDP协议，需要被同一VPC下其他集群、云服务器等访问的服务可以选择VPC内网访问的形式。</div>
                    <div>支持Ingress<a href="">查看详情</a><i class="el-icon-edit-outline"></i></div>
                  </el-form-item>
                  <el-form-item v-if="wl.serviceAccess=='4'" label-width="0px">
                    <div>提供一个主机端口映射到容器的访问方式，支持TCP&UDP， 可用于业务定制上层LB转发到Node。</div>
                    <div>支持Ingress<a href="">查看详情</a><i class="el-icon-edit-outline"></i></div>
                  </el-form-item>
                </div>
              </div>
              <div style="margin-bottom: 18px" v-show="wl.serviceAccess === '3'">
                <div style="margin-left: 120px">
                  <el-form-item style="display: inline-block" label-width="0px">
                    <el-select v-model="wl.subnetOneValue" placeholder="请选择" :disabled="true">
                      <el-option
                        v-for="item in subnetOneOption"
                        :key="item"
                        :label="item"
                        :value="item">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item style="display: inline-block" label-width="0px">
                    <el-select v-model="wl.subnetTwoValue" placeholder="请选择">
                      <el-option
                        v-for="item in subnetTwoOption"
                        :key="item.SubnetName"
                        :label="item.SubnetName"
                        :value="item.SubnetName">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <span>共{{subnetOrder.TotalIpAddressCount}}个子网IP，剩{{subnetOrder.AvailableIpAddressCount}}个可用</span>
                  <p>如现有的网络不合适，您可以去控制台<el-button type="text" size="mini">新建子网</el-button></p>
                </div>
              </div>
              <el-form-item label="负载均衡器" v-show="wl.serviceAccess=='1' || wl.serviceAccess=='3'">
                <div class="radio1">
                  <el-radio-group v-model='wl.loadBalance' style="margin-bottom: 5px;">
                    <el-radio-button label="1">自动创建</el-radio-button>
                    <el-radio-button label="2">使用已有</el-radio-button>
                  </el-radio-group>
                </div>
                <p v-show="wl.loadBalance=='1'">自动创建CLB用于公网/内网访问Service，请勿手动修改由TKE创建的CLB监听器，
                  <a href="javascript:;">查看更多说明</a>
                </p>
                <div v-show="wl.loadBalance=='2'">
                  <div>使用已有的CLB用于公网/内网访问Service，不覆盖已有监听器规则，请勿手动修改由TKE创建的CLB监听器，仅支持未被容器服务TKE使用的CLB<el-button type="text" size="mini">查看更多说明</el-button></div>
                  <el-select v-show="wl.loadBalance=='2'" v-model="wl.describeLoadBalancersValue" placeholder="请选择" class="borderRed">
                    <el-option
                      v-for="item in describeLoadBalancersOption"
                      :key="item.LoadBalancerId"
                      :label="`${item.LoadBalancerId} (${item.LoadBalancerName})`"
                      :value="item.LoadBalancerId">
                    </el-option>
                  </el-select>
                </div>
              </el-form-item>
              <div style="margin-bottom: 18px">
                <label style="width: 120px;vertical-align: middle;float: left;padding: 0 12px 0 0;line-height: 28px">端口映射</label>
                <div style="margin-left: 120px">
                  <div class="port" :style="{width: wl.serviceAccess === '4'?'950px':'680px'}">
                    <!-- 头部 -->
                    <div class="flex">
                      <div style="width:140px;padding-left:14px">协议
                        <el-tooltip content="使用公网/内网负载均衡时，TCP和UDP协议不能混合使用" placement="top" effect="light">
                          <i class="el-icon-warning"></i>
                        </el-tooltip>
                      </div>
                      <div style="width:250px;">容器端口
                        <el-tooltip content="端口范围1~65535" placement="top" effect="light">
                          <i class="el-icon-warning"></i>
                        </el-tooltip>
                      </div>
                      <div style="width:250px;"  v-if="wl.serviceAccess === '4'">主机端口
                        <el-tooltip content="可通过云服务器IP+主机端口访问服务，端口范围30000~32767，不填自动分配" placement="top" effect="light">
                          <i class="el-icon-warning"></i>
                        </el-tooltip>
                      </div>
                      <div>服务端口
                        <el-tooltip content="可通过服务名+服务端口可直接访问该服务" placement="top" effect="light">
                          <i class="el-icon-warning"></i>
                        </el-tooltip>
                      </div>
                    </div>
                    <!-- 内容 -->
                    <div style="border-top:1px solid #ddd;padding: 10px;">
                      <div style="padding:5px 0;" v-for="(val,index) in wl.portMapping" :key="index">
                        <el-form-item style="display: inline-block" label-width="0px">
                          <el-select class="w100" v-model="val.portValue" placeholder="请选择">
                            <el-option
                              v-for="item in protocolOption"
                              :key="item"
                              :label="item"
                              :value="item">
                            </el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item class="w250" style="padding-left:30px;display: inline-block" label-width="0px" :prop="`portMapping.${index}.conPort`" :rules="portMappingConPortValidator">
                          <el-input v-model="val.conPort"
                                    placeholder="容器内应用程序监听的端口"></el-input>
                        </el-form-item>
                        <el-form-item style="display: inline-block" label-width="0px" v-if="wl.serviceAccess === '4'">
                          <el-input class="w250" style="padding-left:30px;" v-model="val.host"
                                    placeholder="范围：30000~32767"></el-input>
                        </el-form-item>
                        <el-form-item class="w250" style="padding-left:30px;display: inline-block" label-width="0px" :prop="`portMapping.${index}.servicePort`" :rules="portMappingServicePortValidator">
                          <el-input v-model="val.servicePort"
                                    placeholder="建议与容器端口一致"></el-input>
                        </el-form-item>
                        <el-tooltip class="item" effect="dark" content="不能删除，在至少指定一个设置端口" placement="right"
                                    :disabled="wl.portMapping!==1">
                          <i style="font-size:18px;padding-left:20px;" class="el-icon-close"
                             @click="wl.portMapping.length>1?removeProtMapping(it): ''"></i>
                        </el-tooltip>
                      </div>
                    </div>
                  </div>
                  <el-button type="text" size="mini" @click="addProtMapping()">添加端口映射</el-button>
                </div>
              </div>
              <!-- 高级设置 -->
              <div v-if="wl.isShowAdvancedSet">
                <el-form-item label-width="150px" label="ExtermalTrafficPolicy">
                  <el-radio v-model="wl.ETP" label="Cluster">Cluster</el-radio>
                  <el-radio v-model="wl.ETP" label="Local">Local</el-radio>
                  <div v-if="wl.ETP==='Cluster'">默认均衡转发到工作负载的所有Pod</div>
                  <div v-if="wl.ETP==='Local'">
                    能够保留来源IP，并可以保证公网、VPC内网访问（LoadBalancer）和主机端口访问（NodePort）模式下流量仅在本节点转发。Local转发使部分没有业务Pod存在的节点健康检查失败，可能存在流量不均衡的转发的风险。
                  </div>
                </el-form-item>
                <el-form-item label-width="150px" label="Session Affinity">
                  <el-radio v-model="wl.SA" label="ClienIP">ClienIP</el-radio>
                  <el-radio v-model="wl.SA" label="None">None</el-radio>
                  <p v-if="wl.SA === 'ClienIP'">基于来源IP做会话保持。</p>
                </el-form-item>
                <el-form-item v-if="wl.SA==='ClienIP'" label-width="150px" label="最大会话保持时间">
                  <el-input v-model="wl.maxSessionTime" class="w200"></el-input>
                  <div>会话保持时间范围为30-3600，若您的访问方式是公网或VPC内网访问（LoadBalancer）模式，设置成CLB监听器的会话保持时间一致。</div>
                </el-form-item>
              </div>
              <el-button type="text" size="mini" @click="wl.isShowAdvancedSet = !wl.isShowAdvancedSet">{{wl.isShowAdvancedSet?'隐藏高级设置':'显示高级设置'}}</el-button>
            </div>
          </div>
        </el-form>
        <!-- 设置主机路径 -->
        <el-dialog title="设置主机路径" :visible.sync="dialogVisiblePath" width="30%">
          <el-form :model="wl" label-position="left" label-width="120px" size="mini">
            <el-form-item label="主机路径" style="margin-top:10px">
              <el-input class="w192" v-model="wl.name" placeholder="如：/data/dev"></el-input>
            </el-form-item>
            <el-form-item label="检查类型">
              <el-select v-model="wl.name" :disabled="checkTypeOptions.length == 0" :placeholder="
                  checkTypeOptions.length == 0 ? '暂无数据' : '请选择'
                ">
                <el-option v-for="item in checkTypeOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dialogVisiblePath = false">确 定</el-button>
            <el-button @click="dialogVisiblePath = false">取 消</el-button>
          </span>
        </el-dialog>
        <!-- 选择云硬盘 -->
        <el-dialog title="选择云硬盘" :visible.sync="dialogVisibleYun" width="40%">
          <div class="select-yun">
            <el-select v-model="usePvcOptions" :disabled="usePvcOptions.length == 0"
                       :placeholder="usePvcOptions.length == 0 ? '暂无数据' : '请选择'">
              <el-option v-for="item in usePvcOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
            <el-input class="w192 ml10" placeholder="请输入数据盘ID" v-model="searchYun" clearable>
              <i slot="suffix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </div>
          <div class="select-yun-body">
            <el-table ref="multipleTable" :data="tableData.slice((currpage - 1) * pagesize, currpage * pagesize)"
                      tooltip-effect="dark" style="width: 100%">
              <el-table-column width="55">
                <template slot-scope="scope">
                  <el-radio v-model="id" :label="scope.row.id">&nbsp;</el-radio>
                </template>
              </el-table-column>
              <el-table-column label="ID" width="120">
                <template slot-scope="scope">{{ scope.row.ID }}</template>
              </el-table-column>
              <el-table-column prop="name" label="名称" width="120">
              </el-table-column>
              <el-table-column prop="address" label="大小" show-overflow-tooltip>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <div class="pagstyle" style="height:70px;">
              <span>共&nbsp;{{ TotalCount }}&nbsp;项</span>
              <div class="pagestyle_right">
                <el-pagination :page-size="pagesize" :pager-count="7" :page-sizes="[50, 40, 30, 20, 10]"
                               layout="sizes, prev, pager, next" @current-change="handleCurrentChange"
                               @size-change="handleSizeChange" :total="TotalCount"></el-pagination>
              </div>
            </div>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dialogVisibleYun = false">确 定</el-button>
            <el-button @click="dialogVisibleYun = false">取 消</el-button>
          </span>
        </el-dialog>
        <!-- 设置Configmap -->
        <el-dialog title="设置ConfigMap" :visible.sync="dialogVisibleConfig" width="30%">
          <el-form :model="setConfigMapData" label-position="left" label-width="120px" size="mini">
            <el-form-item label="选择ConfigMap">
              <el-select v-model="setConfigMapData.select" :disabled="checkTypeOptions.length == 0" :placeholder="
                  checkTypeOptions.length == 0 ? '暂无数据' : '请选择'
                ">
                <el-option v-for="item in checkTypeOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="选项">
              <el-radio-group v-model="setConfigMapData.checked">
                <el-radio label="all">全部</el-radio>
                <el-radio label="part">指定部分Key</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="Items" v-show="setConfigMapData.checked == 'part'">
              <span>添加Item
                <el-tooltip class="item" effect="light" content="ConfigMap无更多可用Key" placement="top">
                  <i class="el-icon-warning-outline" style="color:red;cursor:pointer"></i>
                </el-tooltip>
              </span>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dialogVisibleConfig = false">确 定</el-button>
            <el-button @click="dialogVisibleConfig = false">取 消</el-button>
          </span>
        </el-dialog>
        <!-- 设置Configmap -->
        <el-dialog title="设置Secret" :visible.sync="dialogVisibleSecret" width="30%">
          <el-form :model="setSecretData" label-position="left" label-width="120px" size="mini">
            <el-form-item label="选择Secret">
              <el-select v-model="setSecretData.select" :disabled="checkTypeOptions.length == 0" :placeholder="
                  checkTypeOptions.length == 0 ? '暂无数据' : '请选择'
                ">
                <el-option v-for="item in checkTypeOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="选项">
              <el-radio-group v-model="setSecretData.checked">
                <el-radio label="all">全部</el-radio>
                <el-radio label="part">指定部分Key</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="Items" v-show="setSecretData.checked == 'part'">
              <span>添加Item
                <el-tooltip class="item" effect="light" content="Secret无更多可用Key" placement="top">
                  <i class="el-icon-warning-outline" style="color:red;cursor:pointer"></i>
                </el-tooltip>
              </span>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dialogVisibleSecret = false">确 定</el-button>
            <el-button @click="dialogVisibleSecret = false">取 消</el-button>
          </span>
        </el-dialog>
        <!-- 底部 -->
        <div class="tke-formpanel-footer">
          <el-button size="small" type="primary" @click="submitAdd()">创建Workload</el-button>
          <el-button size="small" @click="()=>$router.back()">取消</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
import Service from '../service/components/Service'
import SelectMirrorImg from './components/selectMirrorImg'
import { ErrorTips } from '@/components/ErrorTips'
import workloadMixin from './workloadMixin'
import {
  ALL_CITY,
  POINT_REQUEST,
  ZONE_CVM2_LIST,
  TKE_COLONY_LIST,
  TKE_DELETE_XS,
  TKE_EDSCRIBELOADBALANCERS,
  TKE_EXIST_NODES,
  JOB_ID,
  DISK_LIST,
  TKE_VPC_METWORK,
  TKE_GETTKEDATAJOB,
  TKE_GETTKEDATARESULT,
  TKE_WORKER_METWORK
} from '@/constants'

export default {
  name: 'workloadCreate',
  mixins: [workloadMixin],
  data () {
    return {
      clusterId: '', // 集群id
      namespaceOptions: [], // 命名空间列表
      vpcId: '',
      loadShow: false, // 是否显示加载
      showMountPoint: false, // 是否显示添加挂载点
      addLabelFlag: false, // 是否可以新建标签
      failedRestartPolicyOption: ['OnFailure', 'Never'],
      specifyNodeDispatchOption: ['ins-4bhved3k(as-变化的2)', 'ins-5ic5rvb2(as-qewq)'], // 指点节点调度
      subnetOneOption: [], // LB所在子网 option1
      subnetTwoOption: [], // LB所在子网 option2
      subnetOrder: {}, // LB所在子网 显示子网IP,剩余可用
      describeLoadBalancersOption: [], // 负载均衡数组
      describeLoadBalancers: [], // 负载均衡未筛选的数组
      protocolOption: ['TCP', 'UDP'], // 协议 option
      jobId: '',
      isAddContainer: false, // 是否可以点击 添加容器
      wl: {
        name: '', // 名称
        description: '', // 描述
        labels: [{ key: 'k8s-app', value: '' }], // 标签
        type: '', // 类型
        namespace: '', // 命名空间
        executionStrategy: '', // 执行策略
        jobSettings: {
          repeatNumber: 1,
          parallelNumber: 1,
          failedRestartPolicy: 'OnFailure'
        },
        instanceContent: [], // 实例内容器
        dataJuan: [],
        caseNum: 'handAdjust',
        replicas: 0, // 实例数量-》手动调节-》实例数量
        touchTactics: [], // 实例数量-》自动调节-》触发策略
        caseScope1: '', // 实例数量-》自动调节-》实例范围
        caseScope2: '',
        imagePullSecrets: {
          option1: [],
          value1: '',
          option2: [],
          value2: ''
        },
        updateWay: '滚动更新（推荐）',
        updateTactics: 1, // 更新策略 单选
        updateInterval: 0, // 更新间隔
        configTacticsPods: 1, // 配置策略-》pods
        configTacticsMaxSurge: '', // 配置策略-》MaxSurge
        configTacticsMaxUnavailable: '', // 配置策略-》MaxUnavailable
        mustCondition: [], // 强制满足条件
        needCondition: [], // 尽量满足条件
        nodeTactics: 1, // 节点调度 单选
        specifyNodeDispatchValue: [], // 指点节点调度 选中项
        serviceEnbel: true, // 是否启用service
        serviceAccess: '1', // 服务访问方式 单选
        handlessChecked: false, // 仅在集群内访问 多选按钮
        subnetOneValue: '', // LB所在子网 value1
        subnetTwoValue: '', // LB所在子网 value2
        loadBalance: '1', // 负载均衡器 1.自动创建 2.使用已有
        portMapping: [], // 端口映射 数组
        isShowAdvancedSet: false, // 访问设置 显示隐藏高级设置
        describeLoadBalancersValue: '暂无数据', // 负载均衡值
        ETP: 'Cluster', // 访问设置-》高级设置-》ExternalTrafficPolicy
        SA: 'None', // 访问设置-》高级设置-》Session Affinity
        maxSessionTime: 30, // 最大会话保持时间
        pointList: [],
        mountPath: '',
        subPath: '',
        pointName: ''
      },
      // 暂时用不着
      // svc: {
      //   show: true,
      //   time: 30,
      //   checked: false,
      //   name: '',
      //   value: 'default',
      //   options: ['default', 'kube-public', 'kube-system', 'tfy-pub'],
      //   radio: '1',
      //   ETP: '1',
      //   SA: '2',
      //   input: '',
      //   list: [{}],
      //   workload: [],
      //   tabPosition: 'dep'
      // },
      // 实例数量自动调节下拉框内容, // 触发策略
      touchOptions1: [
        {
          value: 1,
          label: 'CPU'
        }, {
          value: 2,
          label: '内存'
        }, {
          value: 3,
          label: '硬盘'
        }, {
          value: 4,
          label: '网络'
        }
      ],
      touchOptions2: [
        [{
          value: 1,
          label: 'CPU使用量'
        }, {
          value: 2,
          label: 'CPU利用率(占节点)'
        }, {
          value: 3,
          label: 'CPU利用率(占Request)'
        }, {
          value: 4,
          label: 'CPU利用率(占Limit)'
        }],
        [{
          value: 5,
          label: '内存使用量'
        }, {
          value: 6,
          label: '内存使用量(不含Cache)'
        }, {
          value: 7,
          label: '内存使用量(占节点)'
        }, {
          value: 8,
          label: '内存使用量(占节点、不含Cache)'
        }, {
          value: 9,
          label: '内存使用量(占Request)'
        }, {
          value: 10,
          label: '内存使用量(占Request、不含Cache)'
        }, {
          value: 11,
          label: '内存使用量(占Limit)'
        }, {
          value: 12,
          label: '内存使用量(占Limit、不含Cache)'
        }],
        [{
          value: 13,
          label: '硬盘写流量'
        }, {
          value: 14,
          label: '硬盘读流量'
        }, {
          value: 15,
          label: '硬盘读IOPS'
        }, {
          value: 16,
          label: '硬盘写IOPS'
        }],
        [{
          value: 17,
          label: '网络出带宽'
        }, {
          value: 18,
          label: '网络入带宽'
        }, {
          value: 19,
          label: '网络出流量'
        }, {
          value: 20,
          label: '网络入流量'
        }, {
          value: 21,
          label: '网络出包量'
        }, {
          value: 22,
          label: '网络入包量'
        }]
      ],
      setConfigMapData: {
        select: '',
        checked: ''
      },
      setSecretData: {
        select: '',
        checked: ''
      },
      dataFlag: false,
      yesOrnoAddDataJuan: false,
      input: '',
      searchOptions: [
        {
          value: 'useMenu',
          label: '使用临时目录'
        }, {
          value: 'usePath',
          label: '使用主机路径'
        }, {
          value: 'useNFS',
          label: '使用NFS盘'
        }, {
          value: 'usePVC',
          label: '使用已有PVC'
        }, {
          value: 'useYun',
          label: '使用腾讯云硬盘'
        }, {
          value: 'useConfig',
          label: '使用ConfigMap'
        }, {
          value: 'useSecret',
          label: '使用Secret'
        }
      ],
      // 条件
      conditionOptions: [
        {
          value: 'In',
          label: 'In'
        }, {
          value: 'NotIn',
          label: 'NotIn'
        }, {
          value: 'Exists',
          label: 'Exists'
        }, {
          value: 'DoesNotExist',
          label: 'DoesNotExist'
        }, {
          value: 'Gt',
          label: 'Gt'
        }, {
          value: 'Lt',
          label: 'Lt'
        }
      ],
      condition: [{
        name: '',
        rule: '',
        connect: 'In'
      }],
      value: '',
      usePvcOptions: [],
      checkTypeOptions: [],
      tableData: [],
      // 分页
      TotalCount: 0,
      pagesize: 10,
      currpage: 1,
      searchYun: '',
      dialogVisiblePath: false,
      dialogVisibleYun: false,
      dialogVisibleConfig: false,
      dialogVisibleSecret: false,
      highLevelSetShow: false,
      highLevelSetShow2: false, // 是否显示高级设置
      SelectMirrorImgFlag: false,
      secrets: {}, // 引用ConfigMap/Secret secrets
      configMap: {} // 引用ConfigMap/Secret ConfigMap
    }
  },
  components: { Service, SelectMirrorImg },
  watch: {
    wl: {
      handler (val) {
        // 监听数据卷
        val.dataJuan.forEach(item => {
          if (item.name1 === 'useMenu' && item.name2) {
            this.yesOrnoAddDataJuan = false
          } else if (item.name1 && item.name2 && item.name3) {
            this.yesOrnoAddDataJuan = false
          } else {
            this.yesOrnoAddDataJuan = true
          }
        })
        if (val.dataJuan.length === 0) {
          this.yesOrnoAddDataJuan = false
        }
      },
      deep: true
    },
    // 监听标签
    'wl.name': {
      handler: function (val) {
        this.wl.labels[0].value = val
      }
    },
    'wl.labels': {
      handler: function (val) {
        let addLabelFlag = true
        val.forEach(item => {
          if (item.key === '' || item.value === '') addLabelFlag = false
        })
        this.addLabelFlag = addLabelFlag
      },
      deep: true
    },
    'wl.subnetTwoValue': {
      handler: function (val) {
        this.subnetOrder = this.subnetTwoOption.find(item => {
          return item.SubnetName === val
        })
      }
    },
    'wl.instanceContent': {
      handler: function (val) {
        let isAddContainer = true
        val.forEach(item => {
          let completed = true
          let { name, mirrorImg, environmentVar, citeCs, disAdvancedSetting, surviveExamine, readyToCheck, surviveExamineContent } = item
          if (name === '' || mirrorImg === '') {
            completed = false
          }
          if (environmentVar.length > 0) { // 新增变量
            for (let i = 0; i < environmentVar.length; i++) {
              if (environmentVar[i].key === '') {
                completed = false
              }
            }
          }
          if (citeCs.length > 0) { // 引用ConfigMap/Secret
            for (let i = 0; i < citeCs.length; i++) {
              let { value1, value2, value3, input1 } = citeCs[i]
              if (value1 === '' || value2 === '' || value3 === '' || input1 === '') {
                completed = false
              }
            }
          }
          if (disAdvancedSetting) { // 高级设置为显示时
            if (surviveExamine) { // 存活检查
              let { inspectMethodOption, executiveOrder, responseTimeout, intervalTime, unhealthyThreshold, inspectPort } = surviveExamineContent
              if (inspectMethodOption === '执行命令检查') {
                if (executiveOrder === '' || responseTimeout === '' || intervalTime === '' || unhealthyThreshold === '') {
                  completed = false
                }
              } else {
                if (inspectPort === '') {
                  completed = false
                }
              }
            }
            if (readyToCheck) { // 就绪检查
              let { inspectMethodOption, executiveOrder, responseTimeout, intervalTime, healthyThreshold, unhealthyThreshold, inspectPort } = readyToCheck
              if (inspectMethodOption === '执行命令检查') {
                if (executiveOrder === '' || responseTimeout === '' || intervalTime === '' || healthyThreshold === '' || unhealthyThreshold === '') {
                  completed = false
                }
              } else {
                if (inspectPort === '') {
                  completed = false
                }
              }
            }
          }
          if (!completed) {
            isAddContainer = false
          }
          item.completed = completed
        })
        console.log(this.isAddContainer)
        this.isAddContainer = isAddContainer
      },
      deep: true
    },
    'wl.touchTactics': {
      handler: function (newVal) {
        newVal.forEach(newItem => {
          newItem.touch2Option = this.touchOptions2[newItem.touch1 - 1]
          let isExistence = true
          newItem.touch2Option.forEach(item => {
            if (item.value === newItem.touch2) {
              isExistence = false
            }
          })
          if (isExistence) {
            newItem.touch2 = newItem.touch2Option[0].value
          }
        })
      },
      immediate: true,
      deep: true
    },
    'wl.serviceAccess': {
      handler: function (val) {
        this.changeServiceAccess()
      }
    }
  },
  created () {
    // 从路由获取类型
    let { type, clusterId, spaceName } = this.$route.query
    console.log(this.$route.query)
    this.wl.type = type === 'deployment' ? 'Deployment' : type
    this.clusterId = clusterId
    this.wl.namespace = spaceName
    this.initNetworkRequery()
    this.addProtMapping()
    this.addTouchTactics()
    this.addInstanceContent()
  },
  methods: {
    initNetworkRequery: async function () {
      this.getZoneCvmList()
      await this.getColonyList()
      await this.getDescribeVpcs()
      await this.getDescribeSubnets()
      this.getStorageClasses()
      this.getConfigmaps()
      this.getSecrets()
      this.getPersistentvolumeclaims()
      await this.getDescribeClusterInstances()
      await this.getDescribeInstances()
      this.getDescribeLoadBalancers()
      await this.getTkeDataJob()
      await this.getTkeDataResult()
      this.getNodes()
      this.getDescribeDisks()
      this.getNameSpaceInfo()
    },
    getZoneCvmList: async function () {
      await this.axios.post(ZONE_CVM2_LIST, { Version: '2017-03-12' }).then(res => {
        this.axiosUtils(res, () => {
          console.log('cvm2/DescribeZones', JSON.stringify(res))
        })
      })
    },
    // 获取集群列表
    getColonyList: async function () {
      let param = {
        'ClusterIds.0': this.clusterId,
        Version: '2018-05-25'
      }
      await this.axios.post(TKE_COLONY_LIST, param).then(res => {
        this.axiosUtils(res, () => {
          this.vpcId = res.Response.Clusters[0].ClusterNetworkSettings.VpcId
        })
      })
    },
    getStorageClasses: async function () {
      let param = {
        Method: 'GET',
        Path: '/apis/storage.k8s.io/v1/storageclasses',
        Version: '2018-05-25',
        ClusterName: this.clusterId
      }
      await this.axios.post(POINT_REQUEST, param).then(res => {
        this.axiosUtils(res, () => {
          let ResponseBody = res.Response.ResponseBody
          console.log('getStorageClasses', JSON.parse(ResponseBody))
        })
      })
    },
    getConfigmaps: async function () {
      let param = {
        Method: 'GET',
        Path: `/api/v1/namespaces/${this.wl.namespace}/configmaps`,
        Version: '2018-05-25',
        ClusterName: this.clusterId
      }
      await this.axios.post(POINT_REQUEST, param).then(res => {
        this.axiosUtils(res, () => {
          let ResponseBody = res.Response.ResponseBody
          this.configMap = JSON.parse(ResponseBody)
        })
      })
    },
    getSecrets: async function () {
      let param = {
        Method: 'GET',
        Path: `/api/v1/namespaces/${this.wl.namespace}/secrets`,
        Version: '2018-05-25',
        ClusterName: this.clusterId
      }
      await this.axios.post(POINT_REQUEST, param).then(res => {
        this.axiosUtils(res, () => {
          let ResponseBody = res.Response.ResponseBody
          this.secrets = JSON.parse(ResponseBody)
        })
      })
    },
    getPersistentvolumeclaims: async function () {
      let param = {
        Method: 'GET',
        Path: `/api/v1/namespaces/${this.wl.namespace}/persistentvolumeclaims`,
        Version: '2018-05-25',
        ClusterName: this.clusterId
      }
      await this.axios.post(POINT_REQUEST, param).then(res => {
        this.axiosUtils(res, () => {
          let ResponseBody = res.Response.ResponseBody
          console.log(`/api/v1/namespaces/${this.wl.namespace}/persistentvolumeclaims`, JSON.parse(ResponseBody))
        })
      })
    },
    getDescribeClusterInstances: async function () {
      let param = {
        ClusterId: this.clusterId,
        Offset: 0,
        Limit: 20,
        Version: '2018-05-25',
        InstanceRole: 'WORKER'
      }
      await this.axios.post(TKE_DELETE_XS, param).then(res => {
        this.axiosUtils(res, () => {
          this.describeClustersInstances = res.Response.InstanceSet
        })
      })
    },
    // 获取负载均衡器
    getDescribeLoadBalancers: async function () {
      let param = {
        Version: '2018-03-17',
        Forward: 1,
        Offset: 0,
        Limit: 100
      }
      await this.axios.post(TKE_EDSCRIBELOADBALANCERS, param).then(res => {
        this.axiosUtils(res, () => {
          let { Response: { LoadBalancerSet } } = res
          let arr = LoadBalancerSet.filter(item => item.VpcId === this.vpcId)
          arr.forEach((item, index) => {
            let { LoadBalancerId, LoadBalancerName, LoadBalancerType } = item
            this.describeLoadBalancers.push({ LoadBalancerId, LoadBalancerName, LoadBalancerType })
          })
          this.changeServiceAccess()
        })
      })
    },
    changeServiceAccess: function () {
      let { serviceAccess } = this.wl
      this.describeLoadBalancersOption = []
      this.wl.describeLoadBalancersValue = '暂无数据'
      let oneDes = []
      switch (serviceAccess) {
        case '1':
          oneDes = this.describeLoadBalancers.filter(item => item.LoadBalancerType === 'OPEN')
          break
        case '3':
          oneDes = this.describeLoadBalancers.filter(item => item.LoadBalancerType === 'INTERNAL')
          break
      }
      this.describeLoadBalancersOption = oneDes
      if (oneDes.length !== 0) {
        this.wl.describeLoadBalancersValue = oneDes[0].LoadBalancerName
      }
      // if (serviceEnbel)
    },
    getDescribeInstances: async function () {
      let param = {
        Version: '2017-03-12',
        Limit: 20
      }
      this.describeClustersInstances.forEach((item, index) => {
        param[`InstanceIds.${index}`] = item.InstanceId
      })
      await this.axios.post(TKE_EXIST_NODES, param).then(res => {
        this.axiosUtils(res, () => {
          console.log('cvm2/DescribeInstances', res)
        })
      })
    },
    getTkeDataJob: async function () {
      let param = {
        'Conditions.0': JSON.stringify(['tke_cluster_instance_id', '=', this.clusterId]),
        'Conditions.1': JSON.stringify(['node_role', '=', 'Node']),
        EndTime: new Date().getTime(),
        'Fields.0': 'avg(k8s_node_cpu_core_request_total)',
        'Fields.1': 'avg(k8s_node_memory_request_bytes_total)',
        'GroupBys.0': 'timestamp(60s)',
        'GroupBys.1': 'unInstanceId',
        Limit: 65535,
        Module: '/front/v1',
        NamespaceName: 'k8s_node',
        Offset: 0,
        Order: 'desc',
        OrderBy: 'timestamp',
        StartTime: new Date().getTime(),
        Version: '2019-06-06'
      }
      await this.axios.post(TKE_GETTKEDATAJOB, param).then(res => {
        this.axiosUtils(res, () => {
          this.jobId = res.Response.JobId
        })
      })
    },
    getNodes: async function () {
      let param = {
        Method: 'GET',
        Path: '/api/v1/nodes',
        Version: '2018-05-25',
        ClusterName: this.clusterId
      }
      await this.axios.post(POINT_REQUEST, param).then(res => {
        this.axiosUtils(res, () => {
          let ResponseBody = res.Response.ResponseBody
          console.log('/api/v1/nodes', JSON.parse(ResponseBody))
        })
      })
    },
    getDescribeDisks: async function () {
      let param = {
        'Version': '2017-03-12',
        'Offset': 0,
        'Limit': 20,
        'Filters.0.Name': 'disk-usage',
        'Filters.0.Values.0': 'DATA_DISK',
        'Filters.1.Name': 'portable',
        'Filters.1.Values.0': 'TRUE',
        'Filters.2.Name': 'disk-state',
        'Filters.2.Values.0': 'UNATTACHED',
        'Filters.3.Name': 'zone',
        'Filters.3.Values.0': 'ap-taipei-1'
      }
      await this.axios.post(DISK_LIST, param).then(res => {
        this.axiosUtils(res, () => {
          console.log('cbs2/DescribeDisks', res)
        })
      })
    },
    getDescribeVpcs: async function () {
      let param = {
        Version: '2017-03-12',
        'VpcIds.0': this.vpcId,
        Offset: 0,
        Limit: 100
      }
      await this.axios.post(TKE_VPC_METWORK, param).then(res => {
        this.axiosUtils(res, () => {
          let { Response: { VpcSet } } = res
          VpcSet.forEach((item, index) => {
            if (index === 0) {
              this.wl.subnetOneValue = item.VpcName
            }
            this.subnetOneOption.push(item.VpcName)
          })
        })
      })
    },
    getTkeDataResult: async function () {
      let param = {
        JobId: this.jobId,
        Version: '2019-06-06',
        Module: '/front/v1'
      }
      await this.axios.post(TKE_GETTKEDATARESULT, param).then(res => {
        this.axiosUtils(res, () => {
          console.log('tsm2/GetTkeDataResult', res)
        })
      })
    },
    // 获取子网列表
    getDescribeSubnets: async function () {
      let param = {
        Version: '2017-03-12',
        'Filters.0.Name': 'vpc-id',
        'Filters.0.Values.0': this.vpcId,
        Offset: 0,
        Limit: 100
      }
      await this.axios.post(TKE_WORKER_METWORK, param).then(res => {
        this.axiosUtils(res, () => {
          let { Response: { SubnetSet } } = res
          this.subnetTwoOption = []
          SubnetSet.forEach((item, index) => {
            let { SubnetName, TotalIpAddressCount, AvailableIpAddressCount } = item
            if (index === 0) {
              this.wl.subnetTwoValue = SubnetName
              this.subnetOrder = { TotalIpAddressCount, AvailableIpAddressCount }
            }
            this.subnetTwoOption.push({ SubnetName, TotalIpAddressCount, AvailableIpAddressCount })
          })
        })
      })
    },
    // 获取命名空间列表
    getNameSpaceInfo: async function () {
      let param = {
        Method: 'GET',
        Path: '/api/v1/namespaces',
        Version: '2018-05-25',
        ClusterName: this.clusterId
      }
      await this.axios.post(POINT_REQUEST, param).then(res => {
        this.axiosUtils(res, () => {
          let searchOpt = JSON.parse(res.Response.ResponseBody).items
          searchOpt.forEach((item, index) => {
            if (index === 0) {
              this.wl.namespace = item.metadata.name
            }
            item.value = item.metadata.name
            item.label = item.metadata.name
          })
          this.namespaceOptions = searchOpt
        })
      })
    },
    addDataJuan () { // 新增数据卷
      this.dataFlag = true
      var obj = {
        name1: '',
        name2: '',
        name3: ''
      }
      this.wl.dataJuan.push(obj)
    },
    delDataJuan (index) { // 删除数据卷
      this.wl.dataJuan.splice(index, 1)
    },
    // 选择云硬盘
    selectYun () {
      this.dialogVisibleYun = true
    },
    selectConfig () {
      this.dialogVisibleConfig = true
    },
    selectSecret () {
      this.dialogVisibleSecret = true
    },
    handleSizeChange (val) {
      console.log(`每頁 ${val} 條`)
    },
    // 改变页数
    handleCurrentChange (val) {
      this.currpage = val
    },
    changIsShowmount () {
      this.showMountPoint = true
    },
    // 点击确定绑定镜像
    confirmMirrorImg: function (val, index) {
      console.log(val, index)
      this.wl.instanceContent[index].mirrorImg = val
    },
    // 提交新增

    submitAdd: function () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.submit()
        } else {
          return false
        }
      })
    },
    submit: async function () {
      let { name, labels, type, namespace, description, replicas, updateWay, configTacticsPods, updateInterval, mirrorPullTactics, instanceContent, portMapping } = this.wl
      let labelsObj = {}
      labels.forEach(item => {
        labelsObj[item.key] = item.value
      })
      labelsObj['qcloud-app'] = name
      this.loadShow = true
      let containerList = instanceContent.map(item => {
        let { name: iName, mirrorImg, versions, requestCpu, limitCpu, requestMemory, limitMemory, gpuNum, privilegeLevelContainer } = item
        if (versions !== '') mirrorImg = `${mirrorImg}:${versions}`
        return {
          name: iName,
          image: mirrorImg,
          volumeMounts: [],
          resources: {
            limits: {
              cpu: limitCpu,
              memory: `${limitMemory}Mi`,
              'nvidia.com/gpu': gpuNum.toString()
            },
            requests: {
              cpu: requestCpu,
              memory: `${requestMemory}Mi`
            }
          },
          env: [],
          workingDir: '',
          command: [],
          args: [],
          securityContext: {
            privileged: privilegeLevelContainer
          }
        }
      })
      let requestBody = {
        kind: type,
        apiVersion: 'apps/v1beta2',
        metadata: {
          name: name,
          namespace: namespace,
          labels: labelsObj
        },
        spec: {
          minReadySeconds: updateInterval,
          replicas: replicas,
          template: {
            metadata: {
              labels: labelsObj
            },
            spec: {
              volumes: [],
              restartPolicy: !mirrorPullTactics ? 'Always' : mirrorPullTactics,
              containers: containerList
            }
          },
          selector: {
            matchLabels: labelsObj
          },
          strategy: {}
        }
      }
      // 判断 描述
      if (description !== '') requestBody.metadata = { description: description }
      // 判断 更新方式
      if (updateWay === '滚动更新（推荐）') {
        requestBody.spec.strategy = {
          type: 'RollingUpdate',
          rollingUpdate: {
            maxSurge: configTacticsPods,
            maxUnavailable: 0
          }
        }
      } else { // 快速更新
        requestBody.spec.strategy = {
          type: 'Recreate',
          rollingUpdate: null
        }
      }
      let requestBody1 = ''
      let ports = portMapping.map(item => {
        let { portValue, conPort, host, servicePort } = item
        return {
          'name': `${conPort}-${servicePort}-${portValue.toLowerCase()}`,
          'port': parseInt(servicePort),
          'targetPort': parseInt(conPort),
          'protocol': portValue
        }
      })
      if (type === 'Deployment' || type === 'statefulSet') {
        requestBody1 = {
          kind: 'Service',
          apiVersion: 'v1',
          metadata: {
            name: name,
            namespace: namespace,
            annotations: { 'service.kubernetes.io/service.extensiveParameters': JSON.stringify({ AddressIPVersion: 'IPV4' }) }
          },
          spec: {
            type: 'LoadBalancer',
            ports: ports,
            selector: labelsObj,
            externalTrafficPolicy: this.wl.ETP,
            sessionAffinity: this.wl.SA,
            sessionAffinityConfig: {}
          }
        }
      }
      if (this.wl.SA === 'ClientIP') {
        requestBody1.spec.sessionAffinityConfig = {
          clientIP: {
            timeoutSeconds: this.wl.time
          }
        }
      }
      let params = {
        Method: 'POST',
        Path: `/apis/platform.tke/v1/clusters/${this.clusterId}/apply?notUpdate=true`,
        Version: '2018-05-25',
        RequestBody: JSON.stringify(requestBody1) + JSON.stringify(requestBody),
        ClusterName: this.clusterId
      }
      console.log('requestBody', JSON.stringify(requestBody))
      console.log('requestBody1', JSON.stringify(requestBody1))
      await this.axios.post(POINT_REQUEST, params).then(res => {
        if (res.Response.Error === undefined) {
          this.loadShow = false
          let routerName = ''
          if (type === 'Deployment') {
            routerName = 'deploymentDetailEvent'
          }
          this.$router.replace({
            name: routerName,
            query: {
              clusterId: this.clusterId,
              spaceName: namespace,
              rowData: {
                metadata: {
                  name: name,
                  namespace: namespace
                }
              }
            }
          })
        } else {
          this.loadShow = false
          let ErrTips = {}
          let ErrOr = Object.assign(ErrorTips, ErrTips)
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: 'error',
            showClose: true,
            duration: 0
          })
        }
      })
    }
  }
}

</script>

<style lang="scss" scoped>
  .tke-radio-group {
    .el-radio {
      display: block;
    }

    .el-radio + .el-radio {
      margin-left: 0;
      margin-top: 10px;

    }
  }

  a {
    cursor: pointer;
  }

  .w192 {
    width: 192px;
  }

  .w100 {
    width: 100px;
  }

  .w150 {
    width: 150px;
  }

  .margin-middle {
    margin: 0px 10px;
  }

  .special {
    border-bottom: solid 1px #f2f2f2;
    padding: 0px 0px 26px;
  }

  .search-one {
    display: flex;
    align-items: center;
    width: 80%;
    background: #f2f2f2;
    height: 50px;
    box-sizing: border-box;
    padding: 0px 20px;

    .search-input {
      width: 210px;
      margin-left: 10px;
    }

    .search-hidden {
      flex: 1;
      margin-left: 10px;
    }

    .el-icon-close {
      font-size: 18px;
      cursor: pointer;
    }

    .add-check {
      color: #409eff;
      cursor: pointer;
      margin-left: 10px;
    }

    .cancle-addjuan {
      cursor: no-drop;
      color: #888;
    }
  }

  .select-yun {
    display: flex;
  }

  .ml10 {
    margin-left: 10px;
  }

  .ml100 {
    margin-left: 100px;
  }

  .w400 {
    width: 400px;
  }

  .w150 {
    width: 150px;
  }

  .pagstyle {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .pagestyle_right {
      display: flex;
      justify-content: flex-start;

      div {
        span {
          margin-right: 10px;
        }
      }
    }
  }

  .case-content {
    width: 80%;
    background: #f2f2f2;
    overflow: hidden;
    box-sizing: border-box;
    padding: 20px;
  }

  .cpu-limit {
    display: flex;

    & > div:nth-of-type(1) {
      margin-right: 60px;

    }
  }

  .cpu-limit2 {
    width: 120px;
    display: flex;
    text-align: center;
    border: solid 1px #ddd;

    span {
      display: block;
      height: 28px;
      line-height: 28px;
      width: 180px;
      border-right: solid 1px #ddd;
    }

    ::v-deep .el-input__inner {
      border: none !important;
    }
  }

  .setPosition {
    position: absolute;
    left: -64px;
    top: 8px;
  }

  .setPosition2 {
    position: absolute;
    left: -38px;
    top: 8px;
  }

  .setPosition4 {
    position: absolute;
    left: -78px;
    top: 8px;
  }

  .setPosition3 {
    position: absolute;
    left: -52px;
    top: 8px;
  }

  .from-1 {
    width: 80%;
    background: white;
    box-sizing: border-box;
    padding: 10px;

    & > > > .el-form-item:nth-of-type(1) {
      margin-top: 0px !important;
    }

    .from-set {
      background: #f2f2f2;
      padding: 6px;
    }
  }

  .form-2 {
    width: 60%;
    background: #f2f2f2;
    box-sizing: border-box;
    padding: 10px;
  }

  .addcontent {
    width: 80%;
    border: dotted 2px #f2f2f2;
    height: 40px;
    text-align: center;
    line-height: 40px;
    margin: 6px 0px;

    &:hover {
      background: #f2f2f2;
    }
  }

  .flex {
    display: flex;
    align-items: center;
  }

  .bg {
    width: 50%;
    background: #f2f2f2;
    box-sizing: border-box;
    padding: 10px;
  }

  .bg2 {
    width: 60%;
    background: #f2f2f2;
    box-sizing: border-box;
    padding: 10px 20px;
    margin-bottom: 10px;
  }

  .set-i1 {
    font-size: 20px;
    cursor: pointer;
    float: right;
  }

  .bottom10 {
    margin-bottom: 10px;
  }

  .text-error {
    color: #e54545;
  }

  .text-warning {
    color: #ff9d00
  }

  .ms {
    width: 330px;
    padding: 5px 8px 8px 5px;
    height: 100px;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    resize: none;
  }

  .w250 {
    width: 250px;
  }

  .port{
    border: 1px solid #ddd;
    color: #888888;
    .flex {
      line-height: 28px;
    }
  }

</style>

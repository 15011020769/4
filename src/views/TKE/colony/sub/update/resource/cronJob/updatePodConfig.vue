 <!-- 新建Service -->
 <template>
   <div class="colony-wrap">
     <div class="tke-content-header">
       <div class="tke-grid ">
         <!-- 左侧 -->
         <div class="grid-left">
           <span class="goback" @click="goBack">
             <i class="el-icon-back"></i>
           </span>
           <h2 class="header-title">更新Pod配置1</h2>
         </div>
         <!-- 右侧 -->
         <div class="grid-right"></div>
       </div>
     </div>
     <div class="colony-main">
       <div class="tke-card tke-formpanel-wrap mb60">
         <!-- config -->
         <el-form class="tke-form" label-position="left" label-width="120px" size="mini">
           <el-form-item label="数据卷（选填）">
             <div class="search-one" v-for="(item, index) in  wl.dataJuan" :key="index">
               <el-select v-model="item.name1"  @change="initReelData(item.name1,index)" placeholder="请选择">
                 <el-option v-for="item in searchOptions" :key="item.value" :label="item.label" :value="item.value">
                 </el-option>
               </el-select>
               <el-input class="search-input" v-model="item.name2" placeholder="名称  如val"  ></el-input>
               <div class="search-hidden">
                 <div v-if="item.name1 == 'usePath'">
                   <p v-if="item.name3!=''&&item.name4!=''">
                      <el-tooltip  placement="top"  effect="light">
                        <div slot="content">
                          <p>主机路径:{{item.name3}}</p>
                          <p>检查类型:{{item.name4}}</p>
                        </div>
                        <span>主机路径设置 <i class="el-icon-info"></i></span>
                      </el-tooltip>
                      <span class="add-check" @click="resetHostPath(item.name3,item.name4,index)" >重新设置</span>
                   </p>
                   <p v-else>
                    <span>暂未设置主机路径</span>
                    <span class="add-check" @click="setHostPath(index)">设置主机路径</span>
                   </p>
                 </div>
                 <div v-if="item.name1 == 'useNFS'">
                   <el-input class="search-input" v-model="item.name3" placeholder="NFS路径 如：127.0.0.1:/dir"></el-input>
                 </div>
                 <div v-if="item.name1 == 'usePVC'">
                    <el-select v-model="item.name3" placeholder="请选择pvc">
                     <el-option v-for="(val,i3) in pvcOption" :key="i3" :value="val.metadata.name" :label="val.metadata.name"></el-option>
                   </el-select>
                 </div>
                 <div v-if="item.name1 == 'useYun'">
                   <p v-if="item.name3==''">
                    <span class="add-check" @click="selectYun(index)">选择云硬盘</span>&nbsp;&nbsp;
                    <el-tooltip class="item" effect="light" content="数据卷类型为云硬盘，实例数量最大为1" placement="top">
                      <i style="cursor:pointer" class="el-icon-warning"></i>
                    </el-tooltip>
                   </p>
                   <p v-if="item.name3!=''">
                     <span>{{item.name3}}</span>
                     <span class="add-check" @click="selectYun(index)" >重新选择</span>
                     <el-tooltip class="item" effect="light" content="数据卷类型为云硬盘，实例数量最大为1" placement="top">
                      <i style="cursor:pointer" class="el-icon-warning"></i>
                     </el-tooltip>
                   </p>
                 </div>
                 <div v-if="item.name1 == 'useConfig'" style="display:flex;align-items:center">
                   <span v-if="item.name3==''"> 暂未选择ConfigMap</span>
                    <span v-if="item.name3!=''">
                      <span> {{item.name3}}</span><br/>
                      <span v-if="item.name4=='all'">全部Key</span>
                      <el-tooltip v-else class="item" effect="light"  placement="top">
                         <div slot="content">
                           <p v-for="(v,i) in item.name4" :key="i">{{v.key}}、{{v.path}}、{{v.mode}}</p>
                        </div>
                       <span >指定部分Key</span>
                      </el-tooltip>
                    </span>
                    <span class="add-check" @click="selectConfig(index)">选择配置项</span>
                 </div>
                 <div v-if="item.name1 == 'useSecret'" style="display:flex;align-items:center">
                  <span v-if="item.name3==''">暂未选择Secret</span>
                    <span v-if="item.name3!=''">
                      <span> {{item.name3}}</span><br/>
                      <span v-if="item.name4=='all'">全部Key</span>
                      <el-tooltip v-else class="item" effect="light"  placement="top">
                         <div slot="content">
                           <p v-for="(v,i) in item.name4" :key="i">{{v.key}}、{{v.path}}、{{v.mode}}</p>
                        </div>
                       <span >指定部分Key</span>
                      </el-tooltip>
                    </span>
                   <span class="add-check" @click="selectSecret(index)">选择Secret</span>
                 </div>
               </div>
                <el-tooltip v-if="firstPointInfoData.indexOf(item.name2)!=-1&&item.name2!=''" class="item" effect="light" content="该数据卷已被挂载，不可删除" placement="top">
                 <i style="cursor:pointer" class="el-icon-close"></i>
               </el-tooltip>
               <i v-if="firstPointInfoData.indexOf(item.name2)==-1"    class="el-icon-close" @click="wl.dataJuan.splice(index, 1)"></i>
             </div>
             <p style="margin-top:8px">
               <el-button type="text"  :disabled="yesOrnoAddDataJuan" @click="addDataJuan">添加数据卷</el-button>
             </p>
             <p>
               为容器提供存储，目前支持临时路径、主机路径、云硬盘数据卷、文件存储NFS、配置文件、PVC，还需挂载到容器的指定路径中。
               <!-- <span
                 style="color:#409eff;cursor:pointer" >使用指引</span> -->
             </p>
           </el-form-item>
           <el-form-item label="实例内容器">
             <div  v-for="(v,i) in wl.instanceContent" :key="i">
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
                 <el-form-item label="名称" style="margin-bottom: 0px">
                   <el-input class="w192" v-model="v.name" placeholder="请输入容器名称"></el-input>
                   <p>请输入容器名称最长63个字符，只能包含小写字母、数字及分隔符("-")，且不能以分隔符开头或结尾</p>
                 </el-form-item>
                 <el-form-item label="镜像">
                   <el-input class="w192" v-model="v.mirrorImg"></el-input>
                   <el-button type="text" size="mini" @click="SelectMirrorImgFlag=true">选择镜像</el-button>
                   <SelectMirrorImg :dialogVisible.sync='SelectMirrorImgFlag' @confirm='confirmMirrorImg($event, i)'></SelectMirrorImg>
                 </el-form-item>
                 <el-form-item label="镜像版本（Tag）">
                   <el-input class="w192" v-model="v.versions"></el-input>
                 </el-form-item>
                 <el-form-item label="镜像拉取策略">
                   <template>
                     <el-radio-group v-model="v.imagePullPolicy" style="margin-bottom: 5px;">
                       <el-radio-button label="Always">Always</el-radio-button>
                       <el-radio-button label="IfNotPresent">IfNotPresent</el-radio-button>
                       <el-radio-button label="Never">Never</el-radio-button>
                     </el-radio-group>
                     <p v-show="v.imagePullPolicy === ''">若不设置镜像拉取策略，当镜像版本为空或:latest时，使用Always策略，否则使用IfNotPresent策略</p>
                     <p v-show="v.imagePullPolicy=='Always'">总是从远程拉取该镜像</p>
                     <p v-show="v.imagePullPolicy=='IfNotPresent'">默认使用本地镜像，若本地无该镜像则远程拉取该镜像</p>
                     <p v-show="v.imagePullPolicy=='Never'">只使用本地镜像，若本地没有该镜像将报异常</p>
                   </template>
                 </el-form-item>
                  <el-form-item label="挂载点" v-show="isExistvolumesData">
                    <div  v-for="(point,i2) in v.mountPoint" :key="i2" class="mount-point">
                      <el-select v-model="point.name" class="w100">
                        <el-option v-for="(item,i3) in autoChangeOption" :key="i3" :value="item" :label="item"></el-option>
                      </el-select>
                      <el-input v-model="point.mountPath" class="w192 ml8"></el-input>
                      <el-input v-model="point.subPath" class="w192 ml8"></el-input>
                      <el-select  v-model="point.readOnly" class="w100 ml8">
                        <el-option value="false" label="读写"></el-option>
                        <el-option value="true" label="只读"></el-option>
                      </el-select>
                       <i class="el-icon-close" @click="deleteMountPoint(i,i2,point.name)" style="font-size:20px;margin-left:20px;cursor:pointer"></i>
                    </div>
                    <el-button type="text" @click="addMountPoint(i)">添加挂载点</el-button>
                  </el-form-item>
                 <el-form-item label="CPU/内存限制">
                   <div class="cpu-limit">
                     <div>
                       <p>CPU限制</p>
                       <div style="display:flex">
                         <div class="cpu-limit2">
                           <span>request</span>
                           <el-input class="w192"  placeholder="不限制"   v-model="v.requestCpu"></el-input>
                         </div>-
                         <div class="cpu-limit2">
                           <span>limit</span>
                           <el-input class="w192" placeholder="不限制" v-model="v.limitCpu"></el-input>
                         </div>核
                       </div>
                     </div>
                     <div>
                       <p>内存限制</p>
                       <div style="display:flex">
                         <div class="cpu-limit2">
                           <span>request</span>
                           <el-input class="w192" placeholder="不限制" v-model="v.requestMemory"></el-input>
                         </div>-
                         <div class="cpu-limit2">
                           <span>limit</span>
                           <el-input class="w192" placeholder="不限制" v-model="v.limitMemory"></el-input>
                         </div>Mib
                       </div>
                     </div>
                   </div>
                   <p style="margin-top:10px;">
                     Request用于预分配资源,当集群中的节点没有request所要求的资源数量时,容器会创建失败。Limit用于设置容器使用资源的最大上限,避免异常情况下节点资源消耗过多。</p>
                 </el-form-item>
                 <el-form-item label="GPU限制">
                   <el-input-number v-model="v.gpuNum" size="small" :min="0"></el-input-number>个
                 </el-form-item>
                 <el-form-item label="环境变量">
                   <el-tooltip class="item" effect="light" content="设置容器中的变量" placement="top">
                     <i class="el-icon-info  setPosition"></i>
                   </el-tooltip>
                   <div v-for="(ve,ie) in v.environmentVar" :key="ie">
                     <el-input class="w100" v-model="ve.name" placeholder="变量名"></el-input> =
                     <el-input class="w192" v-model="ve.value" placeholder="变量值"></el-input>
                     <i class="el-icon-close" style="font-size:20px;margin-left:20px;cursor:pointer"
                      @click="delEnvironmentVar(i,ie)"></i>
                   </div>
                    <el-divider v-if="v.environmentVar.length>0&&v.citeCs.length>0"></el-divider>
                     <!-- 引用ConfigMap/Secret -->
                   <div v-for="val in v.citeCs" :key="val.key">
                     <el-form-item style="display: inline-block;margin-bottom: 0px" label-width="0px">
                          <el-select v-model="val.value1" class="w100"  @change="citeCsValue1Change($event, val)">
                            <el-option v-for="item in val.option1" :key="item" :label="item" :value="item">
                            </el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item style="display: inline-block;margin-bottom: 0px" label-width="0px">
                          <el-select v-model="val.value2"  placeholder="请选择资源" :disabled="val.value1===''||val.value2=='暂无数据'" class="w100" style="margin:0px 10px;"  @change="citeCsValue2Change($event, val)">
                            <el-option v-for="item in val.option2" :key="item.name" :label="item.name"
                                       :value="item.name">
                            </el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item style="display: inline-block;margin-bottom: 0px" label-width="0px">
                          <el-select v-model="val.value3" :disabled="val.value1===''||val.value2=='暂无数据'" class="w100">
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
                 </el-form-item>
                 
                 <div v-show="v.disAdvancedSetting">
                   <el-form-item label="工作目录">
                     <el-input class="w192" v-model="v.workDirectory"></el-input>
                     <p> 指定容器运行后的工作目录，
                       <!-- <a href="#">查看详情</a>  -->
                       </p>
                   </el-form-item>
                   <el-form-item label="运行命令">
                     <el-input type="textarea"  v-model="v.runCommand" class="w400"  rows="3" resize="none"></el-input>
                     <p> 控制容器运行的输入命令，
                       <!-- <a href="#">查看详情</a>  -->
                       </p>
                   </el-form-item>
                   <el-form-item label="运行参数">
                     <el-input type="textarea"  v-model="v.runParam"   class="w400"  rows="3" resize="none"></el-input>
                     <p>传递给容器运行命令的输入参数，注意每个参数单独一行，
                       <!-- <a href="#">查看详情</a>  -->
                       </p>
                   </el-form-item>
                   <el-form-item label="容器健康检查">
                     <el-tooltip class="item" effect="light" content="健康检查可以帮助你探测容器是否正常，以保证服务的正常运作" placement="top">
                       <i class="el-icon-info  setPosition2"></i>
                     </el-tooltip>
                     <p>
                       <el-checkbox v-model="v.surviveExamine">存活检查</el-checkbox> <span>检查容器是否正常，不正常则重启实例</span>
                     </p>
                     <div v-show="v.surviveExamine" class="from-1">
                       <!--存活检查 -->
                       <div style="background: #f2f2f2;box-sizing:border-box;padding: 6px;">
                         <el-form-item label="检查方法">
                           <el-select v-model="v.surviveExamineContent.inspectMethodValue">
                             <el-option v-for="item in v.surviveExamineContent.inspectMethodOption" :key="item" :label="item"
                               :value="item">
                             </el-option>
                           </el-select>
                         </el-form-item>
                         <el-form-item label="检查协议" v-show="v.surviveExamineContent.inspectMethodValue=='HTTP请求检查'">
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
                            <el-input class="w100" v-model="v.surviveExamineContent.healthyThreshold" :disabled="true"></el-input>
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
                       <el-checkbox v-model="v.readyToCheck">就绪检查</el-checkbox> <span>检查容器是否就绪，不就绪则停止转发流量到当前实例</span>
                     </p>
                     <div v-show="v.readyToCheck" class="from-1">
                       <!--就绪检查 -->
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
                            <span>范围：1~10次</span>
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

                     <p>查看健康检查和就绪检查
                       <!-- <a href="#">使用指引</a>  -->
                       </p>
                   </el-form-item>
                   <el-form-item label="特权级容器">
                     <el-switch  v-model="v.privilegeLevelContainer" active-color="#006eff" inactive-color="#888">
                     </el-switch>
                     <p> 容器开启特权级，将拥有宿主机的root权限 </p>
                   </el-form-item>
                 </div>
                  <el-button type="text" size="mini" @click="v.disAdvancedSetting = !v.disAdvancedSetting">
                      {{v.disAdvancedSetting?'隐藏高级设置':'显示高级设置'}}
                  </el-button>
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
             <p class="addcontent"    style='cursor:pointer' :style="{color: isAddContainer?'#006eff':'#bbbbbb'}" @click="isAddContainer?addInstanceContent0():''">添加容器</p>
             <p>注意：Workload创建完成后，容器的配置信息可以通过更新YAML的方式进行修改</p>
           </el-form-item>
           <a @click="highLevelSetShow2=!highLevelSetShow2" v-show="!highLevelSetShow2">显示高级设置</a>
           <div v-show="highLevelSetShow2">
            <el-form-item label="imagePullSecrets">
              <el-select   v-model='upn.type1' disabled style="margin-top:10px" >
                <el-option value='1'>
                </el-option>
              </el-select><br>
              <el-select  v-model='upn.type2' disabled style="margin-top:10px">
                <el-option value='1'>
                </el-option>
              </el-select>
              <p style="cursor:pointer">添加</p>
            </el-form-item>
            <a @click="highLevelSetShow2=!highLevelSetShow2">隐藏高级设置</a>
         </div>
         </el-form>

         <!-- 设置主机路径 -->
         <el-dialog title="设置主机路径" :visible.sync="dialogVisiblePath" width="30%">
           <el-form label-position="left" label-width="120px" size="mini">
             <el-form-item label="主机路径" style="margin-top:10px">
               <el-input class="w192" v-model="dataReelDialog.portPath.name" placeholder="如：/data/dev"></el-input>
             </el-form-item>
             <el-form-item label="检查类型">
               <el-select v-model="dataReelDialog.portPath.type" class="w192">
                  <el-option v-for="item in portPathOptions" :key="item" :label="item" :value="item">
                 </el-option>
               </el-select>
             </el-form-item>
           </el-form>
           <span slot="footer" class="dialog-footer">
             <el-button type="primary" @click="selectHostPath">确 定</el-button>
             <el-button @click="dialogVisiblePath = false">取 消</el-button>
           </span>
         </el-dialog>
         <!-- 选择云硬盘 -->
         <el-dialog title="选择云硬盘" :visible.sync="dialogVisibleYun" width="45%">
           <div class="select-yun">
             <el-button   plain>台北一区</el-button>
             <p style="margin-left:30px">
              <el-input   v-model="dataReelDialog.yunDisks.name"  placeholder="请输入数据盘ID" clearable>
                <i slot="suffix" @click="getDescribeDisks"   class="el-input__icon el-icon-search"></i>
              </el-input>
             </p>
           </div>
           <div class="select-yun-body">
             <el-table ref="multipleTable" :data="tableData.slice((currpage - 1) * pagesize, currpage * pagesize)"
              height="300"
               tooltip-effect="dark" style="width: 100%">
               <el-table-column width="55">
                 <template slot-scope="scope">
                   <el-radio  @change="yunHardDiskId(scope.row.DiskId)" v-model="yunRadio" :label="scope.row.DiskId">&nbsp;</el-radio>
                 </template>
               </el-table-column>
               <el-table-column label="ID" width="120">
                 <template slot-scope="scope">{{ scope.row.DiskId }}</template>
               </el-table-column>
               <el-table-column prop="name" label="名称" show-overflow-tooltip  >
                   <template slot-scope="scope">{{ scope.row.DiskName }}</template>
               </el-table-column>
               <el-table-column prop="address"  width="120" label="大小" show-overflow-tooltip>
                   <template slot-scope="scope">{{ scope.row.DiskSize }}GB</template>
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
             <el-button type="primary" @click="selectYunHardDisk">确 定</el-button>
             <el-button @click="dialogVisibleYun = false">取 消</el-button>
           </span>
         </el-dialog>

         <!-- 设置Configmap -->
         <el-dialog title="设置ConfigMap" :visible.sync="dialogVisibleConfig" width="30%">
           <el-form label-position="left" label-width="120px" size="mini">
             <el-form-item label="选择ConfigMap">
                <el-select v-model="dataReelDialog.configMap.name"  @change="dialogConfigMapName" placeholder="请选择ConfigMap">
                      <el-option v-for="item in configMap.items" :key="item.metadata.name" :label="item.metadata.name" :value="item.metadata.name"> 
                      </el-option>
                </el-select>
             </el-form-item>
             <el-form-item label="选项">
               <el-radio-group v-model="dataReelDialog.configMap.checked ">
                    <el-radio label="all">全部</el-radio>
                    <el-radio label="part">指定部分Key</el-radio>
                </el-radio-group>
             </el-form-item>
              <el-form-item label="Items" v-show="dataReelDialog.configMap.checked == 'part'">
                   <p style="display:flex;align-items:center;" v-for="(v,it) in dataReelDialog.configMap.items"  :key="it"  >
                     <el-select v-model='v.key'   >
                      <el-option v-for="(v1,i1) in dataReelDialog.configMap.partKeyOption" :key="i1" :value="v1" :label="v1">
                      </el-option>
                     </el-select>
                    <el-input class="w192 ml10" v-model="v.path" placeholder="请输入子路径,eg:dev"></el-input>
                    <el-input class="w192 ml10" v-model="v.mode" placeholder="文件权限,如0644"></el-input>
                    <el-tooltip class="item"  v-if="dataReelDialog.configMap.items.length=='1'"   effect="light" content="不可删除，至少指定一个Key" placement="top">
                      <i class="el-icon-close" style="cursor:pointer"></i>
                    </el-tooltip>
                    <i class="el-icon-close"  v-else @click="delConfigItem(it)"  style="font-size:20px;margin-left:20px;cursor:pointer"></i>
                  </p>
                  <el-button type="text" :disabled="dataReelDialog.configMap.partKeyOption.length==dataReelDialog.configMap.items.length" @click="addConfigItem" >添加Item</el-button>
                  <el-tooltip class="item" effect="light" content="ConfigMap无更多可用Key" placement="top">
                    <i class="el-icon-warning-outline" style="color:red;cursor:pointer"></i>
                  </el-tooltip>
                </el-form-item>
           </el-form>
           <span slot="footer" class="dialog-footer">
             <el-button type="primary" @click="selectConfigSure">确 定</el-button>
             <el-button @click="dialogVisibleConfig = false">取 消</el-button>
           </span>
         </el-dialog>

         <!-- 设置secret -->
         <el-dialog title="设置Secret" :visible.sync="dialogVisibleSecret" width="30%">
           <el-form label-position="left" label-width="120px" size="mini">
             <el-form-item label="选择Secret">
               <el-select v-model="dataReelDialog.Secret.name"  @change="dialogSecretName" placeholder="请选择Secret" >
                <el-option v-for="item in secrets.items" :key="item.metadata.name" :label="item.metadata.name" :value="item.metadata.name"> 
                  </el-option>
               </el-select>
             </el-form-item>
             <el-form-item label="选项">
               <el-radio-group v-model="dataReelDialog.Secret.checked">
                 <el-radio label="all">全部</el-radio>
                 <el-radio label="part">指定部分Key</el-radio>
               </el-radio-group>
             </el-form-item>
              <el-form-item label="Items" v-show="dataReelDialog.Secret.checked == 'part'">
                <p style="display:flex;align-items:center;" v-for="(v,it) in dataReelDialog.Secret.items"  :key="it"  >
                  <el-select v-model='v.key'   >
                    <el-option v-for="(v1,i1) in dataReelDialog.Secret.partKeyOption" :key="i1" :value="v1" :label="v1">
                    </el-option>
                  </el-select>
                  <el-input class="w192 ml10" v-model="v.path" placeholder="请输入子路径,eg:dev"></el-input>
                  <el-input class="w192 ml10" v-model="v.mode" placeholder="文件权限,如0644"></el-input>
                  <el-tooltip class="item"  v-if="dataReelDialog.Secret.items.length=='1'"   effect="light" content="不可删除，至少指定一个Key" placement="top">
                    <i class="el-icon-close" style="cursor:pointer"></i>
                  </el-tooltip>
                  <i class="el-icon-close"  v-else @click="delSecretItem(it)"  style="font-size:20px;margin-left:20px;cursor:pointer"></i>
                </p>
                <el-button type="text" :disabled="dataReelDialog.Secret.partKeyOption.length==dataReelDialog.Secret.items.length" @click="addSecretItem" >添加Item</el-button>
                <el-tooltip class="item" effect="light" content="ConfigMap无更多可用Key" placement="top">
                  <i class="el-icon-warning-outline" style="color:red;cursor:pointer"></i>
                </el-tooltip>
              </el-form-item>
           </el-form>
           <span slot="footer" class="dialog-footer">
             <el-button type="primary" @click="selectSecretSure">确 定</el-button>
             <el-button @click="dialogVisibleSecret = false">取 消</el-button>
           </span>
         </el-dialog>

         <!-- 底部 -->
         <div class="tke-formpanel-footer">
           <el-button size="small" type="primary" @click="submit" >完成</el-button>
           <el-button size="small" @click="$router.go(-1)">取消</el-button>
         </div>
       </div>
     </div>

   </div>

</template>

 <script>
import SelectMirrorImg from '../../../create/resource/components/selectMirrorImg';
import workLoadMixin from '../js/workloadMixins'
import FileSaver from "file-saver";
import XLSX from "xlsx";
import {TKE_COLONY_QUERY, POINT_REQUEST,TKE_YUN_HARDDISK_LIST} from '@/constants'
export default {
  name: "svcCreate",
  mixins:[workLoadMixin],
  data() {
    return {
      loadShow: false,
      dialogFormVisible: false,
      clusterId: '',
      np:'',
      name: '',//路由传过来的工作负载数据
      workload:'',
      isAddContainer: false, // 是否可以点击 添加容器
       dataReelDialog:{
          portPath:{
              name:'',
              type:'DirectoryOrCreate',
            },
            yunDisks:{
              name:'',
              diskId:'',//选中的 id
            },
            configMap:{
              name:'',
              checked:'all',
              partKeyOption:[],
              items:[],
              path:'',
              port:''
            },
            Secret:{
              name:'',
              checked:'all',
              partKeyOption:[],
              items:[],
              path:'',
              port:''
            }
      },
        firstPointInfoData:[],
       isExistvolumesData:'',//判断是否存在数据卷，从而确定挂载点是否显示
      dialogIndex:'',//数据卷下标存储
       //主机路径检查类型
      portPathOptions:['NoChecks','DirectoryOrCreate','Directory','FileOrCreate','File','Socket','CharDevice','BlockDevice'],
      yunRadio:'',
      //PVc
      pvcOption:[],
      autoChangeOption:[],//挂载点第一列选项
      // 更新pod数量
      upn: {
        type1: 'qcloudregistrykey',
        type2: 'tencenthubkey',
      },
      wl:{
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
      dialogVisiblePath: false,
      dialogVisibleYun: false,
      dialogVisibleConfig: false,
      dialogVisibleSecret: false,
      yesOrnoAddDataJuan: false,
      highLevelSetShow:false,
      highLevelSetShow2:false,
      surviveExamine: false, //存活检查
      readyToCheck: false, //就绪检查
      SelectMirrorImgFlag:false,
      searchOptions: [{
          value: "useMenu",
          label: "使用临时目录"
        },
        {
          value: "usePath",
          label: "使用主机路径"
        },
        {
          value: "useNFS",
          label: "使用NFS盘"
        },
        {
          value: "usePVC",
          label: "使用已有PVC"
        },
        {
          value: "useYun",
          label: "使用云硬盘"
        },
        {
          value: "useConfig",
          label: "使用ConfigMap"
        },
        {
          value: "useSecret",
          label: "使用Secret"
        }
      ],
      //分页
      tableData: [],
      TotalCount: 0,
      pagesize: 10,
      currpage: 1,
      lengths:'',//判断名称是否是输入框
      secrets: {}, // 引用ConfigMap/Secret secrets
      configMap: {} // 引用ConfigMap/Secret ConfigMap

    };
  },

  components: {
    SelectMirrorImg
  },
  created() {
    let {clusterId,name,spaceName,workload}=this.$route.query
    this.clusterId=clusterId;
    this.name=name;
    this.np=spaceName;
    this.workload=workload;
    this.wl.namespace = spaceName
    this.initData()
    
  },
  methods: {
     async  initData(){
      await this.baseData();
      this.getConfigmaps();
      this.getSecrets()
      this.getDescribeDisks()
      this.getPvc()
    },
    
    submit(){
      let container = this.wl.instanceContent;
      let containerObj = {};
      let containerList = [];
       //  存活检查，就绪检查 共用赋值函数
      let inspectFunc = (obj) => {
        let {
          inspectMethodValue,
          inspectProtocolValue,
          executiveOrder, // 执行命令
          inspectPort, // 检查端口
          requestPath, // 请求路径
          startDelay, // 启动延时
          responseTimeout, // 响应超时,
          intervalTime, // 间隔时间
          healthyThreshold, // 健康阀值
          unhealthyThreshold // 不健康阀值
        } = obj
        let newObj = {
          failureThreshold: parseInt(unhealthyThreshold),
          successThreshold: parseInt(healthyThreshold),
          timeoutSeconds: parseInt(responseTimeout),
          periodSeconds: parseInt(intervalTime)
        }
        if (parseInt(startDelay) !== 0) {
          newObj.initialDelaySeconds = parseInt(startDelay)
        }
        if (inspectMethodValue === 'TCP端口检查') {
          newObj.tcpSocket = { port: parseInt(inspectPort) }
        } else if (inspectMethodValue === 'HTTP请求检查') {
          newObj.httpGet = {
            path: requestPath,
            port: parseInt(inspectPort),
            scheme: inspectProtocolValue
          }
        } else if (inspectMethodValue === '执行命令检查' && executiveOrder !== '') {
          newObj.exec = {
            command: executiveOrder.split('\n')
          }
        }
        return newObj
      }
      if (container.length > 0) {
        for (let i = 0; i < container.length; i++) {
           let {
          name: iName, mirrorImg, versions, requestCpu, limitCpu, requestMemory,
          limitMemory, gpuNum, privilegeLevelContainer, environmentVar, citeCs, workDirectory,
          runCommand, runParam, surviveExamine, readyToCheck, surviveExamineContent, readyToCheckContent
        } = container[i]
        let oneContainer = {
         
        }
          //运行指令
        if (container[i].runCommand.length > 0) var command=container[i].runCommand.split('\n')
        //运行参数
        if (container[i].runParam.length > 0) var args=container[i].runParam.split('\n')
         // // 存活检查
        if (surviveExamine) oneContainer.livenessProbe = inspectFunc(surviveExamineContent)
        // // 就绪检查
        if (readyToCheck) oneContainer.readinessProbe = inspectFunc(readyToCheckContent)
           var environmentVarArr=[];
        if (container[i].environmentVar.length > 0) {
           environmentVarArr = container[i].environmentVar.map(item => {
            return { name: item.name, value: item.value }
          })
        }
        // 新增引用
        var citeCsArr=[] ;
        if (container[i].citeCs.length > 0) {
           citeCsArr = container[i].citeCs.map(item => {
            return {
              name: item.input1,
              valueFrom: {
                secretKeyRef: {
                  key: item.value3,
                  name: item.value2,
                  optional: false
                }
              }
            }
          })
        }
         //新增挂载点
        let mountPointArr=[];
        if(container[i].mountPoint.length>0){
          mountPointArr=container[i].mountPoint.map(item => {
            if(item.subPath==''&&item.readOnly=='false'){
              return {
                name:item.name,
                mountPath:item.mountPath
              }
            }else if(item.subPath==''&&item.readOnly=='true'){
               return {
                name:item.name,
                mountPath:item.mountPath,
                readOnly:true,
              }
            }else if(item.subPath!=''&&item.readOnly=='false'){
               return {
                name:item.name,
                mountPath:item.mountPath,
                subPath:item.subPath
              }
            }else if(item.subPath!=''&&item.readOnly=='true'){
               return {
                name:item.name,
                mountPath:item.mountPath,
                subPath:item.subPath,
                readOnly:true,
              }
            }
          })
        }
        
          containerObj = {
            name: container[i].name,
            image: container[i].mirrorImg + ':' + container[i].versions, // 'tpeccr.ccs.tencentyun.com/22333/sdf:tagv1',
            imagePullPolicy: container[i].imagePullPolicy,
            volumeMounts: mountPointArr,
            resources: {
              limits:
                {
                  cpu: container[i].limitCpu,
                  memory: container[i].limitMemory + 'Mi',
                  'nvidia.com/gpu':Number(container[i].gpuNum)
                },
              requests:
                {
                  cpu: container[i].requestCpu,
                  memory: container[i].requestMemory + 'Mi'
                }
            },
            terminationMessagePath:"/dev/termination-log",
            terminationMessagePolicy:"File",
             livenessProbe:oneContainer.livenessProbe!=undefined?oneContainer.livenessProbe:null,
            readinessProbe:oneContainer.readinessProbe!=undefined?oneContainer.readinessProbe:null,
            env: [...environmentVarArr,...citeCsArr],
            workingDir: container[i].workDirectory,
            command: command,
            args: args,
            securityContext: { privileged: container[i].privilegeLevelContainer }
          }
          containerList.push(containerObj)
        }
      }
      // 数据卷信息
      let {dataJuan}=this.wl;
      let volumesArr=[];
      dataJuan.forEach(item=>{
        console.log(item)
        let sendObj=new Object();
        sendObj.name=item.name2;
        console.log(item.name1)
        if(item.name1=='useMenu'){
          sendObj.emptyDir={}
        }else if(item.name1=='usePath'){
          sendObj.hostPath={
            path:item.name3,
            type:item.name4,
          }
        }else if(item.name1=='useNFS'){
           sendObj.nfs={
             path:item.name3.split(':')[0],
             server:item.name3.split(':')[1],
           }
        }else if(item.name1=='usePVC'){
            sendObj.persistentVolumeClaim={
              claimName:item.name3
            }
        }else if(item.name1=='useYun'){
            sendObj.qcloudCbs={
              cbsDiskId:item.name3,
              fsType:'ext4'
            }
        }else if(item.name1=='useConfig'){
            sendObj.configMap={
              name:item.name3
            }
          if(item.name4=='all'){
            sendObj.configMap.items=[]
          }else{
            let arr=[];
             item.name4.forEach(v=>{
               let obj={}
               for(let i in v){
                 if(v[i]!=''){
                   obj[i]=v[i]
                 }
               }
               arr.push(obj)
             })
            sendObj.configMap.items=arr
          }
        }else if(item.name1=='useSecret'){
            sendObj.secret={
              secretName:item.name3,
            }
          if(item.name4=='all'){
            sendObj.secret.items=[]
          }else{
             let arr=[];
             item.name4.forEach(v=>{
               let obj={}
               for(let i in v){
                 if(v[i]!=''){
                   obj[i]=v[i]
                 }
               }
               arr.push(obj)
             })
            sendObj.secret.items=arr
          } 
        }
        volumesArr.push(sendObj)
      })
      var params={
        ClusterName: this.clusterId,
        ContentType: "application/merge-patch+json",
        Method: "PATCH",
        Path: `/apis/batch/v1beta1/namespaces/${this.np}/${this.workload}/${this.name}`,
        RequestBody:{"spec":{
         "jobTemplate": {
				"spec": {
					"template": {
						"spec": {
							"volumes": volumesArr,
							"containers":containerList, 
							"imagePullSecrets":[{
								"name": "qcloudregistrykey"
							}, {
								"name": "tencenthubkey"
							}]
						}
					}
				}
			}
        }},
        Version: "2018-05-25",
        // containerList
      }
      this.axios.post(TKE_COLONY_QUERY,params).then(res=>{
        console.log(res)
        if (res.Response.Error === undefined) {
          this.$router.back()
          this.$message({
            message: '更新成功',
            type: 'success',
            showClose: true,
            duration: 0
          })
        } else {
          this.loadShow = false
          let ErrTips = {}
          let ErrOr = Object.assign(this.$ErrorTips, ErrTips)
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: 'error',
            showClose: true,
            duration: 0
          })
        }
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
     getDescribeDisks:async function(){
      let param={
        'Filters.0.Name': 'disk-usage',
        'Filters.0.Values.0': 'DATA_DISK',
        'Filters.1.Name': 'portable',
        'Filters.1.Values.0': 'TRUE',
        'Filters.2.Name': 'disk-state',
        'Filters.2.Values.0': 'UNATTACHED',
        'Filters.3.Name': 'zone',
        'Filters.3.Values.0': 'ap-taipei-1',
         'Offset': 0,
        'Limit': 20,
         Version: "2017-03-12",
      }
      if(this.dataReelDialog.yunDisks.name!='')param['Filters.4.Name']='disk-id',param['Filters.4.Values.0']=this.dataReelDialog.yunDisks.name
      await this.axios.post(TKE_YUN_HARDDISK_LIST, param).then(res => {
        if(res.Response.Error === undefined){
          this.tableData = res.Response.DiskSet,
          this.TotalCount=res.Response.DiskSet.length;
        }else{
        let ErrTips = {}
        let ErrOr = Object.assign(this.$ErrorTips, ErrTips)
        if(ErrOr[res.Response.Error.Code]=='参数错误'){
              this.tableData=[];
              this.TotalCount=0
        }else{
            this.$message({
              message: ErrOr[res.Response.Error.Code],
              type: 'error',
              showClose: true,
              duration: 2000
            })
         }
        }
      })
    } ,
    getPvc(){
      let param={
        ClusterName: this.clusterId,
        Method: "GET",
        Path: `/api/v1/namespaces/${this.wl.namespace}/persistentvolumeclaims`,
        Version: "2018-05-25",
      }
      this.axios.post(POINT_REQUEST, param).then(res => {
        this.axiosUtils(res, () => {
          let ResponseBody =JSON.parse(res.Response.ResponseBody); 
           console.log('pvcdata',ResponseBody)
            this.pvcOption=ResponseBody.items;
        })
      })

    },  
    baseData(){
      var params=null;
      if(this.workload=='cronjobs'){
        params={
          Method: "GET",
          Path:"/apis/batch/v1beta1/namespaces/" +this.np +"/cronjobs?fieldSelector=metadata.name=" +this.name,
          Version: "2018-05-25",
          ClusterName: this.clusterId
         }
      }else{
        params={
          Method: "GET",
          Path:"/apis/apps/v1beta2/namespaces/" +this.np +"/"+this.workload+"?fieldSelector=metadata.name=" +this.name,
          Version: "2018-05-25",
          ClusterName: this.clusterId
         }
      }
       this.axios.post(TKE_COLONY_QUERY,params).then(res=>{
         if(res.Response.Error === undefined){
           let response = JSON.parse(res.Response.ResponseBody);
           console.log(response)
          var {items:[{spec:{jobTemplate:{spec:{template:{spec:{containers:arr,volumes:volumesData}}}}}}]}=response;

          if(volumesData){//数据卷存在
            volumesData.forEach(item=>{
              console.log(item)
              if(item.configMap){
                this.wl.dataJuan.push({name1:'useConfig',name2:item.name,name3:item.configMap.name,name4:item.configMap.items})
              }else if(item.hostPath){
                this.wl.dataJuan.push({name1:'usePath',name2:item.name,name3:item.hostPath.path,name4:item.hostPath.type})
              }else if(item.nfs){
                  this.wl.dataJuan.push({name1:'useNFS',name2:item.name,name3:item.nfs.server+":"+item.nfs.path,name4:''})
              }else if(item.persistentVolumeClaim){
                  this.wl.dataJuan.push({name1:'usePVC',name2:item.name,name3:item.persistentVolumeClaim.claimName,name4:''})
              }else if(item.qcloudCbs){
                  this.wl.dataJuan.push({name1:'useYun',name2:item.name,name3:item.qcloudCbs.cbsDiskId,name4:''})
              }else if(item.secret){
                  this.wl.dataJuan.push({name1:'useSecret',name2:item.name,name3:item.secret.secretName,name4:item.secret.defaultMode})
              }else if(item.emptyDir){
                  this.wl.dataJuan.push({name1:'useMenu',name2:item.name,name3:'',name4:''})
              }
            })
          }  
          let arr2=[],arr3=[];
          let surviveExamineContentObj={
             inspectMethodOption: ['TCP端口检查', 'HTTP请求检查', '执行命令检查'], // 检查方法
            inspectMethodValue: 'TCP端口检查',
            inspectProtocolOption: ['HTTP', 'HTTPS'], // 检查协议
            inspectProtocolValue: '',
            executiveOrder: '', // 执行命令
            inspectPort: '0', // 检查端口
            requestPath: '', // 请求路径
            startDelay: '', // 启动延时
            responseTimeout: '2', // 响应超时,
            intervalTime: '3', // 间隔时间
            healthyThreshold: 1, // 健康阀值
            unhealthyThreshold: '1' // 不健康阀值
          }
          let readyToCheckContentObj={
              inspectMethodOption: ['TCP端口检查', 'HTTP请求检查', '执行命令检查'], // 检查方法
              inspectMethodValue: 'TCP端口检查',
              inspectProtocolOption: ['HTTP', 'HTTPS'], // 检查协议
              inspectProtocolValue: '',
              executiveOrder: '', // 执行命令
              inspectPort: '0', // 检查端口
              requestPath: '', // 请求路径
              startDelay: '', // 启动延时
              responseTimeout: '2', // 响应超时,
              intervalTime: '3', // 间隔时间
              healthyThreshold: '1', // 健康阀值
              unhealthyThreshold: '1' // 不健康阀值
          }
          for(let v of arr){
            console.log(v)
            if(v.env){
              if(v.env.length){
                 v.env.forEach(item=>{
                   if(item['value']!=undefined){
                      arr2.push(item) //环境变量
                   }else{
                     let obj={}
                     for(let i in item){
                       obj.key=Date.now();
                       obj.option1=['ConfigMap', 'Secret'];
                       obj.value1='Secret';
                       obj.option2=[];
                       obj.option3=[];
                       obj.value2=item.valueFrom.secretKeyRef.name;
                       obj.value3=item.valueFrom.secretKeyRef.key;
                       obj.input1=item.name
                     }
                       arr3.push(obj)
                   }
                 })
              }
            }
            if(v.volumeMounts&&v.volumeMounts.length!=0){//挂载点数据处理
              var  volumeArr=[];
              v.volumeMounts.forEach(v=>{
                let volumeObj=new Object();
                 volumeObj.mountPath=v.mountPath;
                 volumeObj.name=v.name;
                if(v.subPath){
                   volumeObj.subPath=v.subPath;
                  }else{
                     volumeObj.subPath='';
                }
                if(v.readOnly){//只读
                  volumeObj.readOnly='true'
                  }else{//读写
                  volumeObj.readOnly='false'
                }
                 volumeArr.push(volumeObj)
              })
            } 
            this.addInstanceContent(
            v.name,v.image.split(':')[0],v.image.split(':')[1],v.imagePullPolicy,
            parseInt(v.resources.requests.cpu),
            parseInt(v.resources.limits.cpu),
            this.formatData(v.resources.requests.memory),
            this.formatData(v.resources.limits.memory),
            Number(v.resources.limits['nvidia.com/gpu']),
            arr2,//环境变量
            arr3,//引用ConfigMap/Secret
            false,// 显示高级设置false
            v.workingDir,// 工作目录
            v.command?v.command.join('\n'):'',//运行命令
            v.args? v.args.join('\n'):'',//运行参数
            v.livenessProbe?true:false, // 存活检查
            v.readinessProbe?true:false, // 就绪检查
            v.securityContext.privileged,// 特权级容器开关
             v.livenessProbe?v.livenessProbe:surviveExamineContentObj,//存活检查内容
            v.readinessProbe?v.readinessProbe:readyToCheckContentObj,//就绪检查
             volumeArr?volumeArr:[],//数据卷挂载点
            )
          }
        }else{
            let ErrTips = {};
              let ErrOr = Object.assign(this.$ErrorTips, ErrTips);
              this.$message({
                message: ErrOr[res.Response.Error.Code],
                type: "error",
                showClose: true,
                duration: 0
              });
          }
    })
  },
  formatData(num){
      if(num.indexOf('Gi')!=-1){
         num=parseInt(num)*1024
      }else{
        num =parseInt(num)
      }
      return num
  },
  //返回上一层
  goBack() {
    this.$router.go(-1);
  },
  // 点击确定绑定镜像
  confirmMirrorImg: function (val, index) {
    console.log(val, index)
    this.wl.instanceContent[index].mirrorImg = val
  },
  initReelData(val,index){
    console.log(val,index)
    this.wl.dataJuan[index].name3=''
    this.wl.dataJuan[index].name4=''

  },
  setHostPath(index){//设置主机路径弹出框
    this.dialogVisiblePath = true
    this.dialogIndex=index;
  },
  selectHostPath(){//设置主机路径
    this.dialogVisiblePath = false
    this.wl.dataJuan[this.dialogIndex].name3=this.dataReelDialog.portPath.name;
    this.wl.dataJuan[this.dialogIndex].name4=this.dataReelDialog.portPath.type;
  },
  resetHostPath(name,type,index){//重置主机路径
    this.dialogVisiblePath = true;
    this.dialogIndex=index;
    this.dataReelDialog.portPath.name=name;
    this.dataReelDialog.portPath.type=type;
  },
  selectYun(index) {//弹出云硬盘框
    this.dialogVisibleYun = true;
    this.dialogIndex=index;
  },
  yunHardDiskId(val){//radio选中
    console.log(val)
    this.dataReelDialog.yunDisks.diskId=val;
  },
  selectYunHardDisk(){//关闭框，赋值
    this.dialogVisibleYun = false;
     this.wl.dataJuan[this.dialogIndex].name3=this.dataReelDialog.yunDisks.diskId;
     console.log(this.wl.dataJuan[this.dialogIndex])
  },
  selectConfig(index) {//弹出框
    this.dialogVisibleConfig = true;
    this.dialogIndex=index;
  },
  selectConfigSure(){//关闭框，赋值
     this.dialogVisibleConfig = false;
     this.wl.dataJuan[this.dialogIndex].name3=this.dataReelDialog.configMap.name;
     console.log(this.dataReelDialog.configMap.items)

     if(this.dataReelDialog.configMap.items.length==0){
       this.wl.dataJuan[this.dialogIndex].name4='all';
     }else{
       this.wl.dataJuan[this.dialogIndex].name4=this.dataReelDialog.configMap.items
     }
    
  },
  dialogConfigMapName(val){//configmap第一项选中后，设置items选项内容
    let  readyDatefilter=this.configMap.items,readyArr=[];
    readyDatefilter=readyDatefilter.filter(item=>{
      return item.metadata.name==val
    })
    readyDatefilter.forEach(item=>{
      readyArr=Object.keys(item.data)
    })
   this.dataReelDialog.configMap.partKeyOption=readyArr
   this.dataReelDialog.configMap.items.forEach(item=>{
      item.name=readyArr[0]
   })
  },
  dialogSecretName(val){
     let  readyDatefilter=this.secrets.items,readyArr=[];
    readyDatefilter=readyDatefilter.filter(item=>{
      return item.metadata.name==val
    })
    readyDatefilter.forEach(item=>{
      readyArr=Object.keys(item.data)
    })
    console.log(readyArr)
   this.dataReelDialog.Secret.partKeyOption=readyArr
   this.dataReelDialog.Secret.items.forEach(item=>{
      item.name=readyArr[0]
   })
  },
  selectSecret(index) {//弹出框
    this.dialogVisibleSecret = true;
    this.dialogIndex=index;
  },
  selectSecretSure() {//关闭框，赋值
    this.dialogVisibleSecret = false
    this.wl.dataJuan[this.dialogIndex].name3=this.dataReelDialog.Secret.name;
     if(this.dataReelDialog.Secret.items.length==0){
       this.wl.dataJuan[this.dialogIndex].name4='all';
     }else{
       this.wl.dataJuan[this.dialogIndex].name4=this.dataReelDialog.Secret.items
     }
  },
  //改变每页显示数量
  handleSizeChange(val) {
    console.log(`每頁 ${val} 條`);
  },
  // 改变页数
  handleCurrentChange(val) {
    this.currpage = val;
  },
},
watch: {
    wl: {
      handler(val) {
        //监听数据卷
        val.dataJuan.forEach(item => {
          if (item.name1 == "useMenu" && item.name2) {
            this.yesOrnoAddDataJuan = false;
          } else if (item.name1 && item.name2 && item.name3) {
            this.yesOrnoAddDataJuan = false;
          } else {
            this.yesOrnoAddDataJuan = true;
          }
        });
        if (val.dataJuan.length == 0) {
          this.yesOrnoAddDataJuan = false;
        }
        this.autoChangeOption=[];
        val.dataJuan.forEach(item=>{
          if(item.name2!=''){
            this.autoChangeOption.push(item.name2)
          }
        })
        let isExistvolumesDataJudge=val.dataJuan.filter(v=>{
          return  v.name2!=''
        })
        if(isExistvolumesDataJudge.length!=0){
           this.isExistvolumesData=true
        }else{
           this.isExistvolumesData=false;
        }
      },
      deep: true,
    },
    'wl.instanceContent': {
      handler: function (val) {
        let isAddContainer = true
        val.forEach(item => {
          let completed = true
          let { name, mirrorImg, environmentVar, citeCs, disAdvancedSetting, surviveExamine, readyToCheck, surviveExamineContent ,mountPoint} = item
           this.firstPointInfoData=[];
          mountPoint.forEach(v=>{
            console.log(v)
            if(v.name!=''){
             this.firstPointInfoData.push(v.name) 
            }
          })
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
    }
  }
};

 </script>

 <style lang="scss" scoped>
  .shadow {
    z-index: 999;
    float: left;
    width: 100%;
    height: 900px;
    opacity: 0.6;
    background: black;
  }

  .w250 {
    width: 250px;
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

  .ml100 {
    margin-left: 100px;
  }
  .ml8 {
    margin-left: 8px;
  }
  .flex {
    display: flex;
  }

  .port {
    max-width: 680px;
    border: 1px solid #ddd;
  }

  .card {
    padding: 10px;
    border-bottom: 1px solid #dcdfe6;
  }

  .text-error {
    color: #e54545;
  }

  .text-warning {
    color: #ff9d00
  }

  .bottom10 {
    margin-bottom: 10px;
  }

  .margin-middle {
    margin: 0px 10px;
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
i{
  cursor:pointer;
}
.ms {
  width: 330px;
  padding: 5px 8px 8px 5px;
  height: 100px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  resize: none;
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
  .add-content{
  width:80%;
  background: #f2f2f2;
  padding:12px;
  margin-bottom:10px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  }
.case-content {
  width: 80%;
  background: #f2f2f2;
  overflow: hidden;
  box-sizing: border-box;
  padding: 10px 20px ;
  &>>>.el-form-item:nth-of-type(1) {
    margin-top: 30px;
  }
}
.cpu-limit {
  display: flex;
  &>div:nth-of-type(1) {
    margin-right: 60px;
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
    padding: 0px 11px;
  }
 }
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
.setPosition3 {
  position: absolute;
  left: -52px;
  top: 8px;
}
.select-yun{
  display: flex;
  ::v-deep .el-button{
   border:solid 1px #409eff;
   color: #409eff;
   padding: 0px 15px;
   border-radius: 0px;
   height: 34px;
   line-height: 34px;
  }
  ::v-deep  .el-input__inner{
    height: 34px;
    width: 200px;

  }
}
.mount-point{
   display: flex;
   align-items: center;
}
.set-configmap{
  // border: solid 1px #ff9d00;
  box-sizing: border-box;
  padding: 20px 10px;
  box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, .2);
}


 </style>

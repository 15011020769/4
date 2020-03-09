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
           <h2 class="header-title">更新Pod配置</h2>
         </div>
         <!-- 右侧 -->
         <div class="grid-right"></div>
       </div>
     </div>
     <div class="colony-main">
       <div class="tke-card tke-formpanel-wrap mb60">
         <!-- config -->
         <el-form class="tke-form" :model="upc" label-position="left" label-width="120px" size="mini">
           <el-form-item label="数据卷（选填）">
             <!-- <div @click="a">sssssss</div> -->
             <div class="search-one" v-for="(item, index) in  upc.dataJuan" :key="index">
               <el-select v-model="item.name1" placeholder="请选择">
                 <el-option v-for="item in searchOptions" :key="item.value" :label="item.label" :value="item.value">
                 </el-option>
               </el-select>
               <el-input class="search-input" v-model="item.name2" placeholder="名称  如val"  ></el-input>
               <div class="search-hidden">
                 <p v-if="item.name1 == 'usePath'">
                   暂未设置主机路径设置主机路径
                   <span class="add-check" @click="dialogVisiblePath = true">设置主机路径</span>
                 </p>
                 <p v-if="item.name1 == 'useNFS'">
                   <el-input class="search-input" v-model="item.name3" placeholder="NFS路径 如：127.0.0.1:/dir"></el-input>
                 </p>
                 <p v-if="item.name1 == 'usePVC'">
                   <el-select v-model="item.name3">
                     <!-- <el-option v-for="item in usePvcOptions" :key="item.value" :label="item.label" :value="item.value">
                    </el-option> -->
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
               <i class="el-icon-close" @click="upc.dataJuan.splice(index, 1)"></i>
             </div>
             <p style="margin-top:8px">
               <el-button type="text"  :disabled="yesOrnoAddDataJuan" @click="addDataJuan">添加数据卷</el-button>
             </p>
             <p>
               为容器提供存储，目前支持临时路径、主机路径、云硬盘数据卷、文件存储NFS、配置文件、PVC，还需挂载到容器的指定路径中。<span
                 style="color:#409eff;cursor:pointer" >使用指引</span>
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
                   <SelectMirrorImg :dialogVisible='SelectMirrorImgFlag' @confirm='confirmMirrorImg($event, i)'></SelectMirrorImg>
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
                     <p> 指定容器运行后的工作目录，<a href="#">查看详情</a> </p>
                   </el-form-item>
                   <el-form-item label="运行命令">
                     <el-input type="textarea"  v-model="v.runCommand" class="w400"  rows="3" resize="none"></el-input>
                     <p> 控制容器运行的输入命令，<a href="#">查看详情</a> </p>
                   </el-form-item>
                   <el-form-item label="运行参数">
                     <el-input type="textarea"  v-model="v.runParam"   class="w400"  rows="3" resize="none"></el-input>
                     <p>传递给容器运行命令的输入参数，注意每个参数单独一行，<a href="#">查看详情</a> </p>
                   </el-form-item>
                   <el-form-item label="容器健康检查">
                     <el-tooltip class="item" effect="light" content="健康检查可以帮助你探测容器是否正常，以保证服务的正常运作" placement="top">
                       <i class="el-icon-info  setPosition2"></i>
                     </el-tooltip>
                     <p>
                       <el-checkbox v-model="surviveExamine">存活检查</el-checkbox> <span>检查容器是否正常，不正常则重启实例</span>
                     </p>
                     <div v-show="surviveExamine" class="from-1">
                       <!--存活检查 -->
                       <el-form :model="containerCheck" label-position="left" label-width="120px" size="mini"
                         class="from-set">
                         <el-form-item label="检查方法">
                           <el-select v-model="containerCheck.type">
                             <el-option v-for="item in containerTypeOptions" :key="item.value" :label="item.label"
                               :value="item.value">
                             </el-option>
                           </el-select>
                         </el-form-item>
                         <el-form-item label="检查协议" v-show="containerCheck.type=='HTTP请求检查'">
                           <el-select v-model="containerCheck.http.type">
                             <el-option label="HTTP" value="HTTP"> </el-option>
                             <el-option label="HTTPS" value="HTTPS"> </el-option>
                           </el-select>
                         </el-form-item>
                         <el-form-item label="执行命令" v-show="containerCheck.type=='执行命令检查'">
                           <el-input type="textarea" class="w192" v-model="upc.name" rows="4" resize="none"></el-input>
                         </el-form-item>
                         <el-form-item label="检查端口" v-show="containerCheck.type!='执行命令检查'">
                           <el-input class="w100" ></el-input>
                           <span>端口范围：1~65535</span>
                         </el-form-item>
                         <el-form-item label="请求路径" v-show="containerCheck.type=='HTTP请求检查'">
                           <el-input class="w100"></el-input>
                         </el-form-item>
                         <el-form-item label="启动延时">
                           <el-tooltip effect="light" content="容器延时启动健康检查的时间，范围：0~60秒" placement="right">
                             <i class="el-icon-info  setPosition"></i>
                           </el-tooltip>
                           <el-input class="w100" ></el-input>
                           <span>范围：0~60秒</span>
                         </el-form-item>
                         <el-form-item label="响应超时">
                           <el-tooltip effect="light" content="每次健康检查响应的最大超时时间，范围：2~60秒" placement="right">
                             <i class="el-icon-info  setPosition"></i>
                           </el-tooltip>
                           <el-input class="w100" v-model="upc.name"></el-input>
                           <span>范围：2~60秒</span>
                         </el-form-item>
                         <el-form-item label="间隔时间">
                           <el-tooltip effect="light" content="进行健康检查的时间间隔，范围：大于响应超时，小于300秒" placement="right">
                             <i class="el-icon-info  setPosition"></i>
                           </el-tooltip>
                           <el-input class="w100" v-model="upc.name"></el-input>
                           <span>范围：2~300秒</span>
                         </el-form-item>
                         <el-form-item label="健康阙值">
                           <el-tooltip effect="light" content="表示后端容器从失败到成功的连续健康检查成功次数，范围：只能为1" placement="right">
                             <i class="el-icon-info  setPosition"></i>
                           </el-tooltip>
                           <el-input class="w100" v-model="upc.name"></el-input>
                           <span>范围：1次</span>
                         </el-form-item>
                         <el-form-item label="不健康阙值">
                           <el-tooltip effect="light" content="表示后端容器从成功到失败的连续健康检查成功次数，范围：1~10次" placement="right">
                             <i class="el-icon-info  setPosition3"></i>
                           </el-tooltip>
                           <el-input class="w100" v-model="upc.name"></el-input>
                           <span>范围：1~10次</span>
                         </el-form-item>
                       </el-form>
                     </div>
                     <p>
                       <el-checkbox v-model="readyToCheck">就绪检查</el-checkbox> <span>检查容器是否就绪，不就绪则停止转发流量到当前实例</span>
                     </p>
                     <div v-show="readyToCheck" class="from-1">
                       <!--就绪检查 -->
                       <el-form :model="containerCheck" label-position="left" label-width="120px" size="mini"
                         class="from-set">
                         <el-form-item label="检查方法">
                           <el-select v-model="containerCheck.type">
                             <el-option v-for="item in containerTypeOptions" :key="item.value" :label="item.label"
                               :value="item.value">
                             </el-option>
                           </el-select>
                         </el-form-item>
                         <el-form-item label="检查协议" v-show="containerCheck.type=='HTTP请求检查'">
                           <el-select v-model="containerCheck.http.type">
                             <el-option label="HTTP" value="HTTP"> </el-option>
                             <el-option label="HTTPS" value="HTTPS"> </el-option>
                           </el-select>
                         </el-form-item>
                         <el-form-item label="执行命令" v-show="containerCheck.type=='执行命令检查'">
                           <el-input type="textarea" class="w192" v-model="upc.name" rows="4" resize="none"></el-input>
                         </el-form-item>
                         <el-form-item label="检查端口" v-show="containerCheck.type!='执行命令检查'">
                           <el-input class="w100" ></el-input>
                           <span>端口范围：1~65535</span>
                         </el-form-item>
                         <el-form-item label="请求路径" v-show="containerCheck.type=='HTTP请求检查'">
                           <el-input class="w100" ></el-input>
                         </el-form-item>
                         <el-form-item label="启动延时">
                           <el-tooltip effect="light" content="容器延时启动健康检查的时间，范围：0~60秒" placement="right">
                             <i class="el-icon-info  setPosition"></i>
                           </el-tooltip>
                           <el-input class="w100" ></el-input>
                           <span>范围：0~60秒</span>
                         </el-form-item>
                         <el-form-item label="响应超时">
                           <el-tooltip effect="light" content="每次健康检查响应的最大超时时间，范围：2~60秒" placement="right">
                             <i class="el-icon-info  setPosition"></i>
                           </el-tooltip>
                           <el-input class="w100" v-model="upc.name"></el-input>
                           <span>范围：2~60秒</span>
                         </el-form-item>
                         <el-form-item label="间隔时间">
                           <el-tooltip effect="light" content="进行健康检查的时间间隔，范围：大于响应超时，小于300秒" placement="right">
                             <i class="el-icon-info  setPosition"></i>
                           </el-tooltip>
                           <el-input class="w100" v-model="upc.name"></el-input>
                           <span>范围：2~300秒</span>
                         </el-form-item>
                         <el-form-item label="健康阙值">
                           <el-tooltip effect="light" content="表示后端容器从失败到成功的连续健康检查成功次数，范围：只能为1" placement="right">
                             <i class="el-icon-info  setPosition"></i>
                           </el-tooltip>
                           <el-input class="w100" v-model="upc.name"></el-input>
                           <span>范围：1次</span>
                         </el-form-item>
                         <el-form-item label="不健康阙值">
                           <el-tooltip effect="light" content="表示后端容器从成功到失败的连续健康检查成功次数，范围：1~10次" placement="right">
                             <i class="el-icon-info  setPosition3"></i>
                           </el-tooltip>
                           <el-input class="w100" v-model="upc.name"></el-input>
                           <span>范围：1~10次</span>
                         </el-form-item>
                       </el-form>
                     </div>

                     <p>查看健康检查和就绪检查<a href="#">使用指引</a> </p>
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
             <p class="addcontent"    style='cursor:pointer' :style="{color: isAddContainer?'#006eff':'#bbbbbb'}" @click="isAddContainer?addInstanceContent():''">添加容器</p>
             <p>注意：Workload创建完成后，容器的配置信息可以通过更新YAML的方式进行修改</p>
           </el-form-item>
           <a @click="highLevelSetShow2=!highLevelSetShow2" v-show="!highLevelSetShow2">显示高级设置</a>
           <div v-show="highLevelSetShow2">
            <el-form-item label="imagePullSecrets">
              <el-select   v-model='upn.type' style="margin-top:10px" >
                <el-option value='1'>
                </el-option>
              </el-select><br>
              <el-select  v-model='upn.type' style="margin-top:10px">
                <el-option value='1'>
                </el-option>
              </el-select>
              <p>添加</p>
            </el-form-item>
            <a @click="highLevelSetShow2=!highLevelSetShow2">隐藏高级设置</a>
         </div>
         </el-form>

         <!-- 设置主机路径 -->
         <el-dialog title="设置主机路径" :visible.sync="dialogVisiblePath" width="30%">
           <el-form :model="upc" label-position="left" label-width="120px" size="mini">
             <el-form-item label="主机路径" style="margin-top:10px">
               <el-input class="w192" v-model="upc.name" placeholder="如：/data/dev"></el-input>
             </el-form-item>
             <el-form-item label="检查类型">
               <el-select v-model="upc.name">
                 <el-option value='1'></el-option>
                 <!-- <el-option v-for="item in checkTypeOptions" :key="item.value" :label="item.label" :value="item.value"> -->
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
             <el-select>
               <el-option value='1'></el-option>
               <!-- <el-option v-for="item in usePvcOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option> -->
             </el-select>
             <el-input class="w192 ml10" placeholder="请输入数据盘ID" clearable>
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
           <el-form label-position="left" label-width="120px" size="mini">
             <el-form-item label="选择ConfigMap">
               <el-select>
                 <el-option value='1'></el-option>
                 <!-- <el-option v-for="item in checkTypeOptions" :key="item.value" :label="item.label" :value="item.value"> -->
                 <!-- </el-option> -->
               </el-select>
             </el-form-item>
             <el-form-item label="选项">
               <el-radio-group v-model="setConfigMap.checked ">
                 <el-radio label="all">全部</el-radio>
                 <el-radio label="part">指定部分Key</el-radio>
               </el-radio-group>
             </el-form-item>
             <el-form-item label="Items" v-show="setConfigMap.checked == 'part'">
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
           <el-form label-position="left" label-width="120px" size="mini">
             <el-form-item label="选择Secret">
               <el-select>
                 <!-- <el-option v-for="item in checkTypeOptions" :key="item.value" :label="item.label" :value="item.value"> -->
                 <!-- </el-option> -->
                 <el-option value='1'></el-option>
               </el-select>
             </el-form-item>
             <el-form-item label="选项">
               <el-radio-group v-model="setSecret.checked">
                 <el-radio label="all">全部</el-radio>
                 <el-radio label="part">指定部分Key</el-radio>
               </el-radio-group>
             </el-form-item>
             <el-form-item label="Items" v-show="setSecret.checked == 'part'">
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
           <el-button size="small" type="primary" @click="submit" >完成</el-button>
           <el-button size="small" @click="$router.go(-1)">取消</el-button>
         </div>
       </div>
     </div>

   </div>

</template>

 <script>
import SelectMirrorImg from '../../create/resource/components/selectMirrorImg';
import workLoadMixin from './js/workloadMixins'
import FileSaver from "file-saver";
import XLSX from "xlsx";
import {TKE_COLONY_QUERY, POINT_REQUEST} from '@/constants'
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
      selectRadio:'Always',
      isAddContainer: false, // 是否可以点击 添加容器
      // 更新pod数量
      upn: {
        type: '1',
        num: 0,
      },
      touchTactics: [{
        touch1: 'CPU',
        touch2: 'CPU使用量',
        size: ''
      }], // 实例数量自动调节下拉框内容
      touchOptions1: [{
          value: 'CPU',
          label: 'CPU'
        }, {
          value: '内存',
          label: '内存'
        }, //触发策略
        {
          value: '硬盘',
          label: '硬盘'
        }, {
          value: '网络',
          label: '网络'
        },
      ],
      touchOptions2: [{
          value: 'CPU使用量',
          label: 'CPU使用量'
        }, {
          value: 'CPU利用率（占节点）',
          label: 'CPU利用率（占节点）'
        },
        {
          value: 'CPU利用率（占Request）',
          label: 'CPU利用率（占Request）'
        }, {
          value: 'CPU利用率（占Limit）',
          label: 'CPU利用率（占Limit）'
        },
      ],

      // 更新pod配置
      upc: {
        dataJuan: [],
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
      containerCheck: {
      type: 'TCP端口检查',
      http: {
        type: 'HTTP'
      }
    },
    containerTypeOptions: [{
        value: 'TCP端口检查',
        label: 'TCP端口检查'
      },
      {
        value: 'HTTP请求检查',
        label: 'HTTP请求检查'
      },
      {
        value: '执行命令检查',
        label: '执行命令检查'
      },
    ],
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
          label: "使用腾讯云硬盘"
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
      setConfigMap: {
        checked: 'all'
      },
      setSecret: {
        checked: 'all'
      },
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
    this.baseData()
    this.getConfigmaps();
    this.getSecrets()
    console.log(this.wl.instanceContent)
  },
  methods: {

    submit(){
      let container = this.wl.instanceContent
      let containerObj = {}
      let containerList = []
      if (container.length > 0) {
        for (let i = 0; i < container.length; i++) {
          containerObj = {
            name: container[i].name,
            image: container[i].mirrorImg + ':' + container[i].versions, // 'tpeccr.ccs.tencentyun.com/22333/sdf:tagv1',
            imagePullPolicy: container[i].imagePullPolicy,
            volumeMounts: [],
            resources: {
              limits:
                {
                  cpu: container[i].limitCpu,
                  memory: container[i].limitMemory + 'Mi',
                  'nvidia.com/gpu': container[i].gpuNum
                },
              requests:
                {
                  cpu: container[i].requestCpu,
                  memory: container[i].requestMemory + 'Mi'
                }
            },
            terminationMessagePath:"/dev/termination-log",
            terminationMessagePolicy:"File",
            livenessProbe:null,
            readinessProbe:null,
            env: container[i].environmentVar,
            workingDir: '',
            command: [],
            args: [],
            securityContext: { privileged: false }
          }
          containerList.push(containerObj)
        }
      }
      console.log(containerList)
      var params={
        ClusterName: this.clusterId,
        ContentType: "application/merge-patch+json",
        Method: "PATCH",
        Path: "/apis/apps/v1beta2/namespaces/"+this.np +"/"+this.workload+"/"+this.name,
        RequestBody:{"spec":{
          "template":{
            "spec":{
              "volumes":[],
              "containers":containerList,
              "imagePullSecrets":[{"name":"qcloudregistrykey"},{"name":"tencenthubkey"}]
            }}
        }},
        Version: "2018-05-25",
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
          if(this.workload=='cronjobs'){
            var {items:[{spec:{jobTemplate:{spec:{template:{spec:{containers:arr}}}}}}]}=response;
          }else{
            var {items:[{spec:{template:{spec:{containers:arr}}}}]}=response;
          }
          let arr2=[],arr3=[];
          console.log(arr)
          for(let v of arr){
            console.log(v)
            console.log(v.env)
            if(v.env){
              if(v.env.length){
                 v.env.forEach(item=>{
                   if(item['value']!=undefined){
                      arr2.push(item) //环境变量
                   }else{
                     for(let i in item){
                     let obj={}
                       obj.key=Date.now();
                       obj.option1=['ConfigMap', 'Secret'];
                       obj.value1='Secret';
                       obj.option2=[];
                       obj.option3=[];
                       obj.value2=item.valueFrom.secretKeyRef.name;
                       obj.value3=item.valueFrom.secretKeyRef.key;
                       obj.input1=item.name
                       arr3.push(obj)
                     }
                   }
                 })
              }
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
           '',//运行命令
            '',//运行参数
            false, // 存活检查
            false, // 就绪检查
            v.securityContext.privileged// 特权级容器开关
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
  newAddTarget() { //新增指标
    var obj = {
      touch1: 'CPU',
      touch2: 'CPU使用量',
      size: ''
    }
    this.touchTactics.push(obj)
  },
  selectYun() {
    this.dialogVisibleYun = true;
  },
  selectConfig() {
    this.dialogVisibleConfig = true;
  },
  selectSecret() {
    this.dialogVisibleSecret = true;
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
    upc: {
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
      },
      deep: true,
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


 </style>

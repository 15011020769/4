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
             <div class="search-one" v-for="(item, index) in  upc.dataJuan" :key="index">
               <el-select v-model="item.name1" placeholder="请选择">
                 <el-option v-for="item in searchOptions" :key="item.value" :label="item.label" :value="item.value">
                 </el-option>
               </el-select>
               <el-input class="search-input" v-model="item.name2" placeholder="请输入内容"></el-input>
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
               <el-button type="primary" :disabled="yesOrnoAddDataJuan" @click="addDataJuan">添加数据卷</el-button>
             </p>
             <p>
               为容器提供存储，目前支持临时路径、主机路径、云硬盘数据卷、文件存储NFS、配置文件、PVC，还需挂载到容器的指定路径中。<span
                 style="color:#409eff;cursor:pointer">使用指引</span>
             </p>
           </el-form-item>
           <el-form-item label="实例内容器">
             <div class='add-content' v-if="false">   <span></span>  <span><i class="el-icon-edit"></i><i class="el-icon-close ml10"></i></span> </div>
             <div class="case-content">
               <el-form :model='upc' label-position="left" label-width="120px" size="mini">
                 <el-form-item label="名称">
                   <el-input class="w192" v-model="caseContent.name" placeholder="请输入容器名称"></el-input>
                   <p>请输入容器名称最长63个字符，只能包含小写字母、数字及分隔符("-")，且不能以分隔符开头或结尾</p>
                 </el-form-item>
                 <el-form-item label="镜像">
                   <el-input class="w192" v-model="caseContent.image"></el-input>
                   <span> <a @click="SelectMirrorImgFlag=true"> 选择镜像</a> </span>
                   <SelectMirrorImg :dialogVisible='SelectMirrorImgFlag' @close='close'></SelectMirrorImg>
                 </el-form-item>
                 <el-form-item label="镜像版本（Tag）">
                   <el-input class="w192" v-model="caseContent.version"></el-input>
                 </el-form-item>
                 <el-form-item label="镜像拉取策略">
                   <template>
                     <el-radio-group v-model="caseContent.imagePullPolicy" style="margin-bottom: 5px;">
                       <el-radio-button label="Always">Always</el-radio-button>
                       <el-radio-button label="IfNotPresent">IfNotPresent</el-radio-button>
                       <el-radio-button label="Never">Never</el-radio-button>
                     </el-radio-group>
                     <p v-show="selectRadio=='Always'">总是从远程拉取该镜像</p>
                     <p v-show="selectRadio=='IfNotPresent'">默认使用本地镜像，若本地无该镜像则远程拉取该镜像</p>
                     <p v-show="selectRadio=='Never'">只使用本地镜像，若本地没有该镜像将报异常</p>
                   </template>
                 </el-form-item>
                 <el-form-item label="CPU/内存限制">
                   <div class="cpu-limit">
                     <div>
                       <p>CPU限制</p>
                       <div style="display:flex">
                         <div class="cpu-limit2">
                           <span>request</span>
                           <el-input class="w192" v-model="caseContent"></el-input>
                         </div>-
                         <div class="cpu-limit2">
                           <span>limit</span>
                           <el-input class="w192" v-model="caseContent"></el-input>
                         </div>核
                       </div>
                     </div>
                     <div>
                       <p>内存限制</p>
                       <div style="display:flex">
                         <div class="cpu-limit2">
                           <span>request</span>
                           <el-input class="w192" v-model="caseContent"></el-input>
                         </div>-
                         <div class="cpu-limit2">
                           <span>limit</span>
                           <el-input class="w192" v-model="caseContent"></el-input>
                         </div>Mib
                       </div>
                     </div>
                   </div>
                   <p style="margin-top:10px;">
                     Request用于预分配资源,当集群中的节点没有request所要求的资源数量时,容器会创建失败。Limit用于设置容器使用资源的最大上限,避免异常情况下节点资源消耗过多。</p>
                 </el-form-item>
                 <el-form-item label="GPU限制">
                   <el-input-number v-model="caseContent.limitNum" size="small" :min="0"></el-input-number>个
                 </el-form-item>
                 <el-form-item label="环境变量">
                   <el-tooltip class="item" effect="light" content="设置容器中的变量" placement="top">
                     <i class="el-icon-info  setPosition"></i>
                   </el-tooltip>
                   <div style="padding:0px 0px 6px;" v-for="(v,i) in caseContent.environmentVar1" :key="i">
                     <el-input class="w100" v-model="v.key" placeholder="变量名"></el-input> =
                     <el-input class="w192" v-model="v.value" placeholder="变量值"></el-input>
                     <i class="el-icon-close" style="font-size:20px;margin-left:20px;cursor:pointer"
                       @click="caseContent.environmentVar1.splice(i,1)"></i>
                   </div>
                   <!-- <hr v-if="caseContent.environmentVar1.length>0&&caseContent.environmentVar2.length>0"> -->
                   <div v-for="(v,i) in caseContent.environmentVar2" :key="i">
                     <el-select   v-model="v.data1" class="w100">
                       <el-option value="1" label='1'> </el-option>
                     </el-select>
                     <el-select  v-model="v.data2" class="w100" style="margin:0px 10px;">
                         <el-option value="1"  label='1'> </el-option>
                     </el-select>
                     <el-select v-model="v.data3"  class="w100">
                        <el-option value="1"  label='1'> </el-option>
                     </el-select>以
                     <el-input class="w150" v-model="v.elseName"></el-input> 为别名
                     <i class="el-icon-close"  @click="caseContent.environmentVar2.splice(i,1)"    style="font-size:20px;margin-left:20px;cursor:pointer"></i>
                   </div>
                   <a href="javascript:;" @click='addEnvironmentVar'>新增变量</a>
                   <a href="javascript:;" style="margin-left:4px;" @click="importAddCs">引用ConfigMap/Secret</a>
                   <p>只能包含字母、数字及分隔符("-"、"_"、".")，且必须以字母开头</p>
                 </el-form-item>
                 <a href="javascript:;" @click="highLevelSetShow=true" v-show="!highLevelSetShow">显示高级设置</a>
                 <div v-show="highLevelSetShow">
                   <el-form-item label="工作目录">
                     <el-input class="w192" v-model="caseContent.workingDir"></el-input>
                     <p> 指定容器运行后的工作目录，<a href="#">查看详情</a> </p>
                   </el-form-item>
                   <el-form-item label="运行命令">
                     <el-input type="textarea" class="w400" v-model="caseContent.command[0]" rows="3" resize="none"></el-input>
                     <p> 控制容器运行的输入命令，<a href="#">查看详情</a> </p>
                   </el-form-item>
                   <el-form-item label="运行参数">
                     <el-input type="textarea" class="w400" v-model="caseContent.args[0]" rows="3" resize="none"></el-input>
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
                     <el-switch active-color="#006eff" inactive-color="#888">
                     </el-switch>
                     <p> 容器开启特权级，将拥有宿主机的root权限 </p>
                   </el-form-item>
                   <a href="javascript:;" @click="highLevelSetShow=false">隐藏高级设置</a>
                 </div>

               </el-form>
             </div>
             <p class="addcontent">添加容器</p>
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
           <el-button size="small" type="primary" >完成</el-button>
           <el-button size="small" @click="$router.go(-1)">取消</el-button>
         </div>
       </div>
     </div>

   </div>

</template>

 <script>
   import SelectMirrorImg from '../../create/resource/components/selectMirrorImg'
   import FileSaver from "file-saver";
   import XLSX from "xlsx";
   import {TKE_COLONY_QUERY} from '@/constants'
   export default {
     name: "svcCreate",
     data() {
       return {
         loadShow: false,
         dialogFormVisible: false,
         clusterId: '',
         np:'',
         name: '',//路由传过来的工作负载数据
         selectRadio:'Always',
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
        caseContent:{
        name:'',
        image:'',
        version:'',
        imagePullPolicy:'',
        workingDir:'',
        command:[],
        args:[],
        // mirrorPullTactics: 'Always', //镜像拉取策略
        // requestCpu:'',
        // limitCpu:'',
        // requestMemory:'',
        // limitMemory:'',
        // limitNum:0,
        // environmentVar1:[],
        // environmentVar2:[],
        // citeCs:[],
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
         }

       };
     },

     components: {
       SelectMirrorImg
     },
     created() {
        this.clusterId=this.$route.query.clusterId;
     this.name=this.$route.query.name;
     this.np=this.$route.query.spaceName;
     this.baseData()
     },
     methods: {

      baseData(){
        var params={
          Method: "GET",
          Path:"/apis/apps/v1beta2/namespaces/" +this.np +"/deployments?fieldSelector=metadata.name=" +this.name,
          Version: "2018-05-25",
          ClusterName: this.clusterId
      }
      this.axios.post(TKE_COLONY_QUERY,params).then(res=>{
        console.log(res)
        if(res.Response.Error === undefined){
            let response = JSON.parse(res.Response.ResponseBody);
            // let response = res.Response.ResponseBody;
            console.log(response)
            let {items:[{spec:{template:{spec:{containers:[obj]}}}}]}=response;
            console.log(obj)
            this.caseContent=obj
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
        //返回上一层
       goBack() {
         this.$router.go(-1);
       },
       newAddTarget() { //新增指标
         var obj = {
           touch1: 'CPU',
           touch2: 'CPU使用量',
           size: ''
         }
         this.touchTactics.push(obj)
       },
       addDataJuan() { //新增数据卷
         this.dataFlag = true;
         var obj = {
           name1: "",
           name2: "",
           name3: ""
         };
         this.upc.dataJuan.push(obj);
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

      //  
       addEnvironmentVar(){
         this.caseContent.environmentVar1.push({key:'',value:''})
       } ,
       importAddCs(){
           this.caseContent.environmentVar2.push({data1:'',data2:'',data3:'',elseName:''})
       },
      close(val){
        this.SelectMirrorImgFlag=val;
        console.log(val)
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
    padding: 20px 20px 0px;

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

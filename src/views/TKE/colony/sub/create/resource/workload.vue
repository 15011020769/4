<!-- 新建Workload -->
<template>
  <div class="colony-wrap">
    <div class="tke-content-header">
      <div class="tke-grid ">
        <!-- 左侧 -->
        <div class="grid-left">
          <span class="goback" @click="goBack">
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
        <el-form class="tke-form" :model="wl" label-position="left" label-width="120px" size="mini">
          <el-form-item label="名称">
            <el-input class="w200" v-model="wl.name" placeholder="请输入Workload名称"></el-input>
            <p>
              最长40个字符，只能包含小写字母、数字及分隔符("-")，且必须以小写字母开头，数字或小写字母结尾
            </p>
          </el-form-item>
          <el-form-item label="描述">
            <el-input class="w420" type="textarea" :rows="6" placeholder="请输入描述信息，不超过1000个字符" v-model="wl.desc">
            </el-input>
          </el-form-item>

          <el-form-item label="标签">
            <el-input class="w200" v-model="wl.name" placeholder="请输入Workload名称"></el-input>
            <p>
              最长40个字符，只能包含小写字母、数字及分隔符("-")，且必须以小写字母开头，数字或小写字母结尾
            </p>
          </el-form-item>

          <el-form-item label="类型">
            <div class="form-controls" style="width:350px">
              <el-radio-group class="tke-radio-group" v-model="wl.type">
                <el-radio label="deployment">Deployment（可扩展的部署Pod）</el-radio>
                <el-radio label="daemonSet">DaemonSet（在每个主机上运行Pod）</el-radio>
                <el-radio label="statefulSet">StatefulSet（有状态集的运行Pod）</el-radio>
                <el-radio label="cronJob">CronJob（按照Cron的计划定时运行）</el-radio>
                <el-radio label="job">Job（单次任务）</el-radio>
              </el-radio-group>
            </div>
          </el-form-item>
          <!--  <div> -->
          <el-form-item label="数据卷（选填）">
            <div class="search-one" v-show="dataFlag" v-for="(item, index) in dataJuan" :key="index">
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
            <p style="margin-top:8px">
              <el-button type="primary" :disabled="yesOrnoAddDataJuan" @click="addDataJuan">添加数据卷</el-button>
            </p>
            <p>
              为容器提供存储，目前支持临时路径、主机路径、云硬盘数据卷、文件存储NFS、配置文件、PVC，还需挂载到容器的指定路径中。<span
                style="color:#409eff;cursor:pointer">使用指引</span>
            </p>
          </el-form-item>
          <el-form-item label="实例内容器">
            <div class="case-content">
              <el-form :model="wl" label-position="left" label-width="120px" size="mini">
                <el-form-item label="名称">
                  <el-input class="w192" v-model="wl.name" placeholder="请输入容器名称"></el-input>
                  <p>请输入容器名称最长63个字符，只能包含小写字母、数字及分隔符("-")，且不能以分隔符开头或结尾</p>
                </el-form-item>
                <el-form-item label="镜像">
                  <el-input class="w192" v-model="wl.name"></el-input>
                  <span> <a href="#"> 选择镜像</a> </span>
                </el-form-item>
                <el-form-item label="镜像版本（Tag）">
                  <el-input class="w192" v-model="wl.name"></el-input>
                </el-form-item>
                <el-form-item label="镜像拉取策略">
                  <template>
                    <el-radio-group v-model="mirrorPullTactics" style="margin-bottom: 5px;">
                      <el-radio-button label="Always">Always</el-radio-button>
                      <el-radio-button label="IfNotPresent">IfNotPresent</el-radio-button>
                      <el-radio-button label="Never">Never</el-radio-button>
                    </el-radio-group>
                    <p v-show="mirrorPullTactics=='Always'">总是从远程拉取该镜像</p>
                    <p v-show="mirrorPullTactics=='IfNotPresent'">默认使用本地镜像，若本地无该镜像则远程拉取该镜像</p>
                    <p v-show="mirrorPullTactics=='Never'">只使用本地镜像，若本地没有该镜像将报异常</p>
                  </template>
                </el-form-item>
                <el-form-item label="CPU/内存限制">
                  <div class="cpu-limit">
                    <div>
                      <p>CPU限制</p>
                      <div style="display:flex">
                        <div class="cpu-limit2">
                          <span>request</span>
                          <el-input class="w192" v-model="wl.name"></el-input>
                        </div>-
                        <div class="cpu-limit2">
                          <span>limit</span>
                          <el-input class="w192" v-model="wl.name"></el-input>
                        </div>核
                      </div>
                    </div>
                    <div>
                      <p>内存限制</p>
                      <div style="display:flex">
                        <div class="cpu-limit2">
                          <span>request</span>
                          <el-input class="w192" v-model="wl.name"></el-input>
                        </div>-
                        <div class="cpu-limit2">
                          <span>limit</span>
                          <el-input class="w192" v-model="wl.name"></el-input>
                        </div>Mib
                      </div>
                    </div>
                  </div>
                  <p style="margin-top:10px;">
                    Request用于预分配资源,当集群中的节点没有request所要求的资源数量时,容器会创建失败。Limit用于设置容器使用资源的最大上限,避免异常情况下节点资源消耗过多。</p>
                </el-form-item>
                <el-form-item label="环境变量">
                  <el-tooltip class="item" effect="light" content="设置容器中的变量" placement="top">
                    <i class="el-icon-info  setPosition"></i>
                  </el-tooltip>
                  <a href="#">新增变量</a>
                  <a href="#" style="margin-left:4px;">引用ConfigMap/Secret</a>
                  <p>只能包含字母、数字及分隔符("-"、"_"、".")，且必须以字母开头</p>
                </el-form-item>
                <a href="#" @click="highLevelSetShow=true" v-show="!highLevelSetShow">显示高级设置</a>
                <div v-show="highLevelSetShow">
                  <el-form-item label="工作目录">
                    <el-input class="w192" v-model="wl.name"></el-input>
                    <p> 指定容器运行后的工作目录，<a href="#">查看详情</a> </p>
                  </el-form-item>
                  <el-form-item label="运行命令">
                    <el-input type="textarea" class="w400" v-model="wl.name" rows="3" resize="none"></el-input>
                    <p> 控制容器运行的输入命令，<a href="#">查看详情</a> </p>
                  </el-form-item>
                  <el-form-item label="运行参数">
                    <el-input type="textarea" class="w400" v-model="wl.name" rows="3" resize="none"></el-input>
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
                          <el-input type="textarea" class="w192" v-model="wl.name" rows="4" resize="none"></el-input>
                        </el-form-item>
                        <el-form-item label="检查端口" v-show="containerCheck.type!='执行命令检查'">
                          <el-input class="w100" v-model="value"></el-input>
                          <span>端口范围：1~65535</span>
                        </el-form-item>
                        <el-form-item label="请求路径" v-show="containerCheck.type=='HTTP请求检查'">
                          <el-input class="w100" v-model="value"></el-input>
                        </el-form-item>
                        <el-form-item label="启动延时">
                          <el-tooltip effect="light" content="容器延时启动健康检查的时间，范围：0~60秒" placement="right">
                            <i class="el-icon-info  setPosition"></i>
                          </el-tooltip>
                          <el-input class="w100" v-model="value"></el-input>
                          <span>范围：0~60秒</span>
                        </el-form-item>
                        <el-form-item label="响应超时">
                          <el-tooltip effect="light" content="每次健康检查响应的最大超时时间，范围：2~60秒" placement="right">
                            <i class="el-icon-info  setPosition"></i>
                          </el-tooltip>
                          <el-input class="w100" v-model="wl.name"></el-input>
                          <span>范围：2~60秒</span>
                        </el-form-item>
                        <el-form-item label="间隔时间">
                          <el-tooltip effect="light" content="进行健康检查的时间间隔，范围：大于响应超时，小于300秒" placement="right">
                            <i class="el-icon-info  setPosition"></i>
                          </el-tooltip>
                          <el-input class="w100" v-model="wl.name"></el-input>
                          <span>范围：2~300秒</span>
                        </el-form-item>
                        <el-form-item label="健康阙值">
                          <el-tooltip effect="light" content="表示后端容器从失败到成功的连续健康检查成功次数，范围：只能为1" placement="right">
                            <i class="el-icon-info  setPosition"></i>
                          </el-tooltip>
                          <el-input class="w100" v-model="wl.name"></el-input>
                          <span>范围：1次</span>
                        </el-form-item>
                        <el-form-item label="不健康阙值">
                          <el-tooltip effect="light" content="表示后端容器从成功到失败的连续健康检查成功次数，范围：1~10次" placement="right">
                            <i class="el-icon-info  setPosition3"></i>
                          </el-tooltip>
                          <el-input class="w100" v-model="wl.name"></el-input>
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
                          <el-input type="textarea" class="w192" v-model="wl.name" rows="4" resize="none"></el-input>
                        </el-form-item>
                        <el-form-item label="检查端口" v-show="containerCheck.type!='执行命令检查'">
                          <el-input class="w100" v-model="value"></el-input>
                          <span>端口范围：1~65535</span>
                        </el-form-item>
                        <el-form-item label="请求路径" v-show="containerCheck.type=='HTTP请求检查'">
                          <el-input class="w100" v-model="value"></el-input>
                        </el-form-item>
                        <el-form-item label="启动延时">
                          <el-tooltip effect="light" content="容器延时启动健康检查的时间，范围：0~60秒" placement="right">
                            <i class="el-icon-info  setPosition"></i>
                          </el-tooltip>
                          <el-input class="w100" v-model="value"></el-input>
                          <span>范围：0~60秒</span>
                        </el-form-item>
                        <el-form-item label="响应超时">
                          <el-tooltip effect="light" content="每次健康检查响应的最大超时时间，范围：2~60秒" placement="right">
                            <i class="el-icon-info  setPosition"></i>
                          </el-tooltip>
                          <el-input class="w100" v-model="wl.name"></el-input>
                          <span>范围：2~60秒</span>
                        </el-form-item>
                        <el-form-item label="间隔时间">
                          <el-tooltip effect="light" content="进行健康检查的时间间隔，范围：大于响应超时，小于300秒" placement="right">
                            <i class="el-icon-info  setPosition"></i>
                          </el-tooltip>
                          <el-input class="w100" v-model="wl.name"></el-input>
                          <span>范围：2~300秒</span>
                        </el-form-item>
                        <el-form-item label="健康阙值">
                          <el-tooltip effect="light" content="表示后端容器从失败到成功的连续健康检查成功次数，范围：只能为1" placement="right">
                            <i class="el-icon-info  setPosition"></i>
                          </el-tooltip>
                          <el-input class="w100" v-model="wl.name"></el-input>
                          <span>范围：1次</span>
                        </el-form-item>
                        <el-form-item label="不健康阙值">
                          <el-tooltip effect="light" content="表示后端容器从成功到失败的连续健康检查成功次数，范围：1~10次" placement="right">
                            <i class="el-icon-info  setPosition3"></i>
                          </el-tooltip>
                          <el-input class="w100" v-model="wl.name"></el-input>
                          <span>范围：1~10次</span>
                        </el-form-item>
                      </el-form>
                    </div>

                    <p>查看健康检查和就绪检查<a href="#">使用指引</a> </p>
                  </el-form-item>
                  <el-form-item label="特权级容器">
                    <el-switch  active-color="#006eff" inactive-color="#888">
                    </el-switch>
                    <p> 容器开启特权级，将拥有宿主机的root权限 </p>
                  </el-form-item>
                  <a href="#" @click="highLevelSetShow=false">隐藏高级设置</a>
                </div>

              </el-form>
            </div>
          </el-form-item>

          <!--  </div> -->
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
            <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%">
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
          <el-button size="small" type="primary">创建Workload</el-button>
          <el-button size="small">取消</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import FileSaver from "file-saver";
  import XLSX from "xlsx";
  import {
    ALL_CITY
  } from "@/constants";
  export default {
    name: "workloadCreate",
    data() {
      return {
        wl: {
          name: "",
          desc: "",
          type: ""
        },
        setConfigMapData: {
          select: "",
          checked: ""
        },
        setSecretData: {
          select: "",
          checked: ""
        },
        containerCheck: {
          type: 'TCP端口检查',
          http: {
            type: 'HTTP'
          }
        },
        dataFlag: false,
        yesOrnoAddDataJuan: false,
        input: "",
        setIndex: "",
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
        containerTypeOptions: [{
            value: 'TCP端口检查',
            key: 'TCP端口检查'
          },
          {
            value: 'HTTP请求检查',
            key: 'HTTP请求检查'
          },
          {
            value: '执行命令检查',
            key: '执行命令检查'
          },
        ],
        value: "",
        dataJuan: [],
        usePvcOptions: [],
        checkTypeOptions: [],
        tableData: [],
        //分页
        TotalCount: 0,
        pagesize: 10,
        currpage: 1,

        searchYun: "",

        dialogVisiblePath: false,
        dialogVisibleYun: false,
        dialogVisibleConfig: false,
        dialogVisibleSecret: false,
        mirrorPullTactics: 'Always', //镜像拉取策略
        surviveExamine: false,//存活检查
        readyToCheck: false,//就绪检查
        highLevelSetShow:false,
      };
    },
    components: {},
    watch: {
      dataJuan: {
        handler(val) {
          val.forEach(item => {
            if (item.name1 == "useMenu" && item.name2) {
              this.yesOrnoAddDataJuan = false;
            } else if (item.name1 && item.name2 && item.name3) {
              this.yesOrnoAddDataJuan = false;
            } else {
              this.yesOrnoAddDataJuan = true;
            }
          });
          if (val.length == 0) {
            this.yesOrnoAddDataJuan = false;
          }
        },
        deep: true
      }
    },
    created() {
      // 从路由获取类型
      this.wl.type = this.$route.query.type;
    },
    methods: {
      //返回上一层
      goBack() {
        this.$router.go(-1);
      },
      addDataJuan() {
        this.dataFlag = true;
        var obj = {
          name1: "",
          name2: "",
          name3: ""
        };
        this.dataJuan.push(obj);
      },
      delDataJuan(index) {
        this.dataJuan.splice(index, 1);
      },
      //选择云硬盘
      selectYun() {
        this.dialogVisibleYun = true;
      },
      selectConfig() {
        this.dialogVisibleConfig = true;
      },
      selectSecret() {
        this.dialogVisibleSecret = true;
      },
      handleSizeChange(val) {
        console.log(`每頁 ${val} 條`);
      },
      // 改变页数
      handleCurrentChange(val) {
        this.currpage = val;
      }
    }
  };

</script>

<style lang="scss" scoped>
  .tke-radio-group {
    .el-radio {
      display: block;
    }

    .el-radio+.el-radio {
      margin-left: 0;
      margin-top: 10px;
    }
  }

  .w192 {
    width: 192px;
  }

  .w100 {
    width: 100px;
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

  .w400 {
    width: 400px;
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
    padding: 0px 20px;

    &>>>.el-form-item:nth-of-type(1) {
      margin-top: 30px;
    }

  }

  .cpu-limit {
    display: flex;

    &>div:nth-of-type(1) {
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

    &>>>.el-input__inner {
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

    &>>>.el-form-item:nth-of-type(1) {
      margin-top: 0px !important;
    }

    &>>>.el-form-item {
      // margin-bottom: 0px !important;
    }

    .from-set {
      background: #f2f2f2;
      padding: 6px;
    }
  }

</style>

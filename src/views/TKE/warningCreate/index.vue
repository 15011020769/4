<template>
  <div class="persistenceSetting">
    <div class="back-hd flex">
      <router-link :to="'/warnings'">
        <i class="el-icon-back hd-icon-back"></i>
      </router-link>
      <h3>新建策略</h3>
    </div>
      <div class="tf-g app-tke-fe-content__inner">
        <div class="event-persistence font">
          <el-form ref="form" :model="form" label-width="100px">
            <el-form-item label="地域">
              <div>中国台北</div>
            </el-form-item>
            <el-form-item label="集群">
              <div>cls-gwblk71e(tfy_test)</div>
            </el-form-item>
            <el-form-item label="告警策略名称">
              <el-input size="mini" class="el-input" placeholder="请输入告警策略名称"></el-input>
              <div>最长40个字符</div>
            </el-form-item>
            <el-form-item label="备注">
              <el-input type="textarea" class="el-textarea" placeholder="请输入策略备注" v-model="form.desc"></el-input>
              <div>最长100个字符</div>
            </el-form-item>
            <el-form-item label="策略类型">
              <el-select v-model="value" placeholder="请选择活动区域" size="mini">
                <el-option label="集群" value="jq">
                </el-option>
                <el-option label="节点" value="jd"></el-option>
                <el-option label="pod" value="pod"></el-option>
              </el-select>
            </el-form-item>
            <!-- 集群显示内容 -->
            <div v-if="value=='jq'">
              <el-form-item label="指标">
                <div class="form-form">
                  <div class="flex p3">
                    <!-- 内容 -->
                    <div class="flex" style="flex:1;padding-top:5px;">
                      <input class="el-checkbox" type="checkbox" v-model="cpuLY.check">
                      <span>CPU利用率</span>
                    </div>
                    <div>
                      <el-select v-model="cpuLY.tj" placeholder="请选择" size="mini">
                        <el-option
                          v-for="(item,i) in cpuLY.tjs"
                          :key="i"
                          :value="item">
                        </el-option>
                      </el-select>
                      <el-select v-model="cpuLY.gl" placeholder="请选择" size="mini" class="glw">
                        <el-option
                          v-for="(item,i) in cpuLY.gls"
                          :key="i"
                          :value="item">
                        </el-option>
                      </el-select>
                      <el-input v-model="cpuLY.number" size="mini" class="w100"></el-input>
                      <span class="numberEnd">{{cpuLY.numberEnd}}</span>
                      <el-select v-model="cpuLY.zq" placeholder="请选择" size="mini" class="gz" style="padding-left:20px;">
                        <el-option
                          v-for="(item,i) in cpuLY.zqs"
                          :key="i"
                          :value="item">
                        </el-option>
                      </el-select>
                    </div>
                  </div>
                  <div class="flex p3">
                    <!-- 内容 -->
                    <div class="flex" style="flex:1;padding-top:5px;">
                      <input class="el-checkbox" type="checkbox" v-model="ncLY.check">
                      <span>内存利用率</span>
                    </div>
                    <div>
                      <el-select v-model="ncLY.tj" placeholder="请选择" size="mini">
                        <el-option
                          v-for="(item,i) in ncLY.tjs"
                          :key="i"
                          :value="item">
                        </el-option>
                      </el-select>
                      <el-select v-model="ncLY.gl" placeholder="请选择" size="mini" class="glw">
                        <el-option
                          v-for="(item,i) in ncLY.gls"
                          :key="i"
                          :value="item">
                        </el-option>
                      </el-select>
                      <el-input v-model="ncLY.number" size="mini" class="w100"></el-input>
                      <span class="numberEnd">{{ncLY.numberEnd}}</span>
                      <el-select v-model="ncLY.zq" placeholder="请选择" size="mini" class="gz" style="padding-left:20px;">
                        <el-option
                          v-for="(item,i) in ncLY.zqs"
                          :key="i"
                          :value="item">
                        </el-option>
                      </el-select>
                    </div>
                  </div>
                  <div class="flex p3">
                    <!-- 内容 -->
                    <div class="flex" style="flex:1;padding-top:5px;">
                      <input class="el-checkbox" type="checkbox" v-model="cpuFP.check">
                      <span>CPU分配率</span>
                    </div>
                    <div>
                      <el-select v-model="cpuFP.tj" placeholder="请选择" size="mini">
                        <el-option
                          v-for="(item,i) in cpuFP.tjs"
                          :key="i"
                          :value="item">
                        </el-option>
                      </el-select>
                      <el-select v-model="cpuFP.gl" placeholder="请选择" size="mini" class="glw">
                        <el-option
                          v-for="(item,i) in cpuFP.gls"
                          :key="i"
                          :value="item">
                        </el-option>
                      </el-select>
                      <el-input v-model="cpuFP.number" size="mini" class="w100"></el-input>
                      <span class="numberEnd">{{cpuFP.numberEnd}}</span>
                      <el-select v-model="cpuFP.zq" placeholder="请选择" size="mini" class="gz" style="padding-left:20px;">
                        <el-option
                          v-for="(item  ,i) in cpuFP.zqs"
                          :key="i"
                          :value="item">
                        </el-option>
                      </el-select>
                    </div>
                  </div>
                  <div class="flex p3">
                    <!-- 内容 -->
                    <div class="flex" style="flex:1;padding-top:5px;">
                      <input class="el-checkbox" type="checkbox" v-model="ncFP.check">
                      <span>内存分配率</span>
                    </div>
                    <div>
                      <el-select v-model="ncFP.tj" placeholder="请选择" size="mini">
                        <el-option
                          v-for="(item,i) in ncFP.tjs"
                          :key="i"
                          :value="item">
                        </el-option>
                      </el-select>
                      <el-select v-model="ncFP.gl" placeholder="请选择" size="mini" class="glw">
                        <el-option
                          v-for="(item,i) in ncFP.gls"
                          :key="i"
                          :value="item">
                        </el-option>
                      </el-select>
                      <el-input v-model="ncFP.number" size="mini" class="w100"></el-input>
                      <span class="numberEnd">{{ncFP.numberEnd}}</span>
                      <el-select v-model="ncFP.zq" placeholder="请选择" size="mini" class="gz" style="padding-left:20px;">
                        <el-option
                          v-for="(item,i) in ncFP.zqs"
                          :key="i"
                          :value="item">
                        </el-option>
                      </el-select>
                    </div>
                  </div>
                </div>
              </el-form-item>
              <el-form-item label="接收组">
                <div class="flex">
                  <div>可用用户组</div>
                  <div style="margin-left:225px;">已选择用户组</div>
                </div>
                <el-transfer
                  filterable
                  :filter-method="filterMethod"
                  filter-placeholder="请输入用户组名称"
                  v-model="genDataValue"
                  :data="data">
                </el-transfer>
                <div>若无合适的用户组，请<a href="">新建用户组</a><i class="el-icon-edit-outline"></i></div>
              </el-form-item>
              <el-form-item label="告警渠道" style="margin-top:0;">
                <div style="line-height:0;padding:5px;" class="flex">
                  <input class="el-checkbox" type="checkbox" v-model="tellWarning.SMS">
                  <div style="margin-top:9px;">短信</div>
                </div>
                <div style="line-height:0;padding:5px;" class="flex">
                  <input class="el-checkbox" type="checkbox" v-model="tellWarning.email">
                  <div style="margin-top:9px;">邮箱</div>
                </div>
                <div style="line-height:0;padding:5px;" class="flex">
                  <input class="el-checkbox" type="checkbox" v-model="tellWarning.wechar">
                  <div style="margin-top:9px;">微信<span><i class="el-icon-warning-info"></i>（关注<a href="">腾讯云公众号</a>后才能接受告警通知）</span></div>
                </div>
                <div style="line-height:0;padding:5px;" class="flex">
                  <input class="el-checkbox" type="checkbox" v-model="tellWarning.phone">
                  <div style="margin-top:9px;">电话</div>
                </div>
              </el-form-item>
            </div>
            <!-- 节点显示内容 -->
            <div v-if="value=='jd'">
              <el-form-item label="告警对象">
                <div class="form-form flex">
                  <input class="el-checkbox" type="radio" value='true' v-model="TWA">
                  <div>全部选择（包括后续新增加节点）</div>
                </div>
              </el-form-item>
              <el-form-item label="指标">
                <div class="form-form">
                  <div class="flex p3">
                    <!-- 内容 -->
                    <div class="flex" style="flex:1;padding-top:5px;">
                      <input class="el-checkbox" type="checkbox" v-model="cpuLY.nodeCheck">
                      <span>CPU利用率</span>
                    </div>
                    <div>
                      <el-select v-model="cpuLY.tj" placeholder="请选择" size="mini">
                        <el-option
                          v-for="(item,i) in cpuLY.tjs"
                          :key="i"
                          :value="item">
                        </el-option>
                      </el-select>
                      <el-select v-model="cpuLY.gl" placeholder="请选择" size="mini" class="glw">
                        <el-option
                          v-for="(item,i) in cpuLY.gls"
                          :key="i"
                          :value="item">
                        </el-option>
                      </el-select>
                      <el-input v-model="cpuLY.number" size="mini" class="w100"></el-input>
                      <span class="numberEnd">{{cpuLY.numberEnd}}</span>
                      <el-select v-model="cpuLY.zq" placeholder="请选择" size="mini" class="gz" style="padding-left:20px;">
                        <el-option
                          v-for="(item,i) in cpuLY.zqs"
                          :key="i"
                          :value="item">
                        </el-option>
                      </el-select>
                    </div>
                  </div>
                  <div class="flex p3">
                    <!-- 内容 -->
                    <div class="flex" style="flex:1;padding-top:5px;">
                      <input class="el-checkbox" type="checkbox"
                      v-model="ncLY.nodeCheck">
                      <span>内存利用率</span>
                    </div>
                    <div>
                      <el-select v-model="ncLY.tj" placeholder="请选择" size="mini">
                        <el-option
                          v-for="(item,i) in ncLY.tjs"
                          :key="i"
                          :value="item">
                        </el-option>
                      </el-select>
                      <el-select v-model="ncLY.gl" placeholder="请选择" size="mini" class="glw">
                        <el-option
                          v-for="(item,i) in ncLY.gls"
                          :key="i"
                          :value="item">
                        </el-option>
                      </el-select>
                      <el-input v-model="ncLY.number" size="mini" class="w100"></el-input>
                      <span class="numberEnd">{{ncLY.numberEnd}}</span>
                      <el-select v-model="ncLY.zq" placeholder="请选择" size="mini" class="gz" style="padding-left:20px;">
                        <el-option
                          v-for="(item,i) in ncLY.zqs"
                          :key="i"
                          :value="item">
                        </el-option>
                      </el-select>
                    </div>
                  </div>
                  <div class="flex p3">
                    <!-- 内容 -->
                    <div class="flex" style="flex:1;padding-top:5px;">
                      <input class="el-checkbox" type="checkbox" v-model="nodeSet.check">
                      <span>节点上Pod重启次数</span>
                    </div>
                    <div>
                      <el-select v-model="nodeSet.tj" placeholder="请选择" size="mini">
                        <el-option
                          v-for="(item,i) in nodeSet.tjs"
                          :key="i"
                          :value="item">
                        </el-option>
                      </el-select>
                      <el-select v-model="nodeSet.gl" placeholder="请选择" size="mini" class="glw">
                        <el-option
                          v-for="(item,i) in nodeSet.gls"
                          :key="i"
                          :value="item">
                        </el-option>
                      </el-select>
                      <el-input v-model="nodeSet.number" size="mini" class="w100"></el-input>
                      <span class="numberEnd">{{nodeSet.numberEnd}}</span>
                      <el-select v-model="nodeSet.zq" placeholder="请选择" size="mini" class="gz" style="padding-left:20px;">
                        <el-option
                          v-for="(item  ,i) in nodeSet.zqs"
                          :key="i"
                          :value="item">
                        </el-option>
                      </el-select>
                    </div>
                  </div>
                  <div class="flex p3">
                    <!-- 内容 -->
                    <div class="flex" style="flex:1;padding-top:5px;">
                      <input class="el-checkbox" type="checkbox" v-model="NodeReady.check">
                      <span>Node Ready</span>
                    </div>
                    <div>
                      <el-select v-model="NodeReady.tj" placeholder="请选择" size="mini">
                        <el-option
                          v-for="(item,i) in NodeReady.tjs"
                          :key="i"
                          :value="item">
                        </el-option>
                      </el-select>
                      <el-select v-model="NodeReady.gl" placeholder="请选择" size="mini" class="glw" disabled>
                        <el-option
                          v-for="(item,i) in NodeReady.gls"
                          :key="i"
                          :value="item">
                        </el-option>
                      </el-select>
                      <el-select v-model="NodeReady.number" placeholder="请选择" size="mini" class="glw w100" style="padding:0;">
                        <el-option
                          v-for="(item,i) in NodeReady.numbers"
                          :key="i"
                          :value="item">
                        </el-option>
                      </el-select>
                      <!-- <el-input v-model="NodeReady.number" size="mini" class="w100"></el-input> -->
                      <div style="display:inline-block;width:28px;"></div>
                      <!-- <span class="numberEnd">{{ncFP.numberEnd}}</span> -->
                      <el-select v-model="NodeReady.zq" placeholder="请选择" size="mini" class="gz" style="padding-left:20px;">
                        <el-option
                          v-for="(item,i) in NodeReady.zqs"
                          :key="i"
                          :value="item">
                        </el-option>
                      </el-select>
                    </div>
                  </div>
                </div>
              </el-form-item>
              <el-form-item label="接收组">
                <div class="flex">
                  <div>可用用户组</div>
                  <div style="margin-left:225px;">已选择用户组</div>
                </div>
                <el-transfer
                  filterable
                  :filter-method="filterMethod"
                  filter-placeholder="请输入用户组名称"
                  v-model="genDataValue"
                  :data="data">
                </el-transfer>
                <div>若无合适的用户组，请<a href="">新建用户组</a><i class="el-icon-edit-outline"></i></div>
              </el-form-item>
              <el-form-item label="告警渠道" style="margin-top:0;">
                <div style="line-height:0;padding:5px;" class="flex">
                  <input class="el-checkbox" type="checkbox" v-model="tellWarning.SMS">
                  <div style="margin-top:9px;">短信</div>
                </div>
                <div style="line-height:0;padding:5px;" class="flex">
                  <input class="el-checkbox" type="checkbox" v-model="tellWarning.email">
                  <div style="margin-top:9px;">邮箱</div>
                </div>
                <div style="line-height:0;padding:5px;" class="flex">
                  <input class="el-checkbox" type="checkbox" v-model="tellWarning.wechar">
                  <div style="margin-top:9px;">微信<span><i class="el-icon-warning-info"></i>（关注<a href="">腾讯云公众号</a>后才能接受告警通知）</span></div>
                </div>
                <div style="line-height:0;padding:5px;" class="flex">
                  <input class="el-checkbox" type="checkbox" v-model="tellWarning.phone">
                  <div style="margin-top:9px;">电话</div>
                </div>
              </el-form-item>
            </div>
            <!-- pod显示内容 -->
            <div v-if="value=='pod'">
              <el-form-item label="告警对象">
                <div class="form-form" style="max-width:400px;">
                  <div class="flex">
                    <input class="el-checkbox" type="radio" value='true' v-model="TWA">
                    <div>按工作负载选择（包括后续新增加Pod）</div>
                  </div>
                  <div class="flex" style="padding:10px 0 5px 0;">
                    <div>Namespace</div>
                    <el-select style="padding-left:30px;" v-model="Namespace.content" placeholder="请选择" size="mini">
                      <el-option
                        v-for="(item,i) in Namespace.contents"
                        :key="i"
                        :value="item">
                      </el-option>
                    </el-select>
                  </div>
                  <div class="flex" style="padding:10px 0 5px 0;">
                    <div>WorkloadType</div>
                    <el-select style="padding-left:13px;" v-model="WorkloadType.content" placeholder="请选择" size="mini">
                      <el-option
                        v-for="(item,i) in WorkloadType.contents"
                        :key="i"
                        :value="item">
                      </el-option>
                    </el-select>
                  </div>
                  <div class="workload">该命名空间下无workload</div>
                </div>
                <div class="form-form flex" style="margin-top:5px;max-width:400px;">
                  <input class="el-checkbox" type="radio" value='false' v-model="TWA">
                  <div>全部选择（包括后续新增加Pod）</div>
                </div>
              </el-form-item>
             <el-form-item label="指标">
                <div class="form-form">
                  <div class="flex p3">
                    <!-- 内容 -->
                    <div class="flex" style="flex:1;padding-top:5px;">
                      <input class="el-checkbox" type="checkbox" v-model="cpuLY.nodeCheck">
                      <span>CPU利用率（占Request）</span>
                    </div>
                    <div>
                      <el-select v-model="cpuLY.tj" placeholder="请选择" size="mini">
                        <el-option
                          v-for="(item,i) in cpuLY.tjs"
                          :key="i"
                          :value="item">
                        </el-option>
                      </el-select>
                      <el-select v-model="cpuLY.gl" placeholder="请选择" size="mini" class="glw">
                        <el-option
                          v-for="(item,i) in cpuLY.gls"
                          :key="i"
                          :value="item">
                        </el-option>
                      </el-select>
                      <el-input v-model="cpuLY.number" size="mini" class="w100"></el-input>
                      <span class="numberEnd">{{cpuLY.numberEnd}}</span>
                      <el-select v-model="cpuLY.zq" placeholder="请选择" size="mini" class="gz" style="padding-left:20px;">
                        <el-option
                          v-for="(item,i) in cpuLY.zqs"
                          :key="i"
                          :value="item">
                        </el-option>
                      </el-select>
                    </div>
                  </div>
                  <div class="flex p3">
                    <!-- 内容 -->
                    <div class="flex" style="flex:1;padding-top:5px;">
                      <input class="el-checkbox" type="checkbox"
                      v-model="ncLY.nodeCheck">
                      <span>内存利用率（占Request）</span>
                    </div>
                    <div>
                      <el-select v-model="ncLY.tj" placeholder="请选择" size="mini">
                        <el-option
                          v-for="(item,i) in ncLY.tjs"
                          :key="i"
                          :value="item">
                        </el-option>
                      </el-select>
                      <el-select v-model="ncLY.gl" placeholder="请选择" size="mini" class="glw">
                        <el-option
                          v-for="(item,i) in ncLY.gls"
                          :key="i"
                          :value="item">
                        </el-option>
                      </el-select>
                      <el-input v-model="ncLY.number" size="mini" class="w100"></el-input>
                      <span class="numberEnd">{{ncLY.numberEnd}}</span>
                      <el-select v-model="ncLY.zq" placeholder="请选择" size="mini" class="gz" style="padding-left:20px;">
                        <el-option
                          v-for="(item,i) in ncLY.zqs"
                          :key="i"
                          :value="item">
                        </el-option>
                      </el-select>
                    </div>
                  </div>
                  <div class="flex p3">
                    <!-- 内容 -->
                    <div class="flex" style="flex:1;padding-top:5px;">
                      <input class="el-checkbox" type="checkbox"
                      v-model="ncLY.nodeCheck">
                      <span>实际内存利用率（占Request）</span>
                    </div>
                    <div>
                      <el-select v-model="ncLY.tj" placeholder="请选择" size="mini">
                        <el-option
                          v-for="(item,i) in ncLY.tjs"
                          :key="i"
                          :value="item">
                        </el-option>
                      </el-select>
                      <el-select v-model="ncLY.gl" placeholder="请选择" size="mini" class="glw">
                        <el-option
                          v-for="(item,i) in ncLY.gls"
                          :key="i"
                          :value="item">
                        </el-option>
                      </el-select>
                      <el-input v-model="ncLY.number" size="mini" class="w100"></el-input>
                      <span class="numberEnd">{{ncLY.numberEnd}}</span>
                      <el-select v-model="ncLY.zq" placeholder="请选择" size="mini" class="gz" style="padding-left:20px;">
                        <el-option
                          v-for="(item,i) in ncLY.zqs"
                          :key="i"
                          :value="item">
                        </el-option>
                      </el-select>
                    </div>
                  </div>
                  <div class="flex p3">
                    <!-- 内容 -->
                    <div class="flex" style="flex:1;padding-top:5px;">
                      <input class="el-checkbox" type="checkbox"
                      v-model="ncLY.nodeCheck">
                      <span>CPU利用率（占节点）</span>
                    </div>
                    <div>
                      <el-select v-model="ncLY.tj" placeholder="请选择" size="mini">
                        <el-option
                          v-for="(item,i) in ncLY.tjs"
                          :key="i"
                          :value="item">
                        </el-option>
                      </el-select>
                      <el-select v-model="ncLY.gl" placeholder="请选择" size="mini" class="glw">
                        <el-option
                          v-for="(item,i) in ncLY.gls"
                          :key="i"
                          :value="item">
                        </el-option>
                      </el-select>
                      <el-input v-model="ncLY.number" size="mini" class="w100"></el-input>
                      <span class="numberEnd">{{ncLY.numberEnd}}</span>
                      <el-select v-model="ncLY.zq" placeholder="请选择" size="mini" class="gz" style="padding-left:20px;">
                        <el-option
                          v-for="(item,i) in ncLY.zqs"
                          :key="i"
                          :value="item">
                        </el-option>
                      </el-select>
                    </div>
                  </div>
                  <div class="flex p3">
                    <!-- 内容 -->
                    <div class="flex" style="flex:1;padding-top:5px;">
                      <input class="el-checkbox" type="checkbox"
                      v-model="ncLY.nodeCheck">
                      <span>内存利用率（占节点）</span>
                    </div>
                    <div>
                      <el-select v-model="ncLY.tj" placeholder="请选择" size="mini">
                        <el-option
                          v-for="(item,i) in ncLY.tjs"
                          :key="i"
                          :value="item">
                        </el-option>
                      </el-select>
                      <el-select v-model="ncLY.gl" placeholder="请选择" size="mini" class="glw">
                        <el-option
                          v-for="(item,i) in ncLY.gls"
                          :key="i"
                          :value="item">
                        </el-option>
                      </el-select>
                      <el-input v-model="ncLY.number" size="mini" class="w100"></el-input>
                      <span class="numberEnd">{{ncLY.numberEnd}}</span>
                      <el-select v-model="ncLY.zq" placeholder="请选择" size="mini" class="gz" style="padding-left:20px;">
                        <el-option
                          v-for="(item,i) in ncLY.zqs"
                          :key="i"
                          :value="item">
                        </el-option>
                      </el-select>
                    </div>
                  </div>
                  <div class="flex p3">
                    <!-- 内容 -->
                    <div class="flex" style="flex:1;padding-top:5px;">
                      <input class="el-checkbox" type="checkbox"
                      v-model="ncLY.nodeCheck">
                      <span>实际内存利用率（占节点）</span>
                    </div>
                    <div>
                      <el-select v-model="ncLY.tj" placeholder="请选择" size="mini">
                        <el-option
                          v-for="(item,i) in ncLY.tjs"
                          :key="i"
                          :value="item">
                        </el-option>
                      </el-select>
                      <el-select v-model="ncLY.gl" placeholder="请选择" size="mini" class="glw">
                        <el-option
                          v-for="(item,i) in ncLY.gls"
                          :key="i"
                          :value="item">
                        </el-option>
                      </el-select>
                      <el-input v-model="ncLY.number" size="mini" class="w100"></el-input>
                      <span class="numberEnd">{{ncLY.numberEnd}}</span>
                      <el-select v-model="ncLY.zq" placeholder="请选择" size="mini" class="gz" style="padding-left:20px;">
                        <el-option
                          v-for="(item,i) in ncLY.zqs"
                          :key="i"
                          :value="item">
                        </el-option>
                      </el-select>
                    </div>
                  </div>
                  <div class="flex p3">
                    <!-- 内容 -->
                    <div class="flex" style="flex:1;padding-top:5px;">
                      <input class="el-checkbox" type="checkbox"
                      v-model="ncLY.nodeCheck">
                      <span>内存利用率（占节点）</span>
                    </div>
                    <div>
                      <el-select v-model="ncLY.tj" placeholder="请选择" size="mini">
                        <el-option
                          v-for="(item,i) in ncLY.tjs"
                          :key="i"
                          :value="item">
                        </el-option>
                      </el-select>
                      <el-select v-model="ncLY.gl" placeholder="请选择" size="mini" class="glw">
                        <el-option
                          v-for="(item,i) in ncLY.gls"
                          :key="i"
                          :value="item">
                        </el-option>
                      </el-select>
                      <el-input v-model="ncLY.number" size="mini" class="w100"></el-input>
                      <span class="numberEnd">{{ncLY.numberEnd}}</span>
                      <el-select v-model="ncLY.zq" placeholder="请选择" size="mini" class="gz" style="padding-left:20px;">
                        <el-option
                          v-for="(item,i) in ncLY.zqs"
                          :key="i"
                          :value="item">
                        </el-option>
                      </el-select>
                    </div>
                  </div>
                  <div class="flex p3">
                    <!-- 内容 -->
                    <div class="flex" style="flex:1;padding-top:5px;">
                      <input class="el-checkbox" type="checkbox" v-model="nodeSet.check">
                      <span>节点上Pod重启次数</span>
                    </div>
                    <div>
                      <el-select v-model="nodeSet.tj" placeholder="请选择" size="mini">
                        <el-option
                          v-for="(item,i) in nodeSet.tjs"
                          :key="i"
                          :value="item">
                        </el-option>
                      </el-select>
                      <el-select v-model="nodeSet.gl" placeholder="请选择" size="mini" class="glw">
                        <el-option
                          v-for="(item,i) in nodeSet.gls"
                          :key="i"
                          :value="item">
                        </el-option>
                      </el-select>
                      <el-input v-model="nodeSet.number" size="mini" class="w100"></el-input>
                      <span class="numberEnd">{{nodeSet.numberEnd}}</span>
                      <el-select v-model="nodeSet.zq" placeholder="请选择" size="mini" class="gz" style="padding-left:20px;">
                        <el-option
                          v-for="(item  ,i) in nodeSet.zqs"
                          :key="i"
                          :value="item">
                        </el-option>
                      </el-select>
                    </div>
                  </div>
                  <div class="flex p3">
                    <!-- 内容 -->
                    <div class="flex" style="flex:1;padding-top:5px;">
                      <input class="el-checkbox" type="checkbox" v-model="NodeReady.check">
                      <span>Node Ready</span>
                    </div>
                    <div>
                      <el-select v-model="NodeReady.tj" placeholder="请选择" size="mini">
                        <el-option
                          v-for="(item,i) in NodeReady.tjs"
                          :key="i"
                          :value="item">
                        </el-option>
                      </el-select>
                      <el-select v-model="NodeReady.gl" placeholder="请选择" size="mini" class="glw" disabled>
                        <el-option
                          v-for="(item,i) in NodeReady.gls"
                          :key="i"
                          :value="item">
                        </el-option>
                      </el-select>
                      <el-select v-model="NodeReady.number" placeholder="请选择" size="mini" class="glw w100" style="padding:0;">
                        <el-option
                          v-for="(item,i) in NodeReady.numbers"
                          :key="i"
                          :value="item">
                        </el-option>
                      </el-select>
                      <!-- <el-input v-model="NodeReady.number" size="mini" class="w100"></el-input> -->
                      <div style="display:inline-block;width:28px;"></div>
                      <!-- <span class="numberEnd">{{ncFP.numberEnd}}</span> -->
                      <el-select v-model="NodeReady.zq" placeholder="请选择" size="mini" class="gz" style="padding-left:20px;">
                        <el-option
                          v-for="(item,i) in NodeReady.zqs"
                          :key="i"
                          :value="item">
                        </el-option>
                      </el-select>
                    </div>
                  </div>
                </div>
              </el-form-item>
            </div>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">立即创建</el-button>
              <el-button>取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
</template>
<script>
import HeadCom from "@/components/public/Head";
export default {
  data(){
    const generateData = _ => {
      const data = [];
      const cities = ['测试误删', '误删', 'ac', '可以删除', 'dfa', 'aaaaaaaaaaaaa', 'ddddddddd'];
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
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
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
      NodeReady: {
        check: true,
        tj: '统计周期1分钟',
        tjs: ['统计周期1分钟','统计周期2分钟','统计周期3分钟','统计周期4分钟','统计周期5分钟'],
        gl: '=',
        gls: ['>','<','='],
        number: 'False',
        numbers: ['true','False'],
        zq: '持续5个周期',
        zqs: ['持续1个周期','持续2个周期','持续3个周期','持续4个周期','持续5个周期']
      },
      nodeSet: {
        check: true,
        tj: '统计周期1分钟',
        tjs: ['统计周期1分钟','统计周期2分钟','统计周期3分钟','统计周期4分钟','统计周期5分钟'],
        gl: '>',
        gls: ['>','<'],
        number: '1',
        numberEnd: '次',
        zq: '持续5个周期',
        zqs: ['持续1个周期','持续2个周期','持续3个周期','持续4个周期','持续5个周期']
      },
      cpuLY: {
        nodeCheck: true,
        check: true,
        tj: '统计周期1分钟',
        tjs: ['统计周期1分钟','统计周期2分钟','统计周期3分钟','统计周期4分钟','统计周期5分钟'],
        gl: '>',
        gls: ['>','<'],
        number: '90',
        numberEnd: '%',
        zq: '持续5个周期',
        zqs: ['持续1个周期','持续2个周期','持续3个周期','持续4个周期','持续5个周期']
      },
      ncLY: {
        nodeCheck: true,
        check: true,
        tj: '统计周期1分钟',
        tjs: ['统计周期1分钟','统计周期2分钟','统计周期3分钟','统计周期4分钟','统计周期5分钟'],
        gl: '>',
        gls: ['>','<'],
        number: '90',
        numberEnd: '%',
        zq: '持续5个周期',
        zqs: ['持续1个周期','持续2个周期','持续3个周期','持续4个周期','持续5个周期']
      },
      cpuFP: {
        check: true,
        tj: '统计周期1分钟',
        tjs: ['统计周期1分钟','统计周期2分钟','统计周期3分钟','统计周期4分钟','统计周期5分钟'],
        gl: '>',
        gls: ['>','<'],
        number: '95',
        numberEnd: '%',
        zq: '持续5个周期',
        zqs: ['持续1个周期','持续2个周期','持续3个周期','持续4个周期','持续5个周期']
      },
      ncFP: {
        check: true,
        tj: '统计周期1分钟',
        tjs: ['统计周期1分钟','统计周期2分钟','统计周期3分钟','统计周期4分钟','统计周期5分钟'],
        gl: '>',
        gls: ['>','<'],
        number: '95',
        numberEnd: '%',
        zq: '持续5个周期',
        zqs: ['持续1个周期','持续2个周期','持续3个周期','持续4个周期','持续5个周期']
      },
      tellWarning: {
        SMS: false,
        email: false,
        wechar: false,
        phone: false
      }
    }
  },
  watch: {
    value() {
      console.log(this.value)
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
  width: 840px;
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
  padding-top: 20px;
  max-width: 1360px;
  margin:0 auto;
}
.tf-g {
  font-size: 0;
  margin-bottom: 50px;
  // background: pink;
}
.event-persistence {
  padding: 20px;
  background: white;
  box-shadow: 0 1px 3px 0 rgba(0,0,0,.1);
}
</style>
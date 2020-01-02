<template>
  <div class="overview-wrap">
    <HeadCom title="概览"></HeadCom>
    <div class="app-tke-fe-content__inner">
      <div class="tf-g">
        <el-row>
          <!-- 左边内容 -->
          <el-col :span="16">
            <!-- 第一行内容 -->
            <div class="resource-overview">
              <h3 class="font" style="margin-bottom:20px">资源概览</h3>
              <ul class="ro-data-card">
                <li class="ro-data-card-list">
                  <div class="font data-card-border-right" >
                    <h3 class="ro-data-card-hd font">集群</h3>
                    <div>
                      <span class="font-big">2</span>
                      <span class="ro-data-card-value">个</span>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="font data-card-border-right data-card-list">
                    <h3 class="ro-data-card-hd font">节点</h3>
                    <div>
                      <span class="font-big">1</span>
                      <span>个</span>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="font data-card-border-right data-card-list">
                    <h5 class="ro-data-card-hd font">工作负载</h5>
                    <div>
                      <span class="font-big">10</span>
                      <span>个（</span>
                      <span class="font-red">异常3个</span>
                      <el-tooltip content="Pod副本数不符合预期" placement="top">
                        <i style="margin-left:5px" class="data-card-icon el-icon-info"></i>
                      </el-tooltip>
                      <span>）</span>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <!-- 第二行内容 -->
            <div class="resource-overview" style="margin-top:20px">
              <h3 class="font" style="margin:6px 0 6px 0;">集群健康</h3>
            </div>
            <!-- 集群卡片内容 -->
            <div @click="show()" class="resource-overview twoRow-data-card-border-top">
              <h3 class="font" style="margin:0;">
                <i v-if="isShow" class="el-icon-caret-bottom data-card-icon" style="margin-right:5px"></i>
                <i v-else class="el-icon-caret-right data-card-icon" style="margin-right:5px"></i>中国台北
                <span class="font-small" >共&nbsp;1&nbsp;个集群</span>
                <i class="data-card-icon el-icon-info font-red" style="margin-left:2px"></i>
              </h3>
              <div v-if="isShow" class="resource-overview data-card-border" style="box-shadow:none;">
                <div>
                  <!-- 第二行集群头 -->
                  <div class="font-small">
                    <a href="javascrpit:;">cls-od5hfc6w</a>
                    <span style="margin-left:6px">集群测试</span>
                  </div>
                  <!-- 第二行集群内容 -->
                  <div class="ro-data-card" style="margin:0">
                    <div class="twoROW-data-card-list">
                      <div>
                        <span style="font-size:18px;">0.04</span>
                        <span class="font-small" style="color:black;">%&nbsp;CPU利用率</span>
                      </div>
                      <div class="font-small" style="margin-top:10px;">总数：7.91核&nbsp;Request已分配：1.26%</div>
                    </div>
                    <div class="twoROW-data-card-list">
                      <div>
                        <span style="font-size:18px;">0.43</span>
                        <span class="font-small" style="color:black;">%&nbsp;内存利用率</span>
                      </div>
                      <div class="font-small" style="margin-top:10px;">总数：29.37GB&nbsp;Request已分配：0.1%</div>
                    </div>
                    <div class="twoROW-data-card-list font-small" style="background:none;padding:0">
                      <div style="padding-top:0;">
                        <span>节点</span>
                        <a href="">（1个）</a>
                        <span style="margin-left:72px" class="font-green">正常</span>
                      </div>
                      <div style="padding-top:17px;">
                        <span>Master&Etcd</span>
                        <a href="">（0个）</a>
                        <span style="margin-left:20px" class="font-green">正常</span>
                      </div>
                      <div style="padding-top:17px;">
                        <span>工作负载</span>
                        <a href="">（5个）</a>
                        <span style="margin-left:47px" class="font-red">异常&nbsp;1&nbsp;个</span>
                        <el-tooltip placement="right" effect="light">
                          <div slot="content" style="width:200px;height:200px">
                            <div class="font-small">
                              <span>命名空间</span>
                              <div class="hsd"></div>
                              <span>Deployment</span>
                            </div>
                            <div class="font-small" style="margin-top:10px">
                              <span>kube-system</span>
                              <a style="margin-left:55px;" href="">coredns</a>
                              <br>
                              <a style="margin-left:130px" href="">查看事件</a>
                            </div>
                          </div>
                          <i style="margin-left:25px" class="el-icon-more-outline"></i>
                        </el-tooltip>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- 左边底部内容 -->
            <div class="resource-overview twoRow-data-card-border-top" style="margin-top:20px;">
              <h3 class="font" style="margin:0;">使用指引</h3>
              <div class='zn'>
                <div class="data-card-img">
                  <img src="https://imgcache.qq.com/open_proj/proj_qcloud_v2/mc_2014/docker/css/img/overview-zhiying.svg" alt="">
                </div>
                <div class="data-card-img">
                  <div class="font-small" style="color:black">使用指引</div>
                  <div class="font-small">通过固定流程，快速创建容器服务
                    <a href="">开始使用</a>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
          <!-- 右边内容 -->
          <el-col :span="8">
            <div class="resource-overview" style="margin-left:20px">
              <div class="zn" style="justify-content: space-between;">
                <h3 class="font" style="margin-bottom:20px;font-size:14px">帮助文档</h3>
                <label class="font-small">
                  <a href="">更多</a>
                  <i class="el-icon-edit-outline"></i>
                </label>
              </div>
              <ul class="font-small">
                <li class="help-list">
                  <a class="font-black" href="">容器服务如何使用</a>
                </li>
                <li class="help-list">
                  <a class="font-black" href="">容器服务提供了哪些功能</a>
                </li>
                <li class="help-list">
                  <a class="font-black" href="">容器服务如何计费</a>
                </li>
                <li class="help-list">
                  <a class="font-black" href="">如何构建docker镜像</a>
                </li>
                <li class="help-list">
                  <a class="font-black" href="">如何登陆到容器</a>
                </li>
              </ul>
            </div>
            <div class="resource-overview" style="margin:20px 0 0 20px;">
              <div class="zn" style="justify-content: space-between;">
                <h3 class="font" style="margin-bottom:20px;font-size:14px">最近更新</h3>
                <label class="font-small">
                  <a href="">更多</a>
                  <i class="el-icon-edit-outline"></i>
                </label>
              </div>
              <ul class="font-small">
                <li class="help-list">
                  <div class="zn" style="justify-content: space-between;">
                    <a class="font-black" href="">TKE支持自定义节点&nbsp;Hostname（内测）</a>
                    <div>
                      2019-11-15
                    </div>
                  </div>
                </li>
                <li class="help-list">
                 <div class="zn" style="justify-content: space-between;">
                    <a class="font-black" href="">TKE支持自定义节点&nbsp;Hostname（内测）</a>
                    <div>
                      2019-11-15
                    </div>
                  </div>
                </li>
                <li class="help-list">
                  <div class="zn" style="justify-content: space-between;">
                    <a class="font-black" href="">TKE支持自定义节点&nbsp;Hostname（内测）</a>
                    <div>
                      2019-11-15
                    </div>
                  </div>
                </li>
                <li class="help-list">
                  <div class="zn" style="justify-content: space-between;">
                    <a class="font-black" href="">TKE支持自定义节点&nbsp;Hostname（内测）</a>
                    <div>
                      2019-11-15
                    </div>
                  </div>
                </li>
                <li class="help-list">
                  <div class="zn" style="justify-content: space-between;">
                    <a class="font-black" href="">TKE支持自定义节点&nbsp;Hostname（内测）</a>
                    <div>
                      2019-11-15
                    </div>
                  </div>
                </li>
              </ul>
            </div>
             <div class="resource-overview" style="margin:20px 0 0 20px;">
              <div class="zn" style="justify-content: space-between;">
                <h3 class="font" style="margin-bottom:20px;font-size:14px">配置限额</h3>
                <label class="font-small">
                  <a href="">申请配额</a>
                  <i class="el-icon-edit-outline"></i>
                </label>
              </div>
              <ul class="font-small">
                <li>
                  <div class="zn">
                    <div style="margin:0 40px 20px 0;">命名空间</div>
                    <div class="font-black">10个</div>
                  </div>
                </li>
                <li>
                  <div class="zn">
                    <div style="margin:0 65px 20px 0;">集群</div>
                    <div class="font-black">5个/地域</div>
                  </div>
                </li>
                <li>
                  <div  class="zn">
                    <div style="margin:0 65px 20px 0;">节点</div>
                    <div class="font-black">5000个/集群</div>
                  </div>
                </li>
                <li>
                  <div  class="zn">
                    <div style="margin:0 65px 20px 0;">镜像</div>
                    <div class="font-black">500个/地域</div>
                  </div>
                </li>
                <li>
                  <div  class="zn">
                    <div style="margin:0 40px 20px 0;">镜像版本</div>
                    <div @click="show()" class="font-black">100个/镜像</div>
                  </div>
                </li>
              </ul>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import HeadCom from "@/components/public/Head";
export default {
  name: "overview",
  data() {
    return {
      isShow:false
    };
  },
  components: {
    HeadCom
  },
  methods: {
    show() {
      this.isShow=!this.isShow
    }
  }
};
</script>

<style lang="scss" scoped>
.font-black {
  color: black !important;
}
.help-list {
  margin:20px 0 20px 0;
}
.zn{
  display: flex;
}
.data-card-img {
  padding:20px;
}
.hsd {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background:#f2f2f2;
  display: inline-block;
  margin:0 30px 0 30px;
}
a:hover {
  text-decoration: underline;
}
.twoROW-data-card-list {
  width: 272px;
  height: 78px;
  background:#f2f2f2;
  margin:20px 14px 0 0;
  padding: 16px 12px;
}
.data-card-border {
  margin-top: 20px;
  border: 1px solid #dddddd;
}
.twoRow-data-card-border-top {
  border-top: 1px solid #dddddd;
}
.data-card-icon {
  font-size: 10px;
}
.data-card-list {
  margin-left: 20px;
}
.data-card-border-right {
  border-right: 1px solid #dddddd;
}
.ro-data-card li:last-child.data-card-border-right {
  border-right: none;
}
.font-small {
  font-size: 12px;
  color: #888888;
  font-weight: lighter;
}
.font-big {
  font-size: 36px;
}
.font-green {
  color:#0abf5b;
}
.font-red {
  color: #e54545;
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
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.resource-overview {
  padding: 20px;
  background: white;
  box-shadow: 0 1px 3px 0 rgba(0,0,0,.1);
}
.font {
  font-size: 15px;
  margin-bottom: 20px;
}
.ro-data-card {
  display: flex;
  margin: -10px 0;
}
.ro-data-card-hd {
  margin: 10px 0;
  width: 282px;
}
.show {
  display: block;
}
.hide {
  display: none;
}
</style>
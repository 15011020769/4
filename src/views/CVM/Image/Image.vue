<template>
  <div class="Image">
    <div class="image-Box">
      <div class="image-title">
        <h2>镜像</h2>
        <div class="image-region">
          <City :parm="parm" v-on:changeCity="changeCity"></City>
        </div>
      </div>
      <div class="image-tab">
        <el-tabs v-model="activeName">
          <el-tab-pane label="公共镜像" name="first">
            <div class="image-public images">
              <!-- 提示信息 -->
              <div class="tips">
                <p>温馨提示：</p>
                <p>
                  <span>1</span>镜像的底层数据存储使用了云硬盘快照服务，
                  <i>云硬盘快照已于2019年1月22日0点启动正式商业化</i> ，保留自定义镜像会产生一定的快照费用。详细可见
                  <a href="javascript:void(0);">快照商业化FAQ</a>
                </p>
                <div>
                  <p>
                    <span>2</span>您可以根据使用规划来调整使用策略，减少可能的开销：
                  </p>
                  <ul>
                    <li>创建自定义镜像的同时系统默认会创建相关快照，删除此快照之前需要先删除关联的镜像。您可在镜像详情中查看镜像关联的快照信息。</li>
                    <li>共享镜像只收取当前账号的快照费用，被共享镜像的账号不收费。</li>
                    <li>镜像产生的快照按照实际容量收费，您可在快照概览中查看快照总容量。</li>
                  </ul>
                </div>
              </div>
              <div>
                <public-image ref="PublicListData"></public-image>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="自定义镜像" name="second">
            <div class="image-public images">
              <!-- 提示信息 -->
              <div class="tips">
                <p>温馨提示：</p>
                <p>
                  <span>1</span>镜像的底层数据存储使用了云硬盘快照服务，
                  <i>云硬盘快照已于2019年1月22日0点启动正式商业化</i> ，保留自定义镜像会产生一定的快照费用。详细可见
                  <a href="javascript:void(0);">快照商业化FAQ</a>
                </p>
                <div style="margin-bottom:8px;">
                  <p>
                    <span>2</span>您可以根据使用规划来调整使用策略，减少可能的开销：
                  </p>
                  <ul>
                    <li>创建自定义镜像的同时系统默认会创建相关快照，删除此快照之前需要先删除关联的镜像。您可在镜像详情中查看镜像关联的快照信息。</li>
                    <li>共享镜像只收取当前账号的快照费用，被共享镜像的账号不收费。</li>
                    <li>镜像产生的快照按照实际容量收费，您可在快照概览中查看快照总容量。</li>
                  </ul>
                </div>
                <p>
                  <span>3</span>导入镜像目前只支持大小在50G以内的镜像，若您需要导入的镜像大小超过50G，可通过离线迁移的方式导入。详细可见
                  <a
                    href="javascript:;"
                  >服务迁移文档</a>
                </p>
                <p>
                  <span>4</span>若镜像导入失败，请在站内信中查看具体原因。或考虑采用
                  <a href="javascript:;">服务迁移</a>的方式来导入
                </p>
              </div>
              <div>
                <custom-image ref="CustomListData"></custom-image>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import PublicImage from "./publicImagetTable"; // 公共镜像
import CustomImage from "./customImageTable"; // 自定义镜像
import City from "@/components/Tools/RegionBtn"
export default {
  data() {
    return {
      activeName: "second", //tab
      parm: "FWQ" // 城市列表接口参数
    };
  },
  components: {
    PublicImage,
    CustomImage,
    City
  },
  created() {},
  methods: {
    // 城市切换
    changeCity(city) {
      this.$cookie.set("regionv1", city.regionCode);
      this.$cookie.set("regionv2", city.Region);
      this.$refs.PublicListData.getDataList();
      this.$refs.CustomListData.getDataList();
    }
  }
};
</script>

<style lang="scss" scoped>
.Image {
  .image-Box {
    .image-title {
      width: 100%;
      padding: 10px 20px;
      background: #fff;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      & > h2 {
        color: #000;
        margin-right: 20px;
        height: 30px;
        width: 40px;
        line-height: 30px;
      }
      .image-region {
        ::v-deep .btn-group .el-button[data-v-40ccd374] {
          padding: 0px;
          width: 66px;
          height: 27px;
          overflow: hidden;
          margin: 0px;
          margin-left: -1px;
        }
      }
    }
    .image-tab {
      /* 切换 */
      ::v-deep .el-tabs__nav-scroll{
        padding-left: 40px;
      }
      ::v-deep .el-tabs__header {
        margin: 0px;
        background: #fff;
      }
      ::v-deep .el-tabs__nav-wrap::after.el-tabs__nav-wrap::after {
        background-color: #ddd;
        height: 1px;
      }
      ::v-deep .el-button {
        border-radius: 0px;
        width: 90px;
        height: 30px;
        padding: 0px;
        border-color: #ddd;
        font-size: 12px;
      }
      ::v-deep .el-button.is-disabled {
        color: #bbb;
      }
      .images {
        padding: 20px;
        .tips {
          font-size: 12px;
          line-height: inherit;
          padding: 10px 30px 10px 20px;
          vertical-align: middle;
          color: #003b80;
          border: 1px solid #97c7ff;
          margin-bottom: 20px;
          background: #e5f0ff;
          p {
            margin-bottom: 8px;
            & > span {
              margin-right: 10px;
            }
            & > i {
              color: #e54545;
              font-style: normal;
            }
            & > a {
              color: #006eff;
            }
          }
          & > div {
            & > ul {
              list-style: disc;
              margin-left: 30px;
              li {
                margin-bottom: 8px;
                &:nth-last-child(1) {
                  margin-bottom: 0px;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>



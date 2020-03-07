<template>
  <div>
    <div class="basicinfo">
      <h1>基本訊息</h1>
      <div class="newClear">
        <div class="newClear newList">
          <p>CNAME</p>
          <p>{{info.TargetDomain}}</p>
        </div>
        <div class="newClear newList">
          <p>{{$t('CSS.domainManagement.9')}}</p>
          <p>{{info.CreateTime}}</p>
        </div>
        <div class="newClear newList">
          <p>{{$t('CSS.domainManagement.3')}}</p>
          <p>{{info.Type|typeCh}}</p>
        </div>
        <div class="newClear newList">
          <p>API Key</p>
          <p>{{apiKey}}</p>
        </div>
      </div>
      <editTagsModel :isShow="modelEdit" @closeEditTagsModel="closeEditTagsModel" />
    </div>
  </div>
</template>
<script>
import editTagsModel from "../model/editTagsModel";
import { LIVE_DESCRIBELIVE_PUSHAUTHKEY } from "@/constants";
export default {
  props: {
    info: {
      required: false,
      type: Object
    }
  },
  components: {
    editTagsModel: editTagsModel
  },
  filters: {
    typeCh(val) {
      if (val === 0) {
        return "推流域名";
      } else if (val === 1) {
        return "播放域名";
      }
    }
  },
  mounted() {
    this.axios
      .post(LIVE_DESCRIBELIVE_PUSHAUTHKEY, {
        Version: "2018-08-01",
        DomainName: this.$route.query.Name
      })
      .then(({ Response: { PushAuthKeyInfo } }) => {
        this.apiKey = PushAuthKeyInfo.MasterAuthKey;
      });
  },
  data() {
    return {
      modelEdit: false, //编辑弹框
      apiKey: ""
    };
  },
  methods: {
    //编辑标签
    editTags() {
      this.modelEdit = true;
    },
    //关闭弹框
    closeEditTagsModel(isShow) {
      this.modelEdit = isShow;
    }
  }
};
</script>
<style lang="scss" scoped>
.newClear:after {
  display: block;
  content: "";
  clear: both;
}
.basicinfo {
  width: 100%;
  min-height: 100px;
  background-color: #fff;
  border: 1px solid #ddd;
  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
  padding: 20px;
  h1 {
    font-size: 14px;
    font-weight: 600;
    color: #000;
    margin-bottom: 30px;
  }
  .newList {
    margin-bottom: 30px;
    p:nth-child(1) {
      font-size: 12px;
      color: #999;
      float: left;
      width: 70px;
    }
    p:nth-child(2) {
      font-size: 12px;
      color: #000;
      float: left;
      width: calc(100% - 70px);
      .spanTags {
        display: inline-block;
        font-size: 12px;
        background-color: #f2f2f2;
        padding: 1px 4px;
        color: #000;
        margin-right: 4px;
        border: 1px solid #ddd;
      }
    }
  }
}
</style>

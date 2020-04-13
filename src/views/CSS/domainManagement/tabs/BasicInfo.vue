<template>
  <div>
    <div class="basicinfo">
      <h1>{{ $t("CSS.detailPlay.basicMessage") }}</h1>
      <div class="newClear">
        <div class="newClear newList">
          <p>CNAME</p>
          <p>{{ info.TargetDomain }}</p>
        </div>
        <div class="newClear newList">
          <p>{{ $t("CSS.domainManagement.9") }}</p>
          <p>{{ info.CreateTime }}</p>
        </div>
        <div class="newClear newList">
          <p>{{ $t("CSS.domainManagement.3") }}</p>
          <p>{{ info.Type | typeCh }}</p>
        </div>
        <div class="newClear newList" v-if="info.Type === 1 && info.IsDelayLive === 0">
          <p>{{ $t("CSS.detailPlay.playArea") }}</p>
          <p>{{ info.PlayType | playType }}</p>
        </div>
        <div class="newClear newList" v-if="info.IsDelayLive === 0">
          <p>標籤</p>
          <p>
            <span class="tag" v-for="tag in tags" :key="tag.tagKeyMd5">{{tag.tagKey}}:{{tag.tagValue}}</span>
            <i class="el-icon-edit icon" @click="editTags" />
            <i class="el-icon-close icon" v-if="tags.length" @click="removeTags" />
          </p>
        </div>
      </div>
      <el-dialog title="編輯標籤" :visible.sync="modelEdit" width="45%" destroy-on-close>
        <editTagsModel :domains="[{Name: $route.query.Name}]" :visible.sync="modelEdit" @success="onSuccess" />
      </el-dialog>
    </div>
  </div>
</template>
<script>
import editTagsModel from '../model/editTagsModel'
import { LIVE_DESCRIBELIVE_PUSHAUTHKEY } from '@/constants'
import { flatObj } from '@/utils'
import VueCookie from 'vue-cookie'
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
        return '推流域名'
      } else if (val === 1) {
        return '播放域名'
      }
    },
    playType(val) {
      switch (val) {
        case 1:
          return '中國大陸'
        case 2:
          return '全球加速'
        case 3:
          return '中國港澳台地區及海外地區'
      }
    }
  },
  mounted() {
    this.getTags()
    this.axios
      .post(LIVE_DESCRIBELIVE_PUSHAUTHKEY, {
        Version: '2018-08-01',
        DomainName: this.$route.query.Name
      })
      .then(({ Response: { PushAuthKeyInfo } }) => {
        this.apiKey = PushAuthKeyInfo.MasterAuthKey
      })
  },
  data() {
    return {
      modelEdit: false, // 编辑弹框
      apiKey: '',
      tags: [],
    }
  },
  methods: {
    // 编辑标签
    editTags() {
      this.modelEdit = true
    },
    onSuccess() {
      this.$message({ 
        message: '編輯成功',
        type: 'success',
        showClose: true,
        duration: 0
      })
      this.modelEdit = false
      this.getTags()
    },
    getTags() {
      this.$axios.post('tag/GetResourceTagsByResourceIds', {
        "Version": "2018-08-01",
        "serviceType": "lvb",
        "resourcePrefix": "live",
        "region": "ap-guangzhou",
        'resourceIds.0': this.$route.query.Name
      }).then(res => {
        this.tags = res.data.rows
        // this.totalItems = res.data.total
      })
    },
    removeTags() {
      this.$confirm('確認清除標籤', '清除標籤', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: '',
      }).then(() => {
        this.$axios.post('tag/ModifyResourceTags', flatObj({
          resource: `qcs::lvb:ap-guangzhou:uin/${VueCookie.get('uin')}:live/${this.$route.query.Name}`,
          deleteTags: this.tags.map(tag => ({ tagKey: tag.tagKey, tagValue: tag.tagValue, resourceId: '' }))
        })).then(res => {
          this.$message({
            message: '清除成功',
            type: 'success',
            showClose: true,
            duration: 0
          })
          this.getTags()
        })
      }).catch(() => {})
    },
    // 关闭弹框
    closeEditTagsModel(isShow) {
      this.modelEdit = isShow
    }
  }
}
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
.tag {
  background: #f2f2f2;
  border: 1px solid #ddd;
  padding: 3px 5px;
  margin-right: 5px;
}
.icon {
  font-size: 16px;
  margin-right: 5px;
  cursor: pointer;
}
</style>

<template>
    <div class='room-out'>
        <el-card class="box-card">
            <p class="box-info">以下内容来自Docker Hub，详情请访问：<a href="https://hub.docker.com/_/nginx" target="_blank">https://hub.docker.com/_/nginx</a></p>
            <div class="room">
                <div class="item-left">
                     <mavon-editor v-model="detailDesc" @change="changeMd" style="display:none"></mavon-editor>
                     <div v-html="contentHtml"></div>
                </div>
                <div class="item-right">
                    <div style='border: 1px solid #ddd;'>
                        <div style='padding:20px;'>
                            <h3 style="margin-bottom:10px;">Tags</h3>
                            <div style="font-size:14px;line-height: 1.5;">{{tagList}}</div>
                        </div>
                    </div>
                </div>
            </div>
        </el-card>
    </div>
</template>
<script>
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
// import VueMarkdown from 'vue-markdown'
import { TKE_DOCKERHUB_INFO,TKE_DOCKERHUB_TAGLIST } from "@/constants"
export default {
    name: 'DockerHubDetail',
    data(){
        return {
            detailDesc:'',
            tagList:'',
            List:[],
            contentHtml:''
        }
    },
    created(){
        this.getInfo()
        this.getTagList()
       
    },
    methods:{
        changeMd(value, render) {
            this.contentHtml = render;
        },
        getInfo () {
            const param = {
                reponame: this.$route.query.id,
            }
            this.axios.post(TKE_DOCKERHUB_INFO, param).then(res => {
                if (res.code === 0 && res.Error == undefined){
                    this.detailDesc = res.data.detailDesc
                } else {
                    this.$message({
                        message: ErrorTips[res.codeDesc],
                        type: "error",
                        showClose: true,
                        duration: 0
                    })
                }
            })
        },
        getTagList(){
            const param = {
                reponame: this.$route.query.id,
            }
            this.axios.post(TKE_DOCKERHUB_TAGLIST, param).then(res => {
                if (res.code === 0 && res.Error == undefined){
                    for(let i = 0 ; i < res.data.tagList.length ; i++){
                        this.tagList = this.tagList+res.data.tagList[i]
                    }
                    // this.List = this.tagList.split('-')
                } else {
                    this.$message({
                        message: ErrorTips[res.codeDesc],
                        type: "error",
                        showClose: true,
                        duration: 0
                    })
                }
          })
        }
    },
    components: {
        mavonEditor,
    },
}
</script>
<style lang="scss" scoped>
  .item-left{
    ul{
        margin-bottom: 20px;
        li{
        padding-top:30px;
        font-size: 12px;
        color:#888;
        }
    }
  }

  .box-card {
    width: 100%;
    .box-info{
        font-size: 14px;
        font-weight: 700;
        margin-top:30px;
        margin-bottom:10px;
    }
    .room{
        width: 100%;
        display: flex;
        justify-content: space-between;
        .item-left{
            width: 70%;
            border: 1px solid #ddd;
            height: auto;
        }
        .item-right{
            width: 25%;
            height:auto;
        }
    }
  }
  .room-out{
      padding:20px;
  }
</style>

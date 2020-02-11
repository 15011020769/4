<template>
  <div>
    <div class="CodeContent">
      <div class="CodeTool">
        <div class="CodeTool-frist">
          <P>
            <span>
              提交方法<i class="el-icon-question"></i>
            </span>
            <el-select v-model="SubmissionValue" placeholder="请选择" class="select">
              <el-option v-for="item in SubmissionArr" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </P>
          <P>
            <span>
              执行方法<i class="el-icon-question"></i>
            </span>
            <el-input v-model="implementInput" placeholder="请输入内容"></el-input>
          </P>
          <P>
            <span>
              运行环境
            </span>
            <span>{{ScienceValue}}</span>
          </P>
        </div>
        <div>
          <p>
            <a href="">Python2.7 开发教程</a>
          </p>
          <p>
            <el-dropdown trigger="click">
              <el-button>
                下载
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>下载代码包</el-dropdown-item>
                <el-dropdown-item>下载YAML文件</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        SubmissionValue: 'Inline', //提交方法
        implementInput: '', //执行方法
        ScienceValue: 'Python2.7', //运行环境
        SubmissionArr: [{ //提交方法数组
            label: '在线编辑',
            value: 'Inline'
          },
          {
            label: '本地上传zip包',
            value: 'ZipFile'
          },
          {
            label: '本地上传文件夹',
            value: 'TempCos'
          },
          {
            label: '通过cos上传zip包',
            value: 'Cos'
          }
        ]
      }
    },
    methods: {

    }
  }

</script>
<style lang="scss" scoped>
  .CodeContent {
    height: 500px;
    background-color: #fff;
    box-shadow: 0 2px 3px 0 rgba(0, 0, 0, .2);
    padding: 20px;

    .CodeTool {
      font-size: 12px;
      color: #888;
      display: flex;
      justify-content: space-between;


      .CodeTool-frist {
        // display: flex;
        flex-basis: 80%;
      }



      p {
        line-height: 30px;

        span {
          margin-right: 10px;

        }

        ::v-deep .el-input__inner {
          width: 200px !important;
        }

        ::v-deep .el-input {
          width: 200px !important;
        }

      }


    }
  }

</style>

<template>
  <el-row >
    <el-col>
      <el-row type="flex" :gutter="20">
        <el-col :span="6">
          待提取文本
        </el-col>
        <el-col>
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 8}"
            :placeholder="session.Source === 'COOKIE' ? `请将${session.Source}会话内容复制后粘贴在这里` : '请输入COOKIE文本内容，格式：a=1;b=2;c=3'"
            v-model="content">
          </el-input>
          <div class="tip">
            <p>当前匹配位置：{{session.Source}}；</p>
            <p>匹配方式：{{session.Category}};</p>
            <p>
              匹配设置：SESSION标识：{{session.KeyOrStartMat}}；

              <span v-if="session.Category === 'match'">结束字符：{{session.EndMat}}</span>
              <template v-else>
                <span>开始位置：{{session.StartOffset}}</span>
                <span>结束位置：{{session.EndOffset}}</span>
              </template>
            </p>
          </div>
        </el-col>
      </el-row>
    </el-col>
    <el-col>
      <el-row type="flex">
        <el-col :span="6">
          测试结果
        </el-col>
        <el-col class="result">
          <p class="un-match" v-if="matchedStr === false">请输入待提取文本</p>
          <p class="not-match" v-else-if="matchedStr === ''">未匹配到字符串</p>
          <p class="matched" v-else>{{matchedStr}}</p>
        </el-col>
       </el-row>
    </el-col>

    <el-col style="margin-top: 20px;">
      <el-row type="flex" justify="center">
        <el-button type="primary" @click="test" :disabled="disableTest">测试</el-button>
        <el-button @click="close">取消</el-button>
      </el-row>
    </el-col>
  </el-row>
</template>
<script>
export default {
  props: {
    session: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      content: '',
      matchedStr: false,
      disableTest: true
    }
  },
  watch: {
    content(n) {
      this.disableTest = !!!this.content
    },
  },
  methods: {
    close() {
      this.$emit('update:visible', false)
    },
    test() {
      
      const { content, session: { KeyOrStartMat, StartOffset, EndOffset, EndMat } } = this
      if (session.Category === 'match') { // 字符串匹配
        const matched = content.match(RegExp(`${KeyOrStartMat}(.*?)${EndMat}`))
        if (matched) {
          this.matchedStr = matched[1]
        } else {
          this.matchedStr = ''
        }
      } else {
        // 位置匹配
        const index = content.indexOf(KeyOrStartMat)
        if (index > -1) {
          const start = index + KeyOrStartMat.length + StartOffset + 1
          this.matchedStr = this.content.substring(start, start + EndOffset + 1)
        } else {
          this.matchedStr = ''
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.tip {
  margin: 15px 0;
  color: #bbb;
  font-size: 12px;
  p {
    line-height: 25px;
  }
}
.result {
  font-size: 12px;
  .un-match {
    color: #000;
  }
  .not-match {
    color: #e1504a;
  }
  .matched {
    color: #0ABF5B;
  }
}
</style>
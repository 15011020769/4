<template>
  <el-row>
    <el-col>
      <el-row type="flex" :gutter="20">
        <el-col :span="6">
          待提取文本
        </el-col>
        <el-col>
          <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 8}" :placeholder="getPlaceholder(session.Source)" v-model="content">
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
          <!-- <p class="un-match" v-if="matchedStr === false">请输入待提取文本</p>
          <p class="not-match" v-else-if="matchedStr === ''">未匹配到字符串</p> -->
          <p :class="code === 0 ? 'matched' : 'not-match'">{{matchedStr}}</p>
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
      code: 0,
      matchedStr: '',
      disableTest: true
    }
  },
  watch: {
    content(n) {
      this.disableTest = !!!this.content
    },
  },
  methods: {
    getPlaceholder(source) {
      console.log(source)
      if (source === 'cookie') {
        return '請輸入COOKIE文本內容，格式：a=1;b=2;c=3'
      }
      if (source === 'get') {
        return '請輸入GET參數文本內容，格式：a=1&b=2&c=2'
      }
      return '請將POST會話內容複製後粘貼在這裡'
    },
    close() {
      this.$emit('update:visible', false)
    },
    test() {
      const { content, session } = this
      const { KeyOrStartMat, StartOffset, EndOffset, EndMat } = session
      if (session.Category === 'match') { // 字符串匹配
        const matched = content.match(RegExp(`${KeyOrStartMat}(.*?)${EndMat}`))
        if (matched) {
          this.matchedStr = matched[1]
        } else {
          this.matchedStr = ''
        }
      } else {
        // 位置匹配
        const rest = this.locationTest(content, session.Source, KeyOrStartMat, Number(StartOffset), Number(EndOffset))
        this.matchedStr = rest.msg
        this.code = rest.code
      }
    },
    locationTest(...args) {
      var e = args.length > 0 && args[0] !== undefined ? args[0] : "";
      var t = args[1];
      var a = args[2];
      var r = args.length > 3 && args[3] !== undefined ? args[3] : -1;
      var n = args.length > 4 && args[4] !== undefined ? args[4] : -1;
      var i = {
        get: "&",
        post: "&",
        cookie: ";"
      };
      if ("" === e) {
        return {
          code: -1,
          msg: "提取文本輸入有誤"
        }
      }
      var o = e.split(i[t]);
      var c = false;
      for (var s = 0, l = o.length; s < l; s++) {
        var u = o[s];
        var d = u.startsWith(a + "=");
        if (d) {
          c = true;
          var f = u.split("=");
          if (2 === f.length) {
            var p = f[1];
            var m = r
              , v = n;
            if (-1 === m) {
              m = 0
            }
            if (-1 === v) {
              v = p.length
            }
            if (p.length < m) {
              return {
                code: -1,
                msg: "開始位置大於字元串長度"
              }
            }
            if (v < m) {
              return {
                code: -1,
                msg: "開始位置>結束位置"
              }
            }
            if (-1 === v || v > p.length) {
              v = p.length
            }
            if (v - m + 1 > 128) {
              v = m + 128 - 1
            }
            return {
              code: 0,
              msg: p.substring(m, v + 1)
            }
          } else {
            return {
              code: -1,
              msg: "val為空，或者val包含了="
            }
          }
        }
      }
      if (!c) {
        return {
          code: -1,
          msg: "未找到匹配的key"
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
    color: #0abf5b;
  }
}
</style>
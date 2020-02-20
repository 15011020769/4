<!--
 * @Author: T
 * @Date: 2020-02-20 13:32:35
 * @LastEditTime: 2020-02-20 15:15:17
 * @LastEditors: Please set LastEditors
 * @Description: 复制弹窗-穿梭框
 * @FilePath: /new_product/src/views/WAF/botMan/component/transfer.vue
 -->
<template>
  <div class="main">
    <span style="font-size: 12px">您可以将当前域名的策略复制到其他开启了BOT流量分析的域名，最多可选20个。</span>
    <div class="transfer-box">
      <div class="left content-wrapper">
        <h4 class="title">请选择域名</h4>
        <div class="content">
          <el-input v-model="inputSearch">
            <div slot="suffix" class="input-search">
              <i style="cursor: pointer" class="el-icon-search" />
            </div>
          </el-input>
          <ul class="list-wrapper">
             <el-checkbox-group v-model="checkList" @change="onCheck">
              <li v-for="item in ulData" :key="item.id" class="list-content">
                <el-checkbox name="ff" :label="item">
                  <div>
                    {{item.host}}
                  </div>
                </el-checkbox>
              </li>
            </el-checkbox-group>
          </ul>
        </div>
      </div>
      <i class="el-icon-info" />
      <div class="right content-wrapper">
        <h4 class="title">已选择(1)</h4>
        <div class="content">
          <ul class="list-wrapper right-wrapper">
            <li v-for="item in checkList" :key="item.id" class="list-content">
              <!-- <el-checkbox label=""/> -->
              <div class="right-list-contnt">
                <span>{{item.host}}</span>
                <i @click="onDelete(item)" style="cursor: pointer" class="el-icon-close" />
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ulData: [
        {
          id: 1,
          host: 'www.baidu.com'
        },
        {
          id: 2,
          host: 'www.baidu1.com'
        },
        {
          id: 3,
          host: 'www.baidu2.com'
        },
        {
          id: 4,
          host: 'www.baidu3.com'
        },
        {
          id: 5,
          host: 'www.baidu4.com'
        },
        {
          id: 6,
          host: 'www.baidu5.com'
        },
        {
          id: 7,
          host: 'www.baidu6.com'
        }
      ],
      checkList: [],
      inputSearch: ''
    }
  },
  mounted() {
    console.log(11);
    localStorage.setItem('data', JSON.stringify(this.ulData))
  },
  methods: {
    onCheck() {
      console.log(this.checkList)
    },
    onDelete(item) {
      // console.log(item);
      const currtIndex = this.checkList.findIndex(_item => _item.id === item.id )
      this.checkList.splice(currtIndex, 1)
    }
  },
  watch: {
    inputSearch(n, o) {
      let arr = [].concat(this.checkList)
      if (n.length) {
          this.ulData = this.ulData.filter(item => {
          console.log(item.host.indexOf(n) > -1);
          return item.host.indexOf(n) > -1
        })
        return
      }
      this.ulData = JSON.parse(localStorage.getItem('data'))
      this.checkList = arr
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
  .transfer-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .content-wrapper {
    width: 380px;
    box-sizing: border-box;
    ::v-deep .el-input__suffix{
      display: flex;
      align-items: center;
    }
  }
  .content {
    border: 1px solid #ddd;
  }
  .list-wrapper {
    height: 350px;
    overflow-y: scroll;
    .list-content {
      height: 50px;
      display: flex;
      align-items: center;
      padding: 10px;
      box-sizing: border-box;
      border-bottom: 1px solid #ddd;
    }
  }
  .right-wrapper {
    height: 380px;
  }
  .right-list-contnt {
    padding-right: 20px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
<template>
  <div class="createProvider">
    <HeadCom :title="$t('CAM.Role.top_text')" :backShow="true" @_back="_back" />
    <div class="container">
      <div class="contant">
        <div class="step">
          <el-steps :active="active" simple finish-status="success">
            <el-step :title="$t('CAM.Role.step_titile1')"></el-step>
            <el-step :title="$t('CAM.Role.step_titile2')"></el-step>
            <el-step :title="$t('CAM.Role.step_titile3')"></el-step>
          </el-steps>
        </div>
        <div v-if="active == 1" class="contant_flex">
          <div class="first">
            <div class="first_left">
              <p style="margin-bottom:50px">身份提供商</p>
              <p>{{$t('CAM.Role.kztfw')}}</p>
              <p style="margin-top:30px">{{$t('CAM.Role.sytj')}}</p>
            </div>
            <div class="first_right">
              <p style="margin-bottom:30px">
                <el-select v-model="value" :placeholder="$t('CAM.Role.zwkxsftgs')" size="mini">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </p>
              <p>
                <el-checkbox v-model="checked">{{$t('CAM.Role.yxjsfwkzt')}}</el-checkbox>
              </p>
              <div style="width:800px;margin-top:40px">
                <el-table :data="tableData" height="300" border style="width: 100%">
                  <el-table-column prop="date" :label="$t('CAM.Role.jian')">
                    <template slot-scope="scope">
                      <el-select v-model="value" :placeholder="$t('CAM.Role.qxz')" size="mini">
                        <el-option
                          v-for="item in options"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column prop="name" :label="$t('CAM.Role.tj')">
                    <template slot-scope="scope">
                      <el-select v-model="value" :placeholder="$t('CAM.Role.qxz')" size="mini">
                        <el-option
                          v-for="item in options"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column prop="address" label="值">
                    <template slot-scope="scope">
                      <el-input v-model="input" :placeholder="$t('CAM.strategy.inputContent')" size="mini"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column prop="address" label>
                    <template slot-scope="scope">
                      <a href="JavaScript:;" @click="detele(scope)">{{$t('CAM.userList.userDel')}}</a>
                    </template>
                  </el-table-column>
                </el-table>
                <p style="margin-top:20px">
                  <el-button size="small" @click="add_use">{{$t('CAM.Role.xzsytj')}}</el-button>
                </p>
              </div>
            </div>
          </div>
        </div>
        <!-- <div class="tansfer" v-if="active == 2">
          <el-transfer
            filter-placeholder="支持搜索策略名称/描述/备注"
            v-model="transfer_value"
            :props="{key: 'value',label: 'desc'}"
            :data="transfer_data"
            filterable
            @left-check-change="leftCheck"
          ></el-transfer>
        </div>
        <div class="shenyue" v-if="active == 3">
          <div class="content_flex">
            <div class="content_left">
              <p class="juese">角色名称*</p>
              <p class="juese" style="margin-top:55px">角色描述</p>
              <p class="juese">角色载体</p>
            </div>
            <div class="content_right">
              <div class="jscontent" style="height:50px">
                <el-input v-model="inputName" placeholder="请输入角色名称" size="mini" @blur="jsname"></el-input>
                <p v-if="have" style="font-size:12px;color:#E1504A;padding-top:10px">角色名称不能为空</p>
              </div>
              <p class="jscontent">
                <el-input v-model="input" placeholder size="mini"></el-input>
              </p>
              <p class="jscontent text">服务-mps.cloud.tencent.com</p>
            </div>
          </div>
          <div class="content_table">
            <el-table :data="tableData" height="300" border style="width: 100%">
              <el-table-column prop="date" label="策略名称"></el-table-column>
              <el-table-column prop="name" label="描述"></el-table-column>
              <el-table-column prop="address" label="策略类型"></el-table-column>
            </el-table>
          </div>
        </div>-->
        <div style="margin:20px 0px">
          <el-button size="small" v-if="active != 1" @click="reTurn">返回</el-button>
          <el-button type="primary" size="small" @click="next" v-if="active != 3">下一步</el-button>
          <el-button type="primary" size="small" v-if="active == 3" @click="finall">完成</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import HeadCom from "../UserListNew/components/Head";
export default {
  data() {
    return {
      active: 1,
      input: "",
      input_num: "10001921910",
      inputName: "",
      have: false,
      radio: "1",
      checked: true,
      value: "",
      checkedCities: [],
      transfer_value: [],
      options: [
        {
          value: "選項1",
          label: "暫無可選身份提供商"
        }
      ],
      transfer_data: [
        {
          value: 1,
          desc: "備選項1"
        },
        {
          value: 2,
          desc: "備選項2"
        },
        {
          value: 3,
          desc: "備選項3"
        }
      ],
      tableData: []
    };
  },
  components:{
    HeadCom
  },
  methods: {
    //返回上一级
    _back() {
      this.$router.go(-1);
    },
    back() {
      this.$router.push("/Role");
    },
    next() {
      if (this.active == 1) {
        this.active = this.active + 1;
      } else if (this.active == 2) {
        if (this.transfer_value.length == 0) {
          this.$message({
              message: "請至少選擇一個策略",
              type: "error",
              showClose: true,
              duration: 0
          })
          return;
        }
        if (this.active == 3) {
          return;
        }
        this.active = this.active + 1;
      }
    },
    reTurn() {
      if (this.active == 1) {
        return;
      }
      this.active = this.active - 1;
    },
    handleCheckedCitiesChange(val) {
      console.log(val);
    },
    leftCheck(val) {},
    jsname() {
      if (!this.inputName) {
        this.have = true;
      } else {
        this.have = false;
      }
    },
    finall() {
      if (!this.inputName) {
        this.have = true;
        return;
      }
       this.$message({
              message: "創建角色成功",
              type: "success",
              showClose: true,
              duration: 0
        })
    },
    add_use() {
      let obj = {};
      this.tableData.push(obj);
    },
    detele(val) {
      console.log(val.$index);
      this.tableData.splice(val.$index, 1);
    }
  }
};
</script>
<style lang="scss" scoped>
.createProvider {
  .top {
    padding: 0 20px;
    background-color: #fff;
    margin-bottom: 20px;
    color: #000;
    height: 45px;
    line-height: 45px;
    .top_text {
      font-size: 16px;
      font-weight: 700;
      vertical-align: bottom;
      margin-left: 20px;
    }
  }
  .container {
    padding-top: 20px;
    .contant {
      max-width: 96%;
      margin: 0 auto;
      padding: 20px;
      background: #fff;
      .step {
        border-bottom: 1px solid #ddd;
        padding-bottom: 20px;
      }
      .contant_flex {
        display: flex;
        padding-top: 20px;
        border-bottom: 1px solid #ddd;
        padding-bottom: 20px;
        .flex_right {
          padding-left: 20px;
          .el-checkbox {
            margin-left: 0;
          }
        }
      }
    }
  }
  .shenyue {
    .content_flex {
      display: flex;
      padding: 20px 0 0 5px;
      .content_left {
        color: #888;
        padding-right: 20px;
        .juese {
          margin-bottom: 40px;
          margin-top: 10px;
        }
      }
      .content_right {
        .jscontent {
          margin-bottom: 20px;
        }
        .text {
          margin-top: 35px;
        }
      }
    }
  }
  .first {
    display: flex;
    .first_left {
      color: #888;
    }
    .first_right {
      padding-left: 50px;
    }
  }
}
</style>

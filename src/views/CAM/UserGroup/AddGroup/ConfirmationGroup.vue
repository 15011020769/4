<template>
    <div class="Cam">
        <div class="container">
            <!-- <el-form label-width="100px">
                <el-form-item class="container-mar" label="用户组名称">
                    <span>{{addModel.groupName}}</span>
                </el-form-item>
                <el-form-item class="container-mar" label="备注">
                    <span>{{addModel.remark}}</span>
                </el-form-item>
            </el-form> -->
            <el-table
                  class="table-left"
                  :data="policiesSelectedData"
                  tooltip-effect="dark"
                  height="300"
                  size = "small"
                  style="width: 100%; margin-botton:10px;">
                  <el-table-column class="btn" prop="PolicyName" :label="$t('CAM.userList.strategyNames')"  width="180"></el-table-column>
                  <el-table-column class="btn" prop="Description" :label="$t('CAM.userList.descs')" show-overflow-tooltip></el-table-column>
                  <el-table-column class="btn" prop="Type"  :label="$t('CAM.userList.clType')"  width="120">
                    <template slot-scope="scope">
                      <p v-show="scope.row.Type == 1">{{$t('CAM.userList.strategySelf')}}</p>
                      <p v-show="scope.row.Type == 2">{{$t('CAM.userList.ysStrategy')}}</p>
                    </template>
                  </el-table-column>
              </el-table>
        </div>
    </div>
</template>

<script>
  export default {
    props: {
      addModel: {
        groupName: String,
        remark: String
      },
      policiesSelectedData: Array
    },
    data() {
      return {
        // policiesSelectedData: []
      };
    },
    methods: {
    }
  }
</script>
<style lang="scss" scoped>
  .Cam {
  .container {
    width:96%;
    margin:0 auto;
    background: #fff;
    padding:20px;
    p.title,p.explain{
      line-height: 20px;
      font-size: 16px;
      color: #000;
      font-weight: 700;
    }
    p.explain {
      font-size: 12px;
      color:#ccc;
      margin-top: 10px;
      line-height: 16px;
      color: #666;
    }
    .container-mar{
      margin: 0;
    }
  }

}
</style>
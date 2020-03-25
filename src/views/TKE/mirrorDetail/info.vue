<template>
  <div class="room">
    <div class="room-center">
      <div class="explain" style="margin-bottom:20px;">
        <p>
          {{$t('TKE.mirrorDetail.dqzhxjxck')}}，
          <span v-show="this.input1||this.input2?false:true">
            {{$t('TKE.mirrorDetail.nksz')}}
            <el-button
              type="text"
              size="small"
              @click="dialogVisible = true"
            >{{$t('TKE.mirrorDetail.szzdqccl')}}</el-button>
            {{$t('TKE.mirrorDetail.yjbljxbb')}}
          </span>
          <span v-show="this.input1?true:false">
            {{$t('TKE.mirrorDetail.dqzdqlcl')}}{{input1}}{{$t('TKE.mirrorDetail.gjxbbnk')}}
            <el-button
              type="text"
              size="small"
              @click="deleteAuto()"
            >{{$t('TKE.mirrorDetail.sczdqlcl')}}</el-button>
            {{$t('TKE.mirrorDetail.hcxsz')}}
          </span>
          <span v-show="this.input2?true:false">
            {{$t('TKE.mirrorDetail.dqzdqlcl')}}{{input2}}{{$t('TKE.mirrorDetail.tyndjxbbnk')}}
            <el-button
              type="text"
              size="small"
              @click="deleteAuto()"
            >{{$t('TKE.mirrorDetail.sczdqlcl')}}</el-button>
            {{$t('TKE.mirrorDetail.hcxsz')}}
          </span>
        </p>
      </div>
    </div>
    <div class="room-top" style="margin-bottom:20px;">
      <div class="top-left">
        <el-button
          type="primary"
          size="mini"
          class="botton-size"
          @click="dialogFormVisible = true"
        >使用索引</el-button>
        <!-- <el-button disabled size="mini" class="botton-size">{{$t('TKE.overview.sc')}}</el-button>  -->
      </div>
      <div class="top-right">
        <i
          v-show="this.input1||this.input2?false:true"
          class="el-icon-setting"
          @click="dialogVisible = true"
        ></i>
        <span v-show="this.input1||this.input2?false:true">{{$t('TKE.mirrorDetail.szzdqijbb')}}</span>
        <p v-show="this.input1?true:false">
          {{$t('TKE.mirrorDetail.dqjblzxd')}}{{input1}}{{$t('TKE.mirrorDetail.gjxbb')}}
          <el-button
            type="text"
            size="mini"
            @click="deleteAuto()"
          >{{$t('TKE.mirrorDetail.sczdqlcl')}}</el-button>
        </p>
        <p v-show="this.input2?true:false">
          {{$t('TKE.mirrorDetail.dqjblzx')}}{{input2}}{{$t('TKE.mirrorDetail.tyndjxbb')}}
          <el-button
            type="text"
            size="mini"
            @click="deleteAuto()"
          >{{$t('TKE.mirrorDetail.sczdqlcl')}}</el-button>
        </p>
      </div>
    </div>
    <div class="room-bottom">
      <el-table
        :data="tableData.slice((currpage - 1) * pagesize, currpage * pagesize)"
        style="width: 100%"
        height="450"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="TagName" :label="$t('TKE.overview.jxbb')"></el-table-column>
        <el-table-column show-overflow-tooltip prop="PushTime" :label="$t('TKE.overview.cjsj')"></el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="UpdateTime"
          :label="$t('TKE.mirrorDetail.xgsj')"
        ></el-table-column>
        <el-table-column show-overflow-tooltip prop="TagId" :label="$t('TKE.mirrorDetail.jtid')"></el-table-column>
        <el-table-column prop="Size" label="大小"></el-table-column>
        <el-table-column prop="address" label="操作">
          <template slot-scope="scope">
            <el-button
              @click="handleClick(scope.row)"
              type="text"
              size="small"
            >{{$t('TKE.overview.sc')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="Right-style pagstyle">
        <span class="pagtotal">共&nbsp;{{TotalCount}}&nbsp;{{$t('TKE.mirrorDetail.tiao')}}</span>
        <el-pagination
          :page-size="pagesize"
          :pager-count="7"
          layout="sizes, prev, pager, next"
          :page-sizes="[10, 20, 50, 100]"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :total="TotalCount"
        ></el-pagination>
      </div>
    </div>
    <el-dialog title="删除镜像版本" :visible.sync="dialogVisibleDelete" width="40%">
      <p style="font-weight:bold">您确定要删除镜像版本"{{this.deleteObj.delName}}"吗？</p>
      <p style="color:#888;font-size:14px">镜像版本删除后将不可恢复，请提前备份好数据。</p>
      <p style="color:red">
        注：将同时删除与"{{this.deleteObj.delName}}"版本镜像ID相同的
        <span style="margin-left:2px" v-for="(v,i) in deleteObj.delOtherArr" :key="i">[{{v}}]</span> 版本。
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleDelete = false">取 消</el-button>
        <el-button type="primary" @click="deleteSure()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 使用指引弹出框 -->
    <el-dialog title="使用指引" :visible.sync="dialogFormVisible" width="620px">
      <ul>
        <li>
          <p class="pli-1">登录台富云docker registry</p>
          <div class="tip">
            <p class="tip-p">
              sudo docker login --username={{userID}}
              <br />
              {{server|tableServers}}
            </p>
            <div class="tip-position" @click="getContext($event)">复制</div>
          </div>
          <p class="pli-2">登录registry的用户名是您的台富云的账号ID，密码是您开通镜像仓库服务时设置的密码</p>
        </li>
        <li>
          <p class="pli-1">从registry拉取镜像</p>
          <div class="tip">
            <p class="tip-p">sudo docker pull {{server|tableServers}}/{{reponame}}:[tag]</p>
            <div class="tip-position" @click="getContext($event)">复制</div>
          </div>
          <p class="pli-2">其中[tag]请根据您的镜像版本信息进行填写。</p>
        </li>
        <li>
          <p class="pli-1">将镜像推送到registry</p>
          <div class="tip">
            <p class="tip-p">
              sudo docker login --username={{userID}}
              <br />
              {{server|tableServers}}
            </p>
            <div class="tip-position" @click="getContext($event)">复制</div>
          </div>
          <div class="tip tip-one">
            <p class="tip-p">sudo docker tag [ImageId] {{server|tableServers}}/{{reponame}}:[tag]</p>
            <div class="tip-position" @click="getContext($event)">复制</div>
          </div>
          <div class="tip">
            <p class="tip-p">sudo docker push {{server|tableServers}}/{{reponame}}:[tag]</p>
            <div class="tip-position" @click="getContext($event)">复制</div>
          </div>
          <p class="pli-2">其中[ImageId]请根据您的实际镜像ID信息进行填写, [tag]请根据您的镜像版本信息进行填写。</p>
        </li>
      </ul>
    </el-dialog>
    <!-- 设置 -->
    <el-dialog title="自动删除镜像设置" :visible.sync="dialogVisible" width="40%">
      <div class="explain2" style="margin-bottom:20px;">
        <p>{{$t('TKE.mirrorDetail.dqzhxjxck2')}}</p>
      </div>
      <el-form
        :model="ruleForm"
        ref="ruleForm"
        label-width="30px"
        class="demo-ruleForm"
        :rules="rules"
        :show-message="false"
      >
        <el-form-item prop="input1">
          <el-radio v-model="radio" label="keep_last_nums">
            {{$t('TKE.mirrorDetail.blzxd')}}
            <el-input
              v-model.number="ruleForm.input1"
              :disabled="flag1"
              class="dialog-input"
              size="mini"
              autocomplete="off"
            ></el-input>
            {{$t('TKE.mirrorDetail.gjxbb')}}
          </el-radio>
        </el-form-item>
        <el-form-item prop="input2">
          <el-radio v-model="radio" label="keep_last_days">
            {{$t('TKE.mirrorDetail.blzxd')}}
            <el-input
              v-model.number="ruleForm.input2"
              :disabled="flag2"
              class="dialog-input"
              size="mini"
              autocomplete="off"
            ></el-input>
            {{$t('TKE.mirrorDetail.tyndjxbb')}}
          </el-radio>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm ('ruleForm')">{{$t('TKE.overview.qd')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { ErrorTips } from "@/components/ErrorTips";
import {
  TKE_MIRROR_ROAD,
  TKE_MIRROR_STRATEGY,
  TKE_RELEVANTIMAGELIST,
  TKE_DELETEIMAGEVERSION,
  TKE_MIRROR_AUTODELELTE,
  TKE_AUTOSTRATEGY,
  TKE_IMAGEVERSIONLIST
} from "@/constants";
export default {
  name: "MirrorInfos",
  data() {
    return {
      userID: this.$cookie.get("uuid"),
      radio: "keep_last_nums",
      flag1: false,
      flag2: true,
      name: this.$route.query.id,
      tableData: [],
      TotalCount: 0, // 总条数
      pagesize: 10, // 分页条数
      currpage: 1, // 当前页码
      dialogTableVisible: false,
      dialogFormVisible: false,
      dialogVisible: false,
      dialogVisibleDelete: false,
      deleteObj: {
        delName: "",
        delOtherArr: []
      },
      formLabelWidth: "120px",
      reponame: "",
      server: "",
      input1: "",
      input2: "",
      ruleForm: {
        input1: "",
        input2: ""
      },
      rag1: "",
      rag2: "",
      rules: {
        input1: [
          { required: true },
          { type: "number", message: this.$t("TKE.mirrorDetail.qsrygzzs") }
        ],
        input2: [
          { required: true },
          { type: "number", message: this.$t("TKE.mirrorDetail.qsrygzzs") }
        ]
      }
    };
  },
  watch: {
    radio(newName, oldName) {
      if (newName == "keep_last_nums") {
        this.flag1 = false;
        this.flag2 = true;
        // this.$refs['ruleForm'].resetField();
        this.$refs["ruleForm"].clearValidate();
        this.input2 = "";
        this.ruleForm.input2 = "";

        // this.$refs['ruleForm'].clearValidate();
      }
      if (newName == "keep_last_days") {
        this.flag1 = true;
        this.flag2 = false;
        // this.$refs['ruleForm'].resetField();
        this.$refs["ruleForm"].clearValidate();
        this.input2 = "";
        this.ruleForm.input1 = "";
      }
    }
  },
  created() {
    this.GetLink();
    this.GetImage();
    this.getList();
    console.log(this.$route.query.id, "this.$route.query.id,");
  },
  methods: {
    // 分页
    handleCurrentChange(val) {
      this.currpage = val;
    },
    handleSizeChange(val) {
      console.log(`每頁 ${val} 條`);
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (this.ruleForm.input1 !== "" || this.ruleForm.input2 !== "") {
          valid = !valid;
          if (valid) {
            this.dialogVisible = false;
            this.GetMirrorVersion();
            // alert('submit!');
          } else {
            console.log("error submit!!");
            return false;
          }
        }
      });
    },
    //删除
    handleClick(row) {
      this.dialogVisibleDelete = true;
      this.deleteObj.delName = row.TagName;
      let param = {
        RepoName: this.$route.query.id,
        Tag: row.TagName,
        Version: "2019-09-24"
      };
      this.axios.post(TKE_RELEVANTIMAGELIST, param).then(res => {
        if (res.Response.Error == undefined) {
          let {
            Data: { SameImages }
          } = res.Response;
          this.deleteObj.delOtherArr = SameImages;
        } else {
          let ErrTips = {};
          let ErrOr = Object.assign(ErrorTips, ErrTips);
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 0
          });
        }
      });
    },
    deleteSure() {
      this.dialogVisibleDelete = false;
      let param = {
        RepoName: this.$route.query.id,
        Tag: this.deleteObj.delName,
        Version: "2019-09-24"
      };
      this.axios.post(TKE_DELETEIMAGEVERSION, param).then(res => {
        if (res.Response.Error == undefined) {
          this.$message({
            message: "删除成功",
            type: "success",
            showClose: true,
            duration: 0
          });
          this.getList();
        } else {
          let ErrTips = {};
          let ErrOr = Object.assign(ErrorTips, ErrTips);
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 0
          });
        }
      });
    },
    // submitForm (formName) {
    //   // console.log(formName)
    //   if (formName.input1 !== '' || formName.input2 !== '') {
    //     this.dialogVisible = false
    //     this.GetMirrorVersion()
    //   }
    // },
    getContext(e) {
      let getText = e.currentTarget.previousElementSibling.innerHTML;
      this.copy(getText);
    },
    copy(data) {
      // 复制功能
      let url = data;
      let oInput = document.createElement("input");
      oInput.value = url;
      document.body.appendChild(oInput);
      oInput.select(); // 选择对象;
      console.log(oInput.value);
      document.execCommand("Copy"); // 执行浏览器复制命令
      this.$message({
        message: this.$t("TKE.mirrorDetail.fzcg"),
        type: "success"
      });
      oInput.remove();
    },
    GetLink() {
      // 获取索引信息
      const param = {
        reponame: this.name
      };
      this.axios.post(TKE_MIRROR_ROAD, param).then(res => {
        if (res.code === 0 && res.Error == undefined) {
          console.log(res);
          this.server = res.data.server;
          this.reponame = res.data.reponame;
        } else {
          this.$message({
            message: ErrorTips[res.codeDesc],
            type: "error",
            showClose: true,
            duration: 0
          });
        }
      });
    },
    GetImage() {
      // 清除策略
      const param = {
        reponame: this.name
      };
      this.axios.post(TKE_AUTOSTRATEGY, param).then(res => {
        if (res.code === 0 && res.Error == undefined) {
          console.log(res);
          let strategyInfo = res.data.strategyInfo;
          for (let i in strategyInfo) {
            if (
              strategyInfo[i].type == "keep_last_nums" &&
              strategyInfo[i].valid
            ) {
              this.rag1 = true;
              this.rag2 = false;
              this.input1 = strategyInfo[i].value;
              console.log(this.input1);
            } else if (
              strategyInfo[i].type == "keep_last_days" &&
              strategyInfo[i].valid
            ) {
              this.rag2 = true;
              this.rag1 = false;
              this.input2 = strategyInfo[i].value;
              console.log(this.input2);
            }
          }
          // this.server = res.data.server
          // this.reponame = res.data.reponame
        } else {
          this.$message({
            message: ErrorTips[res.codeDesc],
            type: "error",
            showClose: true,
            duration: 0
          });
        }
      });
    },
    DeleteMirrorAuto() {
      // 删除镜像自动
      const param = {
        reponame: this.name
      };
      this.axios.post(TKE_MIRROR_AUTODELELTE, param).then(res => {
        console.log(res);
        if (res.code === 0 && res.Error == undefined) {
          // console.log(res.data)
          this.input1 = "";
          this.input2 = "";
          this.rag1 = "";
          this.rag2 = "";
          this.$message({
            message: this.$t("TKE.myMirror.sccg"),
            type: "success",
            showClose: true,
            duration: 0
          });
        } else {
          this.$message({
            message: ErrorTips[res.codeDesc],
            type: "error",
            showClose: true,
            duration: 0
          });
        }
      });
    },
    GetMirrorVersion() {
      // 获取镜像版本
      const param = {
        type: "keep_last_nums",
        val: this.ruleForm.input1,
        reponame: this.name
      };
      const param2 = {
        type: "keep_last_days",
        val: this.ruleForm.input2,
        reponame: this.name
      };
      if (this.ruleForm.input1 !== "") {
        this.axios.post(TKE_MIRROR_STRATEGY, param).then(res => {
          console.log(res);
          if (res.code === 0 && res.Error == undefined) {
            this.input1 = this.ruleForm.input1;
          } else {
            this.$message({
              message: ErrorTips[res.codeDesc],
              type: "error",
              showClose: true,
              duration: 0
            });
          }
        });
      }
      if (this.ruleForm.input2 !== "") {
        this.axios.post(TKE_MIRROR_STRATEGY, param2).then(res => {
          console.log(res);
          if (res.code === 0 && res.Error == undefined) {
            this.input2 = this.ruleForm.input2;
          } else {
            this.$message({
              message: ErrorTips[res.codeDesc],
              type: "error",
              showClose: true,
              duration: 0
            });
          }
        });
      }
    },
    deleteAuto() {
      this.ruleForm.input1 = "";
      this.ruleForm.input2 = "";
      this.DeleteMirrorAuto();
    },
    getList() {
      let param = {
        RepoName: this.$route.query.id,
        Version: "2019-09-24"
      };
      this.axios.post(TKE_IMAGEVERSIONLIST, param).then(res => {
        console.log(res, "res");
        if (res.Response.Error == undefined) {
          let {
            Data: { TagInfo }
          } = res.Response;
          console.log(TagInfo, "TagInfo");
          this.tableData = TagInfo;
          this.TotalCount = TagInfo.length;
        } else {
          let ErrTips = {};
          let ErrOr = Object.assign(ErrorTips, ErrTips);
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 0
          });
        }
      });
    }
  },
  filters: {
    tableServers: function(value) {
      return value
        .replace("tencent", "taipei")
        .replace("cloud", "Top Cloud")
        .replace("qcloud", "Top Cloud");
      // return index
    }
  }
};
</script>
<style lang="scss" scoped>
.room {
  // position: absolute;
  // left: 20px;
  // top: 40px;
  // width: 95%;
  height: auto;
  padding: 20px;
}
.room-top {
  height: 30px;
  display: flex;
  justify-content: space-between;
}
.room-bottom {
  background: white;
}
.top-left {
  height: 30px;
  display: flex;
  justify-content: space-between;
}
.top-right {
  width: 300px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  i {
    font-size: 14px;
    cursor: pointer;
  }
  span {
    margin-left: 10px;
    font-size: 12px;
  }
}
.botton-size {
  text-align: center;
  margin-right: 10px;
  height: 30px;
}
.search-input {
  width: 180px;
  height: 28px;
}
.search-input2 {
  margin-left: 5px;
  width: 185px;
}
.room-center {
  .explain {
    padding: 10px 30px 10px 20px;
    vertical-align: middle;
    color: #003b80;
    border: 1px solid #97c7ff;
    background: #e5f0ff;
    p {
      font-size: 11px;
      line-height: 18px;
    }
  }
}
.Right-style {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
  .esach-inputL {
    width: 300px;
    margin-right: 20px;
  }
}
.pagstyle {
  padding: 20px;
  .pagtotal {
    font-size: 13px;
    font-weight: 400;
    color: #565656;
    line-height: 32px;
  }
}
.form-p {
  font-size: 12px;
  line-height: 1.8;
  color: #bbb;
}
.dialog-input {
  margin-left: 10px;
  width: 70px;
  margin-right: 10px;
}
.explain2 {
  padding: 10px 30px 10px 20px;
  vertical-align: middle;
  color: #003b80;
  border: 1px solid #ffd18b;
  background: #fff4e3;
  p {
    font-size: 11px;
    line-height: 18px;
  }
}
.tip {
  padding: 8px 16px;
  background-color: #f5f5f5;
  border-left: 10px solid #d1e7f7;
  position: relative;
}
.tip-one {
  margin: 20px 0;
}
.tip-p {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 475px;
}
.tip-position {
  font-size: 12px;
  text-align: center;
  color: #2177d9;
  position: absolute;
  right: 0;
  top: 0;
  background-color: #e1e1e1;
  padding: 0 5px;
  cursor: pointer;
}
.pli-1 {
  padding: 8px 0;
  font-size: 14px;
  color: #444;
  font-weight: bolder;
}
.pli-2 {
  padding: 8px 0;
  font-size: 12px;
  color: #bbb;
}
</style>

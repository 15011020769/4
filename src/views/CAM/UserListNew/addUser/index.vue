<template>
  <div class="addUser-wrap">
    <HeadCom :title="$t('CAM.userList.listAdduser')" :backShow="true" @_back="_back" />
    <div class="explain">
      <p>
        {{$t('CAM.userList.mesgPeople')}}
        <a href="#" style="color:#006eff;"> {{$t('CAM.userList.selfCreate')}}</a>{{$t('CAM.userList.selfCreates')}}
      </p>
    </div>
    <div class="adduser-main">
      <div class="user">
        <i class="el-icon-user"></i>
        <h3>{{$t('CAM.userList.addEvery')}}</h3>
        <span @click="_goTo">
          <i class="el-icon-edit"></i>{{$t('CAM.userList.selfCreate')}}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import HeadCom from "../components/Head";
export default {
  name: "addUser",
  data() {
    return {};
  },
  components: {
    HeadCom
  },
  methods: {
    //返回上一级
    _back() {
      this.$router.push('/UserListNew')
    },
    //跳转到创建页
    _goTo() {
      this.$router.push("/adduserlist");
    }
  }
};
</script>

<style scoped lang='scss'>
.addUser-wrap {
  width: 100%;
  height: 100%;
  background-color: #f2f2f2 !important;
  margin-bottom: 35px;
  box-sizing: border-box;
  .top {
    width: 100%;
    height: 45px;
    background-color: #fff;
    margin-bottom: 20px;
    .title-left {
      font-size: 14px;
      font-weight: bolder;
      padding-left: 20px;
      line-height: 45px;
    }
  }
  .explain {
    margin: 20px;
    font-size: 12px;
    padding: 10px 30px 10px 20px;
    vertical-align: middle;
    color: #003b80;
    border: 1px solid #97c7ff;
    border-radius: 2px;
    background: #e5f0ff;
    position: relative;
    box-sizing: border-box;
    p {
      line-height: 20px;
    }
  }
  .adduser-main {
    background: white;
    margin: 0 20px;
    box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
    padding: 20px;
    box-sizing: border-box;

    .user {
      text-align: center;
      margin-top: 80px;
      padding-bottom: 120px;
      i {
        color: #006eff;
        font-size: 60px;
      }
      h3 {
        font-size: 16px;
        margin: 20px 0;
        font-weight: normal;
      }
      span:hover {
        color: white;
        background: #006eff;
        i {
          color: white;
        }
      }
      span {
        cursor: pointer;
        height: 36px;
        line-height: 36px;
        color: #006eff;
        background-color: #fff;
        border: 1px #006eff solid;
        display: inline-block;
        padding: 0 15px;
        box-sizing: border-box;
        margin-top: 5px;
        i {
          font-size: 16px;
          margin-right: 5px;
        }
      }
    }
  }

  .tableBody {
    width: 100%;
  }
}
</style>
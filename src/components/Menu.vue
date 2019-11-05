<template>
  <div class="menu-div">
    <ul class="ul-1">
      <li v-for="(item, index1) in expanders" class="li-1" :key="index1">
        <a @click="navFunc1(item.title)" href="javascript:void(0);" class="a-1" v-class="{true:'long-9999',false:'long-0000'}[navActionA===item.title]">
          {{ item.title }}
          <i class="fa el-icon-arrow-right" v-show="navActionC != item.title"></i>
          <i class="fa el-icon-arrow-down" v-show="navActionC === item.title"></i>
        </a>
        <ul v-show="navActionC === item.title" class="ul-2">
          <li v-for="(children, index2) in item.text" :key="index2" @click="navFunc2(children.title)" class="li-2" :class="activeMenu === children.route ? 'active' : ''">
            <a v-if="children.href" :href="children.href" class="a-2">{{ children.title }}</a>
            <a v-else @click="activeMenu=children.route;$router.push(children.route);" href="javascript:void(0);" class="a-2">{{ children.title }}</a>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      navActionA: 'Elasticsearch Service',
      navActionB: 'Elasticsearch Service',
      navActionC: 'Elasticsearch Service',
      expanders: [
        {
          title: '云审计',
          text: [
            {
              title: '操作记录',
              route: '/cloudaudit-operation',
            },
            {
              title: '跟踪集',
              route: '/cloudaudit-tranking',
            },
          ],
        },
        {
          title: '云函数',
          text: [
            {
              title: '概览',
              route: '/scfoverView',
            },
            {
              title: '函数服务',
              route: '/scffuncServe',
            },
          ],
        },
        {
          title: '云监控',
          text: [
            {
              title: '云服务器',
              route: '/CMCVM',
            },
            {
              title: '云数据库-Mysql',
              route: '/CMcloudMysql',
            },
            {
              title: '云硬盘',
              route: '/CMcloudDisk',
            },
            {
              title: 'NAT网关',
              route: '/CMNATgateway',
            },
            {
              title: '对等连接',
              route: '/CMpeerConnect',
            },
            {
              title: 'VPN网关',
              route: '/CMVPNgateway',
            },
            {
              title: 'VPN通道',
              route: '/CMVPNchannel',
            },
            {
              title: '对象存储',
              route: '/CMobjectStorage',
            },

          ],
        },
      ],
    };
  },
  computed: {
    ...mapGetters({
      activeMenu: 'currentPath',
    }),
  },
  methods: {
    navFunc1(arg) {
      if (this.navActionA === arg) {
        this.navActionA = !arg;
        this.navActionB = !arg;
        this.navActionC = !arg;
      } else {
        this.navActionA = arg;
        this.navActionB = arg;
        this.navActionC = arg;
      }
    },
    navFunc2(arg) {
      this.navActionA = arg;
      this.navActionB = arg;
    },
  },
};
</script>

<style scoped lang="scss">
.menu-div {
  width: 200px;
  position: absolute;
  top: 60px;
  height: calc(100% - 60px);
  height: -webkit-calc(100% - 60px);
  height: -moz-calc(100% - 60px);
  height: -ms-calc(100% - 60px);
  height: -o-calc(100% - 60px);
  background: #282b37;
  overflow-y: auto;

  .ul-1 {
    .li-1 {
      .a-1 {
        padding-left: 20px;
        display: block;
        height: 56px;
        line-height: 56px;
        border-bottom: 1px solid #373941;
        color: white;
        font-size: 14px;
        text-align: left;

        .fa {
          float: right;
          line-height: 56px;
          padding-right: 20px;
        }
      }
    }
  }

  .ul-2 {
    .li-2 {
      .a-2 {
        padding-left: 30px;
        display: block;
        height: 45px;
        line-height: 45px;
        color: white;
        font-size: 14px;
        text-align: left;
      }

      &:last-child {
        border-bottom: 1px solid #373941;
      }
    }
  }
}

.menu-div::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.menu-div::-webkit-scrollbar-thumb {
  border-radius: 5px;
  box-shadow: inset 0 0 5px #fdcd00;
  background: #fdcd00;
}

.menu-div::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px rgba(253, 205, 0, 0.2);
  border-radius: 0;
  background: rgba(253, 205, 0, 0.1);
}

.long-9999 {
  background-color: #20222c;
  color: white;
}

.long-8888 {
  background-color: #20222c;
  color: white;
}

.active {
  background: #20222c;
}
</style>

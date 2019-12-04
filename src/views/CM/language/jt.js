module.exports = {
  menu: {
    x1: '云监控',
    x2: '云服务器',
    x3: '块存储',
    x4: '负载均衡-CLB',
    x5: '云数据库',
    x6: 'MySQL',
    x7: 'Redis',
    x8: '私有网络',
    x9: 'NAT网关',
    x10: 'VPN网关',
    x11: 'VPN通道',
    x12: '弹性公网IP',
    x13: '专线接入',
    x14: '物理专线',
    x15: '专线通道',
    x16: '对象存储'
  },
  CVM: {
    title: '云服务器',
    errorTxt: '请输入正确搜索信息',
    table: {
      x1: 'ID/主机名',
      x2: '监控',
      x3: '状态',
      x4: '网络类型',
      x5: 'IP地址',
      x6: '所属项目',
      x7: '健康状态'
    },
    searchOptions: [
      {
        value: "project-id",
        label: "项目ID"
      },
      {
        value: "instance-id",
        label: "实例ID"
      },
      {
        value: "instance-name",
        label: "实例名称"
      },
      {
        value: "private-ip-address",
        label: "内网IP"
      },
      {
        value: "public-ip-address ",
        label: "公网IP"
      }
    ],
    instanceStatus: {
      PENDING: "创建中",
      LAUNCH_FAILED: "创建失败",
      RUNNING: "运行中",
      STOPPED: "已关机",
      STARTING: "开机中",
      STOPPING: "关机中",
      REBOOTING: "重启中",
      SHUTDOWN: "待回收",
      TERMINATING: "销毁中"
    },
    RestrictState: {
      NORMAL: "健康",
      EXPIRED: "过期",
      PROTECTIVELY_ISOLATED: "隔离"
    }
  }
}

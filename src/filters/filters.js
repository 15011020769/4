import {
  State,
  Region,
  RegionOver,
  Attribute,
  Toconfigure,
  Billingmodel,
  IMAGE_STATE,
  SHOT_STATE,
  LOG_STATE,
  EIP_STATE,
  CVM_STATE,
  INSTANCE_BILL,
  NET_BILL,
  INST_TYPEA,
  DISK_TYPE,
  SAFETY_GROUP_PROJECT,
  MYSQL,
  MYSQLType
} from './data'
var States = State
var Regions = Region
var RegionOvers = RegionOver
var Attributes = Attribute
var Toconfigures = Toconfigure
var Billingmodels = Billingmodel
var IMAGESTATE = IMAGE_STATE
var SHOTSTATE = SHOT_STATE
var LOGSTATE = LOG_STATE
var EIPSTATE = EIP_STATE
var CVMSTATE = CVM_STATE
var INSTANCEBILL = INSTANCE_BILL
var NETBILL = NET_BILL
var INSTTYPEA = INST_TYPEA
var DISKTYPE = DISK_TYPE
var MYSQLTypes = MYSQLType
var SAFETYGROUPPROJECT = SAFETY_GROUP_PROJECT
var MYSQLS = MYSQL
var filters = {
  Statefilter: function (State) { // 状态装换
    for (let i in States) {
      if (State === i) {
        var result = States[i]
        return result
      }
    }
  },
  Regionfilter: function (Region) { // 城市转换
    for (let i in Regions) {
      if (Region === i) {
        return Regions[i]
      }
    }
  },
  RegionAllfilter: function (RegionOver) { // 概览城市转换
    for (let i in RegionOvers) {
      if (RegionOver === i) {
        return RegionOvers[i]
      }
    }
  },
  Attributefilter: function (Attribute) { // 雲硬盘属性
    for (let i in Attributes) {
      if (Attribute === i) {
        return Attributes[i]
      }
    }
  },
  Toconfigurefilter: function (Toconfigure) { // 雲硬盘配置
    for (let i in Toconfigures) {
      if (Toconfigure === i) {
        return Toconfigures[i]
      }
    }
  },
  Billingmodelfilter: function (Billingmodel) { // 计费方式
    for (let i in Billingmodels) {
      if (Billingmodel === i) {
        return Billingmodels[i]
      }
    }
  },
  imageState: function (state) { // 镜像状态-类型
    for (let i in IMAGESTATE) {
      if (state === i) {
        var result = IMAGE_STATE[i]
        return result
      }
    }
  },
  shotState: function (state) { // 快照状态-类型
    for (let i in SHOTSTATE) {
      if (state === i) {
        var result = SHOT_STATE[i]
        return result
      }
    }
  },
  logState: function (state) { // 快照日志
    for (let i in LOGSTATE) {
      if (state === i) {
        var result = LOG_STATE[i]
        return result
      }
    }
  },
  eipState: function (state) { // 弹性ip-类型
    for (let i in EIPSTATE) {
      if (state === i) {
        var result = EIP_STATE[i]
        return result
      }
    }
  },
  // 实例状态
  cvmState: function (state) {
    for (let i in CVMSTATE) {
      if (state === i) {
        var result = CVM_STATE[i]
        return result
      }
    }
  },
  // 实例计费模式
  instancebill: function (state) {
    for (let i in INSTANCEBILL) {
      if (state === i) {
        var result = INSTANCE_BILL[i]
        return result
      }
    }
  },
  // 网络计费模式
  netbill: function (state) {
    for (let i in NETBILL) {
      if (state === i) {
        var result = NET_BILL[i]
        return result
      }
    }
  },
  // 主机类型
  insttypea: function (state) {
    for (let i in INSTTYPEA) {
      if (state === i) {
        var result = INST_TYPEA[i]
        return result
      }
    }
  },
  // 系统盘
  disktype: function (state) {
    for (let i in DISKTYPE) {
      if (state === i) {
        var result = DISK_TYPE[i]
        return result
      }
    }
  },
  // 镜像时间
  renderTime: function (date) {
    if (date === '-') {
      return '-'
    }
    var dateee = new Date(date).toJSON()
    return new Date(+new Date(dateee) + 8 * 3600 * 1000)
      .toISOString()
      .replace(/T/g, ' ')
      .replace(/\.[\d]{3}Z/, '')
  },
  Itemfilteri: function (date) { // 项目列表过滤
    var projectList = JSON.parse(localStorage.getItem('projectList'))
    for (let i in projectList) {
      if (date === projectList[i].projectId) {
        return projectList[i].projectName
      }
    }
  },
  ProjectSafety: function (date) { // 项目列表过滤
    for (let i in SAFETYGROUPPROJECT) {
      if (date === i) {
        var result = SAFETY_GROUP_PROJECT[i]
        return result
      }
    }
  },
  MYSQLFilter: function (date) { // MYSQL列表过滤
    for (let i in MYSQLS) {
      if (date == i) {
        var result = MYSQLS[i]
        return result
      }
    }
  },
  MYSQLTYPEFilter: function (date) { // MYSQL列表过滤
    for (let i in MYSQLTypes) {
      if (date == i) {
        var result = MYSQLTypes[i]
        return result
      }
    }
  }
}
export default filters

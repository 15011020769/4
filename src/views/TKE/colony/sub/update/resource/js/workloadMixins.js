import { ErrorTips } from '@/components/ErrorTips.js'
// 实例内容器



let instanceContent = {
  addInstanceContent: function (n1='',n2='',n3='',n4='',n5='',n6='',n7='',n8='',n9='',a1=[],a2=[],t1=false,n10='',n11='',n12='',t2=false,t3=false,t4=false) {
    this.wl.instanceContent.push({
      name: n1, // 名称
      mirrorImg: n2, // 镜像
      versions: n3, // 镜像版本
      imagePullPolicy: n4, // 镜像拉取策略
      requestCpu: n5, // cpu 限制
      limitCpu: n6,
      requestMemory: n7, // 内存限制
      limitMemory: n8,
      gpuNum: n9, // gpu 限制
      environmentVar: a1, // 新增变量
      citeCs: a2, // 引用ConfigMap/Secret
      disAdvancedSetting: t1, // 显示高级设置false
      workDirectory: n10, // 工作目录
      runCommand: n11, // 运行命令
      runParam: n12, // 运行参数
      surviveExamine: t2, // 存活检查
      readyToCheck: t3, // 就绪检查
      surviveExamineContent: {
        inspectMethodOption: ['TCP端口检查', 'HTTP请求检查', '执行命令检查'], // 检查方法
        inspectMethodValue: 'TCP端口检查',
        inspectProtocolOption: ['HTTP', 'HTTPS'], // 检查协议
        inspectProtocolValue: '',
        executiveOrder: '', // 执行命令
        inspectPort: '', // 检查端口
        requestPath: '', // 请求路径
        startDelay: '', // 启动延时
        responseTimeout: '', // 响应超时,
        intervalTime: '', // 间隔时间
        healthyThreshold: 1, // 健康阀值
        unhealthyThreshold: '' // 不健康阀值
      },
      readyToCheckContent: {
        inspectMethodOption: ['TCP端口检查', 'HTTP请求检查', '执行命令检查'], // 检查方法
        inspectMethodValue: 'TCP端口检查',
        inspectProtocolOption: ['HTTP', 'HTTPS'], // 检查协议
        inspectProtocolValue: '',
        executiveOrder: '', // 执行命令
        inspectPort: '', // 检查端口
        requestPath: '', // 请求路径
        startDelay: '', // 启动延时
        responseTimeout: '', // 响应超时,
        intervalTime: '', // 间隔时间
        healthyThreshold: '', // 健康阀值
        unhealthyThreshold: '' // 不健康阀值
      },
      privilegeLevelContainer: t4, // 特权级容器
      completed: false, // 判断是否该验证的都验证完成
      editStatus: true // 编辑状态
    })
  },
  editInstanceContent: function (index) {
    this.wl.instanceContent[index].editStatus = !this.wl.instanceContent[index].editStatus
  },
  delInstanceContent: function (index) {
    this.wl.instanceContent.splice(index, 1)
  }
}

// 标签
let label = {
  addLabel: function () {
    // 填写名称后将名称默认复制给标签第一条
    this.wl.labels.push({ key: '', value: '' })
    this.wl.labels[0].value = this.wl.name
    /* if (labels.length > 0) {
      for (let i = 0; i < labels.length; i++) {
        if (labels[i].key === 'k8s-app') {
          labels[i].value = this.wl.name
          return
        }
      }
    } */
  },
  delLabel: function (index) {
    this.wl.labels.splice(index, 1)
  }
}

// 实例内容器-》新增环境变量
let environmentVariable = {
  addEnvironmentVar (index) {
    this.wl.instanceContent[index].environmentVar.push({
      name: '',
      value: ''
    })
  },
  delEnvironmentVar (index,ie) {
    this.wl.instanceContent[index].environmentVar.splice(ie, 1)
  }
}

// 实例内容器-》引用ConfigMap/Secret
let citeCs = {
  addCiteCs: function (index) {
    this.wl.instanceContent[index].citeCs.push({
      key: Date.now(),
      option1: ['ConfigMap', 'Secret'],
      value1: '',
      option2: [],
      value2: '',
      option3: [],
      value3: '',
      input1: ''
    })
  },
  delCiteCs (index, key) {
    let citeCsArr = this.wl.instanceContent[index].citeCs
    for (let i = 0; i < citeCsArr.length; i++) {
      if (citeCsArr[i].key === key) {
        this.wl.instanceContent[index].citeCs.splice(i, 1)
      }
    }
  }
}

// 实例数量-》自动调节-》触发策略
let touchTactics = {
  addTouchTactics: function () {
    this.wl.touchTactics.push({
      key: Date.now(),
      touch1: 'CPU',
      touch2: 'CPU使用量',
      size: ''
    })
  },
  delTouchTactics: function (key) {
    let touchTacticsArr = this.wl.touchTactics
    for (let i = 0; i < touchTacticsArr.length; i++) {
      if (touchTacticsArr[i].key === key) {
        this.wl.touchTactics.splice(i, 1)
      }
    }
  }
}

// 强制满足条件
let mustCondition = {
  addMustCondition () { // 添加强制满足条件
    this.wl.mustCondition.push([{
      name: '',
      connect: 'In',
      rule: ''
    }])
  },
  delMustCondition (index) { // 删除强制满足条件
    this.wl.mustCondition.splice(index, 1)
  }
}

// 尽量满足条件
let needCondition = {
  // 节点调度策略
  addNeedCondition () { // 添加尽可能满足条件
    this.wl.needCondition.push({
      weight: '',
      arr: [{
        name: '',
        connect: 'In',
        rule: ''
      }]
    })
  },
  delNeedCondition (index) { // 删除尽可能满足条件
    this.wl.needCondition.splice(index, 1)
  }
}

let mustRule = {
  addMustRule: function (index) { // 添加规则1
    this.wl.mustCondition[index].push({
      name: '',
      rule: '',
      connect: 'In'
    })
  },
  delMustRule: function (cIndex, rIndex) {
    this.wl.mustCondition[cIndex].splice(rIndex, 1)
  }
}

let needRule = {
  addNeedRule: function (index) { // 添加规则2
    this.wl.needCondition[index].arr.push({
      name: '',
      rule: '',
      connect: 'In'
    })
  },
  delNeedRule: function (cIndex, rIndex) {
    console.log(this.wl.needCondition[cIndex].arr)
    this.wl.needCondition[cIndex].arr.splice(rIndex, 1)
  }
}

let portMapping = {
  addProtMapping () {
    this.wl.portMapping.push({
      value: '',
      key: Date.now(),
      portValue: 'TCP', // 协议 value
      conPort: '', // 容器端口
      host: '', // 主机端口
      servicePort: '' // 服务端口
    })
  },
  removeProtMapping (item) {
    var index = this.wl.portMapping.indexOf(item)
    if (index !== -1) {
      this.wl.portMapping.splice(index, 1)
    }
  }
}

let change = {
  namespaceChange: function () {
    this.getPersistentvolumeclaims()
    this.getSecrets()
    this.getConfigmaps()
  }
}


let dataReel={//数据卷
  addDataJuan() { //新增数据卷
    this.dataFlag = true;
    var obj = {
      name1: "useMenu",
      name2: "",
      name3: ""
    };
    this.upc.dataJuan.push(obj);
  },


}
export default {
  methods: {
    ...label,
    ...instanceContent,
    ...environmentVariable,
    ...citeCs,
    ...touchTactics,
    ...mustCondition,
    ...needCondition,
    ...mustRule,
    ...needRule,
    ...portMapping,
    ...change,
    ...dataReel,
    axiosUtils: function (res, func) {
      func()
      /* if (res.info !== undefined) {
        this.$message({
          message: res.info,
          type: 'error',
          showClose: true,
          duration: 2000
        })
        return
      }
      if (res.Response.Error === undefined) {
        func()
      } else {
        console.log('error', res)
        let ErrTips = {}
        let ErrOr = Object.assign(ErrorTips, ErrTips)
        this.$message({
          message: ErrOr[res.Response.Error.Code],
          type: 'error',
          showClose: true,
          duration: 2000
        })
      } */
    }
  }
}

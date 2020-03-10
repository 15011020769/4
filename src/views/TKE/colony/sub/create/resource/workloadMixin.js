import { ErrorTips } from '@/components/ErrorTips.js'
// 实例内容器
let instanceContent = {
  addInstanceContent: function () {
    this.wl.instanceContent.push({
      name: '', // 名称
      mirrorImg: '', // 镜像
      versions: '', // 镜像版本
      mirrorPullTactics: '', // 镜像拉取策略
      requestCpu: '0.25', // cpu 限制
      limitCpu: '0.5',
      requestMemory: '256', // 内存限制
      limitMemory: '1024',
      gpuNum: 0, // gpu 限制
      environmentVar: [], // 新增变量
      citeCs: [], // 引用ConfigMap/Secret
      disAdvancedSetting: false, // 显示高级设置
      workDirectory: '', // 工作目录
      runCommand: '', // 运行命令
      runParam: '', // 运行参数
      surviveExamine: false, // 存活检查
      readyToCheck: false, // 就绪检查
      surviveExamineContent: {
        inspectMethodOption: ['TCP端口检查', 'HTTP请求检查', '执行命令检查'], // 检查方法
        inspectMethodValue: 'TCP端口检查',
        inspectProtocolOption: ['HTTP', 'HTTPS'], // 检查协议
        inspectProtocolValue: 'HTTP',
        executiveOrder: '', // 执行命令
        inspectPort: '', // 检查端口
        requestPath: '/', // 请求路径
        startDelay: 0, // 启动延时
        responseTimeout: 2, // 响应超时,
        intervalTime: 3, // 间隔时间
        healthyThreshold: 1, // 健康阀值
        unhealthyThreshold: 1 // 不健康阀值
      },
      readyToCheckContent: {
        inspectMethodOption: ['TCP端口检查', 'HTTP请求检查', '执行命令检查'], // 检查方法
        inspectMethodValue: 'TCP端口检查',
        inspectProtocolOption: ['HTTP', 'HTTPS'], // 检查协议
        inspectProtocolValue: 'HTTP',
        executiveOrder: '', // 执行命令
        inspectPort: '', // 检查端口
        requestPath: '/', // 请求路径
        startDelay: 0, // 启动延时
        responseTimeout: 2, // 响应超时,
        intervalTime: 3, // 间隔时间
        healthyThreshold: 1, // 健康阀值
        unhealthyThreshold: 1 // 不健康阀值
      },
      privilegeLevelContainer: false, // 特权级容器
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
      onlyId: Date.now(),
      key: '',
      value: ''
    })
  },
  delEnvironmentVar (index, key) {
    let environmentArr = this.wl.instanceContent[index].environmentVar
    for (let i = 0; i < environmentArr.length; i++) {
      if (environmentArr[i].onlyId === key) {
        this.wl.instanceContent[index].environmentVar.splice(i, 1)
      }
    }
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
      touch1: 1,
      touch2Option: this.touchOptions2[0],
      touch2: 1,
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
  namespaceChange: async function () {
    this.getPersistentvolumeclaims()
    await this.getSecrets()
    await this.getConfigmaps()
    console.log(this.wl.instanceContent)
    this.wl.instanceContent.forEach(item1 => {
      item1.citeCs.forEach(item2 => {
        this.citeCsValue1Change(item2.value1, item2)
        item2.value3 = ''
      })
    })
  },
  citeCsValue1Change: function (event, val) {
    val.value2 = ''
    if (event === 'ConfigMap') {
      val.option2 = this.configMap.items.map(item => {
        return { name: item.metadata.name, option: Object.keys(item.data) }
      })
    }
    if (event === 'Secret') {
      val.option2 = this.secrets.items.map(item => {
        return { name: item.metadata.name, option: Object.keys(item.data) }
      })
    }
  },
  citeCsValue2Change: function (event, val) {
    val.value3 = ''
    let option = val.option2.filter(item => event === item.name)[0].option
    val.option3 = option
  }
}
export default {
  data: function () {
    return {
      nameValidator: [{
        validator: (rule, value, callback) => {
          if (value === '') {
            callback(new Error('Workload名称不能为空'))
          } else if (value.length > 40) {
            callback(new Error('Workload名称不能超过40个字符'))
          } else {
            callback()
          }
        },
        trigger: 'blur',
        required: true
      }], // 名称验证
      labelKeyValidator: [{
        validator: (rule, value, callback) => {
          if (value === '') {
            callback(new Error('Key不能为空'))
          } else {
            callback()
          }
        },
        trigger: 'blur',
        required: true
      }], // 标签验证 key
      labelValueValidator: [{
        validator: (rule, value, callback) => {
          if (value === '') {
            callback(new Error('Value不能为空'))
          } else {
            callback()
          }
        },
        trigger: 'blur',
        required: true
      }], // 标签验证 value
      executionStrategyValidator: [{
        validator: (rule, value, callback) => {
          if (this.wl.type !== 'CronJob') {
            callback()
            return
          }
          if (value === '') {
            callback(new Error('执行策略不能为空'))
          } else {
            callback()
          }
        },
        trigger: 'blur',
        required: true
      }], // 执行策略为空
      instanceContentNameValidator: [{
        validator: (rule, value, callback) => {
          if (value === '') {
            callback(new Error('容器名称不能为空'))
          } else if (value.length > 63) {
            callback(new Error('容器名称不能超过63个字符'))
          } else {
            callback()
          }
        },
        trigger: 'blur',
        required: true
      }], // 实例内容器 名称验证
      instanceContentMirrorImgValidator: [{
        validator: (rule, value, callback) => {
          if (value === '') {
            callback(new Error('镜像不能为空'))
          } else {
            callback()
          }
        },
        trigger: 'blur',
        required: true
      }], // 实例内容器 镜像验证
      jobSettingRepeatValidator: [{
        validator: (rule, value, callback) => {
          if (this.wl.type !== 'CronJob' && this.wl.type !== 'Job') {
            callback()
            return
          }
          if (value === '') {
            callback(new Error('执行次数至少为1'))
          } else {
            callback()
          }
        },
        trigger: 'blur',
        required: true
      }], // Job 重复次数 验证
      jobSettingParallelValidator: [{
        validator: (rule, value, callback) => {
          if (this.wl.type !== 'CronJob' && this.wl.type !== 'Job') {
            callback()
            return
          }
          if (value === '') {
            callback(new Error('Job并行度至少为1'))
          } else {
            callback()
          }
        },
        trigger: 'blur',
        required: true
      }], // Job 并行度 验证
      portMappingConPortValidator: [{
        validator: (rule, value, callback) => {
          if (this.wl.type !== 'Deployment' && this.wl.type !== 'StatefulSet') {
            callback()
            return
          }
          if (value === '') {
            callback(new Error('请输入容器端口'))
          } else {
            callback()
          }
        },
        trigger: 'blur',
        required: true
      }], // 服务 端口映射 端口容器验证
      portMappingServicePortValidator: [{
        validator: (rule, value, callback) => {
          if (this.wl.type !== 'Deployment' && this.wl.type !== 'StatefulSet') {
            callback()
            return
          }
          if (value === '') {
            callback(new Error('请输入服务端口'))
          } else {
            callback()
          }
        },
        trigger: 'blur',
        required: true
      }] // 服务 端口映射 服务端口
    }
  },
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
    axiosUtils: function (res, func) {
      // func()
      if (res.info !== undefined) {
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
        let ErrTips = {}
        let ErrOr = Object.assign(ErrorTips, ErrTips)
        this.$message({
          message: ErrOr[res.Response.Error.Code],
          type: 'error',
          showClose: true,
          duration: 2000
        })
      }
    }
  }
}

import { ErrorTips } from '@/components/ErrorTips.js'

// 实例内容器
let instanceContent = {
  //数据回显添加
  addInstanceContent: function (n1='',n2='',n3='',n4='',n5='',n6='',n7='',n8='',n9='',a1=[],a2=[],t1=false,n10='',n11='',n12='',t2=false,t3=false,t4=false,v,v2,mountPoint) {
    let typeSelect=(val)=>{
        if(val.tcpSocket){
            return "TCP端口检查"
        }else if(val.httpGet){
          return 'HTTP请求检查'
        }else if(val.exec){
          return '执行命令检查'
        }
    }
    let inspectPortSelect=(val)=>{
      if(val.tcpSocket){
        return val.tcpSocket.port
      }else if(val.httpGet){
        return  val.httpGet.port
      }
    }
    let requestPathSelect=(val)=>{
      if(val.httpGet){
        return  val.httpGet.path
      }else{
        return   val.successThreshold
      }
    }
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
        inspectMethodValue: typeSelect(v),
        inspectProtocolOption: ['HTTP', 'HTTPS'], // 检查协议
        inspectProtocolValue: v.httpGet?v.httpGet.scheme:'HTTP',
        executiveOrder: v.exec?v.exec.command[0]:'', // 执行命令
        inspectPort: inspectPortSelect(v)?inspectPortSelect(v):v.inspectPort, // 检查端口
        requestPath: requestPathSelect(v)?requestPathSelect(v):v.requestPath, // 请求路径
        startDelay: v.initialDelaySeconds?v.initialDelaySeconds:v.startDelay, // 启动延时
        responseTimeout: v.timeoutSeconds?v.timeoutSeconds:v.responseTimeout, // 响应超时,
        intervalTime: v.periodSeconds?v.periodSeconds:v.intervalTime, // 间隔时间
        healthyThreshold: 1, // 健康阀值
        unhealthyThreshold: v.failureThreshold?v.failureThreshold:v.unhealthyThreshold // 不健康阀值
      },
      readyToCheckContent: {
        inspectMethodOption: ['TCP端口检查', 'HTTP请求检查', '执行命令检查'], // 检查方法
        inspectMethodValue: typeSelect(v2),
        inspectProtocolOption: ['HTTP', 'HTTPS'], // 检查协议
        inspectProtocolValue:v2.httpGet?v2.httpGet.scheme:'HTTP',
        executiveOrder: v2.exec?v2.exec.command[0]:'', // 执行命令
        inspectPort: inspectPortSelect(v2)?inspectPortSelect(v2):v2.inspectPort,  // 检查端口
        requestPath:requestPathSelect(v2)?requestPathSelect(v2):v2.requestPath , // 请求路径
        startDelay:  v2.initialDelaySeconds?v2.initialDelaySeconds:v2.startDelay, // 启动延时
        responseTimeout:v2.timeoutSeconds?v2.timeoutSeconds:v2.responseTimeout, // 响应超时,
        intervalTime:  v2.periodSeconds?v2.periodSeconds:v2.intervalTime, // 间隔时间
        healthyThreshold: v2.successThreshold?v2.successThreshold:v2.healthyThreshold, // 健康阀值
        unhealthyThreshold: v2.failureThreshold?v2.failureThreshold:v2.unhealthyThreshold // 不健康阀值
      },
      privilegeLevelContainer: t4, // 特权级容器
      completed: false, // 判断是否该验证的都验证完成
      editStatus: true, // 编辑状态
      mountPoint:mountPoint,//挂载点数据
    })
  },
  //默认添加
  addInstanceContent0: function () {
    this.wl.instanceContent.push({
      name: '', // 名称
      mirrorImg: '', // 镜像
      versions: '', // 镜像版本
      mirrorPullTactics: '', // 镜像拉取策略
      requestCpu: '250', // cpu 限制
      limitCpu: '500',
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
      privilegeLevelContainer: false, // 特权级容器
      completed: false, // 判断是否该验证的都验证完成
      editStatus: true ,// 编辑状态
      mountPoint:[],//挂载点数据
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
// 实例内容器-》挂载点
let caseMountPoint={
    addMountPoint(index){
      this.wl.instanceContent[index].mountPoint.push({
        name:'',
        mountPath:'',
        subPath:'',
        readOnly:'false'
      })
    },
    deleteMountPoint(i,i2,name){
      this.wl.instanceContent[i].mountPoint.splice(i2,1);
      if(name!=''){
        console.log(this.firstPointInfoData)
        let index=this.firstPointInfoData.findIndex(item=>{
          return item==name
        })
        this.firstPointInfoData.splice(index,1)
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
  },
  citeCsValue1Change: function (event, val) {
    val.value2 = ''
    if (event === 'ConfigMap') {
      // val.value2='暂无数据'
      val.option2 = this.configMap.items.map(item => {
        return { name: item.metadata.name, option: Object.keys(item.data) }
      })
    }
    if (event === 'Secret') {
      val.option2 = this.secrets.items.map(item => {
        return { name: item.metadata.name, option: Object.keys(item.data) }
      }).splice(0,3)
    }
  },
  citeCsValue2Change: function (event, val) {
    val.value3 = ''
    let option = val.option2.filter(item => event === item.name)[0].option
    val.option3 = option
  }
}


let dataReel={//数据卷
  addDataJuan() { //新增数据卷
    this.dataFlag = true;
    var obj = {
      name1: "useMenu",
      name2: "",
      name3: "",//保存弹窗框中定义的名称
      name4:'',//保存弹出框中的类型
    };
    this.wl.dataJuan.push(obj);
  },
 


}
let dialogMethods={
  addConfigItem(){
    let name='';
    if(this.dataReelDialog.configMap.partKeyOption[0]){
       name=this.dataReelDialog.configMap.partKeyOption[0]
    }else{
      name=''
    }
    this.dataReelDialog.configMap.items.push({
      key:name,
      path:'',
      mode:'0644'
    })
  },
  delConfigItem(index){
    this.dataReelDialog.configMap.items.splice(index,1)
  },
  addSecretItem(){
    let name='';
    if(this.dataReelDialog.Secret.partKeyOption[0]){
       name=this.dataReelDialog.Secret.partKeyOption[0]
    }else{
      name=''
    }
    this.dataReelDialog.Secret.items.push({
      key:name,
      path:'',
      mode:'0644'
    })
  },
  delSecretItem(index){
    this.dataReelDialog.Secret.items.splice(index,1)
  },
}
export default {
  methods: {
    ...label,
    ...instanceContent,
    ...environmentVariable,
    ...citeCs,
    ...touchTactics,
    ...caseMountPoint,
    ...mustCondition,
    ...needCondition,
    ...mustRule,
    ...needRule,
    ...portMapping,
    ...change,
    ...dataReel,
    ...dialogMethods,
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

// // 云监控接口封装
export const ALL_CITY = 'pub/zoneAll' // 区域列表
export const All_MONITOR = 'monitor2/GetMonitorData' // 监控接口

// // 无服务器云函数
//获取函数列表
export const SCF_LIST = 'scf2/ListFunctions' //列表

export const SCF_DEL = 'scf2/DeleteFunction' //删除函数

export const SCF_COPY = 'scf2/CopyFunction' //复制函数

export const NAME_SPACE_LIST = 'scf2/ListNamespaces' //命名空间列表

export const NAME_SPACE_CREAT = 'scf2/CreateNamespace' //创建命名空间

export const NAME_SPACE_UPD = 'scf2/UpdateNamespace' //更新命名空间

export const NAME_SPACE_DEL = 'scf2/DeleteNamespace' //删除命名空间

export const SCF_DETAILS = 'scf2/GetFunction' //获取函数详细信息

export const UPD_CONFIG = 'scf2/UpdateFunctionConfiguration' //更新函数配置

export const PUBLISH_VERSION = 'scf2/PublishVersion' //发布新版本

export const LIST_VERSION = 'scf2/ListVersionByFunction' //查询函数版本

export const DEL_TRIGGER = 'scf2/DeleteTrigger' //	删除触发器

export const ADD_FUNC = 'scf2/CreateFunction'

export const OVER_VIEW = 'scf2/GetFunctionTotalNum'//概览函数数量

export const USER_MONTH_USAGE = 'scf2/GetUserMonthUsage'//概览本月调用数、本月资源量、本月输出量

export const USER_YESTERDAY_USAGE = 'scf2/GetUserYesterdayUsage'//概览昨日用户使用

export const FUN_LOG = 'scf2/GetFunctionLogs' //获取函数运行日志

export const UPD_FUN_CODE = 'scf2/UpdateFunctionCode' //更新函数代码

export const INVOKE = 'scf2/Invoke' //运行函数

export const CREAT_TRIGGER = 'scf2/CreateTrigger' //设置函数触发方式

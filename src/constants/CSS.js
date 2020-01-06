// 断流诊断 列表
export const CUTOUT_LIST = 'live2/DescribeLiveStreamEventList'
//域名列表
export const DOMAIN_LIST = 'live2/DescribeLiveDomains'
//添加域名
export const ADD_DOMAIN = 'live2/AddLiveDomain'
//删除域名
export const DEL_DOMAIN = 'live2/DeleteLiveDomain'
//禁用域名
export const PROHIBIT_DOMAIN = 'live2/ForbidLiveDomain'
//启用域名
export const ENABLE_DOMAIN = 'live2/EnableLiveDomain'
//域名详情
export const DOMAIN_DELTILS = 'live2/DescribeLiveDomain'
//统计分析
//查询直播转码统计信息
export const CSS_CODE = 'live2/DescribeLiveTranscodeDetailInfo'
//查询直播转码统计图表信息
export const CSS_CODECHARTS = 'live2/DescribeLiveTranscodeTotalInfo'
// 查询截图张数
export const CSS_SCREEN = 'live2/DescribeScreenShotSheetNumList'
// 查询并发录制路数
export const CSS_RECORDsTREAM = 'live2/DescribeConcurrentRecordStreamNum'
//直播计费带宽和流量数据查询
export const CSS_MBPS = 'live2/DescribeBillBandwidthAndFluxList'
//查询按省份和运营商分组的播放数据
export const CSS_PLAY = 'live2/DescribeGroupProIspPlayInfoList'
// 查询推流鉴权key
export const FLOWKEY_DELTILS = 'live2/DescribeLivePushAuthKey'
//查询拉流配置
export const FLOW_DELTILS = 'live2/DescribePullStreamConfigs'
//获取回调模板列表
export const CALLBACK_DELTILS = 'live2/DescribeLiveCallbackTemplates'
//获取录制模板列表
export const RECORDING_DELTILS = 'live2/DescribeLiveRecordTemplates'
// 获取直播回调规则列表
export const RULELIST_DELTILS = 'live2/DescribeLiveCallbackRules'
//获取单个回调模板
export const SINGLECALLBACK_DELTILS = 'live2/DescribeLiveCallbackTemplate'
// 获取录制规则列表
export const LIVELIST_DELTILS = 'live2/DescribeLiveRecordRules'
//获取单个录制模板
export const SINGLELIVE_DELTILS = 'live2/DescribeLiveRecordTemplate'
//创建回调规则
export const BACKRULE_DELTILS = 'live2/CreateLiveCallbackRule'
//创建录制规则
export const LIVERULE_DELTILS = 'live2/CreateLiveRecordRule'

/** 功能模板 */
// 增加录制配置模板
export const ADD_RECORDING_CONFIG = 'live2/CreateLiveRecordTemplate'
// 删除录制配置模板
export const DELETE_RECORDING_CONFIG = 'live2/DeleteLiveRecordTemplate'
// 修改录制模板
export const UPDATE_RECORDING_CONFIG = 'live2/ModifyLiveRecordTemplate'
// 创建转码模板
export const ADD_TRANSCODE_TEMPLATE = 'live2/CreateLiveTranscodeTemplate'
// 查詢轉碼模板
export const GET_TRANSCODE_TEMPLATE = 'live2/DescribeLiveTranscodeTemplates'
// 修改轉碼模板
export const UPDATE_TRANSCODE_TEMPLATE = 'live2/ModifyLiveTranscodeTemplate'
// 刪除轉碼模板
export const DELETE_TRANSCODE_TEMPLATE = 'live2/DeleteLiveTranscodeTemplate'


/** 查询实时总带宽 实时总连接数 */
export const LIVE_DESCRIBE_LIVEDOMAINPLAYINFOLIST = 'live2/DescribeLiveDomainPlayInfoList'
/** 查询推流鉴权key */
export const LIVE_DESCRIBELIVE_PUSHAUTHKEY = 'live2/DescribeLivePushAuthKey'
/** 修改推流鉴权key */
export const LIVE_MODIFYLIVEPUSHAUTHKEY = 'live2/ModifyLivePushAuthKey'
/** 获取截图规则列表 */
export const LIVE_DESCRIBE_LIVESNAPSHOTRULES = 'live2/DescribeLiveSnapshotRules'
/** 获取水印规则列表 */
export const LIVE_DESCRIBE_LIVEWATERMARKRULES = 'live2/DescribeLiveWatermarkRules'
/** 获取单个截图模板 */
export const LIVE_DESCRIBE_LIVESNAPSHOTTEMPLATE = 'live2/DescribeLiveSnapshotTemplate'
/** 获取单个水印 */
export const LIVE_DESCRIBE_LIVEWATERMARK = 'live2/DescribeLiveWatermark'
/** 删除回调规则 */
export const LIVE_DELETELIVECALLBACKRULE = 'live2/DeleteLiveCallbackRule'
/** 删除录制规则 */
export const LIVE_DELETELIVERECORDRULE = 'live2/DeleteLiveRecordRule'
/** 获取截图模板列表 */
export const LIVE_DESCRIBE_LIVESNAPSHOTTEMPLATES = 'live2/DescribeLiveSnapshotTemplates'
/** 删除截图规则 */
export const LIVE_DELETELIVESNAPSHOTRULE = 'live2/DeleteLiveSnapshotRule'
/** 创建截图规则 */
export const LIVE_CREATELIVESNAPSHOTRULE = 'live2/CreateLiveSnapshotRule'
/** 查询水印列表 */
export const LIVE_DESCRIBELIVEWATERMARKS = 'live2/DescribeLiveWatermarks'
/** 删除水印规则 */
export const LIVE_DELETELIVEWATERMARKRULE = 'live2/DeleteLiveWatermarkRule'
/** 创建水印规则 */
export const LIVE_CREATELIVEWATERMARKRULE = 'live2/CreateLiveWatermarkRule'

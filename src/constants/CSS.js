/*
 * @Author: your name
 * @Date: 2020-01-06 17:51:24
 * @LastEditTime : 2020-01-11 10:01:42
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /new_product/src/constants/CSS.js
 */
// 断流诊断 列表
export const CUTOUT_LIST = 'live2/DescribeLiveStreamEventList'
// 域名列表
export const DOMAIN_LIST = 'live2/DescribeLiveDomains'
// 添加域名
export const ADD_DOMAIN = 'live2/AddLiveDomain'
// 删除域名
export const DEL_DOMAIN = 'live2/DeleteLiveDomain'
// 禁用域名
export const PROHIBIT_DOMAIN = 'live2/ForbidLiveDomain'
// 启用域名
export const ENABLE_DOMAIN = 'live2/EnableLiveDomain'
// 域名详情
export const DOMAIN_DELTILS = 'live2/DescribeLiveDomain'
//统计分析
// 统计分析运营数据
export const DESCRIBE_PLAY_STAT_INFOLIST = 'live2/DescribePlayStatInfoList'
//查询直播转码统计信息
export const CSS_CODE = 'live2/DescribeLiveTranscodeDetailInfo'
// 查询直播转码统计图表信息
export const CSS_CODECHARTS = 'live2/DescribeLiveTranscodeTotalInfo'
// 查询截图张数
export const CSS_SCREEN = 'live2/DescribeScreenShotSheetNumList'
// 查询并发录制路数
export const CSS_RECORDSTREAM = 'live2/DescribeConcurrentRecordStreamNum'
// 直播计费带宽和流量数据查询
export const CSS_MBPS = 'live2/DescribeBillBandwidthAndFluxList'
// 查询按省份和运营商分组的播放数据
export const CSS_PLAY = 'live2/DescribeGroupProIspPlayInfoList'
// 查询某条流上行推流质量数据
export const CSS_STREAMPUSH = 'live2/DescribeStreamPushInfoList'
// 查询流的播放信息列表
export const CSS_STREAMPLAY = 'live2/DescribeStreamPlayInfoList'
// 查询推流鉴权key
export const FLOWKEY_DELTILS = 'live2/DescribeLivePushAuthKey'
// 查询拉流配置
export const FLOW_DELTILS = 'live2/DescribePullStreamConfigs'
// 获取回调模板列表
export const CALLBACK_DELTILS = 'live2/DescribeLiveCallbackTemplates'
// 获取录制模板列表
export const RECORDING_DELTILS = 'live2/DescribeLiveRecordTemplates'
// 获取直播回调规则列表
export const RULELIST_DELTILS = 'live2/DescribeLiveCallbackRules'
// 获取单个回调模板
export const SINGLECALLBACK_DELTILS = 'live2/DescribeLiveCallbackTemplate'
// 获取录制规则列表
export const LIVELIST_DELTILS = 'live2/DescribeLiveRecordRules'
// 获取单个录制模板
export const SINGLELIVE_DELTILS = 'live2/DescribeLiveRecordTemplate'
// 创建回调规则
export const BACKRULE_DELTILS = 'live2/CreateLiveCallbackRule'
// 创建录制规则
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
// 创建截图鉴黄模板
export const ADD_SNAPSHOT_TEMPLATE = 'live2/CreateLiveSnapshotTemplate'
// 获取截图鉴黄模板
export const GET_SNAPSHOT_TEMPLATE = 'live2/DescribeLiveSnapshotTemplates'
// 修改截图鉴黄模板
export const UPDATE_SNAPSHOT_TEMPLATE = 'live2/ModifyLiveSnapshotTemplate'
// 删除截图鉴黄模板
export const DELETE_SNAPSHOT_TEMPLATE = 'live2/DeleteLiveSnapshotTemplate'
// 创建回调模板
export const ADD_CALLBACK_TEMPLATE = 'live2/CreateLiveCallbackTemplate'
// 获取回调模板列表
export const GET_CALLBACK_TEMPLATES = 'live2/DescribeLiveCallbackTemplates'
// 修改回调模板
export const UPDATE_CALLBACK_TEMPLATES = 'live2/ModifyLiveCallbackTemplate'
// 删除回调模板
export const DELETE_CALLBACK_TEMPLATES = 'live2/DeleteLiveCallbackTemplate'

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
/** 查询历史流 */
export const LIVE_DESCRIBE_LIVESTREAMEVENTLIST = 'live2/DescribeLiveStreamEventList'
/** 查询禁推流 */
export const LIVE_DESCRIBE_LIVEFORBIDSTREAMLIST = 'live2/DescribeLiveForbidStreamList'
/** 查询在线流 */
export const LIVE_DESCRIBE_LIVESTREAMONLINELIST = 'live2/DescribeLiveStreamOnlineList'
/** 禁止直播流 */
export const LIVE_FORBIDLIVESTREAM = 'live2/ForbidLiveStream'
/** 恢复直播流 */
export const LIVE_RESUMELIVESTREAM = 'live2/ResumeLiveStream'
/** 断开直播流 */
export const LIVE_DROPLIVESTREAM = 'live2/DropLiveStream'
/** 查询播放鉴权key */
export const LIVE_DESCRIBE_LIVEPLAYAUTHKEY = 'live2/DescribeLivePlayAuthKey'
/** 删除水印 */
export const LIVE_DELETELIVEWATERMARK = 'live2/DeleteLiveWatermark'
/** 更新水印 */
export const LIVE_UPDATELIVEWATERMARK = 'live2/UpdateLiveWatermark'
/** 添加水印 */
export const LIVE_ADDLIVEWATERMARK = 'live2/AddLiveWatermark'
/** 查询用户套餐包总量、使用量、剩余量、包状态、购买时间和过期时间等 */
export const LIVE_DESCRIBE_LIVEPACKAGEINFO = 'live2/DescribeLivePackageInfo'

/** 日志服务 */
// 批量获取日志服务
export const GET_LOG_DOWNLOAD_LIST = 'live2/DescribeLogDownloadList'
// 获取转码规则列表
export const DESCRIBE_LIVE_TRANSCODE_RULES = 'live2/DescribeLiveTranscodeRules'
// 获取单个转码模板
export const DESCRIBE_LIVE_TRANSCODE_TEMPLATE = 'live2/DescribeLiveTranscodeTemplate'
// 删除转码规则
export const DELETE_LIVE_TRANSCODE_RULE = 'live2/DeleteLiveTranscodeRule'
// 创建转码规则
export const CREATE_LIVE_TRANSCODE_RULE = 'live2/CreateLiveTranscodeRule'
// 修改播放鉴权key
export const MODIFY_LIVE_PLAY_AUTH_KEY = 'live2/ModifyLivePlayAuthKey'
// 获取带宽封顶配置
export const DESCRIBE_LIVE_BAND_LIMIT = 'live2/DescribeLiveBandLimit'
// 获取源站设置
export const DESCRIBE_SOURCE_STREAM_INFO = 'live2/DescribeSourceStreamInfo'
// 获取域名证书信息
export const DESCRIBE_LIVE_DOMAIN_CERT = 'live2/DescribeLiveDomainCert'
// 添加证书
export const CREATE_LIVE_CERT = 'live2/CreateLiveCert'
// 修改域名和证书绑定信息
export const MODIFY_LIVE_DOMAIN_CERT = 'live2/ModifyLiveDomainCert'
// 添加证书
export const MODIFY_LIVE_CERT = 'live2/ModifyLiveCert'
// 修改带宽封顶
export const MODIFY_LIVE_BAND_LIMIT = 'live2/ModifyLiveBandLimit'
// 区域配置
export const MODIFY_LIVE_PLAY_DOMAIN = 'live2/ModifyLivePlayDomain'
// 源站设置
export const MODIFY_SOURCE_STREAM_INFO = 'live2/ModifySourceStreamInfo'

/*
 * @Author: your name
 * @Date: 2020-01-02 11:36:05
 * @LastEditTime : 2020-01-02 16:47:11
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /new_product/src/views/CSS/transcribe/constance/index.js
 */
export const TEMPLATE_TYPE = [{
  // 名称
  TemplateName: 'HLS',
  paramName: 'HlsParam',
},
{
  TemplateName: 'MP4',
  paramName: 'Mp4Param',
},
{
  TemplateName: 'FLV',
  paramName: 'FlvParam',
},
{
  TemplateName: 'AAC',
  paramName: 'AacParam',

}]

export const TEMPLATE_TYPE_PARAMS = {
  HlsParam: {
    // 录制间隔。单位秒
    RecordInterval: 1800,
    // 录制存储时长。 0表示永久存储。
    StorageTime: 0,
    // 是否开启当前格式录制，0 否 1是。默认值0。
    Enable: 0,
  },
  // HLS专属录制参数。 续录超时时长(秒)
  Mp4Param: {
    RecordInterval: 1800,
    StorageTime: 0,
    Enable: 0,
  },
  FlvParam: {
    RecordInterval: 1800,
    StorageTime: 0,
    Enable: 0,
  },
  AacParam: {
    RecordInterval: 1800,
    StorageTime: 0,
    Enable: 0,
  },
  HlsSpecialParam: {
    FlowContinueDuration: 0
  }
}
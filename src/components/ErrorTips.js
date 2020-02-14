let ErrorTips = {
  'AuthFailure.InvalidSecretId': '密钥非法（不是云 API 密钥类型',
  'AuthFailure.MFAFailure': 'MFA 错误',
  'AuthFailure.SecretIdNotFound': '密钥不存在',
  'AuthFailure.SignatureExpire': '签名过期',
  'AuthFailure.SignatureFailure': '签名错误',
  'AuthFailure.TokenFailure': 'token 错误',
  'AuthFailure.UnauthorizedOperation': '请求未 CAM 授权',
  'DryRunOperation': 'DryRun 操作，代表请求将会是成功的，只是多传了 DryRun 参数',
  'FailedOperation': '操作失败',
  'InternalError': '内部错误',
  'InvalidAction': '接口不存在',
  'InvalidParameter': '参数错误',
  'InvalidParameterValue': '参数取值错误/无效的参数值',
  'LimitExceeded': '超过配额限制',
  'MissingParameter': '缺少参数错误',
  'NoSuchVersion': '接口版本不存在',
  'RequestLimitExceeded': '请求的次数超过了频率限制',
  'ResourceInUse': '资源被占用',
  'ResourceInsufficient': '资源不足',
  'ResourceNotFound': '资源不存在',
  'ResourceUnavailable': '资源不可用',
  'UnauthorizedOperation': '未授权操作',
  'UnknownParameter': '未知参数错误',
  'UnsupportedOperation': '操作不支持',
  'UnsupportedProtocol': 'HTTPS 请求方法错误，只支持 GET 和 POST 请求',
  'UnsupportedRegion': '接口不支持所传地域',
  'InvalidParameterValue.Malformed': '參數值是無效的,请输入正确的参数值',
  'InvalidIpFormat': '格式无效'
}
export {
  ErrorTips
}
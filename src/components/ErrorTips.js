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
  'InvalidIpFormat': '格式无效',
  'FailedOperation.DeleteDomainInLockedTime': '2 天内有产生流量， 域名处于锁定期间， 2 天内无流量产生才允许删除域名。',
  'InternalError.ChineseCharacterDetected': '暂不支持添加中文域名， 请核对域名格式。',
  'InternalError.ConnectDbError': ' DB连接错误。',
  'InternalError.DBError': 'DB执行错误',
  'InternalError.DomainAlreadyExist': ' 该域名已在其他处接入， 请检查域名是否输入正确。 如域名正确， 您可通过验证后重新添加域名。',
  'InternalError.DomainFormatError': ' 域名格式错误， 请输入合法格式域名。',
  'InternalError.DomainGslbFail': ' 添加GSLB规则失败。',
  'InternalError.DomainIsFamous': '该域名已在其他处接入， 请检查域名是否输入正确。 如域名正确， 您可通过验证后重新添加域名。',
  'InternalError.DomainIsLimited': '您的域名不可用， 请输入正确的域名。',
  'InternalError.DomainNoRecord': ' 域名没有备案。',
  'InternalError.DomainTooLong': '域名长度超过限制。',
  'InternalError.InvalidInput': '参数检校不通过。',
  'InternalError.InvalidUser': ' 账号信息错误。',
  'InvalidParameter.DomainFormatError': ' 域名格式错误， 请输入合法格式域名。',
  'InvalidParameter.DomainIsLimited': '域名受限， 请联系一线同学申请解除限制。',
  'ResourceNotFound.DomainNoRecord': '域名没有备案。',
  'ResourceNotFound.StopService': '账号停服， 请先冲正开通服务后再操作',
  'InternalError.PushDomainNoRecord': ' 推流域名不存在'

}
export {
  ErrorTips
}

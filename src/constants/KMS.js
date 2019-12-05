//  用户秘钥
export const KMS_LIST = 'kms2/ListKeyDetail' // 获取主密钥列表详情
export const NEW_KMS = 'kms2/CreateKey' //新建密钥
export const Des_KMS = 'kms2/DescribeKey' //获取主密钥详情
export const UP_NAME = 'kms2/UpdateAlias' //修改密钥名称
export const UP_DESC = 'kms2/UpdateKeyDescription' //修改密钥描述
export const Encrypt = 'kms2/Encrypt'  //明文执行
export const Decrypt = 'kms2/Decrypt'  //密文执行
export const GET_CMK = 'kms2/GetParametersForImport' //获取导入主密钥（CMK）材料的参数
export const ImportKey = 'kms2/ImportKeyMaterial'  //导入密钥
export const EnableKey = 'kms2/EnableKey'  //启动密钥
export const DisableKey = 'kms2/DisableKey'  //禁用密钥
export const END_KMS = 'kms2/EnableKeyRotation' //启动密钥轮换
export const DIS_KMS = 'kms2/DisableKeyRotation' //禁用密钥轮换
export const SCH_KMS = 'kms2/ScheduleKeyDeletion' //计划删除密钥
export const CEL_KMS = 'kms2/CancelKeyDeletion' //取消删除密钥
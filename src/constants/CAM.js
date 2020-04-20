//用户列表
export const CREATE_POLICY = 'cam2/CreatePolicy'
export const USER_LIST = 'cam2/ListUsers'
export const LIST_SUBACCOUNTS = 'cam2/ListSubAccounts'
export const POLICY_LIST = 'cam2/ListPolicies'
export const USER_GROUP = 'cam2/ListGroups'
export const DELETE_USER = 'cam2/DeleteUser'
export const QUERY_USER = 'cam2/GetUser'
export const POLICY_USER = 'cam2/AttachUserPolicy'
export const BATCH_OPERATE_CAM_STRATEGY = 'cam2/BatchOperateCamStrategy'
export const ADD_USER = 'cam2/AddUser'
export const REMOVEBIND_USER = 'cam2/DetachUserPolicy'
export const REMOVEGROUP_USER = 'cam2/DeleteGroup'
export const UPDATA_USER = 'cam2/UpdateUser'
export const RELATE_USER = 'cam2/ListGroupsForUser'
export const QUERY_POLICY = 'cam2/ListAttachedUserPolicies'
export const QUERY_USER_ALLPOLICY = 'cam2/ListAttachedUserAllPolicies'
export const CREATE_USER = 'cam2/CreateGroup'
export const ADD_USERTOGROUP = 'cam2/AddUserToGroup'
export const DEL_USERTOGROUP = 'cam2/RemoveUserFromGroup'
export const GROUP_POLICY = 'cam2/ListAttachedGroupPolicies'
export const CREATE_SAML = 'cam2/CreateSAMLProvider'
export const GET_SAML = 'cam2/GetSAMLProvider'
export const GROUP_USERS = 'cam2/ListUsersForGroup'
export const DELE_GROUP = 'cam2/DeleteGroup'
export const ADD_GROUPTOLIST = 'cam2/AddUserToGroup'
export const LIST_PROVIDERS = 'cam2/ListSAMLProviders'
export const ATTACH_GROUP = 'cam2/AttachGroupPolicy'
export const COPY_USER_POLICY = 'cam2/CopyUserPolicy'
export const GET_GROUP = 'cam2/GetGroup'
export const UPDATA_GROUP = 'cam2/UpdateGroup'
export const DETACH_POLICY = 'cam2/DetachGroupPolicy'
export const MODIFY_SUBSCRIPTION = 'message/ModifyMsgTypeOnReceiver'
export const GET_ALL_SUBSCRIPTION_TYPE = 'message/GetReceiversOnAllType'

//策略
export const LIST_ENPOLICY = 'cam2/ListEntitiesForPolicy'
export const DELETE_POLICY = 'cam2/DeletePolicy'
export const GET_POLICY = 'cam2/GetPolicy'
export const UPDATE_POLICY = 'cam2/UpdatePolicy'
export const UPDATE_POLICY_V2 = 'cam/UpdatePolicy'
export const GET_SERVICE_API_LIST = "cam/getServiceApiList"

//角色
export const GET_ROLE = 'cam2/GetRole'

export const LIST_ATTACHE = 'cam/ListAttachedRolePolicies'
export const DEACH_ROLE = 'cam2/DetachRolePolicy'
export const UPDATE_ROLE = 'cam2/UpdateRoleDescription'
export const UPDATE_ASSUME = 'cam2/UpdateAssumeRolePolicy'
export const DESCRIB_ROLE = 'cam2/DescribeRoleList'
export const DELETE_ROLE = 'cam2/DeleteRole'
export const CREATE_ROLE = 'cam2/CreateRole'
export const ATTACH_ROLE = 'cam2/AttachRolePolicy'
export const GET_PRINCIPAL_SERVICE = 'cam2/GetPrincipalService'

export const CHECK_SAML_METADATA = 'cam2/CheckSAMLMetadata'
export const DELETE_SAML_PROVIDER = 'cam2/DeleteSAMLProvider'
export const GET_SAML_PROVIDER = 'cam2/GetSAMLProvider'
export const UPDATE_SAML_PROVIDER = 'cam2/UpdateSAMLProvider'
export const DESCRIBE_ATTACHED_ENTITY_POLICIES = 'cam2/DescribeAttachedEntityPolicies'
export const SEND_AUTH_CODE = 'account2/SendAuthCode'
export const DETACH_ROLE_POLICIES = 'cam2/DetachRolePolicies'
export const ATTACH_GROUP_POLICIES = 'cam2/AttachGroupPolicies'
export const ATTACH_ROLE_POLICIES = 'cam2/AttachRolePolicies'
export const DETACH_GROUPS_POLICY = 'cam2/DetachGroupsPolicy'
export const DETACH_USERS_POLICY = 'cam2/DetachUsersPolicy'
export const ATTACH_GROUPS_POLICY = 'cam2/AttachGroupsPolicy'
export const ATTACH_USERS_POLICY = 'cam2/AttachUsersPolicy'

// V2接口
export const LOGOUT_ROLE_SESSIONS = 'cam/LogoutRoleSessions'
export const LIST_GROUPS_V2 = 'cam/ListGroups'
export const UPDATE_ROLE_CONSOLE_LOGIN = 'cam/UpdateRoleConsoleLogin'

export const APIKEY = 'taifucloud/account-sub/manage/info/'

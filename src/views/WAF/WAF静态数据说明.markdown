WAF静态数据说明

###WAF静态数据说明V0.9.2
###套餐信息
####1.版本描述
**(1)高级版**
适用于中小非业务网站的标准防护，基于AI + 规则引擎；
支持常见的Web攻击防护，包括SQL注入、XSS、Webshell上传、目录遍历等；
云端自动更新Web 0day漏洞的防护规则；
支持HTTP(80、8080端口)、HTTPS(443、8443端口)的业务防护；
支持高级CC攻击防护，过滤垃圾访问；
支持按地域细粒度封禁；
正常业务请求QPS：2500；
CC防护峰值QPS：30000；
支持一级域名个数：2；
支持二级域名个数：20；
更多套餐详情点此查看

**(2)企业版**
适用于中小型普通业务站点及中大型官网站点定制化防护服务，基于AI + 规则引擎；
包含高级版所有功能；
支持链路劫持检测（5个）；
支持高级BOT行为管理；
支持非标准端口（不限于80,8080,443，8443）定制（10个）；
支持HTTP协议级别自定义规则；
独享IP防护；
支持防御规则优化专家服务；
支持1对1售前售后支持；
正常业务请求QPS：5000；
CC防护峰值QPS：150000；
支持一级域名个数：3；
支持二级域名个数：30；
更多套餐详情点此查看

**（3）旗舰版**
适用于大型及超大型业务网站及复杂业务站点的定制化防护服务，基于AI + 规则引擎；
包含企业版所有功能；
支持链路劫持检测（10个）；
支持高级BOT行为管理；
支持非标准端口（不限于80,8080,443，8443）定制（20个）；
支持泛域名定制；
独享IP防护；
支持1对1售前售后支持；
正常业务请求QPS：10000；
CC防护峰值QPS：500000；
支持一级域名个数：4；
支持二级域名个数：40；
更多套餐详情点此查看
####2版本配置说明
```
export const PACKAGE_CFG_TYPES = {
    base: {
        key: "wsm_package_base",
        goodstype: "wsm_waf",
        name: "基础版", index: 0,
        mainCount: 1, subCount: 10,
        first_categoryid: 100215, categoryid: 100216, edit_categoryid: 100217,
        pid: 11416,
        busQps: 2500,
        CCQps: 30000
    },
    standard: {
        key: "wsm_package_standard",
        goodstype: "wsm_waf",
        name: "标准版", index: 1,
        mainCount: 1, subCount: 10,
        first_categoryid: 100215, categoryid: 100216, edit_categoryid: 100217,
        pid: 11416,
        busQps: 2500,
        CCQps: 30000
    },
    premium: {
        key: "wsm_package_premium",
        goodstype: "wsm_waf",
        name: "高级版", index: 2,
        mainCount: 2, subCount: 20,
        first_categoryid: 100215, categoryid: 100216, edit_categoryid: 100217,
        pid: 11416,
        busQps: 2500,
        CCQps: 30000
    },
    enterprise: {
        key: "wsm_package_enterprise",
        goodstype: "wsm_waf",
        name: "企业版", index: 3,
        mainCount: 3, subCount: 30,
        first_categoryid: 100215, categoryid: 100216, edit_categoryid: 100217,
        pid: 11416,
        busQps: 5000,
        CCQps: 150000
    },
    ultimate: {
        key: "wsm_package_ultimate",
        goodstype: "wsm_waf",
        name: "旗舰版", index: 4,
        mainCount: 4, subCount: 40,
        first_categoryid: 100215, categoryid: 100216, edit_categoryid: 100217,
        pid: 11416,
        busQps: 10000,
        CCQps: 500000
    }
}

export const BUY_LOG_TYPES = {
    goodstype: "sp_wsm_waf_scls",
    pricetype: "sv_wsm_waf_scls",
    first_categoryid: 101037, categoryid: 101038, edit_categoryid: 101039,
    pid: 1000483
}

export const BUY_QPS_TYPES = {
    goodstype: "sp_wsm_waf_qps_ep",
    pricetype: "sv_wsm_waf_qps_ep",
    first_categoryid: 101040, categoryid: 101041, edit_categoryid: 101042,
    pid: 1000481
}

export const CLB_BUY_QPS_TYPES = {
    goodstype: "sp_wsm_waf_qpsep_clb",
    pricetype: "sv_wsm_waf_qps_ep_clb",
    first_categoryid: 101210, categoryid: 101211, edit_categoryid: 101212,
    pid: 1001160
}

export const CLB_BUY_LOG_TYPES = {
    goodstype: "sp_wsm_waf_scls_clb",
    pricetype: "sv_wsm_waf_scls_clb",
    first_categoryid: 101213, categoryid: 101214, edit_categoryid: 101215,
    pid: 1001158
}

export const CLB_BUY_DOMAIN_TYPES = {
    goodstype: "sp_wsm_waf_domain_clb",
    pricetype: "sv_wsm_waf_domain_clb",
    first_categoryid: 101207, categoryid: 101208, edit_categoryid: 101209,
    pid: 1001156
}

export const CLB_PACKAGE_CFG_TYPES = {
    enterprise: {
        key: "sp_wsm_waf_enterprise_clb",
        pricetype: "sv_wsm_waf_package_enterprise_clb",
        first_categoryid: 101204, categoryid: 101205, edit_categoryid: 101206,
        pid: 1001152,
        name: "企业版", index: 3,
        mainCount: 3, subCount: 30,
        busQps: 5000,
        CCQps: 150000
    },
    ultimate: {
        key: "sp_wsm_waf_ultimate_clb",
        pricetype: "sv_wsm_waf_package_ultimate_clb",
        first_categoryid: 101201, categoryid: 101202, edit_categoryid: 101203,
        pid: 1001154,
        name: "旗舰版", index: 4,
        mainCount: 4, subCount: 40,
        busQps: 10000,
        CCQps: 500000
    },
    premium: {
        key: "sp_wsm_waf_premium_clb",
        pricetype: "sv_wsm_waf_package_premium_clb",
        first_categoryid: 101198, categoryid: 101199, edit_categoryid: 101200,
        pid: 1001150,
        name: "高级版", index: 2,
        mainCount: 2, subCount: 20,
        busQps: 2500,
        CCQps: 30000
    }
}

export const BUY_TIMES = [
    { value: 1, label: "1个月" },
    { value: 2, label: "2个月" },
    { value: 3, label: "3个月" },
    { value: 6, label: "6个月" },
    { value: 12, label: "1年" },
    { value: 24, label: "2年" },
    { value: 36, label: "3年" }
];
```
####3.询价逻辑说明
1.新购（买日志包，QPS包等等）
比如第一次购买日志包：商品goodsCategoryId取值 ***first_categoryid***，具体参数如下：
```
 const { defalutCount, resourceId, deadLine, isNew, counts } = this.state;
        const { pid, goodstype, first_categoryid, edit_categoryid, pricetype } = BUY_LOG_TYPES;
        let data: any;
data = {
                goodsCategoryId: first_categoryid,
                regionId: 1,
                projectId: 0,
                goodsNum: 1,
                payMode: 1,
                platform: 1,
                goodsDetail: {
                    pid,
                    timeSpan: getDays(deadLine),
                    timeUnit: "d",
                    [pricetype]: counts,
                    type: goodstype
                }
            };
            
            WebAPI.fetchUpgradePrice([data]).then(data => {
            this.setState({ realTotalCost: data[0].realTotalCost, priceLoading: false });
        }).catch(res => {
            tips.error("询价失败，请联系腾讯云安全售后服务人员");
        });
```
2.变配（包括日志包从3个变成5个，版本从高级版升级到旗舰版等等）
商品goodsCategoryId取值 ***edit_categoryid***，具体参数如下：
```
 data = {
                goodsCategoryId: edit_categoryid,
                regionId: 1,
                projectId: 0,
                goodsNum: 1,
                payMode: 1,
                platform: 1,
                goodsDetail: {
                    resourceId,
                    curDeadline: deadLine,
                    oldConfig: {
                        pid,
                        [pricetype]: defalutCount,
                        type: goodstype
                    },
                    newConfig: {
                        pid,
                        [pricetype]: defalutCount + counts,
                        type: goodstype
                    }
                }
            };
            
              WebAPI.fetchUpgradePrice([data]).then(data => {
            this.setState({ realTotalCost: data[0].realTotalCost, priceLoading: false });
        }).catch(res => {
            tips.error("询价失败，请联系腾讯云安全售后服务人员");
        });
```
3.续费
需要注意的是： 续费一般 主套餐 + 子产品（如果有的话）
商品goodsCategoryId取值 ***categoryid***
```
 let { type, timeSpan, domainCount, qpsCount, clsCount } = this.state;
        let { categoryid, goodstype, pid, pricetype } = CLB_PACKAGE_CFG_TYPES[type];
        const array: any[] = [{
            goodsCategoryId: categoryid, //续费计费代码
            regionId: 1,
            projectId: 0,
            goodsNum: 1,
            payMode: 1,
            platform: 1,
            goodsDetail: {
                timeSpan,
                timeUnit: "m",
                type: goodstype,
                pid,
                [pricetype]: 1

            }
        }];
```

###攻击日志
```
//加入”|“是为了规避 被工具翻译成英文了，导致传参为英文
export const ATTACK_TYPE = [
    { id: "全部|攻击类型", label: "全部攻击类型" },
    { id: "SQL|注入攻击", label: "SQL注入攻击" },
    { id: "XSS|攻击", label: "XSS攻击" },
    { id: "命令注入|攻击", label: "命令注入攻击" },
    { id: "LDAP注入|攻击", label: "LDAP注入攻击" },
    { id: "SSI注入|攻击", label: "SSI注入攻击" },
    { id: "XML注入|攻击", label: "XML注入攻击" },
    { id: "WEB服务器漏洞|攻击", label: "WEB服务器漏洞攻击" },
    { id: "WEB应用漏洞|攻击", label: "WEB应用漏洞攻击" },
    { id: "路径跨越|攻击", label: "路径跨越攻击" },
    { id: "核心文件|非法访问", label: "核心文件非法访问" },
    { id: "文件上传|攻击", label: "文件上传攻击" },
    { id: "木马后门|攻击", label: "木马后门攻击" },
    { id: "CSRF|攻击", label: "CSRF攻击" },
    { id: "恶意|扫描", label: "恶意扫描" },
    { id: "自定义|策略", label: "自定义策略" },
    { id: "地域封禁|拦截", label: "地域封禁拦截" },
    { id: "信息防泄漏|替换", label: "信息防泄漏替换" },
    { id: "AI引擎|检出", label: "AI引擎检出" },
    { id: "IP黑名|单", label: "IP黑名单" },
    { id: "CC策略|拦截", label: "CC策略拦截" },
    { id: "Bot |拦截", label: "Bot 拦截" },
];
```

###BOT
####BOT自定义策略-协议特征
静态数据列表 和 后端数据merge(根据name字段)
```
export const UCB_UA_TYPE: IBOTUCBProtoclItem[] = [{
    id: "ua",
    name: "User-Agent类别",
    timestamp: 0,
    action: "",
    isOpen: true,
    type: "",
    visible: true
}];


export const UCB_HTTP_HEADERS_TYPE: IBOTUCBProtoclItem[] = [{
    id: "headers",
    name: "HTTP头部",
    timestamp: 0,
    action: "",
    isOpen: true,
    type: "",
    visible: true
}];

export const UCB_HTTP_PROTOCLS_TYPE: IBOTUCBProtoclItem[] = [{
    id: "http",
    name: "HTTP协议特征",
    timestamp: 0,
    action: "",
    isOpen: true,
    type: "",
    visible: true
}];


export const UCB_UA_PROTOCLS: IBOTUCBProtoclItem[] = [
    {

        id: "ua_exist",
        type: "ua",
        name: "User-Agent为空或不存在",
        desc: "预设",
        rule_type: 1,
        addition_arg: "none",
        action: "monitor",
        rule: [
            {
                key: "ua_exist",
                op: "logic",
                value: false
            }
        ],
        on_off: "off",
        valid_time: 0,
        timestamp: 0,
        visible: true
    },
    {
        id: "ua_type_bot",
        type: "ua",
        action: "monitor",
        addition_arg: "none",
        desc: "预设",
        name: "User-Agent类型为BOT",
        on_off: "off",
        rule: [{
            key: "ua_type",
            op: "belong",
            value: [
                "bot"
            ]
        }],
        rule_type: 1,
        timestamp: 0,
        valid_time: 0,
        visible: true
    },
    {
        id: "ua_type_http",
        type: "ua",
        name: "User-Agent类型为HTTP Library",
        action: "monitor",
        addition_arg: "none",
        desc: "预设",
        domain: "test.com",
        rule: [
            {
                "key": "ua_type",
                "op": "belong",
                "value": [
                    "http library"
                ]
            }
        ],
        on_off: "off",
        rule_type: 1,
        timestamp: 0,
        valid_time: 0,
        visible: true
    },
    {
        id: "ua_type_framework",
        type: "ua",
        name: "User-Agent类型为Framework",
        desc: "预设",
        rule_type: 1,
        addition_arg: "none",
        action: "monitor",
        rule: [
            {
                key: "ua_type",
                op: "belong",
                value: [
                    "framework"
                ]
            }
        ],
        on_off: "off",
        valid_time: 0,
        timestamp: 0,
        visible: true
    },
    {
        id: "ua_type_tools",
        type: "ua",
        name: "User-Agent类型为Tools",
        desc: "预设",
        rule_type: 1,
        addition_arg: "none",
        action: "monitor",
        rule: [
            {
                key: "ua_type",
                op: "belong",
                value: [
                    "tools"
                ]
            }
        ],
        on_off: "off",
        valid_time: 0,
        timestamp: 0,
        visible: true
    },
    {
        id: "ua_type_bot-unknown",
        type: "ua",
        name: "User-Agent类型为Unkonwn BOT",
        desc: "预设",
        rule_type: 1,
        addition_arg: "none",
        action: "monitor",
        rule: [
            {
                key: "ua_type",
                op: "belong",
                value: [
                    "bot-unknown"
                ]
            }
        ],
        on_off: "off",
        valid_time: 0,
        timestamp: 0,
        visible: true
    },
    {
        id: "ua_type_scanner",
        type: "ua",
        name: "User-Agent类型为Scanner",
        desc: "预设",
        rule_type: 1,
        addition_arg: "none",
        action: "monitor",
        rule: [
            {
                "key": "ua_type",
                "op": "belong",
                "value": [
                    "scanner"
                ]
            }
        ],
        on_off: "off",
        valid_time: 0,
        timestamp: 0,
        visible: true
    }
];

export const UCB_HTTP_PROTOCLS: IBOTUCBProtoclItem[] = [{
    id: "method",
    type: "http",
    name: "使用HTTP HEAD方法",
    desc: "预设",
    rule_type: 1,
    addition_arg: "none",
    action: "monitor",
    rule: [
        {
            key: "method",
            op: "proportion",
            op_arg: ["HEAD"],
            op_op: ">",
            op_value: 0
        }
    ],
    on_off: "off",
    valid_time: 0,
    timestamp: 0,
    visible: true
}, {
    id: "protocal",
    type: "http",
    name: "HTTP协议为1.0或者更低",
    desc: "预设",
    rule_type: 1,
    addition_arg: "none",
    action: "monitor",
    rule: [
        {
            key: "protocal",
            op: "proportion",
            op_arg: ["1.0", "0.9"],
            op_op: ">",
            op_value: 0.5
        }
    ],
    on_off: "off",
    valid_time: 0,
    timestamp: 0,
    visible: true
}];


export const UCB_HEADERS_PROTOCLS: IBOTUCBProtoclItem[] = [
    {
        id: "referer_exist",
        type: "headers",
        name: "Referer空或不存在",
        desc: "预设",
        rule_type: 1,
        addition_arg: "none",
        action: "monitor",
        rule: [
            {
                "key": "referer_exist",
                "op": "logic",
                "value": false
            }
        ],
        on_off: "off",
        valid_time: 0,
        timestamp: 0,
        visible: true
    }, {
        id: "refer_kind_nums",
        type: "headers",
        name: "Referer滥用(多个UA使用相同Referer)",
        desc: "预设",
        rule_type: 1,
        addition_arg: "none",
        action: "monitor",
        rule: [
            {
                key: "ua_kind_nums",
                op: ">",
                value: 10
            },
            {
                key: "refer_kind_nums",
                op: "=",
                value: 1
            }
        ],
        on_off: "off",
        valid_time: 0,
        timestamp: 0,
        visible: true
    }, {
        id: "ua_kind_nums",
        type: "headers",
        name: "Cookie滥用(多个UA使用相同Cookie)",
        desc: "预设",
        rule_type: 1,
        addition_arg: "none",
        action: "monitor",
        rule: [
            {
                key: "ua_kind_nums",
                op: ">",
                value: 10
            },
            {
                key: "cookie_kind_nums",
                op: "=",
                value: 1
            }
        ],
        on_off: "off",
        valid_time: 0,
        timestamp: 0,
        visible: true
    }, {
        id: "cookie_exist",
        type: "headers",
        name: "Cookie空或不存在",
        desc: "预设",
        rule_type: 1,
        addition_arg: "none",
        action: "monitor",
        rule: [
            {
                key: "cookie_exist",
                op: "logic",
                value: false
            }
        ],
        on_off: "off",
        valid_time: 0,
        timestamp: 0,
        visible: true
    }, {
        id: "connection_exist",
        type: "headers",
        name: "Connection空或不存在",
        desc: "预设",
        rule_type: 1,
        addition_arg: "none",
        action: "monitor",
        rule: [
            {
                key: "connection_exist",
                op: "logic",
                value: false
            }
        ],
        on_off: "off",
        valid_time: 0,
        timestamp: 0,
        visible: true
    }, {
        id: "accept_exist",
        type: "headers",
        name: "Accept空或不存在",
        desc: "预设",
        rule_type: 1,
        addition_arg: "none",
        action: "monitor",
        rule: [
            {
                key: "accept_exist",
                op: "logic",
                value: false
            }
        ],
        on_off: "off",
        valid_time: 0,
        timestamp: 0,
        visible: true
    },
    {
        id: "accept_language_exist",
        type: "headers",
        name: "Accept-Language空或不存在",
        desc: "预设",
        rule_type: 1,
        addition_arg: "none",
        action: "monitor",
        rule: [
            {
                key: "accept_language_exist",
                op: "logic",
                value: false
            }
        ],
        on_off: "off",
        valid_time: 0,
        timestamp: 0,
        visible: true
    },
    {
        id: "accept_encoding_exist",
        type: "headers",
        name: "Accept-Enconding空或不存在",
        desc: "预设",
        rule_type: 1,
        addition_arg: "none",
        action: "monitor",
        rule: [
            {
                key: "accept_encoding_exist",
                op: "logic",
                value: false
            }
        ],
        on_off: "off",
        valid_time: 0,
        timestamp: 0,
        visible: true
    }
];

export const UCB_PROTOCLS = UCB_UA_TYPE.concat(UCB_UA_PROTOCLS).concat(UCB_HTTP_HEADERS_TYPE).concat(UCB_HEADERS_PROTOCLS).concat(UCB_HTTP_PROTOCLS_TYPE).concat(UCB_HTTP_PROTOCLS);

```

####BOT自定义策略-IP情报特征
静态数据列表 和 后端数据merge(根据name字段)
```
export const UCB_IPS = [{
    id: "boce",
    name: "拨测",
    timestamp: 0,
    action: "",
    isOpen: true,
    type: "",
    visible: true
}, {
    name: "腾讯云WAF拨测",
    type: "boce",
    desc: "预设",
    rule_type: 2,
    addition_arg: "none",
    action: "monitor",
    rule: [
        {
            key: "ip_scope",
            op: "belong",
            value: []
        }
    ],
    on_off: "off",
    valid_time: 0,
    timestamp: 0,
    visible: true
}, {
    id: "idc",
    name: "IDC-IP库",
    timestamp: 0,
    action: "monitor",
    isOpen: true,
    type: "",
    visible: true
},
{
    name: "IDC-IP 腾讯云",
    desc: "预设",
    type: "idc",
    rule_type: 2,
    addition_arg: "none",
    action: "monitor",

    rule: [
        {
            "key": "ip_type",
            "op": "contains",
            "value": "idc"
        },
        {
            "key": "ip_owner",
            "op": "contains",
            "value": "tencent.com"
        }
    ],
    on_off: "off",
    valid_time: 0,
    timestamp: 0,
    visible: true
},
{
    name: "IDC-IP 阿里云",
    desc: "预设",
    type: "idc",
    rule_type: 2,
    addition_arg: "none",
    action: "monitor",
    rule: [
        {
            key: "ip_type",
            op: "contains",
            value: "idc"
        },
        {
            key: "ip_owner",
            op: "contains",
            value: "阿里云"
        }
    ],
    on_off: "off",
    valid_time: 0,
    timestamp: 0,
    visible: true
},
{
    name: "IDC-IP 华为云",
    desc: "预设",
    type: "idc",
    rule_type: 2,
    addition_arg: "none",
    action: "monitor",

    rule: [
        {
            key: "ip_type",
            op: "contains",
            value: "idc"
        },
        {
            key: "ip_owner",
            op: "contains",
            value: "huawei.com"
        }
    ],
    on_off: "off",
    valid_time: 0,
    timestamp: 0,
    visible: true
},
{
    name: "IDC-IP 金山云",
    desc: "预设",
    type: "idc",
    rule_type: 2,
    addition_arg: "none",
    action: "monitor",

    rule: [
        {
            key: "ip_type",
            op: "contains",
            value: "idc"
        },
        {
            key: "ip_owner",
            op: "contains",
            value: "ksyun.com"
        }
    ],
    on_off: "off",
    valid_time: 0,
    timestamp: 0,
    visible: true
}, {
    name: "IDC-IP UCloud",
    desc: "预设",
    type: "idc",
    rule_type: 2,
    addition_arg: "none",
    action: "monitor",
    rule: [
        {
            key: "ip_type",
            op: "contains",
            value: "idc"
        },
        {
            key: "ip_owner",
            op: "contains",
            value: "ucloud.cn"
        }
    ],
    on_off: "off",
    valid_time: 0,
    timestamp: 0,
    visible: true
},
{
    name: "IDC-IP 百度云",
    desc: "预设",
    type: "idc",
    rule_type: 2,
    addition_arg: "none",
    action: "monitor",

    rule: [
        {
            key: "ip_type",
            op: "contains",
            value: "idc"
        },
        {
            key: "ip_owner",
            op: "contains",
            value: "baidu.com"

        }
    ],
    on_off: "off",
    valid_time: 0,
    timestamp: 0,
    visible: true
},

{
    name: "IDC-IP 京东云",
    desc: "预设",
    type: "idc",
    rule_type: 2,
    addition_arg: "none",
    action: "monitor",
    rule: [
        {
            key: "ip_type",
            op: "contains",
            value: "idc"
        },
        {
            key: "ip_owner",
            op: "contains",
            value: "pubyun.com"
        }
    ],
    on_off: "off",
    valid_time: 0,
    timestamp: 0,
    visible: true
},
{
    name: "IDC-IP 青云",
    desc: "预设",
    type: "idc",
    rule_type: 2,
    addition_arg: "none",
    action: "monitor",

    rule: [
        {
            key: "ip_type",
            op: "contains",
            value: "idc"
        },
        {
            key: "ip_owner",
            op: "contains",
            value: "qingcloud.com"
        }
    ],
    on_off: "off",
    valid_time: 0,
    timestamp: 0,
    visible: true
},
{
    name: "IDC-IP Aws",
    type: "idc",
    desc: "预设",
    rule_type: 2,
    addition_arg: "none",
    action: "monitor",
    rule: [
        {
            key: "ip_type",
            op: "contains",
            value: "idc"
        },
        {
            key: "ip_owner",
            op: "contains",
            value: "amazon.com"
        }
    ],
    on_off: "off",
    valid_time: 0,
    timestamp: 0,
    visible: true
},
{
    name: "IDC-IP Azure",
    desc: "预设",
    type: "idc",
    rule_type: 2,
    addition_arg: "none",
    action: "monitor",

    rule: [
        {
            key: "ip_type",
            op: "contains",
            value: "idc"
        },
        {
            key: "ip_owner",
            op: "contains",
            value: "microsoft.com"
        }
    ],
    on_off: "off",
    valid_time: 0,
    timestamp: 0,
    visible: true
},
{
    name: "IDC-IP Google",
    des: "预设",
    type: "idc",
    rule_type: 2,
    addition_arg: "none",
    action: "monitor",

    rule: [
        {
            key: "ip_type",
            op: "contains",
            value: "idc"
        },
        {
            key: "ip_owner",
            op: "contains",
            value: "cloud.google.com"
        }
    ],
    on_off: "off",
    valid_time: 0,
    timestamp: 0,
    visible: true
}];

```
####BOT自定义策略-自定义会话特征
```
export const sessionRules: StrategyLine[] = [
    {
        id: "",
        key: "avg_speed", label: "会话平均速度",
        title: "等于会话请求总次数/会话持续时间，单位为：次/分钟",
        opoptions: [">", "<"], value: "",
        placeholder: "请输入0-100000之间整数，次/分钟",
        reg: /^(\d{1,5}|100000)$/
    },
    {
        id: "",
        key: "win_speed", label: "会话窗口速度",
        title: "最近检测窗口（2分钟）内的会话访问速度，单位为：次/分钟",
        opoptions: [">", "<"], value: "",
        placeholder: "请输入0-100000之间整数，次/分钟",
        reg: /^(\d{1,5}|100000)$/
    },
    {
        id: "",
        key: "nums", label: "会话总次数",
        opoptions: [">", "<"], value: "",
        placeholder: "请输入0-100000之间整数",
        reg: /^(\d{1,5}|100000)$/
    },
    {
        id: "",
        key: "session_duration", label: "会话持续时间",
        opoptions: [">", "<"], value: "",
        placeholder: "请输入0-100000之间整数，单位：分钟",
        reg: /^(\d{1,5}|100000)$/
    },

    {
        id: "",
        key: "robots_exist", label: "会话存在Robots.txt",
        title: "会话请求中访问Robots.txt文件",
        opoptions: ["yes", "no"]
    },
    {
        id: "",
        key: "req_in_wee_hours", label: "会话发生在凌晨",
        title: "会话请求发生在凌晨",
        opoptions: ["yes", "no"]
    }
];

export const ipRules: StrategyLine[] = [
    {
        id: "",
        key: "ip_scope", label: "访问源IP",
        title: "",
        opoptions: ["belong", "not belong"], value: "",
        placeholder: `支持三种形式的ip,多个ip之间分行隔开，示例如下：
        123.25.254.21
        123.25.254.21/24
        123.25.254.21-123.25.254.45`,
        reg: /(^\d{1,3}(.\d{1,3}){3}$)|(^(\d{1,3}.){3}\d{1,3}\/\d{1,3}$)|(^\d{1,3}(.\d{1,3}){3}-\d{1,3}(.\d{1,3}){3}$)/
    },
    {
        id: "",
        key: "ip_type", label: "IP类型",
        title: "IP的类型信息，类型为IDC或基站(运营商基站)，当IP为IDC类型时疑似存在异常",
        opoptions: ["contains", "not contains"], value: ""
        , valueoptions: ip_type_list,
        placeholder: "请选择1个",
        reg: /^.+$/,
    },
    {
        id: "",
        key: "ip_owner", label: "IP所有者",
        title: "IP所有者信息（当IP类型为IDC时有效），例如：tencent.com，可以在BOT详情中查看",
        opoptions: ["belong", "not belong"], value: [],
        valueoptions: ip_owner_list,
        placeholder: "请选择1个",
        reg: /^.+$/,
    }];

export const uaRules: StrategyLine[] = [
    {
        id: "",
        key: "ua_exist", label: "UA存在性",
        opoptions: ["yes", "no"]
    },
    {
        id: "",
        key: "ua_match", label: "请求最多的UA",
        opoptions: ["contains", "not contains"], value: "",
        reg: /^(.{1,1024})$/,
        placeholder: "请输入1024个字符以内"
    },

    {
        id: "",
        key: "ua_kind_nums", label: "UA种类",
        title: "会话请求中COOKIE去重后的数目，过多疑似异常，对非代理IP有效",
        opoptions: [">", "<"], value: "",
        placeholder: "请输入0-100000之间的整数",
        reg: /^(\d{1,5}|100000)$/
    },
    {
        id: "",
        key: "ua_valid_rate", label: "UA存在比",
        title: "会话请求中UA的存在比例，取值范围0-1，过低疑似异常",
        opoptions: [">", "<"], value: "",
        placeholder: "请输入0-1范围内的值，保留2位有效数字",
        reg: /^(0\.\d{1,2}|0|1)$/
    }, {
        id: "",
        key: "ua_type", label: "UA类型",
        opoptions: ["belong"], value: [],
        valueoptions: ua_type_list,
        placeholder: "至少选择一个"
    }, {
        id: "",
        key: "ua_kind_random_rate", label: "UA随机性指数",
        title: "会话请求中UA的随机分布情况，取值范围0-1，指数越高越异常，参考值阈值超过0.6疑似异常，指数超过0.92基本确定为异常",
        opoptions: [">", "<"], value: "",
        placeholder: "请输入0-1范围内的值，保留2位有效数字",
        reg: /^(0\.\d{1,2}|0|1)$/
    }];

export const cookieRules: StrategyLine[] = [
    {
        id: "",
        key: "cookie_exist", label: "COOKIE存在性",
        opoptions: ["yes", "no"]
    },
    {
        id: "",
        key: "cookie_match", label: "请求最多的COOKIE",
        opoptions: ["contains", "not contains"], value: "",
        reg: /^(.{1,1024})$/,
        placeholder: "请输入1024个字符以内"
    },
    {
        id: "",
        key: "cookie_repeat", label: "COOKIE重复比",
        title: "会话请求中COOKIE重复比例，取值范围0-1，越大说明重复性越高",
        opoptions: [">", "<"], value: "",
        placeholder: "请输入0-1范围内的值，保留2位有效数字",
        reg: /^(0\.\d{1,2}|0|1)$/
    },
    {
        id: "",
        key: "cookie_valid_rate", label: "COOKIE存在比",
        title: "会话请求中COOKIE存在比例，取值范围0-1，越大说明存在性越高",
        opoptions: [">", "<"], value: "",
        placeholder: "请输入0-1范围内的值，保留2位有效数字",
        reg: /^(0\.\d{1,2}|0|1)$/
    },
    {
        id: "",
        key: "cookie_abuse", label: "COOKIE滥用",
        title: "多种不同的UA使用相同的COOKIE",
        opoptions: ["yes", "no"]
    },
    {
        id: "",
        key: "cookie_kind_nums", label: "COOKIE种类",
        title: "会话请求中COOKIE去重后的数目",
        opoptions: [">", "<"], value: "",
        placeholder: "请输入0-100000之间的整数",
        reg: /^(\d{1,5}|100000)$/
    }];

export const referRules: StrategyLine[] = [
    {
        id: "",
        key: "refer_exist", label: "Referer存在性",
        opoptions: ["yes", "no"]
    },
    {
        id: "",
        key: "refer_match", label: "请求最多的Referer",
        opoptions: ["contains", "not contains"], value: "",
        reg: /^(.{1,1024})$/,
        placeholder: "请输入1024个字符以内"
    },
    {
        id: "",
        key: "refer_repeat", label: "Referer重复比",
        title: "会话请求中referer重复比例，取值范围0-1，对浏览器访问有效，过高疑似异常",
        opoptions: [">", "<"], value: "",
        placeholder: "请输入0-1范围内的值，保留2位有效数字",
        reg: /^(0\.\d{1,2}|0|1)$/
    },
    {
        id: "",
        key: "refer_valid_rate", label: "Referer存在比",
        title: "会话请求中referer存在比例，取值范围0-1，对浏览器访问有效，过低疑似异常",
        opoptions: [">", "<"], value: "",
        placeholder: "请输入0-1范围内的值，保留2位有效数字",
        reg: /^(0\.\d{1,2}|0|1)$/
    },
    {
        id: "",
        key: "refer_abuse", label: "Referer滥用",
        title: "多种不同的UA使用相同的referer",
        opoptions: ["yes", "no"]
    }, {
        id: "",
        key: "refer_kind_nums", label: "Referer种类",
        title: "会话请求中referer去重后的数目",
        opoptions: [">", "<"], value: "",
        placeholder: "请输入0-100000之间的整数",
        reg: /^(\d{1,5}|100000)$/
    }];

export const reqRules: StrategyLine[] = [
    {
        id: "",
        key: "url_match", label: "请求最多的URL",
        opoptions: ["contains", "not contains"], value: "",
        placeholder: "请输入1024个字符以内",
        reg: /^.{1,1024}$/
    },
    {
        id: "",
        key: "req_url_repeat", label: "URL重复比",
        title: "会话请求中URL重复比比例，取值范围0-1，过高或过低疑似异常",
        opoptions: [">", "<"], value: "",
        placeholder: "请输入0-1范围内的值，保留2位有效数字",
        reg: /^(0\.\d{1,2}|0|1)$/
    },
    {
        id: "",
        key: "req_url_kind", label: "URL种类",
        opoptions: [">", "<"], value: "",
        title: "会话请求中URL去重后条目数",
        placeholder: "请输入0-100000之间整数",
        reg: /^(\d{1,5}|100000)$/
    },
    {
        id: "",
        key: "param_match", label: "请求最多的参数",
        title: "会话请求出现最多的参数，包括GET请求参数（Query内容）或POST请求参数（Body内容）",
        opoptions: ["contains", "not contains"], value: "",
        placeholder: "请输入1024个字符以内",
        reg: /^.{1,1024}$/
    },
    {
        id: "",
        key: "req_query_repeat", label: "参数重复比",
        title: "会话请求中GET请求参数（Query内容）或POST请求参数（Body内容）重复比例，取值范围0-1，过高疑似异常",
        opoptions: [">", "<"], value: "",
        placeholder: "请输入0-1范围内的值，保留2位有效数字",
        reg: /^(0\.\d{1,2}|0|1)$/
    }];


export const headerRules: StrategyLine[] = [
    {
        id: "",
        key: "accept_exist", label: "Accept存在性",
        opoptions: ["yes", "no"]
    },
    {
        id: "",
        key: "accept_language_exist", label: "Accept-Language存在性",
        opoptions: ["yes", "no"]
    },
    {
        id: "",
        key: "accept_encoding_exist", label: "Accept-Encoding存在性",
        opoptions: ["yes", "no"]
    },
    {
        id: "",
        key: "connection_exist", label: "Connection存在性",
        opoptions: ["yes", "no"]
    },
    {
        id: "",
        key: "method", label: "请求方法占比",
        arg: "",
        argreg: /^(GET|HEAD|POST|PUT|OPTIONS|DELETE|TRACE|PATCH|CONNECT)(((,|，)(GET|HEAD|POST|PUT|OPTIONS|DELETE|TRACE|PATCH|CONNECT)){0,4})$/,
        argplaceholder: "如GET；多个逗号隔开，最多5个",
        opoptions: [">", "<"], value: "",
        placeholder: "请输入百分比，如50%",
        reg: /^(\d|[1-9]\d|100)%$/
    },
    {
        id: "",
        key: "protocal", label: "HTTP协议版本占比",
        //argreg: /^\d\.\d$/,
        argreg: /^\d\.\d((,|，)(\d\.\d)){0,4}$/,
        argplaceholder: "如1.1；多个逗号隔开，最多5个",
        arg: "",
        opoptions: [">", "<"], value: "",
        placeholder: "请输入百分比，如50%",
        reg: /^(\d|[1-9]\d|100)%$/
    }, {
        id: "",
        key: "status", label: "返回状态码占比",
        arg: "",
        //argreg: /^\d{3}$/,
        argreg: /^\d{3}((,|，)(\d{3})){0,4}$/,
        argplaceholder: "如403；多个逗号隔开，最多5个",
        opoptions: [">", "<"], value: "",
        placeholder: "请输入百分比，如50%",
        reg: /^(\d|[1-9]\d|100)%$/
    }];



export const advanceRules: StrategyLine[] = [
    {
        id: "",
        key: "score", label: "BOT得分",
        title: "BOT智能分析引擎对会话给出的BOT得分，得分越高判定为BOT可能性越大，参考值为：5",
        opoptions: [">", "<"], value: "",
        placeholder: "请输入0-30之间整数",
        reg: /^(\d|[12]\d|30)$/
    },
    {
        id: "",
        key: "AI_abnormal_flag", label: "AI模型检出",
        title: "AI行为分析模型检测结果，结果为AI模型检出时，疑似异常。",
        opoptions: ["yes", "no"]
    },
    {
        id: "",
        key: "scene_flag", label: "预测标签",
        title: "算法自动预测的疑似行为",
        opoptions: ["belong", "not belong"], value: [],
        valueoptions: scene_flag_list
    },
    {
        id: "",
        key: "sensitive_request_flag", label: "敏感接口访问",
        title: "判断是否对敏感接口（如：短信接口、注册接口、登录接口等）进行访问",
        opoptions: ["yes", "no"]
    },
    {
        id: "",
        key: "req_variance", label: "时序行为异常指数",
        title: "一种时序行为异常检测算法，指数越小越异常，参考值阈值小于0.5疑似异常，0.24基本确定为异常",
        opoptions: [">", "<"], value: "",
        placeholder: "请输入整数，最多保留2位有效数字",
        reg: /^\d+(.\d{1,2})?$/
    },
    {
        id: "",
        key: "req_CCE", label: "时序熵异常指数",
        title: "一种时序行为熵检测算法，指数越小越异常，参考值阈值为0.5疑似异常",
        opoptions: [">", "<"], value: "",
        placeholder: "请输入整数，最多保留2位有效数字",
        reg: /^\d+(.\d{1,2})?$/
    },
    {
        id: "",
        key: "ua_not_match_ip", label: "公开BOT伪造",
        title: "会话请求伪造为公开BOT类型，例如：使用百度爬虫的UA，但IP不是百度的IP",
        opoptions: ["yes", "no"]
    }
];

export const allrules: StrategyLine[] = sessionRules.concat(cookieRules).concat(ipRules).concat(uaRules).concat(referRules).concat(reqRules).concat(headerRules).concat(advanceRules);

```

（2）其他数据说明
```
 // 匹配字段--预测标签 的匹配内容
export const scene_flag_list = [
    { value: "crawler_unregular", label: "疑似无规律爬虫" },
    { value: "crawler_regular", label: "疑似规律性爬虫" },
    { value: "request_repeat", label: "疑似接口重复访问" },
    { value: "credential_cracking", label: "疑似暴力破解" },
    { value: "credential_stuffing", label: "疑似撞库攻击" },
    { value: "brush_sms", label: "疑似刷短信接口" },
    { value: "brush_captcha", label: "疑似刷验证码接口" },
    { value: "reg_malicious", label: "疑似恶意注册" },
    { value: "credential_miss_user", label: "疑似登录行为，缺失用户值" },
    { value: "credential_without_user", label: "疑似登录行为，缺失用户参数" },
    { value: "credential_only_action", label: "疑似登录行为，缺失用户和密码" },
    { value: "credential_user_password", label: "疑似登录行为，缺失登录动作" }
];

//匹配字段--IP类型 的匹配内容
export const ip_type_list = [{ value: "idc", label: "互联网数据中心（IDC）" },
{ value: "bs", label: "运营商基站" },
{ value: "unknown", label: "未知类型" }];
//匹配字段--UA类型 的匹配内容
export const ua_type_list = [{ value: "browser", label: "浏览器" },
{ value: "mobile", label: "移动端" },
{ value: "gameortv", label: "游戏或电视终端" },
{ value: "bot", label: "公开BOT类型" },
{ value: "bot-unknown", label: "未公开BOT类型" },
{ value: "tools", label: "自动化工具" },
{ value: "unknown", label: "未知类型" },
{ value: "scanner", label: "公开扫描器" },
{ value: "frmework", label: "开发框架" },
{ value: "http library", label: "语言HTTP库" }];

//匹配字段--IP所有者 的匹配内容
export const ip_owner_list = [
    { value: "amazon.com", label: "Aws" },
    { value: "microsoft.com", label: "Azure" },
    { value: "cloud.google.com", label: "Google" },
    { value: "ucloud.cn", label: "UCloud" },
    { value: "阿里云", label: "阿里云" },
    { value: "baidu.com", label: "百度云" },
    { value: "huawei.com", label: "华为云" },
    { value: "ksyun.com", label: "金山云" },
    { value: "pubyun.com", label: "京东云" },
    { value: "qingcloud.com", label: "青云" },
    { value: "tencent.com", label: "腾讯云" }];
```
###IP管理

```
//动作说明
export const RECORD_ACT_CFG = {
    cc: { "20": "观察", "21": "人机识别", "22": "拦截" },
    bot: { "10": "观察", "11": "人机识别", "12": "拦截" },
    custom: { "30": "观察", "31": "人机识别", "32": "拦截" },
    blackIp: { "40": "放通", "42": "拦截" },
    whiteIp: { "40": "放通", "42": "拦截" }
}
```
## 高级版升级企业版参数
```
[{
	"goodsCategoryId": 100217,
	"regionId": 1,
	"projectId": 0,
	"goodsNum": 1,
	"payMode": 1,
	"platform": 1,
	"goodsDetail": {
		"resourceId": "waf_00000044p",
		"curDeadline": "2020-03-12 16:00:31",
		"oldConfig": {
			"pid": 11416,
			"wsm_domain_package": 0,
			"type": "wsm_waf",
			"wsm_package_premium": 1
		},
		"newConfig": {
			"pid": 11416,
			"wsm_domain_package": 0,
			"type": "wsm_waf",
			"wsm_package_enterprise": 1
		}
	}
}]
```

## 高级版进入BOT拦截页面
```
目前该功能仅开放给企业版及以上客户，立即升级

腾讯云Web应用防火墙独家提供基于AI + 规则的BOT程序管理功能，可以应用于以下业务场景。

数据泄露
恶意BOT所有者通过爬虫抓取并利用站点对外公开数据，如用户数据，商品数据，订单数据等，造成数据泄露风险；

业务风险
恶意爬虫抓取价格，库存信息等，影响营销策略有效性；站点内容被未授权抓取，转载，降低站点内容竞争力；接口烂刷，刷票，羊毛党，短信接口，垃圾注册等带来业务风险；

攻击程序
黑客利用BOT程序实现撞库攻击，漏洞嗅探，DDoS攻击，CC攻击，发送垃圾邮件等攻击，给业务带来安全威胁；

站点负载
站点流量30%-70%来自BOT机器人程序，大量的机器人程序流量占用站点负载，影响正常用户的访问速度与体验；
```

##### 1、背景：

在3.1.5版本之前，clb-waf在绑定LB的时候因为不是事务操作，可能会留下脏数据，导致用户再次添加报错。

##### 2、方案：

在3.1.5版本中，clb-waf在绑定LB的时候改成异步的方式，用户在控制台上操作提交请求以后，API后台服务会开启一个协程异步的进行LB相关的动作。

每一个域名都会有一个状态（`state`字段，字段取值如下）来标识目前域名的状态，前端需要根据域名状态做不同的展示：

> 0：正常，3：过期，4：正在绑定LB，5：绑定LB成功，6：正在解绑LB，7：解绑LB失败，8：绑定LB失败，9：解绑LB成功，10：内部错误

a）、如果域名状态为正常（`state` = 0）则正常展示域名的所有信息即可；

b）、如果域名状态为异常（`state` = 7 8 10）则需要在域名信息中展示出对应的错误信息；

c）、如果域名状态为正在进行（`state` = 4 6）则前端需要定时刷新域名的状态（通过接口`DescribeHost`），直到域名状态为上面的a、b，并且在这个状态期间域名的删除、编辑、开关操作置灰；

d）、域名中间状态（`state` = 5 9）跟c一样，前端需要定时刷新域名状态，直到域名状态为上面的a、b，并且在这个状态期间域名的删除、编辑、开关操作置灰；

##### 3、涉及接口

本次修改不会改动接口的输入、输出，涉及的接口如下：

> CreateHost：添加防护域名
>
> ModifyHost：编辑防护域名
>
> ModifyHostFlowMode：设置防护域名的流量模式
>
> DeleteHost：删除CLB-WAF防护域名
>
> ModifyHostStatus：设置防护域名WAF开关
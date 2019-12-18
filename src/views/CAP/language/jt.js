module.exports = {
    CCN: {
        total: {
            title: '云联网',
            btn: '新建',
            link: '云联网帮助文档',
            tr1: '名称/ID',
            tr2: '状态',
            tr3: '服务质量',
            tr4: '关联实例',
            tr5: '备注',
            tr6: '计费模式',
            tr7: '限速方式 ',
            tr8: '创建时间',
            tr9: '操作',
            td1: '管理实例',
            td2: '编辑标签',
            td3: '删除',
            tdno: '暂无数据',
            sure: '确定',
            new: '新建云联网实例',
            new1: '名称',
            new2: '计费模式',
            mode1: '预付费',
            mode2: '月95后付费',
            mode3: '为了便于测试连通性，地域间默认享有免费10Kbps带宽',
            new3: '限速方式',
            way1: '地域出口限速',
            way2: '地域间限速',
            new4: '描述',
            desc: '选填',
            new5: '服务质量',
            ser1: '白金',
            ser2: '金',
            ser3: '银',
            new6: '关联实例',
            vpc1: '私有网络',
            vpc2: '专线网关',
            region: '港澳台地区(台湾台北)',
            select: '搜索VPC名称或ID',
            editname: '修改名称',
            editname2: '名称',
            editdesc: '修改备注',
            editdesc1: '备注',
            edit: '您已经选择1个云资源',
            edit0: '新增标签',
            edit1: '标签键',
            edit2: '标签值',
            edit3: '删除',
            del: '您确认要删除该云联网吗？',
            del1: '名称 ',
            del2: '状态',
            del3: '关联实例',
            eWay: '变更限速方式',
            eWay1: '限速方式',
            eWay2: '地域间带宽',
            eWay3: '地域出带宽',
            eWay4: '注意：变更后，原有限速配置将删除， 带宽将设置为 1Gbps（默认），如需更大默认带宽，请提工单申请'
        },
        tabs: {
            tab1: '关联实例',
            tab1new: '新增实例',
            tab1new1: '同地域带宽免费，点击查看详情',
            tab1new2: '私有网络',
            tab1new3: '专线网关',
            tab1new4: '请选择',
            tab1newc: '关闭',
            tab1del: '您确认要解除该实例与云联网的关联吗？',
            tab1del1: '解除关联后，该实例与云联网内其他实例的连接将立刻中断，请您务必确认影响后再操作',
            tab1tr1: 'ID/名称',
            tab1tr2: '状态',
            tab1tr3: '实例类型',
            tab1tr4: '所属帐号',
            tab1tr5: '关联时间',
            tab1tr6: '所在地域',
            tab1tr7: '操作',
            tab1no: '记录为空',
            tab2: '监控',
            tab2tag: '单地域监控',
            tab2R: '港澳台地区(台湾台北)',
            tab2D: '注释：Max、Min和Avg数值统计为当前折线图内所有点的最大值、最小值和平均值',
            tab3: '带宽管理',
            tab3tit: '地域出口带宽限速',
            tab3tit1: '地域间带宽限速',
            tab3tit2: '变更',
            tab3tr1: '地域',
            tab3tr2: '带宽上限（Mbps）',
            tab3btn: '调整带宽限速',
            tab3btnD: '添加地域出口限速',
            tab3btnC: '已选择',
            tab3R: '台湾台北',
            tab4: '路由表',
            tab4tr1: '目的端',
            tab4tr2: '状态',
            tab4tr3: '下一跳',
            tab4tr4: '下一跳所属地域',
            tab4tr5: '更新时间',
            tab4tr6: '启用路由'
        },
        menu: {
            title: '云联网'
        }
    },
    COM: require('@/components/language/jt'),
}
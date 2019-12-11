module.exports= {

    KMS: {
        total: {
            title: '密钥管理系统',
            subMenu: '用户密钥',
            kmsList: '密钥列表',
            newCreate: '新建',
            startKms: '启用密钥',
            stopKms: '禁用密钥',
            newCreateKms: '新建密钥',
            kmsName: '密钥名称',
            tip1: '最长可输入60个字符，不可为空，请使用字母、数字及字符“_”和“-”，首字符必须为字母或者数字，且不能用 KMS- 开头。',
            descriptInfo: '描述信息',
            tip2: '最长可输入1024个字符',
            oulCon: '外部',
            modelClose: '取消',
            modelSure: '确定',
            placeholder1: '支持密钥ID、名称搜索',
            label1: '密钥ID/密钥名称',
            status: '状态',
            createTime: '创建时间',
            kmsOrigin: '密钥来源',
            kmsChange: '密钥轮换',
            startChange: '启用轮换',
            stopChange: '禁用轮换',
            action: '操作',
            planDelete: '计划删除',
            closeDelete: '取消删除',
            planDeleteKms: '计划删除密钥',
            tip3: '请先对密钥进行禁用操作！',
            kmsInfo: '密钥信息',
            name: '名称',
            changeKmsName: '修改密钥名称',
            oldName: '原名称',
            newName: '新名称',
            tip4: '最长可输入60个字符，不可为空，请使用字母、数字及字符“_”和“-”，首字符必须为字母或者数字，且不能用 KMS- 开头。',
            address: '地区',
            createUser: '创建者',
            changeStatus: '轮换状态',
            alredayStop: '已禁用',
            alredayStart: '已启用',
            autoChange: '每年自动轮换',
            changeKmsInfo: '修改密钥描述信息',
            oldDescript: '原描述信息',
            newDescript: '新描述信息',
            kmsMaterial: '密钥材料',
            importKmsM: '导入密钥材料',
            reImport: '重新导入',
            deleteKmsM: '删除密钥材料',
            outTime: '过期时间',
            kmsParamsDownload: '密钥参数下载',
            kmsImport: '密钥导入',
            importStatus: '导入状态',
            tip5: '温馨提示：密钥材料需要通过加密公钥加密后才可以导入，请选择一个用于加密密钥材料的算法，生成的密钥导入参数将在24小时后过期，请及时下载！',
            algorithmType: '算法类型',
            EncryptionAlgorithm: '加密算法',
            downLoad: '下载',
            next: '下一步',
            CryptographicKeyMaterial: '加密密钥材料',
            ImportToken: '导入令牌',
            nofileChoose: '还未选择文件',
            kmsMoutTime: '密钥材料过期时间',
            foverNoTime: '永不过期',
            setTimeOut: '设置过期时间',
            chooseTime: '选择日期',
            tip6: '若您已订阅产品信息，您将在密钥材料过期前三天收到告警信息',
            prev: '上一步',
            impoetKms: '导入密钥',
            kmsImportSuccess: '密钥成功导入',
            tip7: '秘钥导入失败，请返回上一步重试！',
            tip8: '温馨提示：密钥材料将从KMS中删除，请确保您已经保管该密钥材料副本！',
            tip9: '确定删除该密钥材料么？',
            onlineTool: '在线工具',
            encryption: '加密',
            Decrypt: '解密',
            placeholder2: '请输入明文',
            action: '执行',
            enterText: '请输入密文',
            tip10: '启用后，选中的密钥将每年自动轮换一次。',
            tip11: '禁用后，选中的密钥将停止每年自动轮换。',
            chooseAl: '您已选',
            oneKmsSer: '1个密钥服务',
            lookDetail: '查看详情',
            canStart: '可启用',
            canStop: '可禁用',
            question1: '启用选中的密钥服务？',
            question2: '禁用选中的密钥服务？',
        }

    },
     COM: require('@/components/language/jt'),
}
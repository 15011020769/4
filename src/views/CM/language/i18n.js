import Vue from 'vue'
import VueI18n from 'vue-i18n'
Vue.use(VueI18n)
var i18n = new VueI18n({
    locale: 'ft', // 语言标识
    messages: {
        'jt': require('@/views/CM/language/jt'),
        'ft': require('@/views/CM/language/ft')
    }
})
export default i18n
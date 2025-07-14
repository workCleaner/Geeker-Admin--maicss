import { createI18n } from 'vue-i18n'
import { getBrowserLang } from '@/utils'

import zh from './zh.json'
import en from './en.json'

const i18n = createI18n({
  allowComposition: true,
  legacy: false,
  locale: getBrowserLang(),
  messages: { zh, en },
})

export default i18n

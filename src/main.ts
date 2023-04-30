import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import VueCookies from 'vue-cookies'
import router from './router'


const app = createApp(App).use(router)
app.use(ElementPlus, {
    locale: zhCn,
  })
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
app.config.globalProperties.$cookies = VueCookies as any
app.mount('#app')
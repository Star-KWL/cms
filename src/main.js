import { createApp } from 'vue'
import App from './App.vue'
import VueCookies from 'vue-cookies'
import router from './router'

const app = createApp(App).use(router)
app.config.globalProperties.$cookies = VueCookies
app.mount('#app')
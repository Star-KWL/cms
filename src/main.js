import { createApp } from 'vue'
import App from './App.vue'
import VueCookies from 'vue-cookies'

const app = createApp(App)
app.config.globalProperties.$cookies = VueCookies
app.mount('#app')
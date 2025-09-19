import 'virtual:uno.css'
import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { Icon } from '@iconify/vue'

const pinia = createPinia()
const app = createApp(App)
// 全局注册 Icon 组件
app.component('Icon', Icon)
app.use(pinia)
app.use(router)
app.mount('#app')
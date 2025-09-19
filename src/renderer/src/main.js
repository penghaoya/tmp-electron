import 'virtual:uno.css'
import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { piniaPersistedState, initStores } from './stores'

const pinia = createPinia()

// 注册持久化插件
pinia.use(piniaPersistedState)

const app = createApp(App)

app.use(pinia)
app.use(router)

// 初始化 stores
initStores()

app.mount('#app')
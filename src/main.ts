import { createApp } from 'vue'
import './style.css'
import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'
import { createPinia } from 'pinia'
import App from './App.vue'

createApp(App)
    .use(ElementPlus)
    .use(createPinia())
    .mount('#app')

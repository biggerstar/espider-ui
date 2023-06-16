import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { EventEmitter } from  'events'

import ElementPlus  from 'element-plus'
import axios  from 'axios'
import 'element-plus/dist/index.css'
import './assets/base.css'
import JsonViewer from 'vue3-json-viewer'
import "@/assets/vue3-json-viewer/dist/index.css";

import App from './App.vue'
import router from './router'




const app = createApp(App)
app.use(router)
app.use(ElementPlus)  // 后面按需引入，
app.use(createPinia())
app.use(JsonViewer)
app.mount('#app')

// app.config.globalProperties.$socket =  new WebSocket("ws://127.0.0.1:8888");
app.config.globalProperties.$emitter =   new EventEmitter()
app.config.globalProperties.$http =   axios
window.espider = {
    server:{
        host:'http://localhost',
        port:5566
    }
}



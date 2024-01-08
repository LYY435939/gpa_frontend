import {createApp} from 'vue'

import ElementPlus from 'element-plus'

import ant from "ant-design-vue"

import 'element-plus/dist/index.css'
import App from './App.vue'


import axios from './utils/http';

import router from './router'

const app = createApp(App)

app.config.globalProperties.$axios = axios;

app.use(router)
app.use(ElementPlus)
// app.use(Button)
// app.use(DatePicker)
// app.use(Layout);
// app.use(Menu);
app.use(ant)

app.mount('#app')
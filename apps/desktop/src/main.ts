import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './style.css'
import 'primeicons/primeicons.css'
import 'dseg/css/dseg.css'

const app = createApp(App)
app.use(createPinia())
app.mount('#app')


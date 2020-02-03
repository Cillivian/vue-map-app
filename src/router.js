import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/home.vue'
import UpLoad from './views/upload.vue'
Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [{
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/upload',
            name: 'upload',
            component: UpLoad
        }
    ]
})
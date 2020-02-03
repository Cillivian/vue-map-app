import Vue from 'vue'
import App from './App.vue'
import VueAMap from 'vue-amap';
import router from './router'
import '@vant/touch-emulator';
import axios from 'axios';
Vue.prototype.$axios = axios;
import QS from 'qs'
import kscreenshot from 'kscreenshot'
//65指键盘中的A
new kscreenshot({
    key: 65
})
Vue.prototype.qs = QS;
import {
    Cell,
    CellGroup,
    Tabbar,
    TabbarItem,
    Icon,
    NavBar,
    Toast,
    Popup,
    Uploader,
    Search,
    Button,
    SwipeCell,
    Card,
    Collapse,
    CollapseItem,
    Tag
} from 'vant';
Vue.use(Cell);
Vue.use(CellGroup);
Vue.use(Tag);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(SwipeCell);
Vue.use(Card);
Vue.use(Toast);
Vue.use(Button);
Vue.use(Uploader);
Vue.use(Search);
Vue.use(NavBar);
Vue.use(Icon);
Vue.use(Popup);
Vue.use(Tabbar);
Vue.use(TabbarItem);
Vue.config.productionTip = false
Vue.use(VueAMap);
VueAMap.initAMapApiLoader({
    key: '	4f9202c0f61ad5b1db4566c4534ab803',
    plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor', 'AMap.Geolocation'],
    // 默认高德 sdk 版本为 1.4.4
    v: '1.4.4'
});
new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
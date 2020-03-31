import Vue from 'vue'
import VueMq from 'vue-mq'
import '../theme/index.css'
import '../theme/display.css'
import Element from 'element-ui'
import locale from 'element-ui/lib/locale/lang/fr'
import App from './App.vue'
Vue.config.productionTip = false


Vue.use(VueMq, {
  breakpoints: { // default breakpoints - customize this
    sm: 450,
    md: 1250,
    lg: Infinity,
  },
  defaultBreakpoint: 'sm' // customize this for SSR
});

Vue.use(Element,{locale});

new Vue({
  render: h => h(App)
}).$mount('#app')

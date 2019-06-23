import Vue from 'vue'
import App from './App.vue'
import router from './router'
//引入重置样式
import './assets/css/reset.css';
//引入共用样式
import './assets/css/common.css';
import ElementUI from 'element-ui'; // 引入JS组件
import 'element-ui/lib/theme-chalk/index.css'; // 引入css样式
//引入Echarts
import echarts from 'echarts';

import local from '@/utils/local'

//挂载原型
Vue.prototype.$echarts = echarts;



//注册
Vue.use( ElementUI )


//路由守卫；拦截所有路由
router.beforeEach((to, from, next) => {
  //获取token
  const token =local.get('zxc_token')
  //判断
  if(token){  //如果有token 直接放行
      next();
  }else {
    //判断
    //如果去的是登录，直接放行
    if (to.path === '/login'){ 
      next();
    }else {
      //如果去的是其他页面，直接跳转到登录页面
      next({path : '/login'})
    }
  }
})

//阻止生产提示
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

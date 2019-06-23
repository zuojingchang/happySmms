import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)

export default new Router({
  routes: [
    {path: '/', redirect : '/login'}, //根据目录重定向到login
    {path: '/login', component : () => import('./views/Login/Login.vue')}, //登录
    {
      path : '/home',
      component : () => import('./views/Home/Home.vue'),
      //根据目录重定向到系统信息
      redirect : './home/systeminfo',
      //子组件
      children : [
        //系统信息  
        {
          path : '/home/systeminfo',
          component : () => import('./views/SystemInfo/SystemInfo.vue'),
        },
        //账号管理
        {
          path : '/home/accountadd',
          component : () => import('./views/AccountAdd/AccountAdd.vue')
        },
        {
          path : '/home/accountmanage',
          component : () => import('./views/AccountManage/AccountManage.vue')
        },
        {
          path : '/home/passwordmodify',
          component : () => import('./views/PasswordModify/PasswordModify.vue')
        },
        //商品管理
        {
          path : '/home/goodsadd',
          component : () => import ('./views/GoodsAdd/GoodsAdd.vue')
        },
        {
          path : '/home/goodsmanage',
          component : () => import ('./views/GoodsManage/GoodsManage.vue')
        },
        //统计管理
        {
          path : '/home/selltotal',
          component : () => import('./views/SellTotal/SellTotal.vue')
        },
        {
          path : '/home/stocktoal',
          component : () => import('./views/StockTotal/StockTotal.vue')
        },
        //分类管理
        {
          path : '/home/addclassify',
          component : () => import('./views/AddClassify/AddClassify.vue')
        },
        {
          path : '/home/classifymanage',
          component : () => import('./views/ClassifyManage/ClassifyManage.vue')
        },
        //进货管理
        {
          path : '/home/goodsinput',
          component : () => import('./views/GoodsInput/GoodsInput.vue')
        },
        {
          path : '/home/inventorymanage',
          component : () => import('./views/InventoryManage/InventoryManage.vue')
        },
        //出货管理
        {
          path : '/home/marketlist',
          component : () => import('./views/MarketList/MarketList.vue')
        },
        {
          path : '/home/goodsmarket',
          component : () => import('./views/GoodsMarket/GoodsMarket.vue')
        },
        {
          path : '/home/goodsretreat',
          component : () => import('./views/GoodsRetreat/GoodsRetreat.vue')
        },
        //会员管理
        {
          path : '/home/addvipaccount',
          component : () => import('./views/AddVipAccount/AddVipAccount.vue')
        },
        {
          path : '/home/vipmanage',
          component : () => import('./views/VipManage/VipManage.vue')
        },
        //个人中心
        {
          path : '/home/personal',
          component : () => import('./views/Personal/Personal.vue')
        }
      ]
    }
  ]
})

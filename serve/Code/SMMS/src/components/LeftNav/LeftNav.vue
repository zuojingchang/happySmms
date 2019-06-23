<template>
    <div class="left-nav">
        <!-- 标题 -->
        <h3 class="title">
            <!-- <i class="el-icon-menu"></i> -->
            <img src="./logo.jpg" alt="">
        </h3>
        <el-menu
            :default-active="$route.path"
            unique-opened
            active-text-color='rgb(64, 158, 255)'
            background-color='rgb(48, 65, 86)'
            router
        >   
            <!-- 导航一 -->
            <el-submenu :index="(i+1) + ''" v-for="(nav,i) in leftNav" :key="i">
                <template slot="title">
                <i :class="nav.iconcls"></i>
                <span>{{ nav.navTitle }}</span>
                </template>

                <el-menu-item 
                v-for="(subNav,i) in nav.children"
                :key="i"
                :index="subNav.path"
                >
                {{ subNav.navSubTitle }}
                </el-menu-item> 
            </el-submenu>           
        </el-menu>
    </div>
</template>

<script>
    import { getRole } from '@/api/account'
    export default {
        data (){
            return {
                leftNav :[]
            }
        },
        created (){
            getRole()
                .then(res => {
                    //接收后台响应数据
                    let { role } = res;
                    let nav =  [
                        //导航一
                        {
                            iconcls : 'el-icon-s-tools',
                            navTitle : '系统信息',
                            role : ['超级管理员','普通用户'],
                            children : [
                                { path : '/home/systeminfo', 'navSubTitle' : '系统信息'}
                            ]
                        },
                        //导航二
                        {
                            iconcls : 'el-icon-s-custom',
                            navTitle : '账号管理',
                            role : ['超级管理员'],
                            children : [
                                { path : '/home/accountmanage', 'navSubTitle' : '账号管理'},
                                { path : '/home/accountadd', 'navSubTitle' : '账号添加'},
                                { path : '/home/passwordmodify', 'navSubTitle' : '密码修改'}
                            ]
                        },
                        //导航三
                        {
                            iconcls : 'el-icon-shopping-bag-1',
                            navTitle : '商品管理',
                            role : ['超级管理员','普通用户'],
                            children : [
                                { path : '/home/goodsmanage', 'navSubTitle' : '商品管理'},
                                { path : '/home/goodsadd', 'navSubTitle' : '商品添加'}    
                            ]
                        },
                        //导航四
                        {   
                            iconcls : 'el-icon-tickets',
                            role : ['超级管理员'],
                            navTitle : '统计管理',
                            children : [
                                { path : '/home/selltotal', 'navSubTitle' : '销售统计'},
                                { path : '/home/stocktoal', 'navSubTitle' : '进货统计'}    
                            ]
                        },
                        //导航五
                        {
                            iconcls : 'el-icon-s-operation',
                            navTitle : '分类管理',
                            role : ['超级管理员','普通用户'],
                            children : [
                                { path : '/home/classifymanage', 'navSubTitle' : '分类管理'},
                                { path : '/home/addclassify', 'navSubTitle' : '添加分类'}    
                            ]
                        },
                        //导航六
                        {
                            iconcls : 'el-icon-sell',
                            navTitle : '进货管理',
                            role : ['超级管理员'],
                            children : [
                                { path : '/home/inventorymanage', 'navSubTitle' : '库存管理'},
                                { path : '/home/goodsinput', 'navSubTitle' : '商品入库'}    
                            ]
                        },
                        //导航七
                        {
                            iconcls : 'el-icon-sold-out',
                            navTitle : '出货管理',
                            role : ['超级管理员','普通用户'],
                            children : [
                                { path : '/home/marketlist', 'navSubTitle' : '销售明细'},
                                { path : '/home/goodsmarket', 'navSubTitle' : '商品销售'},    
                                { path : '/home/goodsretreat', 'navSubTitle' : '商品退货'}   
                            ]
                        },
                        //导航八
                        {
                            iconcls : 'el-icon-star-on',
                            navTitle : '会员管理',
                            role : ['超级管理员'],
                            children : [
                                { path : '/home/vipmanage', 'navSubTitle' : '会员管理'},
                                { path : '/home/addvipaccount', 'navSubTitle' : '添加会员账号'},      
                            ]
                        }
                    ]
                    this.leftNav = nav.filter( v => v.role.includes ( role ))
                })
                .catch(err => {
                    console.log(err);       
                })
        }
    }
</script>

<style lang="less">
    .left-nav{
        .title{
           widows: 180px;
           height: 60px;
           img{
               width: 100%;
               height: 100%;
           }
        }
        .el-menu{
            border-right: none;
            .el-submenu{
                color: #fff;
                 .el-submenu__title {
                    color: #fff;
                    & > i{
                        color: #fff;
                    }
                }
            }
            .el-menu-item{
                color: #fff;
            }
        }
    }
</style>
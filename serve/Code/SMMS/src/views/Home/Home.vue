<template>
    <div class="home">
        <!-- 布局容器 -->
       <el-container>
           <!-- 左侧栏 -->
            <el-aside width="200px">
                <!-- 左侧组件 -->
                <LeftNav></LeftNav>
            </el-aside>
            <!-- 右侧 -->
            <el-container>
                <!-- 上 -->
                <el-header>
                    <!-- 右边头部组件 -->
                    <RightHeader ref="rightHeader"></RightHeader>
                </el-header>
                <!-- 中 -->
                <el-main>
                    <!-- 路由出口 -->
                    <router-view @自定义事件="fn"></router-view>
                </el-main>
                <!-- 下 -->
                <el-footer>
                    <!-- 右侧脚部组件 -->
                    <RightFooter></RightFooter>
                </el-footer>
            </el-container>
        </el-container>      
    </div>
</template>

<script>
    //引入组件
    import LeftNav from '@/components/LeftNav/LeftNav.vue'
    import RightHeader from '@/components/RightHeader/RightHeader.vue'
    import RightFooter from '@/components/RightFooter/RightFooter.vue'
    export default {
        components : {
            //注册组件
            LeftNav,
            RightHeader,
            RightFooter
        },
        methods : {
            fn(){
                this.$refs.rightHeader.getUserInfo()
            }
        }
    }
</script>

<style lang="less">
    .home{
        height: 100%;
        //大容器
        .el-container{
            height: 100%;
            //左侧
            .el-aside{
                background-color: rgb(48, 65, 86);
            }
            //右侧
            .el-container{
                //上
                .el-header{    
                    line-height: 60px;
                }
                //下
                .el-footer{
                    line-height: 60px;
                }
            }
        }
    }
</style>
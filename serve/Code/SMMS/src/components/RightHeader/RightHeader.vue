<template>
    <div class="right-header">
        <el-row>
            <el-col :span="12">
                <h3> <i class="el-icon-s-home"></i> 家乐福超市管理系统</h3>
            </el-col>
            <el-col :span="12">
                <el-row>
                    <el-col :span="18">
                        <el-dropdown @command="handleCommand">
                            <span class="el-dropdown-link">
                                <h3>欢迎：&emsp;{{ userName }} &emsp;来到家乐福超市后台管理系统<i class="el-icon-arrow-down el-icon--right"></i></h3>       
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="personal">个人中心</el-dropdown-item> 
                                <el-dropdown-item command="logout">退出登录</el-dropdown-item>   
                            </el-dropdown-menu>
                        </el-dropdown>
                    </el-col>
                    <el-col :span="6">
                        <img :src="avatarUrl" alt="">
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import local from '@/utils/local'

import { getInfo } from '@/api/account'
    export default {
        data (){
            return {
                userName : '',
                avatarUrl : ''
            }
        },
        methods : {
            handleCommand (command){
                //判断
                if(command === 'logout'){
                    //清除token
                    local.remove('zxc_token')
                    //弹出提示
                    this.$message({
                        type : 'success',
                        message : '退出系统成功，欢迎您再次登录'
                    })
                    //两秒后跳转至登录页面
                    setTimeout(() => {
                        //跳转到登录页面
                        this.$router.push('http://www.baidu.com')
                    },2000)
                } else if(command === 'personal'){  //个人中心
                    //跳转至个人中心
                    this.$router.push('/home/personal')
                }
            },
            //获取用户信息
            getUserInfo(){
                //发送用户信息请求
                getInfo()
                    .then(res => {  
                        //接收响应参数
                        let { data} = res;                      
                        //获取当前信息渲染页面
                        let {account,avatarUrl} = data[0];         
                        this.userName = account;
                        this.avatarUrl = 'http://127.0.0.1:666' + avatarUrl;
                    })
                    .catch(err => {
                        console.log(err);
                    })
            }
        },
        created () {
            //调用用户信息函数
            this.getUserInfo()
        }
    }
</script>

<style lang="less">
    .right-header{
        color: #2d3b4a;
        font-size: 18px;
        border-bottom: 1px solid #ccc;
        & > .el-row{
            & > .el-col{
                .el-row{
                    .el-col:first-child{
                        text-align:right;
                    }
                    .el-col:last-child{
                        margin-left: 15px;
                        width: 50px;
                        height: 50px;
                        border-radius: 50%;
                        img{
                            width: 100%;
                            height: 100%;
                            border-radius: 50%;
                        }
                    }
                }
            }
        }
    }
</style>
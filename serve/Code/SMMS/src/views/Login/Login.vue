<template>
    <div class="login">
        <div class="login-wrap">
            <h3 class="title">
                <i class="el-icon-user-solid"></i>
                家乐福超市管理系统-登录
            </h3>
            <el-form 
                :model="loginForm" 
                status-icon 
                :rules="rules"
                ref="loginForm" 
                label-width="100px"
                class="demo-ruleForm">

                <el-form-item label="账号" prop="account">
                    <el-input type="text" v-model="loginForm.account" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="密码" prop="password">
                    <el-input type="text" v-model="loginForm.password" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="确认密码" prop="checkPass">
                    <el-input type="password" v-model="loginForm.checkPass" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="submitForm()">登录</el-button>
                    <el-button @click="resetForm()">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    //引入工具函数
    import { pwdReg } from '@/utils/reg';
    //引入请求函数
    import { checkLogin } from '@/api/login';

    import local from '@/utils/local'
    export default {
        data(){
            //自定义验证函数
            //验证密码
            const checkPwd = (rule,value,callback) => {
                //获取长度
                const len = value.length;
                //判断
                if(value === ''){
                    //非空验证
                    callback(new Error('密码不能为空'))
                }else if(len < 3 || len > 6){
                    //长度验证
                    callback(new Error('长度为3 ~ 6 位'))
                }else if(!pwdReg(value)){
                    //正则验证
                    callback(new Error('只可输入字母和数字'))
                }else{
                    //确认密码不为空，触发一致性验证
                    if(this.loginForm.checkPass !== ''){
                        this.$refs.loginForm.validateField('checkPass')
                    }
                    //成功
                    callback()
                }
            }
            //验证确认密码
            const confirmPwd = (rule,value,callback) => {
                if(value === ''){
                    //非空验证
                    callback(new Error('请再次输入密码'))
                }else if (value !== this.loginForm.password){
                    //一致性验证
                    callback(new Error('两次密码不一致'))
                }else{
                    callback(); //成功
                }
            }
            return {
                //登录表单数据
                loginForm: {
                    account : '',   //账号
                    password : '',  //密码
                    checkPass : ''  //确认密码
                },
                //验证规则
                rules: {
                    //账号
                    account : [
                        { required: true, message: '请输入账号', trigger: 'blur' },
                        { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    ],
                    //密码
                    password : [
                        //自定义验证
                        { required: true, validator : checkPwd, trigger: 'blur'}    
                    ],
                    //确认密码
                    checkPass : [
                        { required: true, validator : confirmPwd, trigger: 'blur'}
                    ]
                }
            }
        },
        methods : {
            //登录
            submitForm(){
                this.$refs.loginForm.validate((valid) => {
                    if(valid){
                       //收集参数
                       let params = {
                           account : this.loginForm.account,
                           password : this.loginForm.password
                       }
                        //发送请求
                        checkLogin(params)  
                            .then(res => {
                                //接收响应
                                let {code , msg , token} = res;
                                //判断
                                if(code === 0 ){
                                    // console.log('生成token：',token);
                                    //把token存入本地存储
                                    local.set('zxc_token',token)
                                    this.$message({
                                        type: 'success',
                                        message: msg
                                    })
                                    //跳转页面
                                    setTimeout(() => {
                                        this.$router.push('/home')
                                    },1000)
                                   
                                }else if(code === 1){
                                    this.$message.error( msg )
                                }
                            })
                            .catch(err => {
                                console.log(err);  
                            })
                    }else {
                        console.log('前端验证不通过！');
                        return false;
                    }
                })
            }, 
            //重置
            resetForm(){
                this.$refs.loginForm.resetFields();
            }
        }
    }
</script>

<style lang="less">
    //引入样式
    @import './login.less';
</style>
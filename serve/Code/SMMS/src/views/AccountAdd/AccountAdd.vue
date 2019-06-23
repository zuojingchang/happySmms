<template>
    <div class="account-add">
        <!-- 卡片 -->
       <el-card class="box-card">
           <!-- 头部 -->
            <div slot="header" class="clearfix">
                <h2>账号添加</h2>
            </div>
            <!-- 身体 -->
            <div class="tiem">
                <el-form 
                :model="accountTableData" 
                status-icon 
                :rules="rules" 
                ref="accountTableData" 
                label-width="100px"
                style="width:315px;" 
                >
                    <!-- 账号 -->
                    <el-form-item label="账号" prop="account">
                        <el-input type="text" v-model="accountTableData.account" autocomplete="off"></el-input>
                    </el-form-item>
                    <!-- 密码 -->
                    <el-form-item label="密码" prop="password">
                        <el-input type="text" v-model="accountTableData.password" autocomplete="off"></el-input>
                    </el-form-item>
                    <!-- 确认密码 -->
                    <el-form-item label="确认密码" prop="checkPass">
                        <el-input type="text" v-model="accountTableData.checkPass" autocomplete="off"></el-input>
                    </el-form-item>
                    <!-- 用于分组 -->
                    <el-form-item label="选择用户组" prop="userGroup">
                        <el-select v-model="accountTableData.userGroup" placeholder="选择用户组">
                            <el-option label="超级管理员" value="超级管理员"></el-option>
                            <el-option label="普通用户" value="普通用户"></el-option>
                        </el-select>
                    </el-form-item>
                    <!-- 添加/重置 -->
                    <el-form-item>
                        <el-button type="primary" @click="submitForm()">添加</el-button>
                        <el-button @click="resetForm()">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
    </div>
</template>

<script>
    //引入工具函数
    import { pwdReg } from '@/utils/reg'

    import { accountAdd, accountRename} from '@/api/account';
    export default {   
        data (){
            //账号验证请求
            const checkaccount = (rule,value,callback) =>{
                //获取输入的密码的长度
                let len = value.length
                //判断
                if(value === ''){   //非空验证
                    callback(new Error('账号不能为空'))
                }else if (len < 3 || len > 6 ){   //长度验证
                    callback(new Error('账号长度为3 ~ 6 位'))
                }else{
                    
                    accountRename({account: value})
                        .then(res => {
                            let {code ,msg} = res;
                                if(code === 0){
                                    callback(new Error(msg))
                                }else if(code === 1){
                                    callback()
                                }
                            })
                        .catch(err => {
                            console.log(err);
                        })
                }
            }
            //自定义验证函数
            //密码验证
            const checkPwd = (rule,value,callback) =>{
                //获取输入的密码的长度
                let len = value.length
                //判断
                if(value === ''){   //非空验证
                    callback(new Error('密码不能为空'))
                }else if (len < 3 || len > 6 ){   //长度验证
                    callback(new Error('密码长度为3 ~ 6 位'))
                }else if (!pwdReg(value)){  //正则验证
                    callback(new Error('密码只是字母和数字'))
                }else {     //反向验证   一致性验证
                    if(this.accountTableData.checkPass !== ''){
                        this.$refs.accountTableData.validateField('checkPass')
                    }
                    //成功
                    callback()
                }
            }
            //确认密码
            const confirmPwd = (rule,value,callback) => {
                if(value === ''){   //非空验证
                    callback(new Error('确认密码不能为空'))
                }else if(value !== this.accountTableData.password){
                    callback(new Error('两次密码不一致'))
                }else{
                    //成功
                    callback();
                }
            }
            return {
                accountTableData : {
                    account : '',
                    password : '',
                    checkPass : '',
                    userGroup : ''
                },
                rules : {
                    account : [
                        { required: true, validator: checkaccount, trigger: 'blur'}
                    ],
                    password : [
                        //自定义验证
                        { required: true, validator : checkPwd, trigger: 'blur'}
                    ],
                    checkPass : [
                        { required: true, validator : confirmPwd, trigger: 'blur'}
                    ],
                    userGroup : [
                        { required: true, message: '请选择用户组', trigger: 'change' }    //非空验证
                    ]
                }           
            }
        },
        methods : {
            //添加
            submitForm(){
                this.$refs.accountTableData.validate((valid) => {
                    if(valid){
                        //收集参数
                        let params = {
                            account : this.accountTableData.account,
                            password : this.accountTableData.password,
                            userGroup : this.accountTableData.userGroup                  
                        }
                        //添加账号请求
                        accountAdd(params)
                        .then(res =>{
                            //接收后端响应数据
                            let { code , msg } = res;             
                            //判断
                            if(code === 0){
                                //成功提示
                                this.$message({
                                    message : msg,
                                    type : 'success'
                                })
                                //跳转到账号管理页面
                                this.$router.push('/home/accountmanage')
                            }else if( code === 1){ //失败
                                //弹失败提示
                                this.$message.error( msg )
                            }                          
                        })
                        .catch(err => {
                            console.log(err);       
                        }) 
                    }else{
                        console.log('前端验证不同过');
                        return false;
                    }
                })
            },
            resetForm(){
                this.$refs.accountTableData.resetFields();
            }
        }
    }
</script>

<style lang="less">
    .account-add{
        .el-card{
            .el-card__header{
                background-color: #f1f1f1;
            }
        } 
    }
</style>



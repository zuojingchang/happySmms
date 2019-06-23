<template>
    <div class="password-modify">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <h2>密码修改</h2>
            </div>
            <div class="item">
                <el-form 
                :model="passwordModify" 
                status-icon 
                :rules="rules" 
                ref="passwordModify" 
                label-width="100px"
                style="width:315px;" 
                >
                    <!-- 旧密码 -->
                    <el-form-item label="旧密码" prop="oldPassword">
                        <el-input type="text" v-model="passwordModify.oldPassword" autocomplete="off"></el-input>
                    </el-form-item>
                    <!-- 新密码 -->
                    <el-form-item label="新密码" prop="newPassword">
                        <el-input type="text" v-model="passwordModify.newPassword" autocomplete="off"></el-input>
                    </el-form-item>
                    <!-- 确认新密码 -->
                    <el-form-item label="确认新密码" prop="checkNewPassword">
                        <el-input type="text" v-model="passwordModify.checkNewPassword" autocomplete="off"></el-input>
                    </el-form-item>
                   
                    <!-- 确定按钮 -->
                    <el-form-item>
                        <el-button type="success" @click="submitForm()">确定</el-button> 
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
    </div>
</template>

<script>
    //引入工具函数
    import { pwdReg } from '@/utils/reg'

    import local from '@/utils/local'

    import { checkOldPass,passwordModify } from '@/api/account';
    export default {
        data(){
            //旧密码验证
            const checkOldPwd = (rule,value,callback) =>{
                //获取输入的密码的长度
                let oldLen = value.length
                //判断
                if(value === ''){   //非空验证
                    callback(new Error('密码不能为空'))
                }else{
                        checkOldPass({oldPwd : value})
                            .then(res => {
                                //接收后端响应
                                let { code , msg } = res;
                                if(code === 1){
                                    //密码错误提示
                                  callback(new Error( msg ))
                                }else if(code === 0){
                                    callback()  //成功
                                }  
                            })
                            .catch(err => {
                                console.log(err);  
                            })
                    }  
                }
            //新密码验证
            const checkNewPwd = (rule,value,callback) =>{
                //获取输入的密码的长度
                let newLen = value.length
                //判断
                if(value === ''){   //非空验证
                    callback(new Error('密码不能为空'))
                }else if (newLen < 3 || newLen > 6 ){   //长度验证
                    callback(new Error('密码长度为3 ~ 6 位'))
                }else if (!pwdReg(value)){  //正则验证
                    callback(new Error('密码只是字母和数字'))
                }else if( value === this.passwordModify.oldPassword ){
                    callback( new Error('新密码不能与旧密码一致'))
                }else {     //反向验证   一致性验证
                    if(this.passwordModify.checkNewPassword !== ''){
                        this.$refs.passwordModify.validateField('checkNewPassword')
                    }
                    //成功
                    callback()
                }
            }
            //确认新密码
            const ReconfirmNewPwd = (rule,value,callback) => {
                if(value === ''){   //非空验证
                    callback(new Error('确认密码不能为空'))
                }else if(value !== this.passwordModify.newPassword){
                    callback(new Error('两次密码不一致'))
                }else{
                    //成功
                    callback();
                }
            }
            return {
                passwordModify : {
                    oldPassword : '',
                    newPassword : '',
                    checkNewPassword : ''
                },
                rules : {
                    oldPassword : [
                        { required: true, validator : checkOldPwd, trigger: 'blur'}
                    ],
                    newPassword : [
                        { required: true, validator : checkNewPwd, trigger: 'blur'}
                    ],
                    checkNewPassword : [
                         { required: true, validator : ReconfirmNewPwd, trigger: 'blur'}
                    ]
                }            
            }
        },
        methods : {
            submitForm(){
                this.$refs.passwordModify.validate((valid) => {
                    if(valid){
                //发送请求
                passwordModify({newPassword : this.passwordModify.newPassword})
                        .then(res => {
                            //接收响应参数
                            let {code, msg} = res;
                            if(code === 0){
                                this.$message({
                                    type : 'success',
                                    message : msg
                                })
                                local.remove('zxc_token')
                                this.$router.push('/login')
                            } else if(code === 1){
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
            }
        }
    }
</script>

<style lang="less">
    .password-modify{
        .el-card{
            .el-card__header{
                background-color: #f1f1f1;
            }
        } 
    }
</style>
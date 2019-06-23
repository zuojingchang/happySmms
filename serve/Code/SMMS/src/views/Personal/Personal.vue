<template>
    <div class="personal">
        <!-- 卡片 -->
        <el-card class="box-card">
           <!-- 头部 -->
            <div slot="header" class="clearfix">
                <h1>个人中心</h1>
            </div>
            <!-- 身体 -->
            <div class="tiem">
                <el-row> 
                    <el-col :span="12">
                        <div class="file"> 
                            <el-upload
                            class="avatar-uploader"
                            action="#"
                            :http-request="uploadAvatar"
                            :on-success="handleAvatarSuccess"
                            :show-file-list="false"
                            :before-upload="beforeAvatarUpload">
                            <img v-if="imageUrl" :src="imageUrl" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="info">
                            <h1>用户ID：{{ userInfo.id }}</h1>
                            <h1>用户名：{{ userInfo.account }}</h1>
                            <h1>密码：{{ userInfo.password }}</h1>
                            <h1>用户组：{{ userInfo.userGroup }}</h1>
                            <h1>创建时间：{{ userInfo.ctime | filterCtime }}</h1>
                        </div> 
                    </el-col>
                </el-row>     
            </div>
        </el-card>
    </div>
</template>

<script>
 //引入时间格式模块
import moment from 'moment'
//引入模块
import { getInfo } from '@/api/account'
import axios from 'axios'
    export default {
        data (){
            return {
                userInfo : {},
                imageUrl: ''
            }
        },
        methods : {
            //获取用户信息
            getUserInfo(){
                //发送用户信息请求
                getInfo()
                    .then(res => {
                        //接收响应参数
                        let { data } = res; 
                        this.userInfo = data[0]
                    })
                    .catch(err => {
                        console.log(err);
                    })
            },
            //头像上传成功
            handleAvatarSuccess(res, file) {
                this.imageUrl = URL.createObjectURL(file.raw);
            },
            //头像上传之前回调
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            },
            //上传函数
            uploadAvatar(file){
                //创建一个formData对象
                let formData = new FormData();
                //把文件数据放入formData
                formData.append('file',file.file)
                //发送axios给后端，把文件新传给后端
                axios.post('/account/uploadavatar',formData) 
                    .then(response => {
                        //获取地址
                        let { avatarUrl } = response.data;
                        console.log(avatarUrl);
                        
                        //回填
                        this.imageUrl = 'http://127.0.0.1:666' + avatarUrl;

                        //传递个父组件
                        this.$emit('自定义事件')
                    })
                    .catch(err => {
                        console.log(err);
                    })
            }

        },
        created () {
            this.getUserInfo()
        },
        filters :{
            //过滤时间格式
            filterCtime(ctime){
                return moment(ctime).format('YYYY/MM/DD HH:mm:ss a')
            }
        }
    }
</script>

<style lang="less">
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
    .info{
        h1{
            font-size: 30px;
            line-height: 40px;
            color: rgb(48, 65, 86);
        }
    }
</style>
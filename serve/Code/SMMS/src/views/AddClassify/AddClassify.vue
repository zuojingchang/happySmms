<template>
    <div class="add-classify">
        <!-- 卡片 -->
        <el-card class="box-card">
           <!-- 头部 -->
            <div slot="header" class="clearfix">
                <h2>添加分类</h2>
            </div>
            <!-- 身体 -->
            <div class="tiem">
                <el-form 
                :model="addClassify" 
                status-icon 
                :rules="rules" 
                ref="addClassify" 
                label-width="100px"
                style="width:315px;"
                >
                    <!-- 所属分类 -->
                    <el-form-item label="所属分类" prop="classify">
                        <el-select v-model="addClassify.classify" placeholder="顶级分类"> 
                            <el-option label="烟酒" value="烟酒"></el-option>
                            <el-option label="饮料" value="饮料"></el-option>
                            <el-option label="果蔬" value="果蔬"></el-option>
                        </el-select>
                    </el-form-item>
                    <!-- 分类名称 -->
                    <el-form-item label="分类名称" prop="classifyName">
                        <el-input type="text" v-model="addClassify.classifyName" autocomplete="off"></el-input>
                    </el-form-item>
                    <!-- 状态 -->
                    <el-form-item label="状态" prop="status">
                        <el-radio-group v-model="addClassify.status">
                        <el-radio label="启用"></el-radio>
                        <el-radio label="禁用"></el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <!-- 启用 -->
                    <el-form-item>
                        <el-button type="success" @click="submitForm()">启用</el-button>
                    </el-form-item>

                </el-form>
            </div>
        </el-card>
    </div>
</template>

<script>
    export default {
        data (){
            return {
                addClassify : {
                    classify : '',
                    classifyName : '',
                    status : ''
                },
                //验证规则
                rules : {
                    classify : [
                       { required: true, message: '请选择所属分类', trigger: 'change' }
                    ],
                    classifyName : [
                        { required: true, message: '请输入名称', trigger: 'blur' }
                    ],
                    status : [
                        { required: true, message: '请选择状态', trigger: 'change' }
                    ]
                }
            }
        },
        methods : {
            submitForm (){
                this.$refs.addClassify.validate((valid) => {
                    if(valid){
                        alert('添加分类成功！')
                    }else{
                        return false;
                    }
                })
            }
        }
    }
</script>

<style lang="less">

</style>
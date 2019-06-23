<template>
    <div class="account-manage">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <h2>账号管理</h2>
            </div>
            <div>
                <!-- 表格 -->
                <el-table
                    ref="accountTableManage"
                    :data="accountTableManage"
                    tooltip-effect="dark"
                    style="width: 100%"
                    @selection-change="selectChange"
                    >
                    <!-- 选择框 -->
                    <el-table-column
                        type="selection"
                        width="55">
                    </el-table-column>
                    <!-- 账号 -->
                    <el-table-column
                        prop="account"
                        label="用户名称"
                        >
                    </el-table-column>
                    <!-- 用户组 -->
                     <el-table-column
                        prop="userGroup"
                        label="用户组"
                        >
                    </el-table-column>
                    <!-- 日期 -->
                    <el-table-column
                        label="日期"
                        >
                        <template slot-scope="scope">{{ scope.row.ctime | filterCtime }}</template>
                    </el-table-column>
                    <!-- 操作 -->
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <!-- 编辑按钮 -->
                            <el-button 
                            @click="handleEdit(scope.row.id)"
                            type="primary" 
                            size="small"
                            >
                            <i class="el-icon-edit"></i>
                            编辑
                            </el-button>
                            <!-- 删除按钮 -->
                             <el-button 
                            @click="handleDelect(scope.row.id)"
                            type="danger" 
                            size="small"
                            >
                            <i class="el-icon-delete"></i>
                            删除
                            </el-button>   
                        </template>
                    </el-table-column>
                </el-table>

                <!-- 分页 -->
                <div style="margin:30px 0 0 400px">
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-sizes="[1, 3, 5, 10, 20]"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total">
                    </el-pagination>
                </div>
                
                <!-- 批量删除和取消选择按钮 -->
                <div style="margin-top:30px">
                    <el-button @click="batchDel" type="danger">批量删除</el-button>
                    <el-button @click="deselect" type="primary">取消选择</el-button>
                </div>
                <!-- 编辑保存模态框 -->
                <el-dialog title="账号修改" :visible.sync="visible" width=400px>
                        <!-- 账号 -->
                    <el-form ref="editForm" :model="editForm" style="width:315px" :rules="rules">
                        <el-form-item label="账号" label-width="120px" prop="account">
                            <el-input v-model="editForm.account" autocomplete="off"></el-input>
                        </el-form-item>
                        <!-- 用户组 -->
                        <el-form-item label="用户组" label-width="120px">
                            <el-select v-model="editForm.userGroup" placeholder="请选择用户组">
                                <el-option label="超级管理员" value="超级管理员"></el-option>
                                <el-option label="普通用户" value="普通用户"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="visible = false">取 消</el-button>
                        <el-button type="primary" @click="saveEdit">确 定</el-button>
                    </div>
                </el-dialog>
            </div>
        </el-card>
    </div>
</template>

<script>
    //引入时间格式模块
    import moment from 'moment'

    import { batchDel,accountEdit, accountDel, saveEdit, getDataByPage} from '@/api/account';

    export default {
        data(){
            return {
               accountTableManage : [], //账号表格数据
               total : 0,  //数据总条数
               pageSize : 5, //每页条数
               currentPage : 1, //当前页
               visible : false, //修改模态框的显示和隐藏状态
               editForm : {
                   account : '',
                   userGroup : ''
               },
               editId : '',     
               //验证规则
               rules : {
                   account : [  //账号验证
                       {required : true, message : '账号不能为空',trigger : 'change'},
                       {min : 3 ,max : 6, message : '长度为 3 ~ 6 位',trigger :'change'}
                   ]
               },
               delIdArr : []    //批量删除数组
            }
        },
        methods : {
            //批量删除
            batchDel(){
                if(!this.delIdArr.length){
                    this.$message.error('请选中再删除')
                    return;
                }
                //优化批量删除
                this.$confirm('确定要批量删除吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    })
                    .then(() => {
                         //发送删除请求
                       batchDel({idArr : this.delIdArr})
                        .then( res => {
                            //接收响应
                            let {code, msg} = res;
                            //判断
                            if(code === 0){ //成功响应
                                this.$message({
                                    type : 'success',
                                    message : msg
                                })
                                //调用刷新页面函数
                                this.getAccountsByPage()
                            }else if(code === 1){   //失败响应
                                this.$message.error( msg )
                            }   
                        })
                        .catch( err => {
                            console.log(err);     
                        })
                    })
                    .catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });          
                    });       
            },
            //表格选中状态的改变事件
            selectChange(selectData){
                //循环选中的数据 把每一项的id取出来 放入一个数组中
                this.delIdArr = selectData.map( v => v.id)    
            },   
            //取消选择
            deselect(){
                //选中整个表格调用取消选择方法
                this.$refs.accountTableManage.clearSelection()
            },
            //编辑
            handleEdit(id){
                //点击编辑弹出模态框
                this.visible = true;
                //保留id  这个id就是要修改数据的id
                this.editId = id;
                //发送请求
                accountEdit({ id })
                .then(res => {
                    //接收后端响应的数据
                    let { data } = res;
                    //回填表单   从data数组中取第一个元素对象，再点属性
                    this.editForm.account = data[0].account;
                    this.editForm.userGroup = data[0].userGroup;  
                })
                .catch(err => {
                    console.log(err);
                })
            },
            //删除
            handleDelect(id){
                this.$confirm('你确定要删除吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                .then(() => {
                    accountDel({ id })
                        .then(res =>{
                            let { code,msg } = res;
                            //判断
                            if(code === 0){
                                //成功提示
                                this.$message({
                                    message : msg,
                                    type : 'success'
                                })
                                //重新请求一次数据，刷新页面
                                this.getAccountsByPage()
                            }else if(code === 1){
                                //失败提示
                                this.$message.error(msg)
                            }
                        })
                            .catch(err => {
                                console.log(err);  
                            })
                        })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
                });             
            },
            //点击确定编辑保存函数
            saveEdit(){
                //调用表单验证
                this.$refs.editForm.validate((valid) => {
                    //判断
                    if(valid){  //所有前端验证通过
                        //修改模态框为隐藏
                        this.visible = false;
                        //收集参数
                        let params = {
                            account : this.editForm.account,
                            userGroup : this.editForm.userGroup,
                            id : this.editId
                        }
                        //发送数据给后端
                        saveEdit( params )
                            .then(res => {
                                //接收后端响应的数据
                                let {code, msg} = res;
                                //判断
                                if(code === 0){
                                    this.$message({
                                        type : 'success',
                                        message : msg
                                    })
                                    //渲染页面
                                    this.getAccountsByPage()
                                }else if(code === 1){
                                    this.$message.error( msg )
                                }
                            })
                          .catch(err => {
                                console.log(err);           
                            })
                    }else{  //否则不能提交
                        return false;
                    }
                })
            },
            //pageSize(每页条数)改变
            handleSizeChange(pageSize){
                this.pageSize = pageSize //把用户选择的每页条数获取，赋给data中的pageSize    
                this.getAccountsByPage()
            },
            //currentPage(当前页) 改变
            handleCurrentChange(currentPage){
               this.currentPage = currentPage  //把用户选择的当前页获取，赋值给data中的currentPage
               this.getAccountsByPage()
            },
            //按照分页请求封装函数
            getAccountsByPage (){
                //收集参数
                let params = {
                    pageSize : this.pageSize,
                    currentPage : this.currentPage
                }
                getDataByPage(params)
                    .then(res => {
                        //接收响应
                        let {data,total} = res;
                        //渲染页面
                        this.total = total;
                        this. accountTableManage = data;  
                        //边界判断      当前页为第一页时，不执行
                        if(!data.length && this.currentPage !== 1){
                            this.currentPage -= 1;
                            this.getAccountsByPage();
                        } 
                    })
                    .catch(err => {
                        console.log(err);
                    })
            }
        },
        created (){
            //刷新页面函数
            this.getAccountsByPage()
        },
        filters :{
            //过滤时间格式
            filterCtime(ctime){
                return moment(ctime).format('YYYY/MM/DD hh:mm:ss a')
            }
        }
    }
</script>

<style lang="less">
    .account-manage{
        .el-card{
            .el-card__header{
                background-color: #f1f1f1;
            }
        }
    }
</style>
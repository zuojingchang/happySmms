<template>
    <div class="goods-manage">
        <!-- 卡片 -->
        <el-card class="box-card">
           <!-- 头部 -->
            <div slot="header" class="clearfix">
                <h2>商品管理</h2>
            </div>
            <!-- 身体 -->
            <div class="tiem">
                <!-- 表格 -->
                <el-form
                :inline="true" 
                :model="searchForm" 
                class="demo-form-inline"
                size="mini">
                     <el-form-item label="">
                        <el-select v-model="searchForm.classify" placeholder="选择分类">
                            <el-option label="全部分类" value="全部分类"></el-option>
                            <el-option label="烟酒" value="烟酒"></el-option>
                            <el-option label="饮料" value="饮料"></el-option>
                            <el-option label="果蔬" value="果蔬"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="关键字:">
                        <el-input v-model="searchForm.keyword" placeholder=""></el-input>
                    </el-form-item>

                    <el-form-item>
                        （商品名称，条形码）
                        <el-button type="success" @click="search">查询</el-button>
                    </el-form-item>

                </el-form>

                <div style="height:2px;border:1px solid #ccc"></div>

                <!-- 表单 -->
                <el-table
                    ref="goodsManage"
                    :data="goodsManage"
                    tooltip-effect="dark"
                    style="width: 100%"
                    @selection-change="selectChange"
                    >
                     <!-- 选择框 -->
                    <el-table-column
                        type="selection"
                        width="55">
                    </el-table-column>
                    <!-- 商品条形码 -->
                    <el-table-column
                    prop="barCode"
                    label="商品条形码"
                    >
                    </el-table-column>

                    <!-- 商品名称 -->
                    <el-table-column
                    prop="goodsName"
                    label="商品名称"
                    >
                    </el-table-column>

                    <!-- 所属分类 -->
                    <el-table-column
                    prop="classify"
                    label="所属分类">
                    </el-table-column>

                    <!-- 售价(元) -->
                    <el-table-column
                    prop="goodsPrice"
                    label="售价(元)">
                    </el-table-column>

                    <!-- 市场价(元) -->
                    <el-table-column
                    prop="marketPrice"
                    label="市场价(元)">
                    </el-table-column>
                    <!-- 日期 -->
                    <el-table-column label="日期">
                        <template slot-scope="scope">{{ scope.row.ctime | filterCtime }}</template>
                    </el-table-column>

                    <!-- 管理 -->
                   <el-table-column label="操作">
                        <template slot-scope="scope">
                            <!-- 编辑 -->
                            <el-button 
                            @click="handleEdit(scope.row.id)" 
                            type="primary" 
                            size="small"
                            >
                            <i class="el-icon-edit"></i>
                            编辑
                            </el-button>
                            <!-- 删除 -->
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
                <!-- 编辑保存模态框 -->
                <el-dialog title="商品管理" :visible.sync="visible" width="600px">

                    <el-form ref="editForm" :model="editForm" style="width:315px" :rules="rules">
                        <!-- 选择分类 -->
                        <el-form-item label="所属分类" label-width="120px">
                            <el-select v-model="editForm.classify" placeholder="请选择分类">
                                <el-option label="烟酒" value="烟酒"></el-option>
                                <el-option label="饮料" value="饮料"></el-option>
                                <el-option label="果蔬" value="果蔬"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="商品条形码" label-width="120px" prop="barCode">
                            <el-input v-model="editForm.barCode"></el-input><el-button type="success" @click="removeDomain(100000000000,999999999999)">生成条形码</el-button>
                        </el-form-item>

                        <el-form-item label="商品名称" label-width="120px" prop="goodsName">
                            <el-input v-model="editForm.goodsName" autocomplete="off"></el-input>
                        </el-form-item>

                        <el-form-item label="商品售价" label-width="120px"
                        prop="goodsPrice">
                            <el-input v-model="editForm.goodsPrice" autocomplete="off"></el-input>
                        </el-form-item>

                         <el-form-item label="市场价" label-width="120px" prop="marketPrice">
                            <el-input v-model="editForm.marketPrice" autocomplete="off"></el-input>
                        </el-form-item>   
                    </el-form>

                    <div slot="footer" class="dialog-footer">
                        <el-button @click="visible = false">取 消</el-button>
                        <el-button type="primary" @click="saveEdit">确 定</el-button>
                    </div>
                </el-dialog>

                <!-- 分页 -->
                <div style="margin:30px 0 0 500px">
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
            </div>
       </el-card>
    </div>
</template>

<script>
    //引入时间格式模块
    import moment from 'moment'

    import { batchDel, goodsEdit, goodsSaveEdit, goodsDel, goodsGetDataByPage,searchGoods} from '@/api/goods';

   
    export default {  
        data (){
            return {
                //查询表单
                searchForm: {
                    classify: '',
                    keyword: ''
                },
                goodsManage : [],  //物品添加表格
                total : 0,  //数据总条数
                currentPage : 1, //当前页
                pageSize : 3,//每页条数
                delIdArr : [],  //批量删除数组
                visible : false,  //修改模态框的显示和隐藏状态
                editForm : {    //模态框的表单
                    classify : '',
                    goodsName : '',
                    goodsPrice : '',
                    marketPrice : '',
                    barCode : ''
                },
                editId : '',     //定义用于保留id
                //验证规则
                rules : {
                    classify : [
                        { required: true, message: '请选择分类', trigger: 'change' }
                    ],
                    barCode : [
                        { required: true, message: '请输入条形码', trigger: 'change' }
                    ],
                    goodsName : [
                        { required: true, message: '请输入商品名称', trigger: 'blur' }
                    ],
                    goodsPrice : [
                        { required: true, message: '请输入商品价格', trigger: 'blur' }
                    ],
                    marketPrice : [
                        { required: true, message: '请输入市场价格', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            //生成条形码
            removeDomain(min,max){
                this.editForm.barCode = Math.floor(Math.random()*(max-min+1)+min)   
            },
            //批量删除
            batchDel(){
                if(!this.delIdArr.length){
                    this.$message.error('请选中在删除！')
                    return;
                }
                //优化批量删除
                this.$confirm('确定要删除吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    })
                    .then(() => {
                        batchDel({idArr : this.delIdArr})
                        .then(res => {
                            //接收响应数据
                            let {code, msg } = res;
                            //判断
                            if(code === 0){
                                this.$message({
                                    type : 'success',
                                    message : msg
                                })
                                //调用刷新页面函数
                                this.getGoodsByPage()
                            }else if(code === 1){
                                this.$message.error( msg )
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
            //表格选中状态的改变事件
            selectChange(selectData){
                //循环选中的数据 把每一项的id取出来 放入一个数组中
                this.delIdArr = selectData.map( v => v.id)    
            },  
            //取消选择
            deselect(){
                //选中整个表格调用取消选择方法
                this.$refs.goodsManage.clearSelection()
            },
            //查询
            search() {
                //调用分页函数
                this.getGoodsByPage()
                // // //收集参数
                // let params = {
                //     classify: this.searchForm.classify,
                //     keyword: this.searchForm.keyword
                // }
                // //发送请求
                // searchGoods(params)
                //     .then(res => {
                //         //接收响应数据
                //         let { data } = res;
                //         //渲染页面
                //         this.goodsManage = data;

                //     })
                //     .catch(err => {
                //         console.log(err);
                        
                //     })
            },
            //编辑
            handleEdit(id){
                //点击弹出模态框
                this.visible = true;
                //保留id  这个id就是要修改数据的id
                this.editId = id;
                //发送请求
                goodsEdit({id})
                .then(res => {
                    //接收请求
                    let { data } = res;
                    //回填表单  从data数组中取第一个元素对象，再点属性
                    this.editForm.classify = data[0].classify
                    this.editForm.goodsName = data[0].goodsName
                    this.editForm.goodsPrice = data[0].goodsPrice
                    this.editForm.marketPrice = data[0].marketPrice
                    this.editForm.barCode = data[0].barCode
                })
                .catch(err => {
                    console.log(err);
                })
            },
            //点击确定编辑保存函数
            saveEdit(){
                //优化函数
                this.$confirm('确认要修改商品参数吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    })
                    .then(() => {
                        //调用表单验证
                        this.$refs.editForm.validate((valid) => {
                            if(valid) {
                                this.visible = false;
                                //收集参数
                                let params = {
                                    classify : this.editForm.classify,
                                    goodsName : this.editForm.goodsName,
                                    goodsPrice : this.editForm.goodsPrice,
                                    marketPrice : this.editForm.marketPrice,
                                    barCode : this.editForm.barCode,
                                    id : this.editId
                                }
                                //发送数据给后端
                                goodsSaveEdit(params)
                                .then(res => {
                                    //接收响应参数
                                    let {code , msg} = res;
                                    if(code === 0){
                                        this.$message({
                                            type : 'success',
                                            message : msg
                                        })
                                        //调用刷新页面函数
                                        this.getGoodsByPage()
                                    }else if(code === 1){
                                        this.$message.error( msg )
                                    }
                                })
                                .catch(err => {
                                    console.log(err);
                                })
                            }else {
                                return false;
                            }
                        })
                    })
                    .catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });          
                    });


                
            },
            //删除
            handleDelect(id){
                //优化单条删除
                this.$confirm('你确定要删除吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    })
                    .then(() => {
                        goodsDel({id})
                        .then(res => {
                            //接收响应数据
                            let {code, msg} = res;
                            //判断
                            if(code === 0){
                                this.$message({
                                    type : 'success',
                                    message : msg
                                })
                                //调用刷新页面函数
                                this.getGoodsByPage()
                            }else if(code ===1) {
                                this.message.error( msg )
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
            //pageSize(每页条数)改变
            handleSizeChange(pageSize){
                //把用户选择的每页条数获取，赋给data中的pageSize
                this.pageSize = pageSize;
                //调用刷新页面函数
                this.getGoodsByPage()
            },
            //currentPage(当前页) 改变
            handleCurrentChange(currentPage){
                //把用户选择的当前获取，赋给data中的currentPage
                this.currentPage = currentPage;
                //调用刷新页面函数
                this.getGoodsByPage()
            },

            //按照分页请求封装函数
            getGoodsByPage(){
                //收集参数
                let params = {
                    pageSize : this.pageSize,
                    currentPage : this.currentPage,
                    classify: this.searchForm.classify,     //查询分类
                    keyword: this.searchForm.keyword        //查询关键字
                }
                //发送请求
               goodsGetDataByPage(params)
                .then(res => {
                    //接收响应
                    let {data,total} = res;
                    //渲染页面
                    this.total = total;
                    this.goodsManage = data;
                    //边界判断
                    if(!data.length && this.currentPage !== 1){
                        this.currentPage -= 1;
                        this.getGoodsByPage();
                    }
                })
                .catch(err => {
                    console.log(err);
                })
            },
        },
        created(){
            this.getGoodsByPage()
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
    .goods-manage{
        
        .el-card{
            .el-card__header{
                background-color: #f1f1f1;
            }
        }
    }
</style>
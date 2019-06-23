<template>
    <div class="inventory-manage">
         <!-- 卡片 -->
        <el-card class="box-card">
           <!-- 头部 -->
            <div slot="header" class="clearfix">
                <h2>库存管理</h2>
            </div>
            <!-- 身体 -->
            <div class="tiem">
                <el-form
                :inline="true" 
                :model="searchForm" 
                class="demo-form-inline"
                size="mini" >
                     <el-form-item label="">
                        <el-select v-model="searchForm.classify" placeholder="选择分类">
                            <el-option label="全部分类" value="全部分类"></el-option>
                            <el-option label="烟酒" value="烟酒"></el-option>
                            <el-option label="饮料" value="饮料"></el-option>
                            <el-option label="果蔬" value="果蔬"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="关键字：">
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
                    ref="inventoryManage"
                    :data="inventoryManage"
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
                    label="商品条形码">
                    </el-table-column>

                    <!-- 商品名称 -->
                    <el-table-column
                    prop="goodsName"
                    label="商品名称">
                    </el-table-column>

                    <!-- 进价(元) -->
                    <el-table-column
                    prop="purchasingPrice"
                    label="进价(元)">
                    </el-table-column>

                    <!-- 入库 -->
                    <el-table-column
                    prop="inLibrary"
                    label="入库">
                    </el-table-column>

                    <!-- 库存 -->
                    <el-table-column
                    prop="inventory"
                    label="库存">
                    </el-table-column>

                     <!-- 日期 -->
                    <el-table-column label="日期">
                        <template slot-scope="scope">{{ scope.row.ctime | filterCtime }}</template>
                    </el-table-column>

                    <!-- 管理 -->
                   <el-table-column label="管理">
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
                        <!-- 商品条形码 -->
                        <el-form-item label="商品条形码" label-width="120px" prop="barCode">
                            <el-input v-model="editForm.barCode"></el-input><el-button type="success" @click="removeDomain(100000000000,999999999999)">生成条形码</el-button>
                        </el-form-item>
                        <!-- 商品名称 -->
                        <el-form-item label="商品名称" label-width="120px" prop="goodsName">
                            <el-input v-model="editForm.goodsName" autocomplete="off"></el-input>
                        </el-form-item>
                        <!-- 商品进价 -->
                        <el-form-item label="商品进价" label-width="120px"
                        prop="purchasingPrice">
                            <el-input v-model="editForm.purchasingPrice" autocomplete="off"></el-input>
                        </el-form-item>
                        <!-- 入库 -->
                        <el-form-item label="入库" label-width="120px" prop="inLibrary">
                            <el-input v-model="editForm.inLibrary" autocomplete="off"></el-input>
                        </el-form-item> 
                         <!-- 库存 -->
                        <el-form-item label="库存" label-width="120px" prop="inventory">
                            <el-input v-model="editForm.inventory" autocomplete="off"></el-input>
                        </el-form-item>   

                    </el-form>

                    <div slot="footer" class="dialog-footer">
                        <el-button @click="visible = false">取 消</el-button>
                        <el-button type="primary" @click="saveEdit">确 定</el-button>
                    </div>
                </el-dialog>


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
            </div>
        </el-card>
    </div>
</template>

<script>
    //引入时间格式模块
    import moment from 'moment'

    import { getDataByPage,stockmanageDel,batchDelete,stockManageEdit,stockManageEditSave,stockSearch } from '@/api/stockManage';
    export default {
        data (){
            return {
                searchForm: {
                    classify: '',
                    keyword: ''
                },
                inventoryManage : [],
                currentPage : 1, //当前页
                pageSize : 3, //每页条数
                total : 50,  //数据总条数
                editId : '', //保留id
                delIdArr : [],  //批量删除数组
                editForm : {    //模态框表单
                    barCode : '',   //商品条形码
                    goodsName : '',     //商品名称
                    purchasingPrice : '',   //进价
                    inLibrary : '', //入库
                    inventory : '',
                },
                visible : false,  //修改模态框的显示和隐藏状态
                //验证规则
                rules : {
                    barCode : [
                        { required: true, message: '不能为空', trigger: 'change' }
                    ],
                    goodsName : [
                        { required: true, message: '不能为空', trigger: 'blur' }
                    ],
                    purchasingPrice : [
                        { required: true, message: '不能为空', trigger: 'blur' }
                    ],
                    inLibrary : [
                        { required: true, message: '不能为空', trigger: 'blur' }
                    ],
                    inventory : [
                        { required: true, message: '不能为空', trigger: 'blur' }
                    ],
                }
            }
        },
        methods : {
            //生成条形码
            removeDomain(min,max){
                this.editForm.barCode = Math.floor(Math.random()*(max-min+1)+min)   
            },
            //批量删除
            batchDel(){
                if(!this.delIdArr.length){
                    this.$message.error('请先选中在删除')
                    return;
                }
                this.$confirm('确定要删除吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                        })
                    .then(() => {
                        //发送请求
                        batchDelete({idArr : this.delIdArr})
                            .then(res => {
                                //接收响应参数
                                let {code,msg} = res;
                                //判断
                                if(code === 0){
                                    this.$message({
                                        type: 'success',
                                        message : msg
                                    })
                                    //调用刷新页面函数
                                    this.getInventoryManageByPage();
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
                //循环选中的数据，把每一项的id取出来，放入一个数组中
                this.delIdArr = selectData.map( v => v.id)
            },
            //取消选择
            deselect(){
                this.$refs.inventoryManage.clearSelection()
            },

            //查询
            search() {
                //调用分页函数
                this.getInventoryManageByPage()
                // //收集参数
                // let params = {
                //     classify : this.searchForm.classify,
                //     keyword : this.searchForm.keyword
                // }
                // //发送请求
                // stockSearch(params)
                //     .then(res => {
                //         console.log(res);
                //         //接收响应数据
                //         let { data } = res;
                //         //渲染页面   
                //         this.inventoryManage = data; 
                //     })
                //     .catch(err => {
                //         console.log(err);
                        
                //     })
            },
            //编辑
            handleEdit(id){
                //点击弹出模态框
                this.visible = true;
                //保留id 这个id就是要修改数据的id
                this.editId = id
                //发送请求
                stockManageEdit({ id })
                    .then(res => {
                        //接收响应数据
                        let {data} = res;
                        //回填表单
                        this.editForm.barCode = data[0].barCode;
                        this.editForm.goodsName = data[0].goodsName;
                        this.editForm.purchasingPrice = data[0].purchasingPrice;
                        this.editForm.inLibrary = data[0].inLibrary;
                        this.editForm.inventory = data[0].inventory;
                    })
                    .catch(err => {
                        console.log(err);    
                    })
            },
            //点击确定编辑保存函数
            saveEdit(){
                //优化函数
                this.$confirm('确定需要修改吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                        })
                    .then(() => {
                         //调用表单验证
                        this.$refs.editForm.validate((valid) => {
                            //判断
                            if(valid){  //所有前端验证通过
                                //修改模态框为隐藏
                                this.visible = false;
                                //收集参数
                                let params = {
                                    barCode : this.editForm.barCode,  
                                    goodsName : this.editForm.goodsName,
                                    purchasingPrice : this.editForm.purchasingPrice,
                                    inLibrary :  this.editForm.inLibrary,              
                                    inventory : this.editForm.inventory,
                                    id : this.editId
                                }
                                //发送数据给后端
                                stockManageEditSave(params)
                                    .then(res => {
                                        //接收响应参数
                                        let {code, msg} = res;
                                        //判断
                                        if(code === 0){
                                            //成功
                                            this.$message({
                                                type : 'success',
                                                message : msg
                                            })
                                            //调用刷新页面函数
                                            this.getInventoryManageByPage()
                                        }else if(code === 1){
                                            //失败
                                            this.$messag.error( msg )
                                        }
                                        
                                    })
                                    .catch(err => {
                                        console.log(err);                       
                                    })
                            }else{  //否则不能提交
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
                this.$confirm('确定要删除吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    })
                    .then(() => {
                        stockmanageDel({ id })
                        .then(res => {
                            //接收响应参数
                            let {code, msg} = res;
                            //判断
                            if(code === 0){
                                //成功
                                this.$message({
                                    type : 'success',
                                    message : msg
                                })
                                //调用刷新页面函数
                                this.getInventoryManageByPage()
                            }else if(code === 1){
                                //失败
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
            //pageSize(每页条数)改变
            handleSizeChange(pageSize){
                //把用户选择的每页条数获取，赋给data中的pageSize
                this.pageSize = pageSize;
                //调用刷新页面函数
                this.getInventoryManageByPage()
            },
            //currentPage(当前页) 改变
            handleCurrentChange(currentPage){
                //把用户选择当前页获取，赋值给data中的currentPage
                this.currentPage = currentPage;
                //调用刷新页面函数
                this.getInventoryManageByPage();
            },
            //按照分页请求封装函数
            getInventoryManageByPage(){
                //收集参数
                let params = {
                    pageSize : this.pageSize,
                    currentPage : this.currentPage,
                    classify : this.searchForm.classify,
                    keyword : this.searchForm.keyword
                }
                //发送请求
                getDataByPage(params)
                    .then(res =>{
                        //接收响应数据
                        let {data,total} = res;
                        //渲染页面
                        this.total = total;
                        this.inventoryManage = data;
                        //边界判断  当前页
                        if(!data.length && this.currentPage !==1){
                            this.currentPage -= 1;
                            this.getInventoryManageByPage()
                        }
                    })
                    .catch(err =>{
                        console.log(err);  
                    })
            }
        },
        created(){
            //调用分页刷新页面函数
            this.getInventoryManageByPage()
        },
        filters : {
            filterCtime (ctime){
                return moment(ctime).format('YYYY/MM/DD hh:mm:ss a')
            }
        }
    }
</script>

<style lang="less">

</style>
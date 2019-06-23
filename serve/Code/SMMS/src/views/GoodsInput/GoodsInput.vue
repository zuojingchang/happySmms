<template>
    <div class="goods-input">
         <!-- 卡片 -->
        <el-card class="box-card">
           <!-- 头部 -->
            <div slot="header" class="clearfix">
                <h2>商品入库</h2>
            </div>
            <!-- 身体 -->
            <div class="tiem">
                <el-form 
                :model="goodsInput" 
                status-icon 
                :rules="rules" 
                ref="goodsInput" 
                label-width="100px"
                >   
                    <el-form-item label="所属分类" prop="classify">
                        <el-select v-model="goodsInput.classify" placeholder="选择分类"> 
                            <el-option label="烟酒" value="烟酒"></el-option>
                            <el-option label="饮料" value="饮料"></el-option>
                            <el-option label="果蔬" value="果蔬"></el-option>
                        </el-select>
                    </el-form-item>

                    <!-- 商品条形码 -->
                    <el-form-item label="商品条形码" prop="barCode">
                        <el-input v-model="goodsInput.barCode"></el-input><el-button type="success" @click="removeDomain(100000000000,999999999999)">生成条形码</el-button>
                    </el-form-item>
                     <!-- 商品名称 -->
                    <el-form-item label="商品名称" prop="goodsName">
                        <el-input type="text" v-model="goodsInput.goodsName" autocomplete="off"></el-input>
                    </el-form-item>

                    <!-- 进价 -->
                    <el-form-item label="进价" prop="purchasingPrice">
                        <el-input type="text" v-model="goodsInput.purchasingPrice" autocomplete="off"><span>元</span></el-input>
                         <span>元</span>
                    </el-form-item>

                     <!-- 入库 -->
                    <el-form-item label="入库" prop="inLibrary">
                        <el-input type="text" v-model="goodsInput.inLibrary" autocomplete="off"></el-input>
                        <p>计重商品单位为千克</p>
                    </el-form-item>

                    <!-- 库存 -->
                    <el-form-item label="库存" prop="inventory">
                        <el-input type="text" v-model="goodsInput.inventory" autocomplete="off"></el-input>
                        <p>计重商品单位为千克</p>
                    </el-form-item>

                    <!-- 入库按钮 -->
                    <el-form-item>
                        <el-button type="success" @click="submitForm()">入库</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
    </div>
</template>

<script>
    import { inLibraryAdd } from '@/api/stockManage';
    export default {
        data (){
            return {
                goodsInput :{ 
                    classify : '',  //商品分类
                    barCode : '',   //商品条形码
                    goodsName : '',       //商品名称
                    purchasingPrice : '',   //进价
                    inLibrary : '',   //入库
                    inventory : '',     //库存
                },
                //验证规则
                rules : {
                    classify : [
                        { required: true, message: '请选择分类', trigger: 'change' }
                    ],
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
                        { required: true, message: '不能为空', trigger: 'blur'}
                    ]
                }
            }
        },
        methods : {
            //生成条形码
            removeDomain(min,max){
                this.goodsInput.barCode = Math.floor(Math.random()*(max-min+1)+min)   
            },
            //添加入库
            submitForm (){
                this.$refs.goodsInput.validate((valid) => {
                    if(valid){
                        //收集参数
                        let params = {
                            classify: this.goodsInput.classify,
                            barCode : this.goodsInput.barCode,
                            goodsName : this.goodsInput.goodsName,
                            purchasingPrice : this.goodsInput.purchasingPrice,
                            inLibrary : this.goodsInput.inLibrary,
                            inventory : this.goodsInput.inventory
                        }
                        inLibraryAdd(params)
                            .then(res =>{
                                //接收响应参数
                                let {code , msg} = res;
                                if(code === 0 ){
                                    this.$message({
                                        type : 'success',
                                        message : msg
                                    })
                                    //添加完成跳转页面
                                    this.$router.push('/home/Inventorymanage')
                                }else if(code === 1){
                                    this.$message.error(msg)
                                }
                            })
                            .catch(err =>{
                                console.log(err);
                            })
                    }else{
                        return false;
                    }
                })
            }
        }
    }
</script>

<style lang="less">
    .goods-input{
        .el-card{
            .el-card__header{
                background-color: #f1f1f1;
            }
            .el-card__body{
                .el-form{
                    .el-form-item{
                        .el-form-item__content{
                            .el-input{
                                width: 400px;
                            }   
                        }
                    }
                }
            }
        }
    }

</style>
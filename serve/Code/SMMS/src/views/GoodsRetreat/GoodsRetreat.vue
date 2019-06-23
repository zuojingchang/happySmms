<template>
    <div class="goods-retreat">
         <!-- 卡片 -->
        <el-card class="box-card">
           <!-- 头部 -->
            <div slot="header" class="clearfix">
                <h2>商品退货</h2>
            </div>
            <!-- 身体 -->
            <div class="tiem">
                <el-form 
                :model="goodsRetreat" 
                status-icon 
                :rules="rules" 
                ref="goodsRetreat" 
                label-width="100px"
                >
                     <!-- 商品条形码 -->
                    <el-form-item label="订单号：" prop="orderNumber">
                        <el-input v-model="goodsRetreat.orderNumber"></el-input><el-button style="margin-left:10px" type="success" @click="removeDomain()">查询</el-button>
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
                goodsRetreat : {
                    orderNumber : ''
                },
                rules : {
                    orderNumber : [
                        {
                            required: true, message: '请输入订单号', trigger: 'blur' 
                        }
                    ]
                }
            }
        },
        methods :{
            removeDomain (){
                this.$refs.goodsRetreat.validate((valid) => {
                    if(valid){
                            alert('查询成功！')
                    }else{
                            return false;
                    }
                })
            }
        }
        
    }
</script>

<style lang="less">
    .goods-retreat{
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
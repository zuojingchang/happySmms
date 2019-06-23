<template>
    <div class="goods-add">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <h2>商品添加</h2>
            </div>
            <div class="item">
                <el-form 
                :model="goodsAdd" 
                status-icon 
                :rules="rules" 
                ref="goodsAdd" 
                label-width="100px"
                >
                    <!-- 所属分类 -->
                    <el-form-item label="所属分类" prop="classify">
                        <el-select v-model="goodsAdd.classify" placeholder="选择分类"> 
                            <el-option label="烟酒" value="烟酒"></el-option>
                            <el-option label="饮料" value="饮料"></el-option>
                            <el-option label="果蔬" value="果蔬"></el-option>
                        </el-select>
                    </el-form-item>
                    <!-- 商品条形码 -->
                    <el-form-item label="商品条形码" prop="barCode">
                        <el-input v-model="goodsAdd.barCode"></el-input><el-button type="success" @click="removeDomain(100000000000,999999999999)">生成条形码</el-button>
                    </el-form-item>
                    <!-- 商品名称 -->
                    <el-form-item label="商品名称" prop="goodsName">
                        <el-input type="text" v-model="goodsAdd.goodsName" autocomplete="off"></el-input>
                    </el-form-item>

                    <!-- 商品售价 -->
                    <el-form-item label="商品售价" prop="goodsPrice">
                        <el-input type="text" v-model="goodsAdd.goodsPrice" autocomplete="off"><span>元</span></el-input>
                         <span>元</span>
                    </el-form-item>

                    <!-- 市场价 -->
                    <el-form-item label="市场价" prop="marketPrice">
                        <el-input type="text" v-model="goodsAdd.marketPrice" autocomplete="off"></el-input>
                        <span>元</span>
                        <p>默认市场价为售价的1.2倍</p>
                    </el-form-item>

                    <!-- 商品进价-->
                    <el-form-item label="商品进价" prop="goodsPurchasePrice">
                        <el-input type="text" v-model="goodsAdd.goodsPurchasePrice" autocomplete="off"></el-input>
                        <span>元</span>
                    </el-form-item>

                    <!-- 入库数量 -->
                    <el-form-item label="入库数量" prop="SelectSum">
                        <el-input type="text" v-model="goodsAdd.SelectSum" autocomplete="off"></el-input>
                        <p>计重商品单位为千克</p>
                    </el-form-item>

                    <!-- 商品重量 -->
                    <el-form-item label="商品重量" prop="goodsWeight">
                        <el-input type="text" v-model="goodsAdd.goodsWeight" autocomplete="off"></el-input>
                    </el-form-item>

                    <!-- 商品单位 -->
                    <el-form-item label="商品单位" prop="goodsUnit">
                        <el-input type="text" v-model="goodsAdd.goodsUnit" autocomplete="off"></el-input>
                    </el-form-item>

                    <!-- 会员享受 -->
                    <el-form-item label="会员享受" prop="vipEnjoy">
                        <el-radio-group v-model="goodsAdd.vipEnjoy">
                        <el-radio label="享受"></el-radio>
                        <el-radio label="不享受"></el-radio>
                        </el-radio-group>
                    </el-form-item>

                    <!-- 是否促销 -->
                    <el-form-item label="是否促销" prop="isPromotion">
                        <el-radio-group v-model="goodsAdd.isPromotion">
                        <el-radio label="启用"></el-radio>
                        <el-radio label="禁用"></el-radio>
                        </el-radio-group>
                    </el-form-item>

                    <!-- 商品简介 -->
                    <el-form-item label="商品简介" prop="goodsIntro">
                        <el-input type="textarea" v-model="goodsAdd.goodsIntro"></el-input>
                        <span>不超过200个汉字</span>
                    </el-form-item>

                    <!-- 添加 -->
                    <el-form-item>
                        <el-button type="success" @click="submitForm()">添加</el-button>
                    </el-form-item>

                </el-form>
                   
            </div>
        </el-card>
    </div>
</template>

<script>

    import { goodsAdd } from '@/api/goods';
    export default {
        data (){   
            return {
                goodsAdd : {
                    classify : '',      //所属分类
                    barCode : '',       //生成条形码
                    goodsName : '',     //商品名称
                    goodsPrice : '',    //商品售价
                    marketPrice :'',    //市场价
                    goodsPurchasePrice : '',    //商品进价
                    SelectSum : '',     //入库数量
                    goodsWeight : '',   //商品重量
                    goodsUnit : '',     //商品单位
                    vipEnjoy : '',      //会员享受
                    isPromotion : '',   //是否促销
                    goodsIntro : '',    //商品简介
                },
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
                    ],
                    goodsPurchasePrice : [
                        { required: true, message: '请输入商品进价', trigger: 'blur' }
                    ],
                    SelectSum : [
                        { required: true, message: '请输入入库数量', trigger: 'blur' }
                    ],
                    goodsWeight : [
                        { required: true, message: '请输入商品重量', trigger: 'blur' }
                    ],
                    goodsUnit : [
                        { required: true, message: '请输入商品单位', trigger: 'blur' }
                    ],
                    vipEnjoy : [
                        { required: true, message: '请选择是否为会员', trigger: 'change' }
                    ],
                    isPromotion : [
                        { required: true, message: '请选择是否为促销', trigger: 'change' }
                    ],
                    goodsIntro : [
                        { required: true, message: '请输入商品说明', trigger: 'blur' }
                    ]
                },
                domain : {

                }
            }
        },
        methods:{
            //生成条形码
            removeDomain(min,max){
                this.goodsAdd.barCode = Math.floor(Math.random()*(max-min+1)+min)   
            },
            //添加按钮
            submitForm(){
                this.$refs.goodsAdd.validate((valid) => {
                    if(valid){
                        //收集参数
                        let params = {
                            classify : this.goodsAdd.classify,
                            barCode : this.goodsAdd.barCode,
                            goodsName : this.goodsAdd.goodsName,
                            goodsPrice : this.goodsAdd.goodsPrice,
                            marketPrice : this.goodsAdd.marketPrice,
                        }
                        //发送请求
                        goodsAdd(params)
                        .then(res => {
                            //接收响应数据
                            let { code , msg} = res
                            //判断
                            if(code === 0){
                                this.$message({
                                    message : msg,
                                    type : 'success'
                                })
                                //跳转至商品列表页
                                this.$router.push('/home/goodsmanage')
                            }else if(code === 1) {
                                this.$message.error( msg )
                            }
                        })
                        .catch(err => {
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
    .goods-add{
        margin-right: -17px;
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
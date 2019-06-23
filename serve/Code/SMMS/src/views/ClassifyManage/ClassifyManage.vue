<template>
    <div class="classify-manage">
         <!-- 卡片 -->
        <el-card class="box-card">
           <!-- 头部 -->
            <div slot="header" class="clearfix">
                <h2>分类管理</h2>
            </div>
            <!-- 身体 -->
            <div class="tiem">
                <el-table
                    :data="goodsRetreat"
                    stripe
                    style="width: 100%">
                    <!-- 分类名称 -->
                    <el-table-column
                    prop="classifyname"
                    label="分类名称">
                    </el-table-column>

                    <!-- 管理 -->
                    <el-table-column label="管理">
                        <template slot-scope="scope">
                            <el-button @click="handleClick(scope.row)" type="primary" size="small">编辑</el-button>
                        </template>
                    </el-table-column>

                </el-table>
            </div>
        </el-card>
    </div>
</template>

<script>
    export default {
        data (){
            return {
                goodsRetreat : [
                    {
                        classifyname : '三鹿奶粉'
                    },
                    {
                        classifyname : '三鹿奶粉'
                    },
                    {
                        classifyname : '三鹿奶粉'
                    },
                    {
                        classifyname : '三鹿奶粉'
                    },
                    {
                        classifyname : '三鹿奶粉'
                    },
                    {
                        classifyname : '三鹿奶粉'
                    }
                ]
            }
        }
    }
</script>

<style lang="less">

</style>
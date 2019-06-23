<template>
    <div class="stocktotal">
        <!-- 卡片 -->
        <el-card class="box-card">
           <!-- 头部 -->
            <div slot="header" class="clearfix">
                <h2>进货统计</h2>
            </div>
            <!-- 身体 -->
            <div class="tiem">
                <div class="block">
                    <span class="demonstration">时间：</span>
                    <el-date-picker
                    v-model="value1"
                    type="date"
                    placeholder="选择日期">
                    </el-date-picker>
                </div>
                <div class="block">
                    <span class="demonstration">  -- </span>
                    <el-date-picker
                    v-model="value2"
                    type="date"
                    placeholder="选择日期">
                    </el-date-picker>
                </div>

                <el-select v-model="value" placeholder="请选择" style="margin-left:5px">
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>        
                </el-select>
                <el-button type="success" style="margin-left:5px">提交</el-button> 
               
               
                <div id="myChart" style=" height: 500px;margin-top:20px;">
                  
                </div>
            </div>
        </el-card>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                options: [
                    //下拉框
                {
                    value: '选项1',
                    label: '黄金糕1'
                },
                {
                    value: '选项2',
                    label: '黄金糕2'
                },
                {
                    value: '选项3',
                    label: '黄金糕3'
                }
                ],
                
                value :'',  //下拉框
                value1 : '',    //日期一
                value2 : ''     //日期二
            }
        },
        mounted(){
                   this.selltotal();
            },
        methods : {
            selltotal (){
                // 初始化echarts实例
                let myChart = this.$echarts.init(document.getElementById('myChart'))              
                var option = {
                    title: {
                        text:'进货统计',
                        left :'center'
                    },
                    xAxis: {
                        type: 'category',
                        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [{
                        data: [543, 336, 509, 688, 730, 908, 1100],
                        type: 'line'
                    }]
                }
                myChart.setOption(option);//设置option
            }       
        }
    }
</script>

<style lang="less">
    .stocktotal{
        .el-card{
            .el-card__header{
                background-color: #f1f1f1;
            }
            .el-card__body{
                .tiem{
                    .block{
                        float: left;
                    }
                }
            }
        } 
    }
</style>
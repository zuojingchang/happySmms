<template>
    <div class="selltotal">
        <!-- 卡片 -->
        <el-card class="box-card">
           <!-- 头部 -->
            <div slot="header" class="clearfix">
                <h2>销售统计</h2>
            </div>
            <!-- 身体 -->
            <div class="tiem  clearfix">
                <div class="block">
                    <span class="demonstration">时间：</span>
                    <el-date-picker
                    v-model="value1"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
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
                <el-button type="success" style="margin-left:5px" @click="dataSubmit">提交</el-button> 
               
               
                <div id="myChart" style=" height: 500px;margin-top:20px;">
                  
                </div>
            </div>
        </el-card>
    </div>
</template>

<script>
    import { getSellData } from '@/api/goods';
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
                xData  : ['19-06-10','19-06-11','19-06-12','19-06-13','19-06-14','19-06-15','19-06-16','19-06-17','19-06-18','19-06-19'],
                seriesData : [230, 1402, 1106, 921, 730, 580, 333,450,800,500]
            }
        },
        mounted(){
                let option = {
                    title: {
                        text:'销售统计（不含退款）',
                        left :'center'
                    },
                    //X轴
                    xAxis: {
                        type: 'category',
                        data: this.xData
                    },
                    //Y轴
                    yAxis: {
                        type: 'value'
                    },
                    series: [{
                        data: this.seriesData,
                        type: 'bar'
                    }]
                }
                this.selltotal(option);
            },
        methods : {
            selltotal (option){
                // 初始化echarts实例
                let myChart = this.$echarts.init(document.getElementById('myChart'))              
               
                myChart.setOption(option);//设置option
            },
            dataSubmit(){
                getSellData()
                    .then(res => {
                        //接收参数
                        let { category, value} = res;
                        this.xData = category,
                        this.seriesData = value
                        let option = {
                                title: {
                                    text:'销售统计（不含退款）',
                                    left :'center'
                                },
                                //X轴
                                xAxis: {
                                    type: 'category',
                                    data: this.xData
                                },
                                //Y轴
                                yAxis: {
                                    type: 'value'
                                },
                                series: [{
                                    data: this.seriesData,
                                    type: 'line'
                                }]
                            }
                        //重新调用报表
                        this.selltotal(option)
                    })
                    .catch(err => {
                        console.log(err);
                    })
            }     
        }
    }
</script>

<style lang="less">
    .selltotal{
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
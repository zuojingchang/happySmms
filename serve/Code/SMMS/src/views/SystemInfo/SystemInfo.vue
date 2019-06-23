<template>
  <div class="systeminfo">
    <!-- 卡片组件 -->
    <el-card class="box-card">
      <!-- 头部 -->
      <div slot="header" class="clearfix">
        <h2>系统信息</h2>
      </div>
      <!-- 身体 -->
      <div class="item">
        <el-alert title="商品总数：5。已经销售的总金额：890.00。库存商品总价：1235.82" type="info" show-icon></el-alert>
        <el-alert title="导入数据" type="info" show-icon></el-alert>
        <!-- 表格部分 -->
        <el-row :gutter="30">
            <!-- 左边面板 -->
          <el-col :span="12">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <h3>销售排行</h3>
                </div>
                <div class="item">
                    <!-- 左边表格 -->
                    <el-table
                        :data="leftTable"
                        stripe
                        style="width: 100%">
                        <el-table-column
                        prop="goodsName"
                        label="商品名称"
                        width="300">
                        </el-table-column>
                        <el-table-column
                        prop="saleNum"
                        label="销量">
                        </el-table-column>
                    </el-table>
                </div>
            </el-card>
          </el-col>
          <!-- 右边面板 -->
          <el-col :span="12">
              <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <h3>缺货的商品</h3>
                </div>
                <div class="item">
                    <!-- 右边表格 -->
                    <el-table
                        :data="rightTable"
                        stripe
                        style="width: 100%">
                        <el-table-column
                        prop="goodsName"
                        label="商品名称"
                        width="200">
                        </el-table-column>
                        <el-table-column
                        prop="saleNum"
                        label="库存"
                        width="200">
                        </el-table-column>
                        <el-table-column
                        prop="operation"
                        label="操作">
                        </el-table-column>
                    </el-table>
                </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      leftTable: [
          {
              goodsName : '海飞丝去屑洗发水',
              saleNum : '8'
          },
          {
              goodsName : '茅台酒',
              saleNum : '6'
          },
          {
              goodsName : '龙凤呈祥',
              saleNum : '5'
          },
          {
              goodsName : '龙凤呈祥2',
              saleNum : '2'
          },
      ],
      rightTable : [
          {
              goodsName : '海飞丝去屑洗发水',
              saleNum : '8',
              operation : '入库'
          }
      ]
    }
  }
}
</script>

<style lang="less">
.systeminfo {
  .box-card {
    .el-card__header {
      background-color: #f2f2f2;
    }
    .el-card__body {
      .el-alert {
        margin: 20px 0;
      }
    }
  }
}
</style>
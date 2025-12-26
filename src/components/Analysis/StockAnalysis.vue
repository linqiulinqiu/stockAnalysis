<template>
  <div class="stock-code-container">
    <el-card class="stock-card" shadow="hover">
      <div slot="header" class="card-header">
        <h2>筛选结果 - 股票代码分析详情列表</h2>
        <p class="total-count">共 {{ stockCodes.length }} 只符合条件的股票</p>
      </div>
        <p style="text-align:right;">
          <el-button @click="clearStocks">清除筛选结果</el-button>
        </p> 
      <!-- 股票代码表格 -->
      <el-table  v-if="stockCodes.length > 0"
        :data="currentPageStocks" 
        border 
        stripe 
        :header-cell-style="{ 'text-align': 'center' }"
        class="stock-table"
        v-loading="loading"
        height="800"
      >
        <!-- 序号列（基于当前页计算） -->
        <el-table-column label="序号" align="center" width="80">
          <template #default="scope">
            <span> 
              {{ (currentPage - 1) * pageSize + scope.$index + 1 }}
            </span>
          </template>
        </el-table-column>

        <!-- 股票代码列 -->
        <el-table-column label="股票代码" align="center"  width="120">
          <template #default="scope">
            <span class="stock-code">{{ scope.row.code }}</span>
          </template>
        </el-table-column>
        <!-- 股票名称列 -->
        <el-table-column label="股票分析结果" >
          <template #default="scope">
           <!-- {{ JSON.stringify(scope.row) }}-->
            <el-text type="info"> detail:<el-text type="primary">{{ scope.row.reasons[0].detail }}</el-text></el-text>
              <br />
            <el-text type="info">avg5Turnover:<el-text type="primary">{{ scope.row.reasons[0].evidence.avg5Turnover }}</el-text></el-text>
            <br />
            <el-text type="info">last5Days:<el-text type="primary">{{ scope.row.reasons[0].evidence.last5Days }}</el-text></el-text>
            <br />
            <el-text type="info">ratio:<el-text type="primary">{{ scope.row.reasons[0].evidence.ratio }}</el-text></el-text>
            <br />
            <el-text type="info">ratio2:<el-text type="primary">{{ scope.row.reasons[0].evidence.ratio2 }}</el-text></el-text>
            <br />
            <el-text type="info">threshold:<el-text type="primary">{{ scope.row.reasons[0].evidence.threshold }}</el-text></el-text>
            <br />
            <el-text type="info">today:<el-text type="primary">{{ scope.row.reasons[0].evidence.today }}</el-text></el-text>
            <br />
            <el-text type="info">todayTurnover:<el-text type="primary">{{ scope.row.reasons[0].evidence.todayTurnover }}</el-text></el-text>
            <br />
            <el-text type="info">rule:<el-text type="primary">{{ scope.row.reasons[0].rule }}</el-text></el-text>
          </template>
        </el-table-column>
      </el-table>
            <!-- 无数据提示 -->
      <el-empty 
        v-if="stockCodes.length === 0 && !loading" 
        description="暂无符合条件的股票" 
        class="empty-tip"
      />
      <!-- 分页组件 -->
      <div class="pagination-container" v-if="stockCodes.length > 0">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="stockCodes.length"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useStockStore } from '../../stores/StockS';
import type{ StockAnalysisType } from '../../utils/dataType';

// 定义股票代码类型
type StockCode = string | StockAnalysisType;
const stStore = useStockStore();
// 原始股票代码数组
const stockCodes = computed<StockCode[]>(() => stStore.analysisList);
// const stockCodes = ref<StockCode[]>(stStore.stockList);
onMounted(() => {
  console.log('StockCodes in StockAnalysis mounted:', stockCodes.value);
});
// 分页相关响应式数据
const currentPage = ref(1); // 当前页码
const pageSize = ref(18);   // 每页显示数量
const loading = ref(false); // 加载状态
// 计算当前页显示的股票数据
const currentPageStocks = computed<StockCode[]>(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value;
  const endIndex = startIndex + pageSize.value;
    const list = stockCodes.value.slice(startIndex, endIndex);
    // const addlist = [...list, newStock.value];
  console.log('currentPageStocks:',list);
  return  list
});
const clearStocks = () => {
  stStore.setAnalysisList([]);
};
// 每页显示数量改变时触发
const handleSizeChange = (val: number) => {
  pageSize.value = val;
  currentPage.value = 1; // 重置为第一页
};

// 当前页码改变时触发
const handleCurrentChange = (val: number) => {
  loading.value = true;
  // 模拟加载延迟（实际项目中可移除）
  setTimeout(() => {
    currentPage.value = val;
    loading.value = false;
  }, 200);
};
</script>

<style scoped>
.stock-code-container {
  max-width: 800px;
  margin: 0px auto;
}

.stock-card {
  border-radius: 8px;
  overflow: hidden;
  min-height: 900px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.total-count {
  color: #606266;
  margin: 0;
  font-size: 14px;
}

.stock-table {
  margin-top: 15px;
}

.stock-code {
  font-size: 16px;
  font-weight: 500;
  color: #1989fa;
}

.empty-tip {
  padding: 50px 0;
  margin-top: 200px;
}

/* 分页组件样式 */
.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  padding-bottom: 10px;
}

/* 响应式调整 */
@media (max-width: 600px) {
  .card-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .el-table-column {
    font-size: 14px;
  }
  
  .el-pagination {
    font-size: 12px;
  }
}
</style>
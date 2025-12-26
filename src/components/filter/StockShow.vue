<template>
  <div class="stock-code-container">
    <el-card class="stock-card" shadow="hover">
      <div slot="header" class="card-header">
        <h2>筛选结果 - 股票代码列表</h2>
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
        :cell-style="{ 'text-align': 'center' }"
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
        <el-table-column label="行业" align="center" width="170">
          <template #default="scope">
            <span>{{ scope.row.industry }}</span>
          </template>
        </el-table-column>
        <el-table-column label="名字" align="center" width="100">
          <template #default="scope">
            <span class="stock-code"> 
              {{ scope.row.name }}
            </span>
          </template>
        </el-table-column> 

        <!-- 股票代码列 -->
        <el-table-column label="股票代码" align="center">
          <template #default="scope">
            <el-link :href="scope.row.url" target="_blank">
              <span class="stock-code">{{ scope.row._id }}</span>
            </el-link>
          </template>
        </el-table-column>

        <!-- 操作列（复制功能） -->
        <el-table-column label="操作" width="100" align="center">
          <template #default="scope">
            <el-button 
              :text="true"
              icon="Copy" 
              @click="copyStockCode(scope.row._id)"
              size="small"
              :title="`复制 ${scope.row}`"
            >
              复制
            </el-button>
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
import { ref, computed, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { useStockStore } from '../../stores/StockS';
import apiFuns from '../../utils/apiFuns';
import type{ StockDetailsType } from '../../utils/dataType';

// 定义股票代码类型
type StockCode = string |StockDetailsType;
const stStore = useStockStore();
// 原始股票代码数组
const stockCodes = computed<StockCode[]>(() => stStore.stockList);
// const stockCodes = ref<StockCode[]>(stStore.stockList);

// 分页相关响应式数据
const currentPage = ref(1); // 当前页码
const pageSize = ref(18);   // 每页显示数量
const loading = ref(false); // 加载状态

// 计算当前页显示的股票数据
const currentPageStocks = ref<any[]>([]);
//获取当前页更多的股票数据
const loadCurStocksInfo = async (list:StockCode[]) => {
  if (list.length > 0) {
    const slist = []
    for (var i = 0; i < list.length; i++){
      slist.push({codeInfo:list[i]})
    }
    const details = await apiFuns.loadStockDetails(slist)
    if (details != undefined) {
      return details
    }
  }
  return []
}
watch([currentPage, pageSize, stockCodes], async () => {
  loading.value = true;
  const startIndex = (currentPage.value - 1) * pageSize.value;
  const endIndex = startIndex + pageSize.value;
  const list = stockCodes.value.slice(startIndex, endIndex);
  const dlist = await loadCurStocksInfo(list);
  currentPageStocks.value = dlist;
  loading.value = false;
}, { immediate: true });

const clearStocks = () => {
  stStore.setStockList([]);
};

// 复制股票代码到剪贴板
const copyStockCode =async (code: string) => {
  console.log('copy code :', code);
  try {
    // 方案1：优先使用Clipboard API（现代浏览器/安全上下文）
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(code);
      ElMessage.success(`已复制股票代码：${code}`);
    } 
    // 方案2：降级使用DOM复制（兼容旧浏览器/非安全上下文）
    else {
      const textarea = document.createElement('textarea');
      textarea.value = code;
      textarea.style.position = 'fixed'; // 防止滚动到页面外
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy'); // 执行复制
      document.body.removeChild(textarea);
      ElMessage.success(`已复制股票代码：${code}`);
    }
  } catch (err) {
    console.error('复制失败：', err);
    ElMessage.error(`复制失败，请手动复制`);
  }
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
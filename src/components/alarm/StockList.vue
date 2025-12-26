<template>
  <div class="stock-code-container">
    <el-card class="stock-card" shadow="hover">
      <div slot="header" class="card-header">
        <h2>监控股票代码列表</h2>
        <p class="total-count">共 {{ stockCodes.length }} 只符合条件的股票</p>
      </div>
        <p style="text-align:right;">
          <el-button @click="selectCode" type="primary">获取监控股票</el-button>
          <el-button @click="alarmCode">获取股票预警</el-button>
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
        <!-- 序号列（基于当前页计算）
        <el-table-column type="selection" :selectable="selectable" width="50">
        </el-table-column>
         -->
        <!-- 股票代码列 -->
        <el-table-column label="股票代码" align="center" width="100">
            <template #default="scope">
                <template v-if="scope.row.isNew">
                    <el-input
                        v-model.trim="newStock.codeInfo"
                        placeholder="输入股票代码"
                        size="small"
                        class="w-full"
                    />
                </template>
            <template v-else>
                <span class="stock-code">{{ scope.row.codeInfo }}</span>
            </template>
            </template>
        </el-table-column>
        <el-table-column label="价格" align="center" width="100">
            <template #default="scope">
        <template v-if="scope.row.isNew">
          <el-input
            v-model.number="newStock.price"
            placeholder="输入价格"
            size="small"
            class="w-full"
            type="number"
            min="0"
            step="0.1"
          ></el-input>
        </template>
        <template v-else>
          <span>{{ scope.row.price }}</span>
        </template>
      </template>
        </el-table-column>
        <el-table-column label="单位：手" align="center" width="100">
             <template #default="scope">
        <template v-if="scope.row.isNew">
          <el-input
            v-model.number="newStock.lot"
            placeholder="输入手数"
            size="small"
            class="w-full"
            type="number"
            min="1"
            step="1"
          ></el-input>
        </template>
        <template v-else>
          <span>{{ scope.row.lot }}</span>
        </template>
      </template>
        </el-table-column>
        <el-table-column label="状态">
            <template #default="scope">
                <span  v-if="scope.row.isNew">待确认</span>
                <div v-else>
                  <AlarmInfo :stock-info="scope.row.status"/>
                </div>
            </template>
        </el-table-column>
        
        <!-- 操作列（复制功能）-->
        <el-table-column label="操作" width="120" align="center">
          <template #default="scope">
        <!-- 新增行：确认 + 取消 -->
        <template v-if="scope.row.isNew">
          <el-button
            type="primary"
            icon="Check"
            @click="confirmAddStock()"
            size="small"
            class="mr-2"
            :disabled="!isNewStockValid" 
          >
            添加
          </el-button>
          <el-button
            :text="true"
            icon="Close"
            @click="cancelAddStock()"
            size="small"
            text-color="#ff4d4f"
          >
            取消
          </el-button>
        </template>
        <!-- 普通行：删除 -->
        <template v-else>
          <el-button
            :text="true"
            icon="Delete"
            @click="deleteStock(scope.row)"
            size="small"
            text-color="#ff4d4f"
          >
            删除
          </el-button>
        </template>
      </template>
    </el-table-column>
      </el-table>
            <!-- 无数据提示 -->
      <div v-else >
        <div>
          <p>
            <el-input class="ipt-add" 
              placeholder="输入股票代码"    
              v-model.trim="newStock.codeInfo" />
            <el-input class="ipt-add"
              placeholder="价格" 
              v-model.number="newStock.price" />
            <el-input 
              placeholder="手数" 
              class="ipt-add" 
              v-model.number="newStock.lot" />
          </p>
          <el-button @click="addStock">添加股票</el-button>
        </div>
        <el-empty 
          description="暂无符合条件的股票" 
          class="empty-tip"
        />
      </div>
            
      <!-- 分页组件 -->
      <div class="pagination-container" v-if="stockCodes.length > 0">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[18,30,50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="stockCodes.length"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { ElMessage } from 'element-plus';
import { useStockStore } from '../../stores/StockS';
import apiFuns from '../../utils/apiFuns';
import type { AlarmingType, WarningType } from '../../utils/dataType';
import AlarmInfo from './AlarmInfo.vue';
const stStore = useStockStore();
// 原始股票代码数组
const stockCodes = computed<AlarmingType[]>(() => stStore.alarmList);

// 新增行临时数据：标记 isNew: true 用于区分
const newStock = ref<AlarmingType>({
  codeInfo: '',
  price: 10,
  lot: 10,
  status: '', // 新增行默认状态
  isNew: true, // 关键标记
});
//添加股票
const addStock = async () => {
    console.log('addStock newStock:', newStock.value);
    // 校验输入合法性
    if (newStock.value.codeInfo.trim() === '' ||
        typeof newStock.value.price !== 'number' || newStock.value.price < 0 ||
        typeof newStock.value.lot !== 'number' || newStock.value.lot < 1) {
        ElMessage.warning('请填写完整且合法的信息：股票代码必填，价格≥0，手数≥1');
        return;
    }
    // 克隆临时数据
    const list = [{
            codeInfo: newStock.value.codeInfo,
            price: newStock.value.price,
            lot: newStock.value.lot,
        }];
    const res = await apiFuns.saveCode(list);
    console.log('saveCode res:', res);
    // 重置新增行
    newStock.value = {
        codeInfo: '',
        price: 0,
        lot: 1,
        status: '正常',
        isNew: true,
    };
    //重新获取list
    await selectCode()
    ElMessage.success('新增股票成功！');
};
// 分页相关响应式数据
const currentPage = ref(1); // 当前页码
const pageSize = ref(18);   // 每页显示数量
const loading = ref(false); // 加载状态
//每30s请求一次alarming
const timeRef = ref<number | null>(null)
onMounted(() => {
  console.log('alarming open',stStore.alarmList.length)
        // 使用 window.setInterval 保证返回值为 number，匹配 timeRef 的类型
        timeRef.value = setInterval(async () => {
          console.log('set interval,')
          if (stStore.alarmList.length > 0) {
            await alarmCode()
          }
        },30000)
  
})
// 组件卸载时清理定时器
onUnmounted(() => {
    if (timeRef.value !== null) {
        clearInterval(timeRef.value)
        timeRef.value = null
        console.log('alarming clear')
    }
})



// 计算当前页显示的股票数据
const currentPageStocks = computed<AlarmingType[]>(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value;
  const endIndex = startIndex + pageSize.value;
    const list = stockCodes.value.slice(startIndex, endIndex);
    const addlist = [...list, newStock.value];
  console.log('currentPageStocks:', addlist);
  return  addlist
});

//获取监控股票代码
const selectCode = async () => {
    const res = await apiFuns.selectCode();
    if (res != undefined) {
        ElMessage.success(`共获取到 ${res.length} 支监控股票`);
        stStore.setAlarmList(res);
        console.log('alarmList in store:', stStore.alarmList);
    } else {
        ElMessage.error('获取监控股票失败');
  }
};
// 校验新增行输入合法性（股票代码非空、价格和手数为有效数字）
const isNewStockValid = computed(() => {
  return (
    newStock.value.codeInfo.trim() !== '' &&
    typeof newStock.value.price === 'number' &&
    newStock.value.price >= 0 &&
    typeof newStock.value.lot === 'number' &&
    newStock.value.lot >= 1
  );
});

// 确认新增股票
const confirmAddStock = async() => {
  // 再次校验（防止 computed 延迟）
  if (!isNewStockValid.value) {
    ElMessage.warning('请填写完整且合法的信息：股票代码必填，价格≥0，手数≥1');
    return;
  }

  // 构造提交数据（确保使用 ref 的 value 并移除内部 isNew）
  const newStockData = {
    codeInfo: newStock.value.codeInfo,
    price: newStock.value.price,
    lot: newStock.value.lot,
  };

  // 获取全部的 list + newModel
  const list = [...stStore.alarmList, newStockData];
  console.log('save list :', list);
  const res = await apiFuns.saveCode(list);
  console.log('saveCode res:', res);

  // 重新获取 list
  await selectCode();

  // 重置新增行
  newStock.value = {
    codeInfo: '',
    price: 0,
    lot: 1,
    status: '正常',
    isNew: true,
  };

  ElMessage.success('新增股票成功！');
};

// 取消新增（重置临时数据）
const cancelAddStock = () => {
  newStock.value = {
    codeInfo: '',
    price: 0,
    lot: 1,
    status: '正常',
    isNew: true,
  };
};
//get alarm code 
const alarmCode = async ()=> {
    const list = await apiFuns.alarming()
    if (list != undefined) {
        console.log('alarm code res:', list)
        const slist = stStore.alarmList
        const addlist: AlarmingType[] = []
        for (let i = 0; i < slist.length; i++){
            const item = slist[i]
            // 跳过可能为 undefined 的项，构造新的对象并更新 status（若有新值）
            if (!item) continue;
            const updatedItem: AlarmingType = {
                ...item,
                status: (list[i] !== undefined ? list[i] : item.status),
            };
            addlist.push(updatedItem)
        }
        // 将更新后的列表写回仓库
        stStore.setAlarmList(addlist)
    }  
}

// 删除股票（重新获取数据）
const deleteStock =async (row: { codeInfo: string; }) => {
    // 从原数据和分页数据中移除
    const oldlist = stStore.alarmList;
    const newList = oldlist.filter(item => item.codeInfo !== row.codeInfo);
    const res = await apiFuns.saveCode(newList);
    if (res != undefined) {
        await selectCode();
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
.ipt-add {
  width: 200px;
  margin-right: 10px;
}
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
<script setup lang="ts">
import MainFilter from './views/MainFilter.vue'
import AlarmPage from './views/AlarmPage.vue'
import StockAnalysisPage from './views/StockAnalysisPage.vue'
import { ElMessage, type TabsPaneContext } from 'element-plus'
import { ref } from 'vue'
import apiFuns from './utils/apiFuns'
import { useStockStore } from './stores/StockS'
const activeName = ref('filter')
const stStore = useStockStore()
const handleClick = async (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
  if (tab.paneName === 'alarm') {
   const res = await apiFuns.selectCode()
     if (res != undefined) {
        stStore.setAlarmList(res);
        console.log('alarmList in store:', stStore.alarmList);
    } else {
        ElMessage.error('获取监控股票失败');
  }
  }
}
</script>

<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="筛选" name="filter">
        <MainFilter />
      </el-tab-pane>
      <el-tab-pane label="警示" name="alarm">
        <AlarmPage />
      </el-tab-pane>
      <el-tab-pane label="股票分析" name="StockAnalysis">
        <StockAnalysisPage />
      </el-tab-pane> 
    </el-tabs>
  </div>
</template>

<style scoped>

</style>

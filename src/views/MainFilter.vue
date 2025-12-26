<template>
    <div class="main">
        <el-container>
            <el-container>
            <el-aside width="380px">
                <FilterCriteria />
            </el-aside>
            <el-main class="main-content">
                <StockShow />
            </el-main>
            <el-aside width="370px">
                <div v-if="stStore.stockList.length>0">
                    <RecomendStocks />
                </div>  
            </el-aside>
        </el-container>
        </el-container> 
    </div>
</template>

<script lang="ts" setup>
import FilterCriteria from '../components/filter/FilterCriteria.vue';
import StockShow from '../components/filter/StockShow.vue';
import RecomendStocks from '../components/filter/RecomendStocks.vue';
import { useStockStore } from '../stores/StockS';
const stStore = useStockStore()

</script>

<style scoped>
.main{
    padding: 0;
    height: 100%;
    width: 100%;
}
.main-content{
    width: calc(100vw - 350px);
    height: calc(100vh - 64px);
    padding: 0;
}
.main-filter {
    display: flex;
    gap: 16px;
    padding: 16px;
    box-sizing: border-box;
    height: 100%;
    align-items: flex-start;
}

/* 左侧固定宽度，右侧占满剩余 */
.left-panel {
    width: 320px;
    min-width: 240px;
}

.right-panel {
    flex: 1;
    min-width: 300px;
}

.panel-card {
    height: 100%;
}

.filter-form {
    margin-top: 8px;
}

.panel-title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 8px;
}

.pagination-wrap {
    padding: 12px 0;
    display: flex;
    justify-content: flex-end;
}
</style>
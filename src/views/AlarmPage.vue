<template>
    <div class="main">
        <el-container>
             <el-header>
                警示页面
            </el-header>
            <el-container>

            <el-main class="main-content">
                <StockList />
            </el-main>
        </el-container>
        </el-container> 
    </div>
</template>

<script lang="ts" setup>
import StockList from '../components/alarm/StockList.vue';

</script>

<style scoped>
.main{
    padding: 0;
    height: 100%;
    width: 100%;
}
.main-content{
    width: calc(100vw - 350px);
    /* width: 100%; */
    height: calc(100vh - 64px);
    padding: 0;
}
</style>
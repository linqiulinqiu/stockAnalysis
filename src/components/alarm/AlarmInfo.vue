<template>
  <div class="stock-alert-container">
    <div v-if="stockInfo?.type == '1'">
        <span>突增预警</span>
    </div>
    <div v-if="stockInfo?.type == '2'">

                <label class="item-label">买入价:</label>
                <span class="item-value">{{ stockInfo.buyPrice ?? '-' }}</span>
            <br/>
                <label class="item-label">触发价:</label>
                <span class="item-value">{{ stockInfo.hitPrice ?? '-' }}</span>
           <br/> 
                <label class="item-label">主力资金:</label>
                <span class="item-value">{{ stockInfo.mainForce ?? '-' }}</span>
             <br/> 
                <label class="item-label">当前收益:</label>
                <span class="item-value profit-value">{{ stockInfo.profit ?? '-' }}</span>
<br/> 
                <label class="item-label">目标收益:</label>
                <span class="item-value">{{ stockInfo.targetPercent ?? '-' }}</span>
<br/>
                <label class="item-label">触发时间:</label>
                <span class="item-value">{{ formatHitTime(stockInfo.hitTime) ?? '-' }}</span>
            
    </div>
  </div>
</template>

<script setup lang="ts">
import  type{ WarningType } from '../../utils/dataType';
// interface StockInfoType {
//   code: string;
//   type: '1' | '2';
//   buyPrice?: string;
//   hitPrice?: string;
//   mainForce?: string;
//   profit?: string;
//   hitTime?: string;
//   targetPercent?: string;
// }
// 2. Props定义：接收数据列表 + 可选扩展配置
defineProps<{
    stockInfo:WarningType
}>()

// 4. 格式化触发时间（YYYYMMDDHHmm → YYYY-MM-DD HH:mm）
const formatHitTime = (timeStr?: string) => {
  if (!timeStr || timeStr.length !== 12) return timeStr;
  const year = timeStr.slice(0, 4);
  const month = timeStr.slice(4, 6);
  const day = timeStr.slice(6, 8);
  const hour = timeStr.slice(8, 10);
  const minute = timeStr.slice(10, 12);
  return `${year}-${month}-${day} ${hour}:${minute}`;
};
</script>

<style scoped>
.stock-alert-container {
  width: 100%;
  padding: 16px;
  box-sizing: border-box;
}

.empty-tip {
  margin: 40px 0;
}

.stock-grid {
  margin-top: 16px;
}

.stock-card {
  height: 100%;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }
}

.stock-type-1 {
  --el-card-border-color: var(--el-color-warning-light-3);
}

.stock-type-2 {
  --el-card-border-color: var(--el-color-primary-light-3);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--el-card-border-color);

  .stock-code {
    font-size: 14px;
    font-weight: 500;
    color: var(--el-text-color-primary);
  }
}

.card-content {
  padding: 4px 0;
}

.type-1-content {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 0;
  color: var(--el-text-color-secondary);

  .alert-desc {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
  }

  .alert-icon {
    color: var(--el-color-warning);
    font-size: 18px;
  }
}

.type-2-content {
  .detail-grid {
    width: 100%;
  }

  .detail-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 13px;

    .item-label {
      color: var(--el-text-color-placeholder);
    }

    .item-value {
      color: var(--el-text-color-primary);
      font-weight: 400;
    }

    .profit-value {
      color: var(--el-color-success);
    }
  }
}
</style>
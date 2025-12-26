<template>
    <div class="filter-criteria">
        <el-card>
            <div class="header">
                <strong>股票推荐条件</strong>
            </div>
            <el-form 
                :rules="filterRules"
                :model="recommendCfg" 
                ref="filterForm" 
                label-width="180px" 
                class="filter-form"
                label-position="top"
            >
            <!-- 一级筛选条件（数值输入项） -->
            <el-collapse v-model="activeNames" :border="false">
            <!-- 推荐条件（布尔复选框） -->
            <el-collapse-item name="recommend" title="推荐条件">
                <el-form-item  prop="upward">
                  <el-checkbox  label="5日线整体趋势向上" v-model="recommendCfg.upward" />
                </el-form-item>
                <el-form-item  prop="section">
                  <el-checkbox v-model="recommendCfg.section" label="剔除当天资金净流出板块的个股" />
                </el-form-item>
                <el-form-item prop="decline">
                  <el-checkbox v-model="recommendCfg.decline" label="股票的各条均线呈现多头发散状态" />
                </el-form-item>
                <el-form-item prop="anxious">
                  <el-checkbox v-model="recommendCfg.anxious" label="股价当天的上线震动幅度再6%以内" />
                </el-form-item>
                <el-form-item prop="divergent">
                  <el-checkbox v-model="recommendCfg.divergent" label="2:30分以后没有出现急拉急跌" />   
                </el-form-item>
                <el-form-item label="涨停时间段(天)：" prop="harden">
                <el-input 
                    v-model="recommendCfg.harden"
                    type="number"
                    min="0"
                    placeholder="请输入天数"
                />
                </el-form-item>
            </el-collapse-item>
            </el-collapse>
            <!-- 操作按钮 -->
            <div class="form-actions">
                <el-button type="primary" @click="handleSubmit">推荐股票</el-button>
                <el-button @click="handleReset">重置</el-button>
            </div>
        </el-form>
      </el-card>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { ElForm, ElMessage, type FormRules } from 'element-plus';
import type {RecommendConfig} from "../../utils/dataType";
import apiFuns from '../../utils/apiFuns';
import { useStockStore } from '../../stores/StockS';

const stStore = useStockStore();
//筛选条件
const recommendCfg = reactive<RecommendConfig>({
    //以下推荐条件，
  "upward": true,
  section: false,
  decline: false,
  anxious: false,
  divergent: false,
    // "roseMin": 3,
    // "roseMax": 5,
    "harden": 20,
    "rows":[]
});
const stockList = computed<string[]>(() => stStore.stockList);
// 折叠面板默认展开项
const activeNames = ref<string[]>(['recommend']);
// 表单引用
const filterForm = ref<InstanceType<typeof ElForm>>();
// 定义验证规则
const filterRules = reactive<FormRules<Record<string,number|boolean>>>({
  // 量比验证：必填 + 有效数字 + 大于0
  // upward: [
  //   { type: 'boolean', message: '请输入有效的数字', trigger: 'blur' },
  // ],
  // 涨幅范围：有效数字 + 0-100之间
  // roseMin: [
  //   { type: 'number', message: '请输入有效的数字', trigger: 'blur' },
  //   { validator: (rule, value) => value >= 0 && value <= 100, message: '涨幅必须在0-100之间', trigger: 'blur' }
  // ],
  // // 换手率上限：必填 + 有效数字 + 0-100之间 + 大于下限
  // roseMax: [
  //   { type: 'number', message: '请输入有效的数字', trigger: 'blur' },
  //   { validator: (rule, value) => value >= 0 && value <= 100, message: '涨幅上限必须在0-100之间', trigger: 'blur' },
  //   { 
  //     validator: (rule, value) => value > recommendCfg.roseMin,
  //     message: '涨幅上限必须大于下限', 
  //     trigger: ['blur', 'change'] 
  //   }
  // ],
   harden: [
    { 
      type: 'number', 
      message: '请输入有效的数字', 
      trigger: 'blur',
      transform: (value) => {
        // 处理空值：清空输入框时转为 undefined，避免 NaN 导致校验异常
        return value === '' ? undefined : Number(value);
      }
    },
    { 
      validator: (rule, value, callback) => {
        // 若未输入（value 为 undefined），不触发该校验（由上面的 type 规则提示）
        if (value === undefined) {
          callback();
          return;
        }
        // 校验非负数（允许 0）
        if (value >= 0) {
          callback(); // 校验通过
        } else {
          callback(new Error('天数不能为负数')); // 校验失败，提示正确文案
        }
      },
      trigger: 'blur'
    }
  ]
  
});

 // 提交表单
const handleSubmit =async () => {
  // 1. 触发表单验证
  filterForm.value?.validate(async (valid) => {
      if (valid) {
        recommendCfg.rows = stockList.value;
        // 2. 验证通过：打印表单结果（primaryCfg 即完整表单数据）
        console.log('推荐表单提交结果：', JSON.parse(JSON.stringify(recommendCfg))); // 深拷贝避免引用影响
        const res = await apiFuns.loadRecommendStocks(recommendCfg);
        if (res != undefined) {
            ElMessage.success(`共筛选出 ${res.length} 支符合条件的股票`);
            stStore.setStockList(res);
            console.log('stockList in store:', stStore.stockList);
        }
      } else {
        // 3. 验证失败：提示错误
        ElMessage.error('请完善一级筛选必填项并修正错误');
 }
  });
};
// 重置表单
const handleReset = () => {
  filterForm.value?.resetFields();
  ElMessage.info('表单已重置');
};
</script>

<style scoped>
.filter-page {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.filter-card {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}
.filter-form {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.el-collapse-item__content {
  padding-top: 15px !important;
}

.form-actions {
  margin-top: 20px;
  display: flex;
  gap: 10px;
  justify-content: center;
}

.el-form-item {
  margin-bottom: 15px;
}
</style>
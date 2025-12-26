<template>
    <div class="filter-criteria">
        <el-card>
            <div class="header">
                <strong> 股票筛选条件</strong>
            </div>
          <el-form 
            :rules="filterRules"
            :model="primaryCfg" 
            ref="filterForm" 
            class="filter-form"
            label-position="top" 
          >
          <!-- 一级筛选条件（数值输入项） -->
            <el-collapse  v-model="activeNames" :border="false" >
              <el-collapse-item  name="level1" title="一级筛选条件">
                <el-form-item label="量比（基础值）：" prop="volume">
                  <el-input 
                    v-model.number="primaryCfg.volume" 
                    type="number" 
                    min="0" 
                    placeholder="请输入量比基础值"
                  />
                </el-form-item>
                
                <!--<el-form-item label="换手率下限（%）：" prop="tradeMin">

                  <el-input 
                    v-model.number="primaryCfg.tradeMin" 
                    type="number" 
                    min="0" 
                    max="100" 
                    placeholder="请输入换手率下限"
                  />
                </el-form-item>

                <el-form-item label="换手率上限（%）：" prop="tradeMax">
                  <el-input 
                    v-model.number="primaryCfg.tradeMax" 
                    type="number" 
                    min="0" 
                    max="100" 
                    placeholder="请输入换手率上限"
                  />
                </el-form-item>-->
                  <el-form-item label="换手率（%）：下限-上限" prop="['tradeMin', 'tradeMax']">
                  <el-row :gutter="20">
                    <el-col :span="11">
                      <el-input 
                        v-model.number="primaryCfg.tradeMin" 
                        type="number" 
                        min="0" 
                        max="100" 
                        placeholder="请输入换手率下限"
                      />
                    </el-col>
                    <el-col :span="2" class="range-separator">-</el-col>
                    <el-col :span="11">
                      <el-input 
                        v-model.number="primaryCfg.tradeMax" 
                        type="number" 
                        min="0" 
                        max="100" 
                        placeholder="请输入换手率上限"
                      />
                    </el-col>
                  </el-row>
                </el-form-item>
                
                <!--  <el-form-item label="流通市值下限（亿）：" prop="flowMin">
                  <el-input 
                    v-model.number="primaryCfg.flowMin" 
                    type="number" 
                    min="0" 
                    placeholder="请输入流通市值下限"
                  />
                </el-form-item>  
                <el-form-item label="流通市值上限（亿）：" prop="flowMax">
                  <el-input 
                    v-model.number="primaryCfg.flowMax" 
                    type="number" 
                    min="0" 
                    placeholder="请输入流通市值上限"
                  />
                </el-form-item>
              -->
              <el-form-item label="流通市值范围（亿）：（下限-上限）" prop="['flowMin', 'flowMax']">
                <el-row :gutter="20">
                    <el-col :span="11">
                        <el-input
                          v-model.number="primaryCfg.flowMin"
                          type="number"
                          min="0"
                          aria-label="流通值下限"
                          placeholder="请输入流通市值下限"
                        />
                    </el-col>
                    <el-col :span="2" class="range-separator">-</el-col>
                    <el-col :span="11">
                        <el-input
                          v-model.number="primaryCfg.flowMax"
                          type="number"
                          min="0"
                          aria-label="流通值上限"
                          placeholder="请输入流通市值上限"
                        />
                    </el-col>
                  </el-row>
                </el-form-item>
              </el-collapse-item>
              <!-- 二级筛选条件（布尔复选框） -->
              <el-collapse-item name="level2" title="二级筛选条件">
                <el-form-item  prop="screenOne">
                  <el-checkbox v-model="primaryCfg.screenOne" label="剔除顶部形态个股" />
                </el-form-item>

                <el-form-item   prop="screenTwo">
                  <el-checkbox v-model="primaryCfg.screenTwo" label="成交量温和放大"/>
                </el-form-item>

                <el-form-item  prop="screenThree">
                  <el-checkbox class="main-item" v-model="primaryCfg.screenThree" label="下午2点30分后上升趋势" />
                </el-form-item>

                <el-form-item  prop="screenTen">
                  <el-checkbox class="main-item" v-model="primaryCfg.screenTen" label="股价全天在分时均线上方" />
                </el-form-item>

                <el-form-item  prop="screenTen">
                  <el-checkbox v-model="primaryCfg.screenSixteen" label="剔除100个交易日有大于等于20个交易日跌幅超5%" />
                </el-form-item>

                <el-form-item  prop="screenFifteen">
                  <el-checkbox v-model="primaryCfg.screenFifteen" label="突破90日新高且不超次高10%" />
                </el-form-item>
                <el-form-item label="涨幅范围并加入自选(%)：" prop="['roseMin', 'roseMax']">
                  <el-row :gutter="8">
                    <el-col :span="11">
                      <el-input 
                          v-model.number="primaryCfg.roseMin"
                          type="number"
                          min="-100"
                          placeholder="最低涨幅%"
                      />
                    </el-col>
                  <el-col :span="2" class="range-separator">-</el-col>
                  <el-col :span="11">
                      <el-input 
                        v-model.number="primaryCfg.roseMax"
                        type="number"
                        min="-100"
                        placeholder="最高涨幅%"
                      />
                  </el-col>
                </el-row>
                </el-form-item>
                <el-form-item label="主力资金注入（万元） :" prop="scope">
                  <el-input 
                    v-model.number="primaryCfg.scope" 
                    type="number" 
                    min="0" 
                    placeholder="请输入范围值"
                  />
                </el-form-item>
              </el-collapse-item>
               
            </el-collapse>

            <!-- 操作按钮 -->
            <div class="form-actions">
              <el-button type="primary" @click="handleSubmit">提交筛选</el-button>
              <el-button @click="handleReset">重置</el-button>
            </div>
          </el-form>
      </el-card>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { ElForm, ElMessage, type FormRules } from 'element-plus';
import type { FilterConfig } from "../../utils/dataType";
import apiFuns from '../../utils/apiFuns';
import { useStockStore } from '../../stores/StockS';

const stStore = useStockStore();
//筛选条件
const primaryCfg = reactive<FilterConfig>({
    'volume': 1,
    'tradeMin': 3,
    'tradeMax':10,// 量比,
    'flowMin': 50,
    'flowMax': 700,// 流通市值 //以上一级筛选，
    //以下二级筛选条件
    "screenOne": false,
    "screenTwo": false,
    "screenThree": false,
    "screenTen": false,
    "screenFifteen": false,
    "scope": 0,
    "screenSixteen": false,
    "roseMin": 3,
    "roseMax": 5,

});
// 折叠面板默认展开项
const activeNames = ref<string[]>(['level1','level2']);
// 表单引用
const filterForm = ref<InstanceType<typeof ElForm>>();
// 定义验证规则
const filterRules = reactive<FormRules<Record<string,number|boolean>>>({
  // 量比验证：必填 + 有效数字 + 大于0
  volume: [
    { required: true, message: '量比不能为空', trigger: 'blur' },
    { type: 'number', message: '请输入有效的数字', trigger: 'blur' },
    { validator: (rule, value) => value > 0, message: '量比必须大于0', trigger: 'blur' }
  ],
  // 换手率下限：必填 + 有效数字 + 0-100之间
  tradeMin: [
    { required: true, message: '换手率下限不能为空', trigger: 'blur' },
    { type: 'number', message: '请输入有效的数字', trigger: 'blur' },
    { validator: (rule, value) => value >= 0 && value <= 100, message: '换手率下限必须在0-100之间', trigger: 'blur' }
  ],
  // 换手率上限：必填 + 有效数字 + 0-100之间 + 大于下限
  tradeMax: [
    { required: true, message: '换手率上限不能为空', trigger: 'blur' },
    { type: 'number', message: '请输入有效的数字', trigger: 'blur' },
    { validator: (rule, value) => value >= 0 && value <= 100, message: '换手率上限必须在0-100之间', trigger: 'blur' },
    { 
      validator: (rule, value) => value > primaryCfg.tradeMin, 
      message: '换手率上限必须大于下限', 
      trigger: ['blur', 'change'] 
    }
  ],
  // 流通市值下限：必填 + 有效数字 + 大于0
  flowMin: [
    { required: true, message: '流通市值下限不能为空', trigger: 'blur' },
    { type: 'number', message: '请输入有效的数字', trigger: 'blur' },
    { validator: (rule, value) => value > 0, message: '流通市值下限必须大于0', trigger: 'blur' }
  ],
  // 流通市值上限：必填 + 有效数字 + 大于0 + 大于下限
  flowMax: [
    { required: true, message: '流通市值上限不能为空', trigger: 'blur' },
    { type: 'number', message: '请输入有效的数字', trigger: 'blur' },
    { validator: (rule, value) => value > 0, message: '流通市值上限必须大于0', trigger: 'blur' },
    { 
      validator: (rule, value) => value > primaryCfg.flowMin, 
      message: '流通市值上限必须大于下限', 
      trigger: ['blur', 'change'] 
    }
  ],
  roseMin: [
    { type: 'number', message: '请输入有效的数字', trigger: 'blur' },
    { validator: (rule, value) => value >= 0 && value <= 100, message: '涨幅必须在0-100之间', trigger: 'blur' }
  ],
  // 换手率上限：必填 + 有效数字 + 0-100之间 + 大于下限
  roseMax: [
    { type: 'number', message: '请输入有效的数字', trigger: 'blur' },
    { validator: (rule, value) => value >= 0 && value <= 100, message: '涨幅上限必须在0-100之间', trigger: 'blur' },
    { 
      validator: (rule, value) => value > primaryCfg.roseMin,
      message: '涨幅上限必须大于下限', 
      trigger: ['blur', 'change'] 
    }
  ],
});
 // 提交表单
const handleSubmit =async () => {
  // 1. 触发表单验证
  filterForm.value?.validate(async (valid) => {
    if (valid) {
      // 2. 验证通过：打印表单结果（primaryCfg 即完整表单数据）
      console.log('表单提交结果：', JSON.parse(JSON.stringify(primaryCfg))); // 深拷贝避免引用影响
      const res = await apiFuns.loadStocksAnalysis(primaryCfg);
      if (res != undefined) {
        ElMessage.success(`共筛选出 ${res.length} 支符合条件的股票`);
        stStore.setAnalysisList(res);
        console.log('analysisList in store:', stStore.analysisList);
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
  max-width: 400px;
  margin: 20px auto;
  padding: 0 20px;
  width: 380px;
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
  padding: 0px;
  background: #fff;
  /* border-radius: 8px; */
  /* box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05); */
}


.main-item{
  color: blueviolet !important;
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
import { defineStore } from "pinia";
import { ref } from "vue";
import type { AlarmingType, StockAnalysisType } from '../utils/dataType';

export const useStockStore = defineStore("StockStore", () => { 
    const stockList = ref<string[]>([]);
    const setStockList = (list: string[]) => {
        stockList.value = list;
    }
    const alarmList = ref<AlarmingType[]>([]);
    const setAlarmList = (list: AlarmingType[]) => {
        alarmList.value = list;
    }
    const analysisList = ref<Array<StockAnalysisType>>([]);
    const setAnalysisList = (list:Array<StockAnalysisType>) => {
        analysisList.value = list;
    }
    return {
        stockList, setStockList,
        alarmList, setAlarmList,
        analysisList, setAnalysisList
    };
})              
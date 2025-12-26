import http from './request';
import type { FilterConfig, RecommendConfig,AlarmingType, WarningType } from './dataType';
async function loadStocks(cfgs:FilterConfig): Promise<any[] | undefined> {
    const url = '/api/line/Screening'
    try {
        const data = await http.post<{ success: boolean; rows: any[] }>(url, cfgs, {
            loading: true,
            successMsg: '提交成功',
        });  
        console.log('股票数据加载结果:', data);
        return data.rows;
    } catch (error) {
        console.error('加载股票数据失败:', error);
        return undefined;
    } 
}
async function loadStocksAnalysis(cfgs:FilterConfig): Promise<any[] | undefined> {
    const url = '/api/reason/ScreeningExcludedDetail'
    try {
        const data = await http.post<{ success: boolean; excluded: any[] }>(url, cfgs, {
            loading: true,
            successMsg: '提交成功',
        });  
        console.log('股票数据加载结果:', data);
        return data.excluded;
    } catch (error) {
        console.error('加载股票数据失败:', error);
        return undefined;
    } 
}
async function loadRecommendStocks(cfgs: RecommendConfig): Promise<any[] | undefined> {
    const url = '/api/line/Suggesting'
    try {
        const data = await http.post<{ success: boolean; rows: any[] }>(url, cfgs, {        
            loading: true,
            successMsg: '提交成功',
        });  
        console.log('推荐股票数据加载结果:', data);
        return data.rows;
    } catch (error) {
        console.error('加载推荐股票数据失败:', error);
        return undefined;
    }   
}
async function loadRecommendStockAnalysis(cfgs: RecommendConfig): Promise<any[] | undefined> {
    const url = '/api/reason/SuggestingExcludedDetail'
    try {
        const data = await http.post<{ success: boolean; excluded: any[] }>(url, cfgs, {        
            loading: true,
            successMsg: '提交成功',
        });  
        console.log('推荐股票数据加载结果:', data);
        return data.excluded;
    } catch (error) {
        console.error('加载推荐股票数据失败:', error);
        return undefined;
    }   
}
async function selectCode(): Promise<any[] | undefined> {
    const url = '/api/line/selectCode'
    try {
        const data = await http.get<{ success: boolean; rows: any[] }>(url,{        
            loading: true,
            successMsg: '',
        });  
        console.log('搜索股票加载结果:', data);
        return data.rows;
    } catch (error) {
        console.error('搜索股票数据失败:', error);
        return undefined;
    }   
}
async function saveCode(list:Array<AlarmingType>): Promise<boolean | undefined> {
    const url = '/api/line/saveCode'
    try {
        const data = await http.post<{ success: boolean,status:boolean}>(url,list,{        
            loading: true,
            successMsg: '提交成功',
        });  
        console.log('保存股票结果:', data);
        return data.status;
    } catch (error) {
        console.error('保存股票失败:', error);
        return undefined;
    }
}
async function alarming(): Promise<WarningType[] | undefined> {
    const url = '/api/line/Alarming'
    try {
        const data = await http.get<{ success: boolean; codeList: WarningType[] }>(url,{        
            loading: false,
            successMsg: '',
        });
        console.log('搜索股票加载结果:', data);
        return data.codeList;
    } catch (error) {
        console.error('搜索股票数据失败:', error);
        return undefined;
    }
}
async function loadStockDetails(list:any) {
    const url = '/api/line/selectName'
    try {
        const data = await http.post<{ success: boolean,rows:any[]}>(url,list,{        
            loading: true,
            successMsg: '提交成功',
        });  
        console.log('获取股票详细结果:', data);
        return data.rows;
    } catch (error) {
        console.error('获取股票详细信息:', error);
        return undefined;
    }
}
export default {
    loadStocks,
    loadRecommendStocks,
    selectCode,
    saveCode,
    alarming,
    loadStockDetails,
    loadStocksAnalysis,
    loadRecommendStockAnalysis
}
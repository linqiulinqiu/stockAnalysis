// src/types/stock.ts
export interface StockData {
  code: string; // 股票代码
  name: string; // 股票名称
  price: number; // 当前价格
  increaseRate: number; // 涨幅(%)
  volume: number; // 成交量(手)
  volumeRatio: number; // 量比
  turnoverRate: number; // 换手率(%)
  circulateMarketValue: number; // 流通市值(亿)
  ma5: number[]; // 5日均线数据(最近5天)
  hasLimitUpIn20Days: boolean; // 20天内是否有涨停
  isAboveAverage: boolean; // 分时图是否在均线上方
  klineShape: "top" | "normal"; // K线形态(top: 顶部形态)
  fiveMinuteTrend: "up" | "down" | "flat"; // 5分钟K线趋势(下午2:30后)
  mainNetInflow: number; // 主力暗盘资金净流入(万)
  is5MinVolumeSurge: boolean; // 5分钟量能是否突增2倍
  is5MinPriceFlat: boolean; // 5分钟价格是否横盘
  newHigh90Days: {
    isBreak: boolean, // 是否突破90日新高
    rateFromSecondHigh: number, // 与次高的比例(%)
  };
}
// 定义表单数据类型
export interface FilterConfig {
  // 一级筛选条件
  volume: number;
  tradeMin: number;
  tradeMax: number;
  flowMin: number;
  flowMax: number;
  // 二级筛选条件
  screenOne: boolean;
  screenTwo: boolean;
  screenThree: boolean;
  screenTen: boolean;
  screenFifteen: boolean;
  scope: number;
  screenSixteen: boolean;
  
  roseMin: number;
  roseMax: number;
}
export interface RecommendConfig {
  upward: boolean; // 连续上涨天数
  section: boolean;
  // roseMin: number; // 最小涨幅%
  // roseMax: number; // 最大涨幅%
  harden: number; // 涨停时间段（天数）
  rows: Array<string>; // 推荐股票列表
  decline: boolean;
  anxious: boolean;
  divergent: boolean;
}
export interface AlarmingType {
  codeInfo: string;
  price: number;
  lot: number;
  status?: WarningType | string;
  isNew?:true | false;
}
export interface WarningType { 
  code: string;
  type: string;
  buyPrice?: number;
  hitPrice?: number;
  hitTime?: string;
  targetPercent?: string;
  mainForce?: string;
  profit?: string;
}
export interface StockDetailsType {
  _id: string;
  type: string;
  name: string;
  industry: string;
  url: string;
}
export interface StockAnalysisType {
  code: string;
  reasons: StockReasonType[];
}
interface StockReasonType { 
  detail: string;
  evidence: ReasonEvidenceMap;
  rule: string;
  [key: string]: any;
}
interface ReasonEvidenceMap {
  avg5Turnover: number;
  last5Days: string[];
  ratio: number;
  ratio2: number;
  threshold: number;
  today: string;
  todayTurnover: number;
  [key: string]: any;
}

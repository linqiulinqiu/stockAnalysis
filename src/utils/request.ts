import { ElMessage, ElLoading } from 'element-plus';
import type { LoadingInstance } from 'element-plus/es/components/loading/src/loading';

// 定义响应数据结构（根据实际后端接口调整）
// export interface ResponseData<T = any> {
//   code: number; // 业务状态码：200成功，其他失败
//   data: T;      // 响应数据
//   message: string; // 提示信息
//   [key: string]: any; // 允许其他字段
// }
// 定义响应数据结构（适配无data字段的情况，直接返回业务数据）
export type ResponseData<T = any> = T; // 响应数据就是业务数据本身
// 定义请求配置（继承fetch的RequestInit并扩展）
export interface RequestConfig extends RequestInit {
  url: string; // 请求地址
  data?: any;  // 请求体数据（POST/PUT等）
  loading?: boolean; // 是否显示加载动画（默认false）
  loadingText?: string; // 加载动画文本
  successMsg?: string; // 成功提示消息（自动显示）
  errorMsg?: string;   // 错误提示消息（自动显示，默认使用后端message）
  cancelToken?: AbortController; // 请求取消控制器
}

// 基础URL（可从环境变量获取）
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// 默认请求头
const defaultHeaders: HeadersInit = {
  'Content-Type': 'application/json;charset=UTF-8',
};

// 全局加载实例
let loadingInstance: LoadingInstance | null = null;
let loadingCount = 0;

/**
 * 显示加载动画
 * @param text 加载文本
 */
const showLoading = (text = '加载中...') => {
  if (loadingCount === 0) {
    loadingInstance = ElLoading.service({
      lock: true,
      text,
      background: 'rgba(0, 0, 0, 0.1)',
    });
  }
  loadingCount++;
};

/**
 * 隐藏加载动画
 */
const hideLoading = () => {
  if (loadingCount > 0) {
    loadingCount--;
  }
  if (loadingCount === 0 && loadingInstance) {
    loadingInstance.close();
    loadingInstance = null;
  }
};

/**
 * 处理请求URL
 * @param url 请求地址
 * @returns 完整URL
 */
const handleUrl = (url: string) => {
  // 绝对路径直接返回，否则拼接基础URL
  return url.startsWith('http') ? url : `${BASE_URL}${url}`;
};

/**
 * 处理请求参数
 * @param config 请求配置
 * @returns 处理后的fetch参数（包含 url 字段）
 */
const handleRequestOptions = (config: RequestConfig): (RequestInit & { url: string }) => {
  const { url, data, method = 'GET', headers, ...rest } = config;

  // 合并请求头
  const requestHeaders = { ...defaultHeaders, ...headers };

  // GET请求处理参数（拼接到URL）
  let requestUrl = handleUrl(url);
  if (method.toUpperCase() === 'GET' && data) {
    const params = new URLSearchParams();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
    requestUrl += `?${params.toString()}`;
  }

  return {
    url: requestUrl,
    method,
    headers: requestHeaders,
    // POST/PUT等方法处理请求体
    body: method.toUpperCase() !== 'GET' && data ? JSON.stringify(data) : undefined,
    ...rest,
  } as RequestInit & { url: string };
};

/**
 * 处理响应数据（无data字段，直接返回原始数据）
 * @param response fetch响应对象
 * @returns 解析后的响应数据（直接是业务数据T）
 */
const handleResponse = async <T>(response: Response): Promise<ResponseData<T>> => {
  // 非200状态码视为请求失败
  if (!response.ok) {
    const errorText = `请求失败：${response.status} ${response.statusText}`;
    ElMessage.error(errorText);
    throw new Error(errorText);
  }

  // 解析响应体（支持JSON和文本）
  const contentType = response.headers.get('content-type');
  let result: any;
  if (contentType?.includes('application/json')) {
    result = await response.json(); // 直接返回JSON数据（无data字段）
  } else {
    result = await response.text(); // 非JSON格式直接返回文本
  }

  // 如果后端有业务错误码（比如code≠0），在这里处理（根据实际后端规则调整）
  // 示例：如果后端返回 { code: 500, msg: '错误' }，则需要单独判断
  if (result.code !== undefined && result.code !== 200 && result.code !== 0) {
    throw new Error(result.msg || result.message || '业务处理失败');
  }

  return result as ResponseData<T>; // 直接返回原始数据（类型为T）
};

/**
 * 封装fetch请求（适配无data字段的响应）
 * @param config 请求配置
 * @returns 响应数据（直接是业务数据T）
 */
export const request = async <T = any>(config: RequestConfig): Promise<T> => {
  const { loading = false, loadingText, successMsg, errorMsg, cancelToken } = config;

  try {
    if (loading) {
      showLoading(loadingText);
    }

    const options = handleRequestOptions(config);
    const { url: fetchUrl, ...fetchInit } = options;
    const response = await fetch(fetchUrl, {
      ...fetchInit,
      signal: cancelToken?.signal,
    } as RequestInit);

    // 处理响应：result直接是业务数据（类型为T）
    const result = await handleResponse<T>(response);

    if (successMsg) {
      ElMessage.success(successMsg);
    }

    // 直接返回result（因为result就是业务数据，无data字段）
    return result; 

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '请求发生未知错误';
    ElMessage.error(errorMsg || errorMessage);
    throw error;
  } finally {
    if (loading) {
      hideLoading();
    }
  }
};

// 封装常用请求方法
export const http = {
  get: <T = any>(url: string, config?: Omit<RequestConfig, 'url' | 'method'>) => {
    return request<T>({ url, method: 'GET', ...config });
  },

  post: <T = any>(url: string, data?: any, config?: Omit<RequestConfig, 'url' | 'method' | 'data'>) => {
    return request<T>({ url, method: 'POST', data, ...config });
  },

  put: <T = any>(url: string, data?: any, config?: Omit<RequestConfig, 'url' | 'method' | 'data'>) => {
    return request<T>({ url, method: 'PUT', data, ...config });
  },

  delete: <T = any>(url: string, config?: Omit<RequestConfig, 'url' | 'method'>) => {
    return request<T>({ url, method: 'DELETE', ...config });
  },
};

export default http;
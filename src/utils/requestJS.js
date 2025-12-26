import axios from "axios";
import { ElLoading, ElMessage } from "element-plus";
/**
 * 请求配置
 */
const CONFIG = {
  baseURL: import.meta.env.VITE_APP_API_URL + import.meta.env.VITE_APP_BASE_API,
  timeout: 30000,
  contentType: "application/json;charset=UTF-8",
  tokenKey: "token",
  loadingText: "Loading...",
  defaultErrorMsg: "请求失败",
  clientIP: "ClientIP",
  addressMessage: "addressMessage",
};

/**
 * Loading 相关处理
 */
class LoadingService {
  constructor() {
    this.loading = null;
    this.requestCount = 0;
  }

  start() {
    if (this.requestCount === 0) {
      // this.loading = ElLoading.service({ text: CONFIG.loadingText, lock: true });
    }
    this.requestCount++;
  }

  end() {
    if (this.requestCount <= 0) return;
    this.requestCount--;
    if (this.requestCount === 0) {
      // this.loading?.close();
      // this.loading = null;
    }
  }
}
function initClientIP() {
  axios
    .get("https://qifu-api.baidubce.com/ip/local/geo/v1/district")
    .then((response) => {
      const clientIP = response?.data?.ip;
      const addressMessage = response?.data?.data;
      console.log("客户端IP:", clientIP);
      // console.log('客户端信息:', addressMessage);
      localStorage.setItem(CONFIG.clientIP, clientIP);
      localStorage.setItem(
        CONFIG.addressMessage,
        JSON.stringify(addressMessage)
      );
    })
    .catch((error) => {
      console.error("IP获取失败:", error);
      // 可选：设置定时重试
      // setTimeout(initClientIP, 30000); // 30秒后重试
    });
}
initClientIP();
const loadingService = new LoadingService();

/**
 * 错误处理函数
 */
const errorHandler = {
  // HTTP 状态码对应的错误信息
  statusMessages: {
    400: "请求错误 (400)",
    401: "登录已过期，请重新登录",
    403: "拒绝访问 (403)",
    404: "请求的资源不存在 (404)",
    500: "服务器错误 (500)",
  },

  // 处理 HTTP 错误
  handleHttpError(error) {
    const status = error.response?.status;
    const errorMsg = this.statusMessages[status] || `连接错误 (${status})`;

    ElMessage.error(errorMsg);

    // 401 特殊处理：清除用户信息并跳转到登录页
    if (status === 401) {
      this.handleUnauthorized();
    }

    return Promise.reject(error);
  },

  // 处理未授权错误
  handleUnauthorized() {
    localStorage.removeItem(CONFIG.tokenKey);
    localStorage.removeItem(CONFIG.addressMessage);
    window.location.href = "/login";
  },

  // 处理业务错误
  handleBusinessError(responseData) {
    const errorMsg =
      responseData.msg || responseData.message || CONFIG.defaultErrorMsg;
    ElMessage.error(errorMsg);
    return Promise.reject(responseData);
  },

  // 处理其他错误
  handleOtherError(error) {
    const errorMsg = error.response?.data?.msg || error.message || "未知错误";
    ElMessage.error(`请求失败: ${errorMsg}`);
    return Promise.reject(error);
  },
};

/**
 * 创建并配置 axios 请求实例
 */
const request = axios.create({
  baseURL: CONFIG.baseURL,
  timeout: CONFIG.timeout,
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    loadingService.start();

    // 设置请求头
    config.headers["Content-Type"] = CONFIG.contentType;

    // 添加 token
    const token = localStorage.getItem(CONFIG.tokenKey);
    const clientIP = localStorage.getItem(CONFIG.clientIP);
    if (token) {
      config.headers[CONFIG.tokenKey] = token;
    }
    // 添加缓存的IP
    if (clientIP) {
      config.headers[CONFIG.clientIP] = clientIP;
    }

    return config;
  },
  (error) => {
    loadingService.end();
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    loadingService.end();

    // 如果 server 返回的是文件流，config.responseType 会是 'blob'
    if (response.config.responseType === "blob") {
      return response; // 整个 response，包含 data (Blob) + headers + status
    }
    // 获取响应数据
    let responseData = response.data;

    // 处理业务错误码
    if (responseData.code && responseData.code !== 200) {
      return errorHandler.handleBusinessError(responseData);
    }

    // 处理字符串响应数据
    if (typeof responseData === "string") {
      try {
        responseData = JSON.parse(responseData);
      } catch (e) {
        console.warn("Response data parsing failed:", e);
      }
    }

    return responseData;
  },
  (error) => {
    loadingService.end();

    // 处理 HTTP 错误
    if (error.response) {
      return errorHandler.handleHttpError(error);
    }

    // 处理其他错误（如网络错误、超时等）
    return errorHandler.handleOtherError(error);
  }
);

/**
 * 请求方法封装
 */
const http = {
  get(url, params, config = {}) {
    return request.get(url, { params, ...config });
  },

  post(url, data, config = {}) {
    return request.post(url, data, config);
  },

  put(url, data, config = {}) {
    return request.put(url, data, config);
  },

  delete(url, config = {}) {
    return request.delete(url, config);
  },

  // 改造 downloadFile，直接返回完整 response
  downloadFile(url, params = {}, extraHeaders = {}) {
    return request.get(url, {
      params,
      responseType: "blob",
      headers: {
        ...extraHeaders,
      },
    });
  },
};
export default http;

import {ElMessage} from 'element-plus';
import Auth from "@/common/auth.js";

// 超时时间，单位 ms
const TIMEOUT = 30000;

// 错误处理
function handleError(status) {
    switch (status) {
        case 400:
            ElMessage.error("请求错误");
            break;
        case 401:
            ElMessage.error("未授权，请重新登录");
            sessionStorage.removeItem("Gmv-Token");
            window.location.href = "/login";
            break;
        case 403:
            ElMessage.error("拒绝访问");
            break;
        case 404:
            ElMessage.error("请求错误，未找到相应的资源");
            break;
        case 408:
            ElMessage.error("请求超时");
            break;
        case 500:
            ElMessage.error("服务器内部错误");
            break;
        case 501:
            ElMessage.error("网络未实现");
            break;
        case 502:
            ElMessage.error("网络错误");
            break;
        case 503:
            ElMessage.error("服务不可用");
            break;
        case 504:
            ElMessage.error("网络超时");
            break;
        case 505:
            ElMessage.error("HTTP版本不支持该请求");
            break;
        default:
            ElMessage.error("请求失败");
    }
}

// 封装fetch
const request = (url, options = {}) => {
    const controller = new AbortController();
    const signal = controller.signal;

    // 自动加上 Token
    const token = Auth.getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? {'Gmv-Token': token} : {}),
        ...options.headers
    };

    // 开启超时定时器
    const timeoutId = setTimeout(() => {
        controller.abort();
    }, TIMEOUT);

    url = url.startsWith('./') ? url.substring(1) : url;
    return fetch('/api' + url, {
        ...options,
        headers,
        signal
    }).then(async response => {
        clearTimeout(timeoutId);

        if (!response.ok) {
            handleError(response.status);
            return Promise.reject(new Error('请求错误'));
        }

        // 这里可以根据 response content-type 来决定解析方式
        const contentType = response.headers.get('Content-Type');
        if (contentType && contentType.includes('application/json')) {
            return response.json();
        } else {
            return response.blob();
        }

    }).catch(error => {
        clearTimeout(timeoutId);

        if (error.name === 'AbortError') {
            ElMessage.error("服务器响应超时，请刷新页面");
        } else {
            ElMessage.error("连接服务器失败");
        }
        return Promise.reject(error);
    });
};

export default request;

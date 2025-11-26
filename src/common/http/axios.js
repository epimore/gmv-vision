import axios from "axios";
import {ElMessage} from 'element-plus'
import Auth, {ConfigEnum} from "@/common/auth.js";
import signMd5Utils from "@/common/signMd5Utils.js";

const base_instance = (baseURL) => {
    const instance = axios.create({
        baseURL: baseURL,
        timeout: 30000,
        headers: {
            'Content-Type': 'application/json'
        }
    });

    // 请求拦截器
    instance.interceptors.request.use(
        config => {
            const url = config.url || '';
            config.headers[ConfigEnum.TOKEN] = Auth.getToken()
            config.headers[ConfigEnum.TENANT_ID] = Auth.getTenantId()
            config.headers[ConfigEnum.TIMESTAMP] = signMd5Utils.getTimestamp()
            config.headers[ConfigEnum.VERSION] = 'v3'
            config.headers[ConfigEnum.Sign] = signMd5Utils.getSign(url, config.params || {})
            return config;
        },
        error => Promise.reject(error)
    );

    // 响应拦截器
    instance.interceptors.response.use(
        res => res,
        error => {
            if (error && error.response) {
                const status = error.response.status;
                switch (status) {
                    case 400: ElMessage.error("请求错误"); break;
                    case 401:
                        ElMessage.error("未授权，请重新登录");
                        sessionStorage.clear()
                        window.location.href = "/login";
                        break;
                    case 403: ElMessage.error("拒绝访问"); break;
                    case 404: ElMessage.error("资源未找到"); break;
                    case 408: ElMessage.error("请求超时"); break;
                    case 500: ElMessage.error("服务器内部错误"); break;
                    case 502: ElMessage.error("网络错误"); break;
                    case 503: ElMessage.error("服务不可用"); break;
                    case 504: ElMessage.error("网络超时"); break;
                    default: ElMessage.error("请求失败");
                }
            } else {
                if (JSON.stringify(error).includes("timeout")) {
                    ElMessage.error("服务器响应超时，请刷新页面");
                }
                ElMessage.error("连接服务器失败");
            }
            return Promise.reject(error);
        }
    );

    return instance;
};

export const instance = base_instance('/epimore-gmv');          // 默认启用 baseURL
export const api_instance = base_instance('/api'); // 不使用 baseURL


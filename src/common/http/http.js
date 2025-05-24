import {api_instance, instance} from "./axios.js";
import Auth from "@/common/auth.js";

const post = (url, data) => {
    return new Promise((resolve, reject) => {
        instance.post(url, data).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}
const get = (url, data) => {
    return new Promise((resolve, reject) => {
        instance.get(url, {params: data}).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}
const put = (url, data) => {
    return new Promise((resolve, reject) => {
        instance.put(url, data).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}

const del = (url, data) => {
    return new Promise((resolve, reject) => {
        instance.delete(url, {params: data}).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}

export const request_image = async (url) => {
    return api_instance.get(url, {responseType: "blob"});
};

const downVideo = (fileId, videoUrl) => {
    const token = Auth.getToken() || '';

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = `/api${videoUrl}`;
    form.style.display = 'none';
    form.target = '_blank'; // 新开窗口下载，不影响当前页面

    const tokenInput = document.createElement('input');
    tokenInput.name = 'Gmv-Token';
    tokenInput.value = token;
    form.appendChild(tokenInput);

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
};

export default {
    post, get, put, del, request_image, downVideo
}
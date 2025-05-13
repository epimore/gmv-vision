import http from "@/common/http/http.js";
import request from "@/common/http/fetch.js";
import {ElMessage} from "element-plus";

const liveStream = (data) => {
    return http.post("/opt/play/live", data);
};
const backStream = (data) => {
    return http.post("/opt/play/back", data);
};
const seekStream = (data) => {
    return http.post("/opt/play/back/seek", data);
};
const speedStream = (data) => {
    return http.post("/opt/play/back/speed", data);
};
const controlPtz = (data) => {
    return http.post("/opt/control/ptz", data);
};
const createDownloadTask = (data) => {
    return http.post("/opt/create/down", data);
};
const downTaskInfo = (data) => {
    return http.post("/opt/down/info", data);
};

const tearDownTask = (data) => {
    return http.post("/opt/teardown/task", data);
};
const rmFile = (data) => {
    return http.post("/opt/rm/file", data);
};

export const down_video = async (fileId) => {
    request('/opt/download/file?fileId=' + fileId, {
        method: 'GET'
    }).then(async (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = fileId + '.mp4';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }).catch(err => {
        console.error(err);
        ElMessage.error('下载失败');
    });
};

export default {
    liveStream,
    backStream,
    seekStream,
    speedStream,
    controlPtz,
    createDownloadTask,
    downTaskInfo,
    tearDownTask,
    rmFile,
    down_video
}

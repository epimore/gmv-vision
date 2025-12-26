import http from "@/common/http/http.js";

const queryGbServerInfos = (data) => {
    return http.post("/domain/servers", data);
};
const queryGbDomainDevice = (data) => {
    return http.post("/domain/device", data);
};
const getGbNetworkDeviceTypeInfo = () => {
    return http.post("/domain/types");
};

export default {
    queryGbServerInfos,
    queryGbDomainDevice,
    getGbNetworkDeviceTypeInfo
}
import http from "@/common/http/http.js";
import sse from "@/common/http/sse.js";

const eventConn = (onMessage, onError) => {
    return sse('/epimore-gmv/sse/connect', onMessage, onError);
};
const eventClose = () => {
    return http.post("/sse/close", null);
};

export default {
    eventConn, eventClose
}

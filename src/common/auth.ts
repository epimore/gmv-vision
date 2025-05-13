class Auth {
    static setTenantId(tenantId: string) {
        return sessionStorage.setItem(GmvConfigEnum.TENANT_ID, tenantId);
    }
    static setToken(token: string) {
        return sessionStorage.setItem(GmvConfigEnum.TOKEN, token);
    }
    static getTenantId() {
        return sessionStorage.getItem(GmvConfigEnum.TENANT_ID);
    }
    static getToken() {
        return sessionStorage.getItem(GmvConfigEnum.TOKEN);
    }
}

export default Auth;

/**
 * 请求header
 * @description:  contentTyp
 */
export enum ConfigEnum {
    // TOKEN
    TOKEN = 'X-Access-Token',
    // TIMESTAMP
    TIMESTAMP = 'X-TIMESTAMP',
    // Sign
    Sign = 'X-Sign',
    // 租户id
    TENANT_ID = 'X-Tenant-Id',
    // 版本
    VERSION = 'X-Version',
    // 低代码应用ID
    X_LOW_APP_ID = 'X-Low-App-ID',
}

/**
 * 请求header
 * @description:  contentTyp
 */
enum GmvConfigEnum {
    // TOKEN
    TOKEN = 'Gmv_X-Access-Token',
    // 租户id
    TENANT_ID = 'Gmv_X-Tenant-Id',
}
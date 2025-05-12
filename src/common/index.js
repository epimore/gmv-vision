let commonData = {};
let globalState = {};

const common = {
    /**
     * 设置来自主应用的公共数据
     * @param {Object} props
     */
    setCommonData(props) {
        // 例如记录主应用传过来的通信方法或用户信息
        commonData = {
            ...commonData,
            ...props,
        };
        console.log('[common] setCommonData:', commonData);
    },

    /**
     * 初始化全局状态（通常用于主子通信或状态注入）
     * @param {Object} props
     */
    initGlState(props) {
        // 如果主应用通过 props 传递了通信方法，监听等，可在此处理
        if (props.onGlobalStateChange) {
            props.onGlobalStateChange((state, prev) => {
                console.log('[common] globalState changed:', state, prev);
                globalState = state;
            }, true);
        }

        if (props.setGlobalState) {
            // 保存方法用于后续更新状态
            globalState = props.setGlobalState;
        }

        console.log('[common] initGlState done');
    },

    getCommonData() {
        return commonData;
    },

    getGlobalState() {
        return globalState;
    },
};

export default common;

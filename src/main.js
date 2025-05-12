import {createApp} from 'vue'
import App from './App.vue'
import {createMyRouter} from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import {renderWithQiankun, qiankunWindow} from 'vite-plugin-qiankun/es/helper'
import common from './common'

let app = null

function render(props = {}) {
    const {container} = props
    app = createApp(App)
    app.use(createMyRouter())
    app.use(ElementPlus, {locale: zhCn})

    const el = container
        ? container.querySelector('#app')
        : document.getElementById('app')
    app.mount(el)
}

// 启动 qiankun 生命周期
renderWithQiankun({
    bootstrap(props) {
        console.log('[子应用] bootstrap')
        common.setCommonData(props)
    },
    mount(props) {
        console.log('[子应用] mount')
        common.initGlState(props)
        render(props)
    },
    unmount() {
        console.log('[子应用] unmount')
        app.unmount()
        const el = app._container
        if (el) el.innerHTML = ''
        app = null
    },
    update(props) {
        console.log('[子应用] update', props)
        common.setCommonData(props)
    },
})

// 独立运行时
if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
    render()
}

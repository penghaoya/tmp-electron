# AGENTS

本文件为仓库内协作与约定指南（Agent/Human 统一遵循）。当前项目处于“基础搭建阶段”，本文档聚焦于基础设施、工程规范与安全加固，不包含任何业务逻辑实现。

## 项目概述

基于 Electron + Vue 3 + Vite 的桌面应用。采用主进程（main）/预加载（preload）/渲染进程（renderer）标准分层，提供共享模块（packages/share）承载跨进程通用常量与纯函数。

**技术栈版本（以 package.json 为准）**

- Electron 37.5.1
- Vue 3.5.21
- Vite 7.0.7
- UnoCSS
- Naive UI
- Pinia（已安装，框架可用，暂未在应用启用）
- @iconify/vue

## 设置命令

- 安装依赖：`npm install`
- 启动开发：`npm run dev`
- 构建生产：`npm run build`
- 构建并保留未打包目录：`npm run build:unpack`
- 平台打包：`npm run build:win` / `npm run build:mac` / `npm run build:linux`
- 代码检查：`npm run lint`
- 代码格式化：`npm run format`

## 项目结构

```
src/
├── main/                    # Electron 主进程
│   ├── index.js            # 主进程入口
│   ├── ipc/                # IPC 处理注册与分发
│   │   ├── index.js        # 汇总注册
│   │   └── window.js       # 窗口相关 IPC
│   └── windows/            # 窗口管理
│       ├── index.js
│       ├── windowManager.js
│       ├── mainWindow.js
│       ├── loginWindow.js
│       └── settingWindow.js
├── preload/                # 预加载脚本（上下文隔离桥）
│   └── index.js
├── renderer/               # Vue 前端
│   ├── index.html
│   └── src/
│       ├── App.vue
│       ├── main.js
│       ├── router/
│       │   ├── index.js
│       │   └── routes.js
│       ├── views/
│       │   ├── Home/
│       │   ├── Login/
│       │   └── Setting/
│       ├── components/
│       │   └── Layout/
│       ├── store/          # Pinia（当前未在应用启用）
│       │   └── auth.js     # 示例文件，禁止依赖为真实业务
│       └── assets/
│           └── main.css
packages/
└── share/
    └── IpcChannel.js       # IPC 通道常量与（建议）校验函数
```

## 路径别名使用规范

统一使用别名导入，禁止相对路径穿越。所有导入在可行情况下都应包含扩展名 `.js`（与 Vite/Electron 打包器配置一致）。

**可用别名**（electron.vite.config.mjs 已配置）：

- `@shared/*` → `packages/share/*`
- `@main/*` → `src/main/*`
- `@preload/*` → `src/preload/*`
- `@renderer/*` → `src/renderer/src/*`
- `@components/*` → `src/renderer/src/components/*`
- `@views/*` → `src/renderer/src/views/*`
- `@store/*` → `src/renderer/src/store/*`
- `@assets/*` → `src/renderer/src/assets/*`

示例：

```js
// ✅ 正确（别名 + 扩展名）
import { IPC_CHANNELS } from '@shared/IpcChannel.js'
import { createMainWindow } from '@main/windows/mainWindow.js'
import HomeView from '@views/Home/index.vue'

// ❌ 错误（相对路径、缺失扩展名或跨层路径穿越）
// import { IPC_CHANNELS } from '../../packages/share/IpcChannel'
// import { createMainWindow } from '../windows/mainWindow'
```

## 开发指南

### 1) 窗口管理与路由加载

- 统一使用集中式 `windowManager` 创建/获取窗口，支持 `single: true` 避免重复创建。
- 开发环境：`loadURL(process.env.ELECTRON_RENDERER_URL + '/#' + (route || ''))`。
- 生产环境：使用 Hash 路由：
  - 计算 `file://` 形式的 `index.html`，通过 `loadURL('file:///.../index.html#' + (route || ''))`，不要通过 query 传路由（与 Hash Router 不匹配）。
- 拦截外链：保持 `webContents.setWindowOpenHandler` 中的 `shell.openExternal`。

### 2) 安全基线（必须遵守）

在 `BrowserWindow` 中强制以下设置：

```js
new BrowserWindow({
  // ...
  webPreferences: {
    preload: join(__dirname, '../preload/index.js'),
    sandbox: true,
    contextIsolation: true,
    nodeIntegration: false,
    enableRemoteModule: false
  }
})
```

- 不在渲染器中暴露 `ipcRenderer` 或 Node API。
- 仅通过预加载桥暴露白名单 API（见下一节）。
- 推荐使用 `app.requestSingleInstanceLock()` 避免多实例。

### 3) 预加载（Context Bridge）

- 仅暴露最小 API：

```js
// @preload/index.js（示意）
import { contextBridge, ipcRenderer } from 'electron'
import { IPC_CHANNELS, WINDOW_ACTIONS } from '@shared/IpcChannel.js'

const api = {
  window: {
    control: (action, key = 'main') => {
      if (!WINDOW_ACTIONS.includes(action)) throw new Error('Invalid action')
      return ipcRenderer.send(IPC_CHANNELS.WINDOW.CONTROL, action, key)
    }
  }
}

contextBridge.exposeInMainWorld('api', api)
```

- 避免在任何情况下向 `window` 直接挂载 `ipcRenderer` 或 `electronAPI`。
- 参数做基本校验（字符串白名单、必填校验），返回 `invoke/handle` 时使用统一结构（见 IPC 规范）。

### 4) IPC 通信规范

统一在 `@shared/IpcChannel.js` 定义通道常量与动作枚举，禁止硬编码字符串。

建议结构：

```js
// @shared/IpcChannel.js（建议）
export const IPC_CHANNELS = {
  WINDOW: {
    CONTROL: 'window:control', // 动作：minimize/maximize/close/restore/toggleDevTools
    CREATE: 'window:create' // 以 payload 指定 key（如 'main' / 'setting'）
  },
  APP: {
    PING: 'app:ping'
  }
}

export const WINDOW_ACTIONS = ['minimize', 'maximize', 'close', 'restore', 'toggleDevTools']

export function validateChannel(name) {
  return typeof name === 'string' && name.includes(':')
}
```

处理器规范：

- `ipcMain.handle` 用于请求-响应；`ipcMain.on` 用于触发即忘。
- 统一返回：成功 `{ ok: true, data }`，失败 `{ ok: false, code, message }`。
- 在 `src/main/ipc/` 下按领域拆分（window/app/system 等），通过 `registerAllIpcHandlers()` 集中注册。

### 5) CSP（内容安全策略）

`src/renderer/index.html` 中推荐使用基于环境的 CSP：

- 开发（允许 HMR 必需能力，尽量避免 `unsafe-inline` 脚本）：
  ```html
  <meta
    http-equiv="Content-Security-Policy"
    content="default-src 'self' data: https:; script-src 'self' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https: ws: wss:; media-src 'self' blob: data:; object-src 'none'; base-uri 'self'; frame-ancestors 'none';"
  />
  ```
- 生产（更严格，移除脚本 `unsafe-inline`）：
  ```html
  <meta
    http-equiv="Content-Security-Policy"
    content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; media-src 'self' blob:; object-src 'none'; base-uri 'self'; frame-ancestors 'none';"
  />
  ```

> 说明：UnoCSS 常需要允许内联样式（`style-src 'unsafe-inline'`），脚本层面应尽量移除 inline。

### 6) Vue/Pinia 基线

- 引入 Pinia 但仅启用框架，不写入业务逻辑：
  - 新增 `src/renderer/src/store/index.js` 暴露 `createPinia()`；在 `src/renderer/src/main.js` 中 `app.use(pinia)`。
  - 示例/演示类 store 文件不得在应用流程中被实际依赖。
- 组件风格：优先 `<script setup>` 与 Composition API；字符串使用单引号，分号按 Prettier 统一（已配置）。

### 7) UnoCSS 预设

- 推荐使用官方预设：`presetUno` 或 `@unocss/preset-uno`。
- 若继续使用其他预设，务必在 `devDependencies` 中显式安装对应包，并在 `uno.config.js` 正确引入。

示例：

```js
// uno.config.js（推荐）
import { defineConfig, presetUno } from 'unocss'
import presetWind4 from '@unocss/preset-wind4'
export default defineConfig({
  presets: [
    presetWind4({
      preflights: {
        reset: true
      }
    })
  ]
})
```

### 8) 日志规范

- 主进程统一使用 `@main/utils/logger.js` 暴露的分级函数（`info`/`warn`/`error`/`debug`），通过命名空间导入：`import * as logger from '@main/utils/logger.js'`，按需调用 `logger.info("消息", payload)`，禁止自行创建 `electron-log` 实例或修改公共 transports。
- `windowManager` 及相关窗口模块的日志文案必须使用中文描述，同时保留结构化上下文参数（例如 `{ key, url }`），以便排查问题。
- 其他主进程模块如需区分作用域，可在消息中增加前缀（示例：`logger.info("[ipc] 已注册窗口通道")`），避免额外创建自定义 logger。
- 共享 logger 已支持多参数传递，直接传入对象即可，无需手工 `JSON.stringify`。

## 测试说明

- 单元测试：计划引入 Vitest（优先为共享层纯函数与预加载桥工具做测试）。
- 端到端：计划引入 Playwright（基本窗口创建与路由可达性）。
- 手动测试：`npm run dev` 后验证窗口控制、外链拦截、路由跳转。

## 构建与发布

- 构建：`electron-vite build`；打包：`electron-builder`（已配置 asar、平台产物）。
- 自动更新：`electron-updater` 已加入依赖，但需正式更新服务器后再启用；避免在开发阶段触发。
- 代码签名：尚未配置，发布前补齐。

## 当前状态

**已实现**

- 基本 Electron 应用结构与窗口管理
- Vue 3 + Router + 动态加载
- IPC 基础骨架（window 相关）
- ESLint/Prettier/UnoCSS/Naive UI 集成

**需完善（本阶段）**

- 安全基线（sandbox/contextIsolation/nodeIntegration）
- 预加载 API 收敛（不暴露 ipcRenderer）
- IPC 通道统一与校验、错误响应格式
- 生产环境路由加载改为 `file://...#route`
- Pinia 启用（仅框架，不含业务）
- CSP 区分 dev/prod 并收紧脚本策略
- 统一 UTF-8 编码，修复中文注释乱码
- UnoCSS 预设与依赖一致性

## 常见任务

### 添加新窗口

1. 在 `@main/windows/` 中新增 `xxxWindow.js` 并通过 `windowManager.create(key, options)` 创建。
2. 于 `@main/windows/index.js` 导出创建函数。
3. 在 `@renderer/router/routes.js` 添加路由（Hash 模式）。
4. 在 `@renderer/views/` 新增对应 `index.vue`。

`options` 约定：

- `single: true` 单实例
- `route: '/path'` 与 Hash 路由对应
- 其他常见窗口参数按 Electron 文档配置

### 添加 IPC 通信

1. 在 `@shared/IpcChannel.js` 增加通道常量（遵循 `category:action` 格式）与可选校验函数。
2. 在 `@main/ipc/` 新增处理器模块，使用 `ipcMain.handle`/`on` 注册，并加入 `registerAllIpcHandlers()`。
3. 在 `@preload/index.js` 暴露对应白名单 API，进行参数校验。
4. 在渲染器通过 `window.api` 调用，严禁直接使用 `ipcRenderer`。

### 使用共享代码

1. 共享代码必须为纯函数或常量，禁止包含进程相关 API。
2. 通过 `@shared/*` 引入，并保持向后兼容性；重大变更需联动更新使用方。

### 添加新页面/视图

1. 在 `@views/` 创建组件。
2. 在 `@renderer/router/routes.js` 注册。
3. 仅使用别名导入，保持 `.js` 扩展名一致。

### 启用 Pinia（基础框架）

1. 新建 `@store/index.js`：
   ```js
   import { createPinia } from 'pinia'
   export default createPinia()
   ```
2. 在 `@renderer/main.js`：
   ```js
   import pinia from '@store/index.js'
   app.use(pinia)
   ```
3. 不在本阶段引入任何业务 store 到应用流程中。

## 环境变量

- `ELECTRON_RENDERER_URL`：开发服务器 URL（由 electron-vite 设置）。

## 调试

- 主进程：VS Code 调试配置。
- 渲染进程：Chrome DevTools（开发模式自动打开）。
- 生产调试：可在特定构建下开启 `webContents.openDevTools()`，但默认关闭。

## 依赖说明

- 主要依赖保持最新稳定版本。
- UnoCSS 预设请与依赖保持一致（推荐 `presetUno`）。
- `electron-updater` 在接入服务端前不启用。

## AI 代理安全检查清单

- [ ] 启用 `sandbox: true`
- [ ] 启用 `contextIsolation: true`
- [ ] 禁止渲染器 `nodeIntegration` 与 `enableRemoteModule`
- [ ] 仅通过预加载暴露最小 API（不暴露 `ipcRenderer`）
- [ ] IPC 严格使用共享通道常量并校验参数
- [ ] CSP 在生产环境收紧（移除脚本 inline）
- [ ] 外链统一 `shell.openExternal`
- [ ] 单实例锁 `app.requestSingleInstanceLock()`

## 代码质量检查清单

- [ ] 全量使用路径别名并补全 `.js` 扩展名
- [ ] IPC 通道使用 `@shared/IpcChannel.js` 常量
- [ ] 所有 IPC 处理器具备错误捕获与统一返回结构
- [ ] 共享代码为纯函数/常量
- [ ] 通过 ESLint/Prettier 校验（`npm run lint`/`npm run format`）
- [ ] 文件编码统一 UTF-8，中文注释不乱码
- [ ] UnoCSS 预设与依赖一致

## 性能优化检查清单

- [ ] 避免在 IPC 中传输大体积数据
- [ ] 必要时采用流式/分块传输
- [ ] 渲染端按需加载与代码分割
- [ ] 合理使用缓存（如内存/磁盘缓存策略）
- [ ] 关注启动时长与首屏响应

---

如需在本阶段推进修改，建议优先完成：

1. BrowserWindow 安全基线落地；2) 预加载 API 收敛；3) IPC 常量统一与校验；4) 生产路由改为 `file://...#route`；5) 启用 Pinia 框架（不引入业务）；6) CSP 按环境区分；7) 统一编码与别名规则；8) UnoCSS 预设/依赖对齐。

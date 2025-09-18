/**
 * IPC 通道定义
 * 统一主进程与渲染进程之间的通信事件
 */
export const IPC_CHANNELS = {
  WINDOW: {
    // 窗口控制（动作通过参数指定）
    CONTROL: 'window:control',
    // 泛化的创建窗口事件（payload 传 key，例如 'main' | 'setting'）
    CREATE: 'window:create',
    // 兼容现有的创建事件（可逐步废弃，推荐使用 CREATE）
    MAIN: 'create:main:window',
    SETTING: 'create:setting:window'
  }
}

// 允许的窗口控制动作（白名单）
export const WINDOW_ACTIONS = ['minimize', 'maximize', 'close', 'restore', 'toggleDevTools']

// 简单通道格式校验（category:action）
export function validateChannel(name) {
  return typeof name === 'string' && name.includes(':')
}


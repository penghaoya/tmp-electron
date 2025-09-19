/**
 * IPC 通道定义
 * 统一主进程与渲染进程之间的通信事件
 */
export const IPC_CHANNELS = {
  WINDOW: {
    // 窗口控制（动作通过参数指定）
    CONTROL: 'window:control',
    CREATE: 'window:create',
    MAIN: 'create:main:window',
    SETTING: 'create:setting:window'
  },
  STORE: {
    GET: 'store:get',
    SET: 'store:set',
    HAS: 'store:has',
    REMOVE: 'store:remove',
    CLEAR: 'store:clear',
    PATH: 'store:path',
    CHANGED: 'store:changed'
  }
}

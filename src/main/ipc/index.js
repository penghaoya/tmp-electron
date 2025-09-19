import { registerWindowHandlers } from './window.js'
import { registerStoreIpc } from './store.js'
import createLogger from '@main/utils/logger.js'
const logger = createLogger('IPC')
/**
 * 注册所有 IPC 处理器
 */
export function registerAllIpcHandlers() {
  logger.info('注册IPC处理器')

  // 注册窗口相关 IPC 处理器
  registerWindowHandlers()
  // 注册存储相关 IPC 处理器
  registerStoreIpc()
}

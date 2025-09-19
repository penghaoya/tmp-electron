/**
 * Stores 入口文件
 * 统一导出所有 store 模块
 */

// 导出所有 store
export { useUserStore } from './user.js'
export { useAppStore } from './app.js'

// 导出持久化插件
export { 
  piniaPersistedState, 
  createPersistedState, 
  createStorePersistedState 
} from '../plugins/pinia-persistence.js'

/**
 * 初始化所有 stores
 * 在应用启动时调用，确保所有 store 都正确初始化
 */
export function initStores() {
  console.log('[Stores] 正在初始化所有 stores...')
  
  // 这里可以添加 store 初始化逻辑
  // 例如：预加载某些数据、设置默认值等
  
  console.log('[Stores] 所有 stores 初始化完成')
}

/**
 * 重置所有 stores
 * 用于用户退出登录或应用重置时
 */
export function resetAllStores() {
  console.log('[Stores] 正在重置所有 stores...')
  
  // 这里可以添加重置逻辑
  // 例如：调用各个 store 的重置方法
  
  console.log('[Stores] 所有 stores 重置完成')
}
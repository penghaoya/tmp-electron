import Store from 'electron-store'
import { app } from 'electron'
import createLogger from '@main/utils/logger.js'

const logger = createLogger('store')
console.log(app.getPath('userData'))
// 存储实例
let store = null
/**
 * 初始化存储
 * @param {Object} options - 存储配置选项
 */
export function initStore(options = {}) {
  if (store) return store

  try {
    // 处理 CommonJS 和 ES 模块的兼容性
    const StoreClass = Store.default || Store
    store = new StoreClass({
      name: 'app-config',
      // 使用 app.getPath('userData') 作为存储目录
      cwd: app.getPath('userData'),
      defaults: {
        app: {
          theme: 'light',
          language: 'zh-CN'
        },
        window: {
          bounds: { width: 1200, height: 800 }
        }
      },
      ...options
    })

    logger.info('[store] 存储初始化成功', { path: store.path, cwd: app.getPath('userData') })
    return store
  } catch (error) {
    logger.error('[store] 存储初始化失败', error)
    throw error
  }
}

/**
 * 获取存储实例
 */
export function getStore() {
  if (!store) {
    throw new Error('存储未初始化，请先调用 initStore()')
  }
  return store
}

/**
 * 获取配置值
 * @param {string} key - 配置键
 * @param {*} defaultValue - 默认值
 */
export function get(key, defaultValue) {
  try {
    return getStore().get(key, defaultValue)
  } catch (error) {
    logger.error('[store] 获取配置失败', { key, error })
    return defaultValue
  }
}

/**
 * 设置配置值
 * @param {string|Object} key - 配置键或配置对象
 * @param {*} value - 配置值
 */
export function set(key, value) {
  try {
    getStore().set(key, value)
    logger.debug('[store] 配置已更新', { key, value })
  } catch (error) {
    logger.error('[store] 设置配置失败', { key, value, error })
    throw error
  }
}

/**
 * 删除配置
 * @param {string} key - 配置键
 */
export function remove(key) {
  try {
    getStore().delete(key)
    logger.debug('[store] 配置已删除', { key })
  } catch (error) {
    logger.error('[store] 删除配置失败', { key, error })
    throw error
  }
}

/**
 * 检查配置是否存在
 * @param {string} key - 配置键
 */
export function has(key) {
  try {
    return getStore().has(key)
  } catch (error) {
    logger.error('[store] 检查配置失败', { key, error })
    return false
  }
}

/**
 * 清空所有配置
 */
export function clear() {
  try {
    getStore().clear()
    logger.info('[store] 所有配置已清空')
  } catch (error) {
    logger.error('[store] 清空配置失败', error)
    throw error
  }
}

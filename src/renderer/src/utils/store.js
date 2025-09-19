/**
 * 渲染进程存储服务
 * 封装 window.api.store 调用，提供统一的错误处理
 */

/**
 * 获取配置值
 * @param {string} key - 配置键
 * @param {*} defaultValue - 默认值
 * @returns {Promise<*>} 配置值
 */
export async function get(key, defaultValue) {
  try {
    const result = await window.api.store.get(key, defaultValue)
    if (result.ok) {
      return result.data
    }
    console.warn(`[store] 获取配置失败: ${result.message}`, { key })
    return defaultValue
  } catch (error) {
    console.error('[store] 获取配置异常', { key, error })
    return defaultValue
  }
}

/**
 * 设置配置值
 * @param {string|Object} key - 配置键或配置对象
 * @param {*} value - 配置值
 * @returns {Promise<boolean>} 是否成功
 */
export async function set(key, value) {
  try {
    const result = await window.api.store.set(key, value)
    if (result.ok) {
      return true
    }
    console.warn(`[store] 设置配置失败: ${result.message}`, { key, value })
    return false
  } catch (error) {
    console.error('[store] 设置配置异常', { key, value, error })
    return false
  }
}

/**
 * 删除配置
 * @param {string} key - 配置键
 * @returns {Promise<boolean>} 是否成功
 */
export async function remove(key) {
  try {
    const result = await window.api.store.remove(key)
    if (result.ok) {
      return true
    }
    console.warn(`[store] 删除配置失败: ${result.message}`, { key })
    return false
  } catch (error) {
    console.error('[store] 删除配置异常', { key, error })
    return false
  }
}

/**
 * 检查配置是否存在
 * @param {string} key - 配置键
 * @returns {Promise<boolean>} 是否存在
 */
export async function has(key) {
  try {
    const result = await window.api.store.has(key)
    if (result.ok) {
      return result.data
    }
    console.warn(`[store] 检查配置失败: ${result.message}`, { key })
    return false
  } catch (error) {
    console.error('[store] 检查配置异常', { key, error })
    return false
  }
}

/**
 * 清空所有配置
 * @returns {Promise<boolean>} 是否成功
 */
export async function clear() {
  try {
    const result = await window.api.store.clear()
    if (result.ok) {
      return true
    }
    console.warn(`[store] 清空配置失败: ${result.message}`)
    return false
  } catch (error) {
    console.error('[store] 清空配置异常', error)
    return false
  }
}
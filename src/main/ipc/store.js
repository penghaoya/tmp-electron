import { ipcMain } from 'electron'
import { IPC_CHANNELS } from '@shared/IpcChannel.js'
import * as store from '@main/utils/store.js'
import createLogger from '@main/utils/logger.js'

const logger = createLogger('ipc-store')

/**
 * 注册存储相关 IPC 处理器
 */
export function registerStoreHandlers() {
  // 获取配置
  ipcMain.handle(IPC_CHANNELS.STORE.GET, async (event, key, defaultValue) => {
    try {
      if (typeof key !== 'string' || !key.trim()) {
        return { ok: false, code: 'INVALID_KEY', message: '配置键必须为非空字符串' }
      }

      const value = store.get(key, defaultValue)
      logger.debug('[ipc] 获取配置', { key, value })
      return { ok: true, data: value }
    } catch (error) {
      logger.error('[ipc] 获取配置失败', { key, error })
      return { ok: false, code: 'GET_ERROR', message: error.message }
    }
  })

  // 设置配置
  ipcMain.handle(IPC_CHANNELS.STORE.SET, async (event, key, value) => {
    try {
      if (typeof key !== 'string' || !key.trim()) {
        return { ok: false, code: 'INVALID_KEY', message: '配置键必须为非空字符串' }
      }

      store.set(key, value)
      logger.debug('[ipc] 设置配置', { key, value })
      return { ok: true, data: null }
    } catch (error) {
      logger.error('[ipc] 设置配置失败', { key, value, error })
      return { ok: false, code: 'SET_ERROR', message: error.message }
    }
  })

  // 删除配置
  ipcMain.handle(IPC_CHANNELS.STORE.REMOVE, async (event, key) => {
    try {
      if (typeof key !== 'string' || !key.trim()) {
        return { ok: false, code: 'INVALID_KEY', message: '配置键必须为非空字符串' }
      }

      store.remove(key)
      logger.debug('[ipc] 删除配置', { key })
      return { ok: true, data: null }
    } catch (error) {
      logger.error('[ipc] 删除配置失败', { key, error })
      return { ok: false, code: 'REMOVE_ERROR', message: error.message }
    }
  })

  // 检查配置是否存在
  ipcMain.handle(IPC_CHANNELS.STORE.HAS, async (event, key) => {
    try {
      if (typeof key !== 'string' || !key.trim()) {
        return { ok: false, code: 'INVALID_KEY', message: '配置键必须为非空字符串' }
      }

      const exists = store.has(key)
      logger.debug('[ipc] 检查配置', { key, exists })
      return { ok: true, data: exists }
    } catch (error) {
      logger.error('[ipc] 检查配置失败', { key, error })
      return { ok: false, code: 'HAS_ERROR', message: error.message }
    }
  })

  // 清空所有配置
  ipcMain.handle(IPC_CHANNELS.STORE.CLEAR, async () => {
    try {
      store.clear()
      logger.info('[ipc] 清空所有配置')
      return { ok: true, data: null }
    } catch (error) {
      logger.error('[ipc] 清空配置失败', error)
      return { ok: false, code: 'CLEAR_ERROR', message: error.message }
    }
  })

  logger.info('[ipc] 已注册存储通道')
}

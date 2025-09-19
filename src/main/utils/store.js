// src/main/services/store.js
import Store from 'electron-store'
import { app } from 'electron'
import { is } from '@electron-toolkit/utils'
import createLogger from '@main/utils/logger.js'

/**
 * 轻量配置存储（electron-store）
 * - 开发：明文（is.dev === true）
 * - 生产：整文件加密（is.dev === false）
 * - 懒初始化 & 批量 set({a:1,b:2})
 */
const logger = createLogger('store')

const NAME = 'app-config'
const DEFAULTS = { app: { theme: 'light', language: 'zh-CN' } }
const ENCRYPTION_KEY = 'Zk2d1N6wQ9r4T8u0H2y5L7c9B3m1V6p2e4s8k0x3n7q1r5t9u3w=='

let _store

function ensure(options = {}) {
  if (_store) return _store
  const cwd = options.cwd ?? app.getPath('userData')
  // dev: 明文；prod: 加密
  const encryptionKey = is.dev ? undefined : ENCRYPTION_KEY

  _store = new (Store?.default || Store)({
    name: NAME,
    cwd,
    defaults: DEFAULTS,
    clearInvalidConfig: true,
    encryptionKey,
    ...options
  })

  logger.info('【存储】就绪', { path: _store.path, 加密: !is.dev })
  return _store
}

// 可选显式初始化
export const initStore = (options) => ensure(options)

// 读取（支持默认值）
export const get = (key, def) => ensure().get(key, def)

// 写入：set('a.b', v) 或 set({a:1,b:2})
export const set = (key, value) => {
  const s = ensure()
  return typeof key === 'object' ? s.set(key) : s.set(key, value)
}

// 删除（避免与关键字冲突）
export const remove = (key) => ensure().delete(key)

// 是否存在
export const has = (key) => ensure().has(key)

// 清空
export const clear = () => ensure().clear()

// 便捷导出
export const path = () => ensure().path
export const instance = () => ensure()

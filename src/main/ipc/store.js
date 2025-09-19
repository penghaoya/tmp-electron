import { ipcMain } from 'electron'
import { IPC_CHANNELS } from '@shared/IpcChannel.js'
import { set, has, remove, clear, path, instance } from '@main/utils/store.js'
import createLogger from '@main/utils/logger.js'

const logger = createLogger('ipc:store')

function ok(data) {
  return { ok: true, data }
}
function fail(code, message) {
  return { ok: false, code, message }
}

export function registerStoreIpc() {
  ipcMain.handle(IPC_CHANNELS.STORE.GET, (_e, key) => {
    try {
      const s = instance()
      if (key == null || key === '') {
        return { ok: true, data: s.store } // 返回全部
      }
      if (s.has(key)) {
        return { ok: true, data: s.get(key) } // 返回单个
      }
      return { ok: false, code: 'NOT_FOUND', message: `Key "${key}" not found` }
    } catch (e) {
      return { ok: false, code: 'READ_ERROR', message: String(e?.message || e) }
    }
  })

  ipcMain.handle(IPC_CHANNELS.STORE.SET, async (_e, key, val) => {
    try {
      set(key, val)
      return ok(true)
    } catch (e) {
      return fail('WRITE_ERROR', String(e?.message || e))
    }
  })

  ipcMain.handle(IPC_CHANNELS.STORE.HAS, async (_e, key) => {
    try {
      return ok(has(key))
    } catch (e) {
      return fail('HAS_ERROR', String(e?.message || e))
    }
  })

  ipcMain.handle(IPC_CHANNELS.STORE.REMOVE, async (_e, key) => {
    try {
      remove(key)
      return ok(true)
    } catch (e) {
      return fail('REMOVE_ERROR', String(e?.message || e))
    }
  })

  ipcMain.handle(IPC_CHANNELS.STORE.CLEAR, async () => {
    try {
      clear()
      return ok(true)
    } catch (e) {
      return fail('CLEAR_ERROR', String(e?.message || e))
    }
  })

  ipcMain.handle(IPC_CHANNELS.STORE.PATH, async () => {
    try {
      return ok(path())
    } catch (e) {
      return fail('PATH_ERROR', String(e?.message || e))
    }
  })
  logger.info('已注册 Store IPC 通道')
}

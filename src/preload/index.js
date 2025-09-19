import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { IPC_CHANNELS } from '@shared/IpcChannel.js'

const api = {
  window: {
    minimize: (key = 'main') => ipcRenderer.send(IPC_CHANNELS.WINDOW.CONTROL, 'minimize', key),
    maximize: (key = 'main') => ipcRenderer.send(IPC_CHANNELS.WINDOW.CONTROL, 'maximize', key),
    close: (key = 'main') => ipcRenderer.send(IPC_CHANNELS.WINDOW.CONTROL, 'close', key),
    restore: (key = 'main') => ipcRenderer.send(IPC_CHANNELS.WINDOW.CONTROL, 'restore', key),
    toggleDevTools: (key = 'main') =>
      ipcRenderer.send(IPC_CHANNELS.WINDOW.CONTROL, 'toggleDevTools', key)
  },
  store: {
    get: (key, defaultValue) => {
      if (typeof key !== 'string' || !key.trim()) {
        return Promise.reject(new Error('配置键必须为非空字符串'))
      }
      return ipcRenderer.invoke(IPC_CHANNELS.STORE.GET, key, defaultValue)
    },
    set: (key, value) => {
      if (typeof key !== 'string' || !key.trim()) {
        return Promise.reject(new Error('配置键必须为非空字符串'))
      }
      return ipcRenderer.invoke(IPC_CHANNELS.STORE.SET, key, value)
    },
    remove: (key) => {
      if (typeof key !== 'string' || !key.trim()) {
        return Promise.reject(new Error('配置键必须为非空字符串'))
      }
      return ipcRenderer.invoke(IPC_CHANNELS.STORE.REMOVE, key)
    },
    has: (key) => {
      if (typeof key !== 'string' || !key.trim()) {
        return Promise.reject(new Error('配置键必须为非空字符串'))
      }
      return ipcRenderer.invoke(IPC_CHANNELS.STORE.HAS, key)
    },
    clear: () => ipcRenderer.invoke(IPC_CHANNELS.STORE.CLEAR)
  }
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}

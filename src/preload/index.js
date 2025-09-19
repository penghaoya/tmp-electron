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
  win: {
    openMain: () => ipcRenderer.send(IPC_CHANNELS.WINDOW.MAIN)
  },
  store: {
    get: (key, defVal) => ipcRenderer.invoke(IPC_CHANNELS.STORE.GET, key, defVal),
    set: (key, val) => ipcRenderer.invoke(IPC_CHANNELS.STORE.SET, key, val),
    has: (key) => ipcRenderer.invoke(IPC_CHANNELS.STORE.HAS, key),
    remove: (key) => ipcRenderer.invoke(IPC_CHANNELS.STORE.REMOVE, key),
    clear: () => ipcRenderer.invoke(IPC_CHANNELS.STORE.CLEAR),
    path: () => ipcRenderer.invoke(IPC_CHANNELS.STORE.PATH),
    onDidChange: (handler) => {
      const listener = (_e, payload) => handler?.(payload)
      ipcRenderer.on(IPC_CHANNELS.STORE.CHANGED, listener)
      return () => ipcRenderer.off(IPC_CHANNELS.STORE.CHANGED, listener)
    }
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

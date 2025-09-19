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

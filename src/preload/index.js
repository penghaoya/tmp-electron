import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const api = {
  window: {
    minimize: (key = 'main') => ipcRenderer.send('window-control', 'minimize', key),
    maximize: (key = 'main') => ipcRenderer.send('window-control', 'maximize', key),
    close: (key = 'main') => ipcRenderer.send('window-control', 'close', key),
    restore: (key = 'main') => ipcRenderer.send('window-control', 'restore', key),
    toggleDevTools: (key = 'main') => ipcRenderer.send('window-control', 'toggleDevTools', key)
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

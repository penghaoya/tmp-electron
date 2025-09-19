import { ipcMain } from 'electron'
import { IPC_CHANNELS } from '@shared/IpcChannel.js'
import { createMainWindow, createSettingWindow } from '../windows/index.js'

/**
 * 注册窗口管理相关的 IPC 处理器
 */
export function registerWindowHandlers() {
  // 创建主窗口
  ipcMain.on(IPC_CHANNELS.WINDOW.MAIN, () => {
    createMainWindow()
  })

  // 创建设置窗口
  ipcMain.on(IPC_CHANNELS.WINDOW.SETTING, () => {
    createSettingWindow()
  })
}

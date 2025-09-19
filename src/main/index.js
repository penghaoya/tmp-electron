import { app, BrowserWindow } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { createMainWindow, createLoginWindow, windowManager } from '@main/windows/index.js'
import { registerAllIpcHandlers } from '@main/ipc/index.js'
import createLogger from '@main/utils/logger.js'
import { initStore } from '@main/utils/store.js'

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

const gotTheLock = app.requestSingleInstanceLock()
const logger = createLogger('主进程')
if (!gotTheLock) {
  logger.warn('未获取到单实例锁，应用退出')
  app.quit()
  process.exit(0)
} else {
  logger.debug('获取到单实例锁')
  app.on('second-instance', () => {
    logger.info('应用已运行，激活主窗口')
    const mainWin = windowManager.get('main') || BrowserWindow.getAllWindows()[0]
    if (mainWin) {
      if (mainWin.isMinimized()) mainWin.restore()
      mainWin.focus()
    }
  })
}
app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.devtools.')
  logger.info('应用已准备就绪')
  app.on('browser-window-created', (_, window) => {
    logger.debug('浏览器窗口已创建')
    optimizer.watchWindowShortcuts(window)
  })

  registerAllIpcHandlers()
  initStore()
  // 创建登录窗口
  createLoginWindow()
  // createMainWindow()
  app.on('activate', () => {
    logger.debug('应用激活')
    if (BrowserWindow.getAllWindows().length === 0) {
      logger.info('没有窗口，创建主窗口')
      createMainWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    logger.info('所有窗口已关闭，应用退出')
    app.quit()
  }
})

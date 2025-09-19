import { BrowserWindow, shell, ipcMain } from 'electron'
import { join } from 'path'
import { pathToFileURL } from 'url'
import { is } from '@electron-toolkit/utils'
import icon from '../../../resources/icon.png?asset'
import { IPC_CHANNELS } from '@shared/IpcChannel.js'
import createLogger from '@main/utils/logger.js'
const windowLogger = createLogger('窗口管理')

export function createWindowManager() {
  const registry = new Map()

  const actions = {
    minimize: (win) => win.minimize(),
    maximize: (win) => (win.isMaximized() ? win.unmaximize() : win.maximize()),
    close: (win) => win.close(),
    restore: (win) => win.restore(),
    hide: (win) => win.hide(),
    show: (win) => win.show(),
    toggleDevTools: (win) => {
      if (!win.isVisible()) win.show()
      if (win.isMinimized()) win.restore()
      if (win.webContents.isDevToolsOpened()) {
        win.webContents.closeDevTools()
      } else {
        win.webContents.openDevTools({ mode: 'detach' })
      }
    }
  }

  function create(key, options = {}) {
    windowLogger.debug('收到创建窗口请求', key, {
      single: options.single,
      route: options.route
    })

    if (options.single && registry.has(key)) {
      windowLogger.info('复用已有窗口实例', key)
      const existing = registry.get(key)
      if (existing.isMinimized()) existing.restore()
      existing.focus()
      return existing
    }

    const preloadPath = join(__dirname, '../preload/index.js')
    const win = new BrowserWindow({
      width: options.width ?? 800,
      height: options.height ?? 600,
      show: false,
      autoHideMenuBar: true,
      frame: options.frame ?? true,
      resizable: options.resizable ?? true,
      fullscreenable: options.fullscreenable ?? true,
      skipTaskbar: options.skipTaskbar ?? false,
      alwaysOnTop: options.alwaysOnTop ?? false,
      ...(process.platform === 'linux' ? { icon } : {}),
      webPreferences: {
        preload: preloadPath,
        sandbox: false,
        webSecurity: true,
        contextIsolation: true,
        nodeIntegration: false,
        enableRemoteModule: false
      }
    })
    if (is.dev) {
      win.webContents.openDevTools()
    }
    windowLogger.info('已创建窗口实例', key)
    win.setMaximizable(false)
    win.setResizable(false)
    win.on('ready-to-show', () => {
      windowLogger.debug('窗口已准备显示', key)
      if (!options.hideOnStart) win.show()
    })

    win.on('closed', () => {
      windowLogger.info('窗口已关闭', key)
      registry.delete(key)
    })

    win.webContents.setWindowOpenHandler(({ url }) => {
      windowLogger.warn('阻止新窗口打开，改为外部打开链接', { key, url })
      shell.openExternal(url)
      return { action: 'deny' }
    })

    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      const url = process.env['ELECTRON_RENDERER_URL'] + '/#' + (options.route || '')
      windowLogger.debug('加载开发环境地址', { key, url })
      win.loadURL(url)
    } else {
      const htmlPath = join(__dirname, '../renderer/index.html')
      const baseUrl = pathToFileURL(htmlPath).toString()
      const url = options.route ? `${baseUrl}#${options.route}` : baseUrl
      windowLogger.debug('加载生产环境地址', { key, url })
      win.loadURL(url)
    }

    registry.set(key, win)
    return win
  }

  function get(key) {
    return registry.get(key)
  }

  function performAction(key, action) {
    const win = get(key)
    const handler = actions[action]

    if (!handler) {
      windowLogger.warn('尝试执行未知的窗口操作', { key, action })
      return
    }

    if (!win) {
      windowLogger.warn('未找到对应窗口执行操作', { key, action })
      return
    }
    windowLogger.info('窗口执行操作', { key, action })
    handler(win)
  }

  function registerAction(name, handler) {
    actions[name] = handler
  }

  ipcMain.on(IPC_CHANNELS.WINDOW.CONTROL, (_event, action, key = 'main') => {
    performAction(key, action)
  })

  return { create, get, performAction, registerAction }
}

export const windowManager = createWindowManager()

import { app } from 'electron'
import log from 'electron-log'

const logPath = app.getPath('logs')

// 获取当前日期并格式化为 YYYY-MM-DD
const getCurrentDate = () => {
  const date = new Date()
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

// 设置日志文件路径，使用日期命名
log.transports.file.resolvePathFn = () => `${logPath}/app_${getCurrentDate()}.log`

// 配置输出格式和日志级别
log.transports.console.format = '[{h}:{i}:{s}] {level} {text}' // 控制台日志格式, 日志级别在前
log.transports.console.level = 'debug' // 设置为 'debug' 以显示所有日志级别
log.transports.file.level = 'info' // 文件日志级别

// Utility function to format objects for logging
const formatMessage = (message) => {
  return typeof message === 'object' ? JSON.stringify(message, null, 2) : message
}

const createLogger = (moduleName = '') => {
  const logger = {
    info: (...messages) =>
      log.info(`[INFO] [${moduleName}] ${messages.map(formatMessage).join(' ')}`),
    warn: (...messages) =>
      log.warn(`[WARN] [${moduleName}] ${messages.map(formatMessage).join(' ')}`),
    error: (...messages) =>
      log.error(`[ERROR] [${moduleName}] ${messages.map(formatMessage).join(' ')}`),
    debug: (...messages) =>
      log.debug(`[DEBUG] [${moduleName}] ${messages.map(formatMessage).join(' ')}`)
  }

  return logger
}

export default createLogger

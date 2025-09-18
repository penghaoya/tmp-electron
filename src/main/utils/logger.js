import { app } from 'electron'
import log from 'electron-log'

const logPath = app.getPath('logs')
// 获取当前日期并格式化为
const getCurrentDate = () => {
  const date = new Date()
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

// 设置日志文件路径，使用日期命名
log.transports.file.resolvePathFn = () => `${logPath}/app_${getCurrentDate()}.log`

// 配置输出格式和日志级别
log.transports.console.format = '[{h}:{i}:{s}] {level} {text}' // 控制台日志格式, 日志级别在前
log.transports.console.level = 'info' // 控制台日志级别
log.transports.file.level = 'debug' // 文件日志级别

const createLogger = (moduleName = '') => {
  const logger = {
    info: (...messages) => log.info(`[${moduleName}] ${messages.join(' ')}`),
    warn: (...messages) => log.warn(`[${moduleName}] ${messages.join(' ')}`),
    error: (...messages) => log.error(`[${moduleName}] ${messages.join(' ')}`),
    debug: (...messages) => log.debug(`[${moduleName}] ${messages.join(' ')}`)
  }

  return logger
}
export default createLogger

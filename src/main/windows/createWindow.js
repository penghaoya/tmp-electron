import { windowManager } from './windowManager.js'

export function createSettingWindow() {
  return windowManager.create('setting', {
    title: '设置',
    width: 800,
    height: 600,
    show: true,
    route: '/setting',
    single: true
  })
}

export function createMainWindow() {
  return windowManager.create('main', {
    width: 1100,
    height: 800,
    single: true
  })
}

export function createLoginWindow() {
  return windowManager.create('login', {
    width: 350,
    height: 500,
    frame: false,
    single: true,
    route: '/login'
  })
}

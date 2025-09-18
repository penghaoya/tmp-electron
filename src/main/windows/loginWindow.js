import { windowManager } from '@main/windows/windowManager.js'

export function createLoginWindow() {
  return windowManager.create('login', {
    width: 350,
    height: 500,
    frame: false,
    single: true,
    route: '/login'
  })
}

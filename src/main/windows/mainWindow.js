import { windowManager } from '@main/windows/windowManager.js'

export function createMainWindow() {
  return windowManager.create('main', {
    width: 1100,
    height: 800,
    single: true
  })
}

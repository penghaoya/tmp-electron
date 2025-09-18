import { windowManager } from './windowManager.js'

export function createSettingWindow() {
  return windowManager.create('setting', {
    title: '设置',
    width: 800,
    height: 600,
    show: true,
    route: '/setting',
    single: true // 单实例：避免重复创建，若已存在则聚焦
  })
}


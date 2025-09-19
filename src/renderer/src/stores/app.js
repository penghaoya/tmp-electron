/**
 * 应用状态 Store
 * 演示完整的 Pinia 持久化功能
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppStore = defineStore('app', () => {
  // 应用基础状态
  const appInfo = ref({
    name: 'Vue Electron App',
    version: '1.0.0',
    buildTime: new Date().toISOString(),
    environment: 'development'
  })
  
  // 窗口状态
  const windowState = ref({
    isMaximized: false,
    isMinimized: false,
    isFullscreen: false,
    bounds: {
      x: 100,
      y: 100,
      width: 1200,
      height: 800
    }
  })
  
  // 应用设置
  const settings = ref({
    autoStart: false,
    minimizeToTray: true,
    closeToTray: false,
    checkUpdates: true,
    enableDevTools: false,
    logLevel: 'info'
  })
  
  // 最近使用的文件/项目
  const recentItems = ref([])
  
  // 应用状态
  const appState = ref({
    isLoading: false,
    isOnline: navigator.onLine,
    lastActiveTime: Date.now(),
    startupTime: Date.now()
  })

  // 计算属性
  const uptime = computed(() => {
    return Date.now() - appState.value.startupTime
  })
  
  const isReady = computed(() => {
    return !appState.value.isLoading && appState.value.isOnline
  })
  
  const recentItemsCount = computed(() => {
    return recentItems.value.length
  })

  // 方法
  const updateWindowState = (newState) => {
    windowState.value = { ...windowState.value, ...newState }
    console.log('[AppStore] 窗口状态已更新')
  }
  
  const updateSettings = (newSettings) => {
    settings.value = { ...settings.value, ...newSettings }
    console.log('[AppStore] 应用设置已更新')
  }
  
  const addRecentItem = (item) => {
    const existingIndex = recentItems.value.findIndex(i => i.path === item.path)
    
    if (existingIndex > -1) {
      // 如果已存在，移到最前面
      recentItems.value.splice(existingIndex, 1)
    }
    
    recentItems.value.unshift({
      ...item,
      lastAccessed: Date.now()
    })
    
    // 限制最近项目数量
    if (recentItems.value.length > 10) {
      recentItems.value = recentItems.value.slice(0, 10)
    }
    
    console.log('[AppStore] 已添加最近项目:', item.name)
  }
  
  const removeRecentItem = (path) => {
    const index = recentItems.value.findIndex(item => item.path === path)
    if (index > -1) {
      recentItems.value.splice(index, 1)
      console.log('[AppStore] 已移除最近项目:', path)
    }
  }
  
  const clearRecentItems = () => {
    recentItems.value = []
    console.log('[AppStore] 已清空最近项目')
  }
  
  const setLoading = (loading) => {
    appState.value.isLoading = loading
  }
  
  const setOnlineStatus = (online) => {
    appState.value.isOnline = online
    console.log('[AppStore] 网络状态:', online ? '在线' : '离线')
  }
  
  const updateLastActiveTime = () => {
    appState.value.lastActiveTime = Date.now()
  }
  
  const resetApp = () => {
    // 重置非持久化状态
    appState.value = {
      isLoading: false,
      isOnline: navigator.onLine,
      lastActiveTime: Date.now(),
      startupTime: Date.now()
    }
    console.log('[AppStore] 应用状态已重置')
  }

  return {
    // 状态
    appInfo,
    windowState,
    settings,
    recentItems,
    appState,
    
    // 计算属性
    uptime,
    isReady,
    recentItemsCount,
    
    // 方法
    updateWindowState,
    updateSettings,
    addRecentItem,
    removeRecentItem,
    clearRecentItems,
    setLoading,
    setOnlineStatus,
    updateLastActiveTime,
    resetApp
  }
}, {
  // 持久化配置 - 持久化大部分状态，但排除运行时状态
  persist: {
    paths: ['windowState', 'settings', 'recentItems'], // 不持久化 appInfo 和 appState
    // 添加防抖配置，避免频繁保存
    beforeRestore: (context) => {
      console.log('[AppStore] 正在恢复持久化数据')
    },
    afterRestore: (context) => {
      console.log('[AppStore] 持久化数据恢复完成')
    }
  }
})
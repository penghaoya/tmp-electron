/**
 * 用户信息 Store
 * 演示 Pinia 持久化功能
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  // 状态
  const profile = ref({
    id: null,
    username: '',
    email: '',
    avatar: '',
    nickname: ''
  })
  
  const preferences = ref({
    theme: 'light',
    language: 'zh-CN',
    fontSize: 14,
    autoSave: true,
    notifications: {
      email: true,
      push: false,
      sound: true
    }
  })
  
  const loginInfo = ref({
    isLoggedIn: false,
    lastLoginTime: null,
    token: '',
    refreshToken: ''
  })

  // 计算属性
  const isAuthenticated = computed(() => {
    return loginInfo.value.isLoggedIn && loginInfo.value.token
  })
  
  const displayName = computed(() => {
    return profile.value.nickname || profile.value.username || '未知用户'
  })
  
  const isDarkMode = computed(() => {
    return preferences.value.theme === 'dark'
  })

  // 方法
  const login = (userInfo, token) => {
    profile.value = { ...profile.value, ...userInfo }
    loginInfo.value = {
      isLoggedIn: true,
      lastLoginTime: new Date().toISOString(),
      token,
      refreshToken: token + '_refresh'
    }
    console.log('[UserStore] 用户登录成功:', displayName.value)
  }
  
  const logout = () => {
    profile.value = {
      id: null,
      username: '',
      email: '',
      avatar: '',
      nickname: ''
    }
    loginInfo.value = {
      isLoggedIn: false,
      lastLoginTime: null,
      token: '',
      refreshToken: ''
    }
    console.log('[UserStore] 用户已退出登录')
  }
  
  const updateProfile = (updates) => {
    profile.value = { ...profile.value, ...updates }
    console.log('[UserStore] 用户信息已更新')
  }
  
  const updatePreferences = (updates) => {
    preferences.value = { ...preferences.value, ...updates }
    console.log('[UserStore] 用户偏好已更新')
  }
  
  const toggleTheme = () => {
    preferences.value.theme = preferences.value.theme === 'light' ? 'dark' : 'light'
    console.log('[UserStore] 主题已切换为:', preferences.value.theme)
  }
  
  const setLanguage = (lang) => {
    preferences.value.language = lang
    console.log('[UserStore] 语言已设置为:', lang)
  }

  return {
    // 状态
    profile,
    preferences,
    loginInfo,
    
    // 计算属性
    isAuthenticated,
    displayName,
    isDarkMode,
    
    // 方法
    login,
    logout,
    updateProfile,
    updatePreferences,
    toggleTheme,
    setLanguage
  }
}, {
  // 持久化配置 - 只持久化部分状态
  persist: {
    paths: ['profile', 'preferences'] // 不持久化敏感的登录信息
  }
})
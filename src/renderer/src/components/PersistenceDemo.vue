<template>
  <div class="persistence-demo">
    <div class="demo-header">
      <h2>Pinia 持久化存储演示</h2>
      <p class="demo-description">
        这个演示展示了如何使用 Pinia 结合 electron-store 实现状态持久化。
        修改下面的数据后，重启应用，数据将会被保留。
      </p>
    </div>

    <!-- 用户信息演示 -->
    <div class="demo-section">
      <h3>用户信息 (部分持久化)</h3>
      <div class="demo-card">
        <div class="form-group">
          <label>用户名:</label>
          <input 
            v-model="userStore.profile.username" 
            type="text" 
            placeholder="请输入用户名"
          />
        </div>
        
        <div class="form-group">
          <label>昵称:</label>
          <input 
            v-model="userStore.profile.nickname" 
            type="text" 
            placeholder="请输入昵称"
          />
        </div>
        
        <div class="form-group">
          <label>邮箱:</label>
          <input 
            v-model="userStore.profile.email" 
            type="email" 
            placeholder="请输入邮箱"
          />
        </div>
        
        <div class="form-group">
          <label>主题:</label>
          <select v-model="userStore.preferences.theme">
            <option value="light">浅色</option>
            <option value="dark">深色</option>
          </select>
        </div>
        
        <div class="form-group">
          <label>语言:</label>
          <select v-model="userStore.preferences.language">
            <option value="zh-CN">中文</option>
            <option value="en-US">English</option>
          </select>
        </div>
        
        <div class="demo-info">
          <p><strong>显示名称:</strong> {{ userStore.displayName }}</p>
          <p><strong>是否深色模式:</strong> {{ userStore.isDarkMode ? '是' : '否' }}</p>
          <p><strong>登录状态:</strong> {{ userStore.isAuthenticated ? '已登录' : '未登录' }}</p>
        </div>
        
        <div class="demo-actions">
          <button @click="simulateLogin" class="btn-primary">模拟登录</button>
          <button @click="userStore.logout" class="btn-secondary">退出登录</button>
          <button @click="userStore.toggleTheme" class="btn-secondary">切换主题</button>
        </div>
      </div>
    </div>

    <!-- 应用设置演示 -->
    <div class="demo-section">
      <h3>应用设置 (完整持久化)</h3>
      <div class="demo-card">
        <div class="form-group">
          <label>
            <input 
              v-model="appStore.settings.autoStart" 
              type="checkbox"
            />
            开机自启动
          </label>
        </div>
        
        <div class="form-group">
          <label>
            <input 
              v-model="appStore.settings.minimizeToTray" 
              type="checkbox"
            />
            最小化到托盘
          </label>
        </div>
        
        <div class="form-group">
          <label>
            <input 
              v-model="appStore.settings.closeToTray" 
              type="checkbox"
            />
            关闭到托盘
          </label>
        </div>
        
        <div class="form-group">
          <label>日志级别:</label>
          <select v-model="appStore.settings.logLevel">
            <option value="debug">Debug</option>
            <option value="info">Info</option>
            <option value="warn">Warning</option>
            <option value="error">Error</option>
          </select>
        </div>
        
        <div class="demo-info">
          <p><strong>窗口状态:</strong> {{ windowStateText }}</p>
          <p><strong>最近项目数量:</strong> {{ appStore.recentItemsCount }}</p>
          <p><strong>应用运行时间:</strong> {{ uptimeText }}</p>
          <p><strong>网络状态:</strong> {{ appStore.appState.isOnline ? '在线' : '离线' }}</p>
        </div>
        
        <div class="demo-actions">
          <button @click="addRecentItem" class="btn-primary">添加最近项目</button>
          <button @click="appStore.clearRecentItems" class="btn-secondary">清空最近项目</button>
          <button @click="toggleWindowState" class="btn-secondary">切换窗口状态</button>
        </div>
      </div>
    </div>

    <!-- 最近项目列表 -->
    <div class="demo-section" v-if="appStore.recentItems.length > 0">
      <h3>最近项目</h3>
      <div class="demo-card">
        <div class="recent-items">
          <div 
            v-for="item in appStore.recentItems" 
            :key="item.path"
            class="recent-item"
          >
            <div class="item-info">
              <strong>{{ item.name }}</strong>
              <span class="item-path">{{ item.path }}</span>
              <span class="item-time">{{ formatTime(item.lastAccessed) }}</span>
            </div>
            <button 
              @click="appStore.removeRecentItem(item.path)"
              class="btn-remove"
            >
              移除
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 持久化控制 -->
    <div class="demo-section">
      <h3>持久化控制</h3>
      <div class="demo-card">
        <div class="demo-actions">
          <button @click="manualSave" class="btn-primary">手动保存</button>
          <button @click="manualRestore" class="btn-secondary">手动恢复</button>
          <button @click="clearPersistence" class="btn-danger">清除持久化数据</button>
        </div>
        <div class="demo-info">
          <p class="tip">
            💡 提示：数据会自动保存，你也可以手动控制保存和恢复过程。
            清除持久化数据后，重启应用将恢复默认状态。
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useUserStore, useAppStore } from '../stores'

const userStore = useUserStore()
const appStore = useAppStore()

// 计算属性
const windowStateText = computed(() => {
  const state = appStore.windowState
  const states = []
  if (state.isMaximized) states.push('最大化')
  if (state.isMinimized) states.push('最小化')
  if (state.isFullscreen) states.push('全屏')
  return states.length > 0 ? states.join(', ') : '正常'
})

const uptimeText = computed(() => {
  const uptime = appStore.uptime
  const seconds = Math.floor(uptime / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  
  if (hours > 0) {
    return `${hours}小时${minutes % 60}分钟`
  } else if (minutes > 0) {
    return `${minutes}分钟${seconds % 60}秒`
  } else {
    return `${seconds}秒`
  }
})

// 方法
const simulateLogin = () => {
  const userInfo = {
    id: Date.now(),
    username: userStore.profile.username || 'demo_user',
    email: userStore.profile.email || 'demo@example.com',
    nickname: userStore.profile.nickname || '演示用户'
  }
  
  const token = 'demo_token_' + Date.now()
  userStore.login(userInfo, token)
}

const addRecentItem = () => {
  const item = {
    name: `项目 ${Date.now()}`,
    path: `/path/to/project_${Date.now()}`,
    type: 'project'
  }
  appStore.addRecentItem(item)
}

const toggleWindowState = () => {
  appStore.updateWindowState({
    isMaximized: !appStore.windowState.isMaximized
  })
}

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleString()
}

const manualSave = async () => {
  try {
    if (userStore.$persist) {
      await userStore.$persist.save()
    }
    if (appStore.$persist) {
      await appStore.$persist.save()
    }
    alert('手动保存成功！')
  } catch (error) {
    console.error('手动保存失败:', error)
    alert('手动保存失败，请查看控制台')
  }
}

const manualRestore = async () => {
  try {
    if (userStore.$persist) {
      await userStore.$persist.restore()
    }
    if (appStore.$persist) {
      await appStore.$persist.restore()
    }
    alert('手动恢复成功！')
  } catch (error) {
    console.error('手动恢复失败:', error)
    alert('手动恢复失败，请查看控制台')
  }
}

const clearPersistence = async () => {
  if (confirm('确定要清除所有持久化数据吗？这将在下次启动时恢复默认状态。')) {
    try {
      if (userStore.$persist) {
        await userStore.$persist.clear()
      }
      if (appStore.$persist) {
        await appStore.$persist.clear()
      }
      alert('持久化数据已清除！重启应用后将恢复默认状态。')
    } catch (error) {
      console.error('清除持久化数据失败:', error)
      alert('清除失败，请查看控制台')
    }
  }
}

// 定时更新运行时间 - 降低频率避免频繁保存
let uptimeTimer = null

onMounted(() => {
  // 改为每30秒更新一次，减少频繁保存
  uptimeTimer = setInterval(() => {
    appStore.updateLastActiveTime()
  }, 30000) // 30秒
})

onUnmounted(() => {
  if (uptimeTimer) {
    clearInterval(uptimeTimer)
  }
})
</script>

<style scoped>
.persistence-demo {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.demo-header {
  text-align: center;
  margin-bottom: 30px;
}

.demo-header h2 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.demo-description {
  color: #7f8c8d;
  line-height: 1.6;
}

.demo-section {
  margin-bottom: 30px;
}

.demo-section h3 {
  color: #34495e;
  margin-bottom: 15px;
  border-bottom: 2px solid #3498db;
  padding-bottom: 5px;
}

.demo-card {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #495057;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 14px;
}

.form-group input[type="checkbox"] {
  width: auto;
  margin-right: 8px;
}

.demo-info {
  background: #e3f2fd;
  border: 1px solid #bbdefb;
  border-radius: 4px;
  padding: 15px;
  margin: 15px 0;
}

.demo-info p {
  margin: 5px 0;
  color: #1565c0;
}

.demo-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 15px;
}

.btn-primary,
.btn-secondary,
.btn-danger,
.btn-remove {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover {
  background: #0056b3;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #545b62;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-danger:hover {
  background: #c82333;
}

.btn-remove {
  background: #ffc107;
  color: #212529;
  padding: 4px 8px;
  font-size: 12px;
}

.btn-remove:hover {
  background: #e0a800;
}

.recent-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.recent-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 4px;
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.item-path {
  font-size: 12px;
  color: #6c757d;
}

.item-time {
  font-size: 11px;
  color: #adb5bd;
}

.tip {
  font-style: italic;
  color: #0d47a1 !important;
}
</style>
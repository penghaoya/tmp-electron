<template>
  <div class="home-page">
    <div class="header">
      <h1>Vue Electron 应用</h1>
      <div class="actions">
        <NButton @click="handleClick" type="primary">开发者工具</NButton>
      </div>
    </div>
    
    <!-- Pinia 持久化存储演示 -->
    <PersistenceDemo />
  </div>
</template>

<script setup>
import { NButton } from 'naive-ui'
import PersistenceDemo from '@renderer/components/PersistenceDemo.vue'

const handleClick = () => {
  console.log('Button clicked')
  window.api.window.toggleDevTools()
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: #f5f7fa;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: white;
  border-bottom: 1px solid #e5e5e5;
  margin-bottom: 20px;
}

.header h1 {
  margin: 0;
  color: #2c3e50;
  font-size: 24px;
  font-weight: 600;
}

.actions {
  display: flex;
  gap: 10px;
}
</style>

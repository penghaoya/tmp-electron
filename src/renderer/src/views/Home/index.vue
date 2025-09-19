<template>
  <NButton @click="handleClick">Naive Button</NButton>
  <div>Home Page</div>
</template>

<script setup>
import { NButton } from 'naive-ui'
const handleClick = () => {
  console.log('Button clicked')
  window.api.window.toggleDevTools()
}
</script>

<style scoped></style>

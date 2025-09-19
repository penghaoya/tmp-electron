<template>
  <NButton @click="handleClick">Naive Button</NButton>
  <div>Home Page</div>
</template>

<script setup>
import { NButton } from 'naive-ui'

import { onMounted } from 'vue'
const handleClick = async () => {
  console.log('Button clicked')
  window.api.store.set('test', 'tes1111t')

  console.log('store path', await window.api.store.get('them'))
}

onMounted(async () => {
  console.log('store path', await window.api.store.get('app.theme'))
})
</script>

<style scoped></style>

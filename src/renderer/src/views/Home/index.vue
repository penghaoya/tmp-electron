<template>
  <NButton @click="handleClick">Naive Button</NButton>
  <div>{{ data }}</div>
</template>

<script setup>
import { NButton } from 'naive-ui'

import { onMounted, ref } from 'vue'

const data = ref('')
const handleClick = async () => {
  console.log('Button clicked')
  window.api.store.set('test.a', [1, 2, 3])
  window.api.store.set('test.b.c', 'tes1111t')
  window.api.store.set({
    app: {
      theme: 'dark'
    }
  })

  console.log('store path', await window.api.store.get())
  // window.api.store.clear()
}

onMounted(async () => {
  data.value = await window.api.store.get('app.theme')
  // console.log('store path', await window.api.store.get('app.theme'))
})
</script>

<style scoped></style>

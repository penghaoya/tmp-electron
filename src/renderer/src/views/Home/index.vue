<template>
  <NButton @click="handleClick">Naive Button</NButton>
  <div>Home Page</div>
</template>

<script setup>
import { NButton } from 'naive-ui'
const handleClick = () => {
  console.log(window.api)
}
</script>

<style scoped></style>

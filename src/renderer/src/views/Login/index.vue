<template>
  <div class="min-h-screen relative overflow-hidden flex flex-col">
    <!-- 顶部可拖拽栏 -->
    <div class="h-8 w-full app-drag relative">
      <button
        class="app-no-drag absolute top-0 right-0 w-8 h-8 flex items-center justify-center text-gray-600 hover:text-white hover:bg-red-600 transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-red-400 rounded-none"
        @click="handleClose"
      >
        <Icon icon="meteor-icons:xmark" width="18" height="18" />
      </button>
    </div>

    <!-- 居中容器 -->
    <div class="flex-1 flex items-center justify-center px-4">
      <!-- 登录卡片 -->
      <div class="w-[320px] sm:w-[360px] backdrop-blur-xl p-6 sm:p-8 space-y-5">
        <!-- 头像 -->
        <div class="flex justify-center">
          <div class="relative">
            <div class="relative p-[3px] bg-white">
              <NAvatar
                :size="64"
                src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
              />
            </div>
          </div>
        </div>

        <!-- 表单 -->
        <form class="space-y-4" @submit.prevent="onSubmit">
          <NInput
            v-model:value="form.username"
            placeholder="请输入用户名"
            size="large"
            :maxlength="20"
            @keyup.enter="onSubmit"
          >
            <template #prefix>
              <Icon icon="material-symbols:person-outline" />
            </template>
          </NInput>

          <NInput
            v-model:value="form.password"
            type="password"
            placeholder="请输入密码"
            size="large"
            :maxlength="20"
            show-password-on="click"
            @keyup.enter="onSubmit"
          >
            <template #prefix>
              <Icon icon="material-symbols:lock-outline" />
            </template>
          </NInput>

          <!-- 协议勾选 + 链接 -->
          <div class="flex items-center justify-between text-xs text-gray-600 select-none">
            <label class="inline-flex items-center gap-2">
              <input type="checkbox" v-model="form.agree" class="size-4 rounded border-gray-300" />
              <span
                >已阅读并同意
                <a
                  href="https://example.com/terms"
                  target="_blank"
                  class="text-sky-600 hover:underline app-no-drag"
                >
                  服务协议
                </a>
              </span>
            </label>
          </div>
          <NButton type="primary" block size="large" :disabled="!isValid" attr-type="submit">
            登录
          </NButton>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { NButton, NInput, NAvatar, useMessage } from 'naive-ui'

const msg = useMessage()
const form = ref({
  username: '',
  password: '',
  agree: false
})
const error = ref('')

const isValid = computed(() => {
  return form.value.username.trim() !== '' && form.value.password.trim() !== '' && form.value.agree
})

function onSubmit() {
  error.value = ''
  if (!isValid.value) {
    msg.error('请填写完整并勾选服务协议')
    return
  }
  // TODO: 在此发起登录
  // 示例：window.api.auth.login(form.value)
  console.log('login submit', form.value)
  window.api?.window.close('login')
  window.api.win.openMain()
}

function onForgot() {
  // TODO: 打开找回密码窗口/链接
  console.log('forgot password')
}

// 关闭窗口（与主进程配合）
function handleClose() {
  window.api?.window.close('login')
}
</script>

<style scoped>
.app-drag {
  -webkit-app-region: drag;
}
.app-no-drag {
  -webkit-app-region: no-drag;
}

/* 让按钮与输入在玻璃背景上更清晰 */
:deep(.n-input) {
  --n-color: rgba(255, 255, 255, 0.7);
  --n-color-focus: rgba(255, 255, 255, 0.85);
  --n-border: 1px solid rgba(255, 255, 255, 0.5);
  --n-border-hover: 1px solid rgba(255, 255, 255, 0.8);
  --n-border-focus: 1px solid rgba(153, 204, 255, 0.9);
  backdrop-filter: blur(6px);
}
:deep(.n-button) {
  box-shadow: 0 6px 20px rgba(56, 149, 255, 0.3);
}
</style>

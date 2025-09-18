<template>
  <NConfigProvider :theme-overrides="themeOverrides" :locale="zhCN" :date-locale="dateZhCN">
    <NMessageProvider>
      <RouterView />
    </NMessageProvider>
  </NConfigProvider>
</template>

<script setup>
import { NConfigProvider, NMessageProvider } from 'naive-ui'
import { dateZhCN, zhCN } from 'naive-ui'
import { RouterView } from 'vue-router'

/**
 * @type {import('naive-ui').GlobalThemeOverrides}
 */
const themeOverrides = {
  common: {
    // 主色调 - 使用现代化的蓝色
    primaryColor: '#2F80ED',
    primaryColorHover: '#5096F1',
    primaryColorPressed: '#1A6ED8',
    primaryColorSuppl: '#5096F1',
    // 信息色
    infoColor: '#2F80ED',
    infoColorHover: '#5096F1',
    infoColorPressed: '#1A6ED8',
    infoColorSuppl: '#5096F1',
    // 成功色 - 清新绿色
    successColor: '#34C759',
    successColorHover: '#45D66B',
    successColorPressed: '#27AE60',
    successColorSuppl: '#45D66B',
    // 警告色 - 温和橙色
    warningColor: '#FF9500',
    warningColorHover: '#FFAA33',
    warningColorPressed: '#E67E00',
    warningColorSuppl: '#FFAA33',
    // 错误色 - 柔和红色
    errorColor: '#FF3B30',
    errorColorHover: '#FF6058',
    errorColorPressed: '#E0321B',
    errorColorSuppl: '#FF6058',

    // 中性色调
    textColorBase: '#333333',
    textColor1: '#333333',
    textColor2: '#666666',
    textColor3: '#999999',

    // 边框和分割线
    borderColor: '#E5E5E5',
    dividerColor: '#E5E5E5',

    // 背景色
    bodyColor: '#F5F7FA',

    // 全局圆角设置
    borderRadius: '4px',
    borderRadiusSmall: '2px',
    borderRadiusMedium: '6px',
    borderRadiusLarge: '8px'
  },
  Button: {
    textColor: '#333333',
    borderRadiusSmall: '3px',
    borderRadiusMedium: '4px',
    borderRadiusLarge: '6px',
    fontSizeMedium: '14px',
    heightMedium: '32px'
  },
  Input: {
    borderRadius: '4px',
    boxShadowFocus: '0 0 0 2px rgba(47, 128, 237, 0.2)'
  },
  Card: {
    borderRadius: '8px',
    boxShadow: '0 2px 12px 0 rgba(0, 0, 0, 0.05)'
  },
  Menu: {
    borderRadius: '4px'
  },
  Dropdown: {
    borderRadius: '6px',
    optionTextColor: '#333333',
    optionTextColorHover: '#2F80ED',
    dividerColor: '#E5E5E5'
  },
  Tabs: {
    tabBorderRadius: '4px',
    barColor: '#2F80ED'
  },
  Tooltip: {
    borderRadius: '4px',
    boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.12)'
  },
  Dialog: {
    borderRadius: '8px',
    titleFontSize: '16px',
    titleTextColor: '#333333',
    boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.08)'
  },
  Drawer: {
    borderRadius: '8px 0 0 8px'
  },
  Popover: {
    borderRadius: '6px',
    boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.12)'
  },
  Tag: {
    borderRadius: '4px'
  },
  Avatar: {
    borderRadius: '50%'
  },
  Badge: {
    borderRadius: '10px'
  },
  Switch: {
    buttonBorderRadius: '50%',
    railBorderRadius: '10px'
  },
  Checkbox: {
    borderRadius: '2px'
  },
  Radio: {
    buttonBorderRadius: '12px'
  },
  Select: {
    menuBorderRadius: '6px'
  }
}
</script>

<style scoped></style>

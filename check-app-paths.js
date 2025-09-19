import { app } from 'electron';
import path from 'path';
import os from 'os';

// 模拟 Electron 应用环境
if (!app.isReady()) {
  console.log('=== Electron App Paths 信息 ===');
  
  // 显示各种路径
  const paths = [
    'home',
    'appData', 
    'userData',
    'cache',
    'temp',
    'exe',
    'module',
    'desktop',
    'documents',
    'downloads',
    'music',
    'pictures',
    'videos',
    'recent',
    'logs',
    'crashDumps'
  ];
  
  console.log('可用的 app.getPath() 选项:');
  paths.forEach(pathName => {
    try {
      const pathValue = app.getPath(pathName);
      console.log(`  ${pathName}: ${pathValue}`);
    } catch (error) {
      console.log(`  ${pathName}: [不可用] ${error.message}`);
    }
  });
  
  // 检查是否有 'store' 选项
  try {
    const storePath = app.getPath('store');
    console.log(`\n特殊路径:`);
    console.log(`  store: ${storePath}`);
  } catch (error) {
    console.log(`\n注意: app.getPath('store') 不可用: ${error.message}`);
    console.log(`建议使用 app.getPath('userData') 作为存储目录`);
  }
  
} else {
  console.log('应用已准备就绪，无法在此环境下运行路径检查');
}
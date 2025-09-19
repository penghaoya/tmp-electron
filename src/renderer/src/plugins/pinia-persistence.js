/**
 * Pinia 持久化插件
 * 集成 electron-store 实现状态持久化
 */

/**
 * 创建持久化插件
 * @param {Object} options - 插件配置选项
 * @param {string} options.key - 存储键前缀，默认为 'pinia'
 * @param {Array} options.paths - 需要持久化的状态路径，默认持久化所有状态
 * @param {Function} options.serializer - 序列化函数
 * @param {Function} options.deserializer - 反序列化函数
 * @returns {Function} Pinia 插件函数
 */
export function createPersistedState(options = {}) {
  const {
    key = 'pinia',
    paths = null,
    serializer = JSON.stringify,
    deserializer = JSON.parse,
    debounceTime = 300 // 添加防抖时间，默认300ms
  } = options

  return ({ store }) => {
    const storeKey = `${key}.${store.$id}`
    let saveTimer = null // 防抖定时器
    
    // 从存储中恢复状态
    const restoreState = async () => {
      try {
        if (!window.api?.store) {
          console.warn('[Pinia持久化] window.api.store 不可用')
          return
        }

        const savedState = await window.api.store.get(storeKey)
        if (savedState) {
          const parsedState = typeof savedState === 'string' 
            ? deserializer(savedState) 
            : savedState

          // 如果指定了路径，只恢复指定的状态
          if (paths && Array.isArray(paths)) {
            paths.forEach(path => {
              if (parsedState.hasOwnProperty(path)) {
                store.$state[path] = parsedState[path]
              }
            })
          } else {
            // 恢复所有状态
            store.$patch(parsedState)
          }
          
          console.log(`[Pinia持久化] 已恢复 store "${store.$id}" 的状态`)
        }
      } catch (error) {
        console.error(`[Pinia持久化] 恢复 store "${store.$id}" 状态失败:`, error)
      }
    }

    // 保存状态到存储（带防抖）
    const saveState = async (state) => {
      try {
        if (!window.api?.store) {
          console.warn('[Pinia持久化] window.api.store 不可用')
          return
        }

        let stateToSave = state
        
        // 如果指定了路径，只保存指定的状态
        if (paths && Array.isArray(paths)) {
          stateToSave = {}
          paths.forEach(path => {
            if (state.hasOwnProperty(path)) {
              stateToSave[path] = state[path]
            }
          })
        }

        const serializedState = typeof stateToSave === 'object' 
          ? serializer(stateToSave) 
          : stateToSave

        await window.api.store.set(storeKey, serializedState)
        console.log(`[Pinia持久化] 已保存 store "${store.$id}" 的状态`)
      } catch (error) {
        console.error(`[Pinia持久化] 保存 store "${store.$id}" 状态失败:`, error)
      }
    }

    // 防抖保存函数
    const debouncedSave = (state) => {
      if (saveTimer) {
        clearTimeout(saveTimer)
      }
      saveTimer = setTimeout(() => {
        saveState(state)
      }, debounceTime)
    }

    // 初始化时恢复状态
    restoreState()

    // 监听状态变化并保存（使用防抖）
    store.$subscribe((mutation, state) => {
      debouncedSave(state)
    }, { 
      detached: true // 确保在组件卸载后仍然监听
    })

    // 提供手动保存和恢复的方法
    store.$persist = {
      save: () => saveState(store.$state),
      restore: restoreState,
      clear: async () => {
        try {
          if (window.api?.store) {
            await window.api.store.remove(storeKey)
            console.log(`[Pinia持久化] 已清除 store "${store.$id}" 的持久化数据`)
          }
        } catch (error) {
          console.error(`[Pinia持久化] 清除 store "${store.$id}" 持久化数据失败:`, error)
        }
      }
    }
  }
}

/**
 * 默认持久化插件实例
 */
export const piniaPersistedState = createPersistedState()

/**
 * 创建带有特定配置的持久化插件
 * @param {string} storeId - store ID
 * @param {Array} persistedPaths - 需要持久化的状态路径
 * @returns {Function} 配置好的持久化插件
 */
export function createStorePersistedState(storeId, persistedPaths = null) {
  return createPersistedState({
    key: `pinia.${storeId}`,
    paths: persistedPaths
  })
}
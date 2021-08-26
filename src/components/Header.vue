<template>
  <div class="head">
    <n-grid>
      <!-- 菜单 -->
      <n-gi :span="8">
        <div class="head-item">
          <n-menu v-model:value="activeKey"
                  mode="horizontal"
                  :options="menuOptions" 
                  @update:value="handleUpdateValue"/>
        </div>
      </n-gi>
      <!-- 搜索 -->
      <n-gi :span="4">
        <div class="head-item">
          <n-input type="input"
                   placeholder="搜索" />
        </div>
      </n-gi>
      <!-- 深色模式 -->
      <n-gi :span="4" :offset="6">
        <div class="head-item">
          <n-button @click="onTheme">换个主题</n-button>
        </div>
      </n-gi>
    </n-grid>
  </div>

</template>

<script lang="ts">
import { defineComponent, reactive, ref, watchEffect  } from "vue";
import { useRoute, useRouter } from "vue-router";
import { darkTheme } from 'naive-ui'
export default defineComponent({
  setup(props,{emit}) {
    const router = useRouter()
    const route = useRoute()
    const menuOptions = reactive([
      {
        label: "落地页",
        key: "landing",
        // disabled: true,
        children: [
          {
            label: "IRY落地页",
            key: "iry",
          },
        ],
      },
      {
        label: "文档",
        key: "dosc",
        // disabled: true,
      },
      {
        label: "工具",
        key: "tool",
        // disabled: true,
      },
    ]);
    const activeKey = ref(route.name);
    // 确定有没有这个key

    // 菜单点击事件
    function handleUpdateValue(key:string) {
      router.push({
        path:'/'+key
      })
    }
    watchEffect(()=>{
      if(!route.name) return
      activeKey.value = route.name
    })
    // 主题切换
    function onTheme() {
      emit('onTheme')
    }
    return {
      activeKey,
      menuOptions,
      handleUpdateValue,
      onTheme
    };
  },
});
</script>

<style lang="less">
.head {
  border-bottom: solid 1px var(--border-color);
  .head-item {
    height: 68px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: color 0.5s;
  }
  .head-item:hover {
    color: rgba(0, 128, 0, 0.6);
  }
  .active {
    color: rgb(0, 128, 0);
  }
}
</style>
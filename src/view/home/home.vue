<template>
  <n-config-provider :theme="theme">
  <n-layout has-sider style="height:100%">
      <!-- <n-layout-sider content-style="padding: 24px;">侧边栏</n-layout-sider> -->
      <n-layout>
        <n-layout-header>
          <Header @onTheme="onTheme"/>
        </n-layout-header>
        <n-layout-content content-style="padding: 24px">
          <n-message-provider>
          <router-view></router-view>
        </n-message-provider>
        </n-layout-content>
        <!-- <n-layout-footer>尾部</n-layout-footer> -->
      </n-layout>
    </n-layout>
  </n-config-provider>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import Header from "../../components/Header.vue";
import { darkTheme } from 'naive-ui'
import { BuiltInGlobalTheme } from "naive-ui/lib/themes/interface";
export default defineComponent({
  setup() {
    const theme = ref<BuiltInGlobalTheme | null>(null)
    function onTheme() {
      if(theme.value === null) {
        theme.value = darkTheme
        return
      }
      theme.value = null
      
    }

    return {
      onTheme,
      darkTheme,
      theme
    }
  },
  components: {
    Header
  }
});
</script>

<style>
  .n-config-provider {
    height: 100%;
  }
</style>
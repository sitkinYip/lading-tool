<template>
  <div class="home">
      <router-view v-slot="{Component}">
        <transition name="fade">
          <component :is="Component"></component>
        </transition>
      </router-view>
  </div>

</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "App",
  components: {},
});
</script>

<style>
  html,body {
    width: 100%;
    height: 100%;
  }
  #app {
    width: 100%;
    height: 100%;
  }
  .home {
    width: 100%;
    height: 100%;
  }
</style>

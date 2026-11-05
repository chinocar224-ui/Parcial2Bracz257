<script setup lang="ts">
import MainHeader from './components/MainHeader.vue'
</script>

<template>
  <MainHeader />
  <main class="container py-4">
    <RouterView />
  </main>
</template>

<style scoped></style>

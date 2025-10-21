<!-- App.vue -->
<!-- このアプリの Top View -->
<!-- NavHeader component を表示したのち、 -->
<!-- router-view で routing された page を表示する -->
<!-- config.json ファイルに記述された version と release date をブラウザーのコンソールに出力する -->

<script setup>
import NavHeader from './components/NavHeader.vue'
import { config } from './config'
console.log('ECHONET Lite WebAPI Tool')
console.log('Version:', config.version)
console.log('Release date:', config.releaseDate)
console.log('App.vue: init')
</script>

<template>
  <div class="container">
    <header>
      <NavHeader />
    </header>
    <main role="main" class="container px-0">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.card {
  margin-bottom: 0.5rem;
}
.card-header {
  padding: 0.25rem 1rem;
}
</style>

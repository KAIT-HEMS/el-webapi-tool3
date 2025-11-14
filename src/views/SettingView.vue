<!-- views/SettingView.vue -->
<!-- Setting page を作成する -->
<!-- SettingServerAndDevice component を利用する -->

<template>
  <div class="setting">
    <div>
      <SettingServerAndDevice />
    </div>
  </div>
</template>

<script setup>
import SettingServerAndDevice from '../components/SettingServerAndDevice.vue'
console.log('SettingView.vue init')
</script>

<style scoped>
.input-group {
  margin-top: 0.25rem;
  margin-bottom: 0.25rem;
  margin-left: 0.25rem;
  margin-right: 0.25rem;
}
.form-check {
  padding-top: 0.5rem;
  padding-left: 2rem;
}
</style>

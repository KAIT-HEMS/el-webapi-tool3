<!-- components/NavHeader.vue -->
<!-- 全てのページに共通な page navigation を作成する -->
<!-- Home, Setting, About page へのナビゲーションを記述している -->
<!-- Page を追加する場合は、このファイルを修正する -->

<script setup></script>

<template>
  <nav class="navbar navbar-expand-lg navbar-secondary bg-secondary">
    <div class="container-fluid">
      <div>
        <a class="navbar-brand" href="#" style="color: #ffffff">ECHONET Lite WebAPI Tool</a>
      </div>
      <div class="d-flex">
        <!-- ホームボタン -->
        <router-link to="/">
          <a class="btn" title="Home">
            <i class="bi bi-house" style="color: #ffffff"></i>
          </a>
        </router-link>

        <!-- 設定ボタン -->
        <router-link to="/setting">
          <a class="btn" title="Setting">
            <i class="bi bi-gear" style="color: #ffffff"></i>
          </a>
        </router-link>

        <!-- About ボタン -->
        <router-link to="/about">
          <a class="btn" title="About">
            <i class="bi bi-info-circle" style="color: #ffffff"></i>
          </a>
        </router-link>
      </div>
    </div>
  </nav>
</template>

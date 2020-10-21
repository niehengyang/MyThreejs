<template>
  <div id="app">
    <router-view class="app-router-view" />
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {
  }
}
</script>
<style src="../src/assets/css/app.css"></style>
<style>
#app .app-router-view{
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  overflow: hidden;
  backface-visibility: hidden;
  transform: translate3d(0, 0, 0);
  transform-style: preserve-3d;
  visibility: visible;
}
</style>

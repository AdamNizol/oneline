<template>
  <div id="app">
    <OneLine />
  </div>
</template>

<script>
import OneLine from './components/OneLine.vue'

export default {
  name: 'App',
  components: {
    OneLine
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  min-height: 100vh;
}
body, html {
  padding: 0;
  margin: 0;
}
</style>

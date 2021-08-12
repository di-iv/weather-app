<template>
  <div id="app">
    <Weather/>
  </div>
</template>

<script>
import Weather from './components/Weather.vue'

export default {
  name: 'App',
  components: {
    Weather
  },

}
</script>

<style>
#app {
  font-family: 'Open Sans';
  text-align: center;
  color: #fff;
  box-sizing: border-box;
}
body{
  padding: 0;
  margin: 0;
}
</style>

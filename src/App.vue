<template>
  <div id="app">
    <Map />
  </div>
</template>

<script>
import Map from './components/map';
export default {
  name: 'App',
  components : {
    Map
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  list-style: none;
}
html , body {
  width: 100%;
  height: 100%;
}
#app {
  width: 100%;
  height: 100%;
}
</style>

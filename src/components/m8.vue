<template>
  <div class="box">
    <div class="btn-box">

    </div>
    <div id="map"></div>
  </div>
</template>
<script>
import M8 from '@/M8';
export default {
  mounted () {
    this.map = new M8({
      container : 'map',
      center: [116.390619, 39.924317],
    });
  }
}
</script>
<style scoped>
.box {
  width: 100%;
  height: 100%;
}
#map {
  width: 100%;
  height: 100%;
}
.btn-box {
  position: fixed;
  top: 20px;
  left: 100px;
  z-index: 10;
}
</style>
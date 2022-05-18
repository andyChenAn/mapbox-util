<template>
  <div class="box">
    <div class="btn-box">
      <button @click="addPointLayer">圈图层</button>
    </div>
    <div id="map"></div>
  </div>
</template>
<script>
import M8 from "@/M8";
import PointLayer from "@/M8/layers/point";
export default {
  mounted() {
    this.map = new M8({
      container: "map",
      center: [116.390619, 39.924317],
    });
  },
  methods: {
    addPointLayer() {
      fetch(
        "https://gw.alipayobjects.com/os/basement_prod/893d1d5f-11d9-45f3-8322-ee9140d288ae.json"
      ).then(res => res.json()).then(data => {
        const layer = new PointLayer({
          name : 'andy'
        });
        layer.source(data)
        layer.shape('circle');
        this.map.addLayer(layer);
      })
    },
  },
};
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
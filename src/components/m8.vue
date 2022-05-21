<template>
  <div class="box">
    <div class="btn-box">
      <button @click="addPointLayer">圈图层</button>
      <button @click="removeLayer">删除图层</button>
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
      center: [140.067171, 36.26186],
      zoom: 5.32,
    });
  },
  methods: {
    addPointLayer() {
      fetch(
        "https://gw.alipayobjects.com/os/basement_prod/d3564b06-670f-46ea-8edb-842f7010a7c6.json"
      ).then((res) => res.json())
      .then(data => {
        const res = {
          type : 'FeatureCollection',
          features : data.features
        };
        const layer = new PointLayer({
          name : 'andy'
        });
        layer.source(res).shape('circle').size('mag' , [1 , 100]).color('mag' , mag => {
          return mag > 4.5 ? '#5B8FF9' : '#5CCEA1'
        }).style({
          opacity: 0.3,
          'stroke-width': 1
        })
        this.map.addLayer(layer);
        console.log(layer)
        layer.on('click' , evt => {
          console.log(evt)
        });
      })
      // fetch(
      //   "https://gw.alipayobjects.com/os/basement_prod/893d1d5f-11d9-45f3-8322-ee9140d288ae.json"
      // ).then(res => res.json()).then(data => {
      //   const layer = new PointLayer({
      //     name : 'andy'
      //   });
      //   layer.source(data)
      //   layer.color('#f00').size(10).shape('circle').style({
      //     opacity : 0.8,
      //     'stroke-width' : 2,
      //     'stroke-color' : '#000',
      //     'stroke-opacity' : 0.6
      //   })
      //   this.map.addLayer(layer);
      //   const layer1 = new PointLayer({
      //     name : 'jack'
      //   });
      //   layer1.source(data);
      //   layer1.color('#000').shape('name' , 'text').size(12).style({
      //     offset : [0 , 10]
      //   });
      //  this.map.addLayer(layer1);
      // })
    },
    removeLayer() {
      this.map.removeAllLayer();
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
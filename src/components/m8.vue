<template>
  <div class="box">
    <div class="btn-box">
      <button @click="addPointLayer">圈图层</button>
      <button @click="add">气泡图</button>
      <button @click="add2">气泡图动画</button>
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
      center: [96.99215001469588, 29.281597225674773],
      zoom: 2.194613775109773,
      maxZoom: 10
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
        layer.source(res).shape('circle').style({
          opacity: 0.3,
          'stroke-width': 1
        }).size('mag' , [1 , 20]).color('mag' , mag => {
          return mag > 4.5 ? '#5B8FF9' : '#5CCEA1'
        }).hover({
          color : '#000',
          opacity : 0.6
        })
        this.map.addLayer(layer);
      })
    },
    add () {
      fetch('https://gw.alipayobjects.com/os/basement_prod/337ddbb7-aa3f-4679-ab60-d64359241955.json').then(res => res.json()).then(data => {
        data.features = data.features.filter(item => {
          return item.properties.capacity > 800;
        });
        const layer = new PointLayer({
          name : 'jack'
        });
        layer.source(data).color('#34B6B7').shape('circle').size('capacity' , [1 , 16]).style({
          opacity : 0.5,
          'stroke-width' : 0
        }).hover({
          color : '#007aff',
          opacity : 1
        })
        this.map.addLayer(layer)
      })
    },
    add2 () {
      fetch(
        "https://gw.alipayobjects.com/os/basement_prod/d3564b06-670f-46ea-8edb-842f7010a7c6.json"
      ).then((res) => res.json())
      .then(data => {
        const res = {
          type : 'FeatureCollection',
          features : data.features
        };
        const layer = new PointLayer({
          name : 'peter'
        });
        layer.source(res).shape('waterWave').color('#007aff').size(30).style({
          opacity : 1
        })
        this.map.addLayer(layer)
      })
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
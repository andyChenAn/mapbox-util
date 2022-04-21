<template>
  <div class="box">
    <div class="btn-box">
      <button @click="addPoint">addIcon</button>
    </div>
    <div id="map"></div>
  </div>
</template>
<script>
import Map from "@/utils/map";
import Layer from "@/utils/map/layer";
import { point , rhumbDistance } from '@turf/turf';
export default {
  mounted() {
    const myMap = new Map({
      container: "map",
      center: [116.390619, 39.924317],
    });
    this.myMap = myMap;
    myMap.on("load", async () => {
      const urls = [
        {
          name: "a",
          url: require("@/assets/car1.png"),
        },
        {
          name: "b",
          url: require("@/assets/car2.png"),
        },
        {
          name: "c",
          url: require("@/assets/car3.png"),
        },
      ];
      const images = await myMap.loadImage(urls);
      images.map((image) => {
        myMap.addImage(image.name, image.imageData);
      });
      const layer = new Layer(myMap.mapbox);
      this.layer = layer;
    });
  },
  methods : {
    addPoint () {
      const geojson = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [116.390629, 39.924317],
            },
            properties: {
              icon: "a",
              rotate: 45,
              title: "a卡车",
            },
          },
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [116.390329, 39.924717],
            },
            properties: {
              icon: "b",
              title: "b卡车",
              rotate: 34,
            },
          },
        ],
      };
      for (let i = 0; i < 100; i++) {
        geojson.features.push({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [
              116.390329 + Number((Math.random() / 60).toFixed(6)),
              39.924717 + Number((Math.random() / 100).toFixed(6)),
            ],
          },
          properties: {
            icon: Math.random() > 0.5 ? "a" : "b",
            rotate: parseInt(Math.random() * 360),
            title: "卡车",
          },
        });
      }
      this.layer.addPointLayer({
        name: "layer1",
        data: geojson,
        shape: "icon",
        rotate: {
          key: "rotate",
          value(rotate) {
            return rotate;
          },
        },
        size: 0.4,
      });
      this.myMap.on('click' , 'layer1' , evt => {
        const cursorLnglat = point([evt.lngLat.lng , evt.lngLat.lat]);
        let res = [];
        evt.features.map(item => {
          item.meters = rhumbDistance(cursorLnglat , point(item.geometry.coordinates));
          res.push(item.meters);
          return item;
        });
        const min = Math.min.apply(null , res);
        let feature;
        evt.features.map(item => {
          if (item.meters === min) {
            feature = item;
          }
        });
        
        console.log(feature.properties.icon)
        
      })
    }
  }
};
</script>
<style>
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
<template>
  <div class="box">
    <div class="btn-box">
      <button>addIcon</button>
    </div>
    <div id="map"></div>
  </div>
</template>
<script>
import Map from "@/utils/map";
import Layer from "@/utils/map/layer";
export default {
  mounted() {
    const myMap = new Map({
      container: "map",
      center: [116.390619, 39.924317],
    });
    myMap.on("load", async () => {
      const urls = [
        // {
        //   name: "a",
        //   url: "https://t7.baidu.com/it/u=4198287529,2774471735&fm=193&f=GIF",
        //   width: 100,
        //   height: 100,
        // },
        // {
        //   name: "b",
        //   url: "https://t7.baidu.com/it/u=2168645659,3174029352&fm=193&f=GIF",
        //   width: 100,
        //   height: 100,
        // },
        {
          name : 'a',
          url : require('@/assets/car1.png')
        },
        {
          name : 'b',
          url : require('@/assets/car2.png')
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
              color: "red",
              icon: "a",
              rotate: 45,
            },
          },
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [116.390329, 39.924717],
            },
            properties: {
              color: "red",
              icon: "b",
              rotate: 34,
            },
          },
        ],
      };
      layer.addPointLayer({
        name: "layer1",
        data: geojson,
        color: {
          field: "color",
          handler(color) {
            if (color === "red") {
              return "#f00";
            } else {
              return "#fff";
            }
          },
        },
        shape: 'icon',
        rotate: {
          field: "rotate",
          handler(rotate) {
            return rotate;
          },
        },
        size : 0.3
      });
      // setTimeout(() => {
      //   geojson.features.push({
      //     type : 'Feature',
      //     geometry : {
      //       type : 'Point',
      //       coordinates : [116.390729, 39.924017]
      //     },
      //     properties : {
      //       color : 'blue',
      //       icon : 'c',
      //       rotate : 90
      //     }
      //   });
      //   layer.updateLayer('layer1' , geojson);
      // } , 3000)
      myMap.on('mouseup' , 'layer1' , evt => {
        console.log(evt.features[0].properties.icon)
      })
    });
  },
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
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
  mounted () {
    const myMap = new Map({
      container : 'map',
      center : [116.390619, 39.924317]
    });
    myMap.on('load' , async () => {
      const urls = [
        {
          name : 'a',
          url : "https://t7.baidu.com/it/u=4198287529,2774471735&fm=193&f=GIF"
        },
        {
          name : 'b',
          url : "https://t7.baidu.com/it/u=2168645659,3174029352&fm=193&f=GIF"
        }
      ];
      const images = await myMap.loadImage(urls);
      images.map(image => {
        myMap.addImage(image.name , image.imageData);
      });
      const layer = new Layer(myMap.mapbox);
      const geojson = {
        type : 'FeatureCollection',
        features : [
          {
            type : 'Feature',
            geometry : {
              type : 'Point',
              coordinates : [116.390629, 39.924317]
            },
            properties : {
              color : 'red',
              icon : 'a'
            }
          }
        ]
      }
      layer.addPointLayer({
        name : 'layer1',
        data : geojson,
        color : {
          field : 'color',
          handler (color) {
            if (color === 'red') {
              return '#f00'
            } else {
              return '#fff';
            }
          }
        },
        shape : {
          field : 'icon',
          handler (type) {
            return type;
          }
        }
      })
    })
  }
  // mounted() {
  //   const myMap = new Map({
  //     container: "map",
  //     center: [116.390619, 39.924317],
  //   });
  //   const map = myMap.getMapbox();
  //   const layer = new Layer(map);
  //   map.on("load", async () => {
  //     // const urls = [
  //     //   "https://t7.baidu.com/it/u=4198287529,2774471735&fm=193&f=GIF",
  //     //   "https://t7.baidu.com/it/u=2168645659,3174029352&fm=193&f=GIF",
  //     // ];
  //     // const url =
  //     //   "https://t7.baidu.com/it/u=4198287529,2774471735&fm=193&f=GIF";
  //     // const url2 =
  //     //   "https://t7.baidu.com/it/u=2168645659,3174029352&fm=193&f=GIF";
  //     //
  //     const urls = [require('@/assets/car1.png') , require('@/assets/car2.png')];
  //     const res = await myMap.loadImage(urls);
  //     res.map((item , index) => {
  //       map.addImage(`car_${index + 1}` , item);
  //     })
  //     const geojson = {
  //       type: "FeatureCollection",
  //       features: [
  //         {
  //           type: "Feature",
  //           geometry: {
  //             type: "Point",
  //             coordinates: [116.390629, 39.924317],
  //           },
  //           properties: {
  //             iconName: "car1",
  //             rotate : 0
  //           },
  //         },
  //         {
  //           type: "Feature",
  //           geometry: {
  //             type: "Point",
  //             coordinates: [116.390169, 39.924317],
  //           },
  //           properties: {
  //             iconName: "car2",
  //             rotate : 0
  //           },
  //         },
  //       ],
  //     };
  //     layer.addPointLayer({
  //       name: "aa",
  //       data: geojson,
  //       field: "iconName",
  //       shape(name) {
  //         console.log(name)
  //         return name;
  //       },
  //     });
  //   });
  // },
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
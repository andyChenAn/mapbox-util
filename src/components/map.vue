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
    const map = myMap.getMapbox();
    map.on("load", async () => {
      const urls = ['https://t7.baidu.com/it/u=4198287529,2774471735&fm=193&f=GIF' , 'https://t7.baidu.com/it/u=2168645659,3174029352&fm=193&f=GIF'];
      const url = 'https://t7.baidu.com/it/u=4198287529,2774471735&fm=193&f=GIF';
      const url2 = 'https://t7.baidu.com/it/u=2168645659,3174029352&fm=193&f=GIF';
      const res = await myMap.loadImage(url , {width:200,height:100});
      map.addImage('aa' , res);
      map.addLayer({
        id : 'bb',
        source : {
          type : 'geojson',
          data : {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: [116.390629, 39.924317],
                },
              },
            ],
          }
        },
        type : 'symbol',
        layout : {
          'icon-image' : 'aa'
        }
      })
      setTimeout(() => {
      myMap.loadImage(url2 , {width:200,height:100}).then(res => {
        myMap.updateImage('aa' , res);
        map.removeLayer('bb');
        map.addLayer({
        id : 'cc',
        source : {
          type : 'geojson',
          data : {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: [116.390629, 39.924317],
                },
              },
            ],
          }
        },
        type : 'symbol',
        layout : {
          'icon-image' : 'aa'
        }
      })
      })
    } , 3000)
    });
    
  },
  // mounted() {
  //   const map = new Map(
  //     {
  //       container: "map",
  //       center: [116.390619, 39.924317],
  //     },
  //     icons
  //   );
  //   map.map.on("load", () => {
  //     const layer = new Layer(map.map);
  //     layer.addPointLayer({
  //       name: "andy",
  //       data: {
  //         type: "FeatureCollection",
  //         features: [
  //           {
  //             type: "Feature",
  //             geometry: {
  //               type: "Point",
  //               coordinates: [116.390629, 39.924317],
  //             },
  //           },
  //         ],
  //       },
  //     });
  //   });
  // },
  //methods: {
  // addIcon() {
  //   this.layer.addPointLayer({
  //     name: "bb",
  //     data: {
  //       type: "FeatureCollection",
  //       features: [
  //         {
  //           type: "Feature",
  //           geometry: {
  //             type: "Point",
  //             coordinates: [116.390629, 39.924317],
  //           },
  //           properties : {
  //             image: require("@/assets/car.png"),
  //             rotate : 40,
  //             type : 'white'
  //           }
  //         },
  //       ],
  //     },
  //     rotate: 90,
  //     opacity: 1,
  //     size : [64 , 30],
  //     scale : 0.5
  //   });
  // },
  //},
  // mounted() {
  //   const map = createMap({
  //     container: "map",
  //     center: [116.390619, 39.924317],
  //   });
  //   this.layer = new Layer(map);
  //   this.layer.addPointLayer({
  //     name: "aa",
  //     data: {
  //       type: "FeatureCollection",
  //       features: [
  //         {
  //           type: "Feature",
  //           geometry: {
  //             type: "Point",
  //             coordinates: [116.390619, 39.924317],
  //           },
  //           properties : {
  //             type : 'car',
  //             image: require("@/assets/car.png"),
  //             rotate : 90
  //           }
  //         },
  //         // {
  //         //   type: "Feature",
  //         //   geometry: {
  //         //     type: "Point",
  //         //     coordinates: [116.390639, 39.925537],
  //         //   },
  //         //   properties : {
  //         //     type : 'blue',
  //         //     image: require("@/assets/blue.png"),
  //         //     rotate : 45
  //         //   }
  //         // }
  //       ],
  //     },
  //     rotate: 90,
  //     opacity: 1,
  //     size : [64 , 30],
  //     scale : 0.5
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
<template>
  <div class="box">
    <div class="btn-box">
      <button @click="addPoint">addIcon</button>
      <button @click="addCircle">addCircle</button>
      <button @click="addLightDot">addLightDot</button>
      <button @click="addTextLayer">addTextLayer</button>
      <button @click="addActiveLayer">addActiveLayer</button>
      <button @click="addWaterWaveLayer">addWaterWaveLayer</button>
      <button @click="addRadarLayer">addRadarLayer</button>
    </div>
    <div id="map"></div>
  </div>
</template>
<script>
import Map from "@/utils/map";
import Layer from "@/utils/map/layer";
import { point, rhumbDistance } from "@turf/turf";
import textList from "./text";
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
  methods: {
    addPoint() {
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
      this.myMap.on("click", "layer1", (evt) => {
        const cursorLnglat = point([evt.lngLat.lng, evt.lngLat.lat]);
        let res = [];
        evt.features.map((item) => {
          item.meters = rhumbDistance(
            cursorLnglat,
            point(item.geometry.coordinates)
          );
          res.push(item.meters);
          return item;
        });
        const min = Math.min.apply(null, res);
        let feature;
        evt.features.map((item) => {
          if (item.meters === min) {
            feature = item;
          }
        });
      });
    },
    addCircle() {
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
              opacity: 0.6,
              radius: 10,
              num: 8,
              color: "red",
            },
          },
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [116.390329, 39.924717],
            },
            properties: {
              opacity: 1,
              radius: 15,
              num: 10,
              color: "black",
            },
          },
        ],
      };
      this.layer.addCircleLayer({
        name: "layer2",
        data: geojson,
      });
    },
    addLightDot() {
      let colors = [
        "#0A3663",
        "#1558AC",
        "#4D89E5",
        "#64A5D3",
        "#72BED6",
        "#83CED6",
        "#A6E1E0",
        "#B8EFE2",
        "#D7F9F0",
      ];
      fetch(
        "https://gw.alipayobjects.com/os/basement_prod/513add53-dcb2-4295-8860-9e7aa5236699.json"
      )
        .then((res) => res.json())
        .then((data) => {
          data.features = data.features
            .filter(
              (item) =>
                item.properties.h8 && item.properties.h8 <= colors.length - 1
            )
            .map((item) => {
              item.properties.color = colors[item.properties.h8];
              return item;
            });
          this.layer.addLightDotLayer({
            name: "layer3",
            data: data,
          });
        });
    },
    addTextLayer() {
      const geojson = {
        type: "FeatureCollection",
        features: [],
      };
      textList.map((item) => {
        geojson.features.push({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [item.j, item.w],
          },
          properties: {
            text: item.m,
          },
        });
      });
      this.layer.addTextLayer({
        name: "layer4",
        data: geojson,
      });
    },
    addActiveLayer() {
      const self = this;
      const size = 100;
      const waterWave = {
        width: size,
        height: size,
        data: new Uint8Array(size * size * 4),
        onAdd() {
          const canvas = document.createElement("canvas");
          canvas.width = this.width;
          canvas.height = this.height;
          this.context = canvas.getContext("2d");
        },
        render() {
          var duration = 1000;
          var t = (performance.now() % duration) / duration;
          var radius = (size / 2) * 0.3;
          var outerRadius = (size / 2) * 0.5 * t + radius;
          var context = this.context;
          // draw outer circle
          context.clearRect(0, 0, this.width, this.height);
          context.beginPath();
          context.arc(
            this.width / 2,
            this.height / 2,
            outerRadius,
            0,
            Math.PI * 2
          );
          context.fillStyle = "rgba(255, 200, 200," + (1 - t) + ")";
          context.fill();

          context.beginPath();
          context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
          context.fillStyle = "rgba(255, 100, 100, 1)";
          context.strokeStyle = "white";
          context.lineWidth = 2 + 4 * (1 - t);
          context.fill();
          context.stroke();
          this.data = context.getImageData(0, 0, this.width, this.height).data;
          self.myMap.mapbox.triggerRepaint();
          return true;
        },
      };
      this.myMap.addImage("water-wave", waterWave, { pixelRatio: 2 });
      const geojson = {
        type: "FeatureCollection",
        features: [],
      };
      textList.map((item) => {
        geojson.features.push({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [item.j, item.w],
          },
          properties: {
            text: item.m,
          },
        });
      });
      this.layer.addActiveLayer({
        name: "layer5",
        data: geojson,
      });
    },
    addWaterWaveLayer() {
      const self = this;
      const wave = {
        width: 60,
        height: 60,
        data: new Uint8Array(60 * 60 * 4),
        onAdd() {
          const canvas = document.createElement("canvas");
          canvas.width = this.width;
          canvas.height = this.height;
          this.context = canvas.getContext("2d");
          this.size = 60;
          this.radius1 = 0;
          this.radius2 = -10;
          this.radius3 = -20;
        },
        render() {
          var context = this.context;
          if (this.radius1 > this.size / 2) {
            this.radius1 = 0;
          }
          if (this.radius2 > this.size / 2) {
            this.radius2 = 0;
          }
          if (this.radius3 > this.size / 2) {
            this.radius3 = 0;
          }
          this.radius1 += 0.5;
          this.radius2 += 0.5;
          this.radius3 += 0.5;
          context.clearRect(0, 0, this.width, this.height);
          context.beginPath();
          context.arc(
            this.width / 2,
            this.height / 2,
            this.radius1,
            0,
            Math.PI * 2
          );
          context.lineWidth = 3;
          context.strokeStyle =
            "rgba(255, 0, 0 , " + (1 - this.radius1 / (this.size / 2)) + ")";
          context.stroke();

          context.beginPath();
          context.arc(
            this.width / 2,
            this.height / 2,
            this.radius2 < 0 ? 0 : this.radius2,
            0,
            Math.PI * 2
          );
          context.lineWidth = 3;
          context.strokeStyle =
            "rgba(255, 0, 0 , " + (1 - this.radius2 / (this.size / 2)) + ")";
          context.stroke();

          context.beginPath();
          context.arc(
            this.width / 2,
            this.height / 2,
            this.radius3 < 0 ? 0 : this.radius3,
            0,
            Math.PI * 2
          );
          context.lineWidth = 3;
          context.strokeStyle =
            "rgba(255, 0, 0 , " + (1 - this.radius3 / (this.size / 2)) + ")";
          context.stroke();

          // context.beginPath();
          // context.arc(this.width / 2, this.height / 2, 20, 0, Math.PI * 2);
          // context.fillStyle = 'rgb(255 , 0 , 0)';
          // context.strokeStyle = '#fff'
          // context.lineWidth = 5;
          // context.stroke();
          // context.fill();
          this.data = context.getImageData(0, 0, this.width, this.height).data;
          self.myMap.mapbox.triggerRepaint();
          return true;
        },
      };
      this.myMap.addImage("wave", wave, { pixelRatio: 2 });
      const geojson = {
        type: "FeatureCollection",
        features: [],
      };
      textList.map((item) => {
        geojson.features.push({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [item.j, item.w],
          },
          properties: {
            text: item.m,
          },
        });
      });
      this.layer.addWaterWaveLayer({
        name: "layer6",
        data: geojson,
      });
    },
    addRadarLayer() {
      const self = this;
      
      const drawSector = function (ctx , sAngle, eAngle , centerX , centerY) {
        let radius = centerX * 1
        let blob = 50;
        let increase = 0;

        if (sAngle < eAngle) {
          increase = (eAngle - sAngle) / blob;
        } else if (sAngle > eAngle) {
          increase = (Math.PI * 2 - sAngle + eAngle) / blob;
        } else {
          return;
        }

        let angle1 = sAngle;
        let angle2 = sAngle + increase;
        for (let i = 0; i < blob; i++) {
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.arc(centerX, centerY, radius, angle1, angle2);
          ctx.fillStyle = "rgba(42,195,39," + i / blob + ")";
          ctx.fill();
          angle1 = angle2;
          angle2 = angle1 + increase;
          if (angle2 >= Math.PI * 2) {
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, angle1, Math.PI * 2);
            ctx.fillStyle = "rgba(42,195,39," + i / blob + ")";
            ctx.fill();
            angle1 = 0;
            angle2 = angle1 + increase;
          }
        }
      };
      const radar = {
        width: 100,
        height: 100,
        data: new Uint8Array(100 * 100 * 4),
        onAdd() {
          const canvas = document.createElement("canvas");
          canvas.width = this.width;
          canvas.height = this.height;
          this.context = canvas.getContext("2d");
          this.angle = Math.PI;
          this.scanBegin = 0;
          this.scanEnd = this.angle;
        },
        render() {
          let context = this.context;
          context.clearRect(0, 0, this.width, this.height);
          drawSector(context , this.scanBegin , this.scanEnd , this.width / 2 , this.height / 2);
          this.scanBegin += this.angle/20;
				  this.scanEnd = this.scanBegin + this.angle;
          if (this.scanBegin >= Math.PI * 2) {
            this.scanBegin = 0;
            this.scanEnd = this.scanBegin + this.angle;
          }
          this.data = context.getImageData(0, 0, this.width, this.height).data;
          self.myMap.mapbox.triggerRepaint();
          return true;
        },
      };
      this.myMap.addImage("radar", radar, { pixelRatio: 2 });
      const geojson = {
        type: "FeatureCollection",
        features: [],
      };
      textList.map((item) => {
        geojson.features.push({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [item.j, item.w],
          },
          properties: {
            text: item.m,
          },
        });
      });
      this.layer.addRadarLayer({
        name: "layer7",
        data: geojson,
      });
    },
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
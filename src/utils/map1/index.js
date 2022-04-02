import mapboxgl from 'mapbox-gl';
import { mapOptions } from './map-config';
export function createMap (options) {
  const defaultOptions = {...mapOptions};
  options = Object.assign({} , defaultOptions , options);
  const map = new mapboxgl.Map(options);
  map.on('load' , () => {
    const img = document.createElement('img');
    img.src = require('@/assets/car.png');
    img.width = 100;
    img.height = 100;
    map.addImage('car' , img);
    console.log(map.listImages());
    // map.loadImage(require('@/assets/car.png') , (error , image) => {
    //   console.log(image);
    // });
  });
  return map;
}
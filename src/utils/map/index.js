import mapboxgl from 'mapbox-gl';
import { mapOptions } from './map-config';
export function createMap (options) {
  const defaultOptions = {...mapOptions};
  options = Object.assign({} , defaultOptions , options);
  const map = new mapboxgl.Map(options);
  return map;
}
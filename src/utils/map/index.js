import mapboxgl from 'mapbox-gl';
import { mapOptions } from './map-config';
class Map {
  constructor (options) {
    const defaultOptions = {...mapOptions};
    options = Object.assign({} , defaultOptions , options);
    const map = new mapboxgl.Map(options);
    this.instance = map;
  }
  getMapbox () {
    return this.instance;
  }
}
export default Map;
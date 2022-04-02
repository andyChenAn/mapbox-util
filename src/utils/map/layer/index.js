import PointLayer from './point/index';
class Layer {
  constructor (mapbox) {
    this.map = mapbox;
    this.point = new PointLayer(mapbox);
  }
  addPointLayer (options) {
    this.point.addLayer(options);
  }
}
export default Layer;
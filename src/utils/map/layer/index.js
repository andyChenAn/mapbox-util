import PointLayer from './point/index';
class Layer {
  constructor (mapbox) {
    this._layers = [];
    this.map = mapbox;
    this.point = new PointLayer(mapbox);
  }
  addPointLayer (options) {
    const layer = this.point.addLayer(options);
    return layer;
  }
}
export default Layer;
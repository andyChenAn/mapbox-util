import PointLayer from './point';
class Layer {
  constructor (mapbox) {
    this.mapbox = mapbox;
    this.point = new PointLayer(mapbox);
  }
  /**
   * 添加点图层
   * @param {object} options 点图层选项
   */
  addPointLayer (options) {
    this.point.addPointLayer(options);
  }
}
export default Layer;
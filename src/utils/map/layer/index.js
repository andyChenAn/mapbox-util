import PointLayer from './point';
import LineLayer from './line';
import PolygonLayer from './polygon';
class Layer {
  // mapbox的map实例
  constructor (map) {
    this.map = map;
    // 点图层实例
    this.point = new PointLayer(map);
    // 线图层实例
    this.line = new LineLayer(map);
    // 面图层实例
    this.polygon = new PolygonLayer(map);
    // 创建的图层列表，用于图层的增删改查
    this._layers = [];
  }
  /**
   * 根据名称获取图层实例
   * @param {string} layerName 图层名称
   */
  getLayerByName (layerName) {
    
  }
  /**
   * 根据名称删除图层
   * @param {string} layerName 图层名称
   */
  removeLayerByName (layerName) {

  }
  /**
   * 清空图层
   */
  clearLayer () {}
  addPointLayer (options) {
    const layer = this.point.addPointLayer(options);
    this._layers.push(layer);
    return layer;
  }
}
export default Layer;
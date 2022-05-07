import PointLayer from './point';
import { initGeojsonProperty } from '../utils';
class Layer {
  constructor (mapbox) {
    this.mapbox = mapbox;
    this._layers = [];
    this.point = new PointLayer(mapbox);
  }
  /**
   * 添加点图层
   * @param {object} options 点图层选项
   */
  addPointLayer (options) {
    const layer = this.point.addPointLayer(options);
    this._layers.push(layer);
  }
  addCircleLayer (options) {
    const layer = this.point.addCircleLayer(options);
  }
  addLightDotLayer (options) {
    const layer = this.point.addLightDotLayer(options);
  }
  addTextLayer (options) {
    const layer = this.point.addTextLayer(options);
  }
  addActiveLayer (options) {
    const layer = this.point.addActiveLayer(options);
  }
  addWaterWaveLayer (options) {
    const layer = this.point.addWaterWaveLayer(options);
  }
  addRadarLayer (options) {
    const layer = this.point.addRadarLayer(options);
  }
  /**
   * 根据图层名称获取相应的图层
   * @param {string} layerName 图层名称
   * @returns 返回图层对象
   */
  getLayerByName (layerName) {
    let layer;
    for (let i = 0 ; i < this._layers.length ; i++) {
      if (this._layers[i].id === layerName) {
        layer = this._layers[i];
        break;
      }
    };
    return layer;
  }
  /**
   * 删除图层
   * @param {string} layerName 图层名称
   */
  removeLayer (layerName) {
    for (let i =0 ; i < this._layers.length ; i++) {
      if (this._layers[i].id === layerName) {
        this.mapbox.removeLayer(layerName);
        break;
      }
    }
  }
  /**
   * 清空图层
   */
  clearLayer () {
    this._layers.forEach(layer => {
      this.mapbox.removeLayer(layer.id);
    })
  }
  /**
   * 更新图层，主要是更新图层的geojson数据
   * @param {string} layerName 图层名称 
   * @param {object} geojson geojson数据
   */
  updateLayer (layerName , geojson) {
    const layer = this.getLayerByName(layerName);
    geojson = initGeojsonProperty(geojson , layer.options);
    this.mapbox.getSource(layerName).setData(geojson);
  }
}
export default Layer;
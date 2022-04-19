import PointLayer from './point';
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
    const { color , shape , rotate } = layer.options;
    geojson.features.map(item => {
      if (color && typeof color === 'object') {
        if (item.properties[color.field]) {
          item.properties['_' + color.field] = color.handler(item.properties[color.field]);
        }
      };
      if (shape && typeof shape === 'object') {
        if (item.properties[shape.field]) {
          item.properties['_' + shape.field] = shape.handler(item.properties[shape.field])
        }
      };
      if (rotate && typeof rotate === 'object') {
        if (item.properties[rotate.field]) {
          item.properties['_' + rotate.field] = rotate.handler(item.properties[rotate.field]);
        }
      }
      return item;
    })
    this.mapbox.getSource(layerName).setData(geojson);
  }
}
export default Layer;
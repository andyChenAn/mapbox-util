/**
 * 点图层
 */
class PointLayer {
  constructor (mapbox) {
    this.mapbox = mapbox;
  }
  // 点图层（气泡，散点）
  addPointLayer (options) {
    // color : {field : 'xx' , callback : fn}/color : 'xx'
    const { name , data , color , size  = 1, rotate , shape } = options;
    const geojson = {
      type : 'FeatureCollection',
      features : []
    };
    data.features.forEach(item => {
      item.properties || (item.properties = {});
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
      geojson.features.push(item);
    });
    this.mapbox.addSource(name , {
      type : 'geojson',
      data : geojson
    });
    this.mapbox.addLayer({
      id : name,
      source : name,
      type : 'symbol',
      layout : {
        'icon-allow-overlap' : true,
        "icon-size" : size,
        'icon-image' : typeof shape === 'object' ? ['get' , `_${shape.field}`] : ['get' , shape],
        'icon-rotate' : typeof rotate === 'object' ? ['get' , `_${rotate.field}`] : ['get' , rotate],
      }
    });
    const layer = this.mapbox.getLayer(name);
    layer.options = options;
    return layer;
  }
  // 文本标注图
  addTextLayer () {}
  // 散点图/圈图
  addCircleLayer () {}
  // 亮度图
  addDotLayer () {}
  // 水波图
  addWaterWaveLayer () {}
}
export default PointLayer;
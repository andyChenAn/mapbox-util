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
    const { name , data , color , size , rotate , shape } = options;
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
      }
      geojson.features.push(item);
    });
    this.mapbox.addLayer({
      id : name,
      source : {
        type : 'geojson',
        data : geojson
      },
      type : 'symbol',
      layout : {
        'icon-image' : ['get' , `_${typeof shape === 'string' ? shape : shape.field}`]
      }
    })
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
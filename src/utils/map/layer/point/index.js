import { initGeojsonProperty } from '../../utils';
/**
 * 点图层
 */
class PointLayer {
  constructor (mapbox) {
    this.mapbox = mapbox;
  }
  // 点图层（气泡，散点）
  addPointLayer (options) {
    // color : {key : 'xx' , value : fn}/color : 'xx'
    const { name , data , size , shape , rotate } = options;
    const geojson = initGeojsonProperty(data , options);
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
        'text-allow-overlap' : true,
        'text-field' : ['get' , 'title'],
        'text-offset' : [0 , -2],
        "icon-size" : size,
        'icon-image' : typeof shape === 'object' ? ['get' , `_${shape.key}`] : ['get' , shape],
        'icon-rotate' : typeof rotate === 'object' ? ['get' , `_${rotate.key}`] : ['get' , rotate],
      },
      paint : {
        'text-color' : 'red'
      }
    });
    const layer = this.mapbox.getLayer(name);
    layer.options = options;
    return layer;
  }
  // 文本标注图
  addTextLayer () {}
  // 散点图/圈图
  addCircleLayer (options) {

  }
  // 亮度图
  addLightDotLayer () {}
  // 水波图
  addWaterWaveLayer () {}
}
export default PointLayer;
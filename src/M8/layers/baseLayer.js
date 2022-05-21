import AttributesService from '../services/attributes';
import { point, rhumbDistance } from "@turf/turf";
export default class BaseLayer {
  constructor () {
    this.attributesService = new AttributesService();
    this.geojson = {};
    this.mapbox = null;
    // 保存图层图层绑定的事件
    this.event = {}
  }
  source (data , options = {}) {
    if (data.type === 'FeatureCollection') {
      this.geojson = data;
      return this;
    }
    const geojson = {
      type : 'FeatureCollection',
      features : []
    };
    data.map(item => {
      geojson.features.push({
        type : 'Feature',
        geometry : {
          type : 'Point',
          coordinates : options.parser ? [item[options.parser.x] , item[options.parser.y]] : [item.longitude , item.latitude]
        },
        properties : {
          ...item
        }
      })
    })
    this.geojson = geojson;
    return this;
  }
  /**
   * 设置图层的shape类型
   * @param {string} field 类型字段，用于通过该字段返回具体的shape类型
   * @param {string|function|undefined} value shape类型，或者是函数，如果是函数，那么就调用该函数返回相应的shape类型
   */
  shape (field , value) {
    this.setAttribute('shape' , field , value);
    return this;
  }
  /**
   * 设置图层的size
   * @param {string} field 类型字段，用于通过该字段返回具体的size值，如果value值为空，那么field就是具体的size值
   * @param {string|function|undefined} value size值，如果是函数，那么调用该函数，以field对应的值作为参数传入，返回具体的尺寸
   */
  size (field , value) {
    this.setAttribute('size' , field , value);
    return this;
  }
  /**
   * 设置图层的color
   * @param {string} field 类型字段，用于通过该字段返回具体的color值，如果value值为空，那么field就是具体的color颜色值
   * @param {string|function|undefined} value color值，如果是函数，那么调用该函数，以field对应的值作为参数传入，返回具体的颜色值
   */
  color (field , value) {
    this.setAttribute('color' , field , value);
    return this;
  }
  /**
   * 设置图层的样式
   * @param {object} options 样式对象，包括opacity, stroke , strokeWidth
   */
  style (options) {
    this.setAttribute('style' , '' , options);
    return this;
  }
  setAttribute (type , field , value) {
    this.attributesService.add({
      attributeName : type,
      attributeField : field,
      attributeValue : value
    })
  }
  on (eventName , handler) {
    if (!this.event[eventName]) {
      this.event[eventName] = evt => {
        // 计算出点击的是合适的图层，当多个图层重合在一起的时候，计算方式是通过计算每个图层点与鼠标点击时的坐标点，两点之间的距离，去最小值，从而得到的就是用户正在点击的图层点
        let feature;
        let res = [];
        if (['mouseup' , 'mousedown' , 'click' , 'dblclick'].indexOf(eventName) > -1) {
          const cursorLnglat = point([evt.lngLat.lng, evt.lngLat.lat]);
          evt.features.map((item) => {
            item.meters = rhumbDistance(
              cursorLnglat,
              point(item.geometry.coordinates)
            );
            res.push(item.meters);
            return item;
          });
          const min = Math.min.apply(null, res);
          evt.features.map((item) => {
            if (item.meters === min) {
              feature = item;
            }
          });
        } else {
          feature = evt.features[0];
        }
        evt.feature = feature;
        handler.call(this , evt);
      };
      //this.mapbox.on(eventName , this.name , this.event[eventName])
    }
  }
  off (eventName) {
    if (this.event[eventName]) {
      this.mapbox.off(eventName , this.name , this.event[eventName]);
      delete this.event[eventName]
    }
  }
}
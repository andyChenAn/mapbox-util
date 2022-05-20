import mapboxgl , { LngLatBounds } from 'mapbox-gl';
import IconService from "../services/icon";
import LayerService from '../services/layer';
import config from './config';
import extend from '../extends';
const iconList = ['cirlce' , 'line' , 'fill' , 'symbol' , 'heatmap']
export default class Map {
  constructor (options) {
    if (!mapboxgl.supported()) {
      alert('你的浏览器不支持Mapbox GL！请升级浏览器或者更换谷歌浏览器！');
      return null;
    };
    options = Object.assign({} , config , options);
    this.mapbox = new mapboxgl.Map(options);
    // 图标
    this.iconService = new IconService(this.mapbox);
    // 图层管理
    this.layerService = new LayerService(this.mapbox);
    // 初始化地图手势
    this.initMapCursor();
  }
  /**
   * 获取mapbox实例
   * @returns mapbox实例
   */
  getMapbox () {
    return this.mapbox;
  }
  /**
   * 获取canvas元素
   * @returns canvas标签元素
   */
  getCanvas () {
    return this.mapbox.getCanvas();
  }
  /**
   * 初始化地图手势
   */
  initMapCursor () {
    const canvas = this.getCanvas();
    canvas.style.cursor = 'grab';
    this.mapbox.on('mousedown' , () => {
      canvas.style.cursor = 'grabbing';
    });
    this.mapbox.on('mouseup' , () => {
      canvas.style.cursor = 'grab';
    })
  }
  /**
   * 获取mapbox地图样式
   * @returns mapbox地图样式
   */
  getMapStyle () {
    return this.mapbox.getStyle();
  }
  /**
   * 设置mapbox地图样式
   * @param {string} style mapbox地图样式url
   * @param {object} options 设置地图样式时传的参数
   */
  setMapStyle (style , options) {
    if (options && typeof options === 'object') {
      this.mapbox.setStyle(style , options);
    } else {
      this.mapbox.setStyle(style);
    }
  }
  /**
   * 
   * @param {string} url 图片地址（图片必须是png、jpg、webp格式）
   * @param {object} options 加载图片所需的参数（width、height等）
   * @returns {array} 返回一个包含加载后的图片数据的数组，格式为：[{imageData : imageData , ...} , {imageData : imageData , ...} , ...]
   */
  loadImage (url , options = {}) {
    this.iconService.loadImage(url , options);
  }
  /**
   * 添加图片到mapbox中
   * @param {string} name 图片名称
   * @param {HTMLImageElement} image 图片资源
   */
  addImage (name , image) {
    this.iconService.addImage(name , image);
  }
  /**
   * 是否存在该张图片
   * @param {string} name 图片名称
   * @returns boolean
   */
  hasImage (name) {
    return this.iconService.hasImage(name);
  }
  /**
   * 删除图片
   * @param {string} name 图片名称
   */
  removeImage (name) {
    this.iconService.removeImage(name);
  }
  /**
   * 获取icon列表
   * @returns 返回图片列表
   */
  getImages () {
    return this.iconService.getImages();
  }
  /**
   * 更新图片
   * @param {string} name 图片名称
   * @param {ImageHTMLElement} image 图片标签对象
   */
  updateImage (name , image) {
    this.iconService.updateImage(name , image);
  }
  addLayer (layer) {
    if (!this.layerService.hasLayer(layer)) {
      this.layerService.addLayer(layer);
      this.render(layer);
    }
  }
  removeLayer (layer) {
    this.layerService.removeLayer(layer);
  }
  removeAllLayer () {
    this.layerService.removeAllLayer();
  }
  getLayerByName (layerName) {
    return this.layerService.getLayerByName(layerName)
  }
  formatTextOffset (offset , size) {
    return [(offset[0] / size) * 1.5 , (offset[1] / size) * 1.5];
  }
  /**
   * 初始化图层形状类型
   * @param {object} attribute 属性对象
   * @param {object} layer 图层对象
   */
  initShapeType (attribute , layer) {
    layer.shapeInited = true;
    const res = {};
    if (!attribute.attributeValue) {
      // 如果不存在，那么表示shape方法中只存在一个参数，这个参数表示的就是图层的形状类型
      res.type = attribute.attributeField;
    } else {
      // 如果存在
      res.type = 'symbol';
      if (attribute.attributeValue === 'text') {
        // 如果attributeValue值为text
        res.layout = {
          'text-field' : ['get' , attribute.attributeField]
        }
      } else {
        // 如果attributeValue是一个函数
        layer.geojson.features.map(item => {
          item.properties['_' + attribute.attributeName + '_' + attribute.attributeField] = attribute.attributeValue(item.properties[attribute.attributeField]);
          return item;
        });
        res.layout = {
          'icon-image' : ['get' , '_' + attribute.attributeName + '_' + attribute.attributeField]
        }
      }
    }
    return res;
  }
  /**
   * 初始化图层颜色
   * @param {object} attribute 属性对象
   * @param {object} layer 图层对象
   */
  initColor (attribute , layer , layerOptions) {
    layer.colorInited = true;
    const res = {};
    // 如果形状类型还没有初始化，那么就先初始化形状类型
    if (!layer.shapeInited) {
      layerOptions = this.initShapeType(layer.attributesService.attributes.filter(item => item.attributeName === 'shape')[0] , layer);
    }
    if (!attribute.attributeValue) {
      // 如果attributeValue不存在
      res.paint = {
        [layerOptions.type === 'symbol' && layerOptions.layout['text-field'] ? 'text-color' : layerOptions.type === 'symbol' && !layerOptions.layout['text-field'] ? 'icon-color' : layerOptions.type + '-color'] : attribute.attributeField
      }
      layer.color = attribute.attributeField;
    } else {
      // 如果attributeValue是一个函数
      if (typeof attribute.attributeValue === 'function') {
        layer.geojson.features.map(item => {
          item.properties['_' + attribute.attributeName + '_' + attribute.attributeField] = attribute.attributeValue(item.properties[attribute.attributeField]);
          return item;
        })
        res.paint = {
          [layerOptions.type === 'symbol' && layerOptions.layout['text-field'] ? 'text-color' : layerOptions.type === 'symbol' && !layerOptions.layout['text-field'] ? 'icon-color' : layerOptions.type + '-color'] : ['get' , '_' + attribute.attributeName + '_' + attribute.attributeField]
        }
        layer.color = ['get' , '_' + attribute.attributeName + '_' + attribute.attributeField];
      }
    };
    return extend(true , layerOptions , res);
  }
  initSize (attribute , layer , layerOptions) {
    layer.sizeInited = true;
    const res = {};
    // 如果形状类型还没有初始化，那么就先初始化形状类型
    if (!layer.shapeInited) {
      layerOptions = this.initShapeType(layer.attributesService.attributes.filter(item => item.attributeName === 'shape')[0] , layer);
    }
    if (!attribute.attributeValue) {
      if (layerOptions.type === 'symbol' && layerOptions.layout['text-field']) {
        // 类型是text（文本）
        res.layout = {
          'text-size' : attribute.attributeField
        }
      } else if (layerOptions.type === 'symbol' && !layerOptions.layout['text-field']) {
        // 类型是图标
        res.layout = {
          'icon-size' : attribute.attributeField
        }
      } else if (layerOptions.type === 'line') {
        res.paint = {
          'line-width' : attribute.attributeField
        }
      } else if (layerOptions.type === 'circle') {
        res.paint = {
          'circle-radius' : attribute.attributeField
        }
      }
      layer.size = attribute.attributeField;
    } else {
      // 如果attributeValue是一个函数
      if (typeof attribute.attributeValue === 'function') {
        layer.geojson.features.map(item => {
          item.properties['_' + attribute.attributeName + '_' + attribute.attributeField] = attribute.attributeValue(item.properties[attribute.attributeField]);
          return item;
        });
        if (layerOptions.type === 'symbol' && layerOptions.layout['text-field']) {
          // 类型是text（文本）
          res.layout = {
            'text-size' : ['get' , '_' + attribute.attributeName + '_' + attribute.attributeField]
          }
        } else if (layerOptions.type === 'symbol' && !layerOptions.layout['text-field']) {
          // 类型是图标
          res.layout = {
            'icon-size' : ['get' , '_' + attribute.attributeName + '_' + attribute.attributeField]
          }
        } else if (layerOptions.type === 'line') {
          res.paint = {
            'line-width' : ['get' , '_' + attribute.attributeName + '_' + attribute.attributeField]
          }
        } else if (layerOptions.type === 'circle') {
          res.paint = {
            'circle-radius' : ['get' , '_' + attribute.attributeName + '_' + attribute.attributeField]
          }
        }
        layer.size = ['get' , '_' + attribute.attributeName + '_' + attribute.attributeField];
      }
    }
    return extend(true , layerOptions , res);;
  }
  /**
   * 初始化样式
   */
  initStyle (attribute , layer , layerOptions) {
    const res = {};
    // 如果形状类型还没有初始化，那么就先初始化形状类型
    if (!layer.shapeInited) {
      layerOptions = this.initShapeType(layer.attributesService.attributes.filter(item => item.attributeName === 'shape')[0] , layer);
    };
    if (!layer.sizeInited) {
      layerOptions = extend(true , layerOptions , this.initSize(layer.attributesService.attributes.filter(item => item.attributeName === 'size')[0] , layer , layerOptions))
    };
    if (!layer.colorInited) {
      layerOptions = extend(true , layerOptions , this.initColor(layer.attributesService.attributes.filter(item => item.attributeName === 'color')[0] , layer , layerOptions))
    }
    if (layerOptions.type === 'circle') {
      // 如果是cirlce类型，style样式包括opacity，stroke-width , stroke-color , stroke-opacity
      res.paint = (res.paint || (res.paint = {}))
      res.paint['circle-stroke-color'] = layer.color;
      for (let key in attribute.attributeValue) {
        res.paint['circle-' + key] = attribute.attributeValue[key];
      }
    } else if (layerOptions.type === 'symbol') {
      // 如果是symbol类型，style样式包括opacity , offset
      for (let key in attribute.attributeValue) {
        if (key === 'offset') {
          res.layout = (res.layout || (res.layout = {}))
          res.layout[`${layerOptions.layout['text-field'] ? 'text' : 'icon'}-${key}`] = this.formatTextOffset(attribute.attributeValue[key] , layer.size)
        } else {
          res.paint = (res.paint || (res.paint = {}))
          res.paint[`${layerOptions.layout['text-field'] ? 'text' : 'icon'}-${key}`] = attribute.attributeValue[key]
        }
      }
    } else if (layerOptions.type === 'line') {
      // 如果是line类型，style样式包括opacity , offset
      for (let key in attribute.attributeValue) {
        res.paint = (res.paint || (res.paint = {}))
        res.paint['line-' + key] = attribute.attributeValue[key]
      }
    }
    return extend(true , layerOptions , res);
  }
  render (layer) {
    let layerOptions = {} , shape = {} , color = {} , size = {} , style = {};
    layer.attributesService.attributes.map(item => {
      if (item.attributeName === 'shape') {
        shape = this.initShapeType(item , layer , layerOptions);
        layerOptions = extend(true , layerOptions , shape);
      };
      if (item.attributeName === 'color') {
        color = this.initColor(item , layer , layerOptions);
        layerOptions = extend(true , layerOptions , color);
      };
      if (item.attributeName === 'size') {
        size = this.initSize(item , layer , layerOptions);
        layerOptions = extend(true , layerOptions , size);
      };
      if (item.attributeName === 'style') {
        style = this.initStyle(item , layer , layerOptions);
        layerOptions = extend(true , layerOptions , style);
      }
    });
    if (layerOptions.type === 'symbol') {
      layerOptions = extend(true , layerOptions , {
        layout : {
          'icon-allow-overlap' : true,
          'text-allow-overlap' : true
        }
      })
    };
    this.mapbox.addLayer({
      id : layer.name,
      type : layerOptions.type,
      source : {
        type : 'geojson',
        data : layer.geojson
      },
      layout : {
        ...layerOptions.layout
      },
      paint : {
        ...layerOptions.paint
      }
    });
  }
}
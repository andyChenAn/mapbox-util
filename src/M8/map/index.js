import mapboxgl , { LngLatBounds } from 'mapbox-gl';
import IconService from "../services/icon";
import LayerService from '../services/layer';
import config from './config';
import extend from '../extends';
import { createActiveCirlce , createWaterWave } from '../icons';
const shapeList = ['circle' , 'line' , 'fill' , 'symbol' , 'heatmap']
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
    // 鼠标是否放在图层上
    this.hoverLayer = false;
    // 添加一些自定义的图标
    this.addCustomIcon();
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
   * 添加自定义图标
   */
  addCustomIcon () {
    
  }
  /**
   * 初始化地图手势
   */
  initMapCursor () {
    const canvas = this.getCanvas();
    canvas.style.cursor = 'grab';
    // this.mapbox.on('mousedown' , (evt) => {
    //   if (!this.hoverLayer) {
    //     canvas.style.cursor = 'grabbing';
    //   }
    // });
    // this.mapbox.on('mouseup' , () => {
    //   if (!this.hoverLayer) {
    //     canvas.style.cursor = 'grab';
    //   }
    // })
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
      layer.mapbox = this.mapbox;
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
      if (shapeList.indexOf(attribute.attributeField) > -1) {
        // 如果不存在，那么表示shape方法中只存在一个参数，这个参数表示的就是图层的形状类型
        res.type = attribute.attributeField;
      } else {
        res.type = 'symbol';
        res.customType = attribute.attributeField;
        res.layout = {
          'icon-image' : attribute.attributeField
        }
      }
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
      layer.geojson.features.map(item => {
        item.properties['$$' + attribute.attributeName] = attribute.attributeField;
        return item;
      })
      layerOptions.layout = layerOptions.layout || (layerOptions.layout = {});
      // 如果attributeValue不存在
      res.paint = {
        [layerOptions.type === 'symbol' && layerOptions.layout['text-field'] ? 'text-color' : layerOptions.type === 'symbol' && !layerOptions.layout['text-field'] ? 'icon-color' : layerOptions.type + '-color'] : ['get' , '$$' + attribute.attributeName]
      }
    } else {
      // 如果attributeValue是一个函数
      if (typeof attribute.attributeValue === 'function') {
        layer.geojson.features.map(item => {
          item.properties['$$' + attribute.attributeName] = attribute.attributeValue(item.properties[attribute.attributeField]);
          return item;
        })
        res.paint = {
          [layerOptions.type === 'symbol' && layerOptions.layout['text-field'] ? 'text-color' : layerOptions.type === 'symbol' && !layerOptions.layout['text-field'] ? 'icon-color' : layerOptions.type + '-color'] : ['get' , '$$' + attribute.attributeName]
        }
      }
    };
    layer.color = ['get' , '$$' + attribute.attributeName];
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
      layer.geojson.features.map(item => {
        item.properties['$$' + attribute.attributeName] = attribute.attributeField;
        return item;
      });
      if (layerOptions.type === 'symbol' && layerOptions.layout['text-field']) {
        // 类型是text（文本）
        res.layout = {
          'text-size' : ['get' , '$$' + attribute.attributeName]
        }
      } else if (layerOptions.type === 'symbol' && !layerOptions.layout['text-field']) {
        // 类型是图标
        if (shapeList.indexOf(layerOptions.customType) > -1) {
          res.layout = {
            'icon-size' : ['get' , '$$' + attribute.attributeName]
          }
        } else {
          res.layout = {
            'icon-size' : 1
          }
        }
      } else if (layerOptions.type === 'line') {
        res.paint = {
          'line-width' : ['get' , '$$' + attribute.attributeName]
        }
      } else if (layerOptions.type === 'circle') {
        res.paint = {
          'circle-radius' : ['get' , '$$' + attribute.attributeName]
        }
      }
    } else {
      // 如果attributeValue是一个函数
      if (typeof attribute.attributeValue === 'function') {
        layer.geojson.features.map(item => {
          item.properties['get' , '$$' + attribute.attributeName] = attribute.attributeValue(item.properties[attribute.attributeField]);
          return item;
        });
        if (layerOptions.type === 'symbol' && layerOptions.layout['text-field']) {
          // 类型是text（文本）
          res.layout = {
            'text-size' : ['get' , '$$' + attribute.attributeName]
          }
        } else if (layerOptions.type === 'symbol' && !layerOptions.layout['text-field']) {
          // 类型是图标
          res.layout = {
            'icon-size' : ['get' , '$$' + attribute.attributeName]
          }
        } else if (layerOptions.type === 'line') {
          res.paint = {
            'line-width' : ['get' , '$$' + attribute.attributeName]
          }
        } else if (layerOptions.type === 'circle') {
          res.paint = {
            'circle-radius' : ['get' , '$$' + attribute.attributeName]
          }
        }
      } else if (Array.isArray(attribute.attributeValue)) {
        // 找到对应字段的最大值
        let values = [];
        layer.geojson.features.map(item => {
          values.push(item.properties[attribute.attributeField])
        });
        const maxValue = Math.max.apply(null , values);
        const startValue = attribute.attributeValue[0];
        const endValue = attribute.attributeValue[1];
        layer.geojson.features.map(item => {
          let value = parseInt((item.properties[attribute.attributeField] / maxValue) * endValue);
          if (value <= startValue) {
            value = 0;
          }
          item.properties['get' , '$$' + attribute.attributeName] = value;
          return item;
        });
        if (layerOptions.type === 'symbol' && layerOptions.layout['text-field']) {
          // 类型是text（文本）
          res.layout = {
            'text-size' : ['get' , '$$' + attribute.attributeName]
          }
        } else if (layerOptions.type === 'symbol' && !layerOptions.layout['text-field']) {
          // 类型是图标
          res.layout = {
            'icon-size' : ['get' , '$$' + attribute.attributeName]
          }
        } else if (layerOptions.type === 'line') {
          res.paint = {
            'line-width' : ['get' , '$$' + attribute.attributeName]
          }
        } else if (layerOptions.type === 'circle') {
          res.paint = {
            'circle-radius' : ['get' , '$$' + attribute.attributeName]
          }
        }
      }
    }
    layer.size = ['get' , '$$' + attribute.attributeName];
    return extend(true , layerOptions , res);;
  }
  /**
   * 初始化样式
   */
  initStyle (attribute , layer , layerOptions) {
    layer.styleInited = true;
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
  initHover (attribute , layer , layerOptions) {
    const res = {};
    this.hoverInited = true;
    // 如果形状类型还没有初始化，那么就先初始化形状类型
    if (!layer.shapeInited) {
      layerOptions = this.initShapeType(layer.attributesService.attributes.filter(item => item.attributeName === 'shape')[0] , layer);
    };
    if (!layer.colorInited) {
      layerOptions = extend(true , layerOptions , this.initColor(layer.attributesService.attributes.filter(item => item.attributeName === 'color')[0] , layer , layerOptions))
    };
    let opacity = 1;
    if (layer.attributesService.attributes.filter(item => item.attributeName === 'style').length > 0) {
      opacity = layer.attributesService.attributes.filter(item => item.attributeName === 'style')[0].attributeValue['opacity'];
      opacity = opacity ? opacity : 0;
    }
    let aColor = attribute.attributeValue['color'];
    aColor = aColor ? aColor : layer.color;
    let aOpacity = attribute.attributeValue['opacity'];
    aOpacity = aOpacity === undefined ? 0.6 : aOpacity;
    if (layerOptions.type === 'circle') {
      res.paint = {
        'circle-color' : ['case' , ['boolean' , ['feature-state' , 'hover'] , false] , aColor , layer.color],
        'circle-opacity' : ['case' , ['boolean' , ['feature-state' , 'hover'] , false] , aOpacity , opacity]
      }
    } else if (layerOptions.type === 'symbol') {
      if (layerOptions.layout['text-field']) {
        res.paint = {
          'text-color' : ['case' , ['boolean' , ['feature-state' , 'hover'] , false] , aColor , layer.color],
          'text-opacity' : ['case' , ['boolean' , ['feature-state' , 'hover'] , false] , aOpacity , opacity],
        }
      }
    }
    return extend(true , layerOptions , res);
  }
  render (layer) {
    Promise.resolve().then(() => {
      let layerOptions = {} , shape = {} , color = {} , size = {} , style = {} , hover = {};
      // 这里这么做的原因是将attribute重新进行排序，按照一定的先后顺序去初始化
      let temp = [];
      ['shape' , 'color' , 'size' , 'style' , 'hover'].map(item => {
        layer.attributesService.attributes.map(attr => {
          if (item === attr.attributeName) {
            temp.push(attr)
          }
        })
      });
      layer.attributesService.attributes = temp;
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
        };
        if (item.attributeName === 'hover') {
          hover = this.initHover(item , layer , layerOptions);
          layerOptions = extend(true , layerOptions , hover);
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
      if (layerOptions.customType) {
        if (!this.hasImage(layerOptions.customType)) {
          const color = layer.attributesService.get('color') && layer.attributesService.get('color').attributeField;
          const size = layer.attributesService.get('size') && layer.attributesService.get('size').attributeField;
          const icon = createActiveCirlce(this.mapbox , {size , color});
          const icon1 = createWaterWave(this.mapbox , { size , color })
          // 如果想要修改图标的颜色，那么必须设置sdf为true，并通过match表达式来设置
          //this.addImage(layerOptions.customType , icon , {pixelRatio: 2 });
          this.addImage(layerOptions.customType , icon1 , {pixelRatio: 2 });
        }
      }
      this.mapbox.addSource(layer.name , {
        type : 'geojson',
        data : layer.geojson
      });
      this.mapbox.addLayer({
        id : layer.name,
        type : layerOptions.type,
        source : layer.name,
        layout : {
          ...layerOptions.layout
        },
        paint : {
          ...layerOptions.paint
        }
      });
      for (let eventName in layer.event) {
        this.mapbox.on(eventName , layer.name , layer.event[eventName]);
      }
      this.mapbox.on('mousemove' , layer.name , this.handleMousemove.bind(this));
      this.mapbox.on('mouseleave' , layer.name , this.handleMouseleave.bind(this))
    })
  }
  handleMousemove () {
    this.hoverLayer = true;
    const canvas = this.getCanvas();
    canvas.style.cursor = 'pointer';
  }
  handleMouseleave () {
    this.hoverLayer = false;
    const canvas = this.getCanvas();
    canvas.style.cursor = 'grab';
  }
}
import mapboxgl , { LngLatBounds } from 'mapbox-gl';
import IconService from "../services/icon";
import LayerService from '../services/layer';
import config from './config';
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
    this.layerService.addLayer(layer);
    this.render(layer);
  }
  render (layer) {
    this.mapbox.addLayer({
      id : layer.name,
      type : 'symbol',
      source : {
        type : 'geojson',
        data : layer.geojson
      },
      layout : {
        'icon-image' : 'car',
        'icon-allow-overlap' : true
      }
    })
  }
}
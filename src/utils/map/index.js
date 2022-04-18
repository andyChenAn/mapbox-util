import mapboxgl , { LngLatBounds } from 'mapbox-gl';
import mapConfig from './map-config';
import { omit } from './utils';
class Map {
  constructor (options) {
    if (!mapboxgl.supported()) {
      alert('你的浏览器不支持Mapbox GL！请升级浏览器或者更换谷歌浏览器！');
      return null;
    };
    options = Object.assign({} , mapConfig , options);
    // 创建mapbox实例
    this.mapbox = new mapboxgl.Map(options);
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
   * 初始化地图手势
   */
  initMapCursor () {
    const canvas = this.mapbox.getCanvas();
    canvas.style.cursor = 'grab';
    this.mapbox.on('mousedown' , () => {
      canvas.style.cursor = 'grabbing';
    });
    this.mapbox.on('mouseup' , () => {
      canvas.style.cursor = 'grab';
    });
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
   * @param {object|string} style mapbox地图样式url
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
    return new Promise((resolve , reject) => {
      if (typeof url === 'string') {
        const img = document.createElement('img');
        img.src = url;
        options.width && (img.width = options.width);
        options.height && (img.height = options.height);
        img.crossOrigin = 'anonymous';
        img.onload = evt => {
          resolve({
            imageData : evt.target,
            ...options
          })
        };
        img.onerror = evt => {
          console.log(`${url},图片加载失败！`);
          reject({
            imageData : null,
            ...options
          })
        };
      } else if (Array.isArray(url)) {
        let arr = [];
        url.map(item => {
          if (item && typeof item === 'object') {
            arr.push(this.loadImage(item.url , Object.assign({} , options , omit(item , ['url']))))
          } else if (item && typeof item === 'string') {
            arr.push(this.loadImage(item , options));
          }
        });
        Promise.all(arr).then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        })
      }
    })
  }
  /**
   * 添加图片
   * @param {string} name 图片名称
   * @param {ImageHTMLElement} image 图片标签对象
   */
  addImage (name , image) {
    this.mapbox.addImage(name , image);
  }
  /**
   * 是否存在该张图片
   * @param {string} name 图片名称
   * @returns 
   */
  hasImage (name) {
    return this.mapbox.hasImage(name);
  }
  /**
   * 删除图片
   * @param {string} name 图片名称
   */
  removeImage (name) {
    this.mapbox.removeImage(name);
  }
  /**
   * 更新图片
   * @param {string} name 图片名称
   * @param {ImageHTMLElement} image 图片标签对象
   */
  updateImage (name , image) {
    this.mapbox.updateImage(name , image);
  }
  /**
   * 绑定事件
   * @param {string} eventName 事件名称
   * @param {string} layerName 图层名称
   * @param {function} listener 事件监听器
   */
  on (eventName , layerName , listener) {
    if (layerName && typeof layerName === 'function') {
      listener = layerName;
      layerName = null;
    };
    if (layerName) {
      this.mapbox.on(eventName , layerName , listener);
    } else {
      this.mapbox.on(eventName , listener);
    }
  }
  /**
   * 解绑事件
   * @param {string} eventName 事件名称
   * @param {string} layerName 图层名称
   * @param {function} listener 事件监听器
   */
  off (eventName , layerName , listener) {
    if (layerName && typeof layerName === 'function') {
      listener = layerName;
      layerName = null;
    }
    if (layerName) {
      this.mapbox.off(eventName , layerName , listener);
    } else {
      this.mapbox.off(eventName , listener);
    }
  }
  /**
   * 获取地图的范围（西北，东北，西南，东南四个坐标点）
   * @returns 四个角的坐标
   */
  getBounds () {
    const bounds = this.mapbox.getBounds();
    const lnglatBounds = new LngLatBounds(bounds._sw , bounds._ne);
    // 获取西北角坐标
    const nw = lnglatBounds.getNorthWest();
    // 获取东北角坐标
    const ne = lnglatBounds.getNorthEast();
    // 获取西南角坐标
    const sw = lnglatBounds.getSouthWest();
    // 获取东南角坐标
    const se = lnglatBounds.getSouthEast();
    return {nw , ne , sw , se};
  }
}
export default Map;
import mapboxgl from 'mapbox-gl';
import { mapOptions } from './map-config';
class Map {
  constructor (options) {
    const defaultOptions = {...mapOptions};
    options = Object.assign({} , defaultOptions , options);
    const map = new mapboxgl.Map(options);
    this.instance = map;
  }
  // 返回mapbox实例
  getMapbox () {
    return this.instance;
  }
  /**
   * 加载图片，可以是一张，也可以是多张
   * @param {string | array} url 
   */
  loadImage (url , options = {}) {
    return new Promise((resolve , reject) => {
      if (typeof url === 'string') {
        const img = document.createElement('img');
        img.src = url;
        options.width && (img.width = options.width);
        options.height && (img.height = options.height);
        img.crossOrigin = 'anonymous';
        img.onload = (evt) => {
          resolve(evt.target);
        };
        img.onerror = () => {
          console.log(`${url},图片加载失败!`);
          reject()
        }
      } else if (Array.isArray(url)) {
        let arr = [];
        url.map(item => {
          if (item && typeof item === 'object') {
            arr.push(this.loadImage(item , item.options || options));
          } else if (typeof item === 'string') {
            arr.push(this.loadImage(item , options));
          }
        });
        Promise.all(arr).then(images => {
          resolve(images);
        }).catch(err => {
          reject(err);
        })
      }
    })
  }
  /**
   * 添加图片
   * @param {string} name 图标名称
   * @param {HTMLElement} image image标签元素
   */
  addImage (name , image) {
    this.instance.addImage(name , image);
  }
  /**
   * 判断mapbox中是否存在图标
   * @param {string} name 图标名称
   * @returns {boolean}
   */
  hasImage (name) {
    return this.instance.hasImage(name);
  }
  /**
   * 删除图标
   * @param {string} name 图标名称
   */
  removeImage (name) {
    this.instance.removeLayer(name);
  }
  /**
   * 更新图标
   * @param {string} name 图标名称
   * @param {HTMLElement} image img标签元素
   */
  updateImage (name , image) {
    this.instance.updateImage(name , image)
  }
}
export default Map;
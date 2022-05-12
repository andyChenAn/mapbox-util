export default class IconService {
  constructor (mapbox) {
    this.mapbox = mapbox;
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
   * @param {HTMLImageElement} image 图片标签对象
   */
  addImage (name , image) {
    this.mapbox.addImage(name , image);
  }
  /**
   * 删除图片
   * @param {string} name 图片名称
   */
   removeImage (name) {
    this.mapbox.removeImage(name);
  }
  /**
   * 是否存在该张图片
   * @param {string} name 图片名称
   * @returns boolean
   */
  hasImage (name) {
    return this.mapbox.hasImage(name);
  }
  /**
   * 获取icon列表
   * @returns 返回图片列表
   */
  getImages () {
    return this.mapbox.listImages();
  }
  /**
   * 更新图片
   * @param {string} name 图片名称
   * @param {ImageHTMLElement} image 图片标签对象
   */
   updateImage (name , image) {
    this.mapbox.updateImage(name , image);
  }
}
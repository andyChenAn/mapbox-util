class PointLayer {
  constructor(map) {
    this.map = map;
  }
  // mapbox中的type属性值和paint属性是一一对应的，比如type是symbol，那么paint就是symbol-xx或者icon-xx
  /**
   * 添加点图层
   * @param {object} options 参数
   * options常用参数：
   * 1、@param {string} name 图层名称
   * 2、@param {object} data geojson格式的数据
   * 3、@param {string | function} image 图片地址(要用require('xxx')方式引入)，如果是函数，那么就需要返回一个图片地址，主要用于判断当geojson数据上图时，出现多个不同的图片，那么我们就可以根据geojson数据的properties中的字段进行判断，并返回相应的图片路径
   * 4、@param {number | function} rotate 图片旋转的角度，如果是函数，主要用于图层中存在多个点图层，每一个点都有自己的旋转角度，那么我们可以通过geojson数据中的properties的字段进行判断，来给每个点不同的角度
   */
  addPointLayer(options = {}) {
    this.map.on('load', () => {
      const { name, data, image, rotate = 0, opacity = 1, size = 16 , scale } = options;
      data.features.map(item => {
        const img = new Image();
        // size可以是一个数字，或者数组，如果是数组的话，那么width是第一个，height是第二个，如果是数字，那么width和height是一样的
        // img.width = size[1];
        // img.height = size[0];
        // img.src = item.properties.image;
        // img.onload = () => {
        //   this.map.addImage(item.properties.type , img);
        // }
        this.map.loadImage(item.properties.image , (err , image) => {
          if (err) {
            throw err;
          }
          this.map.addImage(item.properties.type , image , {
            pixelRatio : 1
          });
        })
      })
      setTimeout(() => {
        this.map.addLayer({
          id: name,
          type: 'symbol',
          source: {
            type: 'geojson',
            data: data,
          },
          layout: {
            'icon-image': '{type}',
            'icon-rotate': ['get' , 'rotate'],
            'icon-size' : scale,
            'icon-allow-overlap': true
          },
          paint: {
            'icon-opacity': opacity,
          }
        })
      } , 1000)
      
    })


  }
}
export default PointLayer;
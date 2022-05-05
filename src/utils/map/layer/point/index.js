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
  addTextLayer (options) {
    this.mapbox.setZoom(10)
    const { name , data } = options;
    this.mapbox.addSource(name , {
      type : 'geojson',
      data : data
    });
    this.mapbox.addLayer({
      id : name,
      source : name,
      type : 'symbol',
      layout : {
        'text-field' : ['get' , 'text'],
        'text-allow-overlap' : true,
        'text-rotate' : ['get' , 'rotate']
      },
      paint : {
        'text-color' : '#000'
      }
    })
  }
  // 散点图/圈图
  addCircleLayer (options) {
    const { name , data , color , size , shape = 'circle' , zIndex } = options;
    this.mapbox.addSource(name , {
      type : 'geojson',
      data : data
    });
    this.mapbox.addLayer({
      id : name,
      source : name,
      type : 'circle',
      paint : {
        // 圆圈颜色
        'circle-color' : ['get' , 'color'],
        // 圆圈模糊层度
        'circle-blur' : 0,
        // 圆圈透明度
        'circle-opacity' : ['get' , 'opacity'],
        // 圆圈倾斜对齐方式（地图倾斜时），可以是map/viewport，map表示与地图对齐，viewport表示与视口对齐
        'circle-pitch-alignment' : 'viewport',
        // 圆圈倾斜缩放（地图倾斜时，如果缩放地图），可以是map/viewport，map表示跟着地图一起缩放大小，viewport表示不会跟着地图一起缩放大小
        'circle-pitch-scale' : 'viewport',
        // 圆圈半径
        'circle-radius' : ['get' , 'radius'],
        // 圆圈的描边的颜色
        'circle-stroke-color' : 'blue',
        // 圆圈描边的宽度，默认为0，如果将circle-color设置为transparent，那么就得到了一个空心圆
        'circle-stroke-width' : 0,
        // 圆圈描边的透明度
        'circle-stroke-opacity' : 0.4,
        // 圆圈的水平和垂直位移距离
        'circle-translate' : [-10 , 20],
      },
      layout : {
        // 按照num值对要素进行排序，具有较高的feature会出现在较低的feature的上面，这个在地图上主要展示的就是较高的会比较低的层级高
        'circle-sort-key' : ['get' , 'num'],
        // 图层是否展示
        'visibility' : 'visible'
      }
    })
  }
  // 亮度图
  addLightDotLayer (options) {
    const { name , data } = options;
    this.mapbox.addSource(name , {
      type : 'geojson',
      data : data
    });
    // step主要用于聚合，计数
    this.mapbox.addLayer({
      id : name,
      source : name,
      type : 'circle',
      paint : {
        'circle-radius' : 6,
        'circle-blur' : ["interpolate", ["linear"], ["zoom"], 10 , 2 , 17 , 0],
        'circle-color' : ["interpolate", ["linear"], ["zoom"], 10 , 'yellow' , 17 , ['get' , 'color']]
      }
    })
  }
  // 活动的图层
  addActiveLayer (options) {
    const { name , data } = options;
    this.mapbox.addSource(name , {
      type : 'geojson',
      data : data
    });
    this.mapbox.addLayer({
      id : name,
      source : name,
      type : 'symbol',
      layout : {
        'icon-image' : 'water-wave',
        'icon-size' : 1,
        'icon-allow-overlap' : true,
        'text-allow-overlap' : true,
      },
    })
  }
  addWaterWaveLayer (options) {
    const { name , data } = options;
    this.mapbox.addSource(name , {
      type : 'geojson',
      data : data
    });
    this.mapbox.addLayer({
      id : name,
      source : name,
      type : 'symbol',
      layout : {
        'icon-image' : 'water',
        'icon-size' : 1,
        'icon-allow-overlap' : true,
      }
    })
  }
}
export default PointLayer;
/**
 * 忽略对象中指定的属性
 * @param {object} target 需要过滤的数据
 * @param {array} omitList 需要忽略的数据列表
 * @returns 
 */
export function omit (target , omitList) {
  let res = {};
  for (let key in target) {
    if (omitList.indexOf(key) === -1) {
      res[key] = target[key];
    }
  }
  return res;
};

/**
 * 初始化geojson中的properties属性，主要用于添加interpolate语法的属性
 * @param {object} geojson geojson数据对象
 * @param {object} options 需要初始化的选项对象(调用各种addLayer传入的options)key , value
 */
export function initGeojsonProperty (geojson , options) {
  if (options && typeof options === 'object') {
    geojson.features.map(item => {
      for (let key in options) {
        if (
          options[key] && 
          typeof options[key] === 'object' && 
          options[key].key && 
          typeof options[key].value === 'function'
        ) {
          item.properties['_' + options[key].key] = options[key].value(item.properties[options[key].key]);
        }
      };
      return item;
    })
  };
  return geojson;
};

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
}
import AttributesService from '../services/attributes';
export default class BaseLayer {
  constructor () {
    this.attributesService = new AttributesService();
  }
  /**
   * 设置图层的shape类型
   * @param {string} field 类型字段，用于通过该字段返回具体的shape类型
   * @param {string|function|undefined} value shape类型，或者是函数，如果是函数，那么就调用该函数返回相应的shape类型
   */
  shape (field , value) {
    this.setAttribute('shape' , field , value);
    return this;
  }
  /**
   * 设置图层的size
   * @param {string} field 类型字段，用于通过该字段返回具体的size值，如果value值为空，那么field就是具体的size值
   * @param {string|function|undefined} value size值，如果是函数，那么调用该函数，以field对应的值作为参数传入，返回具体的尺寸
   */
  size (field , value) {
    this.setAttribute('size' , field , value);
    return this;
  }
  /**
   * 设置图层的color
   * @param {string} field 类型字段，用于通过该字段返回具体的color值，如果value值为空，那么field就是具体的color颜色值
   * @param {string|function|undefined} value color值，如果是函数，那么调用该函数，以field对应的值作为参数传入，返回具体的颜色值
   */
  color (field , value) {
    this.setAttribute('color' , field , value);
    return this;
  }
  /**
   * 设置图层的样式
   * @param {object} options 样式对象，包括opacity, stroke , strokeWidth
   */
  style (options) {
    this.setAttribute('style' , '' , options);
    return this;
  }
  setAttribute (type , field , value) {
    this.attributesService.add({
      attributeName : type,
      attributeField : field,
      attributeValue : value
    })
  }
}
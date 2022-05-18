import AttributesService from '../services/attributes';
export default class BaseLayer {
  constructor () {
    this.attributesService = new AttributesService();
  }
  shape (type) {
    this.attributesService.add({
      attributeName : 'shape',
      attributeValue : type
    })
  }
  size (size) {
    this.attributesService.add({
      attributeName : 'size',
      attributeValue : size
    })
  }
  color (color) {
    this.attributesService.add({
      attributeName : 'color',
      attributeValue : color
    })
  }
  style (style) {
    this.attributesService.add({
      attributeName : 'style',
      attributeValue : style
    })
  }
}
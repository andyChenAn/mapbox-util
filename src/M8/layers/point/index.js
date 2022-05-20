import BaseLayer from "../baseLayer";
export default class PointLayer extends BaseLayer {
  constructor (options = {}) {
    super();
    for (let key in options) {
      this[key] = options[key];
    }
  }
}
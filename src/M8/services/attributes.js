export default class Attributes {
  constructor () {
    this.attributes = [];
  }
  add (data) {
    this.attributes.push(data);
  }
  getAll () {
    return this.attributes;
  }
  get (attributeName) {
    const res = this.attributes.filter(item => item.attributeName === attributeName);
    return res.length > 0 ? res[0] : '';
  }
  remove (attributeName) {
    for (let i = 0 ; i < this.attributes.length ; i++) {
      if (this.attributes[i].attributeName === attributeName) {
        this.attributes.splice(i , 1);
        break;
      }
    }
  }
  removeAll () {
    this.attributes = [];
  }
}
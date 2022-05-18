export default class Attributes {
  constructor (mapbox) {
    this.attributes = [];
  }
  add (data) {
    this.attributes.push(data);
  }
  get () {
    return this.attributes;
  }
  remove (attributeName) {
    for (let i = 0 ; i < this.attributes.length ; i++) {
      if (this.attributes[i].attributeName === attributeName) {
        this.attributes.splice(i , 1);
        break;
      }
    }
  }
}
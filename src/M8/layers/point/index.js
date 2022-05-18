import BaseLayer from "../baseLayer";
export default class PointLayer extends BaseLayer {
  constructor (options = {}) {
    super();
    this.geojson = {};
    for (let key in options) {
      this[key] = options[key];
    }
  }
  source (data , options = {}) {
    const geojson = {
      type : 'FeatureCollection',
      features : []
    };
    data.map(item => {
      geojson.features.push({
        type : 'Feature',
        geometry : {
          type : 'Point',
          coordinates : options.parser ? [item[options.parser.x] , item[options.parser.y]] : [item.longitude , item.latitude]
        },
        properties : {
          ...item
        }
      })
    })
    this.geojson = geojson;
    return this;
  }
}
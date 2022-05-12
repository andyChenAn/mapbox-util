export default class LayerService {
  constructor (mapbox) {
    this.mapbox = mapbox;
    this.layerList = [];
  }
  getLayers () {
    return this.layerList;
  }
  getLayerByName (name) {
    return this.layerList.find(layer => layer.id === name);
  }
  removeLayer () {}
  removeAllLayer () {}
  addLayer (layer) {
    this.layerList.push(layer);
  }
  hasLayer (layer) {
    
  }
}
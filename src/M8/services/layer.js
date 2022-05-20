export default class LayerService {
  constructor (mapbox) {
    this.mapbox = mapbox;
    this.layerList = [];
  }
  getLayers () {
    return this.layerList;
  }
  getLayerByName (name) {
    return this.layerList.find(layer => layer.name === name);
  }
  removeLayer (layer) {
    for (let i = 0 ; i < this.layerList.length ; i++) {
      if (typeof layer === 'string') {
        if (this.layerList[i].name === layer) {
          this.mapbox.removeLayer(layer);
          this.mapbox.removeSource(layer);
          this.layerList.splice(i , 1);
          break;
        }
      } else {
        if (this.layerList[i].name === layer.name) {
          this.mapbox.removeLayer(layer.name);
          this.mapbox.removeSource(layer.name);
          this.layerList.splice(i , 1);
          break;
        }
      }
    }
  }
  removeAllLayer () {
    this.layerList.map(layer => {
      this.mapbox.removeLayer(layer.name);
      this.mapbox.removeSource(layer.name);
    })
    this.layerList = [];
  }
  addLayer (layer) {
    this.layerList.push(layer);
  }
  hasLayer (layer) {
    let res = false;
    for (let i = 0 ; i < this.layerList.length ; i++) {
      if (this.layerList[i].name === layer.name) {
        res = true;
        break;
      }
    }
    return res;
  }
}
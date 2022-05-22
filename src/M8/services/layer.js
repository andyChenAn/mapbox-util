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
          let event = this.layerList[i].event
          if (Object.keys(event).length > 0) {
            for (let eventName in event) {
              this.mapbox.off(eventName , this.layerList[i].name , event[eventName]);
            }
          }
          break;
        }
      } else {
        if (this.layerList[i].name === layer.name) {
          this.mapbox.removeLayer(layer.name);
          this.mapbox.removeSource(layer.name);
          this.layerList.splice(i , 1);
          let event = this.layerList[i].event
          if (Object.keys(event).length > 0) {
            for (let eventName in event) {
              this.mapbox.off(eventName , this.layerList[i].name , event[eventName]);
            }
          }
          break;
        }
      }
    }
  }
  removeAllLayer () {
    this.layerList.map(layer => {
      this.mapbox.removeLayer(layer.name);
      this.mapbox.removeSource(layer.name);
      let event = layer.event
      if (Object.keys(event).length > 0) {
        for (let eventName in event) {
          this.mapbox.off(eventName , layer.name , event[eventName]);
        }
      }
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
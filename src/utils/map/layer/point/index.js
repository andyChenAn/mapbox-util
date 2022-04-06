class PointLayer {
  constructor (mapbox) {
    this.map = mapbox;
  }
  addLayer (options) {
    const {
      name,
      data,
      field,
      shape,
      rotate,
      ...rest
    } = options;
    if (data.features.length > 0) {
      data.features.map(item => {
        if (item.properties && typeof item.properties === 'object') {
          if (field && typeof shape === 'function') {
            const shapeValue = item.properties[field];
            shape(shapeValue);
          }
        }
      })
    }
    this.map.addLayer({
      id : name,
      type : 'symbol',
      source : {
        type : 'geojson',
        data : data
      }
    });
    return this.map.getLayer(options.name)
  }
}
export default PointLayer;
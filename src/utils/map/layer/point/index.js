class PointLayer {
  constructor (mapbox) {
    this.map = mapbox;
  }
  async addLayer (options) {
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
            item.properties._fieldValue = shape(shapeValue);
          }
        }
        return item;
      })
    }
    this.map.addLayer({
      id : name,
      type : 'symbol',
      source : {
        type : 'geojson',
        data : data
      },
      layout : {
        'icon-image' : ['get' , '_fieldValue'],
        'icon-rotate' : ['get' , 'rotate']
      }
    });
    return this.map.getLayer(options.name)
  }
}
export default PointLayer;
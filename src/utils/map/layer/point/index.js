class PointLayer {
  constructor (mapbox) {
    this.map = mapbox;
  }
  loadImage (url) {
    return new Promise((resolve , reject) => {
      this.map.loadImage(url , (error , image) => {
        if (error) {
          reject(err);
          return;
        };
        resolve(image);
      })
    })
  }
  addLayer (options) {
    const { name , data , field , shape , rotate , url , ...rest } = options;
    // if (url) {
    //   this.loadImage(url).then(image => {
    //     this.map.addImage()
    //   })
    // }
    // data.features.map(item => {
    //   item.properties.shape = shape(item.properties[field]);
    //   return item;
    // })
    data.features.map(async item => {
      if (item.properties.url) {
        let image = await this.loadImage(item.properties.url);
        console.log(image)
      }
    })
    console.log(121)
    this.map.addLayer(Object.assign({} , {
      id : name,
      type : 'symbol',
      source : {
        type : 'geojson',
        data : data
      },
      layout : {
        'icon-image' : ['get' , 'shape'],
        'icon-rotate' : ['get' , 'rotate']
      }
    } , rest));
    return this.map.getLayer(options.name)
  }
}
export default PointLayer;
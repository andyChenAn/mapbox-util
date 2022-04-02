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
    const { name , data , field , shape , rotate , images , url , ...rest } = options;
    let arr = [];
    images.forEach(image => {
      arr.push(this.loadImage(image));
    });
    Promise.all(arr).then(res => {
      res.map(image => {
        this.map.addImage('aa' , image);
      })
      this.map.addLayer(Object.assign({} , rest , {
        id : name,
        type : 'symbol',
        source : {
          type : 'geojson',
          data : data
        },
        layout : {
          'icon-image' : 'aa',
        }
      }));
    })
    // if (url) {
    //   this.loadImage(url).then(image => {
    //     this.map.addImage()
    //   })
    // }
    // data.features.map(item => {
    //   item.properties.shape = shape(item.properties[field]);
    //   return item;
    // })
   
    
    return this.map.getLayer(options.name)
  }
}
export default PointLayer;
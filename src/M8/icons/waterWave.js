/**
 * 水波纹
 */
export default function createWaterWave (mapbox , options) {
  return {
    width: 60,
    height: 60,
    data: new Uint8Array(60 * 60 * 4),
    onAdd() {
      const canvas = document.createElement("canvas");
      canvas.width = this.width;
      canvas.height = this.height;
      this.context = canvas.getContext("2d");
      this.size = 60;
      this.radius1 = 0;
      this.radius2 = -10;
      this.radius3 = -20;
    },
    render() {
      var context = this.context;
      if (this.radius1 > this.size / 2) {
        this.radius1 = 0;
      }
      if (this.radius2 > this.size / 2) {
        this.radius2 = 0;
      }
      if (this.radius3 > this.size / 2) {
        this.radius3 = 0;
      }
      this.radius1 += 0.5;
      this.radius2 += 0.5;
      this.radius3 += 0.5;
      context.clearRect(0, 0, this.width, this.height);
      context.beginPath();
      context.arc(
        this.width / 2,
        this.height / 2,
        this.radius1,
        0,
        Math.PI * 2
      );
      context.lineWidth = 3;
      context.strokeStyle =
        "rgba(255, 0, 0 , " + (1 - this.radius1 / (this.size / 2)) + ")";
      context.stroke();

      context.beginPath();
      context.arc(
        this.width / 2,
        this.height / 2,
        this.radius2 < 0 ? 0 : this.radius2,
        0,
        Math.PI * 2
      );
      context.lineWidth = 3;
      context.strokeStyle =
        "rgba(255, 0, 0 , " + (1 - this.radius2 / (this.size / 2)) + ")";
      context.stroke();

      context.beginPath();
      context.arc(
        this.width / 2,
        this.height / 2,
        this.radius3 < 0 ? 0 : this.radius3,
        0,
        Math.PI * 2
      );
      context.lineWidth = 3;
      context.strokeStyle =
        "rgba(255, 0, 0 , " + (1 - this.radius3 / (this.size / 2)) + ")";
      context.stroke();

      // context.beginPath();
      // context.arc(this.width / 2, this.height / 2, 20, 0, Math.PI * 2);
      // context.fillStyle = 'rgb(255 , 0 , 0)';
      // context.strokeStyle = '#fff'
      // context.lineWidth = 5;
      // context.stroke();
      // context.fill();
      this.data = context.getImageData(0, 0, this.width, this.height).data;
      mapbox.triggerRepaint();
      return true;
    },
  }
}
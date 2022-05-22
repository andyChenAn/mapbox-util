/**
 * 水波纹
 */
export default function createWaterWaveShape (mapbox , options) {
  const { size = 48 , color } = options;
  return {
    width : size,
    height : size,
    data: new Uint8Array(size * size * 4),
    onAdd() {
      const canvas = document.createElement("canvas");
      canvas.width = this.width;
      canvas.height = this.height;
      this.context = canvas.getContext("2d");
    },
    render() {
      var duration = 1000;
      var t = (performance.now() % duration) / duration;
      var radius = (size / 2) * 0.3;
      var outerRadius = (size / 2) * 0.5 * t + radius;
      var context = this.context;
      // draw outer circle
      context.clearRect(0, 0, this.width, this.height);
      context.beginPath();
      context.arc(
        this.width / 2,
        this.height / 2,
        outerRadius,
        0,
        Math.PI * 2
      );
      context.fillStyle = "rgba(255, 200, 200," + (1 - t) + ")";
      context.fill();

      context.beginPath();
      context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
      context.fillStyle = color;
      context.strokeStyle = "white";
      context.lineWidth = 2 + 4 * (1 - t);
      context.fill();
      context.stroke();
      this.data = context.getImageData(0, 0, this.width, this.height).data;
      mapbox.triggerRepaint();
      return true;
    },
  }
}
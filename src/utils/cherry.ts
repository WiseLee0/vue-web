export default class Cherry {
  readonly FOCUS_POSITION: number = 300
  readonly FAR_LIMIT: number = 600
  readonly MAX_RIPPLE_COUNT: number = 100
  readonly RIPPLE_RADIUS: number = 100
  readonly SURFACE_RATE: number = 0.5
  readonly SINK_OFFSET: number = 20
  renderer: any
  x: any
  y: any
  z: any
  vx: any
  vy: any
  theta: any
  phi: any
  psi: any
  dpsi: any
  opacity: any
  endTheta: any
  endPhi: any
  rippleCount: any
  offsetY: any
  thresholdY: any
  entityColor: any
  shadowColor: any
  constructor(renderer: any, isRandom: boolean) {
    this.renderer = renderer;
    this.init(isRandom);
  }
  init(isRandom: boolean) {
    this.x = this.getRandomValue(-this.renderer.width, this.renderer.width);
    this.y = isRandom ? this.getRandomValue(0, this.renderer.height) : this.renderer.height * 1.5;
    this.z = this.getRandomValue(0, this.FAR_LIMIT);
    this.vx = this.getRandomValue(-2, 2);
    this.vy = -2;
    this.theta = this.getRandomValue(0, Math.PI * 2);
    this.phi = this.getRandomValue(0, Math.PI * 2);
    this.psi = 0;
    this.dpsi = this.getRandomValue(Math.PI / 600, Math.PI / 300);
    this.opacity = 0;
    this.endTheta = false;
    this.endPhi = false;
    this.rippleCount = 0;

    var axis = this.getAxis(),
      theta = this.theta + Math.ceil(-(this.y + this.renderer.height * this.SURFACE_RATE) / this.vy) * Math.PI / 500;
    theta %= Math.PI * 2;

    this.offsetY = 40 * ((theta <= Math.PI / 2 || theta >= Math.PI * 3 / 2) ? -1 : 1);
    this.thresholdY = this.renderer.height / 2 + this.renderer.height * this.SURFACE_RATE * axis.rate;
    this.entityColor = this.renderer.context.createRadialGradient(0, 40, 0, 0, 40, 80);
    this.entityColor.addColorStop(0, 'hsl(330, 70%, ' + 50 * (0.3 + axis.rate) + '%)');
    this.entityColor.addColorStop(0.05, 'hsl(330, 40%,' + 55 * (0.3 + axis.rate) + '%)');
    this.entityColor.addColorStop(1, 'hsl(330, 20%, ' + 70 * (0.3 + axis.rate) + '%)');
    this.shadowColor = this.renderer.context.createRadialGradient(0, 40, 0, 0, 40, 80);
    this.shadowColor.addColorStop(0, 'hsl(330, 40%, ' + 30 * (0.3 + axis.rate) + '%)');
    this.shadowColor.addColorStop(0.05, 'hsl(330, 40%,' + 30 * (0.3 + axis.rate) + '%)');
    this.shadowColor.addColorStop(1, 'hsl(330, 20%, ' + 40 * (0.3 + axis.rate) + '%)');
  }
  getRandomValue(min: number, max: number) {
    return min + (max - min) * Math.random();
  }
  getAxis() {
    var rate = this.FOCUS_POSITION / (this.z + this.FOCUS_POSITION),
      x = this.renderer.width / 2 + this.x * rate,
      y = this.renderer.height / 2 - this.y * rate;
    return { rate: rate, x: x, y: y };
  }
  renderCherry(context: CanvasRenderingContext2D, axis: any) {
    context.beginPath();
    context.moveTo(0, 40);
    context.bezierCurveTo(-60, 20, -10, -60, 0, -20);
    context.bezierCurveTo(10, -60, 60, 20, 0, 40);
    context.fill();

    for (var i = -4; i < 4; i++) {
      context.beginPath();
      context.moveTo(0, 40);
      context.quadraticCurveTo(i * 12, 10, i * 4, -24 + Math.abs(i) * 2);
      context.stroke();
    }
  }
  render(context: CanvasRenderingContext2D) {
    var axis = this.getAxis();

    if (axis.y == this.thresholdY && this.rippleCount < this.MAX_RIPPLE_COUNT) {
      context.save();
      context.lineWidth = 2;
      context.strokeStyle = 'hsla(0, 0%, 100%, ' + (this.MAX_RIPPLE_COUNT - this.rippleCount) / this.MAX_RIPPLE_COUNT + ')';
      context.translate(axis.x + this.offsetY * axis.rate * (this.theta <= Math.PI ? -1 : 1), axis.y);
      context.scale(1, 0.3);
      context.beginPath();
      context.arc(0, 0, this.rippleCount / this.MAX_RIPPLE_COUNT * this.RIPPLE_RADIUS * axis.rate, 0, Math.PI * 2, false);
      context.stroke();
      context.restore();
      this.rippleCount++;
    }
    if (axis.y < this.thresholdY || (!this.endTheta || !this.endPhi)) {
      if (this.y <= 0) {
        this.opacity = Math.min(this.opacity + 0.01, 1);
      }
      context.save();
      context.globalAlpha = this.opacity;
      context.fillStyle = this.shadowColor;
      context.strokeStyle = 'hsl(330, 30%,' + 40 * (0.3 + axis.rate) + '%)';
      context.translate(axis.x, Math.max(axis.y, this.thresholdY + this.thresholdY - axis.y));
      context.rotate(Math.PI - this.theta);
      context.scale(axis.rate * -Math.sin(this.phi), axis.rate);
      context.translate(0, this.offsetY);
      this.renderCherry(context, axis);
      context.restore();
    }
    context.save();
    context.fillStyle = this.entityColor;
    context.strokeStyle = 'hsl(330, 40%,' + 70 * (0.3 + axis.rate) + '%)';
    context.translate(axis.x, axis.y + Math.abs(this.SINK_OFFSET * Math.sin(this.psi) * axis.rate));
    context.rotate(this.theta);
    context.scale(axis.rate * Math.sin(this.phi), axis.rate);
    context.translate(0, this.offsetY);
    this.renderCherry(context, axis);
    context.restore();

    if (this.y <= -this.renderer.height / 4) {
      if (!this.endTheta) {
        for (var theta = Math.PI / 2, end = Math.PI * 3 / 2; theta <= end; theta += Math.PI) {
          if (this.theta < theta && this.theta + Math.PI / 200 > theta) {
            this.theta = theta;
            this.endTheta = true;
            break;
          }
        }
      }
      if (!this.endPhi) {
        for (var phi = Math.PI / 8, end = Math.PI * 7 / 8; phi <= end; phi += Math.PI * 3 / 4) {
          if (this.phi < phi && this.phi + Math.PI / 200 > phi) {
            this.phi = Math.PI / 8;
            this.endPhi = true;
            break;
          }
        }
      }
    }
    if (!this.endTheta) {
      if (axis.y == this.thresholdY) {
        this.theta += Math.PI / 200 * ((this.theta < Math.PI / 2 || (this.theta >= Math.PI && this.theta < Math.PI * 3 / 2)) ? 1 : -1);
      } else {
        this.theta += Math.PI / 500;
      }
      this.theta %= Math.PI * 2;
    }
    if (this.endPhi) {
      if (this.rippleCount == this.MAX_RIPPLE_COUNT) {
        this.psi += this.dpsi;
        this.psi %= Math.PI * 2;
      }
    } else {
      this.phi += Math.PI / ((axis.y == this.thresholdY) ? 200 : 500);
      this.phi %= Math.PI;
    }
    if (this.y <= -this.renderer.height * this.SURFACE_RATE) {
      this.x += 2;
      this.y = -this.renderer.height * this.SURFACE_RATE;
    } else {
      this.x += this.vx;
      this.y += this.vy;
    }
    return this.z > -this.FOCUS_POSITION && this.z < this.FAR_LIMIT && this.x < this.renderer.width * 1.5;
  }
}
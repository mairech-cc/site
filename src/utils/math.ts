export class Vec2 {
  public constructor(public x: number, public y: number) { }

  public add(vec: Vec2) {
    return new Vec2(this.x + vec.x, this.y + vec.y);
  }

  public sub(vec: Vec2) {
    return new Vec2(this.x - vec.x, this.y - vec.y);
  }

  public scale(vec: Vec2) {
    return new Vec2(this.x * vec.x, this.y * vec.y);
  }
}

export function clamp(x: number, a: number, b: number) {
  return Math.max(Math.min(x, Math.max(a, b)), Math.min(a, b));
}

export function diff(a: number, b: number) {
  return Math.abs(Math.max(a, b) - Math.min(a, b));
}

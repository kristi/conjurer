import { Vector3 } from "three";
import { clamp } from "three/src/math/MathUtils";

// This cosine-based palette creates a continuous spectrum of color given 4 vec3 params
// https://iquilezles.org/articles/palettes/
export class Palette {
  a: Vector3;
  b: Vector3;
  c: Vector3;
  d: Vector3;
  colorOut = new Vector3();

  constructor(a: Vector3, b: Vector3, c: Vector3, d: Vector3) {
    this.a = new Vector3(a.x, a.y, a.z);
    this.b = new Vector3(b.x, b.y, b.z);
    this.c = new Vector3(c.x, c.y, c.z);
    this.d = new Vector3(d.x, d.y, d.z);
  }

  colorAt = (t: number): Vector3 => {
    const r = clamp(
      this.a.x + this.b.x * Math.cos(2 * Math.PI * (this.c.x * t + this.d.x)),
      0,
      1
    );
    const g = clamp(
      this.a.y + this.b.y * Math.cos(2 * Math.PI * (this.c.y * t + this.d.y)),
      0,
      1
    );
    const b = clamp(
      this.a.z + this.b.z * Math.cos(2 * Math.PI * (this.c.z * t + this.d.z)),
      0,
      1
    );
    this.colorOut.set(r, g, b);
    return this.colorOut;
  };

  randomize = () => {
    this.a.set(Math.random(), Math.random(), Math.random());
    this.b.set(Math.random(), Math.random(), Math.random());
    this.c.set(Math.random(), Math.random(), Math.random());
    this.d.set(Math.random(), Math.random(), Math.random());
  };

  clone = () =>
    new Palette(this.a.clone(), this.b.clone(), this.c.clone(), this.d.clone());

  serialize = () => ({
    a: this.a.toArray(),
    b: this.b.toArray(),
    c: this.c.toArray(),
    d: this.d.toArray(),
  });

  toConstructorString = () =>
    `new Palette(new Vector3(${this.a.x}, ${this.a.y}, ${this.a.z}), new Vector3(${this.b.x}, ${this.b.y}, ${this.b.z}), new Vector3(${this.c.x}, ${this.c.y}, ${this.c.z}), new Vector3(${this.d.x}, ${this.d.y}, ${this.d.z}))`;

  static default = () =>
    new Palette(
      new Vector3(0.387, 0.8, 0.435),
      new Vector3(0.8, 0.392, 0.071),
      new Vector3(1.497, 1.219, 1.176),
      new Vector3(3.613, 5.485, 0.773)
    );
}

export const isPalette = (obj: any): obj is Palette =>
  obj.a !== undefined &&
  obj.b !== undefined &&
  obj.c !== undefined &&
  obj.d !== undefined;

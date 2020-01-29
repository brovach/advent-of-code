import * as fs from 'fs';

interface Point {
  x: number;
  y: number;
}

class Vector {
  public readonly p: Point;
  public readonly q: Point;

  private readonly max_x: number;
  private readonly min_x: number;
  private readonly max_y: number;
  private readonly min_y: number;

  public constructor(p: Point, q: Point) {
    this.p = p;
    this.q = q;

    this.max_x = Math.max(this.p.x, this.q.x);
    this.min_x = Math.min(this.p.x, this.q.x);
    this.max_y = Math.max(this.p.y, this.q.y);
    this.min_y = Math.min(this.p.y, this.q.y);
  }

  public get A(): number {
    return this.q.y - this.p.y;
  }

  public get B(): number {
    return this.q.x - this.p.x;
  }

  public get C(): number {
    return this.A * this.p.x + this.B * this.p.y;
  }

  public get length(): number {
    return this.max_x - this.min_x + this.max_y - this.min_y;
  }

  public hasPoint(point: Point): boolean {
    if (
      point.x < this.min_x ||
      point.x > this.max_x ||
      point.y < this.min_y ||
      point.y > this.max_y
    ) {
      return false;
    }

    return true;
  }

  public static getIntersectionPoint(v1: Vector, v2: Vector): Point {
    const denominator: number = v1.A * v2.B - v2.A * v1.B;

    if (denominator === 0) {
      return null;
    }

    const x: number = (v2.B * v1.C - v1.B * v2.C) / denominator;
    const y: number = (v1.A * v2.C - v2.A * v1.C) / denominator;

    return { x: x, y: y } as Point;
  }
}

const getDistance = (p: Point, q: Point): number => {
  return Math.abs(p.x - q.x) + Math.abs(p.y - q.y);
};

const getVectors = (currentPoint: Point, changes: string[]): Vector[] => {
  const vectors: Vector[] = [];

  for (let i: number = 0; i < changes.length; i++) {
    const change: string = changes[i];
    const direction: string = change.slice(0, 1);
    const magnitude: number = Number(change.slice(1));
    const targetPoint: Point = { ...currentPoint };

    switch (direction) {
      case 'U':
        targetPoint.y += magnitude;
        break;
      case 'D':
        targetPoint.y -= magnitude;
        break;
      case 'L':
        targetPoint.x -= magnitude;
        break;
      case 'R':
        targetPoint.x += magnitude;
        break;
    }

    vectors.push(new Vector({ ...currentPoint }, targetPoint));

    currentPoint = targetPoint;
  }

  return vectors;
};

const input: string = fs.readFileSync('./input.txt', 'utf8');

console.time('exec');
const point0: Point = { x: 0, y: 0 } as Point;

// convert the input into vectors
const instructions: string[][] = input
  .split('\n')
  .map((path: string) => path.split(','));
const wire1: Vector[] = getVectors({ ...point0 }, instructions[0]);
const wire2: Vector[] = getVectors({ ...point0 }, instructions[1]);

let shortestDistance: number = Number.MAX_SAFE_INTEGER;
let shortestPath: number = Number.MAX_SAFE_INTEGER;

for (let i: number = 0; i < wire1.length; i++) {
  const v1: Vector = wire1[i];

  for (let j: number = 0; j < wire2.length; j++) {
    const v2: Vector = wire2[j];
    const ip: Point = Vector.getIntersectionPoint(v1, v2);

    if (ip && v1.hasPoint(ip) && v2.hasPoint(ip)) {
      const distance: number = getDistance(point0, ip);

      // ignore intersection at origin
      if (distance === 0) {
        continue;
      }
      const wire1Length: number = wire1
        .slice(0, i)
        .reduce((sum: number, v: Vector) => (sum += v.length), 0);
      const wire2Length: number = wire2
        .slice(0, j)
        .reduce((sum: number, v: Vector) => (sum += v.length), 0);

      const currentPath =
        wire1Length +
        wire2Length +
        getDistance(v1.p, ip) +
        getDistance(v2.p, ip);

      if (currentPath < shortestPath) {
        shortestPath = currentPath;
      }

      if (distance < shortestDistance) {
        shortestDistance = distance;
      }
    }
  }
}
console.timeEnd('exec');

console.log('distance to closest intersection', shortestDistance);
console.log('steps to first intersection', shortestPath);

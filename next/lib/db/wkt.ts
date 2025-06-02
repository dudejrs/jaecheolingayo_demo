export interface Point {
  x: number;
  y: number;
}

export const WktTransformer = {
  to: (point: Point | null): string | null => {
    if (!point) return null;
    return `POINT(${point.x} ${point.y})`;
  },
  from: (wkt: string | null): Point | null => {
    if (!wkt) return null;
    const match = wkt.match(/^POINT\(\s*(-?\d+(\.\d+)?)\s+(-?\d+(\.\d+)?)\s*\)$/);
    if (!match) return null;
    return {
      x: parseFloat(match[1]),
      y: parseFloat(match[3]),
    };
  },
};

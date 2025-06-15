import {useState, useEffect} from "react";


interface Point {
	x : number,
	y : number,
}

function getDistance(p1: Point, p2: Point) {
	return Math.hypot(p2.x - p1.x, p2.y - p1.y)
}

function getNormal(p1: Point, p2: Point) {
	const dx = p2.x - p1.x 
	const dy = p2.y - p1.y 
	const len = Math.hypot(dx, dy)

	return {
		x : -dy / len,
		y : dx / len
	}
}

function subdivideLongSegments(points: Point[], maxRatio = 5): Point[] {
	const newPts: Point[] = [];
	const n = points.length;
	for (let i = 0; i < n; i++) {
		const a = points[i];
		const b = points[(i + 1) % n];
		newPts.push(a);
		
		const dAB = getDistance(a, b);
		const prev = points[(i - 1 + n) % n];
		
		const minPrev = getDistance(prev, a);
		const minNext = getDistance(b, points[(i + 2) % n]);
		const minNeighbor = Math.min(minPrev, minNext);
		
		if (dAB > minNeighbor * maxRatio) {
			newPts.push({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
		}
	}

	return newPts;
}


function offsetPoints (points: Point[], offset :number){
	const offsetPoints : Point[] = [];

	for (let i = 0; i < points.length; i++) {
		const prev = points[i - 1] || points[i];
		const next = points[i + 1] || points[i];

		const normal = getNormal(prev, next);
		const offsetPoint = {
			x : points[i].x + normal.x * offset,
			y : points[i].y + normal.y * offset
		}

		offsetPoints.push(offsetPoint)
	}

	return offsetPoints
}

function catmullRomSpline(points : Point[]) {
	const n = points.length 
	if (n < 2) return "";

	points = [points[n-2], points[n-1], ...points, points[0], points[1]]
	const alpha = 0.5;
	const tensions = [0];
	for (let i = 1; i < points.length; i++) {
		const dx = points[i].x - points[i - 1].x;
		const dy = points[i].y - points[i - 1].y;

		tensions[i] = tensions[i - 1] + Math.pow(dx * dx + dy* dy, alpha / 2);
	}

	const path = [`M ${points[2].x},${points[2].y}`];

	for (let i = 2; i < points.length - 2; i++) {
		const p0 = points[i - 2];
		const p1 = points[i - 1];
		const p2 = points[i];
		const p3 = points[i + 1];

		const t0 = tensions[i - 2];
		const t1 = tensions[i - 1];
		const t2 = tensions[i];
		const t3 = tensions[i + 1];

		const m1x = (p2.x - p0.x) / (t2 - t0);
		const m1y = (p2.y - p0.y) / (t2 - t0);
		const m2x = (p3.x - p1.x) / (t3 - t1);
		const m2y = (p3.y - p1.y) / (t3 - t1)

		const cp1x = p1.x + (t2 - t1) / 3 * m1x;
		const cp1y = p1.y + (t2 - t1) / 3 * m1y;
		const cp2x = p2.x - (t2 - t1) / 3 * m2x;
		const cp2y = p2.y - (t2 - t1) / 3 * m2y;

		path.push(`C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`);
	}
	return path.join(" ") + " Z";
}

function catmullRomClosedBezier(points: Point[], alpha = 0.5) {
  const n = points.length;
  if (n < 2) return "";

  const pts: Point[] = [
    points[n - 2], points[n - 1],
    ...points,
    points[0], points[1],
    points[2] 
  ];

  const getT = (t: number, p: Point, q: Point) =>
    t + Math.pow(getDistance(p, q), alpha);

  const t: number[] = [0];
  for (let i = 1; i < pts.length; i++) {
    t.push(getT(t[i - 1], pts[i - 1], pts[i]));
  }

  let d = `M ${pts[2].x},${pts[2].y}`;

  for (let i = 2; i < pts.length - 3; i++) {
    const p0 = pts[i - 1], p1 = pts[i],
          p2 = pts[i + 1], p3 = pts[i + 2];

    const t0 = t[i - 1], t1 = t[i],
          t2 = t[i + 1], t3 = t[i + 2];

    const m1 = {
      x: (p2.x - p0.x) / (t2 - t0),
      y: (p2.y - p0.y) / (t2 - t0),
    };
    const m2 = {
      x: (p3.x - p1.x) / (t3 - t1),
      y: (p3.y - p1.y) / (t3 - t1),
    };

    const dt = (t2 - t1) / 3;
    const cp1 = { x: p1.x + m1.x * dt, y: p1.y + m1.y * dt };
    const cp2 = { x: p2.x - m2.x * dt, y: p2.y - m2.y * dt };

    d += ` C ${cp1.x},${cp1.y} ${cp2.x},${cp2.y} ${p2.x},${p2.y}`;
  }

  return d + " Z";
}


interface OutlineProps {
	points: Point[],
	offset: number,
	fill? : string
}

export default function Outline({
	points,
	offset,
	fill= "none",
} : OutlineProps) {
	const calcPath = () => {
		const subdiv = subdivideLongSegments(points)
		const offsetPts = offsetPoints(subdiv, offset)
		return catmullRomClosedBezier(offsetPts, 0.5)
	}

	const [path, setPath] = useState(calcPath())

	useEffect(()=>{
		setPath(calcPath())
	}, [points, offset])


	return (
		<path d={path} fill={fill} strokeWidth={20} opacity={0.3} />
		)
}
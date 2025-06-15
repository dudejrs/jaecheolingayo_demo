
interface Coord {
	x: number,
	y: number
}
type Line = [Coord, Coord]
type Triangle = [Coord, Coord, Coord]

function isOnCounterClockWise(line: Line, c: Coord) {
	const [a, b] = line

	return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x- a.x) 
}

function vector(p1: Coord, p2: Coord) {
	return {
		x: p2.x - p1.x,
		y: p2.y - p1.y
	}
}

function isInTriangle(t: Triangle, p: Coord) {
	const [t1, t2, t3] = t 

	const v1 = vector(t1, t2)
	const v2 = vector(t1, t3)
	const k = vector(t1, p)

	const alpha = (v2.x * k.y - v2.y * k.x) / (v2.x * v1.y - v2.y * v1.x)
	const beta = (v1.x * k.y - v1.y * k.x) / (v1.x * v2.y - v1.y * v2.x)

	if (alpha < 0 || alpha > 1) {
		return false
	}

	if (beta < 0 || beta > 1) {
		return false
	}

	if (alpha + beta  > 1) {
		return false
	}

	return true
}	

function getDistance(line: Line, r: Coord) {
	const [p, q] = line
	const a = p.y - q.y 
	const b = q.x - p.x
	const c = p.x * (q.y - p.y) - p.y * (q.x - p.x)


	return Math.abs(a * r.x + b * r.y + c) / Math.sqrt(a * a + b * b)
}

function classify(line: Line, coords: Coord[]): [Coord[], Coord[]] {
	const clockWise = []
	const counterClockWise = []

	for (const coord of coords) {
		if (isOnCounterClockWise(line, coord)) {
			counterClockWise.push(coord)
		} else {
			clockWise.push(coord)
		}
	}

	return [clockWise, counterClockWise]
}

function popMaximumDistance(line: Line, coords: Coord[]): [Coord, Coord[]] {
	let maximumDistance = 0
	let cur = 0

	for (let i = 0; i < coords.length; i++) {
		const distance = getDistance(line, coords[i])

		if (maximumDistance < distance) {
			cur = i;
			maximumDistance = distance;
		}
	}

	const result = coords[cur]
	const newCoords = coords.slice(0, cur).concat(coords.slice(cur + 1))

	return [result, newCoords]
}

function findHull(line: Line, coords: Coord []) {
	if (coords.length < 2)  {
		return coords
	}

	coords = coords.slice()

	const [p, newCoords] = popMaximumDistance(line, coords);
	const result = [p]
	const triangle : Triangle = [p, line[0], line[1]]
	const filteredCoords : Coord[] = newCoords.filter(coord => !isInTriangle(triangle, coord)); 

	const newLine : Line = [p, line[0]]
	const [clockWise, counterClockWise] = classify(newLine, filteredCoords)

	result.push(...findHull(newLine, clockWise))
	result.push(...findHull(newLine, counterClockWise))

	return result
}


export function quickHull(coords: Coord[]) : Coord[] {
	if (coords.length <= 3) {
		return coords.slice()
	}

	coords = coords.slice()

	coords.sort((c1, c2) => {
		if (c1.x !== c2.x) {
			return c1.x - c2.x;
		}
		return c1.y - c2.y;
	}); 
	
	const min = coords.shift()!
	const max = coords.pop()!
	const line: Line = [min, max]

	const result : Coord[] = [min, max]

	const [clockWise, counterClockWise] = classify(line, coords)

	result.push(...findHull(line, clockWise))
	result.push(...findHull(line, counterClockWise))

	const hull = result 
	const center = hull.reduce((a, p) => ({ x: a.x + p.x, y: a.y + p.y }), { x: 0, y: 0 });

	center.x /= hull.length;
	center.y /= hull.length;

	hull.sort((p, q) =>
		Math.atan2(p.y - center.y, p.x - center.x) -
		Math.atan2(q.y - center.y, q.x - center.x)
	);

	return hull
}
const lerpFunc = (start: number, end: number, t: number) => start + (end - start) * t; 

export class Point{
	readonly x: number;
	readonly y: number;

	constructor(x: number, y: number) {
		this.x = x
		this.y = y
	}

	midPointOf(ratio : Ratio) : Point {
		const newX = this.x + ratio.width / 2
		const newY = this.y + ratio.height / 2

		return new Point(newX, newY)
	}

	plusRatio(ratio: Ratio) {
		const newX = this.x + ratio.width 
		const newY = this.y + ratio.height

		return new Point(newX, newY)
	}

	minus(p: Point) {
		const newX = this.x - p.x 
		const newY = this.y - p.y

		return new Point(newX, newY)
	}

	minusRatio(ratio: Ratio) {
		const newX = this.x - ratio.width 
		const newY = this.y - ratio.height

		return new Point(newX, newY)
	}

	clamped(min: Point, max: Point) {
		const clampedX = Math.min(Math.max(this.x, min.x), max.x)
		const clampedY = Math.min(Math.max(this.y, min.y), max.y)

		return new Point(clampedX, clampedY);
	}

	convert(realRatio: Ratio, ratio: Ratio, base: Point ) {
		const newX = (this.x / realRatio.width) * ratio.width + base.x;
		const newY = (this.y / realRatio.height) * ratio.height + base.y

		return new Point(newX, newY)
	}

	lerp(t: number, target: Point): Point {
		

		const newX = lerpFunc(this.x, target.x, t)
		const newY = lerpFunc(this.y, target.y, t)

		return new Point(newX, newY)
	}

	get xAxisReflected() {
		const newX = - this.x
		const newY = this.y

		return new Point(newX, newY);
	}

	get distanceFromOrigin() {
		return Math.sqrt(this.x * this.x + this.y * this.y)
	}
}

export class Ratio {
	static MAXIMUM = new Ratio(720000, 720000)
	static MINIMUM = new Ratio(50000, 50000)

	readonly width:  number;
	readonly height:  number;

	constructor(width: number, height: number) {
		this.width = width 
		this.height = height
	}

	static create(baseRatio: Ratio, width: number, height: number) {
		if (width == height) {
			return baseRatio
		}

		if (width > height) {
			const newWidth = baseRatio.width 
			const newHeight = baseRatio.width * height / width 

			return new Ratio(newWidth, newHeight)
		} 

		const newWidth = baseRatio.height * width / height
		const newHeight = baseRatio.height

		return new Ratio(newWidth, newHeight)
	}

	originPointOf(midPoint : Point) : Point {
		const newX = midPoint.x - (this.width / 2)
		const newY = midPoint.y - (this.height / 2)


		return new Point(newX, newY)
	}

	invertY(p: Point) : Point {
		const newX = p.x
		const newY = this.height - p.y

		return new Point(newX, newY)
	}

	scale(r: number) : Ratio {
		const newWidth = this.width * r
		const newHeight = this.height * r

		const clampedWidth = Math.min(
		Math.max(newWidth, Ratio.MINIMUM.width),
			Ratio.MAXIMUM.width
		);
		const clampedHeight = Math.min(
			Math.max(newHeight, Ratio.MINIMUM.height),
			Ratio.MAXIMUM.height
		);

		const originalAspect = this.width / this.height;
		const clampedAspect = clampedWidth / clampedHeight;

		if (originalAspect > clampedAspect) {
			return new Ratio(clampedHeight * originalAspect, clampedHeight);
		} else {
			return new Ratio(clampedWidth, clampedWidth / originalAspect);
		}
	}

	lerp(t: number, target: Ratio): Ratio {
		const newWidth = lerpFunc(this.width, target.width, t)
		const newHeight = lerpFunc(this.height, target.height, t)

		return new Ratio(newWidth, newHeight)
	}

	get min() {
		return this.width < this.height ? this.width : this.height
	}

	get k() {
		return 720000 * 10 / this.min
	}
}

export type Px = `${number}px` | `${number}.${number}px`
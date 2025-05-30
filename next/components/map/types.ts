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

	minus(p: Point) {
		const newX = this.x - p.x 
		const newY = this.y - p.y

		return new Point(newX, newY)
	}

	convert(realRatio: Ratio, ratio: Ratio, base: Point ) {
		const newX = (this.x / realRatio.width) * ratio.width + base.x;
		const newY = (this.y / realRatio.height) * ratio.height + base.y

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
			const new_width = baseRatio.width 
			const new_height = baseRatio.width * height / width 

			return new Ratio(new_width, new_height)
		} 

		const new_width = baseRatio.height * width / height
		const new_height = baseRatio.height

		return new Ratio(new_width, new_height)
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
		const new_width = this.width * r
		const new_height = this.height * r

		const clamped_width = Math.min(
		Math.max(new_width, Ratio.MINIMUM.width),
			Ratio.MAXIMUM.width
		);
		const clamped_height = Math.min(
			Math.max(new_height, Ratio.MINIMUM.height),
			Ratio.MAXIMUM.height
		);

		const original_aspect = this.width / this.height;
		const clamped_aspect = clamped_width / clamped_height;

		if (original_aspect > clamped_aspect) {
			return new Ratio(clamped_height * original_aspect, clamped_height);
		} else {
			return new Ratio(clamped_width, clamped_width / original_aspect);
		}
	}

	get min() {
		return this.width < this.height ? this.width : this.height
	}
}

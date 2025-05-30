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
}

export class Ratio {
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

		console.log (newX, newY)

		return new Point(newX, newY)
	}

	invertY(p: Point) : Point {
		const newX = p.x
		const newY = this.height - p.y

		return new Point(newX, newY)
	}

	get min() {
		return this.width < this.height ? this.width : this.height
	}
}

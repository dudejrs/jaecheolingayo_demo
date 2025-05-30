
export type Point = [number, number]
export type Polygon = Point[]
export type MultiPolygon = Polygon[] 
export interface Geometry {
	type: string;
	coordinates: MultiPolygon[];
}
export type Path = string
export type CoordPorjection = (coord: Point) => Point

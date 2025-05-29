'use client';

import {useEffect, useState} from 'react';


type Point = [number, number]
type Polygon = Point[]
type MultiPolygon = Polygon[] 
interface Geometry {
	type: string;
	coordinates: MultiPolygon[];
}
type Path = string

// viewBox="915000 1870000 80000 90000"
const [MIN_X, MIN_Y] : Point = [800000, 1470000]
const [MAP_WIDTH, MAP_HEIGHT] : Point = [640000, 720000]

function multiPolygonToPath(multiPolygonCoords: MultiPolygon[], proj: (coord: Point) => Point = ([x, y]) => [x, y]): Path {
  let path = '';

  multiPolygonCoords.forEach((multiPolygon : Polygon[]) => {
    multiPolygon.forEach((ring: Polygon) => {
      ring.forEach((coord: Point, i: number) => {
        const [x, y] = proj(coord);
        path += (i === 0 ? 'M' : 'L') + x.toFixed(2) + ' ' + y.toFixed(2);
      });
      path += ' Z '; 
    });
  });

  return path.trim();
}

function epsg5179ToSvg([x, y]: Point) : Point {
  return [x, y];
}

const forEachProvince= ({geometry}: {geometry: Geometry}): Path[] => {
	const result: Path[] = [];

	if (geometry.type === 'MultiPolygon') {
		const d = multiPolygonToPath(geometry.coordinates, epsg5179ToSvg);
		result.push(d);
	}
	return result
}


export default function Test() {
	const [paths, setPaths] = useState<Path[]>([]);

	useEffect(()=>{
		fetch('/data/boundaries.json')
			.then(res => res.json())
			.then(res => {
				console.log(res)
				return res
			})
			.then(res => res.map(forEachProvince))
			.then(setPaths)
			.catch((err) => console.error('GeoJSON load error:', err));
	},[])

	return (
		<div>
			<svg fill="white" width="800" height="600" viewBox={`${MIN_X} ${MIN_Y} ${MAP_WIDTH} ${MAP_HEIGHT}`} xmlns="http://www.w3.org/2000/svg"
				style={{ transform: 'scaleY(-1)' }}>
			  <g id="regions" fill="red" stroke="white" strokeWidth="10000">
			  	{paths.map((d, idx) => (
			  		<path
			  			key={idx}
			  			d={d}
			  			fill="white"
			  			stroke="blue"
			  			strokeWidth={1000}
			  			onClick={() => alert(`Path ${idx + 1} clicked`)}
			  			style={{ cursor: 'pointer' }}
			  			/>
	  			))}
			  </g>
			</svg>

		</div>

		);
}
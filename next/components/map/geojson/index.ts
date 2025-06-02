import {useState, useEffect} from 'react'
import {MultiPolygon, CoordPorjection, Geometry, Path, Point, Polygon} from './types'

export function multiPolygonToPath(multiPolygonCoords: MultiPolygon[], proj: CoordPorjection = ([x, y]) => [x, y]): Path {
  let path = '';

  multiPolygonCoords.forEach((multiPolygon : Polygon[]) => {
    multiPolygon.forEach((polygon: Polygon) => {
      polygon.forEach((coord: Point, i: number) => {
        const [x, y] = proj(coord);
        path += (i === 0 ? 'M' : 'L') + x.toFixed(2) + ' ' + y.toFixed(2);
      });
      path += ' Z '; 
    });
  });

  return path.trim();
}

export const GeoJsonToPaths= ({geometry}: {geometry: Geometry}): Path[] => {
	const result: Path[] = [];

	if (geometry.type === 'MultiPolygon') {
		const d = multiPolygonToPath(geometry.coordinates);
		result.push(d);
	}
	return result
}

export function useGeoJson(url: string, shouldFetch: boolean = true): Path[] {
  const [paths, setPaths] = useState<Path[]>([]);

  useEffect(() => {
    if (!shouldFetch) {
      return 
    }
    
    fetch(url)
      .then(res => res.json())
      .then(json => json.map(GeoJsonToPaths))
      .then(setPaths)
      .catch(console.error);
  }, [url, shouldFetch]);

  return paths;
}

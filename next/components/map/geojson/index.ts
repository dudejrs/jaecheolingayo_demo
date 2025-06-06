import {useState, useEffect} from 'react'
import {MultiPolygon, CoordPorjection, Geometry, Path, PathInformation, Point, Polygon} from './types'

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

export const geometryToPaths= (geometry: Geometry, baseX: number, baseY: number, width: number, height: number): Path => {
	if (geometry.type === 'MultiPolygon') {
		return multiPolygonToPath(geometry.coordinates, mapCoordianation(baseX, baseY, width, height));
		
	}
	return ''
}

export function geoJsonToPathInformation (baseX : number, baseY: number, width: number, height:number) {

  return function ({geometry, properties} : {geometry: Geometry, properties: {[property: string] : string}})
     : PathInformation {

    const path = geometryToPaths(geometry, baseX, baseY, width, height);

    return {
      path: path,
      ...properties
    }
  } 
}

export function mapCoordianation(baseX: number, baseY: number, width: number, height : number ) {
  return function ([x, y] : Point) : Point {
    return [x - baseX, baseY + height - y]
  }
}

export function useGeoJson(url: string, baseX: number, baseY: number, width: number, height: number, shouldFetch: boolean = true): PathInformation[] {
  const [pathInformations, setPathInformations] = useState<PathInformation[]>([]);

  useEffect(() => {
    if (!shouldFetch) {
      return 
    }
    
    fetch(url)
      .then(res => res.json())
      .then(json => json.map(geoJsonToPathInformation(baseX, baseY, width, height)))
      .then(setPathInformations)
      .catch(console.error);

  }, [url, shouldFetch]);

  return pathInformations;
}

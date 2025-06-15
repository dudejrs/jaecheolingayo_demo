import proj4 from 'proj4';

const WGS84 = 'EPSG:4326';
const UTMK = 'EPSG:5179';

proj4.defs(UTMK, '+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +units=m +no_defs');


export interface LatLng {
	lon: number
	lat: number
}

export interface UTMKPoint {
	x: number 
	y: number
}

function randomInRange(min: number, max: number): number {
	return Math.random() * (max - min) + min;
}


export function generateRandomLatLng(min: LatLng, max: LatLng, count: number): LatLng[] {
	const arr: LatLng[] = [];

	for (let i = 0; i < count; i++) {
		arr.push({
			lon: randomInRange(min.lon, max.lon),
			lat: randomInRange(min.lat, max.lat)
		});
	}

	return arr;
}

export function generateRandomUTMK(min: LatLng, max: LatLng, count: number) : UTMKPoint[] {
	const latlngPoints = generateRandomLatLng(min, max, count);
	return latlngPoints.map(latLngToUTMK)
}


export function utmkToLatLng({x, y}: UTMKPoint): LatLng {
	const [lon, lat] = proj4(UTMK, WGS84, [x, y]);
	return {lon, lat};
}

export function latLngToUTMK({lon, lat}: LatLng): UTMKPoint {
	const [x, y] = proj4(WGS84, UTMK, [lon, lat]);
	return {x, y};
}
'use client';

import {Point, Ratio} from './types'
import Map from "./map";
import {useViewbox} from './hook';
import {StyleProps, MapProps} from "./map";



const DEFAULT_ORIGIN_POINT : Point = new Point(650000, 1430000)
const DEFAULT_RATIO : Ratio = new Ratio(720000, 720000)
const DEFAULT_MID_POINT : Point = DEFAULT_ORIGIN_POINT.midPointOf(DEFAULT_RATIO)


export default function DefaultMap({
	width = 600,
	height = 600,
	...props
}: MapProps){
	const {ratio, setRatio, base, setBase} = useViewbox(DEFAULT_RATIO, DEFAULT_ORIGIN_POINT, DEFAULT_MID_POINT, width, height);

	return (<Map ratio={ratio} setRatio={setRatio} base={base} setBase={setBase} {...props} />)
}
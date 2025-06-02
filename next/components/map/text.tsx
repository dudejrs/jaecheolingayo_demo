'use client'

import {useEffect, useState} from 'react'
import {StyleProps} from "./map";
import opentype from 'opentype.js'


interface textProps {
	text: number | string;
	x: number;
	y: number;
	size: number;
}

export default function Text({
	text,
	x, 
	y,
	size
} : textProps & StyleProps) {
	const [pathData, setPathData] = useState('');

	useEffect(()=> {
		opentype.load('/fonts/Roboto_Condensed-Bold.ttf', (err : Error | null, font) => {
			if (err || !font) {
				console.error(err || "font를 불러올 수 없습니다.");
				return;
			}
			const textWidth = font.getAdvanceWidth(`${text}`, size);
			const scale = size / font.unitsPerEm;
      		const ascent = font.ascender * scale;
      		const descent = Math.abs(font.descender * scale);
      		const height = ascent + descent;
      		const textHeight = height/2 - descent
			const path = font.getPath(`${text}`, -textWidth/2, textHeight, size);
			const d = path.toPathData(2);
			setPathData(d);
		})
	})


	return (
		<g transform={`translate(${x}, ${y}) scale(1, -1)`}>
			{
				pathData && <path d={pathData} fill="white" stroke="blue"/>
			}
		</g>
		);
}


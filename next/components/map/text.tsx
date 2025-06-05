'use client'

import {useMemo} from 'react'
import {StyleProps} from "./map";
import opentype from 'opentype.js'


interface textProps {
	text: number | string;
	font: opentype.Font
	x: number;
	y: number;
	size: number;
}

export default function Text({
	text,
	font,
	x, 
	y,
	size
} : textProps & StyleProps) {
	const pathData = useMemo(() => {
	    const textWidth = font.getAdvanceWidth(`${text}`, size);
	    const scale = size / font.unitsPerEm;
	    const ascent = font.ascender * scale;
	    const descent = Math.abs(font.descender * scale);
	    const height = ascent + descent;
	    const textHeight = height / 2 - descent;
	    const path = font.getPath(`${text}`, -textWidth / 2, textHeight , size);
	    return path.toPathData(2);
	  }, [text, size, font]);

	return (
		<g transform={`translate(${x}, ${y})`}>
			{
				pathData && <path d={pathData} fill="white" stroke="blue"/>
			}
		</g>
		);
}


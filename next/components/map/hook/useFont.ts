import {useState, useEffect} from 'react'

import opentype from 'opentype.js';

const loadFont = (url: string): Promise<opentype.Font> => {
  return new Promise((resolve, reject) => {
    opentype.load(url, (err, font) => {
      if (err || !font) {
        reject(err || new Error('폰트를 불러올 수 없습니다.'));
      } else {
        resolve(font);
      }
    });
  });
};

export default function useFont(){
	const [font, setFont] = useState<opentype.Font | null>(null);
	
	useEffect(() => {
	loadFont('/fonts/Roboto_Condensed-Bold.ttf')
	  .then((loadedFont) => setFont(loadedFont))
	  .catch((error) => console.error('폰트 로딩 오류:', error));
	}, []);

	return font;
}
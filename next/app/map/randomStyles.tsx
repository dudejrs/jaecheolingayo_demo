import {useState, useEffect} from 'react'

import {Map} from "@/components/map"

interface Style {
  [style: string] : number | string
}

const CTP_KOR_NM_LIST = ['서울특별시', '부산광역시', '대구광역시', '인천광역시', '광주광역시', '대전광역시', '울산광역시', '세종특별자치시', '경기도', '충청북도', '충청남도', '전라남도', '경상북도', '경상남도', '제주특별자치도', '강원특별자치도', '전북특별자치도'];
const SIG_FULL_NM_LIST =[
    "경상북도 청송군",
    "경상남도 하동군",
    "전라남도 화순군",
    "경상남도 사천시",
    "경상남도 밀양시",
    "전북특별자치도 김제시",
    "제주특별자치도 제주시",
    "충청남도 청양군",
    "경기도 광명시",
    "전라남도 나주시",
    "경상남도 함양군",
    "충청남도 보령시",
    "경기도 화성시",
    "강원특별자치도 평창군",
    "경상북도 칠곡군",
    "경기도 김포시",
    "인천광역시 강화군",
    "전라남도 무안군",
    "전라남도 고흥군",
    "경상북도 울진군",
    "경기도 오산시",
    "전라남도 장흥군",
    "강원특별자치도 양구군",
    "경상북도 청도군",
    "전북특별자치도 군산시",
    "충청북도 보은군",
    "경기도 의정부시",
    "충청남도 당진시",
    "강원특별자치도 원주시",
    "경상북도 영덕군",
    "충청북도 증평군",
    "충청북도 옥천군",
    "충청남도 예산군",
    "경상북도 고령군",
    "부산광역시 기장군",
    "경기도 여주시",
    "강원특별자치도 춘천시",
    "강원특별자치도 화천군",
    "경상북도 안동시",
    "강원특별자치도 속초시",
    "대구광역시 군위군",
    "충청북도 단양군",
    "전북특별자치도 익산시",
    "충청남도 홍성군",
    "경기도 구리시",
    "전라남도 강진군",
    "전라남도 보성군",
    "전라남도 순천시",
    "경상남도 김해시",
    "전라남도 구례군",
    "제주특별자치도 서귀포시",
    "전북특별자치도 진안군",
    "충청남도 부여군",
    "전북특별자치도 남원시",
    "전라남도 해남군",
    "경기도 가평군",
    "경상북도 울릉군",
    "전라남도 장성군",
    "강원특별자치도 횡성군",
    "경기도 이천시",
    "경기도 하남시",
    "전라남도 광양시",
    "경상남도 진주시",
    "경기도 평택시",
    "강원특별자치도 인제군",
    "경기도 남양주시",
    "경상남도 양산시",
    "경상남도 산청군",
    "충청남도 아산시",
    "경상남도 의령군",
    "충청북도 제천시",
    "전라남도 목포시",
    "충청북도 충주시",
    "경기도 광주시",
    "경기도 연천군",
    "충청북도 음성군",
    "경상북도 경주시",
    "강원특별자치도 홍천군",
    "전라남도 영암군",
    "강원특별자치도 양양군",
    "경기도 동두천시",
    "경상남도 합천군",
    "경상북도 예천군",
    "경상북도 성주군",
    "경상북도 영천시",
    "세종특별자치시",
    "전라남도 여수시",
    "강원특별자치도 강릉시",
    "전라남도 담양군",
    "전북특별자치도 부안군",
    "경기도 포천시",
    "전북특별자치도 무주군",
    "충청북도 괴산군",
    "강원특별자치도 영월군",
    "강원특별자치도 삼척시",
    "전라남도 완도군",
    "경상남도 거창군",
    "경상북도 구미시",
    "충청남도 논산시",
    "경상북도 봉화군",
    "경상남도 함안군",
    "전북특별자치도 완주군",
    "충청남도 서산시",
    "충청남도 금산군",
    "울산광역시 울주군",
    "경상북도 상주시",
    "강원특별자치도 철원군",
    "강원특별자치도 동해시",
    "경기도 파주시",
    "경기도 군포시",
    "경기도 양주시",
    "경기도 의왕시",
    "경기도 양평군",
    "충청남도 태안군",
    "전라남도 곡성군",
    "경상남도 거제시",
    "충청남도 계룡시",
    "경상북도 문경시",
    "대구광역시 달성군",
    "경상북도 경산시",
    "전라남도 신안군",
    "전북특별자치도 장수군",
    "경상남도 고성군",
    "경기도 시흥시",
    "경상북도 김천시",
    "전북특별자치도 정읍시",
    "전라남도 함평군",
    "전북특별자치도 순창군",
    "경기도 안성시",
    "강원특별자치도 정선군",
    "충청남도 서천군",
    "전라남도 영광군",
    "전라남도 진도군",
    "전북특별자치도 임실군",
    "경상북도 의성군",
    "강원특별자치도 태백시",
    "충청남도 공주시",
    "경기도 과천시",
    "경상남도 창녕군",
    "경상남도 통영시",
    "충청북도 진천군",
    "경상남도 남해군",
    "전북특별자치도 고창군",
    "충청북도 영동군",
    "인천광역시 옹진군",
    "경상북도 영주시",
    "강원특별자치도 고성군",
    "경상북도 영양군",
]

const colors = ["--pccs-red", "--pccs-red-orange", "--pccs-orange", "--pccs-yellow-orange", "--pccs-yellow", "--pccs-yellow-green", "--pccs-green", "--pccs-blue-green", "--pccs-cyan", "--pccs-blue", "--pccs-blue-purple", "--pccs-purple"]

function getRandomRegion(regions: string[], count : number) {
  const shuffled = [...regions]

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; 
  }

  return shuffled.slice(0, count); 
} 

function generateRandomStyle() {
	const randomColor = colors[Math.floor(Math.random() * colors.length)]
	return {
		fill: `var(${randomColor})`,
    fillOpacity: 0.5
	}
}

function generateRandomStyles() {
	const result: {[name: string] : Style} = {}
	const ctpNames = getRandomRegion(CTP_KOR_NM_LIST, Math.floor(Math.random() * 3) + 1)
  const sigNames = getRandomRegion(SIG_FULL_NM_LIST, Math.floor(Math.random() * 15) + 1)

	for (const name of ctpNames.concat(sigNames)) {
		result[name] = generateRandomStyle();
	}

	return result
}

export default function useRandomStyles() {
	const [styles, setStyles] = useState({})

	const setRandomStyles = () : void => {
		const randomStyles = generateRandomStyles()

		setStyles((prev) => {return {
			...prev,
			...randomStyles
		}
		})
	}

	return {styles, setStyles: setRandomStyles}
}
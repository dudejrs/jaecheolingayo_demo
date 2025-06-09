import type {NextApiRequest, NextApiResponse} from 'next'
import {getSellersbyIds} from '@/lib/db/seller'

type RawParams = {
  ids?: string,
  x?: string,
  y?: string
}
type Coord = {
  x: number 
  y: number
}

function distance(p1: Coord, p2: Coord) {
  return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
}

function parseNumberArray(ids?: string) {
  if (!ids) {
    return [];
  }
  return ids.split(",").map(parseFloat)
}

function parseParams({ids, x, y}: RawParams) {
  if (!ids) {
    throw Error("ids 쿼리 파라미터가 필요합니다.")
  }
  return {
    ids: parseNumberArray(ids),
    x: x? parseFloat(x) : undefined,
    y: y? parseFloat(y) : undefined,
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {ids, x, y} = parseParams(req.query);
  const sellers = await getSellersbyIds(ids);
  
  if (x && y) {
    res.status(200).json(({sellers : sellers.map(seller => ({...seller, distance : distance(seller.coord, {x, y})})
      )}
    ))
  }
  
  res.status(200).json({sellers})
}

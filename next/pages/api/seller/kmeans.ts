import type {NextApiRequest, NextApiResponse} from 'next'
import {getCoords, getCoordsNear} from '@/lib/db/seller'
import {kMeans} from '@/lib/clustering'

type Coord = {
  x: number 
  y: number
}

type Seller = {
  id: number 
  coord: Coord
}

type Params = {
  x: number
  y: number
  width: number
  height: number
  k: number,
  tags? : number[]
}

type RawParams = {
  x: string,
  y: string,
  width: string,
  height: string,
  k: string,
  tags: string
}

function distance(p1: Seller, p2: Seller) {
  const {coord: c1} = p1 
  const {coord: c2} = p2
  return Math.sqrt((c1.x - c2.x) ** 2 + (c1.y - c2.y) ** 2);
}

function average(sellers: Seller[]) {
  const averageX = sellers.reduce((sum, {coord}) => sum + coord.x, 0) / sellers.length
  const averageY = sellers.reduce((sum, {coord}) => sum + coord.y, 0) / sellers.length

  return {
    id: -1,
    coord : {
      x: averageX  ,
      y: averageY
    }
  } 
}

function createRandomGenerator(x: number, y: number, width: number, height: number) {
  return function* () {
    while (true) {
      yield {
        id : -1,
        coord: {
          x : x + Math.floor(Math.random() * width), 
          y : y + Math.floor(Math.random() * height)
        }
      } as Seller
    }
  }
}

function parseNumberArray(tags?: string) {
  if (!tags) {
    return [];
  }

  return tags.split(",").map(parseFloat)
}

function parseParams({x, y, width, height, k, tags} : Partial<RawParams>) : Params {
  if (!x || !y || !width || !height || !k) {
    throw Error("x, y, width, height, k 쿼리 파라미터가 필요합니다.")
  }

  return {
    x: parseFloat(x),
    y: parseFloat(y),
    width: parseFloat(width),
    height: parseFloat(height),
    k : parseFloat(k),
    tags : parseNumberArray(tags)
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {x, y, width, height, k, tags} = parseParams(req.query)
  const iter = 20
  const sellers = await getCoordsNear(x + width/2, y + height/2 , Math.min(width, height) * 0.8, tags)
  const randomGenerator = createRandomGenerator(x, y, width, height)
  const clusters = kMeans(sellers, k, iter, randomGenerator(), distance, average)
    .map(({centroid, data }) => {
      return {
        coord : centroid.coord, 
        data : {
          value : data.value,
          members: data.members.map(({id}) => id)
        }
      }
    })
  
  res.status(200).json({clusters});
}

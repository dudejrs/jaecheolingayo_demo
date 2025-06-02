import type {NextApiRequest, NextApiResponse} from 'next'
import {getCoords} from '@/lib/db/seller'

type Coord = {
  x: number 
  y: number
}

type Seller = {
  id: number 
  coord: Coord
}

function distance(seller: Seller, centroid: Coord) {
  const p : Coord = seller.coord
  return Math.sqrt((p.x - centroid.x) ** 2 + (p.y - centroid.y) ** 2);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // const {x, y, width, height} = req.query

  // const K = 10
  // const clusters = Array.from(({length: 100}), () => Math.floor(Math.random() * K))
  // const centroids = Array.from({length: K}, () => {
  //   return {
  //   "x" : x + Math.floor(Math.random() * width),
  //   "y" : y + Math.floor(Math.random() * height)
  //   }
  // })  

  const sellers = await getCoords()

  res.status(200).json({'groups ': sellers});
}

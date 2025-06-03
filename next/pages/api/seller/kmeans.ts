import type {NextApiRequest, NextApiResponse} from 'next'
import {getCoords, getCoordsNear} from '@/lib/db/seller'

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
  k: number
}

function distance(p1: Coord, p2: Coord) {
  return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
}

function parseParams({x, y, width, height, k} : Partial<{x: string, y: string, width: string, height: string, k: string}>) : Params {
  if (!x || !y || !width || !height || !k) {
    throw Error("x, y, width, height, k 쿼리 파라미터가 필요합니다.")
  }

  return {
    x: parseFloat(x),
    y: parseFloat(y),
    width: parseFloat(width),
    height: parseFloat(height),
    k : parseFloat(k)
  }
}

function assignClusters(sellers: Seller[], clusters: number[], centroids: Coord[]) {
  for (let i = 0; i < sellers.length; i++) {
    let minDistance = Infinity;
    let cur = 0;

    for (let j = 0; j < centroids.length; j++) {
      const d = distance(sellers[i].coord, centroids[j]) 
      if (d < minDistance) {
        minDistance = d;
        cur = j
      }
    }
    clusters[i] = cur
  }
}

function updateCentroids(sellers: Seller[], clusters: number[], centroids: Coord[]) {
  for (let i = 0; i < centroids.length; i++) {
    const clusteredCoords = clusters
      .map((nearest_centroid, j) : [number, Seller] => [nearest_centroid, sellers[j]])
      .filter(([nearest_centroid, _]) => nearest_centroid === i)
      .map(([nearest_centroid, seller]) => seller.coord)

    if (clusteredCoords.length === 0) {
      continue
    }

    const averageX = clusteredCoords.reduce((sum, coord) => sum + coord.x, 0) / clusteredCoords.length;
    const averageY = clusteredCoords.reduce((sum, coord) => sum + coord.y, 0) / clusteredCoords.length;

    centroids[i] = {
      x: averageX,
      y: averageY
    };
  }
}

function Kmeans(sellers: Seller[], k: number, iter: number, randomX: () => number, randomY : () => number ) {
  const clusters = Array.from(({length: sellers.length}), () => Math.floor(Math.random() * k))
  const centroids = Array.from({length: k}, () => {
    return {
    "x" : randomX(),
    "y" : randomY()
    }
  })

  for (let i = 0; i < iter; i++) {
    assignClusters(sellers, clusters, centroids)
    updateCentroids(sellers, clusters, centroids)
  }

  return centroids
  .map((coord, i)=> {
    return {
    coord: coord,
    data: clusters.reduce((count, nearest_centroid) => nearest_centroid === i ? count + 1 : count, 0)
    }
  })
  .filter(({data})=> data > 0);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {x, y, width, height, k} = parseParams(req.query)

  const iter = 20
  const sellers = await getCoordsNear(x + width/2, y + height/2 , Math.min(width, height) * 0.8)
  const clusters = Kmeans(sellers, k, iter, 
    () => x + Math.floor(Math.random() * width), 
    () => y + Math.floor(Math.random() * height)
  )
    
  res.status(200).json({clusters});
}

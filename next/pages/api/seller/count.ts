import type {NextApiRequest, NextApiResponse} from 'next'

import {getSellerCount} from "@/lib/db/seller"


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const count = await getSellerCount()
  res.status(200).json({'count' : count});
}

import type {NextApiRequest, NextApiResponse} from 'next'
import {getItemCount} from "@/lib/db/item"


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const count = await getItemCount()
  res.status(200).json({'count' : count});
}

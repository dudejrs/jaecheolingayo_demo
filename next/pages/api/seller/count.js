import {getSellerCount} from "../../../lib/db/seller"


export default async function handler(req, res) {
  const count = await getSellerCount()
  res.status(200).json({'count' : count});
}

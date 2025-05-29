import {getItemCount} from "../../../lib/db/item"


export default async function handler(req, res) {
  const count = await getItemCount()
  res.status(200).json({'count' : count});
}

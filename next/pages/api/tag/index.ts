import type {NextApiRequest, NextApiResponse} from 'next'
import {getTags} from '@/lib/db/tag'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const tags = await getTags();
	res.status(200).json({'tags': tags});
}

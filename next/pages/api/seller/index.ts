import type {NextApiRequest, NextApiResponse} from 'next'
import {getSellers} from '@/lib/db/seller'

interface RawParams {
  take: string
  skip: string
  tagId: string
  keyword: string
}

function isSafeKeyword(keyword: string): boolean {
  if (!keyword) return false;

  const safePattern = /^[가-힣a-zA-Z0-9_-]+$/;
  if (!safePattern.test(keyword)) {
    return false;
  }

  const lowerKeyword = keyword.toLowerCase();

  const sqlKeywords = [
    "select", "insert", "update", "delete", "drop", "truncate",
    "alter", "create", "exec", "union", "from", "where", "or", "and",
    "--", ";", "'", "\"", "`", "/*", "*/", "xp_"
  ];

  for (const word of sqlKeywords) {
    if (lowerKeyword.includes(word)) {
      return false;
    }
  }

  return true;
}

function parseParams({take, skip, tagId, keyword}: Partial<RawParams>) {
  if (!take || !skip) {
    throw Error('take and skip 쿼리 파라미터가 필요합니다.')
  }

  if (keyword && !isSafeKeyword(keyword)) {
    throw Error(`안전하지 않은 Keyword: ${keyword}`)
  }

  return {
    take : parseInt(take),
    skip : parseInt(skip),
    tagId : tagId ? parseInt(tagId) : undefined,
    keyword
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {take, skip, tagId, keyword} = parseParams(req.query);
  const {sellers, totalCount} = await getSellers(take, skip, tagId, keyword)

  res.status(200).json({sellers, totalCount});
}

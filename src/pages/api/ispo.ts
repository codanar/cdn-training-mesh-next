import type { NextApiRequest, NextApiResponse } from 'next'
const Blockfrost = require("@blockfrost/blockfrost-js");
 
const API = new Blockfrost.BlockFrostAPI({
  projectId: "", // see: https://blockfrost.io
});

type ResponseData = {
  message: string
}
 
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const poolId = 'pool13la5erny3srx9u4fz9tujtl2490350f89r4w4qjhk0vdjmuv78v' // margin 100%

  const stakeAddress = 'stake_test1uqmfrg5j6cduzrnj75ypw6pa0nle5tm640rg9xas4xjdt0skcynn2'

  const [latestBlock, poolsById, poolsByIdDelegators, accountsHistoryAll] = await Promise.all([
    API.blocksLatest(), // current tip
    API.poolsById(poolId), // total active stake
    API.poolsByIdDelegators(poolId, {page: 4}), // stake key (collect at the end of epoch)
    API.accountsHistoryAll(stakeAddress) // active stake
  ])

  // active stake / total active stake
  // summation => 100%?
  // rewards allocation

  const output: any = {
    latestBlock: latestBlock,
    poolsById: poolsById,
    poolsByIdDelegators: poolsByIdDelegators,
    accountsHistoryAll: accountsHistoryAll
  }
  
  res.status(200).json(output)
}